import type { ReactNode } from "react"
import { ArrowRight, TriangleAlert } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
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

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const listLink = cn("inline-block py-2", textLink)

const sections = [
  { id: "who-can-get-a-permit", title: "Who can get a permit" },
  { id: "what-a-permit-costs", title: "What a permit costs" },
  { id: "what-you-need-to-apply", title: "What you need to apply" },
  { id: "how-long-a-permit-lasts", title: "How long a permit lasts" },
  { id: "if-something-changes", title: "If something changes" },
]

const prices = [
  { vehicle: "Petrol or diesel", first: "£96", second: "£144" },
  { vehicle: "Hybrid", first: "£72", second: "£108" },
  { vehicle: "Fully electric", first: "£30", second: "£45" },
]

const footerLinks = [
  "Accessibility",
  "Privacy",
  "Cookies",
  "Contact the council",
]

const relatedLinks = [
  "Apply for a resident's parking permit",
  "Visitor parking permits",
  "Pay or challenge a parking fine",
]

function SectionHeading({ index }: { index: number }) {
  const section = sections[index]
  return (
    <h2 id={section.id} className="mt-10 scroll-mt-6 text-h2">
      {section.title}
    </h2>
  )
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-4 list-disc pl-6">
      {items.map((item, i) => (
        <li key={i} className={i > 0 ? "mt-2" : undefined}>
          {item}
        </li>
      ))}
    </ul>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <a
        href="#main"
        className={cn(
          "sr-only text-primary underline underline-offset-4 focus-visible:not-sr-only focus-visible:block focus-visible:px-4 focus-visible:py-2",
          focusOutline
        )}
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[720px] flex-wrap items-baseline gap-x-6 gap-y-1 px-4 py-4 md:px-6">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground no-underline underline-offset-4 hover:underline",
              focusOutline
            )}
          >
            Callowmere Council
          </a>
          <a
            href="#"
            className={cn(
              "text-body font-bold text-foreground no-underline underline-offset-4 hover:underline",
              focusOutline
            )}
          >
            Apply for a resident's parking permit
          </a>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto max-w-[720px] px-4 pt-10 pb-16 md:px-6"
      >
        <p className="font-mono text-label text-muted-foreground">Guidance</p>
        <h1 className="mt-2 text-h1">
          Resident parking permits: who can get one and what it costs
        </h1>
        <p className="mt-6">
          A resident parking permit lets you park on your street in a permit
          zone without paying at the meter. This page is for people who live in
          Callowmere and want to know if they can get one and how much it costs.
        </p>
        <p className="mt-4 font-mono text-label text-muted-foreground">
          Updated <time dateTime="2026-11-04">4 November 2026</time>
        </p>

        <nav
          aria-labelledby="contents-heading"
          className="mt-10 border-l-4 border-border pl-4"
        >
          <h2
            id="contents-heading"
            className="font-mono text-label text-muted-foreground"
          >
            Contents
          </h2>
          <ul className="mt-2 list-none p-0">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={listLink}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SectionHeading index={0} />
        <p className="mt-4">
          Whether you can get a permit depends on where you live, on the vehicle
          and on how many permits your address already has.
        </p>
        <p className="mt-4">You can get a permit if:</p>
        <BulletList
          items={[
            "you live in zone A, B, C or D",
            "the vehicle is registered to you at your address, or is a company car you are the main driver of",
            "your address has fewer than two permits",
          ]}
        />
        <p className="mt-4">
          Homes at Linden Yard cannot get a permit, because they were built
          without parking.
        </p>
        <p className="mt-4">
          Not sure which zone you live in?{" "}
          <a href="#" className={textLink}>
            Find your permit zone
          </a>
          .
        </p>

        <SectionHeading index={1} />
        <p className="mt-4">
          The price depends on what the vehicle runs on and on whether it is the
          first or the second permit at your address. Every permit lasts 12
          months.
        </p>
        <h3 className="mt-6 text-body font-bold">
          Prices for a 12-month permit
        </h3>
        <div className="mt-4">
          <Table
            label="Prices for a 12-month permit"
            className="min-w-lg text-body"
          >
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-auto px-4 py-2 font-bold whitespace-normal text-foreground first:pl-0 last:pr-0">
                  Vehicle runs on
                </TableHead>
                <TableHead className="h-auto px-4 py-2 text-right font-bold whitespace-normal text-foreground tabular-nums first:pl-0 last:pr-0">
                  First permit
                </TableHead>
                <TableHead className="h-auto px-4 py-2 text-right font-bold whitespace-normal text-foreground tabular-nums first:pl-0 last:pr-0">
                  Second permit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((row) => (
                <TableRow key={row.vehicle} className="hover:bg-transparent">
                  <TableCell className="px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0">
                    {row.vehicle}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right align-top whitespace-normal tabular-nums first:pl-0 last:pr-0">
                    {row.first}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right align-top whitespace-normal tabular-nums first:pl-0 last:pr-0">
                    {row.second}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-6">
          Visitor permits cost £24 for a book of 20 day permits. Read about{" "}
          <a href="#" className={textLink}>
            visitor parking permits
          </a>
          .
        </p>
        <div className="mt-6 rounded-xl bg-tertiary p-6 text-tertiary-foreground">
          <p className="flex items-start gap-2 font-bold">
            <TriangleAlert
              className="mt-1 size-5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            Important
          </p>
          <p className="mt-2">
            From <time dateTime="2027-04-01">1 April 2027</time>, petrol and
            diesel permits cost £102 for a first permit and £150 for a second. A
            permit bought before then keeps its price until it ends.
          </p>
        </div>
        <p className="mt-6">
          If you get council tax support, your first permit costs half the
          price.
        </p>

        <SectionHeading index={2} />
        <p className="mt-4">You will need:</p>
        <BulletList
          items={[
            "the vehicle's registration number",
            "the date you want the permit to start",
            "proof of address from the last 3 months, such as a council tax bill, a tenancy agreement or a utility bill",
          ]}
        />
        <p className="mt-4">
          For a company car, you also need a letter from your employer that says
          you are the main driver.
        </p>
        <p className="mt-10">
          <a
            href="#"
            className={cn(
              buttonVariants(),
              "h-11 w-full px-6 font-mono text-label md:w-auto"
            )}
          >
            Apply for a permit
            <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
          </a>
        </p>

        <SectionHeading index={3} />
        <p className="mt-4">
          A permit lasts 12 months from the start date you choose. It cannot be
          paused or made shorter.
        </p>
        <p className="mt-4">
          We send you a reminder email 4 weeks before your permit ends. You
          renew online in the same way you applied.
        </p>

        <SectionHeading index={4} />
        <p className="mt-4">
          Tell us straight away if one of these things happens:
        </p>
        <BulletList
          items={[
            "If you change vehicle, update the registration number online. This is free.",
            "If you move house, cancel your permit. You get back the full months left, less a £10 fee.",
            "If you sell the vehicle and do not replace it, cancel your permit the same way.",
          ]}
        />

        <section
          aria-labelledby="related-heading"
          className="mt-16 border-t border-border pt-6"
        >
          <h2 id="related-heading" className="text-h2">
            Related
          </h2>
          <ul className="mt-4 list-none p-0">
            {relatedLinks.map((label) => (
              <li key={label}>
                <a href="#" className={listLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-[720px] px-4 py-10 md:px-6">
          <nav aria-label="Footer">
            <ul className="flex list-none flex-wrap gap-x-6 p-0">
              {footerLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={listLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-6 text-muted-foreground">
            Callowmere Council, Guildhall, Market Street, Callowmere CM1 1AA
          </p>
          <p className="mt-2 text-muted-foreground">
            © Callowmere Council 2026
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
