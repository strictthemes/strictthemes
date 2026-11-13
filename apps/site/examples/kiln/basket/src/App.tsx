import { useEffect, useRef, useState } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const CONTAINER = "mx-auto max-w-[1120px] px-4 md:px-6"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const QUIET_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const BUTTON = "h-auto px-4 py-2 font-mono text-label"

const LABEL = "font-mono text-label"

const NOTE_LIMIT = 300
const FREE_POST_FROM = 10000

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function money(pence: number) {
  return gbp.format(pence / 100)
}

type Shape = "tall" | "bowl" | "plate"

type Line = {
  id: string
  name: string
  href: string
  glaze: string
  dark: boolean
  shape: Shape
  unit: number
  quantity: number
  stock: number
}

const START_LINES: Line[] = [
  {
    id: "moor-mug",
    name: "Moor mug",
    href: "/tableware/moor-mug",
    glaze: "Ash",
    dark: false,
    shape: "tall",
    unit: 2800,
    quantity: 2,
    stock: 8,
  },
  {
    id: "fold-bowl",
    name: "Fold bowl",
    href: "/tableware/fold-bowl",
    glaze: "Iron",
    dark: true,
    shape: "bowl",
    unit: 3400,
    quantity: 1,
    stock: 6,
  },
]

const SHAPES: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}

type DeliveryId = "standard" | "tracked" | "collect"

const DELIVERY: { id: DeliveryId; name: string }[] = [
  { id: "standard", name: "Standard post" },
  { id: "tracked", name: "Tracked" },
  { id: "collect", name: "Collect from the studio" },
]

const MAIN_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Tableware", href: "/tableware" },
  { label: "Vases", href: "/vases" },
  { label: "Studio", href: "/studio" },
]

const FOOTER_LINKS = [
  { label: "Shop", href: "/" },
  { label: "Studio", href: "/studio" },
  { label: "Delivery and returns", href: "/delivery" },
  { label: "Care of stoneware", href: "/care" },
]

function pieces(count: number) {
  if (count === 0) return "No pieces"
  return count === 1 ? "1 piece" : `${count} pieces`
}

function deliveryCost(id: DeliveryId, subtotal: number) {
  if (id === "standard") return subtotal >= FREE_POST_FROM ? 0 : 550
  if (id === "tracked") return 950
  return 0
}

function costLabel(pence: number) {
  return pence === 0 ? "Free" : money(pence)
}

type FocusTarget = { kind: "line"; id: string } | { kind: "empty" }

