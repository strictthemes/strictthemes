import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DayId =
  "2026-11-11" | "2026-11-12" | "2026-11-13" | "2026-11-14" | "2026-11-15"

type Day = {
  id: DayId
  button: string
  short: string
}

type Film = {
  title: string
  href: string
  director: string
  country: string
  year: number
  minutes: number
  rating: string
  screen: 1 | 2 | 3
  premiere?: boolean
  times: Partial<Record<DayId, string[]>>
}

const days: Day[] = [
  { id: "2026-11-11", button: "Today", short: "Wed 11 Nov" },
  { id: "2026-11-12", button: "Thu 12", short: "Thu 12 Nov" },
  { id: "2026-11-13", button: "Fri 13", short: "Fri 13 Nov" },
  { id: "2026-11-14", button: "Sat 14", short: "Sat 14 Nov" },
  { id: "2026-11-15", button: "Sun 15", short: "Sun 15 Nov" },
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
      "2026-11-11": ["17:30", "20:30"],
      "2026-11-12": ["18:00", "20:45"],
      "2026-11-13": ["16:30", "19:15", "22:00"],
      "2026-11-14": ["17:00", "20:00", "22:30"],
      "2026-11-15": ["13:30", "16:30", "19:30"],
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
    screen: 3,
    times: {
      "2026-11-11": ["18:00"],
      "2026-11-12": ["18:30"],
      "2026-11-13": ["18:00", "21:00"],
      "2026-11-14": ["19:45"],
      "2026-11-15": ["15:00", "18:45"],
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
    screen: 2,
    times: {
      "2026-11-11": ["18:15"],
      "2026-11-13": ["17:00", "20:15"],
      "2026-11-15": ["14:00", "18:00"],
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
      "2026-11-12": ["17:30", "20:00"],
      "2026-11-14": ["16:30", "19:00"],
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
      "2026-11-11": ["19:50"],
      "2026-11-12": ["20:40"],
      "2026-11-13": ["22:50"],
      "2026-11-14": ["18:00", "22:15"],
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
    screen: 2,
    times: {
      "2026-11-11": ["20:45"],
      "2026-11-13": ["22:45"],
      "2026-11-14": ["21:15"],
      "2026-11-15": ["16:20"],
    },
  },
]

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

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
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline aria-[current=page]:underline",
  focusRing
)

const buttonText = "h-auto px-6 py-2 font-mono text-label uppercase"

const label = "font-mono text-label uppercase"

