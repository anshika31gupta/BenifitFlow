import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AdminCharts: React.FC = () => {
  // Chart 1: Monthly Active Users (Line Chart)
  const mauData = [
    { month: 'Jan', activeUsers: 450, totalUsers: 600 },
    { month: 'Feb', activeUsers: 520, totalUsers: 710 },
    { month: 'Mar', activeUsers: 610, totalUsers: 830 },
    { month: 'Apr', activeUsers: 700, totalUsers: 950 },
    { month: 'May', activeUsers: 780, totalUsers: 1040 },
    { month: 'Jun', activeUsers: 860, totalUsers: 1140 },
    { month: 'Jul', activeUsers: 924, totalUsers: 1240 },
  ];

  // Chart 2: Benefit Usage Rate (Donut Chart)
  const usageDonutData = [
    { name: 'Used Benefits', value: 78, color: '#3b82f6' },
    { name: 'Unused / Gap', value: 22, color: '#f59e0b' },
  ];

  // Chart 3: Card Portfolio Distribution (Bar Chart)
  const cardDistData = [
    { card: 'HDFC Infinia', users: 240 },
    { card: 'Amex Centurion', users: 190 },
    { card: 'Visa Signature', users: 210 },
    { card: 'Visa Infinite', users: 185 },
    { card: 'Axis Magnus', users: 145 },
    { card: 'Chase Sapphire', users: 130 },
    { card: 'ICICI Emeralde', users: 140 },
  ];

  // Chart 4: Benefit Status Distribution (Pie Chart)
  const statusPieData = [
    { name: 'Active', value: 40, color: '#10b981' },
    { name: 'Claimed', value: 30, color: '#3b82f6' },
    { name: 'Detected Not Claimed', value: 20, color: '#f59e0b' },
    { name: 'Dormant', value: 10, color: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <span>Platform Intelligence & Behavioral Metrics</span>
          <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
            Real-Time Analytics
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep dive into monthly active user growth, card tier distribution, and insurance utilization dynamics.
        </p>
      </div>

      {/* Row 1: Line Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Monthly Active Users */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">Monthly Active Users (MAU)</h3>
              <p className="text-xs text-slate-400">User retention and active engagement growth trajectory</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Active (7D)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Total Users
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#a855f7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Benefit Usage Rate */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-slate-100 text-base">Benefit Usage Rate</h3>
            <p className="text-xs text-slate-400">Ratio of claimed vs unutilized perks</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={usageDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {usageDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold font-mono text-white">78%</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Utilization</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-white/5">
            {usageDonutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Card Distribution */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-slate-100 text-base">Card Portfolio Distribution</h3>
            <p className="text-xs text-slate-400">Total registered user accounts by card tier</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cardDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="card" stroke="#71717a" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="users" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Benefit Status Distribution */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-slate-100 text-base">Benefit Status Breakdown</h3>
            <p className="text-xs text-slate-400">User proportion across 4 status states</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/5">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}:</span>
                <span className="font-bold text-white ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
