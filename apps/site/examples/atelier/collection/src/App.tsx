import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

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

const navItems = [
  { label: "Collection", href: "#", current: true },
  { label: "House", href: "#", current: false },
  { label: "Appointment", href: "#", current: false },
]

type Look = {
  number: string
  item: string
  figure?: string
  picture: string
  caption: string
  fill: "bg-secondary" | "bg-card"
  pieces: ReactNode
  model: string
  materials?: string
  description: string
}

const looks: Look[] = [
  {
    number: "01",
    item: "md:col-span-12",
    figure: "md:grid md:grid-cols-12 md:gap-x-8",
    picture: "aspect-4/5 md:col-span-8",
    caption: "md:col-start-9 md:col-span-3 md:mt-0 md:self-end",
    fill: "bg-secondary",
    pieces: "Lune wrap coat · Sorel wide trousers",
    model: "Yara Benali",
    materials: "Undyed wool · Black linen",
    description:
      "Look 01: a model in an undyed wool wrap coat and wide black linen trousers stands at the edge of the drained pool, hands in her pockets, the white tiles running away behind her.",
  },
  {
    number: "02",
    item: "mt-16 md:col-start-2 md:col-span-4 md:mt-32",
    picture: "aspect-3/4",
    caption: "",
    fill: "bg-secondary",
    pieces: "Mira silk shirt · Ilse pleated skirt",
    model: "Marit Ekwall",
    description:
      "Look 02: a model in a skin-colored silk shirt and a long pleated skirt walks down the tiled steps into the empty shallow end, looking down at her feet.",
  },
  {
    number: "03",
    item: "mt-16 md:col-start-8 md:col-span-5 md:mt-16",
    picture: "aspect-2/3",
    caption: "",
    fill: "bg-card",
    pieces: (
      <>
        <a href="#" className={textLink}>
          Lune wrap coat
        </a>{" "}
        · Mira silk shirt
      </>
    ),
    model: "Marit Ekwall",
    description:
      "Look 03: a model in the wool wrap coat over a silk shirt leans against a changing-cabin door, her face turned to the high window and the coat held closed with one hand.",
  },
  {
    number: "04",
    item: "mt-16 md:col-span-12 md:mt-32",
    figure: "md:grid md:grid-cols-12 md:gap-x-8",
    picture: "aspect-4/3 md:col-start-5 md:col-span-8 md:row-start-1",
    caption: "md:col-start-2 md:col-span-3 md:row-start-1 md:mt-0 md:self-end",
    fill: "bg-secondary",
    pieces: "Ren linen shirt-dress · Tove belted cardigan",
    model: "Joon Seo",
    materials: "Black linen · Undyed wool",
    description:
      "Look 04: a model in a black linen shirt-dress and a belted wool cardigan sits on the bottom of the empty deep end, knees drawn up, with the diving board's shadow across the tiles.",
  },
  {
    number: "05",
    item: "mt-16 md:col-start-1 md:col-span-5 md:mt-32",
    picture: "aspect-3/4",
    caption: "",
    fill: "bg-secondary",
    pieces: "Nadia knitted dress",
    model: "Yara Benali",
    description:
      "Look 05: a model in a long undyed knitted dress stands in profile on the pool's edge, arms by her sides, a row of brass shower heads on the wall behind her.",
  },
  {
    number: "06",
    item: "mt-16 md:col-start-7 md:col-span-3 md:mt-32",
    picture: "aspect-2/3",
    caption: "",
    fill: "bg-card",
    pieces: "Tove belted cardigan · Ilse pleated skirt",
    model: "Joon Seo",
    description:
      "Look 06: a model in a wool cardigan tied at the waist and a pleated skirt climbs the pool ladder, one hand on the rail, seen from below.",
  },
  {
    number: "07",
    item: "mt-16 md:col-start-10 md:col-span-3 md:mt-16",
    picture: "aspect-3/4",
    caption: "",
    fill: "bg-secondary",
    pieces: "Sorel wide trousers · Mira silk shirt",
    model: "Yara Benali",
    description:
      "Look 07: a model in wide black linen trousers and a silk shirt walks away down the long gallery above the pool, light from the skylights falling across her back.",
  },
]

const credits = [
  { term: "Photography", value: "Tomas Reyl" },
  { term: "Styling", value: "Anouk Delmas" },
  { term: "Casting", value: "Petra Laine" },
  { term: "Hair and make-up", value: "Sami Okafor" },
  { term: "Models", value: "Yara Benali, Marit Ekwall, Joon Seo" },
  { term: "Location", value: "Bains du Rhône, Lyon" },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
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
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
            Autumn–Winter 2026 · 7 looks
          </p>
          <h1 className="mt-4 text-h1 md:col-span-8 md:text-display">
            <em>Still Water</em>
          </h1>
          <div className="mt-8 md:col-start-5 md:col-span-5">
            <p className="max-w-md">
              We shot the season in September in the Bains du Rhône, the old
              municipal swimming baths on the river in Lyon, drained and closed
              to swimmers since the spring. Tiles, brass and still air: nothing
              to compete with the cloth.
            </p>
            <p className="mt-4 max-w-md">
              Seven looks in undyed wool, black linen and silk the color of
              skin. New this season, the Lune wrap coat is cut from a single
              length of wool with no shoulder seam, so it falls straight from
              the neck and closes with one tie.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <ol
            aria-label="Looks"
            className="grid list-none grid-cols-1 p-0 md:grid-cols-12 md:gap-x-8"
          >
            {looks.map((look) => (
              <li key={look.number} className={look.item}>
                <figure className={look.figure}>
                  <div
                    role="img"
                    aria-label={look.description}
                    className={cn("w-full", look.fill, look.picture)}
                  />
                  <figcaption className={cn("mt-2", label, look.caption)}>
                    <p className="text-foreground">Look {look.number}</p>
                    <p className="mt-1 text-muted-foreground">{look.pieces}</p>
                    <p className="mt-1 text-muted-foreground">
                      Worn by {look.model}
                    </p>
                    {look.materials && (
                      <p className="mt-1 text-muted-foreground">
                        {look.materials}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-start-5 md:col-span-5">
            <h2 className={cn(label, "text-foreground")}>Credits</h2>
            <dl className="mt-4 border-b border-border">
              {credits.map((row) => (
                <div
                  key={row.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={cn(label, "text-muted-foreground")}>
                    {row.term}
                  </dt>
                  <dd className="col-span-2 text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className={cn("mt-8", label)}>
              <a href="#" className={textLink}>
                Book a fitting
              </a>
            </p>
          </div>
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
            className="mt-8 md:col-start-9 md:col-span-4 md:mt-0"
          >
            <ul>
              {navItems.map((item, i) => (
                <li key={item.label} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(
                      label,
                      chromeLink,
                      item.current && "underline"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn("mt-8", label, "text-muted-foreground")}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
