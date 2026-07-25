import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  ChevronRight,
  ShoppingBag,
  Plane,
  Tv,
  Smartphone,
  Coffee,
  Car
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onAddSimulatedTransaction: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onSelectTransaction,
  onAddSimulatedTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Electronics', 'Travel', 'Retail', 'Dining', 'Rideshare'];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.detectedBenefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cardUsed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || tx.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getMerchantIcon = (merchant: string, logo: string) => {
    switch (logo) {
      case 'apple': return <Smartphone className="w-4 h-4 text-slate-200" />;
      case 'plane': return <Plane className="w-4 h-4 text-blue-400" />;
      case 'tv': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'smartphone': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'coffee': return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'car': return <Car className="w-4 h-4 text-cyan-400" />;
      default: return <ShoppingBag className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: Transaction['status'], hasBenefit: boolean) => {
    if (!hasBenefit) {
      return (
        <span className="text-[10px] font-mono font-medium text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          No Coverage Match
        </span>
      );
    }

    switch (status) {
      case 'Detected':
        return (
          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
            <Sparkles className="w-3 h-3 text-blue-400 animate-spin-slow" />
            ✓ Benefit Detected
          </span>
        );
      case 'Activated':
      case 'Claim Submitted':
      case 'Under Review':
        return (
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Approved':
      case 'Paid Out':
        return (
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3 h-3" />
            Approved & Credited
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulator CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Live Purchases & Benefit Radar</span>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
              {filteredTransactions.length} Tracked
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time transaction feed matched against card insurance policies.
          </p>
        </div>

        <button
          onClick={onAddSimulatedTransaction}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-blue-400/30 shadow-[0_4px_15px_rgba(37,99,235,0.3)] flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Purchase</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-white/10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchant, card, or protection..."
            className="w-full bg-[#09090b]/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table / List */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Merchant</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Card Used</th>
                <th className="py-3.5 px-4 font-semibold">Detected Benefit</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-blue-600/10 cursor-pointer transition-colors group"
                >
                  {/* Merchant & Logo */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/40 transition-colors">
                        {getMerchantIcon(tx.merchant, tx.logo)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                          {tx.merchant}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {tx.category} • {tx.date}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-200">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Card Used */}
                  <td className="py-4 px-4">
                    <span className="font-mono text-slate-300 text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      {tx.cardUsed} (••{tx.cardLast4})
                    </span>
                  </td>

                  {/* Benefit */}
                  <td className="py-4 px-4">
                    {tx.hasBenefit ? (
                      <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{tx.detectedBenefit}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Standard Purchase</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    {getStatusBadge(tx.status, tx.hasBenefit)}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No matching transactions found</p>
            <p className="text-xs text-slate-500">Try adjusting your filter terms or simulate a new purchase above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
