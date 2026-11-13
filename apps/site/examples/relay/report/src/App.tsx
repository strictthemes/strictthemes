import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const bandFocus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"
const container = "mx-auto w-full max-w-[1240px] px-5"
const label = "font-mono text-label uppercase"
const mutedLabel = "font-mono text-label uppercase text-muted-foreground"
const textLink =
  "text-foreground underline underline-offset-4 hover:decoration-2"
const card = "rounded-xl border border-border bg-card"
const rowsCard = "overflow-hidden rounded-xl border border-border bg-card"

const navLinks = [
  { name: "Fixtures", href: "/fixtures" },
  { name: "Table", href: "/standings" },
  { name: "Report", href: "/report" },
  { name: "Membership", href: "/membership" },
]
const currentPage = "/report"

const home = { name: "Wendmoor FC", crest: "W" }
const away = { name: "Otterby Town", crest: "OT" }

const scorers = {
  home: ["Achebe 23', 84'", "Brandvold 58' (pen)"],
  away: ["Penhale 41'"],
}

type TimelineRow = {
  minute: string
  what: string
  how?: string
  score?: string
}

const timeline: TimelineRow[] = [
  {
    minute: "23'",
    what: "Goal · Wendmoor FC",
    how: "Tobin Achebe, a low shot from Finn Marlowe’s pass.",
    score: "1–0",
  },
  {
    minute: "36'",
    what: "Yellow card · Otterby Town",
    how: "Dominic Ferreby, for a late tackle on Idris Farrow.",
  },
  {
    minute: "41'",
    what: "Goal · Otterby Town",
    how: "Lars Penhale, a header from Patrick Lowther’s corner.",
    score: "1–1",
  },
  { minute: "45'", what: "Half-time", score: "1–1" },
  {
    minute: "57'",
    what: "Yellow card · Otterby Town",
    how: "Rhys Underhill, for a trip on Lewis Oyelaran in the area.",
  },
  {
    minute: "58'",
    what: "Goal · Wendmoor FC",
    how: "Matteo Brandvold, from the penalty.",
    score: "2–1",
  },
  {
    minute: "71'",
    what: "Yellow card · Wendmoor FC",
    how: "Samir Kettle, for a shirt pull.",
  },
  {
    minute: "84'",
    what: "Goal · Wendmoor FC",
    how: "Tobin Achebe, a header from Dara Whitlock’s cross.",
    score: "3–1",
  },
  { minute: "90'", what: "Full time", score: "3–1" },
]

const report = [
  "Tobin Achebe scored twice as Wendmoor FC beat Otterby Town 3–1 at Millrace Park on Saturday, their third league win in a row and their sixth in seven home matches.",
  "It was a result with some weight behind it. Otterby won 3–0 when the sides met at Weir Lane in March, and for an hour here they looked ready to make trouble again. Achebe put Wendmoor ahead in the 23rd minute, running on to Finn Marlowe’s pass and finishing low past Owen Hartigan, but the visitors were level before the break when their captain, Lars Penhale, headed in Patrick Lowther’s corner.",
  "The match turned just before the hour. Rhys Underhill tripped Lewis Oyelaran as he cut into the area and was booked for it, and Matteo Brandvold sent the penalty high to the keeper’s left. Otterby pushed on and left room behind them; Jonah Pryce had one save to make, from Connor Maddern, and made it well.",
  "The third goal came from the bench. Dara Whitlock, on for Idris Farrow, crossed from the right in the 84th minute and Achebe rose at the far post to head his eleventh league goal of the season.",
  "“We owed them one,” said the manager, Dev Halloran. “We were patient while it was level, and the penalty opened the game up.” Wendmoor stay third on 27 points, two behind Castlebrook United, where they play next Saturday.",
]

type Starter = { number: string; name: string; note?: string }
type Lineup = {
  id: string
  club: string
  crest: string
  formation: string
  starters: Starter[]
  substitutes: string
  manager: string
}

