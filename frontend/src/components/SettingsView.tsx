import React, { useState } from 'react';
import { CreditCard, Shield, Bell, Key, Check, Zap, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [autoActivate, setAutoActivate] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">Engine & Portfolio Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage linked credit cards, automated claim submission permissions, and API key integrations.
        </p>
      </div>

      {/* Linked Cards Vault */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            Linked Card Vault (4 Active)
          </h3>
          <button className="text-xs font-mono font-bold text-blue-400 hover:underline">
            + Link New Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {[
            { name: 'Amex Centurion Black', last4: '8821', limit: '₹15,00,000/yr', color: 'from-slate-900 to-black' },
            { name: 'Visa Signature Infinite', last4: '4190', limit: '₹5,00,000/yr', color: 'from-blue-900 to-slate-900' },
            { name: 'Chase Sapphire Reserve', last4: '9012', limit: '₹8,00,000/yr', color: 'from-indigo-900 to-slate-900' },
            { name: 'HDFC Infinia Metal', last4: '1102', limit: '₹10,00,000/yr', color: 'from-purple-900 to-slate-900' }
          ].map((card, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} border border-white/10 flex justify-between items-center`}>
              <div>
                <p className="font-bold text-slate-100">{card.name}</p>
                <p className="text-[10px] text-slate-400">•••• •••• •••• {card.last4}</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Shield Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Permissions */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 border-b border-white/10 pb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          Automation & Auto-Claim Permissions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <p className="font-bold text-slate-200">Auto-Submit Approved Claims</p>
              <p className="text-[11px] text-slate-400">Automatically transmit claim packets when confidence score exceeds 95%.</p>
            </div>
            <input
              type="checkbox"
              checked={autoActivate}
              onChange={(e) => setAutoActivate(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <p className="font-bold text-slate-200">Instant Email Notifications</p>
              <p className="text-[11px] text-slate-400">Receive alerts when new purchase coverage is detected or approved.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Gemini AI Status */}
      <div className="glass-panel-glow p-5 rounded-3xl border border-blue-500/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-blue-400" />
          <div>
            <p className="font-bold text-slate-100">Gemini 2.5 Policy Engine Connection</p>
            <p className="text-[10px] text-slate-400">Environment variable GEMINI_API_KEY detected & active</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" /> Connected
        </span>
      </div>
    </div>
  );
};
