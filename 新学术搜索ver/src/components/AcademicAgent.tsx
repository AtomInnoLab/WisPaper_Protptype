import React, { useEffect, useState } from "react";
import {
  ArrowUp,
  Ban,
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
  Minus,
  Moon,
  MoreHorizontal,
  Orbit,
  Paperclip,
  PanelRight,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Share2,
  SkipForward,
  Sparkles,
  TriangleAlert,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type WorkbenchTab = "files" | "search" | "plan" | "gpu";
type AgentTierId = "fast" | "balanced" | "primary" | "deep";
type AgentTodoStatus = "pending" | "active" | "waiting" | "blocked" | "done" | "skipped" | "failed";
type AgentTodoType = "agent" | "approval" | "user";

type GpuModelId = "rtx-4090" | "rtx-5090" | "rtx-pro-6000" | "a800" | "rtx-4080";

const gpuModels: Array<{ id: GpuModelId; name: string; memory: string; stock: number }> = [
  { id: "rtx-4090", name: "RTX 4090", memory: "48 GB", stock: 7 },
  { id: "rtx-5090", name: "RTX 5090", memory: "32 GB", stock: 4 },
  { id: "rtx-pro-6000", name: "RTX PRO 6000", memory: "96 GB", stock: 37 },
  { id: "a800", name: "A800 NVLink", memory: "80 GB", stock: 33 },
  { id: "rtx-4080", name: "RTX 4080 Super", memory: "16 GB", stock: 1 },
];

interface AgentTodo {
  id: string;
  title: string;
  detail: string;
  type: AgentTodoType;
  status: AgentTodoStatus;
}

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

const initialAgentTodos: AgentTodo[] = [
  {
    id: "scope",
    title: "明确问题与检索范围",
    detail: "确认研究对象、时间范围与核心概念。",
    type: "agent",
    status: "pending",
  },
  {
    id: "search",
    title: "检索并筛选相关论文",
    detail: "搜索高相关文献，并按主题与证据质量完成初筛。",
    type: "agent",
    status: "pending",
  },
  {
    id: "criteria",
    title: "确认论文纳入标准",
    detail: "需要你确认是否只纳入近五年的英文全文论文。",
    type: "approval",
    status: "pending",
  },
  {
    id: "evidence",
    title: "建立证据表与方法分类",
    detail: "提取方法、数据、指标与主要结论，形成结构化证据表。",
    type: "agent",
    status: "pending",
  },
  {
    id: "output",
    title: "提炼研究空白并输出方案",
    detail: "综合证据与冲突，输出可继续推进的研究计划。",
    type: "agent",
    status: "pending",
  },
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

function GpuConfigPanel() {
  const [selectedGpu, setSelectedGpu] = useState<GpuModelId>("rtx-4090");
  const [region, setRegion] = useState("新加坡 A");
  const [imageVersion, setImageVersion] = useState("PyTorch 2.8 · CUDA 12.8 · Ubuntu 24.04");
  const [quantity, setQuantity] = useState(1);
  const [launchState, setLaunchState] = useState<"idle" | "launching" | "ready">("idle");

  const selectedModel = gpuModels.find((model) => model.id === selectedGpu) ?? gpuModels[0];
  const updateQuantity = (next: number) => setQuantity(Math.min(selectedModel.stock, Math.max(1, next)));

  const launchInstance = () => {
    if (launchState !== "idle") return;
    setLaunchState("launching");
    window.setTimeout(() => setLaunchState("ready"), 1200);
  };

  return (
    <section className="flex min-h-full flex-col">
      <div className="flex-1 px-1 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em]">GPU 配置</h3>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${launchState === "ready" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
            {launchState === "ready" ? "运行中" : "按需启动"}
          </span>
        </div>

        {launchState === "ready" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Check className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">GPU 实例已启动</p>
                <p className="mt-0.5 text-xs text-slate-500">环境已连接到当前 Agent 会话</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white/80 p-3">
                <dt className="text-slate-400">GPU</dt>
                <dd className="mt-1 font-medium text-slate-800">{quantity} × {selectedModel.name}</dd>
              </div>
              <div className="rounded-xl bg-white/80 p-3">
                <dt className="text-slate-400">区域</dt>
                <dd className="mt-1 font-medium text-slate-800">{region}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setLaunchState("idle")}
              className="mt-4 w-full rounded-xl border border-emerald-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-slate-950"
            >
              重新配置
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <div className="mb-2.5 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600">GPU 型号</label>
                <span className="text-[11px] text-slate-400">选择适合任务的计算资源</span>
              </div>
              <div className="space-y-2">
                {gpuModels.map((model) => {
                  const selected = selectedGpu === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedGpu(model.id);
                        setQuantity((value) => Math.min(value, model.stock));
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition active:scale-[0.995] ${
                        selected
                          ? "border-slate-950 bg-slate-950 text-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.8)]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        <span className="text-sm font-semibold">{model.name}</span>
                        <span className={`ml-2 text-xs ${selected ? "text-white/55" : "text-slate-400"}`}>{model.memory}</span>
                      </span>
                      <span className={`text-xs font-medium ${selected ? "text-white/65" : model.stock <= 1 ? "text-amber-600" : "text-emerald-600"}`}>
                        库存 {model.stock}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">区域</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="mt-2 h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option>新加坡 A</option>
                  <option>中国香港 A</option>
                  <option>美国西部 A</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">实例数量</span>
                <span className="mt-2 flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-1.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:text-slate-200"
                    aria-label="减少实例数量"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= selectedModel.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:text-slate-200"
                    aria-label="增加实例数量"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </span>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-semibold text-slate-600">镜像版本</span>
              <select
                value={imageVersion}
                onChange={(event) => setImageVersion(event.target.value)}
                className="mt-2 h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option>PyTorch 2.8 · CUDA 12.8 · Ubuntu 24.04</option>
                <option>PyTorch 2.6 · CUDA 12.4 · Ubuntu 22.04</option>
                <option>TensorFlow 2.18 · CUDA 12.5 · Ubuntu 22.04</option>
              </select>
            </label>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">本次配置</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{quantity} × {selectedModel.name} · {region}</p>
                </div>
                <Cpu className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">确认后系统将自动开机，并把 GPU 环境连接到当前 Agent 会话。</p>
            </div>
          </>
        )}
      </div>

      {launchState !== "ready" && (
        <div className="sticky bottom-0 border-t border-slate-200 bg-[#f7f9fc]/95 px-1 pb-1 pt-4 backdrop-blur">
          <button
            type="button"
            onClick={launchInstance}
            disabled={launchState === "launching"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:bg-slate-500"
          >
            {launchState === "launching" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Cpu className="h-4 w-4" />}
            {launchState === "launching" ? "正在启动环境" : "确认并启动"}
          </button>
        </div>
      )}
    </section>
  );
}

function WorkbenchPanel({
  activeTab,
  running,
  planReady,
  planAccepted,
  todos,
  onAcceptPlan,
  onToggleRunning,
  onTodoStatusChange,
  onAddTodo,
}: {
  activeTab: WorkbenchTab;
  running: boolean;
  planReady: boolean;
  planAccepted: boolean;
  todos: AgentTodo[];
  onAcceptPlan: () => void;
  onToggleRunning: () => void;
  onTodoStatusChange: (id: string, status: AgentTodoStatus) => void;
  onAddTodo: (title: string) => void;
}) {
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
  const [menuTodoId, setMenuTodoId] = useState<string | null>(null);
  const [addingTodo, setAddingTodo] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const completedCount = todos.filter((todo) => todo.status === "done" || todo.status === "skipped").length;
  const attentionCount = todos.filter((todo) => todo.status === "waiting" || todo.status === "blocked" || todo.status === "failed").length;

  const statusMeta: Record<AgentTodoStatus, { label: string; icon: React.ElementType; color: string }> = {
    pending: { label: "待执行", icon: Clock3, color: "text-slate-400" },
    active: { label: running ? "进行中" : "已暂停", icon: running ? LoaderCircle : Pause, color: "text-blue-600" },
    waiting: { label: "等待确认", icon: CircleGauge, color: "text-amber-600" },
    blocked: { label: "已阻塞", icon: Ban, color: "text-amber-700" },
    done: { label: "已完成", icon: CheckCircle2, color: "text-emerald-600" },
    skipped: { label: "已跳过", icon: SkipForward, color: "text-slate-400" },
    failed: { label: "执行失败", icon: TriangleAlert, color: "text-red-600" },
  };

  const submitNewTodo = () => {
    const title = newTodoTitle.trim();
    if (!title) return;
    onAddTodo(title);
    setNewTodoTitle("");
    setAddingTodo(false);
  };

  return (
    <div className="h-full overflow-y-auto p-5">
      {activeTab === "plan" && (
        <section>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Agent 工作台</p>
              <h3 className="mt-1 text-base font-semibold">执行计划</h3>
            </div>
            {planAccepted && completedCount < todos.length && attentionCount === 0 && (
              <button
                type="button"
                onClick={onToggleRunning}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 active:scale-[0.98]"
              >
                {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {running ? "暂停" : "继续"}
              </button>
            )}
          </div>

          {!planReady ? (
            <div className="mt-6 space-y-3" aria-label="正在生成执行计划">
              {[88, 72, 80, 64].map((width, index) => (
                <div key={width} className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-3.5">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 animate-pulse rounded-full bg-slate-200" style={{ width: `${width}%`, animationDelay: `${index * 80}ms` }} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mt-5 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{completedCount}/{todos.length} 已完成</span>
                  {attentionCount > 0 ? (
                    <span className="text-amber-700">{attentionCount} 项需要处理</span>
                  ) : (
                    <span className="text-slate-400">计划已同步</span>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {todos.map((todo, index) => {
                  const meta = statusMeta[todo.status];
                  const StatusIcon = meta.icon;
                  const expanded = expandedTodoId === todo.id;
                  const menuOpen = menuTodoId === todo.id;
                  const muted = todo.status === "done" || todo.status === "skipped";

                  return (
                    <article
                      key={todo.id}
                      className={`relative rounded-xl border transition ${
                        todo.status === "active"
                          ? "border-blue-200 bg-blue-50/75"
                          : todo.status === "waiting" || todo.status === "blocked"
                            ? "border-amber-200 bg-amber-50/70"
                            : todo.status === "failed"
                              ? "border-red-200 bg-red-50/70"
                              : "border-transparent bg-white/60 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3 px-3 py-3">
                        <button
                          type="button"
                          onClick={() => setExpandedTodoId(expanded ? null : todo.id)}
                          className="flex min-w-0 flex-1 items-start gap-3 text-left"
                          aria-expanded={expanded}
                        >
                          <StatusIcon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.color} ${todo.status === "active" && running ? "animate-spin" : ""}`} />
                          <span className="min-w-0 flex-1">
                            <span className={`block text-sm font-medium leading-5 ${muted ? "text-slate-400 line-through" : "text-slate-800"}`}>
                              {index + 1}. {todo.title}
                            </span>
                            <span className={`mt-1 block text-[11px] ${meta.color}`}>{meta.label}</span>
                          </span>
                          <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
                        </button>
                        {todo.status !== "done" && todo.status !== "skipped" && (
                          <button
                            type="button"
                            onClick={() => setMenuTodoId(menuOpen ? null : todo.id)}
                            className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                            aria-label={`管理 ${todo.title}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {expanded && (
                        <div className="border-t border-slate-200/70 px-10 pb-3 pt-2.5">
                          <p className="text-xs leading-5 text-slate-500">{todo.detail}</p>
                          <p className="mt-2 text-[10px] text-slate-400">
                            {todo.type === "approval" ? "需要用户确认" : todo.type === "user" ? "由你完成" : "由 Agent 执行"}
                          </p>
                        </div>
                      )}

                      {menuOpen && (
                        <div className="absolute right-2 top-11 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 text-xs shadow-[0_18px_42px_-22px_rgba(15,23,42,0.42)]">
                          {todo.status === "active" && (
                            <>
                              <button onClick={() => { onTodoStatusChange(todo.id, "done"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                                <CheckCircle2 className="h-3.5 w-3.5" />标记完成
                              </button>
                              <button onClick={() => { onTodoStatusChange(todo.id, "blocked"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                                <Ban className="h-3.5 w-3.5" />设为阻塞
                              </button>
                            </>
                          )}
                          {todo.status === "waiting" && (
                            <button onClick={() => { onTodoStatusChange(todo.id, "done"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                              <Check className="h-3.5 w-3.5" />确认并继续
                            </button>
                          )}
                          {(todo.status === "blocked" || todo.status === "failed") && (
                            <button onClick={() => { onTodoStatusChange(todo.id, "active"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                              <RotateCcw className="h-3.5 w-3.5" />重试
                            </button>
                          )}
                          {todo.status === "pending" && (
                            <button onClick={() => { onTodoStatusChange(todo.id, todo.type === "approval" ? "waiting" : "active"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                              <Play className="h-3.5 w-3.5" />设为下一项
                            </button>
                          )}
                          <button onClick={() => { onTodoStatusChange(todo.id, "skipped"); setMenuTodoId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-500 hover:bg-slate-50">
                            <SkipForward className="h-3.5 w-3.5" />跳过
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {addingTodo ? (
                <div className="mt-3 rounded-xl border border-blue-200 bg-white p-2.5">
                  <input
                    autoFocus
                    value={newTodoTitle}
                    onChange={(event) => setNewTodoTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") submitNewTodo();
                      if (event.key === "Escape") setAddingTodo(false);
                    }}
                    placeholder="输入新的执行步骤"
                    className="w-full bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
                  />
                  <div className="mt-2 flex justify-end gap-1.5">
                    <button onClick={() => setAddingTodo(false)} className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50">取消</button>
                    <button onClick={submitNewTodo} disabled={!newTodoTitle.trim()} className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white disabled:bg-slate-200">添加</button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingTodo(true)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/50 py-2.5 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:bg-white hover:text-slate-800"
                >
                  <Plus className="h-3.5 w-3.5" />添加步骤
                </button>
              )}

              {!planAccepted && (
                <div className="mt-4 rounded-2xl bg-slate-950 p-3.5 text-white">
                  <p className="text-xs font-medium">确认后 Agent 将按此计划执行</p>
                  <p className="mt-1 text-[11px] leading-5 text-white/55">开始前可以调整步骤，执行中仍可暂停或处理阻塞项。</p>
                  <button
                    type="button"
                    onClick={onAcceptPlan}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50 active:scale-[0.98]"
                  >
                    <Play className="h-4 w-4" />确认并开始
                  </button>
                </div>
              )}
            </>
          )}
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
        <GpuConfigPanel />
      )}
    </div>
  );
}

export function AcademicAgent({ onOpenProjects }: { onOpenProjects: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [planAccepted, setPlanAccepted] = useState(false);
  const [todos, setTodos] = useState<AgentTodo[]>(initialAgentTodos);
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("plan");
  const [panelOpen, setPanelOpen] = useState(true);
  const [taskTitle, setTaskTitle] = useState("新研究任务");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentTierId>("balanced");
  const taskCompleted = planAccepted && todos.every((todo) => todo.status === "done" || todo.status === "skipped");
  const taskNeedsAttention = planAccepted && todos.some((todo) => todo.status === "waiting" || todo.status === "blocked" || todo.status === "failed");

  useEffect(() => {
    if (!planAccepted) return;
    const waitingForUser = todos.some((todo) => todo.status === "waiting" || todo.status === "blocked" || todo.status === "failed");
    const hasActiveTodo = todos.some((todo) => todo.status === "active");
    if (taskCompleted || (waitingForUser && !hasActiveTodo)) setRunning(false);
  }, [planAccepted, taskCompleted, todos]);

  const submit = (text = prompt) => {
    const value = text.trim();
    if (!value || running) return;
    const startingTask = !started;
    if (startingTask) {
      setTaskTitle(value.length > 32 ? `${value.slice(0, 32)}…` : value);
      setPlanReady(false);
      setPlanAccepted(false);
      setTodos(initialAgentTodos.map((todo) => ({ ...todo })));
    }
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
          text: startingTask
            ? "任务已拆解为 5 个步骤。你可以在右侧调整执行计划，确认后我会开始检索与分析。"
            : "已收到补充说明。我会基于当前计划继续处理，并在需要改变执行范围时请你确认。",
        },
      ]);
      if (startingTask) {
        setPlanReady(true);
        setRunning(false);
      } else {
        setRunning(false);
      }
    }, 900);
  };

  const activateNextTodo = (items: AgentTodo[], afterId?: string) => {
    const startIndex = afterId ? items.findIndex((todo) => todo.id === afterId) + 1 : 0;
    const nextIndex = items.findIndex((todo, index) => index >= Math.max(startIndex, 0) && todo.status === "pending");
    if (nextIndex < 0) return items;
    return items.map((todo, index) =>
      index === nextIndex
        ? { ...todo, status: todo.type === "approval" ? "waiting" : "active" }
        : todo,
    );
  };

  const handleAcceptPlan = () => {
    setPlanAccepted(true);
    setRunning(true);
    setTodos((items) => activateNextTodo(items));
    setMessages((items) => [...items, { role: "agent", text: "计划已确认。我会从明确检索范围开始，并持续更新右侧 Todo List。" }]);
  };

  const handleTodoStatusChange = (id: string, status: AgentTodoStatus) => {
    setTodos((items) => {
      let nextItems = items.map((todo) => {
        if (todo.id === id) return { ...todo, status };
        if (status === "active" && todo.status === "active") return { ...todo, status: "pending" as AgentTodoStatus };
        return todo;
      });

      if (status === "done" || status === "skipped") {
        nextItems = activateNextTodo(nextItems, id);
      }
      return nextItems;
    });
    if (status === "blocked" || status === "failed") setRunning(false);
    if (status === "active" || status === "done") setRunning(true);
  };

  const handleAddTodo = (title: string) => {
    setTodos((items) => [
      ...items,
      {
        id: `custom-${Date.now()}`,
        title,
        detail: "由用户补充的执行步骤，Agent 将在执行前检查依赖关系。",
        type: "user",
        status: "pending",
      },
    ]);
  };

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
              <span className={`h-2 w-2 rounded-full ${taskCompleted ? "bg-blue-500" : taskNeedsAttention ? "bg-amber-500" : running ? "bg-emerald-500" : "bg-slate-400"}`} />
              {!planReady ? "制定计划" : !planAccepted ? "待确认" : taskCompleted ? "已完成" : taskNeedsAttention ? "等待确认" : running ? "进行中" : "已暂停"}
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
              {running && !planReady && (
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
        <aside className={`hidden shrink-0 border-l border-slate-200 bg-[#f7f9fc] lg:block ${activeTab === "gpu" ? "w-[520px] xl:w-[600px]" : "w-[360px]"}`}>
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
            <WorkbenchPanel
              activeTab={activeTab}
              running={running}
              planReady={planReady}
              planAccepted={planAccepted}
              todos={todos}
              onAcceptPlan={handleAcceptPlan}
              onToggleRunning={() => setRunning((value) => !value)}
              onTodoStatusChange={handleTodoStatusChange}
              onAddTodo={handleAddTodo}
            />
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
