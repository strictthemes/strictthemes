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

const quietLink = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusRing
)

const currentLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150",
  focusRing
)

const buttonText = "px-4 font-mono text-label"

type NavLink = {
  name: string
  href: string
  current?: boolean
}

const navLinks: NavLink[] = [
  { name: "Docs", href: "/docs", current: true },
  { name: "Changelog", href: "/changelog" },
  { name: "Pricing", href: "#" },
]

type DocLink = {
  name: string
  href: string
  command?: boolean
  current?: boolean
}

type DocGroup = {
  label: string
  links: DocLink[]
}

const docGroups: DocGroup[] = [
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
      { name: "plinth init", href: "/docs/commands/init", command: true },
      {
        name: "plinth deploy",
        href: "/docs/commands/deploy",
        command: true,
        current: true,
      },
      { name: "plinth logs", href: "/docs/commands/logs", command: true },
      {
        name: "plinth rollback",
        href: "/docs/commands/rollback",
        command: true,
      },
      { name: "plinth env", href: "/docs/commands/env", command: true },
    ],
  },
  {
    label: "Reference",
    links: [
      {
        name: "plinth.toml",
        href: "/docs/reference/plinth-toml",
        command: true,
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
  { id: "usage", name: "Usage" },
  { id: "flags", name: "Flags" },
  { id: "examples", name: "Examples" },
  { id: "exit-codes", name: "Exit codes" },
]

const footerLinks: NavLink[] = [
  { name: "Edit this page", href: "#" },
  { name: "Changelog", href: "/changelog" },
  { name: "Status", href: "#" },
]

type Flag = {
  flag: string
  short: string
  fallback: string
  description: React.ReactNode
}

const flags: Flag[] = [
  {
    flag: "--env <name>",
    short: "-e",
    fallback: "preview",
    description: (
      <>
        The environment to deploy to: <Code>preview</Code>,{" "}
        <Code>production</Code> or one you have added with{" "}
        <Code>plinth env</Code>.
      </>
    ),
  },
  {
    flag: "--prebuilt",
    short: "—",
    fallback: "false",
    description: (
      <>
        Skips the build and uploads the output folder as it is on your
        machine.
      </>
    ),
  },
  {
    flag: "--message <text>",
    short: "-m",
    fallback: "—",
    description: (
      <>
        A note shown beside the deploy in the console. Without it, the
        message of the last commit is used.
      </>
    ),
  },
  {
    flag: "--wait",
    short: "—",
    fallback: "false",
    description: (
      <>
        Keeps the command running until the deploy is ready or has failed,
        for up to <Code>10m</Code>.
      </>
    ),
  },
  {
    flag: "--yes",
    short: "-y",
    fallback: "false",
    description: <>Answers yes to the confirmation before a production deploy.</>,
  },
  {
    flag: "--json",
    short: "—",
    fallback: "false",
    description: (
      <>Prints the result as one JSON object and nothing else.</>
    ),
  },
  {
    flag: "--token <token>",
    short: "—",
    fallback: "$PLINTH_TOKEN",
    description: (
      <>
        The access token to deploy with. It needs the{" "}
        <Code>deploy:write</Code> scope.
      </>
    ),
  },
]

const exitCodes = [
  { code: "0", meaning: "the deploy is ready" },
  { code: "1", meaning: "the build failed" },
  { code: "2", meaning: "the deploy needs a confirmation" },
  { code: "3", meaning: "the configuration is wrong" },
  { code: "4", meaning: "it timed out while waiting" },
]

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
      {children}
    </code>
  )
}

type CopyState = "idle" | "copied" | "failed"

