import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusOutline
)

const navLinks = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const details = ["Norway", "118 min", "Rated 15", "Subtitled"]

const credits = [
  { role: "Director", name: "Ada Kessler" },
  { role: "Written by", name: "Ada Kessler, Sindre Vold" },
  { role: "Maren", name: "Ingrid Solberg" },
  { role: "Cinematography", name: "Hanne Kvist" },
  { role: "Music", name: "Oskar Lunde" },
  { role: "Editing", name: "Tora Brekke" },
]

type Showtime = {
  time: string
  screen: string
  talk?: boolean
}

type Day = {
  date: string
  short: string
  full: string
  times: Showtime[]
}

const days: Day[] = [
  {
    date: "2026-11-11",
    short: "Wed 11 Nov",
    full: "Wednesday 11 November",
    times: [
      { time: "17:45", screen: "Screen 1" },
      { time: "20:30", screen: "Screen 1" },
    ],
  },
  {
    date: "2026-11-12",
    short: "Thu 12 Nov",
    full: "Thursday 12 November",
    times: [
      { time: "18:00", screen: "Screen 1" },
      { time: "20:45", screen: "Screen 1" },
    ],
  },
  {
    date: "2026-11-13",
    short: "Fri 13 Nov",
    full: "Friday 13 November",
    times: [
      { time: "17:15", screen: "Screen 1" },
      { time: "20:30", screen: "Screen 1", talk: true },
      { time: "23:00", screen: "Screen 1" },
    ],
  },
  {
    date: "2026-11-14",
    short: "Sat 14 Nov",
    full: "Saturday 14 November",
    times: [
      { time: "16:45", screen: "Screen 1" },
      { time: "19:45", screen: "Screen 1" },
      { time: "22:45", screen: "Screen 1" },
    ],
  },
  {
    date: "2026-11-15",
    short: "Sun 15 Nov",
    full: "Sunday 15 November",
    times: [
      { time: "14:00", screen: "Screen 1" },
      { time: "17:15", screen: "Screen 1" },
      { time: "20:15", screen: "Screen 1" },
    ],
  },
]

type Choice = {
  date: string
  day: string
  time: string
  screen: string
  talk: boolean
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [choice, setChoice] = useState<Choice | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  function choose(day: Day, showtime: Showtime) {
    setChoice((current) =>
      current && current.date === day.date && current.time === showtime.time
        ? null
        : {
            date: day.date,
            day: day.full,
            time: showtime.time,
            screen: showtime.screen,
            talk: showtime.talk === true,
          }
    )
  }

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
              focusOutline
            )}
          >
            The Vesper
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      focusOutline
                    )}
                  >
                    {link.label}
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
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          className="border-t border-border md:hidden"
          hidden={!menuOpen}
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      "block py-2 font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      focusOutline
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section>
          <p className="font-mono text-label text-muted-foreground uppercase">
            <a href="/" className={textLink}>
              Programme
            </a>
            {" · Now showing"}
          </p>
          <h1 className="mt-2 text-h1 md:text-display">Low Tide at Merrow</h1>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <li className="font-mono text-label text-muted-foreground uppercase">
              <span className="sr-only">Year: </span>2026
            </li>
            {details.map((detail) => (
              <li
                key={detail}
                className="font-mono text-label text-muted-foreground uppercase"
              >
                {detail}
              </li>
            ))}
          </ul>
          <figure className="mt-12">
            <div
              role="img"
              aria-label="Still from Low Tide at Merrow: Maren on the ferry's open deck, the island behind her"
              className="aspect-video rounded-xl border border-border bg-muted"
            />
            <figcaption className="mt-2 font-mono text-label text-muted-foreground uppercase">
              Ingrid Solberg as Maren · The ferry&apos;s open deck
            </figcaption>
          </figure>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <h2 className="text-h2 md:text-h1">Synopsis</h2>
            <p className="mt-4 max-w-xl">
              Maren pilots the car ferry on a mainland route and has not been
              back to Merrow since she left at nineteen. When her father dies
              she takes a week of leave and crosses as a passenger, meaning to
              clear his house above the harbour, sign the papers and be gone
              before the weekend.
            </p>
            <p className="mt-4 max-w-xl">
              The town has other plans for the week. A storm is on its way, and
              the radio keeps moving it to the next night. Boats are hauled up
              the slip and left there, the school closes early, the buyer for
              the house stays on the mainland. Maren waits with everyone else,
              among people who remember her better than she remembers them.
            </p>
            <p className="mt-4 max-w-xl">
              Ada Kessler&apos;s second feature was shot over one autumn on an
              island off the Norwegian coast, with islanders in most of the
              smaller parts. It is in Norwegian with English subtitles and
              opens at The Vesper on Wednesday 11 November 2026.
            </p>
          </div>
          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2 md:text-h1">Credits</h2>
            <dl className="mt-6 border-b border-border">
              {credits.map((credit) => (
                <div key={credit.role} className="border-t border-border py-4">
                  <dt className="font-mono text-label text-muted-foreground uppercase">
                    {credit.role}
                  </dt>
                  <dd className="mt-1 text-body">{credit.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="showtimes" className="mt-24">
          <h2 className="text-h2 md:text-h1">Showtimes</h2>
          <p className="mt-4 max-w-xl">
            Low Tide at Merrow plays on Screen 1 all week, and every screening
            has English subtitles.
          </p>
          <ul className="mt-6 border-b border-border">
            {days.map((day) => (
              <li
                key={day.date}
                className="flex flex-col gap-2 border-t border-border py-4 md:flex-row md:items-center md:gap-6"
              >
                <p className="font-mono text-label text-muted-foreground uppercase tabular-nums md:w-32 md:shrink-0">
                  <time dateTime={day.date}>{day.short}</time>
                </p>
                <div
                  role="group"
                  aria-label={`Times on ${day.full}`}
                  className="flex flex-wrap gap-2"
                >
                  {day.times.map((showtime) => {
                    const chosen =
                      choice !== null &&
                      choice.date === day.date &&
                      choice.time === showtime.time
                    return (
                      <Button
                        key={showtime.time}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        className={cn(buttonClasses, "tabular-nums")}
                        onClick={() => choose(day, showtime)}
                      >
                        <span>
                          <time dateTime={`${day.date}T${showtime.time}`}>
                            {showtime.time}
                          </time>
                          {showtime.talk ? " · Q&A" : null}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p aria-live="polite" className="text-body">
              {choice === null
                ? "Choose a time to book seats."
                : `You have chosen ${choice.day} at ${choice.time}, ${choice.screen}.${
                    choice.talk
                      ? " This screening is followed by a talk with Ada Kessler."
                      : ""
                  }`}
            </p>
            {choice !== null ? (
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
              >
                Book seats
              </a>
            ) : null}
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
            <figcaption className="mt-4 font-mono text-label text-muted-foreground uppercase">
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
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={cn(textLink, "text-body")}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-12 font-mono text-label text-muted-foreground uppercase">
            © 2026 The Vesper
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
