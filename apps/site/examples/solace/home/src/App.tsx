import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const card = "rounded-xl border border-border bg-card p-7"

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-7"

const label = "font-mono text-label"

const navItems = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]

const concerns = [
  {
    title: "Anxiety and worry",
    text: "Thoughts that will not settle, or a body that is always braced.",
  },
  {
    title: "Low mood",
    text: "Days that feel flat or heavy, often with no clear reason.",
  },
  {
    title: "Grief and loss",
    text: "Someone or something has gone, and the world carries on anyway.",
  },
  {
    title: "Burnout and work",
    text: "You keep going, and it costs more than it used to.",
  },
  {
    title: "Relationships",
    text: "The same hurt keeps coming round, with a partner, with family or at work.",
  },
  {
    title: "A change you did not choose",
    text: "Illness, redundancy, a move, or the end of something.",
  },
]

const steps = [
  {
    title: "You write to me",
    text: "Fill in a short form, and say as much or as little as you like. A name and a way to reach you is enough.",
    note: "I reply within 2 working days",
  },
  {
    title: "We speak for 20 minutes",
    text: "A call, by phone or video. You can ask me anything, and I ask what you hope for. There is no charge.",
    note: "20 minutes · Free",
  },
  {
    title: "We meet for a first session",
    text: "In the room or online. At the end we each say whether we would like to go on. Either answer is fine.",
    note: "50 minutes · £68",
  },
]

const inShort = [
  { term: "In person", value: "The Garden Room, 14 Orchard Row, Larkmere" },
  { term: "Online", value: "By video, with a link I send the day before" },
  { term: "Evenings", value: "On Wednesdays, until 20:00" },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1136px] px-4 text-body text-foreground md:px-7">
      <header className="flex flex-wrap items-center gap-x-7 py-4">
        <a
          href="/"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focus
          )}
        >
          Nora Ellingham
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <ul className="flex flex-wrap gap-x-4 md:gap-x-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="opening-heading"
          className={cn(grid, "mt-12 md:mt-28")}
        >
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
            Psychotherapy · Larkmere and online
          </p>
          <h1
            id="opening-heading"
            className="mt-4 text-h1 md:col-span-9 md:text-display"
          >
            A quiet room, and <em className="italic">time to think</em>
          </h1>
          <p className="mt-7 max-w-xl text-body md:col-span-7 md:col-start-1">
            I am Nora Ellingham, a psychotherapist. I work with adults, one to
            one, in a garden room in Larkmere and online. You do not need to
            know what to say before you come.
          </p>
          <p className="mt-7 md:col-span-7 md:col-start-1">
            <a href="#how-it-starts" className={textLink}>
              How it starts
            </a>
          </p>
        </section>

        <section aria-labelledby="bring-heading" className={cn(grid, "mt-28")}>
          <div className="md:col-span-4">
            <h2 id="bring-heading" className="text-h2">
              What people bring
            </h2>
            <p className="mt-4 text-body">
              Most people come with one of these, or with something they cannot
              name yet. Both are fine.
            </p>
          </div>
          <div className="mt-7 md:col-span-7 md:col-start-6 md:mt-0">
            <ul className="list-none border-b border-border p-0">
              {concerns.map((item) => (
                <li key={item.title} className="border-t border-border py-4">
                  <h3 className="text-h2">{item.title}</h3>
                  <p className="mt-2 text-body">{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-xl text-body">
              If what you carry is not on this list, write to me anyway. I will
              tell you honestly whether I am the right person.
            </p>
          </div>
        </section>

        <section
          id="how-it-starts"
          aria-labelledby="starts-heading"
          className="mt-28 scroll-mt-7"
        >
          <h2 id="starts-heading" className="text-h2">
            How it starts
          </h2>
          <p className="mt-4 max-w-xl text-body">
            Three steps, at your own pace. You can stop after any of them.
          </p>
          <ol className={cn(grid, "mt-7 list-none p-0")}>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  card,
                  "flex flex-col md:col-span-4",
                  index > 0 && "mt-4 md:mt-0"
                )}
              >
                <p className={cn(label, "text-muted-foreground tabular-nums")}>
                  Step {index + 1}
                </p>
                <h3 className="mt-4 text-h2">{step.title}</h3>
                <p className="mt-4 text-body">{step.text}</p>
                <p
                  className={cn(
                    label,
                    "mt-auto pt-7 text-foreground tabular-nums"
                  )}
                >
                  {step.note}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="therapist-heading"
          className={cn(grid, "mt-28")}
        >
          <div className="md:col-span-7">
            <h2 id="therapist-heading" className="text-h2">
              Who you would be talking to
            </h2>
            <div className="mt-7 flex items-center gap-4">
              <div
                role="img"
                aria-label="Portrait of Nora Ellingham"
                className="flex size-18 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-h2 text-secondary-foreground"
              >
                <span aria-hidden="true">NE</span>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-h2">Nora Ellingham</p>
                <p
                  className={cn(
                    label,
                    "mt-2 text-muted-foreground tabular-nums"
                  )}
                >
                  Registered psychotherapist · In practice since 2014
                </p>
              </div>
            </div>
            <p className="mt-7 max-w-xl text-body">
              I trained for four years, after nine years as a teacher. I have
              worked with adults in private practice since 2014.
            </p>
            <p className="mt-4 max-w-xl text-body">
              I listen more than I talk. I will not hurry you, and I will not
              tell you what to do with your life.
            </p>
            <p className="mt-7">
              <a href="/about" className={textLink}>
                More about me and my training
              </a>
            </p>
          </div>
          <div
            className={cn(card, "mt-12 md:col-span-4 md:col-start-9 md:mt-0")}
          >
            <h3 className="text-h2">In short</h3>
            <dl className="mt-4">
              {inShort.map((row, index) => (
                <div key={row.term} className={cn(index > 0 && "mt-4")}>
                  <dt>
                    <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground">
                      {row.term}
                    </Badge>
                  </dt>
                  <dd className="mt-2 text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="fee-heading" className={cn(grid, "mt-28")}>
          <div className="md:col-span-8">
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Fees from <time dateTime="2027-01-01">1 January 2027</time>
            </p>
            <h2 id="fee-heading" className="mt-4 text-h1">
              A session is 50 minutes and costs £68
            </h2>
            <p className="mt-4 max-w-xl text-body">
              The first call is 20 minutes and free. I send one invoice a month,
              and there is no charge if you cancel with 48 hours&apos; notice.
            </p>
            <p className="mt-7">
              <a href="/fees" className={textLink}>
                Fees, paying and cancelling
              </a>
            </p>
          </div>
        </section>

        <section aria-labelledby="action-heading" className={cn(grid, "mt-28")}>
          <div className={cn(card, "md:col-span-8")}>
            <h2 id="action-heading" className="text-h2">
              When you are ready
            </h2>
            <p className="mt-4 max-w-xl text-body">
              The button leads to a short form. I reply within two working days,
              and nothing is booked until we have spoken.
            </p>
            <div className="mt-7">
              <a
                href="/first-session"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-7 py-2 text-body"
                )}
              >
                Request a first session
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className={grid}>
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className={cn(label, "mt-2 text-muted-foreground")}>
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2 wrap-break-word">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
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
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className={cn(label, "mt-4 text-muted-foreground")}>
          © 2027 Nora Ellingham
        </p>
      </footer>
    </div>
  )
}

export default App
