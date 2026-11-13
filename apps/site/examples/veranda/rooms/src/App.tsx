import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const buttonClasses =
  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"

const label = "font-mono text-label uppercase"

type Room = {
  name: string
  href: string
  floor: string
  sentence: string
  sleeps: number
  bed: string
  view: string
  from: number
  window: "left" | "right"
  ground: "h-1/4" | "h-1/3" | "h-1/2"
  picture: string
}

const rooms: Room[] = [
  {
    name: "Thrift",
    href: "#",
    floor: "Ground floor",
    sentence:
      "On the garden side, with a door of its own to the walled garden and no stairs to climb.",
    sleeps: 2,
    bed: "Double bed",
    view: "Garden view",
    from: 104,
    window: "right",
    ground: "h-1/2",
    picture: "Thrift on the ground floor, its door open to the walled garden",
  },
  {
    name: "Campion",
    href: "#",
    floor: "First floor",
    sentence:
      "The smallest room, with a writing desk at the window and the garden below.",
    sleeps: 1,
    bed: "Single bed",
    view: "Garden view",
    from: 78,
    window: "left",
    ground: "h-1/3",
    picture: "Campion, a single bed and a desk at a tall window",
  },
  {
    name: "Samphire",
    href: "#",
    floor: "First floor",
    sentence: "Two beds under a tall window that looks along the quay.",
    sleeps: 2,
    bed: "Twin beds",
    view: "Harbour view",
    from: 112,
    window: "right",
    ground: "h-1/4",
    picture: "Samphire, twin beds under a window that looks along the quay",
  },
  {
    name: "Marram",
    href: "/rooms/marram",
    floor: "First floor",
    sentence:
      "The bay window at the front of the house, with the sea in all three panes.",
    sleeps: 2,
    bed: "King bed",
    view: "Sea view",
    from: 128,
    window: "left",
    ground: "h-1/3",
    picture: "The bay window of Marram, with the bed facing the sea",
  },
  {
    name: "Sea Holly",
    href: "#",
    floor: "Second floor",
    sentence:
      "Up under the roof, with a daybed in the dormer for a third guest or an afternoon.",
    sleeps: 3,
    bed: "King bed and a daybed",
    view: "Sea view",
    from: 142,
    window: "right",
    ground: "h-1/3",
    picture: "Sea Holly under the roof, a daybed in the dormer window",
  },
  {
    name: "Tamarisk",
    href: "#",
    floor: "Second floor",
    sentence:
      "Two rooms joined by a short landing, for a family or for four friends.",
    sleeps: 4,
    bed: "King bed and two singles",
    view: "Harbour view",
    from: 164,
    window: "left",
    ground: "h-1/4",
    picture: "Tamarisk under the eaves, two rooms joined by a short landing",
  },
]

type Filter = "all" | "one" | "two" | "more"

const filters: {
  value: Filter
  label: string
  guests: string
  fits: (r: Room) => boolean
}[] = [
  { value: "all", label: "All rooms", guests: "", fits: () => true },
  {
    value: "one",
    label: "One guest",
    guests: "one guest",
    fits: (r) => r.sleeps === 1,
  },
  {
    value: "two",
    label: "Two guests",
    guests: "two guests",
    fits: (r) => r.sleeps === 2,
  },
  {
    value: "more",
    label: "Three or more",
    guests: "three or more guests",
    fits: (r) => r.sleeps >= 3,
  },
]

const navItems = [
  { label: "Rooms", href: "/rooms", current: true },
  { label: "Menu", href: "/menu", current: false },
  { label: "Find us", href: "/#find-us", current: false },
  { label: "Reserve", href: "/reserve", current: false },
]

const included = [
  "Breakfast on the veranda",
  "Linen sheets and wool blankets",
  "A kettle, loose tea and fresh milk",
  "Wifi through the house",
  "Free parking at the quay",
  "A key of your own, to come and go as you like",
]

function countRooms(n: number) {
  return `${n} ${n === 1 ? "room" : "rooms"}`
}

