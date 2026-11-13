import * as React from "react"
import { Check, CircleAlert, TriangleAlert } from "lucide-react"

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

// Sample data ---------------------------------------------------------------

type Scope = "read" | "deploy:write" | "admin"
type Expiry = "30d" | "90d" | "1y" | "never"

type Token = {
  id: string
  name: string
  secret: string
  scope: Scope
  created: string // YYYY-MM-DD
  lastUsed: string | null // YYYY-MM-DDTHH:MM
  expires: string | null // YYYY-MM-DD
}

// The console's fixed sample date: 11 November 2026.
const TODAY = "2026-11-11"

const INITIAL_TOKENS: Token[] = [
  {
    id: "tok-1",
    name: "ci-deploy",
    secret: "plt_7Kq2mWx9Rb4TzL1vNc8HpQe3Ya6Uj0Sd",
    scope: "deploy:write",
    created: "2026-08-14",
    lastUsed: "2026-11-11T09:12",
    expires: null,
  },
  {
    id: "tok-2",
    name: "staging-bot",
    secret: "plt_Vd3nB8sLq0YkT5wMh2Ra9Ge7Jx4Pc1Zf",
    scope: "deploy:write",
    created: "2026-09-02",
    lastUsed: "2026-11-10T17:40",
    expires: "2026-12-01",
  },
  {
    id: "tok-3",
    name: "metrics-reader",
    secret: "plt_Hf6rC2tWn9Kb4Xa7Le1Qs8Dm3Vy5Ug0J",
    scope: "read",
    created: "2026-09-19",
    lastUsed: "2026-11-11T08:03",
    expires: "2027-09-19",
  },
  {
    id: "tok-4",
    name: "mara-laptop",
    secret: "plt_Pz5aE1gYk8Tm3Rw6Nb0Hc9Lv2Xq7Sf4D",
    scope: "admin",
    created: "2026-10-30",
    lastUsed: null,
    expires: "2027-01-28",
  },
]

const SCOPE_ITEMS: { value: Scope; label: string }[] = [
  { value: "read", label: "read" },
  { value: "deploy:write", label: "deploy:write" },
  { value: "admin", label: "admin" },
]

const SCOPE_HELP: Record<Scope, string> = {
  read: "Reads deploys, logs and settings. Changes nothing.",
  "deploy:write": "Starts, promotes and rolls back deploys, and reads logs.",
  admin: "Full access, including members, domains, billing and tokens.",
}

const EXPIRY_ITEMS: { value: Expiry; label: string }[] = [
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
  { value: "never", label: "never" },
]

