import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const basketCount: number = 3

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

const buttonClass = "h-auto px-4 py-2 font-mono text-label"

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

function basketLabel(count: number) {
  if (count === 0) return "Basket, empty"
  if (count === 1) return "Basket, 1 piece"
  return `Basket, ${count} pieces`
}

const mainLinks = [
  { label: "Shop", href: "/", current: true },
  { label: "Tableware", href: "/tableware", current: false },
  { label: "Vases", href: "/vases", current: false },
  { label: "Studio", href: "/studio", current: false },
]

const footerLinks = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

type Glaze = "Ash" | "Oat" | "Iron" | "Slate"
type Shape = "tall" | "bowl" | "plate"

const darkGlazes: Glaze[] = ["Iron", "Slate"]

const shapeClass: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

type Piece = {
  name: string
  glaze: Glaze
  pricePence: number
  shape: Shape
  section: "tableware" | "vases"
  badge?: string
}

const newPieces: Piece[] = [
  {
    name: "Moor mug",
    glaze: "Ash",
    pricePence: 2800,
    shape: "tall",
    section: "tableware",
  },
  {
    name: "Fold bowl",
    glaze: "Iron",
    pricePence: 3400,
    shape: "bowl",
    section: "tableware",
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    glaze: "Slate",
    pricePence: 3600,
    shape: "tall",
    section: "tableware",
  },
  {
    name: "Side plate",
    glaze: "Oat",
    pricePence: 2200,
    shape: "plate",
    section: "tableware",
  },
  {
    name: "Espresso cup",
    glaze: "Iron",
    pricePence: 1800,
    shape: "tall",
    section: "tableware",
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    pricePence: 7200,
    shape: "bowl",
    section: "tableware",
    badge: "Last one",
  },
  {
    name: "Bud vase",
    glaze: "Slate",
    pricePence: 3000,
    shape: "tall",
    section: "vases",
    badge: "New",
  },
  {
    name: "Dinner plate",
    glaze: "Oat",
    pricePence: 3200,
    shape: "plate",
    section: "tableware",
  },
]

const steps = [
  {
    title: "Thrown on the wheel",
    text: "Each piece starts as a weighed ball of stoneware clay, centred and pulled up by hand on the wheel. Handles go on the next morning, once the clay has firmed up enough to hold them.",
  },
  {
    title: "Trimmed and dried",
    text: "When the clay is leather-hard we trim the foot and stamp the base. A mug then dries slowly under a cloth for about a week before its first firing.",
  },
  {
    title: "Glazed and fired",
    text: "We dip each piece in one of our four glazes and pack the kiln for a firing that reaches 1,260°C. The kiln then takes two days to cool before we can open it.",
  },
]

