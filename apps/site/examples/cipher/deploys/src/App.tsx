import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  deployments,
  formatCreated,
  formatDuration,
  logOf,
  type DeployState,
  type Deployment,
  type Environment,
} from "@/deploys"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusInside =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const buttonText = "px-4 font-mono text-label"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const headerLink =
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground"

const navLinks = [
  { label: "Deploys", href: "/deploys", current: true },
  { label: "Domains", href: "#" },
  { label: "Logs", href: "#" },
  { label: "Settings", href: "/settings/tokens" },
]

type EnvFilter = "all" | Environment
type StateFilter = "all" | DeployState
type Filters = { branch: string; env: EnvFilter; state: StateFilter }

const noFilters: Filters = { branch: "", env: "all", state: "all" }

const envOptions: { value: EnvFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "production", label: "Production" },
  { value: "preview", label: "Preview" },
]

const stateOptions: { value: StateFilter; label: string }[] = [
  { value: "all", label: "All states" },
  { value: "ready", label: "ready" },
  { value: "building", label: "building" },
  { value: "queued", label: "queued" },
  { value: "failed", label: "failed" },
  { value: "canceled", label: "canceled" },
]

// Sorted by Created, newest first.
const sorted = [...deployments].sort((a, b) =>
  b.created.localeCompare(a.created)
)

// The deployment that serves production now: the newest ready one to production.
const liveHash = sorted.find(
  (dep) => dep.environment === "production" && dep.state === "ready"
)?.hash

function matches(dep: Deployment, f: Filters) {
  const query = f.branch.trim().toLowerCase()
  return (
    (query === "" || dep.branch.toLowerCase().includes(query)) &&
    (f.env === "all" || dep.environment === f.env) &&
    (f.state === "all" || dep.state === f.state)
  )
}

function isFiltered(f: Filters) {
  return f.branch !== "" || f.env !== "all" || f.state !== "all"
}

const dotColor: Record<DeployState, string> = {
  ready: "bg-success",
  failed: "bg-destructive",
  building: "bg-primary",
  queued: "bg-muted-foreground",
  canceled: "bg-muted-foreground",
}

function State({ state }: { state: DeployState }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("size-2 shrink-0 rounded-full", dotColor[state])}
      />
      <span className="text-foreground">{state}</span>
    </span>
  )
}

function Duration({ dep }: { dep: Deployment }) {
  if (dep.duration === null) {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">
          {dep.state === "queued" ? "not started" : "not finished"}
        </span>
      </>
    )
  }
  return <>{formatDuration(dep.duration)}</>
}

