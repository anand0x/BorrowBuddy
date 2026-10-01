import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  wishlist: string[];
  toggleWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  refreshAppData: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataVersion, setDataVersion] = useState(0);

  const refreshAppData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    setWishlist(StorageService.getWishlist());

    if (user) {
      const notifs = StorageService.getNotifications(user.id);
      setUnreadNotificationsCount(notifs.filter(n => !n.read).length);

      const convs = StorageService.getConversations();
      const userConvs = convs.filter(c => c.borrowerId === user.id || c.ownerId === user.id);
      const unreadTotal = userConvs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setUnreadMessagesCount(unreadTotal);
    } else {
      setUnreadNotificationsCount(0);
      setUnreadMessagesCount(0);
    }
  }, [user, dataVersion]);

  const toggleWishlist = useCallback((itemId: string) => {
    const isAdded = StorageService.toggleWishlist(itemId);
    setWishlist(StorageService.getWishlist());
    showToast({
      type: 'success',
      title: isAdded ? 'Saved to Wishlist ❤️' : 'Removed from Wishlist',
      message: isAdded 
        ? "We'll notify you if its availability changes." 
        : "Item removed from your saved list."
    });
  }, [showToast]);

  const isInWishlist = useCallback((itemId: string) => {
    return wishlist.includes(itemId);
  }, [wishlist]);

  const resetDemoData = useCallback(() => {
    StorageService.resetToDefaults();
    refreshAppData();
    showToast({
      type: 'info',
      title: 'Demo Data Reset 🔄',
      message: 'Initial student items, requests and reviews have been restored.'
    });
  }, [refreshAppData, showToast]);

  return (
    <AppContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        unreadNotificationsCount,
        unreadMessagesCount,
        refreshAppData,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

