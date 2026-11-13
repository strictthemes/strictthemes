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

type Region = "Europe" | "Americas" | "Asia-Pacific"
type Filter = "Global" | Region
type Tier = "Inferno" | "Blaze" | "Cinder"

type Player = {
  name: string
  region: Region
  rating: number
  wins: number
  matches: number
}

const VIEWER = "Juno Vane"

const PLAYERS: Player[] = [
  {
    name: "Hollow Finch",
    region: "Asia-Pacific",
    rating: 2961,
    wins: 301,
    matches: 490,
  },
  {
    name: "Red Static",
    region: "Europe",
    rating: 2904,
    wins: 288,
    matches: 484,
  },
  {
    name: "Quiet Arson",
    region: "Americas",
    rating: 2877,
    wins: 276,
    matches: 477,
  },
  {
    name: "Tin Saint",
    region: "Asia-Pacific",
    rating: 2842,
    wins: 254,
    matches: 432,
  },
  {
    name: "Moss Cannon",
    region: "Europe",
    rating: 2815,
    wins: 263,
    matches: 462,
  },
  {
    name: "Velvet Mortar",
    region: "Americas",
    rating: 2790,
    wins: 241,
    matches: 421,
  },
  {
    name: "Dune Kestrel",
    region: "Asia-Pacific",
    rating: 2761,
    wins: 230,
    matches: 406,
  },
  {
    name: "Ash Lantern",
    region: "Europe",
    rating: 2733,
    wins: 247,
    matches: 440,
  },
  {
    name: "Pale Rook",
    region: "Americas",
    rating: 2702,
    wins: 219,
    matches: 389,
  },
  {
    name: "Glass Hornet",
    region: "Asia-Pacific",
    rating: 2676,
    wins: 226,
    matches: 407,
  },
  {
    name: "Iron Wren",
    region: "Americas",
    rating: 2640,
    wins: 208,
    matches: 375,
  },
  {
    name: "Sour Comet",
    region: "Europe",
    rating: 2611,
    wins: 215,
    matches: 393,
  },
  {
    name: "Brass Heron",
    region: "Asia-Pacific",
    rating: 2583,
    wins: 198,
    matches: 364,
  },
  {
    name: "Cold Furnace",
    region: "Americas",
    rating: 2547,
    wins: 201,
    matches: 373,
  },
  {
    name: "Night Tinder",
    region: "Europe",
    rating: 2512,
    wins: 194,
    matches: 359,
  },
  {
    name: "Copper Wasp",
    region: "Asia-Pacific",
    rating: 2486,
    wins: 187,
    matches: 350,
  },
  {
    name: "Grey Volley",
    region: "Americas",
    rating: 2455,
    wins: 190,
    matches: 359,
  },
  {
    name: "Juno Vane",
    region: "Europe",
    rating: 2418,
    wins: 212,
    matches: 383,
  },
  {
    name: "Static Moth",
    region: "Europe",
    rating: 2390,
    wins: 176,
    matches: 336,
  },
]

const FILTERS: Filter[] = ["Global", "Europe", "Americas", "Asia-Pacific"]

const TIERS: { name: Tier; range: string; heat: string }[] = [
  { name: "Inferno", range: "2,800 and up", heat: "bg-heat-high" },
  { name: "Blaze", range: "2,600 to 2,799", heat: "bg-heat-mid" },
  { name: "Cinder", range: "Under 2,600", heat: "bg-heat-low" },
]

