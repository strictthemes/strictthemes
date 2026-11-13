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
  iso: string
  button: string
  short: string
  long: string
  rating: string
  heading: string
  swell: { value: string; unit: string; note: string }
  period: string
  wind: { value: string; unit: string; note: string; table: string }
  water: { value: string; unit: string; note: string }
  sentence: string
  tides: [Tide, Tide, Tide, Tide]
  best?: boolean
}

const days: Day[] = [
  {
    iso: "2027-06-17",
    button: "Today",
    short: "Thu 17 Jun",
    long: "Thursday 17 June 2027",
    rating: "Good",
    heading: "Good: clean and waist high",
    swell: { value: "3", unit: "ft", note: "9 s · From the west" },
    period: "9 s",
    wind: {
      value: "8",
      unit: "mph",
      note: "East · Offshore",
      table: "East, offshore",
    },
    water: { value: "15", unit: "°C", note: "Summer wetsuit" },
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
    iso: "2027-06-18",
    button: "Fri 18 Jun",
    short: "Fri 18 Jun",
    long: "Friday 18 June 2027",
    rating: "Very good",
    heading: "Very good: clean and chest high",
    swell: { value: "4", unit: "ft", note: "11 s · From the west" },
    period: "11 s",
    wind: {
      value: "6",
      unit: "mph",
      note: "South-east · Offshore",
      table: "South-east, offshore",
    },
    water: { value: "15", unit: "°C", note: "Summer wetsuit" },
    sentence:
      "The best day of the five. A longer swell arrives overnight, and the wind stays light and offshore until the middle of the afternoon.",
    tides: [
      { kind: "Low", time: "02:01", height: "1.2 m" },
      { kind: "High", time: "08:08", height: "4.8 m" },
      { kind: "Low", time: "14:22", height: "1.3 m" },
      { kind: "High", time: "20:28", height: "5.0 m" },
    ],
    best: true,
  },
  {
    iso: "2027-06-19",
    button: "Sat 19 Jun",
    short: "Sat 19 Jun",
    long: "Saturday 19 June 2027",
    rating: "Fair",
    heading: "Fair: bigger, and bumpy by noon",
    swell: { value: "5", unit: "ft", note: "12 s · From the west" },
    period: "12 s",
    wind: {
      value: "14",
      unit: "mph",
      note: "West · Onshore",
      table: "West, onshore",
    },
    water: { value: "15", unit: "°C", note: "Summer wetsuit" },
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
    iso: "2027-06-20",
    button: "Sun 20 Jun",
    short: "Sun 20 Jun",
    long: "Sunday 20 June 2027",
    rating: "Fair",
    heading: "Fair: small and tidy",
    swell: { value: "2", unit: "ft", note: "8 s · From the north-west" },
    period: "8 s",
    wind: {
      value: "10",
      unit: "mph",
      note: "North · Cross-shore",
      table: "North, cross-shore",
    },
    water: { value: "16", unit: "°C", note: "Summer wetsuit" },
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
    iso: "2027-06-21",
    button: "Mon 21 Jun",
    short: "Mon 21 Jun",
    long: "Monday 21 June 2027",
    rating: "Poor",
    heading: "Poor: nearly flat, and windy",
    swell: { value: "1", unit: "ft", note: "7 s · From the west" },
    period: "7 s",
    wind: {
      value: "18",
      unit: "mph",
      note: "South-west · Onshore",
      table: "South-west, onshore",
    },
    water: { value: "16", unit: "°C", note: "Summer wetsuit" },
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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinkClass = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
  focusOutline
)

const textLinkClass = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focusOutline
)

const buttonClass = "h-11 rounded-md px-6 font-mono text-label uppercase"

const label = "font-mono text-label uppercase"

const smallFigure =
  "font-mono text-label text-muted-foreground uppercase tabular-nums"

const tableHeadClass =
  "h-auto px-6 py-4 font-mono text-label text-muted-foreground uppercase"

const tableCellClass = "px-6 py-4 text-foreground"

