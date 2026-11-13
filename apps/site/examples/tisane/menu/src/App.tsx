import { useState, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mark = "Vegan" | "Gluten-free" | "Vegetarian"

type Item = {
  name: string
  note: string
  price: string
  marks: Mark[]
  seasonal?: boolean
}

type MenuSection = {
  id: string
  title: string
  served: ReactNode
  items: Item[]
}

type Filter = "all" | "vegan" | "gluten-free"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const quietLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const buttonClass = "h-auto rounded-md px-6 py-2 font-mono text-label"

const navLinks = [
  { label: "Menu", href: "/menu", current: true },
  { label: "Book a table", href: "/booking", current: false },
  { label: "Journal", href: "/journal", current: false },
  { label: "Visit", href: "/visit", current: false },
]

const sections: MenuSection[] = [
  {
    id: "teas",
    title: "Teas",
    served: "A pot for one",
    items: [
      {
        name: "Garden mint",
        note: "Fresh leaves from the garden at the back.",
        price: "£3.80",
        marks: ["Vegan", "Gluten-free"],
      },
      {
        name: "Lemon verbena",
        note: "Dried in the shed over the summer, bright and soft.",
        price: "£3.80",
        marks: ["Vegan", "Gluten-free"],
      },
      {
        name: "Pear and ginger",
        note: "Dried pear from the orchard with a slice of fresh ginger.",
        price: "£4.20",
        marks: ["Vegan", "Gluten-free"],
        seasonal: true,
      },
      {
        name: "Roasted barley",
        note: "Toasty and nutty, with no caffeine at all.",
        price: "£3.60",
        marks: ["Vegan"],
      },
      {
        name: "Breakfast black with oat milk",
        note: "A strong Assam blend, poured with a jug of oat milk.",
        price: "£3.40",
        marks: ["Vegan", "Gluten-free"],
      },
    ],
  },
  {
    id: "plates",
    title: "Plates",
    served: (
      <>
        Served <time dateTime="11:30">11:30</time>–
        <time dateTime="14:30">14:30</time>
      </>
    ),
    items: [
      {
        name: "Roast squash and lentil soup with rye bread",
        note: "Squash from Hollins Farm, roasted with thyme.",
        price: "£7.50",
        marks: ["Vegan"],
      },
      {
        name: "Baked eggs with spinach and yoghurt",
        note: "Two eggs baked in the pan, with garlic yoghurt on top.",
        price: "£9.00",
        marks: ["Vegetarian", "Gluten-free"],
      },
      {
        name: "Mushrooms on sourdough toast",
        note: "Field mushrooms with parsley on our own sourdough.",
        price: "£8.50",
        marks: ["Vegan"],
      },
      {
        name: "Beetroot, lentil and walnut salad",
        note: "Roasted beetroot, green lentils and a mustard dressing.",
        price: "£9.50",
        marks: ["Vegan", "Gluten-free"],
      },
    ],
  },
  {
    id: "cakes",
    title: "Cakes",
    served: "Baked each morning",
    items: [
      {
        name: "Pear and cardamom loaf",
        note: "Made with this week's pears.",
        price: "£3.60",
        marks: ["Vegetarian"],
      },
      {
        name: "Almond and orange cake",
        note: "Ground almonds and a whole boiled orange, no flour.",
        price: "£3.80",
        marks: ["Vegetarian", "Gluten-free"],
      },
      {
        name: "Oat and date slice",
        note: "Chewy, not too sweet, good with a pot of black tea.",
        price: "£3.20",
        marks: ["Vegan"],
      },
      {
        name: "Ginger parkin",
        note: "Dark and sticky, made with oatmeal and treacle.",
        price: "£3.20",
        marks: ["Vegetarian"],
      },
    ],
  },
]

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
]

function matches(item: Item, filter: Filter) {
  if (filter === "vegan") return item.marks.includes("Vegan")
  if (filter === "gluten-free") return item.marks.includes("Gluten-free")
  return true
}

function statusText(filter: Filter, count: number) {
  const noun = count === 1 ? "item" : "items"
  if (filter === "all") return `Showing all ${count} ${noun}`
  return `Showing ${count} ${filter} ${noun}`
}

export function App() {
  const [filter, setFilter] = useState<Filter>("all")

  const shownCount = sections.reduce(
    (total, section) =>
      total + section.items.filter((item) => matches(item, filter)).length,
    0
  )

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", quietLink)}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    "text-body",
                    quietLink,
                    link.current && "underline"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground tabular-nums">
              Autumn menu · From{" "}
              <time dateTime="2026-11-02">2 November 2026</time>
            </p>
            <h1 className="mt-2 text-h1">Menu</h1>
            <p className="mt-4 max-w-xl">
              Everything here is cooked in our own kitchen from what the season
              brings in, with bread and cakes baked each morning. The teas on
              this menu are also sold by weight at the counter.
            </p>

            <div className="mt-6">
              <div
                role="group"
                aria-label="Show"
                className="flex flex-wrap gap-2"
              >
                {filters.map((option) => {
                  const chosen = option.value === filter
                  return (
                    <Button
                      key={option.value}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen ? "true" : "false"}
                      className={buttonClass}
                      onClick={() => setFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-4 font-mono text-label text-muted-foreground tabular-nums"
              >
                {statusText(filter, shownCount)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          <div className="min-w-0 md:col-span-8">
            {sections.map((section, index) => {
              const shown = section.items.filter((item) =>
                matches(item, filter)
              )
              const headingId = `${section.id}-heading`
              return (
                <section
                  key={section.id}
                  aria-labelledby={headingId}
                  className={index === 0 ? undefined : "mt-10"}
                >
                  <h2 id={headingId} className="text-h2">
                    {section.title}
                  </h2>
                  <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
                    {section.served}
                  </p>
                  {shown.length > 0 ? (
                    <ul className="mt-4 divide-y">
                      {shown.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-baseline justify-between gap-4 py-4"
                        >
                          <div className="min-w-0">
                            {item.seasonal ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-body">{item.name}</h3>
                                <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground">
                                  Seasonal
                                </Badge>
                              </div>
                            ) : (
                              <h3 className="text-body">{item.name}</h3>
                            )}
                            <p className="mt-2">{item.note}</p>
                            {item.marks.length > 0 && (
                              <p className="mt-2 font-mono text-label text-muted-foreground">
                                {item.marks.join(" · ")}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                            {item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4">
                      Nothing in this section is {filter} today.
                    </p>
                  )}
                </section>
              )
            })}
          </div>

          <aside
            aria-label="Allergies"
            className="rounded-xl border bg-card p-6 md:col-span-3 md:col-start-10"
          >
            <p className="font-mono text-label text-muted-foreground">
              Allergies
            </p>
            <p className="mt-2">
              Everything is made in one small kitchen that also uses nuts,
              gluten and milk. A mark means the recipe has none, not that the
              kitchen is free of it. If you have an allergy, please ask at the
              counter.
            </p>
          </aside>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="max-w-xl">
              Coming with friends or for a quiet lunch? You can{" "}
              <a href="/booking" className={textLink}>
                book a table
              </a>{" "}
              for any day we are open.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2">
                A tea room and shop on Mill Lane, with loose tea by weight and
                cakes from our own oven.
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
