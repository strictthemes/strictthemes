import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react"
import { Check, CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DayState = "up" | "slow" | "down"
type Tone = "success" | "destructive" | "tertiary" | "neutral"

const DAYS = 30
const MINUTES_IN_PERIOD = DAYS * 24 * 60

// Index 0 is 30 days ago (15 Oct), index 29 is today (13 Nov).
function history(overrides: Record<number, DayState>): DayState[] {
  return Array.from({ length: DAYS }, (_, i) => overrides[i] ?? "up")
}

type System = {
  name: string
  state: { word: string; tone: Tone }
  days: DayState[]
  downMinutes: number
}

const operational = { word: "Operational", tone: "success" as const }

const systems: System[] = [
  { name: "Tracking site", state: operational, days: history({}), downMinutes: 0 },
  {
    name: "Booking API",
    state: operational,
    days: history({ 20: "down" }),
    downMinutes: 38,
  },
  {
    name: "Label printing",
    state: { word: "Degraded", tone: "tertiary" },
    days: history({ 6: "slow", 29: "slow" }),
    downMinutes: 0,
  },
  { name: "Email notices", state: operational, days: history({}), downMinutes: 0 },
  {
    name: "Customer dashboard",
    state: operational,
    days: history({}),
    downMinutes: 0,
  },
  {
    name: "Webhooks",
    state: operational,
    days: history({ 12: "slow" }),
    downMinutes: 0,
  },
]

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

function uptime(system: System) {
  if (system.downMinutes === 0) return "100%"
  const value = (1 - system.downMinutes / MINUTES_IN_PERIOD) * 100
  return `${(Math.floor(value * 100) / 100).toFixed(2)}%`
}

function summary(system: System) {
  const slow = system.days.filter((d) => d === "slow").length
  const down = system.days.filter((d) => d === "down").length
  const percent = uptime(system)
  const figureParts: string[] = []
  const labelParts: string[] = []
  if (slow > 0) {
    figureParts.push(`${plural(slow, "day")} slow`)
    labelParts.push(`Slow on ${plural(slow, "day")}.`)
  }
  if (down > 0) {
    figureParts.push(`${plural(down, "day")} down`)
    labelParts.push(`Down on ${plural(down, "day")}.`)
  }
  const figure = [percent, ...figureParts].join(" · ")
  const label =
    `${percent} uptime over 30 days. ` +
    (labelParts.length > 0 ? labelParts.join(" ") : "No slow or down days.")
  return { figure, label }
}

const dayColor: Record<DayState, string> = {
  up: "bg-success",
  slow: "bg-tertiary",
  down: "bg-destructive",
}

const dotColor: Record<Tone, string> = {
  success: "bg-success",
  destructive: "bg-destructive",
  tertiary: "bg-tertiary",
  neutral: "bg-muted-foreground",
}

type Incident = {
  title: string
  date: string
  dateLabel: string
  duration: string
  updates: { kind: string; time: string; text: string }[]
}

const incidents: Incident[] = [
  {
    title: "Booking API returned errors",
    date: "2026-11-04",
    dateLabel: "4 Nov",
    duration: "38 min",
    updates: [
      {
        kind: "Resolved",
        time: "13:50",
        text: "Bookings have gone through normally for 20 minutes. Any booking that failed in this window can be sent again with the same reference.",
      },
      {
        kind: "Monitoring",
        time: "13:41",
        text: "We rolled back the release and error rates are back to normal. We are watching the API before we close this incident.",
      },
      {
        kind: "Identified",
        time: "13:24",
        text: "A release at 13:05 changed how parcel weights are checked, and most bookings over 10 kg were refused. We are rolling it back.",
      },
      {
        kind: "Investigating",
        time: "13:12",
        text: "Many booking requests are failing with a server error. We are looking into it.",
      },
    ],
  },
  {
    title: "Webhook deliveries delayed",
    date: "2026-10-27",
    dateLabel: "27 Oct",
    duration: "1 h 12 min",
    updates: [
      {
        kind: "Resolved",
        time: "10:32",
        text: "All queued events have been delivered, in order. New events arrive within a few seconds again.",
      },
      {
        kind: "Monitoring",
        time: "10:05",
        text: "The queue is draining. Delays are down to about two minutes and falling.",
      },
      {
        kind: "Identified",
        time: "09:45",
        text: "One of our delivery workers stopped taking jobs after a network change. We have restarted it and added a second one.",
      },
      {
        kind: "Investigating",
        time: "09:20",
        text: "Tracking events are reaching webhook endpoints up to 25 minutes late. No events have been lost.",
      },
    ],
  },
  {
    title: "Labels slow to print",
    date: "2026-10-21",
    dateLabel: "21 Oct",
    duration: "1 h 40 min",
    updates: [
      {
        kind: "Resolved",
        time: "16:50",
        text: "Labels print in about 3 seconds again. We have raised the size of the shared font cache so this does not recur.",
      },
      {
        kind: "Monitoring",
        time: "16:20",
        text: "Print times are back to normal after the fix. We are keeping an eye on the afternoon peak.",
      },
      {
        kind: "Identified",
        time: "15:35",
        text: "The print service was rebuilding its font cache for every label. We are deploying a fix.",
      },
      {
        kind: "Investigating",
        time: "15:10",
        text: "Labels are taking up to a minute to print from the dashboard and the API. Bookings themselves are not affected.",
      },
    ],
  },
]

const labelClass = "font-mono text-label uppercase text-muted-foreground"
const figureClass = "font-mono text-label tabular-nums text-muted-foreground"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function State({ word, tone }: { word: string; tone: Tone }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[tone])}
      />
      <span className="text-body text-foreground">{word}</span>
    </span>
  )
}

