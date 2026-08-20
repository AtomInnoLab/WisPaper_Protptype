import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUp,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  Compass,
  Database,
  FileSearch,
  Filter,
  Globe,
  Layers3,
  ListFilter,
  MessageSquareText,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  TableProperties,
} from 'lucide-react';

type MarketingLanguage = 'zh' | 'en';
type HomeSearchLandingMode = 'home' | 'search';
type MarketingFeaturePage =
  | 'search'
  | 'scholar-qa'
  | 'library'
  | 'paperclaw'
  | 'idea-discovery'
  | 'ai-feeds'
  | 'ai-survey';

interface HomeSearchLandingProps {
  language: MarketingLanguage;
  mode: HomeSearchLandingMode;
  onStartSearch: (query?: string) => void;
  onContinueToSurvey: () => void;
  onNavigateToMarketingPage: (page: MarketingFeaturePage) => void;
  onOpenFigureToPPTX?: () => void;
}

const exampleQueries = [
  {
    zh: '找使用 GNN 做分子性质预测、但不使用 QM9 的论文',
    en: 'Find papers on molecular property prediction using GNNs but excluding QM9',
  },
  {
    zh: '查找比较 retrieval-augmented generation 与 fine-tuning 的论文',
    en: 'Search papers comparing retrieval-augmented generation and fine-tuning',
  },
  {
    zh: '找 2023 年后关于多模态推理的数据集与 benchmark 论文',
    en: 'Find post-2023 benchmark papers on multimodal reasoning datasets',
  },
];

const painPoints = [
  {
    zhTitle: '同一个词，未必是同一件事',
    enTitle: 'One term, many meanings',
    zhBody: '一个关键词在不同领域、不同任务中可能对应完全不同的含义。例如 “GEO” 既可能是地理建模，也可能是基因表达数据库。只靠关键词匹配，结果很容易偏题。',
    enBody: 'The same keyword can mean very different things across fields. Keyword-only search often sends results off target.',
  },
  {
    zhTitle: '提到一个方法，不代表真的用了它',
    enTitle: 'Mentioned is not used',
    zhBody: '很多结果只是引用、讨论、对比某个方法，并不意味着论文真正采用了它。于是你会看到很多“看起来相关”的论文，却需要花大量时间逐篇确认。',
    enBody: 'Many papers only cite or discuss a method instead of using it. You still have to check them one by one.',
  },
  {
    zhTitle: '复杂条件很难说清楚',
    enTitle: 'Logic is hard to express',
    zhBody: '“使用 A，但不使用 B”“限定某数据集，不看某类 baseline”“只看某时间范围下的某类实验设置” 都很常见，但普通关键词搜索很难准确表达。',
    enBody: 'Research queries often include exclusions, dataset limits, or setup constraints. Plain keyword search handles them poorly.',
  },
];

const solutionCards = [
  {
    icon: FileSearch,
    zhTitle: '按研究意图搜索',
    enTitle: 'Search by research intent',
    zhBody: '不仅识别关键词，还理解你的任务目标、方法偏好、数据集限制和排除条件，更适合研究问题明确、筛选逻辑复杂的检索场景。',
    enBody: 'Go beyond keywords with research intent, method preferences, dataset limits, and exclusion criteria.',
  },
  {
    icon: ListFilter,
    zhTitle: '支持复杂检索',
    enTitle: 'Support complex retrieval',
    zhBody: '支持包含、排除、对比、时间范围等复杂条件，不用再靠手动反复试错，更适合文献综述、related work 调研和研究路线分析。',
    enBody: 'Handle include, exclude, compare, and time-based filters with less manual trial and error. Better for related work and literature reviews.',
  },
  {
    icon: TableProperties,
    zhTitle: '结果可继续分析',
    enTitle: 'Turn results into structured analysis',
    zhBody: '搜索之后，不只是结果列表。你可以继续抽取论文中的问题、方法、数据集、实验设置等字段，并进入对比与综述流程。',
    enBody: 'Turn search results into structured analysis with fields like problem, method, dataset, and setup, then continue into review workflows.',
  },
];

const resultRows = [
  {
            title: 'Molecular Property Prediction with Graph Neural Networks Beyond QM9',
    year: '2024',
    citations: '183',
    task: 'Molecular property prediction',
    method: 'GNN',
    dataset: 'MoleculeNet',
    constraint: 'Exclude QM9',
  },
  {
    title: 'Benchmarking Post-QM9 Molecular Learning Under Realistic Constraints',
    year: '2025',
    citations: '76',
    task: 'Dataset generalization',
    method: 'Graph Transformer',
    dataset: 'OGB-Mol*',
    constraint: 'Realistic constraints',
  },
  {
    title: 'Retrieval-Augmented vs Fine-Tuned Reasoning Systems: A Comparative Study',
    year: '2024',
    citations: '142',
    task: 'Reasoning comparison',
    method: 'RAG / Fine-tuning',
    dataset: 'MultiBench',
    constraint: 'Post-2023 only',
  },
];

const audiences = [
  {
    short: 'DL',
    zhStage: '计算机科学副教授',
    enStage: 'Associate Professor of Computer Science',
    zhTitle: 'Dr. Li',
    enTitle: 'Dr. Li',
    zhBody: '终于不用在海量水文中浪费时间了。这个 AI 学术搜索工具能先理解研究意图，再过滤掉大部分无关论文，做 related work 和文献综述时效率高很多。',
    enBody: 'I no longer waste time digging through noisy results. This AI academic search tool understands research intent first and filters out irrelevant papers, which makes related-work mapping and literature reviews much faster.',
    zhMeta: '聚焦 AI 学术搜索、related work 与文献综述',
    enMeta: 'Uses WisPaper for AI academic search, related work, and literature reviews',
  },
  {
    short: 'SJ',
    zhStage: '神经科学博士生',
    enStage: 'PhD Student in Neuroscience',
    zhTitle: 'Sarah J.',
    enTitle: 'Sarah J.',
    zhBody: '写综述的时候特别有帮助。作为文献综述工具，它不仅能帮我找到关键论文，还会把主题脉络和优先精读的文章梳理出来，省掉很多前期调研时间。',
    enBody: 'It is incredibly helpful for review writing. As a literature review tool, it not only finds key papers but also helps me map themes and decide what deserves deep reading first.',
    zhMeta: '主要用于文献综述工具与主题梳理',
    enMeta: 'Uses WisPaper as a literature review tool for topic mapping',
  },
  {
    short: 'MT',
    zhStage: '独立研究员',
    enStage: 'Independent Researcher',
    zhTitle: 'Mark T.',
    enTitle: 'Mark T.',
    zhBody: '以前我主要依赖 Google Scholar，现在更常用 WisPaper。它更像一个真正的 Google Scholar alternative，检索更聚焦，试用门槛也低，日常探索非常顺手。',
    enBody: 'I used to rely mostly on Google Scholar, but now I use WisPaper more often. It feels like a real Google Scholar alternative with more focused retrieval and a much lower barrier to getting started.',
    zhMeta: '偏好 Google Scholar alternative 与高频探索',
    enMeta: 'Uses WisPaper as a Google Scholar alternative for daily exploration',
  },
  {
    short: 'ZW',
    zhStage: '研究助理',
    enStage: 'Research Assistant',
    zhTitle: 'Zoe W.',
    enTitle: 'Zoe W.',
    zhBody: '我最喜欢的是把检索、精读和知识库沉淀串在一起。以前要在学术搜索、文献管理和笔记工具之间反复切换，现在一条工作流就能完成。',
    enBody: 'What I like most is how search, deep reading, and knowledge-base building are connected in one workflow. I no longer need to jump between academic search, reference management, and note-taking tools.',
    zhMeta: '主要用于学术搜索、文献管理与资料沉淀',
    enMeta: 'Uses WisPaper for academic search, reference management, and evidence capture',
  },
  {
    short: 'CH',
    zhStage: '实验室负责人',
    enStage: 'Lab Lead',
    zhTitle: 'Chen H.',
    enTitle: 'Chen H.',
    zhBody: '团队做新方向预研时，WisPaper 能很快帮我们识别研究空白、整理核心论文，并把后续讨论沉淀成可复用的知识库，对选题判断和科研路径设计帮助很大。',
    enBody: 'When my team explores a new direction, WisPaper helps us identify research gaps, organize core papers, and turn later discussion into a reusable knowledge base, which is valuable for topic selection and research-path planning.',
    zhMeta: '用于研究缺口识别、选题判断与科研路径设计',
    enMeta: 'Uses WisPaper for research-gap discovery and topic planning',
  },
];

