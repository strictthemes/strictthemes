import { useRef, useState, type KeyboardEvent } from "react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase"
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusRing
)
const navLink = cn("text-foreground hover:underline underline-offset-4", focusRing)
const currentNavLink = "underline decoration-2 underline-offset-4"
const panel = "flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
const container = "mx-auto max-w-[1200px] px-3 md:px-5"

type ActSet = {
  day: { label: string; date: string }
  start: string
  end: string
  title: string
  stage: string
}

type OtherAct = {
  name: string
  initials: string
  start: string
  stage: string
}

type Act = {
  name: string
  initials: string
  from: string
  members: string[]
  headline: string
  about: string[]
  plays: string
  firstAlbum: string
  pictureLabel: string
  sets: ActSet[]
  sameDay: { heading: string; acts: OtherAct[] }
}

const festival = {
  name: "Tremor Days",
  place: "Varsby Docks",
  offset: "+01:00",
}

const act: Act = {
  name: "Ossa Bloom",
  initials: "OB",
  from: "From Gothenburg, Sweden",
  members: ["Edda Lind", "Sami Rahko"],
  headline: "Music you can see",
  about: [
    "Edda Lind and Sami Rahko met in 2017 at a night class in stage lighting in Gothenburg. Edda wrote the music for the class projects and Sami ran the lamps. By the end of the term they had played their first show together.",
    "A set runs for about seventy minutes without a break. Edda plays slow, heavy synth lines over a drum machine and builds each track live from a handful of loops, so no two nights sound the same.",
    "Sami builds the light rig from parts found at scrap yards: car headlamps, old shop signs and the tubes from a closed factory. Each lamp is wired to one part of the music, so the light moves with the sound.",
  ],
  plays: "Live electronics and light",
  firstAlbum: "Static Harbour, 2024",
  pictureLabel: "Drawing of three bars of light over the letters OB, on black",
  sets: [
    {
      day: { label: "Fri 4 Dec", date: "2026-12-04" },
      start: "22:40",
      end: "23:50",
      title: "Live set",
      stage: "Crane Stage",
    },
    {
      day: { label: "Sat 5 Dec", date: "2026-12-05" },
      start: "15:00",
      end: "15:45",
      title: "Talk: Light shows from scrap",
      stage: "Drawing Office",
    },
  ],
  sameDay: {
    heading: "Also on Friday",
    acts: [
      { name: "Gravel & Gold", initials: "GG", start: "19:00", stage: "Crane Stage" },
      { name: "The Night Ferries", initials: "NF", start: "20:40", stage: "Crane Stage" },
      { name: "Sister Antenna", initials: "SA", start: "21:00", stage: "Pump House" },
      { name: "Basement Choir", initials: "BC", start: "23:00", stage: "Pump House" },
    ],
  },
}

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .trim()
    .split(/\s+/)
    .join("-")
}

const navItems = [
  { label: "Line-up", href: "/line-up" },
  { label: "Tickets", href: "/tickets" },
  { label: "Info", href: "/info" },
]
const currentHref = "/line-up"

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function NavLinks({ className }: { className?: string }) {
  return navItems.map((item) => {
    const current = item.href === currentHref
    return (
      <a
        key={item.href}
        href={item.href}
        aria-current={current ? "page" : undefined}
        className={cn(label, navLink, current && currentNavLink, className)}
      >
        {item.label}
      </a>
    )
  })
}

function SiteHeader() {
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
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground hover:underline underline-offset-4",
            focusRing
          )}
        >
          {festival.name}
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          <NavLinks />
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto h-auto px-5 py-2 font-mono text-label font-bold uppercase md:hidden"
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          <NavLinks className="block py-2" />
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2">{festival.name}</p>
        <p className="text-body">
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(label, "tabular-nums")}>
          {festival.place} · <FestivalDates /> · © 2026 {festival.name}
        </p>
      </div>
    </footer>
  )
}

function dateTime(date: string, time: string) {
  return `${date}T${time}${festival.offset}`
}

