import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"

import { CodeBlock } from "@/components/code-block"
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

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const quietLink =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
const currentLink = "text-foreground underline underline-offset-4"
const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const inlineCode = "rounded-sm bg-muted px-1 py-0.5 font-mono"

const CURRENT = "/docs/commands/deploy"

const mainLinks = [
  { label: "Docs", href: "/docs", current: true },
  { label: "Changelog", href: "/changelog", current: false },
  { label: "Pricing", href: "#", current: false },
]

const sidebar = [
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
      { label: "plinth init", href: "/docs/commands/init", mono: true },
      { label: "plinth deploy", href: "/docs/commands/deploy", mono: true },
      { label: "plinth logs", href: "/docs/commands/logs", mono: true },
      { label: "plinth rollback", href: "/docs/commands/rollback", mono: true },
      { label: "plinth env", href: "/docs/commands/env", mono: true },
    ],
  },
  {
    label: "Reference",
    links: [
      { label: "plinth.toml", href: "/docs/reference/plinth-toml", mono: true },
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

const flags = [
  {
    flag: "--env <name>",
    short: "-e",
    def: "preview",
    desc: "Environment to deploy to.",
  },
  {
    flag: "--prebuilt",
    short: null,
    def: "false",
    desc: "Upload the existing build output and skip the build step.",
  },
  {
    flag: "--message <text>",
    short: "-m",
    def: null,
    desc: "Message shown with the deploy. Without it, the latest commit's message is used.",
  },
  {
    flag: "--wait",
    short: null,
    def: "false",
    desc: "Wait until the deploy is ready or has failed before returning.",
  },
  {
    flag: "--yes",
    short: "-y",
    def: "false",
    desc: "Skip the confirmation before a production deploy.",
  },
  {
    flag: "--json",
    short: null,
    def: "false",
    desc: "Print the result as JSON instead of text.",
  },
  {
    flag: "--token <token>",
    short: null,
    def: "$PLINTH_TOKEN",
    desc: "Access token to deploy with.",
  },
]

const exitCodes = [
  { code: "0", meaning: "The deploy is ready." },
  { code: "1", meaning: "The build failed." },
  { code: "2", meaning: "The deploy needs a confirmation." },
  { code: "3", meaning: "The configuration is wrong." },
  { code: "4", meaning: "It timed out while waiting." },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    function update() {
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      let current = ids[0]
      if (atEnd) {
        current = ids[ids.length - 1]
      } else {
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= line) current = id
        }
      }
      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}

const sectionIds = sections.map((s) => s.id)

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
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
              className={cn("font-heading text-h2 text-foreground", focus)}
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
                  focus
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
                key={link.label}
                href={link.href}
                aria-current={link.current ? "true" : undefined}
                className={cn(
                  "block py-2 font-mono text-label",
                  link.current ? currentLink : quietLink,
                  focus
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/deploys"
              className={cn(
                "block py-2 font-mono text-label",
                quietLink,
                focus
              )}
            >
              Open console
            </a>
            {sidebar.map((group) => (
              <div key={group.label}>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={
                          link.href === CURRENT ? "page" : undefined
                        }
                        className={cn(
                          "block py-2",
                          link.mono && "font-mono",
                          link.href === CURRENT ? currentLink : quietLink,
                          focus
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <div className={cn(container, "lg:grid lg:grid-cols-12 lg:gap-6")}>
          <nav
            aria-label="Docs"
            className="sticky top-0 -mx-1 hidden max-h-svh self-start overflow-y-auto px-1 pt-6 pb-6 lg:col-span-3 lg:block"
          >
            {sidebar.map((group, i) => (
              <div key={group.label} className={i > 0 ? "mt-6" : undefined}>
                <p className="font-mono text-label text-muted-foreground">
                  {group.label}
                </p>
                <ul className="mt-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={
                          link.href === CURRENT ? "page" : undefined
                        }
                        className={cn(
                          "block py-1",
                          link.mono && "font-mono",
                          link.href === CURRENT ? currentLink : quietLink,
                          focus
                        )}
                      >
                        {link.label}
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
              <code className={inlineCode}>plinth deploy</code> builds the
              project in the current folder, uploads the build and starts a
              deploy. It deploys to <code className={inlineCode}>preview</code>{" "}
              unless you name another environment, and prints the deploy's
              address when it is ready.
            </p>

            <h2 id="usage" className="mt-12 scroll-mt-6 text-h2">
              Usage
            </h2>
            <p className="mt-3 max-w-lg">
              Run the command from the project's root, where{" "}
              <code className={inlineCode}>plinth.toml</code> is.
            </p>
            <CodeBlock
              className="mt-6"
              label="shell"
              code="plinth deploy [path] [flags]"
            />
            <p className="mt-6 max-w-lg">
              <code className={inlineCode}>path</code> is the folder to deploy,
              relative to where you run the command. It defaults to{" "}
              <code className={inlineCode}>.</code>, the current folder.
            </p>

            <h2 id="flags" className="mt-12 scroll-mt-6 text-h2">
              Flags
            </h2>
            <p className="mt-3 max-w-lg">
              Flags go after the path, in any order.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
              <Table
                label="Flags of plinth deploy"
                className="min-w-xl text-body"
              >
                <TableHeader>
                  <TableRow>
                    {["Flag", "Short", "Default", "Description"].map((h) => (
                      <TableHead
                        key={h}
                        className="px-3 font-mono text-label text-muted-foreground first:pl-6 last:pr-6"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.map((f) => (
                    <TableRow key={f.flag}>
                      <TableCell className="px-3 py-2 font-mono first:pl-6 last:pr-6">
                        {f.flag}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono first:pl-6 last:pr-6">
                        {f.short ?? "—"}
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono first:pl-6 last:pr-6">
                        {f.def ?? "—"}
                      </TableCell>
                      <TableCell className="px-3 py-2 whitespace-normal first:pl-6 last:pr-6">
                        {f.desc}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <aside className="mt-6 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Info className="size-4" strokeWidth={1.5} aria-hidden="true" />
                <p className="font-mono text-label text-foreground">note</p>
              </div>
              <p className="mt-2 max-w-lg">
                <code className={inlineCode}>--yes</code> skips the confirmation
                before a production deploy. A deploy run with no terminal
                attached, as in CI, needs it, or it stops with exit code{" "}
                <code className={inlineCode}>2</code>.
              </p>
            </aside>

            <h2 id="examples" className="mt-12 scroll-mt-6 text-h2">
              Examples
            </h2>
            <p className="mt-3 max-w-lg">
              Deploy the current folder to a preview environment.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy a preview"
              code="plinth deploy"
            />
            <p className="mt-6 max-w-lg">
              Deploy to production from CI, and return only once the deploy is
              ready.
            </p>
            <CodeBlock
              className="mt-6"
              label="deploy to production and wait"
              code={
                "# no prompt in CI, so confirm with --yes\nplinth deploy --env production --wait --yes"
              }
            />

            <h2 id="exit-codes" className="mt-12 scroll-mt-6 text-h2">
              Exit codes
            </h2>
            <ul className="mt-3 list-none">
              {exitCodes.map((e, i) => (
                <li key={e.code} className={i > 0 ? "mt-2" : undefined}>
                  <code className={inlineCode}>{e.code}</code> {e.meaning}
                </li>
              ))}
            </ul>

            <nav
              aria-label="Previous and next"
              className="mt-12 flex flex-wrap justify-between gap-6 border-t border-border pt-6"
            >
              <a
                href="/docs/commands/init"
                className={cn("group block", focus)}
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
                className={cn("group ml-auto block text-right", focus)}
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
          </article>

          <nav
            aria-label="On this page"
            className="sticky top-0 hidden self-start pt-6 xl:col-span-2 xl:block"
          >
            <p className="font-mono text-label text-muted-foreground">
              On this page
            </p>
            <ul className="mt-2">
              {sections.map((s, i) => (
                <li key={s.id} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "location" : undefined}
                    className={cn(
                      "font-mono text-label",
                      active === s.id ? currentLink : quietLink,
                      focus
                    )}
                  >
                    {s.label}
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
              { label: "Edit this page", href: "#" },
              { label: "Changelog", href: "/changelog" },
              { label: "Status", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn("font-mono text-label", quietLink, focus)}
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
