import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Topic = "Letters" | "Craft" | "Reading" | "Notes"
type Filter = "All" | Topic

type Entry = {
  date: string
  topic: Topic
  minutes: number
  title: string
  summary: string
}

const FILTERS: Filter[] = ["All", "Letters", "Craft", "Reading", "Notes"]

// Newest first.
const ENTRIES: Entry[] = [
  {
    date: "2026-10-29",
    topic: "Craft",
    minutes: 7,
    title: "Eleven years with the same chisel",
    summary:
      "Odile Varga on why she has never replaced the bench chisel she bought in her first week as an apprentice.",
  },
  {
    date: "2026-08-14",
    topic: "Letters",
    minutes: 5,
    title: "A letter from the bindery in August",
    summary:
      "The heat slowed the glue, the order book filled up, and we finally finished the atlas we started in spring.",
  },
  {
    date: "2026-05-21",
    topic: "Reading",
    minutes: 8,
    title: "What a forty-year diary teaches about patience",
    summary:
      "Reading the notebooks of a lighthouse keeper who wrote three lines a day and missed only nine of them.",
  },
  {
    date: "2026-03-12",
    topic: "Craft",
    minutes: 6,
    title: "The slow part of a stone wall is the looking",
    summary:
      "A waller in the hills explains why she spends more time choosing each stone than setting it.",
  },
  {
    date: "2026-01-22",
    topic: "Letters",
    minutes: 4,
    title: "Notes from the first cold week",
    summary:
      "What changed in the workshop when we stopped working past four and let the light set the hours.",
  },
  {
    date: "2025-11-06",
    topic: "Reading",
    minutes: 9,
    title: "Three books that took longer to write than to read twice",
    summary:
      "A history of a canal, a field guide to lichens and a dictionary of one valley's weather words.",
  },
  {
    date: "2025-09-18",
    topic: "Letters",
    minutes: 5,
    title: "On finishing a thing nobody asked for",
    summary:
      "Our editor on the quilt her grandmother left half done, and the eight winters it took to complete it.",
  },
  {
    date: "2025-06-05",
    topic: "Craft",
    minutes: 7,
    title: "How a violin maker knows when to stop scraping",
    summary:
      "Tapping, listening and weighing the top plate until the last tenth of a millimetre stops mattering.",
  },
  {
    date: "2025-02-27",
    topic: "Reading",
    minutes: 6,
    title: "Rereading a novel every ten years",
    summary:
      "Four readings of the same book, at twenty, thirty, forty and fifty, and what moved each time.",
  },
  {
    date: "2024-12-12",
    topic: "Letters",
    minutes: 4,
    title: "The year in one long letter",
    summary:
      "Twelve months of the magazine, the people who wrote for it and the one issue we printed twice.",
  },
  {
    date: "2024-09-19",
    topic: "Craft",
    minutes: 8,
    title: "Why the first table takes a year",
    summary:
      "A furniture maker counts the hours behind his first dining table and finds most of them were spent waiting.",
  },
  {
    date: "2024-04-25",
    topic: "Reading",
    minutes: 5,
    title: "A reading list for the long middle of a project",
    summary:
      "Seven books for the months after the excitement fades and before the end is anywhere in sight.",
  },
]

