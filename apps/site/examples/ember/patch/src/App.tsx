import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"
import { TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1280px] px-3 md:px-6"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const label = "font-mono text-label uppercase"
const mutedLabel = cn(label, "text-muted-foreground")
const sectionHeading = "text-h2 uppercase md:text-h1"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusOutline
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const currentNavLink = "underline decoration-2"

const headCell = cn(mutedLabel, "px-3 first:pl-0 last:pr-0")
const bodyCell = "px-3 py-2 first:pl-0 last:pr-0"
const numberCell = cn(bodyCell, "text-right font-mono tabular-nums")

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentPage = "/patch"

const counts = [
  { name: "New", value: "3" },
  { name: "Balance", value: "8" },
  { name: "Fixes", value: "10" },
  { name: "Issues", value: "3" },
]

const onThisPage = [
  { name: "New", href: "#new" },
  { name: "Balance changes", href: "#balance" },
  { name: "Fixes", href: "#fixes" },
  { name: "Known issues", href: "#known" },
]

const additions = [
  {
    kind: "Mode",
    name: "Duel Pits",
    text: "A 2v2 mode on a small map, played as a best of five rounds. It is unranked and stays in rotation until Tuesday 1 December.",
  },
  {
    kind: "Feature",
    name: "Replay viewer",
    text: "Your last ten matches can be watched again from your profile. Play them at any speed and from any player's view.",
  },
  {
    kind: "Feature",
    name: "Ping wheel",
    text: "Hold a key to mark an enemy, an item or a place for your team. Every ping comes with a spoken line in every language the game has.",
  },
]

const classNames = ["Bulwark", "Cinderblade", "Flarecaster", "Mender"] as const
type ClassName = (typeof classNames)[number]
type Filter = "All" | ClassName
const filters: Filter[] = ["All", ...classNames]

type BalanceChange = {
  className: ClassName
  ability: string
  stat: string
  before: string
  after: string
  change: "Buff" | "Nerf"
}

const balanceChanges: BalanceChange[] = [
  {
    className: "Bulwark",
    ability: "Slag Wall",
    stat: "Wall health",
    before: "1,200",
    after: "1,050",
    change: "Nerf",
  },
  {
    className: "Bulwark",
    ability: "Anchor Step",
    stat: "Cooldown",
    before: "14 s",
    after: "12 s",
    change: "Buff",
  },
  {
    className: "Cinderblade",
    ability: "Coal Rush",
    stat: "Damage",
    before: "65",
    after: "60",
    change: "Nerf",
  },
  {
    className: "Cinderblade",
    ability: "Backdraft",
    stat: "Duration",
    before: "1.5 s",
    after: "1.2 s",
    change: "Nerf",
  },
  {
    className: "Flarecaster",
    ability: "Flare Bolt",
    stat: "Damage",
    before: "42",
    after: "45",
    change: "Buff",
  },
  {
    className: "Flarecaster",
    ability: "Heat Haze",
    stat: "Radius",
    before: "6 m",
    after: "5 m",
    change: "Nerf",
  },
  {
    className: "Mender",
    ability: "Mending Smoke",
    stat: "Healing a second",
    before: "30",
    after: "34",
    change: "Buff",
  },
  {
    className: "Mender",
    ability: "Ash Veil",
    stat: "Cooldown",
    before: "20 s",
    after: "24 s",
    change: "Nerf",
  },
]

