import {
  Transaction,
  BenefitPolicy,
  ClaimRecord,
  RuleDefinition,
  ProactiveInsight,
} from '../types';

// In dev, Vite's server.ts proxies nothing extra, so we call the Express
// backend directly. Set VITE_API_URL to override (e.g. for prod builds).
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'benefitflow_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

class ApiClientError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(res.status, json.message || `Request failed (${res.status})`);
  }
  return (json.data ?? json) as T;
}

// ---------- Adapters: backend shape -> frontend types.ts shape ----------

function normalizeTransaction(tx: any): Transaction {
  return {
    ...tx,
    detectedBenefit: tx.detectedBenefit || 'No Match Found',
    claimDeadline: tx.claimDeadline || 'N/A',
    reasoningChain: tx.reasoningChain || [],
    benefitValue: tx.benefitValue || 0,
    coverageLimit: tx.coverageLimit || 0,
    confidenceScore: tx.confidenceScore || 0,
  };
}

function normalizeRule(rule: any): RuleDefinition {
  return {
    id: rule.id,
    name: rule.name,
    active: rule.active,
    ifCategory: rule.ifCategory,
    ifMinAmount: rule.ifMinAmount,
    ifCard: rule.ifCard,
    thenBenefit: rule.thenBenefitTitle,
    thenCoveragePct: rule.thenCoveragePct,
    description: rule.description || '',
  };
}

// ---------------------------------- Auth ----------------------------------

export async function login(email: string, password: string) {
  const data = await request<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function signup(name: string, email: string, password: string) {
  const data = await request<{ token: string; user: any }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function fetchProfile() {
  return request<any>('/auth/profile');
}

// ------------------------------ Dashboard/data -----------------------------

export async function fetchDashboard() {
  return request<any>('/dashboard');
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const data = await request<any[]>('/transactions');
  return data.map(normalizeTransaction);
}

export async function createTransaction(payload: Partial<Transaction> & { merchant: string; amount: number; category: string; cardUsed: string }): Promise<Transaction> {
  const data = await request<any>('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeTransaction(data);
}

export async function fetchPolicies(): Promise<BenefitPolicy[]> {
  return request<BenefitPolicy[]>('/benefits');
}

export async function fetchClaims(): Promise<ClaimRecord[]> {
  return request<ClaimRecord[]>('/claims');
}

export async function submitClaimApi(transactionId: string, documentsAttached: string[] = []): Promise<ClaimRecord> {
  return request<ClaimRecord>('/claims', {
    method: 'POST',
    body: JSON.stringify({ transactionId, documentsAttached }),
  });
}

export async function fetchRules(): Promise<RuleDefinition[]> {
  const data = await request<any[]>('/rules');
  return data.map(normalizeRule);
}

export async function toggleRuleApi(id: string): Promise<RuleDefinition> {
  const data = await request<any>(`/rules/${id}/toggle`, { method: 'PATCH' });
  return normalizeRule(data);
}

export async function createRuleApi(rule: {
  name: string;
  ifCategory: string;
  ifMinAmount: number;
  ifCard: string;
  thenBenefit: string;
  thenCoveragePct: number;
  description?: string;
}): Promise<RuleDefinition> {
  const data = await request<any>('/rules', {
    method: 'POST',
    body: JSON.stringify({
      name: rule.name,
      ifCategory: rule.ifCategory,
      ifMinAmount: rule.ifMinAmount,
      ifCard: rule.ifCard,
      thenBenefitTitle: rule.thenBenefit,
      thenCoveragePct: rule.thenCoveragePct,
      description: rule.description,
    }),
  });
  return normalizeRule(data);
}

export async function fetchInsights(): Promise<ProactiveInsight[]> {
  return request<ProactiveInsight[]>('/insights');
}

export { ApiClientError };
