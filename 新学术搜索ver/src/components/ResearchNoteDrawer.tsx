import React, { useState } from "react";
import { Check, File, FileSpreadsheet, FileText, UploadCloud, X } from "lucide-react";

type AttachedFile = { id: number; name: string; meta: string };

export function ResearchNoteDrawer({ open, title, onClose }: { open: boolean; title: string; onClose: () => void }) {
  const [body, setBody] = useState("当前证据显示，长上下文模型在信息位于序列中部时准确率明显下降。\n\n博三学长周启建议控制上下文长度、干扰文档数量和随机种子。导师陈教授将根据原始结果审查结论。");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<AttachedFile[]>([
    { id: 1, name: "position-bias-results.xlsx", meta: "Excel 实验结果 · 实验复现 Agent 插入" },
  ]);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((items) => [...items, ...Array.from(list).map((file, index) => ({ id: Date.now() + index, name: file.name, meta: `${Math.max(1, Math.round(file.size / 1024))} KB · 博一新生林沐上传` }))]);
  };

  return <div className={`absolute inset-0 z-[70] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
    <button type="button" aria-label="关闭科研笔记" onClick={onClose} className={`absolute inset-0 bg-slate-950/20 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
    <aside className={`absolute inset-y-0 right-0 flex w-[520px] max-w-[92%] flex-col bg-white shadow-[-16px_0_40px_rgba(15,23,42,0.16)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5"><div className="min-w-0"><p className="text-[11px] font-medium text-violet-600">节点笔记</p><h2 className="truncate text-sm font-semibold">{title}</h2></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></header>
      <div className="flex-1 overflow-y-auto p-5" onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}>
        <div className="mb-4 flex items-center gap-1.5 text-[11px] text-slate-400"><Check className="h-3.5 w-3.5 text-emerald-500" />已自动保存</div>
        <label className="block rounded-2xl border border-slate-200 bg-white p-4 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"><textarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-52 w-full resize-none bg-transparent text-sm leading-7 text-slate-700 outline-none" aria-label="节点笔记内容" /></label>
        <p className="mt-2 text-[11px] text-slate-400">输入 “/” 插入 Block，输入 “@” Mention 论文</p>
        <section className={`relative mt-5 rounded-2xl border-2 border-dashed p-4 transition ${dragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
          {dragging && <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-emerald-50/95"><div className="text-center"><UploadCloud className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-2 text-sm font-semibold text-emerald-800">释放文件以插入笔记</p></div></div>}
          <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">文件附件</h3><p className="mt-1 text-[11px] text-slate-400">拖入实验结果、数据集、图表或配置文件</p></div><label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"><input type="file" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} />选择文件</label></div>
          <div className="mt-4 space-y-2">{files.map((file) => <button key={file.id} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-emerald-300"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white">{file.name.endsWith(".xlsx") ? <FileSpreadsheet className="h-4 w-4" /> : file.name.endsWith(".pdf") ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />}</span><span className="min-w-0"><strong className="block truncate text-xs">{file.name}</strong><span className="text-[10px] text-slate-400">{file.meta}</span></span></button>)}</div>
        </section>
      </div>
    </aside>
  </div>;
}
