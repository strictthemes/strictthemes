import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

type Letter = "V" | "VG" | "GF" | "DF"

const letterWords: Record<Letter, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "No gluten",
  DF: "No dairy",
}

const keyOrder: Letter[] = ["V", "VG", "GF", "DF"]

type Dish = {
  name: string
  description: string
  price: string
  letters: Letter[]
}

type Course = {
  id: string
  title: string
  dishes: Dish[]
}

const breakfastCourses: Course[] = [
  {
    id: "cooked-to-order",
    title: "Cooked to order",
    dishes: [
      {
        name: "The harbour breakfast",
        description:
          "Bacon, a pork sausage, a fried egg, tomato, mushrooms and fried bread",
        price: "£13.50",
        letters: [],
      },
      {
        name: "The garden breakfast",
        description:
          "Field mushrooms, tomatoes, spinach, beans and a potato cake",
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
    ],
  },
  {
    id: "from-the-sideboard",
    title: "From the sideboard",
    dishes: [
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
    ],
  },
]

const supperCourses: Course[] = [
  {
    id: "to-start",
    title: "To start",
    dishes: [
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
    ],
  },
  {
    id: "mains",
    title: "Mains",
    dishes: [
      {
        name: "Hake with mussels and cider",
        description: "From the morning's boats, with new potatoes",
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
    ],
  },
  {
    id: "puddings",
    title: "Puddings",
    dishes: [
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
    ],
  },
]

function Hours({ from, to }: { from: string; to: string }) {
  return (
    <>
      <time dateTime={from}>{from}</time>–<time dateTime={to}>{to}</time>
    </>
  )
}

function DishLetters({ letters }: { letters: Letter[] }) {
  return (
    <p className="mt-2 font-mono text-label text-muted-foreground uppercase">
      {letters.map((letter, i) => {
        const last = i === letters.length - 1
        return (
          <span key={letter}>
            <span aria-hidden="true">{letter}</span>
            <span className="sr-only">
              {letterWords[letter]}
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
    <ul className="mt-4">
      {dishes.map((dish, i) => (
        <li key={dish.name} className={i > 0 ? "mt-6" : undefined}>
          <div className="flex items-baseline gap-2">
            <h4 className="min-w-0 text-h2">{dish.name}</h4>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 border-b border-border"
            />
            <p className="shrink-0 font-mono text-label whitespace-nowrap text-foreground uppercase tabular-nums">
              {dish.price}
            </p>
          </div>
          <p className="mt-2 max-w-xl">{dish.description}</p>
          {dish.letters.length > 0 && <DishLetters letters={dish.letters} />}
        </li>
      ))}
    </ul>
  )
}

function Courses({ courses }: { courses: Course[] }) {
  return (
    <div className="md:col-span-7 md:col-start-6">
      {courses.map((course, i) => (
        <div key={course.id} className={i > 0 ? "mt-12" : undefined}>
          <h3 className="font-mono text-label text-foreground uppercase">
            {course.title}
          </h3>
          <DishList dishes={course.dishes} />
        </div>
      ))}
    </div>
  )
}

const sectionClasses =
  "mt-12 grid grid-cols-1 gap-6 border-t border-border pt-6 md:mt-26 md:grid-cols-12"

export function App() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-4 border-b border-border py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", headerLink)}>
          Kittiwake House
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a
                href="/rooms"
                className={cn("font-mono text-label uppercase", headerLink)}
              >
                Rooms
              </a>
            </li>
            <li>
              <a
                href="/menu"
                aria-current="page"
                className={cn(
                  "font-mono text-label uppercase underline",
                  headerLink
                )}
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href="/#find-us"
                className={cn("font-mono text-label uppercase", headerLink)}
              >
                Find us
              </a>
            </li>
            <li>
              <a
                href="/reserve"
                className={cn("font-mono text-label uppercase", headerLink)}
              >
                Reserve
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="menu-title"
          className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-12 md:items-start"
        >
          <div className="md:col-span-7">
            <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
              Spring menu · From <time dateTime="2027-04-01">1 April 2027</time>
            </p>
            <h1 id="menu-title" className="mt-2 text-h1 lg:text-display">
              Breakfast <span className="italic">and supper</span>
            </h1>
            <p className="mt-4 max-w-xl">
              Breakfast is cooked to order every morning and is included with a
              room. Supper is a short menu on three evenings a week. If you are
              not staying, you are welcome at both, at the prices shown: book
              the day before.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {keyOrder.map((letter) => (
                <div key={letter} className="flex items-baseline gap-2">
                  <dt className="font-mono text-label text-foreground uppercase">
                    {letter}
                  </dt>
                  <dd className="font-mono text-label text-muted-foreground uppercase">
                    {letterWords[letter]}
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
            <h2 className="font-mono text-label uppercase">When we serve</h2>
            <dl className="mt-4">
              <div>
                <dt className="text-body">Breakfast, every day</dt>
                <dd className="mt-2 font-mono text-label uppercase tabular-nums">
                  <Hours from="08:00" to="10:00" />
                </dd>
              </div>
              <div className="mt-4">
                <dt className="text-body">Breakfast on Sundays</dt>
                <dd className="mt-2 font-mono text-label uppercase tabular-nums">
                  <Hours from="08:00" to="10:30" />
                </dd>
              </div>
              <div className="mt-4">
                <dt className="text-body">Supper, Thursday to Saturday</dt>
                <dd className="mt-2 font-mono text-label uppercase tabular-nums">
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
          className={cn(sectionClasses, "md:items-start")}
        >
          <div className="md:col-span-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                Every day · <Hours from="08:00" to="10:00" />
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Included for guests
              </Badge>
            </div>
            <h2 id="breakfast-title" className="mt-2 text-h2 md:text-h1">
              Breakfast
            </h2>
            <p className="mt-4 max-w-xl">
              We serve breakfast on the veranda, and you can order as much or as
              little of it as you like. For guests of the house it comes with
              the room, so the prices do not apply.
            </p>
          </div>
          <Courses courses={breakfastCourses} />
        </section>

        <section
          id="supper"
          aria-labelledby="supper-title"
          className={cn(sectionClasses, "md:items-start")}
        >
          <div className="md:col-span-4">
            <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
              Thursday to Saturday · <Hours from="18:30" to="20:30" />
            </p>
            <h2 id="supper-title" className="mt-2 text-h2 md:text-h1">
              Supper
            </h2>
            <p className="mt-4 max-w-xl">
              Have three courses or just one. Everyone sits at the long table in
              the breakfast room, and the fish comes from that morning's boats.
            </p>
          </div>
          <Courses courses={supperCourses} />
        </section>

        <section aria-labelledby="table-title" className={sectionClasses}>
          <div className="md:col-span-7">
            <p className="font-mono text-label text-muted-foreground uppercase">
              Guests and visitors
            </p>
            <h2 id="table-title" className="mt-2 text-h2 md:text-h1">
              A table for supper
            </h2>
            <p className="mt-4 max-w-xl">
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
              <p className="font-mono text-label text-foreground uppercase tabular-nums">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
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
              <a href="tel:+441632960352" className={headerLink}>
                01632 960 352
              </a>
            </p>
            <p className="mt-2 text-body wrap-break-word">
              <a
                href="mailto:stay@kittiwakehouse.example"
                className={headerLink}
              >
                stay@kittiwakehouse.example
              </a>
            </p>
          </div>
        </div>
        <p className="mt-6 font-mono text-label text-muted-foreground uppercase">
          © 2027 Kittiwake House · Open all year
        </p>
      </footer>
    </div>
  )
}

export default App
