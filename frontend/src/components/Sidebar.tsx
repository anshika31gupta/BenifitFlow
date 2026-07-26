import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  BookOpen, 
  Sliders, 
  Settings,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export type NavView = 
  | 'dashboard' 
  | 'transactions' 
  | 'benefits' 
  | 'claims' 
  | 'analytics' 
  | 'admin'
  | 'library' 
  | 'rules' 
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  detectedCount: number;
  activeClaimsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  detectedCount,
  activeClaimsCount
}) => {
  const menuItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as NavView, label: 'Transactions', icon: Receipt },
    { 
      id: 'benefits' as NavView, 
      label: 'Detected Benefits', 
      icon: ShieldCheck, 
      badge: detectedCount > 0 ? `${detectedCount}` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    { 
      id: 'claims' as NavView, 
      label: 'Claims Tracker', 
      icon: FileText,
      badge: activeClaimsCount > 0 ? `${activeClaimsCount}` : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    { id: 'analytics' as NavView, label: 'Analytics', icon: BarChart3 },
    { id: 'admin' as NavView, label: 'Admin Analytics', icon: ShieldAlert, isPro: true },
    { id: 'library' as NavView, label: 'Benefit Library', icon: BookOpen },
    { id: 'rules' as NavView, label: 'Rules Engine', icon: Sliders, isPro: true },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-64 flex-shrink-0 bg-[#09090b]/90 border-r border-white/10 min-h-[calc(100vh-4rem)] p-3 md:p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        <div className="px-2 hidden md:block">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">NAVIGATION</p>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent text-white border-l-2 border-blue-500 font-semibold shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="hidden md:inline truncate">{item.label}</span>

                {item.badge && (
                  <span className={`hidden md:inline-flex ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {item.isPro && (
                  <span className="hidden md:inline-flex ml-auto text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Floating Card inside Sidebar */}
      <div className="hidden md:block glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden space-y-3">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-600/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span className="text-xs font-bold">Auto-Claim Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          AI continuously matches 24 credit card policies with your purchase history.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10">
          <span>Engine Status</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
};
