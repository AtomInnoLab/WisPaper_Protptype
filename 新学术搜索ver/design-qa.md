# Tools & Figure to PPTX Design QA

- Reference: `codex-clipboard-9b7fd877-6914-46fb-a073-9e221d129361.png`
- Brand visual reference: `https://www.wispaper.ai/zh/home`
- Copy-removal references: `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-1b6ae38f-d39e-4b07-8b1f-306f5d373e6e.png`, `/var/folders/fg/_4m5sn993xbcb9244d3d96_m0000gn/T/codex-clipboard-c9257737-605e-44b4-b861-140df326669d.png`
- Prototype: `http://127.0.0.1:3000/tools/figure-to-pptx`
- Tools hub: `http://127.0.0.1:3000/tools`
- Implementation evidence: in-app browser capture at 1370 × 900 CSS px, device scale factor 1
- Brand reference evidence: in-app browser capture at 1280 × 720 CSS px, device scale factor 1
- Reviewed state: task landing page with conversion history expanded; tools hub
- Review date: 2026-08-17

## Visual comparison

| Area | Result |
| --- | --- |
| Overall shell | Passed — preserves the reference's left navigation, slim top bar, light workspace and right history column. |
| Header and steps | Passed — title, compact subtitle and three-step control retain the same hierarchy and alignment. |
| Primary workspace | Passed — white task canvas remains the dominant surface and fits the same desktop density. |
| Start actions | Passed — upload and example actions are clear, compact and visually consistent with the blue/black/white system. |
| Example content | Passed — static process diagram is upgraded to an embedded Remotion exploded-view animation without changing the page structure. |
| History | Passed — three realistic states remain visible with download, retry and delete actions. |
| Responsive behavior | Passed — the task intro, animation and history collapse into a readable single-column flow at narrower widths. |
| Copy hierarchy | Passed — removed the three capability chips, object-count statistics, repeated gray descriptions and matching low-priority copy from tool states and the tools hub. |
| WisPaper brand alignment | Passed — the revised tool surfaces use the source site's pale blue-gray canvas, white content planes, black pill CTAs, dark display type, restrained blue accents, fine cool-gray borders and generous spacing. |

## Focused comparison

- Compared the two supplied crops against the revised task landing page in the same light theme.
- The targeted capability chips and object-count block are no longer rendered.
- The remaining title, animation, workflow state and primary actions retain their previous spacing, typography and blue/black/white token system.
- The homepage and tool workspace serve different product contexts, so comparison was normalized around the shared visual system rather than identical section geometry.

## Interaction verification

- The left navigation “工具” item opens the tools hub and remains selected on child tool routes.
- The tools hub presents one available Figure to PPTX card and two clearly disabled upcoming tools.
- “进入工具” opens `/tools/figure-to-pptx` without losing the shared application shell.
- The “工具中心” breadcrumb returns to `/tools`.
- “体验示例” opens the page-selection state.
- The default selection is valid and can be redrawn.
- “生成可编辑 PPTX” transitions through generation states.
- The result shows “PPTX 已生成” and a download action.
- The Remotion example auto-plays and loops.
- Primary actions remain visible after copy removal.
- No P0/P1/P2 typography, spacing, color, asset-quality or content issues were found in the revised desktop view.
- Existing copy was preserved; no new marketing or explanatory text was introduced.

## Remaining issues

- P3: The embedded Remotion package increases the JavaScript bundle size. Lazy-loading can be considered before production implementation.

final result: passed
