import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const CONTAINER = "mx-auto max-w-[1280px] px-4 md:px-6"

const LABEL = "font-mono text-label uppercase"

const BUTTON = "h-auto px-4 py-2 font-mono text-label uppercase"

const HEADLINE_LINK = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const LABEL_LINK = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

const MASTHEAD = cn(
  "font-heading text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)

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

type When = { text: string; dateTime: string }

type Picture = { alt: string; caption: string; credit: string }

type Story = {
  kicker: string
  headline: string
  sentence: string
  byline: string
  when: When
  picture?: Picture
  labelLink?: string
}

const today = (time: string): When => ({
  text: time,
  dateTime: `2026-11-11T${time}`,
})

const TOP_STORIES: Story[] = [
  {
    kicker: "Traffic",
    headline: "Queues reach two miles at North Quay",
    sentence:
      "Drivers heading for the Tannery Road crossing waited up to 50 minutes this morning, in the first full rush hour of the detour.",
    byline: "Priya Venkataraman",
    when: today("08:10"),
    picture: {
      alt: "Two lanes of cars and vans standing still on North Quay, with the river on the left",
      caption: "Traffic on North Quay this morning",
      credit: "Odile Marsh",
    },
  },
  {
    kicker: "Council",
    headline: "Leader faces revolt over £48m bill",
    sentence:
      "Four members of the ruling group say they will not back the repair unless the harbour board pays a share of it.",
    byline: "Tomas Reye",
    when: today("09:40"),
  },
  {
    kicker: "Business",
    headline: "Quay traders ask for rates relief",
    sentence:
      "Shops on Kessel Street say their takings fell by a third on the first day without the bridge.",
    byline: "Marit Okafor",
    when: today("10:25"),
  },
  {
    kicker: "Health",
    headline: "Ambulances get a base south of river",
    sentence:
      "Two crews move to the old depot on Coldharbour Lane today, so that calls south of the river are not held up by the detour.",
    byline: "Elias Brandt",
    when: today("11:05"),
  },
  {
    kicker: "Schools",
    headline: "Bus passes free for 900 pupils",
    sentence:
      "Pupils who walked over the bridge to Saint Orrin's School get a free pass for the 14 bus from Thursday.",
    byline: "Nadia Ferreira",
    when: today("12:30"),
  },
]

const PAGE_SECTIONS: { name: string; all: string; stories: Story[] }[] = [
  {
    name: "Politics",
    all: "All politics",
    stories: [
      {
        kicker: "Budget",
        headline: "Rivals would freeze rents for a year",
        sentence:
          "The opposition's budget plan would hold council rents for twelve months and pay for it by selling the Marlowe Road offices.",
        byline: "Tomas Reye",
        when: today("07:20"),
        picture: {
          alt: "A woman in a grey coat holding a printed budget plan on the steps of the Guildhall",
          caption: "Corin Ashdown at the Guildhall",
          credit: "Lena Voss",
        },
      },
      {
        kicker: "By-election",
        headline: "Eastquay vote set for 3 December",
        sentence:
          "Voters in Eastquay ward choose a new councillor on Thursday 3 December, after Bram Holloway stood down in October.",
        byline: "Marit Okafor",
        when: today("09:05"),
        picture: {
          alt: "The brick front of Eastquay Library, with a polling station sign by the door",
          caption: "Eastquay Library, a polling station",
          credit: "Odile Marsh",
        },
      },
      {
        kicker: "Council pay",
        headline: "Row as chief's pay rises by £18,000",
        sentence:
          "Unions call the chief executive's rise an insult in a year when the council froze the pay of 1,400 staff.",
        byline: "Hana Lindqvist",
        when: today("11:45"),
        picture: {
          alt: "Union members with banners outside the council offices on Marlowe Road",
          caption: "Union members on Marlowe Road",
          credit: "Lena Voss",
        },
      },
    ],
  },
  {
    name: "Sport",
    all: "All sport",
    stories: [
      {
        kicker: "Football",
        headline: "Harriers take derby with late goal",
        sentence:
          "Port Avery Harriers beat Saltgate United 2-1 at Mill Lane on Tuesday night, after Jory Pell scored in the 88th minute.",
        byline: "Dell Armitage",
        when: today("08:30"),
        labelLink: "Results",
        picture: {
          alt: "A footballer in a striped shirt running towards the crowd with both arms raised",
          caption: "Jory Pell after his goal",
          credit: "Sem Dacre",
        },
      },
      {
        kicker: "Swimming",
        headline: "Teenager breaks city 400m record",
        sentence:
          "Ines Carrow, 17, swam the 400m freestyle in 4:09.31 at the Dockside Pool, the fastest time by a Port Avery swimmer.",
        byline: "Ruth Anselm",
        when: { text: "Tue 10 Nov", dateTime: "2026-11-10" },
        picture: {
          alt: "A swimmer in a white cap resting on the lane rope and looking up at the clock",
          caption: "Ines Carrow at the Dockside Pool",
          credit: "Sem Dacre",
        },
      },
      {
        kicker: "Football",
        headline: "Westmere name Hale as new manager",
        sentence:
          "Westmere Athletic have given Gideon Hale a contract to the end of next season, eight days after Paul Strand left.",
        byline: "Dell Armitage",
        when: today("12:15"),
        picture: {
          alt: "A man in a dark club jacket standing at the edge of an empty pitch",
          caption: "Gideon Hale at Fenner Park",
          credit: "Lena Voss",
        },
      },
    ],
  },
  {
    name: "City",
    all: "All city",
    stories: [
      {
        kicker: "Markets",
        headline: "Last day for the Fish Quay market",
        sentence:
          "The Fish Quay market trades for the last time today after 112 years, before its hall is turned into flats.",
        byline: "Nadia Ferreira",
        when: today("07:50"),
        picture: {
          alt: "A fishmonger weighing mackerel at a stall under the iron roof of the market hall",
          caption: "A stall at the Fish Quay market",
          credit: "Odile Marsh",
        },
      },
      {
        kicker: "Ferries",
        headline: "First ferry moves to 05:40 from Monday",
        sentence:
          "The Saltgate ferry starts 35 minutes earlier and runs every 20 minutes at peak times while the bridge is shut.",
        byline: "Elias Brandt",
        when: today("10:10"),
        picture: {
          alt: "A small white ferry leaving the Saltgate landing stage in grey morning light",
          caption: "The Saltgate ferry at the landing stage",
          credit: "Sem Dacre",
        },
      },
      {
        kicker: "Housing",
        headline: "Night shelter opens with 60 beds",
        sentence:
          "The winter night shelter at Saint Orrin's Hall opens tonight, three weeks earlier than last year.",
        byline: "Priya Venkataraman",
        when: today("13:20"),
        picture: {
          alt: "Rows of made-up camp beds in a church hall with tall windows",
          caption: "Beds at Saint Orrin's Hall",
          credit: "Odile Marsh",
        },
      },
    ],
  },
]

function Figure({
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
        aria-label={picture.alt}
        className={cn("w-full bg-muted", ratio)}
      />
      <figcaption className={cn(LABEL, "text-muted-foreground")}>
        {picture.caption} · Photograph: {picture.credit}
      </figcaption>
    </figure>
  )
}

function LabelLine({ story }: { story: Story }) {
  return (
    <p className={cn(LABEL, "text-muted-foreground")}>
      By {story.byline} ·{" "}
      <time dateTime={story.when.dateTime} className="font-mono tabular-nums">
        {story.when.text}
      </time>
      {story.labelLink ? (
        <>
          {" "}
          ·{" "}
          <a href="#" className={LABEL_LINK}>
            {story.labelLink}
          </a>
        </>
      ) : null}
    </p>
  )
}

function StoryUnit({
  story,
  size,
  ratio,
  className,
}: {
  story: Story
  size: "small" | "h2"
  ratio: "aspect-3/2" | "aspect-video"
  className?: string
}) {
  return (
    <article className={cn("flex flex-col gap-2", className)}>
      {story.picture ? <Figure picture={story.picture} ratio={ratio} /> : null}
      <p className={cn(LABEL, "text-foreground")}>{story.kicker}</p>
      <h3
        className={
          size === "h2"
            ? "text-h2 uppercase"
            : "font-heading text-body font-bold uppercase"
        }
      >
        <a href="#" className={HEADLINE_LINK}>
          {story.headline}
        </a>
      </h3>
      <p className="max-w-xl text-body">{story.sentence}</p>
      <LabelLine story={story} />
    </article>
  )
}

function SectionLinks({ className }: { className: string }) {
  return (
    <>
      {SECTIONS.map((name) => (
        <li key={name}>
          <a href="#" className={cn(LABEL, LABEL_LINK, className)}>
            {name}
          </a>
        </li>
      ))}
    </>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <div className="text-body">
      <header>
        <div className={CONTAINER}>
          <div className="flex items-center justify-between gap-4 py-2">
            <time
              dateTime="2026-11-11"
              className={cn(LABEL, "text-muted-foreground tabular-nums")}
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

          <div className="flex items-center justify-between gap-4 border-t-2 py-4 md:justify-center">
            <a href="/" className={cn(MASTHEAD, "text-h2 md:text-h1")}>
              The Port Avery Ledger
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn(BUTTON, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="section-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>

          <nav aria-label="Sections" className="hidden border-y py-2 md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks className="" />
            </ul>
          </nav>

          <nav
            id="section-menu"
            aria-label="Sections"
            hidden={!menuOpen}
            className="border-b py-2 md:hidden"
          >
            <ul>
              <SectionLinks className="block py-2" />
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className={cn(CONTAINER, "flex flex-col gap-12 pt-6 pb-12")}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <article className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
              <div className="flex items-center gap-2">
                <p className={cn(LABEL, "text-foreground")}>Transport</p>
                <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                  Exclusive
                </Badge>
              </div>
              <h1 className="text-h1 uppercase md:text-display">
                <a href="#" className={HEADLINE_LINK}>
                  Bridge shut for six months
                </a>
              </h1>
              <p className="max-w-3xl font-sans text-h2 font-normal">
                Inspectors found cracked bearings under the Kessel Street
                Bridge, and the council votes tonight on a £48m repair.
              </p>
              <p className={cn(LABEL, "text-muted-foreground")}>
                By Hana Lindqvist ·{" "}
                <time
                  dateTime="2026-11-11T06:15"
                  className="font-mono tabular-nums"
                >
                  06:15
                </time>
              </p>
              <Figure
                ratio="aspect-3/2"
                picture={{
                  alt: "Steel barriers and a road closed sign across the empty roadway of the Kessel Street Bridge",
                  caption: "The Kessel Street Bridge on Tuesday",
                  credit: "Odile Marsh",
                }}
              />
            </article>

            <section
              aria-labelledby="top-stories"
              className="border-t pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
            >
              <h2 id="top-stories" className="sr-only">
                More top stories
              </h2>
              <ul className="flex flex-col gap-4">
                {TOP_STORIES.map((story, index) => (
                  <li
                    key={story.headline}
                    className={index > 0 ? "border-t pt-4" : undefined}
                  >
                    <StoryUnit
                      story={story}
                      size="small"
                      ratio="aspect-video"
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section
            aria-labelledby="live"
            className="flex flex-col gap-2 border bg-card p-4 md:flex-row md:flex-wrap md:items-baseline md:gap-x-6 md:gap-y-2 md:p-6"
          >
            <h2
              id="live"
              className="inline-flex items-center gap-2 font-mono text-label text-primary uppercase"
            >
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full bg-primary"
              />
              Live
            </h2>
            <h3 className="font-heading text-body font-bold uppercase">
              <a href="#" className={HEADLINE_LINK}>
                Bridge vote: council meets at 18:00
              </a>
            </h3>
            <p className="flex items-baseline gap-2 md:flex-1">
              <time
                dateTime="2026-11-11T17:30"
                className={cn(LABEL, "text-muted-foreground tabular-nums")}
              >
                17:30
              </time>
              <span className="max-w-xl text-body">
                Councillors are arriving at the Guildhall, where about 200
                people are waiting for a seat in the public gallery.
              </span>
            </p>
          </section>

          {PAGE_SECTIONS.map((section) => {
            const id = `section-${section.name.toLowerCase()}`
            return (
              <section
                key={section.name}
                aria-labelledby={id}
                className="flex flex-col gap-4"
              >
                <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
                  <h2 id={id} className={cn(LABEL, "text-foreground")}>
                    {section.name}
                  </h2>
                  <a href="#" className={cn(LABEL, LABEL_LINK)}>
                    {section.all}
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
                  {section.stories.map((story, index) => (
                    <StoryUnit
                      key={story.headline}
                      story={story}
                      size="h2"
                      ratio="aspect-3/2"
                      className={cn(
                        index > 0 &&
                          "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
                        index < section.stories.length - 1 && "md:pr-6"
                      )}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <footer>
        <div className={cn(CONTAINER, "flex flex-col gap-4 border-t-2 py-6")}>
          <a href="/" className={cn(MASTHEAD, "self-start text-h2")}>
            The Port Avery Ledger
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <SectionLinks className="" />
            </ul>
          </nav>
          <p className={cn(LABEL, "text-muted-foreground")}>
            ©{" "}
            <time dateTime="2026" className="font-mono tabular-nums">
              2026
            </time>{" "}
            The Port Avery Ledger · Port Avery
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
