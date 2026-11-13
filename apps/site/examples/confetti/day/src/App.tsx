import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1088px] px-6"

const textLink = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusOutline}`

const navLink = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`

const navItems = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day", current: true },
  { label: "Guestbook", href: "/guestbook" },
]

function Clock({ time }: { time: string }) {
  return <time dateTime={time}>{time}</time>
}

type TimelineRow = {
  time: string
  dateTime: string
  title: string
  badge?: string
  text: ReactNode
}

const timeline: TimelineRow[] = [
  {
    time: "13:30",
    dateTime: "2027-07-17T13:30",
    title: "Arrive and find a drink",
    text: (
      <>
        Lemonade and elderflower fizz are waiting in the orchard. The
        minibuses from Market Fenley station leave at <Clock time="13:00" />{" "}
        and <Clock time="13:15" />.
      </>
    ),
  },
  {
    time: "14:00",
    dateTime: "2027-07-17T14:00",
    title: "The ceremony",
    text: (
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
    text: <>On the lawn behind the barn, with tea, cake and a croquet set.</>,
  },
  {
    time: "17:00",
    dateTime: "2027-07-17T17:00",
    title: "Dinner at long tables",
    text: <>In the barn. Your place is on the board by the door.</>,
  },
  {
    time: "19:00",
    dateTime: "2027-07-17T19:00",
    title: "Speeches and cake",
    text: <>Three speeches, each under five minutes. Then we cut the cake.</>,
  },
  {
    time: "20:00",
    dateTime: "2027-07-17T20:00",
    title: "Dancing with The Saltry Reelers",
    text: (
      <>
        A ceilidh band whose caller teaches every dance before it starts, so
        you need no practice.
      </>
    ),
  },
  {
    time: "23:30",
    dateTime: "2027-07-17T23:30",
    title: "The last minibus",
    text: (
      <>
        To Market Fenley station and The Old Granary. An earlier one leaves at{" "}
        <Clock time="22:30" />.
      </>
    ),
  },
  {
    time: "11:00",
    dateTime: "2027-07-18T11:00",
    title: "Brunch on the lawn",
    badge: "Day two",
    text: (
      <>
        The next morning, <time dateTime="2027-07-18">Sunday 18 July</time>,
        for anyone still in Little Saltry. We keep it going until{" "}
        <Clock time="13:00" />.
      </>
    ),
  },
]

const ways: { title: string; text: ReactNode }[] = [
  {
    title: "By train",
    text: (
      <>
        Take the train to Market Fenley station. A minibus waits on the
        forecourt at <Clock time="13:00" /> and <Clock time="13:15" />, and
        brings you back at <Clock time="22:30" /> and <Clock time="23:30" />.
      </>
    ),
  },
  {
    title: "By car",
    text: (
      <>
        The postcode takes you to the gate on Saltry Lane. Park in the
        paddock, signposted from the lane; it is free.
      </>
    ),
  },
  {
    title: "By taxi",
    text: (
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
    text: (
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
        <Clock time="13:00" /> and <Clock time="13:15" />
      </>
    ),
  },
  { term: "Last minibus back", value: <Clock time="23:30" /> },
]

const places: {
  label: string
  name: string
  text: ReactNode
  price: string
  link: string
  href: string
}[] = [
  {
    label: "Inn · 6 rooms · A 5-minute walk",
    name: "The Wren and Wheel",
    text: (
      <>
        The pub on the green. All six rooms are held for guests until{" "}
        <time dateTime="2027-05-01">1 May 2027</time>; say you are coming to
        the wedding when you book.
      </>
    ),
    price: "From £95 a night",
    link: "Book a room",
    href: "#",
  },
  {
    label: "Bed and breakfast · 4 rooms · Market Fenley",
    name: "The Old Granary",
    text: (
      <>
        In town, 15 minutes by car, and on the minibus route both ways.
        Breakfast is at a big table in the kitchen.
      </>
    ),
    price: "From £80 a night",
    link: "Book a room",
    href: "#",
  },
  {
    label: "Camping · Behind the barn",
    name: "The top field",
    text: (
      <>
        Bring a tent and stay from{" "}
        <time dateTime="2027-07-16">Friday 16 July</time> to{" "}
        <time dateTime="2027-07-18">Sunday 18 July</time>, with showers in the
        stable block.
      </>
    ),
    price: "Free",
    link: "Tell us you are camping",
    href: "mailto:hello@clemandrafe.example",
  },
]

const questions: { id: string; question: string; answer: ReactNode }[] = [
  {
    id: "children",
    question: "Can we bring our children?",
    answer: (
      <>
        Yes, if they are named on your invitation. There is a children&apos;s
        plate at dinner and a quiet room off the barn with blankets and books.
      </>
    ),
  },
  {
    id: "step-free",
    question: "Is the barn step-free?",
    answer: (
      <>
        The barn, the toilets and the lawn are. The orchard is on a gentle
        slope with a mown path.
      </>
    ),
  },
  {
    id: "rain",
    question: "What if it rains?",
    answer: (
      <>
        Everything but the lawn games moves into the barn, which holds
        everyone. Bring a coat for the walk from the paddock.
      </>
    ),
  },
  {
    id: "photos",
    question: "Can I take photos?",
    answer: (
      <>
        Not during the ceremony, please. From the drinks on, take as many as
        you like.
      </>
    ),
  },
  {
    id: "allergy",
    question: "Can the kitchen cook around an allergy?",
    answer: (
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
    id: "end",
    question: "When does it end?",
    answer: (
      <>
        The band stops at <Clock time="23:15" /> and the last minibus leaves
        at <Clock time="23:30" />. Brunch on Sunday is for anyone still
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
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusOutline}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={
                      item.current ? `${navLink} underline` : navLink
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={`${container} flex flex-col gap-22 pt-10 pb-22`}>
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-candy p-6 text-candy-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label">
                <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
                Little Saltry
              </p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
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
          aria-labelledby="timeline-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="timeline-heading" className="text-h2">
              How the day goes
            </h2>
            <ol className="divide-y divide-border">
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
                    <p className="max-w-xl text-body">{row.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="getting-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-6 md:col-span-6">
            <div className="flex flex-col gap-3">
              <h2 id="getting-heading" className="text-h2">
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
            <ul className="flex flex-col gap-6">
              {ways.map((way) => (
                <li key={way.title} className="flex flex-col gap-2">
                  <h3 className="text-body">{way.title}</h3>
                  <p className="max-w-xl text-body">{way.text}</p>
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
                  className="flex items-baseline justify-between gap-6"
                >
                  <dt className="shrink-0 font-mono text-label">{row.term}</dt>
                  <dd className="min-w-0 text-right text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="stay-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="stay-heading" className="text-h2">
              Where to stay
            </h2>
            <p className="max-w-xl text-body">
              Little Saltry is small, so book early. We have held the rooms at
              the inn until <time dateTime="2027-05-01">1 May 2027</time>.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {places.map((place) => (
              <div
                key={place.name}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 md:col-span-4"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-label text-muted-foreground">
                    {place.label}
                  </p>
                  <h3 className="text-h2">{place.name}</h3>
                </div>
                <p className="text-body">{place.text}</p>
                <p className="font-mono text-label text-foreground tabular-nums">
                  {place.price}
                </p>
                <p className="mt-auto">
                  <a href={place.href} className={textLink}>
                    {place.link}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="questions-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="questions-heading" className="text-h2">
              Questions and answers
            </h2>
            <Accordion multiple>
              {questions.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="max-w-xl text-body">{item.answer}</p>
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
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a
                href="mailto:hello@clemandrafe.example"
                className={textLink}
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
