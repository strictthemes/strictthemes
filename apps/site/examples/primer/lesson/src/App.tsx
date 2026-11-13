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
  type LucideIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON_CLASSES = "h-10 px-5 font-sans text-body font-semibold"
const TITLE_LINK = cn(
  "text-foreground underline-offset-4 hover:underline",
  FOCUS
)

const COURSE = {
  title: "SQL from zero",
  lessons: 12,
  minutes: 190,
}

type LessonState = "done" | "current" | "next" | "locked"

type Lesson = {
  number: number
  title: string
  minutes: number
  state: LessonState
}

const MODULE = {
  number: 1,
  title: "Asking one table questions",
}

const LESSONS: Lesson[] = [
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

const CURRENT = LESSONS[3]
const NEXT = LESSONS[4]

type AnswerId = "a" | "b" | "c" | "d"

const ANSWERS: { id: AnswerId; query: string }[] = [
  { id: "a", query: "SELECT title FROM courses WHERE level = Intermediate;" },
  { id: "b", query: "SELECT title FROM courses WHERE level = 'Intermediate';" },
  { id: "c", query: "SELECT title WHERE level = 'Intermediate' FROM courses;" },
  {
    id: "d",
    query: "SELECT title FROM courses FILTER level = 'Intermediate';",
  },
]

const RIGHT_ANSWER: AnswerId = "b"

const WHAT_IS_WRONG: Record<Exclude<AnswerId, "b">, string> = {
  a: "Without quotes the database looks for a column called Intermediate and stops with an error.",
  c: "WHERE cannot come before FROM: the database has to know the table first.",
  d: "SQL has no FILTER word for this: the word is WHERE.",
}

const CODE_SAMPLE = `SELECT title, lessons
FROM courses
WHERE level = 'Beginner';`

function formatLength(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

function countLessons(n: number) {
  return `${n} ${n === 1 ? "lesson" : "lessons"}`
}

const STATE_DISPLAY: Record<
  LessonState,
  { icon: LucideIcon; word: string; iconClass: string }
> = {
  done: { icon: CircleCheck, word: "Done", iconClass: "text-foreground" },
  current: { icon: Play, word: "This lesson", iconClass: "text-foreground" },
  next: { icon: ArrowRight, word: "Next", iconClass: "text-foreground" },
  locked: { icon: Lock, word: "Locked", iconClass: "text-muted-foreground" },
}

function InlineCode({ children }: { children: ReactNode }) {
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
      <p
        className={cn(SMALL_FIGURE, "w-10 shrink-0 text-right text-foreground")}
      >
        {percent}%
      </p>
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
            FOCUS
          )}
        >
          Rowlark
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-5">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "true" : undefined}
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

function Breadcrumb() {
  const linkClass = cn(
    "text-muted-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
    FOCUS
  )
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-label">
        <li>
          <a href="/catalogue" className={linkClass}>
            Courses
          </a>
        </li>
        <li aria-hidden="true" className="text-muted-foreground">
          /
        </li>
        <li>
          <a href="#" className={linkClass}>
            {COURSE.title}
          </a>
        </li>
        <li aria-hidden="true" className="text-muted-foreground">
          /
        </li>
        <li>
          <span className="text-foreground" aria-current="page">
            Lesson {CURRENT.number}
          </span>
        </li>
      </ol>
    </nav>
  )
}

function LessonRow({ lesson, done }: { lesson: Lesson; done: boolean }) {
  const shownState: LessonState =
    lesson.state === "current" && done ? "done" : lesson.state
  const display = STATE_DISPLAY[shownState]
  const Icon = display.icon
  const line = `${lesson.number}. ${lesson.title}`

  let title: ReactNode
  if (lesson.state === "current") {
    title = (
      <span className="font-semibold" aria-current="page">
        {line}
      </span>
    )
  } else if (lesson.state === "locked") {
    title = <span className="text-muted-foreground">{line}</span>
  } else {
    title = (
      <a href="#" className={TITLE_LINK}>
        {line}
      </a>
    )
  }

  return (
    <li className="flex items-start gap-3 border-border py-3 not-first:border-t first:pt-0 last:pb-0">
      <Icon
        className={cn("mt-0.5 size-5 shrink-0", display.iconClass)}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-body">{title}</p>
        <p className={SMALL_FIGURE}>
          {formatLength(lesson.minutes)} · {display.word}
        </p>
      </div>
    </li>
  )
}

