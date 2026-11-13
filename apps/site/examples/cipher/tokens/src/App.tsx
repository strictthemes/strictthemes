import { useEffect, useRef, useState } from "react"
import type { FormEvent, KeyboardEvent, ReactNode } from "react"
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

/* ---------- Shared class lists ---------- */

const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusOutline =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const quietLink = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const currentLink = "text-foreground underline underline-offset-4"
const buttonText = "px-4 font-mono text-label"
const inputText = "px-2 text-body md:text-body"
const fieldLabel = "block font-mono text-label text-foreground"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const labelHeading = "font-mono text-label text-muted-foreground"
const headCell = "px-3 first:pl-6 last:pr-6 font-mono text-label text-muted-foreground"
const bodyCell = "px-3 py-2 first:pl-6 last:pr-6"
const icon = { className: "size-4", strokeWidth: 1.5, "aria-hidden": true } as const

/* ---------- Dates ---------- */

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

// The fixed sample date: 11 November 2026.
const TODAY = { y: 2026, m: 11, d: 11 }

type Stamp = { iso: string; text: string }

function stampFromUTC(date: Date): Stamp {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth()
  const d = date.getUTCDate()
  return {
    iso: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    text: `${d} ${MONTHS[m]} ${y}`,
  }
}

function day(y: number, m: number, d: number): Stamp {
  return stampFromUTC(new Date(Date.UTC(y, m - 1, d)))
}

function usedAt(y: number, m: number, d: number, time: string): Stamp {
  const date = day(y, m, d)
  return { iso: `${date.iso}T${time}`, text: date.text }
}

type Expiry = "30 days" | "90 days" | "1 year" | "never"

function expiryFromToday(expiry: Expiry): Stamp | null {
  const { y, m, d } = TODAY
  if (expiry === "30 days") return stampFromUTC(new Date(Date.UTC(y, m - 1, d + 30)))
  if (expiry === "90 days") return stampFromUTC(new Date(Date.UTC(y, m - 1, d + 90)))
  if (expiry === "1 year") return day(y + 1, m, d)
  return null
}

/* ---------- Data ---------- */

type Scope = "read" | "deploy:write" | "admin"

type Token = {
  id: string
  name: string
  prefix: string
  scope: Scope
  created: Stamp
  lastUsed: Stamp | null
  expires: Stamp | null
}

const INITIAL_TOKENS: Token[] = [
  {
    id: "tok-ci-deploy",
    name: "ci-deploy",
    prefix: "plt_7Kq2",
    scope: "deploy:write",
    created: day(2026, 8, 14),
    lastUsed: usedAt(2026, 11, 11, "09:12"),
    expires: null,
  },
  {
    id: "tok-staging-bot",
    name: "staging-bot",
    prefix: "plt_Rm4x",
    scope: "deploy:write",
    created: day(2026, 9, 2),
    lastUsed: usedAt(2026, 11, 10, "17:40"),
    expires: day(2026, 12, 1),
  },
  {
    id: "tok-metrics-reader",
    name: "metrics-reader",
    prefix: "plt_b9Tw",
    scope: "read",
    created: day(2026, 9, 19),
    lastUsed: usedAt(2026, 11, 11, "08:03"),
    expires: day(2027, 9, 19),
  },
  {
    id: "tok-mara-laptop",
    name: "mara-laptop",
    prefix: "plt_Zp0e",
    scope: "admin",
    created: day(2026, 10, 30),
    lastUsed: null,
    expires: day(2027, 1, 28),
  },
]

const SCOPES: { value: Scope; label: string }[] = [
  { value: "read", label: "read" },
  { value: "deploy:write", label: "deploy:write" },
  { value: "admin", label: "admin" },
]

const SCOPE_HELP: Record<Scope, string> = {
  read: "Reads deploys, logs and settings, and changes nothing.",
  "deploy:write": "Starts, rolls back and cancels deploys, and reads everything.",
  admin: "Does everything, including members, domains, tokens and billing.",
}

const EXPIRIES: { value: Expiry; label: string }[] = [
  { value: "30 days", label: "30 days" },
  { value: "90 days", label: "90 days" },
  { value: "1 year", label: "1 year" },
  { value: "never", label: "never" },
]

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function makeSecret(): string {
  let out = "plt_"
  const buf = new Uint8Array(1)
  while (out.length < 36) {
    crypto.getRandomValues(buf)
    // 248 is the largest multiple of 62 below 256: no value is favoured.
    if (buf[0] < 248) out += ALPHABET[buf[0] % ALPHABET.length]
  }
  return out
}

