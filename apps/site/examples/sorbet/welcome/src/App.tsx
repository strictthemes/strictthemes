import { useEffect, useRef, useState } from "react"
import type { FormEvent, MouseEvent } from "react"
import {
  Bell,
  Check,
  CircleAlert,
  Flame,
  ListChecks,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1168px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const fieldLabel = "block font-mono text-label text-muted-foreground"
const buttonClasses = "h-11 px-6 font-mono text-label"
const goodNewsBadge = cn(
  "h-auto gap-1 rounded-sm px-2 py-1 font-mono text-label",
  "border-transparent bg-tertiary text-tertiary-foreground"
)

const habits = [
  { name: "Drink 8 glasses of water", done: true },
  { name: "Read 10 pages", done: true },
  { name: "Walk after lunch", done: true },
  { name: "Stretch for 5 minutes", done: false },
  { name: "No phone after 22:00", done: false },
]

const habitOptions = [
  { value: "water", label: "Drink 8 glasses of water" },
  { value: "read", label: "Read 10 pages" },
  { value: "walk", label: "Walk after lunch" },
  { value: "stretch", label: "Stretch for 5 minutes" },
  { value: "phone", label: "No phone after 22:00" },
  { value: "later", label: "I will choose later" },
]

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ListChecks,
    title: "Tick off your day",
    text: "Pick up to five habits. Each one is a single tap when it is done.",
  },
  {
    icon: Bell,
    title: "A nudge at the right time",
    text: "Choose when Mossy reminds you. It never sends more than two a day.",
  },
  {
    icon: Flame,
    title: "See your streak grow",
    text: "Every day you finish everything adds one to your streak. Miss a day, and you start again, kindly.",
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { name?: string; email?: string }

export function App() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [habit, setHabit] = useState("water")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)

  const signupRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) confirmRef.current?.focus()
  }, [sent])

  function handleStart(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    signupRef.current?.scrollIntoView()
    if (sent) {
      confirmRef.current?.focus({ preventScroll: true })
    } else {
      nameRef.current?.focus({ preventScroll: true })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    if (!trimmedName) {
      next.name = "Add your first name so we know what to call you."
    }
    if (!emailPattern.test(trimmedEmail)) {
      next.email =
        "Check your email: it needs an @ and a domain, like ines@example.com."
    }
    setErrors(next)
    if (next.name) {
      nameRef.current?.focus()
      return
    }
    if (next.email) {
      emailRef.current?.focus()
      return
    }
    setSent({ name: trimmedName, email: trimmedEmail })
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focusRing
            )}
          >
            Mossy
          </a>
          <a
            href="#"
            className={cn(
              "ml-auto inline-flex h-11 items-center font-mono text-label",
              textLink
            )}
          >
            Sign in
          </a>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-16 pt-10 pb-16")}>
        {/* Opening */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-x-6">
          <div className="flex flex-col gap-6 md:col-span-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-h1 md:text-display">
                Small steps, every day
              </h1>
              <p className="max-w-lg">
                Mossy helps you keep a few small habits. Tick each one off when
                it is done. It takes about ten seconds a day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#signup"
                onClick={handleStart}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
              >
                Start for free
              </a>
              <p className={smallFigure}>Free for 5 habits · No card needed</p>
            </div>
          </div>

          {/* Preview of the app */}
          <figure className="flex w-full flex-col gap-2 md:col-span-6 md:mx-auto md:max-w-sm">
            <div
              role="img"
              aria-label="The Mossy home screen: three of five habits done today, and a 12-day streak"
              className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div aria-hidden="true" className="flex flex-col gap-2">
                <p className={smallFigure}>Wednesday, 11 November</p>
                <p className="font-heading text-h2">Good morning, Ines</p>
              </div>
              <div
                aria-hidden="true"
                className="flex flex-wrap items-center gap-3"
              >
                <Badge className={goodNewsBadge}>
                  <Flame aria-hidden="true" strokeWidth={1.5} />
                  12-day streak
                </Badge>
              </div>
              {habits.map((item) => (
                <div
                  key={item.name}
                  aria-hidden="true"
                  className="flex items-center gap-3 border-t border-border pt-4"
                >
                  <div
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-sm border border-border",
                      item.done && "bg-secondary"
                    )}
                  >
                    {item.done && (
                      <Check
                        strokeWidth={1.5}
                        className="size-4 text-secondary-foreground"
                      />
                    )}
                  </div>
                  <p className="min-w-0 text-body">{item.name}</p>
                  <p className={cn("ml-auto shrink-0", smallFigure)}>
                    {item.done ? "Done" : "To do"}
                  </p>
                </div>
              ))}
            </div>
            <figcaption className="font-mono text-label text-muted-foreground md:text-center">
              What your mornings look like in Mossy
            </figcaption>
          </figure>
        </div>

        {/* What it does */}
        <section
          aria-labelledby="features-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="features-heading" className="text-h2">
            What Mossy does for you
          </h2>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {features.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4"
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-6 text-foreground"
                />
                <h3 className="text-h2">{title}</h3>
                <p className="max-w-lg">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What people say */}
        <section aria-label="What people say">
          <blockquote className="flex flex-col gap-4 md:max-w-3xl">
            <p className="font-heading text-h1 text-foreground">
              I wanted to read more for years. Ten pages a day did it, and the
              streak kept me honest.
            </p>
            <footer className="flex flex-wrap items-center gap-3">
              <div
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
              >
                ML
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-body text-foreground">Marta Lindqvist</p>
                <p className={smallFigure}>Nurse, 41 days in a row</p>
              </div>
            </footer>
          </blockquote>
        </section>

        {/* Sign-up */}
        <section
          id="signup"
          ref={signupRef}
          aria-labelledby="signup-heading"
          className="scroll-mt-10"
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6">
            <div className="flex flex-col gap-4 md:col-span-5">
              <h2 id="signup-heading" className="text-h2">
                Start with one habit
              </h2>
              <p className="max-w-lg">
                You can add more habits later. Free stays free, for up to five.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:col-span-7">
              {!sent && (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="first-name" className={fieldLabel}>
                      Your first name
                    </label>
                    <Input
                      ref={nameRef}
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }))
                        }
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={
                        errors.name ? "first-name-error" : undefined
                      }
                      className="h-11 px-4 text-body md:text-body"
                    />
                    {errors.name && (
                      <p
                        id="first-name-error"
                        className="flex items-start gap-2 font-mono text-label text-destructive"
                      >
                        <CircleAlert
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4 shrink-0"
                        />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={fieldLabel}>
                      Email
                    </label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: undefined }))
                        }
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "email-help email-error" : "email-help"
                      }
                      className="h-11 px-4 text-body md:text-body"
                    />
                    <p id="email-help" className={smallFigure}>
                      We send one email to confirm, and nothing else.
                    </p>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="flex items-start gap-2 font-mono text-label text-destructive"
                      >
                        <CircleAlert
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-4 shrink-0"
                        />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="first-habit" className={fieldLabel}>
                      Your first habit
                    </label>
                    <Select
                      items={habitOptions}
                      value={habit}
                      onValueChange={(value) => {
                        if (value !== null) setHabit(value)
                      }}
                    >
                      <SelectTrigger id="first-habit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {habitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className={cn(
                      buttonClasses,
                      "w-full md:w-auto md:self-start"
                    )}
                  >
                    Create my account
                  </Button>
                </form>
              )}
              <div role="status">
                {sent && (
                  <div className="flex flex-col items-start gap-4">
                    <h3
                      ref={confirmRef}
                      tabIndex={-1}
                      className={cn("text-h2", codeFocusRing)}
                    >
                      You are in, {sent.name}
                    </h3>
                    <p className="max-w-lg">
                      We sent a link to {sent.email}. Open it on your phone and
                      your first habit is waiting.
                    </p>
                    <Badge className={goodNewsBadge}>Day 1</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-3 py-10"
          )}
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
