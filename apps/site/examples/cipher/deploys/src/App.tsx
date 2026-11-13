import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

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

type DeployState = "ready" | "building" | "queued" | "failed" | "canceled"
type Environment = "production" | "preview"

type Deployment = {
  hash: string
  message: string
  branch: string
  state: DeployState
  /** Seconds the deployment ran; null while it has not finished. */
  seconds: number | null
  date: string
  time: string
  /** What the build printed when it failed. */
  reason?: string
}

type Filters = {
  branch: string
  environment: "all" | Environment
  state: "all" | DeployState
}

type LogLine = {
  at: number
  lead?: { word: string; tone: "success" | "error" }
  text: string
}

// Newest first: the table is sorted by Created.
const DEPLOYMENTS: Deployment[] = [
  {
    hash: "a94e1b7",
    message: "Show a spinner while results load",
    branch: "feat/search",
    state: "queued",
    seconds: null,
    date: "2026-11-11",
    time: "14:12",
  },
  {
    hash: "2d7a6f0",
    message: "Index product titles for search",
    branch: "feat/search",
    state: "building",
    seconds: null,
    date: "2026-11-11",
    time: "14:05",
  },
  {
    hash: "8f3c2a1",
    message: "Merge fix/cart-total into main",
    branch: "main",
    state: "ready",
    seconds: 161,
    date: "2026-11-11",
    time: "13:22",
  },
  {
    hash: "e05b7c4",
    message: "Round cart totals to the cent",
    branch: "fix/cart-total",
    state: "ready",
    seconds: 114,
    date: "2026-11-11",
    time: "11:48",
  },
  {
    hash: "71c3d9a",
    message: "Read line prices from the form",
    branch: "fix/cart-total",
    state: "failed",
    seconds: 67,
    date: "2026-11-11",
    time: "11:31",
    reason:
      "src/cart/total.ts(41,18): Type 'string' is not assignable to type 'number'",
  },
  {
    hash: "b6f20de",
    message: "Bump the bundler and the type checker",
    branch: "chore/deps",
    state: "ready",
    seconds: 123,
    date: "2026-11-11",
    time: "09:40",
  },
  {
    hash: "3ac8e55",
    message: "Add a search field to the header",
    branch: "feat/search",
    state: "ready",
    seconds: 109,
    date: "2026-11-11",
    time: "09:02",
  },
  {
    hash: "d19f4a8",
    message: "Merge chore/deps into main",
    branch: "main",
    state: "ready",
    seconds: 192,
    date: "2026-11-10",
    time: "17:26",
  },
  {
    hash: "6e2b0c3",
    message: "Update the lockfile after the audit",
    branch: "chore/deps",
    state: "ready",
    seconds: 98,
    date: "2026-11-10",
    time: "16:51",
  },
  {
    hash: "f7a15d2",
    message: "Remove the unused date library",
    branch: "chore/deps",
    state: "canceled",
    seconds: 52,
    date: "2026-11-10",
    time: "16:44",
  },
  {
    hash: "09c4be6",
    message: "Fix a typo in the checkout heading",
    branch: "main",
    state: "ready",
    seconds: 156,
    date: "2026-11-10",
    time: "14:15",
  },
  {
    hash: "c8d37f1",
    message: "Debounce search requests",
    branch: "feat/search",
    state: "ready",
    seconds: 105,
    date: "2026-11-10",
    time: "12:33",
  },
  {
    hash: "4b91a6e",
    message: "Add the search results route",
    branch: "feat/search",
    state: "failed",
    seconds: 44,
    date: "2026-11-10",
    time: "12:10",
    reason: 'could not resolve "./results" from src/search/routes.tsx',
  },
  {
    hash: "a3e60d5",
    message: "Cache product images for a week",
    branch: "main",
    state: "ready",
    seconds: 168,
    date: "2026-11-10",
    time: "10:07",
  },
  {
    hash: "5f08c2b",
    message: "Show the shipping cost in the cart",
    branch: "fix/cart-total",
    state: "ready",
    seconds: 112,
    date: "2026-11-10",
    time: "09:19",
  },
  {
    hash: "1d6e9a4",
    message: "Add a wishlist link to the account menu",
    branch: "main",
    state: "ready",
    seconds: 175,
    date: "2026-11-09",
    time: "17:40",
  },
  {
    hash: "be42f70",
    message: "Pin the runtime version in the config",
    branch: "chore/deps",
    state: "ready",
    seconds: 38,
    date: "2026-11-09",
    time: "15:28",
  },
  {
    hash: "7c0a3b9",
    message: "Sketch the search index schema",
    branch: "feat/search",
    state: "ready",
    seconds: 101,
    date: "2026-11-09",
    time: "13:56",
  },
  {
    hash: "e8f5d16",
    message: "Load the product gallery on scroll",
    branch: "main",
    state: "ready",
    seconds: 164,
    date: "2026-11-09",
    time: "11:12",
  },
  {
    hash: "30b7c9f",
    message: "Add a free shipping threshold",
    branch: "fix/cart-total",
    state: "ready",
    seconds: 118,
    date: "2026-11-09",
    time: "09:34",
  },
]

