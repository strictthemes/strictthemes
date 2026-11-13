import { useRef, useState, type KeyboardEvent } from "react"
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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)

const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]

const currentPage = "/patch"

type HeroClass = "Bulwark" | "Cinderblade" | "Flarecaster" | "Mender"
type Filter = "All" | HeroClass

const filters: Filter[] = [
  "All",
  "Bulwark",
  "Cinderblade",
  "Flarecaster",
  "Mender",
]

type BalanceChange = {
  heroClass: HeroClass
  ability: string
  stat: string
  before: string
  after: string
  change: "Buff" | "Nerf"
}

const balanceChanges: BalanceChange[] = [
  {
    heroClass: "Bulwark",
    ability: "Slag Wall",
    stat: "Wall health",
    before: "1,200",
    after: "1,050",
    change: "Nerf",
  },
  {
    heroClass: "Bulwark",
    ability: "Anchor Step",
    stat: "Cooldown",
    before: "14 s",
    after: "12 s",
    change: "Buff",
  },
  {
    heroClass: "Cinderblade",
    ability: "Coal Rush",
    stat: "Damage",
    before: "65",
    after: "60",
    change: "Nerf",
  },
  {
    heroClass: "Cinderblade",
    ability: "Backdraft",
    stat: "Duration",
    before: "1.5 s",
    after: "1.2 s",
    change: "Nerf",
  },
  {
    heroClass: "Flarecaster",
    ability: "Flare Bolt",
    stat: "Damage",
    before: "42",
    after: "45",
    change: "Buff",
  },
  {
    heroClass: "Flarecaster",
    ability: "Heat Haze",
    stat: "Radius",
    before: "6 m",
    after: "5 m",
    change: "Nerf",
  },
  {
    heroClass: "Mender",
    ability: "Mending Smoke",
    stat: "Healing a second",
    before: "30",
    after: "34",
    change: "Buff",
  },
  {
    heroClass: "Mender",
    ability: "Ash Veil",
    stat: "Cooldown",
    before: "20 s",
    after: "24 s",
    change: "Nerf",
  },
]

const newThings = [
  {
    kind: "Mode",
    name: "Duel Pits",
    text: "A 2v2 mode on a small map, played as a best of five rounds. It is unranked and stays in rotation until Tuesday 1 December.",
  },
  {
    kind: "Feature",
    name: "Replay viewer",
    text: "Your last ten matches can now be watched again from your profile. Play them back at any speed and from any player's view.",
  },
  {
    kind: "Feature",
    name: "Ping wheel",
    text: "Hold a key to mark an enemy, an item or a place for your team. Every ping comes with a spoken line in every language the game has.",
  },
]

const fixGroups = [
  {
    name: "Gameplay",
    items: [
      "Anchor Step could carry a Bulwark through the wall at the Glasswater Yard pump house; it now stops at the wall.",
      "Coal Rush sometimes hit a target twice when it was used next to a ledge, and now hits only once.",
      "A Mender who died while channelling Mending Smoke kept healing for a second after death, which no longer happens.",
      "The round timer in Duel Pits could keep running after the last player on a team fell, and now stops at once.",
    ],
  },
  {
    name: "Interface",
    items: [
      "The scoreboard showed the wrong class icon for players who swapped class in the first ten seconds, and now shows the right one.",
      "Cooldown numbers on the ability bar were cut off at large text sizes and now fit.",
      "The party invite stayed on screen after it had been accepted, and now closes on its own.",
    ],
  },
  {
    name: "Audio",
    items: [
      "Footsteps on metal floors in Glasswater Yard played from the wrong side, and now come from where the player is.",
      "The Flare Bolt impact sound was missing when it hit a Slag Wall, and plays again.",
      "Announcer lines could talk over each other at the start of a round, and now wait their turn.",
    ],
  },
]

const knownIssues = [
  {
    text: "The replay viewer can lose sound after you skip forward more than once.",
    workaround: "Workaround · Pause and play",
  },
  {
    text: "Some players see the Duel Pits queue time as zero while they are still waiting for a match.",
    workaround: "No workaround yet",
  },
  {
    text: "The ping wheel can stay open after you leave a match while holding its key.",
    workaround: "Workaround · Press the key again",
  },
]

