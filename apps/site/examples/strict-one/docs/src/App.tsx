import * as React from "react"

import { CodeBlock } from "@/components/code-block"
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

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"

const headerLinks = ["Guides", "API", "Changelog"]

const sidebarGroups = [
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
      "Importing CSV files",
      "Syncing with a database",
      "Sharing sheets",
      "Testing in sandbox",
    ],
  },
]

const currentPage = "Authentication"

const sections = [
  { id: "api-keys", title: "API keys" },
  { id: "sending-a-key", title: "Sending a key" },
  { id: "create-a-key", title: "Create a key" },
  { id: "errors", title: "Errors" },
]

const curlRequest = `curl https://api.plainsheet.dev/v1/sheets \\
  -H "Authorization: Bearer ps_test_4f9c2a7e81b3d605" \\
  -H "Accept: application/json"`

const keyResponse = `{
  "id": "key_8Jd2LmQ4",
  "name": "Nightly export",
  "environment": "test",
  "scopes": ["sheets:read", "rows:read"],
  "secret": "ps_test_b71e09c4d2a85f36",
  "created_at": "2026-03-12T14:05:00Z",
  "expires_at": null
}`

const errorResponse = `{
  "error": {
    "type": "invalid_key",
    "message": "The API key is not valid for this environment."
  }
}`

