import { useEffect, useId, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1280px] px-4 md:px-6"

const label = "font-mono text-label uppercase"

const labelLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const headlineLink = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const buttonClasses = "h-auto px-4 py-2 font-mono text-label uppercase"

const paragraph = "max-w-xl text-body"

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
    headline: "Ferry queue reaches Quay Steps",
    time: "09:52",
    isNew: true,
  },
  {
    headline: "Tollgate Road jams back to the ring road",
    time: "09:31",
    isNew: false,
  },
  {
    headline: "Schools told to expect late buses",
    time: "09:05",
    isNew: false,
  },
  {
    headline: "Traders ask council for rate relief",
    time: "08:40",
    isNew: false,
  },
  {
    headline: "Harbour police add patrols at crossing",
    time: "08:12",
    isNew: false,
  },
]

const related = [
  {
    kicker: "Transport",
    headline: "Bridge closed as cracks found",
    byline: "By Hana Lindqvist",
    day: "Tue 10 Nov",
    dateTime: "2026-11-10",
    alt: "Council workers in orange jackets set a steel barrier across the road at the west end of the Kessel Street Bridge",
    caption:
      "Barriers go up on Kessel Street on Tuesday · Photograph: Odile Marsh",
  },
  {
    kicker: "City",
    headline: "Foot ferry returns to the channel",
    byline: "By Oskar Pellegrin",
    day: "Tue 10 Nov",
    dateTime: "2026-11-10",
    alt: "A small white passenger boat tied up at a stone landing, with a line of people waiting on the steps above it",
    caption: "The ferry at Quay Steps · Photograph: Tamsin Harlow",
  },
  {
    kicker: "Politics",
    headline: "Seafront road bill rises again",
    byline: "By Ilse Brandt",
    day: "Mon 9 Nov",
    dateTime: "2026-11-09",
    alt: "A fenced stretch of coast road with diggers parked beside a sea wall under a grey sky",
    caption: "Works on Marine Parade · Photograph: Odile Marsh",
  },
]

