import { useEffect, useRef, useState } from "react"
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
  quote?: { words: string; speaker: string }
  isNew?: boolean
}

const MALIK = "Malik Osei"
const HANA = "Hana Lindqvist"

// Oldest first; the order control reverses it for display.
const initialUpdates: Update[] = [
  {
    id: "u1730",
    time: "17:30",
    kind: "UPDATE",
    reporter: HANA,
    text: [
      "The public gallery at City Hall is already full, half an hour before the meeting starts. Ushers have opened the Ferrow Room next door, where the vote will be shown on a screen.",
    ],
  },
  {
    id: "u1745",
    time: "17:45",
    kind: "ANALYSIS",
    reporter: MALIK,
    text: [
      "The council has 53 seats, so the repair needs 27 votes to pass. The ruling Harbour Alliance holds 29, but at least three of its members have said they are unhappy with the size of the loan.",
      "If those three abstain, the plan still passes. If they vote against it, the result rests on the four independents.",
    ],
  },
  {
    id: "u1800",
    time: "18:00",
    kind: "KEY EVENT",
    reporter: HANA,
    headline: "MEETING OPENS ON THE BRIDGE",
    text: [
      "Council leader Petra Valdane opened the meeting on time and moved straight to the one item on the agenda: the £48m repair of the Kessel Street Bridge.",
    ],
  },
  {
    id: "u1812",
    time: "18:12",
    kind: "QUOTE",
    reporter: HANA,
    text: [
      "Opening the debate at 18:10, the council leader told members the city could not wait for a cheaper plan.",
    ],
    quote: {
      words:
        "Every week that bridge stays shut costs this city money and costs people their time. Half a repair is no repair.",
      speaker: "Petra Valdane, council leader",
    },
  },
  {
    id: "u1828",
    time: "18:28",
    kind: "UPDATE",
    reporter: MALIK,
    text: [
      "The city engineer, Tomas Brekke, showed members photographs of the cracked bearings found on Tuesday. He said two of the six bearings on the north span have split right through.",
    ],
  },
  {
    id: "u1841",
    time: "18:41",
    kind: "QUOTE",
    reporter: MALIK,
    text: [
      "Opposition leader Corin Ashby rose at 18:39 to argue for a smaller loan of £30m, with the rest found from savings.",
    ],
    quote: {
      words:
        "Nobody here wants the bridge shut. We want it fixed without handing the bill to our grandchildren.",
      speaker: "Corin Ashby, opposition leader",
    },
  },
  {
    id: "u1857",
    time: "18:57",
    kind: "KEY EVENT",
    reporter: HANA,
    headline: "LOAN CUT VOTED DOWN",
    text: [
      "The opposition amendment to cut the loan to £30m has failed by 30 votes to 23.",
      "Two Harbour Alliance members voted with the opposition, but the independents did not.",
    ],
  },
  {
    id: "u1910",
    time: "19:10",
    kind: "UPDATE",
    reporter: MALIK,
    text: [
      "Outside City Hall, about 200 people have gathered on Quay Road. Many are traders from the south bank, who say footfall has halved since the bridge closed.",
    ],
  },
  {
    id: "u1924",
    time: "19:24",
    kind: "ANALYSIS",
    reporter: HANA,
    text: [
      "The amendment vote is the best guide we have to the final count. If the same members hold their line, the repair passes with a margin of about seven votes.",
    ],
  },
  {
    id: "u1942",
    time: "19:42",
    kind: "KEY EVENT",
    reporter: MALIK,
    headline: "SIX MONTHS TO REOPEN",
    text: [
      "Tomas Brekke told members the work would take six months once it starts. A temporary footbridge could open alongside it within eight weeks, at a cost of £1.2m from the same loan.",
    ],
  },
  {
    id: "u1951",
    time: "19:51",
    kind: "UPDATE",
    reporter: HANA,
    text: [
      "Debate has closed. Members are now voting on the full repair plan, by roll call.",
    ],
  },
  {
    id: "u2005",
    time: "20:05",
    kind: "KEY EVENT",
    reporter: MALIK,
    headline: "REPAIR PASSES 31 TO 22",
    text: [
      "The council has approved the £48m repair of the Kessel Street Bridge by 31 votes to 22. The loan will be repaid over 25 years.",
      "There was applause from the public gallery as the result was read out.",
    ],
  },
]

const preparedUpdate: Update = {
  id: "u2012",
  time: "20:12",
  kind: "UPDATE",
  reporter: HANA,
  text: [
    "The council has confirmed that repair work will start on Monday. Contractors will set up on the north bank first, and Kessel Street stays closed to all traffic.",
  ],
  isNew: true,
}

const keyPoints = [
  "The Kessel Street Bridge closed on Tuesday after inspectors found cracked bearings and will stay shut for six months.",
  "Councillors met tonight to vote on a £48m repair, paid for with a loan.",
  "An opposition plan to cut the loan to £30m was voted down by 30 to 23.",
  "The full repair passed by 31 votes to 22 at 20:05.",
]

const sections = [
  "News",
  "Politics",
  "City",
  "Sport",
  "Results",
  "Business",
  "Culture",
  "Opinion",
]
const currentSection = "Politics"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const labelLink = `text-foreground hover:underline underline-offset-4 transition-colors duration-150 ${focusRing}`
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"
const mastheadClasses = `font-heading text-h2 uppercase text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150 ${focusRing}`

