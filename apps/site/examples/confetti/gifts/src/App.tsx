import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type GiftState = "free" | "taken" | "mine"

type Gift = {
  id: string
  name: string
  price: number
  note: string
  state: GiftState
}

const initialGifts: Gift[] = [
  {
    id: "tablecloth",
    name: "Linen tablecloth",
    price: 85,
    note: "Long enough for the table Rafe is building: eight places, and room for the jam.",
    state: "free",
  },
  {
    id: "bowls",
    name: "Four stoneware bowls",
    price: 60,
    note: "Deep enough for soup, wide enough for pasta.",
    state: "taken",
  },
  {
    id: "hamper",
    name: "A picnic hamper for two",
    price: 120,
    note: "For Sunday afternoons on the hill behind the village.",
    state: "free",
  },
  {
    id: "tumblers",
    name: "Six tumblers",
    price: 48,
    note: "Thick glass that survives the dishwasher and the garden.",
    state: "taken",
  },
  {
    id: "bookshelf",
    name: "A bookshelf for the hall",
    price: 210,
    note: "Oak, five shelves, and room at last for Clem's cookbooks.",
    state: "free",
  },
  {
    id: "windowbox",
    name: "A window box of herbs",
    price: 40,
    note: "For the kitchen sill: thyme, mint, sage and chives.",
    state: "free",
  },
]

const pictureLabels: Record<string, string> = {
  tablecloth: "A table laid with a pink linen cloth",
  bowls: "A stack of four pale blue bowls",
  hamper: "A pink picnic hamper with a handle",
  tumblers: "Six pale blue tumblers in a row",
  bookshelf: "Five pink books standing on a shelf",
  windowbox: "A pink window box with five herbs growing in it",
}

const GOAL = 900
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 hover:underline transition-colors duration-150 ${focusOutline}`
const textLink = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusOutline}`
const buttonClasses = "h-11 rounded-md px-6 font-mono text-label"

function Drawing({ id }: { id: string }) {
  switch (id) {
    case "tablecloth":
      return (
        <div className="flex flex-col items-center">
          <div className="h-16 w-40 rounded-sm bg-blush" />
          <div className="flex w-36 justify-between">
            <div className="h-10 w-2 bg-secondary" />
            <div className="h-10 w-2 bg-secondary" />
          </div>
        </div>
      )
    case "bowls":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-20 rounded-sm bg-mist" />
          <div className="h-6 w-24 rounded-sm bg-mist" />
          <div className="h-6 w-28 rounded-sm bg-mist" />
          <div className="h-6 w-32 rounded-sm bg-mist" />
        </div>
      )
    case "hamper":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="h-2 w-16 bg-secondary" />
          <div className="h-16 w-32 rounded-md bg-candy" />
        </div>
      )
    case "tumblers":
      return (
        <div className="flex items-end gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-12 w-6 rounded-sm bg-mist" />
          ))}
        </div>
      )
    case "bookshelf":
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-1">
            {["h-16", "h-12", "h-14", "h-10", "h-16"].map((h, i) => (
              <div key={i} className={`${h} w-4 bg-blush`} />
            ))}
          </div>
          <div className="h-2 w-36 bg-secondary" />
        </div>
      )
    case "windowbox":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-2">
            {["h-8", "h-12", "h-10", "h-12", "h-8"].map((h, i) => (
              <div key={i} className={`${h} w-4 bg-secondary`} />
            ))}
          </div>
          <div className="h-8 w-36 rounded-sm bg-candy" />
        </div>
      )
    default:
      return null
  }
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

type FieldName = "name" | "email" | "amount"
type Errors = Partial<Record<FieldName, string>>
type Confirmation = { name: string; email: string; amount: number }

