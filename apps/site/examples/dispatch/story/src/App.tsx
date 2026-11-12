import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const labelLink = cn(
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const headlineLink = cn(
  "text-foreground decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const mastheadLink = cn(
  "font-heading text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
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
const currentSection = "News"

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
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
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <p className={cn(label, "text-muted-foreground")}>
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              WEDNESDAY 11 NOVEMBER 2026
            </time>
          </p>
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <a href="/" className={cn(mastheadLink, "text-h2")}>
            The Port Avery Ledger
          </a>
          <Button
            ref={menuButton}
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
            {sections.map((section) => (
              <li key={section}>
                <SectionLink section={section} />
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
            {sections.map((section) => (
              <li key={section}>
                <SectionLink section={section} block />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SectionLink({
  section,
  block = false,
}: {
  section: string
  block?: boolean
}) {
  const current = section === currentSection
  return (
    <a
      href="#"
      aria-current={current ? "page" : undefined}
      className={cn(
        label,
        current
          ? cn(
              "text-foreground underline decoration-2 underline-offset-4 transition-colors duration-150",
              focusRing
            )
          : labelLink,
        block && "block py-2"
      )}
    >
      {section}
    </a>
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
          © <span className="tabular-nums">2026</span> The Port Avery Ledger ·
          Port Avery
        </p>
      </div>
    </footer>
  )
}

function Picture({
  description,
  caption,
}: {
  description: string
  caption: string
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={description}
        className="aspect-3/2 w-full bg-muted"
      />
      <figcaption className={cn(label, "text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  )
}

function StoryHead() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
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
          Cracked bearings close the Kessel Street Bridge until May, and
          councillors vote tonight on a £48m plan to fix it.
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

function LeadPicture() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
      <div className="lg:col-span-8">
        <Picture
          description="The Kessel Street Bridge seen from the south bank, with red and white barriers across both lanes and the road beyond them empty."
          caption="The Kessel Street Bridge on Tuesday, with barriers across both lanes · Photograph: Odile Marsh"
        />
      </div>
    </div>
  )
}

const facts = [
  { term: "Opened", value: "1964" },
  { term: "Crossings a day", value: "40,000" },
  { term: "Closed for", value: "6 months" },
  { term: "Repair cost", value: "£48m" },
]

function Body() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
      <p className="max-w-xl">
        The Kessel Street Bridge will stay closed to all traffic for at least
        six months after inspectors found cracked bearings beneath its central
        span, Port Avery council said on Tuesday. The bridge, which carries the
        city’s busiest road across the River Mell, was shut at 14:00 with barely
        an hour’s warning.
      </p>
      <p className="max-w-xl">
        The inspection that found the cracks was a routine one, carried out
        every five years. Engineers working under the deck on Monday saw that
        two of the steel bearings that let the bridge expand and contract had
        split. When they checked the others, they found smaller cracks in four
        more. Their report says the bridge was not at risk of falling but could
        no longer safely carry heavy traffic.
      </p>
      <p className="max-w-xl">
        Councillors vote tonight on a{" "}
        <mark className="bg-tertiary px-0.5 text-tertiary-foreground">
          £48m
        </mark>{" "}
        repair plan that would replace all twelve bearings and strengthen the
        deck. If the plan passes, work would start in January and the bridge
        would reopen to cars, buses and cyclists in May.
      </p>
      <p className="max-w-xl">
        About 40,000 people cross the bridge on an ordinary weekday, on foot, by
        bike, by bus and by car. From this morning they are being sent the long
        way round, over the Harbour Road bridge two kilometres downstream, or
        across the water on the ferry from Quay Steps. The first rush hour of
        the closure brought queues of up to 50 minutes on Harbour Road, and
        several bus routes ran late all morning.
      </p>
      <blockquote className="max-w-xl border-t-2 border-b py-4">
        <p className="font-sans text-h2 font-normal text-foreground italic">
          We would rather annoy forty thousand people for six months than take a
          chance with any one of them.
        </p>
        <footer className={cn(label, "mt-2 text-muted-foreground not-italic")}>
          Reuben Achterberg, Transport Chief
        </footer>
      </blockquote>
      <p className="max-w-xl">
        For the businesses at either end of the bridge, the closure came without
        warning. Selin Duraković has run the Bridgefoot Café on the south bank
        for eleven years, and she says most of her morning trade walks over from
        the north side. “Yesterday afternoon the street went quiet, and this
        morning it stayed quiet,” she said. “Six months is a long time to wait
        for customers who can’t reach you.”
      </p>
      <p className="max-w-xl">
        Reuben Achterberg, the council’s transport chief, said the decision to
        close the bridge at once was his. “I read the report at lunchtime and
        the barriers were up within the hour,” he said. “We would rather annoy
        forty thousand people for six months than take a chance with any one of
        them.”
      </p>
      <aside
        aria-labelledby="bridge-facts"
        className="flex max-w-xl flex-col gap-4 border bg-card p-4 md:p-6"
      >
        <h2
          id="bridge-facts"
          className="font-mono text-label text-foreground uppercase"
        >
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
      <p className="max-w-xl">
        The council has added extra buses on the 14 and 22 routes, which now
        cross at Harbour Road, and from today the ferry runs every ten minutes
        instead of every twenty, with fares cut to £1. People on foot and on
        bikes will be able to use a temporary footbridge from next week. Every
        change to routes and times is listed on{" "}
        <a href="#" className={textLink}>
          the council’s closure page
        </a>
        .
      </p>
      <p className="max-w-xl">
        The opposition on the council says the cracks should have been found
        sooner. Ilse Brandvold, who leads the Harbour Party group, said a report
        in 2023 had already asked for the bearings to be checked. “This did not
        come out of nowhere,” she said. “The council knew this bridge was
        getting old and <em>chose</em> to wait.” Her group will back the repair
        plan tonight, but it will also ask for an independent review of how the
        bridge has been looked after.
      </p>
      <h2 className="mt-6 max-w-xl text-h2 text-foreground uppercase">
        What happens next
      </h2>
      <p className="max-w-xl">
        If councillors approve the plan, the council will hire a contractor
        before Christmas. The repair would be paid for from the city’s transport
        budget and a loan, which the council says would mean putting off the
        resurfacing of the ring road by two years. If the plan is voted down,
        the bridge stays shut while officers draw up a new one.
      </p>
      <p className="max-w-xl">
        Achterberg said the council would publish a weekly update on the work
        and on traffic at the other crossings. “People deserve to know where we
        are, every week, in plain words,” he said. The vote starts at 19:00 at
        the city hall and will be shown live on the council’s website.
      </p>
      <p className="max-w-xl">
        Duraković says she will watch it from the café. “I’ll keep the lights
        on,” she said. “Somebody has to be here when they open it again.”
      </p>
    </div>
  )
}

const latest = [
  { headline: "Ferry to run every ten minutes", time: "09:52", isNew: true },
  { headline: "Harbour Road queues hit 50 minutes", time: "09:10" },
  { headline: "School buses take the long way round", time: "08:35" },
  { headline: "Quay Steps market moves to Sunday", time: "07:50" },
  { headline: "Rain due by the evening rush", time: "07:05" },
]

function Rail() {
  return (
    <section
      aria-labelledby="latest-heading"
      className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6"
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
    </section>
  )
}

const related = [
  {
    kicker: "City",
    headline: "How the city keeps its bridges up",
    byline: "By Tomas Ekwall",
    day: "Mon 9 Nov",
    date: "2026-11-09",
    description:
      "Two engineers in hard hats on a walkway under a bridge deck, shining torches at the steelwork.",
    caption: "Inspectors under the Harbour Road bridge · Photograph: Odile Marsh",
  },
  {
    kicker: "Politics",
    headline: "Council budget gap grows to £12m",
    byline: "By Hana Lindqvist",
    day: "Sun 8 Nov",
    date: "2026-11-08",
    description:
      "The council chamber from the public gallery, with councillors seated in a horseshoe of wooden benches.",
    caption: "The council chamber at the city hall · Photograph: Jonas Pell",
  },
  {
    kicker: "Business",
    headline: "South bank shops ask for rate relief",
    byline: "By Marit Oyelaran",
    day: "Fri 6 Nov",
    date: "2026-11-06",
    description:
      "A row of small shopfronts on a quiet street by the river, one with a hand-written sign in the window.",
    caption: "Shops on Mell Parade · Photograph: Jonas Pell",
  },
]

function Related() {
  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
        <h2
          id="related-heading"
          className="font-mono text-label text-foreground uppercase"
        >
          Related
        </h2>
      </div>
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
            <Picture description={story.description} caption={story.caption} />
            <p className={cn(label, "text-foreground")}>{story.kicker}</p>
            <h3 className="text-h2 uppercase">
              <a href="#" className={headlineLink}>
                {story.headline}
              </a>
            </h3>
            <p className={cn(label, "text-muted-foreground")}>
              {story.byline} ·{" "}
              <time dateTime={story.date} className="tabular-nums">
                {story.day}
              </time>
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
            <LeadPicture />
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
