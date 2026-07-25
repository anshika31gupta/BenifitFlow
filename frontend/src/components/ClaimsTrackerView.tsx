import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Send, 
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { ClaimRecord, ClaimStatus } from '../types';

interface ClaimsTrackerViewProps {
  claims: ClaimRecord[];
  onSelectClaim?: (claim: ClaimRecord) => void;
}

export const ClaimsTrackerView: React.FC<ClaimsTrackerViewProps> = ({
  claims,
  onSelectClaim
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    claims.length > 0 ? claims[0].id : ''
  );

  const activeClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  const workflowSteps = [
    { label: 'Detected', icon: Sparkles },
    { label: 'Benefit Activated', icon: ShieldCheck },
    { label: 'Claim Submitted', icon: Send },
    { label: 'Under Review', icon: Clock },
    { label: 'Approved', icon: CheckCircle2 }
  ];

  const getStepState = (stepIndex: number, currentStepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'future';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <span>Claims Workflow & Live Audit Tracker</span>
          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {claims.length} Active
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor underwriter progress, audit logs, and direct statement reimbursement timelines.
        </p>
      </div>

      {/* Top Active Claim Workflow Stepper */}
      {activeClaim && (
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-blue-500/20 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                CLAIM REF: {activeClaim.claimNumber}
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {activeClaim.merchant} – {activeClaim.benefitType}
              </h3>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Payout Value</span>
              <p className="text-xl font-extrabold text-emerald-400">
                ₹{activeClaim.payoutAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* HORIZONTAL ANIMATED WORKFLOW STEPPER */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 relative">
              {/* Connecting line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-white/10 -z-0" />

              {workflowSteps.map((step, idx) => {
                const state = getStepState(idx, activeClaim.currentStepIndex);
                const StepIcon = step.icon;

                return (
                  <div key={step.label} className="flex flex-col items-center text-center relative z-10 space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                          : state === 'current'
                          ? 'bg-blue-600 text-white animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.8)] ring-4 ring-blue-500/30'
                          : 'bg-[#131315] border border-white/10 text-slate-500'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <p
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        state === 'completed'
                          ? 'text-emerald-400'
                          : state === 'current'
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Log Timeline Below */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Real-time Underwriter Audit Log
            </h4>

            <div className="space-y-2">
              {activeClaim.auditLog.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs font-mono"
                >
                  <div className="mt-0.5">
                    {log.actor === 'System AI' ? (
                      <Bot className="w-4 h-4 text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-200">{log.actor}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 font-sans">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Claims Selection List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {claims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => setSelectedClaimId(claim.id)}
            className={`glass-panel-interactive p-4 rounded-2xl border cursor-pointer space-y-2 ${
              activeClaim?.id === claim.id
                ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">{claim.claimNumber}</span>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                {claim.status}
              </span>
            </div>

            <p className="font-bold text-slate-100 text-sm">{claim.merchant}</p>
            <p className="text-xs text-emerald-400 font-mono font-bold">
              ₹{claim.amount.toLocaleString('en-IN')}
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Card: {claim.cardUsed}</span>
              <span className="text-blue-400 font-bold">Inspect →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
