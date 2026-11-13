import { useRef, useState, type KeyboardEvent } from "react"
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
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const navItems = [
  { label: "Product", href: "#" },
  { label: "Templates", href: "#" },
  { label: "Pricing", href: "#", current: true },
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
      "For a small group keeping a shared budget, rota or inventory in one place.",
    cta: "Start free",
    features: [
      "Up to 3 people",
      "Unlimited sheets",
      "Plain-language formulas",
      "Comments on any cell",
      "7 days of version history",
    ],
  },
  {
    name: "Team",
    monthly: 12,
    yearly: 10,
    audience:
      "For a team that plans, reports and hands work over in the same sheets every week.",
    cta: "Start team",
    recommended: true,
    features: [
      "Unlimited people",
      "Shared templates for the team",
      "View-only links for clients",
      "Cell-level change notes",
      "90 days of version history",
      "Email support within one working day",
    ],
  },
  {
    name: "Business",
    monthly: 24,
    yearly: 20,
    audience:
      "For a company that needs sign-in through its own provider and a record of every change.",
    cta: "Start business",
    features: [
      "Everything in Team",
      "Single sign-on",
      "Audit log of every edit",
      "Unlimited version history",
      "Data kept in the EU or US",
      "A named contact for support",
    ],
  },
]

type CompareGroup = {
  name: string
  rows: { feature: string; values: [string, string, string] }[]
}

const compareGroups: CompareGroup[] = [
  {
    name: "Sharing",
    rows: [
      { feature: "People per workspace", values: ["3", "Unlimited", "Unlimited"] },
      { feature: "Comments on cells", values: ["Included", "Included", "Included"] },
      { feature: "View-only links", values: ["Not included", "Included", "Included"] },
      { feature: "Shared templates", values: ["Not included", "Included", "Included"] },
    ],
  },
  {
    name: "History",
    rows: [
      { feature: "Version history", values: ["7 days", "90 days", "Unlimited"] },
      { feature: "Cell-level change notes", values: ["Not included", "Included", "Included"] },
      { feature: "Restore a deleted sheet", values: ["7 days", "90 days", "Unlimited"] },
    ],
  },
  {
    name: "Admin",
    rows: [
      { feature: "Single sign-on", values: ["Not included", "Not included", "Included"] },
      { feature: "Audit log", values: ["Not included", "Not included", "Included"] },
      { feature: "Data location", values: ["US", "US", "EU or US"] },
      { feature: "Support", values: ["Help centre", "Email", "Named contact"] },
    ],
  },
]

const faqs = [
  {
    question: "Who counts as a person on my bill?",
    answer:
      "Anyone who can edit a sheet in your workspace. People who only open view-only links are free and never appear on your bill.",
  },
  {
    question: "Is there a free trial of Team or Business?",
    answer:
      "Yes. Every paid plan starts with 14 days free, and we do not ask for a card until the trial ends. If you add no card, the workspace moves to Starter.",
  },
  {
    question: "How does yearly billing work?",
    answer:
      "You pay for twelve months up front at the lower per-month price. Team is $120 per person a year and Business is $240, which is two months free.",
  },
  {
    question: "What happens when I add or remove people?",
    answer:
      "New people are charged for the rest of the current period, to the day. Removing someone gives you a credit on your next bill.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes, from the billing page, with no call needed. Monthly plans stop at the end of the month. Yearly plans run to the end of the year you paid for.",
  },
  {
    question: "What happens to my data if I leave?",
    answer:
      "You can export every sheet as CSV or Excel at any time. After you close a workspace we keep it for 30 days in case you change your mind, then delete it for good.",
  },
]

const footerGroups = [
  { name: "Product", links: ["Features", "Templates", "Pricing", "Changelog"] },
  { name: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { name: "Help", links: ["Help centre", "Guides", "Status", "Security"] },
]

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    const target = event.target as Node
    if (
      menuButtonRef.current?.contains(target) ||
      menuRef.current?.contains(target)
    ) {
      setOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
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
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(navLink, item.current && "underline")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a href="#" className={cn(navLink, "hidden md:inline")}>
              Sign in
            </a>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "outline" }), buttonClass)}
            >
              Start free
            </a>
            <Button
              ref={menuButtonRef}
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
          ref={menuRef}
          aria-label="Main"
          hidden={!open}
          className="border-t border-border py-2 md:hidden"
        >
          <ul>
            {[...navItems, { label: "Sign in", href: "#" }].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={
                    "current" in item && item.current ? "page" : undefined
                  }
                  className={cn(
                    navLink,
                    "block py-2",
                    "current" in item && item.current && "underline"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SectionHeader({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string
  title: string
  id: string
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

function PlanColumn({ plan, period }: { plan: Plan; period: Period }) {
  const price = period === "monthly" ? plan.monthly : plan.yearly
  const free = plan.monthly === 0
  const note = free
    ? "Free forever"
    : period === "monthly"
      ? "Billed monthly"
      : `Billed yearly, $${plan.yearly * 12} per person`

  return (
    <div className="row-span-6 grid grid-rows-subgrid gap-0 p-8">
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
        <span className="font-heading text-display">${price}</span>
        <span
          className={cn(
            label,
            "text-muted-foreground md:basis-full lg:basis-auto"
          )}
        >
          / person / month
        </span>
      </p>
      <p className={cn(label, "mt-2 text-muted-foreground")}>{note}</p>
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
  const compareTitle = "Every plan, line by line"

  return (
    <div className="text-body">
      <SiteHeader />

      <main>
        <section className="pt-16 pb-16" aria-labelledby="intro-heading">
          <div className={cn(container, grid)}>
            <p className={cn(label, "text-muted-foreground md:col-span-12")}>
              Pricing
            </p>
            <h1
              id="intro-heading"
              className="mt-2 text-h1 md:col-span-8 md:text-display"
            >
              One price per person. No tiers hidden in a sales call.
            </h1>
            <p className="mt-4 max-w-lg md:col-span-6">
              Every plan has unlimited sheets and the same editor. You pay for
              the people who edit, not for the people who read, and you can
              move between plans whenever your team changes size.
            </p>
          </div>
        </section>

        <section className="pb-16" aria-labelledby="plans-heading">
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
              <p className={cn(label, "text-muted-foreground")}>
                Yearly: 2 months free
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 divide-y divide-border rounded-md border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {plans.map((plan) => (
                <PlanColumn key={plan.name} plan={plan} period={period} />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16" aria-labelledby="compare-heading">
          <div className={container}>
            <SectionHeader
              eyebrow="01 / Compare"
              title={compareTitle}
              id="compare-heading"
            />
            <div className="mt-8">
              <Table label={compareTitle} className="min-w-lg text-body">
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
                        {row.values.map((value, index) => (
                          <TableCell
                            key={plans[index].name}
                            className={cn("font-mono text-body", cellEdge)}
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

        <section className="pb-16" aria-labelledby="faq-heading">
          <div className={container}>
            <SectionHeader
              eyebrow="02 / Questions"
              title="Billing, trials and your data"
              id="faq-heading"
            />
            <div className={cn(grid, "mt-8")}>
              <Accordion className="md:col-span-9 md:col-start-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="items-center gap-4 rounded-none py-4 font-sans text-body font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="max-w-lg">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="pb-16" aria-labelledby="closing-heading">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <h2 id="closing-heading" className="text-h1 md:col-span-8">
                Still deciding? Start on the free plan.
              </h2>
              <p className="mt-4 md:col-span-12">
                <a href="#" className={textLink}>
                  Talk to sales about a team of 50 or more
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
              <div key={group.name} className="flex flex-col gap-4 md:col-span-3">
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
