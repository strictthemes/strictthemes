import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

// A link in the header or footer, or a name or title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { name: "Practice", href: "/practice/commercial-disputes", current: true },
  { name: "People", href: "/people/ruth-calloway", current: false },
  { name: "Insights", href: "/insights/notice-clauses", current: false },
  { name: "Contact", href: "/contact", current: false },
]

const typicalMatters = [
  {
    kind: "Contract and supply claims",
    text: "Goods that arrive late or fail their specification, unpaid invoices and supply agreements ended without proper notice.",
  },
  {
    kind: "Warranty claims after a sale",
    text: "Claims by a buyer that the accounts, the stock or the contracts were not as the sale agreement promised, for either side.",
  },
  {
    kind: "Shareholder disputes",
    text: "Deadlock between owners, unfair prejudice petitions and the valuation of a departing shareholder's stake.",
  },
  {
    kind: "Professional negligence",
    text: "Claims against accountants, surveyors and other advisers whose advice cost a business money.",
  },
  {
    kind: "Arbitration",
    text: "Contract disputes heard in private under institutional or ad hoc rules, where the parties chose that route.",
  },
  {
    kind: "Urgent court orders",
    text: "Freezing orders and injunctions, often obtained within a day or two of the first call.",
  },
]

const recentMatters = [
  {
    kind: "Trial",
    name: "Estley Mills v Brandreth Engineering",
    text: "Won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
    lead: "David Achterberg with Ruth Calloway",
    value: "£6.2m",
  },
  {
    kind: "Warranty claim",
    name: "The sellers of Halden Print",
    text: "A buyer's warranty claim against our clients was struck out because its notice arrived one day after the contract's deadline.",
    lead: "Ruth Calloway",
    value: "£3.4m",
  },
  {
    kind: "Urgent order",
    name: "Marram Logistics",
    text: "A freezing order against a former director, obtained within 36 hours of the first call.",
    lead: "David Achterberg",
    value: "£2.1m",
  },
]

const partners = [
  {
    name: "David Achterberg",
    initials: "DA",
    href: "#",
    role: "Head of commercial disputes",
    text: "David runs the team's trials and its urgent court orders, from freezing orders to injunctions.",
    phone: "01632 960 231",
    email: "d.achterberg@harrowvane.example",
    portrait:
      "David Achterberg in a charcoal suit, standing beside a shelf of law reports in the firm's library.",
  },
  {
    name: "Ruth Calloway",
    initials: "RC",
    href: "/people/ruth-calloway",
    role: "Partner · Commercial disputes",
    text: "Ruth handles the disputes that follow the sale of a company, for buyers and for sellers.",
    phone: "01632 960 237",
    email: "r.calloway@harrowvane.example",
    portrait:
      "Ruth Calloway in a dark suit, seated at a meeting table by a window overlooking Chancery Row.",
  },
]