const parameters = [
  {
    name: "name",
    type: "string",
    required: "Yes",
    description: "A name you choose, up to 64 characters. Shown in the dashboard.",
  },
  {
    name: "environment",
    type: "string",
    required: "No",
    description: "Either live or test. Defaults to test.",
  },
  {
    name: "scopes",
    type: "array of strings",
    required: "No",
    description:
      "What the key can do, such as sheets:read or rows:write. Defaults to every read scope.",
  },
  {
    name: "expires_at",
    type: "string",
    required: "No",
    description:
      "An ISO 8601 timestamp in UTC after which the key stops working. Leave it out for a key that does not expire.",
  },
]

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm bg-card px-1 font-mono">{children}</code>
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
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search the docs"
      aria-label="Search the docs"
      className={cn("rounded-sm py-0 text-body md:text-body", className)}
    />
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
  const groups = sidebarGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.toLowerCase().includes(term)),
    }))
    .filter((group) => group.links.length > 0)
  const textColor = inSheet ? "text-sidebar-foreground" : "text-foreground"

  return (
    <nav aria-label="Documentation" className={cn("text-body", className)}>
      <p role="status" className={textColor}>
        {groups.length === 0 ? "No pages match" : ""}
      </p>
      {groups.length > 0 && (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <div key={group.name} className="flex flex-col gap-4">
              <p className="font-mono text-label text-muted-foreground uppercase">
                {group.name}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => {
                  const current = link === currentPage
                  return (
                    <li key={link}>
                      <a
                        href="#"
                        aria-current={current ? "page" : undefined}
                        onClick={onNavigate}
                        className={cn(
                          "block border-l-2 pl-4 underline-offset-4 transition-colors duration-150 hover:underline",
                          textColor,
                          current
                            ? "border-foreground font-medium"
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
      )}
    </nav>
  )
}

function useActiveSection() {
  const [active, setActive] = React.useState(sections[0].id)

  React.useEffect(() => {
    function update() {
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      let next = sections[0].id
      if (atEnd) {
        next = sections[sections.length - 1].id
      } else {
        for (const section of sections) {
          const heading = document.getElementById(section.id)
          if (heading && heading.getBoundingClientRect().top <= line) {
            next = section.id
          }
        }
      }
      setActive(next)
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

export function App() {
  const [query, setQuery] = React.useState("")
  const [menuOpen, setMenuOpen] = React.useState(false)
  const active = useActiveSection()

  return (
    <div className="flex min-h-svh flex-col text-body">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-4 py-4 lg:gap-8"
          )}
        >
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
            <span className="font-mono text-label text-muted-foreground uppercase">
              Docs
            </span>
          </div>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex gap-8">
              {headerLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className={cn(
                      "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      focusRing
                    )}
                  >
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
                  className="ml-auto rounded-sm px-4 font-mono text-label uppercase lg:hidden"
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
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "font-mono text-label text-sidebar-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                            focusRing
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

      <div className={cn(container, "flex-1")}>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <SidebarNav
            query={query}
            className="sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-8 pb-8 lg:col-span-3 lg:block"
          />

          <main className="min-w-0 pt-8 pb-16 lg:col-span-9 xl:col-span-6">
            <p className="font-mono text-label text-muted-foreground uppercase">
              API / Authentication
            </p>
            <h1 className="mt-2 text-h1">Authentication</h1>
            <p className="mt-4 max-w-xl font-sans text-h2 font-normal">
              Every request to the Plainsheet API carries a secret key. The key
              says which workspace the request is for and what it may do.
            </p>

            <section>
              <h2 id="api-keys" className="mt-16 scroll-mt-8 text-h2">
                API keys
              </h2>
              <p className="mt-4 max-w-lg">
                A key belongs to one workspace and one environment. Test keys
                start with <InlineCode>ps_test_</InlineCode> and only touch
                sandbox sheets. Live keys start with{" "}
                <InlineCode>ps_live_</InlineCode> and read and write your real
                data.
              </p>
              <p className="mt-4 max-w-lg">
                Each key has a list of scopes. A key with only{" "}
                <InlineCode>sheets:read</InlineCode> can list and read sheets,
                but a request that changes a row fails with a 403.
              </p>
              <div className="my-8 flex flex-col gap-2 rounded-md border border-foreground p-4">
                <p className="font-mono text-label text-muted-foreground uppercase">
                  Note
                </p>
                <p className="max-w-lg">
                  Plainsheet shows a key's secret once, when you create it.
                  Store it in a secrets manager, never in client code or a
                  public repository.
                </p>
              </div>
            </section>

            <section>
              <h2 id="sending-a-key" className="mt-16 scroll-mt-8 text-h2">
                Sending a key
              </h2>
              <p className="mt-4 max-w-lg">
                Send the key in the <InlineCode>Authorization</InlineCode>{" "}
                header with the <InlineCode>Bearer</InlineCode> scheme. The API
                only accepts requests over HTTPS; a request over plain HTTP is
                refused before the key is read.
              </p>
              <CodeBlock label="cURL" name="cURL request" code={curlRequest} />
              <p className="mt-4 max-w-lg">
                Do not put the key in the query string. Query strings end up in
                server logs and browser history.
              </p>
            </section>

            <section>
              <h2 id="create-a-key" className="mt-16 scroll-mt-8 text-h2">
                Create a key
              </h2>
              <p className="mt-4 max-w-lg">
                <InlineCode>POST /v1/keys</InlineCode> creates a key in the
                same workspace as the key that sends the request. The sending
                key needs the <InlineCode>keys:write</InlineCode> scope.
              </p>
              <div className="my-8">
                <Table label="Create a key" className="min-w-lg text-body">
                  <TableHeader>
                    <TableRow>
                      {["Name", "Type", "Required", "Description"].map(
                        (heading) => (
                          <TableHead
                            key={heading}
                            scope="col"
                            className="font-mono text-label text-muted-foreground uppercase first:pl-0 last:pr-0"
                          >
                            {heading}
                          </TableHead>
                        )
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((parameter) => (
                      <TableRow key={parameter.name}>
                        <TableCell className="font-mono first:pl-0 last:pr-0">
                          {parameter.name}
                        </TableCell>
                        <TableCell className="font-mono first:pl-0 last:pr-0">
                          {parameter.type}
                        </TableCell>
                        <TableCell className="first:pl-0 last:pr-0">
                          {parameter.required}
                        </TableCell>
                        <TableCell className="whitespace-normal first:pl-0 last:pr-0">
                          {parameter.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-4 max-w-lg">
                The response holds the new key, with its secret:
              </p>
              <CodeBlock
                label="Response"
                name="Create a key response"
                code={keyResponse}
              />
              <p className="mt-4 max-w-lg">To replace a key without downtime:</p>
              <ol className="mt-4 max-w-lg list-decimal space-y-2 pl-4">
                <li>Create a new key with the same scopes.</li>
                <li>Deploy the new key to every service that uses the old one.</li>
                <li>
                  Check the old key's last use in the dashboard until it stops
                  changing.
                </li>
                <li>
                  Revoke the old key with{" "}
                  <InlineCode>DELETE /v1/keys/:id</InlineCode>.
                </li>
              </ol>
            </section>

            <section>
              <h2 id="errors" className="mt-16 scroll-mt-8 text-h2">
                Errors
              </h2>
              <p className="mt-4 max-w-lg">
                An authentication error returns a JSON body with a{" "}
                <InlineCode>type</InlineCode> you can match on and a{" "}
                <InlineCode>message</InlineCode> meant for people.
              </p>
              <CodeBlock
                label="Response"
                name="Error response"
                code={errorResponse}
              />
              <ul className="mt-4 max-w-lg list-disc space-y-2 pl-4">
                <li>
                  <InlineCode>401 missing_key</InlineCode>: the request has no{" "}
                  <InlineCode>Authorization</InlineCode> header.
                </li>
                <li>
                  <InlineCode>401 invalid_key</InlineCode>: the key does not
                  exist, or it belongs to the other environment.
                </li>
                <li>
                  <InlineCode>401 key_revoked</InlineCode>: the key was revoked
                  or has passed its expiry time.
                </li>
                <li>
                  <InlineCode>403 insufficient_scope</InlineCode>: the key is
                  valid but lacks the scope this endpoint needs.
                </li>
              </ul>
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
                <span className="font-mono text-label text-muted-foreground uppercase">
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
                <span className="font-mono text-label text-muted-foreground uppercase">
                  Next
                </span>
                <span className="font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  Sheets
                </span>
              </a>
            </nav>
          </main>

          <aside className="sticky top-0 hidden self-start pt-8 xl:col-span-3 xl:block">
            <nav aria-labelledby="on-this-page" className="flex flex-col gap-4">
              <h2
                id="on-this-page"
                className="font-mono text-label text-foreground uppercase"
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
                          "block border-l-2 pl-4 font-mono text-label uppercase underline-offset-4 transition-colors duration-150 hover:underline",
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
            </nav>
          </aside>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div
          className={cn(
            container,
            "flex flex-wrap items-baseline justify-between gap-4"
          )}
        >
          <p className="font-mono text-label text-muted-foreground uppercase">
            © 2026 Plainsheet
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
