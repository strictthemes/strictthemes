import { useRef, useState, type KeyboardEvent } from "react"

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

/* ---------- Shared classes ---------- */

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const labelLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const currentLink = cn(
  label,
  "text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusRing
)
const mastheadLink = cn(
  "font-heading text-h2 text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"
const container = "mx-auto max-w-[1280px] px-4 md:px-6"
const sectionHead = "flex items-baseline justify-between gap-4 border-t-2 pt-2"
const sectionName = "font-mono text-label text-foreground uppercase"

/* ---------- Sample data ---------- */

const sections = [
  "News",
  "Politics",
  "City",
  "Sport",
  "Results",
  "Business",
  "Culture",
  "Opinion",
]
const currentSection = "Results"

type Competition = "coastal" | "cup" | "women"
type Filter = "all" | Competition

const competitions: { id: Competition; name: string; short: string }[] = [
  { id: "coastal", name: "Coastal League", short: "Coastal League" },
  { id: "cup", name: "County Cup", short: "County Cup" },
  { id: "women", name: "Women's Coastal League", short: "Women's League" },
]

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "coastal", label: "Coastal League" },
  { id: "cup", label: "County Cup" },
  { id: "women", label: "Women's League" },
]

type MatchState =
  | { kind: "ft" }
  | { kind: "aet" }
  | { kind: "pens"; home: number; away: number }
  | { kind: "live"; minute: number }

type Result = {
  id: string
  competition: Competition
  ground: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  state: MatchState
  scorers?: string
}

const results: Result[] = [
  {
    id: "pah-su",
    competition: "coastal",
    ground: "Harbour Road",
    home: "Port Avery Harriers",
    away: "Saltgate United",
    homeScore: 2,
    awayScore: 1,
    state: { kind: "ft" },
    scorers: "Okonjo 12', 58' · Brandt 71'",
  },
  {
    id: "wa-dc",
    competition: "coastal",
    ground: "Westmere Park",
    home: "Westmere Athletic",
    away: "Dunmore City",
    homeScore: 0,
    awayScore: 0,
    state: { kind: "ft" },
  },
  {
    id: "bt-cr",
    competition: "coastal",
    ground: "Quarry Field",
    home: "Brackwater Town",
    away: "Calloway Rovers",
    homeScore: 1,
    awayScore: 3,
    state: { kind: "ft" },
    scorers: "Pell 33' · Achebe 20', 64' · Lund 88'",
  },
  {
    id: "fa-hb",
    competition: "coastal",
    ground: "Albion Ground",
    home: "Fenwick Albion",
    away: "Holm Bay",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "live", minute: 67 },
    scorers: "Ferreira 9' · Diallo 52'",
  },
  {
    id: "kv-am",
    competition: "cup",
    ground: "Vale Park",
    home: "Kestrel Vale",
    away: "Ashby Marsh",
    homeScore: 2,
    awayScore: 1,
    state: { kind: "aet" },
    scorers: "Hale 40', 108' · Corbin 77'",
  },
  {
    id: "rh-ef",
    competition: "cup",
    ground: "Mariner's Field",
    home: "Rookhaven",
    away: "Elmsford",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "pens", home: 4, away: 3 },
    scorers: "Quist 55' · Bayo 81'",
  },
]

type Fixture = {
  id: string
  competition: Competition
  date: string
  time: string
  home: string
  away: string
  ground: string
}

const days: { date: string; label: string }[] = [
  { date: "2026-11-12", label: "Thu 12 Nov" },
  { date: "2026-11-13", label: "Fri 13 Nov" },
  { date: "2026-11-14", label: "Sat 14 Nov" },
  { date: "2026-11-15", label: "Sun 15 Nov" },
]

