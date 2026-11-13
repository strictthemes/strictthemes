import { Fragment, useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GATES_OPEN = new Date("2026-12-04T16:00:00+01:00")
const GATES_OPEN_MS = GATES_OPEN.getTime()

const container = "mx-auto max-w-[1200px] px-3 md:px-5"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const navLink = cn(label, "underline-offset-4 hover:underline", focusOutline)
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusOutline
)
const buttonClasses =
  "h-auto px-5 py-2 font-mono text-label font-bold uppercase"

const navItems = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets" },
  { label: "Info", href: "/info" },
]

const acts = [
  { name: "Ossa Bloom", slug: "ossa-bloom", headliner: true },
  { name: "The Night Ferries", slug: "the-night-ferries", headliner: true },
  { name: "Kettle Drum Union", slug: "kettle-drum-union", headliner: true },
  { name: "Lumen Varga", slug: "lumen-varga", headliner: false },
  { name: "Sister Antenna", slug: "sister-antenna", headliner: false },
  { name: "Pia Strand", slug: "pia-strand", headliner: false },
  { name: "Odd Weather", slug: "odd-weather", headliner: false },
  { name: "Gravel & Gold", slug: "gravel-and-gold", headliner: false },
  { name: "Juno Halde", slug: "juno-halde", headliner: false },
  { name: "Neon Allotment", slug: "neon-allotment", headliner: false },
]

const facts = [
  {
    label: "Acts",
    value: <>19</>,
    text: "Bands, live sets and design talks across two days.",
  },
  {
    label: "Stages",
    value: <>3</>,
    text: "Two for music and one, the Drawing Office, for talks and workshops.",
  },
  {
    label: "Last train",
    value: <time dateTime="01:40">01:40</time>,
    text: "Extra trains run back to Varsby Central after both nights.",
  },
]

function timeLeft() {
  return Math.max(0, GATES_OPEN_MS - Date.now())
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function count(value: number, noun: string) {
  return `${value} ${noun}${value === 1 ? "" : "s"}`
}

function sentenceFor(ms: number) {
  if (ms <= 0) return "The gates are open."
  const totalMinutes = Math.floor(ms / 60000)
  if (totalMinutes === 0) return "Less than a minute until the gates open."
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []
  if (days > 0) parts.push(count(days, "day"))
  if (hours > 0) parts.push(count(hours, "hour"))
  if (minutes > 0) parts.push(count(minutes, "minute"))
  let words = parts[0]
  if (parts.length === 2) words = `${parts[0]} and ${parts[1]}`
  if (parts.length === 3) words = `${parts[0]}, ${parts[1]} and ${parts[2]}`
  return `${words} until the gates open.`
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="border-b border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusOutline
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={navLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden md:block")}>
          <time dateTime="2026-12-04">4</time>–
          <time dateTime="2026-12-05">5 Dec 2026</time>
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonClasses, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(navLink, "block py-2")}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Countdown() {
  const [remaining, setRemaining] = useState(timeLeft)

  useEffect(() => {
    if (timeLeft() <= 0) return
    const id = window.setInterval(() => {
      const left = timeLeft()
      setRemaining(left)
      if (left <= 0) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const totalSeconds = Math.floor(remaining / 1000)
  const units = [
    { label: "Days", value: Math.floor(totalSeconds / 86400) },
    { label: "Hours", value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((totalSeconds % 3600) / 60) },
    { label: "Seconds", value: totalSeconds % 60 },
  ]
  const isOpen = remaining <= 0

  return (
    <section
      aria-labelledby="countdown-heading"
      className="flex flex-col gap-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="countdown-heading" className="text-h2 md:text-h1">
          {isOpen ? "Gates are open" : "Gates open in"}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <div
          aria-hidden="true"
          className="grid grid-cols-2 gap-5 md:flex md:items-center md:gap-8"
        >
          {units.map((unit, index) => (
            <Fragment key={unit.label}>
              {index > 0 && (
                <div className="hidden flex-col gap-2 md:flex">
                  <span className="size-3 rounded-full bg-foreground" />
                  <span className="size-3 rounded-full bg-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="font-heading text-h1 tabular-nums md:text-display">
                  {pad(unit.value)}
                </span>
                <span className={label}>{unit.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
        <p className="sr-only">{sentenceFor(remaining)}</p>
        <p className={label}>
          <time dateTime="2026-12-04T16:00+01:00">Fri 4 Dec · 16:00</time>
        </p>
      </div>
    </section>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />
      <main className={cn(container, "flex flex-col gap-16 py-8 md:py-16")}>
        <section aria-labelledby="hero-heading" className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className={label}>Music and design · Varsby Docks</p>
            <h1 id="hero-heading" className="text-h1 md:text-display">
              Tremor Days
            </h1>
          </div>
          <p className="font-heading text-h2">
            <time dateTime="2026-12-04">4</time>–
            <time dateTime="2026-12-05">5 December 2026</time> · Varsby Docks
          </p>
          <p className="max-w-xl text-body">
            Two days of live music, design talks and workshops in the old
            harbour at Varsby Docks. Nineteen acts play across three stages,
            from the cranes by the water to the old Drawing Office.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/tickets"
              className={cn(
                buttonVariants({ variant: "default" }),
                buttonClasses
              )}
            >
              Buy tickets
            </a>
            <a
              href="/line-up"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                buttonClasses
              )}
            >
              See the line-up
            </a>
          </div>
        </section>

        <Countdown />

        <section
          aria-labelledby="names-heading"
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="names-heading" className="text-h2 md:text-h1">
              First names
            </h2>
            <a href="/line-up" className={textLink}>
              Full line-up
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {acts.map((act) => (
                <li key={act.slug}>
                  <a
                    href={`/artists/${act.slug}`}
                    className={cn(
                      "font-heading text-foreground underline-offset-4 hover:underline",
                      act.headliner ? "text-h2 md:text-h1" : "text-h2",
                      focusOutline
                    )}
                  >
                    {act.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-label text-muted-foreground">
              Nine more acts on the full line-up.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="facts-heading"
          className="flex flex-col gap-8"
        >
          <h2 id="facts-heading" className="sr-only">
            The festival in numbers
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:col-span-4"
              >
                <p className={label}>{fact.label}</p>
                <p className="font-heading text-h1 tabular-nums">
                  {fact.value}
                </p>
                <p className="text-body">{fact.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="tickets-heading"
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3">
              <h2 id="tickets-heading" className="text-h2 md:text-h1">
                Tickets on sale
              </h2>
              <p className="text-body">
                Weekend €118, day tickets from €64. Saturday day tickets are
                sold out.
              </p>
            </div>
            <a
              href="/tickets"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                buttonClasses,
                "self-start md:shrink-0 md:self-auto"
              )}
            >
              Buy tickets
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className={cn(container, "flex flex-col gap-3 py-8")}>
          <p className="font-heading text-h2">Tremor Days</p>
          <p className="text-body">
            A two-day music and design festival in the old harbour at Varsby
            Docks.
          </p>
          <p className={label}>
            Varsby Docks · <time dateTime="2026-12-04">4</time>–
            <time dateTime="2026-12-05">5 Dec 2026</time> · © 2026 Tremor Days
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
