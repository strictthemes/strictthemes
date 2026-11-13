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

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const searchClass =
  "rounded-sm px-2 py-0 text-body md:text-body [&::-webkit-search-cancel-button]:appearance-none"

const headerLinks = ["Guides", "API", "Changelog"]

type NavGroup = { name: string; links: string[] }

const navGroups: NavGroup[] = [
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
      "Rate limits",
      "Errors",
    ],
  },
  {
    name: "Guides",
    links: [
      "Importing a CSV",
      "Sharing a sheet",
      "Syncing with a database",
      "Moving from API v1",
    ],
  },
]

const currentPage = "Authentication"

const sections = [
  { id: "api-keys", title: "API keys" },
  { id: "sending-a-key", title: "Sending a key" },
  { id: "creating-a-key", title: "Creating a key" },
  { id: "errors", title: "Errors" },
]

const curlRequest = `curl https://api.plainsheet.dev/v1/sheets \\
  -H "Authorization: Bearer ps_test_4f8a2c91d7e3b605"`

const curlResponse = `{
  "data": [
    {
      "id": "sh_8KQ2M4",
      "name": "Q3 budget",
      "rows": 214,
      "updated_at": "2026-11-02T09:14:00Z"
    }
  ],
  "has_more": false
}`

const createKeyRequest = `curl https://api.plainsheet.dev/v1/keys \\
  -X POST \\
  -H "Authorization: Bearer ps_live_9b1e7d04a2c6f358" \\
  -d name="Billing export" \\
  -d mode=live \\
  -d "scopes[]=sheets:read"`

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-sm bg-card px-1 font-mono">{children}</code>
}

