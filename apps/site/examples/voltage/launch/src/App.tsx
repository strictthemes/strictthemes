import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONTAINER = "mx-auto max-w-[1200px] px-3 md:px-5"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label font-bold uppercase"
const BUTTON_CLASSES = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const NAV_LINK = cn(
  LABEL,
  "text-foreground underline-offset-4 hover:underline",
  FOCUS
)
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  FOCUS
)

const GATES_OPEN = new Date("2026-12-04T16:00:00+01:00")

const NAV_LINKS = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets" },
  { label: "Info", href: "/info" },
]

const ACTS = [
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

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
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
          CONTAINER,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            FOCUS
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={NAV_LINK}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn(LABEL, "ml-auto hidden md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(BUTTON_CLASSES, "ml-auto md:hidden")}
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
        <div className={cn(CONTAINER, "py-2")}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(NAV_LINK, "block py-2")}
            >
              {link.label}
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
        <p className={LABEL}>Music and design · Varsby Docks</p>
        <h1 className="text-h1 md:text-display">Tremor Days</h1>
      </div>
      <p className="font-heading text-h2">
        <time dateTime="2026-12-04">4</time>–
        <time dateTime="2026-12-05">5 December 2026</time> · Varsby Docks
      </p>
      <p className="max-w-xl">
        Two days of live music and design talks in the old harbour sheds of
        Varsby. Bands play the cranes and pump rooms by night, designers take
        the drawing office by day.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/tickets"
          className={cn(buttonVariants({ variant: "default" }), BUTTON_CLASSES)}
        >
          Buy tickets
        </a>
        <a
          href="/line-up"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            BUTTON_CLASSES
          )}
        >
          See the line-up
        </a>
      </div>
    </section>
  )
}

type TimeLeft = {
  done: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(now: number): TimeLeft {
  const ms = GATES_OPEN.getTime() - now
  if (ms <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const totalSeconds = Math.floor(ms / 1000)
  return {
    done: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

function describeTimeLeft(left: TimeLeft) {
  if (left.done) return "The gates are open."
  const parts: string[] = []
  if (left.days > 0) parts.push(plural(left.days, "day"))
  if (left.hours > 0) parts.push(plural(left.hours, "hour"))
  if (left.minutes > 0) parts.push(plural(left.minutes, "minute"))
  if (parts.length === 0) return "Less than a minute until the gates open."
  let joined = parts[0]
  if (parts.length === 2) joined = `${parts[0]} and ${parts[1]}`
  if (parts.length === 3) joined = `${parts[0]}, ${parts[1]} and ${parts[2]}`
  return `${joined} until the gates open.`
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function CountdownDots() {
  return (
    <div className="hidden flex-col gap-2 md:flex">
      <span className="size-3 rounded-full bg-foreground" />
      <span className="size-3 rounded-full bg-foreground" />
    </div>
  )
}

function CountdownUnit({ value, noun }: { value: number; noun: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-heading text-h1 tabular-nums md:text-display">
        {pad(value)}
      </p>
      <p className={LABEL}>{value === 1 ? noun : `${noun}s`}</p>
    </div>
  )
}

function Countdown() {
  const [left, setLeft] = useState(() => getTimeLeft(Date.now()))

  useEffect(() => {
    if (left.done) return
    const id = setInterval(() => {
      const next = getTimeLeft(Date.now())
      setLeft(next)
      if (next.done) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [left.done])

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 md:text-h1">
          {left.done ? "Gates are open" : "Gates open in"}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <div
          aria-hidden="true"
          className="grid grid-cols-2 gap-5 md:flex md:items-center md:gap-8"
        >
          <CountdownUnit value={left.days} noun="Day" />
          <CountdownDots />
          <CountdownUnit value={left.hours} noun="Hour" />
          <CountdownDots />
          <CountdownUnit value={left.minutes} noun="Minute" />
          <CountdownDots />
          <CountdownUnit value={left.seconds} noun="Second" />
        </div>
        <p className="sr-only">{describeTimeLeft(left)}</p>
        <p className={LABEL}>
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
        <a href="/line-up" className={TEXT_LINK}>
          Full line-up
        </a>
      </div>
      <div className="flex flex-col gap-3">
        <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          {ACTS.map((act) => (
            <li key={act.slug}>
              <a
                href={`/artists/${act.slug}`}
                className={cn(
                  "font-heading text-foreground underline-offset-4 hover:underline",
                  act.headliner ? "text-h2 md:text-h1" : "text-h2",
                  FOCUS
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

function Facts() {
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
  return (
    <section className="flex flex-col gap-8">
      <h2 className="sr-only">The festival in numbers</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:col-span-4"
          >
            <p className={LABEL}>{fact.label}</p>
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
            BUTTON_CLASSES,
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
      <div className={cn(CONTAINER, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2">Tremor Days</p>
        <p>
          A two-day music and design festival in the old harbour at Varsby
          Docks.
        </p>
        <p className={LABEL}>
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
      <main className={cn(CONTAINER, "flex flex-col gap-16 py-8 md:py-16")}>
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
