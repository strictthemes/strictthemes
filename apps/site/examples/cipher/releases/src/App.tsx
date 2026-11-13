import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "added" | "changed" | "fixed" | "removed"
type Filter = Kind | "all"

type Change = { kind: Kind; text: string }
type Release = { version: string; date: string; changes: Change[] }

const KINDS: Kind[] = ["added", "changed", "fixed", "removed"]

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "removed", label: "Removed" },
]

// Newest first. Text between backticks is shown as inline code.
const RELEASES: Release[] = [
  {
    version: "2.4.0",
    date: "2026-11-10",
    changes: [
      {
        kind: "added",
        text: "Every branch you push now gets its own preview deploy, and `plinth deploy` prints its address when the upload finishes.",
      },
      {
        kind: "added",
        text: "`plinth deploy --wait` waits until the deploy is live and exits with an error if it fails, so a CI job can depend on it.",
      },
      {
        kind: "changed",
        text: "Uploads now send only the files that changed since the last deploy, which makes most deploys several times faster.",
      },
      {
        kind: "fixed",
        text: "`plinth logs` keeps following the output after a network drop of a few seconds instead of exiting.",
      },
    ],
  },
  {
    version: "2.3.2",
    date: "2026-10-28",
    changes: [
      {
        kind: "fixed",
        text: "`plinth deploy` no longer hangs on projects with more than ten thousand files.",
      },
      {
        kind: "fixed",
        text: "The upload progress line now reaches the end instead of stopping one file short.",
      },
    ],
  },
  {
    version: "2.3.1",
    date: "2026-10-21",
    changes: [
      {
        kind: "fixed",
        text: "`plinth env pull` keeps the quotes around values that contain spaces when it writes `.env`.",
      },
      {
        kind: "fixed",
        text: "On a machine without a browser, `plinth login` prints the sign-in link instead of failing.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-10-06",
    changes: [
      {
        kind: "added",
        text: "`plinth env pull` writes the project's environment variables to a local `.env` file, so your dev server runs with the same settings as production.",
      },
      {
        kind: "changed",
        text: "`plinth env list` hides secret values by default; pass `--reveal` to show them.",
      },
      {
        kind: "removed",
        text: "The `plinth secrets` command is gone: use `plinth env` for every variable, secret or not.",
      },
    ],
  },
  {
    version: "2.2.1",
    date: "2026-09-22",
    changes: [
      {
        kind: "fixed",
        text: "`plinth deploy` reads `build.output` from `plinth.toml` again instead of falling back to `dist`.",
      },
      {
        kind: "fixed",
        text: "The error for an expired token now tells you to run `plinth login`.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-09-08",
    changes: [
      {
        kind: "added",
        text: "`plinth open` opens the latest deploy of the current project in your browser.",
      },
      {
        kind: "added",
        text: "`plinth status --json` prints the state of the latest deploy as JSON for scripts.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` prints the deploy's address on the last line of its output, so a script can read it with `tail -n 1`.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-08-18",
    changes: [
      {
        kind: "added",
        text: "`plinth rollback` puts the previous deploy back live without building again.",
      },
      {
        kind: "added",
        text: "Set `PLINTH_TOKEN` to sign in on CI without running `plinth login`.",
      },
      {
        kind: "fixed",
        text: "Deploys from Windows no longer upload files with backslashes in their paths.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "2026-08-04",
    changes: [
      {
        kind: "fixed",
        text: "`plinth init` writes a valid `plinth.toml` when the project folder's name contains a dot.",
      },
      {
        kind: "fixed",
        text: "`plinth deploy` no longer warns about a missing `plinth.json` in a project that has moved to `plinth.toml`.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2026-07-21",
    changes: [
      {
        kind: "added",
        text: "`plinth migrate` turns an existing `plinth.json` into a `plinth.toml` in one step.",
      },
      {
        kind: "changed",
        text: "Project settings now live in `plinth.toml`, which allows comments and is easier to read than JSON.",
      },
      {
        kind: "changed",
        text: "`plinth deploy` builds in a clean folder every time, so files left over from an old build are never uploaded.",
      },
      {
        kind: "removed",
        text: "`plinth.json` is no longer read: run `plinth migrate` before you update, or your settings will be ignored.",
      },
    ],
  },
]

const LATEST_VERSION = RELEASES[0].version

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

const CONTAINER = "mx-auto max-w-[1200px] px-4 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const QUIET_LINK = cn(
  "font-mono text-label text-muted-foreground transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const CURRENT_LINK = cn(
  "font-mono text-label text-foreground underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  FOCUS
)
const BUTTON_CLASSES = "px-4 font-mono text-label"

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog", current: true },
  { label: "Pricing", href: "#" },
]

function InlineText({ text }: { text: string }) {
  const parts = text.split("`")
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded-sm bg-muted px-1 py-0.5 font-mono">
            {part}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            FOCUS
          )}
        >
          plinth
        </a>
        <nav aria-label="Main" className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={link.current ? CURRENT_LINK : QUIET_LINK}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a
            href="/deploys"
            className={cn(buttonVariants({ variant: "outline" }), BUTTON_CLASSES)}
          >
            Open console
          </a>
        </div>
        <Button
          ref={menuButtonRef}
          variant="outline"
          className={cn("ml-auto md:hidden", BUTTON_CLASSES)}
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
        <div className={cn(CONTAINER, "py-2")}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "block py-2",
                link.current ? CURRENT_LINK : QUIET_LINK
              )}
            >
              {link.label}
            </a>
          ))}
          <a href="/deploys" className={cn("block py-2", QUIET_LINK)}>
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
  isFirst,
}: {
  release: Release
  kinds: Kind[]
  isFirst: boolean
}) {
  const id = `v${release.version.replaceAll(".", "-")}`
  return (
    <li className={cn("border-t border-border pt-6", !isFirst && "mt-12")}>
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
        <div className="max-w-lg min-w-0 lg:col-span-9">
          {kinds.map((kind, groupIndex) => (
            <div key={kind} className={cn(groupIndex > 0 && "mt-6")}>
              <h3 className="font-mono text-label text-muted-foreground">
                {kind}
              </h3>
              <ul className="mt-2 list-disc pl-4">
                {release.changes
                  .filter((change) => change.kind === kind)
                  .map((change, i) => (
                    <li key={i} className={cn("text-body", i > 0 && "mt-2")}>
                      <InlineText text={change.text} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </li>
  )
}

export function App() {
  const [filter, setFilter] = React.useState<Filter>("all")

  const shown = RELEASES.map((release) => ({
    release,
    kinds: KINDS.filter(
      (kind) =>
        (filter === "all" || kind === filter) &&
        release.changes.some((change) => change.kind === kind)
    ),
  })).filter((entry) => entry.kinds.length > 0)

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
        <div className={CONTAINER}>
          <div className="max-w-lg">
            <h1 className="text-h1">Changelog</h1>
            <p className="mt-3">
              Every release of the{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                plinth
              </code>{" "}
              command line, newest first; run{" "}
              <code className="rounded-sm bg-muted px-1 py-0.5 font-mono">
                plinth upgrade
              </code>{" "}
              to update to the latest one.
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
                    className={BUTTON_CLASSES}
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
            {shown.map((entry, index) => (
              <ReleaseItem
                key={entry.release.version}
                release={entry.release}
                kinds={entry.kinds}
                isFirst={index === 0}
              />
            ))}
          </ol>
        </div>
      </main>

      <footer className="mt-12 border-t border-border">
        <div
          className={cn(
            CONTAINER,
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
            <a href="/docs" className={QUIET_LINK}>
              Docs
            </a>
            <a href="#" className={QUIET_LINK}>
              Status
            </a>
            <a href="#" className={QUIET_LINK}>
              RSS feed
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default App
