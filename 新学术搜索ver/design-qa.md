# Scholar QA Design QA

- Date: 2026-08-10
- Reference: three supplied Scholar QA desktop designs
- Implementation: `src/components/ScholarQA.tsx`, `ScholarQAComposer.tsx`, `ScholarQAResults.tsx`
- Verification viewports: 1280 × 720 interaction pass; 2000 × 1504 source-size visual comparison

## Visual comparison

- Start state preserves the reference hierarchy: centered headline, large white composer, source scope, reasoning depth, circular submit control, and QA history in the left navigation.
- Answer state preserves the reference hierarchy: question bubble, WisPaper response identity, collapsible reasoning/evidence panel, cited answer, response actions, and persistent bottom composer.
- Citation state preserves the supplied reference pattern: dimmed workspace backdrop, centered white detail card, prominent close control, and concise bibliographic information. The implementation adds the requested reader and original-page actions.
- Existing WisPaper navigation, typography, and light neutral palette were retained so the new flow belongs to the current prototype rather than appearing as a detached mock.

## Interaction verification

- [x] Open Scholar QA from first-level navigation.
- [x] Start a new Q&A from the history section.
- [x] Select single paper, entire library, or Scholar Search.
- [x] Select low, medium, or high reasoning depth.
- [x] Submit by button or Enter; Shift+Enter remains available for line breaks.
- [x] Expand and collapse the reasoning/evidence panel.
- [x] Add a follow-up and receive a second answer.
- [x] Copy answer feedback state.
- [x] Open citation 1 and citation 2 from inline answer tags.
- [x] Show title, authors, publication, year, and Open Access status.
- [x] Open-reader and original-page destinations are distinct and valid links.
- [x] Close citation details with the close button, backdrop, or Escape without click-through.
- [x] QA history stays expanded during conversation.
- [x] Floating onboarding control does not cover the QA submit button.

## Checks

- Production build: passed.
- P0 defects: none.
- P1 defects: none.
- P2 defects: none.

final result: passed

---

# Home Redesign Design QA

- Date: 2026-08-10
- Source target: captured Collective OS desktop reference plus the approved WisPaper editorial-split design plan
- Implementation: `src/components/ResearchLanding.tsx`, wired through `src/components/HomePage.tsx`
- Verification: 1280 × 720 desktop, 390 × 844 mobile, scroll states through Bento, pinned story, and final action area

## Visual comparison

- Fonts and typography: the reference's oversized, compressed headline hierarchy is preserved with Geist-compatible fallbacks; the Chinese H1 remains two lines on desktop and three lines on mobile without clipping.
- Spacing and layout rhythm: the floating dark navigation, cinematic whitespace, two-column hero, and layered real product interface preserve the reference's visual rhythm while using WisPaper content.
- Colors and tokens: the page is limited to deep blue-black, WisPaper blue, and white. Text, controls, and image frames meet clear foreground/background contrast.
- Image quality: all large product imagery uses current WisPaper prototype captures; no placeholder artwork or approximate product drawings remain.
- Copy and content: the hero has one value statement, one supporting sentence, and exactly two actions. The remaining page is limited to five core capabilities, a three-step research journey, one compact feedback carousel, and one final action.

## Interaction verification

- [x] Floating navigation remains visible through the full page.
- [x] Search and primary research actions open the Scholar Search marketing surface.
- [x] Workspace, Library, Agent, Pricing, and language controls are wired to existing prototype destinations.
- [x] GSAP hero entrance completes without layout shift.
- [x] Desktop story heading pins while product scenes progress.
- [x] Product screenshots scale and fade through their scroll ranges.
- [x] Feedback arrows change the displayed statement.
- [x] Reduced-motion users receive a static marquee and no GSAP entrance/scroll motion.
- [x] Mobile hero, actions, product preview, and fixed navigation remain within the viewport.
- [x] Browser console has no errors or warnings.

## Fixes applied during QA

- P1: desktop headline was clipped by the inline product image; the image now appears only at sufficiently wide desktop sizes.
- P1: mobile headline overflowed the viewport; mobile wrapping and tracking were corrected.
- P2: document title stayed on the previous marketing page after returning home; the home title now updates by language.

- Production build: passed.
- P0 defects: none.
- P1 defects: none.
- P2 defects: none.

final result: passed
