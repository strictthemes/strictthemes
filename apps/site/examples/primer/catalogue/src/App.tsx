import { useId, useRef, useState } from "react"
import { Bookmark, BookOpen, Clock, ListChecks } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Topic = "Spreadsheets" | "SQL" | "Charts"
type Level = "Beginner" | "Intermediate" | "Advanced"
type LevelFilter = "All levels" | Level

type Course = {
  title: string
  topic: Topic
  level: Level
  lessons: number
  minutes: number
  teacher: string
  summary: string
  href: string
}

const COURSES: Course[] = [
  {
    title: "Spreadsheets from scratch",
    topic: "Spreadsheets",
    level: "Beginner",
    lessons: 10,
    minutes: 150,
    teacher: "Samir Okonjo",
    summary:
      "Cells, formulas and tidy tables, for people who have never opened a spreadsheet.",
    href: "#",
  },
  {
    title: "SQL from zero",
    topic: "SQL",
    level: "Beginner",
    lessons: 12,
    minutes: 190,
    teacher: "Odile Brandt",
    summary:
      "Ask a database your first questions with SELECT, WHERE and ORDER BY.",
    href: "#",
  },
  {
    title: "Your first charts",
    topic: "Charts",
    level: "Beginner",
    lessons: 8,
    minutes: 110,
    teacher: "Lena Farrow",
    summary:
      "Turn a small table into a bar chart and a line chart that people can read.",
    href: "#",
  },
  {
    title: "Cleaning messy data",
    topic: "Spreadsheets",
    level: "Beginner",
    lessons: 9,
    minutes: 135,
    teacher: "Samir Okonjo",
    summary:
      "Fix dates, doubles and stray spaces before they spoil your sums.",
    href: "#",
  },
  {
    title: "Pivot tables in practice",
    topic: "Spreadsheets",
    level: "Intermediate",
    lessons: 11,
    minutes: 185,
    teacher: "Samir Okonjo",
    summary:
      "Sum up ten thousand rows in a minute, and know what the summary hides.",
    href: "#",
  },
  {
    title: "Joins and grouping in SQL",
    topic: "SQL",
    level: "Intermediate",
    lessons: 14,
    minutes: 245,
    teacher: "Odile Brandt",
    summary: "Bring two tables together, then count, sum and average by group.",
    href: "#",
  },
  {
    title: "Charts that tell the truth",
    topic: "Charts",
    level: "Intermediate",
    lessons: 10,
    minutes: 160,
    teacher: "Lena Farrow",
    summary: "Axes, scales and colors that show the numbers as they are.",
    href: "/course",
  },
  {
    title: "Window functions step by step",
    topic: "SQL",
    level: "Advanced",
    lessons: 13,
    minutes: 230,
    teacher: "Odile Brandt",
    summary: "Running totals, ranks and moving averages without leaving SQL.",
    href: "#",
  },
  {
    title: "Dashboards people read",
    topic: "Charts",
    level: "Advanced",
    lessons: 15,
    minutes: 270,
    teacher: "Lena Farrow",
    summary:
      "Plan, lay out and test one page of charts for a team that is short of time.",
    href: "#",
  },
]

const LEVELS: LevelFilter[] = ["All levels", "Beginner", "Intermediate", "Advanced"]

const TOPIC_FILL: Record<Topic, string> = {
  Spreadsheets: "bg-azure",
  SQL: "bg-tertiary",
  Charts: "bg-berry",
}

const OPENING_FIGURES = [
  { value: "9", unit: "courses", rule: "border-azure" },
  { value: "102", unit: "lessons", rule: "border-tertiary" },
  { value: "3", unit: "topics", rule: "border-sun" },
  { value: "3", unit: "teachers", rule: "border-berry" },
]