const featureOverviewCards = [
  {
    key: 'search' as const,
    icon: Search,
    zhTitle: 'Scholar Search',
    enTitle: 'Scholar Search',
    zhBody: '支持自然语言提问与全文检索的 AI 学术搜索，帮助你快速锁定高质量论文与相关研究。',
    enBody: 'An AI academic search engine with natural-language and full-text retrieval to surface high-quality papers fast.',
    zhDetail: '适合从问题出发做文献发现、快速筛选核心论文，并通过 Deep Search 处理复杂条件、排除逻辑和跨领域语义检索。',
    enDetail: 'Start from a research question, filter core papers quickly, and use Deep Search for complex criteria, exclusions, and cross-domain semantic retrieval.',
    accent: 'bg-cyan-100 text-cyan-700',
    border: 'border-cyan-200/70',
    surface: 'hover:bg-cyan-50/95 focus-visible:bg-cyan-50/95',
  },
  {
    key: 'library' as const,
    icon: BookOpen,
    zhTitle: 'Library',
    enTitle: 'Library',
    zhBody: '搭建可云端同步的研究知识库，自动识别 Meta 信息，持续沉淀你的学术数字资产。',
    enBody: 'Build a synced research library with automatic metadata extraction and preserve your academic knowledge base.',
    zhDetail: '统一管理论文、笔记和项目资料，自动补全题录信息，让检索结果、阅读记录与后续问答都能沉淀为可复用资产。',
    enDetail: 'Manage papers, notes, and project materials in one place, enrich metadata automatically, and turn search and reading history into reusable assets.',
    accent: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200/70',
    surface: 'hover:bg-indigo-50/95 focus-visible:bg-indigo-50/95',
  },
  {
    key: 'ai-survey' as const,
    icon: Database,
    zhTitle: 'AI Survey',
    enTitle: 'AI Survey',
    zhBody: '自动生成即时综述与知识导图，帮你在不下载全文的情况下快速看清知识脉络。',
    enBody: 'Generate instant surveys and knowledge maps so you can understand the structure of search results without downloading full papers.',
    zhDetail: '面向新领域调研、开题和 related work 梳理，自动提炼主题分类、代表论文、研究趋势与可继续深入的问题。',
    enDetail: 'Useful for new-field scans, proposal work, and related work drafting by extracting topics, representative papers, trends, and follow-up questions.',
    accent: 'bg-teal-100 text-teal-700',
    border: 'border-teal-200/70',
    surface: 'hover:bg-teal-50/95 focus-visible:bg-teal-50/95',
  },
  {
    key: 'ai-feeds' as const,
    icon: ShieldCheck,
    zhTitle: 'AI Feeds',
    enTitle: 'AI Feeds',
    zhBody: '持续追踪你所在方向的新论文、趋势与值得关注的研究信号，让信息输入从一次性搜索变成长期研究订阅。',
    enBody: 'Continuously track new papers, trends, and research signals in your area so discovery becomes an ongoing feed instead of a one-off search.',
    zhDetail: '把关键词、作者、机构或研究方向配置成订阅源，减少重复搜索，持续接收与你课题相关的新进展。',
    enDetail: 'Turn keywords, authors, institutions, or research directions into feeds so you spend less time repeating searches and more time reading relevant updates.',
    accent: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200/80',
    surface: 'hover:bg-slate-50/95 focus-visible:bg-slate-50/95',
  },
  {
    key: 'scholar-qa' as const,
    icon: MessageSquareText,
    zhTitle: 'Scholar QA',
    enTitle: 'Scholar QA',
    zhBody: '基于文献库做可溯源的学术问答，把复杂调研从冗长查阅缩短到分钟级。',
    enBody: 'Run traceable academic QA on top of your paper library and cut complex research lookup from hours to minutes.',
    zhDetail: '围绕已收藏论文和检索结果提问，答案带引用来源，适合做方法对比、概念澄清、实验设置梳理和论文问答。',
    enDetail: 'Ask questions over saved papers and search results with cited answers for method comparison, concept clarification, experiment setup review, and paper QA.',
    accent: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200/70',
    surface: 'hover:bg-sky-50/95 focus-visible:bg-sky-50/95',
  },
  {
    key: 'search' as const,
    icon: Compass,
    zhTitle: '探索更多',
    enTitle: 'Explore More',
    zhBody: '继续探索实时追新、沉浸式阅读、翻译与更多学术工具工作流入口。',
    enBody: 'Explore more academic workflows including research feeds, immersive reading, translation, and beyond.',
    zhDetail: '从阅读器、翻译、项目管理到更多 Agent 工具，按你的研究阶段组合成更完整的工作流。',
    enDetail: 'Combine reader, translation, project management, and additional agent tools into a workflow that fits each stage of your research.',
    accent: 'bg-white/80 text-slate-700',
    border: 'border-slate-200/80',
    surface: 'hover:bg-slate-50/95 focus-visible:bg-slate-50/95',
    isExplore: true,
  },
];

const heroStats = [
  {
    zhValue: '95%',
    enValue: '95%',
    zhLabel: '文献查找准确率',
    enLabel: 'paper retrieval accuracy',
  },
  {
    zhValue: '3.6亿+',
    enValue: '360M+',
    zhLabel: '学术文献与研究报告',
    enLabel: 'research papers and reports',
  },
  {
    zhValue: '50万+',
    enValue: '500K+',
    zhLabel: '每日文献增量更新',
    enLabel: 'new records updated daily',
  },
  {
    zhValue: '32个',
    enValue: '32',
    zhLabel: '一级学科深度覆盖',
    enLabel: 'top-level disciplines deeply covered',
  },
];

const comparisonRows = [
  { zhLabel: '是否理解研究意图', enLabel: 'Understands research intent', zhLeft: '支持', enLeft: 'Yes', zhRight: '弱', enRight: 'Limited' },
  { zhLabel: '是否支持排除条件', enLabel: 'Supports exclusion filters', zhLeft: '支持', enLeft: 'Yes', zhRight: '通常依赖关键词绕法', enRight: 'Usually requires keyword hacks' },
  { zhLabel: '是否适合文献综述', enLabel: 'Built for literature reviews', zhLeft: '强', enLeft: 'Strong', zhRight: '中', enRight: 'Moderate' },
  { zhLabel: '是否支持结果结构化对比', enLabel: 'Structured result comparison', zhLeft: '支持', enLeft: 'Yes', zhRight: '弱', enRight: 'Limited' },
  { zhLabel: '是否支持继续进入 Survey 工作流', enLabel: 'Continues into survey workflow', zhLeft: '支持', enLeft: 'Yes', zhRight: '不支持', enRight: 'No' },
];

