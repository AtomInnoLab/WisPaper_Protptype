import React, { useRef, useState } from 'react';
import { Send, HelpCircle, Database, Sparkles, Globe2, ChevronDown, Check, Search, Plus, X, RotateCw, CornerUpLeft } from 'lucide-react';
import { ScholarQAResults } from './ScholarQAResults';
import { useLanguage } from '../contexts/LanguageContext';

type KnowledgeSource = 'current-paper' | 'my-library' | 'academic-search' | 'web-search';

const qaSampleQuestionSets = [
  [
    { label: { zh: '查概念', en: 'Concept' }, question: { zh: 'Paleodictyon 遗迹化石的形态特征是什么？', en: 'What are the morphological characteristics of Paleodictyon trace fossils?' } },
    { label: { zh: '看趋势', en: 'Trends' }, question: { zh: '大型语言模型幻觉问题未来可能通过哪些方法解决？', en: 'Which approaches could reduce hallucinations in large language models?' } },
    { label: { zh: '找文献', en: 'Papers' }, question: { zh: '推荐循环经济领域近五年被高引用的经典实证研究。', en: 'Recommend highly cited empirical studies on the circular economy from the past five years.' } },
  ],
  [
    { label: { zh: '查概念', en: 'Concept' }, question: { zh: '因果推断中的可识别性是什么意思？', en: 'What does identifiability mean in causal inference?' } },
    { label: { zh: '看趋势', en: 'Trends' }, question: { zh: '生成式 AI 正在如何改变科学发现的研究流程？', en: 'How is generative AI changing scientific discovery workflows?' } },
    { label: { zh: '找文献', en: 'Papers' }, question: { zh: '寻找近五年关于开放科学实践效果的系统综述。', en: 'Find recent systematic reviews on the effects of open science practices.' } },
  ],
  [
    { label: { zh: '查概念', en: 'Concept' }, question: { zh: '图神经网络中的过平滑现象是如何产生的？', en: 'How does over-smoothing arise in graph neural networks?' } },
    { label: { zh: '看趋势', en: 'Trends' }, question: { zh: '自动化实验室未来最值得关注的技术方向有哪些？', en: 'Which technical directions are most promising for autonomous laboratories?' } },
    { label: { zh: '找文献', en: 'Papers' }, question: { zh: '推荐研究科研可重复性危机的代表性论文和综述。', en: 'Recommend representative papers and reviews on the reproducibility crisis.' } },
  ],
];

interface ScholarQAProps {
  papersCount?: number;
  onReset?: () => void;
  initialQuestion?: string;
  onOpenDeepSearch?: (query: string) => void;
  onStartAgent?: (query: string) => void;
  userCredits?: number;
  onUpgrade?: () => void;
}

export function ScholarQA({ papersCount = 9, onReset, initialQuestion = '', onOpenDeepSearch, onStartAgent, userCredits = 50000, onUpgrade }: ScholarQAProps) {
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
  const [sampleSetIndex, setSampleSetIndex] = useState(0);
  const [effort, setEffort] = useState<'low' | 'medium' | 'high'>(() => {
    try { return (localStorage.getItem('wispaper-qa-effort') as 'low' | 'medium' | 'high') || 'medium'; } catch { return 'medium'; }
  });
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const sampleQuestions = qaSampleQuestionSets[sampleSetIndex];
  const knowledgeSourceOptions: Array<{ id: KnowledgeSource; label: string; icon: React.ReactNode }> = [
    { id: 'current-paper', label: isZh ? '单篇论文' : 'Current Paper', icon: <Sparkles className="h-4 w-4 text-gray-500" /> },
    { id: 'my-library', label: isZh ? '我的知识库' : 'My Library', icon: <Database className="h-4 w-4 text-gray-500" /> },
    { id: 'academic-search', label: isZh ? '学术搜索' : 'Scholar Search', icon: <Search className="h-4 w-4 text-gray-500" /> },
    { id: 'web-search', label: isZh ? '网页检索' : 'Web Search', icon: <Globe2 className="h-4 w-4 text-gray-500" /> },
  ];

  const changeEffort = (value: 'low' | 'medium' | 'high') => {
    setEffort(value);
    try { localStorage.setItem('wispaper-qa-effort', value); } catch {}
  };

  React.useEffect(() => {
    const value = initialQuestion.trim();
    if (value) {
      setQuestion(value);
      setSubmittedQuestion(value);
      setHasResults(true);
    }
  }, [initialQuestion]);

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
        <ScholarQAResults question={submittedQuestion} papersCount={papersCount} effort={effort} onEffortChange={changeEffort} selectedSources={selectedKnowledgeSources} onSourcesChange={(sources) => setSelectedKnowledgeSources(sources as KnowledgeSource[])} userCredits={userCredits} onUpgrade={onUpgrade} onOpenDeepSearch={onOpenDeepSearch} onStartAgent={onStartAgent} />
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
                aria-label={isZh ? '发送问题' : 'Send question'}
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

            <section className="mt-8" aria-labelledby="qa-sample-questions-title">
              <div className="flex items-center justify-between border-b border-gray-200 px-1 pb-4">
                <h2 id="qa-sample-questions-title" className="text-[15px] font-semibold text-slate-600">
                  {isZh ? '试试这些科研问题' : 'Try these research questions'}
                </h2>
                <button
                  type="button"
                  onClick={() => setSampleSetIndex((index) => (index + 1) % qaSampleQuestionSets.length)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:rotate-180"
                  aria-label={isZh ? '换一组问题' : 'Show another set of questions'}
                  title={isZh ? '换一组' : 'Refresh'}
                >
                  <RotateCw className="h-[18px] w-[18px]" />
                </button>
              </div>
              <div>
                {sampleQuestions.map((item) => (
                  <button
                    key={item.question.zh}
                    type="button"
                    onClick={() => {
                      setQuestion(isZh ? item.question.zh : item.question.en);
                      setIsTyping(true);
                    }}
                    className="group flex w-full items-center gap-4 border-b border-gray-200 px-2 py-4 text-left transition hover:bg-slate-50/80"
                  >
                    <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {isZh ? item.label.zh : item.label.en}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] leading-6 text-slate-600 transition group-hover:text-slate-950">
                      {isZh ? item.question.zh : item.question.en}
                    </span>
                    <CornerUpLeft className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-x-0.5 group-hover:text-slate-700" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5"><Sparkles className="w-4 h-4" />思考强度</span>
          <div className="flex rounded-lg bg-gray-100 p-1">
            {(['low', 'medium', 'high'] as const).map((value) => <button key={value} onClick={() => changeEffort(value)} className={`rounded-md px-3 py-1 text-xs ${effort === value ? 'bg-white font-semibold text-blue-600 shadow-sm' : 'text-gray-500'}`}>{value === 'low' ? '低' : value === 'medium' ? '中' : '高'}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
