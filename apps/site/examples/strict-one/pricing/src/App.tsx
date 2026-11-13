import { useRef, useState, type KeyboardEvent } from "react"
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
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
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
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
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
  audience: string
  cta: string
  recommended?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    audience:
      "For a small team of up to 3 people keeping a few shared sheets in order.",
    cta: "Start free",
    features: [
      "Up to 3 people",
      "Unlimited sheets",
      "Comments on any cell",
      "7 days of version history",
      "Export to CSV and PDF",
    ],
  },
  {
    name: "Team",
    monthly: 12,
    yearly: 10,
    audience:
      "For teams that run their weekly numbers in shared sheets and need them right.",
    cta: "Start team",
    recommended: true,
    features: [
      "Unlimited people",
      "Guest access for clients",
      "Locked ranges and cell notes",
      "30 days of version history",
      "Scheduled email summaries",
      "Email support within one working day",
    ],
  },
  {
    name: "Business",
    monthly: 24,
    yearly: 20,
    audience:
      "For companies that need single sign-on, an audit log and paid invoices.",
    cta: "Start business",
    features: [
      "Everything in Team",
      "Single sign-on with SAML",
      "Roles and permissions per folder",
      "1 year of version history",
      "Audit log of every change",
      "Priority support and invoicing",
    ],
  },
]

type CompareRow = { feature: string; values: [string, string, string] }
type CompareGroup = { name: string; rows: CompareRow[] }

const compareGroups: CompareGroup[] = [
  {
    name: "Sharing",
    rows: [
      {
        feature: "People on the workspace",
        values: ["Up to 3", "Unlimited", "Unlimited"],
      },
      {
        feature: "Read-only links",
        values: ["Included", "Included", "Included"],
      },
      {
        feature: "Guest access",
        values: ["Not included", "Included", "Included"],
      },
      {
        feature: "Locked ranges",
        values: ["Not included", "Included", "Included"],
      },
    ],
  },
  {
    name: "History",
    rows: [
      { feature: "Version history", values: ["7 days", "30 days", "1 year"] },
      {
        feature: "Restore deleted sheets",
        values: ["7 days", "30 days", "1 year"],
      },
      {
        feature: "Audit log",
        values: ["Not included", "Not included", "Included"],
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
        feature: "Roles per folder",
        values: ["Not included", "Not included", "Included"],
      },
      {
        feature: "Pay by invoice",
        values: ["Not included", "Not included", "Included"],
      },
      {
        feature: "Support",
        values: ["Help centre", "1 working day", "4 hours"],
      },
    ],
  },
]

const faqs = [
  {
    q: "How does per-person billing work?",
    a: "You pay for each person who can edit a sheet in your workspace. People who only view a read-only link are free, so you can share numbers widely without paying for every reader.",
  },
  {
    q: "Is there a free trial of Team or Business?",
    a: "Yes. Every paid plan starts with 14 days free and needs no card. At the end of the trial you choose a plan, or the workspace moves to Starter and keeps its sheets.",
  },
  {
    q: "What happens when I switch from monthly to yearly?",
    a: "We charge the yearly price straight away and credit the unused part of your current month. From then on you pay once a year, at $10 or $20 per person a month.",
  },
  {
    q: "Can I add or remove people in the middle of a year?",
    a: "Yes. New people are charged for the rest of your billing period on the next invoice. People you remove are credited back on the next invoice.",
  },
  {
    q: "How do I cancel?",
    a: "Cancel from the billing settings at any time. Your plan stays active until the end of the period you paid for, then the workspace moves to Starter.",
  },
  {
    q: "What happens to my data if I leave?",
    a: "You can export every sheet as CSV or PDF at any time. After you close a workspace we keep its data for 30 days in case you change your mind, then delete it for good.",
  },
]

