import { useState } from "react"
import { MapPin } from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)
const label = "font-mono text-label text-muted-foreground"

const navItems = [
  { name: "Menu", href: "/menu" },
  { name: "Book a table", href: "/booking" },
  { name: "Journal", href: "/journal" },
  { name: "Visit", href: "/visit", current: true },
]

type Hours = { from: string; to: string } | null

const kitchen: Hours = { from: "11:30", to: "14:30" }

// jsDay follows Date.getDay(): 0 is Sunday.
const week: { day: string; jsDay: number; room: Hours; kitchen: Hours }[] = [
  { day: "Monday", jsDay: 1, room: null, kitchen: null },
  { day: "Tuesday", jsDay: 2, room: { from: "09:00", to: "17:00" }, kitchen },
  { day: "Wednesday", jsDay: 3, room: { from: "09:00", to: "17:00" }, kitchen },
  { day: "Thursday", jsDay: 4, room: { from: "09:00", to: "17:00" }, kitchen },
  { day: "Friday", jsDay: 5, room: { from: "09:00", to: "17:00" }, kitchen },
  { day: "Saturday", jsDay: 6, room: { from: "09:00", to: "18:00" }, kitchen },
  { day: "Sunday", jsDay: 0, room: { from: "10:00", to: "16:00" }, kitchen },
]

function clock(time: string) {
  return time.replace(/^0/, "")
}

function Span({ hours }: { hours: Hours }) {
  if (!hours) return <>Closed</>
  return (
    <>
      <time dateTime={hours.from}>{clock(hours.from)}</time>–
      <time dateTime={hours.to}>{clock(hours.to)}</time>
    </>
  )
}

const travel = [
  {
    title: "By train",
    text: "Ashby Wold station is a four-minute walk. Leave by the main entrance and turn right onto Station Road.",
  },
  {
    title: "By bus",
    text: "The 12 and 31 buses stop outside Orchard Park, across the road from our door.",
  },
  {
    title: "By bike",
    text: "There are four bike stands on Mill Lane, just past our front window.",
  },
  {
    title: "By car",
    text: "There is no parking on Mill Lane. The car park on Station Road is three minutes away on foot.",
  },
]

const access = [
  "A step-free entrance on Mill Lane, with a door wide enough for a wheelchair.",
  "An accessible toilet on the ground floor.",
  "Two tables at wheelchair height by the window.",
  "A printed large-type menu at the counter: ask and we will bring it over.",
  "Assistance dogs are welcome, with a bowl of water by the door.",
  "A quiet first hour on Tuesdays, with the music off.",
]

function HoursTable() {
  const [today] = useState(() => new Date().getDay())
  const cell =
    "px-4 py-2 first:pl-0 last:pr-0 font-mono text-label text-foreground tabular-nums whitespace-nowrap"
  return (
    <Table label="Opening hours" className="text-body">
      <TableCaption className="sr-only">Opening hours</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {["Day", "Room", "Kitchen"].map((heading) => (
            <TableHead
              key={heading}
              scope="col"
              className="h-auto px-4 py-2 font-mono text-label text-muted-foreground first:pl-0 last:pr-0"
            >
              {heading}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {week.map((row) => {
          const isToday = row.jsDay === today
          return (
            <TableRow
              key={row.day}
              aria-current={isToday ? "date" : undefined}
              className="hover:bg-transparent"
            >
              <TableHead
                scope="row"
                className="h-auto px-4 py-2 text-left font-sans text-body font-normal whitespace-normal text-foreground first:pl-0 last:pr-0"
              >
                {row.day}
                {isToday && (
                  <span className="block font-mono text-label text-primary">
                    Today
                  </span>
                )}
              </TableHead>
              <TableCell className={cell}>
                <Span hours={row.room} />
              </TableCell>
              <TableCell className={cell}>
                <Span hours={row.kitchen} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

const tag =
  "rounded-sm bg-card px-2 py-1 font-mono text-label whitespace-nowrap text-foreground"

function StreetMap() {
  return (
    <figure>
      <div
        role="img"
        aria-label="Map of the streets around The Linden Room"
        aria-describedby="map-directions"
        className="relative aspect-4/3 overflow-hidden rounded-xl border bg-muted"
      >
        <div className="absolute inset-x-0 top-1/6 h-1 bg-secondary" />
        <div className="absolute inset-x-0 top-1/2 h-4 bg-background" />
        <div className="absolute inset-y-0 left-1/4 w-4 bg-background" />
        <div className="absolute right-1/12 bottom-1/12 flex h-1/5 w-2/5 items-center justify-center border bg-card">
          <span className={tag}>Orchard Park</span>
        </div>
        <span className={cn(tag, "absolute right-1/12 bottom-1/2")}>
          Station Road
        </span>
        <span className={cn(tag, "absolute top-1/4 left-1/4")}>Mill Lane</span>
        <div className="absolute top-7/12 left-1/4 flex items-center gap-1">
          <MapPin
            className="size-6 text-primary"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className={cn(tag, "border")}>The Linden Room</span>
        </div>
      </div>
      <figcaption className={cn(label, "mt-2")}>Not to scale</figcaption>
    </figure>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(navLink, "font-heading text-h2")}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(navLink, "text-body", item.current && "underline")}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={label}>Mill Lane, Ashby Wold</p>
            <h1 className="mt-2 text-h1">Visit us</h1>
            <p className="mt-4 max-w-xl">
              We are on the corner of Mill Lane and Station Road, opposite
              Orchard Park, four minutes from the station. There is no need to
              book unless you are four or more.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <h2 className="text-h2">Address</h2>
            <address className="mt-4 not-italic">
              <span className="block">14 Mill Lane</span>
              <span className="block">Ashby Wold</span>
              <span className="block">AW3 7LN</span>
              <p className="mt-4">
                <a href="tel:+441632960418" className={textLink}>
                  01632 960 418
                </a>
              </p>
              <p className="mt-2">
                <a href="mailto:hello@lindenroom.example" className={textLink}>
                  hello@lindenroom.example
                </a>
              </p>
            </address>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-h2">Opening hours</h2>
            <div className="mt-6">
              <HoursTable />
            </div>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <h2 className="text-h2">Getting here</h2>
            <ul className="mt-6">
              {travel.map((entry, index) => (
                <li key={entry.title} className={index > 0 ? "mt-6" : undefined}>
                  <h3 className="text-body">{entry.title}</h3>
                  <p className="mt-2 max-w-xl">{entry.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <StreetMap />
            <p id="map-directions" className="mt-4 max-w-xl">
              From the station, walk down Station Road for four minutes. We are
              on the corner with Mill Lane, opposite Orchard Park.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Access</h2>
            <ul className="mt-4 max-w-xl list-disc pl-6">
              {access.map((note, index) => (
                <li key={note} className={index > 0 ? "mt-2" : undefined}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-h2">Write to us</h2>
            <p className="mt-4 max-w-xl">
              Ines Marlow, who runs the room, reads every message herself and
              answers within two days.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop on Mill Lane, pouring loose-leaf tea and
                baking at the counter every morning.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className={cn(label, "mt-4")}>
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className={cn(label, "mt-6")}>© 2026 The Linden Room</p>
        </div>
      </footer>
    </div>
  )
}

export default App
