import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const navLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const label = "font-mono text-label uppercase"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const card = "rounded-xl border border-border bg-card p-6"
const sectionHeading = "text-h2 uppercase md:text-h1"

const navItems = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentHref = "/player"

type Heat = "bg-heat-low" | "bg-heat-mid" | "bg-heat-high"

function heatFor(percent: number): Heat {
  if (percent < 20) return "bg-heat-low"
  if (percent < 50) return "bg-heat-mid"
  return "bg-heat-high"
}

const classes = [
  { id: "class-mender", name: "Mender", matches: 234, share: 61.1 },
  { id: "class-flarecaster", name: "Flarecaster", matches: 92, share: 24.0 },
  { id: "class-bulwark", name: "Bulwark", matches: 42, share: 11.0 },
  { id: "class-cinderblade", name: "Cinderblade", matches: 15, share: 3.9 },
]
const totalMatches = 383

function matchCount(n: number) {
  return `${n} ${n === 1 ? "match" : "matches"}`
}

type Match = {
  date: string
  when: string
  mode: string
  className: string
  result: "Win" | "Loss"
  rounds: string
  kda: string
  rating: string | null
}

const matches: Match[] = [
  {
    date: "2026-11-12T09:40",
    when: "Thu 12 Nov · 09:40",
    mode: "Ranked Clash",
    className: "Mender",
    result: "Win",
    rounds: "4–2",
    kda: "7 / 3 / 18",
    rating: "+21",
  },
  {
    date: "2026-11-12T09:05",
    when: "Thu 12 Nov · 09:05",
    mode: "Ranked Clash",
    className: "Mender",
    result: "Loss",
    rounds: "3–4",
    kda: "5 / 6 / 14",
    rating: "−17",
  },
  {
    date: "2026-11-11T21:30",
    when: "Wed 11 Nov · 21:30",
    mode: "Ranked Clash",
    className: "Flarecaster",
    result: "Win",
    rounds: "4–1",
    kda: "12 / 4 / 6",
    rating: "+19",
  },
  {
    date: "2026-11-11T20:50",
    when: "Wed 11 Nov · 20:50",
    mode: "Duel Pits",
    className: "Mender",
    result: "Win",
    rounds: "3–2",
    kda: "6 / 5 / 9",
    rating: null,
  },
  {
    date: "2026-11-10T22:10",
    when: "Tue 10 Nov · 22:10",
    mode: "Ranked Clash",
    className: "Mender",
    result: "Win",
    rounds: "4–3",
    kda: "4 / 2 / 22",
    rating: "+16",
  },
  {
    date: "2026-11-10T21:25",
    when: "Tue 10 Nov · 21:25",
    mode: "Ranked Clash",
    className: "Bulwark",
    result: "Loss",
    rounds: "1–4",
    kda: "3 / 7 / 5",
    rating: "−22",
  },
  {
    date: "2026-11-09T20:15",
    when: "Mon 9 Nov · 20:15",
    mode: "Ranked Clash",
    className: "Mender",
    result: "Win",
    rounds: "4–0",
    kda: "8 / 1 / 16",
    rating: "+24",
  },
  {
    date: "2026-11-09T19:30",
    when: "Mon 9 Nov · 19:30",
    mode: "Quick Clash",
    className: "Cinderblade",
    result: "Loss",
    rounds: "2–4",
    kda: "6 / 8 / 3",
    rating: null,
  },
]

const achievements: {
  name: string
  rarity: string
  heat: Heat
  text: string
  date: string
  dateLabel: string
}[] = [
  {
    name: "Smoke and mirrors",
    rarity: "Legendary",
    heat: "bg-heat-high",
    text: "Heal 500,000 health as Mender in one season.",
    date: "2026-11-08",
    dateLabel: "Sun 8 Nov",
  },
  {
    name: "Top twenty",
    rarity: "Rare",
    heat: "bg-heat-mid",
    text: "Reach the global top 20 in Ranked Clash.",
    date: "2026-11-07",
    dateLabel: "Sat 7 Nov",
  },
  {
    name: "Last wall",
    rarity: "Rare",
    heat: "bg-heat-mid",
    text: "Win a round as the last Bulwark standing.",
    date: "2026-10-20",
    dateLabel: "Tue 20 Oct",
  },
  {
    name: "First light",
    rarity: "Common",
    heat: "bg-heat-low",
    text: "Win the first ranked match of a season.",
    date: "2026-10-06",
    dateLabel: "Tue 6 Oct",
  },
]

