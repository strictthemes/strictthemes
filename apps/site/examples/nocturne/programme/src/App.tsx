import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DayKey =
  "2026-11-11" | "2026-11-12" | "2026-11-13" | "2026-11-14" | "2026-11-15"

type Day = {
  date: DayKey
  button: string
  label: string
}

type Film = {
  title: string
  href: string
  director: string
  country: string
  year: number
  minutes: number
  rating: string
  screen: number
  premiere?: boolean
  times: Partial<Record<DayKey, string[]>>
}

const days: Day[] = [
  { date: "2026-11-11", button: "Today", label: "Wed 11 Nov" },
  { date: "2026-11-12", button: "Thu 12", label: "Thu 12 Nov" },
  { date: "2026-11-13", button: "Fri 13", label: "Fri 13 Nov" },
  { date: "2026-11-14", button: "Sat 14", label: "Sat 14 Nov" },
  { date: "2026-11-15", button: "Sun 15", label: "Sun 15 Nov" },
]

const films: Film[] = [
  {
    title: "Low Tide at Merrow",
    href: "/film",
    director: "Ada Kessler",
    country: "Norway",
    year: 2026,
    minutes: 118,
    rating: "15",
    screen: 1,
    premiere: true,
    times: {
      "2026-11-11": ["17:45", "20:30"],
      "2026-11-12": ["19:30"],
      "2026-11-13": ["16:30", "20:45"],
      "2026-11-14": ["16:45", "19:15", "22:15"],
      "2026-11-15": ["15:30", "18:15"],
    },
  },
  {
    title: "Night Ferry to Halvik",
    href: "#",
    director: "Jonas Brask",
    country: "Denmark",
    year: 2025,
    minutes: 96,
    rating: "12A",
    screen: 2,
    times: {
      "2026-11-11": ["18:00"],
      "2026-11-13": ["17:00", "19:15", "22:00"],
      "2026-11-14": ["18:45"],
      "2026-11-15": ["16:15"],
    },
  },
  {
    title: "The Glass Year",
    href: "#",
    director: "Inès Lavalle",
    country: "France",
    year: 2026,
    minutes: 131,
    rating: "15",
    screen: 3,
    times: {
      "2026-11-11": ["19:30"],
      "2026-11-12": ["18:00"],
      "2026-11-13": ["17:15"],
      "2026-11-14": ["17:00"],
      "2026-11-15": ["14:30", "19:00"],
    },
  },
  {
    title: "A Room Above the Station",
    href: "#",
    director: "Tomasz Wierzba",
    country: "Poland",
    year: 2024,
    minutes: 104,
    rating: "PG",
    screen: 2,
    times: {
      "2026-11-11": ["20:00"],
      "2026-11-12": ["17:45", "20:15"],
      "2026-11-14": ["16:30", "20:45"],
      "2026-11-15": ["14:00", "18:30"],
    },
  },
  {
    title: "Small Hours",
    href: "#",
    director: "Noor Hadid",
    country: "Lebanon",
    year: 2026,
    minutes: 88,
    rating: "15",
    screen: 3,
    times: {
      "2026-11-11": ["17:30"],
      "2026-11-13": ["19:45", "22:45"],
      "2026-11-14": ["19:45", "23:15"],
    },
  },
  {
    title: "The Quiet Lift",
    href: "#",
    director: "Mirela Dobre",
    country: "Romania",
    year: 2025,
    minutes: 99,
    rating: "12A",
    screen: 1,
    times: {
      "2026-11-12": ["17:30"],
      "2026-11-13": ["18:45"],
      "2026-11-15": ["13:30", "20:30"],
    },
  },
]

const navLinks = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonText = "h-auto px-6 py-2 font-mono text-label uppercase"
const mutedLabel = "font-mono text-label text-muted-foreground uppercase"

