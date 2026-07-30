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
const usagePercent = (usedStorageGb / totalStorageGb) * 100;

export function StorageManagementSection() {
  const [showPurchase, setShowPurchase] = useState(false);
  const [expandedTier, setExpandedTier] = useState<'high-speed' | 'archive' | null>(null);
  const [renewalState, setRenewalState] = useState<'active' | 'confirming' | 'stopped'>('active');
  const highSpeedExpanded = expandedTier === 'high-speed';
  const archiveExpanded = expandedTier === 'archive';

  return (
    <>
      <section className="mt-5 space-y-3">
        <article className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40">
          <div className="flex items-start gap-3 p-4">
            <button
              type="button"
              onClick={() => setExpandedTier(highSpeedExpanded ? null : 'high-speed')}
              className="group flex min-w-0 flex-1 items-start justify-between gap-4 text-left"
              aria-expanded={highSpeedExpanded}
              aria-controls="high-speed-storage-details"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <HardDrive className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-900">高速存储</h3>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-700">可直接使用</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-sm font-semibold text-slate-950 tabular-nums">
                  {usedStorageGb}
                  <span className="ml-1 text-[10px] font-medium text-slate-500">/ {totalStorageGb} GB</span>
                </p>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-700 ${highSpeedExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShowPurchase(true)}
              className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              加购空间
            </button>
          </div>

          <div className="px-4 pb-4">
            <div
              className="h-2 overflow-hidden rounded-full bg-blue-100"
              role="progressbar"
              aria-label="高速存储已使用容量"
              aria-valuemin={0}
              aria-valuemax={totalStorageGb}
              aria-valuenow={usedStorageGb}
            >
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${usagePercent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>已使用 {usedStorageGb} / {totalStorageGb} GB</span>
              <span>{highSpeedExpanded ? '收起额度明细' : '展开查看额度构成'}</span>
            </div>
          </div>

          {highSpeedExpanded && (
            <div id="high-speed-storage-details" className="border-t border-blue-100 bg-white">
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-lg bg-slate-50 px-3.5 py-3">
                  <p className="text-[9px] text-slate-400">会员基础额度</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{baseStorageGb} GB</p>
                </div>
                <div className="rounded-lg bg-blue-50 px-3.5 py-3">
                  <p className="text-[9px] text-blue-500">额外购买额度</p>
                  <p className="mt-1 text-sm font-semibold text-blue-800">{addonStorageGb} GB</p>
                </div>
              </div>

              <div className="border-t border-slate-100">
                {renewalState === 'confirming' ? (
                  <div className="flex items-center justify-between gap-5 bg-amber-50/70 px-4 py-3.5">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <div>
                        <p className="text-xs font-semibold text-amber-950">停止 10 GB 额外空间续费？</p>
                        <p className="mt-1 text-[10px] leading-4 text-amber-800">
                          可使用至 2026 年 7 月 10 日；到期后超出基础额度的低频文件将自动归档。
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setRenewalState('active')}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-700 hover:bg-amber-50"
                      >
                        <X className="h-3.5 w-3.5" />取消
                      </button>
                      <button
                        type="button"
                        onClick={() => setRenewalState('stopped')}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-800 px-3 py-2 text-[10px] font-medium text-white hover:bg-amber-900"
                      >
                        <Check className="h-3.5 w-3.5" />确认停止
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${renewalState === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {renewalState === 'active' ? <Clock3 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900">额外高速存储 · {addonStorageGb} GB</p>
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${
                            renewalState === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {renewalState === 'active' ? '自动续费中' : '已停止续费'}
                          </span>
                        </div>
                        {renewalState === 'stopped' && (
                          <p className="mt-1 text-[10px] text-slate-500">当前额度可使用至 2026-07-10</p>
                        )}
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
                        className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        恢复续费
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </article>

        <article className="overflow-hidden rounded-xl border border-amber-100 bg-amber-50/35">
          <div className="flex items-start gap-3 p-4">
            <button
              type="button"
              onClick={() => setExpandedTier(archiveExpanded ? null : 'archive')}
              className="group flex min-w-0 flex-1 items-start justify-between gap-4 text-left"
              aria-expanded={archiveExpanded}
              aria-controls="archive-storage-details"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Archive className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-900">归档存储</h3>
                  <span className="rounded bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-600">需恢复后使用</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-sm font-semibold text-slate-950 tabular-nums">312.8 GB</p>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:text-slate-700 ${archiveExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <button className="shrink-0 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[10px] font-semibold text-amber-800 transition hover:bg-amber-50">
              查看文件
            </button>
          </div>

          <div className="flex items-center justify-between px-4 pb-4 text-[10px] text-slate-500">
            <span>486 个低频文件</span>
            <span>{archiveExpanded ? '收起归档说明' : '展开查看归档规则'}</span>
          </div>

          {archiveExpanded && (
            <div id="archive-storage-details" className="border-t border-amber-100 bg-white px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 px-3.5 py-3">
                  <p className="text-[9px] text-slate-400">自动归档</p>
                  <p className="mt-1 text-xs font-medium text-slate-900">12 个文件将在 18 天内归档</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3.5 py-3">
                  <p className="text-[9px] text-slate-400">恢复规则</p>
                  <p className="mt-1 text-xs font-medium text-slate-900">恢复后重新计算 6 个月保留期</p>
                </div>
              </div>
              <button className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 hover:text-slate-950">
                管理归档文件
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </article>
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
