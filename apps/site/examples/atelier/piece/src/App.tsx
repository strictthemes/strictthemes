import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const buttonClass = "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

const fieldClass =
  "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"

const navLinks = [
  { label: "Collection", href: "#" },
  { label: "House", href: "#" },
  { label: "Appointment", href: "#" },
]

const sizes = ["34", "36", "38", "40", "42"]

const details = [
  { term: "Cloth", value: "Undyed wool, woven in Biella" },
  { term: "Lining", value: "Cupro, half-lined" },
  { term: "Length", value: "118 cm in size 38" },
  { term: "Fit", value: "Cut loose; take your usual size" },
  { term: "Made in", value: "Lyon, in our atelier" },
]

const care = [
  "Dry clean only.",
  "Brush after wearing.",
  "Store on a wide hanger.",
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { size?: string; name?: string; email?: string }

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span className="min-w-0 wrap-break-word">{children}</span>
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
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={cn(label, chromeLink)}>
                {link.label}
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
            {navLinks.map((link, i) => (
              <li key={link.label} className={cn(i > 0 && "mt-2")}>
                <a href={link.href} className={cn(label, chromeLink)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className={cn("mt-8 text-muted-foreground", label)}>
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
          aria-label="A tall woman stands facing the camera against a pale wall, wearing the long ecru wrap coat closed with its belt tied at the waist."
          className="aspect-3/4 w-full bg-secondary"
        />
        <figcaption className={cn("mt-2", label)}>
          <p className="text-foreground">Front</p>
          <p className="mt-1 text-muted-foreground tabular-nums">
            Worn by Marit Ekwall · 178 <span className="normal-case">cm</span>{" "}
            · Size 36
          </p>
        </figcaption>
      </figure>
      <div className="mt-8 grid grid-cols-2 gap-x-8">
        <figure>
          <div
            role="img"
            aria-label="The same coat seen from behind, falling straight from the shoulders to below the knee, the belt ends hanging at the side."
            className="aspect-2/3 w-full bg-secondary"
          />
          <figcaption className={cn("mt-2", label)}>
            <p className="text-foreground">Back</p>
          </figcaption>
        </figure>
        <figure>
          <div
            role="img"
            aria-label="A close view of the undyed wool where the belt is knotted, showing the twill of the cloth and the soft edge of the tie."
            className="aspect-2/3 w-full bg-card"
          />
          <figcaption className={cn("mt-2", label)}>
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
  const [sent, setSent] = useState<{ size: string; email: string } | null>(
    null
  )

  const firstSizeRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) confirmRef.current?.focus()
  }, [sent])

  function chooseSize(value: string) {
    setSize(value)
    setErrors((prev) => ({ ...prev, size: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const next: Errors = {}
    if (!size) next.size = "Choose a size above."
    if (!trimmedName) next.name = "Write your name."
    if (!emailPattern.test(trimmedEmail))
      next.email = "Write an email address such as name@example.com."
    setErrors(next)

    if (next.size) firstSizeRef.current?.focus()
    else if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (size) setSent({ size, email: trimmedEmail })
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <Header />
      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <Pictures />

          <div className="mt-16 md:col-span-4 md:col-start-9 md:mt-0">
            <p className={cn("text-muted-foreground tabular-nums", label)}>
              Look 03 ·{" "}
              <a href="#" className={textLink}>
                Autumn–Winter 2026
              </a>
            </p>
            <h1 className="mt-4 text-h1">
              Lune <em>wrap</em> coat
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="font-mono text-body tabular-nums">€1,480</p>
              <Badge className="h-auto rounded-none border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                Made to order
              </Badge>
            </div>
            <p className="mt-8 max-w-md">
              Cut long and without buttons, the coat crosses over at the front
              and is held only by its belt of the same wool. Wear it tied high
              and close, or open over a sweater with the belt left hanging.
            </p>

            <div className="mt-8">
              <div
                className={cn(
                  "flex items-baseline justify-between gap-4 tabular-nums",
                  label
                )}
              >
                <span id="size-label" className="text-foreground">
                  Size
                </span>
                <span className="text-muted-foreground">
                  {size ? `Chosen · ${size}` : "No size chosen"}
                </span>
              </div>
              <div
                role="group"
                aria-labelledby="size-label"
                className="mt-2 flex flex-wrap gap-2"
              >
                {sizes.map((value, i) => {
                  const chosen = value === size
                  return (
                    <Button
                      key={value}
                      ref={i === 0 ? firstSizeRef : undefined}
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
              {errors.size && <ErrorLine id="size-error">{errors.size}</ErrorLine>}
            </div>

            <Button
              aria-expanded={open}
              aria-controls="request-area"
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "mt-8 w-full text-center whitespace-normal",
                buttonClass
              )}
            >
              Request this piece
            </Button>

            <div id="request-area" hidden={!open} className="mt-8">
              {!sent && (
                <form noValidate onSubmit={handleSubmit} className="bg-card p-8">
                  <p className={cn("text-muted-foreground tabular-nums", label)}>
                    Lune wrap coat · {size ? `Size ${size}` : "No size chosen"}
                  </p>
                  <div className="mt-8">
                    <label
                      htmlFor="request-name"
                      className={cn("block text-foreground", label)}
                    >
                      Your name
                    </label>
                    <Input
                      ref={nameRef}
                      id="request-name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "request-name-error" : undefined}
                      onChange={(event) => {
                        setName(event.target.value)
                        setErrors((prev) => ({ ...prev, name: undefined }))
                      }}
                      className={fieldClass}
                    />
                    {errors.name && (
                      <ErrorLine id="request-name-error">{errors.name}</ErrorLine>
                    )}
                  </div>
                  <div className="mt-8">
                    <label
                      htmlFor="request-email"
                      className={cn("block text-foreground", label)}
                    >
                      Email address
                    </label>
                    <Input
                      ref={emailRef}
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
                        setErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      className={fieldClass}
                    />
                    {errors.email && (
                      <ErrorLine id="request-email-error">{errors.email}</ErrorLine>
                    )}
                  </div>
                  <div className="mt-8">
                    <label
                      htmlFor="request-note"
                      className={cn("block text-foreground", label)}
                    >
                      Note (optional)
                    </label>
                    <Textarea
                      id="request-note"
                      name="note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      className={cn(fieldClass, "min-h-32 resize-none")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      "mt-8 w-full text-center whitespace-normal",
                      buttonClass
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
                      ref={confirmRef}
                      tabIndex={-1}
                      className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
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
              {details.map((row) => (
                <div
                  key={row.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={cn("text-muted-foreground", label)}>
                    {row.term}
                  </dt>
                  <dd className="col-span-2 text-body tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-16 font-mono text-label text-foreground uppercase">
              Care
            </h2>
            <ul className="mt-4 list-disc pl-4">
              {care.map((line, i) => (
                <li key={line} className={cn("text-body", i > 0 && "mt-2")}>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md">
              Each coat is cut to order by Inès Ardelle and two tailors in{" "}
              <a href="#" className={textLink}>
                our atelier in Lyon
              </a>
              , and is ready about four weeks after your request.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
