import { Transaction, BenefitPolicy, ClaimRecord, RuleDefinition, ProactiveInsight } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    merchant: 'Apple Store',
    logo: 'apple',
    amount: 124900,
    category: 'Electronics',
    date: '2026-07-22',
    cardUsed: 'Amex Centurion',
    cardLast4: '8821',
    detectedBenefit: 'Purchase Protection',
    benefitValue: 124900,
    hasBenefit: true,
    status: 'Detected',
    claimDeadline: '2026-10-20',
    confidenceScore: 99,
    coverageLimit: 150000,
    reasoningChain: [
      { label: 'Electronics Purchase', detail: 'MacBook Pro M3 Max detected', type: 'transaction' },
      { label: 'Amex Centurion Tier', detail: 'Includes Tier-1 Accidental Damage & Theft', type: 'card' },
      { label: 'Purchase Amount > ₹10,000', detail: 'Qualifies for 90-day comprehensive coverage', type: 'threshold' },
      { label: 'Purchase Protection Eligible', detail: '100% replacement value up to ₹1,500,000/yr', type: 'benefit' },
      { label: 'Extended Warranty Eligible', detail: '+2 Additional years manufacturer coverage', type: 'warranty' }
    ]
  },
  {
    id: 'tx-102',
    merchant: 'Air India Express',
    logo: 'plane',
    amount: 48500,
    category: 'Travel',
    date: '2026-07-20',
    cardUsed: 'Visa Signature',
    cardLast4: '4190',
    detectedBenefit: 'Travel Delay Insurance',
    benefitValue: 18500,
    hasBenefit: true,
    status: 'Claim Submitted',
    claimDeadline: '2026-08-20',
    confidenceScore: 97,
    coverageLimit: 25000,
    reasoningChain: [
      { label: 'Airline Ticket Purchase', detail: 'Flight AI-803 Delays exceeding 4 hours', type: 'transaction' },
      { label: 'Visa Signature Card', detail: 'Automatic Travel Delay Reimbursement', type: 'card' },
      { label: 'Delay > 4 Hours Verified', detail: 'AI verified against global flight status API', type: 'threshold' },
      { label: 'Travel Delay Reimbursement', detail: 'Meals, hotel & essential supplies covered up to ₹25,000', type: 'benefit' }
    ]
  },
  {
    id: 'tx-103',
    merchant: 'Best Buy Electronics',
    logo: 'tv',
    amount: 64990,
    category: 'Electronics',
    date: '2026-07-18',
    cardUsed: 'Chase Sapphire Reserve',
    cardLast4: '9012',
    detectedBenefit: 'Extended Warranty',
    benefitValue: 64990,
    hasBenefit: true,
    status: 'Activated',
    claimDeadline: '2028-07-18',
    confidenceScore: 98,
    coverageLimit: 100000,
    reasoningChain: [
      { label: 'OLED Smart TV Purchase', detail: 'Sony BRAVIA 55" 4K OLED', type: 'transaction' },
      { label: 'Chase Sapphire Reserve', detail: 'Extends US/IN manufacturer warranty by 1 year', type: 'card' },
      { label: '1-Year Manufacturer Warranty', detail: 'Automatically backed up by Chase Shield', type: 'threshold' },
      { label: 'Extended Warranty Auto-Registered', detail: 'Digital certificate generated in BenefitFlow vault', type: 'warranty' }
    ]
  },
  {
    id: 'tx-104',
    merchant: 'Amazon India',
    logo: 'shopping-cart',
    amount: 18450,
    category: 'Retail',
    date: '2026-07-15',
    cardUsed: 'HDFC Infinia',
    cardLast4: '1102',
    detectedBenefit: 'Return Protection',
    benefitValue: 18450,
    hasBenefit: true,
    status: 'Under Review',
    claimDeadline: '2026-08-15',
    confidenceScore: 95,
    coverageLimit: 25000,
    reasoningChain: [
      { label: 'High-End Headphones', detail: 'Bose QuietComfort Ultra', type: 'transaction' },
      { label: 'HDFC Infinia Metal', detail: 'Guaranteed 90-day return policy backup', type: 'card' },
      { label: 'Merchant Return Window Closed', detail: 'Amazon 10-day window expired, Infinia 90-day active', type: 'threshold' },
      { label: 'Return Protection Claim Active', detail: 'Reimbursement up to ₹25,000 per item', type: 'benefit' }
    ]
  },
  {
    id: 'tx-105',
    merchant: 'Croma Retail',
    logo: 'smartphone',
    amount: 89900,
    category: 'Electronics',
    date: '2026-07-10',
    cardUsed: 'Amex Centurion',
    cardLast4: '8821',
    detectedBenefit: 'Mobile Phone Protection',
    benefitValue: 89900,
    hasBenefit: true,
    status: 'Approved',
    claimDeadline: '2027-07-10',
    confidenceScore: 99,
    coverageLimit: 100000,
    reasoningChain: [
      { label: 'iPhone 15 Pro Purchase', detail: 'Monthly wireless bill paid on Amex', type: 'transaction' },
      { label: 'Amex Cell Protection', detail: 'Cracked screen & water damage protection', type: 'card' },
      { label: 'Recurring Bill Active', detail: 'Qualifies for zero-deductible screen repair', type: 'threshold' },
      { label: 'Mobile Shield Active', detail: 'Coverage active up to ₹100,000 per claim', type: 'benefit' }
    ]
  },
  {
    id: 'tx-106',
    merchant: 'Starbucks Coffee',
    logo: 'coffee',
    amount: 1250,
    category: 'Dining',
    date: '2026-07-24',
    cardUsed: 'Visa Signature',
    cardLast4: '4190',
    detectedBenefit: 'Price Drop Protection',
    benefitValue: 0,
    hasBenefit: false,
    status: 'Detected',
    claimDeadline: 'N/A',
    confidenceScore: 40,
    coverageLimit: 0,
    reasoningChain: [
      { label: 'Perishable Food/Beverage', detail: 'Below minimum benefit threshold (₹5,000)', type: 'transaction' }
    ]
  },
  {
    id: 'tx-107',
    merchant: 'Uber Premier',
    logo: 'car',
    amount: 3200,
    category: 'Rideshare',
    date: '2026-07-23',
    cardUsed: 'Mastercard World Elite',
    cardLast4: '5543',
    detectedBenefit: 'Rental Car Protection',
    benefitValue: 3200,
    hasBenefit: false,
    status: 'Detected',
    claimDeadline: 'N/A',
    confidenceScore: 50,
    coverageLimit: 0,
    reasoningChain: [
      { label: 'Chauffeur Ride Service', detail: 'Not a self-drive rental vehicle', type: 'transaction' }
    ]
  }
];

