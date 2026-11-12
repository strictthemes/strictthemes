import { useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { kinds, releases, type Kind } from "@/releases"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const headerLink =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground"
const currentLink = "text-foreground underline underline-offset-4"
const container = "mx-auto max-w-[1200px] px-4 md:px-6"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-4 font-mono text-label"

const navLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog", current: true },
  { label: "Pricing", href: "#" },
]

const footerLinks = [
  { label: "Docs", href: "/docs" },
  { label: "Status", href: "#" },
  { label: "RSS feed", href: "#" },
]

type Filter = "all" | Kind

const filterOptions: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "removed", label: "Removed" },
]

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${months[month - 1]} ${year}`
}

function versionId(version: string) {
  return `v${version.replaceAll(".", "-")}`
}

function releaseCount(n: number) {
  return `${n} ${n === 1 ? "release" : "releases"}`
}

/** Sets text in backticks as inline code. */
function RichText({ text }: { text: string }) {
  const parts = text.split("`")
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded-sm bg-muted px-1 py-0.5 font-mono">
            {part}
          </code>
        ) : (
          part
        )
      )}
    </>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
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
            <a
              key={link.href + link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "font-mono text-label",
                link.current ? currentLink : headerLink,
                focusRing
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
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
          {[...navLinks, { label: "Open console", href: "/deploys" }].map(
            (link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                aria-current={
                  "current" in link && link.current ? "page" : undefined
                }
                className={cn(
                  "block py-2 font-mono text-label",
                  "current" in link && link.current ? currentLink : headerLink,
                  focusRing
                )}
              >
                {link.label}
              </a>
            )
          )}
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
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn("font-mono text-label", headerLink, focusRing)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export function App() {
  const [filter, setFilter] = useState<Filter>("all")
  const newestVersion = releases[0].version

  const shown = useMemo(
    () =>
      releases
        .map((release) => ({
          ...release,
          groups: kinds
            .filter((kind) => filter === "all" || kind === filter)
            .map((kind) => ({
              kind,
              changes: release.changes.filter((c) => c.kind === kind),
            }))
            .filter((group) => group.changes.length > 0),
        }))
        .filter((release) => release.groups.length > 0),
    [filter]
  )

  const countText =
    filter === "all"
      ? releaseCount(releases.length)
      : `${shown.length} of ${releaseCount(releases.length)}`

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main className="pt-12">
        <div className={container}>
          <div className="max-w-lg">
            <h1 className="text-h1">Changelog</h1>
            <p className="mt-3">
              Every release of the{" "}
              <RichText text="`plinth`" /> command line, newest first; run{" "}
              <RichText text="`plinth upgrade`" /> to update to the latest one.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div
              role="group"
              aria-label="Filter by kind"
              className="flex flex-wrap gap-2"
            >
              {filterOptions.map((option) => {
                const chosen = option.value === filter
                return (
                  <Button
                    key={option.value}
                    variant={chosen ? "secondary" : "outline"}
                    aria-pressed={chosen}
                    className={buttonText}
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
            <p aria-live="polite" className={smallFigure}>
              {countText}
            </p>
          </div>

          <ol role="list" className="mt-12 list-none p-0">
            {shown.map((release, index) => (
              <li
                key={release.version}
                className={cn(
                  "border-t border-border pt-6",
                  index > 0 && "mt-12"
                )}
              >
                <article className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <h2 id={versionId(release.version)} className="text-h2">
                      v{release.version}
                    </h2>
                    <p className="mt-2">
                      <time dateTime={release.date} className={smallFigure}>
                        {formatDate(release.date)}
                      </time>
                    </p>
                    {release.version === newestVersion && (
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
                    {release.groups.map((group, groupIndex) => (
                      <div
                        key={group.kind}
                        className={cn(groupIndex > 0 && "mt-6")}
                      >
                        <h3 className="font-mono text-label text-muted-foreground">
                          {group.kind}
                        </h3>
                        <ul className="mt-2 list-disc pl-4">
                          {group.changes.map((change, changeIndex) => (
                            <li
                              key={change.text}
                              className={cn(changeIndex > 0 && "mt-2")}
                            >
                              <RichText text={change.text} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
