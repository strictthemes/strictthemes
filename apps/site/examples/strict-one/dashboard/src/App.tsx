import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, MenuIcon, PlusIcon } from "lucide-react"

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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const labelHeading = "font-mono text-label uppercase text-foreground"

type NavLink = { name: string; current?: boolean }

const navGroups: { name: string; links: NavLink[] }[] = [
  {
    name: "Workspace",
    links: [
      { name: "Overview", current: true },
      { name: "Sheets" },
      { name: "Members" },
      { name: "Activity" },
    ],
  },
  {
    name: "Settings",
    links: [{ name: "Billing" }, { name: "API keys" }],
  },
]

type Period = "7" | "30" | "90"

const periods: { value: Period; name: string; long: string }[] = [
  { value: "7", name: "7 days", long: "the previous 7 days" },
  { value: "30", name: "30 days", long: "the previous 30 days" },
  { value: "90", name: "90 days", long: "the previous 90 days" },
]

type KeyNumber = {
  label: string
  value: string
  direction: "up" | "down"
  change: string
}

const keyNumbers: Record<Period, KeyNumber[]> = {
  "7": [
    { label: "Active sheets", value: "1,284", direction: "up", change: "12%" },
    { label: "Editors", value: "86", direction: "up", change: "4%" },
    { label: "Comments", value: "612", direction: "down", change: "3%" },
    { label: "Shared", value: "64%", direction: "up", change: "2 pts" },
  ],
  "30": [
    { label: "Active sheets", value: "2,904", direction: "up", change: "9%" },
    { label: "Editors", value: "143", direction: "up", change: "6%" },
    { label: "Comments", value: "2,488", direction: "up", change: "5%" },
    { label: "Shared", value: "61%", direction: "down", change: "1 pt" },
  ],
  "90": [
    { label: "Active sheets", value: "4,117", direction: "up", change: "21%" },
    { label: "Editors", value: "198", direction: "up", change: "15%" },
    { label: "Comments", value: "7,105", direction: "up", change: "11%" },
    { label: "Shared", value: "58%", direction: "up", change: "6 pts" },
  ],
}

const editsPerDay = [
  { day: "Fri", long: "Friday", value: 712 },
  { day: "Sat", long: "Saturday", value: 241 },
  { day: "Sun", long: "Sunday", value: 198 },
  { day: "Mon", long: "Monday", value: 655 },
  { day: "Tue", long: "Tuesday", value: 803 },
  { day: "Wed", long: "Wednesday", value: 868 },
  { day: "Thu", long: "Thursday", value: 841 },
]
const maxEdits = Math.max(...editsPerDay.map((d) => d.value))

type Status = "Shared" | "Private"

type SheetRow = {
  name: string
  owner: string
  status: Status
  edits: number
  date: string
  dateLabel: string
}

const sheets: SheetRow[] = [
  {
    name: "Q3 budget",
    owner: "Dana Whitfield",
    status: "Shared",
    edits: 214,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Hiring plan 2026",
    owner: "Omar Lindqvist",
    status: "Private",
    edits: 187,
    date: "2026-03-12",
    dateLabel: "12 March 2026",
  },
  {
    name: "Vendor contracts",
    owner: "Priya Castellano",
    status: "Shared",
    edits: 96,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Office move checklist",
    owner: "Theo Marchetti",
    status: "Shared",
    edits: 152,
    date: "2026-03-11",
    dateLabel: "11 March 2026",
  },
  {
    name: "Marketing calendar",
    owner: "Ines Halvorsen",
    status: "Shared",
    edits: 341,
    date: "2026-03-10",
    dateLabel: "10 March 2026",
  },
  {
    name: "Support rota",
    owner: "Dana Whitfield",
    status: "Private",
    edits: 78,
    date: "2026-03-09",
    dateLabel: "9 March 2026",
  },
  {
    name: "Inventory count",
    owner: "Kofi Ashworth",
    status: "Shared",
    edits: 263,
    date: "2026-03-07",
    dateLabel: "7 March 2026",
  },
  {
    name: "Board metrics",
    owner: "Omar Lindqvist",
    status: "Private",
    edits: 129,
    date: "2026-03-06",
    dateLabel: "6 March 2026",
  },
]

type StatusFilter = "All" | Status
const statusFilters: StatusFilter[] = ["All", "Shared", "Private"]

