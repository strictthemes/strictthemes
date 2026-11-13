import { useEffect, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Kind = "Key event" | "Update" | "Quote" | "Analysis"
type Order = "newest" | "oldest"

type LiveUpdate = {
  time: string
  kind: Kind
  reporter: string
  headline?: string
  paragraphs: string[]
  quote?: { text: string; by: string }
}

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase"
const LABEL_LINK = cn(
  LABEL,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const CURRENT_LINK = cn(
  LABEL,
  "text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150",
  FOCUS
)
const MASTHEAD = cn(
  "font-heading text-h2 text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const BUTTON = "h-auto px-4 py-2 font-mono text-label uppercase"
const CONTAINER = "mx-auto max-w-[1280px] px-4 md:px-6"

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

const KEY_POINTS = [
  "Councillors approved the £48m repair of the Kessel Street Bridge by 31 votes to 22.",
  "The bridge closed on Tuesday after inspectors found cracked bearings, and it stays shut for six months.",
  "An opposition attempt to cut the loan that pays for the repair from £48m to £30m failed by 24 votes to 29.",
  "All four independent councillors backed the repair in the final vote.",
]

// Oldest first.
const UPDATES: LiveUpdate[] = [
  {
    time: "17:30",
    kind: "Update",
    reporter: "Malik Osei",
    paragraphs: [
      "Good evening from Harbour Hall, where the council meets at 18:00 to decide what happens to the Kessel Street Bridge. The doors of the public gallery have just opened and the queue runs down the steps to Tanner Row.",
    ],
  },
  {
    time: "17:48",
    kind: "Analysis",
    reporter: "Hana Lindqvist",
    paragraphs: [
      "The numbers to keep in mind tonight: there are 53 councillors, so 27 votes carry the room. The Harbour Alliance, which runs the council, holds exactly 27 seats, the Civic List has 22, and four independents sit between them.",
      "One absence on the Alliance benches would leave the repair in the hands of those four.",
    ],
  },
  {
    time: "18:02",
    kind: "Key event",
    reporter: "Malik Osei",
    headline: "Meeting opens to a full gallery",
    paragraphs: [
      "The chair, Ines Varga, has called the meeting to order with every one of the 53 seats taken. The gallery is full, and about sixty people are watching on a screen in the lobby.",
    ],
  },
  {
    time: "18:15",
    kind: "Update",
    reporter: "Hana Lindqvist",
    paragraphs: [
      "The city engineer, Tobias Renn, is taking councillors through the inspection report. Bearings on four of the bridge's six piers are cracked, he says, and no weight limit would make it safe to reopen before they are replaced.",
      "He puts the work at six months and £48m.",
    ],
  },
  {
    time: "18:31",
    kind: "Quote",
    reporter: "Malik Osei",
    paragraphs: [
      "The council leader, Dorothea Pike of the Harbour Alliance, opened the debate a few minutes ago by asking for the full loan.",
    ],
    quote: {
      text: "Every week that bridge is shut, the east bank loses a little more of its trade. We can argue about the loan for a year, or we can mend the bridge in six months.",
      by: "Dorothea Pike, council leader",
    },
  },
  {
    time: "18:50",
    kind: "Key event",
    reporter: "Hana Lindqvist",
    headline: "Opposition moves to cut the loan",
    paragraphs: [
      "Anselm Brook, who leads the Civic List, has tabled an amendment that would cap the loan at £30m. It would replace the four cracked bearings now and leave the new deck and the lighting for a later budget.",
    ],
  },
  {
    time: "19:05",
    kind: "Quote",
    reporter: "Hana Lindqvist",
    paragraphs: [
      "Anselm Brook, speaking to his amendment just after 19:00, said the city could not afford the whole plan.",
    ],
    quote: {
      text: "Nobody in this room wants the bridge shut. But £48m is a loan our children will still be paying when they have children of their own.",
      by: "Anselm Brook, leader of the Civic List",
    },
  },
  {
    time: "19:20",
    kind: "Update",
    reporter: "Malik Osei",
    paragraphs: [
      "The chair has given the public gallery fifteen minutes. Shopkeepers from Kessel Street handed in a petition of 4,200 names asking for the full repair, and the owner of the Quay ferry said her two boats cannot carry the morning crowd for six months.",
    ],
  },
  {
    time: "19:42",
    kind: "Key event",
    reporter: "Malik Osei",
    headline: "Loan cut fails 24 to 29",
    paragraphs: [
      "The amendment has fallen by 24 votes to 29. Two of the four independents voted with the Civic List and two with the Alliance, whose 27 councillors all voted against.",
    ],
  },
  {
    time: "19:48",
    kind: "Analysis",
    reporter: "Hana Lindqvist",
    paragraphs: [
      "That vote tells us how the main one should go. The Alliance did not lose a single councillor, so the £48m repair has its 27 votes before any independent is counted.",
      "What is left to learn is the margin.",
    ],
  },
  {
    time: "19:58",
    kind: "Update",
    reporter: "Malik Osei",
    paragraphs: [
      "Ines Varga has closed the debate and called the vote on the repair itself. It is a roll call, so each of the 53 councillors is named and answers aloud.",
    ],
  },
  {
    time: "20:05",
    kind: "Key event",
    reporter: "Hana Lindqvist",
    headline: "Repair passes 31 to 22",
    paragraphs: [
      "The council has approved the £48m repair of the Kessel Street Bridge by 31 votes to 22. All four independents voted for it in the end, and the Civic List voted against as one.",
    ],
  },
]

const NEW_UPDATE: LiveUpdate = {
  time: "20:12",
  kind: "Update",
  reporter: "Malik Osei",
  paragraphs: [
    "Repair work will start on Monday, Tobias Renn told reporters on the steps of Harbour Hall. The first crews will put up scaffolding around the two piers nearest the east bank.",
  ],
}

const ORDERS: { value: Order; text: string; status: string }[] = [
  { value: "newest", text: "Newest first", status: "Showing newest first" },
  { value: "oldest", text: "Oldest first", status: "Showing oldest first" },
]

function SectionLinks({
  current,
  block = false,
}: {
  current?: string
  block?: boolean
}) {
  return (
    <>
      {SECTIONS.map((name) => (
        <li key={name}>
          <a
            href="#"
            aria-current={name === current ? "page" : undefined}
            className={cn(
              name === current ? CURRENT_LINK : LABEL_LINK,
              block && "block py-2"
            )}
          >
            {name}
          </a>
        </li>
      ))}
    </>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header>
      <div className={CONTAINER}>
        <div className="flex items-center justify-between gap-4 py-2">
          <time
            dateTime="2026-11-11"
            className={cn(LABEL, "text-muted-foreground tabular-nums")}
          >
            Wednesday 11 November 2026
          </time>
          <a href="#" className={cn(buttonVariants(), BUTTON)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <a href="/" className={MASTHEAD}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={open}
            aria-controls="sections-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
        </div>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <SectionLinks current={CURRENT_SECTION} />
          </ul>
        </nav>
        <nav
          id="sections-menu"
          aria-label="Sections"
          hidden={!open}
          className="border-b py-2 md:hidden"
        >
          <ul>
            <SectionLinks current={CURRENT_SECTION} block />
          </ul>
        </nav>
      </div>
    </header>
  )
}

function UpdateItem({ update, isNew }: { update: LiveUpdate; isNew: boolean }) {
  return (
    <article className="flex flex-col gap-2">
      <div
        className={cn(LABEL, "flex flex-wrap items-baseline gap-x-4 gap-y-1")}
      >
        {isNew && <span className="text-primary">New</span>}
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
      {update.paragraphs.map((text) => (
        <p key={text} className="max-w-xl text-body">
          {text}
        </p>
      ))}
      {update.quote && (
        <blockquote className="flex max-w-xl flex-col gap-1 border-l-2 pl-4">
          <p className="font-sans text-body italic">{update.quote.text}</p>
          <p className={cn(LABEL, "text-muted-foreground")}>
            {update.quote.by}
          </p>
        </blockquote>
      )}
    </article>
  )
}

export function App() {
  const [order, setOrder] = useState<Order>("newest")
  const [newShown, setNewShown] = useState(false)
  const [status, setStatus] = useState("")

  const oldestFirst = newShown ? [...UPDATES, NEW_UPDATE] : UPDATES
  const updates = order === "newest" ? [...oldestFirst].reverse() : oldestFirst
  const lastUpdate = oldestFirst[oldestFirst.length - 1].time

  function chooseOrder(next: (typeof ORDERS)[number]) {
    if (next.value === order) {
      return
    }
    setOrder(next.value)
    setStatus(next.status)
  }

  function showNewUpdate() {
    if (newShown) {
      return
    }
    setNewShown(true)
    setStatus(
      `New update at ${NEW_UPDATE.time}: repair work to start on Monday.`
    )
  }

  return (
    <div className="text-body">
      <SiteHeader />

      <main>
        <div className={cn(CONTAINER, "flex flex-col gap-12 pt-6 pb-12")}>
          <div className="flex flex-col gap-4 lg:max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                className={cn(
                  LABEL,
                  "inline-flex items-center gap-2 text-primary"
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full bg-primary"
                />
                Live
              </span>
              <span className={cn(LABEL, "text-foreground")}>Politics</span>
            </div>
            <h1 className="text-h1 text-foreground uppercase md:text-display">
              Bridge vote: live
            </h1>
            <p className="max-w-3xl font-sans text-h2 font-normal">
              Port Avery&apos;s council met in emergency session to decide
              whether to borrow £48m and repair the Kessel Street Bridge.
            </p>
            <p className={cn(LABEL, "text-muted-foreground")}>
              Malik Osei and Hana Lindqvist · Last update{" "}
              <time
                dateTime={`2026-11-11T${lastUpdate}`}
                className="font-mono tabular-nums"
              >
                {lastUpdate}
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
                className={cn(LABEL, "text-foreground")}
              >
                Key points
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-6">
                {KEY_POINTS.map((point) => (
                  <li key={point} className="text-body">
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
                  {ORDERS.map((item) => (
                    <Button
                      key={item.value}
                      variant={item.value === order ? "secondary" : "outline"}
                      aria-pressed={item.value === order}
                      className={BUTTON}
                      onClick={() => chooseOrder(item)}
                    >
                      {item.text}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className={cn(BUTTON, "gap-2")}
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
                {updates.map((update, index) => (
                  <li
                    key={update.time}
                    className={index > 0 ? "border-t pt-4" : undefined}
                  >
                    <UpdateItem
                      update={update}
                      isNew={update === NEW_UPDATE}
                    />
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>

      <footer>
        <div className={cn(CONTAINER, "flex flex-col gap-4 border-t-2 py-6")}>
          <a href="/" className={cn(MASTHEAD, "self-start")}>
            The Port Avery Ledger
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks />
            </ul>
          </nav>
          <p className={cn(LABEL, "text-muted-foreground")}>
            © 2026 The Port Avery Ledger · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
