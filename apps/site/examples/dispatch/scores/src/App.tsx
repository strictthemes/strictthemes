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

/* ------------------------------------------------------------------ */
/* Sample data                                                         */
/* ------------------------------------------------------------------ */

type Competition = "coastal" | "cup" | "women"

const COMPETITIONS: { id: Competition; name: string; short: string }[] = [
  { id: "coastal", name: "Coastal League", short: "Coastal League" },
  { id: "cup", name: "County Cup", short: "County Cup" },
  { id: "women", name: "Women's Coastal League", short: "Women's League" },
]

type Filter = "all" | Competition

const FILTERS: { id: Filter; label: string }[] = [
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

const RESULTS: Result[] = [
  {
    id: "harriers-saltgate",
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
    id: "westmere-holm",
    competition: "coastal",
    ground: "Westmere Park",
    home: "Westmere Athletic",
    away: "Holm Bay",
    homeScore: 0,
    awayScore: 0,
    state: { kind: "ft" },
  },
  {
    id: "dunmore-calloway",
    competition: "coastal",
    ground: "Mill Lane",
    home: "Dunmore City",
    away: "Calloway Rovers",
    homeScore: 1,
    awayScore: 3,
    state: { kind: "ft" },
    scorers: "Adeyemi 20', 64' · Kavanagh 33' · Rusk 88'",
  },
  {
    id: "brackwater-fenwick",
    competition: "coastal",
    ground: "The Quayside",
    home: "Brackwater Town",
    away: "Fenwick Albion",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "live", minute: 67 },
    scorers: "Sorensen 9' · Mbeki 52'",
  },
  {
    id: "tollcross-ashby",
    competition: "cup",
    ground: "Station Park",
    home: "Tollcross Rangers",
    away: "Ashby Vale",
    homeScore: 3,
    awayScore: 2,
    state: { kind: "aet" },
    scorers: "Hallam 14', 107' · Quint 61' · Doyle 40', 78'",
  },
  {
    id: "rookhaven-elmsford",
    competition: "cup",
    ground: "Rook Street",
    home: "Rookhaven",
    away: "Elmsford",
    homeScore: 1,
    awayScore: 1,
    state: { kind: "pens", home: 4, away: 3 },
    scorers: "Farrow 55' · Ilesanmi 83'",
  },
]

type Fixture = {
  id: string
  competition: Competition
  day: string
  time: string
  home: string
  away: string
  ground: string
}

const DAYS: { date: string; label: string }[] = [
  { date: "2026-11-12", label: "Thu 12 Nov" },
  { date: "2026-11-13", label: "Fri 13 Nov" },
  { date: "2026-11-14", label: "Sat 14 Nov" },
  { date: "2026-11-15", label: "Sun 15 Nov" },
]

const FIXTURES: Fixture[] = [
  {
    id: "kilnsea-orford",
    competition: "cup",
    day: "2026-11-12",
    time: "19:30",
    home: "Kilnsea Wanderers",
    away: "Orford Town",
    ground: "Kiln Lane",
  },
  {
    id: "marlow-linton",
    competition: "cup",
    day: "2026-11-12",
    time: "19:45",
    home: "Marlow Heath",
    away: "Linton Rovers",
    ground: "Beck Road",
  },
  {
    id: "dunmore-fenwick",
    competition: "coastal",
    day: "2026-11-14",
    time: "15:00",
    home: "Dunmore City",
    away: "Fenwick Albion",
    ground: "Mill Lane",
  },
  {
    id: "harriers-holm",
    competition: "coastal",
    day: "2026-11-14",
    time: "15:00",
    home: "Port Avery Harriers",
    away: "Holm Bay",
    ground: "Harbour Road",
  },
  {
    id: "saltgate-brackwater",
    competition: "coastal",
    day: "2026-11-15",
    time: "13:00",
    home: "Saltgate United",
    away: "Brackwater Town",
    ground: "The Saltings",
  },
  {
    id: "calloway-westmere",
    competition: "coastal",
    day: "2026-11-15",
    time: "15:00",
    home: "Calloway Rovers",
    away: "Westmere Athletic",
    ground: "Rovers Park",
  },
]

/* The Coastal League table as it stood before today's matches. */
const TABLE: {
  club: string
  w: number
  d: number
  l: number
  gd: number
}[] = [
  { club: "Port Avery Harriers", w: 8, d: 2, l: 2, gd: 14 },
  { club: "Westmere Athletic", w: 7, d: 3, l: 2, gd: 9 },
  { club: "Saltgate United", w: 6, d: 3, l: 3, gd: 5 },
  { club: "Dunmore City", w: 5, d: 3, l: 4, gd: 2 },
  { club: "Brackwater Town", w: 3, d: 4, l: 5, gd: -3 },
  { club: "Calloway Rovers", w: 3, d: 3, l: 6, gd: -5 },
  { club: "Fenwick Albion", w: 2, d: 4, l: 6, gd: -8 },
  { club: "Holm Bay", w: 1, d: 4, l: 7, gd: -14 },
]

