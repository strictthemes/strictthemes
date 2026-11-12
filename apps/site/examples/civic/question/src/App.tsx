import { useEffect, useRef, useState } from "react"
import type { FormEvent, MouseEvent, ReactNode } from "react"
import { ChevronLeft, CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PAGE_TITLE =
  "About your vehicle – Apply for a resident's parking permit – Callowmere Council"

// "Today" is fixed so the page behaves the same on any day.
const TODAY = { year: 2026, month: 11, day: 11 }

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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const listLink = cn("inline-block py-2", textLink)

const inputClass = "mt-2 h-11 text-body md:text-body"

type FieldKey = "reg" | "make" | "fuel" | "date"
type DatePart = "day" | "month" | "year"
const DATE_PARTS: DatePart[] = ["day", "month", "year"]
const DATE_PART_NAMES: Record<DatePart, string> = {
  day: "day",
  month: "month",
  year: "year",
}

type Errors = Partial<Record<FieldKey, string>>
type SummaryItem = { key: FieldKey; message: string; target: string }

const FUEL_OPTIONS = [
  { value: "petrol-diesel", label: "Petrol or diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Fully electric" },
]

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function dateKey(year: number, month: number, day: number) {
  return year * 10000 + month * 100 + day
}

// The same day of the month 3 calendar months on, or that month's last day.
function lastGoodDay() {
  let month = TODAY.month + 3
  let year = TODAY.year
  if (month > 12) {
    month -= 12
    year += 1
  }
  const day = Math.min(TODAY.day, daysInMonth(year, month))
  return { year, month, day }
}

const LAST = lastGoodDay()
const LAST_TEXT = `${LAST.day} ${MONTH_NAMES[LAST.month - 1]} ${LAST.year}`

type DateValue = Record<DatePart, string>

function checkDate(value: DateValue): { message: string; parts: DatePart[] } | null {
  const trimmed: DateValue = {
    day: value.day.trim(),
    month: value.month.trim(),
    year: value.year.trim(),
  }
  const empty = DATE_PARTS.filter((p) => trimmed[p] === "")
  if (empty.length === 3) {
    return { message: "Enter the date you want the permit to start", parts: DATE_PARTS }
  }
  if (empty.length > 0) {
    const words = empty.map((p) => `a ${DATE_PART_NAMES[p]}`).join(" and ")
    return { message: `The start date must include ${words}`, parts: empty }
  }
  const notNumber = DATE_PARTS.find((p) => !/^\d+$/.test(trimmed[p]))
  if (notNumber) {
    const name = DATE_PART_NAMES[notNumber]
    return {
      message: `The ${name} must be a number`,
      parts: [notNumber],
    }
  }
  if (!/^\d{4}$/.test(trimmed.year)) {
    return { message: "The year must have 4 numbers, like 2026", parts: ["year"] }
  }
  const day = Number(trimmed.day)
  const month = Number(trimmed.month)
  const year = Number(trimmed.year)
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return { message: "The start date must be a real date", parts: DATE_PARTS }
  }
  const chosen = dateKey(year, month, day)
  if (chosen < dateKey(TODAY.year, TODAY.month, TODAY.day)) {
    return { message: "The start date must be today or later", parts: DATE_PARTS }
  }
  if (chosen > dateKey(LAST.year, LAST.month, LAST.day)) {
    return {
      message: `The start date must be on or before ${LAST_TEXT}`,
      parts: DATE_PARTS,
    }
  }
  return null
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-body font-bold text-destructive">
      <CircleAlert className="mt-1 size-5 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined
}

