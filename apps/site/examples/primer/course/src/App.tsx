import { BookOpen, Check, Clock, Layers, User } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const textLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)
const buttonClasses = "h-10 px-5 font-sans text-body font-semibold"
const container = "mx-auto w-full max-w-[1240px] px-5"

type Lesson = { number: number; title: string; minutes: number }
type Module = { id: string; name: string; lessons: Lesson[] }

const modules: Module[] = [
  {
    id: "module-1",
    name: "Choosing the right chart",
    lessons: [
      { number: 1, title: "Why some charts mislead", minutes: 14 },
      { number: 2, title: "Bar, line or dot: picking a chart", minutes: 16 },
      { number: 3, title: "One chart, one message", minutes: 15 },
    ],
  },
  {
    id: "module-2",
    name: "Honest axes and scales",
    lessons: [
      { number: 4, title: "Where the axis starts", minutes: 17 },
      { number: 5, title: "Two scales on one chart", minutes: 16 },
      { number: 6, title: "Percentages and what they hide", minutes: 18 },
      { number: 7, title: "Showing change over time", minutes: 14 },
    ],
  },
  {
    id: "module-3",
    name: "Color, labels and titles",
    lessons: [
      { number: 8, title: "Color that carries nothing alone", minutes: 16 },
      { number: 9, title: "Labels in place of legends", minutes: 18 },
      { number: 10, title: "Titles that say the finding", minutes: 16 },
    ],
  },
]

function formatLength(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return `${hours} h`
  return `${hours} h ${rest} min`
}

function count(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}

function sumMinutes(lessons: Lesson[]) {
  return lessons.reduce((total, lesson) => total + lesson.minutes, 0)
}

const allLessons = modules.flatMap((module) => module.lessons)
const courseLength = formatLength(sumMinutes(allLessons))
const courseFacts = `${count(modules.length, "module", "modules")} · ${count(allLessons.length, "lesson", "lessons")} · ${courseLength}`

const learnLines = [
  "Pick a bar, a line or a dot chart for the question in front of you",
  "Spot the five most common ways a chart misleads",
  "Start an axis where it should start, and say so when it does not",
  "Show change over time without hiding the dull months",
  "Use color so that the chart still reads in grey",
  "Write a title that says what the chart found",
]

const chartData = [
  { day: "Mon", value: 96 },
  { day: "Tue", value: 98 },
]

const charts = [
  { name: "Axis from 95", axisStart: 95, axisEnd: 100 },
  { name: "Axis from 0", axisStart: 0, axisEnd: 120 },
]

function barHeight(value: number, axisStart: number, axisEnd: number) {
  const share = (value - axisStart) / (axisEnd - axisStart)
  return `${Math.round(Math.min(100, Math.max(0, share * 100)))}%`
}

