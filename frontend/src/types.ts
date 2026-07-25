export type CardType = 'Visa Signature' | 'Amex Centurion' | 'Chase Sapphire Reserve' | 'Mastercard World Elite' | 'HDFC Infinia';

export type BenefitType = 
  | 'Purchase Protection'
  | 'Return Protection'
  | 'Extended Warranty'
  | 'Travel Delay Insurance'
  | 'Mobile Phone Protection'
  | 'Rental Car Protection'
  | 'Baggage Loss Coverage'
  | 'Price Drop Protection';

export type ClaimStatus = 'Detected' | 'Activated' | 'Claim Submitted' | 'Under Review' | 'Approved' | 'Paid Out';

export interface ReasoningStep {
  label: string;
  detail: string;
  type: 'transaction' | 'card' | 'threshold' | 'benefit' | 'warranty';
}

export interface Transaction {
  id: string;
  merchant: string;
  logo: string;
  amount: number;
  category: 'Electronics' | 'Travel' | 'Dining' | 'Rideshare' | 'Retail' | 'Subscriptions';
  date: string;
  cardUsed: CardType;
  cardLast4: string;
  detectedBenefit: BenefitType;
  benefitValue: number;
  hasBenefit: boolean;
  status: ClaimStatus;
  claimDeadline: string;
  confidenceScore: number; // e.g. 98
  reasoningChain: ReasoningStep[];
  coverageLimit: number;
  receiptUrl?: string;
  notes?: string;
}

export interface BenefitPolicy {
  id: string;
  title: BenefitType;
  category: string;
  description: string;
  maxCoverage: number;
  coverageWindowDays: number;
  eligibleCards: CardType[];
  requiredDocs: string[];
  iconName: string;
  activeCount: number;
}

export interface ClaimRecord {
  id: string;
  claimNumber: string;
  transactionId: string;
  merchant: string;
  amount: number;
  benefitType: BenefitType;
  cardUsed: CardType;
  dateSubmitted: string;
  status: ClaimStatus;
  currentStepIndex: number; // 0 to 4
  documentsAttached: string[];
  payoutAmount: number;
  estimatedPayoutDate: string;
  auditLog: {
    timestamp: string;
    message: string;
    actor: 'System AI' | 'Adjuster' | 'User';
  }[];
}

export interface RuleDefinition {
  id: string;
  name: string;
  active: boolean;
  ifCategory: string;
  ifMinAmount: number;
  ifCard: string;
  thenBenefit: BenefitType;
  thenCoveragePct: number;
  description: string;
}

export interface ProactiveInsight {
  id: string;
  type: 'urgent' | 'opportunity' | 'info' | 'success';
  title: string;
  description: string;
  amount?: number;
  actionText?: string;
  transactionId?: string;
  timestamp: string;
}
