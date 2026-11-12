import { useRef, useState, type FormEvent, type MouseEvent } from "react"
import { Check, CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Tone = "good" | "caution" | "neutral" | "bad"
type Day = "up" | "slow" | "down"

const dotTone: Record<Tone, string> = {
  good: "bg-success",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
  bad: "bg-destructive",
}

const dayTone: Record<Day, string> = {
  up: "bg-success",
  slow: "bg-tertiary",
  down: "bg-destructive",
}

const label = "font-mono text-label uppercase"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const panel = "rounded-xl border bg-card p-5"
const headingRow = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const panelHeading = "font-mono text-label uppercase text-muted-foreground"

function State({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotTone[tone])}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

// Day 1 is 13 Oct, day 30 is today, 11 Nov.
function days(marks: Record<number, Day>): Day[] {
  return Array.from({ length: 30 }, (_, i) => marks[i + 1] ?? "up")
}

const systems = [
  { name: "Tracking site", uptime: "100%", days: days({}) },
  { name: "Booking API", uptime: "99.91%", days: days({ 12: "down" }) },
  {
    name: "Label printing",
    uptime: "99.80%",
    days: days({ 29: "slow", 30: "slow" }),
  },
  { name: "Email notices", uptime: "99.95%", days: days({ 20: "slow" }) },
  { name: "Customer dashboard", uptime: "100%", days: days({}) },
  { name: "Webhooks", uptime: "100%", days: days({}) },
]

function summary(list: Day[]) {
  const slow = list.filter((d) => d === "slow").length
  const down = list.filter((d) => d === "down").length
  return { slow, down }
}

const incidents = [
  {
    title: "Email notices delayed",
    date: "2026-11-01",
    dateText: "1 Nov",
    duration: "1 h 25 min",
    updates: [
      {
        kind: "Resolved",
        time: "09:45",
        text: "The queue is empty and new notices go out within a minute. Every delayed notice has been sent.",
      },
      {
        kind: "Identified",
        time: "08:50",
        text: "Our mail provider limited how fast we could send. We have raised the limit with them.",
      },
      {
        kind: "Investigating",
        time: "08:20",
        text: "Delivery and pickup notices are reaching customers up to 40 minutes late.",
      },
    ],
  },
  {
    title: "Booking API returned errors",
    date: "2026-10-24",
    dateText: "24 Oct",
    duration: "38 min",
    updates: [
      {
        kind: "Resolved",
        time: "10:52",
        text: "Bookings are going through again. Requests that failed during the outage can be sent again as they were.",
      },
      {
        kind: "Monitoring",
        time: "10:40",
        text: "We moved traffic to the standby database. Error rates are back to normal and we are watching them.",
      },
      {
        kind: "Identified",
        time: "10:25",
        text: "The main booking database stopped accepting new connections after a storage alert.",
      },
      {
        kind: "Investigating",
        time: "10:14",
        text: "Some calls to the booking API return a 503 error. We are looking into it.",
      },
    ],
  },
  {
    title: "Tracking pages slow to load",
    date: "2026-10-08",
    dateText: "8 Oct",
    duration: "52 min",
    updates: [
      {
        kind: "Resolved",
        time: "16:32",
        text: "Tracking pages load in under a second again.",
      },
      {
        kind: "Monitoring",
        time: "16:05",
        text: "We rolled back this afternoon's release of the tracking site. Load times are falling.",
      },
      {
        kind: "Investigating",
        time: "15:40",
        text: "Tracking pages take up to 20 seconds to load. Parcel scans are still recorded as usual.",
      },
    ],
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (value === "") {
      setError("Enter your email address, such as name@example.com.")
      emailRef.current?.focus()
      return
    }
    if (!emailPattern.test(value)) {
      setError(
        "Check the email address: it needs an @ and a domain, such as name@example.com."
      )
      emailRef.current?.focus()
      return
    }
    setError(null)
    setSubscribed(true)
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  function handleGetUpdates(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    document.getElementById("updates")?.scrollIntoView()
    const target = subscribed ? statusRef.current : emailRef.current
    target?.focus({ preventScroll: true })
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center px-3 py-3 md:px-5">
          <div className="flex items-baseline gap-3">
            <a
              href="/"
              className={cn(
                "font-heading text-h2 text-foreground transition-colors duration-150",
                focusRing
              )}
            >
              Northgate
            </a>
            <span className={cn(label, "text-muted-foreground")}>Status</span>
          </div>
          <a
            href="#updates"
            onClick={handleGetUpdates}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "ml-auto px-5 font-mono text-label uppercase"
            )}
          >
            Get updates
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-5 px-3 py-5 md:px-5">
        <section className={panel}>
          <h1 className="text-h1">One system is running slowly</h1>
          <div className="mt-3">
            <State tone="caution">Degraded performance</State>
          </div>
          <p className="mt-3 max-w-md">
            Label printing is slower than usual: a label can take up to two
            minutes to appear. Our engineers are adding print servers and expect
            normal speeds this afternoon. Tracking, bookings and notices work as
            usual.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className={cn(label, "text-muted-foreground")}>
              Last checked
            </span>
            <time dateTime="2026-11-11T14:05Z" className={smallFigure}>
              11 Nov, 14:05
            </time>
          </div>
        </section>

        <section
          aria-labelledby="systems-heading"
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="border-b px-5 pt-5 pb-3">
            <div className={headingRow}>
              <h2 id="systems-heading" className={panelHeading}>
                Systems
              </h2>
              <span className={cn(label, "text-muted-foreground")}>
                Last 30 days
              </span>
            </div>
          </div>
          <ul>
            {systems.map((system) => {
              const { slow, down } = summary(system.days)
              const parts = [
                slow > 0 ? `${plural(slow, "day")} slow` : null,
                down > 0 ? `${plural(down, "day")} down` : null,
              ].filter(Boolean)
              const spoken = [
                slow > 0 ? `slow on ${plural(slow, "day")}` : null,
                down > 0 ? `down on ${plural(down, "day")}` : null,
              ].filter(Boolean) as string[]
              const sentence =
                spoken.length > 0
                  ? spoken.join(", ").replace(/^./, (c) => c.toUpperCase()) +
                    "."
                  : "No slow or down days."
              const degraded = system.days[29] !== "up"
              return (
                <li
                  key={system.name}
                  className="border-t px-5 py-3 first:border-t-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-sans text-body font-medium">
                      {system.name}
                    </h3>
                    {degraded ? (
                      <State tone="caution">Degraded</State>
                    ) : (
                      <State tone="good">Operational</State>
                    )}
                  </div>
                  <div
                    role="img"
                    aria-label={`${system.uptime} uptime over 30 days. ${sentence}`}
                    className="mt-3 flex gap-px"
                  >
                    {system.days.map((day, i) => (
                      <div
                        key={i}
                        className={cn("h-6 flex-1 rounded-sm", dayTone[day])}
                      />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3">
                    <span className={cn(label, "text-muted-foreground")}>
                      30 days ago
                    </span>
                    <span
                      className={cn(
                        smallFigure,
                        "order-last col-span-2 md:order-none md:col-span-1 md:text-center"
                      )}
                    >
                      {[system.uptime, ...parts].join(" · ")}
                    </span>
                    <span
                      className={cn(label, "text-right text-muted-foreground")}
                    >
                      Today
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-wrap gap-5 border-t px-5 py-3">
            {(
              [
                ["up", "Up"],
                ["slow", "Slow"],
                ["down", "Down"],
              ] as const
            ).map(([day, word]) => (
              <span key={day} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn("size-3 rounded-sm", dayTone[day])}
                />
                <span className={cn(label, "text-muted-foreground")}>
                  {word}
                </span>
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="maintenance-heading" className={panel}>
          <div className={headingRow}>
            <h2 id="maintenance-heading" className={panelHeading}>
              Planned maintenance
            </h2>
            <Badge
              variant="outline"
              className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
            >
              Scheduled
            </Badge>
          </div>
          <h3 className="mt-3 font-sans text-body font-medium">
            Booking API database upgrade
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className={cn(label, "text-muted-foreground")}>Starts</span>
              <time dateTime="2026-11-18T01:00Z" className={smallFigure}>
                18 Nov, 01:00
              </time>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={cn(label, "text-muted-foreground")}>Ends</span>
              <time dateTime="2026-11-18T03:00Z" className={smallFigure}>
                18 Nov, 03:00
              </time>
            </div>
          </div>
          <p className="mt-3 max-w-md">
            New bookings through the API may take up to 30 seconds to confirm,
            and a few calls may need a second try. Tracking, labels and the
            dashboard are not affected.
          </p>
        </section>

        <section
          id="updates"
          aria-labelledby="updates-heading"
          className={cn(panel, "scroll-mt-5")}
        >
          <div className={headingRow}>
            <h2 id="updates-heading" className={panelHeading}>
              Get updates
            </h2>
          </div>
          <p className="mt-3 max-w-md">
            Get an email about incidents and planned maintenance for Northgate.
          </p>
          <div className="mt-5">
            {!subscribed && (
              <>
                <form noValidate onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className={cn(label, "text-muted-foreground")}
                  >
                    Email address
                  </label>
                  <div className="mt-2 flex flex-col gap-3 md:flex-row">
                    <Input
                      ref={emailRef}
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={
                        error ? "email-error email-help" : "email-help"
                      }
                      className="text-body md:flex-1 md:text-body"
                    />
                    <Button
                      type="submit"
                      className="px-5 font-mono text-label uppercase"
                    >
                      Subscribe
                    </Button>
                  </div>
                  {error && (
                    <p
                      id="email-error"
                      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
                    >
                      <CircleAlert
                        aria-hidden="true"
                        className="size-4 shrink-0"
                        strokeWidth={1.5}
                      />
                      {error}
                    </p>
                  )}
                </form>
                <p
                  id="email-help"
                  className="mt-2 max-w-md font-mono text-label text-muted-foreground"
                >
                  One email when an incident opens and one when it is resolved.
                  Every email has an unsubscribe link.
                </p>
              </>
            )}
            <div
              ref={statusRef}
              role="status"
              tabIndex={-1}
              className="focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              {subscribed && (
                <p className="flex items-center gap-2 text-body">
                  <Check
                    aria-hidden="true"
                    className="size-4 shrink-0 text-success"
                    strokeWidth={1.5}
                  />
                  Subscribed. We will write when something changes.
                </p>
              )}
            </div>
          </div>
        </section>

        <h2 className="mt-3 text-h2">Past incidents</h2>
        {incidents.map((incident) => (
          <article key={incident.title} className={panel}>
            <div className={headingRow}>
              <h3 className="font-sans text-body font-medium">
                {incident.title}
              </h3>
              <State tone="neutral">Resolved</State>
            </div>
            <div className={cn(smallFigure, "mt-2 flex flex-wrap gap-x-5")}>
              <time dateTime={incident.date}>{incident.dateText}</time>
              <span>{incident.duration}</span>
            </div>
            <ol className="mt-5">
              {incident.updates.map((update) => (
                <li key={update.kind} className="border-t py-3 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className={cn(label, "text-foreground")}>
                      {update.kind}
                    </span>
                    <time
                      dateTime={`${incident.date}T${update.time}Z`}
                      className={smallFigure}
                    >
                      {update.time}
                    </time>
                  </div>
                  <p className="mt-1 max-w-md">{update.text}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </main>

      <footer className="mx-auto max-w-3xl px-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
          <span className={cn(label, "text-muted-foreground")}>
            © 2026 Northgate
          </span>
          <span className={cn(label, "text-muted-foreground")}>
            All times UTC
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
