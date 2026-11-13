import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert, CircleCheck, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const container = "mx-auto max-w-[1168px] px-4 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`
const labelClass = "block font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const inputClass = "h-11 px-4 text-body md:text-body"
const errorClass = "flex items-start gap-2 font-mono text-label text-destructive"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const navLinks = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

const reminderTimes = Array.from({ length: 11 }, (_, i) => {
  const minutes = 6 * 60 + i * 30
  const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
  return { value, label: value }
})

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

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ""
  return (first + last).toUpperCase()
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className={errorClass}>
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {children}
    </p>
  )
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div
        className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
      >
        <a
          href="/today"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusRing}`}
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
                    className={`inline-flex h-11 items-center rounded-lg px-3 font-mono text-label ${focusRing} ${
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

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-wrap items-center justify-between gap-3 py-10`}
      >
        <p className="font-heading text-h2 text-foreground">Mossy</p>
        <p className="font-mono text-label text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

function YouCard() {
  const [name, setName] = useState("Ines Okafor")
  const [email, setEmail] = useState("ines.okafor@example.com")
  const [savedName, setSavedName] = useState("Ines Okafor")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [saved, setSaved] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.clearTimeout(timer.current)

    const nextName = name.trim()
    const nextEmail = email.trim()
    const nextErrors: { name?: string; email?: string } = {}
    if (!nextName) {
      nextErrors.name = "Add your name, so Mossy knows what to call you."
    }
    if (!EMAIL_PATTERN.test(nextEmail)) {
      nextErrors.email = "Check your email: it needs an @ and a domain."
    }
    setErrors(nextErrors)

    if (nextErrors.name || nextErrors.email) {
      setSaved(false)
      if (nextErrors.name) nameRef.current?.focus()
      else emailRef.current?.focus()
      return
    }

    setName(nextName)
    setEmail(nextEmail)
    setSavedName(nextName)
    setSaved(true)
    timer.current = window.setTimeout(() => setSaved(false), 4000)
  }

  return (
    <section
      aria-labelledby="you-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
        >
          {initialsOf(savedName)}
        </div>
        <h2 id="you-heading" className="text-h2 text-foreground">
          You
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <Input
            ref={nameRef}
            id="name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setErrors((current) => ({ ...current, name: undefined }))
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
          />
          {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <Input
            ref={emailRef}
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "email-help email-error" : "email-help"
            }
            className={inputClass}
          />
          <p id="email-help" className={smallFigure}>
            We only write to you about your account.
          </p>
          {errors.email && (
            <FieldError id="email-error">{errors.email}</FieldError>
          )}
        </div>
        <div className="flex items-center">
          <Button type="submit" className="h-11 px-6 font-mono text-label">
            Save changes
          </Button>
          <div role="status">
            {saved && (
              <p className="ml-3 flex w-fit items-center gap-2 font-mono text-label text-success">
                <CircleCheck
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
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
  const [enabled, setEnabled] = useState<Record<ReminderKey, boolean>>({
    morning: true,
    evening: true,
    weekly: false,
    streak: true,
  })
  const [time, setTime] = useState("08:00")
  const morningOn = enabled.morning

  return (
    <section
      aria-labelledby="reminders-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <h2 id="reminders-heading" className="text-h2 text-foreground">
        Reminders
      </h2>
      <p className="max-w-lg text-foreground">
        Changes here save as you make them.
      </p>
      <div className="flex flex-col">
        {reminders.map((reminder, index) => (
          <div
            key={reminder.key}
            className={`flex min-h-11 items-center justify-between gap-4 py-3 ${
              index > 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="flex min-w-0 flex-col gap-2">
              <p
                id={`${reminder.key}-title`}
                className="font-sans text-body font-medium text-foreground"
              >
                {reminder.title}
              </p>
              <p id={`${reminder.key}-detail`} className={smallFigure}>
                {reminder.detail}
              </p>
            </div>
            <Switch
              checked={enabled[reminder.key]}
              onCheckedChange={(checked) =>
                setEnabled((current) => ({
                  ...current,
                  [reminder.key]: checked,
                }))
              }
              aria-labelledby={`${reminder.key}-title`}
              aria-describedby={`${reminder.key}-detail`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <label
          id="reminder-time-label"
          htmlFor="reminder-time"
          className={labelClass}
        >
          Morning reminder time
        </label>
        <div className="w-full md:w-40">
          <Select
            items={reminderTimes}
            value={time}
            onValueChange={(value) => {
              if (value !== null) setTime(value)
            }}
            disabled={!morningOn}
          >
            <SelectTrigger
              id="reminder-time"
              aria-labelledby="reminder-time-label"
              aria-describedby="reminder-time-help"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTimes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p id="reminder-time-help" className={smallFigure}>
          {morningOn
            ? "When Mossy sends your morning nudge"
            : "Turn on Morning nudge to choose a time."}
        </p>
      </div>
    </section>
  )
}

function PlanCard() {
  return (
    <section
      aria-labelledby="plan-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <h2 id="plan-heading" className="text-h2 text-foreground">
        Your plan
      </h2>
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="font-heading text-h1 tabular-nums text-foreground">
          Free
        </p>
        <p className={smallFigure}>5 of 5 habits in use</p>
      </div>
      <p className="max-w-lg text-foreground">
        You are using all five habits on Free.
      </p>
      <a href="/plans" className={`self-start ${textLink}`}>
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canDelete) return
    setDeleted(true)
  }

  return (
    <section
      aria-labelledby="delete-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
    >
      <h2 id="delete-heading" className="text-h2 text-foreground">
        Delete your account
      </h2>
      <div>
        {!deleted && (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <p className="max-w-lg text-body text-foreground">
              This deletes your habits, your streak and all your history. It
              cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="delete-confirm" className={labelClass}>
                Type delete to confirm
              </label>
              <Input
                id="delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                className={inputClass}
              />
            </div>
            <Button
              type="submit"
              variant="destructive"
              focusableWhenDisabled
              disabled={!canDelete}
              className="h-11 w-full px-6 font-mono text-label hover:text-foreground md:w-auto md:self-start"
            >
              <Trash2 strokeWidth={1.5} aria-hidden="true" />
              Delete my account
            </Button>
          </form>
        )}
        <div role="status">
          {deleted && (
            <p
              ref={messageRef}
              tabIndex={-1}
              className={`text-body text-foreground ${codeFocusRing}`}
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
      <main className={`${container} flex flex-col gap-10 pt-10 pb-16`}>
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>
            With Mossy since <time dateTime="2026-09-02">2 September 2026</time>
          </p>
          <h1 className="text-h1 text-foreground">Your profile</h1>
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
