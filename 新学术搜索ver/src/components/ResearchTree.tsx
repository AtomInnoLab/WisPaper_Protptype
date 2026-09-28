import React, { useEffect, useMemo, useRef, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {
  ArrowLeft, AtSign, BookOpen, Bot, Check, ChevronDown, ChevronRight, Clock3, Edit3,
  ExternalLink, File, FileText, FlaskConical, FolderTree, GripVertical, Lightbulb, LoaderCircle, Maximize2, MoreHorizontal,
  MessageSquare, PanelRightClose, PanelRightOpen, Plus, Redo2, Save, Search, Send, Sparkles, Table2, Trash2, Undo2, Users, X, ZoomIn, ZoomOut,
} from "lucide-react";

type ResourceKind = "论文" | "Survey" | "Agent 对话" | "文件";
type Resource = { id: string; kind: ResourceKind; title: string };
type ProjectAgentStatus = "在线" | "运行中" | "等待中" | "已完成";
type ProjectAgent = { id: string; name: string; description: string; status: ProjectAgentStatus; lastUsedAt: number };
type CategoryColor = "violet" | "indigo" | "blue" | "cyan" | "teal" | "emerald" | "amber" | "orange" | "rose" | "fuchsia";
type TreeNode = { id: string; title: string; category?: string; categoryColor?: CategoryColor; tags?: string[]; updatedAt?: number; parentId: string | null; note: string; resources: Resource[]; root?: boolean };
type TreeSnapshot = { nodes: TreeNode[]; expanded: string[]; selectedId: string | null };
type AgentActivity = { agentName: string; action: "访问中" | "修改中"; updatedAt: number };
type NodePosition = { x: number; y: number };
type CanvasSidebarTab = { id: string; type: "note" | "agent"; nodeId: string; title: string };

const defaultNodeCategories: Record<string, string> = {
  root: "研究问题", n1: "方法", n2: "实验", n3: "方法", n4: "假设", n5: "实验",
};
const defaultNodeTags: Record<string, string[]> = {
  root: ["长期记忆", "LLM"], n1: ["架构", "进行中"], n2: ["基线", "LoCoMo"], n3: ["知识图谱"], n4: ["待验证"], n5: ["失败分析"],
};

const resources: Resource[] = [
  { id: "paper-lost", kind: "论文", title: "Lost in the Middle: How Language Models Use Long Contexts" },
  { id: "paper-ruler", kind: "论文", title: "RULER: What’s the Real Context Length of LLMs?" },
  { id: "paper-needle", kind: "论文", title: "NeedleBench: Can LLMs Do Retrieval and Reasoning in 1M Context Window?" },
  { id: "survey-position", kind: "Survey", title: "长上下文位置偏差相关工作综述" },
  { id: "file-results", kind: "文件", title: "position-bias-results.xlsx" },
  { id: "file-config", kind: "文件", title: "experiment-config.yaml" },
  { id: "file-report", kind: "文件", title: "long-context-review.docx" },
  { id: "file-slides", kind: "文件", title: "position-bias-slides.pptx" },
  { id: "file-archive", kind: "文件", title: "experiment-artifacts.zip" },
  { id: "file-python", kind: "文件", title: "analyze_position_bias.py" },
  { id: "file-rust", kind: "文件", title: "dataset_loader.rs" },
  { id: "file-typescript", kind: "文件", title: "chart-options.ts" },
];

const projectAgents: ProjectAgent[] = [
  { id: "project-assistant", name: "项目助手", description: "统筹研究计划、画布节点与项目协作", status: "在线", lastUsedAt: 4 },
  { id: "dataset-research", name: "数据集调研 Agent", description: "核对数据许可、评测脚本与指标定义", status: "运行中", lastUsedAt: 3 },
  { id: "experiment-repro", name: "实验复现 Agent", description: "运行位置偏差对照实验并记录结果", status: "等待中", lastUsedAt: 2 },
  { id: "paper-analysis", name: "论文解析 Agent", description: "整理长上下文评测方法与关键结论", status: "已完成", lastUsedAt: 1 },
];

const initialNodes: TreeNode[] = [
  { id: "root", title: "长上下文模型位置偏差研究", category: "研究问题", tags: ["长上下文", "位置偏差"], updatedAt: Date.now(), parentId: null, root: true, note: "# 长上下文模型位置偏差研究\n\n研究问题：关键证据位于多文档上下文的不同位置时，模型回答准确率是否出现系统性下降？\n\n## 研究计划\n\n比较 32K、64K、128K 上下文，以及证据位于开头、中间、结尾的对照组。", resources: [] },
  { id: "n1", title: "Lost in the Middle 文献复现", category: "论文", tags: ["关键论文", "已精读"], updatedAt: Date.now()-300000, parentId: "root", note: "# Lost in the Middle 文献复现\n\n博一新生林沐整理了论文中的位置偏差现象与复现条件。\n\n## 待确认\n\n不同模型与上下文长度下的性能曲线是否一致？", resources: [resources[0]] },
  { id: "n2", title: "RULER 与 NeedleBench 评测", category: "数据集", tags: ["许可核对", "Agent调研"], updatedAt: Date.now()-220000, parentId: "root", note: "# RULER 与 NeedleBench 评测\n\n数据集调研 Agent 正在核对数据许可、指标定义和评测脚本。", resources: [resources[1], resources[2]] },
  { id: "n3", title: "32K / 64K / 128K 对照实验", category: "实验设计", tags: ["博三学长复核", "待运行"], updatedAt: Date.now()-150000, parentId: "root", note: "# 对照实验\n\n博三学长周启补充控制变量：上下文长度、干扰文档数量、证据位置和随机种子。", resources: [resources[5]] },
  { id: "n4", title: "失败：内部数据许可受限", category: "失败记录", tags: ["许可风险"], updatedAt: Date.now()-90000, parentId: "n2", note: "# 数据许可失败\n\n内部长文档问答数据无法用于本轮复现。保留失败原因，改用公开评测集。", resources: [] },
  { id: "n5", title: "公开替代数据集", category: "数据集", tags: ["替代方案"], updatedAt: Date.now()-50000, parentId: "n2", note: "# 公开替代数据集\n\n使用 RULER 与 NeedleBench 构建可复现的位置偏差评测。", resources: [resources[1], resources[2]] },
  { id: "n6", title: "位置偏差实验结果", category: "结果分析", tags: ["Excel结果", "导师审阅"], updatedAt: Date.now(), parentId: "n3", note: "# 实验结果\n\n中部证据条件下准确率低于首尾位置；128K 设置下降幅度更明显。\n\n原始结果见 [文件 · position-bias-results.xlsx](#resource-file-results)。", resources: [resources[4]] },
];

function calculateTreeLayout(nodes: TreeNode[], expandedIds: Set<string>): Record<string, NodePosition> {
  const result: Record<string, NodePosition> = {};
  const byParent = (parentId: string) => nodes.filter((node) => node.parentId === parentId);
  let leafIndex = 0;
  const place = (node: TreeNode, depth: number): number => {
    const children = expandedIds.has(node.id) ? byParent(node.id) : [];
    const y = children.length ? children.map((child) => place(child, depth + 1)).reduce((sum, value) => sum + value, 0) / children.length : 90 + leafIndex++ * 150;
    result[node.id] = { x: depth === 0 ? 100 : 430 + (depth - 1) * 330, y };
    return y;
  };
  nodes.filter((node) => node.parentId === null).sort((a, b) => Number(b.root) - Number(a.root)).forEach((node) => place(node, 0));
  return result;
}

type CanvasTemplateBlueprint = { id: string; title: string; description: string; nodes: Array<[string, string, number?]> };
const canvasTemplateBlueprints: CanvasTemplateBlueprint[] = [
  { id: "ai-algorithm", title: "AI 算法实验", description: "从研究问题、基线到训练与评测", nodes: [["研究问题", "研究主题"], ["基线模型与数据集", "方法设计"], ["模型训练与超参数", "实验"], ["消融实验", "实验"], ["评测结果与误差分析", "结论"]] },
  { id: "clinical-trial", title: "临床实验", description: "研究假设、受试者、干预与终点", nodes: [["临床研究假设", "研究主题"], ["入组与排除标准", "方法设计"], ["干预与对照方案", "技术路线"], ["主要与次要终点", "实验"], ["安全性与不良事件", "结论"]] },
  { id: "literature-review", title: "系统文献综述", description: "检索、筛选、质量评估与证据综合", nodes: [["综述问题与 PICO", "研究主题"], ["数据库与检索式", "技术路线"], ["纳入排除与文献筛选", "方法设计"], ["偏倚风险评估", "实验"], ["证据综合与研究空白", "结论"]] },
  { id: "data-analysis", title: "统计数据分析", description: "数据质量、建模、验证与结果解释", nodes: [["分析目标与核心指标", "研究主题"], ["数据清理与缺失值", "技术路线"], ["统计模型与变量选择", "方法设计"], ["稳健性与敏感性分析", "实验"], ["效应量与不确定性解释", "结论"]] },
  { id: "large-research", title: "大型科研项目", description: "多条技术路线并行分支、演化并在里程碑汇合", nodes: [
    ["项目总目标与核心科学问题", "研究主题"],
    ["技术路线 A：数据驱动", "技术路线", 0],
    ["技术路线 B：机理建模", "技术路线", 0],
    ["技术路线 C：实验验证", "技术路线", 0],
    ["数据采集、治理与基线", "方法设计", 1],
    ["多模态算法与规模化训练", "实验", 1],
    ["理论假设与数学模型", "假设", 2],
    ["数值模拟与参数校准", "实验", 2],
    ["实验系统与样机验证", "实验", 3],
    ["多中心重复与失败分析", "失败记录", 3],
    ["路线交叉验证与阶段里程碑", "结论", 0],
  ] },
];

function nodesFromTemplate(projectTitle: string, templateId: string): TreeNode[] {
  const template = canvasTemplateBlueprints.find((item) => item.id === templateId);
  if (!template) return [];
  return template.nodes.map(([title, category, parentIndex], index) => {
    const displayTitle = index === 0 ? projectTitle : title;
    return ({
    id: `template-${template.id}-${index}`,
    title: displayTitle,
    category,
    tags: index === 0 ? [template.title] : ["待完善"],
    updatedAt: Date.now(),
    parentId: index === 0 ? null : `template-${template.id}-${parentIndex ?? (index <= 2 ? 0 : 2)}`,
    root: index === 0,
    note: `# ${displayTitle}\n\n这是由「${template.title}」模板生成的初始节点。\n\n## 待完善\n\n请记录研究目标、关键决策、证据与下一步行动。`,
    resources: [],
  }); });
}

const kindIcon: Record<ResourceKind, React.ElementType> = { "论文": BookOpen, Survey: Search, "Agent 对话": Bot, "文件": File };

function markdownToBlocks(markdown: string): PartialBlock[] {
  if (!markdown.trim()) return [{ type: "paragraph", content: "" }];
  const parts = markdown.split(/\n\n+/);
  if (parts[0]?.startsWith("# ")) parts.shift();
  if (!parts.length) return [{ type: "paragraph", content: "" }];
  return parts.map((part) => {
    if (part.startsWith("# ")) return { type: "heading", props: { level: 1 }, content: part.slice(2) } as PartialBlock;
    if (part.startsWith("## ")) return { type: "heading", props: { level: 2 }, content: part.slice(3) } as PartialBlock;
    if (part.split("\n").every((line) => line.startsWith("- "))) {
      const items = part.split("\n");
      return { type: "bulletListItem", content: items.map((line) => line.slice(2)).join(" · ") } as PartialBlock;
    }
    return { type: "paragraph", content: part.replace(/\*\*/g, "") } as PartialBlock;
  });
}

function BlockNoteEditor({ initialMarkdown, availableResources, onChange, onAttach, remoteEditor = null, compact = false }: {
  initialMarkdown: string;
  availableResources: Resource[];
  onChange: (markdown: string) => void;
  onAttach: (resource: Resource) => void;
  remoteEditor?: { type: "agent" | "collaborator"; name: string } | null;
  compact?: boolean;
}) {
  const editor = useCreateBlockNote({ initialContent: markdownToBlocks(initialMarkdown) });
  const [attachedAgentIds, setAttachedAgentIds] = useState<string[]>(() => projectAgents
    .filter((agent) => initialMarkdown.includes(`#agent-${agent.id}`))
    .map((agent) => agent.id));
  const [agentMessages, setAgentMessages] = useState<Record<string, string>>({});
  const [fileDragActive, setFileDragActive] = useState(false);
  const [mentionMenu, setMentionMenu] = useState<{ left: number; top: number } | null>(null);
  const [editingOutline, setEditingOutline] = useState<{ top: number; left: number; width: number; height: number; editor: "agent" | "collaborator"; name: string } | null>(null);
  const editorRootRef = useRef<HTMLDivElement>(null);
  const attachResource = (resource: Resource) => {
    editor.insertInlineContent([
      { type: "link", href: `#resource-${resource.id}`, content: [{ type: "text", text: `${resource.kind} · ${resource.title}`, styles: {} }] },
      { type: "text", text: " ", styles: {} },
    ], { updateSelection: true });
    onAttach(resource);
  };

  const attachAgent = (agent: ProjectAgent) => {
    editor.insertInlineContent([
      { type: "link", href: `#agent-${agent.id}`, content: [{ type: "text", text: `Agent · ${agent.name}`, styles: {} }] },
      { type: "text", text: " ", styles: {} },
    ], { updateSelection: true });
    setAttachedAgentIds((ids) => ids.includes(agent.id) ? ids : [...ids, agent.id]);
  };

  const openAgent = (agent: ProjectAgent, message = "") => {
    const params = new URLSearchParams({ agentId: agent.id, agentName: agent.name, source: "research-note" });
    if (message.trim()) params.set("message", message.trim());
    window.open(`/app/agent?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const sendToAgent = (agent: ProjectAgent) => {
    const message = agentMessages[agent.id]?.trim();
    if (!message) return;
    setAgentMessages((messages) => ({ ...messages, [agent.id]: "" }));
    openAgent(agent, message);
  };

  const insertDroppedFile = async (file: globalThis.File) => {
    const resource: Resource = { id: `file-${Date.now()}`, kind: "文件", title: file.name };
    const lastBlock = editor.document[editor.document.length - 1];
    editor.insertBlocks([{ type: "paragraph", content: [{ type: "link", href: `#resource-${resource.id}`, content: [{ type: "text", text: `文件 · ${file.name}`, styles: {} }] }] }], lastBlock, "after");
    onAttach(resource);
    onChange(await editor.blocksToMarkdownLossy(editor.document));
  };

  const openMentionMenu = () => {
    const selection = window.getSelection();
    const caretRect = selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    const editorRect = document.querySelector(".blocknote-research-editor")?.getBoundingClientRect();
    const left = Math.min(window.innerWidth - 340, Math.max(12, caretRect?.left || editorRect?.left || 12));
    const top = Math.min(window.innerHeight - 420, Math.max(12, (caretRect?.bottom || editorRect?.top || 12) + 8));
    setMentionMenu({ left, top });
  };

  useEffect(() => {
    const handleEditorKey = (event: KeyboardEvent) => {
      if (!editorRootRef.current?.contains(event.target as Node)) return;
      if (event.key === "@") window.setTimeout(openMentionMenu, 0);
      if (event.key === "Escape") setMentionMenu(null);
    };
    const handleEditorInput = (event: Event) => {
      if (!editorRootRef.current?.contains(event.target as Node)) return;
      if ((event as InputEvent).data === "@") window.setTimeout(openMentionMenu, 0);
    };
    document.addEventListener("keydown", handleEditorKey, true);
    document.addEventListener("input", handleEditorInput, true);
    return () => {
      document.removeEventListener("keydown", handleEditorKey, true);
      document.removeEventListener("input", handleEditorInput, true);
    };
  }, []);

  useEffect(() => {
    const root = editorRootRef.current;
    if (!root) return;
    if (!remoteEditor) { setEditingOutline(null); return; }
    const updateAgentOutline = () => {
      const agentBlock = root.querySelector<HTMLElement>(".bn-block");
      if (!agentBlock) return;
      const rootRect = root.getBoundingClientRect();
      const blockRect = agentBlock.getBoundingClientRect();
      setEditingOutline({ top: blockRect.top - rootRect.top, left: blockRect.left - rootRect.left, width: blockRect.width, height: blockRect.height, editor: remoteEditor.type, name: remoteEditor.name });
    };
    updateAgentOutline();
  }, [remoteEditor?.type, remoteEditor?.name]);

  const chooseMention = (insert: () => void) => {
    document.execCommand("delete", false);
    insert();
    setMentionMenu(null);
  };

  return <div ref={editorRootRef} onDragEnter={(event) => { if (event.dataTransfer.types.includes("Files")) { event.preventDefault(); setFileDragActive(true); } }} onDragOver={(event) => { if (event.dataTransfer.types.includes("Files")) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setFileDragActive(true); } }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFileDragActive(false); }} onDrop={(event) => { const files = Array.from(event.dataTransfer.files); if (!files.length) return; event.preventDefault(); event.stopPropagation(); setFileDragActive(false); files.forEach((file) => void insertDroppedFile(file)); }} className={`blocknote-research-editor relative pb-6 ${compact ? "blocknote-research-editor--compact" : ""}`}>
    {fileDragActive && <div className="pointer-events-none absolute inset-0 z-[10020] grid place-items-center rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50/95"><div className="text-center"><File className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-2 text-sm font-semibold text-emerald-800">松开以插入文件</p><p className="mt-1 text-xs text-emerald-600">文件将关联到当前笔记并自动保存</p></div></div>}
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={async () => onChange(await editor.blocksToMarkdownLossy(editor.document))}
    />
    {mentionMenu && <div className="fixed z-[10050] max-h-[min(420px,70vh)] w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" style={mentionMenu} onMouseDown={(event) => event.preventDefault()}>
      <div className="flex items-center justify-between px-2 py-1.5"><span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">论文与项目资源</span><button type="button" onClick={() => setMentionMenu(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X className="h-3.5 w-3.5" /></button></div>
      <p className="mt-1 border-t border-slate-100 px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">工作空间资源</p>
      {availableResources.map((resource) => { const Icon = kindIcon[resource.kind]; return <button key={resource.id} type="button" onClick={() => chooseMention(() => attachResource(resource))} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-blue-50"><Icon className="h-4 w-4 shrink-0 text-blue-600" /><span className="min-w-0 flex-1 truncate text-sm text-slate-700">{resource.title}</span><span className="text-[10px] text-slate-400">{resource.kind}</span></button>; })}
    </div>}
    <p className="pointer-events-none absolute bottom-0 left-2 text-[10px] font-normal tracking-wide text-slate-300/70">输入 “/” 插入 Block，输入 “@” 提及论文或项目资源</p>
  </div>;
}

function HashTagEditor({ nodeId, tags, onCommit }: { nodeId: string; tags: string[]; onCommit: (tags: string[]) => void }) {
  const formatTags = (items: string[]) => items.map((tag) => `#${tag}`).join("  ");
  const [value, setValue] = useState(() => formatTags(tags));
  const commitTimer = useRef<number>();
  const commitRef = useRef(onCommit);
  commitRef.current = onCommit;
  const parseTags = (text: string) => text.split(/[，,\s]+/).map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean);

  useEffect(() => {
    window.clearTimeout(commitTimer.current);
    setValue(formatTags(tags));
    return () => window.clearTimeout(commitTimer.current);
  }, [nodeId]);

  const scheduleCommit = (nextValue: string) => {
    window.clearTimeout(commitTimer.current);
    commitTimer.current = window.setTimeout(() => commitRef.current(parseTags(nextValue)), 450);
  };

  return <input
    value={value}
    onChange={(event) => { setValue(event.target.value); scheduleCommit(event.target.value); }}
    onBlur={() => { window.clearTimeout(commitTimer.current); commitRef.current(parseTags(value)); }}
    placeholder="添加 #Hash tags，空格分隔"
    className="w-full border-0 bg-transparent p-0 text-xs text-slate-500 outline-none placeholder:text-slate-300"
    aria-label="Hash tags"
  />;
}

function ProjectAttachmentPreview({ resource }: { resource: Resource }) {
  const extension = resource.title.split(".").pop()?.toLowerCase() ?? "";
  const codeSamples: Record<string, string> = {
    yaml: "model: qwen2.5-32b\ncontext_lengths: [32768, 65536, 131072]\nevidence_positions:\n  - start\n  - middle\n  - end\nseeds: [11, 23, 47]",
    yml: "model: qwen2.5-32b\ncontext_lengths: [32768, 65536, 131072]\nevidence_positions: [start, middle, end]",
    py: "from pathlib import Path\nimport pandas as pd\n\nresults = pd.read_excel(Path(\"position-bias-results.xlsx\"))\nsummary = results.groupby([\"context\", \"position\"]).accuracy.mean()\nprint(summary.sort_values())",
    rs: "pub fn load_dataset(path: &Path) -> Result<Vec<Sample>> {\n    let input = std::fs::read_to_string(path)?;\n    input.lines().map(parse_sample).collect()\n}",
    ts: "export const chartOptions = {\n  xAxis: { data: ['Start', 'Middle', 'End'] },\n  series: [{ name: 'Accuracy', data: [0.84, 0.61, 0.82] }],\n};",
  };

  if (extension === "xlsx" || extension === "xls") return <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white"><div className="flex items-center justify-between bg-emerald-600 px-3 py-2 text-[10px] font-medium text-white"><span>Sheet1 · position_bias</span><span>A1:D4</span></div><div className="overflow-x-auto"><table className="w-full min-w-[330px] border-collapse text-[10px]"><thead><tr className="bg-emerald-50 text-emerald-900"><th className="border border-emerald-100 px-2 py-2 text-left">Context</th><th className="border border-emerald-100 px-2 py-2 text-left">Position</th><th className="border border-emerald-100 px-2 py-2 text-right">Accuracy</th><th className="border border-emerald-100 px-2 py-2 text-right">Samples</th></tr></thead><tbody>{[["32K", "Start", "84%", "240"], ["32K", "Middle", "67%", "240"], ["128K", "Middle", "53%", "240"]].map((row) => <tr key={row.join("-")}>{row.map((cell, index) => <td key={cell} className={`border border-slate-100 px-2 py-2 ${index > 1 ? "text-right tabular-nums" : ""}`}>{cell}</td>)}</tr>)}</tbody></table></div></div>;

  if (extension === "docx" || extension === "doc") return <article className="rounded-xl border border-blue-100 bg-white px-6 py-7 shadow-sm"><p className="text-center text-[9px] uppercase tracking-[0.18em] text-slate-400">Research memo</p><h3 className="mt-3 text-center font-serif text-lg font-semibold text-slate-900">长上下文位置偏差实验综述</h3><p className="mt-5 text-[11px] leading-6 text-slate-600">本报告汇总了 Lost in the Middle、RULER 与 NeedleBench 的复现实验。结果显示，关键证据位于上下文中部时准确率持续下降，且该趋势随上下文长度增加而加剧。</p><h4 className="mt-5 text-xs font-semibold text-slate-800">1. 核心结论</h4><p className="mt-2 text-[11px] leading-6 text-slate-600">128K 条件下，中部证据组相较首部证据组下降 31 个百分点。实验日志、配置和随机种子均已归档。</p></article>;

  if (extension === "pptx" || extension === "ppt") return <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-2"><div className="space-y-2">{[1, 2, 3].map((slide) => <div key={slide} className={`aspect-video rounded border p-1 text-[7px] ${slide === 1 ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white"}`}>{slide}<div className="mt-1 h-1 rounded bg-slate-200" /></div>)}</div><div className="aspect-video rounded-xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm"><p className="text-[9px] font-medium uppercase tracking-widest text-orange-500">Position bias study</p><h3 className="mt-3 text-lg font-semibold leading-tight text-slate-900">Evidence in the middle is harder to retrieve</h3><div className="mt-5 flex h-16 items-end gap-3">{[["Start", 82], ["Middle", 51], ["End", 78]].map(([label, height]) => <div key={label} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t bg-orange-400" style={{ height: `${height}%` }} /><span className="text-[7px] text-slate-400">{label}</span></div>)}</div></div></div>;

  if (extension === "zip") return <div className="rounded-xl border border-amber-200 bg-white p-4"><div className="flex items-center gap-2 border-b border-amber-100 pb-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700"><FolderTree className="h-4 w-4" /></span><div><p className="text-xs font-semibold">压缩包内容</p><p className="text-[9px] text-slate-400">8 files · 12.4 MB</p></div></div><div className="mt-3 space-y-2 font-mono text-[10px] text-slate-600"><p>▾ experiment-artifacts/</p><p className="pl-4">├─ configs/experiment-config.yaml</p><p className="pl-4">├─ results/position-bias-results.xlsx</p><p className="pl-4">├─ logs/run-128k.log</p><p className="pl-4">└─ figures/accuracy-by-position.png</p></div></div>;

  const code = codeSamples[extension] ?? `// ${resource.title}\n// 代码预览已启用\nexport default function run() {\n  return true;\n}`;
  return <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"><div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-[9px] text-slate-400"><span>{resource.title}</span><span>{extension.toUpperCase()}</span></div><pre className="overflow-auto p-4 text-[10px] leading-5 text-slate-300"><code>{code}</code></pre></div>;
}

export function ResearchTree({
  projectId,
  projectTitle,
  initialTemplate = "demo",
  focusNodeId = null,
  focusRequest = 0,
  noteOnly = false,
  overlayNote = false,
}: {
  projectId: number;
  projectTitle: string;
  initialTemplate?: string;
  focusNodeId?: string | null;
  focusRequest?: number;
  noteOnly?: boolean;
  overlayNote?: boolean;
}) {
  const [nodes, setNodes] = useState<TreeNode[]>(() => {
    try {
      const projectKey = `wispaper-research-canvas-nodes-${projectId}`;
      const savedRaw = window.localStorage.getItem(projectKey) || (projectId === 1 ? window.localStorage.getItem("wispaper-research-canvas-nodes") : null);
      const saved = JSON.parse(savedRaw || "[]") as TreeNode[];
      if (saved.length && saved.every((node) => node.id && "note" in node)) return saved.map((node) => node.root ? { ...node, title: projectTitle } : node);
    } catch { /* use mock defaults */ }
    if (initialTemplate === "blank") return [];
    if (initialTemplate !== "demo") return nodesFromTemplate(projectTitle, initialTemplate);
    return initialNodes.map((node) => node.id === "root" ? { ...node, title: projectTitle } : node);
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(() => new Set(nodes.map((node) => node.id)));
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>(() => {
    const allExpanded = new Set(nodes.map((node) => node.id));
    return calculateTreeLayout(nodes, allExpanded);
  });
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const undoStack = useRef<TreeSnapshot[]>([]);
  const redoStack = useRef<TreeSnapshot[]>([]);
  const [, setHistoryVersion] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [mockAgentEditing, setMockAgentEditing] = useState(false);
  const [mockCollaboratorEditing, setMockCollaboratorEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarTabs, setSidebarTabs] = useState<CanvasSidebarTab[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState("message-board");
  const [canvasAgentInput, setCanvasAgentInput] = useState("");
  const [canvasAgentMessages, setCanvasAgentMessages] = useState([
    { role: "agent", text: "我会从研究问题出发，创建候选研究方向，并为每个方向启动独立 Agent 调研。" },
    { role: "agent", text: "调研完成后，我会提炼值得研究的 Idea，继续寻找数据集、设计实验并记录结果。" },
  ]);
  const workflowTimers = useRef<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [editingNodeMeta, setEditingNodeMeta] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [draft, setDraft] = useState("");
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [toast, setToast] = useState("");
  const [messageBoardCollapsed, setMessageBoardCollapsed] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [boardMentionOpen, setBoardMentionOpen] = useState(false);
  const [agentLaunchDecision, setAgentLaunchDecision] = useState<"pending" | "running" | "cancelled">("pending");
  const [agentDialog, setAgentDialog] = useState<{ name: string; nodeTitle: string } | null>(null);
  const [fullScreenAttachment, setFullScreenAttachment] = useState<Resource | null>(null);
  const [boardMessages, setBoardMessages] = useState([
    { author: "博一新生林沐", role: "user", text: "我已整理 Lost in the Middle、RULER 和 NeedleBench，下一步想先确认数据许可。" },
    { author: "博三学长周启", role: "user", text: "建议先启动数据集调研 Agent，并把上下文长度和证据位置设为控制变量。" },
    { author: "项目助手", role: "agent", text: "我已生成数据集调研任务方案。是否现在启动数据集调研 Agent？" },
    { author: "导师陈教授", role: "user", text: "重点记录许可、评测指标和算力预算，结论需要保留失败分支。" },
  ]);

  useEffect(() => {
    const handleEmbeddedAgentNavigation = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "wispaper:close-agent-dialog") return;
      setAgentDialog(null);
    };
    window.addEventListener("message", handleEmbeddedAgentNavigation);
    return () => window.removeEventListener("message", handleEmbeddedAgentNavigation);
  }, []);
  const [mapScale, setMapScale] = useState(0.9);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [snapTargetId, setSnapTargetId] = useState<string | null>(null);
  const [selectedEdgeChildId, setSelectedEdgeChildId] = useState<string | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const panStart = useRef<{ pointerX: number; pointerY: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const nodeDrag = useRef<{ id: string; ids: string[]; pointerX: number; pointerY: number; startPositions: Record<string, NodePosition>; moved: boolean } | null>(null);
  const selectionStart = useRef<{ clientX: number; clientY: number; canvasLeft: number; canvasTop: number } | null>(null);
  const suppressNodeClick = useRef<string | null>(null);
  const snapTargetRef = useRef<string | null>(null);
  const saveTimer = useRef<number>();
  const previousNodeCount = useRef(nodes.length);
  const selected = nodes.find((node) => node.id === selectedId) ?? null;
  const [agentActivities, setAgentActivities] = useState<Record<string, AgentActivity>>(() => {
    try { return JSON.parse(window.localStorage.getItem("wispaper-canvas-agent-activity") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    if (previousNodeCount.current === nodes.length) return;
    previousNodeCount.current = nodes.length;
    if (!nodes.length) return;
    const layout = calculateTreeLayout(nodes, expanded);
    const root = nodes.find((node) => node.root);
    if (root && nodePositions[root.id]) layout[root.id] = nodePositions[root.id];
    setNodePositions(layout);
  }, [nodes.length]);

  const openNodeNoteTab = (node: TreeNode) => {
    const tab: CanvasSidebarTab = { id: `note-${node.id}`, type: "note", nodeId: node.id, title: node.title };
    setSidebarTabs((tabs) => [...tabs.filter((item) => item.type !== "note"), tab]);
    setSelectedIds(new Set([node.id]));
    setSelectedId(node.id);
    setActiveSidebarTab(tab.id);
    setMessageBoardCollapsed(false);
  };

  const openNodeAgentTab = (node: TreeNode, agentName = "实验复现 Agent") => {
    setAgentDialog({ name: agentName, nodeTitle: node.title });
  };

  const openAttachmentPreview = (resource: Resource) => {
    setFullScreenAttachment(resource);
  };

  const closeSidebarTab = (tabId: string) => {
    setSidebarTabs((tabs) => tabs.filter((tab) => tab.id !== tabId));
    if (activeSidebarTab === tabId) setActiveSidebarTab("canvas-agent");
  };

  const runCanvasAgent = () => {
    const prompt = canvasAgentInput.trim();
    if (!prompt) return;
    setCanvasAgentMessages((messages) => [...messages, { role: "user", text: prompt }, { role: "agent", text: "已更新画布结构，并将本次调整同步到相关节点。" }]);
    setCanvasAgentInput("");
    setNodes((items) => items.map((node) => node.root ? { ...node, updatedAt: Date.now() } : node));
    showToast("项目助手 已更新科研画布");
  };

  const runCanvasWorkflowDemo = (delayMs = 1200) => {
    workflowTimers.current.forEach((timer) => window.clearTimeout(timer));
    workflowTimers.current = [];
    const rootId = nodes.find((node) => node.root)?.id ?? "root";
    const additions: TreeNode[] = [
      { id: "direction-vector", title: "方向一：自适应向量记忆检索", category: "研究方向", tags: ["Agent调研"], updatedAt: Date.now(), parentId: rootId, note: "# 自适应向量记忆检索\n\n由方向调研 Agent 汇总相关工作与研究空白。", resources: [] },
      { id: "direction-graph", title: "方向二：时序知识图谱记忆", category: "研究方向", tags: ["Agent调研"], updatedAt: Date.now(), parentId: rootId, note: "# 时序知识图谱记忆\n\n由方向调研 Agent 分析时间推理与冲突消解。", resources: [] },
      { id: "direction-summary", title: "方向三：可追溯层级摘要", category: "研究方向", tags: ["Agent调研"], updatedAt: Date.now(), parentId: rootId, note: "# 可追溯层级摘要\n\n由方向调研 Agent 验证摘要漂移问题。", resources: [] },
      { id: "workflow-idea", title: "Idea：基于访问反馈的动态记忆路由", category: "Idea", tags: ["值得研究"], updatedAt: Date.now(), parentId: "direction-vector", note: "# 动态记忆路由\n\n根据历史访问反馈动态选择记忆层与检索策略。", resources: [] },
      { id: "workflow-dataset", title: "数据集：LoCoMo + LongMemEval", category: "数据集", tags: ["已确认"], updatedAt: Date.now(), parentId: "workflow-idea", note: "# 数据集\n\n使用 LoCoMo 与 LongMemEval 验证跨会话记忆能力。", resources: [] },
      { id: "workflow-experiment", title: "实验：动态路由与固定检索对照", category: "实验", tags: ["结果已记录"], updatedAt: Date.now(), parentId: "workflow-dataset", note: "# 实验记录\n\n动态路由方案在记忆问答与约束遵循上优于固定检索基线。", resources: [] },
    ];
    const positions: Record<string, NodePosition> = {
      "direction-vector": { x: 430, y: 40 }, "direction-graph": { x: 430, y: 220 }, "direction-summary": { x: 430, y: 400 },
      "workflow-idea": { x: 760, y: 40 }, "workflow-dataset": { x: 1090, y: 40 }, "workflow-experiment": { x: 1420, y: 40 },
    };
    const stages = [additions.slice(0, 3), additions.slice(3, 4), additions.slice(4, 5), additions.slice(5, 6)];
    const stageMessages = [
      "已创建 3 个候选研究方向，并分别启动方向调研 Agent。",
      "方向调研完成，已提炼出值得研究的动态记忆路由 Idea。",
      "已为该 Idea 匹配 LoCoMo 与 LongMemEval 数据集。",
      "已完成对照实验设计，并将实验结果写入画布。",
    ];
    setCanvasAgentMessages((messages) => [...messages, { role: "user", text: "从这个研究问题开始，完成研究方向探索到实验记录的全过程。" }]);
    setActiveSidebarTab("canvas-agent");
    setSidebarCollapsed(false);
    showToast(`画布演示已开始，每步间隔 ${delayMs / 1000} 秒`);
    stages.forEach((stage, index) => {
      const timer = window.setTimeout(() => {
        setNodes((items) => [...items, ...stage.filter((addition) => !items.some((item) => item.id === addition.id))]);
        setExpanded((items) => new Set([...items, rootId, ...stage.map((node) => node.id)]));
        setNodePositions((current) => ({ ...current, ...Object.fromEntries(stage.map((node) => [node.id, positions[node.id]])) }));
        setCanvasAgentMessages((messages) => [...messages, { role: "agent", text: stageMessages[index] }]);
        if (index === stages.length - 1) showToast("项目助手 已完成完整研究流程");
      }, delayMs * (index + 1));
      workflowTimers.current.push(timer);
    });
  };

  const runFullResearchUsecase = (delayMs = 1200) => {
    workflowTimers.current.forEach((timer) => window.clearTimeout(timer));
    workflowTimers.current = [];
    const now = Date.now();
    const stages: TreeNode[][] = [
      [{ id: "usecase-question", title: "研究问题：如何提升长周期 Agent 的记忆可靠性？", category: "研究问题", tags: ["起点"], updatedAt: now, parentId: null, root: true, note: "# 研究问题\n\n如何提升长周期 Agent 的记忆可靠性？", resources: [] }],
      [{ id: "usecase-literature", title: "文献调研：长期记忆方法与评测", category: "文献调研", tags: ["Agent运行中"], updatedAt: now, parentId: "usecase-question", note: "# 文献调研\n\nAgent 正在检索长期记忆架构、评测基准与典型失败模式。", resources: [] }],
      [
        { id: "usecase-point-1", title: "推荐点一：动态记忆路由", category: "研究方向", tags: ["独立Agent"], updatedAt: now, parentId: "usecase-literature", note: "# 动态记忆路由\n\n根据任务和访问反馈动态选择记忆层。", resources: [] },
        { id: "usecase-point-2", title: "推荐点二：冲突事实版本链", category: "研究方向", tags: ["独立Agent"], updatedAt: now, parentId: "usecase-literature", note: "# 冲突事实版本链\n\n显式管理事实的有效时间与版本。", resources: [] },
        { id: "usecase-point-3", title: "推荐点三：可追溯层级摘要", category: "研究方向", tags: ["独立Agent"], updatedAt: now, parentId: "usecase-literature", note: "# 可追溯层级摘要\n\n降低递归摘要的信息漂移。", resources: [] },
      ],
      [1, 2, 3].map((index) => ({ id: `usecase-design-${index}`, title: `实验设计 ${index}：基线、变量与指标`, category: "实验设计", tags: ["Agent完成"], updatedAt: now, parentId: `usecase-point-${index}`, note: "# 实验设计\n\n定义对照基线、自变量、评价指标与消融实验。", resources: [] })),
      [
        { id: "usecase-dataset-1", title: "数据集 1：LoCoMo / LongMemEval", category: "数据集", tags: ["已匹配"], updatedAt: now, parentId: "usecase-design-1", note: "# 数据集\n\nAgent 已完成数据集查找与适用性检查。", resources: [] },
        { id: "usecase-dataset-2", title: "数据集 2：内部会话集（授权失败）", category: "失败记录", tags: ["访问被拒"], updatedAt: now, parentId: "usecase-design-2", note: "# 数据集授权失败\n\n内部会话数据未获得隐私审批，不能用于本轮实验。", resources: [] },
        { id: "usecase-dataset-2-alt", title: "替代数据集：MSC + PERSONA-CHAT", category: "数据集", tags: ["替代方案"], updatedAt: now, parentId: "usecase-design-2", note: "# 替代数据集\n\n改用公开数据集继续验证冲突事实版本链。", resources: [] },
        { id: "usecase-dataset-3", title: "数据集 3：QMSum 长对话子集", category: "数据集", tags: ["已匹配"], updatedAt: now, parentId: "usecase-design-3", note: "# 数据集\n\n用于测试层级摘要的可追溯性和信息漂移。", resources: [] },
      ],
      [
        { id: "usecase-experiment-1", title: "运行实验 1：训练、评测与消融", category: "实验", tags: ["运行完成"], updatedAt: now, parentId: "usecase-dataset-1", note: "# 实验运行\n\n已完成基线、主实验与关键消融。", resources: [] },
        { id: "usecase-experiment-2-failed", title: "实验 2A：全量图构建（显存溢出）", category: "失败记录", tags: ["OOM"], updatedAt: now, parentId: "usecase-dataset-2-alt", note: "# 实验失败\n\n全量图构建出现显存溢出，保留日志并调整方案。", resources: [] },
        { id: "usecase-experiment-2", title: "实验 2B：分批构图降采样重试", category: "实验", tags: ["重试完成"], updatedAt: now, parentId: "usecase-dataset-2-alt", note: "# 重试实验\n\n采用分批构图与邻居降采样后完成实验。", resources: [] },
        { id: "usecase-experiment-3", title: "运行实验 3：层级摘要对照", category: "实验", tags: ["无显著提升"], updatedAt: now, parentId: "usecase-dataset-3", note: "# 实验运行\n\n主要指标未达到预设提升阈值。", resources: [] },
      ],
      [
        { id: "usecase-result-1", title: "结果分析 1：动态路由显著提升", category: "结果分析", tags: ["正向结果"], updatedAt: now, parentId: "usecase-experiment-1", note: "# 结果分析\n\n动态路由在记忆问答和约束遵循上取得显著提升。\n\n完整指标、各随机种子结果与消融明细见 [文件 · experiment-results.xlsx](#resource-experiment-results-xlsx)。", resources: [{ id: "experiment-results-xlsx", kind: "文件", title: "experiment-results.xlsx" }] },
        { id: "usecase-result-2-failure", title: "失败分析：全量图方案资源不可行", category: "失败记录", tags: ["保留结论"], updatedAt: now, parentId: "usecase-experiment-2-failed", note: "# 失败分析\n\n全量图方案资源开销不可接受，转向稀疏构图。", resources: [] },
        { id: "usecase-result-2", title: "结果分析 2：稀疏构图可行但收益有限", category: "结果分析", tags: ["继续观察"], updatedAt: now, parentId: "usecase-experiment-2", note: "# 结果分析\n\n重试成功，但收益不足以覆盖额外复杂度。", resources: [] },
        { id: "usecase-result-3", title: "失败 Case：层级摘要未优于平面摘要", category: "失败记录", tags: ["假设未成立"], updatedAt: now, parentId: "usecase-experiment-3", note: "# 失败 Case\n\n层级摘要没有显著优于平面摘要，记录反例并停止扩展。", resources: [] },
      ],
    ];
    const positions: Record<string, NodePosition> = { "usecase-question": { x: 40, y: 250 }, "usecase-literature": { x: 340, y: 250 } };
    [1, 2, 3].forEach((index) => {
      const y = [40, 250, 560][index - 1];
      positions[`usecase-point-${index}`] = { x: 640, y };
      positions[`usecase-design-${index}`] = { x: 940, y };
      positions[`usecase-dataset-${index}`] = { x: 1240, y };
      positions[`usecase-experiment-${index}`] = { x: 1540, y };
      positions[`usecase-result-${index}`] = { x: 1840, y };
    });
    positions["usecase-dataset-2-alt"] = { x: 1240, y: 390 };
    positions["usecase-experiment-2-failed"] = { x: 1540, y: 250 };
    positions["usecase-experiment-2"] = { x: 1540, y: 390 };
    positions["usecase-result-2-failure"] = { x: 1840, y: 250 };
    positions["usecase-result-2"] = { x: 1840, y: 390 };
    const messages = [
      "已创建空白项目，并写入核心研究问题。",
      "已启动文献调研 Agent，开始检索相关方法、数据集与研究空白。",
      "文献调研完成，推荐 3 个研究点，并为每个研究点启动独立 Agent。",
      "3 个方向 Agent 已分别完成实验设计。",
      "数据集查找出现授权失败，已保留失败节点并切换到公开替代数据集。",
      "实验过程中出现显存溢出；失败日志已记录，降采样重试完成。",
      "结果分析完成：一条方向获得正向结果，两条方向收益有限或假设未成立；Excel 实验结果已插入结果笔记。",
    ];
    const focusNodes = stages.map((stage) => stage[0]);
    const agentNames = ["项目助手", "文献调研 Agent", "方向研究 Agent", "实验设计 Agent", "数据集查找 Agent", "实验运行 Agent", "结果分析 Agent"];
    const stageInterval = delayMs * 2.5;
    setNodes([]);
    setExpanded(new Set());
    setNodePositions({});
    setCanvasAgentMessages([{ role: "agent", text: "完整研究用例已启动。我会按阶段更新画布。" }]);
    setActiveSidebarTab("canvas-agent");
    setSidebarCollapsed(false);
    showToast(`完整研究用例已启动，每步间隔 ${delayMs / 1000} 秒`);
    stages.forEach((stage, index) => {
      const stageTimer = window.setTimeout(() => {
        setNodes((items) => [...items, ...stage]);
        setExpanded((items) => new Set([...items, ...stage.map((node) => node.id)]));
        setNodePositions((current) => ({ ...current, ...Object.fromEntries(stage.map((node) => [node.id, positions[node.id]])) }));
        setCanvasAgentMessages((items) => [...items, { role: "agent", text: messages[index] }]);
      }, delayMs + stageInterval * index);
      const noteTimer = window.setTimeout(() => openNodeNoteTab(focusNodes[index]), delayMs * 1.4 + stageInterval * index);
      const agentTimer = window.setTimeout(() => {
        if (index === 0) { setActiveSidebarTab("canvas-agent"); setSidebarCollapsed(false); }
        else openNodeAgentTab(focusNodes[index], agentNames[index]);
        if (index === stages.length - 1) showToast("多 Agent 完整研究用例已完成");
      }, delayMs * 2.1 + stageInterval * index);
      workflowTimers.current.push(stageTimer, noteTimer, agentTimer);
    });
  };

  useEffect(() => {
    const handleCanvasWorkflowDemo = (event: Event) => runCanvasWorkflowDemo((event as CustomEvent<{ delayMs?: number }>).detail?.delayMs ?? 1200);
    const handleFullResearchUsecase = (event: Event) => runFullResearchUsecase((event as CustomEvent<{ delayMs?: number }>).detail?.delayMs ?? 1200);
    window.addEventListener("wispaper:mock-canvas-workflow-demo", handleCanvasWorkflowDemo);
    window.addEventListener("wispaper:mock-run-full-research-usecase", handleFullResearchUsecase);
    return () => {
      window.removeEventListener("wispaper:mock-canvas-workflow-demo", handleCanvasWorkflowDemo);
      window.removeEventListener("wispaper:mock-run-full-research-usecase", handleFullResearchUsecase);
    };
  }, [nodes]);
  useEffect(() => () => workflowTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => setEditingNodeMeta(false), [selectedId]);
  useEffect(() => {
    const handleMockAgentEditing = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      setMockAgentEditing(detail?.active === true);
      if (detail?.active === true) setMockCollaboratorEditing(false);
    };
    const handleMockCollaboratorEditing = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      setMockCollaboratorEditing(detail?.active === true);
      if (detail?.active === true) setMockAgentEditing(false);
    };
    window.addEventListener("wispaper:mock-agent-block-editing", handleMockAgentEditing);
    window.addEventListener("wispaper:mock-collaborator-block-editing", handleMockCollaboratorEditing);
    return () => {
      window.removeEventListener("wispaper:mock-agent-block-editing", handleMockAgentEditing);
      window.removeEventListener("wispaper:mock-collaborator-block-editing", handleMockCollaboratorEditing);
    };
  }, []);
  useEffect(() => {
    if (!focusNodeId || !nodes.some((node) => node.id === focusNodeId)) return;
    setSelectedIds(new Set([focusNodeId]));
    setSelectedId(focusNodeId);
  }, [focusNodeId, focusRequest, nodes]);
  useEffect(() => {
    const syncAgentActivities = () => {
      try { setAgentActivities(JSON.parse(window.localStorage.getItem("wispaper-canvas-agent-activity") || "{}")); } catch { setAgentActivities({}); }
    };
    window.addEventListener("wispaper-canvas-agent-activity", syncAgentActivities);
    window.addEventListener("storage", syncAgentActivities);
    return () => {
      window.removeEventListener("wispaper-canvas-agent-activity", syncAgentActivities);
      window.removeEventListener("storage", syncAgentActivities);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(`wispaper-research-canvas-nodes-${projectId}`, JSON.stringify(nodes.map((node) => ({
      ...node,
      category: node.category || defaultNodeCategories[node.id] || "探索",
      noteSummary: node.note.replace(/[#*\[\]()]/g, "").slice(0, 240),
    }))));
  }, [nodes, projectId]);

  const children = (parentId: string) => nodes.filter((node) => node.parentId === parentId);
  const descendants = (id: string): TreeNode[] => children(id).flatMap((child) => [child, ...descendants(child.id)]);
  const visibleNodes = useMemo(() => {
    const result: TreeNode[] = [];
    const visit = (node: TreeNode) => { result.push(node); if (expanded.has(node.id)) children(node.id).forEach(visit); };
    nodes.filter((node) => node.parentId === null).sort((a, b) => Number(b.root) - Number(a.root)).forEach(visit);
    return result;
  }, [nodes, expanded]);
  useEffect(() => {
    const layout = calculateTreeLayout(nodes, expanded);
    setNodePositions((current) => {
      const next = { ...current };
      visibleNodes.forEach((node) => { if (!next[node.id]) next[node.id] = layout[node.id]; });
      return next;
    });
  }, [nodes.length, expanded, visibleNodes]);
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const nodeCategory = (node: TreeNode) => node.category || defaultNodeCategories[node.id] || "探索";
  const demoAgentNodeId = visibleNodes.find((node) => nodeCategory(node).includes("实验"))?.id;
  const workflowAgentNodeIds = new Set([demoAgentNodeId, "direction-vector", "direction-graph", "direction-summary", "usecase-literature", "usecase-point-1", "usecase-point-2", "usecase-point-3"]);
  const nodeTags = (node: TreeNode) => node.tags || defaultNodeTags[node.id] || [];
  const categoryIcon = (category: string): React.ElementType => category.includes("实验") ? FlaskConical : category.includes("假设") ? Lightbulb : category.includes("研究") || category.includes("问题") ? Search : category.includes("失败") ? X : FolderTree;
  const categoryColorOptions: Array<{ id: CategoryColor; label: string; dot: string }> = [
    { id: "violet", label: "紫色", dot: "bg-violet-500" }, { id: "indigo", label: "靛蓝", dot: "bg-indigo-500" },
    { id: "blue", label: "蓝色", dot: "bg-blue-500" }, { id: "cyan", label: "青色", dot: "bg-cyan-500" },
    { id: "teal", label: "青绿", dot: "bg-teal-500" }, { id: "emerald", label: "绿色", dot: "bg-emerald-500" },
    { id: "amber", label: "黄色", dot: "bg-amber-400" }, { id: "orange", label: "橙色", dot: "bg-orange-500" },
    { id: "rose", label: "红色", dot: "bg-rose-500" }, { id: "fuchsia", label: "粉紫", dot: "bg-fuchsia-500" },
  ];
  const categoryColorMap: Record<CategoryColor, { label: string; card: string; filled: string }> = {
    violet: { label: "bg-violet-600 text-white shadow-sm shadow-violet-200", card: "border-violet-500 bg-white text-slate-900 shadow-violet-200/50", filled: "border-violet-500 bg-violet-100 text-slate-900 shadow-violet-200/50" },
    indigo: { label: "bg-indigo-600 text-white shadow-sm shadow-indigo-200", card: "border-indigo-500 bg-white text-slate-900 shadow-indigo-200/50", filled: "border-indigo-500 bg-indigo-100 text-slate-900 shadow-indigo-200/50" },
    blue: { label: "bg-blue-600 text-white shadow-sm shadow-blue-200", card: "border-blue-500 bg-white text-slate-900 shadow-blue-200/50", filled: "border-blue-500 bg-blue-100 text-slate-900 shadow-blue-200/50" },
    cyan: { label: "bg-cyan-600 text-white shadow-sm shadow-cyan-200", card: "border-cyan-500 bg-white text-slate-900 shadow-cyan-200/50", filled: "border-cyan-500 bg-cyan-100 text-slate-900 shadow-cyan-200/50" },
    teal: { label: "bg-teal-600 text-white shadow-sm shadow-teal-200", card: "border-teal-500 bg-white text-slate-900 shadow-teal-200/50", filled: "border-teal-500 bg-teal-100 text-slate-900 shadow-teal-200/50" },
    emerald: { label: "bg-emerald-600 text-white shadow-sm shadow-emerald-200", card: "border-emerald-500 bg-white text-slate-900 shadow-emerald-200/50", filled: "border-emerald-500 bg-emerald-100 text-slate-900 shadow-emerald-200/50" },
    amber: { label: "bg-amber-400 text-amber-950 shadow-sm shadow-amber-200", card: "border-amber-400 bg-white text-slate-900 shadow-amber-200/50", filled: "border-amber-400 bg-amber-100 text-slate-900 shadow-amber-200/50" },
    orange: { label: "bg-orange-500 text-white shadow-sm shadow-orange-200", card: "border-orange-500 bg-white text-slate-900 shadow-orange-200/50", filled: "border-orange-500 bg-orange-100 text-slate-900 shadow-orange-200/50" },
    rose: { label: "bg-rose-500 text-white shadow-sm shadow-rose-200", card: "border-rose-500 bg-white text-slate-900 shadow-rose-200/50", filled: "border-rose-500 bg-rose-100 text-slate-900 shadow-rose-200/50" },
    fuchsia: { label: "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-200", card: "border-fuchsia-500 bg-white text-slate-900 shadow-fuchsia-200/50", filled: "border-fuchsia-500 bg-fuchsia-100 text-slate-900 shadow-fuchsia-200/50" },
  };
  const inferredCategoryColor = (category: string): CategoryColor => {
    const presets: Record<string, CategoryColor> = { "研究问题": "violet", "方法": "cyan", "实验": "emerald", "假设": "amber", "失败记录": "rose", "研究主题": "indigo", "方法设计": "blue", "技术路线": "orange" };
    if (presets[category]) return presets[category];
    const palette: CategoryColor[] = ["teal", "fuchsia", "orange", "blue"];
    return palette[[...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
  };
  const categoryClass = (category: string, color?: CategoryColor) => {
    if (color) return categoryColorMap[color].label;
    const presets: Record<string, string> = {
      "研究问题": "bg-violet-600 text-white shadow-sm shadow-violet-200", "方法": "bg-cyan-600 text-white shadow-sm shadow-cyan-200", "实验": "bg-emerald-600 text-white shadow-sm shadow-emerald-200",
      "假设": "bg-amber-400 text-amber-950 shadow-sm shadow-amber-200", "失败记录": "bg-rose-500 text-white shadow-sm shadow-rose-200",
      "研究主题": "bg-indigo-600 text-white shadow-sm shadow-indigo-200", "方法设计": "bg-sky-600 text-white shadow-sm shadow-sky-200", "技术路线": "bg-orange-500 text-white shadow-sm shadow-orange-200",
    };
    if (presets[category]) return presets[category];
    const palette = ["bg-teal-600 text-white shadow-sm shadow-teal-200", "bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-200", "bg-orange-500 text-white shadow-sm shadow-orange-200", "bg-sky-600 text-white shadow-sm shadow-sky-200"];
    return palette[[...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
  };
  const categoryCardClass = (category: string, color?: CategoryColor) => {
    if (color) return category === "研究主题" ? categoryColorMap[color].filled : categoryColorMap[color].card;
    const presets: Record<string, string> = {
      "研究问题": "border-violet-500 bg-white text-slate-900 shadow-violet-200/50", "方法": "border-cyan-500 bg-white text-slate-900 shadow-cyan-200/50",
      "实验": "border-emerald-500 bg-white text-slate-900 shadow-emerald-200/50", "假设": "border-amber-400 bg-white text-slate-900 shadow-amber-200/50", "失败记录": "border-rose-500 bg-white text-slate-900 shadow-rose-200/50",
      "研究主题": "border-indigo-500 bg-indigo-100 text-slate-900 shadow-indigo-200/50", "方法设计": "border-sky-500 bg-white text-slate-900 shadow-sky-200/50", "技术路线": "border-orange-500 bg-white text-slate-900 shadow-orange-200/50",
    };
    if (presets[category]) return presets[category];
    const palette = ["border-teal-500 bg-white text-slate-900 shadow-teal-200/50", "border-fuchsia-500 bg-white text-slate-900 shadow-fuchsia-200/50", "border-orange-500 bg-white text-slate-900 shadow-orange-200/50", "border-sky-500 bg-white text-slate-900 shadow-sky-200/50"];
    return palette[[...category].reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length];
  };
  const updateNodeMeta = (id: string, patch: Partial<Pick<TreeNode, "title" | "category" | "categoryColor" | "tags">>) => setNodes((items) => items.map((item) => {
    if (item.id !== id) return item;
    const nextNote = patch.title && /^# .+/m.test(item.note) ? item.note.replace(/^# .+/m, `# ${patch.title}`) : item.note;
    return { ...item, ...patch, note: nextNote, updatedAt: Date.now() };
  }));
  const updatedLabel = (node: TreeNode) => node.updatedAt ? "刚刚更新" : "今天 10:24";
  const currentSnapshot = (): TreeSnapshot => ({ nodes, expanded: [...expanded], selectedId });
  const applySnapshot = (snapshot: TreeSnapshot) => {
    setNodes(snapshot.nodes);
    setExpanded(new Set(snapshot.expanded));
    setSelectedId(snapshot.selectedId);
  };
  const recordHistory = () => {
    undoStack.current = [...undoStack.current.slice(-49), currentSnapshot()];
    redoStack.current = [];
    setHistoryVersion((value) => value + 1);
  };
  const undo = () => {
    const snapshot = undoStack.current.pop();
    if (!snapshot) return;
    redoStack.current.push(currentSnapshot());
    applySnapshot(snapshot);
    setHistoryVersion((value) => value + 1);
    showToast("已撤销上一步操作");
  };
  const redo = () => {
    const snapshot = redoStack.current.pop();
    if (!snapshot) return;
    undoStack.current.push(currentSnapshot());
    applySnapshot(snapshot);
    setHistoryVersion((value) => value + 1);
    showToast("已重做上一步操作");
  };

  const reparentNode = (draggedId: string, targetId: string) => {
    const dragged = nodes.find((item) => item.id === draggedId);
    const target = nodes.find((item) => item.id === targetId);
    if (!dragged || !target || dragged.root || draggedId === targetId || descendants(draggedId).some((child) => child.id === targetId)) {
      showToast("不能将节点移动到自身或其子节点下");
    } else if (dragged.parentId !== targetId) {
      recordHistory();
      setNodes((items) => items.map((item) => item.id === draggedId ? { ...item, parentId: targetId } : item));
      setExpanded((items) => new Set(items).add(targetId));
      showToast(`已将「${dragged.title}」移动到「${target.title}」下`);
    }
    setDraggedNodeId(null);
    setSnapTargetId(null);
  };

  const addNode = (anchor: TreeNode, sibling: boolean) => {
    if (sibling && anchor.root) { showToast("根节点不可添加同级节点"); return; }
    const parentId = sibling ? anchor.parentId : anchor.id;
    const node: TreeNode = { id: `n-${Date.now()}`, title: "未命名探索", category: "研究问题", tags: ["新建"], updatedAt: Date.now(), parentId, note: "", resources: [] };
    recordHistory();
    setNodes((items) => [...items, node]);
    setExpanded((items) => new Set(items).add(parentId || "root"));
    setSelectedId(node.id);
    setEditingNodeMeta(true);
  };

  const deleteNode = (id: string) => {
    const node = nodes.find((item) => item.id === id);
    if (!node || node.root) { showToast("根节点不可删除"); return; }
    const childNodes = descendants(id);
    const ids = new Set([id, ...childNodes.map((item) => item.id)]);
    recordHistory();
    setNodes((items) => items.filter((item) => !ids.has(item.id)));
    setSelectedId(null);
    showToast(`已删除「${node.title}」，可撤销`);
  };

  const addIsolatedNode = () => {
    recordHistory();
    const id = `isolated-${Date.now()}`;
    const node: TreeNode = { id, title: "未命名研究节点", category: "探索", tags: [], updatedAt: Date.now(), parentId: null, note: "", resources: [] };
    const isolatedCount = nodes.filter((item) => item.parentId === null).length;
    setNodes((items) => [...items, node]);
    setExpanded((items) => new Set(items).add(id));
    setNodePositions((items) => ({ ...items, [id]: { x: 140 + isolatedCount * 38, y: 180 + isolatedCount * 155 } }));
    setSelectedIds(new Set([id]));
    setSelectedId(id);
    setSelectedEdgeChildId(null);
    showToast("已添加孤立节点");
  };

  const deleteEdge = (childId: string) => {
    const child = nodes.find((node) => node.id === childId);
    if (!child?.parentId) return;
    recordHistory();
    setNodes((items) => items.map((node) => node.id === childId ? { ...node, parentId: null, updatedAt: Date.now() } : node));
    setSelectedEdgeChildId(null);
    showToast(`已删除与「${child.title}」的连线，节点保留为孤立节点`);
  };

  const openEditor = () => { if (!selected) return; setDraft(selected.note); setEditing(true); };
  const updateDraft = (value: string) => {
    setDraft(value); setSaveState("saving");
    setNodes((items) => items.map((node) => node.id === selected?.id ? { ...node, note: value, updatedAt: Date.now() } : node));
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setSaveState("saved");
    }, 650);
  };
  const attachResource = (resource: Resource) => {
    setNodes((items) => items.map((node) => node.id === selected?.id && !node.resources.some((r) => r.id === resource.id)
      ? { ...node, resources: [...node.resources, resource] } : node));
  };

  /* Legacy recursive tree rendering was replaced by the freely positioned card canvas. */
  const MindMapBranch = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
    const nodeChildren = children(node.id); const isOpen = expanded.has(node.id);
    const visibleWeight = (item: TreeNode): number => {
      const itemChildren = children(item.id);
      return expanded.has(item.id) && itemChildren.length ? itemChildren.reduce((sum, child) => sum + visibleWeight(child), 0) : 1;
    };
    const childWeights = nodeChildren.map(visibleWeight);
    const totalChildWeight = childWeights.reduce((sum, weight) => sum + weight, 0);
    let accumulatedWeight = 0;
    const childCurveY = childWeights.map((weight) => {
      const y = ((accumulatedWeight + weight / 2) / totalChildWeight) * 100;
      accumulatedWeight += weight;
      return y;
    });
    const hiddenNodeCount = !isOpen ? descendants(node.id).length : 0;
    return <div className="flex items-center">
      <div className="relative shrink-0">
      {hiddenNodeCount > 0 && <>
        <span className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm" />
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border border-slate-200 bg-white shadow-sm" />
        <span className="absolute -right-3 -top-3 z-30 grid h-7 min-w-7 place-items-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white shadow-lg ring-2 ring-white">+{hiddenNodeCount}</span>
      </>}
      <div
        data-tree-node-id={node.id}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        draggable={!node.root}
        onDragStart={(event) => { event.dataTransfer.setData("text/node-id", node.id); event.dataTransfer.effectAllowed = "move"; setDraggedNodeId(node.id); }}
        onDragEnd={() => { setDraggedNodeId(null); setSnapTargetId(null); }}
        onDragOver={(event) => { if (draggedNodeId && draggedNodeId !== node.id && !descendants(draggedNodeId).some((child) => child.id === node.id)) { event.preventDefault(); setSnapTargetId(node.id); } }}
        onDrop={(event) => {
          event.preventDefault(); event.stopPropagation(); const draggedId = event.dataTransfer.getData("text/node-id") || draggedNodeId;
          if (draggedId) reparentNode(draggedId, node.id);
        }}
        className={`group relative flex min-h-[96px] w-[230px] shrink-0 select-none items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${snapTargetId === node.id ? "z-30 scale-[1.06] border-emerald-400 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-200/80 shadow-xl" : selectedId === node.id ? "border-blue-500 bg-blue-50 text-blue-900 ring-4 ring-blue-100/70" : node.root ? "border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-200" : "border-slate-200 bg-white text-slate-700"}`}
      >
        {snapTargetId === node.id && <span className="absolute -top-7 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">释放，设为父节点</span>}
        {!node.root && <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300 opacity-0 group-hover:opacity-100" />}
        <div onClick={() => setSelectedId(node.id)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${node.root ? "bg-white/15 text-white" : selectedId === node.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}><FolderTree className="h-4 w-4" /></span>
          {editingTitle === node.id ? <span className="flex min-w-0 flex-1 flex-col gap-1.5"><input autoFocus value={node.title} onClick={(e) => e.stopPropagation()} onChange={(e) => setNodes((items) => items.map((item) => item.id === node.id ? { ...item, title: e.target.value } : item))} onKeyDown={(e) => e.key === "Enter" && setEditingTitle(null)} className="min-w-0 rounded border border-blue-300 bg-white px-1.5 py-0.5 text-slate-800 outline-none" /><input value={nodeCategory(node)} placeholder="自定义类别" onClick={(e) => e.stopPropagation()} onChange={(e) => setNodes((items) => items.map((item) => item.id === node.id ? { ...item, category: e.target.value } : item))} onKeyDown={(e) => e.key === "Enter" && setEditingTitle(null)} className="min-w-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-600 outline-none" /></span> : <span className="flex min-w-0 flex-1 flex-col gap-1.5"><span className="truncate font-semibold">{node.title}</span><span className={`w-fit max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryClass(nodeCategory(node), node.categoryColor)}`}>{nodeCategory(node)}</span></span>}
        </div>
        <button onClick={() => addNode(node, false)} className="absolute -right-4 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-blue-600 text-white opacity-0 shadow-lg transition-opacity hover:bg-blue-700 group-hover:opacity-100" title="添加子节点"><Plus className="h-4 w-4" /></button>
        {nodeChildren.length > 0 && <button onClick={() => setExpanded((items) => { const next = new Set(items); next.has(node.id) ? next.delete(node.id) : next.add(node.id); return next; })} className="absolute -left-3 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 opacity-0 shadow-sm group-hover:opacity-100" title={isOpen ? "折叠分支" : "展开分支"}>{isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</button>}
        <div className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {!node.root && <button onClick={() => addNode(node, true)} className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700" title="添加同级节点" aria-label="添加同级节点"><Plus className="h-3.5 w-3.5" /></button>}
          <button onClick={() => { recordHistory(); setEditingTitle(node.id); }} className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" title="编辑节点卡片" aria-label="编辑节点卡片"><Edit3 className="h-3.5 w-3.5" /></button>
          {!node.root && <button onClick={() => deleteNode(node.id)} className="grid h-7 w-7 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="删除节点" aria-label="删除节点"><Trash2 className="h-3.5 w-3.5" /></button>}
        </div>
      </div>
      </div>
      {isOpen && nodeChildren.length > 0 && <div className="relative ml-12 flex flex-col gap-8 py-5 pl-10">
        <svg className="pointer-events-none absolute -left-12 top-0 h-full w-[88px] overflow-visible" viewBox="0 0 88 100" preserveAspectRatio="none" aria-hidden="true">
          {childCurveY.map((targetY, index) => <path key={nodeChildren[index].id} d={`M 0 50 C 32 50, 48 ${targetY}, 88 ${targetY}`} fill="none" stroke="#bfdbfe" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
        </svg>
        {nodeChildren.map((child) => <div key={child.id} className="relative"><MindMapBranch node={child} depth={depth + 1} /></div>)}
      </div>}
    </div>;
  };

  const CanvasNodeCard = ({ node }: { node: TreeNode }) => {
    const nodeChildren = children(node.id);
    const isOpen = expanded.has(node.id);
    const hiddenNodeCount = !isOpen ? descendants(node.id).length : 0;
    const CategoryIcon = categoryIcon(nodeCategory(node));
    return <div
      data-tree-node-id={node.id}
      onPointerDown={(event) => {
        event.stopPropagation();
        if ((event.target as HTMLElement).closest("button,input")) return;
        if (event.metaKey) {
          event.preventDefault();
          setSelectedIds((items) => { const next = new Set(items); next.has(node.id) ? next.delete(node.id) : next.add(node.id); return next; });
          setSelectedId(null);
          return;
        }
        if (node.root) {
          openNodeNoteTab(node);
          return;
        }
        const position = nodePositions[node.id]; if (!position) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const ids = selectedIds.has(node.id) ? [...selectedIds].filter((id) => !nodes.find((item) => item.id === id)?.root) : [node.id];
        const startPositions = Object.fromEntries(ids.map((id) => [id, nodePositions[id]]).filter((entry) => entry[1])) as Record<string, NodePosition>;
        nodeDrag.current = { id: node.id, ids, pointerX: event.clientX, pointerY: event.clientY, startPositions, moved: false };
        setDraggedNodeId(node.id);
      }}
      onPointerMove={(event) => {
        const drag = nodeDrag.current; if (!drag || drag.id !== node.id) return;
        const dx = (event.clientX - drag.pointerX) / mapScale; const dy = (event.clientY - drag.pointerY) / mapScale;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) drag.moved = true;
        setNodePositions((items) => {
          const next = { ...items };
          drag.ids.forEach((id) => { const start = drag.startPositions[id]; if (start) next[id] = { x: start.x + dx, y: start.y + dy }; });
          return next;
        });
        if (drag.ids.length > 1) { snapTargetRef.current = null; setSnapTargetId(null); return; }
        let nearest: { id: string; distance: number } | null = null;
        const invalid = new Set([node.id, ...descendants(node.id).map((item) => item.id)]);
        const movingRect = event.currentTarget.getBoundingClientRect();
        document.querySelectorAll<HTMLElement>("[data-tree-node-id]").forEach((element) => {
          const id = element.dataset.treeNodeId; if (!id || invalid.has(id)) return;
          const rect = element.getBoundingClientRect();
          const gapX = Math.max(rect.left - movingRect.right, movingRect.left - rect.right, 0);
          const gapY = Math.max(rect.top - movingRect.bottom, movingRect.top - rect.bottom, 0);
          const distance = Math.hypot(gapX, gapY);
          if (distance <= 150 && (!nearest || distance < nearest.distance)) nearest = { id, distance };
        });
        snapTargetRef.current = nearest?.id || null; setSnapTargetId(snapTargetRef.current);
      }}
      onPointerUp={(event) => {
        const drag = nodeDrag.current; if (!drag || drag.id !== node.id) return;
        if (drag.moved) {
          suppressNodeClick.current = node.id;
          window.setTimeout(() => { if (suppressNodeClick.current === node.id) suppressNodeClick.current = null; }, 0);
          if (snapTargetRef.current) reparentNode(node.id, snapTargetRef.current);
        } else {
          openNodeNoteTab(node);
        }
        nodeDrag.current = null; snapTargetRef.current = null; setDraggedNodeId(null); setSnapTargetId(null);
        try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* already released */ }
      }}
      className={`group absolute flex min-h-[138px] w-[260px] select-none flex-col items-stretch rounded-2xl border-2 px-4 py-3 text-sm shadow-sm transition-[box-shadow,border-color,background-color] hover:shadow-md ${node.root ? "cursor-default" : "cursor-grab active:cursor-grabbing"} ${categoryCardClass(nodeCategory(node), node.categoryColor)} ${snapTargetId === node.id ? "z-30 scale-[1.04] ring-4 ring-emerald-300/80 shadow-xl" : selectedIds.has(node.id) ? "ring-4 ring-blue-300/80 shadow-md" : ""}`}
      style={{ left: nodePositions[node.id]?.x || 0, top: nodePositions[node.id]?.y || 0 }}
    >
      {snapTargetId === node.id && <span className="absolute -top-7 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">释放，设为父节点</span>}
      {hiddenNodeCount > 0 && <span className="absolute -left-2 -top-3 z-30 grid h-7 min-w-7 place-items-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white shadow-lg ring-2 ring-white">+{hiddenNodeCount}</span>}
      <div onClick={(event) => {
        if (suppressNodeClick.current === node.id) { suppressNodeClick.current = null; return; }
        if (event.metaKey) return;
        openNodeNoteTab(node);
      }} className="flex min-w-0 flex-1 cursor-pointer flex-col">
        <span className={`inline-flex w-fit max-w-full items-center gap-1.5 truncate rounded-full px-2 py-1 text-[10px] font-semibold ${categoryClass(nodeCategory(node), node.categoryColor)}`}><CategoryIcon className="h-3 w-3 shrink-0" />{nodeCategory(node)}</span>
        <span className="mt-2 line-clamp-2 text-[15px] font-semibold leading-5">{node.title}</span>
        <span className="mt-2 flex min-w-0 gap-1">{nodeTags(node).slice(0, 2).map((tag) => <span key={tag} className="max-w-24 truncate rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">#{tag}</span>)}</span>
        <span className="mt-auto flex items-center justify-between gap-2 border-t border-current/10 pt-2 text-[9px] opacity-70"><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{updatedLabel(node)}</span>{workflowAgentNodeIds.has(node.id) && <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); openNodeAgentTab(node, node.id === demoAgentNodeId ? "实验复现 Agent" : "方向调研 Agent"); }} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-700 hover:bg-blue-100" aria-label={`打开 ${node.id === demoAgentNodeId ? "GPU 实验" : "方向调研"} Agent 对话`}><LoaderCircle className="h-3 w-3 animate-spin" /><span>{node.id === demoAgentNodeId ? "实验复现" : "调研中"}</span></button>}</span>
      </div>
      <button onPointerDown={(event) => event.stopPropagation()} onClick={() => addNode(node, false)} className="absolute -right-4 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-blue-600 text-white opacity-0 shadow-lg transition-opacity hover:bg-blue-700 group-hover:opacity-100" title="添加子节点"><Plus className="h-4 w-4" /></button>
      {nodeChildren.length > 0 && <button onPointerDown={(event) => event.stopPropagation()} onClick={() => setExpanded((items) => { const next = new Set(items); next.has(node.id) ? next.delete(node.id) : next.add(node.id); return next; })} className="absolute -left-3 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 opacity-0 shadow-sm group-hover:opacity-100" title={isOpen ? "折叠分支" : "展开分支"}>{isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}</button>}
      <div onPointerDown={(event) => event.stopPropagation()} className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {!node.root && <button onClick={() => addNode(node, true)} className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700" title="添加同级节点"><Plus className="h-3.5 w-3.5" /></button>}
        {!node.root && <button onClick={() => deleteNode(node.id)} className="grid h-7 w-7 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="删除节点"><Trash2 className="h-3.5 w-3.5" /></button>}
      </div>
    </div>;
  };

  const noteCategoryChoices = ["研究主题", "研究问题", "假设", "方法设计", "技术路线", "实验", "结论", "失败记录"];
  const NoteIdentity = () => {
    if (!selected) return null;
    const CategoryIcon = categoryIcon(nodeCategory(selected));
    const choices = noteCategoryChoices.includes(nodeCategory(selected)) ? noteCategoryChoices : [nodeCategory(selected), ...noteCategoryChoices];
    return <div className="border-b border-slate-100 pb-5">
      <label className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClass(nodeCategory(selected), selected.categoryColor)}`}>
        <CategoryIcon className="h-3.5 w-3.5 shrink-0" />
        <select value={nodeCategory(selected)} onChange={(event) => updateNodeMeta(selected.id, { category: event.target.value, categoryColor: undefined })} className="cursor-pointer appearance-none bg-transparent pr-1 font-semibold text-inherit outline-none" aria-label="切换笔记分类">
          {choices.map((category) => <option key={category} value={category} className="bg-white text-slate-900">{category}</option>)}
        </select>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </label>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{selected.title}</h1>
      {!!nodeTags(selected).length && <div className="mt-3 flex flex-wrap gap-1.5">{nodeTags(selected).map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">#{tag}</span>)}</div>}
    </div>;
  };

  const FullScreenMetadataEditor = () => {
    if (!selected) return null;
    return <div className="mb-6 border-b border-slate-100 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <label className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryClass(nodeCategory(selected), selected.categoryColor)}`}>{React.createElement(categoryIcon(nodeCategory(selected)), { className: "h-3.5 w-3.5" })}<select value={nodeCategory(selected)} onChange={(event) => updateNodeMeta(selected.id, { category: event.target.value, categoryColor: undefined })} className="cursor-pointer appearance-none bg-transparent font-semibold text-inherit outline-none" aria-label="分类标签">{(noteCategoryChoices.includes(nodeCategory(selected)) ? noteCategoryChoices : [nodeCategory(selected), ...noteCategoryChoices]).map((category) => <option key={category} value={category} className="bg-white text-slate-900">{category}</option>)}</select><ChevronDown className="h-3 w-3 opacity-70" /></label>
        <div className="flex items-center gap-1.5">{categoryColorOptions.map((option) => <button key={option.id} type="button" onClick={() => updateNodeMeta(selected.id, { categoryColor: option.id })} title={`标签颜色：${option.label}`} aria-label={`设置为${option.label}`} className={`grid h-5 w-5 place-items-center rounded-full transition ${selected.categoryColor === option.id || (!selected.categoryColor && inferredCategoryColor(nodeCategory(selected)) === option.id) ? "ring-2 ring-slate-400 ring-offset-1" : "opacity-55 hover:opacity-100"}`}><span className={`h-3.5 w-3.5 rounded-full ${option.dot}`} /></button>)}</div>
      </div>
      <input value={selected.title} onChange={(event) => updateNodeMeta(selected.id, { title: event.target.value })} placeholder="输入笔记标题" className="mt-4 w-full border-0 bg-transparent p-0 text-2xl font-bold tracking-tight text-slate-950 outline-none placeholder:text-slate-300" aria-label="卡片与笔记标题" />
      <div className="mt-3"><HashTagEditor nodeId={selected.id} tags={nodeTags(selected)} onCommit={(tags) => updateNodeMeta(selected.id, { tags })} /></div>
    </div>;
  };

  const NoteContent = () => {
    if (!selected) return null;
    const linkedResources = selected.resources.filter((resource) => selected.note.includes(`#resource-${resource.id}`));
    return <div className="space-y-5">
    <NoteIdentity />
    {selected.note ? selected.note.split("\n\n").map((block, index) => block.startsWith("# ") ? null : block.startsWith("## ") ? <h2 key={index} className="text-lg font-semibold">{block.slice(3)}</h2> : <p key={index} className="whitespace-pre-line text-sm leading-7 text-slate-600">{block.replace(/\*\*/g, "").split(/(\[[^\]]+\]\(#resource-[^)]+\))/g).map((part, partIndex) => { const match = part.match(/^\[([^\]]+)\]\(#resource-[^)]+\)$/); return match ? <span key={partIndex} className="mx-0.5 inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{match[1]}</span> : part; })}</p>) : <div className="py-24 text-center"><FileText className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-4 font-medium">开始记录本次科研探索</p><button onClick={openEditor} className="mt-3 text-sm font-medium text-blue-600">开始编辑</button></div>}
    {!!linkedResources.length && <div className="border-t border-slate-100 pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">关联资源</p><div className="flex flex-wrap gap-2">{linkedResources.map((resource) => { const Icon = kindIcon[resource.kind]; return <button key={resource.id} onClick={() => showToast(`已在新页面打开：${resource.title}`)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:border-blue-300 hover:text-blue-700"><Icon className="h-4 w-4" /><span className="max-w-72 truncate">{resource.title}</span><ExternalLink className="h-3.5 w-3.5 text-slate-400" /></button>; })}</div></div>}
  </div>;
  };

  const NoteWorkspaceContent = (showAgentLock = false) => <>
    <FullScreenMetadataEditor />
    <BlockNoteEditor key={selected?.id} initialMarkdown={selected?.note ?? draft} availableResources={resources} onChange={updateDraft} onAttach={attachResource} compact={!showAgentLock} remoteEditor={showAgentLock ? (mockAgentEditing ? { type: "agent", name: "数据集调研 Agent" } : mockCollaboratorEditing ? { type: "collaborator", name: "林知夏" } : null) : null} />
    {!!selected?.resources.filter((resource) => resource.kind === "文件").length && <div className="mt-5 space-y-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">笔记附件</p>{selected.resources.filter((resource) => resource.kind === "文件").map((resource) => <button key={resource.id} type="button" onClick={() => openAttachmentPreview(resource)} className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"><span className="flex items-center gap-3 border-b border-slate-100 px-4 py-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white"><File className="h-4 w-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-slate-800">{resource.title}</strong><span className="mt-0.5 block text-[10px] text-slate-400">附件卡片 · 点击全屏查看</span></span><Maximize2 className="h-4 w-4 text-slate-400 transition group-hover:text-emerald-600" /></span><span className="pointer-events-none block max-h-56 overflow-hidden bg-slate-50/70 p-3"><ProjectAttachmentPreview resource={resource} /></span></button>)}</div>}
    <div className="mt-6 flex items-center justify-end gap-2 text-xs text-slate-400">{saveState === "saving" ? <><Clock3 className="h-3.5 w-3.5" />自动保存中…</> : <><Check className="h-3.5 w-3.5 text-emerald-500" />已自动保存</>}</div>
  </>;

  const applyCanvasTemplate = (templateId: string) => {
    const templateNodes = nodesFromTemplate(projectTitle, templateId);
    const expandedIds = new Set(templateNodes.map((node) => node.id));
    setNodes(templateNodes);
    setExpanded(expandedIds);
    setNodePositions(calculateTreeLayout(templateNodes, expandedIds));
    setShowTemplatePicker(false);
    showToast("已从模板创建科研画布");
  };

  if (!nodes.length) return <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(#dbe3ef_1px,transparent_1px)] bg-[size:20px_20px] shadow-sm">
    <div className="max-w-lg rounded-3xl border border-dashed border-slate-300 bg-white/95 px-12 py-14 text-center shadow-sm backdrop-blur">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><FolderTree className="h-7 w-7" /></span>
      <h2 className="mt-5 text-xl font-semibold">空白科研画布</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">从第一个研究节点开始，或使用模板快速搭建实验流程。</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => { const rootNode: TreeNode = { id: `root-${projectId}`, title: projectTitle, category: "研究主题", tags: ["新建"], updatedAt: Date.now(), parentId: null, root: true, note: "", resources: [] }; setNodes([rootNode]); setExpanded(new Set([rootNode.id])); setNodePositions({ [rootNode.id]: { x: 100, y: 160 } }); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">新建空白节点</button>
        <button onClick={() => setShowTemplatePicker(true)} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">从模板创建</button>
      </div>
    </div>
    {showTemplatePicker && <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-6" onMouseDown={() => setShowTemplatePicker(false)}><div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
      <div className="flex items-start justify-between"><div><h3 className="text-xl font-semibold">选择科研画布模板</h3><p className="mt-1 text-sm text-slate-500">模板会生成可编辑、可拖拽的初始节点。</p></div><button onClick={() => setShowTemplatePicker(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      <div className="mt-6 grid grid-cols-2 gap-4">{canvasTemplateBlueprints.map((template, index) => <button key={template.id} onClick={() => applyCanvasTemplate(template.id)} className="group rounded-2xl border border-slate-200 p-5 text-left hover:border-blue-400 hover:shadow-md"><span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 0 ? "bg-violet-100 text-violet-700" : index === 1 ? "bg-rose-100 text-rose-700" : index === 2 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}><FlaskConical className="h-5 w-5" /></span><h4 className="mt-5 font-semibold group-hover:text-blue-700">{template.title}</h4><p className="mt-2 text-sm leading-6 text-slate-500">{template.description}</p><p className="mt-4 text-xs text-slate-400">{template.nodes.length} 个初始节点</p></button>)}</div>
    </div></div>}
  </div>;

  if (noteOnly || (overlayNote && selected)) return <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-end gap-2 border-b border-slate-200 bg-white px-5 py-3">{overlayNote && <button type="button" onClick={() => { setSelectedId(null); setSelectedIds(new Set()); }} className="mr-1 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100" aria-label="返回科研画布"><ArrowLeft className="h-3.5 w-3.5" />返回科研画布</button>}<span className="mr-auto text-[11px] text-slate-400">可直接编辑 · 自动保存</span><button onClick={() => setFullScreen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" title="全屏查看" aria-label="全屏查看"><Maximize2 className="h-4 w-4" /></button></div>
    <div className="min-h-0 flex-1 overflow-auto bg-[#fafbfc] p-4">
      {selected ? <article className="min-h-full w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{NoteWorkspaceContent(!fullScreen)}</article> : <div className="grid h-full place-items-center text-sm text-slate-400">请选择科研笔记</div>}
    </div>
    {fullScreen && selected && <div className="fixed inset-0 z-[1150] flex flex-col bg-white">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setFullScreen(false)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="退出全屏"><X className="h-5 w-5" /></button><div><p className="text-xs text-slate-400">{projectTitle} / 科研笔记</p><h2 className="font-semibold">{selected.title}</h2></div></div><div className="flex items-center gap-3"><span className="flex items-center gap-1.5 text-xs text-slate-500">{saveState === "saving" ? <><Clock3 className="h-4 w-4" />自动保存中…</> : <><Check className="h-4 w-4 text-emerald-500" />已自动保存</>}</span></div></header>
      <main className="flex-1 overflow-auto bg-[#f8fafc] p-8"><article className="relative mx-auto min-h-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">{NoteWorkspaceContent(true)}</article></main>
    </div>}
  </div>;

  return <div className="flex h-full min-h-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
    <section className={`relative flex min-w-0 flex-col overflow-hidden bg-[#f8fafc] transition-[flex] duration-300 ${selected ? "flex-[1.7] border-r border-slate-200" : "flex-1"}`}>
      <div
        onDragOver={(event) => {
          if (!draggedNodeId) return;
          event.preventDefault();
          const invalidIds = new Set([draggedNodeId, ...descendants(draggedNodeId).map((item) => item.id)]);
          let nearest: { id: string; distance: number } | null = null;
          document.querySelectorAll<HTMLElement>("[data-tree-node-id]").forEach((element) => {
            const id = element.dataset.treeNodeId;
            if (!id || invalidIds.has(id)) return;
            const rect = element.getBoundingClientRect();
            const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
            const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
            const distance = Math.hypot(dx, dy);
            if (distance <= 150 && (!nearest || distance < nearest.distance)) nearest = { id, distance };
          });
          setSnapTargetId(nearest?.id ?? null);
          event.dataTransfer.dropEffect = nearest ? "move" : "none";
        }}
        onDrop={(event) => {
          event.preventDefault();
          const draggedId = event.dataTransfer.getData("text/node-id") || draggedNodeId;
          if (draggedId && snapTargetId) reparentNode(draggedId, snapTargetId);
          else { setDraggedNodeId(null); setSnapTargetId(null); }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          if (event.metaKey) {
            const rect = event.currentTarget.getBoundingClientRect();
            selectionStart.current = { clientX: event.clientX, clientY: event.clientY, canvasLeft: rect.left, canvasTop: rect.top };
            setSelectionBox({ left: event.clientX - rect.left, top: event.clientY - rect.top, width: 0, height: 0 });
            return;
          }
          panStart.current = { pointerX: event.clientX, pointerY: event.clientY, offsetX: mapOffset.x, offsetY: mapOffset.y, moved: false };
          setIsPanning(true);
        }}
        onPointerMove={(event) => {
          if (selectionStart.current) {
            const start = selectionStart.current;
            setSelectionBox({ left: Math.min(start.clientX, event.clientX) - start.canvasLeft, top: Math.min(start.clientY, event.clientY) - start.canvasTop, width: Math.abs(event.clientX - start.clientX), height: Math.abs(event.clientY - start.clientY) });
            return;
          }
          if (!panStart.current) return;
          const dx = event.clientX - panStart.current.pointerX;
          const dy = event.clientY - panStart.current.pointerY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) panStart.current.moved = true;
          setMapOffset({ x: panStart.current.offsetX + dx, y: panStart.current.offsetY + dy });
        }}
        onPointerUp={(event) => {
          if (selectionStart.current) {
            const start = selectionStart.current;
            const bounds = { left: Math.min(start.clientX, event.clientX), right: Math.max(start.clientX, event.clientX), top: Math.min(start.clientY, event.clientY), bottom: Math.max(start.clientY, event.clientY) };
            const matched = new Set<string>();
            document.querySelectorAll<HTMLElement>("[data-tree-node-id]").forEach((element) => {
              const rect = element.getBoundingClientRect();
              if (rect.right >= bounds.left && rect.left <= bounds.right && rect.bottom >= bounds.top && rect.top <= bounds.bottom && element.dataset.treeNodeId) matched.add(element.dataset.treeNodeId);
            });
            setSelectedIds(matched);
            setSelectedId(matched.size === 1 ? [...matched][0] : null);
            selectionStart.current = null;
            setSelectionBox(null);
            event.currentTarget.releasePointerCapture(event.pointerId);
            return;
          }
          if (!panStart.current) return;
          if (!panStart.current.moved) { setSelectedId(null); setSelectedIds(new Set()); setSelectedEdgeChildId(null); }
          panStart.current = null;
          setIsPanning(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { panStart.current = null; selectionStart.current = null; setSelectionBox(null); setIsPanning(false); }}
        onWheel={(event) => {
          event.preventDefault();
          const direction = event.deltaY < 0 ? 1 : -1;
          setMapScale((value) => Math.min(1.2, Math.max(.65, Number((value + direction * .08).toFixed(2)))));
        }}
        className={`relative flex-1 overflow-hidden touch-none bg-[radial-gradient(#dbe3ef_1px,transparent_1px)] bg-[size:20px_20px] ${isPanning ? "cursor-grabbing select-none" : "cursor-grab"}`}
      >
        {selectionBox && <div className="pointer-events-none absolute z-50 border border-blue-500 bg-blue-100/35" style={selectionBox} />}
        {selectedIds.size > 1 && <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg">已选择 {selectedIds.size} 个节点 · 拖动任一节点同步移动</div>}
        <div onPointerDown={(event) => event.stopPropagation()} className="absolute right-4 top-4 z-40 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur">
          <button onClick={addIsolatedNode} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700" title="添加孤立节点" aria-label="添加孤立节点"><Plus className="h-4 w-4" /></button>
          <span className="mx-1 h-5 border-l border-slate-200" />
          <button onClick={() => { const layout = calculateTreeLayout(nodes, expanded); const root = nodes.find((node) => node.root); if (root && nodePositions[root.id]) layout[root.id] = nodePositions[root.id]; setNodePositions(layout); showToast("已自动排列节点，根节点位置保持不变"); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="自动布局" aria-label="自动布局"><Table2 className="h-4 w-4" /></button>
          <span className="mx-1 h-5 border-l border-slate-200" />
          <button onClick={undo} disabled={!undoStack.current.length} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent" title="撤销" aria-label="撤销"><Undo2 className="h-4 w-4" /></button>
          <button onClick={redo} disabled={!redoStack.current.length} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent" title="重做" aria-label="重做"><Redo2 className="h-4 w-4" /></button>
          <span className="mx-1 h-5 border-l border-slate-200" /><button onClick={() => setMapScale((value) => Math.max(.65, value - .1))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="缩小"><ZoomOut className="h-4 w-4" /></button><span className="w-10 text-center text-xs text-slate-400">{Math.round(mapScale * 100)}%</span><button onClick={() => setMapScale((value) => Math.min(1.2, value + .1))} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="放大"><ZoomIn className="h-4 w-4" /></button>
        </div>
        <div className="relative h-[1200px] w-[1900px] transition-transform duration-100" style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`, transformOrigin: "left top" }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            {visibleNodes.filter((node) => !node.root && node.parentId && visibleNodes.some((item) => item.id === node.parentId)).map((node) => {
              const from = nodePositions[node.parentId!]; const to = nodePositions[node.id]; if (!from || !to) return null;
              const childIsRight = to.x >= from.x;
              const direction = childIsRight ? 1 : -1;
              const startX = from.x + (childIsRight ? 260 : 0);
              const endX = to.x + (childIsRight ? 0 : 260);
              const startY = from.y + 69;
              const endY = to.y + 69;
              const bend = Math.max(70, Math.min(180, Math.abs(endX - startX) * .45));
              const path = `M ${startX} ${startY} C ${startX + direction * bend} ${startY}, ${endX - direction * bend} ${endY}, ${endX} ${endY}`;
              const selectedEdge = selectedEdgeChildId === node.id;
              return <React.Fragment key={node.id}>
                <path d={path} fill="none" stroke="transparent" strokeWidth="16" className="pointer-events-auto cursor-pointer" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setSelectedEdgeChildId(node.id); setSelectedId(null); setSelectedIds(new Set()); }} />
                <path d={path} fill="none" stroke={selectedEdge ? "#ef4444" : "#93c5fd"} strokeWidth={selectedEdge ? 3 : 2} strokeLinecap="round" className="pointer-events-none" />
                {selectedEdge && <g className="pointer-events-auto cursor-pointer" transform={`translate(${(startX + endX) / 2} ${(startY + endY) / 2})`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); deleteEdge(node.id); }}>
                  <circle r="13" fill="#ef4444" stroke="white" strokeWidth="2" />
                  <text x="0" y="1" fill="white" fontSize="17" fontWeight="600" textAnchor="middle" dominantBaseline="middle">×</text>
                </g>}
              </React.Fragment>;
            })}
          </svg>
          {visibleNodes.map((node) => <CanvasNodeCard key={node.id} node={node} />)}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] font-normal tracking-wide text-slate-300/80">拖动空白区域平移 · 滚轮缩放 · ⌘ 点击/拖动框选 · 多选后拖动同步移动</div>
      </div>
    </section>
    <aside className={`flex shrink-0 border-l border-slate-200 bg-white transition-[width] duration-300 ${messageBoardCollapsed ? "w-[64px]" : "w-[456px]"}`} aria-label="科研画布右侧栏">
      {!messageBoardCollapsed && <div className="flex min-w-0 flex-1 flex-col">
        {activeSidebarTab.startsWith("note-") && selected ? <>
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-medium text-blue-600">节点笔记</p><h2 className="truncate text-sm font-semibold">{selected.title}</h2></div><button onClick={() => setFullScreen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="全屏查看笔记" title="全屏查看"><Maximize2 className="h-4 w-4" /></button></header>
          <div className="min-h-0 flex-1 overflow-auto bg-[#fafbfc] p-3"><article className="min-h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">{NoteWorkspaceContent(false)}</article></div>
        </> : activeSidebarTab === "all-agents" ? <>
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white"><Users className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">全部 Agents</h2><p className="truncate text-[10px] text-slate-400">当前项目共 {projectAgents.length} 个 Agent</p></div>

          </header>
          <div className="min-h-0 flex-1 overflow-auto bg-slate-50/70 p-3">
            <div className="space-y-2">
              {[...projectAgents].sort((a, b) => b.lastUsedAt - a.lastUsedAt).map((agent) => (
                <button key={agent.id} type="button" onClick={() => setAgentDialog({ name: agent.name, nodeTitle: projectTitle })} className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/40 hover:shadow-sm">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700"><Bot className="h-5 w-5" /><span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${agent.status === "在线" || agent.status === "运行中" ? "bg-emerald-500" : agent.status === "等待中" ? "bg-amber-400" : "bg-slate-300"}`} /></span>
                  <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="truncate text-xs font-semibold text-slate-800">{agent.name}</strong><span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${agent.status === "在线" || agent.status === "运行中" ? "bg-emerald-50 text-emerald-700" : agent.status === "等待中" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>{agent.status}</span></span><span className="mt-1 block truncate text-[10px] text-slate-400">{agent.description}</span></span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" />
                </button>
              ))}
            </div>
          </div>
        </> : <>
          <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white"><MessageSquare className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">项目留言板</h2><p className="truncate text-[10px] text-slate-400">成员与 Agent 共享</p></div></header>
          <div className="min-h-0 flex-1 space-y-3 overflow-auto bg-slate-50/70 p-3">{boardMessages.map((message, index) => <article key={index} className="rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white ${message.role === "agent" ? "bg-violet-600" : "bg-slate-700"}`}>{message.role === "agent" ? <Bot className="h-3.5 w-3.5" /> : message.author.slice(-1)}</span><strong className="min-w-0 flex-1 truncate text-xs">{message.author}</strong><span className="text-[9px] text-slate-400">刚刚</span></div><p className="mt-2 text-[11px] leading-5 text-slate-600">{message.text}</p>{message.role === "agent" && index === 2 && agentLaunchDecision === "pending" && <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => { setAgentLaunchDecision("running"); setBoardMessages((items) => [...items, { author: "数据集调研 Agent", role: "agent", text: "任务已启动，正在检查 RULER 与 NeedleBench 的数据许可和评测脚本。" }]); }} className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-700">启动</button><button onClick={() => setAgentLaunchDecision("cancelled")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">取消</button></div>}{message.role === "agent" && index === 2 && agentLaunchDecision === "running" && <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700"><LoaderCircle className="h-3 w-3 animate-spin" />Agent 运行中</span>}{message.role === "agent" && index === 2 && agentLaunchDecision === "cancelled" && <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">已取消启动</span>}</article>)}</div>
          <footer className="relative border-t border-slate-200 p-3">{boardMentionOpen && <div className="absolute bottom-[62px] left-3 right-3 z-20 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"><p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mention 项目成员或 Agent</p>{[
            { name: "博一新生林沐", type: "项目成员" }, { name: "博三学长周启", type: "项目成员" }, { name: "导师陈教授", type: "项目成员" }, { name: "项目助手", type: "Agent" }, { name: "数据集调研 Agent", type: "Agent" }, { name: "实验复现 Agent", type: "Agent" },
          ].map((person) => <button key={person.name} onClick={() => { setMessageDraft((value) => `${value.replace(/@[^@]*$/, "")}@${person.name} `); setBoardMentionOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-violet-50"><span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white ${person.type === "Agent" ? "bg-violet-600" : "bg-slate-700"}`}>{person.type === "Agent" ? <Bot className="h-3.5 w-3.5" /> : person.name.slice(-1)}</span><span className="min-w-0 flex-1 truncate text-xs font-medium">{person.name}</span><span className="text-[10px] text-slate-400">{person.type}</span></button>)}</div>}<div className="flex gap-2"><input value={messageDraft} onChange={(event) => { const value = event.target.value; setMessageDraft(value); setBoardMentionOpen(value.endsWith("@")); }} onKeyDown={(event) => { if (event.key === "Escape") setBoardMentionOpen(false); if (event.key === "Enter" && messageDraft.trim()) { setBoardMessages((items) => [...items, { author: "博一新生林沐", role: "user", text: messageDraft.trim() }]); setMessageDraft(""); setBoardMentionOpen(false); } }} placeholder="给成员和 Agent 留言，输入 @ Mention" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-violet-400" /><button onClick={() => { if (!messageDraft.trim()) return; setBoardMessages((items) => [...items, { author: "博一新生林沐", role: "user", text: messageDraft.trim() }]); setMessageDraft(""); }} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white"><Send className="h-4 w-4" /></button></div></footer>
        </>}
      </div>}
      <nav className="flex w-[64px] shrink-0 flex-col items-center gap-2 border-l border-slate-200 bg-white py-3" aria-label="科研画布右侧 Tab">
        <button onClick={() => setMessageBoardCollapsed((value) => !value)} className={`rounded-xl p-3 transition ${messageBoardCollapsed ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`} aria-label={messageBoardCollapsed ? "展开右侧栏" : "收起右侧栏"} title={messageBoardCollapsed ? "展开右侧栏" : "收起右侧栏"}>{messageBoardCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}</button>
        <span className="mb-1 h-px w-7 bg-slate-200" />
        <button onClick={() => setAgentDialog({ name: "项目助手", nodeTitle: projectTitle })} className="group relative mb-1 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg" aria-label="打开项目助手" title="项目助手"><Bot className="h-5 w-5" /><span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /><span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">项目助手</span></button>
        <span className="mb-1 h-px w-7 bg-slate-200" />
        <button onClick={() => { setActiveSidebarTab("message-board"); setMessageBoardCollapsed(false); }} className={`relative rounded-xl p-3 ${!messageBoardCollapsed && activeSidebarTab === "message-board" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`} aria-label="项目留言板"><MessageSquare className="h-4 w-4" /><span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] text-white">2</span></button>
        <button onClick={() => { setActiveSidebarTab("all-agents"); setMessageBoardCollapsed(false); }} className={`group relative rounded-xl p-3 ${!messageBoardCollapsed && activeSidebarTab === "all-agents" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-100"}`} aria-label="全部 Agents" title="全部 Agents"><Users className="h-4 w-4" /><span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-violet-600 px-1 text-[9px] text-white">{projectAgents.length}</span><span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">全部 Agents</span></button>
        {sidebarTabs.filter((tab) => tab.type === "note").map((tab) => <button key={tab.id} onClick={() => { setSelectedId(tab.nodeId); setSelectedIds(new Set([tab.nodeId])); setActiveSidebarTab(tab.id); setMessageBoardCollapsed(false); }} className={`rounded-xl p-3 ${!messageBoardCollapsed && activeSidebarTab === tab.id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`} aria-label={`节点笔记：${tab.title}`} title={tab.title}><FileText className="h-4 w-4" /></button>)}
      </nav>
    </aside>

    {fullScreen && selected && <div className="fixed inset-0 z-[1150] flex flex-col bg-white">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setFullScreen(false)} className="rounded-lg p-2 hover:bg-slate-100" aria-label="退出全屏"><X className="h-5 w-5" /></button><div><p className="text-xs text-slate-400">{projectTitle} / 科研画布</p><h2 className="font-semibold">{selected.title}</h2></div></div><div className="flex items-center gap-3"><span className="flex items-center gap-1.5 text-xs text-slate-500">{saveState === "saving" ? <><Clock3 className="h-4 w-4" />自动保存中…</> : <><Check className="h-4 w-4 text-emerald-500" />已自动保存</>}</span></div></header>
      <main className="flex-1 overflow-auto bg-[#f8fafc] p-8"><article className="relative mx-auto min-h-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">{NoteWorkspaceContent(true)}</article></main>
    </div>}
    {fullScreenAttachment && <div className="fixed inset-0 z-[1220] flex flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setFullScreenAttachment(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="关闭附件全屏预览"><X className="h-5 w-5" /></button><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white"><File className="h-4 w-4" /></span><div className="min-w-0"><p className="text-[10px] text-slate-400">{selected?.title ?? "科研笔记"} / 附件</p><h2 className="truncate text-sm font-semibold">{fullScreenAttachment.title}</h2></div></div><button onClick={() => showToast(`已下载：${fullScreenAttachment.title}`)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">下载附件</button></header>
      <main className="min-h-0 flex-1 overflow-auto bg-slate-100 p-8"><section className="mx-auto min-h-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><ProjectAttachmentPreview resource={fullScreenAttachment} /></section></main>
    </div>}
    {agentDialog && <div className="fixed inset-0 z-[1250] flex items-center justify-center bg-slate-950/45 p-5" onMouseDown={() => setAgentDialog(null)}>
      <section className="relative h-[min(860px,94vh)] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <iframe
          title={`${agentDialog.name} Agent 对话`}
          src={`/app/agent?source=research-note&embedded=1&agentName=${encodeURIComponent(agentDialog.name)}&message=${encodeURIComponent(`继续推进「${agentDialog.nodeTitle}」，核对数据许可、评测设置并记录失败分支。`)}`}
          className="h-full w-full border-0"
        />
        <button onClick={() => setAgentDialog(null)} className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-md transition hover:bg-slate-100 hover:text-slate-950" aria-label="关闭 Agent 弹窗" title="关闭"><X className="h-4 w-4" /></button>
      </section>
    </div>}
    {toast && <div className="fixed bottom-6 left-1/2 z-[1300] -translate-x-1/2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm text-white shadow-xl">{toast}</div>}
  </div>;
}