function ConsoleBar() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <a href="/" className={cn("font-heading text-h2 text-foreground", focus)}>
          plinth
        </a>
        <p className={smallFigure}>orrin / orrin-web</p>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                headerLink,
                focus,
                link.current && "text-foreground underline underline-offset-4"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn("ml-auto hidden md:block", smallFigure)}>
          mara.lind@orrin.example
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="console-menu"
          onClick={() => setOpen((value) => !value)}
          className={cn("ml-auto md:hidden", buttonText)}
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
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "block py-2",
                headerLink,
                focus,
                link.current && "text-foreground underline underline-offset-4"
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
  // The building deployment, the second row, is selected at the start.
  const [selectedHash, setSelectedHash] = useState<string | null>(
    sorted[1].hash
  )
  const searchRef = useRef<HTMLInputElement>(null)

  const shown = sorted.filter((dep) => matches(dep, filters))
  const filtered = isFiltered(filters)
  const selected = shown.find((dep) => dep.hash === selectedHash) ?? null

  function applyFilters(next: Filters) {
    setFilters(next)
    const nextShown = sorted.filter((dep) => matches(dep, next))
    if (!nextShown.some((dep) => dep.hash === selectedHash)) {
      setSelectedHash(nextShown[0]?.hash ?? null)
    }
  }

  function clearFilters() {
    applyFilters(noFilters)
    searchRef.current?.focus()
  }

  const count = filtered
    ? `${shown.length} of ${sorted.length}`
    : `${sorted.length} ${sorted.length === 1 ? "deployment" : "deployments"}`

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

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-6 rounded-xl border border-border bg-card p-6 md:col-span-12">
            <div className="w-full md:w-64">
              <label
                htmlFor="branch-search"
                className="block font-mono text-label text-foreground"
              >
                Branch
              </label>
              <Input
                ref={searchRef}
                id="branch-search"
                type="search"
                placeholder="main, feat/…"
                value={filters.branch}
                onChange={(event) =>
                  applyFilters({ ...filters, branch: event.target.value })
                }
                className="mt-2 text-body md:text-body"
              />
            </div>

            <div>
              <p
                id="env-filter-label"
                className="font-mono text-label text-foreground"
              >
                Environment
              </p>
              <div
                role="group"
                aria-labelledby="env-filter-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {envOptions.map((option) => {
                  const chosen = filters.env === option.value
                  return (
                    <Button
                      key={option.value}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      onClick={() =>
                        applyFilters({ ...filters, env: option.value })
                      }
                      className={buttonText}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="w-48">
              <label
                htmlFor="state-filter"
                className="block font-mono text-label text-foreground"
              >
                State
              </label>
              <select
                id="state-filter"
                value={filters.state}
                onChange={(event) =>
                  applyFilters({
                    ...filters,
                    state: event.target.value as StateFilter,
                  })
                }
                className={cn(
                  "mt-2 h-8 w-full rounded-lg border border-input bg-transparent px-2 font-mono text-body aria-invalid:border-destructive",
                  focus
                )}
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              disabled={!filtered}
              onClick={clearFilters}
              className={cn("ml-auto", buttonText)}
            >
              Clear filters
            </Button>
          </div>

          {/* Deployments */}
          <section
            aria-labelledby="deployments-heading"
            className="min-w-0 overflow-hidden rounded-xl border border-border bg-card md:col-span-12"
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
                  {count}
                </p>
              </div>
            </div>

            <Table label="Deployments" className="min-w-4xl text-body">
              <TableHeader>
                <TableRow>
                  {["Commit", "Message", "Branch", "Environment", "State"].map(
                    (name) => (
                      <TableHead
                        key={name}
                        className="px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
                      >
                        {name}
                      </TableHead>
                    )
                  )}
                  {["Duration", "Created"].map((name) => (
                    <TableHead
                      key={name}
                      className="px-3 text-right font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
                    >
                      {name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-3 py-6 whitespace-normal first:pl-6 last:pr-6"
                    >
                      <p>No deployments match these filters.</p>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className={buttonText}
                        >
                          Clear filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((dep) => {
                    const isSelected = dep.hash === selected?.hash
                    const cell = "px-3 py-2 first:pl-6 last:pr-6"
                    return (
                      <TableRow
                        key={dep.hash}
                        data-state={isSelected ? "selected" : undefined}
                        className="data-[state=selected]:bg-secondary/10"
                      >
                        <TableCell className={cell}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            aria-label={`Show log of ${dep.hash}`}
                            onClick={() => setSelectedHash(dep.hash)}
                            className={cn(
                              "font-mono tabular-nums text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
                              focus,
                              isSelected && "font-bold text-foreground no-underline"
                            )}
                          >
                            {dep.hash}
                          </button>
                        </TableCell>
                        <TableCell className={cn(cell, "whitespace-normal")}>
                          {dep.message}
                        </TableCell>
                        <TableCell className={cn(cell, "font-mono")}>
                          {dep.branch}
                        </TableCell>
                        <TableCell className={cell}>
                          {dep.hash === liveHash ? (
                            <span className="inline-flex items-center gap-2">
                              {dep.environment}
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                live
                              </Badge>
                            </span>
                          ) : (
                            dep.environment
                          )}
                        </TableCell>
                        <TableCell className={cell}>
                          <State state={dep.state} />
                        </TableCell>
                        <TableCell
                          className={cn(cell, "text-right font-mono tabular-nums")}
                        >
                          <Duration dep={dep} />
                        </TableCell>
                        <TableCell
                          className={cn(cell, "text-right font-mono tabular-nums")}
                        >
                          <time dateTime={dep.created}>
                            {formatCreated(dep.created)}
                          </time>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </section>

          {/* Log */}
          <section
            aria-labelledby="log-heading"
            className="min-w-0 overflow-hidden rounded-xl border border-border bg-card md:col-span-12"
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
                  {selected
                    ? `${selected.hash} · ${selected.environment} · ${selected.state}`
                    : "No deployment selected"}
                </p>
              </div>
            </div>
            <div
              tabIndex={0}
              role="region"
              aria-label={selected ? `Log of ${selected.hash}` : "Log"}
              className={cn("max-h-96 overflow-auto py-3", focusInside)}
            >
              {selected ? (
                <ol className="w-max min-w-full list-none p-0">
                  {logOf(selected).map((line, index) => (
                    <li
                      key={index}
                      className="flex gap-3 px-6 font-mono text-label whitespace-pre"
                    >
                      <time dateTime={line.dateTime} className={smallFigure}>
                        {line.time}
                      </time>
                      <span className="text-foreground">
                        {line.kind === "ready" && (
                          <span className="text-success">ready</span>
                        )}
                        {line.kind === "error" && (
                          <span className="text-destructive">error</span>
                        )}
                        {line.kind === "failed" && (
                          <span className="text-destructive">failed</span>
                        )}
                        {line.kind === "ready" || line.kind === "error"
                          ? ` ${line.text}`
                          : line.kind === "failed"
                            ? `: ${line.text}`
                            : line.text}
                      </span>
                    </li>
                  ))}
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
