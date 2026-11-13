import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// The sample's "now": Tuesday 8 June 2027 at 20:05. Nothing on this page
// reads the device clock, and nothing ticks.

const focusPage =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const focusBand =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-foreground"

const labelLink = cn(
  "font-mono text-label uppercase text-foreground underline underline-offset-4 hover:decoration-2",
  focusPage
)
const bandLink = cn(
  "font-mono text-label uppercase underline underline-offset-4 hover:decoration-2",
  focusBand
)

const navLinks = [
  { label: "Fixtures", href: "/fixtures" },
  { label: "Table", href: "/standings" },
  { label: "Report", href: "/report" },
  { label: "Membership", href: "/membership" },
]

const news = [
  {
    date: "2027-06-05",
    dateLabel: "Sat 5 Jun",
    headline: "Achebe double sinks Otterby",
    href: "/report",
    summary:
      "Two goals from Tobin Achebe and a Brandvold penalty made it three league wins in a row at Millrace Park.",
  },
  {
    date: "2027-06-03",
    dateLabel: "Thu 3 Jun",
    headline: "New floodlights switched on",
    href: "#",
    summary:
      "The four new masts were lit for the first time at Thursday training, in time for the reserves’ evening matches.",
  },
  {
    date: "2027-05-30",
    dateLabel: "Sun 30 May",
    headline: "Under 18s reach the cup final",
    href: "#",
    summary:
      "A 2–1 win at Pellow Green puts the under 18s in the County Youth Cup final on Sunday 27 June.",
  },
  {
    date: "2027-05-26",
    dateLabel: "Wed 26 May",
    headline: "Summer coaching week opens",
    href: "#",
    summary:
      "Booking is open for a week of coaching for ages 7 to 14 at Millrace Park, from Monday 2 August.",
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
    summary:
      "For adults who want to play. Training twice a week and a place in the first team or reserves squad.",
    link: "Join as a player",
  },
  {
    name: "Junior",
    price: "£45",
    summary:
      "For players under 18. Coaching on Thursdays and matches with the under 18s on Sundays.",
    link: "Join as a junior",
  },
  {
    name: "Social",
    price: "£30",
    summary:
      "For everyone else. Free entry to home league matches and a vote at the annual meeting.",
    link: "Join as a social member",
  },
]

function signed(n: number) {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return "0"
}

function ScoreboardSide({ name, crest }: { name: string; crest: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ice font-heading text-body font-extrabold text-ice-foreground"
      >
        {crest}
      </span>
      <p className="w-full font-heading text-body font-bold uppercase wrap-break-word md:text-h2">
        {name}
      </p>
    </div>
  )
}

