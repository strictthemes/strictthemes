import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1248px] px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label uppercase text-foreground underline-offset-4 hover:underline",
  focusRing
)
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focusRing
)
const label = "font-mono text-label uppercase"
const smallFigure =
  "font-mono text-label uppercase tabular-nums text-muted-foreground"
const card = "rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
const paragraph = "max-w-xl text-body"

const navItems = [
  { label: "Lessons", href: "/lessons" },
  { label: "Forecast", href: "/forecast" },
  { label: "Guide", href: "/guide", current: true },
  { label: "Book", href: "/booking" },
]

function Time({ value, children }: { value: string; children: string }) {
  return (
    <time dateTime={value} className="tabular-nums">
      {children}
    </time>
  )
}

const facts = [
  {
    term: "Parking",
    value: (
      <>
        Beach Road car park, 180 spaces, £5 a day. Full by{" "}
        <Time value="10:30">10:30</Time> on sunny weekends.
      </>
    ),
  },
  {
    term: "Lifeguards",
    value: (
      <>
        On duty <Time value="10:00">10:00</Time>–
        <Time value="18:00">18:00</Time>, every day from{" "}
        <time dateTime="2027-05-15">15 May</time> to{" "}
        <time dateTime="2027-09-26">26 September 2027</time>.
      </>
    ),
  },
  { term: "Best state of tide", value: "Two hours either side of low water." },
  {
    term: "Hazards",
    value:
      "A rip current beside the north rocks. Weever fish in the shallows at low water.",
  },
  {
    term: "Facilities",
    value:
      "Toilets and a tap at the car park. Hot showers at the Boat Shed, £1.",
  },
  {
    term: "Dogs",
    value:
      "Welcome from 1 October to 30 April, and on a lead on the slipway.",
  },
]

