import { useRef, useState, type KeyboardEvent } from "react"
import { RefreshCw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "KEY EVENT" | "UPDATE" | "QUOTE" | "ANALYSIS"

type Update = {
  id: string
  time: string
  kind: Kind
  reporter: string
  headline?: string
  text: string[]
  quote?: { text: string; by: string }
  isNew?: boolean
}

type Order = "newest" | "oldest"

const SECTIONS = [
  "News",
  "Politics",
  "City",
  "Sport",
  "Results",
  "Business",
  "Culture",
  "Opinion",
]
const CURRENT_SECTION = "Politics"

const MALIK = "Malik Osei"
const HANA = "Hana Lindqvist"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const labelLink = cn(
  "text-foreground hover:underline underline-offset-4 transition-colors duration-150",
  focusRing
)
const currentLink = cn(
  "text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusRing
)
const mastheadLink = cn(
  "font-heading text-h2 uppercase text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusRing
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"

// Sample coverage, oldest first.
const INITIAL_UPDATES: Update[] = [
  {
    id: "u1730",
    time: "17:30",
    kind: "UPDATE",
    reporter: HANA,
    text: [
      "Good evening from the council chamber on Harbour Row, where councillors meet at 18:00 to vote on the £48m repair of the Kessel Street Bridge. The bridge has been shut since Tuesday, when inspectors found cracked bearings under its central span.",
    ],
  },
  {
    id: "u1741",
    time: "17:41",
    kind: "ANALYSIS",
    reporter: MALIK,
    text: [
      "Tonight’s vote turns on money, not on whether to repair. The ruling group wants a 25-year loan to cover the full £48m.",
      "The opposition says a smaller loan of £39m, with a narrower scope of works, would save the city about £9m in interest.",
    ],
  },
  {
    id: "u1752",
    time: "17:52",
    kind: "UPDATE",
    reporter: HANA,
    text: [
      "The public gallery is full and about forty people wait outside. Many are traders from the east bank, who say their takings have fallen by half since the bridge closed.",
    ],
  },
  {
    id: "u1804",
    time: "18:04",
    kind: "KEY EVENT",
    reporter: MALIK,
    headline: "Meeting opens with a full chamber",
    text: [
      "Mayor Ines Varga opened the meeting four minutes late. All 53 councillors are present, so the motion needs 27 votes to pass.",
    ],
  },
  {
    id: "u1815",
    time: "18:15",
    kind: "QUOTE",
    reporter: HANA,
    text: [
      "Councillor Tomas Reyburn, who chairs the transport committee, opened the debate for the ruling group at 18:12.",
    ],
    quote: {
      text: "Every week this bridge stays shut costs the people who cross it to get to work. We cannot repair half a bridge.",
      by: "Cllr Tomas Reyburn, transport committee",
    },
  },
  {
    id: "u1833",
    time: "18:33",
    kind: "UPDATE",
    reporter: MALIK,
    text: [
      "The city engineer, Dorota Feld, told councillors that the bearings on all four piers need replacing, not only the two that cracked. Her report puts the work at six months if it starts this month.",
    ],
  },
  {
    id: "u1851",
    time: "18:51",
    kind: "QUOTE",
    reporter: MALIK,
    text: [
      "Opposition leader Agnes Morrow moved her amendment to cut the loan to £39m at 18:48.",
    ],
    quote: {
      text: "Nobody in this room wants the bridge to stay shut. We want it fixed without leaving our children a debt they never chose.",
      by: "Cllr Agnes Morrow, opposition leader",
    },
  },
  {
    id: "u1910",
    time: "19:10",
    kind: "KEY EVENT",
    reporter: HANA,
    headline: "Loan cut amendment fails",
    text: [
      "The amendment to cut the loan to £39m fell by 30 votes to 23. One opposition councillor, Petra Hollis, voted against her own group.",
      "Debate now moves to the main motion: the full £48m repair and the 25-year loan.",
    ],
  },
  {
    id: "u1924",
    time: "19:24",
    kind: "UPDATE",
    reporter: MALIK,
    text: [
      "A short recess while officers check the wording of the main motion. Outside, the crowd has thinned to a dozen people.",
    ],
  },
  {
    id: "u1942",
    time: "19:42",
    kind: "KEY EVENT",
    reporter: HANA,
    headline: "Mayor calls the final vote",
    text: [
      "Debate closed after ninety minutes and Mayor Varga called the vote on the full repair. Councillors vote by roll call, name by name, which takes about twenty minutes.",
    ],
  },
  {
    id: "u1955",
    time: "19:55",
    kind: "ANALYSIS",
    reporter: MALIK,
    text: [
      "Halfway through the roll call the motion has 17 votes for and 9 against. Unless several members of the ruling group break ranks, it will pass.",
    ],
  },
  {
    id: "u2005",
    time: "20:05",
    kind: "KEY EVENT",
    reporter: HANA,
    headline: "Repair passes 31 to 22",
    text: [
      "The council has approved the £48m repair and the loan by 31 votes to 22. Two opposition councillors, Petra Hollis among them, voted with the ruling group.",
      "The city engineer says contractors can be on site within days.",
    ],
  },
]

const PREPARED_UPDATE: Update = {
  id: "u2012",
  time: "20:12",
  kind: "UPDATE",
  reporter: MALIK,
  text: [
    "Councillor Reyburn says repair work will start on Monday, with the first crews on the east bank piers. The bridge stays shut to all traffic, people on foot included, until the work is done in May.",
  ],
  isNew: true,
}

const KEY_POINTS = [
  "The council approved the £48m repair of the Kessel Street Bridge by 31 votes to 22.",
  "The work is paid for by a 25-year loan, which the opposition had tried to cut to £39m.",
  "The bridge, shut since Tuesday after inspectors found cracked bearings, stays closed for six months.",
  "The bearings on all four piers will be replaced, not only the two that cracked.",
]

function Masthead({ className }: { className?: string }) {
  return (
    <a href="/" className={cn(mastheadLink, className)}>
      The Port Avery Ledger
    </a>
  )
}

function LiveMarker() {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-label text-primary uppercase">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-primary"
      />
      Live
    </span>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <time
            dateTime="2026-11-11"
            className="font-mono text-label text-muted-foreground uppercase tabular-nums"
          >
            Wednesday 11 November 2026
          </time>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:border-b-0">
          <Masthead />
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-sections"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-sections"
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {SECTIONS.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === CURRENT_SECTION ? "page" : undefined}
                  className={cn(
                    "block py-2 font-mono text-label uppercase",
                    name === CURRENT_SECTION ? currentLink : labelLink
                  )}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === CURRENT_SECTION ? "page" : undefined}
                  className={cn(
                    "font-mono text-label uppercase",
                    name === CURRENT_SECTION ? currentLink : labelLink
                  )}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
        <Masthead className="self-start" />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  className={cn("font-mono text-label uppercase", labelLink)}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase">
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

function UpdateItem({ update }: { update: Update }) {
  return (
    <article className="flex flex-col gap-2">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-label uppercase tabular-nums">
        {update.isNew && <span className="text-primary">New</span>}
        <time
          dateTime={`2026-11-11T${update.time}`}
          className="text-foreground"
        >
          {update.time}
        </time>
        <span className="text-muted-foreground">{update.kind}</span>
        <span className="text-muted-foreground">{update.reporter}</span>
      </p>
      {update.headline && (
        <h3 className="text-h2 text-foreground uppercase">{update.headline}</h3>
      )}
      {update.text.map((paragraph) => (
        <p key={paragraph} className="max-w-xl">
          {paragraph}
        </p>
      ))}
      {update.quote && (
        <blockquote className="flex max-w-xl flex-col gap-1 border-l-2 pl-4">
          <p className="font-sans text-body italic">{update.quote.text}</p>
          <p className="font-mono text-label text-muted-foreground uppercase">
            {update.quote.by}
          </p>
        </blockquote>
      )}
    </article>
  )
}

export function App() {
  const [updates, setUpdates] = useState<Update[]>(INITIAL_UPDATES)
  const [order, setOrder] = useState<Order>("newest")
  const [newShown, setNewShown] = useState(false)
  const [status, setStatus] = useState("")

  const lastUpdate = updates[updates.length - 1].time
  const visible = order === "newest" ? [...updates].reverse() : updates

  function chooseOrder(next: Order) {
    if (next === order) return
    setOrder(next)
    setStatus(
      next === "oldest" ? "Showing oldest first" : "Showing newest first"
    )
  }

  function showNewUpdate() {
    if (newShown) return
    setUpdates((current) =>
      [...current, PREPARED_UPDATE].sort((a, b) =>
        a.time.localeCompare(b.time)
      )
    )
    setNewShown(true)
    setStatus("New update at 20:12: repair work to start on Monday.")
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-4 lg:max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <LiveMarker />
              <span className="font-mono text-label text-foreground uppercase">
                Politics
              </span>
            </div>
            <h1 className="text-h1 text-foreground uppercase md:text-display">
              Bridge vote: live
            </h1>
            <p className="max-w-3xl font-sans text-h2 font-normal">
              Port Avery’s council meets in emergency session tonight to vote
              on a £48m repair of the Kessel Street Bridge, and on the loan
              that would pay for it.
            </p>
            <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
              Malik Osei and Hana Lindqvist · Last update{" "}
              <time dateTime={`2026-11-11T${lastUpdate}`}>{lastUpdate}</time>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <aside
              aria-labelledby="key-points-heading"
              className="flex flex-col gap-4 border bg-card p-4 md:p-6 lg:sticky lg:top-6 lg:order-2 lg:col-span-4 lg:self-start"
            >
              <h2
                id="key-points-heading"
                className="font-mono text-label text-foreground uppercase"
              >
                Key points
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-6">
                {KEY_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>

            <section
              aria-labelledby="updates-heading"
              className="flex min-w-0 flex-col gap-4 lg:order-1 lg:col-span-8 lg:pr-6"
            >
              <h2 id="updates-heading" className="sr-only">
                Updates
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  role="group"
                  aria-label="Order of updates"
                  className="flex flex-wrap gap-1"
                >
                  <Button
                    variant={order === "newest" ? "secondary" : "outline"}
                    aria-pressed={order === "newest"}
                    className={buttonClasses}
                    onClick={() => chooseOrder("newest")}
                  >
                    Newest first
                  </Button>
                  <Button
                    variant={order === "oldest" ? "secondary" : "outline"}
                    aria-pressed={order === "oldest"}
                    className={buttonClasses}
                    onClick={() => chooseOrder("oldest")}
                  >
                    Oldest first
                  </Button>
                </div>
                <Button
                  variant="secondary"
                  className={buttonClasses}
                  disabled={newShown}
                  focusableWhenDisabled
                  onClick={showNewUpdate}
                >
                  <RefreshCw
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {newShown ? "No new updates" : "Show new update"}
                </Button>
              </div>
              <p role="status" className="sr-only">
                {status}
              </p>
              <ol className="flex list-none flex-col gap-4 p-0">
                {visible.map((update, index) => (
                  <li
                    key={update.id}
                    className={cn(index > 0 && "border-t pt-4")}
                  >
                    <UpdateItem update={update} />
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
