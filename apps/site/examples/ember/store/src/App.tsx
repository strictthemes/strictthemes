import { useRef, useState, type KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const buttonClasses = "h-auto px-6 py-2 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"

const navLinks = [
  { name: "Game", href: "/" },
  { name: "Patch notes", href: "/patch" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Store", href: "/store" },
  { name: "Profile", href: "/player" },
]
const currentHref = "/store"

type Kind = "skin" | "weapon" | "emote" | "banner"

type Item = {
  id: string
  name: string
  kind: Kind
  kindLabel: string
  price: number
  heat: "bg-heat-low" | "bg-heat-mid" | "bg-heat-high"
  isNew?: boolean
}

const items: Item[] = [
  {
    id: "static-hood",
    name: "Static Hood",
    kind: "skin",
    kindLabel: "Skin · Flarecaster",
    price: 1400,
    heat: "bg-heat-high",
    isNew: true,
  },
  {
    id: "saltpan-wraps",
    name: "Saltpan Wraps",
    kind: "skin",
    kindLabel: "Skin · Bulwark",
    price: 1200,
    heat: "bg-heat-mid",
  },
  {
    id: "lantern-coat",
    name: "Lantern Coat",
    kind: "skin",
    kindLabel: "Skin · Mender",
    price: 1000,
    heat: "bg-heat-mid",
  },
  {
    id: "glasswork-edge",
    name: "Glasswork Edge",
    kind: "weapon",
    kindLabel: "Weapon finish · Cinderblade",
    price: 800,
    heat: "bg-heat-high",
  },
  {
    id: "heatline-finish",
    name: "Heatline Finish",
    kind: "weapon",
    kindLabel: "Weapon finish · Flarecaster",
    price: 700,
    heat: "bg-heat-mid",
  },
  {
    id: "dust-devil",
    name: "Dust Devil",
    kind: "emote",
    kindLabel: "Emote",
    price: 500,
    heat: "bg-heat-mid",
  },
  {
    id: "slow-clap",
    name: "Slow Clap",
    kind: "emote",
    kindLabel: "Emote",
    price: 400,
    heat: "bg-heat-high",
  },
  {
    id: "ash-banner",
    name: "Ash Banner",
    kind: "banner",
    kindLabel: "Banner",
    price: 300,
    heat: "bg-heat-high",
  },
]

const shapeByKind: Record<Kind, string> = {
  skin: "h-1/2 w-1/3",
  weapon: "h-2/3 w-1/12",
  banner: "h-2/3 w-1/4",
  emote: "aspect-square w-1/3",
}

const bundle = {
  name: "Dry lightning bundle",
  price: 1800,
  worth: 2600,
  pieces: [
    { name: "Stormglass Armour", kind: "Bulwark skin", price: 1400 },
    { name: "Forked Blade", kind: "Cinderblade weapon finish", price: 900 },
    { name: "Thunderhead", kind: "Banner", price: 300 },
  ],
}

const fmt = (n: number) => n.toLocaleString("en-US")

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (open && e.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-3 py-3 md:px-6">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground uppercase decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
            focusRing
          )}
        >
          Ashfall
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  className={cn(
                    label,
                    "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                    link.href === currentHref && "underline decoration-2",
                    focusRing
                  )}
                >
                  {link.name}
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
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === currentHref ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    label,
                    "block py-2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                    link.href === currentHref && "underline decoration-2",
                    focusRing
                  )}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-3 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2 uppercase">Ashfall</p>
            <p className="mt-2 text-body text-muted-foreground">
              A team arena game by Lowlight Games.
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:col-span-6 md:mt-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "text-body text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-2",
                    focusRing
                  )}
                >
                  {link.name}
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
  )
}