const fixtures: Fixture[] = [
  {
    id: "lq-sg",
    competition: "cup",
    date: "2026-11-12",
    time: "19:45",
    home: "Linton Quay",
    away: "Sorrel Green",
    ground: "Quayside",
  },
  {
    id: "tb-gt",
    competition: "cup",
    date: "2026-11-12",
    time: "19:45",
    home: "Thornbury",
    away: "Greyhaven Town",
    ground: "Hollins Lane",
  },
  {
    id: "dc-fa",
    competition: "coastal",
    date: "2026-11-14",
    time: "15:00",
    home: "Dunmore City",
    away: "Fenwick Albion",
    ground: "Mill Lane",
  },
  {
    id: "su-wa",
    competition: "coastal",
    date: "2026-11-14",
    time: "15:00",
    home: "Saltgate United",
    away: "Westmere Athletic",
    ground: "The Saltings",
  },
  {
    id: "hb-pah",
    competition: "coastal",
    date: "2026-11-15",
    time: "13:00",
    home: "Holm Bay",
    away: "Port Avery Harriers",
    ground: "Shore Road",
  },
  {
    id: "cr-bt",
    competition: "coastal",
    date: "2026-11-15",
    time: "15:00",
    home: "Calloway Rovers",
    away: "Brackwater Town",
    ground: "Bridge End",
  },
]

type Standing = {
  club: string
  w: number
  d: number
  l: number
  gd: number
}

// The table before today's matches: twelve games each.
const standings: Standing[] = [
  { club: "Port Avery Harriers", w: 8, d: 2, l: 2, gd: 14 },
  { club: "Saltgate United", w: 7, d: 3, l: 2, gd: 9 },
  { club: "Calloway Rovers", w: 6, d: 3, l: 3, gd: 5 },
  { club: "Dunmore City", w: 5, d: 4, l: 3, gd: 3 },
  { club: "Westmere Athletic", w: 4, d: 4, l: 4, gd: 0 },
  { club: "Fenwick Albion", w: 3, d: 3, l: 6, gd: -6 },
  { club: "Brackwater Town", w: 2, d: 4, l: 6, gd: -8 },
  { club: "Holm Bay", w: 1, d: 1, l: 10, gd: -17 },
]
const homeClub = "Port Avery Harriers"

/* ---------- Helpers ---------- */

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function ordinal(n: number) {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function penaltyWords(r: Result) {
  if (r.state.kind !== "pens") return ""
  const homeWins = r.state.home > r.state.away
  const winner = homeWins ? r.home : r.away
  const hi = Math.max(r.state.home, r.state.away)
  const lo = Math.min(r.state.home, r.state.away)
  return `${winner} win ${hi}–${lo} on penalties`
}

function winnerOf(r: Result): "home" | "away" | null {
  if (r.state.kind === "live") return null
  if (r.state.kind === "pens")
    return r.state.home > r.state.away ? "home" : "away"
  if (r.homeScore === r.awayScore) return null
  return r.homeScore > r.awayScore ? "home" : "away"
}

function matchLabel(r: Result) {
  const score = `${r.home} ${r.homeScore}, ${r.away} ${r.awayScore}`
  switch (r.state.kind) {
    case "ft":
      return `${score}, full time`
    case "aet":
      return `${score}, after extra time`
    case "pens":
      return `${score}, ${penaltyWords(r)}`
    case "live":
      return `${score}, live, ${ordinal(r.state.minute)} minute`
  }
}

function shows(filter: Filter, competition: Competition) {
  return filter === "all" || filter === competition
}

/* ---------- Parts ---------- */

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className={container}>
        <div className="flex items-center justify-between gap-4 py-2">
          <p className={cn(label, "text-muted-foreground")}>
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              Wednesday 11 November 2026
            </time>
          </p>
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              buttonClasses
            )}
          >
            Subscribe
          </a>
        </div>

        <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:border-b-0">
          <a href="/" className={mastheadLink}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="sections-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>

        <nav
          id="sections-menu"
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {sections.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === currentSection ? "page" : undefined}
                  className={cn(
                    name === currentSection ? currentLink : labelLink,
                    "block py-2"
                  )}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === currentSection ? "page" : undefined}
                  className={name === currentSection ? currentLink : labelLink}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function LiveMarker() {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-label text-primary uppercase">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-primary"
      />
      Live
    </span>
  )
}

