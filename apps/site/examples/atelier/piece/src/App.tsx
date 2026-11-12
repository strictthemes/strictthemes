import { useRef, useState, type FormEvent, type ReactNode } from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const SIZES = ["34", "36", "38", "40", "42"]
const NAV = ["Collection", "House", "Appointment"]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const label = "font-mono text-label uppercase"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)
const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClass = "h-auto px-8 py-4 font-mono text-label font-normal uppercase"
const sizeButtonClass =
  "h-auto min-w-16 px-4 py-2 font-mono text-label font-normal uppercase tabular-nums"
const fieldClass = "mt-2 h-auto border-muted-foreground px-4 py-2 text-body md:text-body"
const fieldLabel = cn("block text-foreground", label)

type Errors = { size?: string; name?: string; email?: string }

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function Picture({
  ratio,
  fill = "bg-secondary",
  alt,
  lines,
  className,
}: {
  ratio: string
  fill?: string
  alt: string
  lines: ReactNode[]
  className?: string
}) {
  return (
    <figure className={className}>
      <div role="img" aria-label={alt} className={cn("w-full", ratio, fill)} />
      <figcaption className={cn("mt-2", label)}>
        {lines.map((line, i) => (
          <p
            key={i}
            className={i === 0 ? "text-foreground" : "mt-1 text-muted-foreground"}
          >
            {line}
          </p>
        ))}
      </figcaption>
    </figure>
  )
}

export function App() {
  const [size, setSize] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [received, setReceived] = useState<{ size: string; email: string } | null>(
    null
  )

  const firstSizeRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  function chooseSize(value: string) {
    setSize(value)
    setErrors((e) => ({ ...e, size: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (!size) next.size = "Choose a size above."
    if (!name.trim()) next.name = "Write your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Write an email address such as name@example.com."
    flushSync(() => setErrors(next))
    if (next.size) return firstSizeRef.current?.focus()
    if (next.name) return nameRef.current?.focus()
    if (next.email) return emailRef.current?.focus()
    flushSync(() => setReceived({ size: size!, email: email.trim() }))
    confirmRef.current?.focus()
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV.map((item) => (
              <li key={item}>
                <a href="#" className={cn(label, chromeLink)}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7">
            <Picture
              ratio="aspect-3/4"
              alt="A woman stands in a pale studio wearing a long undyed wool coat, wrapped and tied at the waist with a belt of the same cloth."
              lines={[
                "Front",
                <>
                  Worn by Marit Ekwall · 178 <span className="normal-case">cm</span> ·
                  Size 36
                </>,
              ]}
            />
            <div className="mt-8 grid grid-cols-2 gap-x-8">
              <Picture
                ratio="aspect-2/3"
                alt="The same coat from behind, falling straight from the shoulders to below the knee, the belt ends hanging at the side."
                lines={["Back"]}
              />
              <Picture
                ratio="aspect-2/3"
                fill="bg-card"
                alt="A close view of the coarse undyed wool where the belt is knotted over the overlapping front panels."
                lines={["Detail", "Undyed wool"]}
              />
            </div>
          </div>

          <div className="mt-16 md:col-span-4 md:col-start-9 md:mt-0">
            <p className={cn(label, "text-muted-foreground")}>
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
            <p className="mt-8 max-w-md text-body">
              A long coat cut in one piece from shoulder to hem, with no buttons. It
              crosses over at the front and closes with a belt of the same cloth,
              tied as loose or as close as you like.
            </p>

            <div className="mt-8">
              <div className={cn("flex items-baseline justify-between gap-4", label)}>
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
                {SIZES.map((value, i) => {
                  const chosen = size === value
                  return (
                    <Button
                      key={value}
                      ref={i === 0 ? firstSizeRef : undefined}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      aria-describedby={errors.size ? "size-error" : undefined}
                      className={cn(sizeButtonClass, chosen && "border-foreground")}
                      onClick={() => chooseSize(value)}
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
              className={cn(buttonClass, "mt-8 w-full text-center whitespace-normal")}
              onClick={() => setOpen((o) => !o)}
            >
              Request this piece
            </Button>

            <div id="request-area" hidden={!open} className="mt-8">
              {!received && (
                <form noValidate onSubmit={handleSubmit} className="bg-card p-8">
                  <p className={cn(label, "text-muted-foreground")}>
                    Lune wrap coat · {size ? `Size ${size}` : "No size chosen"}
                  </p>
                  <div className="mt-8">
                    <label htmlFor="name" className={fieldLabel}>
                      Your name
                    </label>
                    <Input
                      ref={nameRef}
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      onChange={(e) => {
                        setName(e.target.value)
                        setErrors((x) => ({ ...x, name: undefined }))
                      }}
                      className={fieldClass}
                    />
                    {errors.name && <ErrorLine id="name-error">{errors.name}</ErrorLine>}
                  </div>
                  <div className="mt-8">
                    <label htmlFor="email" className={fieldLabel}>
                      Email address
                    </label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setErrors((x) => ({ ...x, email: undefined }))
                      }}
                      className={fieldClass}
                    />
                    {errors.email && (
                      <ErrorLine id="email-error">{errors.email}</ErrorLine>
                    )}
                  </div>
                  <div className="mt-8">
                    <label htmlFor="note" className={fieldLabel}>
                      Note (optional)
                    </label>
                    <Textarea
                      id="note"
                      name="note"
                      value={note}
                      placeholder="Questions about fit or length"
                      onChange={(e) => setNote(e.target.value)}
                      className={cn(fieldClass, "min-h-32")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(buttonClass, "mt-8 w-full text-center whitespace-normal")}
                  >
                    Send request
                  </Button>
                </form>
              )}
              <div role="status">
                {received && (
                  <div className="bg-card p-8">
                    <h2 ref={confirmRef} tabIndex={-1} className={cn("text-h2", codeFocusRing)}>
                      Request received
                    </h2>
                    <p className="mt-4 max-w-md text-body">
                      We will write to {received.email} within two working days about
                      the Lune wrap coat in size {received.size}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <h2 className={cn("mt-16 text-foreground", label)}>Details</h2>
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
                  <dt className={cn(label, "text-muted-foreground")}>{term}</dt>
                  <dd className="col-span-2 text-body">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className={cn("mt-16 text-foreground", label)}>Care</h2>
            <ul className="mt-4 list-disc pl-4 text-body">
              {[
                "Dry clean only.",
                "Brush with a soft clothes brush after wearing.",
                "Store on a wide wooden hanger.",
              ].map((line, i) => (
                <li key={line} className={i > 0 ? "mt-2" : undefined}>
                  {line}
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-md text-body">
              Every coat is cut and sewn by hand by the four tailors of{" "}
              <a href="#" className={textLink}>
                our atelier in Lyon
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Maison Ardelle</p>
            <div className={cn("mt-2 text-muted-foreground", label)}>
              <p>7 rue Belvèze</p>
              <p>69001 Lyon</p>
            </div>
          </div>
          <nav aria-label="Footer" className="mt-8 md:col-span-4 md:col-start-9 md:mt-0">
            <ul>
              {NAV.map((item, i) => (
                <li key={item} className={i > 0 ? "mt-2" : undefined}>
                  <a href="#" className={cn(label, chromeLink)}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn("mt-8 text-muted-foreground", label)}>© 2026 Maison Ardelle</p>
      </footer>
    </div>
  )
}

export default App
