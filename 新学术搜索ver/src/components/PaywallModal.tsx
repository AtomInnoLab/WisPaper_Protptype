import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { PricingPage } from './PricingPage';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Pricing"
        className="relative h-[min(92vh,940px)] w-full max-w-[1280px] overflow-hidden rounded-2xl bg-white shadow-[0_32px_100px_-28px_rgba(15,23,42,0.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm backdrop-blur transition hover:bg-slate-100 hover:text-slate-950"
          aria-label="关闭 Pricing"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="h-full overflow-y-auto px-8 pb-8 pt-3 sm:px-10">
          <PricingPage />
        </div>
      </section>
    </div>
  );
}
