import { useRef, useState, type KeyboardEvent } from "react"
import { RefreshCw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "Key event" | "Update" | "Quote" | "Analysis"

type LiveUpdate = {
  id: string
  time: string
  kind: Kind
  reporter: string
  headline?: string
  text: string[]
  quote?: { words: string; speaker: string }
  isNew?: boolean
}

type Order = "newest" | "oldest"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const labelLink = cn(
  "font-mono text-label uppercase text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const currentLink = cn(
  "font-mono text-label uppercase text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusRing
)

const mastheadLink = cn(
  "font-heading uppercase text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"

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

const initialUpdates: LiveUpdate[] = [
  {
    id: "u1730",
    time: "17:30",
    kind: "Update",
    reporter: "Hana Lindqvist",
    text: [
      "About 60 people are queuing outside Harbour Hall on Quay Road for the public gallery, which seats 120.",
      "Several of them carry placards from the Kessel Street traders’ group.",
    ],
  },
  {
    id: "u1744",
    time: "17:44",
    kind: "Analysis",
    reporter: "Malik Osei",
    text: [
      "The bridge has been shut since Tuesday, when inspectors found cracked bearings under its eastern span.",
      "Council officers say a full repair will take six months and cost £48m, paid for with a 25-year loan. The opposition Harbour Alliance wants a smaller loan and a cheaper temporary crossing.",
    ],
  },
  {
    id: "u1752",
    time: "17:52",
    kind: "Update",
    reporter: "Malik Osei",
    text: [
      "Buses from the east bank are running a diversion over the Marrow Lane crossing, which adds about 25 minutes to the trip. The harbour ferry has added four sailings tonight.",
    ],
  },
  {
    id: "u1804",
    time: "18:04",
    kind: "Key event",
    reporter: "Hana Lindqvist",
    headline: "Meeting opens four minutes late",
    text: [
      "The mayor, Ines Varga, opened the meeting with all 53 councillors in the chamber.",
      "She told the gallery there would be one debate tonight and a vote on the full repair at the end of it.",
    ],
  },
  {
    id: "u1812",
    time: "18:12",
    kind: "Quote",
    reporter: "Malik Osei",
    text: [
      "The council leader, Ruth Abara, opened the debate at 18:12 and asked members to back the full repair.",
    ],
    quote: {
      words:
        "Every day this bridge stays shut costs the harbour trade. We cannot patch it and hope.",
      speaker: "Ruth Abara, council leader",
    },
  },
  {
    id: "u1831",
    time: "18:31",
    kind: "Update",
    reporter: "Hana Lindqvist",
    text: [
      "The city’s chief engineer, Tomas Breck, told councillors that two of the bridge’s eight bearings have cracked right through.",
      "He said a cheaper patch would need checking every month and could close the bridge again within a year.",
    ],
  },
  {
    id: "u1847",
    time: "18:47",
    kind: "Key event",
    reporter: "Malik Osei",
    headline: "Opposition tables £30m amendment",
    text: [
      "The Harbour Alliance leader, Petra Lund, proposed cutting the loan to £30m and putting part of the money into a temporary footbridge.",
      "She said the full loan would add £14 a year to an average council tax bill.",
    ],
  },
  {
    id: "u1905",
    time: "19:05",
    kind: "Quote",
    reporter: "Hana Lindqvist",
    text: [
      "Dana Kowal, who runs a bakery on Kessel Street, spoke for the traders’ group at 19:05.",
    ],
    quote: {
      words:
        "Our takings have halved since Tuesday. Six months of this and some of us will not reopen.",
      speaker: "Dana Kowal, Kessel Street traders",
    },
  },
  {
    id: "u1920",
    time: "19:20",
    kind: "Analysis",
    reporter: "Malik Osei",
    text: [
      "The governing Civic group holds 29 of the 53 seats, so it needs two more votes to pass the repair.",
      "Two independents have said they will back it, and one Harbour Alliance member has hinted she may do the same.",
    ],
  },
  {
    id: "u1938",
    time: "19:38",
    kind: "Key event",
    reporter: "Hana Lindqvist",
    headline: "Amendment falls 24 to 29",
    text: [
      "The £30m amendment was defeated by 29 votes to 24.",
      "The mayor called a ten-minute break before the vote on the full £48m repair.",
    ],
  },
  {
    id: "u1951",
    time: "19:51",
    kind: "Update",
    reporter: "Malik Osei",
    text: [
      "Councillors are back in the chamber, and the mayor has asked the gallery to stay quiet during the vote.",
    ],
  },
  {
    id: "u2005",
    time: "20:05",
    kind: "Key event",
    reporter: "Hana Lindqvist",
    headline: "Repair passes 31 to 22",
    text: [
      "The £48m repair has passed by 31 votes to 22, with two Harbour Alliance members voting for it.",
      "The loan will be signed this week, and officers expect the bridge to reopen in May 2027.",
    ],
  },
]

const preparedUpdate: LiveUpdate = {
  id: "u2012",
  time: "20:12",
  kind: "Update",
  reporter: "Malik Osei",
  text: [
    "Officers say repair work will start on Monday, with cranes on the east bank from Sunday night.",
    "The extra ferry sailings will run until the bridge reopens.",
  ],
}

const preparedMessage = "New update at 20:12: repair work to start on Monday."

const keyPoints = [
  "Councillors approved the £48m repair of the Kessel Street Bridge by 31 votes to 22.",
  "The repair is paid for by a 25-year loan, after an opposition plan to cut it to £30m was defeated.",
  "The bridge closed on Tuesday when inspectors found cracked bearings, and it stays shut for six months.",
  "Buses divert over the Marrow Lane crossing and the ferry runs extra sailings until it reopens.",
]

function LiveMarker() {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-label uppercase text-primary">
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

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header onKeyDown={handleKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <time
            dateTime="2026-11-11"
            className="font-mono text-label uppercase tabular-nums text-muted-foreground"
          >
            Wednesday 11 November 2026
          </time>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:border-b-0">
          <a href="/" className={cn(mastheadLink, "text-h2")}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="sections-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="sections-menu"
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <a
                  href="#"
                  aria-current={
                    section === currentSection ? "page" : undefined
                  }
                  className={cn(
                    section === currentSection ? currentLink : labelLink,
                    "block py-2"
                  )}
                >
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((section) => (
              <li key={section}>
                <a
                  href="#"
                  aria-current={
                    section === currentSection ? "page" : undefined
                  }
                  className={
                    section === currentSection ? currentLink : labelLink
                  }
                >
                  {section}
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
        <a href="/" className={cn(mastheadLink, "self-start text-h2")}>
          The Port Avery Ledger
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((section) => (
              <li key={section}>
                <a href="#" className={labelLink}>
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

function UpdateItem({ update }: { update: LiveUpdate }) {
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
        <h3 className="text-h2 uppercase text-foreground">
          {update.headline}
        </h3>
      )}
      {update.text.map((paragraph) => (
        <p key={paragraph} className="max-w-xl text-body text-foreground">
          {paragraph}
        </p>
      ))}
      {update.quote && (
        <blockquote className="flex max-w-xl flex-col gap-1 border-l-2 pl-4">
          <p className="font-sans text-body text-foreground italic">
            {update.quote.words}
          </p>
          <p className="font-mono text-label uppercase text-muted-foreground">
            {update.quote.speaker}
          </p>
        </blockquote>
      )}
    </article>
  )
}

export function App() {
  const [updates, setUpdates] = useState<LiveUpdate[]>(initialUpdates)
  const [order, setOrder] = useState<Order>("newest")
  const [status, setStatus] = useState("")
  const [preparedShown, setPreparedShown] = useState(false)

  const byTime = [...updates].sort((a, b) => a.time.localeCompare(b.time))
  const shown = order === "newest" ? [...byTime].reverse() : byTime
  const lastUpdate = byTime.reduce(
    (latest, update) => (update.time > latest ? update.time : latest),
    "00:00"
  )

  function chooseOrder(next: Order) {
    if (next === order) return
    setOrder(next)
    setStatus(next === "oldest" ? "Showing oldest first" : "Showing newest first")
  }

  function showNewUpdate() {
    if (preparedShown) return
    setUpdates((current) => [...current, { ...preparedUpdate, isNew: true }])
    setPreparedShown(true)
    setStatus(preparedMessage)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-4 lg:max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <LiveMarker />
              <span className="font-mono text-label uppercase text-foreground">
                Politics
              </span>
            </div>
            <h1 className="text-h1 uppercase text-foreground md:text-display">
              Bridge vote: live
            </h1>
            <p className="max-w-3xl font-sans text-h2 font-normal text-foreground">
              Port Avery’s council meets in an emergency session to decide on a
              £48m loan to repair the Kessel Street Bridge, shut since Tuesday
              with cracked bearings.
            </p>
            <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
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
                className="font-mono text-label uppercase text-foreground"
              >
                Key points
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-6">
                {keyPoints.map((point) => (
                  <li key={point} className="text-body text-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </aside>

            <section className="flex min-w-0 flex-col gap-4 lg:order-1 lg:col-span-8 lg:pr-6">
              <h2 className="sr-only">Updates</h2>
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
                  disabled={preparedShown}
                  focusableWhenDisabled
                  onClick={showNewUpdate}
                >
                  <RefreshCw
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  {preparedShown ? "No new updates" : "Show new update"}
                </Button>
              </div>
              <p role="status" className="sr-only">
                {status}
              </p>
              <ol className="flex flex-col gap-4">
                {shown.map((update, index) => (
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
