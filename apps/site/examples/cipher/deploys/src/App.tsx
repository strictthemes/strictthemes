import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Environment = "production" | "preview"
type DeployState = "ready" | "building" | "queued" | "failed" | "canceled"

type Deployment = {
  commit: string
  message: string
  branch: string
  state: DeployState
  /** Seconds it ran; null while it has not finished. */
  duration: number | null
  /** Local time, "2026-11-11T14:05". */
  created: string
  /** For a failed deployment, the error line. */
  error?: string
}

// Newest first. The sample's today is 11 Nov 2026.
const deployments: Deployment[] = [
  {
    commit: "a1d94e0",
    message: "Raise the image cache lifetime to one day",
    branch: "main",
    state: "queued",
    duration: null,
    created: "2026-11-11T14:05",
  },
  {
    commit: "7c2e5b9",
    message: "Highlight matched terms in search results",
    branch: "feat/search",
    state: "building",
    duration: null,
    created: "2026-11-11T13:52",
  },
  {
    commit: "8f3c2a1",
    message: "Merge fix/cart-total: round totals after discounts",
    branch: "main",
    state: "ready",
    duration: 161,
    created: "2026-11-11T11:20",
  },
  {
    commit: "3b6f0d2",
    message: "Round the cart total after applying discounts",
    branch: "fix/cart-total",
    state: "ready",
    duration: 115,
    created: "2026-11-11T10:48",
  },
  {
    commit: "e4a7c19",
    message: "Apply discount codes before tax in the cart total",
    branch: "fix/cart-total",
    state: "failed",
    duration: 72,
    created: "2026-11-11T10:31",
    error:
      "src/cart/total.ts:41:9 Type 'string' is not assignable to type 'number'.",
  },
  {
    commit: "92d1f7a",
    message: "Bump vite to 8.2 and react to 19.3",
    branch: "chore/deps",
    state: "canceled",
    duration: 47,
    created: "2026-11-11T09:14",
  },
  {
    commit: "5ce803b",
    message: "Bump lucide-react to 1.72",
    branch: "chore/deps",
    state: "ready",
    duration: 133,
    created: "2026-11-10T17:40",
  },
  {
    commit: "d07b6e4",
    message: "Add a sitemap for product pages",
    branch: "main",
    state: "ready",
    duration: 192,
    created: "2026-11-10T16:22",
  },
  {
    commit: "41f9ac8",
    message: "Wait 200 ms after typing before searching",
    branch: "feat/search",
    state: "ready",
    duration: 138,
    created: "2026-11-10T15:05",
  },
  {
    commit: "b8e2d53",
    message: "Build the search index during the deploy",
    branch: "feat/search",
    state: "failed",
    duration: 58,
    created: "2026-11-10T14:47",
    error:
      "Cannot find module 'flexsearch' imported from scripts/build-index.ts",
  },
  {
    commit: "6a3c0f1",
    message: "Fix the broken returns link in the footer",
    branch: "main",
    state: "ready",
    duration: 156,
    created: "2026-11-10T11:30",
  },
  {
    commit: "f19d7e2",
    message: "Add a search page with an empty state",
    branch: "feat/search",
    state: "ready",
    duration: 131,
    created: "2026-11-10T10:02",
  },
  {
    commit: "0e5b8c4",
    message: "Serve hero images as WebP",
    branch: "main",
    state: "ready",
    duration: 169,
    created: "2026-11-09T18:15",
  },
  {
    commit: "c73a1f6",
    message: "Pin Node to 24 in the build image",
    branch: "chore/deps",
    state: "ready",
    duration: 38,
    created: "2026-11-09T16:40",
  },
  {
    commit: "2d8e4b7",
    message: "Show the stock count on product cards",
    branch: "main",
    state: "ready",
    duration: 147,
    created: "2026-11-09T15:12",
  },
  {
    commit: "9a0f3c5",
    message: "Add a failing test for discounted totals",
    branch: "fix/cart-total",
    state: "ready",
    duration: 109,
    created: "2026-11-09T13:58",
  },
  {
    commit: "74b1e9d",
    message: "Move the checkout button above the order summary",
    branch: "main",
    state: "ready",
    duration: 153,
    created: "2026-11-09T12:21",
  },
  {
    commit: "e8c62a0",
    message: "Add the search route behind a flag",
    branch: "feat/search",
    state: "ready",
    duration: 125,
    created: "2026-11-09T11:03",
  },
  {
    commit: "1f4d7b3",
    message: "Update the privacy policy page",
    branch: "main",
    state: "ready",
    duration: 160,
    created: "2026-11-09T10:10",
  },
  {
    commit: "5b9e2c8",
    message: "Set cache headers on static assets",
    branch: "main",
    state: "ready",
    duration: 142,
    created: "2026-11-09T09:02",
  },
]

