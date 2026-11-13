import { useEffect, useRef, useState } from "react"
import { CircleCheck, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const REFERENCE_NUMBER = "CPP-2611-4827"

const container = "mx-auto max-w-[720px] px-4 md:px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const dateLabel = "mt-1 font-mono text-label text-muted-foreground"

const footerLinks = ["Accessibility", "Privacy", "Cookies", "Contact the council"]

export function App() {
  const [message, setMessage] = useState("")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copyReferenceNumber() {
    window.clearTimeout(timer.current)
    setMessage("")

    let result: string
    try {
      await navigator.clipboard.writeText(REFERENCE_NUMBER)
      result = "Reference number copied"
    } catch {
      result = "Copying did not work. Select the number and copy it yourself."
    }

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(result), 100)
  }

  return (
    <div className="bg-background text-body text-foreground">
      <a
        href="#main"
        className={cn(
          "sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2",
          focusOutline
        )}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
          )}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground no-underline underline-offset-4 hover:underline",
              focusOutline
            )}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={cn(
              "text-body font-bold text-foreground no-underline underline-offset-4 hover:underline",
              focusOutline
            )}
          >
            Apply for a resident&apos;s parking permit
          </a>
        </div>
      </header>

      <main id="main" className={cn(container, "pt-10 pb-16")}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <CircleCheck
              className="mt-1 size-8 shrink-0 text-success"
              strokeWidth={2}
              aria-hidden="true"
            />
            <h1 className="text-h1">Application sent</h1>
          </div>
          <p className="mt-6">
            We have sent a copy of your application to{" "}
            <span className="break-words">priya.okafor@mail.example</span>.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            Your reference number
          </p>
          <p className="mt-2 font-mono text-h2 font-bold whitespace-nowrap text-foreground tabular-nums">
            {REFERENCE_NUMBER}
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              className="h-11 w-full px-6 font-mono text-label md:w-auto"
              onClick={copyReferenceNumber}
            >
              <Copy className="size-5" strokeWidth={2} aria-hidden="true" />
              Copy reference number
            </Button>
            <div role="status">
              {message ? (
                <p className="mt-2 text-body text-foreground">{message}</p>
              ) : null}
            </div>
          </div>
          <p className="mt-4">
            Keep this number, and quote it if you contact the council.
          </p>
        </div>

        <h2 className="mt-10 text-h2">What happens next</h2>
        <p className="mt-4">We will email you at each step.</p>
        <ol className="mt-6 list-decimal pl-6 marker:font-bold">
          <li>
            <h3 className="text-body font-bold">We check your application</h3>
            <p className={dateLabel}>
              By <time dateTime="2026-11-18">18 November 2026</time>
            </p>
            <p className="mt-2">
              We check your address and the vehicle record. We may email you to
              ask for more proof of address.
            </p>
          </li>
          <li className="mt-6">
            <h3 className="text-body font-bold">You pay for the permit</h3>
            <p className={dateLabel}>
              By <time dateTime="2026-11-25">25 November 2026</time>
            </p>
            <p className="mt-2">
              Once your application is approved, we email you a link to pay £96.
              The link works for 7 days.
            </p>
          </li>
          <li className="mt-6">
            <h3 className="text-body font-bold">Your permit starts</h3>
            <p className={dateLabel}>
              On <time dateTime="2026-12-01">1 December 2026</time>
            </p>
            <p className="mt-2">
              The permit is linked to KX19 TDV, so there is nothing to display
              in the car. It runs to{" "}
              <time dateTime="2027-11-30">30 November 2027</time>, and we send a
              reminder 4 weeks before it ends.
            </p>
          </li>
        </ol>
        <p className="mt-6">
          If we turn your application down, the email says why and how to ask
          for the decision to be looked at again.
        </p>

        <h2 className="mt-10 text-h2">If you need help</h2>
        <p className="mt-4">
          Call the permits team on{" "}
          <a href="tel:01632960418" className={cn(textLink, "font-bold")}>
            01632 960 418
          </a>
          , Monday to Friday, 9am to 5pm.
        </p>
        <p className="mt-4">
          Or email{" "}
          <a
            href="mailto:permits@callowmere.example"
            className={cn(textLink, "break-words")}
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
            It takes about a minute, and we use the answers to make the service
            easier.
          </p>
          <p className="mt-4">
            <a href="#" className={textLink}>
              Give feedback on the parking permit service
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={cn(container, "py-10")}>
          <nav aria-label="Footer">
            <ul className="m-0 flex list-none flex-wrap gap-x-6 p-0">
              {footerLinks.map((name) => (
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
