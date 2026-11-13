import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const labelLink = `font-mono text-label uppercase text-foreground hover:underline underline-offset-4 transition-colors duration-150 ${focusRing}`

const headlineLink = `text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150 ${focusRing}`

const textLink = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusRing}`

const mastheadLink = `font-heading uppercase text-foreground hover:underline decoration-2 underline-offset-4 transition-colors duration-150 ${focusRing}`

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

const currentSection = "News"

const latest = [
  {
    headline: "Ferry timetable doubled from Thursday",
    time: "09:52",
    isNew: true,
  },
  {
    headline: "Harbour Line trams to run every five minutes",
    time: "09:31",
    isNew: false,
  },
  {
    headline: "East bank schools to start an hour later",
    time: "08:47",
    isNew: false,
  },
  {
    headline: "Traders by the bridge ask for rent relief",
    time: "08:10",
    isNew: false,
  },
  {
    headline: "Night buses moved to Gull Lane",
    time: "07:25",
    isNew: false,
  },
]

const related = [
  {
    kicker: "City",
    headline: "Inspectors found cracks on a routine visit",
    byline: "By Tomas Erlund",
    picture:
      "An engineer in a hard hat shining a torch at a steel bearing under the bridge deck",
    caption:
      "An inspector checks a bearing under the third span · Photograph: Odile Marsh",
  },
  {
    kicker: "Transport",
    headline: "How to cross the harbour this week",
    byline: "By Hana Lindqvist",
    picture:
      "Passengers queuing on a wooden pier as a small white ferry pulls in",
    caption:
      "The queue for the ferry at Anchor Steps · Photograph: Odile Marsh",
  },
  {
    kicker: "Business",
    headline: "Dock firms count the cost of a detour",
    byline: "By Ines Valcourt",
    picture:
      "Lorries waiting in a line at the gates of a container yard at dusk",
    caption:
      "Lorries at the gates of the Eastern Docks · Photograph: Bram Toller",
  },
]

const facts = [
  { term: "Opened", value: "1964" },
  { term: "Crossings a day", value: "40,000" },
  { term: "Closed for", value: "6 months" },
  { term: "Repair cost", value: "£48m" },
]

function SectionLinks({ menu = false }: { menu?: boolean }) {
  return sections.map((name) => {
    const current = name === currentSection
    return (
      <li key={name}>
        <a
          href="#"
          aria-current={current ? "page" : undefined}
          className={cn(
            "font-mono text-label uppercase text-foreground underline-offset-4 transition-colors duration-150",
            focusRing,
            current ? "underline decoration-2" : "hover:underline",
            menu && "block py-2"
          )}
        >
          {name}
        </a>
      </li>
    )
  })
}

function SectionHead({ id, name }: { id: string; name: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2
        id={id}
        className="font-mono text-label uppercase text-foreground"
      >
        {name}
      </h2>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
            <time dateTime="2026-11-11">Wednesday 11 November 2026</time>
          </p>
          <a
            href="#"
            className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
          >
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
            <SectionLinks menu />
          </ul>
        </nav>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <SectionLinks />
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
        <a href="/" className={cn(mastheadLink, "self-start text-h2")}>
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
        <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
          © 2026 The Port Avery Ledger · Port Avery
        </p>
      </div>
    </footer>
  )
}

function StoryHead() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-10">
        <p className="font-mono text-label uppercase tabular-nums">
          <a href="#" className={labelLink}>
            Transport
          </a>
          <span className="text-muted-foreground">
            {" · "}
            <time dateTime="2026-11-11T06:15">06:15</time>
          </span>
        </p>
        <h1 className="text-h1 uppercase text-foreground md:text-display">
          Bridge shut for six months
        </h1>
        <p className="max-w-3xl font-sans text-h2 font-normal text-foreground">
          Inspectors found cracked bearings under the Kessel Street Bridge, and
          the council votes tonight on a repair that will keep it closed until
          May.
        </p>
        <div className="flex flex-col gap-1 font-mono text-label uppercase tabular-nums">
          <p className="text-foreground">By Hana Lindqvist, city reporter</p>
          <p className="text-muted-foreground">
            Updated <time dateTime="2026-11-11T09:40">09:40</time>
          </p>
        </div>
      </div>
    </div>
  )
}

function Picture() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <figure className="flex flex-col gap-2 lg:col-span-8">
        <div
          role="img"
          aria-label="The Kessel Street Bridge seen from the west bank, with red and white steel barriers across the road and an empty carriageway beyond them"
          className="aspect-3/2 w-full bg-muted"
        />
        <figcaption className="font-mono text-label uppercase text-muted-foreground">
          Barriers across the Kessel Street Bridge on Tuesday afternoon ·
          Photograph: Odile Marsh
        </figcaption>
      </figure>
    </div>
  )
}

function Body() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
      <p className="max-w-xl text-body">
        The Kessel Street Bridge, the only road crossing between the Old Town
        and the eastern docks, closed at 14:00 on Tuesday after inspectors
        found cracked bearings under two of its five spans. It will stay shut
        to cars, buses, bikes and people on foot for at least six months while
        the bearings are replaced.
      </p>
      <p className="max-w-xl text-body">
        Police put barriers across both ends within an hour of the inspection
        report reaching the transport office. By the evening rush, traffic on
        the ring road was backed up past the fish market, and the Harbour Line
        trams were running ten minutes late.
      </p>
      <p className="max-w-xl text-body">
        About 40,000 people cross the bridge on a normal weekday, according to
        council counts. Most of them live on the east bank and work in the Old
        Town, or the other way round. The detour by the ring road and the
        Marrow Lock crossing adds between 20 and 35 minutes each way by car,
        and more at peak times.
      </p>
      <p className="max-w-xl text-body">
        Reuben Achterberg, who chairs the council's transport committee, said
        the decision to close the bridge was not a hard one. “The bearings are
        what the deck sits on. Two of them have cracks right through. We are
        not going to put a bus full of people on top of that and hope,” he
        said.
      </p>
      <blockquote className="max-w-xl border-t-2 border-b py-4">
        <p className="font-sans text-h2 font-normal italic text-foreground">
          We closed it because the alternative was to wait for something worse
          to happen.
        </p>
        <footer className="mt-2 font-mono text-label uppercase text-muted-foreground not-italic">
          Reuben Achterberg, transport chief
        </footer>
      </blockquote>
      <p className="max-w-xl text-body">
        The cracks were found during a routine check that takes place every
        two years. Engineers say the bearings, which let the deck move as it
        warms and cools, are the originals from 1964 and were meant to be
        replaced in the 1990s. That work was put off twice to save money.
      </p>
      <p className="max-w-xl text-body">
        For the shops and cafés at the foot of the bridge, the closure has
        already changed the day. Selin Duraković, who runs the Kessel Corner
        café on the west bank, said she sold half her usual number of coffees
        on Wednesday morning. “My customers are the people walking to work
        over the bridge. They are not walking past me now. They are on a
        ferry,” she said. “Six months is a long time to wait for them to come
        back.”
      </p>
      <aside
        aria-labelledby="facts-heading"
        className="flex max-w-xl flex-col gap-4 border bg-card p-4 md:p-6"
      >
        <h2
          id="facts-heading"
          className="font-mono text-label uppercase text-foreground"
        >
          The bridge in numbers
        </h2>
        <dl className="flex flex-col gap-4">
          {facts.map((fact) => (
            <div key={fact.term} className="flex flex-col gap-1">
              <dt className="font-mono text-label uppercase text-muted-foreground">
                {fact.term}
              </dt>
              <dd className="font-mono text-h2 tabular-nums text-foreground">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </aside>
      <p className="max-w-xl text-body">
        The council meets at 18:00 tonight to vote on a{" "}
        <mark className="bg-tertiary px-0.5 text-tertiary-foreground">
          £48m
        </mark>{" "}
        plan to replace all ten bearings, repair the steel around them and
        resurface the deck while it is closed. The money would come from the
        city's road budget for the next three years and a loan from the
        regional infrastructure fund. The full plan is set out in the{" "}
        <a href="#" className={textLink}>
          committee papers for tonight's meeting
        </a>
        .
      </p>
      <p className="max-w-xl text-body">
        The opposition says the council should have seen this coming. Marta
        Vengsel, who leads the Harbour Party group, said the repair had been
        on the list of overdue work for twenty years. “Every time it came up,
        it was pushed back to next year. Now 40,000 people pay for that every
        morning,” she said. Her group will ask for an independent review of
        how the city looks after its bridges.
      </p>
      <h2 className="mt-6 max-w-xl text-h2 uppercase text-foreground">
        What happens next
      </h2>
      <p className="max-w-xl text-body">
        If the plan passes tonight, the council says contractors could be on
        site within three weeks. The old bearings would be lifted out one
        span at a time, with the deck held up on temporary steel supports. The
        transport office expects the bridge to reopen in May, but has not
        ruled out a longer closure if more damage is found once work starts.
      </p>
      <p className="max-w-xl text-body">
        Until then, the city is adding ferries between Anchor Steps and the
        east bank from Thursday, with a boat every ten minutes at peak times
        and fares cut to the price of a bus ticket. Two extra tram services
        will run on the Harbour Line, and the night buses that used the bridge
        will go by Gull Lane instead.
      </p>
      <p className="max-w-xl text-body">
        Mr Achterberg said he would ask the council tonight to set aside part
        of the money for shops near the bridge that lose trade during the
        works. Ms Duraković said she would believe it when she saw it, but
        that she would be at the meeting to listen.
      </p>
    </div>
  )
}

function Rail() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
      <SectionHead id="latest-heading" name="Latest" />
      <ul className="flex flex-col gap-4">
        {latest.map((story, index) => (
          <li key={story.headline} className={cn(index > 0 && "border-t pt-4")}>
            <article className="flex flex-col gap-1">
              <h3 className="font-heading text-body font-bold uppercase">
                <a href="#" className={headlineLink}>
                  {story.headline}
                </a>
              </h3>
              {story.isNew ? (
                <p className="flex items-baseline gap-2 font-mono text-label uppercase tabular-nums text-muted-foreground">
                  <span className="text-primary">New</span>
                  <time dateTime={`2026-11-11T${story.time}`}>
                    {story.time}
                  </time>
                </p>
              ) : (
                <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
                  <time dateTime={`2026-11-11T${story.time}`}>
                    {story.time}
                  </time>
                </p>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Related() {
  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <SectionHead id="related-heading" name="Related" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
        {related.map((story, index) => (
          <article
            key={story.headline}
            className={cn(
              "flex flex-col gap-2",
              index > 0 &&
                "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
              index < related.length - 1 && "md:pr-6"
            )}
          >
            <figure className="flex flex-col gap-2">
              <div
                role="img"
                aria-label={story.picture}
                className="aspect-3/2 w-full bg-muted"
              />
              <figcaption className="font-mono text-label uppercase text-muted-foreground">
                {story.caption}
              </figcaption>
            </figure>
            <p className="font-mono text-label uppercase text-foreground">
              {story.kicker}
            </p>
            <h3 className="text-h2 uppercase">
              <a href="#" className={headlineLink}>
                {story.headline}
              </a>
            </h3>
            <p className="font-mono text-label uppercase tabular-nums text-muted-foreground">
              {story.byline} · <time dateTime="2026-11-10">Tue 10 Nov</time>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <article className="flex flex-col gap-12">
            <StoryHead />
            <Picture />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
              <Body />
              <Rail />
            </div>
            <Related />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
