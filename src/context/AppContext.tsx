import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from './AuthContext';
import { sound } from '../utils/audio';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { SupabaseService } from '../services/supabaseService';

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
  isSoundEnabled: boolean;
  toggleSound: () => void;
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
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => sound.getSoundEnabled());

  const refreshAppData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      sound.setSoundEnabled(next);
      if (next) sound.playSuccessChime();
      return next;
    });
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);

    // Play appropriate sound effect
    if (toast.type === 'success') {
      sound.playSuccessChime();
    } else if (toast.type === 'error' || toast.type === 'warning') {
      sound.playWarning();
    } else {
      sound.playNotificationPing();
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Sync data and setup Realtime subscriptions
  useEffect(() => {
    // Initial sync
    StorageService.syncWithSupabase().then(() => {
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
    });

    // Realtime subscriptions when Supabase is configured and user is active
    let notifUnsub: (() => void) | null = null;
    let msgUnsub: (() => void) | null = null;

    if (isSupabaseConfigured && user) {
      try {
        notifUnsub = SupabaseService.subscribeToNotifications(user.id, (newNotif) => {
          showToast({
            type: 'info',
            title: newNotif.title,
            message: newNotif.message
          });
          refreshAppData();
        });

        msgUnsub = SupabaseService.subscribeToMessages(user.id, (newMsg) => {
          if (newMsg.senderId !== user.id) {
            showToast({
              type: 'info',
              title: `New message from ${newMsg.senderName} 💬`,
              message: newMsg.text
            });
            refreshAppData();
          }
        });
      } catch (err) {
        console.warn('Supabase Realtime subscription note:', err);
      }
    }

    return () => {
      if (notifUnsub) notifUnsub();
      if (msgUnsub) msgUnsub();
    };
  }, [user, dataVersion, refreshAppData, showToast]);

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
        isSoundEnabled,
        toggleSound,
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
