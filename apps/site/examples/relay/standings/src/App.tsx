import { useMemo, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Record = {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

type Club = {
  name: string
  home: Record
  away: Record
}

type View = "all" | "home" | "away"

type Row = Record & {
  name: string
  goalDifference: number
  points: number
}

const OWN_CLUB = "Wendmoor FC"

function record(
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number
): Record {
  return { played, won, drawn, lost, goalsFor, goalsAgainst }
}

// Kestrel Valley League, Division One, after 14 of 22 matches.
const CLUBS: Club[] = [
  {
    name: "Castlebrook United",
    home: record(6, 4, 1, 1, 12, 6),
    away: record(8, 5, 1, 2, 22, 14),
  },
  {
    name: "Dunmarsh Athletic",
    home: record(7, 5, 2, 0, 15, 4),
    away: record(7, 2, 4, 1, 15, 14),
  },
  {
    name: "Wendmoor FC",
    home: record(7, 6, 0, 1, 17, 7),
    away: record(7, 2, 3, 2, 13, 12),
  },
  {
    name: "Pellow Green",
    home: record(8, 6, 1, 1, 14, 7),
    away: record(6, 2, 1, 3, 6, 6),
  },
  {
    name: "Stenwick Albion",
    home: record(6, 4, 0, 2, 13, 8),
    away: record(8, 3, 2, 3, 7, 8),
  },
  {
    name: "Lowmere Welfare",
    home: record(8, 5, 1, 2, 12, 8),
    away: record(6, 1, 1, 4, 6, 9),
  },
  {
    name: "Sedgeholme",
    home: record(6, 3, 2, 1, 10, 9),
    away: record(8, 2, 1, 5, 12, 13),
  },
  {
    name: "Otterby Town",
    home: record(6, 3, 2, 1, 9, 5),
    away: record(8, 1, 3, 4, 8, 13),
  },
  {
    name: "Tarrowby United",
    home: record(7, 2, 3, 2, 7, 10),
    away: record(7, 1, 2, 4, 3, 8),
  },
  {
    name: "Kirkfen Rangers",
    home: record(7, 2, 4, 1, 12, 9),
    away: record(7, 0, 2, 5, 7, 14),
  },
  {
    name: "Hollinvale",
    home: record(8, 2, 3, 3, 10, 14),
    away: record(6, 0, 1, 5, 3, 12),
  },
  {
    name: "Eastlow Wanderers",
    home: record(8, 2, 2, 4, 8, 17),
    away: record(6, 0, 0, 6, 2, 16),
  },
]

const VIEWS: { value: View; button: string; label: string; caption: string }[] =
  [
    {
      value: "all",
      button: "All matches",
      label: "All matches",
      caption:
        "Kestrel Valley League, Division One: all matches, after 14 of 22.",
    },
    {
      value: "home",
      button: "Home",
      label: "Home matches",
      caption: "Kestrel Valley League, Division One: home matches only.",
    },
    {
      value: "away",
      button: "Away",
      label: "Away matches",
      caption: "Kestrel Valley League, Division One: away matches only.",
    },
  ]

function recordFor(club: Club, view: View): Record {
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
  if (n % 10 === 1) return `${n}st`
  if (n % 10 === 2) return `${n}nd`
  if (n % 10 === 3) return `${n}rd`
  return `${n}th`
}

function points(n: number) {
  return `${n} ${n === 1 ? "point" : "points"}`
}

const bandFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"

const pageFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const buttonClasses = "h-auto px-5 py-2 font-mono text-label uppercase"

const NAV_LINKS = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const KEY = [
  { short: "P", meaning: "Played" },
  { short: "W", meaning: "Won" },
  { short: "D", meaning: "Drawn" },
  { short: "L", meaning: "Lost" },
  { short: "GF", meaning: "Goals for" },
  { short: "GA", meaning: "Goals against" },
  { short: "GD", meaning: "Goal difference" },
  { short: "Pts", meaning: "Points" },
]

const headCell = "px-2 py-3 font-mono text-label uppercase text-ice"
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
            {NAV_LINKS.map((link) => {
              const current = link.href === "/standings"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                      current && "underline decoration-2",
                      bandFocus
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
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "font-mono text-label text-foreground uppercase underline underline-offset-4 hover:decoration-2",
                    pageFocus
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

export function App() {
  const [view, setView] = useState<View>("all")
  const [status, setStatus] = useState("")

  const rows = useMemo(() => standings(view), [view])
  const current = VIEWS.find((v) => v.value === view)!
  const ownIndex = rows.findIndex((r) => r.name === OWN_CLUB)
  const own = rows[ownIndex]
  const position = ownIndex + 1
  const top = rows[0]

  let gap: string
  if (ownIndex === 0) {
    gap = "Top of the table."
  } else if (top.points === own.points) {
    gap = `Level on points with ${top.name}.`
  } else {
    gap = `${points(top.points - own.points)} behind ${top.name}.`
  }

  function choose(next: View) {
    if (next === view) return
    const nextRows = standings(next)
    const nextIndex = nextRows.findIndex((r) => r.name === OWN_CLUB)
    const label = VIEWS.find((v) => v.value === next)!.label
    setView(next)
    setStatus(
      `${label}: ${OWN_CLUB} are ${ordinal(nextIndex + 1)} with ${points(nextRows[nextIndex].points)}.`
    )
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
                  Kestrel Valley League · 2027 season
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
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                After 14 of 22 matches
              </p>
            </div>
            <p role="status" className="sr-only">
              {status}
            </p>

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
                          Pos
                        </abbr>
                      </th>
                      <th scope="col" className={cn(headCell, "text-left")}>
                        Club
                      </th>
                      <th scope="col" className={cn(headCell, "text-right")}>
                        <abbr title="Played" className="no-underline">
                          P
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "text-right", mdOnly)}
                      >
                        <abbr title="Won" className="no-underline">
                          W
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "text-right", mdOnly)}
                      >
                        <abbr title="Drawn" className="no-underline">
                          D
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "text-right", mdOnly)}
                      >
                        <abbr title="Lost" className="no-underline">
                          L
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "text-right", mdOnly)}
                      >
                        <abbr title="Goals for" className="no-underline">
                          GF
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "text-right", mdOnly)}
                      >
                        <abbr title="Goals against" className="no-underline">
                          GA
                        </abbr>
                      </th>
                      <th scope="col" className={cn(headCell, "text-right")}>
                        <abbr title="Goal difference" className="no-underline">
                          GD
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className={cn(headCell, "pr-5 pl-2 text-right")}
                      >
                        <abbr title="Points" className="no-underline">
                          Pts
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
                            className={cn(
                              "px-2 py-3 text-left",
                              isOwn ? "font-bold" : "font-normal"
                            )}
                          >
                            <span className="flex flex-col gap-1">
                              <span>
                                {row.name}
                                {isOwn && (
                                  <span className="sr-only"> (this club)</span>
                                )}
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-label uppercase tabular-nums md:hidden",
                                  !isOwn && "text-muted-foreground"
                                )}
                              >
                                W{row.won} D{row.drawn} L{row.lost} ·{" "}
                                {row.goalsFor}–{row.goalsAgainst}
                              </span>
                            </span>
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
                  aria-labelledby="place-heading"
                  className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
                >
                  <h2 id="place-heading" className="text-h2 uppercase">
                    Wendmoor FC
                  </h2>
                  <p className="font-mono text-label uppercase">
                    {current.label}
                  </p>
                  <p className="font-heading text-h1 uppercase tabular-nums">
                    {ordinal(position)}
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
                  <p className="text-body">{gap}</p>
                </section>

                <section
                  aria-labelledby="key-heading"
                  className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                >
                  <h2 id="key-heading" className="text-h2 uppercase">
                    Key
                  </h2>
                  <dl>
                    {KEY.map((item, i) => (
                      <div
                        key={item.short}
                        className={cn(
                          "flex items-baseline justify-between gap-3 py-2",
                          i > 0 && "border-t border-border"
                        )}
                      >
                        <dt className="font-mono text-label text-foreground uppercase">
                          {item.short}
                        </dt>
                        <dd className="text-right text-body">{item.meaning}</dd>
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
