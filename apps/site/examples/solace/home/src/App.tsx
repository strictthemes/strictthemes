import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const card = "rounded-xl border border-border bg-card p-7"

const label = "font-mono text-label"

const badge =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground"

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
    text: "Use the form, and say as much or as little as you like. A name and a way to reach you is enough.",
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
  {
    term: "In person",
    value: "The Garden Room, 14 Orchard Row, Larkmere",
  },
  {
    term: "Online",
    value: "By video, with a link I send the day before",
  },
  {
    term: "Evenings",
    value: "On Wednesdays, until 20:00",
  },
]

function NavList({ vertical = false }: { vertical?: boolean }) {
  return (
    <ul className={vertical ? undefined : "flex flex-wrap gap-x-4 md:gap-x-7"}>
      {navItems.map((item) => (
        <li key={item.href}>
          <a href={item.href} className={navLink}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1136px] px-4 text-body text-foreground md:px-7">
      <header className="flex flex-wrap items-center gap-x-7 py-4">
        <a
          href="/"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focusRing
          )}
        >
          Nora Ellingham
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <NavList />
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="opening-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
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
          <p className="mt-7 max-w-xl md:col-span-7 md:col-start-1">
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

        <section
          aria-labelledby="bring-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-4">
            <h2 id="bring-heading" className="text-h2">
              What people bring
            </h2>
            <p className="mt-4 max-w-xl">
              Most people come with one of these, or with something they cannot
              name yet. Both are fine.
            </p>
          </div>
          <div className="mt-7 md:col-span-7 md:col-start-6 md:mt-0">
            <ul className="list-none border-b border-border p-0">
              {concerns.map((item) => (
                <li key={item.title} className="border-t border-border py-4">
                  <h3 className="text-h2">{item.title}</h3>
                  <p className="mt-2 max-w-xl">{item.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-xl">
              If what you carry is not on this list, write to me anyway. I will
              tell you honestly whether I am the right person.
            </p>
          </div>
        </section>

        <section
          id="how-it-starts"
          aria-labelledby="how-heading"
          className="mt-28 scroll-mt-7"
        >
          <h2 id="how-heading" className="text-h2">
            How it starts
          </h2>
          <p className="mt-4 max-w-xl">
            Three steps, at your own pace. You can stop after any of them.
          </p>
          <ol className="mt-7 grid list-none grid-cols-1 p-0 md:grid-cols-12 md:gap-x-7">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  card,
                  "flex flex-col md:col-span-4",
                  index > 0 && "mt-4 md:mt-0"
                )}
              >
                <p className={cn(label, "text-muted-foreground")}>
                  Step {index + 1}
                </p>
                <h3 className="mt-4 text-h2">{step.title}</h3>
                <p className="mt-4 max-w-xl">{step.text}</p>
                <p className={cn(label, "mt-auto pt-7 text-foreground")}>
                  {step.note}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="who-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <h2 id="who-heading" className="text-h2">
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
                <p className={cn(label, "mt-2 text-muted-foreground")}>
                  Registered psychotherapist · In practice since 2014
                </p>
              </div>
            </div>
            <p className="mt-7 max-w-xl">
              I trained for four years, after nine years as a teacher. I have
              worked with adults in private practice since 2014.
            </p>
            <p className="mt-4 max-w-xl">
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
                <div key={row.term} className={index > 0 ? "mt-4" : undefined}>
                  <dt>
                    <Badge className={badge}>{row.term}</Badge>
                  </dt>
                  <dd className="mt-2">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="fee-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-8">
            <p className={cn(label, "text-muted-foreground")}>
              Fees from{" "}
              <time dateTime="2027-01-01" className="tabular-nums">
                1 January 2027
              </time>
            </p>
            <h2 id="fee-heading" className="mt-4 text-h1">
              A session is 50 minutes and costs £68
            </h2>
            <p className="mt-4 max-w-xl">
              The first call is 20 minutes and free. I send one invoice a month,
              and there is no charge if you cancel with 48 hours' notice.
            </p>
            <p className="mt-7">
              <a href="/fees" className={textLink}>
                Fees, paying and cancelling
              </a>
            </p>
          </div>
        </section>

        <section
          aria-labelledby="ready-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className={cn(card, "md:col-span-8")}>
            <h2 id="ready-heading" className="text-h2">
              When you are ready
            </h2>
            <p className="mt-4 max-w-xl">
              Write to me with the form. I reply within two working days, and
              nothing is booked until we have spoken.
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
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className={cn(label, "mt-2 text-muted-foreground")}>
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <NavList vertical />
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
