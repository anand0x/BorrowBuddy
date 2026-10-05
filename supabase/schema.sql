-- ==============================================================================
-- BorrowBuddy Complete Supabase Database Schema
-- University Peer-to-Peer College Essentials Borrowing Platform
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1 PROFILES TABLE
-- Linked directly to Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT NOT NULL DEFAULT 'XYZ Institute of Technology',
  bio TEXT DEFAULT 'BorrowBuddy campus member.',
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  points INTEGER NOT NULL DEFAULT 20,
  rank TEXT NOT NULL DEFAULT 'New Buddy' CHECK (rank IN ('New Buddy', 'Helpful Buddy', 'Super Buddy', 'Campus Legend')),
  items_lent INTEGER NOT NULL DEFAULT 0,
  items_borrowed INTEGER NOT NULL DEFAULT 0,
  successful_returns INTEGER NOT NULL DEFAULT 0,
  on_time_return_rate INTEGER NOT NULL DEFAULT 100,
  is_university_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  item_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('Excellent', 'Good', 'Used')),
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Borrowed', 'Pending', 'Unavailable')),
  borrow_fee INTEGER NOT NULL DEFAULT 0 CHECK (borrow_fee >= 0),
  deposit INTEGER NOT NULL DEFAULT 0 CHECK (deposit >= 0),
  estimated_retail_price INTEGER NOT NULL DEFAULT 800 CHECK (estimated_retail_price >= 0),
  pickup_location TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  is_urgent_sos BOOLEAN NOT NULL DEFAULT FALSE,
  circle_id TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  borrow_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 ITEM IMAGES TABLE (Alternative normalized structure)
CREATE TABLE IF NOT EXISTS public.item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 BORROW REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.borrow_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days >= 1),
  message TEXT,
  borrow_fee INTEGER NOT NULL DEFAULT 0,
  deposit INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Cancelled', 'Active', 'Returned', 'Overdue', 'Upcoming')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  borrower_rated BOOLEAN NOT NULL DEFAULT FALSE,
  owner_rated BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT check_dates CHECK (end_date >= start_date)
);

-- 2.6 CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  unread_count INTEGER NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_conversation UNIQUE (item_id, borrower_id, owner_id)
);

-- 2.7 MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_wishlist_item UNIQUE (user_id, item_id)
);

-- 2.9 NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.borrow_requests(id) ON DELETE SET NULL,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  condition_rating INTEGER NOT NULL DEFAULT 5 CHECK (condition_rating BETWEEN 1 AND 5),
  communication_rating INTEGER NOT NULL DEFAULT 5 CHECK (communication_rating BETWEEN 1 AND 5),
  timely_return_rating INTEGER NOT NULL DEFAULT 5 CHECK (timely_return_rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('borrower', 'lender')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 NEED REQUESTS (COMMUNITY ASK)
CREATE TABLE IF NOT EXISTS public.need_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  required_date TEXT NOT NULL,
  duration TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Fulfilled', 'Closed')),
  offers_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.12 BUDDY CIRCLES
CREATE TABLE IF NOT EXISTS public.buddy_circles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('department', 'class', 'hostel', 'friends')),
  university TEXT NOT NULL,
  members_count INTEGER NOT NULL DEFAULT 1,
  item_count INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.13 CIRCLE MEMBERS
CREATE TABLE IF NOT EXISTS public.circle_members (
  circle_id TEXT NOT NULL REFERENCES public.buddy_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (circle_id, user_id)
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_items_owner ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_urgent ON public.items(is_urgent_sos);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_borrower ON public.borrow_requests(borrower_id);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_owner ON public.borrow_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_item ON public.borrow_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_borrow_requests_status ON public.borrow_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_need_requests_status ON public.need_requests(status);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.need_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- 4.1 PROFILES POLICIES
-- Anyone authenticated can view public profile details
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 4.2 CATEGORIES POLICIES
-- Categories are readable by all users
CREATE POLICY "Categories are readable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);

-- 4.3 ITEMS POLICIES
-- Everyone can read available/active items
CREATE POLICY "Items are viewable by everyone" 
  ON public.items FOR SELECT 
  USING (true);

-- Authenticated students can list items where they are the owner
CREATE POLICY "Authenticated users can create items" 
  ON public.items FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own items
CREATE POLICY "Owners can update their own items" 
  ON public.items FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Owners can delete their own items
CREATE POLICY "Owners can delete their own items" 
  ON public.items FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- 4.4 ITEM IMAGES POLICIES
CREATE POLICY "Item images are viewable by everyone" 
  ON public.item_images FOR SELECT 
  USING (true);

CREATE POLICY "Owners can manage item images" 
  ON public.item_images FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = item_images.item_id AND items.owner_id = auth.uid()
  ));

