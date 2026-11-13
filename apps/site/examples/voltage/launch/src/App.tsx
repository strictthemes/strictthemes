import { Fragment, useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GATES_OPEN = new Date("2026-12-04T16:00:00+01:00")

const container = "mx-auto max-w-[1200px] px-3 md:px-5"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase"
const navLink = cn(
  label,
  "text-foreground hover:underline underline-offset-4",
  focusRing
)
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusRing
)
const buttonClasses = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const panel = "flex flex-col gap-3 rounded-xl border border-border bg-card p-5"

const navItems = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets" },
  { label: "Info", href: "/info" },
]

const headliners = ["Ossa Bloom", "The Night Ferries", "Kettle Drum Union"]
const moreActs = [
  "Lumen Varga",
  "Sister Antenna",
  "Pia Strand",
  "Odd Weather",
  "Gravel & Gold",
  "Juno Halde",
  "Neon Allotment",
]

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .trim()
    .split(/\s+/)
    .join("-")
}

function secondsLeft() {
  return Math.max(0, Math.ceil((GATES_OPEN.getTime() - Date.now()) / 1000))
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

function timeLeftInWords(seconds: number) {
  if (seconds <= 0) return "The gates are open."
  const totalMinutes = Math.floor(seconds / 60)
  if (totalMinutes === 0) return "Less than a minute until the gates open."

  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []
  if (days > 0) parts.push(plural(days, "day"))
  if (hours > 0) parts.push(plural(hours, "hour"))
  if (minutes > 0) parts.push(plural(minutes, "minute"))

  let joined: string
  if (parts.length === 1) joined = parts[0]
  else if (parts.length === 2) joined = `${parts[0]} and ${parts[1]}`
  else joined = `${parts[0]}, ${parts[1]} and ${parts[2]}`

  return `${joined[0].toUpperCase()}${joined.slice(1)} until the gates open.`
}

function useCountdown() {
  const [seconds, setSeconds] = useState(secondsLeft)

  useEffect(() => {
    if (secondsLeft() === 0) return
    const id = window.setInterval(() => {
      const next = secondsLeft()
      setSeconds(next)
      if (next === 0) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return seconds
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground hover:underline underline-offset-4",
            focusRing
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
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <time dateTime="2026-12-04">4</time>–
          <time dateTime="2026-12-05">5 Dec 2026</time>
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn(buttonClasses, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="site-menu"
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
  const seconds = useCountdown()
  const isOpen = seconds === 0
  const units = [
    { label: "Days", value: Math.floor(seconds / 86400) },
    { label: "Hours", value: Math.floor((seconds % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((seconds % 3600) / 60) },
    { label: "Seconds", value: seconds % 60 },
  ]

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 md:text-h1">
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
        <p className="sr-only">{timeLeftInWords(seconds)}</p>
        <p className={cn(label, "tabular-nums")}>
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
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className={label}>Music and design · Varsby Docks</p>
            <h1 className="text-h1 md:text-display">Tremor Days</h1>
          </div>
          <p className="font-heading text-h2 tabular-nums">
            <time dateTime="2026-12-04">4</time>–
            <time dateTime="2026-12-05">5 December 2026</time> · Varsby Docks
          </p>
          <p className="max-w-xl">
            Two days of bands, live sets and design talks in the old harbour of
            Varsby. Three stages sit between the cranes and the pump house.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/tickets"
              className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
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

        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h2 md:text-h1">First names</h2>
            <a href="/line-up" className={textLink}>
              Full line-up
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              {headliners.map((name) => (
                <li key={name}>
                  <a
                    href={`/artists/${slugify(name)}`}
                    className={cn(
                      "font-heading text-h2 text-foreground hover:underline underline-offset-4 md:text-h1",
                      focusRing
                    )}
                  >
                    {name}
                  </a>
                </li>
              ))}
              {moreActs.map((name) => (
                <li key={name}>
                  <a
                    href={`/artists/${slugify(name)}`}
                    className={cn(
                      "font-heading text-h2 text-foreground hover:underline underline-offset-4",
                      focusRing
                    )}
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-label text-muted-foreground">
              Nine more acts on the full line-up.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="sr-only">The festival in numbers</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className={cn(panel, "md:col-span-4")}>
              <p className={label}>Acts</p>
              <p className="font-heading text-h1 tabular-nums">19</p>
              <p>Bands, live sets and design talks across two days.</p>
            </div>
            <div className={cn(panel, "md:col-span-4")}>
              <p className={label}>Stages</p>
              <p className="font-heading text-h1 tabular-nums">3</p>
              <p>
                Two for music and one, the Drawing Office, for talks and
                workshops.
              </p>
            </div>
            <div className={cn(panel, "md:col-span-4")}>
              <p className={label}>Last train</p>
              <p className="font-heading text-h1 tabular-nums">
                <time dateTime="01:40">01:40</time>
              </p>
              <p>Extra trains run back to Varsby Central after both nights.</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div
            className={cn(
              panel,
              "gap-5 md:flex-row md:items-center md:justify-between"
            )}
          >
            <div className="flex min-w-0 flex-col gap-3">
              <h2 className="text-h2 md:text-h1">Tickets on sale</h2>
              <p className="max-w-xl">
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
          <p>A two-day music and design festival at Varsby Docks.</p>
          <p className={cn(label, "tabular-nums")}>
            Varsby Docks · <time dateTime="2026-12-04">4</time>–
            <time dateTime="2026-12-05">5 Dec 2026</time> · © 2026 Tremor Days
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
