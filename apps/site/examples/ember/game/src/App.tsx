import * as React from "react"

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
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const mutedLabel = cn(label, "text-muted-foreground")
const sectionHeading = "text-h2 md:text-h1 uppercase"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focus
)
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const currentLink = "underline decoration-2"

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentPage = "/"

const classes = [
  {
    name: "Bulwark",
    role: "Front line",
    difficulty: "Low",
    text: "Holds a lane behind a tower shield and takes the hits meant for the team. Plant the shield and nothing gets past until it breaks.",
    emblem: <div className="h-1/2 w-1/3 bg-heat-mid" />,
  },
  {
    name: "Cinderblade",
    role: "Close damage",
    difficulty: "High",
    text: "Dashes through the smoke and ends a fight in two cuts. Miss the second cut and there is no way back out.",
    emblem: <div className="h-2/3 w-1/12 bg-heat-high" />,
  },
  {
    name: "Flarecaster",
    role: "Ranged damage",
    difficulty: "Medium",
    text: "Lobs slow flares that burn a patch of ground for a few seconds. Good aim pushes a whole team off the point.",
    emblem: <div className="aspect-square h-1/3 bg-heat-high" />,
  },
  {
    name: "Mender",
    role: "Support",
    difficulty: "Medium",
    text: "Ties a line of light to one ally and heals them while it holds. Break the line to throw a short burst of speed instead.",
    emblem: (
      <div className="flex h-1/3 gap-3">
        <div className="aspect-square h-full bg-heat-mid" />
        <div className="aspect-square h-full bg-heat-high" />
      </div>
    ),
  },
]

const news = [
  {
    date: "Tue 10 Nov",
    dateTime: "2026-11-10",
    title: "Patch 4.2: Duel Pits and a round of balance",
    href: "/patch",
    text: "A new 2v2 mode opens in three small pits, and all four classes get changes.",
    badge: "New",
  },
  {
    date: "Thu 5 Nov",
    dateTime: "2026-11-05",
    title: "The Ashfall Open: qualifiers start in December",
    href: "#",
    text: "Any team of five in Blaze or above can sign up for the first open bracket.",
  },
  {
    date: "Tue 20 Oct",
    dateTime: "2026-10-20",
    title: "Patch 4.1: matchmaking for groups of five",
    href: "#",
    text: "Full groups now meet other full groups first, so a queue of five is a fairer fight.",
  },
  {
    date: "Tue 6 Oct",
    dateTime: "2026-10-06",
    title: "Season 4: Dry Lightning is live",
    href: "#",
    text: "Glasswater Yard joins the map pool, the season pass opens and every rank starts again.",
  },
]

const specs = [
  {
    part: "System",
    minimum: "64-bit Windows 10",
    recommended: "64-bit Windows 11",
  },
  {
    part: "Processor",
    minimum: "4 cores at 3.0 GHz",
    recommended: "6 cores at 3.6 GHz",
  },
  { part: "Memory", minimum: "8 GB", recommended: "16 GB" },
  {
    part: "Graphics",
    minimum: "4 GB of video memory, DirectX 12",
    recommended: "8 GB of video memory, DirectX 12",
  },
  { part: "Storage", minimum: "35 GB", recommended: "35 GB on an SSD" },
  { part: "Network", minimum: "Broadband", recommended: "Broadband" },
]

const cell = "px-3 first:pl-0 last:pr-0"
const columnHead = cn(cell, mutedLabel)
const rowHead = cn(cell, "py-2 font-sans text-body font-normal text-foreground")
const bodyCell = cn(cell, "py-2 font-sans")

