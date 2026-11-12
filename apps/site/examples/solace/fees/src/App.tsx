import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinkClass = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150",
  focusOutline
)

const textLinkClass = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors duration-150",
  focusOutline
)

const card = "rounded-xl border border-border bg-card p-7"

const navLinks = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]

const currentHref = "/fees"

const sessions = [
  {
    name: "Introductory call",
    how: "By phone or video",
    length: "20 minutes",
    fee: "Free",
  },
  {
    name: "First session",
    how: "In person or online",
    length: "50 minutes",
    fee: "£68",
  },
  {
    name: "Weekly session",
    how: "In person or online",
    length: "50 minutes",
    fee: "£68",
  },
  {
    name: "Longer session",
    how: "By arrangement",
    length: "80 minutes",
    fee: "£102",
  },
  {
    name: "Reduced-fee session",
    how: "Ask me when you write",
    length: "50 minutes",
    fee: "£42",
  },
]

const questions = [
  {
    q: "How long would I come for?",
    a: "There is no set length. Some people come for eight or ten sessions, some for a year or longer. Every sixth session we look at whether it is still useful to you.",
  },
  {
    q: "Do I need a referral from my doctor?",
    a: "No. You can write to me yourself. I do not contact your doctor unless you ask me to.",
  },
  {
    q: "Can I use health insurance?",
    a: "I do not bill insurers. I can give you a receipt each month, and some policies pay you back. Your insurer can tell you whether yours does.",
  },
  {
    q: "What if I am late?",
    a: "The session still ends at its usual time, so that the next person is not kept waiting. The fee is the same.",
  },
  {
    q: "What if I am ill, or away?",
    a: "Tell me 48 hours before, and there is no charge. If you are too unwell to travel but well enough to talk, we can meet online instead.",
  },
  {
    q: "Do you take holidays?",
    a: "Yes, about six weeks a year. I give you the dates at least a month ahead. You do not pay for sessions I cancel.",
  },
  {
    q: "Is what I say confidential?",
    a: "Yes. What you say stays between us. There are a few limits, which are about safety and the law, and I explain them before we begin.",
  },
  {
    q: "Can we change from in person to online?",
    a: "Yes. Tell me the day before, and I send you a video link. The time and the fee stay the same.",
  },
]

