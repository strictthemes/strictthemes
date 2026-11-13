import { useEffect, useRef, useState, type ReactNode } from "react"

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

const label = "font-mono text-label uppercase"

const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"

const searchClass =
  "rounded-sm px-2 py-0 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"

const headerLinks = ["Guides", "API", "Changelog"]

const navGroups = [
  {
    name: "Get started",
    links: ["Introduction", "Quickstart", "Core concepts", "SDKs"],
  },
  {
    name: "API",
    links: [
      "Authentication",
      "Sheets",
      "Rows",
      "Webhooks",
      "Pagination",
      "Rate limits",
    ],
  },
  {
    name: "Guides",
    links: [
      "Import a CSV",
      "Sync with a database",
      "Build a form",
      "Rotate API keys",
      "Migrate from v1",
    ],
  },
]

const currentPage = "Authentication"

const sections = [
  { id: "api-keys", title: "API keys" },
  { id: "authenticate-a-request", title: "Authenticate a request" },
  { id: "create-a-key", title: "Create a key" },
  { id: "errors", title: "Errors" },
]

const curlRequest = `curl https://api.plainsheet.dev/v1/sheets \\
  -H "Authorization: Bearer ps_live_4f9c2a7e81b3d06c5e2f" \\
  -H "Plainsheet-Version: 2026-09-01"`

const curlResponse = `{
  "object": "list",
  "data": [
    { "id": "sh_8KQ2", "name": "Orders 2026", "rows": 1824 },
    { "id": "sh_9TZ7", "name": "Suppliers", "rows": 1 }
  ],
  "has_more": false
}`

const errorResponse = `{
  "error": {
    "status": 401,
    "code": "invalid_key",
    "message": "The API key is not valid. Check that it is copied in full.",
    "request_id": "req_2b81f0c7"
  }
}`

const createParams = [
  {
    name: "name",
    type: "string",
    required: "Yes",
    description:
      "A name you will recognise later, such as “Billing worker”. Up to 64 characters.",
  },
  {
    name: "scope",
    type: "string",
    required: "Yes",
    description: "Either read or read_write. A read key cannot change rows.",
  },
  {
    name: "workspace_id",
    type: "string",
    required: "No",
    description:
      "Limits the key to one workspace. Without it, the key reaches every workspace you belong to.",
  },
  {
    name: "expires_at",
    type: "string",
    required: "No",
    description:
      "A date and time in ISO 8601. After it, requests with the key fail with key_expired.",
  },
  {
    name: "allowed_ips",
    type: "string[]",
    required: "No",
    description:
      "Addresses or CIDR ranges the key may be used from. Requests from anywhere else fail.",
  },
]

const errors = [
  {
    status: "401",
    code: "missing_key",
    meaning: "The request has no Authorization header.",
  },
  {
    status: "401",
    code: "invalid_key",
    meaning: "The key is malformed, deleted or from another environment.",
  },
  {
    status: "401",
    code: "key_expired",
    meaning: "The key passed its expires_at time. Create a new one.",
  },
  {
    status: "403",
    code: "insufficient_scope",
    meaning: "A read key tried to create, change or delete data.",
  },
  {
    status: "403",
    code: "ip_not_allowed",
    meaning: "The request came from an address outside allowed_ips.",
  },
]

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-sm bg-card px-1 font-mono">{children}</code>
}

function CodeBlock({
  name,
  regionLabel,
  code,
}: {
  name: string
  regionLabel: string
  code: string
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let next: "copied" | "failed" = "copied"
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(code)
    } catch {
      next = "failed"
    }
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  const message =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""

  return (
    <div className="my-8 rounded-md border border-border bg-card font-mono text-body">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <p className={cn(label, "text-muted-foreground")}>{name}</p>
        <span role="status" className="sr-only">
          {message}
        </span>
        <Button variant="outline" className={buttonClass} onClick={copy}>
          {message || "Copy"}
        </Button>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={regionLabel}
        className={cn("overflow-x-auto p-4", focusRing)}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 flex flex-col gap-2 rounded-md border border-foreground p-4">
      <p className={cn(label, "text-muted-foreground")}>Note</p>
      <p className="max-w-lg">{children}</p>
    </div>
  )
}