const searchFaqItems = [
  {
    zhQuestion: 'Deep Search 和 Quick Search 有什么区别？',
    enQuestion: 'What is the difference between Deep Search and Quick Search?',
    zhAnswer: 'Scholar Search 提供两种互补模式。Deep Search 默认启用，适合文献综述、歧义词处理和复杂逻辑筛选；Quick Search 更接近 Google Scholar 的快速关键词搜索体验，适合已知标题、作者或宽泛主题的免费检索。',
    enAnswer: 'Scholar Search offers two complementary modes. Deep Search is built for literature reviews, ambiguous terms, and logic-heavy filtering, while Quick Search is closer to a Google Scholar-style keyword experience for known papers and broad free search.',
  },
  {
    zhQuestion: '既然有了 Google Scholar，为什么还要用 Deep Search？',
    enQuestion: 'If Google Scholar already exists, why use Deep Search?',
    zhAnswer: 'Google Scholar 更适合宽泛检索，但很难处理“用 A 不用 B”这类研究逻辑。Deep Search 会结合摘要和上下文过滤结果，更适合构建高质量的核心阅读列表。',
    enAnswer: 'Google Scholar works well for broad retrieval, but it is not built for logic such as “use A but not B”. Deep Search reads abstracts and context to filter results more precisely and helps you build a cleaner reading list.',
  },
  {
    zhQuestion: 'Deep Search 的结果为什么更少但更准？',
    enQuestion: 'Why does Deep Search return fewer but more accurate results?',
    zhAnswer: '因为 Deep Search 会主动降噪。它不仅看关键词，还会分析上下文，区分论文是真正使用某方法，还是只是提到它，从而保留更相关的核心文献。',
    enAnswer: 'Because Deep Search actively reduces noise. It does not stop at keywords. It reads context to distinguish papers that truly use a method from those that only mention it.',
  },
  {
    zhQuestion: 'Scholar Search 是免费的吗？',
    enQuestion: 'Is Scholar Search free?',
    zhAnswer: 'Quick Search 可以作为免费入口使用，适合日常宽泛检索。Deep Search 则更适合高价值筛选任务，具体额度和限制可在 Pricing 页面查看。',
    enAnswer: 'Quick Search works as a free entry point for broad everyday retrieval. Deep Search is better suited for higher-value filtering tasks, and exact limits can be checked on the Pricing page.',
  },
  {
    zhQuestion: 'Deep Search 如何帮我提升文献筛选效率？',
    enQuestion: 'How does Deep Search improve literature screening efficiency?',
    zhAnswer: '面对大量文献时，Deep Search 可以先过滤大部分噪声，再帮你构建更值得精读的候选列表，减少反复翻页、下载和人工排除的时间。',
    enAnswer: 'When you face a large literature set, Deep Search filters out most of the noise first and helps you build a shortlist worth reading, so you spend less time opening, downloading, and manually excluding papers.',
  },
  {
    zhQuestion: '针对新方向调研（如 arXiv 最新热点），哪种更好？',
    enQuestion: 'Which mode is better for exploring a new direction, such as new arXiv topics?',
    zhAnswer: '优先使用 Deep Search。新方向常伴随术语歧义和上下文差异，Deep Search 更适合根据研究意图理解结果并定位真正值得关注的工作。',
    enAnswer: 'Start with Deep Search. New directions often contain ambiguous terms and shifting context, and Deep Search is better at interpreting intent and surfacing the work that actually matters.',
  },
  {
    zhQuestion: '已知论文标题只想下 PDF，用哪个模式？',
    enQuestion: 'If I already know the paper title and just want the PDF, which mode should I use?',
    zhAnswer: '优先用 Quick Search。它更适合已知信息检索，响应更快，也更接近 Google Scholar 的使用方式。',
    enAnswer: 'Use Quick Search first. It is faster for known-item lookup and behaves more like a Google Scholar-style search flow.',
  },
  {
    zhQuestion: '为什么 Quick Search 无法处理“排除某方法”的逻辑？',
    enQuestion: 'Why can Quick Search not handle logic like “exclude a certain method”?',
    zhAnswer: '因为 Quick Search 主要基于关键词匹配，无法稳定理解“不包含”“排除”等自然语言逻辑。如果您需要这类筛选，请切换到 Deep Search。',
    enAnswer: 'Because Quick Search is primarily keyword-based and cannot reliably interpret natural-language logic such as “exclude” or “do not include.” For that kind of filtering, switch to Deep Search.',
  },
];

