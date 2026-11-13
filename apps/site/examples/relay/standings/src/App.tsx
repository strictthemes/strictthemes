import { useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type View = "all" | "home" | "away"

type MatchRecord = {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

type Club = {
  name: string
  home: MatchRecord
  away: MatchRecord
}

type Row = MatchRecord & {
  name: string
  goalDifference: number
  points: number
}

const OWN_CLUB = "Wendmoor FC"

function rec(
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number
): MatchRecord {
  return { played, won, drawn, lost, goalsFor, goalsAgainst }
}

const CLUBS: Club[] = [
  {
    name: "Castlebrook United",
    home: rec(6, 4, 1, 1, 12, 6),
    away: rec(8, 5, 1, 2, 22, 14),
  },
  {
    name: "Dunmarsh Athletic",
    home: rec(7, 5, 2, 0, 15, 4),
    away: rec(7, 2, 4, 1, 15, 14),
  },
  {
    name: "Wendmoor FC",
    home: rec(7, 6, 0, 1, 17, 7),
    away: rec(7, 2, 3, 2, 13, 12),
  },
  {
    name: "Pellow Green",
    home: rec(8, 6, 1, 1, 14, 7),
    away: rec(6, 2, 1, 3, 6, 6),
  },
  {
    name: "Stenwick Albion",
    home: rec(6, 4, 0, 2, 13, 8),
    away: rec(8, 3, 2, 3, 7, 8),
  },
  {
    name: "Lowmere Welfare",
    home: rec(8, 5, 1, 2, 12, 8),
    away: rec(6, 1, 1, 4, 6, 9),
  },
  {
    name: "Sedgeholme",
    home: rec(6, 3, 2, 1, 10, 9),
    away: rec(8, 2, 1, 5, 12, 13),
  },
  {
    name: "Otterby Town",
    home: rec(6, 3, 2, 1, 9, 5),
    away: rec(8, 1, 3, 4, 8, 13),
  },
  {
    name: "Tarrowby United",
    home: rec(7, 2, 3, 2, 7, 10),
    away: rec(7, 1, 2, 4, 3, 8),
  },
  {
    name: "Kirkfen Rangers",
    home: rec(7, 2, 4, 1, 12, 9),
    away: rec(7, 0, 2, 5, 7, 14),
  },
  {
    name: "Hollinvale",
    home: rec(8, 2, 3, 3, 10, 14),
    away: rec(6, 0, 1, 5, 3, 12),
  },
  {
    name: "Eastlow Wanderers",
    home: rec(8, 2, 2, 4, 8, 17),
    away: rec(6, 0, 0, 6, 2, 16),
  },
]

const VIEWS: {
  value: View
  button: string
  label: string
  status: string
  caption: string
}[] = [
  {
    value: "all",
    button: "All matches",
    label: "ALL MATCHES",
    status: "All matches",
    caption:
      "Kestrel Valley League, Division One: all matches, after 14 of 22.",
  },
  {
    value: "home",
    button: "Home",
    label: "HOME MATCHES",
    status: "Home matches",
    caption: "Kestrel Valley League, Division One: home matches only.",
  },
  {
    value: "away",
    button: "Away",
    label: "AWAY MATCHES",
    status: "Away matches",
    caption: "Kestrel Valley League, Division One: away matches only.",
  },
]

function recordFor(club: Club, view: View): MatchRecord {
  if (view === "home") return club.home
  if (view === "away") return club.away
  return {
    played: club.home.played + club.away.played,
    won: club.home.won + club.away.won,
    drawn: club.home.drawn + club.away.drawn,
    lost: club.home.lost + club.away.lost,
    goalsFor: club.home.goalsFor + club.away.goalsFor,
    goalsAgainst: club.home.goalsAgainst + club.away.goalsAgainst,
  }
}

function standings(view: View): Row[] {
  return CLUBS.map((club) => {
    const r = recordFor(club, view)
    return {
      name: club.name,
      ...r,
      goalDifference: r.goalsFor - r.goalsAgainst,
      points: r.won * 3 + r.drawn,
    }
  }).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name)
  )
}

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function ordinal(n: number) {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  const ones = n % 10
  const suffix =
    ones === 1 ? "st" : ones === 2 ? "nd" : ones === 3 ? "rd" : "th"
  return `${n}${suffix}`
}

