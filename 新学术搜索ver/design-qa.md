# Credit package pool design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-874922ab-c1db-48da-a7c5-ea996d87ad0a.png`
- Page overview: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/credit-package-pool-overview.png`
- Expanded purchase records: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/credit-package-pool-expanded.png`
- Side-by-side removal comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/credit-package-pool-comparison.png`
- State: 我的账户 → 会员与额度，充值包 Credits 池展开
- Browser: Codex in-app browser at `http://127.0.0.1:3000/`
- Source pixels: 1422 × 190
- Implementation pixels: 1967 × 1324
- Browser CSS viewport: 1967 × 1324; default in-app browser density
- Comparison normalization: source and focused implementation crop fitted into equal 900 × 560 frames

## Full-view comparison

The three-column “可用 Credits / 本月已使用 / 自动续费” strip shown in the removal reference is no longer present. The dark plan card ends after the member Credits progress area, eliminating the duplicated aggregate metrics.

## Focused region comparison

The side-by-side evidence compares the exact removed strip against the new plan-card ending. A second browser capture records the expanded recharge pool, showing three independent purchase rows and their progress bars.

## Fidelity review

- Fonts and typography: Existing account-modal typography is preserved. Pool totals and remaining values use tabular numerals for stable alignment.
- Spacing and layout rhythm: Removing the bottom strip shortens the plan card. The pool summary and purchase rows share consistent 16 px horizontal padding and compact vertical separators.
- Colors and visual tokens: The aggregate pool keeps the existing blue semantic color; individual rows use a white surface and lighter blue progress fills.
- Image quality and assets: No raster or custom visual assets are required. The expand affordance uses the existing Lucide chevron icon.
- Copy and content: The pool explicitly states 10,000 total Credits, 4,200 used, 5,800 available, and three purchase records. Each record includes purchase date, expiry date, used amount, total amount, and remaining balance.
- Accessibility: The pool trigger exposes `aria-expanded` and `aria-controls`. The pool and every purchase row expose independent progressbar semantics with current and maximum values.

## Interaction checks

- Confirmed the three removed plan metrics are absent.
- Confirmed the collapsed state shows aggregate total, used, available, and purchase count.
- Confirmed clicking the pool opens three purchase records.
- Confirmed each purchase record has its own progress bar.
- Confirmed clicking again collapses the records, and a second click reopens them.
- Confirmed “购买充值包” remains a separate enabled action.
- Production build completed successfully.
- Console history contained an initial `showCreditPackages` scope error during pass 1. It was fixed; the final reload and all interactions produced no new errors.

## Findings and comparison history

- Pass 1 — P1: Expansion state was declared in the parent modal while the pool renders inside `MembershipPayment`, causing the membership page to crash. Moved the state into `MembershipPayment`.
- Pass 2: Reloaded the app, repeated navigation, collapse, expansion, and reopen checks. No actionable P0, P1, or P2 issues remain.

## Follow-up polish

- P3: Replace the mock purchase rows with API data and calculate pool totals from the returned records.

## Final result

final result: passed
