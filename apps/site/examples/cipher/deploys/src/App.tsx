import * as React from "react"

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

type State = "ready" | "building" | "queued" | "failed" | "canceled"
type Environment = "production" | "preview"

type Deployment = {
  hash: string
  message: string
  branch: string
  state: State
  /** Seconds the run took; null while it has not finished. */
  duration: number | null
  /** Day of November 2026, hour and minute the deployment was created. */
  created: [number, number, number]
  /** For a failed deployment: the error line, without the word "error". */
  reason?: string
}

const DEPLOYMENTS: Deployment[] = [
  { hash: "4e7b9d0", message: "Add fuzzy matching to search suggestions", branch: "feat/search", state: "queued", duration: null, created: [11, 14, 52] },
  { hash: "8f3c2a1", message: "Show the tax line on the cart summary", branch: "main", state: "building", duration: null, created: [11, 14, 41] },
  { hash: "c91d4e7", message: "Round discounted line totals before summing them", branch: "fix/cart-total", state: "ready", duration: 64, created: [11, 13, 26] },
  { hash: "2a6f0b3", message: "Bump vite to 8.2.1", branch: "chore/deps", state: "failed", duration: 52, created: [11, 11, 58], reason: "vite.config.ts: plugin react needs @vitejs/plugin-react 6, found 5.1.0" },
  { hash: "e5b8c12", message: "Cache product images for a week", branch: "main", state: "ready", duration: 168, created: [11, 10, 15] },
  { hash: "7d1e9a4", message: "Highlight matched words in search results", branch: "feat/search", state: "ready", duration: 72, created: [11, 9, 37] },
  { hash: "b3c4f58", message: "Keep the cart open after removing an item", branch: "fix/cart-total", state: "canceled", duration: 41, created: [10, 17, 22] },
  { hash: "91a0e6d", message: "Merge the first cart total fixes", branch: "main", state: "ready", duration: 192, created: [10, 16, 5] },
  { hash: "0f2d7c9", message: "Show the currency on every line total", branch: "fix/cart-total", state: "ready", duration: 58, created: [10, 15, 11] },
  { hash: "6c8b1e2", message: "Pin lucide-react to 1.72.0", branch: "chore/deps", state: "ready", duration: 38, created: [10, 13, 44] },
  { hash: "d4e2a90", message: "Add a search box to the header", branch: "feat/search", state: "failed", duration: 89, created: [10, 11, 30], reason: "src/components/search-box.tsx(14,9): 'query' is possibly 'undefined'" },
  { hash: "3b9f5d1", message: "Lay out the product grid with CSS grid", branch: "main", state: "ready", duration: 151, created: [10, 9, 52] },
  { hash: "a7c3e64", message: "Index product names for search", branch: "feat/search", state: "ready", duration: 96, created: [9, 18, 8] },
  { hash: "58e0b2f", message: "Update eslint to 10.1.0", branch: "chore/deps", state: "ready", duration: 44, created: [9, 16, 40] },
  { hash: "f1d6a83", message: "Load reviews only when they scroll into view", branch: "main", state: "ready", duration: 125, created: [9, 15, 17] },
  { hash: "2e4c7b5", message: "Add an empty search route", branch: "feat/search", state: "ready", duration: 68, created: [9, 13, 2] },
  { hash: "9a5f1d0", message: "Fix the currency symbol on cart totals", branch: "fix/cart-total", state: "ready", duration: 49, created: [9, 11, 46] },
  { hash: "c0b8e37", message: "Update the footer links", branch: "main", state: "ready", duration: 114, created: [9, 10, 21] },
  { hash: "6f3a2c8", message: "Bump typescript to 6.0.2", branch: "chore/deps", state: "ready", duration: 40, created: [9, 9, 33] },
  { hash: "1d7e4b6", message: "Compress the hero image", branch: "main", state: "ready", duration: 137, created: [9, 8, 50] },
]

const STATE_ITEMS = [
  { value: "all", label: "All states" },
  { value: "ready", label: "ready" },
  { value: "building", label: "building" },
  { value: "queued", label: "queued" },
  { value: "failed", label: "failed" },
  { value: "canceled", label: "canceled" },
]

