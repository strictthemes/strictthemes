import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

const BASE_CUPS = 4
const MIN_CUPS = 1
const MAX_CUPS = 12

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const quietLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

type Ingredient = {
  name: string
  aside?: string
  amount: number
  kind: "grams" | "millilitres" | "count" | "spoon"
  unit?: string
}

// Amounts for four cups, the recipe as written.
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

const journal = [
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

function formatHalves(value: number) {
  const whole = Math.floor(value)
  const half = value - whole >= 0.5 ? "½" : ""
  if (whole === 0) return half
  return `${whole}${half}`
}

function formatAmount(item: Ingredient, cups: number) {
  const scaled = (item.amount * cups) / BASE_CUPS

  switch (item.kind) {
    case "grams":
      return `${Math.max(1, Math.round(scaled))} g`
    case "millilitres": {
      const ml = Math.round(scaled / 10) * 10
      if (ml < 1000) return `${ml} ml`
      return `${Math.round(ml / 100) / 10} l`
    }
    case "count":
    case "spoon": {
      const halves = Math.max(0.5, Math.round(scaled * 2) / 2)
      const text = formatHalves(halves)
      return item.unit ? `${text} ${item.unit}` : text
    }
  }
}

export function App() {
  const [cups, setCups] = useState(BASE_CUPS)

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${quietLink}`}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="/menu" className={`text-body ${quietLink}`}>
                Menu
              </a>
            </li>
            <li>
              <a href="/booking" className={`text-body ${quietLink}`}>
                Book a table
              </a>
            </li>
            <li>
              <a
                href="/journal"
                aria-current="true"
                className={`text-body underline ${quietLink}`}
              >
                Journal
              </a>
            </li>
            <li>
              <a href="/visit" className={`text-body ${quietLink}`}>
                Visit
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <article>
          <section className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="font-mono text-label text-muted-foreground tabular-nums">
                From the journal · Mara Hollis ·{" "}
                <time dateTime="2026-11-06">6 November 2026</time>
              </p>
              <h1 className="mt-2 text-h1 md:text-display">
                Pear, ginger and lemon verbena tisane
              </h1>
              <p className="mt-4 max-w-xl font-heading text-h2">
                The pot we pour in the room each autumn: soft pear, a warm
                edge of ginger and the clean, grassy lift of lemon verbena.
              </p>
              <p className="mt-6 font-mono text-label text-foreground tabular-nums">
                Prep 10 min · Simmer 15 min · Steep 5 min · Serves 4
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <figure>
                <div
                  role="img"
                  aria-label="A clay teapot and two cups on a linen cloth, pear slices beside them"
                  className="aspect-square rounded-xl bg-muted"
                />
                <figcaption className="mt-2 font-mono text-label text-muted-foreground">
                  The autumn pot, served from October
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <h2 className="text-h2">Ingredients</h2>
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
                  className="rounded-md"
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
                  className="rounded-md"
                  aria-label="More cups"
                  disabled={cups >= MAX_CUPS}
                  focusableWhenDisabled
                  onClick={() => setCups((c) => Math.min(MAX_CUPS, c + 1))}
                >
                  <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>
              <ul className="mt-6 divide-y">
                {ingredients.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-4 py-2"
                  >
                    <span className="text-body">
                      {item.name}
                      {item.aside && (
                        <>
                          {" "}
                          <span className="text-muted-foreground">
                            ({item.aside})
                          </span>
                        </>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                      {formatAmount(item, cups)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <h2 className="text-h2">Method</h2>
              <ol className="mt-6 list-decimal pl-6">
                <li className="text-body">
                  Core the pears and cut them into thin slices, skins and all.
                  Peel the ginger with the edge of a teaspoon and slice it into
                  thin coins.
                </li>
                <li className="mt-4 text-body">
                  Put the pears, ginger and cinnamon stick in a pan with the
                  water and bring it to the boil. Turn the heat down and let it
                  simmer for 15 minutes, until the pears are soft and the
                  kitchen smells of ginger.
                </li>
                <li className="mt-4 text-body">
                  Take the pan off the heat and wait a minute or two, until the
                  water has cooled to about 85°C. Stir in the lemon verbena.
                </li>
                <li className="mt-4 text-body">
                  Put the lid on and let it steep for 5 minutes, no longer.
                  Strain it into a warmed pot, pressing the pears gently to
                  get the last of their juice.
                </li>
                <li className="mt-4 text-body">
                  Stir in the honey until it melts, then squeeze in the lemon.
                  Pour it into cups straight away, while it is still steaming.
                </li>
              </ol>

              <aside
                aria-label="A note from the kitchen"
                className="mt-6 rounded-xl border bg-card p-6"
              >
                <p className="font-mono text-label text-muted-foreground">
                  A note from the kitchen
                </p>
                <p className="mt-2 max-w-xl">
                  Lemon verbena turns bitter in water that is still boiling,
                  so always take the pan off the heat before the leaves go in.
                  Keep the strained pears: under a little oat crumble, they
                  make the next day&apos;s pudding.
                </p>
                <p className="mt-4 font-mono text-label text-muted-foreground">
                  Mara Hollis
                </p>
              </aside>
            </div>
          </section>
        </article>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">More from the journal</h2>
            <ul className="mt-6 divide-y">
              {journal.map((entry) => (
                <li
                  key={entry.title}
                  className="flex flex-col items-start gap-0 py-4 md:flex-row md:items-baseline md:justify-between md:gap-4"
                >
                  <a href="#" className={quietLink}>
                    {entry.title}
                  </a>
                  <p className="mt-2 shrink-0 font-mono text-label text-muted-foreground tabular-nums md:mt-0">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop on Mill Lane, pouring loose-leaf tea and
                baking fresh every morning.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-label text-muted-foreground tabular-nums">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
