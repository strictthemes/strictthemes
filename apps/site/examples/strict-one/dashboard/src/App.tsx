import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Menu, Plus } from "lucide-react"

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
    {
      label: "Active sheets",
      value: "128",
      direction: "up",
      change: "Up 6% from the previous 7 days",
    },
    {
      label: "Active editors",
      value: "42",
      direction: "up",
      change: "Up 3 from the previous 7 days",
    },
    {
      label: "Edits",
      value: "1,179",
      direction: "up",
      change: "Up 12% from the previous 7 days",
    },
    {
      label: "Comments",
      value: "86",
      direction: "down",
      change: "Down 8% from the previous 7 days",
    },
  ],
  "30": [
    {
      label: "Active sheets",
      value: "186",
      direction: "up",
      change: "Up 9% from the previous 30 days",
    },
    {
      label: "Active editors",
      value: "57",
      direction: "up",
      change: "Up 1 from the previous 30 days",
    },
    {
      label: "Edits",
      value: "4,936",
      direction: "up",
      change: "Up 4% from the previous 30 days",
    },
    {
      label: "Comments",
      value: "342",
      direction: "down",
      change: "Down 2% from the previous 30 days",
    },
  ],
  "90": [
    {
      label: "Active sheets",
      value: "241",
      direction: "up",
      change: "Up 18% from the previous 90 days",
    },
    {
      label: "Active editors",
      value: "63",
      direction: "down",
      change: "Down 5 from the previous 90 days",
    },
    {
      label: "Edits",
      value: "14.2k",
      direction: "up",
      change: "Up 21% from the previous 90 days",
    },
    {
      label: "Comments",
      value: "1,021",
      direction: "up",
      change: "Up 7% from the previous 90 days",
    },
  ],
}

const editsPerDay = [
  { day: "Fri", name: "Friday", value: 184 },
  { day: "Sat", name: "Saturday", value: 42 },
  { day: "Sun", name: "Sunday", value: 31 },
  { day: "Mon", name: "Monday", value: 226 },
  { day: "Tue", name: "Tuesday", value: 251 },
  { day: "Wed", name: "Wednesday", value: 238 },
  { day: "Thu", name: "Thursday", value: 207 },
]
const maxEdits = Math.max(...editsPerDay.map((d) => d.value))

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
    owner: "Dana Whitlock",
    status: "Shared",
    edits: 412,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Hiring pipeline",
    owner: "Theo Marchetti",
    status: "Private",
    edits: 96,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Vendor contracts 2026",
    owner: "Ines Corwell",
    status: "Shared",
    edits: 238,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Warehouse stock count",
    owner: "Malik Oduya",
    status: "Shared",
    edits: 1204,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Marketing calendar",
    owner: "Hana Sorensen",
    status: "Shared",
    edits: 167,
    date: "2026-03-10",
    dateLabel: "10 March 2026",
  },
  {
    name: "Travel expenses",
    owner: "Theo Marchetti",
    status: "Private",
    edits: 41,
    date: "2026-03-09",
    dateLabel: "9 March 2026",
  },
  {
    name: "Customer churn model",
    owner: "Priya Anand",
    status: "Private",
    edits: 58,
    date: "2026-03-08",
    dateLabel: "8 March 2026",
  },
  {
    name: "Office move checklist",
    owner: "Dana Whitlock",
    status: "Shared",
    edits: 23,
    date: "2026-03-06",
    dateLabel: "6 March 2026",
  },
]

const activity = [
  {
    text: "Dana renamed Q3 budget",
    dateTime: "2026-03-12T14:05",
    when: "12 March 2026, 14:05",
  },
  {
    text: "Theo added 14 rows to Hiring pipeline",
    dateTime: "2026-03-12T11:42",
    when: "12 March 2026, 11:42",
  },
  {
    text: "Malik imported 1 file into Warehouse stock count",
    dateTime: "2026-03-11T16:20",
    when: "11 March 2026, 16:20",
  },
  {
    text: "Ines left 3 comments on Vendor contracts 2026",
    dateTime: "2026-03-11T09:10",
    when: "11 March 2026, 09:10",
  },
  {
    text: "Hana created Marketing calendar",
    dateTime: "2026-03-10T15:30",
    when: "10 March 2026, 15:30",
  },
  {
    text: "Priya made Customer churn model private",
    dateTime: "2026-03-08T17:48",
    when: "8 March 2026, 17:48",
  },
]

const navGroups = [
  { name: "Workspace", links: ["Overview", "Sheets", "Members", "Activity"] },
  { name: "Settings", links: ["Billing", "API keys"] },
]

/* ---------- Pieces ---------- */

