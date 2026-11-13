import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"
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
const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]
const currentHref = "/"

type DayId =
  "2026-11-11" | "2026-11-12" | "2026-11-13" | "2026-11-14" | "2026-11-15"

const days: { id: DayId; button: string; short: string }[] = [
  { id: "2026-11-11", button: "Today", short: "Wed 11 Nov" },
  { id: "2026-11-12", button: "Thu 12", short: "Thu 12 Nov" },
  { id: "2026-11-13", button: "Fri 13", short: "Fri 13 Nov" },
  { id: "2026-11-14", button: "Sat 14", short: "Sat 14 Nov" },
  { id: "2026-11-15", button: "Sun 15", short: "Sun 15 Nov" },
]

type Film = {
  title: string
  director: string
  country: string
  year: number
  minutes: number
  rating: string
  screen: 1 | 2 | 3
  href: string
  premiere?: boolean
  times: Partial<Record<DayId, string[]>>
}

// Each film keeps one screen all week; no two shows on a screen overlap.
const films: Film[] = [
  {
    title: "Low Tide at Merrow",
    director: "Ada Kessler",
    country: "Norway",
    year: 2026,
    minutes: 118,
    rating: "15",
    screen: 1,
    href: "/film",
    premiere: true,
    times: {
      "2026-11-11": ["18:00", "20:45"],
      "2026-11-12": ["17:30", "20:30"],
      "2026-11-13": ["18:45", "21:15"],
      "2026-11-14": ["16:30", "21:00"],
      "2026-11-15": ["13:30", "18:15"],
    },
  },
  {
    title: "Night Ferry to Halvik",
    director: "Jonas Brask",
    country: "Denmark",
    year: 2025,
    minutes: 96,
    rating: "12A",
    screen: 3,
    href: "#",
    times: {
      "2026-11-11": ["18:30"],
      "2026-11-12": ["19:00"],
      "2026-11-13": ["19:00", "21:15"],
      "2026-11-14": ["18:00", "23:15"],
    },
  },
  {
    title: "The Glass Year",
    director: "Inès Lavalle",
    country: "France",
    year: 2026,
    minutes: 131,
    rating: "15",
    screen: 2,
    href: "#",
    times: {
      "2026-11-11": ["17:30"],
      "2026-11-12": ["18:15"],
      "2026-11-13": ["17:00", "22:00"],
      "2026-11-14": ["19:45", "22:30"],
      "2026-11-15": ["17:00"],
    },
  },
  {
    title: "A Room Above the Station",
    director: "Tomasz Wierzba",
    country: "Poland",
    year: 2024,
    minutes: 104,
    rating: "PG",
    screen: 2,
    href: "#",
    times: {
      "2026-11-11": ["20:15"],
      "2026-11-12": ["21:00"],
      "2026-11-14": ["17:15"],
      "2026-11-15": ["14:00"],
    },
  },
  {
    title: "Small Hours",
    director: "Noor Hadid",
    country: "Lebanon",
    year: 2026,
    minutes: 88,
    rating: "15",
    screen: 3,
    href: "#",
    times: {
      "2026-11-11": ["21:00"],
      "2026-11-13": ["16:45", "23:15"],
      "2026-11-15": ["15:00", "20:30"],
    },
  },
  {
    title: "The Quiet Lift",
    director: "Mirela Dobre",
    country: "Romania",
    year: 2025,
    minutes: 99,
    rating: "12A",
    screen: 1,
    href: "#",
    times: {
      "2026-11-13": ["16:30"],
      "2026-11-14": ["19:00"],
      "2026-11-15": ["16:00"],
    },
  },
]

function isLate(time: string) {
  return Number(time.slice(0, 2)) >= 22
}

