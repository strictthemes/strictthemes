import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const pages = [
  { label: "Collection", href: "#" },
  { label: "House", href: "#", current: true },
  { label: "Appointment", href: "#" },
]

const history = [
  {
    year: "2014",
    text: "Inès Ardelle opens the house in two rooms above a print shop in Lyon. The first wool comes from Lanificio Serra in Biella.",
  },
  {
    year: "2017",
    text: "The first linen arrives from Tissage Vandamme in Kortrijk, for a summer of shirts and wide trousers.",
  },
  {
    year: "2019",
    text: "The atelier moves to 7 rue Belvèze, with the shop at the front and the cutting tables behind it.",
  },
  {
    year: "2020",
    text: "Tricots Pélissier, a family workshop in Yssingeaux, starts knitting the house's jumpers and cardigans.",
  },
  {
    year: "2021",
    text: "Seteria Olmo in Como prints the house's first silk, for scarves and the linings of its coats.",
  },
  {
    year: "2026",
    text: "The collection Still Water comes out, and the shop starts mending any piece the house has ever made.",
  },
]

const workshops = [
  {
    town: "Lyon",
    text: "The atelier, where every piece is cut, sewn and finished by eleven people, run by Inès Ardelle.",
    since: "2014",
  },
  {
    town: "Biella",
    text: "Lanificio Serra, a wool mill run by Paola Serra, weaves the cloth for the coats and suits.",
    since: "2014",
  },
  {
    town: "Kortrijk",
    text: "Tissage Vandamme, a linen weaver run by Pieter Vandamme, makes the cloth for the summer pieces.",
    since: "2017",
  },
  {
    town: "Yssingeaux",
    text: "Tricots Pélissier, a family workshop in the Haute-Loire run by Martine Pélissier, knits the jumpers and cardigans.",
    since: "2020",
  },
  {
    town: "Como",
    text: "Seteria Olmo, a silk printer run by Giulia Olmo, prints the scarves and the linings.",
    since: "2021",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", navLink)}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {pages.map((page) => (
              <li key={page.label}>
                <a
                  href={page.href}
                  aria-current={page.current ? "page" : undefined}
                  className={cn(
                    "font-mono text-label uppercase",
                    navLink,
                    page.current && "underline"
                  )}
                >
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label uppercase tabular-nums text-muted-foreground md:col-span-12">
            The house · Lyon, since <time dateTime="2014">2014</time>
          </p>
          <h1 className="mt-4 text-h1 text-foreground md:col-span-11 md:text-display">
            We make few clothes, cut them by hand, and mend what we made when it{" "}
            <em>wears</em>
          </h1>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <figure className="md:col-span-4">
            <div
              role="img"
              aria-label="Inès Ardelle at the cutting table, a length of grey wool across it, chalk in her hand"
              className="aspect-3/4 w-full bg-secondary"
            />
            <figcaption className="mt-2 font-mono text-label uppercase">
              <p className="text-foreground">Inès Ardelle, founder</p>
              <p className="mt-1 tabular-nums text-muted-foreground">
                Photograph · Tomas Reyl, 2026
              </p>
            </figcaption>
          </figure>

          <div className="mt-16 md:col-span-5 md:col-start-6 md:mt-32">
            <p className="max-w-md text-foreground">
              Inès Ardelle trained as a tailor in Lyon and spent nine years
              cutting coats for the theatre, where a costume has to last a
              hundred nights and still hang right from the back row. In 2014 she
              opened the house in two rooms above a print shop, with one cutting
              table and a steam press.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              Every piece starts as a paper pattern drafted at the atelier on rue
              Belvèze. A cutter lays the cloth out by hand and chalks each part;
              a tailor bastes it, fits it and finishes it. Much of each collection
              is cut to order, to the measurements of the person who will wear
              it. Eleven people do this work: five cutters and tailors, three in
              sewing, two in the shop and one in the office.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              We make two collections a year and never more than four hundred
              pieces of each design. A small run lets us buy cloth from mills we
              know by name, keep the same hands at the same tables, and stop a
              design when it is finished rather than when it sells out.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              What does not sell is not burned or sent to an outlet. It stays in
              the shop at the next season's price, and the offcuts become
              facings, pockets and the patches we mend with. Bring back anything
              we made, whatever its age, or see what is in{" "}
              <a href="#" className={textLink}>
                the current collection
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-h2 text-foreground">A short history</h2>
            <ol className="mt-8 list-none border-b border-border">
              {history.map((entry) => (
                <li
                  key={entry.year}
                  className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <time
                    dateTime={entry.year}
                    className="font-mono text-label uppercase tabular-nums text-muted-foreground"
                  >
                    {entry.year}
                  </time>
                  <p className="col-span-3 text-body text-foreground">
                    {entry.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <h2 className="text-h2 text-foreground md:col-span-6">
            Where the clothes are <em>made</em>
          </h2>
          <p className="mt-4 max-w-md text-foreground md:col-span-5 md:col-start-1">
            Every piece is cut and finished in Lyon, from cloth made in three
            mills in Italy and Belgium, and the knitwear comes from a fourth
            workshop in the Haute-Loire.
          </p>
          <ul className="mt-8 list-none border-b border-border md:col-span-12">
            {workshops.map((place) => (
              <li
                key={place.town}
                className="border-t border-border py-4 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 text-foreground md:col-span-4">
                  {place.town}
                </h3>
                <p className="mt-2 max-w-md text-foreground md:col-span-5 md:mt-0">
                  {place.text}
                </p>
                <p className="mt-2 font-mono text-label uppercase tabular-nums text-muted-foreground md:col-span-3 md:mt-0">
                  Since <time dateTime={place.since}>{place.since}</time>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2 text-foreground">
              Maison Ardelle
            </p>
            <div className="mt-2 font-mono text-label uppercase tabular-nums text-muted-foreground">
              <p>7 rue Belvèze</p>
              <p>69001 Lyon</p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {pages.map((page, i) => (
                <li key={page.label} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={page.href}
                    aria-current={page.current ? "page" : undefined}
                    className={cn(
                      "font-mono text-label uppercase",
                      navLink,
                      page.current && "underline"
                    )}
                  >
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 font-mono text-label uppercase tabular-nums text-muted-foreground">
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
