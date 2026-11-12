import { useEffect, useRef, useState } from "react"

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
const labelLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const mastheadLink = cn(
  "font-heading text-h2 text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const sectionHead = "flex items-baseline justify-between gap-4 border-t-2 pt-2"
const container = "mx-auto max-w-[1280px] px-4 md:px-6"

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

/* ---------- Sample data ---------- */

type Competition = "coastal" | "cup" | "women"

const competitions: { id: Competition; name: string; short: string }[] = [
  { id: "coastal", name: "Coastal League", short: "Coastal League" },
  { id: "cup", name: "County Cup", short: "County Cup" },
  { id: "women", name: "Women's Coastal League", short: "Women's League" },
]

type Filter = "all" | Competition

const filters: { id: Filter; name: string }[] = [
  { id: "all", name: "All" },
  { id: "coastal", name: "Coastal League" },
  { id: "cup", name: "County Cup" },
  { id: "women", name: "Women's League" },
]

type MatchState =
  | { kind: "ft" }
  | { kind: "live"; minute: number }
  | { kind: "aet" }
  | { kind: "pens"; winner: "home" | "away"; home: number; away: number }

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
    id: "pah-sal",
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
    id: "hol-wes",
    competition: "coastal",
    ground: "The Shingle",
    home: "Holm Bay",
    away: "Westmere Athletic",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "ft" },
    scorers: "Dacre 34' · Ferraz 80'",
  },
  {
    id: "cal-fen",
    competition: "coastal",
    ground: "Quarry Field",
    home: "Calloway Rovers",
    away: "Fenwick Albion",
    homeScore: 3,
    awayScore: 0,
    state: { kind: "ft" },
    scorers: "Mbeki 9', 77' · Lundqvist 44'",
  },
  {
    id: "dun-bra",
    competition: "coastal",
    ground: "Mill Lane",
    home: "Dunmore City",
    away: "Brackwater Town",
    homeScore: 1,
    awayScore: 2,
    state: { kind: "live", minute: 67 },
    scorers: "Rossiter 23', 61' · Hale 40'",
  },
  {
    id: "tar-kes",
    competition: "cup",
    ground: "Station Road",
    home: "Tarrow Vale",
    away: "Kestle Wanderers",
    homeScore: 3,
    awayScore: 2,
    state: { kind: "aet" },
    scorers: "Quinlan 18', 112' · Arendt 50' · Moyo 55', 88'",
  },
  {
    id: "roo-elm",
    competition: "cup",
    ground: "Abbey Field",
    home: "Rookhaven",
    away: "Elmsford",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "pens", winner: "home", home: 4, away: 3 },
    scorers: "Castell 27' · Ndiaye 63'",
  },
]

type Standing = {
  club: string
  w: number
  d: number
  l: number
  gd: number
}

// The Coastal League table as it stood before today's games.
const table: Standing[] = [
  { club: "Port Avery Harriers", w: 8, d: 2, l: 2, gd: 11 },
  { club: "Westmere Athletic", w: 7, d: 3, l: 2, gd: 8 },
  { club: "Saltgate United", w: 6, d: 3, l: 3, gd: 5 },
  { club: "Dunmore City", w: 5, d: 3, l: 4, gd: 1 },
  { club: "Calloway Rovers", w: 4, d: 3, l: 5, gd: 0 },
  { club: "Brackwater Town", w: 4, d: 2, l: 6, gd: -4 },
  { club: "Fenwick Albion", w: 2, d: 3, l: 7, gd: -9 },
  { club: "Holm Bay", w: 1, d: 3, l: 8, gd: -12 },
]
const homeClub = "Port Avery Harriers"

type Fixture = {
  id: string
  competition: Competition
  date: string
  time: string
  home: string
  away: string
  ground: string
}

const fixtureDays = [
  { date: "2026-11-12", label: "Thu 12 Nov" },
  { date: "2026-11-13", label: "Fri 13 Nov" },
  { date: "2026-11-14", label: "Sat 14 Nov" },
  { date: "2026-11-15", label: "Sun 15 Nov" },
]

const fixtures: Fixture[] = [
  {
    id: "mar-pen",
    competition: "cup",
    date: "2026-11-12",
    time: "19:45",
    home: "Marlow Heath",
    away: "Pennick Town",
    ground: "Heath Lane",
  },
  {
    id: "ash-gre",
    competition: "cup",
    date: "2026-11-12",
    time: "19:45",
    home: "Ashby Quay",
    away: "Greystone",
    ground: "The Quayside",
  },
  {
    id: "dun-fen",
    competition: "coastal",
    date: "2026-11-14",
    time: "15:00",
    home: "Dunmore City",
    away: "Fenwick Albion",
    ground: "Mill Lane",
  },
  {
    id: "sal-hol",
    competition: "coastal",
    date: "2026-11-14",
    time: "15:00",
    home: "Saltgate United",
    away: "Holm Bay",
    ground: "Salt Street",
  },
  {
    id: "wes-pah",
    competition: "coastal",
    date: "2026-11-15",
    time: "13:00",
    home: "Westmere Athletic",
    away: "Port Avery Harriers",
    ground: "Westmere Park",
  },
  {
    id: "bra-cal",
    competition: "coastal",
    date: "2026-11-15",
    time: "15:00",
    home: "Brackwater Town",
    away: "Calloway Rovers",
    ground: "The Marshes",
  },
]