function Masthead({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`${mastheadClasses} ${className}`}>
      The Port Avery Ledger
    </a>
  )
}

function SectionLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul
      className={
        mobile
          ? "flex flex-col font-mono text-label uppercase"
          : "flex flex-wrap gap-x-6 gap-y-2 font-mono text-label uppercase"
      }
    >
      {sections.map((name) => {
        const current = name === currentSection
        return (
          <li key={name}>
            <a
              href="#"
              aria-current={current ? "page" : undefined}
              className={`${
                current
                  ? `text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150 ${focusRing}`
                  : labelLink
              }${mobile ? " block py-2" : ""}`}
            >
              {name}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <header>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="font-mono text-label text-muted-foreground uppercase">
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              WEDNESDAY 11 NOVEMBER 2026
            </time>
          </span>
          <a
            href="#"
            className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
          >
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <Masthead />
          <Button
            ref={menuButton}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="mobile-sections"
            onClick={() => setMenuOpen((open) => !open)}
            className={`${buttonClasses} md:hidden`}
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
          <SectionLinks mobile />
        </nav>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <SectionLinks />
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
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-label uppercase">
            {sections.map((name) => (
              <li key={name}>
                <a href="#" className={labelLink}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase">
          © <span className="tabular-nums">2026</span> The Port Avery Ledger ·
          Port Avery
        </p>
      </div>
    </footer>
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

function UpdateItem({ update }: { update: Update }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-label uppercase">
        {update.isNew && <span className="text-primary">NEW</span>}
        <time
          dateTime={`2026-11-11T${update.time}`}
          className="font-mono text-foreground tabular-nums"
        >
          {update.time}
        </time>
        <span className="text-muted-foreground">{update.kind}</span>
        <span className="text-muted-foreground">{update.reporter}</span>
      </div>
      {update.headline && (
        <h3 className="text-h2 text-foreground uppercase">{update.headline}</h3>
      )}
      <div className="flex flex-col gap-4">
        {update.text.map((paragraph) => (
          <p key={paragraph} className="max-w-xl text-body text-foreground">
            {paragraph}
          </p>
        ))}
        {update.quote && (
          <blockquote className="flex flex-col gap-1 border-l-2 pl-4">
            <p className="max-w-xl font-sans text-body text-foreground italic">
              {update.quote.words}
            </p>
            <p className="font-mono text-label text-muted-foreground uppercase">
              {update.quote.speaker}
            </p>
          </blockquote>
        )}
      </div>
    </article>
  )
}

type Order = "newest" | "oldest"

export function App() {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates)
  const [order, setOrder] = useState<Order>("newest")
  const [shownNew, setShownNew] = useState(false)
  const [status, setStatus] = useState("")

  const lastTime = updates[updates.length - 1].time
  const visible = order === "newest" ? [...updates].reverse() : updates

  function chooseOrder(next: Order) {
    if (next === order) return
    setOrder(next)
    setStatus(next === "newest" ? "Showing newest first" : "Showing oldest first")
  }

  function showNewUpdate() {
    if (shownNew) return
    setUpdates((list) => [...list, preparedUpdate])
    setShownNew(true)
    setStatus("New update at 20:12: repair work to start on Monday.")
  }

  const orderButtons: { value: Order; label: string }[] = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
  ]

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-4 lg:max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <LiveMarker />
              <span className="font-mono text-label text-foreground uppercase">
                POLITICS
              </span>
            </div>
            <h1 className="text-h1 text-foreground uppercase md:text-display">
              BRIDGE VOTE: LIVE
            </h1>
            <p className="max-w-3xl font-sans text-h2 font-normal text-foreground">
              Councillors decide tonight whether to borrow £48m to repair the
              Kessel Street Bridge, which closed on Tuesday.
            </p>
            <p className="font-mono text-label text-muted-foreground uppercase">
              MALIK OSEI AND HANA LINDQVIST · LAST UPDATE{" "}
              <time
                dateTime={`2026-11-11T${lastTime}`}
                className="font-mono tabular-nums"
              >
                {lastTime}
              </time>
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
                KEY POINTS
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-6">
                {keyPoints.map((point) => (
                  <li key={point} className="text-body text-foreground">
                    {point}
                  </li>
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
                  {orderButtons.map(({ value, label }) => {
                    const chosen = order === value
                    return (
                      <Button
                        key={value}
                        variant={chosen ? "secondary" : "outline"}
                        aria-pressed={chosen}
                        onClick={() => chooseOrder(value)}
                        className={buttonClasses}
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="secondary"
                  disabled={shownNew}
                  focusableWhenDisabled
                  onClick={showNewUpdate}
                  className={`${buttonClasses} gap-2`}
                >
                  <RefreshCw
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {shownNew ? "No new updates" : "Show new update"}
                </Button>
              </div>
              <p role="status" className="sr-only">
                {status}
              </p>
              <ol className="flex list-none flex-col gap-4 p-0">
                {visible.map((update, index) => (
                  <li
                    key={update.id}
                    className={index > 0 ? "border-t pt-4" : undefined}
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
