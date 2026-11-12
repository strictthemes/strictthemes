import { parseColor, formatHex, tokensForMode, toShadcnTheme, type StrictSpec } from '@strictthemes/spec'
import { BASE_MODE, tellSeverity, toPx, type Rules } from './rules.ts'

const TELLS: Record<string, string> = {
  'purple-gradient': 'purple or multi-color gradients',
  'emoji-icons': 'emoji as icons or bullets',
  'nested-cards': 'a card inside a card',
  'glow-shadows': 'colored shadows or glows',
}

/** A size in px as a Tailwind step: 16 is `4`, 1 is `px`, 6 is `1.5`. */
const step = (px: number): string => (px === 1 ? 'px' : String(px / 4))

const named = (tokens: Record<string, string | number | undefined>): string =>
  Object.entries(tokens)
    .map(([name, value]) => [name, toPx(value)] as const)
    .filter((entry): entry is readonly [string, number] => entry[1] !== null)
    .sort((a, b) => a[1] - b[1])
    .map(([name, px]) => `${name} ${px}px`)
    .join(', ')

/**
 * What a theme allows, as plain text for a person or an agent to read before
 * writing UI: the same limits the checks enforce.
 */
export function describeRules(spec: StrictSpec, rules: Rules): string {
  const lines: string[] = [`${rules.name}: what the theme allows`, '']
  const hex = (value: string | undefined): string => {
    const rgb = value === undefined ? null : parseColor(value)
    return rgb ? formatHex(rgb).toUpperCase() : (value ?? '')
  }

  if (rules.colors) {
    const modes = rules.modes.filter((mode) => mode !== BASE_MODE)
    const perMode = modes.map((mode) => tokensForMode(spec, mode).colors)
    lines.push(`Colors${modes.length > 0 ? ` (${[BASE_MODE, ...modes].join(' / ')})` : ''}. Only these; any opacity of them is fine.`)
    const width = Math.max(...Object.keys(spec.colors).map((name) => name.length))
    for (const [name, value] of Object.entries(spec.colors)) {
      const values = [hex(value), ...perMode.map((colors) => hex(colors[name]))]
      lines.push(`  ${name.padEnd(width)}  ${values.join(' / ')}`)
    }
    const shadcn = toShadcnTheme(spec).cssVars
    const classes = Object.entries(shadcn.light).filter(([name, value]) => parseColor(value) !== null && !/^(chart|sidebar)-/.test(name))
    const classWidth = Math.max(...classes.map(([name]) => name.length))
    lines.push(
      '',
      'Color names in a project that installed the theme with shadcn. Use these in classes (bg-card, text-muted-foreground, border-border), never a hex value or a Tailwind palette color. DESIGN.md says what each color is for.',
    )
    for (const [name, value] of classes) {
      const values = [hex(value), ...modes.map((mode) => hex((mode === 'dark' ? shadcn.dark : undefined)?.[name] ?? value))]
      lines.push(`  ${name.padEnd(classWidth)}  ${values.join(' / ')}`)
    }
    lines.push('')
  } else lines.push('Colors: any.', '')

  if (rules.spacing) {
    lines.push(
      `Spacing (padding, margin, gap): ${rules.spacing.map((px) => `${px}px`).join(', ')}.`,
      `  As Tailwind steps: ${rules.spacing.map(step).join(', ')}. For example ${rules.spacing.slice(-3).map((px) => `p-${step(px)}`).join(', ')}. Widths and heights are sizes, not spacing, and are not limited.`,
      '',
    )
  } else lines.push('Spacing: any.', '')

  if (rules.radii) {
    const none = Object.values(spec.rounded).some((value) => toPx(value) === 0) ? '' : ', or none'
    const classes = Object.entries(rules.radiusClasses)
      .sort((a, b) => a[1] - b[1])
      .map(([name, px]) => `rounded-${name} ${px}px`)
      .join(', ')
    const full =
      rules.fullRound > 0
        ? ` A full round (\`rounded-full\`) only on a box up to ${rules.fullRound}px across, where DESIGN.md names one.`
        : ' No full rounds.'
    lines.push(`Corners: ${named(spec.rounded)}${none}. Classes: ${classes}.${full}`, '')
  } else lines.push('Corners: any.', '')

  if (rules.sizes) {
    const sizes = Object.fromEntries(Object.entries(spec.typography).map(([name, token]) => [name, token.fontSize]))
    lines.push(`Type sizes: ${named(sizes)}. Classes: ${[...rules.sizeNames].map((name) => `text-${name}`).join(', ')}. No other size, such as text-sm.`)
  } else lines.push('Type sizes: any.')
  if (rules.weights) lines.push(`Font weights: ${rules.weights.join(', ')}.`)
  if (rules.fonts) {
    const families = [...new Set(Object.values(spec.typography).map((token) => token.fontFamily).filter((family) => family !== undefined))]
    lines.push(`Fonts: ${families.join(', ')}. No other family.`)
  }
  lines.push('')

  lines.push(
    `Contrast: WCAG ${rules.contrast.level}. Text needs ${rules.contrast.normal}:1 against its background, large text (24px, or 18.66px bold) ${rules.contrast.large}:1.`,
  )
  const tells = Object.keys(rules.tells)
    .map((tell) => [tell, tellSeverity(rules, tell)] as const)
    .filter(([, severity]) => severity !== null)
    .map(([tell, severity]) => `${TELLS[tell] ?? tell} (${severity})`)
  if (tells.length > 0) lines.push(`Not allowed: ${tells.join(', ')}.`)
  lines.push(`Layout: no page may scroll sideways, at 1280px or at 375px.`)
  lines.push(`Color modes: ${rules.modes.join(', ')}.`)
  return `${lines.join('\n')}\n`
}
