import React from 'react';
import { UserBenefitStatus } from '../data/mockUsers';
import { CheckCircle2, Moon, Sparkles, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: UserBenefitStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5';

  switch (status) {
    case 'Active':
      return (
        <span
          className={`font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center gap-1.5 w-fit shadow-[0_0_10px_rgba(16,185,129,0.2)] ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      );
    case 'Dormant':
      return (
        <span
          className={`font-mono font-medium text-slate-400 bg-slate-500/15 border border-slate-500/30 rounded-full flex items-center gap-1.5 w-fit ${sizeClasses}`}
        >
          <Moon className="w-3 h-3 text-slate-400" />
          Dormant
        </span>
      );
    case 'Claimed':
      return (
        <span
          className={`font-mono font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 rounded-full flex items-center gap-1.5 w-fit shadow-[0_0_10px_rgba(37,99,235,0.2)] ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-blue-400" />
          Claimed
        </span>
      );
    case 'Detected Not Claimed':
      return (
        <span
          className={`font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 rounded-full flex items-center gap-1.5 w-fit shadow-[0_0_10px_rgba(245,158,11,0.2)] ${sizeClasses}`}
        >
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          Detected Not Claimed
        </span>
      );
    default:
      return null;
  }
};