function NavList({ className }: { className: string }) {
  return (
    <ul className={className}>
      {navLinks.map((link) => {
        const current = link.href === currentHref
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(navLinkClass, current && "underline")}
            >
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function App() {
  const [open, setOpen] = useState<Set<number>>(() => new Set())

  function toggle(n: number) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-[1136px] px-4 text-body text-foreground md:px-7">
      <header className="flex flex-wrap items-center gap-x-7 py-4">
        <a
          href="/"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focusOutline
          )}
        >
          Nora Ellingham
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <NavList className="flex flex-wrap gap-x-4 md:gap-x-7" />
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="opening-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <p className="font-mono text-label text-muted-foreground md:col-span-12">
            Fees from <time dateTime="2027-01-01">1 January 2027</time>
          </p>
          <h1
            id="opening-heading"
            className="mt-4 text-h1 md:col-span-9 md:text-display"
          >
            Fees, <em className="italic">said plainly</em>
          </h1>
          <p className="mt-7 max-w-xl md:col-span-7 md:col-start-1">
            Here is what a session costs, how to pay and how to cancel. If
            something is not answered here, ask me. It is an ordinary question.
          </p>
        </section>

        <section
          aria-labelledby="costs-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <h2 id="costs-heading" className="text-h2">
              What sessions cost
            </h2>
            <table className="mt-7 w-full border-collapse border-b border-border text-left">
              <caption className="sr-only">
                Session types, with their length and fee
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-2 pr-4 font-mono text-label font-normal text-muted-foreground"
                  >
                    Session
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-4 font-mono text-label font-normal text-muted-foreground"
                  >
                    Length
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-0 text-right font-mono text-label font-normal text-muted-foreground"
                  >
                    Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.name} className="border-t border-border">
                    <th
                      scope="row"
                      className="py-4 pr-4 align-baseline text-body font-normal text-foreground"
                    >
                      {s.name}
                      <span className="mt-2 block font-mono text-label text-muted-foreground">
                        {s.how}
                      </span>
                    </th>
                    <td className="py-4 pr-4 align-baseline font-mono text-label whitespace-nowrap text-foreground">
                      {s.length}
                    </td>
                    <td className="py-4 pr-0 text-right align-baseline font-mono text-label whitespace-nowrap text-foreground tabular-nums">
                      {s.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-mono text-label text-muted-foreground">
              Fees are reviewed each January. I tell you two months before any
              change.
            </p>
          </div>

          <div
            className={cn(
              card,
              "mt-12 md:col-span-4 md:col-start-9 md:mt-0 md:self-start"
            )}
          >
            <h3 className="text-h2">If the fee is a worry</h3>
            <p className="mt-4">
              Say so when you write. I keep some sessions at £42 for people on a
              low income, and I will tell you plainly whether I can offer one.
            </p>
          </div>
        </section>

        <div className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <section
            aria-labelledby="cancel-heading"
            className={cn(card, "md:col-span-6")}
          >
            <p className="font-mono text-label text-muted-foreground">
              48 hours' notice
            </p>
            <h2 id="cancel-heading" className="mt-4 text-h2">
              How to cancel
            </h2>
            <p className="mt-4">
              Write to me at least 48 hours before your session, and there is no
              charge.
            </p>
            <p className="mt-4">
              Inside 48 hours I charge the full fee. I hold that time for you,
              and I cannot offer it to someone else at short notice.
            </p>
            <p className="mt-4">
              If I have to cancel, I tell you as early as I can, and you pay
              nothing.
            </p>
          </section>
          <section
            aria-labelledby="pay-heading"
            className={cn(card, "mt-4 md:col-span-6 md:col-start-7 md:mt-0")}
          >
            <p className="font-mono text-label text-muted-foreground">
              One invoice a month
            </p>
            <h2 id="pay-heading" className="mt-4 text-h2">
              How to pay
            </h2>
            <p className="mt-4">
              I send one invoice by email on the last Friday of each month, for
              the sessions we had.
            </p>
            <p className="mt-4">
              You pay by bank transfer within 14 days. The details are on the
              invoice.
            </p>
            <p className="mt-4">
              I do not take cash or cards in the room. That keeps money out of
              the session.
            </p>
          </section>
        </div>

        <section
          aria-labelledby="questions-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-8">
            <h2 id="questions-heading" className="text-h2">
              Questions people ask
            </h2>
            <p className="mt-4 max-w-xl">
              Eight of them. Open the ones you need.
            </p>
            <ul className="mt-7 list-none border-b border-border p-0">
              {questions.map((item, i) => {
                const n = i + 1
                const isOpen = open.has(n)
                const Icon = isOpen ? Minus : Plus
                return (
                  <li key={n} className="border-t border-border">
                    <h3 className="text-h2">
                      <button
                        type="button"
                        id={`question-${n}`}
                        aria-expanded={isOpen}
                        aria-controls={`answer-${n}`}
                        onClick={() => toggle(n)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-heading text-h2 text-foreground transition-colors duration-150 hover:text-muted-foreground",
                          focusOutline
                        )}
                      >
                        <span>{item.q}</span>
                        <Icon
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>
                    <div
                      id={`answer-${n}`}
                      hidden={!isOpen}
                      className="pb-4"
                    >
                      <p className="max-w-xl">{item.a}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="start-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className={cn(card, "md:col-span-7")}>
            <h2 id="start-heading" className="text-h2">
              If you would like to start
            </h2>
            <p className="mt-4 max-w-xl">
              Write to me with the form. The first call is free, and nothing is
              charged until we have met for a first session.
            </p>
            <div className="mt-7">
              <a
                href="/first-session"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-7 py-2 text-body"
                )}
              >
                Request a first session
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className="mt-2 font-mono text-label text-muted-foreground">
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2">
              <a href="mailto:hello@ellingham.example" className={textLinkClass}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <NavList className="list-none p-0" />
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className="mt-4 font-mono text-label text-muted-foreground">
          © 2027 Nora Ellingham
        </p>
      </footer>
    </div>
  )
}

export default App
