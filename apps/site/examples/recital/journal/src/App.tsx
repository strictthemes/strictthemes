import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label"

type Topic = "Letters" | "Craft" | "Reading" | "Notes"
const topics: Array<"All" | Topic> = ["All", "Letters", "Craft", "Reading", "Notes"]

type Entry = {
  date: string
  topic: Topic
  minutes: number
  title: string
  summary: string
}

const entries: Entry[] = [
  {
    date: "2026-10-29",
    topic: "Craft",
    minutes: 7,
    title: "Sharpening the same chisel for eleven years",
    summary:
      "Ruth Okafor has ground her paring chisel down by a third, and she can tell you which year took off which millimetre.",
  },
  {
    date: "2026-08-14",
    topic: "Letters",
    minutes: 4,
    title: "A reply to the reader who asked when the book will be done",
    summary:
      "We do not know, and we explain why that is the honest answer for a history that is in its sixth year.",
  },
  {
    date: "2026-06-02",
    topic: "Reading",
    minutes: 9,
    title: "What a 900-page biography teaches about patience",
    summary:
      "Reading one life over a whole winter, twenty pages a night, changed how we plan the long pieces in each issue.",
  },
  {
    date: "2026-03-19",
    topic: "Craft",
    minutes: 6,
    title: "The second draft is where the work starts",
    summary:
      "Three of our writers show the same paragraph in its first and its fourth version and say what each pass took out.",
  },
  {
    date: "2026-01-08",
    topic: "Letters",
    minutes: 3,
    title: "Notes from a cold workshop in January",
    summary:
      "The glue will not set below ten degrees, so the editors wrote letters to readers instead and kept the stove going.",
  },
  {
    date: "2025-11-20",
    topic: "Reading",
    minutes: 8,
    title: "Rereading a novel I first read at nineteen",
    summary:
      "Tomas Brandl returns to a book he loved as a student and finds that the slow chapters were the point all along.",
  },
  {
    date: "2025-09-03",
    topic: "Craft",
    minutes: 6,
    title: "Why the joinery takes longer than the cutting",
    summary:
      "A cabinetmaker in Hexley times every step of one drawer and finds that fitting it took four times as long as making it.",
  },
  {
    date: "2025-05-11",
    topic: "Letters",
    minutes: 5,
    title: "To the bookbinder who answered every letter",
    summary:
      "A thank-you to Agnes Wilmot, who wrote back to each of our questions by hand over two years of research.",
  },
  {
    date: "2025-02-24",
    topic: "Reading",
    minutes: 5,
    title: "Slow books for a fast spring",
    summary:
      "Six books that each took their authors more than a decade, chosen by the people who edit this magazine.",
  },
  {
    date: "2024-10-15",
    topic: "Craft",
    minutes: 10,
    title: "Keeping a log of every hour spent on one chair",
    summary:
      "One maker kept a notebook for the 212 hours a Windsor chair took her, and the log turned out more useful than the chair.",
  },
  {
    date: "2024-06-06",
    topic: "Letters",
    minutes: 4,
    title: "Why we print twice a year and not every month",
    summary:
      "The editors explain what a six-month gap between issues lets them do, and what it costs the magazine to keep it.",
  },
  {
    date: "2024-02-12",
    topic: "Reading",
    minutes: 7,
    title: "The essays we keep returning to",
    summary:
      "Five essays on slow work that the editors hand to every new writer, with a line on why each one stays on the list.",
  },
]

const newestDate = entries.reduce(
  (latest, entry) => (entry.date > latest ? entry.date : latest),
  entries[0].date
)
const startHere = entries.find(
  (entry) => entry.title === "Keeping a log of every hour spent on one chair"
)!

