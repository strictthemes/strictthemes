import { useRef, useState, type KeyboardEvent } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

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
const currentSection = "News"

const latest = [
  {
    headline: "Ferry adds extra sailings from Monday",
    time: "10:05",
    isNew: true,
  },
  { headline: "Bus lanes open on Harbour Road", time: "09:20" },
  { headline: "Schools warn parents of late starts", time: "08:45" },
  { headline: "Traders ask council for rates relief", time: "07:50" },
  { headline: "Rowing club moves its winter races", time: "06:40" },
]

const related = [
  {
    kicker: "City",
    headline: "Inspectors flagged the bearings in 2023",
    byline: "By Tomas Reinholt",
    day: "TUE 10 NOV",
    dateTime: "2026-11-10",
    picture:
      "An inspector in a hard hat looks up at the steel underside of a bridge",
    caption: "UNDER THE CENTRAL SPAN IN MARCH · PHOTOGRAPH: ODILE MARSH",
  },
  {
    kicker: "Business",
    headline: "Bridge cafés brace for a quiet winter",
    byline: "By Ines Farkas",
    day: "TUE 10 NOV",
    dateTime: "2026-11-10",
    picture: "Empty tables and folded chairs outside a café on a wet street",
    caption: "KESSEL STREET ON TUESDAY AFTERNOON · PHOTOGRAPH: JONAH PELL",
  },
  {
    kicker: "Politics",
    headline: "Council split over road repair budget",
    byline: "By Hana Lindqvist",
    day: "SUN 8 NOV",
    dateTime: "2026-11-08",
    picture:
      "Councillors seated around a long table in a wood-panelled chamber",
    caption: "THE COUNCIL CHAMBER IN OCTOBER · PHOTOGRAPH: ODILE MARSH",
  },
]

function Masthead({ className }: { className?: string }) {
  return (
    <a
      href="/"
      className={cn(
        "font-heading text-h2 text-foreground uppercase decoration-2 underline-offset-4 transition-colors duration-150 hover:underline",
        focusRing,
        className
      )}
    >
      The Port Avery Ledger
    </a>
  )
}

