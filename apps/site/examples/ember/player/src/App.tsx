import { useRef, useState } from "react"
import type { KeyboardEvent } from "react"

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

const container = "mx-auto max-w-[1280px] px-3 md:px-6"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const mutedLabel = cn(label, "text-muted-foreground")
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focus
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const sectionHeading = "text-h2 uppercase md:text-h1"
const card = "rounded-xl border border-border bg-card p-6"
const meterTrack = "h-3 w-full border border-border bg-muted"
const rankMark = "size-3 shrink-0 rounded-sm"

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentPage = "/player"

const seasonFigures = [
  { name: "Rating", value: "2,418" },
  { name: "Matches", value: "383" },
  { name: "Wins", value: "212" },
  { name: "Win rate", value: "55.4%" },
]

const totalMatches = 383

const classes = [
  { id: "class-mender", name: "Mender", matches: 234, share: 61.1 },
  { id: "class-flarecaster", name: "Flarecaster", matches: 92, share: 24.0 },
  { id: "class-bulwark", name: "Bulwark", matches: 42, share: 11.0 },
  { id: "class-cinderblade", name: "Cinderblade", matches: 15, share: 3.9 },
]

// Under 20% is the low step, 20% to 49% the middle one, 50% and up the high one.
function heatFill(percent: number) {
  if (percent >= 50) return "bg-heat-high"
  if (percent >= 20) return "bg-heat-mid"
  return "bg-heat-low"
}

const seasonPass = { tier: 14, tiers: 60 }
const seasonPassPercent = (seasonPass.tier / seasonPass.tiers) * 100

type Match = {
  dateTime: string
  when: string
  mode: string
  playedAs: string
  result: "Win" | "Loss"
  rounds: string
  kda: string
  rating: string | null
}

const matches: Match[] = [
  {
    dateTime: "2026-11-12T09:40",
    when: "Thu 12 Nov · 09:40",
    mode: "Ranked Clash",
    playedAs: "Mender",
    result: "Win",
    rounds: "4–2",
    kda: "7 / 3 / 18",
    rating: "+21",
  },
  {
    dateTime: "2026-11-12T09:05",
    when: "Thu 12 Nov · 09:05",
    mode: "Ranked Clash",
    playedAs: "Mender",
    result: "Loss",
    rounds: "3–4",
    kda: "5 / 6 / 14",
    rating: "−17",
  },
  {
    dateTime: "2026-11-11T21:30",
    when: "Wed 11 Nov · 21:30",
    mode: "Ranked Clash",
    playedAs: "Flarecaster",
    result: "Win",
    rounds: "4–1",
    kda: "12 / 4 / 6",
    rating: "+19",
  },
  {
    dateTime: "2026-11-11T20:50",
    when: "Wed 11 Nov · 20:50",
    mode: "Duel Pits",
    playedAs: "Mender",
    result: "Win",
    rounds: "3–2",
    kda: "6 / 5 / 9",
    rating: null,
  },
  {
    dateTime: "2026-11-10T22:10",
    when: "Tue 10 Nov · 22:10",
    mode: "Ranked Clash",
    playedAs: "Mender",
    result: "Win",
    rounds: "4–3",
    kda: "4 / 2 / 22",
    rating: "+16",
  },
  {
    dateTime: "2026-11-10T21:25",
    when: "Tue 10 Nov · 21:25",
    mode: "Ranked Clash",
    playedAs: "Bulwark",
    result: "Loss",
    rounds: "1–4",
    kda: "3 / 7 / 5",
    rating: "−22",
  },
  {
    dateTime: "2026-11-09T20:15",
    when: "Mon 9 Nov · 20:15",
    mode: "Ranked Clash",
    playedAs: "Mender",
    result: "Win",
    rounds: "4–0",
    kda: "8 / 1 / 16",
    rating: "+24",
  },
  {
    dateTime: "2026-11-09T19:30",
    when: "Mon 9 Nov · 19:30",
    mode: "Quick Clash",
    playedAs: "Cinderblade",
    result: "Loss",
    rounds: "2–4",
    kda: "6 / 8 / 3",
    rating: null,
  },
]

const rarityFill = {
  Legendary: "bg-heat-high",
  Rare: "bg-heat-mid",
  Common: "bg-heat-low",
}

const achievements: {
  name: string
  rarity: keyof typeof rarityFill
  text: string
  dateTime: string
  date: string
}[] = [
  {
    name: "Smoke and mirrors",
    rarity: "Legendary",
    text: "Healed 500,000 health as Mender in one season.",
    dateTime: "2026-11-08",
    date: "Sun 8 Nov",
  },
  {
    name: "Top twenty",
    rarity: "Rare",
    text: "Reached the global top 20 in Ranked Clash.",
    dateTime: "2026-11-07",
    date: "Sat 7 Nov",
  },
  {
    name: "Last wall",
    rarity: "Rare",
    text: "Won a round as the last Bulwark standing.",
    dateTime: "2026-10-20",
    date: "Tue 20 Oct",
  },
  {
    name: "First light",
    rarity: "Common",
    text: "Won the first ranked match of a season.",
    dateTime: "2026-10-06",
    date: "Tue 6 Oct",
  },
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
      <div
        className={cn(container, "flex items-center justify-between gap-6 py-3")}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            focus
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
          ref={menuButton}
          variant="outline"
          className={cn(buttonClasses, "md:hidden")}
          aria-expanded={open}
          aria-controls="small-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="small-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          <ul>
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === currentPage ? "page" : undefined}
                  onClick={() => setOpen(false)}
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
  )
}