/* ---------- Helpers ---------- */

function plural(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function ordinal(n: number) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`
}

function pensWinnerLine(r: Result) {
  if (r.state.kind !== "pens") return ""
  const winner = r.state.winner === "home" ? r.home : r.away
  const hi = Math.max(r.state.home, r.state.away)
  const lo = Math.min(r.state.home, r.state.away)
  return `${winner} win ${hi}–${lo} on penalties`
}

function matchLabel(r: Result) {
  const score = `${r.home} ${r.homeScore}, ${r.away} ${r.awayScore}`
  switch (r.state.kind) {
    case "ft":
      return `${score}, full time`
    case "live":
      return `${score}, live, ${ordinal(r.state.minute)} minute`
    case "aet":
      return `${score}, after extra time`
    case "pens":
      return `${score}, ${pensWinnerLine(r)}`
  }
}

function winnerOf(r: Result): "home" | "away" | null {
  if (r.state.kind === "live") return null
  if (r.state.kind === "pens") return r.state.winner
  if (r.homeScore > r.awayScore) return "home"
  if (r.awayScore > r.homeScore) return "away"
  return null
}

/* ---------- Header ---------- */

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
    <header>
      <div className={container}>
        <div className="flex items-center justify-between gap-4 py-2">
          <p className={cn(label, "text-muted-foreground")}>
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              Wednesday 11 November 2026
            </time>
          </p>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>

        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <a href="/" className={mastheadLink}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-sections"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>

        <nav
          id="mobile-sections"
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul className={label}>
            {sections.map((name) => (
              <li key={name}>
                <SectionLink name={name} className="block py-2" />
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className={cn("flex flex-wrap gap-x-6 gap-y-2", label)}>
            {sections.map((name) => (
              <li key={name}>
                <SectionLink name={name} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SectionLink({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const current = name === currentSection
  return (
    <a
      href="#"
      aria-current={current ? "page" : undefined}
      className={cn(
        labelLink,
        current && "underline decoration-2 underline-offset-4",
        className
      )}
    >
      {name}
    </a>
  )
}

/* ---------- Page parts ---------- */

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
        <span className={cn(label, "text-primary tabular-nums")}>
          {state.minute}'
        </span>
      </span>
    )
  }
  const text = state.kind === "ft" ? "FT" : state.kind === "aet" ? "AET" : "PENS"
  return <span className="text-foreground">{text}</span>
}

function ScoreBox({ result }: { result: Result }) {
  const winner = winnerOf(result)
  const rows = [
    { side: "home" as const, name: result.home, score: result.homeScore },
    { side: "away" as const, name: result.away, score: result.awayScore },
  ]
  return (
    <article
      aria-label={matchLabel(result)}
      className="flex flex-col gap-2 border bg-card p-4 md:p-6"
    >
      <div
        className={cn(label, "flex items-center justify-between gap-4")}
      >
        <span className="text-muted-foreground">{result.ground}</span>
        <MatchStateLabel state={result.state} />
      </div>
      {rows.map((row) => (
        <div
          key={row.side}
          className="flex items-baseline justify-between gap-4"
        >
          <span className={cn("text-body", winner === row.side && "font-bold")}>
            {row.name}
          </span>
          <span className="font-mono text-h2 tabular-nums">{row.score}</span>
        </div>
      ))}
      {result.state.kind === "pens" && (
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          {pensWinnerLine(result)}
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

function TodaysResults({ filter }: { filter: Filter }) {
  const groups = competitions
    .filter((c) => filter === "all" || c.id === filter)
    .map((c) => ({
      competition: c,
      results: results.filter((r) => r.competition === c.id),
    }))
    .filter((g) => g.results.length > 0)

  const chosen = competitions.find((c) => c.id === filter)

  return (
    <section className="flex flex-col gap-4">
      <div className={sectionHead}>
        <h2 className="font-mono text-label text-foreground uppercase">
          Today's results
        </h2>
      </div>
      {groups.length === 0 && chosen ? (
        <p className="max-w-xl text-body">
          No {chosen.short} matches today.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.competition.id} className="flex flex-col gap-2">
              <h3 className="font-mono text-label text-foreground uppercase">
                {g.competition.name}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {g.results.map((r) => (
                  <ScoreBox key={r.id} result={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const headCell = "font-mono text-label text-muted-foreground uppercase"
const numberCell = "text-right font-mono tabular-nums"

function LeagueTable({ filter }: { filter: Filter }) {
  const notFiltered = filter !== "all" && filter !== "coastal"
  return (
    <section className="flex flex-col gap-4">
      <div className={sectionHead}>
        <h2 className="font-mono text-label text-foreground uppercase">
          Coastal League table
        </h2>
      </div>
      <Table label="Coastal League table" className="min-w-lg text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={headCell}>
              <abbr title="Position">Pos</abbr>
            </TableHead>
            <TableHead className={headCell}>Club</TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Played">P</abbr>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Won">W</abbr>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Drawn">D</abbr>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Lost">L</abbr>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Goal difference">GD</abbr>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <abbr title="Points">Pts</abbr>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.map((row, index) => (
            <TableRow key={row.club}>
              <TableCell className="font-mono tabular-nums">
                {index + 1}
              </TableCell>
              <TableCell className={cn(row.club === homeClub && "font-bold")}>
                {row.club}
              </TableCell>
              <TableCell className={numberCell}>
                {row.w + row.d + row.l}
              </TableCell>
              <TableCell className={numberCell}>{row.w}</TableCell>
              <TableCell className={numberCell}>{row.d}</TableCell>
              <TableCell className={numberCell}>{row.l}</TableCell>
              <TableCell className={numberCell}>{signed(row.gd)}</TableCell>
              <TableCell className={cn(numberCell, "font-bold")}>
                {3 * row.w + row.d}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className={cn(label, "text-muted-foreground tabular-nums")}>
        Top two go up · After 12 games{notFiltered && " · Not filtered"}
      </p>
    </section>
  )
}

function Fixtures({ filter }: { filter: Filter }) {
  const days = fixtureDays
    .map((day) => ({
      ...day,
      fixtures: fixtures.filter(
        (f) =>
          f.date === day.date && (filter === "all" || f.competition === filter)
      ),
    }))
    .filter((day) => day.fixtures.length > 0)

  return (
    <section className="flex flex-col gap-4">
      <div className={sectionHead}>
        <h2 className="font-mono text-label text-foreground uppercase">
          Fixtures
        </h2>
      </div>
      {days.length === 0 ? (
        <p className="max-w-xl text-body">No fixtures in the next four days.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <h3 className="font-mono text-label text-foreground uppercase">
                <time dateTime={day.date} className="font-mono tabular-nums">
                  {day.label}
                </time>
              </h3>
              <ul className="flex flex-col gap-4">
                {day.fixtures.map((f, index) => (
                  <li
                    key={f.id}
                    className={cn(
                      "flex flex-col gap-1",
                      index > 0 && "border-t pt-4"
                    )}
                  >
                    <p className="text-body">
                      {f.home} v {f.away}
                    </p>
                    <p className={cn(label, "text-muted-foreground")}>
                      <time
                        dateTime={`${f.date}T${f.time}`}
                        className="font-mono tabular-nums"
                      >
                        {f.time}
                      </time>
                      {" · "}
                      {competitions.find((c) => c.id === f.competition)?.name}
                      {" · "}
                      {f.ground}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
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
          <ul className={cn("flex flex-wrap gap-x-6 gap-y-2", label)}>
            {sections.map((name) => (
              <li key={name}>
                <a href="#" className={labelLink}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
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

  function choose(next: Filter) {
    if (next === filter) return
    setFilter(next)
    const resultCount = results.filter(
      (r) => next === "all" || r.competition === next
    ).length
    const fixtureCount = fixtures.filter(
      (f) => next === "all" || f.competition === next
    ).length
    const name = filters.find((f) => f.id === next)?.name ?? ""
    setStatus(
      `${name}: ${plural(resultCount, "result")}, ${plural(fixtureCount, "fixture")}.`
    )
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <div className={cn(container, "flex flex-col gap-12 pt-6 pb-12")}>
          <div className="flex flex-col gap-4">
            <div className={sectionHead}>
              <p className="font-mono text-label text-foreground uppercase">
                Sport
              </p>
            </div>
            <h1 className="text-h1 uppercase md:text-display">Results</h1>
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
                  const pressed = f.id === filter
                  return (
                    <Button
                      key={f.id}
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      className={buttonClasses}
                      onClick={() => choose(f.id)}
                    >
                      {f.name}
                    </Button>
                  )
                })}
              </div>
            </div>
            <p role="status" className="sr-only">
              {status}
            </p>
          </div>

          <TodaysResults filter={filter} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <div className="min-w-0 lg:col-span-8 lg:pr-6">
              <LeagueTable filter={filter} />
            </div>
            <div className="lg:col-span-4 lg:border-l lg:pl-6">
              <Fixtures filter={filter} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
