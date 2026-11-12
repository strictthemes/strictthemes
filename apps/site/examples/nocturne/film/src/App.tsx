import { useState } from "react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"

const SCREEN = "Screen 1"

type Showtime = { time: string; note?: string }

type ShowDay = {
  date: string
  short: string
  full: string
  times: Showtime[]
}

const days: ShowDay[] = [
  {
    date: "2026-11-11",
    short: "Wed 11 Nov",
    full: "Wednesday 11 November",
    times: [{ time: "17:30" }, { time: "20:15" }],
  },
  {
    date: "2026-11-12",
    short: "Thu 12 Nov",
    full: "Thursday 12 November",
    times: [{ time: "18:00" }, { time: "20:45" }],
  },
  {
    date: "2026-11-13",
    short: "Fri 13 Nov",
    full: "Friday 13 November",
    times: [{ time: "17:00" }, { time: "20:30", note: "Q&A" }],
  },
  {
    date: "2026-11-14",
    short: "Sat 14 Nov",
    full: "Saturday 14 November",
    times: [{ time: "16:30" }, { time: "19:15" }, { time: "22:00" }],
  },
  {
    date: "2026-11-15",
    short: "Sun 15 Nov",
    full: "Sunday 15 November",
    times: [{ time: "13:30" }, { time: "16:15" }, { time: "19:00" }],
  },
]

type Choice = { date: string; time: string; screen: string }

const credits = [
  { role: "Director", name: "Ada Kessler" },
  { role: "Written by", name: "Ada Kessler, Sindre Vold" },
  { role: "Maren", name: "Ingrid Solberg" },
  { role: "Cinematography", name: "Hanne Kvist" },
  { role: "Music", name: "Oskar Lunde" },
  { role: "Editing", name: "Tora Brekke" },
]

const labelClass = "font-mono text-label uppercase"

function describeChoice(choice: Choice | null) {
  if (!choice) return "Choose a time to book seats."
  const day = days.find((d) => d.date === choice.date)
  const showtime = day?.times.find((t) => t.time === choice.time)
  if (!day || !showtime) return "Choose a time to book seats."
  const sentence = `You have chosen ${day.full} at ${choice.time}, ${choice.screen}.`
  return showtime.note
    ? `${sentence} This screening is followed by a talk with Ada Kessler.`
    : sentence
}

export function App() {
  const [choice, setChoice] = useState<Choice | null>(null)

  function choose(date: string, time: string) {
    setChoice((current) =>
      current && current.date === date && current.time === time
        ? null
        : { date, time, screen: SCREEN }
    )
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-4 pt-12 md:px-6">
        <section>
          <p className={cn(labelClass, "text-muted-foreground")}>
            <a
              href="/"
              className={cn(
                "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
                focusOutline
              )}
            >
              Programme
            </a>{" "}
            · Now showing
          </p>
          <h1 className="mt-2 text-h1 md:text-display">Low Tide at Merrow</h1>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <li className={cn(labelClass, "text-muted-foreground")}>
              <span className="sr-only">Year: </span>2026
            </li>
            <li className={cn(labelClass, "text-muted-foreground")}>Norway</li>
            <li className={cn(labelClass, "text-muted-foreground")}>
              118 min
            </li>
            <li className={cn(labelClass, "text-muted-foreground")}>
              Rated 15
            </li>
            <li className={cn(labelClass, "text-muted-foreground")}>
              Subtitled
            </li>
          </ul>

          <figure className="mt-12">
            <div
              role="img"
              aria-label="Still from Low Tide at Merrow: Maren on the ferry's open deck, the island behind her"
              className="aspect-video w-full rounded-xl border border-border bg-muted"
            />
            <figcaption
              className={cn(labelClass, "mt-2 text-muted-foreground")}
            >
              Ingrid Solberg as Maren · The ferry's open deck
            </figcaption>
          </figure>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <h2 className="text-h2 md:text-h1">Synopsis</h2>
            <p className="mt-4 max-w-xl">
              Maren pilots the car ferry between two mainland towns and has not
              set foot on Merrow since she left it at nineteen. When her father
              dies, she goes back for one week to clear his house and sign it
              over to a buyer she has only spoken to on the phone.
            </p>
            <p className="mt-4 max-w-xl">
              The harbour town is battening down for a storm. Every evening the
              radio says it will arrive tomorrow, and every morning the sea is
              flat. The neighbours keep their boats tied up, the shop runs out
              of candles, and Maren finds herself stuck in the waiting with
              them.
            </p>
            <p className="mt-4 max-w-xl">
              Ada Kessler's second feature is a quiet film about what a place
              keeps of the people who leave it. Shot on the coast west of
              Bergen over one winter, it lets the weather do most of the
              talking.
            </p>
          </div>

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="text-h2 md:text-h1">Credits</h2>
            <dl className="mt-6 border-b border-border">
              {credits.map((credit) => (
                <div key={credit.role} className="border-t border-border py-4">
                  <dt className={cn(labelClass, "text-muted-foreground")}>
                    {credit.role}
                  </dt>
                  <dd className="mt-1 text-body">{credit.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="showtimes" className="mt-24">
          <h2 className="text-h2 md:text-h1">Showtimes</h2>
          <p className="mt-4 max-w-xl">
            Low Tide at Merrow plays in Screen 1, and every screening is in
            Norwegian with English subtitles.
          </p>
          <ul className="mt-6 border-b border-border">
            {days.map((day) => (
              <li
                key={day.date}
                className="flex flex-col gap-2 border-t border-border py-4 md:flex-row md:items-center md:gap-6"
              >
                <p
                  className={cn(
                    labelClass,
                    "text-muted-foreground md:w-32 md:shrink-0"
                  )}
                >
                  <time dateTime={day.date} className="tabular-nums">
                    {day.short}
                  </time>
                </p>
                <div
                  role="group"
                  aria-label={`Times on ${day.full}`}
                  className="flex flex-wrap gap-2"
                >
                  {day.times.map((showtime) => {
                    const pressed =
                      choice?.date === day.date &&
                      choice?.time === showtime.time
                    return (
                      <Button
                        key={showtime.time}
                        variant={pressed ? "secondary" : "outline"}
                        aria-pressed={pressed}
                        onClick={() => choose(day.date, showtime.time)}
                        className={cn(buttonClass, "tabular-nums")}
                      >
                        <time dateTime={`${day.date}T${showtime.time}`}>
                          {showtime.time}
                        </time>
                        {showtime.note ? ` · ${showtime.note}` : null}
                      </Button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p aria-live="polite" className="text-body">
              {describeChoice(choice)}
            </p>
            {choice ? (
              <a
                href="#"
                className={cn(buttonVariants({ variant: "default" }), buttonClass)}
              >
                Book seats
              </a>
            ) : null}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <figure className="md:col-span-8">
            <blockquote className="border-l-2 border-foreground pl-6">
              <p className="font-heading text-h2">
                Kessler keeps the storm offshore for two hours, and you feel
                every minute of the waiting.
              </p>
            </blockquote>
            <figcaption className={cn(labelClass, "mt-4 text-muted-foreground")}>
              Tomas Brecht · The Oldmere Review
            </figcaption>
          </figure>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
