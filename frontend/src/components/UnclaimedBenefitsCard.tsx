import React from 'react';
import { ArrowUpRight, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';

interface UnclaimedBenefitsCardProps {
  unclaimedValue: number;
  detectedCount: number;
  activatedCount: number;
  missedCount: number;
  onClaimNowClick: () => void;
}

export const UnclaimedBenefitsCard: React.FC<UnclaimedBenefitsCardProps> = ({
  unclaimedValue,
  detectedCount,
  activatedCount,
  missedCount,
  onClaimNowClick
}) => {
  const totalCount = activatedCount + missedCount;
  const activatedPct = totalCount > 0 ? Math.round((activatedCount / totalCount) * 100) : 75;
  const circumference = 2 * Math.PI * 38; // radius 38
  const strokeDashoffset = circumference - (circumference * activatedPct) / 100;

  return (
    <div className="relative glass-panel-glow rounded-3xl p-6 sm:p-8 border border-blue-500/20 overflow-hidden shadow-[0_15px_35px_rgba(37,99,235,0.15)]">
      {/* Glow background circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/10 via-emerald-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Side: Unclaimed value & CTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              UNCLAIMED BENEFITS THIS MONTH
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight gradient-text-emerald font-mono">
              ₹{unclaimedValue.toLocaleString('en-IN')}
            </h2>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last mo
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span><strong className="text-white font-bold">{detectedCount} eligible benefits</strong> detected across 4 linked cards</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onClaimNowClick}
              className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Auto-Activate Claims</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Instant payout to linked bank account
            </span>
          </div>
        </div>

        {/* Right Side: Animated Progress Ring & Card Status */}
        <div className="lg:col-span-5 flex items-center justify-between sm:justify-end gap-6 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-800"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold font-mono text-white">{activatedPct}%</span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">Claimed</span>
            </div>
          </div>

          {/* Breakdown list */}
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Activated:</span>
              <span className="font-bold text-white">{activatedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Pending Action:</span>
              <span className="font-bold text-amber-300">{missedCount}</span>
            </div>
            <div className="pt-1 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-blue-400 font-sans">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Amex & Visa Shield Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