-- 4.5 BORROW REQUESTS POLICIES
-- Borrowers and owners involved can view their own requests
CREATE POLICY "Participants can view their borrow requests" 
  ON public.borrow_requests FOR SELECT 
  TO authenticated 
  USING (auth.uid() = borrower_id OR auth.uid() = owner_id);

-- Borrowers can create requests for themselves
CREATE POLICY "Borrowers can create requests" 
  ON public.borrow_requests FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = borrower_id);

-- Participants (owner or borrower) can update request state
CREATE POLICY "Participants can update borrow requests" 
  ON public.borrow_requests FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = borrower_id OR auth.uid() = owner_id);

-- 4.6 CONVERSATIONS POLICIES
CREATE POLICY "Conversation participants can view their chats" 
  ON public.conversations FOR SELECT 
  TO authenticated 
  USING (auth.uid() = borrower_id OR auth.uid() = owner_id);

CREATE POLICY "Participants can create conversations" 
  ON public.conversations FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = borrower_id OR auth.uid() = owner_id);

CREATE POLICY "Participants can update conversations" 
  ON public.conversations FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = borrower_id OR auth.uid() = owner_id);

-- 4.7 MESSAGES POLICIES
CREATE POLICY "Participants can view messages" 
  ON public.messages FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.borrower_id = auth.uid() OR conversations.owner_id = auth.uid())
  ));

CREATE POLICY "Participants can send messages" 
  ON public.messages FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.uid() = sender_id AND 
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.borrower_id = auth.uid() OR conversations.owner_id = auth.uid())
    )
  );

CREATE POLICY "Participants can update read status" 
  ON public.messages FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.borrower_id = auth.uid() OR conversations.owner_id = auth.uid())
  ));

-- 4.8 WISHLISTS POLICIES
CREATE POLICY "Users can view their own wishlist" 
  ON public.wishlists FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" 
  ON public.wishlists FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" 
  ON public.wishlists FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 4.9 NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users or system can send notifications" 
  ON public.notifications FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Users can update/read their notifications" 
  ON public.notifications FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications" 
  ON public.notifications FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 4.10 REVIEWS POLICIES
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (true);

CREATE POLICY "Verified reviewers can create reviews" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = reviewer_id);

-- 4.11 NEED REQUESTS POLICIES
CREATE POLICY "Need requests are viewable by everyone" 
  ON public.need_requests FOR SELECT 
  USING (true);

CREATE POLICY "Users can create need requests" 
  ON public.need_requests FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their need requests" 
  ON public.need_requests FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their need requests" 
  ON public.need_requests FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- 4.12 BUDDY CIRCLES & MEMBERS POLICIES
CREATE POLICY "Circles are viewable by everyone" 
  ON public.buddy_circles FOR SELECT 
  USING (true);

CREATE POLICY "Circle members viewable by everyone" 
  ON public.circle_members FOR SELECT 
  USING (true);

CREATE POLICY "Users can join circles" 
  ON public.circle_members FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles" 
  ON public.circle_members FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. AUTOMATIC PROFILE CREATION TRIGGER (ON SIGNUP)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    university,
    avatar_url,
    rating,
    points,
    rank,
    items_lent,
    items_borrowed,
    successful_returns,
    on_time_return_rate,
    is_university_verified
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'university', 'XYZ Institute of Technology'),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || encode(NEW.id::text::bytea, 'hex')
    ),
    5.00,
    20,
    'New Buddy',
    0,
    0,
    0,
    100,
    FALSE -- Normal email accounts start as BorrowBuddy Member
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- Insert welcome notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    link
  )
  VALUES (
    NEW.id,
    'pickup_reminder',
    'Welcome to BorrowBuddy! 🎒',
    'Why buy when you can borrow? Explore college essentials or list your own gear.',
    '/explore'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. STORAGE BUCKET CONFIGURATION (item-images)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images',
  'item-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket RLS policies
CREATE POLICY "Item images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Users can update their own item images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);
