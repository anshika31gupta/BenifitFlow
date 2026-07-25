import React, { useState } from 'react';
import { Search, Bell, Sparkles, Shield, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProactiveInsight } from '../types';

interface NavbarProps {
  insights: ProactiveInsight[];
  onOpenAIAssistant: () => void;
  onSelectTransaction: (txId: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  insights,
  onOpenAIAssistant,
  onSelectTransaction,
  onSearchChange,
  searchQuery
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = insights.length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-[1px] shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400 fill-blue-500/20" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight gradient-text-blue">
              BenefitFlow
            </span>
            <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-semibold">
              AI ENGINE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">Smart Card Protection & Activation</p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search purchases, cards, coverage or benefits... (Press ⌘K)"
          className="w-full bg-[#131315]/80 border border-white/10 rounded-xl pl-9 pr-12 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
        <kbd className="absolute right-3 text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Proactive AI Assistant Drawer Button */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 hover:from-blue-600/30 hover:to-emerald-600/30 border border-blue-500/30 px-3 py-1.5 rounded-xl transition-all group"
        >
          <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold text-slate-200 hidden lg:inline">AI Insights</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#09090b]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel-glow rounded-2xl p-4 shadow-2xl z-50 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-200">Proactive Coverage Alerts</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">
                    {unreadCount} Active
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    onClick={() => {
                      if (insight.transactionId) onSelectTransaction(insight.transactionId);
                      setShowNotifications(false);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {insight.type === 'urgent' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span className="text-xs font-bold text-slate-200">{insight.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{insight.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{insight.description}</p>
                    {insight.amount && (
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-400 font-mono">Value: ₹{insight.amount.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] font-bold text-blue-400 hover:underline">
                          {insight.actionText} →
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <div className="relative w-8 h-8 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight">Elena Rostova</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Executive Shield Active
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