const facts = [
  { term: "Opened", value: "1964" },
  { term: "Crossings a day", value: "40,000" },
  { term: "Closed for", value: "6 months" },
  { term: "Repair cost", value: "£48m" },
]

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header>
      <div className={container}>
        <div className="flex items-center justify-between gap-4 py-2">
          <time
            dateTime="2026-11-11"
            className={cn(label, "text-muted-foreground tabular-nums")}
          >
            Wednesday 11 November 2026
          </time>
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              buttonClasses
            )}
          >
            Subscribe
          </a>
        </div>

        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <a
            href="/"
            className={cn("font-heading text-h2 uppercase", headlineLink)}
          >
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(buttonClasses, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>

        <nav
          id={menuId}
          aria-label="Sections"
          hidden={!menuOpen}
          className="border-b py-2 md:hidden"
        >
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <a
                  href="#"
                  aria-current={section === currentSection ? "page" : undefined}
                  className={cn(
                    "block py-2",
                    label,
                    labelLink,
                    section === currentSection && "underline decoration-2"
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
                  aria-current={section === currentSection ? "page" : undefined}
                  className={cn(
                    label,
                    labelLink,
                    section === currentSection && "underline decoration-2"
                  )}
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

function Picture({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="flex flex-col gap-2">
      <div role="img" aria-label={alt} className="aspect-3/2 w-full bg-muted" />
      <figcaption className={cn(label, "text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  )
}

function StoryHead() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-10">
        <p className={label}>
          <a href="#" className={labelLink}>
            Transport
          </a>
          <span className="text-muted-foreground">
            {" · "}
            <time dateTime="2026-11-11T06:15" className="tabular-nums">
              06:15
            </time>
          </span>
        </p>
        <h1 className="text-h1 text-foreground uppercase md:text-display">
          Bridge shut for six months
        </h1>
        <p className="max-w-3xl font-sans text-h2 font-normal text-foreground">
          Inspectors found cracked bearings under the Kessel Street Bridge on
          Tuesday. The council votes tonight on a £48m repair.
        </p>
        <div className="flex flex-col gap-1">
          <p className={cn(label, "text-foreground")}>
            By Hana Lindqvist, City Reporter
          </p>
          <p className={cn(label, "text-muted-foreground")}>
            Updated{" "}
            <time dateTime="2026-11-11T09:40" className="tabular-nums">
              09:40
            </time>
          </p>
        </div>
      </div>
    </div>
  )
}

function StoryBody() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:col-span-8 lg:pr-6">
      <p className={paragraph}>
        The Kessel Street Bridge, the main road crossing over the Avery Channel,
        will stay closed for at least six months after inspectors found cracks
        in four of the steel bearings that carry its deck. Port Avery council
        shut the bridge to all traffic at 4pm on Tuesday, two hours after the
        engineers reported what they had seen, and barriers now stand across
        both ends.
      </p>
      <p className={paragraph}>
        The cracks were found during a routine check that takes place every two
        years. According to{" "}
        <a href="#" className={textLink}>
          the inspectors&rsquo; report
        </a>
        , published on Tuesday night, the bearings on the two piers nearest the
        east bank have worn through and can no longer be trusted to carry the
        weight of buses and lorries. Reuben Achterberg, the council&rsquo;s
        transport chief, said there had been no choice. &ldquo;We closed it
        within two hours of the call,&rdquo; he said. &ldquo;Nobody was going to
        drive over that bridge on my watch.&rdquo;
      </p>
      <p className={paragraph}>
        About 40,000 people cross the bridge each day, by car, bus and bicycle
        and on foot, and the footways are shut along with the road. From this
        morning, drivers are sent north to the Tollgate Road crossing, a detour
        of four miles that added 35 minutes to the journey at the height of the
        rush hour. Bus routes 4, 11 and 27 stop short at Kessel Street and start
        again on the far bank, and the council has put on a free foot ferry from
        Quay Steps, running every 15 minutes from 6am to 10pm.
      </p>
      <p className={paragraph}>
        For the businesses at the foot of the bridge, the closure came without
        warning. Selin Duraković has run the Slipway Café on the east side for
        11 years and says most of her morning trade walks over from the west
        bank. &ldquo;By nine I had sold 14 coffees. On a normal Wednesday it is
        closer to 90,&rdquo; she said. &ldquo;I can last six weeks like this,
        perhaps. I cannot last six months.&rdquo;
      </p>

      <blockquote className="max-w-xl border-t-2 border-b py-4">
        <p className="font-sans text-h2 font-normal text-foreground italic">
          Nobody was going to drive over that bridge on my watch
        </p>
        <footer className={cn(label, "mt-2 text-muted-foreground not-italic")}>
          Reuben Achterberg, transport chief
        </footer>
      </blockquote>

      <p className={paragraph}>
        Councillors meet at 7pm tonight to vote on a repair that officers put at{" "}
        <mark className="bg-tertiary px-0.5 text-tertiary-foreground">
          £48m
        </mark>
        . The plan is to lift the deck a span at a time and replace all 16
        bearings, not only the four that failed, and to renew the joints and the
        road surface while the bridge is empty. Mr Achterberg said doing the
        whole job at once would cost less than coming back for the others within
        a decade.
      </p>
      <p className={paragraph}>
        The council would borrow £30m and take the rest from its reserves, and
        has asked the government for a grant towards the cost. Maren Oyelaran,
        the leader of the council, said the bridge had been checked on schedule
        and that the system had worked as it should. &ldquo;The inspection found
        the fault before anything gave way,&rdquo; she said. &ldquo;That is what
        inspections are for.&rdquo;
      </p>

      <aside
        aria-labelledby="bridge-in-numbers"
        className="flex max-w-xl flex-col gap-4 border bg-card p-4 md:p-6"
      >
        <h2 id="bridge-in-numbers" className={cn(label, "text-foreground")}>
          The bridge in numbers
        </h2>
        <dl className="flex flex-col gap-4">
          {facts.map((fact) => (
            <div key={fact.term} className="flex flex-col gap-1">
              <dt className={cn(label, "text-muted-foreground")}>
                {fact.term}
              </dt>
              <dd className="font-mono text-h2 text-foreground tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <p className={paragraph}>
        The opposition does not accept that. Tobias Verhagen, who leads the
        Harbour Alliance group, pointed to a survey from 2021 that rated the
        same bearings as poor and advised replacing them within five years. The
        work was put back twice, in 2023 and again last year, when the money
        went to the seafront road. &ldquo;This was not found on Tuesday,&rdquo;
        he said. &ldquo;It was known, it was costed and it was put off.&rdquo;
      </p>
      <p className={paragraph}>
        Mr Verhagen said his group would vote for the repair but would ask for
        an independent review of how the delay was decided, and for rate relief
        for shops and cafés within 500 metres of the bridge. Ms Oyelaran said
        she would not oppose a review.
      </p>

      <h2 className="mt-6 max-w-xl text-h2 text-foreground uppercase">
        What happens next
      </h2>

      <p className={paragraph}>
        If the vote passes, the contractor, Harlow Marine, starts on site on
        Monday 23 November. The council&rsquo;s timetable has the deck lifted by
        January, the new bearings in place by March and the bridge open again in
        the middle of May. Mr Achterberg said that date depended on the weather
        over the winter and on what the engineers find when the other 12
        bearings come out.
      </p>
      <p className={paragraph}>
        The foot ferry will run for as long as the bridge is shut, and a second
        boat joins it next week. A temporary bus lane on Tollgate Road is due by
        Friday. The council will hold a public meeting at the Corn Exchange on
        Thursday at 6pm, where residents can put questions to the engineers, and
        has promised a progress report on the first Monday of each month until
        the bridge reopens.
      </p>
    </div>
  )
}

function Rail() {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
      <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
        <h2 className={cn(label, "text-foreground")}>Latest</h2>
      </div>
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
                <p className={cn(label, "flex items-baseline gap-2")}>
                  <span className="text-primary">New</span>
                  <time
                    dateTime={`2026-11-11T${story.time}`}
                    className="text-muted-foreground tabular-nums"
                  >
                    {story.time}
                  </time>
                </p>
              ) : (
                <p className={cn(label, "text-muted-foreground")}>
                  <time
                    dateTime={`2026-11-11T${story.time}`}
                    className="tabular-nums"
                  >
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
    <section aria-labelledby="related" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
        <h2 id="related" className={cn(label, "text-foreground")}>
          Related
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
        {related.map((story, index) => (
          <article
            key={story.headline}
            className={cn(
              "flex min-w-0 flex-col gap-2",
              index > 0 &&
                "border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6",
              index < related.length - 1 && "md:pr-6"
            )}
          >
            <Picture alt={story.alt} caption={story.caption} />
            <p className={cn(label, "text-foreground")}>{story.kicker}</p>
            <h3 className="text-h2 uppercase">
              <a href="#" className={headlineLink}>
                {story.headline}
              </a>
            </h3>
            <p className={cn(label, "text-muted-foreground")}>
              {story.byline}
              {" · "}
              <time dateTime={story.dateTime} className="tabular-nums">
                {story.day}
              </time>
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer>
      <div className={cn(container, "flex flex-col gap-4 border-t-2 py-6")}>
        <a
          href="/"
          className={cn(
            "self-start font-heading text-h2 uppercase",
            headlineLink
          )}
        >
          The Port Avery Ledger
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((section) => (
              <li key={section}>
                <a href="#" className={cn(label, labelLink)}>
                  {section}
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
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <div className={cn(container, "flex flex-col gap-12 pt-6 pb-12")}>
          <article className="flex flex-col gap-12">
            <StoryHead />

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Picture
                  alt="Steel barriers and a road closed sign stand across the empty roadway of the Kessel Street Bridge, with the channel and the east bank behind"
                  caption="The Kessel Street Bridge on Tuesday evening · Photograph: Odile Marsh"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
              <StoryBody />
              <Rail />
            </div>

            <Related />
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
