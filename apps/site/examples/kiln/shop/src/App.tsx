import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"
const BASKET_COUNT: number = 3

const container = "mx-auto max-w-[1120px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const quietLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label"

const price = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPrice = (pence: number) => price.format(pence / 100)

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
type Shape = "tall" | "bowl" | "flat"

type Piece = {
  name: string
  glaze: Glaze
  pence: number
  shape: Shape
  category: "tableware" | "vases"
  badge?: string
}

const pieces: Piece[] = [
  {
    name: "Moor mug",
    glaze: "Ash",
    pence: 2800,
    shape: "tall",
    category: "tableware",
  },
  {
    name: "Fold bowl",
    glaze: "Iron",
    pence: 3400,
    shape: "bowl",
    category: "tableware",
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    glaze: "Slate",
    pence: 3600,
    shape: "tall",
    category: "tableware",
  },
  {
    name: "Side plate",
    glaze: "Oat",
    pence: 2200,
    shape: "flat",
    category: "tableware",
  },
  {
    name: "Espresso cup",
    glaze: "Iron",
    pence: 1800,
    shape: "tall",
    category: "tableware",
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    pence: 7200,
    shape: "bowl",
    category: "tableware",
    badge: "Last one",
  },
  {
    name: "Bud vase",
    glaze: "Slate",
    pence: 3000,
    shape: "tall",
    category: "vases",
    badge: "New",
  },
  {
    name: "Dinner plate",
    glaze: "Oat",
    pence: 3200,
    shape: "flat",
    category: "tableware",
  },
]

const shapeSize: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  flat: "h-1/6 w-3/4",
}

const isDark = (glaze: Glaze) => glaze === "Iron" || glaze === "Slate"

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const pieceHref = (piece: Piece) => `/${piece.category}/${slug(piece.name)}`

const steps = [
  {
    title: "Thrown on the wheel",
    text: "Each piece starts as a weighed ball of stoneware clay, centred and pulled up on the wheel by Nell or Tomas. It rests overnight under a sheet until it is firm enough to handle.",
  },
  {
    title: "Trimmed and dried",
    text: "Once it is leather-hard, the foot is trimmed and any handle is pulled and joined. A mug then dries slowly on the shelves for about a week before its first firing.",
  },
  {
    title: "Glazed and fired",
    text: "We dip each piece in glaze by hand and fill the kiln about once a month. The glaze firing reaches 1,260°C, and the kiln takes two days to cool before we can open it.",
  },
]

function DrawnPiece({ glaze, shape }: { glaze: Glaze; shape: Shape }) {
  return (
    <div
      className={cn(
        "border border-foreground/40",
        shapeSize[shape],
        isDark(glaze) ? "bg-glaze-dark" : "bg-glaze-pale"
      )}
    />
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  const basketLabel =
    BASKET_COUNT === 0
      ? "Basket, empty"
      : `Basket, ${BASKET_COUNT} ${BASKET_COUNT === 1 ? "piece" : "pieces"}`

  return (
    <header className="border-b" onKeyDown={handleKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-4 gap-y-2 py-4 md:gap-x-6"
        )}
      >
        <a href="/" className={cn("font-heading text-h2", quietLink)}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {mainLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(quietLink, link.current && "underline")}
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
            aria-expanded={open}
            aria-controls="small-screen-menu"
            onClick={() => setOpen((value) => !value)}
            className={cn(buttonClasses, "md:hidden")}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={basketLabel}
            className={cn("inline-flex items-center gap-2", quietLink)}
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
        id="small-screen-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t md:hidden"
      >
        <ul className={cn(container, "py-2")}>
          {mainLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "block py-2",
                  quietLink,
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
    <section className="grid gap-x-6 md:grid-cols-12 md:items-center">
      <div className="md:col-span-5">
        <p className="font-mono text-label text-muted-foreground">
          Hand-thrown in Bramwick
        </p>
        <h1 className="mt-2 text-h1 lg:text-display">
          Stoneware for every day, made by two people
        </h1>
        <p className="mt-4 max-w-lg">
          Nell Varga and Tomas Reid make mugs, bowls, plates and vases in small
          batches and fire the kiln about once a month. Every piece is food-safe
          stoneware, glazed in ash, oat, iron or slate, and made to be used
          daily.
        </p>
        <div className="mt-6">
          <a href="/tableware" className={cn(buttonVariants(), buttonClasses)}>
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
            {formatPrice(6400)}
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
      className="grid gap-x-6 md:grid-cols-12"
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

function NewFromTheKiln() {
  return (
    <section aria-labelledby="new-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="new-heading" className="text-h2">
          New from the kiln
        </h2>
        <a href="/tableware" className={quietLink}>
          See all tableware
        </a>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {pieces.map((piece) => (
          <li key={piece.name}>
            <a
              href={pieceHref(piece)}
              className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
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
                  <span className="font-mono tabular-nums">
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
        ))}
      </ul>
    </section>
  )
}

function HowItIsMade() {
  return (
    <section aria-labelledby="process-heading">
      <h2 id="process-heading" className="text-h2">
        How a piece is made
      </h2>
      <ol className="mt-6 grid gap-y-6 md:grid-cols-3 md:gap-x-6">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t pt-4">
            <p className="font-mono text-label text-muted-foreground">
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
  const [done, setDone] = useState(false)
  const field = useRef<HTMLInputElement>(null)
  const message = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (done) message.current?.focus()
  }, [done])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    setEmail(value)
    if (!EMAIL_PATTERN.test(value)) {
      setError(true)
      field.current?.focus()
      return
    }
    setError(false)
    setDone(true)
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="grid gap-x-6 md:grid-cols-12"
    >
      <div
        id="newsletter"
        className="rounded-xl border bg-card p-6 md:col-span-7"
      >
        <h2 id="newsletter-heading" className="text-h2">
          Firing notes
        </h2>
        <p className="mt-4 max-w-lg">
          One email when the kiln opens, about once a month, with what came out
          of it and when it goes on sale.
        </p>
        <div className="mt-6">
          {done ? null : (
            <form noValidate onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="block font-mono text-label text-foreground"
              >
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 md:flex-row">
                <Input
                  ref={field}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(false)
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error ? "email-help email-error" : "email-help"
                  }
                  className="h-auto px-4 py-2 text-body md:flex-1 md:text-body"
                />
                <Button type="submit" className={buttonClasses}>
                  Sign up
                </Button>
              </div>
              <p
                id="email-help"
                className="mt-2 font-mono text-label text-muted-foreground"
              >
                No more than one email a month. Leave whenever you like.
              </p>
              {error ? (
                <p
                  id="email-error"
                  className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span>Enter an email address, like name@example.com.</span>
                </p>
              ) : null}
            </form>
          )}
          <div role="status">
            {done ? (
              <div
                ref={message}
                tabIndex={-1}
                className="flex items-start gap-2 text-body focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
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
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className={cn(container, "py-10")}>
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
                  <a href={link.href} className={quietLink}>
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
      <SiteHeader />
      <main className={cn(container, "flex flex-col gap-20 pt-10 pb-20")}>
        <Opening />
        <AboutStudio />
        <NewFromTheKiln />
        <HowItIsMade />
        <FiringNotes />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
