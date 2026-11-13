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

const navLinkClass = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLinkClass = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)

const buttonClass = "h-auto px-6 py-2 font-mono text-label uppercase"

const mainLinks = [
  { label: "Game", href: "/" },
  { label: "Patch notes", href: "/patch" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Store", href: "/store" },
  { label: "Profile", href: "/player" },
]

const currentHref = "/patch"

type PlayerClass = "Bulwark" | "Cinderblade" | "Flarecaster" | "Mender"
type Filter = "All" | PlayerClass

const filters: Filter[] = [
  "All",
  "Bulwark",
  "Cinderblade",
  "Flarecaster",
  "Mender",
]

type BalanceChange = {
  playerClass: PlayerClass
  ability: string
  stat: string
  before: string
  after: string
  change: "Buff" | "Nerf"
}

const balanceChanges: BalanceChange[] = [
  {
    playerClass: "Bulwark",
    ability: "Slag Wall",
    stat: "Wall health",
    before: "1,200",
    after: "1,050",
    change: "Nerf",
  },
  {
    playerClass: "Bulwark",
    ability: "Anchor Step",
    stat: "Cooldown",
    before: "14 s",
    after: "12 s",
    change: "Buff",
  },
  {
    playerClass: "Cinderblade",
    ability: "Coal Rush",
    stat: "Damage",
    before: "65",
    after: "60",
    change: "Nerf",
  },
  {
    playerClass: "Cinderblade",
    ability: "Backdraft",
    stat: "Duration",
    before: "1.5 s",
    after: "1.2 s",
    change: "Nerf",
  },
  {
    playerClass: "Flarecaster",
    ability: "Flare Bolt",
    stat: "Damage",
    before: "42",
    after: "45",
    change: "Buff",
  },
  {
    playerClass: "Flarecaster",
    ability: "Heat Haze",
    stat: "Radius",
    before: "6 m",
    after: "5 m",
    change: "Nerf",
  },
  {
    playerClass: "Mender",
    ability: "Mending Smoke",
    stat: "Healing a second",
    before: "30",
    after: "34",
    change: "Buff",
  },
  {
    playerClass: "Mender",
    ability: "Ash Veil",
    stat: "Cooldown",
    before: "20 s",
    after: "24 s",
    change: "Nerf",
  },
]

const newItems = [
  {
    kind: "Mode",
    name: "Duel Pits",
    text: "Two teams of two fight on a small map, best of five rounds, and the result does not count towards your rating. Duel Pits stays in the rotation until Tuesday 1 December.",
  },
  {
    kind: "Feature",
    name: "Replay viewer",
    text: "Your last ten matches can now be watched again from your profile, at any speed. Follow the match from any player's view, your opponents included.",
  },
  {
    kind: "Feature",
    name: "Ping wheel",
    text: "Hold the ping key to mark an enemy, an item or a place for your team. Every mark comes with a spoken line in each language the game has.",
  },
]

const fixGroups = [
  {
    title: "Gameplay",
    items: [
      "Anchor Step could carry a Bulwark through the wall at the Glasswater Yard pump house; the wall now stops it.",
      "Backdraft sometimes went on cooldown without firing when it was used straight after Coal Rush, and now always fires.",
      "A Mender who died while channelling Mending Smoke kept healing for a second afterwards, which no longer happens.",
      "Players could get stuck on the crates by the east gate of Kiln Market, and those crates now have a clean edge.",
    ],
  },
  {
    title: "Interface",
    items: [
      "The scoreboard showed the wrong team's kill count for the first few seconds of a round, and now shows the right one.",
      "Ability cooldown timers on the bar could freeze at one second after a respawn, and they now count down to zero.",
      "The friends list did not update when a friend joined a match, and it now shows their status straight away.",
    ],
  },
  {
    title: "Audio",
    items: [
      "Footsteps on metal floors were silent for players on the far side of the map, and they can be heard again.",
      "The round-start horn sometimes played twice in Duel Pits test matches, and it now plays once.",
      "Flare Bolt's impact sound cut out when several bolts hit at once, and every hit now has its sound.",
    ],
  },
]

const knownIssues = [
  {
    text: "Some players see a black screen for a few seconds when they open the replay viewer for the first time.",
    workaround: "Workaround · Reopen the replay",
  },
  {
    text: "The ping wheel's spoken lines play in English for players who have chosen Polish or Turkish.",
    workaround: "No workaround yet",
  },
  {
    text: "Heat Haze can show its old, larger ring for a moment before the new radius takes over.",
    workaround: "Workaround · Recast Heat Haze",
  },
]

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [chosen, setChosen] = useState<Filter>("All")

  const shownChanges =
    chosen === "All"
      ? balanceChanges
      : balanceChanges.filter((row) => row.playerClass === chosen)
  const shownCount = shownChanges.length
  const countLine = `${chosen === "All" ? "All classes" : chosen} · ${shownCount} ${
    shownCount === 1 ? "change" : "changes"
  }`

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header
        className="border-b border-border"
        onKeyDown={handleHeaderKeyDown}
      >
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
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentHref ? "page" : undefined
                    }
                    className={cn(
                      navLinkClass,
                      link.href === currentHref && "underline decoration-2"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonClass, "md:hidden")}
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
          <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-6">
            <ul>
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentHref ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLinkClass,
                      "block py-2",
                      link.href === currentHref && "underline decoration-2"
                    )}
                  >
                    {link.label}
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
                  Tuesday, while we put the patch live. Ranked ratings were not
                  touched.
                </p>
              </div>
            </div>
            <div className="mt-12 md:col-span-4 md:mt-0">
              <dl className="grid grid-cols-2 gap-x-6">
                {[
                  { term: "New", value: 3 },
                  { term: "Balance", value: 8 },
                  { term: "Fixes", value: 10 },
                  { term: "Issues", value: 3 },
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
          </div>
          <nav aria-label="On this page" className="mt-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { label: "New", href: "#new" },
                { label: "Balance changes", href: "#balance" },
                { label: "Fixes", href: "#fixes" },
                { label: "Known issues", href: "#known" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "font-mono text-label uppercase",
                      textLinkClass
                    )}
                  >
                    {link.label}
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
            {newItems.map((item) => (
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
            Figures are per hit or per use unless the change says otherwise.
          </p>
          <div
            role="group"
            aria-label="Show changes for"
            className="mt-6 flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={filter === chosen ? "secondary" : "outline"}
                aria-pressed={filter === chosen}
                className={buttonClass}
                onClick={() => setChosen(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
          <p
            aria-live="polite"
            className="mt-3 font-mono text-label text-muted-foreground uppercase tabular-nums"
          >
            {countLine}
          </p>
          <div className="mt-6">
            <Table label="Balance changes" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  {[
                    { label: "Class", numeric: false },
                    { label: "Ability", numeric: false },
                    { label: "Stat", numeric: false },
                    { label: "Before", numeric: true },
                    { label: "After", numeric: true },
                    { label: "Change", numeric: false },
                  ].map((column) => (
                    <TableHead
                      key={column.label}
                      scope="col"
                      className={cn(
                        "px-3 font-mono text-label text-muted-foreground uppercase first:pl-0 last:pr-0",
                        column.numeric && "text-right tabular-nums"
                      )}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shownChanges.map((row) => (
                  <TableRow key={`${row.playerClass}-${row.ability}`}>
                    <TableCell className="px-3 py-2 first:pl-0 last:pr-0">
                      {row.playerClass}
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
            {fixGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                className={cn(groupIndex > 0 && "mt-12 md:mt-0")}
              >
                <h3 className="text-h2">{group.title}</h3>
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
            We are working on these and will fix them in patch 4.2.1.
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
                        <p>{issue.text}</p>
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
                <a href="#" className={cn("text-body", textLinkClass)}>
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
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn("text-body", textLinkClass)}
                  >
                    {link.label}
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
