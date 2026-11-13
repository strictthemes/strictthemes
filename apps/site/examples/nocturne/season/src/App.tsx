import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusOutline
)

const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const buttonText = "h-auto px-6 py-2 font-mono text-label uppercase"

const pages = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const currentPage = "/season"

type Film = {
  number: string
  title: string
  year: string
  minutes: number
  format: string
  dateTime: string
  date: string
  time: string
  note: string
}

const films: Film[] = [
  {
    number: "01",
    title: "Corridor Light",
    year: "1989",
    minutes: 94,
    format: "35mm print",
    dateTime: "2026-11-20T20:30",
    date: "Fri 20 Nov",
    time: "20:30",
    note: "Her first feature, shot in one Budapest apartment block over eleven nights. A caretaker waits up for a tenant who has not come home, and the film never leaves the stairwell. Watch how the timer switch on the landing light sets the length of every scene.",
  },
  {
    number: "02",
    title: "The Long Blue",
    year: "1998",
    minutes: 142,
    format: "35mm print",
    dateTime: "2026-11-27T20:30",
    date: "Fri 27 Nov",
    time: "20:30",
    note: "The longest of the six and the only one with a journey in it: a night ferry down the Danube, and a cook who has agreed to meet her brother at the last stop. Varga holds the hour before dawn for most of the final reel. It is the film that made her name outside Hungary.",
  },
  {
    number: "03",
    title: "Kestrel Street",
    year: "2003",
    minutes: 101,
    format: "35mm print",
    dateTime: "2026-12-01T20:30",
    date: "Tue 1 Dec",
    time: "20:30",
    note: "A night pharmacy, a taxi rank and the three people who work between them. This is her warmest film and the closest she came to a comedy. Listen for the radio, which plays the same request show in every room.",
  },
  {
    number: "04",
    title: "Winter Switchboard",
    year: "2009",
    minutes: 117,
    format: "35mm print",
    dateTime: "2026-12-04T20:30",
    date: "Fri 4 Dec",
    time: "20:30",
    note: "Two operators run a rural telephone exchange through a week of snow, waiting for the call that will close it. It is the last film she shot on 35mm, and the grain in the dark of the exchange is the reason to see this print. Most of what happens, happens on the other end of a line.",
  },
  {
    number: "05",
    title: "The Last Tram Home",
    year: "2014",
    minutes: 88,
    format: "Digital",
    dateTime: "2026-12-11T20:30",
    date: "Fri 11 Dec",
    time: "20:30",
    note: "Her first digital film and her shortest: one tram, one driver and the passengers of a single late run across the city. The new camera lets her shoot by the light of the tram alone. Notice how rarely anyone looks out of the window.",
  },
  {
    number: "06",
    title: "Small Fires",
    year: "2019",
    minutes: 109,
    format: "Digital",
    dateTime: "2026-12-18T20:30",
    date: "Fri 18 Dec",
    time: "20:30",
    note: "A power cut in a hillside village, told house by house as the candles and stoves are lit. Her most recent film gathers the rooms of the other five into one night. The last shot is the first daylight in the whole season.",
  },
]

const passIncludes = [
  "A seat at all six screenings",
  "The same seat each night, if you want it",
  "A printed programme with an essay by Petra Lindqvist",
  "10% off at the bar on season nights",
]

function SeasonPass({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card p-6", className)}
    >
      <p className="font-mono text-label text-muted-foreground uppercase">
        Season pass
      </p>
      <p className="mt-2 font-heading text-h1 tabular-nums">£38</p>
      <p className="mt-2 font-mono text-label text-muted-foreground uppercase tabular-nums">
        Six films · £30 for members
      </p>
      <ul className="mt-4 list-disc pl-4 text-body">
        {passIncludes.map((item, index) => (
          <li key={item} className={index > 0 ? "mt-2" : undefined}>
            {item}
          </li>
        ))}
      </ul>
      <a
        href="#"
        className={cn(
          buttonVariants({ variant: "default" }),
          buttonText,
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
            <span className="block">{film.date}</span>
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
          <p className="font-mono text-label text-foreground uppercase">
            {film.number}
            <span className="md:hidden">
              {" · "}
              <time dateTime={film.dateTime} className="tabular-nums">
                {film.date} · {film.time}
              </time>
            </span>
          </p>
          <h3 className="mt-2 text-h2">{film.title}</h3>
          <p className="mt-2 text-body text-muted-foreground">
            Ilse Varga · Hungary · {film.year}
          </p>
          <p className="mt-2 font-mono text-label text-muted-foreground uppercase tabular-nums">
            {film.minutes} min · {film.format}
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

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

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
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={
                      page.href === currentPage ? "page" : undefined
                    }
                    className={cn(
                      navLink,
                      page.href === currentPage && "underline"
                    )}
                  >
                    {page.label}
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
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={
                      page.href === currentPage ? "page" : undefined
                    }
                    className={cn(
                      navLink,
                      "block py-2",
                      page.href === currentPage && "underline"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
              Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
              <time dateTime="2026-12-18">18 Dec 2026</time>
            </p>
            <h1 className="mt-2 text-h1 md:text-display">
              Ilse Varga: the night films
            </h1>
            <p className="mt-6 max-w-xl">
              Ilse Varga has made films in Hungary for more than thirty years,
              almost all of them after dark. She trained as a sound recordist,
              and it shows: her films are built from footsteps on a stair, a
              radio in the next room and a telephone that may or may not ring.
            </p>
            <p className="mt-4 max-w-xl">
              These six belong together. Each takes place over one night or a
              handful of them, in small rooms, among people who are waiting for
              something: a tenant, a brother, a call, the morning. Seen side by
              side they read as one long night, told from six windows.
            </p>
            <p className="mt-4 max-w-xl">
              We are showing them in the order she made them, one film a night.
              The first four run from 35mm prints, the way they were shot. The
              last two were shot on digital cameras and are shown that way.
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              Curated by Petra Lindqvist
            </p>
          </div>
          <SeasonPass className="mt-12 md:col-span-5 md:mt-0 md:self-start lg:col-span-4 lg:col-start-9" />
        </section>

        <section className="mt-24">
          <h2 className="text-h2 md:text-h1">Six films, in order</h2>
          <p className="mt-4 max-w-xl">
            The six films run from Friday 20 November to Friday 18 December, and
            every screening starts at 20:30 on Screen 2.
          </p>
          <ol className="mt-6 border-b border-border">
            {films.map((film) => (
              <FilmRow key={film.number} film={film} />
            ))}
          </ol>
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
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
              {pages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className={textLink}>
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-12 font-mono text-label text-muted-foreground uppercase tabular-nums">
            © 2026 The Vesper
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