const TOTAL = DEPLOYMENTS.length

const NO_FILTERS: Filters = { branch: "", environment: "all", state: "all" }

const NAV_LINKS = [
  { label: "Deploys", href: "/deploys", current: true },
  { label: "Domains", href: "#", current: false },
  { label: "Logs", href: "#", current: false },
  { label: "Settings", href: "/settings/tokens", current: false },
]

const ENVIRONMENT_CHOICES: { value: Filters["environment"]; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "production", label: "Production" },
    { value: "preview", label: "Preview" },
  ]

const STATE_CHOICES: { value: Filters["state"]; label: string }[] = [
  { value: "all", label: "All states" },
  { value: "ready", label: "ready" },
  { value: "building", label: "building" },
  { value: "queued", label: "queued" },
  { value: "failed", label: "failed" },
  { value: "canceled", label: "canceled" },
]

const STATE_DOT: Record<DeployState, string> = {
  ready: "bg-success",
  failed: "bg-destructive",
  building: "bg-primary",
  queued: "bg-muted-foreground",
  canceled: "bg-muted-foreground",
}

const MONTHS = [
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

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_INSIDE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const BUTTON = "px-4 font-mono text-label"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const FIELD_LABEL = "font-mono text-label text-foreground"
const HEADER_LINK =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
const CURRENT_LINK = "text-foreground underline underline-offset-4"
const PANEL_ROWS =
  "min-w-0 overflow-hidden rounded-xl border border-border bg-card md:col-span-12"
const PANEL_HEADING =
  "flex min-h-8 flex-wrap items-center justify-between gap-3"
const LABEL_HEADING = "font-mono text-label text-muted-foreground"
const HEAD_CELL =
  "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
const BODY_CELL = "px-3 py-2 first:pl-6 last:pr-6"

function environmentOf(deployment: Deployment): Environment {
  return deployment.branch === "main" ? "production" : "preview"
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-")
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0")
}

function countLabel(count: number) {
  return count === 1 ? "1 deployment" : `${count} deployments`
}

function filterDeployments(filters: Filters) {
  const search = filters.branch.trim().toLowerCase()
  return DEPLOYMENTS.filter(
    (deployment) =>
      deployment.branch.toLowerCase().includes(search) &&
      (filters.environment === "all" ||
        environmentOf(deployment) === filters.environment) &&
      (filters.state === "all" || deployment.state === filters.state)
  )
}

// A number that stays the same for one commit, so its log reads the same
// every time it is shown.
function seedOf(hash: string) {
  let sum = 0
  for (const character of hash) sum += character.charCodeAt(0)
  return sum
}

function addressOf(deployment: Deployment) {
  return deployment.branch === "main"
    ? "https://orrin-web.example"
    : `https://${deployment.branch.replace("/", "-")}.orrin-web.plinth.example`
}

function logOf(deployment: Deployment): LogLine[] {
  const { hash, branch, state, message } = deployment

  if (state === "queued") {
    return [{ at: 0, text: "queued behind 1 deployment" }]
  }

  const seed = seedOf(hash)
  const modules = 180 + (seed % 60)
  const assets = 36 + (seed % 20)
  const packages = 1240 + (seed % 90)
  // An unfinished build is laid out on the time builds of this project take.
  const total = deployment.seconds ?? 110
  const at = (share: number) => Math.round(total * share)

  const lines: LogLine[] = [
    {
      at: 0,
      text: `cloning git.orrin.example/orrin/orrin-web (branch ${branch})`,
    },
    { at: at(0.04), text: `checked out ${hash}: ${message}` },
    { at: at(0.07), text: "installing dependencies: npm ci" },
    {
      at: at(0.34),
      text: `added ${packages} packages in ${formatDuration(at(0.34) - at(0.07))}`,
    },
    { at: at(0.36), text: "building: npm run build" },
    { at: at(0.4), text: `transforming ${modules} modules for production` },
  ]

  if (state === "failed") {
    lines.push(
      {
        at: at(0.94),
        lead: { word: "error", tone: "error" },
        text: ` ${deployment.reason ?? "the build command stopped"}`,
      },
      {
        at: total,
        lead: { word: "failed", tone: "error" },
        text: ": build exited with code 1",
      }
    )
    return lines
  }

  if (state === "building") {
    lines.push(
      {
        at: at(0.52),
        text: `transformed ${Math.round(modules * 0.4)} of ${modules} modules`,
      },
      {
        at: at(0.63),
        text: `transformed ${Math.round(modules * 0.8)} of ${modules} modules`,
      }
    )
    return lines
  }

  if (state === "canceled") {
    lines.push(
      {
        at: at(0.7),
        text: `transformed ${Math.round(modules * 0.4)} of ${modules} modules`,
      },
      { at: total, text: "canceled by mara.lind" }
    )
    return lines
  }

  lines.push(
    {
      at: at(0.78),
      text: `built ${modules} modules into ${assets} assets`,
    },
    { at: at(0.8), text: `uploading ${assets} assets to the edge` },
    { at: at(0.96), text: `uploaded ${assets} assets` },
    {
      at: total,
      lead: { word: "ready", tone: "success" },
      text: ` ${addressOf(deployment)} in ${formatDuration(total)}`,
    }
  )
  return lines
}

function logTime(deployment: Deployment, offset: number) {
  const [hours, minutes] = deployment.time.split(":").map(Number)
  const start = hours * 3600 + minutes * 60 + (seedOf(deployment.hash) % 40)
  const moment = start + offset
  return [
    twoDigits(Math.floor(moment / 3600)),
    twoDigits(Math.floor(moment / 60) % 60),
    twoDigits(moment % 60),
  ].join(":")
}

function StateMark({ state }: { state: DeployState }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", STATE_DOT[state])}
      />
      <span className="text-foreground">{state}</span>
    </span>
  )
}

