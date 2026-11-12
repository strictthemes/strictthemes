import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const GOAL = 900
const FOCUS_OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS_OUTLINE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const NAV_LINK = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 hover:underline transition-colors duration-150 ${FOCUS_OUTLINE}`
const TEXT_LINK = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${FOCUS_OUTLINE}`
const BUTTON_CLASSES = "h-11 rounded-md px-6 font-mono text-label"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type GiftState = "free" | "taken" | "mine"

type Gift = {
  id: string
  name: string
  price: number
  note: string
  state: GiftState
  pictureLabel: string
  picture: ReactNode
}

const INITIAL_GIFTS: Gift[] = [
  {
    id: "tablecloth",
    name: "Linen tablecloth",
    price: 85,
    note: "Long enough for the table Rafe is building: eight places, and room for the jam.",
    state: "free",
    pictureLabel: "A table laid with a pink linen cloth",
    picture: (
      <div className="flex flex-col items-center">
        <div className="h-16 w-40 rounded-sm bg-blush" />
        <div className="flex w-36 justify-between">
          <div className="h-10 w-2 bg-secondary" />
          <div className="h-10 w-2 bg-secondary" />
        </div>
      </div>
    ),
  },
  {
    id: "bowls",
    name: "Four stoneware bowls",
    price: 60,
    note: "Deep enough for soup, wide enough for pasta.",
    state: "taken",
    pictureLabel: "A stack of four pale blue bowls",
    picture: (
      <div className="flex flex-col items-center gap-1">
        <div className="h-6 w-20 rounded-sm bg-mist" />
        <div className="h-6 w-24 rounded-sm bg-mist" />
        <div className="h-6 w-28 rounded-sm bg-mist" />
        <div className="h-6 w-32 rounded-sm bg-mist" />
      </div>
    ),
  },
  {
    id: "hamper",
    name: "A picnic hamper for two",
    price: 120,
    note: "For Sunday afternoons on the hill behind the village.",
    state: "free",
    pictureLabel: "A pink picnic hamper with a handle",
    picture: (
      <div className="flex flex-col items-center gap-1">
        <div className="h-2 w-16 bg-secondary" />
        <div className="h-16 w-32 rounded-md bg-candy" />
      </div>
    ),
  },
  {
    id: "tumblers",
    name: "Six tumblers",
    price: 48,
    note: "Thick glass that survives the dishwasher and the garden.",
    state: "taken",
    pictureLabel: "Six pale blue tumblers in a row",
    picture: (
      <div className="flex items-end gap-2">
        <div className="h-12 w-6 rounded-sm bg-mist" />
        <div className="h-12 w-6 rounded-sm bg-mist" />
        <div className="h-12 w-6 rounded-sm bg-mist" />
        <div className="h-12 w-6 rounded-sm bg-mist" />
        <div className="h-12 w-6 rounded-sm bg-mist" />
        <div className="h-12 w-6 rounded-sm bg-mist" />
      </div>
    ),
  },
  {
    id: "bookshelf",
    name: "A bookshelf for the hall",
    price: 210,
    note: "Oak, five shelves, and room at last for Clem's cookbooks.",
    state: "free",
    pictureLabel: "Five pink books standing on a shelf",
    picture: (
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-1">
          <div className="h-16 w-4 bg-blush" />
          <div className="h-12 w-4 bg-blush" />
          <div className="h-14 w-4 bg-blush" />
          <div className="h-10 w-4 bg-blush" />
          <div className="h-16 w-4 bg-blush" />
        </div>
        <div className="h-2 w-36 bg-secondary" />
      </div>
    ),
  },
  {
    id: "window-box",
    name: "A window box of herbs",
    price: 40,
    note: "For the kitchen sill: thyme, mint, sage and chives.",
    state: "free",
    pictureLabel: "A pink window box with five herbs growing in it",
    picture: (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-end gap-2">
          <div className="h-8 w-4 bg-secondary" />
          <div className="h-12 w-4 bg-secondary" />
          <div className="h-10 w-4 bg-secondary" />
          <div className="h-12 w-4 bg-secondary" />
          <div className="h-8 w-4 bg-secondary" />
        </div>
        <div className="h-8 w-36 rounded-sm bg-candy" />
      </div>
    ),
  },
]

type FieldName = "name" | "email" | "amount"
type Errors = Partial<Record<FieldName, string>>
type Confirmation = { name: string; amount: number; email: string }

const FIELD_ORDER: FieldName[] = ["name", "email", "amount"]

function FieldError({ id, message }: { id: string; message: string }) {
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
      <span>{message}</span>
    </p>
  )
}

