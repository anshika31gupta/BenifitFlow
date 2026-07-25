/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavView } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { UnclaimedBenefitsCard } from './components/UnclaimedBenefitsCard';
import { InsightCards } from './components/InsightCards';
import { TransactionsView } from './components/TransactionsView';
import { TransactionDetailPanel } from './components/TransactionDetailPanel';
import { PreFilledClaimWizard } from './components/PreFilledClaimWizard';
import { ClaimsTrackerView } from './components/ClaimsTrackerView';
import { CountdownCard } from './components/CountdownCard';
import { BenefitLibraryView } from './components/BenefitLibraryView';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { AnalyticsView } from './components/AnalyticsView';
import { RulesEngineAdminView } from './components/RulesEngineAdminView';
import { SettingsView } from './components/SettingsView';
import { LoginScreen } from './components/LoginScreen';

import { useAuth } from './context/AuthContext';
import {
  fetchTransactions,
  fetchPolicies,
  fetchClaims,
  fetchRules,
  fetchInsights,
  createTransaction,
  submitClaimApi,
  toggleRuleApi,
  createRuleApi,
} from './lib/api';

import { Transaction, BenefitPolicy, ClaimRecord, RuleDefinition, ProactiveInsight } from './types';
import { Sparkles, Loader2 } from 'lucide-react';

// Merchant pool used to simulate a "new purchase just came in" demo trigger.
// The backend's BenefitMatcher decides the real detected benefit/confidence -
// we only pick the raw transaction inputs here.
const SIM_MERCHANTS = [
  { name: 'Sony Center Electronics', category: 'Electronics', amt: 78900, card: 'Amex Centurion' },
  { name: 'Emirates Aviation', category: 'Travel', amt: 94500, card: 'Visa Signature' },
  { name: 'Reliance Digital', category: 'Electronics', amt: 34990, card: 'Chase Sapphire Reserve' },
] as const;

