import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const navLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const label = "font-mono text-label uppercase"

const navItems = ["Collection", "House", "Appointment"]

const pieces = [
  {
    name: "Lune wrap coat",
    price: "€1,480",
    material: "Undyed wool",
    alt: "A woman stands in a bare white room in a long undyed wool coat, wrapped and tied at the waist, her hands in its pockets.",
    li: "md:col-start-1 md:col-span-4",
    picture: "aspect-3/4 bg-secondary",
  },
  {
    name: "Ilse pleated skirt",
    price: "€640",
    material: "Black linen",
    alt: "A black linen skirt with deep pleats, seen from the side as its wearer walks, the pleats swinging open below the knee.",
    li: "mt-16 md:col-start-6 md:col-span-3 md:mt-32",
    picture: "aspect-2/3 bg-card",
  },
  {
    name: "Mira silk shirt",
    price: "€520",
    material: "Skin-colored silk",
    alt: "A loose shirt in silk the color of skin, hung on a wooden hanger against a plaster wall, with soft light falling across its collar.",
    li: "mt-16 md:col-start-10 md:col-span-3",
    picture: "aspect-3/4 bg-secondary",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(navLink, "font-heading text-h2")}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navItems.map((item) => (
              <li key={item}>
                <a href="#" className={cn(navLink, label)}>
                  {item}
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
          <figure className="mt-16 md:col-span-12 md:grid md:grid-cols-12 md:gap-x-8">
            <div
              role="img"
              aria-label="A woman stands by a tall window in the Lune wrap coat in undyed wool, its collar turned up, looking away from the camera."
              className="aspect-4/5 w-full bg-secondary md:col-span-8 md:col-start-5 md:row-start-1"
            />
            <figcaption className="mt-2 md:col-span-3 md:col-start-2 md:row-start-1 md:mt-0 md:self-end">
              <p className={cn(label, "text-foreground")}>
                Look 01 · Still Water
              </p>
              <p className={cn(label, "mt-1 text-muted-foreground")}>
                Lune wrap coat, undyed wool
              </p>
              <p className={cn(label, "mt-1 text-muted-foreground")}>
                Photograph · Tomas Reyl
              </p>
            </figcaption>
          </figure>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-8 md:col-start-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className={cn(label, "text-muted-foreground")}>
                Autumn–Winter 2026
              </p>
              <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                New season
              </Badge>
            </div>
            <h2 className="mt-4 text-h2">
              <em>Still Water</em>
            </h2>
            <p className="mt-4 max-w-md text-body">
              Seven looks in undyed wool, black linen and silk the color of
              skin, cut and sewn in our atelier in Lyon in small numbers.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <h2 className={cn(label, "text-foreground")}>From the collection</h2>
          <ul className="mt-8 grid list-none grid-cols-1 md:grid-cols-12 md:gap-x-8">
            {pieces.map((piece) => (
              <li key={piece.name} className={piece.li}>
                <figure>
                  <div
                    role="img"
                    aria-label={piece.alt}
                    className={cn("w-full", piece.picture)}
                  />
                  <figcaption className="mt-2">
                    <p className="flex items-baseline justify-between gap-4">
                      <a href="#" className={cn(textLink, label, "min-w-0")}>
                        {piece.name}
                      </a>
                      <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                        {piece.price}
                      </span>
                    </p>
                    <p className={cn(label, "mt-1 text-muted-foreground")}>
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
              className={cn(textLink, label, "inline-flex items-center gap-2")}
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
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
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
              {navItems.map((item, i) => (
                <li key={item} className={i > 0 ? "mt-2" : undefined}>
                  <a href="#" className={cn(navLink, label)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
