import { useState } from "react"
import { Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Period = "week" | "month"

const HABITS = [
  "Drink 8 glasses of water",
  "Read 10 pages",
  "Walk after lunch",
  "Stretch for 5 minutes",
  "No phone after 22:00",
]

// The habits done on each of the last 30 days, 13 October to 11 November
// 2026, by their index in HABITS. Today, 11 November, is the last entry.
const DONE_BY_DAY: number[][] = [
  "02",
  "012",
  "01234",
  "0123",
  "01234",
  "01234",
  "01234",
  "02",
  "0123",
  "0124",
  "01234",
  "034",
  "0123",
  "01234",
  "014",
  "01234",
  "234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "01234",
  "02",
].map((day) => day.split("").map(Number))

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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

const FIRST_DAY = Date.UTC(2026, 9, 13)
const DAY_MS = 24 * 60 * 60 * 1000

type Day = {
  date: Date
  iso: string
  long: string
  weekday: number
  done: number[]
}

const DAYS: Day[] = DONE_BY_DAY.map((done, i) => {
  const date = new Date(FIRST_DAY + i * DAY_MS)
  const weekday = date.getUTCDay()
  return {
    date,
    iso: date.toISOString().slice(0, 10),
    long: `${WEEKDAYS[weekday]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`,
    weekday,
    done,
  }
})

const PERIODS: Record<
  Period,
  { length: number; button: string; line: string }
> = {
  week: { length: 7, button: "Week", line: "Your last 7 days" },
  month: { length: 30, button: "Month", line: "Your last 30 days" },
}

const STREAK: number = 12

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const card = "rounded-xl border border-border bg-card p-6"
const container = "mx-auto max-w-[1168px] px-4 md:px-6"
const goodNewsBadge =
  "h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const NAV = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

function summarize(period: Period) {
  const days = DAYS.slice(-PERIODS[period].length)
  const planned = days.length * HABITS.length
  const done = days.reduce((sum, day) => sum + day.done.length, 0)

  // The weekday with the highest total; where weekdays tie, the most recent wins.
  const totals = new Map<number, number>()
  const lastSeen = new Map<number, number>()
  days.forEach((day, i) => {
    totals.set(day.weekday, (totals.get(day.weekday) ?? 0) + day.done.length)
    lastSeen.set(day.weekday, i)
  })
  let bestDay = days[0].weekday
  for (const [weekday, total] of totals) {
    const best = totals.get(bestDay) ?? 0
    if (
      total > best ||
      (total === best &&
        (lastSeen.get(weekday) ?? 0) > (lastSeen.get(bestDay) ?? 0))
    ) {
      bestDay = weekday
    }
  }

  const habits = HABITS.map((name, index) => {
    const count = days.filter((day) => day.done.includes(index)).length
    return {
      name,
      count,
      share: Math.round((count / days.length) * 100),
      exact: count / days.length,
    }
  }).sort((a, b) => b.exact - a.exact)

  return {
    days,
    planned,
    done,
    share: Math.round((done / planned) * 100),
    bestDay: WEEKDAYS[bestDay],
    habits,
  }
}

function axisLabel(day: Day, index: number, period: Period, last: number) {
  if (index === last) return "Today"
  if (period === "week") return WEEKDAYS[day.weekday].slice(0, 3)
  if ((last - index) % 7 === 0) {
    return `${day.date.getUTCDate()} ${MONTHS[day.date.getUTCMonth()].slice(0, 3)}`
  }
  return ""
}

export function App() {
  const [period, setPeriod] = useState<Period>("week")
  const summary = summarize(period)
  const last = summary.days.length - 1
  const barGap = period === "week" ? "gap-2" : "gap-0.5"

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <a
            href="/today"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focusRing
            )}
          >
            Mossy
          </a>
          <nav aria-label="Main" className="w-full md:w-auto">
            <ul className="flex gap-1">
              {NAV.map((link) => {
                const current = link.href === "/progress"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label",
                        current
                          ? "bg-secondary text-secondary-foreground"
                          : "text-foreground underline-offset-4 hover:underline",
                        focusRing
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

      <main className={cn(container, "flex flex-col gap-10 pt-10 pb-16")}>
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>{PERIODS[period].line}</p>
          <h1 className="text-h1">How it is going</h1>
          <div
            role="group"
            aria-label="Period"
            className="flex flex-wrap gap-2"
          >
            {(Object.keys(PERIODS) as Period[]).map((option) => {
              const chosen = option === period
              return (
                <Button
                  key={option}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setPeriod(option)}
                  className="h-11 px-6 font-mono text-label"
                >
                  {PERIODS[option].button}
                </Button>
              )
            })}
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
                    {STREAK === 1 ? "day" : "days"}
                  </span>
                </p>
              </div>
              <Badge className={goodNewsBadge}>
                <Flame aria-hidden="true" strokeWidth={1.5} />
                Your longest since September
              </Badge>
              <p>Finish today&apos;s habits and it becomes {STREAK + 1}.</p>
            </div>

            <div className={cn(card, "flex flex-col gap-4 md:col-span-4")}>
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Habits done
                </h2>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    {summary.done}
                  </span>
                  <span className={smallFigure}>of {summary.planned}</span>
                </p>
              </div>
              <p>That is {summary.share}% of everything you planned.</p>
            </div>

            <div className={cn(card, "flex flex-col gap-4 md:col-span-4")}>
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Best day
                </h2>
                <p className="font-heading text-h1 tabular-nums">
                  {summary.bestDay}
                </p>
              </div>
              <p>
                {period === "week"
                  ? "All 5 done, as on the five days before it."
                  : `You finish the most on ${summary.bestDay}s.`}
              </p>
            </div>
          </div>
        </section>

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
            <div className={cn("relative h-48 w-6 shrink-0", smallFigure)}>
              <span className="absolute top-0 right-0">5</span>
              <span className="absolute right-0 bottom-0">0</span>
            </div>
            <div className="relative h-48 min-w-0 flex-1">
              <div className="absolute inset-x-0 top-0 border-t border-border" />
              <div className="absolute inset-x-0 bottom-0 border-t border-border" />
              <div className={cn("relative flex h-full items-end", barGap)}>
                {summary.days.map((day) => (
                  <div
                    key={day.iso}
                    className={cn(
                      "min-w-0 flex-1",
                      day.done.length > 0 && "bg-secondary"
                    )}
                    style={{
                      height: `${(day.done.length / HABITS.length) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="flex gap-3">
            <div className="w-6 shrink-0" />
            <div className={cn("flex min-w-0 flex-1", barGap)}>
              {summary.days.map((day, i) => {
                const label = axisLabel(day, i, period, last)
                const isToday = i === last
                return (
                  <div
                    key={day.iso}
                    className={cn(
                      "flex min-w-0 flex-1 whitespace-nowrap",
                      isToday && period === "month"
                        ? "justify-end"
                        : "justify-center",
                      smallFigure,
                      isToday && "text-foreground"
                    )}
                  >
                    {label}
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
                {summary.days.map((day) => (
                  <tr key={day.iso}>
                    <th scope="row">
                      <time dateTime={day.iso}>{day.long}</time>
                    </th>
                    <td>{day.done.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="habits-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="habits-heading" className="text-h2">
            By habit
          </h2>
          <div className={cn(card, "flex flex-col gap-4")}>
            <ul className="flex flex-col gap-4">
              {summary.habits.map((habit, i) => (
                <li
                  key={habit.name}
                  className={cn(
                    "flex flex-col gap-2",
                    i > 0 && "border-t border-border pt-4"
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-sans text-body font-medium">
                        {habit.name}
                      </p>
                      {habit.share === 100 && (
                        <Badge className={goodNewsBadge}>Every day</Badge>
                      )}
                    </div>
                    <p className={smallFigure}>
                      {habit.count} of {summary.days.length}{" "}
                      {summary.days.length === 1 ? "day" : "days"} ·{" "}
                      {habit.share}%
                    </p>
                  </div>
                  <div
                    aria-hidden="true"
                    className="h-6 w-full overflow-hidden rounded-sm border border-border bg-background"
                  >
                    <div
                      className="h-full bg-secondary"
                      style={{ width: `${habit.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-3 py-10"
          )}
        >
          <p className="font-heading text-h2">Mossy</p>
          <p className="font-mono text-label text-muted-foreground">
            Mossy · Made for small, daily steps · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