const environmentOf = (d: Deployment): Environment =>
  d.branch === "main" ? "production" : "preview"

const addressOf = (d: Deployment) =>
  environmentOf(d) === "production"
    ? "https://orrin.example"
    : `https://${d.branch.replace(/\//g, "-")}.orrin-web.plinth.example`

// The newest ready deployment to production is the one that is live.
const liveCommit = deployments.find(
  (d) => d.state === "ready" && environmentOf(d) === "production"
)?.commit

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatCreated(created: string) {
  const [date, time] = created.split("T")
  const [year, month, day] = date.split("-").map(Number)
  return `${day} ${months[month - 1]} ${year}, ${time}`
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m === 0 ? `${s}s` : `${m}m ${String(s).padStart(2, "0")}s`
}

const pad = (n: number) => String(n).padStart(2, "0")

type LogLine = { time: string; dateTime: string; text: ReactNode }

function buildLog(d: Deployment): LogLine[] {
  const [date, time] = d.created.split("T")
  const [hours, minutes] = time.split(":").map(Number)
  const start = hours * 3600 + minutes * 60 + 4
  const total = d.duration ?? 70
  const env = environmentOf(d)

  const at = (fraction: number, text: ReactNode): LogLine => {
    const t = start + Math.round(total * fraction)
    const clock = `${pad(Math.floor(t / 3600) % 24)}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`
    return { time: clock, dateTime: `${date}T${clock}`, text }
  }

  if (d.state === "queued") {
    return [at(0, "queued behind 1 deployment")]
  }

  const opening = [
    at(0, `cloning github.com/orrin/orrin-web at ${d.commit} (${d.branch})`),
    at(0.02, "cloned in 1.4s"),
    at(0.03, "using node 24.21.0, npm 11.4.0"),
    at(0.04, "installing dependencies with npm ci"),
    at(0.3, "added 412 packages in 16s"),
    at(0.32, "building with vite build"),
  ]

  if (d.state === "building") {
    return [...opening, at(0.6, "transformed 1,140 modules")]
  }

  if (d.state === "canceled") {
    return [
      ...opening,
      at(0.7, "transformed 802 modules"),
      at(0.98, "stopping the build"),
      at(1, "canceled by mara.lind"),
    ]
  }

  if (d.state === "failed") {
    return [
      ...opening,
      at(0.85, "transformed 618 modules"),
      at(
        0.98,
        <>
          <span className="text-destructive">error</span> {d.error}
        </>
      ),
      at(
        1,
        <>
          <span className="text-destructive">failed</span>: build exited with
          code 1
        </>
      ),
    ]
  }

  return [
    ...opening,
    at(0.7, "transformed 1,284 modules"),
    at(0.8, "built in 21s"),
    at(0.82, `uploading 86 files to ${env}`),
    at(0.97, "uploaded 4.1 MB in 3s"),
    at(
      1,
      <>
        <span className="text-success">ready</span> {addressOf(d)} in{" "}
        {formatDuration(total)}
      </>
    ),
  ]
}

const stateDot: Record<DeployState, string> = {
  ready: "bg-success",
  failed: "bg-destructive",
  building: "bg-primary",
  queued: "bg-muted-foreground",
  canceled: "bg-muted-foreground",
}

function StateMark({ state }: { state: DeployState }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", stateDot[state])}
      />
      {state}
    </span>
  )
}

type EnvFilter = "all" | Environment
type StateFilter = "all" | DeployState
type Filters = { branch: string; env: EnvFilter; state: StateFilter }

const noFilters: Filters = { branch: "", env: "all", state: "all" }

const stateItems: { value: StateFilter; label: string }[] = [
  { value: "all", label: "All states" },
  { value: "ready", label: "ready" },
  { value: "building", label: "building" },
  { value: "queued", label: "queued" },
  { value: "failed", label: "failed" },
  { value: "canceled", label: "canceled" },
]

