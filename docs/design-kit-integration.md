# Antique Gold design integration

## Source of truth

Use `AGENT-INSTRUCTIONS.md` and `tarot-design-kit/DESIGN-SPEC.md`. The supplied demo is a visual reference, not the application's learning logic. `tarot-design-kit/theme.css` defines the palette and typography. The original kit, all 44 transparent PNGs, six local fonts, OFL licenses, SVG decorations, manifest and gallery remain intact.

## Runtime wiring

- `shared/constants/colors.ts` and `theme.ts`: native palette, typography and geometry.
- `app/_layout.tsx`: loads all six local font faces before rendering; displays loading and font-error states.
- `features/Arcana/constants/artwork.ts`: generated static Metro asset imports from each registry entry's `day` and `list` fields. Roman numbers join the registry to the existing domain data without replacing stable route IDs or teaching text. VIII is Strength, XI is Justice.
- `features/Arcana`: shared artwork renderer; fixed-size loading/error placeholders, detail/practice retry, and reversed artwork for practice. Web eagerly loads the first five thumbnails, then uses native browser lazy loading. iOS renders the finite 22-item list with local images.
- `widgets/TarotCatalog`: catalog, daily card, filters, search and practice. Existing daily selection and practice sequence live in `hooks/useCatalog.ts`.
- `widgets/CardStudy`: complete card content with previous/next controls outside the scrolling content. Returning preserves the mounted catalog's filter, query and scroll position.
- `shared/components`: interactive parchment buttons, supplied SVG icons and nine-slice panel frame, scrolling safe-area screen, stars and paper texture. Decorations do not intercept pointer events.
- `assets/design-kit`: raster copies of the supplied parchment/noise SVGs for consistent native rendering of SVG filters. No card was regenerated or recolored. The original SVGs remain in the kit. These PNGs are supplied ready to use; regeneration is not required to build.

The content is centered with a maximum width of 440 px; edges are 20 px (16 px at 360 px and below). Native large-text mode stacks tabs and card rows rather than limiting system text scaling. A tab's touch area remains at least 44 px, so the segmented control may exceed the demo's nominal 46 px height. Long Roman numbers use a smaller size in their narrow column to avoid splitting.

## Commands

```sh
npm install
node scripts/prepare-design-assets.cjs
node scripts/verify-design-assets.cjs
npm run lint
npx tsc --noEmit
npm start
```

The generator uses only Node built-ins. It reads the JSON registry and SVG files, producing static TypeScript references. Keep its generated outputs with the source kit. When replacing assets, update the source manifest deliberately; the validator detects changes rather than silently accepting mismatched files.

The application uses Expo SDK 54-compatible `expo-font`, `expo-linear-gradient`, and `react-native-svg`. Expo Go can render these modules. A standalone native build must be rebuilt after native dependency/configuration changes; app-config splash and system theme changes cannot be verified solely by hot reload.

For this installed Xcode, Expo CLI still expects the former Simulator.app path. An already booted simulator can open the running server directly:

```sh
xcrun simctl openurl booted exp://127.0.0.1:8081
```

## Maintenance scope

This integration uses the application's established `app`, `widgets`, `features`, `shared`, and `lib` structure. Migrating the whole project to the subsequently added mobile standard's `src/core` and `src/modules` layout is a separate architectural task, not part of this visual integration.

See `design-kit-qa.md` for verification evidence and remaining limitations.
