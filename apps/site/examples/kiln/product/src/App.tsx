import { useRef, useState, type KeyboardEvent } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const plainLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonText = "h-auto px-4 py-2 font-mono text-label"

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPence = (pence: number) => money.format(pence / 100)

const PRICE_PENCE = 3400
const ORDER_LIMIT = 4

type GlazeId = "iron" | "ash" | "slate"

type Glaze = {
  id: GlazeId
  name: string
  fill: string
  stock: number | null
}

const GLAZES: Glaze[] = [
  { id: "iron", name: "Iron", fill: "bg-glaze-dark", stock: 6 },
  { id: "ash", name: "Ash", fill: "bg-glaze-pale", stock: 2 },
  { id: "slate", name: "Slate", fill: "bg-glaze-dark", stock: null },
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

type Shape = "bowl" | "tall"

const RELATED: {
  name: string
  glaze: string
  fill: string
  shape: Shape
  pence: number
  badge?: string
}[] = [
  {
    name: "Breakfast bowl",
    glaze: "Ash",
    fill: "bg-glaze-pale",
    shape: "bowl",
    pence: 2600,
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    fill: "bg-glaze-pale",
    shape: "bowl",
    pence: 7200,
    badge: "Last one",
  },
  {
    name: "Nest of three bowls",
    glaze: "Slate",
    fill: "bg-glaze-dark",
    shape: "bowl",
    pence: 5800,
  },
  {
    name: "Moor mug",
    glaze: "Ash",
    fill: "bg-glaze-pale",
    shape: "tall",
    pence: 2800,
  },
]

const SHAPE_SIZE: Record<Shape, string> = {
  bowl: "h-1/4 w-3/5",
  tall: "h-1/2 w-2/5",
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  return `Basket, ${count} ${count === 1 ? "piece" : "pieces"}`
}

function limitFor(glaze: Glaze) {
  return glaze.stock ?? ORDER_LIMIT
}

function Piece({ fill, size }: { fill: string; size: string }) {
  return <div className={cn("border border-foreground/40", fill, size)} />
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const [basketCount, setBasketCount] = useState(3)
  const [glazeId, setGlazeId] = useState<GlazeId>("iron")
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [message, setMessage] = useState("")

  const glaze = GLAZES.find((g) => g.id === glazeId) ?? GLAZES[0]
  const limit = limitFor(glaze)
  const glazeWord = glaze.name.toLowerCase()

  function chooseGlaze(next: Glaze) {
    setGlazeId(next.id)
    const nextLimit = limitFor(next)
    setQuantity((q) => Math.min(q, nextLimit))
  }

  function addToBasket() {
    const n = quantity
    setBasketCount((c) => c + n)
    setAdded(true)
    setQuantity(1)
    const sentence = `Added ${n} Fold ${n === 1 ? "bowl" : "bowls"} in ${glazeWord} glaze to your basket.`
    setMessage("")
    requestAnimationFrame(() => setMessage(sentence))
  }

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const stockLine =
    glaze.stock === null
      ? "Made to order, posted in about 3 weeks"
      : `In stock, ${glaze.stock} left`

  return (
    <div className="bg-background text-body text-foreground">
      <header className="border-b" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
          <a href="/" className={cn(plainLink, "font-heading text-h2")}>
            {STUDIO}
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={plainLink}>
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
              className={cn(buttonText, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="small-screen-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
            <a
              href="/basket"
              aria-label={basketLabel(basketCount)}
              className={cn(plainLink, "inline-flex items-center gap-2")}
            >
              <ShoppingBag
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
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
                <a href={link.href} className={cn(plainLink, "block py-2")}>
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
            <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
              <li>
                <a href="/" className={plainLink}>
                  Shop
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/tableware" className={plainLink}>
                  Tableware
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Fold bowl</li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-x-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <figure>
                <div
                  role="img"
                  aria-label={`Fold bowl in ${glazeWord} glaze, seen from the side`}
                  className="flex aspect-square items-center justify-center rounded-xl border bg-muted"
                >
                  <Piece fill={glaze.fill} size="h-1/4 w-3/5" />
                </div>
                <figcaption className="mt-2 font-mono text-label text-muted-foreground">
                  From the side
                </figcaption>
              </figure>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <figure>
                  <div
                    role="img"
                    aria-label={`Fold bowl in ${glazeWord} glaze, seen from above`}
                    className="flex aspect-4/5 items-center justify-center rounded-xl border bg-muted"
                  >
                    <Piece fill={glaze.fill} size="aspect-square w-3/5" />
                  </div>
                  <figcaption className="mt-2 font-mono text-label text-muted-foreground">
                    From above
                  </figcaption>
                </figure>
                <figure>
                  <div
                    role="img"
                    aria-label={`The foot of the Fold bowl in ${glazeWord} glaze`}
                    className="flex aspect-4/5 items-center justify-center rounded-xl border bg-muted"
                  >
                    <Piece fill={glaze.fill} size="h-1/4 w-2/5" />
                  </div>
                  <figcaption className="mt-2 font-mono text-label text-muted-foreground">
                    The unglazed foot
                  </figcaption>
                </figure>
              </div>
            </div>

            <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
              <h1 className="text-h1">Fold bowl</h1>
              <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                Stoneware · 16 cm across
              </p>
              <p className="mt-4 font-mono text-h2 font-medium text-foreground tabular-nums">
                {formatPence(PRICE_PENCE)}
              </p>
              <p className="mt-4 max-w-lg">
                A low, wide bowl for soup, noodles or a heap of fruit, thrown by
                hand in buff stoneware and holding 550 ml. The foot is left
                unglazed and sanded smooth, so it sits quietly on a wooden
                table.
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
                  const chosen = g.id === glaze.id
                  return (
                    <Button
                      key={g.id}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonText}
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
                      glaze.stock === null
                        ? "bg-muted-foreground"
                        : "bg-success"
                    )}
                  />
                  <span className="font-mono text-label text-foreground">
                    {stockLine}
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
                  focusableWhenDisabled
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
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
                  focusableWhenDisabled
                  disabled={quantity >= limit}
                  onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
                >
                  <Plus
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </Button>
              </div>

              <Button
                className={cn(buttonText, "mt-6 w-full")}
                onClick={addToBasket}
              >
                <ShoppingBag
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.5}
                />
                Add to basket
              </Button>

              <div>
                {added && (
                  <p className="mt-2">
                    <a href="/basket" className={plainLink}>
                      View basket
                    </a>
                  </p>
                )}
                <div role="status">
                  {message && (
                    <p className="mt-4 flex items-start gap-2 text-body">
                      <CircleCheck
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 text-success"
                        strokeWidth={1.5}
                      />
                      <span className="text-foreground">{message}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Details and care"
          className="grid gap-x-6 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-7">
            <h2 className="text-h2">Details</h2>
            <dl className="mt-6">
              {[
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
              ].map((row) => (
                <div
                  key={row.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b"
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

        <section aria-labelledby="goes-well-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="goes-well-heading" className="text-h2">
              Goes well with
            </h2>
            <a href="/tableware" className={plainLink}>
              See all tableware
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {RELATED.map((piece) => (
              <li key={piece.name}>
                <a
                  href={`/tableware/${slug(piece.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                >
                  <div
                    aria-hidden="true"
                    className="flex aspect-square items-center justify-center border-b bg-muted"
                  >
                    <Piece fill={piece.fill} size={SHAPE_SIZE[piece.shape]} />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-sans text-body font-medium underline-offset-4 group-hover:underline">
                      {piece.name}
                    </h3>
                    <p className="mt-1 flex-1 font-mono text-label text-muted-foreground">
                      {piece.glaze} glaze
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-body text-foreground tabular-nums">
                        {formatPence(piece.pence)}
                      </span>
                      {piece.badge && (
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          {piece.badge}
                        </Badge>
                      )}
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
                    <a href={link.href} className={plainLink}>
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
    </div>
  )
}

export default App
