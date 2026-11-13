import { useRef, useState, type KeyboardEvent } from "react"
import { flushSync } from "react-dom"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const labelLink = cn(
  "font-mono text-label uppercase text-foreground hover:underline underline-offset-4 transition-colors duration-150",
  focusRing
)

const headlineLink = cn(
  "text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150",
  focusRing
)

const mastheadLink = cn(
  "font-heading text-h2 uppercase text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150",
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

type Picture = { alt: string; caption: string }

type Story = {
  id: string
  dateTime: string
  time: string
  isNew?: boolean
  kicker: string
  headline: string
  sentence: string
  author: string
  picture?: Picture
}

const malik = "Malik Osei"
const priya = "Priya Venkataraman"

const stories: Story[] = [
  {
    id: "emergency-meeting",
    dateTime: "2026-11-11T10:20",
    time: "10:20",
    isNew: true,
    kicker: "Council",
    headline: "Mayor calls emergency meeting for Friday",
    sentence:
      "Ines Calloway wants a fresh vote on the bridge loan before the lenders' deadline on Monday.",
    author: priya,
  },
  {
    id: "walkout-pair",
    dateTime: "2026-11-11T09:40",
    time: "09:40",
    kicker: "Interview",
    headline: "Walkout pair: we were not told the real cost",
    sentence:
      "Ruth Abara and Denis Kell say the loan papers left out £14m in interest over twenty years.",
    author: malik,
    picture: {
      alt: "Two councillors in winter coats standing on the steps of Harbour Hall, talking to reporters",
      caption:
        "Ruth Abara and Denis Kell outside Harbour Hall on Tuesday · Photograph: Tomas Rennick",
    },
  },
  {
    id: "saltgate-hustings",
    dateTime: "2026-11-11T08:55",
    time: "08:55",
    kicker: "Saltgate by-election",
    headline: "Saltgate candidates face voters at the library",
    sentence:
      "Five candidates took questions for two hours, most of them about the closed swimming baths.",
    author: priya,
  },
  {
    id: "fare-pause",
    dateTime: "2026-11-11T08:10",
    time: "08:10",
    kicker: "Transport",
    headline: "Bus fare rise put on hold until spring",
    sentence:
      "The transport committee paused the 20p rise after a petition against it passed 9,000 names.",
    author: malik,
  },
  {
    id: "cabinet-pay",
    dateTime: "2026-11-11T07:15",
    time: "07:15",
    kicker: "Council pay",
    headline: "Pay rise for cabinet goes to review panel",
    sentence:
      "An independent panel will decide whether cabinet members get the 11 per cent rise their group proposed.",
    author: priya,
  },
  {
    id: "loan-uproar",
    dateTime: "2026-11-10",
    time: "Tue 10 Nov",
    kicker: "Council",
    headline: "Bridge loan vote ends in uproar",
    sentence:
      "The meeting was suspended twice before the motion fell by one vote just after 22:00.",
    author: malik,
    picture: {
      alt: "A packed public gallery above the council chamber, with people standing and holding paper signs",
      caption:
        "The public gallery at Harbour Hall during the loan debate · Photograph: Tomas Rennick",
    },
  },
  {
    id: "alliance-split",
    dateTime: "2026-11-10",
    time: "Tue 10 Nov",
    kicker: "Analysis",
    headline: "How one bridge split the Harbour Alliance",
    sentence:
      "The group has argued over the Kessel Street crossing since it won control of the council three years ago.",
    author: malik,
  },
  {
    id: "greens-pick-nurse",
    dateTime: "2026-11-10",
    time: "Tue 10 Nov",
    kicker: "Saltgate by-election",
    headline: "Greens pick nurse to fight Saltgate seat",
    sentence:
      "Amara Sule, who works night shifts at Port Avery General, was chosen by 40 local members.",
    author: priya,
  },
  {
    id: "night-buses",
    dateTime: "2026-11-10",
    time: "Tue 10 Nov",
    kicker: "Transport",
    headline: "Night buses to stop at midnight from January",
    sentence:
      "The operator says it can no longer staff the late routes at the fare the council pays it.",
    author: malik,
  },
  {
    id: "staff-pay",
    dateTime: "2026-11-10",
    time: "Tue 10 Nov",
    kicker: "Council pay",
    headline: "Union says staff wait longer than cabinet",
    sentence:
      "Office workers at the council have had no rise since 2024, the Civic Staff Union says.",
    author: priya,
  },
  {
    id: "opposition-leader",
    dateTime: "2026-11-09",
    time: "Mon 9 Nov",
    kicker: "Interview",
    headline: "Opposition leader: I am ready to govern",
    sentence:
      "Hal Brenner of the Harbour Independents says he could form a ruling group within a week.",
    author: malik,
  },
  {
    id: "budget-gap",
    dateTime: "2026-11-09",
    time: "Mon 9 Nov",
    kicker: "Budget",
    headline: "Council warns of £9m gap next year",
    sentence:
      "The finance director told members that reserves would run out by 2028 without new cuts.",
    author: priya,
  },
  {
    id: "polling-cards",
    dateTime: "2026-11-09",
    time: "Mon 9 Nov",
    kicker: "Saltgate by-election",
    headline: "Polling cards sent to 11,400 Saltgate voters",
    sentence:
      "The vote is on Thursday 3 December, and postal votes must be back by 25 November.",
    author: priya,
  },
  {
    id: "dock-flats",
    dateTime: "2026-11-09",
    time: "Mon 9 Nov",
    kicker: "Housing",
    headline: "Dock flats plan returns with fewer homes",
    sentence:
      "The developer has cut the scheme at Wharf Lane from 320 homes to 240 after objections.",
    author: malik,
  },
  {
    id: "ferry-fares",
    dateTime: "2026-11-09",
    time: "Mon 9 Nov",
    kicker: "Transport",
    headline: "Fare row reaches the harbour ferry",
    sentence:
      "Ferry users say a planned 30p rise would hit commuters from the north shore hardest.",
    author: malik,
  },
  {
    id: "never-misses",
    dateTime: "2026-11-08",
    time: "Sun 8 Nov",
    kicker: "Interview",
    headline: "The councillor who never misses a meeting",
    sentence:
      "Olu Fenwick has sat through 412 meetings in a row since 2011 and keeps every agenda.",
    author: priya,
  },
  {
    id: "whips",
    dateTime: "2026-11-08",
    time: "Sun 8 Nov",
    kicker: "Council",
    headline: "Ruling group whips told to count heads",
    sentence:
      "Party managers spent the weekend phoning members ahead of Tuesday's loan vote.",
    author: malik,
  },
  {
    id: "saltgate-pledges",
    dateTime: "2026-11-08",
    time: "Sun 8 Nov",
    kicker: "Saltgate by-election",
    headline: "Saltgate ward: what the candidates promise",
    sentence:
      "From the baths to parking on Mill Road, here are the five pledges on the ballot.",
    author: priya,
  },
  {
    id: "allowances",
    dateTime: "2026-11-08",
    time: "Sun 8 Nov",
    kicker: "Council pay",
    headline: "Allowance claims to be published online",
    sentence:
      "Every member's expenses will go on the council website from January, the clerk says.",
    author: malik,
  },
  {
    id: "library-hours",
    dateTime: "2026-11-08",
    time: "Sun 8 Nov",
    kicker: "Budget",
    headline: "Library hours cut in three wards",
    sentence:
      "Saltgate, Dockside and Upper Fenn libraries will close on Mondays from next month.",
    author: priya,
  },
]

const mostRead = [
  "Majority gone as two walk out of loan vote",
  "Walkout pair: we were not told the real cost",
  "Bus fare rise put on hold until spring",
  "Bridge loan vote ends in uproar",
  "Council warns of £9m gap next year",
]

const INITIAL = 8
const STEP = 6

function storiesWord(n: number) {
  return n === 1 ? "story" : "stories"
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2 className="font-mono text-label text-foreground uppercase">
        {title}
      </h2>
    </div>
  )
}

