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

type Tide = { kind: "low" | "high"; time: string; height: number }

type Day = {
  date: string
  long: string
  button: string
  short: string
  rating: string
  best?: boolean
  heading: string
  swell: number
  period: number
  swellFrom: string
  wind: number
  windNote: string
  windTable: string
  water: number
  waterNote: string
  sentence: string
  tides: [Tide, Tide, Tide, Tide]
}

const days: Day[] = [
  {
    date: "2027-06-17",
    long: "Thursday 17 June 2027",
    button: "Today",
    short: "Thu 17 Jun",
    rating: "Good",
    heading: "Good: clean and waist high",
    swell: 3,
    period: 9,
    swellFrom: "From the west",
    wind: 8,
    windNote: "East · Offshore",
    windTable: "East, offshore",
    water: 15,
    waterNote: "Summer wetsuit",
    sentence:
      "A light offshore wind holds the waves up all morning. Best for beginners in the two hours either side of low water.",
    tides: [
      { kind: "low", time: "01:12", height: 1.4 },
      { kind: "high", time: "07:20", height: 4.6 },
      { kind: "low", time: "13:34", height: 1.5 },
      { kind: "high", time: "19:41", height: 4.8 },
    ],
  },
  {
    date: "2027-06-18",
    long: "Friday 18 June 2027",
    button: "Fri 18 Jun",
    short: "Fri 18 Jun",
    rating: "Very good",
    best: true,
    heading: "Very good: clean and chest high",
    swell: 4,
    period: 11,
    swellFrom: "From the west",
    wind: 6,
    windNote: "South-east · Offshore",
    windTable: "South-east, offshore",
    water: 15,
    waterNote: "Summer wetsuit",
    sentence:
      "The best day of the five. A longer swell arrives overnight, and the wind stays light and offshore until the middle of the afternoon.",
    tides: [
      { kind: "low", time: "02:01", height: 1.2 },
      { kind: "high", time: "08:08", height: 4.8 },
      { kind: "low", time: "14:22", height: 1.3 },
      { kind: "high", time: "20:28", height: 5.0 },
    ],
  },
  {
    date: "2027-06-19",
    long: "Saturday 19 June 2027",
    button: "Sat 19 Jun",
    short: "Sat 19 Jun",
    rating: "Fair",
    heading: "Fair: bigger, and bumpy by noon",
    swell: 5,
    period: 12,
    swellFrom: "From the west",
    wind: 14,
    windNote: "West · Onshore",
    windTable: "West, onshore",
    water: 15,
    waterNote: "Summer wetsuit",
    sentence:
      "The biggest waves of the five days, but the wind turns onshore by noon. Improvers should go early; beginners stay in the white water.",
    tides: [
      { kind: "low", time: "02:49", height: 1.0 },
      { kind: "high", time: "08:55", height: 5.0 },
      { kind: "low", time: "15:09", height: 1.1 },
      { kind: "high", time: "21:14", height: 5.2 },
    ],
  },
  {
    date: "2027-06-20",
    long: "Sunday 20 June 2027",
    button: "Sun 20 Jun",
    short: "Sun 20 Jun",
    rating: "Fair",
    heading: "Fair: small and tidy",
    swell: 2,
    period: 8,
    swellFrom: "From the north-west",
    wind: 10,
    windNote: "North · Cross-shore",
    windTable: "North, cross-shore",
    water: 16,
    waterNote: "Summer wetsuit",
    sentence:
      "The swell drops away and the wind swings to the north. Small, tidy waves that suit a first lesson.",
    tides: [
      { kind: "low", time: "03:36", height: 0.8 },
      { kind: "high", time: "09:42", height: 5.2 },
      { kind: "low", time: "15:56", height: 0.9 },
      { kind: "high", time: "22:01", height: 5.4 },
    ],
  },
  {
    date: "2027-06-21",
    long: "Monday 21 June 2027",
    button: "Mon 21 Jun",
    short: "Mon 21 Jun",
    rating: "Poor",
    heading: "Poor: nearly flat, and windy",
    swell: 1,
    period: 7,
    swellFrom: "From the west",
    wind: 18,
    windNote: "South-west · Onshore",
    windTable: "South-west, onshore",
    water: 16,
    waterNote: "Summer wetsuit",
    sentence:
      "Hardly a wave, and a stiff onshore wind. A day for a swim, a walk to the north rocks or the café.",
    tides: [
      { kind: "low", time: "04:24", height: 0.7 },
      { kind: "high", time: "10:30", height: 5.3 },
      { kind: "low", time: "16:44", height: 0.8 },
      { kind: "high", time: "22:49", height: 5.5 },
    ],
  },
]

const metres = (height: number) => `${height.toFixed(1)} m`

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1248px] px-6"

const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focusOutline
)

const label = "font-mono text-label uppercase"
const smallFigure =
  "font-mono text-label uppercase tabular-nums text-muted-foreground"
const buttonClasses = "h-11 rounded-md px-6 font-mono text-label uppercase"

const navItems = [
  { label: "Lessons", href: "/lessons" },
  { label: "Forecast", href: "/forecast", current: true },
  { label: "Guide", href: "/guide" },
  { label: "Book", href: "/booking" },
]

