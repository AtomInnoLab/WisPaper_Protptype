import React, { useEffect, useRef, useState } from 'react';
import { Library, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize, Globe, ChevronDown, Bookmark, Share2, ThumbsUp, PlusCircle, History, House, MessageSquare, StickyNote, Sparkles, Info } from 'lucide-react';
import { Paper } from '../types';
import { TableOfContents } from './TableOfContents';
import { PageThumbnails } from './PageThumbnails';
import { BlogView } from './BlogView';
import { PaperView } from './PaperView';
import { TranslationView } from './TranslationView';
import { CommentsPanel } from './CommentsPanel';
import { UserPanel } from './UserPanel';
import { ParsingStatus } from './ParsingStatus';

interface PaperDetailProps {
  paper: Paper;
  onBack: () => void;
}

type TabType = 'blog' | 'paper' | 'translation';
type SidebarTab = 'preview' | 'structure';
type RightSidebarTab = 'home' | 'info' | 'chat' | 'history' | 'notes' | 'comments';
type ReaderTool = 'single-page' | 'double-page' | 'flip' | 'click' | 'grab' | 'pen' | 'eraser';
type PaperHighlightTarget = {
  citationId: string;
  elementId: string;
  page: number;
  trigger: number;
};

export function PaperDetail({ paper, onBack }: PaperDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('blog');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('preview');
  const [pdfScale, setPdfScale] = useState(0.75);
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 15;
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isResizingRightSidebar, setIsResizingRightSidebar] = useState(false);
  const [blogLanguage, setBlogLanguage] = useState<'en' | 'zh' | 'ja' | 'ko' | 'id'>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [blogScale, setBlogScale] = useState(0.75);
  const [translationLanguage, setTranslationLanguage] = useState<'zh-CN' | 'en' | 'ja' | 'ko' | 'id'>('zh-CN');
  const [translationViewMode, setTranslationViewMode] = useState<'dual-vertical' | 'translation-only' | 'dual-horizontal'>('dual-horizontal');
  const [showTranslationLanguageMenu, setShowTranslationLanguageMenu] = useState(false);
  const [showTranslationViewModeMenu, setShowTranslationViewModeMenu] = useState(false);
  const [isParsing, setIsParsing] = useState(true);
  const [isFirstBlogVisit, setIsFirstBlogVisit] = useState(true);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('home');
  const [readerTool, setReaderTool] = useState<ReaderTool>('click');
  const [paperHighlightTarget, setPaperHighlightTarget] = useState<PaperHighlightTarget | null>(null);
  const [selectedExcerpt, setSelectedExcerpt] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const pendingRightSidebarWidthRef = useRef(rightSidebarWidth);

  const paperId = paper?.id;

  // Simulate parsing process for 10 seconds on first load (only for Translation tab)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsParsing(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [paperId]); // Reset when paper changes
  
  // Track first visit to paper for Blog tab
  useEffect(() => {
    setIsFirstBlogVisit(true);
  }, [paperId]);

  useEffect(() => {
    if (!isResizingRightSidebar) {
      return;
    }

    const updateRightSidebarWidth = (nextWidth: number) => {
      pendingRightSidebarWidthRef.current = nextWidth;

      if (resizeFrameRef.current !== null) {
        return;
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        setRightSidebarWidth(pendingRightSidebarWidthRef.current);
        resizeFrameRef.current = null;
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const container = mainContentRef.current;

      if (!container) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      const nextWidth = bounds.right - event.clientX;
      const minWidth = 280;
      const minContentWidth = 560;
      const leftPanelWidth = leftSidebarCollapsed ? 0 : 224;
      const maxWidth = Math.max(minWidth, bounds.width - leftPanelWidth - minContentWidth);

      updateRightSidebarWidth(Math.min(Math.max(nextWidth, minWidth), maxWidth));
    };

    const stopResizing = () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      setRightSidebarWidth(pendingRightSidebarWidthRef.current);
      setIsResizingRightSidebar(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
    };
  }, [isResizingRightSidebar, leftSidebarCollapsed]);

  if (!paper) {
    return null;
  }

  const languageLabels = {
    'en': 'English',
    'zh': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'id': 'Indonesia'
  };

  const translationLanguageLabels = {
    'zh-CN': '简体中文',
    'en': 'English',
    'ja': '日本語',
    'ko': '한국어',
    'id': 'Bahasa Indonesia',
  };

  const translationViewModeLabels = {
    'dual-vertical': '上下对照',
    'translation-only': '仅显示译文',
    'dual-horizontal': '左右对照',
  };

  const handleSidebarTabToggle = (tab: SidebarTab) => {
    if (!leftSidebarCollapsed && sidebarTab === tab) {
      setLeftSidebarCollapsed(true);
      return;
    }

    setSidebarTab(tab);
    setLeftSidebarCollapsed(false);
  };

  const handleSummaryCitationSelect = ({
    citationId,
    elementId,
    page,
  }: {
    citationId: string;
    elementId: string;
    page: number;
  }) => {
    setActiveTab('paper');
    setCurrentPage(page);
    setPaperHighlightTarget({
      citationId,
      elementId,
      page,
      trigger: Date.now(),
    });
  };

  const handlePaperTextSelection = (selectedText: string | null) => {
    setSelectedExcerpt(selectedText);
    if (selectedText) {
      setRightSidebarCollapsed(false);
    }
  };

  useEffect(() => {
    if (!selectedExcerpt) {
      return;
    }

    const handleSelectionChange = () => {
      const selectedText = window.getSelection()?.toString().trim() ?? '';

      if (!selectedText) {
        setSelectedExcerpt(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [selectedExcerpt]);

  const rightSidebarActions =
    rightSidebarTab === 'chat' || rightSidebarTab === 'history' ? (
      <>
        <button
          onClick={() => setRightSidebarTab('chat')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Chat</span>
        </button>
        <button
          onClick={() => setRightSidebarTab('history')}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            rightSidebarTab === 'history'
              ? 'text-blue-700'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <History className="h-4 w-4" />
          <span>History</span>
        </button>
      </>
    ) : rightSidebarTab === 'notes' ? (
      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
        <PlusCircle className="h-4 w-4" />
        <span>New Note</span>
      </button>
    ) : rightSidebarTab === 'comments' ? (
      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
        <PlusCircle className="h-4 w-4" />
        <span>Add Comment</span>
      </button>
    ) : rightSidebarTab === 'info' ? (
      <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
        <Info className="h-4 w-4" />
        <span>Paper details</span>
      </div>
    ) : null;

  const leftSidebarWidth = leftSidebarCollapsed ? 0 : 224;
  const rightSidebarPanelWidth = rightSidebarCollapsed ? 0 : rightSidebarWidth;
  const headerRightColumnWidth = rightSidebarCollapsed ? 56 : rightSidebarWidth;
  const contentCenterOffset = (rightSidebarPanelWidth - leftSidebarWidth) / 2;
  const headerGridTemplate = `224px minmax(0, 1fr) ${headerRightColumnWidth}px`;
  const zoomOptions = [25, 50, 75, 100, 125, 150];
  const getZoomSelectValue = (scale: number) => String(Math.round(scale * 100));
  const getZoomMenuOptions = (scale: number) => {
    const currentPercent = Math.round(scale * 100);

    return zoomOptions.includes(currentPercent)
      ? zoomOptions
      : [currentPercent, ...zoomOptions].sort((a, b) => a - b);
  };

  const readerToolButtons: Array<{ key: ReaderTool; label: string; icon: React.ReactNode }> = [
    {
      key: 'single-page',
      label: 'Single Page',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="6" y="4" width="12" height="16" rx="1.5" />
        </svg>
      ),
    },
    {
      key: 'double-page',
      label: 'Double Page',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="4" width="7.5" height="16" rx="1.5" />
          <rect x="13" y="4" width="7.5" height="16" rx="1.5" />
        </svg>
      ),
    },
    {
      key: 'flip',
      label: 'Flip',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.68" />
          <path d="M20 4v4.68h-4.68" />
        </svg>
      ),
    },
    {
      key: 'click',
      label: 'Click',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 3l7.2 17 2.4-7.2L20.8 10 4 3z" />
        </svg>
      ),
    },
    {
      key: 'grab',
      label: 'Grab',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11V6a2 2 0 1 1 4 0v5" />
          <path d="M13 11V5a2 2 0 1 1 4 0v7" />
          <path d="M5 12V8a2 2 0 1 1 4 0v8" />
          <path d="M17 12V9a2 2 0 1 1 4 0v6a5 5 0 0 1-5 5h-3a6 6 0 0 1-6-6v-2" />
        </svg>
      ),
    },
    {
      key: 'pen',
      label: 'Pen',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l4.5-1 9-9-3.5-3.5-9 9L4 20z" />
          <path d="M13.5 6.5l3.5 3.5" />
        </svg>
      ),
    },
    {
      key: 'eraser',
      label: 'Eraser',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16l7.5-7.5a2.5 2.5 0 0 1 3.5 0l1.5 1.5a2.5 2.5 0 0 1 0 3.5L14 19H9l-2-3z" />
          <path d="M9 19h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-white">
      {!rightSidebarCollapsed ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 z-20 w-px transition-colors ${
            isResizingRightSidebar ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          style={{ right: rightSidebarWidth }}
        />
      ) : null}

      {/* Header Row 1 */}
      <div
        className="grid border-b border-gray-200 bg-white flex-shrink-0"
        style={{ gridTemplateColumns: headerGridTemplate }}
      >
        <div className="flex items-center justify-between border-r border-gray-200 px-4 py-3">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded p-1.5 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Back to Library"
            aria-label="Back to Library"
          >
            <Library className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLeftSidebarCollapsed((prev) => !prev)}
            className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            title={leftSidebarCollapsed ? 'Expand left sidebar' : 'Collapse left sidebar'}
          >
            {leftSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 px-6">
          {[
            { key: 'blog' as const, label: 'Blog' },
            { key: 'paper' as const, label: 'Paper' },
            { key: 'translation' as const, label: 'Translation' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className={rightSidebarCollapsed ? 'px-2' : 'px-3'}>
          <div className="relative flex h-full items-center">
            <button
              onClick={() => setRightSidebarCollapsed((prev) => !prev)}
              className={`z-10 rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 ${
                rightSidebarCollapsed ? '' : 'absolute left-0 top-1/2 -translate-y-1/2'
              }`}
              title={rightSidebarCollapsed ? 'Expand right sidebar' : 'Collapse right sidebar'}
            >
              {rightSidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {!rightSidebarCollapsed ? (
              <div className="flex w-full items-center justify-center gap-3 px-10">
                {[
                  { key: 'home' as const, label: 'Home', icon: House },
                  { key: 'chat' as const, label: 'Chat', icon: Sparkles },
                  { key: 'notes' as const, label: 'Notes', icon: StickyNote },
                  { key: 'comments' as const, label: 'Comments', icon: MessageSquare },
                  { key: 'info' as const, label: 'Info', icon: Info },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setRightSidebarTab(item.key)}
                    title={item.label}
                    aria-label={item.label}
                    className={`inline-flex min-w-0 items-center gap-1.5 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                      rightSidebarTab === item.key || (item.key === 'chat' && rightSidebarTab === 'history')
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Header Row 2 */}
      <div
        className="grid border-b border-gray-200 bg-gray-50/80 flex-shrink-0"
        style={{ gridTemplateColumns: headerGridTemplate }}
      >
        <div className={`${leftSidebarCollapsed ? '' : 'border-r border-gray-200'} px-3`}>
          {!leftSidebarCollapsed ? (
            <div className="flex items-center">
              <button
                onClick={() => handleSidebarTabToggle('preview')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  sidebarTab === 'preview'
                    ? 'border-b-2 border-blue-600 bg-white text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => handleSidebarTabToggle('structure')}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  sidebarTab === 'structure'
                    ? 'border-b-2 border-blue-600 bg-white text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Structure
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-2.5">
          <div className="flex items-center gap-3">
            {activeTab === 'blog' ? (
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>{languageLabels[blogLanguage]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>

                {showLanguageMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLanguageMenu(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded border border-gray-300 bg-white py-1 shadow-lg">
                      {(Object.keys(languageLabels) as Array<keyof typeof languageLabels>).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setBlogLanguage(lang);
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                            blogLanguage === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {languageLabels[lang]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : activeTab === 'translation' ? (
              <>
                <div className="flex items-center gap-1">
                  {readerToolButtons.map((tool) => (
                    <button
                      key={tool.key}
                      type="button"
                      onClick={() => setReaderTool(tool.key)}
                      title={tool.label}
                      aria-label={tool.label}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
                        readerTool === tool.key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {tool.icon}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                {readerToolButtons.map((tool) => (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => setReaderTool(tool.key)}
                    title={tool.label}
                    aria-label={tool.label}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
                      readerTool === tool.key
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            {activeTab === 'blog' ? (
              <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
                <button onClick={() => setBlogScale(Math.max(0.25, blogScale - 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                  <ZoomOut className="h-3 w-3 text-gray-700" />
                </button>
                <select
                  value={getZoomSelectValue(blogScale)}
                  onChange={(e) => setBlogScale(parseInt(e.target.value) / 100)}
                  className="cursor-pointer border-none bg-transparent px-1 text-xs outline-none"
                >
                  {getZoomMenuOptions(blogScale).map((option) => (
                    <option key={option} value={option}>
                      {option}%
                    </option>
                  ))}
                </select>
                <button onClick={() => setBlogScale(Math.min(2, blogScale + 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                  <ZoomIn className="h-3 w-3 text-gray-700" />
                </button>
              </div>
            ) : activeTab === 'translation' ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowTranslationLanguageMenu(!showTranslationLanguageMenu)}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{translationLanguageLabels[translationLanguage]}</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>

                  {showTranslationLanguageMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTranslationLanguageMenu(false)} />
                      <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded border border-gray-300 bg-white py-1 shadow-lg">
                        {Object.entries(translationLanguageLabels).map(([code, label]) => (
                          <button
                            key={code}
                            onClick={() => {
                              setTranslationLanguage(code as typeof translationLanguage);
                              setShowTranslationLanguageMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                              translationLanguage === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
                  <button onClick={() => setPdfScale(Math.max(0.25, pdfScale - 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                    <ZoomOut className="h-3 w-3 text-gray-700" />
                  </button>
                  <select
                    value={getZoomSelectValue(pdfScale)}
                    onChange={(e) => setPdfScale(parseInt(e.target.value) / 100)}
                    className="cursor-pointer border-none bg-transparent px-1 text-xs outline-none"
                  >
                    {getZoomMenuOptions(pdfScale).map((option) => (
                      <option key={option} value={option}>
                        {option}%
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setPdfScale(Math.min(2, pdfScale + 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                    <ZoomIn className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowTranslationViewModeMenu(!showTranslationViewModeMenu)}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <span>{translationViewModeLabels[translationViewMode]}</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>

                  {showTranslationViewModeMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowTranslationViewModeMenu(false)} />
                      <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded border border-gray-300 bg-white py-1 shadow-lg">
                        {Object.entries(translationViewModeLabels).map(([mode, label]) => (
                          <button
                            key={mode}
                            onClick={() => {
                              setTranslationViewMode(mode as typeof translationViewMode);
                              setShowTranslationViewModeMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                              translationViewMode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{currentPage}</span>
                    <span>/ {totalPages}</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded p-1 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
                  <button onClick={() => setPdfScale(Math.max(0.25, pdfScale - 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                    <ZoomOut className="h-3 w-3 text-gray-700" />
                  </button>
                  <select
                    value={getZoomSelectValue(pdfScale)}
                    onChange={(e) => setPdfScale(parseInt(e.target.value) / 100)}
                    className="cursor-pointer border-none bg-transparent px-1 text-xs outline-none"
                  >
                    {getZoomMenuOptions(pdfScale).map((option) => (
                      <option key={option} value={option}>
                        {option}%
                      </option>
                    ))}
                  </select>
                  <button onClick={() => setPdfScale(Math.min(2, pdfScale + 0.1))} className="rounded p-0.5 hover:bg-gray-100">
                    <ZoomIn className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>53</span>
            </button>
            <button className="text-gray-700 hover:text-gray-900"><Bookmark className="h-4 w-4" /></button>
            <button className="text-gray-700 hover:text-gray-900"><Download className="h-4 w-4" /></button>
            <button className="text-gray-700 hover:text-gray-900"><Maximize className="h-4 w-4" /></button>
            <button className="text-gray-700 hover:text-gray-900"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-4 py-2.5 ${rightSidebarCollapsed ? 'px-2' : 'px-5'}`}>
          {!rightSidebarCollapsed ? rightSidebarActions : null}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div ref={mainContentRef} className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar - Preview and Structure */}
        <div className={`w-56 border-r border-gray-200 bg-gray-50 flex min-h-0 flex-col flex-shrink-0 transition-all duration-300 ${leftSidebarCollapsed ? 'hidden' : ''}`}>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === 'preview' && (
              <PageThumbnails 
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageClick={setCurrentPage}
              />
            )}
            {sidebarTab === 'structure' && (
              <TableOfContents elements={[]} paperId={paperId} />
            )}
          </div>

          {/* User Panel at Bottom */}
          <UserPanel />
        </div>

        {/* Middle Content Area */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
          {/* Content Area */}
          <div
            className="h-full min-h-0 flex-1 overflow-hidden bg-gray-100"
            style={{ transform: `translateX(${contentCenterOffset}px)` }}
          >
            {activeTab === 'blog' && <BlogView paper={paper} language={blogLanguage} scale={blogScale} isFirstVisit={isFirstBlogVisit} />}
            {activeTab === 'paper' && (
              <PaperView
                paper={paper}
                currentPage={currentPage}
                pdfScale={pdfScale}
                highlightTarget={paperHighlightTarget}
                onClearHighlight={() => setPaperHighlightTarget(null)}
                onTextSelect={handlePaperTextSelection}
              />
            )}
            {activeTab === 'translation' && (
              <TranslationView
                paper={paper}
                pdfScale={pdfScale}
                isParsing={isParsing}
                targetLanguage={translationLanguage}
                viewMode={translationViewMode}
                hideControlsBar
              />
            )}
          </div>
        </div>

        {!rightSidebarCollapsed ? (
          <div
            className="relative z-10 -ml-px w-0 flex-shrink-0"
          >
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize right sidebar"
              onMouseDown={(event) => {
                event.preventDefault();
                setIsResizingRightSidebar(true);
              }}
              className={`group absolute inset-y-0 -left-1 w-2 cursor-col-resize ${
                isResizingRightSidebar ? 'bg-blue-50' : ''
              }`}
            />
          </div>
        ) : null}

        {/* Right Sidebar - Comments & Notes */}
        <div
          className={`bg-white flex-shrink-0 ${
            !isResizingRightSidebar && rightSidebarCollapsed ? 'hidden' : ''
          } ${isResizingRightSidebar ? '' : 'transition-all duration-300'}`}
          style={{ width: rightSidebarWidth }}
        >
          <CommentsPanel
            paperId={paperId}
            paperTitle={paper.title}
            paperCategories={paper.categories}
            activeTab={rightSidebarTab}
            activeCitationId={paperHighlightTarget?.citationId ?? null}
            onSelectSummaryCitation={handleSummaryCitationSelect}
            selectedExcerpt={selectedExcerpt}
            onClearSelectedExcerpt={() => setSelectedExcerpt(null)}
            onChangeTab={setRightSidebarTab}
          />
        </div>
      </div>
    </div>
  );
}
