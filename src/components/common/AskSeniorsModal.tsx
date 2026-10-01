import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Plus, 
  User as UserIcon,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface ForumPost {
  id: string;
  authorName: string;
  authorYear: string;
  question: string;
  tag: string;
  upvotes: number;
  hasUpvoted?: boolean;
  answers: {
    id: string;
    authorName: string;
    authorYear: string;
    text: string;
    isSeniorVerified: boolean;
    linkedItem?: string;
  }[];
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'q-1',
    authorName: 'Arjun Das',
    authorYear: '1st Year B.Tech',
    question: 'Is Casio fx-991CW allowed in the Mathematics End-Sem exams, or do professors strictly want fx-991ES Plus?',
    tag: 'Calculators & Exams',
    upvotes: 14,
    answers: [
      {
        id: 'a-1',
        authorName: 'Rahul Sharma',
        authorYear: '3rd Year Mechanical',
        text: 'Both fx-991CW and fx-991ES Plus are non-programmable calculators, so they are 100% permitted by the exam invigilators. The CW version is actually faster at matrix inversions! I have one listed on BorrowBuddy if you want to borrow it for your exam week.',
        isSeniorVerified: true,
        linkedItem: 'Casio FX-991CW'
      }
    ]
  },
  {
    id: 'q-2',
    authorName: 'Sneha Roy',
    authorYear: '1st Year Biotech',
    question: 'What size lab coat should I borrow if I usually wear a medium college hoodie?',
    tag: 'Lab Equipment',
    upvotes: 9,
    answers: [
      {
        id: 'a-2',
        authorName: 'Priya Verma',
        authorYear: '4th Year Chemistry',
        text: 'Definitely get a Size L lab coat! In winter morning labs, standard M lab coats become too tight around the shoulders when worn over college hoodies. Check out my listing in the Chemistry dept.',
        isSeniorVerified: true,
        linkedItem: 'White Cotton Lab Coat'
      }
    ]
  },
  {
    id: 'q-3',
    authorName: 'Karan Mehra',
    authorYear: '2nd Year Civil',
    question: 'Do the new drafting desks in Drawing Hall 2 fit standard mini drafter clamps?',
    tag: 'Drawing Tools',
    upvotes: 11,
    answers: [
      {
        id: 'a-3',
        authorName: 'Devansh Joshi',
        authorYear: '4th Year Mechanical',
        text: 'Yes, the wooden desks have 2.5cm bevelled edges. All standard Omega or Casio mini-drafters clamp firmly. Just make sure to bring a coin to tighten the clamp bolt securely.',
        isSeniorVerified: true
      }
    ]
  }
];

interface AskSeniorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskSeniorsModal: React.FC<AskSeniorsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast, refreshAppData } = useApp();

  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedTag, setSelectedTag] = useState('Calculators & Exams');
  const [isAsking, setIsAsking] = useState(false);

  // Replying state
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const handleUpvote = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextUpvoted = !p.hasUpvoted;
        return {
          ...p,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1
        };
      }
      return p;
    }));
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to ask a question.' });
      return;
    }

    if (!newQuestion.trim()) return;

    const newPost: ForumPost = {
      id: `q-${Date.now()}`,
      authorName: user.fullName,
      authorYear: user.university,
      question: newQuestion.trim(),
      tag: selectedTag,
      upvotes: 1,
      hasUpvoted: true,
      answers: []
    };

    setPosts([newPost, ...posts]);
    setNewQuestion('');
    setIsAsking(false);

    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch {}

    showToast({
      type: 'success',
      title: 'Question Broadcasted to Campus 🎓',
      message: 'Seniors and classmates have been notified and can answer with equipment advice.'
    });
  };

  const handlePostAnswer = (postId: string) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please log in to answer.' });
      return;
    }

    if (!replyText.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          answers: [
            ...p.answers,
            {
              id: `a-${Date.now()}`,
              authorName: user.fullName,
              authorYear: 'Campus Senior',
              text: replyText.trim(),
              isSeniorVerified: true
            }
          ]
        };
      }
      return p;
    }));

    showToast({
      type: 'success',
      title: 'Advice Shared! 💡 (+5 points)',
      message: 'Thank you for helping junior students navigate college equipment!'
    });

    setReplyText('');
    setReplyPostId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200 my-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Campus Senior Mentorship</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ask the Seniors: College Gear Advice
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Unsure which model is permitted for exams or lab sessions? Get verified advice from experienced seniors.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Ask CTA */}
        <div className="pt-4 pb-2">
          {!isAsking ? (
            <button
              onClick={() => setIsAsking(true)}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Seniors a Question About College Equipment...</span>
            </button>
          ) : (
            <form onSubmit={handlePostQuestion} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">What do you want to ask?</span>
                <button
                  type="button"
                  onClick={() => setIsAsking(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <textarea
                required
                rows={2}
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g. Which lab coat or calculator model is accepted for Physics 101?"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex items-center justify-between">
                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Calculators & Exams">Calculators & Exams</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Drawing Tools">Drawing Tools</option>
                  <option value="Electronics & Hardware">Electronics & Hardware</option>
                  <option value="Textbooks & Notes">Textbooks & Notes</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-soft flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Question</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Q&A List */}
        <div className="overflow-y-auto space-y-4 pr-1 mt-2">
          {posts.map(post => (
            <div 
              key={post.id} 
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft hover:shadow-soft-md transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-800">{post.authorName}</span>
                    <span className="text-[11px] text-slate-400">• {post.authorYear}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {post.question}
                  </h3>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(post.id)}
                  className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                    post.hasUpvoted
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Upvote this helpful question"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                  <span className="text-xs font-bold">{post.upvotes}</span>
                </button>
              </div>

              {/* Answers */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {post.answers.map(ans => (
                  <div key={ans.id} className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{ans.authorName}</span>
                        <span className="text-[11px] text-slate-400">({ans.authorYear})</span>
                        {ans.isSeniorVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Senior Advice</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {ans.text}
                    </p>
                    {ans.linkedItem && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        <span>📦 Related listed item: {ans.linkedItem}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Reply action */}
                {replyPostId === post.id ? (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Share your advice or mention your listed item..."
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      onClick={() => handlePostAnswer(post.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setReplyPostId(null)}
                      className="px-2.5 py-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyPostId(post.id);
                      setReplyText('');
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer pt-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Answer this question (+5 pts)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
