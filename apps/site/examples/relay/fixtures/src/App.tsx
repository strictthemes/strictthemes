import { useState, type ReactNode } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The sample's "now" is fixed: Tuesday 8 June 2027 at 20:05. Nothing ticks.

type Club = { letters: string; ground: string }

const CLUBS: Record<string, Club> = {
  "Wendmoor FC": { letters: "W", ground: "Millrace Park" },
  "Castlebrook United": { letters: "CU", ground: "Castle Meadow" },
  "Dunmarsh Athletic": { letters: "DA", ground: "The Saltings" },
  "Otterby Town": { letters: "OT", ground: "Weir Lane" },
  "Stenwick Albion": { letters: "SA", ground: "Albion Field" },
  "Kirkfen Rangers": { letters: "KR", ground: "Fen Road" },
  "Lowmere Welfare": { letters: "LW", ground: "Welfare Ground" },
  "Pellow Green": { letters: "PG", ground: "The Green" },
  Hollinvale: { letters: "H", ground: "Hollin Bank" },
  "Tarrowby United": { letters: "TU", ground: "Station Road" },
  Sedgeholme: { letters: "S", ground: "Sedge Lane" },
  "Eastlow Wanderers": { letters: "EW", ground: "Quarry Lane" },
}

const HOME_GROUND = "Millrace Park"

type Side = "home" | "away" | "neutral"

type Match = {
  date: string // ISO date
  club: string // a key of CLUBS
  side: Side
  kickoff: string // 24-hour clock
  score?: [number, number] // Wendmoor FC's goals first
  live?: { score: [number, number]; minute: number }
  round?: string
  venue?: string // only for a neutral ground
}

type TeamId = "first" | "reserves" | "u18"

type Team = {
  id: TeamId
  name: string
  suffix: string
  matches: Match[]
}

function m(
  date: string,
  club: string,
  side: Side,
  kickoff: string,
  score?: [number, number],
  extra: Partial<Match> = {}
): Match {
  return { date, club, side, kickoff, score, ...extra }
}