function filmDetails(film: Film) {
  return `${film.minutes} min · Rated ${film.rating} · Screen ${film.screen}`
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center justify-between gap-4 py-4"
        )}
      >
        <a href="/" className={cn(titleLink, "font-heading text-h2")}>
          The Vesper
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === currentHref ? "page" : undefined}
                  className={cn(
                    navLink,
                    item.href === currentHref && "underline"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonClass, "md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="main-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === currentHref ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLink,
                    "block py-2",
                    item.href === currentHref && "underline"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Featured() {
  return (
    <section>
      <h1 className={cn(label, "text-muted-foreground tabular-nums")}>
        What&apos;s on · <time dateTime="2026-11-11">11</time>–
        <time dateTime="2026-11-15">15 Nov</time>
      </h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <figure className="md:col-span-7">
          <div
            role="img"
            aria-label="Still from Low Tide at Merrow: Maren stands alone on the harbour wall at dusk, the boats moored below her"
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
          <p className="mt-4 text-body text-muted-foreground">
            Ada Kessler · Norway · 2026
          </p>
          <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
            118 min · Rated 15 · Screen 1
          </p>
          <p className="mt-4 max-w-xl">
            Maren comes home to a fishing town on the Norwegian coast to sell
            her late father&apos;s boat, and finds the harbour has kept more of
            his life than she ever knew. Ada Kessler films the long northern
            dusk in near silence and lets the tide set the pace.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "default" }),
                buttonClass
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
          <span className="font-mono text-label text-muted-foreground tabular-nums">
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
          <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
            {filmDetails(film)}
          </p>
          <ul aria-label="Showtimes" className="mt-4 flex flex-wrap gap-2">
            {times.map((time) => (
              <li key={time}>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-auto px-4 py-2 font-mono text-label uppercase tabular-nums"
                  )}
                >
                  <span>
                    <time dateTime={`${day}T${time}`}>{time}</time>
                    {isLate(time) && " · Late"}
                    <span className="sr-only">, {film.title}</span>
                  </span>
                </a>
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
  const day = days.find((d) => d.id === dayId) ?? days[0]
  const showing = films
    .filter((film) => (film.times[dayId] ?? []).length > 0)
    .sort((a, b) =>
      (a.times[dayId] ?? [])[0].localeCompare((b.times[dayId] ?? [])[0])
    )
  const count = `${showing.length} ${showing.length === 1 ? "film" : "films"}`

  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">Listings</h2>
      <div
        role="group"
        aria-label="Choose a day"
        className="mt-6 flex flex-wrap gap-2"
      >
        {days.map((d) => {
          const chosen = d.id === dayId
          return (
            <Button
              key={d.id}
              variant={chosen ? "secondary" : "outline"}
              aria-pressed={chosen}
              onClick={() => setDayId(d.id)}
              className={cn(buttonClass, "tabular-nums")}
            >
              <time dateTime={d.id}>{d.button}</time>
            </Button>
          )
        })}
      </div>
      <p
        aria-live="polite"
        className={cn(label, "mt-4 text-muted-foreground tabular-nums")}
      >
        <time dateTime={day.id}>{day.short}</time> · {count}
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
  return (
    <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
      <div className="rounded-xl border border-border bg-card p-6 md:col-span-6">
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
          <time dateTime="2026-12-18">18 Dec</time>
        </p>
        <h2 className="mt-2 text-h2">Ilse Varga: the night films</h2>
        <p className="mt-4 max-w-xl">
          Seven of Ilse Varga&apos;s films about people awake while a city
          sleeps open on Friday 20 November and play on Friday and Saturday
          nights until Friday 18 December.
        </p>
        <a
          href="/season"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            buttonClass,
            "mt-6"
          )}
        >
          See the season
        </a>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-6 md:col-span-6 md:mt-0">
        <p className={cn(label, "text-muted-foreground")}>Membership</p>
        <h2 className="mt-2 text-h2">Two films a month, on us</h2>
        <p className="mt-4 max-w-xl">
          Members see two films a month for free, pay less for every other
          ticket and can book each new programme two days before anyone else.
        </p>
        <a
          href="/membership"
          className={cn(
            buttonVariants({ variant: "outline" }),
            buttonClass,
            "mt-6"
          )}
        >
          Become a member
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className={container}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={textLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(label, "mt-12 text-muted-foreground tabular-nums")}>
          © 2026 The Vesper
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(container, "pt-12")}>
        <Featured />
        <Listings />
        <SeasonAndMembership />
      </main>
      <Footer />
    </div>
  )
}

export default App
