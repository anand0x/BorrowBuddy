import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  Ban, 
  MapPin, 
  Package, 
  CheckCheck, 
  Clock, 
  Sparkles,
  ArrowLeft,
  Info
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Conversation, Message } from '../types';
import { ReportModal } from '../components/common/ReportModal';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeConvId, setActiveConvId] = useState<string | null>(searchParams.get('conv') || null);
  const [messageText, setMessageText] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const allConversations = StorageService.getConversations();
  const userConversations = allConversations.filter(c => c.borrowerId === user.id || c.ownerId === user.id);

  // Set default active conversation if none selected
  useEffect(() => {
    if (!activeConvId && userConversations.length > 0) {
      setActiveConvId(userConversations[0].id);
    }
  }, [activeConvId, userConversations]);

  const activeConversation = userConversations.find(c => c.id === activeConvId);
  const messages = activeConversation ? StorageService.getMessages(activeConversation.id) : [];

  const otherUser = activeConversation ? (
    activeConversation.borrowerId === user.id ? {
      id: activeConversation.ownerId,
      name: activeConversation.ownerName,
      avatar: activeConversation.ownerAvatar,
      role: 'Owner'
    } : {
      id: activeConversation.borrowerId,
      name: activeConversation.borrowerName,
      avatar: activeConversation.borrowerAvatar,
      role: 'Borrower'
    }
  ) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !messageText.trim()) return;

    StorageService.sendMessage({
      conversationId: activeConversation.id,
      senderId: user.id,
      senderName: user.fullName,
      text: messageText.trim()
    });

    setMessageText('');
    refreshAppData();
  };

  const handleBlockUser = () => {
    if (window.confirm(`Are you sure you want to block ${otherUser?.name}? You will no longer receive messages from this student.`)) {
      showToast({
        type: 'info',
        title: 'User Blocked',
        message: `${otherUser?.name} has been blocked.`
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-indigo-600" />
          <span>Campus Chat & Handover</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Coordinate meeting times and designated campus pickup spots for your borrowed gear.
        </p>
      </div>

      {userConversations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden h-[700px]">
          {/* Conversation List (Left) */}
          <div className={`lg:col-span-4 border-r border-slate-200 flex flex-col ${activeConvId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Active Conversations ({userConversations.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {userConversations.map(conv => {
                const partner = conv.borrowerId === user.id ? {
                  name: conv.ownerName,
                  avatar: conv.ownerAvatar,
                  role: 'Owner'
                } : {
                  name: conv.borrowerName,
                  avatar: conv.borrowerAvatar,
                  role: 'Borrower'
                };

                const isSelected = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setSearchParams({ conv: conv.id });
                    }}
                    className={`w-full p-4 flex items-start gap-3 text-left transition ${
                      isSelected ? 'bg-indigo-50/70 border-r-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{partner.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-indigo-600 truncate mt-0.5">
                        📦 {conv.itemTitle}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Pane (Right) */}
          {activeConversation && otherUser ? (
            <div className={`lg:col-span-8 flex flex-col h-full ${!activeConvId ? 'hidden lg:flex' : 'flex'}`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {otherUser.name}
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {otherUser.role}
                      </span>
                    </h3>
                    <Link
                      to={`/item/${activeConversation.itemId}`}
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Package className="w-3 h-3" />
                      <span>{activeConversation.itemTitle}</span>
                    </Link>
                  </div>
                </div>

                {/* Safety controls: Report & Block */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition text-xs font-semibold flex items-center gap-1"
                    title="Report user"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span className="hidden sm:inline">Report</span>
                  </button>
                  <button
                    onClick={handleBlockUser}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1"
                    title="Block user"
                  >
                    <Ban className="w-4 h-4" />
                    <span className="hidden sm:inline">Block</span>
                  </button>
                </div>
              </div>

              {/* Campus Meetup Reminder Banner */}
              <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/60 text-[11px] text-amber-800 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>Campus Safety Rule:</strong> Meet at public spots (Central Library, Canteen, or Gate). Check item condition together before handover.
                </span>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/40">
                {messages.map(msg => {
                  const isMe = msg.senderId === user.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Type a message (e.g. 'I am waiting near the Library entrance...')"
                  className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-soft"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-8 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State: Requirement #36 */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No active conversations</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Your conversations will appear here once a borrowing request is accepted.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-soft"
          >
            Find Items to Borrow
          </Link>
        </div>
      )}

      {/* Report Modal */}
      {otherUser && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          reportedUserId={otherUser.id}
          reportedUserName={otherUser.name}
        />
      )}
    </div>
  );
};

