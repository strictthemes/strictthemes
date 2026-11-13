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
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const headerLinks = ["Guides", "API", "Changelog"]

const navGroups = [
  {
    name: "Get started",
    links: ["Introduction", "Quickstart", "Client libraries", "Rate limits"],
  },
  {
    name: "API",
    links: ["Authentication", "Sheets", "Rows", "Cells", "Webhooks", "Errors"],
  },
  {
    name: "Guides",
    links: [
      "Import a CSV",
      "Sync rows from a database",
      "Paginate large sheets",
      "Use test mode",
    ],
  },
]

const sections = [
  { id: "api-keys", title: "API keys" },
  { id: "sending-a-key", title: "Sending a key" },
  { id: "creating-a-key", title: "Creating a key" },
  { id: "errors", title: "Errors" },
]

const listRequest = `curl https://api.plainsheet.dev/v1/sheets \\
  -H "Authorization: Bearer ps_test_4f9a2c7e1b8d6a30" \\
  -H "Accept: application/json"`

const createRequest = `curl https://api.plainsheet.dev/v1/keys \\
  -X POST \\
  -H "Authorization: Bearer ps_live_9c1e5b72d04a8f36" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Nightly export job",
    "scopes": ["sheets:read", "rows:read"],
    "expires_in_days": 90
  }'`

const createResponse = `{
  "id": "key_7Hq2mN4xR8",
  "name": "Nightly export job",
  "secret": "ps_live_3b8e0f61c92d47a5",
  "scopes": ["sheets:read", "rows:read"],
  "mode": "live",
  "created_at": "2026-11-13T09:42:00Z",
  "expires_at": "2027-02-11T09:42:00Z"
}`

const parameters = [
  {
    name: "name",
    type: "string",
    required: "Yes",
    description:
      "A name for the key, up to 80 characters. Shown in the dashboard and in the audit log.",
  },
  {
    name: "scopes",
    type: "string[]",
    required: "Yes",
    description:
      "What the key may do, such as sheets:read or rows:write. Pass at least one scope.",
  },
  {
    name: "mode",
    type: "string",
    required: "No",
    description:
      "live or test. Defaults to the mode of the key that sends the request.",
  },
  {
    name: "expires_in_days",
    type: "integer",
    required: "No",
    description:
      "Days until the key stops working, from 1 to 365. Leave it out for a key that does not expire.",
  },
  {
    name: "sheet_ids",
    type: "string[]",
    required: "No",
    description:
      "Limits the key to these sheets. Leave it out to give the key every sheet in the workspace.",
  },
]

const errors = [
  {
    status: "401",
    code: "missing_key",
    meaning: "The request has no Authorization header, or the header is empty.",
  },
  {
    status: "401",
    code: "invalid_key",
    meaning:
      "The key does not exist, was revoked, or has expired. Check the key in the dashboard.",
  },
  {
    status: "403",
    code: "insufficient_scope",
    meaning:
      "The key is valid but lacks the scope this endpoint needs. The error names the missing scope.",
  },
  {
    status: "403",
    code: "mode_mismatch",
    meaning: "A test key was used on live data, or a live key on test data.",
  },
  {
    status: "429",
    code: "rate_limited",
    meaning:
      "The key sent more than 120 requests in a minute. Wait for the time in the Retry-After header.",
  },
]

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-card px-1 font-mono wrap-break-word">
      {children}
    </code>
  )
}

function CodeBlock({
  name,
  ariaLabel,
  code,
}: {
  name: string
  ariaLabel: string
  code: string
}) {
  const [status, setStatus] = useState<"" | "Copied" | "Copy failed">("")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let result: "Copied" | "Copy failed"
    try {
      await navigator.clipboard.writeText(code)
      result = "Copied"
    } catch {
      result = "Copy failed"
    }
    setStatus(result)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus(""), 2000)
  }

  return (
    <div className="my-8 rounded-md border bg-card font-mono text-body">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-2">
        <p className={cn(label, "text-muted-foreground")}>{name}</p>
        <span role="status" className="sr-only">
          {status}
        </span>
        <Button variant="outline" className={buttonClass} onClick={copy}>
          {status || "Copy"}
        </Button>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        className="overflow-x-auto p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
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

function SearchField({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <Input
      type="search"
      placeholder="Search the docs"
      aria-label="Search the docs"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(searchClass, className)}
    />
  )
}

function SidebarNav({ query, inSheet }: { query: string; inSheet?: boolean }) {
  const term = query.trim().toLowerCase()
  const groups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.toLowerCase().includes(term)),
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
                const current = link === "Authentication"
                return (
                  <li key={link}>
                    <a
                      href="#"
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block border-l-2 pl-4 text-body underline-offset-4 transition-colors duration-150 hover:underline",
                        inSheet ? "text-sidebar-foreground" : "text-foreground",
                        current
                          ? cn(
                              "font-medium",
                              inSheet
                                ? "border-sidebar-foreground"
                                : "border-foreground"
                            )
                          : "border-transparent",
                        focusRing
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
      <p
        role="status"
        className={inSheet ? "text-sidebar-foreground" : undefined}
      >
        {groups.length === 0 ? "No pages match" : ""}
      </p>
    </nav>
  )
}

function useActiveSection() {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    function update() {
      const line = window.innerHeight / 3
      let current = sections[0].id
      for (const section of sections) {
        const heading = document.getElementById(section.id)
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = section.id
        }
      }
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      if (atEnd) current = sections[sections.length - 1].id
      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return active
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mt-16 scroll-mt-8 text-h2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 max-w-lg">{children}</p>
}

