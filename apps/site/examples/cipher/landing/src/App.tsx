import { useEffect, useRef, useState, type ReactNode } from "react"
import { GitBranch, KeyRound, ScrollText, Undo2 } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { focusRing, focusRingInside } from "@/lib/focus"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const headerLink = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusRing
)
const buttonText = "px-4 font-mono text-label"

const installCommand = "curl -fsSL https://plinth.example/install.sh | sh"
const quickStart = "/docs/get-started/quick-start"

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  { label: "Pricing", href: "#" },
]

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
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            focusRing
          )}
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
            className={cn(buttonVariants({ variant: "outline" }), buttonText)}
          >
            Open console
          </a>
        </div>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn("ml-auto md:hidden", buttonText)}
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
          {[
            ...navLinks,
            { label: "Sign in", href: "#" },
            { label: "Open console", href: "/deploys" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn("block py-2", headerLink)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Line({ children }: { children?: ReactNode }) {
  return (
    <>
      {children}
      {"\n"}
    </>
  )
}

function Terminal() {
  const prompt = <span className="text-muted-foreground">$</span>
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card">
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
        <Line>
          {prompt} <span className="text-foreground">plinth deploy</span>
        </Line>
        <Line>
          <span className="text-muted-foreground">{"  reading plinth.toml"}</span>
        </Line>
        <Line>
          <span className="text-muted-foreground">
            {"  building orrin-web  commit 8f3c2a1  branch feat/search"}
          </span>
        </Line>
        <Line>
          <span className="text-muted-foreground">
            {"  uploading 214 files  4.1 MB"}
          </span>
        </Line>
        <Line>
          {"  "}
          <span className="text-success">ready</span>
          {"  "}
          <span className="text-foreground">
            https://feat-search.orrin-web.plinth.example
          </span>
          {"  "}
          <span className="text-muted-foreground">in 38s</span>
        </Line>
        {prompt}{" "}
        <span
          className="inline-block h-3 w-2 bg-primary align-middle"
          aria-hidden="true"
        />
      </pre>
    </figure>
  )
}

const tomlCode = `# plinth.toml
name = "orrin-web"
build = "npm run build"
output = "dist"

[env.production]
branch = "main"
domain = "orrin.example"

[env.preview]
branch = "*"`

function TomlLines() {
  return tomlCode.split("\n").map((line, index, lines) => {
    const end = index < lines.length - 1 ? "\n" : ""
    if (line.startsWith("#")) {
      return (
        <span key={index}>
          <span className="text-muted-foreground">{line}</span>
          {end}
        </span>
      )
    }
    const match = line.match(/^(\w+)( = )(.*)$/)
    if (match) {
      return (
        <span key={index}>
          <span className="text-primary">{match[1]}</span>
          <span className="text-foreground">
            {match[2]}
            {match[3]}
          </span>
          {end}
        </span>
      )
    }
    return (
      <span key={index} className="text-foreground">
        {line}
        {end}
      </span>
    )
  })
}

const features = [
  {
    icon: GitBranch,
    title: "A preview for every branch",
    command: "plinth deploy",
    before: "Run ",
    after: (
      <>
        {" "}
        on any branch and it gets its own preview address. Only{" "}
        <span className="font-mono">main</span> goes to production.
      </>
    ),
  },
  {
    icon: Undo2,
    title: "Roll back in one command",
    command: "plinth rollback",
    before: "",
    after:
      " puts the previous deploy back in place in seconds. Nothing is rebuilt.",
  },
  {
    icon: KeyRound,
    title: "Secrets outside the repo",
    command: "plinth env set",
    before: "Store keys with ",
    after:
      ". They are encrypted at rest and handed to the build, never written to the repo.",
  },
  {
    icon: ScrollText,
    title: "Logs as they happen",
    command: "plinth logs --follow",
    before: "",
    after:
      " streams the build and request logs of a deploy to your terminal as they arrive.",
  },
]

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
      {children}
    </code>
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
                Plinth builds the current commit, uploads it and prints the
                address, all from one command. Every branch gets a preview
                address, and <span className="font-mono">main</span> goes to
                production.
              </p>
              <CodeBlock label="install" code={installCommand} className="mt-6" />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={quickStart}
                  className={cn(buttonVariants(), buttonText)}
                >
                  Get started
                </a>
                <a href="/docs/commands/deploy" className={textLink}>
                  See every command
                </a>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-5">
              <Terminal />
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <p className="font-mono text-label text-muted-foreground">
              features
            </p>
            <h2 className="mt-2 text-h2">
              What it does between commit and address
            </h2>
            <div className="mt-6 grid grid-cols-12 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="col-span-12 border-t border-border pt-4 md:col-span-6 lg:col-span-3"
                >
                  <feature.icon
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-body font-bold">{feature.title}</h3>
                  <p className="mt-3">
                    {feature.before}
                    <InlineCode>{feature.command}</InlineCode>
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
                <InlineCode>plinth.toml</InlineCode> names the build command,
                the output folder and which branch goes to which environment.
                Run <InlineCode>plinth init</InlineCode> in your project and it
                writes the file for you.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <CodeBlock label="plinth.toml" code={tomlCode}>
                <TomlLines />
              </CodeBlock>
            </div>
          </section>

          <section className="mt-12 border-t border-border pt-12">
            <h2 className="max-w-lg text-h2">
              Your next commit can be live in a minute
            </h2>
            <p className="mt-3 max-w-lg">
              Install Plinth, run <InlineCode>plinth deploy</InlineCode> in
              your project and open the address it prints.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={quickStart} className={cn(buttonVariants(), buttonText)}>
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
          <p className="font-mono text-label text-muted-foreground">
            © 2026 Plinth Labs
          </p>
          <nav
            aria-label="Footer"
            className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
          >
            <a href="/docs" className={headerLink}>
              Docs
            </a>
            <a href="/changelog" className={headerLink}>
              Changelog
            </a>
            <a href="#" className={headerLink}>
              Status
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default App