const navLinks = [
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
  const lowTide = day.tides[2]
  const highTide = day.tides[3]

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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(navLinkClass, link.current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1248px] flex-col gap-24 px-6 pt-10 pb-24">
        <section
          aria-labelledby="forecast-heading"
          className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className={cn(label, "tabular-nums")}>
                Pentarrow Sands · Updated{" "}
                <time dateTime="2027-06-17">Thursday 17 June 2027</time> at{" "}
                <time dateTime="06:40">06:40</time>
              </p>
              <h1 id="forecast-heading" className="text-h1 md:text-display">
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

        <section aria-labelledby="day-heading" className="flex flex-col gap-6">
          <h2 id="day-heading" className="text-h2">
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
              {days.map((d, index) => {
                const isChosen = index === chosen
                return (
                  <Button
                    key={d.iso}
                    type="button"
                    variant={isChosen ? "secondary" : "outline"}
                    aria-pressed={isChosen}
                    onClick={() => setChosen(index)}
                    className={buttonClass}
                  >
                    {d.button}
                  </Button>
                )
              })}
            </div>
            <p role="status" className={smallFigure}>
              Showing <time dateTime={day.iso}>{day.long}</time>
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10">
            <div className="flex flex-col gap-2">
              <p className={label}>
                <time dateTime={day.iso}>{day.long}</time>
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
                  {lowTide.height} · High at{" "}
                  <time dateTime={highTide.time}>{highTide.time}</time>
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Swell</dt>
                <Figure value={day.swell.value} unit={day.swell.unit} />
                <dd className={cn(label, "tabular-nums")}>{day.swell.note}</dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Wind</dt>
                <Figure value={day.wind.value} unit={day.wind.unit} />
                <dd className={label}>{day.wind.note}</dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Water</dt>
                <Figure value={day.water.value} unit={day.water.unit} />
                <dd className={label}>{day.water.note}</dd>
              </div>
            </dl>

            <p className="max-w-xl text-body">{day.sentence}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-6">
          <section
            aria-labelledby="tides-heading"
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="flex flex-col gap-2">
              <h2 id="tides-heading" className="text-h2">
                Tide times
              </h2>
              <p className={smallFigure}>
                <time dateTime={day.iso}>{day.long}</time> · Pentarrow Sands
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table label="Tide times" className="text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead scope="col" className={tableHeadClass}>
                      Tide
                    </TableHead>
                    <TableHead scope="col" className={tableHeadClass}>
                      Time
                    </TableHead>
                    <TableHead scope="col" className={tableHeadClass}>
                      Height
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {day.tides.map((tide) => (
                    <TableRow key={tide.time} className="hover:bg-transparent">
                      <TableCell className={tableCellClass}>
                        {tide.kind}
                      </TableCell>
                      <TableCell className={cn(tableCellClass, "tabular-nums")}>
                        <time dateTime={tide.time}>{tide.time}</time>
                      </TableCell>
                      <TableCell className={cn(tableCellClass, "tabular-nums")}>
                        {tide.height}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section
            aria-labelledby="reading-heading"
            className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7"
          >
            <h2 id="reading-heading" className="text-h2">
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

        <section
          aria-labelledby="five-days-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h2 id="five-days-heading" className="text-h2">
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
                      className={tableHeadClass}
                    >
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((d, index) => {
                  const isChosen = index === chosen
                  return (
                    <TableRow
                      key={d.iso}
                      aria-current={isChosen ? "true" : undefined}
                      className={
                        isChosen
                          ? "bg-accent hover:bg-accent"
                          : "hover:bg-transparent"
                      }
                    >
                      <TableCell
                        className={cn(tableCellClass, isChosen && "font-bold")}
                      >
                        <time dateTime={d.iso}>{d.short}</time>
                      </TableCell>
                      <TableCell className={cn(tableCellClass, "tabular-nums")}>
                        {d.swell.value} {d.swell.unit}
                      </TableCell>
                      <TableCell className={cn(tableCellClass, "tabular-nums")}>
                        {d.period}
                      </TableCell>
                      <TableCell className={cn(tableCellClass, "tabular-nums")}>
                        {d.wind.value} {d.wind.unit}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {d.wind.table}
                      </TableCell>
                      <TableCell className={tableCellClass}>
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
                buttonClass,
                "w-full md:w-auto"
              )}
            >
              Book a lesson
            </a>
            <p className="text-body">
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
              <a href="tel:+441632960418" className={textLinkClass}>
                01632 960 418
              </a>{" "}
              ·{" "}
              <a
                href="mailto:hello@sandhopper.example"
                className={cn(textLinkClass, "wrap-break-word")}
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
