import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const siteLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`

const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focusOutline}`

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

const navLinks = ["Collection", "House", "Appointment"]

const pieces = [
  {
    name: "Lune wrap coat",
    price: "€1,480",
    material: "Undyed wool, horn buckle",
    photograph:
      "A model stands side-on in a long undyed wool wrap coat, belted at the waist, against a pale plaster wall.",
    item: "md:col-start-1 md:col-span-4",
    picture: "aspect-3/4 bg-secondary",
  },
  {
    name: "Ilse pleated skirt",
    price: "€640",
    material: "Black linen, knife pleats",
    photograph:
      "A black linen skirt with narrow knife pleats, photographed from the waist down as the model walks.",
    item: "mt-16 md:col-start-6 md:col-span-3 md:mt-32",
    picture: "aspect-2/3 bg-card",
  },
  {
    name: "Mira silk shirt",
    price: "€520",
    material: "Washed silk, shell buttons",
    photograph:
      "A loose silk shirt the color of skin, buttoned to the collar, on a model seated by a window.",
    item: "mt-16 md:col-start-10 md:col-span-3",
    picture: "aspect-3/4 bg-secondary",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${siteLink}`}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((name) => (
              <li key={name}>
                <a
                  href="#"
                  className={`font-mono text-label uppercase ${siteLink}`}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className={`mt-16 ${grid}`}>
          <h1 className="text-h1 text-foreground md:col-span-10 md:text-display">
            Clothes cut slowly, to be worn for <em>years</em>
          </h1>
          <figure className="mt-16 md:col-span-12 md:grid md:grid-cols-12 md:gap-x-8">
            <div
              role="img"
              aria-label="A model in a long undyed wool wrap coat stands in the empty atelier, turned towards a tall window in grey morning light."
              className="aspect-4/5 w-full bg-secondary md:col-span-8 md:col-start-5 md:row-start-1"
            />
            <figcaption className="mt-2 font-mono text-label uppercase md:col-span-3 md:col-start-2 md:row-start-1 md:mt-0 md:self-end">
              <p className="text-foreground">Look 01 · Still Water</p>
              <p className="mt-1 text-muted-foreground">
                Lune wrap coat, undyed wool
              </p>
              <p className="mt-1 text-muted-foreground">
                Photograph · Tomas Reyl
              </p>
            </figcaption>
          </figure>
        </section>

        <section className={`mt-16 md:mt-32 ${grid}`}>
          <div className="md:col-span-8 md:col-start-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-mono text-label text-muted-foreground uppercase">
                Autumn–Winter 2026
              </p>
              <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                New season
              </Badge>
            </div>
            <h2 className="mt-4 text-h2 text-foreground">
              <em>Still Water</em>
            </h2>
            <p className="mt-4 max-w-md text-foreground">
              Seven looks in undyed wool, black linen and silk the color of
              skin. Each is cut in our atelier in Lyon, in small numbers, from
              cloth woven in Europe.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <h2 className="font-mono text-label text-foreground uppercase">
            From the collection
          </h2>
          <ul className={`mt-8 list-none ${grid}`}>
            {pieces.map((piece) => (
              <li key={piece.name} className={piece.item}>
                <figure>
                  <div
                    role="img"
                    aria-label={piece.photograph}
                    className={`w-full ${piece.picture}`}
                  />
                  <figcaption className="mt-2">
                    <p className="flex items-baseline justify-between gap-4">
                      <a
                        href="#"
                        className={`min-w-0 font-mono text-label uppercase ${textLink}`}
                      >
                        {piece.name}
                      </a>
                      <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                        {piece.price}
                      </span>
                    </p>
                    <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
                      {piece.material}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section className={`mt-16 md:mt-32 ${grid}`}>
          <p className="md:col-span-8 md:col-start-5">
            <a
              href="#"
              className={`inline-flex items-center gap-2 font-mono text-label uppercase ${textLink}`}
            >
              See the whole collection
              <ArrowRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </p>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className={grid}>
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
              {navLinks.map((name, index) => (
                <li key={name} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href="#"
                    className={`font-mono text-label uppercase ${siteLink}`}
                  >
                    {name}
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