const readingNotes = [
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
  const day = days[chosen]
  const [, , lowTide, highTide] = day.tides

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(container, "flex flex-wrap items-center gap-x-6 py-2")}
        >
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
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(navLink, item.current && "underline")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-24 pt-10 pb-24")}>
        <section
          aria-labelledby="forecast-title"
          className="rounded-xl bg-coral p-6 text-coral-foreground md:p-10"
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

        <section aria-labelledby="day-by-day" className="flex flex-col gap-6">
          <h2 id="day-by-day" className="text-h2">
            Day by day
          </h2>

          <div className="flex flex-col gap-2">
            <p id="choose-day" className={cn(label, "text-foreground")}>
              Choose a day
            </p>
            <div
              role="group"
              aria-labelledby="choose-day"
              className="flex flex-wrap gap-2"
            >
              {days.map((d, index) => (
                <Button
                  key={d.date}
                  type="button"
                  variant={index === chosen ? "secondary" : "outline"}
                  aria-pressed={index === chosen}
                  onClick={() => setChosen(index)}
                  className={buttonClasses}
                >
                  {d.button}
                </Button>
              ))}
            </div>
            <p role="status" className={smallFigure}>
              Showing <time dateTime={day.date}>{day.long}</time>
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10">
            <div className="flex flex-col gap-2">
              <p className={cn(label, "tabular-nums")}>
                <time dateTime={day.date}>{day.long}</time>
              </p>
              <h3 className="text-h2">{day.heading}</h3>
            </div>

            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Tide</dt>
                <Figure
                  value={<time dateTime={lowTide.time}>{lowTide.time}</time>}
                  unit="low"
                />
                <dd className={cn(label, "tabular-nums")}>
                  {metres(lowTide.height)} · High at{" "}
                  <time dateTime={highTide.time}>{highTide.time}</time>
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Swell</dt>
                <Figure value={day.swell} unit="ft" />
                <dd className={cn(label, "tabular-nums")}>
                  {day.period} s · {day.swellFrom}
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Wind</dt>
                <Figure value={day.wind} unit="mph" />
                <dd className={label}>{day.windNote}</dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Water</dt>
                <Figure value={day.water} unit="°C" />
                <dd className={label}>{day.waterNote}</dd>
              </div>
            </dl>

            <p className="max-w-xl text-body">{day.sentence}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-6">
          <section
            aria-labelledby="tide-times"
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="flex flex-col gap-2">
              <h2 id="tide-times" className="text-h2">
                Tide times
              </h2>
              <p className={smallFigure}>
                <time dateTime={day.date}>{day.long}</time> · Pentarrow Sands
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table label="Tide times" className="text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Tide", "Time", "Height"].map((heading) => (
                      <TableHead
                        key={heading}
                        scope="col"
                        className={cn(
                          label,
                          "h-auto px-6 py-4 text-muted-foreground"
                        )}
                      >
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {day.tides.map((tide) => (
                    <TableRow key={tide.time} className="hover:bg-transparent">
                      <TableCell className="px-6 py-4 text-foreground">
                        {tide.kind === "low" ? "Low" : "High"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-foreground tabular-nums">
                        <time dateTime={tide.time}>{tide.time}</time>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-foreground tabular-nums">
                        {metres(tide.height)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section
            aria-labelledby="how-to-read"
            className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7"
          >
            <h2 id="how-to-read" className="text-h2">
              How to read it
            </h2>
            <dl className="flex flex-col gap-6">
              {readingNotes.map((note) => (
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

        <section aria-labelledby="five-days" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="five-days" className="text-h2">
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
                    <TableHead
                      key={heading}
                      scope="col"
                      className={cn(
                        label,
                        "h-auto px-6 py-4 text-muted-foreground"
                      )}
                    >
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((d, index) => {
                  const isChosen = index === chosen
                  const cell = cn(
                    "px-6 py-4",
                    isChosen ? "text-secondary-foreground" : "text-foreground"
                  )
                  return (
                    <TableRow
                      key={d.date}
                      aria-current={isChosen ? "true" : undefined}
                      className={
                        isChosen
                          ? "bg-secondary hover:bg-secondary"
                          : "hover:bg-transparent"
                      }
                    >
                      <TableCell className={cn(cell, isChosen && "font-bold")}>
                        <time dateTime={d.date}>{d.short}</time>
                      </TableCell>
                      <TableCell className={cn(cell, "tabular-nums")}>
                        {d.swell} ft
                      </TableCell>
                      <TableCell className={cn(cell, "tabular-nums")}>
                        {d.period} s
                      </TableCell>
                      <TableCell className={cn(cell, "tabular-nums")}>
                        {d.wind} mph
                      </TableCell>
                      <TableCell className={cell}>{d.windTable}</TableCell>
                      <TableCell className={cell}>
                        {d.best ? (
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
        <div
          className={cn(
            container,
            "flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between"
          )}
        >
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
            <p className="text-body wrap-break-word">
              <a href="tel:+441632960418" className={textLink}>
                01632 960 418
              </a>{" "}
              ·{" "}
              <a
                href="mailto:hello@sandhopper.example"
                className={cn(textLink, "wrap-break-word")}
              >
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
