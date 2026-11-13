import { useMemo, useRef, useState, type KeyboardEvent } from "react"
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

const studioName = "Whitlow Pottery"
const basketCount: number = 3

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const plainLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const buttonText = "h-auto px-4 py-2 font-mono text-label"

const mainLinks = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]
const currentHref = "/tableware"

const footerLinks = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

type Category = "Mugs and cups" | "Bowls" | "Plates" | "Jugs"
type CategoryChoice = "All" | Category
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"

type Piece = {
  name: string
  category: Category
  glaze: Glaze
  pence: number
  badge?: string
}

const pieces: Piece[] = [
  { name: "Moor mug", category: "Mugs and cups", glaze: "Ash", pence: 2800 },
  {
    name: "Fold bowl",
    category: "Bowls",
    glaze: "Iron",
    pence: 3400,
    badge: "New",
  },
  { name: "Side plate", category: "Plates", glaze: "Oat", pence: 2200 },
  {
    name: "Espresso cup",
    category: "Mugs and cups",
    glaze: "Iron",
    pence: 1800,
  },
  {
    name: "Serving bowl",
    category: "Bowls",
    glaze: "Ash",
    pence: 7200,
    badge: "Last one",
  },
  {
    name: "Platter",
    category: "Plates",
    glaze: "Iron",
    pence: 8500,
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    category: "Mugs and cups",
    glaze: "Slate",
    pence: 3600,
  },
  { name: "Breakfast bowl", category: "Bowls", glaze: "Ash", pence: 2600 },
  { name: "Dinner plate", category: "Plates", glaze: "Oat", pence: 3200 },
  {
    name: "Beaker",
    category: "Mugs and cups",
    glaze: "Oat",
    pence: 2400,
    badge: "Sold out",
  },
  {
    name: "Nest of three bowls",
    category: "Bowls",
    glaze: "Slate",
    pence: 5800,
  },
  { name: "Pasta plate", category: "Plates", glaze: "Slate", pence: 3000 },
]

const categories: CategoryChoice[] = [
  "All",
  "Mugs and cups",
  "Bowls",
  "Plates",
  "Jugs",
]

type SortOrder = "featured" | "price-asc" | "price-desc" | "name"

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
]

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function formatPrice(pence: number) {
  return money.format(pence / 100)
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function pieceCount(n: number) {
  if (n === 0) return "No pieces"
  return `${n} ${n === 1 ? "piece" : "pieces"}`
}

function basketLabel(n: number) {
  if (n === 0) return "Basket, empty"
  return `Basket, ${n} ${n === 1 ? "piece" : "pieces"}`
}

const shapeByCategory: Record<Category, string> = {
  "Mugs and cups": "h-1/2 w-2/5",
  Jugs: "h-1/2 w-2/5",
  Bowls: "h-1/4 w-3/5",
  Plates: "h-1/6 w-3/4",
}

const isPale = (glaze: Glaze) => glaze === "Ash" || glaze === "Oat"

function PieceTile({ piece }: { piece: Piece }) {
  return (
    <li>
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
              shapeByCategory[piece.category],
              isPale(piece.glaze) ? "bg-glaze-pale" : "bg-glaze-dark"
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
              {formatPrice(piece.pence)}
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
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<CategoryChoice>("All")
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured")
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const allButtonRef = useRef<HTMLButtonElement>(null)

  const shown = useMemo(() => {
    const filtered = pieces.filter(
      (piece) => category === "All" || piece.category === category
    )
    if (sortOrder === "featured") return filtered
    return [...filtered].sort((a, b) => {
      if (sortOrder === "price-asc") return a.pence - b.pence
      if (sortOrder === "price-desc") return b.pence - a.pence
      return a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" })
    })
  }, [category, sortOrder])

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function showAll() {
    setCategory("All")
    allButtonRef.current?.focus()
  }

  const emptyName = category.toLowerCase()

  return (
    <div className="bg-background text-body text-foreground">
      <header className="border-b" onKeyDown={handleHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
          <a href="/" className={cn(plainLink, "font-heading text-h2")}>
            {studioName}
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentHref ? "page" : undefined
                    }
                    className={cn(
                      plainLink,
                      link.href === currentHref && "underline"
                    )}
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
            {mainLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={cn(
                    plainLink,
                    "block py-2",
                    link.href === currentHref && "underline"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
                  <li>
                    <a href="/" className={plainLink}>
                      Shop
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <span aria-current="page">Tableware</span>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-h1">Tableware</h1>
              <p className="mt-4 max-w-lg">
                Everything here is food-safe and goes in the dishwasher. No two
                pieces come out of the kiln quite the same.
              </p>
            </div>
          </div>

          <h2 className="sr-only">Pieces</h2>

          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
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
                {categories.map((choice) => {
                  const chosen = choice === category
                  return (
                    <Button
                      key={choice}
                      ref={choice === "All" ? allButtonRef : undefined}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonText}
                      onClick={() => setCategory(choice)}
                    >
                      {choice}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="w-full md:w-56">
              <label
                id="sort-label"
                htmlFor="sort-trigger"
                className="block font-mono text-label text-foreground"
              >
                Sort by
              </label>
              <Select
                items={sortOptions}
                value={sortOrder}
                onValueChange={(value) => {
                  if (value !== null) setSortOrder(value as SortOrder)
                }}
              >
                <SelectTrigger
                  id="sort-trigger"
                  aria-labelledby="sort-label"
                  className="mt-2"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
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
            {pieceCount(shown.length)}
          </p>

          {shown.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {shown.map((piece) => (
                <PieceTile key={piece.name} piece={piece} />
              ))}
            </ul>
          ) : (
            <div className="mt-4 max-w-lg rounded-xl border bg-card p-6">
              <h3 className="text-h2">No {emptyName} just now</h3>
              <p className="mt-4">
                {category === "Jugs"
                  ? "The next jugs come out of the kiln in early December."
                  : `The next ${emptyName} come out of the next firing.`}
              </p>
              <Button
                variant="secondary"
                className={cn(buttonText, "mt-6")}
                onClick={showAll}
              >
                Show all pieces
              </Button>
            </div>
          )}
        </section>

        <section
          aria-labelledby="delivery-heading"
          className="grid grid-cols-1 gap-x-6 md:grid-cols-12"
        >
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            <h2 id="delivery-heading" className="text-h2">
              Delivery and returns
            </h2>
            <p className="mt-4 max-w-lg">
              Every piece is packed in recycled paper and posted within three
              working days.
            </p>
            <p className="mt-4 max-w-lg">
              You can return a piece within 30 days, as long as it is unused.{" "}
              <a href="/delivery" className={textLink}>
                Read the delivery terms
              </a>
              .
            </p>
          </div>
        </section>
      </main>

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
    </div>
  )
}

export default App
