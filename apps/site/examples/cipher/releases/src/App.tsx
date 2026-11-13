import { Fragment, useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "added" | "changed" | "fixed" | "removed"

type Change = {
  kind: Kind
  /** One sentence. Text between backticks is set as inline code. */
  text: string
}

type Release = {
  version: string
  /** ISO date, as in `2026-11-10`. */
  date: string
  changes: Change[]
}

const KINDS: Kind[] = ["added", "changed", "fixed", "removed"]

// Newest first.
const RELEASES: Release[] = [
  {
    version: "2.4.0",
    date: "2026-11-10",
    changes: [
      {
        kind: "added",
        text: "Every branch you push now gets its own preview deploy, at an address that stays the same until the branch is deleted.",
      },
      {
        kind: "added",
        text: "`plinth deploy --wait` holds the terminal until the deploy is ready and exits with `1` if it fails, so a CI job can depend on it.",
      },
      {
        kind: "changed",
        text: "Uploads send only the files that changed since the last deploy, which makes a typical deploy about three times faster.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` prints the preview address on its last line, so a script can read it with `tail -n 1`.",
      },
      {
        kind: "fixed",
        text: "`plinth logs --follow` no longer stops after ten minutes without output.",
      },
    ],
  },
  {
    version: "2.3.2",
    date: "2026-10-28",
    changes: [
      {
        kind: "fixed",
        text: "`plinth env pull` keeps the comments and the order of lines in an existing `.env.local` instead of rewriting the file.",
      },
      {
        kind: "fixed",
        text: "`plinth deploy` no longer fails with `EMFILE` in projects with more than 10,000 files.",
      },
      {
        kind: "fixed",
        text: "`plinth login` opens the browser again on Windows Terminal, where it used to print the address and wait.",
      },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-10-21",
    changes: [
      {
        kind: "fixed",
        text: "`plinth env pull --environment preview` reads the preview values, not the production ones.",
      },
      {
        kind: "fixed",
        text: "A `plinth.toml` saved with Windows line endings is read without a parse error.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-06",
    changes: [
      {
        kind: "added",
        text: "`plinth env pull` writes the project's environment variables to `.env.local`, so a new machine is set up with one command.",
      },
      {
        kind: "added",
        text: "`plinth env ls` lists the names of the variables in each environment, without their values.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` reads `.env.local` only when you pass `--env-file`, so a local value can no longer reach production by accident.",
      },
      {
        kind: "removed",
        text: "The `plinth secrets` command is gone: use `plinth env add`, `plinth env rm` and `plinth env pull`, which cover everything it did.",
      },
    ],
  },
  {
    version: "2.2.1",
    date: "2026-09-22",
    changes: [
      {
        kind: "changed",
        text: "`plinth rollback` asks for confirmation when the target is `production`; pass `--yes` to skip the question in a script.",
      },
      {
        kind: "fixed",
        text: "`plinth rollback` restores the environment variables of the deploy it goes back to, not the current ones.",
      },
      {
        kind: "fixed",
        text: "The progress bar no longer breaks the output of terminals narrower than 60 columns.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-09-08",
    changes: [
      {
        kind: "added",
        text: "`plinth rollback` puts the previous deploy back in production, or any deploy you name by its id.",
      },
      {
        kind: "added",
        text: "`plinth logs --since 1h` shows only the lines of the last hour; the flag takes minutes, hours and days.",
      },
      {
        kind: "changed",
        text: "`plinth logs` prints times in your local time zone; pass `--utc` for the old output.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-08-18",
    changes: [
      {
        kind: "added",
        text: "`plinth init` detects the framework and writes a `plinth.toml` with the right build command and output folder.",
      },
      {
        kind: "added",
        text: "A `[build.cache]` section in `plinth.toml` names the folders to keep between builds, such as `node_modules/.cache`.",
      },
      {
        kind: "changed",
        text: "Builds run on Node 24 unless `plinth.toml` sets another `node` version.",
      },
      {
        kind: "fixed",
        text: "`plinth deploy` follows symlinks inside the project and skips the ones that point outside it.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "2026-08-04",
    changes: [
      {
        kind: "changed",
        text: "The error for a leftover `plinth.json` now names `plinth migrate` as the fix.",
      },
      {
        kind: "fixed",
        text: "`plinth migrate` carries over the `redirects` of a `plinth.json`, which `2.0.0` dropped without a word.",
      },
      {
        kind: "fixed",
        text: "`plinth upgrade` works when the binary was installed with Homebrew.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-21",
    changes: [
      {
        kind: "added",
        text: "`plinth migrate` converts a `plinth.json` to `plinth.toml` and keeps the old file as `plinth.json.bak`.",
      },
      {
        kind: "added",
        text: "`plinth whoami` prints the signed-in account and the team the project belongs to.",
      },
      {
        kind: "changed",
        text: "`plinth.toml` replaces `plinth.json` as the project's config file, with comments and one section per environment.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` goes to a preview by default; a production deploy takes `--prod`.",
      },
      {
        kind: "removed",
        text: "`plinth.json` is no longer read: a project that still has one stops with an error until it is migrated.",
      },
      {
        kind: "removed",
        text: "The `--token` flag is gone from every command: set `PLINTH_TOKEN` in the environment instead.",
      },
    ],
  },
]

const LATEST_VERSION = RELEASES[0].version

type Filter = "all" | Kind

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "removed", label: "Removed" },
]

const NAV_LINKS = [
  { label: "Docs", href: "/docs", current: false },
  { label: "Changelog", href: "/changelog", current: true },
  { label: "Pricing", href: "#", current: false },
]

const FOOTER_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "#" },
  { label: "RSS feed", href: "#" },
]

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const CONTAINER = "mx-auto max-w-[1200px] px-4 md:px-6"

const BUTTON = "px-4 font-mono text-label"

const BADGE = "h-auto rounded-sm px-2 py-1 font-mono text-label"

function quietLink(current: boolean) {
  return cn(
    "transition-colors duration-150",
    FOCUS,
    current
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground"
  )
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded-sm bg-muted px-1 py-0.5 font-mono"
          >
            {part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <header className="border-b border-border">
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground", FOCUS)}
          >
            plinth
          </a>
          <nav aria-label="Main" className="hidden gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn("font-mono text-label", quietLink(link.current))}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <a
              href="/deploys"
              className={cn(buttonVariants({ variant: "outline" }), BUTTON)}
            >
              Open console
            </a>
          </div>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(BUTTON, "ml-auto md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
      </div>
      <nav
        id="site-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-border md:hidden"
      >
        <div className={cn(CONTAINER, "py-2")}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "block py-2 font-mono text-label",
                quietLink(link.current)
              )}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/deploys"
            className={cn("block py-2 font-mono text-label", quietLink(false))}
          >
            Open console
          </a>
        </div>
      </nav>
    </header>
  )
}

function ReleaseItem({
  release,
  kinds,
  first,
}: {
  release: Release
  kinds: Kind[]
  first: boolean
}) {
  const groups = kinds
    .map((kind) => ({
      kind,
      changes: release.changes.filter((change) => change.kind === kind),
    }))
    .filter((group) => group.changes.length > 0)

  return (
    <li className={cn("border-t border-border pt-6", !first && "mt-12")}>
      <article className="grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-3">
          <h2 id={`v${release.version.replaceAll(".", "-")}`} className="text-h2">
            v{release.version}
          </h2>
          <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
            <time dateTime={release.date}>{formatDate(release.date)}</time>
          </p>
          {release.version === LATEST_VERSION && (
            <p className="mt-3">
              <Badge
                variant="outline"
                className={cn(
                  BADGE,
                  "border-transparent bg-tertiary text-tertiary-foreground"
                )}
              >
                latest
              </Badge>
            </p>
          )}
        </div>
        <div className="max-w-lg min-w-0 lg:col-span-9">
          {groups.map((group, groupIndex) => (
            <Fragment key={group.kind}>
              <h3
                className={cn(
                  "font-mono text-label text-muted-foreground",
                  groupIndex > 0 && "mt-6"
                )}
              >
                {group.kind}
              </h3>
              <ul className="mt-2 list-disc pl-4">
                {group.changes.map((change, changeIndex) => (
                  <li
                    key={change.text}
                    className={cn("text-body", changeIndex > 0 && "mt-2")}
                  >
                    <InlineText text={change.text} />
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </div>
      </article>
    </li>
  )
}

export function App() {
  const [filter, setFilter] = useState<Filter>("all")

  const kinds = filter === "all" ? KINDS : [filter]
  const shown = RELEASES.filter((release) =>
    release.changes.some((change) => kinds.includes(change.kind))
  )

  const total = RELEASES.length
  const noun = total === 1 ? "release" : "releases"
  const count =
    filter === "all" ? `${total} ${noun}` : `${shown.length} of ${total} ${noun}`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main className="pt-12">
        <div className={CONTAINER}>
          <div className="max-w-lg">
            <h1 className="text-h1">Changelog</h1>
            <p className="mt-3">
              Every release of the <InlineText text="`plinth`" /> command line,
              newest first; run <InlineText text="`plinth upgrade`" /> to move
              to the latest one.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div
              role="group"
              aria-label="Filter by kind"
              className="flex flex-wrap gap-2"
            >
              {FILTERS.map((option) => {
                const chosen = option.value === filter
                return (
                  <Button
                    key={option.value}
                    variant={chosen ? "secondary" : "outline"}
                    aria-pressed={chosen}
                    className={BUTTON}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
            <p
              aria-live="polite"
              className="font-mono text-label text-muted-foreground tabular-nums"
            >
              {count}
            </p>
          </div>

          <ol className="mt-12">
            {shown.map((release, index) => (
              <ReleaseItem
                key={release.version}
                release={release}
                kinds={kinds}
                first={index === 0}
              />
            ))}
          </ol>
        </div>
      </main>
      <footer className="mt-12 border-t border-border">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-6">
            <p className="font-mono text-label text-muted-foreground">
              © 2026 Plinth Labs
            </p>
            <nav
              aria-label="Footer"
              className="ml-auto flex flex-wrap gap-x-6 gap-y-2"
            >
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn("font-mono text-label", quietLink(false))}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