function SiteFooter() {
  return (
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
                <a href={page.href} className={cn(textLink, "text-body")}>
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
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className={cn(container, "pt-12")}>
        <section className={grid}>
          <div className="md:col-span-8">
            <div className="flex items-start gap-6">
              <div
                aria-hidden="true"
                className="flex size-20 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground md:size-32"
              >
                <span className="font-heading text-h1">JV</span>
              </div>
              <div className="min-w-0">
                <p className={mutedLabel}>Player · Europe · Mender</p>
                <h1 className="mt-2 text-h1 uppercase">Juno Vane</h1>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-foreground"
                  />
                  <p className={cn(label, "min-w-0 text-foreground")}>
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
                <p className={cn(mutedLabel, "mt-2")}>
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

          <div className="mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <p id="global-rank-label" className={mutedLabel}>
              Global rank
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p
                aria-describedby="global-rank-label"
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
              <span
                aria-hidden="true"
                className={cn(rankMark, "bg-heat-low")}
              />
              <p className="text-body">Cinder</p>
            </div>
            <p className={cn(mutedLabel, "mt-2 tabular-nums")}>
              Rank 6 in Europe
            </p>
          </div>
        </section>

        <section className="mt-20">
          <h2 className={sectionHeading}>Season 4</h2>
          <p className="mt-3 max-w-xl">
            These are Juno’s Ranked Clash figures since Season 4: Dry Lightning
            opened on{" "}
            <time dateTime="2026-10-06">Tuesday 6 October</time>.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 md:grid-cols-4">
            {seasonFigures.map((figure) => (
              <div key={figure.name} className="border-t border-border py-3">
                <dt className={mutedLabel}>{figure.name}</dt>
                <dd className="mt-2 font-mono text-h2 tabular-nums md:text-h1">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={cn(grid, "mt-20")}>
          <div className="md:col-span-7">
            <h2 className={sectionHeading}>Classes</h2>
            <p className="mt-3 max-w-xl">
              The share of this season’s ranked matches played on each class.
            </p>
            <ul className="mt-6 border-b border-border">
              {classes.map((item) => (
                <li key={item.id} className="border-t border-border py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 id={item.id} className="text-h2">
                      {item.name}
                    </h3>
                    <p className={cn(mutedLabel, "tabular-nums")}>
                      {item.matches} {item.matches === 1 ? "match" : "matches"}
                      {" · "}
                      {item.share.toFixed(1)}%
                    </p>
                  </div>
                  <div
                    role="meter"
                    aria-labelledby={item.id}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.share}
                    aria-valuetext={`${item.share.toFixed(1)}% of matches, ${item.matches} of ${totalMatches}`}
                    className={cn(meterTrack, "mt-2")}
                  >
                    <div
                      className={cn("h-full", heatFill(item.share))}
                      style={{ width: `${item.share.toFixed(1)}%` }}
                    />
                  </div>
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
            <p id="season-pass-label" className={mutedLabel}>
              Season pass
            </p>
            <p className="mt-2">
              <span className="font-mono text-h1 tabular-nums">
                {seasonPass.tier}
              </span>
              <span className={cn(mutedLabel, "ml-2 tabular-nums")}>
                of {seasonPass.tiers}
              </span>
            </p>
            <div
              role="meter"
              aria-labelledby="season-pass-label"
              aria-valuemin={0}
              aria-valuemax={seasonPass.tiers}
              aria-valuenow={seasonPass.tier}
              aria-valuetext={`Tier ${seasonPass.tier} of ${seasonPass.tiers}`}
              className={cn(meterTrack, "mt-6")}
            >
              <div
                className={cn("h-full", heatFill(seasonPassPercent))}
                style={{ width: `${seasonPassPercent.toFixed(1)}%` }}
              />
            </div>
            <p className="mt-3 text-body">
              46 tiers to go, and 61 days left in the season.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <h2 className={sectionHeading}>Recent matches</h2>
          <p className={cn(mutedLabel, "mt-3 tabular-nums")}>
            Last 8 · 5 wins · 3 losses
          </p>
          <div className="mt-6 min-w-0">
            <Table label="Recent matches" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">When</TableHead>
                  <TableHead scope="col">Mode</TableHead>
                  <TableHead scope="col">Class</TableHead>
                  <TableHead scope="col">Result</TableHead>
                  <TableHead scope="col" className="text-right">
                    Rounds
                  </TableHead>
                  <TableHead scope="col" className="text-right">
                    <abbr title="Kills, deaths and assists">K / D / A</abbr>
                  </TableHead>
                  <TableHead scope="col" className="text-right">
                    Rating
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.dateTime}>
                    <TableCell>
                      <time
                        dateTime={match.dateTime}
                        className="font-mono tabular-nums"
                      >
                        {match.when}
                      </time>
                    </TableCell>
                    <TableCell>{match.mode}</TableCell>
                    <TableCell>{match.playedAs}</TableCell>
                    <TableCell>{match.result}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {match.rounds}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {match.kda}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
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

        <section className="mt-20">
          <h2 className={sectionHeading}>Achievements</h2>
          <p className={cn(mutedLabel, "mt-3 tabular-nums")}>4 of 52 earned</p>
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item) => (
              <li key={item.name} className={card}>
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(rankMark, rarityFill[item.rarity])}
                  />
                  <p className={mutedLabel}>{item.rarity}</p>
                </div>
                <h3 className="mt-2 text-h2">{item.name}</h3>
                <p className="mt-3">{item.text}</p>
                <p className={cn(mutedLabel, "mt-3")}>
                  Earned{" "}
                  <time dateTime={item.dateTime} className="tabular-nums">
                    {item.date}
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
