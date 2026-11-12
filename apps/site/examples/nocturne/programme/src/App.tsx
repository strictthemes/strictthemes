import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { TODAY, days, filmsOn, isLate } from "@/data/programme"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonText = "h-auto px-6 py-2 font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  focusRing
)
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const navItems = [
  { name: "Programme", href: "/" },
  { name: "Seasons", href: "/season" },
  { name: "Membership", href: "/membership" },
  { name: "Visit", href: "/visit" },
]
const CURRENT = "/"

function SiteHeader() {
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
                  className={cn(navLink, item.href === CURRENT && "underline")}
                  aria-current={item.href === CURRENT ? "page" : undefined}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButton}
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
        id="mobile-menu"
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
                  className={cn(
                    navLink,
                    "block py-2",
                    item.href === CURRENT && "underline"
                  )}
                  aria-current={item.href === CURRENT ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function FeaturedFilm() {
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
            aria-label="Still from Low Tide at Merrow: Maren stands on the harbour wall at dusk, the tide far out behind her"
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
          <h2 className="mt-2 text-h1 md:text-display">Low Tide at Merrow</h2>
          <p className="mt-4 text-body text-muted-foreground">
            Ada Kessler · Norway · 2026
          </p>
          <p className={cn(label, "mt-2 text-muted-foreground")}>
            118 min · Rated 15 · Screen 1
          </p>
          <p className="mt-4 max-w-xl">
            Maren comes back to the fishing town she left at seventeen to clear
            out her father&apos;s boathouse, and finds the harbour half empty
            and her brother still waiting for her answer. Kessler shoots the
            long northern evenings in real time, and lets the tide set the pace.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className={cn(buttonVariants({ variant: "default" }), buttonText)}
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

function Programme() {
  const [selected, setSelected] = useState(TODAY)
  const day = days.find((d) => d.date === selected) ?? days[0]
  const listing = filmsOn(day.date)
  const count = `${listing.length} ${listing.length === 1 ? "film" : "films"}`

  return (
    <section className="mt-24">
      <h2 className="text-h2 md:text-h1">Listings</h2>
      <div
        role="group"
        aria-label="Choose a day"
        className="mt-6 flex flex-wrap gap-2"
      >
        {days.map((d) => {
          const chosen = d.date === day.date
          return (
            <Button
              key={d.date}
              variant={chosen ? "secondary" : "outline"}
              aria-pressed={chosen}
              className={cn(buttonText, "tabular-nums")}
              onClick={() => setSelected(d.date)}
            >
              <time dateTime={d.date}>{d.button}</time>
            </Button>
          )
        })}
      </div>
      <p
        aria-live="polite"
        className={cn(label, "mt-4 text-muted-foreground tabular-nums")}
      >
        <time dateTime={day.date}>{day.label}</time> · {count}
      </p>

      <ul className="mt-6 border-b border-border">
        {listing.map(({ film, times }) => (
          <li key={film.id} className="border-t border-border py-6">
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
                <p className={cn(label, "mt-2 text-muted-foreground")}>
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
                        <time dateTime={`${day.date}T${time}`}>{time}</time>
                        {isLate(time) && " · Late"}
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
          From Friday 20 November we show all nine of Ilse Varga&apos;s films
          set after dark, each on a new restoration and most on Friday and
          Saturday nights.
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
        <p className={cn(label, "text-muted-foreground")}>Membership</p>
        <h2 className="mt-2 text-h2">Two films a month, on us</h2>
        <p className="mt-4 max-w-xl">
          Members get two free tickets every month, £2 off every other screening
          and first pick of seats for premieres and the late shows.
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
                  {item.name}
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
      <main className={cn(container, "pt-12")}>
        <FeaturedFilm />
        <Programme />
        <SeasonAndMembership />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
