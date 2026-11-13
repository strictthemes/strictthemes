import { useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const NAV_LINK = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const TEXT_LINK = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`

const BUTTON = "h-11 rounded-md px-6 font-mono text-label"
const FIELD = "h-11 rounded-md px-3 text-body md:text-body"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const HELPER = "font-mono text-label text-muted-foreground"

const GOAL = 900
const SMALLEST_SHARE = 5
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const navLinks = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day" },
  { label: "Guestbook", href: "/guestbook" },
]

type GiftState = "free" | "taken" | "mine"
type GiftId =
  | "tablecloth"
  | "bowls"
  | "hamper"
  | "tumblers"
  | "bookshelf"
  | "window-box"

type Gift = {
  id: GiftId
  name: string
  price: number
  note: string
  picture: string
  state: GiftState
}

const initialGifts: Gift[] = [
  {
    id: "tablecloth",
    name: "Linen tablecloth",
    price: 85,
    note: "Long enough for the table Rafe is building: eight places, and room for the jam.",
    picture: "A table laid with a pink linen cloth",
    state: "free",
  },
  {
    id: "bowls",
    name: "Four stoneware bowls",
    price: 60,
    note: "Deep enough for soup, wide enough for pasta.",
    picture: "A stack of four pale blue bowls",
    state: "taken",
  },
  {
    id: "hamper",
    name: "A picnic hamper for two",
    price: 120,
    note: "For Sunday afternoons on the hill behind the village.",
    picture: "A pink picnic hamper with a handle",
    state: "free",
  },
  {
    id: "tumblers",
    name: "Six tumblers",
    price: 48,
    note: "Thick glass that survives the dishwasher and the garden.",
    picture: "Six pale blue tumblers in a row",
    state: "taken",
  },
  {
    id: "bookshelf",
    name: "A bookshelf for the hall",
    price: 210,
    note: "Oak, five shelves, and room at last for Clem's cookbooks.",
    picture: "Five pink books standing on a shelf",
    state: "free",
  },
  {
    id: "window-box",
    name: "A window box of herbs",
    price: 40,
    note: "For the kitchen sill: thyme, mint, sage and chives.",
    picture: "A pink window box with five herbs growing in it",
    state: "free",
  },
]

const bowlWidths = ["w-20", "w-24", "w-28", "w-32"]
const bookHeights = ["h-16", "h-12", "h-14", "h-10", "h-16"]
const herbHeights = ["h-8", "h-12", "h-10", "h-12", "h-8"]
const tumblers = [1, 2, 3, 4, 5, 6]

function Drawing({ id }: { id: GiftId }) {
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
          {bowlWidths.map((width) => (
            <div key={width} className={`h-6 rounded-sm bg-mist ${width}`} />
          ))}
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
          {tumblers.map((n) => (
            <div key={n} className="h-12 w-6 rounded-sm bg-mist" />
          ))}
        </div>
      )
    case "bookshelf":
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-1">
            {bookHeights.map((height, index) => (
              <div key={index} className={`w-4 bg-blush ${height}`} />
            ))}
          </div>
          <div className="h-2 w-36 bg-secondary" />
        </div>
      )
    case "window-box":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-2">
            {herbHeights.map((height, index) => (
              <div key={index} className={`w-4 bg-secondary ${height}`} />
            ))}
          </div>
          <div className="h-8 w-36 rounded-sm bg-candy" />
        </div>
      )
  }
}

type FieldName = "name" | "email" | "amount"
type Errors = Partial<Record<FieldName, string>>
type Thanks = { name: string; email: string; share: number }

const fieldOrder: FieldName[] = ["name", "email", "amount"]

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
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

export function App() {
  const [gifts, setGifts] = useState(initialGifts)
  const [given, setGiven] = useState(540)
  const [guests, setGuests] = useState(14)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [thanks, setThanks] = useState<Thanks | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const freeCount = gifts.filter((gift) => gift.state === "free").length
  const needed = GOAL - given
  const percent = Math.round((given / GOAL) * 100)

  function toggleGift(id: GiftId) {
    setGifts((current) =>
      current.map((gift) => {
        if (gift.id !== id || gift.state === "taken") {
          return gift
        }
        return { ...gift, state: gift.state === "free" ? "mine" : "free" }
      })
    )
  }

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: Errors = {}
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    let cleanAmount = amount.trim()
    if (cleanAmount.startsWith("£")) {
      cleanAmount = cleanAmount.slice(1).trim()
    }

    if (cleanName === "") {
      next.name = "Write your name, so we know who to thank."
    }

    if (cleanEmail === "") {
      next.email = "Write your email address."
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      next.email = "Check the email address: it needs an @ and a domain."
    }

    let share = 0
    if (cleanAmount === "") {
      next.amount = "Write an amount in pounds."
    } else if (!/^\d+$/.test(cleanAmount)) {
      next.amount = "Write a whole number of pounds, like 50."
    } else {
      share = Number(cleanAmount)
      if (share < SMALLEST_SHARE) {
        next.amount = `The smallest share is £${SMALLEST_SHARE}.`
      } else if (share > needed) {
        next.amount = `We only need £${needed} more. Write £${needed} or less.`
      }
    }

    const firstError = fieldOrder.find((field) => next[field])

    if (firstError) {
      // The error lines are in the page before focus lands on the field.
      flushSync(() => {
        setErrors(next)
      })
      const refs = { name: nameRef, email: emailRef, amount: amountRef }
      refs[firstError].current?.focus()
      return
    }

    flushSync(() => {
      setErrors({})
      setGiven(given + share)
      setGuests(guests + 1)
      setThanks({ name: cleanName, email: cleanEmail, share })
    })
    thanksRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.href === "/gifts" ? (
                    <a
                      href={link.href}
                      aria-current="page"
                      className={`${NAV_LINK} underline`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className={NAV_LINK}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
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
              <p className="font-mono text-label">Gift list</p>
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

        <section aria-labelledby="house-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="house-heading" className="text-h2">
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
                  aria-label={gift.picture}
                  className="flex aspect-3/2 items-center justify-center bg-muted"
                >
                  <Drawing id={gift.id} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-h2">{gift.name}</h3>
                  <p className="text-body">{gift.note}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-label text-foreground tabular-nums">
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
                      className={`${BUTTON} mt-auto w-full`}
                      aria-label={`${
                        gift.state === "mine"
                          ? "Cancel my reservation"
                          : "Reserve this gift"
                      }: ${gift.name}`}
                      onClick={() => toggleGift(gift.id)}
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
                bicycles with baskets. Any share helps, and every pound goes
                to the bicycles.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="font-heading text-h1 tabular-nums">£{given}</p>
                <p className="font-mono text-label tabular-nums">of £{GOAL}</p>
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

          <div className="rounded-xl border border-border bg-card p-6 md:col-span-5">
            {!thanks && (
              <form
                noValidate
                aria-label="Add to the bicycles"
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="share-name" className={FIELD_LABEL}>
                    Your name
                  </label>
                  <Input
                    ref={nameRef}
                    id="share-name"
                    name="name"
                    autoComplete="name"
                    className={FIELD}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={
                      errors.name ? "share-name-error" : undefined
                    }
                  />
                  {errors.name && (
                    <ErrorLine id="share-name-error">{errors.name}</ErrorLine>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="share-email" className={FIELD_LABEL}>
                    Email address
                  </label>
                  <Input
                    ref={emailRef}
                    id="share-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={FIELD}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearError("email")
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email
                        ? "share-email-help share-email-error"
                        : "share-email-help"
                    }
                  />
                  <p id="share-email-help" className={HELPER}>
                    We write once, with how to send your share.
                  </p>
                  {errors.email && (
                    <ErrorLine id="share-email-error">{errors.email}</ErrorLine>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="share-amount" className={FIELD_LABEL}>
                    Your share in pounds
                  </label>
                  <Input
                    ref={amountRef}
                    id="share-amount"
                    name="amount"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    className={FIELD}
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value)
                      clearError("amount")
                    }}
                    aria-invalid={errors.amount ? true : undefined}
                    aria-describedby={
                      errors.amount
                        ? "share-amount-help share-amount-error"
                        : "share-amount-help"
                    }
                  />
                  <p id="share-amount-help" className={HELPER}>
                    From £{SMALLEST_SHARE} to £{needed}, what is still needed
                  </p>
                  {errors.amount && (
                    <ErrorLine id="share-amount-error">
                      {errors.amount}
                    </ErrorLine>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`${BUTTON} w-full md:w-auto md:self-start`}
                >
                  Add my share
                </Button>
              </form>
            )}
            <div role="status">
              {thanks && (
                <div className="flex flex-col gap-3">
                  <h3
                    ref={thanksRef}
                    tabIndex={-1}
                    className="text-h2 text-foreground focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                  >
                    Thank you, {thanks.name}
                  </h3>
                  <p className="text-body text-foreground">
                    We have noted £{thanks.share} toward the bicycles, and we
                    will write to {thanks.email} with how to send it.
                  </p>
                </div>
              )}
            </div>
          </div>
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
              Anything handmade, grown or written makes us just as happy.
              There is a table for cards and parcels by the barn door.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1088px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-h2">Clem &amp; Rafe</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a
                href="mailto:hello@clemandrafe.example"
                className={TEXT_LINK}
              >
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
