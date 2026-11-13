import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClasses = "rounded-sm px-4 font-mono text-label uppercase"
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

const navItems = ["Product", "Pricing", "Docs"]

const views = [
  {
    name: "Q3 budget by team",
    owner: "Ines Halvorsen",
    updated: "2026-11-04",
    updatedLabel: "4 November 2026",
    rows: "1,284",
    comments: "12",
  },
  {
    name: "Hiring plan 2027",
    owner: "Tomas Reyes",
    updated: "2026-11-03",
    updatedLabel: "3 November 2026",
    rows: "86",
    comments: "7",
  },
  {
    name: "Vendor contracts",
    owner: "Priya Lindqvist",
    updated: "2026-10-30",
    updatedLabel: "30 October 2026",
    rows: "342",
    comments: "3",
  },
  {
    name: "Regional sales, October",
    owner: "Dara Moss",
    updated: "2026-10-29",
    updatedLabel: "29 October 2026",
    rows: "5,910",
    comments: "21",
  },
  {
    name: "Office equipment",
    owner: "Kenji Abara",
    updated: "2026-10-27",
    updatedLabel: "27 October 2026",
    rows: "158",
    comments: "0",
  },
]

const companies = [
  "Halden Freight",
  "Marrow & Pike",
  "Oakline Studio",
  "Brightwater Clinics",
  "Fennick Labs",
]

const features = [
  {
    label: "Views",
    title: "Show the columns that matter",
    text: "Pick the rows and columns each team needs and hide the rest. The source sheet stays as messy as it likes; the view stays clean and readable.",
  },
  {
    label: "Comments",
    title: "Talk about a number where it sits",
    text: "Comment on any cell, mention a colleague and resolve the thread when the question is answered. No more screenshots pasted into chat.",
  },
  {
    label: "History",
    title: "See who changed what, and when",
    text: "Every edit is kept as a version with a name and a time. Compare two versions side by side or go back to one in a click.",
  },
]

const comments = [
  {
    name: "Ines Halvorsen",
    dateTime: "2026-11-04T09:12",
    time: "4 November 2026, 09:12",
    text: "Why did travel go up 18% in October? The forecast said flat.",
  },
  {
    name: "Tomas Reyes",
    dateTime: "2026-11-04T10:40",
    time: "4 November 2026, 10:40",
    text: "Two offsites moved from September. The total for the quarter is unchanged.",
  },
  {
    name: "Ines Halvorsen",
    dateTime: "2026-11-04T10:52",
    time: "4 November 2026, 10:52",
    text: "Thanks, that explains it. Marking this as resolved.",
  },
]

const versions = [
  {
    name: "Dara Moss",
    dateTime: "2026-10-29T16:05",
    time: "29 October 2026, 16:05",
    text: "Added October figures for the northern region.",
  },
  {
    name: "Kenji Abara",
    dateTime: "2026-10-28T11:30",
    time: "28 October 2026, 11:30",
    text: "Renamed the column “Rep” to “Account owner”.",
  },
  {
    name: "Dara Moss",
    dateTime: "2026-10-27T08:47",
    time: "27 October 2026, 08:47",
    text: "Imported the sheet from the shared drive.",
  },
]

