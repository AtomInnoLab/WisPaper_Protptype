import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Database, FileText, Globe2, MessageSquare, Search, StickyNote, X, ThumbsUp, ThumbsDown, Reply, Sparkles, SendHorizontal, Copy, FlaskConical, History, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SummaryCitation {
  citationId: string;
  elementId: string;
  page: number;
}

type KnowledgeSource = 'current-paper' | 'my-library' | 'academic-search' | 'web-library';
type ChatResponseMode = 'summary' | 'selection-answer';

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  responseMode: ChatResponseMode | null;
  excerpt?: string | null;
}

export interface PaperComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentsPanelProps {
  paperId: string;
  paperTitle?: string;
  paperCategories?: string[];
  activeTab: 'home' | 'info' | 'comments' | 'notes' | 'chat' | 'history';
  comments?: PaperComment[];
  activeCitationId?: string | null;
  onSelectSummaryCitation?: (citation: SummaryCitation) => void;
  selectedExcerpt?: string | null;
  onClearSelectedExcerpt?: () => void;
  onChangeTab?: (tab: 'home' | 'info' | 'comments' | 'notes' | 'chat' | 'history') => void;
}

export function CommentsPanel({
  paperId,
  paperTitle,
  paperCategories = [],
  activeTab,
  comments = [],
  activeCitationId = null,
  onSelectSummaryCitation,
  selectedExcerpt = null,
  onClearSelectedExcerpt,
  onChangeTab,
}: CommentsPanelProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [newContent, setNewContent] = useState('Summarize this paper');
  const [chatWorkflow, setChatWorkflow] = useState<'idle' | 'thinking' | 'summary' | 'selection-answer'>('idle');
  const [chatUserPrompt, setChatUserPrompt] = useState<string | null>(null);
  const [chatSubmittedExcerpt, setChatSubmittedExcerpt] = useState<string | null>(null);
  const [chatResponseMode, setChatResponseMode] = useState<ChatResponseMode | null>(null);
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; content: string; timestamp: string; color: string }>>([]);
  const [copiedResponse, setCopiedResponse] = useState<'summary' | 'selection-answer' | null>(null);
  const [relatedPaperSearchQuery, setRelatedPaperSearchQuery] = useState('');
  const [showKnowledgeSourceMenu, setShowKnowledgeSourceMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [chatAttachments, setChatAttachments] = useState<string[]>([]);
  const [selectedKnowledgeSources, setSelectedKnowledgeSources] = useState<KnowledgeSource[]>(['current-paper']);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 'summary',
      title: 'Summarize this paper',
      preview: 'Section-by-section summary with references to the original paper.',
      timestamp: 'Just now',
      responseMode: 'summary',
      excerpt: null,
    },
    {
      id: 'parallel-training',
      title: 'How does Transformer improve parallel training?',
      preview: 'Restores an answer grounded in the architecture discussion.',
      timestamp: '2 hours ago',
      responseMode: 'selection-answer',
      excerpt: 'The Transformer allows significantly more parallelization and reduces the sequential computation constraints found in recurrent models.',
    },
    {
      id: 'attention-dependencies',
      title: 'Why is self-attention enough for long-range dependencies?',
      preview: 'Restores an answer about attention routing and global context.',
      timestamp: 'Yesterday',
      responseMode: 'selection-answer',
      excerpt: 'Self-attention connects every position to every other position directly, shortening the path length for modeling long-range dependencies.',
    },
  ]);
  const [responseFeedback, setResponseFeedback] = useState<Record<'summary' | 'selection-answer', 'up' | 'down' | null>>({
    summary: null,
    'selection-answer': null,
  });
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const mockComments: PaperComment[] = [
    {
      id: '1',
      author: '张涵',
      avatar: '张',
      content: 'This attention mechanism is quite innovative. Worth exploring further in our research.',
      timestamp: '2 hours ago',
      likes: 3,
    },
    {
      id: '2',
      author: '李明',
      avatar: '李',
      content: 'The multi-head attention concept could be applied to our current project.',
      timestamp: '1 day ago',
      likes: 5,
    },
    {
      id: '3',
      author: 'John Smith',
      avatar: 'J',
      content: 'Great explanation of the encoder-decoder architecture. The residual connections are key.',
      timestamp: '2 days ago',
      likes: 2,
    },
  ];
  const commentsList = [...comments, ...mockComments];

  const mockNotes = [
    {
      id: '1',
      content: 'Key insight: Self-attention allows parallel computation unlike RNNs.',
      timestamp: '3 hours ago',
      color: 'yellow',
    },
    {
      id: '2',
      content: 'Compare this approach with BERT and GPT architectures.',
      timestamp: '1 day ago',
      color: 'yellow',
    },
    {
      id: '3',
      content: 'TODO: Implement scaled dot-product attention in our model.',
      timestamp: '2 days ago',
      color: 'blue',
    },
  ];
  const selectionAnswerText = 'This selected passage is describing the paper\'s core claim: Transformer removes recurrence and relies on attention as the main routing mechanism. In the context of your question, the important implication is that dependency modeling is no longer constrained by sequential recurrence, which is why the model can train more efficiently while still capturing long-range structure.';
  const notesList = [...savedNotes, ...mockNotes];
  const quickQuestions = [
    'Summarize this paper',
    'How does Transformer improve parallel training compared with RNN-based systems?',
    'Why is self-attention enough to model long-range dependencies in this paper?',
  ];
  const relatedPaperQueries = [
    '查找最近一年关于解决流式语音合成中文本与语音对齐问题的 SOTA 论文。',
    '哪篇论文最早提出了 Thinker-Talker 双模型架构，Qwen3.5-Omni 在此基础上有哪些本质改进？',
    '调研目前哪些研究正在探索 “Audio-Visual Vibe Coding” 即基于视觉和音频输入直接生成代码的方向。',
  ];
  const filteredRelatedPaperQueries = relatedPaperQueries.filter((example) =>
    example.toLowerCase().includes(relatedPaperSearchQuery.trim().toLowerCase()),
  );
  const primaryCategory = paperCategories[0] || 'this topic';
  const ideaCtaCopy = `围绕 ${primaryCategory} 继续挖掘后续问题、交叉方向与潜在研究空白。`;
  const reproductionCtaCopy = `基于当前方法路线生成复现实验步骤、环境配置与验证计划。`;
  const knowledgeSourceOptions: Array<{ id: KnowledgeSource; label: string; icon: React.ReactNode }> = [
    { id: 'current-paper', label: isZh ? '当前文章' : 'Current Paper', icon: <FileText className="h-4 w-4 text-gray-500" /> },
    { id: 'my-library', label: isZh ? '我的知识库' : 'My Library', icon: <Database className="h-4 w-4 text-gray-500" /> },
    { id: 'academic-search', label: isZh ? '学术搜索' : 'Scholar Search', icon: <Database className="h-4 w-4 text-gray-500" /> },
    { id: 'web-library', label: isZh ? '网页检索' : 'Web Search', icon: <Globe2 className="h-4 w-4 text-gray-500" /> },
  ];
  const knowledgeSourceLabel =
    selectedKnowledgeSources.length === knowledgeSourceOptions.length
      ? isZh ? '全部来源' : 'All Sources'
      : selectedKnowledgeSources.length === 1
        ? knowledgeSourceOptions.find((option) => option.id === selectedKnowledgeSources[0])?.label ?? (isZh ? '选择来源' : 'Select Source')
        : isZh ? `${selectedKnowledgeSources.length} 个来源` : `${selectedKnowledgeSources.length} Sources`;

  const toggleKnowledgeSource = (source: KnowledgeSource) => {
    setSelectedKnowledgeSources((current) => {
      if (current.includes(source)) {
        const nextSources = current.filter((item) => item !== source);
        return nextSources.length > 0 ? nextSources : current;
      }

      return [...current, source];
    });
  };

  const handleLocalAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      setChatAttachments((current) => [...current, ...files.map((file) => file.name)]);
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

    setChatAttachments((current) => [...current, importedFile]);
  };

  const renderAttachmentPicker = (placement: 'top' | 'bottom' = 'top') => (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShowAttachmentMenu((current) => !current);
          setShowKnowledgeSourceMenu(false);
        }}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-950 ${
          showAttachmentMenu ? 'invisible' : ''
        }`}
        aria-label={isZh ? '添加文件' : 'Add file'}
        title={isZh ? '添加文件' : 'Add file'}
      >
        <Plus className="h-4 w-4" />
      </button>

      {showAttachmentMenu ? (
        <div className={`absolute left-0 z-40 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg ${
          placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        }`}>
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
  );

  const renderKnowledgeSourcePicker = (placement: 'top' | 'bottom' = 'top') => (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShowKnowledgeSourceMenu((current) => !current);
          setShowAttachmentMenu(false);
        }}
        className="inline-flex max-w-[13rem] items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-950"
      >
        <Database className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{knowledgeSourceLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${showKnowledgeSourceMenu ? 'rotate-180' : ''}`} />
      </button>

      {showKnowledgeSourceMenu ? (
        <div className={`absolute left-0 z-30 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${
          placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
        }`}>
          {knowledgeSourceOptions.map((option) => {
            const isSelected = selectedKnowledgeSources.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleKnowledgeSource(option.id)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white">
                  {isSelected ? <Check className="h-3 w-3 text-gray-950" /> : null}
                </span>
                {option.icon}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  const getHistoryPreview = (mode: ChatResponseMode | null, excerpt: string | null) => {
    if (mode === 'summary') {
      return 'Section-by-section summary with references to the original paper.';
    }

    if (mode === 'selection-answer') {
      return excerpt
        ? `Answer grounded in selected text: ${excerpt}`
        : 'Answer grounded in the current paper context.';
    }

    return 'Question saved for this paper.';
  };

  const restoreChatHistoryItem = (item: ChatHistoryItem) => {
    onChangeTab?.('chat');
    setChatUserPrompt(item.title);
    setChatSubmittedExcerpt(item.excerpt ?? null);
    setChatResponseMode(item.responseMode);
    setChatWorkflow(item.responseMode ?? 'idle');
    setNewContent('');
  };

  const submitChatPrompt = (prompt: string) => {
    const submittedPrompt = prompt.trim();

    if (!submittedPrompt) {
      return;
    }

    const nextMode =
      submittedPrompt.includes('总结') || submittedPrompt.toLowerCase().includes('summarize')
        ? 'summary'
        : selectedExcerpt
          ? 'selection-answer'
          : null;

    onChangeTab?.('chat');
    setChatUserPrompt(submittedPrompt);
    setChatSubmittedExcerpt(selectedExcerpt);
    setChatResponseMode(nextMode);
    setChatWorkflow(nextMode ? 'thinking' : 'idle');
    setChatHistory((current) => [
      {
        id: `chat-${Date.now()}`,
        title: submittedPrompt,
        preview: getHistoryPreview(nextMode, selectedExcerpt),
        timestamp: 'Just now',
        responseMode: nextMode,
        excerpt: selectedExcerpt,
      },
      ...current.filter((item) => item.title !== submittedPrompt),
    ]);
    setNewContent('');
  };

  const handleAdd = () => {
    if (newContent.trim()) {
      if (activeTab === 'chat' || activeTab === 'home') {
        submitChatPrompt(newContent);
      }

      // In real app, this would save to backend
      console.log('Adding:', activeTab, newContent);
      if (activeTab !== 'chat' && activeTab !== 'home') {
        setNewContent('');
      }
    }
  };

  const isChatTab = activeTab === 'chat';
  const isInfoTab = activeTab === 'info';
  const isHomeTab = activeTab === 'home';
  const isHistoryTab = activeTab === 'history';
  const summaryCitations: Array<SummaryCitation & { text: string }> = [
    {
      citationId: '1',
      elementId: 'elem-5',
      page: 1,
      text: 'Transformer 完全基于注意力机制，直接移除了循环与卷积主干。',
    },
    {
      citationId: '2',
      elementId: 'elem-10',
      page: 2,
      text: '作者强调这种设计让模型能够直接建立全局依赖，而不再依赖 recurrent path。',
    },
    {
      citationId: '3',
      elementId: 'elem-16',
      page: 3,
      text: '在架构层面，编码器与解码器都由多头自注意力和前馈层堆叠而成，形成统一骨架。',
    },
  ];
  const summarySections = [
    {
      title: 'Abstract',
      items: [
        {
          text: 'The paper replaces recurrent and convolutional sequence modules with a Transformer architecture built entirely on attention.',
          citations: [summaryCitations[0]],
        },
        {
          text: 'The abstract frames the main payoff clearly: stronger parallelization and shorter training time without sacrificing translation quality.',
          citations: [summaryCitations[0], summaryCitations[1]],
        },
      ],
    },
    {
      title: 'Introduction',
      items: [
        {
          text: 'The introduction positions Transformer as a response to the limits of recurrent paths when modeling long-range dependencies.',
          citations: [summaryCitations[1]],
        },
        {
          text: 'It argues that attention can serve as the full dependency-routing mechanism, not just an auxiliary module attached to an encoder-decoder stack.',
          citations: [summaryCitations[1], summaryCitations[2]],
        },
      ],
    },
    {
      title: 'Architecture',
      items: [
        {
          text: 'The architecture section defines a repeatable encoder-decoder backbone where self-attention and feed-forward blocks become the standard computational unit.',
          citations: [summaryCitations[2]],
        },
      ],
    },
  ];
  const thinkingSteps = [
    'Scanning abstract and introduction for the core claim',
    'Matching architectural statements to source paragraphs',
    'Drafting a section-by-section summary with citations',
  ];

  useEffect(() => {
    if (chatWorkflow !== 'thinking') {
      return;
    }

    const timer = window.setTimeout(() => {
      setChatWorkflow(chatResponseMode ?? 'idle');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [chatResponseMode, chatWorkflow]);

  useEffect(() => {
    if (!copiedResponse) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopiedResponse(null);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [copiedResponse]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatInputRef.current?.focus();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedExcerpt) {
      setNewContent('');
      return;
    }

    if (!chatUserPrompt && chatWorkflow === 'idle' && !newContent.trim()) {
      setNewContent('Summarize this paper');
    }
  }, [chatUserPrompt, chatWorkflow, newContent, selectedExcerpt]);

  const renderCitationNode = (citation: SummaryCitation) => (
    <button
      key={citation.citationId}
      type="button"
      onClick={() => onSelectSummaryCitation?.(citation)}
      className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold transition-colors ${
        activeCitationId === citation.citationId
          ? 'bg-blue-700 text-white'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white'
      }`}
      aria-label={`Jump to source ${citation.citationId}`}
    >
      {citation.citationId}
    </button>
  );

  const getAgentResponseText = (mode: 'summary' | 'selection-answer') =>
    mode === 'summary'
      ? summarySections
          .map((section) => `${section.title}: ${section.items.map((item) => item.text).join(' ')}`)
          .join('\n\n')
      : `${chatSubmittedExcerpt ? `Focused passage: "${chatSubmittedExcerpt}"\n\n` : ''}${selectionAnswerText}`;

  const copyAgentResponse = async (mode: 'summary' | 'selection-answer') => {
    try {
      await navigator.clipboard.writeText(getAgentResponseText(mode));
      setCopiedResponse(mode);
    } catch (error) {
      console.error('Failed to copy response', error);
    }
  };

  const actionButtonClass = (active = false) =>
    `inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition-colors ${
      active
        ? 'border-blue-200 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
    }`;

  const iconActionButtonClass = (active = false) =>
    `inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
      active
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {activeTab === 'info' ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">Paper Info</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                View quick metadata, reading progress, and paper-level context here.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paper ID</span>
                  <span className="font-medium text-slate-950">{paperId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-slate-950">In Library</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reading Progress</span>
                  <span className="font-medium text-slate-950">Page 3 / 15</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'comments' ? (
          <div className="space-y-4">
            {commentsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
              </div>
            ) : (
              commentsList.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-slate-300">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-950">{comment.author}</span>
                        <span className="text-xs text-slate-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-6">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-11 mt-2">
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'notes' ? (
          <div className="space-y-3">
            {mockNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <StickyNote className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No notes yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first note</p>
              </div>
            ) : (
              notesList.map((note) => (
                <div 
                  key={note.id} 
                  className={`rounded-lg border bg-white p-3.5 shadow-sm ${
                    note.color === 'yellow' 
                      ? 'border-l-4 border-l-amber-300 border-slate-200' 
                      : 'border-l-4 border-l-blue-400 border-slate-200'
                  } transition-colors hover:border-slate-300 group`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-slate-800 leading-6 flex-1">
                      {note.content}
                    </p>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">{note.timestamp}</span>
                </div>
              ))
            )}
          </div>
        ) : isHistoryTab ? (
          <div className="space-y-4">
            <div className="space-y-2.5">
              {chatHistory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => restoreChatHistoryItem(item)}
                  className={`w-full rounded-lg border bg-white p-3.5 text-left shadow-sm transition-colors ${
                    chatUserPrompt === item.title
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.preview}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-400">{item.timestamp}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : isHomeTab ? (
          <div className="space-y-4">
            <div className="relative">
              {selectedExcerpt ? (
                <div className="relative z-0 -mb-4 rounded-t-[1.2rem] border border-gray-200 bg-gray-100 px-4 pb-6 pt-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                  <div className="flex items-start gap-3">
                    <p className="min-w-0 flex-1 line-clamp-3 text-sm leading-5 text-gray-700">
                      {selectedExcerpt}
                    </p>
                    <button
                      type="button"
                      onClick={onClearSelectedExcerpt}
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                      aria-label="Clear selected text"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="relative z-10 rounded-[1.2rem] border border-gray-200 bg-white p-4 shadow-sm">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={
                    selectedExcerpt
                      ? 'Ask about the selected text...'
                      : 'What do you want to do with this paper?'
                  }
                  className="min-h-[76px] w-full resize-none bg-transparent text-[15px] leading-6 text-gray-900 outline-none placeholder:text-gray-500"
                  rows={3}
                />

                {chatAttachments.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chatAttachments.map((attachment, index) => (
                      <span
                        key={`${attachment}-${index}`}
                        className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        <span className="truncate">{attachment}</span>
                        <button
                          type="button"
                          onClick={() => setChatAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          className="text-gray-400 transition-colors hover:text-gray-800"
                          aria-label={isZh ? '移除文件' : 'Remove file'}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {renderAttachmentPicker('bottom')}
                    {renderKnowledgeSourcePicker('bottom')}
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newContent.trim()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    aria-label="Send"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-xs leading-5 text-slate-600">
                      {ideaCtaCopy}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-slate-950">
                    发现灵感
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-xs leading-5 text-slate-600">
                      {reproductionCtaCopy}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-slate-950">
                    开始复现
                  </p>
                </div>
              </button>

              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="px-4 py-4">
                  <h3 className="text-[15px] font-semibold text-slate-900">更多相关论文</h3>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={relatedPaperSearchQuery}
                      onChange={(event) => setRelatedPaperSearchQuery(event.target.value)}
                      placeholder="搜索相关论文方向..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-4 divide-y divide-slate-200">
                    {filteredRelatedPaperQueries.length > 0 ? (
                      filteredRelatedPaperQueries.map((example) => (
                        <button
                          key={example}
                          type="button"
                          className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-slate-50"
                        >
                          <p className="min-w-0 flex-1 text-sm leading-6 text-slate-800">
                            {example}
                          </p>
                          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <Search className="h-4 w-4" />
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="py-4 text-sm text-slate-500">暂无匹配的相关论文方向。</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!chatUserPrompt && chatWorkflow === 'idle' ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold tracking-tight text-slate-950">Hey there!</p>
                    <p className="text-sm leading-6 text-slate-700">
                      This paper introduces the Transformer as a fully attention-based architecture for sequence transduction. It explains why removing recurrence improves parallel training, shows how global dependencies can be modeled directly through attention, and formalizes the encoder-decoder stack that later became a core large-model pattern.
                    </p>
                    <p className="text-sm leading-6 text-slate-700">
                      I checked all 15 pages, let&apos;s go.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {quickQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => submitChatPrompt(question)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-left text-sm leading-6 text-slate-800 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {!chatUserPrompt && chatWorkflow === 'idle' ? (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                Start a conversation about this paper.
              </div>
            ) : null}

            {chatUserPrompt ? (
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 shadow-sm">
                  {chatSubmittedExcerpt ? (
                    <div className="mb-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-normal leading-5 text-gray-600">
                      “{chatSubmittedExcerpt}”
                    </div>
                  ) : null}
                  {chatUserPrompt}
                </div>
              </div>
            ) : null}

            {chatWorkflow === 'thinking' ? (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 rounded-lg border border-blue-100 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <span>Thinking</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:200ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:400ms]" />
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {thinkingSteps.map((step) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm leading-5 text-blue-900"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {chatWorkflow === 'summary' ? (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  {summarySections.map((section) => (
                    <div key={section.title}>
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-950">{section.title}</h3>
                      </div>
                      <ul className="space-y-3 text-sm leading-6 text-slate-800">
                        {section.items.map((item) => (
                          <li key={item.text} className="flex gap-3">
                            <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-slate-800 flex-shrink-0" />
                            <span>
                              {item.text}
                              {item.citations.map((citation) => renderCitationNode(citation))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => copyAgentResponse('summary')}
                      className={iconActionButtonClass(copiedResponse === 'summary')}
                      aria-label={copiedResponse === 'summary' ? 'Copied' : 'Copy'}
                      title={copiedResponse === 'summary' ? 'Copied' : 'Copy'}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResponseFeedback((prev) => ({
                          ...prev,
                          summary: prev.summary === 'up' ? null : 'up',
                        }))
                      }
                      className={iconActionButtonClass(responseFeedback.summary === 'up')}
                      aria-label="Like"
                      title="Like"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResponseFeedback((prev) => ({
                          ...prev,
                          summary: prev.summary === 'down' ? null : 'down',
                        }))
                      }
                      className={iconActionButtonClass(responseFeedback.summary === 'down')}
                      aria-label="Dislike"
                      title="Dislike"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {chatWorkflow === 'selection-answer' && chatSubmittedExcerpt ? (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-900">
                    Focused passage: “{chatSubmittedExcerpt}”
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-800">
                    {selectionAnswerText}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => copyAgentResponse('selection-answer')}
                      className={iconActionButtonClass(copiedResponse === 'selection-answer')}
                      aria-label={copiedResponse === 'selection-answer' ? 'Copied' : 'Copy'}
                      title={copiedResponse === 'selection-answer' ? 'Copied' : 'Copy'}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResponseFeedback((prev) => ({
                          ...prev,
                          'selection-answer': prev['selection-answer'] === 'up' ? null : 'up',
                        }))
                      }
                      className={iconActionButtonClass(responseFeedback['selection-answer'] === 'up')}
                      aria-label="Like"
                      title="Like"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResponseFeedback((prev) => ({
                          ...prev,
                          'selection-answer': prev['selection-answer'] === 'down' ? null : 'down',
                        }))
                      }
                      className={iconActionButtonClass(responseFeedback['selection-answer'] === 'down')}
                      aria-label="Dislike"
                      title="Dislike"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Chat Input */}
      {isChatTab ? (
        <div className="border-t border-gray-200 bg-white/95 p-4 flex-shrink-0 shadow-[0_-8px_24px_rgba(15,23,42,0.04)]">
          <div className="relative">
            {selectedExcerpt ? (
              <div className="relative z-0 -mb-4 rounded-t-[1.2rem] border border-gray-200 bg-gray-100 px-4 pb-6 pt-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-start gap-3">
                  <p className="min-w-0 flex-1 line-clamp-3 text-sm leading-5 text-gray-700">
                    {selectedExcerpt}
                  </p>
                  <button
                    type="button"
                    onClick={onClearSelectedExcerpt}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
                    aria-label="Clear selected text"
                  >
                  <X className="h-4 w-4" />
                </button>
              </div>
              </div>
            ) : null}

            <div className="relative z-10 rounded-[1.2rem] border border-gray-200 bg-white p-4 shadow-sm">
              <textarea
                ref={chatInputRef}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={
                  selectedExcerpt
                    ? 'Ask about the selected text...'
                    : 'What do you want to do with this paper?'
                }
                className="min-h-[76px] w-full resize-none bg-transparent text-[15px] leading-6 text-gray-900 outline-none placeholder:text-gray-500"
                rows={3}
              />

              {chatAttachments.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {chatAttachments.map((attachment, index) => (
                    <span
                      key={`${attachment}-${index}`}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      <span className="truncate">{attachment}</span>
                      <button
                        type="button"
                        onClick={() => setChatAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="text-gray-400 transition-colors hover:text-gray-800"
                        aria-label={isZh ? '移除文件' : 'Remove file'}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  {renderAttachmentPicker('top')}
                  {renderKnowledgeSourcePicker('top')}
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!newContent.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  aria-label="Send"
                >
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleLocalAttachmentChange}
      />
    </div>
  );
}
