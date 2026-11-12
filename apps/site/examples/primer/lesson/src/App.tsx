import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
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
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const titleLink = cn(
  "text-foreground underline-offset-4 hover:underline",
  focusRing
)

const COURSE_LESSONS = 12
const LESSONS_DONE_BEFORE = 3
// Minutes left in the course before lesson 4 is done: 2 h 31 min.
const MINUTES_LEFT_BEFORE = 151
const THIS_LESSON_MINUTES = 16

function formatLength(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

function lessonCount(n: number) {
  return `${n} ${n === 1 ? "lesson" : "lessons"}`
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

const answers = [
  {
    value: "1",
    query: "SELECT title FROM courses WHERE level = Intermediate;",
    why: "Without quotes the database looks for a column called Intermediate and stops with an error.",
  },
  {
    value: "2",
    query: "SELECT title FROM courses WHERE level = 'Intermediate';",
    why: "",
  },
  {
    value: "3",
    query: "SELECT title WHERE level = 'Intermediate' FROM courses;",
    why: "WHERE cannot come before FROM: the database has to know the table first.",
  },
  {
    value: "4",
    query: "SELECT title FROM courses FILTER level = 'Intermediate';",
    why: "SQL has no FILTER word for this: the word is WHERE.",
  },
]

const RIGHT_ANSWER = "2"

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono">{children}</code>
}

function Header() {
  const links = [
    { label: "Courses", href: "/catalogue", current: true },
    { label: "My progress", href: "/progress", current: false },
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
                  aria-current={link.current ? "true" : undefined}
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

function LessonIcon({ state }: { state: LessonState }) {
  const base = "mt-0.5 size-5 shrink-0"
  if (state === "done")
    return (
      <CircleCheck aria-hidden="true" className={cn(base, "text-foreground")} />
    )
  if (state === "current")
    return <Play aria-hidden="true" className={cn(base, "text-foreground")} />
  if (state === "next")
    return (
      <ArrowRight aria-hidden="true" className={cn(base, "text-foreground")} />
    )
  return (
    <Lock aria-hidden="true" className={cn(base, "text-muted-foreground")} />
  )
}

const stateWord: Record<LessonState, string> = {
  done: "Done",
  current: "This lesson",
  next: "Next",
  locked: "Locked",
}

function ModuleList({ lessonFourDone }: { lessonFourDone: boolean }) {
  return (
    <aside
      aria-labelledby="module-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-8 lg:col-span-4 lg:self-start"
    >
      <div className="flex flex-col gap-2">
        <h2 id="module-heading" className="text-h2">
          In this module
        </h2>
        <p className={smallFigure}>Module 1 · 6 lessons · 1 h 28 min</p>
      </div>
      <ol className="flex flex-col">
        {moduleLessons.map((lesson, index) => {
          const isCurrent = lesson.state === "current"
          // The lesson being read keeps its title, but shows as done once checked.
          const shownState: LessonState =
            isCurrent && lessonFourDone ? "done" : lesson.state
          return (
            <li
              key={lesson.number}
              className={cn(
                "flex items-start gap-3 py-3 first:pt-0 last:pb-0",
                index > 0 && "border-t border-border"
              )}
            >
              <LessonIcon state={shownState} />
              <div className="flex min-w-0 flex-col gap-1">
                <p
                  className={cn(
                    "text-body",
                    lesson.state === "locked" && "text-muted-foreground"
                  )}
                >
                  {lesson.number}.{" "}
                  {isCurrent ? (
                    <span aria-current="page" className="font-semibold">
                      {lesson.title}
                    </span>
                  ) : lesson.state === "locked" ? (
                    lesson.title
                  ) : (
                    <a href="#" className={titleLink}>
                      {lesson.title}
                    </a>
                  )}
                </p>
                <p className={smallFigure}>
                  {formatLength(lesson.minutes)} ·{" "}
                  {isCurrent && lessonFourDone
                    ? "Done"
                    : stateWord[lesson.state]}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
      <p className={smallFigure}>
        Lessons open one at a time. Lesson 6 opens when you start lesson 5.
      </p>
    </aside>
  )
}

type Result = { answer: string; right: boolean } | null

function Question({ onRight }: { onRight: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [result, setResult] = useState<Result>(null)
  const [error, setError] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)
  const firstRadio = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusRequest > 0) firstRadio.current?.focus()
  }, [focusRequest])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (chosen === null) {
      setResult(null)
      setError(true)
      setFocusRequest((n) => n + 1)
      return
    }
    const right = chosen === RIGHT_ANSWER
    setResult({ answer: chosen, right })
    if (right) onRight()
  }

  function handleChange(value: string) {
    setChosen(value)
    setError(false)
    setResult(null)
  }

  const wrongReason =
    result && !result.right
      ? answers.find((a) => a.value === result.answer)?.why
      : ""

  return (
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
          <fieldset
            className="m-0 min-w-0 border-0 p-0"
            aria-describedby={
              error ? "answer-hint answer-error" : "answer-hint"
            }
          >
            <legend className="p-0 pb-3 font-sans text-body font-semibold">
              Which query returns the intermediate courses?
            </legend>
            <div className="flex flex-col gap-3">
              <p id="answer-hint" className={smallFigure}>
                One answer is right.
              </p>
              <div className="flex flex-col">
                {answers.map((answer, index) => (
                  <label
                    key={answer.value}
                    className="flex min-h-10 cursor-pointer items-start gap-3 border-t border-border py-3"
                  >
                    <input
                      ref={index === 0 ? firstRadio : undefined}
                      type="radio"
                      name="answer"
                      value={answer.value}
                      checked={chosen === answer.value}
                      onChange={() => handleChange(answer.value)}
                      className={cn(
                        "mt-0.5 size-5 shrink-0 accent-primary",
                        focusRing
                      )}
                    />
                    <code className="min-w-0 font-mono text-body break-words">
                      {answer.query}
                    </code>
                  </label>
                ))}
              </div>
              {error && (
                <p
                  id="answer-error"
                  className="flex items-start gap-2 font-mono text-label text-destructive"
                >
                  <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
                  Choose one of the four answers first.
                </p>
              )}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="h-10 px-5 font-sans text-body font-semibold"
            >
              Check my answer
            </Button>
            <p className={smallFigure}>You can try as often as you like</p>
          </div>
        </form>
        <div role="status">
          {result && (
            <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
              {result.right ? (
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
                  {result.right ? "That is right" : "Not quite"}
                </p>
                <p className="text-body">
                  {result.right
                    ? "WHERE comes after FROM, and the text 'Intermediate' is in single quotes. The query returns 3 rows, one for each intermediate course. Lesson 4 is done."
                    : `${wrongReason} The right answer is the second query: WHERE after FROM, with the text in single quotes.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [lessonFourDone, setLessonFourDone] = useState(false)

  const done = LESSONS_DONE_BEFORE + (lessonFourDone ? 1 : 0)
  const percent = Math.round((done / COURSE_LESSONS) * 100)
  const minutesLeft =
    MINUTES_LEFT_BEFORE - (lessonFourDone ? THIS_LESSON_MINUTES : 0)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          <div className="flex flex-col gap-5">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
                <li>
                  <a
                    href="/catalogue"
                    className={cn(
                      "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                      focusRing
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
                      focusRing
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
                  Lesson 4 of 12
                </p>
                <p className={smallFigure}>
                  {formatLength(THIS_LESSON_MINUTES)} ·{" "}
                  {formatLength(minutesLeft)} left in the course
                </p>
              </div>
              <ProgressBar percent={percent} />
              <p className={cn(smallFigure, "text-foreground")}>
                {done} of {lessonCount(COURSE_LESSONS)} done
              </p>
            </div>
          </div>

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
                    <Code>WHERE</Code> is how you ask for them. It comes after{" "}
                    <Code>FROM</Code> and holds a condition. The database checks
                    the condition against each row and keeps the rows where it
                    is true.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-h2">One condition</h2>
                  <p className="max-w-2xl">
                    This query asks Rowlark’s own table of courses for the ones
                    for beginners:
                  </p>
                  <figure className="flex flex-col gap-2 md:max-w-2xl">
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label="Code sample: a query with WHERE"
                      className={cn(
                        "overflow-x-auto rounded-lg border border-border bg-card p-5 font-mono text-body text-foreground",
                        focusRing
                      )}
                    >
                      <code>
                        {
                          "SELECT title, lessons\nFROM courses\nWHERE level = 'Beginner';"
                        }
                      </code>
                    </pre>
                    <figcaption className={smallFigure}>
                      It returns 4 rows. Change 'Beginner' to 'Advanced' and it
                      returns 2.
                    </figcaption>
                  </figure>
                  <p className="max-w-2xl">
                    The text <Code>'Beginner'</Code> is in single quotes.
                    Without them the database would look for a column called
                    Beginner and stop with an error. Numbers need no quotes:{" "}
                    <Code>WHERE lessons &gt; 10</Code> keeps the courses with
                    more than ten lessons.
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
                        <Code>WHERE</Code> comes after <Code>FROM</Code>.
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
                        <Code>=</Code> means equal, <Code>&lt;&gt;</Code> means
                        not equal, and <Code>&gt;</Code> and <Code>&lt;</Code>{" "}
                        compare numbers.
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              <Question onRight={() => setLessonFourDone(true)} />

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
                    "h-10 gap-2 px-5 font-sans text-body font-semibold"
                  )}
                >
                  Next lesson
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>

            <ModuleList lessonFourDone={lessonFourDone} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