const fixGroups = [
  {
    name: "Gameplay",
    fixes: [
      "Anchor Step could carry a Bulwark through the wall at the Glasswater Yard pump house; the wall now stops it.",
      "Coal Rush sometimes dealt its damage twice to a target standing on a slope, and now hits once.",
      "A Mender who was knocked back while casting Mending Smoke lost the cooldown without placing the smoke; the cast now finishes or is refunded.",
      "Flare Bolt passed through the closed gate on Kiln Row in the first seconds of a round, and is now blocked by it.",
    ],
  },
  {
    name: "Interface",
    fixes: [
      "The scoreboard showed the wrong class icon for a player who switched class between rounds, and now updates at once.",
      "Cooldown timers on wide screens were cut off at the bottom edge, and now sit fully inside the screen.",
      "The friends list reported players as offline while they were in a match, and now shows them as in a match.",
    ],
  },
  {
    name: "Audio",
    fixes: [
      "Footsteps on metal floors were much quieter than on stone, and are now as loud as each other.",
      "The round-start horn played twice for players who joined a match late, and now plays once.",
      "Voice chat stayed muted after a match if you had muted a teammate during it, and now resets when the match ends.",
    ],
  },
]

const knownIssues = [
  {
    text: "The replay viewer can show a black screen when you jump to the last round of a long match.",
    note: "Workaround · Play from round one",
  },
  {
    text: "In Duel Pits, the ping wheel sometimes marks the floor behind an enemy and not the enemy.",
    note: "Workaround · Ping from closer",
  },
  {
    text: "Some players see their match history load slowly in the first minutes after logging in.",
    note: "No workaround yet",
  },
]

