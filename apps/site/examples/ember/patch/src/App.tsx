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

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const CONTAINER = "mx-auto max-w-[1280px] px-3 md:px-6"
const LABEL = "font-mono text-label uppercase"
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const SECTION_H2 = "text-h2 uppercase md:text-h1"

const PAGES = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const CURRENT = "/patch"

type ClassName = "Bulwark" | "Cinderblade" | "Flarecaster" | "Mender"
const CLASSES: ClassName[] = ["Bulwark", "Cinderblade", "Flarecaster", "Mender"]

type BalanceChange = {
  hero: ClassName
  ability: string
  stat: string
  before: string
  after: string
  change: "Buff" | "Nerf"
}

const BALANCE: BalanceChange[] = [
  { hero: "Bulwark", ability: "Slag Wall", stat: "Wall health", before: "1,200", after: "1,050", change: "Nerf" },
  { hero: "Bulwark", ability: "Anchor Step", stat: "Cooldown", before: "14 s", after: "12 s", change: "Buff" },
  { hero: "Cinderblade", ability: "Coal Rush", stat: "Damage", before: "65", after: "60", change: "Nerf" },
  { hero: "Cinderblade", ability: "Backdraft", stat: "Duration", before: "1.5 s", after: "1.2 s", change: "Nerf" },
  { hero: "Flarecaster", ability: "Flare Bolt", stat: "Damage", before: "42", after: "45", change: "Buff" },
  { hero: "Flarecaster", ability: "Heat Haze", stat: "Radius", before: "6 m", after: "5 m", change: "Nerf" },
  { hero: "Mender", ability: "Mending Smoke", stat: "Healing a second", before: "30", after: "34", change: "Buff" },
  { hero: "Mender", ability: "Ash Veil", stat: "Cooldown", before: "20 s", after: "24 s", change: "Nerf" },
]

const NEW_THINGS = [
  {
    kind: "Mode",
    name: "Duel Pits",
    text: "A 2v2 mode on a small map, played as best of five rounds and kept out of ranked. It stays in rotation until Tuesday 1 December.",
  },
  {
    kind: "Feature",
    name: "Replay viewer",
    text: "Your last ten matches can now be watched again from your profile. Play them back at any speed, from any player's view.",
  },
  {
    kind: "Feature",
    name: "Ping wheel",
    text: "Hold a key to mark an enemy, an item or a place for your team. Each ping comes with a spoken line in every language the game has.",
  },
]

const FIXES = [
  {
    group: "Gameplay",
    items: [
      "Anchor Step could carry a Bulwark through the wall at the Glasswater Yard pump house; the wall now stops it.",
      "Backdraft sometimes hit a target twice when it was cast at point-blank range, and now hits once.",
      "Menders could heal through a closed door on Kiln Row, which no longer happens.",
      "A round could end in a draw when both last players fell on the same tick; the team that dealt the final hit now wins it.",
    ],
  },
  {
    group: "Interface",
    items: [
      "The scoreboard showed the wrong number of assists after a reconnect, and now keeps the right count.",
      "Ability cooldowns on the bottom bar froze after a respawn until the next cast; they now count down straight away.",
      "Party invites sent during the match loading screen were lost, and now wait for you in the lobby.",
    ],
  },
  {
    group: "Audio",
    items: [
      "Footsteps on metal floors were silent for the enemy team, and can be heard again.",
      "The Flare Bolt impact sound played twice for the caster, and now plays once.",
      "Voice lines cut off when two players pinged at the same time; both lines now play in turn.",
    ],
  },
]

const ISSUES = [
  {
    text: "Some players see a black screen for a few seconds when a Duel Pits round starts.",
    workaround: "Workaround · Use borderless",
  },
  {
    text: "Replays of matches longer than 40 minutes can stop before the end.",
    workaround: "No workaround yet",
  },
  {
    text: "The ping wheel does not open when it is bound to a mouse side button.",
    workaround: "Workaround · Bind it to a key",
  },
]

const EARLIER = [
  { name: "Patch 4.1", date: "2026-10-20", label: "Tue 20 Oct 2026" },
  { name: "Patch 4.0", date: "2026-10-06", label: "Tue 6 Oct 2026" },
]

function changesWord(n: number) {
  return `${n} ${n === 1 ? "change" : "changes"}`
}