function PanelHeading({
  children,
  aside,
}: {
  children: string
  aside?: ReactNode
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      <h2 className={labelClass}>{children}</h2>
      {aside}
    </div>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  function goToUpdates(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    panelRef.current?.scrollIntoView()
    const target = subscribed ? statusRef.current : inputRef.current
    target?.focus({ preventScroll: true })
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
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
    // The form, which held the focus, is gone: move focus to the message.
    statusRef.current?.focus()
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
                focusOutline
              )}
            >
              Northgate
            </a>
            <span className={labelClass}>Status</span>
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
        <section className="rounded-xl border bg-card p-5">
          <h1 className="text-h1">One system is running slowly</h1>
          <div className="mt-3">
            <State word="Degraded performance" tone="tertiary" />
          </div>
          <p className="mt-3 max-w-md text-body">
            Label printing is slow: labels take up to 40 seconds to come
            through, against the usual 3. Bookings, tracking and notices are
            not affected. We have traced it to a busy print server and are
            adding capacity.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className={labelClass}>Last checked</span>
            <time dateTime="2026-11-13T14:05Z" className={figureClass}>
              13 Nov, 14:05
            </time>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b px-5 pt-5 pb-3">
            <PanelHeading
              aside={<span className={labelClass}>Last 30 days</span>}
            >
              Systems
            </PanelHeading>
          </div>
          <ul>
            {systems.map((system) => {
              const { figure, label } = summary(system)
              return (
                <li
                  key={system.name}
                  className="border-t px-5 py-3 first:border-t-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-sans text-body font-medium">
                      {system.name}
                    </h3>
                    <State {...system.state} />
                  </div>
                  <div role="img" aria-label={label} className="mt-3 flex gap-px">
                    {system.days.map((day, i) => (
                      <div
                        key={i}
                        className={cn("h-6 flex-1 rounded-sm", dayColor[day])}
                      />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 md:grid-cols-3">
                    <span className={labelClass}>30 days ago</span>
                    <span
                      className={cn(
                        figureClass,
                        "order-last col-span-2 md:order-none md:col-span-1 md:text-center"
                      )}
                    >
                      {figure}
                    </span>
                    <span className={cn(labelClass, "text-right")}>Today</span>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-wrap gap-5 border-t px-5 py-3">
            {(
              [
                ["Up", "bg-success"],
                ["Slow", "bg-tertiary"],
                ["Down", "bg-destructive"],
              ] as const
            ).map(([word, color]) => (
              <span key={word} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn("size-3 rounded-sm", color)}
                />
                <span className={labelClass}>{word}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <PanelHeading
            aside={
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
              <span className={labelClass}>Starts</span>
              <time dateTime="2026-11-18T02:00Z" className={figureClass}>
                18 Nov, 02:00
              </time>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={labelClass}>Ends</span>
              <time dateTime="2026-11-18T03:30Z" className={figureClass}>
                18 Nov, 03:30
              </time>
            </div>
          </div>
          <p className="mt-3 max-w-md text-body">
            New bookings through the API will be held for up to 90 minutes
            and sent as soon as the work is done. Tracking, labels for parcels
            already booked and the dashboard work as usual.
          </p>
        </section>

        <section
          id="updates"
          ref={panelRef}
          className="scroll-mt-5 rounded-xl border bg-card p-5"
        >
          <PanelHeading>Get updates</PanelHeading>
          <p className="mt-3 max-w-md text-body">
            Get an email about incidents and planned maintenance for
            Northgate.
          </p>
          <div className="mt-5">
            {!subscribed && (
              <form noValidate onSubmit={subscribe}>
                <label htmlFor="email" className={cn("block", labelClass)}>
                  Email address
                </label>
                <div className="mt-2 flex flex-col gap-3 md:flex-row">
                  <Input
                    ref={inputRef}
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
                  One email when an incident opens and one when it is
                  resolved. Every email has an unsubscribe link.
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
          <section
            key={incident.title}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
              <h3 className="font-sans text-body font-medium">
                {incident.title}
              </h3>
              <State word="Resolved" tone="neutral" />
            </div>
            <div className={cn("mt-2 flex flex-wrap gap-x-5", figureClass)}>
              <time dateTime={incident.date}>{incident.dateLabel}</time>
              <span>{incident.duration}</span>
            </div>
            <ol className="mt-5">
              {incident.updates.map((update) => (
                <li key={update.kind} className="border-t py-3 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-label text-foreground uppercase">
                      {update.kind}
                    </span>
                    <time
                      dateTime={`${incident.date}T${update.time}Z`}
                      className={figureClass}
                    >
                      {update.time}
                    </time>
                  </div>
                  <p className="mt-1 max-w-md text-body">{update.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>

      <footer className="mx-auto flex max-w-3xl flex-wrap justify-between gap-x-5 gap-y-1 px-3 pb-5 md:px-5">
        <span className={labelClass}>Northgate Parcels Ltd, 2026</span>
        <span className={labelClass}>All times UTC</span>
      </footer>
    </div>
  )
}

export default App
