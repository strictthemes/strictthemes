import { useEffect, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Menu } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"

const labelHeading = "font-mono text-label uppercase text-foreground"

type Period = "7" | "30" | "90"

const periods: { value: Period; label: string }[] = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
]

type KeyNumber = {
  label: string
  value: string
  direction: "up" | "down"
  change: string
}

const keyNumbers: Record<Period, KeyNumber[]> = {
  "7": [
    { label: "Active sheets", value: "128", direction: "up", change: "6%" },
    { label: "Editors", value: "42", direction: "up", change: "12%" },
    { label: "Edits per day", value: "559", direction: "up", change: "9%" },
    { label: "Comments", value: "286", direction: "down", change: "4%" },
  ],
  "30": [
    { label: "Active sheets", value: "214", direction: "up", change: "3%" },
    { label: "Editors", value: "57", direction: "up", change: "4%" },
    { label: "Edits per day", value: "512", direction: "down", change: "3%" },
    { label: "Comments", value: "1,140", direction: "up", change: "11%" },
  ],
  "90": [
    { label: "Active sheets", value: "342", direction: "up", change: "18%" },
    { label: "Editors", value: "61", direction: "down", change: "2%" },
    { label: "Edits per day", value: "498", direction: "up", change: "7%" },
    { label: "Comments", value: "3,402", direction: "up", change: "21%" },
  ],
}

// Friday 6 March to Thursday 12 March 2026, oldest first.
const editsPerDay = [
  { short: "Fri", day: "Friday", value: 584 },
  { short: "Sat", day: "Saturday", value: 162 },
  { short: "Sun", day: "Sunday", value: 138 },
  { short: "Mon", day: "Monday", value: 642 },
  { short: "Tue", day: "Tuesday", value: 711 },
  { short: "Wed", day: "Wednesday", value: 689 },
  { short: "Thu", day: "Thursday", value: 987 },
]

type Status = "Shared" | "Private"
type StatusFilter = "All" | Status

const statusFilters: StatusFilter[] = ["All", "Shared", "Private"]

const sheets: {
  name: string
  owner: string
  status: Status
  edits: number
  date: string
  dateLabel: string
}[] = [
  {
    name: "Q3 budget",
    owner: "Dana Whitcombe",
    status: "Shared",
    edits: 412,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Hiring plan 2026",
    owner: "Mira Halvorsen",
    status: "Private",
    edits: 96,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Warehouse stock count",
    owner: "Tobias Renk",
    status: "Shared",
    edits: 1284,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Supplier price list",
    owner: "Ines Carvalho",
    status: "Shared",
    edits: 238,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Board pack figures",
    owner: "Mira Halvorsen",
    status: "Private",
    edits: 57,
    date: "2026-03-10",
    dateLabel: "10 March 2026",
  },
  {
    name: "Event seating chart",
    owner: "Kofi Mensah",
    status: "Shared",
    edits: 174,
    date: "2026-03-09",
    dateLabel: "9 March 2026",
  },
  {
    name: "Travel expenses March",
    owner: "Dana Whitcombe",
    status: "Private",
    edits: 31,
    date: "2026-03-07",
    dateLabel: "7 March 2026",
  },
  {
    name: "Customer churn model",
    owner: "Tobias Renk",
    status: "Shared",
    edits: 1,
    date: "2026-03-06",
    dateLabel: "6 March 2026",
  },
]

const activity = [
  {
    text: "Dana renamed Q3 budget",
    dateTime: "2026-03-12T14:05",
    label: "12 March 2026, 14:05",
  },
  {
    text: "Tobias added 40 rows to Warehouse stock count",
    dateTime: "2026-03-12T11:32",
    label: "12 March 2026, 11:32",
  },
  {
    text: "Mira made Hiring plan 2026 private",
    dateTime: "2026-03-12T09:18",
    label: "12 March 2026, 09:18",
  },
  {
    text: "Ines shared Supplier price list with Kofi",
    dateTime: "2026-03-11T16:47",
    label: "11 March 2026, 16:47",
  },
  {
    text: "Kofi left a comment on Event seating chart",
    dateTime: "2026-03-11T10:02",
    label: "11 March 2026, 10:02",
  },
  {
    text: "Dana created Travel expenses March",
    dateTime: "2026-03-10T08:40",
    label: "10 March 2026, 08:40",
  },
]

const navGroups = [
  {
    name: "Workspace",
    links: ["Overview", "Sheets", "Members", "Activity"],
  },
  {
    name: "Settings",
    links: ["Billing", "API keys"],
  },
]

