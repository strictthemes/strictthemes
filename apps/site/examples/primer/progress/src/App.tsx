import { useState } from "react"
import { ArrowRight, Award, CircleCheck, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const CHART_FIGURE = "font-mono text-label tabular-nums text-foreground"
const CARD = "flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
const RULED_ROW = "border-border py-3 not-first:border-t first:pt-0 last:pb-0"
const BUTTON_CLASSES = "h-10 px-5 font-sans text-body font-semibold"
const BADGE_CLASSES =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  FOCUS
)

function formatLength(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

function plural(count: number, one: string, many: string) {
  return count === 1 ? one : many
}

function percent(part: number, whole: number) {
  return Math.round((part / whole) * 100)
}

/* ---------- Data ---------- */

const LEARNER = {
  name: "Tessa Marlow",
  initials: "TM",
  since: "15 February 2027",
}

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

type WeekKey = "this" | "last"

const WEEKS: Record<
  WeekKey,
  { label: string; firstDay: number; lastDay: number; minutes: number[] }
> = {
  this: {
    label: "This week",
    firstDay: 8,
    lastDay: 14,
    minutes: [25, 40, 15, 35, 20, 50, 30],
  },
  last: {
    label: "Last week",
    firstDay: 1,
    lastDay: 7,
    minutes: [30, 0, 45, 20, 0, 35, 25],
  },
}

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
  finished?: { text: string; dateTime: string }
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
    finished: { text: "9 March 2027", dateTime: "2027-03-09" },
  },
]

const LESSONS_DONE = COURSES.reduce((sum, course) => sum + course.done, 0)
const LESSONS_TOTAL = COURSES.reduce((sum, course) => sum + course.lessons, 0)
const HOURS_LEARNING = Math.round(TOPIC_TOTAL / 60)
const STREAK_DAYS = 9

const ACTIVITY: {
  icon: LucideIcon
  text: string
  course: string
  date: string
  dateTime: string
}[] = [
  {
    icon: CircleCheck,
    text: "Finished lesson 3, Choosing columns",
    course: "SQL from zero",
    date: "14 March",
    dateTime: "2027-03-14",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 2, Your first SELECT",
    course: "SQL from zero",
    date: "13 March",
    dateTime: "2027-03-13",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 6, Two lines on one chart",
    course: "Your first charts",
    date: "13 March",
    dateTime: "2027-03-13",
  },
  {
    icon: CircleCheck,
    text: "Finished lesson 1, What a database is",
    course: "SQL from zero",
    date: "12 March",
    dateTime: "2027-03-12",
  },
  {
    icon: Award,
    text: "Finished the course, all 10 lessons",
    course: "Spreadsheets from scratch",
    date: "9 March",
    dateTime: "2027-03-09",
  },
]

/* ---------- Parts ---------- */

function SiteHeader() {
  const links = [
    { label: "Courses", href: "/catalogue" },
    { label: "My progress", href: "/progress", current: true },
    { label: "Plans", href: "/plans" },
  ]
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-3">
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
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                    link.current ? "underline decoration-2" : "hover:underline",
                    FOCUS
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

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-8">
        <p className="font-heading text-h2">Rowlark</p>
        <p className={SMALL}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
        >
          {LEARNER.initials}
        </div>
        <div className="flex flex-col gap-2">
          <p className={SMALL}>
            {LEARNER.name} · Learning since {LEARNER.since}
          </p>
          <h1 className="text-h1">Your progress</h1>
        </div>
      </div>
      <a
        href="/lesson"
        className={cn(buttonVariants({ variant: "default" }), BUTTON_CLASSES)}
      >
        Continue lesson 4
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  )
}

function FigureCard({
  name,
  figure,
  unit,
  sentence,
  badge,
}: {
  name: string
  figure: number
  unit: string
  sentence: string
  badge?: string
}) {
  const heading = (
    <h2 className="font-mono text-label text-muted-foreground">{name}</h2>
  )
  return (
    <div className={CARD}>
      <div className="flex flex-col gap-2">
        {badge ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {heading}
            <Badge className={BADGE_CLASSES}>{badge}</Badge>
          </div>
        ) : (
          heading
        )}
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-display tabular-nums">
            {figure}
          </span>
          <span className={SMALL}>{unit}</span>
        </p>
      </div>
      <p className="text-body">{sentence}</p>
    </div>
  )
}

function Figures() {
  return (
    <section
      aria-label="Figures"
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      <FigureCard
        name="Lessons done"
        figure={LESSONS_DONE}
        unit={`of ${LESSONS_TOTAL}`}
        sentence="Across the three courses you have started."
      />
      <FigureCard
        name="Time learning"
        figure={HOURS_LEARNING}
        unit={plural(HOURS_LEARNING, "hour", "hours")}
        sentence="Since 15 February, in lessons and practice."
      />
      <FigureCard
        name="Days in a row"
        figure={STREAK_DAYS}
        unit={plural(STREAK_DAYS, "day", "days")}
        sentence={`Since 6 March. Learn tomorrow and it becomes ${STREAK_DAYS + 1}.`}
        badge="Longest so far"
      />
    </section>
  )
}

