import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1248px] px-6"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focus
)
const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
  focus
)
const label = "font-mono text-label uppercase"
const smallFigure =
  "font-mono text-label uppercase tabular-nums text-muted-foreground"

const navItems = [
  { label: "Lessons", href: "/lessons" },
  { label: "Forecast", href: "/forecast" },
  { label: "Guide", href: "/guide" },
  { label: "Book", href: "/booking" },
]

const lessons = [
  {
    id: "first-waves",
    level: "Beginners",
    name: "First Waves",
    facts: "2 h · Up to 8 per coach · Ages 8 and up",
    text: "For anyone who has never stood on a board. You learn to read the water, paddle, and get to your feet in waist-deep white water.",
    price: "£42",
  },
  {
    id: "green-waves",
    level: "Improvers",
    name: "Green Waves",
    facts: "2 h 30 min · Up to 6 per coach · Ages 12 and up",
    text: "For surfers who can stand up in white water and want to paddle out the back and ride along unbroken waves.",
    price: "£55",
  },
  {
    id: "private-coaching",
    level: "Any level",
    name: "Private Coaching",
    facts: "1 h 30 min · 1 to 4 people · Ages 6 and up",
    text: "One coach for you, your family or a few friends, at your pace. Good for nervous starters and for fixing one stubborn habit.",
    price: "£85",
  },
]

const toBring = [
  "Swimwear to wear under the wetsuit",
  "A towel and something warm for afterwards",
  "Sun cream, also on a grey day",
  "A bottle of water",
]

