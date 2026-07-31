# Research canvas interaction design QA

## Evidence

- Source visual truth: `/Users/trimeresurus/.codex/generated_images/019fa7d7-4b3c-70c3-aecd-0c7556ccb222/call_3y03s0ohoLqZaJdjLW2ZiGHD.png`
- Browser-rendered implementation: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/research-canvas-interactions-final.png`
- Combined comparison: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/research-canvas-interactions-comparison.png`
- New-card menu state: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/research-canvas-new-card-menu.png`
- Comments state: `/Users/trimeresurus/Desktop/-1/新学术搜索ver/research-canvas-comments-state.png`
- Route/state: Workspace → 科研画布；“位置偏置假设”选中；右侧“AI 建议”激活
- Browser: Codex in-app browser at `http://127.0.0.1:3000/`
- Source pixels: 1487 × 1058
- Implementation pixels: 1868 × 1324
- Browser CSS viewport: 1868 × 1324 at 1× density
- Normalization: source resized to 1868 px width and top-cropped to 1868 × 1324; implementation retained at native size. Both are stacked in one 1868 × 2648 comparison.

## Full-view comparison evidence

The enhanced implementation preserves the selected concept’s project header, semantic research graph, left navigation, persistent inspector, restrained color system, compact card hierarchy, and bottom canvas controls. New Agent and comment cards extend the same graph rather than creating a disconnected dashboard.

At widths above 1700 px the canvas opens at 100%, at 1400–1699 px it opens at 92%, and below 1400 px it opens at 80%. This preserves readable card scale and prevents paper cards from clipping behind the inspector.

## Focused interaction evidence

- The new-card capture shows a compact menu with five visually distinct types: research hypothesis, paper, Agent, comment, and experiment.
- The comments capture shows the selected node’s discussion count, collaborator avatars, timestamps, replies, and comment composer.
- The default capture shows the Agent running state with a live indicator, animated spinner, pulsing elevation, progress value, and task-specific copy.

## Required fidelity surfaces

- Fonts and typography: Keeps the existing sans-serif product stack, 10–13 px canvas metadata, 13–16 px node titles, and compact inspector hierarchy. New card types use the same optical weights and line heights.
- Spacing and layout rhythm: Existing header and inspector dimensions are preserved. Agent, comment, experiment, and finding cards were separated into clear rows after visual QA to prevent collisions.
- Colors and visual tokens: Paper uses blue, Agent violet, comment amber, experiment orange, and findings/methods emerald. Selected state remains blue and semantic link colors remain consistent.
- Image quality and asset fidelity: Uses the existing WisPaper logo, generated collaborator portraits, and the product’s current icon library. No placeholder imagery was introduced.
- Copy and content: New states use realistic research collaboration copy, including evidence screening, NeedleBench discussion, validation experiments, and AI recommendations.
- Motion: Running Agent cards use restrained shadow pulsing, a spinning activity indicator, a live status dot, and progressive completion without moving the card’s geometry.

## Interaction checks

- Opened the left-sidebar “科研画布 · 实验” entry.
- Opened the new-card menu and created a paper card.
- Entered association mode, selected two cards, and confirmed a new “关联” edge was added.
- Opened the comments tab, added a comment, and confirmed the count changed from 2 to 3.
- Opened the running Agent from the header and confirmed the detail inspector shows real-time status and the Agent-workspace action.
- Confirmed manual zoom controls update the scale.
- Confirmed the implementation includes pointer-drag handlers with zoom-compensated card coordinates, dynamic edge recalculation, touch pinch handling, and trackpad pinch handling through modifier-wheel input.
- Production build completed successfully.

## Findings and comparison history

- Pass 1 — P1: Paper, Agent, and comment objects did not have sufficient type distinction. Added dedicated icons, semantic surfaces, border colors, metadata, and type-specific content.
- Pass 1 — P1: Static connectors would not follow dragged cards. Replaced hard-coded line positions with graph edges calculated from current node coordinates.
- Pass 1 — P2: Agent and comment cards overlapped the experiment/finding row. Moved the bottom row down and repeated visual capture.
- Pass 2 — P2: The graph appeared undersized on the 1868 px viewport. Added responsive initial zoom with a 100% large-desktop state.
- Pass 3: Recaptured default, new-card, and comments states. No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: Persist node coordinates, zoom, comments, and edges to a project API after usability validation.
- P3: Add multiplayer cursors and conflict resolution when real-time collaboration enters scope.
- P3: Add keyboard shortcuts and an undo history stack before production rollout.

## Final result

final result: passed