const envChoices: { value: EnvFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "production", label: "Production" },
  { value: "preview", label: "Preview" },
]

function matches(d: Deployment, f: Filters) {
  const query = f.branch.trim().toLowerCase()
  if (query && !d.branch.toLowerCase().includes(query)) return false
  if (f.env !== "all" && environmentOf(d) !== f.env) return false
  if (f.state !== "all" && d.state !== f.state) return false
  return true
}

const isFiltered = (f: Filters) =>
  f.branch.trim() !== "" || f.env !== "all" || f.state !== "all"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusOutlineInside =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const headerLink = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const currentLink = "text-foreground underline underline-offset-4"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-4 font-mono text-label"
const panel = "rounded-xl border border-border bg-card"

const navLinks = [
  { label: "Deploys", href: "/deploys", current: true },
  { label: "Domains", href: "#", current: false },
  { label: "Logs", href: "#", current: false },
  { label: "Settings", href: "/settings/tokens", current: false },
]

function ConsoleBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border bg-card" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", focusOutline)}
        >
          plinth
        </a>
        <p className={smallFigure}>orrin / orrin-web</p>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(headerLink, link.current && currentLink)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p
          className={cn(smallFigure, "ml-auto hidden wrap-break-word md:block")}
        >
          mara.lind@orrin.example
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={menuOpen}
          aria-controls="console-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="console-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-2 md:px-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "block py-2",
                headerLink,
                link.current && currentLink
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function App() {
  const [filters, setFilters] = useState<Filters>(noFilters)
  const [selected, setSelected] = useState<string | null>("7c2e5b9")
  const searchField = useRef<HTMLInputElement>(null)

  const shown = deployments.filter((d) => matches(d, filters))
  const filtered = isFiltered(filters)
  const current = deployments.find((d) => d.commit === selected) ?? null

  // Keeps the selection on a row that is shown: when the selected row is
  // filtered out, or rows show again after none did, the first row shown.
  const updateFilters = (next: Filters) => {
    setFilters(next)
    const nextShown = deployments.filter((d) => matches(d, next))
    if (!nextShown.some((d) => d.commit === selected)) {
      setSelected(nextShown[0]?.commit ?? null)
    }
  }

  const clearFilters = () => {
    updateFilters(noFilters)
    searchField.current?.focus()
  }

  const log = current ? buildLog(current) : []

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <ConsoleBar />

      <main className="py-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:grid-cols-12 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
            <h1 className="text-h1">Deploys</h1>
            <div className="flex items-center gap-2">
              <Button className={buttonText}>Deploy main</Button>
            </div>
          </div>

          <div
            className={cn(
              panel,
              "flex flex-wrap items-end gap-6 p-6 md:col-span-12"
            )}
          >
            <div className="w-full md:w-64">
              <label
                htmlFor="branch-search"
                className="block font-mono text-label text-foreground"
              >
                Branch
              </label>
              <Input
                ref={searchField}
                id="branch-search"
                type="search"
                placeholder="main, feat/…"
                value={filters.branch}
                onChange={(event) =>
                  updateFilters({ ...filters, branch: event.target.value })
                }
                className="mt-2 px-2 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>

            <div>
              <p
                id="env-label"
                className="font-mono text-label text-foreground"
              >
                Environment
              </p>
              <div
                role="group"
                aria-labelledby="env-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {envChoices.map((choice) => {
                  const pressed = filters.env === choice.value
                  return (
                    <Button
                      key={choice.value}
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      onClick={() =>
                        updateFilters({ ...filters, env: choice.value })
                      }
                      className={buttonText}
                    >
                      {choice.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="w-48">
              <label
                id="state-label"
                htmlFor="state-filter"
                className="block font-mono text-label text-foreground"
              >
                State
              </label>
              <Select
                items={stateItems}
                value={filters.state}
                onValueChange={(value) => {
                  if (value === null) return
                  updateFilters({ ...filters, state: value as StateFilter })
                }}
              >
                <SelectTrigger
                  id="state-filter"
                  aria-labelledby="state-label"
                  className="mt-2 font-mono"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {stateItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              disabled={!filtered}
              onClick={clearFilters}
              className={cn(buttonText, "ml-auto")}
            >
              Clear filters
            </Button>
          </div>

          <section
            aria-labelledby="deployments-heading"
            className={cn(panel, "min-w-0 overflow-hidden md:col-span-12")}
          >
            <div className="border-b border-border px-6 py-3">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h2
                  id="deployments-heading"
                  className="font-mono text-label text-muted-foreground"
                >
                  Deployments
                </h2>
                <p aria-live="polite" className={smallFigure}>
                  {filtered
                    ? `${shown.length} of ${deployments.length}`
                    : `${deployments.length} ${deployments.length === 1 ? "deployment" : "deployments"}`}
                </p>
              </div>
            </div>

            <Table label="Deployments" className="min-w-4xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={headCell}>Commit</TableHead>
                  <TableHead className={headCell}>Message</TableHead>
                  <TableHead className={headCell}>Branch</TableHead>
                  <TableHead className={headCell}>Environment</TableHead>
                  <TableHead className={headCell}>State</TableHead>
                  <TableHead className={cn(headCell, "text-right")}>
                    Duration
                  </TableHead>
                  <TableHead className={cn(headCell, "text-right")}>
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-6 py-6 whitespace-normal"
                    >
                      <p>No deployments match these filters.</p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className={cn(buttonText, "mt-3")}
                      >
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((d) => {
                    const isSelected = d.commit === selected
                    const env = environmentOf(d)
                    return (
                      <TableRow
                        key={d.commit}
                        data-state={isSelected ? "selected" : undefined}
                        className="data-[state=selected]:bg-secondary/10"
                      >
                        <TableCell className={bodyCell}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`Show log of ${d.commit}`}
                            onClick={() => setSelected(d.commit)}
                            className={cn(
                              textLink,
                              "font-mono tabular-nums",
                              isSelected &&
                                "font-bold text-foreground no-underline"
                            )}
                          >
                            {d.commit}
                          </button>
                        </TableCell>
                        <TableCell
                          className={cn(bodyCell, "whitespace-normal")}
                        >
                          {d.message}
                        </TableCell>
                        <TableCell className={cn(bodyCell, "font-mono")}>
                          {d.branch}
                        </TableCell>
                        <TableCell className={bodyCell}>
                          <span className="inline-flex items-center gap-2">
                            {env}
                            {d.commit === liveCommit && (
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                live
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className={bodyCell}>
                          <StateMark state={d.state} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            bodyCell,
                            "text-right font-mono tabular-nums"
                          )}
                        >
                          {d.duration !== null ? (
                            formatDuration(d.duration)
                          ) : (
                            <>
                              <span aria-hidden="true">—</span>
                              <span className="sr-only">
                                {d.state === "queued"
                                  ? "not started"
                                  : "not finished"}
                              </span>
                            </>
                          )}
                        </TableCell>
                        <TableCell
                          className={cn(
                            bodyCell,
                            "text-right font-mono tabular-nums"
                          )}
                        >
                          <time dateTime={d.created}>
                            {formatCreated(d.created)}
                          </time>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </section>

          <section
            aria-labelledby="log-heading"
            className={cn(panel, "min-w-0 overflow-hidden md:col-span-12")}
          >
            <div className="border-b border-border px-6 py-3">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h2
                  id="log-heading"
                  className="font-mono text-label text-muted-foreground"
                >
                  Log
                </h2>
                <p className={smallFigure}>
                  {current
                    ? `${current.commit} · ${environmentOf(current)} · ${current.state}`
                    : "No deployment selected"}
                </p>
              </div>
            </div>
            <div
              tabIndex={0}
              role="region"
              aria-label={current ? `Log of ${current.commit}` : "Log"}
              className={cn("max-h-96 overflow-auto py-3", focusOutlineInside)}
            >
              {current ? (
                <ol className="w-max min-w-full list-none p-0">
                  {log.map((line, index) => (
                    <li
                      key={index}
                      className="flex gap-3 px-6 font-mono text-label whitespace-pre"
                    >
                      <time dateTime={line.dateTime} className={smallFigure}>
                        {line.time}
                      </time>
                      <span className="text-foreground">{line.text}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="px-6 text-body">
                  No deployment matches these filters, so no log is shown.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

const headCell =
  "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
const bodyCell = "px-3 py-2 first:pl-6 last:pr-6"

export default App