const guides = [
  {
    id: "guide-skerrin",
    badge: "Improvers",
    name: "Skerrin Cove",
    figure: "4 miles north · Best at mid tide",
    text: "A small, steep cove that turns a modest swell into fast, hollow waves. For surfers who can already turn.",
    link: "Read the guide to Skerrin Cove",
  },
  {
    id: "guide-maddow",
    badge: "All levels",
    name: "Maddow Strand",
    figure: "7 miles south · Best at low water",
    text: "Three miles of open beach that picks up any swell going. Quiet, with no lifeguards, and best on small days.",
    link: "Read the guide to Maddow Strand",
  },
]

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(container, "flex flex-wrap items-center gap-x-6 py-2")}
        >
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focusRing
            )}
          >
            Sandhopper
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(navLink, item.current && "underline")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-24 pt-10 pb-24")}>
        <section aria-labelledby="page-title" className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className={label}>Beach guide · Tolven coast</p>
                <h1 id="page-title" className="text-h1 md:text-display">
                  Pentarrow Sands
                </h1>
              </div>
              <p className={paragraph}>
                A mile of west-facing sand with gentle, even waves: the best
                beach on this coast to learn on, and the one where our lessons
                run.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
            >
              TR
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-body font-bold text-foreground">Tamsin Rowe</p>
              <p className={smallFigure}>
                Head coach · Updated{" "}
                <time dateTime="2027-06-03">3 June 2027</time> · 6 minute read
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6">
          <aside
            aria-labelledby="at-a-glance"
            className="flex flex-col gap-6 md:col-span-4 md:col-start-9"
          >
            <div className={card}>
              <h2 id="at-a-glance" className="text-h2">
                At a glance
              </h2>
              <dl className="divide-y divide-border">
                {facts.map((fact) => (
                  <div
                    key={fact.term}
                    className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
                  >
                    <dt className={cn(label, "shrink-0 text-muted-foreground")}>
                      {fact.term}
                    </dt>
                    <dd className="min-w-0 text-body text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={card}>
              <h2 className="text-h2">Learn on this beach</h2>
              <p className="text-body">
                Our lessons run here every day of the year, from £42 a person,
                wetsuit and board included.
              </p>
              <a
                href="/booking"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 w-full rounded-md px-6 font-mono text-label uppercase"
                )}
              >
                Book a lesson
              </a>
            </div>
          </aside>

          <article
            aria-label="Guide to Pentarrow Sands"
            className="flex flex-col gap-10 md:col-span-7 md:col-start-1 md:row-start-1"
          >
            <section aria-labelledby="the-beach" className="flex flex-col gap-4">
              <h2 id="the-beach" className="text-h2">
                The beach
              </h2>
              <p className={paragraph}>
                Pentarrow Sands is a mile of pale sand facing due west, between
                the north rocks and the mouth of the Tolven stream. The beach
                shelves so gently that at low water you can walk two hundred
                metres out and still be waist deep.
              </p>
              <p className={paragraph}>
                That gentle slope is why we teach here. Waves break early, lose
                their power and roll in as long lines of white water: easy to
                catch, soft to fall off, and much the same from one day to the
                next.
              </p>
            </section>

            <section
              aria-labelledby="when-to-surf"
              className="flex flex-col gap-4"
            >
              <h2 id="when-to-surf" className="text-h2">
                When to surf
              </h2>
              <p className={paragraph}>
                The beach is at its best for two hours either side of low water.
                The waves break over flat sand then, well away from the rocks,
                and there is room for everybody.
              </p>
              <p className={paragraph}>
                At high water the sea reaches the pebble bank at the top of the
                beach and the waves break hard onto it. It is no place to learn,
                and our lessons never run then. Check the time of low water in{" "}
                <a href="/forecast" className={textLink}>
                  the forecast
                </a>{" "}
                before you set off.
              </p>
              <ul className="flex max-w-xl list-disc flex-col gap-2 pl-6 text-body">
                <li>A small swell, 1 to 3 ft: good for a first lesson.</li>
                <li>
                  A middling swell, 3 to 5 ft: good for improvers, out the back.
                </li>
                <li>
                  Over 5 ft, or a strong onshore wind: stay in the white water,
                  or come another day.
                </li>
              </ul>
            </section>

            <section
              aria-labelledby="staying-safe"
              className="flex flex-col gap-4"
            >
              <h2 id="staying-safe" className="text-h2">
                Staying safe
              </h2>
              <p className={paragraph}>
                In season the lifeguards put out two kinds of flags. Swim and
                bodyboard between the red and yellow ones; surf between the
                black and white ones. If no flags are flying, nobody is watching
                the water.
              </p>
              <div className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className={label}>Safety tip</p>
                    <h3 className="text-h2">
                      Caught in a rip? Float, then swim sideways
                    </h3>
                  </div>
                  <p className={paragraph}>
                    A rip is a channel of water running out to sea. Do not swim
                    against it. Lie back, raise one arm and shout. When the pull
                    eases, swim along the beach until you are clear, then come
                    in with the waves.
                  </p>
                </div>
              </div>
              <p className={paragraph}>
                The one rip to know runs beside the north rocks, and is
                strongest in the hour after high water. Weever fish bury
                themselves in the warm shallows at low water in summer: wear
                wetsuit boots, and if one stings you, the lifeguards have hot
                water, which stops the pain.
              </p>
            </section>

            <section
              aria-labelledby="getting-there"
              className="flex flex-col gap-4"
            >
              <h2 id="getting-there" className="text-h2">
                Getting there and parking
              </h2>
              <p className={paragraph}>
                Follow Beach Road to its end, a mile and a half from the village
                of Pentarrow. The car park has 180 spaces and costs £5 a day;
                the machine takes cards and coins. On a sunny weekend in July or
                August it is full by <Time value="10:30">10:30</Time>.
              </p>
              <p className={paragraph}>
                The number 14 bus from Tolven stops at the top of Beach Road
                once an hour, a ten-minute walk from the sand. There are bike
                racks beside the Boat Shed.
              </p>
            </section>

            <section
              aria-labelledby="after-your-surf"
              className="flex flex-col gap-4"
            >
              <h2 id="after-your-surf" className="text-h2">
                After your surf
              </h2>
              <p className={paragraph}>
                The Slipway Café opens at <Time value="08:00">08:00</Time> and
                does a bacon roll for £4 and a hot chocolate that has rescued
                many a cold surfer. Rinse your kit at the tap by the car park,
                or take a hot shower at the Boat Shed for £1.
              </p>
            </section>
          </article>
        </div>

        <section aria-labelledby="more-guides" className="flex flex-col gap-6">
          <h2 id="more-guides" className="text-h2">
            More beach guides
          </h2>
          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.id} className={card}>
                <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                  {guide.badge}
                </Badge>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h2">{guide.name}</h3>
                  <p className={smallFigure}>{guide.figure}</p>
                </div>
                <p className={paragraph}>{guide.text}</p>
                <p className="mt-auto text-body">
                  <a href="#" className={textLink}>
                    {guide.link}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between"
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="font-heading text-h2">Sandhopper Surf School</p>
            <p className="text-body">
              Surf lessons and kit hire at Pentarrow Sands since 2009.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <p className={cn(label, "text-muted-foreground")}>
              The Boat Shed · Beach Road · Pentarrow Sands · ZP7 3SB
            </p>
            <p className="text-body">
              <a href="tel:+441632960418" className={textLink}>
                01632 960 418
              </a>{" "}
              ·{" "}
              <a href="mailto:hello@sandhopper.example" className={textLink}>
                hello@sandhopper.example
              </a>
            </p>
            <p className={cn(label, "text-muted-foreground")}>
              Every day · <Time value="08:30">08:30</Time>–
              <Time value="18:00">18:00</Time> · © 2027 Sandhopper Surf School
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
