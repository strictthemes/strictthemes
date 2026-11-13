import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinkClass = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLinkClass = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const cardClass = "rounded-xl border border-border bg-card p-7"

const badgeClass =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground"

const navLinks = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]

const currentHref = "/about"

function NavLink({ label, href }: { label: string; href: string }) {
  const current = href === currentHref
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(navLinkClass, current && "underline")}
    >
      {label}
    </a>
  )
}

const training = [
  {
    year: null,
    title: "Thirty hours of further training",
    detail: "And supervision once a month",
  },
  {
    year: "2020",
    title: "Certificate in Online and Telephone Therapy",
    detail: "Northmoor Institute · Six months",
  },
  {
    year: "2016",
    title: "Certificate in Working with Grief and Loss",
    detail: "The Tidewell Centre · One year",
  },
  {
    year: "2014",
    title: "Registered psychotherapist",
    detail: "Registration no. 04417 · Renewed each year",
  },
  {
    year: "2014",
    title: "Diploma in Integrative Psychotherapy",
    detail: "Northmoor Institute · Four years, part time",
  },
]

const areas = [
  "Anxiety and worry",
  "Low mood",
  "Grief and loss",
  "Burnout and work",
  "Relationships",
  "A change you did not choose",
]

const sessions = [
  { day: "Tuesday", start: "09:00", end: "17:00", where: ["In person"] },
  {
    day: "Wednesday",
    start: "12:00",
    end: "20:00",
    where: ["In person", "Online"],
  },
  { day: "Thursday", start: "09:00", end: "17:00", where: ["Online"] },
  { day: "Friday", start: "09:00", end: "13:00", where: ["Online"] },
]

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
          <ul className="flex flex-wrap gap-x-4 md:gap-x-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="intro-heading"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-8">
            <div className="flex items-center gap-4 md:gap-7">
              <div
                role="img"
                aria-label="Portrait of Nora Ellingham"
                className="flex size-18 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-h2 text-secondary-foreground"
              >
                <span aria-hidden="true">NE</span>
              </div>
              <div className="min-w-0">
                <h1 id="intro-heading" className="text-h1 md:text-display">
                  Nora Ellingham
                </h1>
                <p className="mt-2 font-mono text-label text-muted-foreground">
                  Registered psychotherapist · In practice since 2014
                </p>
              </div>
            </div>
            <p className="mt-7 max-w-xl text-body">
              I am a psychotherapist. I work with adults, one to one, in a
              garden room in Larkmere and online by video.
            </p>
            <p className="mt-4 max-w-xl text-body">
              I trained for four years, after nine years as a secondary school
              teacher. Teaching showed me how much people carry without saying
              so.
            </p>
            <p className="mt-4 max-w-xl text-body">
              I work in an integrative way. That means I do not follow one
              method. I use what fits the person in front of me, and I say what
              I am doing and why.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="training-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <h2 id="training-heading" className="text-h2">
              Training and registration
            </h2>
            <dl className="mt-7 list-none border-b border-border p-0">
              {training.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className="font-mono text-label text-muted-foreground">
                    {row.year ? (
                      <time dateTime={row.year} className="tabular-nums">
                        {row.year}
                      </time>
                    ) : (
                      "Each year"
                    )}
                  </dt>
                  <dd className="col-span-2 text-body">
                    <p className="text-body">{row.title}</p>
                    <p className="mt-2 font-mono text-label text-muted-foreground">
                      {row.detail}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 max-w-xl text-body">
              I am insured to practise. If you would like to see my entry on
              the register, ask and I will send it.
            </p>
          </div>
          <div
            className={cn(
              cardClass,
              "mt-12 md:col-span-4 md:col-start-9 md:mt-0 md:self-start"
            )}
          >
            <h3 className="text-h2">Languages</h3>
            <p className="mt-4 text-body">
              English and Dutch. A session can be in either, or move between
              the two.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="areas-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-4">
            <h2 id="areas-heading" className="text-h2">
              Areas of work
            </h2>
            <p className="mt-4 text-body">
              These are what people most often bring. The list is not a
              boundary.
            </p>
          </div>
          <div className="mt-7 md:col-span-7 md:col-start-6 md:mt-0">
            <ul className="list-none border-b border-border p-0 md:grid md:grid-cols-2 md:gap-x-7">
              {areas.map((area) => (
                <li
                  key={area}
                  className="border-t border-border py-4 font-heading text-h2"
                >
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-xl text-body">
              I do not work with couples, families or anyone under 18. The rest
              of what I do not offer is on{" "}
              <a href="/approach#not-offered" className={textLinkClass}>
                the page about how I work
              </a>
              .
            </p>
          </div>
        </section>

        <section
          aria-labelledby="sessions-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="md:col-span-7">
            <h2 id="sessions-heading" className="text-h2">
              When sessions are held
            </h2>
            <p className="mt-4 max-w-xl text-body">
              These are the hours in which I see people. Your own session is at
              the same time each week.
            </p>
            <table className="mt-7 w-full border-collapse border-b border-border text-left">
              <caption className="sr-only">Days and times of sessions</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-2 pr-4 font-mono text-label font-normal text-muted-foreground"
                  >
                    Day
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-4 font-mono text-label font-normal text-muted-foreground"
                  >
                    Times
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-0 font-mono text-label font-normal text-muted-foreground"
                  >
                    Where
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((row) => (
                  <tr key={row.day} className="border-t border-border">
                    <th
                      scope="row"
                      className="py-4 pr-4 align-baseline text-body font-normal text-foreground"
                    >
                      {row.day}
                    </th>
                    <td className="py-4 pr-4 align-baseline font-mono text-label whitespace-nowrap text-foreground tabular-nums">
                      <time dateTime={row.start} className="tabular-nums">
                        {row.start}
                      </time>
                      –
                      <time dateTime={row.end} className="tabular-nums">
                        {row.end}
                      </time>
                    </td>
                    <td className="py-4 pr-0 align-baseline">
                      <div className="flex flex-wrap gap-2">
                        {row.where.map((place) => (
                          <Badge key={place} className={badgeClass}>
                            {place}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-mono text-label text-muted-foreground">
              No sessions on Mondays, at weekends or on public holidays.
            </p>
          </div>
          <div
            className={cn(
              cardClass,
              "mt-12 md:col-span-4 md:col-start-9 md:mt-0 md:self-start"
            )}
          >
            <h3 className="text-h2">Finding the room</h3>
            <p className="mt-4 text-body">
              The Garden Room is behind 14 Orchard Row, through the side gate.
              There is one low step. If steps are difficult, tell me, and we can
              meet online.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="meet-heading"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className={cn(cardClass, "md:col-span-7")}>
            <h2 id="meet-heading" className="text-h2">
              If you would like to meet
            </h2>
            <p className="mt-4 max-w-xl text-body">
              Write to me with the form. I reply within two working days, and
              we start with a free call of 20 minutes.
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
            <p className="mt-2 font-mono text-label text-muted-foreground">
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2 text-body">
              <a href="mailto:hello@ellingham.example" className={textLinkClass}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className="mt-4 font-mono text-label text-muted-foreground">
          © 2027 Nora Ellingham
        </p>
      </footer>
    </div>
  )
}

export default App