function gapToTop(rows: Row[]) {
  const top = rows[0]
  const own = rows.find((r) => r.name === OWN_CLUB)!
  if (top.name === OWN_CLUB) return "Top of the table."
  const gap = top.points - own.points
  if (gap === 0) return `Level on points with ${top.name}.`
  return `${gap} ${gap === 1 ? "point" : "points"} behind ${top.name}.`
}

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const KEY = [
  ["P", "Played"],
  ["W", "Won"],
  ["D", "Drawn"],
  ["L", "Lost"],
  ["GF", "Goals for"],
  ["GA", "Goals against"],
  ["GD", "Goal difference"],
  ["PTS", "Points"],
]

const bandFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const pageFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const buttonClasses = "h-auto px-5 py-2 font-mono text-label uppercase"
const headCell = "py-3 font-mono text-label uppercase text-ice"
const mdOnly = "hidden md:table-cell"

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn("group inline-flex items-center gap-3", bandFocus)}
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
            {NAV.map((item) => {
              const current = item.href === "/standings"
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                      current && "underline decoration-2",
                      bandFocus
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
        <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "font-mono text-label text-foreground uppercase underline underline-offset-4 hover:decoration-2",
                    pageFocus
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase">
          © 2027 WENDMOOR FOOTBALL CLUB · MILLRACE PARK, WENDMOOR · A DEMO:
          NOTHING IS SENT OR STORED
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [view, setView] = useState<View>("all")
  const [announcement, setAnnouncement] = useState("")

  const rows = standings(view)
  const current = VIEWS.find((v) => v.value === view)!
  const ownIndex = rows.findIndex((r) => r.name === OWN_CLUB)
  const own = rows[ownIndex]
  const ownPosition = ownIndex + 1

  function choose(next: View) {
    if (next === view) return
    setView(next)
    const nextRows = standings(next)
    const index = nextRows.findIndex((r) => r.name === OWN_CLUB)
    const label = VIEWS.find((v) => v.value === next)!.status
    setAnnouncement(
      `${label}: ${OWN_CLUB} are ${ordinal(index + 1)} with ${nextRows[index].points} ${
        nextRows[index].points === 1 ? "point" : "points"
      }.`
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            {/* Page head */}
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-label text-muted-foreground uppercase">
                  KESTREL VALLEY LEAGUE · 2027 SEASON
                </p>
                <h1 className="text-h1 uppercase">Division One table</h1>
              </div>
              <a
                href="/membership"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
              >
                Join the club
              </a>
            </div>

            {/* Matches control */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="Matches counted"
                  className="flex flex-wrap gap-2"
                >
                  {VIEWS.map((v) => {
                    const chosen = v.value === view
                    return (
                      <Button
                        key={v.value}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        className={buttonClasses}
                        onClick={() => choose(v.value)}
                      >
                        {v.button}
                      </Button>
                    )
                  })}
                </div>
                <p className="font-mono text-label text-muted-foreground uppercase">
                  AFTER 14 OF 22 MATCHES
                </p>
              </div>
              <p role="status" className="sr-only">
                {announcement}
              </p>
            </div>

            {/* Table and side column */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-9">
                <table className="w-full border-collapse text-body">
                  <caption className="sr-only">{current.caption}</caption>
                  <thead className="bg-navy text-navy-foreground">
                    <tr>
                      <th
                        scope="col"
                        className={cn(headCell, "pr-2 pl-5 text-left")}
                      >
                        <abbr title="Position" className="no-underline">
                          POS
                        </abbr>
                      </th>
                      <th scope="col" className={cn(headCell, "px-2 text-left")}>
                        CLUB
                      </th>
                      <th scope="col" className={cn(headCell, "px-2 text-right")}>
                        <abbr title="Played" className="no-underline">
                          P
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, mdOnly, "px-2 text-right")}
                      >
                        <abbr title="Won" className="no-underline">
                          W
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, mdOnly, "px-2 text-right")}
                      >
                        <abbr title="Drawn" className="no-underline">
                          D
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, mdOnly, "px-2 text-right")}
                      >
                        <abbr title="Lost" className="no-underline">
                          L
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, mdOnly, "px-2 text-right")}
                      >
                        <abbr title="Goals for" className="no-underline">
                          GF
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, mdOnly, "px-2 text-right")}
                      >
                        <abbr title="Goals against" className="no-underline">
                          GA
                        </abbr>
                      </th>
                      <th scope="col" className={cn(headCell, "px-2 text-right")}>
                        <abbr title="Goal difference" className="no-underline">
                          GD
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "pr-5 pl-2 text-right")}
                      >
                        <abbr title="Points" className="no-underline">
                          PTS
                        </abbr>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isOwn = row.name === OWN_CLUB
                      return (
                        <tr
                          key={row.name}
                          className={cn(
                            "border-t border-border",
                            isOwn && "bg-ice text-ice-foreground"
                          )}
                        >
                          <td className="py-3 pr-2 pl-5 text-left font-heading text-h2 tabular-nums">
                            {i + 1}
                          </td>
                          <th
                            scope="row"
                            className="px-2 py-3 text-left font-normal"
                          >
                            <div className="flex flex-col gap-1">
                              <span className={cn(isOwn && "font-bold")}>
                                {row.name}
                                {isOwn && (
                                  <span className="sr-only"> (this club)</span>
                                )}
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-label uppercase md:hidden",
                                  !isOwn && "text-muted-foreground"
                                )}
                              >
                                W{row.won} D{row.drawn} L{row.lost} ·{" "}
                                {row.goalsFor}–{row.goalsAgainst}
                              </span>
                            </div>
                          </th>
                          <td className="px-2 py-3 text-right tabular-nums">
                            {row.played}
                          </td>
                          <td
                            className={cn(
                              "px-2 py-3 text-right tabular-nums",
                              mdOnly
                            )}
                          >
                            {row.won}
                          </td>
                          <td
                            className={cn(
                              "px-2 py-3 text-right tabular-nums",
                              mdOnly
                            )}
                          >
                            {row.drawn}
                          </td>
                          <td
                            className={cn(
                              "px-2 py-3 text-right tabular-nums",
                              mdOnly
                            )}
                          >
                            {row.lost}
                          </td>
                          <td
                            className={cn(
                              "px-2 py-3 text-right tabular-nums",
                              mdOnly
                            )}
                          >
                            {row.goalsFor}
                          </td>
                          <td
                            className={cn(
                              "px-2 py-3 text-right tabular-nums",
                              mdOnly
                            )}
                          >
                            {row.goalsAgainst}
                          </td>
                          <td className="px-2 py-3 text-right tabular-nums">
                            {signed(row.goalDifference)}
                          </td>
                          <td className="py-3 pr-5 pl-2 text-right font-bold tabular-nums">
                            {row.points}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="border-t border-border px-5 py-3">
                  <p className="text-label text-muted-foreground">
                    Clubs level on points are split by goal difference, then by
                    goals scored. The champions go up to the Premier Division
                    and the bottom two go down.
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-5 lg:col-span-3">
                <section
                  aria-labelledby="own-place-heading"
                  className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
                >
                  <h2 id="own-place-heading" className="text-h2 uppercase">
                    Wendmoor FC
                  </h2>
                  <p className="font-mono text-label uppercase">
                    {current.label}
                  </p>
                  <p className="font-heading text-h1 tabular-nums">
                    {ordinal(ownPosition).toUpperCase()}
                  </p>
                  <dl className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-label uppercase">Points</dt>
                      <dd className="text-right text-body tabular-nums">
                        {own.points}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-label uppercase">Played</dt>
                      <dd className="text-right text-body tabular-nums">
                        {own.played}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-label uppercase">
                        Goal difference
                      </dt>
                      <dd className="text-right text-body tabular-nums">
                        {signed(own.goalDifference)}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-body">{gapToTop(rows)}</p>
                </section>

                <section
                  aria-labelledby="key-heading"
                  className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                >
                  <h2 id="key-heading" className="text-h2 uppercase">
                    Key
                  </h2>
                  <dl>
                    {KEY.map(([term, meaning], i) => (
                      <div
                        key={term}
                        className={cn(
                          "flex items-baseline justify-between gap-3 py-2",
                          i > 0 && "border-t border-border"
                        )}
                      >
                        <dt className="font-mono text-label text-foreground uppercase">
                          {term}
                        </dt>
                        <dd className="text-right text-body">{meaning}</dd>
                      </div>
                    ))}
                  </dl>
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
