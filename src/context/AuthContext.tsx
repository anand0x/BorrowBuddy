import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storageService';
import { MOCK_USERS } from '../data/mockData';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.initStorage();
    const stored = StorageService.getCurrentUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    const allUsers = StorageService.getAllUsers();
    const matched = allUsers.find(u => u.email.toLowerCase() === trimmed);

    // In demo mode, accept Demo1234 or existing user email
    if (matched) {
      setUser(matched);
      StorageService.setCurrentUser(matched);
      return { success: true };
    }

    // If it's a demo user email variation
    if (trimmed === 'student1@demo.com' || trimmed === 'student2@demo.com') {
      const idx = trimmed === 'student1@demo.com' ? 0 : 1;
      const demoUser = MOCK_USERS[idx];
      setUser(demoUser);
      StorageService.setCurrentUser(demoUser);
      return { success: true };
    }

    // If any new email is entered with valid password in prototype, allow automatic guest login or return error
    return { success: false, error: 'Account not found with this email. Try Demo Account or Sign Up.' };
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    university: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.fullName.trim() || !data.email.trim() || !data.password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const allUsers = StorageService.getAllUsers();
    if (allUsers.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || undefined,
      university: data.university.trim() || 'XYZ Institute of Technology',
      bio: 'BorrowBuddy campus member.',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
      rating: 5.0,
      points: 20, // Welcome points
      rank: 'New Buddy',
      itemsLent: 0,
      itemsBorrowed: 0,
      successfulReturns: 0,
      onTimeReturnRate: 100,
      isUniversityVerified: false, // DO NOT falsely mark normal accounts as university verified!
      createdAt: new Date().toISOString().split('T')[0],
    };

    allUsers.push(newUser);
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
  };

  const logout = () => {
    setUser(null);
    StorageService.setCurrentUser(null);
  };

  const switchDemoUser = (userIndex: 0 | 1) => {
    const demoUser = MOCK_USERS[userIndex];
    setUser(demoUser);
    StorageService.setCurrentUser(demoUser);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = StorageService.updateUser({ ...updates, id: user.id });
    setUser(updated);
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
