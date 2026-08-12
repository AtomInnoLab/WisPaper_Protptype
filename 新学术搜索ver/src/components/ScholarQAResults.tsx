import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, BookOpen, Check, ChevronDown, Copy, ExternalLink, GitBranch, RefreshCw, X } from 'lucide-react';
import wisPaperLogo from 'figma:asset/3ce02a66a6df7d8cd1f86de17846e94de4e9df61.png';
import { ScholarQAComposer, type QAKnowledgeScope, type QAThinkingDepth } from './ScholarQAComposer';
import { useLanguage } from '../contexts/LanguageContext';

interface ConversationItem {
  id: string;
  question: string;
  followUp?: boolean;
}

interface ScholarQAResultsProps {
  question: string;
  papersCount?: number;
  knowledgeScope: QAKnowledgeScope;
  thinkingDepth: QAThinkingDepth;
}

interface CitationSource {
  id: number;
  title: string;
  authors: string;
  publication: string;
  year: string;
  readerUrl: string;
  sourceUrl: string;
}

const citationSources: CitationSource[] = [
  {
    id: 1,
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin et al.',
    publication: 'NeurIPS',
    year: '2020',
    readerUrl: 'https://dev.wispaper.ai/zh/paper?doi=10.48550%2FarXiv.2005.11401',
    sourceUrl: 'https://doi.org/10.48550/arXiv.2005.11401',
  },
  {
    id: 2,
    title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
    authors: 'Akari Asai, Zeqiu Wu, Yizhong Wang, Avirup Sil, Hannaneh Hajishirzi',
    publication: 'ICLR',
    year: '2024',
    readerUrl: 'https://dev.wispaper.ai/zh/paper?doi=10.48550%2FarXiv.2310.11511',
    sourceUrl: 'https://doi.org/10.48550/arXiv.2310.11511',
  },
];

