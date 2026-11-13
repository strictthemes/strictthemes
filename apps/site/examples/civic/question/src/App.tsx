import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react"
import { ChevronLeft, CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const PAGE_TITLE =
  "About your vehicle – Apply for a resident's parking permit – Callowmere Council"

// "Today" is fixed so the page behaves the same on any day.
const TODAY = { year: 2026, month: 11, day: 11 }

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

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

// The same day of the month 3 calendar months later, or that month's last day.
function lastGoodDay() {
  const index = TODAY.month - 1 + 3
  const year = TODAY.year + Math.floor(index / 12)
  const month = (index % 12) + 1
  const day = Math.min(TODAY.day, daysInMonth(year, month))
  return { year, month, day }
}

const LAST_DAY = lastGoodDay()
const LAST_DAY_TEXT = `${LAST_DAY.day} ${MONTHS[LAST_DAY.month - 1]} ${LAST_DAY.year}`

function toNumber(d: { year: number; month: number; day: number }) {
  return d.year * 10000 + d.month * 100 + d.day
}

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

type DatePart = "day" | "month" | "year"
const DATE_PARTS: DatePart[] = ["day", "month", "year"]
const PART_LABEL: Record<DatePart, string> = {
  day: "Day",
  month: "Month",
  year: "Year",
}

type FieldKey = "reg" | "make" | "fuel" | "date"

type Errors = {
  reg?: string
  make?: string
  fuel?: string
  date?: { message: string; parts: DatePart[] }
}

type SummaryItem = { key: FieldKey; message: string; target: string }

const FUEL_OPTIONS = [
  { value: "petrol-diesel", label: "Petrol or diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Fully electric" },
]

function checkDate(raw: Record<DatePart, string>): Errors["date"] {
  const value = {
    day: raw.day.trim(),
    month: raw.month.trim(),
    year: raw.year.trim(),
  }
  const empty = DATE_PARTS.filter((part) => value[part] === "")
  if (empty.length === 3) {
    return {
      message: "Enter the date you want the permit to start",
      parts: [...DATE_PARTS],
    }
  }
  if (empty.length > 0) {
    const words = empty.map((part) => `a ${part}`).join(" and ")
    return { message: `The start date must include ${words}`, parts: empty }
  }
  const notNumber = DATE_PARTS.find((part) => !/^[0-9]+$/.test(value[part]))
  if (notNumber) {
    return { message: `The ${notNumber} must be a number`, parts: [notNumber] }
  }
  if (!/^[0-9]{4}$/.test(value.year)) {
    return {
      message: "The year must have 4 numbers, like 2026",
      parts: ["year"],
    }
  }
  const date = {
    day: Number(value.day),
    month: Number(value.month),
    year: Number(value.year),
  }
  if (
    date.month < 1 ||
    date.month > 12 ||
    date.day < 1 ||
    date.day > daysInMonth(date.year, date.month)
  ) {
    return {
      message: "The start date must be a real date",
      parts: [...DATE_PARTS],
    }
  }
  if (toNumber(date) < toNumber(TODAY)) {
    return {
      message: "The start date must be today or later",
      parts: [...DATE_PARTS],
    }
  }
  if (toNumber(date) > toNumber(LAST_DAY)) {
    return {
      message: `The start date must be on or before ${LAST_DAY_TEXT}`,
      parts: [...DATE_PARTS],
    }
  }
  return undefined
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
  const [reg, setReg] = useState("")
  const [make, setMake] = useState("")
  const [fuel, setFuel] = useState<string | null>(null)
  const [date, setDate] = useState<Record<DatePart, string>>({
    day: "",
    month: "",
    year: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [summary, setSummary] = useState<SummaryItem[]>([])
  const [status, setStatus] = useState("")
  const [sendCount, setSendCount] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = summary.length > 0 ? `Error: ${PAGE_TITLE}` : PAGE_TITLE
  }, [summary])

  useEffect(() => {
    if (sendCount > 0 && summary.length > 0) {
      summaryRef.current?.focus()
    }
  }, [sendCount, summary])

  function clearError(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}

    const regValue = reg.trim()
    const regCode = regValue.replace(/\s+/g, "").toUpperCase()
    if (regValue === "") {
      next.reg = "Enter your vehicle's registration number"
    } else if (!/^[A-Z0-9]{2,8}$/.test(regCode)) {
      next.reg =
        "The registration number must be 2 to 8 letters and numbers, like KX19 TDV"
    }

    if (make.trim() === "") {
      next.make = "Enter the make and model of your vehicle"
    }

    if (!fuel) {
      next.fuel = "Select what your vehicle runs on"
    }

    const dateError = checkDate(date)
    if (dateError) next.date = dateError

    const items: SummaryItem[] = []
    if (next.reg) items.push({ key: "reg", message: next.reg, target: "reg" })
    if (next.make)
      items.push({ key: "make", message: next.make, target: "make" })
    if (next.fuel)
      items.push({
        key: "fuel",
        message: next.fuel,
        target: `fuel-${FUEL_OPTIONS[0].value}`,
      })
    if (next.date)
      items.push({
        key: "date",
        message: next.date.message,
        target: `date-${next.date.parts[0]}`,
      })

    setErrors(next)
    setSummary(items)
    setSendCount((count) => count + 1)

    if (items.length > 0) {
      setStatus("")
    } else {
      setStatus(
        "Your vehicle details are saved. In the full service, the next step would open now."
      )
    }
  }

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, item: SummaryItem) {
    event.preventDefault()
    const field = document.getElementById(item.target)
    field?.focus({ preventScroll: true })
    const labelId =
      item.key === "fuel"
        ? "fuel-legend"
        : item.key === "date"
          ? "date-legend"
          : `${item.key}-label`
    document.getElementById(labelId)?.scrollIntoView()
  }

  const dateError = errors.date

  return (
    <div className="bg-background text-body text-foreground">
      <a
        href="#main"
        className={cn(
          "sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2",
          focusRing
        )}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[720px] flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-4 md:px-6">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground no-underline underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
            )}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={cn(
              "text-body font-bold text-foreground no-underline underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
            )}
          >
            Apply for a resident's parking permit
          </a>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto max-w-[720px] px-4 pt-10 pb-16 md:px-6"
      >
        <p>
          <a
            href="#"
            className={cn(
              "inline-flex min-h-11 items-center gap-2 text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
              focusRing
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

        {summary.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="group"
            aria-labelledby="error-summary-title"
            className="mt-6 rounded-xl border-2 border-destructive bg-background p-6 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
          >
            <p id="error-summary-title" className="font-heading text-h2">
              Your answers need a change
            </p>
            <ul className="mt-4">
              {summary.map((item, index) => (
                <li key={item.key} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${item.target}`}
                    onClick={(event) => jumpTo(event, item)}
                    className={cn(
                      "font-bold text-destructive underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                      focusRing
                    )}
                  >
                    {item.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 font-mono text-label text-muted-foreground tabular-nums">
          Step 2 of 3
        </p>
        <h1 className="mt-2 text-h1">About your vehicle</h1>
        <p className="mt-6">
          Your permit is linked to your vehicle's registration number, so there
          is nothing to put in the windscreen.
        </p>

        <div className="mt-10">
          <form noValidate onSubmit={handleSubmit}>
            <div
              className={cn(errors.reg && "border-l-4 border-destructive pl-4")}
            >
              <label
                id="reg-label"
                htmlFor="reg"
                className="block text-body font-bold text-foreground"
              >
                Vehicle registration number
              </label>
              <p id="reg-hint" className="mt-1 text-muted-foreground">
                This is on the number plate, for example KX19 TDV.
              </p>
              {errors.reg && <ErrorLine id="reg-error" message={errors.reg} />}
              <Input
                id="reg"
                name="registration"
                value={reg}
                onChange={(event) => {
                  setReg(event.target.value)
                  clearError("reg")
                }}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="characters"
                aria-describedby={describedBy(
                  "reg-hint",
                  errors.reg && "reg-error"
                )}
                aria-invalid={errors.reg ? true : undefined}
                className="mt-2 block h-11 w-48 px-2 text-body md:text-body"
              />
            </div>

            <div
              className={cn(
                "mt-6",
                errors.make && "border-l-4 border-destructive pl-4"
              )}
            >
              <label
                id="make-label"
                htmlFor="make"
                className="block text-body font-bold text-foreground"
              >
                Make and model
              </label>
              <p id="make-hint" className="mt-1 text-muted-foreground">
                For example, Velmar Arden.
              </p>
              {errors.make && (
                <ErrorLine id="make-error" message={errors.make} />
              )}
              <Input
                id="make"
                name="make-and-model"
                value={make}
                onChange={(event) => {
                  setMake(event.target.value)
                  clearError("make")
                }}
                autoComplete="off"
                aria-describedby={describedBy(
                  "make-hint",
                  errors.make && "make-error"
                )}
                aria-invalid={errors.make ? true : undefined}
                className="mt-2 block h-11 px-2 text-body md:w-96 md:text-body"
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
                  setFuel(value as string)
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
                  <ErrorLine id="fuel-error" message={errors.fuel} />
                )}
                {FUEL_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="mt-2 flex min-h-11 items-center gap-4"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`fuel-${option.value}`}
                    />
                    <label
                      htmlFor={`fuel-${option.value}`}
                      className="text-body"
                    >
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
                  id="date-legend"
                  className="p-0 text-body font-bold text-foreground"
                >
                  When do you want the permit to start?
                </legend>
                <p id="date-hint" className="mt-1 text-muted-foreground">
                  It can start today or on any day in the next 3 months. For
                  example, 1 12 2026.
                </p>
                {dateError && (
                  <ErrorLine id="date-error" message={dateError.message} />
                )}
                <div className="mt-2 flex flex-wrap items-end gap-4">
                  {DATE_PARTS.map((part) => {
                    const invalid = dateError?.parts.includes(part)
                    return (
                      <div key={part}>
                        <label
                          htmlFor={`date-${part}`}
                          className="block text-body"
                        >
                          {PART_LABEL[part]}
                        </label>
                        <Input
                          id={`date-${part}`}
                          name={`start-${part}`}
                          value={date[part]}
                          onChange={(event) => {
                            const value = event.target.value
                            setDate((current) => ({
                              ...current,
                              [part]: value,
                            }))
                            clearError("date")
                          }}
                          inputMode="numeric"
                          autoComplete="off"
                          aria-describedby={describedBy(
                            "date-hint",
                            dateError && "date-error"
                          )}
                          aria-invalid={invalid ? true : undefined}
                          className={cn(
                            "mt-2 block h-11 px-2 text-body tabular-nums md:text-body",
                            part === "year" ? "w-24" : "w-16"
                          )}
                        />
                      </div>
                    )
                  })}
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
            {status && (
              <p className="mt-6 text-body text-foreground">{status}</p>
            )}
          </div>
        </div>

        <section
          aria-labelledby="help-title"
          className="mt-16 border-t border-border pt-6"
        >
          <h2 id="help-title" className="text-h2">
            Help with this form
          </h2>
          <p className="mt-4">
            If you cannot find your registration number, it is on the vehicle's
            registration document.
          </p>
          <p className="mt-4">
            Call us on{" "}
            <a href="tel:01632960418" className={textLink}>
              01632 960 418
            </a>
            . Our lines are open Monday to Friday, 9am to 5pm.
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-[720px] px-4 py-10 md:px-6">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6">
              {[
                "Accessibility",
                "Privacy",
                "Cookies",
                "Contact the council",
              ].map((name) => (
                <li key={name}>
                  <a href="#" className={cn(textLink, "inline-block py-2")}>
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
