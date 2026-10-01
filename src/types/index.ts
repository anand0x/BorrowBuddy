export type ItemCondition = 'Excellent' | 'Good' | 'Used';
export type ItemStatus = 'Available' | 'Borrowed' | 'Pending' | 'Unavailable';
export type BorrowRequestStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Cancelled' 
  | 'Active' 
  | 'Returned' 
  | 'Overdue'
  | 'Upcoming';

export type CampusLocation = 
  | 'Central Library'
  | 'Canteen'
  | 'Main Gate'
  | 'Department Block'
  | 'Hostel Reception';

export type UserRank = 'New Buddy' | 'Helpful Buddy' | 'Super Buddy' | 'Campus Legend';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  university: string;
  bio?: string;
  avatarUrl: string;
  rating: number;
  points: number;
  rank: UserRank;
  itemsLent: number;
  itemsBorrowed: number;
  successfulReturns: number;
  onTimeReturnRate: number; // e.g. 96 (%)
  isUniversityVerified: boolean; // default false as per login requirement
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  description: string;
  itemCount?: number;
}

export interface BookedDateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  borrowerId: string;
  requestId: string;
}

export interface Item {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  condition: ItemCondition;
  status: ItemStatus;
  borrowFee: number; // in INR
  deposit: number; // in INR
  estimatedRetailPrice: number; // in INR, for "Borrow vs Buy" savings
  pickupLocation: CampusLocation;
  images: string[];
  bookedDateRanges: BookedDateRange[];
  views: number;
  borrowCount: number;
  isUrgentSOS?: boolean; // BorrowBuddy SOS feature
  circleId?: string; // Buddy circle
  createdAt: string;
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar: string;
  borrowerRating: number;
  borrowerHistoryCount: number;
  ownerId: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number;
  message?: string;
  borrowFee: number;
  deposit: number;
  totalAmount: number;
  status: BorrowRequestStatus;
  createdAt: string;
  acceptedAt?: string;
  returnedAt?: string;
  borrowerRated?: boolean;
  ownerRated?: boolean;
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface RatingCategories {
  condition: number; // 1-5
  communication: number; // 1-5
  timelyReturn: number; // 1-5
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  itemId: string;
  itemTitle: string;
  rating: number; // average of categories
  categories: RatingCategories;
  comment: string;
  createdAt: string;
  role: 'borrower' | 'lender';
}

export type NotificationType = 
  | 'borrow_request'
  | 'request_accepted'
  | 'request_rejected'
  | 'new_message'
  | 'pickup_reminder'
  | 'return_reminder'
  | 'due_today'
  | 'item_overdue'
  | 'wishlist_available'
  | 'successful_return'
  | 'new_review'
  | 'need_offer';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NeedRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRating: number;
  university: string;
  title: string;
  categoryId: string;
  categoryName: string;
  requiredDate: string;
  duration: string;
  pickupLocation: CampusLocation;
  description: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
  offersCount: number;
  createdAt: string;
}

export interface BuddyCircle {
  id: string;
  name: string;
  type: 'department' | 'class' | 'hostel' | 'friends';
  university: string;
  membersCount: number;
  itemCount: number;
  description: string;
  icon: string;
}

export interface DisputeReport {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  itemId?: string;
  reason: 'Item damaged' | 'Item not returned' | "User didn't show up" | 'Wrong item' | 'Misleading listing' | 'Other';
  details: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: string;
}
