import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const plainLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label"

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPence = (pence: number) => money.format(pence / 100)

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

type Shape = "tall" | "bowl" | "plate"
type Glaze = "pale" | "dark"

type Line = {
  id: string
  name: string
  glaze: string
  glazeTone: Glaze
  shape: Shape
  href: string
  unitPence: number
  quantity: number
  stock: number
}

const startingLines: Line[] = [
  {
    id: "moor-mug",
    name: "Moor mug",
    glaze: "Ash glaze",
    glazeTone: "pale",
    shape: "tall",
    href: "/tableware/moor-mug",
    unitPence: 2800,
    quantity: 2,
    stock: 8,
  },
  {
    id: "fold-bowl",
    name: "Fold bowl",
    glaze: "Iron glaze",
    glazeTone: "dark",
    shape: "bowl",
    href: "/tableware/fold-bowl",
    unitPence: 3400,
    quantity: 1,
    stock: 6,
  },
]

type DeliveryId = "standard" | "tracked" | "collect"

const FREE_POST_FROM = 10000
const NOTE_LIMIT = 300

const shapeClasses: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

const glazeClasses: Record<Glaze, string> = {
  pale: "bg-glaze-pale",
  dark: "bg-glaze-dark",
}

function piecesLabel(count: number) {
  if (count === 0) return "No pieces"
  return count === 1 ? "1 piece" : `${count} pieces`
}

function basketAriaLabel(count: number) {
  if (count === 0) return "Basket, empty"
  return count === 1 ? "Basket, 1 piece" : `Basket, ${count} pieces`
}

function Header({ count }: { count: number }) {
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
        <a href="/" className={cn(plainLink, "font-heading text-h2")}>
          {STUDIO}
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
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="small-screen-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <a
            href="/basket"
            aria-current="page"
            aria-label={basketAriaLabel(count)}
            className={cn(plainLink, "inline-flex items-center gap-2 underline")}
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden md:inline">Basket</span>
            <span className="font-mono tabular-nums">({count})</span>
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
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={cn(plainLink, "block py-2")}>
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
  )
}

function deliveryHelp(id: DeliveryId) {
  if (id === "standard") return <>Arrives in 3 to 5 working days.</>
  if (id === "tracked")
    return (
      <>
        Order by <time dateTime="13:00">13:00</time> for the next working day.
      </>
    )
  return (
    <>
      Collect from Unit 3, Coldharbour Yard, Thursday to Saturday,{" "}
      <time dateTime="10:00">10:00</time> to{" "}
      <time dateTime="16:00">16:00</time>.
    </>
  )
}