export function HomeSearchLanding({
  language,
  mode,
  onStartSearch,
  onContinueToSurvey,
  onNavigateToMarketingPage,
  onOpenFigureToPPTX,
}: HomeSearchLandingProps) {
  const [landingSearchQuery, setLandingSearchQuery] = React.useState('');
  const [expandedSearchFaqIndexes, setExpandedSearchFaqIndexes] = React.useState<number[]>([0]);
  const homeRootRef = React.useRef<HTMLElement | null>(null);
  const featureRailRef = React.useRef<HTMLDivElement | null>(null);
  const featureDragRef = React.useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const suppressFeatureClickRef = React.useRef(false);
  const isZh = language === 'zh';
  const isSearchMode = mode === 'search';
  const homeTitle = 'WisPaper: Reshape your research workflow from discovery to experimentation';
  const homeDescription = 'Complete literature discovery, knowledge capture, and agent-driven experimentation in one workspace, reducing days of research work to minutes.';

  const handleLandingSearch = React.useCallback(() => {
    if (landingSearchQuery.trim()) {
      onStartSearch(landingSearchQuery.trim());
    }
  }, [landingSearchQuery, onStartSearch]);

  const handleFeatureRailPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const rail = featureRailRef.current;
    if (!rail) {
      return;
    }

    featureDragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };
    rail.setPointerCapture(event.pointerId);
  }, []);

  const handleFeatureRailPointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rail = featureRailRef.current;
    const drag = featureDragRef.current;

    if (!rail || !drag.active) {
      return;
    }

    const deltaX = drag.startX - event.clientX;

    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
      event.preventDefault();
    }

    rail.scrollLeft = drag.scrollLeft + deltaX;
  }, []);

  const finishFeatureRailDrag = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rail = featureRailRef.current;
    const drag = featureDragRef.current;

    if (drag.moved) {
      suppressFeatureClickRef.current = true;
    }

    featureDragRef.current = { active: false, moved: false, startX: 0, scrollLeft: 0 };

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleFeatureCardClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>, page: MarketingFeaturePage) => {
    if (suppressFeatureClickRef.current) {
      event.preventDefault();
      suppressFeatureClickRef.current = false;
      return;
    }

    onNavigateToMarketingPage(page);
  }, [onNavigateToMarketingPage]);

  React.useEffect(() => {
    document.title = isSearchMode
      ? isZh
        ? 'Scholar Search - 智能AI文献综述与免费学术搜索引擎'
        : 'Scholar Search - Smart AI Literature Review and Free Academic Search Engine'
      : homeTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      'content',
      isSearchMode
        ? isZh
          ? '您的科研第一站。默认 Deep Search 利用 AI 理解逻辑与上下文，精准过滤 90% 引文噪声；切换 Quick Search 即可享受类似 Google Scholar 的无限次免费关键词搜索。'
          : 'Your starting point for research. Deep Search uses AI to understand logic and context and filter citation noise, while Quick Search gives you free keyword search for broad academic discovery.'
        : homeDescription,
    );

    const syncMeta = (selector: string, attr: 'content') => {
      const element = document.querySelector(selector);
      if (element instanceof HTMLMetaElement) {
        element.setAttribute(attr, isSearchMode
          ? isZh
            ? '您的科研第一站。默认 Deep Search 利用 AI 理解逻辑与上下文，精准过滤 90% 引文噪声；切换 Quick Search 即可享受类似 Google Scholar 的无限次免费关键词搜索。'
            : 'Your starting point for research. Deep Search uses AI to understand logic and context and filter citation noise, while Quick Search gives you free keyword search for broad academic discovery.'
          : homeDescription);
      }
    };

    if (!isSearchMode) {
      syncMeta('meta[property="og:title"]', 'content');
      syncMeta('meta[name="twitter:title"]', 'content');

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle instanceof HTMLMetaElement) ogTitle.setAttribute('content', homeTitle);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle instanceof HTMLMetaElement) twitterTitle.setAttribute('content', homeTitle);
    }

    syncMeta('meta[property="og:description"]', 'content');
    syncMeta('meta[name="twitter:description"]', 'content');
  }, [homeDescription, homeTitle, isSearchMode, isZh]);

  useGSAP(
    () => {
      if (isSearchMode) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.home-hero-copy > *', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
      });

      gsap.fromTo(
        '.home-hero-visual',
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.14 },
      );

      gsap.utils.toArray<HTMLElement>('.home-scale-fade').forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 0.88, opacity: 0.38 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              end: 'center 48%',
              scrub: true,
            },
          },
        );

        gsap.to(element, {
          scale: 0.96,
          opacity: 0.42,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'center 28%',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      const pinTarget = homeRootRef.current?.querySelector('.home-workflow-pin');
      if (pinTarget) {
        ScrollTrigger.create({
          trigger: '.home-workflow-section',
          start: 'top 14%',
          end: 'bottom 72%',
          pin: pinTarget,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }
    },
    { scope: homeRootRef, dependencies: [isSearchMode, language] },
  );

  return (
    <main ref={homeRootRef} className={`search-marketing-page ${isSearchMode ? '' : 'home-elegant-shell'} w-full max-w-full space-y-16 overflow-x-hidden pb-8 text-slate-900`}>
      <style>{`
        .search-marketing-page {
          --primary: #23282f;
          --on-primary: #ffffff;
          --ink: #23282f;
          --body: #636c76;
          --mute: #999999;
          --accent: #0079ff;
          --accent-hover: #1b87ff;
          --accent-soft: rgba(0, 121, 255, 0.1);
          --accent-soft-strong: rgba(0, 121, 255, 0.12);
          --accent-deep: #111fa4;
          --canvas: #ffffff;
          --canvas-soft: #f1f2f3;
          --canvas-softer: #f3f9ff;
          --line: #e5e7eb;
          --line-blue: #e6ecf4;
          color: var(--ink);
          font-family: UberMoveText, system-ui, "Helvetica Neue", Arial, sans-serif;
        }

        .search-marketing-page * { box-sizing: border-box; }

        .search-marketing-page .search-mode-hero {
          position: relative;
          background:
            linear-gradient(180deg, rgba(243, 249, 255, 0.78) 0%, rgba(255, 255, 255, 0.96) 72%),
            var(--canvas);
        }

        .search-marketing-page .landing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          border: 1px solid rgba(0, 121, 255, 0.18);
          border-radius: 999px;
          background: var(--accent-soft-strong);
          padding: 8px 16px;
          color: var(--accent-deep);
          font-size: 14px;
          line-height: 18px;
          font-weight: 600;
        }

        .search-marketing-page .landing-title {
          margin: 20px auto 0;
          max-width: 960px;
          min-height: 0;
          color: var(--ink);
          font-size: 48px;
          line-height: 58px;
          font-weight: 750;
          letter-spacing: 0;
        }

        .search-marketing-page .landing-subtitle {
          margin: 18px auto 0;
          max-width: 720px;
          color: var(--body);
          font-size: 18px;
          line-height: 30px;
          font-weight: 500;
        }

        .search-marketing-page .hero-search-shell {
          position: relative;
          overflow: hidden;
          margin: 48px auto 0;
          max-width: 1180px;
          border: 1px solid rgba(0, 121, 255, 0.16);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          padding: 20px 22px 18px;
          box-shadow: rgba(35, 40, 47, 0.07) 0 22px 60px;
        }

        .search-marketing-page .hero-search-card {
          position: relative;
          border: 0;
          border-radius: 0;
          background: transparent;
          padding: 2px 4px;
        }

        .search-marketing-page .hero-search-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--body);
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
        }

        .search-marketing-page .hero-search-input {
          width: 100%;
          resize: none;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--ink);
          min-height: 118px;
          font-size: 17px;
          line-height: 28px;
        }

        .search-marketing-page .hero-search-placeholder {
          pointer-events: none;
          position: absolute;
          inset-inline: 20px;
          top: 58px;
          color: #8da0bb;
          font-size: 16px;
          line-height: 28px;
        }

        .search-marketing-page .hero-search-controls {
          position: relative;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .search-marketing-page .mode-shell {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          border: 1px solid #e4eaf1;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 15px;
          box-shadow: none;
        }

        .search-marketing-page .mode-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 0;
          border-radius: 999px;
          border: 0;
          background: transparent;
          padding: 0;
          color: var(--ink);
          font-size: 14px;
          line-height: 16px;
          font-weight: 600;
        }

        .search-marketing-page .hero-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 52px;
          height: 52px;
          border: 0;
          border-radius: 999px;
          background: var(--primary);
          color: var(--on-primary);
          box-shadow: rgba(0, 121, 255, 0.24) 0 14px 30px;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .search-marketing-page .hero-submit:hover {
          background: #111820;
          transform: translateY(-1px);
        }

        .search-marketing-page .landing-section {
          background: var(--canvas);
          padding: 56px 24px;
        }

        .search-marketing-page .landing-section.muted {
          background: linear-gradient(180deg, rgba(243, 249, 255, 0.58), rgba(255, 255, 255, 0.92));
        }

        .search-marketing-page .landing-section.soft {
          background: linear-gradient(180deg, rgba(241, 242, 243, 0.6), rgba(255, 255, 255, 0.92));
        }

        .search-marketing-page .section-title {
          margin: 0;
          color: var(--ink);
          font-size: 34px;
          line-height: 42px;
          font-weight: 740;
          letter-spacing: 0;
        }

        .search-marketing-page .section-title.centered {
          text-align: center;
        }

        .search-marketing-page .pain-card,
        .search-marketing-page .solution-card,
        .search-marketing-page .mode-card,
        .search-marketing-page .side-card,
        .search-marketing-page .faq-card {
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: rgba(35, 40, 47, 0.06) 0 16px 42px;
        }

        .search-marketing-page .pain-card {
          min-height: 310px;
          padding: 28px 24px;
        }

        .search-marketing-page .pain-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: var(--accent-soft-strong);
          color: var(--ink);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .search-marketing-page .solution-card {
          padding: 24px;
          transition: border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
        }

        .search-marketing-page .solution-card:hover {
          border-color: rgba(0, 121, 255, 0.24);
          transform: translateY(-2px);
          box-shadow: rgba(35, 40, 47, 0.08) 0 20px 52px;
        }

        .search-marketing-page .solution-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: var(--accent-soft-strong);
          color: var(--accent);
        }

        .search-marketing-page .mode-card {
          padding: 28px;
        }

        .search-marketing-page .mode-card.featured {
          border-color: rgba(0, 121, 255, 0.18);
          background: linear-gradient(180deg, var(--canvas-softer), var(--canvas));
        }

        .search-marketing-page .mode-icon {
          border-radius: 14px;
          background: var(--accent);
          padding: 12px;
          color: var(--on-primary);
        }

        .search-marketing-page .mode-icon.dark {
          background: var(--primary);
        }

        .search-marketing-page .check-dot {
          margin-top: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: var(--accent-soft-strong);
          color: var(--accent);
        }

        .search-marketing-page .check-dot.dark {
          background: var(--primary);
          color: var(--on-primary);
        }

        .search-marketing-page .results-panel {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: rgba(35, 40, 47, 0.08) 0 18px 52px;
        }

        .search-marketing-page .table-head {
          background: var(--canvas-softer);
          border-bottom: 1px solid var(--line);
        }

        .search-marketing-page .side-card {
          padding: 22px;
        }

        .search-marketing-page .primary-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          background: var(--accent);
          padding: 12px 18px;
          color: var(--on-primary);
          font-size: 14px;
          line-height: 18px;
          font-weight: 600;
          transition: background 0.16s ease, transform 0.16s ease;
        }

        .search-marketing-page .primary-action:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
        }

        .search-marketing-page .faq-card {
          overflow: hidden;
          box-shadow: none;
        }

        .search-marketing-page .bottom-cta {
          position: relative;
          overflow: hidden;
          background: var(--primary);
          color: var(--on-primary);
        }

        .search-marketing-page.home-elegant-shell {
          --home-ink: #111827;
          --home-muted: #667085;
          --home-soft: #eef7f8;
          --home-cobalt: #165dff;
          --home-sage: #0f8f79;
          --home-amber: #ffb020;
          --home-lilac: #7c5cff;
          --home-paper: rgba(255, 255, 255, 0.76);
          font-family: "Cabinet Grotesk", "Avenir Next", "Helvetica Neue", Arial, system-ui, sans-serif;
          color: var(--home-ink);
        }

        .home-hero-section {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          background:
            radial-gradient(circle at 84% 12%, rgba(22, 93, 255, 0.14), transparent 32%),
            radial-gradient(circle at 14% 24%, rgba(15, 143, 121, 0.16), transparent 30%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(238, 247, 248, 0.88));
        }

        .home-grain {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(17, 24, 39, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17, 24, 39, 0.035) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at center, black, transparent 72%);
        }

        .home-hero-title {
          margin: 0;
          max-width: min(1120px, 100%);
          color: var(--home-ink);
          font-size: clamp(3.1rem, 6.2vw, 6.9rem);
          line-height: 0.98;
          font-weight: 820;
          letter-spacing: 0;
        }

        .home-inline-image {
          display: inline-block;
          width: clamp(74px, 10vw, 148px);
          height: clamp(38px, 5vw, 66px);
          margin: 0 0.12em;
          border: 1px solid rgba(255, 255, 255, 0.84);
          border-radius: 999px;
          vertical-align: middle;
          background-image:
            linear-gradient(rgba(17, 24, 39, 0.08), rgba(17, 24, 39, 0.04)),
            url("https://picsum.photos/seed/research-studio/640/360");
          background-position: center;
          background-size: cover;
          box-shadow: 0 20px 60px rgba(17, 24, 39, 0.14);
          filter: saturate(0.82) contrast(1.08);
        }

        .home-primary-button,
        .home-secondary-button {
          display: inline-flex;
          min-height: 54px;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 15px;
          line-height: 20px;
          font-weight: 760;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .home-primary-button {
          background: #111827;
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(17, 24, 39, 0.22);
        }

        .home-primary-button:hover,
        .home-secondary-button:hover {
          transform: translateY(-2px);
        }

        .home-secondary-button {
          border: 1px solid rgba(17, 24, 39, 0.1);
          background: rgba(255, 255, 255, 0.72);
          color: #111827;
        }

        .home-hero-visual {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 34px;
          background: rgba(255, 255, 255, 0.68);
          box-shadow: 0 34px 110px rgba(17, 24, 39, 0.18);
          backdrop-filter: blur(22px);
        }

        .home-hero-image {
          min-height: 290px;
          border-radius: 28px;
          background-image:
            linear-gradient(180deg, rgba(17, 24, 39, 0.08), rgba(17, 24, 39, 0.36)),
            url("https://picsum.photos/seed/academic-workflow/1100/760");
          background-position: center;
          background-size: cover;
          filter: saturate(0.74) contrast(1.12);
        }

        .home-floating-search {
          margin: -76px 22px 22px;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.78);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.88);
          padding: 18px;
          box-shadow: 0 22px 70px rgba(17, 24, 39, 0.16);
          backdrop-filter: blur(18px);
        }

        .home-bento-grid {
          display: grid;
          grid-auto-flow: dense;
          grid-auto-rows: minmax(178px, auto);
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .home-bento-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(17, 24, 39, 0.08);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.74);
          padding: 28px;
          box-shadow: 0 26px 80px rgba(17, 24, 39, 0.08);
        }

        .home-bento-card.large {
          grid-column: span 2;
          grid-row: span 2;
          min-height: 374px;
          background:
            linear-gradient(140deg, rgba(17, 24, 39, 0.88), rgba(28, 42, 58, 0.82)),
            url("https://picsum.photos/seed/research-board/1200/900");
          background-position: center;
          background-size: cover;
          color: #ffffff;
        }

        .home-bento-card.wide {
          grid-column: span 2;
        }

        .home-bento-card .home-bento-value {
          font-size: clamp(2.1rem, 4vw, 4.2rem);
          line-height: 0.95;
          font-weight: 820;
          letter-spacing: 0;
        }

        .home-workflow-section {
          position: relative;
          padding: 120px 0 130px;
        }

        .home-workflow-pin {
          will-change: transform;
        }

        .home-accordion-rail {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 10px 8px 32px;
          cursor: grab;
          touch-action: pan-x;
          scrollbar-width: none;
        }

        .home-accordion-rail::-webkit-scrollbar {
          display: none;
        }

        .home-feature-card {
          position: relative;
          isolation: isolate;
          min-height: 440px;
          width: 210px;
          flex: 0 0 auto;
          overflow: hidden;
          border: 1px solid rgba(17, 24, 39, 0.09);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.78);
          padding: 22px;
          text-align: left;
          box-shadow: 0 24px 80px rgba(17, 24, 39, 0.08);
          transition: width 0.32s ease, transform 0.32s ease, box-shadow 0.32s ease, color 0.32s ease;
        }

        .home-feature-card:hover,
        .home-feature-card:focus-visible {
          width: 336px;
          transform: translateY(-8px);
          box-shadow: 0 34px 110px rgba(17, 24, 39, 0.16);
          outline: none;
        }

        .home-feature-card::before {
          content: "";
          position: absolute;
          inset: 20px auto auto 20px;
          z-index: -1;
          width: 54px;
          height: 54px;
          border-radius: 22px;
          background: var(--feature-color, rgba(22, 93, 255, 0.16));
          opacity: 0.92;
          transition: inset 0.32s ease, width 0.32s ease, height 0.32s ease, border-radius 0.32s ease, opacity 0.32s ease;
        }

        .home-feature-card:hover::before,
        .home-feature-card:focus-visible::before {
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          opacity: 0.2;
        }

        .home-feature-detail {
          width: 256px;
          transform: translateY(16px);
          opacity: 0;
          transition: transform 0.32s ease, opacity 0.32s ease;
        }

        .home-feature-card:hover .home-feature-detail,
        .home-feature-card:focus-visible .home-feature-detail {
          transform: translateY(0);
          opacity: 1;
        }

        .home-testimonial-card {
          transition: transform 0.7s ease;
        }

        .home-testimonial-card:hover {
          transform: scale(1.035);
        }

        @media (max-width: 768px) {
          .search-marketing-page .landing-title {
            font-size: 36px;
            line-height: 44px;
          }

          .search-marketing-page .hero-search-shell {
            margin-top: 32px;
            padding: 14px;
          }

          .search-marketing-page .hero-search-controls {
            align-items: stretch;
            flex-direction: column;
          }

          .search-marketing-page .mode-shell,
          .search-marketing-page .hero-submit {
            width: 100%;
          }

          .home-hero-title {
            font-size: clamp(2.75rem, 13vw, 4.4rem);
          }

          .home-bento-grid {
            grid-template-columns: 1fr;
          }

          .home-bento-card.large,
          .home-bento-card.wide {
            grid-column: auto;
            grid-row: auto;
          }

          .home-workflow-section {
            padding: 72px 0 86px;
          }

          .home-feature-card,
          .home-feature-card:hover,
          .home-feature-card:focus-visible {
            width: 292px;
          }
        }
      `}</style>
      {!isSearchMode ? (
      <section
        id="scholar-search-hero"
        className="home-hero-section px-6 py-24 md:px-10 md:py-32"
      >
        <div className="home-grain" />
        <div className="relative mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.72fr)] lg:items-end">
          <div className="home-hero-copy">
            <h1 className="home-hero-title">
              {isZh ? (
                <>
                  把科研工作流
                  <span className="home-inline-image" />
                  整理成可行动的智能系统
                </>
              ) : (
                <>
                  Turn research
                  <span className="home-inline-image" />
                  into an intelligent operating system
                </>
              )}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-700">
              {isZh
                ? '从文献发现、知识库沉淀到 Agent 实验，WisPaper 将分散工具编排成一个连续工作台，让复杂调研更快进入判断和行动。'
                : 'From literature discovery and knowledge capture to agent-driven experiments, WisPaper turns scattered tools into one continuous workspace for faster research decisions.'}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => onStartSearch()} className="home-primary-button">
                <span>{isZh ? '进入 Workspace' : 'Enter Workspace'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onNavigateToMarketingPage('search')} className="home-secondary-button">
                <span>{isZh ? '查看 Scholar Search' : 'View Scholar Search'}</span>
              </button>
            </div>
          </div>

          <div className="home-hero-visual home-scale-fade">
            <div className="home-hero-image" />
            <div className="home-floating-search">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-slate-500" />
                <input
                  value={landingSearchQuery}
                  onChange={(event) => setLandingSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleLandingSearch();
                    }
                  }}
                  placeholder={isZh ? '找近三年 AI4Science 论文' : 'Find recent AI4Science papers'}
                  className="h-10 min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleLandingSearch}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800"
                >
                  <ArrowUp className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(isZh
                  ? ['自动识别研究问题', '连接知识库与 Agent']
                  : ['Understands research intent', 'Connects library and agents']
                ).map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-950/[0.04] px-4 py-3 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {!isSearchMode ? (
      <section className="home-scale-fade px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-black leading-[1.06] text-slate-950 md:text-6xl">
              {isZh ? '从发现到复用，让每一步研究都留下结构。' : 'From discovery to reuse, every research step becomes structured.'}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              {isZh
                ? '首页不再堆叠功能，而是把科研旅程拆成清晰的工作层：检索、沉淀、追问、生成。'
                : 'The homepage organizes the research journey into clear working layers: search, capture, question, and generate.'}
            </p>
          </div>

          <div className="home-bento-grid mt-14">
            <article className="home-bento-card large">
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <p className="text-xl font-semibold text-white/82">{isZh ? '连续研究工作台' : 'Continuous research workspace'}</p>
                  <h3 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] text-white md:text-5xl">
                    {isZh ? '把论文、问题和实验路径放在同一条线上。' : 'Keep papers, questions, and experiments on one line.'}
                  </h3>
                </div>
                <p className="max-w-lg text-base leading-8 text-white/72">
                  {isZh
                    ? '不再在搜索、阅读、问答和笔记间反复切换，所有线索都可以继续进入下一步。'
                    : 'Move through search, reading, QA, and notes without losing context between tools.'}
                </p>
              </div>
            </article>

            {heroStats.slice(0, 2).map((item, index) => (
              <article key={item.zhLabel} className="home-bento-card">
                <p className="home-bento-value" style={{ color: index === 0 ? 'var(--home-cobalt)' : 'var(--home-sage)' }}>
                  {isZh ? item.zhValue : item.enValue}
                </p>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-700">
                  {isZh ? item.zhLabel : item.enLabel}
                </p>
              </article>
            ))}

            <article className="home-bento-card wide">
              <div className="flex h-full flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                  <p className="text-base font-semibold text-slate-500">{isZh ? '面向长期沉淀' : 'Built for compounding work'}</p>
                  <h3 className="mt-4 max-w-lg text-3xl font-black leading-[1.08] text-slate-950">
                    {isZh ? '检索结果可以直接变成可复用的知识资产。' : 'Search results become reusable knowledge assets.'}
                  </h3>
                </div>
                <Database className="h-14 w-14 shrink-0 text-[var(--home-lilac)]" />
              </div>
            </article>
          </div>
        </div>
      </section>
      ) : null}

      {!isSearchMode ? (
      <section className="home-workflow-section px-6 md:px-10">
        <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="home-workflow-pin">
            <h2 className="max-w-xl text-4xl font-black leading-[1.06] text-slate-950 md:text-6xl">
              {isZh ? '一个研究问题，会自然流向不同工具。' : 'One research question naturally flows into different tools.'}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              {isZh
                ? '悬浮卡片查看每个能力的展开说明，横向拖动可以浏览完整工作流。'
                : 'Hover to expand each capability, then drag horizontally to browse the full workflow.'}
            </p>
          </div>

          <div
            ref={featureRailRef}
            onPointerDown={handleFeatureRailPointerDown}
            onPointerMove={handleFeatureRailPointerMove}
            onPointerUp={finishFeatureRailDrag}
            onPointerCancel={finishFeatureRailDrag}
            className="home-accordion-rail select-none active:cursor-grabbing"
          >
            {featureOverviewCards.map((card, index) => {
              const Icon = card.icon;
              const colors = ['rgba(15,143,121,0.2)', 'rgba(124,92,255,0.2)', 'rgba(22,93,255,0.18)', 'rgba(255,176,32,0.2)', 'rgba(17,24,39,0.12)', 'rgba(14,165,233,0.18)'];

              return (
                <button
                  key={card.zhTitle}
                  type="button"
                  onClick={(event) => handleFeatureCardClick(event, card.key)}
                  className="home-feature-card home-scale-fade group"
                  style={{ '--feature-color': colors[index % colors.length] } as React.CSSProperties}
                >
                  <span className="text-5xl font-black leading-none text-slate-950/[0.08]">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative mt-12 flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/76 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.86)]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-7 max-w-[10rem] text-2xl font-black leading-tight text-slate-950">
                    {isZh ? card.zhTitle : card.enTitle}
                  </h3>

                  <div className="home-feature-detail mt-8">
                    <p className="text-[0.98rem] leading-8 text-slate-700">
                      {isZh ? card.zhBody : card.enBody}
                    </p>
                    <p className="mt-5 border-t border-slate-200/80 pt-5 text-sm leading-7 text-slate-500">
                      {isZh ? card.zhDetail : card.enDetail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="search-mode-hero px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 text-center">
            <h1 className="landing-title">
              {isZh ? '你好，今天想读哪篇论文？' : 'Hi · Which paper do you want to read today?'}
            </h1>
          </div>

          <div className="hero-search-shell">
            <div className="hero-search-card">
              <textarea
                value={landingSearchQuery}
                onChange={(e) => setLandingSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleLandingSearch();
                  }
                }}
                placeholder=""
                rows={4}
                className="hero-search-input"
              />
              {!landingSearchQuery ? (
                <div className="hero-search-placeholder">
                  {isZh ? '例如：帮我找一下关于非线性多智能体系统最优编队控制的论文' : 'Find papers that introduce new RL algorithms for LLM post-training.'}
                </div>
              ) : null}
            </div>

            <div className="hero-search-controls">
              <div className="flex flex-wrap items-center gap-2.5">
                <button type="button" className="mode-shell bg-[#f5f7fa]">
                  <Sparkles className="h-4 w-4 text-[#1687ff]" />
                  <span className="mode-chip">{isZh ? '深度搜索' : 'Deep Search'}</span>
                </button>
                <button type="button" onClick={() => onNavigateToMarketingPage('scholar-qa')} className="mode-shell">
                  <Bot className="h-4 w-4 text-slate-500" />
                  <span className="mode-chip">Agent</span>
                </button>
                <button type="button" onClick={() => onNavigateToMarketingPage('idea-discovery')} className="mode-shell">
                  <Sparkles className="h-4 w-4 text-slate-500" />
                  <span className="mode-chip">{isZh ? '灵感发现' : 'Idea Discovery'}</span>
                </button>
                <button type="button" onClick={onOpenFigureToPPTX} className="mode-shell">
                  <Presentation className="h-4 w-4 text-slate-500" />
                  <span className="mode-chip">PDF {isZh ? '转' : 'to'} PPT</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLandingSearch}
                  className="hero-submit"
                >
                  <ArrowUp className="h-6 w-6" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="px-6 pb-10 md:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-5 flex items-center justify-between">
            <div className="inline-flex rounded-full bg-[#edf1f6] p-1 text-sm text-slate-500">
              <span className="rounded-full bg-white px-5 py-2 font-semibold text-[#1687ff]">{isZh ? '趋势' : 'Trends'}</span>
              <span className="px-5 py-2">{isZh ? '最新' : 'Latest'}</span>
              <span className="px-5 py-2">AI Feeds</span>
            </div>
          </div>
          <div className="space-y-4">
            {resultRows.slice(0, 2).map((row, index) => (
              <article key={row.title} className="grid gap-5 rounded-[18px] border border-[#dfe6ee] bg-white p-6 shadow-[0_12px_36px_-32px_rgba(35,40,47,0.35)] md:grid-cols-[1fr_140px]">
                <div>
                  <h2 className="text-xl font-semibold text-[#252c35]">{row.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#7b8797]"><span>2025-11J</span><span>Lin et al</span><span>NeurIPS 2025</span><span className="rounded-full bg-blue-50 px-2 text-[#1687ff]">JCR Q1</span></div>
                  <p className="mt-4 line-clamp-2 text-sm leading-7 text-[#667386]">{isZh ? '本文提出一种面向复杂研究任务的模型框架，并通过多组实验验证其效率与可扩展性。' : 'The paper introduces a research framework and demonstrates its efficiency and scalability across multiple experimental settings.'}</p>
                  <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#dfe6ee] px-4 py-2 text-sm text-[#667386]"><BookOpen className="h-4 w-4" />{isZh ? '加入图书馆' : 'Add to library'}</button>
                </div>
                <div className="flex min-h-[150px] items-center justify-center rounded-[12px] border border-[#e4e9ef] bg-[linear-gradient(135deg,#f8fafc,#eaf2f9)] text-center text-xs text-[#8793a2]">Paper<br />{String(index + 1).padStart(2, '0')}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="landing-section muted">
        <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="section-title centered">
            {isZh ? '为什么传统学术搜索总让你越搜越累？' : 'Why does traditional academic search become exhausting so quickly?'}
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
          {painPoints.map((item, index) => {
            const visuals = [
              {
                icon: Filter,
                shell: 'bg-[#f3f9ff]',
                blob: 'bg-[#e6ecf4]',
                rotate: '-rotate-6',
              },
              {
                icon: Search,
                shell: 'bg-[rgba(0,121,255,0.12)]',
                blob: 'bg-[#f3f9ff]',
                rotate: 'rotate-6',
              },
              {
                icon: Compass,
                shell: 'bg-[#f1f2f3]',
                blob: 'bg-[#e5e7eb]',
                rotate: '-rotate-3',
              },
            ][index];

            const Icon = visuals.icon;

            return (
              <article key={item.enTitle} className="pain-card mx-auto flex max-w-[19.5rem] flex-col items-center text-center">
                <div className="relative mb-5 flex h-28 w-28 items-center justify-center">
                  <div className={`absolute h-20 w-20 rounded-[1.5rem] ${visuals.blob} ${visuals.rotate}`} />
                  <div className={`pain-icon ${visuals.shell}`}>
                    <Icon className="h-11 w-11 text-slate-950" strokeWidth={1.7} />
                  </div>
                </div>
                <h3 className="max-w-[12ch] text-[1.7rem] font-bold tracking-tight leading-[1.2] text-slate-950">
                  {isZh ? item.zhTitle : item.enTitle}
                </h3>
                <p className="mt-4 max-w-[22ch] text-[1rem] leading-7 text-slate-700">
                  {isZh ? item.zhBody : item.enBody}
                </p>
              </article>
            );
          })}
        </div>
        <p className="mx-auto mt-10 max-w-4xl text-center text-base leading-7 text-slate-600">
          {isZh
            ? 'WisPaper的目标，不是让你输更复杂的关键词，而是真正理解你的研究意图。'
            : 'WisPaper is not about forcing you to type more complicated keywords. It is about truly understanding your research intent.'}
        </p>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="landing-section">
        <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="section-title">
            {isZh
              ? 'WisPaper 如何更快找到真正相关的论文'
              : 'How WisPaper helps you find relevant papers faster'}
          </h2>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {solutionCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article key={card.enTitle} className="solution-card">
                <div className="flex items-center justify-between">
                  <div className="solution-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{isZh ? card.zhTitle : card.enTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{isZh ? card.zhBody : card.enBody}</p>
              </article>
            );
          })}
        </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="landing-section soft">
        <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="section-title">
            {isZh ? '两种搜索方式，匹配不同研究场景' : 'Two search modes for different research scenarios'}
          </h2>
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <article className="mode-card featured">
          <div className="flex items-center gap-3">
            <div className="mode-icon">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Deep Search</h2>
              <p className="text-sm text-slate-600">
                {isZh ? '适合理解研究意图与复杂条件' : 'Built for research intent and complex filters'}
              </p>
            </div>
          </div>
          <div className="mt-6 border-l-2 border-blue-100 pl-5">
            <p className="text-sm leading-7 text-slate-700">
              {isZh
                ? '当你的目标不是“找一篇已知论文”，而是要围绕一个研究问题系统性筛选文献时，Deep Search 更合适。'
                : 'When your goal is not to find one known paper but to systematically filter literature around a research question, Deep Search is the better fit.'}
            </p>
            <div className="mt-4 space-y-4">
            {(isZh
              ? ['AI 理解研究问题与上下文', '支持复杂条件、歧义词与排除逻辑', '更适合文献综述与高质量筛选', '更适合 related work、方法比较与研究空白发现']
              : ['AI understands research questions and context', 'Supports complex conditions, ambiguous terms, and exclusion logic', 'Better for literature reviews and high-quality filtering', 'Better for related work, method comparison, and research gap discovery']
            ).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="check-dot">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
            </div>
          </div>
        </article>

        <article className="mode-card">
          <div className="flex items-center gap-3">
            <div className="mode-icon dark">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Quick Search</h2>
              <p className="text-sm text-slate-500">
                {isZh ? '适合已知线索与宽泛检索' : 'Best for known leads and broad retrieval'}
              </p>
            </div>
          </div>
          <div className="mt-6 border-l-2 border-slate-200 pl-5">
            <p className="text-sm leading-7 text-slate-700">
              {isZh
                ? '当你已经知道标题、作者、方向关键词，或只想快速浏览某一主题下的论文时，Quick Search 更高效。'
                : 'When you already know the title, author, or topic keywords, or simply want to browse a theme quickly, Quick Search is more efficient.'}
            </p>
            <div className="mt-4 space-y-4">
            {(isZh
              ? ['免费可用', '响应更快', '适合已知标题、作者和宽泛主题检索', '适合快速定位和初步探索']
              : ['Free to use', 'Faster response', 'Best for known titles, authors, and broad topic search', 'Good for fast lookup and initial exploration']
            ).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="check-dot dark">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
            </div>
          </div>
        </article>
        </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="landing-section muted">
        <div className="mx-auto max-w-6xl">
          <div>
            <h2 className="section-title">
              {isZh ? '搜索之后，不止是结果列表' : 'Search results that go beyond a list of links'}
            </h2>
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="results-panel">
            <div className="table-head grid grid-cols-[1.9fr_0.7fr_0.9fr_1fr_1fr_1fr_1fr] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span>{isZh ? '标题' : 'Title'}</span>
              <span>{isZh ? '年份' : 'Year'}</span>
              <span>{isZh ? '引用量' : 'Citations'}</span>
              <span>{isZh ? '问题' : 'Problem'}</span>
              <span>{isZh ? '方法' : 'Method'}</span>
              <span>{isZh ? '数据集' : 'Dataset'}</span>
              <span>{isZh ? '约束条件' : 'Constraint'}</span>
            </div>
            {resultRows.map((row) => (
              <div key={row.title} className="grid grid-cols-[1.9fr_0.7fr_0.9fr_1fr_1fr_1fr_1fr] gap-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-700">
                <span className="font-medium text-slate-950">{row.title}</span>
                <span>{row.year}</span>
                <span>{row.citations}</span>
                <span>{row.task}</span>
                <span>{row.method}</span>
                <span>{row.dataset}</span>
                <span>{row.constraint}</span>
              </div>
            ))}
          </div>

          <div className="side-card">
            <div className="flex items-center gap-3">
              <div className="solution-icon">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">{isZh ? '表格模式' : 'Table view'}</p>
                <p className="text-sm text-slate-500">
                  {isZh ? '面向文献综述与论文对比的结构化展示' : 'Structured view for literature review and paper comparison'}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {isZh
                ? '系统可围绕你的研究任务，抽取并组织关键字段，例如：'
                : 'The system can extract and organize key fields around your research task, such as:'}
            </p>
            <div className="mt-5 space-y-3">
              {[
                isZh ? 'Problem：论文要解决的核心问题' : 'Problem: the core problem the paper addresses',
                isZh ? 'Task：具体任务或评测目标' : 'Task: the concrete task or evaluation target',
                isZh ? 'Method：采用的方法路线或模型框架' : 'Method: the method path or model framework used',
                isZh ? 'Dataset：涉及的数据集与基准设置' : 'Dataset: datasets and benchmark settings involved',
                isZh ? 'Constraint：是否排除了某数据集、某 baseline 或某类实验条件' : 'Constraint: whether certain datasets, baselines, or setups are excluded',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section id="resources-section" className="landing-section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="section-title">
              {isZh ? '从一次搜索，发展成系统性的文献综述' : 'Turn one search into a structured literature review'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateToMarketingPage('ai-survey')}
              className="primary-action mt-6"
            >
              <span>{isZh ? '进入AI Survey' : 'Go to AI Survey'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                zhTitle: '主题聚类',
                enTitle: 'Theme clusters',
                zhBody: '按主题自动聚合搜索结果，快速识别研究主线、分支方向与热点问题。',
                enBody: 'Automatically cluster search results by theme to identify major lines, branches, and hot problems faster.',
                icon: Layers3,
              },
              {
                zhTitle: '方法图谱',
                enTitle: 'Method map',
                zhBody: '比较不同方法路线、实验设置和数据集覆盖，更容易形成 related work 的整体框架。',
                enBody: 'Compare method paths, experimental setups, and dataset coverage to build a more complete related-work framework.',
                icon: TableProperties,
              },
              {
                zhTitle: '研究空白',
                enTitle: 'Research gaps',
                zhBody: '从筛选结果中提炼尚未覆盖的问题、方法盲点和潜在研究机会。',
                enBody: 'Derive uncovered problems, method blind spots, and potential research opportunities from shortlisted results.',
                icon: FileSearch,
              },
              {
                zhTitle: '综述工作流',
                enTitle: 'Review workflow',
                zhBody: '让搜索自然衔接到综述、对比分析和知识沉淀，而不是停留在“找到一些论文”。',
                enBody: 'Move naturally from search into review, comparison, and knowledge capture instead of stopping at “finding a few papers.”',
                icon: Database,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.enTitle} className="border-t border-slate-200 pt-5">
                  <div className="solution-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-950">{isZh ? item.zhTitle : item.enTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{isZh ? item.zhBody : item.enBody}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {!isSearchMode ? (
      <section className="home-scale-fade space-y-6 px-6 py-24 md:px-10 md:py-32">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/42 px-0 py-10 shadow-[0_30px_100px_rgba(17,24,39,0.08)] backdrop-blur-xl">

          <div className="px-6 pb-6 text-center">
            <h2 className="mx-auto min-h-[4rem] max-w-4xl text-4xl font-black leading-[1.08] text-slate-950 md:min-h-[5rem] md:text-6xl">
              {isZh ? '全球科研人员都在用 WisPaper' : 'Researchers around the world use WisPaper'}
            </h2>
            <p className="mx-auto mt-4 min-h-[3.5rem] max-w-3xl text-base leading-7 text-slate-600 md:min-h-[3.75rem]">
              {isZh
                ? '围绕文献查找、精读分析、综述写作与知识库沉淀，WisPaper 正在成为越来越多科研用户的日常工作台。'
                : 'Across literature search, deep reading, review writing, and knowledge-base building, WisPaper is becoming a daily workspace for more researchers.'}
            </p>
          </div>

          <div className="logo-loop-row audience-fade-mask">
            <div className="audience-loop-track">
              {[...audiences, ...audiences].map((item, index) => (
                <article
                  key={`${item.short}-${index}`}
                  className="home-testimonial-card flex min-h-[21rem] w-[21rem] min-w-[21rem] flex-col rounded-[2rem] border border-slate-200/80 bg-white/92 p-7 text-left shadow-[0_20px_60px_-44px_rgba(15,23,42,0.34)]"
                >
                  <h3 className="min-h-[4rem] text-[1.25rem] font-semibold leading-8 tracking-tight text-slate-950">
                    {isZh ? item.zhTitle : item.enTitle}
                  </h3>

                  <p className="mt-4 min-h-[8rem] text-[0.98rem] leading-8 text-slate-700">
                    {isZh ? item.zhBody : item.enBody}
                  </p>

                  <div className="mt-auto flex items-center gap-4 pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.45),_rgba(255,255,255,1)_68%)] text-xs font-bold tracking-[0.16em] text-slate-700">
                      {item.short}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{isZh ? item.zhStage : item.enStage}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="landing-section muted">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-title centered">
            {isZh ? '常见问题' : 'FAQ'}
          </h2>

          <div className="mt-8 space-y-4">
            {searchFaqItems.map((item, index) => {
              const isOpen = expandedSearchFaqIndexes.includes(index);

              return (
                <article key={item.enQuestion} className="faq-card">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSearchFaqIndexes((current) =>
                        current.includes(index)
                          ? current.filter((itemIndex) => itemIndex !== index)
                          : [...current, index],
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7"
                  >
                    <span className="text-[1.08rem] font-semibold leading-8 text-slate-900 md:text-[1.3rem]">
                      {isZh ? item.zhQuestion : item.enQuestion}
                    </span>
                    <ChevronDown
                      className={`h-6 w-6 shrink-0 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen ? (
                    <div className="border-t border-slate-200/80 px-6 pb-5 pt-4 text-[0.98rem] leading-8 text-slate-600 md:px-7 md:text-[1.02rem]">
                      {isZh ? item.zhAnswer : item.enAnswer}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="bottom-cta px-6 py-14 text-white md:px-10 md:py-16">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {isZh ? '开始按研究问题搜索论文，而不只是关键词' : 'Start searching papers by research question, not just keywords'}
            </h2>
            <p className="mt-4 text-sm text-cyan-100/80">
              {isZh ? '更适合复杂检索、文献综述、related work 调研与研究空白发现' : 'Better for complex retrieval, literature reviews, related-work research, and research gap discovery.'}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              type="button"
              onClick={() => onStartSearch()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <span>{isZh ? '免费开始搜索论文' : 'Start Searching for Free'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      ) : null}
    </main>
  );
}
