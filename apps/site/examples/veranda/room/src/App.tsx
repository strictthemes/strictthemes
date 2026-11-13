import { ArrowRight, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
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

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { label: "Rooms", href: "/rooms", current: true },
  { label: "Menu", href: "/menu", current: false },
  { label: "Find us", href: "/#find-us", current: false },
  { label: "Reserve", href: "/reserve", current: false },
]

const facts = [
  { term: "Bed", detail: "King bed, 150 cm wide" },
  { term: "Size", detail: "22 m²" },
  { term: "View", detail: "The sea, through a bay window" },
  { term: "Floor", detail: "First floor, 16 stairs, no lift" },
  { term: "Sleeps", detail: "2 guests" },
  { term: "Bathroom", detail: "A bath with a shower over it" },
]

const included = [
  "Linen sheets and wool blankets",
  "A kettle, loose tea and fresh milk",
  "Towels, soap and a hot water bottle",
  "Wifi through the house",
  "Free parking at the quay",
]

const seasons = [
  { season: "Winter", dates: "1 November to 31 March", price: "£128" },
  {
    season: "Spring and autumn",
    dates: "1 April to 30 June, and 1 September to 31 October",
    price: "£152",
  },
  { season: "Summer", dates: "1 July to 31 August", price: "£178" },
]

const otherRooms = [
  { name: "Samphire", price: "From £112 a night" },
  { name: "Sea Holly", price: "From £142 a night" },
  { name: "Thrift", price: "From £104 a night" },
]

const cellPad = "px-4 py-2 first:pl-0 last:pr-0"

