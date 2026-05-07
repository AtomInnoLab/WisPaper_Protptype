import React from 'react';
import { Award, BookmarkPlus, ExternalLink, GraduationCap, Library, Quote, Search } from 'lucide-react';
import { Paper } from '../types';
import { SearchThinkingPanel } from './SearchThinkingPanel';

interface FudanCollectionResultsProps {
  papers: Paper[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type FudanTab = 'library' | 'research';

const resourceTypeLabels: Record<string, string> = {
  book: '图书',
  thesis: '本校学位论文',
  special: '特藏资料',
  paper: '论文',
  dataset: '数据集',
};

function getResourceTypeLabel(type?: Paper['type']) {
  return resourceTypeLabels[type || 'paper'] || '论文';
}

function FudanResultCard({ paper }: { paper: Paper }) {
  const isPaper = paper.type === 'paper' || paper.type === 'dataset';
  const linkLabel = isPaper ? '复旦大学图书馆全文链接' : '馆藏链接';

  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
          {getResourceTypeLabel(paper.type)}
        </span>
        <h3 className="text-sm font-semibold leading-6 text-blue-600">
          {paper.title}
        </h3>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-slate-600">
        {paper.authors.slice(0, 3).join(', ')} - {paper.year} - {paper.venue}
      </p>

      <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-700">
        {paper.abstract}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-blue-600">
        <button type="button" className="inline-flex items-center gap-1 hover:text-blue-700">
          <BookmarkPlus className="h-3.5 w-3.5" />
          <span>Add to Library</span>
        </button>
        <button type="button" className="inline-flex items-center gap-1 hover:text-blue-700">
          <Quote className="h-3.5 w-3.5" />
          <span>Cite</span>
        </button>
        {isPaper ? (
          <span className="text-slate-600">Cited By: {paper.citations}</span>
        ) : null}
        <a href={paper.pdfUrl || '#'} className="inline-flex items-center gap-1 hover:text-blue-700">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>{linkLabel}</span>
        </a>
      </div>
    </article>
  );
}

export function FudanCollectionResults({
  papers,
  searchQuery,
  onSearchChange,
}: FudanCollectionResultsProps) {
  const [activeTab, setActiveTab] = React.useState<FudanTab>('library');
  const libraryResources = papers.filter((paper) =>
    paper.type === 'book' || paper.type === 'special' || paper.type === 'thesis' || paper.venue.includes('复旦'),
  );
  const researchOutputs = papers.filter((paper) =>
    paper.type === 'thesis' || paper.venue.includes('复旦'),
  );
  const displayResults = activeTab === 'library'
    ? [...libraryResources, ...papers.filter((paper) => paper.type === 'paper').slice(0, 8)]
    : researchOutputs;

  const tabs = [
    {
      id: 'library' as const,
      label: '复旦大学馆藏资源',
      count: 49,
      icon: Library,
    },
    {
      id: 'research' as const,
      label: '复旦大学学术成果',
      count: 10,
      icon: Award,
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="text"
            value={searchQuery || '1'}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-8 flex-1 bg-transparent text-sm text-slate-900 outline-none"
          />
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <SearchThinkingPanel query={searchQuery} className="border-b border-slate-200" />

      <div className="border-b border-slate-200 bg-white px-6">
        <div className="flex gap-7">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-semibold transition ${
                  isActive
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.id === 'library' ? <Icon className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {displayResults.map((paper) => (
            <FudanResultCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}