export const INITIAL_BENEFIT_POLICIES: BenefitPolicy[] = [
  {
    id: 'pol-1',
    title: 'Purchase Protection',
    category: 'Shopping & Electronics',
    description: 'Covers stolen or accidentally damaged items purchased with your card for up to 90 days from transaction date.',
    maxCoverage: 150000,
    coverageWindowDays: 90,
    eligibleCards: ['Amex Centurion', 'Chase Sapphire Reserve', 'Visa Signature'],
    requiredDocs: ['Original Store Receipt', 'Police Report (for theft) / Repair Quote'],
    iconName: 'ShieldCheck',
    activeCount: 14
  },
  {
    id: 'pol-2',
    title: 'Extended Warranty',
    category: 'Electronics & Appliances',
    description: 'Doubles or extends original manufacturer warranty by up to 2 additional years on eligible retail items.',
    maxCoverage: 200000,
    coverageWindowDays: 730,
    eligibleCards: ['Amex Centurion', 'Chase Sapphire Reserve', 'HDFC Infinia', 'Mastercard World Elite'],
    requiredDocs: ['Purchase Invoice', 'Original Manufacturer Warranty Card'],
    iconName: 'Clock',
    activeCount: 9
  },
  {
    id: 'pol-3',
    title: 'Return Protection',
    category: 'Retail & Fashion',
    description: 'Reimburses item cost if merchant refuses a return within 90 days of purchase.',
    maxCoverage: 30000,
    coverageWindowDays: 90,
    eligibleCards: ['Amex Centurion', 'HDFC Infinia'],
    requiredDocs: ['Merchant Rejection Email/Receipt', 'Item Photo'],
    iconName: 'RotateCcw',
    activeCount: 5
  },
  {
    id: 'pol-4',
    title: 'Travel Delay Insurance',
    category: 'Travel & Aviation',
    description: 'Reimburses hotel, food, and transport expenses when flight is delayed over 4 hours.',
    maxCoverage: 35000,
    coverageWindowDays: 30,
    eligibleCards: ['Visa Signature', 'Chase Sapphire Reserve', 'Amex Centurion'],
    requiredDocs: ['Boarding Pass', 'Airline Delay Confirmation Certificate', 'Expense Receipts'],
    iconName: 'Plane',
    activeCount: 3
  },
  {
    id: 'pol-5',
    title: 'Mobile Phone Protection',
    category: 'Gadgets & Tech',
    description: 'Covers accidental screen damage and theft when cellular bill is charged to card.',
    maxCoverage: 100000,
    coverageWindowDays: 365,
    eligibleCards: ['Amex Centurion', 'Mastercard World Elite'],
    requiredDocs: ['Cellular Carrier Statement', 'Authorized Repair Invoice'],
    iconName: 'Smartphone',
    activeCount: 2
  },
  {
    id: 'pol-6',
    title: 'Rental Car Protection',
    category: 'Travel & Vehicles',
    description: 'Primary collision damage waiver (CDW) covering theft and physical damage to rental cars.',
    maxCoverage: 500000,
    coverageWindowDays: 30,
    eligibleCards: ['Chase Sapphire Reserve', 'Amex Centurion', 'Mastercard World Elite'],
    requiredDocs: ['Rental Agreement', 'Incident Repair Estimate'],
    iconName: 'Car',
    activeCount: 1
  }
];

