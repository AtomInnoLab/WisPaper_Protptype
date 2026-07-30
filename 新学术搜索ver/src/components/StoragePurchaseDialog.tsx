import React, { useEffect, useState } from 'react';
import { CheckCircle2, HardDrive, Info, X, Zap } from 'lucide-react';
import { calculateStorageCredits } from '../utils/storagePricing';

interface StoragePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBaseGb?: number;
  currentAddonGb?: number;
  availableCredits?: number;
}

const quickOptions = [10, 50, 100, 200];

export function StoragePurchaseDialog({
  isOpen,
  onClose,
  currentBaseGb = 50,
  currentAddonGb = 10,
  availableCredits = 42_400,
}: StoragePurchaseDialogProps) {
  const [gigabytes, setGigabytes] = useState(10);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setGigabytes(10);
    setPurchased(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const monthlyCredits = calculateStorageCredits(gigabytes);
  const insufficientCredits = monthlyCredits > availableCredits;
  const totalAfterPurchase = currentBaseGb + currentAddonGb + gigabytes;

  return (
    <div
      className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.6)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-purchase-title"
      >
        {purchased ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 id="storage-purchase-title" className="mt-5 text-xl font-semibold text-slate-950">额外空间已开通</h3>
            <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 overflow-hidden rounded-xl border border-slate-200">
              <div className="border-r border-slate-200 p-4">
                <p className="text-xs text-slate-500">新增高速存储</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{gigabytes} GB</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500">每月扣除</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{monthlyCredits.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">Credits</p>
              </div>
            </div>
            <button onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800">
              完成
            </button>
          </div>
        ) : (
          <>
            <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 id="storage-purchase-title" className="text-lg font-semibold text-slate-950">购买额外高速存储</h3>
                <p className="mt-1 text-xs text-slate-500">按月使用 Credits 自动续费</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="关闭购买额外存储">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="px-6 py-5">
              <div className="rounded-xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><HardDrive className="h-4 w-4" /></span>
                    <span className="text-sm font-medium">额外高速存储</span>
                  </div>
                  <strong className="text-2xl tabular-nums">{gigabytes} GB</strong>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.max(2, (gigabytes / 500) * 100)}%` }} />
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={gigabytes}
                  onChange={(event) => setGigabytes(Number(event.target.value))}
                  aria-label="额外高速存储容量"
                  className="mt-3 w-full accent-blue-500"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>10 GB</span><span>500 GB</span></div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {quickOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGigabytes(option)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      gigabytes === option
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {option} GB
                  </button>
                ))}
              </div>

              <section className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-xs text-slate-500">每月扣除</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950 tabular-nums">{monthlyCredits.toLocaleString()} <span className="text-xs font-medium text-slate-500">Credits</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200">
                  <div className="p-3.5">
                    <p className="text-[10px] text-slate-400">购买后高速总额度</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{totalAfterPurchase} GB</p>
                  </div>
                  <div className="p-3.5">
                    <p className="text-[10px] text-slate-400">当前 Credits 余额</p>
                    <p className={`mt-1 text-sm font-semibold ${insufficientCredits ? 'text-red-600' : 'text-slate-900'}`}>{availableCredits.toLocaleString()}</p>
                  </div>
                </div>
              </section>

              <div className="mt-4 flex gap-2 rounded-xl bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  首月立即扣除 Credits，之后每月自动续费；可随时停止下个周期续费。
                </p>
              </div>
              {insufficientCredits && (
                <p className="mt-3 text-xs font-medium text-red-600">
                  Credits 余额不足，还需 {(monthlyCredits - availableCredits).toLocaleString()} Credits。
                </p>
              )}
            </div>

            <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                取消后下个计费周期停止扣费
              </span>
              <button
                type="button"
                onClick={() => setPurchased(true)}
                disabled={insufficientCredits}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                确认购买 {gigabytes} GB
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
