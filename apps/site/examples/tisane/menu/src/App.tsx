import { useState, type ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mark = "Vegan" | "Gluten-free" | "Vegetarian"
type Filter = "all" | "vegan" | "gluten-free"

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

const menu: MenuSection[] = [
  {
    id: "teas",
    title: "Teas",
    served: "A pot for one",
    items: [
      {
        name: "Garden mint",
        note: "Fresh leaves from the garden at the back",
        price: "£3.80",
        marks: ["Vegan", "Gluten-free"],
      },
      {
        name: "Lemon verbena",
        note: "Dried on racks in the shop since August",
        price: "£3.80",
        marks: ["Vegan", "Gluten-free"],
      },
      {
        name: "Pear and ginger",
        note: "Made with this week's pears and fresh root",
        price: "£4.20",
        marks: ["Vegan", "Gluten-free"],
        seasonal: true,
      },
      {
        name: "Roasted barley",
        note: "Nutty and dark, with no caffeine",
        price: "£3.60",
        marks: ["Vegan"],
      },
      {
        name: "Breakfast black with oat milk",
        note: "A strong Assam blend, steeped for four minutes",
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
        note: "A big bowl, with bread from the bakery on Church Row",
        price: "£7.50",
        marks: ["Vegan"],
      },
      {
        name: "Baked eggs with spinach and yoghurt",
        note: "Two eggs in a small dish, with chilli butter",
        price: "£9.00",
        marks: ["Vegetarian", "Gluten-free"],
      },
      {
        name: "Mushrooms on sourdough toast",
        note: "Field mushrooms with thyme and garlic",
        price: "£8.50",
        marks: ["Vegan"],
      },
      {
        name: "Beetroot, lentil and walnut salad",
        note: "Roast beetroot, green lentils and a mustard dressing",
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
        note: "A thick slice, sold by the piece or the loaf",
        price: "£3.60",
        marks: ["Vegetarian"],
      },
      {
        name: "Almond and orange cake",
        note: "Ground almonds and whole oranges, no flour",
        price: "£3.80",
        marks: ["Vegetarian", "Gluten-free"],
      },
      {
        name: "Oat and date slice",
        note: "Sweetened with dates and a little maple syrup",
        price: "£3.20",
        marks: ["Vegan"],
      },
      {
        name: "Ginger parkin",
        note: "Oats, black treacle and ginger, kept for three days",
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

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusOutline
)

const navLinks = [
  { label: "Menu", href: "/menu", current: true },
  { label: "Book a table", href: "/booking", current: false },
  { label: "Journal", href: "/journal", current: false },
  { label: "Visit", href: "/visit", current: false },
]

export function App() {
  const [filter, setFilter] = useState<Filter>("all")

  const shownCount = menu.reduce(
    (total, section) =>
      total + section.items.filter((item) => matches(item, filter)).length,
    0
  )
  const noun = shownCount === 1 ? "item" : "items"
  const status =
    filter === "all"
      ? `Showing all ${shownCount} ${noun}`
      : `Showing ${shownCount} ${filter} ${noun}`

  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(chromeLink, "font-heading text-h2")}>
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
                    chromeLink,
                    "text-body",
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
        <section className="grid gap-6 pt-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Autumn menu · From{" "}
              <time dateTime="2026-11-02">2 November 2026</time>
            </p>
            <h1 className="mt-2 text-h1">Menu</h1>
            <p className="mt-4 max-w-xl">
              We cook soups, plates and cakes from scratch each day in our own
              kitchen, with vegetables from growers near Ashby Wold. Every tea
              on this menu is also sold loose by weight at the counter.
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
                      className="h-auto rounded-md px-6 py-2 font-mono text-label"
                      onClick={() => setFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              <p
                role="status"
                className="mt-4 font-mono text-label text-muted-foreground"
              >
                {status}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-8">
            {menu.map((section, index) => {
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
                  <p className="mt-2 font-mono text-label text-muted-foreground">
                    {section.served}
                  </p>
                  {shown.length === 0 ? (
                    <p className="mt-4">
                      Nothing in this section is {filter} today.
                    </p>
                  ) : (
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
                          <p className="shrink-0 font-mono text-label text-foreground tabular-nums">
                            {item.price}
                          </p>
                        </li>
                      ))}
                    </ul>
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
              counter before you order.
            </p>
          </aside>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="max-w-xl">
              <a href="/booking" className={textLink}>
                Book a table
              </a>{" "}
              up to four weeks ahead if you are coming with friends or at the
              weekend, when the room fills by noon.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop in an old mill house, open since 2014.
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
