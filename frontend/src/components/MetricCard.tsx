import React, { useEffect, useState } from 'react';
import { Users, UserCheck, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

export interface MetricCardData {
  id: string;
  title: string;
  targetValue: number;
  suffix?: string;
  prefix?: string;
  isFormatted?: boolean;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

const useAnimatedNumber = (target: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return count;
};

export const MetricCard: React.FC<{ data: MetricCardData }> = ({ data }) => {
  const animatedValue = useAnimatedNumber(data.targetValue);
  const Icon = data.icon;

  const displayValue = data.isFormatted
    ? animatedValue.toLocaleString('en-IN')
    : `${data.prefix || ''}${animatedValue}${data.suffix || ''}`;

  return (
    <div
      className={`glass-panel p-5 rounded-2xl border ${data.borderColor} relative overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-lg`}
    >
      {/* Subtle Background Glow Accent */}
      <div
        className={`absolute -right-6 -bottom-6 w-28 h-28 ${data.gradient} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none`}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
            {data.title}
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {displayValue}
            </h3>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${data.iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Trend & Comparison */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
        <div
          className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md ${
            data.isPositive
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
              : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
          }`}
        >
          {data.isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{data.change}</span>
        </div>

        <span className="text-slate-500">{data.comparisonText}</span>
      </div>
    </div>
  );
};

export const TOP_METRICS: MetricCardData[] = [
  {
    id: 'total-users',
    title: 'Total Users',
    targetValue: 1240,
    isFormatted: true,
    change: '+12.8%',
    isPositive: true,
    comparisonText: 'vs last month',
    icon: Users,
    gradient: 'bg-blue-600',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'active-users',
    title: 'Active Users (7 Days)',
    targetValue: 924,
    isFormatted: true,
    change: '+8.4%',
    isPositive: true,
    comparisonText: 'vs last month',
    icon: UserCheck,
    gradient: 'bg-indigo-600',
    borderColor: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    id: 'usage-rate',
    title: 'Benefit Usage Rate',
    targetValue: 78,
    suffix: '%',
    change: '+4.1%',
    isPositive: true,
    comparisonText: 'vs last month',
    icon: ShieldCheck,
    gradient: 'bg-emerald-600',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'awareness-gap',
    title: 'Awareness Gap',
    targetValue: 22,
    suffix: '%',
    change: '-6.2%',
    isPositive: false,
    comparisonText: 'vs last month',
    icon: AlertTriangle,
    gradient: 'bg-amber-600',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
];
