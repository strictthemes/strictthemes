import { useRef, useState, type KeyboardEvent } from "react"

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

const label = "font-mono text-label uppercase"

const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const navItems = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const currentHref = "/season"

type Film = {
  title: string
  year: number
  minutes: number
  format: string
  date: string
  weekday: string
  day: string
  note: string
}

const films: Film[] = [
  {
    title: "Corridor Light",
    year: 1989,
    minutes: 94,
    format: "35mm print",
    date: "2026-11-20",
    weekday: "Fri",
    day: "20 Nov",
    note: "Varga's first feature follows a night porter through one shift in a Budapest hospital, and almost every shot is lit by the strip lights of its corridors. Watch how long she holds on doors that nobody opens. Everything she made later starts here.",
  },
  {
    title: "The Long Blue",
    year: 1998,
    minutes: 142,
    format: "35mm print",
    date: "2026-11-27",
    weekday: "Fri",
    day: "27 Nov",
    note: "Her longest film covers a single winter night between dusk and the first blue light of morning, in something close to real time. A family waits in a farmhouse kitchen for a son who is driving home. It is the film that made her name abroad.",
  },
  {
    title: "Kestrel Street",
    year: 2003,
    minutes: 101,
    format: "35mm print",
    date: "2026-12-01",
    weekday: "Tue",
    day: "1 Dec",
    note: "Six neighbours share one stairwell and one broken light switch. Varga tells their stories through the walls, so listen as closely as you watch: much of the film happens off screen, in the next flat.",
  },
  {
    title: "Winter Switchboard",
    year: 2009,
    minutes: 117,
    format: "35mm print",
    date: "2026-12-04",
    weekday: "Fri",
    day: "4 Dec",
    note: "A telephone operator on the night shift connects calls she is not meant to hear. It is Varga's most plotted film and the closest she came to a thriller, though the suspense is all in a woman deciding whether to speak. This is the last of her films shot on film.",
  },
  {
    title: "The Last Tram Home",
    year: 2014,
    minutes: 88,
    format: "Digital",
    date: "2026-12-11",
    weekday: "Fri",
    day: "11 Dec",
    note: "Her first digital film was shot almost entirely inside a moving tram after midnight, with the city only as reflections in its windows. The new camera let her work in near darkness, and she uses it to show faces lit by streetlights passing one by one.",
  },
  {
    title: "Small Fires",
    year: 2019,
    minutes: 109,
    format: "Digital",
    date: "2026-12-18",
    weekday: "Fri",
    day: "18 Dec",
    note: "Her most recent film returns to the small rooms of Kestrel Street, now lit by candles during a week of power cuts. It is quieter and warmer than anything before it, and it closes the season with the only dawn in her work that feels like an ending.",
  },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header
        className="border-b border-border"
        onKeyDown={handleHeaderKeyDown}
      >
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
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={
                      item.href === currentHref ? "page" : undefined
                    }
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
            ref={menuButtonRef}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses, "md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
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
                    aria-current={
                      item.href === currentHref ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
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

      <main className={cn(container, "pt-12")}>
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Season · <time dateTime="2026-11-20">20 Nov</time> –{" "}
              <time dateTime="2026-12-18">18 Dec 2026</time>
            </p>
            <h1 className="mt-2 text-h1 md:text-display">
              Ilse Varga: the night films
            </h1>
            <p className="mt-6 max-w-xl">
              Ilse Varga has made six features in thirty years, all of them in
              Hungary and nearly all of them after dark. She began as a
              documentary camera operator in Budapest, and she still films
              ordinary people at work and at home, at the hours when most of us
              are asleep.
            </p>
            <p className="mt-4 max-w-xl">
              Seen together, the six films are one long night. They take place
              in small rooms: a hospital corridor, a farmhouse kitchen, a
              stairwell, a telephone exchange, a tram. And in each of them
              someone is waiting for something: a call, a son, a light to come
              back on.
            </p>
            <p className="mt-4 max-w-xl">
              We show them in the order she made them, over six evenings from
              late November to the week before Christmas. The first four are
              shown on 35mm prints borrowed from the national film archive; the
              last two were shot on digital and are shown that way.
            </p>
            <p className="mt-4 text-body text-muted-foreground">
              Curated by Petra Lindqvist
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start lg:col-span-4 lg:col-start-9">
            <p className={cn(label, "text-muted-foreground")}>Season pass</p>
            <p className="mt-2 font-heading text-h1 tabular-nums">£38</p>
            <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
              Six films · £30 for members
            </p>
            <ul className="mt-4 list-disc pl-4 text-body">
              <li>A seat at all six screenings.</li>
              <li className="mt-2">
                The same seat each night, if you want it.
              </li>
              <li className="mt-2">
                A printed programme with an essay by Petra Lindqvist.
              </li>
              <li className="mt-2">10% off at the bar on season nights.</li>
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
        </section>

        <section className="mt-24">
          <h2 className="text-h2 md:text-h1">Six films, in order</h2>
          <p className="mt-4 max-w-xl">
            The six films run from Friday 20 November to Friday 18 December, and
            every screening starts at 20:30 on Screen 2.
          </p>

          <ol className="mt-6 border-b border-border">
            {films.map((film, index) => {
              const number = String(index + 1).padStart(2, "0")
              const dateTime = `${film.date}T20:30`
              return (
                <li key={film.title} className="border-t border-border py-6">
                  <article className="flex gap-4 md:gap-6">
                    <p
                      className={cn(
                        label,
                        "hidden text-foreground tabular-nums md:block md:w-32 md:shrink-0"
                      )}
                    >
                      <time dateTime={dateTime}>
                        <span className="block">
                          {film.weekday} {film.day}
                        </span>
                        <span className="block">20:30</span>
                      </time>
                    </p>
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
                      <p className={cn(label, "text-foreground tabular-nums")}>
                        {number}
                        <span className="md:hidden">
                          {" · "}
                          <time dateTime={dateTime}>
                            {film.weekday} {film.day} · 20:30
                          </time>
                        </span>
                      </p>
                      <h3 className="mt-2 text-h2">{film.title}</h3>
                      <p className="mt-2 text-body text-muted-foreground">
                        Ilse Varga · Hungary · {film.year}
                      </p>
                      <p
                        className={cn(
                          label,
                          "mt-2 text-muted-foreground tabular-nums"
                        )}
                      >
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
            })}
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
    </div>
  )
}

export default App
