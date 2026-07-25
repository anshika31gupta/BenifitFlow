import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  Plane, 
  Smartphone, 
  Car, 
  FileCheck, 
  Sparkles,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { BenefitPolicy, CardType } from '../types';

interface BenefitLibraryViewProps {
  policies: BenefitPolicy[];
}

export const BenefitLibraryView: React.FC<BenefitLibraryViewProps> = ({ policies }) => {
  const [selectedCardFilter, setSelectedCardFilter] = useState<string>('All Cards');

  const cardTypes = ['All Cards', 'Amex Centurion', 'Visa Signature', 'Chase Sapphire Reserve', 'HDFC Infinia', 'Mastercard World Elite'];

  const filteredPolicies = policies.filter((pol) => {
    if (selectedCardFilter === 'All Cards') return true;
    return pol.eligibleCards.includes(selectedCardFilter as CardType);
  });

  const getPolicyIcon = (title: string) => {
    switch (title) {
      case 'Purchase Protection': return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      case 'Extended Warranty': return <Clock className="w-5 h-5 text-purple-400" />;
      case 'Return Protection': return <RotateCcw className="w-5 h-5 text-emerald-400" />;
      case 'Travel Delay Insurance': return <Plane className="w-5 h-5 text-cyan-400" />;
      case 'Mobile Phone Protection': return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case 'Rental Car Protection': return <Car className="w-5 h-5 text-amber-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Card Protection Library & Master Policy Vault</span>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              {filteredPolicies.length} Active Policies
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse full policy guidelines, claim caps, and required documentation for all linked cards.
          </p>
        </div>

        {/* Card Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <CreditCard className="w-4 h-4 text-slate-500 ml-1 flex-shrink-0" />
          {cardTypes.map((card) => (
            <button
              key={card}
              onClick={() => setSelectedCardFilter(card)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex-shrink-0 ${
                selectedCardFilter === card
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {card}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Protection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((pol) => (
          <div
            key={pol.id}
            className="glass-panel-interactive rounded-3xl p-6 border border-white/10 space-y-4 hover:border-blue-500/40 relative overflow-hidden group"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-blue-600/20 transition-colors">
                  {getPolicyIcon(pol.title)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">{pol.title}</h3>
                  <p className="text-[10px] font-mono text-slate-400">{pol.category}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {pol.activeCount} Active Matches
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[40px]">
              {pol.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div className="glass-panel p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Max Claim Limit</span>
                <p className="text-sm font-extrabold font-mono text-emerald-400">
                  ₹{pol.maxCoverage.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="glass-panel p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] font-mono uppercase text-slate-400">Window Duration</span>
                <p className="text-sm font-extrabold font-mono text-blue-300">
                  {pol.coverageWindowDays} Days
                </p>
              </div>
            </div>

            {/* Eligible Cards Tags */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Eligible Cards:</span>
              <div className="flex flex-wrap gap-1">
                {pol.eligibleCards.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="space-y-1 pt-1 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Required Documents:</span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {pol.requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
