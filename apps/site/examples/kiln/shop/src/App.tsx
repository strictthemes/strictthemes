import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"
const CONTAINER = "mx-auto max-w-[1120px] px-4 md:px-6"
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
const BUTTON = "h-auto px-4 py-2 font-mono text-label"

const MAIN_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]
const CURRENT = "/"

const FOOTER_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

const BASKET_COUNT: number = 3

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPence = (pence: number) => money.format(pence / 100)

type Shape = "tall" | "bowl" | "plate"
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"

type Piece = {
  name: string
  glaze: Glaze
  pence: number
  shape: Shape
  section: "tableware" | "vases"
  badge?: string
}

const PIECES: Piece[] = [
  { name: "Moor mug", glaze: "Ash", pence: 2800, shape: "tall", section: "tableware" },
  { name: "Fold bowl", glaze: "Iron", pence: 3400, shape: "bowl", section: "tableware", badge: "New" },
  { name: "Tumbler, set of two", glaze: "Slate", pence: 3600, shape: "tall", section: "tableware" },
  { name: "Side plate", glaze: "Oat", pence: 2200, shape: "plate", section: "tableware" },
  { name: "Espresso cup", glaze: "Iron", pence: 1800, shape: "tall", section: "tableware" },
  { name: "Serving bowl", glaze: "Ash", pence: 7200, shape: "bowl", section: "tableware", badge: "Last one" },
  { name: "Bud vase", glaze: "Slate", pence: 3000, shape: "tall", section: "vases", badge: "New" },
  { name: "Dinner plate", glaze: "Oat", pence: 3200, shape: "plate", section: "tableware" },
]

const SHAPE_SIZE: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

