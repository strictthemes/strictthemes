import { useState, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Tide = {
  kind: "Low" | "High"
  time: string
  height: string
}

type Day = {
  date: string
  longDate: string
  shortDate: string
  button: string
  rating: string
  heading: string
  swell: { height: number; period: number; from: string }
  wind: { speed: number; direction: string; aspect: string }
  water: { temp: number; note: string }
  sentence: string
  // In order through the day: low, high, low, high. The third is the
  // daytime low shown on the conditions block, the fourth the high after it.
  tides: [Tide, Tide, Tide, Tide]
}

const DAYS: Day[] = [
  {
    date: "2027-06-17",
    longDate: "Thursday 17 June 2027",
    shortDate: "Thu 17 Jun",
    button: "Today",
    rating: "Good",
    heading: "Good: clean and waist high",
    swell: { height: 3, period: 9, from: "the west" },
    wind: { speed: 8, direction: "East", aspect: "Offshore" },
    water: { temp: 15, note: "Summer wetsuit" },
    sentence:
      "A light offshore wind holds the waves up all morning. Best for beginners in the two hours either side of low water.",
    tides: [
      { kind: "Low", time: "01:12", height: "1.4 m" },
      { kind: "High", time: "07:20", height: "4.6 m" },
      { kind: "Low", time: "13:34", height: "1.5 m" },
      { kind: "High", time: "19:41", height: "4.8 m" },
    ],
  },
  {
    date: "2027-06-18",
    longDate: "Friday 18 June 2027",
    shortDate: "Fri 18 Jun",
    button: "Fri 18 Jun",
    rating: "Very good",
    heading: "Very good: clean and chest high",
    swell: { height: 4, period: 11, from: "the west" },
    wind: { speed: 6, direction: "South-east", aspect: "Offshore" },
    water: { temp: 15, note: "Summer wetsuit" },
    sentence:
      "The best day of the five. A longer swell arrives overnight, and the wind stays light and offshore until the middle of the afternoon.",
    tides: [
      { kind: "Low", time: "02:01", height: "1.2 m" },
      { kind: "High", time: "08:08", height: "4.8 m" },
      { kind: "Low", time: "14:22", height: "1.3 m" },
      { kind: "High", time: "20:28", height: "5.0 m" },
    ],
  },
  {
    date: "2027-06-19",
    longDate: "Saturday 19 June 2027",
    shortDate: "Sat 19 Jun",
    button: "Sat 19 Jun",
    rating: "Fair",
    heading: "Fair: bigger, and bumpy by noon",
    swell: { height: 5, period: 12, from: "the west" },
    wind: { speed: 14, direction: "West", aspect: "Onshore" },
    water: { temp: 15, note: "Summer wetsuit" },
    sentence:
      "The biggest waves of the five days, but the wind turns onshore by noon. Improvers should go early; beginners stay in the white water.",
    tides: [
      { kind: "Low", time: "02:49", height: "1.0 m" },
      { kind: "High", time: "08:55", height: "5.0 m" },
      { kind: "Low", time: "15:09", height: "1.1 m" },
      { kind: "High", time: "21:14", height: "5.2 m" },
    ],
  },
  {
    date: "2027-06-20",
    longDate: "Sunday 20 June 2027",
    shortDate: "Sun 20 Jun",
    button: "Sun 20 Jun",
    rating: "Fair",
    heading: "Fair: small and tidy",
    swell: { height: 2, period: 8, from: "the north-west" },
    wind: { speed: 10, direction: "North", aspect: "Cross-shore" },
    water: { temp: 16, note: "Summer wetsuit" },
    sentence:
      "The swell drops away and the wind swings to the north. Small, tidy waves that suit a first lesson.",
    tides: [
      { kind: "Low", time: "03:36", height: "0.8 m" },
      { kind: "High", time: "09:42", height: "5.2 m" },
      { kind: "Low", time: "15:56", height: "0.9 m" },
      { kind: "High", time: "22:01", height: "5.4 m" },
    ],
  },
  {
    date: "2027-06-21",
    longDate: "Monday 21 June 2027",
    shortDate: "Mon 21 Jun",
    button: "Mon 21 Jun",
    rating: "Poor",
    heading: "Poor: nearly flat, and windy",
    swell: { height: 1, period: 7, from: "the west" },
    wind: { speed: 18, direction: "South-west", aspect: "Onshore" },
    water: { temp: 16, note: "Summer wetsuit" },
    sentence:
      "Hardly a wave, and a stiff onshore wind. A day for a swim, a walk to the north rocks or the café.",
    tides: [
      { kind: "Low", time: "04:24", height: "0.7 m" },
      { kind: "High", time: "10:30", height: "5.3 m" },
      { kind: "Low", time: "16:44", height: "0.8 m" },
      { kind: "High", time: "22:49", height: "5.5 m" },
    ],
  },
]

// Friday has the best conditions of the five days.
const BEST_DAY_INDEX = 1

const READING_NOTES = [
  {
    term: "Swell",
    meaning:
      "The height of the waves out at sea, in feet. On this beach, 2 to 4 ft suits a first lesson.",
  },
  {
    term: "Period",
    meaning:
      "The seconds between one wave and the next. A longer period means stronger, tidier waves.",
  },
  {
    term: "Offshore wind",
    meaning:
      "Wind that blows from the land to the sea. It holds the waves up and keeps them clean; an onshore wind flattens them.",
  },
  {
    term: "Low water",
    meaning:
      "Pentarrow Sands is gentlest for two hours either side of low water, when the waves break over flat sand.",
  },
]

const NAV_LINKS = [
  { label: "Lessons", href: "/lessons" },
  { label: "Forecast", href: "/forecast" },
  { label: "Guide", href: "/guide" },
  { label: "Book", href: "/booking" },
]

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const inlineLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focusOutline
)