export function App() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
          <a
            href="/"
            className={cn("group inline-flex items-center gap-3", focusBand)}
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "inline-flex h-10 items-center font-mono text-label uppercase underline-offset-4 hover:underline",
                      focusBand
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

      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-18 px-5 pt-8 pb-18">
          <div className="flex flex-col gap-8">
            {/* Page head */}
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-label uppercase text-muted-foreground">
                  Kestrel Valley League · Division One
                </p>
                <h1 className="text-h1 uppercase">Wendmoor Football Club</h1>
                <p className="max-w-2xl text-body">
                  Saturday football at Millrace Park since 1921. Three teams,
                  140 members, and room for one more.
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

            {/* Scoreboard */}
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
                    <h3 className="font-mono text-label uppercase text-ice">
                      Last result
                    </h3>
                    <span className="inline-flex shrink-0 items-center rounded-sm bg-tertiary px-2 py-1 font-mono text-label whitespace-nowrap text-tertiary-foreground uppercase">
                      Final
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 md:gap-8">
                    <ScoreboardSide name="Wendmoor FC" crest="W" />
                    <p className="shrink-0 font-heading text-h1 tabular-nums md:text-display lg:text-h1 xl:text-display">
                      3–1
                    </p>
                    <ScoreboardSide name="Otterby Town" crest="OT" />
                  </div>
                  <p className="text-center font-mono text-label tabular-nums uppercase text-ice">
                    <time dateTime="2027-06-05">Sat 5 Jun</time> · Millrace
                    Park · Attendance 212
                  </p>
                  <a href="/report" className={cn("self-center", bandLink)}>
                    Match report
                  </a>
                </div>

                <div className="flex min-w-0 flex-col gap-5 border-t border-ice pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                  <h3 className="font-mono text-label uppercase text-ice">
                    Next match
                  </h3>
                  <div className="flex flex-col gap-1">
                    <time
                      dateTime="2027-06-12T15:00"
                      className="font-heading text-h1 tabular-nums md:text-display"
                    >
                      15:00
                    </time>
                    <p className="font-mono text-label tabular-nums uppercase text-ice">
                      <time dateTime="2027-06-12">Sat 12 Jun</time> · Castle
                      Meadow · Away
                    </p>
                  </div>
                  <p className="font-heading text-h2 uppercase">
                    Castlebrook United v Wendmoor FC
                  </p>
                  <p className="max-w-2xl text-body">
                    First against third. A win takes Wendmoor above the leaders
                    with seven matches left.
                  </p>
                  <a href="/fixtures" className={cn("self-start", bandLink)}>
                    All fixtures
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* News and table */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <section
              aria-labelledby="news-heading"
              className="flex min-w-0 flex-col gap-5 lg:col-span-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="news-heading" className="text-h2 uppercase">
                  Latest news
                </h2>
                <a href="#" className={labelLink}>
                  All news
                </a>
              </div>
              <ul className="overflow-hidden rounded-xl border border-border bg-card">
                {news.map((item, i) => (
                  <li
                    key={item.headline}
                    className={cn("px-5 py-3", i > 0 && "border-t border-border")}
                  >
                    <article className="flex flex-col gap-1">
                      <time
                        dateTime={item.date}
                        className="font-mono text-label tabular-nums uppercase text-muted-foreground"
                      >
                        {item.dateLabel}
                      </time>
                      <h3 className="text-h2 uppercase">
                        <a
                          href={item.href}
                          className={cn(
                            "text-foreground decoration-2 underline-offset-4 hover:underline",
                            focusPage
                          )}
                        >
                          {item.headline}
                        </a>
                      </h3>
                      <p className="max-w-2xl text-body">{item.summary}</p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="table-heading"
              className="flex min-w-0 flex-col gap-5 lg:col-span-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="table-heading" className="text-h2 uppercase">
                  Division One
                </h2>
                <a href="/standings" className={labelLink}>
                  Full table
                </a>
              </div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full border-collapse text-body">
                  <caption className="sr-only">
                    Kestrel Valley League, Division One: the top five clubs
                    after 14 of 22 matches.
                  </caption>
                  <thead className="bg-navy text-navy-foreground">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 pr-2 pl-5 text-left font-mono text-label uppercase text-ice"
                      >
                        <abbr title="Position" className="no-underline">
                          Pos
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 text-left font-mono text-label uppercase text-ice"
                      >
                        Club
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 text-right font-mono text-label uppercase text-ice"
                      >
                        <abbr title="Played" className="no-underline">
                          P
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3 text-right font-mono text-label uppercase text-ice"
                      >
                        <abbr title="Goal difference" className="no-underline">
                          GD
                        </abbr>
                      </th>
                      <th
                        scope="col"
                        className="py-3 pr-5 pl-2 text-right font-mono text-label uppercase text-ice"
                      >
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
                          {row.own && (
                            <span className="sr-only"> (this club)</span>
                          )}
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
                    After 14 of 22 matches. Clubs level on points are split by
                    goal difference.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Memberships */}
          <section
            aria-labelledby="join-heading"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="join-heading" className="text-h2 uppercase">
                Three ways to join
              </h2>
              <a href="/membership" className={labelLink}>
                How membership works
              </a>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {memberships.map((m) => (
                <div
                  key={m.name}
                  className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 lg:col-span-4"
                >
                  <h3 className="font-heading text-body font-bold uppercase">
                    {m.name}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <p className="font-heading text-h1 tabular-nums">
                      {m.price}
                    </p>
                    <p className="font-mono text-label uppercase text-muted-foreground">
                      A season
                    </p>
                  </div>
                  <p className="max-w-2xl text-body">{m.summary}</p>
                  <a href="/membership" className={cn("self-start", labelLink)}>
                    {m.link}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 px-5 py-8">
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
          <p className="font-mono text-label tabular-nums uppercase text-muted-foreground">
            © 2027 Wendmoor Football Club · Millrace Park, Wendmoor · A demo:
            nothing is sent or stored
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
