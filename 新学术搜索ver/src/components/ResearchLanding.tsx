import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  ChevronDown,
  Library,
  MessageSquareText,
  Radio,
  Search,
  Sparkles,
} from 'lucide-react';
import appLogo from '../assets/3ce02a66a6df7d8cd1f86de17846e94de4e9df61.png';
import workspacePreview from '../../docs/screenshots/qa/search-shortcut-final.png';

type LandingLanguage = 'zh' | 'en';

interface ResearchLandingProps {
  language: LandingLanguage;
  onLanguageChange: (language: LandingLanguage) => void;
  onSearch: () => void;
  onOpenWorkspace: () => void;
  onOpenLibrary: () => void;
  onOpenAgent: () => void;
  onOpenPricing: () => void;
}

const metrics = [
  ['95%', '文献查找准确率', 'Literature retrieval accuracy'],
  ['500M+', '学术文献元数据', 'Academic literature metadata'],
  ['130M+', '开放获取全文', 'Open-access full text'],
  ['500K+', '每日文献更新', 'Daily literature updates'],
  ['32', '一级学科覆盖', 'Primary disciplines covered'],
];

const workspaceItems = [
  { icon: Search, title: 'Search', zh: '用自然语言和全文检索快速定位高质量论文。', en: 'Find high-quality papers with natural-language and full-text search.' },
  { icon: Sparkles, title: 'Agent', zh: '连接搜索、综述与实验，自动推进复杂研究任务。', en: 'Connect search, surveys, and experiments to advance complex research tasks.' },
  { icon: Library, title: 'Library', zh: '自动识别元数据，持续沉淀个人研究知识库。', en: 'Capture metadata automatically and build a lasting research library.' },
  { icon: MessageSquareText, title: 'Survey', zh: '快速生成综述与知识脉络，理解研究结构。', en: 'Generate surveys and knowledge maps to understand a field quickly.' },
  { icon: Radio, title: 'Feeds', zh: '持续追踪新论文、趋势与值得关注的研究信号。', en: 'Track new papers, trends, and research signals continuously.' },
];

const testimonials = [
  {
    quoteZh: '能帮我找到关键词论文，还会把主题脉络和优先精读的文章梳理出来，省掉很多前期调研时间。',
    quoteEn: 'It finds key papers and maps the themes and priority reading, saving a great deal of early research time.',
    roleZh: '计算机科学副教授',
    roleEn: 'Associate Professor',
    name: 'Dr. Li',
  },
  {
    quoteZh: '以前我主要依赖 Google Scholar，现在更常用 WisPaper。检索更聚焦，日常探索非常顺手。',
    quoteEn: 'I used to rely mostly on Google Scholar. WisPaper gives me more focused retrieval for daily exploration.',
    roleZh: '独立研究员',
    roleEn: 'Independent Researcher',
    name: 'Mark T',
  },
  {
    quoteZh: '写综述时很有帮助。它不仅能找到关键论文，还能把证据和阅读记录留在同一条工作流里。',
    quoteEn: 'It is especially useful for reviews, keeping key papers, evidence, and reading notes in one workflow.',
    roleZh: '博士研究生',
    roleEn: 'PhD Researcher',
    name: 'Sarah J.',
  },
];

const faqs = [
  ['WisPaper 是什么？', 'What is WisPaper?'],
  ['WisPaper 会产生 AI 幻觉吗？', 'Does WisPaper produce AI hallucinations?'],
  ['意图检索和普通搜索有什么不同？', 'How is intent search different from normal search?'],
  ['WisPaper 如何帮助科研工作流？', 'How does WisPaper help the research workflow?'],
  ['免费计划有哪些限制？', 'What are the limits of the free plan?'],
];

