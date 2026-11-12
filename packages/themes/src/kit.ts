import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fontRoles, type StrictSpec } from '@strictthemes/spec'
import { importedPackages } from './blocks.ts'

/**
 * One block of the agent kit as it is written in `packages/kit/blocks`: React
 * source that names spacing and type by the tokens every Strict theme has,
 * not by a size. `gap-sp-md` is a gap of the theme's `md` spacing step, and
 * `type-label` is the theme's label size in the font the theme sets labels in.
 */
export interface KitBlock {
  /** `tool-call`. */
  name: string
  /** `tool-call.tsx`. */
  file: string
  title: string
  description: string
  source: string
}

const first = (stack: string | undefined): string => (stack?.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '')

/**
 * The font class a type token needs on an element that is not a heading:
 * `font-mono` where the theme sets that size in its mono font, `font-heading`
 * where it is the heading font, and nothing for the body font.
 */
export function fontClassFor(spec: StrictSpec, token: string): string {
  const roles = fontRoles(spec.typography)
  const own = first(spec.typography[token]?.fontFamily)
  if (own === '') return ''
  // A theme may set its headings in its mono font: heading sizes then take `font-heading`.
  if (roles.heading && roles.mono && first(roles.heading) === first(roles.mono) && own === first(roles.mono)) {
    return /^(display|h\d)$/.test(token) ? 'font-heading' : 'font-mono'
  }
  if (roles.heading && own === first(roles.heading)) return 'font-heading'
  if (roles.mono && own === first(roles.mono)) return 'font-mono'
  return ''
}

/** A spacing token as the Tailwind step for its size: 16px is `4`, 1px is `px`. */
function stepFor(spec: StrictSpec, token: string): string {
  const match = /^(\d*\.?\d+)(px)?$/.exec((spec.spacing[token] ?? '').trim())
  if (!match) throw new Error(`${spec.name} has no spacing step "${token}" in px, which the agent kit uses.`)
  const px = Number(match[1])
  return px === 1 ? 'px' : String(px / 4)
}

/**
 * Writes a kit source for one theme: every `-sp-<token>` becomes that theme's
 * Tailwind step, and every `type-<token>` its type class with the font class
 * that goes with it. What comes out is plain Tailwind, with nothing left to
 * resolve when the project builds.
 */
export function kitSourceFor(source: string, spec: StrictSpec): string {
  return source
    .replace(/-sp-(xs|sm|md|lg|xl|2xl|3xl)\b/g, (_, token: string) => `-${stepFor(spec, token)}`)
    .replace(/\btype-(display|h1|h2|body|label)\b/g, (_, token: string) => {
      if (spec.typography[token]?.fontSize === undefined) throw new Error(`${spec.name} has no type size "${token}", which the agent kit uses.`)
      const font = fontClassFor(spec, token)
      return font === '' ? `text-${token}` : `${font} text-${token}`
    })
    .replaceAll('__THEME__', spec.name)
}

/** The folder a project gets the kit's files in, under its components folder. */
export const KIT_FOLDER = 'components/agent'

/** The npm packages a kit block imports. */
export const kitDependencies = (block: KitBlock): string[] => importedPackages(block.source)

/** Reads the kit from `packages/kit`: `kit.json` names the blocks, `blocks/` holds their source. */
export function loadKit(dir: string): KitBlock[] {
  const index = join(dir, 'kit.json')
  if (!existsSync(index)) return []
  const { blocks } = JSON.parse(readFileSync(index, 'utf8')) as { blocks: Omit<KitBlock, 'source'>[] }
  return blocks.map((block) => ({ ...block, source: readFileSync(join(dir, 'blocks', block.file), 'utf8') }))
}
