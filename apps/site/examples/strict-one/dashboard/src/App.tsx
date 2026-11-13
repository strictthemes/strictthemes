import { useState } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

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

const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const labelHeading = "font-mono text-label uppercase text-foreground"
const label = "font-mono text-label uppercase text-muted-foreground"

/* ---------- Sample data ---------- */

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
    { label: "Active sheets", value: "64", direction: "up", change: "Up 12%" },
    { label: "Active editors", value: "23", direction: "up", change: "Up 3" },
    { label: "Edits", value: "842", direction: "up", change: "Up 9%" },
    { label: "Comments", value: "118", direction: "down", change: "Down 6%" },
  ],
  "30": [
    { label: "Active sheets", value: "97", direction: "up", change: "Up 18%" },
    { label: "Active editors", value: "31", direction: "up", change: "Up 5" },
    { label: "Edits", value: "3,610", direction: "up", change: "Up 14%" },
    { label: "Comments", value: "487", direction: "down", change: "Down 2%" },
  ],
  "90": [
    { label: "Active sheets", value: "128", direction: "up", change: "Up 31%" },
    { label: "Active editors", value: "38", direction: "up", change: "Up 11" },
    { label: "Edits", value: "9,875", direction: "up", change: "Up 22%" },
    { label: "Comments", value: "1,402", direction: "up", change: "Up 4%" },
  ],
}

// The last seven days, oldest first. Today is Thursday 12 March 2026.
const editsPerDay = [
  {
    day: "Fri",
    name: "Friday",
    date: "2026-03-06",
    text: "6 March 2026",
    value: 138,
  },
  {
    day: "Sat",
    name: "Saturday",
    date: "2026-03-07",
    text: "7 March 2026",
    value: 41,
  },
  {
    day: "Sun",
    name: "Sunday",
    date: "2026-03-08",
    text: "8 March 2026",
    value: 27,
  },
  {
    day: "Mon",
    name: "Monday",
    date: "2026-03-09",
    text: "9 March 2026",
    value: 162,
  },
  {
    day: "Tue",
    name: "Tuesday",
    date: "2026-03-10",
    text: "10 March 2026",
    value: 174,
  },
  {
    day: "Wed",
    name: "Wednesday",
    date: "2026-03-11",
    text: "11 March 2026",
    value: 149,
  },
  {
    day: "Thu",
    name: "Thursday",
    date: "2026-03-12",
    text: "12 March 2026",
    value: 151,
  },
]
const maxEdits = Math.max(...editsPerDay.map((d) => d.value))

type Status = "Shared" | "Private"

const sheets: {
  name: string
  owner: string
  status: Status
  edits: number
  dateTime: string
  edited: string
}[] = [
  {
    name: "Q3 budget",
    owner: "Dana Okafor",
    status: "Shared",
    edits: 214,
    dateTime: "2026-03-12T14:05",
    edited: "12 March 2026, 14:05",
  },
  {
    name: "Hiring plan 2026",
    owner: "Priya Raman",
    status: "Shared",
    edits: 166,
    dateTime: "2026-03-12T11:42",
    edited: "12 March 2026, 11:42",
  },
  {
    name: "Inventory counts",
    owner: "Tomas Lindqvist",
    status: "Shared",
    edits: 121,
    dateTime: "2026-03-12T09:17",
    edited: "12 March 2026, 09:17",
  },
  {
    name: "Pricing experiments",
    owner: "Ines Moreau",
    status: "Private",
    edits: 98,
    dateTime: "2026-03-11T16:50",
    edited: "11 March 2026, 16:50",
  },
  {
    name: "Support rota",
    owner: "Kwame Asante",
    status: "Private",
    edits: 77,
    dateTime: "2026-03-11T10:08",
    edited: "11 March 2026, 10:08",
  },
  {
    name: "Office move checklist",
    owner: "Leah Brandt",
    status: "Shared",
    edits: 52,
    dateTime: "2026-03-10T15:31",
    edited: "10 March 2026, 15:31",
  },
  {
    name: "Vendor contracts",
    owner: "Dana Okafor",
    status: "Private",
    edits: 31,
    dateTime: "2026-03-09T13:24",
    edited: "9 March 2026, 13:24",
  },
  {
    name: "Marketing calendar",
    owner: "Priya Raman",
    status: "Shared",
    edits: 9,
    dateTime: "2026-03-06T17:02",
    edited: "6 March 2026, 17:02",
  },
]

