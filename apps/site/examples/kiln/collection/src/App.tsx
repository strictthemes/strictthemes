import { useEffect, useMemo, useRef, useState } from "react"
import { ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1120px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
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
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"
type Shape = "tall" | "low" | "flat"

type Piece = {
  name: string
  category: Category
  glaze: Glaze
  pence: number
  shape: Shape
  badge?: string
}

const pieces: Piece[] = [
  { name: "Moor mug", category: "Mugs and cups", glaze: "Ash", pence: 2800, shape: "tall" },
  { name: "Fold bowl", category: "Bowls", glaze: "Iron", pence: 3400, shape: "low", badge: "New" },
  { name: "Side plate", category: "Plates", glaze: "Oat", pence: 2200, shape: "flat" },
  { name: "Espresso cup", category: "Mugs and cups", glaze: "Iron", pence: 1800, shape: "tall" },
  { name: "Serving bowl", category: "Bowls", glaze: "Ash", pence: 7200, shape: "low", badge: "Last one" },
  { name: "Platter", category: "Plates", glaze: "Iron", pence: 8500, shape: "flat", badge: "New" },
  { name: "Tumbler, set of two", category: "Mugs and cups", glaze: "Slate", pence: 3600, shape: "tall" },
  { name: "Breakfast bowl", category: "Bowls", glaze: "Ash", pence: 2600, shape: "low" },
  { name: "Dinner plate", category: "Plates", glaze: "Oat", pence: 3200, shape: "flat" },
  { name: "Beaker", category: "Mugs and cups", glaze: "Oat", pence: 2400, shape: "tall", badge: "Sold out" },
  { name: "Nest of three bowls", category: "Bowls", glaze: "Slate", pence: 5800, shape: "low" },
  { name: "Pasta plate", category: "Plates", glaze: "Slate", pence: 3000, shape: "flat" },
]

const categories = ["All", "Mugs and cups", "Bowls", "Plates", "Jugs"] as const
type Filter = (typeof categories)[number]

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const
type Sort = (typeof sorts)[number]["value"]

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })
const formatPrice = (pence: number) => money.format(pence / 100)

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const shapeSize: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  low: "h-1/4 w-3/5",
  flat: "h-1/6 w-3/4",
}
const darkGlazes: Glaze[] = ["Iron", "Slate"]

function countLabel(n: number) {
  if (n === 0) return "No pieces"
  return `${n} ${n === 1 ? "piece" : "pieces"}`
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const links = mainLinks.map((link) => {
    const current = link.href === currentHref
    return { ...link, current }
  })

  return (
    <header className="border-b">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn("font-heading text-h2", navLink)}>
          Whitlow Pottery
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(navLink, link.current && "underline")}
                >
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
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label="Basket, 3 pieces"
            className={cn("inline-flex items-center gap-2", navLink)}
          >
            <ShoppingBag aria-hidden="true" className="size-4" strokeWidth={1.5} />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">(3)</span>
          </a>
        </div>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!open}
      >
        <ul className={cn(container, "py-2")}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn("block py-2", navLink, link.current && "underline")}
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
  const dark = darkGlazes.includes(piece.glaze)
  return (
    <li>
      <a
        href={`/tableware/${slug(piece.name)}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              "border border-foreground/40",
              shapeSize[piece.shape],
              dark ? "bg-glaze-dark" : "bg-glaze-pale"
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

function Collection() {
  const [category, setCategory] = useState<Filter>("All")
  const [sort, setSort] = useState<Sort>("featured")
  const allButton = useRef<HTMLButtonElement>(null)

  const shown = useMemo(() => {
    const filtered =
      category === "All" ? pieces : pieces.filter((p) => p.category === category)
    const list = [...filtered]
    if (sort === "price-asc") list.sort((a, b) => a.pence - b.pence)
    if (sort === "price-desc") list.sort((a, b) => b.pence - a.pence)
    if (sort === "name")
      list.sort((a, b) =>
        a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" })
      )
    return list
  }, [category, sort])

  const categoryName = category.toLowerCase()

  return (
    <section>
      <div className="grid gap-x-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2 font-mono text-label text-muted-foreground">
              <li>
                <a href="/" className={navLink}>
                  Shop
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Tableware</li>
            </ol>
          </nav>
          <h1 className="mt-2 text-h1">Tableware</h1>
          <p className="mt-4 max-w-lg">
            Everything here is food-safe and goes in the dishwasher. We throw
            each piece by hand, so no two come out of the kiln quite the same.
          </p>
        </div>
      </div>

      <h2 className="sr-only">Pieces</h2>

      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p id="category-label" className="font-mono text-label text-foreground">
            Category
          </p>
          <div
            role="group"
            aria-labelledby="category-label"
            className="mt-2 flex flex-wrap gap-2"
          >
            {categories.map((name) => {
              const pressed = name === category
              return (
                <Button
                  key={name}
                  ref={name === "All" ? allButton : undefined}
                  variant={pressed ? "secondary" : "outline"}
                  aria-pressed={pressed}
                  className={buttonText}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="w-full md:w-56">
          <label
            htmlFor="sort"
            className="block font-mono text-label text-foreground"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className={cn(
              "mt-2 h-auto w-full rounded-lg border border-input bg-card px-4 py-2 text-body aria-invalid:border-destructive",
              focusRing
            )}
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          <h3 className="text-h2">No {categoryName} just now</h3>
          <p className="mt-4">
            {category === "Jugs"
              ? "The next jugs come out of the kiln in early December."
              : `The next ${categoryName} come out of the next firing.`}
          </p>
          <Button
            variant="secondary"
            className={cn("mt-6", buttonText)}
            onClick={() => {
              setCategory("All")
              allButton.current?.focus()
            }}
          >
            Show all pieces
          </Button>
        </div>
      )}
    </section>
  )
}

function Delivery() {
  return (
    <section>
      <div className="grid gap-x-6 md:grid-cols-12">
        <div className="rounded-xl border bg-card p-6 md:col-span-7">
          <h2 className="text-h2">Delivery and returns</h2>
          <p className="mt-4 max-w-lg">
            Every piece is wrapped in recycled paper and posted within three
            working days of your order.
          </p>
          <p className="mt-4 max-w-lg">
            If a piece is not right for you, send it back unused within 30 days
            for a full refund.{" "}
            <a href="/delivery" className={textLink}>
              Read the delivery terms
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t">
      <div className={cn(container, "py-10")}>
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-heading text-h2">Whitlow Pottery</p>
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
                  <a href={link.href} className={navLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-6 font-mono text-label text-muted-foreground">
          © 2026 Whitlow Pottery
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="bg-background text-body text-foreground">
      <Header />
      <main className={cn(container, "flex flex-col gap-20 pt-10 pb-20")}>
        <Collection />
        <Delivery />
      </main>
      <Footer />
    </div>
  )
}

export default App
