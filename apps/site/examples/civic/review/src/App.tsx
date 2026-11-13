import * as React from "react"
import { ChevronLeft, CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const PAGE_TITLE =
  "Check your application – Apply for a resident's parking permit – Callowmere Council"

const DECLARATION_ERROR = "Tick the box to confirm your answers are correct"

const SENT_MESSAGE =
  "In the full service, your application would be sent now and the confirmation page would open."

const CONTAINER = "mx-auto max-w-[720px] px-4 md:px-6"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const TEXT_LINK = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${FOCUS}`

type Row = {
  question: string
  answer: React.ReactNode
  change: string
}

const detailRows: Row[] = [
  { question: "Name", answer: "Priya Okafor", change: "name" },
  {
    question: "Address",
    answer: (
      <>
        <span className="block">14 Wharf Row</span>
        <span className="block">Callowmere</span>
        <span className="block">CM4 7QJ</span>
      </>
    ),
    change: "address",
  },
  { question: "Permit zone", answer: "Zone B", change: "permit zone" },
  {
    question: "Email",
    answer: "priya.okafor@mail.example",
    change: "email address",
  },
  { question: "Phone", answer: "07700 900 214", change: "phone number" },
  {
    question: "Proof of address",
    answer: (
      <>
        Council tax bill, uploaded{" "}
        <time dateTime="2026-11-09">9 November 2026</time>
      </>
    ),
    change: "proof of address",
  },
]

const vehicleRows: Row[] = [
  {
    question: "Registration number",
    answer: "KX19 TDV",
    change: "vehicle registration number",
  },
  {
    question: "Make and model",
    answer: "Velmar Arden",
    change: "make and model",
  },
  {
    question: "Runs on",
    answer: "Petrol or diesel",
    change: "what the vehicle runs on",
  },
  {
    question: "Permit start date",
    answer: <time dateTime="2026-12-01">1 December 2026</time>,
    change: "permit start date",
  },
]

const footerLinks = ["Accessibility", "Privacy", "Cookies", "Contact the council"]

function SummaryList({ rows }: { rows: Row[] }) {
  return (
    <dl className="mt-6 border-t border-border">
      {rows.map((row) => (
        <div
          key={row.question}
          className="border-b border-border py-4 md:grid md:grid-cols-12 md:items-start md:gap-x-4"
        >
          <dt className="text-body font-bold md:col-span-4">{row.question}</dt>
          <dd className="mt-1 break-words md:col-span-6 md:mt-0">
            {row.answer}
          </dd>
          <dd className="mt-2 md:col-span-2 md:mt-0 md:text-right">
            <a
              href="#"
              className={`inline-flex min-h-11 items-center ${TEXT_LINK}`}
            >
              Change<span className="sr-only"> {row.change}</span>
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function App() {
  const [confirmed, setConfirmed] = React.useState(false)
  const [fieldError, setFieldError] = React.useState(false)
  const [summaryShown, setSummaryShown] = React.useState(false)
  const [failedSends, setFailedSends] = React.useState(0)
  const [message, setMessage] = React.useState("")

  const summaryRef = React.useRef<HTMLDivElement>(null)
  const checkboxRef = React.useRef<HTMLElement>(null)
  const labelRef = React.useRef<HTMLLabelElement>(null)

  React.useEffect(() => {
    document.title = summaryShown ? `Error: ${PAGE_TITLE}` : PAGE_TITLE
  }, [summaryShown])

  React.useEffect(() => {
    if (failedSends > 0) {
      summaryRef.current?.focus()
    }
  }, [failedSends])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!confirmed) {
      setFieldError(true)
      setSummaryShown(true)
      setMessage("")
      setFailedSends((count) => count + 1)
      return
    }

    setFieldError(false)
    setSummaryShown(false)
    setMessage(SENT_MESSAGE)
  }

  function handleConfirmedChange(checked: boolean) {
    setConfirmed(checked)
    setFieldError(false)
  }

  function handleSummaryLink(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    checkboxRef.current?.focus({ preventScroll: true })
    labelRef.current?.scrollIntoView()
  }

  return (
    <div className="bg-background text-body text-foreground">
      <a
        href="#main"
        className={`sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2 ${FOCUS}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div
          className={`${CONTAINER} flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4`}
        >
          <a
            href="/"
            className={`font-heading text-h2 text-foreground no-underline underline-offset-4 hover:underline ${FOCUS}`}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={`text-body font-bold text-foreground no-underline underline-offset-4 hover:underline ${FOCUS}`}
          >
            Apply for a resident&apos;s parking permit
          </a>
        </div>
      </header>

      <main id="main" className={`${CONTAINER} pt-10 pb-16`}>
        <p>
          <a
            href="#"
            className={`inline-flex min-h-11 items-center gap-2 ${TEXT_LINK}`}
          >
            <ChevronLeft
              className="size-5"
              strokeWidth={2}
              aria-hidden="true"
            />
            Back
          </a>
        </p>

        {summaryShown && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            aria-labelledby="error-summary-title"
            className="mt-6 rounded-xl border-2 border-destructive bg-background p-6 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
          >
            <p id="error-summary-title" className="font-heading text-h2">
              Your answers need a change
            </p>
            <ul className="mt-4">
              <li>
                <a
                  href="#declaration"
                  onClick={handleSummaryLink}
                  className={`font-bold text-destructive underline underline-offset-4 ${FOCUS}`}
                >
                  {DECLARATION_ERROR}
                </a>
              </li>
            </ul>
          </div>
        )}

        <p className="mt-6 font-mono text-label text-muted-foreground">
          Step 3 of 3
        </p>
        <h1 className="mt-2 text-h1">Check your application</h1>
        <p className="mt-6">
          Read your answers below. If any are wrong, change them before you
          send your application.
        </p>

        <h2 className="mt-10 text-h2">Your details</h2>
        <SummaryList rows={detailRows} />

        <h2 className="mt-10 text-h2">Your vehicle</h2>
        <SummaryList rows={vehicleRows} />

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-h2">What you will pay</h2>
          <p className="mt-2 font-heading text-h1">£96</p>
          <p className="mt-2">
            For 12 months, from{" "}
            <time dateTime="2026-12-01">1 December 2026</time> to{" "}
            <time dateTime="2027-11-30">30 November 2027</time>
          </p>
          <p className="mt-4">
            You pay after the council approves your application. We will email
            you a link to pay.
          </p>
        </div>

        <div className="mt-10">
          <form noValidate onSubmit={handleSubmit}>
            <h2 className="text-h2">Declaration</h2>
            <p className="mt-4">
              If you give false information to get a permit, the council can
              cancel it and you will not get a refund.
            </p>

            <div
              className={
                fieldError ? "mt-6 border-l-4 border-destructive pl-4" : "mt-6"
              }
            >
              {fieldError && (
                <p
                  id="declaration-error"
                  className="flex items-start gap-2 text-body font-bold text-destructive"
                >
                  <CircleAlert
                    className="mt-1 size-5 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="sr-only">Error: </span>
                    {DECLARATION_ERROR}
                  </span>
                </p>
              )}
              <div
                className={
                  fieldError
                    ? "mt-2 flex min-h-11 items-start gap-4"
                    : "flex min-h-11 items-start gap-4"
                }
              >
                <Checkbox
                  ref={checkboxRef}
                  id="declaration"
                  name="declaration"
                  className="mt-0.5"
                  checked={confirmed}
                  onCheckedChange={handleConfirmedChange}
                  aria-labelledby="declaration-label"
                  aria-describedby={
                    fieldError ? "declaration-error" : undefined
                  }
                  aria-invalid={fieldError || undefined}
                />
                <label
                  ref={labelRef}
                  id="declaration-label"
                  htmlFor="declaration"
                  className="text-body"
                >
                  I confirm that I live at 14 Wharf Row, that the vehicle is
                  registered to me at this address, and that my answers are
                  correct.
                </label>
              </div>
            </div>

            <div className="mt-10">
              <Button
                type="submit"
                className="h-11 w-full px-6 font-mono text-label md:w-auto"
              >
                Submit application
              </Button>
            </div>
          </form>

          <div role="status">
            {message && (
              <p className="mt-6 text-body text-foreground">{message}</p>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={`${CONTAINER} py-10`}>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={`inline-block py-2 ${TEXT_LINK}`}>
                    {link}
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