const ENVIRONMENTS = [
  { value: "all", label: "All" },
  { value: "production", label: "Production" },
  { value: "preview", label: "Preview" },
] as const

type EnvFilter = (typeof ENVIRONMENTS)[number]["value"]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_INSIDE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const BUTTON = "px-4 font-mono text-label"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const HEADER_LINK = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const CURRENT_LINK = "text-foreground underline underline-offset-4"

const NAV_LINKS = [
  { label: "Deploys", href: "/deploys", current: true },
  { label: "Domains", href: "#", current: false },
  { label: "Logs", href: "#", current: false },
  { label: "Settings", href: "/settings/tokens", current: false },
]

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const pad = (n: number) => String(n).padStart(2, "0")

function environmentOf(d: Deployment): Environment {
  return d.branch === "main" ? "production" : "preview"
}

function addressOf(d: Deployment) {
  return environmentOf(d) === "production"
    ? "https://orrin.example"
    : `https://${d.branch.replace(/\//g, "-")}.orrin-web.plinth.example`
}

function createdAt(d: Deployment, seconds = 0) {
  const [day, hour, minute] = d.created
  return new Date(Date.UTC(2026, 10, day, hour, minute, seconds))
}

function formatCreated(d: Deployment) {
  const t = createdAt(d)
  return {
    text: `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}, ${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`,
    dateTime: `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`,
  }
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

type LogLine = {
  at: number
  text: string
  /** A first word set in a status color, e.g. "ready" or "error". */
  word?: { text: string; className: string }
}

function logOf(d: Deployment): LogLine[] {
  const env = environmentOf(d)
  const run = d.duration ?? 0
  const at = (f: number) => Math.round(run * f)
  const clone: LogLine[] = [
    { at: 0, text: `cloning orrin/orrin-web at ${d.hash} (${d.branch})` },
    { at: at(0.04), text: `cloned ${d.hash} in ${Math.max(1, at(0.04))}s` },
    { at: at(0.06), text: "installing dependencies with npm ci" },
    { at: at(0.3), text: `added 412 packages in ${Math.max(1, at(0.3) - at(0.06))}s` },
    { at: at(0.32), text: "running npm run build" },
  ]

  switch (d.state) {
    case "queued":
      return [{ at: 0, text: "queued behind 1 deployment" }]
    case "building":
      return [
        { at: 0, text: `cloning orrin/orrin-web at ${d.hash} (${d.branch})` },
        { at: 2, text: `cloned ${d.hash} in 2s` },
        { at: 3, text: "installing dependencies with npm ci" },
        { at: 31, text: "added 412 packages in 28s" },
        { at: 33, text: "running npm run build" },
        { at: 35, text: "vite v8.2.1 building for production" },
        { at: 58, text: "transforming modules: 1,034 of 1,284" },
      ]
    case "ready":
      return [
        ...clone,
        { at: at(0.34), text: "vite v8.2.1 building for production" },
        { at: at(0.78), text: "built 1,284 modules into dist" },
        { at: at(0.82), text: `uploading 46 files to ${env}` },
        { at: at(0.96), text: "uploaded 46 files, 3.1 MB" },
        {
          at: run,
          word: { text: "ready", className: "text-success" },
          text: ` ${addressOf(d)} in ${formatDuration(run)}`,
        },
      ]
    case "failed":
      return [
        ...clone,
        { at: at(0.34), text: "checking types with tsc -b" },
        {
          at: at(0.96),
          word: { text: "error", className: "text-destructive" },
          text: ` ${d.reason ?? "the build stopped"}`,
        },
        { at: at(0.98), text: "found 1 error, nothing was uploaded" },
        {
          at: run,
          word: { text: "failed", className: "text-destructive" },
          text: ": build exited with code 1",
        },
      ]
    case "canceled":
      return [
        ...clone,
        { at: at(0.34), text: "vite v8.2.1 building for production" },
        { at: at(0.98), text: "cancel requested, stopping the build" },
        { at: run, text: "canceled by mara.lind" },
      ]
  }
}

function StateWord({ state }: { state: State }) {
  const dot =
    state === "ready"
      ? "bg-success"
      : state === "failed"
        ? "bg-destructive"
        : state === "building"
          ? "bg-primary"
          : "bg-muted-foreground"
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot)} />
      {state}
    </span>
  )
}

