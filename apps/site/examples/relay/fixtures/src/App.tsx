import { useState, type ReactNode } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TeamId = "first" | "reserves" | "u18"
type Side = "home" | "away" | "neutral"

type Club = { name: string; letters: string; ground: string }

type Match = {
  date: string // ISO date, yyyy-mm-dd
  kickOff: string // 24-hour clock
  club: string // the opponent's club, a key of CLUBS
  side: Side
  venue?: string // only for a neutral ground
  round?: string
  score?: [number, number] // Wendmoor FC's goals first
  live?: { score: [number, number]; minute: number }
  report?: string
}

type Team = {
  id: TeamId
  name: string
  label: string
  suffix: string
  matches: Match[]
}

const CLUBS: Record<string, Club> = {
  castlebrook: { name: "Castlebrook United", letters: "CU", ground: "Castle Meadow" },
  dunmarsh: { name: "Dunmarsh Athletic", letters: "DA", ground: "The Saltings" },
  otterby: { name: "Otterby Town", letters: "OT", ground: "Weir Lane" },
  stenwick: { name: "Stenwick Albion", letters: "SA", ground: "Albion Field" },
  kirkfen: { name: "Kirkfen Rangers", letters: "KR", ground: "Fen Road" },
  lowmere: { name: "Lowmere Welfare", letters: "LW", ground: "Welfare Ground" },
  pellow: { name: "Pellow Green", letters: "PG", ground: "The Green" },
  hollinvale: { name: "Hollinvale", letters: "H", ground: "Hollin Bank" },
  tarrowby: { name: "Tarrowby United", letters: "TU", ground: "Station Road" },
  sedgeholme: { name: "Sedgeholme", letters: "S", ground: "Sedge Lane" },
  eastlow: { name: "Eastlow Wanderers", letters: "EW", ground: "Quarry Lane" },
}

const HOME_GROUND = "Millrace Park"

function first(date: string, club: string, side: Side, score?: [number, number]): Match {
  return { date, kickOff: "15:00", club, side, score }
}
function reserves(date: string, club: string, side: Side, score?: [number, number]): Match {
  return { date, kickOff: "19:30", club, side, score }
}
function youth(date: string, club: string, side: Side, score?: [number, number]): Match {
  return { date, kickOff: "10:30", club, side, score }
}

const TEAMS: Team[] = [
  {
    id: "first",
    name: "First team",
    label: "First team",
    suffix: "",
    matches: [
      first("2027-03-06", "kirkfen", "away", [1, 1]),
      first("2027-03-13", "tarrowby", "home", [1, 0]),
      first("2027-03-20", "otterby", "away", [0, 3]),
      first("2027-03-27", "castlebrook", "home", [4, 2]),
      first("2027-04-03", "stenwick", "away", [3, 2]),
      first("2027-04-10", "sedgeholme", "home", [2, 4]),
      first("2027-04-17", "dunmarsh", "away", [2, 2]),
      first("2027-04-24", "eastlow", "home", [3, 0]),
      first("2027-05-01", "hollinvale", "away", [1, 1]),
      first("2027-05-08", "lowmere", "home", [2, 0]),
      first("2027-05-15", "pellow", "away", [1, 3]),
      first("2027-05-22", "kirkfen", "home", [2, 0]),
      first("2027-05-29", "tarrowby", "away", [5, 0]),
      { ...first("2027-06-05", "otterby", "home", [3, 1]), report: "/report" },
      first("2027-06-12", "castlebrook", "away"),
      first("2027-06-19", "stenwick", "home"),
      first("2027-06-26", "sedgeholme", "away"),
      first("2027-07-03", "dunmarsh", "home"),
      first("2027-07-10", "eastlow", "away"),
      first("2027-07-17", "hollinvale", "home"),
      first("2027-07-24", "lowmere", "away"),
      first("2027-07-31", "pellow", "home"),
    ],
  },
  {
    id: "reserves",
    name: "Reserves",
    label: "Reserves",
    suffix: " Reserves",
    matches: [
      reserves("2027-05-18", "stenwick", "away", [2, 2]),
      reserves("2027-05-25", "lowmere", "home", [3, 1]),
      reserves("2027-06-01", "dunmarsh", "away", [0, 2]),
      { ...reserves("2027-06-08", "sedgeholme", "home"), live: { score: [1, 0], minute: 35 } },
      reserves("2027-06-15", "castlebrook", "away"),
      reserves("2027-06-22", "pellow", "home"),
      reserves("2027-06-29", "kirkfen", "away"),
      reserves("2027-07-06", "otterby", "home"),
    ],
  },
  {
    id: "u18",
    name: "Under 18s",
    label: "Under 18s",
    suffix: " U18",
    matches: [
      youth("2027-05-23", "castlebrook", "home", [1, 1]),
      { ...youth("2027-05-30", "pellow", "away", [2, 1]), round: "County Youth Cup semi-final" },
      youth("2027-06-06", "kirkfen", "home", [4, 0]),
      youth("2027-06-13", "stenwick", "away"),
      youth("2027-06-20", "otterby", "home"),
      {
        ...youth("2027-06-27", "dunmarsh", "neutral"),
        kickOff: "14:00",
        venue: "Castle Meadow",
        round: "County Youth Cup final",
      },
    ],
  },
]

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return { y, m, d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }
}

