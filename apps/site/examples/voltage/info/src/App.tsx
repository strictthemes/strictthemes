import { useEffect, useRef, useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase"
const textLink = `text-foreground underline underline-offset-4 hover:decoration-2 ${focus}`
const panel = "flex flex-col rounded-xl border border-border bg-card p-5"
const container = "mx-auto max-w-[1200px] px-3 md:px-5"

const navLinks = [
  { href: "/line-up", text: "Line-up" },
  { href: "/tickets", text: "Tickets" },
  { href: "/info", text: "Info", current: true },
]

function DateRange() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function NavLink({
  href,
  text,
  current,
  className = "",
}: {
  href: string
  text: string
  current?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={`${label} text-foreground underline-offset-4 hover:underline ${
        current ? "underline decoration-2" : ""
      } ${focus} ${className}`}
    >
      {text}
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header className="border-b border-border">
      <div
        className={`${container} flex flex-wrap items-center gap-x-8 gap-y-3 py-3`}
      >
        <a
          href="/"
          className={`font-heading text-h2 text-foreground underline-offset-4 hover:underline ${focus}`}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <p className={`${label} ml-auto hidden md:block`}>
          <DateRange />
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={`h-auto px-5 py-2 ${label} ml-auto md:hidden`}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={`${container} py-2`}>
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} className="block py-2" />
          ))}
        </div>
      </nav>
    </header>
  )
}

const routes = [
  {
    title: "By train",
    fact: "12 min walk from Varsby Central",
    details: (
      <>
        Take the east exit at Varsby Central and follow the yellow signs along
        the quay to the main gate. After both nights the last train from Varsby
        Central leaves at <time dateTime="01:40">01:40</time>.
      </>
    ),
  },
  {
    title: "By tram",
    fact: "Tram 4 · Docks Gate stop",
    details: (
      <>
        Tram 4 runs every 8 minutes from the city centre and stops right outside
        the gate. After both nights the last tram 4 back to the centre leaves at{" "}
        <time dateTime="01:55">01:55</time>.
      </>
    ),
  },
  {
    title: "By bike",
    fact: "400 bike stands at the north gate",
    details: (
      <>
        The harbour cycle path runs all the way to the north gate, where the
        stands are lit and watched all night. Bring your own lock, and leave
        cargo bikes in the marked bays by the fence.
      </>
    ),
  },
]

const days = [
  {
    name: "Friday 4 December",
    date: "2026-12-04",
    times: [
      ["2026-12-04T16:00+01:00", "16:00"],
      ["2026-12-04T17:00+01:00", "17:00"],
      ["2026-12-05T00:30+01:00", "00:30"],
      ["2026-12-04T22:00+01:00", "22:00"],
    ],
  },
  {
    name: "Saturday 5 December",
    date: "2026-12-05",
    times: [
      ["2026-12-05T12:00+01:00", "12:00"],
      ["2026-12-05T13:00+01:00", "13:00"],
      ["2026-12-06T01:00+01:00", "01:00"],
      ["2026-12-05T22:00+01:00", "22:00"],
    ],
  },
]

const columns = [
  "Day",
  "Gates open",
  "First set",
  "Last set ends",
  "Last entry",
]

const bring = [
  "Your ticket, on your phone or printed",
  "A photo ID if you are 13 to 17",
  "Earplugs",
  "A warm layer for the outdoor stage",
  "A card or phone to pay, as the site takes no cash",
  "An empty bottle to fill at the water taps",
]

const leave = [
  "Glass of any kind",
  "Large bags, bigger than 30 × 20 cm",
  "Umbrellas with a point",
  "Drones",
  "Your own food, beyond a snack",
  "Professional cameras with a removable lens",
]

const questions = [
  {
    q: "Can I leave and come back?",
    a: "Yes. Your wristband lets you leave and come back as often as you like until 22:00, the last entry each day.",
  },
  {
    q: "What happens if it rains?",
    a: "The festival goes on. Most stages are indoors in the old harbour halls, and the Crane Stage outdoors has a roof.",
  },
  {
    q: "Is there a cloakroom?",
    a: "Yes, next to the main gate. It costs €3 per item and stays open until the last set ends.",
  },
  {
    q: "Can I bring a camera?",
    a: "Phones and compact cameras are fine. Professional cameras with a removable lens stay at home.",
  },
  {
    q: "Can I change the name on my ticket?",
    a: "Yes, until 1 December. Write to us with your order number and the new name, and we send a new ticket.",
  },
  {
    q: "Do children need a ticket?",
    a: "Children under 13 go free with an adult who has a ticket. Visitors from 13 to 17 need their own ticket and a photo ID.",
  },
]

