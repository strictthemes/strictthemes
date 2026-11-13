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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Habit = {
  id: number
  name: string
  frequency: string
  doneAt: string | null
}

const frequencies = [
  { value: "every-day", label: "Every day" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "three-times-a-week", label: "Three times a week" },
]

const initialHabits: Habit[] = [
  {
    id: 1,
    name: "Drink 8 glasses of water",
    frequency: "Every day",
    doneAt: "08:12",
  },
  { id: 2, name: "Read 10 pages", frequency: "Every day", doneAt: null },
  { id: 3, name: "Walk after lunch", frequency: "Every day", doneAt: "13:05" },
  {
    id: 4,
    name: "Stretch for 5 minutes",
    frequency: "Every day",
    doneAt: null,
  },
  { id: 5, name: "No phone after 22:00", frequency: "Every day", doneAt: null },
]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinks = [
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

function currentTime() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

const containerClasses = "mx-auto max-w-[1168px] px-4 md:px-6"

export function App() {
  const [greeting] = useState(() => greetingFor(new Date()))
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [name, setName] = useState("")
  const [frequency, setFrequency] = useState("every-day")
  const [nameError, setNameError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const nextId = useRef(initialHabits.length + 1)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const doneCount = habits.filter((habit) => habit.doneAt !== null).length
  const allDone = habits.length > 0 && doneCount === habits.length

  function toggleHabit(id: number) {
    setHabits((list) =>
      list.map((habit) =>
        habit.id === id
          ? { ...habit, doneAt: habit.doneAt ? null : currentTime() }
          : habit
      )
    )
  }

  function clearConfirmation() {
    window.clearTimeout(timerRef.current)
    setConfirmation(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()

    let error: string | null = null
    if (trimmed === "") {
      error = 'Give your habit a name, like "Stretch for 5 minutes".'
    } else if (
      habits.some(
        (habit) => habit.name.trim().toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      error = "You already have this habit."
    }

    if (error) {
      setNameError(error)
      clearConfirmation()
      nameRef.current?.focus()
      return
    }

    const label =
      frequencies.find((item) => item.value === frequency)?.label ?? "Every day"
    setHabits((list) => [
      ...list,
      { id: nextId.current++, name: trimmed, frequency: label, doneAt: null },
    ])
    setName("")
    setNameError(null)
    nameRef.current?.focus()

    window.clearTimeout(timerRef.current)
    setConfirmation(`Added "${trimmed}"`)
    timerRef.current = window.setTimeout(() => setConfirmation(null), 4000)
  }

  const nameDescribedBy = nameError
    ? "habit-name-help habit-name-error"
    : "habit-name-help"

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={`${containerClasses} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
        >
          <a
            href="/today"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150 ${focusRing}`}
          >
            Mossy
          </a>
          <nav aria-label="Main" className="w-full md:w-auto">
            <ul className="flex gap-1">
              {navLinks.map((link) => {
                const current = link.href === "/today"
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={`inline-flex h-11 items-center rounded-lg px-3 font-mono text-label transition-colors duration-150 ${focusRing} ${
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

      <main className={`${containerClasses} flex flex-col gap-10 pt-10 pb-16`}>
        <div className="flex flex-col gap-2">
          <time
            dateTime="2026-11-11"
            className="font-mono text-label text-muted-foreground tabular-nums"
          >
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
                  <PartyPopper aria-hidden="true" strokeWidth={1.5} />
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
              {habits.map((habit) => {
                const done = habit.doneAt !== null
                return (
                  <li
                    key={habit.id}
                    className="flex flex-row items-center gap-4 rounded-xl border border-border bg-card p-6"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <h3 className="text-h2 wrap-break-word">{habit.name}</h3>
                      <p className="font-mono text-label text-muted-foreground tabular-nums">
                        {habit.frequency} ·{" "}
                        {done ? (
                          <>
                            Done at{" "}
                            <time dateTime={habit.doneAt!}>{habit.doneAt}</time>
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
                      onClick={() => toggleHabit(habit.id)}
                      className="h-11 shrink-0 px-6 font-mono text-label"
                    >
                      {done ? (
                        <CircleCheck
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4"
                        />
                      ) : (
                        <Circle
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4"
                        />
                      )}
                      Done
                    </Button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section
            aria-labelledby="add-heading"
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-5 md:self-start"
          >
            <h2 id="add-heading" className="text-h2">
              Add a habit
            </h2>
            <p className="max-w-lg">
              Keep it small. Something you can do in two minutes is a good
              start.
            </p>
            <div>
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="habit-name"
                    className="block font-mono text-label text-muted-foreground"
                  >
                    What will you do?
                  </label>
                  <Input
                    ref={nameRef}
                    id="habit-name"
                    name="habit-name"
                    maxLength={40}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      setNameError(null)
                    }}
                    aria-invalid={nameError ? true : undefined}
                    aria-describedby={nameDescribedBy}
                    className="h-11 px-4 text-body md:text-body"
                  />
                  <p
                    id="habit-name-help"
                    className="font-mono text-label text-muted-foreground tabular-nums"
                  >
                    Up to 40 characters, like "Drink a glass of water"
                  </p>
                  {nameError && (
                    <p
                      id="habit-name-error"
                      className="flex items-start gap-2 font-mono text-label text-destructive"
                    >
                      <CircleAlert
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-4 shrink-0"
                      />
                      {nameError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    id="habit-frequency-label"
                    htmlFor="habit-frequency"
                    className="block font-mono text-label text-muted-foreground"
                  >
                    How often
                  </label>
                  <Select
                    items={frequencies}
                    value={frequency}
                    onValueChange={(value) => {
                      if (value !== null) setFrequency(value)
                    }}
                  >
                    <SelectTrigger
                      id="habit-frequency"
                      aria-labelledby="habit-frequency-label"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full px-6 font-mono text-label md:w-auto md:self-start"
                >
                  <Plus
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4"
                  />
                  Add habit
                </Button>
              </form>
              <div role="status">
                {confirmation && (
                  <p className="mt-4 flex w-fit max-w-full items-center gap-2 font-mono text-label text-success">
                    <CircleCheck
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="size-4 shrink-0"
                    />
                    <span className="min-w-0 wrap-break-word">
                      {confirmation}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <section
          aria-label="Tip for today"
          className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6 md:max-w-lg"
        >
          <p className="font-mono text-label text-muted-foreground">
            Tip for today
          </p>
          <p className="max-w-lg">
            Put your book where your phone usually goes. Reading the first page
            is the hard part.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={`${containerClasses} flex flex-wrap items-center justify-between gap-3 py-10`}
        >
          <p className="font-heading text-h2">Mossy</p>
          <p className="font-mono text-label text-muted-foreground">
            Mossy · Made for small, daily steps · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
