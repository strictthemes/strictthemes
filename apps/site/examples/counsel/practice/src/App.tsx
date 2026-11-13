import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text.
const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focus}`

// A link in the header or footer, and a name or title that is a link.
const plainLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focus}`

const label = "font-mono text-label uppercase"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes", current: true },
  { label: "People", href: "/people/ruth-calloway", current: false },
  { label: "Insights", href: "/insights/notice-clauses", current: false },
  { label: "Contact", href: "/contact", current: false },
]

const sectionDivided = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"

const typicalMatters = [
  {
    title: "Contract and supply claims",
    text: "Claims over goods that arrived late, short or not to specification, and over contracts one side has stopped performing.",
  },
  {
    title: "Warranty claims after a sale",
    text: "Claims by a buyer that the business it bought was not as the sale agreement described, brought or defended within the contract's time limits.",
  },
  {
    title: "Shareholder disputes",
    text: "Deadlock between owners, unfair prejudice petitions and the buying out of a shareholder who wants to leave or has been pushed out.",
  },
  {
    title: "Professional negligence",
    text: "Claims against accountants, surveyors and other advisers whose advice cost a company money.",
  },
  {
    title: "Arbitration",
    text: "Disputes heard in private under an arbitration clause, in England or abroad, from the notice of arbitration to the award.",
  },
  {
    title: "Urgent court orders",
    text: "Freezing orders and injunctions to stop assets moving or a breach going on, often obtained within a day or two.",
  },
]

const recentMatters = [
  {
    name: "Estley Mills v Brandreth Engineering",
    kind: "Trial",
    text: "We won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
    led: "Led by David Achterberg with Ruth Calloway",
    value: "£6.2m",
  },
  {
    name: "The sellers of Halden Print",
    kind: "Warranty claim",
    text: "A buyer's warranty claim against our clients was struck out because its notice arrived one day after the contract's deadline.",
    led: "Led by Ruth Calloway",
    value: "£3.4m",
  },
  {
    name: "Marram Logistics",
    kind: "Urgent order",
    text: "We obtained a freezing order against a former director within 36 hours of the first call.",
    led: "Led by David Achterberg",
    value: "£2.1m",
  },
]

const partners = [
  {
    name: "David Achterberg",
    initials: "DA",
    href: "#",
    role: "Head of commercial disputes",
    text: "David handles the team's trials and its urgent court orders, from freezing orders to injunctions.",
    phone: "01632 960 231",
    email: "d.achterberg@harrowvane.example",
    portrait:
      "David Achterberg in a grey suit, standing by a tall bookcase in the firm's meeting room.",
  },
  {
    name: "Ruth Calloway",
    initials: "RC",
    href: "/people/ruth-calloway",
    role: "Partner · Commercial disputes",
    text: "Ruth handles disputes that follow the sale of a company, for buyers and for sellers.",
    phone: "01632 960 237",
    email: "r.calloway@harrowvane.example",
    portrait:
      "Ruth Calloway in a dark suit, at a window of the firm's library.",
  },
]