export function App() {
  const [lines, setLines] = useState<Line[]>(startingLines)
  const [delivery, setDelivery] = useState<DeliveryId>("standard")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")

  const nameLinks = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const emptyHeading = useRef<HTMLHeadingElement>(null)
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === "empty") emptyHeading.current?.focus()
    else nameLinks.current.get(target)?.focus()
  }, [lines])

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPence * line.quantity,
    0
  )
  const standardPence = subtotal >= FREE_POST_FROM ? 0 : 550
  const deliveryOptions: { id: DeliveryId; name: string; pence: number }[] = [
    { id: "standard", name: "Standard post", pence: standardPence },
    { id: "tracked", name: "Tracked", pence: 950 },
    { id: "collect", name: "Collect from the studio", pence: 0 },
  ]
  const deliveryPence =
    deliveryOptions.find((option) => option.id === delivery)?.pence ?? 0
  const total = subtotal + deliveryPence
  const priceOrFree = (pence: number) => (pence === 0 ? "Free" : formatPence(pence))

  function changeQuantity(id: string, step: number) {
    setLines((current) =>
      current.map((line) =>
        line.id === id
          ? {
              ...line,
              quantity: Math.min(
                line.stock,
                Math.max(1, line.quantity + step)
              ),
            }
          : line
      )
    )
  }

  function removeLine(id: string) {
    const index = lines.findIndex((line) => line.id === id)
    if (index === -1) return
    const removed = lines[index]
    const remaining = lines.filter((line) => line.id !== id)
    const next = remaining[index] ?? remaining[index - 1]
    pendingFocus.current = next ? next.id : "empty"
    setLines(remaining)
    setMessage(`${removed.name} removed from your basket.`)
  }

  const notesLeft = NOTE_LIMIT - note.length

  return (
    <div className="bg-background text-body text-foreground">
      <Header count={count} />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section>
          <h1 className="text-h1">Your basket</h1>
          <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
            {piecesLabel(count)}
          </p>
          <div role="status">
            {message && (
              <div className="mt-4 flex items-start gap-2 text-body">
                <CircleCheck
                  className="mt-1 size-4 shrink-0 text-success"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-foreground">{message}</p>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-x-6 md:grid-cols-12 md:items-start">
            {lines.length === 0 ? (
              <div className="md:col-span-7">
                <h2
                  ref={emptyHeading}
                  tabIndex={-1}
                  className={cn("text-h2", codeFocusRing)}
                >
                  Your basket is empty
                </h2>
                <p className="mt-4 max-w-lg">
                  The next firing comes out of the kiln in early December.
                </p>
                <a
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "mt-6",
                    buttonClasses
                  )}
                >
                  Back to the shop
                </a>
              </div>
            ) : (
              <>
                <section
                  aria-labelledby="lines-heading"
                  className="md:col-span-7"
                >
                  <h2 id="lines-heading" className="sr-only">
                    Pieces in your basket
                  </h2>
                  <ul>
                    {lines.map((line) => (
                      <li
                        key={line.id}
                        className="flex gap-4 border-t py-6 last:border-b"
                      >
                        <div
                          role="img"
                          aria-label={`${line.name} in ${line.glaze.toLowerCase()}`}
                          className="flex size-20 shrink-0 items-center justify-center rounded-xl border bg-muted"
                        >
                          <div
                            className={cn(
                              "border border-foreground/40",
                              shapeClasses[line.shape],
                              glazeClasses[line.glazeTone]
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <h3 className="font-sans text-body font-medium">
                              <a
                                ref={(node) => {
                                  if (node) nameLinks.current.set(line.id, node)
                                  else nameLinks.current.delete(line.id)
                                }}
                                href={line.href}
                                className={plainLink}
                              >
                                {line.name}
                              </a>
                            </h3>
                            <p className="font-mono text-body text-foreground tabular-nums">
                              {formatPence(line.unitPence * line.quantity)}
                            </p>
                          </div>
                          <p className="mt-1 font-mono text-label text-muted-foreground tabular-nums">
                            {line.glaze} · {formatPence(line.unitPence)} each
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <div
                              role="group"
                              aria-label={`Quantity of ${line.name}`}
                              className="inline-flex items-center gap-2"
                            >
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label={`One fewer ${line.name}`}
                                disabled={line.quantity <= 1}
                                focusableWhenDisabled
                                onClick={() => changeQuantity(line.id, -1)}
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
                                {line.quantity}
                              </output>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label={`One more ${line.name}`}
                                disabled={line.quantity >= line.stock}
                                focusableWhenDisabled
                                onClick={() => changeQuantity(line.id, 1)}
                              >
                                <Plus
                                  className="size-4"
                                  strokeWidth={1.5}
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              className={buttonClasses}
                              aria-label={`Remove ${line.name}`}
                              onClick={() => removeLine(line.id)}
                            >
                              <Trash2
                                className="size-4"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <label
                      htmlFor="studio-note"
                      className="block font-mono text-label text-foreground"
                    >
                      A note for the studio
                    </label>
                    <Textarea
                      id="studio-note"
                      value={note}
                      maxLength={NOTE_LIMIT}
                      onChange={(event) => setNote(event.target.value)}
                      aria-describedby="studio-note-help"
                      className="mt-2 h-auto min-h-24 resize-none px-4 py-2 text-body md:text-body"
                    />
                    <p
                      id="studio-note-help"
                      className="mt-2 font-mono text-label text-muted-foreground"
                    >
                      A gift message, or where to leave the parcel.{" "}
                      <span className="tabular-nums">{notesLeft} left</span>
                    </p>
                  </div>
                </section>

                <section
                  aria-labelledby="summary-heading"
                  className="mt-10 rounded-xl border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0"
                >
                  <h2 id="summary-heading" className="text-h2">
                    Summary
                  </h2>
                  <p
                    id="delivery-label"
                    className="mt-6 font-mono text-label text-foreground"
                  >
                    Delivery
                  </p>
                  <div
                    role="group"
                    aria-labelledby="delivery-label"
                    className="mt-2 flex flex-col gap-2"
                  >
                    {deliveryOptions.map((option) => {
                      const chosen = option.id === delivery
                      return (
                        <Button
                          key={option.id}
                          variant={chosen ? "secondary" : "outline"}
                          aria-pressed={chosen}
                          onClick={() => setDelivery(option.id)}
                          className={cn(
                            buttonClasses,
                            "w-full justify-between text-left whitespace-normal"
                          )}
                        >
                          <span>{option.name}</span>
                          <span className="tabular-nums">
                            {priceOrFree(option.pence)}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                  <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                    {deliveryHelp(delivery)}
                  </p>

                  <dl className="mt-6">
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-mono text-label text-muted-foreground">
                        Subtotal
                      </dt>
                      <dd className="font-mono text-body text-foreground tabular-nums">
                        {formatPence(subtotal)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-mono text-label text-muted-foreground">
                        Delivery
                      </dt>
                      <dd className="font-mono text-body text-foreground tabular-nums">
                        {priceOrFree(deliveryPence)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-sans text-body font-medium text-foreground">
                        Total
                      </dt>
                      <dd className="font-mono text-h2 font-medium text-foreground tabular-nums">
                        {formatPence(total)}
                      </dd>
                    </div>
                  </dl>

                  {delivery === "standard" && (
                    <p className="mt-4 font-mono text-label text-muted-foreground tabular-nums">
                      {subtotal < FREE_POST_FROM
                        ? `Spend ${formatPence(FREE_POST_FROM - subtotal)} more for free standard post.`
                        : "Standard post is free on this order."}
                    </p>
                  )}

                  <a
                    href="/checkout"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "mt-6 w-full",
                      buttonClasses
                    )}
                  >
                    Go to checkout
                  </a>
                  <p className="mt-4 font-mono text-label text-muted-foreground">
                    You pay on the next page.
                  </p>
                </section>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
