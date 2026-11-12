import { useRef, useState, type KeyboardEvent } from "react"

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
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2 ${focusRing}`
const titleLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const navLink = `${label} text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`
const sectionHeading = "text-h2 uppercase md:text-h1"

const pages = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentHref = "/"

const classes = [
  {
    name: "Bulwark",
    role: "Front line",
    difficulty: "Low",
    text: "Bulwark carries a tower shield that soaks the first wave of fire and holds a lane for the team behind it. Plant the shield on a ridge of salt and the other side has to come through you.",
    emblem: <div className="h-1/2 w-1/3 bg-heat-mid" />,
  },
  {
    name: "Cinderblade",
    role: "Close damage",
    difficulty: "High",
    text: "Cinderblade dashes in, cuts once, and has to be gone before the reply lands. Each kill refunds the dash, so a good round is a chain and a bad one ends in two seconds.",
    emblem: <div className="h-2/3 w-1/12 bg-heat-high" />,
  },
  {
    name: "Flarecaster",
    role: "Ranged damage",
    difficulty: "Medium",
    text: "Flarecaster lobs flares that burn the ground they land on and light up anyone standing in the smoke. Keep your distance, call targets, and herd the other team where you want them.",
    emblem: <div className="aspect-square h-1/3 bg-heat-high" />,
  },
  {
    name: "Mender",
    role: "Support",
    difficulty: "Medium",
    text: "Mender ties two lights to teammates and heals whoever stands between them. Placing the pair well wins fights; letting one of them fall loses the round.",
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
    shown: "Tue 10 Nov",
    title: "Patch 4.2: Duel Pits and a round of balance",
    href: "/patch",
    text: "Duel Pits brings 2v2 fights to three small arenas, and Cinderblade’s dash now costs a little more after a missed cut.",
    isNew: true,
  },
  {
    date: "2026-11-05",
    shown: "Thu 5 Nov",
    title: "The Ashfall Open: qualifiers start in December",
    href: "#",
    text: "Teams of five can sign up for the open qualifiers now; the best sixteen meet on the Glasswater Yard stage in February.",
    isNew: false,
  },
  {
    date: "2026-10-20",
    shown: "Tue 20 Oct",
    title: "Patch 4.1: matchmaking for groups of five",
    href: "#",
    text: "A full group of five now only meets other full groups in Ranked Clash, so solo players stop running into practised teams.",
    isNew: false,
  },
  {
    date: "2026-10-06",
    shown: "Tue 6 Oct",
    title: "Season 4: Dry Lightning is live",
    href: "#",
    text: "The new season opens with a new map, a 60-tier season pass and a fresh climb from Cinder for everyone.",
    isNew: false,
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

const cellEdges = "px-3 first:pl-0 last:pr-0"

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div
          className={cn(
            container,
            "flex items-center justify-between gap-6 py-3"
          )}
        >
          <a
            href="/"
            className={cn("font-heading text-h2 uppercase", titleLink)}
          >
            Ashfall
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={
                      page.href === currentHref ? "page" : undefined
                    }
                    className={cn(
                      navLink,
                      page.href === currentHref && "underline decoration-2"
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
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses, "md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(container, "py-2")}>
            <ul>
              {pages.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={
                      page.href === currentHref ? "page" : undefined
                    }
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      navLink,
                      "block py-2",
                      page.href === currentHref && "underline decoration-2"
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

      <main className={cn(container, "pt-12")}>
        {/* 2. Opening */}
        <section className="grid grid-cols-1 content-center md:min-h-svh md:grid-cols-12 md:items-center md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>
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
              <p className={cn(label, "text-muted-foreground")}>
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

        {/* 3. Classes */}
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

        {/* 4. Current season */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground tabular-nums")}>
              Season 4 · <time dateTime="2026-10-06">6 Oct</time> –{" "}
              <time dateTime="2027-01-12">12 Jan 2027</time>
            </p>
            <h2 className={cn("mt-2", sectionHeading)}>Dry lightning</h2>
            <p className="mt-3 max-w-xl">
              Season 4 brought Glasswater Yard, an abandoned salt works where
              summer storms cut the light to a few flashes at a time, and a
              60-tier season pass. Every rank reset to Cinder on the first day,
              so the whole field is climbing again.
            </p>
            <p className="mt-3 max-w-xl">
              Patch 4.2 added Duel Pits, a 2v2 mode on three small arenas, for
              when you want a quick fight with one friend.
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
            <p
              id="season-progress"
              className={cn(label, "text-muted-foreground")}
            >
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
              37 of 98 days gone · Week 6 of 14
            </p>
          </div>
        </section>

        {/* 5. Latest news */}
        <section className="mt-20">
          <h2 className={sectionHeading}>Latest news</h2>
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
                    <time dateTime={item.date}>{item.shown}</time>
                  </p>
                  <div className="mt-2 md:col-span-10 md:mt-0">
                    {item.isNew && (
                      <Badge
                        variant="secondary"
                        className="flex h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                      >
                        New
                      </Badge>
                    )}
                    <h3 className={cn("text-h2", item.isNew && "mt-2")}>
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

        {/* 6. System requirements */}
        <section className="mt-20">
          <h2 className={sectionHeading}>System specs</h2>
          <p className="mt-3 max-w-xl">
            Ashfall runs on PC and needs an internet connection for every match,
            including practice against bots.
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
                        className={cn(
                          label,
                          "text-muted-foreground",
                          cellEdges
                        )}
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
                          "py-2 font-sans text-body font-normal text-foreground",
                          cellEdges
                        )}
                      >
                        {row.part}
                      </TableHead>
                      <TableCell className={cn("py-2 font-sans", cellEdges)}>
                        {row.minimum}
                      </TableCell>
                      <TableCell className={cn("py-2 font-sans", cellEdges)}>
                        {row.recommended}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </main>

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
                  <a href={page.href} className={cn("text-body", textLink)}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(label, "mt-12 text-muted-foreground")}>
            © 2026 Lowlight Games
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
