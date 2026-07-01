import type { ReactNode } from 'react';

export type Assumptions = {
  clientName: string;
  currentAge: number;
  careStartAge: number;
  careCostInflation: number;
};

export type CarePhase = {
  id: string;
  name: string;
  months: number;
  todayMonthlyCost: number;
};

export type ClientPreferences = {
  policyTypePreference: 'asset' | 'pure-ltc';
  premiumType: 'upfront' | 'annual';
  premiumRange:
    | 'annual-under-5000'
    | 'annual-5000-10000'
    | 'annual-10000-plus'
    | 'upfront-under-50000'
    | 'upfront-50000-125000'
    | 'upfront-125000-plus';
  monthlyBenefitPreference: '3000-5000' | '5000-8000' | '8000-plus';
  preferredCoverageAmount: '100000-250000' | '250000-500000' | '500000-plus';
  carePreference: 'home' | 'mixed' | 'facility';
  inflationRiderPreference: 'required' | 'preferred' | 'not-needed';
};

export type PolicyModel = {
  id: string;
  name: string;
  policyType: string;
  annualPremiumAtIssue: number;
  annualPremiumAtCareStart: number;
  annualPremiumGrowthRate: number;
  singlePremium: number;
  initialLifetimePool: number;
  lifetimePoolAtCareStart: number;
  initialMonthlyBenefit: number;
  monthlyBenefitAtCareStart: number;
  initialDeductible: number;
  deductibleAtCareStart: number;
  coinsurance: number;
  inflationRiderRate: number;
  inflationRiderLabel: string;
  benefitInflationDuringClaim: number;
  residualAssetAtCareStart: number;
  extractedFacts: string[];
};

export type MonthProjection = {
  month: number;
  phaseId: string;
  phaseName: string;
  projectedCost: number;
};

export type PhaseResult = {
  id: string;
  name: string;
  months: number;
  firstMonthCost: number;
  lastMonthCost: number;
  totalCost: number;
  covered: number;
  outOfPocket: number;
};

export type PolicyResult = {
  policy: PolicyModel;
  totalCareCost: number;
  totalCovered: number;
  outOfPocket: number;
  coverageRate: number;
  runOutMonth: number | null;
  remainingBenefit: number;
  estimatedCapitalIn: number;
  firstPayment: number;
  careRoi: number;
  netClaimValue: number;
  preferenceScore: number;
  phaseResults: PhaseResult[];
};

export type CompareRow = {
  label: string;
  nyl: string;
  forecare: string;
  meaning?: ReactNode;
  stacked?: boolean;
  highlight?: 'nyl' | 'forecare';
};

export type CompareWinner = {
  policy: 'nyl' | 'forecare' | 'tie';
  detail: string;
};

export const defaultAssumptions: Assumptions = {
  clientName: 'Valued Client',
  currentAge: 55,
  careStartAge: 82,
  careCostInflation: 5.4,
};

export const defaultPhases: CarePhase[] = [
  { id: 'home', name: 'Home care', months: 16, todayMonthlyCost: 1998 },
  { id: 'assisted', name: 'Assisted living', months: 14, todayMonthlyCost: 7451 },
  { id: 'nursing', name: 'Nursing home', months: 16, todayMonthlyCost: 10889 },
];

export const defaultPreferences: ClientPreferences = {
  policyTypePreference: 'asset',
  premiumType: 'upfront',
  premiumRange: 'upfront-50000-125000',
  monthlyBenefitPreference: '5000-8000',
  preferredCoverageAmount: '250000-500000',
  carePreference: 'home',
  inflationRiderPreference: 'preferred',
};

export const preferenceOptions = {
  policyTypePreference: [
    { key: 'asset', label: 'Asset-based policy' },
    { key: 'pure-ltc', label: 'Pure LTC policy' },
  ],
  premiumType: [
    { key: 'upfront', label: 'Upfront' },
    { key: 'annual', label: 'Annual' },
  ],
  premiumRange: {
    annual: [
      { key: 'annual-under-5000', label: 'Under $5k per year' },
      { key: 'annual-5000-10000', label: '$5k - $10k per year' },
      { key: 'annual-10000-plus', label: '$10k+ per year' },
    ],
    upfront: [
      { key: 'upfront-under-50000', label: 'Under $50k upfront' },
      { key: 'upfront-50000-125000', label: '$50k - $125k upfront' },
      { key: 'upfront-125000-plus', label: '$125k+ upfront' },
    ],
  },
  monthlyBenefitPreference: [
    { key: '3000-5000', label: '$3k - $5k' },
    { key: '5000-8000', label: '$5k - $8k' },
    { key: '8000-plus', label: '$8k+' },
  ],
  preferredCoverageAmount: [
    { key: '100000-250000', label: '$100k - $250k' },
    { key: '250000-500000', label: '$250k - $500k' },
    { key: '500000-plus', label: '$500k+' },
  ],
  carePreference: [
    { key: 'home', label: 'In-home care' },
    { key: 'mixed', label: 'Mixed care' },
    { key: 'facility', label: 'Facility care' },
  ],
  inflationRiderPreference: [
    { key: 'required', label: 'Required' },
    { key: 'preferred', label: 'Preferred' },
    { key: 'not-needed', label: 'Not needed' },
  ],
} as const;

