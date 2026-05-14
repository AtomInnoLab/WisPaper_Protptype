import React from 'react';
import { BookmarkPlus, ExternalLink, Quote, Search } from 'lucide-react';
import { Paper } from '../types';
import { SearchThinkingPanel } from './SearchThinkingPanel';

interface FudanCollectionResultsProps {
  papers: Paper[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type FudanTab = 'books' | 'theses' | 'humanities-data' | 'special';

const mockSearches = [
  { label: '综合检索', query: '深度学习' },
  { label: '只看学位论文', query: '学位论文 深度学习' },
  { label: '只看特藏资源', query: '特藏资源 科举' },
  { label: '只看人文社科数据', query: '人文社科数据 传播' },
];

function FudanResultCard({ paper, tagLabel }: { paper: Paper; tagLabel: string }) {
  const isPaper = paper.type === 'paper' || paper.type === 'dataset';
  const linkLabel = isPaper ? '复旦大学图书馆全文链接' : '馆藏链接';

  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
          {tagLabel}
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
  const [activeTab, setActiveTab] = React.useState<FudanTab>('books');
  const normalizedQuery = (searchQuery || '深度学习').trim().toLowerCase();
  const sourceBooks = papers.filter((paper) => paper.type === 'book' || paper.type === 'paper').slice(0, 10);
  const sourceTheses = papers.filter((paper) => paper.type === 'thesis' || paper.venue.includes('复旦')).slice(0, 10);
  const sourceHumanitiesData = papers.filter((paper) =>
    paper.type === 'dataset' || paper.categories.some((category) => ['History', 'Education', 'Chinese Culture', 'Communication', 'Social Media'].includes(category)),
  ).slice(0, 10);
  const sourceSpecialResources = papers.filter((paper) => paper.type === 'special');
  const isThesisSearch = normalizedQuery.includes('学位') || normalizedQuery.includes('论文') || normalizedQuery.includes('thesis');
  const isSpecialSearch = normalizedQuery.includes('特藏') || normalizedQuery.includes('科举') || normalizedQuery.includes('special');
  const isHumanitiesSearch = normalizedQuery.includes('人文') || normalizedQuery.includes('社科') || normalizedQuery.includes('传播') || normalizedQuery.includes('data');
  const isSingleTypeMockSearch = isThesisSearch || isSpecialSearch || isHumanitiesSearch;
  const books = isSingleTypeMockSearch ? [] : sourceBooks;
  const theses = isThesisSearch ? sourceTheses : isSingleTypeMockSearch ? [] : sourceTheses;
  const humanitiesData = isHumanitiesSearch ? sourceHumanitiesData : isSingleTypeMockSearch ? [] : sourceHumanitiesData;
  const specialResources = isSpecialSearch ? sourceSpecialResources : isSingleTypeMockSearch ? [] : sourceSpecialResources;

  const baseTabs = [
    {
      id: 'books' as const,
      label: '书刊',
      count: books.length,
      results: books,
    },
    {
      id: 'theses' as const,
      label: '学位论文',
      count: theses.length,
      results: theses,
    },
    {
      id: 'humanities-data' as const,
      label: '人文社科数据',
      count: humanitiesData.length,
      results: humanitiesData,
    },
    {
      id: 'special' as const,
      label: '特藏资源',
      results: specialResources,
    },
  ];

  const tabs = React.useMemo(
    () => [...baseTabs].sort((left, right) => Number(right.results.length > 0) - Number(left.results.length > 0)),
    [books, theses, humanitiesData, specialResources],
  );
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const displayResults = activeTabConfig?.results ?? [];
  const activeTabLabel = activeTabConfig?.label ?? '书刊';

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="text"
            value={searchQuery || '深度学习'}
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
        <div className="mt-3 flex flex-wrap gap-2">
          {mockSearches.map((item) => {
            const isActive = normalizedQuery === item.query.toLowerCase();

            return (
              <button
                key={item.query}
                type="button"
                onClick={() => onSearchChange(item.query)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <SearchThinkingPanel query={searchQuery} className="border-b border-slate-200" />

      <div className="border-b border-slate-200 bg-white px-6">
        <div className="flex gap-7">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 border-b-2 px-3 py-4 text-lg font-semibold transition ${
                  isActive
                    ? 'border-slate-950 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' ? (
                  <span className={`rounded-full px-2.5 py-1 text-sm ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {displayResults.length > 0 ? (
          <div className="space-y-3">
            {displayResults.map((paper) => (
              <FudanResultCard key={paper.id} paper={paper} tagLabel={activeTabLabel} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[18rem] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">暂无搜索结果</p>
              <p className="mt-2 text-sm text-slate-500">该类型当前没有匹配数据，可切换到其他结果类型查看。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
