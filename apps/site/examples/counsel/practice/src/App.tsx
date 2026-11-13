import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in the header or the footer, and a name or a title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)

const label = "font-mono text-label uppercase"
const mutedLabel = "font-mono text-label text-muted-foreground uppercase"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const dividedSection =
  "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const dlRow =
  "grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"

const navLinks = [
  { name: "Practice", href: "/practice/commercial-disputes", current: true },
  { name: "People", href: "/people/ruth-calloway", current: false },
  { name: "Insights", href: "/insights/notice-clauses", current: false },
  { name: "Contact", href: "/contact", current: false },
]

const typicalMatters = [
  {
    kind: "Contract and supply claims",
    text: "Claims over goods that arrived late, short or out of specification, and over contracts ended before their term.",
  },
  {
    kind: "Warranty claims after a sale",
    text: "Claims by a buyer, or against a seller, when the company sold turns out not to be the one described in the agreement.",
  },
  {
    kind: "Shareholder disputes",
    text: "Deadlock between owners, unfair prejudice petitions and the valuation of a departing shareholder's stake.",
  },
  {
    kind: "Professional negligence",
    text: "Claims against accountants, surveyors and other advisers whose advice cost a company money.",
  },
  {
    kind: "Arbitration",
    text: "Disputes under contracts that send them to a tribunal, from the first notice to the enforcement of the award.",
  },
  {
    kind: "Urgent court orders",
    text: "Freezing orders and injunctions, often within a day or two of the first call.",
  },
]

const recentMatters = [
  {
    year: "2026",
    kind: "Trial",
    name: "Estley Mills v Brandreth Engineering",
    text: "Won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
    led: "Led by David Achterberg with Ruth Calloway",
    value: "£6.2m",
  },
  {
    year: "2026",
    kind: "Warranty claim",
    name: "The sellers of Halden Print",
    text: "A buyer's warranty claim against our clients was struck out because its notice arrived one day after the contract's deadline.",
    led: "Led by Ruth Calloway",
    value: "£3.4m",
  },
  {
    year: "2026",
    kind: "Urgent order",
    name: "Marram Logistics",
    text: "A freezing order against a former director, obtained within 36 hours of the first call.",
    led: "Led by David Achterberg",
    value: "£2.1m",
  },
]

const partners = [
  {
    name: "David Achterberg",
    href: "#",
    initials: "DA",
    portrait:
      "David Achterberg in a grey suit, standing beside the bookshelves of a meeting room.",
    role: "Head of commercial disputes",
    text: "David takes the team's trials and its urgent court orders, and has been a partner since 2007.",
    phone: "01632 960 231",
    email: "d.achterberg@harrowvane.example",
  },
  {
    name: "Ruth Calloway",
    href: "/people/ruth-calloway",
    initials: "RC",
    portrait:
      "Ruth Calloway in a dark suit, at a window of the firm's library.",
    role: "Partner · Commercial disputes",
    text: "Ruth handles the disputes that follow the sale of a company: warranty claims, earn-outs and completion accounts.",
    phone: "01632 960 237",
    email: "r.calloway@harrowvane.example",
  },
]

