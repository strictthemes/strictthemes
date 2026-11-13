import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusOutline
)

const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const currentHref = "/season"

type Film = {
  number: string
  title: string
  year: number
  runtime: number
  format: "35mm print" | "Digital"
  dateTime: string
  day: string
  time: string
  note: string
}

const films: Film[] = [
  {
    number: "01",
    title: "Corridor Light",
    year: 1989,
    runtime: 94,
    format: "35mm print",
    dateTime: "2026-11-20T20:30",
    day: "Fri 20 Nov",
    time: "20:30",
    note: "Her first feature follows a hospital porter through one night shift, and almost nothing happens outside the building. Watch how the strip lights hum on the soundtrack: she said later it was the only score she could afford, and she kept it in every film after.",
  },
  {
    number: "02",
    title: "The Long Blue",
    year: 1998,
    runtime: 142,
    format: "35mm print",
    dateTime: "2026-11-27T20:30",
    day: "Fri 27 Nov",
    time: "20:30",
    note: "The longest of her films and the one that made her name abroad: a family waits up for a son who has not come home from the border. The hour between dusk and full dark is stretched across the whole second half, and the print keeps every shade of it.",
  },
  {
    number: "03",
    title: "Kestrel Street",
    year: 2003,
    runtime: 101,
    format: "35mm print",
    dateTime: "2026-12-01T20:30",
    day: "Tue 1 Dec",
    time: "20:30",
    note: "Three neighbours share a stairwell and a broken lift over one winter. It is the closest she came to a comedy, and the jokes are all in the waiting: for the repairman, for a letter, for the lights on the landing to click off.",
  },
  {
    number: "04",
    title: "Winter Switchboard",
    year: 2009,
    runtime: 117,
    format: "35mm print",
    dateTime: "2026-12-04T20:30",
    day: "Fri 4 Dec",
    time: "20:30",
    note: "A night operator at a rural telephone exchange listens in on a town she never sees. Varga shot most of it in one room with a single lamp, and this is the last of her films made on celluloid.",
  },
  {
    number: "05",
    title: "The Last Tram Home",
    year: 2014,
    runtime: 88,
    format: "Digital",
    dateTime: "2026-12-11T20:30",
    day: "Fri 11 Dec",
    time: "20:30",
    note: "Her first digital film runs almost in real time, from the last stop of the night to the depot. The new camera let her shoot by streetlight alone, and the grain of the city at 1am is the film's real subject.",
  },
  {
    number: "06",
    title: "Small Fires",
    year: 2019,
    runtime: 109,
    format: "Digital",
    dateTime: "2026-12-18T20:30",
    day: "Fri 18 Dec",
    time: "20:30",
    note: "A widower keeps a stove going in a flat he is about to leave. Her most recent film gathers up the rooms, the lamps and the waiting of the five before it, and ends, for once, at dawn.",
  },
]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButtonRef.current?.focus()
    }
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
                  aria-current={item.href === currentHref ? "page" : undefined}
                  className={cn(navLink, item.href === currentHref && "underline")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButtonRef}
          variant="outline"
          className={cn(buttonClasses, "md:hidden")}
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
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1280px] px-4 py-2 md:px-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === currentHref ? "page" : undefined}
                  className={cn(
                    navLink,
                    "block py-2",
                    item.href === currentHref && "underline"
                  )}
                  onClick={() => setOpen(false)}
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

function SeasonPassCard() {
  return (
    <div
      className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start lg:col-span-4 lg:col-start-9"
    >
      <p className="font-mono text-label text-muted-foreground uppercase">
        Season pass
      </p>
      <p className="mt-2 font-heading text-h1 tabular-nums">£38</p>
      <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
        Six films · £30 for members
      </p>
      <ul className="mt-4 list-disc pl-4 text-body">
        <li>A seat at all six screenings</li>
        <li className="mt-2">The same seat each night, if you want it</li>
        <li className="mt-2">
          A printed programme with an essay by Petra Lindqvist
        </li>
        <li className="mt-2">10% off at the bar on season nights</li>
      </ul>
      <a
        href="#"
        className={cn(
          buttonVariants({ variant: "default" }),
          buttonClasses,
          "mt-6 w-full text-center whitespace-normal"
        )}
      >
        Buy a season pass
      </a>
      <p className="mt-4 text-body text-muted-foreground">
        Single tickets go on sale two weeks before each screening.
      </p>
    </div>
  )
}

function FilmRow({ film }: { film: Film }) {
  return (
    <li className="border-t border-border py-6">
      <article className="flex gap-4 md:gap-6">
        <p className="hidden font-mono text-label text-foreground uppercase tabular-nums md:block md:w-32 md:shrink-0">
          <time dateTime={film.dateTime}>
            <span className="block">{film.day}</span>
            <span className="block">{film.time}</span>
          </time>
        </p>
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
          <p className="font-mono text-label text-foreground uppercase tabular-nums">
            {film.number}
            <span className="md:hidden">
              {" · "}
              <time dateTime={film.dateTime}>
                {film.day} · {film.time}
              </time>
            </span>
          </p>
          <h3 className="mt-2 text-h2">{film.title}</h3>
          <p className="mt-2 text-body text-muted-foreground">
            Ilse Varga · Hungary · {film.year}
          </p>
          <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
            {film.runtime} min · {film.format}
          </p>
          <p className="mt-4 max-w-xl">{film.note}</p>
          <p className="mt-4">
            <a href="#" className={textLink}>
              Film details
            </a>
          </p>
        </div>
      </article>
    </li>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
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
        <p className="mt-12 font-mono text-label text-muted-foreground uppercase">
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
      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <section
          aria-labelledby="season-title"
          className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
          <div className="md:col-span-7">
            <p className="font-mono text-label text-muted-foreground uppercase">
              Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
              <time dateTime="2026-12-18">18 Dec 2026</time>
            </p>
            <h1 id="season-title" className="mt-2 text-h1 md:text-display">
              Ilse Varga: the night films
            </h1>
            <p className="mt-6 max-w-xl">
              Ilse Varga made six features in thirty years, all of them in
              Hungary and nearly all of them after dark. She trained as a
              lighting assistant in state television, and it shows: her films
              are built from lamps, windows and the glow of a stairwell timer
              more than from plot.
            </p>
            <p className="mt-4 max-w-xl">
              These six belong together. Each one keeps to a few small rooms
              at night, and each is about people waiting for something: a
              son, a phone call, the last tram, the morning. Seen in a row,
              they read as one long night told over three decades.
            </p>
            <p className="mt-4 max-w-xl">
              We show them in the order she made them, over five weeks, mostly
              on Friday nights. The first four are screened from 35mm prints
              on loan from the national film archive in Budapest; the last two
              were shot on digital and are shown that way.
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              Curated by Petra Lindqvist
            </p>
          </div>
          <SeasonPassCard />
        </section>

        <section aria-labelledby="films-title" className="mt-24">
          <h2 id="films-title" className="text-h2 md:text-h1">
            Six films, in order
          </h2>
          <p className="mt-4 max-w-xl">
            The six films run from Friday 20 November to Friday 18 December,
            and every screening starts at 20:30 on Screen 2.
          </p>
          <ol className="mt-6 border-b border-border">
            {films.map((film) => (
              <FilmRow key={film.number} film={film} />
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
