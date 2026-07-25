import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { ThreeCardCanvas } from './ThreeCardCanvas';

interface HeroSectionProps {
  onViewProtectedPurchases: () => void;
  onExploreBenefits: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onViewProtectedPurchases,
  onExploreBenefits
}) => {
  return (
    <section className="relative glass-panel-glow rounded-3xl p-6 sm:p-10 border border-white/10 overflow-hidden">
      {/* Background ambient lighting glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Headline & Subtitle */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-mono font-semibold text-blue-300">
              AI SMART CARD ACTIVATION ENGINE v4.2
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none">
            <span className="text-slate-100">Your Card Benefits, </span>
            <br />
            <span className="gradient-text-blue">Automatically Activated.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Our AI continuously monitors your purchases, detects eligible insurance and protection benefits, and prepares claims before you even realize you're covered.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onViewProtectedPurchases}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center gap-2.5 transition-all transform active:scale-95 group"
            >
              <span>View Protected Purchases</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreBenefits}
              className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Explore Benefits</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Micro metrics bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Detection Time</p>
              <p className="text-sm font-bold font-mono text-emerald-400">&lt; 1.2 Seconds</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Supported Cards</p>
              <p className="text-sm font-bold font-mono text-slate-100">Amex, Visa, MC, Chase</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Auto-Fill Accuracy</p>
              <p className="text-sm font-bold font-mono text-blue-400">99.4% Verified</p>
            </div>
          </div>
        </div>

        {/* Right 3D Credit Card Centerpiece */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-[1.6/1] rounded-3xl overflow-hidden glass-panel border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <ThreeCardCanvas />
          </div>

          {/* Floating AI Particles Badge Overlay */}
          <div className="absolute -bottom-4 -left-4 glass-panel-glow px-4 py-2.5 rounded-2xl border border-blue-500/30 flex items-center gap-3 shadow-xl backdrop-blur-xl animate-float-slow">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">AI Shield Protection</p>
              <p className="text-[10px] font-mono text-emerald-400">100% Policy Match Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
