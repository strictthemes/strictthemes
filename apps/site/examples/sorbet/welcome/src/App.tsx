import { useRef, useState, type FormEvent, type MouseEvent } from "react"
import { Bell, Check, CircleAlert, Flame, ListChecks } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
const goodNewsBadge =
  "h-auto gap-1 rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const habits = [
  "Drink 8 glasses of water",
  "Read 10 pages",
  "Walk after lunch",
  "Stretch for 5 minutes",
  "No phone after 22:00",
]

const features = [
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

function Header() {
  return (
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
  )
}

function Preview() {
  return (
    <figure className="flex w-full flex-col gap-2 md:mx-auto md:max-w-sm">
      <div
        role="img"
        aria-label="The Mossy home screen: three of five habits done today, and a 12-day streak"
        className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-6"
      >
        <div aria-hidden="true" className="flex flex-col gap-2">
          <p className={smallFigure}>Wednesday, 11 November</p>
          <p className="font-heading text-h2 text-foreground">
            Good morning, Ines
          </p>
        </div>
        <div aria-hidden="true" className="flex flex-wrap items-center gap-3">
          <Badge className={goodNewsBadge}>
            <Flame aria-hidden="true" strokeWidth={1.5} />
            12-day streak
          </Badge>
        </div>
        {habits.map((habit, index) => {
          const done = index < 3
          return (
            <div
              key={habit}
              aria-hidden="true"
              className="flex items-center gap-3 border-t border-border pt-4"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-sm border border-border",
                  done && "bg-secondary"
                )}
              >
                {done && (
                  <Check
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-4 text-secondary-foreground"
                  />
                )}
              </span>
              <span className="min-w-0 text-body text-foreground">{habit}</span>
              <span className={cn("ml-auto shrink-0", smallFigure)}>
                {done ? "Done" : "To do"}
              </span>
            </div>
          )
        })}
      </div>
      <figcaption className="font-mono text-label text-muted-foreground md:text-center">
        What your mornings look like in Mossy
      </figcaption>
    </figure>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center justify-between gap-3 py-10"
        )}
      >
        <p className="font-heading text-h2 text-foreground">Mossy</p>
        <p className="font-mono text-label text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const signupRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [habit, setHabit] = useState(habits[0])
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)

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
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}
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
    requestAnimationFrame(() => confirmRef.current?.focus())
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(container, "flex flex-col gap-16 pt-10 pb-16")}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-x-6">
          <div className="flex flex-col gap-6 md:col-span-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-h1 text-foreground md:text-display">
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
                  "h-11 px-6 font-mono text-label"
                )}
              >
                Start for free
              </a>
              <p className={smallFigure}>Free for 5 habits · No card needed</p>
            </div>
          </div>
          <div className="md:col-span-6">
            <Preview />
          </div>
        </div>

        <section
          aria-labelledby="features-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="features-heading" className="text-h2 text-foreground">
            What Mossy does for you
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4"
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-6 text-foreground"
                />
                <h3 className="text-h2 text-foreground">{title}</h3>
                <p className="max-w-lg">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="What people say">
          <blockquote className="flex flex-col gap-4 md:max-w-3xl">
            <p className="font-heading text-h1 text-foreground">
              I wanted to read more for years. Ten pages a day did it, and the
              streak kept me honest.
            </p>
            <footer className="flex flex-wrap items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
              >
                ML
              </span>
              <div className="flex flex-col gap-2">
                <p className="text-body text-foreground">Marta Lindqvist</p>
                <p className={smallFigure}>Nurse, 41 days in a row</p>
              </div>
            </footer>
          </blockquote>
        </section>

        <section
          ref={signupRef}
          id="signup"
          aria-labelledby="signup-heading"
          className="scroll-mt-10"
        >
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6">
            <div className="flex flex-col gap-4 md:col-span-5">
              <h2 id="signup-heading" className="text-h2 text-foreground">
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
                        setErrors((current) => ({
                          ...current,
                          name: undefined,
                        }))
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
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }))
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
                    <select
                      id="first-habit"
                      name="firstHabit"
                      value={habit}
                      onChange={(event) => setHabit(event.target.value)}
                      className={cn(
                        "h-11 w-full rounded-lg border border-input bg-card px-4 text-body text-foreground",
                        focusRing
                      )}
                    >
                      {habits.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="later">I will choose later</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full px-6 font-mono text-label md:w-auto md:self-start"
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
                      className={cn("text-h2 text-foreground", codeFocusRing)}
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
      <Footer />
    </div>
  )
}

export default App
