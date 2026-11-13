import { useEffect, useRef, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { flushSync } from "react-dom"
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

type Scope = "read" | "deploy:write" | "admin"
type Expiry = "30d" | "90d" | "1y" | "never"

type Token = {
  name: string
  secret: string
  scope: Scope
  created: string
  lastUsed: string | null
  expires: string | null
}

type CreatedToken = {
  name: string
  secret: string
  expires: string | null
}

// The fixed sample date: every new token is created on it.
const TODAY = "2026-11-11"

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

const INITIAL_TOKENS: Token[] = [
  {
    name: "ci-deploy",
    secret: "plt_7Kq2mVx9RtB4nLp8ZcW3hYd6FsJ1aGuE",
    scope: "deploy:write",
    created: "2026-08-14",
    lastUsed: "2026-11-11T09:12",
    expires: null,
  },
  {
    name: "staging-bot",
    secret: "plt_Xw5TnR8bQe2LkM7vHj4PzC9sYd3GfA6u",
    scope: "deploy:write",
    created: "2026-09-02",
    lastUsed: "2026-11-10T17:40",
    expires: "2026-12-01",
  },
  {
    name: "metrics-reader",
    secret: "plt_b9ZrE4tLq7NwK2xVm6JpH3sDc8FyG5aU",
    scope: "read",
    created: "2026-09-19",
    lastUsed: "2026-11-11T08:03",
    expires: "2027-09-19",
  },
  {
    name: "mara-laptop",
    secret: "plt_Jd3VuP6kXs9BnQ2wLt7RzM4cHf8GyE5a",
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
  read: "Can read deploys, logs and domains. Cannot change anything.",
  "deploy:write": "Can start and roll back deploys, and read everything.",
  admin: "Can do everything, including members, tokens and billing.",
}

const EXPIRY_ITEMS: { value: Expiry; label: string }[] = [
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y", label: "1 year" },
  { value: "never", label: "Never" },
]

const MAIN_LINKS = [
  { label: "Deploys", href: "/deploys", current: false },
  { label: "Domains", href: "#", current: false },
  { label: "Logs", href: "#", current: false },
  { label: "Settings", href: "/settings/tokens", current: true },
]

const SETTINGS_LINKS = [
  { label: "General", href: "#", current: false },
  { label: "Members", href: "#", current: false },
  { label: "Domains", href: "#", current: false },
  { label: "API tokens", href: "/settings/tokens", current: true },
  { label: "Billing", href: "#", current: false },
]

const FOCUS_VISIBLE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_FROM_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const NAV_LINK =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
const NAV_LINK_CURRENT = "text-foreground underline underline-offset-4"
const SMALL_FIGURE = "font-mono text-label text-muted-foreground tabular-nums"
const BUTTON = "px-4 font-mono text-label"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const LABEL_HEADING = "font-mono text-label text-muted-foreground"
const HEAD_CELL =
  "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
const BODY_CELL = "px-3 py-2 first:pl-6 last:pr-6"
const INLINE_CODE = "rounded-sm bg-muted px-1 py-0.5 font-mono"

function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

function expiryDate(choice: Expiry): string | null {
  if (choice === "never") return null
  const [year, month, day] = TODAY.split("-").map(Number)
  const date =
    choice === "1y"
      ? new Date(Date.UTC(year + 1, month - 1, day))
      : new Date(Date.UTC(year, month - 1, day + (choice === "30d" ? 30 : 90)))
  return date.toISOString().slice(0, 10)
}

function makeSecret() {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  // Bytes from 248 up are thrown away, so every character is as likely.
  const limit = 256 - (256 % alphabet.length)
  let out = ""
  while (out.length < 32) {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    for (const byte of bytes) {
      if (byte < limit && out.length < 32) {
        out += alphabet[byte % alphabet.length]
      }
    }
  }
  return `plt_${out}`
}

function countTokens(n: number) {
  return n === 1 ? "1 token" : `${n} tokens`
}

function DateCell({ value }: { value: string | null }) {
  return (
    <TableCell className={cn(BODY_CELL, "text-right font-mono tabular-nums")}>
      {value ? <time dateTime={value}>{formatDate(value)}</time> : "never"}
    </TableCell>
  )
}

function ErrorLine({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS)
  const [newest, setNewest] = useState<string | null>(null)

  const [revokeTarget, setRevokeTarget] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const [confirmError, setConfirmError] = useState(false)
  const [revoked, setRevoked] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<string | null>(null)
  const [scope, setScope] = useState<Scope>("deploy:write")
  const [expiry, setExpiry] = useState<Expiry>("90d")
  const [created, setCreated] = useState<CreatedToken | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const revokeButtons = useRef(new Map<string, HTMLButtonElement>())
  const confirmFieldRef = useRef<HTMLInputElement>(null)
  const revokedRef = useRef<HTMLParagraphElement>(null)
  const nameFieldRef = useRef<HTMLInputElement>(null)
  const createdRef = useRef<HTMLParagraphElement>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  function openRevoke(tokenName: string) {
    flushSync(() => {
      setRevokeTarget(tokenName)
      setConfirmText("")
      setConfirmError(false)
    })
    confirmFieldRef.current?.focus()
  }

  function cancelRevoke() {
    const tokenName = revokeTarget
    setRevokeTarget(null)
    setConfirmText("")
    setConfirmError(false)
    if (tokenName) revokeButtons.current.get(tokenName)?.focus()
  }

  function submitRevoke(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const tokenName = revokeTarget
    if (!tokenName) return
    if (confirmText !== tokenName) {
      setConfirmError(true)
      confirmFieldRef.current?.focus()
      return
    }
    flushSync(() => {
      setTokens((list) => list.filter((token) => token.name !== tokenName))
      setNewest((current) => (current === tokenName ? null : current))
      setRevokeTarget(null)
      setConfirmText("")
      setConfirmError(false)
      setRevoked(tokenName)
    })
    revokedRef.current?.focus()
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let error: string | null = null
    if (name.trim() === "") {
      error = "Enter a name for the token."
    } else if (!/^[a-z0-9-]+$/.test(name)) {
      error = "Use only lowercase letters, numbers and hyphens."
    } else if (name.length > 32) {
      error = "Use 32 characters or fewer."
    } else if (tokens.some((token) => token.name === name)) {
      error = `A token named ${name} already exists. Choose another name.`
    }
    if (error) {
      setNameError(error)
      nameFieldRef.current?.focus()
      return
    }
    const token: Token = {
      name,
      secret: makeSecret(),
      scope,
      created: TODAY,
      lastUsed: null,
      expires: expiryDate(expiry),
    }
    flushSync(() => {
      setTokens((list) => [token, ...list])
      setNewest(token.name)
      setNameError(null)
      setCreated({
        name: token.name,
        secret: token.secret,
        expires: token.expires,
      })
    })
    createdRef.current?.focus()
  }

  function copyToken() {
    if (!created) return
    window.clearTimeout(copyTimer.current)
    const done = (state: "copied" | "failed") => {
      setCopyState(state)
      copyTimer.current = window.setTimeout(() => setCopyState("idle"), 2000)
    }
    try {
      navigator.clipboard.writeText(created.secret).then(
        () => done("copied"),
        () => done("failed")
      )
    } catch {
      done("failed")
    }
  }

  function finishCreate() {
    window.clearTimeout(copyTimer.current)
    flushSync(() => {
      setCreated(null)
      setCopyState("idle")
      setName("")
      setNameError(null)
      setScope("deploy:write")
      setExpiry("90d")
    })
    nameFieldRef.current?.focus()
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
            <a
              href="/"
              className={cn("font-heading text-h2 text-foreground", FOCUS_VISIBLE)}
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
                    link.current ? NAV_LINK_CURRENT : NAV_LINK,
                    FOCUS_VISIBLE
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
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-2 md:px-6">
            {MAIN_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "block py-2 font-mono text-label",
                  link.current ? NAV_LINK_CURRENT : NAV_LINK,
                  FOCUS_VISIBLE
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="py-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:px-6 lg:grid-cols-12">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:col-span-12">
            <h1 className="text-h1">Settings</h1>
          </div>

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
                      "block py-1 text-body",
                      link.current ? NAV_LINK_CURRENT : NAV_LINK,
                      FOCUS_VISIBLE
                    )}
                  >
                    {link.label}
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
              <code className={INLINE_CODE}>plinth</code> as the team. The
              command reads its token from{" "}
              <code className={INLINE_CODE}>PLINTH_TOKEN</code>.
            </p>

            <div role="status">
              {revoked && (
                <p
                  ref={revokedRef}
                  tabIndex={-1}
                  className={cn("mt-3", FOCUS_FROM_CODE)}
                >
                  Token <span className="font-mono">{revoked}</span> revoked.
                </p>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border px-6 py-3">
                <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                  <h3 className={LABEL_HEADING}>Tokens</h3>
                  <p className={SMALL_FIGURE}>{countTokens(tokens.length)}</p>
                </div>
              </div>

              <Table label="API tokens" className="min-w-2xl text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={HEAD_CELL}>Name</TableHead>
                    <TableHead className={HEAD_CELL}>Token</TableHead>
                    <TableHead className={HEAD_CELL}>Scope</TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Created
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Last used
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      Expires
                    </TableHead>
                    <TableHead className={cn(HEAD_CELL, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className={cn(BODY_CELL, "whitespace-normal")}
                      >
                        No tokens. Create one below.
                      </TableCell>
                    </TableRow>
                  )}
                  {tokens.map((token) => (
                    <TableRow key={token.name}>
                      <TableCell className={cn(BODY_CELL, "font-mono")}>
                        {token.name === newest ? (
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
                          BODY_CELL,
                          "font-mono text-muted-foreground"
                        )}
                      >
                        {token.secret.slice(0, 8)}…
                      </TableCell>
                      <TableCell className={cn(BODY_CELL, "font-mono")}>
                        {token.scope}
                      </TableCell>
                      <DateCell value={token.created} />
                      <DateCell value={token.lastUsed} />
                      <DateCell value={token.expires} />
                      <TableCell className={cn(BODY_CELL, "text-right")}>
                        <Button
                          ref={(node) => {
                            if (node) {
                              revokeButtons.current.set(token.name, node)
                            } else {
                              revokeButtons.current.delete(token.name)
                            }
                          }}
                          variant="destructive"
                          className={cn(BUTTON, "hover:text-foreground")}
                          aria-label={`Revoke ${token.name}`}
                          onClick={() => openRevoke(token.name)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {revokeTarget && (
                <div className="border-t border-border px-6 py-4">
                  <form
                    key={revokeTarget}
                    noValidate
                    aria-labelledby="revoke-title"
                    onSubmit={submitRevoke}
                  >
                    <p id="revoke-title" className="font-mono font-bold">
                      Revoke {revokeTarget}
                    </p>
                    <p className="mt-3 max-w-lg">
                      Scripts using this token stop working at once, and this
                      cannot be undone.
                    </p>
                    <div className="mt-4 max-w-md">
                      <label htmlFor="revoke-confirm" className={FIELD_LABEL}>
                        Type {revokeTarget} to confirm
                      </label>
                      <Input
                        ref={confirmFieldRef}
                        id="revoke-confirm"
                        name="confirm"
                        type="text"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="mt-2 px-2 font-mono text-body md:text-body"
                        value={confirmText}
                        aria-invalid={confirmError ? true : undefined}
                        aria-describedby={
                          confirmError ? "revoke-confirm-error" : undefined
                        }
                        onChange={(event) => {
                          setConfirmText(event.target.value)
                          setConfirmError(false)
                        }}
                      />
                      {confirmError && (
                        <ErrorLine id="revoke-confirm-error">
                          Type {revokeTarget} exactly to revoke this token.
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

            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                <h3 className={LABEL_HEADING}>Create a token</h3>
              </div>

              <div className="mt-4">
                {!created && (
                  <form noValidate onSubmit={submitCreate}>
                    <div className="max-w-md">
                      <label htmlFor="token-name" className={FIELD_LABEL}>
                        Name
                      </label>
                      <Input
                        ref={nameFieldRef}
                        id="token-name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="mt-2 px-2 font-mono text-body md:text-body"
                        value={name}
                        aria-invalid={nameError ? true : undefined}
                        aria-describedby={
                          nameError
                            ? "token-name-help token-name-error"
                            : "token-name-help"
                        }
                        onChange={(event) => {
                          setName(event.target.value)
                          setNameError(null)
                        }}
                      />
                      <p
                        id="token-name-help"
                        className={cn(SMALL_FIGURE, "mt-2")}
                      >
                        Lowercase letters, numbers and hyphens, up to 32
                        characters.
                      </p>
                      {nameError && (
                        <ErrorLine id="token-name-error">{nameError}</ErrorLine>
                      )}
                    </div>

                    <div className="mt-4 max-w-md">
                      <label htmlFor="token-scope" className={FIELD_LABEL}>
                        Scope
                      </label>
                      <Select
                        items={SCOPE_ITEMS}
                        value={scope}
                        onValueChange={(value) => {
                          if (value !== null) setScope(value)
                        }}
                      >
                        <SelectTrigger
                          id="token-scope"
                          className="mt-2 font-mono"
                          aria-describedby="token-scope-help"
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
                      <label htmlFor="token-expires" className={FIELD_LABEL}>
                        Expires
                      </label>
                      <Select
                        items={EXPIRY_ITEMS}
                        value={expiry}
                        onValueChange={(value) => {
                          if (value !== null) setExpiry(value)
                        }}
                      >
                        <SelectTrigger
                          id="token-expires"
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

                    <Button type="submit" className={cn(BUTTON, "mt-6")}>
                      Create token
                    </Button>
                  </form>
                )}

                <div role="status">
                  {created && (
                    <>
                      <p
                        ref={createdRef}
                        tabIndex={-1}
                        className={FOCUS_FROM_CODE}
                      >
                        Token <span className="font-mono">{created.name}</span>{" "}
                        created.
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
                          </>
                        ) : (
                          "never expires"
                        )}
                        .
                      </p>
                      <code className="mt-6 block rounded-sm bg-muted px-2 py-1 font-mono text-body break-all">
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
                      onClick={copyToken}
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
                    <Button
                      variant="secondary"
                      className={BUTTON}
                      onClick={finishCreate}
                    >
                      Done
                    </Button>
                  </div>
                )}

                <span role="status" className="sr-only">
                  {copyState === "copied"
                    ? "Copied"
                    : copyState === "failed"
                      ? "Copy failed"
                      : ""}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
