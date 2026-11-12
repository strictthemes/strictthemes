import { useEffect, useRef, useState, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const labelLink = `${label} text-foreground hover:underline underline-offset-4 transition-colors duration-150 ${focus}`
const headlineLink = `text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150 ${focus}`
const mastheadLink = `font-heading uppercase text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150 ${focus}`
const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"
const num = "font-mono tabular-nums"

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

type Picture = { scene: string; caption: string }

type Story = {
  kicker: string
  headline: string
  text: string
  byline: string
  time: string
  dateTime: string
  picture?: Picture
  extra?: ReactNode
}

const sideStories: Story[] = [
  {
    kicker: "Travel",
    headline: "Buses fill gap as bridge closes",
    text: "Six extra routes will run over the Mill Lane crossing from Thursday, the transport office said.",
    byline: "Priya Venkataraman",
    time: "08:10",
    dateTime: "2026-11-11T08:10",
    picture: {
      scene: "A line of red buses queueing on Harbour Road in the morning rain",
      caption: "BUSES ON HARBOUR ROAD ON WEDNESDAY · PHOTOGRAPH: ODILE MARSH",
    },
  },
  {
    kicker: "Health",
    headline: "New clinic for East Quay",
    text: "The East Quay health centre opens on Monday with eight doctors and a walk-in service.",
    byline: "Tomas Argyle",
    time: "07:50",
    dateTime: "2026-11-11T07:50",
  },
  {
    kicker: "Courts",
    headline: "Landlord fined £60,000",
    text: "A Fennick Road landlord left 14 flats without heating for most of last winter.",
    byline: "Maren Cole",
    time: "07:20",
    dateTime: "2026-11-11T07:20",
  },
  {
    kicker: "Weather",
    headline: "Gales due on Friday",
    text: "Forecasters expect gusts of up to 70mph along the harbour wall from Friday afternoon.",
    byline: "Jonas Pell",
    time: "06:55",
    dateTime: "2026-11-11T06:55",
  },
  {
    kicker: "Schools",
    headline: "Two schools to merge",
    text: "St Brede's and Harbour Lane primary schools will share one site from September 2027.",
    byline: "Ada Okonjo",
    time: "06:30",
    dateTime: "2026-11-11T06:30",
  },
]

const frontSections: { name: string; all: string; stories: Story[] }[] = [
  {
    name: "Politics",
    all: "All politics",
    stories: [
      {
        kicker: "Budget",
        headline: "Opposition sets out £12m budget plan",
        text: "The Harbour Party would cut the council's office costs to pay for free school buses.",
        byline: "Owen Tallis",
        time: "09:40",
        dateTime: "2026-11-11T09:40",
        picture: {
          scene: "Opposition leader Clara Voss speaking at a lectern in the Guildhall",
          caption: "CLARA VOSS AT THE GUILDHALL · PHOTOGRAPH: ODILE MARSH",
        },
      },
      {
        kicker: "Election",
        headline: "Northgate votes on 3 December",
        text: "A by-election will choose a new councillor after Ian Raffe stood down in October.",
        byline: "Hana Lindqvist",
        time: "10:05",
        dateTime: "2026-11-11T10:05",
        picture: {
          scene: "A polling station sign outside Northgate community hall",
          caption: "NORTHGATE COMMUNITY HALL · PHOTOGRAPH: BEN ORRELL",
        },
      },
      {
        kicker: "Council",
        headline: "Row over 9% rise in council pay",
        text: "Councillors vote next week on raising their own allowances to £14,800 a year.",
        byline: "Owen Tallis",
        time: "11:20",
        dateTime: "2026-11-11T11:20",
        picture: {
          scene: "The empty council chamber with its rows of green benches",
          caption: "THE COUNCIL CHAMBER · PHOTOGRAPH: BEN ORRELL",
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
        headline: "Harriers see off Saltgate in derby",
        text: "A late header from Dani Reyes settled the derby in front of 11,400 fans at Quayside Park.",
        byline: "Felix Morrow",
        time: "07:05",
        dateTime: "2026-11-11T07:05",
        picture: {
          scene: "Port Avery Harriers players celebrating a goal in front of a packed stand",
          caption: "DANI REYES CELEBRATES THE WINNER · PHOTOGRAPH: SAM KEEL",
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
        headline: "Nell Ashby sets 200m record",
        text: "The 19-year-old swam the 200m butterfly in 2:06.41 at the national championships.",
        byline: "Greta Holm",
        time: "TUE 10 NOV",
        dateTime: "2026-11-10",
        picture: {
          scene: "A swimmer in a white cap touching the wall at the end of a race",
          caption: "NELL ASHBY AT THE FINISH · PHOTOGRAPH: SAM KEEL",
        },
      },
      {
        kicker: "Football",
        headline: "Westmere name new manager",
        text: "Former Harriers coach Leon Banda has signed a three-year deal at Westmere Athletic.",
        byline: "Felix Morrow",
        time: "12:30",
        dateTime: "2026-11-11T12:30",
        picture: {
          scene: "Leon Banda holding a Westmere Athletic scarf on the touchline",
          caption: "LEON BANDA AT WESTMERE ROAD · PHOTOGRAPH: SAM KEEL",
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
        headline: "Last day for Canal Street market",
        text: "Traders close their stalls on Saturday after 140 years, and the hall will become flats.",
        byline: "Maren Cole",
        time: "08:45",
        dateTime: "2026-11-11T08:45",
        picture: {
          scene: "Fruit and vegetable stalls under the iron roof of Canal Street market",
          caption: "CANAL STREET MARKET ON WEDNESDAY · PHOTOGRAPH: ODILE MARSH",
        },
      },
      {
        kicker: "Ferries",
        headline: "Ferry times change on Monday",
        text: "The Saltgate ferry will run every 20 minutes at peak hours while the bridge is shut.",
        byline: "Jonas Pell",
        time: "09:15",
        dateTime: "2026-11-11T09:15",
        picture: {
          scene: "A small passenger ferry leaving the pier with the harbour behind it",
          caption: "THE SALTGATE FERRY AT WEST PIER · PHOTOGRAPH: BEN ORRELL",
        },
      },
      {
        kicker: "Housing",
        headline: "Winter night shelter opens early",
        text: "The shelter at St Anne's Hall opens a week early with 40 beds and 60 volunteers.",
        byline: "Ada Okonjo",
        time: "10:50",
        dateTime: "2026-11-11T10:50",
        picture: {
          scene: "Rows of camp beds with folded blankets in a church hall",
          caption: "ST ANNE'S HALL ON TUESDAY · PHOTOGRAPH: BEN ORRELL",
        },
      },
    ],
  },
]

function Figure({ picture, aspect = "aspect-3/2" }: { picture: Picture; aspect?: string }) {
  return (
    <figure className="flex flex-col gap-2">
      <div role="img" aria-label={picture.scene} className={cn(aspect, "w-full bg-muted")} />
      <figcaption className={`${label} text-muted-foreground`}>{picture.caption}</figcaption>
    </figure>
  )
}

function LabelLine({ story }: { story: Story }) {
  return (
    <p className={`${label} text-muted-foreground`}>
      By {story.byline} ·{" "}
      <time dateTime={story.dateTime} className={num}>
        {story.time}
      </time>
      {story.extra}
    </p>
  )
}

function StoryUnit({
  story,
  headlineClass,
  pictureAspect,
}: {
  story: Story
  headlineClass: string
  pictureAspect?: string
}) {
  return (
    <article className="flex flex-col gap-2">
      {story.picture && <Figure picture={story.picture} aspect={pictureAspect} />}
      <p className={`${label} text-foreground`}>{story.kicker}</p>
      <h3 className={headlineClass}>
        <a href="#" className={headlineLink}>
          {story.headline}
        </a>
      </h3>
      <p className="max-w-xl text-body">{story.text}</p>
      <LabelLine story={story} />
    </article>
  )
}

function Masthead({ className }: { className: string }) {
  return (
    <a href="/" className={cn(mastheadLink, className)}>
      The Port Avery Ledger
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <time dateTime="2026-11-11" className={`${label} ${num} text-muted-foreground`}>
            Wednesday 11 November 2026
          </time>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 py-4 md:justify-center">
          <Masthead className="text-h2 md:text-h1" />
          <Button
            ref={buttonRef}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={open}
            aria-controls="mobile-sections"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
        </div>
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
        <nav
          id="mobile-sections"
          aria-label="Sections"
          hidden={!open}
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
      </div>
    </header>
  )
}

function LeadRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
      <article className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
        <div className="flex items-center gap-2">
          <p className={`${label} text-foreground`}>Transport</p>
          <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label uppercase text-tertiary-foreground">
            Exclusive
          </Badge>
        </div>
        <h1 className="text-h1 uppercase md:text-display">
          <a href="#" className={headlineLink}>
            Bridge shut for six months
          </a>
        </h1>
        <p className="max-w-3xl font-sans text-h2 font-normal">
          Inspectors found cracked bearings under the Kessel Street Bridge, and the
          council votes tonight on a £48m repair to reopen the city's main river crossing.
        </p>
        <p className={`${label} text-muted-foreground`}>
          By Hana Lindqvist ·{" "}
          <time dateTime="2026-11-11T06:15" className={num}>
            06:15
          </time>
        </p>
        <Figure
          picture={{
            scene:
              "The Kessel Street Bridge closed behind metal barriers, with an empty roadway and the river below",
            caption: "THE KESSEL STREET BRIDGE ON TUESDAY · PHOTOGRAPH: ODILE MARSH",
          }}
        />
      </article>
      <section
        aria-labelledby="more-top-stories"
        className="border-t pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
      >
        <h2 id="more-top-stories" className="sr-only">
          More top stories
        </h2>
        <ul className="flex flex-col gap-4">
          {sideStories.map((story, index) => (
            <li key={story.headline} className={index > 0 ? "border-t pt-4" : undefined}>
              <StoryUnit
                story={story}
                headlineClass="font-heading text-body font-bold uppercase"
                pictureAspect="aspect-video"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function LiveStrip() {
  return (
    <section
      aria-labelledby="live-heading"
      className="flex flex-col gap-2 border bg-card p-4 md:flex-row md:flex-wrap md:items-baseline md:gap-x-6 md:gap-y-2 md:p-6"
    >
      <h2
        id="live-heading"
        className="inline-flex items-center gap-2 font-mono text-label uppercase text-primary"
      >
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-primary" />
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
          className={`${label} ${num} text-muted-foreground`}
        >
          17:30
        </time>
        <span className="text-body">
          Councillors are arriving at the Guildhall, where about 200 people have
          gathered outside.
        </span>
      </p>
    </section>
  )
}

function FrontSection({ section }: { section: (typeof frontSections)[number] }) {
  const id = `section-${section.name.toLowerCase()}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
        <h2 id={id} className="font-mono text-label uppercase text-foreground">
          {section.name}
        </h2>
        <a href="#" className={labelLink}>
          {section.all}
        </a>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
        {section.stories.map((story, index) => (
          <li
            key={story.headline}
            className={cn(
              index > 0 && "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
              index < section.stories.length - 1 && "md:pr-6"
            )}
          >
            <StoryUnit story={story} headlineClass="text-h2 uppercase" />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Footer() {
  return (
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
        <p className={`${label} text-muted-foreground`}>
          © <span className={num}>2026</span> The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="bg-background text-body text-foreground">
      <Header />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <LeadRow />
          <LiveStrip />
          {frontSections.map((section) => (
            <FrontSection key={section.name} section={section} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