function Header() {
  const links = [
    { label: "Courses", href: "/catalogue", current: true },
    { label: "My progress", href: "/progress", current: false },
    { label: "Plans", href: "/plans", current: false },
  ]
  return (
    <header className="border-b border-border">
      <div
        className={cn(container, "flex flex-wrap items-center gap-x-8 gap-y-1 py-3")}
      >
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

function Picture() {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label="The same two numbers, 96 on Monday and 98 on Tuesday, drawn twice. With the axis starting at 95 the second bar looks three times as tall as the first. With the axis starting at 0 the two bars look almost the same."
        className="grid grid-cols-2 gap-5 rounded-xl border border-border bg-card p-5"
      >
        {charts.map((chart) => (
          <div key={chart.name} aria-hidden="true" className="flex flex-col gap-2">
            <p className={cn(smallFigure, "text-foreground")}>{chart.name}</p>
            <div className="flex h-40 items-end justify-center gap-3 border-b border-border">
              {chartData.map((point) => (
                <div
                  key={point.day}
                  className="flex h-full w-12 flex-col items-center justify-end gap-1"
                >
                  <span className="font-mono text-label tabular-nums text-foreground">
                    {point.value}
                  </span>
                  <div
                    className="w-full shrink-0 bg-azure"
                    style={{
                      height: barHeight(point.value, chart.axisStart, chart.axisEnd),
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {chartData.map((point) => (
                <span key={point.day} className={cn(smallFigure, "w-12 text-center")}>
                  {point.day}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <figcaption className={smallFigure}>
        From lesson 4: where the axis starts changes what a chart says.
      </figcaption>
    </figure>
  )
}

function Opening() {
  const facts = [
    { icon: BookOpen, text: count(allLessons.length, "lesson", "lessons") },
    { icon: Layers, text: count(modules.length, "module", "modules") },
    { icon: Clock, text: courseLength },
    { icon: User, text: "With Lena Farrow" },
  ]
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
      <div className="flex flex-col gap-5 lg:col-span-7">
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
            <li aria-current="page" className="text-foreground">
              Charts that tell the truth
            </li>
          </ol>
        </nav>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-berry" />
              Charts
            </span>
            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
              Intermediate
            </Badge>
          </div>
          <h1 className="text-h1">Charts that tell the truth</h1>
          <p className="max-w-2xl">
            Most misleading charts are made by accident. In ten short lessons you
            learn where charts go wrong, and how to draw the same numbers so that a
            busy reader gets them right.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {facts.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className={cn(smallFigure, "inline-flex items-center gap-2 text-foreground")}
            >
              <Icon className="size-4" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#" className={cn(buttonVariants({ variant: "default" }), buttonClasses)}>
            Start the course
          </a>
          <p className={smallFigure}>Module 1 is free · No card needed</p>
        </div>
      </div>
      <div className="lg:col-span-5">
        <Picture />
      </div>
    </div>
  )
}

function Learn() {
  return (
    <section aria-labelledby="learn-heading" className="flex flex-col gap-5">
      <h2 id="learn-heading" className="text-h2">
        What you will learn
      </h2>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {learnLines.map((line) => (
          <li key={line} className="flex items-start gap-3 text-body">
            <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
      <p className="max-w-2xl">
        You should already be able to make a simple chart in a spreadsheet.{" "}
        <a href="#" className={textLink}>
          Your first charts
        </a>{" "}
        covers it.
      </p>
    </section>
  )
}

function Syllabus() {
  return (
    <section aria-labelledby="syllabus-heading" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="syllabus-heading" className="text-h2">
          Syllabus
        </h2>
        <p className={smallFigure}>{courseFacts}</p>
      </div>
      <div className="rounded-xl border border-border bg-card px-5 py-0">
        <Accordion multiple defaultValue={["module-1"]}>
          {modules.map((module, index) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger>
                <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-3">
                  <span>
                    Module {index + 1}: {module.name}
                  </span>
                  <span className={smallFigure}>
                    {count(module.lessons.length, "lesson", "lessons")} ·{" "}
                    {formatLength(sumMinutes(module.lessons))}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.number}
                      className="flex items-baseline gap-3 py-3 not-first:border-t not-first:border-border first:pt-0 last:pb-0"
                    >
                      <span className={cn(smallFigure, "w-5 shrink-0")}>
                        {lesson.number}
                      </span>
                      <span className="min-w-0 flex-1 text-body">{lesson.title}</span>
                      <span className={smallFigure}>{formatLength(lesson.minutes)}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function TeacherAndPrice() {
  const included = [
    `All ${allLessons.length} lessons of this course`,
    "The other 8 courses too",
    "A certificate when you finish",
  ]
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <section
        aria-labelledby="teacher-heading"
        className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-7"
      >
        <h2 id="teacher-heading" className="text-h2">
          Your teacher
        </h2>
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
          >
            LF
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-body font-semibold">Lena Farrow</p>
            <p className={smallFigure}>Teaches charts · 3 courses</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-2xl">
            Lena drew charts for a regional newspaper for eleven years. A chart
            there had to be right by six o'clock and clear to a reader on a bus.
          </p>
          <p className="max-w-2xl">
            She has taught at Rowlark since 2025, and she answers the questions
            under her lessons herself.
          </p>
        </div>
        <a href="/catalogue" className={cn(textLink, "self-start")}>
          All of Lena's courses
        </a>
      </section>
      <section
        aria-labelledby="price-heading"
        className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-5"
      >
        <h2 id="price-heading" className="text-h2">
          What it costs
        </h2>
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>Included in Plus</p>
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="font-heading text-display tabular-nums">$18</span>
            <span className={smallFigure}>a month</span>
          </p>
          <p className={smallFigure}>or $180 a year, which is two months free</p>
        </div>
        <ul className="flex flex-col gap-2 border-t border-border pt-5">
          {included.map((line) => (
            <li key={line} className="flex items-start gap-2 text-body">
              <Check className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col items-start gap-3">
          <a
            href="#"
            className={cn(buttonVariants({ variant: "default" }), buttonClasses, "w-full")}
          >
            Start the course
          </a>
          <a href="/plans" className={textLink}>
            Compare the plans
          </a>
        </div>
      </section>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={cn(container, "flex flex-wrap items-center justify-between gap-3 py-8")}
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
      <Header />
      <main className="flex-1">
        <div className={cn(container, "flex flex-col gap-20 pt-8 pb-20")}>
          <Opening />
          <Learn />
          <Syllabus />
          <TeacherAndPrice />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
