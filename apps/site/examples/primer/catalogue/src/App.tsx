import { useId, useRef, useState } from "react"
import { Bookmark, BookOpen, Clock, ListChecks } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Topic = "Spreadsheets" | "SQL" | "Charts"
type Level = "Beginner" | "Intermediate" | "Advanced"
type LevelChoice = "All levels" | Level

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

const courses: Course[] = [
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
    summary: "Fix dates, doubles and stray spaces before they spoil your sums.",
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

const levelChoices: LevelChoice[] = [
  "All levels",
  "Beginner",
  "Intermediate",
  "Advanced",
]

const topicFill: Record<Topic, string> = {
  Spreadsheets: "bg-azure",
  SQL: "bg-tertiary",
  Charts: "bg-berry",
}

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "h-10 px-5 font-sans text-body font-semibold"
const container = "mx-auto w-full max-w-[1240px] px-5"

function formatLength(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

function matches(course: Course, query: string, level: LevelChoice) {
  const text = query.trim().toLowerCase()
  const byText =
    text === "" ||
    [course.title, course.topic, course.teacher].some((field) =>
      field.toLowerCase().includes(text)
    )
  const byLevel = level === "All levels" || course.level === level
  return byText && byLevel
}

const navLinks = [
  { label: "Courses", href: "/catalogue", current: true },
  { label: "My progress", href: "/progress", current: false },
  { label: "Plans", href: "/plans", current: false },
]

const openingFigures = [
  { value: "9", unit: "courses", rule: "border-azure" },
  { value: "102", unit: "lessons", rule: "border-tertiary" },
  { value: "3", unit: "topics", rule: "border-sun" },
  { value: "3", unit: "teachers", rule: "border-berry" },
]

const lessonSteps = [
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

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-8 gap-y-1 py-3"
        )}
      >
        <a
          href="/catalogue"
          className={cn(
            "inline-flex h-10 items-center font-heading text-h2 text-foreground",
            focusOutline
          )}
        >
          Rowlark
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                    link.current ? "underline decoration-2" : "hover:underline",
                    focusOutline
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

function Opening() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-h1 md:max-w-3xl md:text-display">
          Data skills you will use on Monday
        </h1>
        <p className="max-w-2xl text-body">
          Nine courses in spreadsheets, SQL and charts. Every lesson is short,
          ends with one question, and starts where the last one stopped.
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-5 md:max-w-2xl md:grid-cols-4">
        {openingFigures.map((figure) => (
          <li
            key={figure.unit}
            className={cn("flex flex-col gap-1 border-l-2 pl-3", figure.rule)}
          >
            <span className="font-heading text-h1 tabular-nums">
              {figure.value}
            </span>
            <span className={smallFigure}>{figure.unit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  return (
    <li className="flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 shrink-0 rounded-full",
              topicFill[course.topic]
            )}
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
              focusOutline
            )}
          >
            {course.title}
          </a>
        </h3>
        <p className="text-body">{course.summary}</p>
        <p className={smallFigure}>With {course.teacher}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3">
        <span
          className={cn(
            "inline-flex items-center gap-2",
            smallFigure,
            "text-foreground"
          )}
        >
          <BookOpen className="size-4" aria-hidden="true" />
          {plural(course.lessons, "lesson")}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-2",
            smallFigure,
            "text-foreground"
          )}
        >
          <Clock className="size-4" aria-hidden="true" />
          {formatLength(course.minutes)}
        </span>
      </div>
    </li>
  )
}

function AllCourses() {
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<LevelChoice>("All levels")
  const searchRef = useRef<HTMLInputElement>(null)
  const ids = useId()
  const searchId = `${ids}-search`
  const helperId = `${ids}-search-help`
  const levelLabelId = `${ids}-level`

  const shown = courses.filter((course) => matches(course, query, level))
  const count =
    shown.length === courses.length
      ? `Showing all ${courses.length} courses`
      : shown.length === 0
        ? "No courses match"
        : `Showing ${shown.length} of ${courses.length} courses`

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

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby={helperId}
            className="h-10 px-3 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
          />
          <p id={helperId} className={smallFigure}>
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
            {levelChoices.map((choice) => {
              const chosen = choice === level
              return (
                <Button
                  key={choice}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setLevel(choice)}
                  className={buttonText}
                >
                  {choice}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      <p role="status" className={cn(smallFigure, "text-foreground")}>
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
          <Button variant="secondary" onClick={clearAll} className={buttonText}>
            Clear search and level
          </Button>
        </div>
      )}
    </section>
  )
}

function HowALessonWorks() {
  return (
    <section
      aria-labelledby="how-a-lesson-works"
      className="flex flex-col gap-5"
    >
      <h2 id="how-a-lesson-works" className="text-h2">
        How a lesson works
      </h2>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {lessonSteps.map((step) => (
          <li key={step.title} className="flex flex-col gap-2">
            <step.icon className="size-5 text-foreground" aria-hidden="true" />
            <h3 className="text-h2">{step.title}</h3>
            <p className="text-body">{step.text}</p>
          </li>
        ))}
      </ul>
      <p className="max-w-2xl text-body">
        The first module of every course is free.{" "}
        <a
          href="/plans"
          className={cn(
            "text-foreground underline underline-offset-4 hover:decoration-2",
            focusOutline
          )}
        >
          See the plans
        </a>
      </p>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center justify-between gap-3 py-8"
        )}
      >
        <p className="font-heading text-h2">Rowlark</p>
        <p className={smallFigure}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className={cn(container, "flex flex-col gap-20 pt-8 pb-20")}>
          <Opening />
          <AllCourses />
          <HowALessonWorks />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
