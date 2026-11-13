import { useEffect, useRef, useState } from "react"
import { CircleCheck, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

const REFERENCE_NUMBER = "CPP-2611-4827"

const container = "mx-auto max-w-[720px] px-4 md:px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusOutline}`

const footerLinks = [
  { label: "Accessibility", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Contact the council", href: "#" },
]

const steps = [
  {
    title: "We check your application",
    word: "By",
    dateTime: "2026-11-18",
    date: "18 November 2026",
    body: (
      <>
        We check your address and your vehicle record. We may email you to ask
        for more proof of address.
      </>
    ),
  },
  {
    title: "You pay for the permit",
    word: "By",
    dateTime: "2026-11-25",
    date: "25 November 2026",
    body: (
      <>
        Once we approve your application, we will email you a link to pay £96.
        The link works for 7 days.
      </>
    ),
  },
  {
    title: "Your permit starts",
    word: "On",
    dateTime: "2026-12-01",
    date: "1 December 2026",
    body: (
      <>
        Your permit is linked to KX19 TDV, so there is nothing to display in
        your car. It runs to <time dateTime="2027-11-30">30 November 2027</time>
        , and we will send you a reminder 4 weeks before it ends.
      </>
    ),
  },
]

export function App() {
  const [copyMessage, setCopyMessage] = useState("")
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current)
  }, [])

  async function handleCopy() {
    window.clearTimeout(timerRef.current)
    setCopyMessage("")

    let message: string
    try {
      await navigator.clipboard.writeText(REFERENCE_NUMBER)
      message = "Reference number copied"
    } catch {
      message = "Copying did not work. Select the number and copy it yourself."
    }

    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setCopyMessage(message)
    }, 100)
  }

  return (
    <div className="bg-background text-body text-foreground">
      <a
        href="#main"
        className={`sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2 ${focusOutline}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div
          className={`${container} flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4`}
        >
          <a
            href="/"
            className={`font-heading text-h2 text-foreground no-underline underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={`text-body font-bold text-foreground no-underline underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`}
          >
            Apply for a resident&apos;s parking permit
          </a>
        </div>
      </header>

      <main id="main" className={`${container} pt-10 pb-16`}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <CircleCheck
              className="mt-1 size-8 shrink-0 text-success"
              strokeWidth={2}
              aria-hidden="true"
            />
            <h1 className="min-w-0 text-h1">Application sent</h1>
          </div>
          <p className="mt-6 wrap-break-word">
            We have sent a copy of your application to
            priya.okafor@mail.example.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            Your reference number
          </p>
          <p className="mt-2 font-mono text-h2 whitespace-nowrap text-foreground tabular-nums">
            {REFERENCE_NUMBER}
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              className="h-11 w-full px-6 font-mono text-label md:w-auto"
              onClick={handleCopy}
            >
              <Copy className="size-5" strokeWidth={2} aria-hidden="true" />
              Copy reference number
            </Button>
            <div role="status">
              {copyMessage && (
                <p className="mt-2 text-body text-foreground">{copyMessage}</p>
              )}
            </div>
          </div>
          <p className="mt-4">
            Keep this number, and quote it if you contact us about your
            application.
          </p>
        </div>

        <h2 className="mt-10 text-h2">What happens next</h2>
        <p className="mt-4">We will email you at each step.</p>
        <ol className="mt-6 list-decimal pl-6 marker:font-bold">
          {steps.map((step, index) => (
            <li key={step.title} className={index === 0 ? undefined : "mt-6"}>
              <h3 className="text-body font-bold">{step.title}</h3>
              <p className="mt-1 font-mono text-label text-muted-foreground tabular-nums">
                {step.word} <time dateTime={step.dateTime}>{step.date}</time>
              </p>
              <p className="mt-2">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          If we turn down your application, our email will tell you why and how
          to ask us to look at the decision again.
        </p>

        <h2 className="mt-10 text-h2">If you need help</h2>
        <p className="mt-4">
          Call us on{" "}
          <a href="tel:01632960418" className={`font-bold ${textLink}`}>
            01632 960 418
          </a>
          , Monday to Friday, 9am to 5pm.
        </p>
        <p className="mt-4">
          Or email{" "}
          <a
            href="mailto:permits@callowmere.example"
            className={`wrap-break-word ${textLink}`}
          >
            permits@callowmere.example
          </a>
          . We answer within 2 working days.
        </p>
        <p className="mt-4">Have your reference number ready.</p>

        <section
          aria-labelledby="feedback-heading"
          className="mt-16 border-t border-border pt-6"
        >
          <h2 id="feedback-heading" className="text-h2">
            Tell us how this went
          </h2>
          <p className="mt-4">
            It takes about a minute, and we use your answers to make the service
            easier to use.
          </p>
          <p className="mt-4">
            <a href="#" className={textLink}>
              Give feedback on the parking permit service
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={`${container} py-10`}>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`inline-block py-2 ${textLink}`}
                  >
                    {link.label}
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