const TEAMS: Team[] = [
  {
    id: "first",
    name: "First team",
    suffix: "",
    matches: [
      m("2027-03-06", "Kirkfen Rangers", "away", "15:00", [1, 1]),
      m("2027-03-13", "Tarrowby United", "home", "15:00", [1, 0]),
      m("2027-03-20", "Otterby Town", "away", "15:00", [0, 3]),
      m("2027-03-27", "Castlebrook United", "home", "15:00", [4, 2]),
      m("2027-04-03", "Stenwick Albion", "away", "15:00", [3, 2]),
      m("2027-04-10", "Sedgeholme", "home", "15:00", [2, 4]),
      m("2027-04-17", "Dunmarsh Athletic", "away", "15:00", [2, 2]),
      m("2027-04-24", "Eastlow Wanderers", "home", "15:00", [3, 0]),
      m("2027-05-01", "Hollinvale", "away", "15:00", [1, 1]),
      m("2027-05-08", "Lowmere Welfare", "home", "15:00", [2, 0]),
      m("2027-05-15", "Pellow Green", "away", "15:00", [1, 3]),
      m("2027-05-22", "Kirkfen Rangers", "home", "15:00", [2, 0]),
      m("2027-05-29", "Tarrowby United", "away", "15:00", [5, 0]),
      m("2027-06-05", "Otterby Town", "home", "15:00", [3, 1]),
      m("2027-06-12", "Castlebrook United", "away", "15:00"),
      m("2027-06-19", "Stenwick Albion", "home", "15:00"),
      m("2027-06-26", "Sedgeholme", "away", "15:00"),
      m("2027-07-03", "Dunmarsh Athletic", "home", "15:00"),
      m("2027-07-10", "Eastlow Wanderers", "away", "15:00"),
      m("2027-07-17", "Hollinvale", "home", "15:00"),
      m("2027-07-24", "Lowmere Welfare", "away", "15:00"),
      m("2027-07-31", "Pellow Green", "home", "15:00"),
    ],
  },
  {
    id: "reserves",
    name: "Reserves",
    suffix: " Reserves",
    matches: [
      m("2027-05-18", "Stenwick Albion", "away", "19:30", [2, 2]),
      m("2027-05-25", "Lowmere Welfare", "home", "19:30", [3, 1]),
      m("2027-06-01", "Dunmarsh Athletic", "away", "19:30", [0, 2]),
      m("2027-06-08", "Sedgeholme", "home", "19:30", undefined, {
        live: { score: [1, 0], minute: 35 },
      }),
      m("2027-06-15", "Castlebrook United", "away", "19:30"),
      m("2027-06-22", "Pellow Green", "home", "19:30"),
      m("2027-06-29", "Kirkfen Rangers", "away", "19:30"),
      m("2027-07-06", "Otterby Town", "home", "19:30"),
    ],
  },
  {
    id: "u18",
    name: "Under 18s",
    suffix: " U18",
    matches: [
      m("2027-05-23", "Castlebrook United", "home", "10:30", [1, 1]),
      m("2027-05-30", "Pellow Green", "away", "10:30", [2, 1], {
        round: "County Youth Cup semi-final",
      }),
      m("2027-06-06", "Kirkfen Rangers", "home", "10:30", [4, 0]),
      m("2027-06-13", "Stenwick Albion", "away", "10:30"),
      m("2027-06-20", "Otterby Town", "home", "10:30"),
      m("2027-06-27", "Dunmarsh Athletic", "neutral", "14:00", undefined, {
        venue: "Castle Meadow",
        round: "County Youth Cup final",
      }),
    ],
  },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const MONTHS_LONG = [
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
  const [y, mo, d] = iso.split("-").map(Number)
  return {
    year: y,
    month: mo - 1,
    day: d,
    weekday: new Date(Date.UTC(y, mo - 1, d)).getUTCDay(),
  }
}

function shortDate(iso: string) {
  const { day, month, weekday } = parseDate(iso)
  return `${DAYS[weekday]} ${day} ${MONTHS_SHORT[month]}`
}

function score([a, b]: [number, number]) {
  return `${a}–${b}`
}

function outcome([a, b]: [number, number]) {
  if (a > b) return "Won"
  if (a < b) return "Lost"
  return "Drew"
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function summarise(team: Team) {
  const total = team.matches.length
  const played = team.matches.filter((x) => x.score).length
  const live = team.matches.filter((x) => x.live).length
  const toCome = total - played - live
  const parts = [
    plural(total, "match", "matches"),
    `${played} played`,
    ...(live > 0 ? [`${live} live`] : []),
    `${toCome} to come`,
  ]
  return {
    label: parts.join(" · "),
    sentence: `${team.name}: ${parts.join(", ")}.`,
  }
}

function record(team: Team) {
  const r = { played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0 }
  for (const x of team.matches) {
    if (!x.score) continue
    const [a, b] = x.score
    r.played += 1
    r.for += a
    r.against += b
    if (a > b) r.won += 1
    else if (a < b) r.lost += 1
    else r.drawn += 1
  }
  return r
}

function marks(team: Team) {
  let latest = -1
  team.matches.forEach((x, i) => {
    if (x.score) latest = i
  })
  const live = team.matches.findIndex((x) => x.live)
  const next = team.matches.findIndex((x) => !x.score && !x.live)
  return { latest, live, next }
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2"
const FOCUS_PAGE = `${FOCUS} focus-visible:outline-ring`
const FOCUS_BAND = `${FOCUS} focus-visible:outline-navy-foreground`

const BADGE =
  "inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label uppercase whitespace-nowrap text-tertiary-foreground"

const BUTTON = "h-auto px-5 py-2 font-mono text-label uppercase"

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
          className={cn("group inline-flex items-center gap-3", FOCUS_BAND)}
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
                      FOCUS_BAND
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
                <a
                  href={link.href}
                  className={cn(
                    "font-mono text-label text-foreground uppercase underline underline-offset-4 hover:decoration-2",
                    FOCUS_PAGE
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase">
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

function MatchRow({
  team,
  match,
  first,
  badge,
  marked,
  report,
}: {
  team: Team
  match: Match
  first: boolean
  badge?: "Final" | "Live"
  marked: boolean
  report: boolean
}) {
  const club = CLUBS[match.club]
  const venue =
    match.side === "home"
      ? HOME_GROUND
      : match.side === "away"
        ? club.ground
        : (match.venue ?? club.ground)
  const sideLabel =
    match.side === "home" ? "Home" : match.side === "away" ? "Away" : "Neutral"
  const muted = marked ? "" : "text-muted-foreground"

  let figure: ReactNode
  let note: string
  if (match.live) {
    figure = score(match.live.score)
    note = `${match.live.minute}'`
  } else if (match.score) {
    figure = score(match.score)
    note = outcome(match.score)
  } else {
    figure = (
      <time dateTime={`${match.date}T${match.kickoff}`}>{match.kickoff}</time>
    )
    note = "Kick-off"
  }

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-5 px-5 py-3",
        !first && "border-t border-border",
        marked && "bg-ice text-ice-foreground"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "hidden size-8 shrink-0 items-center justify-center rounded-full font-mono text-label md:flex",
            marked
              ? "bg-navy text-navy-foreground"
              : "bg-ice text-ice-foreground"
          )}
        >
          {club.letters}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div
            className={cn(
              "flex flex-wrap gap-x-3 gap-y-1 font-mono text-label uppercase tabular-nums",
              muted
            )}
          >
            <time dateTime={match.date}>{shortDate(match.date)}</time>
            <span>{sideLabel}</span>
            <span>{venue}</span>
            {match.round && <span>{match.round}</span>}
            {report && (
              <a
                href="/report"
                className={cn(
                  "text-foreground underline underline-offset-4 hover:decoration-2",
                  FOCUS_PAGE
                )}
              >
                Match report
              </a>
            )}
          </div>
          <p className="font-heading text-body font-bold uppercase">
            {match.club}
            {team.suffix}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          {badge && <span className={BADGE}>{badge}</span>}
          <p className="font-heading text-h2 tabular-nums">{figure}</p>
        </div>
        <p className={cn("font-mono text-label uppercase tabular-nums", muted)}>
          {note}
        </p>
      </div>
    </li>
  )
}

function Matches({ team }: { team: Team }) {
  const { latest, live, next } = marks(team)
  const months: {
    key: string
    title: string
    items: { match: Match; index: number }[]
  }[] = []
  team.matches.forEach((match, index) => {
    const { year, month } = parseDate(match.date)
    const key = `${year}-${String(month + 1).padStart(2, "0")}`
    let group = months.find((g) => g.key === key)
    if (!group) {
      group = { key, title: `${MONTHS_LONG[month]} ${year}`, items: [] }
      months.push(group)
    }
    group.items.push({ match, index })
  })
  months.sort((a, b) => a.key.localeCompare(b.key))

  return (
    <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
      {months.map((group) => {
        const headingId = `month-${team.id}-${group.key}`
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
              {group.items.map(({ match, index }, i) => {
                let badge: "Final" | "Live" | undefined
                if (live >= 0) badge = index === live ? "Live" : undefined
                else badge = index === latest ? "Final" : undefined
                return (
                  <MatchRow
                    key={match.date}
                    team={team}
                    match={match}
                    first={i === 0}
                    badge={badge}
                    marked={index === next}
                    report={team.id === "first" && index === latest}
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
  const figures: [string, number][] = [
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
        <p className="font-mono text-label text-muted-foreground uppercase">
          {team.name}
        </p>
      </div>
      <dl className="grid grid-cols-3 items-start gap-5">
        {figures.map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="font-mono text-label text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="font-heading text-h1 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-label text-muted-foreground">
        Scores show Wendmoor FC’s goals first. A match being played is not
        counted.
      </p>
    </section>
  )
}

function MatchDays() {
  const rows: [string, string][] = [
    ["Adults", "£4"],
    ["Under 16s", "Free"],
    ["Gates open", "One hour before kick-off"],
    ["Ground", "Millrace Park, Mill Lane"],
  ]
  return (
    <section
      aria-labelledby="match-days-heading"
      className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
    >
      <h2 id="match-days-heading" className="text-h2 uppercase">
        Match days
      </h2>
      <dl className="flex flex-col gap-2">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-baseline justify-between gap-3">
            <dt className="font-mono text-label uppercase">{term}</dt>
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
  const summary = summarise(team)

  function choose(id: TeamId) {
    if (id === teamId) return
    const chosen = TEAMS.find((t) => t.id === id)
    if (!chosen) return
    setTeamId(id)
    setAnnouncement(summarise(chosen).sentence)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-label text-muted-foreground uppercase">
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
                      aria-pressed={chosen ? "true" : "false"}
                      className={BUTTON}
                      onClick={() => choose(t.id)}
                    >
                      {t.name}
                    </Button>
                  )
                })}
              </div>
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                {summary.label}
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