export function ResearchLanding({
  language,
  onLanguageChange,
  onSearch,
  onOpenWorkspace,
  onOpenLibrary,
  onOpenAgent,
  onOpenPricing,
}: ResearchLandingProps) {
  const [openFaq, setOpenFaq] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const isZh = language === 'zh';

  React.useEffect(() => {
    document.title = 'WisPaper: Your AI Academic Agent';
  }, []);

  const submitSearch = () => onSearch();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f9ff] font-['Geist','PingFang_SC','Microsoft_YaHei',sans-serif] text-[#202731]">
      <header className="relative z-20 mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-6">
        <button type="button" onClick={onSearch} className="flex items-center gap-2.5">
          <img src={appLogo} alt="WisPaper" className="h-9 w-9 rounded-[10px]" />
          <span className="text-[17px] font-semibold">WisPaper</span>
        </button>

        <nav className="hidden items-center gap-9 text-sm text-[#2e3744] md:flex">
          <button type="button" onClick={onSearch}>Search</button>
          <button type="button" onClick={onOpenAgent}>Feature</button>
          <button type="button" onClick={() => document.getElementById('home-faq')?.scrollIntoView({ behavior: 'smooth' })}>Resources</button>
          <button type="button" onClick={onOpenPricing}>Pricing</button>
        </nav>

        <div className="flex items-center gap-2.5 text-sm">
          <button type="button" onClick={() => onLanguageChange(isZh ? 'en' : 'zh')} className="rounded-full px-3 py-2 text-[#687486]">
            {isZh ? 'EN' : '中'}
          </button>
          <button type="button" className="hidden px-2 py-2 text-[#455164] sm:block">{isZh ? '登录' : 'Login'}</button>
          <button type="button" onClick={onOpenWorkspace} className="inline-flex items-center gap-1.5 rounded-full bg-[#222a34] px-4 py-2 text-white transition hover:bg-[#111820]">
            Workspace <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-14 text-center md:pt-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(112,201,255,0.26),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(225,242,255,0.66)_76%,rgba(244,249,255,0))]" />
          <div className="relative mx-auto max-w-[1180px]">
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-[#64748b]">
              <span className="h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#64748b]" />
              {isZh ? '播放视频介绍' : 'Watch introduction'}
            </button>
            <h1 className="mt-5 text-[clamp(2.8rem,5.3vw,4.7rem)] font-semibold leading-[1.03] tracking-[-0.045em]">
              WisPaper:<br />Your AI Academic Agent
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-[#78879a] md:text-base">
              {isZh ? '在同一个工作空间中完成发现、捕获与实验，把完整科研流程从数天缩短到数分钟。' : 'Discover, capture, and experiment in a single workspace. Streamline your entire research workflow from days to minutes.'}
            </p>

            <div className="mx-auto mt-6 flex max-w-[930px] items-center rounded-full border border-[#dce5ee] bg-white p-1.5 pl-5 shadow-[0_12px_36px_-28px_rgba(31,79,130,0.48)]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && submitSearch()}
                placeholder={isZh ? '例如：查找近三年 AI4Science 相关论文…' : 'e.g., Find papers that study AI4Science in recent 3 years...'}
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8793a3]"
              />
              <button type="button" onClick={submitSearch} aria-label="Search" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#222a34] text-white">
                <Search className="h-[18px] w-[18px]" />
              </button>
            </div>

            <button type="button" onClick={onSearch} className="group mx-auto mt-12 block w-full max-w-[1040px] rounded-[28px] border-[10px] border-white/85 bg-white p-2 shadow-[0_30px_70px_-34px_rgba(31,91,145,0.48)]">
              <img src={workspacePreview} alt={isZh ? 'WisPaper 学术搜索工作台' : 'WisPaper scholar search workspace'} className="aspect-[16/9] w-full rounded-[14px] border border-[#d9e3ed] object-cover object-top transition duration-500 group-hover:scale-[1.005]" />
            </button>

            <div className="mt-14 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {metrics.map(([value, zhLabel, enLabel]) => (
                <div key={value} className="px-3">
                  <p className="text-4xl font-semibold tracking-[-0.04em] text-[#2d8cff] md:text-5xl">{value}</p>
                  <p className="mx-auto mt-3 max-w-[150px] text-xs leading-5 text-[#7a8797]">{isZh ? zhLabel : enLabel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1240px]">
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-[-0.035em]">AI Workspace</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-[#7c8999]">
                {isZh ? '连接检索、知识库与 Agent，让研究问题自然进入下一步。' : 'Connect search, knowledge, and agents so each research question can move naturally to the next step.'}
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-5">
              {workspaceItems.map((item, index) => {
                const Icon = item.icon;
                const actions = [onSearch, onOpenAgent, onOpenLibrary, onOpenWorkspace, onOpenWorkspace];
                return (
                  <button key={item.title} type="button" onClick={actions[index]} className="group flex min-h-[320px] flex-col rounded-[10px] border border-[#dbe4ed] bg-[linear-gradient(180deg,#ffffff_0%,#ecf6ff_45%,#a9d3ff_100%)] p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_-36px_rgba(37,113,178,0.58)]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#edf2f6] text-[#27313c]"><Icon className="h-5 w-5" /></span>
                    <h3 className="mt-5 text-[22px] font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#748397]">{isZh ? item.zh : item.en}</p>
                    <span className="mt-auto text-6xl font-light tracking-[-0.06em] text-white/75">0{index + 1}.</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:pt-16">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-5xl">Researchers<br />around the world<br />use WisPaper</h2>
              <p className="mt-6 max-w-sm text-sm leading-6 text-[#7d8998]">
                {isZh ? '从文献检索、精读、综述写作到知识库搭建，WisPaper 正在成为更多研究者的日常工作台。' : 'Across literature search, deep reading, review writing, and knowledge-base building, WisPaper is becoming a daily workspace for more researchers.'}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <article key={item.name} className={`${index === 0 ? 'md:translate-y-10' : ''} rounded-[12px] border border-[#dce5ed] bg-white p-6`}>
                  <span className="text-5xl leading-none text-[#cce7ff]">“</span>
                  <p className="mt-2 text-sm leading-7 text-[#526174]">{isZh ? item.quoteZh : item.quoteEn}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f2ff] text-xs font-semibold text-[#2d78bb]">{item.name.slice(0, 2)}</span>
                    <div><p className="text-sm font-semibold">{isZh ? item.roleZh : item.roleEn}</p><p className="text-xs text-[#8894a4]">{item.name}</p></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="home-faq" className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="text-center text-4xl font-semibold tracking-[-0.035em]">FAQ</h2>
            <div className="mt-12 border-y border-[#dbe4ed]">
              {faqs.map(([zhQuestion, enQuestion], index) => (
                <div key={enQuestion} className="border-b border-[#dbe4ed] last:border-b-0">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between py-5 text-left text-sm font-medium">
                    <span>{isZh ? zhQuestion : enQuestion}</span>
                    <span className="text-xl font-light text-[#8591a0]">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index ? (
                    <p className="max-w-5xl pb-6 text-sm leading-7 text-[#6f7d8e]">
                      {isZh ? 'WisPaper 将学术检索、深度阅读、知识库与 Agent 工作流连接在同一个空间中，并以真实文献作为结果依据。' : 'WisPaper connects academic search, deep reading, a research library, and agent workflows in one space, with real literature as the source of evidence.'}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.035em]">Partners</h2>
          <div className="mx-auto mt-10 grid max-w-[760px] gap-4 sm:grid-cols-2">
            <div className="flex h-32 items-center justify-center rounded-[10px] border border-[#dce5ed] bg-white text-xl font-semibold text-[#234287]">GPUHub</div>
            <div className="flex h-32 items-center justify-center rounded-[10px] border border-[#dce5ed] bg-white px-8 text-sm font-semibold text-[#204a7b]">Association for the Advancement of Artificial Intelligence</div>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-28 text-center md:py-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(89,183,255,0.46),transparent_42%)]" />
          <div className="relative">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Start Your AI Research Journey.</h2>
            <p className="mt-4 text-sm text-[#8390a0]">{isZh ? '从精准检索进入结构化研究工作流。' : 'Move from precise search to structured research workflows.'}</p>
            <button type="button" onClick={onSearch} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#222a34] px-6 py-3 text-sm font-medium text-white">Get Started <ArrowRight className="h-4 w-4 -rotate-45" /></button>
          </div>
        </section>
      </main>

      <footer className="bg-[#222831] px-6 py-16 text-white/72">
        <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5 text-white"><img src={appLogo} alt="" className="h-9 w-9 rounded-[10px]" /><span className="font-semibold">WisPaper</span></div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">{isZh ? '助你一站式完成文献查找、精读分析与知识库搭建。' : 'Complete literature discovery, deep reading, analysis, and knowledge building in one place.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              ['Features', ['Scholar Search', 'Scholar QA', 'Agent', 'Library']],
              ['Resources', ['Surveys', 'Blog', 'FAQ']],
              ['Pricing', ['Pricing']],
              ['Desktop App', ['Windows', 'macOS Apple Silicon', 'macOS Intel']],
            ].map(([title, links]) => (
              <div key={title as string}><p className="text-sm font-medium text-white">{title as string}</p><div className="mt-4 space-y-3 text-xs text-white/48">{(links as string[]).map((link) => <p key={link}>{link}</p>)}</div></div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1120px] items-center justify-between border-t border-white/10 pt-6 text-xs text-white/32"><span>© 2026 WisPaper</span><span>Privacy Policy&nbsp;&nbsp;&nbsp; Terms of Service</span></div>
      </footer>
    </div>
  );
}