export function App() {
  const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS)
  const [given, setGiven] = useState(540)
  const [guests, setGuests] = useState(14)

  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    amount: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitCount, setSubmitCount] = useState(0)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const freeCount = gifts.filter((gift) => gift.state === "free").length
  const needed = GOAL - given
  const percent = Math.round((given / GOAL) * 100)

  // After a send with errors, move focus to the first field with an error,
  // once its error line is in the page.
  useEffect(() => {
    if (submitCount === 0) return
    const first = FIELD_ORDER.find((field) => errors[field])
    if (first)
      ({ name: nameRef, email: emailRef, amount: amountRef })[
        first
      ].current?.focus()
    // Runs only after each send.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  useEffect(() => {
    if (confirmation) thanksRef.current?.focus()
  }, [confirmation])

  function toggleGift(id: string) {
    setGifts((current) =>
      current.map((gift) => {
        if (gift.id !== id || gift.state === "taken") return gift
        return { ...gift, state: gift.state === "free" ? "mine" : "free" }
      })
    )
  }

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}

    const name = values.name.trim()
    if (!name) next.name = "Write your name, so we know who to thank."

    const email = values.email.trim()
    if (!email) next.email = "Write your email address."
    else if (!EMAIL_PATTERN.test(email))
      next.email = "Check the email address: it needs an @ and a domain."

    let amountText = values.amount.trim()
    if (amountText.startsWith("£")) amountText = amountText.slice(1).trim()
    const amount = Number(amountText)
    if (!amountText) next.amount = "Write an amount in pounds."
    else if (!/^\d+$/.test(amountText))
      next.amount = "Write a whole number of pounds, like 50."
    else if (amount < 5) next.amount = "The smallest share is £5."
    else if (amount > needed)
      next.amount = `We only need £${needed} more. Write £${needed} or less.`

    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSubmitCount((count) => count + 1)
      return
    }

    setGiven((current) => current + amount)
    setGuests((current) => current + 1)
    setConfirmation({ name, amount, email })
  }

  function describedBy(field: FieldName, helperId?: string) {
    const ids = [helperId, errors[field] ? `${field}-error` : undefined].filter(
      Boolean
    )
    return ids.length > 0 ? ids.join(" ") : undefined
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS_OUTLINE}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              <li>
                <a href="/rsvp" className={NAV_LINK}>
                  Reply
                </a>
              </li>
              <li>
                <a
                  href="/gifts"
                  aria-current="page"
                  className={`${NAV_LINK} underline`}
                >
                  Gifts
                </a>
              </li>
              <li>
                <a href="/day" className={NAV_LINK}>
                  The day
                </a>
              </li>
              <li>
                <a href="/guestbook" className={NAV_LINK}>
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
              <p className="font-mono text-label">Gift list</p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                A few things for our home
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Coming is the gift. If you would like to bring something too, here
              are a few things for our first home in Little Saltry. Reserve one,
              and it shows as taken for everyone else.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="gifts-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2 id="gifts-heading" className="text-h2">
              Things for the house
            </h2>
            <p
              role="status"
              className="font-mono text-label text-muted-foreground tabular-nums"
            >
              {freeCount} of {gifts.length}{" "}
              {gifts.length === 1 ? "gift" : "gifts"} still free
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
                  aria-label={gift.pictureLabel}
                  className="flex aspect-3/2 items-center justify-center bg-muted"
                >
                  {gift.picture}
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
                      className={`mt-auto w-full ${BUTTON_CLASSES}`}
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
              <p className="text-body">
                We would like to ride the lanes around Little Saltry on two
                bicycles with baskets. Any share helps, and every pound goes to
                the bicycles.
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
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <p className="font-mono text-label tabular-nums">
                {guests} {guests === 1 ? "guest" : "guests"} so far · {percent}%
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 md:col-span-5">
            {!confirmation && (
              <form
                noValidate
                aria-label="Add to the bicycles"
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="share-name"
                    className="block font-mono text-label text-foreground"
                  >
                    Your name
                  </label>
                  <Input
                    ref={nameRef}
                    id="share-name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                    className="h-11 rounded-md px-3 text-body md:text-body"
                  />
                  {errors.name && (
                    <FieldError id="name-error" message={errors.name} />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="share-email"
                    className="block font-mono text-label text-foreground"
                  >
                    Email address
                  </label>
                  <Input
                    ref={emailRef}
                    id="share-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy("email", "email-help")}
                    className="h-11 rounded-md px-3 text-body md:text-body"
                  />
                  <p
                    id="email-help"
                    className="font-mono text-label text-muted-foreground"
                  >
                    We write once, with how to send your share.
                  </p>
                  {errors.email && (
                    <FieldError id="email-error" message={errors.email} />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="share-amount"
                    className="block font-mono text-label text-foreground"
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
                    value={values.amount}
                    onChange={(event) =>
                      updateField("amount", event.target.value)
                    }
                    aria-invalid={errors.amount ? true : undefined}
                    aria-describedby={describedBy("amount", "amount-help")}
                    className="h-11 rounded-md px-3 text-body md:text-body"
                  />
                  <p
                    id="amount-help"
                    className="font-mono text-label text-muted-foreground tabular-nums"
                  >
                    From £5 to £{needed}, what is still needed
                  </p>
                  {errors.amount && (
                    <FieldError id="amount-error" message={errors.amount} />
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full md:w-auto md:self-start ${BUTTON_CLASSES}`}
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
                    className={`text-h2 text-foreground ${CODE_FOCUS_OUTLINE}`}
                  >
                    Thank you, {confirmation.name}
                  </h3>
                  <p className="text-body text-foreground">
                    We have noted £{confirmation.amount} toward the bicycles,
                    and we will write to {confirmation.email} with how to send
                    it.
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
            <p className="font-mono text-label text-muted-foreground">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a href="mailto:hello@clemandrafe.example" className={TEXT_LINK}>
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