function MatchStateLabel({ state }: { state: MatchState }) {
  if (state.kind === "live") {
    return (
      <span className="flex items-center gap-2">
        <LiveMarker />
        <span className="text-primary">{`${state.minute}'`}</span>
      </span>
    )
  }
  const text =
    state.kind === "ft" ? "FT" : state.kind === "aet" ? "AET" : "Pens"
  return <span className="text-foreground">{text}</span>
}

function ScoreBox({ result }: { result: Result }) {
  const winner = winnerOf(result)
  const sides = [
    { side: "home" as const, name: result.home, score: result.homeScore },
    { side: "away" as const, name: result.away, score: result.awayScore },
  ]

  return (
    <article
      aria-label={matchLabel(result)}
      className="flex min-w-0 flex-col gap-2 border bg-card p-4 md:p-6"
    >
      <div
        className={cn(
          label,
          "flex items-center justify-between gap-4 tabular-nums"
        )}
      >
        <span className="text-muted-foreground">{result.ground}</span>
        <MatchStateLabel state={result.state} />
      </div>

      {sides.map((s) => (
        <div key={s.side} className="flex items-baseline justify-between gap-4">
          <span className={cn("text-body", winner === s.side && "font-bold")}>
            {s.name}
          </span>
          <span className="font-mono text-h2 tabular-nums">{s.score}</span>
        </div>
      ))}

      {result.state.kind === "pens" && (
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          {penaltyWords(result)}
        </p>
      )}

      {result.scorers && (
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          {result.scorers}
        </p>
      )}
    </article>
  )
}

