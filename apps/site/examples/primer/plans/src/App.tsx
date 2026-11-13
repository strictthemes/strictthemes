import { useState, type ReactNode } from "react"
import { Check, Minus } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"

const badgeClass =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"

const buttonClass = "h-10 px-5 font-sans text-body font-semibold"

type Billing = "monthly" | "yearly"

type Plan = {
  id: string
  name: string
  marked: boolean
  price: Record<Billing, { amount: string; unit: string; note: string }>
  audience: string
  includes: { has: boolean; text: string }[]
  cta: { label: string; variant: "default" | "secondary" }
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    marked: false,
    price: {
      monthly: {
        amount: "$0",
        unit: "a month",
        note: "Free for as long as you like",
      },
      yearly: {
        amount: "$0",
        unit: "a month",
        note: "Free for as long as you like",
      },
    },
    audience: "For trying a course before you decide.",
    includes: [
      { has: true, text: "The first module of every course" },
      { has: true, text: "A question at the end of each lesson" },
      { has: true, text: "Your progress and your days in a row" },
      { has: false, text: "No practice files" },
      { has: false, text: "No certificates" },
    ],
    cta: { label: "Start for free", variant: "secondary" },
  },
  {
    id: "plus",
    name: "Plus",
    marked: true,
    price: {
      monthly: { amount: "$18", unit: "a month", note: "Billed every month" },
      yearly: {
        amount: "$15",
        unit: "a month",
        note: "Billed $180 once a year",
      },
    },
    audience: "For one learner who wants every course.",
    includes: [
      { has: true, text: "All 9 courses, 102 lessons" },
      { has: true, text: "Practice files for every lesson" },
      { has: true, text: "A certificate for each course you finish" },
      { has: true, text: "Everything in Free" },
    ],
    cta: { label: "Choose Plus", variant: "default" },
  },
  {
    id: "team",
    name: "Team",
    marked: false,
    price: {
      monthly: {
        amount: "$24",
        unit: "a learner a month",
        note: "Billed every month · From 3 learners",
      },
      yearly: {
        amount: "$20",
        unit: "a learner a month",
        note: "Billed $240 a learner once a year · From 3 learners",
      },
    },
    audience: "For a team that learns together at work.",
    includes: [
      { has: true, text: "Everything in Plus, for 3 to 50 learners" },
      { has: true, text: "The whole team's progress on one page" },
      { has: true, text: "One invoice, by card or bank transfer" },
    ],
    cta: { label: "Choose Team", variant: "secondary" },
  },
]

type Cell =
  | { kind: "figure"; text: string }
  | { kind: "phrase"; text: string }
  | { kind: "yes" }
  | { kind: "no" }

const yes: Cell = { kind: "yes" }
const no: Cell = { kind: "no" }
const fig = (text: string): Cell => ({ kind: "figure", text })
const phrase = (text: string): Cell => ({ kind: "phrase", text })

function comparisonRows(billing: Billing): { name: string; cells: Cell[] }[] {
  const yearly = billing === "yearly"
  return [
    {
      name: "Price",
      cells: [
        fig("$0"),
        fig(yearly ? "$15 a month" : "$18 a month"),
        fig(yearly ? "$20 a learner a month" : "$24 a learner a month"),
      ],
    },
    {
      name: "Courses",
      cells: [phrase("First module of each"), phrase("All 9"), phrase("All 9")],
    },
    { name: "A question after each lesson", cells: [yes, yes, yes] },
    { name: "Progress and days in a row", cells: [yes, yes, yes] },
    { name: "Practice files", cells: [no, yes, yes] },
    { name: "Certificates", cells: [no, yes, yes] },
    { name: "Learners", cells: [fig("1"), fig("1"), fig("3 to 50")] },
    { name: "The team's progress on one page", cells: [no, no, yes] },
    {
      name: "Answers by email",
      cells: [
        phrase("Within 3 working days"),
        phrase("Within 1 working day"),
        phrase("Within 1 working day"),
      ],
    },
  ]
}

const questions = [
  {
    q: "Can I try a course before I pay?",
    a: "Yes. The first module of every course is free, and you do not need a card to start.",
  },
  {
    q: "What happens if I stop paying for Plus?",
    a: "You keep your progress and your certificates. Lessons after the first module of each course close until you come back.",
  },
  {
    q: "Can I pay once a year?",
    a: "Yes. Plus is $180 a year, which is two months free. Team is $240 a learner a year.",
  },
  {
    q: "How does Team work?",
    a: "One person pays for 3 to 50 learners and invites them by email. Everyone gets Plus, and the person who pays sees the team's progress on one page.",
  },
  {
    q: "Do certificates run out?",
    a: "No. A certificate names the course, its lessons and the day you finished, and it stays in your account.",
  },
]

