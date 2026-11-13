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

const INSTALL_COMMAND = "curl -fsSL https://plinth.example/install.sh | sh"

const CONFIG_FILE = `# plinth.toml
name = "orrin-web"
build = "npm run build"
output = "dist"

[env.production]
branch = "main"
domain = "orrin.example"

[env.preview]
branch = "*"`

const GET_STARTED = "/docs/get-started/quick-start"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const focusOutlineInside =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1200px] px-4 md:px-6"

const label = "font-mono text-label text-muted-foreground"

const headerLink = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const buttonText = "px-4 font-mono text-label"

const navLinks = [
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
  { name: "Pricing", href: "#" },
]

const footerLinks = [
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
  { name: "Status", href: "#" },
]

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
      {children}
    </code>
  )
}

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
        Run <InlineCode>plinth deploy</InlineCode> on any branch and it gets its
        own address, named after the branch. Only{" "}
        <span className="font-mono">main</span> goes to production.
      </>
    ),
  },
  {
    icon: Undo2,
    title: "Roll back in one command",
    body: (
      <>
        <InlineCode>plinth rollback</InlineCode> points production at the deploy
        before the current one. Nothing is rebuilt, so it takes a few seconds.
      </>
    ),
  },
  {
    icon: KeyRound,
    title: "Secrets outside the repo",
    body: (
      <>
        <InlineCode>plinth env set</InlineCode> stores a value encrypted, for
        one environment. It reaches the build and never the repository.
      </>
    ),
  },
  {
    icon: ScrollText,
    title: "Logs as they happen",
    body: (
      <>
        <InlineCode>plinth logs --follow</InlineCode> streams build and request
        logs to your terminal until you stop it.
      </>
    ),
  },
]

type CopyState = "idle" | "copied" | "failed"

function CodeBlock({
  name,
  code,
  className,
  children,
}: {
  name: string
  code: string
  className?: string
  children?: ReactNode
}) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let next: CopyState = "copied"
    try {
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
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className={label}>{name}</figcaption>
        <Button
          variant="outline"
          size="sm"
          className={buttonText}
          onClick={copy}
        >
          {state === "copied" && (
            <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
          )}
          {message || "Copy"}
        </Button>
        <span role="status" className="sr-only">
          {message}
        </span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${name}`}
        className={cn(
          "overflow-x-auto p-4 font-mono text-body text-foreground",
          focusOutlineInside
        )}
      >
        <code>{children ?? code}</code>
      </pre>
    </figure>
  )
}

function ConfigLine({ line }: { line: string }) {
  if (line.startsWith("#")) {
    return <span className="text-muted-foreground">{line}</span>
  }
  const equals = line.indexOf(" = ")
  if (equals === -1) {
    return <>{line}</>
  }
  return (
    <>
      <span className="text-primary">{line.slice(0, equals)}</span>
      {line.slice(equals)}
    </>
  )
}

function Terminal({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className={label}>~/orrin-web</figcaption>
        <p className={label}>zsh</p>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label="Terminal session"
        className={cn(
          "overflow-x-auto p-4 font-mono text-label text-muted-foreground",
          focusOutlineInside
        )}
      >
        <span className="text-muted-foreground">$</span>{" "}
        <span className="text-foreground">plinth deploy</span>
        {"\n"}
        <span className="text-muted-foreground">
          {"  reading plinth.toml\n"}
          {"  building orrin-web  commit 8f3c2a1  branch feat/search\n"}
          {"  uploading 214 files  4.1 MB\n"}
        </span>
        {"  "}
        <span className="text-success">ready</span>
        {"  "}
        <span className="text-foreground">
          https://feat-search.orrin-web.plinth.example
        </span>
        {"  "}
        <span className="text-muted-foreground">in 38s</span>
        {"\n"}
        <span className="text-muted-foreground">$</span>{" "}
        <span
          className="inline-block h-3 w-2 bg-primary align-middle"
          aria-hidden="true"
        />
      </pre>
    </figure>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="border-b border-border">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", focusOutline)}
        >
          plinth
        </a>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={headerLink}>
              {link.name}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a href="#" className={headerLink}>
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
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="site-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(headerLink, "block py-2")}
            >
              {link.name}
            </a>
          ))}
          <a href="#" className={cn(headerLink, "block py-2")}>
            Sign in
          </a>
          <a href="/deploys" className={cn(headerLink, "block py-2")}>
            Open console
          </a>
        </div>
      </nav>
    </header>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />

      <main className="pt-12">
        <div className={container}>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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
              <h1 className="mt-6 text-h1 md:text-display">
                Deploy from the terminal you already have open
              </h1>
              <p className="mt-3 max-w-lg">
                <InlineCode>plinth deploy</InlineCode> builds the current
                commit, uploads it and prints the address. Every branch gets a
                preview address, and <span className="font-mono">main</span>{" "}
                goes to production.
              </p>
              <CodeBlock
                name="install"
                code={INSTALL_COMMAND}
                className="mt-6"
              />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={GET_STARTED}
                  className={cn(buttonVariants(), buttonText)}
                >
                  Get started
                </a>
                <a href="/docs/commands/deploy" className={textLink}>
                  See every command
                </a>
              </div>
            </div>
            <Terminal className="min-w-0 self-start lg:col-span-5" />
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <p className={label}>features</p>
            <h2 className="mt-2 text-h2">
              What it does between commit and address
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="border-t border-border pt-4 md:col-span-6 lg:col-span-3"
                >
                  <feature.icon
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-body font-bold">{feature.title}</h3>
                  <p className="mt-3 max-w-lg">{feature.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 grid grid-cols-1 gap-6 border-t border-border pt-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className={label}>configuration</p>
              <h2 className="mt-2 text-h2">
                One file, checked in next to your code
              </h2>
              <p className="mt-3 max-w-lg">
                <InlineCode>plinth.toml</InlineCode> names the build command,
                the output folder and which branch goes where.{" "}
                <InlineCode>plinth init</InlineCode> writes it for you, and you
                change it like any other file in the project.
              </p>
            </div>
            <CodeBlock
              name="plinth.toml"
              code={CONFIG_FILE}
              className="min-w-0 self-start lg:col-span-7"
            >
              {CONFIG_FILE.split("\n").map((line, index) => (
                <span key={index}>
                  {index > 0 && "\n"}
                  <ConfigLine line={line} />
                </span>
              ))}
            </CodeBlock>
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <h2 className="max-w-lg text-h2">
              Your next commit can be live in a minute
            </h2>
            <p className="mt-3 max-w-lg">
              Install Plinth, run <InlineCode>plinth init</InlineCode> in your
              project and deploy the branch you are on.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={GET_STARTED}
                className={cn(buttonVariants(), buttonText)}
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

      <footer className="mt-12 border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-6"
          )}
        >
          <p className={label}>© 2026 Plinth Labs</p>
          <nav
            aria-label="Footer"
            className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
          >
            {footerLinks.map((link) => (
              <a key={link.name} href={link.href} className={headerLink}>
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