const briefings = [
  {
    title:
      "Notice clauses after a sale: when a late letter ends a warranty claim",
    date: "10 November 2026",
    dateTime: "2026-11-10",
    read: "8 min read",
    author: "Ruth Calloway",
    href: "/insights/notice-clauses",
  },
  {
    title: "Freezing orders: the first forty-eight hours",
    date: "29 October 2026",
    dateTime: "2026-10-29",
    read: "6 min read",
    author: "David Achterberg",
    href: "#",
  },
  {
    title: "Earn-outs that end in dispute",
    date: "17 September 2026",
    dateTime: "2026-09-17",
    read: "6 min read",
    author: "Ruth Calloway",
    href: "#",
  },
]

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`
}

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, plainLink, link.current && "underline")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* Opening */}
        <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-12">
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Practice area · 4 partners · 16 lawyers
            </p>
            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
              Ranked 2026
            </Badge>
          </div>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Commercial disputes
          </h1>
          <p className="mt-8 max-w-xl text-body md:col-span-7 md:col-start-1">
            When a contract, a sale or a partnership goes wrong, we work out
            what the claim is worth before anyone spends money on it, and then
            we pursue it or defend it to the end.
          </p>
        </section>

        {/* What we do */}
        <section
          className={cn(
            sectionDivided,
            "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
          )}
        >
          <div className="md:col-span-7">
            <h2 className="text-h2">What we do</h2>
            <p className="mt-4 max-w-xl text-body">
              We act for owner-managed companies, for the people who buy and
              sell them, and for the banks and other lenders who fund them. We
              take their disputes to court, to arbitration and to mediation, and
              we act on either side.
            </p>
            <p className="mt-4 max-w-xl text-body">
              In the first two weeks of a new dispute, a partner reads the
              papers in full. The client then gets a written view of the claim's
              merits, what it is likely to cost to run, and what we would do
              next.
            </p>
            <p className="mt-4 max-w-xl text-body">
              About eight in ten of our claims settle before trial, most of them
              at mediation, because both sides know early what the case is
              worth. Many turn on a single clause and a single date, as{" "}
              <a href="/insights/notice-clauses" className={textLink}>
                our briefing on notice clauses
              </a>{" "}
              explains.
            </p>
          </div>
          <div className="mt-14 md:col-span-4 md:col-start-9 md:mt-0">
            <h3 className={cn(label, "text-foreground")}>The team</h3>
            <dl className="mt-4 border-b border-border">
              <div className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4">
                <dt className={cn(label, "text-muted-foreground")}>Partners</dt>
                <dd className="col-span-2 font-mono text-body tabular-nums">
                  4
                </dd>
              </div>
              <div className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4">
                <dt className={cn(label, "text-muted-foreground")}>Lawyers</dt>
                <dd className="col-span-2 font-mono text-body tabular-nums">
                  16
                </dd>
              </div>
              <div className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4">
                <dt className={cn(label, "text-muted-foreground")}>
                  Head of practice
                </dt>
                <dd className="col-span-2 text-body">David Achterberg</dd>
              </div>
              <div className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4">
                <dt className={cn(label, "text-muted-foreground")}>Ranked</dt>
                <dd className="col-span-2 text-body">
                  Band 1, Northern Legal Review, 2026
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Typical matters */}
        <section
          className={cn(
            sectionDivided,
            "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
          )}
        >
          <h2 className="text-h2 md:col-span-4">Typical matters</h2>
          <ul className="mt-8 border-b border-border md:col-span-8 md:col-start-5 md:mt-0">
            {typicalMatters.map((matter) => (
              <li
                key={matter.title}
                className="border-t border-border py-4 md:grid md:grid-cols-8 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 md:col-span-3">{matter.title}</h3>
                <p className="mt-2 text-body md:col-span-5 md:mt-0">
                  {matter.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent matters */}
        <section className={sectionDivided}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className="mt-8 border-b border-border">
            {recentMatters.map((matter) => (
              <li
                key={matter.name}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:col-span-3"
                  )}
                >
                  <time dateTime="2026">2026</time> · {matter.kind}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl text-body">{matter.text}</p>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {matter.led}
                  </p>
                </div>
                <p className="mt-2 font-mono text-label text-foreground tabular-nums md:col-span-2 md:mt-0 md:text-right">
                  {matter.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Who leads it */}
        <section className={sectionDivided}>
          <h2 className="text-h2">Who leads it</h2>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
            {partners.map((person, index) => (
              <li
                key={person.name}
                className={cn(
                  "md:grid md:grid-cols-6 md:gap-x-8",
                  index === 0
                    ? "md:col-span-6"
                    : "mt-14 md:col-span-6 md:col-start-7 md:mt-0"
                )}
              >
                <div className="md:col-span-2">
                  <div
                    role="img"
                    aria-label={person.portrait}
                    className="flex aspect-3/4 w-1/2 items-end rounded-xl border border-border bg-card p-4 md:w-full"
                  >
                    <span
                      aria-hidden="true"
                      className="font-heading text-h1 text-muted-foreground"
                    >
                      {person.initials}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:col-span-4 md:mt-0">
                  <h3 className="text-h2">
                    <a href={person.href} className={plainLink}>
                      {person.name}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {person.role}
                  </p>
                  <p className="mt-4 max-w-xl text-body">{person.text}</p>
                  <p className={cn(label, "mt-4 tabular-nums")}>
                    <a href={telHref(person.phone)} className={textLink}>
                      {person.phone}
                    </a>
                  </p>
                  <p className={cn(label, "mt-2 wrap-anywhere")}>
                    <a
                      href={`mailto:${person.email}`}
                      className={cn(textLink, "normal-case")}
                    >
                      {person.email}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Related briefings */}
        <section className={sectionDivided}>
          <h2 className="text-h2">Related briefings</h2>
          <ul className="mt-8 border-b border-border">
            {briefings.map((briefing) => (
              <li
                key={briefing.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:col-span-3"
                  )}
                >
                  <time dateTime={briefing.dateTime}>{briefing.date}</time> ·{" "}
                  {briefing.read}
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href={briefing.href} className={plainLink}>
                      {briefing.title}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {briefing.author}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href="#"
              className={cn(label, textLink, "inline-flex items-center gap-2")}
            >
              All briefings
              <ArrowRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </p>
        </section>

        {/* Speak to the team */}
        <section
          className={cn(
            sectionDivided,
            "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
          )}
        >
          <div className="md:col-span-7">
            <h2 className="text-h2">Speak to the team</h2>
            <p className="mt-4 max-w-xl text-body">
              Send us the outline of the dispute and any deadline you know of,
              and a partner will reply within one working day.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-8 py-2 font-mono text-label font-normal uppercase"
                )}
              >
                Speak to the team
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-14 border-t border-border py-8 md:mt-28">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address className="mt-2 font-mono text-label text-muted-foreground uppercase not-italic">
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={cn(label, "tabular-nums")}>
              <a href="tel:01632960214" className={plainLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2 wrap-anywhere")}>
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn(plainLink, "normal-case")}
              >
                enquiries@harrowvane.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link, index) => (
                <li key={link.href} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
                      plainLink,
                      link.current && "underline"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground tabular-nums")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