export const INITIAL_CLAIMS: ClaimRecord[] = [
  {
    id: 'claim-901',
    claimNumber: 'CLM-2026-8812',
    transactionId: 'tx-102',
    merchant: 'Air India Express',
    amount: 18500,
    benefitType: 'Travel Delay Insurance',
    cardUsed: 'Visa Signature',
    dateSubmitted: '2026-07-21',
    status: 'Claim Submitted',
    currentStepIndex: 2,
    documentsAttached: ['boarding_pass_ai803.pdf', 'hotel_receipt_delhi.pdf'],
    payoutAmount: 18500,
    estimatedPayoutDate: '2026-07-28',
    auditLog: [
      { timestamp: '2026-07-21 14:30', message: 'Flight delay auto-verified via FlightRadar24 API', actor: 'System AI' },
      { timestamp: '2026-07-21 14:32', message: 'Pre-filled claim packet compiled and sent to Visa Claims Portal', actor: 'System AI' },
      { timestamp: '2026-07-22 09:15', message: 'Claim acknowledged by Visa Claims Desk (Ref #VS-99102)', actor: 'Adjuster' }
    ]
  },
  {
    id: 'claim-902',
    claimNumber: 'CLM-2026-7734',
    transactionId: 'tx-104',
    merchant: 'Amazon India',
    amount: 18450,
    benefitType: 'Return Protection',
    cardUsed: 'HDFC Infinia',
    dateSubmitted: '2026-07-16',
    status: 'Under Review',
    currentStepIndex: 3,
    documentsAttached: ['amazon_invoice.pdf', 'rejection_notice.png'],
    payoutAmount: 18450,
    estimatedPayoutDate: '2026-07-26',
    auditLog: [
      { timestamp: '2026-07-16 10:00', message: 'Claim initiated for unused headphones rejected by seller', actor: 'User' },
      { timestamp: '2026-07-16 10:01', message: 'AI cross-checked return policy and compiled HDFC claim dossier', actor: 'System AI' },
      { timestamp: '2026-07-18 11:45', message: 'Underwriter requested item photo confirmation - automatically supplied', actor: 'System AI' }
    ]
  },
  {
    id: 'claim-903',
    claimNumber: 'CLM-2026-5510',
    transactionId: 'tx-105',
    merchant: 'Croma Retail',
    amount: 24500,
    benefitType: 'Mobile Phone Protection',
    cardUsed: 'Amex Centurion',
    dateSubmitted: '2026-07-11',
    status: 'Approved',
    currentStepIndex: 4,
    documentsAttached: ['apple_repair_bill.pdf', 'airtel_monthly_statement.pdf'],
    payoutAmount: 24500,
    estimatedPayoutDate: '2026-07-24',
    auditLog: [
      { timestamp: '2026-07-11 16:20', message: 'Screen repair claim submitted with Apple Authorized receipt', actor: 'User' },
      { timestamp: '2026-07-12 10:10', message: 'Amex Centurion automated approval rule triggered', actor: 'System AI' },
      { timestamp: '2026-07-15 15:00', message: 'Claim Approved! ₹24,500 credited to Amex statement', actor: 'Adjuster' }
    ]
  }
];