export const policies: PolicyModel[] = [
  {
    id: 'nyl',
    name: 'NYL My Care',
    policyType: 'Long-term care insurance',
    annualPremiumAtIssue: 2013,
    annualPremiumAtCareStart: 9004,
    annualPremiumGrowthRate: Math.pow(9004 / 2013, 1 / 27) - 1,
    singlePremium: 0,
    initialLifetimePool: 175000,
    lifetimePoolAtCareStart: 388726,
    initialMonthlyBenefit: 5000,
    monthlyBenefitAtCareStart: 11106,
    initialDeductible: 15000,
    deductibleAtCareStart: 33319,
    coinsurance: 20,
    inflationRiderRate: 3,
    inflationRiderLabel: '3% compound CPI-U purchase option',
    benefitInflationDuringClaim: 3,
    residualAssetAtCareStart: 0,
    extractedFacts: [
      '$175,000 initial lifetime maximum.',
      '$5,000 initial monthly benefit.',
      '20 percent coinsurance.',
      '$15,000 deductible grows with inflation.',
      'CPI-U purchase option modeled at 3 percent.',
    ],
  },
  {
    id: 'forecare',
    name: 'ForeCare',
    policyType: 'Fixed annuity with LTC benefits',
    annualPremiumAtIssue: 0,
    annualPremiumAtCareStart: 0,
    annualPremiumGrowthRate: 0,
    singlePremium: 100000,
    initialLifetimePool: 303788,
    lifetimePoolAtCareStart: 303788,
    initialMonthlyBenefit: 4167,
    monthlyBenefitAtCareStart: 4167,
    initialDeductible: 0,
    deductibleAtCareStart: 0,
    coinsurance: 0,
    inflationRiderRate: 0,
    inflationRiderLabel: 'None',
    benefitInflationDuringClaim: 0,
    residualAssetAtCareStart: 103788,
    extractedFacts: [
      '$100,000 single premium.',
      'Single life premier coverage.',
      'No LTC inflation rider.',
      '$303,788 guaranteed total LTC benefit at age 82.',
      '$4,167 guaranteed monthly benefit cap.',
    ],
  },
];

export const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

export function formatDollars(value: number) {
  return dollars.format(Math.round(value));
}

export function safeNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function monthlyGrowth(annualRate: number, monthIndex: number) {
  return Math.pow(1 + annualRate / 100, monthIndex / 12);
}

export function projectPolicyAtCareAge(policy: PolicyModel, assumptions: Assumptions): PolicyModel {
  const yearsToCare = Math.max(0, assumptions.careStartAge - assumptions.currentAge);
  const riderGrowth = Math.pow(1 + policy.inflationRiderRate / 100, yearsToCare);
  const premiumGrowth = Math.pow(1 + policy.annualPremiumGrowthRate, yearsToCare);

  return {
    ...policy,
    annualPremiumAtCareStart:
      policy.annualPremiumAtIssue > 0 ? policy.annualPremiumAtIssue * premiumGrowth : 0,
    lifetimePoolAtCareStart:
      policy.inflationRiderRate > 0
        ? policy.initialLifetimePool * riderGrowth
        : policy.lifetimePoolAtCareStart,
    monthlyBenefitAtCareStart:
      policy.inflationRiderRate > 0
        ? policy.initialMonthlyBenefit * riderGrowth
        : policy.monthlyBenefitAtCareStart,
    deductibleAtCareStart:
      policy.inflationRiderRate > 0 ? policy.initialDeductible * riderGrowth : policy.deductibleAtCareStart,
  };
}

