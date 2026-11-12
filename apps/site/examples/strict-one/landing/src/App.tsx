import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const mutedLabel = cn(label, "text-muted-foreground")
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const footerLink = cn(
  "text-body text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const headerLinks = ["Product", "Pricing", "Docs"]

const budgetRows = [
  {
    team: "Customer support",
    owner: "Dana Whitlock",
    updated: "2026-10-28",
    spent: "9,840",
    budget: "12,400",
  },
  {
    team: "Field sales",
    owner: "Ravi Okonjo",
    updated: "2026-10-27",
    spent: "21,310",
    budget: "24,000",
  },
  {
    team: "Design",
    owner: "Mira Halvorsen",
    updated: "2026-10-24",
    spent: "4,120",
    budget: "6,500",
  },
  {
    team: "Platform",
    owner: "Tobias Lunde",
    updated: "2026-10-22",
    spent: "17,905",
    budget: "18,000",
  },
  {
    team: "People ops",
    owner: "Ines Carvalho",
    updated: "2026-10-19",
    spent: "2,760",
    budget: "5,200",
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${months[month - 1]} ${year}`
}

const features = [
  {
    label: "Views",
    title: "One sheet, many clean views",
    text: "Pick the columns and rows each team needs and hide the rest. The source sheet stays as it is; everyone else sees a tidy table they can read at a glance.",
  },
  {
    label: "Comments",
    title: "Questions sit next to the number",
    text: "Comment on a single cell or a whole row. The thread stays attached when the sheet is sorted, filtered or re-imported, so nobody asks which line you meant.",
  },
  {
    label: "History",
    title: "Every change, with a name on it",
    text: "Each edit is saved as a version with who made it and when. Compare any two versions side by side and restore an old value in one step.",
  },
]

const comments = [
  {
    name: "Ravi Okonjo",
    time: "2026-10-28T09:12",
    shown: "09:12",
    text: "Field sales is at 21,310 of 24,000. Does that include the October travel claims?",
  },
  {
    name: "Dana Whitlock",
    time: "2026-10-28T09:40",
    shown: "09:40",
    text: "Not yet. Finance adds them on Friday, so expect about 1,900 more.",
  },
  {
    name: "Ravi Okonjo",
    time: "2026-10-28T09:44",
    shown: "09:44",
    text: "Thanks. I will hold the conference booking until then.",
  },
]

const versions = [
  {
    name: "Version 14 · Tobias Lunde",
    time: "2026-10-22T16:05",
    shown: "22 October 2026, 16:05",
    text: "Changed the Platform budget from 16,500 to 18,000.",
  },
  {
    name: "Version 13 · Mira Halvorsen",
    time: "2026-10-21T11:30",
    shown: "21 October 2026, 11:30",
    text: "Added 1 row: Design, owner Mira Halvorsen.",
  },
  {
    name: "Version 12 · Dana Whitlock",
    time: "2026-10-20T08:58",
    shown: "20 October 2026, 08:58",
    text: "Imported the October export from the finance sheet. 3 rows updated.",
  },
]

const footerGroups = [
  { title: "Product", links: ["Views", "Comments", "History", "Pricing"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
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
      <p className={cn(mutedLabel, "md:col-span-3")}>{eyebrow}</p>
      <h2 id={id} className="text-h1 md:col-span-9">
        {title}
      </h2>
    </div>
  )
}

type Entry = { name: string; time: string; shown: string; text: string }

function EntryFigure({
  entries,
  caption,
}: {
  entries: Entry[]
  caption: string
}) {
  return (
    <figure>
      <div className="rounded-md border border-border bg-card p-4 md:p-8">
        <ol className="flex flex-col gap-4">
          {entries.map((entry) => (
            <li key={entry.time} className="flex flex-col gap-2">
              <p className="font-mono text-label text-muted-foreground">
                {entry.name} · <time dateTime={entry.time}>{entry.shown}</time>
              </p>
              <p className="max-w-lg">{entry.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={cn(mutedLabel, "mt-2")}>{caption}</figcaption>
    </figure>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButtonRef.current?.focus()
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
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
            )}
          >
            Plainsheet
          </a>
          <nav aria-label="Main" className="hidden md:block">
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
          <div className="ml-auto flex items-center gap-4 md:gap-8">
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
          aria-label="Menu"
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

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section aria-labelledby="hero-title" className="pt-16 pb-16">
          <div className={cn(container, grid)}>
            <p className={cn(mutedLabel, "md:col-span-12")}>
              Spreadsheets for teams
            </p>
            <h1
              id="hero-title"
              className="mt-2 text-h1 md:col-span-10 md:text-display"
            >
              The spreadsheet everyone on the team can actually read.
            </h1>
            <p className="mt-4 max-w-lg md:col-span-6">
              Plainsheet turns a messy spreadsheet into a clean shared view.
              Your team reads the numbers, asks questions on the rows they care
              about, and sees every change with a name and a time on it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:col-span-12">
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClass
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
                    <tr className="border-b border-border">
                      <th
                        scope="col"
                        className={cn(
                          mutedLabel,
                          "px-4 py-2 text-left first:pl-0 last:pr-0"
                        )}
                      >
                        Team
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          mutedLabel,
                          "hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell"
                        )}
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          mutedLabel,
                          "hidden px-4 py-2 text-left first:pl-0 last:pr-0 md:table-cell"
                        )}
                      >
                        Updated
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          mutedLabel,
                          "px-4 py-2 text-right first:pl-0 last:pr-0"
                        )}
                      >
                        Spent
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          mutedLabel,
                          "px-4 py-2 text-right first:pl-0 last:pr-0"
                        )}
                      >
                        Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {budgetRows.map((row) => (
                      <tr key={row.team}>
                        <td className="px-4 py-2 first:pl-0 last:pr-0">
                          {row.team}
                        </td>
                        <td className="hidden px-4 py-2 whitespace-nowrap first:pl-0 last:pr-0 md:table-cell">
                          {row.owner}
                        </td>
                        <td className="hidden px-4 py-2 whitespace-nowrap first:pl-0 last:pr-0 md:table-cell">
                          <time dateTime={row.updated}>
                            {formatDate(row.updated)}
                          </time>
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {row.spent}
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {row.budget}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <figcaption className={cn(mutedLabel, "mt-2")}>
                Shared view: Q4 team budgets, EUR
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Proof row */}
        <section aria-label="Customers" className="pb-8">
          <div className={container}>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <p className={mutedLabel}>Used by teams at</p>
              <span className="font-heading text-h2">Northwind Freight</span>
              <span className="font-heading text-h2">Kestrel Labs</span>
              <span className="font-heading text-h2">Halden &amp; Moss</span>
              <span className="font-heading text-h2">Brightwater</span>
              <span className="font-heading text-h2">Oakline Studio</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="features-title" className="pb-16">
          <div className={container}>
            <SectionHeader
              id="features-title"
              eyebrow="01 / Features"
              title="Built for the people who read the sheet"
            />
            <div className={cn(grid, "mt-8 gap-y-8")}>
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col border-t border-border pt-4 md:col-span-4"
                >
                  <p className={mutedLabel}>{feature.label}</p>
                  <h3 className="mt-2 text-h2">{feature.title}</h3>
                  <p className="mt-4 max-w-lg">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="pb-16"
        >
          <div className={container}>
            <SectionHeader
              id="how-title"
              eyebrow="02 / How it works"
              title="From a shared file to a shared answer"
            />
            <div className="mt-8 flex flex-col gap-8">
              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col md:col-span-5">
                  <p className={mutedLabel}>Step 01</p>
                  <h3 className="mt-2 text-h2">
                    Ask about a number where it sits
                  </h3>
                  <p className="mt-4 max-w-lg">
                    Open the view, click a row and write your question. The
                    owner of that row gets a note, and the answer stays on the
                    row for the next person who wonders the same thing.
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <EntryFigure
                    entries={comments}
                    caption="Comments on the Field sales row"
                  />
                </div>
              </div>
              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col md:col-span-5">
                  <p className={mutedLabel}>Step 02</p>
                  <h3 className="mt-2 text-h2">
                    See who changed what, and when
                  </h3>
                  <p className="mt-4 max-w-lg">
                    Every import and every edit becomes a version. Read the list
                    to see what moved this week, and restore any earlier value
                    without digging through old copies of the file.
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <EntryFigure
                    entries={versions}
                    caption="Version history of Q4 team budgets"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section aria-label="Customer quote" className="pb-16">
          <div className={container}>
            <figure className={cn(grid, "border-t border-foreground pt-8")}>
              <blockquote className="font-heading text-h1 md:col-span-10">
                <p>
                  We stopped emailing spreadsheets around. Finance keeps the
                  master sheet, and every team lead reads the same clean view.
                </p>
              </blockquote>
              <figcaption className={cn(mutedLabel, "mt-4 md:col-span-12")}>
                Hanna Lindqvist, Head of Finance, Northwind Freight
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Closing call to action */}
        <section aria-labelledby="cta-title" className="pb-16">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <h2 id="cta-title" className="text-h1 md:col-span-8">
                Give your team a sheet they can read
              </h2>
              <p className="mt-4 max-w-lg md:col-span-8">
                Connect a spreadsheet and share your first clean view in about
                ten minutes, free for up to 5 people.
              </p>
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClass,
                  "mt-8 justify-self-start md:col-span-12"
                )}
              >
                Start free
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-16">
        <div className={container}>
          <div className={cn(grid, "gap-y-8")}>
            <div className="flex flex-col gap-4 md:col-span-3">
              <p className="font-heading text-h2">Plainsheet</p>
              <p className="max-w-lg">Spreadsheets your whole team can read.</p>
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
            <p className={mutedLabel}>© 2026 Plainsheet Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
