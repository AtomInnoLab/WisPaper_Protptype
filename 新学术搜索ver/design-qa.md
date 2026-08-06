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

# AI Feeds Search and Quick Open Design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-baa324eb-0c8e-4f26-bb4d-9b91023a3a0b.png`
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/ai-feeds-search-shortcut.png`
- Source pixels: 2776 × 2412.
- Implementation pixels and CSS viewport: 1884 × 1324; browser device pixel ratio reported as 2.
- Density normalization: not required for the scoped interaction review; the comparison evaluated the same responsive search-hero region rather than asserting full-page pixel parity across different sidebar and viewport crops.
- State: AI Feeds / academic search workspace with a valid DOI entered and the conditional `立即查看` action visible.

## Full-view Comparison Evidence

- The updated implementation preserves the source hierarchy: greeting, large rounded search field, mode controls, right-aligned submission cluster, feed tabs, and paper cards.
- The existing desktop workspace sidebar is intentionally retained; it is outside the scoped search-hero change shown in the source capture.

## Focused Region Comparison Evidence

- The search hero was reviewed at readable scale because the requested change is concentrated in the input and action cluster.
- Typography remains consistent with the existing interface; input text and placeholder retain the established 15 px body hierarchy.
- Spacing and layout rhythm remain consistent: the new action sits directly before the circular submit button and does not displace mode controls.
- Colors and tokens reuse the existing sky accent, pale accent surface, neutral border, rounded-full action treatment, and focus ring.
- Image quality is unchanged; this interaction adds no raster or custom illustrative assets. Icons continue to use the installed icon library.
- Copy is concise and exact: the visible shortcut label is `立即查看`; its accessible name includes identifier type and normalized value.

## Interaction Verification

- Entered a normal keyword query and pressed Enter; confirmed navigation to Scholar Search results.
- Entered `10.48550/arXiv.1706.03762`; confirmed `立即查看` appears beside the normal search action.
- Clicked the shortcut; confirmed direct navigation to the existing quick-reading page for `Attention Is All You Need` without passing through results.
- The shared detector also preserves DOI URL, modern/versioned arXiv, arXiv URL, and legacy arXiv support from the Scholar Search entry page.
- Empty input keeps the normal submit button disabled.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- No actionable P0, P1, or P2 issues remain.

final result: passed

---

# Academic Identifier Search Shortcut Design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-daa4d855-8f1f-44bd-ab61-fee088425a44.png`
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/search-shortcut-final.png`
- Combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/search-shortcut-comparison.png`
- State: Scholar Search landing page with a valid DOI URL entered and the quick-open action visible.

## Required Fidelity Surfaces

- Structure: the shortcut action appears beside the existing circular search button without changing the standard search controls.
- Conditional behavior: the action remains hidden for ordinary queries and malformed identifiers, then animates into place only after a valid identifier is recognized.
- Supported input: DOI values and DOI URLs; modern, versioned, URL-based, and legacy arXiv identifiers.
- Action: clicking `立即查看` bypasses the search-results list and opens the existing quick-reading page for the resolved paper.
- Visual consistency: the blue-tinted pill, book icon, 44 px control height, border, and hover state reuse the existing Scholar Search tokens.
- Accessibility: the button's accessible name includes the detected identifier type and normalized value.

## Interaction Verification

- Entered `not-a-valid-id` and confirmed no quick-open action appeared.
- Entered `1706.03762` and confirmed the arXiv quick-open action appeared.
- Clicked the arXiv action and confirmed the existing quick-reading page opened for `Attention Is All You Need`.
- Entered `https://doi.org/10.48550/arXiv.1706.03762`, confirmed DOI recognition, and confirmed the same direct reader flow.
- Removed the landing-page floating task trigger from this state after it was found to overlap and intercept the new primary shortcut action.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- No actionable P0, P1, or P2 issues remain.

final result: passed

---

# Agent Tier Switcher Design QA

## Evidence

