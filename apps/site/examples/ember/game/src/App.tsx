import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1280px] px-3 md:px-6"
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentPage = "/"

type GameClass = {
  name: string
  role: string
  difficulty: string
  text: string
  emblem: ReactNode
}

const classes: GameClass[] = [
  {
    name: "Bulwark",
    role: "Front line",
    difficulty: "Low",
    text: "Plants a heavy shield and holds the ground the team wants to take. Slow on the move, but hard to push off a point once set.",
    emblem: <div className="h-1/2 w-1/3 bg-heat-mid" />,
  },
  {
    name: "Cinderblade",
    role: "Close damage",
    difficulty: "High",
    text: "Dashes in, strikes twice and gets out before the fire catches up. Every mistake costs a life, so timing is everything.",
    emblem: <div className="h-2/3 w-1/12 bg-heat-high" />,
  },
  {
    name: "Flarecaster",
    role: "Ranged damage",
    difficulty: "Medium",
    text: "Throws flares that burn a patch of salt for a few seconds. Fights from the back line and shuts lanes down from afar.",
    emblem: <div className="aspect-square h-1/3 bg-heat-high" />,
  },
  {
    name: "Mender",
    role: "Support",
    difficulty: "Medium",
    text: "Heals one ally at a time and can pull a teammate out of a fight. Keeps the team standing through the last round.",
    emblem: (
      <div className="flex h-1/3 gap-3">
        <div className="aspect-square h-full bg-heat-mid" />
        <div className="aspect-square h-full bg-heat-high" />
      </div>
    ),
  },
]

type NewsItem = {
  date: string
  dateLabel: string
  title: string
  href: string
  text: string
  badge?: string
  hasNumber: boolean
}

const news: NewsItem[] = [
  {
    date: "2026-11-10",
    dateLabel: "Tue 10 Nov",
    title: "Patch 4.2: Duel Pits and a round of balance",
    href: "/patch",
    text: "Duel Pits brings two-against-two fights to a small arena, and the Cinderblade dash now costs more energy.",
    badge: "New",
    hasNumber: true,
  },
  {
    date: "2026-11-05",
    dateLabel: "Thu 5 Nov",
    title: "The Ashfall Open: qualifiers start in December",
    href: "#",
    text: "Teams of five can sign up now for the open qualifiers, played online over three weekends in December.",
    hasNumber: false,
  },
  {
    date: "2026-10-20",
    dateLabel: "Tue 20 Oct",
    title: "Patch 4.1: matchmaking for groups of five",
    href: "#",
    text: "A full group of five now queues against other full groups first, so solo players meet fewer set teams.",
    hasNumber: true,
  },
  {
    date: "2026-10-06",
    dateLabel: "Tue 6 Oct",
    title: "Season 4: Dry Lightning is live",
    href: "#",
    text: "The new season opens with the map Glasswater Yard, a 60-tier season pass and a fresh start for every rank.",
    hasNumber: true,
  },
]

const specs = [
  {
    part: "System",
    min: "64-bit Windows 10",
    rec: "64-bit Windows 11",
  },
  {
    part: "Processor",
    min: "4 cores at 3.0 GHz",
    rec: "6 cores at 3.6 GHz",
  },
  { part: "Memory", min: "8 GB", rec: "16 GB" },
  {
    part: "Graphics",
    min: "4 GB of video memory, DirectX 12",
    rec: "8 GB of video memory, DirectX 12",
  },
  { part: "Storage", min: "35 GB", rec: "35 GB on an SSD" },
  { part: "Network", min: "Broadband", rec: "Broadband" },
]

const cell = "px-3 first:pl-0 last:pr-0"

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex items-center justify-between gap-6 py-3"
        )}
      >
        <a href="/" className={cn(titleLink, "font-heading text-h2 uppercase")}>
          Ashfall
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === currentPage ? "page" : undefined}
                  className={cn(
                    navLink,
                    page.href === currentPage && "underline decoration-2"
                  )}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="menu-small"
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonClasses, "md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav
        id="menu-small"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className={cn(container, "py-2")}>
          <ul>
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  aria-current={page.href === currentPage ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    navLink,
                    "block py-2",
                    page.href === currentPage && "underline decoration-2"
                  )}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Opening() {
  return (
    <section className="grid grid-cols-1 content-center md:min-h-svh md:grid-cols-12 md:items-center md:gap-x-6">
      <div className="md:col-span-7">
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          Lowlight Games · 5v5 arena
        </p>
        <h1 className="mt-2 text-h1 uppercase md:text-display">Ashfall</h1>
        <p className="mt-6 max-w-xl font-sans text-h2 font-normal">
          Two teams of five, one burning salt flat, first to four rounds.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "default" }),
              buttonClasses
            )}
          >
            Play free
          </a>
          <p className={cn(label, "text-muted-foreground tabular-nums")}>
            PC · Free to play · Season 4
          </p>
        </div>
      </div>
      <div className="mt-12 md:col-span-5 md:mt-0">
        <div
          role="img"
          aria-label="A watchtower on a salt flat at dusk, a square sun above it and a line of fire on the horizon"
          className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted"
        >
          <div className="absolute top-1/6 left-1/3 aspect-square w-1/3 bg-heat-high" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-heat-low" />
          <div className="absolute inset-x-0 bottom-1/3 h-2 bg-heat-mid" />
          <div className="absolute bottom-1/3 left-1/6 h-1/2 w-1/12 bg-foreground" />
        </div>
      </div>
    </section>
  )
}

