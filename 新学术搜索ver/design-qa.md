# Reader marquee-to-PPT design QA

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-da0e51db-bdc4-4d85-8ae5-3629869e3651.png`
- Implementation screenshot: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/reader-marquee-right-toolbar.png`
- Prototype: `http://127.0.0.1:3000/`
- Viewport: 1967 × 1323 CSS px, device scale factor 1
- Source pixels: 750 × 124; implementation pixels: 1967 × 1323
- State: PDF reader, Paper tab, “框选” active, a valid region selected, “转 PPT” action visible
- Review date: 2026-08-18

## Full-view comparison evidence

- The reader keeps the reference hierarchy: compact white operation bar above a light-gray PDF canvas.
- Existing open-file, like, bookmark, download, fullscreen and share actions remain unchanged.
- The new control is positioned in the right operation group, immediately after “打开本地文件”, and uses the same compact icon/action language and existing blue selected-tool token.
- The selected region is visibly bounded without hiding the underlying PDF content; its action stays visually attached to the selection.

## Focused region comparison evidence

- Focused toolbar comparison was required because the source only depicts the operation bar.
- Typography: the visible “框选” label uses the same small UI weight and baseline as adjacent toolbar controls.
- Spacing/layout: 32 px tool height, compact horizontal padding and 6 px control radius align with the right-side operation buttons; the left reader-tool group no longer contains “框选”.
- Colors/tokens: white toolbar, slate icons and WisPaper blue active state preserve the blue/black/white system.
- Image/icon quality: `ScanLine`, `Presentation`, and `X` come from the project icon library; no placeholder or custom-drawn assets were introduced.
- Copy/content: only the requested “框选” and “转 PPT” labels were added.

## Interaction verification

- Selecting “框选” changes the tool to an active blue state.
- The control is rendered in the right operation group before like, bookmark, download, fullscreen and share.
- Pointer drag creates and preserves a rectangular selection.
- Tiny accidental selections under 36 × 36 px are discarded.
- “取消框选” clears the current selection.
- “转 PPT” opens `/tools/figure-to-pptx`.
- The destination recognizes reader context and exposes “返回阅读器”.
- Production build completed successfully.
- No new console errors were produced by this flow. Two pre-existing Radix dialog warnings from the homepage preview modal remain unrelated to the reader change.

## Comparison history

- Pass 1: no P0/P1/P2 visual or interaction issues found. No corrective iteration was required.

## Follow-up polish

- P3: production integration should pass the actual page number and crop coordinates to the conversion task instead of the current prototype example state.

final result: passed
