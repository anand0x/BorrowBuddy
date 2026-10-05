import { 
  User, Item, BorrowRequest, Conversation, Message, 
  AppNotification, NeedRequest, BuddyCircle, Review, DisputeReport, UserRank 
} from '../types';
import { 
  MOCK_USERS, CATEGORIES, MOCK_ITEMS, MOCK_REQUESTS, 
  MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, 
  MOCK_NEED_REQUESTS, MOCK_CIRCLES, MOCK_REVIEWS, IMPACT_METRICS 
} from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { SupabaseService } from './supabaseService';

const STORAGE_KEYS = {
  CURRENT_USER: 'bb_current_user',
  ALL_USERS: 'bb_users',
  ITEMS: 'bb_items',
  REQUESTS: 'bb_requests',
  CONVERSATIONS: 'bb_conversations',
  MESSAGES: 'bb_messages',
  NOTIFICATIONS: 'bb_notifications',
  NEED_REQUESTS: 'bb_need_requests',
  CIRCLES: 'bb_circles',
  REVIEWS: 'bb_reviews',
  WISHLIST: 'bb_wishlist',
  DISPUTES: 'bb_disputes',
  IMPACT: 'bb_impact'
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export function calculateRank(points: number): UserRank {
  if (points >= 500) return 'Campus Legend';
  if (points >= 350) return 'Super Buddy';
  if (points >= 150) return 'Helpful Buddy';
  return 'New Buddy';
}

export const StorageService = {
  // Initialization
  initStorage() {
    getFromStorage(STORAGE_KEYS.ALL_USERS, MOCK_USERS);
    getFromStorage(STORAGE_KEYS.ITEMS, MOCK_ITEMS);
    getFromStorage(STORAGE_KEYS.REQUESTS, MOCK_REQUESTS);
    getFromStorage(STORAGE_KEYS.CONVERSATIONS, MOCK_CONVERSATIONS);
    getFromStorage(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    getFromStorage(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    getFromStorage(STORAGE_KEYS.NEED_REQUESTS, MOCK_NEED_REQUESTS);
    getFromStorage(STORAGE_KEYS.CIRCLES, MOCK_CIRCLES);
    getFromStorage(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
    getFromStorage(STORAGE_KEYS.WISHLIST, ['item-8']);
    getFromStorage(STORAGE_KEYS.DISPUTES, [] as DisputeReport[]);
    getFromStorage(STORAGE_KEYS.IMPACT, IMPACT_METRICS);
    
    // Set default user if not logged in
    const current = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!current) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
    }
  },

  async syncWithSupabase() {
    if (!isSupabaseConfigured) return;
    try {
      const health = await SupabaseService.checkConnection();
      if (!health.connected || !health.tablesReady) return;

      // 1. Sync remote items into storage cache
      const remoteItems = await SupabaseService.getItems();
      if (remoteItems && remoteItems.length > 0) {
        saveToStorage(STORAGE_KEYS.ITEMS, remoteItems);
      }

      // 2. Sync need requests
      const remoteNeeds = await SupabaseService.getNeedRequests();
      if (remoteNeeds && remoteNeeds.length > 0) {
        saveToStorage(STORAGE_KEYS.NEED_REQUESTS, remoteNeeds);
      }

      // 3. User specific sync
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id) {
        const remoteRequests = await SupabaseService.getRequests();
        if (remoteRequests && remoteRequests.length > 0) {
          saveToStorage(STORAGE_KEYS.REQUESTS, remoteRequests);
        }

        const remoteNotifs = await SupabaseService.getNotifications(currentUser.id);
        if (remoteNotifs && remoteNotifs.length > 0) {
          saveToStorage(STORAGE_KEYS.NOTIFICATIONS, remoteNotifs);
        }

        const remoteWishlist = await SupabaseService.getWishlist(currentUser.id);
        if (remoteWishlist && remoteWishlist.length > 0) {
          saveToStorage(STORAGE_KEYS.WISHLIST, remoteWishlist);
        }

        const remoteConvs = await SupabaseService.getConversations();
        if (remoteConvs && remoteConvs.length > 0) {
          saveToStorage(STORAGE_KEYS.CONVERSATIONS, remoteConvs);
        }
      }
    } catch (e) {
      console.warn('Supabase sync notice:', e);
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(MOCK_ITEMS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(MOCK_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(MOCK_CONVERSATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.NEED_REQUESTS, JSON.stringify(MOCK_NEED_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(MOCK_CIRCLES));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(['item-8']));
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(IMPACT_METRICS));
  },

  // Auth & Users
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getAllUsers(): User[] {
    return getFromStorage(STORAGE_KEYS.ALL_USERS, MOCK_USERS);
  },

  getUserById(id: string): User | undefined {
    return this.getAllUsers().find(u => u.id === id);
  },

  updateUser(updated: Partial<User> & { id: string }): User {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updated.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updated };
      if (updated.points !== undefined) {
        users[index].rank = calculateRank(users[index].points);
      }
      saveToStorage(STORAGE_KEYS.ALL_USERS, users);
      
      const current = this.getCurrentUser();
      if (current && current.id === updated.id) {
        this.setCurrentUser(users[index]);
      }

      if (isSupabaseConfigured) {
        SupabaseService.updateProfile(updated.id, updated)
          .catch((err: any) => console.warn('Supabase updateUser sync notice:', err));
      }

      return users[index];
    }
    
    // If not found in local array, create entry
    const newUser: User = {
      fullName: 'BorrowBuddy Member',
      email: '',
      university: 'XYZ Institute of Technology',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updated.id)}`,
      rating: 5.0,
      points: 20,
      rank: calculateRank(updated.points ?? 20),
      itemsLent: 0,
      itemsBorrowed: 0,
      successfulReturns: 0,
      onTimeReturnRate: 100,
      isUniversityVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      ...updated,
      id: updated.id,
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.ALL_USERS, users);
    return newUser;
  },

  addPoints(userId: string, points: number, reason: string): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    const newPoints = user.points + points;
    const updated = this.updateUser({ id: userId, points: newPoints });

    this.addNotification({
      userId,
      type: 'successful_return',
      title: `+${points} BorrowBuddy Points! 🌟`,
      message: `You earned ${points} points for ${reason}. Current rank: ${updated.rank}.`,
      link: '/profile'
    });

    if (isSupabaseConfigured) {
      SupabaseService.addPoints(userId, points, reason)
        .catch((err: any) => console.warn('Supabase addPoints sync notice:', err));
    }

    return updated;
  },

  // Items
  getItems(): Item[] {
    return getFromStorage(STORAGE_KEYS.ITEMS, MOCK_ITEMS);
  },

  getItemById(id: string): Item | undefined {
    return this.getItems().find(i => i.id === id);
  },

  addItem(item: Omit<Item, 'id' | 'views' | 'borrowCount' | 'createdAt' | 'bookedDateRanges'>): Item {
    const items = this.getItems();
    const newItem: Item = {
      ...item,
      id: `item-${Date.now()}`,
      views: 1,
      borrowCount: 0,
      bookedDateRanges: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.ITEMS, items);

    // Gamification: +10 points for listing an item
    this.addPoints(item.ownerId, 10, 'listing a college item');

    // Supabase background sync
    if (isSupabaseConfigured) {
      SupabaseService.createItem(item).then(remoteItem => {
        if (remoteItem) {
          const current = this.getItems();
          const idx = current.findIndex(i => i.id === newItem.id);
          if (idx >= 0) {
            current[idx] = remoteItem;
            saveToStorage(STORAGE_KEYS.ITEMS, current);
          }
        }
      }).catch((err: any) => console.warn('Supabase createItem notice:', err));
    }

    return newItem;
  },

  updateItem(id: string, updates: Partial<Item>): Item {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === id);
    if (index >= 0) {
      items[index] = { ...items[index], ...updates };
      saveToStorage(STORAGE_KEYS.ITEMS, items);
      return items[index];
    }
    throw new Error('Item not found');
  },

  deleteItem(id: string): void {
    const items = this.getItems().filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.ITEMS, items);
  },

  incrementItemViews(id: string): void {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      saveToStorage(STORAGE_KEYS.ITEMS, items);
    }
  },

  // Availability & Date Conflict Checking
  isDateRangeAvailable(itemId: string, startDate: string, endDate: string): boolean {
    const item = this.getItemById(itemId);
    if (!item) return false;
    if (item.status === 'Unavailable') return false;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start > end) return false;

    // Check against active/approved booked ranges
    for (const range of item.bookedDateRanges) {
      const bookedStart = new Date(range.startDate).getTime();
      const bookedEnd = new Date(range.endDate).getTime();
      // Overlap condition: start <= bookedEnd && end >= bookedStart
      if (start <= bookedEnd && end >= bookedStart) {
        return false;
      }
    }
    return true;
  },

  // Borrow Requests
  getRequests(): BorrowRequest[] {
    return getFromStorage(STORAGE_KEYS.REQUESTS, MOCK_REQUESTS);
  },

  getRequestById(id: string): BorrowRequest | undefined {
    return this.getRequests().find(r => r.id === id);
  },

  createBorrowRequest(data: {
    itemId: string;
    borrowerId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }): BorrowRequest {
    const item = this.getItemById(data.itemId);
    const borrower = this.getUserById(data.borrowerId);
    if (!item || !borrower) throw new Error('Item or Borrower not found');

    if (!this.isDateRangeAvailable(data.itemId, data.startDate, data.endDate)) {
      throw new Error('The selected dates conflict with an existing reservation.');
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalAmount = item.borrowFee + item.deposit;

    const newRequest: BorrowRequest = {
      id: `req-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0] || '',
      borrowerId: borrower.id,
      borrowerName: borrower.fullName,
      borrowerAvatar: borrower.avatarUrl,
      borrowerRating: borrower.rating,
      borrowerHistoryCount: borrower.itemsBorrowed,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      startDate: data.startDate,
      endDate: data.endDate,
      durationDays,
      message: data.message,
      borrowFee: item.borrowFee,
      deposit: item.deposit,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const requests = this.getRequests();
    requests.unshift(newRequest);
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);

    // Notify owner
    this.addNotification({
      userId: item.ownerId,
      type: 'borrow_request',
      title: 'New Borrow Request 📥',
      message: `${borrower.fullName} wants to borrow "${item.title}" for ${durationDays} day(s).`,
      link: '/requests',
    });

    // Supabase background sync
    if (isSupabaseConfigured) {
      SupabaseService.createBorrowRequest({
        itemId: data.itemId,
        borrowerId: data.borrowerId,
        startDate: data.startDate,
        endDate: data.endDate,
        message: data.message
      }).then(remoteReq => {
        if (remoteReq) {
          const current = this.getRequests();
          const idx = current.findIndex(r => r.id === newRequest.id);
          if (idx >= 0) {
            current[idx] = remoteReq;
            saveToStorage(STORAGE_KEYS.REQUESTS, current);
          }
        }
      }).catch((err: any) => console.warn('Supabase createBorrowRequest notice:', err));
    }

    return newRequest;
  },

  acceptBorrowRequest(requestId: string): BorrowRequest {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.status = 'Accepted';
    req.acceptedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);

    // Lock item calendar
    const items = this.getItems();
    const item = items.find(i => i.id === req.itemId);
    if (item) {
      item.bookedDateRanges.push({
        startDate: req.startDate,
        endDate: req.endDate,
        borrowerId: req.borrowerId,
        requestId: req.id
      });
      item.status = 'Borrowed';
      item.borrowCount = (item.borrowCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.ITEMS, items);
    }

    // Automatically create conversation
    const conv = this.getOrCreateConversation(req.itemId, req.borrowerId, req.ownerId);

    // Send initial automated chat message
    this.sendMessage({
      conversationId: conv.id,
      senderId: req.ownerId,
      senderName: req.ownerName,
      text: `Hi ${req.borrowerName}! I accepted your request for "${req.itemTitle}". Let's arrange pickup at ${item?.pickupLocation || 'Central Library'}.`
    });

    // Notify borrower
    this.addNotification({
      userId: req.borrowerId,
      type: 'request_accepted',
      title: 'Request Accepted! 🎉',
      message: `${req.ownerName} accepted your request for "${req.itemTitle}". Open chat to coordinate pickup!`,
      link: '/messages'
    });

    // Gamification points for owner: +20 points
    this.addPoints(req.ownerId, 20, 'successfully approving a borrowing request');

    // Supabase sync
    if (isSupabaseConfigured) {
      SupabaseService.acceptBorrowRequest(requestId)
        .catch((err: any) => console.warn('Supabase acceptBorrowRequest notice:', err));
    }

    return req;
  },

  rejectBorrowRequest(requestId: string): BorrowRequest {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.status = 'Rejected';
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);

    // Notify borrower
    this.addNotification({
      userId: req.borrowerId,
      type: 'request_rejected',
      title: 'Request Declined',
      message: `${req.ownerName} was unable to accept your request for "${req.itemTitle}".`,
      link: '/explore'
    });

    // Supabase sync
    if (isSupabaseConfigured) {
      SupabaseService.rejectBorrowRequest(requestId)
        .catch((err: any) => console.warn('Supabase rejectBorrowRequest notice:', err));
    }

    return req;
  },

  markAsReturned(requestId: string): BorrowRequest {
    const requests = this.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    req.status = 'Returned';
    req.returnedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);

    // Free up item
    const items = this.getItems();
    const item = items.find(i => i.id === req.itemId);
    if (item) {
      item.status = 'Available';
      item.bookedDateRanges = item.bookedDateRanges.filter(r => r.requestId !== req.id);
      saveToStorage(STORAGE_KEYS.ITEMS, items);

      // Check if any wishlist subscribers need to be notified
      const wishlist = this.getWishlist();
      if (wishlist.includes(item.id)) {
        this.addNotification({
          userId: req.borrowerId === 'user-1' ? 'user-2' : 'user-1',
          type: 'wishlist_available',
          title: 'Good news! 🎉',
          message: `The "${item.title}" you saved in your wishlist is now available!`,
          link: `/item/${item.id}`
        });
      }
    }

    // Update borrower stats
    const borrower = this.getUserById(req.borrowerId);
    if (borrower) {
      this.updateUser({
        id: borrower.id,
        itemsBorrowed: borrower.itemsBorrowed + 1,
        successfulReturns: borrower.successfulReturns + 1
      });
      // Gamification: +15 points for on-time return
      this.addPoints(borrower.id, 15, 'returning the borrowed item on time');
    }

    // Update lender stats
    const lender = this.getUserById(req.ownerId);
    if (lender) {
      this.updateUser({
        id: lender.id,
        itemsLent: lender.itemsLent + 1
      });
    }

    // Update impact metrics
    const impact = getFromStorage(STORAGE_KEYS.IMPACT, IMPACT_METRICS);
    impact.itemsBorrowed += 1;
    impact.totalSavedINR += item ? (item.estimatedRetailPrice - item.borrowFee) : 800;
    saveToStorage(STORAGE_KEYS.IMPACT, impact);

    // Send notifications
    this.addNotification({
      userId: req.ownerId,
      type: 'successful_return',
      title: 'Item Returned! 📦',
      message: `"${req.itemTitle}" has been marked as returned. Please rate ${req.borrowerName}.`,
      link: '/my-listings'
    });

    this.addNotification({
      userId: req.borrowerId,
      type: 'successful_return',
      title: 'Return Complete! ✅',
      message: `Thank you for returning "${req.itemTitle}". Please rate your experience with ${req.ownerName}.`,
      link: '/my-borrowings'
    });

    // Supabase sync
    if (isSupabaseConfigured) {
      SupabaseService.markAsReturned(requestId)
        .catch((err: any) => console.warn('Supabase markAsReturned notice:', err));
    }

    return req;
  },

  // Wishlist
  getWishlist(): string[] {
    return getFromStorage<string[]>(STORAGE_KEYS.WISHLIST, ['item-8']);
  },

  toggleWishlist(itemId: string): boolean {
    const list = this.getWishlist();
    const index = list.indexOf(itemId);
    let isAdded = false;
    if (index >= 0) {
      list.splice(index, 1);
      isAdded = false;
    } else {
      list.push(itemId);
      isAdded = true;
    }
    saveToStorage(STORAGE_KEYS.WISHLIST, list);

    const currentUser = this.getCurrentUser();
    if (isSupabaseConfigured && currentUser) {
      SupabaseService.toggleWishlist(currentUser.id, itemId)
        .catch((err: any) => console.warn('Supabase toggleWishlist notice:', err));
    }

    return isAdded;
  },

  isInWishlist(itemId: string): boolean {
    return this.getWishlist().includes(itemId);
  },

  // Chat & Messaging
  getConversations(): Conversation[] {
    return getFromStorage(STORAGE_KEYS.CONVERSATIONS, MOCK_CONVERSATIONS);
  },

  getOrCreateConversation(itemId: string, borrowerId: string, ownerId: string): Conversation {
    const convs = this.getConversations();
    const existing = convs.find(c => 
      c.itemId === itemId && 
      ((c.borrowerId === borrowerId && c.ownerId === ownerId) ||
       (c.borrowerId === ownerId && c.ownerId === borrowerId))
    );
    if (existing) return existing;

    const item = this.getItemById(itemId);
    const borrower = this.getUserById(borrowerId);
    const owner = this.getUserById(ownerId);

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      itemId,
      itemTitle: item?.title || 'Campus Item',
      itemImage: item?.images[0] || '',
      borrowerId,
      borrowerName: borrower?.fullName || 'Student',
      borrowerAvatar: borrower?.avatarUrl || '',
      ownerId,
      ownerName: owner?.fullName || 'Student',
      ownerAvatar: owner?.avatarUrl || '',
      lastMessage: 'Conversation started',
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    convs.unshift(newConv);
    saveToStorage(STORAGE_KEYS.CONVERSATIONS, convs);
    return newConv;
  },

  getMessages(conversationId: string): Message[] {
    const all = getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    return all.filter(m => m.conversationId === conversationId);
  },

  sendMessage(data: { conversationId: string; senderId: string; senderName: string; text: string }): Message {
    const all = getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES);
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      text: data.text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    all.push(newMsg);
    saveToStorage(STORAGE_KEYS.MESSAGES, all);

    // Update conversation last message
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === data.conversationId);
    if (conv) {
      conv.lastMessage = data.text;
      conv.lastMessageTimestamp = newMsg.timestamp;
      conv.unreadCount = (conv.unreadCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.CONVERSATIONS, convs);

      const recipientId = conv.borrowerId === data.senderId ? conv.ownerId : conv.borrowerId;
      this.addNotification({
        userId: recipientId,
        type: 'new_message',
        title: `New message from ${data.senderName}`,
        message: data.text.length > 50 ? `${data.text.substring(0, 50)}...` : data.text,
        link: '/messages'
      });
    }

    if (isSupabaseConfigured) {
      SupabaseService.sendMessage(data.conversationId, data.senderId, data.text)
        .catch((err: any) => console.warn('Supabase sendMessage notice:', err));
    }

    return newMsg;
  },

  // Notifications
  getNotifications(userId: string): AppNotification[] {
    const all = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    return all.filter(n => n.userId === userId);
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification {
    const all = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  },

  markNotificationAsRead(id: string): void {
    const all = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    const target = all.find(n => n.id === id);
    if (target) {
      target.read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
    if (isSupabaseConfigured) {
      SupabaseService.markNotificationAsRead(id)
        .catch((err: any) => console.warn('Supabase markNotificationAsRead notice:', err));
    }
  },

  markAllNotificationsAsRead(userId: string): void {
    const all = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    all.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);

    if (isSupabaseConfigured) {
      SupabaseService.markAllNotificationsAsRead(userId)
        .catch((err: any) => console.warn('Supabase markAllNotificationsAsRead notice:', err));
    }
  },

  // Reviews
  getReviews(): Review[] {
    return getFromStorage(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
  },

  getUserReviews(userId: string): Review[] {
    return this.getReviews().filter(r => r.revieweeId === userId);
  },

  submitReview(data: {
    requestId: string;
    reviewerId: string;
    revieweeId: string;
    itemId: string;
    itemTitle: string;
    rating: number;
    categories: { condition: number; communication: number; timelyReturn: number };
    comment: string;
    role: 'borrower' | 'lender';
  }): Review {
    const reviewer = this.getUserById(data.reviewerId);
    if (!reviewer) throw new Error('Reviewer not found');

    const reviews = this.getReviews();
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      reviewerId: data.reviewerId,
      reviewerName: reviewer.fullName,
      reviewerAvatar: reviewer.avatarUrl,
      revieweeId: data.revieweeId,
      itemId: data.itemId,
      itemTitle: data.itemTitle,
      rating: data.rating,
      categories: data.categories,
      comment: data.comment,
      createdAt: new Date().toISOString().split('T')[0],
      role: data.role
    };

    reviews.unshift(newRev);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);

    // Update target user's average rating
    const targetReviews = reviews.filter(r => r.revieweeId === data.revieweeId);
    const avg = targetReviews.reduce((sum, r) => sum + r.rating, 0) / targetReviews.length;
    this.updateUser({
      id: data.revieweeId,
      rating: parseFloat(avg.toFixed(1))
    });

    // Mark request as rated
    const requests = this.getRequests();
    const req = requests.find(r => r.id === data.requestId);
    if (req) {
      if (data.role === 'borrower') req.borrowerRated = true;
      if (data.role === 'lender') req.ownerRated = true;
      saveToStorage(STORAGE_KEYS.REQUESTS, requests);
    }

    // Gamification points: +5 points for writing a review
    this.addPoints(data.reviewerId, 5, 'writing a constructive review');

    // Notify reviewee
    this.addNotification({
      userId: data.revieweeId,
      type: 'new_review',
      title: 'New Review Received ⭐',
      message: `${reviewer.fullName} left you a ${data.rating}★ rating: "${data.comment.substring(0, 40)}..."`,
      link: '/profile'
    });

    if (isSupabaseConfigured) {
      SupabaseService.submitReview({
        requestId: data.requestId,
        reviewerId: data.reviewerId,
        revieweeId: data.revieweeId,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        rating: data.rating,
        categories: data.categories,
        comment: data.comment,
        role: data.role
      }).catch((err: any) => console.warn('Supabase submitReview notice:', err));
    }

    return newRev;
  },

  // Need Requests
  getNeedRequests(): NeedRequest[] {
    return getFromStorage(STORAGE_KEYS.NEED_REQUESTS, MOCK_NEED_REQUESTS);
  },

  addNeedRequest(data: Omit<NeedRequest, 'id' | 'offersCount' | 'createdAt' | 'status'>): NeedRequest {
    const needs = this.getNeedRequests();
    const newNeed: NeedRequest = {
      ...data,
      id: `need-${Date.now()}`,
      status: 'Open',
      offersCount: 0,
      createdAt: new Date().toISOString(),
    };
    needs.unshift(newNeed);
    saveToStorage(STORAGE_KEYS.NEED_REQUESTS, needs);

    if (isSupabaseConfigured) {
      SupabaseService.createNeedRequest({
        userId: data.userId,
        title: data.title,
        categoryId: data.categoryId,
        requiredDate: data.requiredDate,
        duration: data.duration,
        pickupLocation: data.pickupLocation,
        description: data.description
      }).catch((err: any) => console.warn('Supabase createNeedRequest notice:', err));
    }

    return newNeed;
  },

  offerItemToNeed(needId: string, offererUser: User, message: string): void {
    const needs = this.getNeedRequests();
    const need = needs.find(n => n.id === needId);
    if (need) {
      need.offersCount += 1;
      saveToStorage(STORAGE_KEYS.NEED_REQUESTS, needs);

      this.addNotification({
        userId: need.userId,
        type: 'need_offer',
        title: 'New Offer on your Need Request! 🤝',
        message: `${offererUser.fullName} offered to lend an item for "${need.title}": "${message}"`,
        link: '/need-something'
      });
    }

    if (isSupabaseConfigured) {
      SupabaseService.offerToNeed(needId, offererUser, message)
        .catch((err: any) => console.warn('Supabase offerToNeed notice:', err));
    }
  },

  // Buddy Circles
  getCircles(): BuddyCircle[] {
    return getFromStorage(STORAGE_KEYS.CIRCLES, MOCK_CIRCLES);
  },

  // Safety & Disputes
  submitDispute(report: Omit<DisputeReport, 'id' | 'status' | 'createdAt'>): DisputeReport {
    const disputes = getFromStorage<DisputeReport[]>(STORAGE_KEYS.DISPUTES, []);
    const newReport: DisputeReport = {
      ...report,
      id: `disp-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    disputes.unshift(newReport);
    saveToStorage(STORAGE_KEYS.DISPUTES, disputes);
    return newReport;
  },

  getImpactMetrics() {
    return getFromStorage(STORAGE_KEYS.IMPACT, IMPACT_METRICS);
  }
};
