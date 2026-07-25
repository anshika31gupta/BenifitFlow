import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { TrendingUp, ShieldCheck, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const monthlySavingsData = [
    { month: 'Jan', detected: 14000, claimed: 12000 },
    { month: 'Feb', detected: 22000, claimed: 18500 },
    { month: 'Mar', detected: 31000, claimed: 28000 },
    { month: 'Apr', detected: 28000, claimed: 24500 },
    { month: 'May', detected: 42000, claimed: 39000 },
    { month: 'Jun', detected: 55000, claimed: 48500 },
    { month: 'Jul', detected: 68000, claimed: 62450 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 45, color: '#3b82f6' },
    { name: 'Travel & Aviation', value: 25, color: '#10b981' },
    { name: 'Retail & Fashion', value: 15, color: '#a855f7' },
    { name: 'Mobile Protection', value: 10, color: '#06b6d4' },
    { name: 'Car Rental', value: 5, color: '#f59e0b' }
  ];

  const cardPerformance = [
    { card: 'Amex Centurion', claims: 14, payout: 245000 },
    { card: 'Visa Signature', claims: 8, payout: 88500 },
    { card: 'Chase Sapphire', claims: 6, payout: 64990 },
    { card: 'HDFC Infinia', claims: 4, payout: 36900 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Executive Analytics & Portfolio Intelligence</span>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Real-time BI
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Macro analysis of benefit yields, underwriter approval velocities, and category protections.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-2xl text-emerald-400 text-xs font-mono">
          <TrendingUp className="w-4 h-4" />
          <span>Overall Yield Velocity: +34.2% YoY</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Lifetime Savings</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">₹2,68,340</p>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" /> +₹42,500 this month
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Claim Approval Velocity</span>
          <p className="text-2xl font-extrabold font-mono text-blue-400">96.8%</p>
          <span className="text-[10px] text-slate-500">Underwriter acceptance rate</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Average Turnaround</span>
          <p className="text-2xl font-extrabold font-mono text-purple-400">1.8 Days</p>
          <span className="text-[10px] text-slate-500">From filing to bank credit</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active Card Shields</span>
          <p className="text-2xl font-extrabold font-mono text-amber-400">4 Premium</p>
          <span className="text-[10px] text-slate-500">Amex, Visa, Chase, HDFC</span>
        </div>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Savings Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">Monthly Benefits Detected vs Claimed</h3>
              <p className="text-xs text-slate-400">Cumulative value (₹) tracked across transaction ledgers</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Detected
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Claimed
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySavingsData}>
                <defs>
                  <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClaimed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#e5e1e4', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="detected" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDetected)" />
                <Area type="monotone" dataKey="claimed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorClaimed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-slate-100 text-base">Protected Categories</h3>
            <p className="text-xs text-slate-400">Distribution by claim volume</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-bold text-slate-100">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Card Performance Bar Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-extrabold text-slate-100 text-base">Payout Value by Card Portfolio</h3>
          <p className="text-xs text-slate-400">Total reimbursement yield per card issuer</p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cardPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="card" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              />
              <Bar dataKey="payout" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
