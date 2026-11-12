/** A color as the browser painted it: red, green, blue from 0 to 255 and alpha from 0 to 1. */
export type Rgba = [number, number, number, number]

/** What the rendered check measures on one element. */
export interface ElementData {
  /** A short description for reports: `h2.text-h1 "Compare plans"`. */
  selector: string
  tag: string
  /** True for a stock registry component: the element or an ancestor has `data-slot`. */
  stock: boolean
  /** True when the element has text of its own, or is a text field. */
  hasText: boolean
  /** Text color, with the opacity of the element and its ancestors applied to the alpha. */
  color: Rgba
  /** The element's own background color. */
  background: Rgba
  /** The opaque color behind the element's text, or null when an image or gradient is behind it. */
  backdrop: [number, number, number] | null
  /** The color of each border side that has a width. */
  borders: Rgba[]
  /** Corner radii in px. A percentage radius is reported as -1. */
  radii: number[]
  /** True when the element paints a box: a background, a border or a shadow. */
  boxed: boolean
  fontSize: number
  fontWeight: number
  /** The first family of the computed font stack, without quotes. */
  fontFamily: string
  /** Line height in px, or -1 when it is `normal` (the font's own). */
  lineHeight: number
  /** Letter spacing in px. 0 when it is `normal`. */
  letterSpacing: number
  /** Inside a `<sup>` or `<sub>`, where a line height of its own keeps the line it sits in from moving. */
  raised: boolean
  /** The outline's color when the page draws one, as a focus ring often is. Null for the browser's own (`auto`). */
  outline: Rgba | null
  /** Padding, margin and gap set in px. `auto`, percentages and zero are left out. */
  spacing: { property: string; px: number }[]
  boxShadow: string
  textShadow: string
  backgroundImage: string
  width: number
  height: number
  /** Visually hidden text, such as `sr-only`. */
  hidden: boolean
  disabled: boolean
  /** The right edge is past the viewport and nothing scrolls it. */
  overflowing: boolean
  /** The first emoji in the element's own text. */
  emoji: string | null
  /** Looks like a card: a bordered or shadowed box with rounded corners, of some size. */
  card: boolean
  /** A card that sits inside another card. */
  nestedCard: boolean
}

export interface PageData {
  viewportWidth: number
  /** The width the page can scroll to. Larger than the viewport means it scrolls sideways. */
  scrollWidth: number
  elements: ElementData[]
  /** True when the page had more elements than the check reads. */
  truncated: boolean
  /** The opaque color of the page itself, behind everything. */
  canvas: [number, number, number]
  /** Elements marked `data-strict-ignore`. They and everything inside them were not measured. */
  ignored: number
  /**
   * A state pass: the selectors of the focused elements that look the same as
   * they do unfocused, so nothing shows where the keyboard is.
   */
  unmarked?: string[]
  /** A focus pass: how many focusable elements were looked at. */
  focusable?: number
}

export interface CollectOptions {
  /** Keep what each element looked like, to compare a later state pass with. */
  remember?: boolean
  /**
   * A state pass, after hover or focus was forced on the elements matching
   * `targets`: return only the elements that look different from the remembered pass.
   */
  state?: { name: 'hover' | 'focus'; targets: string }
}

/**
 * Reads the computed styles of every visible element. Runs inside the page,
 * so it must not use anything from outside its own body.
 */
