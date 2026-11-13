import { useEffect, useRef, useState } from "react"
import { ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const CONTAINER = "mx-auto max-w-[1120px] px-4 md:px-6"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const QUIET_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const BUTTON = "h-auto px-4 py-2 font-mono text-label"

type Category = "Mugs and cups" | "Bowls" | "Plates" | "Jugs"
type Filter = "All" | Category
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"
type Shape = "tall" | "bowl" | "plate"
type Sort = "featured" | "price-asc" | "price-desc" | "name"

type Piece = {
  name: string
  category: Category
  glaze: Glaze
  pence: number
  shape: Shape
  badge?: string
}

// The studio's own order: "Featured" shows the pieces as listed here.
const PIECES: Piece[] = [
  {
    name: "Moor mug",
    category: "Mugs and cups",
    glaze: "Ash",
    pence: 2800,
    shape: "tall",
  },
  {
    name: "Fold bowl",
    category: "Bowls",
    glaze: "Iron",
    pence: 3400,
    shape: "bowl",
    badge: "New",
  },
  {
    name: "Side plate",
    category: "Plates",
    glaze: "Oat",
    pence: 2200,
    shape: "plate",
  },
  {
    name: "Espresso cup",
    category: "Mugs and cups",
    glaze: "Iron",
    pence: 1800,
    shape: "tall",
  },
  {
    name: "Serving bowl",
    category: "Bowls",
    glaze: "Ash",
    pence: 7200,
    shape: "bowl",
    badge: "Last one",
  },
  {
    name: "Platter",
    category: "Plates",
    glaze: "Iron",
    pence: 8500,
    shape: "plate",
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    category: "Mugs and cups",
    glaze: "Slate",
    pence: 3600,
    shape: "tall",
  },
  {
    name: "Breakfast bowl",
    category: "Bowls",
    glaze: "Ash",
    pence: 2600,
    shape: "bowl",
  },
  {
    name: "Dinner plate",
    category: "Plates",
    glaze: "Oat",
    pence: 3200,
    shape: "plate",
  },
  {
    name: "Beaker",
    category: "Mugs and cups",
    glaze: "Oat",
    pence: 2400,
    shape: "tall",
    badge: "Sold out",
  },
  {
    name: "Nest of three bowls",
    category: "Bowls",
    glaze: "Slate",
    pence: 5800,
    shape: "bowl",
  },
  {
    name: "Pasta plate",
    category: "Plates",
    glaze: "Slate",
    pence: 3000,
    shape: "plate",
  },
]

const FILTERS: Filter[] = ["All", "Mugs and cups", "Bowls", "Plates", "Jugs"]

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
]

const NAV_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware", current: true },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]

const FOOTER_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

const SHAPE_SIZE: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

const BASKET_COUNT = 3

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function formatPrice(pence: number) {
  return gbp.format(pence / 100)
}

function pieceHref(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `/tableware/${slug}`
}

function isDark(glaze: Glaze) {
  return glaze === "Iron" || glaze === "Slate"
}

// Array.prototype.sort is stable, so ties keep the studio's order.
function sortPieces(pieces: Piece[], sort: Sort) {
  const sorted = [...pieces]
  if (sort === "price-asc") {
    sorted.sort((a, b) => a.pence - b.pence)
  } else if (sort === "price-desc") {
    sorted.sort((a, b) => b.pence - a.pence)
  } else if (sort === "name") {
    sorted.sort((a, b) =>
      a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" })
    )
  }
  return sorted
}