// Helpers -------------------------------------------------------------------

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

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function toIsoDate(date: Date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function expiryFrom(start: string, expiry: Expiry): string | null {
  if (expiry === "never") return null
  const [y, m, d] = start.split("-").map(Number)
  if (expiry === "1y") return toIsoDate(new Date(Date.UTC(y + 1, m - 1, d)))
  const days = expiry === "30d" ? 30 : 90
  return toIsoDate(new Date(Date.UTC(y, m - 1, d + days)))
}

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function generateSecret() {
  let out = ""
  while (out.length < 32) {
    const bytes = new Uint8Array(48)
    crypto.getRandomValues(bytes)
    for (const b of bytes) {
      // 248 is the largest multiple of 62 below 256: no bias.
      if (b < 248 && out.length < 32) out += ALPHABET[b % 62]
    }
  }
  return `plt_${out}`
}

function countTokens(n: number) {
  return `${n} ${n === 1 ? "token" : "tokens"}`
}

// Shared classes ------------------------------------------------------------

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const CONTAINER = "mx-auto max-w-[1200px] px-4 md:px-6"
const BUTTON = "px-4 font-mono text-label"
const LABEL = "block font-mono text-label text-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const HEADER_LINK = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const CURRENT_LINK = "text-foreground underline underline-offset-4"
const ERROR_LINE =
  "mt-2 flex items-start gap-2 font-mono text-label text-destructive"
const HEAD = "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
const CELL = "px-3 py-2 first:pl-6 last:pr-6"

const MAIN_LINKS = [
  { label: "Deploys", href: "/deploys" },
  { label: "Domains", href: "#" },
  { label: "Logs", href: "#" },
  { label: "Settings", href: "/settings/tokens", current: true },
]

const SETTINGS_LINKS = [
  { label: "General", href: "#" },
  { label: "Members", href: "#" },
  { label: "Domains", href: "#" },
  { label: "API tokens", href: "/settings/tokens", current: true },
  { label: "Billing", href: "#" },
]

function ErrorLine({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className={ERROR_LINE}>
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

function TokenName({ children }: { children: React.ReactNode }) {
  return <span className="font-mono wrap-break-word">{children}</span>
}

// Console bar ---------------------------------------------------------------

function ConsoleBar() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header
      className="border-b border-border bg-card"
      onKeyDown={onKeyDown}
    >
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", FOCUS)}
        >
          plinth
        </a>
        <p className={SMALL_FIGURE}>orrin / orrin-web</p>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "font-mono text-label",
                HEADER_LINK,
                link.current && CURRENT_LINK
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p
          className={cn(
            SMALL_FIGURE,
            "ml-auto hidden wrap-break-word md:block"
          )}
        >
          mara.lind@orrin.example
        </p>
        <Button
          ref={menuButtonRef}
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={menuOpen}
          aria-controls="console-menu"
          onClick={() => setMenuOpen((open) => !open)}
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
        <div className={cn(CONTAINER, "py-2")}>
          {MAIN_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "block py-2 font-mono text-label",
                HEADER_LINK,
                link.current && CURRENT_LINK
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

// Page ----------------------------------------------------------------------

type CreatedToken = { name: string; secret: string; expires: string | null }

export function App() {
  const [tokens, setTokens] = React.useState<Token[]>(INITIAL_TOKENS)
  const [newestId, setNewestId] = React.useState<string | null>(null)

  // Revoke confirmation
  const [revokeId, setRevokeId] = React.useState<string | null>(null)
  const [revokeValue, setRevokeValue] = React.useState("")
  const [revokeError, setRevokeError] = React.useState(false)
  const [revokedName, setRevokedName] = React.useState<string | null>(null)
  const [revokeCount, setRevokeCount] = React.useState(0)
  const revokeFieldRef = React.useRef<HTMLInputElement>(null)
  const revokedMessageRef = React.useRef<HTMLParagraphElement>(null)
  const revokeButtonRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = React.useRef<
    "revoke-field" | "revoked-message" | "name-field" | "created-message" | null
  >(null)
  const [focusTick, setFocusTick] = React.useState(0)

  // Create form
  const [name, setName] = React.useState("")
  const [nameError, setNameError] = React.useState<React.ReactNode>(null)
  const [scope, setScope] = React.useState<Scope>("deploy:write")
  const [expiry, setExpiry] = React.useState<Expiry>("90d")
  const [created, setCreated] = React.useState<CreatedToken | null>(null)
  const [copyState, setCopyState] = React.useState<
    "idle" | "copied" | "failed"
  >("idle")
  const nameFieldRef = React.useRef<HTMLInputElement>(null)
  const createdMessageRef = React.useRef<HTMLParagraphElement>(null)
  const copyTimer = React.useRef<number | undefined>(undefined)

  function focusAfterRender(target: NonNullable<typeof pendingFocus.current>) {
    pendingFocus.current = target
    setFocusTick((n) => n + 1)
  }

  React.useEffect(() => {
    const target = pendingFocus.current
    pendingFocus.current = null
    if (target === "revoke-field") revokeFieldRef.current?.focus()
    if (target === "revoked-message") revokedMessageRef.current?.focus()
    if (target === "name-field") nameFieldRef.current?.focus()
    if (target === "created-message") createdMessageRef.current?.focus()
  }, [focusTick])

  React.useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const revokeToken = tokens.find((t) => t.id === revokeId) ?? null

  // Revoking -----------------------------------------------------------------

  function openRevoke(id: string) {
    setRevokeId(id)
    setRevokeValue("")
    setRevokeError(false)
    focusAfterRender("revoke-field")
  }

  function cancelRevoke() {
    const id = revokeId
    setRevokeId(null)
    setRevokeValue("")
    setRevokeError(false)
    if (id) revokeButtonRefs.current.get(id)?.focus()
  }

  function submitRevoke(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!revokeToken) return
    if (revokeValue.trim() !== revokeToken.name) {
      setRevokeError(true)
      revokeFieldRef.current?.focus()
      return
    }
    setTokens((list) => list.filter((t) => t.id !== revokeToken.id))
    if (newestId === revokeToken.id) setNewestId(null)
    setRevokeId(null)
    setRevokeValue("")
    setRevokeError(false)
    setRevokedName(revokeToken.name)
    setRevokeCount((n) => n + 1)
    focusAfterRender("revoked-message")
  }

  // Creating -----------------------------------------------------------------

  function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = name.trim()
    setName(value)
    let error: React.ReactNode = null
    if (value === "") {
      error = "Enter a name for the token."
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      error = "Use only lowercase letters, numbers and hyphens."
    } else if (value.length > 32) {
      error = "Use 32 characters or fewer."
    } else if (tokens.some((t) => t.name === value)) {
      error = (
        <>
          A token named <TokenName>{value}</TokenName> already exists. Choose
          another name.
        </>
      )
    }
    if (error) {
      setNameError(error)
      nameFieldRef.current?.focus()
      return
    }

    const secret = generateSecret()
    const expires = expiryFrom(TODAY, expiry)
    const id = `tok-${secret.slice(4, 12)}`
    setTokens((list) => [
      {
        id,
        name: value,
        secret,
        scope,
        created: TODAY,
        lastUsed: null,
        expires,
      },
      ...list,
    ])
    setNewestId(id)
    setCreated({ name: value, secret, expires })
    setNameError(null)
    setCopyState("idle")
    focusAfterRender("created-message")
  }

  async function copySecret() {
    if (!created) return
    window.clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(created.secret)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
    copyTimer.current = window.setTimeout(() => setCopyState("idle"), 2000)
  }

  function done() {
    window.clearTimeout(copyTimer.current)
    setCreated(null)
    setCopyState("idle")
    setName("")
    setNameError(null)
    setScope("deploy:write")
    setExpiry("90d")
    focusAfterRender("name-field")
  }

  const nameDescribedBy = cn("name-help", nameError && "name-error")

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <ConsoleBar />

      <main className="py-6">
        <div className={cn(CONTAINER, "grid grid-cols-1 gap-6 lg:grid-cols-12")}>
          {/* Page header */}
          <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-12">
            <h1 className="text-h1">Settings</h1>
          </div>

          {/* Settings links */}
          <nav
            aria-label="Settings"
            className="lg:sticky lg:top-6 lg:col-span-2 lg:self-start"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:block">
              {SETTINGS_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      "block py-1 font-sans text-body",
                      HEADER_LINK,
                      link.current && CURRENT_LINK
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* API tokens */}
          <section
            aria-labelledby="api-tokens-heading"
            className="min-w-0 lg:col-span-10"
          >
            <h2 id="api-tokens-heading" className="text-h2">
              API tokens
            </h2>
            <p className="mt-3 max-w-lg">
              Tokens let scripts and CI run{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                plinth
              </code>{" "}
              as the team. The CLI reads the token from{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                PLINTH_TOKEN
              </code>
              .
            </p>

            <div role="status">
              {revokedName && (
                <p
                  key={revokeCount}
                  ref={revokedMessageRef}
                  tabIndex={-1}
                  className={cn("mt-3", FOCUS_FROM_CODE)}
                >
                  Token <TokenName>{revokedName}</TokenName> revoked.
                </p>
              )}
            </div>

            {/* Tokens panel */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-3">
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                  <h3 className="font-mono text-label text-muted-foreground">
                    Tokens
                  </h3>
                  <p className={SMALL_FIGURE}>{countTokens(tokens.length)}</p>
                </div>
              </div>

              <Table label="API tokens" className="min-w-2xl text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={HEAD}>Name</TableHead>
                    <TableHead className={HEAD}>Token</TableHead>
                    <TableHead className={HEAD}>Scope</TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Created
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Last used
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      Expires
                    </TableHead>
                    <TableHead className={cn(HEAD, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className={cn(CELL, "whitespace-normal")}
                      >
                        No tokens. Create one below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className={cn(CELL, "font-mono")}>
                          {token.id === newestId ? (
                            <span className="inline-flex items-center gap-2">
                              {token.name}
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                new
                              </Badge>
                            </span>
                          ) : (
                            token.name
                          )}
                        </TableCell>
                        <TableCell
                          className={cn(
                            CELL,
                            "font-mono tabular-nums text-muted-foreground"
                          )}
                        >
                          {token.secret.slice(0, 8)}…
                        </TableCell>
                        <TableCell className={cn(CELL, "font-mono")}>
                          {token.scope}
                        </TableCell>
                        <TableCell
                          className={cn(CELL, "text-right font-mono tabular-nums")}
                        >
                          <time dateTime={token.created}>
                            {formatDate(token.created)}
                          </time>
                        </TableCell>
                        <TableCell
                          className={cn(CELL, "text-right font-mono tabular-nums")}
                        >
                          {token.lastUsed ? (
                            <time dateTime={token.lastUsed}>
                              {formatDate(token.lastUsed)}
                            </time>
                          ) : (
                            "never"
                          )}
                        </TableCell>
                        <TableCell
                          className={cn(CELL, "text-right font-mono tabular-nums")}
                        >
                          {token.expires ? (
                            <time dateTime={token.expires}>
                              {formatDate(token.expires)}
                            </time>
                          ) : (
                            "never"
                          )}
                        </TableCell>
                        <TableCell className={cn(CELL, "text-right")}>
                          <Button
                            ref={(el: HTMLButtonElement | null) => {
                              if (el) revokeButtonRefs.current.set(token.id, el)
                              else revokeButtonRefs.current.delete(token.id)
                            }}
                            variant="destructive"
                            className={cn(BUTTON, "hover:text-foreground")}
                            aria-label={`Revoke ${token.name}`}
                            onClick={() => openRevoke(token.id)}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {revokeToken && (
                <div className="border-t border-border px-6 py-4">
                  <form
                    noValidate
                    aria-labelledby="revoke-title"
                    onSubmit={submitRevoke}
                  >
                    <p
                      id="revoke-title"
                      className="font-mono font-bold wrap-break-word"
                    >
                      Revoke {revokeToken.name}
                    </p>
                    <p className="mt-3 max-w-lg">
                      Scripts using this token stop working at once. This
                      cannot be undone.
                    </p>
                    <div className="mt-4 max-w-md">
                      <label htmlFor="revoke-confirm" className={LABEL}>
                        Type {revokeToken.name} to confirm
                      </label>
                      <Input
                        ref={revokeFieldRef}
                        id="revoke-confirm"
                        autoComplete="off"
                        spellCheck={false}
                        value={revokeValue}
                        onChange={(e) => {
                          setRevokeValue(e.target.value)
                          setRevokeError(false)
                        }}
                        aria-invalid={revokeError || undefined}
                        aria-describedby={
                          revokeError ? "revoke-error" : undefined
                        }
                        className="mt-2 px-2 font-mono text-body md:text-body"
                      />
                      {revokeError && (
                        <ErrorLine id="revoke-error">
                          Type <TokenName>{revokeToken.name}</TokenName>{" "}
                          exactly to revoke this token.
                        </ErrorLine>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="submit"
                        variant="destructive"
                        className={cn(BUTTON, "hover:text-foreground")}
                      >
                        <TriangleAlert
                          className="size-4"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        Revoke token
                      </Button>
                      <Button
                        variant="outline"
                        className={BUTTON}
                        onClick={cancelRevoke}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Create panel */}
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h3 className="font-mono text-label text-muted-foreground">
                  Create a token
                </h3>
              </div>

              <div className="mt-4">
                {!created && (
                  <form noValidate onSubmit={submitCreate} aria-label="Create a token">
                    <div className="max-w-md">
                      <label htmlFor="token-name" className={LABEL}>
                        Name
                      </label>
                      <Input
                        ref={nameFieldRef}
                        id="token-name"
                        autoComplete="off"
                        spellCheck={false}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setNameError(null)
                        }}
                        aria-invalid={nameError ? true : undefined}
                        aria-describedby={nameDescribedBy}
                        className="mt-2 px-2 font-mono text-body md:text-body"
                      />
                      <p id="name-help" className={cn(SMALL_FIGURE, "mt-2")}>
                        Lowercase letters, numbers and hyphens, up to 32
                        characters.
                      </p>
                      {nameError && (
                        <ErrorLine id="name-error">{nameError}</ErrorLine>
                      )}
                    </div>

                    <div className="mt-4 max-w-md">
                      <label
                        id="token-scope-label"
                        htmlFor="token-scope"
                        className={LABEL}
                      >
                        Scope
                      </label>
                      <Select
                        items={SCOPE_ITEMS}
                        value={scope}
                        onValueChange={(value) => {
                          if (value !== null) setScope(value as Scope)
                        }}
                      >
                        <SelectTrigger
                          id="token-scope"
                          aria-labelledby="token-scope-label"
                          aria-describedby="token-scope-help"
                          className="mt-2 font-mono"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-mono">
                          {SCOPE_ITEMS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p
                        id="token-scope-help"
                        className={cn(SMALL_FIGURE, "mt-2")}
                      >
                        {SCOPE_HELP[scope]}
                      </p>
                    </div>

                    <div className="mt-4 max-w-md">
                      <label
                        id="token-expires-label"
                        htmlFor="token-expires"
                        className={LABEL}
                      >
                        Expires
                      </label>
                      <Select
                        items={EXPIRY_ITEMS}
                        value={expiry}
                        onValueChange={(value) => {
                          if (value !== null) setExpiry(value as Expiry)
                        }}
                      >
                        <SelectTrigger
                          id="token-expires"
                          aria-labelledby="token-expires-label"
                          className="mt-2 font-mono"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-mono">
                          {EXPIRY_ITEMS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-6">
                      <Button type="submit" className={BUTTON}>
                        Create token
                      </Button>
                    </div>
                  </form>
                )}

                <div role="status">
                  {created && (
                    <>
                      <p
                        ref={createdMessageRef}
                        tabIndex={-1}
                        className={FOCUS_FROM_CODE}
                      >
                        Token <TokenName>{created.name}</TokenName> created.
                      </p>
                      <p className="mt-3 max-w-lg">
                        Copy it now: it is shown once, Plinth keeps only a hash
                        of it, and it{" "}
                        {created.expires ? (
                          <>
                            expires on{" "}
                            <time
                              dateTime={created.expires}
                              className="font-mono"
                            >
                              {formatDate(created.expires)}
                            </time>
                            .
                          </>
                        ) : (
                          "never expires."
                        )}
                      </p>
                      <code className="mt-6 block rounded-sm bg-secondary/10 px-2 py-1 font-mono text-body break-all">
                        {created.secret}
                      </code>
                    </>
                  )}
                </div>

                {created && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className={BUTTON}
                      onClick={copySecret}
                    >
                      {copyState === "copied" && (
                        <Check
                          className="size-4"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      )}
                      {copyState === "copied"
                        ? "Copied"
                        : copyState === "failed"
                          ? "Copy failed"
                          : "Copy"}
                    </Button>
                    <Button variant="secondary" className={BUTTON} onClick={done}>
                      Done
                    </Button>
                  </div>
                )}

                <div role="status" className="sr-only">
                  {copyState === "copied"
                    ? "Token copied to the clipboard."
                    : copyState === "failed"
                      ? "Copy failed."
                      : ""}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
