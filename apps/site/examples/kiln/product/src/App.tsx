import { useEffect, useRef, useState, type ReactNode } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"
const CONTAINER = "mx-auto max-w-[1120px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const PLAIN_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const BUTTON = "h-auto px-4 py-2 font-mono text-label"
const ICON = {
  className: "size-4",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPence = (pence: number) => money.format(pence / 100)

const PRICE_PENCE = 3400
const ORDER_LIMIT = 4

type GlazeName = "Iron" | "Ash" | "Slate"

type Glaze = {
  name: GlazeName
  tone: "pale" | "dark"
  stock: number | null
}

const GLAZES: Glaze[] = [
  { name: "Iron", tone: "dark", stock: 6 },
  { name: "Ash", tone: "pale", stock: 2 },
  { name: "Slate", tone: "dark", stock: null },
]

const limitFor = (glaze: Glaze) => glaze.stock ?? ORDER_LIMIT

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

type Shape = "tall" | "bowl" | "plate"

const SHAPE_SIZE: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

type Tile = {
  name: string
  glaze: "Ash" | "Oat" | "Iron" | "Slate"
  pence: number
  shape: Shape
  badge?: string
}

const RELATED: Tile[] = [
  { name: "Breakfast bowl", glaze: "Ash", pence: 2600, shape: "bowl" },
  {
    name: "Serving bowl",
    glaze: "Ash",
    pence: 7200,
    shape: "bowl",
    badge: "Last one",
  },
  { name: "Nest of three bowls", glaze: "Slate", pence: 5800, shape: "bowl" },
  { name: "Moor mug", glaze: "Ash", pence: 2800, shape: "tall" },
]

const glazeFill = (glaze: string) =>
  glaze === "Iron" || glaze === "Slate" ? "bg-glaze-dark" : "bg-glaze-pale"

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const basketLabel = (count: number) =>
  count === 0
    ? "Basket, empty"
    : `Basket, ${count} ${count === 1 ? "piece" : "pieces"}`

function Header({ count }: { count: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <header className="border-b">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn(PLAIN_LINK, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={PLAIN_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel(count)}
            className={cn(PLAIN_LINK, "inline-flex items-center gap-2")}
          >
            <ShoppingBag {...ICON} />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">({count})</span>
          </a>
        </div>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!menuOpen}
      >
        <ul className={cn(CONTAINER, "py-2")}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={cn(PLAIN_LINK, "block py-2")}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className={cn(CONTAINER, "py-10")}>
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
                  <a href={link.href} className={PLAIN_LINK}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-6 font-mono text-label text-muted-foreground">
          © 2026 {STUDIO}
        </p>
      </div>
    </footer>
  )
}

function Picture({
  label,
  caption,
  aspect,
  fill,
  size,
  className,
}: {
  label: string
  caption: string
  aspect: string
  fill: string
  size: string
  className?: string
}) {
  return (
    <figure className={className}>
      <div
        role="img"
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-xl border bg-muted",
          aspect
        )}
      >
        <div className={cn("border border-foreground/40", fill, size)} />
      </div>
      <figcaption className="mt-2 font-mono text-label text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

function ProductTile({ tile }: { tile: Tile }) {
  return (
    <li>
      <a
        href={`/tableware/${slugify(tile.name)}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              "border border-foreground/40",
              glazeFill(tile.glaze),
              SHAPE_SIZE[tile.shape]
            )}
          />
        </div>
        <div className="p-4">
          <h3 className="font-sans text-body font-medium">{tile.name}</h3>
          <p className="mt-1 font-mono text-label text-muted-foreground">
            {tile.glaze}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono tabular-nums">
              {formatPence(tile.pence)}
            </span>
            {tile.badge && (
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                {tile.badge}
              </Badge>
            )}
          </div>
        </div>
      </a>
    </li>
  )
}

export function App() {
  const [basketCount, setBasketCount] = useState(3)
  const [glazeName, setGlazeName] = useState<GlazeName>("Iron")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [message, setMessage] = useState("")
  const frame = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    },
    []
  )

  const glaze = GLAZES.find((g) => g.name === glazeName) ?? GLAZES[0]
  const limit = limitFor(glaze)
  const glazeWord = glaze.name.toLowerCase()
  const fill = glazeFill(glaze.name)

  const chooseGlaze = (next: Glaze) => {
    setGlazeName(next.name)
    setQuantity((q) => Math.min(q, limitFor(next)))
  }

  const addToBasket = () => {
    const sentence = `Added ${quantity} Fold ${
      quantity === 1 ? "bowl" : "bowls"
    } in ${glazeWord} glaze to your basket.`
    setBasketCount((count) => count + quantity)
    setAdded(true)
    setQuantity(1)
    setMessage("")
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      setMessage(sentence)
      frame.current = null
    })
  }

  const details: { term: string; value: ReactNode; mono?: boolean }[] = [
    { term: "Size", value: "16 cm across, 6 cm high", mono: true },
    { term: "Holds", value: "550 ml", mono: true },
    { term: "Weight", value: "420 g", mono: true },
    { term: "Clay", value: "Buff stoneware" },
    { term: "Glaze", value: glaze.name },
    {
      term: "Fired",
      value: <time dateTime="2026-11-06">6 November 2026</time>,
    },
    { term: "Foot", value: "Unglazed and sanded smooth" },
  ]

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header count={basketCount} />

      <main className={cn(CONTAINER, "flex flex-col gap-20 pt-10 pb-20")}>
        <section aria-label="Fold bowl">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
              <li>
                <a href="/" className={PLAIN_LINK}>
                  Shop
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/tableware" className={PLAIN_LINK}>
                  Tableware
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Fold bowl</li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-x-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <Picture
                label={`Fold bowl in ${glazeWord} glaze, seen from the side`}
                caption="From the side"
                aspect="aspect-square"
                fill={fill}
                size="h-1/4 w-3/5"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Picture
                  label={`Fold bowl in ${glazeWord} glaze, seen from above`}
                  caption="From above"
                  aspect="aspect-4/5"
                  fill={fill}
                  size="size-3/5"
                />
                <Picture
                  label={`Fold bowl in ${glazeWord} glaze, its unglazed foot seen from below`}
                  caption="The unglazed foot"
                  aspect="aspect-4/5"
                  fill={fill}
                  size="h-1/4 w-2/5"
                />
              </div>
            </div>

            <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
              <h1 className="text-h1">Fold bowl</h1>
              <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                Stoneware · 16 cm across
              </p>
              <p className="mt-4 font-mono text-h2 font-medium tabular-nums">
                {formatPence(PRICE_PENCE)}
              </p>
              <p className="mt-4 max-w-lg">
                A low, wide bowl thrown in buff stoneware, sized for a bowl of
                soup, a tangle of noodles or a pile of fruit on the table. Each
                one is finished by hand with an unglazed foot, sanded smooth so
                it will not scratch your table.
              </p>

              <p
                id="glaze-label"
                className="mt-6 font-mono text-label text-foreground"
              >
                Glaze
              </p>
              <div
                role="group"
                aria-labelledby="glaze-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {GLAZES.map((g) => {
                  const chosen = g.name === glaze.name
                  return (
                    <Button
                      key={g.name}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON}
                      onClick={() => chooseGlaze(g)}
                    >
                      {g.name}
                    </Button>
                  )
                })}
              </div>

              <p className="mt-4">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-sm",
                      glaze.stock !== null
                        ? "bg-success"
                        : "bg-muted-foreground"
                    )}
                  />
                  <span className="font-mono text-label text-foreground">
                    {glaze.stock !== null
                      ? `In stock, ${glaze.stock} left`
                      : "Made to order, posted in about 3 weeks"}
                  </span>
                </span>
              </p>

              <p
                id="quantity-label"
                className="mt-6 font-mono text-label text-foreground"
              >
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
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus {...ICON} />
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
                  disabled={quantity >= limit}
                  focusableWhenDisabled
                  onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
                >
                  <Plus {...ICON} />
                </Button>
              </div>

              <Button
                className={cn(BUTTON, "mt-6 w-full")}
                onClick={addToBasket}
              >
                <ShoppingBag {...ICON} />
                Add to basket
              </Button>

              <div>
                {added && (
                  <p className="mt-2">
                    <a href="/basket" className={PLAIN_LINK}>
                      View basket
                    </a>
                  </p>
                )}
                <div role="status">
                  {message && (
                    <div className="mt-4 flex items-start gap-2 text-body">
                      <CircleCheck
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="mt-1 size-4 shrink-0 text-success"
                      />
                      <p className="text-foreground">{message}</p>
                    </div>
                  )}
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
              {details.map((row, index) => (
                <div
                  key={row.term}
                  className={cn(
                    "grid grid-cols-3 items-baseline gap-x-4 border-t py-2",
                    index === details.length - 1 && "border-b"
                  )}
                >
                  <dt className="font-mono text-label text-muted-foreground">
                    {row.term}
                  </dt>
                  <dd
                    className={cn(
                      "col-span-2 text-body",
                      row.mono && "font-mono tabular-nums"
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 rounded-xl border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2">Care</h2>
            <ul className="mt-4 list-disc pl-6">
              <li>Safe in the dishwasher and the microwave.</li>
              <li className="mt-2">Not for the oven or the hob.</li>
              <li className="mt-2">Let it cool before it meets cold water.</li>
              <li className="mt-2">
                A fine crackle in Ash glaze is part of the glaze, not a crack.
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="related-heading" className="text-h2">
              Goes well with
            </h2>
            <a href="/tableware" className={PLAIN_LINK}>
              See all tableware
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {RELATED.map((tile) => (
              <ProductTile key={tile.name} tile={tile} />
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
