import { useId, useState, type ReactNode } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The sample's now: Tuesday 8 June 2027 at 20:05. The data below is as it
// stands at that moment; nothing on the page reads the device clock.

type TeamId = "first" | "reserves" | "u18"
type Side = "home" | "away" | "neutral"

type Club = { name: string; crest: string; ground: string }

type Match = {
  date: string // ISO date, e.g. "2027-06-05"
  club: string // key into CLUBS
  side: Side
  kickOff: string // 24-hour clock
  score?: [number, number] // Wendmoor FC's goals first
  liveMinute?: number // set only on the match being played
  round?: string
  venue?: string // overrides the usual ground (neutral matches)
}

type Team = {
  id: TeamId
  name: string
  suffix: string
  matches: Match[]
}

const HOME_GROUND = "Millrace Park"

const CLUBS: Record<string, Club> = {
  CU: { name: "Castlebrook United", crest: "CU", ground: "Castle Meadow" },
  DA: { name: "Dunmarsh Athletic", crest: "DA", ground: "The Saltings" },
  OT: { name: "Otterby Town", crest: "OT", ground: "Weir Lane" },
  SA: { name: "Stenwick Albion", crest: "SA", ground: "Albion Field" },
  KR: { name: "Kirkfen Rangers", crest: "KR", ground: "Fen Road" },
  LW: { name: "Lowmere Welfare", crest: "LW", ground: "Welfare Ground" },
  PG: { name: "Pellow Green", crest: "PG", ground: "The Green" },
  H: { name: "Hollinvale", crest: "H", ground: "Hollin Bank" },
  TU: { name: "Tarrowby United", crest: "TU", ground: "Station Road" },
  S: { name: "Sedgeholme", crest: "S", ground: "Sedge Lane" },
  EW: { name: "Eastlow Wanderers", crest: "EW", ground: "Quarry Lane" },
}

function league(
  date: string,
  club: string,
  side: Side,
  score?: [number, number]
): Match {
  return { date, club, side, kickOff: "15:00", score }
}

function reserves(
  date: string,
  club: string,
  side: Side,
  score?: [number, number],
  liveMinute?: number
): Match {
  return { date, club, side, kickOff: "19:30", score, liveMinute }
}

function youth(
  date: string,
  club: string,
  side: Side,
  score?: [number, number],
  extra?: Partial<Match>
): Match {
  return { date, club, side, kickOff: "10:30", score, ...extra }
}

