import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in the header or the footer, and a name or a title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes", current: true },
  { label: "People", href: "/people/ruth-calloway", current: false },
  { label: "Insights", href: "/insights/notice-clauses", current: false },
  { label: "Contact", href: "/contact", current: false },
]

const typicalMatters = [
  {
    title: "Contract and supply claims",
    text: "Goods that arrived late, short or faulty, and supply agreements ended without the notice they required.",
  },
  {
    title: "Warranty claims after a sale",
    text: "Claims by a buyer that the accounts, the stock or the order book were not as the seller warranted.",
  },
  {
    title: "Shareholder disputes",
    text: "Deadlock between founders, unfair prejudice petitions and the price of a departing shareholder's stake.",
  },
  {
    title: "Professional negligence",
    text: "Claims against accountants, surveyors and other advisers whose advice cost a business money.",
  },
  {
    title: "Arbitration",
    text: "Contract disputes heard in private under the rules the parties chose, from the first notice to the award.",
  },
  {
    title: "Urgent court orders",
    text: "Freezing orders and injunctions to stop assets or documents leaving, often obtained within a day or two.",
  },
]

const recentMatters = [
  {
    name: "Estley Mills v Brandreth Engineering",
    kind: "Trial",
    value: "£6.2m",
    leads: "David Achterberg and Ruth Calloway",
    text: "We won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
  },
  {
    name: "The sellers of Halden Print",
    kind: "Warranty claim",
    value: "£3.4m",
    leads: "Ruth Calloway",
    text: "A buyer's warranty claim against our clients was struck out because its notice arrived one day after the contract's deadline.",
  },
  {
    name: "Marram Logistics",
    kind: "Urgent order",
    value: "£2.1m",
    leads: "David Achterberg",
    text: "We obtained a freezing order against a former director within 36 hours of the client's first call.",
  },
]

const partners = [
  {
    name: "David Achterberg",
    initials: "DA",
    href: "#",
    role: "Head of commercial disputes",
    text: "David runs the team's trials and its urgent court orders, and has led it since 2007.",
    phone: "01632 960 231",
    email: "d.achterberg@harrowvane.example",
    portrait:
      "David Achterberg in a grey suit, standing beside the bookshelves of the firm's library.",
  },
  {
    name: "Ruth Calloway",
    initials: "RC",
    href: "/people/ruth-calloway",
    role: "Partner · Commercial disputes",
    text: "Ruth handles the disputes that follow the sale of a company, for buyers and sellers alike.",
    phone: "01632 960 237",
    email: "r.calloway@harrowvane.example",
    portrait:
      "Ruth Calloway in a dark suit, seated at a window of the firm's meeting room.",
  },
]

const briefings = [
  {
    title:
      "Notice clauses after a sale: when a late letter ends a warranty claim",
    date: "2026-11-10",
    dateText: "10 November 2026",
    read: "8 min read",
    author: "Ruth Calloway",
    href: "/insights/notice-clauses",
  },
  {
    title: "Freezing orders: the first forty-eight hours",
    date: "2026-10-29",
    dateText: "29 October 2026",
    read: "6 min read",
    author: "David Achterberg",
    href: "#",
  },
  {
    title: "Earn-outs that end in dispute",
    date: "2026-09-17",
    dateText: "17 September 2026",
    read: "6 min read",
    author: "Ruth Calloway",
    href: "#",
  },
]

