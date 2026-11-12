import { useEffect, useRef, useState, type ReactNode } from "react"
import { CircleCheck, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const STUDIO = "Whitlow Pottery"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const quietLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonText = "h-auto px-4 py-2 font-mono text-label"

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})
const formatPence = (pence: number) => money.format(pence / 100)

const FREE_POST_FROM = 10000
const NOTE_MAX = 300

type Shape = "tall" | "bowl" | "plate"
type Glaze = "Ash" | "Oat" | "Iron" | "Slate"

type Line = {
  id: string
  name: string
  kind: string
  shape: Shape
  glaze: Glaze
  href: string
  unitPence: number
  quantity: number
  stock: number
}

const INITIAL_LINES: Line[] = [
  {
    id: "moor-mug",
    name: "Moor mug",
    kind: "mug",
    shape: "tall",
    glaze: "Ash",
    href: "/tableware/moor-mug",
    unitPence: 2800,
    quantity: 2,
    stock: 8,
  },
  {
    id: "fold-bowl",
    name: "Fold bowl",
    kind: "bowl",
    shape: "bowl",
    glaze: "Iron",
    href: "/tableware/fold-bowl",
    unitPence: 3400,
    quantity: 1,
    stock: 6,
  },
]

type DeliveryId = "standard" | "tracked" | "collect"

const DELIVERY_OPTIONS: { id: DeliveryId; name: string }[] = [
  { id: "standard", name: "Standard post" },
  { id: "tracked", name: "Tracked" },
  { id: "collect", name: "Collect from the studio" },
]

function deliveryPence(id: DeliveryId, subtotal: number) {
  if (id === "standard") return subtotal >= FREE_POST_FROM ? 0 : 550
  if (id === "tracked") return 950
  return 0
}

const priceOrFree = (pence: number) =>
  pence === 0 ? "Free" : formatPence(pence)

function piecesText(count: number) {
  if (count === 0) return "No pieces"
  return count === 1 ? "1 piece" : `${count} pieces`
}

const SHAPE_SIZE: Record<Shape, string> = {
  tall: "h-1/2 w-2/5",
  bowl: "h-1/4 w-3/5",
  plate: "h-1/6 w-3/4",
}
const isPale = (glaze: Glaze) => glaze === "Ash" || glaze === "Oat"

const NAV_LINKS = [
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

function Time({ value }: { value: string }) {
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {value}
    </time>
  )
}

