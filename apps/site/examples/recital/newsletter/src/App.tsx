import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const label = "font-mono text-label text-muted-foreground"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const benefits = [
  {
    title: "One long letter",
    text: "Every other Sunday, about 2,000 words on one piece of slow work, written after visiting the people doing it.",
  },
  {
    title: "One thing by someone else",
    text: "At the end of each letter, a book, an essay or a film about patient work that is worth your evening.",
  },
  {
    title: "No advertising",
    text: "There are no sponsors and no tracking links. The letter is free, and readers who want to can chip in once a year.",
  },
]

const quotes = [
  {
    text: "It is the one email I save for the afternoon, when I have time to read it properly.",
    name: "Tomas",
    role: "Joiner",
  },
  {
    text: "I started reading for the boat and stayed for the dictionary. I now know far too much about the word set.",
    name: "Ines",
    role: "School librarian",
  },
]

const recentLetters = [
  { title: "The keel goes in", date: "2026-11-08", label: "8 November 2026" },
  {
    title: "Four thousand bulbs",
    date: "2026-10-25",
    label: "25 October 2026",
  },
  {
    title: "A definition takes a month",
    date: "2026-10-11",
    label: "11 October 2026",
  },
  { title: "Steaming oak", date: "2026-09-27", label: "27 September 2026" },
  {
    title: "The garden in its ninth year",
    date: "2026-09-13",
    label: "13 September 2026",
  },
]

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (subscribed) {
      headingRef.current?.focus()
    }
  }, [subscribed])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (value === "") {
      setError("Enter your email address.")
      inputRef.current?.focus()
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError(
        "Enter an email address with an @ and a domain, such as name@example.com."
      )
      inputRef.current?.focus()
      return
    }
    setError(null)
    setSubscribed(true)
  }

  function handleSubscribeLink() {
    if (subscribed) {
      headingRef.current?.focus({ preventScroll: true })
    } else {
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(plainLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/archive" className={plainLink}>
            Archive
          </a>
          <a href="/about" className={plainLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-24">
          <p className={label}>A letter every other Sunday</p>
          <h1 className="mt-4 text-h1 text-foreground md:text-display">
            Letters about work that takes years
          </h1>
          <p className="mt-6">
            Every other Sunday you get one long letter about a piece of slow
            work: a wooden boat built over six years, a dictionary of a dying
            dialect, a garden planted for people not yet born. It is written by
            one person, Hanne Lindqvist, and read by about 4,000 people.
          </p>
        </div>

        <div id="subscribe" className="mx-auto mt-12 max-w-lg scroll-mt-6">
          {!subscribed && (
            <form noValidate onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="block font-mono text-label text-foreground"
              >
                Email address
              </label>
              <Input
                ref={inputRef}
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError(null)
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "email-error" : undefined}
                className="mt-2 block h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
              />
              {error && (
                <p
                  id="email-error"
                  className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 wrap-break-word">{error}</span>
                </p>
              )}
              <div className="mt-4">
                <Button
                  type="submit"
                  className="h-auto rounded-md px-6 py-2 font-mono text-label"
                >
                  Subscribe
                </Button>
              </div>
              <p className={cn(label, "mt-4")}>
                Free · Every other Sunday · Leave with one click
              </p>
            </form>
          )}
          <div role="status">
            {subscribed && (
              <>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-h2 text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
                >
                  You are on the list
                </h2>
                <p className="mt-4">
                  The next letter arrives within two weeks, on a Sunday morning.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <p className={cn(label, "tabular-nums")}>
            Letter 112 · <time dateTime="2026-11-08">8 November 2026</time>
          </p>
          <h2 className="mt-2 text-h2 text-foreground">The keel goes in</h2>
          <p className="mt-4">
            Petra and Joel have been building their boat in a barn outside
            Ålesund since the spring of 2021. Last Tuesday, in the fifth year,
            the keel finally went in. It took six people, two jacks and most of
            a morning.
          </p>
          <p className="mt-6">
            The oak for it was felled in 2019 and has been drying under a tarp
            ever since. Joel says you can rush almost anything on a boat except
            the wood. Petra says you can rush nothing, and that Joel learns this
            again every winter.
          </p>
          <p className="mt-6">
            When the keel was down they did not celebrate. They swept the floor,
            checked the line with a string, and went home. Petra told me the
            line was a few millimetres off at the stern, and that this was{" "}
            <em>fine</em>, and that she would think about it for a week anyway.
          </p>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              A boat is mostly waiting, with a few loud days in between.
            </p>
          </blockquote>
          <p className="mt-6">
            <a href="#" className={textLink}>
              Read the whole letter
            </a>
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2 text-foreground">What you get</h2>
          <ul className="mt-6">
            {benefits.map((item) => (
              <li key={item.title} className="border-t py-6">
                <h3 className="text-body font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2 text-foreground">From readers</h2>
          {quotes.map((quote, index) => (
            <blockquote
              key={quote.name}
              className={cn(
                "border-l-2 border-primary pl-6",
                index === 0 ? "mt-6 mb-12" : "my-12"
              )}
            >
              <p className="font-heading text-h2 font-normal italic">
                {quote.text}
              </p>
              <footer className={cn(label, "mt-4 not-italic")}>
                {quote.name} · {quote.role}
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className={label}>Who writes it</p>
            <h2 className="mt-2 text-h2 text-foreground">Hanne Lindqvist</h2>
            <p className="mt-4">
              Hanne worked as a radio producer for twelve years before starting
              this letter in 2022. She lives on the west coast of Norway and
              spends about a week with each person she writes about.
            </p>
          </aside>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2 text-foreground">Recent letters</h2>
          <ul className="mt-6">
            {recentLetters.map((letter) => (
              <li
                key={letter.date}
                className="border-t py-4 md:flex md:items-baseline md:justify-between md:gap-6"
              >
                <a href="#" className={cn(plainLink, "min-w-0")}>
                  {letter.title}
                </a>
                <p
                  className={cn(label, "mt-2 tabular-nums md:mt-0 md:shrink-0")}
                >
                  <time dateTime={letter.date}>{letter.label}</time>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a href="/archive" className={textLink}>
              See the archive
            </a>
          </p>
          <p className="mt-12">
            If you would like the next one, it is free and comes every other
            Sunday.
          </p>
          <p className="mt-4">
            <a
              href="#subscribe"
              onClick={handleSubscribeLink}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-auto rounded-md px-6 py-2 font-mono text-label"
              )}
            >
              Subscribe
            </a>
          </p>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2 text-foreground">
            The Long Margin
          </p>
          <p className="mt-2">
            A free letter about slow work, written by one person and sent every
            other Sunday.
          </p>
          <p className={cn(label, "mt-6 tabular-nums")}>
            © 2026 The Long Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
