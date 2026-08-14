import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  ChevronDown,
  Download,
  Library,
  Laptop,
  Monitor,
  Search,
  Sparkles,
} from 'lucide-react';
import appLogo from '../assets/3ce02a66a6df7d8cd1f86de17846e94de4e9df61.png';
import qaStartImage from '../../docs/screenshots/qa/scholar-qa-start-final.png';
import qaResultImage from '../../docs/screenshots/qa/scholar-qa-results-final.png';
import qaCitationImage from '../../docs/screenshots/qa/scholar-qa-citation-final.png';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const capabilityItems = [
  {
    icon: Search,
    zh: '检索真正相关的论文',
    en: 'Find the papers that actually matter',
    detailZh: '从研究问题出发，而不是从关键词堆砌开始。',
    detailEn: 'Start from a research question, not a pile of keywords.',
  },
  {
    icon: BookOpen,
    zh: '读懂复杂研究',
    en: 'Understand difficult research',
    detailZh: '快速定位方法、证据与结论。',
    detailEn: 'Locate methods, evidence, and conclusions quickly.',
  },
  {
    icon: Library,
    zh: '沉淀个人知识库',
    en: 'Build a research library',
    detailZh: '让论文、笔记与问答保持连接。',
    detailEn: 'Keep papers, notes, and questions connected.',
  },
  {
    icon: Bot,
    zh: '交给 Agent 执行',
    en: 'Let agents execute',
    detailZh: '把多步骤调研转成可跟踪的任务。',
    detailEn: 'Turn multi-step research into trackable work.',
  },
];

const journeyItems = [
  {
    image: qaStartImage,
    zh: '提出一个值得研究的问题',
    en: 'Start with a question worth investigating',
  },
  {
    image: qaResultImage,
    zh: '用真实文献组织证据',
    en: 'Organize evidence from real literature',
  },
  {
    image: qaCitationImage,
    zh: '把结论推进为下一步行动',
    en: 'Turn conclusions into the next action',
  },
];

const researchFeedback = [
  {
    zh: '不再在十几个工具之间搬运信息，研究脉络始终留在同一个空间里。',
    en: 'The research thread stays in one place instead of being moved across a dozen tools.',
  },
  {
    zh: '先看到证据，再形成判断；每一步都能回到原始文献。',
    en: 'Evidence comes before judgment, and every step can return to the original paper.',
  },
  {
    zh: '从一次搜索继续推进到阅读、问答、整理和执行。',
    en: 'A search can continue naturally into reading, questioning, organizing, and execution.',
  },
];

const clientDownloadLinks = {
  windows: 'https://download.wispaper.com/windows',
  macApple: 'https://download.wispaper.com/mac-apple-silicon',
  macIntel: 'https://download.wispaper.com/mac-intel',
} as const;