function SidebarNav({
  query,
  inSheet = false,
  onNavigate,
  className,
}: {
  query: string
  inSheet?: boolean
  onNavigate?: () => void
  className?: string
}) {
  const term = query.trim().toLowerCase()
  const groups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.toLowerCase().includes(term)),
    }))
    .filter((group) => group.links.length > 0)
  const textColor = inSheet ? "text-sidebar-foreground" : "text-foreground"

  return (
    <nav
      aria-label="Documentation"
      className={cn(
        "relative flex flex-col gap-8",
        !inSheet &&
          "sticky top-0 -mx-1 max-h-svh self-start overflow-y-auto px-1 pt-8 pb-8",
        className
      )}
    >
      <p role="status" className="sr-only">
        {groups.length === 0 ? "No pages match" : ""}
      </p>
      {groups.length === 0 && <p className={textColor}>No pages match</p>}
      {groups.map((group) => (
        <div key={group.name} className="flex flex-col gap-4">
          <p className={cn(label, "text-muted-foreground")}>{group.name}</p>
          <ul className="flex flex-col gap-2">
            {group.links.map((link) => {
              const current = link === currentPage
              return (
                <li key={link}>
                  <a
                    href="#"
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "block border-l-2 pl-4 text-body underline-offset-4 transition-colors duration-150 hover:underline",
                      textColor,
                      focusRing,
                      current
                        ? "border-foreground font-medium"
                        : "border-transparent"
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
  )
}

function useActiveSection() {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    function update() {
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      let current = sections[0].id
      if (atEnd) {
        current = sections[sections.length - 1].id
      } else {
        for (const section of sections) {
          const heading = document.getElementById(section.id)
          if (heading && heading.getBoundingClientRect().top <= line) {
            current = section.id
          }
        }
      }
      setActive(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.addEventListener("hashchange", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.removeEventListener("hashchange", update)
    }
  }, [])

  return active
}

export function App() {
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection()

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 64rem)")
    function close() {
      if (wide.matches) setMenuOpen(false)
    }
    wide.addEventListener("change", close)
    return () => wide.removeEventListener("change", close)
  }, [])

  const headerLinkClass = cn(
    label,
    "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
    focusRing
  )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-4 py-4 md:px-8 lg:gap-8">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-h2">Plainsheet</span>
            <span className={cn(label, "text-muted-foreground")}>Docs</span>
          </div>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex gap-8">
              {headerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={headerLinkClass}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Input
            type="search"
            placeholder="Search the docs"
            aria-label="Search the docs"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={cn(searchClass, "ml-auto hidden w-64 lg:block")}
          />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(buttonClass, "ml-auto lg:hidden")}
                />
              }
            >
              Menu
            </SheetTrigger>
            <SheetContent
              side="left"
              className="overflow-y-auto bg-sidebar px-4 pt-16 pb-8 text-body text-sidebar-foreground data-[side=left]:w-64"
            >
              <SheetTitle className="sr-only">Docs navigation</SheetTitle>
              <div className="flex flex-col gap-8">
                <Input
                  type="search"
                  placeholder="Search the docs"
                  aria-label="Search the docs"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className={searchClass}
                />
                <nav aria-label="Main">
                  <ul className="flex flex-col gap-2">
                    {headerLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            headerLinkClass,
                            "text-sidebar-foreground"
                          )}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <SidebarNav
                  query={query}
                  inSheet
                  onNavigate={() => setMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <SidebarNav query={query} className="hidden lg:col-span-3 lg:flex" />

        <main className="min-w-0 pt-8 pb-16 lg:col-span-9 xl:col-span-6">
          <p className={cn(label, "text-muted-foreground")}>
            API / Authentication
          </p>
          <h1 className="mt-2 text-h1">Authentication</h1>
          <p className="mt-4 max-w-xl font-sans text-h2 font-normal">
            Every request to the Plainsheet API carries an API key. The key
            tells us which account is calling and what it is allowed to do.
          </p>

          <section aria-labelledby="api-keys">
            <h2 id="api-keys" className="mt-16 scroll-mt-8 text-h2">
              API keys
            </h2>
            <p className="mt-4 max-w-lg">
              A key belongs to one account and has one scope: read, or read and
              write. Live keys start with <Code>ps_live_</Code> and act on real
              data. Test keys start with <Code>ps_test_</Code> and act on a
              separate copy of your workspace that you can reset at any time.
            </p>
            <p className="mt-4 max-w-lg">
              You see a key in full only once, when you create it. After that,
              the dashboard shows its last four characters, its scope and when
              it was last used.
            </p>
            <Note>
              Keep keys on your server. Anyone who has a key can act as your
              account, so never put one in a browser, a mobile app or a public
              repository.
            </Note>
          </section>

          <section aria-labelledby="authenticate-a-request">
            <h2
              id="authenticate-a-request"
              className="mt-16 scroll-mt-8 text-h2"
            >
              Authenticate a request
            </h2>
            <p className="mt-4 max-w-lg">
              Send the key in the <Code>Authorization</Code> header as a bearer
              token. Requests without it, or over plain HTTP, are refused. This
              request lists the sheets the key can see:
            </p>
            <CodeBlock
              name="cURL"
              regionLabel="cURL request"
              code={curlRequest}
            />
            <p className="mt-4 max-w-lg">
              A valid key returns <Code>200</Code> and the data. The response
              holds only the sheets in the workspaces the key may reach:
            </p>
            <CodeBlock
              name="Response"
              regionLabel="Response body"
              code={curlResponse}
            />
          </section>

          <section aria-labelledby="create-a-key">
            <h2 id="create-a-key" className="mt-16 scroll-mt-8 text-h2">
              Create a key
            </h2>
            <p className="mt-4 max-w-lg">
              Most teams create their first key in the dashboard:
            </p>
            <ol className="mt-4 max-w-lg list-decimal space-y-2 pl-4">
              <li>Open Settings and choose API keys.</li>
              <li>Select New key and give it a name you will recognise.</li>
              <li>Choose a scope. Pick read unless the key must change data.</li>
              <li>Copy the key and store it in your secrets manager.</li>
            </ol>
            <p className="mt-4 max-w-lg">
              To create keys from code, for example one per customer, send{" "}
              <Code>POST /v1/keys</Code> with a read and write key. It takes
              these parameters:
            </p>
            <div className="my-8">
              <Table label="Create a key" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow>
                    {["Name", "Type", "Required", "Description"].map((head) => (
                      <TableHead
                        key={head}
                        scope="col"
                        className={cn(
                          label,
                          "text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {head}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {createParams.map((param) => (
                    <TableRow key={param.name}>
                      <TableCell className="font-mono first:pl-0 last:pr-0">
                        {param.name}
                      </TableCell>
                      <TableCell className="font-mono first:pl-0 last:pr-0">
                        {param.type}
                      </TableCell>
                      <TableCell className="first:pl-0 last:pr-0">
                        {param.required}
                      </TableCell>
                      <TableCell className="whitespace-normal first:pl-0 last:pr-0">
                        {param.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 max-w-lg">
              The response holds the new key in <Code>secret</Code>. It is the
              only time the API returns it.
            </p>
          </section>

          <section aria-labelledby="errors">
            <h2 id="errors" className="mt-16 scroll-mt-8 text-h2">
              Errors
            </h2>
            <p className="mt-4 max-w-lg">
              When a key is missing or cannot be used, the API answers with{" "}
              <Code>401</Code> or <Code>403</Code> and an error object. Log its{" "}
              <Code>request_id</Code>: support can trace a request from it.
            </p>
            <CodeBlock
              name="Response"
              regionLabel="Error response body"
              code={errorResponse}
            />
            <div className="my-8">
              <Table label="Errors" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow>
                    {["Status", "Code", "Meaning"].map((head) => (
                      <TableHead
                        key={head}
                        scope="col"
                        className={cn(
                          label,
                          "text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {head}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error) => (
                    <TableRow key={error.code}>
                      <TableCell className="font-mono first:pl-0 last:pr-0">
                        {error.status}
                      </TableCell>
                      <TableCell className="font-mono first:pl-0 last:pr-0">
                        {error.code}
                      </TableCell>
                      <TableCell className="whitespace-normal first:pl-0 last:pr-0">
                        {error.meaning}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 max-w-lg">
              Do not retry a request that failed with one of these errors: it
              fails the same way until the key or its settings change.
            </p>
          </section>

          <nav
            aria-label="Previous and next page"
            className="mt-16 flex justify-between gap-4 border-t border-border pt-8"
          >
            <a
              href="#"
              className={cn(
                "group flex flex-col gap-2 transition-colors duration-150",
                focusRing
              )}
            >
              <span className={cn(label, "text-muted-foreground")}>
                Previous
              </span>
              <span className="font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                SDKs
              </span>
            </a>
            <a
              href="#"
              className={cn(
                "group ml-auto flex flex-col gap-2 text-right transition-colors duration-150",
                focusRing
              )}
            >
              <span className={cn(label, "text-muted-foreground")}>Next</span>
              <span className="font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                Sheets
              </span>
            </a>
          </nav>
        </main>

        <aside className="hidden xl:col-span-3 xl:flex">
          <nav
            aria-labelledby="on-this-page"
            className="sticky top-0 flex w-full flex-col gap-4 self-start pt-8"
          >
            <h2
              id="on-this-page"
              className={cn(label, "text-foreground")}
            >
              On this page
            </h2>
            <ul className="flex flex-col gap-2">
              {sections.map((section) => {
                const current = section.id === active
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        label,
                        "block border-l-2 pl-4 underline-offset-4 transition-colors duration-150 hover:underline",
                        focusRing,
                        current
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground"
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
      </div>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 md:px-8">
          <p className={cn(label, "text-muted-foreground")}>
            © 2026 Plainsheet Labs
          </p>
          <a
            href="#"
            className={cn(
              "text-body text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
              focusRing
            )}
          >
            Edit this page
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