export function estimatePremiumsToCareStart(policy: PolicyModel, assumptions: Assumptions) {
  if (policy.annualPremiumAtIssue <= 0) {
    return policy.singlePremium;
  }

  const yearsToCare = Math.max(0, assumptions.careStartAge - assumptions.currentAge);
  let totalPremium = 0;

  for (let year = 0; year < yearsToCare; year += 1) {
    totalPremium += policy.annualPremiumAtIssue * Math.pow(1 + policy.annualPremiumGrowthRate, year);
  }

  return totalPremium;
}

export function firstPayment(policy: PolicyModel) {
  return policy.singlePremium > 0 ? policy.singlePremium : policy.annualPremiumAtIssue;
}

function rangeScore(value: number, range: [number, number | null]) {
  const [minimum, maximum] = range;

  if (value >= minimum && (maximum === null || value <= maximum)) {
    return 1;
  }

  if (value < minimum) {
    return Math.max(0, value / minimum);
  }

  return maximum ? Math.max(0.65, maximum / value) : 0;
}

function monthlyRange(preference: ClientPreferences['monthlyBenefitPreference']): [number, number | null] {
  if (preference === '3000-5000') return [3000, 5000];
  if (preference === '8000-plus') return [8000, null];
  return [5000, 8000];
}

function coverageRange(preference: ClientPreferences['preferredCoverageAmount']): [number, number | null] {
  if (preference === '100000-250000') return [100000, 250000];
  if (preference === '500000-plus') return [500000, null];
  return [250000, 500000];
}

function premiumTypeScore(policy: PolicyModel, preference: ClientPreferences['premiumType']) {
  if (preference === 'upfront') {
    return policy.singlePremium > 0 ? 1 : 0.05;
  }

  return policy.annualPremiumAtIssue > 0 ? 1 : 0.05;
}

function premiumAmountForPreference(policy: PolicyModel, preference: ClientPreferences['premiumType']) {
  return preference === 'annual' ? policy.annualPremiumAtIssue : policy.singlePremium;
}

function premiumRange(preference: ClientPreferences['premiumRange']): [number, number | null] {
  if (preference === 'annual-under-5000') return [0, 5000];
  if (preference === 'annual-5000-10000') return [5000, 10000];
  if (preference === 'annual-10000-plus') return [10000, null];
  if (preference === 'upfront-under-50000') return [0, 50000];
  if (preference === 'upfront-125000-plus') return [125000, null];
  return [50000, 125000];
}

export function premiumRangeScore(
  policy: PolicyModel,
  premiumTypePreference: ClientPreferences['premiumType'],
  rangePreference: ClientPreferences['premiumRange']
) {
  const amount = premiumAmountForPreference(policy, premiumTypePreference);

  if (amount <= 0) {
    return 0;
  }

  return rangeScore(amount, premiumRange(rangePreference));
}

function policyTypePreferenceScore(
  policy: PolicyModel,
  preference: ClientPreferences['policyTypePreference']
) {
  const isAssetBased = policy.residualAssetAtCareStart > 0 || policy.singlePremium > 0;

  if (preference === 'asset') {
    return isAssetBased ? 1 : 0.25;
  }

  return isAssetBased ? 0.05 : 1;
}

function inflationRiderScore(
  policy: PolicyModel,
  preference: ClientPreferences['inflationRiderPreference']
) {
  const hasRider = policy.inflationRiderRate > 0;

  if (preference === 'required') {
    return hasRider ? 1 : 0.15;
  }

  if (preference === 'preferred') {
    return hasRider ? 1 : 0.55;
  }

  return hasRider ? 0.75 : 1;
}

export function projectCareMonths(assumptions: Assumptions, phases: CarePhase[]): MonthProjection[] {
  const yearsToCare = Math.max(0, assumptions.careStartAge - assumptions.currentAge);
  let monthIndex = 0;

  return phases.flatMap((phase) =>
    Array.from({ length: Math.max(0, Math.round(phase.months)) }, () => {
      const projectedCost =
        phase.todayMonthlyCost *
        Math.pow(1 + assumptions.careCostInflation / 100, yearsToCare + monthIndex / 12);

      monthIndex += 1;

      return {
        month: monthIndex,
        phaseId: phase.id,
        phaseName: phase.name,
        projectedCost,
      };
    })
  );
}

function coverageRate(covered: number, careCost: number) {
  return careCost === 0 ? 0 : covered / careCost;
}

