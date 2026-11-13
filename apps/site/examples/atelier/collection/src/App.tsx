import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { name: "Collection", href: "#", current: true },
  { name: "House", href: "#", current: false },
  { name: "Appointment", href: "#", current: false },
]

type Look = {
  number: string
  pieces: ReactNode
  model: string
  materials?: string
  description: string
}

const looks: Look[] = [
  {
    number: "01",
    pieces: "Lune wrap coat · Sorel wide trousers",
    model: "Yara Benali",
    materials: "Undyed wool · Black linen",
    description:
      "Look 01: Yara Benali stands at the shallow end of the drained pool in the undyed wool Lune wrap coat and black Sorel trousers, one hand on the tiled steps, morning light falling from the glass roof.",
  },
  {
    number: "02",
    pieces: "Mira silk shirt · Ilse pleated skirt",
    model: "Marit Ekwall",
    description:
      "Look 02: Marit Ekwall sits on a wooden changing-room bench in the skin-colored Mira silk shirt and the pleated Ilse skirt, her hands folded in her lap, a row of open cubicle doors behind her.",
  },
  {
    number: "03",
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
      "Look 03: Marit Ekwall walks along the edge of the empty pool in the Lune wrap coat worn open over the Mira silk shirt, seen from behind, the white tiles running away to the far wall.",
  },
  {
    number: "04",
    pieces: "Ren linen shirt-dress · Tove belted cardigan",
    model: "Joon Seo",
    materials: "Black linen · Undyed wool",
    description:
      "Look 04: Joon Seo leans against the railing of the upper gallery in the black linen Ren shirt-dress and the belted Tove cardigan, the whole empty basin spread out below.",
  },
  {
    number: "05",
    pieces: "Nadia knitted dress",
    model: "Yara Benali",
    description:
      "Look 05: Yara Benali stands still in the deep end of the dry pool in the long Nadia knitted dress, arms at her sides, the depth markings painted on the tiles above her head.",
  },
  {
    number: "06",
    pieces: "Tove belted cardigan · Ilse pleated skirt",
    model: "Joon Seo",
    description:
      "Look 06: Joon Seo climbs the steel pool ladder in the Tove belted cardigan and the Ilse pleated skirt, looking down, one foot on the bottom rung.",
  },
  {
    number: "07",
    pieces: "Sorel wide trousers · Mira silk shirt",
    model: "Yara Benali",
    description:
      "Look 07: Yara Benali sits on the edge of the pool with her legs hanging over the drop, in the wide Sorel trousers and the Mira silk shirt, framed by a tall arched window.",
  },
]

function Caption({ look, className }: { look: Look; className?: string }) {
  return (
    <figcaption className={cn(label, className)}>
      <p className="text-foreground tabular-nums">Look {look.number}</p>
      <p className="mt-1 text-muted-foreground">{look.pieces}</p>
      <p className="mt-1 text-muted-foreground">Worn by {look.model}</p>
      {look.materials ? (
        <p className="mt-1 text-muted-foreground">{look.materials}</p>
      ) : null}
    </figcaption>
  )
}

function Picture({
  look,
  ratio,
  fill = "bg-secondary",
  className,
}: {
  look: Look
  ratio: string
  fill?: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={look.description}
      className={cn("w-full", ratio, fill, className)}
    />
  )
}

function LookBelow({
  look,
  ratio,
  fill,
  className,
}: {
  look: Look
  ratio: string
  fill?: string
  className: string
}) {
  return (
    <li className={className}>
      <figure>
        <Picture look={look} ratio={ratio} fill={fill} />
        <Caption look={look} className="mt-2" />
      </figure>
    </li>
  )
}

export function App() {
  const [l01, l02, l03, l04, l05, l06, l07] = looks

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, chromeLink, link.current && "underline")}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p
            className={cn(
              label,
              "text-muted-foreground tabular-nums md:col-span-12"
            )}
          >
            Autumn–Winter 2026 · 7 looks
          </p>
          <h1 className="mt-4 text-h1 md:col-span-8 md:text-display">
            <em>Still Water</em>
          </h1>
          <div className="mt-8 md:col-span-5 md:col-start-5">
            <p className="max-w-md">
              We shot the season in the Bains du Rhône, the old public swimming
              baths on the river in Lyon, in September 2026, after the water had
              been let out for the winter. Seven looks, three models and one
              empty pool of white tiles.
            </p>
            <p className="mt-4 max-w-md">
              The clothes are cut from undyed wool, black linen and a silk the
              color of skin, with nothing printed and nothing dyed bright. New
              this season is knitwear: the Nadia dress and the Tove cardigan are
              knitted in our own workshop in Lyon, on a machine we bought this
              spring.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <ol
            aria-label="Looks"
            className="grid list-none grid-cols-1 md:grid-cols-12 md:gap-x-8"
          >
            <li className="md:col-span-12">
              <figure className="md:grid md:grid-cols-12 md:gap-x-8">
                <Picture
                  look={l01}
                  ratio="aspect-4/5"
                  className="md:col-span-8"
                />
                <Caption
                  look={l01}
                  className="mt-2 md:col-span-3 md:col-start-9 md:mt-0 md:self-end"
                />
              </figure>
            </li>

            <LookBelow
              look={l02}
              ratio="aspect-3/4"
              className="mt-16 md:col-span-4 md:col-start-2 md:mt-32"
            />
            <LookBelow
              look={l03}
              ratio="aspect-2/3"
              fill="bg-card"
              className="mt-16 md:col-span-5 md:col-start-8 md:mt-16"
            />

            <li className="mt-16 md:col-span-12 md:mt-32">
              <figure className="md:grid md:grid-cols-12 md:gap-x-8">
                <Picture
                  look={l04}
                  ratio="aspect-4/3"
                  className="md:col-span-8 md:col-start-5 md:row-start-1"
                />
                <Caption
                  look={l04}
                  className="mt-2 md:col-span-3 md:col-start-2 md:row-start-1 md:mt-0 md:self-end"
                />
              </figure>
            </li>

            <LookBelow
              look={l05}
              ratio="aspect-3/4"
              className="mt-16 md:col-span-5 md:col-start-1 md:mt-32"
            />
            <LookBelow
              look={l06}
              ratio="aspect-2/3"
              fill="bg-card"
              className="mt-16 md:col-span-3 md:col-start-7 md:mt-32"
            />
            <LookBelow
              look={l07}
              ratio="aspect-3/4"
              className="mt-16 md:col-span-3 md:col-start-10 md:mt-16"
            />
          </ol>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-5 md:col-start-5">
            <h2 className={cn(label, "text-foreground")}>Credits</h2>
            <dl className="mt-4 border-b border-border">
              {[
                ["Photography", "Tomas Reyl"],
                ["Styling", "Anouk Delmas"],
                ["Casting", "Petra Laine"],
                ["Hair and make-up", "Sami Okafor"],
                ["Models", "Yara Benali, Marit Ekwall, Joon Seo"],
                ["Location", "Bains du Rhône, Lyon"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
                  <dd className="col-span-2 text-body">{value}</dd>
                </div>
              ))}
            </dl>
            <p className={cn(label, "mt-8")}>
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
            <div className={cn("mt-2", label, "text-muted-foreground")}>
              <p className="tabular-nums">7 rue Belvèze</p>
              <p className="tabular-nums">69001 Lyon</p>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.name} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
                      chromeLink,
                      link.current && "underline"
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn("mt-8", label, "text-muted-foreground tabular-nums")}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
