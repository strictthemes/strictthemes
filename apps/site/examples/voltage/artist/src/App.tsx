import { useRef, useState, type KeyboardEvent } from "react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const label = "font-mono text-label font-bold uppercase"

const navLinks = [
  { label: "Line-up", href: "/line-up", current: true },
  { label: "Tickets", href: "/tickets", current: false },
  { label: "Info", href: "/info", current: false },
]

type TimeValue = { text: string; dateTime: string }

type ActSet = {
  day: TimeValue
  start: TimeValue
  end: TimeValue
  title: string
  stage: string
}

type OtherAct = {
  name: string
  slug: string
  initials: string
  start: TimeValue
  stage: string
}

const act = {
  name: "Ossa Bloom",
  initials: "OB",
  origin: "From Gothenburg, Sweden",
  liveDay: { text: "Fri 4 Dec", dateTime: "2026-12-04" },
  liveStage: "Crane Stage",
  pictureLabel: "Drawing of three bars of light over the letters OB, on black",
  members: ["Edda Lind", "Sami Rahko"],
  aboutHeading: "Music you can see",
  about: [
    "Edda Lind and Sami Rahko met in 2019 at an evening course in stage electrics in Gothenburg. She was there to learn how to wire a synth case. He wanted to know why his lamps kept tripping the fuse.",
    "A set starts slowly, with one low tone and a single bulb, and builds over seventy minutes into dense, driving rhythm. Every beat Edda plays also switches a light, so the room sees the music as well as hears it.",
    "Sami builds the rig from parts found at scrap yards around the harbour: old ferry lamps, crane signals and the strip lights of a closed bakery. It packs into four crates and takes two hours to hang.",
  ],
  facts: [
    { term: "Plays", value: "Live electronics and light" },
    { term: "First album", value: "Static Harbour, 2024" },
    { term: "Members", value: "Edda Lind, Sami Rahko" },
  ],
  sets: [
    {
      day: { text: "Fri 4 Dec", dateTime: "2026-12-04" },
      start: { text: "22:40", dateTime: "2026-12-04T22:40+01:00" },
      end: { text: "23:50", dateTime: "2026-12-04T23:50+01:00" },
      title: "Live set",
      stage: "Crane Stage",
    },
    {
      day: { text: "Sat 5 Dec", dateTime: "2026-12-05" },
      start: { text: "15:00", dateTime: "2026-12-05T15:00+01:00" },
      end: { text: "15:45", dateTime: "2026-12-05T15:45+01:00" },
      title: "Talk: Light shows from scrap",
      stage: "Drawing Office",
    },
  ] satisfies ActSet[],
  sameDayHeading: "Also on Friday",
  sameDay: [
    {
      name: "Gravel & Gold",
      slug: "gravel-and-gold",
      initials: "GG",
      start: { text: "19:00", dateTime: "2026-12-04T19:00+01:00" },
      stage: "Crane Stage",
    },
    {
      name: "The Night Ferries",
      slug: "the-night-ferries",
      initials: "NF",
      start: { text: "20:40", dateTime: "2026-12-04T20:40+01:00" },
      stage: "Crane Stage",
    },
    {
      name: "Sister Antenna",
      slug: "sister-antenna",
      initials: "SA",
      start: { text: "21:00", dateTime: "2026-12-04T21:00+01:00" },
      stage: "Pump House",
    },
    {
      name: "Basement Choir",
      slug: "basement-choir",
      initials: "BC",
      start: { text: "23:00", dateTime: "2026-12-04T23:00+01:00" },
      stage: "Pump House",
    },
  ] satisfies OtherAct[],
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

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
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
              className={cn(
                label,
                "text-foreground underline-offset-4 hover:underline",
                link.current && "underline decoration-2",
                focusRing
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto h-auto px-5 py-2 font-mono text-label font-bold uppercase md:hidden"
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
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                label,
                "block py-2 text-foreground underline-offset-4 hover:underline",
                link.current && "underline decoration-2",
                focusRing
              )}
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
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(label, "tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        {/* 1. Name */}
        <section className="flex flex-col gap-3">
          <a
            href="/line-up"
            className={cn(
              label,
              "inline-flex items-center gap-2 self-start text-foreground underline underline-offset-4 hover:decoration-2",
              focusRing
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All acts
          </a>
          <div className="flex flex-col gap-2">
            <p className={cn(label, "tabular-nums")}>
              <time dateTime={act.liveDay.dateTime}>{act.liveDay.text}</time> ·{" "}
              {act.liveStage}
            </p>
            <h1 className="text-h1 md:text-display">{act.name}</h1>
          </div>
          <p className="font-heading text-h2">{act.origin}</p>
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
                  <div className="h-3 w-full bg-background" aria-hidden="true" />
                  <p
                    className="font-heading text-display text-background"
                    aria-hidden="true"
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

            <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 md:col-span-7">
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
            <h2 className="text-h2 md:text-h1">Sets at Tremor Days</h2>
          </div>
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <ul className="list-none p-0">
              {act.sets.map((set, index) => (
                <li
                  key={set.title}
                  className={cn(
                    "flex flex-col gap-1 px-5 py-3 md:flex-row md:items-center md:gap-5",
                    index > 0 && "border-t border-border"
                  )}
                >
                  <p className={cn(label, "tabular-nums md:w-56 md:shrink-0")}>
                    <time dateTime={set.day.dateTime}>{set.day.text}</time> ·{" "}
                    <time dateTime={set.start.dateTime}>{set.start.text}</time>–
                    <time dateTime={set.end.dateTime}>{set.end.text}</time>
                  </p>
                  <h3 className="text-h2 md:flex-1">{set.title}</h3>
                  <p className={cn(label, "md:w-40 md:shrink-0")}>{set.stage}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Also on Friday */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h2 md:text-h1">{act.sameDayHeading}</h2>
            <a
              href="/line-up"
              className={cn(
                "text-foreground underline underline-offset-4 hover:decoration-2",
                focusRing
              )}
            >
              Full line-up
            </a>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {act.sameDay.map((other) => (
              <div
                key={other.slug}
                className="flex flex-row items-center gap-3 rounded-xl border border-border bg-card p-5 md:col-span-6 xl:col-span-3"
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
                  <p className={cn(label, "tabular-nums")}>
                    <time dateTime={other.start.dateTime}>
                      {other.start.text}
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
