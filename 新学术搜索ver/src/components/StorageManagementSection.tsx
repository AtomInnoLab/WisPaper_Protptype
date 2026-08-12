import React, { useState } from 'react';
import { Archive, ChevronDown, ChevronRight, HardDrive } from 'lucide-react';

const planStorageGb = 60;
const usedStorageGb = 46.8;

interface StorageManagementSectionProps {
  onOpenPricing?: () => void;
}

export function StorageManagementSection({ onOpenPricing }: StorageManagementSectionProps = {}) {
  const [expandedTier, setExpandedTier] = useState<'high-speed' | 'archive' | null>(null);
  const highSpeedExpanded = expandedTier === 'high-speed';
  const archiveExpanded = expandedTier === 'archive';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] table-fixed border-collapse text-left">
          <caption className="sr-only">账户高速存储与归档存储信息</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-semibold text-slate-500">
              <th className="w-[23%] px-4 py-3">存储空间</th>
              <th className="w-[23%] px-4 py-3">已用容量 / 总容量</th>
              <th className="w-[18%] px-4 py-3">当前规格</th>
              <th className="w-[18%] px-4 py-3">到期时间</th>
              <th className="w-[18%] px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <HardDrive className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">高速存储</p>
                    <p className="mt-1 text-[9px] text-emerald-700">可直接使用</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 align-middle text-xs font-semibold text-slate-900 tabular-nums">
                {usedStorageGb} / {planStorageGb} GB
              </td>
              <td className="px-4 py-4 text-xs font-medium text-slate-700">Pro · 60 GB</td>
              <td className="px-4 py-4 text-xs font-medium text-slate-700 tabular-nums">2026-07-10</td>
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onOpenPricing}
                    className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    升级容量
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedTier(highSpeedExpanded ? null : 'high-speed')}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-expanded={highSpeedExpanded}
                    aria-controls="high-speed-storage-details"
                    aria-label={highSpeedExpanded ? '收起高速存储详情' : '展开高速存储详情'}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${highSpeedExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </td>
            </tr>

            {highSpeedExpanded && (
              <tr id="high-speed-storage-details" className="border-b border-slate-100 bg-blue-50/30">
                <td colSpan={5} className="px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">容量随当前套餐统一续期</p>
                      <p className="mt-1 text-[10px] text-slate-500">升级后立即获得新容量；降级或套餐到期后，超出部分按归档规则处理。</p>
                    </div>
                    <div className="flex gap-6 text-right">
                      <div>
                        <p className="text-[9px] text-slate-400">已使用</p>
                        <p className="mt-1 text-xs font-semibold text-slate-900 tabular-nums">46.8 GB</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400">剩余</p>
                        <p className="mt-1 text-xs font-semibold text-blue-700 tabular-nums">13.2 GB</p>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            <tr className="transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                    <Archive className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">归档存储</p>
                    <p className="mt-1 text-[9px] text-slate-500">需恢复后使用</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 align-middle">
                <p className="text-xs font-semibold text-slate-900 tabular-nums">312.8 GB</p>
                <p className="mt-1 text-[9px] text-slate-400">486 个低频文件</p>
              </td>
              <td className="px-4 py-4 text-xs text-slate-400">按量归档</td>
              <td className="px-4 py-4 text-xs text-slate-400">长期保留</td>
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center justify-end gap-2">
                  <button className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">
                    查看文件
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedTier(archiveExpanded ? null : 'archive')}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-expanded={archiveExpanded}
                    aria-controls="archive-storage-details"
                    aria-label={archiveExpanded ? '收起归档存储详情' : '展开归档存储详情'}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${archiveExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </td>
            </tr>

            {archiveExpanded && (
              <tr id="archive-storage-details" className="bg-amber-50/25">
                <td colSpan={5} className="px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">归档规则</p>
                      <p className="mt-1 text-[10px] text-slate-500">低频文件自动归档；恢复至高速存储后可继续用于 Reader、QA、Survey 和 Agent。</p>
                    </div>
                    <button className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-600 transition hover:text-slate-950">
                      管理归档文件
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
