import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { CircleAlert, CircleCheck, ShoppingBag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"
const BASKET_COUNT: number = 3

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const buttonText = "h-auto px-4 py-2 font-mono text-label"

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function price(pence: number) {
  return gbp.format(pence / 100)
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

const mainLinks = [
  { label: "Shop", href: "/", current: true },
  { label: "Tableware", href: "/tableware", current: false },
  { label: "Vases", href: "/vases", current: false },
  { label: "Studio", href: "/studio", current: false },
]

const footerLinks = [
  { label: "Shop", href: "/", current: true },
  { label: "Studio", href: "/studio", current: false },
  { label: "Delivery and returns", href: "/delivery", current: false },
  { label: "Care of stoneware", href: "/care", current: false },
]

type Glaze = "Ash" | "Oat" | "Iron" | "Slate"
type Shape = "tall" | "bowl" | "plate"

type Piece = {
  name: string
  glaze: Glaze
  pence: number
  shape: Shape
  range: "tableware" | "vases"
  badge?: string
}

const pieces: Piece[] = [
  {
    name: "Moor mug",
    glaze: "Ash",
    pence: 2800,
    shape: "tall",
    range: "tableware",
  },
  {
    name: "Fold bowl",
    glaze: "Iron",
    pence: 3400,
    shape: "bowl",
    range: "tableware",
    badge: "New",
  },
  {
    name: "Tumbler, set of two",
    glaze: "Slate",
    pence: 3600,
    shape: "tall",
    range: "tableware",
  },
  {
    name: "Side plate",
    glaze: "Oat",
    pence: 2200,
    shape: "plate",
    range: "tableware",
  },
  {
    name: "Espresso cup",
    glaze: "Iron",
    pence: 1800,
    shape: "tall",
    range: "tableware",
  },
  {
    name: "Serving bowl",
    glaze: "Ash",
    pence: 7200,
    shape: "bowl",
    range: "tableware",
    badge: "Last one",
  },
  {
    name: "Bud vase",
    glaze: "Slate",
    pence: 3000,
    shape: "tall",
    range: "vases",
    badge: "New",
  },
  {
    name: "Dinner plate",
    glaze: "Oat",
    pence: 3200,
    shape: "plate",
    range: "tableware",
  },
]

const shapeSize: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

function glazeFill(glaze: Glaze) {
  return glaze === "Iron" || glaze === "Slate"
    ? "bg-glaze-dark"
    : "bg-glaze-pale"
}

const steps = [
  {
    title: "Thrown on the wheel",
    text: "Each piece starts as a weighed ball of stoneware clay and is pulled up by hand on the wheel. A mug takes a few minutes to throw and is left overnight to firm up.",
  },
  {
    title: "Trimmed and dried",
    text: "The next day the foot is trimmed, the handle is pulled and joined, and the base is stamped. A mug then dries on the rack for about a week before its first firing.",
  },
  {
    title: "Glazed and fired",
    text: "Every piece is dipped in glaze by hand and wiped clean at the foot. The glaze firing reaches 1,260°C, and the kiln takes two days to cool before it can be opened.",
  },
]

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

  return (
    <header className="border-b">
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
            ref={menuButton}
            variant="outline"
            className={cn(buttonText, "md:hidden")}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-label={
              BASKET_COUNT === 0
                ? "Basket, empty"
                : `Basket, ${BASKET_COUNT} ${BASKET_COUNT === 1 ? "piece" : "pieces"}`
            }
            className={cn(navLink, "inline-flex items-center gap-2")}
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
        aria-label="Main"
        id="main-menu"
        hidden={!open}
        className="border-t md:hidden"
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

function Tile({ piece }: { piece: Piece }) {
  return (
    <li>
      <a
        href={`/${piece.range}/${slug(piece.name)}`}
        className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border-b bg-muted"
        >
          <div
            className={cn(
              "border border-foreground/40",
              shapeSize[piece.shape],
              glazeFill(piece.glaze)
            )}
          />
        </div>
        <div className="p-4">
          <h3 className="font-sans text-body font-medium">{piece.name}</h3>
          <p className="mt-1 font-mono text-label text-muted-foreground">
            {piece.glaze} glaze
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono tabular-nums">{price(piece.pence)}</span>
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Newsletter() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const message = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (done) message.current?.focus()
  }, [done])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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
    <div
      id="newsletter"
      className="rounded-xl border bg-card p-6 md:col-span-7"
    >
      <h2 id="newsletter-heading" className="text-h2">
        Firing notes
      </h2>
      <p className="mt-4 max-w-lg">
        One email when the kiln opens, about once a month, with what came out
        and when it goes on sale.
      </p>
      <div className="mt-6">
        {done ? null : (
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
                  error
                    ? "newsletter-email-error newsletter-email-help"
                    : "newsletter-email-help"
                }
                className="h-auto px-4 py-2 text-body md:flex-1 md:text-body"
              />
              <Button type="submit" className={buttonText}>
                Sign up
              </Button>
            </div>
            {error ? (
              <p
                id="newsletter-email-error"
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
            <p
              id="newsletter-email-help"
              className="mt-2 font-mono text-label text-muted-foreground"
            >
              No more than one email a month. Leave whenever you like.
            </p>
          </form>
        )}
        <div role="status">
          {done ? (
            <p
              ref={message}
              tabIndex={-1}
              className="flex items-start gap-2 text-body focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
              <CircleCheck
                className="mt-1 size-4 shrink-0 text-success"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-foreground">
                You are on the list. The next firing notes come when the kiln
                opens in early December.
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Footer() {
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
    <div className="bg-background text-body text-foreground">
      <Header />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section className="grid gap-x-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="font-mono text-label text-muted-foreground">
              Hand-thrown in Bramwick
            </p>
            <h1 className="mt-2 text-h1 lg:text-display">
              Stoneware for every day, made by two people
            </h1>
            <p className="mt-4 max-w-lg">
              Nell Varga and Tomas Reid make mugs, bowls, plates and vases in
              small batches and fire the kiln about once a month. Everything
              here is meant for the table and the dishwasher, not for the shelf.
            </p>
            <div className="mt-6">
              <a
                href="/tableware"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonText
                )}
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
              <span className="text-foreground tabular-nums">
                {price(6400)}
              </span>
            </figcaption>
          </figure>
        </section>

        <section
          aria-label="About the studio"
          className="grid gap-x-6 md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <p className="font-heading text-h2">
              Every piece is thrown, trimmed and glazed by hand in a converted
              dairy at the edge of Bramwick, and no two come out of the kiln the
              same.
            </p>
            <p className="mt-4">
              <a href="/studio" className={textLink}>
                Read about the studio
              </a>
            </p>
          </div>
        </section>

        <section aria-labelledby="new-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="new-heading" className="text-h2">
              New from the kiln
            </h2>
            <a href="/tableware" className={navLink}>
              See all tableware
            </a>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {pieces.map((piece) => (
              <Tile key={piece.name} piece={piece} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="made-heading">
          <h2 id="made-heading" className="text-h2">
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
          <p className="mt-10">
            <a href="/studio#process" className={textLink}>
              See the whole process
            </a>
          </p>
        </section>

        <section
          aria-labelledby="newsletter-heading"
          className="grid gap-x-6 md:grid-cols-12"
        >
          <Newsletter />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