const TEAMS: Team[] = [
  {
    id: "first",
    name: "First team",
    suffix: "",
    matches: [
      league("2027-03-06", "KR", "away", [1, 1]),
      league("2027-03-13", "TU", "home", [1, 0]),
      league("2027-03-20", "OT", "away", [0, 3]),
      league("2027-03-27", "CU", "home", [4, 2]),
      league("2027-04-03", "SA", "away", [3, 2]),
      league("2027-04-10", "S", "home", [2, 4]),
      league("2027-04-17", "DA", "away", [2, 2]),
      league("2027-04-24", "EW", "home", [3, 0]),
      league("2027-05-01", "H", "away", [1, 1]),
      league("2027-05-08", "LW", "home", [2, 0]),
      league("2027-05-15", "PG", "away", [1, 3]),
      league("2027-05-22", "KR", "home", [2, 0]),
      league("2027-05-29", "TU", "away", [5, 0]),
      league("2027-06-05", "OT", "home", [3, 1]),
      league("2027-06-12", "CU", "away"),
      league("2027-06-19", "SA", "home"),
      league("2027-06-26", "S", "away"),
      league("2027-07-03", "DA", "home"),
      league("2027-07-10", "EW", "away"),
      league("2027-07-17", "H", "home"),
      league("2027-07-24", "LW", "away"),
      league("2027-07-31", "PG", "home"),
    ],
  },
  {
    id: "reserves",
    name: "Reserves",
    suffix: " Reserves",
    matches: [
      reserves("2027-05-18", "SA", "away", [2, 2]),
      reserves("2027-05-25", "LW", "home", [3, 1]),
      reserves("2027-06-01", "DA", "away", [0, 2]),
      reserves("2027-06-08", "S", "home", [1, 0], 35),
      reserves("2027-06-15", "CU", "away"),
      reserves("2027-06-22", "PG", "home"),
      reserves("2027-06-29", "KR", "away"),
      reserves("2027-07-06", "OT", "home"),
    ],
  },
  {
    id: "u18",
    name: "Under 18s",
    suffix: " U18",
    matches: [
      youth("2027-05-23", "CU", "home", [1, 1]),
      youth("2027-05-30", "PG", "away", [2, 1], {
        round: "County Youth Cup semi-final",
      }),
      youth("2027-06-06", "KR", "home", [4, 0]),
      youth("2027-06-13", "SA", "away"),
      youth("2027-06-20", "OT", "home"),
      youth("2027-06-27", "DA", "neutral", undefined, {
        kickOff: "14:00",
        venue: "Castle Meadow",
        round: "County Youth Cup final",
      }),
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

const isLive = (m: Match) => m.liveMinute !== undefined
const isPlayed = (m: Match) => m.score !== undefined && !isLive(m)
const isToCome = (m: Match) => m.score === undefined && !isLive(m)

function outcome([us, them]: [number, number]) {
  if (us > them) return "Won"
  if (us < them) return "Lost"
  return "Drew"
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function counts(team: Team) {
  const total = team.matches.length
  const played = team.matches.filter(isPlayed).length
  const live = team.matches.filter(isLive).length
  const toCome = team.matches.filter(isToCome).length
  return { total, played, live, toCome }
}

function countParts(team: Team) {
  const c = counts(team)
  const parts = [plural(c.total, "match", "matches"), `${c.played} played`]
  if (c.live > 0) parts.push(`${c.live} live`)
  parts.push(`${c.toCome} to come`)
  return parts
}

function countLabel(team: Team) {
  return countParts(team).join(" · ")
}

function countSentence(team: Team) {
  return `${team.name}: ${countParts(team).join(", ")}.`
}

function record(team: Team) {
  const r = { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0 }
  for (const m of team.matches) {
    if (!isPlayed(m) || !m.score) continue
    const [us, them] = m.score
    r.played += 1
    r.for += us
    r.against += them
    if (us > them) r.won += 1
    else if (us < them) r.lost += 1
    else r.drawn += 1
  }
  return r
}

function groupByMonth(matches: Match[]) {
  const groups: { key: string; title: string; matches: Match[] }[] = []
  const sorted = [...matches].sort((a, b) => a.date.localeCompare(b.date))
  for (const match of sorted) {
    const { y, m } = parseDate(match.date)
    const key = `${y}-${m}`
    let group = groups.find((g) => g.key === key)
    if (!group) {
      group = { key, title: `${MONTHS[m - 1]} ${y}`, matches: [] }
      groups.push(group)
    }
    group.matches.push(match)
  }
  return groups
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const BAND_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const LABEL = "font-mono text-label uppercase"
const LABEL_LINK = cn(
  LABEL,
  "text-foreground underline underline-offset-4 hover:decoration-2",
  FOCUS
)
const BUTTON = "h-auto px-5 py-2 font-mono text-label uppercase"

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
      {children}
    </span>
  )
}

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn("group inline-flex items-center gap-3", BAND_FOCUS)}
        >
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground"
          >
            W
          </span>
          <span className="font-heading text-h2 uppercase underline-offset-4 group-hover:underline">
            Wendmoor FC
          </span>
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5">
            {NAV.map((link) => {
              const current = link.href === "/fixtures"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                      current && "underline decoration-2",
                      BAND_FOCUS
                    )}
                  >
                    {link.label}
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
        <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={LABEL_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(LABEL, "text-muted-foreground")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

type RowProps = {
  match: Match
  team: Team
  first: boolean
  isNext: boolean
  badge?: "Final" | "Live"
  reportLink: boolean
}

function MatchRow({ match, team, first, isNext, badge, reportLink }: RowProps) {
  const club = CLUBS[match.club]
  const venue =
    match.venue ?? (match.side === "home" ? HOME_GROUND : club.ground)
  const muted = isNext ? undefined : "text-muted-foreground"

  let figure: ReactNode
  let label: string
  if (match.score) {
    figure = `${match.score[0]}–${match.score[1]}`
    label = isLive(match) ? `${match.liveMinute}'` : outcome(match.score)
  } else {
    figure = (
      <time dateTime={`${match.date}T${match.kickOff}`}>{match.kickOff}</time>
    )
    label = "Kick-off"
  }

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-5 px-5 py-3",
        !first && "border-t border-border",
        isNext && "bg-ice text-ice-foreground"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "hidden size-8 shrink-0 items-center justify-center rounded-full font-mono text-label md:flex",
            isNext
              ? "bg-navy text-navy-foreground"
              : "bg-ice text-ice-foreground"
          )}
        >
          {club.crest}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className={cn("flex flex-wrap gap-x-3 gap-y-1", LABEL, muted)}>
            <time dateTime={match.date}>{dateLabel(match.date)}</time>
            <span>{match.side}</span>
            <span>{venue}</span>
            {match.round && <span>{match.round}</span>}
            {reportLink && (
              <a href="/report" className={LABEL_LINK}>
                Match report
              </a>
            )}
          </div>
          <p className="font-heading text-body font-bold uppercase">
            {club.name}
            {team.suffix}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          {badge && <Badge>{badge}</Badge>}
          <p className="font-heading text-h2 tabular-nums">{figure}</p>
        </div>
        <p className={cn(LABEL, muted)}>{label}</p>
      </div>
    </li>
  )
}

function Matches({ team }: { team: Team }) {
  const baseId = useId()
  const played = team.matches.filter(isPlayed)
  const latest = played[played.length - 1]
  const live = team.matches.find(isLive)
  const next = team.matches.find(isToCome)

  return (
    <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
      {groupByMonth(team.matches).map((group) => {
        const headingId = `${baseId}-${group.key}`
        return (
          <section
            key={group.key}
            aria-labelledby={headingId}
            className="flex flex-col gap-3"
          >
            <h2 id={headingId} className="text-h2 uppercase">
              {group.title}
            </h2>
            <ul className="overflow-hidden rounded-xl border border-border bg-card">
              {group.matches.map((match, i) => {
                const badge =
                  match === live
                    ? "Live"
                    : !live && match === latest
                      ? "Final"
                      : undefined
                return (
                  <MatchRow
                    key={match.date}
                    match={match}
                    team={team}
                    first={i === 0}
                    isNext={match === next}
                    badge={badge}
                    reportLink={team.id === "first" && match === latest}
                  />
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function Record({ team }: { team: Team }) {
  const r = record(team)
  const items: [string, number][] = [
    ["Played", r.played],
    ["Won", r.won],
    ["Drawn", r.drawn],
    ["Lost", r.lost],
    ["Goals for", r.for],
    ["Goals against", r.against],
  ]
  return (
    <section
      aria-labelledby="record-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="record-heading" className="text-h2 uppercase">
          Record
        </h2>
        <p className={cn(LABEL, "text-muted-foreground")}>{team.name}</p>
      </div>
      <dl className="grid grid-cols-3 gap-5">
        {items.map(([name, value]) => (
          <div key={name} className="flex flex-col-reverse gap-1">
            <dt className={cn(LABEL, "text-muted-foreground")}>{name}</dt>
            <dd className="font-heading text-h1 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-label text-muted-foreground">
        Scores show Wendmoor FC's goals first. A match being played is not
        counted.
      </p>
    </section>
  )
}

const MATCH_DAYS: [string, string][] = [
  ["Adults", "£4"],
  ["Under 16s", "Free"],
  ["Gates open", "One hour before kick-off"],
  ["Ground", "Millrace Park, Mill Lane"],
]

function MatchDays() {
  return (
    <section
      aria-labelledby="match-days-heading"
      className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
    >
      <h2 id="match-days-heading" className="text-h2 uppercase">
        Match days
      </h2>
      <dl className="flex flex-col gap-2">
        {MATCH_DAYS.map(([name, value]) => (
          <div key={name} className="flex items-baseline justify-between gap-3">
            <dt className={LABEL}>{name}</dt>
            <dd className="text-right text-body">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-body">
        The tea bar takes cash and cards. At away matches the home club sets the
        price.
      </p>
    </section>
  )
}

export function App() {
  const [teamId, setTeamId] = useState<TeamId>("first")
  const [announcement, setAnnouncement] = useState("")
  const team = TEAMS.find((t) => t.id === teamId) ?? TEAMS[0]

  function choose(next: Team) {
    if (next.id === teamId) return
    setTeamId(next.id)
    setAnnouncement(countSentence(next))
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className={cn(LABEL, "text-muted-foreground")}>
                  2027 season
                </p>
                <h1 className="text-h1 uppercase">Fixtures and results</h1>
              </div>
              <a
                href="/membership"
                className={cn(buttonVariants({ variant: "default" }), BUTTON)}
              >
                Join the club
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Team"
                className="flex flex-wrap gap-2"
              >
                {TEAMS.map((t) => {
                  const chosen = t.id === teamId
                  return (
                    <Button
                      key={t.id}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={BUTTON}
                      onClick={() => choose(t)}
                    >
                      {t.name}
                    </Button>
                  )
                })}
              </div>
              <p className={cn(LABEL, "text-muted-foreground")}>
                {countLabel(team)}
              </p>
            </div>
            <p role="status" className="sr-only">
              {announcement}
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <Matches team={team} />
              <div className="flex min-w-0 flex-col gap-5 lg:col-span-4">
                <Record team={team} />
                <MatchDays />
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