function SiteFooter() {
  return (
    <footer>
      <div className={cn(container, "flex flex-col gap-4 border-t-2 py-6")}>
        <a href="/" className={cn(mastheadLink, "self-start")}>
          The Port Avery Ledger
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((name) => (
              <li key={name}>
                <a href="#" className={labelLink}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground")}>
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

/* ---------- Page ---------- */

export function App() {
  const [filter, setFilter] = useState<Filter>("all")
  const [status, setStatus] = useState("")

  const shownResults = results.filter((r) => shows(filter, r.competition))
  const shownFixtures = fixtures.filter((f) => shows(filter, f.competition))
  const resultGroups = competitions
    .map((c) => ({
      competition: c,
      results: shownResults.filter((r) => r.competition === c.id),
    }))
    .filter((g) => g.results.length > 0)
  const fixtureDays = days
    .map((d) => ({
      day: d,
      fixtures: shownFixtures.filter((f) => f.date === d.date),
    }))
    .filter((d) => d.fixtures.length > 0)

  function choose(next: Filter) {
    if (next === filter) return
    const label = filters.find((f) => f.id === next)!.label
    const r = results.filter((x) => shows(next, x.competition)).length
    const f = fixtures.filter((x) => shows(next, x.competition)).length
    setFilter(next)
    setStatus(`${label}: ${count(r, "result")}, ${count(f, "fixture")}.`)
  }

  const chosenShort =
    filter === "all" ? "" : competitions.find((c) => c.id === filter)!.short
  const tableNote =
    "Top two go up · After 12 games · Before today" +
    (filter === "cup" || filter === "women" ? " · Not filtered" : "")

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />

      <main>
        <div className={cn(container, "flex flex-col gap-12 pt-6 pb-12")}>
          {/* Page head */}
          <div className="flex flex-col gap-4">
            <div className={sectionHead}>
              <p className={sectionName}>Sport</p>
            </div>
            <h1 className="text-h1 text-foreground uppercase md:text-display">
              Results
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className={cn(label, "text-muted-foreground")}>
                <time dateTime="2026-11-11" className="font-mono tabular-nums">
                  Wednesday 11 November 2026
                </time>
              </p>
              <div
                role="group"
                aria-label="Competition"
                className="flex flex-wrap gap-1"
              >
                {filters.map((f) => {
                  const chosen = f.id === filter
                  return (
                    <Button
                      key={f.id}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonClasses}
                      onClick={() => choose(f.id)}
                    >
                      {f.label}
                    </Button>
                  )
                })}
              </div>
            </div>
            <p role="status" className="sr-only">
              {status}
            </p>
          </div>

          {/* Today's results */}
          <section className="flex flex-col gap-4">
            <div className={sectionHead}>
              <h2 className={sectionName}>Today's results</h2>
            </div>
            {resultGroups.length === 0 ? (
              <p className="max-w-xl text-body">
                {`No ${chosenShort} matches today.`}
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {resultGroups.map((g) => (
                  <div key={g.competition.id} className="flex flex-col gap-2">
                    <h3 className={sectionName}>{g.competition.name}</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {g.results.map((r) => (
                        <ScoreBox key={r.id} result={r} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Table and fixtures */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <section className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6">
              <div className={sectionHead}>
                <h2 className={sectionName}>Coastal League table</h2>
              </div>
              <Table
                label="Coastal League table"
                className="min-w-lg text-body"
              >
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(label, "text-muted-foreground")}>
                      <abbr title="Position">Pos</abbr>
                    </TableHead>
                    <TableHead className={cn(label, "text-muted-foreground")}>
                      Club
                    </TableHead>
                    {(
                      [
                        ["P", "Played"],
                        ["W", "Won"],
                        ["D", "Drawn"],
                        ["L", "Lost"],
                        ["GD", "Goal difference"],
                        ["Pts", "Points"],
                      ] as const
                    ).map(([short, full]) => (
                      <TableHead
                        key={short}
                        className={cn(
                          label,
                          "text-right text-muted-foreground"
                        )}
                      >
                        <abbr title={full}>{short}</abbr>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((s, i) => {
                    const played = s.w + s.d + s.l
                    const points = 3 * s.w + s.d
                    return (
                      <TableRow key={s.club}>
                        <TableCell className="font-mono tabular-nums">
                          {i + 1}
                        </TableCell>
                        <TableCell
                          className={cn(s.club === homeClub && "font-bold")}
                        >
                          {s.club}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {played}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {s.w}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {s.d}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {s.l}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {signed(s.gd)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold tabular-nums">
                          {points}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <p className={cn(label, "text-muted-foreground tabular-nums")}>
                {tableNote}
              </p>
            </section>

            <section className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
              <div className={sectionHead}>
                <h2 className={sectionName}>Fixtures</h2>
              </div>
              {fixtureDays.length === 0 ? (
                <p className="max-w-xl text-body">
                  No fixtures in the next four days.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {fixtureDays.map(({ day, fixtures: list }) => (
                    <div key={day.date} className="flex flex-col gap-2">
                      <h3 className={sectionName}>
                        <time
                          dateTime={day.date}
                          className="font-mono tabular-nums"
                        >
                          {day.label}
                        </time>
                      </h3>
                      <ul className="flex flex-col gap-4">
                        {list.map((f, i) => (
                          <li
                            key={f.id}
                            className={cn(
                              "flex flex-col gap-1",
                              i > 0 && "border-t pt-4"
                            )}
                          >
                            <p className="text-body">
                              {f.home} v {f.away}
                            </p>
                            <p
                              className={cn(
                                label,
                                "text-muted-foreground tabular-nums"
                              )}
                            >
                              <time
                                dateTime={`${f.date}T${f.time}`}
                                className="font-mono tabular-nums"
                              >
                                {f.time}
                              </time>
                              {` · ${
                                competitions.find(
                                  (c) => c.id === f.competition
                                )!.name
                              } · ${f.ground}`}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
