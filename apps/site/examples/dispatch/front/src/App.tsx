import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headlineLink = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const labelLink = cn(
  "font-mono text-label text-foreground uppercase underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const mastheadLink = cn(
  "font-heading text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"

const label = "font-mono text-label uppercase"

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

type Picture = {
  scene: string
  caption: string
}

type Story = {
  kicker: string
  headline: string
  summary: string
  byline: string
  time: string
  dateTime: string
  picture?: Picture
  extra?: ReactNode
}

const sideStories: Story[] = [
  {
    kicker: "Traffic",
    headline: "Buses rerouted across the river",
    summary:
      "Three routes now cross at the Mill Lane bridge, adding up to twenty minutes to the morning run.",
    byline: "Priya Venkataraman",
    time: "08:10",
    dateTime: "2026-11-11T08:10",
    picture: {
      scene:
        "A line of red double-decker buses queueing nose to tail on the narrow Mill Lane bridge in morning drizzle.",
      caption: "Buses queue on Mill Lane on Wednesday · Photograph: Odile Marsh",
    },
  },
  {
    kicker: "Health",
    headline: "North bank clinic stays open late",
    summary:
      "The Ferrier Road clinic will open until ten at night while the bridge is shut, so patients need not cross.",
    byline: "Tomas Ekwueme",
    time: "07:45",
    dateTime: "2026-11-11T07:45",
  },
  {
    kicker: "Business",
    headline: "Kessel Street shops count the cost",
    summary:
      "Traders beside the closed crossing say takings fell by a third on the first day without through traffic.",
    byline: "Margit Solberg",
    time: "09:20",
    dateTime: "2026-11-11T09:20",
  },
  {
    kicker: "Weather",
    headline: "Gale warning for the harbour",
    summary:
      "Forecasters expect gusts of 60mph along the waterfront from early on Thursday morning.",
    byline: "Owen Tallis",
    time: "10:05",
    dateTime: "2026-11-11T10:05",
  },
  {
    kicker: "Schools",
    headline: "Early ferry added for pupils",
    summary:
      "Children from the south bank will cross on a 07:30 boat that the council has agreed to pay for until June.",
    byline: "Ruth Adeyemi",
    time: "11:30",
    dateTime: "2026-11-11T11:30",
  },
]

const sectionBlocks: {
  name: string
  more: string
  stories: Story[]
}[] = [
  {
    name: "Politics",
    more: "All politics",
    stories: [
      {
        kicker: "Budget",
        headline: "Opposition sets out rival budget",
        summary:
          "The Civic Alliance would freeze parking charges and pay for it by selling two council car parks.",
        byline: "Daniel Okafor",
        time: "09:05",
        dateTime: "2026-11-11T09:05",
        picture: {
          scene:
            "A woman in a dark coat speaks at a lectern in the wood-panelled council chamber, papers in hand.",
          caption:
            "Alliance leader June Harlow at the town hall · Photograph: Ben Calloway",
        },
      },
      {
        kicker: "Election",
        headline: "Westmere ward votes on 4 December",
        summary:
          "Voters in Westmere will choose a new councillor after Alan Brecker stood down in October.",
        byline: "Samira Holt",
        time: "10:40",
        dateTime: "2026-11-11T10:40",
        picture: {
          scene:
            "A polling station sign tied to the railings outside a red-brick primary school on a grey morning.",
          caption:
            "The polling station at Westmere Primary · Photograph: Ben Calloway",
        },
      },
      {
        kicker: "Council pay",
        headline: "Row over 9% rise in council pay",
        summary:
          "Opposition members say the rise should wait until the bridge repair has been paid for.",
        byline: "Daniel Okafor",
        time: "12:15",
        dateTime: "2026-11-11T12:15",
        picture: {
          scene:
            "Councillors seated in rows in the chamber, several raising their hands in a vote.",
          caption: "Tuesday's finance committee vote · Photograph: Ines Varga",
        },
      },
    ],
  },
  {
    name: "Sport",
    more: "All sport",
    stories: [
      {
        kicker: "Football",
        headline: "Harriers take the derby at home",
        summary:
          "Port Avery Harriers beat Saltgate United with a header from Tobias Wren two minutes from time.",
        byline: "Luca Ferrante",
        time: "08:30",
        dateTime: "2026-11-11T08:30",
        picture: {
          scene:
            "A footballer in a blue shirt runs towards a packed stand with both arms raised under floodlights.",
          caption:
            "Tobias Wren celebrates his winner at Dock Road · Photograph: Nell Ashby",
        },
        extra: (
          <>
            {" · "}
            <a href="#" className={labelLink}>
              Results
            </a>
          </>
        ),
      },
      {
        kicker: "Swimming",
        headline: "Teenager breaks city pool record",
        summary:
          "Ada Fennimore, 17, swam the 200m butterfly in 2:09.4 at the harbour pool, a second inside the old mark.",
        byline: "Greta Lund",
        time: "Tue 10 Nov",
        dateTime: "2026-11-10",
        picture: {
          scene:
            "A swimmer in a white cap mid-stroke in a lane of an indoor pool, spray rising around her arms.",
          caption:
            "Ada Fennimore in the butterfly final · Photograph: Nell Ashby",
        },
      },
      {
        kicker: "Football",
        headline: "Westmere name a new manager",
        summary:
          "Westmere Athletic have appointed their former captain Rhys Calder on a two-year contract.",
        byline: "Luca Ferrante",
        time: "13:05",
        dateTime: "2026-11-11T13:05",
        picture: {
          scene:
            "A man in a club tracksuit holds up a scarf beside the dugout of an empty stadium.",
          caption:
            "Rhys Calder at Westmere Park on Wednesday · Photograph: Nell Ashby",
        },
      },
    ],
  },
  {
    name: "City",
    more: "All city",
    stories: [
      {
        kicker: "Markets",
        headline: "Last week for the quayside market",
        summary:
          "The fish market closes on Saturday after seventy years, before the site is rebuilt as housing.",
        byline: "Margit Solberg",
        time: "07:50",
        dateTime: "2026-11-11T07:50",
        picture: {
          scene:
            "Crates of fish on ice under a striped awning on the quayside, with stallholders in rubber aprons.",
          caption: "Early trade on the quayside · Photograph: Odile Marsh",
        },
      },
      {
        kicker: "Ferries",
        headline: "Ferry to run every 15 minutes",
        summary:
          "The cross-river ferry adds peak sailings from Monday for drivers who used the bridge.",
        byline: "Owen Tallis",
        time: "11:10",
        dateTime: "2026-11-11T11:10",
        picture: {
          scene:
            "A small white passenger ferry pulling away from a wooden jetty, with the city skyline behind it.",
          caption: "The ferry leaves Pier Street · Photograph: Ines Varga",
        },
      },
      {
        kicker: "Housing",
        headline: "Winter night shelter opens",
        summary:
          "The shelter in the old Harbour Board offices has 60 beds and opens every evening until March.",
        byline: "Ruth Adeyemi",
        time: "14:20",
        dateTime: "2026-11-11T14:20",
        picture: {
          scene:
            "Rows of camp beds with folded grey blankets in a high-ceilinged hall lit by tall windows.",
          caption:
            "Beds in the former Harbour Board offices · Photograph: Ines Varga",
        },
      },
    ],
  },
]

function Figure({
  picture,
  aspect = "aspect-3/2",
}: {
  picture: Picture
  aspect?: string
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={picture.scene}
        className={cn(aspect, "w-full bg-muted")}
      />
      <figcaption className={cn(label, "text-muted-foreground")}>
        {picture.caption}
      </figcaption>
    </figure>
  )
}

function LabelLine({ story }: { story: Story }) {
  return (
    <p className={cn(label, "text-muted-foreground tabular-nums")}>
      By {story.byline} · <time dateTime={story.dateTime}>{story.time}</time>
      {story.extra}
    </p>
  )
}

function Masthead({ className }: { className?: string }) {
  return (
    <a href="/" className={cn(mastheadLink, className)}>
      The Port Avery Ledger
    </a>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header onKeyDown={onHeaderKeyDown}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-2">
            <time
              dateTime="2026-11-11"
              className={cn(label, "text-muted-foreground tabular-nums")}
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

          <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:justify-center md:border-b-0">
            <Masthead className="text-h2 md:text-h1" />
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
              {sections.map((name) => (
                <li key={name}>
                  <a href="#" className={cn(labelLink, "block py-2")}>
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
                  <a href="#" className={labelLink}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <article className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
              <div className="flex items-center gap-2">
                <p className={cn(label, "text-foreground")}>Transport</p>
                <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                  Exclusive
                </Badge>
              </div>
              <h1 className="text-h1 uppercase md:text-display">
                <a href="#" className={headlineLink}>
                  Bridge shut for six months
                </a>
              </h1>
              <p className="max-w-3xl font-sans text-h2 font-normal">
                Inspectors found cracked bearings under the Kessel Street
                Bridge, the city&apos;s main river crossing, and the council
                votes tonight on a £48m repair.
              </p>
              <p className={cn(label, "text-muted-foreground tabular-nums")}>
                By Hana Lindqvist ·{" "}
                <time dateTime="2026-11-11T06:15">06:15</time>
              </p>
              <Figure
                picture={{
                  scene:
                    "Steel barriers and a police van block the approach to the Kessel Street Bridge at dusk, the empty deck stretching across the river behind them.",
                  caption:
                    "Barriers across the Kessel Street Bridge on Tuesday · Photograph: Odile Marsh",
                }}
              />
            </article>

            <section className="border-t pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <h2 className="sr-only">More top stories</h2>
              <ul className="flex flex-col gap-4">
                {sideStories.map((story, index) => (
                  <li
                    key={story.headline}
                    className={index > 0 ? "border-t pt-4" : undefined}
                  >
                    <article className="flex flex-col gap-2">
                      {story.picture && (
                        <Figure picture={story.picture} aspect="aspect-video" />
                      )}
                      <p className={cn(label, "text-foreground")}>
                        {story.kicker}
                      </p>
                      <h3 className="font-heading text-body font-bold uppercase">
                        <a href="#" className={headlineLink}>
                          {story.headline}
                        </a>
                      </h3>
                      <p className="max-w-xl">{story.summary}</p>
                      <LabelLine story={story} />
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="flex flex-col gap-2 border bg-card p-4 md:flex-row md:flex-wrap md:items-baseline md:gap-x-6 md:gap-y-2 md:p-6">
            <h2 className="inline-flex items-center gap-2 font-mono text-label text-primary uppercase">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-primary"
              />
              Live
            </h2>
            <h3 className="font-heading text-body font-bold uppercase">
              <a href="#" className={headlineLink}>
                Bridge vote: council meets at 18:00
              </a>
            </h3>
            <p className="flex items-baseline gap-2 md:flex-1">
              <time
                dateTime="2026-11-11T17:30"
                className={cn(label, "text-muted-foreground tabular-nums")}
              >
                17:30
              </time>
              <span className="max-w-xl text-body">
                Councillors are arriving at the town hall, where traders from
                both banks have gathered on the steps.
              </span>
            </p>
          </section>

          {sectionBlocks.map((block) => (
            <section key={block.name} className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
                <h2 className={cn(label, "text-foreground")}>{block.name}</h2>
                <a href="#" className={labelLink}>
                  {block.more}
                </a>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
                {block.stories.map((story, index) => (
                  <article
                    key={story.headline}
                    className={cn(
                      "flex flex-col gap-2",
                      index > 0 &&
                        "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
                      index < block.stories.length - 1 && "md:pr-6"
                    )}
                  >
                    {story.picture && <Figure picture={story.picture} />}
                    <p className={cn(label, "text-foreground")}>
                      {story.kicker}
                    </p>
                    <h3 className="text-h2 uppercase">
                      <a href="#" className={headlineLink}>
                        {story.headline}
                      </a>
                    </h3>
                    <p className="max-w-xl">{story.summary}</p>
                    <LabelLine story={story} />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
          <Masthead className="self-start text-h2" />
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
          <p className={cn(label, "text-muted-foreground")}>
            © 2026 The Port Avery Ledger · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
