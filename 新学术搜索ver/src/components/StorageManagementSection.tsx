import React, { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  HardDrive,
  RotateCcw,
  X,
} from 'lucide-react';
import { StoragePurchaseDialog } from './StoragePurchaseDialog';

const baseStorageGb = 50;
const addonStorageGb = 10;
const usedStorageGb = 46.8;
const totalStorageGb = baseStorageGb + addonStorageGb;

export function StorageManagementSection() {
  const [showPurchase, setShowPurchase] = useState(false);
  const [expandedTier, setExpandedTier] = useState<'high-speed' | 'archive' | null>(null);
  const [renewalState, setRenewalState] = useState<'active' | 'confirming' | 'stopped'>('active');
  const highSpeedExpanded = expandedTier === 'high-speed';
  const archiveExpanded = expandedTier === 'archive';

  return (
    <>
      <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-fixed border-collapse text-left">
            <caption className="sr-only">账户存储空间与扩容信息</caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-semibold text-slate-500">
                <th className="w-[20%] px-4 py-3">存储空间</th>
                <th className="w-[19%] px-4 py-3">已用容量 / 总容量</th>
                <th className="w-[11%] px-3 py-3">基础容量</th>
                <th className="w-[11%] px-3 py-3">已购买容量</th>
                <th className="w-[19%] px-4 py-3">已购容量到期时间</th>
                <th className="w-[20%] px-3 py-3 text-right">操作</th>
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
                <td className="px-4 py-4 align-middle">
                  <p className="text-xs font-semibold text-slate-900 tabular-nums">
                    {usedStorageGb} / {totalStorageGb} GB
                  </p>
                </td>
                <td className="px-3 py-4 text-xs font-medium text-slate-700 tabular-nums">{baseStorageGb} GB</td>
                <td className="px-3 py-4 text-xs font-medium text-slate-700 tabular-nums">{addonStorageGb} GB</td>
                <td className="px-4 py-4">
                  <p className="text-xs font-medium text-slate-700 tabular-nums">2026-07-10</p>
                  <p className={`mt-1 text-[9px] ${renewalState === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>
                    {renewalState === 'active' ? '自动续费中' : '到期后不再续费'}
                  </p>
                </td>
                <td className="px-3 py-4 align-middle">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPurchase(true)}
                      className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                      加购空间
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
                  <td colSpan={6} className="px-4 py-4">
                    {renewalState === 'confirming' ? (
                      <div className="flex items-center justify-between gap-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                          <div>
                            <p className="text-xs font-semibold text-amber-950">停止 {addonStorageGb} GB 额外空间续费？</p>
                            <p className="mt-1 text-[10px] leading-4 text-amber-800">
                              可使用至 2026 年 7 月 10 日；到期后超出基础额度的低频文件将自动归档。
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => setRenewalState('active')}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition hover:bg-amber-50"
                          >
                            <X className="h-3.5 w-3.5" />取消
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenewalState('stopped')}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-800 px-3 py-2 text-[10px] font-medium text-white transition hover:bg-amber-900"
                          >
                            <Check className="h-3.5 w-3.5" />确认停止
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            renewalState === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {renewalState === 'active' ? <Clock3 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">额外高速存储 · {addonStorageGb} GB</p>
                            <p className="mt-1 text-[10px] text-slate-500">
                              {renewalState === 'active' ? '当前处于自动续费状态' : '当前额度可使用至 2026-07-10'}
                            </p>
                          </div>
                        </div>
                        {renewalState === 'active' ? (
                          <button
                            type="button"
                            onClick={() => setRenewalState('confirming')}
                            className="text-[10px] font-medium text-slate-500 transition hover:text-red-600"
                          >
                            停止续费
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRenewalState('active')}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            恢复续费
                          </button>
                        )}
                      </div>
                    )}
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
                <td className="px-3 py-4 text-xs text-slate-400">—</td>
                <td className="px-3 py-4 text-xs text-slate-400">—</td>
                <td className="px-4 py-4 text-xs text-slate-400">—</td>
                <td className="px-3 py-4 align-middle">
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
                  <td colSpan={6} className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white px-3.5 py-3 ring-1 ring-slate-200">
                        <p className="text-[9px] text-slate-400">自动归档</p>
                        <p className="mt-1 text-xs font-medium text-slate-900">12 个文件将在 18 天内归档</p>
                      </div>
                      <div className="rounded-lg bg-white px-3.5 py-3 ring-1 ring-slate-200">
                        <p className="text-[9px] text-slate-400">恢复规则</p>
                        <p className="mt-1 text-xs font-medium text-slate-900">恢复后重新计算 6 个月保留期</p>
                      </div>
                    </div>
                    <button className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 transition hover:text-slate-950">
                      管理归档文件
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <StoragePurchaseDialog
        isOpen={showPurchase}
        onClose={() => setShowPurchase(false)}
        currentBaseGb={baseStorageGb}
        currentAddonGb={addonStorageGb}
        availableCredits={42_400}
      />
    </>
  );
}
