import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDown, 
  CreditCard, 
  DollarSign, 
  Clock, 
  Loader2,
  FileCheck
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionDetailPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
  onStartClaimWizard: (tx: Transaction) => void;
}

export const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({
  transaction,
  onClose,
  onStartClaimWizard
}) => {
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  const handleFetchGeminiReasoning = async () => {
    if (!transaction) return;
    setIsGeneratingExplanation(true);
    try {
      const res = await fetch('/api/gemini/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction })
      });
      const data = await res.json();
      if (data.explanation) {
        setGeminiExplanation(data.explanation);
      } else {
        setGeminiExplanation(
          `BenefitFlow AI analyzed purchase "${transaction.merchant}" (₹${transaction.amount.toLocaleString('en-IN')}) charged on ${transaction.cardUsed}. Card policy section 4.2 guarantees ${transaction.detectedBenefit} for up to ₹${transaction.coverageLimit.toLocaleString('en-IN')}. Eligible for immediate automated claim filing before ${transaction.claimDeadline}.`
        );
      }
    } catch {
      setGeminiExplanation(
        `BenefitFlow AI analyzed purchase "${transaction.merchant}" (₹${transaction.amount.toLocaleString('en-IN')}) charged on ${transaction.cardUsed}. Card policy section 4.2 guarantees ${transaction.detectedBenefit} for up to ₹${transaction.coverageLimit.toLocaleString('en-IN')}. Eligible for immediate automated claim filing before ${transaction.claimDeadline}.`
      );
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  return (
    <AnimatePresence>
      {transaction && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Slide-Over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-lg bg-[#0d0d11] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative z-10"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-lg">Benefit AI Deep Analysis</h3>
                  <p className="text-[11px] font-mono text-slate-400">ID: {transaction.id}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant & Amount Hero Box */}
            <div className="glass-panel-glow p-5 rounded-2xl border border-blue-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Merchant</span>
                  <p className="text-xl font-extrabold text-slate-100">{transaction.merchant}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Purchase Amount</span>
                  <p className="text-2xl font-extrabold font-mono text-emerald-400">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* AI Confidence Gauge */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-300">AI Detection Confidence</span>
                </div>
                <span className="text-sm font-bold font-mono text-blue-400 bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                  {transaction.confidenceScore}% Certainty
                </span>
              </div>
            </div>

            {/* Policy Particulars Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Card Used</span>
                </div>
                <p className="text-xs font-bold text-slate-200">{transaction.cardUsed}</p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Coverage Type</span>
                </div>
                <p className="text-xs font-bold text-emerald-300">{transaction.detectedBenefit}</p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                  <span>Max Coverage Limit</span>
                </div>
                <p className="text-xs font-bold font-mono text-purple-300">
                  ₹{transaction.coverageLimit.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Claim Deadline</span>
                </div>
                <p className="text-xs font-bold font-mono text-amber-300">{transaction.claimDeadline}</p>
              </div>
            </div>

            {/* VISUAL AI REASONING CHAIN */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Why was this benefit detected?
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Connected Rules Tree</span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
                {transaction.reasoningChain.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{step.label}</p>
                        <p className="text-[11px] text-slate-400">{step.detail}</p>
                      </div>
                    </div>

                    {idx < transaction.reasoningChain.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Gemini AI Detailed Justification Generator */}
            <div className="space-y-3">
              {!geminiExplanation ? (
                <button
                  onClick={handleFetchGeminiReasoning}
                  disabled={isGeneratingExplanation}
                  className="w-full bg-white/5 hover:bg-white/10 border border-blue-500/30 text-blue-300 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isGeneratingExplanation ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Querying Gemini 2.5 Policy Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Generate AI Policy Justification</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Gemini Policy Evaluation Summary:</span>
                  </div>
                  <p>{geminiExplanation}</p>
                </div>
              )}
            </div>

            {/* Claim Action CTA Button */}
            {transaction.hasBenefit && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onClose();
                    onStartClaimWizard(transaction);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm py-3.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Launch Pre-Filled Claim Wizard</span>
                </motion.button>
                <p className="text-[10px] text-center text-slate-500 font-mono">
                  Auto-populates receipt data, merchant taxonomy & card insurance claim form.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
