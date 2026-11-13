import { useMemo, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  CLUBS,
  OWN_CLUB,
  buildTable,
  gapToTop,
  ordinal,
  signed,
  type View,
} from "@/lib/standings"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const VIEWS: { value: View; label: string }[] = [
  { value: "all", label: "All matches" },
  { value: "home", label: "Home" },
  { value: "away", label: "Away" },
]

const CAPTIONS: Record<View, string> = {
  all: "Kestrel Valley League, Division One: all matches, after 14 of 22.",
  home: "Kestrel Valley League, Division One: home matches only.",
  away: "Kestrel Valley League, Division One: away matches only.",
}

const VIEW_LABELS: Record<View, string> = {
  all: "All matches",
  home: "Home matches",
  away: "Away matches",
}

const KEY = [
  { short: "P", meaning: "Played" },
  { short: "W", meaning: "Won" },
  { short: "D", meaning: "Drawn" },
  { short: "L", meaning: "Lost" },
  { short: "GF", meaning: "Goals for" },
  { short: "GA", meaning: "Goals against" },
  { short: "GD", meaning: "Goal difference" },
  { short: "PTS", meaning: "Points" },
]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusBand =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const buttonClasses = "h-auto px-5 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const labelLink = cn(
  label,
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-3 underline-offset-4 transition-colors duration-150 hover:underline",
            focusBand
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
              const current = item.href === "/standings"
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 transition-colors duration-150 hover:underline",
                      current && "underline decoration-2",
                      focusBand
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
                <a href={item.href} className={labelLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

type Column = {
  short: string
  title?: string
  align: "left" | "right"
  wide?: boolean
}

const COLUMNS: Column[] = [
  { short: "POS", title: "Position", align: "left" },
  { short: "CLUB", align: "left" },
  { short: "P", title: "Played", align: "right" },
  { short: "W", title: "Won", align: "right", wide: true },
  { short: "D", title: "Drawn", align: "right", wide: true },
  { short: "L", title: "Lost", align: "right", wide: true },
  { short: "GF", title: "Goals for", align: "right", wide: true },
  { short: "GA", title: "Goals against", align: "right", wide: true },
  { short: "GD", title: "Goal difference", align: "right" },
  { short: "PTS", title: "Points", align: "right" },
]

export function App() {
  const [view, setView] = useState<View>("all")
  const [announcement, setAnnouncement] = useState("")

  const table = useMemo(() => buildTable(CLUBS, view), [view])
  const own = table.find((row) => row.name === OWN_CLUB)!

  function choose(next: View) {
    if (next === view) return
    const nextTable = buildTable(CLUBS, next)
    const nextOwn = nextTable.find((row) => row.name === OWN_CLUB)!
    setView(next)
    setAnnouncement(
      `${VIEW_LABELS[next]}: ${OWN_CLUB} are ${ordinal(nextOwn.position)} with ${nextOwn.points} ${nextOwn.points === 1 ? "point" : "points"}.`
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
                <p className={cn(label, "text-muted-foreground")}>
                  Kestrel Valley League · 2027 season
                </p>
                <h1 className="text-h1 uppercase">Division One table</h1>
              </div>
              <a
                href="/membership"
                className={cn(buttonVariants(), buttonClasses)}
              >
                Join the club
              </a>
            </div>

            {/* Matches control */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Matches counted"
                className="flex flex-wrap gap-2"
              >
                {VIEWS.map((item) => {
                  const chosen = item.value === view
                  return (
                    <Button
                      key={item.value}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      className={buttonClasses}
                      onClick={() => choose(item.value)}
                    >
                      {item.label}
                    </Button>
                  )
                })}
              </div>
              <p className={cn(label, "text-muted-foreground")}>
                After 14 of 22 matches
              </p>
            </div>
            <p role="status" className="sr-only">
              {announcement}
            </p>

            {/* Table and side column */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-9">
                <table className="w-full border-collapse text-body">
                  <caption className="sr-only">{CAPTIONS[view]}</caption>
                  <thead className="bg-navy text-navy-foreground">
                    <tr>
                      {COLUMNS.map((col, index) => (
                        <th
                          key={col.short}
                          scope="col"
                          className={cn(
                            "px-2 py-3 font-mono text-label text-ice uppercase",
                            col.align === "left" ? "text-left" : "text-right",
                            col.wide && "hidden md:table-cell",
                            index === 0 && "pl-5",
                            index === COLUMNS.length - 1 && "pr-5"
                          )}
                        >
                          {col.title ? (
                            <abbr title={col.title} className="no-underline">
                              {col.short}
                            </abbr>
                          ) : (
                            col.short
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row) => {
                      const isOwn = row.name === OWN_CLUB
                      const figure = "px-2 py-3 text-right tabular-nums"
                      const wide = "hidden md:table-cell"
                      return (
                        <tr
                          key={row.name}
                          className={cn(
                            "border-t border-border",
                            isOwn && "bg-ice text-ice-foreground"
                          )}
                        >
                          <td className="px-2 py-3 pl-5 text-left font-heading text-h2 tabular-nums">
                            {row.position}
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
                                  label,
                                  "md:hidden",
                                  !isOwn && "text-muted-foreground"
                                )}
                              >
                                W{row.won} D{row.drawn} L{row.lost} ·{" "}
                                {row.goalsFor}–{row.goalsAgainst}
                              </span>
                            </div>
                          </th>
                          <td className={figure}>{row.played}</td>
                          <td className={cn(figure, wide)}>{row.won}</td>
                          <td className={cn(figure, wide)}>{row.drawn}</td>
                          <td className={cn(figure, wide)}>{row.lost}</td>
                          <td className={cn(figure, wide)}>{row.goalsFor}</td>
                          <td className={cn(figure, wide)}>
                            {row.goalsAgainst}
                          </td>
                          <td className={figure}>
                            {signed(row.goalDifference)}
                          </td>
                          <td className={cn(figure, "pr-5 font-bold")}>
                            {row.points}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <p className="border-t border-border px-5 py-3 text-label text-muted-foreground">
                  Clubs level on points are split by goal difference, then by
                  goals scored. The champions go up to the Premier Division and
                  the bottom two go down.
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-5 lg:col-span-3">
                <section
                  aria-labelledby="place-heading"
                  className="flex flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground"
                >
                  <h2 id="place-heading" className="text-h2 uppercase">
                    Wendmoor FC
                  </h2>
                  <p className={label}>{VIEW_LABELS[view]}</p>
                  <p className="font-heading text-h1 uppercase tabular-nums">
                    {ordinal(own.position)}
                  </p>
                  <dl className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className={label}>Points</dt>
                      <dd className="text-right text-body tabular-nums">
                        {own.points}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className={label}>Played</dt>
                      <dd className="text-right text-body tabular-nums">
                        {own.played}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className={label}>Goal difference</dt>
                      <dd className="text-right text-body tabular-nums">
                        {signed(own.goalDifference)}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-body">{gapToTop(table, own)}</p>
                </section>

                <section
                  aria-labelledby="key-heading"
                  className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5"
                >
                  <h2 id="key-heading" className="text-h2 uppercase">
                    Key
                  </h2>
                  <dl>
                    {KEY.map((item, index) => (
                      <div
                        key={item.short}
                        className={cn(
                          "flex items-baseline justify-between gap-3 py-2",
                          index > 0 && "border-t border-border"
                        )}
                      >
                        <dt className={cn(label, "text-foreground")}>
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
