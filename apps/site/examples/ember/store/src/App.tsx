import { useId, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONTAINER = "mx-auto max-w-[1280px] px-3 md:px-6"
const GRID = "grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label uppercase"
const BUTTON = "h-auto px-6 py-2 font-mono text-label uppercase"
const NAV_LINK = cn(
  LABEL,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  FOCUS
)
const TEXT_LINK = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)

const PAGES = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const CURRENT_PAGE = "/store"

type Shape = "skin" | "finish" | "emote" | "banner"

type Item = {
  id: string
  name: string
  kind: string
  price: number
  shape: Shape
  heat: string
  isNew?: boolean
}

const SHAPES: Record<Shape, string> = {
  skin: "h-1/2 w-1/3",
  finish: "h-2/3 w-1/12",
  banner: "h-2/3 w-1/4",
  emote: "aspect-square w-1/3",
}

const ITEMS: Item[] = [
  {
    id: "static-hood",
    name: "Static Hood",
    kind: "Skin · Flarecaster",
    price: 1400,
    shape: "skin",
    heat: "bg-heat-high",
    isNew: true,
  },
  {
    id: "saltpan-wraps",
    name: "Saltpan Wraps",
    kind: "Skin · Bulwark",
    price: 1200,
    shape: "skin",
    heat: "bg-heat-mid",
  },
  {
    id: "lantern-coat",
    name: "Lantern Coat",
    kind: "Skin · Mender",
    price: 1000,
    shape: "skin",
    heat: "bg-heat-mid",
  },
  {
    id: "glasswork-edge",
    name: "Glasswork Edge",
    kind: "Weapon finish · Cinderblade",
    price: 800,
    shape: "finish",
    heat: "bg-heat-high",
  },
  {
    id: "heatline-finish",
    name: "Heatline Finish",
    kind: "Weapon finish · Flarecaster",
    price: 700,
    shape: "finish",
    heat: "bg-heat-mid",
  },
  {
    id: "dust-devil",
    name: "Dust Devil",
    kind: "Emote",
    price: 500,
    shape: "emote",
    heat: "bg-heat-mid",
  },
  {
    id: "slow-clap",
    name: "Slow Clap",
    kind: "Emote",
    price: 400,
    shape: "emote",
    heat: "bg-heat-high",
  },
  {
    id: "ash-banner",
    name: "Ash Banner",
    kind: "Banner",
    price: 300,
    shape: "banner",
    heat: "bg-heat-high",
  },
]

const BUNDLE = {
  name: "Dry lightning bundle",
  price: 1800,
  parts: [
    { name: "Stormglass Armour", kind: "Bulwark skin", price: 1400 },
    { name: "Forked Blade", kind: "Cinderblade weapon finish", price: 900 },
    { name: "Thunderhead", kind: "Banner", price: 300 },
  ],
}
const BUNDLE_WORTH = BUNDLE.parts.reduce((sum, part) => sum + part.price, 0)

const START_BALANCE = 2350
const START_OWNED = ["lantern-coat"]

const figure = new Intl.NumberFormat("en-US")

function boughtLine(what: string, price: number, balance: number) {
  return `Bought ${what} for ${figure.format(price)} Flint. Your balance is ${figure.format(balance)} Flint.`
}

function neededLine(price: number, balance: number) {
  return `${figure.format(price - balance)} more Flint needed.`
}

