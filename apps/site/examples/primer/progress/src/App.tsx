import { useState } from "react"
import { ArrowRight, Award, CircleCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const chartFigure = "font-mono text-label tabular-nums text-foreground"
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusRing
)
const buttonClasses = "h-10 px-5 font-sans text-body font-semibold"
const badgeClasses =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

// The sample's today: Sunday, 14 March 2027.
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
const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date
}

function dayMonth(date: Date) {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
}

type WeekKey = "this" | "last"

const WEEKS: Record<
  WeekKey,
  { label: string; monday: string; minutes: number[] }
> = {
  this: {
    label: "This week",
    monday: "2027-03-08",
    minutes: [25, 40, 15, 35, 20, 50, 30],
  },
  last: {
    label: "Last week",
    monday: "2027-03-01",
    minutes: [30, 0, 45, 20, 0, 35, 25],
  },
}
const WEEK_ORDER: WeekKey[] = ["this", "last"]
const SCALE_MAX = 60

const TOPICS = [
  { name: "Spreadsheets", minutes: 270, fill: "bg-azure" },
  { name: "SQL", minutes: 60, fill: "bg-tertiary" },
  { name: "Practice", minutes: 120, fill: "bg-sun" },
  { name: "Charts", minutes: 150, fill: "bg-berry" },
]
const TOPIC_TOTAL = TOPICS.reduce((sum, topic) => sum + topic.minutes, 0)

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

const LESSONS_DONE = COURSES.reduce((sum, course) => sum + course.done, 0)
const LESSONS_STARTED = COURSES.reduce((sum, course) => sum + course.lessons, 0)
const HOURS_LEARNING = Math.round(TOPIC_TOTAL / 60)
const STREAK_DAYS = 9

