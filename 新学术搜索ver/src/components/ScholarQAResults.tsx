import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Check, ChevronDown, Clock3, Copy, FileSearch, Library, ListTree, MoreHorizontal, Play, Search, Send, Sparkles, Square, TextSearch } from 'lucide-react';

interface ScholarQAResultsProps {
  question: string;
  papersCount?: number;
  effort?: 'low' | 'medium' | 'high';
  onEffortChange?: (effort: 'low' | 'medium' | 'high') => void;
  selectedSources?: string[];
  onSourcesChange?: (sources: string[]) => void;
  onOpenDeepSearch?: (query: string) => void;
  onStartAgent?: (query: string) => void;
  userCredits?: number;
  onUpgrade?: () => void;
}

type Intent = 'search' | 'agent' | 'ask';
type Status = 'thinking' | 'answer' | 'stopped';

const getIntent = (query: string): Intent => {
  if (/(灵感发现|文献综述|论文主图|论文评审|literature review|inspiration discovery|paper review|main figure)/i.test(query)) return 'agent';
  if (/(找|查找|搜索|检索).*(论文|文献)|(论文|文献).*(找|查找|搜索|检索)|find papers|search papers/i.test(query)) return 'search';
  return 'ask';
};

const extractAcademicSearchKeyword = (query: string) => {
  const cleaned = query
    .replace(/^(请|麻烦)?\s*(帮我|为我)?\s*(查找|搜索|检索|找)(一下|一些)?/i, '')
    .replace(/(相关的?|关于|方面的?)?(论文|文献|papers?)\s*[。！？?]*$/i, '')
    .replace(/^(关于|有关)\s*/i, '')
    .trim();
  return cleaned || query.trim();
};

const toolDetails = [
  { label: '思考', icon: Sparkles, summary: '正在分析问题意图并规划回答路径', detail: '将问题拆解为核心概念、约束条件与证据需求，判断需要调用的检索与阅读工具。' },
  { label: '知识库搜索', icon: Library, summary: '关键词：Agentic QA、意图匹配、回答质量', detail: '找到 12 条结果，优先读取《Agentic workflow design》《Evidence-grounded QA》等 5 篇文档。' },
  { label: '学术搜索', icon: Search, summary: '检索相关论文与近期研究', detail: '返回 28 篇结果，已按主题相关性、发表时间与引用质量完成初筛。' },
  { label: '匹配关键词', icon: TextSearch, summary: '匹配关键术语与定义', detail: '匹配到 17 个相关段落，覆盖方法定义、实验设置和主要结论。' },
  { label: '阅读文档', icon: FileSearch, summary: '阅读核心章节与实验结论', detail: '已阅读 Methods、Evaluation 与 Limitations，提取章节 TLDR 与关键证据。' },
  { label: '查看目录', icon: ListTree, summary: '定位文档章节结构', detail: 'Abstract · Introduction · Methods · Experiments · Discussion · References' },
];