export function App() {
  const [balance, setBalance] = useState(START_BALANCE)
  const [owned, setOwned] = useState<string[]>(START_OWNED)
  const [bundleOwned, setBundleOwned] = useState(false)
  const [status, setStatus] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const menuButton = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const balanceId = useId()
  const neededId = useId()

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  function buyItem(item: Item) {
    if (owned.includes(item.id) || item.price > balance) return
    const next = balance - item.price
    setBalance(next)
    setOwned([...owned, item.id])
    setStatus(boughtLine(item.name, item.price, next))
  }

  function buyBundle() {
    if (bundleOwned || BUNDLE.price > balance) return
    const next = balance - BUNDLE.price
    setBalance(next)
    setBundleOwned(true)
    setStatus(boughtLine(`the ${BUNDLE.name}`, BUNDLE.price, next))
  }

  const bundleShort = !bundleOwned && BUNDLE.price > balance
  const bundleNeededId = `${neededId}-bundle`

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border" onKeyDown={onHeaderKeyDown}>
        <div
          className={cn(CONTAINER, "flex items-center justify-between gap-6 py-3")}
        >
          <a
            href="/"
            className={cn(
              "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
              FOCUS
            )}
          >
            Ashfall
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={page.href === CURRENT_PAGE ? "page" : undefined}
                    className={cn(
                      NAV_LINK,
                      page.href === CURRENT_PAGE && "underline decoration-2"
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
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </Button>
        </div>
        <nav
          id={menuId}
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={cn(CONTAINER, "py-2")}>
            <ul>
              {PAGES.map((page) => (
                <li key={page.href}>
                  <a
                    href={page.href}
                    aria-current={page.href === CURRENT_PAGE ? "page" : undefined}
                    className={cn(
                      NAV_LINK,
                      "block py-2",
                      page.href === CURRENT_PAGE && "underline decoration-2"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className={cn(CONTAINER, "pt-12")}>
        <section className={GRID}>
          <div className="md:col-span-7">
            <p className={cn(LABEL, "text-muted-foreground")}>
              Item shop · Until{" "}
              <time dateTime="2026-11-19" className="tabular-nums">
                Thu 19 Nov
              </time>
            </p>
            <h1 className="mt-2 text-h1 uppercase md:text-display">Item shop</h1>
            <p className="mt-6 max-w-xl">
              The shop sells skins, weapon finishes, emotes and banners for
              Flint. Every item changes how your fighter looks and never how
              they play: no stats, no perks, no head start. The shelves turn
              over every Thursday, so what you see here is gone in a week.
            </p>
            <p className="mt-3 max-w-xl text-body text-muted-foreground">
              This is a demo shop: nothing is charged, and the Flint is not
              real.
            </p>
          </div>
          <div
            role="group"
            aria-labelledby={balanceId}
            className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start"
          >
            <p id={balanceId} className={cn(LABEL, "text-muted-foreground")}>
              Your balance
            </p>
            <p className="mt-2">
              <span className="font-mono text-h1 tabular-nums">
                {figure.format(balance)}
              </span>
              <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                Flint
              </span>
            </p>
            <p role="status" className="mt-3 text-body">
              {status}
            </p>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "outline" }), BUTTON, "mt-6")}
            >
              Get Flint
            </a>
          </div>
        </section>

        <section className={cn(GRID, "mt-20")}>
          <div className="md:col-span-7">
            <div
              role="img"
              aria-label="The three pieces of the Dry lightning bundle: a suit of armour, a blade and a banner"
              className="relative flex aspect-video w-full items-end justify-center gap-6 overflow-hidden rounded-xl border border-border bg-muted pb-12"
            >
              <div className="h-1/2 w-1/6 bg-heat-mid" />
              <div className="h-2/3 w-3 bg-heat-high" />
              <div className="h-1/3 w-1/6 bg-heat-high" />
            </div>
          </div>
          <div className="mt-6 md:col-span-5 md:mt-0">
            <p className={cn(LABEL, "text-muted-foreground")}>
              Featured bundle · <span className="tabular-nums">3</span> items
            </p>
            <h2 className="mt-2 text-h2 uppercase md:text-h1">
              Dry lightning bundle
            </h2>
            <p className="mt-3 max-w-xl">
              Armour of dark storm glass, a blade lit by forked light, and a
              banner that crackles when the round starts.
            </p>
            <ul className="mt-6 border-b border-border">
              {BUNDLE.parts.map((part) => (
                <li
                  key={part.name}
                  className="flex items-baseline justify-between gap-3 border-t border-border py-3"
                >
                  <span className="text-body">
                    {part.name} · {part.kind}
                  </span>
                  <span
                    className={cn(
                      LABEL,
                      "shrink-0 text-muted-foreground tabular-nums"
                    )}
                  >
                    {figure.format(part.price)} Flint
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <span className="font-mono text-h1 tabular-nums">
                {figure.format(BUNDLE.price)}
              </span>
              <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                Flint
              </span>
            </p>
            <p className={cn(LABEL, "mt-2 text-muted-foreground tabular-nums")}>
              Worth {figure.format(BUNDLE_WORTH)} Flint · Save{" "}
              {figure.format(BUNDLE_WORTH - BUNDLE.price)}
            </p>
            {bundleShort && (
              <p id={bundleNeededId} className="mt-2 text-body text-muted-foreground">
                {neededLine(BUNDLE.price, balance)}
              </p>
            )}
            <Button
              className={cn(BUTTON, "mt-6")}
              focusableWhenDisabled
              disabled={bundleOwned || bundleShort}
              aria-label={bundleOwned ? `${BUNDLE.name}, owned` : undefined}
              aria-describedby={bundleShort ? bundleNeededId : undefined}
              onClick={buyBundle}
            >
              {bundleOwned ? "Owned" : "Buy bundle"}
            </Button>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">This week</h2>
          <p className="mt-3 max-w-xl">
            Eight items are on the shelves until Thursday 19 November, most
            expensive first.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {ITEMS.map((item) => {
              const isOwned = owned.includes(item.id)
              const isShort = !isOwned && item.price > balance
              const itemNeededId = `${neededId}-${item.id}`
              return (
                <li
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                >
                  <article className="flex flex-1 flex-col">
                    <div
                      aria-hidden="true"
                      className="flex aspect-square items-center justify-center border-b border-border bg-muted"
                    >
                      <div className={cn(SHAPES[item.shape], item.heat)} />
                    </div>
                    <div className="flex flex-1 flex-col p-3 md:p-6">
                      {item.isNew && (
                        <Badge
                          variant="secondary"
                          className="flex h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase"
                        >
                          New
                        </Badge>
                      )}
                      <p
                        className={cn(
                          LABEL,
                          "text-muted-foreground",
                          item.isNew && "mt-2"
                        )}
                      >
                        {item.kind}
                      </p>
                      <h3 className="mt-2 text-body font-bold">{item.name}</h3>
                      <p className="mt-3">
                        <span className="font-mono text-h2 tabular-nums">
                          {figure.format(item.price)}
                        </span>
                        <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                          Flint
                        </span>
                      </p>
                      {isShort && (
                        <p
                          id={itemNeededId}
                          className="mt-2 text-body text-muted-foreground"
                        >
                          {neededLine(item.price, balance)}
                        </p>
                      )}
                      <div className="mt-auto pt-3">
                        <Button
                          variant="secondary"
                          className={cn(
                            BUTTON,
                            "w-full text-center whitespace-normal"
                          )}
                          focusableWhenDisabled
                          disabled={isOwned || isShort}
                          aria-label={
                            isOwned ? `${item.name}, owned` : `Buy ${item.name}`
                          }
                          aria-describedby={isShort ? itemNeededId : undefined}
                          onClick={() => buyItem(item)}
                        >
                          {isOwned ? "Owned" : "Buy"}
                        </Button>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <footer className="mt-20 border-t border-border py-12">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="md:col-span-6">
              <p className="font-heading text-h2 uppercase">Ashfall</p>
              <p className="mt-2 text-body text-muted-foreground">
                A team arena game by Lowlight Games.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className={cn(TEXT_LINK, "text-body")}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className={cn(LABEL, "mt-12 text-muted-foreground")}>
            © <span className="tabular-nums">2026</span> Lowlight Games
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
