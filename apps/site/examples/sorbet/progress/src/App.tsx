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

// Which habits (by index in HABITS) were done on each day, from 13 October
// to 11 November 2026, today last.
const DONE_BY_DAY = (
  "02 012 01234 0123 01234 01234 01234 02 0123 0124 01234 034 0123 01234 " +
  "014 01234 234 01234 01234 01234 01234 01234 01234 01234 01234 01234 " +
  "01234 01234 01234 02"
)
  .split(" ")
  .map((day) => day.split("").map(Number))

const FIRST_DAY = Date.UTC(2026, 9, 13)
const DAY_MS = 24 * 60 * 60 * 1000

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

type Day = {
  date: Date
  iso: string
  done: number[]
}

const ALL_DAYS: Day[] = DONE_BY_DAY.map((done, i) => {
  const date = new Date(FIRST_DAY + i * DAY_MS)
  return { date, iso: date.toISOString().slice(0, 10), done }
})

const PERIODS = {
  week: {
    days: 7,
    smallFigure: "Your last 7 days",
    habitsSentence: (percent: number) =>
      `That is ${percent}% of everything you planned.`,
    bestDaySentence: "All 5 done, as on the five days before it.",
  },
  month: {
    days: 30,
    smallFigure: "Your last 30 days",
    habitsSentence: (percent: number) =>
      `That is ${percent}% of everything you planned.`,
    bestDaySentence: "You finish the most on Mondays.",
  },
} as const

const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const GOOD_NEWS_BADGE =
  "h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const NAV_LINKS = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

function longDate(date: Date) {
  return `${WEEKDAYS[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
}

function shortDate(date: Date) {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0, 3)}`
}

function bestWeekday(days: Day[]) {
  const totals = new Map<number, { total: number; last: number }>()
  days.forEach((day, i) => {
    const weekday = day.date.getUTCDay()
    const entry = totals.get(weekday) ?? { total: 0, last: 0 }
    totals.set(weekday, { total: entry.total + day.done.length, last: i })
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
  return WEEKDAYS[best]
}

export function App() {
  const [period, setPeriod] = useState<Period>("week")
  const settings = PERIODS[period]
  const days = ALL_DAYS.slice(-settings.days)
  const total = days.reduce((sum, day) => sum + day.done.length, 0)
  const planned = days.length * HABITS.length
  const totalPercent = Math.round((total / planned) * 100)

  const habits = HABITS.map((name, index) => {
    const count = days.filter((day) => day.done.includes(index)).length
    return { name, index, count, share: count / days.length }
  }).sort((a, b) => b.share - a.share || a.index - b.index)

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1168px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
          <a
            href="/today"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
              FOCUS
            )}
          >
            Mossy
          </a>
          <nav aria-label="Main" className="w-full md:w-auto">
            <ul className="flex gap-1">
              {NAV_LINKS.map((link) => {
                const current = link.href === "/progress"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label transition-colors duration-150",
                        FOCUS,
                        current
                          ? "bg-secondary text-secondary-foreground"
                          : "text-foreground underline-offset-4 hover:underline"
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

      <main className="mx-auto flex max-w-[1168px] flex-col gap-10 px-4 pt-10 pb-16 md:px-6">
        <div className="flex flex-col gap-2">
          <p className={SMALL_FIGURE}>{settings.smallFigure}</p>
          <h1 className="text-h1">How it is going</h1>
          <div
            role="group"
            aria-label="Period"
            className="flex flex-wrap gap-2"
          >
            {(["week", "month"] as const).map((value) => {
              const chosen = period === value
              return (
                <Button
                  key={value}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setPeriod(value)}
                  className="h-11 px-6 font-mono text-label"
                >
                  {value === "week" ? "Week" : "Month"}
                </Button>
              )
            })}
          </div>
        </div>

        <section aria-label="Key figures">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Current streak
                </h2>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    12
                  </span>
                  <span className={SMALL_FIGURE}>days</span>
                </p>
              </div>
              <Badge className={GOOD_NEWS_BADGE}>
                <Flame aria-hidden="true" strokeWidth={1.5} />
                Your longest since September
              </Badge>
              <p className="max-w-lg">
                Finish today&apos;s habits and it becomes 13.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Habits done
                </h2>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    {total}
                  </span>
                  <span className={SMALL_FIGURE}>of {planned}</span>
                </p>
              </div>
              <p className="max-w-lg">
                {settings.habitsSentence(totalPercent)}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-mono text-label text-muted-foreground">
                  Best day
                </h2>
                <p className="font-heading text-h1">{bestWeekday(days)}</p>
              </div>
              <p className="max-w-lg">{settings.bestDaySentence}</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="chart-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-2">
            <h2 id="chart-heading" className="text-h2">
              Habits done each day
            </h2>
            <p className={SMALL_FIGURE}>Out of 5 habits</p>
          </div>

          <div aria-hidden="true" className="flex gap-3">
            <div className={cn("relative h-48 w-6 shrink-0", SMALL_FIGURE)}>
              <span className="absolute top-0 right-0">5</span>
              <span className="absolute right-0 bottom-0">0</span>
            </div>
            <div className="relative h-48 min-w-0 flex-1">
              <div className="absolute inset-x-0 top-0 border-t border-border" />
              <div className="absolute inset-x-0 bottom-0 border-t border-border" />
              <div
                className={cn(
                  "relative flex h-full items-end",
                  period === "week" ? "gap-2" : "gap-0.5"
                )}
              >
                {days.map((day) => (
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
            <div
              className={cn(
                "flex min-w-0 flex-1",
                period === "week" ? "gap-2" : "gap-0.5"
              )}
            >
              {days.map((day, i) => {
                const isToday = i === days.length - 1
                const fromEnd = days.length - 1 - i
                let label = ""
                if (isToday) label = "Today"
                else if (period === "week")
                  label = WEEKDAYS[day.date.getUTCDay()].slice(0, 3)
                else if (fromEnd % 7 === 0) label = shortDate(day.date)
                return (
                  <div
                    key={day.iso}
                    className={cn(
                      "flex min-w-0 flex-1 justify-center whitespace-nowrap",
                      SMALL_FIGURE,
                      isToday && "text-foreground",
                      isToday && period === "month" && "justify-end"
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
                {days.map((day) => (
                  <tr key={day.iso}>
                    <th scope="row">
                      <time dateTime={day.iso}>{longDate(day.date)}</time>
                    </th>
                    <td>{day.done.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="by-habit-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="by-habit-heading" className="text-h2">
            By habit
          </h2>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <ul className="flex flex-col gap-4">
              {habits.map((habit, i) => {
                const percent = Math.round(habit.share * 100)
                return (
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
                        {habit.count === days.length && (
                          <Badge className={GOOD_NEWS_BADGE}>Every day</Badge>
                        )}
                      </div>
                      <p className={SMALL_FIGURE}>
                        {habit.count} of {days.length}{" "}
                        {days.length === 1 ? "day" : "days"} · {percent}%
                      </p>
                    </div>
                    <div
                      aria-hidden="true"
                      className="h-6 w-full overflow-hidden rounded-sm border border-border bg-background"
                    >
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1168px] flex-wrap items-center justify-between gap-3 px-4 py-10 md:px-6">
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
