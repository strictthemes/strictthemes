import { useState } from "react"
import { CheckIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focus
)
const footerLink = cn(
  "text-body text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const navItems = [
  { name: "Product", href: "#" },
  { name: "Templates", href: "#" },
  { name: "Pricing", href: "#", current: true },
]

type Plan = {
  name: string
  monthly: number
  yearly: number
  free?: boolean
  recommended?: boolean
  audience: string
  cta: string
  features: string[]
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    free: true,
    audience:
      "For a small group of up to 3 people keeping one shared set of numbers.",
    cta: "Start free",
    features: [
      "Up to 3 people",
      "10 sheets per workspace",
      "Read-only share links",
      "7 days of version history",
      "CSV and Excel import",
    ],
  },
  {
    name: "Team",
    monthly: 12,
    yearly: 10,
    recommended: true,
    audience:
      "For teams that plan, report and review in the same sheets every week.",
    cta: "Start team",
    features: [
      "Unlimited people and sheets",
      "Comments and guest reviewers",
      "30 days of version history",
      "Restore deleted sheets",
      "Plain-language column notes",
      "Email support within one working day",
    ],
  },
  {
    name: "Business",
    monthly: 24,
    yearly: 20,
    audience:
      "For companies that need sign-in rules, an audit trail and invoices.",
    cta: "Start business",
    features: [
      "Everything in Team",
      "Single sign-on with SAML",
      "Roles and sheet-level permissions",
      "1 year of version history and an audit log",
      "Invoice billing",
      "A named support contact",
    ],
  },
]

const IN = "Included"
const OUT = "Not included"

const comparison = [
  {
    group: "Sharing",
    rows: [
      {
        feature: "People per workspace",
        values: ["Up to 3", "Unlimited", "Unlimited"],
      },
      { feature: "Read-only share links", values: [IN, IN, IN] },
      { feature: "Guest commenters", values: [OUT, IN, IN] },
    ],
  },
  {
    group: "History",
    rows: [
      { feature: "Version history", values: ["7 days", "30 days", "1 year"] },
      { feature: "Restore deleted sheets", values: [OUT, IN, IN] },
      { feature: "Audit log", values: [OUT, OUT, IN] },
    ],
  },
  {
    group: "Admin",
    rows: [
      { feature: "Single sign-on (SAML)", values: [OUT, OUT, IN] },
      { feature: "Roles and permissions", values: [OUT, OUT, IN] },
      { feature: "Invoice billing", values: [OUT, OUT, IN] },
    ],
  },
]

const faqs = [
  {
    q: "How does per-person billing work?",
    a: "You pay for each person who can edit or comment in your workspace. Read-only viewers through a share link are free and never counted.",
  },
  {
    q: "Is there a free trial of the paid plans?",
    a: "Yes. Team and Business are free for 14 days with no card needed. When the trial ends, your workspace moves to Starter unless you pick a plan.",
  },
  {
    q: "What does billed yearly mean?",
    a: "On yearly billing you pay for 12 months up front at the lower price. Team is $120 per person a year and Business is $240 per person a year.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel from your billing settings and your plan runs to the end of the period you paid for. We do not charge a cancellation fee.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your sheets stay in your workspace on the Starter plan. You can export every sheet to CSV or Excel at any time, on any plan.",
  },
  {
    q: "Where is my data stored?",
    a: "Sheets are stored in data centres in the EU and encrypted at rest and in transit. Business workspaces can ask for a signed data processing agreement.",
  },
]