function Plate({
  label: description,
  window,
  ground = "h-1/3",
  className,
}: {
  label: string
  window: "left-1/6" | "right-1/6"
  ground?: "h-1/4" | "h-1/3" | "h-1/2"
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={description}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <div className={cn("absolute inset-x-0 bottom-0 bg-secondary", ground)} />
      <div
        className={cn("absolute top-1/6 h-1/3 w-1/4 bg-secondary", window)}
      />
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "true" : undefined}
                  className={cn(label, plainLink, link.current && "underline")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section aria-labelledby="room-title" className="pt-12">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className={cn(label, "text-muted-foreground")}>
                  Room 4 of 6 · First floor
                </p>
                <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                  Sea view
                </Badge>
              </div>
              <h1 id="room-title" className="mt-2 text-h1 lg:text-display">
                Marram
              </h1>
              <p className="mt-4 max-w-xl">
                The bay window at the front of the house, with the sea in all
                three panes.
              </p>
            </div>
          </div>

          <figure className="mt-6">
            <div className="grid gap-6 md:grid-cols-12">
              <Plate
                label="The bay window of Marram, with the bed facing the sea"
                window="left-1/6"
                className="aspect-4/3 md:col-span-8 md:aspect-auto"
              />
              <div className="grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-1">
                <Plate
                  label="The writing table in the bay, two chairs and the harbour wall below"
                  window="right-1/6"
                  ground="h-1/2"
                  className="aspect-4/3"
                />
                <Plate
                  label="The bathroom of Marram, a deep bath under a small window"
                  window="right-1/6"
                  ground="h-1/4"
                  className="aspect-4/3"
                />
              </div>
            </div>
            <figcaption className={cn("mt-2", label, "text-muted-foreground")}>
              Marram · The bay window, the writing table and the bath
            </figcaption>
          </figure>
        </section>

        <section
          aria-labelledby="room-heading"
          className="mt-12 grid gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12 md:items-start"
        >
          <aside
            aria-label="Price and request"
            className="rounded-xl border border-border bg-card p-6 md:sticky md:top-6 md:col-span-4 md:col-start-9 md:row-start-1"
          >
            <p className={cn(label, "text-muted-foreground")}>From</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-heading text-h1 tabular-nums">£128</span>
              <span className={cn(label, "text-muted-foreground")}>
                a night
              </span>
            </p>
            <p className={cn("mt-2", label, "text-foreground")}>
              Sleeps 2 · Breakfast included
            </p>
            <dl className="mt-6 divide-y divide-border border-y border-border">
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(label, "text-muted-foreground")}>Arrive</dt>
                <dd className="text-right text-body text-foreground">
                  <time dateTime="15:00">15:00</time>–
                  <time dateTime="20:00">20:00</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(label, "text-muted-foreground")}>Leave by</dt>
                <dd className="text-right text-body text-foreground">
                  <time dateTime="10:30">10:30</time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2">
                <dt className={cn(label, "text-muted-foreground")}>
                  July and August
                </dt>
                <dd className="text-right text-body text-foreground">
                  Two nights or more
                </dd>
              </div>
            </dl>
            <p className="mt-6">
              <a
                href="/reserve?room=marram"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase",
                  "w-full text-center whitespace-normal"
                )}
              >
                Request this room
              </a>
            </p>
            <p className="mt-4 font-mono text-label text-muted-foreground">
              A request, not a payment. We reply within a day.
            </p>
          </aside>

          <div className="md:col-span-7 md:col-start-1 md:row-start-1">
            <p className={cn(label, "text-muted-foreground")}>
              At the front of the house
            </p>
            <h2 id="room-heading" className="mt-2 text-h2 md:text-h1">
              The room
            </h2>
            <p className="mt-4 max-w-xl">
              Marram was the room the harbour pilot kept for himself when the
              house was built in 1894. Its bay window faces south over the
              harbour wall, so the sun is in the room from breakfast until late
              afternoon, and the sea fills all three panes.
            </p>
            <p className="mt-4 max-w-xl">
              The bed is a king, made up with linen sheets and wool blankets. In
              the bay stands a writing table with two chairs, a good place for a
              pot of tea while the boats come in past the wall.
            </p>
            <p className="mt-4 max-w-xl">
              The bathroom has a deep bath with a shower over it. The room is
              above the breakfast room, so you will hear the first kettle at
              about <time dateTime="07:30">07:30</time>, a while before we serve
              breakfast at <time dateTime="08:00">08:00</time>.
            </p>

            <h3
              className={cn(
                "mt-12 font-mono text-label uppercase",
                "text-foreground"
              )}
            >
              The facts
            </h3>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {facts.map((fact) => (
                <div
                  key={fact.term}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <dt className={cn(label, "text-muted-foreground")}>
                    {fact.term}
                  </dt>
                  <dd className="text-right text-body text-foreground">
                    {fact.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 rounded-xl bg-clay p-6 text-clay-foreground">
              <p className={label}>In the price of the room</p>
              <h3 className="mt-2 text-h2">What is included</h3>
              <ul className="mt-6 grid list-none gap-x-6 gap-y-2 p-0 md:grid-cols-2">
                <li className="flex items-start gap-2 text-body">
                  <Check
                    className="mt-1 size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span>
                    Breakfast on the veranda, from{" "}
                    <time dateTime="08:00">08:00</time> to{" "}
                    <time dateTime="10:00">10:00</time>
                  </span>
                </li>
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body">
                    <Check
                      className="mt-1 size-4 shrink-0"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="prices-heading"
          className="mt-12 grid gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>
              Per night · Breakfast included
            </p>
            <h2 id="prices-heading" className="mt-2 text-h2 md:text-h1">
              Prices by season
            </h2>
            <p className="mt-4 max-w-xl">
              The price is for the room, for one guest or two, and each night is
              charged at the price of its season.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Table label="Prices by season" className="text-body">
              <TableCaption className="sr-only">Prices by season</TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Season", "Dates", "A night"].map((heading, i) => (
                    <TableHead
                      key={heading}
                      scope="col"
                      className={cn(
                        "h-auto font-normal",
                        cellPad,
                        label,
                        "text-muted-foreground",
                        i === 2 && "text-right"
                      )}
                    >
                      {heading}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasons.map((row) => (
                  <TableRow key={row.season} className="hover:bg-transparent">
                    <TableHead
                      scope="row"
                      className={cn(
                        "h-auto whitespace-normal",
                        cellPad,
                        "text-left font-sans text-body font-normal text-foreground"
                      )}
                    >
                      {row.season}
                    </TableHead>
                    <TableCell
                      className={cn(cellPad, "text-body whitespace-normal")}
                    >
                      {row.dates}
                    </TableCell>
                    <TableCell
                      className={cn(
                        cellPad,
                        label,
                        "text-right whitespace-nowrap text-foreground tabular-nums"
                      )}
                    >
                      {row.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-4 font-mono text-label text-muted-foreground">
              In July and August we take stays of two nights or more.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="other-heading"
          className="mt-12 grid gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>
              Five more rooms
            </p>
            <h2 id="other-heading" className="mt-2 text-h2 md:text-h1">
              Other rooms
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ul className="list-none p-0">
              {otherRooms.map((room) => (
                <li key={room.name} className="flex items-baseline gap-2 py-2">
                  <a href="#" className={cn("min-w-0 text-body", plainLink)}>
                    {room.name}
                  </a>
                  <span
                    aria-hidden="true"
                    className="min-w-4 flex-1 border-b border-border"
                  />
                  <span
                    className={cn(
                      label,
                      "shrink-0 whitespace-nowrap text-muted-foreground tabular-nums"
                    )}
                  >
                    {room.price}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <a
                href="/rooms"
                className={cn(
                  label,
                  textLink,
                  "inline-flex items-center gap-2"
                )}
              >
                See all six rooms
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4">
              <a
                href="tel:+441632960352"
                className={cn("text-body", plainLink)}
              >
                01632 960 352
              </a>
            </p>
            <p className="mt-2">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={cn("text-body", plainLink)}
              >
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn("mt-6", label, "text-muted-foreground")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

export default App