export function ScholarQAResults({ question, papersCount = 9, knowledgeScope, thinkingDepth }: ScholarQAResultsProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const [followUp, setFollowUp] = useState('');
  const [scope, setScope] = useState<QAKnowledgeScope>(knowledgeScope);
  const [depth, setDepth] = useState<QAThinkingDepth>(thinkingDepth);
  const [thinkingOpen, setThinkingOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<CitationSource | null>(null);
  const [items, setItems] = useState<ConversationItem[]>([{ id: 'initial', question }]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [items.length]);

  useEffect(() => {
    if (!selectedCitation) return undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCitation(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedCitation]);

  const handleSubmit = () => {
    const nextQuestion = followUp.trim();
    if (!nextQuestion) return;
    setItems((current) => [...current, { id: String(Date.now()), question: nextQuestion, followUp: true }]);
    setFollowUp('');
  };

  const handleCopy = async (id: string) => {
    const answer = isZh
      ? 'RAG 通常包含检索、增强和生成三个阶段。它通过可追溯证据降低事实错误，并允许知识库低成本更新。'
      : 'RAG typically includes retrieval, augmentation, and generation. It grounds answers in traceable evidence and supports lower-cost knowledge updates.';
    try {
      await navigator.clipboard.writeText(answer);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((current) => current === id ? null : current), 1600);
    } catch (error) {
      console.error('Failed to copy Scholar QA answer', error);
    }
  };

  const scopeLabel = scope === 'single-paper'
    ? isZh ? '单篇论文' : 'Single paper'
    : scope === 'library'
      ? isZh ? '全部知识库' : 'Entire library'
      : isZh ? '学术搜索' : 'Scholar Search';

  return (
    <main className="qa-result-page">
      <header className="qa-result-header">{items.length > 1 ? (isZh ? '新建问答' : 'New Q&A') : question.slice(0, 28)}</header>

      <div ref={scrollRef} className="qa-conversation-scroll">
        <div className="qa-conversation">
          {items.map((item, index) => (
            <section key={item.id} className={index > 0 ? 'mt-12 border-t border-gray-100 pt-10' : ''}>
              <div className="qa-question-row">
                <div className="qa-question-bubble">{item.question}</div>
              </div>

              <div className="qa-brand">
                <img src={wisPaperLogo} alt="" />
                <span>WisPaper</span>
              </div>

              <div className="qa-thinking-panel">
                <button type="button" className="qa-thinking-toggle" onClick={() => setThinkingOpen((current) => !current)} aria-expanded={thinkingOpen}>
                  <span>{isZh ? `已完成思考 · ${depth === 'deep' ? '深度' : depth === 'medium' ? '中等' : '快速'} · 10m30s` : `Reasoning complete · ${depth} · 10m30s`}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${thinkingOpen ? 'rotate-180' : ''}`} />
                </button>
                {thinkingOpen ? (
                  <div className="qa-thinking-content">
                    <div className="qa-thinking-step">
                      <strong>{isZh ? '理解问题' : 'Understand the question'}</strong>
                      <span>{isZh ? '识别核心概念、研究边界与回答所需的证据类型。' : 'Identify the core concept, scope, and evidence needed.'}</span>
                    </div>
                    <div className="qa-thinking-step">
                      <strong>{isZh ? `检索${scopeLabel}` : `Search ${scopeLabel}`}</strong>
                      <span>{isZh ? `从 ${papersCount} 篇候选资料中进行语义检索与相关性重排。` : `Run semantic retrieval and reranking across ${papersCount} candidate sources.`}</span>
                      <ol className="qa-source-list">
                        <li><a href="#">Retrieval-Augmented Generation for Knowledge-Intensive NLP ↗</a></li>
                        <li><a href="#">Dense Passage Retrieval for Open-Domain QA ↗</a></li>
                        <li><a href="#">Self-RAG: Learning to Retrieve, Generate and Critique ↗</a></li>
                      </ol>
                    </div>
                    <div className="qa-thinking-step">
                      <strong>{isZh ? '核对证据并组织回答' : 'Verify evidence and compose'}</strong>
                      <span>{isZh ? '交叉核对来源，将结论与引用一一对应。' : 'Cross-check sources and map each claim to supporting citations.'}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <article className="qa-answer">
                <h2>{item.followUp ? (isZh ? '进一步分析' : 'Follow-up analysis') : (isZh ? '基于知识库检索到的证据' : 'Evidence retrieved from your knowledge base')}</h2>
                <p>
                  {isZh
                    ? '检索增强生成（RAG）把外部知识检索纳入回答过程，使模型能够基于当前知识库中的资料生成可追溯结论。'
                    : 'Retrieval-augmented generation (RAG) brings external retrieval into the answer process, grounding conclusions in current, traceable sources.'}
                  {' '}<button type="button" className="qa-citation" onClick={() => setSelectedCitation(citationSources[0])} aria-label={isZh ? '查看引用 1' : 'View citation 1'}>1</button>
                </p>
                <h3>{isZh ? '它通常包含三个阶段：' : 'It usually has three stages:'}</h3>
                <ol>
                  <li><strong>{isZh ? '检索：' : 'Retrieval: '}</strong>{isZh ? '将问题编码为向量，在知识库中寻找最相关的文档片段。' : 'Encode the question and find the most relevant passages.'}</li>
                  <li><strong>{isZh ? '增强：' : 'Augmentation: '}</strong>{isZh ? '将高相关证据及其元数据组织进回答上下文。' : 'Assemble high-relevance evidence and metadata into context.'}</li>
                  <li><strong>{isZh ? '生成：' : 'Generation: '}</strong>{isZh ? '模型在受约束的上下文中生成带引用的回答。' : 'Generate a cited answer within the evidence-bound context.'}</li>
                </ol>
                <p>
                  {isZh
                    ? '相比只依赖模型参数的回答方式，RAG 的主要优势是知识可更新、结论可溯源，并能通过证据核验降低事实性错误。'
                    : 'Compared with parameter-only answers, RAG offers fresher knowledge, traceable claims, and fewer factual errors through evidence verification.'}
                  {' '}<button type="button" className="qa-citation" onClick={() => setSelectedCitation(citationSources[1])} aria-label={isZh ? '查看引用 2' : 'View citation 2'}>2</button>
                </p>
              </article>

              <div className="qa-answer-actions">
                <button type="button" title={isZh ? '重新生成' : 'Regenerate'}><RefreshCw className="h-4 w-4" /></button>
                <button type="button" title={isZh ? '复制' : 'Copy'} onClick={() => handleCopy(item.id)}>{copiedId === item.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}</button>
                <button type="button" title={isZh ? '创建分支' : 'Branch'}><GitBranch className="h-4 w-4" /></button>
                <span>{isZh ? '本次消耗 12 Credits' : '12 Credits used'}</span>
              </div>
            </section>
          ))}
        </div>
      </div>

      <button type="button" className="qa-scroll-bottom" onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })} aria-label={isZh ? '滚动到底部' : 'Scroll to bottom'}>
        <ArrowDown className="h-5 w-5" />
      </button>

      <div className="qa-result-composer">
        <ScholarQAComposer
          compact
          value={followUp}
          onChange={setFollowUp}
          onSubmit={handleSubmit}
          knowledgeScope={scope}
          onKnowledgeScopeChange={setScope}
          thinkingDepth={depth}
          onThinkingDepthChange={setDepth}
        />
        <div className="qa-ai-note">{isZh ? '内容由 AI 生成，请仔细甄别' : 'AI-generated content may contain errors'}</div>
      </div>

      {selectedCitation ? (
        <div className="qa-citation-backdrop" role="presentation" onClick={() => setSelectedCitation(null)}>
          <section className="qa-citation-dialog" role="dialog" aria-modal="true" aria-labelledby="qa-citation-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="qa-citation-close" onClick={() => setSelectedCitation(null)} aria-label={isZh ? '关闭引用信息' : 'Close citation details'}>
              <X className="h-5 w-5" />
            </button>

            <div className="qa-citation-kicker">
              <span>{isZh ? `引用 ${selectedCitation.id}` : `Citation ${selectedCitation.id}`}</span>
              <span className="qa-citation-oa">Open Access</span>
            </div>
            <h2 id="qa-citation-title">{selectedCitation.title}</h2>
            <p className="qa-citation-authors">{selectedCitation.authors}</p>
            <p className="qa-citation-meta">{selectedCitation.publication} · {selectedCitation.year}</p>

            <div className="qa-citation-dialog-actions">
              <a className="qa-citation-reader" href={selectedCitation.readerUrl} target="_blank" rel="noreferrer">
                <BookOpen className="h-4 w-4" />
                {isZh ? '打开阅读器' : 'Open reader'}
              </a>
              <a className="qa-citation-source" href={selectedCitation.sourceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                {isZh ? '打开原网页' : 'Open original page'}
              </a>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
