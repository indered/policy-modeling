import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  Fieldset,
  Input,
  Label,
  NumberField,
  Radio,
  RadioGroup,
  Slider,
  TextField,
} from '@heroui/react';
import {
  analyzePolicy,
  defaultAssumptions,
  defaultPhases,
  defaultPreferences,
  formatDollars,
  percent,
  policies,
  preferenceOptions,
  premiumRangeScore,
  projectCareMonths,
  projectPolicyAtCareAge,
  safeNumber,
  type Assumptions,
  type CarePhase,
  type ClientPreferences,
  type CompareRow,
  type CompareWinner,
  type PolicyResult,
} from './policyModel';

function NumberControl({
  label,
  value,
  onChange,
  minValue = 0,
  step = 1,
  formatOptions,
}: {
  label: string;
  value: number;
  onChange: (nextValue: number) => void;
  minValue?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
}) {
  return (
    <NumberField
      className="space-y-1"
      formatOptions={formatOptions}
      minValue={minValue}
      step={step}
      value={value}
      onChange={(nextValue) => onChange(safeNumber(nextValue, value))}
    >
      <Label className="text-[10px] font-medium uppercase tracking-normal text-default-500">
        {label}
      </Label>
      <NumberField.Group className="flex h-9 overflow-hidden rounded-md border border-default-300 bg-content1">
        <NumberField.Input className="min-w-0 flex-1 bg-transparent px-2.5 text-xs outline-none" />
      </NumberField.Group>
    </NumberField>
  );
}

function PreferenceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { key: string; label: string }[];
  onChange: (nextValue: string) => void;
}) {
  return (
    <RadioGroup
      aria-label={label}
      className="rounded-md border border-default-200 bg-default-50 p-2"
      value={value}
      onChange={onChange}
    >
      <Label className="text-[9px] font-medium uppercase tracking-normal text-default-500">
        {label}
      </Label>
      <div className="mt-1 grid grid-cols-1 gap-0.5">
        {options.map((option) => (
          <Radio
            key={option.key}
            className="preference-radio rounded-md"
            value={option.key}
          >
            <Radio.Content
              className={`flex min-h-6 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] transition-colors ${
                value === option.key
                  ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                  : 'border-transparent bg-transparent text-default-700 hover:bg-default-50'
              }`}
            >
              <Radio.Control className="grid size-3.5 shrink-0 place-items-center rounded-full border border-default-400 bg-content1">
                <Radio.Indicator className="size-2 rounded-full bg-foreground" />
              </Radio.Control>
              <span className="leading-4">{option.label}</span>
            </Radio.Content>
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

function ComparisonTable({
  title,
  description,
  rows,
  winner,
}: {
  title: string;
  description?: string;
  rows: CompareRow[];
  winner?: CompareWinner;
}) {
  const winnerName =
    winner?.policy === 'nyl' ? 'NYL My Care' : winner?.policy === 'forecare' ? 'ForeCare' : 'Tie';
  const hasMeaning = rows.some((row) => row.meaning);
  const gridClass = hasMeaning
    ? 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.9fr)]'
    : 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]';
  const mobileValueClass = (highlight?: 'nyl' | 'forecare') =>
    `text-[11px] leading-5 tabular-nums break-words ${
      highlight ? 'font-semibold text-foreground' : 'text-default-700'
    }`;

  return (
    <Card className="border border-default-200 bg-content1">
      <CardHeader className="border-b border-default-200 p-3">
        <CardTitle className="text-xs sm:text-sm">{title}</CardTitle>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-0">
        <div className="lg:hidden">
          {winner ? (
            <div className="border-b border-emerald-950 bg-emerald-900 px-3 py-3 text-[11px] font-semibold text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>Winner</span>
                <span className="text-right">
                  {winner.policy === 'tie' ? winnerName : `✓ ${winnerName}`}
                </span>
              </div>
              <div className="mt-1.5 text-[10px] font-normal leading-4 text-emerald-50">
                {winner.detail}
              </div>
            </div>
          ) : null}
          {rows.map((row) => (
            <div key={row.label} className="border-b border-default-200 px-3 py-3 last:border-b-0">
              <div className="text-[11px] font-semibold leading-5 text-foreground">{row.label}</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-md border border-default-200 bg-default-50 px-2.5 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-normal text-default-500">
                    NYL My Care
                  </div>
                  <div className={mobileValueClass(row.highlight === 'nyl' ? 'nyl' : undefined)}>
                    {row.stacked ? (
                      <div className="space-y-0.5">
                        <div>{row.nyl.split('\n')[0]}</div>
                        <div className="text-[10px] font-normal leading-4 text-default-500">
                          {row.nyl.split('\n')[1]}
                        </div>
                      </div>
                    ) : (
                      row.nyl
                    )}
                  </div>
                </div>
                <div className="rounded-md border border-default-200 bg-default-50 px-2.5 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-normal text-default-500">
                    ForeCare
                  </div>
                  <div className={mobileValueClass(row.highlight === 'forecare' ? 'forecare' : undefined)}>
                    {row.stacked ? (
                      <div className="space-y-0.5">
                        <div>{row.forecare.split('\n')[0]}</div>
                        <div className="text-[10px] font-normal leading-4 text-default-500">
                          {row.forecare.split('\n')[1]}
                        </div>
                      </div>
                    ) : (
                      row.forecare
                    )}
                  </div>
                </div>
              </div>
              {hasMeaning && row.meaning ? (
                <div className="mt-2 text-[11px] leading-5 text-default-600">{row.meaning}</div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className={`${gridClass} gap-4 border-b border-default-200 bg-default-50 px-3 py-2 text-[10px] font-medium uppercase tracking-normal text-default-500`}>
            <span className="min-w-0 whitespace-nowrap">Metric</span>
            <span className="min-w-0 whitespace-nowrap text-right">NYL My Care</span>
            <span className="min-w-0 whitespace-nowrap text-right">ForeCare</span>
            {hasMeaning ? <span className="min-w-0 whitespace-nowrap text-left">What it means</span> : null}
          </div>
          {winner ? (
            <div className={`${gridClass} gap-4 border-b border-emerald-950 bg-emerald-900 px-3 py-2.5 text-[11px] font-semibold text-white sm:text-xs`}>
              <span className="min-w-0">Winner</span>
              <span className="min-w-0 whitespace-nowrap text-right">
                {winner.policy === 'nyl' ? `✓ ${winnerName}: ${winner.detail}` : winner.policy === 'tie' ? 'Tie' : '-'}
              </span>
              <span className="min-w-0 whitespace-nowrap text-right">
                {winner.policy === 'forecare' ? `✓ ${winnerName}: ${winner.detail}` : winner.policy === 'tie' ? 'Tie' : '-'}
              </span>
              {hasMeaning ? <span className="min-w-0 text-left font-normal">{winner.detail}</span> : null}
            </div>
          ) : null}
          {rows.map((row) => (
            <div
              key={row.label}
              className={`${gridClass} gap-4 border-b border-default-200 px-3 py-2.5 text-[11px] last:border-b-0 sm:text-xs`}
            >
              <span className="min-w-0 font-medium text-default-700">{row.label}</span>
              {row.stacked ? (
                <>
                  <div className="min-w-0 text-right tabular-nums">
                    <div className={row.highlight === 'nyl' ? 'font-semibold text-success-700' : ''}>
                      {row.nyl.split('\n')[0]}
                    </div>
                    <div className="text-[10px] text-default-500">{row.nyl.split('\n')[1]}</div>
                  </div>
                  <div className="min-w-0 text-right tabular-nums">
                    <div className={row.highlight === 'forecare' ? 'font-semibold text-success-700' : ''}>
                      {row.forecare.split('\n')[0]}
                    </div>
                    <div className="text-[10px] text-default-500">{row.forecare.split('\n')[1]}</div>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className={`min-w-0 whitespace-nowrap text-right tabular-nums ${
                      row.highlight === 'nyl' ? 'font-semibold text-success-700' : ''
                    }`}
                  >
                    {row.nyl}
                  </span>
                  <span
                    className={`min-w-0 whitespace-nowrap text-right tabular-nums ${
                      row.highlight === 'forecare' ? 'font-semibold text-success-700' : ''
                    }`}
                  >
                    {row.forecare}
                  </span>
                </>
              )}
              {hasMeaning ? <span className="min-w-0 text-left leading-5 text-default-600">{row.meaning ?? ' '}</span> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StartAgeSlider({
  assumptions,
  nyl,
  forecare,
  onChange,
}: {
  assumptions: Assumptions;
  nyl: PolicyResult;
  forecare: PolicyResult;
  onChange: (careStartAge: number) => void;
}) {
  const minAge = Math.max(assumptions.currentAge, 50);
  const maxAge = 95;
  const sliderValue = Math.min(maxAge, Math.max(minAge, assumptions.careStartAge));

  const handleChange = (value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    onChange(Math.round(nextValue));
  };

  return (
    <div className="rounded-md border border-default-200 bg-default-50 p-3">
      <Slider
        aria-label="LTC start age"
        className="space-y-2"
        maxValue={maxAge}
        minValue={minAge}
        step={1}
        value={sliderValue}
        onChange={handleChange}
      >
        <div className="flex items-center justify-between gap-2">
          <Label className="text-[10px] font-medium uppercase tracking-normal text-default-500">
            LTC starts at age
          </Label>
          <Slider.Output className="text-xs font-semibold tabular-nums text-default-800" />
        </div>
        <Slider.Track className="relative h-2 rounded-full bg-default-200">
          <Slider.Fill className="absolute h-full rounded-full bg-default-700" />
          <Slider.Thumb className="top-1/2 size-4 rounded-full border-2 border-content1 bg-default-800 shadow-sm" />
        </Slider.Track>
        <div className="flex justify-between text-[10px] text-default-500">
          <span>Age {minAge}</span>
          <span>Age {maxAge}</span>
        </div>
      </Slider>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-default-200 bg-content1 p-2">
          <p className="text-[10px] font-medium text-default-500">NYL value</p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums">{formatDollars(nyl.totalCovered)}</p>
          <p className="text-[10px] text-default-500">{nyl.careRoi.toFixed(2)}x care ROI</p>
        </div>
        <div className="rounded-md border border-default-200 bg-content1 p-2">
          <p className="text-[10px] font-medium text-default-500">ForeCare value</p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums">{formatDollars(forecare.totalCovered)}</p>
          <p className="text-[10px] text-default-500">{forecare.careRoi.toFixed(2)}x care ROI</p>
        </div>
      </div>
    </div>
  );
}

function MobileCustomerInfo({
  assumptions,
  months,
  setAssumptions,
  nyl,
  forecare,
}: {
  assumptions: Assumptions;
  months: number;
  setAssumptions: Dispatch<SetStateAction<Assumptions>>;
  nyl: PolicyResult;
  forecare: PolicyResult;
}) {
  return (
    <Card className="border border-default-200 bg-content1 lg:hidden">
      <CardContent className="p-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Chip className="text-[10px]" variant="soft">
            Customer inputs
          </Chip>
          <span className="text-[10px] font-medium text-default-500">{months} care months</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <TextField
            aria-label="Customer name"
            className="col-span-3 space-y-1"
            value={assumptions.clientName}
            onChange={(clientName) =>
              setAssumptions((current) => ({ ...current, clientName }))
            }
          >
            <Input className="h-8 w-full rounded-md border border-default-300 bg-content1 px-2.5 text-[11px] outline-none" />
          </TextField>
          <NumberControl
            label="Age"
            value={assumptions.currentAge}
            onChange={(currentAge) =>
              setAssumptions((current) => ({ ...current, currentAge }))
            }
          />
          <NumberControl
            label="Claim"
            value={assumptions.careStartAge}
            onChange={(careStartAge) =>
              setAssumptions((current) => ({ ...current, careStartAge }))
            }
          />
          <NumberControl
            formatOptions={{ maximumFractionDigits: 1 }}
            label="Inflation"
            step={0.1}
            value={assumptions.careCostInflation}
            onChange={(careCostInflation) =>
              setAssumptions((current) => ({ ...current, careCostInflation }))
            }
          />
        </div>
        <div className="mt-2">
          <StartAgeSlider
            assumptions={assumptions}
            forecare={forecare}
            nyl={nyl}
            onChange={(careStartAge) =>
              setAssumptions((current) => ({ ...current, careStartAge }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CalculationLogic() {
  const items = [
    {
      title: 'Projected coverage',
      body:
        'We project each care bill to the selected LTC start age. Then we apply each policy month by month. The policy pays only up to its monthly limit and remaining benefit pool. Anything not paid by the policy becomes the client gap. Runout means the policy pool is used up.',
    },
    {
      title: 'ROI analysis',
      body:
        'We compare what the client pays into the policy with what the policy may pay back during care. For annual premium, we add the premiums paid before care starts. For upfront premium, we use the single payment. Care ROI means policy benefit received for each premium dollar paid.',
    },
    {
      title: 'Policy comparison',
      body:
        'The comparison is a plain scorecard. Each visible factor gets one point for the policy that fits the selected preference or has the stronger modeled value. Ties stay tied. There is no hidden bonus for either policy.',
    },
  ];

  return (
    <Card className="border border-default-200 bg-content1">
      <CardHeader className="border-b border-default-200 p-3">
        <CardTitle className="text-xs sm:text-sm">Calculation logic</CardTitle>
        <CardDescription className="text-xs">
          The exact formulas driving the coverage, ROI, and fit outputs.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 p-3 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-md border border-default-200 bg-default-50 p-3">
            <p className="text-[11px] font-semibold text-default-800 sm:text-xs">{item.title}</p>
            <p className="mt-1 text-[11px] leading-5 text-default-600">{item.body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [assumptions, setAssumptions] = useState<Assumptions>(defaultAssumptions);
  const [phases, setPhases] = useState<CarePhase[]>(defaultPhases);
  const [preferences, setPreferences] = useState<ClientPreferences>(defaultPreferences);

  const careMonths = useMemo(() => projectCareMonths(assumptions, phases), [assumptions, phases]);
  const modeledPolicies = useMemo(
    () => policies.map((policy) => projectPolicyAtCareAge(policy, assumptions)),
    [assumptions]
  );
  const results = useMemo(() => {
    const preliminary = modeledPolicies.map((policy) =>
      analyzePolicy(policy, assumptions, phases, careMonths, preferences)
    );
    const maxRoi = Math.max(...preliminary.map((result) => result.careRoi), 1);

    return modeledPolicies.map((policy) =>
      analyzePolicy(policy, assumptions, phases, careMonths, preferences, maxRoi)
    );
  }, [assumptions, careMonths, modeledPolicies, phases, preferences]);

  const [nyl, forecare] = results;
  const totalCareCost = nyl.totalCareCost;
  const bestFit = nyl.preferenceScore >= forecare.preferenceScore ? nyl : forecare;
  const bestCoverage = nyl.totalCovered >= forecare.totalCovered ? nyl : forecare;
  const bestOutOfPocket = nyl.outOfPocket <= forecare.outOfPocket ? nyl : forecare;
  const bestRoi = nyl.careRoi >= forecare.careRoi ? nyl : forecare;

  const updatePreference = <T extends keyof ClientPreferences>(
    key: T,
    value: ClientPreferences[T]
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const updatePhase = (phaseId: string, patch: Partial<CarePhase>) => {
    setPhases((current) =>
      current.map((phase) => (phase.id === phaseId ? { ...phase, ...patch } : phase))
    );
  };

  const policyRows: CompareRow[] = [
    { label: 'Policy type', nyl: nyl.policy.policyType, forecare: forecare.policy.policyType },
    {
      label: 'Premium structure',
      nyl: `Annual, ${formatDollars(nyl.policy.annualPremiumAtIssue)} today`,
      forecare: `Upfront, ${formatDollars(forecare.policy.singlePremium)}`,
      highlight: preferences.premiumType === 'annual' ? 'nyl' : 'forecare',
    },
    {
      label: 'Premium at LTC age',
      nyl: nyl.policy.annualPremiumAtCareStart > 0 ? formatDollars(nyl.policy.annualPremiumAtCareStart) : '$0',
      forecare:
        forecare.policy.annualPremiumAtCareStart > 0
          ? formatDollars(forecare.policy.annualPremiumAtCareStart)
          : '$0',
      highlight: nyl.policy.annualPremiumAtCareStart <= forecare.policy.annualPremiumAtCareStart ? 'nyl' : 'forecare',
    },
    {
      label: 'Total premium by LTC age',
      nyl: formatDollars(nyl.estimatedCapitalIn),
      forecare: formatDollars(forecare.estimatedCapitalIn),
      highlight: nyl.estimatedCapitalIn <= forecare.estimatedCapitalIn ? 'nyl' : 'forecare',
    },
    {
      label: 'Preservation value',
      nyl: nyl.policy.residualAssetAtCareStart > 0 ? 'Yes' : 'No',
      forecare: forecare.policy.residualAssetAtCareStart > 0 ? 'Yes' : 'No',
      highlight: 'forecare',
    },
    {
      label: 'Inflation rider',
      nyl: nyl.policy.inflationRiderLabel,
      forecare: forecare.policy.inflationRiderLabel,
      highlight: 'nyl',
    },
    {
      label: 'Monthly benefit at LTC age',
      nyl: formatDollars(nyl.policy.monthlyBenefitAtCareStart),
      forecare: formatDollars(forecare.policy.monthlyBenefitAtCareStart),
      highlight: 'nyl',
    },
    {
      label: 'Lifetime LTC pool at LTC age',
      nyl: formatDollars(nyl.policy.lifetimePoolAtCareStart),
      forecare: formatDollars(forecare.policy.lifetimePoolAtCareStart),
      highlight: 'nyl',
    },
    {
      label: 'Deductible',
      nyl: formatDollars(nyl.policy.deductibleAtCareStart),
      forecare: formatDollars(forecare.policy.deductibleAtCareStart),
      highlight: 'forecare',
    },
    {
      label: 'Coinsurance',
      nyl: `${nyl.policy.coinsurance}%`,
      forecare: `${forecare.policy.coinsurance}%`,
      highlight: 'forecare',
    },
    {
      label: 'No-claim asset value',
      nyl: formatDollars(nyl.policy.residualAssetAtCareStart),
      forecare: formatDollars(forecare.policy.residualAssetAtCareStart),
      highlight: 'forecare',
    },
  ];

  const coverageRows: CompareRow[] = [
    {
      label: 'Total projected care cost after inflation',
      nyl: formatDollars(totalCareCost),
      forecare: formatDollars(totalCareCost),
      meaning: (
        <>
          The full care bill after inflation at the selected LTC start age.
        </>
      ),
    },
    {
      label: 'Covered by policy',
      nyl: formatDollars(nyl.totalCovered),
      forecare: formatDollars(forecare.totalCovered),
      meaning: (
        <>
          This is the amount the policy pays toward the care bill.
        </>
      ),
      highlight: bestCoverage.policy.id === 'nyl' ? 'nyl' : 'forecare',
    },
    {
      label: 'Paid out-of-pocket',
      nyl: formatDollars(nyl.outOfPocket),
      forecare: formatDollars(forecare.outOfPocket),
      meaning: (
        <>
          This is what the client still pays after the policy pays its share.
        </>
      ),
      highlight: bestOutOfPocket.policy.id === 'nyl' ? 'nyl' : 'forecare',
    },
    {
      label: 'Coverage rate',
      nyl: percent.format(nyl.coverageRate),
      forecare: percent.format(forecare.coverageRate),
      meaning: (
        <>
          The percent of the total care cost that the policy covers.
        </>
      ),
      highlight: nyl.coverageRate >= forecare.coverageRate ? 'nyl' : 'forecare',
    },
    {
      label: 'Benefits run out',
      nyl: nyl.runOutMonth ? `Month ${nyl.runOutMonth}` : 'No',
      forecare: forecare.runOutMonth ? `Month ${forecare.runOutMonth}` : 'No',
      meaning: (
        <>
          This tells you when the policy pool is used up, if it happens during the claim.
        </>
      ),
      highlight: forecare.runOutMonth ? 'nyl' : 'forecare',
    },
    {
      label: 'Benefit left after projection',
      nyl: formatDollars(nyl.remainingBenefit),
      forecare: formatDollars(forecare.remainingBenefit),
      meaning: (
        <>
          Any benefit dollars still left at the end of the modeled care event.
        </>
      ),
      highlight: forecare.remainingBenefit >= nyl.remainingBenefit ? 'forecare' : 'nyl',
    },
    ...phases.map((phase) => {
      const nylPhase = nyl.phaseResults.find((item) => item.id === phase.id);
      const forecarePhase = forecare.phaseResults.find((item) => item.id === phase.id);
      const nylMonthlyCovered = nylPhase && phase.months ? nylPhase.covered / phase.months : 0;
      const nylMonthlyGap = nylPhase && phase.months ? nylPhase.outOfPocket / phase.months : 0;
      const forecareMonthlyCovered =
        forecarePhase && phase.months ? forecarePhase.covered / phase.months : 0;
      const forecareMonthlyGap = forecarePhase && phase.months ? forecarePhase.outOfPocket / phase.months : 0;
      const monthlyBill = nylPhase?.firstMonthCost ?? forecarePhase?.firstMonthCost ?? 0;
      const lastMonthlyBill = nylPhase?.lastMonthCost ?? forecarePhase?.lastMonthCost ?? 0;

      return {
        label: `${phase.name} monthly cost`,
        nyl: nylPhase
          ? `covered ${formatDollars(nylMonthlyCovered)}/mo\ngap ${formatDollars(nylMonthlyGap)}/mo`
          : '-',
        forecare: forecarePhase
          ? `covered ${formatDollars(forecareMonthlyCovered)}/mo\ngap ${formatDollars(forecareMonthlyGap)}/mo`
          : '-',
        meaning: (
          <>
            Monthly bill rises from <strong>{formatDollars(monthlyBill)}/mo</strong> to{' '}
            <strong>{formatDollars(lastMonthlyBill)}/mo</strong> after inflation.
          </>
        ),
        stacked: true,
        highlight: (nylPhase?.covered ?? 0) >= (forecarePhase?.covered ?? 0) ? 'nyl' : 'forecare',
      } satisfies CompareRow;
    }),
  ];

  const roiRows: CompareRow[] = [
    {
      label: 'Premium paid by LTC start',
      nyl: formatDollars(nyl.estimatedCapitalIn),
      forecare: formatDollars(forecare.estimatedCapitalIn),
      highlight: nyl.estimatedCapitalIn <= forecare.estimatedCapitalIn ? 'nyl' : 'forecare',
    },
    {
      label: 'Care benefit received',
      nyl: formatDollars(nyl.totalCovered),
      forecare: formatDollars(forecare.totalCovered),
      highlight: nyl.totalCovered >= forecare.totalCovered ? 'nyl' : 'forecare',
    },
    {
      label: 'Care benefit per premium dollar',
      nyl: `${nyl.careRoi.toFixed(2)}x`,
      forecare: `${forecare.careRoi.toFixed(2)}x`,
      highlight: nyl.careRoi >= forecare.careRoi ? 'nyl' : 'forecare',
    },
    {
      label: 'Net value if claim occurs',
      nyl: formatDollars(nyl.netClaimValue),
      forecare: formatDollars(forecare.netClaimValue),
      highlight: nyl.netClaimValue >= forecare.netClaimValue ? 'nyl' : 'forecare',
    },
    {
      label: 'No-claim value',
      nyl: formatDollars(nyl.policy.residualAssetAtCareStart),
      forecare: formatDollars(forecare.policy.residualAssetAtCareStart),
      highlight: forecare.policy.residualAssetAtCareStart >= nyl.policy.residualAssetAtCareStart ? 'forecare' : 'nyl',
    },
  ];

  const tradeoffRows: CompareRow[] = [
    {
      label: 'Policy type',
      nyl: 'Pure LTC insurance',
      forecare: 'Asset-based LTC annuity',
      highlight: preferences.policyTypePreference === 'pure-ltc' ? 'nyl' : 'forecare',
    },
    {
      label: 'Premium structure',
      nyl: `${formatDollars(nyl.policy.annualPremiumAtIssue)} per year`,
      forecare: `${formatDollars(forecare.policy.singlePremium)} upfront`,
      highlight: preferences.premiumType === 'annual' ? 'nyl' : 'forecare',
    },
    {
      label: 'Premium range fit',
      nyl: `${formatDollars(nyl.policy.annualPremiumAtIssue)} annual start`,
      forecare: `${formatDollars(forecare.policy.singlePremium)} upfront start`,
      highlight:
        premiumRangeScore(nyl.policy, preferences.premiumType, preferences.premiumRange) >=
        premiumRangeScore(forecare.policy, preferences.premiumType, preferences.premiumRange)
          ? 'nyl'
          : 'forecare',
    },
    {
      label: 'Inflation rider',
      nyl: nyl.policy.inflationRiderLabel,
      forecare: forecare.policy.inflationRiderLabel,
      highlight: nyl.policy.inflationRiderRate >= forecare.policy.inflationRiderRate ? 'nyl' : 'forecare',
    },
    {
      label: 'Monthly benefit at LTC age',
      nyl: formatDollars(nyl.policy.monthlyBenefitAtCareStart),
      forecare: formatDollars(forecare.policy.monthlyBenefitAtCareStart),
      highlight: nyl.policy.monthlyBenefitAtCareStart >= forecare.policy.monthlyBenefitAtCareStart ? 'nyl' : 'forecare',
    },
    {
      label: 'Lifetime pool at LTC age',
      nyl: formatDollars(nyl.policy.lifetimePoolAtCareStart),
      forecare: formatDollars(forecare.policy.lifetimePoolAtCareStart),
      highlight: nyl.policy.lifetimePoolAtCareStart >= forecare.policy.lifetimePoolAtCareStart ? 'nyl' : 'forecare',
    },
    {
      label: 'Care setting fit',
      nyl:
        preferences.carePreference === 'home'
          ? 'Stronger for home care'
          : preferences.carePreference === 'facility'
            ? 'Stronger for facility care'
            : 'Balanced care fit',
      forecare:
        preferences.carePreference === 'home'
          ? 'Lower monthly cap'
          : preferences.carePreference === 'facility'
            ? 'No-claim value plus capped care'
            : 'Balanced care fit',
      highlight: preferences.carePreference === 'home' ? 'nyl' : 'forecare',
    },
    {
      label: 'Claim coverage',
      nyl: `${formatDollars(nyl.totalCovered)} covered / ${formatDollars(nyl.outOfPocket)} gap`,
      forecare: `${formatDollars(forecare.totalCovered)} covered / ${formatDollars(forecare.outOfPocket)} gap`,
      highlight: bestCoverage.policy.id === 'nyl' ? 'nyl' : 'forecare',
    },
    {
      label: 'Benefits run out',
      nyl: nyl.runOutMonth ? `Month ${nyl.runOutMonth}` : 'No',
      forecare: forecare.runOutMonth ? `No` : 'No',
      highlight: nyl.runOutMonth ? 'nyl' : 'forecare',
    },
    {
      label: 'No-claim value',
      nyl: formatDollars(nyl.policy.residualAssetAtCareStart),
      forecare: formatDollars(forecare.policy.residualAssetAtCareStart),
      highlight: forecare.policy.residualAssetAtCareStart >= nyl.policy.residualAssetAtCareStart ? 'forecare' : 'nyl',
    },
    {
      label: 'Coverage and runout summary',
      nyl: `${formatDollars(nyl.totalCovered)} covered, ${nyl.runOutMonth ? `runs out in month ${nyl.runOutMonth}` : 'does not run out'}`,
      forecare: `${formatDollars(forecare.totalCovered)} covered, ${forecare.runOutMonth ? `runs out in month ${forecare.runOutMonth}` : 'does not run out'}`,
      highlight:
        nyl.runOutMonth && !forecare.runOutMonth
          ? 'forecare'
          : nyl.totalCovered >= forecare.totalCovered
            ? 'nyl'
            : 'forecare',
    },
  ];
  const tradeoffPointTotals = tradeoffRows.reduce(
    (totals, row) => {
      if (row.highlight === 'nyl') totals.nyl += 1;
      if (row.highlight === 'forecare') totals.forecare += 1;
      return totals;
    },
    { nyl: 0, forecare: 0 }
  );
  const coverageWinner: CompareWinner = {
    policy: bestCoverage.policy.id === 'nyl' ? 'nyl' : 'forecare',
    detail: `${formatDollars(bestCoverage.totalCovered)} covered`,
  };
  const roiWinner: CompareWinner = {
    policy: bestRoi.policy.id === 'nyl' ? 'nyl' : 'forecare',
    detail: `${bestRoi.careRoi.toFixed(2)}x care ROI`,
  };
  const tradeoffWinner: CompareWinner = {
    policy:
      tradeoffPointTotals.nyl === tradeoffPointTotals.forecare
        ? 'tie'
        : tradeoffPointTotals.nyl > tradeoffPointTotals.forecare
          ? 'nyl'
          : 'forecare',
    detail:
      tradeoffPointTotals.nyl === tradeoffPointTotals.forecare
        ? `${tradeoffPointTotals.nyl} of ${tradeoffRows.length} factors each`
        : `${Math.max(tradeoffPointTotals.nyl, tradeoffPointTotals.forecare)} of ${tradeoffRows.length} factors`,
  };

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 py-3 lg:h-screen lg:px-5">
        <header className="flex flex-col gap-3 border-b border-default-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Chip className="text-[11px]" color="accent" variant="soft">Policy comparison</Chip>
            <h1 className="mt-1.5 text-lg font-semibold tracking-normal sm:text-xl lg:text-2xl">Policy fit and coverage model</h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-default-600">
              Edit customer inputs on the left. The comparison tables update with projected coverage,
              client gap, ROI, and policy fit.
            </p>
          </div>
          <Button
            className="min-h-9 border border-default-300 bg-content1 px-3 text-xs"
            onPress={() => {
              setAssumptions(defaultAssumptions);
              setPreferences(defaultPreferences);
              setPhases(defaultPhases);
            }}
          >
            Reset
          </Button>
        </header>

        <MobileCustomerInfo
          assumptions={assumptions}
          forecare={forecare}
          months={careMonths.length}
          nyl={nyl}
          setAssumptions={setAssumptions}
        />

        <div className="grid flex-1 gap-3 lg:min-h-0 lg:grid-cols-[350px_1fr]">
          <aside className="hidden lg:block lg:min-h-0 lg:overflow-y-auto">
            <Card className="border border-default-200 bg-content1">
              <CardHeader className="border-b border-default-200 p-3">
                <CardTitle className="text-sm">Customer form</CardTitle>
                <CardDescription className="text-xs">Customer details, care path, and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="gap-4 p-3">
                <TextField
                  aria-label="Customer name"
                  className="space-y-1"
                  value={assumptions.clientName}
                  onChange={(clientName) =>
                    setAssumptions((current) => ({ ...current, clientName }))
                  }
                >
                  <Label className="text-[11px] font-medium uppercase tracking-normal text-default-500">
                    Customer
                  </Label>
                  <Input className="h-9 w-full rounded-md border border-default-300 bg-content1 px-2.5 text-xs outline-none" />
                </TextField>

                <div className="grid grid-cols-3 gap-2">
                  <NumberControl
                    label="Age"
                    value={assumptions.currentAge}
                    onChange={(currentAge) =>
                      setAssumptions((current) => ({ ...current, currentAge }))
                    }
                  />
                  <NumberControl
                    label="Claim age"
                    value={assumptions.careStartAge}
                    onChange={(careStartAge) =>
                      setAssumptions((current) => ({ ...current, careStartAge }))
                    }
                  />
                  <NumberControl
                    formatOptions={{ maximumFractionDigits: 1 }}
                    label="Inflation"
                    step={0.1}
                    value={assumptions.careCostInflation}
                    onChange={(careCostInflation) =>
                      setAssumptions((current) => ({ ...current, careCostInflation }))
                    }
                  />
                </div>

                <StartAgeSlider
                  assumptions={assumptions}
                  forecare={forecare}
                  nyl={nyl}
                  onChange={(careStartAge) =>
                    setAssumptions((current) => ({ ...current, careStartAge }))
                  }
                />

                <Fieldset className="space-y-2">
                  <Fieldset.Legend className="text-[11px] font-semibold">Care path</Fieldset.Legend>
                  {phases.map((phase) => (
                    <div key={phase.id} className="grid grid-cols-[1fr_60px_96px] items-end gap-2">
                      <p className="pb-2 text-[11px] font-medium text-default-700">{phase.name}</p>
                      <NumberControl
                        label="Months"
                        value={phase.months}
                        onChange={(months) => updatePhase(phase.id, { months })}
                      />
                      <NumberControl
                        formatOptions={{ currency: 'USD', maximumFractionDigits: 0, style: 'currency' }}
                        label="Cost"
                        step={100}
                        value={phase.todayMonthlyCost}
                        onChange={(todayMonthlyCost) =>
                          updatePhase(phase.id, { todayMonthlyCost })
                        }
                      />
                    </div>
                  ))}
                </Fieldset>

                <div className="grid gap-2">
                  <PreferenceGroup
                    label="Policy type"
                    options={preferenceOptions.policyTypePreference}
                    value={preferences.policyTypePreference}
                    onChange={(value) =>
                      updatePreference(
                        'policyTypePreference',
                        value as ClientPreferences['policyTypePreference']
                      )
                    }
                  />
                  <PreferenceGroup
                    label="How should premium be paid?"
                    options={preferenceOptions.premiumType}
                    value={preferences.premiumType}
                    onChange={(value) => {
                      const premiumType = value as ClientPreferences['premiumType'];

                      setPreferences((current) => ({
                        ...current,
                        premiumType,
                        premiumRange:
                          premiumType === 'annual'
                            ? 'annual-under-5000'
                            : 'upfront-50000-125000',
                      }));
                    }}
                  />
                  <PreferenceGroup
                    label="What premium range fits?"
                    options={preferenceOptions.premiumRange[preferences.premiumType]}
                    value={preferences.premiumRange}
                    onChange={(value) =>
                      updatePreference(
                        'premiumRange',
                        value as ClientPreferences['premiumRange']
                      )
                    }
                  />
                  <PreferenceGroup
                    label="Monthly benefit"
                    options={preferenceOptions.monthlyBenefitPreference}
                    value={preferences.monthlyBenefitPreference}
                    onChange={(value) =>
                      updatePreference(
                        'monthlyBenefitPreference',
                        value as ClientPreferences['monthlyBenefitPreference']
                      )
                    }
                  />
                  <PreferenceGroup
                    label="Coverage amount"
                    options={preferenceOptions.preferredCoverageAmount}
                    value={preferences.preferredCoverageAmount}
                    onChange={(value) =>
                      updatePreference(
                        'preferredCoverageAmount',
                        value as ClientPreferences['preferredCoverageAmount']
                      )
                    }
                  />
                  <PreferenceGroup
                    label="Care preference"
                    options={preferenceOptions.carePreference}
                    value={preferences.carePreference}
                    onChange={(value) =>
                      updatePreference('carePreference', value as ClientPreferences['carePreference'])
                    }
                  />
                  <PreferenceGroup
                    label="Inflation rider"
                    options={preferenceOptions.inflationRiderPreference}
                    value={preferences.inflationRiderPreference}
                    onChange={(value) =>
                      updatePreference(
                        'inflationRiderPreference',
                        value as ClientPreferences['inflationRiderPreference']
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="flex min-w-0 flex-col gap-3 lg:min-h-0 lg:overflow-y-auto">
            <div className="grid gap-3">
              <div className="flex flex-col gap-3">
                <ComparisonTable
                  title="Policy data model"
                  description="Only the policy fields used in the comparison math."
                  rows={policyRows}
                />
                <ComparisonTable
                  title="Projected coverage"
                  description="Covered means total policy payments. Runs out means the policy pool hits zero before the care period ends."
                  rows={coverageRows}
                  winner={coverageWinner}
                />
                <ComparisonTable
                  title="ROI analysis"
                  description="Financial return view based on premium paid and benefit received."
                  rows={roiRows}
                  winner={roiWinner}
                />
                <ComparisonTable
                  title="Policy comparison"
                  description="Tradeoffs an advisor can explain to the client."
                  rows={tradeoffRows}
                  winner={tradeoffWinner}
                />
                <CalculationLogic />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