function CodeBlock({
  label,
  lines,
  className,
}: {
  label: string
  lines: string[]
  className?: string
}) {
  const [state, setState] = React.useState<CopyState>("idle")
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timer.current)
    }
  }, [])

  async function copy() {
    const code = lines.filter((line) => !line.startsWith("#")).join("\n")
    let next: CopyState = "copied"
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      next = "failed"
    }
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setState("idle")
    }, 2000)
  }

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className="font-mono text-label text-muted-foreground">
          {label}
        </figcaption>
        <div className="flex items-center">
          <span role="status" className="sr-only">
            {state === "copied" && "Copied"}
            {state === "failed" && "Copy failed"}
          </span>
          <Button
            variant="outline"
            size="sm"
            className={buttonText}
            onClick={copy}
          >
            {state === "idle" && "Copy"}
            {state === "copied" && (
              <>
                <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
                Copied
              </>
            )}
            {state === "failed" && "Copy failed"}
          </Button>
        </div>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${label}`}
        className="overflow-x-auto p-4 font-mono text-body text-foreground focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <code>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              {index > 0 && "\n"}
              {line.startsWith("#") ? (
                <span className="text-muted-foreground">{line}</span>
              ) : (
                line
              )}
            </React.Fragment>
          ))}
        </code>
      </pre>
    </figure>
  )
}

function useSectionInView() {
  const [active, setActive] = React.useState(sections[0].id)

  React.useEffect(() => {
    function update() {
      const line = window.innerHeight / 3
      let current = sections[0].id
      for (const section of sections) {
        const heading = document.getElementById(section.id)
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = section.id
        }
      }
      const page = document.documentElement
      const scrollable = page.scrollHeight > window.innerHeight
      const atEnd = window.innerHeight + window.scrollY >= page.scrollHeight - 1
      if (scrollable && atEnd) {
        current = sections[sections.length - 1].id
      }
      setActive(current)
    }

    const frame = window.requestAnimationFrame(update)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return active
}

export function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)
  const active = useSectionInView()

  React.useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <div className="flex items-baseline gap-2">
            <a
              href="/"
              className={cn("font-heading text-h2 text-foreground", focusRing)}
            >
              plinth
            </a>
            <span className="font-mono text-label text-muted-foreground">
              docs
            </span>
          </div>
          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "font-mono text-label",
                  link.current ? currentLink : quietLink
                )}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <a
              href="/deploys"
              className={cn(buttonVariants({ variant: "outline" }), buttonText)}
            >
              Open console
            </a>
          </div>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonText, "ml-auto lg:hidden")}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="site-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border lg:hidden"
        >
          <div className={cn(container, "py-2")}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "block py-2 font-mono text-label",
                  link.current ? currentLink : quietLink
                )}
              >
                {link.name}
              </a>
            ))}
            <a
              href="/deploys"
              className={cn("block py-2 font-mono text-label", quietLink)}
            >
              Open console
            </a>
            {docGroups.map((group) => (
              <React.Fragment key={group.label}>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        aria-current={link.current ? "page" : undefined}
                        className={cn(
                          "block py-2 text-body",
                          link.command && "font-mono",
                          link.current ? currentLink : quietLink
                        )}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <div className={cn(container, "grid grid-cols-1 gap-6 lg:grid-cols-12")}>
          <nav
            aria-label="Docs"
            className="sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-6 pb-6 lg:col-span-3 lg:block"
          >
            {docGroups.map((group, index) => (
              <div key={group.label} className={cn(index > 0 && "mt-6")}>
                <p className="font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul className="mt-2">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        aria-current={link.current ? "page" : undefined}
                        className={cn(
                          "block py-1 text-body",
                          link.command && "font-mono",
                          link.current ? currentLink : quietLink
                        )}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <article className="min-w-0 pt-6 lg:col-span-9 xl:col-span-7">
            <p className="font-mono text-label text-muted-foreground">
              Commands / plinth deploy
            </p>
            <h1 className="mt-2 text-h1">plinth deploy</h1>
            <p className="mt-3 max-w-lg">
              Builds the project in the current folder, uploads the result and
              gives it an address of its own. A deploy goes to the{" "}
              <span className="font-mono">preview</span> environment unless you
              name another one.
            </p>

            <h2 id="usage" className="mt-12 scroll-mt-6 text-h2">
              Usage
            </h2>
            <p className="mt-3 max-w-lg">
              Run the command from the root of the project, where{" "}
              <Code>plinth.toml</Code> is.
            </p>
            <CodeBlock
              className="mt-6"
              label="shell"
              lines={["plinth deploy [path] [flags]"]}
            />
            <p className="mt-6 max-w-lg">
              <Code>path</Code> is the folder to deploy, and it must hold a{" "}
              <Code>plinth.toml</Code>. Leave it out to deploy the current
              folder; write <Code>./apps/web</Code> to deploy one app of a
              monorepo.
            </p>

            <h2 id="flags" className="mt-12 scroll-mt-6 text-h2">
              Flags
            </h2>
            <p className="mt-3 max-w-lg">
              Every flag is optional, and a flag on the command line wins over
              the same setting in <Code>plinth.toml</Code>.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <Table label="Flags of plinth deploy" className="min-w-xl text-body">
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
                        {row.fallback}
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
                <Code>--yes</Code> skips the confirmation that comes before a
                production deploy. A deploy run with no terminal attached, as
                in CI, cannot ask: it needs <Code>--yes</Code> or stops with
                exit code <span className="font-mono">2</span>.
              </p>
            </aside>

            <h2 id="examples" className="mt-12 scroll-mt-6 text-h2">
              Examples
            </h2>
            <p className="mt-3 max-w-lg">
              With no flags, the command deploys the current folder to a
              preview and prints its address.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy a preview"
              lines={["plinth deploy"]}
            />
            <p className="mt-6 max-w-lg">
              In CI, name the environment, wait for the result and answer the
              confirmation ahead of time.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy to production and wait"
              lines={[
                "# exits with 0 only when the deploy is ready",
                "plinth deploy --env production --wait --yes",
              ]}
            />

            <h2 id="exit-codes" className="mt-12 scroll-mt-6 text-h2">
              Exit codes
            </h2>
            <ul className="mt-3">
              {exitCodes.map((item, index) => (
                <li key={item.code} className={cn(index > 0 && "mt-2")}>
                  <Code>{item.code}</Code> {item.meaning}
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
            className="sticky top-0 hidden self-start pt-6 xl:col-span-2 xl:block"
          >
            <p className="font-mono text-label text-muted-foreground">
              On this page
            </p>
            <ul className="mt-2">
              {sections.map((section, index) => {
                const current = section.id === active
                return (
                  <li key={section.id} className={cn(index > 0 && "mt-2")}>
                    <a
                      href={`#${section.id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "font-mono text-label",
                        current ? currentLink : quietLink
                      )}
                    >
                      {section.name}
                    </a>
                  </li>
                )
              })}
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
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn("font-mono text-label", quietLink)}
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

export default App