function countTokens(n: number) {
  return `${n} ${n === 1 ? "token" : "tokens"}`
}

/* ---------- Small parts ---------- */

function DateCell({ stamp }: { stamp: Stamp | null }) {
  return (
    <TableCell className={cn(bodyCell, "text-right font-mono tabular-nums")}>
      {stamp ? <time dateTime={stamp.iso}>{stamp.text}</time> : "never"}
    </TableCell>
  )
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label wrap-break-word text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span className="min-w-0">{children}</span>
    </p>
  )
}

const NAV = [
  { label: "Deploys", href: "/deploys" },
  { label: "Domains", href: "#" },
  { label: "Logs", href: "#" },
  { label: "Settings", href: "/settings/tokens", current: true },
]

const SETTINGS_NAV = [
  { label: "General", href: "#" },
  { label: "Members", href: "#" },
  { label: "Domains", href: "#" },
  { label: "API tokens", href: "/settings/tokens", current: true },
  { label: "Billing", href: "#" },
]

/* ---------- Page ---------- */

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS)
  const [newestId, setNewestId] = useState<string | null>(null)

  // Revoking
  const [revokeId, setRevokeId] = useState<string | null>(null)
  const [revokeValue, setRevokeValue] = useState("")
  const [revokeError, setRevokeError] = useState(false)
  const [revoked, setRevoked] = useState<{ name: string; key: number } | null>(null)

  // Creating
  const [name, setName] = useState("")
  const [scope, setScope] = useState<Scope>("deploy:write")
  const [expiry, setExpiry] = useState<Expiry>("90 days")
  const [nameError, setNameError] = useState<ReactNode | null>(null)
  const [created, setCreated] = useState<{
    name: string
    secret: string
    expires: Stamp | null
  } | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const copyTimer = useRef<number | undefined>(undefined)

  // Focus requests run after the render that adds the element.
  const pendingFocus = useRef<string | null>(null)
  useEffect(() => {
    if (pendingFocus.current) {
      document.getElementById(pendingFocus.current)?.focus()
      pendingFocus.current = null
    }
  })

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const revoking = tokens.find((t) => t.id === revokeId) ?? null

  /* Menu */

  function onHeaderKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (menuOpen && e.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  /* Revoke */

  function openRevoke(id: string) {
    if (id !== revokeId) {
      setRevokeId(id)
      setRevokeValue("")
      setRevokeError(false)
    }
    pendingFocus.current = "revoke-confirm"
    // Same row again: the field is already there.
    document.getElementById("revoke-confirm")?.focus()
  }

  function cancelRevoke() {
    const id = revokeId
    setRevokeId(null)
    setRevokeValue("")
    setRevokeError(false)
    if (id) pendingFocus.current = `revoke-${id}`
  }

  function submitRevoke(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!revoking) return
    if (revokeValue.trim() !== revoking.name) {
      setRevokeError(true)
      document.getElementById("revoke-confirm")?.focus()
      return
    }
    setTokens((list) => list.filter((t) => t.id !== revoking.id))
    if (newestId === revoking.id) setNewestId(null)
    setRevokeId(null)
    setRevokeValue("")
    setRevokeError(false)
    setRevoked((prev) => ({ name: revoking.name, key: (prev?.key ?? 0) + 1 }))
    pendingFocus.current = "revoked-message"
  }

  /* Create */

  function submitCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = name.trim()
    let error: ReactNode | null = null
    if (value === "") {
      error = "Enter a name for the token."
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      error = "Use only lowercase letters, numbers and hyphens."
    } else if (value.length > 32) {
      error = "Use 32 characters or fewer."
    } else if (tokens.some((t) => t.name === value)) {
      error = (
        <>
          A token named <span className="font-mono">{value}</span> already
          exists. Choose another name.
        </>
      )
    }
    if (error) {
      setNameError(error)
      document.getElementById("token-name")?.focus()
      return
    }

    const secret = makeSecret()
    const expires = expiryFromToday(expiry)
    const id = `tok-${value}-${Date.now()}`
    setTokens((list) => [
      {
        id,
        name: value,
        prefix: secret.slice(0, 8),
        scope,
        created: day(TODAY.y, TODAY.m, TODAY.d),
        lastUsed: null,
        expires,
      },
      ...list,
    ])
    setNewestId(id)
    setNameError(null)
    setCreated({ name: value, secret, expires })
    setCopyState("idle")
    pendingFocus.current = "created-message"
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
    setScope("deploy:write")
    setExpiry("90 days")
    setNameError(null)
    pendingFocus.current = "token-name"
  }

  /* Render */

  const navLink = (item: (typeof NAV)[number], extra?: string) => (
    <a
      key={item.label}
      href={item.href}
      aria-current={item.current ? "page" : undefined}
      className={cn(
        "font-mono text-label",
        quietLink,
        item.current && currentLink,
        extra
      )}
    >
      {item.label}
    </a>
  )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header
        className="border-b border-border bg-card"
        onKeyDown={onHeaderKeyDown}
      >
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusOutline
            )}
          >
            plinth
          </a>
          <p className={smallFigure}>orrin / orrin-web</p>
          <nav aria-label="Main" className="hidden gap-6 md:flex">
            {NAV.map((item) => navLink(item))}
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonText, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
          <p
            className={cn(smallFigure, "ml-auto hidden wrap-break-word md:block")}
          >
            mara.lind@orrin.example
          </p>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            {NAV.map((item) => navLink(item, "block py-2"))}
          </div>
        </nav>
      </header>

      <main className="py-6">
        <div className={cn(container, "grid grid-cols-1 gap-6 lg:grid-cols-12")}>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-12">
            <h1 className="text-h1">Settings</h1>
          </div>

          <nav
            aria-label="Settings"
            className="lg:sticky lg:top-6 lg:col-span-2 lg:self-start"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:block">
              {SETTINGS_NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      "block py-1 font-sans text-body",
                      quietLink,
                      item.current && currentLink
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

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
              {revoked && (
                <p
                  key={revoked.key}
                  id="revoked-message"
                  tabIndex={-1}
                  className={cn("mt-3 wrap-break-word", codeFocusOutline)}
                >
                  Token <span className="font-mono">{revoked.name}</span>{" "}
                  revoked.
                </p>
              )}
            </div>

            {/* Tokens panel */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-3">
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                  <h3 className={labelHeading}>Tokens</h3>
                  <p className={smallFigure}>{countTokens(tokens.length)}</p>
                </div>
              </div>

              <Table label="API tokens" className="min-w-2xl text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={headCell}>Name</TableHead>
                    <TableHead className={headCell}>Token</TableHead>
                    <TableHead className={headCell}>Scope</TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Created
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Last used
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Expires
                    </TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className={cn(bodyCell, "whitespace-normal")}
                      >
                        No tokens. Create one below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className={bodyCell}>
                          <span className="inline-flex items-center gap-2">
                            <span className="font-mono">{token.name}</span>
                            {token.id === newestId && (
                              <Badge
                                variant="outline"
                                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                              >
                                new
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            bodyCell,
                            "font-mono tabular-nums text-muted-foreground"
                          )}
                        >
                          {token.prefix}…
                        </TableCell>
                        <TableCell className={cn(bodyCell, "font-mono")}>
                          {token.scope}
                        </TableCell>
                        <DateCell stamp={token.created} />
                        <DateCell stamp={token.lastUsed} />
                        <DateCell stamp={token.expires} />
                        <TableCell className={cn(bodyCell, "text-right")}>
                          <Button
                            id={`revoke-${token.id}`}
                            variant="destructive"
                            className={cn(buttonText, "hover:text-foreground")}
                            aria-label={`Revoke ${token.name}`}
                            aria-expanded={revokeId === token.id}
                            aria-controls={
                              revokeId === token.id ? "revoke-panel" : undefined
                            }
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

              {revoking && (
                <div
                  id="revoke-panel"
                  className="border-t border-border px-6 py-4"
                >
                  <form
                    noValidate
                    aria-labelledby="revoke-title"
                    onSubmit={submitRevoke}
                  >
                    <p
                      id="revoke-title"
                      className="font-mono font-bold wrap-break-word"
                    >
                      Revoke {revoking.name}
                    </p>
                    <p className="mt-3 max-w-lg">
                      Scripts that use this token stop working at once. This
                      cannot be undone.
                    </p>
                    <div className="mt-4 max-w-md">
                      <label htmlFor="revoke-confirm" className={fieldLabel}>
                        Type {revoking.name} to confirm
                      </label>
                      <Input
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
                          revokeError ? "revoke-confirm-error" : undefined
                        }
                        className={cn(inputText, "mt-2 font-mono")}
                      />
                      {revokeError && (
                        <ErrorLine id="revoke-confirm-error">
                          Type <span className="font-mono">{revoking.name}</span>{" "}
                          exactly to revoke this token.
                        </ErrorLine>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="submit"
                        variant="destructive"
                        className={cn(buttonText, "hover:text-foreground")}
                      >
                        <TriangleAlert {...icon} />
                        Revoke token
                      </Button>
                      <Button
                        variant="outline"
                        className={buttonText}
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
                <h3 className={labelHeading}>Create a token</h3>
              </div>

              <div className="mt-4">
                {!created && (
                  <form noValidate onSubmit={submitCreate}>
                    <div className="max-w-md">
                      <label htmlFor="token-name" className={fieldLabel}>
                        Name
                      </label>
                      <Input
                        id="token-name"
                        autoComplete="off"
                        spellCheck={false}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setNameError(null)
                        }}
                        aria-invalid={nameError ? true : undefined}
                        aria-describedby={
                          nameError
                            ? "token-name-help token-name-error"
                            : "token-name-help"
                        }
                        className={cn(inputText, "mt-2 font-mono")}
                      />
                      <p id="token-name-help" className={cn(smallFigure, "mt-2")}>
                        Lowercase letters, numbers and hyphens, up to 32
                        characters.
                      </p>
                      {nameError && (
                        <ErrorLine id="token-name-error">{nameError}</ErrorLine>
                      )}
                    </div>

                    <div className="mt-4 max-w-md">
                      <label
                        id="token-scope-label"
                        htmlFor="token-scope"
                        className={fieldLabel}
                      >
                        Scope
                      </label>
                      <Select
                        items={SCOPES}
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
                          {SCOPES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p
                        id="token-scope-help"
                        className={cn(smallFigure, "mt-2")}
                      >
                        {SCOPE_HELP[scope]}
                      </p>
                    </div>

                    <div className="mt-4 max-w-md">
                      <label
                        id="token-expires-label"
                        htmlFor="token-expires"
                        className={fieldLabel}
                      >
                        Expires
                      </label>
                      <Select
                        items={EXPIRIES}
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
                          {EXPIRIES.map((x) => (
                            <SelectItem key={x.value} value={x.value}>
                              {x.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className={cn(buttonText, "mt-6")}>
                      Create token
                    </Button>
                  </form>
                )}

                <div role="status">
                  {created && (
                    <>
                      <p
                        id="created-message"
                        tabIndex={-1}
                        className={cn("wrap-break-word", codeFocusOutline)}
                      >
                        Token <span className="font-mono">{created.name}</span>{" "}
                        created.
                      </p>
                      <p className="mt-3 max-w-lg">
                        Copy it now: it is shown only once, Plinth keeps only a
                        hash of it, and{" "}
                        {created.expires ? (
                          <>
                            it expires on{" "}
                            <time
                              dateTime={created.expires.iso}
                              className="font-mono"
                            >
                              {created.expires.text}
                            </time>
                            .
                          </>
                        ) : (
                          <>it never expires.</>
                        )}
                      </p>
                    </>
                  )}
                </div>

                {created && (
                  <code className="mt-6 block rounded-sm bg-secondary/10 px-2 py-1 font-mono text-body break-all">
                    {created.secret}
                  </code>
                )}

                {created && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className={buttonText}
                      onClick={copySecret}
                    >
                      {copyState === "copied" && <Check {...icon} />}
                      {copyState === "copied"
                        ? "Copied"
                        : copyState === "failed"
                          ? "Copy failed"
                          : "Copy"}
                    </Button>
                    <Button
                      variant="secondary"
                      className={buttonText}
                      onClick={done}
                    >
                      Done
                    </Button>
                  </div>
                )}

                <div role="status" className="sr-only">
                  {copyState === "copied"
                    ? "Copied"
                    : copyState === "failed"
                      ? "Copy failed"
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
