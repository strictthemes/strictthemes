import { useEffect, useRef, useState } from "react"
import type { FormEvent, MouseEvent } from "react"
import { ChevronLeft, CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const PAGE_TITLE =
  "About your vehicle – Apply for a resident's parking permit – Callowmere Council"

// "Today" is fixed, so the page behaves the same on any day.
const TODAY = { year: 2026, month: 11, day: 11 }
const MONTHS_AHEAD = 3

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const CONTAINER = "mx-auto max-w-[720px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const INPUT = "h-11 px-2 text-body md:text-body"

const FUEL_OPTIONS = [
  { value: "petrol-diesel", id: "fuel-petrol-diesel", label: "Petrol or diesel" },
  { value: "hybrid", id: "fuel-hybrid", label: "Hybrid" },
  { value: "electric", id: "fuel-electric", label: "Fully electric" },
]

const FOOTER_LINKS = ["Accessibility", "Privacy", "Cookies", "Contact the council"]

type DatePart = "day" | "month" | "year"
const DATE_PARTS: DatePart[] = ["day", "month", "year"]

type DateError = { message: string; parts: DatePart[] }

type Errors = {
  registration?: string
  makeModel?: string
  fuel?: string
  startDate?: DateError
}

type SummaryItem = {
  key: string
  message: string
  focusId: string
  labelId: string
}

function daysInMonth(year: number, month: number) {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    return leap ? 29 : 28
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

// The same day of the month some calendar months later, or the last day of
// that month where it is shorter.
function lastGoodDay() {
  const index = TODAY.month - 1 + MONTHS_AHEAD
  const year = TODAY.year + Math.floor(index / 12)
  const month = (index % 12) + 1
  const day = Math.min(TODAY.day, daysInMonth(year, month))
  return { year, month, day }
}

function asNumber(date: { year: number; month: number; day: number }) {
  return date.year * 10000 + date.month * 100 + date.day
}

function joinWithAnd(words: string[]) {
  return words.join(" and ")
}

function checkRegistration(value: string) {
  const copy = value.replace(/\s+/g, "").toUpperCase()
  if (copy === "") {
    return "Enter your vehicle's registration number"
  }
  if (!/^[A-Z0-9]{2,8}$/.test(copy)) {
    return "The registration number must be 2 to 8 letters and numbers, like KX19 TDV"
  }
  return undefined
}

function checkStartDate(
  values: Record<DatePart, string>
): DateError | undefined {
  const parts = {
    day: values.day.trim(),
    month: values.month.trim(),
    year: values.year.trim(),
  }
  const empty = DATE_PARTS.filter((part) => parts[part] === "")

  if (empty.length === 3) {
    return {
      message: "Enter the date you want the permit to start",
      parts: DATE_PARTS,
    }
  }
  if (empty.length > 0) {
    return {
      message: `The start date must include ${joinWithAnd(
        empty.map((part) => `a ${part}`)
      )}`,
      parts: empty,
    }
  }

  const notNumber = DATE_PARTS.find((part) => !/^\d+$/.test(parts[part]))
  if (notNumber) {
    return {
      message: `The ${notNumber} must be a number`,
      parts: [notNumber],
    }
  }

  if (parts.year.length !== 4) {
    return {
      message: "The year must have 4 numbers, like 2026",
      parts: ["year"],
    }
  }

  const date = {
    day: Number(parts.day),
    month: Number(parts.month),
    year: Number(parts.year),
  }
  const real =
    date.month >= 1 &&
    date.month <= 12 &&
    date.day >= 1 &&
    date.day <= daysInMonth(date.year, date.month)
  if (!real) {
    return { message: "The start date must be a real date", parts: DATE_PARTS }
  }

  if (asNumber(date) < asNumber(TODAY)) {
    return {
      message: "The start date must be today or later",
      parts: DATE_PARTS,
    }
  }

  const last = lastGoodDay()
  if (asNumber(date) > asNumber(last)) {
    return {
      message: `The start date must be on or before ${last.day} ${
        MONTH_NAMES[last.month - 1]
      } ${last.year}`,
      parts: DATE_PARTS,
    }
  }

  return undefined
}

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ")
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 text-body font-bold text-destructive"
    >
      <CircleAlert
        className="mt-1 size-5 shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  )
}

export function App() {
  const [registration, setRegistration] = useState("")
  const [makeModel, setMakeModel] = useState("")
  const [fuel, setFuel] = useState("")
  const [startDate, setStartDate] = useState<Record<DatePart, string>>({
    day: "",
    month: "",
    year: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [summary, setSummary] = useState<SummaryItem[] | null>(null)
  const [message, setMessage] = useState("")

  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = summary ? `Error: ${PAGE_TITLE}` : PAGE_TITLE
    if (summary) {
      summaryRef.current?.focus()
    }
  }, [summary])

  function clearError(field: keyof Errors) {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: Errors = {}
    const items: SummaryItem[] = []

    const registrationError = checkRegistration(registration)
    if (registrationError) {
      next.registration = registrationError
      items.push({
        key: "registration",
        message: registrationError,
        focusId: "registration",
        labelId: "registration-label",
      })
    }

    if (makeModel.trim() === "") {
      next.makeModel = "Enter the make and model of your vehicle"
      items.push({
        key: "makeModel",
        message: next.makeModel,
        focusId: "make-model",
        labelId: "make-model-label",
      })
    }

    if (fuel === "") {
      next.fuel = "Select what your vehicle runs on"
      items.push({
        key: "fuel",
        message: next.fuel,
        focusId: FUEL_OPTIONS[0].id,
        labelId: "fuel-legend",
      })
    }

    const dateError = checkStartDate(startDate)
    if (dateError) {
      next.startDate = dateError
      items.push({
        key: "startDate",
        message: dateError.message,
        focusId: `start-${dateError.parts[0]}`,
        labelId: "start-legend",
      })
    }

    setErrors(next)
    if (items.length > 0) {
      setSummary(items)
      setMessage("")
    } else {
      setSummary(null)
      setMessage(
        "Your vehicle details are saved. In the full service, the next step would open now."
      )
    }
  }

  function goToField(event: MouseEvent<HTMLAnchorElement>, item: SummaryItem) {
    event.preventDefault()
    document.getElementById(item.focusId)?.focus({ preventScroll: true })
    document.getElementById(item.labelId)?.scrollIntoView()
  }

  const dateError = errors.startDate
  const dateDescribedBy = describedBy(
    "start-hint",
    dateError && "start-error"
  )

  return (
    <div className="bg-background text-body text-foreground">
      <a
        href="#main"
        className={cn(
          "sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2",
          FOCUS
        )}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div
          className={cn(
            CONTAINER,
            "flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
          )}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground no-underline underline-offset-4 hover:underline",
              FOCUS
            )}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={cn(
              "text-body font-bold text-foreground no-underline underline-offset-4 hover:underline",
              FOCUS
            )}
          >
            Apply for a resident&apos;s parking permit
          </a>
        </div>
      </header>

      <main id="main" className={cn(CONTAINER, "pt-10 pb-16")}>
        <p>
          <a
            href="#"
            className={cn(
              "inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
              FOCUS
            )}
          >
            <ChevronLeft
              className="size-5"
              strokeWidth={2}
              aria-hidden="true"
            />
            Back
          </a>
        </p>

        {summary && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            aria-labelledby="error-summary-title"
            className="mt-6 rounded-xl border-2 border-destructive bg-background p-6 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            <p id="error-summary-title" className="font-heading text-h2">
              Your answers need a change
            </p>
            <ul className="mt-4 list-none p-0">
              {summary.map((item, index) => (
                <li key={item.key} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${item.focusId}`}
                    onClick={(event) => goToField(event, item)}
                    className={cn(
                      "font-bold text-destructive underline underline-offset-4",
                      FOCUS
                    )}
                  >
                    {item.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 font-mono text-label text-muted-foreground">
          Step 2 of 3
        </p>
        <h1 className="mt-2 text-h1">About your vehicle</h1>
        <p className="mt-6">
          Your permit is linked to your vehicle&apos;s registration number, so
          there is nothing to put in the windscreen.
        </p>

        <div className="mt-10">
          <form noValidate onSubmit={handleSubmit}>
            <div
              className={cn(
                errors.registration && "border-l-4 border-destructive pl-4"
              )}
            >
              <label
                id="registration-label"
                htmlFor="registration"
                className="block text-body font-bold text-foreground"
              >
                Vehicle registration number
              </label>
              <p id="registration-hint" className="mt-1 text-muted-foreground">
                This is on the number plate, for example KX19 TDV.
              </p>
              {errors.registration && (
                <ErrorLine id="registration-error">
                  {errors.registration}
                </ErrorLine>
              )}
              <Input
                id="registration"
                name="registration"
                type="text"
                className={cn(INPUT, "mt-2 w-48")}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={registration}
                onChange={(event) => {
                  setRegistration(event.target.value)
                  clearError("registration")
                }}
                aria-invalid={errors.registration ? true : undefined}
                aria-describedby={describedBy(
                  "registration-hint",
                  errors.registration && "registration-error"
                )}
              />
            </div>

            <div
              className={cn(
                "mt-6",
                errors.makeModel && "border-l-4 border-destructive pl-4"
              )}
            >
              <label
                id="make-model-label"
                htmlFor="make-model"
                className="block text-body font-bold text-foreground"
              >
                Make and model
              </label>
              <p id="make-model-hint" className="mt-1 text-muted-foreground">
                For example, Velmar Arden.
              </p>
              {errors.makeModel && (
                <ErrorLine id="make-model-error">{errors.makeModel}</ErrorLine>
              )}
              <Input
                id="make-model"
                name="makeModel"
                type="text"
                className={cn(INPUT, "mt-2 w-full md:w-96")}
                autoComplete="off"
                value={makeModel}
                onChange={(event) => {
                  setMakeModel(event.target.value)
                  clearError("makeModel")
                }}
                aria-invalid={errors.makeModel ? true : undefined}
                aria-describedby={describedBy(
                  "make-model-hint",
                  errors.makeModel && "make-model-error"
                )}
              />
            </div>

            <div
              className={cn(
                "mt-6",
                errors.fuel && "border-l-4 border-destructive pl-4"
              )}
            >
              <RadioGroup
                render={<fieldset />}
                className="m-0 min-w-0 border-0 p-0"
                name="fuel"
                value={fuel}
                onValueChange={(value) => {
                  setFuel(String(value))
                  clearError("fuel")
                }}
                aria-labelledby="fuel-legend"
                aria-describedby={describedBy(
                  "fuel-hint",
                  errors.fuel && "fuel-error"
                )}
                aria-invalid={errors.fuel ? true : undefined}
              >
                <legend
                  id="fuel-legend"
                  className="p-0 text-body font-bold text-foreground"
                >
                  What does the vehicle run on?
                </legend>
                <p id="fuel-hint" className="mt-1 text-muted-foreground">
                  This sets the price. Electric vehicles cost less.
                </p>
                {errors.fuel && (
                  <ErrorLine id="fuel-error">{errors.fuel}</ErrorLine>
                )}
                {FUEL_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="mt-2 flex min-h-11 items-center gap-4"
                  >
                    <RadioGroupItem value={option.value} id={option.id} />
                    <label htmlFor={option.id} className="text-body">
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div
              className={cn(
                "mt-6",
                dateError && "border-l-4 border-destructive pl-4"
              )}
            >
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend
                  id="start-legend"
                  className="p-0 text-body font-bold text-foreground"
                >
                  When do you want the permit to start?
                </legend>
                <p id="start-hint" className="mt-1 text-muted-foreground">
                  It can start today or on any day in the next 3 months. For
                  example, 1 12 2026.
                </p>
                {dateError && (
                  <ErrorLine id="start-error">{dateError.message}</ErrorLine>
                )}
                <div className="mt-2 flex flex-wrap items-end gap-4">
                  {DATE_PARTS.map((part) => (
                    <div key={part}>
                      <label
                        htmlFor={`start-${part}`}
                        className="block text-body text-foreground"
                      >
                        {part === "day"
                          ? "Day"
                          : part === "month"
                            ? "Month"
                            : "Year"}
                      </label>
                      <Input
                        id={`start-${part}`}
                        name={`start-${part}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        className={cn(
                          INPUT,
                          "mt-2",
                          part === "year" ? "w-24" : "w-16"
                        )}
                        value={startDate[part]}
                        onChange={(event) => {
                          setStartDate((current) => ({
                            ...current,
                            [part]: event.target.value,
                          }))
                          clearError("startDate")
                        }}
                        aria-invalid={
                          dateError?.parts.includes(part) ? true : undefined
                        }
                        aria-describedby={dateDescribedBy}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-10">
              <Button
                type="submit"
                className="h-11 w-full px-6 font-mono text-label md:w-auto"
              >
                Save and continue
              </Button>
            </div>
          </form>

          <div role="status">
            {message && (
              <p className="mt-6 text-body text-foreground">{message}</p>
            )}
          </div>
        </div>

        <section
          aria-labelledby="help-heading"
          className="mt-16 border-t border-border pt-6"
        >
          <h2 id="help-heading" className="text-h2">
            Help with this form
          </h2>
          <p className="mt-4">
            If you cannot find your registration number, it is on the
            vehicle&apos;s registration document.
          </p>
          <p className="mt-4">
            Call the parking team on{" "}
            <a href="tel:01632960418" className={TEXT_LINK}>
              01632 960 418
            </a>
            . The phone line is open Monday to Friday, 9am to 5pm.
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={cn(CONTAINER, "py-10")}>
          <nav aria-label="Footer">
            <ul className="flex list-none flex-wrap gap-x-6 p-0">
              {FOOTER_LINKS.map((name) => (
                <li key={name}>
                  <a href="#" className={cn(TEXT_LINK, "inline-block py-2")}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-6 text-muted-foreground">
            Callowmere Council, Guildhall, Market Street, Callowmere CM1 1AA
          </p>
          <p className="mt-2 text-muted-foreground">
            © Callowmere Council 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
