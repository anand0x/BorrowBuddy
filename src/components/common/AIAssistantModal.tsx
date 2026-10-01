import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  X, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  ShoppingBag
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { Item } from '../../types';
import { formatCurrency } from '../../utils/cn';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  recommendedItems?: Item[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "👋 Hi! I'm BuddyAI, your campus syllabus & gear assistant. Tell me which subject, semester, or lab practical you're preparing for, and I'll find what you need from students nearby!",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const allItems = StorageService.getItems();

  if (!isOpen) return null;

  const quickPrompts = [
    'First Year Engineering Graphics / CAD',
    'Chemistry / Biology Lab Viva Tomorrow',
    'Computer Science 3rd Sem Exam Tools',
    'Electronics Workshop / Hackathon Kit'
  ];

  const handleSend = (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let matchedItems: Item[] = [];
      let reply = "Here are the top college essentials students near you are currently lending for this course:";

      if (lower.includes('graphics') || lower.includes('drawing') || lower.includes('cad') || lower.includes('first year')) {
        matchedItems = allItems.filter(i => i.categoryId === 'cat-draw' || i.title.toLowerCase().includes('drafter'));
        reply = "For Engineering Graphics & Drawing, you strictly need a mini drafter and sheet cylinder. Here's what Priya Verma has available at the Department Block:";
      } else if (lower.includes('chemistry') || lower.includes('biology') || lower.includes('lab') || lower.includes('viva')) {
        matchedItems = allItems.filter(i => i.categoryId === 'cat-lab' || i.title.toLowerCase().includes('lab coat'));
        reply = "For university laboratory practicals, lab coats and clean dissection tools are mandatory. Here are items ready for immediate campus pickup:";
      } else if (lower.includes('computer') || lower.includes('c++') || lower.includes('data structure') || lower.includes('exam')) {
        matchedItems = allItems.filter(i => i.categoryId === 'cat-books' || i.categoryId === 'cat-calc');
        reply = "For CS & IT semester examinations, textbooks and Casio ClassWiz calculators are available right now in the Central Library:";
      } else if (lower.includes('electronics') || lower.includes('hackathon') || lower.includes('soldering') || lower.includes('arduino')) {
        matchedItems = allItems.filter(i => i.categoryId === 'cat-elec' || i.categoryId === 'cat-tools');
        reply = "For hardware hackathons and digital logic labs, students in Hostel Block B have dev boards and soldering kits ready:";
      } else {
        matchedItems = allItems.slice(0, 2);
        reply = `Found several helpful peer listings matching "${q}". Check these out:`;
      }

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          recommendedItems: matchedItems.slice(0, 2)
        }
      ]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-soft-xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col h-[600px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                BuddyAI Campus Assistant
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  AI Match
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Match your semester syllabus with nearby student gear
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>

              {/* Recommended Items Cards */}
              {m.recommendedItems && m.recommendedItems.length > 0 && (
                <div className="mt-2.5 w-full space-y-2">
                  {m.recommendedItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white border border-indigo-100 shadow-2xs hover:border-indigo-300 transition flex items-center justify-between gap-3"
                    >
                      <img src={item.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>📍 {item.pickupLocation}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600">
                            {item.borrowFee === 0 ? 'FREE' : formatCurrency(item.borrowFee)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/item/${item.id}`}
                        onClick={onClose}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shrink-0 shadow-2xs"
                      >
                        Borrow
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>BuddyAI is matching campus items...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Strip */}
        <div className="pt-2 pb-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none border-t border-slate-100">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] text-slate-600 font-medium whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything (e.g. 'What tools do I need for CAD lab?')"
            className="flex-1 text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
