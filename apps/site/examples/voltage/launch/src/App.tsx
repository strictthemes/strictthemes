import { Fragment, useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GATES_OPEN = new Date("2026-12-04T16:00:00+01:00")

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
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"

const navItems = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets" },
  { label: "Info", href: "/info" },
]

const acts = [
  { name: "Ossa Bloom", slug: "ossa-bloom" },
  { name: "The Night Ferries", slug: "the-night-ferries" },
  { name: "Kettle Drum Union", slug: "kettle-drum-union" },
  { name: "Lumen Varga", slug: "lumen-varga" },
  { name: "Sister Antenna", slug: "sister-antenna" },
  { name: "Pia Strand", slug: "pia-strand" },
  { name: "Odd Weather", slug: "odd-weather" },
  { name: "Gravel & Gold", slug: "gravel-and-gold" },
  { name: "Juno Halde", slug: "juno-halde" },
  { name: "Neon Allotment", slug: "neon-allotment" },
]

function secondsUntilGates() {
  return Math.max(0, Math.ceil((GATES_OPEN.getTime() - Date.now()) / 1000))
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

function timeLeftInWords(secondsLeft: number) {
  if (secondsLeft <= 0) return "The gates are open."
  const totalMinutes = Math.floor(secondsLeft / 60)
  if (totalMinutes === 0) return "Less than a minute until the gates open."

  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts = [
    days > 0 ? plural(days, "day") : null,
    hours > 0 ? plural(hours, "hour") : null,
    minutes > 0 ? plural(minutes, "minute") : null,
  ].filter((part): part is string => part !== null)

  const joined =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
  return `${joined} until the gates open.`
}

function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(secondsUntilGates)

  useEffect(() => {
    if (secondsUntilGates() <= 0) return
    const id = window.setInterval(() => {
      const next = secondsUntilGates()
      setSecondsLeft(next)
      if (next <= 0) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return secondsLeft
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
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
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
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

function Hero() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className={label}>Music and design · Varsby Docks</p>
        <h1 className="text-h1 md:text-display">Tremor Days</h1>
      </div>
      <p className="font-heading text-h2">
        <time dateTime="2026-12-04">4</time>–
        <time dateTime="2026-12-05">5 December 2026</time> · Varsby Docks
      </p>
      <p className="max-w-xl">
        Two days of bands, live sets and design talks in the old harbour of
        Varsby, with three stages between the cranes and the pump house.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/tickets"
          className={cn(buttonVariants({ variant: "default" }), buttonText)}
        >
          Buy tickets
        </a>
        <a
          href="/line-up"
          className={cn(buttonVariants({ variant: "secondary" }), buttonText)}
        >
          See the line-up
        </a>
      </div>
    </section>
  )
}

function Countdown() {
  const secondsLeft = useCountdown()
  const isOpen = secondsLeft <= 0
  const units = [
    { label: "Days", value: Math.floor(secondsLeft / 86400) },
    { label: "Hours", value: Math.floor((secondsLeft % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((secondsLeft % 3600) / 60) },
    { label: "Seconds", value: secondsLeft % 60 },
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
        <p className="sr-only">{timeLeftInWords(secondsLeft)}</p>
        <p className={cn(label, "tabular-nums")}>
          <time dateTime="2026-12-04T16:00+01:00">Fri 4 Dec · 16:00</time>
        </p>
      </div>
    </section>
  )
}

function FirstNames() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 md:text-h1">First names</h2>
        <a href="/line-up" className={textLink}>
          Full line-up
        </a>
      </div>
      <div className="flex flex-col gap-3">
        <ul className="flex list-none flex-wrap items-baseline gap-x-5 gap-y-2 p-0">
          {acts.map((act, index) => (
            <li key={act.slug}>
              <a
                href={`/artists/${act.slug}`}
                className={cn(
                  "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
                  index < 3 && "md:text-h1",
                  focusRing
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
  )
}

const facts = [
  {
    label: "Acts",
    value: "19",
    text: "Bands, live sets and design talks across two days.",
  },
  {
    label: "Stages",
    value: "3",
    text: "Two for music and one, the Drawing Office, for talks and workshops.",
  },
  {
    label: "Last train",
    value: <time dateTime="01:40">01:40</time>,
    text: "Extra trains run back to Varsby Central after both nights.",
  },
]

function Facts() {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="sr-only">The festival in numbers</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:col-span-4"
          >
            <p className={label}>{fact.label}</p>
            <p className="font-heading text-h1 tabular-nums">{fact.value}</p>
            <p>{fact.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Tickets() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 md:text-h1">Tickets on sale</h2>
          <p className="max-w-xl">
            Weekend €118, day tickets from €64. Saturday day tickets are sold
            out.
          </p>
        </div>
        <a
          href="/tickets"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            buttonText,
            "self-start md:shrink-0 md:self-auto"
          )}
        >
          Buy tickets
        </a>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p>A two-day music and design festival at Varsby Docks.</p>
        <p className={cn(label, "tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <Hero />
        <Countdown />
        <FirstNames />
        <Facts />
        <Tickets />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
