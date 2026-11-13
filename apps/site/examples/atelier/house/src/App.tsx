import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

const navLinks = [
  { label: "Collection", href: "#", current: false },
  { label: "House", href: "#", current: true },
  { label: "Appointment", href: "#", current: false },
]

const history = [
  {
    year: "2014",
    text: "Inès Ardelle opens the house in two rooms above a print shop, with one cutting table and a borrowed sewing machine.",
  },
  {
    year: "2017",
    text: "The first linen arrives from Kortrijk, and the house makes its first summer collection.",
  },
  {
    year: "2019",
    text: "The atelier moves to 7 rue Belvèze, with room for the cutting tables, the sewing room and a shop on the ground floor.",
  },
  {
    year: "2020",
    text: "A family workshop in Yssingeaux starts knitting the house's jumpers and cardigans.",
  },
  {
    year: "2021",
    text: "The first printed silk comes from Como, for scarves and the linings of the coats.",
  },
  {
    year: "2026",
    text: "The house shows Still Water and opens a mending service for every piece it has made since 2014.",
  },
]

const workshops = [
  {
    town: "Lyon",
    text: "Our own atelier at 7 rue Belvèze, run by Inès Ardelle, where every piece is cut, sewn and finished.",
    since: "2014",
  },
  {
    town: "Biella",
    text: "Lanificio Serra, a wool mill run by Paola Serra, weaves the wools for our coats, jackets and trousers.",
    since: "2014",
  },
  {
    town: "Kortrijk",
    text: "Tissage Vandamme, a linen weaver run by Pieter Vandamme, weaves the linen for our shirts and summer suits.",
    since: "2017",
  },
  {
    town: "Como",
    text: "Seteria Olmo, a silk printer run by Giulia Olmo, prints the silk for our scarves and coat linings.",
    since: "2021",
  },
  {
    town: "Yssingeaux",
    text: "Tricots Pélissier, a family workshop run by Martine Pélissier and her son, knits our jumpers and cardigans.",
    since: "2020",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(chromeLink, "font-heading text-h2")}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(
                    chromeLink,
                    "font-mono text-label uppercase",
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
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            The house · Lyon, since 2014
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
              <p className="mt-1 text-muted-foreground">
                Photograph · Tomas Reyl, 2026
              </p>
            </figcaption>
          </figure>

          <div className="mt-16 md:col-span-5 md:col-start-6 md:mt-32">
            <p className="max-w-md text-foreground">
              Inès Ardelle trained as a tailor in Lyon and spent nine years
              cutting coats for the theatre, where a costume has to survive two
              hundred nights and still fit the actor on the last one. In 2014
              she opened the house in two rooms above a print shop, with one
              cutting table and a list of twelve clients. Eleven people work
              here now.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              A coat starts as a paper pattern and a length of cloth laid out on
              the table. It is cut by hand, with chalk and shears, by one of our
              five cutters, then sewn in the room next door and pressed at every
              seam. Much of what we make is cut to order, to the measurements of
              the person who will wear it, and takes three to six weeks.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              We make two collections a year, and never more than four hundred
              pieces of any design. That is roughly what eleven people can make
              well, from cloth that four mills and workshops can supply without
              rushing. When a design sells out, we do not make more of it.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              What we do not sell stays in the shop for the next season, and
              what is left after that is taken apart and its cloth cut into
              smaller pieces. Everything we have made can come back to the
              atelier to be mended, at any age. You can see what we make now in
              the{" "}
              <a href="#" className={textLink}>
                current collection
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-h2 text-foreground">A short history</h2>
            <ol className="mt-8 list-none border-b border-border p-0">
              {history.map((entry) => (
                <li
                  key={entry.year}
                  className="grid grid-cols-4 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <time
                    dateTime={entry.year}
                    className="font-mono text-label text-muted-foreground uppercase tabular-nums"
                  >
                    {entry.year}
                  </time>
                  <p className="col-span-3 max-w-md text-body text-foreground">
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
            mills in Italy and Belgium, and our knitwear is made in a fourth
            workshop in the Haute-Loire.
          </p>
          <ul className="mt-8 list-none border-b border-border p-0 md:col-span-12">
            {workshops.map((workshop) => (
              <li
                key={workshop.town}
                className="border-t border-border py-4 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 text-foreground md:col-span-4">
                  {workshop.town}
                </h3>
                <p className="mt-2 max-w-md text-body text-foreground md:col-span-5 md:mt-0">
                  {workshop.text}
                </p>
                <p className="mt-2 font-mono text-label text-muted-foreground uppercase tabular-nums md:col-span-3 md:mt-0">
                  Since <time dateTime={workshop.since}>{workshop.since}</time>
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
            <div className="mt-2 font-mono text-label text-muted-foreground uppercase">
              <p>7 rue Belvèze</p>
              <p>69001 Lyon</p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link, index) => (
                <li key={link.label} className={cn(index > 0 && "mt-2")}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      chromeLink,
                      "font-mono text-label uppercase",
                      link.current && "underline"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 font-mono text-label text-muted-foreground uppercase">
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
