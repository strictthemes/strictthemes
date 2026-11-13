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

const STUDIO = "Whitlow Pottery"
const BASKET_COUNT: number = 3

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const NAV_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON_CLASSES = "h-auto px-4 py-2 font-mono text-label"

const MAIN_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]
const CURRENT_HREF = "/tableware"

const FOOTER_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

type CategoryId = "all" | "mugs" | "bowls" | "plates" | "jugs"
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"
type Shape = "tall" | "bowl" | "flat"

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mugs", label: "Mugs and cups" },
  { id: "bowls", label: "Bowls" },
  { id: "plates", label: "Plates" },
  { id: "jugs", label: "Jugs" },
]

type Piece = {
  name: string
  category: Exclude<CategoryId, "all">
  glaze: Glaze
  shape: Shape
  pence: number
  badge?: string
}

// The studio's own order, which is also the "Featured" order.
const PIECES: Piece[] = [
  {
    name: "Moor mug",
    category: "mugs",
    glaze: "Ash",
    shape: "tall",
    pence: 2800,
  },
  {
    name: "Fold bowl",
    category: "bowls",
    glaze: "Iron",
    shape: "bowl",
    pence: 3400,
    badge: "New",
  },
  {
    name: "Side plate",
    category: "plates",
    glaze: "Oat",
    shape: "flat",
    pence: 2200,
  },
  {
    name: "Espresso cup",
    category: "mugs",
    glaze: "Iron",
    shape: "tall",
    pence: 1800,
  },
  {
    name: "Serving bowl",
    category: "bowls",
    glaze: "Ash",
    shape: "bowl",
    pence: 7200,
    badge: "Last one",
  },
  {
    name: "Platter",
    category: "plates",
    glaze: "Iron",
    shape: "flat",
    pence: 8500,
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    category: "mugs",
    glaze: "Slate",
    shape: "tall",
    pence: 3600,
  },
  {
    name: "Breakfast bowl",
    category: "bowls",
    glaze: "Ash",
    shape: "bowl",
    pence: 2600,
  },
  {
    name: "Dinner plate",
    category: "plates",
    glaze: "Oat",
    shape: "flat",
    pence: 3200,
  },
  {
    name: "Beaker",
    category: "mugs",
    glaze: "Oat",
    shape: "tall",
    pence: 2400,
    badge: "Sold out",
  },
  {
    name: "Nest of three bowls",
    category: "bowls",
    glaze: "Slate",
    shape: "bowl",
    pence: 5800,
  },
  {
    name: "Pasta plate",
    category: "plates",
    glaze: "Slate",
    shape: "flat",
    pence: 3000,
  },
]

type SortId = "featured" | "price-asc" | "price-desc" | "name"

const SORTS: { value: SortId; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
]

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function formatPence(pence: number) {
  return money.format(pence / 100)
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function pieceWord(n: number) {
  if (n === 0) return "No pieces"
  return n === 1 ? "1 piece" : `${n} pieces`
}

const SHAPE_SIZE: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  flat: "h-1/6 w-3/4",
}

