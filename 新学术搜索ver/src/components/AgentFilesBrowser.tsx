import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, FileText, Folder, Download } from 'lucide-react';
import './agent-files-browser.css';
import { AgentArtifact, analyzeArtifactCitations } from '../lib/agentPaperArtifacts';
import { AgentPaper, agentPaperIndexCsv, paperMarkdownPath, paperPdfPath } from '../lib/agentPaperCollections';

type FileItem = { id: string; name: string; path: string; folder: 'papers' | 'outputs'; createdAt: number; artifact?: AgentArtifact; paper?: AgentPaper; content?: string };

export function AgentFilesBrowser({ papers, evidencePapers, artifacts, focusedArtifactId, onOpenArtifact, onClosePreview, onOpenPaper }: {
  papers: AgentPaper[];
  evidencePapers: AgentPaper[];
  artifacts: AgentArtifact[];
  focusedArtifactId: string | null;
  onOpenArtifact: (id: string) => void;
  onClosePreview: () => void;
  onOpenPaper: (paper: AgentPaper) => void;
}) {
  const [view, setView] = useState<'list' | 'columns'>('list');
  const [expanded, setExpanded] = useState({ papers: true, outputs: true });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => { setSelectedId(focusedArtifactId); }, [focusedArtifactId]);
  const items = useMemo(() => {
    const entries: FileItem[] = [
      { id: 'papers/index.csv', name: 'index.csv', path: 'papers/index.csv', folder: 'papers', createdAt: Math.max(0, ...papers.map((paper) => paper.updatedAt ?? 0)), content: agentPaperIndexCsv(papers) },
      ...papers.flatMap((paper): FileItem[] => {
        const pdf = paperPdfPath(paper);
        if (!pdf) return [];
        const markdown = paperMarkdownPath(paper);
        return [
          { id: pdf, name: pdf.split('/').pop() ?? pdf, path: pdf, folder: 'papers', createdAt: paper.updatedAt ?? 0, paper },
          ...(markdown ? [{ id: markdown, name: markdown.split('/').pop() ?? markdown, path: markdown, folder: 'papers' as const, createdAt: paper.updatedAt ?? 0, paper }] : []),
        ];
      }),
      ...artifacts.map((artifact, index): FileItem => ({ id: artifact.id, name: artifact.name, path: `outputs/${artifact.name}`, folder: 'outputs', createdAt: artifact.createdAt ?? Number(artifact.id.match(/\d{13}/)?.[0] ?? index), artifact, content: artifact.content })),
    ];
    return entries.sort((a, b) => b.createdAt - a.createdAt || a.path.localeCompare(b.path));
  }, [papers, artifacts]);
  const selected = items.find((item) => item.id === selectedId);
  const open = (item: FileItem) => { setSelectedId(item.id); if (item.artifact) onOpenArtifact(item.artifact.id); };
  const warning = (item: FileItem) => item.artifact ? analyzeArtifactCitations(item.artifact, evidencePapers).unmatched : [];
  const fileButton = (item: FileItem) => <button key={item.id} type="button" onClick={() => open(item)} className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs hover:bg-blue-50 ${selected?.id === item.id ? 'bg-blue-50 text-blue-800' : 'text-slate-700'}`}>
    <FileText className="h-4 w-4 shrink-0 text-slate-400" /><span className="min-w-0 flex-1 truncate" title={item.path}>{view === 'list' ? item.path : item.name}</span>
    {warning(item).length > 0 && <span className="inline-flex shrink-0 items-center gap-1 text-amber-700"><AlertTriangle className="h-3.5 w-3.5" />疑似幻觉引用</span>}
  </button>;
  const downloadIndex = () => { const url = URL.createObjectURL(new Blob(['\ufeff', agentPaperIndexCsv(papers)], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'index.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); };
  const modifiedTime = (value: number) => value ? new Date(value).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
  const fileSize = (item: FileItem) => item.content ? `${Math.max(1, Math.ceil(new TextEncoder().encode(item.content).length / 1024))} KB` : item.path.endsWith('.pdf') ? '1.8 MB' : item.path.endsWith('.md') ? '24 KB' : '—';

  return <section aria-label="文件浏览">
    {!selected ? <><div className="mb-3 flex items-center justify-end"><div role="tablist" aria-label="文件视图" className="inline-flex rounded-lg bg-slate-200/70 p-0.5">{([['list', '列表'], ['columns', '表格']] as const).map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={view === key} onClick={() => setView(key)} className={`rounded-md px-3 py-1 text-xs ${view === key ? 'bg-white font-medium shadow-sm' : 'text-slate-500'}`}>{label}</button>)}</div></div>
    {view === 'list' ? <div className="rounded-xl border border-slate-200 bg-white p-1.5">{items.map(fileButton)}</div> : <div className="agent-files-table overflow-hidden rounded-xl border border-slate-200 bg-white text-xs">
      <div className="agent-files-grid border-b border-slate-200 bg-slate-50 font-medium text-slate-500"><span className="px-3 py-2">文件名</span><span className="agent-files-time-column px-2 py-2">修改时间</span><span className="agent-files-size-column px-2 py-2">文件大小</span><span className="agent-files-attribute-column px-2 py-2">属性</span></div>
      {(['outputs', 'papers'] as const).map((name) => {
        const children = items.filter((item) => item.folder === name);
        const latest = Math.max(0, ...children.map((item) => item.createdAt));
        return <div key={name}><button type="button" onClick={() => setExpanded((current) => ({ ...current, [name]: !current[name] }))} className="agent-files-grid w-full border-b border-slate-100 text-left hover:bg-slate-50" aria-expanded={expanded[name]}>
          <span className="flex min-w-0 items-center gap-1 px-2 py-2 font-medium text-slate-800">{expanded[name] ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}<Folder className="h-4 w-4 shrink-0 text-blue-600" />{name}/</span><span className="agent-files-time-column px-2 py-2 text-slate-500">{modifiedTime(latest)}</span><span className="agent-files-size-column px-2 py-2 text-slate-500">{children.length} 项</span><span className="agent-files-attribute-column px-2 py-2 text-slate-500">{children.length} 项 · {modifiedTime(latest)}</span>
        </button>{expanded[name] && children.map((item) => <button key={item.id} type="button" onClick={() => open(item)} className="agent-files-grid w-full border-b border-slate-100 text-left last:border-b-0 hover:bg-blue-50">
          <span className="flex min-w-0 items-center gap-1 overflow-hidden py-2 pl-8 pr-2 text-slate-700"><FileText className="h-4 w-4 shrink-0 text-slate-400" /><span className="min-w-0 truncate" title={item.path}>{item.name}</span>{warning(item).length > 0 && <span className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[10px] text-amber-700"><AlertTriangle className="h-3 w-3" />疑似幻觉引用</span>}</span><span className="agent-files-time-column px-2 py-2 text-slate-500">{modifiedTime(item.createdAt)}</span><span className="agent-files-size-column px-2 py-2 text-slate-500">{fileSize(item)}</span><span className="agent-files-attribute-column px-2 py-2 text-slate-500">{modifiedTime(item.createdAt)} · {fileSize(item)}</span>
        </button>)}</div>;
      })}
    </div>}</> : <><button type="button" onClick={() => { setSelectedId(null); onClosePreview(); }} className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"><ChevronLeft className="h-4 w-4" />返回文件浏览</button><article aria-label={`预览 ${selected.name}`} className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-medium" title={selected.path}>{selected.name}</p><p className="mt-1 truncate text-[11px] text-slate-500">{selected.path}</p></div>{selected.id === 'papers/index.csv' && <button type="button" onClick={downloadIndex} className="inline-flex shrink-0 items-center gap-1 text-xs text-blue-700"><Download className="h-3.5 w-3.5" />下载</button>}</div>
      {warning(selected).length > 0 && <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />疑似幻觉引用：{warning(selected).map((item) => item.key).join('、')}</p>}
      {selected.artifact && <p className="mt-2 text-[11px] text-slate-500">关联 {analyzeArtifactCitations(selected.artifact, evidencePapers).matched.length} 篇论文</p>}
      {selected.content ? <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words border-t border-slate-100 pt-3 text-xs leading-5 text-slate-700">{selected.content}</pre> : selected.paper ? <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600"><p>{selected.paper.title}</p><p className="mt-1">{selected.paper.authors || '作者待补充'} · {selected.paper.year || '年份待补充'}</p><button type="button" onClick={() => onOpenPaper(selected.paper!)} className="mt-2 text-blue-700 hover:underline">查看论文</button></div> : null}
      {selected.artifact && analyzeArtifactCitations(selected.artifact, evidencePapers).matched.length > 0 && <div className="mt-3 flex flex-wrap gap-1">{analyzeArtifactCitations(selected.artifact, evidencePapers).matched.map(({ reference, paper }) => <button key={reference.key} type="button" onClick={() => onOpenPaper(paper)} className="rounded bg-blue-50 px-2 py-1 text-[11px] text-blue-700">{paper.title}</button>)}</div>}
    </article></>}
  </section>;
}