const sectionDivided = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const entryList = "list-none border-b border-border p-0"

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
              <li key={link.label}>
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
        <section className={cn("mt-14 md:mt-28", grid)}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-12">
            <p className={cn(label, "text-muted-foreground")}>
              Practice area · 4 partners · 16 lawyers
            </p>
            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
              Ranked 2026
            </Badge>
          </div>
          <h1 className="mt-4 text-h1 md:col-span-9 md:text-display">
            Commercial disputes
          </h1>
          <p className="mt-8 max-w-xl md:col-span-7 md:col-start-1">
            When a contract, a sale or a partnership goes wrong, we work out
            what the claim is worth before anyone spends money on it, and then
            we pursue it or defend it to the end.
          </p>
        </section>

        {/* What we do */}
        <section className={cn(sectionDivided, grid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">What we do</h2>
            <p className="mt-4 max-w-xl">
              We act for owner-managed companies, for the people who buy and
              sell them, and for the banks and lenders who finance them. We take
              their disputes to court, to arbitration and to mediation, and we
              act for claimants and defendants in roughly equal numbers.
            </p>
            <p className="mt-4 max-w-xl">
              In the first two weeks of a new dispute, a partner reads the
              papers in full. The client then gets a written view of the claim:
              how strong it is, what it is likely to recover or cost, and what
              each step to trial would cost in fees.
            </p>
            <p className="mt-4 max-w-xl">
              Most of our claims settle before trial, nine in ten of them,
              because both sides see the same numbers early. Many turn on a
              single clause and a single date; for one example, read{" "}
              <a href="/insights/notice-clauses" className={textLink}>
                our briefing on notice clauses
              </a>
              .
            </p>
          </div>
          <div className="mt-14 md:col-span-4 md:col-start-9 md:mt-0">
            <h3 className={cn(label, "text-foreground")}>The team</h3>
            <dl className="mt-4 border-b border-border">
              {[
                {
                  term: "Partners",
                  value: <span className="font-mono tabular-nums">4</span>,
                },
                {
                  term: "Lawyers",
                  value: <span className="font-mono tabular-nums">16</span>,
                },
                { term: "Head of practice", value: "David Achterberg" },
                {
                  term: "Ranked",
                  value: "Band 1, Northern Legal Review, 2026",
                },
              ].map((row) => (
                <div
                  key={row.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={cn(label, "text-muted-foreground")}>
                    {row.term}
                  </dt>
                  <dd className="col-span-2 text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Typical matters */}
        <section className={cn(sectionDivided, grid)}>
          <h2 className="text-h2 md:col-span-4">Typical matters</h2>
          <ul
            className={cn(
              entryList,
              "mt-8 md:col-span-8 md:col-start-5 md:mt-0"
            )}
          >
            {typicalMatters.map((matter) => (
              <li
                key={matter.title}
                className="border-t border-border py-4 md:grid md:grid-cols-8 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 md:col-span-3">{matter.title}</h3>
                <p className="mt-2 md:col-span-5 md:mt-0">{matter.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent matters */}
        <section className={sectionDivided}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className={cn(entryList, "mt-8")}>
            {recentMatters.map((matter) => (
              <li
                key={matter.name}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                  <time dateTime="2026">2026</time> · {matter.kind}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl">{matter.text}</p>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    Led by {matter.leads}
                  </p>
                </div>
                <p
                  className={cn(
                    label,
                    "mt-2 text-foreground tabular-nums md:col-span-2 md:mt-0 md:text-right"
                  )}
                >
                  {matter.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Who leads it */}
        <section className={sectionDivided}>
          <h2 className="text-h2">Who leads it</h2>
          <ul className={cn("mt-8 list-none p-0", grid)}>
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
                <div
                  role="img"
                  aria-label={person.portrait}
                  className="flex aspect-3/4 w-1/2 items-end rounded-xl border border-border bg-card p-4 md:col-span-2 md:w-full"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-h1 text-muted-foreground"
                  >
                    {person.initials}
                  </span>
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
                  <p className="mt-4">{person.text}</p>
                  <p className={cn(label, "mt-4")}>
                    <a
                      href={`tel:${person.phone.replace(/\s/g, "")}`}
                      className={textLink}
                    >
                      {person.phone}
                    </a>
                  </p>
                  <p className={cn(label, "mt-2")}>
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
          <ul className={cn(entryList, "mt-8")}>
            {briefings.map((briefing) => (
              <li
                key={briefing.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                  <time dateTime={briefing.date}>{briefing.dateText}</time> ·{" "}
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
        <section className={cn(sectionDivided, grid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Speak to the team</h2>
            <p className="mt-4 max-w-xl">
              Send us an outline of the dispute and any deadline you know of,
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
        <div className={grid}>
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address
              className={cn(label, "mt-2 text-muted-foreground not-italic")}
            >
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={label}>
              <a href="tel:01632960214" className={plainLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2")}>
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
                <li key={link.label} className={index > 0 ? "mt-2" : undefined}>
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
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