function Header() {
  const links = [
    { label: "Courses", href: "/catalogue", current: false },
    { label: "My progress", href: "/progress", current: true },
    { label: "Plans", href: "/plans", current: false },
  ]
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/catalogue"
          className={cn(
            "inline-flex h-10 items-center font-heading text-h2 text-foreground",
            focusRing
          )}
        >
          Rowlark
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                    link.current ? "underline decoration-2" : "hover:underline",
                    focusRing
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
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-8">
        <p className="font-heading text-h2">Rowlark</p>
        <p className={smallFigure}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

function KeyFigure({ value, unit }: { value: number; unit: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-2">
      <span className="font-heading text-display tabular-nums">{value}</span>
      <span className={smallFigure}>{unit}</span>
    </p>
  )
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-border"
      >
        {percent > 0 && (
          <div
            className="h-full rounded-full bg-tertiary"
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
      <span
        className={cn(
          smallFigure,
          "text-foreground",
          "w-10 shrink-0 text-right"
        )}
      >
        {percent}%
      </span>
    </div>
  )
}

function MinutesChart() {
  const [weekKey, setWeekKey] = useState<WeekKey>("this")
  const week = WEEKS[weekKey]
  const total = week.minutes.reduce((sum, minutes) => sum + minutes, 0)
  const monday = addDays(week.monday, 0)
  const sunday = addDays(week.monday, 6)
  const range = `${monday.getUTCDate()} to ${dayMonth(sunday)}`

  return (
    <section
      aria-labelledby="minutes-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 id="minutes-heading" className="text-h2">
            Minutes a day
          </h2>
          <p role="status" className={smallFigure}>
            {range} · {formatLength(total)} in all
          </p>
        </div>
        <div role="group" aria-label="Week" className="flex flex-wrap gap-2">
          {WEEK_ORDER.map((key) => {
            const chosen = key === weekKey
            return (
              <Button
                key={key}
                variant={chosen ? "secondary" : "outline"}
                aria-pressed={chosen ? "true" : "false"}
                className={buttonClasses}
                onClick={() => setWeekKey(key)}
              >
                {WEEKS[key].label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div aria-hidden="true" className="flex gap-3">
          <div className="relative h-48 w-6 shrink-0">
            <span className={cn(smallFigure, "absolute top-0 right-0")}>
              {SCALE_MAX}
            </span>
            <span
              className={cn(
                smallFigure,
                "absolute top-1/2 right-0 -translate-y-1/2"
              )}
            >
              {SCALE_MAX / 2}
            </span>
            <span className={cn(smallFigure, "absolute right-0 bottom-0")}>
              0
            </span>
          </div>
          <div className="relative h-48 min-w-0 flex-1">
            <div className="absolute inset-x-0 top-0 border-t border-border" />
            <div className="absolute inset-x-0 top-1/2 border-t border-border" />
            <div className="absolute inset-x-0 bottom-0 border-t border-border" />
            <div className="absolute inset-0 flex items-end gap-2">
              {week.minutes.map((minutes, index) => (
                <div
                  key={DAY_SHORT[index]}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <span className={chartFigure}>{minutes}</span>
                  {minutes > 0 && (
                    <div
                      className="w-full max-w-12 shrink-0 bg-azure"
                      style={{
                        height: `${((minutes / SCALE_MAX) * 100).toFixed(2)}%`,
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
            {DAY_SHORT.map((day) => (
              <span
                key={day}
                className={cn(smallFigure, "min-w-0 flex-1 text-center")}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <div className="sr-only">
          <table>
            <caption>
              Minutes learned each day, {range} {sunday.getUTCFullYear()}
            </caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {week.minutes.map((minutes, index) => (
                <tr key={DAY_NAMES[index]}>
                  <th scope="row">
                    {DAY_NAMES[index]} {dayMonth(addDays(week.monday, index))}
                  </th>
                  <td>{minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function TopicChart() {
  const topics = TOPICS.map((topic) => ({
    ...topic,
    share: Math.round((topic.minutes / TOPIC_TOTAL) * 100),
    width: (topic.minutes / TOPIC_TOTAL) * 100,
  }))
  return (
    <section
      aria-labelledby="topic-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-5"
    >
      <div className="flex flex-col gap-2">
        <h2 id="topic-heading" className="text-h2">
          Time by topic
        </h2>
        <p className={smallFigure}>
          {formatLength(TOPIC_TOTAL)} in all, since{" "}
          <time dateTime="2027-02-15">15 February</time>
        </p>
      </div>
      <div
        aria-hidden="true"
        className="flex h-5 w-full overflow-hidden rounded-sm"
      >
        {topics.map((topic) => (
          <div
            key={topic.name}
            className={cn("h-full", topic.fill)}
            style={{ width: `${topic.width}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col">
        {topics.map((topic) => (
          <li
            key={topic.name}
            className="flex items-center justify-between gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", topic.fill)}
              />
              <span className="text-body text-foreground">{topic.name}</span>
            </span>
            <span className={chartFigure}>
              {formatLength(topic.minutes)} · {topic.share}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CoursesCard() {
  return (
    <section
      aria-labelledby="courses-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-7"
    >
      <h2 id="courses-heading" className="text-h2">
        Your courses
      </h2>
      <ul className="flex flex-col">
        {COURSES.map((course) => {
          const percent = Math.round((course.done / course.lessons) * 100)
          return (
            <li
              key={course.title}
              className="flex flex-col gap-2 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sans text-body font-semibold">
                    {course.title}
                  </h3>
                  {percent === 100 && (
                    <Badge className={badgeClasses}>Completed</Badge>
                  )}
                </div>
                <span className={cn(smallFigure, "text-foreground")}>
                  {course.done} of {course.lessons}{" "}
                  {plural(course.lessons, "lesson", "lessons")}
                </span>
              </div>
              <ProgressBar percent={percent} />
              {course.next && (
                <a
                  href={course.next.href}
                  className={cn("self-start", textLink)}
                >
                  {course.next.text}
                </a>
              )}
              {course.finished && (
                <p className={cn("self-start", smallFigure)}>
                  Finished on{" "}
                  <time dateTime={course.finished.iso}>
                    {course.finished.text}
                  </time>
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ActivityCard() {
  return (
    <section
      aria-labelledby="activity-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-5"
    >
      <h2 id="activity-heading" className="text-h2">
        Recent activity
      </h2>
      <ol className="flex flex-col">
        {ACTIVITY.map((item) => {
          const Icon = item.icon
          return (
            <li
              key={item.text}
              className="flex items-start gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-foreground"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-body">{item.text}</p>
                <p className={smallFigure}>
                  {item.course} · <time dateTime={item.iso}>{item.date}</time>
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
              >
                TM
              </div>
              <div className="flex flex-col gap-2">
                <p className={smallFigure}>
                  Tessa Marlow · Learning since 15 February 2027
                </p>
                <h1 className="text-h1">Your progress</h1>
              </div>
            </div>
            <a
              href="/lesson"
              className={cn(
                buttonVariants({ variant: "default" }),
                buttonClasses
              )}
            >
              Continue lesson 4
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <section aria-label="Figures">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-2">
                  <h2 className="font-mono text-label text-muted-foreground">
                    Lessons done
                  </h2>
                  <KeyFigure
                    value={LESSONS_DONE}
                    unit={`of ${LESSONS_STARTED}`}
                  />
                </div>
                <p className="text-body">
                  Across the three courses you have started.
                </p>
              </div>
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-2">
                  <h2 className="font-mono text-label text-muted-foreground">
                    Time learning
                  </h2>
                  <KeyFigure
                    value={HOURS_LEARNING}
                    unit={plural(HOURS_LEARNING, "hour", "hours")}
                  />
                </div>
                <p className="text-body">
                  Since 15 February, in lessons and practice.
                </p>
              </div>
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-mono text-label text-muted-foreground">
                      Days in a row
                    </h2>
                    <Badge className={badgeClasses}>Longest so far</Badge>
                  </div>
                  <KeyFigure
                    value={STREAK_DAYS}
                    unit={plural(STREAK_DAYS, "day", "days")}
                  />
                </div>
                <p className="text-body">
                  Since 6 March. Learn tomorrow and it becomes {STREAK_DAYS + 1}
                  .
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <MinutesChart />
            <TopicChart />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <CoursesCard />
            <ActivityCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
