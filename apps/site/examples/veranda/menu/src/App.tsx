import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Letter = "V" | "VG" | "GF" | "DF"

type Dish = {
  name: string
  description: string
  price: string
  letters: Letter[]
}

const KEY: { letter: Letter; word: string }[] = [
  { letter: "V", word: "Vegetarian" },
  { letter: "VG", word: "Vegan" },
  { letter: "GF", word: "No gluten" },
  { letter: "DF", word: "No dairy" },
]

const WORDS: Record<Letter, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "No gluten",
  DF: "No dairy",
}

const COOKED: Dish[] = [
  {
    name: "The harbour breakfast",
    description:
      "Bacon, a pork sausage, a fried egg, tomato, mushrooms and fried bread",
    price: "£13.50",
    letters: [],
  },
  {
    name: "The garden breakfast",
    description: "Field mushrooms, tomatoes, spinach, beans and a potato cake",
    price: "£12.00",
    letters: ["VG"],
  },
  {
    name: "Smoked haddock kedgeree",
    description: "With a soft egg, parsley and lemon",
    price: "£11.50",
    letters: ["GF"],
  },
  {
    name: "Grilled kipper",
    description:
      "From the smokehouse on the quay, with brown butter and brown bread",
    price: "£9.50",
    letters: [],
  },
  {
    name: "Soft-boiled eggs and soldiers",
    description: "Two eggs from the farm on the hill",
    price: "£7.00",
    letters: ["V"],
  },
]

const SIDEBOARD: Dish[] = [
  {
    name: "Porridge",
    description: "Pinhead oats soaked overnight, with cream and honey",
    price: "£6.50",
    letters: ["V"],
  },
  {
    name: "Yoghurt, rhubarb and toasted oats",
    description: "The rhubarb is from the garden",
    price: "£6.00",
    letters: ["V"],
  },
  {
    name: "Toast and the house marmalade",
    description: "Sourdough or soda bread, with salted butter",
    price: "£4.00",
    letters: ["V"],
  },
]

const STARTERS: Dish[] = [
  {
    name: "Crab on toast",
    description: "White and brown meat, lemon and cayenne",
    price: "£9.50",
    letters: [],
  },
  {
    name: "Leek and potato soup",
    description: "With soda bread and salted butter",
    price: "£7.00",
    letters: ["V"],
  },
  {
    name: "Beetroot, lentil and dill salad",
    description: "Served warm, with a mustard dressing",
    price: "£7.50",
    letters: ["VG", "GF"],
  },
]

const MAINS: Dish[] = [
  {
    name: "Hake with mussels and cider",
    description: "From the morning’s boats, with new potatoes",
    price: "£19.50",
    letters: ["GF"],
  },
  {
    name: "Lamb shoulder with white beans",
    description: "Cooked slowly overnight, with mint and garlic",
    price: "£21.00",
    letters: ["GF", "DF"],
  },
  {
    name: "Baked squash with chard and hazelnuts",
    description: "With barley, sage and a sharp green sauce",
    price: "£16.50",
    letters: ["VG"],
  },
]

const PUDDINGS: Dish[] = [
  {
    name: "Treacle tart",
    description: "With clotted cream",
    price: "£7.50",
    letters: ["V"],
  },
  {
    name: "Baked apple and oat crumble",
    description: "With custard or cream",
    price: "£7.00",
    letters: ["V"],
  },
  {
    name: "Three cheeses from the county",
    description: "With oatcakes and quince paste",
    price: "£9.00",
    letters: ["V"],
  },
]

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const label = "font-mono text-label uppercase"

const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Menu", href: "/menu", current: true },
  { label: "Find us", href: "/#find-us" },
  { label: "Reserve", href: "/reserve" },
]

const sectionRule = "mt-12 border-t border-border pt-6 md:mt-26"

function Letters({ letters }: { letters: Letter[] }) {
  return (
    <p className={cn("mt-2", label, "text-muted-foreground")}>
      {letters.map((letter, i) => {
        const last = i === letters.length - 1
        return (
          <span key={letter}>
            <span aria-hidden="true">{letter}</span>
            <span className="sr-only">
              {WORDS[letter]}
              {last ? "." : ", "}
            </span>
            {!last && <span aria-hidden="true"> · </span>}
          </span>
        )
      })}
    </p>
  )
}

function DishList({ dishes }: { dishes: Dish[] }) {
  return (
    <ul className="mt-4 list-none p-0">
      {dishes.map((dish, i) => (
        <li key={dish.name} className={i > 0 ? "mt-6" : undefined}>
          <div className="flex items-baseline gap-2">
            <h4 className="min-w-0 text-h2">{dish.name}</h4>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 border-b border-border"
            />
            <p
              className={cn(
                label,
                "shrink-0 whitespace-nowrap text-foreground tabular-nums"
              )}
            >
              {dish.price}
            </p>
          </div>
          <p className="mt-2 max-w-xl text-body">{dish.description}</p>
          {dish.letters.length > 0 && <Letters letters={dish.letters} />}
        </li>
      ))}
    </ul>
  )
}