function dateLabel(iso: string) {
  const { m, d, weekday } = parseDate(iso)
  return `${DAYS[weekday]} ${d} ${MONTHS[m - 1].slice(0, 3).toUpperCase()}`
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function scoreText([us, them]: [number, number]) {
  return `${us}–${them}`
}

function outcome([us, them]: [number, number]) {
  if (us > them) return "Won"
  if (us < them) return "Lost"
  return "Drew"
}

function summarise(team: Team) {
  const played = team.matches.filter((m) => m.score)
  const live = team.matches.filter((m) => m.live).length
  const toCome = team.matches.length - played.length - live
  // One badge per view: a live match takes it, otherwise the latest result shows "Final".
  const latest = live > 0 ? undefined : played[played.length - 1]
  const next = team.matches.find((m) => !m.score && !m.live)
  const record = { played: played.length, won: 0, drawn: 0, lost: 0, for: 0, against: 0 }
  for (const m of played) {
    const [us, them] = m.score!
    record.for += us
    record.against += them
    if (us > them) record.won += 1
    else if (us < them) record.lost += 1
    else record.drawn += 1
  }
  return { total: team.matches.length, played: played.length, live, toCome, latest, next, record }
}

function countLabel(team: Team) {
  const s = summarise(team)
  const parts = [plural(s.total, "match", "matches"), `${s.played} played`]
  if (s.live > 0) parts.push(`${s.live} live`)
  parts.push(`${s.toCome} to come`)
  return parts
}

function groupByMonth(matches: Match[]) {
  const groups: { key: string; title: string; matches: Match[] }[] = []
  for (const match of matches) {
    const { y, m } = parseDate(match.date)
    const key = `${y}-${String(m).padStart(2, "0")}`
    let group = groups.find((g) => g.key === key)
    if (!group) {
      group = { key, title: `${MONTHS[m - 1]} ${y}`, matches: [] }
      groups.push(group)
    }
    group.matches.push(match)
  }
  return groups.sort((a, b) => a.key.localeCompare(b.key))
}

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const bandFocusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const buttonClasses = "h-auto px-5 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const labelLink = cn(
  label,
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusOutline
)

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn("inline-flex items-center gap-3 transition-colors duration-150", bandFocusOutline)}
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground"
          >
            W
          </span>
          <span className="font-heading text-h2 uppercase">Wendmoor FC</span>
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5">
            {NAV.map((item) => {
              const current = item.href === "/fixtures"
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      current && "underline decoration-2",
                      bandFocusOutline
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-5 py-8">
        <p className="font-heading text-h2 text-foreground uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={labelLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo: nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
      {children}
    </span>
  )
}

function MatchRow({
  match,
  team,
  isFirst,
  isNext,
  isLatest,
}: {
  match: Match
  team: Team
  isFirst: boolean
  isNext: boolean
  isLatest: boolean
}) {
  const club = CLUBS[match.club]
  const venue = match.side === "home" ? HOME_GROUND : (match.venue ?? club.ground)
  // On ice everything inherits the navy; elsewhere labels are muted and the rest is foreground.
  const muted = isNext ? "" : "text-muted-foreground"
  const strong = isNext ? "" : "text-foreground"
  const figure = cn("font-heading text-h2 tabular-nums", strong)

  let badge: string | null = null
  let figureNode: ReactNode
  let under: ReactNode

  if (match.live) {
    badge = "Live"
    figureNode = <p className={figure}>{scoreText(match.live.score)}</p>
    under = `${match.live.minute}'`
  } else if (match.score) {
    if (isLatest) badge = "Final"
    figureNode = <p className={figure}>{scoreText(match.score)}</p>
    under = outcome(match.score)
  } else {
    figureNode = (
      <p className={figure}>
        <time dateTime={`${match.date}T${match.kickOff}`}>{match.kickOff}</time>
      </p>
    )
    under = "Kick-off"
  }

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-5 px-5 py-3",
        !isFirst && "border-t border-border",
        isNext && "bg-ice text-ice-foreground"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "hidden size-8 shrink-0 items-center justify-center rounded-full font-mono text-label md:flex",
            isNext ? "bg-navy text-navy-foreground" : "bg-ice text-ice-foreground"
          )}
        >
          {club.letters}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className={cn("flex flex-wrap gap-x-3 gap-y-1", label, muted)}>
            <time dateTime={match.date}>{dateLabel(match.date)}</time>
            <span>{match.side}</span>
            <span>{venue}</span>
            {match.round && <span>{match.round}</span>}
            {match.report && (
              <a href={match.report} className={labelLink}>
                Match report
              </a>
            )}
          </div>
          <p className={cn("font-heading text-body font-bold uppercase", strong)}>
            {club.name}
            {team.suffix}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          {badge && <Badge>{badge}</Badge>}
          {figureNode}
        </div>
        <p className={cn(label, muted)}>{under}</p>
      </div>
    </li>
  )
}

