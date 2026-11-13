import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusOnBand =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"

const container = "mx-auto w-full max-w-[1240px] px-5"

const labelLink = cn(
  "font-mono text-label text-foreground uppercase underline underline-offset-4 hover:decoration-2",
  focus
)
const bandLink = cn(
  "font-mono text-label uppercase underline underline-offset-4 hover:decoration-2",
  focusOnBand
)

const navLinks = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const news = [
  {
    date: "SAT 5 JUN",
    dateTime: "2027-06-05",
    title: "Achebe double sinks Otterby",
    href: "/report",
    text: "Two goals from Tobin Achebe and a Brandvold penalty made it three league wins in a row at Millrace Park.",
  },
  {
    date: "THU 3 JUN",
    dateTime: "2027-06-03",
    title: "New floodlights switched on",
    href: "#",
    text: "The four new masts were lit for the first time at Thursday training, in time for the reserves' evening matches.",
  },
  {
    date: "SUN 30 MAY",
    dateTime: "2027-05-30",
    title: "Under 18s reach the cup final",
    href: "#",
    text: "A 2–1 win at Pellow Green puts the under 18s in the County Youth Cup final on Sunday 27 June.",
  },
  {
    date: "WED 26 MAY",
    dateTime: "2027-05-26",
    title: "Summer coaching week opens",
    href: "#",
    text: "Booking is open for a week of coaching for ages 7 to 14 at Millrace Park, from Monday 2 August.",
  },
]

const standings = [
  { pos: 1, club: "Castlebrook United", played: 14, gd: 14, pts: 29 },
  { pos: 2, club: "Dunmarsh Athletic", played: 14, gd: 12, pts: 27 },
  { pos: 3, club: "Wendmoor FC", played: 14, gd: 11, pts: 27, own: true },
  { pos: 4, club: "Pellow Green", played: 14, gd: 7, pts: 26 },
  { pos: 5, club: "Stenwick Albion", played: 14, gd: 4, pts: 23 },
]

const memberships = [
  {
    name: "Playing",
    price: "£95",
    text: "For adults who want to play. Training twice a week and a place in the first team or reserves squad.",
    link: "Join as a player",
  },
  {
    name: "Junior",
    price: "£45",
    text: "For players under 18. Coaching on Thursdays and matches with the under 18s on Sundays.",
    link: "Join as a junior",
  },
  {
    name: "Social",
    price: "£30",
    text: "For everyone else. Free entry to home league matches and a vote at the annual meeting.",
    link: "Join as a social member",
  },
]

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function Crest({
  letters,
  size,
}: {
  letters: string
  size: "header" | "scoreboard"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground",
        size === "header" ? "size-10" : "size-12"
      )}
    >
      {letters}
    </span>
  )
}