function MinutesChart() {
  const [weekKey, setWeekKey] = useState<WeekKey>("this")
  const week = WEEKS[weekKey]
  const total = week.minutes.reduce((sum, m) => sum + m, 0)
  const period = `${week.firstDay} to ${week.lastDay} March`

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
          <p role="status" className={SMALL}>
            {period} · {formatLength(total)} in all
          </p>
        </div>
        <div role="group" aria-label="Week" className="flex flex-wrap gap-2">
          {(Object.keys(WEEKS) as WeekKey[]).map((key) => {
            const pressed = key === weekKey
            return (
              <Button
                key={key}
                variant={pressed ? "secondary" : "outline"}
                aria-pressed={pressed}
                className={BUTTON_CLASSES}
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
            <span className={cn(SMALL, "absolute top-0 right-0")}>
              {SCALE_MAX}
            </span>
            <span
              className={cn(SMALL, "absolute top-1/2 right-0 -translate-y-1/2")}
            >
              {SCALE_MAX / 2}
            </span>
            <span className={cn(SMALL, "absolute right-0 bottom-0")}>0</span>
          </div>
          <div className="relative h-48 min-w-0 flex-1">
            <div className="absolute inset-x-0 top-0 border-t border-border" />
            <div className="absolute inset-x-0 top-1/2 border-t border-border" />
            <div className="absolute inset-x-0 bottom-0 border-t border-border" />
            <div className="absolute inset-0 flex items-end gap-2">
              {week.minutes.map((minutes, i) => (
                <div
                  key={DAY_SHORT[i]}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <span className={CHART_FIGURE}>{minutes}</span>
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
                className={cn(SMALL, "min-w-0 flex-1 text-center")}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <div className="sr-only">
          <table>
            <caption>Minutes learned each day, {period} 2027</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {week.minutes.map((minutes, i) => (
                <tr key={DAY_LONG[i]}>
                  <th scope="row">
                    {DAY_LONG[i]} {week.firstDay + i} March
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
  return (
    <section
      aria-labelledby="topic-heading"
      className={cn(CARD, "lg:col-span-5")}
    >
      <div className="flex flex-col gap-2">
        <h2 id="topic-heading" className="text-h2">
          Time by topic
        </h2>
        <p className={SMALL}>
          {formatLength(TOPIC_TOTAL)} in all, since 15 February
        </p>
      </div>
      <div
        aria-hidden="true"
        className="flex h-5 w-full overflow-hidden rounded-sm"
      >
        {TOPICS.map((topic) => (
          <div
            key={topic.name}
            className={cn("h-full", topic.fill)}
            style={{ width: `${(topic.minutes / TOPIC_TOTAL) * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col">
        {TOPICS.map((topic) => (
          <li
            key={topic.name}
            className={cn(RULED_ROW, "flex items-center justify-between gap-3")}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", topic.fill)}
              />
              <span className="text-body text-foreground">{topic.name}</span>
            </span>
            <span className={CHART_FIGURE}>
              {formatLength(topic.minutes)} ·{" "}
              {percent(topic.minutes, TOPIC_TOTAL)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

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
        className={cn(SMALL, "text-foreground", "w-10 shrink-0 text-right")}
      >
        {value}%
      </span>
    </div>
  )
}

function YourCourses() {
  return (
    <section
      aria-labelledby="courses-heading"
      className={cn(CARD, "lg:col-span-7")}
    >
      <h2 id="courses-heading" className="text-h2">
        Your courses
      </h2>
      <ul className="flex flex-col">
        {COURSES.map((course) => {
          const value = percent(course.done, course.lessons)
          return (
            <li
              key={course.title}
              className={cn(RULED_ROW, "flex flex-col gap-2")}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sans text-body font-semibold">
                    {course.title}
                  </h3>
                  {value === 100 && (
                    <Badge className={BADGE_CLASSES}>Completed</Badge>
                  )}
                </div>
                <p className={cn(SMALL, "text-foreground")}>
                  {course.done} of {course.lessons}{" "}
                  {plural(course.lessons, "lesson", "lessons")}
                </p>
              </div>
              <ProgressBar value={value} />
              {course.next && (
                <a
                  href={course.next.href}
                  className={cn(TEXT_LINK, "self-start")}
                >
                  {course.next.text}
                </a>
              )}
              {course.finished && (
                <p className={cn(SMALL, "self-start")}>
                  Finished on{" "}
                  <time dateTime={course.finished.dateTime}>
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

function RecentActivity() {
  return (
    <section
      aria-labelledby="activity-heading"
      className={cn(CARD, "lg:col-span-5")}
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
              className={cn(RULED_ROW, "flex items-start gap-3")}
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-foreground"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-body">{item.text}</p>
                <p className={SMALL}>
                  {item.course} ·{" "}
                  <time dateTime={item.dateTime}>{item.date}</time>
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
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          <PageHeader />
          <Figures />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <MinutesChart />
            <TopicChart />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <YourCourses />
            <RecentActivity />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