function SiteHeader({ count }: { count: number }) {
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

  const basketLabel =
    count === 0
      ? "Basket, empty"
      : `Basket, ${count} ${count === 1 ? "piece" : "pieces"}`

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:gap-x-6 md:px-6">
        <a href="/" className={cn("font-heading text-h2", quietLink)}>
          {STUDIO}
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={quietLink}>
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
            aria-current="page"
            aria-label={basketLabel}
            className={cn(
              "inline-flex items-center gap-2 underline",
              quietLink
            )}
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
        id="small-screen-menu"
        aria-label="Main"
        className="border-t md:hidden"
        hidden={!menuOpen}
      >
        <ul className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={cn("block py-2", quietLink)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
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
              {FOOTER_LINKS.map((link) => (
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

function PiecePicture({ line }: { line: Line }) {
  return (
    <div
      role="img"
      aria-label={`${line.name} in ${line.glaze.toLowerCase()} glaze`}
      className="flex size-20 shrink-0 items-center justify-center rounded-xl border bg-muted"
    >
      <div
        className={cn(
          "border border-foreground/40",
          SHAPE_SIZE[line.shape],
          isPale(line.glaze) ? "bg-glaze-pale" : "bg-glaze-dark"
        )}
      />
    </div>
  )
}

type FocusTarget = { kind: "line"; id: string } | { kind: "empty" } | null

export function App() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES)
  const [delivery, setDelivery] = useState<DeliveryId>("standard")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const focusTarget = useRef<FocusTarget>(null)

  const nameLinks = useRef(new Map<string, HTMLAnchorElement>())
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null)

  // After a line is removed, move focus once the new list has rendered.
  useEffect(() => {
    const target = focusTarget.current
    if (!target) return
    focusTarget.current = null
    if (target.kind === "empty") emptyHeadingRef.current?.focus()
    else nameLinks.current.get(target.id)?.focus()
  }, [lines])

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPence * line.quantity,
    0
  )
  const deliveryCost = deliveryPence(delivery, subtotal)
  const total = subtotal + deliveryCost
  const noteLeft = NOTE_MAX - note.length

  function changeQuantity(id: string, step: number) {
    setLines((current) =>
      current.map((line) =>
        line.id === id
          ? {
              ...line,
              quantity: Math.min(line.stock, Math.max(1, line.quantity + step)),
            }
          : line
      )
    )
  }

  function removeLine(id: string) {
    const index = lines.findIndex((line) => line.id === id)
    if (index === -1) return
    const removed = lines[index]
    const rest = lines.filter((line) => line.id !== id)
    setLines(rest)
    setMessage(`${removed.name} removed from your basket.`)
    focusTarget.current =
      rest.length === 0
        ? { kind: "empty" }
        : { kind: "line", id: rest[Math.min(index, rest.length - 1)].id }
  }

  const deliveryHelp: Record<DeliveryId, ReactNode> = {
    standard: "Arrives in 3 to 5 working days.",
    tracked: (
      <>
        Order by <Time value="13:00" /> for the next working day.
      </>
    ),
    collect: (
      <>
        Collect from Unit 3, Coldharbour Yard, Thursday to Saturday,{" "}
        <Time value="10:00" /> to <Time value="16:00" />.
      </>
    ),
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader count={count} />

      <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-20 px-4 pt-10 pb-20 md:px-6">
        <section aria-labelledby="basket-title">
          <h1 id="basket-title" className="text-h1">
            Your basket
          </h1>
          <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
            {piecesText(count)}
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
                  ref={emptyHeadingRef}
                  tabIndex={-1}
                  className={cn("text-h2", codeFocusRing)}
                >
                  Your basket is empty
                </h2>
                <p className="mt-4 max-w-lg">
                  The next firing comes out of the kiln in early December, with
                  new mugs, bowls and vases.
                </p>
                <a
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    buttonText,
                    "mt-6"
                  )}
                >
                  Back to the shop
                </a>
              </div>
            ) : (
              <>
                <div className="md:col-span-7">
                  <h2 className="sr-only">Pieces in your basket</h2>
                  <ul>
                    {lines.map((line) => (
                      <li key={line.id} className="border-t py-6 last:border-b">
                        <div className="flex gap-4">
                          <PiecePicture line={line} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <h3 className="font-sans text-body font-medium">
                                <a
                                  href={line.href}
                                  ref={(el) => {
                                    if (el) nameLinks.current.set(line.id, el)
                                    else nameLinks.current.delete(line.id)
                                  }}
                                  className={quietLink}
                                >
                                  {line.name}
                                </a>
                              </h3>
                              <p className="font-mono tabular-nums">
                                {formatPence(line.unitPence * line.quantity)}
                              </p>
                            </div>
                            <p className="mt-1 font-mono text-label text-muted-foreground">
                              {line.glaze} glaze ·{" "}
                              <span className="tabular-nums">
                                {formatPence(line.unitPence)}
                              </span>{" "}
                              each
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
                                className={buttonText}
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
                      className="mt-2 h-auto min-h-24 px-4 py-2 text-body md:text-body"
                      maxLength={NOTE_MAX}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      aria-describedby="studio-note-help"
                    />
                    <p
                      id="studio-note-help"
                      className="mt-2 font-mono text-label text-muted-foreground"
                    >
                      A gift message, or where to leave the parcel.{" "}
                      <span className="tabular-nums">{noteLeft} left</span>
                    </p>
                  </div>
                </div>

                <div className="mt-10 rounded-xl border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0">
                  <h2 className="text-h2">Summary</h2>

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
                    {DELIVERY_OPTIONS.map((option) => {
                      const chosen = option.id === delivery
                      return (
                        <Button
                          key={option.id}
                          variant={chosen ? "secondary" : "outline"}
                          aria-pressed={chosen}
                          className={cn(
                            buttonText,
                            "w-full justify-between text-left whitespace-normal"
                          )}
                          onClick={() => setDelivery(option.id)}
                        >
                          <span>{option.name}</span>
                          <span className="tabular-nums">
                            {priceOrFree(deliveryPence(option.id, subtotal))}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                  <p className="mt-2 font-mono text-label text-muted-foreground">
                    {deliveryHelp[delivery]}
                  </p>

                  <dl className="mt-6">
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-mono text-label text-muted-foreground">
                        Subtotal
                      </dt>
                      <dd className="font-mono tabular-nums">
                        {formatPence(subtotal)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-mono text-label text-muted-foreground">
                        Delivery
                      </dt>
                      <dd className="font-mono tabular-nums">
                        {priceOrFree(deliveryCost)}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-t py-2">
                      <dt className="font-sans text-body font-medium text-foreground">
                        Total
                      </dt>
                      <dd className="font-mono text-h2 font-medium tabular-nums">
                        {formatPence(total)}
                      </dd>
                    </div>
                  </dl>

                  {delivery === "standard" && (
                    <p className="mt-4 font-mono text-label text-muted-foreground">
                      {subtotal < FREE_POST_FROM ? (
                        <>
                          Spend{" "}
                          <span className="tabular-nums">
                            {formatPence(FREE_POST_FROM - subtotal)}
                          </span>{" "}
                          more for free standard post.
                        </>
                      ) : (
                        "Standard post is free on this order."
                      )}
                    </p>
                  )}

                  <a
                    href="/checkout"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      buttonText,
                      "mt-6 w-full"
                    )}
                  >
                    Go to checkout
                  </a>
                  <p className="mt-4 font-mono text-label text-muted-foreground">
                    You pay on the next page.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