function SidebarNav({
  query,
  inSheet = false,
}: {
  query: string
  inSheet?: boolean
}) {
  const needle = query.trim().toLowerCase()
  const groups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.links.length > 0)

  return (
    <nav
      aria-label="Documentation"
      className={cn(
        !inSheet &&
          "sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-8 pb-8 lg:col-span-3 lg:block"
      )}
    >
      <div className="flex flex-col gap-8">
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
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block border-l-2 pl-4 text-body underline-offset-4 transition-colors duration-150 hover:underline",
                        focus,
                        inSheet ? "text-sidebar-foreground" : "text-foreground",
                        current
                          ? cn(
                              "font-medium",
                              inSheet
                                ? "border-sidebar-foreground"
                                : "border-foreground"
                            )
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
      </div>
      <p role="status">{groups.length === 0 ? "No pages match" : ""}</p>
    </nav>
  )
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
      await navigator.clipboard.writeText(code)
    } catch {
      next = "failed"
    }
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  const words =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""

  return (
    <div className="my-8 rounded-md border bg-card font-mono text-body">
      <div className="flex items-center gap-4 border-b px-4 py-2">
        <p className={cn(label, "text-muted-foreground")}>{name}</p>
        <span role="status" className="sr-only">
          {words}
        </span>
        <Button
          variant="outline"
          className={cn(buttonClass, "ml-auto")}
          onClick={copy}
        >
          {words || "Copy"}
        </Button>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={regionLabel}
        className="overflow-x-auto p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

type Row = { cells: ReactNode[] }

function DocTable({
  name,
  columns,
  rows,
  monoColumns,
}: {
  name: string
  columns: string[]
  rows: Row[]
  monoColumns: number[]
}) {
  const edge = "first:pl-0 last:pr-0"
  return (
    <div className="my-8 grid gap-2">
      <h3 className={cn(label, "text-foreground")}>{name}</h3>
      <Table label={name} className="min-w-lg text-body tabular-nums">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column}
                scope="col"
                className={cn(label, "text-muted-foreground", edge)}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, r) => (
            <TableRow key={r}>
              {row.cells.map((cell, c) => (
                <TableCell
                  key={c}
                  className={cn(
                    edge,
                    monoColumns.includes(c) && "font-mono",
                    c === row.cells.length - 1 && "whitespace-normal"
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      let next = ids[0]
      if (atEnd) {
        next = ids[ids.length - 1]
      } else {
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= line) next = id
        }
      }
      setActive(next)
    }
    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

const sectionIds = sections.map((section) => section.id)

export function App() {
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)")
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const paragraph = "mt-4 max-w-lg"
  const heading = "mt-16 scroll-mt-8 text-h2"

  return (
    <div className="flex min-h-svh flex-col text-body">
      <header className="border-b">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-4 py-4 md:px-8 lg:gap-8">
          <div className="flex items-baseline gap-2">
            <a
              href="#"
              className={cn(
                "font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                focus
              )}
            >
              Plainsheet
            </a>
            <span className={cn(label, "text-muted-foreground")}>Docs</span>
          </div>
          <nav aria-label="Main" className="hidden gap-8 lg:flex">
            {headerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={cn(
                  label,
                  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                  focus
                )}
              >
                {link}
              </a>
            ))}
          </nav>
          <Input
            type="search"
            aria-label="Search the docs"
            placeholder="Search the docs"
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
              <SheetTitle className="sr-only">Documentation menu</SheetTitle>
              <div className="flex flex-col gap-8">
                <Input
                  type="search"
                  aria-label="Search the docs"
                  placeholder="Search the docs"
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
                          className={cn(
                            label,
                            "text-sidebar-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                            focus
                          )}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <SidebarNav query={query} inSheet />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <SidebarNav query={query} />

          <main className="min-w-0 pt-8 pb-16 lg:col-span-9 lg:col-start-4 xl:col-span-6">
            <p className={cn(label, "text-muted-foreground")}>
              API / Authentication
            </p>
            <h1 className="mt-2 text-h1">Authentication</h1>
            <p className="mt-4 max-w-xl font-sans text-h2 font-normal">
              Every request to the Plainsheet API carries a secret key. This
              page covers how keys work, how to send one, how to make one, and
              what the API answers when a key is wrong.
            </p>

            <section>
              <h2 id="api-keys" className={heading}>
                API keys
              </h2>
              <p className={paragraph}>
                A key belongs to one workspace and acts with the rights of that
                workspace, not of a person. Anyone who holds a key can read and
                change the sheets it reaches, so treat it like a password.
              </p>
              <p className={paragraph}>
                Keys come in two modes. A test key starts with{" "}
                <Code>ps_test_</Code> and only reaches sheets in your test
                workspace. A live key starts with <Code>ps_live_</Code> and
                reaches your real data. Use test keys while you build.
              </p>
              <p className={paragraph}>To make your first key:</p>
              <ol className="mt-4 max-w-lg list-decimal space-y-2 pl-4">
                <li>Open the workspace settings and choose API keys.</li>
                <li>Choose New key and give it a name you will recognise.</li>
                <li>Pick test or live mode, and the scopes the key needs.</li>
                <li>
                  Copy the key straight away. Plainsheet shows it once and
                  stores only a hash of it.
                </li>
              </ol>
              <div className="my-8 flex max-w-lg flex-col gap-2 rounded-md border border-foreground p-4">
                <p className={cn(label, "text-muted-foreground")}>Note</p>
                <p>
                  Never put a live key in code that runs in a browser or an app
                  you ship. Call the API from your own server and keep the key
                  in an environment variable.
                </p>
              </div>
            </section>

            <section>
              <h2 id="sending-a-key" className={heading}>
                Sending a key
              </h2>
              <p className={paragraph}>
                Send the key in the <Code>Authorization</Code> header of every
                request, after the word <Code>Bearer</Code>. All requests go
                over HTTPS to the base address below; plain HTTP is refused.
              </p>
              <p className={cn(paragraph, "wrap-break-word")}>
                <Code>https://api.plainsheet.dev/v1</Code>
              </p>
              <CodeBlock
                name="cURL"
                regionLabel="cURL request"
                code={curlRequest}
              />
              <p className={paragraph}>
                A request with a valid key returns the data it asked for. This
                one lists the sheets the key can read:
              </p>
              <CodeBlock
                name="Response"
                regionLabel="Response body"
                code={curlResponse}
              />
            </section>

            <section>
              <h2 id="creating-a-key" className={heading}>
                Creating a key
              </h2>
              <p className={paragraph}>
                You can also create keys from code with{" "}
                <Code>POST /v1/keys</Code>. The key that makes the request needs
                the <Code>keys:manage</Code> scope, and a test key can only
                create test keys.
              </p>
              <DocTable
                name="Parameters"
                columns={["Name", "Type", "Required", "Description"]}
                monoColumns={[0, 1]}
                rows={[
                  {
                    cells: [
                      "name",
                      "string",
                      "Yes",
                      "A name to tell the key apart from others, up to 64 characters.",
                    ],
                  },
                  {
                    cells: [
                      "mode",
                      "string",
                      "Yes",
                      <>
                        Either <Code>live</Code> or <Code>test</Code>.
                      </>,
                    ],
                  },
                  {
                    cells: [
                      "scopes",
                      "string[]",
                      "No",
                      <>
                        What the key may do: <Code>sheets:read</Code>,{" "}
                        <Code>sheets:write</Code> or <Code>keys:manage</Code>.
                        Defaults to <Code>sheets:read</Code>.
                      </>,
                    ],
                  },
                  {
                    cells: [
                      "expires_at",
                      "string",
                      "No",
                      "An ISO 8601 date after which the key stops working. Leave it out for a key that does not expire.",
                    ],
                  },
                ]}
              />
              <CodeBlock
                name="cURL"
                regionLabel="cURL request to create a key"
                code={createKeyRequest}
              />
              <p className={paragraph}>
                The response holds the new key in its <Code>secret</Code> field.
                It is the only time the API returns it.
              </p>
            </section>

            <section>
              <h2 id="errors" className={heading}>
                Errors
              </h2>
              <p className={paragraph}>
                When a key is missing or wrong, the API answers with a 401 or a
                403 status and a JSON body whose <Code>error.code</Code> says
                what went wrong. Nothing in the workspace changes.
              </p>
              <DocTable
                name="Error codes"
                columns={["Status", "Code", "Description"]}
                monoColumns={[1]}
                rows={[
                  {
                    cells: [
                      "401",
                      "missing_key",
                      "The request has no Authorization header.",
                    ],
                  },
                  {
                    cells: [
                      "401",
                      "invalid_key",
                      "The key does not exist, has expired or was revoked.",
                    ],
                  },
                  {
                    cells: [
                      "403",
                      "insufficient_scope",
                      "The key lacks the scope this endpoint needs.",
                    ],
                  },
                  {
                    cells: [
                      "403",
                      "wrong_mode",
                      "A test key was sent for live data, or the other way round.",
                    ],
                  },
                ]}
              />
              <p className={paragraph}>
                Revoke a key from the workspace settings as soon as you think it
                has leaked. Requests with it fail within a minute.
              </p>
            </section>

            <div className="mt-16 flex justify-between gap-4 border-t pt-8">
              <a
                href="#"
                className={cn(
                  "group flex min-w-0 flex-col gap-2 transition-colors duration-150",
                  focus
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
                  "group ml-auto flex min-w-0 flex-col gap-2 text-right transition-colors duration-150",
                  focus
                )}
              >
                <span className={cn(label, "text-muted-foreground")}>Next</span>
                <span className="font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  Sheets
                </span>
              </a>
            </div>
          </main>

          <nav
            aria-label="On this page"
            className="sticky top-0 hidden self-start pt-8 xl:col-span-3 xl:col-start-10 xl:flex xl:flex-col xl:gap-4"
          >
            <h2 className={cn(label, "text-foreground")}>On this page</h2>
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
                        "block border-l-2 pl-4 transition-colors duration-150",
                        focus,
                        current
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 md:px-8">
          <p className={cn(label, "text-muted-foreground")}>
            © 2026 Plainsheet Labs
          </p>
          <a
            href="#"
            className={cn(
              "text-body text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
              focus
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