const headCell = cn("px-3 first:pl-0 last:pr-0", label, "text-muted-foreground")
const bodyCell = "px-3 py-2 first:pl-0 last:pr-0"
const numberCell = "text-right font-mono tabular-nums"

function RankMark({ heat }: { heat: Heat }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-3 shrink-0 rounded-sm", heat)}
    />
  )
}

function Meter({
  labelledBy,
  value,
  max,
  valueText,
  percent,
  heat,
  className,
}: {
  labelledBy: string
  value: number
  max: number
  valueText: string
  percent: number
  heat: Heat
  className?: string
}) {
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      aria-labelledby={labelledBy}
      className={cn("h-3 w-full border border-border bg-muted", className)}
    >
      <div className={cn("h-full", heat)} style={{ width: `${percent}%` }} />
    </div>
  )
}

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
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-3 py-3 md:px-6">
        <a href="/" className={cn("font-heading text-h2 uppercase", titleLink)}>
          Ashfall
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navItems.map((item) => {
              const current = item.href === currentHref
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(navLink, current && "underline decoration-2")}
                  >
                    {item.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonClasses, "md:hidden")}
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
        <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-6">
          <ul>
            {navItems.map((item) => {
              const current = item.href === currentHref
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      navLink,
                      "block py-2",
                      current && "underline decoration-2"
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-3 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2 uppercase">Ashfall</p>
            <p className="mt-2 text-body text-muted-foreground">
              A team arena game by Lowlight Games.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={textLink}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn("mt-12 text-muted-foreground", label)}>
          © 2026 Lowlight Games
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-3 pt-12 md:px-6">
        {/* 2. Player head */}
        <section
          aria-labelledby="player-name"
          className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
          <div className="md:col-span-8">
            <div className="flex items-start gap-6">
              <div
                aria-hidden="true"
                className="flex size-20 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground md:size-32"
              >
                <span className="font-heading text-h1">JV</span>
              </div>
              <div className="min-w-0">
                <p className={cn(label, "text-muted-foreground")}>
                  Player · Europe · Mender
                </p>
                <h1 id="player-name" className="mt-2 text-h1 uppercase">
                  Juno Vane
                </h1>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-foreground"
                  />
                  <p className={cn(label, "text-foreground")}>
                    Online
                    <span className="text-muted-foreground">
                      {" · Last match "}
                      <time
                        dateTime="2026-11-12T09:40"
                        className="tabular-nums"
                      >
                        09:40
                      </time>
                    </span>
                  </p>
                </div>
                <p className={cn("mt-2 text-muted-foreground", label)}>
                  Joined{" "}
                  <time dateTime="2025-03" className="tabular-nums">
                    Mar 2025
                  </time>
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
              >
                Play ranked
              </a>
              <a href="/leaderboard" className={textLink}>
                See the ranking
              </a>
            </div>
          </div>

          <div className="mt-12 md:col-span-4 md:mt-0">
            <p id="rank-label" className={cn(label, "text-muted-foreground")}>
              Global rank
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p
                aria-describedby="rank-label"
                className="font-mono text-h1 tabular-nums md:text-display"
              >
                18
              </p>
              <Badge
                variant="secondary"
                className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
              >
                Top 20
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <RankMark heat="bg-heat-low" />
              <p className="text-body">Cinder</p>
            </div>
            <p className={cn("mt-2 text-muted-foreground", label)}>
              Rank 6 in Europe
            </p>
          </div>
        </section>

        {/* 3. Season figures */}
        <section aria-labelledby="season-heading" className="mt-20">
          <h2 id="season-heading" className={sectionHeading}>
            Season 4
          </h2>
          <p className="mt-3 max-w-xl">
            These are Juno’s Ranked Clash figures for Season 4: Dry Lightning,
            counted since the season opened on Tuesday 6 October.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 md:grid-cols-4">
            {[
              ["Rating", "2,418"],
              ["Matches", "383"],
              ["Wins", "212"],
              ["Win rate", "55.4%"],
            ].map(([term, value]) => (
              <div key={term} className="border-t border-border py-3">
                <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
                <dd className="mt-2 font-mono text-h2 tabular-nums md:text-h1">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 4. Classes and season pass */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <h2 className={sectionHeading}>Classes</h2>
            <p className="mt-3 max-w-xl">
              The share of this season’s ranked matches Juno has played on each
              class.
            </p>
            <ul className="mt-6 border-b border-border">
              {classes.map((item) => (
                <li key={item.id} className="border-t border-border py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 id={item.id} className="text-h2">
                      {item.name}
                    </h3>
                    <p
                      className={cn(
                        label,
                        "text-muted-foreground tabular-nums"
                      )}
                    >
                      {matchCount(item.matches)} · {item.share.toFixed(1)}%
                    </p>
                  </div>
                  <Meter
                    className="mt-2"
                    labelledBy={item.id}
                    value={item.share}
                    max={100}
                    valueText={`${item.share.toFixed(1)}% of matches, ${item.matches} of ${totalMatches}`}
                    percent={item.share}
                    heat={heatFor(item.share)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              card,
              "mt-12 md:col-span-4 md:col-start-9 md:mt-0 md:self-start"
            )}
          >
            <p id="pass-label" className={cn(label, "text-muted-foreground")}>
              Season pass
            </p>
            <p className="mt-2">
              <span className="font-mono text-h1 tabular-nums">14</span>
              <span className={cn("ml-2 text-muted-foreground", label)}>
                of 60
              </span>
            </p>
            <Meter
              className="mt-6"
              labelledBy="pass-label"
              value={14}
              max={60}
              valueText="Tier 14 of 60"
              percent={23.3}
              heat="bg-heat-mid"
            />
            <p className="mt-3 text-body">
              46 tiers to go, and 61 days left in the season.
            </p>
          </div>
        </section>

        {/* 5. Recent matches */}
        <section aria-labelledby="matches-heading" className="mt-20">
          <h2 id="matches-heading" className={sectionHeading}>
            Recent matches
          </h2>
          <p className={cn("mt-3 text-muted-foreground", label)}>
            Last 8 · 5 wins · 3 losses
          </p>
          <div className="mt-6 min-w-0">
            <Table label="Recent matches" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className={headCell}>
                    When
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Mode
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Class
                  </TableHead>
                  <TableHead scope="col" className={headCell}>
                    Result
                  </TableHead>
                  <TableHead scope="col" className={cn(headCell, "text-right")}>
                    Rounds
                  </TableHead>
                  <TableHead scope="col" className={cn(headCell, "text-right")}>
                    <abbr title="Kills, deaths and assists">K / D / A</abbr>
                  </TableHead>
                  <TableHead scope="col" className={cn(headCell, "text-right")}>
                    Rating
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.date}>
                    <TableCell className={bodyCell}>
                      <time
                        dateTime={match.date}
                        className="font-mono tabular-nums"
                      >
                        {match.when}
                      </time>
                    </TableCell>
                    <TableCell className={bodyCell}>{match.mode}</TableCell>
                    <TableCell className={bodyCell}>
                      {match.className}
                    </TableCell>
                    <TableCell className={bodyCell}>{match.result}</TableCell>
                    <TableCell className={cn(bodyCell, numberCell)}>
                      {match.rounds}
                    </TableCell>
                    <TableCell className={cn(bodyCell, numberCell)}>
                      {match.kda}
                    </TableCell>
                    <TableCell className={cn(bodyCell, numberCell)}>
                      {match.rating ?? (
                        <>
                          <span aria-hidden="true">—</span>
                          <span className="sr-only">No change: unranked</span>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* 6. Achievements */}
        <section aria-labelledby="achievements-heading" className="mt-20">
          <h2 id="achievements-heading" className={sectionHeading}>
            Achievements
          </h2>
          <p className={cn("mt-3 text-muted-foreground", label)}>
            4 of 52 earned
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item) => (
              <li key={item.name} className={card}>
                <div className="flex items-center gap-2">
                  <RankMark heat={item.heat} />
                  <p className={cn(label, "text-muted-foreground")}>
                    {item.rarity}
                  </p>
                </div>
                <h3 className="mt-2 text-h2">{item.name}</h3>
                <p className="mt-3">{item.text}</p>
                <p className={cn("mt-3 text-muted-foreground", label)}>
                  Earned{" "}
                  <time dateTime={item.date} className="tabular-nums">
                    {item.dateLabel}
                  </time>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
