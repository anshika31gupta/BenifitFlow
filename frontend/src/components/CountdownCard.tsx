import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert } from 'lucide-react';

interface CountdownCardProps {
  initialSeconds?: number;
  title?: string;
  subtitle?: string;
  onActionClick?: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  initialSeconds = 3 * 86400 + 12 * 3600 + 45 * 60, // 3 days 12 hrs
  title = 'Purchase Return Protection Closing Soon',
  subtitle = 'Submit before 90-day issuer protection window expires for Amazon India purchase (₹18,450).',
  onActionClick
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="relative glass-panel rounded-3xl p-6 border border-amber-500/30 overflow-hidden shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
      {/* Background ambient gradient pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>URGENT EXPIRATION ALERT</span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{subtitle}</p>
        </div>

        {/* Circular Countdown Timer Widget */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-amber-500/30 backdrop-blur-md flex-shrink-0">
          <div className="text-center font-mono">
            <span className="text-2xl font-extrabold text-amber-400">{String(days).padStart(2, '0')}</span>
            <span className="block text-[9px] text-slate-400 uppercase">Days</span>
          </div>
          <span className="text-xl font-bold text-slate-600">:</span>
          <div className="text-center font-mono">
            <span className="text-2xl font-extrabold text-amber-400">{String(hours).padStart(2, '0')}</span>
            <span className="block text-[9px] text-slate-400 uppercase">Hours</span>
          </div>
          <span className="text-xl font-bold text-slate-600">:</span>
          <div className="text-center font-mono">
            <span className="text-2xl font-extrabold text-amber-400">{String(minutes).padStart(2, '0')}</span>
            <span className="block text-[9px] text-slate-400 uppercase">Mins</span>
          </div>
          <span className="text-xl font-bold text-slate-600">:</span>
          <div className="text-center font-mono">
            <span className="text-2xl font-extrabold text-rose-400 animate-pulse">{String(secs).padStart(2, '0')}</span>
            <span className="block text-[9px] text-slate-400 uppercase">Secs</span>
          </div>

          <button
            onClick={onActionClick}
            className="ml-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 shadow-lg transform active:scale-95 transition-all"
          >
            <span>Claim Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
