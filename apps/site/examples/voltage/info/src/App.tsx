import { useRef, useState, type KeyboardEvent } from "react"
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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase"
const textLink = cn(
  "text-foreground underline underline-offset-4 hover:decoration-2",
  focusRing
)
const panel = "flex flex-col rounded-xl border border-border bg-card p-5"

const navLinks = [
  { href: "/line-up", text: "Line-up" },
  { href: "/tickets", text: "Tickets" },
  { href: "/info", text: "Info" },
]
const currentPath = "/info"

function navLinkClass(href: string, extra?: string) {
  return cn(
    label,
    "text-foreground hover:underline underline-offset-4",
    href === currentPath && "underline decoration-2 underline-offset-4",
    focusRing,
    extra
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
  const menuButton = useRef<HTMLButtonElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground hover:underline underline-offset-4",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === currentPath ? "page" : undefined}
              className={navLinkClass(link.href)}
            >
              {link.text}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto h-auto px-5 py-2 font-mono text-label font-bold uppercase md:hidden"
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
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === currentPath ? "page" : undefined}
              className={navLinkClass(link.href, "block py-2")}
            >
              {link.text}
            </a>
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
    body: (
      <>
        Trains run to Varsby Central every ten minutes, and the walk to the
        docks follows the canal with signs all the way. After both nights the
        last train from Varsby Central leaves at{" "}
        <time dateTime="01:40">01:40</time>.
      </>
    ),
  },
  {
    title: "By tram",
    fact: "Tram 4 · Docks Gate stop",
    body: (
      <>
        Tram 4 runs from the city centre and stops right at the gate. After
        both nights the last tram 4 leaves Docks Gate at{" "}
        <time dateTime="01:55">01:55</time>.
      </>
    ),
  },
  {
    title: "By bike",
    fact: "400 bike stands at the north gate",
    body: (
      <>
        The stands are free and lit all night, but bring your own lock. The
        cycle path along Kajgatan leads straight to the north gate.
      </>
    ),
  },
]

const days = [
  {
    day: "Friday 4 December",
    date: "2026-12-04",
    times: [
      ["16:00", "2026-12-04T16:00+01:00"],
      ["17:00", "2026-12-04T17:00+01:00"],
      ["00:30", "2026-12-05T00:30+01:00"],
      ["22:00", "2026-12-04T22:00+01:00"],
    ],
  },
  {
    day: "Saturday 5 December",
    date: "2026-12-05",
    times: [
      ["12:00", "2026-12-05T12:00+01:00"],
      ["13:00", "2026-12-05T13:00+01:00"],
      ["01:00", "2026-12-06T01:00+01:00"],
      ["22:00", "2026-12-05T22:00+01:00"],
    ],
  },
]

const columns = ["Day", "Gates open", "First set", "Last set ends", "Last entry"]

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
  "Assistance dogs welcome",
  "Strobe lighting in two sets: Ossa Bloom and Sister Antenna",
]

const questions = [
  {
    q: "Can I leave and come back?",
    a: "Yes. With a weekend wristband you can leave and come back as often as you like until 22:00. After that, leaving is final for the night.",
  },
  {
    q: "What happens if it rains?",
    a: "The music goes on. Most of the stages are indoors in the old harbour halls, and the Crane Stage outside has a roof, so a warm layer is all you need.",
  },
  {
    q: "Is there a cloakroom?",
    a: "Yes, inside the main gate. It costs €3 an item and stays open until the last set ends.",
  },
  {
    q: "Can I bring a camera?",
    a: "Phone cameras and compact cameras are fine. Professional cameras with a removable lens stay at home.",
  },
  {
    q: "Can I change the name on my ticket?",
    a: "Yes, until 1 December. Write to the email address in the Access section above with your order number and the new name, and we send you a new ticket.",
  },
  {
    q: "Do children need a ticket?",
    a: "Children under 13 go free with an adult and need no ticket. Anyone 13 or older needs a ticket of their own, and 13 to 17 year olds bring a photo ID.",
  },
]

function SectionHeading({ children }: { children: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-h2 md:text-h1">{children}</h2>
    </div>
  )
}

function ItemList({
  items,
  icon: Icon,
}: {
  items: string[]
  icon: typeof Check
}) {
  return (
    <ul className="flex list-none flex-col gap-3 p-0">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-body">
          <Icon className="mt-1 size-4 shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={cn(label, "tabular-nums")}>
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
              <div key={route.title} className={cn(panel, "gap-3 md:col-span-4")}>
                <h3 className="text-h2">{route.title}</h3>
                <p className={cn(label, "tabular-nums")}>{route.fact}</p>
                <p className="max-w-xl">{route.body}</p>
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
                      className={cn(
                        label,
                        "px-3 text-muted-foreground first:pl-0 last:pr-0"
                      )}
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {days.map((row) => (
                  <TableRow key={row.date}>
                    <th
                      scope="row"
                      className="px-3 py-2 text-left align-middle text-body font-bold whitespace-nowrap first:pl-0"
                    >
                      <time dateTime={row.date}>{row.day}</time>
                    </th>
                    {row.times.map(([time, dateTime]) => (
                      <TableCell
                        key={dateTime + time}
                        className="px-3 py-2 font-mono tabular-nums first:pl-0 last:pr-0"
                      >
                        <time dateTime={dateTime}>{time}</time>
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
              <ItemList items={bring} icon={Check} />
            </div>
            <div className={cn(panel, "gap-5 md:col-span-6")}>
              <h3 className="text-h2">Leave at home</h3>
              <ItemList items={leave} icon={X} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading>Access</SectionHeading>
          <div className={cn(panel, "gap-5")}>
            <div className="flex flex-col gap-3">
              <p className="max-w-xl">
                The whole site is step-free, on hard ground.
              </p>
              <p className="max-w-xl">
                Any ticket comes with a free ticket for a companion on request.
              </p>
            </div>
            <ul className="flex list-disc flex-col gap-3 pl-5 text-body">
              {access.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="max-w-xl">
              Write to{" "}
              <a
                href="mailto:info@tremordays.example"
                className={cn(textLink, "wrap-break-word")}
              >
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
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
          <p className="font-heading text-h2">Tremor Days</p>
          <p className="text-body">
            A two-day music and design festival at Varsby Docks.
          </p>
          <p className={cn(label, "tabular-nums")}>
            Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
