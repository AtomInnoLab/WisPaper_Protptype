import React, { useEffect, useState } from 'react';
import { Paper, DocumentElement } from '../types';
import { mockParsedDocuments, translateElement } from '../data/mockDocuments';
import { DocumentRenderer } from './DocumentRenderer';
import { DualViewTranslation } from './DualViewTranslation';
import { ChevronDown, Loader2 } from 'lucide-react';
import { ParsingStatus } from './ParsingStatus';

interface TranslationViewProps {
  paper: Paper;
  pdfScale: number;
  isParsing?: boolean;
  targetLanguage?: Language;
  viewMode?: ViewMode;
  hideControlsBar?: boolean;
}

type ViewMode = 'dual-vertical' | 'translation-only' | 'dual-horizontal';
type Language = 'zh-CN' | 'en' | 'ja' | 'ko' | 'id';

const languages = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'id', label: 'Bahasa Indonesia' },
];

const viewModes = [
  { value: 'dual-vertical', label: '上下对照' },
  { value: 'translation-only', label: '仅显示译文' },
  { value: 'dual-horizontal', label: '左右对照' },
];

export function TranslationView({
  paper,
  pdfScale,
  isParsing,
  targetLanguage: controlledTargetLanguage,
  viewMode: controlledViewMode,
  hideControlsBar = false,
}: TranslationViewProps) {
  const [elements, setElements] = useState<DocumentElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('dual-horizontal');
  const [internalTargetLanguage, setInternalTargetLanguage] = useState<Language>('zh-CN');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showViewModeMenu, setShowViewModeMenu] = useState(false);
  const [translating, setTranslating] = useState(false);

  const viewMode = controlledViewMode ?? internalViewMode;
  const targetLanguage = controlledTargetLanguage ?? internalTargetLanguage;
  const setViewMode = controlledViewMode ? (() => {}) : setInternalViewMode;
  const setTargetLanguage = controlledTargetLanguage ? (() => {}) : setInternalTargetLanguage;

  useEffect(() => {
    loadDocument();
  }, [paper.id]);

  const loadDocument = async () => {
    setLoading(true);
    
    // Simulate WisDoc API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const parsedDoc = mockParsedDocuments[paper.id];
    if (parsedDoc) {
      setElements(parsedDoc.elements);
      setLoading(false);
      
      // Start translation process
      startTranslation(parsedDoc.elements);
      return;
    }

    const fallbackElements: DocumentElement[] = [
      {
        id: `${paper.id}-title`,
        type: 'title',
        content: paper.title,
      },
      {
        id: `${paper.id}-authors`,
        type: 'author',
        content: paper.authors.join(', '),
      },
      {
        id: `${paper.id}-abstract-heading`,
        type: 'heading',
        level: 1,
        content: 'Abstract',
      },
      {
        id: `${paper.id}-abstract`,
        type: 'paragraph',
        content: paper.abstract || 'This local file is available in Paper view. Full structured parsing is not available in this prototype.',
      },
    ];

    setElements(fallbackElements);
    setLoading(false);
    startTranslation(fallbackElements);
  };

  const startTranslation = async (elementsList: DocumentElement[]) => {
    setTranslating(true);
    const translatableTypes = ['title', 'paragraph', 'heading', 'image'];
    
    for (let i = 0; i < elementsList.length; i++) {
      const element = elementsList[i];
      
      if (translatableTypes.includes(element.type)) {
        setElements(prev => 
          prev.map(el => 
            el.id === element.id 
              ? { ...el, translating: true }
              : el
          )
        );

        const translation = await translateElement(element);
        
        setElements(prev => 
          prev.map(el => 
            el.id === element.id 
              ? { ...el, translation, translating: false }
              : el
          )
        );

        setTranslationProgress(((i + 1) / elementsList.length) * 100);
      }
    }
    setTranslating(false);
  };

  // 检查翻译是否完成
  const isTranslationComplete = !translating && translationProgress >= 100;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading document from WisDoc...</p>
        </div>
      </div>
    );
  }

  const selectedLanguage = languages.find(lang => lang.code === targetLanguage);
  const selectedViewMode = viewModes.find(mode => mode.value === viewMode);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Controls Bar */}
      {!hideControlsBar ? (
      <div className="px-8 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
          >
            <span>{selectedLanguage?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showLanguageMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setTargetLanguage(lang.code as Language);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    lang.code === targetLanguage ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowViewModeMenu(!showViewModeMenu)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm min-w-[140px] justify-between"
          >
            <span>{selectedViewMode?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showViewModeMenu && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
              {viewModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => {
                    setViewMode(mode.value as ViewMode);
                    setShowViewModeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    mode.value === viewMode ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      ) : null}

      {/* Main Content Area */}
      {viewMode === 'dual-horizontal' ? (
        <DualViewTranslation elements={elements} paperId={paper.id} pdfScale={pdfScale} isParsing={isParsing} />
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Document Content */}
            <DocumentRenderer elements={elements} viewMode={viewMode} pdfScale={pdfScale} />
          </div>
        </div>
      )}
    </div>
  );
}