function Question({ onRight }: { onRight: () => void }) {
  const [answer, setAnswer] = useState<AnswerId | null>(null)
  const [checked, setChecked] = useState<AnswerId | null>(null)
  const [showError, setShowError] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)
  const firstRadio = useRef<HTMLElement>(null)

  useEffect(() => {
    if (focusRequest > 0) firstRadio.current?.focus()
  }, [focusRequest])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (answer === null) {
      setShowError(true)
      setFocusRequest((n) => n + 1)
      return
    }
    setChecked(answer)
    if (answer === RIGHT_ANSWER) onRight()
  }

  function handleChange(value: unknown) {
    setAnswer(value as AnswerId)
    setChecked(null)
    setShowError(false)
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
            <p id="question" className="font-sans text-body font-semibold">
              Which query returns the intermediate courses?
            </p>
            <p id="question-hint" className={SMALL_FIGURE}>
              One answer is right.
            </p>
            <RadioGroup
              name="answer"
              value={answer}
              onValueChange={handleChange}
              aria-labelledby="question"
              aria-describedby={
                showError ? "question-hint answer-error" : "question-hint"
              }
              className="flex flex-col gap-0"
            >
              {ANSWERS.map((item, index) => (
                <label
                  key={item.id}
                  className="flex min-h-10 cursor-pointer items-start gap-3 border-t border-border py-3"
                >
                  <RadioGroupItem
                    value={item.id}
                    className="mt-0.5"
                    ref={index === 0 ? firstRadio : undefined}
                  />
                  <code className="min-w-0 font-mono text-body break-words">
                    {item.query}
                  </code>
                </label>
              ))}
            </RadioGroup>
            {showError && (
              <p
                id="answer-error"
                className="flex items-start gap-2 font-mono text-label text-destructive"
              >
                <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
                Choose one of the four answers first.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className={BUTTON_CLASSES}>
              Check my answer
            </Button>
            <p className={SMALL_FIGURE}>You can try as often as you like</p>
          </div>
        </form>
        <div role="status">
          {checked !== null && <Result answer={checked} />}
        </div>
      </div>
    </section>
  )
}

function Result({ answer }: { answer: AnswerId }) {
  const right = answer === RIGHT_ANSWER
  const Icon = right ? CircleCheck : CircleX
  return (
    <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
      <Icon
        className="mt-0.5 size-5 shrink-0 text-foreground"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className="font-sans text-body font-semibold">
          {right ? "That is right" : "Not quite"}
        </p>
        <p className="max-w-2xl text-body">
          {right
            ? "WHERE comes after FROM, and the text 'Intermediate' is in single quotes. The query returns 3 rows, one for each intermediate course. Lesson 4 is done."
            : `${WHAT_IS_WRONG[answer as Exclude<AnswerId, "b">]} The right answer is the second query: WHERE after FROM, with the text in single quotes.`}
        </p>
      </div>
    </div>
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
          <InlineCode>WHERE</InlineCode> is how you ask for them. It comes after{" "}
          <InlineCode>FROM</InlineCode> and holds a condition. The database
          checks the condition against each row and keeps the rows where it is
          true.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-h2">One condition</h2>
        <p className="max-w-2xl">
          This query asks Rowlark&apos;s own table of courses for the ones for
          beginners:
        </p>
        <figure className="flex flex-col gap-2 md:max-w-2xl">
          <pre
            tabIndex={0}
            role="region"
            aria-label="Code sample: a query with WHERE"
            className={cn(
              "overflow-x-auto rounded-lg border border-border bg-card p-5 font-mono text-body text-foreground",
              FOCUS
            )}
          >
            <code>{CODE_SAMPLE}</code>
          </pre>
          <figcaption className={SMALL_FIGURE}>
            It returns 4 rows. Change &apos;Beginner&apos; to
            &apos;Advanced&apos; and it returns 2.
          </figcaption>
        </figure>
        <p className="max-w-2xl">
          The text <InlineCode>&apos;Beginner&apos;</InlineCode> is in single
          quotes. Without them the database would look for a column called
          Beginner and stop with an error. Numbers need no quotes:{" "}
          <InlineCode>WHERE lessons &gt; 10</InlineCode> keeps the courses with
          more than ten lessons.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-h2">Things to remember</h2>
        <ul className="flex max-w-2xl flex-col gap-2">
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>
              <InlineCode>WHERE</InlineCode> comes after{" "}
              <InlineCode>FROM</InlineCode>.
            </span>
          </li>
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>Text goes in single quotes. Numbers stand alone.</span>
          </li>
          <li className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>
              <InlineCode>=</InlineCode> means equal,{" "}
              <InlineCode>{"<>"}</InlineCode> means not equal, and{" "}
              <InlineCode>{">"}</InlineCode> and <InlineCode>{"<"}</InlineCode>{" "}
              compare numbers.
            </span>
          </li>
        </ul>
      </div>
    </article>
  )
}

export function App() {
  const [lessonDone, setLessonDone] = useState(false)

  const doneCount =
    LESSONS.filter((l) => l.state === "done").length + (lessonDone ? 1 : 0)
  const doneMinutes = LESSONS.filter(
    (l) => l.state === "done" || (l.state === "current" && lessonDone)
  ).reduce((sum, l) => sum + l.minutes, 0)
  const minutesLeft = COURSE.minutes - doneMinutes
  const percent = Math.round((doneCount / COURSE.lessons) * 100)
  const moduleMinutes = LESSONS.reduce((sum, l) => sum + l.minutes, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-5 pt-8 pb-20">
          <div className="flex flex-col gap-5">
            <Breadcrumb />
            <div className="flex flex-col gap-2">
              <p className={SMALL_FIGURE}>
                Module {MODULE.number} · {MODULE.title}
              </p>
              <h1 className="text-h1">{CURRENT.title}</h1>
            </div>
            <div className="flex flex-col gap-2 md:max-w-2xl">
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                <p className="font-sans text-body font-semibold">
                  Lesson {CURRENT.number} of {COURSE.lessons}
                </p>
                <p className={SMALL_FIGURE}>
                  {formatLength(CURRENT.minutes)} · {formatLength(minutesLeft)}{" "}
                  left in the course
                </p>
              </div>
              <ProgressBar percent={percent} />
              <p className={cn(SMALL_FIGURE, "text-foreground")}>
                {doneCount} of {countLessons(COURSE.lessons)} done
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
              <LessonText />
              <Question onRight={() => setLessonDone(true)} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <div className="flex flex-col gap-1">
                  <p className={SMALL_FIGURE}>
                    Up next · {formatLength(NEXT.minutes)}
                  </p>
                  <p className="font-sans text-body font-semibold">
                    Lesson {NEXT.number}: {NEXT.title}
                  </p>
                </div>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    BUTTON_CLASSES
                  )}
                >
                  Next lesson
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside
              aria-labelledby="module-heading"
              className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-8 lg:col-span-4 lg:self-start"
            >
              <div className="flex flex-col gap-2">
                <h2 id="module-heading" className="text-h2">
                  In this module
                </h2>
                <p className={SMALL_FIGURE}>
                  Module {MODULE.number} · {countLessons(LESSONS.length)} ·{" "}
                  {formatLength(moduleMinutes)}
                </p>
              </div>
              <ol className="flex flex-col">
                {LESSONS.map((lesson) => (
                  <LessonRow
                    key={lesson.number}
                    lesson={lesson}
                    done={lessonDone}
                  />
                ))}
              </ol>
              <p className={SMALL_FIGURE}>
                Lessons open one at a time. Lesson 6 opens when you start lesson
                5.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
