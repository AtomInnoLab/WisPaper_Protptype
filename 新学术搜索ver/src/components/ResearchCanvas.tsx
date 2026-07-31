import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bot,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  FileText,
  FlaskConical,
  Hand,
  Link2,
  LoaderCircle,
  Maximize2,
  MessageSquareText,
  Minus,
  MoreHorizontal,
  MousePointer2,
  Network,
  Plus,
  Redo2,
  Search,
  Send,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Undo2,
  Users,
  WandSparkles,
  X,
  ZoomIn,
} from "lucide-react";
import collaboratorLin from "../assets/research-canvas/collaborator-lin.webp";
import collaboratorChen from "../assets/research-canvas/collaborator-chen.webp";
import collaboratorZhou from "../assets/research-canvas/collaborator-zhou.webp";

type NodeKind = "hypothesis" | "paper" | "question" | "method" | "experiment" | "finding" | "agent" | "comment";
type InspectorTab = "detail" | "evidence" | "comments" | "ai";
type Tool = "select" | "pan" | "connect" | "node";
type EdgeTone = "slate" | "blue" | "red" | "green" | "orange" | "violet";

type CanvasNode = {
  id: string;
  kind: NodeKind;
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  status?: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  progress?: number;
  author?: string;
};

type CanvasEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  tone: EdgeTone;
  dashed?: boolean;
};

const initialNodes: CanvasNode[] = [
  {
    id: "position-bias",
    kind: "hypothesis",
    eyebrow: "假设",
    title: "位置偏置假设",
    description: "模型更关注开头和结尾，中间信息被相对忽略。",
    status: "弱支持",
    x: 24,
    y: 76,
    width: 196,
    height: 138,
  },
  {
    id: "attention-sink",
    kind: "hypothesis",
    eyebrow: "假设",
    title: "注意力汇聚假设",
    description: "中间内容被少数“注意力汇聚点”吸走。",
    status: "待验证",
    x: 24,
    y: 228,
    width: 196,
    height: 138,
  },
  {
    id: "compression",
    kind: "hypothesis",
    eyebrow: "假设",
    title: "压缩瓶颈假设",
    description: "KV 缓存压缩导致中间信息不可恢复。",
    status: "反驳",
    x: 24,
    y: 380,
    width: 196,
    height: 138,
  },
  {
    id: "question",
    kind: "question",
    eyebrow: "研究问题",
    title: "长上下文模型为何会遗忘中间信息？",
    meta: "更新于 10:24",
    x: 306,
    y: 232,
    width: 240,
    height: 136,
  },
  {
    id: "lost-middle",
    kind: "paper",
    eyebrow: "关键论文",
    title: "Lost in the Middle: How Language Models Use Long Contexts",
    description: "Liu et al., 2023",
    status: "来源于",
    x: 640,
    y: 82,
    width: 224,
    height: 150,
  },
  {
    id: "ruler",
    kind: "paper",
    eyebrow: "关键论文",
    title: "RULER: What’s the Real Context Length of LLMs?",
    description: "Hsieh et al., 2024",
    status: "来源于",
    x: 640,
    y: 250,
    width: 224,
    height: 150,
  },
  {
    id: "ram",
    kind: "method",
    eyebrow: "方法",
    title: "检索增强记忆（RAM）",
    description: "在长上下文中按需检索并注入相关片段。",
    status: "待验证",
    x: 40,
    y: 588,
    width: 210,
    height: 132,
  },
  {
    id: "experiment",
    kind: "experiment",
    eyebrow: "实验",
    title: "64K vs 128K 长上下文对比",
    description: "比较不同位置事实的召回准确率。",
    status: "进行中",
    x: 330,
    y: 690,
    width: 222,
    height: 136,
  },
  {
    id: "finding",
    kind: "finding",
    eyebrow: "发现",
    title: "初步结果",
    description: "中间召回准确率显著低于首尾，128K 降幅更明显。",
    status: "初步",
    x: 646,
    y: 690,
    width: 214,
    height: 136,
  },
  {
    id: "survey-agent",
    kind: "agent",
    eyebrow: "Agent",
    title: "证据筛选 Agent",
    description: "正在交叉验证 12 篇论文并标注证据强度。",
    status: "运行中",
    progress: 68,
    x: 306,
    y: 430,
    width: 246,
    height: 142,
  },
  {
    id: "review-comment",
    kind: "comment",
    eyebrow: "评论",
    title: "是否需要加入 NeedleBench 作为补充基准？",
    description: "建议把长文本检索能力与位置偏置拆开评估。",
    meta: "周同学 · 12 分钟前",
    author: "周同学",
    status: "2 条回复",
    x: 640,
    y: 424,
    width: 232,
    height: 148,
  },
];

