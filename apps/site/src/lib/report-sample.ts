// strict-ignore-file: a report that Strict Check printed. It names the
// off-theme classes it found, so the check would find them here again.

/**
 * What `npx @strictthemes/check` printed for a small test page that wears the
 * Kiln theme and breaks it on purpose. Shortened: the rows and errors left
 * out are marked with "…". Every line that is here is as it was printed.
 */
export const REPORT_SAMPLE = `Strict Check: Kiln

Source code
  colors           1 checked  1 off
  spacing          2 checked  1 off

Rendered pages: / in light and dark mode at 1280px and 375px
  colors          14 checked  8 off
  spacing         32 checked  8 off
  typography      24 checked  12 off
  contrast         8 checked  all on theme
  …

Errors in the source (2)
  color-off-token
    \`bg-blue-500\` is a Tailwind palette color, not one of the Kiln colors. …
    src/App.tsx:2
  spacing-off-scale
    \`p-3\` is 12px, which is not on the spacing scale (0, 1, 2, 4, 8, 16, 24, 40, 80px).
    src/App.tsx:2

Errors on the rendered pages (4)
  type-off-scale
    Text is 32px, which is not in the type scale (12, 16, 24, 38, 60px).
    h1 "Bowls"  [light, dark; 1280px, 375px]
  …

Failed: 67.7% of 93 measured values follow the theme. 6 errors, 0 warnings.`
