import { useRef, useState } from "react"
import {
  BookOpen,
  Bookmark,
  Clock,
  ListChecks,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Topic = "Spreadsheets" | "SQL" | "Charts"
type Level = "Beginner" | "Intermediate" | "Advanced"
type LevelFilter = "All levels" | Level

type Course = {
  title: string
  href: string
  topic: Topic
  level: Level
  lessons: number
  length: string
  teacher: string
  sentence: string
}

const COURSES: Course[] = [
  {
    title: "Spreadsheets from scratch",
    href: "#",
    topic: "Spreadsheets",
    level: "Beginner",
    lessons: 10,
    length: "2 h 30 min",
    teacher: "Samir Okonjo",
    sentence:
      "Cells, formulas and tidy tables, for people who have never opened a spreadsheet.",
  },
  {
    title: "SQL from zero",
    href: "#",
    topic: "SQL",
    level: "Beginner",
    lessons: 12,
    length: "3 h 10 min",
    teacher: "Odile Brandt",
    sentence:
      "Ask a database your first questions with SELECT, WHERE and ORDER BY.",
  },
  {
    title: "Your first charts",
    href: "#",
    topic: "Charts",
    level: "Beginner",
    lessons: 8,
    length: "1 h 50 min",
    teacher: "Lena Farrow",
    sentence:
      "Turn a small table into a bar chart and a line chart that people can read.",
  },
  {
    title: "Cleaning messy data",
    href: "#",
    topic: "Spreadsheets",
    level: "Beginner",
    lessons: 9,
    length: "2 h 15 min",
    teacher: "Samir Okonjo",
    sentence:
      "Fix dates, doubles and stray spaces before they spoil your sums.",
  },
  {
    title: "Pivot tables in practice",
    href: "#",
    topic: "Spreadsheets",
    level: "Intermediate",
    lessons: 11,
    length: "3 h 5 min",
    teacher: "Samir Okonjo",
    sentence:
      "Sum up ten thousand rows in a minute, and know what the summary hides.",
  },
  {
    title: "Joins and grouping in SQL",
    href: "#",
    topic: "SQL",
    level: "Intermediate",
    lessons: 14,
    length: "4 h 5 min",
    teacher: "Odile Brandt",
    sentence:
      "Bring two tables together, then count, sum and average by group.",
  },
  {
    title: "Charts that tell the truth",
    href: "/course",
    topic: "Charts",
    level: "Intermediate",
    lessons: 10,
    length: "2 h 40 min",
    teacher: "Lena Farrow",
    sentence: "Axes, scales and colors that show the numbers as they are.",
  },
  {
    title: "Window functions step by step",
    href: "#",
    topic: "SQL",
    level: "Advanced",
    lessons: 13,
    length: "3 h 50 min",
    teacher: "Odile Brandt",
    sentence: "Running totals, ranks and moving averages without leaving SQL.",
  },
  {
    title: "Dashboards people read",
    href: "#",
    topic: "Charts",
    level: "Advanced",
    lessons: 15,
    length: "4 h 30 min",
    teacher: "Lena Farrow",
    sentence:
      "Plan, lay out and test one page of charts for a team that is short of time.",
  },
]

const LEVELS: LevelFilter[] = [
  "All levels",
  "Beginner",
  "Intermediate",
  "Advanced",
]

// Each topic keeps one fill on every page.
const TOPIC_DOT: Record<Topic, string> = {
  Spreadsheets: "bg-azure",
  SQL: "bg-tertiary",
  Charts: "bg-berry",
}

const FIGURES = [
  { value: "9", unit: "courses", rule: "border-azure" },
  { value: "102", unit: "lessons", rule: "border-tertiary" },
  { value: "3", unit: "topics", rule: "border-sun" },
  { value: "3", unit: "teachers", rule: "border-berry" },
]

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
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

const NAV = [
  { label: "Courses", href: "/catalogue", current: true },
  { label: "My progress", href: "/progress", current: false },
  { label: "Plans", href: "/plans", current: false },
]

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "h-10 px-5 font-sans text-body font-semibold"

function countSentence(shown: number, total: number) {
  if (shown === 0) return "No courses match"
  if (shown === total) return `Showing all ${total} courses`
  return `Showing ${shown} of ${total} courses`
}

export function App() {
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState<LevelFilter>("All levels")
  const searchRef = useRef<HTMLInputElement>(null)

  const needle = search.trim().toLowerCase()
  const shown = COURSES.filter((course) => {
    const matchesSearch =
      needle === "" ||
      course.title.toLowerCase().includes(needle) ||
      course.topic.toLowerCase().includes(needle) ||
      course.teacher.toLowerCase().includes(needle)
    const matchesLevel = level === "All levels" || course.level === level
    return matchesSearch && matchesLevel
  })

  function clearAll() {
    setSearch("")
    setLevel("All levels")
    searchRef.current?.focus()
  }

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
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                      item.current
                        ? "underline decoration-2"
                        : "hover:underline",
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
        <div className={cn(CONTAINER, "flex flex-col gap-20 pt-8 pb-20")}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-h1 md:max-w-3xl md:text-display">
                Data skills you will use on Monday
              </h1>
              <p className="max-w-2xl">
                Nine courses in spreadsheets, SQL and charts. Every lesson is
                short, ends with one question, and starts where the last one
                stopped.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-5 md:max-w-2xl md:grid-cols-4">
              {FIGURES.map((figure) => (
                <li
                  key={figure.unit}
                  className={cn(
                    "flex flex-col gap-1 border-l-2 pl-3",
                    figure.rule
                  )}
                >
                  <span className="font-heading text-h1 tabular-nums">
                    {figure.value}
                  </span>
                  <span className={SMALL_FIGURE}>{figure.unit}</span>
                </li>
              ))}
            </ul>
          </div>

          <section
            aria-labelledby="all-courses"
            className="flex flex-col gap-5"
          >
            <h2 id="all-courses" className="text-h2">
              All courses
            </h2>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:max-w-sm">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="course-search"
                    className="block font-mono text-label text-muted-foreground"
                  >
                    Search courses
                  </label>
                  <Input
                    ref={searchRef}
                    id="course-search"
                    type="search"
                    autoComplete="off"
                    aria-describedby="course-search-help"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 px-3 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  <p id="course-search-help" className={SMALL_FIGURE}>
                    By title, topic or teacher
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p
                  id="level-label"
                  className="block font-mono text-label text-muted-foreground"
                >
                  Level
                </p>
                <div
                  role="group"
                  aria-labelledby="level-label"
                  className="flex flex-wrap gap-2"
                >
                  {LEVELS.map((item) => {
                    const chosen = item === level
                    return (
                      <Button
                        key={item}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        onClick={() => setLevel(item)}
                        className={BUTTON}
                      >
                        {item}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            <p role="status" className={cn(SMALL_FIGURE, "text-foreground")}>
              {countSentence(shown.length, COURSES.length)}
            </p>

            {shown.length > 0 ? (
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((course) => (
                  <li
                    key={course.title}
                    className="flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            TOPIC_DOT[course.topic]
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
                            FOCUS
                          )}
                        >
                          {course.title}
                        </a>
                      </h3>
                      <p className="text-body">{course.sentence}</p>
                      <p className={SMALL_FIGURE}>With {course.teacher}</p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3">
                      <span
                        className={cn(
                          SMALL_FIGURE,
                          "inline-flex items-center gap-2 text-foreground"
                        )}
                      >
                        <BookOpen aria-hidden="true" className="size-4" />
                        {course.lessons} lessons
                      </span>
                      <span
                        className={cn(
                          SMALL_FIGURE,
                          "inline-flex items-center gap-2 text-foreground"
                        )}
                      >
                        <Clock aria-hidden="true" className="size-4" />
                        {course.length}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-5">
                <p className="font-sans text-body font-semibold">
                  No courses match your search
                </p>
                <p className="text-body">
                  Try a shorter word, or another level.
                </p>
                <Button
                  variant="secondary"
                  onClick={clearAll}
                  className={BUTTON}
                >
                  Clear search and level
                </Button>
              </div>
            )}
          </section>

          <section
            aria-labelledby="how-a-lesson-works"
            className="flex flex-col gap-5"
          >
            <h2 id="how-a-lesson-works" className="text-h2">
              How a lesson works
            </h2>
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.title} className="flex flex-col gap-2">
                  <step.icon
                    aria-hidden="true"
                    className="size-5 text-foreground"
                  />
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
                  FOCUS
                )}
              >
                See the plans
              </a>
            </p>
          </section>
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