function SectionHead({
  id,
  title,
  linkLabel,
  href,
}: {
  id: string
  title: string
  linkLabel: string
  href: string
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 id={id} className="text-h2 uppercase">
        {title}
      </h2>
      <a href={href} className={labelLink}>
        {linkLabel}
      </a>
    </div>
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
          className={cn("group inline-flex items-center gap-3", focusOnBand)}
        >
          <Crest letters="W" size="header" />
          <span className="font-heading text-h2 uppercase underline-offset-4 group-hover:underline">
            Wendmoor FC
          </span>
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                    focusOnBand
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
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
        <p className="font-mono text-label text-muted-foreground uppercase">
          Kestrel Valley League · Division One
        </p>
        <h1 className="text-h1 uppercase">Wendmoor Football Club</h1>
        <p className="max-w-2xl text-body">
          Saturday football at Millrace Park since 1921. Three teams, 140
          members, and room for one more.
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

function Scoreboard() {
  return (
    <section
      aria-labelledby="scoreboard-heading"
      className="rounded-xl border border-border bg-navy p-5 text-navy-foreground md:p-8"
    >
      <h2 id="scoreboard-heading" className="sr-only">
        Last result and next match
      </h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-mono text-label text-ice uppercase">
              Last result
            </h3>
            <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
              Final
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-8">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <Crest letters="W" size="scoreboard" />
              <p className="font-heading text-body font-bold uppercase md:text-h2">
                Wendmoor FC
              </p>
            </div>
            <p className="shrink-0 font-heading text-h1 tabular-nums md:text-display">
              3–1
            </p>
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <Crest letters="OT" size="scoreboard" />
              <p className="font-heading text-body font-bold uppercase md:text-h2">
                Otterby Town
              </p>
            </div>
          </div>
          <p className="text-center font-mono text-label text-ice uppercase">
            <time dateTime="2027-06-05">Sat 5 Jun</time> · Millrace Park ·
            Attendance 212
          </p>
          <a href="/report" className={cn("self-center", bandLink)}>
            Match report
          </a>
        </div>
        <div className="flex min-w-0 flex-col gap-5 border-t border-ice pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <h3 className="font-mono text-label text-ice uppercase">
            Next match
          </h3>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-h1 tabular-nums md:text-display">
              <time dateTime="2027-06-12T15:00">15:00</time>
            </p>
            <p className="font-mono text-label text-ice uppercase">
              <time dateTime="2027-06-12">Sat 12 Jun</time> · Castle Meadow ·
              Away
            </p>
          </div>
          <p className="font-heading text-h2 uppercase">
            Castlebrook United v Wendmoor FC
          </p>
          <p className="max-w-2xl text-body">
            First against third. A win takes Wendmoor above the leaders with
            seven matches left.
          </p>
          <a href="/fixtures" className={cn("self-start", bandLink)}>
            All fixtures
          </a>
        </div>
      </div>
    </section>
  )
}

function LatestNews() {
  return (
    <section
      aria-labelledby="news-heading"
      className="flex min-w-0 flex-col gap-5 lg:col-span-7"
    >
      <SectionHead
        id="news-heading"
        title="Latest news"
        linkLabel="All news"
        href="#"
      />
      <ul className="overflow-hidden rounded-xl border border-border bg-card">
        {news.map((item, i) => (
          <li
            key={item.title}
            className={cn("px-5 py-3", i > 0 && "border-t border-border")}
          >
            <article className="flex flex-col gap-1">
              <time
                dateTime={item.dateTime}
                className="font-mono text-label text-muted-foreground uppercase"
              >
                {item.date}
              </time>
              <h3 className="text-h2 uppercase">
                <a
                  href={item.href}
                  className={cn(
                    "text-foreground decoration-2 underline-offset-4 hover:underline",
                    focus
                  )}
                >
                  {item.title}
                </a>
              </h3>
              <p className="max-w-2xl text-body">{item.text}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

function LeagueTable() {
  const headCell = "py-3 font-mono text-label text-ice uppercase"
  return (
    <section
      aria-labelledby="table-heading"
      className="flex min-w-0 flex-col gap-5 lg:col-span-5"
    >
      <SectionHead
        id="table-heading"
        title="Division One"
        linkLabel="Full table"
        href="/standings"
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-body">
          <caption className="sr-only">
            Kestrel Valley League, Division One: the top five clubs after 14
            of 22 matches.
          </caption>
          <thead className="bg-navy text-navy-foreground">
            <tr>
              <th scope="col" className={cn(headCell, "pr-2 pl-5 text-left")}>
                <abbr title="Position" className="no-underline">
                  Pos
                </abbr>
              </th>
              <th scope="col" className={cn(headCell, "px-2 text-left")}>
                Club
              </th>
              <th scope="col" className={cn(headCell, "px-2 text-right")}>
                <abbr title="Played" className="no-underline">
                  P
                </abbr>
              </th>
              <th scope="col" className={cn(headCell, "px-2 text-right")}>
                <abbr title="Goal difference" className="no-underline">
                  GD
                </abbr>
              </th>
              <th scope="col" className={cn(headCell, "pr-5 pl-2 text-right")}>
                <abbr title="Points" className="no-underline">
                  Pts
                </abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr
                key={row.club}
                className={cn(
                  "border-t border-border",
                  row.own && "bg-ice text-ice-foreground"
                )}
              >
                <td className="py-3 pr-2 pl-5 text-left font-heading text-h2 tabular-nums">
                  {row.pos}
                </td>
                <th
                  scope="row"
                  className={cn(
                    "px-2 py-3 text-left",
                    row.own ? "font-bold" : "font-normal"
                  )}
                >
                  {row.club}
                  {row.own && <span className="sr-only"> (this club)</span>}
                </th>
                <td className="px-2 py-3 text-right tabular-nums">
                  {row.played}
                </td>
                <td className="px-2 py-3 text-right tabular-nums">
                  {signed(row.gd)}
                </td>
                <td className="py-3 pr-5 pl-2 text-right font-bold tabular-nums">
                  {row.pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border px-5 py-3">
          <p className="text-label text-muted-foreground">
            After 14 of 22 matches. Clubs level on points are split by goal
            difference.
          </p>
        </div>
      </div>
    </section>
  )
}

function Memberships() {
  return (
    <section aria-labelledby="membership-heading" className="flex flex-col gap-5">
      <SectionHead
        id="membership-heading"
        title="Three ways to join"
        linkLabel="How membership works"
        href="/membership"
      />
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {memberships.map((m) => (
          <li
            key={m.name}
            className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-4"
          >
            <h3 className="font-heading text-body font-bold uppercase">
              {m.name}
            </h3>
            <div className="flex flex-col gap-1">
              <p className="font-heading text-h1 tabular-nums">{m.price}</p>
              <p className="font-mono text-label text-muted-foreground uppercase">
                A season
              </p>
            </div>
            <p className="max-w-2xl text-body">{m.text}</p>
            <a href="/membership" className={cn("self-start", labelLink)}>
              {m.link}
            </a>
          </li>
        ))}
      </ul>
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
                <a href={link.href} className={labelLink}>
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
            <LatestNews />
            <LeagueTable />
          </div>
          <Memberships />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
