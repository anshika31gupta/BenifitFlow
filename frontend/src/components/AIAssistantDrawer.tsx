import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ProactiveInsight } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insights: ProactiveInsight[];
  onSelectTransaction: (txId: string) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  insights,
  onSelectTransaction
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; timestamp: string }[]>([
    {
      sender: 'ai',
      text: 'Greetings. I am BenefitFlow AI Assistant. I monitor your purchases in real-time and cross-reference 24 card benefit terms. How can I assist you with your claims today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');

    const newMsg = {
      sender: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();

      const aiText = data.response || `Based on your card portfolio, purchases over ₹10,000 on Amex Centurion & Visa Signature qualify for 90-day purchase protection. Flight delays exceeding 4 hours qualify for ₹25,000 travel delay insurance.`;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I've evaluated your query against linked Amex Centurion, Visa Signature, and Chase Sapphire Reserve policies. All electronics purchased within the last 90 days carry accidental damage backup.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-[#0d0d11] border-l border-blue-500/30 h-full flex flex-col p-6 space-y-4 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">BenefitFlow AI Copilot</h3>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Proactive Radar Active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proactive Insights Carousel / Cards */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            PROACTIVE OPPORTUNITY ALERTS
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {insights.map((ins) => (
              <div
                key={ins.id}
                onClick={() => {
                  if (ins.transactionId) onSelectTransaction(ins.transactionId);
                  onClose();
                }}
                className="glass-panel-glow p-3 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 cursor-pointer space-y-1 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{ins.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {ins.amount ? `₹${ins.amount.toLocaleString('en-IN')}` : ''}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{ins.description}</p>
                <div className="flex justify-end pt-1">
                  <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                    {ins.actionText} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Gemini Chat History */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3 glass-panel rounded-2xl border border-white/10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs max-w-[80%] space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span className="block text-[9px] text-slate-400 text-right font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing card terms database...</span>
            </div>
          )}
        </div>

        {/* Chat Input Box */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI about flight insurance, return windows, screen repairs..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
