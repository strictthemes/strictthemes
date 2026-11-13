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

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const BUTTON = "h-auto px-4 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"
const LABEL_LINK = `${LABEL} text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const MASTHEAD = `font-heading text-h2 uppercase text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`
const SECTION_HEAD = "flex items-baseline justify-between gap-4 border-t-2 pt-2"
const SECTION_NAME = `${LABEL} text-foreground`

const PAPER = "The Port Avery Ledger"
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
const CURRENT = "Results"

type Competition = "coastal" | "cup" | "women"
type Filter = "all" | Competition

const COMPETITIONS: { id: Competition; name: string; short: string }[] = [
  { id: "coastal", name: "Coastal League", short: "Coastal League" },
  { id: "cup", name: "County Cup", short: "County Cup" },
  { id: "women", name: "Women's Coastal League", short: "Women's League" },
]

const FILTERS: { id: Filter; name: string }[] = [
  { id: "all", name: "All" },
  ...COMPETITIONS.map(({ id, short }) => ({ id, name: short })),
]

type Result = {
  id: string
  competition: Competition
  ground: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  state: "ft" | "aet" | "pens" | "live"
  minute?: number
  winner?: "home" | "away"
  penalties?: string
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
    state: "ft",
    winner: "home",
    scorers: "Okonjo 12', 58' · Brandt 71'",
  },
  {
    id: "westmere-dunmore",
    competition: "coastal",
    ground: "The Links",
    home: "Westmere Athletic",
    away: "Dunmore City",
    homeScore: 0,
    awayScore: 0,
    state: "ft",
  },
  {
    id: "fenwick-brackwater",
    competition: "coastal",
    ground: "Tannery Road",
    home: "Fenwick Albion",
    away: "Brackwater Town",
    homeScore: 0,
    awayScore: 3,
    state: "ft",
    winner: "away",
    scorers: "Varga 9', 44' · Achterberg 80'",
  },
  {
    id: "calloway-holm-bay",
    competition: "coastal",
    ground: "Calloway Park",
    home: "Calloway Rovers",
    away: "Holm Bay",
    homeScore: 1,
    awayScore: 1,
    state: "live",
    minute: 67,
    scorers: "Teale 23' · Ibsen 61'",
  },
  {
    id: "thornley-marsh-green",
    competition: "cup",
    ground: "Vale Road",
    home: "Thornley Vale",
    away: "Marsh Green",
    homeScore: 3,
    awayScore: 2,
    state: "aet",
    winner: "home",
    scorers: "Pryce 31', 104' · Sorley 77' · Dunne 18', 52'",
  },
  {
    id: "rookhaven-elmsford",
    competition: "cup",
    ground: "The Rookery",
    home: "Rookhaven",
    away: "Elmsford",
    homeScore: 1,
    awayScore: 1,
    state: "pens",
    winner: "home",
    penalties: "4–3",
    scorers: "Maddox 40' · Lindqvist 88'",
  },
]

type Standing = {
  club: string
  won: number
  drawn: number
  lost: number
  goalDifference: number
}

const STANDINGS: Standing[] = [
  { club: "Westmere Athletic", won: 8, drawn: 2, lost: 2, goalDifference: 13 },
  { club: "Port Avery Harriers", won: 7, drawn: 3, lost: 2, goalDifference: 9 },
  { club: "Saltgate United", won: 6, drawn: 4, lost: 2, goalDifference: 6 },
  { club: "Dunmore City", won: 5, drawn: 3, lost: 4, goalDifference: 2 },
  { club: "Calloway Rovers", won: 4, drawn: 4, lost: 4, goalDifference: 0 },
  { club: "Fenwick Albion", won: 3, drawn: 3, lost: 6, goalDifference: -6 },
  { club: "Brackwater Town", won: 2, drawn: 3, lost: 7, goalDifference: -10 },
  { club: "Holm Bay", won: 1, drawn: 2, lost: 9, goalDifference: -14 },
]

const COLUMNS = [
  { short: "P", title: "Played" },
  { short: "W", title: "Won" },
  { short: "D", title: "Drawn" },
  { short: "L", title: "Lost" },
  { short: "GD", title: "Goal difference" },
  { short: "Pts", title: "Points" },
]

type Fixture = {
  id: string
  competition: Competition
  time: string
  home: string
  away: string
  ground: string
}

const FIXTURE_DAYS: { date: string; label: string; fixtures: Fixture[] }[] = [
  {
    date: "2026-11-12",
    label: "Thu 12 Nov",
    fixtures: [
      {
        id: "ashby-northmoor",
        competition: "cup",
        time: "19:30",
        home: "Ashby Wharf",
        away: "Northmoor",
        ground: "Wharf Lane",
      },
      {
        id: "lindale-castle-heath",
        competition: "cup",
        time: "19:45",
        home: "Lindale Town",
        away: "Castle Heath",
        ground: "Lindale Green",
      },
    ],
  },
  { date: "2026-11-13", label: "Fri 13 Nov", fixtures: [] },
  {
    date: "2026-11-14",
    label: "Sat 14 Nov",
    fixtures: [
      {
        id: "dunmore-fenwick",
        competition: "coastal",
        time: "15:00",
        home: "Dunmore City",
        away: "Fenwick Albion",
        ground: "Mill Lane",
      },
      {
        id: "saltgate-westmere",
        competition: "coastal",
        time: "17:30",
        home: "Saltgate United",
        away: "Westmere Athletic",
        ground: "Saltgate Lane",
      },
    ],
  },
  {
    date: "2026-11-15",
    label: "Sun 15 Nov",
    fixtures: [
      {
        id: "holm-bay-harriers",
        competition: "coastal",
        time: "14:00",
        home: "Holm Bay",
        away: "Port Avery Harriers",
        ground: "Bay View",
      },
      {
        id: "brackwater-calloway",
        competition: "coastal",
        time: "16:00",
        home: "Brackwater Town",
        away: "Calloway Rovers",
        ground: "Quay Field",
      },
    ],
  },
]

function competitionName(id: Competition) {
  return COMPETITIONS.find((competition) => competition.id === id)!.name
}

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function matchLabel(match: Result) {
  const score = `${match.home} ${match.homeScore}, ${match.away} ${match.awayScore}`
  if (match.state === "live") return `${score}, live, ${match.minute}th minute`
  if (match.state === "aet") return `${score}, after extra time`
  if (match.state === "pens") {
    const winner = match.winner === "home" ? match.home : match.away
    return `${score}, ${winner} win ${match.penalties} on penalties`
  }
  return `${score}, full time`
}

function LiveMarker() {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-label text-primary uppercase">
      <span
        className="size-2 shrink-0 rounded-full bg-primary"
        aria-hidden="true"
      />
      Live
    </span>
  )
}

function ScoreBox({ match }: { match: Result }) {
  const finished = match.state !== "live"
  const sides = [
    { side: "home", name: match.home, score: match.homeScore },
    { side: "away", name: match.away, score: match.awayScore },
  ]

  return (
    <article
      aria-label={matchLabel(match)}
      className="flex flex-col gap-2 border bg-card p-4 md:p-6"
    >
      <p className={`flex items-center justify-between gap-4 ${LABEL}`}>
        <span className="text-muted-foreground">{match.ground}</span>
        {match.state === "live" ? (
          <span className="inline-flex items-center gap-2">
            <LiveMarker />
            <span className="text-primary tabular-nums">{match.minute}'</span>
          </span>
        ) : (
          <span className="text-foreground">
            {match.state === "ft"
              ? "FT"
              : match.state === "aet"
                ? "AET"
                : "PENS"}
          </span>
        )}
      </p>
      {sides.map(({ side, name, score }) => (
        <p key={side} className="flex items-baseline justify-between gap-4">
          <span
            className={
              finished && match.winner === side
                ? "text-body font-bold"
                : "text-body"
            }
          >
            {name}
          </span>
          <span className="font-mono text-h2 tabular-nums">{score}</span>
        </p>
      ))}
      {match.state === "pens" && (
        <p className={`${LABEL} text-muted-foreground tabular-nums`}>
          {match.winner === "home" ? match.home : match.away} win{" "}
          {match.penalties} on penalties
        </p>
      )}
      {match.scorers && (
        <p className={`${LABEL} text-muted-foreground tabular-nums`}>
          {match.scorers}
        </p>
      )}
    </article>
  )
}

function SectionLinks({
  current,
  itemClassName,
}: {
  current?: string
  itemClassName?: string
}) {
  return SECTIONS.map((section) => (
    <li key={section}>
      <a
        href="#"
        aria-current={section === current ? "page" : undefined}
        className={cn(
          LABEL_LINK,
          section === current && "underline decoration-2",
          itemClassName
        )}
      >
        {section}
      </a>
    </li>
  ))
}

export function App() {
  const [filter, setFilter] = useState<Filter>("all")
  const [status, setStatus] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  const shows = (competition: Competition) =>
    filter === "all" || filter === competition

  const resultGroups = COMPETITIONS.map((competition) => ({
    ...competition,
    matches: RESULTS.filter(
      (match) =>
        match.competition === competition.id && shows(match.competition)
    ),
  })).filter((group) => group.matches.length > 0)

  const fixtureDays = FIXTURE_DAYS.map((day) => ({
    ...day,
    fixtures: day.fixtures.filter((fixture) => shows(fixture.competition)),
  })).filter((day) => day.fixtures.length > 0)

  function choose(next: Filter, name: string) {
    if (next === filter) return

    const results = RESULTS.filter(
      (match) => next === "all" || match.competition === next
    ).length
    const fixtures = FIXTURE_DAYS.flatMap((day) => day.fixtures).filter(
      (fixture) => next === "all" || fixture.competition === next
    ).length

    setFilter(next)
    setStatus(
      `${name}: ${count(results, "result")}, ${count(fixtures, "fixture")}.`
    )
  }

  const chosenShort =
    filter === "all"
      ? ""
      : COMPETITIONS.find((competition) => competition.id === filter)!.short

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-2">
            <time
              dateTime="2026-11-11"
              className={`${LABEL} text-muted-foreground tabular-nums`}
            >
              Wednesday 11 November 2026
            </time>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "default" }), BUTTON)}
            >
              Subscribe
            </a>
          </div>
          <div className="flex items-center justify-between gap-4 border-t-2 py-4">
            <a href="/" className={MASTHEAD}>
              {PAPER}
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={`${BUTTON} md:hidden`}
              aria-expanded={menuOpen}
              aria-controls="section-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>
          <nav
            id="section-menu"
            aria-label="Sections"
            hidden={!menuOpen}
            className="border-b py-2 md:hidden"
          >
            <ul>
              <SectionLinks current={CURRENT} itemClassName="block py-2" />
            </ul>
          </nav>
          <nav aria-label="Sections" className="hidden border-y py-2 md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks current={CURRENT} />
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-4">
            <div className={SECTION_HEAD}>
              <p className={SECTION_NAME}>Sport</p>
            </div>
            <h1 className="text-h1 uppercase md:text-display">Results</h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <time
                dateTime="2026-11-11"
                className={`${LABEL} text-muted-foreground tabular-nums`}
              >
                Wednesday 11 November 2026
              </time>
              <div
                role="group"
                aria-label="Competition"
                className="flex flex-wrap gap-1"
              >
                {FILTERS.map(({ id, name }) => (
                  <Button
                    key={id}
                    variant={filter === id ? "secondary" : "outline"}
                    aria-pressed={filter === id}
                    className={BUTTON}
                    onClick={() => choose(id, name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
            <p role="status" className="sr-only">
              {status}
            </p>
          </div>

          <section
            aria-labelledby="results-heading"
            className="flex flex-col gap-4"
          >
            <div className={SECTION_HEAD}>
              <h2 id="results-heading" className={SECTION_NAME}>
                Today's results
              </h2>
            </div>
            {resultGroups.length > 0 ? (
              <div className="flex flex-col gap-6">
                {resultGroups.map((group) => (
                  <div key={group.id} className="flex flex-col gap-2">
                    <h3 className={SECTION_NAME}>{group.name}</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {group.matches.map((match) => (
                        <ScoreBox key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body">
                {chosenShort
                  ? `No ${chosenShort} matches today.`
                  : "No matches today."}
              </p>
            )}
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <section
              aria-labelledby="table-heading"
              className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6"
            >
              <div className={SECTION_HEAD}>
                <h2 id="table-heading" className={SECTION_NAME}>
                  Coastal League table
                </h2>
              </div>
              <Table
                label="Coastal League table"
                className="min-w-lg text-body"
              >
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className={`${LABEL} text-muted-foreground`}
                      scope="col"
                    >
                      <abbr title="Position">Pos</abbr>
                    </TableHead>
                    <TableHead
                      className={`${LABEL} text-muted-foreground`}
                      scope="col"
                    >
                      Club
                    </TableHead>
                    {COLUMNS.map(({ short, title }) => (
                      <TableHead
                        key={short}
                        className={`${LABEL} text-right text-muted-foreground`}
                        scope="col"
                      >
                        <abbr title={title}>{short}</abbr>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STANDINGS.map((row, index) => (
                    <TableRow key={row.club}>
                      <TableCell className="font-mono tabular-nums">
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className={
                          row.club === HOME_CLUB ? "font-bold" : undefined
                        }
                      >
                        {row.club}
                      </TableCell>
                      {[
                        row.won + row.drawn + row.lost,
                        row.won,
                        row.drawn,
                        row.lost,
                        signed(row.goalDifference),
                      ].map((value, column) => (
                        <TableCell
                          key={COLUMNS[column].short}
                          className="text-right font-mono tabular-nums"
                        >
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-mono font-bold tabular-nums">
                        {row.won * 3 + row.drawn}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className={`${LABEL} text-muted-foreground tabular-nums`}>
                Top two go up · After 12 games
                {filter !== "all" && " · Not filtered"}
              </p>
            </section>

            <section
              aria-labelledby="fixtures-heading"
              className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6"
            >
              <div className={SECTION_HEAD}>
                <h2 id="fixtures-heading" className={SECTION_NAME}>
                  Fixtures
                </h2>
              </div>
              {fixtureDays.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {fixtureDays.map((day) => (
                    <div key={day.date} className="flex flex-col gap-2">
                      <h3 className={SECTION_NAME}>
                        <time dateTime={day.date} className="tabular-nums">
                          {day.label}
                        </time>
                      </h3>
                      <ul className="flex flex-col gap-4">
                        {day.fixtures.map((fixture, index) => (
                          <li
                            key={fixture.id}
                            className={
                              index > 0
                                ? "flex flex-col gap-1 border-t pt-4"
                                : "flex flex-col gap-1"
                            }
                          >
                            <p className="text-body">
                              {fixture.home} v {fixture.away}
                            </p>
                            <p className={`${LABEL} text-muted-foreground`}>
                              <time
                                dateTime={`${day.date}T${fixture.time}`}
                                className="tabular-nums"
                              >
                                {fixture.time}
                              </time>
                              {" · "}
                              {competitionName(fixture.competition)}
                              {" · "}
                              {fixture.ground}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body">No fixtures in the next four days.</p>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
          <a href="/" className={`${MASTHEAD} self-start`}>
            {PAPER}
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks />
            </ul>
          </nav>
          <p className={`${LABEL} text-muted-foreground tabular-nums`}>
            © 2026 {PAPER} · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