const initialEdges: CanvasEdge[] = [
  { id: "e1", from: "position-bias", to: "question", label: "支持", tone: "blue" },
  { id: "e2", from: "attention-sink", to: "question", label: "待验证", tone: "slate", dashed: true },
  { id: "e3", from: "compression", to: "question", label: "反驳", tone: "red", dashed: true },
  { id: "e4", from: "question", to: "lost-middle", label: "来源于", tone: "blue" },
  { id: "e5", from: "question", to: "ruler", label: "来源于", tone: "blue" },
  { id: "e6", from: "ram", to: "experiment", label: "待验证", tone: "slate", dashed: true },
  { id: "e7", from: "experiment", to: "finding", label: "产生", tone: "orange" },
  { id: "e8", from: "ruler", to: "finding", label: "支持", tone: "green" },
  { id: "e9", from: "question", to: "survey-agent", label: "委派", tone: "violet", dashed: true },
  { id: "e10", from: "survey-agent", to: "experiment", label: "生成", tone: "violet" },
  { id: "e11", from: "review-comment", to: "question", label: "评论", tone: "orange", dashed: true },
];

const kindStyles: Record<NodeKind, { border: string; icon: string; badge: string; surface: string }> = {
  hypothesis: { border: "border-violet-200", icon: "bg-violet-50 text-violet-600", badge: "bg-violet-50 text-violet-600", surface: "bg-white" },
  paper: { border: "border-blue-200", icon: "bg-blue-50 text-blue-600", badge: "bg-blue-50 text-blue-600", surface: "bg-blue-50/20" },
  question: { border: "border-violet-300", icon: "bg-violet-100 text-violet-700", badge: "bg-violet-50 text-violet-600", surface: "bg-white" },
  method: { border: "border-emerald-200", icon: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-600", surface: "bg-emerald-50/20" },
  experiment: { border: "border-orange-200", icon: "bg-orange-50 text-orange-600", badge: "bg-blue-50 text-blue-600", surface: "bg-orange-50/20" },
  finding: { border: "border-emerald-200", icon: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-600", surface: "bg-emerald-50/20" },
  agent: { border: "border-violet-400", icon: "bg-violet-100 text-violet-700", badge: "bg-violet-100 text-violet-700", surface: "bg-violet-50/30" },
  comment: { border: "border-amber-200", icon: "bg-amber-100 text-amber-700", badge: "bg-amber-100 text-amber-700", surface: "bg-amber-50/50" },
};

const nodeIcon = (kind: NodeKind) => {
  if (kind === "paper") return FileText;
  if (kind === "question") return CircleHelp;
  if (kind === "method") return WandSparkles;
  if (kind === "experiment") return FlaskConical;
  if (kind === "finding") return BrainCircuit;
  if (kind === "agent") return Bot;
  if (kind === "comment") return MessageSquareText;
  return Network;
};

function CanvasNodeCard({
  node,
  selected,
  onSelect,
  onPointerDown,
  tool,
  commentCount,
}: {
  node: CanvasNode;
  selected: boolean;
  onSelect: () => void;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  tool: Tool;
  commentCount: number;
}) {
  const Icon = nodeIcon(node.kind);
  const styles = kindStyles[node.kind];
  return (
    <button
      data-node-id={node.id}
      onClick={onSelect}
      onPointerDown={onPointerDown}
      style={{ left: node.x, top: node.y, width: node.width }}
      className={`absolute z-20 rounded-xl border p-3.5 text-left shadow-[0_3px_12px_rgba(15,23,42,0.06)] transition ${styles.surface} ${
        tool === "connect" ? "cursor-crosshair" : tool === "select" ? "cursor-grab active:cursor-grabbing" : ""
      } ${
        node.kind === "agent" && node.status === "运行中" ? "research-agent-running" : ""
      } ${
        selected
          ? "border-blue-500 ring-2 ring-blue-100 shadow-[0_10px_26px_rgba(37,99,235,0.12)]"
          : `${styles.border} hover:-translate-y-0.5 hover:shadow-md`
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`relative flex h-7 w-7 items-center justify-center rounded-lg ${styles.icon}`}>
          {node.kind === "agent" && node.status === "运行中" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
          {node.kind === "agent" && node.status === "运行中" && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
            </span>
          )}
        </span>
        <span className="text-[11px] font-medium text-slate-500">{node.eyebrow}</span>
        {selected && <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
      </div>
      <h3 className={`mt-2.5 text-[13px] font-semibold leading-5 text-slate-900 ${node.kind === "question" ? "text-center text-[16px] leading-6" : ""}`}>
        {node.title}
      </h3>
      {node.description && <p className="mt-1.5 text-[11px] leading-[17px] text-slate-500">{node.description}</p>}
      {node.kind === "agent" && typeof node.progress === "number" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-violet-700">
            <span>正在分析证据</span><span>{node.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-violet-100">
            <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${node.progress}%` }} />
          </div>
        </div>
      )}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {node.kind === "comment" && <img src={collaboratorZhou} alt="" className="h-5 w-5 rounded-full object-cover" />}
          {node.meta && <span className="truncate text-[10px] text-slate-400">{node.meta}</span>}
          {node.status && (
            <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${styles.badge}`}>
              {node.status}
            </span>
          )}
        </div>
        {commentCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <MessageSquareText className="h-3 w-3" />{commentCount}
          </span>
        )}
      </div>
    </button>
  );
}

function Connector({
  left,
  top,
  width,
  rotate = 0,
  label,
  tone = "slate",
  dashed = false,
}: {
  left: number;
  top: number;
  width: number;
  rotate?: number;
  label?: string;
  tone?: EdgeTone;
  dashed?: boolean;
}) {
  const tones = {
    slate: "border-slate-400 text-slate-500",
    blue: "border-blue-500 text-blue-600",
    red: "border-red-400 text-red-500",
    green: "border-emerald-400 text-emerald-600",
    orange: "border-orange-400 text-orange-600",
    violet: "border-violet-400 text-violet-600",
  };
  return (
    <div
      aria-hidden="true"
      style={{ left, top, width, transform: `rotate(${rotate}deg)`, transformOrigin: "left center" }}
      className={`pointer-events-none absolute z-10 border-t ${dashed ? "border-dashed" : "border-solid"} ${tones[tone]}`}
    >
      {label && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[14px] bg-[#f8fafc] px-1.5 text-[10px] font-medium">
          {label}
        </span>
      )}
      <span className={`absolute -right-0.5 -top-[3px] h-1.5 w-1.5 rotate-45 border-r border-t bg-[#f8fafc] ${tones[tone]}`} />
    </div>
  );
}

function EdgeConnector({ edge, nodes }: { edge: CanvasEdge; nodes: CanvasNode[] }) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);
  if (!from || !to) return null;
  const fromX = from.x + from.width / 2;
  const fromY = from.y + (from.height ?? 132) / 2;
  const toX = to.x + to.width / 2;
  const toY = to.y + (to.height ?? 132) / 2;
  const width = Math.hypot(toX - fromX, toY - fromY);
  const rotate = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
  return <Connector left={fromX} top={fromY} width={width} rotate={rotate} label={edge.label} tone={edge.tone} dashed={edge.dashed} />;
}