export function App() {
  const liveSet = act.sets[0]

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className={cn(container, "flex flex-col gap-16 py-8 md:py-16")}>
        {/* 1. Name */}
        <section className="flex flex-col gap-3">
          <a
            href="/line-up"
            className={cn(
              "inline-flex items-center gap-2 self-start",
              label,
              textLink
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All acts
          </a>
          <div className="flex flex-col gap-2">
            <p className={cn(label, "tabular-nums")}>
              <time dateTime={liveSet.day.date}>{liveSet.day.label}</time> ·{" "}
              {liveSet.stage}
            </p>
            <h1 className="text-h1 md:text-display">{act.name}</h1>
          </div>
          <p className="font-heading text-h2">{act.from}</p>
        </section>

        {/* 2. About */}
        <section className="flex flex-col gap-8">
          <h2 className="sr-only">About {act.name}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <figure className="flex flex-col gap-2 md:col-span-5">
              <div
                role="img"
                aria-label={act.pictureLabel}
                className="aspect-square rounded-xl border border-border bg-foreground"
              >
                <div className="flex h-full flex-col justify-end gap-3 p-5">
                  <div aria-hidden="true" className="h-3 w-1/2 bg-background" />
                  <div aria-hidden="true" className="h-3 w-3/4 bg-background" />
                  <div aria-hidden="true" className="h-3 w-full bg-background" />
                  <p
                    aria-hidden="true"
                    className="font-heading text-display text-background"
                  >
                    {act.initials}
                  </p>
                </div>
              </div>
              <figcaption className={cn(label, "text-muted-foreground")}>
                {act.members.map((member, index) => (
                  <span key={member}>
                    {index > 0 && " · "}
                    <span className="normal-case">{member}</span>
                  </span>
                ))}
              </figcaption>
            </figure>

            <div className={cn(panel, "gap-5 md:col-span-7")}>
              <h3 className="text-h2">{act.headline}</h3>
              <div className="flex flex-col gap-3">
                {act.about.map((paragraph) => (
                  <p key={paragraph} className="max-w-xl text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
                {[
                  { term: "Plays", value: act.plays },
                  { term: "First album", value: act.firstAlbum },
                  { term: "Members", value: act.members.join(", ") },
                ].map((fact) => (
                  <div key={fact.term} className="flex flex-col gap-1">
                    <dt className={cn(label, "text-muted-foreground")}>
                      {fact.term}
                    </dt>
                    <dd className="text-body">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 3. Sets */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h2 md:text-h1">Sets at {festival.name}</h2>
          </div>
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <ul>
              {act.sets.map((set) => (
                <li
                  key={set.title}
                  className="flex flex-col gap-1 border-t border-border px-5 py-3 first:border-t-0 md:flex-row md:items-center md:gap-5"
                >
                  <p className={cn(label, "tabular-nums md:w-56 md:shrink-0")}>
                    <time dateTime={set.day.date}>{set.day.label}</time> ·{" "}
                    <time dateTime={dateTime(set.day.date, set.start)}>
                      {set.start}
                    </time>
                    –
                    <time dateTime={dateTime(set.day.date, set.end)}>
                      {set.end}
                    </time>
                  </p>
                  <h3 className="min-w-0 text-h2 md:flex-1">{set.title}</h3>
                  <p className={cn(label, "md:w-40 md:shrink-0")}>
                    {set.stage}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Also on Friday */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h2 md:text-h1">{act.sameDay.heading}</h2>
            <a href="/line-up" className={textLink}>
              Full line-up
            </a>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {act.sameDay.acts.map((other) => (
              <div
                key={other.name}
                className={cn(
                  panel,
                  "flex-row items-center gap-3 md:col-span-6 xl:col-span-3"
                )}
              >
                <div
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-label font-bold text-background"
                >
                  {other.initials}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="text-h2 break-words">
                    <a
                      href={`/artists/${slug(other.name)}`}
                      className={cn(
                        "text-foreground hover:underline underline-offset-4",
                        focusRing
                      )}
                    >
                      {other.name}
                    </a>
                  </h3>
                  <p className={cn(label, "tabular-nums")}>
                    <time dateTime={dateTime(liveSet.day.date, other.start)}>
                      {other.start}
                    </time>{" "}
                    · {other.stage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
