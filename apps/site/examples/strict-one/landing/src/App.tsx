import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

const label = "font-mono text-label uppercase"
const buttonClasses = "rounded-sm px-4 font-mono text-label uppercase"

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const listLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const navLinks = ["Product", "Pricing", "Docs"]

const views = [
  {
    name: "Q4 vendor payments",
    owner: "Ines Okafor",
    updated: { iso: "2026-11-12", text: "12 November 2026" },
    rows: "1,284",
    comments: "18",
  },
  {
    name: "Regional headcount plan",
    owner: "Tomas Rieger",
    updated: { iso: "2026-11-11", text: "11 November 2026" },
    rows: "342",
    comments: "7",
  },
  {
    name: "Support tickets by product",
    owner: "Mara Linde",
    updated: { iso: "2026-11-10", text: "10 November 2026" },
    rows: "5,906",
    comments: "31",
  },
  {
    name: "Warehouse stock counts",
    owner: "Jonas Achterberg",
    updated: { iso: "2026-11-07", text: "7 November 2026" },
    rows: "2,417",
    comments: "4",
  },
  {
    name: "Marketing spend 2026",
    owner: "Priya Raman",
    updated: { iso: "2026-11-03", text: "3 November 2026" },
    rows: "96",
    comments: "12",
  },
]

const companies = [
  "Northwind Freight",
  "Halden & Co",
  "Ostrava Labs",
  "Brightmoor",
  "Kestrel Health",
]

const features = [
  {
    label: "Views",
    title: "One sheet, a view for each reader",
    body: "Pick the columns and rows a reader needs and hide the rest. The finance team keeps the full file; everyone else sees a clean table they can follow.",
  },
  {
    label: "Comments",
    title: "Questions sit on the cell",
    body: "Ask about a number where it is, not in a chat thread nobody can find later. Replies stay attached to the row, even after the data is updated.",
  },
  {
    label: "History",
    title: "Every change has a name and a time",
    body: "Each edit is saved as a version with who made it and what moved. Compare two versions side by side, or step back to last week in one click.",
  },
]

const comments = [
  {
    name: "Ines Okafor",
    time: { iso: "2026-11-12T09:14", text: "12 November 2026, 09:14" },
    text: "Row 214: is this the net or the gross amount? It doesn’t match the invoice.",
  },
  {
    name: "Tomas Rieger",
    time: { iso: "2026-11-12T09:41", text: "12 November 2026, 09:41" },
    text: "Gross. I’ve added a net column next to it so both are visible.",
  },
  {
    name: "Ines Okafor",
    time: { iso: "2026-11-12T10:02", text: "12 November 2026, 10:02" },
    text: "Thanks, that clears it up. Marking this resolved.",
  },
]

const versions = [
  {
    name: "Version 14 · Priya Raman",
    time: { iso: "2026-11-11T16:40", text: "11 November 2026, 16:40" },
    text: "Renamed column C to “Net amount” and hid 3 draft rows.",
  },
  {
    name: "Version 13 · Jonas Achterberg",
    time: { iso: "2026-11-10T11:05", text: "10 November 2026, 11:05" },
    text: "Imported 128 new rows from the October export.",
  },
  {
    name: "Version 12 · Priya Raman",
    time: { iso: "2026-11-07T08:30", text: "7 November 2026, 08:30" },
    text: "Fixed a currency error in 1 row of the Berlin office budget.",
  },
]

const footerGroups = [
  {
    title: "Product",
    links: ["Views", "Comments", "History", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Customers", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Security", "Cookies"],
  },
]

