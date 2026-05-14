import React, { useRef, useState } from 'react';
import { Send, HelpCircle, Database, Sparkles, Globe2, ChevronDown, Check, Search, Plus, X } from 'lucide-react';
import { ScholarQAResults } from './ScholarQAResults';
import { ResourcesPanel } from './ResourcesPanel';
import { useLanguage } from '../contexts/LanguageContext';

type KnowledgeSource = 'my-library' | 'academic-search' | 'web-search';

interface ScholarQAProps {
  papersCount?: number;
  onReset?: () => void;
}

export function ScholarQA({ papersCount = 9, onReset }: ScholarQAProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [selectedKnowledgeSources, setSelectedKnowledgeSources] = useState<KnowledgeSource[]>(['my-library', 'academic-search']);
  const [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const knowledgeSourceOptions: Array<{ id: KnowledgeSource; label: string; icon: React.ReactNode }> = [
    { id: 'my-library', label: isZh ? '我的知识库' : 'My Library', icon: <Database className="h-4 w-4 text-gray-500" /> },
    { id: 'academic-search', label: isZh ? '学术搜索' : 'Scholar Search', icon: <Search className="h-4 w-4 text-gray-500" /> },
    { id: 'web-search', label: isZh ? '网页检索' : 'Web Search', icon: <Globe2 className="h-4 w-4 text-gray-500" /> },
  ];

  const toggleKnowledgeSource = (source: KnowledgeSource) => {
    setSelectedKnowledgeSources((prev) => {
      if (prev.includes(source)) {
        const nextSources = prev.filter((item) => item !== source);
        return nextSources.length > 0 ? nextSources : prev;
      }

      return [...prev, source];
    });
  };

  const knowledgeSourceLabel =
    selectedKnowledgeSources.length === knowledgeSourceOptions.length
      ? isZh ? '全部来源' : 'All Sources'
      : selectedKnowledgeSources.length === 1
        ? knowledgeSourceOptions.find((option) => option.id === selectedKnowledgeSources[0])?.label ?? (isZh ? '选择来源' : 'Select Source')
        : isZh ? `${selectedKnowledgeSources.length} 个来源` : `${selectedKnowledgeSources.length} Sources`;

  const handleSubmit = () => {
    if (question.trim()) {
      setSubmittedQuestion(question);
      setHasResults(true);
      console.log('Question submitted:', question);
    }
  };

  const handleLocalAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      setAttachments((current) => [...current, ...files.map((file) => file.name)]);
    }

    event.target.value = '';
  };

  const handleAttachmentOption = (type: 'local' | 'google-drive' | 'baidu-drive') => {
    setShowAttachmentMenu(false);

    if (type === 'local') {
      attachmentInputRef.current?.click();
      return;
    }

    const importedFile = type === 'google-drive'
      ? isZh ? 'Google Drive 导入文件' : 'Google Drive import'
      : isZh ? '百度网盘导入文件' : 'Baidu Netdisk import';

    setAttachments((current) => [...current, importedFile]);
  };

  const handleReset = () => {
    setQuestion('');
    setSubmittedQuestion('');
    setHasResults(false);
    setIsTyping(false);
    if (onReset) {
      onReset();
    }
  };

  // Expose reset function through ref or callback
  React.useEffect(() => {
    if (onReset) {
      // Store the reset function reference
      (window as any).__scholarQAReset = handleReset;
    }
    return () => {
      delete (window as any).__scholarQAReset;
    };
  }, [onReset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Show results view if there are results
  if (hasResults) {
    return (
      <div className="flex-1 flex overflow-hidden">
        <ScholarQAResults question={submittedQuestion} papersCount={papersCount} />
        <ResourcesPanel />
      </div>
    );
  }

  // Show initial empty state
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <HelpCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Hi, Ask anything based on your own library.
            </h1>
            <p className="text-sm text-gray-500">
              提示：对话中输入"2"可生成表格对比模式
            </p>
          </div>

          {/* Question Input */}
          <div>
            <div className="relative rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent">
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                rows={3}
                className="block w-full px-5 pt-4 pb-12 pr-16 text-base border-0 rounded-lg resize-none focus:outline-none placeholder:text-gray-400"
              />
              <div className="absolute left-5 bottom-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAttachmentMenu((prev) => !prev);
                        setShowKnowledgeMenu(false);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200"
                      aria-label={isZh ? '添加文件' : 'Add file'}
                      title={isZh ? '添加文件' : 'Add file'}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {showAttachmentMenu ? (
                      <div className="absolute bottom-full left-0 mb-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleAttachmentOption('local')}
                          className="block w-full px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
                        >
                          {isZh ? '添加本地文件' : 'Add local file'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttachmentOption('google-drive')}
                          className="block w-full px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
                        >
                          {isZh ? '从 Google Drive 导入' : 'Import from Google Drive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttachmentOption('baidu-drive')}
                          className="block w-full px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
                        >
                          {isZh ? '从百度网盘导入' : 'Import from Baidu Netdisk'}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowKnowledgeMenu((prev) => !prev);
                        setShowAttachmentMenu(false);
                      }}
                      className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-gray-900 transition-colors hover:bg-gray-200"
                    >
                      <Database className="w-4 h-4" />
                      <span>{knowledgeSourceLabel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showKnowledgeMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showKnowledgeMenu ? (
                      <div className="absolute bottom-full left-0 mb-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        {knowledgeSourceOptions.map((option) => {
                          const isSelected = selectedKnowledgeSources.includes(option.id);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => toggleKnowledgeSource(option.id)}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded border border-gray-300">
                                {isSelected ? <Check className="h-3 w-3 text-gray-900" /> : null}
                              </span>
                              {option.icon}
                              <span>{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {attachments.length > 0 ? (
                <div className="absolute left-5 right-16 bottom-14 flex flex-wrap gap-2">
                  {attachments.map((attachment, index) => (
                    <span
                      key={`${attachment}-${index}`}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      <span className="truncate">{attachment}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="text-gray-400 transition-colors hover:text-gray-800"
                        aria-label={isZh ? '移除文件' : 'Remove file'}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="absolute right-4 bottom-4 p-2.5 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={attachmentInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleLocalAttachmentChange}
            />
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Unrestricted Scholar QA</span>
        </div>
      </div>
    </div>
  );
}
