import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, CreditCard, HardDrive, X } from 'lucide-react';

interface StoragePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBaseGb?: number;
  currentAddonGb?: number;
  availableCredits?: number;
}

type PaymentProvider = 'airwallex' | 'stripe';

interface StorageOption {
  gigabytes: number;
  label: string;
}

const STORAGE_PRICE_PER_GB = 0.6;

const storageOptions: StorageOption[] = [
  { gigabytes: 10, label: '10 GB' },
  { gigabytes: 25, label: '25 GB' },
  { gigabytes: 50, label: '50 GB' },
  { gigabytes: 100, label: '100 GB' },
  { gigabytes: 200, label: '200 GB' },
  { gigabytes: 500, label: '500 GB' },
  { gigabytes: 750, label: '750 GB' },
  { gigabytes: 1000, label: '1 TB' },
];

const paymentProviders: Array<{
  id: PaymentProvider;
  name: string;
  description: string;
}> = [
  { id: 'airwallex', name: 'Airwallex', description: '支持人民币及常用银行卡' },
  { id: 'stripe', name: 'Stripe', description: '支持国际信用卡或借记卡' },
];

export function StoragePurchaseDialog({
  isOpen,
  onClose,
}: StoragePurchaseDialogProps) {
  const [gigabytes, setGigabytes] = useState(10);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('airwallex');
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setGigabytes(10);
    setPaymentProvider('airwallex');
    setPurchased(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedOption = storageOptions.find((option) => option.gigabytes === gigabytes) ?? storageOptions[0];
  const monthlyPrice = gigabytes * STORAGE_PRICE_PER_GB;
  const selectedPaymentName = paymentProviders.find((provider) => provider.id === paymentProvider)?.name;

  return (
    <div
      className="fixed inset-0 z-[10030] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[22px] bg-white shadow-[0_28px_90px_-30px_rgba(15,23,42,0.55)]"
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
            <h3 id="storage-purchase-title" className="mt-5 text-xl font-semibold text-slate-950">
              额外空间已开通
            </h3>
            <p className="mt-2 text-sm text-slate-500">高速存储额度已更新，可立即使用</p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-slate-50 px-5 py-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">新增容量</span>
                <strong className="text-base font-semibold text-slate-950">{selectedOption.label}</strong>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-500">支付方式</span>
                <strong className="text-sm font-semibold text-slate-950">{selectedPaymentName}</strong>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm text-slate-500">订阅金额</span>
                <strong className="text-base font-semibold text-slate-950">¥{monthlyPrice.toFixed(2)} / 月</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              完成
            </button>
          </div>
        ) : (
          <>
            <header className="flex items-start justify-between px-7 pb-4 pt-6">
              <div>
                <h3 id="storage-purchase-title" className="text-xl font-semibold tracking-tight text-slate-950">
                  购买额外高速存储
                </h3>
                <p className="mt-1.5 text-sm text-slate-500">选择容量和支付方式</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="关闭购买额外存储"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="px-7 pb-6">
              <section aria-labelledby="storage-capacity-label">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <HardDrive className="h-4 w-4" />
                  </span>
                  <h4 id="storage-capacity-label" className="text-sm font-semibold text-slate-900">
                    存储容量
                  </h4>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {storageOptions.map((option) => {
                    const isSelected = gigabytes === option.gigabytes;
                    const optionPrice = option.gigabytes * STORAGE_PRICE_PER_GB;

                    return (
                      <button
                        key={option.gigabytes}
                        type="button"
                        onClick={() => setGigabytes(option.gigabytes)}
                        aria-pressed={isSelected}
                        className={`relative min-h-[76px] rounded-xl border px-3 py-3 text-left transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 shadow-[0_0_0_1px_rgba(37,99,235,0.08)]'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                        )}
                        <span className={`block text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                          {option.label}
                        </span>
                        <span className="mt-1.5 block text-xs text-slate-500">¥{optionPrice.toLocaleString('zh-CN')} / 月</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mt-6" aria-labelledby="storage-payment-label">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <CreditCard className="h-4 w-4" />
                  </span>
                  <h4 id="storage-payment-label" className="text-sm font-semibold text-slate-900">
                    支付方式
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {paymentProviders.map((provider) => {
                    const isSelected = paymentProvider === provider.id;
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setPaymentProvider(provider.id)}
                        aria-pressed={isSelected}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>
                          <span className={`block text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                            {provider.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-slate-500">{provider.description}</span>
                        </span>
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-7 py-4">
              <div>
                <p className="text-xs text-slate-500">应付金额</p>
                <p className="mt-0.5 text-xl font-semibold text-slate-950">
                  ¥{monthlyPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="ml-1 text-xs font-normal text-slate-500">/ 月</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPurchased(true)}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.99]"
              >
                使用 {selectedPaymentName} 支付
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