const activity = [
  {
    text: "Dana Whitfield renamed Q3 forecast to Q3 budget.",
    dateTime: "2026-03-12T14:05",
    label: "12 March 2026, 14:05",
  },
  {
    text: "Omar Lindqvist added two columns to Hiring plan 2026.",
    dateTime: "2026-03-12T11:42",
    label: "12 March 2026, 11:42",
  },
  {
    text: "Priya Castellano shared Vendor contracts with the legal team.",
    dateTime: "2026-03-11T16:20",
    label: "11 March 2026, 16:20",
  },
  {
    text: "Theo Marchetti left a comment on Office move checklist.",
    dateTime: "2026-03-11T09:15",
    label: "11 March 2026, 09:15",
  },
  {
    text: "Ines Halvorsen imported 48 rows into Marketing calendar.",
    dateTime: "2026-03-10T15:33",
    label: "10 March 2026, 15:33",
  },
  {
    text: "Kofi Ashworth invited Lena Brandt to Inventory count.",
    dateTime: "2026-03-07T10:08",
    label: "7 March 2026, 10:08",
  },
]

function SidebarContent() {
  return (
    <>
      <p className="px-2 font-heading text-h2 text-sidebar-foreground">
        Plainsheet
      </p>
      <nav aria-label="Main" className="flex flex-col gap-8">
        {navGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-2">
            <p className="px-2 font-mono text-label text-muted-foreground uppercase">
              {group.name}
            </p>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      "block rounded-sm px-2 py-2 font-mono text-label uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      focusOutline,
                      link.current
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto px-2">
        <p className="text-body text-sidebar-foreground">Mara Okonkwo</p>
        <p className="font-mono text-label wrap-break-word text-muted-foreground">
          mara.okonkwo@fernhollow.example
        </p>
      </div>
    </>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [period, setPeriod] = useState<Period>("7")
  const [status, setStatus] = useState<StatusFilter>("All")
  const [query, setQuery] = useState("")

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)")
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const needle = query.trim().toLowerCase()
  const rows = sheets.filter(
    (row) =>
      (status === "All" || row.status === status) &&
      row.name.toLowerCase().includes(needle)
  )
  const currentPeriod = periods.find((p) => p.value === period)!

  return (
    <div className="flex min-h-svh text-body">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-8 overflow-y-auto border-r bg-sidebar p-4 lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 md:px-8">
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
                <MenuIcon className="size-4" strokeWidth={1.5} aria-hidden />
                Menu
              </SheetTrigger>
              <SheetContent
                side="left"
                className="overflow-y-auto bg-sidebar px-4 pt-16 pb-8 text-body text-sidebar-foreground data-[side=left]:w-64"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-1 flex-col gap-8">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-h2">Overview</h1>
          </div>
          <Button className={buttonClass}>
            <PlusIcon className="size-4" strokeWidth={1.5} aria-hidden />
            New sheet
          </Button>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8">
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
                    {p.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-md border bg-background">
              <dl className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                {keyNumbers[period].map((item) => {
                  const Arrow =
                    item.direction === "up" ? ArrowUpIcon : ArrowDownIcon
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
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <span>
                          {item.direction === "up" ? "Up" : "Down"}{" "}
                          {item.change}
                          <span className="sr-only">
                            {" "}
                            from {currentPeriod.long}
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
            aria-labelledby="edits-per-day"
            className="rounded-md border bg-background p-4 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="edits-per-day" className={labelHeading}>
                Edits per day
              </h2>
              <p className="font-mono text-label text-muted-foreground uppercase">
                Last 7 days
              </p>
            </div>
            <div aria-hidden className="mt-4 grid grid-cols-7 gap-2">
              {editsPerDay.map((d) => (
                <div key={d.day} className="flex min-w-0 flex-col gap-2">
                  <div className="flex h-64 flex-col justify-end gap-2">
                    <span className="font-mono text-label text-foreground tabular-nums">
                      {d.value}
                    </span>
                    <div
                      className="bg-foreground"
                      style={{ height: `${(d.value / maxEdits) * 90}%` }}
                    />
                  </div>
                  <span className="font-mono text-label text-muted-foreground uppercase">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <table className="sr-only" aria-label="Edits per day">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Edits</th>
                </tr>
              </thead>
              <tbody>
                {editsPerDay.map((d) => (
                  <tr key={d.day}>
                    <th scope="row">{d.long}</th>
                    <td>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="grid grid-cols-1 gap-8 2xl:grid-cols-12">
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
                    className="w-full rounded-sm px-2 py-0 text-body sm:w-64 md:text-body [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  <div
                    role="group"
                    aria-label="Status"
                    className="flex gap-1"
                  >
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
                    rows.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.owner}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {row.edits}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          <time dateTime={row.date}>{row.dateLabel}</time>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>

            <section
              aria-labelledby="activity"
              className="min-w-0 rounded-md border bg-background 2xl:col-span-4 2xl:col-start-9"
            >
              <div className="flex items-center border-b p-4 2xl:min-h-16">
                <h2 id="activity" className={labelHeading}>
                  Activity
                </h2>
              </div>
              <ol className="divide-y">
                {activity.map((entry) => (
                  <li key={entry.dateTime} className="flex flex-col gap-2 p-4">
                    <p>{entry.text}</p>
                    <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                      <time dateTime={entry.dateTime}>{entry.label}</time>
                    </p>
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