const PALE_GLAZES: Glaze[] = ["Ash", "Oat"]

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const basketLabel =
    BASKET_COUNT === 0
      ? "Basket, empty"
      : `Basket, ${BASKET_COUNT} ${BASKET_COUNT === 1 ? "piece" : "pieces"}`

  return (
    <header className="border-b" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
        <a href="/" className={cn("font-heading text-h2", NAV_LINK)}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {MAIN_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT_HREF ? "page" : undefined}
                  className={cn(
                    NAV_LINK,
                    link.href === CURRENT_HREF && "underline"
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
            className={cn(BUTTON_CLASSES, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel}
            className={cn("inline-flex items-center gap-2", NAV_LINK)}
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
        id="mobile-nav"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!menuOpen}
      >
        <ul className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
          {MAIN_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.href === CURRENT_HREF ? "page" : undefined}
                className={cn(
                  "block py-2",
                  NAV_LINK,
                  link.href === CURRENT_HREF && "underline"
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

function PieceTile({ piece }: { piece: Piece }) {
  const pale = PALE_GLAZES.includes(piece.glaze)
  return (
    <li>
      <a
        href={`/tableware/${slugify(piece.name)}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              "border border-foreground/40",
              pale ? "bg-glaze-pale" : "bg-glaze-dark",
              SHAPE_SIZE[piece.shape]
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
            <span className="font-mono text-body text-foreground tabular-nums">
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
  )
}

export function App() {
  const [category, setCategory] = useState<CategoryId>("all")
  const [sort, setSort] = useState<SortId>("featured")
  const allButtonRef = useRef<HTMLButtonElement>(null)

  const shown = useMemo(() => {
    const filtered =
      category === "all"
        ? PIECES
        : PIECES.filter((piece) => piece.category === category)
    const list = [...filtered]
    // Array.prototype.sort is stable, so ties keep the studio's order.
    if (sort === "price-asc") list.sort((a, b) => a.pence - b.pence)
    if (sort === "price-desc") list.sort((a, b) => b.pence - a.pence)
    if (sort === "name")
      list.sort((a, b) =>
        a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" })
      )
    return list
  }, [category, sort])

  const categoryLabel =
    CATEGORIES.find((c) => c.id === category)?.label ?? "pieces"
  const categoryWord = categoryLabel.toLowerCase()

  function showAll() {
    setCategory("all")
    allButtonRef.current?.focus()
  }

  return (
    <div className="bg-background text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section>
          <div className="grid gap-x-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
                  <li>
                    <a href="/" className={NAV_LINK}>
                      Shop
                    </a>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">Tableware</li>
                </ol>
              </nav>
              <h1 className="mt-2 text-h1">Tableware</h1>
              <p className="mt-4 max-w-lg">
                Everything here is food-safe and goes in the dishwasher. Each
                piece is thrown and glazed by hand, so no two come out of the
                kiln quite the same.
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
                {CATEGORIES.map((c) => {
                  const chosen = c.id === category
                  return (
                    <Button
                      key={c.id}
                      ref={c.id === "all" ? allButtonRef : undefined}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON_CLASSES}
                      onClick={() => setCategory(c.id)}
                    >
                      {c.label}
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
                items={SORTS}
                value={sort}
                onValueChange={(value) => {
                  if (value === null) return
                  setSort(value as SortId)
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
            {pieceWord(shown.length)}
          </p>

          {shown.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
              {shown.map((piece) => (
                <PieceTile key={piece.name} piece={piece} />
              ))}
            </ul>
          ) : (
            <div className="mt-4 max-w-lg rounded-xl border bg-card p-6">
              <h3 className="text-h2">No {categoryWord} just now</h3>
              <p className="mt-4">
                {category === "jugs"
                  ? "The next jugs come out of the kiln in early December."
                  : `The next ${categoryWord} come out of the next firing.`}
              </p>
              <Button
                variant="secondary"
                className={cn(BUTTON_CLASSES, "mt-6")}
                onClick={showAll}
              >
                Show all pieces
              </Button>
            </div>
          )}
        </section>

        <section
          aria-labelledby="delivery-heading"
          className="grid gap-x-6 md:grid-cols-12"
        >
          <div className="rounded-xl border bg-card p-6 md:col-span-7">
            <h2 id="delivery-heading" className="text-h2">
              Delivery and returns
            </h2>
            <p className="mt-4 max-w-lg">
              Every piece is packed in recycled paper and posted within three
              working days of your order.
            </p>
            <p className="mt-4 max-w-lg">
              If a piece is not right for you, send it back unused within 30
              days for a full refund.{" "}
              <a href="/delivery" className={TEXT_LINK}>
                Read the delivery terms
              </a>
            </p>
          </div>
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
                    <a href={link.href} className={NAV_LINK}>
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
