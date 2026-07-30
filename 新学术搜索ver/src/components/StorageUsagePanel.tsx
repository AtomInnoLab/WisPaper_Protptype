import React, { useState } from "react";
import { Archive, ChevronDown, HardDrive, Info } from "lucide-react";
import { StoragePurchaseDialog } from "./StoragePurchaseDialog";

interface StorageUsagePanelProps {
  language?: "zh" | "en";
  className?: string;
  defaultExpanded?: boolean;
}

export function StorageUsagePanel({
  language = "zh",
  className = "",
  defaultExpanded = false,
}: StorageUsagePanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showPurchase, setShowPurchase] = useState(false);
  const isZh = language === "zh";
  const used = 46.8;
  const total = 60;
  const percent = Math.round((used / total) * 100);

  return (
    <>
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50/70"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <HardDrive className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-4">
            <span>
              <strong className="block text-sm font-semibold text-slate-950">
                {isZh ? "存储空间" : "Storage"}
              </strong>
              <span className="mt-1 block text-xs text-slate-500">
                {isZh ? "高速存储 46.8 GB / 60 GB" : "High-speed storage 46.8 GB / 60 GB"}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-medium text-slate-500">{percent}%</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </span>
          </span>
          <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100">
            <span className="block h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
          </span>
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-5">
          <div className="grid grid-cols-[1.65fr_0.85fr] overflow-hidden rounded-xl border border-slate-200 bg-white">
            <article className="border-r border-slate-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{isZh ? "高速存储" : "High-speed storage"}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {isZh ? "活跃文件可被研究工具直接调用" : "Active files are ready for research tools"}
                  </p>
                </div>
                <p className="text-lg font-semibold text-slate-950 tabular-nums">
                  46.8 <span className="text-xs font-medium text-slate-400">/ 60 GB</span>
                </p>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[78%] rounded-full bg-slate-900" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px]">
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{isZh ? "套餐 50 GB" : "Plan 50 GB"}</span>
                <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">{isZh ? "加购 10 GB" : "Add-on 10 GB"}</span>
                <span className="ml-auto text-slate-500">{isZh ? "剩余 13.2 GB" : "13.2 GB left"}</span>
              </div>
            </article>

            <article className="p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Archive className="h-4 w-4" />
                </span>
                <span className="text-[9px] text-slate-400">{isZh ? "需恢复后使用" : "Restore to use"}</span>
              </div>
              <p className="mt-4 text-xs font-semibold text-slate-900">{isZh ? "归档存储" : "Archive storage"}</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">312.8 GB</p>
              <p className="mt-1 text-[10px] text-slate-500">{isZh ? "486 个低频文件" : "486 archived files"}</p>
            </article>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 px-1 py-2">
            <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              {isZh
                ? "文件进入高速存储满 6 个月后自动归档并释放额度；恢复后重新计算保留期。"
                : "Files archive after six months in high-speed storage. Restoring a file restarts its retention period."}
            </p>
            <button
              type="button"
              onClick={() => setShowPurchase(true)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {isZh ? "管理存储" : "Manage storage"}
            </button>
          </div>
        </div>
      )}
    </section>
    <StoragePurchaseDialog isOpen={showPurchase} onClose={() => setShowPurchase(false)} />
    </>
  );
}