export function App() {
  const [reg, setReg] = useState("")
  const [make, setMake] = useState("")
  const [fuel, setFuel] = useState("")
  const [date, setDate] = useState<DateValue>({ day: "", month: "", year: "" })

  const [errors, setErrors] = useState<Errors>({})
  const [dateMarks, setDateMarks] = useState<DatePart[]>([])
  const [summary, setSummary] = useState<SummaryItem[]>([])
  const [sendCount, setSendCount] = useState(0)
  const [status, setStatus] = useState("")

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
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (key === "date") setDateMarks([])
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Errors = {}
    const items: SummaryItem[] = []
    let nextMarks: DatePart[] = []

    const regValue = reg.replace(/\s/g, "").toUpperCase()
    if (regValue === "") {
      nextErrors.reg = "Enter your vehicle's registration number"
    } else if (!/^[A-Z0-9]{2,8}$/.test(regValue)) {
      nextErrors.reg =
        "The registration number must be 2 to 8 letters and numbers, like KX19 TDV"
    }
    if (nextErrors.reg) items.push({ key: "reg", message: nextErrors.reg, target: "reg" })

    if (make.trim() === "") {
      nextErrors.make = "Enter the make and model of your vehicle"
      items.push({ key: "make", message: nextErrors.make, target: "make" })
    }

    if (fuel === "") {
      nextErrors.fuel = "Select what your vehicle runs on"
      items.push({ key: "fuel", message: nextErrors.fuel, target: "fuel-petrol-diesel" })
    }

    const dateError = checkDate(date)
    if (dateError) {
      nextErrors.date = dateError.message
      nextMarks = dateError.parts
      items.push({
        key: "date",
        message: dateError.message,
        target: `date-${dateError.parts[0]}`,
      })
    }

    setErrors(nextErrors)
    setDateMarks(nextMarks)
    setSummary(items)
    setSendCount((n) => n + 1)
    setStatus(
      items.length === 0
        ? "Your vehicle details are saved. In the full service, the next step would open now."
        : ""
    )
  }

  function goToField(event: MouseEvent<HTMLAnchorElement>, item: SummaryItem) {
    event.preventDefault()
    const field = document.getElementById(item.target)
    if (!field) return
    field.focus({ preventScroll: true })
    const scrollTarget =
      item.key === "fuel" || item.key === "date"
        ? document.getElementById(`${item.key}-legend`)
        : document.querySelector(`label[for="${item.target}"]`)
    scrollTarget?.scrollIntoView()
  }

  const dateInvalid = (part: DatePart) =>
    Boolean(errors.date) && dateMarks.includes(part)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
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
              "font-heading text-h2 text-foreground no-underline underline-offset-4 hover:underline",
              focusRing
            )}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={cn(
              "text-body font-bold text-foreground no-underline underline-offset-4 hover:underline",
              focusRing
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
              focusRing
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
            aria-labelledby="error-summary-title"
            className={cn(
              "mt-6 rounded-xl border-2 border-destructive bg-background p-6",
              codeFocusRing
            )}
          >
            <p id="error-summary-title" className="font-heading text-h2">
              Your answers need a change
            </p>
            <ul className="mt-4 list-none p-0">
              {summary.map((item, index) => (
                <li key={item.key} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${item.target}`}
                    onClick={(event) => goToField(event, item)}
                    className={cn(
                      "font-bold text-destructive underline underline-offset-4",
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

        <p className="mt-6 font-mono text-label text-muted-foreground">Step 2 of 3</p>
        <h1 className="mt-2 text-h1">About your vehicle</h1>
        <p className="mt-6">
          Your permit is linked to your vehicle's registration number, so there
          is nothing to display in the windscreen.
        </p>

        <div className="mt-10">
          <form noValidate onSubmit={handleSubmit}>
            <div className={cn(errors.reg && "border-l-4 border-destructive pl-4")}>
              <label htmlFor="reg" className="block text-body font-bold text-foreground">
                Vehicle registration number
              </label>
              <p id="reg-hint" className="mt-1 text-muted-foreground">
                This is on the number plate, for example KX19 TDV.
              </p>
              {errors.reg && <ErrorLine id="reg-error">{errors.reg}</ErrorLine>}
              <Input
                id="reg"
                name="reg"
                value={reg}
                onChange={(event) => {
                  setReg(event.target.value)
                  clearError("reg")
                }}
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="characters"
                aria-invalid={errors.reg ? true : undefined}
                aria-describedby={describedBy("reg-hint", errors.reg && "reg-error")}
                className={cn(inputClass, "w-48")}
              />
            </div>

            <div className={cn("mt-6", errors.make && "border-l-4 border-destructive pl-4")}>
              <label htmlFor="make" className="block text-body font-bold text-foreground">
                Make and model
              </label>
              <p id="make-hint" className="mt-1 text-muted-foreground">
                For example, Velmar Arden.
              </p>
              {errors.make && <ErrorLine id="make-error">{errors.make}</ErrorLine>}
              <Input
                id="make"
                name="make"
                value={make}
                onChange={(event) => {
                  setMake(event.target.value)
                  clearError("make")
                }}
                autoComplete="off"
                aria-invalid={errors.make ? true : undefined}
                aria-describedby={describedBy("make-hint", errors.make && "make-error")}
                className={cn(inputClass, "w-full md:w-96")}
              />
            </div>

            <div className={cn("mt-6", errors.fuel && "border-l-4 border-destructive pl-4")}>
              <fieldset
                className="m-0 border-0 p-0"
                aria-describedby={describedBy("fuel-hint", errors.fuel && "fuel-error")}
              >
                <legend id="fuel-legend" className="p-0 text-body font-bold text-foreground">
                  What does the vehicle run on?
                </legend>
                <p id="fuel-hint" className="mt-1 text-muted-foreground">
                  This sets the price. Electric vehicles cost less.
                </p>
                {errors.fuel && <ErrorLine id="fuel-error">{errors.fuel}</ErrorLine>}
                {FUEL_OPTIONS.map((option) => (
                  <div key={option.value} className="mt-2 flex min-h-11 items-center gap-4">
                    <input
                      type="radio"
                      id={`fuel-${option.value}`}
                      name="fuel"
                      value={option.value}
                      checked={fuel === option.value}
                      onChange={() => {
                        setFuel(option.value)
                        clearError("fuel")
                      }}
                      aria-invalid={errors.fuel ? true : undefined}
                      className={cn("size-6 shrink-0 accent-primary", focusRing)}
                    />
                    <label htmlFor={`fuel-${option.value}`} className="text-body">
                      {option.label}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>

            <div className={cn("mt-6", errors.date && "border-l-4 border-destructive pl-4")}>
              <fieldset className="m-0 border-0 p-0">
                <legend id="date-legend" className="p-0 text-body font-bold text-foreground">
                  When do you want the permit to start?
                </legend>
                <p id="date-hint" className="mt-1 text-muted-foreground">
                  It can start today or on any day in the next 3 months. For
                  example, 1 12 2026.
                </p>
                {errors.date && <ErrorLine id="date-error">{errors.date}</ErrorLine>}
                <div className="mt-2 flex flex-wrap items-end gap-4">
                  {DATE_PARTS.map((part) => (
                    <div key={part}>
                      <label htmlFor={`date-${part}`} className="block text-body">
                        {part === "day" ? "Day" : part === "month" ? "Month" : "Year"}
                      </label>
                      <Input
                        id={`date-${part}`}
                        name={`date-${part}`}
                        value={date[part]}
                        onChange={(event) => {
                          const value = event.target.value
                          setDate((prev) => ({ ...prev, [part]: value }))
                          clearError("date")
                        }}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-invalid={dateInvalid(part) ? true : undefined}
                        aria-describedby={describedBy(
                          "date-hint",
                          errors.date && "date-error"
                        )}
                        className={cn(inputClass, part === "year" ? "w-24" : "w-16")}
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
          aria-labelledby="help-title"
          className="mt-16 border-t border-border pt-6"
        >
          <h2 id="help-title" className="text-h2">
            Help with this form
          </h2>
          <p className="mt-4">
            If you cannot find your registration number, it is on your
            vehicle's registration document.
          </p>
          <p className="mt-4">
            Call the parking team on{" "}
            <a href="tel:01632960418" className={textLink}>
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
              <li>
                <a href="#" className={listLink}>
                  Accessibility
                </a>
              </li>
              <li>
                <a href="#" className={listLink}>
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className={listLink}>
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className={listLink}>
                  Contact the council
                </a>
              </li>
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