export const INITIAL_RULES: RuleDefinition[] = [
  {
    id: 'rule-1',
    name: 'High-Value Electronics Purchase Protection',
    active: true,
    ifCategory: 'Electronics',
    ifMinAmount: 10000,
    ifCard: 'All Premium Cards',
    thenBenefit: 'Purchase Protection',
    thenCoveragePct: 100,
    description: 'Automatically flags any electronics purchase over ₹10,000 for 90-day accidental damage and theft insurance.'
  },
  {
    id: 'rule-2',
    name: 'Airline Delay & Cancellation Auto-Trigger',
    active: true,
    ifCategory: 'Travel',
    ifMinAmount: 5000,
    ifCard: 'Visa Signature',
    thenBenefit: 'Travel Delay Insurance',
    thenCoveragePct: 100,
    description: 'Monitors real-time flight departure logs for delays over 4 hours on booked flights.'
  },
  {
    id: 'rule-3',
    name: 'Merchant Return Backup Engine',
    active: true,
    ifCategory: 'Retail',
    ifMinAmount: 3000,
    ifCard: 'HDFC Infinia',
    thenBenefit: 'Return Protection',
    thenCoveragePct: 100,
    description: 'Activates return protection warranty when merchant 10/14-day window closes.'
  },
  {
    id: 'rule-4',
    name: 'Extended Manufacturer Warranty Doubler',
    active: true,
    ifCategory: 'Electronics',
    ifMinAmount: 15000,
    ifCard: 'Chase Sapphire Reserve',
    thenBenefit: 'Extended Warranty',
    thenCoveragePct: 100,
    description: 'Registers warranty extension certificate automatically upon payment confirmation.'
  }
];

export const INITIAL_INSIGHTS: ProactiveInsight[] = [
  {
    id: 'ins-1',
    type: 'urgent',
    title: '3 Days Left on Return Protection',
    description: 'Your Amazon India purchase (₹18,450) return protection deadline expires in 72 hours. File claim today.',
    amount: 18450,
    actionText: 'Review & Claim',
    transactionId: 'tx-104',
    timestamp: '10 mins ago'
  },
  {
    id: 'ins-2',
    type: 'opportunity',
    title: 'Apple Store Purchase Qualified',
    description: 'Your MacBook Pro purchase (₹124,900) automatically qualifies for 90-day Amex Centurion Purchase Protection.',
    amount: 124900,
    actionText: 'Activate Protection',
    transactionId: 'tx-101',
    timestamp: '1 hour ago'
  },
  {
    id: 'ins-3',
    type: 'success',
    title: 'Claim Approved! ₹24,500 Direct Credit',
    description: 'Your mobile screen repair claim for Croma purchase has been approved and credited to your card statement.',
    amount: 24500,
    actionText: 'View Approval Notice',
    transactionId: 'tx-105',
    timestamp: 'Yesterday'
  },
  {
    id: 'ins-4',
    type: 'info',
    title: '₹8,200 Unused Airline Allowance Detected',
    description: 'Flight AI-803 delay over 4h entitles you to meal & hotel reimbursement on Visa Signature.',
    amount: 8200,
    actionText: 'File Travel Claim',
    transactionId: 'tx-102',
    timestamp: '2 days ago'
  }
];
