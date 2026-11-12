import type { Finding, StrictSpec, Tokens } from './types.ts'

const REF = /\{([A-Za-z0-9_.-]+)\}/g
const WHOLE_REF = /^\{([A-Za-z0-9_.-]+)\}$/

function get(root: unknown, ref: string): unknown {
  let node: unknown = root
  for (const key of ref.split('.')) {
    if (node === null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[key]
  }
  return node
}

/**
 * Replaces `{group.token}` references with their values. A value that is
 * exactly one reference takes the referenced value as-is (so a component can
 * point at a whole typography token); references inside a longer string are
 * substituted as text.
 */
export function resolveTokens(raw: Tokens, findings: Finding[], label = ''): Tokens {
  const resolveRef = (ref: string, stack: string[], at: string): unknown => {
    if (stack.includes(ref)) {
      findings.push({
        rule: 'circular-ref',
        severity: 'error',
        message: `${label}Circular reference: ${[...stack, ref].join(' → ')}`,
        path: at,
      })
      return undefined
    }
    const node = get(raw, ref)
    if (node === undefined) {
      findings.push({
        rule: 'broken-ref',
        severity: 'error',
        message: `${label}Reference {${ref}} does not match any token`,
        path: at,
      })
      return undefined
    }
    return resolveValue(node, [...stack, ref], at)
  }

  const resolveValue = (value: unknown, stack: string[], at: string): unknown => {
    if (typeof value === 'string') {
      const whole = WHOLE_REF.exec(value)
      if (whole?.[1]) {
        const resolved = resolveRef(whole[1], stack, at)
        return resolved === undefined ? value : resolved
      }
      return value.replace(REF, (match, ref: string) => {
        const resolved = resolveRef(ref, stack, at)
        return resolved === undefined || typeof resolved === 'object'
          ? match
          : String(resolved)
      })
    }
    if (Array.isArray(value)) {
      return value.map((item, i) => resolveValue(item, stack, `${at}[${i}]`))
    }
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          resolveValue(item, stack, at ? `${at}.${key}` : key),
        ]),
      )
    }
    return value
  }

  return resolveValue(raw, [], '') as Tokens
}

/**
 * Resolved tokens for a mode declared under `strict.modes` (for example
 * "dark"): the mode's color overrides are applied first, then references are
 * resolved, so components that point at an overridden color follow it.
 */
export function tokensForMode(
  spec: StrictSpec,
  mode: string,
  findings: Finding[] = [],
): Tokens {
  const overrides = spec.strict.modes[mode]?.colors ?? {}
  const raw: Tokens = { ...spec.raw, colors: { ...spec.raw.colors, ...overrides } }
  return resolveTokens(raw, findings, `[${mode}] `)
}
