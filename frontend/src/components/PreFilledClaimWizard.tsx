import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Send,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Transaction, ClaimRecord } from '../types';

interface PreFilledClaimWizardProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSubmitClaim: (claim: ClaimRecord) => void;
}

export const PreFilledClaimWizard: React.FC<PreFilledClaimWizardProps> = ({
  transaction,
  onClose,
  onSubmitClaim
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  if (!transaction) return null;

  const steps = [
    { number: 1, title: 'Verify Transaction' },
    { number: 2, title: 'Auto-filled Info' },
    { number: 3, title: 'Upload Documents' },
    { number: 4, title: 'Submit Claim' }
  ];

  const handleDocumentUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedDocName(e.target.files![0].name);
        setIsUploading(false);
      }, 1200);
    }
  };

  const handleSubmitFinal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#a855f7', '#06b6d4']
      });

      const newClaim: ClaimRecord = {
        id: `claim-${Date.now()}`,
        claimNumber: `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        transactionId: transaction.id,
        merchant: transaction.merchant,
        amount: transaction.amount,
        benefitType: transaction.detectedBenefit,
        cardUsed: transaction.cardUsed,
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'Claim Submitted',
        currentStepIndex: 2,
        documentsAttached: uploadedDocName ? [uploadedDocName] : ['receipt_invoice_ai_scanned.pdf'],
        payoutAmount: transaction.amount,
        estimatedPayoutDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        auditLog: [
          {
            timestamp: new Date().toLocaleString(),
            message: 'Claim created via AI Pre-filled Wizard and transmitted to Underwriter',
            actor: 'System AI'
          }
        ]
      };

      onSubmitClaim(newClaim);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0d0d11] border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-lg sm:text-xl">
                AI Auto-Filled Claim Wizard
              </h3>
              <p className="text-xs text-slate-400">
                Claiming benefit for {transaction.merchant} (₹{transaction.amount.toLocaleString('en-IN')})
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

        {/* Wizard Step Progress Tracker */}
        <div className="grid grid-cols-4 gap-2 border-b border-white/10 pb-4">
          {steps.map((step) => {
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="space-y-1.5 text-center">
                <div
                  className={`w-full h-1.5 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : isCurrent
                      ? 'bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]'
                      : 'bg-white/10'
                  }`}
                />
                <p
                  className={`text-[10px] font-mono font-semibold truncate ${
                    isCurrent ? 'text-blue-400' : isDone ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  Step {step.number}: {step.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* STEP 1: VERIFY TRANSACTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-slate-400">Transaction Ref</span>
                <span className="font-mono text-slate-200">{transaction.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-slate-400">Merchant Name</span>
                <span className="font-bold text-white">{transaction.merchant}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-slate-400">Transaction Date</span>
                <span className="font-mono text-slate-200">{transaction.date}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Purchase Amount</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{transaction.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-200">
                Transaction verified against banking ledger. Eligible for 100% reimbursement under {transaction.detectedBenefit}.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: AUTO-FILLED INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              The following fields have been compiled by BenefitFlow AI from card issuer terms:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Merchant', value: transaction.merchant },
                { label: 'Amount', value: `₹${transaction.amount.toLocaleString('en-IN')}` },
                { label: 'Date', value: transaction.date },
                { label: 'Card Type', value: transaction.cardUsed },
                { label: 'Benefit Type', value: transaction.detectedBenefit },
                { label: 'Claim Type', value: 'Full Reimbursement' },
                { label: 'Coverage Limit', value: `₹${transaction.coverageLimit.toLocaleString('en-IN')}` },
                { label: 'AI Validation', value: '99.4% Verified' }
              ].map((field, idx) => (
                <div key={idx} className="glass-panel p-3 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{field.label}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Auto-filled by AI
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-100 font-mono">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: UPLOAD DOCUMENTS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-dashed border-blue-500/40 text-center space-y-3 relative">
              <input
                type="file"
                onChange={handleDocumentUploadSim}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200">
                  Drag & Drop Receipt or Store Invoice (Optional)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Our OCR AI parses line items, tax IDs & serial numbers automatically.
                </p>
              </div>

              {isUploading ? (
                <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning receipt with Gemini OCR...</span>
                </div>
              ) : uploadedDocName ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 inline-flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedDocName} Scanned & Attached</span>
                </div>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                  No file? BenefitFlow AI auto-fetches merchant digital receipt token.
                </span>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: SUBMIT CLAIM */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/30 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-extrabold text-slate-100">Ready for Instant Submission</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                By clicking "Submit Claim", BenefitFlow AI will transmit your compiled claim packet directly to {transaction.cardUsed} Claims Department.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-white/10 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Target Payout:</span>
              <span className="font-bold text-emerald-400 text-sm">
                ₹{transaction.amount.toLocaleString('en-IN')} Direct Credit
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.4)]"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinal}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] transform active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Transmitting to Issuer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Claim Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
