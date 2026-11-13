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

const badge =
  "h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground"

const label = "font-mono text-label text-muted-foreground"

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-7"

const links = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]

const current = "/about"

function NavLinks({ row }: { row?: boolean }) {
  return (
    <ul className={row ? "flex flex-wrap gap-x-4 md:gap-x-7" : undefined}>
      {links.map((link) => {
        const isCurrent = link.href === current
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(navLink, isCurrent && "underline")}
            >
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
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
  { day: "Tuesday", from: "09:00", to: "17:00", where: ["In person"] },
  {
    day: "Wednesday",
    from: "12:00",
    to: "20:00",
    where: ["In person", "Online"],
  },
  { day: "Thursday", from: "09:00", to: "17:00", where: ["Online"] },
  { day: "Friday", from: "09:00", to: "13:00", where: ["Online"] },
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
          <NavLinks row />
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="intro-heading"
          className={cn(grid, "mt-12 md:mt-28")}
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
                <p className={cn(label, "mt-2")}>
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
          className={cn(grid, "mt-28")}
        >
          <div className="md:col-span-7">
            <h2 id="training-heading" className="text-h2">
              Training and registration
            </h2>
            <dl className="mt-7 list-none border-b border-border p-0">
              {training.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={cn(label, "tabular-nums")}>
                    {item.year ? (
                      <time dateTime={item.year}>{item.year}</time>
                    ) : (
                      "Each year"
                    )}
                  </dt>
                  <dd className="col-span-2 text-body">
                    <p className="text-body">{item.title}</p>
                    <p className={cn(label, "mt-2")}>{item.detail}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 max-w-xl text-body">
              I am insured to practise. If you would like to see my entry on the
              register, ask and I will send it.
            </p>
          </div>
          <div
            className={cn(
              card,
              "mt-12 md:col-span-4 md:col-start-9 md:mt-0 md:self-start"
            )}
          >
            <h3 className="text-h2">Languages</h3>
            <p className="mt-4 text-body">
              English and Dutch. A session can be in either, or move between the
              two.
            </p>
          </div>
        </section>

        <section aria-labelledby="areas-heading" className={cn(grid, "mt-28")}>
          <div className="md:col-span-4">
            <h2 id="areas-heading" className="text-h2">
              Areas of work
            </h2>
            <p className="mt-4 max-w-xl text-body">
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
              <a href="/approach#not-offered" className={textLink}>
                the page about how I work
              </a>
              .
            </p>
          </div>
        </section>

        <section
          aria-labelledby="sessions-heading"
          className={cn(grid, "mt-28")}
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
                      <time dateTime={row.from}>{row.from}</time>–
                      <time dateTime={row.to}>{row.to}</time>
                    </td>
                    <td className="py-4 pr-0 align-baseline">
                      <div className="flex flex-wrap gap-2">
                        {row.where.map((place) => (
                          <Badge key={place} className={badge}>
                            {place}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={cn(label, "mt-4")}>
              No sessions on Mondays, at weekends or on public holidays.
            </p>
          </div>
          <div
            className={cn(
              card,
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

        <section aria-labelledby="action-heading" className={cn(grid, "mt-28")}>
          <div className={cn(card, "md:col-span-7")}>
            <h2 id="action-heading" className="text-h2">
              If you would like to meet
            </h2>
            <p className="mt-4 max-w-xl text-body">
              The button leads to a short form. I reply within two working days,
              and we start with a free call of 20 minutes.
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
            <p className={cn(label, "mt-2")}>
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2 text-body wrap-break-word">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <NavLinks />
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className={cn(label, "mt-4")}>© 2027 Nora Ellingham</p>
      </footer>
    </div>
  )
}

export default App
