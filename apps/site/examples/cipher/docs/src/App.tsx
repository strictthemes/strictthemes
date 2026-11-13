import * as React from "react"
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
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
const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const quietLink =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
const currentLink =
  "text-foreground underline underline-offset-4 transition-colors duration-150"
const inlineCode = "rounded-sm bg-muted px-1 py-0.5 font-mono"
const panelCode = "rounded-sm bg-secondary/10 px-1 py-0.5 font-mono"

const CURRENT_PAGE = "/docs/commands/deploy"

const mainLinks = [
  { name: "Docs", href: "/docs", current: true },
  { name: "Changelog", href: "/changelog", current: false },
  { name: "Pricing", href: "#", current: false },
]

type DocLink = { name: string; href: string; mono?: boolean }

const docGroups: { label: string; links: DocLink[] }[] = [
  {
    label: "Get started",
    links: [
      { name: "Install", href: "/docs/get-started/install" },
      { name: "Quick start", href: "/docs/get-started/quick-start" },
      { name: "Configuration", href: "/docs/get-started/configuration" },
    ],
  },
  {
    label: "Commands",
    links: [
      { name: "plinth init", href: "/docs/commands/init", mono: true },
      { name: "plinth deploy", href: "/docs/commands/deploy", mono: true },
      { name: "plinth logs", href: "/docs/commands/logs", mono: true },
      { name: "plinth rollback", href: "/docs/commands/rollback", mono: true },
      { name: "plinth env", href: "/docs/commands/env", mono: true },
    ],
  },
  {
    label: "Reference",
    links: [
      {
        name: "plinth.toml",
        href: "/docs/reference/plinth-toml",
        mono: true,
      },
      {
        name: "Environment variables",
        href: "/docs/reference/environment-variables",
      },
      { name: "Exit codes", href: "/docs/reference/exit-codes" },
    ],
  },
]

const sections = [
  { id: "usage", title: "Usage" },
  { id: "flags", title: "Flags" },
  { id: "examples", title: "Examples" },
  { id: "exit-codes", title: "Exit codes" },
]

const flags: {
  flag: string
  short: string
  default: string
  description: React.ReactNode
}[] = [
  {
    flag: "--env <name>",
    short: "-e",
    default: "preview",
    description: (
      <>
        The environment to deploy to, as named in{" "}
        <code className={panelCode}>plinth.toml</code>.
      </>
    ),
  },
  {
    flag: "--prebuilt",
    short: "—",
    default: "false",
    description: "Skip the build and upload the output folder as it is.",
  },
  {
    flag: "--message <text>",
    short: "-m",
    default: "—",
    description:
      "A note shown with the deploy. Without it, the message of the latest commit is used.",
  },
  {
    flag: "--wait",
    short: "—",
    default: "false",
    description:
      "Wait until the deploy is ready or has failed, then exit with its code.",
  },
  {
    flag: "--yes",
    short: "-y",
    default: "false",
    description: "Skip the confirmation before a deploy to production.",
  },
  {
    flag: "--json",
    short: "—",
    default: "false",
    description: "Print the result as JSON instead of text.",
  },
  {
    flag: "--token <token>",
    short: "—",
    default: "$PLINTH_TOKEN",
    description: (
      <>
        The access token to use. Without it, the token in{" "}
        <code className={panelCode}>PLINTH_TOKEN</code> is used.
      </>
    ),
  },
]

const exitCodes = [
  { code: "0", meaning: "The deploy is ready." },
  { code: "1", meaning: "The build failed." },
  { code: "2", meaning: "The deploy needs a confirmation." },
  { code: "3", meaning: "The configuration is wrong." },
  { code: "4", meaning: "It timed out while waiting." },
]

type CodeLine = { text: string; comment?: boolean }

