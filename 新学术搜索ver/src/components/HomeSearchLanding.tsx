import React from 'react';
import {
  ArrowUp,
  ArrowRight,
  BookOpen,
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
  Search,
  ShieldCheck,
  Sparkles,
  TableProperties,
} from 'lucide-react';
import { TextType } from './TextType';

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
}: HomeSearchLandingProps) {
  const [landingSearchQuery, setLandingSearchQuery] = React.useState('');
  const [expandedSearchFaqIndexes, setExpandedSearchFaqIndexes] = React.useState<number[]>([0]);
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

  return (
    <div className="space-y-16 pb-8 text-slate-900">
      {!isSearchMode ? (
      <section
        id="scholar-search-hero"
        className="relative px-6 py-8 md:px-10 md:py-10"
      >
        <div className="relative fade-up-enter">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
              <Sparkles className="h-4 w-4" />
              <span>{isZh ? '面向学术界的全链路AI科研加速器' : 'The world-leading end-to-end research accelerator'}</span>
            </div>

            <h1 className="mx-auto min-h-[5.5rem] max-w-4xl text-4xl font-black tracking-tight leading-[1.05] text-slate-950 md:min-h-[8.5rem] md:text-6xl">
              {isZh ? (
                <span className="flex flex-col items-center leading-[1.05]">
                  <span>WisPaper:</span>
                  <TextType
                    text="从检索到实验，重塑你的科研工作流"
                    typingSpeed={48}
                    startDelay={220}
                    className="mt-1 block"
                  />
                </span>
              ) : (
                <span className="flex flex-col items-center leading-[1.05]">
                  <span>WisPaper:</span>
                  <TextType
                    text="Your AI Academic Agent"
                    typingSpeed={48}
                    startDelay={220}
                    className="mt-1 block"
                  />
                </span>
              )}
            </h1>
            <p className="mx-auto mt-4 min-h-[4rem] max-w-3xl text-xl leading-8 text-slate-700 md:min-h-[5rem]">
              {isZh
                ? '一站式完成文献查找、知识沉淀与Agent实验，将数天的调研工作量缩减至分钟级。'
                : 'Complete literature discovery, knowledge capture, and agent-driven experimentation in one workspace, reducing days of research work to minutes.'}
            </p>
            <div className="mx-auto mt-6 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <div className="flex items-center gap-2">
                <input
                  value={landingSearchQuery}
                  onChange={(e) => setLandingSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLandingSearch();
                    }
                  }}
                  placeholder={isZh ? '例如：找最近3年研究 AI4Science 的论文…' : 'e.g., Find me papers that study AI4Science in recent 3 years...'}
                  className="h-9 w-full border-0 px-3 text-sm focus:outline-none"
                />
                <button
                  onClick={handleLandingSearch}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-5xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-slate-950 shadow-[0_32px_120px_-70px_rgba(15,23,42,0.85)]">
                <div className="aspect-video bg-slate-950">
                  <video
                    className="h-full w-full object-cover"
                    src="/media/homepage-showcase.mp4"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    {isZh ? '您的浏览器暂不支持视频播放。' : 'Your browser does not support video playback.'}
                  </video>
                </div>
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400/90" />
                  <span className="h-3 w-3 rounded-full bg-amber-300/90" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                </div>
              </div>

              <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-cyan-100/80 bg-white/72 px-4 py-7 shadow-[0_24px_80px_-56px_rgba(59,130,246,0.28)] backdrop-blur-xl md:px-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%)]" />
                <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {heroStats.map((item) => (
                    <article
                      key={item.zhLabel}
                      className="rounded-[1.35rem] border border-white/70 bg-white/58 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    >
                      <p className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                        {isZh ? item.zhValue : item.enValue}
                      </p>
                      <p className="mt-3 text-sm font-medium text-slate-600 md:text-base">
                        {isZh ? item.zhLabel : item.enLabel}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[88rem]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  <span>{isZh ? 'Research OS' : 'Research OS'}</span>
                </div>
                <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 md:text-5xl">
                  {isZh ? (
                    <>
                      编排你的
                      <span className="block text-teal-700">科研工作流。</span>
                    </>
                  ) : (
                    <>
                      We orchestrate
                      <span className="block text-teal-700">research intelligence.</span>
                    </>
                  )}
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-7 text-slate-600 lg:pt-9">
                {isZh
                  ? 'WisPaper 将检索、知识库、追新、问答、综述与更多学术工具串成一个连续工作台，帮助你更快识别研究缺口，优选科研路径。'
                  : 'WisPaper connects search, library, feeds, QA, surveys, and more academic tools into one continuous workspace for faster research decisions.'}
              </p>
            </div>

            <div
              ref={featureRailRef}
              onPointerDown={handleFeatureRailPointerDown}
              onPointerMove={handleFeatureRailPointerMove}
              onPointerUp={finishFeatureRailDrag}
              onPointerCancel={finishFeatureRailDrag}
              className="mt-10 flex cursor-grab touch-pan-x select-none gap-4 overflow-x-auto overflow-y-visible pb-6 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {featureOverviewCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <button
                    key={card.zhTitle}
                    type="button"
                    onClick={(event) => handleFeatureCardClick(event, card.key)}
                    className={`group relative h-[26rem] w-[12.5rem] shrink-0 overflow-hidden rounded-[1.75rem] border bg-white/82 px-5 py-5 text-left shadow-[0_18px_55px_-45px_rgba(15,23,42,0.35)] backdrop-blur transition-[width,transform,background-color,box-shadow] duration-300 hover:w-[20rem] hover:-translate-y-1 hover:shadow-[0_30px_80px_-50px_rgba(15,23,42,0.48)] focus-visible:w-[20rem] focus:outline-none focus:ring-2 focus:ring-teal-200 md:h-[28rem] md:w-[13.5rem] md:hover:w-[21.5rem] md:focus-visible:w-[21.5rem] ${card.border} ${card.surface}`}
                  >
                    <span className="pointer-events-none absolute bottom-5 left-5 select-none text-6xl font-black leading-none text-slate-950/[0.055] transition-colors duration-300 group-hover:text-teal-900/[0.08] group-focus-visible:text-teal-900/[0.08]">
                      {String(index + 1).padStart(2, '0')}.
                    </span>

                    {card.isExplore ? (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,23,42,0.035),_transparent_38%),linear-gradient(315deg,_rgba(20,184,166,0.07),_transparent_34%)]" />
                    ) : null}

                    <div className="relative flex h-full flex-col">
                      <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${card.accent} shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-6 max-w-[9rem] text-xl font-black leading-tight tracking-tight text-slate-950 transition-[max-width] duration-300 group-hover:max-w-[16rem] group-focus-visible:max-w-[16rem] md:text-2xl">
                        {isZh ? card.zhTitle : card.enTitle}
                      </h3>

                      <div className="mt-8 w-[16.5rem] translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:w-[18rem]">
                        <p className="text-[0.95rem] leading-7 text-slate-600">
                          {isZh ? card.zhBody : card.enBody}
                        </p>

                        <p className="mt-5 border-t border-slate-200/80 pt-5 text-[0.88rem] leading-6 text-slate-500">
                          {isZh ? card.zhDetail : card.enDetail}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="px-6 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
              <Sparkles className="h-4 w-4" />
              <span>Scholar Search</span>
            </div>
            <h1 className="mt-5 min-h-[3.5rem] text-4xl font-bold tracking-tight text-slate-950 md:min-h-[4rem] md:text-5xl">
              {isZh ? 'WisPaper: 用更聪明的方式开始学术搜索' : 'WisPaper: Start yoursearch more intelligently'}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {isZh
                ? '支持自然语言提问的智能搜索引擎，全文检索精准锁定匹配论文。'
                : 'An intelligent academic search engine that supports natural-language queries and uses full-text retrieval to pinpoint relevant papers.'}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/90 bg-[linear-gradient(180deg,rgba(237,250,255,0.96),rgba(255,255,255,1)_72%)] p-4 shadow-[0_30px_90px_-60px_rgba(14,116,144,0.38)] md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_32%)]" />

            <div className="relative rounded-[1.75rem] border border-white/90 bg-white px-5 py-5 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.25)] md:px-6">
              <div className="pointer-events-none mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                <Search className="h-4 w-4" />
                <span>{isZh ? '描述你的研究问题' : 'Describe your research question'}</span>
              </div>
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
                rows={1}
                className="w-full resize-none bg-transparent text-[1.02rem] leading-8 text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {!landingSearchQuery ? (
                <div className="pointer-events-none absolute inset-x-5 top-[3.55rem] text-[1.02rem] leading-8 text-slate-400 md:inset-x-6">
                  {isZh
                    ? '例如：搜索 2022 年后使用 GNN 做 molecular property prediction、排除 QM9、强调 realistic constraints 的论文'
                    : 'e.g. Find post-2022 papers on molecular property prediction using GNNs, excluding QM9 and emphasizing realistic constraints'}
                </div>
              ) : null}
            </div>

            <div className="relative mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-1.5 pl-3 pr-3 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.28)] backdrop-blur"
                >
                  <Search className="h-5 w-5 text-slate-500" />
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
                    <Globe className="h-4 w-4" />
                    <span>{isZh ? '深度模式' : 'Deep Mode'}</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLandingSearch}
                  className="inline-flex h-12 min-w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#18a7ea,#0f8fdf)] px-4 text-white shadow-[0_18px_36px_-20px_rgba(14,116,144,0.55)] transition hover:scale-[1.02] hover:shadow-[0_22px_42px_-20px_rgba(14,116,144,0.62)]"
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
      <section className="bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.78))] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {isZh ? '为什么传统学术搜索总让你越搜越累？' : 'Why does traditional academic search become exhausting so quickly?'}
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 md:gap-6">
          {painPoints.map((item, index) => {
            const visuals = [
              {
                icon: Filter,
                shell: 'bg-[#ead6ff]',
                blob: 'bg-[#e2ccff]',
                rotate: '-rotate-6',
              },
              {
                icon: Search,
                shell: 'bg-[#d7deff]',
                blob: 'bg-[#cfd7ff]',
                rotate: 'rotate-6',
              },
              {
                icon: Compass,
                shell: 'bg-[#cfe8ff]',
                blob: 'bg-[#c6e0fb]',
                rotate: '-rotate-3',
              },
            ][index];

            const Icon = visuals.icon;

            return (
              <article key={item.enTitle} className="mx-auto flex max-w-[18.5rem] flex-col items-center px-3 py-2 text-center">
                <div className="relative mb-5 flex h-28 w-28 items-center justify-center">
                  <div className={`absolute h-20 w-20 rounded-[1.5rem] ${visuals.blob} ${visuals.rotate}`} />
                  <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${visuals.shell} shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]`}>
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
      <section className="bg-white px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {isZh
              ? 'WisPaper 如何更快找到真正相关的论文'
              : 'How WisPaper helps you find relevant papers faster'}
          </h2>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {solutionCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article key={card.enTitle} className="border-t border-slate-200 pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-2xl bg-slate-50 p-3 text-cyan-700">
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
      <section className="bg-[linear-gradient(180deg,rgba(236,254,255,0.88),rgba(255,255,255,0.9))] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {isZh ? '两种搜索方式，匹配不同研究场景' : 'Two search modes for different research scenarios'}
          </h2>
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <article className="border-t border-cyan-200/80 pt-8 lg:pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-600 p-3 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Deep Search</h2>
              <p className="text-sm text-cyan-800">
                {isZh ? '适合理解研究意图与复杂条件' : 'Built for research intent and complex filters'}
              </p>
            </div>
          </div>
          <div className="mt-6 border-l-2 border-cyan-200/80 pl-5">
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
                <div className="mt-1 rounded-full bg-cyan-600 p-1 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
            </div>
          </div>
        </article>

        <article className="border-t border-slate-200/80 pt-8 lg:pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
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
                <div className="mt-1 rounded-full bg-slate-900 p-1 text-white">
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
      <section className="bg-[linear-gradient(180deg,rgba(237,250,255,0.94),rgba(248,250,252,0.96)_58%,rgba(255,255,255,1))] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {isZh ? '搜索之后，不止是结果列表' : 'Search results that go beyond a list of links'}
            </h2>
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.18)]">
            <div className="grid grid-cols-[1.9fr_0.7fr_0.9fr_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
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

          <div className="rounded-[1.5rem] border border-cyan-100 bg-white/88 p-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
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
      <section id="resources-section" className="bg-white px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {isZh ? '从一次搜索，发展成系统性的文献综述' : 'Turn one search into a structured literature review'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateToMarketingPage('ai-survey')}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                  <div className="inline-flex rounded-2xl bg-slate-50 p-3 text-cyan-700">
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
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/22 px-0 py-8 backdrop-blur-xl">

          <div className="px-6 pb-6 text-center">
            <h2 className="min-h-[4rem] text-3xl font-bold tracking-tight text-slate-950 md:min-h-[5rem] md:text-4xl">
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
                  className="flex min-h-[21rem] w-[21rem] min-w-[21rem] flex-col rounded-[2rem] border border-slate-200/80 bg-white/92 p-7 text-left shadow-[0_20px_60px_-44px_rgba(15,23,42,0.34)]"
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
      <section className="bg-[linear-gradient(180deg,rgba(239,249,255,0.72),rgba(255,255,255,1))] px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-[2rem] font-bold tracking-tight text-slate-950 md:text-[2.35rem]">
            {isZh ? '常见问题' : 'FAQ'}
          </h2>

          <div className="mt-8 space-y-4">
            {searchFaqItems.map((item, index) => {
              const isOpen = expandedSearchFaqIndexes.includes(index);

              return (
                <article key={item.enQuestion} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/92 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.16)]">
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
      <section className="surface-glow relative overflow-hidden bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92)_55%,_rgba(8,47,73,0.95))] px-6 py-14 text-white md:px-10 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%)]" />
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
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <span>{isZh ? '免费开始搜索论文' : 'Start Searching for Free'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      ) : null}
    </div>
  );
}
