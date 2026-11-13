import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const BASE_CUPS = 4
const MIN_CUPS = 1
const MAX_CUPS = 12

type Kind = "grams" | "millilitres" | "count" | "spoon"

type Ingredient = {
  name: string
  aside?: string
  amount: number
  kind: Kind
  unit?: string
}

const ingredients: Ingredient[] = [
  { name: "Ripe pears", amount: 2, kind: "count" },
  { name: "Fresh ginger", amount: 30, kind: "grams" },
  { name: "Dried lemon verbena", amount: 6, kind: "grams" },
  { name: "Water", amount: 1000, kind: "millilitres" },
  {
    name: "Honey",
    aside: "or maple syrup, to keep it vegan",
    amount: 2,
    kind: "spoon",
    unit: "tbsp",
  },
  { name: "Cinnamon stick", amount: 1, kind: "count" },
  { name: "Lemon", amount: 0.5, kind: "count" },
]

// Rounds to the nearest whole number; a tie always rounds up.
function roundHalfUp(value: number) {
  return Math.floor(value + 0.5)
}

function formatHalves(value: number) {
  const halves = Math.max(1, roundHalfUp(value * 2))
  const whole = Math.floor(halves / 2)
  const half = halves % 2 === 1 ? "½" : ""
  return whole === 0 ? half : `${whole}${half}`
}

function formatAmount(ingredient: Ingredient, cups: number) {
  const value = (ingredient.amount * cups) / BASE_CUPS

  switch (ingredient.kind) {
    case "grams":
      return `${Math.max(1, roundHalfUp(value))} g`
    case "millilitres": {
      const ml = roundHalfUp(value / 10) * 10
      if (ml < 1000) return `${ml} ml`
      const litres = roundHalfUp(ml / 100) / 10
      return `${String(litres)} l`
    }
    case "spoon":
      return `${formatHalves(value)} ${ingredient.unit}`
    case "count":
      return formatHalves(value)
  }
}

const method = [
  "Halve the pears, cut out the cores and slice each half into thin wedges. Peel the ginger with the edge of a spoon and slice it into thin coins.",
  "Put the pears, ginger and cinnamon stick in a pan with the water. Bring it to the boil, then turn it down and simmer for 15 minutes, until the pears are soft and the kitchen smells of ginger.",
  "Take the pan off the heat and let it stand for a minute or two, so it cools to about 85°C. Stir in the lemon verbena and steep for 5 minutes, no longer.",
  "Pour the tisane through a fine sieve into a warmed pot, pressing lightly on the pears to get the last of their juice.",
  "Stir in the honey until it melts, squeeze in the lemon and taste. Serve straight away in warmed cups, with a slice of pear in each if you like.",
]

const moreEntries = [
  {
    title: "Drying lemon verbena at home",
    date: "2026-10-24",
    label: "24 October 2026",
  },
  { title: "A week of soup", date: "2026-10-09", label: "9 October 2026" },
  {
    title: "Why we stopped using tea bags",
    date: "2026-09-18",
    label: "18 September 2026",
  },
]

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
]

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const buttonClass = "rounded-md"

export function App() {
  const [cups, setCups] = useState(BASE_CUPS)

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => {
              const current = link.href === "/journal"
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={current ? "true" : undefined}
                    className={cn(headerLink, "text-body", current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main>
        <article>
          <section className="grid gap-6 pt-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono text-label text-muted-foreground">
                From the journal · Mara Hollis ·{" "}
                <time dateTime="2026-11-06">6 November 2026</time>
              </p>
              <h1 className="mt-2 text-h1 text-foreground md:text-display">
                Pear, ginger and lemon verbena tisane
              </h1>
              <p className="mt-4 max-w-xl font-heading text-h2 text-foreground">
                The pot we pour in the room from the first cold week of autumn:
                soft pear, a slow warmth of ginger and a bright lift of
                verbena at the end.
              </p>
              <p className="mt-6 font-mono text-label text-foreground">
                Prep 10 min · Simmer 15 min · Steep 5 min · Serves 4
              </p>
            </div>
            <figure className="md:col-span-5 md:col-start-8">
              <div
                role="img"
                aria-label="A clay teapot and two cups on a linen cloth, pear slices beside them"
                className="aspect-square rounded-xl bg-muted"
              />
              <figcaption className="mt-2 font-mono text-label text-muted-foreground">
                The autumn pot, served from October
              </figcaption>
            </figure>
          </section>

          <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <h2 className="text-h2 text-foreground">Ingredients</h2>
              <p
                id="cups-label"
                className="mt-4 font-mono text-label text-foreground"
              >
                Cups
              </p>
              <div
                role="group"
                aria-labelledby="cups-label"
                className="mt-2 flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className={buttonClass}
                  aria-label="Fewer cups"
                  disabled={cups <= MIN_CUPS}
                  focusableWhenDisabled
                  onClick={() => setCups((c) => Math.max(MIN_CUPS, c - 1))}
                >
                  <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
                <span
                  aria-live="polite"
                  className="inline-flex min-w-24 justify-center font-mono text-label text-foreground tabular-nums"
                >
                  {cups} {cups === 1 ? "cup" : "cups"}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className={buttonClass}
                  aria-label="More cups"
                  disabled={cups >= MAX_CUPS}
                  focusableWhenDisabled
                  onClick={() => setCups((c) => Math.min(MAX_CUPS, c + 1))}
                >
                  <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>
              <ul className="mt-6 divide-y">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient.name}
                    className="flex items-baseline justify-between gap-4 py-2"
                  >
                    <span className="text-body text-foreground">
                      {ingredient.name}
                      {ingredient.aside && (
                        <>
                          {" "}
                          <span className="text-muted-foreground">
                            ({ingredient.aside})
                          </span>
                        </>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                      {formatAmount(ingredient, cups)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <h2 className="text-h2 text-foreground">Method</h2>
              <ol className="mt-6 list-decimal pl-6">
                {method.map((step, index) => (
                  <li
                    key={index}
                    className={cn("text-body text-foreground", index > 0 && "mt-4")}
                  >
                    {step}
                  </li>
                ))}
              </ol>

              <aside
                aria-label="A note from the kitchen"
                className="mt-6 rounded-xl border bg-card p-6"
              >
                <p className="font-mono text-label text-muted-foreground">
                  A note from the kitchen
                </p>
                <p className="mt-2 max-w-xl text-foreground">
                  Lemon verbena turns bitter in water that is still boiling, so
                  always take the pan off the heat before the leaves go in. The
                  poached pears left in the sieve are too good to throw away:
                  we fold them into the next morning's crumble.
                </p>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  Mara Hollis
                </p>
              </aside>
            </div>
          </section>
        </article>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2 text-foreground">More from the journal</h2>
            <ul className="mt-6 divide-y">
              {moreEntries.map((entry) => (
                <li
                  key={entry.title}
                  className="flex flex-col items-start gap-0 py-4 md:flex-row md:items-baseline md:justify-between md:gap-4"
                >
                  <a
                    href="#"
                    className={cn(
                      "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
                      focusOutline
                    )}
                  >
                    {entry.title}
                  </a>
                  <p className="mt-2 shrink-0 font-mono text-label text-muted-foreground md:mt-0">
                    <time dateTime={entry.date}>{entry.label}</time>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2 text-foreground">
                The Linden Room
              </p>
              <p className="mt-2 max-w-xl text-foreground">
                A tea room and shop on Mill Lane, pouring loose-leaf teas and
                tisanes with cakes from our own kitchen.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic text-foreground">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
