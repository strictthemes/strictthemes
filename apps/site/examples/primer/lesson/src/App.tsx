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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const nameText = "font-sans text-body font-semibold"
const titleLink = cn(
  "text-foreground underline-offset-4 hover:underline",
  focusRing
)

const COURSE_LESSONS = 12
const LESSONS_DONE_BEFORE = 3
const MINUTES_LEFT_BEFORE = 151
const THIS_LESSON_MINUTES = 16

type Answer = "1" | "2" | "3" | "4"
type LessonState = "done" | "current" | "next" | "locked"

const RIGHT_ANSWER: Answer = "2"

const answers: { value: Answer; query: string }[] = [
  {
    value: "1",
    query: "SELECT title FROM courses WHERE level = Intermediate;",
  },
  {
    value: "2",
    query: "SELECT title FROM courses WHERE level = 'Intermediate';",
  },
  {
    value: "3",
    query: "SELECT title WHERE level = 'Intermediate' FROM courses;",
  },
  {
    value: "4",
    query: "SELECT title FROM courses FILTER level = 'Intermediate';",
  },
]

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

function formatLength(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono">{children}</code>
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-border"
        aria-hidden="true"
      >
        {percent > 0 && (
          <div
            className="h-full rounded-full bg-tertiary"
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
      <span
        className={cn(smallFigure, "w-10 shrink-0 text-right text-foreground")}
      >
        {percent}%
      </span>
    </div>
  )
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

function Breadcrumb() {
  const linkClass = cn(
    "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
    focusRing
  )
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
        <li className="flex items-center gap-2">
          <a href="/catalogue" className={linkClass}>
            Courses
          </a>
          <span className="text-muted-foreground" aria-hidden="true">
            /
          </span>
        </li>
        <li className="flex items-center gap-2">
          <a href="#" className={linkClass}>
            SQL from zero
          </a>
          <span className="text-muted-foreground" aria-hidden="true">
            /
          </span>
        </li>
        <li>
          <span className="text-foreground" aria-current="page">
            Lesson 4
          </span>
        </li>
      </ol>
    </nav>
  )
}

function LessonText() {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="max-w-2xl">
          So far every query has returned every row of a table. Most questions
          are about some of the rows: the courses for beginners, the orders from
          March, the customers in one town.
        </p>
        <p className="max-w-2xl">
          <Code>WHERE</Code> is how you ask for them. It comes after{" "}
          <Code>FROM</Code> and holds a condition. The database checks the
          condition against each row and keeps the rows where it is true.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-h2">One condition</h2>
        <p className="max-w-2xl">
          This query asks Rowlark's own table of courses for the ones for
          beginners:
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
            <code>{`SELECT title, lessons
FROM courses
WHERE level = 'Beginner';`}</code>
          </pre>
          <figcaption className={smallFigure}>
            It returns 4 rows. Change 'Beginner' to 'Advanced' and it returns 2.
          </figcaption>
        </figure>
        <p className="max-w-2xl">
          The text <Code>'Beginner'</Code> is in single quotes. Without them the
          database would look for a column called Beginner and stop with an
          error. Numbers need no quotes: <Code>WHERE lessons &gt; 10</Code>{" "}
          keeps the courses with more than ten lessons.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-h2">Things to remember</h2>
        <ul className="flex flex-col gap-2">
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>
              <Code>WHERE</Code> comes after <Code>FROM</Code>.
            </span>
          </li>
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>Text goes in single quotes. Numbers stand alone.</span>
          </li>
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>
              <Code>=</Code> means equal, <Code>&lt;&gt;</Code> means not equal,
              and <Code>&gt;</Code> and <Code>&lt;</Code> compare numbers.
            </span>
          </li>
        </ul>
      </div>
    </article>
  )
}

const wrongReasons: Record<Exclude<Answer, "2">, ReactNode> = {
  "1": (
    <>
      Without quotes the database looks for a column called Intermediate and
      stops with an error.
    </>
  ),
  "3": (
    <>
      <Code>WHERE</Code> cannot come before <Code>FROM</Code>: the database has
      to know the table first.
    </>
  ),
  "4": (
    <>
      SQL has no <Code>FILTER</Code> word for this: the word is{" "}
      <Code>WHERE</Code>.
    </>
  ),
}

function Result({ answer }: { answer: Answer }) {
  const right = answer === RIGHT_ANSWER
  const Icon = right ? CircleCheck : CircleX
  return (
    <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
      <Icon
        className="mt-0.5 size-5 shrink-0 text-foreground"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className={nameText}>{right ? "That is right" : "Not quite"}</p>
        {right ? (
          <p className="max-w-2xl text-body">
            <Code>WHERE</Code> comes after <Code>FROM</Code>, and the text{" "}
            <Code>'Intermediate'</Code> is in single quotes. The query returns 3
            rows, one for each intermediate course. Lesson 4 is done.
          </p>
        ) : (
          <p className="max-w-2xl text-body">
            {wrongReasons[answer as Exclude<Answer, "2">]} The right answer is
            the second query: <Code>WHERE</Code> after <Code>FROM</Code>, with
            the text in single quotes.
          </p>
        )}
      </div>
    </div>
  )
}