function countText(filter: Filter, n: number) {
  const who = filter === "All" ? "All classes" : filter
  return `${who} · ${n} ${n === 1 ? "change" : "changes"}`
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [filter, setFilter] = useState<Filter>("All")

  const rows =
    filter === "All"
      ? balanceChanges
      : balanceChanges.filter((row) => row.heroClass === filter)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-3 py-3 md:px-6">
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
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
                    aria-current={
                      page.href === currentPage ? "page" : undefined
                    }
                    className={cn(
                      navLink,
                      page.href === currentPage && "underline decoration-2"
                    )}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-6">
            <ul>
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={
                      page.href === currentPage ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLink,
                      "block py-2",
                      page.href === currentPage && "underline decoration-2"
                    )}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[1280px] px-3 pt-12 md:px-6">
        {/* Version */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-8">
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
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
                  Patch 4.2 opens Duel Pits, a new 2v2 mode, and brings a round
                  of balance that slows down the Cinderblade and Bulwark front
                  lines that have ruled the first weeks of Season 4: Dry
                  Lightning.
                </p>
                <p className="mt-3">
                  The servers were down for an hour, from 08:00 to 09:00 on
                  Tuesday, while the patch went out. Ranked ratings were not
                  touched: your rating and tier are where you left them.
                </p>
              </div>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 md:col-span-4 md:mt-0">
              {[
                { term: "New", value: "3" },
                { term: "Balance", value: "8" },
                { term: "Fixes", value: "10" },
                { term: "Issues", value: "3" },
              ].map((entry) => (
                <div key={entry.term} className="border-t border-border py-3">
                  <dt className="font-mono text-label text-muted-foreground uppercase">
                    {entry.term}
                  </dt>
                  <dd className="mt-2 font-mono text-h2 tabular-nums">
                    {entry.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label="On this page" className="mt-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { name: "New", href: "#new" },
                { name: "Balance changes", href: "#balance" },
                { name: "Fixes", href: "#fixes" },
                { name: "Known issues", href: "#known" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "font-mono text-label text-foreground uppercase underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
                      focusRing
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* New */}
        <section id="new" className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">New</h2>
          <ul className="mt-6 border-b border-border">
            {newThings.map((item) => (
              <li key={item.name} className="border-t border-border py-6">
                <article className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
                  <p className="font-mono text-label text-muted-foreground uppercase md:col-span-3">
                    {item.kind}
                  </p>
                  <div className="mt-2 md:col-span-9 md:mt-0">
                    <h3 className="text-h2">{item.name}</h3>
                    <p className="mt-3 max-w-xl">{item.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Balance changes */}
        <section id="balance" className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Balance changes</h2>
          <p className="mt-3 max-w-xl">
            Figures are per hit or per use, unless the change says otherwise.
          </p>

          <div
            role="group"
            aria-label="Show changes for"
            className="mt-6 flex flex-wrap gap-2"
          >
            {filters.map((option) => (
              <Button
                key={option}
                variant={filter === option ? "secondary" : "outline"}
                aria-pressed={filter === option}
                className={buttonClasses}
                onClick={() => setFilter(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <p
            aria-live="polite"
            className="mt-3 font-mono text-label text-muted-foreground uppercase tabular-nums"
          >
            {countText(filter, rows.length)}
          </p>

          <div className="mt-6 min-w-0">
            <Table label="Balance changes" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  {[
                    "Class",
                    "Ability",
                    "Stat",
                    "Before",
                    "After",
                    "Change",
                  ].map((name) => (
                    <TableHead
                      key={name}
                      scope="col"
                      className={cn(
                        "px-3 font-mono text-label text-muted-foreground uppercase first:pl-0 last:pr-0",
                        (name === "Before" || name === "After") &&
                          "text-right tabular-nums"
                      )}
                    >
                      {name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={`${row.heroClass}-${row.ability}`}>
                    <TableCell className="px-3 py-2 first:pl-0 last:pr-0">
                      {row.heroClass}
                    </TableCell>
                    <TableCell className="px-3 py-2 first:pl-0 last:pr-0">
                      {row.ability}
                    </TableCell>
                    <TableCell className="px-3 py-2 first:pl-0 last:pr-0">
                      {row.stat}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                      {row.before}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right font-mono tabular-nums first:pl-0 last:pr-0">
                      {row.after}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-mono text-label text-foreground uppercase first:pl-0 last:pr-0">
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

        {/* Fixes */}
        <section id="fixes" className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Fixes</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 md:gap-x-6">
            {fixGroups.map((group, index) => (
              <div
                key={group.name}
                className={cn(index > 0 && "mt-12 md:mt-0")}
              >
                <h3 className="text-h2">{group.name}</h3>
                <ul className="mt-3 list-disc pl-6 text-body">
                  {group.items.map((item, itemIndex) => (
                    <li key={item} className={cn(itemIndex > 0 && "mt-2")}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Known issues */}
        <section id="known" className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Known issues</h2>
          <p className="mt-3 max-w-xl">
            The team is working on these and will fix them in patch 4.2.1.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="rounded-xl border border-border bg-card p-6 md:col-span-8">
              <ul>
                {knownIssues.map((issue, index) => (
                  <li
                    key={issue.text}
                    className={cn(
                      index > 0 && "mt-3 border-t border-border pt-3"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <TriangleAlert
                        className="mt-1 size-4 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-body">{issue.text}</p>
                        <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
                          {issue.workaround}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Earlier patches */}
        <section className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Earlier patches</h2>
          <ul className="mt-6 border-b border-border">
            {[
              {
                name: "Patch 4.1",
                date: "2026-10-20",
                label: "Tue 20 Oct 2026",
              },
              {
                name: "Patch 4.0",
                date: "2026-10-06",
                label: "Tue 6 Oct 2026",
              },
            ].map((patch) => (
              <li
                key={patch.name}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-border py-3"
              >
                <a href="#" className={cn(textLink, "text-body")}>
                  {patch.name}
                </a>
                <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                  <time dateTime={patch.date}>{patch.label}</time>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-20 border-t border-border py-12">
        <div className="mx-auto max-w-[1280px] px-3 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
            <div className="md:col-span-6">
              <p className="font-heading text-h2 uppercase">Ashfall</p>
              <p className="mt-2 text-body text-muted-foreground">
                A team arena game by Lowlight Games.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
              {pages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className={cn(textLink, "text-body")}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-12 font-mono text-label text-muted-foreground uppercase tabular-nums">
            © 2026 Lowlight Games
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
