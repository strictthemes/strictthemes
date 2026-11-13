import * as React from "react"
import { CircleCheck, Minus, Plus, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const STUDIO = "Whitlow Pottery"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const QUIET_LINK = `text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const LABEL = "font-mono text-label"
const BUTTON = "h-auto px-4 py-2 font-mono text-label"

const PIECE_OUTLINE = "border border-foreground/40"

const pounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function formatPence(pence: number) {
  return pounds.format(pence / 100)
}

const PRICE_PENCE = 3400

type GlazeId = "iron" | "ash" | "slate"

type Glaze = {
  id: GlazeId
  name: string
  fill: string
  /** Pieces on the shelf, or null for a glaze that is made to order. */
  stock: number | null
  /** The most one order can hold. */
  limit: number
}

const GLAZES: Glaze[] = [
  { id: "iron", name: "Iron", fill: "bg-glaze-dark", stock: 6, limit: 6 },
  { id: "ash", name: "Ash", fill: "bg-glaze-pale", stock: 2, limit: 2 },
  { id: "slate", name: "Slate", fill: "bg-glaze-dark", stock: null, limit: 4 },
]

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]

const FOOTER_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

const CARE = [
  "Safe in the dishwasher and the microwave.",
  "Not for the oven or the hob.",
  "Let it cool before it meets cold water.",
  "A fine crackle in Ash glaze is part of the glaze, not a crack.",
]

type Related = {
  name: string
  glaze: string
  pence: number
  shape: string
  fill: string
  badge?: string
}

const BOWL = "h-1/4 w-3/5"
const TALL = "h-1/2 w-2/5"

const RELATED: Related[] = [
  {
    name: "Breakfast bowl",
    glaze: "Ash",
    pence: 2600,
    shape: BOWL,
    fill: "bg-glaze-pale",
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    pence: 7200,
    shape: BOWL,
    fill: "bg-glaze-pale",
    badge: "Last one",
  },
  {
    name: "Nest of three bowls",
    glaze: "Slate",
    pence: 5800,
    shape: BOWL,
    fill: "bg-glaze-dark",
  },
  {
    name: "Moor mug",
    glaze: "Ash",
    pence: 2800,
    shape: TALL,
    fill: "bg-glaze-pale",
  },
]

function pieceHref(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `/tableware/${slug}`
}

function basketLabel(count: number) {
  if (count === 0) {
    return "Basket, empty"
  }
  return `Basket, ${count} ${count === 1 ? "piece" : "pieces"}`
}

function stockWords(glaze: Glaze) {
  if (glaze.stock === null) {
    return "Made to order, posted in about 3 weeks"
  }
  return `In stock, ${glaze.stock} left`
}

function Picture({
  label,
  caption,
  aspect,
  shape,
  fill,
}: {
  label: string
  caption: string
  aspect: string
  shape: string
  fill: string
}) {
  return (
    <figure>
      <div
        role="img"
        aria-label={label}
        className={`flex ${aspect} items-center justify-center rounded-xl border bg-muted`}
      >
        <div className={`${shape} ${PIECE_OUTLINE} ${fill}`} />
      </div>
      <figcaption className={`mt-2 ${LABEL} text-muted-foreground`}>
        {caption}
      </figcaption>
    </figure>
  )
}

export function App() {
  const [glazeId, setGlazeId] = React.useState<GlazeId>("iron")
  const [quantity, setQuantity] = React.useState(1)
  const [basketCount, setBasketCount] = React.useState(3)
  const [hasAdded, setHasAdded] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const frameRef = React.useRef<number | null>(null)

  const glaze = GLAZES.find((item) => item.id === glazeId) ?? GLAZES[0]
  const glazeWord = glaze.name.toLowerCase()

  React.useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  React.useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  function chooseGlaze(next: Glaze) {
    setGlazeId(next.id)
    setQuantity((current) => Math.min(current, next.limit))
  }

  function addToBasket() {
    const sentence = `Added ${quantity} ${
      quantity === 1 ? "Fold bowl" : "Fold bowls"
    } in ${glazeWord} glaze to your basket.`

    setBasketCount((current) => current + quantity)
    setHasAdded(true)
    setQuantity(1)

    // Clear first and write on the next frame, so that the same sentence
    // is read out again when the same thing is added twice.
    setMessage(null)
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      setMessage(sentence)
    })
  }

  return (
    <div className="bg-background text-body text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
          <a href="/" className={`font-heading text-h2 ${QUIET_LINK}`}>
            {STUDIO}
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={QUIET_LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Button
              ref={menuButtonRef}
              variant="outline"
              className={`${BUTTON} md:hidden`}
              aria-expanded={menuOpen}
              aria-controls="small-screen-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
            <a
              href="/basket"
              aria-label={basketLabel(basketCount)}
              className={`inline-flex items-center gap-2 ${QUIET_LINK}`}
            >
              <ShoppingBag
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="hidden md:inline">Basket</span>
              <span className="font-mono tabular-nums">({basketCount})</span>
            </a>
          </div>
        </div>
        <nav
          id="small-screen-menu"
          aria-label="Main"
          className="border-t md:hidden"
          hidden={!menuOpen}
        >
          <ul className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={`block py-2 ${QUIET_LINK}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section aria-label="Fold bowl">
          <nav aria-label="Breadcrumb">
            <ol
              className={`flex flex-wrap gap-2 ${LABEL} text-muted-foreground`}
            >
              <li>
                <a href="/" className={QUIET_LINK}>
                  Shop
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/tableware" className={QUIET_LINK}>
                  Tableware
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page">Fold bowl</span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-x-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <Picture
                label={`Fold bowl in ${glazeWord} glaze, seen from the side`}
                caption="From the side"
                aspect="aspect-square"
                shape="h-1/4 w-3/5"
                fill={glaze.fill}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Picture
                  label={`Fold bowl in ${glazeWord} glaze, seen from above`}
                  caption="From above"
                  aspect="aspect-4/5"
                  shape="aspect-square w-3/5"
                  fill={glaze.fill}
                />
                <Picture
                  label={`The unglazed foot of the Fold bowl in ${glazeWord} glaze`}
                  caption="The unglazed foot"
                  aspect="aspect-4/5"
                  shape="h-1/4 w-2/5"
                  fill={glaze.fill}
                />
              </div>
            </div>

            <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
              <h1 className="text-h1">Fold bowl</h1>
              <p className={`mt-2 ${LABEL} text-muted-foreground`}>
                Stoneware · 16 cm across
              </p>
              <p className="mt-4 font-mono text-h2 font-medium tabular-nums">
                {formatPence(PRICE_PENCE)}
              </p>
              <p className="mt-4 max-w-lg">
                A low, wide bowl for soup, noodles or a heap of fruit, thrown
                in buff stoneware by Nell Varga and Tomas Reid. The rim folds
                in a little, so it sits well in two hands and keeps a broth
                where it belongs.
              </p>

              <p id="glaze-label" className={`mt-6 ${LABEL}`}>
                Glaze
              </p>
              <div
                role="group"
                aria-labelledby="glaze-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {GLAZES.map((item) => {
                  const chosen = item.id === glaze.id
                  return (
                    <Button
                      key={item.id}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON}
                      onClick={() => chooseGlaze(item)}
                    >
                      {item.name}
                    </Button>
                  )
                })}
              </div>

              <p className="mt-4">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2 shrink-0 rounded-sm ${
                      glaze.stock === null ? "bg-muted-foreground" : "bg-success"
                    }`}
                  />
                  <span className={`${LABEL} text-foreground tabular-nums`}>
                    {stockWords(glaze)}
                  </span>
                </span>
              </p>

              <p id="quantity-label" className={`mt-6 ${LABEL}`}>
                Quantity
              </p>
              <div
                role="group"
                aria-labelledby="quantity-label"
                className="mt-2 inline-flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="One fewer"
                  disabled={quantity <= 1}
                  focusableWhenDisabled
                  onClick={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                >
                  <Minus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Button>
                <output
                  aria-live="polite"
                  className="inline-flex w-10 justify-center font-mono tabular-nums"
                >
                  <span className="sr-only">Quantity </span>
                  {quantity}
                </output>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="One more"
                  disabled={quantity >= glaze.limit}
                  focusableWhenDisabled
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(glaze.limit, current + 1)
                    )
                  }
                >
                  <Plus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <Button
                className={`mt-6 w-full ${BUTTON}`}
                onClick={addToBasket}
              >
                <ShoppingBag
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Add to basket
              </Button>

              <div>
                {hasAdded ? (
                  <p className="mt-2">
                    <a href="/basket" className={QUIET_LINK}>
                      View basket
                    </a>
                  </p>
                ) : null}
                <div role="status">
                  {message ? (
                    <p className="mt-4 flex items-start gap-2 text-body">
                      <CircleCheck
                        className="mt-1 size-4 shrink-0 text-success"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="text-foreground">{message}</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Details and care"
          className="grid gap-x-6 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <h2 className="text-h2">Details</h2>
            <dl className="mt-6">
              <DetailRow term="Size" mono>
                16 cm across, 6 cm high
              </DetailRow>
              <DetailRow term="Holds" mono>
                550 ml
              </DetailRow>
              <DetailRow term="Weight" mono>
                420 g
              </DetailRow>
              <DetailRow term="Clay">Buff stoneware</DetailRow>
              <DetailRow term="Glaze">{glaze.name}</DetailRow>
              <DetailRow term="Fired">
                <time dateTime="2026-11-06">6 November 2026</time>
              </DetailRow>
              <DetailRow term="Foot" last>
                Unglazed and sanded smooth
              </DetailRow>
            </dl>
          </div>
          <div className="mt-10 rounded-xl border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2">Care</h2>
            <ul className="mt-4 list-disc pl-6">
              {CARE.map((line, index) => (
                <li key={line} className={index === 0 ? undefined : "mt-2"}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="goes-well-with">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="goes-well-with" className="text-h2">
              Goes well with
            </h2>
            <a href="/tableware" className={QUIET_LINK}>
              See all tableware
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {RELATED.map((piece) => (
              <li key={piece.name}>
                <a
                  href={pieceHref(piece.name)}
                  className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <div
                    aria-hidden="true"
                    className="flex aspect-square items-center justify-center border-b bg-muted"
                  >
                    <div
                      className={`${piece.shape} ${PIECE_OUTLINE} ${piece.fill}`}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-sans text-body font-medium">
                      {piece.name}
                    </h3>
                    <p className={`mt-1 ${LABEL} text-muted-foreground`}>
                      {piece.glaze}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono tabular-nums">
                        {formatPence(piece.pence)}
                      </span>
                      {piece.badge ? (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          {piece.badge}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-[1120px] px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div>
              <p className="font-heading text-h2">{STUDIO}</p>
              <address className="mt-2 not-italic">
                Unit 3, Coldharbour Yard
                <br />
                Bramwick BW4 2LT
              </address>
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={QUIET_LINK}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className={`mt-6 ${LABEL} text-muted-foreground`}>
            © 2026 {STUDIO}
          </p>
        </div>
      </footer>
    </div>
  )
}

function DetailRow({
  term,
  mono = false,
  last = false,
  children,
}: {
  term: string
  mono?: boolean
  last?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid grid-cols-3 items-baseline gap-x-4 border-t py-2 ${
        last ? "border-b" : ""
      }`}
    >
      <dt className={`${LABEL} text-muted-foreground`}>{term}</dt>
      <dd
        className={`col-span-2 text-body ${mono ? "font-mono tabular-nums" : ""}`}
      >
        {children}
      </dd>
    </div>
  )
}

export default App