const months = [
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
  return `${day} ${months[month - 1]}`
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EntryItem({ entry }: { entry: Entry }) {
  const isNewest = entry.date === newestDate
  const details = (
    <>
      <time dateTime={entry.date}>{dayAndMonth(entry.date)}</time>
      {` · ${entry.topic} · ${entry.minutes} min read`}
    </>
  )

  return (
    <li>
      <article className="border-t py-6">
        {isNewest ? (
          <p className="flex flex-wrap items-center gap-2 font-mono text-label text-muted-foreground">
            <span>{details}</span>
            <Badge className="h-auto rounded-sm bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
              New
            </Badge>
          </p>
        ) : (
          <p className="font-mono text-label text-muted-foreground">
            {details}
          </p>
        )}
        <h3 className="mt-2 text-h2">
          <a href="#" className={plainLink}>
            {entry.title}
          </a>
        </h3>
        <p className="mt-2">{entry.summary}</p>
      </article>
    </li>
  )
}

function SignUp() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (done) messageRef.current?.focus()
  }, [done])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    setEmail(value)
    if (value === "") {
      setError("Enter your email address to get the journal.")
      inputRef.current?.focus()
      return
    }
    if (!emailPattern.test(value)) {
      setError("Enter an email address in the form name@example.com.")
      inputRef.current?.focus()
      return
    }
    setError(null)
    setDone(true)
  }

  return (
    <div className="mx-auto mt-24 max-w-lg border-t pt-12">
      <h2 className="text-h2">Get the journal by email</h2>
      <p className="mt-4">
        Each new entry arrives in your inbox the day it goes up, and nothing
        else does.
      </p>
      <div className="mt-6">
        {!done && (
          <form noValidate onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-foreground">
              Email address
            </label>
            <Input
              ref={inputRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError(null)
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
            <p className="mt-4 font-mono text-label text-muted-foreground">
              Once a month · Leave with one click
            </p>
          </form>
        )}
        <div role="status">
          {done && (
            <p ref={messageRef} tabIndex={-1} className={codeFocusRing}>
              Thank you. The next entry will reach you by email.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function App() {
  const [topic, setTopic] = useState<"All" | Topic>("All")

  const shown = entries
    .filter((entry) => topic === "All" || entry.topic === topic)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
  const years = Array.from(new Set(shown.map((entry) => entry.date.slice(0, 4))))

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/essays" className={plainLink}>
            Essays
          </a>
          <a
            href="/journal"
            aria-current="page"
            className={cn(plainLink, "underline")}
          >
            Journal
          </a>
          <a href="/about" className={plainLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-12">
          <h1 className="text-h1">Journal</h1>
          <p className="mt-4">
            The journal is where the editors of The Long Margin write between
            issues: letters to readers, notes from the workshops we visit and
            the books we are reading slowly. A new entry goes up about once a
            month, a little less often when an issue is going to print.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className="font-mono text-label text-muted-foreground">
              Start here
            </p>
            <h2 className="mt-2 text-h2">{startHere.title}</h2>
            <p className="mt-4">
              One maker counted every hour a Windsor chair took her, from
              splitting the green oak to the last coat of oil. It is the
              entry that explains best what this magazine means by work that
              takes a long time.
            </p>
            <p className="mt-6">
              <a href="#" className={cn(buttonVariants(), buttonClass)}>
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
            {topics.map((name) => {
              const chosen = name === topic
              return (
                <Button
                  key={name}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setTopic(name)}
                  className={buttonClass}
                >
                  {name}
                </Button>
              )
            })}
          </div>
          <p
            aria-live="polite"
            className="mt-4 font-mono text-label text-muted-foreground"
          >
            {shown.length === 1 ? "1 entry" : `${shown.length} entries`}
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          {shown.length === 0 ? (
            <p className="mt-12">No entries on this topic yet.</p>
          ) : (
            <>
              {years.map((year) => (
                <section key={year} className="mt-12">
                  <h2 className="font-mono text-label text-muted-foreground">
                    <time dateTime={year}>{year}</time>
                  </h2>
                  <ul className="mt-4">
                    {shown
                      .filter((entry) => entry.date.startsWith(year))
                      .map((entry) => (
                        <EntryItem key={entry.date} entry={entry} />
                      ))}
                  </ul>
                </section>
              ))}
              <p className="mt-12">
                <a href="/journal/older" className={textLink}>
                  Older entries
                </a>
              </p>
            </>
          )}
        </div>

        <SignUp />
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about work that takes a long time, printed twice a
            year.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Long Margin · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