export function ResearchLanding({
  language,
  onLanguageChange,
  onSearch,
  onOpenWorkspace,
  onOpenLibrary,
  onOpenAgent,
  onOpenPricing,
}: ResearchLandingProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const journeyRef = React.useRef<HTMLElement>(null);
  const downloadMenuRef = React.useRef<HTMLDivElement>(null);
  const [feedbackIndex, setFeedbackIndex] = React.useState(0);
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const isZh = language === 'zh';

  React.useEffect(() => {
    document.title = isZh
      ? 'WisPaper：从问题到可信的研究结果'
      : 'WisPaper: From Questions to Credible Research';
  }, [isZh]);

  React.useEffect(() => {
    if (!downloadMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!downloadMenuRef.current?.contains(event.target as Node)) {
        setDownloadMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDownloadMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [downloadMenuOpen]);

  const handleClientDownload = (platform: keyof typeof clientDownloadLinks) => {
    window.open(clientDownloadLinks[platform], '_blank', 'noopener,noreferrer');
    setDownloadMenuOpen(false);
  };

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      gsap.from('.research-hero-copy > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.research-hero-visual', {
        y: 40,
        scale: 0.92,
        opacity: 0,
        duration: 1.05,
        delay: 0.2,
        ease: 'power3.out',
      });

      const storyCards = gsap.utils.toArray<HTMLElement>('.research-story-card');
      storyCards.forEach((card) => {
        const image = card.querySelector('img');
        if (!image) return;

        gsap.fromTo(
          image,
          { scale: 0.82, opacity: 0.42 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'center 48%',
              scrub: true,
            },
          },
        );

        gsap.to(image, {
          opacity: 0.28,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'bottom 42%',
            end: 'bottom 12%',
            scrub: true,
          },
        });
      });

      if (window.innerWidth >= 1024 && journeyRef.current) {
        const heading = journeyRef.current.querySelector('.research-story-heading');
        if (heading) {
          ScrollTrigger.create({
            trigger: journeyRef.current,
            start: 'top 110px',
            end: 'bottom bottom-=100',
            pin: heading,
            pinSpacing: false,
          });
        }
      }
    },
    { scope: rootRef },
  );

  const feedback = researchFeedback[feedbackIndex];

  return (
    <div ref={rootRef} className="w-full max-w-full overflow-x-hidden bg-white font-['Geist','PingFang_SC','Microsoft_YaHei',sans-serif] text-[#050b1c]">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-5">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between rounded-full border border-white/15 bg-[#050b1c]/95 px-3 py-2 text-white shadow-[0_18px_50px_-24px_rgba(2,8,23,0.72)] backdrop-blur-xl md:px-4">
          <button type="button" onClick={onSearch} className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-white/10">
            <img src={appLogo} alt="WisPaper" className="h-8 w-8 rounded-xl" />
            <span className="hidden text-sm font-semibold tracking-[-0.01em] sm:inline">WisPaper</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            <button type="button" onClick={onSearch} className="rounded-full px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white">
              {isZh ? '搜索' : 'Search'}
            </button>
            <button type="button" onClick={onOpenLibrary} className="rounded-full px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white">
              {isZh ? '知识库' : 'Library'}
            </button>
            <button type="button" onClick={onOpenAgent} className="rounded-full px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white">
              Agent
            </button>
            <button type="button" onClick={onOpenPricing} className="rounded-full px-4 py-2 text-sm text-white/72 transition hover:bg-white/10 hover:text-white">
              {isZh ? '定价' : 'Pricing'}
            </button>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onLanguageChange(isZh ? 'en' : 'zh')}
              className="rounded-full px-3 py-2 text-xs font-semibold text-white/64 transition hover:bg-white/10 hover:text-white"
            >
              {isZh ? 'EN' : '中'}
            </button>
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#050b1c] transition hover:bg-[#dbeafe] md:px-5"
            >
              {isZh ? '进入工作台' : 'Open workspace'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[900px] overflow-hidden px-6 pb-28 pt-40 md:px-10 md:pt-48 lg:min-h-[960px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.20),transparent_32%),radial-gradient(circle_at_18%_10%,rgba(147,197,253,0.24),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(#1d4ed8_1px,transparent_1px),linear-gradient(90deg,#1d4ed8_1px,transparent_1px)] [background-size:56px_56px]" />

          <div className="relative mx-auto grid max-w-[1320px] items-center gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
            <div className="research-hero-copy min-w-0 max-w-3xl">
              <h1 className="max-w-6xl text-[clamp(3rem,6vw,6.7rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-[#050b1c] md:tracking-[-0.065em]">
                <span className="block">{isZh ? '让问题，成为' : 'Turn questions into'}</span>
                <span className="mt-2 block md:whitespace-nowrap">
                  <span className="mr-[0.18em] hidden h-[0.56em] w-[1.18em] translate-y-[-0.03em] overflow-hidden rounded-full align-middle ring-1 ring-[#050b1c]/10 2xl:inline-flex">
                    <img src={qaResultImage} alt="" className="h-full w-full object-cover object-left" />
                  </span>
                  {isZh ? '可信的研究结果' : 'credible research'}
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[#42506a] md:text-xl">
                {isZh
                  ? '从文献发现、证据阅读到 Agent 执行，把分散的科研步骤连接成连续工作流。'
                  : 'Connect literature discovery, evidence reading, and agent execution into one continuous research workflow.'}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onSearch}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b57ff] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_44px_-20px_rgba(11,87,255,0.8)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#084ce2]"
                >
                  {isZh ? '开始研究' : 'Start researching'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="inline-flex items-center gap-2 rounded-full border border-[#050b1c]/15 bg-white px-7 py-4 text-base font-semibold text-[#050b1c] transition duration-300 hover:-translate-y-0.5 hover:border-[#050b1c]/35"
                >
                  {isZh ? '查看工作台' : 'View workspace'}
                </button>
              </div>

              <div
                ref={downloadMenuRef}
                className="relative mt-6 flex w-full max-w-[520px] items-center gap-3 rounded-2xl border border-[#050b1c]/10 bg-white/88 p-2.5 pl-3 shadow-[0_18px_44px_-30px_rgba(11,87,255,0.42)] backdrop-blur"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e7f0ff] text-[#0b57ff]">
                  <Download className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#050b1c]">{isZh ? 'WisPaper 桌面客户端' : 'WisPaper desktop app'}</p>
                  <p className="truncate text-xs text-[#64718a]">Windows / macOS</p>
                </div>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={downloadMenuOpen}
                  onClick={() => setDownloadMenuOpen((open) => !open)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#050b1c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14203a] active:scale-[0.98]"
                >
                  {isZh ? '选择版本' : 'Choose version'}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {downloadMenuOpen ? (
                  <div
                    role="menu"
                    aria-label={isZh ? '选择客户端版本' : 'Choose app version'}
                    className="absolute left-0 top-[calc(100%+0.75rem)] z-20 w-full overflow-hidden rounded-2xl border border-[#050b1c]/10 bg-white p-2 text-[#050b1c] shadow-[0_24px_60px_-28px_rgba(2,8,23,0.48)]"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleClientDownload('windows')}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#eef5ff] active:scale-[0.98]"
                    >
                      <Monitor className="h-5 w-5 text-[#0b57ff]" />
                      <span className="flex-1 text-sm font-semibold">Windows</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleClientDownload('macApple')}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#eef5ff] active:scale-[0.98]"
                    >
                      <Laptop className="h-5 w-5 text-[#0b57ff]" />
                      <span className="flex-1 text-sm font-semibold">macOS (Apple Silicon)</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleClientDownload('macIntel')}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#eef5ff] active:scale-[0.98]"
                    >
                      <Laptop className="h-5 w-5 text-[#0b57ff]" />
                      <span className="flex-1 text-sm font-semibold">macOS (Intel)</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="research-hero-visual group relative mx-auto min-w-0 w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-[#0b57ff]/15 bg-[#050b1c] p-3 shadow-[0_46px_110px_-52px_rgba(11,87,255,0.58)] md:p-5">
              <div className="pointer-events-none absolute inset-x-16 top-0 h-36 rounded-full bg-[#0b57ff]/26 blur-[72px]" />
              <div className="relative overflow-hidden rounded-[1.35rem] bg-white">
                <img
                  src={qaResultImage}
                  alt={isZh ? 'WisPaper 学术问答工作台' : 'WisPaper scholarly workspace'}
                  className="aspect-[1.32/1] w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between rounded-full border border-white/14 bg-[#050b1c]/88 px-5 py-3 text-sm text-white backdrop-blur-xl md:bottom-10 md:left-10 md:right-10">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#79a7ff]" />
                  {isZh ? '基于真实文献组织答案' : 'Answers grounded in real literature'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#050b1c]/8 bg-[#050b1c] py-5 text-white">
          <div className="research-marquee-row overflow-hidden">
            <div className="research-marquee-track flex w-max items-center gap-8 whitespace-nowrap px-4 text-sm font-medium text-white/74 md:text-base">
              {[0, 1].flatMap((group) => [
                isZh ? '提出问题' : 'Ask',
                isZh ? '检索证据' : 'Search',
                isZh ? '精读文献' : 'Read',
                isZh ? '组织知识' : 'Organize',
                isZh ? '执行研究' : 'Execute',
              ].map((item) => (
                <React.Fragment key={`${group}-${item}`}>
                  <span>{item}</span>
                  <ArrowRight className="h-4 w-4 text-[#4d86ff]" />
                </React.Fragment>
              )))}
            </div>
          </div>
        </section>

        <section className="px-6 py-32 md:px-10 md:py-48">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-16 max-w-4xl md:mb-24">
              <h2 className="text-[clamp(2.7rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#050b1c]">
                {isZh ? '一个空间，连接研究的每一步。' : 'One space for every step of research.'}
              </h2>
            </div>

            <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-[#050b1c]/10 bg-[#050b1c]/10 md:grid-cols-12 md:grid-rows-2">
              <button
                type="button"
                onClick={onSearch}
                className="group relative min-h-[540px] overflow-hidden bg-[#eef5ff] p-8 text-left md:col-span-6 md:row-span-2 md:p-10"
              >
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-3 text-[#0b57ff]">
                    <Boxes className="h-5 w-5" />
                    <span className="text-sm font-semibold">WisPaper Workspace</span>
                  </div>
                  <h3 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#050b1c] md:text-4xl">
                    {isZh ? '研究过程不再散落在不同工具里' : 'Keep the research process connected'}
                  </h3>
                  <div className="mt-10 flex-1 overflow-hidden rounded-[1.4rem] border border-[#0b57ff]/12 bg-white shadow-[0_32px_80px_-46px_rgba(11,87,255,0.42)]">
                    <img src={qaResultImage} alt="" className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                </div>
              </button>

              {capabilityItems.map((item, index) => {
                const Icon = item.icon;
                const actions = [onSearch, onOpenLibrary, onOpenAgent, onOpenWorkspace];
                return (
                  <button
                    key={item.zh}
                    type="button"
                    onClick={actions[index]}
                    className="group min-h-[270px] bg-white p-8 text-left transition-colors duration-300 hover:bg-[#f5f8ff] md:col-span-3 md:row-span-1"
                  >
                    <div className="flex h-full flex-col justify-between">
                      <Icon className="h-6 w-6 text-[#0b57ff] transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#050b1c]">{isZh ? item.zh : item.en}</h3>
                        <p className="mt-3 text-sm leading-6 text-[#64718a]">{isZh ? item.detailZh : item.detailEn}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={journeyRef} className="bg-[#050b1c] px-6 py-32 text-white md:px-10 md:py-48">
          <div className="mx-auto grid max-w-[1320px] gap-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div className="research-story-heading h-fit lg:pt-8">
              <h2 className="max-w-xl text-[clamp(3rem,5vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                {isZh ? '从发现，到行动。' : 'From discovery to action.'}
              </h2>
              <p className="mt-7 max-w-md text-base leading-7 text-white/58 md:text-lg">
                {isZh ? '每一步都有上下文，每个判断都能回到证据。' : 'Every step keeps its context, and every judgment can return to evidence.'}
              </p>
            </div>

            <div className="space-y-28 lg:space-y-40">
              {journeyItems.map((item, index) => (
                <article key={item.zh} className="research-story-card group">
                  <div className="mb-5 flex items-center justify-between border-b border-white/12 pb-5">
                    <span className="text-sm font-medium text-[#79a7ff]">0{index + 1}</span>
                    <h3 className="ml-8 text-right text-xl font-medium tracking-[-0.025em] md:text-2xl">{isZh ? item.zh : item.en}</h3>
                  </div>
                  <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/5 p-2 md:p-3">
                    <img src={item.image} alt="" className="aspect-[1.45/1] w-full rounded-[1.25rem] object-cover object-left-top" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-32 md:px-10 md:py-44">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-8 border-y border-[#050b1c]/12 py-12 md:py-16">
            <button
              type="button"
              aria-label={isZh ? '上一条' : 'Previous'}
              onClick={() => setFeedbackIndex((feedbackIndex + researchFeedback.length - 1) % researchFeedback.length)}
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#050b1c]/14 text-[#050b1c] transition hover:border-[#050b1c] md:inline-flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <blockquote className="mx-auto max-w-4xl text-center text-[clamp(1.75rem,3.4vw,3.7rem)] font-medium leading-[1.12] tracking-[-0.045em] text-[#050b1c]">
              “{isZh ? feedback.zh : feedback.en}”
            </blockquote>
            <button
              type="button"
              aria-label={isZh ? '下一条' : 'Next'}
              onClick={() => setFeedbackIndex((feedbackIndex + 1) % researchFeedback.length)}
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#050b1c]/14 text-[#050b1c] transition hover:border-[#050b1c] md:inline-flex"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-6 md:pb-6">
          <div className="relative mx-auto flex min-h-[600px] max-w-[1400px] flex-col items-center justify-center overflow-hidden rounded-[2.4rem] bg-[#0b57ff] px-6 py-24 text-center text-white md:min-h-[680px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(5,11,28,0.26),transparent_44%)]" />
            <div className="relative max-w-5xl">
              <h2 className="text-[clamp(3.1rem,7vw,7rem)] font-semibold leading-[0.93] tracking-[-0.065em]">
                {isZh ? '从今天的问题开始。' : 'Start with today’s question.'}
              </h2>
              <button
                type="button"
                onClick={onSearch}
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#050b1c] transition duration-300 hover:-translate-y-0.5 hover:bg-[#dbeafe]"
              >
                {isZh ? '开始研究' : 'Start researching'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 border-t border-[#050b1c]/10 pt-8 text-sm text-[#64718a] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[#050b1c]">
            <img src={appLogo} alt="" className="h-7 w-7 rounded-lg" />
            <span className="font-semibold">WisPaper</span>
          </div>
          <p>© 2026 WisPaper</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={onOpenPricing} className="transition hover:text-[#050b1c]">{isZh ? '定价' : 'Pricing'}</button>
            <button type="button" onClick={onOpenWorkspace} className="transition hover:text-[#050b1c]">{isZh ? '工作台' : 'Workspace'}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