const NEWEST = ENTRIES[0]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function dayAndMonth(iso: string) {
  const [, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const HEADER_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const TEXT_LINK = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON = "h-auto rounded-md px-6 py-2 font-mono text-label"
const LABEL = "font-mono text-label text-muted-foreground"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUp() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
  }, [sent])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    let message = ""
    if (value === "") {
      message = "Enter your email address."
    } else if (!EMAIL_PATTERN.test(value)) {
      message = "Enter an email address in the form name@example.com."
    }
    setError(message)
    if (message) {
      inputRef.current?.focus()
      return
    }
    setSent(true)
  }

  return (
    <div className="mt-6">
      {!sent && (
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
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onInput={() => setError("")}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "email-error" : undefined}
            className="mt-2 h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
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
              <span>{error}</span>
            </p>
          )}
          <div className="mt-4">
            <Button type="submit" variant="secondary" className={BUTTON}>
              Subscribe
            </Button>
          </div>
          <p className={cn("mt-4", LABEL)}>
            Every other Thursday · Leave with one click
          </p>
        </form>
      )}
      <div role="status">
        {sent && (
          <p
            ref={thanksRef}
            tabIndex={-1}
            className="focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            Thank you. The next entry will reach you by email.
          </p>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [filter, setFilter] = useState<Filter>("All")

  const shown = ENTRIES.filter(
    (entry) => filter === "All" || entry.topic === filter
  )
  const years = Array.from(new Set(shown.map((entry) => entry.date.slice(0, 4))))
  const count = `${shown.length} ${shown.length === 1 ? "entry" : "entries"}`

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", HEADER_LINK)}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/essays" className={HEADER_LINK}>
            Essays
          </a>
          <a
            href="/journal"
            aria-current="page"
            className={cn(HEADER_LINK, "underline")}
          >
            Journal
          </a>
          <a href="/about" className={HEADER_LINK}>
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-12">
          <h1 className="text-h1">Journal</h1>
          <p className="mt-4">
            The journal is where the editors of The Long Margin write between
            issues: letters from the workshop, notes on craft and the books we
            are reading slowly. A new entry comes out every other Thursday, and
            some months there is only one.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className={LABEL}>Start here</p>
            <h2 className="mt-2 text-h2">Why the first table takes a year</h2>
            <p className="mt-4">
              A furniture maker counts the hours behind his first dining table
              and finds most of them were spent waiting for wood to settle. It
              is the entry readers send to friends most often, and the best
              short account of what this magazine is about.
            </p>
            <p className="mt-6">
              <a
                href="#"
                className={cn(buttonVariants({ variant: "default" }), BUTTON)}
              >
                Read the entry
              </a>
            </p>
          </aside>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div
            role="group"
            aria-label="Filter by topic"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((topic) => {
              const chosen = topic === filter
              return (
                <Button
                  key={topic}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen ? "true" : "false"}
                  onClick={() => setFilter(topic)}
                  className={BUTTON}
                >
                  {topic}
                </Button>
              )
            })}
          </div>
          <p aria-live="polite" className={cn("mt-4", LABEL)}>
            {count}
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          {shown.length === 0 ? (
            <p className="mt-12">No entries on this topic yet.</p>
          ) : (
            <>
              {years.map((year) => (
                <section key={year} className="mt-12">
                  <h2 className={LABEL}>
                    <time dateTime={year}>{year}</time>
                  </h2>
                  <ul className="mt-4">
                    {shown
                      .filter((entry) => entry.date.startsWith(year))
                      .map((entry) => (
                        <li key={entry.date}>
                          <article className="border-t py-6">
                            {entry === NEWEST ? (
                              <p
                                className={cn(
                                  "flex flex-wrap items-center gap-2",
                                  LABEL
                                )}
                              >
                                <span>
                                  <time dateTime={entry.date}>
                                    {dayAndMonth(entry.date)}
                                  </time>
                                  {` · ${entry.topic} · ${entry.minutes} min read`}
                                </span>
                                <Badge className="h-auto rounded-sm bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                                  New
                                </Badge>
                              </p>
                            ) : (
                              <p className={LABEL}>
                                <time dateTime={entry.date}>
                                  {dayAndMonth(entry.date)}
                                </time>
                                {` · ${entry.topic} · ${entry.minutes} min read`}
                              </p>
                            )}
                            <h3 className="mt-2 text-h2">
                              <a href="#" className={HEADER_LINK}>
                                {entry.title}
                              </a>
                            </h3>
                            <p className="mt-2">{entry.summary}</p>
                          </article>
                        </li>
                      ))}
                  </ul>
                </section>
              ))}
              <p className="mt-12">
                <a href="#" className={TEXT_LINK}>
                  Older entries
                </a>
              </p>
            </>
          )}
        </div>

        <div className="mx-auto mt-24 max-w-lg border-t pt-12">
          <h2 className="text-h2">Get the journal by email</h2>
          <p className="mt-4">
            Each new entry arrives in your inbox on the morning it is published,
            with nothing else attached.
          </p>
          <SignUp />
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about work that takes a long time, published from a
            converted bindery since 2019.
          </p>
          <p className={cn("mt-6", LABEL)}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
