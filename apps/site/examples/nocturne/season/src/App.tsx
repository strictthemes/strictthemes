import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)

const navLinks = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const CURRENT = "/season"

type Film = {
  title: string
  year: number
  minutes: number
  format: "35mm print" | "Digital"
  dateTime: string
  day: string
  note: string
}

const films: Film[] = [
  {
    title: "Corridor Light",
    year: 1989,
    minutes: 94,
    format: "35mm print",
    dateTime: "2026-11-20T20:30",
    day: "Fri 20 Nov",
    note: "Her first feature, made on short ends in a Budapest hospital that was closing its east wing. Watch how the night porter is lit only by the doors he opens: the whole of her later style is already here, in one building and one shift.",
  },
  {
    title: "The Long Blue",
    year: 1998,
    minutes: 142,
    format: "35mm print",
    dateTime: "2026-11-27T20:30",
    day: "Fri 27 Nov",
    note: "The longest of the six, set over a single summer night when the sky never quite goes dark. Two sisters wait at a lake house for a call that may not come. Varga said it was the film where she learned to let a scene run.",
  },
  {
    title: "Kestrel Street",
    year: 2003,
    minutes: 101,
    format: "35mm print",
    dateTime: "2026-12-01T20:30",
    day: "Tue 1 Dec",
    note: "A night bakery, four workers and the radio. It is the closest she came to a comedy, and the sound of the ovens does the work a score would do elsewhere. Our print is the one she approved for its first run abroad.",
  },
  {
    title: "Winter Switchboard",
    year: 2009,
    minutes: 117,
    format: "35mm print",
    dateTime: "2026-12-04T20:30",
    day: "Fri 4 Dec",
    note: "An operator connects strangers through one January night and starts to listen in. Varga shot almost all of it in a room three metres wide, and the voices on the line carry the film. It is the last she shot on film.",
  },
  {
    title: "The Last Tram Home",
    year: 2014,
    minutes: 88,
    format: "Digital",
    dateTime: "2026-12-11T20:30",
    day: "Fri 11 Dec",
    note: "Her first digital film, and her shortest: one tram, one driver, the last run of the night. Look for how the city lights replace the lamps of her earlier rooms, with the same patience in the framing.",
  },
  {
    title: "Small Fires",
    year: 2019,
    minutes: 109,
    format: "Digital",
    dateTime: "2026-12-18T20:30",
    day: "Fri 18 Dec",
    note: "Her most recent film follows a night-shift firefighter between calls, in a station where nothing much happens. It gathers up the waiting of the five films before it and ends, for once, at dawn.",
  },
]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  const navLinkClass = (href: string) =>
    cn(
      "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
      href === CURRENT && "underline",
      focusRing
    )

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT ? "page" : undefined}
                  className={navLinkClass(link.href)}
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
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="h-auto px-6 py-2 font-mono text-label uppercase md:hidden"
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn("block py-2", navLinkClass(link.href))}
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

function SeasonPass() {
  return (
    <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start lg:col-span-4 lg:col-start-9">
      <p className="font-mono text-label text-muted-foreground uppercase">
        Season pass
      </p>
      <p className="mt-2 font-heading text-h1 tabular-nums">£38</p>
      <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
        Six films · <span className="tabular-nums">£30</span> for members
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
          "mt-6 h-auto w-full px-6 py-2 text-center font-mono text-label whitespace-normal uppercase"
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

function FilmRow({ film, index }: { film: Film; index: number }) {
  const number = String(index + 1).padStart(2, "0")
  const [weekdayDate, time] = [film.day, film.dateTime.slice(11)]

  return (
    <li className="border-t border-border py-6">
      <article className="flex gap-4 md:gap-6">
        <p className="hidden font-mono text-label text-foreground uppercase tabular-nums md:block md:w-32 md:shrink-0">
          <time dateTime={film.dateTime}>
            <span className="block">{weekdayDate}</span>
            <span className="block">{time}</span>
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
            {number}
            <span className="md:hidden">
              {" · "}
              <time dateTime={film.dateTime} className="tabular-nums">
                {weekdayDate} · {time}
              </time>
            </span>
          </p>
          <h3 className="mt-2 text-h2">{film.title}</h3>
          <p className="mt-2 text-body text-muted-foreground">
            Ilse Varga · Hungary · {film.year}
          </p>
          <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
            {film.minutes} min · {film.format}
          </p>
          <p className="mt-4 max-w-xl">{film.note}</p>
          <p className="mt-4">
            <a href="#" className={textLink}>
              Film details<span className="sr-only">: {film.title}</span>
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={textLink}>
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
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className="font-mono text-label text-muted-foreground uppercase">
              Season ·{" "}
              <time dateTime="2026-11-20" className="tabular-nums">
                20 Nov
              </time>
              {" – "}
              <time dateTime="2026-12-18" className="tabular-nums">
                18 Dec 2026
              </time>
            </p>
            <h1 className="mt-2 text-h1 md:text-display">
              Ilse Varga: the night films
            </h1>
            <p className="mt-6 max-w-xl">
              Ilse Varga has made six features in thirty years, each of them
              shot mostly between dusk and the first tram. She trained as a
              lighting assistant at the Budapest studios before directing, and
              it shows: her films are built from lamps, windows and the dark
              between them.
            </p>
            <p className="mt-4 max-w-xl">
              These six belong together because they keep returning to the same
              situation: a small room at night, and people in it waiting for
              something. A call, a shift to end, a tram, a fire. Seen in order,
              they read as one long night told across three decades.
            </p>
            <p className="mt-4 max-w-xl">
              We show them in the order she made them. The first four screen on
              35mm prints borrowed from the archive in Budapest; the last two
              were shot on digital and are shown that way, as she intended.
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              Curated by Petra Lindqvist
            </p>
          </div>
          <SeasonPass />
        </section>

        <section className="mt-24">
          <h2 className="text-h2 md:text-h1">Six films, in order</h2>
          <p className="mt-4 max-w-xl">
            The six films run from Friday 20 November to Friday 18 December,
            and every screening starts at 20:30 on Screen 2.
          </p>
          <ol className="mt-6 border-b border-border">
            {films.map((film, index) => (
              <FilmRow key={film.title} film={film} index={index} />
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
