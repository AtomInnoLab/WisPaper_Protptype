import React from 'react';
import { Player } from '@remotion/player';
import { ArrowRight, FileSearch, FileSpreadsheet } from 'lucide-react';
import { FigureExplodeDemo } from './figure-to-pptx/FigureExplodeDemo';

interface ToolsHubProps {
  onOpenFigureToPPTX: () => void;
}

const upcomingTools = [
  {
    icon: FileSearch,
    name: '虚假引用审查',
  },
  {
    icon: FileSpreadsheet,
    name: 'Table to Excel',
  },
];

export function ToolsHub({ onOpenFigureToPPTX }: ToolsHubProps) {
  return (
    <div className="relative min-h-screen flex-1 overflow-hidden bg-[#f7f9fc] text-[#22262c]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(circle_at_68%_18%,rgba(194,224,251,0.72),transparent_46%),radial-gradient(circle_at_28%_8%,rgba(231,242,253,0.9),transparent_40%)]" />

      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/80 bg-white/82 px-6 backdrop-blur-xl lg:px-10">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold tracking-[-0.01em] text-[#22262c]">工具中心</span>
          <span className="rounded-md bg-[#edf4fb] px-2 py-1 text-[10px] font-medium text-[#557596]">Beta</span>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1240px] px-6 pb-16 pt-12 lg:px-10 lg:pt-16">
        <section className="mb-9">
          <h1 className="text-[40px] font-semibold tracking-[-0.05em] text-[#22262c] sm:text-[48px]">工具</h1>
        </section>

        <section>
          <button
            type="button"
            onClick={onOpenFigureToPPTX}
            className="group w-full overflow-hidden rounded-[30px] border border-white/90 bg-white/88 text-left shadow-[0_22px_70px_rgba(61,92,126,0.10)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(61,92,126,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fa7cc] focus-visible:ring-offset-4"
          >
            <div className="grid min-h-[470px] lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <div>
                  <h2 className="max-w-[320px] text-[30px] font-semibold leading-[1.12] tracking-[-0.045em] text-[#22262c] sm:text-[36px]">论文插图转 PPT</h2>
                  <p className="mt-4 max-w-[320px] text-[13px] leading-6 text-[#6d7782]">框选论文插图，转换为可编辑的 PPT。</p>
                  <p className="mt-5 text-[11px] font-medium text-[#8a949e]">预计消耗：上传后计算 Credits</p>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#22262c] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(34,38,44,0.14)] transition duration-300 group-hover:bg-[#111418]">开始转换 <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
                </div>
              </div>

              <div className="relative flex items-center overflow-hidden border-t border-[#e7edf3] bg-[#eef6fd]/80 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/70 blur-3xl" />
                <Player
                  component={FigureExplodeDemo}
                  durationInFrames={180}
                  compositionWidth={900}
                  compositionHeight={420}
                  fps={30}
                  autoPlay
                  loop
                  controls={false}
                  clickToPlay={false}
                  acknowledgeRemotionLicense
                  style={{ width: '100%', aspectRatio: '900 / 420', overflow: 'visible', background: 'transparent' }}
                />
              </div>
            </div>
          </button>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {upcomingTools.map((tool) => (
              <article key={tool.name} className="flex min-h-[126px] items-center rounded-[22px] border border-white/90 bg-white/78 px-6 py-5 shadow-[0_12px_34px_rgba(61,92,126,0.06)] backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#f1f5f9] text-[#6b7682]"><tool.icon className="h-4 w-4" strokeWidth={1.8} /></span>
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-[#343a42]">{tool.name}</h2>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
