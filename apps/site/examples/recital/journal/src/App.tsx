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
  href: string
}

const FILTERS: Filter[] = ["All", "Letters", "Craft", "Reading", "Notes"]

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

// Newest first.
const ENTRIES: Entry[] = [
  {
    date: "2026-10-22",
    topic: "Craft",
    minutes: 6,
    title: "Sanding a chair back for the fourth time",
    summary:
      "Why the last pass with the finest paper takes longer than the first three put together.",
    href: "#",
  },
  {
    date: "2026-07-09",
    topic: "Letters",
    minutes: 4,
    title: "A letter from a bookbinder in Ostrava",
    summary:
      "Vera Halasová writes about the eleven months it took to rebind a parish register.",
    href: "#",
  },
  {
    date: "2026-03-12",
    topic: "Reading",
    minutes: 8,
    title: "Reading a forty-year diary in order",
    summary:
      "What changed when we stopped skipping ahead to the famous winters.",
    href: "#",
  },
  {
    date: "2026-01-15",
    topic: "Craft",
    minutes: 5,
    title: "How long a glaze test really takes",
    summary:
      "A potter counts the firings between the first tile and the glaze she finally kept.",
    href: "#",
  },
  {
    date: "2025-11-27",
    topic: "Letters",
    minutes: 3,
    title: "Replies to our letter about unfinished work",
    summary:
      "Six readers on the projects they have carried for more than ten years.",
    href: "#",
  },
  {
    date: "2025-08-04",
    topic: "Reading",
    minutes: 7,
    title: "The slow books on our shelf this summer",
    summary:
      "Four long books we read a chapter a week, and what that pace gave back.",
    href: "#",
  },
  {
    date: "2025-05-19",
    topic: "Craft",
    minutes: 6,
    title: "Keeping a logbook for a wooden boat",
    summary:
      "Tomas Brandt shows the notebook he has filled over three seasons of planking.",
    href: "#",
  },
  {
    date: "2025-02-10",
    topic: "Letters",
    minutes: 4,
    title: "A letter about waiting for a slow seed",
    summary:
      "A gardener in Wexford on the walnut she planted for a grandchild not yet born.",
    href: "#",
  },
  {
    date: "2024-12-03",
    topic: "Reading",
    minutes: 5,
    title: "Notes in the margins of a used atlas",
    summary:
      "The handwriting of three owners, and the roads each of them marked.",
    href: "#",
  },
  {
    date: "2024-09-16",
    topic: "Craft",
    minutes: 9,
    title: "Restoring a clock that runs eight days",
    summary:
      "A repairer explains why she lets every clock run a full month before it goes home.",
    href: "#",
  },
  {
    date: "2024-06-21",
    topic: "Letters",
    minutes: 3,
    title: "Why we started The Long Margin",
    summary:
      "The first letter to readers, on the work that never fits in a deadline.",
    href: "#",
  },
  {
    date: "2024-03-08",
    topic: "Reading",
    minutes: 6,
    title: "Reading a cathedral's building accounts",
    summary:
      "Two centuries of payments for stone, rope and bread, line by line.",
    href: "#",
  },
]

const NEWEST = ENTRIES[0]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label"
const label = "font-mono text-label text-muted-foreground"

