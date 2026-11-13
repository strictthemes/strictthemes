import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
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
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusRingInside =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const headerLink = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonClass = "px-4 font-mono text-label"

const INSTALL_COMMAND = "curl -fsSL https://plinth.example/install.sh | sh"
const GET_STARTED = "/docs/get-started/quick-start"

const CONFIG = `# plinth.toml
name = "orrin-web"
build = "npm run build"
output = "dist"

[env.production]
branch = "main"
domain = "orrin.example"

[env.preview]
branch = "*"`

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Pricing", href: "#" },
]

const footerLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "#" },
]

type Feature = {
  icon: LucideIcon
  title: string
  command: string
  before: string
  after: ReactNode
}

const features: Feature[] = [
  {
    icon: GitBranch,
    title: "A preview for every branch",
    before: "Run ",
    command: "plinth deploy",
    after: (
      <>
        {" "}
        on any branch and it gets its own address. Pushes to{" "}
        <span className="font-mono">main</span> go to production.
      </>
    ),
  },
  {
    icon: Undo2,
    title: "Roll back in one command",
    before: "",
    command: "plinth rollback",
    after:
      " points production at the deploy before this one. Nothing is rebuilt, so it takes seconds.",
  },
  {
    icon: KeyRound,
    title: "Secrets outside the repo",
    before: "Store API keys with ",
    command: "plinth env set",
    after:
      ". They are encrypted at rest and handed to the build for the environment that needs them.",
  },
  {
    icon: ScrollText,
    title: "Logs as they happen",
    before: "",
    command: "plinth logs --follow",
    after:
      " streams build and request logs to your terminal until you press Ctrl+C.",
  },
]

type CopyState = "idle" | "copied" | "failed"

function useCopy(text: string) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    let next: CopyState = "copied"
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      next = "failed"
    }
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  return { state, copy }
}

function CodeBlock({
  name,
  code,
  className,
  children,
}: {
  name: string
  code: string
  className?: string
  children: ReactNode
}) {
  const { state, copy } = useCopy(code)

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className="font-mono text-label text-muted-foreground">
          {name}
        </figcaption>
        <Button
          variant="outline"
          size="sm"
          className={buttonClass}
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
        aria-label={`Code: ${name}`}
        className={cn(
          "overflow-x-auto p-4 font-mono text-body",
          focusRingInside
        )}
      >
        {children}
      </pre>
    </figure>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", focusRing)}
        >
          plinth
        </a>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={headerLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a href="#" className={headerLink}>
            Sign in
          </a>
          <a
            href="/deploys"
            className={cn(buttonVariants({ variant: "outline" }), buttonClass)}
          >
            Open console
          </a>
        </div>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn("ml-auto md:hidden", buttonClass)}
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
              key={link.label}
              href={link.href}
              className={cn("block py-2", headerLink)}
            >
              {link.label}
            </a>
          ))}
          <a href="#" className={cn("block py-2", headerLink)}>
            Sign in
          </a>
          <a href="/deploys" className={cn("block py-2", headerLink)}>
            Open console
          </a>
        </div>
      </nav>
    </header>
  )
}

function Terminal() {
  return (
    <figure className="min-w-0 self-start overflow-hidden rounded-xl border border-border bg-card lg:col-span-5">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className="font-mono text-label text-muted-foreground">
          ~/orrin-web
        </figcaption>
        <p className="font-mono text-label text-muted-foreground">zsh</p>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label="Terminal session"
        className={cn(
          "overflow-x-auto p-4 font-mono text-label",
          focusRingInside
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

function ConfigCode() {
  const lines = CONFIG.split("\n")
  return lines.map((line, index) => {
    const end = index < lines.length - 1 ? "\n" : ""
    if (line.startsWith("#")) {
      return (
        <span key={index} className="text-muted-foreground">
          {line}
          {end}
        </span>
      )
    }
    const match = line.match(/^(\w+)( = )(.*)$/)
    if (match) {
      return (
        <span key={index}>
          <span className="text-primary">{match[1]}</span>
          {match[2]}
          {match[3]}
          {end}
        </span>
      )
    }
    return (
      <span key={index}>
        {line}
        {end}
      </span>
    )
  })
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

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
                Plinth builds the commit you are on, uploads it and prints the
                address, all from one command. Every branch gets a preview
                address, and <span className="font-mono">main</span> goes to
                production.
              </p>
              <CodeBlock name="install" code={INSTALL_COMMAND} className="mt-6">
                {INSTALL_COMMAND}
              </CodeBlock>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={GET_STARTED}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    buttonClass
                  )}
                >
                  Get started
                </a>
                <a href="/docs/commands/deploy" className={textLink}>
                  See every command
                </a>
              </div>
            </div>
            <Terminal />
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <p className="font-mono text-label text-muted-foreground">
              features
            </p>
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
                    className="block size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-body font-bold">{feature.title}</h3>
                  <p className="mt-3 max-w-lg">
                    {feature.before}
                    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                      {feature.command}
                    </code>
                    {feature.after}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 grid grid-cols-1 gap-6 border-t border-border pt-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-label text-muted-foreground">
                configuration
              </p>
              <h2 className="mt-2 text-h2">
                One file, checked in next to your code
              </h2>
              <p className="mt-3 max-w-lg">
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                  plinth.toml
                </code>{" "}
                names the build command, the output folder and which branch goes
                to which environment. Run{" "}
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                  plinth init
                </code>{" "}
                in your project and it writes the file for you.
              </p>
            </div>
            <CodeBlock
              name="plinth.toml"
              code={CONFIG}
              className="min-w-0 self-start lg:col-span-7"
            >
              <ConfigCode />
            </CodeBlock>
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <h2 className="max-w-lg text-h2">
              Your next commit can be live in a minute
            </h2>
            <p className="mt-3 max-w-lg">
              Install the CLI, run{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                plinth deploy
              </code>{" "}
              in your project and open the address it prints.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={GET_STARTED}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClass
                )}
              >
                Get started
              </a>
              <a
                href="/deploys"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  buttonClass
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
          <p className="font-mono text-label text-muted-foreground">
            © 2026 Plinth Labs
          </p>
          <nav
            aria-label="Footer"
            className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
          >
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className={headerLink}>
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