const footerGroups = [
  {
    title: "Product",
    links: ["Features", "Templates", "Pricing", "Changelog"],
  },
  { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
  {
    title: "Resources",
    links: ["Help centre", "Guides", "Status", "Security"],
  },
]

function SectionHeader({
  id,
  eyebrow,
  title,
}: {
  id: string
  eyebrow: string
  title: string
}) {
  return (
    <div className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}>
      <p className={cn(label, "text-muted-foreground md:col-span-3")}>
        {eyebrow}
      </p>
      <h2 id={id} className="text-h1 md:col-span-9">
        {title}
      </h2>
    </div>
  )
}

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className={container}>
          <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
            <span className="font-heading text-h2">Plainsheet</span>
            <nav aria-label="Main" className="hidden md:ml-auto md:block">
              <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={cn(navLink, item.current && "underline")}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a href="#" className={cn(navLink, "hidden md:inline")}>
              Sign in
            </a>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClass,
                "ml-auto md:ml-0"
              )}
            >
              Start free
            </a>
            <Button
              variant="outline"
              className={cn(buttonClass, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>
          <nav
            id="mobile-menu"
            aria-label="Main"
            hidden={!menuOpen}
            className="border-t border-border py-2 md:hidden"
          >
            <ul>
              {[
                ...navItems,
                { name: "Sign in", href: "#", current: false },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      navLink,
                      "block py-2",
                      item.current && "underline"
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-16 pb-16">
          <div className={cn(container, grid)}>
            <p className={cn(label, "text-muted-foreground md:col-span-12")}>
              Pricing
            </p>
            <h1 className="mt-2 text-h1 md:col-span-8 md:col-start-1 md:text-display">
              One price per person. No tiers hidden in a sales call.
            </h1>
            <p className="mt-4 max-w-lg md:col-span-6 md:col-start-1">
              Plainsheet is spreadsheets your whole team can read. Start free
              with up to 3 people, and pay per person only when the rest of the
              team joins. Every plan includes the same editor, the same imports
              and the same export to CSV.
            </p>
          </div>
        </section>

        <section aria-labelledby="plans-heading" className="pb-16">
          <div className={container}>
            <h2 id="plans-heading" className="sr-only">
              Plans
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div
                role="group"
                aria-label="Billing period"
                className="flex gap-1"
              >
                {(["monthly", "yearly"] as const).map((value) => (
                  <Button
                    key={value}
                    variant={period === value ? "secondary" : "outline"}
                    aria-pressed={period === value}
                    className={buttonClass}
                    onClick={() => setPeriod(value)}
                  >
                    {value === "monthly" ? "Monthly" : "Yearly"}
                  </Button>
                ))}
              </div>
              <p className={cn(label, "text-muted-foreground")}>
                2 months free
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 rounded-md border border-border md:grid-cols-3">
              {plans.map((plan, index) => {
                const price = period === "yearly" ? plan.yearly : plan.monthly
                const note = plan.free
                  ? "Free forever"
                  : period === "yearly"
                    ? `Billed yearly, $${plan.yearly * 12} / person`
                    : "Billed monthly"
                return (
                  <div
                    key={plan.name}
                    className={cn(
                      "row-span-6 grid grid-rows-subgrid gap-0 p-8",
                      index > 0 &&
                        "border-t border-border md:border-t-0 md:border-l"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={cn(label, "text-foreground")}>
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <Badge
                          variant="secondary"
                          className="h-auto rounded-none bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <p className="font-heading text-display">${price}</p>
                      <p
                        className={cn(
                          label,
                          "text-muted-foreground md:basis-full lg:basis-auto"
                        )}
                      >
                        / person / month
                      </p>
                    </div>
                    <p
                      className={cn(label, "mt-2 text-muted-foreground")}
                      aria-live="polite"
                    >
                      {note}
                    </p>
                    <p className="mt-4">{plan.audience}</p>
                    <a
                      href="#"
                      className={cn(
                        buttonVariants({
                          variant: plan.recommended ? "default" : "outline",
                        }),
                        buttonClass,
                        "mt-8 w-full"
                      )}
                    >
                      {plan.cta}
                    </a>
                    <ul className="mt-8 flex flex-col gap-2 border-t border-border pt-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckIcon
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className="mt-1 size-4 shrink-0 text-foreground"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="compare-heading" className="pb-16">
          <div className={container}>
            <SectionHeader
              id="compare-heading"
              eyebrow="01 / Compare"
              title="Compare plans"
            />
            <div className="mt-8">
              <Table label="Compare plans" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      scope="col"
                      className={cn(
                        label,
                        "text-muted-foreground first:pl-0 last:pr-0"
                      )}
                    >
                      Feature
                    </TableHead>
                    {plans.map((plan) => (
                      <TableHead
                        key={plan.name}
                        scope="col"
                        className={cn(
                          label,
                          "text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {plan.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {comparison.map((group) => (
                  <TableBody key={group.group}>
                    <TableRow>
                      <TableHead
                        colSpan={4}
                        scope="rowgroup"
                        className={cn(
                          label,
                          "pt-8 text-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {group.group}
                      </TableHead>
                    </TableRow>
                    {group.rows.map((row) => (
                      <TableRow key={row.feature}>
                        <TableHead
                          scope="row"
                          className="font-sans text-body font-normal first:pl-0 last:pr-0"
                        >
                          {row.feature}
                        </TableHead>
                        {row.values.map((value, i) => (
                          <TableCell
                            key={plans[i].name}
                            className="font-mono text-body first:pl-0 last:pr-0"
                          >
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                ))}
              </Table>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="pb-16">
          <div className={container}>
            <SectionHeader
              id="faq-heading"
              eyebrow="02 / Questions"
              title="Billing, trials and your data"
            />
            <div className={cn(grid, "mt-8")}>
              <Accordion className="md:col-span-9 md:col-start-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.q} value={faq.q}>
                    <AccordionTrigger className="items-center gap-4 rounded-none py-4 font-sans text-body font-medium">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="max-w-lg">{faq.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section aria-labelledby="closing-heading" className="pb-16">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <h2 id="closing-heading" className="text-h1 md:col-span-8">
                Still deciding? Start on the free plan.
              </h2>
              <p className="mt-4 max-w-lg md:col-span-8 md:col-start-1">
                Need more than 200 seats, a custom contract or a security
                review?{" "}
                <a href="#" className={textLink}>
                  Contact sales
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-16">
        <div className={container}>
          <div className={cn(grid, "gap-y-8")}>
            <div className="flex flex-col gap-4 md:col-span-3">
              <p className="font-heading text-h2">Plainsheet</p>
              <p>Spreadsheets your whole team can read.</p>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title} className="md:col-span-3">
                <h2 className={cn(label, "text-foreground")}>{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={footerLink}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-border pt-4">
            <p className={cn(label, "text-muted-foreground")}>
              © 2026 Plainsheet Ltd.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
