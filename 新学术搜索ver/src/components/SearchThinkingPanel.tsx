import React from 'react';
import { Check, Maximize2, Minimize2 } from 'lucide-react';

interface SearchThinkingPanelProps {
  query?: string;
  className?: string;
}

function normalizeQuery(query?: string) {
  const trimmed = query?.trim();
  return trimmed || 'Find me papers that study AI4Science in recent 3 years';
}

export function SearchThinkingPanel({ query, className = '' }: SearchThinkingPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayQuery = normalizeQuery(query);
  const statusTitle = 'Searching & Validating: Radio Galaxy Zoo: Morphological classification...';
  const steps = [
    'Analysing Questions: "AI for Science" 2023-2025',
    `Analysing Questions: ${displayQuery}`,
    'Analysing Questions: AI4Science 2023-2025',
    'Analysing Questions: "AI4Science" 2023-2025',
    'Validating Criteria: The paper discusses, proposes, or applies AI methods to scientific discovery or scientific research.',
    'Validating Criteria: The paper was published in 2023, 2024, or 2025.',
    'Searching & Validating: Radio Galaxy Zoo: Morphological classification by Fanaroff-Riley designation using self-supervised pre-training',
  ];

  return (
    <section className={`bg-white px-6 py-4 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isExpanded}
      >
        <span className="truncate text-base font-medium leading-7 text-slate-500 md:text-lg">
          {statusTitle}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </span>
      </button>

      {isExpanded ? (
        <div className="mt-4 rounded-2xl bg-blue-50 px-5 py-4">
          <div className="mb-1 flex justify-end">
            <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Advanced Search
            </button>
          </div>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <p className="text-base leading-6 text-slate-500 md:text-lg">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