const briefings = [
  {
    date: "10 November 2026",
    dateTime: "2026-11-10",
    read: "8 min read",
    title:
      "Notice clauses after a sale: when a late letter ends a warranty claim",
    href: "/insights/notice-clauses",
    author: "Ruth Calloway",
  },
  {
    date: "29 October 2026",
    dateTime: "2026-10-29",
    read: "6 min read",
    title: "Freezing orders: the first forty-eight hours",
    href: "#",
    author: "David Achterberg",
  },
  {
    date: "17 September 2026",
    dateTime: "2026-09-17",
    read: "6 min read",
    title: "Earn-outs that end in dispute",
    href: "#",
    author: "Ruth Calloway",
  },
]

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
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, plainLink, link.current && "underline")}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className={cn(grid, "mt-14 md:mt-28")}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-12">
            <p className={mutedLabel}>
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

        <section className={cn(grid, dividedSection)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">What we do</h2>
            <p className="mt-4 max-w-xl text-body">
              We act for owner-managed companies, for the people who buy and
              sell them, and for the banks and funds that lend to them. Most of
              our clients come to us with one dispute that matters a great deal
              to their business, and we treat it that way.
            </p>
            <p className="mt-4 max-w-xl text-body">
              In the first two weeks of a new dispute a partner reads the
              papers, not a summary of them. The client then gets a written
              view of the claim: how strong it is, what it is likely to cost at
              each stage, and what we would do next in their place.
            </p>
            <p className="mt-4 max-w-xl text-body">
              About eight in ten of our claims settle before trial, most of
              them at mediation. They settle because the other side can see
              that the case has been prepared as if it will be tried. Many
              claims are won or lost on a deadline long before that, as{" "}
              <a href="/insights/notice-clauses" className={textLink}>
                our briefing on notice clauses
              </a>{" "}
              explains.
            </p>
          </div>
          <div className="mt-14 md:col-span-4 md:col-start-9 md:mt-0">
            <h3 className="font-mono text-label text-foreground uppercase">
              The team
            </h3>
            <dl className="mt-4 border-b border-border">
              <div className={dlRow}>
                <dt className={mutedLabel}>Partners</dt>
                <dd className="col-span-2 text-body">
                  <span className="font-mono tabular-nums">4</span>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={mutedLabel}>Lawyers</dt>
                <dd className="col-span-2 text-body">
                  <span className="font-mono tabular-nums">16</span>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={mutedLabel}>Head of practice</dt>
                <dd className="col-span-2 text-body">David Achterberg</dd>
              </div>
              <div className={dlRow}>
                <dt className={mutedLabel}>Ranked</dt>
                <dd className="col-span-2 text-body">
                  Band 1, Northern Legal Review, 2026
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={cn(grid, dividedSection)}>
          <h2 className="text-h2 md:col-span-4">Typical matters</h2>
          <ul className="mt-8 list-none border-b border-border md:col-span-8 md:col-start-5 md:mt-0">
            {typicalMatters.map((matter) => (
              <li
                key={matter.kind}
                className="border-t border-border py-4 md:grid md:grid-cols-8 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 md:col-span-3">{matter.kind}</h3>
                <p className="mt-2 text-body md:col-span-5 md:mt-0">
                  {matter.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={dividedSection}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className="mt-8 list-none border-b border-border">
            {recentMatters.map((matter) => (
              <li
                key={matter.name}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(mutedLabel, "md:col-span-3")}>
                  <time dateTime={matter.year} className="tabular-nums">
                    {matter.year}
                  </time>{" "}
                  · {matter.kind}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl text-body">{matter.text}</p>
                  <p className={cn(mutedLabel, "mt-2")}>{matter.led}</p>
                </div>
                <p className="mt-2 font-mono text-label text-foreground uppercase tabular-nums md:col-span-2 md:mt-0 md:text-right">
                  {matter.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={dividedSection}>
          <h2 className="text-h2">Who leads it</h2>
          <ul className={cn(grid, "mt-8 list-none")}>
            {partners.map((partner, index) => (
              <li
                key={partner.name}
                className={cn(
                  "md:col-span-6 md:grid md:grid-cols-6 md:gap-x-8",
                  index > 0 && "mt-14 md:col-start-7 md:mt-0"
                )}
              >
                <div
                  role="img"
                  aria-label={partner.portrait}
                  className="flex aspect-3/4 w-1/2 items-end rounded-xl border border-border bg-card p-4 md:col-span-2 md:w-full"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-h1 text-muted-foreground"
                  >
                    {partner.initials}
                  </span>
                </div>
                <div className="mt-4 md:col-span-4 md:mt-0">
                  <h3 className="text-h2">
                    <a href={partner.href} className={plainLink}>
                      {partner.name}
                    </a>
                  </h3>
                  <p className={cn(mutedLabel, "mt-2")}>{partner.role}</p>
                  <p className="mt-4 text-body">{partner.text}</p>
                  <p className={cn(label, "mt-4")}>
                    <a
                      href={`tel:${partner.phone.replaceAll(" ", "")}`}
                      className={textLink}
                    >
                      {partner.phone}
                    </a>
                  </p>
                  <p className={cn(label, "mt-2")}>
                    <a
                      href={`mailto:${partner.email}`}
                      className={cn(textLink, "normal-case")}
                    >
                      {partner.email}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={dividedSection}>
          <h2 className="text-h2">Related briefings</h2>
          <ul className="mt-8 list-none border-b border-border">
            {briefings.map((briefing) => (
              <li
                key={briefing.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(mutedLabel, "md:col-span-3")}>
                  <time dateTime={briefing.dateTime}>{briefing.date}</time> ·{" "}
                  {briefing.read}
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href={briefing.href} className={plainLink}>
                      {briefing.title}
                    </a>
                  </h3>
                  <p className={cn(mutedLabel, "mt-2")}>{briefing.author}</p>
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

        <section className={cn(grid, dividedSection)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Speak to the team</h2>
            <p className="mt-4 max-w-xl text-body">
              Send us the outline of the dispute and any deadline you know of.
              A partner replies within one working day.
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
              className={cn(mutedLabel, "mt-2 not-italic")}
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
                <li key={link.name} className={cn(index > 0 && "mt-2")}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
                      plainLink,
                      link.current && "underline"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(mutedLabel, "mt-8")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
