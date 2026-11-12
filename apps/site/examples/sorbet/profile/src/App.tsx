import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, CircleCheck, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
const buttonClasses = "h-11 px-6 font-mono text-label"
const inputClasses = "h-11 px-4 text-body md:text-body"
const fieldLabel = "block font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const errorLine = "flex items-start gap-2 font-mono text-label text-destructive"
const card = "flex flex-col gap-4 rounded-xl border border-border bg-card p-6"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const navLinks = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

type ReminderKey = "morning" | "evening" | "weekly" | "streak"

const reminders: { key: ReminderKey; title: string; detail: string }[] = [
  {
    key: "morning",
    title: "Morning nudge",
    detail: "A reminder to start your habits",
  },
  {
    key: "evening",
    title: "Evening check-in",
    detail: "At 20:00, if something is left",
  },
  { key: "weekly", title: "Weekly summary", detail: "Sundays at 18:00" },
  {
    key: "streak",
    title: "Streak at risk",
    detail: "When your streak could end tonight",
  },
]

const reminderTimes = Array.from({ length: 11 }, (_, i) => {
  const minutes = 6 * 60 + i * 30
  const h = String(Math.floor(minutes / 60)).padStart(2, "0")
  const m = String(minutes % 60).padStart(2, "0")
  return `${h}:${m}`
})

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/today"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground",
            focusRing
          )}
        >
          Mossy
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-1">
            {navLinks.map((link) => {
              const current = link.href === "/profile"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-lg px-3 font-mono text-label",
                      current
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground underline-offset-4 hover:underline",
                      focusRing
                    )}
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

function SiteFooter() {
  return (
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
  )
}

function YouCard() {
  const [saved, setSaved] = useState({
    name: "Ines Okafor",
    email: "ines.okafor@example.com",
  })
  const [name, setName] = useState(saved.name)
  const [email, setEmail] = useState(saved.email)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [showSaved, setShowSaved] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: { name?: string; email?: string } = {}
    if (name.trim() === "") {
      next.name = "Add your name, so Mossy knows what to call you."
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Check your email: it needs an @ and a domain."
    }
    setErrors(next)
    if (next.name || next.email) {
      window.clearTimeout(timerRef.current)
      setShowSaved(false)
      if (next.name) nameRef.current?.focus()
      else emailRef.current?.focus()
      return
    }
    setSaved({ name: name.trim(), email: email.trim() })
    setShowSaved(true)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setShowSaved(false), 4000)
  }

  return (
    <section aria-labelledby="you-heading" className={card}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
        >
          {initialsOf(saved.name)}
        </span>
        <h2 id="you-heading" className="text-h2">
          You
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={fieldLabel}>
            Name
          </label>
          <Input
            ref={nameRef}
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClasses}
          />
          {errors.name && (
            <p id="name-error" className={errorLine}>
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
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "email-help email-error" : "email-help"
            }
            className={inputClasses}
          />
          <p id="email-help" className={smallFigure}>
            We only write to you about your account.
          </p>
          {errors.email && (
            <p id="email-error" className={errorLine}>
              <CircleAlert
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 shrink-0"
              />
              {errors.email}
            </p>
          )}
        </div>
        <div className="flex items-center">
          <Button type="submit" className={buttonClasses}>
            Save changes
          </Button>
          <div role="status">
            {showSaved && (
              <p className="ml-3 flex w-fit items-center gap-2 font-mono text-label text-success">
                <CircleCheck
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4"
                />
                Saved
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}

function RemindersCard() {
  const [on, setOn] = useState<Record<ReminderKey, boolean>>({
    morning: true,
    evening: true,
    weekly: false,
    streak: true,
  })
  const [time, setTime] = useState("08:00")

  return (
    <section aria-labelledby="reminders-heading" className={card}>
      <h2 id="reminders-heading" className="text-h2">
        Reminders
      </h2>
      <p className="max-w-lg">Changes here save as you make them.</p>
      <div className="flex flex-col">
        {reminders.map((reminder, index) => (
          <div
            key={reminder.key}
            className={cn(
              "flex min-h-11 items-center justify-between gap-4 py-3",
              index > 0 && "border-t border-border"
            )}
          >
            <div className="flex min-w-0 flex-col gap-2">
              <p
                id={`${reminder.key}-title`}
                className="font-sans text-body font-medium"
              >
                {reminder.title}
              </p>
              <p id={`${reminder.key}-detail`} className={smallFigure}>
                {reminder.detail}
              </p>
            </div>
            <Switch
              checked={on[reminder.key]}
              onCheckedChange={(checked) =>
                setOn((prev) => ({ ...prev, [reminder.key]: checked }))
              }
              aria-labelledby={`${reminder.key}-title`}
              aria-describedby={`${reminder.key}-detail`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="reminder-time" className={fieldLabel}>
          Morning reminder time
        </label>
        <div className="w-full md:w-40">
          <select
            id="reminder-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!on.morning}
            aria-describedby="reminder-time-help"
            className={cn(
              "h-11 w-full rounded-lg border border-input bg-card px-4 text-body text-foreground tabular-nums disabled:opacity-50",
              focusRing
            )}
          >
            {reminderTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <p id="reminder-time-help" className={smallFigure}>
          {on.morning
            ? "When Mossy sends your morning nudge"
            : "Turn on Morning nudge to choose a time."}
        </p>
      </div>
    </section>
  )
}

function PlanCard() {
  return (
    <section aria-labelledby="plan-heading" className={card}>
      <h2 id="plan-heading" className="text-h2">
        Your plan
      </h2>
      <p className="flex flex-wrap items-baseline gap-2">
        <span className="font-heading text-h1 tabular-nums">Free</span>
        <span className={smallFigure}>5 of 5 habits in use</span>
      </p>
      <p className="max-w-lg">You are using all five habits on Free.</p>
      <a href="/plans" className={cn(textLink, "self-start")}>
        See plans
      </a>
    </section>
  )
}

function DeleteCard() {
  const [confirmText, setConfirmText] = useState("")
  const [deleted, setDeleted] = useState(false)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const canDelete = confirmText.trim().toLowerCase() === "delete"

  useEffect(() => {
    if (deleted) messageRef.current?.focus()
  }, [deleted])

  return (
    <section aria-labelledby="delete-heading" className={card}>
      <h2 id="delete-heading" className="text-h2">
        Delete your account
      </h2>
      <div>
        {!deleted && (
          <div className="flex flex-col gap-4">
            <p className="max-w-lg">
              This deletes your habits, your streak and all your history. It
              cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="delete-confirm" className={fieldLabel}>
                Type delete to confirm
              </label>
              <Input
                id="delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={inputClasses}
              />
            </div>
            <Button
              variant="destructive"
              focusableWhenDisabled
              disabled={!canDelete}
              onClick={() => setDeleted(true)}
              className={cn(
                buttonClasses,
                "w-full hover:text-foreground md:w-auto md:self-start"
              )}
            >
              <Trash2 aria-hidden="true" strokeWidth={1.5} className="size-4" />
              Delete my account
            </Button>
          </div>
        )}
        <div role="status">
          {deleted && (
            <p
              ref={messageRef}
              tabIndex={-1}
              className={cn("max-w-lg", codeFocusRing)}
            >
              This is where your account would be deleted.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />
      <main className={cn(container, "flex flex-col gap-10 pt-10 pb-16")}>
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>
            With Mossy since <time dateTime="2026-09-02">2 September 2026</time>
          </p>
          <h1 className="text-h1">Your profile</h1>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6">
          <div className="flex flex-col gap-10 md:col-span-7">
            <YouCard />
            <RemindersCard />
          </div>
          <div className="flex flex-col gap-10 md:col-span-5">
            <PlanCard />
            <DeleteCard />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