const NAV = [
  { label: "Game", href: "/" },
  { label: "Patch notes", href: "/patch" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Store", href: "/store" },
  { label: "Profile", href: "/player" },
]
const CURRENT = "/leaderboard"

const CONTAINER = "mx-auto max-w-[1280px] px-3 md:px-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const NAV_LINK = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"

function tierOf(rating: number): Tier {
  if (rating >= 2800) return "Inferno"
  if (rating >= 2600) return "Blaze"
  return "Cinder"
}

function heatOf(tier: Tier): string {
  return TIERS.find((t) => t.name === tier)!.heat
}

function winRate(p: Player): string {
  return `${((p.wins / p.matches) * 100).toFixed(1)}%`
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}

function playerCount(n: number): string {
  return `${n} ${n === 1 ? "player" : "players"}`
}

function RankMark({ tier }: { tier: Tier }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-3 shrink-0 rounded-sm", heatOf(tier))}
    />
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          CONTAINER,
          "flex items-center justify-between gap-6 py-3"
        )}
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
            {NAV.map((link) => {
              const current = link.href === CURRENT
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      NAV_LINK,
                      current && "underline decoration-2"
                    )}
                  >
                    {link.label}
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
          className={cn(BUTTON, "md:hidden")}
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
            {NAV.map((link) => {
              const current = link.href === CURRENT
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      NAV_LINK,
                      "block py-2",
                      current && "underline decoration-2"
                    )}
                  >
                    {link.label}
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
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={TEXT_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(LABEL, "mt-12 text-muted-foreground tabular-nums")}>
          © 2026 Lowlight Games
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [filter, setFilter] = useState<Filter>("Global")

  const shown = PLAYERS.filter(
    (p) => filter === "Global" || p.region === filter
  ).sort((a, b) => b.rating - a.rating)
  const viewerShown = shown.some((p) => p.name === VIEWER)

  const tierCounts = TIERS.map(
    (t) => PLAYERS.filter((p) => tierOf(p.rating) === t.name).length
  )

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />

      <main className={cn(CONTAINER, "pt-12")}>
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(LABEL, "text-muted-foreground tabular-nums")}>
              Season 4 · Ranked Clash · Week 6
            </p>
            <h1 className="mt-2 text-h1 uppercase md:text-display">Ranking</h1>
            <p className="mt-6 max-w-xl">
              The ladder ranks every player with at least 25 ranked matches this
              season by rating. It is updated every hour.
            </p>
            <p className={cn(LABEL, "mt-3 text-muted-foreground tabular-nums")}>
              Updated <time dateTime="2026-11-12T09:00">09:00</time>
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0 md:self-start">
            <p className={cn(LABEL, "text-muted-foreground")}>Your place</p>
            <p className="mt-2 font-heading text-h2">Juno Vane</p>
            <dl className="mt-3">
              {[
                { term: "Global rank", value: "18" },
                { term: "Europe rank", value: "6" },
                { term: "Rating", value: "2,418" },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-3 border-t border-border py-2"
                >
                  <dt className={cn(LABEL, "text-muted-foreground")}>
                    {row.term}
                  </dt>
                  <dd className="font-mono text-h2 tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href="/player"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                BUTTON,
                "mt-6"
              )}
            >
              Your profile
            </a>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Top players</h2>
          <div
            role="group"
            aria-label="Region"
            className="mt-6 flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const chosen = f === filter
              return (
                <Button
                  key={f}
                  variant={chosen ? "secondary" : "outline"}
                  aria-pressed={chosen}
                  onClick={() => setFilter(f)}
                  className={BUTTON}
                >
                  {f}
                </Button>
              )
            })}
          </div>
          <p
            aria-live="polite"
            className={cn(LABEL, "mt-3 text-muted-foreground tabular-nums")}
          >
            {filter} · {playerCount(shown.length)}
          </p>

          <div className="mt-6">
            <Table label="Ranking" className="min-w-2xl text-body">
              <TableHeader>
                <TableRow>
                  <TableHead
                    scope="col"
                    className={cn(LABEL, "px-3 text-muted-foreground")}
                  >
                    Rank
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(LABEL, "px-3 text-muted-foreground")}
                  >
                    Player
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(LABEL, "px-3 text-muted-foreground")}
                  >
                    Tier
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(LABEL, "px-3 text-muted-foreground")}
                  >
                    Region
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(
                      LABEL,
                      "px-3 text-right text-muted-foreground"
                    )}
                  >
                    Rating
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(
                      LABEL,
                      "px-3 text-right text-muted-foreground"
                    )}
                  >
                    Wins
                  </TableHead>
                  <TableHead
                    scope="col"
                    className={cn(
                      LABEL,
                      "px-3 text-right text-muted-foreground"
                    )}
                  >
                    Win rate
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map((p, index) => {
                  const rank = index + 1
                  const isViewer = p.name === VIEWER
                  const tier = tierOf(p.rating)
                  return (
                    <TableRow
                      key={p.name}
                      aria-current={isViewer ? "true" : undefined}
                    >
                      <TableCell
                        className={cn(
                          "px-3 py-2 font-mono tabular-nums",
                          isViewer && "relative"
                        )}
                      >
                        {isViewer && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-1 bg-heat-mid"
                          />
                        )}
                        {rank}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <a
                            href={isViewer ? "/player" : "#"}
                            className={TEXT_LINK}
                          >
                            {p.name}
                          </a>
                          {rank === 1 && (
                            <Badge
                              variant="secondary"
                              className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase tabular-nums"
                            >
                              Rank 1
                            </Badge>
                          )}
                          {isViewer && (
                            <span
                              className={cn(LABEL, "text-muted-foreground")}
                            >
                              You
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <RankMark tier={tier} />
                          <span>{tier}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2">{p.region}</TableCell>
                      <TableCell className="px-3 py-2 text-right font-mono tabular-nums">
                        {formatNumber(p.rating)}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right font-mono tabular-nums">
                        {formatNumber(p.wins)}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right font-mono tabular-nums">
                        {winRate(p)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {!viewerShown && (
            <p className="mt-3 text-body">
              You play in Europe, so you are not in this list.
            </p>
          )}
        </section>

        <section className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">Tiers</h2>
          <p className="mt-3 max-w-xl">
            Every player starts the season in Cinder and moves up or down a tier
            as their rating crosses its line.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((t, i) => (
              <li key={t.name} className="border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <RankMark tier={t.name} />
                  <span className="font-heading text-h2">{t.name}</span>
                </div>
                <p
                  className={cn(
                    LABEL,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  {t.range} · {playerCount(tierCounts[i])}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
