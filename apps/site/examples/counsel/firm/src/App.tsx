import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses" },
  { label: "Contact", href: "/contact" },
]

const practiceAreas = [
  {
    name: "Corporate",
    href: "#",
    text: "Sales and purchases of companies, investment rounds and the shareholder agreements that follow them.",
  },
  {
    name: "Commercial disputes",
    href: "/practice/commercial-disputes",
    text: "Contract and supply claims, warranty claims after a sale, and urgent court orders when an asset is at risk.",
    badge: "Ranked 2026",
  },
  {
    name: "Employment",
    href: "#",
    text: "Contracts, restrictive covenants, team moves between competitors and claims before the employment tribunal.",
  },
  {
    name: "Real estate",
    href: "#",
    text: "Leases, development sites and the property side of a company sale, from heads of terms to completion.",
  },
  {
    name: "Private client",
    href: "#",
    text: "Wills, trusts and succession planning for business owners and the families who will inherit the business.",
  },
]

const figures = [
  { term: "Founded", value: <time dateTime="1952">1952</time> },
  { term: "Partners", value: "14" },
  { term: "Lawyers", value: "86" },
  { term: "Transactions advised on in 2025", value: "£310m" },
]

const matters = [
  {
    area: "Corporate",
    name: "Sale of Corran Marine",
    text: "Advised the founders of a boatbuilder on its sale to a Dutch shipping group.",
    value: "£48m",
  },
  {
    area: "Commercial disputes",
    name: "Estley Mills v Brandreth Engineering",
    text: "Won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
    value: "£6.2m",
  },
  {
    area: "Real estate",
    name: "Wexcombe University, Quay Street",
    text: "Acted for the university on the 25-year lease of its new research building.",
    value: (
      <>
        11,000 <span className="normal-case">m²</span>
      </>
    ),
  },
]

const partners = [
  {
    name: "Helena Marsh",
    initials: "HM",
    role: "Managing partner · Corporate",
    href: "#",
    portrait:
      "Helena Marsh in a navy jacket, seated at the head of a boardroom table",
  },
  {
    name: "David Achterberg",
    initials: "DA",
    role: "Head of commercial disputes",
    href: "#",
    portrait:
      "David Achterberg in a grey suit, standing beside shelves of case files",
  },
  {
    name: "Priya Raman",
    initials: "PR",
    role: "Partner · Employment",
    href: "#",
    portrait:
      "Priya Raman in a dark blazer, by the window of a meeting room overlooking Chancery Row",
  },
  {
    name: "Ruth Calloway",
    initials: "RC",
    role: "Partner · Commercial disputes",
    href: "/people/ruth-calloway",
    portrait: "Ruth Calloway in a dark suit, at a window of the firm's library",
  },
]

const section = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

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
                <a href={link.href} className={cn(label, plainLink)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className={cn("mt-14 md:mt-28", grid)}>
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
            Commercial lawyers · Wexcombe, since{" "}
            <time dateTime="1952">1952</time>
          </p>
          <h1 className="mt-4 text-h1 md:col-span-10 md:text-display">
            Clear advice for the decisions that shape a business
          </h1>
          <p className="mt-8 max-w-xl md:col-span-7 md:col-start-1">
            We advise owner-managed companies, their boards and the families
            behind them, from a single office in Wexcombe. A partner reads every
            matter we take on, and stays with it to the end.
          </p>
          <p className="mt-8 md:col-span-7 md:col-start-1">
            <a
              href="#practice-areas"
              className={cn(label, textLink, "inline-flex items-center gap-2")}
            >
              Our practice areas
              <ArrowRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </p>
        </section>

        <section id="practice-areas" className={cn(section, grid)}>
          <div className="md:col-span-4">
            <h2 className="text-h2">Practice areas</h2>
            <p className="mt-4 max-w-xl">
              Five teams, each led by partners who have practised in Wexcombe
              for most of their careers.
            </p>
          </div>
          <ul className="mt-8 list-none border-b border-border p-0 md:col-span-8 md:col-start-5 md:mt-0">
            {practiceAreas.map((area) => (
              <li
                key={area.name}
                className="border-t border-border py-8 md:grid md:grid-cols-8 md:items-baseline md:gap-x-8"
              >
                <div className="md:col-span-3">
                  <h3 className="text-h2">
                    <a href={area.href} className={plainLink}>
                      {area.name}
                    </a>
                  </h3>
                  {area.badge && (
                    <p className="mt-2">
                      <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                        {area.badge}
                      </Badge>
                    </p>
                  )}
                </div>
                <p className="mt-2 max-w-xl md:col-span-5 md:mt-0">
                  {area.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(section, grid)}>
          <h2 className="text-h2 md:col-span-4">The firm in figures</h2>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 md:col-span-12 md:col-start-1 md:grid-cols-4 md:gap-x-8">
            {figures.map((figure, index) => (
              <div
                key={figure.term}
                className={cn(
                  "flex flex-col-reverse border-t border-border pt-4",
                  index >= 2 && "mt-8 md:mt-0"
                )}
              >
                <dt className={cn(label, "mt-2 text-muted-foreground")}>
                  {figure.term}
                </dt>
                <dd className="font-heading text-h1">{figure.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={section}>
          <h2 className="text-h2">Recent matters</h2>
          <ul className="mt-8 list-none border-b border-border p-0">
            {matters.map((matter) => (
              <li
                key={matter.name}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                  <time dateTime="2026">2026</time> · {matter.area}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl">{matter.text}</p>
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

        <section className={section}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="text-h2">Partners</h2>
            <p>
              <a
                href="#"
                className={cn(
                  label,
                  textLink,
                  "inline-flex items-center gap-2"
                )}
              >
                All 14 partners
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </p>
          </div>
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 md:grid-cols-4 md:gap-x-8">
            {partners.map((person) => (
              <li key={person.name}>
                <div
                  role="img"
                  aria-label={person.portrait}
                  className="flex aspect-3/4 w-full items-end rounded-xl border border-border bg-card p-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-h1 text-muted-foreground"
                  >
                    {person.initials}
                  </span>
                </div>
                <h3 className="mt-4 text-h2">
                  <a href={person.href} className={plainLink}>
                    {person.name}
                  </a>
                </h3>
                <p className={cn(label, "mt-2 text-muted-foreground")}>
                  {person.role}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(section, grid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Talk to a partner</h2>
            <p className="mt-4 max-w-xl">
              Tell us briefly what the matter is, and a partner in the right
              team will reply within one working day.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-8 py-2 font-mono text-label font-normal uppercase"
                )}
              >
                Make an enquiry
              </a>
              <p className={label}>
                Or call{" "}
                <a href="tel:01632960214" className={textLink}>
                  01632 960 214
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={cn("mt-14 border-t border-border py-8 md:mt-28")}>
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
                <li key={link.href} className={cn(index > 0 && "mt-2")}>
                  <a href={link.href} className={cn(label, plainLink)}>
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