export function App() {
  const [teamId, setTeamId] = useState<TeamId>("first")
  const [announcement, setAnnouncement] = useState("")

  const team = TEAMS.find((t) => t.id === teamId)!
  const summary = summarise(team)
  const months = groupByMonth(team.matches)
  const { record } = summary

  function choose(next: Team) {
    if (next.id === teamId) return
    setTeamId(next.id)
    setAnnouncement(`${next.name}: ${countLabel(next).join(", ")}.`)
  }

  const figures: [string, number][] = [
    ["Played", record.played],
    ["Won", record.won],
    ["Drawn", record.drawn],
    ["Lost", record.lost],
    ["Goals for", record.for],
    ["Goals against", record.against],
  ]

  const matchDays: [string, string][] = [
    ["Adults", "£4"],
    ["Under 16s", "Free"],
    ["Gates open", "One hour before kick-off"],
    ["Ground", "Millrace Park, Mill Lane"],
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            {/* Page head */}
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className={cn(label, "text-muted-foreground")}>2027 Season</p>
                <h1 className="text-h1 text-foreground uppercase">Fixtures and results</h1>
              </div>
              <a
                href="/membership"
                className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
              >
                Join the club
              </a>
            </div>

            {/* Team control */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Team" className="flex flex-wrap gap-2">
                {TEAMS.map((t) => {
                  const chosen = t.id === teamId
                  return (
                    <Button
                      key={t.id}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonClasses}
                      onClick={() => choose(t)}
                    >
                      {t.label}
                    </Button>
                  )
                })}
              </div>
              <p className={cn(label, "text-muted-foreground")}>{countLabel(team).join(" · ")}</p>
            </div>
            <p role="status" className="sr-only">
              {announcement}
            </p>

            {/* Matches and record */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
                {months.map((month) => (
                  <section
                    key={month.key}
                    aria-labelledby={`month-${month.key}`}
                    className="flex flex-col gap-3"
                  >
                    <h2 id={`month-${month.key}`} className="text-h2 text-foreground uppercase">
                      {month.title}
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                      <ul>
                        {month.matches.map((match, i) => (
                          <MatchRow
                            key={match.date}
                            match={match}
                            team={team}
                            isFirst={i === 0}
                            isNext={match === summary.next}
                            isLatest={match === summary.latest}
                          />
                        ))}
                      </ul>
                    </div>
                  </section>
                ))}
              </div>

              <div className="flex min-w-0 flex-col gap-5 lg:col-span-4">
                <section
                  aria-labelledby="record-heading"
                  className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 id="record-heading" className="text-h2 text-foreground uppercase">
                      Record
                    </h2>
                    <p className={cn(label, "text-muted-foreground")}>{team.label}</p>
                  </div>
                  <dl className="grid grid-cols-3 gap-5">
                    {figures.map(([name, value]) => (
                      <div key={name} className="flex flex-col-reverse gap-1">
                        <dt className={cn(label, "text-muted-foreground")}>{name}</dt>
                        <dd className="font-heading text-h1 text-foreground tabular-nums">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-label text-muted-foreground">
                    Scores show Wendmoor FC&apos;s goals first. A match being played is not counted.
                  </p>
                </section>

                <section
                  aria-labelledby="match-days-heading"
                  className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
                >
                  <h2 id="match-days-heading" className="text-h2 uppercase">
                    Match days
                  </h2>
                  <dl className="flex flex-col gap-2">
                    {matchDays.map(([name, value]) => (
                      <div key={name} className="flex items-baseline justify-between gap-3">
                        <dt className={label}>{name}</dt>
                        <dd className="text-right text-body">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-body">
                    The tea bar takes cash and cards. At away matches the home club sets the price.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