export function ScholarQAResults({ question, papersCount = 9, effort = 'medium', onEffortChange, selectedSources = ['my-library', 'academic-search'], onSourcesChange, userCredits = 50000, onUpgrade, onOpenDeepSearch, onStartAgent }: ScholarQAResultsProps) {
  const [status, setStatus] = useState<Status>('thinking');
  const [elapsed, setElapsed] = useState(0);
  const [showAllThinking, setShowAllThinking] = useState(false);
  const [expandedTool, setExpandedTool] = useState<number | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [copied, setCopied] = useState(false);
  const [messageMenu, setMessageMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [continueAgentInQa, setContinueAgentInQa] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intent = useMemo(() => getIntent(currentQuestion), [currentQuestion]);

  useEffect(() => {
    setStatus('thinking'); setElapsed(0); setSkipped(false); setShowAllThinking(false); setExpandedTool(null); setContinueAgentInQa(false);
    const finishDelay = effort === 'low' ? 1500 : effort === 'high' ? 3500 : 2500;
    const finish = window.setTimeout(() => setStatus('answer'), finishDelay);
    return () => window.clearTimeout(finish);
  }, [currentQuestion, effort]);

  useEffect(() => {
    if (status !== 'thinking') return;
    const ticker = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(ticker);
  }, [status]);

  const answerNow = () => { setSkipped(true); setStatus('answer'); };
  const stop = () => setStatus('stopped');
  const submitFollowUp = () => {
    const value = followUp.trim();
    if (!value) return;
    setCurrentQuestion(value); setFollowUp('');
  };
  const copyAnswer = async () => {
    await navigator.clipboard.writeText(`关于“${currentQuestion}”的回答与参考来源`);
    setCopied(true); window.setTimeout(() => setCopied(false), 1500);
  };
  const fork = (edit: boolean) => {
    setMessageMenu(false);
    if (edit) setFollowUp(currentQuestion);
    setNotice(edit ? '已创建独立分支，原问题已放入输入框等待编辑' : '已 Fork 为新的独立对话');
    window.setTimeout(() => setNotice(''), 2200);
  };
  const sourceOptions = [
    { id: 'current-paper', label: '单篇论文' },
    { id: 'my-library', label: '知识库' },
    { id: 'academic-search', label: '学术搜索' },
    { id: 'web-search', label: '网页搜索' },
  ];
  const changeEffortFromComposer = () => {
    if (status === 'thinking') {
      setNotice('请等待当前问答结束后再进行修改');
      window.setTimeout(() => setNotice(''), 2200);
      return;
    }
    onEffortChange?.(effort === 'low' ? 'medium' : effort === 'medium' ? 'high' : 'low');
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-7">
        <div className="mx-auto max-w-4xl space-y-6">
          {notice && <div className="sticky top-0 z-10 mx-auto w-fit rounded-full bg-slate-900 px-4 py-2 text-xs text-white shadow-lg">{notice}</div>}
          <div className="group flex justify-end">
            <div className="relative max-w-[78%] rounded-2xl rounded-tr-md bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-800">
              {currentQuestion}
              <button onClick={() => setMessageMenu(!messageMenu)} className="absolute -left-9 top-1 rounded-lg p-1.5 text-slate-400 opacity-0 hover:bg-slate-100 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></button>
              {messageMenu && <div className="absolute right-full top-0 mr-3 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"><button onClick={() => fork(true)} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50">编辑 Edit</button><button onClick={() => fork(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50">Fork</button></div>}
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
            <button onClick={() => setShowAllThinking(!showAllThinking)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              <span className={`grid h-8 w-8 place-items-center rounded-xl ${status === 'thinking' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>{status === 'thinking' ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Check className="h-4 w-4" />}</span>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm font-semibold text-slate-800">思考过程 <span className="inline-flex items-center gap-1 text-xs font-normal text-slate-400"><Clock3 className="h-3.5 w-3.5" />{elapsed}s</span></div><p className="truncate text-xs text-slate-500">{skipped ? '用户终止思考过程' : status === 'stopped' ? '用户已终止' : toolDetails[Math.min(elapsed, toolDetails.length - 1)].summary}</p></div>
              <span className="text-xs text-slate-500">{showAllThinking ? '收起' : '展开全部'}</span><ChevronDown className={`h-4 w-4 text-slate-400 transition ${showAllThinking ? 'rotate-180' : ''}`} />
            </button>
            {showAllThinking && <div className="max-h-[320px] space-y-1 overflow-y-auto border-t border-slate-200 p-2">
              {toolDetails.slice(0, status === 'thinking' ? Math.max(2, Math.min(elapsed + 1, toolDetails.length)) : toolDetails.length).map((tool, index) => { const Icon = tool.icon; return <div key={tool.label} className="rounded-xl bg-white"><button onClick={() => setExpandedTool(expandedTool === index ? null : index)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left"><Icon className="h-4 w-4 text-slate-500" /><span className="w-24 text-xs font-semibold text-slate-700">{tool.label}</span><span className="min-w-0 flex-1 truncate text-xs text-slate-500">{tool.summary}</span><span className="text-[11px] text-slate-400">{Math.max(1, index + 1)}s</span></button>{expandedTool === index && <div className="border-t border-slate-100 px-10 py-3 text-xs leading-5 text-slate-600">{tool.detail}</div>}</div>; })}
            </div>}
          </section>

          {status === 'thinking' && <div className="flex items-center justify-center gap-3"><button onClick={answerNow} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600"><Play className="h-4 w-4" />立即回答</button><button onClick={stop} title="停止生成" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"><Square className="h-3.5 w-3.5 fill-current" />停止生成</button></div>}
          {status === 'stopped' && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">用户已终止</div>}

          {status === 'answer' && <AnswerBlock intent={continueAgentInQa && intent === 'agent' ? 'ask' : intent} question={currentQuestion} papersCount={papersCount} userCredits={userCredits} onUpgrade={onUpgrade} onOpenDeepSearch={onOpenDeepSearch} onStartAgent={onStartAgent} onContinueInAsk={() => setContinueAgentInQa(true)} />}
          {status === 'answer' && <div className="flex items-center gap-2"><button onClick={copyAnswer} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100">{copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}{copied ? '已复制' : '复制'}</button><button onClick={() => fork(false)} className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100">Fork</button><span className="ml-auto text-xs text-slate-400">{effort === 'high' ? 8 : effort === 'low' ? 3 : 5} credits</span></div>}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-4"><div className="mx-auto max-w-3xl rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"><input value={followUp} onChange={(event) => setFollowUp(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitFollowUp(); }} placeholder="继续提问..." className="w-full border-0 px-3 py-2 text-sm outline-none" /><div className="mt-1 flex items-center gap-2 border-t border-slate-100 px-1 pt-2"><button onClick={changeEffortFromComposer} className={`rounded-lg border px-3 py-1.5 text-xs ${status === 'thinking' ? 'cursor-not-allowed border-slate-200 text-slate-400' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>思考强度 · {effort === 'low' ? '低' : effort === 'medium' ? '中' : '高'} <ChevronDown className="ml-1 inline h-3 w-3" /></button><div className="relative"><button onClick={() => setShowSourceMenu(!showSourceMenu)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">来源 · {selectedSources.length} <ChevronDown className="ml-1 inline h-3 w-3" /></button>{showSourceMenu && <div className="absolute bottom-full left-0 z-30 mb-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{sourceOptions.map((source) => { const active = selectedSources.includes(source.id); return <button key={source.id} onClick={() => { const next = active ? selectedSources.filter((id) => id !== source.id) : [...selectedSources, source.id]; if (next.length) onSourcesChange?.(next); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"><span className={`grid h-4 w-4 place-items-center rounded border ${active ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300'}`}>{active ? '✓' : ''}</span>{source.label}</button>; })}</div>}</div><button onClick={status === 'thinking' ? stop : submitFollowUp} className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white">{status === 'thinking' ? <Square className="h-3 w-3 fill-current" /> : <Send className="h-4 w-4" />}</button></div></div></div>
    </div>
  );
}

function AnswerBlock({ intent, question, papersCount, userCredits, onUpgrade, onOpenDeepSearch, onStartAgent, onContinueInAsk }: { intent: Intent; question: string; papersCount: number; userCredits: number; onUpgrade?: () => void; onOpenDeepSearch?: (query: string) => void; onStartAgent?: (query: string) => void; onContinueInAsk?: () => void }) {
  if (intent === 'agent') {
    const isReview = /(文献综述|literature review|survey)/i.test(question);
    const creditEstimate = isReview ? '10,000–20,000 credits（约 1–2 万积分）' : '3,000–8,000 credits';
    const minimumCredits = isReview ? 10000 : 3000;
    const requiredCredits = minimumCredits + 5000;
    const insufficient = userCredits < requiredCredits;
    return <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5"><div className="flex items-center gap-2 font-semibold"><Bot className="h-5 w-5 text-indigo-600" />是否开启云端 Agent 完成这项复杂任务？</div><p className="mt-2 text-sm leading-6 text-slate-600">这项请求适合由云端 Agent 持续执行。确认前不会创建任务或扣除 Agent 积分。</p><div className="mt-3 rounded-xl border border-indigo-100 bg-white/80 px-3 py-2.5 text-sm text-indigo-700"><span className="font-semibold">预计积分消耗：</span>{creditEstimate}<span className="mt-1 block text-xs text-slate-500">实际消耗会根据搜索范围、阅读文献数量和任务轮次浮动。</span></div>{insufficient && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800"><div className="font-semibold">当前积分不足，请升级后启动 Agent</div><div className="mt-1 text-xs leading-5">当前 {userCredits.toLocaleString()} credits · 启动门槛 {requiredCredits.toLocaleString()} credits（最低预估 {minimumCredits.toLocaleString()} + 5,000 余额）</div></div>}<div className="mt-4 flex gap-3">{insufficient ? <button onClick={onUpgrade} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white">升级套餐</button> : <button onClick={() => onStartAgent?.(question)} className="rounded-xl bg-[#1b87ff] px-4 py-2.5 text-sm font-semibold text-white">开启 Agent</button>}<button onClick={onContinueInAsk} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">不用了，继续回答</button></div></div>;
  }
  const searchKeyword = extractAcademicSearchKeyword(question);
  return <article className="text-sm leading-7 text-slate-700"><h2 className="text-xl font-semibold text-slate-950">基于当前知识源的回答</h2><p className="mt-3">我已结合当前可用知识源分析“{question}”。核心结论是：应先明确研究问题与评价标准，再围绕关键证据建立可追溯的论证链。Agentic 工作流会动态选择搜索、目录定位和章节阅读工具，而不是依赖固定流程，因此能更好地适配单篇文档总结、翻译与复杂学术问答。</p><p className="mt-3">当前知识库包含约 {papersCount} 篇可用文献。建议继续追问具体方法、实验设置或限制条件，我会基于对应章节补充证据。</p>{intent === 'search' ? <div className="mt-5 border-t border-slate-200 pt-4"><button onClick={() => onOpenDeepSearch?.(searchKeyword)} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100"><Search className="h-4 w-4" />搜索更多关于“{searchKeyword}”的论文</button></div> : null}</article>;
}
