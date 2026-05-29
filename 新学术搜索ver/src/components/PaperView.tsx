import React from 'react';
import { Paper } from '../types';
import { mockSentencePairs } from '../data/mockSentences';

interface PaperViewProps {
  paper: Paper;
  currentPage: number;
  pdfScale: number;
  highlightTarget?: {
    citationId: string;
    elementId: string;
    page: number;
    trigger: number;
  } | null;
  onClearHighlight?: () => void;
  onTextSelect?: (selectedText: string | null) => void;
}

export function PaperView({ paper, currentPage, pdfScale, highlightTarget = null, onClearHighlight, onTextSelect }: PaperViewProps) {
  const pdfPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const isLocalUpload = paper.id.startsWith('local-reader-') && Boolean(paper.pdfUrl);
  
  // Group sentences by page
  const sentencesByPage: Record<number, any[]> = {};
  mockSentencePairs.forEach(sentence => {
    if (!sentencesByPage[sentence.page]) {
      sentencesByPage[sentence.page] = [];
    }
    sentencesByPage[sentence.page].push(sentence);
  });

  React.useEffect(() => {
    if (!highlightTarget || !containerRef.current) {
      return;
    }

    const targetElement = containerRef.current.querySelector<HTMLElement>(
      `[data-element-id="${highlightTarget.elementId}"]`
    );

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [highlightTarget?.trigger]);

  const emitSelection = React.useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? '';

    if (!selection || !containerRef.current) {
      return;
    }

    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    const withinContainer =
      (!!anchorNode && containerRef.current.contains(anchorNode)) ||
      (!!focusNode && containerRef.current.contains(focusNode));

    if (!withinContainer) {
      return;
    }

    onTextSelect?.(text || null);
  }, [onTextSelect]);

  if (isLocalUpload) {
    return (
      <div ref={containerRef} className="h-full min-h-0 overflow-auto bg-gray-100">
        <div className="px-6 py-6">
          <div
            className="mx-auto max-w-5xl rounded-lg bg-white shadow-lg"
            style={{
              transform: `scale(${pdfScale})`,
              transformOrigin: 'top center',
              marginBottom: `${Math.max(0, (pdfScale - 1) * 420)}px`,
            }}
          >
            <iframe
              src={paper.pdfUrl}
              title={paper.title}
              className="h-[calc(100vh-12rem)] min-h-[42rem] w-full rounded-lg border border-gray-300 bg-white"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 overflow-y-auto bg-gray-100"
      onMouseUp={emitSelection}
      onClick={(event) => {
        const target = event.target as HTMLElement;

        if (target.closest('[data-element-id]')) {
          return;
        }

        onClearHighlight?.();
      }}
    >
      <div className="py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {pdfPages.map((page) => (
            <div
              key={page}
              data-page={page}
              className="bg-white shadow-lg"
              style={{
                transform: `scale(${pdfScale})`,
                transformOrigin: 'top center',
                marginBottom: `${(pdfScale - 1) * 180}px`,
              }}
            >
              {/* PDF Page Content */}
              <div className="aspect-[8.5/11] border border-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 p-12 overflow-hidden">
                  <div className="space-y-2 text-justify">
                    {sentencesByPage[page]?.map((sentence) => {
                      const baseClasses = 'text-xs text-gray-800 leading-relaxed inline';
                      const isHighlighted = highlightTarget?.elementId === sentence.elementId;
                      
                      if (sentence.elementId.includes('title')) {
                        return (
                          <span
                            key={sentence.id}
                            data-element-id={sentence.elementId}
                            className={`${baseClasses} text-lg font-bold text-gray-900 block text-center mb-4 rounded-sm transition-all ${
                              isHighlighted ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                            }`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else if (sentence.elementId.includes('author')) {
                        return (
                          <span
                            key={sentence.id}
                            data-element-id={sentence.elementId}
                            className={`${baseClasses} text-xs text-gray-700 block text-center mb-4 rounded-sm transition-all ${
                              isHighlighted ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                            }`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else if (sentence.elementId.includes('heading')) {
                        return (
                          <span
                            key={sentence.id}
                            data-element-id={sentence.elementId}
                            className={`${baseClasses} text-sm font-bold text-gray-900 block mt-4 mb-2 rounded-sm transition-all ${
                              isHighlighted ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                            }`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={sentence.id}
                            data-element-id={sentence.elementId}
                            className={`${baseClasses} rounded-sm px-0.5 transition-all ${
                              isHighlighted ? 'bg-blue-100 ring-2 ring-blue-200' : ''
                            }`}
                          >
                            {sentence.original}{' '}
                          </span>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <span className="text-xs text-gray-400">- {page} -</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
