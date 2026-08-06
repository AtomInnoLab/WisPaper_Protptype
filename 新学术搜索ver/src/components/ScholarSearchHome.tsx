import React, { useState } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft, BookOpen, GraduationCap, Infinity, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ScholarSearchHomeProps {
  onSearch: (query: string) => void;
  onQuickOpen: (identifier: AcademicIdentifier) => void;
  showDeepSearchTooltip?: boolean;
  onTooltipDismiss?: () => void;
}

export interface AcademicIdentifier {
  kind: 'DOI' | 'arXiv';
  value: string;
}

export const detectAcademicIdentifier = (input: string): AcademicIdentifier | null => {
  const raw = input.trim();
  if (!raw) return null;

  const doiValue = raw
    .replace(/^doi:\s*/i, '')
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
  if (/^10\.\d{4,9}\/[\-._;()/:a-z0-9]+$/i.test(doiValue)) {
    return { kind: 'DOI', value: doiValue };
  }

  const arxivValue = raw
    .replace(/^arxiv:\s*/i, '')
    .replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, '')
    .replace(/\.pdf$/i, '');
  const isModernArxiv = /^\d{4}\.\d{4,5}(?:v\d+)?$/i.test(arxivValue);
  const isLegacyArxiv = /^[a-z-]+(?:\.[a-z]{2})?\/\d{7}(?:v\d+)?$/i.test(arxivValue);
  if (isModernArxiv || isLegacyArxiv) {
    return { kind: 'arXiv', value: arxivValue };
  }

  return null;
};

// Category keys for translation
const categoryKeys = [
  'libraryCollections',
  'undergraduateTheses',
  'computerScience',
  'medicine',
  'biology',
  'chemistry',
  'finance',
  'environmentalScience',
  'math',
  'engineering',
  'physics',
  'psychology'
];

const bookCategoryKeys = ['literature', 'design', 'journalism'];
const thesesCategoryKeys = ['cs', 'socialScience', 'naturalScience'];

// Get example query keys for each category
const getCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'libraryCollections': ['example.library.1', 'example.library.2', 'example.library.3'],
    'undergraduateTheses': ['example.undergrad.1', 'example.undergrad.2', 'example.undergrad.3'],
    'computerScience': ['example.cs.1', 'example.cs.2', 'example.cs.3'],
    'medicine': ['example.medicine.1', 'example.medicine.2', 'example.medicine.3'],
    'biology': ['example.biology.1', 'example.biology.2', 'example.biology.3'],
    'chemistry': ['example.chemistry.1', 'example.chemistry.2', 'example.chemistry.3'],
    'finance': ['example.finance.1', 'example.finance.2', 'example.finance.3'],
    'environmentalScience': ['example.envScience.1', 'example.envScience.2', 'example.envScience.3'],
    'math': ['example.math.1', 'example.math.2', 'example.math.3'],
    'engineering': ['example.engineering.1', 'example.engineering.2', 'example.engineering.3'],
    'physics': ['example.physics.1', 'example.physics.2', 'example.physics.3'],
    'psychology': ['example.psychology.1', 'example.psychology.2', 'example.psychology.3'],
  };
  return exampleMap[categoryKey] || [];
};

const getBookCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'literature': ['example.book.literature.1', 'example.book.literature.2', 'example.book.literature.3'],
    'design': ['example.book.design.1', 'example.book.design.2', 'example.book.design.3'],
    'journalism': ['example.book.journalism.1', 'example.book.journalism.2', 'example.book.journalism.3'],
  };
  return exampleMap[categoryKey] || [];
};

const getThesesCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'cs': ['example.theses.cs.1', 'example.theses.cs.2', 'example.theses.cs.3'],
    'socialScience': ['example.theses.social.1', 'example.theses.social.2', 'example.theses.social.3'],
    'naturalScience': ['example.theses.natural.1', 'example.theses.natural.2', 'example.theses.natural.3'],
  };
  return exampleMap[categoryKey] || [];
};

