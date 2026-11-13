import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const labelLink = cn(
  "font-mono text-label uppercase text-foreground transition-colors duration-150 underline-offset-4 hover:underline",
  focus
)

const headlineLink = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const mastheadLink = cn(
  "font-heading uppercase text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const label = "font-mono text-label uppercase"

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

type Picture = {
  label: string
  caption: string
}

type Story = {
  kicker: string
  headline: string
  text: string
  byline: string
  time: string
  dateTime: string
  picture?: Picture
  extraLink?: string
}

const sideStories: Story[] = [
  {
    kicker: "Weather",
    headline: "Gale warning for the harbour tonight",
    text: "Forecasters expect gusts of 70mph along the seafront from 21:00, and the harbour master has told small boats to stay in port.",
    byline: "Priya Venkataraman",
    time: "08:10",
    dateTime: "2026-11-11T08:10",
    picture: {
      label:
        "Waves breaking over the harbour wall under a dark sky, with a lighthouse at the far end",
      caption:
        "Waves over the north harbour wall at dawn · Photograph: Odile Marsh",
    },
  },
  {
    kicker: "Courts",
    headline: "Dock firm fined over crane collapse",
    text: "Halloway Lift Services must pay £1.2m after a crane fell across Berth 4 in March, injuring two workers.",
    byline: "Tomasz Okafor",
    time: "07:45",
    dateTime: "2026-11-11T07:45",
  },
  {
    kicker: "Health",
    headline: "New clinic opens in Eastmoor",
    text: "The walk-in clinic on Crane Road will see patients seven days a week from Monday.",
    byline: "Lucia Brandt",
    time: "07:20",
    dateTime: "2026-11-11T07:20",
  },
  {
    kicker: "Schools",
    headline: "Three schools to merge next year",
    text: "Parents in Northgate will be asked for their views on the plan at meetings this month.",
    byline: "Amos Kettering",
    time: "06:55",
    dateTime: "2026-11-11T06:55",
  },
  {
    kicker: "Business",
    headline: "Shipyard wins £20m ferry order",
    text: "Greywater Marine will build two electric ferries for the island route, keeping 300 jobs at the yard until 2029.",
    byline: "Nadia Feld",
    time: "06:30",
    dateTime: "2026-11-11T06:30",
  },
]

type Section = {
  name: string
  allLabel: string
  stories: Story[]
}

const newsSections: Section[] = [
  {
    name: "Politics",
    allLabel: "All politics",
    stories: [
      {
        kicker: "Budget",
        headline: "Opposition sets out rival budget",
        text: "The Harbour Party would freeze bus fares and pay for it by selling the old tram depot.",
        byline: "Marta Quist",
        time: "09:05",
        dateTime: "2026-11-11T09:05",
        picture: {
          label:
            "A woman speaking at a lectern in the council chamber, with rows of empty seats behind her",
          caption:
            "Ines Calloway sets out her plan in the chamber · Photograph: Ben Arkwright",
        },
      },
      {
        kicker: "Elections",
        headline: "Harbour ward vote set for 4 December",
        text: "The by-election follows the resignation of councillor Rufus Penn after twelve years in the seat.",
        byline: "Owen Strickland",
        time: "08:40",
        dateTime: "2026-11-11T08:40",
        picture: {
          label:
            "A polling station sign tied to the railings outside a red-brick school",
          caption:
            "Harbour Ward primary school will be a polling station · Photograph: Ben Arkwright",
        },
      },
      {
        kicker: "Council",
        headline: "Row grows over council pay rise",
        text: "Union leaders say a 9% rise for senior officers cannot stand while care staff get 3%.",
        byline: "Marta Quist",
        time: "07:50",
        dateTime: "2026-11-11T07:50",
        picture: {
          label:
            "Protesters with handmade placards on the steps of the Guildhall",
          caption:
            "Care workers outside the Guildhall on Tuesday · Photograph: Odile Marsh",
        },
      },
    ],
  },
  {
    name: "Sport",
    allLabel: "All sport",
    stories: [
      {
        kicker: "Football",
        headline: "Harriers win the derby 2–1",
        text: "A late header from Dele Osei gave Port Avery Harriers victory over Saltgate United at Quayside Park.",
        byline: "Callum Reyes",
        time: "07:30",
        dateTime: "2026-11-11T07:30",
        extraLink: "Results",
        picture: {
          label:
            "A footballer in a red shirt leaping to head the ball in front of a packed stand",
          caption:
            "Dele Osei scores the winner in the 88th minute · Photograph: Jonas Weir",
        },
      },
      {
        kicker: "Swimming",
        headline: "Swimmer breaks city 400m record",
        text: "Seventeen-year-old Mei Hartley took two seconds off a record that had stood since 2009.",
        byline: "Freya Lund",
        time: "Tue 10 Nov",
        dateTime: "2026-11-10",
        picture: {
          label:
            "A swimmer in a white cap looking up at the clock at the end of a pool lane",
          caption:
            "Mei Hartley at the Eastmoor Baths · Photograph: Jonas Weir",
        },
      },
      {
        kicker: "Football",
        headline: "Westmere name new manager",
        text: "Westmere Athletic have appointed former captain Gil Moran on a two-year contract.",
        byline: "Callum Reyes",
        time: "06:45",
        dateTime: "2026-11-11T06:45",
        picture: {
          label:
            "A man in a club scarf holding up a shirt beside the dugout of an empty stadium",
          caption:
            "Gil Moran at Westmere Road on Tuesday · Photograph: Jonas Weir",
        },
      },
    ],
  },
  {
    name: "City",
    allLabel: "All city",
    stories: [
      {
        kicker: "Markets",
        headline: "Dock Lane market trades for last time",
        text: "Stallholders will close the covered market on Saturday after 94 years, to make way for flats.",
        byline: "Esme Varga",
        time: "08:25",
        dateTime: "2026-11-11T08:25",
        picture: {
          label:
            "Fruit and vegetable stalls under the iron roof of a covered market",
          caption:
            "The Dock Lane market hall on Tuesday morning · Photograph: Odile Marsh",
        },
      },
      {
        kicker: "Transport",
        headline: "Ferry timetable changes from Monday",
        text: "The first crossing to Hollin Island will leave at 06:10 instead of 06:40 to make up for the bridge closure.",
        byline: "Tomasz Okafor",
        time: "07:10",
        dateTime: "2026-11-11T07:10",
        picture: {
          label:
            "A white passenger ferry pulling away from a wooden pier in grey light",
          caption:
            "The Hollin Island ferry leaves the Town Pier · Photograph: Ben Arkwright",
        },
      },
      {
        kicker: "Housing",
        headline: "Winter night shelter opens its doors",
        text: "The shelter at St Brannoc's Hall has 40 beds and will stay open every night until March.",
        byline: "Esme Varga",
        time: "06:20",
        dateTime: "2026-11-11T06:20",
        picture: {
          label:
            "Rows of camp beds with folded blankets in a church hall with tall windows",
          caption:
            "Beds made up at St Brannoc's Hall · Photograph: Ben Arkwright",
        },
      },
    ],
  },
]

function Figure({ picture, aspect }: { picture: Picture; aspect: string }) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={picture.label}
        className={cn("w-full bg-muted", aspect)}
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
      {story.extraLink ? (
        <>
          {" · "}
          <a href="#" className={labelLink}>
            {story.extraLink}
          </a>
        </>
      ) : null}
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

function Header() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <p className={cn(label, "text-muted-foreground")}>
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              Wednesday 11 November 2026
            </time>
          </p>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:justify-center md:border-b-0">
          <Masthead className="text-h2 md:text-h1" />
          <Button
            ref={buttonRef}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={open}
            aria-controls="sections-menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="sections-menu"
          aria-label="Sections"
          hidden={!open}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <a href="#" className={cn(labelLink, "block py-2")}>
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
                <a href="#" className={labelLink}>
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

function LeadRow() {
  return (
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
          The Kessel Street Bridge will stay closed until May after inspectors
          found cracked bearings, and the council votes tonight on a £48m
          repair.
        </p>
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          By Hana Lindqvist · <time dateTime="2026-11-11T06:15">06:15</time>
        </p>
        <Figure
          aspect="aspect-3/2"
          picture={{
            label:
              "A steel road bridge over a wide river, its approach blocked by barriers and a closed sign",
            caption:
              "Barriers on the Kessel Street Bridge on Tuesday · Photograph: Odile Marsh",
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
                {story.picture ? (
                  <Figure picture={story.picture} aspect="aspect-video" />
                ) : null}
                <p className={cn(label, "text-foreground")}>{story.kicker}</p>
                <h3 className="font-heading text-body font-bold uppercase">
                  <a href="#" className={headlineLink}>
                    {story.headline}
                  </a>
                </h3>
                <p className="max-w-xl text-body">{story.text}</p>
                <LabelLine story={story} />
              </article>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function LiveStrip() {
  return (
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
          More than 300 people are queuing outside the Guildhall for a seat in
          the public gallery.
        </span>
      </p>
    </section>
  )
}

function NewsSection({ section }: { section: Section }) {
  const last = section.stories.length - 1

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
        <h2 className="font-mono text-label text-foreground uppercase">
          {section.name}
        </h2>
        <a href="#" className={labelLink}>
          {section.allLabel}
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
        {section.stories.map((story, index) => (
          <article
            key={story.headline}
            className={cn(
              "flex flex-col gap-2",
              index > 0 &&
                "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
              index < last && "md:pr-6"
            )}
          >
            {story.picture ? (
              <Figure picture={story.picture} aspect="aspect-3/2" />
            ) : null}
            <p className={cn(label, "text-foreground")}>{story.kicker}</p>
            <h3 className="text-h2 uppercase">
              <a href="#" className={headlineLink}>
                {story.headline}
              </a>
            </h3>
            <p className="max-w-xl text-body">{story.text}</p>
            <LabelLine story={story} />
          </article>
        ))}
      </div>
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
            {sections.map((section) => (
              <li key={section}>
                <a href="#" className={labelLink}>
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <LeadRow />
          <LiveStrip />
          {newsSections.map((section) => (
            <NewsSection key={section.name} section={section} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
