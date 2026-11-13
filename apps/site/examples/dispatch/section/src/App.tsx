import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const LABEL = "font-mono text-label uppercase"

const LABEL_LINK = `${LABEL} text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const HEADLINE_LINK = `text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const MASTHEAD = `font-heading text-h2 uppercase text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const BUTTON = "h-auto px-4 py-2 font-mono text-label uppercase"

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
const CURRENT = "Politics"

const FIRST_SHOWN = 8
const STEP = 6

type Picture = {
  label: string
  caption: string
}

type Story = {
  id: string
  dateTime: string
  when: string
  kicker: string
  headline: string
  sentence: string
  byline: string
  picture?: Picture
}

const MALIK = "By Malik Osei"
const PRIYA = "By Priya Venkataraman"

const STORIES: Story[] = [
  {
    id: "fresh-vote",
    dateTime: "2026-11-11T09:40",
    when: "09:40",
    kicker: "Council",
    headline: "Opposition demands fresh vote on bridge loan",
    sentence:
      "The Civic Bloc has tabled a motion to bring the £48m loan back to the chamber on Friday, before the two absent members can be replaced on the finance panel.",
    byline: MALIK,
  },
  {
    id: "saltgate-polls",
    dateTime: "2026-11-11T09:05",
    when: "09:05",
    kicker: "Saltgate",
    headline: "Saltgate goes to the polls with three names on the paper",
    sentence:
      "Polling stations in the ward opened at seven this morning, and the count at the Fenner Road sports hall is expected to finish soon after midnight.",
    byline: PRIYA,
    picture: {
      label:
        "Voters queue outside a polling station in a church hall, under a grey morning sky",
      caption:
        "Voters outside St Brannoc's hall in Saltgate this morning · Photograph: Odile Marsh",
    },
  },
  {
    id: "fare-rise-hold",
    dateTime: "2026-11-11T08:30",
    when: "08:30",
    kicker: "Bus fares",
    headline: "Fare rise put on hold as depot staff threaten strike",
    sentence:
      "Port Avery Transit will not raise the single fare on Monday as planned, after drivers at the Tannery Lane depot voted to ballot for a walkout.",
    byline: MALIK,
  },
  {
    id: "brandl-interview",
    dateTime: "2026-11-11T07:15",
    when: "07:15",
    kicker: "Interview",
    headline: "“I did not walk out lightly”: Tessa Brandl on the loan",
    sentence:
      "One of the two members who left the chamber says she asked for the cost report three times and was shown a summary of a single page.",
    byline: PRIYA,
  },
  {
    id: "pay-panel",
    dateTime: "2026-11-11T06:40",
    when: "06:40",
    kicker: "Council pay",
    headline: "Pay panel backs 4% rise for senior officers",
    sentence:
      "The panel says the eleven most senior posts have fallen behind those in towns of the same size, a finding the staff unions reject.",
    byline: PRIYA,
    picture: {
      label:
        "The stone front of Port Avery town hall, with a row of bicycles chained to its railings",
      caption:
        "The town hall on Custom House Square · Photograph: Ruben Castellane",
    },
  },
  {
    id: "hung-chamber",
    dateTime: "2026-11-11T06:10",
    when: "06:10",
    kicker: "Analysis",
    headline: "What a hung chamber means for the winter budget",
    sentence:
      "Without a majority the Harbour Alliance needs at least one vote from another group for every line of a budget that is due in five weeks.",
    byline: MALIK,
  },
  {
    id: "harbour-board",
    dateTime: "2026-11-10",
    when: "Tue 10 Nov",
    kicker: "Harbour",
    headline: "Harbour board seats stay empty after tied vote",
    sentence:
      "Two seats on the board that runs the commercial docks will stay vacant until January, after members split evenly on both nominees.",
    byline: PRIYA,
  },
  {
    id: "ward-debate",
    dateTime: "2026-11-10",
    when: "Tue 10 Nov",
    kicker: "Saltgate",
    headline: "Rival camps clash over ferry pier at ward debate",
    sentence:
      "All three candidates promised to reopen the Saltgate pier, and none of them could say who would pay for the repairs.",
    byline: PRIYA,
  },
  {
    id: "fare-names",
    dateTime: "2026-11-10",
    when: "Tue 10 Nov",
    kicker: "Bus fares",
    headline: "Riders hand in 6,000 names against the fare rise",
    sentence:
      "A petition started at a single stop on Marrow Hill was carried into the town hall in four boxes on Tuesday afternoon.",
    byline: MALIK,
  },
  {
    id: "vote-delayed",
    dateTime: "2026-11-10",
    when: "Tue 10 Nov",
    kicker: "Council",
    headline: "Leader delays bridge loan vote by a day",
    sentence:
      "Council leader Corin Aldous moved the vote from Tuesday to Wednesday morning, saying two of his members were still reading the papers.",
    byline: MALIK,
  },
  {
    id: "treasurer",
    dateTime: "2026-11-10",
    when: "Tue 10 Nov",
    kicker: "Interview",
    headline: "The treasurer who says the city can still borrow",
    sentence:
      "Nuala Verrin has run the council's books for nine years, and she argues that its debt is lower than it was when she started.",
    byline: PRIYA,
  },
  {
    id: "tone-deaf",
    dateTime: "2026-11-09",
    when: "Mon 9 Nov",
    kicker: "Council pay",
    headline: "Unions call officer pay plan “tone deaf”",
    sentence:
      "The two largest staff unions say a rise for directors cannot be argued for in the same month that library hours were put up for cuts.",
    byline: PRIYA,
  },
  {
    id: "quayside-flats",
    dateTime: "2026-11-09",
    when: "Mon 9 Nov",
    kicker: "Planning",
    headline: "Quayside flats approved by a single vote",
    sentence:
      "The planning panel passed the 212 flats on the old grain wharf by five votes to four, with a tenth of them at a reduced rent.",
    byline: MALIK,
  },
  {
    id: "postal-ballots",
    dateTime: "2026-11-09",
    when: "Mon 9 Nov",
    kicker: "Saltgate",
    headline: "Postal ballots up a third in Saltgate ward",
    sentence:
      "The returning officer has had 1,940 postal votes back so far, against 1,450 at the same point before the last full election.",
    byline: PRIYA,
  },
  {
    id: "loan-warning",
    dateTime: "2026-11-09",
    when: "Mon 9 Nov",
    kicker: "Council",
    headline: "Two in ruling group warn they may not back loan",
    sentence:
      "Tessa Brandl and Joss Penhale wrote to the leader on Monday to say they would not vote for a loan whose full cost they had not seen.",
    byline: MALIK,
  },
  {
    id: "transit-chief",
    dateTime: "2026-11-09",
    when: "Mon 9 Nov",
    kicker: "Bus fares",
    headline: "Transit chief defends 30p rise at town hall",
    sentence:
      "Halvard Brock told the transport panel that fuel and wages had risen by more than fares in each of the last three years.",
    byline: MALIK,
  },
  {
    id: "mayor-interview",
    dateTime: "2026-11-08",
    when: "Sun 8 Nov",
    kicker: "Interview",
    headline: "Mayor Ilse Hargrove: “The bridge cannot wait”",
    sentence:
      "The mayor has no vote in the chamber, but she says a second winter of weight limits on Kessel Street would cost the port its grain trade.",
    byline: PRIYA,
  },
  {
    id: "ward-tip",
    dateTime: "2026-11-08",
    when: "Sun 8 Nov",
    kicker: "Saltgate",
    headline: "Why a ward of 9,000 could tip the chamber",
    sentence:
      "The ruling group went into the week with a majority of one, which makes the empty Saltgate seat worth more than any other in the city.",
    byline: PRIYA,
  },
  {
    id: "library-hours",
    dateTime: "2026-11-08",
    when: "Sun 8 Nov",
    kicker: "Libraries",
    headline: "Sunday hours saved at four branch libraries",
    sentence:
      "A plan to close the Marrow Hill, Saltgate, Eastmoor and Fenner Road branches on Sundays was dropped after a week of letters.",
    byline: MALIK,
  },
  {
    id: "loan-papers",
    dateTime: "2026-11-08",
    when: "Sun 8 Nov",
    kicker: "Council",
    headline: "Bridge loan papers show cost up by a fifth",
    sentence:
      "Papers seen by the Ledger put the repair of the Kessel Street bridge at £48m, up from the £40m that members were told in the spring.",
    byline: MALIK,
  },
]

const MOST_READ = [
  "Majority gone: ruling group loses the bridge loan vote",
  "Fare rise put on hold as depot staff threaten strike",
  "“I did not walk out lightly”: Tessa Brandl on the loan",
  "Bridge loan papers show cost up by a fifth",
  "Why a ward of 9,000 could tip the chamber",
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
              LABEL_LINK,
              block && "block py-2",
              name === current && "underline decoration-2"
            )}
          >
            {name}
          </a>
        </li>
      ))}
    </>
  )
}

function StoryPicture({
  picture,
  ratio,
}: {
  picture: Picture
  ratio: "aspect-3/2" | "aspect-video"
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={picture.label}
        className={cn("w-full bg-muted", ratio)}
      />
      <figcaption className={`${LABEL} text-muted-foreground`}>
        {picture.caption}
      </figcaption>
    </figure>
  )
}

function SectionHead({ name }: { name: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2 className={`${LABEL} text-foreground`}>{name}</h2>
    </div>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const [shown, setShown] = useState(FIRST_SHOWN)
  const [focusAt, setFocusAt] = useState<number | null>(null)
  const [status, setStatus] = useState("")
  const firstAdded = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (focusAt !== null) {
      firstAdded.current?.focus()
    }
  }, [focusAt])

  const total = STORIES.length
  const allShown = shown >= total

  function loadMore() {
    const added = Math.min(STEP, total - shown)
    if (added <= 0) {
      return
    }

    const noun = added === 1 ? "story" : "stories"
    setStatus(
      shown + added >= total
        ? `The last ${added} ${noun} shown.`
        : `${added} more ${noun} shown.`
    )
    setFocusAt(shown)
    setShown(shown + added)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-2">
            <time
              dateTime="2026-11-11"
              className={`${LABEL} text-muted-foreground tabular-nums`}
            >
              Wednesday 11 November 2026
            </time>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "default" }), BUTTON)}
            >
              Subscribe
            </a>
          </div>

          <div className="flex items-center justify-between gap-4 border-t-2 py-4">
            <a href="/" className={MASTHEAD}>
              {PAPER}
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn(BUTTON, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="sections-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>

          <nav aria-label="Sections" className="hidden border-y py-2 md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks current={CURRENT} />
            </ul>
          </nav>

          <nav
            id="sections-menu"
            aria-label="Sections"
            hidden={!menuOpen}
            className="border-b py-2 md:hidden"
          >
            <ul>
              <SectionLinks current={CURRENT} block />
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-2 border-t-2 pt-2">
            <h1 className="text-h2 uppercase md:text-h1">Politics</h1>
            <p className="max-w-xl text-body">
              The council, its wards and its money: every vote, every row and
              the people behind them, reported from Port Avery town hall.
            </p>
          </div>

          <article className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <div className="flex flex-col gap-4 lg:col-span-7 lg:pr-6">
              <p className={`${LABEL} text-foreground`}>Council</p>
              <h2 className="text-h1 uppercase md:text-display">
                <a href="#" className={HEADLINE_LINK}>
                  Majority gone
                </a>
              </h2>
              <p className="max-w-3xl font-sans text-h2 font-normal">
                Two members of the ruling Harbour Alliance walked out before
                the vote on the £48m Kessel Street bridge loan, and the group
                lost it by one.
              </p>
              <p className={`${LABEL} text-muted-foreground`}>
                By Malik Osei ·{" "}
                <time dateTime="2026-11-11T07:50" className="tabular-nums">
                  07:50
                </time>
              </p>
            </div>
            <div className="lg:col-span-5">
              <StoryPicture
                ratio="aspect-3/2"
                picture={{
                  label:
                    "The council chamber during the vote, with two empty seats in the front bench of the ruling group",
                  caption:
                    "Two empty seats in the council chamber on Wednesday morning · Photograph: Odile Marsh",
                }}
              />
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <section className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6">
              <SectionHead name="Latest" />

              <ul className="flex flex-col gap-4">
                {STORIES.slice(0, shown).map((story, index) => (
                  <li
                    key={story.id}
                    className={index > 0 ? "border-t pt-4" : undefined}
                  >
                    <article className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-0">
                      <div className="flex flex-wrap items-baseline gap-2 md:col-span-2 md:pr-4">
                        <time
                          dateTime={story.dateTime}
                          className={`${LABEL} text-muted-foreground tabular-nums`}
                        >
                          {story.when}
                        </time>
                        {index === 0 && (
                          <span className={`${LABEL} text-primary`}>New</span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-2 md:col-span-10">
                        {story.picture && (
                          <StoryPicture
                            ratio="aspect-video"
                            picture={story.picture}
                          />
                        )}
                        <p className={`${LABEL} text-foreground`}>
                          {story.kicker}
                        </p>
                        <h3 className="text-h2 uppercase">
                          <a
                            href="#"
                            ref={index === focusAt ? firstAdded : undefined}
                            className={HEADLINE_LINK}
                          >
                            {story.headline}
                          </a>
                        </h3>
                        <p className="max-w-xl text-body">{story.sentence}</p>
                        <p className={`${LABEL} text-muted-foreground`}>
                          {story.byline}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4 border-t pt-4">
                {allShown ? (
                  <p className="text-body">
                    That is every Politics story from the last four days.
                  </p>
                ) : (
                  <Button
                    variant="secondary"
                    className={BUTTON}
                    onClick={loadMore}
                  >
                    Load more
                  </Button>
                )}
                <p className={`${LABEL} text-muted-foreground tabular-nums`}>
                  Showing {shown} of {total}
                </p>
                <p role="status" className="sr-only">
                  {status}
                </p>
              </div>
            </section>

            <section className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
              <SectionHead name="Most read" />

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
                      <a href="#" className={HEADLINE_LINK}>
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
          <a href="/" className={`self-start ${MASTHEAD}`}>
            {PAPER}
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks />
            </ul>
          </nav>
          <p className={`${LABEL} text-muted-foreground tabular-nums`}>
            © 2026 The Port Avery Ledger · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
