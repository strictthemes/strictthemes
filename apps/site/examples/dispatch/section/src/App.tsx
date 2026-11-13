import { useRef, useState, type KeyboardEvent } from "react"
import { flushSync } from "react-dom"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PAPER = "The Port Avery Ledger"

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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const labelLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const currentLabelLink = cn(
  "font-mono text-label text-foreground uppercase underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusOutline
)
const headlineLink = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const mastheadLink = cn(
  "font-heading text-h2 text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"
const labelText = "font-mono text-label uppercase"

type Picture = {
  label: string
  caption: string
}

type Story = {
  id: string
  /** Shown as "09:40" for today, "TUE 10 NOV" for another day. */
  shown: string
  dateTime: string
  kicker: string
  headline: string
  sentence: string
  byline: string
  picture?: Picture
}

const MALIK = "BY MALIK OSEI"
const PRIYA = "BY PRIYA VENKATARAMAN"

const STORIES: Story[] = [
  {
    id: "fares-paused",
    shown: "09:40",
    dateTime: "2026-11-11T09:40",
    kicker: "Bus fares",
    headline: "Fare rise on harbour routes paused for six months",
    sentence:
      "The transport committee shelved the 20p increase on the 4, 7 and 11 routes after the morning vote left nobody able to pass it.",
    byline: PRIYA,
    picture: {
      label:
        "Passengers boarding a single-deck bus at the Quay Road stop on a grey morning",
      caption: "The Quay Road stop on the 7 route · Photograph: Ines Varga",
    },
  },
  {
    id: "saltgate-ballot",
    shown: "08:55",
    dateTime: "2026-11-11T08:55",
    kicker: "Saltgate vote",
    headline: "Three names on the ballot as Saltgate list closes",
    sentence:
      "A retired ferry engineer, a primary school governor and a café owner will stand in the ward on 3 December.",
    byline: MALIK,
  },
  {
    id: "pay-review",
    shown: "08:10",
    dateTime: "2026-11-11T08:10",
    kicker: "Council pay",
    headline: "Pay review for senior posts sent back to the panel",
    sentence:
      "Members asked for figures from four other harbour cities before they consider the proposed 6 per cent rise again.",
    byline: PRIYA,
  },
  {
    id: "why-we-left",
    shown: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Interview",
    headline: "Why we walked out: the two who broke the group",
    sentence:
      "Councillors Rhona Tewsley and Dev Akintola say they warned the leader about the bridge loan terms in September.",
    byline: MALIK,
    picture: {
      label:
        "Two councillors standing on the steps of the civic hall, wearing winter coats",
      caption:
        "Rhona Tewsley and Dev Akintola outside the civic hall · Photograph: Ines Varga",
    },
  },
  {
    id: "bridge-terms",
    shown: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Bridge loan",
    headline: "What the bridge loan would cost each household",
    sentence:
      "The £48m loan for the Kessel Street crossing adds about £31 a year to a band C bill for twenty-five years.",
    byline: PRIYA,
  },
  {
    id: "leader-statement",
    shown: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Council",
    headline: "Leader says she will not step down before May",
    sentence:
      "Margit Holloway told members she would govern as a minority and bring the loan back with new terms.",
    byline: MALIK,
  },
  {
    id: "fare-petition",
    shown: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Bus fares",
    headline: "Fare petition reaches 9,000 names in a week",
    sentence:
      "Organisers from the Northbank tenants' group handed it in at the civic hall an hour before the committee met.",
    byline: PRIYA,
  },
  {
    id: "saltgate-turnout",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Saltgate vote",
    headline: "Saltgate turnout was 22 per cent. Can it rise?",
    sentence:
      "Polling cards go out on Friday, and the ward's two polling stations stay open until 22:00 on the day.",
    byline: MALIK,
  },
  {
    id: "audit-letter",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Council",
    headline: "Auditor's letter on the loan is made public",
    sentence:
      "The letter, dated 2 October, asks the council to show how it would repay the loan if toll income falls short.",
    byline: PRIYA,
  },
  {
    id: "pay-freeze",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Council pay",
    headline: "Opposition calls for a pay freeze at the top",
    sentence:
      "The Civic Party wants no rise for any post paid over £90,000 until the bridge question is settled.",
    byline: MALIK,
  },
  {
    id: "night-buses",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Bus fares",
    headline: "Night bus to Saltgate will run through winter",
    sentence:
      "The N4 had been due to stop in December; the operator agreed to keep it running until the end of March.",
    byline: PRIYA,
  },
  {
    id: "harbour-ward",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Interview",
    headline: "Ten minutes with the harbour ward's newest member",
    sentence:
      "Councillor Owen Farrish on his first year, the fish market lease and why he still takes the ferry to work.",
    byline: MALIK,
  },
  {
    id: "budget-gap",
    shown: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Budget",
    headline: "Council faces £6m gap in next year's budget",
    sentence:
      "Finance officers set out three ways to close it, and none of them leaves library hours as they are.",
    byline: PRIYA,
  },
  {
    id: "saltgate-hustings",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Saltgate vote",
    headline: "First hustings set for the Saltgate church hall",
    sentence:
      "The ward residents' forum will host the candidates on 19 November, with questions sent in beforehand.",
    byline: MALIK,
  },
  {
    id: "loan-vote-date",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Bridge loan",
    headline: "Bridge loan vote set for Tuesday evening",
    sentence:
      "The full council meets at 18:00, and the public gallery will open at 17:30 for the first fifty people.",
    byline: PRIYA,
  },
  {
    id: "fare-cap",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Bus fares",
    headline: "Daily fare cap for under-25s goes to a vote",
    sentence:
      "A £4 cap across all city routes would cost the council about £400,000 a year, officers estimate.",
    byline: MALIK,
  },
  {
    id: "allowances",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Council pay",
    headline: "Members' allowances to be published each month",
    sentence:
      "From January every councillor's claims will be listed online, a change both main groups backed.",
    byline: PRIYA,
  },
  {
    id: "former-leader",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Interview",
    headline: "A former leader on what minority rule is like",
    sentence:
      "Alastair Brede ran the council without a majority for two years and says the trick is a short list.",
    byline: MALIK,
  },
  {
    id: "toll-plan",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Bridge loan",
    headline: "Toll plan for new bridge put at £1.20 a crossing",
    sentence:
      "Residents of the two bridge wards would pay half, under a draft scheme seen by the Ledger.",
    byline: PRIYA,
  },
  {
    id: "polling-staff",
    shown: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Saltgate vote",
    headline: "Council still needs forty polling staff",
    sentence:
      "Clerks are paid £210 for the day and the evening count, and training takes one Saturday morning.",
    byline: MALIK,
  },
]

const FIRST_SHOWN = 8
const PAGE_SIZE = 6

const MOST_READ = [
  "Majority gone as two walk out on bridge loan",
  "What the bridge loan would cost each household",
  "Why we walked out: the two who broke the group",
  "Fare rise on harbour routes paused",
  "Three names on the Saltgate ballot",
]

function storiesWord(n: number) {
  return n === 1 ? "story" : "stories"
}

function StoryRow({
  story,
  isNew,
  linkRef,
}: {
  story: Story
  isNew: boolean
  linkRef: (el: HTMLAnchorElement | null) => void
}) {
  return (
    <article className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-0">
      <div className="flex flex-wrap items-baseline gap-2 font-mono text-label uppercase tabular-nums md:col-span-2 md:pr-4">
        <time dateTime={story.dateTime} className="text-muted-foreground">
          {story.shown}
        </time>
        {isNew ? <span className="text-primary">New</span> : null}
      </div>
      <div className="flex flex-col gap-2 md:col-span-10">
        {story.picture ? (
          <figure className="flex flex-col gap-2">
            <div
              role="img"
              aria-label={story.picture.label}
              className="aspect-video w-full bg-muted"
            />
            <figcaption className={cn(labelText, "text-muted-foreground")}>
              {story.picture.caption}
            </figcaption>
          </figure>
        ) : null}
        <p className={cn(labelText, "text-foreground")}>{story.kicker}</p>
        <h3 className="text-h2 uppercase">
          <a href="#" ref={linkRef} className={headlineLink}>
            {story.headline}
          </a>
        </h3>
        <p className="max-w-xl text-body">{story.sentence}</p>
        <p className={cn(labelText, "text-muted-foreground")}>
          {story.byline}
        </p>
      </div>
    </article>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const [shown, setShown] = useState(FIRST_SHOWN)
  const [finished, setFinished] = useState(false)
  const [status, setStatus] = useState("")
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const total = STORIES.length

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function loadMore() {
    const firstNew = shown
    const next = Math.min(shown + PAGE_SIZE, total)
    const added = next - shown
    flushSync(() => setShown(next))
    linkRefs.current[firstNew]?.focus()
    if (next >= total) {
      setStatus(`The last ${added} ${storiesWord(added)} shown.`)
      setFinished(true)
    } else {
      setStatus(`${added} more ${storiesWord(added)} shown.`)
    }
  }

  const navLinks = (mobile: boolean) =>
    SECTIONS.map((name) => {
      const current = name === CURRENT_SECTION
      return (
        <li key={name}>
          <a
            href="#"
            aria-current={current ? "page" : undefined}
            className={cn(
              current ? currentLabelLink : labelLink,
              mobile && "block py-2"
            )}
          >
            {name}
          </a>
        </li>
      )
    })

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header onKeyDown={handleHeaderKeyDown}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-2">
            <time
              dateTime="2026-11-11"
              className={cn(labelText, "text-muted-foreground tabular-nums")}
            >
              Wednesday 11 November 2026
            </time>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
            >
              Subscribe
            </a>
          </div>

          <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:border-b-0">
            <a href="/" className={mastheadLink}>
              {PAPER}
            </a>
            <Button
              ref={menuButtonRef}
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
            <ul>{navLinks(true)}</ul>
          </nav>

          <nav aria-label="Sections" className="hidden border-y py-2 md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">{navLinks(false)}</ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-2 border-t-2 pt-2">
            <h1 className="text-h2 uppercase md:text-h1">Politics</h1>
            <p className="max-w-xl text-body">
              Port Avery's council, its votes and its money, the Saltgate ward
              by-election and the people who run the city.
            </p>
          </div>

          <article className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <div className="flex flex-col gap-4 lg:col-span-7 lg:pr-6">
              <p className={cn(labelText, "text-foreground")}>Council</p>
              <h2 className="text-h1 uppercase md:text-display">
                <a href="#" className={headlineLink}>
                  Majority gone
                </a>
              </h2>
              <p className="max-w-3xl font-sans text-h2 font-normal">
                Two councillors walk out of the ruling group over the £48m
                bridge loan, leaving Margit Holloway's Harbour Alliance one
                vote short on the council floor.
              </p>
              <p
                className={cn(
                  labelText,
                  "text-muted-foreground tabular-nums"
                )}
              >
                By Malik Osei · <time dateTime="2026-11-11T07:50">07:50</time>
              </p>
            </div>
            <figure className="flex flex-col gap-2 lg:col-span-5">
              <div
                role="img"
                aria-label="The council chamber from the public gallery, its curved rows of green benches half empty"
                className="aspect-3/2 w-full bg-muted"
              />
              <figcaption className={cn(labelText, "text-muted-foreground")}>
                The council chamber after Tuesday's vote · Photograph: Ines
                Varga
              </figcaption>
            </figure>
          </article>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <section
              aria-labelledby="latest-heading"
              className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6"
            >
              <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
                <h2
                  id="latest-heading"
                  className="font-mono text-label text-foreground uppercase"
                >
                  Latest
                </h2>
              </div>

              <ul className="flex flex-col gap-4">
                {STORIES.slice(0, shown).map((story, index) => (
                  <li
                    key={story.id}
                    className={index > 0 ? "border-t pt-4" : undefined}
                  >
                    <StoryRow
                      story={story}
                      isNew={index === 0}
                      linkRef={(el) => {
                        linkRefs.current[index] = el
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4 border-t pt-4">
                {finished ? (
                  <p className="max-w-xl text-body">
                    That is every Politics story from the last four days.
                  </p>
                ) : (
                  <Button
                    variant="secondary"
                    className={buttonClasses}
                    onClick={loadMore}
                  >
                    Load more
                  </Button>
                )}
                <p
                  className={cn(
                    labelText,
                    "text-muted-foreground tabular-nums"
                  )}
                >
                  Showing {shown} of {total}
                </p>
                <p role="status" className="sr-only">
                  {status}
                </p>
              </div>
            </section>

            <section
              aria-labelledby="most-read-heading"
              className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6"
            >
              <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
                <h2
                  id="most-read-heading"
                  className="font-mono text-label text-foreground uppercase"
                >
                  Most read
                </h2>
              </div>
              <ol role="list" className="flex flex-col gap-4">
                {MOST_READ.map((headline, index) => (
                  <li
                    key={headline}
                    className={cn(
                      "flex items-baseline gap-4",
                      index > 0 && "border-t pt-4"
                    )}
                  >
                    <span className="w-8 shrink-0 font-mono text-h2 text-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <h3 className="font-heading text-body font-bold uppercase">
                      <a href="#" className={headlineLink}>
                        {headline}
                      </a>
                    </h3>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
          <a href="/" className={cn(mastheadLink, "self-start")}>
            {PAPER}
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {SECTIONS.map((name) => (
                <li key={name}>
                  <a href="#" className={labelLink}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(labelText, "text-muted-foreground")}>
            © 2026 {PAPER} · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