function SectionHead({ id, children }: { id?: string; children: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2 id={id} className={cn(label, "text-foreground")}>
        {children}
      </h2>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header onKeyDown={handleKeyDown}>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <p className={cn(label, "text-muted-foreground tabular-nums")}>
            <time dateTime="2026-11-11">WEDNESDAY 11 NOVEMBER 2026</time>
          </p>
          <a
            href="#"
            className={cn(
              buttonVariants(),
              "h-auto px-4 py-2 font-mono text-label uppercase"
            )}
          >
            Subscribe
          </a>
        </div>

        <div className="flex items-center justify-between gap-4 border-t-2 border-b py-4 md:border-b-0">
          <Masthead />
          <Button
            ref={menuButton}
            variant="outline"
            aria-expanded={menuOpen}
            aria-controls="sections-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="h-auto px-4 py-2 font-mono text-label uppercase md:hidden"
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
            {sections.map((section) => {
              const current = section === currentSection
              return (
                <li key={section}>
                  <a
                    href="#"
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      label,
                      labelLink,
                      "block py-2",
                      current && "underline decoration-2"
                    )}
                  >
                    {section}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((section) => {
              const current = section === currentSection
              return (
                <li key={section}>
                  <a
                    href="#"
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      label,
                      labelLink,
                      current && "underline decoration-2"
                    )}
                  >
                    {section}
                  </a>
                </li>
              )
            })}
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
        <Masthead className="self-start" />
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

const para = "max-w-xl text-body"

function StoryBody() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
      <p className={para}>
        The Kessel Street Bridge will stay closed for at least six months after
        inspectors found cracked bearings under its central span, Port Avery
        City Council said on Tuesday. Engineers shut the crossing to traffic and
        pedestrians at noon, less than two hours after the cracks were reported,
        and police turned back drivers at both ends through the afternoon rush.
      </p>
      <p className={para}>
        Councillors meet at 18:00 tonight to vote on a repair plan that would
        replace all eight bearings and strengthen the deck above them. The plan
        costs{" "}
        <mark className="bg-tertiary px-0.5 text-tertiary-foreground">
          £48m
        </mark>
        , the largest sum the city has set aside for a single road project in
        more than twenty years. If it passes, work would start in December.
      </p>
      <p className={para}>
        About 40,000 people cross the bridge each day, by car, bus, bicycle and
        on foot. It is the shortest link between the old town and the Northgate
        estates, and the only crossing of the river within two miles of the
        harbour. Until it reopens, drivers face a diversion of about four miles
        through the Ferris Road junction, which already queues at peak hours.
      </p>
      <p className={para}>
        The cracks were found during a routine inspection on Monday night and
        reported to the council on Tuesday morning. The council has published{" "}
        <a href="#" className={textLink}>
          the engineers’ inspection report
        </a>
        , which says two of the bearings have split and a third shows early
        signs of the same fault. The report finds no damage to the deck itself,
        but says the bridge cannot carry any load safely until the bearings are
        replaced.
      </p>

      <blockquote className="max-w-xl border-t-2 border-b py-4">
        <p className="font-sans text-h2 font-normal italic">
          Nobody wants to close a bridge this busy, but we will not ask people
          to cross it until we know it is safe.
        </p>
        <footer className={cn(label, "mt-2 text-muted-foreground not-italic")}>
          Reuben Achterberg, transport chief
        </footer>
      </blockquote>

      <p className={para}>
        Reuben Achterberg, the council’s transport chief, said the decision to
        close the bridge was made within an hour of the report reaching his
        desk. “We had a choice between a long closure now and a much worse one
        later,” he said. “The bearings are original to the bridge. They have
        done sixty years of work, and they have reached the end of it.”
      </p>
      <p className={para}>
        He said the council would run a free shuttle bus between the two ends of
        the bridge from Thursday, every ten minutes from 06:00 to midnight, and
        would ask the harbour ferry to add sailings at peak times. Cyclists will
        be allowed to take bicycles on the shuttle at no charge.
      </p>

      <aside
        aria-labelledby="bridge-numbers"
        className="flex max-w-xl flex-col gap-4 border bg-card p-4 md:p-6"
      >
        <h2 id="bridge-numbers" className={cn(label, "text-foreground")}>
          The bridge in numbers
        </h2>
        <dl className="flex flex-col gap-4">
          {[
            ["Opened", "1964"],
            ["Crossings a day", "40,000"],
            ["Closed for", "6 months"],
            ["Repair cost", "£48m"],
          ].map(([term, value]) => (
            <div key={term} className="flex flex-col gap-1">
              <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
              <dd className="font-mono text-h2 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <p className={para}>
        On Kessel Street itself, the closure was felt within hours. Selin
        Duraković, who has run a café at the south end of the bridge for eleven
        years, said Tuesday afternoon was the quietest she had known. “Half my
        customers walk over that bridge on their way to work,” she said. “I
        understand why it had to close. I just need to know how long, and
        whether anyone will help us get through it.”
      </p>
      <p className={para}>
        Traders on both sides of the river have asked the council for a cut in
        business rates while the bridge is shut. Mr Achterberg said the request
        would be considered, but that it was a matter for the finance committee
        and not part of tonight’s vote.
      </p>

      <h2 className="mt-6 max-w-xl text-h2 uppercase">What happens next</h2>

      <p className={para}>
        The opposition has said it will back the repair, but not the way the
        council plans to pay for it. Under the proposal, £30m would come from
        the city’s road budget over three years, with the rest borrowed. Dalia
        Okonkwo-Brandt, who leads the opposition group, said that would leave
        too little for other roads. “Fixing one bridge should not mean letting
        every pothole in Port Avery wait until 2029,” she said.
      </p>
      <p className={para}>
        She also asked why the bearings had not been replaced sooner, noting
        that an earlier inspection had marked them for close watching. The
        council said those findings had been followed up and that the cracks
        found on Monday were new.
      </p>
      <p className={para}>
        If councillors approve the plan tonight, contractors will be asked to
        bid this month, and the council expects to name one before Christmas. Mr
        Achterberg said six months was a careful estimate and the bridge would
        reopen sooner only if the work allowed it. If the vote fails, the bridge
        stays closed while a new plan is drawn up.
      </p>
    </div>
  )
}

function Rail() {
  return (
    <div className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
      <SectionHead>Latest</SectionHead>
      <ul className="flex flex-col gap-4">
        {latest.map((story, index) => (
          <li key={story.headline} className={cn(index > 0 && "border-t pt-4")}>
            <article className="flex flex-col gap-1">
              <h3 className="font-heading text-body font-bold uppercase">
                <a href="#" className={headlineLink}>
                  {story.headline}
                </a>
              </h3>
              <p
                className={cn(
                  label,
                  "text-muted-foreground tabular-nums",
                  story.isNew && "flex items-baseline gap-2"
                )}
              >
                {story.isNew && <span className="text-primary">New</span>}
                <time dateTime={`2026-11-11T${story.time}`}>{story.time}</time>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Related() {
  return (
    <section aria-labelledby="related-head" className="flex flex-col gap-4">
      <SectionHead id="related-head">Related</SectionHead>
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
            <Picture description={story.picture} caption={story.caption} />
            <p className={cn(label, "text-foreground")}>{story.kicker}</p>
            <h3 className="text-h2 uppercase">
              <a href="#" className={headlineLink}>
                {story.headline}
              </a>
            </h3>
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              {story.byline} ·{" "}
              <time dateTime={story.dateTime}>{story.day}</time>
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
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-10">
                <p className={cn(label, "tabular-nums")}>
                  <a href="#" className={labelLink}>
                    Transport
                  </a>
                  <span className="text-muted-foreground">
                    {" · "}
                    <time dateTime="2026-11-11T06:15">06:15</time>
                  </span>
                </p>
                <h1 className="text-h1 uppercase md:text-display">
                  Bridge shut for six months
                </h1>
                <p className="max-w-3xl font-sans text-h2 font-normal">
                  The Kessel Street Bridge will stay closed until May after
                  inspectors found cracked bearings, and the council votes
                  tonight on a £48m repair.
                </p>
                <div className={cn(label, "flex flex-col gap-1 tabular-nums")}>
                  <p className="text-foreground">
                    By Hana Lindqvist, City Reporter
                  </p>
                  <p className="text-muted-foreground">
                    Updated <time dateTime="2026-11-11T09:40">09:40</time>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Picture
                  description="The Kessel Street Bridge with metal barriers and closure signs across both lanes, and a police officer at the barrier"
                  caption="BARRIERS ACROSS THE KESSEL STREET BRIDGE ON TUESDAY · PHOTOGRAPH: ODILE MARSH"
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
      <Footer />
    </div>
  )
}

export default App
