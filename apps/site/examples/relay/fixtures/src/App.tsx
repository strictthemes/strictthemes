import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TeamId = "first" | "reserves" | "u18"

type Club = { name: string; crest: string; ground: string }

type Match = {
  date: string
  kickOff: string
  club: Club
  suffix?: string
  side: "home" | "away" | "neutral"
  venue?: string
  round?: string
  score?: [number, number]
  liveMinute?: number
  report?: string
}

type Team = {
  id: TeamId
  name: string
  label: string
  matches: Match[]
}

const CLUBS = {
  castlebrook: {
    name: "Castlebrook United",
    crest: "CU",
    ground: "Castle Meadow",
  },
  dunmarsh: { name: "Dunmarsh Athletic", crest: "DA", ground: "The Saltings" },
  otterby: { name: "Otterby Town", crest: "OT", ground: "Weir Lane" },
  stenwick: { name: "Stenwick Albion", crest: "SA", ground: "Albion Field" },
  kirkfen: { name: "Kirkfen Rangers", crest: "KR", ground: "Fen Road" },
  lowmere: { name: "Lowmere Welfare", crest: "LW", ground: "Welfare Ground" },
  pellow: { name: "Pellow Green", crest: "PG", ground: "The Green" },
  hollinvale: { name: "Hollinvale", crest: "H", ground: "Hollin Bank" },
  tarrowby: { name: "Tarrowby United", crest: "TU", ground: "Station Road" },
  sedgeholme: { name: "Sedgeholme", crest: "S", ground: "Sedge Lane" },
  eastlow: { name: "Eastlow Wanderers", crest: "EW", ground: "Quarry Lane" },
} satisfies Record<string, Club>

const HOME_GROUND = "Millrace Park"

function first(
  date: string,
  club: Club,
  side: "home" | "away",
  score?: [number, number],
  extra: Partial<Match> = {}
): Match {
  return { date, kickOff: "15:00", club, side, score, ...extra }
}

function reserves(
  date: string,
  club: Club,
  side: "home" | "away",
  score?: [number, number],
  extra: Partial<Match> = {}
): Match {
  return {
    date,
    kickOff: "19:30",
    club,
    suffix: "Reserves",
    side,
    score,
    ...extra,
  }
}

function youth(
  date: string,
  club: Club,
  side: "home" | "away" | "neutral",
  score?: [number, number],
  extra: Partial<Match> = {}
): Match {
  return {
    date,
    kickOff: "10:30",
    club,
    suffix: "U18",
    side,
    score,
    ...extra,
  }
}