export function App() {
  const [balance, setBalance] = useState(2350)
  const [owned, setOwned] = useState<Set<string>>(
    () => new Set(["lantern-coat"])
  )
  const [bundleOwned, setBundleOwned] = useState(false)
  const [status, setStatus] = useState("")

  function buyItem(item: Item) {
    if (owned.has(item.id) || item.price > balance) return
    const next = balance - item.price
    setBalance(next)
    setOwned((prev) => new Set(prev).add(item.id))
    setStatus(
      `Bought ${item.name} for ${fmt(item.price)} Flint. Your balance is ${fmt(next)} Flint.`
    )
  }

  function buyBundle() {
    if (bundleOwned || bundle.price > balance) return
    const next = balance - bundle.price
    setBalance(next)
    setBundleOwned(true)
    setStatus(
      `Bought the ${bundle.name} for ${fmt(bundle.price)} Flint. Your balance is ${fmt(next)} Flint.`
    )
  }

  const bundleShort = !bundleOwned && bundle.price > balance

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <Header />

      <main className="mx-auto max-w-[1280px] px-3 pt-12 md:px-6">
        {/* Page head */}
        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>
              Item shop · Until{" "}
              <time dateTime="2026-11-19" className="tabular-nums">
                Thu 19 Nov
              </time>
            </p>
            <h1 className="mt-2 text-h1 uppercase md:text-display">
              Item shop
            </h1>
            <p className="mt-6 max-w-xl">
              Skins for your heroes, finishes for their weapons, emotes and
              banners, all paid for in Flint. Every item changes how you look in
              the arena and never how you play: no stats, no edge. The shop
              turns over every Thursday, so what you see here is gone next week.
            </p>
            <p className="mt-3 text-body text-muted-foreground">
              This is a demo shop: nothing is charged, and the Flint is not
              real.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border bg-card p-6 md:col-span-5 md:mt-0 md:self-start">
            <p
              id="balance-label"
              className={cn(label, "text-muted-foreground")}
            >
              Your balance
            </p>
            <p className="mt-2">
              <span className="font-mono text-h1 tabular-nums">
                {fmt(balance)}
              </span>
              <span className={cn(label, "ml-2 text-muted-foreground")}>
                Flint
              </span>
            </p>
            <p role="status" className="mt-3 text-body">
              {status}
            </p>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClasses,
                "mt-6"
              )}
            >
              Get Flint
            </a>
          </div>
        </section>

        {/* Featured bundle */}
        <section
          aria-labelledby="bundle-heading"
          className="mt-20 grid grid-cols-1 md:grid-cols-12 md:gap-x-6"
        >
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
            <p className={cn(label, "text-muted-foreground")}>
              Featured bundle · 3 items
            </p>
            <h2
              id="bundle-heading"
              className="mt-2 text-h2 uppercase md:text-h1"
            >
              Dry lightning bundle
            </h2>
            <p className="mt-3 max-w-xl">
              Armour cut from storm glass, a blade that splits light into forks,
              and a banner that crackles as each round begins.
            </p>
            <ul className="mt-6 border-b border-border">
              {bundle.pieces.map((piece) => (
                <li
                  key={piece.name}
                  className="flex items-baseline justify-between gap-3 border-t border-border py-3"
                >
                  <span className="text-body">
                    {piece.name} · {piece.kind}
                  </span>
                  <span
                    className={cn(
                      label,
                      "shrink-0 text-muted-foreground tabular-nums"
                    )}
                  >
                    {fmt(piece.price)} Flint
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <span className="font-mono text-h1 tabular-nums">
                {fmt(bundle.price)}
              </span>
              <span className={cn(label, "ml-2 text-muted-foreground")}>
                Flint
              </span>
            </p>
            <p className={cn(label, "mt-2 text-muted-foreground tabular-nums")}>
              Worth {fmt(bundle.worth)} Flint · Save{" "}
              {fmt(bundle.worth - bundle.price)}
            </p>
            {bundleShort && (
              <p
                id="bundle-short"
                className="mt-2 text-body text-muted-foreground"
              >
                {fmt(bundle.price - balance)} more Flint needed.
              </p>
            )}
            <Button
              className={cn(buttonClasses, "mt-6")}
              focusableWhenDisabled
              disabled={bundleOwned || bundleShort}
              aria-describedby={bundleShort ? "bundle-short" : undefined}
              onClick={buyBundle}
            >
              {bundleOwned ? "Owned" : "Buy bundle"}
            </Button>
          </div>
        </section>

        {/* This week's items */}
        <section aria-labelledby="week-heading" className="mt-20">
          <h2 id="week-heading" className="text-h2 uppercase md:text-h1">
            This week
          </h2>
          <p className="mt-3 max-w-xl">
            Eight items, on sale until Thursday 19 November, most expensive
            first.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((item) => {
              const isOwned = owned.has(item.id)
              const short = !isOwned && item.price > balance
              const shortId = `${item.id}-short`
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
                      <div className={cn(shapeByKind[item.kind], item.heat)} />
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
                          label,
                          "text-muted-foreground",
                          item.isNew && "mt-2"
                        )}
                      >
                        {item.kindLabel}
                      </p>
                      <h3 className="mt-2 text-body font-bold">{item.name}</h3>
                      <p className="mt-3">
                        <span className="font-mono text-h2 tabular-nums">
                          {fmt(item.price)}
                        </span>
                        <span
                          className={cn(
                            label,
                            "ml-2 inline-block text-muted-foreground"
                          )}
                        >
                          Flint
                        </span>
                      </p>
                      {short && (
                        <p
                          id={shortId}
                          className="mt-2 text-body text-muted-foreground"
                        >
                          {fmt(item.price - balance)} more Flint needed.
                        </p>
                      )}
                      <div className="mt-auto pt-3">
                        <Button
                          variant="secondary"
                          className={cn(
                            buttonClasses,
                            "w-full text-center whitespace-normal"
                          )}
                          focusableWhenDisabled
                          disabled={isOwned || short}
                          aria-label={
                            isOwned ? `${item.name}, owned` : `Buy ${item.name}`
                          }
                          aria-describedby={short ? shortId : undefined}
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

      <Footer />
    </div>
  )
}

export default App
