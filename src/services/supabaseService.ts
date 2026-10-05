import { supabase, isSupabaseConfigured, getSupabase } from '../lib/supabaseClient';
import { 
  User, 
  Item, 
  BorrowRequest, 
  Conversation, 
  Message, 
  Review, 
  NeedRequest, 
  AppNotification, 
  Category, 
  CampusLocation, 
  ItemCondition, 
  ItemStatus,
  BookedDateRange
} from '../types';

/**
 * Service providing full CRUD, Realtime, and Storage operations
 * backed by Supabase with automatic fallbacks.
 */
export const SupabaseService = {
  /**
   * Check if Supabase connection is healthy and tables are ready
   */
  async checkConnection(): Promise<{ connected: boolean; tablesReady: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { connected: false, tablesReady: false, error: 'Supabase credentials not configured' };
    }

    try {
      const { data, error } = await supabase.from('items').select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.message.includes('schema cache')) {
          return { connected: true, tablesReady: false, error: 'Database tables not yet created. Run supabase/schema.sql in Supabase SQL Editor.' };
        }
        return { connected: true, tablesReady: false, error: error.message };
      }
      return { connected: true, tablesReady: true };
    } catch (err: any) {
      return { connected: false, tablesReady: false, error: err?.message || 'Connection failed' };
    }
  },

  // ============================================================================
  // PROFILES & AUTH
  // ============================================================================

  async getProfile(userId: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone || undefined,
      university: data.university,
      bio: data.bio || undefined,
      avatarUrl: data.avatar_url,
      rating: Number(data.rating) || 5.0,
      points: Number(data.points) || 20,
      rank: data.rank,
      itemsLent: Number(data.items_lent) || 0,
      itemsBorrowed: Number(data.items_borrowed) || 0,
      successfulReturns: Number(data.successful_returns) || 0,
      onTimeReturnRate: Number(data.on_time_return_rate) || 100,
      isUniversityVerified: Boolean(data.is_university_verified),
      createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    };
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    if (!supabase) return null;

    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.university !== undefined) dbUpdates.university = updates.university;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.isUniversityVerified !== undefined) dbUpdates.is_university_verified = updates.isUniversityVerified;
    if (updates.points !== undefined) dbUpdates.points = updates.points;
    if (updates.rank !== undefined) dbUpdates.rank = updates.rank;

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !data) return null;
    return this.getProfile(userId);
  },

  async addPoints(userId: string, pointsToAdd: number, reason?: string): Promise<void> {
    if (!supabase) return;
    const profile = await this.getProfile(userId);
    if (!profile) return;

    const newPoints = profile.points + pointsToAdd;
    let newRank = profile.rank;
    if (newPoints >= 500) newRank = 'Campus Legend';
    else if (newPoints >= 350) newRank = 'Super Buddy';
    else if (newPoints >= 150) newRank = 'Helpful Buddy';

    await supabase
      .from('profiles')
      .update({ points: newPoints, rank: newRank, updated_at: new Date().toISOString() })
      .eq('id', userId);
  },

  // ============================================================================
  // CATEGORIES
  // ============================================================================

  async getCategories(): Promise<Category[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) return [];

    return data.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      slug: c.slug,
      description: c.description || '',
      itemCount: c.item_count || 0
    }));
  },

  // ============================================================================
  // ITEMS
  // ============================================================================

  async getItems(): Promise<Item[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:profiles!items_owner_id_fkey(id, full_name, avatar_url, rating),
        category:categories!items_category_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    // Also fetch active/accepted booked date ranges
    const { data: bookedRanges } = await supabase
      .from('borrow_requests')
      .select('id, item_id, start_date, end_date, borrower_id, status')
      .in('status', ['Accepted', 'Active', 'Upcoming']);

    const bookedMap = new Map<string, BookedDateRange[]>();
    if (bookedRanges) {
      for (const br of bookedRanges) {
        const list = bookedMap.get(br.item_id) || [];
        list.push({
          startDate: br.start_date,
          endDate: br.end_date,
          borrowerId: br.borrower_id,
          requestId: br.id
        });
        bookedMap.set(br.item_id, list);
      }
    }

    return data.map(i => ({
      id: i.id,
      ownerId: i.owner_id,
      ownerName: i.owner?.full_name || 'Campus Student',
      ownerAvatar: i.owner?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      ownerRating: Number(i.owner?.rating) || 5.0,
      title: i.title,
      categoryId: i.category_id,
      categoryName: i.category?.name || 'College Essentials',
      description: i.description,
      condition: i.condition as ItemCondition,
      status: i.status as ItemStatus,
      borrowFee: Number(i.borrow_fee) || 0,
      deposit: Number(i.deposit) || 0,
      estimatedRetailPrice: Number(i.estimated_retail_price) || 800,
      pickupLocation: i.pickup_location as CampusLocation,
      images: i.images && i.images.length > 0 ? i.images : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
      bookedDateRanges: bookedMap.get(i.id) || [],
      views: i.views || 0,
      borrowCount: i.borrow_count || 0,
      isUrgentSOS: Boolean(i.is_urgent_sos),
      circleId: i.circle_id || undefined,
      createdAt: i.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  },

  async getItemById(id: string): Promise<Item | null> {
    const items = await this.getItems();
    return items.find(i => i.id === id) || null;
  },

  async createItem(item: Omit<Item, 'id' | 'views' | 'borrowCount' | 'createdAt' | 'bookedDateRanges'>): Promise<Item> {
    const client = getSupabase();

    const insertData = {
      owner_id: item.ownerId,
      category_id: item.categoryId,
      title: item.title,
      description: item.description,
      condition: item.condition,
      status: item.status || 'Available',
      borrow_fee: item.borrowFee,
      deposit: item.deposit,
      estimated_retail_price: item.estimatedRetailPrice,
      pickup_location: item.pickupLocation,
      images: item.images,
      is_urgent_sos: Boolean(item.isUrgentSOS),
      circle_id: item.circleId || null,
    };

    const { data, error } = await client
      .from('items')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to publish item to Supabase.');
    }

    // Award +10 points for listing
    await this.addPoints(item.ownerId, 10, 'listing a college item');

    const created = await this.getItemById(data.id);
    if (!created) {
      throw new Error('Item created but failed to retrieve record.');
    }
    return created;
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<void> {
    const client = getSupabase();
    const dbUpdates: any = { updated_at: new Date().toISOString() };

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.borrowFee !== undefined) dbUpdates.borrow_fee = updates.borrowFee;
    if (updates.deposit !== undefined) dbUpdates.deposit = updates.deposit;
    if (updates.pickupLocation !== undefined) dbUpdates.pickup_location = updates.pickupLocation;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.isUrgentSOS !== undefined) dbUpdates.is_urgent_sos = updates.isUrgentSOS;

    const { error } = await client
      .from('items')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async deleteItem(id: string): Promise<void> {
    const client = getSupabase();
    const { error } = await client.from('items').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async incrementItemViews(id: string): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.rpc('increment_item_views', { item_row_id: id });
    } catch {
      // Fallback: simple update
      const { data } = await supabase.from('items').select('views').eq('id', id).single();
      if (data) {
        await supabase.from('items').update({ views: (data.views || 0) + 1 }).eq('id', id);
      }
    }
  },

  // ============================================================================
  // IMAGE STORAGE UPLOAD
  // ============================================================================

  async uploadItemImage(file: File, userId: string): Promise<string> {
    const client = getSupabase();

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be smaller than 5 MB.');
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, WEBP, and GIF images are supported.');
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { error: uploadError } = await client.storage
      .from('item-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = client.storage
      .from('item-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  // ============================================================================
  // BORROW REQUESTS
  // ============================================================================

  async getRequests(): Promise<BorrowRequest[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('borrow_requests')
      .select(`
        *,
        item:items!borrow_requests_item_id_fkey(id, title, images),
        borrower:profiles!borrow_requests_borrower_id_fkey(id, full_name, avatar_url, rating, items_borrowed),
        owner:profiles!borrow_requests_owner_id_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(r => ({
      id: r.id,
      itemId: r.item_id,
      itemTitle: r.item?.title || 'College Item',
      itemImage: r.item?.images?.[0] || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      borrowerId: r.borrower_id,
      borrowerName: r.borrower?.full_name || 'Student Borrower',
      borrowerAvatar: r.borrower?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      borrowerRating: Number(r.borrower?.rating) || 5.0,
      borrowerHistoryCount: Number(r.borrower?.items_borrowed) || 0,
      ownerId: r.owner_id,
      ownerName: r.owner?.full_name || 'Student Lender',
      startDate: r.start_date,
      endDate: r.end_date,
      durationDays: r.duration_days,
      message: r.message || undefined,
      borrowFee: Number(r.borrow_fee) || 0,
      deposit: Number(r.deposit) || 0,
      totalAmount: Number(r.total_amount) || 0,
      status: r.status,
      createdAt: r.created_at,
      acceptedAt: r.accepted_at || undefined,
      returnedAt: r.returned_at || undefined,
      borrowerRated: Boolean(r.borrower_rated),
      ownerRated: Boolean(r.owner_rated),
    }));
  },

  async createBorrowRequest(data: {
    itemId: string;
    borrowerId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }): Promise<BorrowRequest> {
    const client = getSupabase();
    const item = await this.getItemById(data.itemId);
    if (!item) throw new Error('Item not found');

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const durationDays = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalAmount = item.borrowFee + item.deposit;

    const { data: newReq, error } = await client
      .from('borrow_requests')
      .insert({
        item_id: item.id,
        borrower_id: data.borrowerId,
        owner_id: item.ownerId,
        start_date: data.startDate,
        end_date: data.endDate,
        duration_days: durationDays,
        message: data.message || null,
        borrow_fee: item.borrowFee,
        deposit: item.deposit,
        total_amount: totalAmount,
        status: 'Pending',
      })
      .select()
      .single();

    if (error || !newReq) {
      throw new Error(error?.message || 'Failed to submit borrow request.');
    }

    // Send notification to owner
    await client.from('notifications').insert({
      user_id: item.ownerId,
      type: 'borrow_request',
      title: 'New Borrow Request 📥',
      message: `A student wants to borrow "${item.title}" for ${durationDays} day(s).`,
      link: '/requests'
    });

    const all = await this.getRequests();
    return all.find(r => r.id === newReq.id)!;
  },

  async acceptBorrowRequest(requestId: string): Promise<void> {
    const client = getSupabase();
    const reqs = await this.getRequests();
    const req = reqs.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    // 1. Update request status
    const { error: reqError } = await client
      .from('borrow_requests')
      .update({
        status: 'Accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (reqError) throw new Error(reqError.message);

    // 2. Mark item as borrowed
    await client
      .from('items')
      .update({
        status: 'Borrowed',
        borrow_count: (req.borrowFee || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.itemId);

    // 3. Ensure conversation exists
    const conv = await this.getOrCreateConversation(req.itemId, req.borrowerId, req.ownerId);

    // 4. Send automated greeting message
    await this.sendMessage(
      conv.id,
      req.ownerId,
      `Hi ${req.borrowerName}! I accepted your request for "${req.itemTitle}". Let's arrange pickup at campus!`
    );

    // 5. Notify borrower
    await client.from('notifications').insert({
      user_id: req.borrowerId,
      type: 'request_accepted',
      title: 'Request Accepted! 🎉',
      message: `${req.ownerName} accepted your request for "${req.itemTitle}". Open chat to coordinate pickup!`,
      link: '/messages'
    });

    // 6. Award +20 points to owner for lending
    await this.addPoints(req.ownerId, 20, 'approving borrow request');
  },

  async rejectBorrowRequest(requestId: string): Promise<void> {
    const client = getSupabase();
    const reqs = await this.getRequests();
    const req = reqs.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const { error } = await client
      .from('borrow_requests')
      .update({
        status: 'Rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw new Error(error.message);

    await client.from('notifications').insert({
      user_id: req.borrowerId,
      type: 'request_rejected',
      title: 'Request Declined',
      message: `${req.ownerName} was unable to accept your request for "${req.itemTitle}".`,
      link: '/explore'
    });
  },

  async markAsReturned(requestId: string): Promise<void> {
    const client = getSupabase();
    const reqs = await this.getRequests();
    const req = reqs.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const nowIso = new Date().toISOString();

    // 1. Update request status
    await client
      .from('borrow_requests')
      .update({
        status: 'Returned',
        returned_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', requestId);

    // 2. Make item available again
    await client
      .from('items')
      .update({
        status: 'Available',
        updated_at: nowIso,
      })
      .eq('id', req.itemId);

    // 3. Award points: +15 points to borrower for returning on time
    await this.addPoints(req.borrowerId, 15, 'on-time return');

    // 4. Update transaction counters on profiles
    const borrower = await this.getProfile(req.borrowerId);
    if (borrower) {
      await client.from('profiles').update({
        items_borrowed: borrower.itemsBorrowed + 1,
        successful_returns: borrower.successfulReturns + 1,
      }).eq('id', borrower.id);
    }

    const lender = await this.getProfile(req.ownerId);
    if (lender) {
      await client.from('profiles').update({
        items_lent: lender.itemsLent + 1,
      }).eq('id', lender.id);
    }

    // 5. Send notifications
    await client.from('notifications').insert([
      {
        user_id: req.ownerId,
        type: 'successful_return',
        title: 'Item Returned! 📦',
        message: `"${req.itemTitle}" has been marked as returned. Please rate ${req.borrowerName}.`,
        link: '/my-listings'
      },
      {
        user_id: req.borrowerId,
        type: 'successful_return',
        title: 'Return Complete! ✅',
        message: `Thank you for returning "${req.itemTitle}". +15 points earned!`,
        link: '/my-borrowings'
      }
    ]);
  },

  // ============================================================================
  // CONVERSATIONS & CHAT
  // ============================================================================

  async getConversations(): Promise<Conversation[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        item:items!conversations_item_id_fkey(id, title, images),
        borrower:profiles!conversations_borrower_id_fkey(id, full_name, avatar_url),
        owner:profiles!conversations_owner_id_fkey(id, full_name, avatar_url)
      `)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];

    return data.map(c => ({
      id: c.id,
      itemId: c.item_id,
      itemTitle: c.item?.title || 'College Item',
      itemImage: c.item?.images?.[0] || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      borrowerId: c.borrower_id,
      borrowerName: c.borrower?.full_name || 'Borrower',
      borrowerAvatar: c.borrower?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      ownerId: c.owner_id,
      ownerName: c.owner?.full_name || 'Owner',
      ownerAvatar: c.owner?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      lastMessage: c.last_message || 'Chat started',
      lastMessageTimestamp: c.last_message_timestamp || c.created_at,
      unreadCount: c.unread_count || 0,
      isBlocked: Boolean(c.is_blocked),
    }));
  },

  async getOrCreateConversation(itemId: string, borrowerId: string, ownerId: string): Promise<Conversation> {
    const client = getSupabase();

    // Check existing
    const { data: existing } = await client
      .from('conversations')
      .select('id')
      .eq('item_id', itemId)
      .eq('borrower_id', borrowerId)
      .eq('owner_id', ownerId)
      .maybeSingle();

    if (existing) {
      const convs = await this.getConversations();
      return convs.find(c => c.id === existing.id)!;
    }

    // Create new
    const { data: created, error } = await client
      .from('conversations')
      .insert({
        item_id: itemId,
        borrower_id: borrowerId,
        owner_id: ownerId,
        last_message: 'Conversation started',
        last_message_timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !created) {
      throw new Error(error?.message || 'Failed to create conversation.');
    }

    const all = await this.getConversations();
    return all.find(c => c.id === created.id)!;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, full_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map(m => ({
      id: m.id,
      conversationId: m.conversation_id,
      senderId: m.sender_id,
      senderName: m.sender?.full_name || 'Campus Student',
      text: m.message,
      timestamp: m.created_at,
      isRead: Boolean(m.is_read),
    }));
  },

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const client = getSupabase();
    const sender = await this.getProfile(senderId);

    const { data, error } = await client
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        message: text.trim(),
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || 'Failed to send message.');

    // Update conversation last message
    await client
      .from('conversations')
      .update({
        last_message: text.trim(),
        last_message_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return {
      id: data.id,
      conversationId,
      senderId,
      senderName: sender?.fullName || 'Campus Student',
      text: text.trim(),
      timestamp: data.created_at,
      isRead: false
    };
  },

  subscribeToMessages(conversationId: string, callback: (msg: Message) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const sender = await this.getProfile(payload.new.sender_id);
          callback({
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            senderId: payload.new.sender_id,
            senderName: sender?.fullName || 'Campus Student',
            text: payload.new.message,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read
          });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },

  // ============================================================================
  // WISHLIST
  // ============================================================================

  async getWishlist(userId: string): Promise<string[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('wishlists')
      .select('item_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map(w => w.item_id);
  },

  async toggleWishlist(userId: string, itemId: string): Promise<boolean> {
    const client = getSupabase();

    const { data: existing } = await client
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing) {
      await client.from('wishlists').delete().eq('id', existing.id);
      return false; // Removed
    } else {
      await client.from('wishlists').insert({ user_id: userId, item_id: itemId });
      return true; // Added
    }
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(n => ({
      id: n.id,
      userId: n.user_id,
      type: n.type as any,
      title: n.title,
      message: n.message,
      link: n.link || undefined,
      read: Boolean(n.read),
      createdAt: n.created_at
    }));
  },

  async markNotificationAsRead(id: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  },

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
  },

  subscribeToNotifications(userId: string, callback: (notif: AppNotification) => void) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`notifs:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback({
            id: payload.new.id,
            userId: payload.new.user_id,
            type: payload.new.type,
            title: payload.new.title,
            message: payload.new.message,
            link: payload.new.link || undefined,
            read: payload.new.read,
            createdAt: payload.new.created_at
          });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },

  // ============================================================================
  // REVIEWS
  // ============================================================================

  async getReviews(): Promise<Review[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url),
        item:items!reviews_item_id_fkey(id, title)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(r => ({
      id: r.id,
      reviewerId: r.reviewer_id,
      reviewerName: r.reviewer?.full_name || 'Student Reviewer',
      reviewerAvatar: r.reviewer?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      revieweeId: r.reviewee_id,
      itemId: r.item_id,
      itemTitle: r.item?.title || 'College Item',
      rating: Number(r.rating),
      categories: {
        condition: r.condition_rating || 5,
        communication: r.communication_rating || 5,
        timelyReturn: r.timely_return_rating || 5
      },
      comment: r.comment,
      createdAt: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      role: r.role as 'borrower' | 'lender'
    }));
  },

  async submitReview(data: {
    requestId: string;
    reviewerId: string;
    revieweeId: string;
    itemId: string;
    itemTitle: string;
    rating: number;
    categories: { condition: number; communication: number; timelyReturn: number };
    comment: string;
    role: 'borrower' | 'lender';
  }): Promise<void> {
    const client = getSupabase();

    // 1. Insert review
    const { error } = await client.from('reviews').insert({
      request_id: data.requestId,
      reviewer_id: data.reviewerId,
      reviewee_id: data.revieweeId,
      item_id: data.itemId,
      rating: data.rating,
      condition_rating: data.categories.condition,
      communication_rating: data.categories.communication,
      timely_return_rating: data.categories.timelyReturn,
      comment: data.comment,
      role: data.role
    });

    if (error) throw new Error(error.message);

    // 2. Mark request as rated
    const updateField = data.role === 'borrower' ? { borrower_rated: true } : { owner_rated: true };
    await client.from('borrow_requests').update(updateField).eq('id', data.requestId);

    // 3. Recalculate target user average rating
    const { data: allReviews } = await client
      .from('reviews')
      .select('rating')
      .eq('reviewee_id', data.revieweeId);

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length;
      await client
        .from('profiles')
        .update({ rating: parseFloat(avg.toFixed(1)) })
        .eq('id', data.revieweeId);
    }

    // 4. Award +5 points to reviewer
    await this.addPoints(data.reviewerId, 5, 'writing a review');

    // 5. Notify reviewee
    await client.from('notifications').insert({
      user_id: data.revieweeId,
      type: 'new_review',
      title: 'New Peer Review Received! ⭐',
      message: `You received a ${data.rating}★ rating for "${data.itemTitle}".`,
      link: '/profile'
    });
  },

  // ============================================================================
  // NEED REQUESTS (COMMUNITY ASK)
  // ============================================================================

  async getNeedRequests(): Promise<NeedRequest[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('need_requests')
      .select(`
        *,
        user:profiles!need_requests_user_id_fkey(id, full_name, avatar_url, rating, university),
        category:categories!need_requests_category_id_fkey(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(n => ({
      id: n.id,
      userId: n.user_id,
      userName: n.user?.full_name || 'Campus Student',
      userAvatar: n.user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      userRating: Number(n.user?.rating) || 5.0,
      university: n.user?.university || 'XYZ Institute of Technology',
      title: n.title,
      categoryId: n.category_id,
      categoryName: n.category?.name || 'General',
      requiredDate: n.required_date,
      duration: n.duration,
      pickupLocation: n.pickup_location as CampusLocation,
      description: n.description,
      status: n.status,
      offersCount: n.offers_count || 0,
      createdAt: n.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  },

  async createNeedRequest(data: {
    userId: string;
    title: string;
    categoryId: string;
    requiredDate: string;
    duration: string;
    pickupLocation: CampusLocation;
    description: string;
  }): Promise<void> {
    const client = getSupabase();

    const { error } = await client.from('need_requests').insert({
      user_id: data.userId,
      category_id: data.categoryId,
      title: data.title.trim(),
      required_date: data.requiredDate,
      duration: data.duration,
      pickup_location: data.pickupLocation,
      description: data.description.trim(),
      status: 'Open'
    });

    if (error) throw new Error(error.message);
  },

  async offerToNeed(needRequestId: string, helperUser: User, note: string): Promise<void> {
    const client = getSupabase();

    const { data: need } = await client
      .from('need_requests')
      .select('id, user_id, title, offers_count')
      .eq('id', needRequestId)
      .single();

    if (!need) throw new Error('Need request not found');

    // Increment offers count
    await client
      .from('need_requests')
      .update({ offers_count: (need.offers_count || 0) + 1 })
      .eq('id', needRequestId);

    // Send notification to student who posted the need
    await client.from('notifications').insert({
      user_id: need.user_id,
      type: 'need_offer',
      title: 'New Item Offer! 🤝',
      message: `${helperUser.fullName} offered to lend an item for your request: "${need.title}". "${note}"`,
      link: '/messages'
    });
  }
};
