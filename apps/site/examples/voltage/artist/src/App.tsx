import { ArrowLeft } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const label = "font-mono text-label font-bold uppercase text-foreground"

type ActSet = {
  /** Day as YYYY-MM-DD, shown in the short form. */
  date: string
  dayLabel: string
  start: string
  end: string
  title: string
  stage: string
}

type OtherAct = {
  name: string
  slug: string
  initials: string
  start: string
  stage: string
}

type Act = {
  name: string
  from: string
  initials: string
  members: string[]
  pictureLabel: string
  aboutHeading: string
  about: string[]
  facts: { label: string; value: string }[]
  headline: { date: string; dayLabel: string; stage: string }
  sets: ActSet[]
  sameDay: { dayName: string; date: string; acts: OtherAct[] }
}

const OFFSET = "+01:00"

const act: Act = {
  name: "Ossa Bloom",
  from: "From Gothenburg, Sweden",
  initials: "OB",
  members: ["Edda Lind", "Sami Rahko"],
  pictureLabel: "Drawing of three bars of light over the letters OB, on black",
  aboutHeading: "Music you can see",
  about: [
    "Edda Lind and Sami Rahko met in 2019 at a Gothenburg print shop, where she fixed old synths in the back room and he hung lamps for a night of slide shows. By spring they were playing those nights together.",
    "A set starts slow, with one pulse and a lot of room, and builds over an hour into dense, rolling drums. Edda plays every part live from two keyboards and a drum machine; nothing runs from a laptop.",
    "Sami builds the light rig from parts found at scrap yards: harbour lamps, car headlights and a crane's warning beacon. Each light is wired to one sound, so the room flashes in time with the music.",
  ],
  facts: [
    { label: "Plays", value: "Live electronics and light" },
    { label: "First album", value: "Static Harbour, 2024" },
    { label: "Members", value: "Edda Lind, Sami Rahko" },
  ],
  headline: { date: "2026-12-04", dayLabel: "Fri 4 Dec", stage: "Crane Stage" },
  sets: [
    {
      date: "2026-12-04",
      dayLabel: "Fri 4 Dec",
      start: "22:40",
      end: "23:50",
      title: "Live set",
      stage: "Crane Stage",
    },
    {
      date: "2026-12-05",
      dayLabel: "Sat 5 Dec",
      start: "15:00",
      end: "15:45",
      title: "Talk: Light shows from scrap",
      stage: "Drawing Office",
    },
  ],
  sameDay: {
    dayName: "Friday",
    date: "2026-12-04",
    acts: [
      { name: "Gravel & Gold", slug: "gravel-and-gold", initials: "GG", start: "19:00", stage: "Crane Stage" },
      { name: "The Night Ferries", slug: "the-night-ferries", initials: "NF", start: "20:40", stage: "Crane Stage" },
      { name: "Sister Antenna", slug: "sister-antenna", initials: "SA", start: "21:00", stage: "Pump House" },
      { name: "Basement Choir", slug: "basement-choir", initials: "BC", start: "23:00", stage: "Pump House" },
    ],
  },
}

function dateTime(date: string, time: string) {
  return `${date}T${time}${OFFSET}`
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader current="/line-up" />
      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        {/* 1. Name */}
        <section className="flex flex-col gap-3">
          <a
            href="/line-up"
            className={cn(
              label,
              "inline-flex items-center gap-2 self-start underline underline-offset-4 hover:decoration-2",
              focusRing
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All acts
          </a>
          <div className="flex flex-col gap-2">
            <p className={label}>
              <time dateTime={act.headline.date}>{act.headline.dayLabel}</time>{" "}
              · {act.headline.stage}
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
              <figcaption
                className={cn(label, "text-muted-foreground")}
              >
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
                  <p className={cn(label, "tabular-nums md:w-56 md:shrink-0")}>
                    <time dateTime={set.date}>{set.dayLabel}</time> ·{" "}
                    <time dateTime={dateTime(set.date, set.start)}>
                      {set.start}
                    </time>
                    –
                    <time dateTime={dateTime(set.date, set.end)}>{set.end}</time>
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
            <h2 className="text-h2 md:text-h1">
              Also on {act.sameDay.dayName}
            </h2>
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
            {act.sameDay.acts.map((other) => (
              <div
                key={other.slug}
                className="flex flex-row items-center gap-3 rounded-xl border border-border bg-card p-5 md:col-span-6 lg:col-span-3"
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
                  <p className={label}>
                    <time
                      dateTime={dateTime(act.sameDay.date, other.start)}
                      className="tabular-nums"
                    >
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
