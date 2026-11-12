import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert, TriangleAlert } from "lucide-react"

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
import { cn } from "@/lib/utils"

type Scope = "read" | "deploy:write" | "admin"
type Expiry = "30" | "90" | "365" | "never"

type Token = {
  id: string
  name: string
  prefix: string
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
const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

const SCOPE_HELP: Record<Scope, string> = {
  read: "Can view deploys, logs and domains, and change nothing.",
  "deploy:write": "Can start, cancel and roll back deploys, and read logs.",
  admin: "Full access, including members, domains, billing and tokens.",
}

const SAMPLE_TOKENS: Token[] = [
  {
    id: "t1",
    name: "ci-deploy",
    prefix: "plt_7Kq2vR9mXa4LpT8sW3nB6cJ1dF5hY0eZ".slice(0, 8),
    scope: "deploy:write",
    created: "2026-08-14",
    lastUsed: "2026-11-11T09:12",
    expires: null,
  },
  {
    id: "t2",
    name: "staging-bot",
    prefix: "plt_Nf3xQ8bH2kW6yR1tM9sL4vC7pD0gJ5aE".slice(0, 8),
    scope: "deploy:write",
    created: "2026-09-02",
    lastUsed: "2026-11-10T17:40",
    expires: "2026-12-01",
  },
  {
    id: "t3",
    name: "metrics-reader",
    prefix: "plt_c5Ds1Pz8jU4oG7rK2wA9eX3iV6nB0mHq".slice(0, 8),
    scope: "read",
    created: "2026-09-19",
    lastUsed: "2026-11-11T08:03",
    expires: "2027-09-19",
  },
  {
    id: "t4",
    name: "mara-laptop",
    prefix: "plt_Wb9Tg2Lx6Yq0Rn4Hs8Fd1Jk5Mc3Vp7Za".slice(0, 8),
    scope: "admin",
    created: "2026-10-30",
    lastUsed: null,
    expires: "2027-01-28",
  },
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const CONTAINER = "mx-auto max-w-[1200px] px-4 md:px-6"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const BUTTON = "px-4 font-mono text-label"
const LABEL_HEADING = "font-mono text-label text-muted-foreground"
const FIELD_LABEL = "block font-mono text-label text-foreground"
const SELECT = cn(
  "mt-2 h-8 w-full rounded-lg border border-input bg-transparent px-2 font-mono text-body aria-invalid:border-destructive",
  FOCUS
)
const HEADER_LINK = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:underline-offset-4",
  FOCUS
)
const TH =
  "px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
const TD = "px-3 py-2 first:pl-6 last:pr-6"

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

function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function addToToday(expiry: Expiry): string | null {
  if (expiry === "never") return null
  const [y, m, d] = TODAY.split("-").map(Number)
  const date =
    expiry === "365"
      ? new Date(Date.UTC(y + 1, m - 1, d))
      : new Date(Date.UTC(y, m - 1, d + Number(expiry)))
  return date.toISOString().slice(0, 10)
}

function makeSecret() {
  let out = ""
  const bytes = new Uint8Array(1)
  while (out.length < 32) {
    crypto.getRandomValues(bytes)
    // 248 is the largest multiple of 62 below 256: no bias.
    if (bytes[0] < 248) out += ALPHABET[bytes[0] % 62]
  }
  return `plt_${out}`
}

function countTokens(n: number) {
  return `${n} ${n === 1 ? "token" : "tokens"}`
}

function DateCell({ value }: { value: string | null }) {
  if (!value) return <span className="font-mono">never</span>
  return (
    <time dateTime={value} className="font-mono tabular-nums">
      {formatDate(value)}
    </time>
  )
}

function ErrorLine({ id, children }: { id: string; children: string }) {
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
  const menuButton = useRef<HTMLButtonElement>(null)

  const [tokens, setTokens] = useState<Token[]>(SAMPLE_TOKENS)
  const [newestId, setNewestId] = useState<string | null>(null)

  // Revoking
  const [revokeId, setRevokeId] = useState<string | null>(null)
  const [revokeText, setRevokeText] = useState("")
  const [revokeError, setRevokeError] = useState(false)
  const [revokedName, setRevokedName] = useState<string | null>(null)
  const revokeButtons = useRef(new Map<string, HTMLButtonElement>())
  const revokeInput = useRef<HTMLInputElement>(null)
  const revokedMessage = useRef<HTMLParagraphElement>(null)

  // Creating
  const [name, setName] = useState("")
  const [scope, setScope] = useState<Scope>("deploy:write")
  const [expiry, setExpiry] = useState<Expiry>("90")
  const [nameError, setNameError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreatedToken | null>(null)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )
  const copyTimer = useRef<number | undefined>(undefined)
  const nameInput = useRef<HTMLInputElement>(null)
  const createdMessage = useRef<HTMLParagraphElement>(null)

  // Focus to move after the next render.
  const focusNext = useRef<(() => HTMLElement | null | undefined) | null>(null)
  useEffect(() => {
    if (focusNext.current) {
      focusNext.current()?.focus()
      focusNext.current = null
    }
  })

  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const revokeToken = tokens.find((t) => t.id === revokeId) ?? null

  function openRevoke(id: string) {
    setRevokeId(id)
    setRevokeText("")
    setRevokeError(false)
    focusNext.current = () => revokeInput.current
  }

  function cancelRevoke() {
    const id = revokeId
    setRevokeId(null)
    setRevokeText("")
    setRevokeError(false)
    if (id) focusNext.current = () => revokeButtons.current.get(id)
  }

  function submitRevoke(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!revokeToken) return
    if (revokeText !== revokeToken.name) {
      setRevokeError(true)
      revokeInput.current?.focus()
      return
    }
    setTokens((list) => list.filter((t) => t.id !== revokeToken.id))
    if (newestId === revokeToken.id) setNewestId(null)
    setRevokeId(null)
    setRevokeText("")
    setRevokeError(false)
    setRevokedName(revokeToken.name)
    focusNext.current = () => revokedMessage.current
  }

  function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let error: string | null = null
    if (name.trim() === "") error = "Enter a name for the token."
    else if (!/^[a-z0-9-]+$/.test(name))
      error = "Use only lowercase letters, numbers and hyphens."
    else if (name.length > 32) error = "Use 32 characters or fewer."
    else if (tokens.some((t) => t.name === name))
      error = `A token named ${name} already exists. Choose another name.`
    if (error) {
      setNameError(error)
      nameInput.current?.focus()
      return
    }
    const secret = makeSecret()
    const expires = addToToday(expiry)
    const id = `t${Date.now()}`
    setTokens((list) => [
      {
        id,
        name,
        prefix: secret.slice(0, 8),
        scope,
        created: TODAY,
        lastUsed: null,
        expires,
      },
      ...list,
    ])
    setNewestId(id)
    setCreated({ name, secret, expires })
    setCopyState("idle")
    focusNext.current = () => createdMessage.current
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
    setExpiry("90")
    setNameError(null)
    focusNext.current = () => nameInput.current
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
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
                  className={cn("font-mono text-label", HEADER_LINK)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className={cn("ml-auto hidden md:block", SMALL_FIGURE)}>
              mara.lind@orrin.example
            </p>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn("ml-auto md:hidden", BUTTON)}
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
          <div className={cn(CONTAINER, "py-2")}>
            {MAIN_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn("block py-2 font-mono text-label", HEADER_LINK)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="py-6">
        <div
          className={cn(CONTAINER, "grid grid-cols-1 gap-6 lg:grid-cols-12")}
        >
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
                    className={cn("block py-1 text-body", HEADER_LINK)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="min-w-0 lg:col-span-10">
            <h2 id="tokens-heading" className="text-h2">
              API tokens
            </h2>
            <p className="mt-3 max-w-lg">
              Tokens let scripts and CI run{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                plinth
              </code>{" "}
              as the team. The CLI reads one from{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                PLINTH_TOKEN
              </code>
              .
            </p>

            <div role="status">
              {revokedName && (
                <p
                  ref={revokedMessage}
                  tabIndex={-1}
                  className={cn("mt-3", FOCUS_CODE)}
                >
                  Token <span className="font-mono">{revokedName}</span>{" "}
                  revoked.
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
                    <TableHead className={TH}>Name</TableHead>
                    <TableHead className={TH}>Token</TableHead>
                    <TableHead className={TH}>Scope</TableHead>
                    <TableHead className={cn(TH, "text-right")}>
                      Created
                    </TableHead>
                    <TableHead className={cn(TH, "text-right")}>
                      Last used
                    </TableHead>
                    <TableHead className={cn(TH, "text-right")}>
                      Expires
                    </TableHead>
                    <TableHead className={cn(TH, "text-right")}>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className={cn(TD, "whitespace-normal")}
                      >
                        No tokens. Create one below.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell className={cn(TD, "font-mono")}>
                          <span className="inline-flex items-center gap-2">
                            {token.name}
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
                          className={cn(TD, "font-mono text-muted-foreground")}
                        >
                          {token.prefix}…
                        </TableCell>
                        <TableCell className={cn(TD, "font-mono")}>
                          {token.scope}
                        </TableCell>
                        <TableCell className={cn(TD, "text-right")}>
                          <DateCell value={token.created} />
                        </TableCell>
                        <TableCell className={cn(TD, "text-right")}>
                          <DateCell value={token.lastUsed} />
                        </TableCell>
                        <TableCell className={cn(TD, "text-right")}>
                          <DateCell value={token.expires} />
                        </TableCell>
                        <TableCell className={cn(TD, "text-right")}>
                          <Button
                            ref={(el: HTMLButtonElement | null) => {
                              if (el) revokeButtons.current.set(token.id, el)
                              else revokeButtons.current.delete(token.id)
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
                    <p id="revoke-title" className="font-mono font-bold">
                      Revoke {revokeToken.name}
                    </p>
                    <p className="mt-3 max-w-lg">
                      Scripts that use this token stop working at once, and this
                      cannot be undone.
                    </p>
                    <div className="mt-4 max-w-md">
                      <label htmlFor="revoke-confirm" className={FIELD_LABEL}>
                        Type {revokeToken.name} to confirm
                      </label>
                      <Input
                        ref={revokeInput}
                        id="revoke-confirm"
                        autoComplete="off"
                        spellCheck={false}
                        value={revokeText}
                        onChange={(e) => {
                          setRevokeText(e.target.value)
                          setRevokeError(false)
                        }}
                        aria-invalid={revokeError || undefined}
                        aria-describedby={
                          revokeError ? "revoke-error" : undefined
                        }
                        className="mt-2 text-body md:text-body"
                      />
                      {revokeError && (
                        <ErrorLine id="revoke-error">
                          {`Type ${revokeToken.name} exactly to revoke this token.`}
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
                        ref={nameInput}
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
                        className="mt-2 text-body md:text-body"
                      />
                      <p
                        id="token-name-help"
                        className={cn("mt-2", SMALL_FIGURE)}
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
                      <select
                        id="token-scope"
                        value={scope}
                        onChange={(e) => setScope(e.target.value as Scope)}
                        aria-describedby="token-scope-help"
                        className={SELECT}
                      >
                        <option value="read">read</option>
                        <option value="deploy:write">deploy:write</option>
                        <option value="admin">admin</option>
                      </select>
                      <p
                        id="token-scope-help"
                        className={cn("mt-2", SMALL_FIGURE)}
                      >
                        {SCOPE_HELP[scope]}
                      </p>
                    </div>
                    <div className="mt-4 max-w-md">
                      <label htmlFor="token-expiry" className={FIELD_LABEL}>
                        Expires
                      </label>
                      <select
                        id="token-expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value as Expiry)}
                        className={SELECT}
                      >
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                        <option value="never">Never</option>
                      </select>
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
                        ref={createdMessage}
                        tabIndex={-1}
                        className={FOCUS_CODE}
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
                    <Button
                      variant="secondary"
                      className={BUTTON}
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