export function collect(options: CollectOptions = {}): PageData {
  const MAX_ELEMENTS = 6000
  type Remembered = { looks: Map<Element, string>; marks: Map<Element, string> }
  const store = window as unknown as { __strictCheck?: Remembered }
  if (options.remember) store.__strictCheck = { looks: new Map(), marks: new Map() }
  const remembered = store.__strictCheck
  const state = options.state
  const unmarked: string[] = []
  /** The elements whose look changed in this state pass. */
  const changed = new Set<Element>()
  const SKIP = new Set(['SCRIPT', 'STYLE', 'HEAD', 'META', 'LINK', 'TITLE', 'NOSCRIPT', 'TEMPLATE', 'BR', 'WBR'])
  const NOT_CARDS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH', 'IMG', 'SVG', 'VIDEO', 'CANVAS', 'LABEL'])
  const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u
  const SPACING = [
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'row-gap', 'column-gap',
  ]

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const colorCache = new Map<string, Rgba>()
  const toRgba = (value: string): Rgba => {
    const cached = colorCache.get(value)
    if (cached) return cached
    let result: Rgba = [0, 0, 0, 0]
    const legacy = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(value)
    if (legacy) {
      const alpha = legacy[4] === undefined ? 1 : legacy[4].endsWith('%') ? Number.parseFloat(legacy[4]) / 100 : Number(legacy[4])
      result = [Number(legacy[1]), Number(legacy[2]), Number(legacy[3]), alpha]
    } else if (context) {
      // Any other notation (oklab, color-mix, color()): let the browser paint it and read the pixel.
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = '#000'
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
      result = [r ?? 0, g ?? 0, b ?? 0, Math.round(((a ?? 0) / 255) * 100) / 100]
    }
    colorCache.set(value, result)
    return result
  }
  const over = (top: Rgba, bottom: [number, number, number]): [number, number, number] => [
    top[0] * top[3] + bottom[0] * (1 - top[3]),
    top[1] * top[3] + bottom[1] * (1 - top[3]),
    top[2] * top[3] + bottom[2] * (1 - top[3]),
  ]

  /** A painted box: where it is, and the opaque color it shows (null for an image or gradient). */
  interface Layer {
    left: number
    top: number
    right: number
    bottom: number
    color: [number, number, number] | null
  }
  interface Context {
    /** The opaque color behind this element's children, or null behind an image or gradient. */
    behind: [number, number, number] | null
    /** The painted boxes of the ancestors, outermost first. The first one is the page itself. */
    layers: Layer[]
    opacity: number
    stock: boolean
    insideCard: boolean
    /** An ancestor clips or scrolls its overflow, so content past its edge does not widen the page. */
    contained: boolean
  }

  const viewportWidth = document.documentElement.clientWidth
  const scrollWidth = document.documentElement.scrollWidth
  /** Focused elements with no mark of their own. One is still fine when something inside it changed. */
  const pending: { element: Element; selector: string }[] = []
  let focusable = 0
  const elements: ElementData[] = []
  let truncated = false
  let ignored = 0

  /** A control whose focus shows on a sibling, as a hidden checkbox styled through its label does. */
  const isPeer = (element: Element): boolean => element.classList.contains('peer') || /(^|\s)peer\//.test(element.className.toString())

  const describe = (element: Element, text: string): string => {
    const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('')
    const id = element.id ? `#${element.id}` : ''
    const snippet = text.trim().replace(/\s+/g, ' ').slice(0, 32)
    return `${element.tagName.toLowerCase()}${id}${classes}${snippet ? ` "${snippet}"` : ''}`
  }

  const visit = (element: Element, parent: Context) => {
    if (SKIP.has(element.tagName)) return
    if (element.hasAttribute('data-strict-ignore')) {
      ignored++
      return
    }
    if (elements.length >= MAX_ELEMENTS) {
      truncated = true
      return
    }
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') return
    const rect = element.getBoundingClientRect()
    const isSvg = element instanceof SVGElement

    const background = toRgba(style.backgroundColor)
    const hasImage = style.backgroundImage !== 'none'
    // Normally an element sits on its parent. One positioned out of the flow may sit outside it, such
    // as a label above a bar: that one is on the innermost ancestor box that actually contains it.
    let behind = parent.behind
    if (style.position === 'absolute' || style.position === 'fixed') {
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      behind = parent.layers[0]?.color ?? null
      for (let i = parent.layers.length - 1; i > 0; i--) {
        const layer = parent.layers[i]
        if (layer && centerX >= layer.left && centerX <= layer.right && centerY >= layer.top && centerY <= layer.bottom) {
          behind = layer.color
          break
        }
      }
    }
    const backdrop: [number, number, number] | null = hasImage
      ? null
      : background[3] >= 1
        ? [background[0], background[1], background[2]]
        : background[3] > 0 && behind
          ? over(background, behind)
          : behind
    const paints = hasImage || background[3] > 0
    const layers = paints && rect.width > 0 && rect.height > 0
      ? [...parent.layers, { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, color: backdrop }]
      : parent.layers
    const opacity = parent.opacity * Number(style.opacity || 1)
    const stock = parent.stock || element.hasAttribute('data-slot')
    const clips = /auto|scroll|hidden|clip/.test(style.overflowX)
    const contained = parent.contained || clips

    let ownText = ''
    for (const node of element.childNodes) if (node.nodeType === Node.TEXT_NODE) ownText += node.textContent ?? ''
    const isField = element instanceof HTMLInputElement
      ? !['checkbox', 'radio', 'range', 'color', 'file', 'hidden', 'image'].includes(element.type)
      : element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement
    const hasText = ownText.trim() !== '' || isField

    const borders: Rgba[] = []
    let allSides = true
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      const width = Number.parseFloat(style[`border${side}Width`])
      const color = toRgba(style[`border${side}Color`])
      if (width > 0 && style[`border${side}Style`] !== 'none' && color[3] > 0) borders.push(color)
      else allSides = false
    }
    const radius = (value: string): number => (value.includes('%') ? -1 : Number.parseFloat(value) || 0)
    const radii = [
      radius(style.borderTopLeftRadius),
      radius(style.borderTopRightRadius),
      radius(style.borderBottomRightRadius),
      radius(style.borderBottomLeftRadius),
    ]
    const hasShadow = style.boxShadow !== 'none'
    const boxed = background[3] > 0 || borders.length > 0 || hasShadow || hasImage

    const spacing: { property: string; px: number }[] = []
    const map = 'computedStyleMap' in element ? element.computedStyleMap() : null
    if (map && !isSvg) {
      // A gap only shows between two or more children of a flex or grid box.
      const gaps = /flex|grid/.test(style.display) && element.children.length > 1
      for (const property of SPACING) {
        if (property.endsWith('gap') && !gaps) continue
        const value = map.get(property)
        if (value instanceof CSSUnitValue && value.unit === 'px' && value.value !== 0) {
          spacing.push({ property, px: Math.abs(value.value) })
        }
      }
    }

    const hidden =
      (rect.width <= 1 && rect.height <= 1) ||
      style.clipPath === 'inset(50%)' ||
      (style.position === 'absolute' && /rect\(0(px)?,? 0(px)?,? 0(px)?,? 0(px)?\)/.test(style.clip))
    const card =
      !NOT_CARDS.has(element.tagName.toUpperCase()) &&
      rect.width >= 160 &&
      rect.height >= 80 &&
      (allSides || hasShadow) &&
      (hasShadow || radii.some((value) => value !== 0))
    const text = isField ? ((element as HTMLInputElement).value || (element as HTMLInputElement).placeholder || '') : ownText

    if (!isSvg || element.tagName.toLowerCase() === 'svg') {
      if (rect.width > 0 || rect.height > 0) {
        const color = toRgba(style.color)
        const outline: Rgba | null =
          // `auto` is the browser's own focus ring, in the browser's color: not the page's to get wrong.
          style.outlineStyle !== 'none' && style.outlineStyle !== 'auto' && Number.parseFloat(style.outlineWidth) > 0 && toRgba(style.outlineColor)[3] > 0
            ? toRgba(style.outlineColor)
            : null
        const data: ElementData = {
          selector: describe(element, text),
          tag: element.tagName.toLowerCase(),
          stock,
          hasText,
          color: [color[0], color[1], color[2], Math.round(color[3] * opacity * 100) / 100],
          background,
          backdrop: backdrop ? [Math.round(backdrop[0]), Math.round(backdrop[1]), Math.round(backdrop[2])] : null,
          borders,
          radii,
          boxed,
          fontSize: Number.parseFloat(style.fontSize),
          fontWeight: Number(style.fontWeight),
          fontFamily: (style.fontFamily.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, ''),
          lineHeight: style.lineHeight === 'normal' ? -1 : Number.parseFloat(style.lineHeight),
          letterSpacing: style.letterSpacing === 'normal' ? 0 : Number.parseFloat(style.letterSpacing) || 0,
          raised: element.closest('sup, sub') !== null,
          outline,
          spacing,
          boxShadow: style.boxShadow,
          textShadow: style.textShadow,
          backgroundImage: style.backgroundImage,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          hidden,
          disabled: element.matches(':disabled, [aria-disabled="true"]'),
          overflowing: scrollWidth > viewportWidth && !parent.contained && rect.right > viewportWidth + 1 && rect.width > 0,
          emoji: EMOJI.exec(ownText)?.[0] ?? null,
          card,
          nestedCard: card && parent.insideCard,
        }
        // What the eye would notice changing. Sizes are left out: a state that moves the layout by a
        // pixel changes the box of everything after it.
        const look = JSON.stringify([
          data.color, data.background, data.backdrop, data.borders, data.radii, data.fontSize, data.fontWeight,
          data.fontFamily, data.boxShadow, data.textShadow, data.backgroundImage, data.outline, style.textDecorationLine,
        ])
        // What marks an element as focused: a ring, an outline, a border, a fill or an underline.
        const mark = JSON.stringify([
          data.background, data.borders, data.boxShadow,
          // An outline that is not drawn has a width and an offset all the same, and the browser changes them on focus.
          style.outlineStyle === 'none' || Number.parseFloat(style.outlineWidth) === 0
            ? null
            : [style.outlineStyle, style.outlineWidth, style.outlineOffset, style.outlineColor],
          style.textDecorationLine, style.borderTopWidth, style.borderBottomWidth,
        ])
        if (!state) {
          elements.push(data)
          if (remembered) {
            remembered.looks.set(element, look)
            remembered.marks.set(element, mark)
          }
        } else if (remembered) {
          if (remembered.looks.get(element) !== look) {
            elements.push(data)
            changed.add(element)
          }
          if (
            state.name === 'focus' &&
            !hidden &&
            element.matches(state.targets) &&
            !element.matches(':disabled, [aria-disabled="true"], [tabindex="-1"]')
          ) {
            focusable++
            if (remembered.marks.get(element) === mark) pending.push({ element, selector: data.selector })
          }
        }
      }
    }
    if (isSvg) return

    const context: Context = { behind: backdrop, layers, opacity, stock, insideCard: parent.insideCard || card, contained }
    for (const child of element.children) visit(child, context)
    // Content rendered outside the tree's order, such as an open dialog, is still a child here.
    if (element.shadowRoot) for (const child of element.shadowRoot.children) visit(child, context)
  }

  // The canvas behind the page: the root's background, or the body's when the root has none (CSS
  // paints the body's background on the canvas in that case), over the browser's default white.
  const rootBackground = toRgba(getComputedStyle(document.documentElement).backgroundColor)
  const bodyBackground = document.body ? toRgba(getComputedStyle(document.body).backgroundColor) : rootBackground
  const canvasColor = rootBackground[3] > 0 ? rootBackground : bodyBackground
  const base: [number, number, number] = canvasColor[3] > 0 ? over(canvasColor, [255, 255, 255]) : [255, 255, 255]
  const page: Layer = { left: -Infinity, top: -Infinity, right: Infinity, bottom: Infinity, color: base }
  visit(document.documentElement, { behind: base, layers: [page], opacity: 1, stock: false, insideCard: false, contained: false })

  // A control may show its focus on a part of itself, as a field wrapper or a switch's track does.
  for (const { element, selector } of pending) {
    let marked = false
    for (const other of changed) {
      if (other !== element && (element.contains(other) || (element.parentElement?.contains(other) && isPeer(element)))) {
        marked = true
        break
      }
    }
    if (!marked) unmarked.push(selector)
  }

  return {
    viewportWidth,
    scrollWidth,
    elements,
    truncated,
    canvas: [Math.round(base[0]), Math.round(base[1]), Math.round(base[2])],
    ignored,
    ...(state?.name === 'focus' ? { unmarked, focusable } : {}),
  }
}
