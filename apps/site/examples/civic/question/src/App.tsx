import * as React from "react"
import { ChevronLeft, CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const PAGE_HEADING = "About your vehicle"
const PAGE_TITLE = `${PAGE_HEADING} – Apply for a resident's parking permit – Callowmere Council`

// "Today" is fixed so the page behaves the same on any day.
const TODAY = { year: 2026, month: 11, day: 11 }

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CODE_FOCUS =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const TEXT_LINK = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const INPUT = "block h-11 px-2 text-body md:text-body"

const MONTHS = [
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

const FUEL_OPTIONS = [
  { value: "petrol-diesel", id: "fuel-petrol-diesel", label: "Petrol or diesel" },
  { value: "hybrid", id: "fuel-hybrid", label: "Hybrid" },
  { value: "electric", id: "fuel-electric", label: "Fully electric" },
]

type FieldKey = "registration" | "makeModel" | "fuel" | "startDate"
type DatePart = "day" | "month" | "year"
type DateMarks = Record<DatePart, boolean>
type Errors = Partial<Record<FieldKey, string>>
type SummaryItem = { field: FieldKey; message: string; focusId: string }

const FIELD_ORDER: FieldKey[] = ["registration", "makeModel", "fuel", "startDate"]
const DATE_PARTS: DatePart[] = ["day", "month", "year"]
const PART_IDS: Record<DatePart, string> = {
  day: "start-day",
  month: "start-month",
  year: "start-year",
}
const NO_MARKS: DateMarks = { day: false, month: false, year: false }

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function dateNumber(year: number, month: number, day: number) {
  return year * 10000 + month * 100 + day
}

// The last good day: the same day of the month 3 calendar months after today,
// or that month's last day where it is shorter.
function lastGoodDay() {
  const monthIndex = TODAY.month - 1 + 3
  const year = TODAY.year + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  const day = Math.min(TODAY.day, daysInMonth(year, month))
  return { year, month, day }
}

function formatDate(d: { year: number; month: number; day: number }) {
  return `${d.day} ${MONTHS[d.month - 1]} ${d.year}`
}

function checkDate(parts: Record<DatePart, string>): {
  message?: string
  marks: DateMarks
} {
  const empty = DATE_PARTS.filter((p) => parts[p] === "")
  if (empty.length === 3) {
    return {
      message: "Enter the date you want the permit to start",
      marks: { day: true, month: true, year: true },
    }
  }
  if (empty.length > 0) {
    const names = empty.map((p) => `a ${p}`).join(" and ")
    return {
      message: `The start date must include ${names}`,
      marks: {
        day: empty.includes("day"),
        month: empty.includes("month"),
        year: empty.includes("year"),
      },
    }
  }
  const notNumber = DATE_PARTS.find((p) => !/^[0-9]+$/.test(parts[p]))
  if (notNumber) {
    return {
      message: `The ${notNumber} must be a number`,
      marks: { ...NO_MARKS, [notNumber]: true },
    }
  }
  if (parts.year.length !== 4) {
    return {
      message: "The year must have 4 numbers, like 2026",
      marks: { ...NO_MARKS, year: true },
    }
  }
  const all = { day: true, month: true, year: true }
  const day = Number(parts.day)
  const month = Number(parts.month)
  const year = Number(parts.year)
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month)
  ) {
    return { message: "The start date must be a real date", marks: all }
  }
  const chosen = dateNumber(year, month, day)
  if (chosen < dateNumber(TODAY.year, TODAY.month, TODAY.day)) {
    return { message: "The start date must be today or later", marks: all }
  }
  const last = lastGoodDay()
  if (chosen > dateNumber(last.year, last.month, last.day)) {
    return {
      message: `The start date must be on or before ${formatDate(last)}`,
      marks: all,
    }
  }
  return { marks: NO_MARKS }
}

function ErrorLine({ id, message }: { id: string; message: string }) {
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
        {message}
      </span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ")
}