function DurationCell({ d }: { d: Deployment }) {
  if (d.duration === null) {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">{d.state === "queued" ? "not started" : "not finished"}</span>
      </>
    )
  }
  return <>{formatDuration(d.duration)}</>
}

/** The newest ready deployment to production: the one that serves orrin.example. */
const LIVE_HASH = DEPLOYMENTS.find(
  (d) => d.state === "ready" && environmentOf(d) === "production"
)?.hash

function ConsoleBar() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(e: React.KeyboardEvent) {
    if (open && e.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border bg-card" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            FOCUS
          )}
        >
          plinth
        </a>
        <p className={SMALL_FIGURE}>orrin / orrin-web</p>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              aria-current={l.current ? "page" : undefined}
              className={cn("font-mono text-label", HEADER_LINK, l.current && CURRENT_LINK)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className={cn("ml-auto hidden min-w-0 wrap-break-word md:block", SMALL_FIGURE)}>
          mara.lind@orrin.example
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="console-menu"
          className={cn("ml-auto md:hidden", BUTTON)}
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="console-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-2 md:px-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              aria-current={l.current ? "page" : undefined}
              className={cn("block py-2 font-mono text-label", HEADER_LINK, l.current && CURRENT_LINK)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function App() {
  const [query, setQuery] = React.useState("")
  const [env, setEnv] = React.useState<EnvFilter>("all")
  const [stateFilter, setStateFilter] = React.useState("all")
  const [selectedHash, setSelectedHash] = React.useState<string | null>("8f3c2a1")
  const searchRef = React.useRef<HTMLInputElement>(null)

  const term = query.trim().toLowerCase()
  const filtersSet = term !== "" || env !== "all" || stateFilter !== "all"

  const visible = DEPLOYMENTS.filter(
    (d) =>
      (term === "" || d.branch.toLowerCase().includes(term)) &&
      (env === "all" || environmentOf(d) === env) &&
      (stateFilter === "all" || d.state === stateFilter)
  )

  // Keep the selection on a row that is shown: else the first shown, or none.
  const effectiveHash = visible.some((d) => d.hash === selectedHash)
    ? selectedHash
    : (visible[0]?.hash ?? null)
  if (effectiveHash !== selectedHash) {
    setSelectedHash(effectiveHash)
  }
  const selected = DEPLOYMENTS.find((d) => d.hash === effectiveHash) ?? null

  function clearFilters() {
    setQuery("")
    setEnv("all")
    setStateFilter("all")
    searchRef.current?.focus()
  }

  const count = filtersSet
    ? `${visible.length} of ${DEPLOYMENTS.length}`
    : `${DEPLOYMENTS.length} deployments`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <ConsoleBar />

      <main className="py-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:grid-cols-12 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
            <h1 className="text-h1">Deploys</h1>
            <div className="flex gap-2">
              <Button className={BUTTON}>Deploy main</Button>
            </div>
          </div>

          <div
            className="flex flex-wrap items-end gap-x-6 gap-y-4 rounded-xl border border-border bg-card p-6 md:col-span-12"
          >
            <div className="w-full md:w-64">
              <label htmlFor="branch-search" className="block font-mono text-label text-foreground">
                Branch
              </label>
              <Input
                ref={searchRef}
                id="branch-search"
                type="search"
                placeholder="main, feat/…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-2 px-2 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>

            <div>
              <p id="environment-label" className="font-mono text-label text-foreground">
                Environment
              </p>
              <div
                role="group"
                aria-labelledby="environment-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {ENVIRONMENTS.map((e) => (
                  <Button
                    key={e.value}
                    variant={env === e.value ? "secondary" : "outline"}
                    aria-pressed={env === e.value}
                    className={BUTTON}
                    onClick={() => setEnv(e.value)}
                  >
                    {e.label}
                  </Button>
                ))}
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
                items={STATE_ITEMS}
                value={stateFilter}
                onValueChange={(v) => {
                  if (v !== null) setStateFilter(v)
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
                  {STATE_ITEMS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className={cn("ml-auto", BUTTON)}
              disabled={!filtersSet}
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>

          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card md:col-span-12">
            <div className="border-b border-border px-6 py-3">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-label text-muted-foreground">Deployments</h2>
                <p aria-live="polite" className={SMALL_FIGURE}>
                  {count}
                </p>
              </div>
            </div>

            <Table label="Deployments" className="min-w-4xl text-body">
              <TableHeader>
                <TableRow>
                  {[
                    ["Commit", ""],
                    ["Message", ""],
                    ["Branch", ""],
                    ["Environment", ""],
                    ["State", ""],
                    ["Duration", "text-right"],
                    ["Created", "text-right"],
                  ].map(([label, align]) => (
                    <TableHead
                      key={label}
                      className={cn(
                        "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6",
                        align
                      )}
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-6 whitespace-normal">
                      <p>No deployments match these filters.</p>
                      <div className="mt-3">
                        <Button variant="outline" className={BUTTON} onClick={clearFilters}>
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((d) => {
                    const isSelected = d.hash === effectiveHash
                    const created = formatCreated(d)
                    const cell = "px-3 py-2 first:pl-6 last:pr-6"
                    return (
                      <TableRow
                        key={d.hash}
                        data-state={isSelected ? "selected" : undefined}
                        className="data-[state=selected]:bg-secondary/10"
                      >
                        <TableCell className={cell}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`Show log of ${d.hash}`}
                            onClick={() => setSelectedHash(d.hash)}
                            className={cn(
                              "font-mono tabular-nums text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                              FOCUS,
                              isSelected && "font-bold text-foreground no-underline"
                            )}
                          >
                            {d.hash}
                          </button>
                        </TableCell>
                        <TableCell className={cn(cell, "whitespace-normal")}>{d.message}</TableCell>
                        <TableCell className={cn(cell, "font-mono")}>{d.branch}</TableCell>
                        <TableCell className={cell}>
                          <span className="inline-flex items-center gap-2">
                            {environmentOf(d)}
                            {d.hash === LIVE_HASH && (
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                live
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className={cell}>
                          <StateWord state={d.state} />
                        </TableCell>
                        <TableCell className={cn(cell, "text-right font-mono tabular-nums")}>
                          <DurationCell d={d} />
                        </TableCell>
                        <TableCell className={cn(cell, "text-right font-mono tabular-nums")}>
                          <time dateTime={created.dateTime}>{created.text}</time>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </section>

          <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card md:col-span-12">
            <div className="border-b border-border px-6 py-3">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-label text-muted-foreground">Log</h2>
                <p className={SMALL_FIGURE}>
                  {selected
                    ? `${selected.hash} · ${environmentOf(selected)} · ${selected.state}`
                    : "No deployment selected"}
                </p>
              </div>
            </div>
            <div
              tabIndex={0}
              role="region"
              aria-label={selected ? `Log of ${selected.hash}` : "Log"}
              className={cn("max-h-96 overflow-auto py-3", FOCUS_INSIDE)}
            >
              {selected ? (
                <ol className="w-max min-w-full">
                  {logOf(selected).map((line, i) => {
                    const t = createdAt(selected, line.at)
                    const time = `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`
                    const dateTime = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${time}`
                    return (
                      <li key={i} className="flex gap-3 px-6 font-mono text-label whitespace-pre">
                        <time dateTime={dateTime} className={SMALL_FIGURE}>
                          {time}
                        </time>
                        <span className="text-foreground">
                          {line.word && <span className={line.word.className}>{line.word.text}</span>}
                          {line.text}
                        </span>
                      </li>
                    )
                  })}
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

export default App
