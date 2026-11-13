import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

// A link in the header or footer, and a name or title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label uppercase"

const sectionDivider = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

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
    summary:
      "Sales and purchases of companies, investment rounds and the shareholder agreements that follow them.",
  },
  {
    name: "Commercial disputes",
    href: "/practice/commercial-disputes",
    summary:
      "Contract and supply claims, warranty claims after a sale, and urgent court orders when a business cannot wait.",
    badge: "Ranked 2026",
  },
  {
    name: "Employment",
    href: "#",
    summary:
      "Contracts of employment, restrictive covenants, team moves between competitors and tribunal claims.",
  },
  {
    name: "Real estate",
    href: "#",
    summary:
      "Leases, development sites and the property side of a company sale or purchase.",
  },
  {
    name: "Private client",
    href: "#",
    summary:
      "Wills, trusts and succession planning for business owners and the families who will inherit the business.",
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
    year: "2026",
    area: "Corporate",
    name: "Sale of Corran Marine",
    summary:
      "Advised the founders of a boatbuilder on the sale of the company to a Dutch shipping group.",
    value: "£48m",
  },
  {
    year: "2026",
    area: "Commercial disputes",
    name: "Estley Mills v Brandreth Engineering",
    summary:
      "Won a claim for a textile mill, after a nine-day trial, over a production line that never ran to its specification.",
    value: "£6.2m",
  },
  {
    year: "2026",
    area: "Real estate",
    name: "Wexcombe University, Quay Street",
    summary:
      "Acted for the university on the 25-year lease of its new research building on Quay Street.",
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
      "Helena Marsh in a charcoal jacket, seated at the head of a meeting table.",
  },
  {
    name: "David Achterberg",
    initials: "DA",
    role: "Head of commercial disputes",
    href: "#",
    portrait:
      "David Achterberg in a navy suit, standing beside shelves of case files.",
  },
  {
    name: "Priya Raman",
    initials: "PR",
    role: "Partner · Employment",
    href: "#",
    portrait:
      "Priya Raman in a grey blazer, at her desk by a window over Chancery Row.",
  },
  {
    name: "Ruth Calloway",
    initials: "RC",
    role: "Partner · Commercial disputes",
    href: "/people/ruth-calloway",
    portrait:
      "Ruth Calloway in a dark suit, at a window of the firm's library.",
  },
]

function OnwardLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className={cn(label, textLink, "inline-flex items-center gap-2")}
    >
      {children}
      <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
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
            <OnwardLink href="#practice-areas">Our practice areas</OnwardLink>
          </p>
        </section>

        <section id="practice-areas" className={cn(sectionDivider, grid)}>
          <div className="md:col-span-4">
            <h2 className="text-h2">Practice areas</h2>
            <p className="mt-4">
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
                  {area.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(sectionDivider, grid)}>
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

        <section className={sectionDivider}>
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
                  {matter.area}
                </p>
                <div className="mt-2 md:col-span-7 md:mt-0">
                  <h3 className="text-h2">{matter.name}</h3>
                  <p className="mt-2 max-w-xl">{matter.summary}</p>
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

        <section className={sectionDivider}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="text-h2">Partners</h2>
            <p>
              <OnwardLink href="#">All 14 partners</OnwardLink>
            </p>
          </div>
          <ul className="mt-8 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 md:grid-cols-4 md:gap-x-8">
            {partners.map((partner) => (
              <li key={partner.name}>
                <div
                  role="img"
                  aria-label={partner.portrait}
                  className="flex aspect-3/4 w-full items-end rounded-xl border border-border bg-card p-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-h1 text-muted-foreground"
                  >
                    {partner.initials}
                  </span>
                </div>
                <h3 className="mt-4 text-h2">
                  <a href={partner.href} className={plainLink}>
                    {partner.name}
                  </a>
                </h3>
                <p className={cn(label, "mt-2 text-muted-foreground")}>
                  {partner.role}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(sectionDivider, grid)}>
          <div className="md:col-span-7">
            <h2 className="text-h2">Talk to a partner</h2>
            <p className="mt-4 max-w-xl">
              Tell us briefly what the matter is and who is involved. A partner
              in the right team will reply within one working day.
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
              <p className={cn(label, "text-foreground")}>
                Or call{" "}
                <a href="tel:01632960214" className={textLink}>
                  01632 960 214
                </a>
              </p>
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