export function ScholarSearchHome({ onSearch, onQuickOpen, showDeepSearchTooltip, onTooltipDismiss }: ScholarSearchHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'quick' | 'deep' | 'books' | 'theses'>('deep');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedBookCategory, setSelectedBookCategory] = useState<string>('literature');
  const [selectedThesesCategory, setSelectedThesesCategory] = useState<string>('cs');
  const [selectedCategory, setSelectedCategory] = useState<string>('libraryCollections');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('public');
  const academicIdentifier = detectAcademicIdentifier(searchQuery);

  const visibleCategories = 8;
  const canScrollLeft = currentCategoryIndex > 0;
  const canScrollRight = currentCategoryIndex < categoryKeys.length - visibleCategories;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleExampleClick = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (direction === 'left' && canScrollLeft) {
      setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1));
    } else if (direction === 'right' && canScrollRight) {
      setCurrentCategoryIndex(Math.min(categoryKeys.length - visibleCategories, currentCategoryIndex + 1));
    }
  };

  const { t } = useLanguage();

  return (
    <div className="scholar-search-landing flex-1 flex items-center justify-center px-6 py-12">
      <style>{`
        .scholar-search-landing {
          --primary: #23282f;
          --on-primary: #ffffff;
          --ink: #23282f;
          --body: #636c76;
          --mute: #999999;
          --accent: #0079ff;
          --accent-hover: #1b87ff;
          --accent-soft: rgba(0, 121, 255, 0.1);
          --accent-soft-strong: rgba(0, 121, 255, 0.12);
          --accent-deep: #111fa4;
          --canvas: #ffffff;
          --canvas-soft: #f1f2f3;
          --canvas-softer: #f3f9ff;
          --line: #e5e7eb;
          --line-blue: #e6ecf4;
          min-height: 100%;
          background:
            linear-gradient(180deg, rgba(243, 249, 255, 0.72) 0%, rgba(255, 255, 255, 0) 38%),
            transparent;
          color: var(--ink);
          font-family: UberMoveText, system-ui, "Helvetica Neue", Arial, sans-serif;
        }

        .scholar-search-landing * { box-sizing: border-box; }

        .scholar-search-landing .search-page {
          width: 100%;
          max-width: 980px;
        }

        .scholar-search-landing .search-hero {
          text-align: center;
          margin-bottom: 24px;
        }

        .scholar-search-landing .search-kicker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          margin-bottom: 14px;
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--accent-soft-strong);
          color: var(--accent-deep);
          font-size: 14px;
          line-height: 16px;
          font-weight: 600;
        }

        .scholar-search-landing .search-title {
          max-width: 780px;
          margin: 0 auto;
          color: var(--ink);
          font-size: 42px;
          line-height: 52px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .scholar-search-landing .search-title .accent {
          color: var(--accent);
        }

        .scholar-search-landing .search-shell {
          margin-bottom: 32px;
          padding: 18px;
          border: 1px solid var(--line-blue);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: rgba(35, 40, 47, 0.08) 0 18px 44px;
        }

        .scholar-search-landing .search-input-wrap {
          position: relative;
          margin-bottom: 14px;
          border-radius: 14px;
          background: var(--canvas-softer);
          border: 1px solid rgba(0, 121, 255, 0.1);
        }

        .scholar-search-landing .search-textarea {
          width: 100%;
          min-height: 110px;
          padding: 18px 20px;
          border: 0;
          outline: 0;
          resize: none;
          background: transparent;
          color: var(--ink);
          font-size: 16px;
          line-height: 24px;
        }

        .scholar-search-landing .search-textarea::placeholder {
          color: var(--mute);
        }

        .scholar-search-landing .search-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 2px;
        }

        .scholar-search-landing .control-left,
        .scholar-search-landing .control-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scholar-search-landing .mode-toggle {
          position: relative;
          display: inline-flex;
          gap: 8px;
          padding: 6px;
          border-radius: 999px;
          background: var(--line-blue);
        }

        .scholar-search-landing .mode-toggle-bg {
          position: absolute;
          inset-block: 6px;
          border-radius: 999px;
          background: var(--canvas);
          box-shadow: rgba(35, 40, 47, 0.08) 0 6px 18px;
          transition: left 0.2s ease, right 0.2s ease;
        }

        .scholar-search-landing .mode-toggle-bg.quick {
          left: 6px;
          right: calc(50% + 4px);
        }

        .scholar-search-landing .mode-toggle-bg.deep {
          left: calc(50% + 4px);
          right: 6px;
        }

        .scholar-search-landing .mode-button {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 38px;
          padding: 9px 16px;
          border-radius: 999px;
          border: 0;
          background: transparent;
          color: var(--body);
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.16s ease;
        }

        .scholar-search-landing .mode-button.active {
          color: var(--accent-deep);
        }

        .scholar-search-landing .unmetered-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 10px 14px;
          border: 0;
          border-radius: 999px;
          background: var(--canvas-soft);
          color: var(--body);
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
          transition: background 0.16s ease, color 0.16s ease;
        }

        .scholar-search-landing .unmetered-button:hover {
          background: var(--accent-soft);
          color: var(--accent-deep);
        }

        .scholar-search-landing .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: 999px;
          background: var(--accent);
          color: var(--on-primary);
          box-shadow: rgba(0, 121, 255, 0.22) 0 10px 24px;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .scholar-search-landing .submit-button:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        .scholar-search-landing .quick-open-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 44px;
          padding: 10px 16px;
          border: 1px solid rgba(0, 121, 255, 0.2);
          border-radius: 999px;
          background: var(--accent-soft);
          color: var(--accent-deep);
          font-size: 14px;
          line-height: 16px;
          font-weight: 600;
          white-space: nowrap;
          animation: shortcut-in 0.16s ease-out;
          transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
        }

        .scholar-search-landing .quick-open-button:hover {
          border-color: rgba(0, 121, 255, 0.34);
          background: var(--accent-soft-strong);
          transform: translateY(-1px);
        }

        @keyframes shortcut-in {
          from { opacity: 0; transform: translateX(6px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .scholar-search-landing .examples-title {
          margin: 0 0 16px;
          text-align: center;
          color: var(--ink);
          font-size: 18px;
          line-height: 24px;
          font-weight: 700;
        }

        .scholar-search-landing .category-row {
          position: relative;
          margin-bottom: 18px;
        }

        .scholar-search-landing .category-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .scholar-search-landing .category-scroll {
          flex: 1;
          overflow: hidden;
        }

        .scholar-search-landing .category-list {
          display: flex;
          gap: 8px;
        }

        .scholar-search-landing .category-list.center {
          justify-content: center;
        }

        .scholar-search-landing .category-pill {
          flex-shrink: 0;
          min-height: 38px;
          padding: 10px 14px;
          border: 0;
          border-radius: 999px;
          background: var(--line-blue);
          color: var(--body);
          font-size: 14px;
          line-height: 16px;
          font-weight: 500;
          white-space: nowrap;
          transition: background 0.16s ease, color 0.16s ease;
        }

        .scholar-search-landing .category-pill.active {
          background: var(--primary);
          color: var(--on-primary);
        }

        .scholar-search-landing .category-pill:not(.active):hover {
          background: var(--accent-soft-strong);
          color: var(--accent-deep);
        }

        .scholar-search-landing .category-arrow {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          background: var(--canvas-soft);
          color: var(--body);
          transition: background 0.16s ease, color 0.16s ease;
        }

        .scholar-search-landing .category-arrow:hover {
          background: var(--accent-soft);
          color: var(--accent-deep);
        }

        .scholar-search-landing .example-list {
          display: grid;
          gap: 10px;
        }

        .scholar-search-landing .example-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 58px;
          padding: 15px 18px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.86);
          color: var(--body);
          transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease, background 0.16s ease;
        }

        .scholar-search-landing .example-row:hover {
          border-color: rgba(0, 121, 255, 0.28);
          background: var(--canvas);
          box-shadow: rgba(35, 40, 47, 0.08) 0 10px 28px;
          transform: translateY(-1px);
        }

        .scholar-search-landing .example-text {
          text-align: left;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
        }

        .scholar-search-landing .example-icon {
          flex-shrink: 0;
          color: var(--mute);
          transition: color 0.16s ease, transform 0.16s ease;
        }

        .scholar-search-landing .example-row:hover .example-icon {
          color: var(--accent);
          transform: translateX(3px);
        }

        @media (max-width: 760px) {
          .scholar-search-landing {
            align-items: flex-start;
            padding: 32px 16px;
          }

          .scholar-search-landing .search-title {
            font-size: 34px;
            line-height: 42px;
          }

          .scholar-search-landing .search-shell {
            padding: 14px;
          }

          .scholar-search-landing .search-controls {
            align-items: stretch;
            flex-direction: column;
          }

          .scholar-search-landing .control-left,
          .scholar-search-landing .control-right,
          .scholar-search-landing .mode-toggle {
            width: 100%;
          }

          .scholar-search-landing .mode-button {
            flex: 1;
            justify-content: center;
          }

          .scholar-search-landing .unmetered-button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
      <div className="search-page">
        {/* Header */}
        <div className="search-hero">
          <span className="search-kicker">Scholar Search</span>
          <h1 className="search-title">
            Hi. Which paper do you want to <span className="accent">read today?</span>
          </h1>
        </div>

        {/* Search Box Container */}
        <div className="search-shell">
          {/* Search Input */}
          <div className="search-input-wrap">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSearch())}
              placeholder="e.g., Find me papers that study AI4Science in recent 3 years..."
              rows={3}
              className="search-textarea"
            />
          </div>

          {/* Mode Toggle and Options */}
          <div className="search-controls">
            <div className="control-left">
              {/* Slider Tab for Quick/Deep Mode */}
              <div className="mode-toggle">
                {/* Sliding Background */}
                <div 
                  className={`mode-toggle-bg ${searchMode === 'deep' ? 'deep' : 'quick'}`}
                />
                
                {/* Quick Mode */}
                <button
                  onClick={() => setSearchMode('quick')}
                  className={`mode-button ${searchMode === 'quick' ? 'active' : ''}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" />
                  </svg>
                  <span>Quick Mode</span>
                </button>

                {/* Deep Mode */}
                <button
                  onClick={() => setSearchMode('deep')}
                  className={`mode-button ${searchMode === 'deep' ? 'active' : ''}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                  </svg>
                  <span>Deep Mode</span>
                </button>
              </div>

              {/* Database Selector */}
              <div className="relative">
                
                
              </div>
            </div>

            <div className="control-right">
              {/* Unmetered */}
              <button className="unmetered-button">
                <Infinity className="w-4 h-4" />
                <span>Unmetered</span>
              </button>

              {academicIdentifier && (
                <button
                  type="button"
                  onClick={() => onQuickOpen(academicIdentifier)}
                  className="quick-open-button"
                  aria-label={`立即查看 ${academicIdentifier.kind} ${academicIdentifier.value}`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>立即查看</span>
                </button>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="submit-button"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {searchMode === 'deep' && (
            null
          )}
        </div>

        {/* Try Our Examples Section */}
        <div>
          <h2 className="examples-title">{t('search.examples')}</h2>
          
          {/* Category Tabs - show different categories based on mode */}
          {searchMode === 'books' ? (
            <div className="category-row">
              <div className="category-list center">
                {bookCategoryKeys.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedBookCategory(category)}
                    className={`category-pill ${selectedBookCategory === category ? 'active' : ''}`}
                  >
                    {t(`category.${category}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : searchMode === 'theses' ? (
            <div className="category-row">
              <div className="category-list center">
                {thesesCategoryKeys.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedThesesCategory(category)}
                    className={`category-pill ${selectedThesesCategory === category ? 'active' : ''}`}
                  >
                    {t(`category.${category}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="category-row">
              <div className="category-inner">
                {canScrollLeft && (
                  <button
                    onClick={() => scrollCategories('left')}
                    className="category-arrow"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                
                <div className="category-scroll">
                  <div className="category-list">
                    {categoryKeys.slice(currentCategoryIndex, currentCategoryIndex + visibleCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                      >
                        {t(`category.${category}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {canScrollRight && (
                  <button
                    onClick={() => scrollCategories('right')}
                    className="category-arrow"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Example Queries - show different queries based on mode */}
          <div className="example-list">
            {searchMode === 'books' ? (
              getBookCategoryExamples(selectedBookCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="example-row"
                >
                  <span className="example-text">{t(queryKey)}</span>
                  <ArrowRight className="example-icon w-4 h-4" />
                </button>
              ))
            ) : searchMode === 'theses' ? (
              getThesesCategoryExamples(selectedThesesCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="example-row"
                >
                  <span className="example-text">{t(queryKey)}</span>
                  <ArrowRight className="example-icon w-4 h-4" />
                </button>
              ))
            ) : (
              getCategoryExamples(selectedCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="example-row"
                >
                  <span className="example-text">{t(queryKey)}</span>
                  <ArrowRight className="example-icon w-4 h-4" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