const earlierPatches = [
  { name: "Patch 4.1", date: "Tue 20 Oct 2026", dateTime: "2026-10-20" },
  { name: "Patch 4.0", date: "Tue 6 Oct 2026", dateTime: "2026-10-06" },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>("All")
  const menuButton = useRef<HTMLButtonElement>(null)

  const shownChanges =
    filter === "All"
      ? balanceChanges
      : balanceChanges.filter((row) => row.className === filter)
  const countLine = `${filter === "All" ? "All classes" : filter} · ${
    shownChanges.length
  } ${shownChanges.length === 1 ? "change" : "changes"}`

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") {
      return
    }
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div
          className={cn(container, "flex items-center justify-between gap-6 py-3")}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
              focusOutline
            )}
          >
            Ashfall
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={page.href === currentPage ? "page" : undefined}
                    className={cn(
                      navLink,
                      page.href === currentPage && currentNavLink
                    )}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={page.href === currentPage ? "page" : undefined}
                    className={cn(
                      navLink,
                      "block py-2",
                      page.href === currentPage && currentNavLink
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(container, "pt-12")}>
        <section>
          <div className={grid}>
            <div className="md:col-span-8">
              <p className={cn(mutedLabel, "tabular-nums")}>
                Patch notes · <time dateTime="2026-11-10">Tue 10 Nov 2026</time>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
                <h1 className="text-h1 uppercase tabular-nums md:text-display">
                  Patch 4.2
                </h1>
                <Badge
                  variant="secondary"
                  className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                >
                  Live
                </Badge>
              </div>
              <div className="mt-6 max-w-xl">
                <p>
                  Patch 4.2 adds Duel Pits, a new 2v2 mode, and brings a round
                  of balance changes. They slow the Cinderblade and Bulwark
                  front lines that ruled the first weeks of the season.
                </p>
                <p className="mt-3">
                  The servers were down for an hour, from 08:00 to 09:00 on
                  Tuesday, while the patch went in. Ranked ratings were not
                  touched.
                </p>
              </div>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 md:col-span-4 md:mt-0">
              {counts.map((count) => (
                <div key={count.name} className="border-t border-border py-3">
                  <dt className={mutedLabel}>{count.name}</dt>
                  <dd className="mt-2 font-mono text-h2 tabular-nums">
                    {count.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <nav aria-label="On this page" className="mt-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {onThisPage.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={cn(label, textLink)}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section id="new" className="mt-20">
          <h2 className={sectionHeading}>New</h2>
          <ul className="mt-6 border-b border-border">
            {additions.map((item) => (
              <li key={item.name} className="border-t border-border py-6">
                <article className={grid}>
                  <p className={cn(mutedLabel, "md:col-span-3")}>{item.kind}</p>
                  <div className="mt-2 md:col-span-9 md:mt-0">
                    <h3 className="text-h2">{item.name}</h3>
                    <p className="mt-3 max-w-xl">{item.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section id="balance" className="mt-20">
          <h2 className={sectionHeading}>Balance changes</h2>
          <p className="mt-3 max-w-xl">
            Figures are per hit or per use unless the change says otherwise.
          </p>
          <div
            role="group"
            aria-label="Show changes for"
            className="mt-6 flex flex-wrap gap-2"
          >
            {filters.map((name) => (
              <Button
                key={name}
                variant={name === filter ? "secondary" : "outline"}
                aria-pressed={name === filter}
                className={buttonClasses}
                onClick={() => setFilter(name)}
              >
                {name}
              </Button>
            ))}
          </div>
          <p aria-live="polite" className={cn(mutedLabel, "mt-3 tabular-nums")}>
            {countLine}
          </p>
          <div className="mt-6 min-w-0">
            <Table label="Balance changes" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className={headCell}>
                    Class
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Ability
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Stat
                  </TableHead>
                  <TableHead scope="col" className={cn(headCell, "text-right")}>
                    Before
                  </TableHead>
                  <TableHead scope="col" className={cn(headCell, "text-right")}>
                    After
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Change
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shownChanges.map((row) => (
                  <TableRow key={row.ability}>
                    <TableCell className={bodyCell}>{row.className}</TableCell>
                    <TableCell className={bodyCell}>{row.ability}</TableCell>
                    <TableCell className={bodyCell}>{row.stat}</TableCell>
                    <TableCell className={numberCell}>{row.before}</TableCell>
                    <TableCell className={numberCell}>{row.after}</TableCell>
                    <TableCell
                      className={cn(bodyCell, label, "text-foreground")}
                    >
                      {row.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-body text-muted-foreground">
            A shorter cooldown is a buff; a longer one is a nerf.
          </p>
        </section>

        <section id="fixes" className="mt-20">
          <h2 className={sectionHeading}>Fixes</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {fixGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-h2">{group.name}</h3>
                <ul className="mt-3 list-disc pl-6 text-body">
                  {group.fixes.map((fix, index) => (
                    <li key={fix} className={index > 0 ? "mt-2" : undefined}>
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="known" className="mt-20">
          <h2 className={sectionHeading}>Known issues</h2>
          <p className="mt-3 max-w-xl">
            The team is working on these and will fix them in patch 4.2.1.
          </p>
          <div className={cn(grid, "mt-6")}>
            <div className="rounded-xl border border-border bg-card p-6 md:col-span-8">
              <ul>
                {knownIssues.map((issue, index) => (
                  <li
                    key={issue.text}
                    className={
                      index > 0 ? "mt-3 border-t border-border pt-3" : undefined
                    }
                  >
                    <div className="flex items-start gap-2">
                      <TriangleAlert
                        className="mt-1 size-4 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-body">{issue.text}</p>
                        <p className={cn(mutedLabel, "mt-2")}>{issue.note}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className={sectionHeading}>Earlier patches</h2>
          <ul className="mt-6 border-b border-border">
            {earlierPatches.map((patch) => (
              <li
                key={patch.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-border py-3"
              >
                <a href="#" className={cn("text-body", textLink)}>
                  {patch.name}
                </a>
                <p className={cn(mutedLabel, "tabular-nums")}>
                  <time dateTime={patch.dateTime}>{patch.date}</time>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-20 border-t border-border py-12">
        <div className={container}>
          <div className={grid}>
            <div className="md:col-span-6">
              <p className="font-heading text-h2 uppercase">Ashfall</p>
              <p className="mt-2 text-body text-muted-foreground">
                A team arena game by Lowlight Games.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
              {pages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className={cn("text-body", textLink)}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(mutedLabel, "mt-12 tabular-nums")}>
            © 2026 Lowlight Games
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
