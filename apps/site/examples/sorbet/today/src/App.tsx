import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  Circle,
  CircleAlert,
  CircleCheck,
  PartyPopper,
  Plus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Habit = {
  id: number
  name: string
  frequency: string
  doneAt: string | null
}

const FREQUENCIES = ["Every day", "Weekdays", "Weekends", "Three times a week"]

const STARTING_HABITS: Habit[] = [
  { id: 1, name: "Drink 8 glasses of water", frequency: "Every day", doneAt: "08:12" },
  { id: 2, name: "Read 10 pages", frequency: "Every day", doneAt: null },
  { id: 3, name: "Walk after lunch", frequency: "Every day", doneAt: "13:05" },
  { id: 4, name: "Stretch for 5 minutes", frequency: "Every day", doneAt: null },
  { id: 5, name: "No phone after 22:00", frequency: "Every day", doneAt: null },
]

const CONTAINER = "mx-auto w-full max-w-[1168px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const LABEL = "block font-mono text-label text-muted-foreground"

const NAV_LINKS = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

function greetingFor(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function clockTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

function Header() {
  return (
    <header className="border-b border-border">
      <div
        className={`${CONTAINER} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
      >
        <a
          href="/today"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS}`}
        >
          Mossy
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-1">
            {NAV_LINKS.map((link) => {
              const current = link.label === "Today"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex h-11 items-center rounded-lg px-3 font-mono text-label ${FOCUS} ${
                      current
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground underline-offset-4 hover:underline"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${CONTAINER} flex flex-wrap items-center justify-between gap-3 py-10`}
      >
        <p className="font-heading text-h2">Mossy</p>
        <p className="font-mono text-label text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

function HabitCard({
  habit,
  onToggle,
}: {
  habit: Habit
  onToggle: (id: number) => void
}) {
  const done = habit.doneAt !== null
  return (
    <li className="flex flex-row items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-h2">{habit.name}</h3>
        <p className={SMALL_FIGURE}>
          {habit.frequency} ·{" "}
          {done ? (
            <>
              Done at <time dateTime={habit.doneAt!}>{habit.doneAt}</time>
            </>
          ) : (
            "Not yet"
          )}
        </p>
      </div>
      <Button
        variant={done ? "secondary" : "outline"}
        aria-pressed={done}
        aria-label={`Done: ${habit.name}`}
        onClick={() => onToggle(habit.id)}
        className="h-11 shrink-0 px-6 font-mono text-label"
      >
        {done ? (
          <CircleCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Circle className="size-4" strokeWidth={1.5} aria-hidden="true" />
        )}
        Done
      </Button>
    </li>
  )
}

function AddHabitCard({
  habits,
  onAdd,
}: {
  habits: Habit[]
  onAdd: (name: string, frequency: string) => void
}) {
  const [name, setName] = useState("")
  const [frequency, setFrequency] = useState(FREQUENCIES[0])
  const [error, setError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()
    let problem: string | null = null
    if (trimmed === "") {
      problem = 'Give your habit a name, like "Stretch for 5 minutes".'
    } else if (
      habits.some((h) => h.name.trim().toLowerCase() === trimmed.toLowerCase())
    ) {
      problem = "You already have this habit."
    }

    if (problem) {
      setError(problem)
      inputRef.current?.focus()
      return
    }

    setError(null)
    onAdd(trimmed, frequency)
    setName("")
    inputRef.current?.focus()
    setConfirmation(`Added "${trimmed}"`)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setConfirmation(null), 4000)
  }

  const describedBy = error
    ? "habit-name-helper habit-name-error"
    : "habit-name-helper"

  return (
    <section
      aria-labelledby="add-habit-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-5 md:self-start"
    >
      <h2 id="add-habit-heading" className="text-h2">
        Add a habit
      </h2>
      <p className="max-w-lg">
        Keep it small. Something you can do in two minutes is a good start.
      </p>
      <div>
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="habit-name" className={LABEL}>
              What will you do?
            </label>
            <Input
              ref={inputRef}
              id="habit-name"
              name="name"
              maxLength={40}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError(null)
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className="h-11 px-4 text-body md:text-body"
            />
            <p id="habit-name-helper" className={SMALL_FIGURE}>
              Up to 40 characters, like "Drink a glass of water"
            </p>
            {error && (
              <p
                id="habit-name-error"
                className="flex items-start gap-2 font-mono text-label text-destructive"
              >
                <CircleAlert
                  className="size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                {error}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="habit-frequency" className={LABEL}>
              How often
            </label>
            <select
              id="habit-frequency"
              name="frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className={`h-11 w-full rounded-lg border border-input bg-card px-4 text-body text-foreground ${FOCUS}`}
            >
              {FREQUENCIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="h-11 w-full px-6 font-mono text-label md:w-auto md:self-start"
          >
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Add habit
          </Button>
        </form>
        <div role="status">
          {confirmation && (
            <p className="mt-4 flex w-fit items-center gap-2 font-mono text-label text-success">
              <CircleCheck
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {confirmation}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [greeting] = useState(() => greetingFor(new Date()))
  const [habits, setHabits] = useState<Habit[]>(STARTING_HABITS)
  const nextId = useRef(STARTING_HABITS.length + 1)

  const doneCount = habits.filter((h) => h.doneAt !== null).length
  const allDone = habits.length > 0 && doneCount === habits.length

  function toggleHabit(id: number) {
    const now = clockTime(new Date())
    setHabits((current) =>
      current.map((h) =>
        h.id === id ? { ...h, doneAt: h.doneAt === null ? now : null } : h
      )
    )
  }

  function addHabit(name: string, frequency: string) {
    const id = nextId.current++
    setHabits((current) => [...current, { id, name, frequency, doneAt: null }])
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={`${CONTAINER} flex flex-col gap-10 pt-10 pb-16`}>
        <div className="flex flex-col gap-2">
          <time dateTime="2026-11-11" className={SMALL_FIGURE}>
            Wednesday, 11 November
          </time>
          <h1 className="text-h1">{greeting}, Ines</h1>
          <div className="flex items-center">
            <p className="font-heading text-h2 tabular-nums">
              {doneCount} of {habits.length} done
            </p>
            <div role="status">
              {allDone && (
                <Badge className="ml-3 h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                  <PartyPopper strokeWidth={1.5} aria-hidden="true" />
                  All done for today
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6">
          <section
            aria-labelledby="habits-heading"
            className="flex flex-col gap-6 md:col-span-7"
          >
            <h2 id="habits-heading" className="text-h2">
              Your habits
            </h2>
            <ul className="flex flex-col gap-3">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} />
              ))}
            </ul>
          </section>
          <AddHabitCard habits={habits} onAdd={addHabit} />
        </div>

        <section
          aria-label="Tip for today"
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6 md:max-w-lg"
        >
          <p className="font-mono text-label text-muted-foreground">
            Tip for today
          </p>
          <p>
            Put your book where your phone usually goes. Reading the first page
            is the hard part.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
