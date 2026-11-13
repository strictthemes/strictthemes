import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
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

const quietLink =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"

const currentLink = "text-foreground underline underline-offset-4"

const buttonClasses = "px-4 font-mono text-label"

type DocLink = { label: string; href: string; command?: boolean }
type DocGroup = { label: string; links: DocLink[] }

const CURRENT_PAGE = "/docs/commands/deploy"

const mainLinks = [
  { label: "Docs", href: "/docs", current: true },
  { label: "Changelog", href: "/changelog", current: false },
  { label: "Pricing", href: "#", current: false },
]

const docGroups: DocGroup[] = [
  {
    label: "Get started",
    links: [
      { label: "Install", href: "/docs/get-started/install" },
      { label: "Quick start", href: "/docs/get-started/quick-start" },
      { label: "Configuration", href: "/docs/get-started/configuration" },
    ],
  },
  {
    label: "Commands",
    links: [
      { label: "plinth init", href: "/docs/commands/init", command: true },
      { label: "plinth deploy", href: "/docs/commands/deploy", command: true },
      { label: "plinth logs", href: "/docs/commands/logs", command: true },
      {
        label: "plinth rollback",
        href: "/docs/commands/rollback",
        command: true,
      },
      { label: "plinth env", href: "/docs/commands/env", command: true },
    ],
  },
  {
    label: "Reference",
    links: [
      {
        label: "plinth.toml",
        href: "/docs/reference/plinth-toml",
        command: true,
      },
      {
        label: "Environment variables",
        href: "/docs/reference/environment-variables",
      },
      { label: "Exit codes", href: "/docs/reference/exit-codes" },
    ],
  },
]

const sections = [
  { id: "usage", label: "Usage" },
  { id: "flags", label: "Flags" },
  { id: "examples", label: "Examples" },
  { id: "exit-codes", label: "Exit codes" },
]

const flags: {
  flag: string
  short: string
  def: string
  description: ReactNode
}[] = [
  {
    flag: "--env <name>",
    short: "-e",
    def: "preview",
    description: (
      <>
        The environment to deploy to, such as{" "}
        <span className="font-mono">preview</span> or{" "}
        <span className="font-mono">production</span>.
      </>
    ),
  },
  {
    flag: "--prebuilt",
    short: "—",
    def: "false",
    description:
      "Upload the build output as it is, without running the build command first.",
  },
  {
    flag: "--message <text>",
    short: "-m",
    def: "—",
    description:
      "A note saved with the deploy. Without it, the message of the latest commit is used.",
  },
  {
    flag: "--wait",
    short: "—",
    def: "false",
    description:
      "Wait until the deploy is ready or has failed, and exit with its result.",
  },
  {
    flag: "--yes",
    short: "-y",
    def: "false",
    description: "Skip the confirmation that comes before a production deploy.",
  },
  {
    flag: "--json",
    short: "—",
    def: "false",
    description: "Print the result as JSON instead of text.",
  },
  {
    flag: "--token <token>",
    short: "—",
    def: "$PLINTH_TOKEN",
    description:
      "The access token to deploy with. Without it, the token in the environment is used.",
  },
]

const exitCodes = [
  { code: "0", meaning: "The deploy is ready." },
  { code: "1", meaning: "The build failed." },
  { code: "2", meaning: "The deploy needs a confirmation." },
  { code: "3", meaning: "The configuration is wrong." },
  { code: "4", meaning: "It timed out while waiting." },
]

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
      {children}
    </code>
  )
}

function PanelCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-secondary/10 px-1 py-0.5 font-mono">
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
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const code = lines.filter((line) => !line.startsWith("#")).join("\n")

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(code)
      setState("copied")
    } catch {
      setState("failed")
    }
    timer.current = window.setTimeout(() => setState("idle"), 2000)
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
        <Button
          variant="outline"
          size="sm"
          className={buttonClasses}
          onClick={copy}
        >
          {state === "copied" && (
            <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
          )}
          {state === "copied"
            ? "Copied"
            : state === "failed"
              ? "Copy failed"
              : "Copy"}
        </Button>
        <span role="status" className="sr-only">
          {state === "copied"
            ? "Copied"
            : state === "failed"
              ? "Copy failed"
              : ""}
        </span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${label}`}
        className="overflow-x-auto p-4 font-mono text-body focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && "\n"}
            {line.startsWith("#") ? (
              <span className="text-muted-foreground">{line}</span>
            ) : (
              line
            )}
          </span>
        ))}
      </pre>
    </figure>
  )
}

function DocLinkList({
  links,
  linkClassName,
}: {
  links: DocLink[]
  linkClassName: string
}) {
  return (
    <ul>
      {links.map((link) => {
        const current = link.href === CURRENT_PAGE
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "block text-body",
                linkClassName,
                link.command && "font-mono",
                current ? currentLink : quietLink,
                focusRing
              )}
            >
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function useSectionInView(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0

    function update() {
      frame = 0
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      if (atEnd) {
        setActive(ids[ids.length - 1])
        return
      }
      let current = ids[0]
      for (const id of ids) {
        const heading = document.getElementById(id)
        if (heading && heading.getBoundingClientRect().top < line) {
          current = id
        }
      }
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

const sectionIds = sections.map((section) => section.id)

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const activeSection = useSectionInView(sectionIds)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
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
          <nav aria-label="Main" className="hidden gap-6 lg:flex">
            {mainLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "font-mono text-label",
                  link.current ? currentLink : quietLink,
                  focusRing
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <a
              href="/deploys"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClasses
              )}
            >
              Open console
            </a>
          </div>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn("ml-auto lg:hidden", buttonClasses)}
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
          <div className="mx-auto max-w-[1200px] px-4 py-2 md:px-6">
            <ul>
              {mainLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "true" : undefined}
                    className={cn(
                      "block py-2 font-mono text-label",
                      link.current ? currentLink : quietLink,
                      focusRing
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
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
              </li>
            </ul>
            {docGroups.map((group) => (
              <div key={group.label}>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <DocLinkList links={group.links} linkClassName="py-2" />
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:grid lg:grid-cols-12 lg:gap-6">
          <nav
            aria-label="Docs"
            className="sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-6 pb-6 lg:col-span-3 lg:block"
          >
            {docGroups.map((group, i) => (
              <div key={group.label} className={cn(i > 0 && "mt-6")}>
                <p className="font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <div className="mt-2">
                  <DocLinkList links={group.links} linkClassName="py-1" />
                </div>
              </div>
            ))}
          </nav>

          <div className="min-w-0 pt-6 lg:col-span-9 xl:col-span-7">
            <p className="font-mono text-label text-muted-foreground">
              Commands / plinth deploy
            </p>
            <h1 className="mt-2 text-h1">plinth deploy</h1>
            <p className="mt-3 max-w-lg">
              <Code>plinth deploy</Code> builds your project, uploads the result
              and gives it an address. Without flags it makes a preview deploy
              that only you and your team can see; with{" "}
              <Code>--env production</Code> it replaces what your visitors see.
            </p>

            <h2 id="usage" className="mt-12 scroll-mt-6 text-h2">
              Usage
            </h2>
            <p className="mt-3 max-w-lg">
              Run it from your project folder, or give it the folder to deploy.
            </p>
            <CodeBlock
              className="mt-6"
              label="shell"
              lines={["plinth deploy [path] [flags]"]}
            />
            <p className="mt-6 max-w-lg">
              <Code>path</Code> is the folder to deploy, and defaults to the
              current one. Plinth reads <Code>plinth.toml</Code> from that
              folder, so the build command and output folder come from there.
            </p>

            <h2 id="flags" className="mt-12 scroll-mt-6 text-h2">
              Flags
            </h2>
            <p className="mt-3 max-w-lg">
              Flags can come before or after the path, and a flag given on the
              command line wins over the same setting in{" "}
              <Code>plinth.toml</Code>.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <Table
                label="Flags of plinth deploy"
                className="min-w-xl text-body"
              >
                <TableHeader>
                  <TableRow>
                    {["Flag", "Short", "Default", "Description"].map((head) => (
                      <TableHead
                        key={head}
                        className="px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
                      >
                        {head}
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
                        {row.def}
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
                <PanelCode>--yes</PanelCode> skips the confirmation before a
                production deploy. A deploy run with no terminal attached, as in
                CI, needs it, or it stops with exit code{" "}
                <span className="font-mono">2</span>.
              </p>
            </aside>

            <h2 id="examples" className="mt-12 scroll-mt-6 text-h2">
              Examples
            </h2>
            <p className="mt-3 max-w-lg">
              Deploy the current folder as a preview and print its address.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy a preview"
              lines={["plinth deploy"]}
            />
            <p className="mt-6 max-w-lg">
              Deploy to production from a script, and exit only once the deploy
              is ready or has failed.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy to production and wait"
              lines={[
                "# Skip the confirmation and wait for the result",
                "plinth deploy --env production --wait --yes",
              ]}
            />

            <h2 id="exit-codes" className="mt-12 scroll-mt-6 text-h2">
              Exit codes
            </h2>
            <ul className="mt-3">
              {exitCodes.map((item, i) => (
                <li key={item.code} className={cn(i > 0 && "mt-2")}>
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
                <span className="flex items-center gap-2 font-mono text-label text-muted-foreground">
                  <ArrowLeft
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  Previous
                </span>
                <p className="mt-2 font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  plinth init
                </p>
              </a>
              <a
                href="/docs/commands/logs"
                className={cn("group ml-auto block text-right", focusRing)}
              >
                <span className="flex items-center justify-end gap-2 font-mono text-label text-muted-foreground">
                  Next
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <p className="mt-2 font-heading text-h2 text-foreground underline-offset-4 group-hover:underline">
                  plinth logs
                </p>
              </a>
            </nav>
          </div>

          <nav
            aria-label="On this page"
            className="sticky top-0 hidden self-start pt-6 xl:col-span-2 xl:block"
          >
            <p className="font-mono text-label text-muted-foreground">
              On this page
            </p>
            <ul className="mt-2">
              {sections.map((section, i) => {
                const current = section.id === activeSection
                return (
                  <li key={section.id} className={cn(i > 0 && "mt-2")}>
                    <a
                      href={`#${section.id}`}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "font-mono text-label transition-colors duration-150",
                        current
                          ? currentLink
                          : "text-muted-foreground hover:text-foreground",
                        focusRing
                      )}
                    >
                      {section.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="mt-12 border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 md:px-6">
          <p className="font-mono text-label text-muted-foreground">
            © 2026 Plinth Labs
          </p>
          <nav
            aria-label="Footer"
            className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
          >
            {[
              { label: "Edit this page", href: "#" },
              { label: "Changelog", href: "/changelog" },
              { label: "Status", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn("font-mono text-label", quietLink, focusRing)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default App