function Figure({
  picture,
  aspect,
}: {
  picture: Picture
  aspect: "aspect-3/2" | "aspect-video"
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={picture.alt}
        className={cn(aspect, "w-full bg-muted")}
      />
      <figcaption className="font-mono text-label text-muted-foreground uppercase">
        {picture.caption}
      </figcaption>
    </figure>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
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
          <a href="/" className={mastheadLink}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButtonRef}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="section-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>

        <nav
          id="section-menu"
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {sections.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === currentSection ? "page" : undefined}
                  className={cn(
                    labelLink,
                    "block py-2",
                    name === currentSection &&
                      "underline decoration-2 underline-offset-4"
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
            {sections.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  aria-current={name === currentSection ? "page" : undefined}
                  className={cn(
                    labelLink,
                    name === currentSection &&
                      "underline decoration-2 underline-offset-4"
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
        <a href="/" className={cn(mastheadLink, "self-start")}>
          The Port Avery Ledger
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((name) => (
              <li key={name}>
                <a href="#" className={labelLink}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

function StoryRow({
  story,
  linkRef,
}: {
  story: Story
  linkRef: (el: HTMLAnchorElement | null) => void
}) {
  return (
    <article className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-0">
      <div className="md:col-span-2 md:pr-4">
        <p className="flex flex-wrap items-baseline gap-2 font-mono text-label uppercase tabular-nums">
          <time dateTime={story.dateTime} className="text-muted-foreground">
            {story.time}
          </time>
          {story.isNew && <span className="text-primary">New</span>}
        </p>
      </div>
      <div className="flex flex-col gap-2 md:col-span-10">
        {story.picture && (
          <Figure picture={story.picture} aspect="aspect-video" />
        )}
        <p className="font-mono text-label text-foreground uppercase">
          {story.kicker}
        </p>
        <h3 className="text-h2 uppercase">
          <a href="#" ref={linkRef} className={headlineLink}>
            {story.headline}
          </a>
        </h3>
        <p className="max-w-xl text-body text-foreground">{story.sentence}</p>
        <p className="font-mono text-label text-muted-foreground uppercase">
          By {story.author}
        </p>
      </div>
    </article>
  )
}

export function App() {
  const [visible, setVisible] = useState(INITIAL)
  const [allShown, setAllShown] = useState(false)
  const [status, setStatus] = useState("")
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())

  const total = stories.length

  function loadMore() {
    const start = visible
    const end = Math.min(visible + STEP, total)
    const added = end - start
    if (added <= 0) return
    const isLast = end >= total

    flushSync(() => {
      setVisible(end)
      setStatus(
        isLast
          ? added === 1
            ? "The last story shown."
            : `The last ${added} stories shown.`
          : `${added} more ${storiesWord(added)} shown.`
      )
    })

    linkRefs.current.get(stories[start].id)?.focus()

    if (isLast) setAllShown(true)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          {/* Section head */}
          <div className="flex flex-col gap-2 border-t-2 pt-2">
            <h1 className="text-h2 text-foreground uppercase md:text-h1">
              Politics
            </h1>
            <p className="max-w-xl text-body text-foreground">
              Votes, rows and the people who run Port Avery: the council, its
              wards, its budget and the elections that decide who sits in
              Harbour Hall.
            </p>
          </div>

          {/* Lead story */}
          <article className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <div className="flex flex-col gap-4 lg:col-span-7 lg:pr-6">
              <p className="font-mono text-label text-foreground uppercase">
                Council
              </p>
              <h2 className="text-h1 uppercase md:text-display">
                <a href="#" className={headlineLink}>
                  Majority gone
                </a>
              </h2>
              <p className="max-w-3xl font-sans text-h2 font-normal text-foreground">
                Two members of the Harbour Alliance walked out before the bridge
                loan vote, leaving the ruling group a seat short and the £62m
                Kessel Street crossing in doubt.
              </p>
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                By Malik Osei · <time dateTime="2026-11-11T07:50">07:50</time>
              </p>
            </div>
            <div className="lg:col-span-5">
              <Figure
                aspect="aspect-3/2"
                picture={{
                  alt: "The council chamber at Harbour Hall, rows of wooden benches facing the mayor's raised chair, two seats empty",
                  caption:
                    "The council chamber at Harbour Hall after Tuesday's walkout · Photograph: Tomas Rennick",
                }}
              />
            </div>
          </article>

          {/* Stories and most read */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <section className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6">
              <SectionHead title="Latest" />

              <ul className="flex flex-col gap-4">
                {stories.slice(0, visible).map((story, index) => (
                  <li key={story.id} className={cn(index > 0 && "border-t pt-4")}>
                    <StoryRow
                      story={story}
                      linkRef={(el) => {
                        if (el) linkRefs.current.set(story.id, el)
                        else linkRefs.current.delete(story.id)
                      }}
                    />
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4 border-t pt-4">
                {allShown ? (
                  <p className="max-w-xl text-body text-foreground">
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
                <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                  Showing {visible} of {total}
                </p>
                <p role="status" className="sr-only">
                  {status}
                </p>
              </div>
            </section>

            <section className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
              <SectionHead title="Most read" />
              <ol role="list" className="flex flex-col gap-4">
                {mostRead.map((headline, index) => (
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

      <SiteFooter />
    </div>
  )
}

export default App
