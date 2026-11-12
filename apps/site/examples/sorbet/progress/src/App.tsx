import { useState } from "react"
import { Flame } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { bestDay, daysFor, habitStats, type Period } from "@/data"

const CONTAINER = "mx-auto max-w-[1168px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const CARD = "flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
const GOOD_BADGE =
  "h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const NAV = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

const STREAK = 12

function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many
}

function Header() {
  return (
    <header className="border-b border-border">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/today"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground",
            FOCUS
          )}
        >
          Mossy
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-1">
            {NAV.map((item) => {
              const current = item.label === "Progress"
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label",
                      current
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground underline-offset-4 hover:underline",
                      FOCUS
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
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
          CONTAINER,
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

function KeyFigures({ period }: { period: Period }) {
  const days = daysFor(period)
  const done = days.reduce((sum, d) => sum + d.count, 0)
  const planned = days.length * 5
  const share = Math.round((done / planned) * 100)
  const best = bestDay(days)

  return (
    <section aria-label="Key figures">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className={cn(CARD, "md:col-span-4")}>
          <div className="flex flex-col gap-2">
            <h2 className="font-mono text-label text-muted-foreground">
              Current streak
            </h2>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="font-heading text-display tabular-nums">
                {STREAK}
              </span>
              <span className={SMALL_FIGURE}>
                {plural(STREAK, "day", "days")}
              </span>
            </p>
          </div>
          <Badge className={GOOD_BADGE}>
            <Flame aria-hidden="true" strokeWidth={1.5} />
            Your longest since September
          </Badge>
          <p>Finish today's habits and it becomes {STREAK + 1}.</p>
        </div>

        <div className={cn(CARD, "md:col-span-4")}>
          <div className="flex flex-col gap-2">
            <h2 className="font-mono text-label text-muted-foreground">
              Habits done
            </h2>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="font-heading text-display tabular-nums">
                {done}
              </span>
              <span className={SMALL_FIGURE}>of {planned}</span>
            </p>
          </div>
          <p>That is {share}% of everything you planned.</p>
        </div>

        <div className={cn(CARD, "md:col-span-4")}>
          <div className="flex flex-col gap-2">
            <h2 className="font-mono text-label text-muted-foreground">
              Best day
            </h2>
            <p className="font-heading text-h1 tabular-nums">{best}</p>
          </div>
          <p>You finish the most on {best}s.</p>
        </div>
      </div>
    </section>
  )
}

function Chart({ period }: { period: Period }) {
  const days = daysFor(period)
  const week = period === "week"
  const last = days.length - 1

  function label(i: number) {
    if (i === last) return "Today"
    if (week) return days[i].short
    return (last - i) % 7 === 0 ? days[i].axis : ""
  }

  return (
    <section aria-labelledby="chart-heading" className={CARD}>
      <div className="flex flex-col gap-2">
        <h2 id="chart-heading" className="text-h2">
          Habits done each day
        </h2>
        <p className={SMALL_FIGURE}>Out of 5 habits</p>
      </div>

      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className={cn("relative h-48 w-6", SMALL_FIGURE)}>
            <span className="absolute top-0 right-0">5</span>
            <span className="absolute right-0 bottom-0">0</span>
          </div>
          <div className="relative h-48 flex-1">
            <div className="absolute inset-x-0 top-0 border-t border-border" />
            <div className="absolute inset-x-0 bottom-0 border-b border-border" />
            <div
              className={cn(
                "relative flex h-full items-end",
                week ? "gap-2" : "gap-0.5"
              )}
            >
              {days.map((d) => (
                <div key={d.iso} className="flex h-full flex-1 items-end">
                  {d.count > 0 && (
                    <div
                      className="w-full bg-secondary"
                      style={{ height: `${(d.count / 5) * 100}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-6 shrink-0" />
          <div className={cn("flex flex-1", week ? "gap-2" : "gap-0.5")}>
            {days.map((d, i) => (
              <div
                key={d.iso}
                className={cn(
                  "flex min-w-0 flex-1 justify-center whitespace-nowrap",
                  SMALL_FIGURE,
                  i === last && "text-foreground",
                  i === last && !week && "justify-end"
                )}
              >
                {label(i)}
              </div>
            ))}
          </div>
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
            {days.map((d) => (
              <tr key={d.iso}>
                <th scope="row">
                  <time dateTime={d.iso}>{d.long}</time>
                </th>
                <td>{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ByHabit({ period }: { period: Period }) {
  const stats = habitStats(daysFor(period))

  return (
    <section aria-labelledby="habits-heading" className="flex flex-col gap-6">
      <h2 id="habits-heading" className="text-h2">
        By habit
      </h2>
      <div className="rounded-xl border border-border bg-card p-6">
        <ul className="flex flex-col gap-4">
          {stats.map((habit, i) => (
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
                  {habit.percent === 100 && (
                    <Badge className={GOOD_BADGE}>Every day</Badge>
                  )}
                </div>
                <p className={SMALL_FIGURE}>
                  {habit.done} of {habit.total}{" "}
                  {plural(habit.total, "day", "days")} · {habit.percent}%
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
  )
}

export function App() {
  const [period, setPeriod] = useState<Period>("week")

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(CONTAINER, "flex flex-col gap-10 pt-10 pb-16")}>
        <div className="flex flex-col gap-2">
          <p className={SMALL_FIGURE}>
            {period === "week" ? "Your last 7 days" : "Your last 30 days"}
          </p>
          <h1 className="text-h1">How it is going</h1>
          <div
            role="group"
            aria-label="Period"
            className="flex flex-wrap gap-2"
          >
            {(["week", "month"] as const).map((p) => (
              <Button
                key={p}
                aria-pressed={period === p}
                variant={period === p ? "secondary" : "outline"}
                className="h-11 px-6 font-mono text-label"
                onClick={() => setPeriod(p)}
              >
                {p === "week" ? "Week" : "Month"}
              </Button>
            ))}
          </div>
        </div>
        <KeyFigures period={period} />
        <Chart period={period} />
        <ByHabit period={period} />
      </main>
      <Footer />
    </div>
  )
}

export default App
