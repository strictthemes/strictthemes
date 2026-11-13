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
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const buttonClasses = "h-11 px-6 font-mono text-label"
const labelClasses = "block font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const inputClasses = "h-11 px-4 text-body md:text-body"
const cardClasses =
  "flex flex-col gap-4 rounded-xl border border-border bg-card p-6"

const navLinks = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

const reminderTimes = Array.from({ length: 11 }, (_, i) => {
  const minutes = 6 * 60 + i * 30
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0")
  const mm = String(minutes % 60).padStart(2, "0")
  const time = `${hh}:${mm}`
  return { value: time, label: time }
})

type ReminderKey = "morning" | "evening" | "weekly" | "streak"

const reminders: { key: ReminderKey; title: string; description: string }[] = [
  {
    key: "morning",
    title: "Morning nudge",
    description: "A reminder to start your habits",
  },
  {
    key: "evening",
    title: "Evening check-in",
    description: "At 20:00, if something is left",
  },
  {
    key: "weekly",
    title: "Weekly summary",
    description: "Sundays at 18:00",
  },
  {
    key: "streak",
    title: "Streak at risk",
    description: "When your streak could end tonight",
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = Array.from(words[0])[0] ?? ""
  if (words.length === 1) return first.toUpperCase()
  const last = Array.from(words[words.length - 1])[0] ?? ""
  return (first + last).toUpperCase()
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {children}
    </p>
  )
}

function Header() {
  return (
    <header className="border-b border-border">
      <div
        className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
      >
        <a
          href="/today"
          className={`inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150 ${focusOutline}`}
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
                    className={`inline-flex h-11 items-center rounded-lg px-3 font-mono text-label transition-colors duration-150 ${focusOutline} ${
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
        className={`${container} flex flex-wrap items-center justify-between gap-3 py-10`}
      >
        <p className="font-heading text-h2">Mossy</p>
        <p className="font-mono text-label tabular-nums text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

function YouCard() {
  const [name, setName] = useState("Ines Okafor")
  const [email, setEmail] = useState("ines.okafor@example.com")
  const [profile, setProfile] = useState({
    name: "Ines Okafor",
    email: "ines.okafor@example.com",
  })
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [saved, setSaved] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextNameError = trimmedName
      ? ""
      : "Add your name, so Mossy knows what to call you."
    const nextEmailError = emailPattern.test(trimmedEmail)
      ? ""
      : "Check your email: it needs an @ and a domain."
    setNameError(nextNameError)
    setEmailError(nextEmailError)

    window.clearTimeout(timer.current)
    if (nextNameError || nextEmailError) {
      setSaved(false)
      if (nextNameError) nameRef.current?.focus()
      else emailRef.current?.focus()
      return
    }

    setProfile({ name: trimmedName, email: trimmedEmail })
    setSaved(true)
    timer.current = window.setTimeout(() => setSaved(false), 4000)
  }

  return (
    <section aria-labelledby="you-heading" className={cardClasses}>
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
        >
          {initialsOf(profile.name)}
        </div>
        <h2 id="you-heading" className="text-h2">
          You
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <Input
            ref={nameRef}
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (nameError) setNameError("")
            }}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "name-error" : undefined}
            className={inputClasses}
          />
          {nameError && <ErrorLine id="name-error">{nameError}</ErrorLine>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClasses}>
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
              if (emailError) setEmailError("")
            }}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={
              emailError ? "email-help email-error" : "email-help"
            }
            className={inputClasses}
          />
          <p id="email-help" className={smallFigure}>
            We only write to you about your account.
          </p>
          {emailError && <ErrorLine id="email-error">{emailError}</ErrorLine>}
        </div>
        <div className="flex items-center">
          <Button type="submit" className={buttonClasses}>
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
    <section aria-labelledby="reminders-heading" className={cardClasses}>
      <h2 id="reminders-heading" className="text-h2">
        Reminders
      </h2>
      <p className="max-w-lg">Changes here save as you make them.</p>
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
                className="font-sans text-body font-medium"
              >
                {reminder.title}
              </p>
              <p id={`${reminder.key}-description`} className={smallFigure}>
                {reminder.description}
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
              aria-describedby={`${reminder.key}-description`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <label
          id="reminder-time-label"
          htmlFor="reminder-time"
          className={labelClasses}
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
    <section aria-labelledby="plan-heading" className={cardClasses}>
      <h2 id="plan-heading" className="text-h2">
        Your plan
      </h2>
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="font-heading text-h1">Free</p>
        <p className={smallFigure}>5 of 5 habits in use</p>
      </div>
      <p className="max-w-lg">You are using all five habits on Free.</p>
      <a
        href="/plans"
        className={`self-start text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusOutline}`}
      >
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
    <section aria-labelledby="delete-heading" className={cardClasses}>
      <h2 id="delete-heading" className="text-h2">
        Delete your account
      </h2>
      <div>
        {!deleted && (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <p className="max-w-lg">
              This deletes your habits, your streak and all your history. It
              cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="delete-confirm" className={labelClasses}>
                Type delete to confirm
              </label>
              <Input
                id="delete-confirm"
                name="delete-confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                className={inputClasses}
              />
            </div>
            <Button
              type="submit"
              variant="destructive"
              focusableWhenDisabled
              disabled={!canDelete}
              className={`${buttonClasses} w-full hover:text-foreground md:w-auto md:self-start`}
            >
              <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Delete my account
            </Button>
          </form>
        )}
        <div role="status">
          {deleted && (
            <p
              ref={messageRef}
              tabIndex={-1}
              className={`max-w-lg ${codeFocusOutline}`}
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
      <Header />
      <main className={`${container} flex flex-col gap-10 pt-10 pb-16`}>
        <div className="flex flex-col gap-2">
          <p className={smallFigure}>
            With Mossy since <time dateTime="2026-09-02">2 September 2026</time>
          </p>
          <h1 className="text-h1">Your profile</h1>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-6">
          <div className="flex min-w-0 flex-col gap-10 md:col-span-7">
            <YouCard />
            <RemindersCard />
          </div>
          <div className="flex min-w-0 flex-col gap-10 md:col-span-5">
            <PlanCard />
            <DeleteCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