function Question({ onRight }: { onRight: () => void }) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [checked, setChecked] = useState<Answer | null>(null)
  const [error, setError] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)
  const firstRadio = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (focusRequest > 0) firstRadio.current?.focus()
  }, [focusRequest])

  function choose(value: Answer) {
    setAnswer(value)
    setChecked(null)
    setError(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (answer === null) {
      setError(true)
      setFocusRequest((n) => n + 1)
      return
    }
    setChecked(answer)
    if (answer === RIGHT_ANSWER) onRight()
  }

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
          <div className="flex flex-col gap-3">
            <p id="question-text" className={nameText}>
              Which query returns the intermediate courses?
            </p>
            <p id="question-hint" className={smallFigure}>
              One answer is right.
            </p>
            <RadioGroup
              name="answer"
              value={answer}
              onValueChange={(value) => choose(value as Answer)}
              aria-labelledby="question-text"
              aria-describedby={
                error ? "question-hint question-error" : "question-hint"
              }
              aria-invalid={error || undefined}
              className="flex flex-col gap-0"
            >
              {answers.map((item, index) => (
                <label
                  key={item.value}
                  className="flex min-h-10 cursor-pointer items-start gap-3 border-t border-border py-3"
                >
                  <RadioGroupItem
                    value={item.value}
                    className="mt-0.5"
                    ref={index === 0 ? firstRadio : undefined}
                  />
                  <code className="min-w-0 font-mono text-body break-words">
                    {item.query}
                  </code>
                </label>
              ))}
            </RadioGroup>
            {error && (
              <p
                id="question-error"
                className="flex items-start gap-2 font-mono text-label text-destructive"
              >
                <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                <span>Choose one of the four answers first.</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="h-10 px-5 font-sans text-body font-semibold"
            >
              Check my answer
            </Button>
            <span className={smallFigure}>
              You can try as often as you like
            </span>
          </div>
        </form>
        <div role="status">{checked && <Result answer={checked} />}</div>
      </div>
    </section>
  )
}

function UpNext() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
      <div className="flex flex-col gap-1">
        <p className={smallFigure}>Up next · 15 min</p>
        <p className={nameText}>Lesson 5: Sorting with ORDER BY</p>
      </div>
      <a
        href="#"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "h-10 px-5 font-sans text-body font-semibold"
        )}
      >
        Next lesson
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
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
        {moduleLessons.map((lesson) => {
          const isCurrent = lesson.state === "current"
          const shownState: LessonState =
            isCurrent && lessonFourDone ? "done" : lesson.state
          const label = `${lesson.number}. ${lesson.title}`

          let Icon = CircleCheck
          if (shownState === "current") Icon = Play
          if (shownState === "next") Icon = ArrowRight
          if (shownState === "locked") Icon = Lock

          let title: ReactNode
          if (isCurrent) {
            title = (
              <span className="font-semibold" aria-current="step">
                {label}
              </span>
            )
          } else if (lesson.state === "locked") {
            title = <span className="text-muted-foreground">{label}</span>
          } else {
            title = (
              <a href="#" className={titleLink}>
                {label}
              </a>
            )
          }

          return (
            <li
              key={lesson.number}
              className="flex items-start gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0"
            >
              <Icon
                className={cn(
                  "mt-0.5 size-5 shrink-0",
                  shownState === "locked"
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-body">{title}</p>
                <p className={smallFigure}>
                  {formatLength(lesson.minutes)} · {stateWord[shownState]}
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

export function App() {
  const [lessonFourDone, setLessonFourDone] = useState(false)

  const lessonsDone = LESSONS_DONE_BEFORE + (lessonFourDone ? 1 : 0)
  const percent = Math.round((lessonsDone / COURSE_LESSONS) * 100)
  const minutesLeft =
    MINUTES_LEFT_BEFORE - (lessonFourDone ? THIS_LESSON_MINUTES : 0)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          <div className="flex flex-col gap-5">
            <Breadcrumb />
            <div className="flex flex-col gap-2">
              <p className={smallFigure}>
                Module 1 · Asking one table questions
              </p>
              <h1 className="text-h1">Filtering rows with WHERE</h1>
            </div>
            <div className="flex flex-col gap-2 md:max-w-2xl">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <p className={nameText}>Lesson 4 of 12</p>
                <span className={smallFigure}>
                  {formatLength(THIS_LESSON_MINUTES)} ·{" "}
                  {formatLength(minutesLeft)} left in the course
                </span>
              </div>
              <ProgressBar percent={percent} />
              <p className={cn(smallFigure, "text-foreground")}>
                {lessonsDone} of {COURSE_LESSONS} lessons done
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
              <LessonText />
              <Question onRight={() => setLessonFourDone(true)} />
              <UpNext />
            </div>
            <ModuleList lessonFourDone={lessonFourDone} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-8">
          <p className="font-heading text-h2">Rowlark</p>
          <p className={smallFigure}>
            Rowlark · Practical data skills, one short lesson at a time · 2027
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
