import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Crown,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Download,
} from 'lucide-react';
import { isValidEmail } from '../utils/email';
import { calculateStorageCredits } from '../utils/storagePricing';
import { StorageManagementSection } from './StorageManagementSection';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'basic' | 'membership' | 'payment' | 'account';

const creditPackages = [
  { id: 'pack-0618', purchasedAt: '2026 年 6 月 18 日', expiresAt: '2026 年 8 月 18 日', total: 5000, used: 1200 },
  { id: 'pack-0602', purchasedAt: '2026 年 6 月 2 日', expiresAt: '2026 年 8 月 2 日', total: 3000, used: 1800 },
  { id: 'pack-0524', purchasedAt: '2026 年 5 月 24 日', expiresAt: '2026 年 7 月 24 日', total: 2000, used: 1200 },
];

const tenGbStorageCredits = calculateStorageCredits(10);

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const navigationItems = [
    { id: 'basic' as const, label: '个人资料', icon: User },
    { id: 'membership' as const, label: '会员与额度', icon: Crown },
    { id: 'payment' as const, label: '订单与发票', icon: CreditCard },
    { id: 'account' as const, label: '安全与偏好', icon: Settings },
  ];
  const activePage = navigationItems.find((item) => item.id === activeTab) ?? navigationItems[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="grid h-[min(88vh,860px)] w-full max-w-5xl grid-cols-[15.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl bg-white shadow-[0_28px_90px_-32px_rgba(15,23,42,0.48)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-account-title"
      >
        {/* Left Sidebar */}
        <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-slate-50/80 p-4">
          {/* User Profile */}
          <div className="mb-5 rounded-xl bg-white p-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900">
                <span className="text-sm font-semibold text-white">张</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">张涛</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">zhangtao@example.com</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
              <span className="text-[11px] text-slate-500">个人账户</span>
              <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">Pro 月度版</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1" aria-label="我的账户">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.99] ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.8)]'
                      : 'text-slate-600 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span className="min-w-0 text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <section className="flex min-h-0 min-w-0 flex-col">
          {/* Header */}
          <header className="flex items-start justify-between border-b border-slate-200 px-8 py-5">
            <div>
              <h2 id="my-account-title" className="text-xl font-semibold tracking-[-0.02em] text-slate-950">{activePage.label}</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="关闭我的账户"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Content */}
          <main className="min-h-0 flex-1 overflow-y-auto bg-white">
            {activeTab === 'basic' && <BasicInformation />}
            {activeTab === 'membership' && <MembershipPayment />}
            {activeTab === 'payment' && <PaymentTab />}
            {activeTab === 'account' && <AccountSettings onFinish={onClose} />}
          </main>
        </section>
      </div>
    </div>
  );
}