export function App() {
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection()

  useEffect(() => {
    const media = window.matchMedia("(min-width: 64rem)")
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  const headerLink = cn(
    label,
    "underline-offset-4 transition-colors duration-150 hover:underline",
    focusRing
  )

  return (
    <div className="flex min-h-svh flex-col text-body">
      <header className="border-b">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4 py-4 lg:gap-8">
            <div className="flex items-baseline gap-2">
              <a
                href="#"
                className={cn(
                  "font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                  focusRing
                )}
              >
                Plainsheet
              </a>
              <span className={cn(label, "text-muted-foreground")}>Docs</span>
            </div>
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex gap-8">
                {headerLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className={cn(headerLink, "text-foreground")}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <SearchField
              value={query}
              onChange={setQuery}
              className="ml-auto hidden w-64 lg:block"
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
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-8">
                  <SearchField value={query} onChange={setQuery} />
                  <nav aria-label="Main">
                    <ul className="flex flex-col gap-2">
                      {headerLinks.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className={cn(
                              headerLink,
                              "text-sidebar-foreground"
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
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 md:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <SidebarNav query={query} />

          <main className="min-w-0 pt-8 pb-16 lg:col-span-9 xl:col-span-6">
            <p className={cn(label, "text-muted-foreground")}>
              API / Authentication
            </p>
            <h1 className="mt-2 text-h1">Authentication</h1>
            <p className="mt-4 max-w-xl font-sans text-h2 font-normal">
              Every request to the Plainsheet API carries a secret key. This
              page covers what a key can do, how to send it, and what the API
              returns when a key is missing or wrong.
            </p>

            <Section id="api-keys" title="API keys">
              <P>
                A key belongs to one workspace and acts with the scopes you give
                it. Live keys start with <Code>ps_live_</Code> and change real
                sheets. Test keys start with <Code>ps_test_</Code> and work on a
                copy of your workspace that resets every Sunday.
              </P>
              <P>To create your first key in the dashboard:</P>
              <ol className="mt-4 max-w-lg list-decimal space-y-2 pl-4">
                <li>Open Settings, then API keys.</li>
                <li>
                  Choose New key and give it a name you will recognise later.
                </li>
                <li>Pick the scopes the key needs, and nothing more.</li>
                <li>
                  Copy the secret. The dashboard shows it once; after that only
                  its last four characters.
                </li>
              </ol>
              <Note>
                Keep keys on your server. A key in a browser script or a mobile
                app can be read by anyone who opens it.
              </Note>
            </Section>

            <Section id="sending-a-key" title="Sending a key">
              <P>
                Send the key in the <Code>Authorization</Code> header as a
                bearer token, on every request. The API does not accept keys in
                the query string, so they stay out of server logs.
              </P>
              <CodeBlock
                name="cURL"
                ariaLabel="cURL request"
                code={listRequest}
              />
              <P>
                All requests go to <Code>https://api.plainsheet.dev/v1</Code>{" "}
                over HTTPS. A request over plain HTTP is refused before the key
                is read.
              </P>
            </Section>

            <Section id="creating-a-key" title="Creating a key">
              <P>
                You can also create keys from code with{" "}
                <Code>POST /v1/keys</Code>. The key that sends the request needs
                the <Code>keys:write</Code> scope, and the new key cannot have a
                scope the sending key lacks.
              </P>
              <div className="my-8 grid gap-2">
                <h3 className={cn(label, "text-foreground")}>Parameters</h3>
                <Table label="Parameters" className="min-w-lg text-body">
                  <TableHeader>
                    <TableRow>
                      {["Name", "Type", "Required", "Description"].map(
                        (head) => (
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
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((param) => (
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
              <CodeBlock
                name="cURL"
                ariaLabel="cURL request to create a key"
                code={createRequest}
              />
              <P>
                The response holds the new key's <Code>secret</Code>. It is
                returned only here, so store it before you do anything else.
              </P>
              <CodeBlock
                name="Response"
                ariaLabel="Response"
                code={createResponse}
              />
            </Section>

            <Section id="errors" title="Errors">
              <P>
                When a key is the problem, the API answers with a 401 or 403
                status and a JSON body whose <Code>error.code</Code> says what
                went wrong. Nothing in the sheet changes.
              </P>
              <div className="my-8 grid gap-2">
                <h3 className={cn(label, "text-foreground")}>Error codes</h3>
                <Table label="Error codes" className="min-w-lg text-body">
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
              <P>
                Retry a 429 after the wait it names. Do not retry a 401 or 403
                with the same key: fix the key or its scopes first.
              </P>
            </Section>

            <div className="mt-16 flex justify-between gap-4 border-t pt-8">
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
                  Rate limits
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
            </div>
          </main>

          <aside className="sticky top-0 hidden self-start pt-8 xl:col-span-3 xl:block">
            <div className="flex flex-col gap-4">
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
                          "block border-l-2 pl-4 transition-colors duration-150 hover:text-foreground",
                          current
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground",
                          focusRing
                        )}
                      >
                        {section.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-baseline justify-between gap-4 px-4 md:px-8">
          <p className={cn(label, "text-muted-foreground")}>
            © 2026 Plainsheet Ltd
          </p>
          <a href="#" className={cn(textLink, "text-body")}>
            Edit this page
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