const lineups: Lineup[] = [
  {
    id: "lineup-home",
    club: "Wendmoor FC",
    crest: "W",
    formation: "4-4-2",
    starters: [
      { number: "1", name: "Jonah Pryce" },
      { number: "2", name: "Callum Okafor" },
      { number: "5", name: "Ruben Stannard", note: "Captain" },
      { number: "6", name: "Tomasz Wren" },
      { number: "3", name: "Kieran Dossou" },
      { number: "7", name: "Idris Farrow", note: "Off 66'" },
      { number: "4", name: "Matteo Brandvold", note: "Goal 58' (pen)" },
      { number: "8", name: "Samir Kettle", note: "Yellow card 71'" },
      { number: "11", name: "Lewis Oyelaran" },
      { number: "9", name: "Tobin Achebe", note: "Goals 23', 84'" },
      { number: "10", name: "Finn Marlowe", note: "Off 78'" },
    ],
    substitutes:
      "14 Dara Whitlock (on 66' for Farrow), 16 Niall Sorensen (on 78' for Marlowe). Not used: 12 Aaron Petty, 15 Joe Tindall, 13 Milan Reyes.",
    manager: "Dev Halloran",
  },
  {
    id: "lineup-away",
    club: "Otterby Town",
    crest: "OT",
    formation: "4-5-1",
    starters: [
      { number: "1", name: "Owen Hartigan" },
      { number: "2", name: "Marcus Bele" },
      { number: "5", name: "Lars Penhale", note: "Captain · Goal 41'" },
      { number: "4", name: "Dominic Ferreby", note: "Yellow card 36'" },
      { number: "3", name: "Ashley Quaye" },
      { number: "8", name: "Rhys Underhill", note: "Yellow card 57'" },
      { number: "6", name: "Jude Amankwah" },
      { number: "10", name: "Patrick Lowther" },
      { number: "7", name: "Theo Vasik", note: "Off 62'" },
      { number: "11", name: "Connor Maddern" },
      { number: "9", name: "Elias Thornbury", note: "Off 75'" },
    ],
    substitutes:
      "14 Ben Iredale (on 62' for Vasik), 15 Hal Sweeting (on 75' for Thornbury). Not used: 12 Luca Dray, 16 Nico Abara, 13 Sid Carver.",
    manager: "Graham Tull",
  },
]

type Figure = {
  name: string
  home: number
  away: number
  percent?: boolean
}

const figures: Figure[] = [
  { name: "Possession", home: 56, away: 44, percent: true },
  { name: "Shots", home: 14, away: 9 },
  { name: "Shots on target", home: 7, away: 3 },
  { name: "Corners", home: 6, away: 4 },
  { name: "Fouls", home: 9, away: 13 },
]

// A possession bar is as wide as its percent; any other bar is its share of
// the larger of the two figures.
function barWidth(figure: Figure, value: number) {
  if (figure.percent) return value
  const larger = Math.max(figure.home, figure.away)
  return larger === 0 ? 0 : (value / larger) * 100
}

function Crest({
  letters,
  size,
}: {
  letters: string
  size: "row" | "header" | "scoreboard"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ice text-ice-foreground",
        size === "row" && "size-8 font-mono text-label",
        size === "header" && "size-10 font-heading text-body font-extrabold",
        size === "scoreboard" && "size-12 font-heading text-body font-extrabold"
      )}
    >
      {letters}
    </span>
  )
}

