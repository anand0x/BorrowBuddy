import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { ListItemPage } from './pages/ListItemPage';
import { NeedSomethingPage } from './pages/NeedSomethingPage';
import { MyBorrowingsPage } from './pages/MyBorrowingsPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { BorrowRequestsPage } from './pages/BorrowRequestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SafetyPage } from './pages/SafetyPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="item/:id" element={<ItemDetailsPage />} />
              <Route path="need-something" element={<NeedSomethingPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="safety" element={<SafetyPage />} />
              
              {/* Auth Routes */}
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route
                path="list-item"
                element={
                  <ProtectedRoute>
                    <ListItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-borrowings"
                element={
                  <ProtectedRoute>
                    <MyBorrowingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-listings"
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="requests"
                element={
                  <ProtectedRoute>
                    <BorrowRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;

