import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react"
import { CircleAlert, CircleCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Day = "up" | "slow" | "down"
type Tone = "success" | "caution" | "neutral"

const DAYS = 30
const MINUTES_IN_PERIOD = DAYS * 24 * 60

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const LABEL = "font-mono text-label uppercase"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"

// Day 0 is 15 Oct, day 29 is today, 13 Nov.
function history(slow: number[], down: number[]): Day[] {
  return Array.from({ length: DAYS }, (_, i) =>
    down.includes(i) ? "down" : slow.includes(i) ? "slow" : "up"
  )
}

const systems: {
  name: string
  state: string
  tone: Tone
  days: Day[]
  downMinutes: number
}[] = [
  {
    name: "Tracking site",
    state: "Operational",
    tone: "success",
    days: history([], []),
    downMinutes: 0,
  },
  {
    name: "Booking API",
    state: "Operational",
    tone: "success",
    days: history([], [20]),
    downMinutes: 38,
  },
  {
    name: "Label printing",
    state: "Degraded",
    tone: "caution",
    days: history([25, 29], []),
    downMinutes: 0,
  },
  {
    name: "Email notices",
    state: "Operational",
    tone: "success",
    days: history([13], []),
    downMinutes: 0,
  },
  {
    name: "Customer dashboard",
    state: "Operational",
    tone: "success",
    days: history([], []),
    downMinutes: 0,
  },
  {
    name: "Webhooks",
    state: "Operational",
    tone: "success",
    days: history([6], []),
    downMinutes: 0,
  },
]

const incidents = [
  {
    title: "Booking API returned errors",
    date: "2026-11-04T09:14Z",
    dateText: "4 Nov",
    duration: "38 min",
    updates: [
      {
        kind: "Resolved",
        time: "2026-11-04T09:52Z",
        timeText: "09:52",
        text: "Bookings have gone through normally for 20 minutes. Bookings that failed during the incident were not charged and can be sent again.",
      },
      {
        kind: "Monitoring",
        time: "2026-11-04T09:40Z",
        timeText: "09:40",
        text: "We moved the API back to the previous release. Error rates are back to normal and we are watching them.",
      },
      {
        kind: "Identified",
        time: "2026-11-04T09:28Z",
        timeText: "09:28",
        text: "A release this morning broke address checks for some postcodes, so those bookings were refused.",
      },
      {
        kind: "Investigating",
        time: "2026-11-04T09:14Z",
        timeText: "09:14",
        text: "Some booking requests to the API fail with a server error. We are looking into it.",
      },
    ],
  },
  {
    title: "Email notices sent late",
    date: "2026-10-28T16:20Z",
    dateText: "28 Oct",
    duration: "1 h 12 min",
    updates: [
      {
        kind: "Resolved",
        time: "2026-10-28T17:32Z",
        timeText: "17:32",
        text: "The queue is empty and new notices go out within a minute again.",
      },
      {
        kind: "Monitoring",
        time: "2026-10-28T17:05Z",
        timeText: "17:05",
        text: "Our mail provider has fixed the fault. Delayed notices are going out now, oldest first.",
      },
      {
        kind: "Investigating",
        time: "2026-10-28T16:20Z",
        timeText: "16:20",
        text: "Delivery and collection emails are reaching customers up to 40 minutes late. Tracking pages show the right status.",
      },
    ],
  },
  {
    title: "Webhook deliveries delayed",
    date: "2026-10-21T11:05Z",
    dateText: "21 Oct",
    duration: "47 min",
    updates: [
      {
        kind: "Resolved",
        time: "2026-10-21T11:52Z",
        timeText: "11:52",
        text: "All delayed webhooks have been delivered. No events were lost.",
      },
      {
        kind: "Identified",
        time: "2026-10-21T11:24Z",
        timeText: "11:24",
        text: "One of our delivery workers stopped taking jobs. We have restarted it and added a second one.",
      },
      {
        kind: "Investigating",
        time: "2026-10-21T11:05Z",
        timeText: "11:05",
        text: "Scan events reach webhook endpoints up to 15 minutes late. We are looking into it.",
      },
    ],
  },
]

const dayColor: Record<Day, string> = {
  up: "bg-success",
  slow: "bg-tertiary",
  down: "bg-destructive",
}

const dotColor: Record<Tone, string> = {
  success: "bg-success",
  caution: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

function uptimeText(downMinutes: number) {
  if (downMinutes === 0) return "100%"
  return `${(100 - (downMinutes / MINUTES_IN_PERIOD) * 100).toFixed(2)}%`
}

function summary(days: Day[], downMinutes: number) {
  const slow = days.filter((d) => d === "slow").length
  const down = days.filter((d) => d === "down").length
  const parts: string[] = []
  if (slow > 0) parts.push(`${plural(slow, "day")} slow`)
  if (down > 0) parts.push(`${plural(down, "day")} down`)
  const figure = [uptimeText(downMinutes), ...parts].join(" · ")

  const said: string[] = []
  if (slow > 0) said.push(`slow on ${plural(slow, "day")}`)
  if (down > 0) said.push(`down on ${plural(down, "day")}`)
  const detail =
    said.length > 0
      ? said.join(", ").replace(/^./, (c) => c.toUpperCase()) + "."
      : "No slow or down days."
  return {
    figure,
    label: `${uptimeText(downMinutes)} uptime over 30 days. ${detail}`,
  }
}

function State({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[tone])}
      />
      <span className="text-body text-foreground">{children}</span>
    </span>
  )
}

