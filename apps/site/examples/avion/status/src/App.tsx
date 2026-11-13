import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react"
import { CircleAlert, CircleCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Day = "up" | "slow" | "down"
type Tone = "success" | "caution" | "failed" | "neutral"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const panel = "rounded-xl border bg-card"
const headingRow = "flex min-h-7 flex-wrap items-center justify-between gap-3"

const dotTone: Record<Tone, string> = {
  success: "bg-success",
  caution: "bg-tertiary",
  failed: "bg-destructive",
  neutral: "bg-muted-foreground",
}

const dayTone: Record<Day, string> = {
  up: "bg-success",
  slow: "bg-tertiary",
  down: "bg-destructive",
}

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

/** 30 days, oldest first; the last one is today. */
function days(marks: Record<number, Day> = {}): Day[] {
  return Array.from({ length: 30 }, (_, i) => marks[i] ?? "up")
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

type System = {
  name: string
  degraded: boolean
  uptime: string
  history: Day[]
}

// Index 29 is 13 Nov (today), 22 is 6 Nov, 17 is 1 Nov, 10 is 25 Oct.
const systems: System[] = [
  {
    name: "Tracking site",
    degraded: false,
    uptime: "99.91%",
    history: days({ 17: "down" }),
  },
  {
    name: "Booking API",
    degraded: false,
    uptime: "100.00%",
    history: days({ 22: "slow" }),
  },
  {
    name: "Label printing",
    degraded: true,
    uptime: "100.00%",
    history: days({ 29: "slow" }),
  },
  {
    name: "Email notices",
    degraded: false,
    uptime: "100.00%",
    history: days({ 10: "slow" }),
  },
  {
    name: "Customer dashboard",
    degraded: false,
    uptime: "100.00%",
    history: days(),
  },
  {
    name: "Webhooks",
    degraded: false,
    uptime: "100.00%",
    history: days(),
  },
]

function summary(history: Day[]) {
  const slow = history.filter((d) => d === "slow").length
  const down = history.filter((d) => d === "down").length
  return { slow, down }
}

type Update = { kind: string; time: string; dateTime: string; text: string }
type Incident = {
  title: string
  date: string
  dateTime: string
  duration: string
  updates: Update[]
}

const incidents: Incident[] = [
  {
    title: "Booking API slow to confirm bookings",
    date: "6 Nov",
    dateTime: "2026-11-06",
    duration: "1 h 12 min",
    updates: [
      {
        kind: "Resolved",
        time: "10:54",
        dateTime: "2026-11-06T10:54Z",
        text: "Booking confirmations are back under one second. No bookings were lost.",
      },
      {
        kind: "Monitoring",
        time: "10:31",
        dateTime: "2026-11-06T10:31Z",
        text: "We added capacity to the booking queue. Response times are falling and we are watching them.",
      },
      {
        kind: "Identified",
        time: "10:05",
        dateTime: "2026-11-06T10:05Z",
        text: "A surge of bulk bookings from one integration filled the queue. Single bookings were waiting behind it.",
      },
      {
        kind: "Investigating",
        time: "09:42",
        dateTime: "2026-11-06T09:42Z",
        text: "Some bookings take up to 20 seconds to confirm. We are looking into it.",
      },
    ],
  },
  {
    title: "Tracking site unavailable",
    date: "1 Nov",
    dateTime: "2026-11-01",
    duration: "38 min",
    updates: [
      {
        kind: "Resolved",
        time: "07:26",
        dateTime: "2026-11-01T07:26Z",
        text: "The tracking site is working again for all parcels.",
      },
      {
        kind: "Identified",
        time: "07:04",
        dateTime: "2026-11-01T07:04Z",
        text: "An expired certificate on the tracking site's load balancer blocked every request. We are replacing it.",
      },
      {
        kind: "Investigating",
        time: "06:48",
        dateTime: "2026-11-01T06:48Z",
        text: "The tracking site shows an error page. Parcels are still moving and the booking API is not affected.",
      },
    ],
  },
  {
    title: "Delivery emails sent late",
    date: "25 Oct",
    dateTime: "2026-10-25",
    duration: "2 h 5 min",
    updates: [
      {
        kind: "Resolved",
        time: "16:20",
        dateTime: "2026-10-25T16:20Z",
        text: "All delayed emails have been sent and new ones go out within a minute.",
      },
      {
        kind: "Monitoring",
        time: "15:10",
        dateTime: "2026-10-25T15:10Z",
        text: "Our mail provider has lifted the limit. The backlog of about 40,000 emails is clearing.",
      },
      {
        kind: "Investigating",
        time: "14:15",
        dateTime: "2026-10-25T14:15Z",
        text: "Out for delivery emails are arriving up to an hour late. Tracking pages show the right status.",
      },
    ],
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const panelRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const justSubscribed = useRef(false)

  useEffect(() => {
    if (subscribed && justSubscribed.current) {
      justSubscribed.current = false
      statusRef.current?.focus()
    }
  }, [subscribed])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!value) {
      setError("Enter your email address.")
      inputRef.current?.focus()
      return
    }
    if (!emailPattern.test(value)) {
      setError("Enter an email address such as name@example.com.")
      inputRef.current?.focus()
      return
    }
    setError(null)
    justSubscribed.current = true
    setSubscribed(true)
  }

  function onGetUpdates(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    panelRef.current?.scrollIntoView()
    const target = subscribed ? statusRef.current : inputRef.current
    target?.focus({ preventScroll: true })
  }

  const container = "mx-auto max-w-3xl px-3 md:px-5"

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className={cn(container, "flex items-center py-3")}>
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
            <span className={label}>Status</span>
          </div>
          <a
            href="#updates"
            onClick={onGetUpdates}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "ml-auto px-5 font-mono text-label uppercase"
            )}
          >
            Get updates
          </a>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-5 py-5")}>
        {/* Current state */}
        <section className={cn(panel, "p-5")}>
          <h1 className="text-h1">One system is running slowly</h1>
          <div className="mt-3">
            <State tone="caution">Degraded performance</State>
          </div>
          <p className="mt-3 max-w-md">
            Labels take up to two minutes to print, in the dashboard and through
            the API. Bookings, tracking and collections are not affected. We are
            moving print jobs to a second print server while we find the cause.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className={label}>Last checked</span>
            <time dateTime="2026-11-13T14:05Z" className={smallFigure}>
              13 Nov, 14:05
            </time>
          </div>
        </section>

        {/* Systems */}
        <section
          aria-labelledby="systems-heading"
          className={cn(panel, "overflow-hidden")}
        >
          <div className="border-b px-5 pt-5 pb-3">
            <div className={headingRow}>
              <h2 id="systems-heading" className={label}>
                Systems
              </h2>
              <span className={label}>Last 30 days</span>
            </div>
          </div>
          <ul>
            {systems.map((system) => {
              const { slow, down } = summary(system.history)
              const notes = [
                slow ? `${plural(slow, "day")} slow` : null,
                down ? `${plural(down, "day")} down` : null,
              ].filter(Boolean)
              const spoken = [
                slow ? `Slow on ${plural(slow, "day")}` : null,
                down ? `down on ${plural(down, "day")}` : null,
              ].filter(Boolean)
              const alt = `${system.uptime} uptime over 30 days. ${
                spoken.length
                  ? spoken.join(", ").replace(/^./, (c) => c.toUpperCase()) +
                    "."
                  : "No slow or down days."
              }`
              return (
                <li
                  key={system.name}
                  className="border-t px-5 py-3 first:border-t-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-sans text-body font-medium">
                      {system.name}
                    </h3>
                    {system.degraded ? (
                      <State tone="caution">Degraded</State>
                    ) : (
                      <State tone="success">Operational</State>
                    )}
                  </div>
                  <div role="img" aria-label={alt} className="mt-3 flex gap-px">
                    {system.history.map((day, i) => (
                      <span
                        key={i}
                        className={cn("h-6 flex-1 rounded-sm", dayTone[day])}
                      />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3">
                    <span className={label}>30 days ago</span>
                    <span
                      className={cn(
                        smallFigure,
                        "order-last col-span-2 md:order-none md:col-span-1 md:text-center"
                      )}
                    >
                      {[system.uptime, ...notes].join(" · ")}
                    </span>
                    <span className={cn(label, "text-right")}>Today</span>
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
                <span className={label}>{word}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Planned maintenance */}
        <section
          aria-labelledby="maintenance-heading"
          className={cn(panel, "p-5")}
        >
          <div className={headingRow}>
            <h2 id="maintenance-heading" className={label}>
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
              <span className={label}>Starts</span>
              <time dateTime="2026-11-19T02:00Z" className={smallFigure}>
                19 Nov, 02:00
              </time>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={label}>Ends</span>
              <time dateTime="2026-11-19T03:30Z" className={smallFigure}>
                19 Nov, 03:30
              </time>
            </div>
          </div>
          <p className="mt-3 max-w-md">
            New bookings through the API may be refused for up to five minutes
            during the window; retry and they will go through. Tracking, labels
            and the dashboard keep working throughout.
          </p>
        </section>

        {/* Get updates */}
        <section
          id="updates"
          ref={panelRef}
          aria-labelledby="updates-heading"
          className={cn(panel, "scroll-mt-5 p-5")}
        >
          <div className={headingRow}>
            <h2 id="updates-heading" className={label}>
              Get updates
            </h2>
          </div>
          <p className="mt-3 max-w-md">
            Get an email about incidents and planned maintenance for Northgate.
          </p>
          <div className="mt-5">
            {!subscribed && (
              <>
                <form noValidate onSubmit={onSubmit}>
                  <label htmlFor="email" className={cn(label, "block")}>
                    Email address
                  </label>
                  <div className="mt-2 flex flex-col gap-3 md:flex-row">
                    <Input
                      ref={inputRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError(null)
                      }}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={
                        error ? "email-error email-help" : "email-help"
                      }
                      className="px-2 text-body md:flex-1 md:text-body"
                    />
                    <Button
                      type="submit"
                      className="w-full px-5 font-mono text-label uppercase md:w-auto"
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
                <span className="inline-flex items-center gap-2">
                  <CircleCheck
                    aria-hidden="true"
                    className="size-4 shrink-0 text-success"
                    strokeWidth={1.5}
                  />
                  Subscribed. We will write when something changes.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Past incidents */}
        <h2 className="mt-3 text-h2">Past incidents</h2>
        {incidents.map((incident) => (
          <section key={incident.title} className={cn(panel, "p-5")}>
            <div className={headingRow}>
              <h3 className="font-sans text-body font-medium">
                {incident.title}
              </h3>
              <State tone="neutral">Resolved</State>
            </div>
            <div className={cn(smallFigure, "mt-2 flex flex-wrap gap-x-5")}>
              <time dateTime={incident.dateTime}>{incident.date}</time>
              <span>{incident.duration}</span>
            </div>
            <ol className="mt-5">
              {incident.updates.map((update) => (
                <li key={update.dateTime} className="border-t py-3 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-label text-foreground uppercase">
                      {update.kind}
                    </span>
                    <time dateTime={update.dateTime} className={smallFigure}>
                      {update.time}
                    </time>
                  </div>
                  <p className="mt-1 max-w-md">{update.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>

      <footer className={container}>
        <div className="flex flex-wrap justify-between gap-3 pb-5">
          <span className={label}>Northgate Parcels Ltd, 2026</span>
          <span className={label}>All times UTC</span>
        </div>
      </footer>
    </div>
  )
}

export default App
