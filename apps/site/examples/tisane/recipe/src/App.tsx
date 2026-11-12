import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const navLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const BASE_CUPS = 4
const MIN_CUPS = 1
const MAX_CUPS = 12

type Unit = "g" | "ml" | "count" | "tbsp"

type Ingredient = {
  name: string
  aside?: string
  amount: number
  unit: Unit
}

const ingredients: Ingredient[] = [
  { name: "Ripe pears", amount: 2, unit: "count" },
  { name: "Fresh ginger", amount: 30, unit: "g" },
  { name: "Dried lemon verbena", amount: 6, unit: "g" },
  { name: "Water", amount: 1000, unit: "ml" },
  {
    name: "Honey",
    aside: "or maple syrup, to keep it vegan",
    amount: 2,
    unit: "tbsp",
  },
  { name: "Cinnamon stick", amount: 1, unit: "count" },
  { name: "Lemon", amount: 0.5, unit: "count" },
]

const steps = [
  "Core the pears and cut them into thin slices, skin on. Peel the ginger with the edge of a spoon and slice it into coins.",
  "Put the pears, ginger and cinnamon stick in a pan with the water. Bring it to the boil, then turn the heat down and simmer for 15 minutes, until the pears are soft and the kitchen smells of them.",
  "Take the pan off the heat and let it stand for a minute or two, so the water cools to about 85°C. Stir in the lemon verbena and steep for 5 minutes with a lid on.",
  "Strain into a warmed pot, pressing the pears lightly with the back of a spoon to get the last of their juice.",
  "Stir in the honey and squeeze in the lemon. Taste, add a little more honey if the pears were sharp, and pour.",
]

const moreEntries = [
  {
    title: "Drying lemon verbena at home",
    date: "2026-10-24",
    text: "24 October 2026",
  },
  { title: "A week of soup", date: "2026-10-09", text: "9 October 2026" },
  {
    title: "Why we stopped using tea bags",
    date: "2026-09-18",
    text: "18 September 2026",
  },
]

// Round half up, working in whole halves so a tie always goes up.
function roundToHalf(value: number) {
  return Math.floor(value * 2 + 0.5) / 2
}

function formatHalves(value: number) {
  const whole = Math.floor(value)
  const half = value - whole >= 0.5
  if (whole === 0) return "½"
  return half ? `${whole}½` : `${whole}`
}

function formatAmount(ingredient: Ingredient, cups: number) {
  const scaled = (ingredient.amount / BASE_CUPS) * cups
  switch (ingredient.unit) {
    case "g":
      return `${Math.max(1, Math.floor(scaled + 0.5))} g`
    case "ml": {
      const ml = Math.floor(scaled / 10 + 0.5) * 10
      if (ml < 1000) return `${ml} ml`
      const litres = Math.floor(ml / 100 + 0.5) / 10
      return `${String(litres)} l`
    }
    case "tbsp":
      return `${formatHalves(Math.max(0.5, roundToHalf(scaled)))} tbsp`
    case "count":
      return formatHalves(Math.max(0.5, roundToHalf(scaled)))
  }
}

export function App() {
  const [cups, setCups] = useState(BASE_CUPS)

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${navLink}`}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="/menu" className={`text-body ${navLink}`}>
                Menu
              </a>
            </li>
            <li>
              <a href="/booking" className={`text-body ${navLink}`}>
                Book a table
              </a>
            </li>
            <li>
              <a
                href="/journal"
                aria-current="true"
                className={`text-body underline ${navLink}`}
              >
                Journal
              </a>
            </li>
            <li>
              <a href="/visit" className={`text-body ${navLink}`}>
                Visit
              </a>
            </li>
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
              <h1 className="mt-2 text-h1 md:text-display">
                Pear, ginger and lemon verbena tisane
              </h1>
              <p className="mt-4 font-heading text-h2">
                The pot we pour in the room each autumn: soft pear, a slow
                warmth of ginger and a green lift of verbena at the end.
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
                  <Minus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
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
                  <Plus
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Button>
              </div>
              <ul className="mt-6 divide-y">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient.name}
                    className="flex items-baseline justify-between gap-4 py-2"
                  >
                    <span className="text-body">
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
              <h2 className="text-h2">Method</h2>
              <ol className="mt-6 list-decimal pl-6">
                {steps.map((step, i) => (
                  <li key={i} className={`text-body ${i > 0 ? "mt-4" : ""}`}>
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
                <p className="mt-2">
                  Lemon verbena turns bitter in water that is still boiling, so
                  always take the pan off the heat before it goes in. Keep the
                  strained pears: they are soft and spiced by then, and make the
                  start of a good crumble.
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
            <h2 className="text-h2">More from the journal</h2>
            <ul className="mt-6 divide-y">
              {moreEntries.map((entry) => (
                <li
                  key={entry.title}
                  className="flex flex-col items-start gap-0 py-4 md:flex-row md:items-baseline md:justify-between md:gap-4"
                >
                  <a href="#" className={navLink}>
                    {entry.title}
                  </a>
                  <p className="mt-2 shrink-0 font-mono text-label text-muted-foreground md:mt-0">
                    <time dateTime={entry.date}>{entry.text}</time>
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
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2">
                A tea room and shop on Mill Lane, pouring loose-leaf tea and
                tisanes since 2014.
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
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
