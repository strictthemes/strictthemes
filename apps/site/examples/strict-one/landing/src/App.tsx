import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const buttonClasses = "rounded-sm px-4 font-mono text-label uppercase"

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const footerLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const label = "font-mono text-label text-muted-foreground uppercase"
const figureEntry = "font-mono text-label text-muted-foreground"

const headerLinks = ["Product", "Pricing", "Docs"]

const accounts = [
  {
    name: "Harbour Freight",
    owner: "Ines Varga",
    region: "North",
    seats: 48,
    mrr: "4,320",
    change: "+6.2%",
  },
  {
    name: "Lindqvist Dental",
    owner: "Tomas Reyes",
    region: "West",
    seats: 12,
    mrr: "1,080",
    change: "+1.4%",
  },
  {
    name: "Orchard Schools",
    owner: "Ines Varga",
    region: "South",
    seats: 130,
    mrr: "9,750",
    change: "+12.8%",
  },
  {
    name: "Pemberton Labs",
    owner: "Ada Okafor",
    region: "East",
    seats: 27,
    mrr: "2,430",
    change: "−3.1%",
  },
  {
    name: "Quayside Rentals",
    owner: "Tomas Reyes",
    region: "North",
    seats: 1,
    mrr: "90",
    change: "0.0%",
  },
]

const comments = [
  {
    name: "Ada Okafor",
    time: "2026-11-10T09:12",
    shown: "10 November 2026, 09:12",
    text: "Pemberton is down this month. Is that the seat cut they asked for in October?",
  },
  {
    name: "Tomas Reyes",
    time: "2026-11-10T09:40",
    shown: "10 November 2026, 09:40",
    text: "Yes. They moved three people to the free plan. It should recover in January.",
  },
  {
    name: "Ines Varga",
    time: "2026-11-10T10:05",
    shown: "10 November 2026, 10:05",
    text: "Thanks. I have added a note to the account row so finance sees it too.",
  },
]

const versions = [
  {
    name: "Version 14, Ines Varga",
    time: "2026-11-12T16:30",
    shown: "12 November 2026, 16:30",
    text: "Changed seats for Orchard Schools from 118 to 130.",
  },
  {
    name: "Version 13, Tomas Reyes",
    time: "2026-11-11T11:02",
    shown: "11 November 2026, 11:02",
    text: "Added the Quayside Rentals account.",
  },
  {
    name: "Version 12, Ada Okafor",
    time: "2026-11-09T08:47",
    shown: "9 November 2026, 08:47",
    text: "Renamed the column Revenue to MRR (€).",
  },
]

const footerGroups = [
  { title: "Product", links: ["Views", "Comments", "History", "Pricing"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
]

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="border-b border-border">
      <div className={container}>
        <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
          <a
            href="#"
            className={cn("font-heading text-h2 text-foreground", focusRing)}
          >
            Plainsheet
          </a>
          <nav aria-label="Main" className="hidden md:ml-auto md:block">
            <ul className="flex items-center gap-8">
              {headerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={navLink}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <a href="#" className={cn(navLink, "hidden md:inline")}>
              Sign in
            </a>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClasses
              )}
            >
              Start free
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn(buttonClasses, "md:hidden")}
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
            {[...headerLinks, "Sign in"].map((link) => (
              <li key={link}>
                <a href="#" className={cn(navLink, "block py-2")}>
                  {link}
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
      <p className={cn(label, "md:col-span-3")}>{eyebrow}</p>
      <h2 id={id} className="text-h1 md:col-span-9">
        {title}
      </h2>
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-16 pb-16">
      <div className={cn(container, grid)}>
        <p className={cn(label, "md:col-span-12")}>Spreadsheets for teams</p>
        <h1
          id="hero-title"
          className="mt-2 text-h1 md:col-span-10 md:text-display"
        >
          The spreadsheet everyone on the team can actually read.
        </h1>
        <p className="mt-4 max-w-lg md:col-span-6">
          Plainsheet turns a crowded workbook into a clean view that shows only
          the rows and columns each person needs. Your team reads it, comments
          on the numbers and sees every change, while the sheet underneath stays
          exactly as it was.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4 md:col-span-12">
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              buttonClasses
            )}
          >
            Start free
          </a>
          <a href="#how-it-works" className={textLink}>
            See how it works
          </a>
        </div>
        <figure className="mt-8 md:col-span-12">
          <div className="rounded-md border border-border bg-card p-4 md:p-8">
            <table className="w-full text-body">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "px-4 py-2 text-left first:pl-0 last:pr-0"
                    )}
                  >
                    Account
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell"
                    )}
                  >
                    Owner
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell"
                    )}
                  >
                    Region
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "px-4 py-2 text-right first:pl-0 last:pr-0"
                    )}
                  >
                    Seats
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "px-4 py-2 text-right first:pl-0 last:pr-0"
                    )}
                  >
                    MRR (€)
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      label,
                      "hidden px-4 py-2 text-right first:pl-0 last:pr-0 md:table-cell"
                    )}
                  >
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="px-4 py-2 text-left first:pl-0 last:pr-0">
                      {row.name}
                    </td>
                    <td className="hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell">
                      {row.owner}
                    </td>
                    <td className="hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell">
                      {row.region}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                      {row.seats}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                      {row.mrr}
                    </td>
                    <td className="hidden px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0 md:table-cell">
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className={cn(label, "mt-2")}>
            A shared view of the accounts sheet, November 2026
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ProofRow() {
  return (
    <section aria-label="Customers" className="pb-8">
      <div className={container}>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <p className={label}>Used by teams at</p>
          {[
            "Northwind Ferries",
            "Calder & Moss",
            "Brightwater",
            "Okapi Studio",
            "Fenwick Health",
          ].map((name) => (
            <p key={name} className="font-heading text-h2">
              {name}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      label: "Views",
      title: "Show only what matters",
      text: "Pick the rows and columns a team needs and give the view its own link. The source sheet keeps every formula and hidden tab; nobody has to scroll past them.",
    },
    {
      label: "Comments",
      title: "Talk about a number in place",
      text: "Leave a comment on a cell, a row or the whole view. Questions stay next to the figure they are about, instead of in a long email thread.",
    },
    {
      label: "History",
      title: "See every change, undo any",
      text: "Each edit is saved as a version with a name and a time. Compare two versions side by side and restore one in a single step.",
    },
  ]

  return (
    <section aria-labelledby="features-title" className="pb-16">
      <div className={container}>
        <SectionHeader
          id="features-title"
          eyebrow="01 / Features"
          title="Three things a spreadsheet never did well."
        />
        <div className={cn(grid, "mt-8 gap-y-8")}>
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col border-t border-border pt-4 md:col-span-4"
            >
              <p className={label}>{feature.label}</p>
              <h3 className="mt-2 text-h2">{feature.title}</h3>
              <p className="mt-4 max-w-lg">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Entries({
  items,
}: {
  items: { name: string; time: string; shown: string; text: string }[]
}) {
  return (
    <ol className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.time} className="flex flex-col gap-2">
          <p className={figureEntry}>
            {item.name}, <time dateTime={item.time}>{item.shown}</time>
          </p>
          <p>{item.text}</p>
        </li>
      ))}
    </ol>
  )
}