function Classes() {
  return (
    <section className="mt-20">
      <h2 className="text-h2 uppercase md:text-h1">Four classes</h2>
      <p className="mt-3 max-w-xl">
        A team can take any mix of the four classes into a match, and every
        player can switch to another class between rounds.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {classes.map((item) => (
          <li
            key={item.name}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <article>
              <div
                role="img"
                aria-label={`Emblem of the ${item.name}`}
                className="flex aspect-video items-center justify-center border-b border-border bg-muted"
              >
                {item.emblem}
              </div>
              <div className="p-6">
                <p className={cn(label, "text-muted-foreground")}>
                  {item.role}
                </p>
                <h3 className="mt-2 text-h2">{item.name}</h3>
                <p className="mt-3">{item.text}</p>
                <p className={cn(label, "mt-3 text-muted-foreground")}>
                  Difficulty · {item.difficulty}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Season() {
  return (
    <section className="mt-20 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
      <div className="md:col-span-7">
        <p className={cn(label, "text-muted-foreground tabular-nums")}>
          Season 4 · <time dateTime="2026-10-06">6 Oct</time> –{" "}
          <time dateTime="2027-01-12">12 Jan 2027</time>
        </p>
        <h2 className="mt-2 text-h2 uppercase md:text-h1">Dry lightning</h2>
        <p className="mt-3 max-w-xl">
          Season 4 brought a new map, Glasswater Yard: an old salt works where
          storms roll in and cut the light mid-round. It also brought a 60-tier
          season pass, and every rank was reset to Cinder at the start.
        </p>
        <p className="mt-3 max-w-xl">
          Patch 4.2 added a third mode, Duel Pits: two against two in a small
          pit, for short games beside Ranked Clash and Quick Clash.
        </p>
        <a
          href="/leaderboard"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            buttonClasses,
            "mt-6"
          )}
        >
          See the ranking
        </a>
      </div>
      <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-4 md:col-start-9 md:mt-0 md:self-start">
        <p id="season-progress" className={cn(label, "text-muted-foreground")}>
          Season progress
        </p>
        <p className="mt-2">
          <span className="font-mono text-h1 tabular-nums">61</span>
          <span className={cn(label, "ml-2 text-muted-foreground")}>
            days left
          </span>
        </p>
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={98}
          aria-valuenow={37}
          aria-valuetext="37 of 98 days gone"
          aria-labelledby="season-progress"
          className="mt-6 h-3 w-full border border-border bg-muted"
        >
          <div className="h-full bg-heat-mid" style={{ width: "37.8%" }} />
        </div>
        <p className={cn(label, "mt-3 text-muted-foreground tabular-nums")}>
          37 of 98 days gone
        </p>
        <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
          Week 6 of 14
        </p>
      </div>
    </section>
  )
}

function News() {
  return (
    <section className="mt-20">
      <h2 className="text-h2 uppercase md:text-h1">Latest news</h2>
      <ul className="mt-6 border-b border-border">
        {news.map((item) => (
          <li key={item.date} className="border-t border-border py-6">
            <article className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
              <p
                className={cn(
                  label,
                  "text-muted-foreground tabular-nums md:col-span-2"
                )}
              >
                <time dateTime={item.date}>{item.dateLabel}</time>
              </p>
              <div className="mt-2 md:col-span-10 md:mt-0">
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="flex h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                  >
                    {item.badge}
                  </Badge>
                )}
                <h3
                  className={cn(
                    "text-h2",
                    item.badge && "mt-2",
                    item.hasNumber && "tabular-nums"
                  )}
                >
                  <a href={item.href} className={titleLink}>
                    {item.title}
                  </a>
                </h3>
                <p className="mt-3 max-w-xl">{item.text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Specs() {
  return (
    <section className="mt-20">
      <h2 className="text-h2 uppercase md:text-h1">System specs</h2>
      <p className="mt-3 max-w-xl">
        Ashfall runs on PC, and every match needs an internet connection.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <div className="min-w-0 md:col-span-8">
          <Table label="System requirements" className="min-w-xl text-body">
            <TableHeader>
              <TableRow>
                <TableHead
                  scope="col"
                  className={cn(cell, label, "text-muted-foreground")}
                >
                  Part
                </TableHead>
                <TableHead
                  scope="col"
                  className={cn(cell, label, "text-muted-foreground")}
                >
                  Minimum
                </TableHead>
                <TableHead
                  scope="col"
                  className={cn(cell, label, "text-muted-foreground")}
                >
                  Recommended
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((row) => (
                <TableRow key={row.part}>
                  <TableHead
                    scope="row"
                    className={cn(
                      cell,
                      "py-2 font-sans text-body font-normal text-foreground"
                    )}
                  >
                    {row.part}
                  </TableHead>
                  <TableCell className={cn(cell, "py-2 font-sans")}>
                    {row.min}
                  </TableCell>
                  <TableCell className={cn(cell, "py-2 font-sans")}>
                    {row.rec}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className={container}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2 uppercase">Ashfall</p>
            <p className="mt-2 text-body text-muted-foreground">
              A team arena game by Lowlight Games.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
            {pages.map((page) => (
              <li key={page.href}>
                <a href={page.href} className={cn(textLink, "text-body")}>
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className={cn(label, "mt-12 text-muted-foreground tabular-nums")}>
          © 2026 Lowlight Games
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />
      <main className={cn(container, "pt-12")}>
        <Opening />
        <Classes />
        <Season />
        <News />
        <Specs />
      </main>
      <Footer />
    </div>
  )
}

export default App
