import type { ReactNode } from "react"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusOutline}`

const textLink = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${focusOutline}`

const pages = [
  { name: "Collection", current: true },
  { name: "House", current: false },
  { name: "Appointment", current: false },
]

const credits = [
  { term: "Photography", detail: "Tomas Reyl" },
  { term: "Styling", detail: "Anouk Delmas" },
  { term: "Casting", detail: "Petra Laine" },
  { term: "Hair and make-up", detail: "Sami Okafor" },
  { term: "Models", detail: "Yara Benali, Marit Ekwall, Joon Seo" },
  { term: "Location", detail: "Bains du Rhône, Lyon" },
]

function Picture({ className, label }: { className: string; label: string }) {
  return <div role="img" aria-label={label} className={`w-full ${className}`} />
}

function CaptionLines({
  look,
  pieces,
  wornBy,
  materials,
}: {
  look: string
  pieces: ReactNode
  wornBy: string
  materials?: string
}) {
  return (
    <>
      <p className="font-mono text-label text-foreground uppercase">
        Look {look}
      </p>
      <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
        {pieces}
      </p>
      <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
        Worn by {wornBy}
      </p>
      {materials ? (
        <p className="mt-1 font-mono text-label text-muted-foreground uppercase">
          {materials}
        </p>
      ) : null}
    </>
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
            {pages.map((page) => (
              <li key={page.name}>
                <a
                  href="#"
                  aria-current={page.current ? "page" : undefined}
                  className={`font-mono text-label uppercase ${navLink}${page.current ? " underline" : ""}`}
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
          <p className="font-mono text-label text-muted-foreground uppercase md:col-span-12">
            Autumn–Winter 2026 · 7 looks
          </p>
          <h1 className="mt-4 text-h1 md:col-span-8 md:text-display">
            <em>Still Water</em>
          </h1>
          <div className="mt-8 md:col-span-5 md:col-start-5">
            <p className="max-w-md">
              We shot Still Water over two days in September, in the Bains du
              Rhône in Lyon. The baths have been drained since the spring, and
              the tiles still hold the light the way the water did. Seven looks
              stand on the floor of the deep end, where nobody has stood before.
            </p>
            <p className="mt-4 max-w-md">
              The clothes are cut from three cloths: wool left undyed, the
              color the sheep gave it; black linen; and silk the color of skin.
              New this season is the Lune wrap coat, our first coat without a
              single button. It closes with one tie at the left hip and nothing
              else.
            </p>
          </div>
        </section>

        <section className="mt-16 md:mt-32">
          <ol className="grid list-none grid-cols-1 md:grid-cols-12 md:gap-x-8">
            <li className="md:col-span-12">
              <figure className="md:grid md:grid-cols-12 md:gap-x-8">
                <Picture
                  className="aspect-4/5 bg-secondary md:col-span-8"
                  label="Look 01: Yara Benali stands at the foot of the pool ladder in the undyed Lune wrap coat over black Sorel wide trousers, hands in the coat's pockets, the tiled wall of the empty baths behind her."
                />
                <figcaption className="mt-2 md:col-span-3 md:col-start-9 md:mt-0 md:self-end">
                  <CaptionLines
                    look="01"
                    pieces="Lune wrap coat · Sorel wide trousers"
                    wornBy="Yara Benali"
                    materials="Undyed wool · Black linen"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-4 md:col-start-2 md:mt-32">
              <figure>
                <Picture
                  className="aspect-3/4 bg-secondary"
                  label="Look 02: Joon Seo sits on the edge of the drained pool in the Nadia knitted dress, legs hanging over the side, looking down at the painted lane lines."
                />
                <figcaption className="mt-2">
                  <CaptionLines
                    look="02"
                    pieces="Nadia knitted dress"
                    wornBy="Joon Seo"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-5 md:col-start-8">
              <figure>
                <Picture
                  className="aspect-2/3 bg-card"
                  label="Look 03: Marit Ekwall walks up the shallow steps in the Lune wrap coat, left open over the Mira silk shirt, one hand on the steel rail, daylight falling from the glass roof."
                />
                <figcaption className="mt-2">
                  <CaptionLines
                    look="03"
                    pieces={
                      <>
                        <a href="#" className={textLink}>
                          Lune wrap coat
                        </a>{" "}
                        · Mira silk shirt
                      </>
                    }
                    wornBy="Marit Ekwall"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-12 md:mt-32">
              <figure className="md:grid md:grid-cols-12 md:gap-x-8">
                <Picture
                  className="aspect-4/3 bg-secondary md:col-span-8 md:col-start-5 md:row-start-1"
                  label="Look 04: Joon Seo lies on his back on the floor of the deep end in the black Ren linen shirt-dress and the undyed Tove belted cardigan, arms spread, seen from the gallery above."
                />
                <figcaption className="mt-2 md:col-span-3 md:col-start-2 md:row-start-1 md:mt-0 md:self-end">
                  <CaptionLines
                    look="04"
                    pieces="Ren linen shirt-dress · Tove belted cardigan"
                    wornBy="Joon Seo"
                    materials="Black linen · Undyed wool"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-5 md:col-start-1 md:mt-32">
              <figure>
                <Picture
                  className="aspect-3/4 bg-secondary"
                  label="Look 05: Yara Benali leans against a row of wooden changing cabins in the Mira silk shirt tucked into the Ilse pleated skirt, arms crossed, her head turned to the window."
                />
                <figcaption className="mt-2">
                  <CaptionLines
                    look="05"
                    pieces="Mira silk shirt · Ilse pleated skirt"
                    wornBy="Yara Benali"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-3 md:col-start-7 md:mt-32">
              <figure>
                <Picture
                  className="aspect-2/3 bg-card"
                  label="Look 06: Marit Ekwall stands on the low diving board in the Tove belted cardigan and Sorel wide trousers, seen from the side, the empty pool below her."
                />
                <figcaption className="mt-2">
                  <CaptionLines
                    look="06"
                    pieces="Tove belted cardigan · Sorel wide trousers"
                    wornBy="Marit Ekwall"
                  />
                </figcaption>
              </figure>
            </li>

            <li className="mt-16 md:col-span-3 md:col-start-10">
              <figure>
                <Picture
                  className="aspect-3/4 bg-secondary"
                  label="Look 07: Yara Benali crouches by the pool's brass drain in the Ren linen shirt-dress, sleeves rolled to the elbow, one hand flat on the tiles."
                />
                <figcaption className="mt-2">
                  <CaptionLines
                    look="07"
                    pieces="Ren linen shirt-dress"
                    wornBy="Yara Benali"
                  />
                </figcaption>
              </figure>
            </li>
          </ol>
        </section>

        <section className="mt-16 grid grid-cols-1 md:mt-32 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-5 md:col-start-5">
            <h2 className="font-mono text-label text-foreground uppercase">
              Credits
            </h2>
            <dl className="mt-4 border-b border-border">
              {credits.map((credit) => (
                <div
                  key={credit.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className="font-mono text-label text-muted-foreground uppercase">
                    {credit.term}
                  </dt>
                  <dd className="col-span-2 text-body">{credit.detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <a
                href="#"
                className={`font-mono text-label uppercase ${textLink}`}
              >
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
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {pages.map((page, index) => (
                <li key={page.name} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href="#"
                    aria-current={page.current ? "page" : undefined}
                    className={`font-mono text-label uppercase ${navLink}${page.current ? " underline" : ""}`}
                  >
                    {page.name}
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
