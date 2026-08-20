import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  Clock3,
  Code2,
  Cpu,
  FileText,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Image,
  Library,
  LoaderCircle,
  MessageSquareText,
  Moon,
  MoreHorizontal,
  Orbit,
  Paperclip,
  PanelRight,
  Plus,
  Search,
  Share2,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type WorkbenchTab = "files" | "search" | "plan" | "gpu";
type AgentTierId = "fast" | "balanced" | "primary" | "deep";

const agentTiers: {
  id: AgentTierId;
  label: string;
  description: string;
  multiplier: string | null;
  icon: React.ElementType;
}[] = [
  { id: "fast", label: "Fast", description: "快速响应", multiplier: null, icon: Zap },
  { id: "balanced", label: "Balanced", description: "速度与深度平衡", multiplier: "1.35x", icon: CircleGauge },
  { id: "primary", label: "Primary", description: "复杂研究任务", multiplier: "2.00x", icon: WandSparkles },
  { id: "deep", label: "Deep", description: "长程深度研究", multiplier: "3.50x", icon: Orbit },
];

const quickTasks = [
  {
    title: "灵感发现",
    prompt: "围绕多模态 Agent 的长期记忆，帮我发现 3 个有研究价值的选题。",
    icon: Sparkles,
  },
  {
    title: "论文复现",
    prompt: "帮我制定一份论文复现计划，并列出环境、数据集和验收指标。",
    icon: Code2,
  },
  {
    title: "文献综述",
    prompt: "调研 RAG 评测方法，按数据、指标与常见缺陷整理一份综述。",
    icon: BookOpen,
  },
  {
    title: "论文解析",
    prompt: "解析我上传的论文，提取核心假设、方法流程和实验结论。",
    icon: FileText,
  },
];

const moreTools = [
  { label: "配置 GPU", icon: Cpu },
  { label: "论文主图", icon: Image },
  { label: "论文评审", icon: MessageSquareText },
  { label: "Idea 升华", icon: WandSparkles },
  { label: "LaTeX 写作", icon: FileText },
  { label: "实验设计", icon: FlaskConical },
  { label: "Library 管理", icon: Library },
];

const tabs: { id: WorkbenchTab; label: string; icon: React.ElementType }[] = [
  { id: "plan", label: "执行计划", icon: Sparkles },
  { id: "files", label: "任务文件", icon: FolderKanban },
  { id: "search", label: "检索结果", icon: Search },
  { id: "gpu", label: "运行环境", icon: Cpu },
];

