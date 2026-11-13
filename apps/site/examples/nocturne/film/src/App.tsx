import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const credits = [
  { role: "Director", names: "Ada Kessler" },
  { role: "Written by", names: "Ada Kessler, Sindre Vold" },
  { role: "Maren", names: "Ingrid Solberg" },
  { role: "Cinematography", names: "Hanne Kvist" },
  { role: "Music", names: "Oskar Lunde" },
  { role: "Editing", names: "Tora Brekke" },
]

type Screening = { time: string; talk?: boolean }
type Day = { date: string; short: string; full: string; times: Screening[] }

const days: Day[] = [
  {
    date: "2026-11-11",
    short: "Wed 11 Nov",
    full: "Wednesday 11 November",
    times: [{ time: "17:30" }, { time: "21:00" }],
  },
  {
    date: "2026-11-12",
    short: "Thu 12 Nov",
    full: "Thursday 12 November",
    times: [{ time: "17:30" }, { time: "21:00" }],
  },
  {
    date: "2026-11-13",
    short: "Fri 13 Nov",
    full: "Friday 13 November",
    times: [
      { time: "16:30" },
      { time: "20:30", talk: true },
      { time: "23:15" },
    ],
  },
  {
    date: "2026-11-14",
    short: "Sat 14 Nov",
    full: "Saturday 14 November",
    times: [{ time: "16:30" }, { time: "20:00" }, { time: "23:15" }],
  },
  {
    date: "2026-11-15",
    short: "Sun 15 Nov",
    full: "Sunday 15 November",
    times: [{ time: "13:30" }, { time: "17:00" }, { time: "20:30" }],
  },
]

type Choice = { date: string; time: string; screen: string }

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const [choice, setChoice] = useState<Choice | null>(null)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  function choose(date: string, time: string) {
    setChoice((current) =>
      current && current.date === date && current.time === time
        ? null
        : { date, time, screen: "Screen 1" }
    )
  }

  const chosenDay = choice ? days.find((d) => d.date === choice.date) : null
  const chosenScreening = chosenDay?.times.find((t) => t.time === choice?.time)

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-4 py-4"
          )}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
            )}
          >
            The Vesper
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-nav"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(navLink, "block py-2")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section>
          <p className={cn(label, "text-muted-foreground")}>
            <a href="/" className={textLink}>
              Programme
            </a>{" "}
            · Now showing
          </p>
          <h1 className="mt-2 text-h1 md:text-display">Low Tide at Merrow</h1>
          <ul
            className={cn(
              label,
              "mt-4 flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground tabular-nums"
            )}
          >
            <li>
              <span className="sr-only">Year: </span>2026
            </li>
            <li>Norway</li>
            <li>118 min</li>
            <li>Rated 15</li>
            <li>Subtitled</li>
          </ul>

          <figure className="mt-12">
            <div
              role="img"
              aria-label="Still from Low Tide at Merrow: Maren on the ferry's open deck, the island behind her"
              className="aspect-video w-full rounded-xl border border-border bg-muted"
            />
            <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
              Ingrid Solberg as Maren · The ferry's open deck
            </figcaption>
          </figure>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <h2 className="text-h2 md:text-h1">Synopsis</h2>
            <p className="mt-4 max-w-xl">
              Maren pilots the car ferry on the mainland run and has not set
              foot on Merrow since she left at nineteen. When her father dies,
              she goes back for one week to clear his house and sell it to the
              first person who asks.
            </p>
            <p className="mt-4 max-w-xl">
              The harbour town is waiting for a storm. Boats are tied double,
              the shop has sold out of candles, and every evening the radio
              moves the storm to the next night. Nobody leaves, and nobody wants
              to buy a house.
            </p>
            <p className="mt-4 max-w-xl">
              Ada Kessler shot the film on the island over one winter, with a
              cast that is mostly local. It is a quiet, patient film about the
              people who stay, and about what a place keeps of the ones who go.
            </p>
          </div>
          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2 md:text-h1">Credits</h2>
            <dl className="mt-6 border-b border-border">
              {credits.map((credit) => (
                <div key={credit.role} className="border-t border-border py-4">
                  <dt className={cn(label, "text-muted-foreground")}>
                    {credit.role}
                  </dt>
                  <dd className="mt-2 text-body">{credit.names}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="showtimes" className="mt-24">
          <h2 className="text-h2 md:text-h1">Showtimes</h2>
          <p className="mt-4 max-w-xl">
            Every screening is on Screen 1, in Norwegian with English subtitles.
          </p>
          <ul className="mt-6 border-b border-border">
            {days.map((day) => (
              <li
                key={day.date}
                className="flex flex-col gap-2 border-t border-border py-4 md:flex-row md:items-center md:gap-6"
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:w-32 md:shrink-0"
                  )}
                >
                  <time dateTime={day.date}>{day.short}</time>
                </p>
                <div
                  role="group"
                  aria-label={`Times on ${day.full}`}
                  className="flex min-w-0 flex-wrap gap-2"
                >
                  {day.times.map((screening) => {
                    const chosen =
                      choice?.date === day.date &&
                      choice.time === screening.time
                    const time = (
                      <time dateTime={`${day.date}T${screening.time}`}>
                        {screening.time}
                      </time>
                    )
                    return (
                      <Button
                        key={screening.time}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        className={cn(buttonClasses, "tabular-nums")}
                        onClick={() => choose(day.date, screening.time)}
                      >
                        {screening.talk ? <span>{time} · Q&amp;A</span> : time}
                      </Button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p aria-live="polite" className="text-body">
              {choice && chosenDay
                ? `You have chosen ${chosenDay.full} at ${choice.time}, ${choice.screen}.${
                    chosenScreening?.talk
                      ? " This screening is followed by a talk with Ada Kessler."
                      : ""
                  }`
                : "Choose a time to book seats."}
            </p>
            {choice && (
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
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
            <figcaption className={cn(label, "mt-4 text-muted-foreground")}>
              Tomas Brecht · The Oldmere Review
            </figcaption>
          </figure>
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className={container}>
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Vesper</p>
              <p className="mt-2 text-body text-muted-foreground">
                21 Tallow Row, Oldmere OM2 4LT
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:col-start-7 md:mt-0">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={textLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(label, "mt-12 text-muted-foreground")}>
            © 2026 The Vesper
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