const buttonClasses = "h-11 rounded-md px-6 font-mono text-label uppercase"

const label = "font-mono text-label uppercase"
const smallFigure =
  "font-mono text-label uppercase tabular-nums text-muted-foreground"

const headCell =
  "h-auto px-6 py-4 font-mono text-label uppercase text-muted-foreground"
const bodyCell = "px-6 py-4 text-foreground"

function Figure({ value, unit }: { value: ReactNode; unit: string }) {
  return (
    <dd className="flex flex-wrap items-baseline gap-x-2">
      <span className="font-heading text-h1 tabular-nums lg:text-display">
        {value}
      </span>
      <span className={label}>{unit}</span>
    </dd>
  )
}

export function App() {
  const [chosen, setChosen] = useState(0)
  const day = DAYS[chosen]
  const low = day.tides[2]
  const highAfter = day.tides[3]

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1248px] flex-wrap items-center gap-x-6 px-6 py-2">
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focusOutline
            )}
          >
            Sandhopper
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {NAV_LINKS.map((link) => {
                const current = link.href === "/forecast"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
                        current && "underline",
                        focusOutline
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1248px] flex-col gap-24 px-6 pt-10 pb-24">
        <section
          aria-labelledby="forecast-title"
          className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className={cn(label, "tabular-nums")}>
                Pentarrow Sands · Updated{" "}
                <time dateTime="2027-06-17">Thursday 17 June 2027</time> at{" "}
                <time dateTime="06:40">06:40</time>
              </p>
              <h1 id="forecast-title" className="text-h1 md:text-display">
                Surf forecast
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Five days of tide, swell and wind for the beach in front of the
              Boat Shed, checked by our coaches every morning before the first
              lesson.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="day-by-day-title"
          className="flex flex-col gap-6"
        >
          <h2 id="day-by-day-title" className="text-h2">
            Day by day
          </h2>

          <div className="flex flex-col gap-2">
            <p
              id="day-choice-label"
              className="font-mono text-label text-foreground uppercase"
            >
              Choose a day
            </p>
            <div
              role="group"
              aria-labelledby="day-choice-label"
              className="flex flex-wrap gap-2"
            >
              {DAYS.map((d, index) => {
                const pressed = index === chosen
                return (
                  <Button
                    key={d.date}
                    type="button"
                    variant={pressed ? "secondary" : "outline"}
                    aria-pressed={pressed}
                    onClick={() => setChosen(index)}
                    className={buttonClasses}
                  >
                    {d.button}
                  </Button>
                )
              })}
            </div>
            <p role="status" className={smallFigure}>
              Showing <time dateTime={day.date}>{day.longDate}</time>
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10">
            <div className="flex flex-col gap-2">
              <p className={label}>
                <time dateTime={day.date}>{day.longDate}</time>
              </p>
              <h3 className="text-h2">{day.heading}</h3>
            </div>

            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Tide</dt>
                <Figure
                  value={<time dateTime={low.time}>{low.time}</time>}
                  unit="low"
                />
                <dd className={cn(label, "tabular-nums")}>
                  {low.height} · High at{" "}
                  <time dateTime={highAfter.time}>{highAfter.time}</time>
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Swell</dt>
                <Figure value={day.swell.height} unit="ft" />
                <dd className={cn(label, "tabular-nums")}>
                  {day.swell.period} s · From {day.swell.from}
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Wind</dt>
                <Figure value={day.wind.speed} unit="mph" />
                <dd className={label}>
                  {day.wind.direction} · {day.wind.aspect}
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Water</dt>
                <Figure value={day.water.temp} unit="°C" />
                <dd className={label}>{day.water.note}</dd>
              </div>
            </dl>

            <p className="max-w-xl text-body">{day.sentence}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-6">
          <section
            aria-labelledby="tide-times-title"
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="flex flex-col gap-2">
              <h2 id="tide-times-title" className="text-h2">
                Tide times
              </h2>
              <p className={smallFigure}>
                <time dateTime={day.date}>{day.longDate}</time> · Pentarrow
                Sands
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table label="Tide times" className="text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead scope="col" className={headCell}>
                      Tide
                    </TableHead>
                    <TableHead scope="col" className={headCell}>
                      Time
                    </TableHead>
                    <TableHead scope="col" className={headCell}>
                      Height
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {day.tides.map((tide) => (
                    <TableRow key={tide.time} className="hover:bg-transparent">
                      <TableCell className={bodyCell}>{tide.kind}</TableCell>
                      <TableCell className={cn(bodyCell, "tabular-nums")}>
                        <time dateTime={tide.time}>{tide.time}</time>
                      </TableCell>
                      <TableCell className={cn(bodyCell, "tabular-nums")}>
                        {tide.height}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section
            aria-labelledby="how-to-read-title"
            className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7"
          >
            <h2 id="how-to-read-title" className="text-h2">
              How to read it
            </h2>
            <dl className="flex flex-col gap-6">
              {READING_NOTES.map((note) => (
                <div key={note.term} className="flex flex-col gap-2">
                  <dt className="text-body font-bold text-foreground">
                    {note.term}
                  </dt>
                  <dd className="max-w-xl text-body">{note.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section
          aria-labelledby="five-days-title"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2 id="five-days-title" className="text-h2">
              Five days
            </h2>
            <p className={smallFigure}>
              Updated <time dateTime="06:40">06:40</time> · Swell in feet · Wind
              in miles an hour
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <Table label="Five days" className="text-body">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {[
                    "Day",
                    "Swell",
                    "Period",
                    "Wind",
                    "Direction",
                    "Rating",
                  ].map((heading) => (
                    <TableHead key={heading} scope="col" className={headCell}>
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((d, index) => {
                  const current = index === chosen
                  return (
                    <TableRow
                      key={d.date}
                      aria-current={current ? "true" : undefined}
                      className={
                        current
                          ? "bg-accent hover:bg-accent"
                          : "hover:bg-transparent"
                      }
                    >
                      <TableCell
                        className={cn(bodyCell, current && "font-bold")}
                      >
                        <time dateTime={d.date}>{d.shortDate}</time>
                      </TableCell>
                      <TableCell className={cn(bodyCell, "tabular-nums")}>
                        {d.swell.height} ft
                      </TableCell>
                      <TableCell className={cn(bodyCell, "tabular-nums")}>
                        {d.swell.period} s
                      </TableCell>
                      <TableCell className={cn(bodyCell, "tabular-nums")}>
                        {d.wind.speed} mph
                      </TableCell>
                      <TableCell className={bodyCell}>
                        {d.wind.direction}, {d.wind.aspect.toLowerCase()}
                      </TableCell>
                      <TableCell className={bodyCell}>
                        {index === BEST_DAY_INDEX ? (
                          <span className="inline-flex items-center gap-2">
                            {d.rating}
                            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                              Best day
                            </Badge>
                          </span>
                        ) : (
                          d.rating
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/booking"
              className={cn(
                buttonVariants({ variant: "default" }),
                buttonClasses,
                "w-full md:w-auto"
              )}
            >
              Book a lesson
            </a>
            <p className="max-w-xl text-body">
              Lessons run every day. We set the start time by the tide.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-6 px-6 py-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-heading text-h2">Sandhopper Surf School</p>
            <p className="text-body">
              Surf lessons and kit hire at Pentarrow Sands since 2009.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <p className={cn(label, "text-muted-foreground")}>
              The Boat Shed · Beach Road · Pentarrow Sands · ZP7 3SB
            </p>
            <p className="text-body">
              <a href="tel:+441632960418" className={inlineLink}>
                01632 960 418
              </a>{" "}
              ·{" "}
              <a href="mailto:hello@sandhopper.example" className={inlineLink}>
                hello@sandhopper.example
              </a>
            </p>
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Every day · <time dateTime="08:30">08:30</time>–
              <time dateTime="18:00">18:00</time> · © 2027 Sandhopper Surf
              School
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
