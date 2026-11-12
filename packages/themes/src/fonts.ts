/** Where a font family can be loaded from, in the shape shadcn's `registry:font` items need. */
export interface FontSource {
  /** The family name as the installed font package registers it. */
  cssFamily: string
  /** Generic fallback family. */
  generic: 'sans-serif' | 'serif' | 'monospace'
  /** Export name in `next/font/google`, used by shadcn in Next.js projects. */
  import: string
  /** Fontsource package, used by shadcn everywhere else. */
  dependency: string
  /** Weights to load. Only needed for fonts that have no variable version. */
  weight?: string[]
  /**
   * The package's stylesheet for the italic, for a font whose theme sets text
   * in italics. Without it the browser slants the upright letters instead.
   */
  italic?: string
}

/**
 * The fonts the themes use, keyed by the family name written in DESIGN.md.
 * Variable fonts are preferred: one file covers every weight a spec declares.
 */
export const FONTS: Record<string, FontSource> = {
  Archivo: {
    cssFamily: 'Archivo Variable',
    generic: 'sans-serif',
    import: 'Archivo',
    dependency: '@fontsource-variable/archivo',
  },
  'IBM Plex Sans': {
    cssFamily: 'IBM Plex Sans Variable',
    generic: 'sans-serif',
    import: 'IBM_Plex_Sans',
    dependency: '@fontsource-variable/ibm-plex-sans',
  },
  // No variable version exists. Fontsource's default import loads weight 400 only.
  'IBM Plex Mono': {
    cssFamily: 'IBM Plex Mono',
    generic: 'monospace',
    import: 'IBM_Plex_Mono',
    dependency: '@fontsource/ibm-plex-mono',
    weight: ['400', '500'],
  },
  Fraunces: {
    cssFamily: 'Fraunces Variable',
    generic: 'serif',
    import: 'Fraunces',
    dependency: '@fontsource-variable/fraunces',
    italic: 'wght-italic.css',
  },
  'Source Sans 3': {
    cssFamily: 'Source Sans 3 Variable',
    generic: 'sans-serif',
    import: 'Source_Sans_3',
    dependency: '@fontsource-variable/source-sans-3',
    italic: 'wght-italic.css',
  },
  'Source Code Pro': {
    cssFamily: 'Source Code Pro Variable',
    generic: 'monospace',
    import: 'Source_Code_Pro',
    dependency: '@fontsource-variable/source-code-pro',
  },
  'Red Hat Display': {
    cssFamily: 'Red Hat Display Variable',
    generic: 'sans-serif',
    import: 'Red_Hat_Display',
    dependency: '@fontsource-variable/red-hat-display',
  },
  'Red Hat Text': {
    cssFamily: 'Red Hat Text Variable',
    generic: 'sans-serif',
    import: 'Red_Hat_Text',
    dependency: '@fontsource-variable/red-hat-text',
  },
  'Red Hat Mono': {
    cssFamily: 'Red Hat Mono Variable',
    generic: 'monospace',
    import: 'Red_Hat_Mono',
    dependency: '@fontsource-variable/red-hat-mono',
  },
  // Kiln
  'Bricolage Grotesque': {
    cssFamily: 'Bricolage Grotesque Variable',
    generic: 'sans-serif',
    import: 'Bricolage_Grotesque',
    dependency: '@fontsource-variable/bricolage-grotesque',
  },
  'DM Sans': {
    cssFamily: 'DM Sans Variable',
    generic: 'sans-serif',
    import: 'DM_Sans',
    dependency: '@fontsource-variable/dm-sans',
  },
  'DM Mono': {
    cssFamily: 'DM Mono',
    generic: 'monospace',
    import: 'DM_Mono',
    dependency: '@fontsource/dm-mono',
    weight: ['400', '500'],
  },
  // Ledger
  'Instrument Serif': {
    cssFamily: 'Instrument Serif',
    generic: 'serif',
    import: 'Instrument_Serif',
    dependency: '@fontsource/instrument-serif',
    weight: ['400'],
    italic: '400-italic.css',
  },
  'Instrument Sans': {
    cssFamily: 'Instrument Sans Variable',
    generic: 'sans-serif',
    import: 'Instrument_Sans',
    dependency: '@fontsource-variable/instrument-sans',
  },
  'Spline Sans Mono': {
    cssFamily: 'Spline Sans Mono Variable',
    generic: 'monospace',
    import: 'Spline_Sans_Mono',
    dependency: '@fontsource-variable/spline-sans-mono',
  },
  // Cipher
  'JetBrains Mono': {
    cssFamily: 'JetBrains Mono Variable',
    generic: 'monospace',
    import: 'JetBrains_Mono',
    dependency: '@fontsource-variable/jetbrains-mono',
  },
  'Geist': {
    cssFamily: 'Geist Variable',
    generic: 'sans-serif',
    import: 'Geist',
    dependency: '@fontsource-variable/geist',
  },
  // Sorbet
  'Gabarito': {
    cssFamily: 'Gabarito Variable',
    generic: 'sans-serif',
    import: 'Gabarito',
    dependency: '@fontsource-variable/gabarito',
  },
  'Figtree': {
    cssFamily: 'Figtree Variable',
    generic: 'sans-serif',
    import: 'Figtree',
    dependency: '@fontsource-variable/figtree',
  },
  'Sometype Mono': {
    cssFamily: 'Sometype Mono Variable',
    generic: 'monospace',
    import: 'Sometype_Mono',
    dependency: '@fontsource-variable/sometype-mono',
  },
  // Atelier
  'Bodoni Moda': {
    cssFamily: 'Bodoni Moda Variable',
    generic: 'serif',
    import: 'Bodoni_Moda',
    dependency: '@fontsource-variable/bodoni-moda',
    italic: 'wght-italic.css',
  },
  'Hanken Grotesk': {
    cssFamily: 'Hanken Grotesk Variable',
    generic: 'sans-serif',
    import: 'Hanken_Grotesk',
    dependency: '@fontsource-variable/hanken-grotesk',
  },
  'Fragment Mono': {
    cssFamily: 'Fragment Mono',
    generic: 'monospace',
    import: 'Fragment_Mono',
    dependency: '@fontsource/fragment-mono',
    weight: ['400'],
  },
  // Civic
  'Public Sans': {
    cssFamily: 'Public Sans Variable',
    generic: 'sans-serif',
    import: 'Public_Sans',
    dependency: '@fontsource-variable/public-sans',
  },
  'Atkinson Hyperlegible Next': {
    cssFamily: 'Atkinson Hyperlegible Next Variable',
    generic: 'sans-serif',
    import: 'Atkinson_Hyperlegible_Next',
    dependency: '@fontsource-variable/atkinson-hyperlegible-next',
  },
  'Atkinson Hyperlegible Mono': {
    cssFamily: 'Atkinson Hyperlegible Mono Variable',
    generic: 'monospace',
    import: 'Atkinson_Hyperlegible_Mono',
    dependency: '@fontsource-variable/atkinson-hyperlegible-mono',
  },
  // Dispatch
  'Big Shoulders': {
    cssFamily: 'Big Shoulders Variable',
    generic: 'sans-serif',
    import: 'Big_Shoulders',
    dependency: '@fontsource-variable/big-shoulders',
  },
  'Newsreader': {
    cssFamily: 'Newsreader Variable',
    generic: 'serif',
    import: 'Newsreader',
    dependency: '@fontsource-variable/newsreader',
    italic: 'wght-italic.css',
  },
  'Chivo Mono': {
    cssFamily: 'Chivo Mono Variable',
    generic: 'monospace',
    import: 'Chivo_Mono',
    dependency: '@fontsource-variable/chivo-mono',
  },
  // Tisane
  'Young Serif': {
    cssFamily: 'Young Serif',
    generic: 'serif',
    import: 'Young_Serif',
    dependency: '@fontsource/young-serif',
    weight: ['400'],
  },
  'Albert Sans': {
    cssFamily: 'Albert Sans Variable',
    generic: 'sans-serif',
    import: 'Albert_Sans',
    dependency: '@fontsource-variable/albert-sans',
  },
  'Reddit Mono': {
    cssFamily: 'Reddit Mono Variable',
    generic: 'monospace',
    import: 'Reddit_Mono',
    dependency: '@fontsource-variable/reddit-mono',
  },
  // Voltage
  'Unbounded': {
    cssFamily: 'Unbounded Variable',
    generic: 'sans-serif',
    import: 'Unbounded',
    dependency: '@fontsource-variable/unbounded',
  },
  'Familjen Grotesk': {
    cssFamily: 'Familjen Grotesk Variable',
    generic: 'sans-serif',
    import: 'Familjen_Grotesk',
    dependency: '@fontsource-variable/familjen-grotesk',
  },
  'Space Mono': {
    cssFamily: 'Space Mono',
    generic: 'monospace',
    import: 'Space_Mono',
    dependency: '@fontsource/space-mono',
    weight: ['400', '700'],
  },
  // Nocturne
  'Syne': {
    cssFamily: 'Syne Variable',
    generic: 'sans-serif',
    import: 'Syne',
    dependency: '@fontsource-variable/syne',
  },
  'Onest': {
    cssFamily: 'Onest Variable',
    generic: 'sans-serif',
    import: 'Onest',
    dependency: '@fontsource-variable/onest',
  },
  'Azeret Mono': {
    cssFamily: 'Azeret Mono Variable',
    generic: 'monospace',
    import: 'Azeret_Mono',
    dependency: '@fontsource-variable/azeret-mono',
  },
}