function Duration({ deployment }: { deployment: Deployment }) {
  if (deployment.state === "queued" || deployment.state === "building") {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">
          {deployment.state === "queued" ? "not started" : "not finished"}
        </span>
      </>
    )
  }
  return deployment.seconds === null ? (
    <span>—</span>
  ) : (
    <span>{formatDuration(deployment.seconds)}</span>
  )
}

export function App() {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [selectedHash, setSelectedHash] = useState<string | null>(
    DEPLOYMENTS[1].hash
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const shown = filterDeployments(filters)
  const selected =
    shown.find((deployment) => deployment.hash === selectedHash) ?? null
  const filtered =
    filters.branch.trim() !== "" ||
    filters.environment !== "all" ||
    filters.state !== "all"
  const liveHash = DEPLOYMENTS.find(
    (deployment) =>
      deployment.state === "ready" && environmentOf(deployment) === "production"
  )?.hash

  function applyFilters(next: Filters) {
    setFilters(next)
    const rows = filterDeployments(next)
    // Keep the selection while its row shows; otherwise take the first row.
    if (!rows.some((deployment) => deployment.hash === selectedHash)) {
      setSelectedHash(rows[0]?.hash ?? null)
    }
  }

  function clearFilters() {
    applyFilters(NO_FILTERS)
    searchRef.current?.focus()
  }

  function closeMenuOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header
        className="border-b border-border bg-card"
        onKeyDown={closeMenuOnEscape}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground", FOCUS)}
          >
            plinth
          </a>
          <p className={SMALL_FIGURE}>orrin / orrin-web</p>
          <nav aria-label="Main" className="hidden gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "font-mono text-label",
                  link.current ? CURRENT_LINK : HEADER_LINK,
                  FOCUS
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
            mara.lind@orrin.example
          </p>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(BUTTON, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-2 md:px-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "block py-2 font-mono text-label",
                  link.current ? CURRENT_LINK : HEADER_LINK,
                  FOCUS
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="py-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:grid-cols-12 md:px-6">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 md:col-span-12">
            <h1 className="text-h1">Deploys</h1>
            <div className="flex flex-wrap items-center gap-2">
              <Button className={BUTTON}>Deploy main</Button>
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap items-end gap-6 rounded-xl border border-border bg-card p-6 md:col-span-12">
            <div className="w-full md:w-64">
              <label
                htmlFor="filter-branch"
                className={cn("block", FIELD_LABEL)}
              >
                Branch
              </label>
              <Input
                ref={searchRef}
                id="filter-branch"
                autoComplete="off"
                placeholder="main, feat/…"
                value={filters.branch}
                onChange={(event) =>
                  applyFilters({ ...filters, branch: event.target.value })
                }
                className="mt-2 px-2 text-body md:text-body"
              />
            </div>

            <div>
              <p id="filter-environment" className={FIELD_LABEL}>
                Environment
              </p>
              <div
                role="group"
                aria-labelledby="filter-environment"
                className="mt-2 flex flex-wrap gap-2"
              >
                {ENVIRONMENT_CHOICES.map((choice) => {
                  const chosen = filters.environment === choice.value
                  return (
                    <Button
                      key={choice.value}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON}
                      onClick={() =>
                        applyFilters({ ...filters, environment: choice.value })
                      }
                    >
                      {choice.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="w-48">
              <label
                htmlFor="filter-state"
                className={cn("block", FIELD_LABEL)}
              >
                State
              </label>
              <Select
                items={STATE_CHOICES}
                value={filters.state}
                onValueChange={(value) => {
                  if (value !== null) {
                    applyFilters({ ...filters, state: value })
                  }
                }}
              >
                <SelectTrigger id="filter-state" className="mt-2 font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono">
                  {STATE_CHOICES.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className={cn(BUTTON, "ml-auto")}
              disabled={!filtered}
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>

          <section aria-labelledby="deployments-heading" className={PANEL_ROWS}>
            <div className="border-b border-border px-6 py-3">
              <div className={PANEL_HEADING}>
                <h2 id="deployments-heading" className={LABEL_HEADING}>
                  Deployments
                </h2>
                <p aria-live="polite" className={SMALL_FIGURE}>
                  {filtered ? `${shown.length} of ${TOTAL}` : countLabel(TOTAL)}
                </p>
              </div>
            </div>
            <Table label="Deployments" className="min-w-4xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead className={HEAD_CELL}>Commit</TableHead>
                  <TableHead className={HEAD_CELL}>Message</TableHead>
                  <TableHead className={HEAD_CELL}>Branch</TableHead>
                  <TableHead className={HEAD_CELL}>Environment</TableHead>
                  <TableHead className={HEAD_CELL}>State</TableHead>
                  <TableHead className={cn(HEAD_CELL, "text-right")}>
                    Duration
                  </TableHead>
                  <TableHead className={cn(HEAD_CELL, "text-right")}>
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className={cn(BODY_CELL, "py-6 whitespace-normal")}
                    >
                      <p className="max-w-lg">
                        No deployments match these filters.
                      </p>
                      <Button
                        variant="outline"
                        className={cn(BUTTON, "mt-3")}
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((deployment) => {
                    const isSelected = deployment.hash === selected?.hash
                    const environment = environmentOf(deployment)
                    return (
                      <TableRow
                        key={deployment.hash}
                        data-state={isSelected ? "selected" : undefined}
                        className="data-[state=selected]:bg-secondary/10"
                      >
                        <TableCell className={BODY_CELL}>
                          <button
                            type="button"
                            aria-label={`Show log of ${deployment.hash}`}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedHash(deployment.hash)}
                            className={cn(
                              "cursor-pointer font-mono tabular-nums transition-colors duration-150",
                              isSelected
                                ? "font-bold text-foreground no-underline"
                                : "text-primary underline underline-offset-4 hover:text-foreground",
                              FOCUS
                            )}
                          >
                            {deployment.hash}
                          </button>
                        </TableCell>
                        <TableCell
                          className={cn(BODY_CELL, "whitespace-normal")}
                        >
                          {deployment.message}
                        </TableCell>
                        <TableCell className={cn(BODY_CELL, "font-mono")}>
                          {deployment.branch}
                        </TableCell>
                        <TableCell className={BODY_CELL}>
                          {deployment.hash === liveHash ? (
                            <span className="inline-flex items-center gap-2">
                              {environment}
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                live
                              </Badge>
                            </span>
                          ) : (
                            environment
                          )}
                        </TableCell>
                        <TableCell className={BODY_CELL}>
                          <StateMark state={deployment.state} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            BODY_CELL,
                            "text-right font-mono tabular-nums"
                          )}
                        >
                          <Duration deployment={deployment} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            BODY_CELL,
                            "text-right font-mono tabular-nums"
                          )}
                        >
                          <time
                            dateTime={`${deployment.date}T${deployment.time}`}
                          >
                            {formatDate(deployment.date)}, {deployment.time}
                          </time>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </section>

          <section aria-labelledby="log-heading" className={PANEL_ROWS}>
            <div className="border-b border-border px-6 py-3">
              <div className={PANEL_HEADING}>
                <h2 id="log-heading" className={LABEL_HEADING}>
                  Log
                </h2>
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
                <ol className="w-max min-w-full list-none p-0">
                  {logOf(selected).map((line, index) => {
                    const time = logTime(selected, line.at)
                    return (
                      <li
                        key={index}
                        className="flex gap-3 px-6 font-mono text-label whitespace-pre"
                      >
                        <time
                          dateTime={`${selected.date}T${time}`}
                          className={SMALL_FIGURE}
                        >
                          {time}
                        </time>
                        <span className="text-foreground">
                          {line.lead ? (
                            <span
                              className={
                                line.lead.tone === "success"
                                  ? "text-success"
                                  : "text-destructive"
                              }
                            >
                              {line.lead.word}
                            </span>
                          ) : null}
                          {line.text}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              ) : (
                <p className="max-w-lg px-6 text-body">
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