function HowItWorks() {
  const steps = [
    {
      step: "Step 01",
      title: "Ask about a figure where it sits",
      text: "Open the view, select a cell and write your question. Everyone who can see the view gets the thread, and the answer stays attached to the row.",
      caption: "3 comments on the Pemberton Labs row",
      items: comments,
    },
    {
      step: "Step 02",
      title: "Keep every version of the sheet",
      text: "Plainsheet records each change with who made it and when. If a number looks wrong next week, open the history and restore the version that was right.",
      caption: "History of the accounts view",
      items: versions,
    },
  ]

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="pb-16">
      <div className={container}>
        <SectionHeader
          id="how-title"
          eyebrow="02 / How it works"
          title="From a shared sheet to a clear answer in two steps."
        />
        <div className="mt-8 flex flex-col gap-8">
          {steps.map((step) => (
            <div
              key={step.step}
              className={cn(grid, "gap-y-8 border-t border-border pt-8")}
            >
              <div className="flex flex-col md:col-span-5">
                <p className={label}>{step.step}</p>
                <h3 className="mt-2 text-h2">{step.title}</h3>
                <p className="mt-4 max-w-lg">{step.text}</p>
              </div>
              <figure className="md:col-span-6 md:col-start-7">
                <div className="rounded-md border border-border bg-card p-4 md:p-8">
                  <Entries items={step.items} />
                </div>
                <figcaption className={cn(label, "mt-2")}>
                  {step.caption}
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Quote() {
  return (
    <section aria-label="Customer quote" className="pb-16">
      <div className={container}>
        <figure className={cn(grid, "border-t border-foreground pt-8")}>
          <blockquote className="font-heading text-h1 md:col-span-10">
            <p>
              We stopped sending the budget workbook around. Now the whole
              office reads one view, and the questions come to the cell instead
              of my inbox.
            </p>
          </blockquote>
          <figcaption className={cn(label, "mt-4 md:col-span-12")}>
            Marta Lindgren, Finance lead, Northwind Ferries
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-16">
      <div className={container}>
        <div className={cn(grid, "border-t border-border pt-16")}>
          <h2 id="cta-title" className="text-h1 md:col-span-8">
            Give your team a sheet they can read.
          </h2>
          <p className="mt-4 max-w-lg md:col-span-8">
            Connect a spreadsheet and share your first view in a few minutes,
            free for teams of up to five people.
          </p>
          <div className="mt-8 md:col-span-12">
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "default" }),
                buttonClasses
              )}
            >
              Start free
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border py-16">
      <div className={container}>
        <div className={cn(grid, "gap-y-8")}>
          <div className="flex flex-col gap-4 md:col-span-3">
            <p className="font-heading text-h2">Plainsheet</p>
            <p>Spreadsheets your whole team can read.</p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title} className="md:col-span-3">
              <h2 className="font-mono text-label text-foreground uppercase">
                {group.title}
              </h2>
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
        <p className={cn(label, "mt-8 border-t border-border pt-4")}>
          © 2026 Plainsheet Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="text-body">
      <SiteHeader />
      <main>
        <Hero />
        <ProofRow />
        <Features />
        <HowItWorks />
        <Quote />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