function Header() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(container, "flex items-center justify-between gap-6 py-3")}
      >
        <a href="/" className={cn("font-heading text-h2 uppercase", titleLink)}>
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
                    page.href === currentPage && currentLink
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
          className={cn(buttonClasses, "md:hidden")}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(!open)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="menu"
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
                  className={cn(
                    navLink,
                    "block py-2",
                    page.href === currentPage && currentLink
                  )}
                  onClick={() => setOpen(false)}
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
    <section className={cn(grid, "content-center md:min-h-svh md:items-center")}>
      <div className="md:col-span-7">
        <p className={mutedLabel}>Lowlight Games · 5v5 arena</p>
        <h1 className="mt-2 text-h1 uppercase md:text-display">Ashfall</h1>
        <p className="mt-6 max-w-xl font-sans text-h2 font-normal">
          Two teams of five, one burning salt flat, first to four rounds.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <a
            href="#"
            className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
          >
            Play free
          </a>
          <p className={mutedLabel}>PC · Free to play · Season 4</p>
        </div>
      </div>
      <div className="mt-12 md:col-span-5 md:col-start-8 md:mt-0">
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
      <h2 className={sectionHeading}>Four classes</h2>
      <p className="mt-3 max-w-xl">
        Every match lets a team take any mix of the four, and a player can
        switch class between rounds.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {classes.map((item) => (
          <li
            key={item.name}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
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
                <p className={mutedLabel}>{item.role}</p>
                <h3 className="mt-2 text-h2">{item.name}</h3>
                <p className="mt-3">{item.text}</p>
                <p className={cn(mutedLabel, "mt-3")}>
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
    <section className={cn(grid, "mt-20")}>
      <div className="md:col-span-7">
        <p className={cn(mutedLabel, "tabular-nums")}>
          Season 4 · <time dateTime="2026-10-06">6 Oct</time> –{" "}
          <time dateTime="2027-01-12">12 Jan 2027</time>
        </p>
        <h2 className={cn(sectionHeading, "mt-2")}>Dry lightning</h2>
        <p className="mt-3 max-w-xl">
          Season 4 brought the map Glasswater Yard, a salt works where storms
          cut the light for a few seconds at a time. It also opened a season
          pass of 60 tiers, and every rank was reset to Cinder at the start.
        </p>
        <p className="mt-3 max-w-xl">
          Patch 4.2 added Duel Pits, a 2v2 mode played in three small pits
          beside the main flat.
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
        <p id="season-progress" className={mutedLabel}>
          Season progress
        </p>
        <p className="mt-2 font-mono text-h1 tabular-nums">
          61
          <span className={cn(mutedLabel, "ml-2")}>days left</span>
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
        <p className={cn(mutedLabel, "mt-3 tabular-nums")}>
          37 of 98 days gone · Week 6 of 14
        </p>
      </div>
    </section>
  )
}

function News() {
  return (
    <section className="mt-20">
      <h2 className={sectionHeading}>Latest news</h2>
      <ul className="mt-6 border-b border-border">
        {news.map((item) => (
          <li key={item.title} className="border-t border-border py-6">
            <article className={grid}>
              <p className={cn(mutedLabel, "tabular-nums md:col-span-2")}>
                <time dateTime={item.dateTime}>{item.date}</time>
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
                <h3 className={cn("text-h2", item.badge && "mt-2")}>
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
      <h2 className={sectionHeading}>System specs</h2>
      <p className="mt-3 max-w-xl">
        Ashfall runs on PC and needs a connection for every match.
      </p>
      <div className={cn(grid, "mt-6")}>
        <div className="min-w-0 md:col-span-8">
          <Table label="System requirements" className="min-w-xl text-body">
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className={columnHead}>
                  Part
                </TableHead>
                <TableHead scope="col" className={columnHead}>
                  Minimum
                </TableHead>
                <TableHead scope="col" className={columnHead}>
                  Recommended
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((row) => (
                <TableRow key={row.part}>
                  <TableHead scope="row" className={rowHead}>
                    {row.part}
                  </TableHead>
                  <TableCell className={bodyCell}>{row.minimum}</TableCell>
                  <TableCell className={bodyCell}>{row.recommended}</TableCell>
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
        <div className={grid}>
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
        <p className={cn(mutedLabel, "mt-12 tabular-nums")}>
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