function Header() {
  return (
    <header className="border-b border-border bg-navy text-navy-foreground">
      <div
        className={cn(
          container,
          "flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-3"
        )}
      >
        <a
          href="/"
          className={cn("group inline-flex items-center gap-3", bandFocus)}
        >
          <Crest letters="W" size="header" />
          <span className="font-heading text-h2 uppercase underline-offset-4 group-hover:underline">
            Wendmoor FC
          </span>
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5">
            {navLinks.map((link) => {
              const current = link.href === currentPage
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
                    {link.name}
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

function PageHead() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="flex flex-col gap-3">
        <p className={mutedLabel}>Match report · Division One</p>
        <h1 className="text-h1 uppercase">Achebe double sinks Otterby</h1>
        <p className="max-w-2xl text-body">
          Wendmoor FC were level at half-time and won 3–1 at Millrace Park,
          their third league win in a row.
        </p>
        <p className={cn(mutedLabel, "tabular-nums")}>
          By Nadia Ferris · <time dateTime="2027-06-05">Sat 5 Jun 2027</time>
        </p>
      </div>
      <a
        href="/membership"
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-auto px-5 py-2 font-mono text-label uppercase"
        )}
      >
        Join the club
      </a>
    </div>
  )
}

function ScoreSide({
  club,
  lines,
}: {
  club: { name: string; crest: string }
  lines: string[]
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <Crest letters={club.crest} size="scoreboard" />
      <p className="w-full font-heading text-body font-bold wrap-break-word uppercase md:text-h2">
        {club.name}
      </p>
      <ul className="flex flex-col gap-1">
        {lines.map((line) => (
          <li key={line} className={cn(label, "text-ice tabular-nums")}>
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Scoreboard() {
  return (
    <section
      aria-labelledby="final-score"
      className="flex flex-col gap-5 rounded-xl border border-border bg-navy p-5 text-navy-foreground md:p-8"
    >
      <h2 id="final-score" className="sr-only">
        Final score
      </h2>
      <div className="flex items-center justify-between gap-3">
        <p className={cn(label, "text-ice")}>
          Kestrel Valley League · Division One
        </p>
        <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
          Final
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 md:gap-8">
        <ScoreSide club={home} lines={scorers.home} />
        <p className="shrink-0 font-heading text-h1 tabular-nums md:text-display">
          3–1
        </p>
        <ScoreSide club={away} lines={scorers.away} />
      </div>
      <div className="flex flex-col gap-1">
        <p className={cn(label, "text-center text-ice tabular-nums")}>
          <time dateTime="2027-06-05">Sat 5 Jun 2027</time> · 15:00 · Millrace
          Park
        </p>
        <p className={cn(label, "text-center text-ice tabular-nums")}>
          Half-time 1–1 · Attendance 212
        </p>
      </div>
    </section>
  )
}

function Report() {
  return (
    <article
      aria-labelledby="report"
      className="flex min-w-0 flex-col gap-3 lg:col-span-7"
    >
      <h2 id="report" className="text-h2 uppercase">
        Report
      </h2>
      {report.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="max-w-2xl text-body">
          {paragraph}
        </p>
      ))}
      <a href="/fixtures" className={cn("self-start", textLink, focus)}>
        All fixtures and results
      </a>
    </article>
  )
}

function Timeline() {
  return (
    <section
      aria-labelledby="timeline"
      className={cn(rowsCard, "min-w-0 lg:col-span-5")}
    >
      <h2 id="timeline" className="px-5 py-3 text-h2 uppercase">
        Timeline
      </h2>
      <ol role="list">
        {timeline.map((row) => (
          <li
            key={`${row.minute}-${row.what}`}
            className="flex items-baseline gap-3 border-t border-border px-5 py-3"
          >
            <span className="w-12 shrink-0 font-heading text-h2 tabular-nums">
              {row.minute}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={mutedLabel}>{row.what}</p>
              {row.how && <p className="text-body">{row.how}</p>}
            </div>
            {row.score && (
              <span className="shrink-0 font-heading text-h2 tabular-nums">
                {row.score}
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

function LineupCard({ lineup }: { lineup: Lineup }) {
  return (
    <div className={cn(rowsCard, "min-w-0 lg:col-span-6")}>
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3">
          <Crest letters={lineup.crest} size="row" />
          <h3 className="font-heading text-body font-bold uppercase">
            {lineup.club}
          </h3>
        </div>
        <p className={cn(mutedLabel, "tabular-nums")}>{lineup.formation}</p>
      </div>
      <ol role="list">
        {lineup.starters.map((player) => (
          <li
            key={player.number}
            className="flex items-baseline gap-3 border-t border-border px-5 py-2"
          >
            <span className={cn(mutedLabel, "w-5 shrink-0 tabular-nums")}>
              {player.number}
            </span>
            <span className="min-w-0 flex-1 text-body">{player.name}</span>
            {player.note && (
              <span className={cn(mutedLabel, "text-right tabular-nums")}>
                {player.note}
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-1 border-t border-border px-5 py-3">
        <p className={mutedLabel}>Substitutes</p>
        <p className="text-body">{lineup.substitutes}</p>
      </div>
      <div className="flex items-baseline justify-between gap-3 border-t border-border px-5 py-3">
        <p className={mutedLabel}>Manager</p>
        <p className="text-body">{lineup.manager}</p>
      </div>
    </div>
  )
}

function Lineups() {
  return (
    <section aria-labelledby="lineups" className="flex flex-col gap-5">
      <h2 id="lineups" className="text-h2 uppercase">
        Line-ups
      </h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {lineups.map((lineup) => (
          <LineupCard key={lineup.id} lineup={lineup} />
        ))}
      </div>
    </section>
  )
}

function FigureBar({
  figure,
  club,
  value,
  fill,
}: {
  figure: Figure
  club: string
  value: number
  fill: string
}) {
  return (
    <dd className="flex items-center gap-3">
      <span className={cn(mutedLabel, "w-28 shrink-0")}>{club}</span>
      <div className="min-w-0 flex-1">
        <div
          aria-hidden="true"
          className={cn("h-3 rounded-sm", fill)}
          style={{ width: `${barWidth(figure, value)}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right font-heading text-h2 tabular-nums">
        {figure.percent ? `${value}%` : value}
      </span>
    </dd>
  )
}

function MatchFigures() {
  return (
    <section aria-labelledby="match-figures" className="flex flex-col gap-5">
      <h2 id="match-figures" className="text-h2 uppercase">
        Match figures
      </h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div
          className={cn(card, "flex min-w-0 flex-col gap-5 p-5 lg:col-span-8")}
        >
          <dl className="flex flex-col gap-5">
            {figures.map((figure) => (
              <div key={figure.name} className="flex flex-col gap-2">
                <dt className={mutedLabel}>{figure.name}</dt>
                <FigureBar
                  figure={figure}
                  club={home.name}
                  value={figure.home}
                  fill="bg-secondary"
                />
                <FigureBar
                  figure={figure}
                  club={away.name}
                  value={figure.away}
                  fill="bg-muted-foreground"
                />
              </div>
            ))}
          </dl>
          <p className="text-label text-muted-foreground">
            Figures were recorded by the club. Referee: M. Garside.
          </p>
        </div>
        <aside
          aria-labelledby="next-match"
          className="flex min-w-0 flex-col gap-5 rounded-xl bg-ice p-5 text-ice-foreground lg:col-span-4"
        >
          <h2 id="next-match" className="text-h2 uppercase">
            Next match
          </h2>
          <div className="flex flex-col gap-1">
            <time
              dateTime="2027-06-12T15:00"
              className="font-heading text-h1 tabular-nums"
            >
              15:00
            </time>
            <p className={cn(label, "tabular-nums")}>
              <time dateTime="2027-06-12">Sat 12 Jun</time> · Castle Meadow ·
              Away
            </p>
          </div>
          <p className="font-heading text-body font-bold uppercase">
            Castlebrook United v Wendmoor FC
          </p>
          <p className="max-w-2xl text-body">
            First against third. A win takes Wendmoor above the leaders with
            seven matches left.
          </p>
        </aside>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2 uppercase">Wendmoor FC</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={cn(label, textLink, focus)}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(mutedLabel, "tabular-nums")}>
          © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
          nothing is sent or stored
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <Header />
      <main className="flex-1">
        <div className={cn(container, "flex flex-col gap-18 pt-8 pb-18")}>
          <div className="flex flex-col gap-8">
            <PageHead />
            <Scoreboard />
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <Report />
            <Timeline />
          </div>
          <Lineups />
          <MatchFigures />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
