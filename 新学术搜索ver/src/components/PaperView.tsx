import React from 'react';
import { Presentation, X } from 'lucide-react';
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
  selectionMode?: boolean;
  onConvertSelection?: () => void;
}

type SelectionRect = { left: number; top: number; width: number; height: number };

export function PaperView({
  paper,
  currentPage,
  pdfScale,
  highlightTarget = null,
  onClearHighlight,
  onTextSelect,
  selectionMode = false,
  onConvertSelection,
}: PaperViewProps) {
  const pdfPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const [selectionRect, setSelectionRect] = React.useState<SelectionRect | null>(null);
  const [isSelecting, setIsSelecting] = React.useState(false);
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
    if (selectionMode) {
      return;
    }

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
  }, [onTextSelect, selectionMode]);

  React.useEffect(() => {
    setSelectionRect(null);
    setIsSelecting(false);
    dragStartRef.current = null;
  }, [selectionMode, paper.id]);

  const getPointerPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return null;

    const bounds = container.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left + container.scrollLeft,
      y: event.clientY - bounds.top + container.scrollTop,
    };
  };

  const handleSelectionStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!selectionMode || event.button !== 0 || (event.target as HTMLElement).closest('[data-selection-action]')) return;

    const point = getPointerPosition(event);
    if (!point) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = point;
    setIsSelecting(true);
    setSelectionRect({ left: point.x, top: point.y, width: 0, height: 0 });
  };

  const handleSelectionMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    if (!selectionMode || !isSelecting || !start) return;

    const point = getPointerPosition(event);
    if (!point) return;

    setSelectionRect({
      left: Math.min(start.x, point.x),
      top: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    });
  };

  const handleSelectionEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!selectionMode || !isSelecting) return;

    setIsSelecting(false);
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSelectionRect((current) => current && current.width >= 36 && current.height >= 36 ? current : null);
  };

  const selectionLayer = selectionMode ? (
    <div
      className="absolute inset-0 z-30 cursor-crosshair"
      onPointerDown={handleSelectionStart}
      onPointerMove={handleSelectionMove}
      onPointerUp={handleSelectionEnd}
      onPointerCancel={handleSelectionEnd}
    >
      {selectionRect ? (
        <div
          className="absolute rounded-md border-2 border-blue-600 bg-blue-500/10 shadow-[0_0_0_9999px_rgba(15,23,42,0.12)]"
          style={selectionRect}
        >
          {!isSelecting ? (
            <div
              data-selection-action
              className="absolute -bottom-12 right-0 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onConvertSelection?.();
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Presentation className="h-4 w-4" />
                <span>转 PPT</span>
              </button>
              <button
                type="button"
                aria-label="取消框选"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectionRect(null);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;

  if (isLocalUpload) {
    return (
      <div ref={containerRef} className="relative h-full min-h-0 overflow-auto bg-gray-100">
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
        {selectionLayer}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 overflow-y-auto bg-gray-100"
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
      {selectionLayer}
    </div>
  );
}