const footerGroups = [
  { name: "Product", links: ["Features", "Templates", "Pricing", "Changelog"] },
  { name: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { name: "Help", links: ["Help centre", "Guides", "Status", "Security"] },
]

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
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
          <div className="ml-auto flex items-center gap-4 md:gap-8">
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex gap-8">
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
                buttonClass
              )}
            >
              Start free
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn(buttonClass, "md:hidden")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </Button>
          </div>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!open}
          className="border-t border-border py-2 md:hidden"
        >
          <ul>
            {navItems.map((item) => (
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
            <li>
              <a href="#" className={cn(navLink, "block py-2")}>
                Sign in
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SectionHeader({
  index,
  name,
  heading,
  id,
}: {
  index: string
  name: string
  heading: string
  id: string
}) {
  return (
    <div className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}>
      <p className={cn(label, "text-muted-foreground md:col-span-3")}>
        {index} / {name}
      </p>
      <h2 id={id} className="text-h1 md:col-span-9">
        {heading}
      </h2>
    </div>
  )
}

function PlanColumn({ plan, period }: { plan: Plan; period: Period }) {
  const free = plan.monthly === 0
  const price = period === "monthly" ? plan.monthly : plan.yearly
  const note = free
    ? "Free forever"
    : period === "monthly"
      ? "Billed monthly"
      : `Billed yearly, $${plan.yearly * 12} per person`

  return (
    <div className="row-span-6 grid grid-rows-subgrid gap-0 border-t border-border p-8 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={cn(label, "text-foreground")}>{plan.name}</h3>
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
        <span className="font-heading text-display tabular-nums">${price}</span>
        <span
          className={cn(
            label,
            "text-muted-foreground md:basis-full lg:basis-auto"
          )}
        >
          / person / month
        </span>
      </p>
      <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
        {note}
      </p>
      <p className="mt-4 max-w-lg">{plan.audience}</p>
      <a
        href="#"
        className={cn(
          buttonVariants({ variant: plan.recommended ? "default" : "outline" }),
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
}

const cellEdge = "first:pl-0 last:pr-0"

export function App() {
  const [period, setPeriod] = useState<Period>("monthly")
  const compareHeading = "What each plan includes"

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main>
        {/* Intro */}
        <section className="pt-16 pb-16">
          <div className={container}>
            <div className={grid}>
              <p className={cn(label, "text-muted-foreground md:col-span-12")}>
                Pricing
              </p>
              <h1 className="mt-2 text-h1 md:col-span-8 md:text-display">
                One price per person. No tiers hidden in a sales call.
              </h1>
              <p className="mt-4 max-w-lg md:col-span-6">
                Plainsheet costs the same for every person on your team, and the
                people who only read your sheets are free. Start on the free
                plan and move up when your team grows past three.
              </p>
            </div>
          </div>
        </section>

        {/* Plans */}
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
                <Button
                  variant={period === "monthly" ? "secondary" : "outline"}
                  aria-pressed={period === "monthly"}
                  className={buttonClass}
                  onClick={() => setPeriod("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={period === "yearly" ? "secondary" : "outline"}
                  aria-pressed={period === "yearly"}
                  className={buttonClass}
                  onClick={() => setPeriod("yearly")}
                >
                  Yearly
                </Button>
              </div>
              <p className={cn(label, "text-muted-foreground tabular-nums")}>
                2 months free on yearly
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 rounded-md border border-border md:grid-cols-3">
              {plans.map((plan) => (
                <PlanColumn key={plan.name} plan={plan} period={period} />
              ))}
            </div>
          </div>
        </section>

        {/* Compare */}
        <section aria-labelledby="compare-heading" className="pb-16">
          <div className={container}>
            <SectionHeader
              index="01"
              name="Compare"
              heading={compareHeading}
              id="compare-heading"
            />
            <div className="mt-8">
              <Table label={compareHeading} className="min-w-lg text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      scope="col"
                      className={cn(label, "text-muted-foreground", cellEdge)}
                    >
                      Feature
                    </TableHead>
                    {plans.map((plan) => (
                      <TableHead
                        key={plan.name}
                        scope="col"
                        className={cn(label, "text-muted-foreground", cellEdge)}
                      >
                        {plan.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {compareGroups.map((group) => (
                  <TableBody key={group.name}>
                    <TableRow>
                      <TableHead
                        colSpan={4}
                        scope="rowgroup"
                        className={cn(label, "pt-8 text-foreground", cellEdge)}
                      >
                        {group.name}
                      </TableHead>
                    </TableRow>
                    {group.rows.map((row) => (
                      <TableRow key={row.feature}>
                        <TableHead
                          scope="row"
                          className={cn(
                            "font-sans text-body font-normal",
                            cellEdge
                          )}
                        >
                          {row.feature}
                        </TableHead>
                        {row.values.map((value, i) => (
                          <TableCell
                            key={plans[i].name}
                            className={cn(
                              "font-mono text-body tabular-nums",
                              cellEdge
                            )}
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

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="pb-16">
          <div className={container}>
            <SectionHeader
              index="02"
              name="Questions"
              heading="Billing, trials and your data"
              id="faq-heading"
            />
            <div className={cn(grid, "mt-8")}>
              <Accordion className="md:col-span-9 md:col-start-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.q}>
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

        {/* Closing line */}
        <section aria-labelledby="closing-heading" className="pb-16">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <h2 id="closing-heading" className="text-h1 md:col-span-8">
                Still deciding? Start on the free plan.
              </h2>
              <p className="mt-4 max-w-lg md:col-span-8">
                Need a contract, invoices or more than 100 seats?{" "}
                <a href="#" className={textLink}>
                  Talk to our sales team
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