type Entry = {
  name: string
  time: { iso: string; text: string }
  text: string
}

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li key={entry.time.iso} className="flex flex-col gap-2">
          <p className="font-mono text-label text-muted-foreground">
            {entry.name} ·{" "}
            <time dateTime={entry.time.iso}>{entry.time.text}</time>
          </p>
          <p className="text-body text-foreground">{entry.text}</p>
        </li>
      ))}
    </ol>
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
      <p className={cn(label, "text-muted-foreground md:col-span-3")}>
        {eyebrow}
      </p>
      <h2 id={id} className="text-h1 text-foreground md:col-span-9">
        {title}
      </h2>
    </div>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
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
              focusOutline
            )}
          >
            Plainsheet
          </a>
          <nav aria-label="Main" className="hidden md:ml-auto md:block">
            <ul className="flex gap-8">
              {navLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={cn(label, listLink)}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#" className={cn(label, listLink, "hidden md:inline")}>
            Sign in
          </a>
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "outline" }),
              buttonClasses,
              "ml-auto md:ml-0"
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
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!open}
          className="border-t border-border py-2 md:hidden"
        >
          <ul>
            {[...navLinks, "Sign in"].map((link) => (
              <li key={link}>
                <a href="#" className={cn(label, listLink, "block py-2")}>
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
      <SiteHeader />

      <main>
        {/* Hero */}
        <section aria-labelledby="hero-title" className="pt-16 pb-16">
          <div className={cn(container, grid)}>
            <p className={cn(label, "text-muted-foreground md:col-span-12")}>
              Spreadsheets for teams
            </p>
            <h1
              id="hero-title"
              className="mt-2 text-h1 text-foreground md:col-span-10 md:text-display"
            >
              The spreadsheet everyone on the team can actually read.
            </h1>
            <p className="mt-4 max-w-lg md:col-span-6">
              Plainsheet turns the messy file your finance lead built into a
              clean shared view. Your team reads the numbers they need, asks
              about a cell where it sits, and sees every change with a name and
              a time.
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
                          "px-4 py-2 text-left text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        View
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          label,
                          "hidden px-4 py-2 text-left text-muted-foreground first:pl-0 last:pr-0 md:table-cell"
                        )}
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          label,
                          "hidden px-4 py-2 text-left text-muted-foreground first:pl-0 last:pr-0 md:table-cell"
                        )}
                      >
                        Updated
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          label,
                          "px-4 py-2 text-right text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        Rows
                      </th>
                      <th
                        scope="col"
                        className={cn(
                          label,
                          "px-4 py-2 text-right text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        Comments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {views.map((view) => (
                      <tr key={view.name} className="border-t border-border">
                        <td className="px-4 py-2 first:pl-0 last:pr-0">
                          {view.name}
                        </td>
                        <td className="hidden px-4 py-2 first:pl-0 last:pr-0 md:table-cell">
                          {view.owner}
                        </td>
                        <td className="hidden px-4 py-2 first:pl-0 last:pr-0 md:table-cell">
                          <time dateTime={view.updated.iso}>
                            {view.updated.text}
                          </time>
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {view.rows}
                        </td>
                        <td className="px-4 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                          {view.comments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
                Shared views in one workspace
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Proof row */}
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

        {/* Features */}
        <section aria-labelledby="features-title" className="pb-16">
          <div className={container}>
            <SectionHeader
              id="features-title"
              eyebrow="01 / Features"
              title="Built for the people who read the sheet, not just the one who wrote it."
            />
            <div className={cn(grid, "mt-8 gap-y-8")}>
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col border-t border-border pt-4 md:col-span-4"
                >
                  <p className={cn(label, "text-muted-foreground")}>
                    {feature.label}
                  </p>
                  <h3 className="mt-2 text-h2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-lg">{feature.body}</p>
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
              title="Connect a sheet, share a view, keep the record."
            />
            <div className="mt-8 flex flex-col gap-8">
              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col md:col-span-5">
                  <p className={cn(label, "text-muted-foreground")}>Step 01</p>
                  <h3 className="mt-2 text-h2 text-foreground">
                    Ask about a number where it sits
                  </h3>
                  <p className="mt-4 max-w-lg">
                    Open a shared view, pick a cell and write your question. The
                    owner gets a note with a link to that exact row, and the
                    answer stays next to the data for the next person who
                    wonders.
                  </p>
                </div>
                <figure className="md:col-span-6 md:col-start-7">
                  <div className="rounded-md border border-border bg-card p-4 md:p-8">
                    <EntryList entries={comments} />
                  </div>
                  <figcaption
                    className={cn(label, "mt-2 text-muted-foreground")}
                  >
                    A comment thread on row 214
                  </figcaption>
                </figure>
              </div>

              <div className={cn(grid, "gap-y-8 border-t border-border pt-8")}>
                <div className="flex flex-col md:col-span-5">
                  <p className={cn(label, "text-muted-foreground")}>Step 02</p>
                  <h3 className="mt-2 text-h2 text-foreground">
                    See who changed what, and when
                  </h3>
                  <p className="mt-4 max-w-lg">
                    Every save becomes a version with a name, a time and a short
                    summary of what moved. When a total looks wrong, you can
                    find the edit that changed it in seconds.
                  </p>
                </div>
                <figure className="md:col-span-6 md:col-start-7">
                  <div className="rounded-md border border-border bg-card p-4 md:p-8">
                    <EntryList entries={versions} />
                  </div>
                  <figcaption
                    className={cn(label, "mt-2 text-muted-foreground")}
                  >
                    Version history of Marketing spend 2026
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section aria-label="Customer quote" className="pb-16">
          <div className={container}>
            <figure className={cn(grid, "border-t border-foreground pt-8")}>
              <blockquote className="font-heading text-h1 text-foreground md:col-span-10">
                <p>
                  We stopped emailing spreadsheets around. Now the whole ops
                  team reads the same numbers, and the questions get answered on
                  the sheet.
                </p>
              </blockquote>
              <figcaption
                className={cn(
                  label,
                  "mt-4 text-muted-foreground md:col-span-12"
                )}
              >
                Hanna Vos, Head of Operations, Northwind Freight
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Closing call to action */}
        <section aria-labelledby="cta-title" className="pb-16">
          <div className={container}>
            <div className={cn(grid, "border-t border-border pt-16")}>
              <h2
                id="cta-title"
                className="text-h1 text-foreground md:col-span-8"
              >
                Give your team a sheet they can read.
              </h2>
              <p className="mt-4 max-w-lg md:col-span-8">
                Start free with up to three shared views, no card needed.
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
      </main>

      <footer className="border-t border-border py-16">
        <div className={container}>
          <div className={cn(grid, "gap-y-8")}>
            <div className="flex flex-col gap-4 md:col-span-3">
              <p className="font-heading text-h2 text-foreground">Plainsheet</p>
              <p>Spreadsheets your whole team can read.</p>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title} className="md:col-span-3">
                <h2 className={cn(label, "text-foreground")}>{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={listLink}>
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
            © 2026 Plainsheet Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