function AppShell() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [policies, setPolicies] = useState<BenefitPolicy[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [claimWizardTx, setClaimWizardTx] = useState<Transaction | null>(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAll = useCallback(async () => {
    setIsLoadingData(true);
    setLoadError(null);
    try {
      const [tx, pol, cl, rl, ins] = await Promise.all([
        fetchTransactions(),
        fetchPolicies(),
        fetchClaims(),
        fetchRules(),
        fetchInsights(),
      ]);
      setTransactions(tx);
      setPolicies(pol);
      setClaims(cl);
      setRules(rl);
      setInsights(ins);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load data from BenefitFlow backend');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Calculate dynamic stats
  const unclaimedValue = transactions
    .filter((t) => t.hasBenefit && t.status === 'Detected')
    .reduce((acc, curr) => acc + curr.benefitValue, 0);

  const detectedCount = transactions.filter((t) => t.hasBenefit).length;
  const activatedCount = transactions.filter((t) => t.status === 'Activated' || t.status === 'Approved').length;
  const missedCount = transactions.filter((t) => t.status === 'Detected').length;
  const totalSaved = claims
    .filter((c) => c.status === 'Approved' || c.status === 'Under Review' || c.status === 'Claim Submitted')
    .reduce((acc, c) => acc + c.payoutAmount, 0);

  // Add Simulated Transaction Real-Time Demo Trigger - now creates a REAL
  // transaction via the backend, which runs the BenefitMatcher engine and
  // returns the actual matched benefit (not a hardcoded one).
  const handleAddSimulatedTransaction = async () => {
    const chosen = SIM_MERCHANTS[Math.floor(Math.random() * SIM_MERCHANTS.length)];
    try {
      const newTx = await createTransaction({
        merchant: chosen.name,
        amount: chosen.amt,
        category: chosen.category,
        cardUsed: chosen.card,
        date: new Date().toISOString().split('T')[0],
      });

      setTransactions((prev) => [newTx, ...prev]);

      if (newTx.hasBenefit) {
        showToast(
          `⚡ AI Radar Match: ${chosen.name} (₹${chosen.amt.toLocaleString('en-IN')}) qualified for ${newTx.detectedBenefit}!`
        );
      } else {
        showToast(`New transaction added: ${chosen.name} (₹${chosen.amt.toLocaleString('en-IN')}) - no benefit matched.`);
      }
    } catch (err: any) {
      showToast(`Could not add transaction: ${err.message}`);
    }
  };

  const handleClaimSubmitted = async (draftClaim: ClaimRecord) => {
    try {
      const claim = await submitClaimApi(draftClaim.transactionId, draftClaim.documentsAttached);
      setClaims((prev) => [claim, ...prev]);
      setTransactions((prev) =>
        prev.map((t) => (t.id === claim.transactionId ? { ...t, status: 'Claim Submitted' } : t))
      );
      setClaimWizardTx(null);
      showToast(`🎉 Claim ${claim.claimNumber} submitted to underwriter!`);
    } catch (err: any) {
      showToast(`Claim submission failed: ${err.message}`);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    // Optimistic update, then reconcile with the backend response.
    setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r)));
    try {
      const updated = await toggleRuleApi(ruleId);
      setRules((prev) => prev.map((r) => (r.id === ruleId ? updated : r)));
    } catch (err: any) {
      showToast(`Could not update rule: ${err.message}`);
      loadAll();
    }
  };

  const handleAddRule = async (rule: RuleDefinition) => {
    try {
      const created = await createRuleApi({
        name: rule.name,
        ifCategory: rule.ifCategory,
        ifMinAmount: rule.ifMinAmount,
        ifCard: rule.ifCard,
        thenBenefit: rule.thenBenefit,
        thenCoveragePct: rule.thenCoveragePct,
        description: rule.description,
      });
      setRules((prev) => [created, ...prev]);
      showToast(`Deployed rule "${created.name}" to BenefitFlow Engine.`);
    } catch (err: any) {
      showToast(`Could not create rule: ${err.message}`);
    }
  };

  const handleSelectTransactionFromInsight = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (tx) setSelectedTransaction(tx);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-xs text-slate-400 font-mono">Loading BenefitFlow AI workspace...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-sm text-red-300">{loadError}</p>
          <p className="text-xs text-slate-500">
            Make sure the backend is running (npm run dev in /backend) and reachable at the configured API URL.
          </p>
          <button onClick={loadAll} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ffffff] flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient lighting glows from Immersive UI theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel-glow px-5 py-3 rounded-2xl border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2.5 shadow-[0_10px_30px_rgba(16,185,129,0.3)] animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        insights={insights}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onSelectTransaction={handleSelectTransactionFromInsight}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          detectedCount={detectedCount}
          activeClaimsCount={claims.length}
        />

        {/* Dynamic Center Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* VIEW 1: LANDING DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <HeroSection
                onViewProtectedPurchases={() => setCurrentView('transactions')}
                onExploreBenefits={() => setCurrentView('library')}
              />

              <UnclaimedBenefitsCard
                unclaimedValue={unclaimedValue}
                detectedCount={detectedCount}
                activatedCount={activatedCount}
                missedCount={missedCount}
                onClaimNowClick={() => {
                  const firstDetected = transactions.find((t) => t.hasBenefit && t.status === 'Detected');
                  if (firstDetected) setClaimWizardTx(firstDetected);
                  else setCurrentView('transactions');
                }}
              />

              <CountdownCard
                onActionClick={() => {
                  const amazonTx = transactions.find((t) => t.merchant.includes('Amazon'));
                  if (amazonTx) setClaimWizardTx(amazonTx);
                }}
              />

              <InsightCards
                detectedCount={detectedCount}
                submittedCount={claims.length}
                totalSaved={totalSaved}
                expiringHours={72}
                onCardClick={(id) => {
                  if (id === 'benefits-detected') setCurrentView('benefits');
                  if (id === 'claims-submitted') setCurrentView('claims');
                  if (id === 'money-saved') setCurrentView('analytics');
                  if (id === 'expiring-soon') {
                    const amazonTx = transactions.find((t) => t.merchant.includes('Amazon'));
                    if (amazonTx) setClaimWizardTx(amazonTx);
                  }
                }}
              />

              <TransactionsView
                transactions={transactions}
                onSelectTransaction={setSelectedTransaction}
                onAddSimulatedTransaction={handleAddSimulatedTransaction}
              />
            </div>
          )}

          {/* VIEW 2: TRANSACTIONS */}
          {currentView === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
              onAddSimulatedTransaction={handleAddSimulatedTransaction}
            />
          )}

          {/* VIEW 3: DETECTED BENEFITS */}
          {currentView === 'benefits' && (
            <div className="space-y-6">
              <UnclaimedBenefitsCard
                unclaimedValue={unclaimedValue}
                detectedCount={detectedCount}
                activatedCount={activatedCount}
                missedCount={missedCount}
                onClaimNowClick={() => {
                  const firstDetected = transactions.find((t) => t.hasBenefit && t.status === 'Detected');
                  if (firstDetected) setClaimWizardTx(firstDetected);
                }}
              />

              <TransactionsView
                transactions={transactions.filter((t) => t.hasBenefit)}
                onSelectTransaction={setSelectedTransaction}
                onAddSimulatedTransaction={handleAddSimulatedTransaction}
              />
            </div>
          )}

          {/* VIEW 4: CLAIMS TRACKER */}
          {currentView === 'claims' && <ClaimsTrackerView claims={claims} />}

          {/* VIEW 5: ANALYTICS */}
          {currentView === 'analytics' && <AnalyticsView />}

          {/* VIEW 6: BENEFIT LIBRARY */}
          {currentView === 'library' && <BenefitLibraryView policies={policies} />}

          {/* VIEW 7: RULES ENGINE (ADMIN) */}
          {currentView === 'rules' && (
            <RulesEngineAdminView rules={rules} onToggleRule={handleToggleRule} onAddRule={handleAddRule} />
          )}

          {/* VIEW 8: SETTINGS */}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* SLIDE-OVER DETAIL PANEL */}
      <TransactionDetailPanel
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onStartClaimWizard={(tx) => setClaimWizardTx(tx)}
      />

      {/* PRE-FILLED CLAIM WIZARD MODAL */}
      <PreFilledClaimWizard
        transaction={claimWizardTx}
        onClose={() => setClaimWizardTx(null)}
        onSubmitClaim={handleClaimSubmitted}
      />

      {/* AI ASSISTANT DRAWER */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        insights={insights}
        onSelectTransaction={handleSelectTransactionFromInsight}
      />
    </div>
  );
}

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AppShell />;
}
