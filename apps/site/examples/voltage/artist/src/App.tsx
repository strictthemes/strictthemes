import { useEffect, useRef, useState } from "react"
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
const container = "mx-auto max-w-[1200px] px-3 md:px-5"
const panel = "flex flex-col gap-3 rounded-xl border border-border bg-card p-5"

type Clock = { time: string; dateTime: string }

type Act = {
  name: string
  slug: string
  initials: string
  from: string
  members: string[]
  pictureLabel: string
  aboutHeading: string
  about: string[]
  facts: { label: string; value: string }[]
  headline: { day: string; date: string; stage: string }
  sets: {
    title: string
    stage: string
    day: string
    date: string
    start: Clock
    end: Clock
  }[]
  sameDay: {
    heading: string
    acts: {
      name: string
      slug: string
      initials: string
      stage: string
      start: Clock
    }[]
  }
}

const act: Act = {
  name: "Ossa Bloom",
  slug: "ossa-bloom",
  initials: "OB",
  from: "From Gothenburg, Sweden",
  members: ["Edda Lind", "Sami Rahko"],
  pictureLabel: "Drawing of three bars of light over the letters OB, on black",
  aboutHeading: "Music you can see",
  about: [
    "Edda Lind and Sami Rahko met in 2019 at a youth club in Gothenburg, where she ran the sound desk and he fixed the broken stage lights. They started playing together the same winter, in a rehearsal room above a bicycle shop.",
    "A set starts slow, with one synth line and a kick drum, and builds for an hour until the room moves as one. Edda plays everything live from two keyboards and a drum machine; nothing is pre-recorded.",
    "Sami builds the light rig from parts found at scrap yards: old car headlamps, shop signs and the bulbs of a dismantled fairground. Every lamp is wired to the music, so each beat you hear, you also see.",
  ],
  facts: [
    { label: "Plays", value: "Live electronics and light" },
    { label: "First album", value: "Static Harbour, 2024" },
    { label: "Members", value: "Edda Lind, Sami Rahko" },
  ],
  headline: { day: "Fri 4 Dec", date: "2026-12-04", stage: "Crane Stage" },
  sets: [
    {
      title: "Live set",
      stage: "Crane Stage",
      day: "Fri 4 Dec",
      date: "2026-12-04",
      start: { time: "22:40", dateTime: "2026-12-04T22:40+01:00" },
      end: { time: "23:50", dateTime: "2026-12-04T23:50+01:00" },
    },
    {
      title: "Talk: Light shows from scrap",
      stage: "Drawing Office",
      day: "Sat 5 Dec",
      date: "2026-12-05",
      start: { time: "15:00", dateTime: "2026-12-05T15:00+01:00" },
      end: { time: "15:45", dateTime: "2026-12-05T15:45+01:00" },
    },
  ],
  sameDay: {
    heading: "Also on Friday",
    acts: [
      {
        name: "Gravel & Gold",
        slug: "gravel-and-gold",
        initials: "GG",
        stage: "Crane Stage",
        start: { time: "19:00", dateTime: "2026-12-04T19:00+01:00" },
      },
      {
        name: "The Night Ferries",
        slug: "the-night-ferries",
        initials: "NF",
        stage: "Crane Stage",
        start: { time: "20:40", dateTime: "2026-12-04T20:40+01:00" },
      },
      {
        name: "Sister Antenna",
        slug: "sister-antenna",
        initials: "SA",
        stage: "Pump House",
        start: { time: "21:00", dateTime: "2026-12-04T21:00+01:00" },
      },
      {
        name: "Basement Choir",
        slug: "basement-choir",
        initials: "BC",
        stage: "Pump House",
        start: { time: "23:00", dateTime: "2026-12-04T23:00+01:00" },
      },
    ],
  },
}

const navLinks = [
  { label: "Line-up", href: "/line-up", current: true },
  { label: "Tickets", href: "/tickets", current: false },
  { label: "Info", href: "/info", current: false },
]

function navLinkClass(current: boolean) {
  return cn(
    label,
    "text-foreground underline-offset-4",
    current ? "underline decoration-2" : "hover:underline",
    focusRing
  )
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="border-b border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={navLinkClass(link.current)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p
          className={cn(
            label,
            "ml-auto hidden text-foreground tabular-nums md:block"
          )}
        >
          <FestivalDates />
        </p>
        <Button
          ref={buttonRef}
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLinkClass(link.current), "block py-2")}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="max-w-xl text-body">
          A two-day music and design festival on the old shipyard at Varsby
          Docks.
        </p>
        <p className={cn(label, "text-foreground tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

function TimeRange({ start, end }: { start: Clock; end: Clock }) {
  return (
    <>
      <time dateTime={start.dateTime}>{start.time}</time>–
      <time dateTime={end.dateTime}>{end.time}</time>
    </>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />
      <main className={cn(container, "flex flex-col gap-16 py-8 md:py-16")}>
        {/* 1. Name */}
        <section className="flex flex-col gap-3">
          <a
            href="/line-up"
            className={cn(
              textLink,
              label,
              "inline-flex items-center gap-2 self-start"
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All acts
          </a>
          <div className="flex flex-col gap-2">
            <p className={cn(label, "text-foreground tabular-nums")}>
              <time dateTime={act.headline.date}>{act.headline.day}</time> ·{" "}
              {act.headline.stage}
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
                  <div className="h-3 w-1/2 bg-background" aria-hidden="true" />
                  <div className="h-3 w-3/4 bg-background" aria-hidden="true" />
                  <div
                    className="h-3 w-full bg-background"
                    aria-hidden="true"
                  />
                  <div
                    className="font-heading text-display text-background"
                    aria-hidden="true"
                  >
                    {act.initials}
                  </div>
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
              <h3 className="text-h2">{act.aboutHeading}</h3>
              <div className="flex flex-col gap-3">
                {act.about.map((paragraph) => (
                  <p key={paragraph} className="max-w-xl text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
                {act.facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1">
                    <dt className={cn(label, "text-muted-foreground")}>
                      {fact.label}
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
            <h2 className="text-h2 md:text-h1">Sets at Tremor Days</h2>
          </div>
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <ul className="list-none p-0">
              {act.sets.map((set) => (
                <li
                  key={set.title}
                  className="flex flex-col gap-1 border-t border-border px-5 py-3 first:border-t-0 md:flex-row md:items-center md:gap-5"
                >
                  <p
                    className={cn(
                      label,
                      "text-foreground tabular-nums md:w-56 md:shrink-0"
                    )}
                  >
                    <time dateTime={set.date}>{set.day}</time> ·{" "}
                    <TimeRange start={set.start} end={set.end} />
                  </p>
                  <h3 className="text-h2 md:flex-1">{set.title}</h3>
                  <p
                    className={cn(label, "text-foreground md:w-40 md:shrink-0")}
                  >
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
                key={other.slug}
                className={cn(
                  panel,
                  "flex-row items-center gap-3 md:col-span-6 lg:col-span-3"
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
                      href={`/artists/${other.slug}`}
                      className={cn(
                        "text-foreground underline-offset-4 hover:underline",
                        focusRing
                      )}
                    >
                      {other.name}
                    </a>
                  </h3>
                  <p className={cn(label, "text-foreground tabular-nums")}>
                    <time dateTime={other.start.dateTime}>
                      {other.start.time}
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
