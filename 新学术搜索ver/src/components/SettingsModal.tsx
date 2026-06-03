import React, { useState } from 'react';
import { X, User, CreditCard, Settings, ChevronRight, Crown, FileText } from 'lucide-react';
import { isValidEmail } from '../utils/email';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'basic' | 'membership' | 'payment' | 'account';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('membership');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar */}
        <div className="w-56 bg-gray-50 border-r border-gray-200 p-5 flex flex-col">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-6 pb-5 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-2.5">
              <span className="text-white font-bold text-lg">张</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">张涛</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Basic Information</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'membership'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Membership</span>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'payment'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">My Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'basic' && <BasicInformation />}
            {activeTab === 'membership' && <MembershipPayment />}
            {activeTab === 'payment' && <PaymentTab />}
            {activeTab === 'account' && <AccountSettings />}
          </div>
        </div>
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

  const handleSave = () => {
    if (!isValidEmail(email)) {
      setEmailError('请输入有效的邮箱地址');
      return;
    }

    setEmailError('');
    console.log('Saving profile', { name, email: email.trim(), organization, researchField });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h3>
        
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                const nextEmail = event.target.value;
                setEmail(nextEmail);
                if (!nextEmail.trim() || isValidEmail(nextEmail)) {
                  setEmailError('');
                }
              }}
              onBlur={() => {
                if (email.trim() && !isValidEmail(email)) {
                  setEmailError('请输入有效的邮箱地址');
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent ${
                emailError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">机构</label>
            <input
              type="text"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              placeholder="输入您的机构名称"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Research Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">研究领域</label>
            <input
              type="text"
              value={researchField}
              onChange={(event) => setResearchField(event.target.value)}
              placeholder="输入您的研究领域"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Membership & Payment Tab
function MembershipPayment() {
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
    <div className="p-6">
      <div className="max-w-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-4">My Subscriptions</h3>
        
        {/* Current Plan */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Pro - Monthly</p>
            </div>
            <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors">
              Upgrade to Yearly
            </button>
          </div>
        </div>

        {/* Usage */}
        <button 
          onClick={() => setShowUsage(true)}
          className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Usage（按天额度消耗情况）</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {dailyUsage.slice(0, 3).map((day) => (
              <div key={day.date} className="rounded-md bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-500">{day.label}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{day.used} Credits</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{day.featureCount} 个功能</p>
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
    { id: '1', date: '2026年3月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '2', date: '2026年2月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '3', date: '2026年1月15日', type: 'Credits 充值', amount: '¥30.00', status: 'paid' as const },
    { id: '4', date: '2025年12月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '5', date: '2025年11月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '6', date: '2025年10月20日', type: 'Credits 充值', amount: '¥50.00', status: 'paid' as const },
  ];

  const visibleOrders = orderHistory.slice(0, visibleCount);
  const hasMore = visibleCount < orderHistory.length;

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        {/* Invoice Button */}
        <button className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <span className="text-sm text-gray-900">发票管理</span>
              <p className="text-xs text-gray-500 mt-0.5">查看和下载发票</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {/* Order History */}
        <div>
          <div className="mb-4">
            <h3 className="text-gray-900">订单历史</h3>
            <p className="text-sm text-gray-500 mt-0.5">管理账单信息和查看收据</p>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <span className="text-xs text-gray-500">日期</span>
              <span className="text-xs text-gray-500">类型</span>
              <span className="text-xs text-gray-500 w-20 text-right">金额</span>
            </div>

            {/* Table Rows */}
            {visibleOrders.map((order, index) => (
              <div
                key={order.id}
                className={`grid grid-cols-[1fr_1fr_auto] gap-4 items-center px-4 py-3 transition-colors hover:bg-gray-50 ${
                  index !== visibleOrders.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-sm text-gray-900">{order.date}</span>
                <span className="text-sm text-gray-900">{order.type}</span>
                <span className="w-20 text-right text-sm text-gray-900">{order.amount || '—'}</span>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              加载更多
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Account Settings Tab
function AccountSettings() {
  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">账户设置</h3>
        
        <div className="space-y-6">
          {/* Change Password */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">修改密码</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">语言偏好</h4>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
              <option value="zh">简体中文</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Notification Settings */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">通知设置</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收产品更新通知</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收账单提醒</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收营销邮件</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-4">危险操作</h4>
            <button className="px-5 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200">
              删除账户
            </button>
            <p className="text-xs text-gray-500 mt-2">删除账户后，所有数据将被永久清除且无法恢复</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
