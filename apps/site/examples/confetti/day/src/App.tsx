import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusRing}`

const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 hover:underline transition-colors duration-150 ${focusRing}`

const container = "mx-auto max-w-[1088px] px-6"

const navItems = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day" },
  { label: "Guestbook", href: "/guestbook" },
]

const currentHref = "/day"

function T({ at, children }: { at: string; children: ReactNode }) {
  return <time dateTime={at}>{children}</time>
}

type TimelineRow = {
  time: string
  dateTime: string
  title: string
  badge?: string
  body: ReactNode
}

const timeline: TimelineRow[] = [
  {
    time: "13:30",
    dateTime: "2027-07-17T13:30",
    title: "Arrive and find a drink",
    body: (
      <>
        Lemonade and elderflower fizz are waiting in the orchard. The minibuses
        from Market Fenley station leave at <T at="13:00">13:00</T> and{" "}
        <T at="13:15">13:15</T>.
      </>
    ),
  },
  {
    time: "14:00",
    dateTime: "2027-07-17T14:00",
    title: "The ceremony",
    body: (
      <>
        In the barn, for about half an hour. Phones away until it is over,
        please; the photographer has it covered.
      </>
    ),
  },
  {
    time: "15:00",
    dateTime: "2027-07-17T15:00",
    title: "Photos and lawn games",
    body: (
      <>
        On the lawn behind the barn, with tea, cake and a croquet set while we
        have our photos taken.
      </>
    ),
  },
  {
    time: "17:00",
    dateTime: "2027-07-17T17:00",
    title: "Dinner at long tables",
    body: <>In the barn. Your place is on the board by the door.</>,
  },
  {
    time: "19:00",
    dateTime: "2027-07-17T19:00",
    title: "Speeches and cake",
    body: <>Three speeches, each under five minutes. Then we cut the cake.</>,
  },
  {
    time: "20:00",
    dateTime: "2027-07-17T20:00",
    title: "Dancing with The Saltry Reelers",
    body: (
      <>
        A ceilidh band whose caller teaches every dance before it starts. No
        one needs to know the steps.
      </>
    ),
  },
  {
    time: "23:30",
    dateTime: "2027-07-17T23:30",
    title: "The last minibus",
    body: (
      <>
        To Market Fenley station and The Old Granary. An earlier one leaves at{" "}
        <T at="22:30">22:30</T>.
      </>
    ),
  },
  {
    time: "11:00",
    dateTime: "2027-07-18T11:00",
    title: "Brunch on the lawn",
    badge: "Day two",
    body: (
      <>
        The next morning, <T at="2027-07-18">Sunday 18 July</T>, for anyone
        still in Little Saltry, until <T at="13:00">13:00</T>. Come as you are.
      </>
    ),
  },
]

const waysThere: { title: string; body: ReactNode }[] = [
  {
    title: "By train",
    body: (
      <>
        Take the train to Market Fenley station. A minibus waits on the
        forecourt at <T at="13:00">13:00</T> and <T at="13:15">13:15</T>, and
        brings you back at <T at="22:30">22:30</T> and <T at="23:30">23:30</T>.
      </>
    ),
  },
  {
    title: "By car",
    body: (
      <>
        The postcode takes you to the gate on Saltry Lane. Park in the paddock,
        signposted from the lane; it is free.
      </>
    ),
  },
  {
    title: "By taxi",
    body: (
      <>
        Call Fenley Cars on{" "}
        <a href="tel:+441632960881" className={textLink}>
          01632 960 881
        </a>
        . They have three cars, so book ahead for the evening.
      </>
    ),
  },
  {
    title: "On foot",
    body: (
      <>
        From The Wren and Wheel it is five minutes along Saltry Lane, with a
        pavement all the way.
      </>
    ),
  },
]

const glance: { term: string; value: ReactNode }[] = [
  { term: "Postcode", value: "ZQ4 7HB" },
  { term: "Nearest station", value: "Market Fenley" },
  { term: "Parking", value: "Free, in the paddock" },
  {
    term: "Minibus from the station",
    value: (
      <>
        <T at="13:00">13:00</T> and <T at="13:15">13:15</T>
      </>
    ),
  },
  { term: "Last minibus back", value: <T at="23:30">23:30</T> },
]

type Stay = {
  id: string
  label: string
  name: string
  body: ReactNode
  price: string
  link: { label: string; href: string }
}

const stays: Stay[] = [
  {
    id: "stay-wren",
    label: "Inn · 6 rooms · A 5-minute walk",
    name: "The Wren and Wheel",
    body: (
      <>
        The pub on the green. All six rooms are held for guests until{" "}
        <T at="2027-05-01">1 May 2027</T>; say you are coming to the wedding
        when you book.
      </>
    ),
    price: "From £95 a night",
    link: { label: "Book a room", href: "#" },
  },
  {
    id: "stay-granary",
    label: "Bed and breakfast · 4 rooms · Market Fenley",
    name: "The Old Granary",
    body: (
      <>
        In town, 15 minutes by car, and on the minibus route both ways, so no
        one has to drive home.
      </>
    ),
    price: "From £80 a night",
    link: { label: "Book a room", href: "#" },
  },
  {
    id: "stay-field",
    label: "Camping · Behind the barn",
    name: "The top field",
    body: (
      <>
        Bring a tent and stay from <T at="2027-07-16">Friday 16 July</T> to{" "}
        <T at="2027-07-18">Sunday 18 July</T>, with showers in the stable
        block.
      </>
    ),
    price: "Free",
    link: {
      label: "Tell us you are camping",
      href: "mailto:hello@clemandrafe.example",
    },
  },
]

