import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Topic = "Letters" | "Craft" | "Reading" | "Notes"

type Entry = {
  date: string
  topic: Topic
  minutes: number
  title: string
  summary: string
}

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
    date: "2026-11-02",
    topic: "Craft",
    minutes: 6,
    title: "A year of sanding one table",
    summary:
      "Why a walnut dining table took fourteen months, and what the last coat of oil showed that the first one hid.",
  },
  {
    date: "2026-08-14",
    topic: "Letters",
    minutes: 4,
    title: "To the reader who asked about deadlines",
    summary:
      "A reply to Ines Vaskova, who wanted to know how we decide that a long piece of work is finished.",
  },
  {
    date: "2026-05-03",
    topic: "Reading",
    minutes: 8,
    title: "Slow books for a short summer",
    summary:
      "Five books that each took their authors more than ten years to write, and why they read faster than you expect.",
  },
  {
    date: "2026-02-09",
    topic: "Craft",
    minutes: 7,
    title: "The mason who keeps a logbook",
    summary:
      "Tomas Rell has written down the weather on every day he has laid stone since 1998, and he still reads it back.",
  },
  {
    date: "2025-11-20",
    topic: "Reading",
    minutes: 5,
    title: "Notebooks of a dictionary maker",
    summary:
      "What the working papers of a forty-year dictionary say about patience, and about the words that never made it in.",
  },
  {
    date: "2025-09-01",
    topic: "Letters",
    minutes: 3,
    title: "A letter from the bindery",
    summary:
      "Our printer writes about rebinding the first hundred copies by hand after a batch of glue failed in the heat.",
  },
  {
    date: "2025-06-11",
    topic: "Craft",
    minutes: 9,
    title: "Tuning a church organ, one pipe a day",
    summary:
      "An organ builder spends three years on a single instrument and explains why the order of the pipes matters.",
  },
  {
    date: "2025-03-15",
    topic: "Letters",
    minutes: 4,
    title: "On missing our spring issue",
    summary:
      "Why the spring issue came out in June, and what we changed so that the next one comes out on time.",
  },
  {
    date: "2024-12-08",
    topic: "Reading",
    minutes: 6,
    title: "The translator who waited for a word",
    summary:
      "Mara Ellwood held back a finished novel for two years until she found the right word for its last line.",
  },
  {
    date: "2024-09-22",
    topic: "Craft",
    minutes: 7,
    title: "Growing a hedge for the next owner",
    summary:
      "A gardener plants a beech hedge that will take twenty years to close, knowing she will have moved by then.",
  },
  {
    date: "2024-06-30",
    topic: "Letters",
    minutes: 3,
    title: "Why we print on paper first",
    summary:
      "The editors explain why every piece is read on paper before it goes online, and how long that adds.",
  },
  {
    date: "2024-04-07",
    topic: "Reading",
    minutes: 5,
    title: "Reading a diary kept for sixty years",
    summary:
      "A farmer's diary from 1931 to 1991 turns out to be less about weather than about waiting for it.",
  },
]

const NEWEST = ENTRIES[0]
const START_HERE = ENTRIES[3]

const TOPICS: Array<"All" | Topic> = [
  "All",
  "Letters",
  "Craft",
  "Reading",
  "Notes",
]

const FOCUS_RING =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const LIST_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS_RING
)

const TEXT_LINK = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS_RING
)

const BUTTON_CLASSES = "h-auto rounded-md px-6 py-2 font-mono text-label"