export function App() {
  const [registration, setRegistration] = React.useState("")
  const [makeModel, setMakeModel] = React.useState("")
  const [fuel, setFuel] = React.useState<string | null>(null)
  const [date, setDate] = React.useState<Record<DatePart, string>>({
    day: "",
    month: "",
    year: "",
  })

  const [errors, setErrors] = React.useState<Errors>({})
  const [dateMarks, setDateMarks] = React.useState<DateMarks>(NO_MARKS)
  const [summary, setSummary] = React.useState<SummaryItem[]>([])
  const [status, setStatus] = React.useState("")
  const [sendCount, setSendCount] = React.useState(0)

  const summaryRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    document.title = summary.length > 0 ? `Error: ${PAGE_TITLE}` : PAGE_TITLE
  }, [summary])

  React.useEffect(() => {
    if (sendCount > 0 && summary.length > 0) {
      summaryRef.current?.focus()
    }
  }, [sendCount, summary])

  function clearError(field: FieldKey) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    if (field === "startDate") setDateMarks(NO_MARKS)
  }

  function updateDatePart(part: DatePart, value: string) {
    setDate((current) => ({ ...current, [part]: value }))
    clearError("startDate")
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const reg = registration.trim()
    const make = makeModel.trim()
    const parts = {
      day: date.day.trim(),
      month: date.month.trim(),
      year: date.year.trim(),
    }
    setRegistration(reg)
    setMakeModel(make)
    setDate(parts)

    const next: Errors = {}
    const regCheck = reg.replace(/\s/g, "").toUpperCase()
    if (reg === "") {
      next.registration = "Enter your vehicle's registration number"
    } else if (!/^[A-Z0-9]{2,8}$/.test(regCheck)) {
      next.registration =
        "The registration number must be 2 to 8 letters and numbers, like KX19 TDV"
    }
    if (make === "") {
      next.makeModel = "Enter the make and model of your vehicle"
    }
    if (!fuel) {
      next.fuel = "Select what your vehicle runs on"
    }
    const dateResult = checkDate(parts)
    if (dateResult.message) {
      next.startDate = dateResult.message
    }

    const firstDatePart =
      DATE_PARTS.find((p) => dateResult.marks[p]) ?? "day"
    const focusIds: Record<FieldKey, string> = {
      registration: "registration",
      makeModel: "make-model",
      fuel: FUEL_OPTIONS[0].id,
      startDate: PART_IDS[firstDatePart],
    }
    const items = FIELD_ORDER.filter((f) => next[f]).map((f) => ({
      field: f,
      message: next[f] as string,
      focusId: focusIds[f],
    }))

    setErrors(next)
    setDateMarks(dateResult.marks)
    setSummary(items)
    setSendCount((n) => n + 1)

    if (items.length > 0) {
      setStatus("")
    } else {
      setStatus(
        "Your vehicle details are saved. In the full service, the next step would open now."
      )
    }
  }

  function goToField(event: React.MouseEvent<HTMLAnchorElement>, item: SummaryItem) {
    event.preventDefault()
    const target = document.getElementById(item.focusId)
    target?.focus({ preventScroll: true })
    const scrollTargets: Record<FieldKey, string> = {
      registration: "registration-label",
      makeModel: "make-model-label",
      fuel: "fuel-legend",
      startDate: "date-legend",
    }
    document.getElementById(scrollTargets[item.field])?.scrollIntoView()
  }

  const regError = errors.registration
  const makeError = errors.makeModel
  const fuelError = errors.fuel
  const dateError = errors.startDate

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
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
        <div className="mx-auto flex max-w-[720px] flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-4 md:px-6">
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
            Apply for a resident's parking permit
          </a>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[720px] px-4 pt-10 pb-16 md:px-6">
        <p>
          <a
            href="#"
            className={cn(
              "inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
              FOCUS
            )}
          >
            <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
            Back
          </a>
        </p>

        {summary.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="group"
            aria-labelledby="error-summary-title"
            className={cn(
              "mt-6 rounded-xl border-2 border-destructive bg-background p-6",
              CODE_FOCUS
            )}
          >
            <p id="error-summary-title" className="font-heading text-h2">
              Your answers need a change
            </p>
            <ul className="mt-4 list-none p-0">
              {summary.map((item, index) => (
                <li key={item.field} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${item.focusId}`}
                    onClick={(event) => goToField(event, item)}
                    className={cn(
                      "font-bold text-destructive underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
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
        <h1 className="mt-2 text-h1">{PAGE_HEADING}</h1>
        <p className="mt-6">
          Your permit is linked to your vehicle's registration number, so there
          is nothing to display in the windscreen.
        </p>

        <div className="mt-10">
          <form noValidate onSubmit={handleSubmit}>
            {/* Registration number */}
            <div className={cn(regError && "border-l-4 border-destructive pl-4")}>
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
              {regError && (
                <ErrorLine id="registration-error" message={regError} />
              )}
              <Input
                id="registration"
                name="registration"
                className={cn(INPUT, "mt-2 w-48")}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="characters"
                value={registration}
                aria-invalid={regError ? true : undefined}
                aria-describedby={describedBy(
                  "registration-hint",
                  regError && "registration-error"
                )}
                onChange={(event) => {
                  setRegistration(event.target.value)
                  clearError("registration")
                }}
              />
            </div>

            {/* Make and model */}
            <div
              className={cn(
                "mt-6",
                makeError && "border-l-4 border-destructive pl-4"
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
              {makeError && <ErrorLine id="make-model-error" message={makeError} />}
              <Input
                id="make-model"
                name="make-model"
                className={cn(INPUT, "mt-2 w-full md:w-96")}
                autoComplete="off"
                value={makeModel}
                aria-invalid={makeError ? true : undefined}
                aria-describedby={describedBy(
                  "make-model-hint",
                  makeError && "make-model-error"
                )}
                onChange={(event) => {
                  setMakeModel(event.target.value)
                  clearError("makeModel")
                }}
              />
            </div>

            {/* Fuel */}
            <div
              className={cn(
                "mt-6",
                fuelError && "border-l-4 border-destructive pl-4"
              )}
            >
              <RadioGroup
                render={<fieldset />}
                className="m-0 min-w-0 border-0 p-0"
                name="fuel"
                value={fuel}
                onValueChange={(value) => {
                  setFuel(value as string)
                  clearError("fuel")
                }}
                aria-labelledby="fuel-legend"
                aria-describedby={describedBy(
                  "fuel-hint",
                  fuelError && "fuel-error"
                )}
                aria-invalid={fuelError ? true : undefined}
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
                {fuelError && <ErrorLine id="fuel-error" message={fuelError} />}
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

            {/* Start date */}
            <div
              className={cn(
                "mt-6",
                dateError && "border-l-4 border-destructive pl-4"
              )}
            >
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend
                  id="date-legend"
                  className="p-0 text-body font-bold text-foreground"
                >
                  When do you want the permit to start?
                </legend>
                <p id="date-hint" className="mt-1 text-muted-foreground">
                  It can start today or on any day in the next 3 months. For
                  example, 1 12 2026.
                </p>
                {dateError && <ErrorLine id="date-error" message={dateError} />}
                <div className="mt-2 flex flex-wrap items-end gap-4">
                  {DATE_PARTS.map((part) => (
                    <div key={part}>
                      <label htmlFor={PART_IDS[part]} className="block text-body">
                        {part.charAt(0).toUpperCase() + part.slice(1)}
                      </label>
                      <Input
                        id={PART_IDS[part]}
                        name={PART_IDS[part]}
                        className={cn(
                          INPUT,
                          "mt-2",
                          part === "year" ? "w-24" : "w-16"
                        )}
                        inputMode="numeric"
                        autoComplete="off"
                        value={date[part]}
                        aria-invalid={
                          dateError && dateMarks[part] ? true : undefined
                        }
                        aria-describedby={describedBy(
                          "date-hint",
                          dateError && "date-error"
                        )}
                        onChange={(event) =>
                          updateDatePart(part, event.target.value)
                        }
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
            {status && <p className="mt-6 text-body text-foreground">{status}</p>}
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
            If you cannot find your registration number, it is on your vehicle's
            registration document.
          </p>
          <p className="mt-4">
            Call us on{" "}
            <a href="tel:01632960418" className={TEXT_LINK}>
              01632 960 418
            </a>
            , Monday to Friday, 9am to 5pm.
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-[720px] px-4 py-10 md:px-6">
          <nav aria-label="Footer">
            <ul className="flex list-none flex-wrap gap-x-6 p-0">
              {["Accessibility", "Privacy", "Cookies", "Contact the council"].map(
                (label) => (
                  <li key={label}>
                    <a href="#" className={cn(TEXT_LINK, "inline-block py-2")}>
                      {label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
          <p className="mt-6 text-muted-foreground">
            Callowmere Council, Guildhall, Market Street, Callowmere CM1 1AA
          </p>
          <p className="mt-2 text-muted-foreground">© Callowmere Council 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
