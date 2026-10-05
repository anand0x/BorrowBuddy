import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storageService';
import { MOCK_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { SupabaseService } from '../services/supabaseService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    university: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (userIndex: 0 | 1) => void;
  updateProfile: (updates: Partial<User>) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.initStorage();

    const initAuth = async () => {
      // 1. If Supabase is configured, check for active session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await SupabaseService.getProfile(session.user.id);
            if (profile) {
              setUser(profile);
              StorageService.setCurrentUser(profile);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Supabase getSession check:', e);
        }
      }

      // 2. Fall back to local user
      const stored = StorageService.getCurrentUser();
      setUser(stored);
      setIsLoading(false);
    };

    initAuth();

    // Listen to Supabase Auth State changes
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await SupabaseService.getProfile(session.user.id);
          if (profile) {
            setUser(profile);
            StorageService.setCurrentUser(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          const currentUser = StorageService.getCurrentUser();
          // If the logged-out user was a Supabase user
          if (currentUser && currentUser.id.includes('-') && !currentUser.id.startsWith('user-')) {
            setUser(null);
            StorageService.setCurrentUser(null);
          }
        }
      });
      subscription = data.subscription;
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Quick demo user bypass for presentation ease
    if (trimmed === 'student1@demo.com' || trimmed === 'student2@demo.com') {
      const idx = trimmed === 'student1@demo.com' ? 0 : 1;
      const demoUser = MOCK_USERS[idx];
      setUser(demoUser);
      StorageService.setCurrentUser(demoUser);
      return { success: true };
    }

    // Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password: password,
        });

        if (!error && data.user) {
          let profile = await SupabaseService.getProfile(data.user.id);
          if (!profile) {
            profile = {
              id: data.user.id,
              fullName: data.user.user_metadata?.full_name || trimmed.split('@')[0],
              email: data.user.email || trimmed,
              phone: data.user.user_metadata?.phone,
              university: data.user.user_metadata?.university || 'XYZ Institute of Technology',
              bio: 'BorrowBuddy campus member.',
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user.id)}`,
              rating: 5.0,
              points: 20,
              rank: 'New Buddy',
              itemsLent: 0,
              itemsBorrowed: 0,
              successfulReturns: 0,
              onTimeReturnRate: 100,
              isUniversityVerified: false,
              createdAt: new Date().toISOString().split('T')[0],
            };
          }

          // Cache profile locally
          const allUsers = StorageService.getAllUsers();
          const existingIdx = allUsers.findIndex(u => u.id === profile.id);
          if (existingIdx >= 0) allUsers[existingIdx] = profile;
          else allUsers.push(profile);
          localStorage.setItem('bb_users', JSON.stringify(allUsers));

          setUser(profile);
          StorageService.setCurrentUser(profile);
          return { success: true };
        } else if (error) {
          // If user exists in local demo users, allow fallback login
          const allUsers = StorageService.getAllUsers();
          const matched = allUsers.find(u => u.email.toLowerCase() === trimmed);
          if (matched) {
            setUser(matched);
            StorageService.setCurrentUser(matched);
            return { success: true };
          }

          return { 
            success: false, 
            error: error.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please check your credentials or create an account.'
              : error.message 
          };
        }
      } catch (err: any) {
        console.warn('Supabase login exception, checking local accounts:', err);
      }
    }

    // Fallback: check local storage accounts
    const allUsers = StorageService.getAllUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === trimmed);
    if (matched) {
      setUser(matched);
      StorageService.setCurrentUser(matched);
      return { success: true };
    }

    return { success: false, error: 'Account not found with this email. Try Demo Account or Sign Up.' };
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    university: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedName = data.fullName.trim();

    if (!trimmedName || !trimmedEmail || !data.password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    // Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: data.password,
          options: {
            data: {
              full_name: trimmedName,
              university: data.university.trim() || 'XYZ Institute of Technology',
              phone: data.phone?.trim() || null
            }
          }
        });

        if (authError) {
          if (authError.message.toLowerCase().includes('already registered')) {
            return { success: false, error: 'An account with this email already exists.' };
          }
          if (authError.message.toLowerCase().includes('password')) {
            return { success: false, error: authError.message };
          }
          console.warn('Supabase signup returned notice, using local persistence:', authError.message);
        } else if (authData.user) {
          const newUser: User = {
            id: authData.user.id,
            fullName: trimmedName,
            email: trimmedEmail,
            phone: data.phone?.trim() || undefined,
            university: data.university.trim() || 'XYZ Institute of Technology',
            bio: 'BorrowBuddy campus member.',
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
            rating: 5.0,
            points: 20, // Welcome points
            rank: 'New Buddy',
            itemsLent: 0,
            itemsBorrowed: 0,
            successfulReturns: 0,
            onTimeReturnRate: 100,
            isUniversityVerified: false, // Normal accounts receive 👤 BorrowBuddy Member
            createdAt: new Date().toISOString().split('T')[0],
          };

          // Upsert into Supabase profiles table
          try {
            await supabase.from('profiles').upsert({
              id: authData.user.id,
              full_name: newUser.fullName,
              email: newUser.email,
              phone: newUser.phone || null,
              university: newUser.university,
              bio: newUser.bio,
              avatar_url: newUser.avatarUrl,
              rating: 5.0,
              points: 20,
              rank: 'New Buddy',
              items_lent: 0,
              items_borrowed: 0,
              successful_returns: 0,
              on_time_return_rate: 100,
              is_university_verified: false,
            });
          } catch (e) {
            console.warn('Supabase profile upsert notice:', e);
          }

          // Cache in local storage
          const allUsers = StorageService.getAllUsers();
          const existingIdx = allUsers.findIndex(u => u.id === newUser.id || u.email.toLowerCase() === trimmedEmail);
          if (existingIdx >= 0) allUsers[existingIdx] = newUser;
          else allUsers.push(newUser);
          localStorage.setItem('bb_users', JSON.stringify(allUsers));

          setUser(newUser);
          StorageService.setCurrentUser(newUser);

          StorageService.addNotification({
            userId: newUser.id,
            type: 'pickup_reminder',
            title: 'Welcome to BorrowBuddy! 🎒',
            message: 'Why buy when you can borrow? Explore college essentials or list your own gear.',
            link: '/explore'
          });

          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signup exception, using local store:', err);
      }
    }

    // Fallback: local storage account
    const allUsers = StorageService.getAllUsers();
    if (allUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      fullName: trimmedName,
      email: trimmedEmail,
      phone: data.phone?.trim() || undefined,
      university: data.university.trim() || 'XYZ Institute of Technology',
      bio: 'BorrowBuddy campus member.',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
      rating: 5.0,
      points: 20,
      rank: 'New Buddy',
      itemsLent: 0,
      itemsBorrowed: 0,
      successfulReturns: 0,
      onTimeReturnRate: 100,
      isUniversityVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    allUsers.push(fallbackUser);
    localStorage.setItem('bb_users', JSON.stringify(allUsers));
    setUser(fallbackUser);
    StorageService.setCurrentUser(fallbackUser);

    StorageService.addNotification({
      userId: fallbackUser.id,
      type: 'pickup_reminder',
      title: 'Welcome to BorrowBuddy! 🎒',
      message: 'Why buy when you can borrow? Explore college essentials or list your own gear.',
      link: '/explore'
    });

    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error', e);
      }
    }
    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const switchDemoUser = async (userIndex: 0 | 1) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    const demoUser = MOCK_USERS[userIndex];
    setUser(demoUser);
    StorageService.setCurrentUser(demoUser);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = StorageService.updateUser({ ...updates, id: user.id });
    setUser(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await SupabaseService.updateProfile(user.id, updates);
      } catch (e) {
        console.warn('Supabase profile update sync notice:', e);
      }
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/settings`
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send password reset' };
      }
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchDemoUser,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