const briefings = [
  {
    date: "2026-11-10",
    dateText: "10 November 2026",
    read: "8 min read",
    title: "Notice clauses after a sale: when a late letter ends a warranty claim",
    author: "Ruth Calloway",
    href: "/insights/notice-clauses",
  },
  {
    date: "2026-10-29",
    dateText: "29 October 2026",
    read: "6 min read",
    title: "Freezing orders: the first forty-eight hours",
    author: "David Achterberg",
    href: "#",
  },
  {
    date: "2026-09-17",
    dateText: "17 September 2026",
    read: "6 min read",
    title: "Earn-outs that end in dispute",
    author: "Ruth Calloway",
    href: "#",
  },
]

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const section = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const entry = "border-t border-border"
const entryList = "list-none border-b border-border p-0"

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex list-none flex-wrap gap-x-4 gap-y-2 p-0 md:gap-x-8">
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
        {/* Opening */}
        <section className={cn(grid, "mt-14 md:mt-28")}>
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
          <p className="mt-8 max-w-xl text-body md:col-span-7 md:col-start-1">
            When a contract, a sale or a partnership goes wrong, we work out
            what the claim is worth before anyone spends money on it, and then
            we pursue it or defend it to the end.
          </p>
        </section>

        {/* What we do */}
        <section className={cn(grid, section)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">What we do</h2>
            <p className="mt-4 max-w-xl text-body">
              We act for owner-managed companies, for the people who buy and
              sell them, and for the banks and funds that lend to them. Our
              work runs through the courts, through arbitration and through
              mediation, and most of it starts with a contract that one side
              says the other has broken.
            </p>
            <p className="mt-4 max-w-xl text-body">
              In the first two weeks of a new dispute, a partner reads the
              papers in full. You then get a written view of the claim: how
              strong it is, what it is likely to recover or cost, and what it
              will cost to run to trial. You decide what to do next with those
              numbers in front of you.
            </p>
            <p className="mt-4 max-w-xl text-body">
              About eight in ten of our claims settle before trial, most of
              them at mediation. They settle because both sides see the same
              figures early, and because the other side knows we are ready to
              go to trial. Many disputes turn on a deadline in the contract;{" "}
              <a href="/insights/notice-clauses" className={textLink}>
                our briefing on notice clauses
              </a>{" "}
              explains the most common one.
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
        <section className={cn(grid, section)}>
          <h2 className="text-h2 md:col-span-4">Typical matters</h2>
          <ul
            className={cn(
              entryList,
              "mt-8 md:col-span-8 md:col-start-5 md:mt-0"
            )}
          >
            {typicalMatters.map((m) => (
              <li
                key={m.kind}
                className={cn(
                  entry,
                  "py-4 md:grid md:grid-cols-8 md:items-baseline md:gap-x-8"
                )}
              >
                <h3 className="text-h2 md:col-span-3">{m.kind}</h3>
                <p className="mt-2 max-w-xl text-body md:col-span-5 md:mt-0">
                  {m.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent matters */}
        <section className={section}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className={cn(entryList, "mt-8")}>
            {recentMatters.map((m) => (
              <li
                key={m.name}
                className={cn(
                  entry,
                  "py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
                )}
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:col-span-3"
                  )}
                >
                  <time dateTime="2026">2026</time> · {m.kind}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{m.name}</h3>
                  <p className="mt-2 max-w-xl text-body">{m.text}</p>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    Led by {m.lead}
                  </p>
                </div>
                <p
                  className={cn(
                    label,
                    "mt-2 text-foreground tabular-nums md:col-span-2 md:mt-0 md:text-right"
                  )}
                >
                  {m.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Who leads it */}
        <section className={section}>
          <h2 className="text-h2">Who leads it</h2>
          <ul className={cn(grid, "mt-8 list-none p-0")}>
            {partners.map((p, i) => (
              <li
                key={p.name}
                className={cn(
                  "md:grid md:grid-cols-6 md:gap-x-8",
                  i === 0
                    ? "md:col-span-6"
                    : "mt-14 md:col-span-6 md:col-start-7 md:mt-0"
                )}
              >
                <div className="md:col-span-2">
                  <div
                    role="img"
                    aria-label={p.portrait}
                    className="flex aspect-3/4 w-1/2 items-end rounded-xl border border-border bg-card p-4 md:w-full"
                  >
                    <span
                      aria-hidden="true"
                      className="font-heading text-h1 text-muted-foreground"
                    >
                      {p.initials}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:col-span-4 md:mt-0">
                  <h3 className="text-h2">
                    <a href={p.href} className={plainLink}>
                      {p.name}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {p.role}
                  </p>
                  <p className="mt-4 max-w-xl text-body">{p.text}</p>
                  <p className={cn(label, "mt-4")}>
                    <a
                      href={`tel:${p.phone.replace(/\s/g, "")}`}
                      className={textLink}
                    >
                      {p.phone}
                    </a>
                  </p>
                  <p className={cn(label, "mt-2 wrap-anywhere")}>
                    <a
                      href={`mailto:${p.email}`}
                      className={cn(textLink, "normal-case")}
                    >
                      {p.email}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Related briefings */}
        <section className={section}>
          <h2 className="text-h2">Related briefings</h2>
          <ul className={cn(entryList, "mt-8")}>
            {briefings.map((b) => (
              <li
                key={b.title}
                className={cn(
                  entry,
                  "py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
                )}
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:col-span-3"
                  )}
                >
                  <time dateTime={b.date}>{b.dateText}</time> · {b.read}
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href={b.href} className={plainLink}>
                      {b.title}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {b.author}
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
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </p>
        </section>

        {/* Speak to the team */}
        <section className={cn(grid, section)}>
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
            <ul className="list-none p-0">
              {navLinks.map((link, i) => (
                <li key={link.name} className={i > 0 ? "mt-2" : undefined}>
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
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
