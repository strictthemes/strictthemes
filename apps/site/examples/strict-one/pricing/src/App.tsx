import { useState } from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Period = "monthly" | "yearly"

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
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

const navItems = [
  { name: "Product", href: "#" },
  { name: "Templates", href: "#" },
  { name: "Pricing", href: "#", current: true },
]

type Plan = {
  name: string
  monthly: number
  yearly: number
  forWhom: string
  cta: string
  recommended?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    forWhom:
      "For a small team of up to 3 people trying Plainsheet on real work.",
    cta: "Start free",
    features: [
      "Up to 3 people",
      "10 sheets",
      "7 days of version history",
      "Comments and mentions",
      "Export to CSV and Excel",
    ],
  },
  {
    name: "Team",
    monthly: 12,
    yearly: 10,
    forWhom:
      "For teams that plan, budget and report in shared sheets every week.",
    cta: "Start team",
    recommended: true,
    features: [
      "Unlimited people and sheets",
      "90 days of version history",
      "Shared team templates",
      "View-only links for guests",
      "Plain-language column notes",
      "Email support within one day",
    ],
  },
  {
    name: "Business",
    monthly: 24,
    yearly: 20,
    forWhom:
      "For companies that need sign-in rules, audit trails and admin control.",
    cta: "Start business",
    features: [
      "Everything in Team",
      "Unlimited version history",
      "Single sign-on with SAML",
      "Audit log of every change",
      "Admin roles and permissions",
      "Support within 4 hours",
    ],
  },
]

const groups: {
  name: string
  rows: { feature: string; values: [string, string, string] }[]
}[] = [
  {
    name: "Sharing",
    rows: [
      {
        feature: "People per workspace",
        values: ["Up to 3", "Unlimited", "Unlimited"],
      },
      { feature: "Sheets", values: ["10", "Unlimited", "Unlimited"] },
      {
        feature: "View-only links",
        values: ["Not included", "Included", "Included"],
      },
      {
        feature: "Shared templates",
        values: ["Not included", "Included", "Included"],
      },
    ],
  },
  {
    name: "History",
    rows: [
      {
        feature: "Version history",
        values: ["7 days", "90 days", "Unlimited"],
      },
      {
        feature: "Restore a single cell",
        values: ["Included", "Included", "Included"],
      },
      {
        feature: "Named versions",
        values: ["Not included", "Included", "Included"],
      },
    ],
  },
  {
    name: "Admin",
    rows: [
      {
        feature: "Single sign-on (SAML)",
        values: ["Not included", "Not included", "Included"],
      },
      {
        feature: "Audit log",
        values: ["Not included", "Not included", "Included"],
      },
      {
        feature: "Admin roles",
        values: ["Not included", "Not included", "Included"],
      },
      {
        feature: "Support response",
        values: ["Community", "1 business day", "4 hours"],
      },
    ],
  },
]

const faqs = [
  {
    q: "How does billing per person work?",
    a: "You pay for each person who can edit sheets in your workspace. People you share a view-only link with are free. When someone joins or leaves, the next invoice changes to match.",
  },
  {
    q: "Is there a free trial of Team or Business?",
    a: "Yes. Every paid plan starts with 14 days free, and we do not ask for a card until the trial ends. If you do nothing, your workspace moves to Starter.",
  },
  {
    q: "What does billed yearly mean for the price?",
    a: "On yearly billing, Team is $10 and Business is $20 per person a month, paid once a year in advance. That is two months free compared with paying monthly.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel from the billing page and your plan stays active until the end of the period you paid for. We do not charge a cancellation fee.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your sheets stay in your workspace on the Starter plan. If you go over its limits, the extra sheets become read-only until you upgrade or remove some.",
  },
  {
    q: "Can I export everything I put in Plainsheet?",
    a: "Yes, on every plan. Export one sheet or the whole workspace as CSV or Excel files, with comments and version notes included.",
  },
]

const footerGroups = [
  { name: "Product", links: ["Features", "Templates", "Pricing", "Changelog"] },
  { name: "Company", links: ["About", "Careers", "Press", "Contact"] },
  { name: "Help", links: ["Guides", "Status", "Privacy", "Terms"] },
]

function price(plan: Plan, period: Period) {
  return period === "yearly" ? plan.yearly : plan.monthly
}

function billingNote(plan: Plan, period: Period) {
  if (plan.monthly === 0) return "Free forever"
  if (period === "yearly")
    return `Billed yearly, $${plan.yearly * 12} per person`
  return "Billed monthly"
}

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className={container}>
          <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
            <a
              href="#"
              className={cn(
                "font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                focus
              )}
            >
              Plainsheet
            </a>
            <nav aria-label="Main" className="ml-auto hidden gap-8 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(navLink, item.current && "underline")}
                >
                  {item.name}
                </a>
              ))}
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
            <h1 className="mt-2 text-h1 md:col-span-8 md:text-display">
              One price per person. No tiers hidden in a sales call.
            </h1>
            <p className="mt-4 max-w-lg md:col-span-6">
              Plainsheet gives your whole team spreadsheets they can read: named
              columns, notes in plain words and a full history of who changed
              what. Start free with up to 3 people and pay per person when you
              grow.
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
                Yearly: 2 months free
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 divide-y divide-border rounded-md border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className="row-span-6 grid grid-rows-subgrid gap-0 p-8"
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
                  <p className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="font-heading text-display">
                      ${price(plan, period)}
                    </span>
                    <span
                      className={cn(
                        label,
                        "text-muted-foreground md:basis-full lg:basis-auto"
                      )}
                    >
                      / person / month
                    </span>
                  </p>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {billingNote(plan, period)}
                  </p>
                  <p className="mt-4">{plan.forWhom}</p>
                  <div className="mt-8">
                    <a
                      href="#"
                      className={cn(
                        buttonVariants({
                          variant: plan.recommended ? "default" : "outline",
                        }),
                        buttonClass,
                        "w-full"
                      )}
                    >
                      {plan.cta}
                    </a>
                  </div>
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
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="compare-heading" className="pb-16">
          <div className={container}>
            <div
              className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}
            >
              <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                01 / Compare
              </p>
              <h2 id="compare-heading" className="text-h1 md:col-span-9">
                Compare what each plan includes
              </h2>
            </div>
            <div className="mt-8">
              <Table
                label="Compare what each plan includes"
                className="min-w-lg text-body"
              >
                <TableHeader>
                  <TableRow>
                    {["Feature", ...plans.map((p) => p.name)].map((name) => (
                      <TableHead
                        key={name}
                        scope="col"
                        className={cn(
                          label,
                          "text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {groups.map((group) => (
                  <TableBody key={group.name}>
                    <TableRow>
                      <TableHead
                        colSpan={4}
                        scope="rowgroup"
                        className={cn(
                          label,
                          "pt-8 text-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {group.name}
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
            <div
              className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}
            >
              <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                02 / Questions
              </p>
              <h2 id="faq-heading" className="text-h1 md:col-span-9">
                Billing, trials and your data
              </h2>
            </div>
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
              <p className="mt-4 md:col-span-12">
                <a href="#" className={textLink}>
                  Talk to sales about a plan for 50 people or more
                </a>
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
              <div
                key={group.name}
                className="flex flex-col gap-4 md:col-span-3"
              >
                <h2 className={cn(label, "text-foreground")}>{group.name}</h2>
                <ul className="flex flex-col gap-2">
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
          <p
            className={cn(
              label,
              "mt-8 border-t border-border pt-4 text-muted-foreground"
            )}
          >
            © 2026 Plainsheet Ltd.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
