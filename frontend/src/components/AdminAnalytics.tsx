import React from 'react';
import { MetricCard, TOP_METRICS } from './MetricCard';
import { AnalyticsTable } from './AnalyticsTable';
import { AdminCharts } from './AdminCharts';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Admin Analytics & User Intelligence
            </h1>
            <span className="text-xs font-mono bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              ADMIN PORTAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Monitor real-time user retention, card benefit activation rates, portfolio trends, and inline user policy configurations.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">System Status</p>
              <p className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync (100%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP METRIC CARDS SECTION */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold px-1">
          Executive KPI Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_METRICS.map((metric) => (
            <MetricCard key={metric.id} data={metric} />
          ))}
        </div>
      </section>

      {/* USER ANALYTICS TABLE SECTION */}
      <section>
        <AnalyticsTable />
      </section>

      {/* ANALYTICS CHARTS SECTION */}
      <section>
        <AdminCharts />
      </section>
    </div>
  );
};