function dayMonth(iso: string) {
  const [, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]}`
}

function countLabel(n: number) {
  return `${n} ${n === 1 ? "entry" : "entries"}`
}

function EntryItem({ entry }: { entry: Entry }) {
  const meta = (
    <>
      <time dateTime={entry.date}>{dayMonth(entry.date)}</time> · {entry.topic}{" "}
      · {entry.minutes} min read
    </>
  )
  return (
    <li>
      <article className="border-t py-6">
        {entry === NEWEST ? (
          <p className="flex flex-wrap items-center gap-2 font-mono text-label text-muted-foreground tabular-nums">
            <span>{meta}</span>
            <Badge className="h-auto rounded-sm bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
              New
            </Badge>
          </p>
        ) : (
          <p className="font-mono text-label text-muted-foreground tabular-nums">
            {meta}
          </p>
        )}
        <h3 className="mt-2 text-h2">
          <a href="#" className={LIST_LINK}>
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
    let message: string | null = null
    if (value === "") {
      message = "Enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter an email address in the form name@example.com."
    }
    setError(message)
    if (message) {
      inputRef.current?.focus()
      return
    }
    setDone(true)
  }

  return (
    <div className="mx-auto mt-24 max-w-lg border-t pt-12">
      <h2 className="text-h2">Get the journal by email</h2>
      <p className="mt-4">
        Each new entry comes to your inbox on the day it is published, with
        nothing else attached.
      </p>
      <div className="mt-6">
        {!done && (
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
                className="mt-2 flex items-start gap-2 font-mono text-label wrap-break-word text-destructive"
              >
                <CircleAlert
                  className="size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="min-w-0">{error}</span>
              </p>
            )}
            <div className="mt-4">
              <Button
                type="submit"
                variant="secondary"
                className={BUTTON_CLASSES}
              >
                Subscribe
              </Button>
            </div>
            <p className="mt-4 font-mono text-label text-muted-foreground">
              About four times a year · Leave with one click
            </p>
          </form>
        )}
        <div role="status">
          {done && (
            <p
              ref={messageRef}
              tabIndex={-1}
              className="focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
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

  const shown =
    topic === "All" ? ENTRIES : ENTRIES.filter((e) => e.topic === topic)

  const years: Array<{ year: string; entries: Entry[] }> = []
  for (const entry of shown) {
    const year = entry.date.slice(0, 4)
    const last = years[years.length - 1]
    if (last && last.year === year) last.entries.push(entry)
    else years.push({ year, entries: [entry] })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", LIST_LINK)}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/essays" className={LIST_LINK}>
            Essays
          </a>
          <a
            href="/journal"
            aria-current="page"
            className={cn(LIST_LINK, "underline")}
          >
            Journal
          </a>
          <a href="/about" className={LIST_LINK}>
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-12">
          <h1 className="text-h1">Journal</h1>
          <p className="mt-4">
            The journal is where the editors of The Long Margin write between
            issues: letters to readers, visits to people whose work takes years,
            and the books we are reading slowly. A new entry comes about four
            times a year, when there is something worth saying.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className="font-mono text-label text-muted-foreground">
              Start here
            </p>
            <h2 className="mt-2 text-h2">{START_HERE.title}</h2>
            <p className="mt-4">
              A stonemason in the hills keeps a daily record of his work and the
              weather, and has done so for almost thirty years. It is the entry
              that best shows what this journal is about: work that only makes
              sense when you look at it over a long time.
            </p>
            <p className="mt-6">
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  BUTTON_CLASSES
                )}
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
            {TOPICS.map((name) => {
              const chosen = name === topic
              return (
                <Button
                  key={name}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setTopic(name)}
                  className={BUTTON_CLASSES}
                >
                  {name}
                </Button>
              )
            })}
          </div>
          <p
            aria-live="polite"
            className="mt-4 font-mono text-label text-muted-foreground tabular-nums"
          >
            {countLabel(shown.length)}
          </p>
        </div>

        <div className="mx-auto max-w-lg">
          {years.length === 0 ? (
            <p className="mt-12">No entries on this topic yet.</p>
          ) : (
            <>
              {years.map(({ year, entries }) => (
                <section key={year} className="mt-12">
                  <h2 className="font-mono text-label text-muted-foreground tabular-nums">
                    <time dateTime={year}>{year}</time>
                  </h2>
                  <ul className="mt-4">
                    {entries.map((entry) => (
                      <EntryItem key={entry.date} entry={entry} />
                    ))}
                  </ul>
                </section>
              ))}
              <p className="mt-12">
                <a href="/journal/older" className={TEXT_LINK}>
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
            A small magazine about work that takes a long time, published from a
            room above a bindery.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground tabular-nums">
            © 2026 The Long Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