function navLinkClass(href: string) {
  return cn(
    LABEL,
    "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
    href === CURRENT && "underline decoration-2",
    FOCUS
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
        className={cn(CONTAINER, "flex items-center justify-between gap-6 py-3")}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            FOCUS
          )}
        >
          Ashfall
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {PAGES.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === CURRENT ? "page" : undefined}
                  className={navLinkClass(page.href)}
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
          className={cn(BUTTON, "md:hidden")}
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
        <div className={cn(CONTAINER, "py-2")}>
          <ul>
            {PAGES.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === CURRENT ? "page" : undefined}
                  className={cn(navLinkClass(page.href), "block py-2")}
                  onClick={() => setOpen(false)}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Version() {
  const counts = [
    { term: "New", value: "3" },
    { term: "Balance", value: "8" },
    { term: "Fixes", value: "10" },
    { term: "Issues", value: "3" },
  ]

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-8">
          <p className={cn(LABEL, "text-muted-foreground")}>
            Patch notes ·{" "}
            <time dateTime="2026-11-10" className="tabular-nums">
              Tue 10 Nov 2026
            </time>
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
              Patch 4.2 opens Duel Pits, a new 2v2 mode for quick, tight
              fights. It also brings a round of balance that slows the
              Cinderblade and Bulwark front lines that ruled the first weeks of
              Season 4: Dry Lightning.
            </p>
            <p className="mt-3">
              The servers were down for one hour for the update, from 08:00 to
              09:00 on Tuesday 10 November. Ranked ratings were not touched:
              you keep the rating and the tier you had before.
            </p>
          </div>
        </div>
        <div className="mt-12 md:col-span-4 md:mt-0">
          <dl className="grid grid-cols-2 gap-x-6">
            {counts.map((count) => (
              <div key={count.term} className="border-t border-border py-3">
                <dt className={cn(LABEL, "text-muted-foreground")}>
                  {count.term}
                </dt>
                <dd className="mt-2 font-mono text-h2 tabular-nums">
                  {count.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
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
              <a href={link.href} className={cn(LABEL, TEXT_LINK)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}

function New() {
  return (
    <section id="new" className="mt-20">
      <h2 className={SECTION_H2}>New</h2>
      <ul className="mt-6 border-b border-border">
        {NEW_THINGS.map((item) => (
          <li key={item.name} className="border-t border-border py-6">
            <article className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
              <p className={cn(LABEL, "text-muted-foreground md:col-span-3")}>
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
  )
}

function Balance() {
  const [chosen, setChosen] = useState<ClassName | "All">("All")
  const rows =
    chosen === "All" ? BALANCE : BALANCE.filter((row) => row.hero === chosen)
  const cell = "px-3 py-2 first:pl-0 last:pr-0"
  const head = cn(LABEL, "px-3 text-muted-foreground first:pl-0 last:pr-0")

  return (
    <section id="balance" className="mt-20">
      <h2 className={SECTION_H2}>Balance changes</h2>
      <p className="mt-3 max-w-xl">
        Figures are per hit or per use, unless the change says otherwise.
      </p>
      <div
        role="group"
        aria-label="Show changes for"
        className="mt-6 flex flex-wrap gap-2"
      >
        {(["All", ...CLASSES] as const).map((option) => {
          const pressed = option === chosen
          return (
            <Button
              key={option}
              variant={pressed ? "secondary" : "outline"}
              aria-pressed={pressed}
              className={BUTTON}
              onClick={() => setChosen(option)}
            >
              {option}
            </Button>
          )
        })}
      </div>
      <p
        aria-live="polite"
        className={cn(LABEL, "mt-3 text-muted-foreground")}
      >
        {chosen === "All" ? "All classes" : chosen} · {changesWord(rows.length)}
      </p>
      <div className="mt-6">
        <Table label="Balance changes" className="min-w-2xl text-body">
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className={head}>
                Class
              </TableHead>
              <TableHead scope="col" className={head}>
                Ability
              </TableHead>
              <TableHead scope="col" className={head}>
                Stat
              </TableHead>
              <TableHead scope="col" className={cn(head, "text-right")}>
                Before
              </TableHead>
              <TableHead scope="col" className={cn(head, "text-right")}>
                After
              </TableHead>
              <TableHead scope="col" className={head}>
                Change
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.hero}-${row.ability}`}>
                <TableCell className={cell}>{row.hero}</TableCell>
                <TableCell className={cell}>{row.ability}</TableCell>
                <TableCell className={cell}>{row.stat}</TableCell>
                <TableCell
                  className={cn(cell, "text-right font-mono tabular-nums")}
                >
                  {row.before}
                </TableCell>
                <TableCell
                  className={cn(cell, "text-right font-mono tabular-nums")}
                >
                  {row.after}
                </TableCell>
                <TableCell className={cn(cell, LABEL, "text-foreground")}>
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
  )
}

function Fixes() {
  return (
    <section id="fixes" className="mt-20">
      <h2 className={SECTION_H2}>Fixes</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FIXES.map((group) => (
          <div key={group.group}>
            <h3 className="text-h2">{group.group}</h3>
            <ul className="mt-3 list-disc pl-6 text-body">
              {group.items.map((item, index) => (
                <li key={item} className={index > 0 ? "mt-2" : undefined}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function KnownIssues() {
  return (
    <section id="known" className="mt-20">
      <h2 className={SECTION_H2}>Known issues</h2>
      <p className="mt-3 max-w-xl">
        The team is working on these and will fix them in patch 4.2.1.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <div className="rounded-xl border border-border bg-card p-6 md:col-span-8">
          <ul>
            {ISSUES.map((issue, index) => (
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
                    <p className={cn(LABEL, "mt-2 text-muted-foreground")}>
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
  )
}

function EarlierPatches() {
  return (
    <section className="mt-20">
      <h2 className={SECTION_H2}>Earlier patches</h2>
      <ul className="mt-6 border-b border-border">
        {EARLIER.map((patch) => (
          <li
            key={patch.name}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-border py-3"
          >
            <a href="#" className={cn(TEXT_LINK, "text-body")}>
              {patch.name}
            </a>
            <p className={cn(LABEL, "text-muted-foreground")}>
              <time dateTime={patch.date} className="tabular-nums">
                {patch.label}
              </time>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2 uppercase">Ashfall</p>
            <p className="mt-2 text-body text-muted-foreground">
              A team arena game by Lowlight Games.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
            {PAGES.map((page) => (
              <li key={page.href}>
                <a href={page.href} className={cn(TEXT_LINK, "text-body")}>
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(LABEL, "mt-12 text-muted-foreground")}>
          © 2026 Lowlight Games
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(CONTAINER, "pt-12")}>
        <Version />
        <New />
        <Balance />
        <Fixes />
        <KnownIssues />
        <EarlierPatches />
      </main>
      <Footer />
    </div>
  )
}

export default App