function RoomRow({ room, index }: { room: Room; index: number }) {
  const plateFirst = index % 2 === 0

  return (
    <li className="grid grid-cols-1 gap-6 py-12 first:pt-0 last:pb-0 md:grid-cols-12 md:items-center">
      <div
        role="img"
        aria-label={room.picture}
        className={cn(
          "relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted",
          plateFirst
            ? "md:col-span-7"
            : "md:col-span-7 md:col-start-6 md:row-start-1"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-secondary",
            room.ground
          )}
        />
        <div
          className={cn(
            "absolute top-1/6 h-1/3 w-1/4 bg-secondary",
            room.window === "left" ? "left-1/6" : "right-1/6"
          )}
        />
      </div>
      <div
        className={cn(
          plateFirst
            ? "md:col-span-4 md:col-start-9"
            : "md:col-span-4 md:col-start-1 md:row-start-1"
        )}
      >
        <p className={cn(label, "text-muted-foreground")}>{room.floor}</p>
        <h3 className="mt-2 text-h2 text-foreground md:text-h1">{room.name}</h3>
        <p className="mt-4 max-w-xl text-body">{room.sentence}</p>
        <p className={cn(label, "mt-4 text-foreground tabular-nums")}>
          Sleeps {room.sleeps} · {room.bed} · {room.view}
        </p>
        <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
          From £{room.from} a night
        </p>
        <p className="mt-6">
          <a
            href={room.href}
            className={cn(label, textLink, "inline-flex items-center gap-2")}
          >
            See {room.name}
            <ArrowRight
              className="size-4"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </a>
        </p>
      </div>
    </li>
  )
}

export function App() {
  const [filter, setFilter] = useState<Filter>("all")
  const chosen = filters.find((f) => f.value === filter) ?? filters[0]
  const shown = rooms.filter(chosen.fits)

  const status =
    filter === "all"
      ? `Showing all ${countRooms(shown.length)}`
      : `Showing ${countRooms(shown.length)} for ${chosen.guests}`

  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(label, headerLink, item.current && "underline")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="page-title"
          className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground tabular-nums")}>
                Six rooms · From £78 a night
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Breakfast included
              </Badge>
            </div>
            <h1
              id="page-title"
              className="mt-2 text-h1 text-foreground lg:text-display"
            >
              Six rooms, <span className="italic">no two alike</span>
            </h1>
            <p className="mt-4 max-w-xl text-body">
              A price is for the room for one night, with breakfast for everyone
              in it. You can arrive from <time dateTime="15:00">15:00</time> and
              stay until <time dateTime="10:30">10:30</time> on the day you
              leave.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="rooms-title"
          className="mt-12 border-t border-border pt-6 md:mt-26"
        >
          <h2 id="rooms-title" className="sr-only">
            The rooms
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div
              role="group"
              aria-label="Show rooms for"
              className="flex flex-wrap gap-2"
            >
              {filters.map((f) => {
                const isChosen = f.value === filter
                return (
                  <Button
                    key={f.value}
                    type="button"
                    variant={isChosen ? "secondary" : "outline"}
                    aria-pressed={isChosen}
                    onClick={() => setFilter(f.value)}
                    className={buttonClasses}
                  >
                    {f.label}
                  </Button>
                )
              })}
            </div>
            <p
              role="status"
              className={cn(label, "text-foreground tabular-nums")}
            >
              {status}
            </p>
          </div>
          <p className="mt-4 max-w-xl font-mono text-label text-muted-foreground">
            A guest travelling alone is welcome in any room for two, at the
            room&apos;s price.
          </p>

          {shown.length > 0 ? (
            <ul className="mt-12 divide-y divide-border">
              {shown.map((room, i) => (
                <RoomRow key={room.name} room={room} index={i} />
              ))}
            </ul>
          ) : (
            <p className="mt-12 max-w-xl text-body">
              No room sleeps that many. Write to us and we will see what we can
              do.
            </p>
          )}
        </section>

        <section
          aria-labelledby="included-title"
          className="mt-12 grid grid-cols-1 gap-6 md:mt-26 md:grid-cols-12 md:items-end"
        >
          <div className="rounded-xl bg-clay p-6 text-clay-foreground md:col-span-7">
            <p className={label}>Included in every price</p>
            <h2 id="included-title" className="mt-2 text-h2 md:text-h1">
              In every room
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body">
                  <Check
                    className="mt-1 size-4 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className={cn(label, "text-muted-foreground")}>No payment now</p>
            <p className="mt-2 max-w-xl text-body">
              Send a request and we reply within a day.
            </p>
            <p className="mt-6">
              <a
                href="/reserve"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  buttonClasses
                )}
              >
                Request a room
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2 text-foreground">
              Kittiwake House
            </p>
            <p className="mt-2 max-w-xl text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4 text-body">
              <a href="tel:+441632960352" className={headerLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 text-body wrap-break-word">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={headerLink}
              >
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn(label, "mt-6 text-muted-foreground tabular-nums")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

export default App
