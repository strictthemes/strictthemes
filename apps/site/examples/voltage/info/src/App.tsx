import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, X } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1200px] px-3 md:px-5"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const panel = "flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusRing
)

const navItems = [
  { href: "/line-up", text: "Line-up" },
  { href: "/tickets", text: "Tickets" },
  { href: "/info", text: "Info", current: true },
]

function navLinkClass(current?: boolean) {
  return cn(
    label,
    "underline-offset-4",
    current ? "underline decoration-2" : "hover:underline",
    focusRing
  )
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function SiteHeader() {
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
        className={cn(
          container,
          "flex flex-wrap items-center gap-x-8 gap-y-3 py-3"
        )}
      >
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={navLinkClass(item.current)}
            >
              {item.text}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto h-auto px-5 py-2 font-mono text-label font-bold uppercase md:hidden"
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cn(navLinkClass(item.current), "block py-2")}
            >
              {item.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-h2 md:text-h1">{children}</h2>
    </div>
  )
}

const routes = [
  {
    title: "By train",
    fact: "12 min walk from Varsby Central",
    text: (
      <>
        Trains stop at Varsby Central every ten minutes, and the walk to the
        docks follows the yellow signs along the quay. After both nights the
        last train from Varsby Central leaves at{" "}
        <time dateTime="01:40">01:40</time>.
      </>
    ),
  },
  {
    title: "By tram",
    fact: "Tram 4 · Docks Gate stop",
    text: (
      <>
        Tram 4 runs from the city centre every eight minutes and stops right at
        the gate. After both nights the last tram 4 leaves Docks Gate at{" "}
        <time dateTime="01:55">01:55</time>.
      </>
    ),
  },
  {
    title: "By bike",
    fact: "400 bike stands at the north gate",
    text: (
      <>
        The stands are free, lit and watched by stewards until the site closes.
        Bring your own lock, as there is no bike hire at the docks.
      </>
    ),
  },
]

const days = [
  {
    name: "Friday 4 December",
    date: "2026-12-04",
    times: [
      ["16:00", "2026-12-04T16:00+01:00"],
      ["17:00", "2026-12-04T17:00+01:00"],
      ["00:30", "2026-12-05T00:30+01:00"],
      ["22:00", "2026-12-04T22:00+01:00"],
    ],
  },
  {
    name: "Saturday 5 December",
    date: "2026-12-05",
    times: [
      ["12:00", "2026-12-05T12:00+01:00"],
      ["13:00", "2026-12-05T13:00+01:00"],
      ["01:00", "2026-12-06T01:00+01:00"],
      ["22:00", "2026-12-05T22:00+01:00"],
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
  "A card or phone to pay, since the site takes no cash",
  "An empty bottle to fill at the water points",
]

const leave = [
  "Glass of any kind",
  "Large bags, bigger than 30 × 20 cm",
  "Umbrellas with a point",
  "Drones",
  "Your own food beyond a snack",
  "Professional cameras with a removable lens",
]

const access = [
  "A raised viewing platform at both music stages",
  "A quiet room in the Drawing Office, open all day",
  "Accessible toilets at every bar",
  "Sign language interpreters at every talk",
  "Assistance dogs welcome everywhere on site",
  "Sets that use strobe lighting: Ossa Bloom and Sister Antenna",
]

const questions = [
  {
    q: "Can I leave and come back?",
    a: "Yes. Your wristband lets you leave and come back as often as you like until 22:00, which is also last entry. If you leave after that, you cannot get back in that night.",
  },
  {
    q: "What happens if it rains?",
    a: "The festival goes ahead in any weather. Most stages are indoors in the old harbour halls, and the Crane Stage is outdoors under a roof, so bring a warm layer rather than an umbrella.",
  },
  {
    q: "Is there a cloakroom?",
    a: "Yes, in the entrance hall by the main gate. It costs €3 per item and stays open until the last set ends.",
  },
  {
    q: "Can I bring a camera?",
    a: "Phone cameras and compact cameras are fine. Professional cameras with a removable lens stay at home.",
  },
  {
    q: "Can I change the name on my ticket?",
    a: "Yes, until 1 December. Write to us with your order number and the new name, and we send you a new ticket.",
  },
  {
    q: "Do children need a ticket?",
    a: "Children under 13 go free with an adult who has a ticket. Anyone aged 13 to 17 needs their own ticket and a photo ID.",
  },
]

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className={cn(container, "flex flex-col gap-16 py-8 md:py-16")}>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={label}>
              Tremor Days · <FestivalDates />
            </p>
            <h1 className="text-h1 md:text-display">Before you go</h1>
          </div>
          <address className="font-heading text-h2 not-italic">
            Varsby Docks, Kajgatan 2, Varsby
          </address>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading>Getting there</SectionHeading>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {routes.map((route) => (
              <div key={route.title} className={cn(panel, "md:col-span-4")}>
                <h3 className="text-h2">{route.title}</h3>
                <p className={label}>{route.fact}</p>
                <p className="max-w-xl">{route.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading>Opening times</SectionHeading>
          <div className={cn(panel, "gap-5")}>
            <Table label="Opening times" className="text-body">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column}
                      scope="col"
                      className="px-3 font-mono text-label font-bold text-muted-foreground uppercase first:pl-0 last:pr-0"
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
                    {day.times.map(([time, dateTime]) => (
                      <TableCell
                        key={dateTime}
                        className="px-3 py-2 first:pl-0 last:pr-0"
                      >
                        <time
                          dateTime={dateTime}
                          className="font-mono tabular-nums"
                        >
                          {time}
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
          <SectionHeading>What to bring</SectionHeading>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className={cn(panel, "gap-5 md:col-span-6")}>
              <h3 className="text-h2">Bring</h3>
              <ul className="flex list-none flex-col gap-3 p-0">
                {bring.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(panel, "gap-5 md:col-span-6")}>
              <h3 className="text-h2">Leave at home</h3>
              <ul className="flex list-none flex-col gap-3 p-0">
                {leave.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <X aria-hidden="true" className="mt-1 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading>Access</SectionHeading>
          <div className={cn(panel, "gap-5")}>
            <div className="flex flex-col gap-3">
              <p className="max-w-xl">
                The whole site is step-free, on hard, level ground from the tram
                stop to every stage, bar and toilet. Ramps lead up to the
                harbour halls, and the paths between them are lit after dark.
              </p>
              <p className="max-w-xl">
                Any ticket comes with a free ticket for a companion on request.
                Ask for it when you write to us, and we add the companion ticket
                to your order.
              </p>
            </div>
            <ul className="flex list-disc flex-col gap-3 pl-5">
              {access.map((item) => (
                <li key={item}>{item}</li>
              ))}
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
          <SectionHeading>Questions</SectionHeading>
          <div className={cn(panel, "gap-0")}>
            <Accordion multiple>
              {questions.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="items-center gap-3 py-3 font-sans text-body font-bold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-body">
                    <p>{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className={cn(container, "flex flex-col gap-3 py-8")}>
          <p className="font-heading text-h2">Tremor Days</p>
          <p>
            A two-day music and design festival in the old harbour halls of
            Varsby Docks.
          </p>
          <p className={label}>
            Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
