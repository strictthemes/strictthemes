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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto max-w-[1280px] px-3 md:px-6"

const label = "font-mono text-label uppercase"

const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"

const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  focusRing
)

const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
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

const classes = [
  {
    name: "Bulwark",
    role: "Front line",
    difficulty: "Low",
    text: "Carries a wide salt-iron shield that stops shots for anyone standing behind it. Holds a point while the rest of the team pushes past.",
    emblem: <div className="h-1/2 w-1/3 bg-heat-mid" />,
  },
  {
    name: "Cinderblade",
    role: "Close damage",
    difficulty: "High",
    text: "Dashes in, strikes twice and is gone before the other team turns. Hits the hardest of the four, but falls fast when caught alone.",
    emblem: <div className="h-2/3 w-1/12 bg-heat-high" />,
  },
  {
    name: "Flarecaster",
    role: "Ranged damage",
    difficulty: "Medium",
    text: "Throws flares that burn a patch of ground for a few seconds. Fights best from high ground, two steps behind the front line.",
    emblem: <div className="aspect-square h-1/3 bg-heat-high" />,
  },
  {
    name: "Mender",
    role: "Support",
    difficulty: "Medium",
    text: "Keeps two lights that heal the teammates nearest to them. Can lift one fallen player back to their feet once a round.",
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
    date: "2026-11-10",
    dateLabel: "Tue 10 Nov",
    title: "Patch 4.2: Duel Pits and a round of balance",
    href: "/patch",
    badge: "New",
    text: "Duel Pits opens as a 2v2 mode, and the Cinderblade dash now takes a little longer to come back.",
  },
  {
    date: "2026-11-05",
    dateLabel: "Thu 5 Nov",
    title: "The Ashfall Open: qualifiers start in December",
    href: "#",
    text: "Teams of five can sign up now for the online qualifiers, which run every weekend in December.",
  },
  {
    date: "2026-10-20",
    dateLabel: "Tue 20 Oct",
    title: "Patch 4.1: matchmaking for groups of five",
    href: "#",
    text: "Full groups of five now queue against other full groups, so a solo player meets far fewer stacked teams.",
  },
  {
    date: "2026-10-06",
    dateLabel: "Tue 6 Oct",
    title: "Season 4: Dry Lightning is live",
    href: "#",
    text: "The new season brings the map Glasswater Yard, a 60-tier pass and a fresh start at Cinder for every rank.",
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

function Header() {
  const [open, setOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div
        className={cn(
          container,
          "flex items-center justify-between gap-6 py-3"
        )}
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
          ref={menuButtonRef}
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
                    "block py-2",
                    navLink,
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
          <a href="#" className={cn(buttonVariants(), buttonClasses)}>
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
          Season 4 brought Glasswater Yard, a salt works where dry storms cut
          the light in and out in the middle of a round. It also brought a
          60-tier season pass, and every rank went back to Cinder on its first
          day.
        </p>
        <p className="mt-3 max-w-xl">
          Patch 4.2 added Duel Pits, a 2v2 mode for two friends who want short,
          sharp rounds between Ranked Clash matches.
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
        <p className="mt-2 font-mono text-h1 tabular-nums">
          61
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
  const cell = "px-3 first:pl-0 last:pr-0"
  return (
    <section className="mt-20">
      <h2 className="text-h2 uppercase md:text-h1">System specs</h2>
      <p className="mt-3 max-w-xl">
        Ashfall runs on PC and needs an internet connection for every match.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
        <div className="min-w-0 md:col-span-8">
          <Table label="System requirements" className="min-w-xl text-body">
            <TableHeader>
              <TableRow>
                {["Part", "Minimum", "Recommended"].map((heading) => (
                  <TableHead
                    key={heading}
                    scope="col"
                    className={cn(cell, label, "text-muted-foreground")}
                  >
                    {heading}
                  </TableHead>
                ))}
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
                    {row.minimum}
                  </TableCell>
                  <TableCell className={cn(cell, "py-2 font-sans")}>
                    {row.recommended}
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
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {pages.map((page) => (
              <li key={page.href}>
                <a href={page.href} className={textLink}>
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
