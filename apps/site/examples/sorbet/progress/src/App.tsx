import { useState } from "react"
import { Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Period = "week" | "month"

type Habit = { code: string; name: string }

const HABITS: Habit[] = [
  { code: "W", name: "Drink 8 glasses of water" },
  { code: "R", name: "Read 10 pages" },
  { code: "L", name: "Walk after lunch" },
  { code: "S", name: "Stretch for 5 minutes" },
  { code: "P", name: "No phone after 22:00" },
]

// The 30 days from 13 October to 11 November 2026, oldest first.
// Each string lists the habits done that day by their code.
const FIRST_DAY = Date.UTC(2026, 9, 13)
const DONE_BY_DAY = [
  "WL",
  "WRL",
  "WRLSP",
  "WRLS",
  "WRLSP",
  "WRLSP",
  "WRLSP",
  "WL",
  "WRLS",
  "WRLP",
  "WRLSP",
  "WSP",
  "WRLS",
  "WRLSP",
  "WRP",
  "WRLSP",
  "LSP",
  // 30 October to 10 November: the 12-day streak
  ...Array.from({ length: 12 }, () => "WRLSP"),
  // Today, 11 November, so far
  "WL",
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

type Day = {
  iso: string
  weekday: number
  long: string
  axis: string
  done: string
}

const DAYS: Day[] = DONE_BY_DAY.map((done, i) => {
  const date = new Date(FIRST_DAY + i * 86_400_000)
  const day = date.getUTCDate()
  const month = date.getUTCMonth()
  const weekday = date.getUTCDay()
  return {
    iso: date.toISOString().slice(0, 10),
    weekday,
    long: `${WEEKDAYS[weekday]}, ${day} ${MONTHS[month]}`,
    axis: `${day} ${MONTHS[month].slice(0, 3)}`,
    done,
  }
})

const PERIODS: Record<Period, { label: string; days: number; button: string }> =
  {
    week: { label: "Your last 7 days", days: 7, button: "Week" },
    month: { label: "Your last 30 days", days: 30, button: "Month" },
  }

const HABIT_COUNT = HABITS.length
const STREAK = 12

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const card = "rounded-xl border border-border bg-card p-6"
const containerClasses = "mx-auto max-w-[1168px] px-4 md:px-6"

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many
}

function summarize(period: Period) {
  const days = DAYS.slice(-PERIODS[period].days)
  const counts = days.map((d) => d.done.length)
  const done = counts.reduce((a, b) => a + b, 0)
  const planned = days.length * HABIT_COUNT

  // Best day: the weekday with the highest total; on a tie the most recent wins.
  const totals = new Map<number, { total: number; last: number }>()
  days.forEach((d, i) => {
    const entry = totals.get(d.weekday) ?? { total: 0, last: 0 }
    totals.set(d.weekday, { total: entry.total + counts[i], last: i })
  })
  let best = -1
  let bestEntry = { total: -1, last: -1 }
  totals.forEach((entry, weekday) => {
    if (
      entry.total > bestEntry.total ||
      (entry.total === bestEntry.total && entry.last > bestEntry.last)
    ) {
      best = weekday
      bestEntry = entry
    }
  })

  const habits = HABITS.map((habit, order) => {
    const count = days.filter((d) => d.done.includes(habit.code)).length
    return {
      ...habit,
      order,
      count,
      percent: Math.round((count / days.length) * 100),
    }
  }).sort((a, b) => b.count - a.count || a.order - b.order)

  return {
    days,
    counts,
    done,
    planned,
    percent: Math.round((done / planned) * 100),
    bestDay: WEEKDAYS[best],
    habits,
  }
}

function Header() {
  const links = [
    { label: "Today", href: "/today" },
    { label: "Progress", href: "/progress", current: true },
    { label: "Plans", href: "/plans" },
    { label: "Profile", href: "/profile" },
  ]
  return (
    <header className="border-b border-border">
      <div
        className={cn(
          containerClasses,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/today"
          className="inline-flex h-11 items-center font-heading text-h2 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
        >
          Mossy
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
                    link.current
                      ? "bg-secondary text-secondary-foreground"
                      : "text-foreground underline-offset-4 hover:underline"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={cn(
          containerClasses,
          "flex flex-wrap items-center justify-between gap-3 py-10"
        )}
      >
        <p className="font-heading text-h2">Mossy</p>
        <p className="font-mono text-label text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

function Chart({
  period,
  days,
  counts,
}: {
  period: Period
  days: Day[]
  counts: number[]
}) {
  const isWeek = period === "week"
  const last = days.length - 1
  const rowGap = isWeek ? "gap-2" : "gap-0.5"

  function labelFor(i: number) {
    if (i === last) return "Today"
    if (isWeek) return WEEKDAYS[days[i].weekday].slice(0, 3)
    return (last - i) % 7 === 0 ? days[i].axis : ""
  }

  return (
    <section
      aria-labelledby="chart-heading"
      className={cn(card, "flex flex-col gap-4")}
    >
      <div className="flex flex-col gap-2">
        <h2 id="chart-heading" className="text-h2">
          Habits done each day
        </h2>
        <p className={smallFigure}>Out of 5 habits</p>
      </div>

      <div aria-hidden="true" className="flex gap-3">
        <div className="relative h-48 w-6 shrink-0">
          <span className={cn(smallFigure, "absolute top-0 right-0")}>
            {HABIT_COUNT}
          </span>
          <span className={cn(smallFigure, "absolute right-0 bottom-0")}>
            0
          </span>
        </div>
        <div className="relative h-48 flex-1">
          <div className="absolute inset-x-0 top-0 border-t border-border" />
          <div className="absolute inset-x-0 bottom-0 border-t border-border" />
          <div className={cn("relative flex h-full items-end", rowGap)}>
            {counts.map((count, i) => (
              <div
                key={days[i].iso}
                className={cn("flex-1", count > 0 && "bg-secondary")}
                style={{ height: `${(count / HABIT_COUNT) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="flex gap-3">
        <div className="w-6 shrink-0" />
        <div className={cn("flex flex-1", rowGap)}>
          {days.map((day, i) => {
            const label = labelFor(i)
            const isToday = i === last
            return (
              <div
                key={day.iso}
                className={cn(
                  "flex min-w-0 flex-1",
                  isToday && !isWeek ? "justify-end" : "justify-center"
                )}
              >
                {label && (
                  <span
                    className={cn(
                      smallFigure,
                      "whitespace-nowrap",
                      isToday && "text-foreground"
                    )}
                  >
                    {label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="sr-only">
        <table>
          <caption>Habits done each day, out of 5</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Habits done</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={day.iso}>
                <th scope="row">
                  <time dateTime={day.iso}>{day.long}</time>
                </th>
                <td>{counts[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function App() {
  const [period, setPeriod] = useState<Period>("week")
  const data = summarize(period)

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />

      <main
        className={cn(containerClasses, "flex flex-col gap-10 pt-10 pb-16")}
      >
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>{PERIODS[period].label}</p>
          <h1 className="text-h1">How it is going</h1>
          <div
            role="group"
            aria-label="Period"
            className="flex flex-wrap gap-2"
          >
            {(Object.keys(PERIODS) as Period[]).map((key) => (
              <Button
                key={key}
                variant={period === key ? "secondary" : "outline"}
                aria-pressed={period === key}
                onClick={() => setPeriod(key)}
                className="h-11 px-6 font-mono text-label"
              >
                {PERIODS[key].button}
              </Button>
            ))}
          </div>
        </div>

        <section aria-label="Key figures">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className={cn(card, "flex flex-col gap-4 md:col-span-4")}>
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Current streak
                </h2>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    {STREAK}
                  </span>
                  <span className={smallFigure}>
                    {plural(STREAK, "day", "days")}
                  </span>
                </p>
              </div>
              <Badge className="h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                <Flame aria-hidden="true" strokeWidth={1.5} />
                Your longest since September
              </Badge>
              <p>Finish today's habits and it becomes {STREAK + 1}.</p>
            </div>

            <div className={cn(card, "flex flex-col gap-4 md:col-span-4")}>
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Habits done
                </h2>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    {data.done}
                  </span>
                  <span className={smallFigure}>of {data.planned}</span>
                </p>
              </div>
              <p>That is {data.percent}% of everything you planned.</p>
            </div>

            <div className={cn(card, "flex flex-col gap-4 md:col-span-4")}>
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Best day
                </h2>
                <p className="font-heading text-h1 tabular-nums">
                  {data.bestDay}
                </p>
              </div>
              <p>You finish the most on {data.bestDay}s.</p>
            </div>
          </div>
        </section>

        <Chart period={period} days={data.days} counts={data.counts} />

        <section
          aria-labelledby="by-habit-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="by-habit-heading" className="text-h2">
            By habit
          </h2>
          <div className={cn(card, "flex flex-col gap-4")}>
            <ul className="flex flex-col gap-4">
              {data.habits.map((habit, i) => (
                <li
                  key={habit.code}
                  className={cn(
                    "flex flex-col gap-2",
                    i > 0 && "border-t border-border pt-4"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-body font-medium">
                        {habit.name}
                      </span>
                      {habit.percent === 100 && (
                        <Badge className="h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          Every day
                        </Badge>
                      )}
                    </div>
                    <p className={smallFigure}>
                      {habit.count} of {data.days.length}{" "}
                      {plural(data.days.length, "day", "days")} ·{" "}
                      {habit.percent}%
                    </p>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-6 w-full overflow-hidden rounded-sm border border-border bg-background"
                  >
                    <div
                      className="h-full bg-secondary"
                      style={{ width: `${habit.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
