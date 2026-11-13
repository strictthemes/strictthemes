import { useState } from "react"
import { ArrowRight, Award, CircleCheck, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The sample's today is fixed in code: Sunday, 14 March 2027.
const TODAY = { iso: "2027-03-14", day: 14, month: "March", year: 2027 }

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const CHART_FIGURE = "font-mono text-label tabular-nums text-foreground"
const CARD = "flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
const BUTTON_TEXT = "h-10 px-5 font-sans text-body font-semibold"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  FOCUS
)
const BADGE =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

function plural(count: number, one: string, many: string) {
  return count === 1 ? one : many
}

function formatLength(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

function percent(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100)
}

// ---------- Minutes a day ----------

type WeekId = "this" | "last"

const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAY_LONG = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const WEEKS: Record<
  WeekId,
  { label: string; firstDay: number; minutes: number[] }
> = {
  this: {
    label: "This week",
    firstDay: TODAY.day - 6,
    minutes: [25, 40, 15, 35, 20, 50, 30],
  },
  last: {
    label: "Last week",
    firstDay: TODAY.day - 13,
    minutes: [30, 0, 45, 20, 0, 35, 25],
  },
}

const SCALE_MAX = 60

function MinutesCard() {
  const [week, setWeek] = useState<WeekId>("this")
  const data = WEEKS[week]
  const total = data.minutes.reduce((sum, m) => sum + m, 0)
  const lastDay = data.firstDay + 6
  const period = `${data.firstDay} to ${lastDay} ${TODAY.month}`

  return (
    <section
      aria-labelledby="minutes-heading"
      className={cn(CARD, "lg:col-span-7")}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 id="minutes-heading" className="text-h2">
            Minutes a day
          </h2>
          <p role="status" className={SMALL_FIGURE}>
            {period} · {formatLength(total)} in all
          </p>
        </div>
        <div role="group" aria-label="Week" className="flex flex-wrap gap-2">
          {(Object.keys(WEEKS) as WeekId[]).map((id) => (
            <Button
              key={id}
              variant={week === id ? "secondary" : "outline"}
              aria-pressed={week === id}
              onClick={() => setWeek(id)}
              className={BUTTON_TEXT}
            >
              {WEEKS[id].label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div aria-hidden="true" className="flex gap-3">
          <div className="relative h-48 w-6 shrink-0">
            <span className={cn(SMALL_FIGURE, "absolute top-0 right-0")}>
              60
            </span>
            <span
              className={cn(
                SMALL_FIGURE,
                "absolute top-1/2 right-0 -translate-y-1/2"
              )}
            >
              30
            </span>
            <span className={cn(SMALL_FIGURE, "absolute right-0 bottom-0")}>
              0
            </span>
          </div>
          <div className="relative h-48 min-w-0 flex-1">
            <div className="absolute inset-x-0 top-0 border-t border-border" />
            <div className="absolute inset-x-0 top-1/2 border-t border-border" />
            <div className="absolute inset-x-0 bottom-0 border-t border-border" />
            <div className="absolute inset-0 flex items-end gap-2">
              {data.minutes.map((m, i) => (
                <div
                  key={DAY_SHORT[i]}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <span className={CHART_FIGURE}>{m}</span>
                  {m > 0 && (
                    <div
                      className="w-full max-w-12 shrink-0 bg-azure"
                      style={{
                        height: `${((m / SCALE_MAX) * 100).toFixed(2)}%`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="flex gap-3">
          <div className="w-6 shrink-0" />
          <div className="flex min-w-0 flex-1 gap-2">
            {DAY_SHORT.map((d) => (
              <span
                key={d}
                className={cn(SMALL_FIGURE, "min-w-0 flex-1 text-center")}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="sr-only">
          <table>
            <caption>
              Minutes learned each day, {period} {TODAY.year}
            </caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {data.minutes.map((m, i) => (
                <tr key={DAY_LONG[i]}>
                  <th scope="row">
                    {DAY_LONG[i]} {data.firstDay + i} {TODAY.month}
                  </th>
                  <td>{m} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ---------- Time by topic ----------

const TOPICS = [
  { name: "Spreadsheets", minutes: 270, fill: "bg-azure" },
  { name: "SQL", minutes: 60, fill: "bg-tertiary" },
  { name: "Practice", minutes: 120, fill: "bg-sun" },
  { name: "Charts", minutes: 150, fill: "bg-berry" },
]

function TopicsCard() {
  const total = TOPICS.reduce((sum, t) => sum + t.minutes, 0)

  return (
    <section
      aria-labelledby="topics-heading"
      className={cn(CARD, "lg:col-span-5")}
    >
      <div className="flex flex-col gap-2">
        <h2 id="topics-heading" className="text-h2">
          Time by topic
        </h2>
        <p className={SMALL_FIGURE}>
          {formatLength(total)} in all, since 15 February
        </p>
      </div>

      <div
        aria-hidden="true"
        className="flex h-5 w-full overflow-hidden rounded-sm"
      >
        {TOPICS.map((t) => (
          <div
            key={t.name}
            className={cn("h-full", t.fill)}
            style={{ width: `${percent(t.minutes, total)}%` }}
          />
        ))}
      </div>

      <ul className="flex flex-col">
        {TOPICS.map((t) => (
          <li
            key={t.name}
            className="flex items-center justify-between gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", t.fill)}
              />
              <span className="text-body text-foreground">{t.name}</span>
            </span>
            <span className={CHART_FIGURE}>
              {formatLength(t.minutes)} · {percent(t.minutes, total)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---------- Courses ----------

type Course = {
  title: string
  done: number
  lessons: number
  next?: { text: string; href: string }
  finished?: { iso: string; text: string }
}

const COURSES: Course[] = [
  {
    title: "SQL from zero",
    done: 3,
    lessons: 12,
    next: {
      text: "Continue with lesson 4: Filtering rows with WHERE",
      href: "/lesson",
    },
  },
  {
    title: "Your first charts",
    done: 6,
    lessons: 8,
    next: { text: "Continue with lesson 7", href: "#" },
  },
  {
    title: "Spreadsheets from scratch",
    done: 10,
    lessons: 10,
    finished: { iso: "2027-03-09", text: "9 March 2027" },
  },
]

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-border"
      >
        {value > 0 && (
          <div
            className="h-full rounded-full bg-tertiary"
            style={{ width: `${value}%` }}
          />
        )}
      </div>
      <span
        className={cn(SMALL_FIGURE, "w-10 shrink-0 text-right text-foreground")}
      >
        {value}%
      </span>
    </div>
  )
}

function CoursesCard() {
  return (
    <section
      aria-labelledby="courses-heading"
      className={cn(CARD, "lg:col-span-7")}
    >
      <h2 id="courses-heading" className="text-h2">
        Your courses
      </h2>
      <ul className="flex flex-col">
        {COURSES.map((c) => {
          const value = percent(c.done, c.lessons)
          return (
            <li
              key={c.title}
              className="flex flex-col gap-2 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sans text-body font-semibold">
                    {c.title}
                  </h3>
                  {value === 100 && <Badge className={BADGE}>Completed</Badge>}
                </div>
                <p className={cn(SMALL_FIGURE, "text-foreground")}>
                  {c.done} of {c.lessons}{" "}
                  {plural(c.lessons, "lesson", "lessons")}
                </p>
              </div>
              <ProgressBar value={value} />
              {c.next && (
                <a href={c.next.href} className={cn(TEXT_LINK, "self-start")}>
                  {c.next.text}
                </a>
              )}
              {c.finished && (
                <p className={cn(SMALL_FIGURE, "self-start")}>
                  Finished on{" "}
                  <time dateTime={c.finished.iso}>{c.finished.text}</time>
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ---------- Recent activity ----------

const ACTIVITY: {
  icon: LucideIcon
  text: string
  course: string
  iso: string
  date: string
}[] = [
  {
    icon: CircleCheck,
    text: "Finished lesson 3, Choosing columns",
    course: "SQL from zero",
    iso: "2027-03-14",
    date: "14 March",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 2, Your first SELECT",
    course: "SQL from zero",
    iso: "2027-03-13",
    date: "13 March",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 6, Two lines on one chart",
    course: "Your first charts",
    iso: "2027-03-13",
    date: "13 March",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 1, What a database is",
    course: "SQL from zero",
    iso: "2027-03-12",
    date: "12 March",
  },
  {
    icon: Award,
    text: "Finished the course, all 10 lessons",
    course: "Spreadsheets from scratch",
    iso: "2027-03-09",
    date: "9 March",
  },
]

function ActivityCard() {
  return (
    <section
      aria-labelledby="activity-heading"
      className={cn(CARD, "lg:col-span-5")}
    >
      <h2 id="activity-heading" className="text-h2">
        Recent activity
      </h2>
      <ol className="flex flex-col">
        {ACTIVITY.map((a) => {
          const Icon = a.icon
          return (
            <li
              key={a.text}
              className="flex items-start gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-foreground"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-body">{a.text}</p>
                <p className={SMALL_FIGURE}>
                  {a.course} · <time dateTime={a.iso}>{a.date}</time>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// ---------- Figures ----------

const FIGURES: {
  name: string
  value: number
  unit: string
  text: string
  badge?: string
}[] = [
  {
    name: "Lessons done",
    value: 19,
    unit: "of 30",
    text: "Across the three courses you have started.",
  },
  {
    name: "Time learning",
    value: 10,
    unit: plural(10, "hour", "hours"),
    text: "Since 15 February, in lessons and practice.",
  },
  {
    name: "Days in a row",
    value: 9,
    unit: plural(9, "day", "days"),
    text: "Since 6 March. Learn tomorrow and it becomes 10.",
    badge: "Longest so far",
  },
]

function FiguresSection() {
  return (
    <section aria-label="Figures">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {FIGURES.map((f) => {
          const heading = (
            <h2 className="font-mono text-label text-muted-foreground">
              {f.name}
            </h2>
          )
          return (
            <div key={f.name} className={CARD}>
              <div className="flex flex-col gap-2">
                {f.badge ? (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {heading}
                    <Badge className={BADGE}>{f.badge}</Badge>
                  </div>
                ) : (
                  heading
                )}
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-display tabular-nums">
                    {f.value}
                  </span>
                  <span className={SMALL_FIGURE}>{f.unit}</span>
                </p>
              </div>
              <p className="text-body">{f.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ---------- Page ----------

const NAV = [
  { label: "Courses", href: "/catalogue" },
  { label: "My progress", href: "/progress", current: true },
  { label: "Plans", href: "/plans" },
]

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5"

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            CONTAINER,
            "flex flex-wrap items-center gap-x-8 gap-y-1 py-3"
          )}
        >
          <a
            href="/catalogue"
            className={cn(
              "inline-flex h-10 items-center font-heading text-h2 text-foreground",
              FOCUS
            )}
          >
            Rowlark
          </a>
          <nav aria-label="Main" className="w-full md:w-auto">
            <ul className="flex gap-5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                      item.current ? "underline decoration-2" : "hover:underline",
                      FOCUS
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className={cn(CONTAINER, "flex flex-col gap-8 pt-8 pb-20")}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
              >
                TM
              </div>
              <div className="flex flex-col gap-2">
                <p className={SMALL_FIGURE}>
                  Tessa Marlow · Learning since 15 February 2027
                </p>
                <h1 className="text-h1">Your progress</h1>
              </div>
            </div>
            <a
              href="/lesson"
              className={cn(buttonVariants({ variant: "default" }), BUTTON_TEXT)}
            >
              Continue lesson 4
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          <FiguresSection />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <MinutesCard />
            <TopicsCard />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <CoursesCard />
            <ActivityCard />
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            CONTAINER,
            "flex flex-wrap items-center justify-between gap-3 py-8"
          )}
        >
          <p className="font-heading text-h2">Rowlark</p>
          <p className={SMALL_FIGURE}>
            Rowlark · Practical data skills, one short lesson at a time · 2027
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
