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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const linkFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocus =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 hover:underline transition-colors duration-150 ${linkFocus}`
const textLink = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${linkFocus}`
const buttonClasses = "h-11 rounded-md px-6 font-mono text-label"
const inputClasses = "h-11 rounded-md px-3 text-body md:text-body"

type GiftState = "free" | "taken" | "mine"

type Gift = {
  id: string
  name: string
  price: number
  note: string
  state: GiftState
  picture: { label: string; drawing: ReactNode }
}

const initialGifts: Gift[] = [
  {
    id: "tablecloth",
    name: "Linen tablecloth",
    price: 85,
    note: "Long enough for the table Rafe is building: eight places, and room for the jam.",
    state: "free",
    picture: {
      label: "A table laid with a pink linen cloth",
      drawing: (
        <div className="flex flex-col items-center">
          <div className="h-16 w-40 rounded-sm bg-blush" />
          <div className="flex w-36 justify-between">
            <div className="h-10 w-2 bg-secondary" />
            <div className="h-10 w-2 bg-secondary" />
          </div>
        </div>
      ),
    },
  },
  {
    id: "bowls",
    name: "Four stoneware bowls",
    price: 60,
    note: "Deep enough for soup, wide enough for pasta.",
    state: "taken",
    picture: {
      label: "A stack of four pale blue bowls",
      drawing: (
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-20 rounded-sm bg-mist" />
          <div className="h-6 w-24 rounded-sm bg-mist" />
          <div className="h-6 w-28 rounded-sm bg-mist" />
          <div className="h-6 w-32 rounded-sm bg-mist" />
        </div>
      ),
    },
  },
  {
    id: "hamper",
    name: "A picnic hamper for two",
    price: 120,
    note: "For Sunday afternoons on the hill behind the village.",
    state: "free",
    picture: {
      label: "A pink picnic hamper with a handle",
      drawing: (
        <div className="flex flex-col items-center gap-1">
          <div className="h-2 w-16 bg-secondary" />
          <div className="h-16 w-32 rounded-md bg-candy" />
        </div>
      ),
    },
  },
  {
    id: "tumblers",
    name: "Six tumblers",
    price: 48,
    note: "Thick glass that survives the dishwasher and the garden.",
    state: "taken",
    picture: {
      label: "Six pale blue tumblers in a row",
      drawing: (
        <div className="flex items-end gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-12 w-6 rounded-sm bg-mist" />
          ))}
        </div>
      ),
    },
  },
  {
    id: "bookshelf",
    name: "A bookshelf for the hall",
    price: 210,
    note: "Oak, five shelves, and room at last for Clem's cookbooks.",
    state: "free",
    picture: {
      label: "Five pink books standing on a shelf",
      drawing: (
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
  },
  {
    id: "window-box",
    name: "A window box of herbs",
    price: 40,
    note: "For the kitchen sill: thyme, mint, sage and chives.",
    state: "free",
    picture: {
      label: "A pink window box with five herbs growing in it",
      drawing: (
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
  },
]

type Field = "name" | "email" | "amount"
type Errors = Partial<Record<Field, string>>

function ErrorLine({ id, message }: { id: string; message: string }) {
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

function describedBy(...ids: (string | false | undefined)[]) {
  const list = ids.filter(Boolean).join(" ")
  return list || undefined
}

export function App() {
  const [gifts, setGifts] = useState(initialGifts)
  const [given, setGiven] = useState(540)
  const [guests, setGuests] = useState(14)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [focusTarget, setFocusTarget] = useState<{ field: Field } | null>(null)
  const [thanks, setThanks] = useState<{
    name: string
    email: string
    amount: number
  } | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const needed = GOAL - given
  const percent = Math.round((given / GOAL) * 100)
  const freeCount = gifts.filter((gift) => gift.state === "free").length

  useEffect(() => {
    if (!focusTarget) return
    const refs = { name: nameRef, email: emailRef, amount: amountRef }
    refs[focusTarget.field].current?.focus()
  }, [focusTarget])

  useEffect(() => {
    if (thanks) thanksRef.current?.focus()
  }, [thanks])

  function toggleGift(id: string) {
    setGifts((list) =>
      list.map((gift) => {
        if (gift.id !== id || gift.state === "taken") return gift
        return { ...gift, state: gift.state === "free" ? "mine" : "free" }
      })
    )
  }

  function clearError(field: Field) {
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

    let share = 0
    let figure = amount.trim()
    if (figure.startsWith("£")) figure = figure.slice(1).trim()
    if (!figure) next.amount = "Write an amount in pounds."
    else if (!/^\d+$/.test(figure))
      next.amount = "Write a whole number of pounds, like 50."
    else {
      share = Number(figure)
      if (share < 5) next.amount = "The smallest share is £5."
      else if (share > needed)
        next.amount = `We only need £${needed} more. Write £${needed} or less.`
    }

    if (Object.keys(next).length > 0) {
      setErrors(next)
      const first = (["name", "email", "amount"] as const).find(
        (field) => next[field]
      )
      if (first) setFocusTarget({ field: first })
      return
    }

    setErrors({})
    setGiven((value) => value + share)
    setGuests((value) => value + 1)
    setThanks({ name: trimmedName, email: trimmedEmail, amount: share })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${linkFocus}`}
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
              <p className="font-mono text-label">
                Gift list ·{" "}
                <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
                Little Saltry
              </p>
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
              {freeCount} of {gifts.length} gifts still free
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {gifts.map((gift) => {
              const action =
                gift.state === "mine"
                  ? "Cancel my reservation"
                  : "Reserve this gift"
              return (
                <li
                  key={gift.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card md:col-span-6 lg:col-span-4"
                >
                  <div
                    role="img"
                    aria-label={gift.picture.label}
                    className="flex aspect-3/2 items-center justify-center bg-muted"
                  >
                    {gift.picture.drawing}
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
                        className={`mt-auto w-full ${buttonClasses}`}
                        aria-label={`${action}: ${gift.name}`}
                        onClick={() => toggleGift(gift.id)}
                      >
                        {action}
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
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
                  <label
                    htmlFor="share-name"
                    className="block font-mono text-label text-foreground"
                  >
                    Your name
                  </label>
                  <Input
                    ref={nameRef}
                    id="share-name"
                    autoComplete="name"
                    className={inputClasses}
                    value={name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy(
                      errors.name && "share-name-error"
                    )}
                    onChange={(event) => {
                      setName(event.target.value)
                      clearError("name")
                    }}
                  />
                  {errors.name && (
                    <ErrorLine id="share-name-error" message={errors.name} />
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
                    type="email"
                    autoComplete="email"
                    className={inputClasses}
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy(
                      "share-email-help",
                      errors.email && "share-email-error"
                    )}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearError("email")
                    }}
                  />
                  <p
                    id="share-email-help"
                    className="font-mono text-label text-muted-foreground"
                  >
                    We write once, with how to send your share.
                  </p>
                  {errors.email && (
                    <ErrorLine id="share-email-error" message={errors.email} />
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
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    className={inputClasses}
                    value={amount}
                    aria-invalid={errors.amount ? true : undefined}
                    aria-describedby={describedBy(
                      "share-amount-help",
                      errors.amount && "share-amount-error"
                    )}
                    onChange={(event) => {
                      setAmount(event.target.value)
                      clearError("amount")
                    }}
                  />
                  <p
                    id="share-amount-help"
                    className="font-mono text-label text-muted-foreground tabular-nums"
                  >
                    From £5 to £{needed}, what is still needed
                  </p>
                  {errors.amount && (
                    <ErrorLine
                      id="share-amount-error"
                      message={errors.amount}
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full md:w-auto md:self-start ${buttonClasses}`}
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
                    className={`text-h2 wrap-break-word ${codeFocus}`}
                  >
                    Thank you, {thanks.name}
                  </h3>
                  <p className="text-body wrap-break-word">
                    We have noted £{thanks.amount} toward the bicycles, and we
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
