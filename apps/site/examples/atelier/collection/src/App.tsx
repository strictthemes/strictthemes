const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focusRing}`

const navItems = ["Collection", "House", "Appointment"]
const currentPage = "Collection"

type Piece = { name: string; href?: string }

type Look = {
  number: string
  li: string
  figure?: string
  picture: string
  caption: string
  pieces: Piece[]
  wornBy: string
  materials?: string
  alt: string
}

const looks: Look[] = [
  {
    number: "01",
    li: "md:col-span-12",
    figure: "md:grid md:grid-cols-12 md:gap-x-8",
    picture: "aspect-4/5 bg-secondary md:col-span-8",
    caption: "mt-2 md:col-start-9 md:col-span-3 md:mt-0 md:self-end",
    pieces: [{ name: "Lune wrap coat" }, { name: "Sorel wide trousers" }],
    wornBy: "Yara Benali",
    materials: "Undyed wool · Black linen",
    alt: "Look 01: a model in a long undyed wool wrap coat and wide black trousers stands at the edge of the drained pool, hands in her pockets, the tiled wall behind her.",
  },
  {
    number: "02",
    li: "mt-16 md:col-start-2 md:col-span-4 md:mt-32",
    picture: "aspect-3/4 bg-secondary",
    caption: "mt-2",
    pieces: [{ name: "Mira silk shirt" }, { name: "Ilse pleated skirt" }],
    wornBy: "Marit Ekwall",
    alt: "Look 02: a model in a skin-colored silk shirt and a pleated black skirt sits on the steps down into the shallow end, looking away from the camera.",
  },
  {
    number: "03",
    li: "mt-16 md:col-start-8 md:col-span-5 md:mt-16",
    picture: "aspect-2/3 bg-card",
    caption: "mt-2",
    pieces: [{ name: "Lune wrap coat", href: "#" }, { name: "Mira silk shirt" }],
    wornBy: "Marit Ekwall",
    alt: "Look 03: a model walks along the empty pool floor in the wool wrap coat worn open over a silk shirt, light falling from the glass roof.",
  },
  {
    number: "04",
    li: "mt-16 md:col-span-12 md:mt-32",
    figure: "md:grid md:grid-cols-12 md:gap-x-8",
    picture: "aspect-4/3 bg-secondary md:col-start-5 md:col-span-8 md:row-start-1",
    caption: "mt-2 md:col-start-2 md:col-span-3 md:row-start-1 md:mt-0 md:self-end",
    pieces: [{ name: "Ren linen shirt-dress" }, { name: "Tove belted cardigan" }],
    wornBy: "Joon Seo",
    materials: "Black linen · Undyed wool",
    alt: "Look 04: a model in a black linen shirt-dress and a belted wool cardigan leans against a row of changing-cabin doors along the side of the hall.",
  },
  {
    number: "05",
    li: "mt-16 md:col-start-1 md:col-span-5 md:mt-32",
    picture: "aspect-3/4 bg-secondary",
    caption: "mt-2",
    pieces: [{ name: "Nadia knitted dress" }],
    wornBy: "Yara Benali",
    alt: "Look 05: a model in a long undyed knitted dress stands still on the diving board, arms at her sides, seen from below.",
  },
  {
    number: "06",
    li: "mt-16 md:col-start-7 md:col-span-3 md:mt-32",
    picture: "aspect-2/3 bg-card",
    caption: "mt-2",
    pieces: [{ name: "Tove belted cardigan" }, { name: "Sorel wide trousers" }],
    wornBy: "Joon Seo",
    alt: "Look 06: a model in a belted wool cardigan and wide black trousers crouches by a drain in the tiled floor, one hand on the ground.",
  },
  {
    number: "07",
    li: "mt-16 md:col-start-10 md:col-span-3 md:mt-16",
    picture: "aspect-3/4 bg-secondary",
    caption: "mt-2",
    pieces: [{ name: "Ilse pleated skirt" }, { name: "Mira silk shirt" }],
    wornBy: "Yara Benali",
    alt: "Look 07: a model in a pleated black skirt and a skin-colored silk shirt climbs the metal ladder out of the deep end, her back to the camera.",
  },
]

const credits: [string, string][] = [
  ["Photography", "Tomas Reyl"],
  ["Styling", "Anouk Delmas"],
  ["Casting", "Petra Laine"],
  ["Hair and make-up", "Sami Okafor"],
  ["Models", "Yara Benali, Marit Ekwall, Joon Seo"],
  ["Location", "Bains du Rhône, Lyon"],
]

function Pieces({ pieces }: { pieces: Piece[] }) {
  return (
    <p className="mt-1 text-muted-foreground">
      {pieces.map((piece, i) => (
        <span key={piece.name}>
          {i > 0 && " · "}
          {piece.href ? (
            <a href={piece.href} className={textLink}>
              {piece.name}
            </a>
          ) : (
            piece.name
          )}
        </span>
      ))}
    </p>
  )
}

function LookFigure({ look }: { look: Look }) {
  return (
    <li className={look.li}>
      <figure className={look.figure}>
        <div role="img" aria-label={look.alt} className={`w-full ${look.picture}`} />
        <figcaption className={`font-mono text-label uppercase ${look.caption}`}>
          <p className="text-foreground">Look {look.number}</p>
          <Pieces pieces={look.pieces} />
          <p className="mt-1 text-muted-foreground">Worn by {look.wornBy}</p>
          {look.materials && (
            <p className="mt-1 text-muted-foreground">{look.materials}</p>
          )}
        </figcaption>
      </figure>
    </li>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${navLink}`}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  aria-current={item === currentPage ? "page" : undefined}
                  className={`font-mono text-label uppercase ${navLink} ${item === currentPage ? "underline" : ""}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            Autumn–Winter 2026 · 7 looks
          </p>
          <h1 className="mt-4 text-h1 md:col-span-8 md:text-display">
            <em>Still Water</em>
          </h1>
          <div className="mt-8 md:col-start-5 md:col-span-5">
            <p className="max-w-md">
              We shot the collection in September at the Bains du Rhône, the
              swimming baths on the river in Lyon, drained and closed since
              spring. The pool was empty, and so we kept the clothes quiet:
              undyed wool, black linen and a silk the color of skin.
            </p>
            <p className="mt-4 max-w-md">
              New this season is knitwear made in our own workshop on rue
              Belvèze. The Nadia dress and the Tove cardigan are knitted from
              one yarn, spun from a single flock in the Ardèche and left the
              color of the fleece.
            </p>
          </div>
        </section>

        <section aria-label="Looks" className="mt-16 md:mt-32">
          <ol className="grid list-none grid-cols-1 p-0 md:grid-cols-12 md:gap-x-8">
            {looks.map((look) => (
              <LookFigure key={look.number} look={look} />
            ))}
          </ol>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-start-5 md:col-span-5">
            <h2 className="font-mono text-label text-foreground uppercase">
              Credits
            </h2>
            <dl className="mt-4 border-b border-border">
              {credits.map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className="font-mono text-label text-muted-foreground uppercase">
                    {term}
                  </dt>
                  <dd className="col-span-2 text-body">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 font-mono text-label uppercase">
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
                <li key={item} className={i > 0 ? "mt-2" : undefined}>
                  <a
                    href="#"
                    aria-current={item === currentPage ? "page" : undefined}
                    className={`font-mono text-label uppercase ${navLink} ${item === currentPage ? "underline" : ""}`}
                  >
                    {item}
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