function filmsOn(date: DayKey) {
  return films
    .flatMap((film) => {
      const times = film.times[date]
      return times && times.length > 0 ? [{ film, times }] : []
    })
    .sort((a, b) => a.times[0].localeCompare(b.times[0]))
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [chosen, setChosen] = useState<DayKey>("2026-11-11")
  const menuButton = useRef<HTMLButtonElement>(null)

  const day = days.find((item) => item.date === chosen) ?? days[0]
  const listing = filmsOn(chosen)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
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
          <a href="/" className={cn("font-heading text-h2", titleLink)}>
            The Vesper
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === "/" ? "page" : undefined}
                    className={cn(navLink, link.href === "/" && "underline")}
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
            className={cn(buttonText, "md:hidden")}
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
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.href === "/" ? "page" : undefined}
                    className={cn(
                      navLink,
                      "block py-2",
                      link.href === "/" && "underline"
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
          <h1 className={cn(mutedLabel, "tabular-nums")}>
            What&apos;s on · <time dateTime="2026-11-11">11</time>–
            <time dateTime="2026-11-15">15 Nov</time>
          </h1>
          <div className={cn(grid, "mt-6")}>
            <figure className="md:col-span-7">
              <div
                role="img"
                aria-label="Still from Low Tide at Merrow: Maren sits on the harbour wall at dusk, the tide far out behind her"
                className="aspect-video rounded-xl border border-border bg-muted"
              />
              <figcaption className={cn(mutedLabel, "mt-2")}>
                Low Tide at Merrow · Maren on the harbour wall at dusk
              </figcaption>
            </figure>
            <div className="mt-6 md:col-span-5 md:mt-0">
              <p className={mutedLabel}>Featured · Opens today</p>
              <h2 className="mt-2 text-h1 md:text-display">
                Low Tide at Merrow
              </h2>
              <p className="mt-4 text-body text-muted-foreground">
                Ada Kessler · Norway · 2026
              </p>
              <p className={cn(mutedLabel, "mt-2 tabular-nums")}>
                118 min · Rated 15 · Screen 1
              </p>
              <p className="mt-4 max-w-xl">
                When the ferry stops running for the winter, Maren stays behind
                to close her late father&apos;s boatyard and finds his logbooks,
                kept for a sea that no longer reaches the slipway. Ada Kessler
                films one long season of ebb in a Norwegian harbour town, and
                the few people still waiting there for the water to come back.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    buttonText
                  )}
                >
                  Book tickets
                </a>
                <a href="/film" className={textLink}>
                  About the film
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-h2 md:text-h1">Listings</h2>
          <div
            role="group"
            aria-label="Choose a day"
            className="mt-6 flex flex-wrap gap-2"
          >
            {days.map((item) => {
              const pressed = item.date === chosen
              return (
                <Button
                  key={item.date}
                  variant={pressed ? "secondary" : "outline"}
                  aria-pressed={pressed}
                  className={cn(buttonText, "tabular-nums")}
                  onClick={() => setChosen(item.date)}
                >
                  <time dateTime={item.date}>{item.button}</time>
                </Button>
              )
            })}
          </div>
          <p aria-live="polite" className={cn(mutedLabel, "mt-4 tabular-nums")}>
            <time dateTime={day.date}>{day.label}</time> · {listing.length}{" "}
            {listing.length === 1 ? "film" : "films"}
          </p>

          <ul className="mt-6 border-b border-border">
            {listing.map(({ film, times }) => (
              <li key={film.title} className="border-t border-border py-6">
                <article className="flex gap-4 md:gap-6">
                  <div
                    role="img"
                    aria-label={`Poster for ${film.title}`}
                    className="flex aspect-2/3 w-24 shrink-0 items-end self-start rounded-xl border border-border bg-muted p-2 md:w-32"
                  >
                    <span className="font-mono text-label text-muted-foreground">
                      {film.year}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    {film.premiere && (
                      <Badge
                        variant="secondary"
                        className="flex h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                      >
                        Premiere
                      </Badge>
                    )}
                    <h3 className={cn("text-h2", film.premiere && "mt-2")}>
                      <a href={film.href} className={titleLink}>
                        {film.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-body text-muted-foreground">
                      {film.director} · {film.country} · {film.year}
                    </p>
                    <p className={cn(mutedLabel, "mt-2 tabular-nums")}>
                      {film.minutes} min · Rated {film.rating} · Screen{" "}
                      {film.screen}
                    </p>
                    <ul
                      aria-label="Showtimes"
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {times.map((time) => (
                        <li key={time}>
                          <a
                            href="#"
                            className={cn(
                              buttonVariants({ variant: "outline" }),
                              "h-auto px-4 py-2 font-mono text-label uppercase tabular-nums"
                            )}
                          >
                            <time dateTime={`${chosen}T${time}`}>{time}</time>
                            {time >= "22:00" && " · Late"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(grid, "mt-24")}>
          <div className="rounded-xl border border-border bg-card p-6 md:col-span-6">
            <p className={cn(mutedLabel, "tabular-nums")}>
              Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
              <time dateTime="2026-12-18">18 Dec</time>
            </p>
            <h2 className="mt-2 text-h2">Ilse Varga: the night films</h2>
            <p className="mt-4 max-w-xl">
              Five features the Hungarian director shot between dusk and dawn,
              one each Friday on Screen 2, opening on Friday 20 November with
              &quot;The Tram Depot&quot;.
            </p>
            <a
              href="/season"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                buttonText,
                "mt-6"
              )}
            >
              See the season
            </a>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-card p-6 md:col-span-6 md:mt-0">
            <p className={mutedLabel}>Membership</p>
            <h2 className="mt-2 text-h2">Two films a month, on us</h2>
            <p className="mt-4 max-w-xl">
              Members get two tickets every month, a day&apos;s head start on
              booking for premieres and a tenth off at the late bar.
            </p>
            <a
              href="/membership"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonText,
                "mt-6"
              )}
            >
              Become a member
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-24 border-t border-border py-12">
        <div className={container}>
          <div className={grid}>
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Vesper</p>
              <p className="mt-2 text-body text-muted-foreground">
                21 Tallow Row, Oldmere OM2 4LT
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={textLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(mutedLabel, "mt-12")}>© 2026 The Vesper</p>
        </div>
      </footer>
    </div>
  )
}

export default App
