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
const labelHeading = "font-mono text-label uppercase text-foreground"

const sectionGrid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const sectionDivided =
  "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"

const dlRow =
  "grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
const dtClass = "font-mono text-label uppercase text-muted-foreground"
const ddClass = "col-span-2 text-body"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway", current: true },
  { label: "Insights", href: "/insights/notice-clauses" },
  { label: "Contact", href: "/contact" },
]

const admissions = [
  { year: "2026", text: "Partner, Harrow & Vane LLP" },
  { year: "2019", text: "Higher rights of audience, civil proceedings" },
  { year: "2013", text: "Admitted as a solicitor in England and Wales" },
  { year: "2010", text: "Legal Practice Course, Wexcombe Law School" },
  { year: "2009", text: "LLB Law, University of Wexcombe" },
]

const matters = [
  {
    year: "2026",
    kind: "Warranty claim",
    name: "The sellers of Halden Print",
    summary:
      "Led the defence of a buyer's warranty claim, struck out because its notice arrived one day after the contract's deadline.",
    value: "£3.4m",
  },
  {
    year: "2026",
    kind: "Trial",
    name: "Estley Mills v Brandreth Engineering",
    summary:
      "With David Achterberg, won a claim for a textile mill after a nine-day trial.",
    value: "£6.2m",
  },
  {
    year: "2025",
    kind: "Arbitration",
    name: "Pellam Foods",
    summary:
      "Recovered the cost of a failed packaging contract for a food producer in an arbitration seated in Wexcombe.",
    value: "£1.8m",
  },
]

const briefings = [
  {
    date: "2026-11-10",
    dateText: "10 November 2026",
    readingTime: "8 min read",
    title:
      "Notice clauses after a sale: when a late letter ends a warranty claim",
    href: "/insights/notice-clauses",
  },
  {
    date: "2026-09-17",
    dateText: "17 September 2026",
    readingTime: "6 min read",
    title: "Earn-outs that end in dispute",
    href: "#",
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
        <section className={cn("mt-14 md:mt-28", sectionGrid)}>
          <div className="md:col-span-5">
            <div
              role="img"
              aria-label="Ruth Calloway in a dark suit, standing at a window of the firm's library, her hands folded"
              className="flex aspect-3/4 w-2/3 items-end rounded-xl border border-border bg-card p-8 md:w-full"
            >
              <span
                aria-hidden="true"
                className="font-heading text-display text-muted-foreground"
              >
                RC
              </span>
            </div>
          </div>

          <div className="mt-8 md:col-span-6 md:col-start-7 md:mt-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>
                Partner · Commercial disputes
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                New partner
              </Badge>
            </div>
            <h1 className="mt-4 text-h1 md:text-display">Ruth Calloway</h1>
            <p className="mt-4 max-w-xl text-body">
              Ruth acts in disputes that follow the sale of a company: warranty
              claims, earn-outs and the accounts drawn up at completion. She
              was made a partner in May 2026, fifteen years after she joined
              the firm as a trainee.
            </p>

            <h2 className={cn("mt-8", labelHeading)}>Contact</h2>
            <dl className="mt-4 border-b border-border">
              <div className={dlRow}>
                <dt className={dtClass}>Direct line</dt>
                <dd className={ddClass}>
                  <a href="tel:01632960237" className={textLink}>
                    01632 960 237
                  </a>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dtClass}>Email</dt>
                <dd className={cn(ddClass, "wrap-anywhere")}>
                  <a
                    href="mailto:r.calloway@harrowvane.example"
                    className={textLink}
                  >
                    r.calloway@harrowvane.example
                  </a>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dtClass}>Assistant</dt>
                <dd className={ddClass}>
                  Owen Pryce ·{" "}
                  <a href="tel:01632960238" className={textLink}>
                    01632 960 238
                  </a>
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dtClass}>Office</dt>
                <dd className={ddClass}>4 Chancery Row, Wexcombe</dd>
              </div>
            </dl>

            <div className="mt-8">
              <a
                href="mailto:r.calloway@harrowvane.example"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-8 py-2 font-mono text-label font-normal uppercase"
                )}
              >
                Email Ruth
              </a>
            </div>
          </div>
        </section>

        <section className={cn(sectionDivided, sectionGrid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Experience</h2>
            <p className="mt-4 max-w-xl text-body">
              Ruth acts for the buyers and sellers of owner-managed companies,
              most of them family businesses sold after one or two generations,
              and for the private equity houses that have bought some of them.
              Her clients are usually founders, finance directors and the
              investment managers who sat at the table when the deal was done.
            </p>
            <p className="mt-4 max-w-xl text-body">
              In the first weeks of a claim she reads the sale contract's notice
              and limitation clauses before anything else, because a claim
              served late or in the wrong form can end there. Within two weeks
              the client has her written view of what the claim is worth, what
              it will cost to bring or defend, and how long it is likely to
              take.
            </p>
            <p className="mt-4 max-w-xl text-body">
              Many sale contracts send disputes over completion accounts to an
              expert or to arbitration, and Ruth has acted in both, as well as
              at mediations that settled claims before a hearing. She works
              with the rest of{" "}
              <a href="/practice/commercial-disputes" className={textLink}>
                the Commercial disputes team
              </a>{" "}
              on claims that go to trial.
            </p>
          </div>

          <div className="mt-14 md:col-span-4 md:col-start-9 md:mt-0">
            <h3 className={labelHeading}>Languages</h3>
            <p className="mt-4 text-body">English and German</p>
            <h3 className={cn("mt-8", labelHeading)}>Practice areas</h3>
            <p className="mt-4 text-body">
              Commercial disputes; Corporate (on the sale side of disputes)
            </p>
          </div>
        </section>

        <section className={cn(sectionDivided, sectionGrid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Admissions and education</h2>
            <dl className="mt-8 border-b border-border">
              {admissions.map((item) => (
                <div key={item.year} className={dlRow}>
                  <dt className={cn(dtClass, "tabular-nums")}>
                    <time dateTime={item.year}>{item.year}</time>
                  </dt>
                  <dd className={ddClass}>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className={sectionDivided}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className="mt-8 list-none border-b border-border p-0">
            {matters.map((matter) => (
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
                  <time dateTime={matter.year}>{matter.year}</time> ·{" "}
                  {matter.kind}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl text-body">{matter.summary}</p>
                </div>
                <p className="mt-2 font-mono text-label text-foreground uppercase tabular-nums md:col-span-2 md:mt-0 md:text-right">
                  {matter.value}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={sectionDivided}>
          <h2 className="text-h2">Briefings by Ruth</h2>
          <ul className="mt-8 list-none border-b border-border p-0">
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
                  <time dateTime={briefing.date}>{briefing.dateText}</time> ·{" "}
                  {briefing.readingTime}
                </p>
                <h3 className="mt-2 text-h2 md:col-span-9 md:mt-0">
                  <a href={briefing.href} className={plainLink}>
                    {briefing.title}
                  </a>
                </h3>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-14 border-t border-border py-8 md:mt-28">
        <div className={sectionGrid}>
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address className="mt-2 font-mono text-label text-muted-foreground uppercase not-italic">
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
            <p className={cn("mt-2 wrap-anywhere", label)}>
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
                <li key={link.href} className={cn(index > 0 && "mt-2")}>
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
        <p className={cn("mt-8 text-muted-foreground", label)}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