export function ResearchCanvas({ onOpenAgent }: { onOpenAgent: () => void }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedId, setSelectedId] = useState("position-bias");
  const [tab, setTab] = useState<InspectorTab>("ai");
  const [tool, setTool] = useState<Tool>("select");
  const preferredZoom = () => {
    if (typeof window === "undefined") return 86;
    if (window.innerWidth < 1400) return 80;
    if (window.innerWidth < 1700) return 92;
    return 100;
  };
  const [zoom, setZoom] = useState(preferredZoom);
  const [linked, setLinked] = useState(false);
  const [experimentCreated, setExperimentCreated] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [comments, setComments] = useState([
    { id: 1, nodeId: "position-bias", author: "周同学", body: "建议补充一个位置随机化的对照实验。", time: "12 分钟前", avatar: collaboratorZhou },
    { id: 2, nodeId: "position-bias", author: "陈博士", body: "同意，同时记录不同上下文长度下的置信区间。", time: "5 分钟前", avatar: collaboratorChen },
    { id: 3, nodeId: "review-comment", author: "林老师", body: "NeedleBench 可以作为补充，但不要替代 RULER。", time: "刚刚", avatar: collaboratorLin },
  ]);
  const [commentDraft, setCommentDraft] = useState("");
  const [notice, setNotice] = useState("");
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number; moved: boolean } | null>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? nodes[0],
    [nodes, selectedId],
  );

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const scale = zoom / 100;
      const dx = (event.clientX - drag.startX) / scale;
      const dy = (event.clientY - drag.startY) / scale;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      setNodes((items) =>
        items.map((node) =>
          node.id === drag.id
            ? { ...node, x: Math.max(4, drag.nodeX + dx), y: Math.max(4, drag.nodeY + dy) }
            : node,
        ),
      );
    };
    const handleUp = () => {
      if (dragRef.current?.moved) {
        setNotice("卡片位置已更新");
        window.setTimeout(() => { dragRef.current = null; }, 0);
        return;
      }
      dragRef.current = null;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [zoom]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNodes((items) =>
        items.map((node) =>
          node.kind === "agent" && node.status === "运行中" && (node.progress ?? 0) < 92
            ? { ...node, progress: Math.min(92, (node.progress ?? 0) + 2) }
            : node,
        ),
      );
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  const selectNode = (id: string) => {
    if (dragRef.current?.moved) return;
    if (tool === "connect") {
      if (!connectionStart) {
        setConnectionStart(id);
        setSelectedId(id);
        setNotice("已选择关联起点，请点击另一张卡片");
        return;
      }
      if (connectionStart !== id) {
        setEdges((items) => [
          ...items,
          { id: `edge-${Date.now()}`, from: connectionStart, to: id, label: "关联", tone: "violet" },
        ]);
        setConnectionStart(null);
        setTool("select");
        setSelectedId(id);
        setNotice("两张卡片已建立关联");
      }
      return;
    }
    setSelectedId(id);
    if (tab !== "comments") setTab("ai");
    setNotice("");
  };

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>, node: CanvasNode) => {
    if (tool !== "select") return;
    event.preventDefault();
    setSelectedId(node.id);
    dragRef.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      nodeX: node.x,
      nodeY: node.y,
      moved: false,
    };
  };

  const addNode = (kind: NodeKind = "hypothesis") => {
    const next = nodes.length + 1;
    const presets: Record<NodeKind, Pick<CanvasNode, "eyebrow" | "title" | "description" | "status" | "width" | "height">> = {
      hypothesis: { eyebrow: "研究假设", title: "点击继续完善研究假设", description: "由科研画布创建的待验证节点。", status: "待验证", width: 200, height: 132 },
      paper: { eyebrow: "论文", title: "新关联论文", description: "待补充作者、年份和关键证据。", status: "待读", width: 224, height: 138 },
      question: { eyebrow: "研究问题", title: "新的研究问题", description: "请描述希望回答的核心问题。", status: "草稿", width: 230, height: 132 },
      method: { eyebrow: "方法", title: "新的研究方法", description: "请描述方法路径与关键假设。", status: "待评估", width: 210, height: 132 },
      experiment: { eyebrow: "实验", title: "新的验证实验", description: "请补充变量、基线与评价指标。", status: "待设计", width: 222, height: 136 },
      finding: { eyebrow: "发现", title: "新的研究发现", description: "记录观察结果与证据来源。", status: "初步", width: 214, height: 132 },
      agent: { eyebrow: "Agent", title: "文献分析 Agent", description: "正在读取关联论文并提炼研究证据。", status: "运行中", width: 238, height: 142 },
      comment: { eyebrow: "评论", title: "新的研究评论", description: "记录对研究逻辑的建议或疑问。", status: "待回复", width: 220, height: 118 },
    };
    const preset = presets[kind];
    const node: CanvasNode = {
      id: `note-${next}`,
      kind,
      ...preset,
      progress: kind === "agent" ? 12 : undefined,
      meta: kind === "comment" ? "你 · 刚刚" : undefined,
      author: kind === "comment" ? "你" : undefined,
      x: 280 + (next % 3) * 180,
      y: 720 + (next % 2) * 150,
    };
    setNodes((items) => [...items, node]);
    setSelectedId(node.id);
    setShowNewMenu(false);
    setTool("select");
    setNotice(`已创建${preset.eyebrow}卡片`);
  };

  const addComment = () => {
    if (!commentDraft.trim()) return;
    setComments((items) => [
      ...items,
      {
        id: Date.now(),
        nodeId: selectedId,
        author: "你",
        body: commentDraft.trim(),
        time: "刚刚",
        avatar: collaboratorLin,
      },
    ]);
    setCommentDraft("");
    setNotice("评论已发布");
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoom((value) => Math.max(50, Math.min(130, Math.round(value - event.deltaY * 0.12))));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2) return;
    const [a, b] = Array.from(event.touches);
    pinchRef.current = { distance: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY), zoom };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    event.preventDefault();
    const [a, b] = Array.from(event.touches);
    const distance = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    setZoom(Math.max(50, Math.min(130, Math.round(pinchRef.current.zoom * (distance / pinchRef.current.distance)))));
  };

  const createExperiment = () => {
    setExperimentCreated(true);
    setNotice("验证实验已加入画布");
    setSelectedId("experiment");
  };

  const linkPapers = () => {
    setLinked(true);
    setEdges((items) => items.map((edge) => edge.id === "e1" ? { ...edge, label: "强支持" } : edge));
    setNotice("已关联 2 篇关键论文");
  };

  const focusRunningAgent = () => {
    setSelectedId("survey-agent");
    setTab("detail");
    setNotice("已定位到正在运行的 Agent");
  };

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-white text-slate-900">
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="返回项目">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <Network className="h-5 w-5" />
          </div>
          <div className="relative">
            <button onClick={() => setShowProjectMenu((open) => !open)} className="flex items-center gap-2">
              <span className="text-lg font-semibold">LLM 长期记忆研究</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              已保存 10:24
            </div>
            {showProjectMenu && (
              <div className="absolute left-0 top-12 z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <p className="px-2 py-1 text-[11px] font-medium text-slate-400">切换项目</p>
                {["LLM 长期记忆研究", "RAG Evaluation", "Multimodal Agents"].map((name) => (
                  <button key={name} onClick={() => setShowProjectMenu(false)} className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50">
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 flex -space-x-2">
            {[
              ["林老师", collaboratorLin],
              ["陈博士", collaboratorChen],
              ["周同学", collaboratorZhou],
            ].map(([name, src]) => (
              <img
                key={name}
                src={src}
                alt={name}
                title={name}
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            ))}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] text-slate-500">+2</span>
          </div>
          <button className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-medium hover:bg-slate-50">
            <Users className="mr-2 inline h-4 w-4" />协作
          </button>
          <button onClick={focusRunningAgent} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Agent 运行中
          </button>
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="更多">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1 overflow-hidden bg-[#f8fafc]">
          {notice && (
            <div className="absolute left-1/2 top-5 z-40 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
              <Sparkles className="h-3.5 w-3.5" />{notice}
              <button onClick={() => setNotice("")} aria-label="关闭提示"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}

          <div
            ref={viewportRef}
            data-testid="canvas-viewport"
            className="absolute inset-0 overflow-auto overscroll-contain"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => { pinchRef.current = null; }}
          >
            <div
              className="relative min-h-[830px] min-w-[900px] origin-top-left bg-[radial-gradient(circle_at_center,#dbe1ea_0.7px,transparent_0.7px)] bg-[length:20px_20px]"
              style={{ transform: `scale(${zoom / 100})`, width: `${10000 / zoom}%`, height: `${10000 / zoom}%` }}
            >
              <span className="absolute left-6 top-12 rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">假设</span>
              <span className="absolute left-[640px] top-12 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">关键论文</span>
              <span className="absolute left-10 top-[552px] rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">方法</span>
              <span className="absolute left-[330px] top-[654px] rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">实验</span>
              <span className="absolute left-[646px] top-[654px] rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">发现</span>
              <span className="absolute left-[306px] top-[394px] rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">Agent</span>
              <span className="absolute left-[640px] top-[388px] rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">评论</span>

              {edges.map((edge) => <EdgeConnector key={edge.id} edge={edge} nodes={nodes} />)}

              {nodes.map((node) => (
                <CanvasNodeCard
                  key={node.id}
                  node={node}
                  selected={node.id === selectedId}
                  onSelect={() => selectNode(node.id)}
                  onPointerDown={(event) => beginDrag(event, node)}
                  tool={tool}
                  commentCount={comments.filter((comment) => comment.nodeId === node.id).length}
                />
              ))}

              {experimentCreated && (
                <div className="absolute left-[584px] top-[710px] z-20 w-64 rounded-xl border border-violet-300 bg-white p-3.5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-medium text-violet-700">
                    <FlaskConical className="h-4 w-4" />AI 新建实验
                  </div>
                  <h3 className="mt-2 text-sm font-semibold">位置偏置 × 检索失败控制实验</h3>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">固定检索质量，仅改变证据出现位置，验证位置偏置的独立影响。</p>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 z-30 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm">
            全部画布 <span className="mx-1 text-slate-300">/</span> LLM 长期记忆研究
            <span className="ml-2 text-slate-400">拖动卡片 · 双指捏合缩放</span>
          </div>
          {connectionStart && (
            <div className="absolute bottom-[76px] left-1/2 z-40 -translate-x-1/2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-700 shadow-lg">
              已选择起点，点击另一张卡片完成关联
              <button onClick={() => { setConnectionStart(null); setTool("select"); }} className="ml-2 text-slate-400"><X className="inline h-3.5 w-3.5" /></button>
            </div>
          )}
          {showNewMenu && (
            <div className="absolute bottom-[76px] left-1/2 z-40 w-60 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-2 pb-1 pt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">新建卡片</p>
              {[
                ["hypothesis", Network, "研究假设", "梳理待验证判断"],
                ["paper", FileText, "论文", "关联论文与证据"],
                ["agent", Bot, "Agent", "创建自动研究任务"],
                ["comment", MessageSquareText, "评论", "记录讨论与反馈"],
                ["experiment", FlaskConical, "实验", "设计验证方案"],
              ].map(([kind, Icon, label, description]) => (
                <button
                  key={kind as string}
                  onClick={() => addNode(kind as NodeKind)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${kindStyles[kind as NodeKind].icon}`}><Icon className="h-4 w-4" /></span>
                  <span><strong className="block text-xs font-medium">{label as string}</strong><span className="text-[10px] text-slate-400">{description as string}</span></span>
                </button>
              ))}
            </div>
          )}
          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <button onClick={() => setTool("pan")} className={`rounded-lg p-2 ${tool === "pan" ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`} aria-label="移动">
              <Hand className="h-4 w-4" />
            </button>
            <button onClick={() => setTool("select")} className={`rounded-lg p-2 ${tool === "select" ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`} aria-label="选择">
              <MousePointer2 className="h-4 w-4" />
            </button>
            <button onClick={() => { setShowNewMenu((open) => !open); setConnectionStart(null); }} className={`rounded-lg p-2 ${showNewMenu ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`} aria-label="新建卡片">
              <MessageSquareText className="h-4 w-4" />
            </button>
            <button onClick={() => { setTool("connect"); setShowNewMenu(false); setConnectionStart(null); }} className={`rounded-lg p-2 ${tool === "connect" ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`} aria-label="关联卡片">
              <Link2 className="h-4 w-4" />
            </button>
            <button onClick={() => { setShowNewMenu(true); setConnectionStart(null); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50" aria-label="添加节点">
              <Square className="h-4 w-4" />
            </button>
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50" aria-label="撤销"><Undo2 className="h-4 w-4" /></button>
            <button className="rounded-lg p-2 text-slate-300" aria-label="重做"><Redo2 className="h-4 w-4" /></button>
          </div>
          <div className="absolute bottom-5 right-5 z-30 flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <button onClick={() => setZoom((value) => Math.max(60, value - 10))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50" aria-label="缩小">
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={() => setZoom(preferredZoom())} className="min-w-12 px-2 text-xs font-medium text-slate-600">{zoom}%</button>
            <button onClick={() => setZoom((value) => Math.min(120, value + 10))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50" aria-label="放大">
              <ZoomIn className="h-4 w-4" />
            </button>
            <button onClick={() => setZoom(76)} className="ml-1 rounded-lg border-l border-slate-100 p-2 text-slate-500 hover:bg-slate-50" aria-label="适应画布">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </main>

        <aside className="flex w-[322px] shrink-0 flex-col border-l border-slate-200 bg-white">
          <div className="flex h-14 items-end border-b border-slate-200 px-4">
            {[
              ["detail", "详情"],
              ["evidence", "证据"],
              ["comments", `评论 ${comments.filter((comment) => comment.nodeId === selectedId).length || ""}`],
              ["ai", "AI 建议"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id as InspectorTab)}
                className={`relative h-14 flex-1 text-xs font-medium ${
                  tab === id ? "text-violet-700" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {id === "ai" && <Sparkles className="mr-1 inline h-3.5 w-3.5" />}
                {label}
                {tab === id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded bg-violet-600" />}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {tab === "detail" && (
              <div>
                <p className="text-[11px] font-medium text-slate-400">当前节点</p>
                <div className="mt-3 rounded-xl border border-slate-200 p-4">
                  <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700">{selectedNode.eyebrow}</span>
                  <h2 className="mt-3 text-sm font-semibold leading-6">{selectedNode.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{selectedNode.description ?? "该节点是当前研究逻辑的核心对象。"}</p>
                </div>
                <dl className="mt-5 space-y-4 text-xs">
                  <div className="flex justify-between"><dt className="text-slate-400">状态</dt><dd className="font-medium">{selectedNode.status ?? "进行中"}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">创建者</dt><dd className="font-medium">你</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">更新时间</dt><dd className="font-medium">今天 10:24</dd></div>
                </dl>
                {selectedNode.kind === "agent" && (
                  <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50/40 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-violet-700"><Activity className="h-4 w-4" />实时运行状态</div>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">已读取 8/12 篇论文，正在交叉验证位置偏置与检索失败的证据冲突。</p>
                    <button onClick={onOpenAgent} className="mt-3 rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-medium text-violet-700 hover:bg-violet-50">打开 Agent 工作台</button>
                  </div>
                )}
              </div>
            )}

            {tab === "evidence" && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">关联证据</h2>
                  <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><Plus className="h-4 w-4" /></button>
                </div>
                <p className="mt-1 text-xs text-slate-500">支持或反驳“{selectedNode.title}”的材料</p>
                <div className="mt-4 space-y-3">
                  {[
                    ["Lost in the Middle", "支持", "中间位置性能下降"],
                    ["RULER Benchmark", "弱支持", "长上下文下结果一致"],
                  ].map(([title, status, excerpt]) => (
                    <button key={title} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-violet-200 hover:bg-violet-50/30">
                      <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /><span className="text-xs font-medium">{title}</span></div>
                      <p className="mt-2 text-[11px] text-slate-500">{excerpt}</p>
                      <span className="mt-2 inline-flex rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">{status}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "comments" && (
              <div className="flex min-h-full flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">节点评论</h2>
                    <p className="mt-1 text-[11px] text-slate-500">围绕“{selectedNode.title}”讨论</p>
                  </div>
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                    {comments.filter((comment) => comment.nodeId === selectedId).length} 条
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {comments.filter((comment) => comment.nodeId === selectedId).length > 0 ? (
                    comments.filter((comment) => comment.nodeId === selectedId).map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                          <img src={comment.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                          <div className="min-w-0"><p className="text-[11px] font-medium">{comment.author}</p><p className="text-[10px] text-slate-400">{comment.time}</p></div>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{comment.body}</p>
                        <button className="mt-2 text-[10px] font-medium text-violet-600">回复</button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
                      <MessageSquareText className="mx-auto h-5 w-5 text-slate-300" />
                      <p className="mt-2 text-xs text-slate-400">还没有评论</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-violet-300">
                  <textarea
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") addComment();
                    }}
                    rows={3}
                    placeholder="添加评论，使用 ⌘+Enter 发送"
                    className="w-full resize-none bg-transparent px-1 text-xs leading-5 outline-none"
                  />
                  <div className="flex justify-end">
                    <button onClick={addComment} disabled={!commentDraft.trim()} className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-white disabled:bg-slate-200">
                      <Send className="h-3.5 w-3.5" />发布
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "ai" && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700"><BrainCircuit className="h-4 w-4" /></span>
                  <div><h2 className="text-sm font-semibold">对所选假设的解读</h2><p className="text-[10px] text-slate-400">基于当前画布自动分析</p></div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-600">
                  “{selectedNode.title}”目前仅有间接证据。现有结果说明中间信息更易被忽略，但还不能区分位置偏置与检索失败。
                </p>
                <ul className="mt-3 space-y-2 text-[11px] leading-5 text-slate-500">
                  <li><strong className="text-slate-700">支持证据：</strong>Lost in the Middle 报告了中间位置的性能下降。</li>
                  <li><strong className="text-slate-700">局限性：</strong>尚未在 128K 及多样任务上做系统验证。</li>
                </ul>
                <div className="mt-4 flex items-center justify-between border-y border-slate-100 py-3 text-xs">
                  <span className="text-slate-500">综合判断</span>
                  <span className="rounded-md bg-violet-50 px-2 py-1 font-medium text-violet-700">弱支持</span>
                </div>

                <h3 className="mt-5 text-xs font-semibold">建议的操作</h3>
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl border border-violet-200 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold"><Link2 className="h-4 w-4 text-violet-600" />关联两篇论文以增强证据链</div>
                    <p className="mt-2 text-[11px] leading-4 text-slate-500">将 Lost in the Middle 和 RULER 同时关联到当前假设，形成更完整的证据链。</p>
                    <button onClick={linkPapers} disabled={linked} className="mt-3 rounded-lg border border-violet-200 px-3 py-1.5 text-[11px] font-medium text-violet-700 hover:bg-violet-50 disabled:bg-violet-50">
                      {linked ? "已关联" : "立即关联"}
                    </button>
                  </div>
                  <div className="rounded-xl border border-violet-200 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold"><FlaskConical className="h-4 w-4 text-violet-600" />创建验证实验</div>
                    <p className="mt-2 text-[11px] leading-4 text-slate-500">改变关键信息在上下文中的位置，量化位置对模型表现的影响。</p>
                    <button onClick={createExperiment} disabled={experimentCreated} className="mt-3 rounded-lg border border-violet-200 px-3 py-1.5 text-[11px] font-medium text-violet-700 hover:bg-violet-50 disabled:bg-violet-50">
                      {experimentCreated ? "实验已创建" : "创建验证实验"}
                    </button>
                  </div>
                </div>
                <h3 className="mt-5 text-xs font-semibold">更多分析角度</h3>
                <div className="mt-3 space-y-1.5">
                  {["与注意力汇聚假设对比分析", "从模型架构角度解释位置偏置", "查找相关工作与复现代​​码"].map((item) => (
                    <button key={item} className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50">
                      {item}<ChevronDown className="-rotate-90 h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tab === "ai" && <div className="border-t border-slate-100 p-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-400 focus-within:border-violet-300">
              <Search className="h-4 w-4" />
              <input className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none" placeholder="继续询问 AI 项目助手…" />
            </label>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span>以上建议是否有帮助？</span>
              <div className="flex gap-1">
                <button onClick={() => setFeedback("up")} className={`rounded p-1 ${feedback === "up" ? "bg-violet-50 text-violet-700" : "hover:bg-slate-100"}`}><ThumbsUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => setFeedback("down")} className={`rounded p-1 ${feedback === "down" ? "bg-violet-50 text-violet-700" : "hover:bg-slate-100"}`}><ThumbsDown className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>}
        </aside>
      </div>
    </div>
  );
}