const isDark = (glaze: Glaze) => glaze === "Iron" || glaze === "Slate"

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const STEPS = [
  {
    title: "Thrown on the wheel",
    text: "Each piece starts as a weighed ball of stoneware clay, centred and pulled up by hand on the wheel. Nell throws the mugs and bowls; Tomas throws the jugs and vases.",
  },
  {
    title: "Trimmed and dried",
    text: "When the clay is leather-hard we trim the foot and add any handles. A mug then dries slowly under plastic for about a week before its first firing.",
  },
  {
    title: "Glazed and fired",
    text: "We dip each piece in one of our four glazes and fire the kiln to 1,260°C. The kiln takes two days to cool before we can open it and see what came out.",
  },
]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const linkProps = (href: string) =>
    href === CURRENT
      ? { "aria-current": "page" as const, className: cn(NAV_LINK, "underline") }
      : { className: NAV_LINK }

  return (
    <header className="border-b">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn(NAV_LINK, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {MAIN_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} {...linkProps(link.href)}>
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
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            className={cn(NAV_LINK, "inline-flex items-center gap-2")}
            aria-label={
              BASKET_COUNT === 0
                ? "Basket, empty"
                : `Basket, ${BASKET_COUNT} ${BASKET_COUNT === 1 ? "piece" : "pieces"}`
            }
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">({BASKET_COUNT})</span>
          </a>
        </div>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!open}
      >
        <ul className={cn(CONTAINER, "py-2")}>
          {MAIN_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...linkProps(link.href)}
                className={cn(linkProps(link.href).className, "block py-2")}
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

function Opening() {
  return (
    <section
      aria-labelledby="opening-title"
      className="grid gap-x-6 md:grid-cols-12 md:items-center"
    >
      <div className="md:col-span-5">
        <p className="font-mono text-label text-muted-foreground">
          Hand-thrown in Bramwick
        </p>
        <h1 id="opening-title" className="mt-2 text-h1 lg:text-display">
          Stoneware for every day, made by two people
        </h1>
        <p className="mt-4 max-w-lg">
          We make mugs, bowls, plates and vases in small batches, glazed in
          four colours of our own. Every piece is used at our table before it
          goes on sale.
        </p>
        <div className="mt-6">
          <a
            href="/tableware"
            className={cn(buttonVariants({ variant: "default" }), BUTTON)}
          >
            Shop tableware
          </a>
        </div>
      </div>
      <figure className="mt-10 md:col-span-6 md:col-start-7 md:mt-0">
        <div
          role="img"
          aria-label="Tall jug in ash glaze, seen from the side"
          className="flex aspect-4/5 items-center justify-center rounded-xl border bg-muted"
        >
          <div className="h-1/2 w-2/5 border border-foreground/40 bg-glaze-pale" />
        </div>
        <figcaption className="mt-2 font-mono text-label text-muted-foreground">
          Tall jug, ash glaze,{" "}
          <span className="tabular-nums text-foreground">
            {formatPence(6400)}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}

function About() {
  return (
    <section aria-label="About the studio" className="grid gap-x-6 md:grid-cols-12">
      <div className="md:col-span-8">
        <p className="font-heading text-h2">
          Every piece is thrown, trimmed and glazed by hand in a converted dairy
          at the edge of Bramwick, and no two come out of the kiln the same.
        </p>
        <div className="mt-4">
          <a href="/studio" className={TEXT_LINK}>
            Read about the studio
          </a>
        </div>
      </div>
    </section>
  )
}

function Tile({ piece }: { piece: Piece }) {
  return (
    <li>
      <a
        href={`/${piece.section}/${slug(piece.name)}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              SHAPE_SIZE[piece.shape],
              "border border-foreground/40",
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
            <span className="font-mono tabular-nums">
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
  )
}

function NewFromTheKiln() {
  return (
    <section aria-labelledby="new-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="new-title" className="text-h2">
          New from the kiln
        </h2>
        <a href="/tableware" className={NAV_LINK}>
          See all tableware
        </a>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {PIECES.map((piece) => (
          <Tile key={piece.name} piece={piece} />
        ))}
      </ul>
    </section>
  )
}

function HowItIsMade() {
  return (
    <section aria-labelledby="process-title">
      <h2 id="process-title" className="text-h2">
        How a piece is made
      </h2>
      <ol className="mt-6 grid gap-y-6 md:grid-cols-3 md:gap-x-6">
        {STEPS.map((step, index) => (
          <li key={step.title} className="border-t pt-4">
            <p className="font-mono text-label text-muted-foreground">
              Step {index + 1}
            </p>
            <h3 className="mt-2 font-sans text-body font-medium">{step.title}</h3>
            <p className="mt-2 max-w-lg">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <a href="/studio#process" className={TEXT_LINK}>
          See the whole process
        </a>
      </div>
    </section>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FiringNotes() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const message = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (done) message.current?.focus()
  }, [done])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(true)
      input.current?.focus()
      return
    }
    setError(false)
    setDone(true)
  }

  return (
    <section aria-labelledby="newsletter-title" className="grid gap-x-6 md:grid-cols-12">
      <div id="newsletter" className="rounded-xl border bg-card p-6 md:col-span-7">
        <h2 id="newsletter-title" className="text-h2">
          Firing notes
        </h2>
        <p className="mt-4 max-w-lg">
          One email when the kiln opens, about once a month, with what came out
          and the day it goes on sale.
        </p>
        <div className="mt-6">
          {!done && (
            <form noValidate onSubmit={onSubmit}>
              <label
                htmlFor="newsletter-email"
                className="block font-mono text-label text-foreground"
              >
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 md:flex-row">
                <Input
                  ref={input}
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(false)
                  }}
                  aria-invalid={error || undefined}
                  aria-describedby={
                    error ? "newsletter-error newsletter-help" : "newsletter-help"
                  }
                  className="h-auto px-4 py-2 text-body md:flex-1 md:text-body"
                />
                <Button type="submit" className={BUTTON}>
                  Sign up
                </Button>
              </div>
              {error && (
                <p
                  id="newsletter-error"
                  className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span>Enter an email address, like name@example.com.</span>
                </p>
              )}
              <p
                id="newsletter-help"
                className="mt-2 font-mono text-label text-muted-foreground"
              >
                No more than one email a month. Leave whenever you like.
              </p>
            </form>
          )}
          <div role="status">
            {done && (
              <div
                ref={message}
                tabIndex={-1}
                className="flex items-start gap-2 text-body focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
              >
                <CircleCheck
                  className="mt-1 size-4 shrink-0 text-success"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-foreground">
                  You are on the list. The next firing notes come when the kiln
                  opens in early December.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
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
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main className={cn(CONTAINER, "flex flex-col gap-20 pt-10 pb-20")}>
        <Opening />
        <About />
        <NewFromTheKiln />
        <HowItIsMade />
        <FiringNotes />
      </main>
      <Footer />
    </div>
  )
}

export default App