type StatusFilter = "All" | Status
const statusFilters: StatusFilter[] = ["All", "Shared", "Private"]

const activity = [
  {
    text: "Dana renamed Q3 forecast to Q3 budget",
    dateTime: "2026-03-12T14:05",
    time: "12 March 2026, 14:05",
  },
  {
    text: "Priya shared Hiring plan 2026 with 4 people",
    dateTime: "2026-03-12T11:42",
    time: "12 March 2026, 11:42",
  },
  {
    text: "Tomas added 38 rows to Inventory counts",
    dateTime: "2026-03-12T09:17",
    time: "12 March 2026, 09:17",
  },
  {
    text: "Ines left 3 comments on Pricing experiments",
    dateTime: "2026-03-11T16:50",
    time: "11 March 2026, 16:50",
  },
  {
    text: "Kwame made Support rota private",
    dateTime: "2026-03-11T10:08",
    time: "11 March 2026, 10:08",
  },
  {
    text: "Leah created Office move checklist",
    dateTime: "2026-03-10T15:31",
    time: "10 March 2026, 15:31",
  },
]

const navGroups = [
  { name: "Workspace", links: ["Overview", "Sheets", "Members", "Activity"] },
  { name: "Settings", links: ["Billing", "API keys"] },
]

/* ---------- Sidebar ---------- */