function dayMonth(iso: string) {
  const [, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

function countLabel(n: number) {
  return `${n} ${n === 1 ? "entry" : "entries"}`
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [filter, setFilter] = useState<Filter>("All")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)

  const shown = ENTRIES.filter((e) => filter === "All" || e.topic === filter)
  const years = Array.from(new Set(shown.map((e) => e.date.slice(0, 4))))

  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (subscribed) thanksRef.current?.focus()
  }, [subscribed])

  // Focus the field after its error and aria-describedby have rendered.
  useEffect(() => {
    if (attempt > 0) emailRef.current?.focus()
  }, [attempt])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError(
        value === ""
          ? "Enter your email address."
          : "Enter an email address like name@example.com."
      )
      setAttempt((n) => n + 1)
      return
    }
    setError("")
    setSubscribed(true)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/essays" className={headerLink}>
            Essays
          </a>
          <a
            href="/journal"
            aria-current="page"
            className={cn(headerLink, "underline")}
          >
            Journal
          </a>
          <a href="/about" className={headerLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        {/* Introduction */}
        <div className="mx-auto max-w-lg pt-12">
          <h1 className="text-h1 text-foreground">Journal</h1>
          <p className="mt-4">
            The journal is where the editors of The Long Margin write between
            issues: letters to readers, notes from workshops and what we are
            reading slowly. A new entry comes out every other Thursday, give or
            take a week when the work runs long.
          </p>
        </div>

        {/* Start here */}
        <div className="mx-auto mt-12 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className={label}>Start here</p>
            <h2 className="mt-2 text-h2 text-foreground">
              Why we started The Long Margin
            </h2>
            <p className="mt-4">
              Our first letter to readers sets out what the magazine is for and
              why it refuses to hurry. It is short, and every later entry leans
              on it.
            </p>
            <p className="mt-6">
              <a
                href="#"
                className={cn(buttonVariants({ variant: "default" }), buttonClass)}
              >
                Read the entry
              </a>
            </p>
          </aside>
        </div>

        {/* Topic filter */}
        <div className="mx-auto mt-12 max-w-lg">
          <div
            role="group"
            aria-label="Filter by topic"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const chosen = f === filter
              return (
                <Button
                  key={f}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen ? "true" : "false"}
                  className={buttonClass}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              )
            })}
          </div>
          <p aria-live="polite" className={cn("mt-4", label)}>
            {countLabel(shown.length)}
          </p>
        </div>

        {/* Entries */}
        <div className="mx-auto max-w-lg">
          {shown.length === 0 ? (
            <p className="mt-12">No entries on this topic yet.</p>
          ) : (
            <>
              {years.map((year) => (
                <section key={year} className="mt-12">
                  <h2 className={label}>
                    <time dateTime={year}>{year}</time>
                  </h2>
                  <ul className="mt-4">
                    {shown
                      .filter((e) => e.date.startsWith(year))
                      .map((entry) => {
                        const meta = (
                          <>
                            <time dateTime={entry.date}>
                              {dayMonth(entry.date)}
                            </time>
                            {` · ${entry.topic} · ${entry.minutes} min read`}
                          </>
                        )
                        return (
                          <li key={entry.date}>
                            <article className="border-t py-6">
                              {entry === NEWEST ? (
                                <p
                                  className={cn(
                                    "flex flex-wrap items-center gap-2",
                                    label
                                  )}
                                >
                                  <span>{meta}</span>
                                  <Badge className="h-auto rounded-sm bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                                    New
                                  </Badge>
                                </p>
                              ) : (
                                <p className={label}>{meta}</p>
                              )}
                              <h3 className="mt-2 text-h2 text-foreground">
                                <a href={entry.href} className={headerLink}>
                                  {entry.title}
                                </a>
                              </h3>
                              <p className="mt-2">{entry.summary}</p>
                            </article>
                          </li>
                        )
                      })}
                  </ul>
                </section>
              ))}
              <p className="mt-12">
                <a href="#" className={textLink}>
                  Older entries
                </a>
              </p>
            </>
          )}
        </div>

        {/* Sign-up */}
        <div className="mx-auto mt-24 max-w-lg border-t pt-12">
          <h2 className="text-h2 text-foreground">Get the journal by email</h2>
          <p className="mt-4">
            Each new entry arrives in your inbox on the morning it comes out,
            with nothing else attached.
          </p>
          <div className="mt-6">
            {!subscribed && (
              <form noValidate onSubmit={handleSubmit}>
                <label
                  htmlFor="email"
                  className="block font-mono text-label text-foreground"
                >
                  Email address
                </label>
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
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
                  <Button type="submit" variant="secondary" className={buttonClass}>
                    Subscribe
                  </Button>
                </div>
                <p className={cn("mt-4", label)}>
                  Every other Thursday · Leave with one click
                </p>
              </form>
            )}
            <div role="status">
              {subscribed && (
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
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about work that takes a long time, written and
            edited by a few people who are in no hurry.
          </p>
          <p className={cn("mt-6", label)}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
