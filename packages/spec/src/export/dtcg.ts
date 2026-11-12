import type { StrictSpec } from '../types.ts'

interface DtcgToken {
  $type: string
  $value: unknown
}
type DtcgGroup = Record<string, DtcgToken>

/** Design Tokens Community Group (W3C) JSON, with references already resolved. */
export function toDtcg(spec: StrictSpec): Record<string, unknown> {
  const group = (source: Record<string, string>, type: string): DtcgGroup =>
    Object.fromEntries(
      Object.entries(source).map(([name, value]) => [name, { $type: type, $value: value }]),
    )

  const typography: DtcgGroup = {}
  for (const [name, token] of Object.entries(spec.typography)) {
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = token
    typography[name] = {
      $type: 'typography',
      $value: {
        ...(fontFamily !== undefined ? { fontFamily } : {}),
        ...(fontSize !== undefined ? { fontSize } : {}),
        ...(fontWeight !== undefined ? { fontWeight } : {}),
        ...(lineHeight !== undefined ? { lineHeight } : {}),
        ...(letterSpacing !== undefined ? { letterSpacing } : {}),
      },
    }
  }

  return {
    $description: spec.description ?? spec.name,
    color: group(spec.colors, 'color'),
    typography,
    rounded: group(spec.rounded, 'dimension'),
    spacing: group(spec.spacing, 'dimension'),
  }
}
