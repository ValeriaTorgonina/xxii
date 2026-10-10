# Design kit verification

Final dependency and rendering checks: 2026-10-10. Earlier interaction checks were performed during this integration. Evidence is saved in `output/design-qa/`.

## Assets and rendering

- All 44 original PNGs were decoded and checked for real transparent pixels, dimensions, manifest hashes and unique registry paths. All 22 day/list pairs were visually inspected in contact sheets, including thumbnails at approximately 64 px. VIII is Strength and XI is Justice.
- `node scripts/verify-design-assets.cjs` passes: 44 distinct RGBA PNGs match the registry and manifest.
- All 22 detail cards were opened at 320, 390, 430 and 768 px (88 checks), with loaded day illustrations and no horizontal document overflow. All list illustrations loaded during catalog inspection.
- Final catalog screenshots were refreshed at all four widths after fonts and eager images loaded. No horizontal overflow was detected. The implementation was visually compared with the kit reference.
- iPhone 16 Pro, iOS 18.3, Expo Go: app launched with local fonts, decorations and illustrations; safe-area spacing inspected. Accessibility Extra Large text was checked after relaunch: tabs stack and content grows vertically. Normal text size was restored and the app left open.

## Interaction checks

- Search, empty results and reset; group counts; opening a card, next/previous navigation and return with query/group preserved.
- Returning from a card preserves catalog scroll position. The daily card scrolls with the page. Detail navigation stays below scrolling content; boundary navigation is disabled.
- Practice answer reveal, next exercise and answer reset; reversed artwork.
- Web keyboard focus, tab Arrow/Home navigation and selected semantics. Search focus has a visible outline.
- Induced artwork failure, fallback and successful retry after restoring the image request.
- Reduced-motion browser preference checked; the implementation has no animated transitions.
- Web loading strategy: day plus first five thumbnails eager, remaining seventeen thumbnails lazy.

## Build checks

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npx expo-doctor`: 18/18 checks passed after SDK-compatible dependency updates.
- Web production export: passed.
- Dependency graph checked with Madge: no circular dependencies.

## Evidence

- `app-320.png`, `app-390.png`, `app-430.png`, `app-768.png`: final catalog.
- `detail-320.png`, `detail-390.png`, `practice-390.png`: detail and practice states.
- `ios-main.png`, `ios-large-text.png`: native normal and enlarged text.
- `asset-sheet-1.png`, `asset-sheet-2.png`, `assets.json`: asset inspection.
- `ios-large-text-before-adjustment.png`: historical diagnostic capture, not the final layout.

## Limitations

- Android, physical devices, VoiceOver and native software-keyboard interaction have not been manually verified. Keyboard navigation checks above refer to web.
- Large-text inspection covered the catalog's initial viewport; a full assistive-technology audit remains outstanding.
- A standalone iOS release build was not produced. Expo Go does not verify the standalone splash screen or native app configuration.
- Supplied original artwork is retained at full resolution; release download size and memory use have not been profiled.
- npm reports 51 dependency vulnerabilities (1 low, 18 moderate, 31 high, 1 critical). Expo compatibility checks are not a security audit; dependency remediation is separate work.
- Integration preserves the existing repository architecture; see the integration guide for the separate mobile-architecture migration scope.
