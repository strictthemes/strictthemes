import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const siteLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

const navLinks = [
  { label: "Collection", href: "#", current: false },
  { label: "House", href: "#", current: true },
  { label: "Appointment", href: "#", current: false },
]

const history = [
  {
    year: "2014",
    text: "Inès Ardelle opens the house in two rooms above a print shop, with one cutting table and a first order of wool from Biella.",
  },
  {
    year: "2017",
    text: "The first linen. Tissage Vandamme in Kortrijk weaves a heavy plain cloth for the summer coats.",
  },
  {
    year: "2019",
    text: "The atelier moves to 7 rue Belvèze, where the cutting room, the sewing room and the shop share one floor.",
  },
  {
    year: "2020",
    text: "Tricots Pélissier, a family workshop in Yssingeaux, begins to make the knitwear.",
  },
  {
    year: "2021",
    text: "The first silk. Seteria Olmo in Como prints the linings and the scarves.",
  },
  {
    year: "2026",
    text: "Still Water, the twenty-fourth collection. The mending service opens to every piece the house has made.",
  },
]

const workshops = [
  {
    town: "Lyon",
    text: "The atelier, where eleven people cut, sew, finish and mend every piece under Inès Ardelle.",
    since: "2014",
  },
  {
    town: "Biella",
    text: "Lanificio Serra, a wool mill run by the Serra family, weaves the cloth for coats and suits.",
    since: "2014",
  },
  {
    town: "Kortrijk",
    text: "Tissage Vandamme, a linen weaver led by Lotte Vandamme, makes the summer cloth from Flemish flax.",
    since: "2017",
  },
  {
    town: "Como",
    text: "Seteria Olmo, a silk printer run by Dario Olmo, prints the linings and the scarves by screen.",
    since: "2021",
  },
  {
    town: "Yssingeaux",
    text: "Tricots Pélissier, a family workshop in the Haute-Loire run by Maud Pélissier, knits every jumper and cardigan.",
    since: "2020",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", siteLink)}>
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
                    "font-mono text-label uppercase",
                    siteLink,
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
        <section className={cn(grid, "mt-16")}>
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            The house · Lyon, since <time dateTime="2014">2014</time>
          </p>
          <h1 className="mt-4 text-h1 md:col-span-11 md:text-display">
            We make few clothes, cut them by hand, and mend what we made when
            it <em>wears</em>
          </h1>
        </section>

        <section className={cn(grid, "mt-16 md:mt-32")}>
          <figure className="md:col-span-4">
            <div
              role="img"
              aria-label="Inès Ardelle at the cutting table, a length of grey wool across it, chalk in her hand."
              className="aspect-3/4 w-full bg-secondary"
            />
            <figcaption className="mt-2">
              <p className="font-mono text-label text-foreground uppercase">
                Inès Ardelle, founder
              </p>
              <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
                Photograph · Tomas Reyl, 2026
              </p>
            </figcaption>
          </figure>

          <div className="mt-16 md:col-span-5 md:col-start-6 md:mt-32">
            <p className="max-w-md">
              Inès Ardelle trained as a tailor in Lyon and cut coats for theatre
              for nine years. A stage coat has to survive two hundred
              performances and still hang well from the back row, and she
              wanted to make clothes for the street to the same standard. In
              2014 she rented two rooms above a print shop and opened the house
              with one cutting table.
            </p>
            <p className="mt-4 max-w-md">
              Every piece begins as a paper pattern drawn at that table. The
              cloth is chalked and cut by hand, one layer at a time, so the
              grain runs true and a check meets at every seam. Five cutters and
              tailors, three people in sewing, two in the shop and one in the
              office make up the house today, and a coat passes through most of
              their hands before it leaves.
            </p>
            <p className="mt-4 max-w-md">
              We make two collections a year and never more than four hundred
              pieces of each design. Much of it is cut to order, after someone
              has asked for it. A small number is what eleven people can make
              well, and it means we know where almost every piece has gone.
            </p>
            <p className="mt-4 max-w-md">
              What does not sell is not marked down or destroyed. It goes back
              to the cutting room, where it is altered, recut into a smaller
              piece or kept as cloth for mending. Anything we have made can
              come back to us for repair, whatever its age. The pieces we are
              making now are in{" "}
              <a href="#" className={textLink}>
                the current collection
              </a>
              .
            </p>
          </div>
        </section>

        <section className={cn(grid, "mt-16 md:mt-32")}>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-h2">A short history</h2>
            <ol className="mt-8 list-none border-b border-border">
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
                  <p className="col-span-3 max-w-md text-body">{entry.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={cn(grid, "mt-16 md:mt-32")}>
          <h2 className="text-h2 md:col-span-6">
            Where the clothes are <em>made</em>
          </h2>
          <p className="mt-4 max-w-md text-body md:col-span-5 md:col-start-1">
            The clothes are cut and finished in Lyon from cloth made in three
            mills, and the knitwear is made in a fourth workshop.
          </p>
          <ul className="mt-8 list-none border-b border-border md:col-span-12">
            {workshops.map((workshop) => (
              <li
                key={workshop.town}
                className="border-t border-border py-4 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <h3 className="text-h2 md:col-span-4">{workshop.town}</h3>
                <p className="mt-2 max-w-md text-body md:col-span-5 md:mt-0">
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
        <div className={grid}>
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Maison Ardelle</p>
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
                <li key={link.label} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      "font-mono text-label uppercase",
                      siteLink,
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