function CodeBlock({
  id,
  label,
  lines,
  className,
}: {
  id: string
  label: string
  lines: CodeLine[]
  className?: string
}) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle")
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    const code = lines
      .filter((line) => !line.comment)
      .map((line) => line.text)
      .join("\n")
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(code)
      setState("copied")
    } catch {
      setState("failed")
    }
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  const message =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""

  return (
    <figure
      aria-labelledby={id}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <p id={id} className="font-mono text-label text-muted-foreground">
          {label}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="px-4 font-mono text-label"
          onClick={copy}
        >
          {state === "copied" && (
            <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
          )}
          {state === "idle" ? "Copy" : message}
        </Button>
        <span role="status" className="sr-only">
          {message}
        </span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${label}`}
        className="overflow-x-auto p-4 font-mono text-body focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={cn("block", line.comment && "text-muted-foreground")}
            >
              {line.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}

function useSectionInView(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const line = window.innerHeight / 3
      let current = ids[0]
      for (const id of ids) {
        const heading = document.getElementById(id)
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = id
        }
      }
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      if (atEnd) current = ids[ids.length - 1]
      setActive(current)
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

const sectionIds = sections.map((s) => s.id)

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)
  const active = useSectionInView(sectionIds)

  function onHeaderKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <div className="flex items-baseline gap-2">
            <a
              href="/"
              className={cn(
                "font-heading text-h2 text-foreground transition-colors duration-150",
                focusRing
              )}
            >
              plinth
            </a>
            <p className="font-mono text-label text-muted-foreground">docs</p>
          </div>
          <nav aria-label="Main" className="hidden gap-6 lg:flex">
            {mainLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "font-mono text-label",
                  link.current ? currentLink : quietLink,
                  focusRing
                )}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <a
              href="/deploys"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "px-4 font-mono text-label"
              )}
            >
              Open console
            </a>
          </div>
          <Button
            ref={menuButton}
            variant="outline"
            className="ml-auto px-4 font-mono text-label lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="docs-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="docs-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border lg:hidden"
        >
          <div className={cn(container, "py-2")}>
            {mainLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "block py-2 font-mono text-label",
                  link.current ? currentLink : quietLink,
                  focusRing
                )}
              >
                {link.name}
              </a>
            ))}
            <a
              href="/deploys"
              className={cn(
                "block py-2 font-mono text-label",
                quietLink,
                focusRing
              )}
            >
              Open console
            </a>
            {docGroups.map((group) => (
              <div key={group.label}>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <DocsLink link={link} spacing="py-2" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <div
          className={cn(container, "grid grid-cols-1 gap-6 lg:grid-cols-12")}
        >
          <nav
            aria-label="Docs"
            className="sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-6 pb-6 lg:col-span-3 lg:block"
          >
            {docGroups.map((group, i) => (
              <div key={group.label} className={i > 0 ? "mt-6" : undefined}>
                <p className="font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul className="mt-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <DocsLink link={link} spacing="py-1" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <article className="min-w-0 pt-6 lg:col-span-9 lg:col-start-4 xl:col-span-7">
            <p className="font-mono text-label text-muted-foreground">
              Commands / plinth deploy
            </p>
            <h1 className="mt-2 text-h1">plinth deploy</h1>
            <p className="mt-3 max-w-lg">
              Builds the project in the current folder, uploads it to Plinth and
              gives it its own address. A deploy goes to{" "}
              <span className="font-mono">preview</span> unless you name another
              environment, and the command prints the address once the deploy is
              ready.
            </p>

            <h2 id="usage" className="mt-12 scroll-mt-6 text-h2">
              Usage
            </h2>
            <p className="mt-3 max-w-lg">
              Run it from the root of your project, or pass the folder to
              deploy. Flags come after the path.
            </p>
            <CodeBlock
              id="code-usage"
              label="shell"
              lines={[{ text: "plinth deploy [path] [flags]" }]}
              className="mt-6"
            />
            <p className="mt-6 max-w-lg">
              <code className={inlineCode}>path</code> is the folder to deploy,
              relative to where you run the command. It defaults to{" "}
              <code className={inlineCode}>.</code>, the current folder, and
              must hold a <code className={inlineCode}>plinth.toml</code>.
            </p>

            <h2 id="flags" className="mt-12 scroll-mt-6 text-h2">
              Flags
            </h2>
            <p className="mt-3 max-w-lg">
              Every flag is optional and they can come in any order.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <Table
                label="Flags of plinth deploy"
                className="min-w-xl text-body"
              >
                <TableHeader>
                  <TableRow>
                    {["Flag", "Short", "Default", "Description"].map((name) => (
                      <TableHead
                        key={name}
                        className="px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
                      >
                        {name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((row) => (
                    <TableRow key={row.flag}>
                      <TableCell className="px-3 py-2 font-mono tabular-nums first:pl-6 last:pr-6">
                        {row.flag}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono tabular-nums first:pl-6 last:pr-6">
                        {row.short}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono tabular-nums first:pl-6 last:pr-6">
                        {row.default}
                      </TableCell>
                      <TableCell className="px-3 py-2 whitespace-normal first:pl-6 last:pr-6">
                        {row.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <aside className="mt-6 rounded-xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-mono text-label text-foreground">
                <Info className="size-4" strokeWidth={1.5} aria-hidden="true" />
                note
              </p>
              <p className="mt-2 max-w-lg">
                <code className={panelCode}>--yes</code> skips the confirmation
                before a deploy to <span className="font-mono">production</span>
                . A deploy run with no terminal attached, as in CI, needs it, or
                it stops with exit code <code className={panelCode}>2</code>.
              </p>
            </aside>

            <h2 id="examples" className="mt-12 scroll-mt-6 text-h2">
              Examples
            </h2>
            <p className="mt-3 max-w-lg">
              Deploy the current folder to{" "}
              <span className="font-mono">preview</span> and print its address.
            </p>
            <CodeBlock
              id="code-preview"
              label="deploy a preview"
              lines={[{ text: "plinth deploy" }]}
              className="mt-6"
            />
            <p className="mt-6 max-w-lg">
              Deploy to <span className="font-mono">production</span> from a CI
              job, with no confirmation, and exit only when the deploy is ready
              or has failed.
            </p>
            <CodeBlock
              id="code-production"
              label="deploy to production and wait"
              lines={[
                {
                  text: "# Skip the confirmation and wait for the result",
                  comment: true,
                },
                { text: "plinth deploy --env production --wait --yes" },
              ]}
              className="mt-6"
            />

            <h2 id="exit-codes" className="mt-12 scroll-mt-6 text-h2">
              Exit codes
            </h2>
            <ul className="mt-3">
              {exitCodes.map((item, i) => (
                <li key={item.code} className={i > 0 ? "mt-2" : undefined}>
                  <code className={inlineCode}>{item.code}</code> {item.meaning}
                </li>
              ))}
            </ul>

            <nav
              aria-label="Previous and next"
              className="mt-12 flex flex-wrap justify-between gap-6 border-t border-border pt-6"
            >
              <a
                href="/docs/commands/init"
                className={cn("group block", focusRing)}
              >
                <p className="flex items-center gap-2 font-mono text-label text-muted-foreground">
                  <ArrowLeft
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  Previous
                </p>
                <p className="mt-2 font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  plinth init
                </p>
              </a>
              <a
                href="/docs/commands/logs"
                className={cn("group ml-auto block text-right", focusRing)}
              >
                <p className="flex items-center justify-end gap-2 font-mono text-label text-muted-foreground">
                  Next
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </p>
                <p className="mt-2 font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  plinth logs
                </p>
              </a>
            </nav>
          </article>

          <nav
            aria-label="On this page"
            className="sticky top-0 hidden self-start pt-6 xl:col-span-2 xl:col-start-11 xl:block"
          >
            <p className="font-mono text-label text-muted-foreground">
              On this page
            </p>
            <ul className="mt-2">
              {sections.map((section, i) => (
                <li key={section.id} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${section.id}`}
                    aria-current={
                      active === section.id ? "location" : undefined
                    }
                    className={cn(
                      "font-mono text-label",
                      active === section.id ? currentLink : quietLink,
                      focusRing
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="mt-12 border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-6"
          )}
        >
          <p className="font-mono text-label text-muted-foreground">
            © 2026 Plinth Labs
          </p>
          <nav
            aria-label="Footer"
            className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
          >
            {[
              { name: "Edit this page", href: "#" },
              { name: "Changelog", href: "/changelog" },
              { name: "Status", href: "#" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn("font-mono text-label", quietLink, focusRing)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

function DocsLink({
  link,
  spacing,
}: {
  link: DocLink
  spacing: "py-1" | "py-2"
}) {
  const current = link.href === CURRENT_PAGE
  return (
    <a
      href={link.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "block text-body",
        spacing,
        link.mono && "font-mono",
        current ? currentLink : quietLink,
        focusRing
      )}
    >
      {link.name}
    </a>
  )
}

export default App
