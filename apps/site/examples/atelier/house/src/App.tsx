const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = `text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focus}`

const textLink = `text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors duration-150 ${focus}`

const label = "font-mono text-label uppercase"

const pages = [
  { name: "Collection", href: "#" },
  { name: "House", href: "#", current: true },
  { name: "Appointment", href: "#" },
]

const history = [
  {
    year: "2014",
    text: "Inès Ardelle opens the house in two rooms above a print shop, with one cutting table and wool from Biella.",
  },
  {
    year: "2017",
    text: "The first linen arrives from Kortrijk, and the house makes its first summer collection.",
  },
  {
    year: "2019",
    text: "The atelier moves to 7 rue Belvèze, with room for the cutters, the sewing room and a shop at the front.",
  },
  {
    year: "2020",
    text: "Tricots Pélissier in Yssingeaux starts knitting the house's jumpers and cardigans.",
  },
  {
    year: "2021",
    text: "Seteria Olmo in Como prints the first silk from drawings made in the atelier.",
  },
  {
    year: "2026",
    text: "The house shows Still Water and opens a mending service for every piece it has made.",
  },
]

const workshops = [
  {
    town: "Lyon",
    text: "Our atelier at 7 rue Belvèze, where eleven people cut, sew and finish every piece.",
    since: "2014",
  },
  {
    town: "Biella",
    text: "Lanificio Serra, a wool mill, weaves the cloth for our coats, jackets and trousers.",
    since: "2014",
  },
  {
    town: "Kortrijk",
    text: "Tissage Vandamme, a linen weaver, makes the cloth for our shirts and summer dresses.",
    since: "2017",
  },
  {
    town: "Como",
    text: "Seteria Olmo, a silk printer, prints our scarves and blouses from drawings made in Lyon.",
    since: "2021",
  },
  {
    town: "Yssingeaux",
    text: "Tricots Pélissier, a family workshop in the Haute-Loire, knits our jumpers and cardigans.",
    since: "2020",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${navLink}`}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {pages.map((page) => (
              <li key={page.name}>
                <a
                  href={page.href}
                  aria-current={page.current ? "page" : undefined}
                  className={`${label} ${navLink} ${page.current ? "underline" : ""}`}
                >
                  {page.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className={`${label} text-muted-foreground md:col-span-12`}>
            The house · Lyon, since <time dateTime="2014">2014</time>
          </p>
          <h1 className="mt-4 text-h1 text-foreground md:col-span-11 md:text-display">
            We make few clothes, cut them by hand, and mend what we made when
            it <em>wears</em>
          </h1>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <figure className="md:col-span-4">
            <div
              role="img"
              aria-label="Inès Ardelle at the cutting table, a length of grey wool across it, chalk in her hand"
              className="aspect-3/4 w-full bg-secondary"
            />
            <figcaption className={`mt-2 ${label}`}>
              <p className="text-foreground">Inès Ardelle, founder</p>
              <p className="mt-1 text-muted-foreground">
                Photograph · Tomas Reyl, 2026
              </p>
            </figcaption>
          </figure>

          <div className="mt-16 md:col-span-5 md:col-start-6 md:mt-32">
            <p className="max-w-md text-foreground">
              Inès Ardelle trained as a tailor in Lyon and spent nine years
              cutting coats for the theatre. In 2014 she opened the house in two
              rooms above a print shop, with one table, one machine and a roll
              of grey wool.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              A piece starts as a paper pattern and a toile in calico. Once the
              shape is right, a cutter chalks it onto the cloth and cuts it by
              hand, and the same tailor follows it through the sewing room until
              the last buttonhole is finished.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              We make two collections a year and never more than four hundred
              pieces of each design. Much of it is cut to order, so we buy only
              the cloth we need and nothing waits in a warehouse for a sale.
            </p>
            <p className="mt-4 max-w-md text-foreground">
              What we do not sell stays in the shop for the next season, and
              any leftover cloth goes into linings and pockets. Every piece we
              made can come back to the atelier to be mended. You can see what
              we make now in the{" "}
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
                    className={`${label} text-muted-foreground tabular-nums`}
                  >
                    {entry.year}
                  </time>
                  <p className="col-span-3 text-foreground">{entry.text}</p>
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
            Every piece is cut and finished in Lyon from cloth made in three
            mills, and the knitwear is made in a fourth workshop.
          </p>
          <ul className="mt-8 list-none border-b border-border p-0 md:col-span-12">
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
                <p
                  className={`mt-2 ${label} text-muted-foreground tabular-nums md:col-span-3 md:mt-0`}
                >
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
            <div className={`mt-2 ${label} text-muted-foreground`}>
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
                <li key={page.name} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={page.href}
                    aria-current={page.current ? "page" : undefined}
                    className={`${label} ${navLink} ${page.current ? "underline" : ""}`}
                  >
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={`mt-8 ${label} text-muted-foreground`}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