const navLinks = [
  { label: "Courses", href: "/catalogue" },
  { label: "My progress", href: "/progress" },
  { label: "Plans", href: "/plans" },
]

const CURRENT_PAGE = "/plans"

function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/catalogue"
          className={cn(
            "inline-flex h-10 items-center font-heading text-h2 text-foreground",
            focusOutline
          )}
        >
          Rowlark
        </a>
        <nav aria-label="Main" className="w-full md:w-auto">
          <ul className="flex gap-5">
            {navLinks.map((link) => {
              const current = link.href === CURRENT_PAGE
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-sans text-body font-semibold text-foreground underline-offset-8",
                      current ? "underline decoration-2" : "hover:underline",
                      focusOutline
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-8">
        <p className="font-heading text-h2">Rowlark</p>
        <p className={smallFigure}>
          Rowlark · Practical data skills, one short lesson at a time · 2027
        </p>
      </div>
    </footer>
  )
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = plan.price[billing]
  return (
    <li className="flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-h2">{plan.name}</h3>
        {plan.marked && <Badge className={badgeClass}>Most chosen</Badge>}
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-display tabular-nums">
            {price.amount}
          </span>
          <span className={smallFigure}>{price.unit}</span>
        </p>
        <p className={smallFigure}>{price.note}</p>
      </div>
      <p className="text-body">{plan.audience}</p>
      <ul className="flex flex-col gap-2 border-t border-border pt-5">
        {plan.includes.map((line) => {
          const Icon = line.has ? Check : Minus
          return (
            <li key={line.text} className="flex items-start gap-2 text-body">
              <Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>{line.text}</span>
            </li>
          )
        })}
      </ul>
      <a
        href="#"
        className={cn(
          buttonVariants({ variant: plan.cta.variant }),
          buttonClass,
          "mt-auto w-full"
        )}
      >
        {plan.cta.label}
      </a>
    </li>
  )
}

function CellContent({ cell }: { cell: Cell }): ReactNode {
  switch (cell.kind) {
    case "yes":
      return (
        <span className="inline-flex items-center gap-2">
          <Check className="size-4" aria-hidden="true" />
          Yes
        </span>
      )
    case "no":
      return (
        <span className="inline-flex items-center gap-2">
          <Minus className="size-4" aria-hidden="true" />
          No
        </span>
      )
    default:
      return cell.text
  }
}

export function App() {
  const [yearly, setYearly] = useState(false)
  const billing: Billing = yearly ? "yearly" : "monthly"
  const rows = comparisonRows(billing)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-20 px-5 pt-8 pb-20">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1 md:text-display">
              One plan opens every course
            </h1>
            <p className="max-w-2xl">
              The first module of every course is free, for as long as you like.
              Plus opens all nine courses, 102 lessons in all.
            </p>
          </div>

          <section
            aria-labelledby="plans-heading"
            className="flex flex-col gap-5"
          >
            <h2 id="plans-heading" className="sr-only">
              Plans
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex min-h-10 cursor-pointer items-center gap-3">
                <Switch
                  checked={yearly}
                  onCheckedChange={(checked) => setYearly(checked)}
                  aria-labelledby="pay-yearly-label"
                />
                <span
                  id="pay-yearly-label"
                  className="font-sans text-body font-semibold"
                >
                  Pay yearly
                </span>
              </label>
              <Badge className={badgeClass}>2 months free</Badge>
              <p role="status" className="sr-only">
                {yearly
                  ? "Prices are shown for paying yearly."
                  : "Prices are shown for paying monthly."}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} billing={billing} />
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="compare-heading"
            className="flex flex-col gap-5"
          >
            <h2 id="compare-heading" className="text-h2">
              Compare the plans
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card p-0">
              <Table
                className="text-body"
                label="Comparison of the three plans"
              >
                <TableHeader>
                  <TableRow>
                    {["What you get", "Free", "Plus", "Team"].map((head) => (
                      <TableHead
                        key={head}
                        scope="col"
                        className="px-5 font-mono text-label text-muted-foreground"
                      >
                        {head}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <th
                        scope="row"
                        className="px-5 py-3 text-left align-middle text-body font-normal whitespace-nowrap text-foreground"
                      >
                        {row.name}
                      </th>
                      {row.cells.map((cell, index) => (
                        <TableCell
                          key={index}
                          className={cn(
                            "px-5 py-3",
                            cell.kind === "figure" && "font-mono tabular-nums"
                          )}
                        >
                          <CellContent cell={cell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section
            aria-labelledby="questions-heading"
            className="flex flex-col gap-5 md:max-w-3xl"
          >
            <h2 id="questions-heading" className="text-h2">
              Questions people ask
            </h2>
            <div className="rounded-xl border border-border bg-card px-5 py-0">
              <Accordion>
                {questions.map((item, index) => (
                  <AccordionItem key={item.q} value={`q${index + 1}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-body">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