- Source visual truth: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-a07c33d3-7936-4493-a4b6-bee0ec80bff1.png`
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/agent-tier-switcher-final.png`
- Combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/agent-tier-switcher-comparison.png`
- State: Agent launch page, tier switcher open, Balanced selected.

## Required Fidelity Surfaces

- Structure: compact floating menu above the composer with icon, Agent name, consumption multiplier, and selected check state.
- Tier model: Fast, Balanced, Primary, and Deep replace the former Pro/Lite distinction.
- Multiplier format: Fast, the lowest tier, intentionally shows no `1.00x`; all remaining values use two decimal places (`1.35x`, `2.00x`, `3.50x`).
- Product consistency: existing neutral surfaces, rounded controls, icon library, spacing, and composer interaction patterns are preserved.
- Continuity: the selected tier persists after task submission, appears in the working composer, and replaces the old Pro response badge.
- Accessibility: the switcher exposes `aria-expanded`; each option exposes a descriptive accessible label and `aria-pressed` selected state.

## Interaction Verification

- Opened the Agent launch page and confirmed Balanced is selected by default.
- Opened the tier menu and confirmed all four options and multiplier formats.
- Selected Primary and confirmed the composer label updates immediately.
- Submitted a research prompt and confirmed Primary remains selected and replaces the old Pro badge in the response header.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- Initial capture clipped the Fast row at the top of the viewport; the menu was compacted to match the single-line reference structure and the full option list is now visible.
- No actionable P0, P1, or P2 issues remain.

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

---

# Quick Paper Page and OA Reader Handoff Design QA

## Evidence

- Source URL: `https://dev.wispaper.ai/zh/paper?etd=73&rtd=b176a465-8739-49e9-91a9-21256c317b4b&rnd=5f6b1720-495e-4ac3-8e24-fc3b89c2c048`
- Source desktop capture: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/source-quick-reader-desktop-top.png`
- Source mobile capture: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/source-quick-reader-mobile.png`
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/quick-paper-page-desktop.png`
- Mobile implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/quick-paper-page-mobile.png`
- Desktop combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/quick-paper-page-comparison.png`
- Mobile combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/quick-paper-page-mobile-comparison.png`
- Desktop viewport: 1280 × 720 CSS px; screenshots 1280 × 720 px; device pixel ratio reported as 2.
- Mobile viewport and screenshots: 390 × 844 CSS px / pixels.
- State: OA paper quick page for `Attention Is All You Need`, with `从阅读器打开` visible.

## Required Fidelity Surfaces

- Fonts and typography: preserves the source's compact sans-serif hierarchy, semibold paper title, green metadata line, 14–15 px body copy, and readable mobile wrapping.
- Spacing and layout rhythm: matches the centered desktop column, pale-blue page surface, 78 px header, breadcrumb spacing, TL;DR block, action row, and two-column abstract / validation layout. Mobile collapses the content to one column and hides desktop navigation.
- Colors and tokens: reuses the source's near-black actions, light-blue canvas, white translucent content surfaces, slate dividers, muted metadata, and blue verification states.
- Image quality and assets: uses the project's real WisPaper logo asset and the installed icon library; no placeholder imagery or handcrafted icons were introduced.
- Copy and content: carries the source structure—title, authors, TL;DR, original-page action, citation action, abstract, validation criteria, references, and citations—while adding the requested OA-specific reader action.

## Interaction Verification

- A valid DOI/arXiv shortcut now opens the lightweight quick-paper page instead of entering the full reader immediately.
- For the OA mock paper, `从阅读器打开` is present and clicking it opens the existing WisPaper reader.
- For an unmatched DOI without OA metadata, the reader button is absent and `暂无可用的开放获取全文` is shown.
- `以原网页打开` resolves to the DOI or arXiv source URL.
- Reference and citation tabs switch in place; citation copy provides a visible success state.
- Desktop and 390 px mobile layouts were captured and compared with the live source.
- Browser console errors checked: none.
- Production build: passed.

## Findings

- The live source page currently shows `以原网页打开` for this record. The implementation intentionally adds `从阅读器打开` because the user specified the OA state as the target product rule.
- No actionable P0, P1, or P2 issues remain.

final result: passed