function SidebarContent({ idPrefix }: { idPrefix: string }) {
  return (
    <>
      <p className="px-2 font-heading text-h2">Plainsheet</p>
      <nav aria-label="Main" className="flex flex-col gap-8">
        {navGroups.map((group) => {
          const id = `${idPrefix}-${group.name.toLowerCase()}`
          return (
            <div key={group.name} className="flex flex-col gap-2">
              <p id={id} className={cn("px-2", label)}>
                {group.name}
              </p>
              <ul aria-labelledby={id} className="flex flex-col gap-1">
                {group.links.map((link) => {
                  const current = link === "Overview"
                  return (
                    <li key={link}>
                      <a
                        href="#"
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "block rounded-sm px-2 py-2 font-mono text-label text-sidebar-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                          focusOutline,
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
          )
        })}
      </nav>
      <div className="mt-auto flex flex-col px-2">
        <p className="text-body">Dana Okafor</p>
        <p className="font-mono text-label text-muted-foreground">
          dana@haldenworks.com
        </p>
      </div>
    </>
  )
}

/* ---------- Page ---------- */

export function App() {
  const [period, setPeriod] = useState<Period>("7")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const rows = sheets.filter(
    (s) =>
      (status === "All" || s.status === status) &&
      s.name.toLowerCase().includes(q)
  )

  return (
    <div className="flex min-h-svh bg-background text-body text-foreground">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r border-border bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <SidebarContent idPrefix="sidebar" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(buttonClass, "lg:hidden")}
                  />
                }
              >
                Menu
              </SheetTrigger>
              <SheetContent
                side="left"
                className="overflow-y-auto bg-sidebar px-4 pt-16 pb-8 text-body text-sidebar-foreground data-[side=left]:w-64"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-1 flex-col gap-8">
                  <SidebarContent idPrefix="sheet" />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-h2">Overview</h1>
          </div>
          <Button className={buttonClass}>New sheet</Button>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8">
          {/* Key numbers */}
          <section aria-labelledby="key-numbers">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="key-numbers" className={labelHeading}>
                Key numbers
              </h2>
              <div role="group" aria-label="Period" className="flex gap-1">
                {periods.map((p) => (
                  <Button
                    key={p.value}
                    variant={period === p.value ? "secondary" : "outline"}
                    aria-pressed={period === p.value}
                    onClick={() => setPeriod(p.value)}
                    className={buttonClass}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-md border border-border">
              <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                {keyNumbers[period].map((k) => {
                  const Arrow =
                    k.direction === "up" ? ArrowUpRight : ArrowDownRight
                  return (
                    <div
                      key={k.label}
                      className="flex flex-col gap-2 bg-background p-4"
                    >
                      <dt className={label}>{k.label}</dt>
                      <dd className="font-mono text-h2 font-normal tabular-nums md:text-h1">
                        {k.value}
                      </dd>
                      <dd className="flex items-start gap-1 font-mono text-label text-foreground">
                        <Arrow
                          aria-hidden="true"
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span>
                          {k.change} from the previous {period} days
                        </span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </section>

          {/* Chart */}
          <section
            aria-labelledby="edits-per-day"
            className="rounded-md border border-border bg-background p-4 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="edits-per-day" className={labelHeading}>
                Edits per day
              </h2>
              <p className={label}>Last 7 days</p>
            </div>
            <div className="mt-4">
              <div aria-hidden="true" className="grid grid-cols-7 gap-2">
                {editsPerDay.map((d) => (
                  <div key={d.day} className="flex min-w-0 flex-col gap-2">
                    <div className="flex h-64 flex-col justify-end gap-2">
                      <span className="font-mono text-label tabular-nums">
                        {d.value}
                      </span>
                      <div
                        className="w-full bg-foreground"
                        style={{ height: `${(d.value / maxEdits) * 90}%` }}
                      />
                    </div>
                    <span className={label}>{d.day}</span>
                  </div>
                ))}
              </div>
              <table className="sr-only">
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Edits</th>
                  </tr>
                </thead>
                <tbody>
                  {editsPerDay.map((d) => (
                    <tr key={d.day}>
                      <td>
                        {d.name} <time dateTime={d.date}>{d.text}</time>
                      </td>
                      <td>{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-12 2xl:items-start">
            {/* Recent sheets */}
            <section
              aria-labelledby="recent-sheets"
              className="min-w-0 rounded-md border border-border bg-background 2xl:col-span-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <h2 id="recent-sheets" className={labelHeading}>
                  Recent sheets
                </h2>
                <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
                  <Input
                    type="search"
                    placeholder="Filter by name"
                    aria-label="Filter by name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-sm px-2 py-0 text-body sm:w-64 md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  <div role="group" aria-label="Status" className="flex gap-1">
                    {statusFilters.map((s) => (
                      <Button
                        key={s}
                        variant={status === s ? "secondary" : "outline"}
                        aria-pressed={status === s}
                        onClick={() => setStatus(s)}
                        className={buttonClass}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Table label="Recent sheets" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow>
                    {["Name", "Owner", "Status", "Edits", "Last edited"].map(
                      (h, i) => (
                        <TableHead
                          key={h}
                          scope="col"
                          className={cn(label, i >= 3 && "text-right")}
                        >
                          {h}
                        </TableHead>
                      )
                    )}
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
                    rows.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.owner}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {s.edits}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          <time dateTime={s.dateTime}>{s.edited}</time>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>

            {/* Activity */}
            <section
              aria-labelledby="activity"
              className="min-w-0 rounded-md border border-border bg-background 2xl:col-span-4"
            >
              <div className="border-b border-border p-4">
                <h2 id="activity" className={labelHeading}>
                  Activity
                </h2>
              </div>
              <ol className="divide-y divide-border">
                {activity.map((a) => (
                  <li key={a.dateTime} className="flex flex-col gap-2 p-4">
                    <p>{a.text}</p>
                    <time dateTime={a.dateTime} className={label}>
                      {a.time}
                    </time>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
