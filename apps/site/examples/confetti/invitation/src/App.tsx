import { CalendarDays, MapPin, Shirt } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1088px] px-6"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const card = "flex flex-col gap-3 rounded-xl border border-border bg-card p-6"

const smallFigure = "font-mono text-label text-muted-foreground tabular-nums"

const navItems = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day" },
  { label: "Guestbook", href: "/guestbook" },
]

const plan = [
  { time: "14:00", what: "The ceremony, in the barn" },
  { time: "17:00", what: "Dinner at long tables" },
  { time: "20:00", what: "Dancing with The Saltry Reelers" },
  { time: "23:30", what: "The last minibus to Market Fenley" },
]

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center gap-x-6 gap-y-2 py-3"
          )}
        >
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focusOutline
            )}
          >
            Clem &amp; Rafe
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

      <main className={cn(container, "flex flex-col gap-22 pt-10 pb-22")}>
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col items-center gap-6 rounded-xl bg-blush p-6 text-center text-blush-foreground md:px-10 md:py-22"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-label">
                Together with their families
              </p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                Clem &amp; Rafe
              </h1>
            </div>
            <p className="max-w-xl text-body">
              would love you to be there on the day they marry.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-heading text-h2 md:text-h1">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time>
            </p>
            <p className="font-mono text-label">
              <time dateTime="14:00">14:00</time> · Quillbrook Barn, Little
              Saltry
            </p>
          </div>
        </section>

        <section
          aria-labelledby="when-where-heading"
          className="flex flex-col gap-6"
        >
          <h2 id="when-where-heading" className="text-h2">
            When and where
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className={cn(card, "md:col-span-4")}>
              <CalendarDays
                className="size-6 text-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="text-h2">When</h3>
              <div className="flex flex-col gap-2">
                <p className="text-body">
                  <time dateTime="2027-07-17">Saturday 17 July 2027</time>
                </p>
                <p className={smallFigure}>
                  Arrive from <time dateTime="13:30">13:30</time> · Ceremony at{" "}
                  <time dateTime="14:00">14:00</time>
                </p>
              </div>
            </div>

            <div className={cn(card, "md:col-span-4")}>
              <MapPin
                className="size-6 text-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="text-h2">Where</h3>
              <div className="flex flex-col gap-2">
                <address className="text-body not-italic">
                  <span className="block">Quillbrook Barn</span>
                  <span className="block">Saltry Lane</span>
                  <span className="block">Little Saltry</span>
                  <span className="block">ZQ4 7HB</span>
                </address>
                <p className={smallFigure}>
                  A 12-minute drive from Market Fenley station
                </p>
              </div>
            </div>

            <div className={cn(card, "md:col-span-4")}>
              <Shirt
                className="size-6 text-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="text-h2">What to wear</h3>
              <div className="flex flex-col gap-2">
                <p className="text-body">
                  Come in your summer best. Flat shoes are a good idea, since
                  the drinks are on the grass of the orchard.
                </p>
                <p className={smallFigure}>Evenings in the valley turn cool</p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="note-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="note-heading" className="text-h2">
              A note from us
            </h2>
            <div className="flex flex-col gap-3">
              <p className="max-w-xl text-body">
                We met eight years ago at a ceilidh in Market Fenley, where
                neither of us knew the steps. We still do not, and we would
                like to get them wrong again with all of you.
              </p>
              <p className="max-w-xl text-body">
                There will be long tables, a lot of food and a band that plays
                until the last minibus. Bring the people named on your
                invitation, your dancing shoes and a jumper for later.
              </p>
              <p className="font-heading text-h2">Clem and Rafe</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="plan-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:col-span-8 md:col-start-3 md:p-10">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label">
                <time dateTime="2027-07-17">Saturday 17 July 2027</time>
              </p>
              <h2 id="plan-heading" className="text-h2">
                The plan
              </h2>
            </div>
            <ol className="flex flex-col gap-3">
              {plan.map((row) => (
                <li key={row.time} className="flex items-baseline gap-6">
                  <time
                    dateTime={row.time}
                    className="w-14 shrink-0 font-mono text-label tabular-nums"
                  >
                    {row.time}
                  </time>
                  <span className="text-body">{row.what}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="reply-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 text-center md:col-span-8 md:col-start-3">
            <div className="flex flex-col items-center gap-3">
              <h2 id="reply-heading" className="text-h2">
                Can you come?
              </h2>
              <p className="max-w-xl text-body">
                Please reply by{" "}
                <time dateTime="2027-04-30">Friday 30 April 2027</time>, so we
                can plan dinner and the minibuses.
              </p>
            </div>
            <a
              href="/rsvp"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 w-full rounded-md px-6 font-mono text-label md:w-auto"
              )}
            >
              Reply now
            </a>
            <p className="max-w-xl text-body">
              The times, the way to the barn and where to stay are all on{" "}
              <a href="/day" className={textLink}>
                the plan for the day
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between"
          )}
        >
          <p className="font-heading text-h2">Clem &amp; Rafe</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a href="mailto:hello@clemandrafe.example" className={textLink}>
                hello@clemandrafe.example
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