function Figure({ value, unit }: { value: ReactNode; unit: string }) {
  return (
    <dd className="flex flex-wrap items-baseline gap-x-2">
      {value}
      <span className={label}>{unit}</span>
    </dd>
  )
}

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
              focus
            )}
          >
            Sandhopper
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-24 pt-10 pb-24")}>
        {/* Opening */}
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:px-10 md:py-24">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className={label}>Pentarrow Sands · Tolven coast</p>
                <h1 id="opening-heading" className="text-h1 md:text-display">
                  Learn to surf at Pentarrow Sands
                </h1>
              </div>
              <p className="max-w-xl text-body">
                Small groups, patient coaches and a wide sandy beach with gentle
                waves. Every lesson includes your wetsuit and your board.
              </p>
            </div>
            <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
              <li className={label}>Lessons from £42</li>
              <li className={label}>Ages 6 and up</li>
              <li className={label}>Every day of the year</li>
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/booking"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 w-full rounded-md px-6 font-mono text-label uppercase md:w-auto"
              )}
            >
              Book a lesson
            </a>
            <p className="text-body">
              <a href="/lessons" className={textLink}>
                See the lessons and prices
              </a>
            </p>
          </div>
        </section>

        {/* Today's conditions */}
        <section
          aria-labelledby="conditions-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10">
            <div className="flex flex-col gap-2">
              <p className={cn(label, "tabular-nums")}>
                <time dateTime="2027-06-17">Thursday 17 June 2027</time> ·
                Updated <time dateTime="06:40">06:40</time>
              </p>
              <h2 id="conditions-heading" className="text-h2">
                Today at the beach
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Tide</dt>
                <Figure
                  value={
                    <time
                      dateTime="13:34"
                      className="font-heading text-h1 tabular-nums"
                    >
                      13:34
                    </time>
                  }
                  unit="low"
                />
                <dd className={cn(label, "tabular-nums")}>
                  1.5 m · High at <time dateTime="19:41">19:41</time>
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Swell</dt>
                <Figure
                  value={
                    <span className="font-heading text-h1 tabular-nums">3</span>
                  }
                  unit="ft"
                />
                <dd className={cn(label, "tabular-nums")}>
                  9 s · From the west
                </dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Wind</dt>
                <Figure
                  value={
                    <span className="font-heading text-h1 tabular-nums">8</span>
                  }
                  unit="mph"
                />
                <dd className={label}>East · Offshore</dd>
              </div>
              <div className="flex flex-col gap-2 border-t border-lagoon-foreground pt-4">
                <dt className={label}>Water</dt>
                <Figure
                  value={
                    <span className="font-heading text-h1 tabular-nums">
                      15
                    </span>
                  }
                  unit="°C"
                />
                <dd className={label}>Summer wetsuit</dd>
              </div>
            </dl>
            <p className="max-w-xl text-body">
              Clean, waist-high waves and a light offshore wind. A good day for
              a first lesson, best in the two hours either side of low water.
            </p>
          </div>
          <p className="text-body">
            Planning ahead? See{" "}
            <a href="/forecast" className={textLink}>
              the five-day forecast
            </a>
            .
          </p>
        </section>

        {/* Three lessons */}
        <section
          aria-labelledby="lessons-heading"
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <h2 id="lessons-heading" className="text-h2">
              Three ways to start
            </h2>
            <p className="max-w-xl text-body">
              We set the start time by the tide, between{" "}
              <time dateTime="09:00" className="tabular-nums">
                09:00
              </time>{" "}
              and{" "}
              <time dateTime="15:00" className="tabular-nums">
                15:00
              </time>
              , and email it to you by{" "}
              <time dateTime="18:00" className="tabular-nums">
                18:00
              </time>{" "}
              the day before.
            </p>
          </div>
          <ul className="grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
              >
                <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                  {lesson.level}
                </Badge>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h2 text-foreground">{lesson.name}</h3>
                  <p className={smallFigure}>{lesson.facts}</p>
                </div>
                <p className="text-body text-foreground">{lesson.text}</p>
                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-heading text-h2 text-foreground tabular-nums">
                      {lesson.price}
                    </span>
                    <span className={cn(label, "text-muted-foreground")}>
                      a person
                    </span>
                  </p>
                  <p className="text-body">
                    <a
                      href="/lessons"
                      aria-label={`What is included in ${lesson.name}`}
                      className={textLink}
                    >
                      What is included
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Where to find us */}
        <section
          aria-labelledby="find-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-7">
            <div className="flex flex-col gap-4">
              <h2 id="find-heading" className="text-h2">
                Find us on the sand
              </h2>
              <p className="max-w-xl text-body">
                We work from the Boat Shed, the hut at the foot of the slipway.
                Park in the Beach Road car park and walk down past the café: it
                takes four minutes. Come 20 minutes before your lesson to get
                into your wetsuit.
              </p>
            </div>
            <dl className="divide-y divide-border">
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className={cn(label, "shrink-0 text-muted-foreground")}>
                  Address
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <address className="not-italic">
                    <span className="block">The Boat Shed, Beach Road</span>
                    <span className="block">Pentarrow Sands</span>
                    <span className="block">ZP7 3SB</span>
                  </address>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className={cn(label, "shrink-0 text-muted-foreground")}>
                  Open
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  Every day,{" "}
                  <time dateTime="08:30" className="tabular-nums">
                    08:30
                  </time>
                  –
                  <time dateTime="18:00" className="tabular-nums">
                    18:00
                  </time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className={cn(label, "shrink-0 text-muted-foreground")}>
                  Parking
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  Beach Road car park, £5 a day
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                <dt className={cn(label, "shrink-0 text-muted-foreground")}>
                  Phone
                </dt>
                <dd className="min-w-0 text-right text-body text-foreground">
                  <a href="tel:+441632960418" className={textLink}>
                    01632 960 418
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9">
            <h3 className="text-h2 text-foreground">What to bring</h3>
            <ul className="flex list-none flex-col gap-4 p-0">
              {toBring.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check
                    className="mt-1 size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="text-body text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-label text-muted-foreground">
              We lend you the wetsuit, the boots and the board.
            </p>
          </div>
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
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Every day · <time dateTime="08:30">08:30</time>–
              <time dateTime="18:00">18:00</time> · © 2027 Sandhopper Surf
              School
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