const STEPS = [
  {
    icon: BookOpen,
    title: "Read for a quarter of an hour",
    text: "A lesson takes 12 to 19 minutes. It explains one idea and shows it once.",
  },
  {
    icon: ListChecks,
    title: "Answer one question",
    text: "Each lesson ends with a question with four answers. You are told in words whether you were right, and why.",
  },
  {
    icon: Bookmark,
    title: "Pick up where you stopped",
    text: "Rowlark keeps your place, your lessons done and your days in a row.",
  },
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const NAV_LINK = cn(
  "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
  FOCUS
)

function formatLength(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function matches(course: Course, query: string, level: LevelFilter) {
  const q = query.trim().toLowerCase()
  const byText =
    q === "" ||
    [course.title, course.topic, course.teacher].some((field) =>
      field.toLowerCase().includes(q)
    )
  const byLevel = level === "All levels" || course.level === level
  return byText && byLevel
}

function Header() {
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
            <li>
              <a
                href="/catalogue"
                aria-current="page"
                className={cn(NAV_LINK, "underline decoration-2")}
              >
                Courses
              </a>
            </li>
            <li>
              <a href="/progress" className={cn(NAV_LINK, "hover:underline")}>
                My progress
              </a>
            </li>
            <li>
              <a href="/plans" className={cn(NAV_LINK, "hover:underline")}>
                Plans
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Opening() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1 md:max-w-3xl md:text-display">
          Data skills you will use on Monday
        </h1>
        <p className="max-w-2xl">
          Nine courses in spreadsheets, SQL and charts. Every lesson is short,
          ends with one question, and starts where the last one stopped.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-5 md:max-w-2xl md:grid-cols-4">
        {OPENING_FIGURES.map((figure) => (
          <li
            key={figure.unit}
            className={cn("flex flex-col gap-1 border-l-2 pl-3", figure.rule)}
          >
            <span className="font-heading text-h1 tabular-nums text-foreground">
              {figure.value}
            </span>
            <span className={SMALL_FIGURE}>{figure.unit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const footFigure = cn(
    SMALL_FIGURE,
    "text-foreground inline-flex items-center gap-2"
  )
  return (
    <li className="flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn("size-2 shrink-0 rounded-full", TOPIC_FILL[course.topic])}
          />
          {course.topic}
        </span>
        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
          {course.level}
        </Badge>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-h2">
          <a
            href={course.href}
            className={cn(
              "text-foreground underline-offset-4 hover:underline",
              FOCUS
            )}
          >
            {course.title}
          </a>
        </h3>
        <p className="text-body">{course.summary}</p>
        <p className={SMALL_FIGURE}>With {course.teacher}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3">
        <span className={footFigure}>
          <BookOpen className="size-4" aria-hidden="true" />
          {plural(course.lessons, "lesson", "lessons")}
        </span>
        <span className={footFigure}>
          <Clock className="size-4" aria-hidden="true" />
          {formatLength(course.minutes)}
        </span>
      </div>
    </li>
  )
}

function AllCourses() {
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<LevelFilter>("All levels")
  const searchRef = useRef<HTMLInputElement>(null)
  const ids = useId()
  const searchId = `${ids}-search`
  const helperId = `${ids}-search-help`
  const levelLabelId = `${ids}-level`

  const shown = COURSES.filter((course) => matches(course, query, level))
  const total = COURSES.length
  const count =
    shown.length === 0
      ? "No courses match"
      : shown.length === total
        ? `Showing all ${total} courses`
        : `Showing ${shown.length} of ${total} courses`

  function clearAll() {
    setQuery("")
    setLevel("All levels")
    searchRef.current?.focus()
  }

  return (
    <section aria-labelledby="all-courses" className="flex flex-col gap-5">
      <h2 id="all-courses" className="text-h2">
        All courses
      </h2>

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col gap-2 md:max-w-sm">
          <label
            htmlFor={searchId}
            className="block font-mono text-label text-muted-foreground"
          >
            Search courses
          </label>
          <Input
            ref={searchRef}
            id={searchId}
            type="search"
            autoComplete="off"
            aria-describedby={helperId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 px-3 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
          />
          <p id={helperId} className={SMALL_FIGURE}>
            By title, topic or teacher
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p
            id={levelLabelId}
            className="font-mono text-label text-muted-foreground"
          >
            Level
          </p>
          <div
            role="group"
            aria-labelledby={levelLabelId}
            className="flex flex-wrap gap-2"
          >
            {LEVELS.map((option) => {
              const chosen = option === level
              return (
                <Button
                  key={option}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setLevel(option)}
                  className="h-10 px-5 font-sans text-body font-semibold"
                >
                  {option}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <p role="status" className={cn(SMALL_FIGURE, "text-foreground")}>
        {count}
      </p>

      {shown.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-body font-semibold">
            No courses match your search
          </p>
          <p className="text-body">Try a shorter word, or another level.</p>
          <Button
            variant="secondary"
            onClick={clearAll}
            className="h-10 px-5 font-sans text-body font-semibold"
          >
            Clear search and level
          </Button>
        </div>
      )}
    </section>
  )
}

function HowALessonWorks() {
  return (
    <section aria-labelledby="how-a-lesson-works" className="flex flex-col gap-5">
      <h2 id="how-a-lesson-works" className="text-h2">
        How a lesson works
      </h2>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <li key={step.title} className="flex flex-col gap-2">
              <Icon className="size-5 text-foreground" aria-hidden="true" />
              <h3 className="text-h2">{step.title}</h3>
              <p className="text-body">{step.text}</p>
            </li>
          )
        })}
      </ul>
      <p className="max-w-2xl text-body">
        The first module of every course is free.{" "}
        <a
          href="/plans"
          className={cn(
            "text-foreground underline underline-offset-4 hover:decoration-2",
            FOCUS
          )}
        >
          See the plans
        </a>
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-8">
        <p className="font-heading text-h2">Rowlark</p>
        <p className={SMALL_FIGURE}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-20 px-5 pt-8 pb-20">
          <Opening />
          <AllCourses />
          <HowALessonWorks />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