const TEAMS: Team[] = [
  {
    id: "first",
    name: "First team",
    label: "First team",
    matches: [
      first("2027-03-06", CLUBS.kirkfen, "away", [1, 1]),
      first("2027-03-13", CLUBS.tarrowby, "home", [1, 0]),
      first("2027-03-20", CLUBS.otterby, "away", [0, 3]),
      first("2027-03-27", CLUBS.castlebrook, "home", [4, 2]),
      first("2027-04-03", CLUBS.stenwick, "away", [3, 2]),
      first("2027-04-10", CLUBS.sedgeholme, "home", [2, 4]),
      first("2027-04-17", CLUBS.dunmarsh, "away", [2, 2]),
      first("2027-04-24", CLUBS.eastlow, "home", [3, 0]),
      first("2027-05-01", CLUBS.hollinvale, "away", [1, 1]),
      first("2027-05-08", CLUBS.lowmere, "home", [2, 0]),
      first("2027-05-15", CLUBS.pellow, "away", [1, 3]),
      first("2027-05-22", CLUBS.kirkfen, "home", [2, 0]),
      first("2027-05-29", CLUBS.tarrowby, "away", [5, 0]),
      first("2027-06-05", CLUBS.otterby, "home", [3, 1], {
        report: "/report",
      }),
      first("2027-06-12", CLUBS.castlebrook, "away"),
      first("2027-06-19", CLUBS.stenwick, "home"),
      first("2027-06-26", CLUBS.sedgeholme, "away"),
      first("2027-07-03", CLUBS.dunmarsh, "home"),
      first("2027-07-10", CLUBS.eastlow, "away"),
      first("2027-07-17", CLUBS.hollinvale, "home"),
      first("2027-07-24", CLUBS.lowmere, "away"),
      first("2027-07-31", CLUBS.pellow, "home"),
    ],
  },
  {
    id: "reserves",
    name: "Reserves",
    label: "Reserves",
    matches: [
      reserves("2027-05-18", CLUBS.stenwick, "away", [2, 2]),
      reserves("2027-05-25", CLUBS.lowmere, "home", [3, 1]),
      reserves("2027-06-01", CLUBS.dunmarsh, "away", [0, 2]),
      reserves("2027-06-08", CLUBS.sedgeholme, "home", [1, 0], {
        liveMinute: 35,
      }),
      reserves("2027-06-15", CLUBS.castlebrook, "away"),
      reserves("2027-06-22", CLUBS.pellow, "home"),
      reserves("2027-06-29", CLUBS.kirkfen, "away"),
      reserves("2027-07-06", CLUBS.otterby, "home"),
    ],
  },
  {
    id: "u18",
    name: "Under 18s",
    label: "Under 18s",
    matches: [
      youth("2027-05-23", CLUBS.castlebrook, "home", [1, 1]),
      youth("2027-05-30", CLUBS.pellow, "away", [2, 1], {
        round: "County Youth Cup semi-final",
      }),
      youth("2027-06-06", CLUBS.kirkfen, "home", [4, 0]),
      youth("2027-06-13", CLUBS.stenwick, "away"),
      youth("2027-06-20", CLUBS.otterby, "home"),
      youth("2027-06-27", CLUBS.dunmarsh, "neutral", undefined, {
        venue: "Castle Meadow",
        kickOff: "14:00",
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
  return new Date(Date.UTC(y, m - 1, d))
}

function dateLabel(iso: string) {
  const date = parseDate(iso)
  const day = DAYS[date.getUTCDay()]
  const month = MONTHS[date.getUTCMonth()].slice(0, 3).toUpperCase()
  return `${day} ${date.getUTCDate()} ${month}`
}

function monthKey(iso: string) {
  return iso.slice(0, 7)
}

function monthName(key: string) {
  const [y, m] = key.split("-").map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

type Status = "final" | "live" | "upcoming"

function statusOf(match: Match): Status {
  if (match.liveMinute !== undefined) return "live"
  return match.score ? "final" : "upcoming"
}

function scoreText([us, them]: [number, number]) {
  return `${us}–${them}`
}

function resultLabel([us, them]: [number, number]) {
  if (us > them) return "Won"
  if (us < them) return "Lost"
  return "Drew"
}

function opponentName(match: Match) {
  return match.suffix ? `${match.club.name} ${match.suffix}` : match.club.name
}

function venueOf(match: Match) {
  if (match.venue) return match.venue
  return match.side === "home" ? HOME_GROUND : match.club.ground
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function summarise(team: Team) {
  const statuses = team.matches.map(statusOf)
  const played = statuses.filter((s) => s === "final").length
  const live = statuses.filter((s) => s === "live").length
  const toCome = statuses.filter((s) => s === "upcoming").length
  return { total: team.matches.length, played, live, toCome }
}

function countParts(team: Team) {
  const { total, played, live, toCome } = summarise(team)
  const parts = [plural(total, "match", "matches"), `${played} played`]
  if (live > 0) parts.push(`${live} live`)
  parts.push(`${toCome} to come`)
  return parts
}

function recordOf(team: Team) {
  const finals = team.matches.filter((m) => statusOf(m) === "final")
  let won = 0
  let drawn = 0
  let lost = 0
  let goalsFor = 0
  let goalsAgainst = 0
  for (const match of finals) {
    const [us, them] = match.score!
    goalsFor += us
    goalsAgainst += them
    if (us > them) won += 1
    else if (us < them) lost += 1
    else drawn += 1
  }
  return [
    { label: "Played", value: finals.length },
    { label: "Won", value: won },
    { label: "Drawn", value: drawn },
    { label: "Lost", value: lost },
    { label: "Goals for", value: goalsFor },
    { label: "Goals against", value: goalsAgainst },
  ]
}

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const CONTAINER = "mx-auto w-full max-w-[1240px] px-5"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const BAND_FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const BUTTON_CLASSES = "h-auto px-5 py-2 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase"

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div
        className={cn(
          CONTAINER,
          "flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-3 transition-colors duration-150",
            BAND_FOCUS
          )}
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
                      BAND_FOCUS
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
      <div className={cn(CONTAINER, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    LABEL,
                    "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
                    FOCUS
                  )}
                >
                  {item.label}
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

function MatchRow({
  match,
  isFirstRow,
  isNext,
  badge,
}: {
  match: Match
  isFirstRow: boolean
  isNext: boolean
  badge?: "Final" | "Live"
}) {
  const status = statusOf(match)
  const muted = isNext ? undefined : "text-muted-foreground"
  const sideLabel =
    match.side === "home" ? "Home" : match.side === "away" ? "Away" : "Neutral"

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-5 px-5 py-3",
        !isFirstRow && "border-t border-border",
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
          {match.club.crest}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className={cn("flex flex-wrap gap-x-3 gap-y-1", LABEL, muted)}>
            <time dateTime={match.date}>{dateLabel(match.date)}</time>
            <span>{sideLabel}</span>
            <span>{venueOf(match)}</span>
            {match.round && <span>{match.round}</span>}
            {match.report && (
              <a
                href={match.report}
                className={cn(
                  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
                  FOCUS
                )}
              >
                Match report
              </a>
            )}
          </div>
          <p className="font-heading text-body font-bold uppercase">
            {opponentName(match)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          {badge && (
            <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
              {badge}
            </span>
          )}
          {status === "upcoming" ? (
            <time
              dateTime={`${match.date}T${match.kickOff}`}
              className="font-heading text-h2 tabular-nums"
            >
              {match.kickOff}
            </time>
          ) : (
            <p className="font-heading text-h2 tabular-nums">
              {scoreText(match.score!)}
            </p>
          )}
        </div>
        <p className={cn(LABEL, muted)}>
          {status === "upcoming"
            ? "Kick-off"
            : status === "live"
              ? `${match.liveMinute}'`
              : resultLabel(match.score!)}
        </p>
      </div>
    </li>
  )
}

export function App() {
  const [teamId, setTeamId] = useState<TeamId>("first")
  const [announcement, setAnnouncement] = useState("")

  const team = TEAMS.find((t) => t.id === teamId)!
  const statuses = team.matches.map(statusOf)
  const nextIndex = statuses.indexOf("upcoming")
  const liveIndex = statuses.indexOf("live")
  const latestIndex = statuses.lastIndexOf("final")
  const badgeIndex = liveIndex !== -1 ? liveIndex : latestIndex
  const badgeText: "Final" | "Live" = liveIndex !== -1 ? "Live" : "Final"

  const months: { key: string; items: { match: Match; index: number }[] }[] = []
  team.matches.forEach((match, index) => {
    const key = monthKey(match.date)
    const last = months[months.length - 1]
    if (last && last.key === key) last.items.push({ match, index })
    else months.push({ key, items: [{ match, index }] })
  })

  const record = recordOf(team)

  function choose(next: Team) {
    if (next.id === teamId) return
    setTeamId(next.id)
    setAnnouncement(`${next.name}: ${countParts(next).join(", ")}.`)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className={cn(CONTAINER, "flex flex-col gap-18 pt-8 pb-18")}>
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
                className={cn(
                  buttonVariants({ variant: "default" }),
                  BUTTON_CLASSES
                )}
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
                      className={BUTTON_CLASSES}
                      onClick={() => choose(t)}
                    >
                      {t.name}
                    </Button>
                  )
                })}
              </div>
              <p className={cn(LABEL, "text-muted-foreground")}>
                {countParts(team).join(" · ")}
              </p>
            </div>
            <p role="status" className="sr-only">
              {announcement}
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
                {months.map((month) => (
                  <section
                    key={month.key}
                    aria-labelledby={`month-${month.key}`}
                    className="flex flex-col gap-3"
                  >
                    <h2 id={`month-${month.key}`} className="text-h2 uppercase">
                      {monthName(month.key)}
                    </h2>
                    <ul className="overflow-hidden rounded-xl border border-border bg-card">
                      {month.items.map(({ match, index }, i) => (
                        <MatchRow
                          key={match.date}
                          match={match}
                          isFirstRow={i === 0}
                          isNext={index === nextIndex}
                          badge={index === badgeIndex ? badgeText : undefined}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="flex min-w-0 flex-col gap-5 lg:col-span-4">
                <section
                  aria-labelledby="record-heading"
                  className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 id="record-heading" className="text-h2 uppercase">
                      Record
                    </h2>
                    <p className={cn(LABEL, "text-muted-foreground")}>
                      {team.label}
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-5">
                    {record.map((item) => (
                      <div
                        key={item.label}
                        className="flex flex-col-reverse gap-1"
                      >
                        <dt className={cn(LABEL, "text-muted-foreground")}>
                          {item.label}
                        </dt>
                        <dd className="font-heading text-h1 tabular-nums">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-label text-muted-foreground">
                    Scores show Wendmoor FC's goals first. A match being played
                    is not counted.
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
                    {[
                      ["Adults", "£4"],
                      ["Under 16s", "Free"],
                      ["Gates open", "One hour before kick-off"],
                      ["Ground", "Millrace Park, Mill Lane"],
                    ].map(([term, value]) => (
                      <div
                        key={term}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <dt className={LABEL}>{term}</dt>
                        <dd className="text-right text-body">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-body">
                    The tea bar takes cash and cards. At away matches the home
                    club sets the price.
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
