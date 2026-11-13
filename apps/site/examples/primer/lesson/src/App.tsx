import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Lock,
  Play,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const titleLink = cn(
  "text-foreground underline-offset-4 hover:underline",
  focusOutline
)

const navLink = cn(
  "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
  focusOutline
)

const buttonClasses = "h-10 px-5 font-sans text-body font-semibold"

const COURSE_LESSONS = 12
const COURSE_MINUTES = 190 // 3 h 10 min
const LESSONS_BEFORE = 3
const MINUTES_DONE_BEFORE = 12 + 14 + 13
const THIS_LESSON_MINUTES = 16

function formatLength(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

type LessonState = "done" | "current" | "next" | "locked"

const moduleLessons: {
  number: number
  title: string
  minutes: number
  state: LessonState
}[] = [
  { number: 1, title: "What a database is", minutes: 12, state: "done" },
  { number: 2, title: "Your first SELECT", minutes: 14, state: "done" },
  { number: 3, title: "Choosing columns", minutes: 13, state: "done" },
  {
    number: 4,
    title: "Filtering rows with WHERE",
    minutes: 16,
    state: "current",
  },
  { number: 5, title: "Sorting with ORDER BY", minutes: 15, state: "next" },
  {
    number: 6,
    title: "A small report from one table",
    minutes: 18,
    state: "locked",
  },
]

const moduleMinutes = moduleLessons.reduce((sum, l) => sum + l.minutes, 0)

type AnswerId = "1" | "2" | "3" | "4"

const answers: { id: AnswerId; query: string }[] = [
  { id: "1", query: "SELECT title FROM courses WHERE level = Intermediate;" },
  { id: "2", query: "SELECT title FROM courses WHERE level = 'Intermediate';" },
  { id: "3", query: "SELECT title WHERE level = 'Intermediate' FROM courses;" },
  {
    id: "4",
    query: "SELECT title FROM courses FILTER level = 'Intermediate';",
  },
]

const RIGHT_ANSWER: AnswerId = "2"

const wrongReasons: Record<Exclude<AnswerId, "2">, string> = {
  "1": "Without quotes the database looks for a column called Intermediate and stops with an error.",
  "3": "WHERE cannot come before FROM: the database has to know the table first.",
  "4": "SQL has no FILTER word for this: the word is WHERE.",
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
      <p
        className={cn(smallFigure, "w-10 shrink-0 text-right text-foreground")}
      >
        {percent}%
      </p>
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-3">
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
            <li>
              <a
                href="/catalogue"
                aria-current="true"
                className={cn(navLink, "underline decoration-2")}
              >
                Courses
              </a>
            </li>
            <li>
              <a href="/progress" className={cn(navLink, "hover:underline")}>
                My progress
              </a>
            </li>
            <li>
              <a href="/plans" className={cn(navLink, "hover:underline")}>
                Plans
              </a>
            </li>
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
        <p className={smallFigure}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

function LessonStateIcon({ state }: { state: LessonState }) {
  const base = "mt-0.5 size-5 shrink-0"
  switch (state) {
    case "done":
      return (
        <CircleCheck
          aria-hidden="true"
          className={cn(base, "text-foreground")}
        />
      )
    case "current":
      return <Play aria-hidden="true" className={cn(base, "text-foreground")} />
    case "next":
      return (
        <ArrowRight
          aria-hidden="true"
          className={cn(base, "text-foreground")}
        />
      )
    case "locked":
      return (
        <Lock
          aria-hidden="true"
          className={cn(base, "text-muted-foreground")}
        />
      )
  }
}

export function App() {
  const [answer, setAnswer] = useState<AnswerId | null>(null)
  const [result, setResult] = useState<AnswerId | null>(null)
  const [showError, setShowError] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)
  const [lessonDone, setLessonDone] = useState(false)
  const firstRadioRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (focusRequest > 0) firstRadioRef.current?.focus()
  }, [focusRequest])

  const lessonsDone = LESSONS_BEFORE + (lessonDone ? 1 : 0)
  const percent = Math.round((lessonsDone / COURSE_LESSONS) * 100)
  const minutesLeft =
    COURSE_MINUTES -
    MINUTES_DONE_BEFORE -
    (lessonDone ? THIS_LESSON_MINUTES : 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (answer === null) {
      setResult(null)
      setShowError(true)
      setFocusRequest((n) => n + 1)
      return
    }
    setShowError(false)
    setResult(answer)
    if (answer === RIGHT_ANSWER) setLessonDone(true)
  }

  function handleValueChange(value: unknown) {
    setAnswer(value as AnswerId)
    setShowError(false)
    setResult(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          {/* Where you are */}
          <div className="flex flex-col gap-5">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
                <li>
                  <a
                    href="/catalogue"
                    className={cn(
                      "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                      focusOutline
                    )}
                  >
                    Courses
                  </a>
                </li>
                <li aria-hidden="true" className="text-muted-foreground">
                  /
                </li>
                <li>
                  <a
                    href="#"
                    className={cn(
                      "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                      focusOutline
                    )}
                  >
                    SQL from zero
                  </a>
                </li>
                <li aria-hidden="true" className="text-muted-foreground">
                  /
                </li>
                <li aria-current="page" className="text-foreground">
                  Lesson 4
                </li>
              </ol>
            </nav>

            <div className="flex flex-col gap-2">
              <p className={smallFigure}>
                Module 1 · Asking one table questions
              </p>
              <h1 className="text-h1">Filtering rows with WHERE</h1>
            </div>

            <div className="flex flex-col gap-2 md:max-w-2xl">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <p className="font-sans text-body font-semibold">
                  Lesson 4 of {COURSE_LESSONS}
                </p>
                <p className={smallFigure}>
                  {formatLength(THIS_LESSON_MINUTES)} ·{" "}
                  {formatLength(minutesLeft)} left in the course
                </p>
              </div>
              <ProgressBar percent={percent} />
              <p className={cn(smallFigure, "text-foreground")}>
                {lessonsDone} of {COURSE_LESSONS} lessons done
              </p>
            </div>
          </div>

          {/* The lesson and its module */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
              <article className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <p className="max-w-2xl">
                    So far every query has returned every row of a table. Most
                    questions are about some of the rows: the courses for
                    beginners, the orders from March, the customers in one town.
                  </p>
                  <p className="max-w-2xl">
                    <code className="font-mono">WHERE</code> is how you ask for
                    them. It comes after <code className="font-mono">FROM</code>{" "}
                    and holds a condition. The database checks the condition
                    against each row and keeps the rows where it is true.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-h2">One condition</h2>
                  <p className="max-w-2xl">
                    This query asks Rowlark&rsquo;s own table of courses for the
                    ones for beginners:
                  </p>
                  <figure className="flex flex-col gap-2 md:max-w-2xl">
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label="Code sample: a query with WHERE"
                      className={cn(
                        "overflow-x-auto rounded-lg border border-border bg-card p-5 font-mono text-body text-foreground",
                        focusOutline
                      )}
                    >
                      <code>
                        {
                          "SELECT title, lessons\nFROM courses\nWHERE level = 'Beginner';"
                        }
                      </code>
                    </pre>
                    <figcaption className={smallFigure}>
                      {
                        "It returns 4 rows. Change 'Beginner' to 'Advanced' and it returns 2."
                      }
                    </figcaption>
                  </figure>
                  <p className="max-w-2xl">
                    The text <code className="font-mono">{"'Beginner'"}</code>{" "}
                    is in single quotes. Without them the database would look
                    for a column called Beginner and stop with an error. Numbers
                    need no quotes:{" "}
                    <code className="font-mono">WHERE lessons &gt; 10</code>{" "}
                    keeps the courses with more than ten lessons.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-h2">Things to remember</h2>
                  <ul className="flex flex-col gap-2">
                    <li className="flex items-start gap-3 text-body">
                      <Check
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0"
                      />
                      <span>
                        <code className="font-mono">WHERE</code> comes after{" "}
                        <code className="font-mono">FROM</code>.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-body">
                      <Check
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0"
                      />
                      <span>
                        Text goes in single quotes. Numbers stand alone.
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-body">
                      <Check
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0"
                      />
                      <span>
                        <code className="font-mono">=</code> means equal,{" "}
                        <code className="font-mono">&lt;&gt;</code> means not
                        equal, and <code className="font-mono">&gt;</code> and{" "}
                        <code className="font-mono">&lt;</code> compare numbers.
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* The question */}
              <section
                aria-labelledby="question-heading"
                className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
              >
                <h2 id="question-heading" className="text-h2">
                  Check what you learned
                </h2>
                <div>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-3">
                      <p
                        id="question-text"
                        className="font-sans text-body font-semibold"
                      >
                        Which query returns the intermediate courses?
                      </p>
                      <p id="question-hint" className={smallFigure}>
                        One answer is right.
                      </p>
                      <RadioGroup
                        name="answer"
                        value={answer}
                        onValueChange={handleValueChange}
                        aria-labelledby="question-text"
                        aria-describedby={
                          showError
                            ? "question-hint question-error"
                            : "question-hint"
                        }
                        className="flex flex-col gap-0"
                      >
                        {answers.map((a, index) => (
                          <label
                            key={a.id}
                            className="flex min-h-10 cursor-pointer items-start gap-3 border-t border-border py-3"
                          >
                            <RadioGroupItem
                              value={a.id}
                              className="mt-0.5"
                              ref={index === 0 ? firstRadioRef : undefined}
                            />
                            <code className="min-w-0 font-mono text-body break-words">
                              {a.query}
                            </code>
                          </label>
                        ))}
                      </RadioGroup>
                      {showError && (
                        <p
                          id="question-error"
                          className="flex items-start gap-2 font-mono text-label text-destructive"
                        >
                          <CircleAlert
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                          Choose one of the four answers first.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button type="submit" className={buttonClasses}>
                        Check my answer
                      </Button>
                      <p className={smallFigure}>
                        You can try as often as you like
                      </p>
                    </div>
                  </form>
                  <div role="status">
                    {result !== null && (
                      <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
                        {result === RIGHT_ANSWER ? (
                          <CircleCheck
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-foreground"
                          />
                        ) : (
                          <CircleX
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-foreground"
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="font-sans text-body font-semibold">
                            {result === RIGHT_ANSWER
                              ? "That is right"
                              : "Not quite"}
                          </p>
                          <p className="max-w-2xl text-body">
                            {result === RIGHT_ANSWER
                              ? "WHERE comes after FROM, and the text 'Intermediate' is in single quotes. The query returns 3 rows, one for each intermediate course. Lesson 4 is done."
                              : `${wrongReasons[result as Exclude<AnswerId, "2">]} The right answer is the second query: WHERE after FROM, with the text in single quotes.`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* What comes next */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <div className="flex flex-col gap-1">
                  <p className={smallFigure}>Up next · 15 min</p>
                  <p className="font-sans text-body font-semibold">
                    Lesson 5: Sorting with ORDER BY
                  </p>
                </div>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    buttonClasses
                  )}
                >
                  Next lesson
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>

            {/* The module's list */}
            <aside
              aria-labelledby="module-heading"
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-8 lg:col-span-4 lg:self-start"
            >
              <div className="flex flex-col gap-2">
                <h2 id="module-heading" className="text-h2">
                  In this module
                </h2>
                <p className={smallFigure}>
                  Module 1 · {moduleLessons.length} lessons ·{" "}
                  {formatLength(moduleMinutes)}
                </p>
              </div>
              <ol className="flex flex-col">
                {moduleLessons.map((lesson) => {
                  const state: LessonState =
                    lesson.state === "current" && lessonDone
                      ? "done"
                      : lesson.state
                  const stateWord = {
                    done: "Done",
                    current: "This lesson",
                    next: "Next",
                    locked: "Locked",
                  }[state]
                  const label = `${lesson.number}. ${lesson.title}`
                  return (
                    <li
                      key={lesson.number}
                      className="flex items-start gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
                    >
                      <LessonStateIcon state={state} />
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-body">
                          {lesson.state === "current" ? (
                            <span aria-current="step" className="font-semibold">
                              {label}
                            </span>
                          ) : lesson.state === "locked" ? (
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                          ) : (
                            <a href="#" className={titleLink}>
                              {label}
                            </a>
                          )}
                        </span>
                        <span className={smallFigure}>
                          {formatLength(lesson.minutes)} · {stateWord}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
              <p className={smallFigure}>
                Lessons open one at a time. Lesson 6 opens when you start lesson
                5.
              </p>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