function SidebarContent() {
  return (
    <>
      <p className="px-2 font-heading text-h2">Plainsheet</p>
      <nav aria-label="Main" className="flex flex-col gap-8">
        {navGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-2">
            <p className={cn("px-2", label)}>{group.name}</p>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => {
                const current = link === "Overview"
                return (
                  <li key={link}>
                    <a
                      href="#"
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block rounded-sm px-2 py-2 font-mono text-label text-sidebar-foreground uppercase transition-colors duration-150 hover:underline hover:underline-offset-4",
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
        <p className="text-body text-sidebar-foreground">Ines Corwell</p>
        <p className="font-mono text-label text-muted-foreground">
          ines.corwell@example.com
        </p>
      </div>
    </>
  )
}

function ButtonGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={name} className="flex gap-1">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Button
            key={option.value}
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

function KeyNumbers() {
  const [period, setPeriod] = useState<Period>("7")
  return (
    <section aria-labelledby="key-numbers">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="key-numbers" className={labelHeading}>
          Key numbers
        </h2>
        <ButtonGroup
          name="Period"
          options={periods}
          value={period}
          onChange={setPeriod}
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-md border bg-background">
        <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
          {keyNumbers[period].map((item) => {
            const Arrow =
              item.direction === "up" ? ArrowUpRight : ArrowDownRight
            return (
              <div
                key={item.label}
                className="flex flex-col gap-2 bg-background p-4"
              >
                <dt className={label}>{item.label}</dt>
                <dd className="font-mono text-h2 font-normal tabular-nums md:text-h1">
                  {item.value}
                </dd>
                <dd className="flex items-start gap-1 font-mono text-label text-foreground">
                  <Arrow
                    aria-hidden
                    className="size-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>{item.change}</span>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

function EditsChart() {
  return (
    <section
      aria-labelledby="edits-per-day"
      className="rounded-md border bg-background p-4 md:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="edits-per-day" className={labelHeading}>
          Edits per day
        </h2>
        <p className={label}>Last 7 days</p>
      </div>
      <div aria-hidden className="mt-4 grid grid-cols-7 gap-2">
        {editsPerDay.map((d) => (
          <div key={d.day} className="flex min-w-0 flex-col gap-2">
            <div className="flex h-64 flex-col justify-end">
              <span className="font-mono text-label text-foreground tabular-nums">
                {d.value}
              </span>
              <div
                className="bg-foreground"
                style={{ height: `${(d.value / maxEdits) * 90}%` }}
              />
            </div>
            <span className={label}>{d.day}</span>
          </div>
        ))}
      </div>
      <table className="sr-only" aria-label="Edits per day, last 7 days">
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Edits</th>
          </tr>
        </thead>
        <tbody>
          {editsPerDay.map((d) => (
            <tr key={d.day}>
              <td>{d.name}</td>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function RecentSheets() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("All")
  const rows = sheets.filter(
    (s) =>
      (status === "All" || s.status === status) &&
      s.name.toLowerCase().includes(query.trim().toLowerCase())
  )
  const head = "font-mono text-label uppercase text-muted-foreground"

  return (
    <section
      aria-labelledby="recent-sheets"
      className="min-w-0 rounded-md border bg-background 2xl:col-span-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
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
            className="w-full rounded-sm py-0 text-body sm:w-64 md:text-body"
          />
          <ButtonGroup
            name="Status"
            options={statusFilters.map((s) => ({ value: s, label: s }))}
            value={status}
            onChange={setStatus}
          />
        </div>
      </div>
      <Table label="Recent sheets" className="min-w-lg text-body">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={head}>
              Name
            </TableHead>
            <TableHead scope="col" className={head}>
              Owner
            </TableHead>
            <TableHead scope="col" className={head}>
              Status
            </TableHead>
            <TableHead scope="col" className={cn(head, "text-right")}>
              Edits
            </TableHead>
            <TableHead scope="col" className={cn(head, "text-right")}>
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
                  {s.edits.toLocaleString("en-GB")}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  <time dateTime={s.date}>{s.dateLabel}</time>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  )
}

function Activity() {
  return (
    <section
      aria-labelledby="activity"
      className="min-w-0 rounded-md border bg-background 2xl:col-span-4"
    >
      <div className="border-b p-4">
        <h2 id="activity" className={labelHeading}>
          Activity
        </h2>
      </div>
      <ol className="divide-y divide-border">
        {activity.map((entry) => (
          <li key={entry.dateTime} className="flex flex-col gap-2 p-4">
            <p>{entry.text}</p>
            <time dateTime={entry.dateTime} className={label}>
              {entry.when}
            </time>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------- Page ---------- */

export function App() {
  return (
    <div className="flex min-h-svh bg-background text-body text-foreground">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 border-r bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 md:px-8">
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
                <Menu aria-hidden className="size-4" strokeWidth={1.5} />
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
          <Button className={buttonClass}>
            <Plus aria-hidden className="size-4" strokeWidth={1.5} />
            New sheet
          </Button>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8">
          <KeyNumbers />
          <EditsChart />
          <div className="grid grid-cols-1 gap-y-8 2xl:grid-cols-12 2xl:gap-x-8">
            <RecentSheets />
            <Activity />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