const questions: { q: string; a: ReactNode }[] = [
  {
    q: "Can we bring our children?",
    a: (
      <>
        Yes, if they are named on your invitation. There is a children&apos;s
        plate at dinner and a quiet room off the barn with blankets and books.
      </>
    ),
  },
  {
    q: "Is the barn step-free?",
    a: (
      <>
        The barn, the toilets and the lawn are. The orchard is on a gentle
        slope with a mown path.
      </>
    ),
  },
  {
    q: "What if it rains?",
    a: (
      <>
        Everything but the lawn games moves into the barn, which holds
        everyone. Bring a coat for the walk from the paddock.
      </>
    ),
  },
  {
    q: "Can I take photos?",
    a: (
      <>
        Not during the ceremony, please. From the drinks on, take as many as
        you like.
      </>
    ),
  },
  {
    q: "Can the kitchen cook around an allergy?",
    a: (
      <>
        Yes. Tell us in the note{" "}
        <a href="/rsvp" className={textLink}>
          when you reply
        </a>
        , and the kitchen plans a plate for you.
      </>
    ),
  },
  {
    q: "When does it end?",
    a: (
      <>
        The band stops at <T at="23:15">23:15</T> and the last minibus leaves
        at <T at="23:30">23:30</T>. Brunch on Sunday is for anyone still
        around.
      </>
    ),
  },
]

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div
          className={`${container} flex flex-wrap items-center gap-x-6 gap-y-2 py-3`}
        >
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusRing}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {navItems.map((item) => {
                const current = item.href === currentHref
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={current ? `${navLink} underline` : navLink}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className={`${container} flex flex-col gap-22 pt-10 pb-22`}>
        <section
          aria-labelledby="opening-title"
          className="flex flex-col gap-6 rounded-xl bg-candy p-6 text-candy-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label">
                <T at="2027-07-17">Saturday 17 July 2027</T> · Little Saltry
              </p>
              <h1 id="opening-title" className="text-h1 md:text-display">
                The plan for the day
              </h1>
            </div>
            <p className="max-w-xl text-body">
              When things happen, how to reach the barn, where to sleep, and
              the answers to what people have asked us so far.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="day-title"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="day-title" className="text-h2">
              How the day goes
            </h2>
            <ol className="list-none divide-y divide-border p-0">
              {timeline.map((row) => (
                <li
                  key={row.dateTime}
                  className="flex items-baseline gap-6 py-3 first:pt-0 last:pb-0"
                >
                  <time
                    dateTime={row.dateTime}
                    className="w-14 shrink-0 font-mono text-label text-foreground tabular-nums"
                  >
                    {row.time}
                  </time>
                  <div className="flex min-w-0 flex-col gap-2">
                    {row.badge ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-body">{row.title}</h3>
                        <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                          {row.badge}
                        </Badge>
                      </div>
                    ) : (
                      <h3 className="text-body">{row.title}</h3>
                    )}
                    <p className="text-body">{row.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="getting-title"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-6">
            <div className="flex flex-col gap-3">
              <h2 id="getting-title" className="text-h2">
                Getting to Quillbrook Barn
              </h2>
              <address className="flex flex-col text-body not-italic">
                <span>Quillbrook Barn</span>
                <span>Saltry Lane</span>
                <span>Little Saltry</span>
                <span>ZQ4 7HB</span>
                <p>
                  On the day:{" "}
                  <a href="tel:+441632960214" className={textLink}>
                    01632 960 214
                  </a>
                </p>
              </address>
            </div>
            <ul className="flex list-none flex-col gap-6 p-0">
              {waysThere.map((way) => (
                <li key={way.title} className="flex flex-col gap-2">
                  <h3 className="text-body">{way.title}</h3>
                  <p className="text-body">{way.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 rounded-xl bg-mist p-6 text-mist-foreground md:col-span-5 md:col-start-8 md:p-10">
            <h3 className="text-h2">At a glance</h3>
            <dl className="flex flex-col gap-3">
              {glance.map((row) => (
                <div
                  key={row.term}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
                >
                  <dt className="font-mono text-label">{row.term}</dt>
                  <dd className="ml-auto text-right text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="stay-title" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="stay-title" className="text-h2">
              Where to stay
            </h2>
            <p className="max-w-xl text-body">
              Little Saltry is small, so book early. We have held the rooms at
              the inn until <T at="2027-05-01">1 May 2027</T>.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {stays.map((stay) => (
              <article
                key={stay.id}
                aria-labelledby={stay.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-label text-muted-foreground">
                    {stay.label}
                  </p>
                  <h3 id={stay.id} className="text-h2">
                    {stay.name}
                  </h3>
                </div>
                <p className="text-body">{stay.body}</p>
                <p className="font-mono text-label text-foreground tabular-nums">
                  {stay.price}
                </p>
                <p className="mt-auto">
                  <a href={stay.link.href} className={textLink}>
                    {stay.link.label}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="questions-title"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="questions-title" className="text-h2">
              Questions and answers
            </h2>
            <Accordion multiple>
              {questions.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-xl">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={`${container} flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between`}
        >
          <p className="font-heading text-h2">Clem &amp; Rafe</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground">
              <T at="2027-07-17">Saturday 17 July 2027</T> · Quillbrook Barn,
              Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a
                href="mailto:hello@clemandrafe.example"
                className={`${textLink} wrap-break-word`}
              >
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
