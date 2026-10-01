import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { AppNotification, NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshAppData, showToast } = useApp();

  if (!user) return null;

  const notifications = StorageService.getNotifications(user.id);

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsAsRead(user.id);
    refreshAppData();
    showToast({ type: 'info', message: 'All notifications marked as read.' });
  };

  const handleItemClick = (notif: AppNotification) => {
    if (!notif.read) {
      StorageService.markNotificationAsRead(notif.id);
      refreshAppData();
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'borrow_request':
        return <Bell className="w-5 h-5 text-indigo-600" />;
      case 'request_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'request_rejected':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'return_reminder':
      case 'due_today':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'item_overdue':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'wishlist_available':
        return <Heart className="w-5 h-5 text-rose-500 fill-current" />;
      case 'successful_return':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-indigo-600" />
            <span>Campus Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on borrow requests, pickup coordination, and return deadlines.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Notifications Feed */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(notif => {
            const ContentWrapper = notif.link ? Link : 'div';
            const linkProps = notif.link ? { to: notif.link } : {};

            return (
              <ContentWrapper
                key={notif.id}
                {...(linkProps as any)}
                onClick={() => handleItemClick(notif)}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition block ${
                  notif.read
                    ? 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-200'
                    : 'bg-indigo-50/50 border-indigo-200 text-slate-900 hover:bg-indigo-50/80 shadow-2xs'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                )}
              </ContentWrapper>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">All caught up!</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            You have no notifications right now. Any borrow requests or reminders will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

