import React, { useState } from 'react';
import { Sliders, Plus, Check, X, Sparkles, ToggleLeft, ToggleRight, Edit2, ShieldCheck } from 'lucide-react';
import { RuleDefinition, BenefitType } from '../types';

interface RulesEngineAdminViewProps {
  rules: RuleDefinition[];
  onToggleRule: (id: string) => void;
  onAddRule: (rule: RuleDefinition) => void;
}

export const RulesEngineAdminView: React.FC<RulesEngineAdminViewProps> = ({
  rules,
  onToggleRule,
  onAddRule
}) => {
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newMinAmount, setNewMinAmount] = useState('10000');
  const [newCard, setNewCard] = useState('Visa Signature');
  const [newBenefit, setNewBenefit] = useState<BenefitType>('Purchase Protection');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const created: RuleDefinition = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      active: true,
      ifCategory: newCategory,
      ifMinAmount: Number(newMinAmount) || 5000,
      ifCard: newCard,
      thenBenefit: newBenefit,
      thenCoveragePct: 100,
      description: `Automatically triggers ${newBenefit} when ${newCategory} purchase on ${newCard} exceeds ₹${Number(newMinAmount).toLocaleString('en-IN')}.`
    };

    onAddRule(created);
    setShowNewRuleModal(false);
    setNewRuleName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Enterprise Benefit Rules Engine</span>
            <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Visual Logic Builder
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated policy matching thresholds, card tier logic, and triggering conditions without code.
          </p>
        </div>

        <button
          onClick={() => setShowNewRuleModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-purple-400/30 shadow-[0_4px_15px_rgba(168,85,247,0.3)] flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {/* Rules List Grid */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`glass-panel p-6 rounded-3xl border transition-all space-y-4 ${
              rule.active ? 'border-purple-500/40 bg-purple-950/10' : 'border-white/10 opacity-60'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">{rule.name}</h3>
                  <p className="text-xs text-slate-400">{rule.description}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => onToggleRule(rule.id)}
                className="flex items-center gap-2 font-mono text-xs text-slate-300 hover:text-white"
              >
                {rule.active ? (
                  <>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-slate-500 font-bold">DISABLED</span>
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  </>
                )}
              </button>
            </div>

            {/* Visual IF / AND / THEN Block */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="glass-panel p-3 rounded-2xl border border-blue-500/30 space-y-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase">IF CATEGORY</span>
                <p className="font-bold text-slate-100">{rule.ifCategory}</p>
              </div>

              <div className="glass-panel p-3 rounded-2xl border border-indigo-500/30 space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase">AND AMOUNT &gt;</span>
                <p className="font-bold text-slate-100">₹{rule.ifMinAmount.toLocaleString('en-IN')}</p>
              </div>

              <div className="glass-panel p-3 rounded-2xl border border-purple-500/30 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase">AND CARD TIER</span>
                <p className="font-bold text-slate-100">{rule.ifCard}</p>
              </div>

              <div className="glass-panel-glow p-3 rounded-2xl border border-emerald-500/40 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">THEN ACTIVATE</span>
                <p className="font-bold text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {rule.thenBenefit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Rule Modal */}
      {showNewRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateRule}
            className="w-full max-w-lg bg-[#0d0d11] border border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-slate-100 text-lg">Create Automated Benefit Rule</h3>
              <button
                type="button"
                onClick={() => setShowNewRuleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Travel Delay Auto-Reimbursement"
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400">If Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full mt-1 bg-[#131315] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Travel">Travel</option>
                    <option value="Retail">Retail</option>
                    <option value="Dining">Dining</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400">If Min Amount (₹)</label>
                  <input
                    type="number"
                    value={newMinAmount}
                    onChange={(e) => setNewMinAmount(e.target.value)}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400">If Card Tier</label>
                  <select
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                    className="w-full mt-1 bg-[#131315] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Visa Signature">Visa Signature</option>
                    <option value="Amex Centurion">Amex Centurion</option>
                    <option value="Chase Sapphire Reserve">Chase Sapphire Reserve</option>
                    <option value="HDFC Infinia">HDFC Infinia</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400">Then Benefit</label>
                  <select
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value as BenefitType)}
                    className="w-full mt-1 bg-[#131315] border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Purchase Protection">Purchase Protection</option>
                    <option value="Extended Warranty">Extended Warranty</option>
                    <option value="Return Protection">Return Protection</option>
                    <option value="Travel Delay Insurance">Travel Delay Insurance</option>
                    <option value="Mobile Phone Protection">Mobile Phone Protection</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg"
            >
              Deploy Rule to Engine
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