function isLate(time: string) {
  return Number(time.slice(0, 2)) >= 22
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    const target = event.target as Node
    const inButton = buttonRef.current?.contains(target)
    const inMenu = menuRef.current?.contains(target)
    if (!inButton && !inMenu) return
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <a href="/" className={cn("font-heading text-h2", titleLink)}>
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === "/" ? "page" : undefined}
                  className={navLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={buttonRef}
          variant="outline"
          className={cn(buttonText, "md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <ul className="mx-auto max-w-[1280px] px-4 py-2 md:px-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.href === "/" ? "page" : undefined}
                className={cn("block py-2", navLink)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function FeaturedFilm() {
  return (
    <section>
      <h1 className={cn(label, "text-muted-foreground tabular-nums")}>
        What's on · <time dateTime="2026-11-11">11</time>–
        <time dateTime="2026-11-15">15 Nov</time>
      </h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <figure className="md:col-span-7">
          <div
            role="img"
            aria-label="Still from Low Tide at Merrow: Maren stands on the harbour wall at dusk, the sea behind her"
            className="aspect-video rounded-xl border border-border bg-muted"
          />
          <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
            Low Tide at Merrow · Maren on the harbour wall at dusk
          </figcaption>
        </figure>
        <div className="mt-6 md:col-span-5 md:mt-0">
          <p className={cn(label, "text-muted-foreground")}>
            Featured · Opens today
          </p>
          <h2 className="mt-2 text-h1 lg:text-display">Low Tide at Merrow</h2>
          <p className="mt-4 text-muted-foreground">
            Ada Kessler · Norway · 2026
          </p>
          <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
            118 min · Rated 15 · Screen 1
          </p>
          <p className="mt-4 max-w-xl">
            Maren comes home to Merrow the winter its harbour is sold, and finds
            the town already packing up around her. Kessler shoots the Norwegian
            coast in long, patient takes and lets the weather carry the story.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#" className={cn(buttonVariants(), buttonText)}>
              Book tickets
            </a>
            <a href="/film" className={textLink}>
              About the film
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Showtime({ day, time }: { day: DayId; time: string }) {
  const stamp = <time dateTime={`${day}T${time}`}>{time}</time>
  return (
    <a
      href="#"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-auto px-4 py-2 font-mono text-label uppercase tabular-nums"
      )}
    >
      {isLate(time) ? <span>{stamp} · Late</span> : stamp}
    </a>
  )
}

function FilmRow({ film, day }: { film: Film; day: DayId }) {
  const times = film.times[day] ?? []
  return (
    <li className="border-t border-border py-6">
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
          <p className="mt-2 text-muted-foreground">
            {film.director} · {film.country} · {film.year}
          </p>
          <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
            {film.minutes} min · Rated {film.rating} · Screen {film.screen}
          </p>
          <ul aria-label="Showtimes" className="mt-4 flex flex-wrap gap-2">
            {times.map((time) => (
              <li key={time}>
                <Showtime day={day} time={time} />
              </li>
            ))}
          </ul>
        </div>
      </article>
    </li>
  )
}

function Listings() {
  const [dayId, setDayId] = useState<DayId>("2026-11-11")
  const day = days.find((item) => item.id === dayId) ?? days[0]
  const showing = films
    .filter((film) => (film.times[dayId] ?? []).length > 0)
    .sort((a, b) =>
      (a.times[dayId]?.[0] ?? "").localeCompare(b.times[dayId]?.[0] ?? "")
    )
  const count = showing.length

  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">Listings</h2>
      <div
        role="group"
        aria-label="Choose a day"
        className="mt-6 flex flex-wrap gap-2"
      >
        {days.map((item) => {
          const chosen = item.id === dayId
          return (
            <Button
              key={item.id}
              variant={chosen ? "secondary" : "outline"}
              aria-pressed={chosen}
              className={cn(buttonText, "tabular-nums")}
              onClick={() => setDayId(item.id)}
            >
              <time dateTime={item.id}>{item.button}</time>
            </Button>
          )
        })}
      </div>
      <p
        aria-live="polite"
        className={cn(label, "mt-4 text-muted-foreground tabular-nums")}
      >
        <time dateTime={day.id}>{day.short}</time> · {count}{" "}
        {count === 1 ? "film" : "films"}
      </p>
      <ul className="mt-6 border-b border-border">
        {showing.map((film) => (
          <FilmRow key={film.title} film={film} day={dayId} />
        ))}
      </ul>
    </section>
  )
}

function SeasonAndMembership() {
  const card = "rounded-xl border border-border bg-card p-6"
  return (
    <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
      <div className={cn(card, "md:col-span-6")}>
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
          <time dateTime="2026-12-18">18 Dec</time>
        </p>
        <h2 className="mt-2 text-h2">Ilse Varga: the night films</h2>
        <p className="mt-4 max-w-xl">
          Seven of Varga's after-dark features on new restorations, opening on
          Friday 20 November with a double bill in Screen 1.
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
      <div className={cn(card, "mt-6 md:col-span-6 md:mt-0")}>
        <p className={cn(label, "text-muted-foreground")}>Membership</p>
        <h2 className="mt-2 text-h2">Two films a month, on us</h2>
        <p className="mt-4 max-w-xl">
          Members get two free tickets every month, first pick of seats for each
          season and ten percent off at the late bar.
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
  )
}

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
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
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <FeaturedFilm />
        <Listings />
        <SeasonAndMembership />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