function Course({
  title,
  dishes,
  className,
}: {
  title: string
  dishes: Dish[]
  className?: string
}) {
  return (
    <>
      <h3 className={cn(label, "text-foreground", className)}>{title}</h3>
      <DishList dishes={dishes} />
    </>
  )
}

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <>
      <time dateTime={from}>{from}</time>–<time dateTime={to}>{to}</time>
    </>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(label, chromeLink, item.current && "underline")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="menu-title"
          className="grid gap-6 pt-12 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>
              Spring menu · From <time dateTime="2027-04-01">1 April 2027</time>
            </p>
            <h1 id="menu-title" className="mt-2 text-h1 lg:text-display">
              Breakfast <span className="italic">and supper</span>
            </h1>
            <p className="mt-4 max-w-xl text-body">
              Breakfast is cooked to order every morning and is included with a
              room. Supper is a short menu on three evenings a week. If you are
              not staying, you are welcome at both, at the prices shown: book
              the day before.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {KEY.map((entry) => (
                <div key={entry.letter} className="flex items-baseline gap-2">
                  <dt className={cn(label, "text-foreground")}>
                    {entry.letter}
                  </dt>
                  <dd className={cn(label, "text-muted-foreground")}>
                    {entry.word}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-xl font-mono text-label text-muted-foreground">
              Everything is cooked in one small kitchen that also uses nuts,
              milk, eggs and gluten. Tell us about an allergy before you order.
            </p>
          </div>

          <div className="rounded-xl bg-clay p-6 text-clay-foreground md:col-span-4 md:col-start-9">
            <h2 className={label}>When we serve</h2>
            <dl className="mt-4">
              <div>
                <dt className="text-body">Breakfast, every day</dt>
                <dd className={cn("mt-2 tabular-nums", label)}>
                  <Hours from="08:00" to="10:00" />
                </dd>
              </div>
              <div className="mt-4">
                <dt className="text-body">Breakfast on Sundays</dt>
                <dd className={cn("mt-2 tabular-nums", label)}>
                  <Hours from="08:00" to="10:30" />
                </dd>
              </div>
              <div className="mt-4">
                <dt className="text-body">Supper, Thursday to Saturday</dt>
                <dd className={cn("mt-2 tabular-nums", label)}>
                  <Hours from="18:30" to="20:30" />
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-body">
              Tell us by <time dateTime="14:00">14:00</time> if you would like
              supper.
            </p>
          </div>
        </section>

        <section
          id="breakfast"
          aria-labelledby="breakfast-title"
          className={cn(
            sectionRule,
            "grid gap-6 md:grid-cols-12 md:items-start"
          )}
        >
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>
                Every day · <Hours from="08:00" to="10:00" />
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Included for guests
              </Badge>
            </div>
            <h2 id="breakfast-title" className="mt-2 text-h2 md:text-h1">
              Breakfast
            </h2>
            <p className="mt-4 max-w-xl text-body">
              We serve breakfast on the veranda. Order as much or as little as
              you like: for guests of the house, the prices do not apply.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Course title="Cooked to order" dishes={COOKED} />
            <Course
              title="From the sideboard"
              dishes={SIDEBOARD}
              className="mt-12"
            />
          </div>
        </section>

        <section
          id="supper"
          aria-labelledby="supper-title"
          className={cn(
            sectionRule,
            "grid gap-6 md:grid-cols-12 md:items-start"
          )}
        >
          <div className="md:col-span-4">
            <p className={cn(label, "text-muted-foreground")}>
              Thursday to Saturday · <Hours from="18:30" to="20:30" />
            </p>
            <h2 id="supper-title" className="mt-2 text-h2 md:text-h1">
              Supper
            </h2>
            <p className="mt-4 max-w-xl text-body">
              Three courses or one, at the long table in the breakfast room,
              with the fish from that morning’s boats.
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Course title="To start" dishes={STARTERS} />
            <Course title="Mains" dishes={MAINS} className="mt-12" />
            <Course title="Puddings" dishes={PUDDINGS} className="mt-12" />
          </div>
        </section>

        <section
          aria-labelledby="table-title"
          className={cn(sectionRule, "grid gap-6 md:grid-cols-12")}
        >
          <div className="md:col-span-7">
            <p className={cn(label, "text-muted-foreground")}>
              Guests and visitors
            </p>
            <h2 id="table-title" className="mt-2 text-h2 md:text-h1">
              A table for supper
            </h2>
            <p className="mt-4 max-w-xl text-body">
              If you are staying, tell us at breakfast or by{" "}
              <time dateTime="14:00">14:00</time>. If you are not, write or call
              the day before: there are twelve places at the table.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "h-auto rounded-md px-6 py-2 font-mono text-label font-normal uppercase"
                )}
              >
                Write to us
              </a>
              <p className={cn(label, "text-foreground")}>
                Or call{" "}
                <a href="tel:+441632960352" className={textLink}>
                  01632 960 352
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-border py-12 md:mt-26">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="font-heading text-h2">Kittiwake House</p>
            <p className="mt-2 text-body">
              Six rooms above the harbour at Port Lowan, with breakfast on the
              veranda.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <address className="text-body not-italic">
              <span className="block">9 Harbour Terrace</span>
              <span className="block">Port Lowan LW6 3QT</span>
            </address>
            <p className="mt-4 text-body">
              <a href="tel:+441632960352" className={chromeLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 text-body">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={chromeLink}
              >
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className={cn("mt-6", label, "text-muted-foreground")}>
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

export default App