const sectionRow = "flex flex-wrap items-end justify-between gap-3"
const sectionHeading = "text-h2 md:text-h1"

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <Header />
      <main className={`${container} flex flex-col gap-16 py-8 md:py-16`}>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={label}>
              Tremor Days · <DateRange />
            </p>
            <h1 className="text-h1 md:text-display">Before you go</h1>
          </div>
          <address className="font-heading text-h2 not-italic">
            Varsby Docks, Kajgatan 2, Varsby
          </address>
        </section>

        <section className="flex flex-col gap-8">
          <div className={sectionRow}>
            <h2 className={sectionHeading}>Getting there</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {routes.map((route) => (
              <div key={route.title} className={`${panel} gap-3 md:col-span-4`}>
                <h3 className="text-h2">{route.title}</h3>
                <p className={label}>{route.fact}</p>
                <p>{route.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className={sectionRow}>
            <h2 className={sectionHeading}>Opening times</h2>
          </div>
          <div className={`${panel} gap-5`}>
            <Table label="Opening times" className="text-body">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column}
                      scope="col"
                      className={`px-3 first:pl-0 last:pr-0 ${label} text-muted-foreground`}
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((day) => (
                  <TableRow key={day.date}>
                    <th
                      scope="row"
                      className="px-3 py-2 text-left align-middle text-body font-bold whitespace-nowrap first:pl-0"
                    >
                      <time dateTime={day.date}>{day.name}</time>
                    </th>
                    {day.times.map(([dateTime, text]) => (
                      <TableCell
                        key={dateTime}
                        className="px-3 py-2 first:pl-0 last:pr-0"
                      >
                        <time
                          dateTime={dateTime}
                          className="font-mono tabular-nums"
                        >
                          {text}
                        </time>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="font-mono text-label text-muted-foreground">
              Weekend wristbands can leave and come back until 22:00.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className={sectionRow}>
            <h2 className={sectionHeading}>What to bring</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {[
              { title: "Bring", items: bring, Icon: Check },
              { title: "Leave at home", items: leave, Icon: X },
            ].map(({ title, items, Icon }) => (
              <div key={title} className={`${panel} gap-5 md:col-span-6`}>
                <h3 className="text-h2">{title}</h3>
                <ul className="flex list-none flex-col gap-3 p-0">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon
                        className="mt-1 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className={sectionRow}>
            <h2 className={sectionHeading}>Access</h2>
          </div>
          <div className={`${panel} gap-5`}>
            <div className="flex flex-col gap-3">
              <p className="max-w-xl">
                The whole site is step-free, on hard ground from the gates to
                every stage, bar and toilet.
              </p>
              <p className="max-w-xl">
                Any ticket comes with a free ticket for a companion on request.
                Ask for it when you book, or write to us before the festival.
              </p>
            </div>
            <ul className="flex list-disc flex-col gap-3 pl-5">
              <li>A raised viewing platform at both music stages</li>
              <li>A quiet room in the Drawing Office, open all day</li>
              <li>Accessible toilets at every bar</li>
              <li>Sign language interpreters at every talk</li>
              <li>Assistance dogs welcome</li>
              <li>Sets with strobe lighting: Ossa Bloom and Sister Antenna</li>
            </ul>
            <p className="max-w-xl">
              Write to{" "}
              <a href="mailto:info@tremordays.example" className={textLink}>
                info@tremordays.example
              </a>{" "}
              and we answer within two working days.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className={sectionRow}>
            <h2 className={sectionHeading}>Questions</h2>
          </div>
          <div className={`${panel} gap-0`}>
            <Accordion multiple>
              {questions.map(({ q, a }) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="items-center gap-3 py-3 font-sans text-body font-bold">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-body">
                    <p>{a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className={`${container} flex flex-col gap-3 py-8`}>
          <p className="font-heading text-h2">Tremor Days</p>
          <p className="text-body">
            A two-day music and design festival in the old harbour halls of
            Varsby Docks.
          </p>
          <p className={label}>
            Varsby Docks · <DateRange /> · © 2026 Tremor Days
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
