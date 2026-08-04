# Storage Purchase Dialog Design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-1bbcf776-205d-4598-bedb-23cba5d90f15.png`
- Product requirements applied to the source:
  - Remove the capacity slider.
  - Keep exactly eight fixed capacity options from 10 GB to 1 TB.
  - Remove Credits balance, Credits deductions, and Credits renewal copy.
  - Use real-currency payment with Airwallex and Stripe.
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/storage-purchase-dialog-final.png`
- Focused implementation region: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/storage-purchase-dialog-focused.png`
- Combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/storage-purchase-dialog-comparison.png`
- Browser viewport: 1869 × 1324 CSS px, device scale factor 1.
- Source pixels: 1094 × 1338.
- Implementation pixels: 1869 × 1324.
- Focused implementation pixels: 577 × 540.
- Normalization: the full-view source and implementation were proportionally downscaled into one comparison board; the focused implementation was also inspected at native pixel size.
- State: purchase dialog open, 10 GB selected, Airwallex selected.

## Full-view Comparison

The implementation intentionally reduces the old tall Credits-based purchase sheet to a compact payment dialog. The modal remains centered over the existing account settings page, preserves the product's white surface, blue primary action, rounded corners, and subdued backdrop, while removing the obsolete dark slider panel and Credits summary blocks.

## Focused-region Comparison

The modal detail was inspected separately because capacity labels, prices, provider descriptions, selected states, and footer totals are too small to judge reliably in the full-view comparison. All eight capacity options are legible; selection uses both a blue surface and check indicator; Airwallex and Stripe are presented as mutually exclusive payment choices; the real-currency total and provider-specific CTA remain visible without scrolling.

## Required Fidelity Surfaces

- Fonts and typography: matches the existing application font stack and hierarchy. Capacity and payment labels use readable 14 px weights; secondary payment descriptions remain legible at 11 px.
- Spacing and layout rhythm: 4-column capacity grid, 2-column payment grid, 22 px modal radius, and compact footer create a consistent and substantially simpler flow with no overlap or clipping.
- Colors and visual tokens: retains the application's slate neutral palette and blue selection/CTA token. Selected states have sufficient contrast and do not rely on color alone.
- Image quality and asset fidelity: no raster assets are required by this component. Icons use the project's existing icon library; no placeholder, inline SVG, or CSS-drawn asset was introduced.
- Copy and content: no Credits balance, Credits deduction, Credits renewal explanation, or slider copy remains. Currency is shown in RMB, and both Airwallex and Stripe are available.
- Responsiveness and accessibility: capacity and payment choices are semantic buttons with `aria-pressed`; dialog labelling is intact; controls have hover, selected, active, and success states.

## Interaction Verification

- Selected 1 TB and confirmed the total changed to ¥600.00 / month.
- Switched payment from Airwallex to Stripe and confirmed the CTA changed to “使用 Stripe 支付”.
- Completed the local prototype purchase and confirmed the success state displayed 1 TB, Stripe, and ¥600.00 / month.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- No actionable P0, P1, or P2 issues remain.

## Comparison History

- Initial comparison: no P0/P1/P2 issues were found. The major visual differences from the source are intentional outcomes of the user's simplification and payment-model requirements, not implementation drift.

## Follow-up Polish

- P3: provider brand marks could be added later if approved brand assets become available; the current text-first treatment is intentionally neutral and compact.

final result: passed

---

# Voucher Credits Card Design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-91aabbbd-2cc8-4746-a1b9-e14ad1eb3eca.png`
- Browser-rendered implementation: `/Users/trimeresurus/Documents/wp原型/voucher-credits-card-expanded.png`
- Combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/voucher-credits-comparison.png`
- State: Account settings > Membership & Credits, Voucher Credits expanded.

## Required Fidelity Surfaces

- Structure: the new Voucher Credits card follows the Recharge Credits card's header, aggregate balance, progress, and expandable per-record hierarchy.
- Functional targeting: `Agent` and `Search` tags appear in the aggregate header and on their corresponding records; each record explicitly states that it can only be used by its tagged feature.
- Balance model: the collapsed state shows the aggregate remaining balance; the expanded state shows independent issued amount, used amount, remaining amount, issue date, expiry date, and progress for every voucher grant.
- Visual distinction: the violet accent differentiates restricted voucher credits from blue general-purpose recharge credits while preserving the existing card tokens and spacing rhythm.
- Accessibility: the expandable card exposes `aria-expanded`; aggregate and record-level usage meters expose progressbar semantics.

## Interaction Verification

- Opened Membership & Credits and confirmed the card appears directly below Recharge Credits.
- Expanded Voucher Credits and confirmed both Agent and Search records render independently.
- Confirmed targeted-use and expiry copy is visible for every record.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- No actionable P0, P1, or P2 issues remain.

final result: passed
