import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = `text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focusOutline}`

const textLink = `text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground transition-colors duration-150 ${focusOutline}`

const navLinks = [
  { label: "Collection", href: "#" },
  { label: "House", href: "#" },
  { label: "Appointment", href: "#" },
]

const pieces = [
  {
    name: "Lune wrap coat",
    price: "€1,480",
    material: "Undyed wool",
    item: "md:col-start-1 md:col-span-4",
    picture: "aspect-3/4 bg-secondary",
    alt: "A long wrap coat in undyed oatmeal wool, photographed from the front on a model standing still, its belt loosely tied at the waist.",
  },
  {
    name: "Ilse pleated skirt",
    price: "€640",
    material: "Black linen",
    item: "mt-16 md:col-start-6 md:col-span-3 md:mt-32",
    picture: "aspect-2/3 bg-card",
    alt: "A black linen skirt with narrow pleats falling to mid-calf, seen from the side as the model takes a step.",
  },
  {
    name: "Mira silk shirt",
    price: "€520",
    material: "Silk",
    item: "mt-16 md:col-start-10 md:col-span-3",
    picture: "aspect-3/4 bg-secondary",
    alt: "A loose silk shirt the color of skin, buttoned to the collar, shown close up with light catching the folds of the sleeve.",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${chromeLink}`}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`font-mono text-label uppercase ${chromeLink}`}
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
          <h1 className="text-h1 md:col-span-10 md:text-display">
            Clothes cut slowly, to be worn for <em>years</em>
          </h1>
          <figure className="mt-16 md:col-span-12 md:col-start-1 md:grid md:grid-cols-12 md:gap-x-8">
            <div
              role="img"
              aria-label="A model stands in a bare white studio wearing a long wrap coat in undyed wool, her face turned away from the camera toward a tall window."
              className="aspect-4/5 w-full bg-secondary md:col-span-8 md:col-start-5 md:row-start-1"
            />
            <figcaption className="mt-2 md:col-span-3 md:col-start-2 md:row-start-1 md:mt-0 md:self-end">
              <p className="font-mono text-label text-foreground uppercase tabular-nums">
                Look 01 · Still Water
              </p>
              <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
                Lune wrap coat, undyed wool
              </p>
              <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
                Photograph · Tomas Reyl
              </p>
            </figcaption>
          </figure>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-8 md:col-start-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
                Autumn–Winter 2026
              </p>
              <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                New season
              </Badge>
            </div>
            <h2 className="mt-4 text-h2">
              <em>Still Water</em>
            </h2>
            <p className="mt-4 max-w-md">
              Seven looks in undyed wool, black linen and silk the color of
              skin, each cut by hand in our atelier in Lyon and made in small
              numbers.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <h2 className="font-mono text-label text-foreground uppercase">
            From the collection
          </h2>
          <ul className="mt-8 grid list-none grid-cols-1 md:grid-cols-12 md:gap-x-8">
            {pieces.map((piece) => (
              <li key={piece.name} className={piece.item}>
                <figure>
                  <div
                    role="img"
                    aria-label={piece.alt}
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

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <p className="md:col-span-8 md:col-start-5">
            <a
              href="#"
              className={`inline-flex items-center gap-2 font-mono text-label uppercase ${textLink}`}
            >
              See the whole collection
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </p>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Maison Ardelle</p>
            <div className="mt-2 font-mono text-label text-muted-foreground uppercase tabular-nums">
              <p>7 rue Belvèze</p>
              <p>69001 Lyon</p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.label} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    className={`font-mono text-label uppercase ${chromeLink}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 font-mono text-label text-muted-foreground uppercase tabular-nums">
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