const HOME_CLUB = "Port Avery Harriers"

const SECTIONS = [
  "News",
  "Politics",
  "City",
  "Sport",
  "Results",
  "Business",
  "Culture",
  "Opinion",
]
const CURRENT_SECTION = "Results"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const labelLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const mastheadLink = cn(
  "font-heading text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"

function competitionName(id: Competition) {
  return COMPETITIONS.find((c) => c.id === id)!.name
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

function formatGd(gd: number) {
  if (gd > 0) return `+${gd}`
  if (gd < 0) return `−${Math.abs(gd)}`
  return "0"
}

function ordinal(n: number) {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
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

function winnerOf(r: Result): "home" | "away" | null {
  if (r.state.kind === "live") return null
  if (r.state.kind === "pens") {
    return r.state.home > r.state.away ? "home" : "away"
  }
  if (r.homeScore === r.awayScore) return null
  return r.homeScore > r.awayScore ? "home" : "away"
}

function matchLabel(r: Result) {
  const scores = `${r.home} ${r.homeScore}, ${r.away} ${r.awayScore}`
  switch (r.state.kind) {
    case "ft":
      return `${scores}, full time`
    case "aet":
      return `${scores}, after extra time`
    case "live":
      return `${scores}, live, ${ordinal(r.state.minute)} minute`
    case "pens": {
      const homeWins = r.state.home > r.state.away
      const winner = homeWins ? r.home : r.away
      const hi = Math.max(r.state.home, r.state.away)
      const lo = Math.min(r.state.home, r.state.away)
      return `${scores}, ${winner} win ${hi}–${lo} on penalties`
    }
  }
}

/* ------------------------------------------------------------------ */
/* Page parts                                                          */
/* ------------------------------------------------------------------ */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
            <time dateTime="2026-11-11">Wednesday 11 November 2026</time>
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
          <a href="/" className={cn(mastheadLink, "text-h2")}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButtonRef}
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
            {SECTIONS.map((section) => (
              <li key={section}>
                <SectionLink name={section} className="block py-2" />
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((section) => (
              <li key={section}>
                <SectionLink name={section} />
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
  const current = name === CURRENT_SECTION
  return (
    <a
      href="#"
      aria-current={current ? "page" : undefined}
      className={cn(
        "font-mono text-label text-foreground uppercase transition-colors duration-150",
        current
          ? "underline decoration-2 underline-offset-4"
          : "hover:underline",
        focusRing,
        className
      )}
    >
      {name}
    </a>
  )
}

function SectionHead({ title, id }: { title: string; id?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2 id={id} className="font-mono text-label text-foreground uppercase">
        {title}
      </h2>
    </div>
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
    state.kind === "ft" ? "FT" : state.kind === "aet" ? "AET" : "PENS"
  return <span className="text-foreground">{text}</span>
}

function ScoreBox({ result }: { result: Result }) {
  const winner = winnerOf(result)
  const rows = [
    { side: "home" as const, name: result.home, score: result.homeScore },
    { side: "away" as const, name: result.away, score: result.awayScore },
  ]

  let pensLine: string | null = null
  if (result.state.kind === "pens") {
    const homeWins = result.state.home > result.state.away
    const hi = Math.max(result.state.home, result.state.away)
    const lo = Math.min(result.state.home, result.state.away)
    pensLine = `${homeWins ? result.home : result.away} win ${hi}–${lo} on penalties`
  }

  return (
    <article
      aria-label={matchLabel(result)}
      className="flex flex-col gap-2 border bg-card p-4 md:p-6"
    >
      <div className="flex items-center justify-between gap-4 font-mono text-label uppercase tabular-nums">
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
      {pensLine && (
        <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
          {pensLine}
        </p>
      )}
      {result.scorers && (
        <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
          {result.scorers}
        </p>
      )}
    </article>
  )
}

function TodaysResults({ filter }: { filter: Filter }) {
  const groups = COMPETITIONS.filter((c) => filter === "all" || c.id === filter)
    .map((c) => ({
      competition: c,
      results: RESULTS.filter((r) => r.competition === c.id),
    }))
    .filter((g) => g.results.length > 0)

  const chosen = COMPETITIONS.find((c) => c.id === filter)

  return (
    <section aria-labelledby="results-head" className="flex flex-col gap-4">
      <SectionHead id="results-head" title="Today's results" />
      {groups.length === 0 ? (
        <p>{`No ${chosen ? chosen.short : ""} matches today.`}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.competition.id} className="flex flex-col gap-2">
              <h3 className="font-mono text-label text-foreground uppercase">
                {group.competition.name}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.results.map((result) => (
                  <ScoreBox key={result.id} result={result} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const TABLE_COLUMNS: {
  key: string
  abbr?: string
  title?: string
  numeric: boolean
}[] = [
  { key: "pos", abbr: "Pos", title: "Position", numeric: false },
  { key: "club", numeric: false },
  { key: "p", abbr: "P", title: "Played", numeric: true },
  { key: "w", abbr: "W", title: "Won", numeric: true },
  { key: "d", abbr: "D", title: "Drawn", numeric: true },
  { key: "l", abbr: "L", title: "Lost", numeric: true },
  { key: "gd", abbr: "GD", title: "Goal difference", numeric: true },
  { key: "pts", abbr: "Pts", title: "Points", numeric: true },
]

function LeagueTable({ filter }: { filter: Filter }) {
  const notFiltered = filter !== "all" && filter !== "coastal"
  const numberCell = "text-right font-mono tabular-nums"

  return (
    <section
      aria-labelledby="table-head"
      className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6"
    >
      <SectionHead id="table-head" title="Coastal League table" />
      <Table label="Coastal League table" className="min-w-lg text-body">
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((col) => (
              <TableHead
                key={col.key}
                scope="col"
                className={cn(
                  "font-mono text-label text-muted-foreground uppercase",
                  col.numeric && "text-right"
                )}
              >
                {col.abbr ? <abbr title={col.title}>{col.abbr}</abbr> : "Club"}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {TABLE.map((row, index) => {
            const played = row.w + row.d + row.l
            const points = row.w * 3 + row.d
            const isHome = row.club === HOME_CLUB
            return (
              <TableRow key={row.club}>
                <TableCell className="font-mono tabular-nums">
                  {index + 1}
                </TableCell>
                <TableCell className={cn(isHome && "font-bold")}>
                  {row.club}
                </TableCell>
                <TableCell className={numberCell}>{played}</TableCell>
                <TableCell className={numberCell}>{row.w}</TableCell>
                <TableCell className={numberCell}>{row.d}</TableCell>
                <TableCell className={numberCell}>{row.l}</TableCell>
                <TableCell className={numberCell}>{formatGd(row.gd)}</TableCell>
                <TableCell className={cn(numberCell, "font-bold")}>
                  {points}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
        {`Top two go up · After 12 games · Before today${notFiltered ? " · Not filtered" : ""}`}
      </p>
    </section>
  )
}

function Fixtures({ filter }: { filter: Filter }) {
  const days = DAYS.map((day) => ({
    ...day,
    fixtures: FIXTURES.filter(
      (f) =>
        f.day === day.date && (filter === "all" || f.competition === filter)
    ),
  })).filter((day) => day.fixtures.length > 0)

  return (
    <section
      aria-labelledby="fixtures-head"
      className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6"
    >
      <SectionHead id="fixtures-head" title="Fixtures" />
      {days.length === 0 ? (
        <p>No fixtures in the next four days.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <h3 className="font-mono text-label text-foreground uppercase tabular-nums">
                <time dateTime={day.date}>{day.label}</time>
              </h3>
              <ul className="flex flex-col gap-4">
                {day.fixtures.map((fixture, index) => (
                  <li
                    key={fixture.id}
                    className={cn(
                      "flex flex-col gap-1",
                      index > 0 && "border-t pt-4"
                    )}
                  >
                    <p>{`${fixture.home} v ${fixture.away}`}</p>
                    <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                      <time dateTime={`${fixture.day}T${fixture.time}`}>
                        {fixture.time}
                      </time>
                      {` · ${competitionName(fixture.competition)} · ${fixture.ground}`}
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

function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
        <a href="/" className={cn(mastheadLink, "self-start text-h2")}>
          The Port Avery Ledger
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((section) => (
              <li key={section}>
                <a
                  href="#"
                  className={cn(labelLink, "font-mono text-label uppercase")}
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function App() {
  const [filter, setFilter] = useState<Filter>("all")
  const [status, setStatus] = useState("")

  function choose(next: Filter) {
    if (next === filter) return
    setFilter(next)
    const results = RESULTS.filter(
      (r) => next === "all" || r.competition === next
    ).length
    const fixtures = FIXTURES.filter(
      (f) => next === "all" || f.competition === next
    ).length
    const label = FILTERS.find((f) => f.id === next)!.label
    setStatus(
      `${label}: ${plural(results, "result")}, ${plural(fixtures, "fixture")}.`
    )
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
              <p className="font-mono text-label text-foreground uppercase">
                Sport
              </p>
            </div>
            <h1 className="text-h1 uppercase md:text-display">Results</h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                <time dateTime="2026-11-11">Wednesday 11 November 2026</time>
              </p>
              <div
                role="group"
                aria-label="Competition"
                className="flex flex-wrap gap-1"
              >
                {FILTERS.map((option) => {
                  const pressed = option.id === filter
                  return (
                    <Button
                      key={option.id}
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      className={buttonClasses}
                      onClick={() => choose(option.id)}
                    >
                      {option.label}
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
            <LeagueTable filter={filter} />
            <Fixtures filter={filter} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