function PanelHeading({
  id,
  children,
  end,
}: {
  id: string
  children: string
  end?: ReactNode
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      <h2 id={id} className={cn(LABEL, "text-muted-foreground")}>
        {children}
      </h2>
      {end}
    </div>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLParagraphElement>(null)

  function goToUpdates(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    sectionRef.current?.scrollIntoView()
    const target = subscribed ? confirmationRef.current : inputRef.current
    target?.focus({ preventScroll: true })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    setEmail(value)
    if (value === "") {
      setError("Enter your email address.")
      inputRef.current?.focus()
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter an email address such as name@example.com.")
      inputRef.current?.focus()
      return
    }
    setError(null)
    setSubscribed(true)
    requestAnimationFrame(() => confirmationRef.current?.focus())
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-8 px-3 py-3 md:px-5">
          <div className="flex items-baseline gap-3">
            <a
              href="/"
              className={cn(
                "font-heading text-h2 text-foreground transition-colors duration-150",
                FOCUS
              )}
            >
              Northgate
            </a>
            <span className={cn(LABEL, "text-muted-foreground")}>Status</span>
          </div>
          <a
            href="#updates"
            onClick={goToUpdates}
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
        {/* Current state */}
        <section className="rounded-xl border bg-card p-5">
          <h1 className="text-h1">One system is running slowly</h1>
          <div className="mt-3">
            <State tone="caution">Degraded performance</State>
          </div>
          <p className="mt-3 max-w-md text-body">
            Label printing is slow: a label can take up to 40 seconds to appear
            instead of a few. Bookings, tracking and all other systems work
            normally. We are moving print jobs to extra servers.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className={cn(LABEL, "text-muted-foreground")}>
              Last checked
            </span>
            <time dateTime="2026-11-13T14:05Z" className={SMALL_FIGURE}>
              13 Nov, 14:05
            </time>
          </div>
        </section>

        {/* Systems */}
        <section
          aria-labelledby="systems-heading"
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="border-b px-5 pt-5 pb-3">
            <PanelHeading
              id="systems-heading"
              end={
                <span className={cn(LABEL, "text-muted-foreground")}>
                  Last 30 days
                </span>
              }
            >
              Systems
            </PanelHeading>
          </div>
          <ul>
            {systems.map((system) => {
              const { figure, label } = summary(system.days, system.downMinutes)
              return (
                <li
                  key={system.name}
                  className="border-t px-5 py-3 first:border-t-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-sans text-body font-medium">
                      {system.name}
                    </h3>
                    <State tone={system.tone}>{system.state}</State>
                  </div>
                  <div
                    role="img"
                    aria-label={label}
                    className="mt-3 flex gap-px"
                  >
                    {system.days.map((day, i) => (
                      <div
                        key={i}
                        className={cn("h-6 flex-1 rounded-sm", dayColor[day])}
                      />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3">
                    <span className={cn(LABEL, "text-muted-foreground")}>
                      30 days ago
                    </span>
                    <span
                      className={cn(
                        SMALL_FIGURE,
                        "order-last col-span-2 md:order-none md:col-span-1 md:text-center"
                      )}
                    >
                      {figure}
                    </span>
                    <span
                      className={cn(LABEL, "text-right text-muted-foreground")}
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
                  className={cn("size-3 rounded-sm", dayColor[day])}
                />
                <span className={cn(LABEL, "text-muted-foreground")}>
                  {word}
                </span>
              </span>
            ))}
          </div>
        </section>

        {/* Planned maintenance */}
        <section
          aria-labelledby="maintenance-heading"
          className="rounded-xl border bg-card p-5"
        >
          <PanelHeading
            id="maintenance-heading"
            end={
              <Badge
                variant="outline"
                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
              >
                Scheduled
              </Badge>
            }
          >
            Planned maintenance
          </PanelHeading>
          <h3 className="mt-3 font-sans text-body font-medium">
            Booking API database upgrade
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <div className="flex items-baseline gap-2">
              <span className={cn(LABEL, "text-muted-foreground")}>Starts</span>
              <time dateTime="2026-11-18T02:00Z" className={SMALL_FIGURE}>
                18 Nov, 02:00
              </time>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={cn(LABEL, "text-muted-foreground")}>Ends</span>
              <time dateTime="2026-11-18T03:30Z" className={SMALL_FIGURE}>
                18 Nov, 03:30
              </time>
            </div>
          </div>
          <p className="mt-3 max-w-md text-body">
            New bookings through the API may take up to 30 seconds to confirm,
            and a few may be refused and need sending again. Tracking, label
            printing and the customer dashboard are not affected.
          </p>
        </section>

        {/* Get updates */}
        <section
          id="updates"
          ref={sectionRef}
          aria-labelledby="updates-heading"
          className="scroll-mt-5 rounded-xl border bg-card p-5"
        >
          <PanelHeading id="updates-heading">Get updates</PanelHeading>
          <p className="mt-3 max-w-md text-body">
            Get an email about incidents and planned maintenance for Northgate.
          </p>
          <div className="mt-5">
            {!subscribed && (
              <form noValidate onSubmit={onSubmit}>
                <label
                  htmlFor="email"
                  className={cn(LABEL, "block text-muted-foreground")}
                >
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
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setError(null)
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={
                      error ? "email-help email-error" : "email-help"
                    }
                    className="px-2 text-body md:flex-1 md:text-body"
                  />
                  <Button
                    type="submit"
                    className="px-5 font-mono text-label uppercase"
                  >
                    Subscribe
                  </Button>
                </div>
                <p
                  id="email-help"
                  className="mt-2 max-w-md font-mono text-label text-muted-foreground"
                >
                  One email when an incident opens and one when it is resolved.
                  Every email has an unsubscribe link.
                </p>
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
            )}
            <div role="status">
              {subscribed && (
                <p
                  ref={confirmationRef}
                  tabIndex={-1}
                  className={cn(
                    "flex items-center gap-2 text-body text-foreground",
                    FOCUS_FROM_CODE
                  )}
                >
                  <CircleCheck
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

        {/* Past incidents */}
        <h2 className="mt-3 text-h2">Past incidents</h2>
        {incidents.map((incident) => (
          <article
            key={incident.date}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
              <h3 className="font-sans text-body font-medium">
                {incident.title}
              </h3>
              <State tone="neutral">Resolved</State>
            </div>
            <div className={cn(SMALL_FIGURE, "mt-2 flex flex-wrap gap-x-5")}>
              <time dateTime={incident.date}>{incident.dateText}</time>
              <span>{incident.duration}</span>
            </div>
            <ol role="list" className="mt-5">
              {incident.updates.map((update) => (
                <li key={update.time} className="border-t py-3 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className={cn(LABEL, "text-foreground")}>
                      {update.kind}
                    </span>
                    <time dateTime={update.time} className={SMALL_FIGURE}>
                      {update.timeText}
                    </time>
                  </div>
                  <p className="mt-1 max-w-md text-body">{update.text}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </main>

      <footer className="mx-auto max-w-3xl px-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
          <span className={cn(LABEL, "text-muted-foreground")}>
            Northgate Parcels Ltd, 2026
          </span>
          <span className={cn(LABEL, "text-muted-foreground")}>
            All times UTC
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
