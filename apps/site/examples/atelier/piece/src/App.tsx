import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const SIZES = ["34", "36", "38", "40", "42"]

const NAV_LINKS = ["Collection", "House", "Appointment"]

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

const buttonClasses =
  "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

const fieldClasses =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"

const labelClasses = "block font-mono text-label uppercase text-foreground"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = {
  size?: string
  name?: string
  email?: string
}

type Sent = {
  size: string
  email: string
}

function ErrorLine({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        className="size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
      <a href="/" className={cn("font-heading text-h2", chromeLink)}>
        Maison Ardelle
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className={cn("font-mono text-label uppercase", chromeLink)}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
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
            {NAV_LINKS.map((link, index) => (
              <li key={link} className={index > 0 ? "mt-2" : undefined}>
                <a
                  href="#"
                  className={cn("font-mono text-label uppercase", chromeLink)}
                >
                  {link}
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
  )
}

function Pictures() {
  return (
    <div className="md:col-span-7">
      <figure>
        <div
          role="img"
          aria-label="A tall woman stands facing the camera in a long undyed wool coat, wrapped across the front and tied at the waist, against a pale plaster wall."
          className="aspect-3/4 w-full bg-secondary"
        />
        <figcaption className="mt-2 font-mono text-label uppercase">
          <p className="text-foreground">Front</p>
          <p className="mt-1 text-muted-foreground">
            Worn by Marit Ekwall · 178 <span className="normal-case">cm</span> ·
            Size 36
          </p>
        </figcaption>
      </figure>
      <div className="mt-8 grid grid-cols-2 gap-x-8">
        <figure>
          <div
            role="img"
            aria-label="The same coat seen from behind, falling straight from the shoulders to below the knee, with the belt ends hanging at one side."
            className="aspect-2/3 w-full bg-secondary"
          />
          <figcaption className="mt-2 font-mono text-label uppercase">
            <p className="text-foreground">Back</p>
          </figcaption>
        </figure>
        <figure>
          <div
            role="img"
            aria-label="A close view of the coarse undyed wool where the belt of the same cloth is knotted at the waist."
            className="aspect-2/3 w-full bg-card"
          />
          <figcaption className="mt-2 font-mono text-label uppercase">
            <p className="text-foreground">Detail</p>
            <p className="mt-1 text-muted-foreground">Undyed wool</p>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

export function App() {
  const [size, setSize] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<Sent | null>(null)

  const sizeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) headingRef.current?.focus()
  }, [sent])

  function chooseSize(value: string) {
    setSize(value)
    if (errors.size) setErrors((current) => ({ ...current, size: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}

    if (!size) next.size = "Choose a size above."
    if (!trimmedName) next.name = "Write your name."
    if (!EMAIL_PATTERN.test(trimmedEmail))
      next.email = "Write an email address such as name@example.com."

    setErrors(next)

    if (next.size) {
      sizeRefs.current[0]?.focus()
      return
    }
    if (next.name) {
      document.getElementById("request-name")?.focus()
      return
    }
    if (next.email) {
      document.getElementById("request-email")?.focus()
      return
    }

    setName(trimmedName)
    setEmail(trimmedEmail)
    setNote(note.trim())
    setSent({ size: size as string, email: trimmedEmail })
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <Header />

      <main>
        <section
          aria-labelledby="piece-title"
          className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
        >
          <Pictures />

          <div className="mt-16 md:col-span-4 md:col-start-9 md:mt-0">
            <p className="font-mono text-label text-muted-foreground uppercase">
              Look 03 ·{" "}
              <a href="#" className={textLink}>
                Autumn–Winter 2026
              </a>
            </p>
            <h1 id="piece-title" className="mt-4 text-h1">
              Lune <em>wrap</em> coat
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="font-mono text-body tabular-nums">€1,480</p>
              <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Made to order
              </Badge>
            </div>
            <p className="mt-8 max-w-md">
              Cut long and straight from undyed Biella wool, the Lune has no
              buttons: it crosses over at the front and closes with a belt of
              the same cloth. Tie it at the waist, or wear it open and loose
              over knitwear.
            </p>

            <div className="mt-8">
              <div className="flex items-baseline justify-between gap-4 font-mono text-label uppercase">
                <span id="size-label" className="text-foreground">
                  Size
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {size ? `Chosen · ${size}` : "No size chosen"}
                </span>
              </div>
              <div
                role="group"
                aria-labelledby="size-label"
                aria-describedby={errors.size ? "size-error" : undefined}
                className="mt-2 flex flex-wrap gap-2"
              >
                {SIZES.map((value, index) => {
                  const chosen = value === size
                  return (
                    <Button
                      key={value}
                      ref={(element: HTMLButtonElement | null) => {
                        sizeRefs.current[index] = element
                      }}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen ? "true" : "false"}
                      aria-describedby={errors.size ? "size-error" : undefined}
                      onClick={() => chooseSize(value)}
                      className={cn(
                        "h-auto min-w-16 px-4 py-2 font-mono text-label font-normal uppercase tabular-nums",
                        chosen && "border-foreground"
                      )}
                    >
                      {value}
                    </Button>
                  )
                })}
              </div>
              {errors.size && (
                <ErrorLine id="size-error" message={errors.size} />
              )}
            </div>

            <Button
              aria-expanded={open}
              aria-controls="request-area"
              onClick={() => setOpen((current) => !current)}
              className={cn(
                buttonClasses,
                "mt-8 w-full text-center whitespace-normal"
              )}
            >
              Request this piece
            </Button>

            <div id="request-area" hidden={!open} className="mt-8">
              {!sent && (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="bg-card p-8"
                >
                  <p className="font-mono text-label text-muted-foreground uppercase">
                    Lune wrap coat · {size ? `Size ${size}` : "No size chosen"}
                  </p>
                  <div className="mt-8">
                    <label htmlFor="request-name" className={labelClasses}>
                      Your name
                    </label>
                    <Input
                      id="request-name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={
                        errors.name ? "request-name-error" : undefined
                      }
                      onChange={(event) => {
                        setName(event.target.value)
                        if (errors.name)
                          setErrors((current) => ({
                            ...current,
                            name: undefined,
                          }))
                      }}
                      className={fieldClasses}
                    />
                    {errors.name && (
                      <ErrorLine
                        id="request-name-error"
                        message={errors.name}
                      />
                    )}
                  </div>
                  <div className="mt-8">
                    <label htmlFor="request-email" className={labelClasses}>
                      Email address
                    </label>
                    <Input
                      id="request-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "request-email-error" : undefined
                      }
                      onChange={(event) => {
                        setEmail(event.target.value)
                        if (errors.email)
                          setErrors((current) => ({
                            ...current,
                            email: undefined,
                          }))
                      }}
                      className={fieldClasses}
                    />
                    {errors.email && (
                      <ErrorLine
                        id="request-email-error"
                        message={errors.email}
                      />
                    )}
                  </div>
                  <div className="mt-8">
                    <label htmlFor="request-note" className={labelClasses}>
                      Note (optional)
                    </label>
                    <Textarea
                      id="request-note"
                      name="note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      className={cn(fieldClasses, "min-h-32 resize-none")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      buttonClasses,
                      "mt-8 w-full text-center whitespace-normal"
                    )}
                  >
                    Send request
                  </Button>
                </form>
              )}
              <div role="status">
                {sent && (
                  <div className="bg-card p-8">
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
                    >
                      Request received
                    </h2>
                    <p className="mt-4 max-w-md wrap-break-word">
                      We will write to {sent.email} within two working days
                      about the Lune wrap coat in size {sent.size}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <h2 className="mt-16 font-mono text-label text-foreground uppercase">
              Details
            </h2>
            <dl className="mt-4 border-b border-border">
              {[
                ["Cloth", "Undyed wool, woven in Biella"],
                ["Lining", "Cupro, half-lined"],
                ["Length", "118 cm in size 38"],
                ["Fit", "Cut loose; take your usual size"],
                ["Made in", "Lyon, in our atelier"],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className="font-mono text-label text-muted-foreground uppercase">
                    {term}
                  </dt>
                  <dd className="col-span-2">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-16 font-mono text-label text-foreground uppercase">
              Care
            </h2>
            <ul className="mt-4 list-disc pl-4">
              <li>Dry clean only.</li>
              <li className="mt-2">
                Brush with a soft clothes brush after wearing.
              </li>
              <li className="mt-2">
                Store on a wide wooden hanger, away from light.
              </li>
            </ul>

            <p className="mt-8 max-w-md">
              Each coat is cut and sewn by hand by Odile Varenne and two cutters
              in our atelier on rue Belvèze, in the old silk quarter of Lyon.{" "}
              <a href="#" className={textLink}>
                Visit the house
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