function DrawnPiece({ glaze, shape }: { glaze: Glaze; shape: Shape }) {
  return (
    <div
      className={cn(
        "border border-foreground/60",
        shapeClass[shape],
        darkGlazes.includes(glaze) ? "bg-glaze-dark" : "bg-glaze-pale"
      )}
    />
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header className="border-b" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
        <a href="/" className={cn(navLink, "font-heading text-h2")}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {mainLinks.map((link) => (
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
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="small-screen-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClass, "md:hidden")}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel(basketCount)}
            className={cn(navLink, "inline-flex items-center gap-2")}
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
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  navLink,
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

function Opening() {
  return (
    <section className="grid grid-cols-1 gap-x-6 md:grid-cols-12 md:items-center">
      <div className="md:col-span-5">
        <p className="font-mono text-label text-muted-foreground">
          Hand-thrown in Bramwick
        </p>
        <h1 className="mt-2 text-h1 lg:text-display">
          Stoneware for every day, made by two people
        </h1>
        <p className="mt-4 max-w-lg">
          We make mugs, bowls, plates and vases in small batches, in four glazes
          we mix ourselves. The kiln is fired about once a month, and what comes
          out of it goes straight into the shop.
        </p>
        <div className="mt-6">
          <a
            href="/tableware"
            className={cn(buttonVariants({ variant: "default" }), buttonClass)}
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
          <DrawnPiece glaze="Ash" shape="tall" />
        </div>
        <figcaption className="mt-2 font-mono text-label text-muted-foreground">
          Tall jug, ash glaze,{" "}
          <span className="text-foreground tabular-nums">
            {formatPence(6400)}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}

function AboutStudio() {
  return (
    <section
      aria-label="About the studio"
      className="grid grid-cols-1 gap-x-6 md:grid-cols-12"
    >
      <div className="md:col-span-8">
        <p className="font-heading text-h2">
          Every piece is thrown, trimmed and glazed by hand in a converted dairy
          at the edge of Bramwick, and no two come out of the kiln the same.
        </p>
        <div className="mt-4">
          <a href="/studio" className={textLink}>
            Read about the studio
          </a>
        </div>
      </div>
    </section>
  )
}

function NewFromKiln() {
  return (
    <section aria-labelledby="new-from-kiln">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="new-from-kiln" className="text-h2">
          New from the kiln
        </h2>
        <a href="/tableware" className={navLink}>
          See all tableware
        </a>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {newPieces.map((piece) => (
          <li key={piece.name}>
            <a
              href={`/${piece.section}/${slugify(piece.name)}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
            >
              <div
                aria-hidden="true"
                className="flex aspect-square items-center justify-center border-b bg-muted"
              >
                <DrawnPiece glaze={piece.glaze} shape={piece.shape} />
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
                    {formatPence(piece.pricePence)}
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
  )
}

function HowItIsMade() {
  return (
    <section aria-labelledby="how-made">
      <h2 id="how-made" className="text-h2">
        How a piece is made
      </h2>
      <ol className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t pt-4">
            <p className="font-mono text-label text-muted-foreground tabular-nums">
              Step {index + 1}
            </p>
            <h3 className="mt-2 font-sans text-body font-medium">
              {step.title}
            </h3>
            <p className="mt-2 max-w-lg">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <a href="/studio#process" className={textLink}>
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
  const [signedUp, setSignedUp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (signedUp) messageRef.current?.focus()
  }, [signedUp])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError(true)
      inputRef.current?.focus()
      return
    }
    setError(false)
    setSignedUp(true)
  }

  return (
    <section
      aria-labelledby="firing-notes"
      className="grid grid-cols-1 gap-x-6 md:grid-cols-12"
    >
      <div
        id="newsletter"
        className="rounded-xl border bg-card p-6 md:col-span-7"
      >
        <h2 id="firing-notes" className="text-h2">
          Firing notes
        </h2>
        <p className="mt-4 max-w-lg">
          One email when the kiln opens, about once a month, with what came out
          of it and the day it goes on sale.
        </p>
        <div className="mt-6">
          {!signedUp && (
            <form noValidate onSubmit={handleSubmit}>
              <label
                htmlFor="newsletter-email"
                className="block font-mono text-label text-foreground"
              >
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 md:flex-row">
                <Input
                  ref={inputRef}
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(false)
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error
                      ? "newsletter-help newsletter-error"
                      : "newsletter-help"
                  }
                  className="h-auto px-4 py-2 text-body md:flex-1 md:text-body"
                />
                <Button type="submit" className={buttonClass}>
                  Sign up
                </Button>
              </div>
              <p
                id="newsletter-help"
                className="mt-2 font-mono text-label text-muted-foreground"
              >
                No more than one email a month. Leave whenever you like.
              </p>
              {error && (
                <p
                  id="newsletter-error"
                  className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="wrap-break-word">
                    Enter an email address, like name@example.com.
                  </span>
                </p>
              )}
            </form>
          )}
          <div role="status">
            {signedUp && (
              <p
                ref={messageRef}
                tabIndex={-1}
                className="flex items-start gap-2 text-body focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
              >
                <CircleCheck
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-success"
                  strokeWidth={1.5}
                />
                <span className="text-foreground">
                  You are on the list. The next firing notes come when the kiln
                  opens in early December.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
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
        <p className="mt-6 font-mono text-label text-muted-foreground tabular-nums">
          © 2026 {STUDIO}
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="bg-background text-body text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <Opening />
        <AboutStudio />
        <NewFromKiln />
        <HowItIsMade />
        <FiringNotes />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