function AgentComposer({
  prompt,
  setPrompt,
  onSubmit,
  selectedAgent,
  onAgentChange,
  disabled = false,
  compact = false,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  selectedAgent: AgentTierId;
  onAgentChange: (value: AgentTierId) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [showTools, setShowTools] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const currentAgent = agentTiers.find((tier) => tier.id === selectedAgent) ?? agentTiers[1];
  const CurrentAgentIcon = currentAgent.icon;

  return (
    <div className="relative">
      {(showTools || showMore) && (
        <div className="absolute bottom-[calc(100%+12px)] left-0 z-30 flex items-end gap-2">
          {showTools && (
            <div className="w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.42)]">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100">
                <Paperclip className="h-4 w-4 text-slate-500" />
                上传附件
              </button>
              <div className="my-1 border-t border-slate-100" />
              {quickTasks.slice(0, 3).map((task) => {
                const Icon = task.icon;
                return (
                  <button
                    key={task.title}
                    onClick={() => {
                      setPrompt(task.prompt);
                      setShowTools(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    {task.title}
                  </button>
                );
              })}
              <button
                onClick={() => setShowMore((value) => !value)}
                className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  showMore ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                更多
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
            </div>
          )}
          {showMore && (
            <div className="w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.42)]">
              {moreTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.label}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    {tool.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showAgents && (
        <div className="absolute bottom-[calc(100%+12px)] left-11 z-40 w-[300px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.42)]">
          {agentTiers.map((tier) => {
            const Icon = tier.icon;
            const active = tier.id === selectedAgent;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => {
                  onAgentChange(tier.id);
                  setShowAgents(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
                aria-pressed={active}
                aria-label={`${tier.label} ${tier.description}${tier.multiplier ? ` ${tier.multiplier}` : ""}`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-slate-950" : "text-slate-500"}`} />
                <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{tier.label}</p>
                {tier.multiplier && (
                  <span className="tabular-nums text-xs text-slate-500">{tier.multiplier}</span>
                )}
                {active && <Check className="h-4 w-4 shrink-0 text-emerald-500" />}
              </button>
            );
          })}
          <div className="mx-3 mt-1 border-t border-slate-100" />
          <p className="px-3 pb-1 pt-2 text-[10px] leading-4 text-slate-400">倍率代表 Credits 消耗系数</p>
        </div>
      )}

      <div
        className={`rounded-[22px] border border-slate-200 bg-white text-left shadow-[0_18px_55px_-30px_rgba(15,23,42,0.38)] transition focus-within:border-slate-300 focus-within:shadow-[0_22px_65px_-28px_rgba(15,23,42,0.44)] ${
          compact ? "p-2.5" : "p-3.5"
        }`}
      >
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="描述你的研究目标，或输入 / 选择工具"
          className={`w-full resize-none bg-transparent px-2 text-[15px] leading-6 text-slate-900 outline-none placeholder:text-slate-400 ${
            compact ? "h-16 py-1.5" : "h-28 py-2"
          }`}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowTools((value) => !value);
                if (showTools) setShowMore(false);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition active:scale-95 ${
                showTools
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              aria-label="添加附件或选择工具"
              aria-expanded={showTools}
            >
              <Plus className={`h-5 w-5 transition-transform ${showTools ? "rotate-45" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAgents((value) => !value);
                setShowTools(false);
                setShowMore(false);
              }}
              className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition active:scale-[0.98] ${
                showAgents
                  ? "border-slate-300 bg-slate-100 text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
              aria-label="切换 Agent"
              aria-expanded={showAgents}
            >
              <CurrentAgentIcon className="h-4 w-4" />
              {currentAgent.label}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAgents ? "rotate-180" : ""}`} />
            </button>
            {!compact && (
              <>
                <button
                  type="button"
                  onClick={() => setPrompt("调研一个研究问题，并生成可执行的研究计划。")}
                  className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
                >
                  <GraduationCap className="h-4 w-4" />
                  研究计划
                </button>
                <button
                  type="button"
                  onClick={() => setPrompt("基于我上传的论文，生成结构化的实验复现方案。")}
                  className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
                >
                  <Code2 className="h-4 w-4" />
                  论文复现
                </button>
              </>
            )}
          </div>
          <button
            onClick={onSubmit}
            disabled={!prompt.trim() || disabled}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200"
            aria-label="发送"
          >
            {disabled ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkbenchPanel({ activeTab, running }: { activeTab: WorkbenchTab; running: boolean }) {
  return (
    <div className="h-full overflow-y-auto p-5">
      {activeTab === "plan" && (
        <section>
          <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
          <h3 className="mt-1 text-base font-semibold">执行计划</h3>
          <div className="mt-5 space-y-1">
            {[
              ["明确问题与检索范围", "done"],
              ["检索并筛选相关论文", running ? "active" : "done"],
              ["建立证据表与方法分类", running ? "pending" : "active"],
              ["提炼研究空白并输出方案", "pending"],
            ].map(([label, status], index) => (
              <div key={label} className="flex gap-3 rounded-xl px-2 py-3 transition hover:bg-white">
                {status === "done" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                ) : status === "active" ? (
                  <LoaderCircle className="mt-0.5 h-4 w-4 animate-spin text-slate-900" />
                ) : (
                  <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-800">{index + 1}. {label}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {status === "done" ? "已完成" : status === "active" ? "进行中" : "等待执行"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {activeTab === "files" && (
        <section>
          <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
          <h3 className="mt-1 text-base font-semibold">任务文件</h3>
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center">
            <FileText className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-3 text-sm font-medium">产物将在这里生成</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">支持 PDF、Markdown、代码和数据文件</p>
          </div>
        </section>
      )}
      {activeTab === "search" && (
        <section>
          <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
          <h3 className="mt-1 text-base font-semibold">检索结果</h3>
          <p className="mt-2 text-xs text-slate-500">已找到 24 篇高相关论文</p>
          <div className="mt-4 space-y-3">
            {[
              "MemoryBank: Enhancing Large Language Models with Long-Term Memory",
              "Generative Agents: Interactive Simulacra of Human Behavior",
              "A Survey on the Memory Mechanism of LLM-based Agents",
            ].map((paper) => (
              <article key={paper} className="rounded-xl bg-white p-3.5 ring-1 ring-slate-200">
                <p className="text-sm font-medium leading-5">{paper}</p>
                <p className="mt-2 text-xs text-slate-500">高相关 · 2024</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {activeTab === "gpu" && (
        <section>
          <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
          <h3 className="mt-1 text-base font-semibold">运行环境</h3>
          <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">GPU 实例</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">未配置</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">需要训练或复现实验时，Agent 会请求创建运行环境。</p>
            <button className="mt-4 w-full rounded-xl bg-slate-950 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]">
              配置 GPU
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export function AcademicAgent({ onOpenProjects, initialPrompt = "" }: { onOpenProjects: () => void; initialPrompt?: string }) {
  const [prompt, setPrompt] = useState("");
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("plan");
  const [panelOpen, setPanelOpen] = useState(true);
  const [taskTitle, setTaskTitle] = useState("新研究任务");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentTierId>("balanced");

  const submit = (text = prompt) => {
    const value = text.trim();
    if (!value || running) return;
    if (!started) setTaskTitle(value.length > 32 ? `${value.slice(0, 32)}…` : value);
    setStarted(true);
    setPrompt("");
    setRunning(true);
    setActiveTab("plan");
    setMessages((items) => [...items, { role: "user", text: value }]);
    window.setTimeout(() => {
      setMessages((items) => [
        ...items,
        {
          role: "agent",
          text: "任务已拆解。我会先检索高相关文献并建立证据表，再对研究空白进行交叉验证，最后输出可直接推进的研究计划。",
        },
      ]);
      setRunning(false);
    }, 900);
  };

  useEffect(() => {
    if (initialPrompt.trim()) submit(initialPrompt);
  }, [initialPrompt]);

  if (!started) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f7f9fc] text-slate-950">
        <header className="flex h-16 shrink-0 items-center justify-between px-7">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Bot className="h-4 w-4" />
            </span>
            学术 Agent
          </div>
          <button
            onClick={onOpenProjects}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            <FolderKanban className="h-4 w-4" />
            研究项目
          </button>
        </header>

        <main className="flex flex-1 items-center overflow-y-auto px-6 pb-14">
          <div className="mx-auto w-full max-w-4xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-medium text-slate-500">从一个研究问题开始</p>
              <h1 className="mt-3 text-[42px] font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950">
                今天想推进哪项研究？
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-500">
                描述目标，Agent 会拆解步骤、调用研究工具，并把论文、计划与实验产物集中保存。
              </p>
              <div className="mt-9">
                <AgentComposer
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmit={() => submit()}
                  selectedAgent={selectedAgent}
                  onAgentChange={setSelectedAgent}
                />
              </div>
            </div>

            <section className="mx-auto mt-8 max-w-3xl">
              <div className="flex flex-wrap justify-center gap-2.5">
                {quickTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <button
                      key={task.title}
                      onClick={() => submit(task.prompt)}
                      className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3.5 py-2.5 text-sm text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-sm active:translate-y-0"
                    >
                      <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-slate-700" />
                      {task.title}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-w-0 flex-1 bg-[#f7f9fc] text-slate-950">
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <h1 className="min-w-0 truncate pr-6 text-[15px] font-semibold">{taskTitle}</h1>
          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <span className={`h-2 w-2 rounded-full ${running ? "bg-emerald-500" : "bg-slate-400"}`} />
              {running ? "进行中" : "可继续"}
            </span>
            <span className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:inline-flex">
              <GraduationCap className="h-3.5 w-3.5" />
              1,250
            </span>
            <span className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 md:inline-flex">
              <Moon className="h-3.5 w-3.5" />
              1h
            </span>
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-950" aria-label="分享任务">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-950" aria-label="更多操作">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 pb-48 pt-9">
            <div className="mx-auto max-w-3xl space-y-7">
              {messages.map((message, index) => (
                <article key={index} className={message.role === "user" ? "flex justify-end" : ""}>
                  {message.role === "user" ? (
                    <div className="max-w-[78%] rounded-[18px] rounded-tr-md bg-[#e6f1ff] px-4 py-3 text-sm leading-6 text-slate-800">
                      {message.text}
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white">
                          <Bot className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm font-semibold">切问学术</span>
                        <span className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">
                          {agentTiers.find((tier) => tier.id === selectedAgent)?.label}
                        </span>
                      </div>
                      <div className="rounded-[18px] rounded-tl-md bg-slate-50 px-5 py-4 text-[15px] leading-7 text-slate-700">
                        {message.text}
                      </div>
                    </div>
                  )}
                </article>
              ))}
              {running && (
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  正在制定研究计划并选择工具…
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white to-transparent px-5 pb-3 pt-14">
            <div className="pointer-events-auto mx-auto max-w-3xl">
              <AgentComposer
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={() => submit()}
                selectedAgent={selectedAgent}
                onAgentChange={setSelectedAgent}
                disabled={running}
                compact
              />
              <p className="mt-2 text-center text-[10px] text-slate-300">内容由 AI 生成，请仔细甄别</p>
            </div>
          </div>
        </section>
      </main>

      {panelOpen && (
        <aside className="hidden w-[310px] shrink-0 border-l border-slate-200 bg-[#f7f9fc] lg:block">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
            <span className="text-sm font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</span>
            <button
              onClick={() => setPanelOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-950"
              aria-label="收起工作台"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%_-_4rem)]">
            <WorkbenchPanel activeTab={activeTab} running={running} />
          </div>
        </aside>
      )}

      <aside className="hidden w-14 shrink-0 flex-col items-center border-l border-slate-200 bg-white py-3 lg:flex">
        <button
          onClick={() => setPanelOpen((value) => !value)}
          className={`mb-4 rounded-xl p-2.5 transition ${
            panelOpen ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          }`}
          aria-label={panelOpen ? "收起工作台" : "展开工作台"}
        >
          <PanelRight className="h-4.5 w-4.5" />
        </button>
        <div className="h-px w-6 bg-slate-100" />
        <nav className="mt-3 flex flex-col gap-2" aria-label="Agent 工具">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = panelOpen && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPanelOpen(true);
                }}
                className={`group relative rounded-xl p-2.5 transition ${
                  active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
                aria-label={tab.label}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