const footerGroups = [
  { title: "Product", links: ["Views", "Comments", "History", "Pricing"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Legal", links: ["Terms", "Privacy", "Security", "Cookies"] },
]

type Entry = { name: string; dateTime: string; time: string; text: string }

function SectionHeader({
  number,
  title,
  heading,
}: {
  number: string
  title: string
  heading: string
}) {
  return (
    <div className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}>
      <p className={cn(label, "text-muted-foreground md:col-span-3")}>
        {number} / {title}
      </p>
      <h2 className="text-h1 md:col-span-9">{heading}</h2>
    </div>
  )
}

function EntryFigure({
  entries,
  caption,
}: {
  entries: Entry[]
  caption: string
}) {
  return (
    <figure className="md:col-span-6 md:col-start-7">
      <div className="rounded-md border border-border bg-card p-4 md:p-8">
        <ol className="flex flex-col gap-4">
          {entries.map((entry) => (
            <li key={entry.dateTime} className="flex flex-col gap-2">
              <p className="flex flex-wrap gap-x-2 font-mono text-label text-muted-foreground tabular-nums">
                <span>{entry.name}</span>
                <time dateTime={entry.dateTime}>{entry.time}</time>
              </p>
              <p className="text-body text-foreground">{entry.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  const cell = "px-4 py-2 first:pl-0 last:pr-0"
  const headCell = cn(cell, label, "text-muted-foreground")
  const middle = "hidden md:table-cell"

  return (
    <div className="text-body">
      <header className="border-b border-border" onKeyDown={handleHeaderKeyDown}>
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
              <nav aria-label="Main" className="hidden gap-8 md:flex">
                {navItems.map((item) => (
                  <a key={item} href="#" className={navLink}>
                    {item}
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
                  buttonClasses
                )}
              >
                Start free
              </a>
              <Button
                ref={menuButtonRef}
                variant="outline"
                className={cn(buttonClasses, "md:hidden")}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                Menu
              </Button>
            </div>
          </div>
          <nav
            id="mobile-menu"
            aria-label="Main"
            hidden={!menuOpen}
            className="border-t border-border py-2 md:hidden"
          >
            <ul>
              {[...navItems, "Sign in"].map((item) => (
                <li key={item}>
                  <a href="#" className={cn(navLink, "block py-2")}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-16 pb-16">
          <div className={container}>
            <div className={grid}>
              <p
                className={cn(label, "text-muted-foreground md:col-span-12")}
              >
                Spreadsheets for teams
              </p>
              <h1 className="mt-2 text-h1 md:col-span-10 md:text-display">
                The spreadsheet everyone on the team can actually read.
              </h1>
              <p className="mt-4 max-w-lg md:col-span-6">
                Plainsheet turns messy spreadsheets into clean shared views.
                Your team reads the numbers, comments on the cells that need
                an answer and sees every change that was made.
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
              <figure className="mt-8 min-w-0 md:col-span-12">
                <div className="rounded-md border border-border bg-card p-4 md:p-8">
                  <table className="w-full text-body">
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className={cn(headCell, "text-left")}>
                          View
                        </th>
                        <th
                          scope="col"
                          className={cn(headCell, middle, "text-left")}
                        >
                          Owner
                        </th>
                        <th
                          scope="col"
                          className={cn(headCell, middle, "text-left")}
                        >
                          Updated
                        </th>
                        <th
                          scope="col"
                          className={cn(headCell, middle, "text-right")}
                        >
                          Rows
                        </th>
                        <th scope="col" className={cn(headCell, "text-right")}>
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {views.map((view) => (
                        <tr key={view.name}>
                          <td className={cell}>{view.name}</td>
                          <td className={cn(cell, middle)}>{view.owner}</td>
                          <td className={cn(cell, middle, "tabular-nums")}>
                            <time dateTime={view.updated}>
                              {view.updatedLabel}
                            </time>
                          </td>
                          <td
                            className={cn(
                              cell,
                              middle,
                              "text-right font-mono tabular-nums"
                            )}
                          >
                            {view.rows}
                          </td>
                          <td
                            className={cn(
                              cell,
                              "text-right font-mono tabular-nums"
                            )}
                          >
                            {view.comments}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
                  Shared views in a finance workspace
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section aria-label="Customers" className="pb-8">
          <div className={container}>
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>
                Used by teams at
              </p>
              {companies.map((company) => (
                <span key={company} className="font-heading text-h2">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className={container}>
            <SectionHeader
              number="01"
              title="Features"
              heading="Everything a shared sheet needs, and nothing it does not."
            />
            <div className={cn(grid, "mt-8 gap-y-8")}>
              {features.map((feature) => (
                <article
                  key={feature.label}
                  className="flex flex-col gap-4 border-t border-border pt-4 md:col-span-4"
                >
                  <div className="flex flex-col gap-2">
                    <p className={cn(label, "text-muted-foreground")}>
                      {feature.label}
                    </p>
                    <h3 className="text-h2">{feature.title}</h3>
                  </div>
                  <p className="max-w-lg">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="pb-16">
          <div className={container}>
            <SectionHeader
              number="02"
              title="How it works"
              heading="From a messy file to a view the team can trust."
            />
            <div className="mt-8 flex flex-col gap-8">
              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col gap-4 md:col-span-5">
                  <div className="flex flex-col gap-2">
                    <p className={cn(label, "text-muted-foreground")}>
                      Step 01
                    </p>
                    <h3 className="text-h2">
                      Open a view and comment on any cell
                    </h3>
                  </div>
                  <p className="max-w-lg">
                    Connect a sheet, choose what each team should see and share
                    the link. Questions go on the cell they are about, so the
                    answer is there for the next person who reads it.
                  </p>
                </div>
                <EntryFigure
                  entries={comments}
                  caption="A comment thread on the travel line"
                />
              </div>
              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col gap-4 md:col-span-5">
                  <div className="flex flex-col gap-2">
                    <p className={cn(label, "text-muted-foreground")}>
                      Step 02
                    </p>
                    <h3 className="text-h2">Every change is kept</h3>
                  </div>
                  <p className="max-w-lg">
                    Each edit is saved as a version with a name and a time.
                    When a number looks wrong, open the history and see who
                    changed it and what it was before.
                  </p>
                </div>
                <EntryFigure
                  entries={versions}
                  caption="Version history of the regional sales view"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Customer quote" className="pb-16">
          <div className={container}>
            <figure className={cn(grid, "border-t border-foreground pt-8")}>
              <blockquote className="font-heading text-h1 md:col-span-10">
                <p>
                  We stopped emailing spreadsheets around. Now the whole
                  operations team reads the same numbers and argues about them
                  in the comments, where the argument belongs.
                </p>
              </blockquote>
              <figcaption
                className={cn(label, "mt-4 text-muted-foreground md:col-span-10")}
              >
                Lena Varga, Head of Operations, Halden Freight
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="pb-16">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <div className="flex flex-col gap-4 md:col-span-8">
                <h2 className="text-h1">Give your team one sheet to read.</h2>
                <p className="max-w-lg">
                  Start with a free workspace for up to five people and connect
                  your first spreadsheet in a few minutes.
                </p>
              </div>
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
      </main>

      <footer className="border-t border-border py-16">
        <div className={container}>
          <div className={cn(grid, "gap-y-8")}>
            <div className="flex flex-col gap-4 md:col-span-3">
              <p className="font-heading text-h2">Plainsheet</p>
              <p>Spreadsheets your whole team can read.</p>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-4 md:col-span-3">
                <h2 className={cn(label, "text-foreground")}>{group.title}</h2>
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
              © 2026 Plainsheet Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
