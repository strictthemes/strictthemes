// The Strict mark: an S drawn as two rails that hook into each other, on a
// square. It sits on a 32-unit grid with a 4-unit stroke, so it is sharp at
// 16px and 32px. The header draws it from here, and scripts/build-brand.ts
// makes the favicon, the app icons and the share image from the same path.

/** Where the project's code lives. */
export const REPO_URL = "https://github.com/strictthemes/strictthemes"

/** The two rails, on a 32 by 32 square. */
export const MARK_PATH = "M8 6h16v4H12v4h3v4H8zM24 26H8v-4h12v-4h-3v-4h7z"

/** The brand's own colors: Strict One's primary and the text on it. */
// strict-ignore-next-line: the icon files and the share image are drawn once, in fixed colors
export const BRAND = { blue: "#1F3BFF", onBlue: "#FFFFFF", ink: "#111111" }

/**
 * The mark as an SVG file. `scale` shrinks the rails toward the centre, for an
 * icon a phone may crop to a circle.
 */
export function markSvg(scale = 1): string {
  const rails =
    scale === 1
      ? `<path fill="${BRAND.onBlue}" d="${MARK_PATH}"/>`
      : `<path fill="${BRAND.onBlue}" transform="translate(16 16) scale(${scale}) translate(-16 -16)" d="${MARK_PATH}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${BRAND.blue}"/>${rails}</svg>\n`
}