export function App() {
  const [lines, setLines] = useState<Line[]>(START_LINES)
  const [delivery, setDelivery] = useState<DeliveryId>("standard")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const menuButton = useRef<HTMLButtonElement>(null)
  const emptyHeading = useRef<HTMLHeadingElement>(null)
  const nameLinks = useRef(new Map<string, HTMLAnchorElement>())
  const focusNext = useRef<FocusTarget | null>(null)

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unit * line.quantity,
    0
  )
  const deliveryPence = deliveryCost(delivery, subtotal)
  const total = subtotal + deliveryPence
  const left = NOTE_LIMIT - note.length

  useEffect(() => {
    const target = focusNext.current
    if (!target) return
    focusNext.current = null
    if (target.kind === "empty") {
      emptyHeading.current?.focus()
    } else {
      nameLinks.current.get(target.id)?.focus()
    }
  }, [lines])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  function changeQuantity(id: string, by: number) {
    setLines((current) =>
      current.map((line) =>
        line.id === id
          ? {
              ...line,
              quantity: Math.min(
                line.stock,
                Math.max(1, line.quantity + by)
              ),
            }
          : line
      )
    )
  }

  function remove(id: string) {
    const index = lines.findIndex((line) => line.id === id)
    if (index === -1) return
    const next = lines.filter((line) => line.id !== id)
    const neighbour = next[index] ?? next[index - 1]
    focusNext.current = neighbour
      ? { kind: "line", id: neighbour.id }
      : { kind: "empty" }
    setMessage(`${lines[index].name} removed from your basket.`)
    setLines(next)
  }

  return (
    <div className="bg-background text-body text-foreground">
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
              {MAIN_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={QUIET_LINK}>
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
              aria-expanded={menuOpen}
              aria-controls="small-screen-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
            <a
              href="/basket"
              aria-current="page"
              aria-label={
                count === 0
                  ? "Basket, empty"
                  : `Basket, ${pieces(count).toLowerCase()}`
              }
              className={cn(QUIET_LINK, "inline-flex items-center gap-2 underline")}
            >
              <ShoppingBag
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="hidden md:inline">Basket</span>
              <span className="font-mono tabular-nums">({count})</span>
            </a>
          </div>
        </div>
        <nav
          aria-label="Main"
          id="small-screen-menu"
          hidden={!menuOpen}
          className="border-t md:hidden"
        >
          <ul className={cn(CONTAINER, "py-2")}>
            {MAIN_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={cn(QUIET_LINK, "block py-2")}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className={cn(CONTAINER, "flex flex-col gap-20 pt-10 pb-20")}>
        <section>
          <h1 className="text-h1">Your basket</h1>
          <p
            className={cn(LABEL, "mt-2 text-muted-foreground tabular-nums")}
          >
            {pieces(count)}
          </p>
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

          <div className="mt-6 grid gap-x-6 md:grid-cols-12 md:items-start">
            {lines.length === 0 ? (
              <div className="min-w-0 md:col-span-7">
                <h2
                  ref={emptyHeading}
                  tabIndex={-1}
                  className={cn("text-h2", FOCUS_FROM_CODE)}
                >
                  Your basket is empty
                </h2>
                <p className="mt-4 max-w-lg">
                  The next firing comes out of the kiln in early December, and
                  the new pieces go into the shop the same week.
                </p>
                <a
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    BUTTON,
                    "mt-6"
                  )}
                >
                  Back to the shop
                </a>
              </div>
            ) : (
              <>
                <div className="min-w-0 md:col-span-7">
                  <h2 className="sr-only">Pieces in your basket</h2>
                  <ul>
                    {lines.map((line) => (
                      <li
                        key={line.id}
                        className="flex gap-4 border-t py-6 last:border-b"
                      >
                        <div
                          role="img"
                          aria-label={`${line.name} in ${line.glaze.toLowerCase()} glaze`}
                          className="flex size-20 shrink-0 items-center justify-center rounded-xl border bg-muted"
                        >
                          <div
                            className={cn(
                              "border border-foreground/40",
                              SHAPES[line.shape],
                              line.dark ? "bg-glaze-dark" : "bg-glaze-pale"
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <h3 className="font-sans text-body font-medium">
                              <a
                                href={line.href}
                                className={QUIET_LINK}
                                ref={(node) => {
                                  if (node) {
                                    nameLinks.current.set(line.id, node)
                                  } else {
                                    nameLinks.current.delete(line.id)
                                  }
                                }}
                              >
                                {line.name}
                              </a>
                            </h3>
                            <p className="font-mono text-body text-foreground tabular-nums">
                              {money(line.unit * line.quantity)}
                            </p>
                          </div>
                          <p
                            className={cn(
                              LABEL,
                              "mt-1 text-muted-foreground tabular-nums"
                            )}
                          >
                            {line.glaze} glaze · {money(line.unit)} each
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
                              className={BUTTON}
                              aria-label={`Remove ${line.name}`}
                              onClick={() => remove(line.id)}
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
                      className={cn(LABEL, "block text-foreground")}
                    >
                      A note for the studio
                    </label>
                    <Textarea
                      id="studio-note"
                      className="mt-2 h-auto min-h-24 resize-none px-4 py-2 text-body md:text-body"
                      maxLength={NOTE_LIMIT}
                      aria-describedby="studio-note-help"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                    />
                    <p
                      id="studio-note-help"
                      className={cn(LABEL, "mt-2 text-muted-foreground")}
                    >
                      A gift message, or where to leave the parcel.{" "}
                      <span className="tabular-nums">{left} left</span>
                    </p>
                  </div>
                </div>

                <div className="mt-10 min-w-0 rounded-xl border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
                  <h2 className="text-h2">Summary</h2>

                  <p
                    id="delivery-label"
                    className={cn(LABEL, "mt-6 text-foreground")}
                  >
                    Delivery
                  </p>
                  <div
                    role="group"
                    aria-labelledby="delivery-label"
                    className="mt-2 flex flex-col gap-2"
                  >
                    {DELIVERY.map((option) => {
                      const chosen = option.id === delivery
                      return (
                        <Button
                          key={option.id}
                          variant={chosen ? "secondary" : "outline"}
                          aria-pressed={chosen}
                          className={cn(
                            BUTTON,
                            "w-full justify-between text-left whitespace-normal"
                          )}
                          onClick={() => setDelivery(option.id)}
                        >
                          <span>{option.name}</span>
                          <span className="tabular-nums">
                            {costLabel(deliveryCost(option.id, subtotal))}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                  <p className={cn(LABEL, "mt-2 text-muted-foreground")}>
                    {delivery === "standard" &&
                      "Arrives in 3 to 5 working days."}
                    {delivery === "tracked" && (
                      <>
                        Order by{" "}
                        <time dateTime="13:00" className="tabular-nums">
                          13:00
                        </time>{" "}
                        for the next working day.
                      </>
                    )}
                    {delivery === "collect" && (
                      <>
                        Collect from Unit 3, Coldharbour Yard, Thursday to
                        Saturday,{" "}
                        <time dateTime="10:00" className="tabular-nums">
                          10:00
                        </time>{" "}
                        to{" "}
                        <time dateTime="16:00" className="tabular-nums">
                          16:00
                        </time>
                        .
                      </>
                    )}
                  </p>

                  <dl className="mt-6">
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className={cn(LABEL, "text-muted-foreground")}>
                        Subtotal
                      </dt>
                      <dd className="font-mono text-body text-foreground tabular-nums">
                        {money(subtotal)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className={cn(LABEL, "text-muted-foreground")}>
                        Delivery
                      </dt>
                      <dd className="font-mono text-body text-foreground tabular-nums">
                        {costLabel(deliveryPence)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-sans text-body font-medium text-foreground">
                        Total
                      </dt>
                      <dd className="font-mono text-h2 font-medium text-foreground tabular-nums">
                        {money(total)}
                      </dd>
                    </div>
                  </dl>

                  {delivery === "standard" && (
                    <p
                      className={cn(
                        LABEL,
                        "mt-4 text-muted-foreground tabular-nums"
                      )}
                    >
                      {subtotal < FREE_POST_FROM
                        ? `Spend ${money(FREE_POST_FROM - subtotal)} more for free standard post.`
                        : "Standard post is free on this order."}
                    </p>
                  )}

                  <a
                    href="/checkout"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      BUTTON,
                      "mt-6 w-full"
                    )}
                  >
                    Go to checkout
                  </a>
                  <p className={cn(LABEL, "mt-4 text-muted-foreground")}>
                    You pay on the next page.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

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
          <p className={cn(LABEL, "mt-6 text-muted-foreground")}>
            © 2026 {STUDIO}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
