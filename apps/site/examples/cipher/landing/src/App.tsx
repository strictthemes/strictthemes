import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  Check,
  GitBranch,
  KeyRound,
  ScrollText,
  Undo2,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const quietLink = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const buttonText = "px-4 font-mono text-label"
const quickStart = "/docs/get-started/quick-start"
const installCommand = "curl -fsSL https://plinth.example/install.sh | sh"

const configFile = `# plinth.toml
name = "orrin-web"
build = "npm run build"
output = "dist"

[env.production]
branch = "main"
domain = "orrin.example"

[env.preview]
branch = "*"`

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">{children}</code>
  )
}

function CodeBlock({
  id,
  label,
  code,
  className,
  children,
}: {
  id: string
  label: string
  code: string
  className?: string
  children: ReactNode
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  )
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(code)
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
    timer.current = window.setTimeout(() => setCopyState("idle"), 2000)
  }

  const message =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy failed"
        : ""

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
          className={buttonText}
          onClick={copy}
        >
          {copyState === "copied" ? (
            <>
              <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Copied
            </>
          ) : copyState === "failed" ? (
            "Copy failed"
          ) : (
            "Copy"
          )}
        </Button>
        <span role="status" className="sr-only">
          {message}
        </span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${label}`}
        className="overflow-x-auto p-4 font-mono text-body focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        {children}
      </pre>
    </figure>
  )
}

function Lines({ lines }: { lines: ReactNode[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 ? "\n" : null}
        </span>
      ))}
    </>
  )
}

function Key({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>
}

const configLines: ReactNode[] = [
  <span className="text-muted-foreground"># plinth.toml</span>,
  <>
    <Key>name</Key> = "orrin-web"
  </>,
  <>
    <Key>build</Key> = "npm run build"
  </>,
  <>
    <Key>output</Key> = "dist"
  </>,
  "",
  "[env.production]",
  <>
    <Key>branch</Key> = "main"
  </>,
  <>
    <Key>domain</Key> = "orrin.example"
  </>,
  "",
  "[env.preview]",
  <>
    <Key>branch</Key> = "*"
  </>,
]

const terminalLines: ReactNode[] = [
  <>
    <span className="text-muted-foreground">$</span>{" "}
    <span className="text-foreground">plinth deploy</span>
  </>,
  <span className="text-muted-foreground">{"  reading plinth.toml"}</span>,
  <span className="text-muted-foreground">
    {"  building orrin-web  commit 8f3c2a1  branch feat/search"}
  </span>,
  <span className="text-muted-foreground">
    {"  uploading 214 files  4.1 MB"}
  </span>,
  <>
    {"  "}
    <span className="text-success">ready</span>
    {"  "}
    <span className="text-foreground">
      https://feat-search.orrin-web.plinth.example
    </span>
    {"  "}
    <span className="text-muted-foreground">in 38s</span>
  </>,
  <>
    <span className="text-muted-foreground">$</span>{" "}
    <span
      aria-hidden="true"
      className="inline-block h-3 w-2 bg-primary align-middle"
    />
  </>,
]

const features: {
  icon: LucideIcon
  title: string
  body: ReactNode
}[] = [
  {
    icon: GitBranch,
    title: "A preview for every branch",
    body: (
      <>
        Run <InlineCode>plinth deploy</InlineCode> on any branch and it gets an
        address of its own, named after the branch. Deploys from{" "}
        <span className="font-mono">main</span> go to production.
      </>
    ),
  },
  {
    icon: Undo2,
    title: "Roll back in one command",
    body: (
      <>
        Run <InlineCode>plinth rollback</InlineCode> and the previous deploy is
        back at the same address in seconds. Nothing is rebuilt.
      </>
    ),
  },
  {
    icon: KeyRound,
    title: "Secrets outside the repo",
    body: (
      <>
        Store API keys and tokens with <InlineCode>plinth env set</InlineCode>,
        one environment at a time. The build reads them as environment
        variables, and they never enter your Git history.
      </>
    ),
  },
  {
    icon: ScrollText,
    title: "Logs as they happen",
    body: (
      <>
        Watch a deploy's build and runtime logs arrive in your terminal with{" "}
        <InlineCode>plinth logs --follow</InlineCode>, until you stop it.
      </>
    ),
  },
]

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const navLinks = [
    { href: "/docs", label: "Docs" },
    { href: "/changelog", label: "Changelog" },
    { href: "#", label: "Pricing" },
  ]

  return (
    <header
      className="border-b border-border"
      onKeyDown={(event) => {
        if (menuOpen && event.key === "Escape") {
          setMenuOpen(false)
          menuButton.current?.focus()
        }
      }}
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
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={quietLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a href="#" className={quietLink}>
            Sign in
          </a>
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
          className={cn(buttonText, "ml-auto md:hidden")}
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
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn("block py-2", quietLink)}
            >
              {link.label}
            </a>
          ))}
          <a href="#" className={cn("block py-2", quietLink)}>
            Sign in
          </a>
          <a href="/deploys" className={cn("block py-2", quietLink)}>
            Open console
          </a>
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
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
          <a href="/docs" className={quietLink}>
            Docs
          </a>
          <a href="/changelog" className={quietLink}>
            Changelog
          </a>
          <a href="#" className={quietLink}>
            Status
          </a>
        </nav>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main className="pt-12">
        <div className={container}>
          <section
            aria-labelledby="opening-heading"
            className="grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <div className="min-w-0 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
                >
                  new
                </Badge>
                <a href="/changelog" className={textLink}>
                  <span className="font-mono">2.4.0</span>: a preview for every
                  branch
                </a>
              </div>
              <h1 id="opening-heading" className="mt-6 text-h1 md:text-display">
                Deploy from the terminal you already have open
              </h1>
              <p className="mt-3 max-w-lg">
                Plinth is a command-line tool that builds the current commit,
                uploads it and prints the address it is live at. Every branch
                gets a preview address of its own, and{" "}
                <span className="font-mono">main</span> goes to production.
              </p>
              <CodeBlock
                id="install-label"
                label="install"
                code={installCommand}
                className="mt-6"
              >
                {installCommand}
              </CodeBlock>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={quickStart}
                  className={cn(buttonVariants({ variant: "default" }), buttonText)}
                >
                  Get started
                </a>
                <a href="/docs/commands/deploy" className={textLink}>
                  See every command
                </a>
              </div>
            </div>

            <figure
              aria-labelledby="terminal-label"
              className="min-w-0 self-start overflow-hidden rounded-xl border border-border bg-card lg:col-span-5"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
                <p
                  id="terminal-label"
                  className="font-mono text-label text-muted-foreground"
                >
                  ~/orrin-web
                </p>
                <p className="font-mono text-label text-muted-foreground">
                  zsh
                </p>
              </div>
              <pre
                tabIndex={0}
                role="region"
                aria-label="Terminal session"
                className="overflow-x-auto p-4 font-mono text-label focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <Lines lines={terminalLines} />
              </pre>
            </figure>
          </section>

          <section
            aria-labelledby="features-heading"
            className="mt-12 border-t border-border pt-12"
          >
            <p className="font-mono text-label text-muted-foreground">
              features
            </p>
            <h2 id="features-heading" className="mt-2 text-h2">
              What it does between commit and address
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="border-t border-border pt-4 md:col-span-6 lg:col-span-3"
                >
                  <feature.icon
                    className="block size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-body font-bold">{feature.title}</h3>
                  <p className="mt-3 max-w-lg">{feature.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="config-heading"
            className="mt-12 grid grid-cols-1 gap-6 border-t border-border pt-12 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="font-mono text-label text-muted-foreground">
                configuration
              </p>
              <h2 id="config-heading" className="mt-2 text-h2">
                One file, checked in next to your code
              </h2>
              <p className="mt-3 max-w-lg">
                A file called <InlineCode>plinth.toml</InlineCode> names the
                build command, the output folder and which branch goes to which
                environment. Run <InlineCode>plinth init</InlineCode> once and it
                writes the file for you.
              </p>
            </div>
            <CodeBlock
              id="config-label"
              label="plinth.toml"
              code={configFile}
              className="min-w-0 self-start lg:col-span-7"
            >
              <Lines lines={configLines} />
            </CodeBlock>
          </section>

          <section
            aria-labelledby="closing-heading"
            className="mt-12 border-t border-border pt-12"
          >
            <h2 id="closing-heading" className="max-w-lg text-h2">
              Your next commit can be live in a minute
            </h2>
            <p className="mt-3 max-w-lg">
              Install Plinth, run <InlineCode>plinth deploy</InlineCode> in your
              project and open the address it prints.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={quickStart}
                className={cn(buttonVariants({ variant: "default" }), buttonText)}
              >
                Get started
              </a>
              <a
                href="/deploys"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  buttonText
                )}
              >
                Open console
              </a>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
