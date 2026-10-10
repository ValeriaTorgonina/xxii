// Geometry and typography from tarot-design-kit/DESIGN-SPEC.md.
export const theme = {
  width: 440,
  edge: 20,
  compactEdge: 16,
  radius: 16,
  pill: 999,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 },
  fonts: {
    title: 'Cormorant400', titleMedium: 'Cormorant500', titleStrong: 'Cormorant600',
    body: 'Inter400', medium: 'Inter500', strong: 'Inter600',
  },
} as const;
