import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const studioName = "Whitlow Pottery"

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

const pricePence = 3400
const orderLimit = 4

type GlazeId = "iron" | "ash" | "slate"

type Glaze = {
  id: GlazeId
  name: string
  tone: "pale" | "dark"
  stock: number | null
}

const glazes: Glaze[] = [
  { id: "iron", name: "Iron", tone: "dark", stock: 6 },
  { id: "ash", name: "Ash", tone: "pale", stock: 2 },
  { id: "slate", name: "Slate", tone: "dark", stock: null },
]

const navLinks = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]

const footerLinks = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

type Shape = "tall" | "bowl"

type Related = {
  name: string
  glaze: string
  tone: "pale" | "dark"
  shape: Shape
  pence: number
  badge?: string
}

const related: Related[] = [
  {
    name: "Breakfast bowl",
    glaze: "Ash",
    tone: "pale",
    shape: "bowl",
    pence: 2600,
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    tone: "pale",
    shape: "bowl",
    pence: 7200,
    badge: "Last one",
  },
  {
    name: "Nest of three bowls",
    glaze: "Slate",
    tone: "dark",
    shape: "bowl",
    pence: 5800,
  },
  { name: "Moor mug", glaze: "Ash", tone: "pale", shape: "tall", pence: 2800 },
]

const shapeSize: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  if (count === 1) return "Basket, 1 piece"
  return `Basket, ${count} pieces`
}

function glazeFill(tone: "pale" | "dark") {
  return tone === "pale" ? "bg-glaze-pale" : "bg-glaze-dark"
}

function Header({ basketCount }: { basketCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          {studioName}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
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
            ref={menuButton}
            variant="outline"
            className={cn(buttonText, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="small-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel(basketCount)}
            className={cn("inline-flex items-center gap-2", plainLink)}
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
        id="small-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!menuOpen}
      >
        <ul className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={cn("block py-2", plainLink)}>
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
      <div className="mx-auto max-w-[1120px] px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-heading text-h2">{studioName}</p>
            <address className="mt-2 not-italic">
              Unit 3, Coldharbour Yard
              <br />
              Bramwick BW4 2LT
            </address>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
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
          © 2026 {studioName}
        </p>
      </div>
    </footer>
  )
}

function PieceView({
  label,
  caption,
  aspect,
  size,
  tone,
}: {
  label: string
  caption: string
  aspect: string
  size: string
  tone: "pale" | "dark"
}) {
  return (
    <figure>
      <div
        role="img"
        aria-label={label}
        className={cn(
          "flex items-center justify-center rounded-xl border bg-muted",
          aspect
        )}
      >
        <div
          className={cn("border border-foreground/60", glazeFill(tone), size)}
        />
      </div>
      <figcaption className="mt-2 font-mono text-label text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

export function App() {
  const [glazeId, setGlazeId] = useState<GlazeId>("iron")
  const [quantity, setQuantity] = useState(1)
  const [basketCount, setBasketCount] = useState<number>(3)
  const [added, setAdded] = useState(false)
  const [message, setMessage] = useState("")

  const glaze = glazes.find((g) => g.id === glazeId) ?? glazes[0]
  const limit = glaze.stock ?? orderLimit
  const glazeWord = glaze.name.toLowerCase()

  function chooseGlaze(next: Glaze) {
    setGlazeId(next.id)
    const nextLimit = next.stock ?? orderLimit
    setQuantity((q) => Math.min(q, nextLimit))
  }

  function addToBasket() {
    const count = quantity
    const text = `Added ${count} Fold ${count === 1 ? "bowl" : "bowls"} in ${glazeWord} glaze to your basket.`
    setBasketCount((c) => c + count)
    setAdded(true)
    setQuantity(1)
    setMessage("")
    requestAnimationFrame(() => setMessage(text))
  }

  return (
    <div className="bg-background text-body text-foreground">
      <Header basketCount={basketCount} />

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
              <li>
                <span aria-current="page">Fold bowl</span>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-x-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-7">
              <PieceView
                label={`Fold bowl in ${glazeWord} glaze, seen from the side`}
                caption="From the side"
                aspect="aspect-square"
                size="h-1/4 w-3/5"
                tone={glaze.tone}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <PieceView
                  label={`Fold bowl in ${glazeWord} glaze, seen from above`}
                  caption="From above"
                  aspect="aspect-4/5"
                  size="aspect-square w-3/5"
                  tone={glaze.tone}
                />
                <PieceView
                  label={`The foot of the Fold bowl in ${glazeWord} glaze`}
                  caption="The unglazed foot"
                  aspect="aspect-4/5"
                  size="h-1/4 w-2/5"
                  tone={glaze.tone}
                />
              </div>
            </div>

            <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
              <h1 className="text-h1">Fold bowl</h1>
              <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                Stoneware · 16 cm across
              </p>
              <p className="mt-4 font-mono text-h2 font-medium tabular-nums">
                {formatPence(pricePence)}
              </p>
              <p className="mt-4 max-w-lg">
                A low, wide bowl for soup, noodles or a heap of fruit, thrown by
                hand in buff stoneware. The foot is left unglazed and sanded
                smooth, so it sits quietly on a wooden table.
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
                {glazes.map((g) => {
                  const chosen = g.id === glazeId
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

              <p className="mt-4 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 shrink-0 rounded-sm",
                    glaze.stock === null ? "bg-muted-foreground" : "bg-success"
                  )}
                />
                <span className="font-mono text-label text-foreground tabular-nums">
                  {glaze.stock === null
                    ? "Made to order, posted in about 3 weeks"
                    : `In stock, ${glaze.stock} left`}
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
                  disabled={quantity >= limit}
                  focusableWhenDisabled
                  onClick={() => setQuantity((q) => Math.min(limit, q + 1))}
                >
                  <Plus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <Button
                className={cn(buttonText, "mt-6 w-full")}
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
                        className="mt-1 size-4 shrink-0 text-success"
                        strokeWidth={1.5}
                        aria-hidden="true"
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
          className="grid grid-cols-1 gap-x-6 md:grid-cols-12 md:items-start"
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
              <DetailRow term="Foot">Unglazed and sanded smooth</DetailRow>
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
            <a href="/tableware" className={plainLink}>
              See all tableware
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {related.map((piece) => (
              <li key={piece.name}>
                <a
                  href={`/tableware/${slug(piece.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
                >
                  <div
                    aria-hidden="true"
                    className="flex aspect-square items-center justify-center border-b bg-muted"
                  >
                    <div
                      className={cn(
                        "border border-foreground/60",
                        glazeFill(piece.tone),
                        shapeSize[piece.shape]
                      )}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-sans text-body font-medium underline-offset-4 group-hover:underline">
                      {piece.name}
                    </h3>
                    <p className="mt-1 flex-1 font-mono text-label text-muted-foreground">
                      {piece.glaze} glaze
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-body tabular-nums">
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

      <Footer />
    </div>
  )
}

function DetailRow({
  term,
  mono = false,
  children,
}: {
  term: string
  mono?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-3 items-baseline gap-x-4 border-t py-2 last:border-b">
      <dt className="font-mono text-label text-muted-foreground">{term}</dt>
      <dd
        className={cn("col-span-2 text-body", mono && "font-mono tabular-nums")}
      >
        {children}
      </dd>
    </div>
  )
}

export default App