// Basic Information Tab
function BasicInformation() {
  const [name, setName] = useState('张伟');
  const [email, setEmail] = useState('zhangwei@example.com');
  const [organization, setOrganization] = useState('清华大学');
  const [researchField, setResearchField] = useState('人工智能、机器学习');
  const [emailError, setEmailError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!isValidEmail(email)) {
      setEmailError('请输入有效的邮箱地址');
      setSaved(false);
      return;
    }

    setEmailError('');
    setSaved(true);
    console.log('Saving profile', { name, email: email.trim(), organization, researchField });
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <section className="grid grid-cols-[10rem_minmax(0,1fr)] gap-8">
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white shadow-[0_18px_35px_-24px_rgba(15,23,42,0.9)]">
              张
            </div>
            <button className="mt-3 text-xs font-medium text-slate-600 transition-colors hover:text-slate-950">
              更换头像
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">电子邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                const nextEmail = event.target.value;
                setEmail(nextEmail);
                if (!nextEmail.trim() || isValidEmail(nextEmail)) {
                  setEmailError('');
                }
                setSaved(false);
              }}
              onBlur={() => {
                if (email.trim() && !isValidEmail(email)) {
                  setEmailError('请输入有效的邮箱地址');
                }
              }}
              className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                emailError ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:border-slate-500 focus:ring-slate-200'
              }`}
            />
            {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
          </div>

          {/* Organization */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">所属机构</label>
            <input
              type="text"
              value={organization}
              onChange={(event) => {
                setOrganization(event.target.value);
                setSaved(false);
              }}
              placeholder="输入您的机构名称"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Research Field */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-700">研究领域</label>
            <input
              type="text"
              value={researchField}
              onChange={(event) => {
                setResearchField(event.target.value);
                setSaved(false);
              }}
              placeholder="输入您的研究领域"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
          <div>
            {saved && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                个人资料已保存
              </p>
            )}
          </div>
            <button
              onClick={handleSave}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              保存更改
            </button>
        </div>
      </div>
    </div>
  );
}

// Membership & Payment Tab
function MembershipPayment() {
  const [showCreditPackages, setShowCreditPackages] = useState(false);
  const [showUsage, setShowUsage] = React.useState(false);
  const [expandedDate, setExpandedDate] = React.useState('2026-06-02');
  const [expandedFeature, setExpandedFeature] = React.useState('2026-06-02-Search');
  const [showAllUsageDates, setShowAllUsageDates] = React.useState(false);
  const featureMeta: Record<string, { color: string; featureClass: string }> = {
    Search: { color: '#ff8a1f', featureClass: 'bg-orange-100 text-orange-700' },
    Survey: { color: '#2f80ed', featureClass: 'bg-blue-100 text-blue-700' },
    QA: { color: '#8b5cf6', featureClass: 'bg-purple-100 text-purple-700' },
    Feeds: { color: '#94a3b8', featureClass: 'bg-slate-100 text-slate-700' },
    Agent: { color: '#14b8a6', featureClass: 'bg-teal-100 text-teal-700' },
  };
  const makeRecord = (title: string, time: string, amount: number) => ({ title, detail: '', time, amount });
  const makeFeature = (
    feature: string,
    requests: number,
    credits: number,
    records: Array<{ title: string; time: string; amount: number }>
  ) => ({
    feature,
    ...featureMeta[feature],
    requests,
    credits,
    records: records.map((record) => ({ ...record, detail: '' })),
  });
  const usageGroups = [
    {
      date: '2026-06-02',
      label: '今天',
      total: 248,
      dayLimit: 500,
      features: [
        {
          feature: 'Search',
          color: '#ff8a1f',
          featureClass: 'bg-orange-100 text-orange-700',
          requests: 12,
          credits: 150,
          records: [
            { title: '论文翻译', detail: '"Attention Is All You Need" - 全文翻译', time: '2026-06-02 14:32', amount: -30 },
            { title: '文献检索', detail: '搜索“深度学习在医学图像中的应用”相关论文', time: '2026-06-02 14:05', amount: -20 },
            { title: 'Quick Search', detail: '检索 Transformer 综述论文', time: '2026-06-02 13:48', amount: -15 },
            { title: 'Deep Search', detail: '深度检索 Agent 评估方法', time: '2026-06-02 13:20', amount: -15 },
            { title: '论文翻译', detail: '摘要翻译', time: '2026-06-02 12:52', amount: -10 },
            { title: '文献检索', detail: '搜索 RAG survey', time: '2026-06-02 12:15', amount: -10 },
            { title: 'Quick Search', detail: '检索 benchmark 数据集', time: '2026-06-02 11:58', amount: -10 },
            { title: '文献检索', detail: '搜索 AI workflow', time: '2026-06-02 11:30', amount: -10 },
            { title: '论文翻译', detail: '方法章节翻译', time: '2026-06-02 10:56', amount: -10 },
            { title: 'Quick Search', detail: '检索 tool use 论文', time: '2026-06-02 10:34', amount: -10 },
            { title: '文献检索', detail: '搜索 multimodal retrieval', time: '2026-06-02 10:22', amount: -10 },
            { title: 'Deep Search', detail: '扩展检索研究空白', time: '2026-06-02 09:55', amount: -10 },
          ],
        },
        {
          feature: 'Survey',
          color: '#2f80ed',
          featureClass: 'bg-blue-100 text-blue-700',
          requests: 1,
          credits: 53,
          records: [
            { title: 'AI Survey', detail: '生成多模态推理 benchmark 综述', time: '2026-06-02 09:48', amount: -53 },
          ],
        },
        {
          feature: 'QA',
          color: '#8b5cf6',
          featureClass: 'bg-purple-100 text-purple-700',
          requests: 1,
          credits: 45,
          records: [
            { title: 'AI问答', detail: '关于 Transformer 架构的详细解释', time: '2026-06-02 11:15', amount: -45 },
          ],
        },
        {
          feature: 'Feeds',
          color: '#94a3b8',
          featureClass: 'bg-slate-100 text-slate-700',
          requests: 1,
          credits: 0,
          records: [
            { title: '订阅更新', detail: '查看本周高相关论文推送', time: '2026-06-02 08:40', amount: 0 },
          ],
        },
      ],
    },
    {
      date: '2026-06-01',
      label: '昨天',
      total: 380,
      dayLimit: 500,
      features: [
        {
          feature: 'Search',
          color: '#ff8a1f',
          featureClass: 'bg-orange-100 text-orange-700',
          requests: 4,
          credits: 210,
          records: [
            { title: 'Deep Search', detail: '检索“LLM Agent evaluation”相关论文', time: '2026-06-01 18:12', amount: -90 },
            { title: '论文翻译', detail: '"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" - 摘要翻译', time: '2026-06-01 15:30', amount: -40 },
            { title: 'Quick Search', detail: '检索“AI research workflow”相关论文', time: '2026-06-01 10:06', amount: -80 },
          ],
        },
        {
          feature: 'Survey',
          color: '#2f80ed',
          featureClass: 'bg-blue-100 text-blue-700',
          requests: 1,
          credits: 80,
          records: [
            { title: 'AI Survey', detail: '生成 Agentic RAG 研究综述', time: '2026-06-01 16:44', amount: -80 },
          ],
        },
        {
          feature: 'QA',
          color: '#8b5cf6',
          featureClass: 'bg-purple-100 text-purple-700',
          requests: 2,
          credits: 70,
          records: [
            { title: 'AI问答', detail: '解释 chain-of-thought 与 tool use 的区别', time: '2026-06-01 13:20', amount: -35 },
            { title: 'AI问答', detail: '总结 MoE 架构的训练优势', time: '2026-06-01 11:42', amount: -35 },
          ],
        },
        {
          feature: 'Agent',
          color: '#14b8a6',
          featureClass: 'bg-teal-100 text-teal-700',
          requests: 1,
          credits: 70,
          records: [
            { title: 'Agent任务', detail: '整理三篇论文的对比分析框架', time: '2026-06-01 09:18', amount: -70 },
          ],
        },
        {
          feature: 'Feeds',
          color: '#94a3b8',
          featureClass: 'bg-slate-100 text-slate-700',
          requests: 1,
          credits: 20,
          records: [
            { title: '订阅更新', detail: '刷新 AI Agent 方向订阅', time: '2026-06-01 08:10', amount: -20 },
          ],
        },
      ],
    },
    {
      date: '2026-05-31',
      label: '05月31日',
      total: 70,
      dayLimit: 500,
      features: [
        {
          feature: 'Search',
          color: '#ff8a1f',
          featureClass: 'bg-orange-100 text-orange-700',
          requests: 1,
          credits: 30,
          records: [
            { title: '文献检索', detail: '搜索“multimodal retrieval benchmark”相关论文', time: '2026-05-31 17:24', amount: -30 },
          ],
        },
        {
          feature: 'QA',
          color: '#8b5cf6',
          featureClass: 'bg-purple-100 text-purple-700',
          requests: 1,
          credits: 40,
          records: [
            { title: 'AI问答', detail: '解释 contrastive learning 的核心机制', time: '2026-05-31 14:02', amount: -40 },
          ],
        },
      ],
    },
    {
      date: '2026-05-30',
      label: '05月30日',
      total: 312,
      dayLimit: 500,
      features: [
        makeFeature('Search', 3, 160, [
          makeRecord('Deep Search', '2026-05-30 16:18', -90),
          makeRecord('论文翻译', '2026-05-30 14:46', -40),
          makeRecord('Quick Search', '2026-05-30 10:25', -30),
        ]),
        makeFeature('Survey', 1, 72, [makeRecord('AI Survey', '2026-05-30 12:10', -72)]),
        makeFeature('QA', 2, 80, [
          makeRecord('AI问答', '2026-05-30 15:42', -40),
          makeRecord('AI问答', '2026-05-30 11:36', -40),
        ]),
      ],
    },
    {
      date: '2026-05-29',
      label: '05月29日',
      total: 196,
      dayLimit: 500,
      features: [
        makeFeature('Search', 2, 110, [
          makeRecord('文献检索', '2026-05-29 18:08', -60),
          makeRecord('论文翻译', '2026-05-29 13:35', -50),
        ]),
        makeFeature('Agent', 1, 56, [makeRecord('Agent任务', '2026-05-29 16:20', -56)]),
        makeFeature('Feeds', 1, 30, [makeRecord('订阅更新', '2026-05-29 09:18', -30)]),
      ],
    },
    {
      date: '2026-05-28',
      label: '05月28日',
      total: 428,
      dayLimit: 500,
      features: [
        makeFeature('Search', 5, 240, [
          makeRecord('Deep Search', '2026-05-28 19:02', -100),
          makeRecord('文献检索', '2026-05-28 16:17', -50),
          makeRecord('Quick Search', '2026-05-28 14:22', -30),
          makeRecord('论文翻译', '2026-05-28 11:40', -40),
          makeRecord('Quick Search', '2026-05-28 09:30', -20),
        ]),
        makeFeature('Survey', 1, 88, [makeRecord('AI Survey', '2026-05-28 13:12', -88)]),
        makeFeature('QA', 2, 100, [
          makeRecord('AI问答', '2026-05-28 17:25', -45),
          makeRecord('AI问答', '2026-05-28 10:18', -55),
        ]),
      ],
    },
    {
      date: '2026-05-27',
      label: '05月27日',
      total: 145,
      dayLimit: 500,
      features: [
        makeFeature('Search', 2, 75, [
          makeRecord('文献检索', '2026-05-27 15:08', -35),
          makeRecord('论文翻译', '2026-05-27 11:12', -40),
        ]),
        makeFeature('QA', 1, 45, [makeRecord('AI问答', '2026-05-27 16:30', -45)]),
        makeFeature('Feeds', 1, 25, [makeRecord('订阅更新', '2026-05-27 08:55', -25)]),
      ],
    },
    {
      date: '2026-05-26',
      label: '05月26日',
      total: 260,
      dayLimit: 500,
      features: [
        makeFeature('Search', 2, 100, [
          makeRecord('Deep Search', '2026-05-26 17:55', -70),
          makeRecord('Quick Search', '2026-05-26 10:24', -30),
        ]),
        makeFeature('Survey', 1, 95, [makeRecord('AI Survey', '2026-05-26 14:10', -95)]),
        makeFeature('Agent', 1, 65, [makeRecord('Agent任务', '2026-05-26 11:45', -65)]),
      ],
    },
    {
      date: '2026-05-25',
      label: '05月25日',
      total: 88,
      dayLimit: 500,
      features: [
        makeFeature('Search', 1, 40, [makeRecord('文献检索', '2026-05-25 13:52', -40)]),
        makeFeature('QA', 1, 48, [makeRecord('AI问答', '2026-05-25 10:05', -48)]),
      ],
    },
    {
      date: '2026-05-24',
      label: '05月24日',
      total: 334,
      dayLimit: 500,
      features: [
        makeFeature('Search', 4, 190, [
          makeRecord('Deep Search', '2026-05-24 18:40', -80),
          makeRecord('论文翻译', '2026-05-24 15:16', -50),
          makeRecord('文献检索', '2026-05-24 11:28', -40),
          makeRecord('Quick Search', '2026-05-24 09:22', -20),
        ]),
        makeFeature('Survey', 1, 84, [makeRecord('AI Survey', '2026-05-24 14:05', -84)]),
        makeFeature('Agent', 1, 60, [makeRecord('Agent任务', '2026-05-24 10:30', -60)]),
      ],
    },
    {
      date: '2026-05-23',
      label: '05月23日',
      total: 174,
      dayLimit: 500,
      features: [
        makeFeature('Search', 2, 92, [
          makeRecord('文献检索', '2026-05-23 16:18', -42),
          makeRecord('论文翻译', '2026-05-23 10:36', -50),
        ]),
        makeFeature('QA', 1, 46, [makeRecord('AI问答', '2026-05-23 14:22', -46)]),
        makeFeature('Feeds', 1, 36, [makeRecord('订阅更新', '2026-05-23 09:05', -36)]),
      ],
    },
    {
      date: '2026-05-22',
      label: '05月22日',
      total: 286,
      dayLimit: 500,
      features: [
        makeFeature('Search', 3, 150, [
          makeRecord('Deep Search', '2026-05-22 18:15', -80),
          makeRecord('文献检索', '2026-05-22 13:52', -35),
          makeRecord('Quick Search', '2026-05-22 09:48', -35),
        ]),
        makeFeature('Survey', 1, 76, [makeRecord('AI Survey', '2026-05-22 15:20', -76)]),
        makeFeature('Agent', 1, 60, [makeRecord('Agent任务', '2026-05-22 11:14', -60)]),
      ],
    },
    {
      date: '2026-05-21',
      label: '05月21日',
      total: 119,
      dayLimit: 500,
      features: [
        makeFeature('Search', 1, 54, [makeRecord('论文翻译', '2026-05-21 15:44', -54)]),
        makeFeature('QA', 1, 45, [makeRecord('AI问答', '2026-05-21 12:18', -45)]),
        makeFeature('Feeds', 1, 20, [makeRecord('订阅更新', '2026-05-21 08:50', -20)]),
      ],
    },
    {
      date: '2026-05-20',
      label: '05月20日',
      total: 402,
      dayLimit: 500,
      features: [
        makeFeature('Search', 4, 220, [
          makeRecord('Deep Search', '2026-05-20 19:10', -100),
          makeRecord('论文翻译', '2026-05-20 16:02', -50),
          makeRecord('文献检索', '2026-05-20 13:18', -40),
          makeRecord('Quick Search', '2026-05-20 10:22', -30),
        ]),
        makeFeature('Survey', 1, 92, [makeRecord('AI Survey', '2026-05-20 14:40', -92)]),
        makeFeature('QA', 2, 90, [
          makeRecord('AI问答', '2026-05-20 17:28', -45),
          makeRecord('AI问答', '2026-05-20 11:35', -45),
        ]),
      ],
    },
    {
      date: '2026-05-19',
      label: '05月19日',
      total: 63,
      dayLimit: 500,
      features: [
        makeFeature('Search', 1, 28, [makeRecord('Quick Search', '2026-05-19 10:16', -28)]),
        makeFeature('QA', 1, 35, [makeRecord('AI问答', '2026-05-19 09:42', -35)]),
      ],
    },
  ];
  const dailyUsage = usageGroups.map((day) => ({
    date: day.date,
    label: day.label,
    used: day.total,
    total: day.dayLimit,
    featureCount: day.features.length,
  }));
  const visibleUsageGroups = showAllUsageDates ? usageGroups : usageGroups.slice(0, 10);
  const hasMoreUsageDates = usageGroups.length > 10 && !showAllUsageDates;

  if (showUsage) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          {/* Back Button */}
          <button 
            onClick={() => setShowUsage(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>返回</span>
          </button>

          {/* Usage Details */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_18px_50px_-44px_rgba(15,23,42,0.22)]">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Usage 明细</h4>
            </div>

            <div className="divide-y divide-gray-100">
              {visibleUsageGroups.map((day) => {
                const isDateOpen = expandedDate === day.date;

                return (
                  <div key={day.date}>
                    <button
                      onClick={() => {
                        const nextDate = isDateOpen ? '' : day.date;
                        setExpandedDate(nextDate);
                        if (!isDateOpen && day.features[0]) {
                          setExpandedFeature(`${day.date}-${day.features[0].feature}`);
                        }
                      }}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isDateOpen ? 'rotate-90' : ''}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{day.label}</span>
                            <span className="text-xs text-gray-500">{day.date}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{day.features.length} 个功能</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-gray-900">{day.total.toLocaleString()} Credits</p>
                      </div>
                    </button>

                    {isDateOpen && (
                      <div className="px-4 pb-4 bg-gray-50/70">
                        <div className="space-y-2 pt-2">
                          {day.features.map((item) => {
                            const featureKey = `${day.date}-${item.feature}`;
                            const isFeatureOpen = expandedFeature === featureKey;
                            const featurePercent = day.total > 0 ? Math.round((item.credits / day.total) * 100) : 0;

                            return (
                              <div key={featureKey} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setExpandedFeature(isFeatureOpen ? '' : featureKey)}
                                  className="w-full px-4 py-3 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isFeatureOpen ? 'rotate-90' : ''}`} />
                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: item.color }}>
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{item.feature}</span>
                                        <span className="text-xs text-gray-500">{featurePercent}%</span>
                                        <span className="text-xs text-gray-400">· {item.requests} 次使用</span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="shrink-0 text-sm font-medium text-gray-900">{item.credits.toLocaleString()} Credits</p>
                                </button>

                                {isFeatureOpen && (
                                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                                    {item.records.map((record) => (
                                      <div key={`${featureKey}-${record.title}-${record.time}`} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-medium text-gray-900">{record.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{record.time.slice(11, 16)}</p>
                                          </div>
                                          <div className="text-right flex-shrink-0">
                                            <p className={`text-sm font-semibold ${record.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {record.amount > 0 ? '+' : ''}{record.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">Credits</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {hasMoreUsageDates && (
                <div className="px-5 py-3 bg-gray-50">
                  <button
                    onClick={() => setShowAllUsageDates(true)}
                    className="w-full text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    更多
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        {/* Current Plan */}
        <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-[0_24px_50px_-30px_rgba(15,23,42,0.8)]">
          <div className="grid grid-cols-[1fr_auto] gap-8 p-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium tracking-[0.14em] text-slate-400">当前套餐</span>
                <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-[10px] font-medium text-emerald-300">生效中</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Pro 月度版</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">2026 年 7 月 10 日到期</p>
            </div>
            <button className="self-center rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.98]">
              升级为年度版
            </button>
          </div>
          <div className="border-t border-white/10 px-6 py-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-white">会员 Credits</p>
                  <span className="rounded-md bg-white/10 px-2 py-1 text-[9px] font-semibold text-slate-300">周期额度</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white tabular-nums">36,600 剩余</p>
            </div>
            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Pro 会员 Credits 已使用额度"
              aria-valuemin={0}
              aria-valuemax={160000}
              aria-valuenow={123400}
            >
              <div className="h-full w-[77.125%] rounded-full bg-white" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>将在 2026 年 7 月 3 日重置</span>
              <span>22.9% 可用</span>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <article className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/50">
              <div className="flex items-start gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setShowCreditPackages((current) => !current)}
                  className="group flex min-w-0 flex-1 items-start justify-between gap-4 text-left"
                  aria-expanded={showCreditPackages}
                  aria-controls="credit-package-details"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-900">充值包 Credits</h4>
                      <span className="rounded-md bg-blue-100 px-2 py-1 text-[9px] font-semibold text-blue-700">{creditPackages.length} 笔</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-950 tabular-nums">5,800</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-700 ${showCreditPackages ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => console.info('Open credit package purchase')}
                  className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  购买充值包
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="h-2 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="充值包 Credits 池已使用额度" aria-valuemin={0} aria-valuemax={10000} aria-valuenow={4200}>
                  <div className="h-full w-[42%] rounded-full bg-blue-600" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="tabular-nums">已使用 4,200 / 10,000</span>
                  <span>{showCreditPackages ? '收起购买明细' : '展开查看每笔余额'}</span>
                </div>
              </div>

              {showCreditPackages && (
                <div id="credit-package-details" className="border-t border-blue-100 bg-white">
                  {creditPackages.map((creditPackage, index) => {
                    const remaining = creditPackage.total - creditPackage.used;
                    const usedPercentage = (creditPackage.used / creditPackage.total) * 100;

                    return (
                      <div
                        key={creditPackage.id}
                        className={`px-4 py-3.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-semibold text-slate-900">购买于 {creditPackage.purchasedAt}</p>
                            <p className="mt-1 text-[9px] text-slate-400">有效期至 {creditPackage.expiresAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-blue-700 tabular-nums">{remaining.toLocaleString()} 剩余</p>
                            <p className="mt-0.5 text-[9px] text-slate-400">共 {creditPackage.total.toLocaleString()} Credits</p>
                          </div>
                        </div>
                        <div
                          className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-label={`${creditPackage.purchasedAt}购买的充值包已使用额度`}
                          aria-valuemin={0}
                          aria-valuemax={creditPackage.total}
                          aria-valuenow={creditPackage.used}
                        >
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${usedPercentage}%` }} />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
                          <span className="tabular-nums">已使用 {creditPackage.used.toLocaleString()}</span>
                          <span className="tabular-nums">{remaining.toLocaleString()} / {creditPackage.total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </article>
        </section>

        <StorageManagementSection />

        {/* Usage */}
        <button 
          onClick={() => setShowUsage(true)}
          className="group mt-5 w-full rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-slate-300 hover:bg-slate-50/70 active:scale-[0.995]"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-950">额度使用明细</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {dailyUsage.slice(0, 3).map((day) => (
              <div key={day.date} className="rounded-lg bg-slate-100/80 px-3.5 py-3">
                <p className="text-[11px] text-slate-500">{day.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-950 tabular-nums">{day.used} Credits</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{day.featureCount} 个功能</p>
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}

// Payment Tab
function PaymentTab() {
  const [visibleCount, setVisibleCount] = useState(4);

  const orderHistory = [
    { id: 'storage-1', date: '2026年6月10日', type: '高速存储 10GB 续费', method: 'Credits 余额', amount: `${tenGbStorageCredits.toLocaleString()} Credits`, status: 'paid' as const },
    { id: '1', date: '2026年3月10日', type: 'Pro 月度', method: '支付宝', amount: '—', status: 'paid' as const },
    { id: '2', date: '2026年2月10日', type: 'Pro 月度', method: 'Stripe', amount: '—', status: 'paid' as const },
    { id: '3', date: '2026年1月15日', type: 'Credits 充值', method: 'Airwallex', amount: '—', status: 'paid' as const },
    { id: '4', date: '2025年12月10日', type: 'Pro 月度', method: '支付宝', amount: '—', status: 'paid' as const },
    { id: '5', date: '2025年11月10日', type: 'Pro 月度', method: 'Stripe', amount: '—', status: 'paid' as const },
    { id: '6', date: '2025年10月20日', type: 'Credits 充值', method: 'Airwallex', amount: '—', status: 'paid' as const },
  ];

  const visibleOrders = orderHistory.slice(0, visibleCount);
  const hasMore = visibleCount < orderHistory.length;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          {/* Invoice Button */}
          <button className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50/70 active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <FileText className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-950">发票管理</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </button>

          <button className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50/70 active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <CreditCard className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-950">支付方式</span>
                <p className="mt-0.5 text-xs text-slate-500">支付宝 · 自动续费</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
          </button>
        </div>

        {/* Order History */}
        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">订单记录</h3>
            </div>
            <p className="text-[11px] text-slate-400">共 {orderHistory.length} 笔</p>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {/* Table Header */}
            <div className="grid grid-cols-[1.05fr_1.2fr_0.8fr_4rem_5rem_3.5rem] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-[11px] font-medium text-slate-500">日期</span>
              <span className="text-[11px] font-medium text-slate-500">订单类型</span>
              <span className="text-[11px] font-medium text-slate-500">支付方式</span>
              <span className="text-[11px] font-medium text-slate-500">状态</span>
              <span className="text-right text-[11px] font-medium text-slate-500">金额</span>
              <span className="text-right text-[11px] font-medium text-slate-500">账单</span>
            </div>

            {/* Table Rows */}
            {visibleOrders.map((order, index) => (
              <div
                key={order.id}
                className={`grid grid-cols-[1.05fr_1.2fr_0.8fr_4rem_5rem_3.5rem] items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/70 ${
                  index !== visibleOrders.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <span className="text-xs text-slate-600">{order.date}</span>
                <span className="text-sm font-medium text-slate-900">{order.type}</span>
                <span className="text-xs text-slate-600">{order.method}</span>
                <span className="text-xs text-emerald-600">已支付</span>
                <span className="text-right text-sm font-medium text-slate-950 tabular-nums">{order.amount || '—'}</span>
                <button
                  type="button"
                  onClick={() => console.info('Download billing statement', { orderId: order.id })}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  aria-label={`下载账单 ${order.date} ${order.type}`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>下载</span>
                </button>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="mt-3 text-xs font-medium text-slate-600 transition-colors hover:text-slate-950"
            >
              加载更多
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

type DeletionScenario = 'ready' | 'institution' | 'pending-order';
type DeletionStep = 'closed' | 'confirm' | 'blocked' | 'institution' | 'deleting' | 'success';

const deletionConsequences = [
  '账户注销后，您将无法登录或恢复该账户；',
  '您的个人数据将会永久删除且无法恢复，但法律要求或允许的部分数据可能保留更长时间；',
  '您创建的所有分享链接将立即失效；',
  '未使用的会员权益、额度及 Voucher 将作废；',
  '您的自动续费订阅将自动取消。',
];

// Account Settings Tab
function AccountSettings({ onFinish }: { onFinish: () => void }) {
  const [scenario] = useState<DeletionScenario>('ready');
  const [deletionStep, setDeletionStep] = useState<DeletionStep>('closed');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationState, setVerificationState] = useState<'idle' | 'sent' | 'valid' | 'invalid'>('idle');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  const resetVerification = () => {
    setVerificationCode('');
    setVerificationState('idle');
    setCountdown(0);
  };

  const closeDeletionFlow = () => {
    if (deletionStep === 'deleting') return;
    setDeletionStep('closed');
    resetVerification();
  };

  const startDeletionFlow = () => {
    console.info('[analytics] account_deletion_entry_clicked', { scenario });
    resetVerification();

    if (scenario === 'institution') {
      console.info('[analytics] account_deletion_institution_blocked');
      setDeletionStep('institution');
      return;
    }

    if (scenario === 'pending-order') {
      console.info('[analytics] account_deletion_condition_blocked', { reason: 'pending_order' });
      setDeletionStep('blocked');
      return;
    }

    console.info('[analytics] account_deletion_confirm_viewed');
    setDeletionStep('confirm');
  };

  const sendVerificationCode = () => {
    if (countdown > 0) return;
    setVerificationState('sent');
    setVerificationCode('');
    setCountdown(60);
    console.info('[analytics] account_deletion_code_sent', { channel: 'email', result: 'success' });
  };

  const updateVerificationCode = (value: string) => {
    const nextCode = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(nextCode);

    if (nextCode.length < 6) {
      setVerificationState(countdown > 0 ? 'sent' : 'idle');
      return;
    }

    if (nextCode === '123456') {
      setVerificationState('valid');
      console.info('[analytics] account_deletion_code_verified', { result: 'success' });
    } else {
      setVerificationState('invalid');
      console.info('[analytics] account_deletion_code_verified', { result: 'invalid_code' });
    }
  };

  const confirmDeletion = () => {
    if (verificationState !== 'valid' || deletionStep !== 'confirm') return;
    setDeletionStep('deleting');
    console.info('[analytics] account_deletion_submitted');

    window.setTimeout(() => {
      setDeletionStep('success');
      console.info('[analytics] account_deletion_completed', { result: 'success' });
    }, 900);
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const savePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('新密码至少需要 8 位');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的新密码不一致');
      return;
    }
    console.info('Password updated');
    closePasswordDialog();
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-5">
          {/* Change Password */}
          <button
            type="button"
            onClick={() => setShowPasswordDialog(true)}
            className="group flex w-full items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-slate-300 hover:bg-slate-50/70 active:scale-[0.995] focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <ShieldCheck className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-950">更改密码</h3>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <span className="font-mono text-sm tracking-[0.18em] text-slate-500">******</span>
              <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
            </div>
          </button>

          {/* Danger Zone */}
          <section className="rounded-xl border border-red-200 bg-red-50/30 p-5">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-red-700">注销账户</h3>
                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                    注销后账户无法恢复，个人数据与历史分享内容将按规则处理；自动续费将在注销成功后取消。
                  </p>
                </div>
              </div>
              <button
                onClick={startDeletionFlow}
                data-testid="account-deletion-trigger"
                className="shrink-0 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-[0.98]"
              >
                注销账户
              </button>
            </div>
          </section>
        </div>
      </div>

      {showPasswordDialog && (
        <div
          className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
          onClick={closePasswordDialog}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_28px_80px_-30px_rgba(15,23,42,0.55)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 id="change-password-title" className="text-lg font-semibold tracking-[-0.02em] text-slate-950">更改密码</h3>
              </div>
              <button
                type="button"
                onClick={closePasswordDialog}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="关闭更改密码"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">当前密码</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setPasswordError('');
                  }}
                  placeholder="输入当前密码"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setPasswordError('');
                  }}
                  placeholder="至少 8 位"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordError('');
                  }}
                  placeholder="再次输入新密码"
                  autoComplete="new-password"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                    passwordError
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-slate-300 focus:border-slate-500 focus:ring-slate-200'
                  }`}
                />
                {passwordError && <p className="mt-2 text-xs text-red-600">{passwordError}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button
                type="button"
                onClick={closePasswordDialog}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={savePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                保存新密码
              </button>
            </div>
          </div>
        </div>
      )}

      {deletionStep !== 'closed' && (
        <div
          className="fixed inset-0 z-[10020] flex items-center justify-center bg-gray-950/55 p-4 backdrop-blur-[2px]"
          onClick={closeDeletionFlow}
        >
          <div
            className="w-full max-w-[540px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-deletion-title"
          >
            {deletionStep === 'institution' && (
              <div className="p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 id="account-deletion-title" className="text-xl font-semibold text-gray-950">
                  无法自主注销
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  机构账户请联系机构管理员注销。管理员会协助确认账户归属与数据处理方式。
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeDeletionFlow}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            )}

            {deletionStep === 'blocked' && (
              <div className="p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-600" />
                </div>
                <h3 id="account-deletion-title" className="text-xl font-semibold text-gray-950">
                  暂时无法注销账户
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  账户中有 1 笔退款正在处理中。请等待退款完成后再试，账户与订阅状态不会受到影响。
                </p>
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">退款单 RF20260728001</p>
                      <p className="mt-1 text-xs text-gray-500">预计 1–3 个工作日内完成</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                      查看订单
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeDeletionFlow}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            )}

            {deletionStep === 'confirm' && (
              <>
                <div className="flex items-start justify-between border-b border-gray-100 px-7 py-6">
                  <div className="pr-6">
                    <h3 id="account-deletion-title" className="text-xl font-semibold text-gray-950">
                      确认注销账户
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-500">此操作不可撤销，请确认以下事项。</p>
                  </div>
                  <button
                    onClick={closeDeletionFlow}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label="关闭"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-[66vh] overflow-y-auto px-7 py-6">
                  <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                      <AlertTriangle className="h-4 w-4" />
                      注销后果
                    </div>
                    <ul className="mt-3 space-y-2.5">
                      {deletionConsequences.map((item) => (
                        <li key={item} className="flex gap-2.5 text-xs leading-5 text-gray-700">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-red-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-700" />
                      <h4 className="text-sm font-semibold text-gray-900">验证身份</h4>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      为确保是您本人操作，验证码将发送至注册邮箱。
                    </p>

                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="flex-1 text-sm text-gray-700">z***@gmail.com</span>
                      <button
                        onClick={sendVerificationCode}
                        disabled={countdown > 0}
                        className="text-xs font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        {countdown > 0 ? `${countdown}s 后重新发送` : verificationState === 'idle' ? '发送验证码' : '重新发送'}
                      </button>
                    </div>

                    <div className="mt-3">
                      <input
                        value={verificationCode}
                        onChange={(event) => updateVerificationCode(event.target.value)}
                        disabled={verificationState === 'idle'}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="请输入 6 位验证码"
                        aria-label="验证码"
                        className={`w-full rounded-lg border px-4 py-3 text-sm tracking-[0.22em] outline-none transition ${
                          verificationState === 'invalid'
                            ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                            : verificationState === 'valid'
                              ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-100'
                              : 'border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        } disabled:cursor-not-allowed disabled:bg-gray-50`}
                      />
                      <div className="mt-2 min-h-5">
                        {verificationState === 'idle' && (
                          <p className="text-xs text-gray-400">请先发送验证码</p>
                        )}
                        {verificationState === 'sent' && (
                          <p className="text-xs text-gray-500">验证码已发送。原型验证码：123456</p>
                        )}
                        {verificationState === 'invalid' && (
                          <p className="text-xs text-red-600">验证码错误或已过期，请检查后重试或重新获取。</p>
                        )}
                        {verificationState === 'valid' && (
                          <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            身份验证已通过
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/70 px-7 py-4">
                  <button
                    onClick={() => {
                      console.info('[analytics] account_deletion_cancelled');
                      closeDeletionFlow();
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmDeletion}
                    disabled={verificationState !== 'valid'}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    注销账户
                  </button>
                </div>
              </>
            )}

            {deletionStep === 'deleting' && (
              <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
                <h3 id="account-deletion-title" className="mt-5 text-lg font-semibold text-gray-950">
                  正在注销账户
                </h3>
                <p className="mt-2 text-sm text-gray-500">请不要关闭页面或重复提交。</p>
              </div>
            )}

            {deletionStep === 'success' && (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 id="account-deletion-title" className="mt-5 text-xl font-semibold text-gray-950">
                  账户已注销
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
                  当前及其他设备的登录会话已失效，自动续费订阅已取消，历史分享链接已停止访问。
                </p>
                <button
                  onClick={onFinish}
                  className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
                >
                  完成
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