function ShareForm({
  remaining,
  onShare,
}: {
  remaining: number
  onShare: (amount: number) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [focusTarget, setFocusTarget] = useState<{ field: FieldName } | null>(
    null
  )
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!focusTarget) return
    const refs = { name: nameRef, email: emailRef, amount: amountRef }
    refs[focusTarget.field].current?.focus()
  }, [focusTarget])

  useEffect(() => {
    if (confirmation) thanksRef.current?.focus()
  }, [confirmation])

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}

    const trimmedName = name.trim()
    if (!trimmedName) next.name = "Write your name, so we know who to thank."

    const trimmedEmail = email.trim()
    if (!trimmedEmail) next.email = "Write your email address."
    else if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Check the email address: it needs an @ and a domain."

    let pounds = 0
    let rawAmount = amount.trim()
    if (rawAmount.startsWith("£")) rawAmount = rawAmount.slice(1).trim()
    if (!rawAmount) next.amount = "Write an amount in pounds."
    else if (!/^\d+$/.test(rawAmount))
      next.amount = "Write a whole number of pounds, like 50."
    else {
      pounds = parseInt(rawAmount, 10)
      if (pounds < 5) next.amount = "The smallest share is £5."
      else if (pounds > remaining)
        next.amount = `We only need £${remaining} more. Write £${remaining} or less.`
    }

    setErrors(next)
    const firstError = (["name", "email", "amount"] as const).find(
      (field) => next[field]
    )
    if (firstError) {
      setFocusTarget({ field: firstError })
      return
    }

    onShare(pounds)
    setConfirmation({ name: trimmedName, email: trimmedEmail, amount: pounds })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:col-span-5">
      {!confirmation && (
        <form
          noValidate
          aria-label="Add to the bicycles"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="share-name" className="block font-mono text-label">
              Your name
            </label>
            <Input
              ref={nameRef}
              id="share-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError("name")
              }}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "share-name-error" : undefined}
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            {errors.name && (
              <FieldError id="share-name-error">{errors.name}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="share-email" className="block font-mono text-label">
              Email address
            </label>
            <Input
              ref={emailRef}
              id="share-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                errors.email
                  ? "share-email-help share-email-error"
                  : "share-email-help"
              }
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p
              id="share-email-help"
              className="font-mono text-label text-muted-foreground"
            >
              We write once, with how to send your share.
            </p>
            {errors.email && (
              <FieldError id="share-email-error">{errors.email}</FieldError>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="share-amount"
              className="block font-mono text-label"
            >
              Your share in pounds
            </label>
            <Input
              ref={amountRef}
              id="share-amount"
              name="amount"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                clearError("amount")
              }}
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={
                errors.amount
                  ? "share-amount-help share-amount-error"
                  : "share-amount-help"
              }
              className="h-11 rounded-md px-3 text-body md:text-body"
            />
            <p
              id="share-amount-help"
              className="font-mono text-label text-muted-foreground tabular-nums"
            >
              From £5 to £{remaining}, what is still needed
            </p>
            {errors.amount && (
              <FieldError id="share-amount-error">{errors.amount}</FieldError>
            )}
          </div>

          <Button
            type="submit"
            className={`${buttonClasses} w-full md:w-auto md:self-start`}
          >
            Add my share
          </Button>
        </form>
      )}

      <div role="status">
        {confirmation && (
          <div className="flex flex-col gap-3">
            <h3
              ref={thanksRef}
              tabIndex={-1}
              className={`text-h2 wrap-break-word ${codeFocusOutline}`}
            >
              Thank you, {confirmation.name}
            </h3>
            <p className="wrap-break-word">
              We have noted £{confirmation.amount} toward the bicycles, and we
              will write to {confirmation.email} with how to send it.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts)
  const [given, setGiven] = useState(540)
  const [guests, setGuests] = useState(14)

  const freeCount = gifts.filter((g) => g.state === "free").length
  const remaining = GOAL - given
  const percent = Math.round((given / GOAL) * 100)

  function toggleGift(id: string) {
    setGifts((current) =>
      current.map((g) => {
        if (g.id !== id || g.state === "taken") return g
        return { ...g, state: g.state === "free" ? "mine" : "free" }
      })
    )
  }

  function addShare(pounds: number) {
    setGiven((g) => g + pounds)
    setGuests((n) => n + 1)
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150 ${focusOutline}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <a href="/rsvp" className={navLink}>
                  Reply
                </a>
              </li>
              <li>
                <a
                  href="/gifts"
                  aria-current="page"
                  className={`${navLink} underline`}
                >
                  Gifts
                </a>
              </li>
              <li>
                <a href="/day" className={navLink}>
                  The day
                </a>
              </li>
              <li>
                <a href="/guestbook" className={navLink}>
                  Guestbook
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1088px] flex-col gap-22 px-6 pt-10 pb-22">
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-candy p-6 text-candy-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label tabular-nums">
                Gift list ·{" "}
                <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
                Little Saltry
              </p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                A few things for our home
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Coming is the gift. If you would like to bring something too,
              here are a few things for our first home in Little Saltry.
              Reserve one, and it shows as taken for everyone else.
            </p>
          </div>
        </section>

        <section aria-labelledby="gifts-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="gifts-heading" className="text-h2">
              Things for the house
            </h2>
            <p
              role="status"
              className="font-mono text-label text-muted-foreground tabular-nums"
            >
              {freeCount} of {gifts.length} gifts still free
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {gifts.map((gift) => (
              <li
                key={gift.id}
                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card md:col-span-6 lg:col-span-4"
              >
                <div
                  role="img"
                  aria-label={pictureLabels[gift.id]}
                  className="flex aspect-3/2 items-center justify-center bg-muted"
                >
                  <Drawing id={gift.id} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-h2">{gift.name}</h3>
                  <p className="text-body">{gift.note}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-label tabular-nums">
                      £{gift.price}
                    </p>
                    {gift.state !== "free" && (
                      <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                        Reserved
                      </Badge>
                    )}
                  </div>
                  {gift.state === "taken" ? (
                    <p className="mt-auto flex h-11 items-center font-mono text-label text-muted-foreground">
                      Another guest has this one
                    </p>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => toggleGift(gift.id)}
                      aria-label={
                        gift.state === "mine"
                          ? `Cancel my reservation: ${gift.name}`
                          : `Reserve this gift: ${gift.name}`
                      }
                      className={`${buttonClasses} mt-auto w-full`}
                    >
                      {gift.state === "mine"
                        ? "Cancel my reservation"
                        : "Reserve this gift"}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="bicycles-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:col-span-7 md:p-10">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-label">One bigger gift</p>
                <h2 id="bicycles-heading" className="text-h2">
                  Two bicycles for the lanes
                </h2>
              </div>
              <p className="max-w-xl text-body">
                We would like to ride the lanes around Little Saltry on two
                bicycles with baskets. Any share helps, and every pound goes to
                the bicycles.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="font-heading text-h1 tabular-nums">£{given}</p>
                <p className="font-mono text-label tabular-nums">
                  of £{GOAL}
                </p>
              </div>
              <div
                aria-hidden="true"
                className="h-6 w-full overflow-hidden rounded-sm border border-mist-foreground"
              >
                <div
                  className="h-full bg-mist-foreground"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="font-mono text-label tabular-nums">
                {guests} {guests === 1 ? "guest" : "guests"} so far · {percent}%
              </p>
            </div>
          </div>

          <ShareForm remaining={remaining} onShare={addShare} />
        </section>

        <section
          aria-labelledby="else-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="else-heading" className="text-h2">
              Something else in mind?
            </h2>
            <p className="max-w-xl text-body">
              Anything handmade, grown or written makes us just as happy. There
              is a table for cards and parcels by the barn door.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1088px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-h2">Clem &amp; Rafe</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground tabular-nums">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label wrap-break-word text-muted-foreground">
              Questions:{" "}
              <a href="mailto:hello@clemandrafe.example" className={textLink}>
                hello@clemandrafe.example
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