function countLabel(count: number) {
  if (count === 0) return "No pieces"
  if (count === 1) return "1 piece"
  return `${count} pieces`
}

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  if (count === 1) return "Basket, 1 piece"
  return `Basket, ${count} pieces`
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <header className="border-b">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn(QUIET_LINK, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(QUIET_LINK, link.current && "underline")}
                >
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
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel(BASKET_COUNT)}
            className={cn(QUIET_LINK, "inline-flex items-center gap-2")}
          >
            <ShoppingBag
              className="size-4"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">({BASKET_COUNT})</span>
          </a>
        </div>
      </div>
      <nav
        id="main-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!menuOpen}
      >
        <ul className={cn(CONTAINER, "py-2")}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  QUIET_LINK,
                  "block py-2",
                  link.current && "underline"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Tile({ piece }: { piece: Piece }) {
  return (
    <li>
      <a
        href={pieceHref(piece.name)}
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-card focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              "border border-foreground/40",
              SHAPE_SIZE[piece.shape],
              isDark(piece.glaze) ? "bg-glaze-dark" : "bg-glaze-pale"
            )}
          />
        </div>
        <div className="p-4">
          <h3 className="font-sans text-body font-medium">{piece.name}</h3>
          <p className="mt-1 font-mono text-label text-muted-foreground">
            {piece.glaze}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-body tabular-nums">
              {formatPrice(piece.pence)}
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
  )
}

function SiteFooter() {
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
                  <a href={link.href} className={QUIET_LINK}>
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

export function App() {
  const [filter, setFilter] = useState<Filter>("All")
  const [sort, setSort] = useState<Sort>("featured")
  const allButtonRef = useRef<HTMLButtonElement>(null)

  const shown = sortPieces(
    filter === "All"
      ? PIECES
      : PIECES.filter((piece) => piece.category === filter),
    sort
  )

  const emptyName = filter.toLowerCase()

  function showAll() {
    setFilter("All")
    allButtonRef.current?.focus()
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />

      <main className={cn(CONTAINER, "flex flex-col gap-20 pt-10 pb-20")}>
        <section>
          <div className="grid gap-x-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
                  <li>
                    <a href="/" className={QUIET_LINK}>
                      Shop
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">Tableware</li>
                </ol>
              </nav>
              <h1 className="mt-2 text-h1">Tableware</h1>
              <p className="mt-4 max-w-lg">
                Mugs, bowls and plates for the everyday table. Everything here
                is food-safe and goes in the dishwasher, and no two pieces come
                out of the kiln quite the same.
              </p>
            </div>
          </div>

          <h2 className="sr-only">Pieces</h2>

          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                id="category-label"
                className="font-mono text-label text-foreground"
              >
                Category
              </p>
              <div
                role="group"
                aria-labelledby="category-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {FILTERS.map((name) => {
                  const chosen = name === filter
                  return (
                    <Button
                      key={name}
                      ref={name === "All" ? allButtonRef : undefined}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON}
                      onClick={() => setFilter(name)}
                    >
                      {name}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="w-full md:w-56">
              <label
                htmlFor="sort-order"
                className="block font-mono text-label text-foreground"
              >
                Sort by
              </label>
              <Select
                items={SORTS}
                value={sort}
                onValueChange={(value) => {
                  if (value !== null) setSort(value)
                }}
              >
                <SelectTrigger id="sort-order" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p
            aria-live="polite"
            className="mt-6 font-mono text-label text-muted-foreground tabular-nums"
          >
            {countLabel(shown.length)}
          </p>

          {shown.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {shown.map((piece) => (
                <Tile key={piece.name} piece={piece} />
              ))}
            </ul>
          ) : (
            <div className="mt-4 max-w-lg rounded-xl border bg-card p-6">
              <h3 className="text-h2">No {emptyName} just now</h3>
              <p className="mt-4">
                {filter === "Jugs"
                  ? "The next jugs come out of the kiln in early December."
                  : `The next ${emptyName} come out of the next firing.`}
              </p>
              <Button
                variant="secondary"
                className={cn(BUTTON, "mt-6")}
                onClick={showAll}
              >
                Show all pieces
              </Button>
            </div>
          )}
        </section>

        <section className="grid gap-x-6 md:grid-cols-12">
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            <h2 className="text-h2">Delivery and returns</h2>
            <p className="mt-4 max-w-lg">
              Every piece is packed in recycled paper and posted within three
              working days.
            </p>
            <p className="mt-4 max-w-lg">
              If a piece is not right, send it back unused within 30 days and
              we refund it in full.{" "}
              <a
                href="/delivery"
                className={cn(
                  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                  FOCUS
                )}
              >
                Read the delivery terms
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
