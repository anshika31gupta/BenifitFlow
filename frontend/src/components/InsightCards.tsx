import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Send, PiggyBank, Clock, TrendingUp } from 'lucide-react';

interface InsightCardsProps {
  detectedCount: number;
  submittedCount: number;
  totalSaved: number;
  expiringHours: number;
  onCardClick?: (type: string) => void;
}

export const InsightCards: React.FC<InsightCardsProps> = ({
  detectedCount,
  submittedCount,
  totalSaved,
  expiringHours,
  onCardClick
}) => {
  const cards = [
    {
      id: 'benefits-detected',
      title: 'Benefits Detected',
      value: `${detectedCount}`,
      subtext: '+4 new this week',
      icon: ShieldCheck,
      color: 'blue',
      glow: 'shadow-[0_0_20px_rgba(37,99,235,0.2)]',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'claims-submitted',
      title: 'Claims Submitted',
      value: `${submittedCount}`,
      subtext: '94% approval velocity',
      icon: Send,
      color: 'emerald',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'money-saved',
      title: 'Money Saved',
      value: `₹${(totalSaved / 1000).toFixed(1)}k`,
      subtext: 'Direct bank payout',
      icon: PiggyBank,
      color: 'purple',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'expiring-soon',
      title: 'Benefits Expiring Soon',
      value: `${expiringHours}h Left`,
      subtext: 'Amazon Return Window',
      icon: Clock,
      color: 'amber',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`glass-panel-interactive rounded-2xl p-5 border ${card.border} ${card.glow} relative overflow-hidden group cursor-pointer space-y-3`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
                {card.value}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{card.subtext}</span>
              </div>
            </div>

            {/* Subtle bottom gradient glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        );
      })}
    </div>
  );
};
