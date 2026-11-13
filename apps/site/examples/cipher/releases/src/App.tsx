import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "added" | "changed" | "fixed" | "removed"

type Change = { kind: Kind; text: string }

type Release = {
  version: string
  date: string
  changes: Change[]
}

const KINDS: Kind[] = ["added", "changed", "fixed", "removed"]

const RELEASES: Release[] = [
  {
    version: "2.4.0",
    date: "2026-11-10",
    changes: [
      {
        kind: "added",
        text: "Every branch you push now gets its own preview deploy, with a stable URL printed at the end of `plinth deploy`.",
      },
      {
        kind: "added",
        text: "`plinth deploy --wait` blocks until the deploy is live and exits non-zero if it fails, so CI jobs can stop on a broken release.",
      },
      {
        kind: "changed",
        text: "Uploads now send only the files that changed since the last deploy, which makes a typical redeploy about three times faster.",
      },
      {
        kind: "fixed",
        text: "`plinth logs --follow` no longer drops lines when the connection reconnects after a network change.",
      },
    ],
  },
  {
    version: "2.3.2",
    date: "2026-10-28",
    changes: [
      {
        kind: "fixed",
        text: "`plinth env pull` now keeps quotes around values that contain spaces when it writes `.env.local`.",
      },
      {
        kind: "fixed",
        text: "A deploy from a folder with a symlinked `node_modules` no longer uploads the linked folder twice.",
      },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-10-21",
    changes: [
      {
        kind: "fixed",
        text: "`plinth login` opens the browser again on Linux systems where `xdg-open` is the only handler.",
      },
      {
        kind: "fixed",
        text: "The progress bar no longer overwrites the last line of output in terminals narrower than 60 columns.",
      },
      {
        kind: "fixed",
        text: "Exit code 2 is reserved for configuration errors again, as the docs describe, instead of being used for network timeouts.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-06",
    changes: [
      {
        kind: "added",
        text: "`plinth env pull` downloads a project's environment variables into `.env.local`, so local runs match production.",
      },
      {
        kind: "changed",
        text: "`plinth env set` now asks before it overwrites an existing value; pass `--force` to skip the question in scripts.",
      },
      {
        kind: "removed",
        text: "The `plinth secrets` command is gone; use `plinth env set` and `plinth env pull`, which read and write the same values.",
      },
    ],
  },
  {
    version: "2.2.1",
    date: "2026-09-22",
    changes: [
      {
        kind: "fixed",
        text: "`plinth deploy` no longer fails with a checksum error on files larger than 2 GB.",
      },
      {
        kind: "changed",
        text: "The build step now times out after 20 minutes instead of 10; set `build.timeout` in `plinth.toml` to change it.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-09-08",
    changes: [
      {
        kind: "added",
        text: "`plinth rollback` puts the previous deploy back live in a few seconds, without rebuilding it.",
      },
      {
        kind: "added",
        text: "`plinth status --json` prints the current deploy as JSON for scripts and dashboards.",
      },
      {
        kind: "fixed",
        text: "Ctrl-C during an upload now cancels the deploy on the server too, instead of leaving it half-built.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-08-18",
    changes: [
      {
        kind: "added",
        text: "`plinth init` detects Vite, Astro and Next.js projects and writes a matching `plinth.toml`.",
      },
      {
        kind: "changed",
        text: "Output is no longer colored when it is piped or when `NO_COLOR` is set.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "2026-08-04",
    changes: [
      {
        kind: "fixed",
        text: "`plinth deploy` reads `plinth.toml` from the project root again when it is run from a subfolder.",
      },
      {
        kind: "changed",
        text: "The warning about a leftover `plinth.json` now names the file's path and says how to convert it.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-21",
    changes: [
      {
        kind: "added",
        text: "`plinth migrate` converts an existing `plinth.json` to `plinth.toml` and keeps your comments.",
      },
      {
        kind: "changed",
        text: "Configuration now lives in `plinth.toml`, which allows comments and grouped sections for build and deploy settings.",
      },
      {
        kind: "removed",
        text: "`plinth.json` is no longer read; run `plinth migrate` once before you upgrade a project's CI.",
      },
      {
        kind: "removed",
        text: "The `--legacy-upload` flag is gone, along with the upload path it switched on.",
      },
    ],
  },
]

const LATEST_VERSION = RELEASES[0].version

const FILTERS: { value: Kind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "removed", label: "Removed" },
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

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const quietLink = cn(
  "text-muted-foreground transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const currentLink = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150",
  focusOutline
)

const buttonClass = "px-4 font-mono text-label"

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
      {children}
    </code>
  )
}

function RichText({ text }: { text: string }) {
  const parts = text.split("`")
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <InlineCode key={i}>{part}</InlineCode> : part
      )}
    </>
  )
}

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog", current: true },
  { href: "#", label: "Pricing" },
]

function SiteHeader() {
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
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground", focusOutline)}
        >
          plinth
        </a>
        <nav aria-label="Main" className="hidden md:flex">
          <ul className="flex gap-6 font-mono text-label">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={link.current ? currentLink : quietLink}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
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
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <ul className="mx-auto max-w-[1200px] px-4 py-2 font-mono text-label md:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  "block py-2",
                  link.current ? currentLink : quietLink
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/deploys" className={cn("block py-2", quietLink)}>
              Open console
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

function SiteFooter() {
  const links = [
    { href: "/docs", label: "Docs" },
    { href: "#", label: "Status" },
    { href: "#", label: "RSS feed" },
  ]
  return (
    <footer className="mt-12 border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 md:px-6">
        <p className="font-mono text-label text-muted-foreground">
          © 2026 Plinth Labs
        </p>
        <nav aria-label="Footer" className="ml-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-label">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={quietLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
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
  const id = `v${release.version.replaceAll(".", "-")}`
  return (
    <li className={cn("border-t border-border pt-6", !first && "mt-12")}>
      <article
        aria-labelledby={id}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-3">
          <h2 id={id} className="text-h2">
            v{release.version}
          </h2>
          <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
            <time dateTime={release.date}>{formatDate(release.date)}</time>
          </p>
          {release.version === LATEST_VERSION && (
            <p className="mt-3">
              <Badge
                variant="outline"
                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground"
              >
                latest
              </Badge>
            </p>
          )}
        </div>
        <div className="max-w-lg lg:col-span-9">
          {kinds.map((kind, groupIndex) => (
            <section key={kind} className={cn(groupIndex > 0 && "mt-6")}>
              <h3 className="font-mono text-label text-muted-foreground">
                {kind}
              </h3>
              <ul className="mt-2 list-disc pl-4">
                {release.changes
                  .filter((change) => change.kind === kind)
                  .map((change, i) => (
                    <li key={i} className={cn("text-body", i > 0 && "mt-2")}>
                      <RichText text={change.text} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </li>
  )
}

export function App() {
  const [filter, setFilter] = useState<Kind | "all">("all")

  const shown = RELEASES.map((release) => {
    const kinds = KINDS.filter(
      (kind) =>
        (filter === "all" || filter === kind) &&
        release.changes.some((change) => change.kind === kind)
    )
    return { release, kinds }
  }).filter((entry) => entry.kinds.length > 0)

  const total = RELEASES.length
  const noun = total === 1 ? "release" : "releases"
  const count =
    filter === "all"
      ? `${total} ${noun}`
      : `${shown.length} of ${total} ${noun}`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main className="pt-12">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6">
          <div className="max-w-lg">
            <h1 className="text-h1">Changelog</h1>
            <p className="mt-3">
              Every release of the <InlineCode>plinth</InlineCode> command line,
              newest first; run <InlineCode>plinth upgrade</InlineCode> to
              update to the latest one.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div
              role="group"
              aria-label="Filter by kind"
              className="flex flex-wrap gap-2"
            >
              {FILTERS.map((option) => {
                const chosen = filter === option.value
                return (
                  <Button
                    key={option.value}
                    variant={chosen ? "secondary" : "outline"}
                    aria-pressed={chosen}
                    className={buttonClass}
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

          <ol className="mt-12 list-none p-0">
            {shown.map((entry, index) => (
              <ReleaseItem
                key={entry.release.version}
                release={entry.release}
                kinds={entry.kinds}
                first={index === 0}
              />
            ))}
          </ol>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