function SidebarContent() {
  return (
    <>
      <p className="px-2 font-heading text-h2">Plainsheet</p>
      <nav aria-label="Main" className="flex flex-col gap-8">
        {navGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-2">
            <p className="px-2 font-mono text-label text-muted-foreground uppercase">
              {group.name}
            </p>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => {
                const current = link === "Overview"
                return (
                  <li key={link}>
                    <a
                      href="#"
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block rounded-sm px-2 py-2 font-mono text-label text-sidebar-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                        focusRing,
                        current &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      {link}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col px-2">
        <p className="wrap-break-word">Mira Halvorsen</p>
        <p className="font-mono text-label wrap-break-word text-muted-foreground">
          mira.halvorsen@northfield.example
        </p>
      </div>
    </>
  )
}

function ButtonGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-1">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Button
            key={option.value}
            type="button"
            variant={selected ? "secondary" : "outline"}
            aria-pressed={selected}
            className={buttonClass}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("7")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [query, setQuery] = useState("")

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)")
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const term = query.trim().toLowerCase()
  const rows = sheets.filter(
    (sheet) =>
      (status === "All" || sheet.status === status) &&
      sheet.name.toLowerCase().includes(term)
  )

  const largest = Math.max(...editsPerDay.map((day) => day.value))
  const periodLabel = periods.find((p) => p.value === period)!.label

  return (
    <div className="min-h-svh bg-background text-body text-foreground lg:flex">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r border-border bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(buttonClass, "lg:hidden")}
                  />
                }
              >
                <Menu aria-hidden="true" className="size-4" strokeWidth={1.5} />
                Menu
              </SheetTrigger>
              <SheetContent
                side="left"
                className="overflow-y-auto bg-sidebar px-4 pt-16 pb-8 text-body text-sidebar-foreground data-[side=left]:w-64"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-1 flex-col gap-8">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-h2">Overview</h1>
          </div>
          <Button type="button" className={buttonClass}>
            New sheet
          </Button>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8">
          <section aria-labelledby="key-numbers-heading">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="key-numbers-heading" className={labelHeading}>
                Key numbers
              </h2>
              <ButtonGroup
                label="Period"
                options={periods}
                value={period}
                onChange={setPeriod}
              />
            </div>
            <div className="mt-4 overflow-hidden rounded-md border border-border">
              <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                {keyNumbers[period].map((item) => {
                  const Arrow =
                    item.direction === "up" ? ArrowUpRight : ArrowDownRight
                  return (
                    <div
                      key={item.label}
                      className="flex min-w-0 flex-col gap-2 bg-background p-4"
                    >
                      <dt className="font-mono text-label text-muted-foreground uppercase">
                        {item.label}
                      </dt>
                      <dd className="font-mono text-h2 font-normal tabular-nums md:text-h1">
                        {item.value}
                      </dd>
                      <dd className="flex items-center gap-1 font-mono text-label text-foreground tabular-nums">
                        <Arrow
                          aria-hidden="true"
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span>
                          {item.direction === "up" ? "Up" : "Down"}{" "}
                          {item.change}
                          <span className="sr-only">
                            {" "}
                            from the previous {periodLabel}
                          </span>
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </section>

          <section
            aria-labelledby="chart-heading"
            className="rounded-md border border-border bg-background p-4 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="chart-heading" className={labelHeading}>
                Edits per day
              </h2>
              <p className="font-mono text-label text-muted-foreground uppercase">
                Last 7 days
              </p>
            </div>
            <div aria-hidden="true" className="mt-4 grid grid-cols-7 gap-2">
              {editsPerDay.map((day) => (
                <div key={day.short} className="flex min-w-0 flex-col gap-2">
                  <div className="flex h-64 flex-col justify-end gap-2">
                    <span className="font-mono text-label text-foreground tabular-nums">
                      {day.value}
                    </span>
                    <div
                      className="w-full bg-foreground"
                      style={{ height: `${(day.value / largest) * 90}%` }}
                    />
                  </div>
                  <span className="font-mono text-label text-muted-foreground uppercase">
                    {day.short}
                  </span>
                </div>
              ))}
            </div>
            <table className="sr-only" aria-labelledby="chart-heading">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Edits</th>
                </tr>
              </thead>
              <tbody>
                {editsPerDay.map((day) => (
                  <tr key={day.short}>
                    <th scope="row">{day.day}</th>
                    <td>{day.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="grid grid-cols-1 gap-y-8 2xl:grid-cols-12 2xl:gap-x-8">
            <section
              aria-labelledby="sheets-heading"
              className="min-w-0 rounded-md border border-border bg-background 2xl:col-span-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <h2 id="sheets-heading" className={labelHeading}>
                  Recent sheets
                </h2>
                <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filter by name"
                    aria-label="Filter by name"
                    className="w-full rounded-sm px-2 py-0 text-body sm:w-64 md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  <ButtonGroup
                    label="Status"
                    options={statusFilters.map((s) => ({ value: s, label: s }))}
                    value={status}
                    onChange={setStatus}
                  />
                </div>
              </div>
              <Table label="Recent sheets" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      scope="col"
                      className="font-mono text-label text-muted-foreground uppercase"
                    >
                      Name
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="font-mono text-label text-muted-foreground uppercase"
                    >
                      Owner
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="font-mono text-label text-muted-foreground uppercase"
                    >
                      Status
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right font-mono text-label text-muted-foreground uppercase"
                    >
                      Edits
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="text-right font-mono text-label text-muted-foreground uppercase"
                    >
                      Last edited
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="whitespace-normal">
                        No sheets match this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((sheet) => (
                      <TableRow key={sheet.name}>
                        <TableCell>{sheet.name}</TableCell>
                        <TableCell>{sheet.owner}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"
                          >
                            {sheet.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {sheet.edits.toLocaleString("en-GB")}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          <time dateTime={sheet.date}>{sheet.dateLabel}</time>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>

            <section
              aria-labelledby="activity-heading"
              className="min-w-0 rounded-md border border-border bg-background 2xl:col-span-4"
            >
              <div className="border-b border-border p-4">
                <h2 id="activity-heading" className={labelHeading}>
                  Activity
                </h2>
              </div>
              <ul>
                {activity.map((entry) => (
                  <li
                    key={entry.dateTime}
                    className="flex flex-col gap-2 border-b border-border p-4 last:border-b-0"
                  >
                    <p>{entry.text}</p>
                    <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                      <time dateTime={entry.dateTime}>{entry.label}</time>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
