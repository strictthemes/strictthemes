import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[720px] px-4 md:px-6"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150",
  focusRing
)

const listLink = cn(textLink, "inline-block py-2")

const headerLink = cn(
  "text-foreground no-underline hover:underline underline-offset-4 transition-colors duration-150",
  focusRing
)

const relatedLinks = [
  "Who can get a permit and what it costs",
  "Visitor parking permits",
  "Find your permit zone",
]

const footerLinks = [
  "Accessibility",
  "Privacy",
  "Cookies",
  "Contact the council",
]

export function App() {
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
        <div
          className={cn(
            container,
            "flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4"
          )}
        >
          <a href="/" className={cn("font-heading text-h2", headerLink)}>
            Callowmere Council
          </a>
          <a href="#" className={cn("text-body font-bold", headerLink)}>
            Apply for a resident's parking permit
          </a>
        </div>
      </header>

      <main id="main" className={cn(container, "pt-10 pb-16")}>
        <h1 className="text-h1 md:text-display">
          Apply for a resident's parking permit
        </h1>
        <p className="mt-6">
          A resident's parking permit lets you park one vehicle in your permit
          zone, close to where you live, without a time limit.
        </p>
        <p className="mt-4">You can use this service to:</p>
        <ul className="mt-4 list-disc pl-6">
          <li>apply for a first permit</li>
          <li className="mt-2">
            apply for a second permit at the same address
          </li>
          <li className="mt-2">replace a permit when you change vehicle</li>
        </ul>

        <h2 className="mt-10 text-h2">Who can apply</h2>
        <p className="mt-4">You can apply if:</p>
        <ul className="mt-4 list-disc pl-6">
          <li>you live at an address in permit zone A, B, C or D</li>
          <li className="mt-2">
            the vehicle is registered to you at that address, or is a company
            car you are the main driver of
          </li>
          <li className="mt-2">the address has fewer than two permits already</li>
        </ul>
        <p className="mt-4">
          You cannot apply if you live at Linden Yard, because it was built
          without parking.{" "}
          <a href="#" className={textLink}>
            Read who can get a permit and what it costs
          </a>
          .
        </p>

        <h2 className="mt-10 text-h2">Before you start</h2>
        <p className="mt-4">You will need:</p>
        <ul className="mt-4 list-disc pl-6">
          <li>your vehicle's registration number</li>
          <li className="mt-2">the date you want the permit to start</li>
          <li className="mt-2">
            proof of address from the last 3 months, such as a council tax bill
            or a tenancy agreement
          </li>
        </ul>
        <p className="mt-4">
          It takes about 10 minutes to apply. You do not pay until we have
          approved your application.
        </p>
        <p className="mt-4">
          A permit lasts 12 months and costs £30 to £144 a year, depending on
          your vehicle type and whether it is the first or second permit at your
          address.
        </p>

        <p className="mt-10">
          <a
            href="#"
            className={cn(
              buttonVariants(),
              "h-11 w-full px-6 font-mono text-label md:w-auto"
            )}
          >
            Start now
            <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
          </a>
        </p>
        <p className="mt-4">
          You can save your answers and come back to them within 7 days.
        </p>

        <section className="mt-16" aria-labelledby="other-ways">
          <h2 id="other-ways" className="text-h2">
            Other ways to apply
          </h2>
          <p className="mt-4">
            If you cannot use the online service, or you would like help, you
            can apply by phone, in person or by post.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h3 className="text-body font-bold">By phone</h3>
            <p className="mt-2">
              <a href="tel:01632960418" className={cn(textLink, "font-bold")}>
                01632 960 418
              </a>
            </p>
            <p className="mt-2">
              Monday to Friday, 9am to 5pm. Closed on public holidays.
            </p>

            <h3 className="mt-6 text-body font-bold">In person or by post</h3>
            <address className="mt-2 not-italic">
              Parking Services
              <br />
              Callowmere Council
              <br />
              Guildhall
              <br />
              Market Street
              <br />
              Callowmere CM1 1AA
            </address>
            <p className="mt-2">
              The Guildhall counter is open Monday to Friday, 9am to 4pm, and
              has paper application forms.
            </p>
          </div>

          <p className="mt-6">
            If you need this page in another format, such as large print or
            audio, call us on 01632 960 418.
          </p>
        </section>

        <section
          className="mt-16 border-t border-border pt-6"
          aria-labelledby="related"
        >
          <h2 id="related" className="text-h2">
            Related
          </h2>
          <ul className="mt-4">
            {relatedLinks.map((label) => (
              <li key={label}>
                <a href="#" className={listLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className={cn(container, "py-10")}>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6">
              {footerLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={listLink}>
                    {label}
                  </a>
                </li>
              ))}
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