export function analyzePolicy(
  policy: PolicyModel,
  assumptions: Assumptions,
  phases: CarePhase[],
  months: MonthProjection[],
  preferences: ClientPreferences,
  maxRoi = 1
): PolicyResult {
  let remainingPool = policy.lifetimePoolAtCareStart;
  let remainingDeductible = policy.deductibleAtCareStart;
  let totalCovered = 0;
  let runOutMonth: number | null = null;

  const phaseBuckets = new Map<string, PhaseResult>();

  for (const phase of phases) {
    phaseBuckets.set(phase.id, {
      id: phase.id,
      name: phase.name,
      months: phase.months,
      firstMonthCost: 0,
      lastMonthCost: 0,
      totalCost: 0,
      covered: 0,
      outOfPocket: 0,
    });
  }

  for (const month of months) {
    const phase = phaseBuckets.get(month.phaseId);
    if (!phase) continue;

    const benefitCap =
      policy.monthlyBenefitAtCareStart *
      monthlyGrowth(policy.benefitInflationDuringClaim, month.month - 1);
    const deductibleApplied = Math.min(remainingDeductible, month.projectedCost);
    const eligibleCost = Math.max(0, month.projectedCost - deductibleApplied);
    const afterCoinsurance = eligibleCost * (1 - policy.coinsurance / 100);
    const paid = Math.min(afterCoinsurance, benefitCap, remainingPool);

    remainingDeductible -= deductibleApplied;
    remainingPool -= paid;
    totalCovered += paid;

    if (runOutMonth === null && remainingPool <= 0.01) {
      runOutMonth = month.month;
    }

    phase.firstMonthCost = phase.firstMonthCost || month.projectedCost;
    phase.lastMonthCost = month.projectedCost;
    phase.totalCost += month.projectedCost;
    phase.covered += paid;
    phase.outOfPocket += month.projectedCost - paid;
  }

  const totalCareCost = months.reduce((sum, month) => sum + month.projectedCost, 0);
  const estimatedCapitalIn = estimatePremiumsToCareStart(policy, assumptions);
  const requiredFirstPayment = firstPayment(policy);
  const careRoi = estimatedCapitalIn === 0 ? 0 : totalCovered / estimatedCapitalIn;
  const monthlyFit = rangeScore(
    policy.monthlyBenefitAtCareStart,
    monthlyRange(preferences.monthlyBenefitPreference)
  );
  const coverageFit = rangeScore(
    policy.lifetimePoolAtCareStart,
    coverageRange(preferences.preferredCoverageAmount)
  );
  const assetFit =
    preferences.policyTypePreference === 'asset' && policy.residualAssetAtCareStart > 0
      ? Math.min(1, policy.residualAssetAtCareStart / 100000)
      : 0;
  const careSettingFit =
    preferences.carePreference === 'home'
      ? Math.min(1, policy.monthlyBenefitAtCareStart / 8000)
      : preferences.carePreference === 'facility'
        ? Math.min(1, policy.lifetimePoolAtCareStart / 500000)
        : 0.75;
  const premiumFit = maxRoi === 0 ? 0 : Math.min(1, careRoi / maxRoi);
  const policyTypeFit = policyTypePreferenceScore(policy, preferences.policyTypePreference);
  const premiumTypeFit = premiumTypeScore(policy, preferences.premiumType);
  const premiumRangeFit = premiumRangeScore(policy, preferences.premiumType, preferences.premiumRange);
  const inflationFit = inflationRiderScore(policy, preferences.inflationRiderPreference);
  const weights = {
    claim: 0.18,
    monthly: 0.09,
    pool: 0.1,
    asset: 0.04,
    policyType: 0.3,
    premium: 0.08,
    premiumType: 0.08,
    premiumRange: 0.07,
    care: 0.03,
    inflation: 0.03,
  };
  const preferenceScore =
    100 *
    (coverageRate(totalCovered, totalCareCost) * weights.claim +
      monthlyFit * weights.monthly +
      coverageFit * weights.pool +
      assetFit * weights.asset +
      policyTypeFit * weights.policyType +
      premiumFit * weights.premium +
      premiumTypeFit * weights.premiumType +
      premiumRangeFit * weights.premiumRange +
      careSettingFit * weights.care +
      inflationFit * weights.inflation);

  return {
    policy,
    totalCareCost,
    totalCovered,
    outOfPocket: totalCareCost - totalCovered,
    coverageRate: coverageRate(totalCovered, totalCareCost),
    runOutMonth,
    remainingBenefit: remainingPool,
    estimatedCapitalIn,
    firstPayment: requiredFirstPayment,
    careRoi,
    netClaimValue: totalCovered + policy.residualAssetAtCareStart - estimatedCapitalIn,
    preferenceScore,
    phaseResults: Array.from(phaseBuckets.values()),
  };
}
