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
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1168px] px-4 md:px-6"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const buttonClasses = "h-11 px-6 font-mono text-label"
const inputClasses = "h-11 px-4 text-body md:text-body"
const labelClasses = "block font-mono text-label text-muted-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const cardClasses =
  "flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
const textLink =
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground"

const navLinks = [
  { label: "Today", href: "/today" },
  { label: "Progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
  { label: "Profile", href: "/profile" },
]

const reminderTimes = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
].map((time) => ({ value: time, label: time }))

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function FieldError({ id, children }: { id: string; children: string }) {
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
      <span>{children}</span>
    </p>
  )
}

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
          href="/today"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground",
            focusOutline
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
                      focusOutline
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

function YouCard() {
  const [savedName, setSavedName] = useState("Ines Okafor")
  const [name, setName] = useState("Ines Okafor")
  const [email, setEmail] = useState("ines.okafor@example.com")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [saved, setSaved] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: { name?: string; email?: string } = {}
    if (name.trim() === "") {
      next.name = "Add your name, so Mossy knows what to call you."
    }
    if (!emailPattern.test(email.trim())) {
      next.email = "Check your email: it needs an @ and a domain."
    }
    setErrors(next)
    window.clearTimeout(timer.current)
    if (next.name || next.email) {
      setSaved(false)
      if (next.name) nameRef.current?.focus()
      else emailRef.current?.focus()
      return
    }
    setSavedName(name.trim())
    setName(name.trim())
    setEmail(email.trim())
    setSaved(true)
    timer.current = window.setTimeout(() => setSaved(false), 4000)
  }

  return (
    <section aria-labelledby="you-heading" className={cardClasses}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
        >
          {initialsOf(savedName)}
        </span>
        <h2 id="you-heading" className="text-h2">
          You
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="profile-name" className={labelClasses}>
            Name
          </label>
          <Input
            ref={nameRef}
            id="profile-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            className={inputClasses}
          />
          {errors.name && (
            <FieldError id="profile-name-error">{errors.name}</FieldError>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="profile-email" className={labelClasses}>
            Email
          </label>
          <Input
            ref={emailRef}
            id="profile-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email
                ? "profile-email-help profile-email-error"
                : "profile-email-help"
            }
            className={inputClasses}
          />
          <p id="profile-email-help" className={smallFigure}>
            We only write to you about your account.
          </p>
          {errors.email && (
            <FieldError id="profile-email-error">{errors.email}</FieldError>
          )}
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
  const [settings, setSettings] = useState<Record<ReminderKey, boolean>>({
    morning: true,
    evening: true,
    weekly: false,
    streak: true,
  })
  const [time, setTime] = useState("08:00")
  const morningOn = settings.morning

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
            className={cn(
              "flex min-h-11 items-center justify-between gap-4 py-3",
              index > 0 && "border-t border-border"
            )}
          >
            <div className="flex min-w-0 flex-col gap-2">
              <p
                id={`reminder-${reminder.key}-title`}
                className="font-sans text-body font-medium"
              >
                {reminder.title}
              </p>
              <p id={`reminder-${reminder.key}-detail`} className={smallFigure}>
                {reminder.detail}
              </p>
            </div>
            <Switch
              checked={settings[reminder.key]}
              onCheckedChange={(checked) =>
                setSettings((current) => ({
                  ...current,
                  [reminder.key]: checked,
                }))
              }
              aria-labelledby={`reminder-${reminder.key}-title`}
              aria-describedby={`reminder-${reminder.key}-detail`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <label htmlFor="reminder-time" className={labelClasses}>
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
              aria-describedby="reminder-time-help"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTimes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
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
        <p className="font-heading text-h1 tabular-nums">Free</p>
        <p className={smallFigure}>5 of 5 habits in use</p>
      </div>
      <p className="max-w-lg">You are using all five habits on Free.</p>
      <a href="/plans" className={cn("self-start", textLink, focusOutline)}>
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
    if (canDelete) setDeleted(true)
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
                name="confirm"
                autoComplete="off"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                className={inputClasses}
              />
            </div>
            <Button
              type="submit"
              variant="destructive"
              disabled={!canDelete}
              focusableWhenDisabled
              className={cn(
                buttonClasses,
                "w-full hover:text-foreground md:w-auto md:self-start"
              )}
            >
              <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Delete my account
            </Button>
          </form>
        )}
        <div role="status">
          {deleted && (
            <p ref={messageRef} tabIndex={-1} className={codeFocusOutline}>
              This is where your account would be deleted.
            </p>
          )}
        </div>
      </div>
    </section>
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
        <p className="font-heading text-h2">Mossy</p>
        <p className="font-mono text-label text-muted-foreground">
          Mossy · Made for small, daily steps · 2026
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
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
      <Footer />
    </div>
  )
}

export default App
