import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CONTAINER = "mx-auto max-w-[1280px] px-4 md:px-6"
const LABEL = "font-mono text-label uppercase"
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  FOCUS
)
const TITLE_LINK = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const NAV_LINK = cn(
  LABEL,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const NAV = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const SCREEN = "Screen 1"

type Showing = { time: string; qa?: boolean }
type Day = { date: string; short: string; full: string; times: Showing[] }

const DAYS: Day[] = [
  {
    date: "2026-11-11",
    short: "Wed 11 Nov",
    full: "Wednesday 11 November",
    times: [{ time: "17:30" }, { time: "20:15" }],
  },
  {
    date: "2026-11-12",
    short: "Thu 12 Nov",
    full: "Thursday 12 November",
    times: [{ time: "18:00" }, { time: "20:45" }],
  },
  {
    date: "2026-11-13",
    short: "Fri 13 Nov",
    full: "Friday 13 November",
    times: [{ time: "17:00" }, { time: "20:30", qa: true }, { time: "22:45" }],
  },
  {
    date: "2026-11-14",
    short: "Sat 14 Nov",
    full: "Saturday 14 November",
    times: [{ time: "16:30" }, { time: "19:15" }, { time: "22:00" }],
  },
  {
    date: "2026-11-15",
    short: "Sun 15 Nov",
    full: "Sunday 15 November",
    times: [{ time: "13:30" }, { time: "16:15" }, { time: "19:00" }],
  },
]

const CREDITS = [
  { role: "Director", name: "Ada Kessler" },
  { role: "Written by", name: "Ada Kessler, Sindre Vold" },
  { role: "Maren", name: "Ingrid Solberg" },
  { role: "Cinematography", name: "Hanne Kvist" },
  { role: "Music", name: "Oskar Lunde" },
  { role: "Editing", name: "Tora Brekke" },
]

type Choice = {
  date: string
  dayFull: string
  time: string
  screen: string
  qa: boolean
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center justify-between gap-4 py-4"
        )}
      >
        <a href="/" className={cn(TITLE_LINK, "font-heading text-h2")}>
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={NAV_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn(BUTTON, "md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        className="border-t border-border md:hidden"
        hidden={!open}
      >
        <div className={cn(CONTAINER, "py-2")}>
          <ul>
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(NAV_LINK, "block py-2")}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={TEXT_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(LABEL, "mt-12 text-muted-foreground")}>
          © 2026 The Vesper
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [choice, setChoice] = useState<Choice | null>(null)

  function choose(day: Day, showing: Showing) {
    setChoice((current) =>
      current && current.date === day.date && current.time === showing.time
        ? null
        : {
            date: day.date,
            dayFull: day.full,
            time: showing.time,
            screen: SCREEN,
            qa: Boolean(showing.qa),
          }
    )
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />

      <main className={cn(CONTAINER, "pt-12")}>
        <section>
          <p className={cn(LABEL, "text-muted-foreground")}>
            <a href="/" className={TEXT_LINK}>
              Programme
            </a>{" "}
            · Now showing
          </p>
          <h1 className="mt-2 text-h1 md:text-display">Low Tide at Merrow</h1>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <li className={cn(LABEL, "text-muted-foreground")}>
              <span className="sr-only">Year: </span>2026
            </li>
            <li className={cn(LABEL, "text-muted-foreground")}>Norway</li>
            <li className={cn(LABEL, "text-muted-foreground tabular-nums")}>
              118 min
            </li>
            <li className={cn(LABEL, "text-muted-foreground")}>Rated 15</li>
            <li className={cn(LABEL, "text-muted-foreground")}>Subtitled</li>
          </ul>

          <figure className="mt-12">
            <div
              role="img"
              aria-label="Still from Low Tide at Merrow: Maren on the ferry's open deck, the island behind her"
              className="aspect-video w-full rounded-xl border border-border bg-muted"
            />
            <figcaption className={cn(LABEL, "mt-2 text-muted-foreground")}>
              Ingrid Solberg as Maren · The ferry's open deck
            </figcaption>
          </figure>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <h2 className="text-h2 md:text-h1">Synopsis</h2>
            <p className="mt-4 max-w-xl">
              Maren pilots the night ferry on the mainland run. When her father
              dies, she goes back to Merrow, the island she left at nineteen,
              meaning to sell his house within the week and take the first boat
              home.
            </p>
            <p className="mt-4 max-w-xl">
              The harbour town is waiting for a storm. Every evening the radio
              moves it to the next night, and every evening the boats stay tied
              up, the shop runs low on bread and the people who knew her as a
              girl find reasons to call at the house.
            </p>
            <p className="mt-4 max-w-xl">
              Ada Kessler's second feature is a quiet film about what a place
              keeps of you after you leave it. Ingrid Solberg plays Maren with
              hardly a raised voice, and Hanne Kvist shoots the island in the
              grey light of a week that never quite breaks.
            </p>
          </div>

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2 md:text-h1">Credits</h2>
            <dl className="mt-6 border-b border-border">
              {CREDITS.map((credit) => (
                <div key={credit.role} className="border-t border-border py-4">
                  <dt className={cn(LABEL, "text-muted-foreground")}>
                    {credit.role}
                  </dt>
                  <dd className="mt-2 text-body">{credit.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="showtimes" className="mt-24">
          <h2 className="text-h2 md:text-h1">Showtimes</h2>
          <p className="mt-4 max-w-xl">
            Low Tide at Merrow plays on Screen 1, and every screening is in
            Norwegian with English subtitles.
          </p>

          <ul className="mt-6 border-b border-border">
            {DAYS.map((day) => (
              <li
                key={day.date}
                className="flex flex-col gap-2 border-t border-border py-4 md:flex-row md:items-center md:gap-6"
              >
                <p
                  className={cn(
                    LABEL,
                    "text-muted-foreground tabular-nums md:w-32 md:shrink-0"
                  )}
                >
                  <time dateTime={day.date}>{day.short}</time>
                </p>
                <div
                  role="group"
                  aria-label={`Times on ${day.full}`}
                  className="flex flex-wrap gap-2"
                >
                  {day.times.map((showing) => {
                    const pressed =
                      choice?.date === day.date && choice.time === showing.time
                    const stamp = (
                      <time dateTime={`${day.date}T${showing.time}`}>
                        {showing.time}
                      </time>
                    )
                    return (
                      <Button
                        key={showing.time}
                        variant={pressed ? "secondary" : "outline"}
                        aria-pressed={pressed}
                        className={cn(BUTTON, "tabular-nums")}
                        onClick={() => choose(day, showing)}
                      >
                        {showing.qa ? <span>{stamp} · Q&amp;A</span> : stamp}
                      </Button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p aria-live="polite">
              {choice
                ? `You have chosen ${choice.dayFull} at ${choice.time}, ${choice.screen}.${
                    choice.qa
                      ? " This screening is followed by a talk with Ada Kessler."
                      : ""
                  }`
                : "Choose a time to book seats."}
            </p>
            {choice && (
              <a
                href="#"
                className={cn(buttonVariants({ variant: "default" }), BUTTON)}
              >
                Book seats
              </a>
            )}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <figure className="md:col-span-8">
            <blockquote className="border-l-2 border-foreground pl-6">
              <p className="font-heading text-h2">
                Kessler keeps the storm offshore for two hours, and you feel
                every minute of the waiting.
              </p>
            </blockquote>
            <figcaption className={cn(LABEL, "mt-4 text-muted-foreground")}>
              Tomas Brecht · The Oldmere Review
            </figcaption>
          </figure>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
