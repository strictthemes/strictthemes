import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CONTAINER = "mx-auto max-w-[1280px] px-3 md:px-6"
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

const LINKS = [
  { label: "Game", href: "/" },
  { label: "Patch notes", href: "/patch" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Store", href: "/store" },
  { label: "Profile", href: "/player" },
]
const CURRENT = "/store"

const START_BALANCE = 2350
const BUNDLE_PRICE = 1800
const BUNDLE_NAME = "Dry lightning bundle"

type Kind = "skin" | "weapon" | "emote" | "banner"
type Heat = "mid" | "high"

type Item = {
  id: string
  name: string
  kind: Kind
  kindLabel: string
  price: number
  heat: Heat
  isNew?: boolean
}

const ITEMS: Item[] = [
  {
    id: "static-hood",
    name: "Static Hood",
    kind: "skin",
    kindLabel: "Skin · Flarecaster",
    price: 1400,
    heat: "high",
    isNew: true,
  },
  {
    id: "saltpan-wraps",
    name: "Saltpan Wraps",
    kind: "skin",
    kindLabel: "Skin · Bulwark",
    price: 1200,
    heat: "mid",
  },
  {
    id: "lantern-coat",
    name: "Lantern Coat",
    kind: "skin",
    kindLabel: "Skin · Mender",
    price: 1000,
    heat: "mid",
  },
  {
    id: "glasswork-edge",
    name: "Glasswork Edge",
    kind: "weapon",
    kindLabel: "Weapon finish · Cinderblade",
    price: 800,
    heat: "high",
  },
  {
    id: "heatline-finish",
    name: "Heatline Finish",
    kind: "weapon",
    kindLabel: "Weapon finish · Flarecaster",
    price: 700,
    heat: "mid",
  },
  {
    id: "dust-devil",
    name: "Dust Devil",
    kind: "emote",
    kindLabel: "Emote",
    price: 500,
    heat: "mid",
  },
  {
    id: "slow-clap",
    name: "Slow Clap",
    kind: "emote",
    kindLabel: "Emote",
    price: 400,
    heat: "high",
  },
  {
    id: "ash-banner",
    name: "Ash Banner",
    kind: "banner",
    kindLabel: "Banner",
    price: 300,
    heat: "high",
  },
]

const BUNDLE_PIECES = [
  { name: "Stormglass Armour · Bulwark skin", price: 1400 },
  { name: "Forked Blade · Cinderblade weapon finish", price: 900 },
  { name: "Thunderhead · Banner", price: 300 },
]

const SHAPE: Record<Kind, string> = {
  skin: "h-1/2 w-1/3",
  weapon: "h-2/3 w-1/12",
  banner: "h-2/3 w-1/4",
  emote: "aspect-square w-1/3",
}

const HEAT: Record<Heat, string> = {
  mid: "bg-heat-mid",
  high: "bg-heat-high",
}

function flint(n: number) {
  return n.toLocaleString("en-US")
}

function SiteHeader() {
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
          CONTAINER,
          "flex items-center justify-between gap-6 py-3"
        )}
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
            {LINKS.map((link) => {
              const current = link.href === CURRENT
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(NAV_LINK, current && "underline decoration-2")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn(BUTTON, "md:hidden")}
          aria-expanded={open}
          aria-controls="menu-small"
          onClick={() => setOpen((value) => !value)}
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
        <div className={cn(CONTAINER, "py-2")}>
          <ul>
            {LINKS.map((link) => {
              const current = link.href === CURRENT
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      NAV_LINK,
                      "block py-2",
                      current && "underline decoration-2"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2 uppercase">Ashfall</p>
            <p className="mt-2 text-body text-muted-foreground">
              A team arena game by Lowlight Games.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={TEXT_LINK}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p
          className={cn(LABEL, "mt-12 text-muted-foreground tabular-nums")}
        >
          © 2026 Lowlight Games
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [balance, setBalance] = useState(START_BALANCE)
  const [owned, setOwned] = useState<Set<string>>(
    () => new Set(["lantern-coat"])
  )
  const [bundleOwned, setBundleOwned] = useState(false)
  const [status, setStatus] = useState("")

  function buyItem(item: Item) {
    if (owned.has(item.id) || item.price > balance) return
    const next = balance - item.price
    setBalance(next)
    setOwned((current) => new Set(current).add(item.id))
    setStatus(
      `Bought ${item.name} for ${flint(item.price)} Flint. Your balance is ${flint(next)} Flint.`
    )
  }

  function buyBundle() {
    if (bundleOwned || BUNDLE_PRICE > balance) return
    const next = balance - BUNDLE_PRICE
    setBalance(next)
    setBundleOwned(true)
    setStatus(
      `Bought the ${BUNDLE_NAME} for ${flint(BUNDLE_PRICE)} Flint. Your balance is ${flint(next)} Flint.`
    )
  }

  const bundleShort = !bundleOwned && BUNDLE_PRICE > balance

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <SiteHeader />

      <main className={cn(CONTAINER, "pt-12")}>
        {/* Page head */}
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(LABEL, "text-muted-foreground tabular-nums")}>
              Item shop · Until <time dateTime="2026-11-19">Thu 19 Nov</time>
            </p>
            <h1 className="mt-2 text-h1 uppercase md:text-display">
              Item shop
            </h1>
            <p className="mt-6 max-w-xl">
              Skins, weapon finishes, emotes and banners for your Ashfall
              heroes. Every item changes how you look and never how you play:
              no item touches a stat. The shop turns over every Thursday, so
              what you see here is gone next week.
            </p>
            <p className="mt-3 max-w-xl text-body text-muted-foreground">
              This is a demo shop: nothing is charged, and the Flint is not
              real.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start">
            <p
              id="balance-label"
              className={cn(LABEL, "text-muted-foreground")}
            >
              Your balance
            </p>
            <p className="mt-2" aria-describedby="balance-label">
              <span className="font-mono text-h1 tabular-nums">
                {flint(balance)}
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

        {/* Featured bundle */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div
            role="img"
            aria-label="The three pieces of the Dry lightning bundle: a suit of armour, a blade and a banner"
            className="relative flex aspect-video w-full items-end justify-center gap-6 overflow-hidden rounded-xl border border-border bg-muted pb-12 md:col-span-7"
          >
            <div className="h-1/2 w-1/6 bg-heat-mid" />
            <div className="h-2/3 w-3 bg-heat-high" />
            <div className="h-1/3 w-1/6 bg-heat-high" />
          </div>

          <div className="mt-6 md:col-span-5 md:mt-0">
            <p className={cn(LABEL, "text-muted-foreground tabular-nums")}>
              Featured bundle · 3 items
            </p>
            <h2 className="mt-2 text-h2 uppercase md:text-h1">
              Dry lightning bundle
            </h2>
            <p className="mt-3 max-w-xl">
              Armour of cracked storm glass, a blade with forked light running
              down its edge, and a banner that crackles as each round starts.
            </p>
            <ul className="mt-6 border-b border-border">
              {BUNDLE_PIECES.map((piece) => (
                <li
                  key={piece.name}
                  className="flex items-baseline justify-between gap-3 border-t border-border py-3"
                >
                  <span className="min-w-0 text-body">{piece.name}</span>
                  <span
                    className={cn(
                      LABEL,
                      "shrink-0 text-muted-foreground tabular-nums"
                    )}
                  >
                    {flint(piece.price)} Flint
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <span className="font-mono text-h1 tabular-nums">
                {flint(BUNDLE_PRICE)}
              </span>
              <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                Flint
              </span>
            </p>
            <p
              className={cn(LABEL, "mt-2 text-muted-foreground tabular-nums")}
            >
              Worth 2,600 Flint · Save 800
            </p>
            {bundleShort && (
              <p
                id="bundle-need"
                className="mt-2 text-body text-muted-foreground"
              >
                {flint(BUNDLE_PRICE - balance)} more Flint needed.
              </p>
            )}
            <Button
              className={cn(BUTTON, "mt-6")}
              focusableWhenDisabled
              disabled={bundleOwned || bundleShort}
              aria-describedby={bundleShort ? "bundle-need" : undefined}
              aria-label={bundleOwned ? `${BUNDLE_NAME}, owned` : undefined}
              onClick={buyBundle}
            >
              {bundleOwned ? "Owned" : "Buy bundle"}
            </Button>
          </div>
        </section>

        {/* This week's items */}
        <section className="mt-20">
          <h2 className="text-h2 uppercase md:text-h1">This week</h2>
          <p className="mt-3 max-w-xl">
            Eight items are in the shop until Thursday 19 November, shown
            most expensive first.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {ITEMS.map((item) => {
              const isOwned = owned.has(item.id)
              const short = !isOwned && item.price > balance
              const needId = `${item.id}-need`
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
                      <div className={cn(SHAPE[item.kind], HEAT[item.heat])} />
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
                        {item.kindLabel}
                      </p>
                      <h3 className="mt-2 text-body font-bold">{item.name}</h3>
                      <p className="mt-3">
                        <span className="font-mono text-h2 tabular-nums">
                          {flint(item.price)}
                        </span>
                        <wbr />
                        <span className={cn(LABEL, "ml-2 text-muted-foreground")}>
                          Flint
                        </span>
                      </p>
                      {short && (
                        <p
                          id={needId}
                          className="mt-2 text-body text-muted-foreground"
                        >
                          {flint(item.price - balance)} more Flint needed.
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
                          disabled={isOwned || short}
                          aria-label={
                            isOwned ? `${item.name}, owned` : `Buy ${item.name}`
                          }
                          aria-describedby={short ? needId : undefined}
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

      <SiteFooter />
    </div>
  )
}

export default App
