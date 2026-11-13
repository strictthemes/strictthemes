import * as React from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const SIZES = ["34", "36", "38", "40", "42"]

const NAV_LINKS = ["Collection", "House", "Appointment"]

const DETAILS = [
  { term: "Cloth", value: "Undyed wool, woven in Biella" },
  { term: "Lining", value: "Cupro, half-lined" },
  { term: "Length", value: "118 cm in size 38" },
  { term: "Fit", value: "Cut loose; take your usual size" },
  { term: "Made in", value: "Lyon, in our atelier" },
]

const CARE = [
  "Dry clean only.",
  "Brush the cloth after wearing, from the shoulder down.",
  "Store on a wide hanger, with the belt untied.",
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const NAV_LINK = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const TEXT_LINK = `text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground ${FOCUS}`

const LABEL = "font-mono text-label uppercase"

const BUTTON = "h-auto px-8 py-4 font-mono text-label font-normal uppercase"

const SIZE_BUTTON =
  "h-auto min-w-16 px-4 py-2 font-mono text-label font-normal uppercase tabular-nums"

const FIELD = "h-auto border-muted-foreground px-4 py-2 text-body md:text-body"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = { size?: string; name?: string; email?: string }

type Receipt = { size: string; email: string }

function ErrorLine({ id, children }: { id: string; children: string }) {
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
      <span>{children}</span>
    </p>
  )
}

export function App() {
  const [size, setSize] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [note, setNote] = React.useState("")
  const [errors, setErrors] = React.useState<Errors>({})
  const [receipt, setReceipt] = React.useState<Receipt | null>(null)

  const firstSizeRef = React.useRef<HTMLButtonElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const receivedRef = React.useRef<HTMLHeadingElement>(null)

  function chooseSize(next: string) {
    setSize(next)
    setErrors((current) => ({ ...current, size: undefined }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const writtenEmail = email.trim()
    const next: Errors = {}
    if (size === null) {
      next.size = "Choose a size above."
    }
    if (name.trim() === "") {
      next.name = "Write your name."
    }
    if (!EMAIL_PATTERN.test(writtenEmail)) {
      next.email = "Write an email address such as name@example.com."
    }

    if (size === null || next.name || next.email) {
      flushSync(() => setErrors(next))
      if (next.size) {
        firstSizeRef.current?.focus()
      } else if (next.name) {
        nameRef.current?.focus()
      } else {
        emailRef.current?.focus()
      }
      return
    }

    flushSync(() => {
      setErrors({})
      setReceipt({ size, email: writtenEmail })
    })
    receivedRef.current?.focus()
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${NAV_LINK}`}>
          Maison Ardelle
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a href="#" className={`${LABEL} ${NAV_LINK}`}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-7">
            <figure>
              <div
                role="img"
                aria-label="Marit Ekwall stands facing the camera in the Lune wrap coat, the belt tied at the waist and the hem falling to mid-calf."
                className="aspect-3/4 w-full bg-secondary"
              />
              <figcaption className="mt-2">
                <p className={`${LABEL} text-foreground`}>Front</p>
                <p className={`mt-1 ${LABEL} text-muted-foreground`}>
                  Worn by Marit Ekwall · 178{" "}
                  <span className="normal-case">cm</span> · Size 36
                </p>
              </figcaption>
            </figure>
            <div className="mt-8 grid grid-cols-2 gap-x-8">
              <figure>
                <div
                  role="img"
                  aria-label="The coat seen from behind, with one seam down the centre of the back and the belt knotted to one side."
                  className="aspect-2/3 w-full bg-secondary"
                />
                <figcaption className="mt-2">
                  <p className={`${LABEL} text-foreground`}>Back</p>
                </figcaption>
              </figure>
              <figure>
                <div
                  role="img"
                  aria-label="A close view of the undyed wool where the belt of the same cloth is tied over the front of the coat."
                  className="aspect-2/3 w-full bg-card"
                />
                <figcaption className="mt-2">
                  <p className={`${LABEL} text-foreground`}>Detail</p>
                  <p className={`mt-1 ${LABEL} text-muted-foreground`}>
                    Undyed wool
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="mt-16 md:col-span-4 md:col-start-9 md:mt-0">
            <p className={`${LABEL} text-muted-foreground`}>
              Look 03 ·{" "}
              <a href="#" className={TEXT_LINK}>
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
              A long coat without buttons, cut from two lengths of undyed wool
              with a dropped shoulder and a deep overlap at the front. Wrap it
              left over right and tie the belt, or leave it open and let it
              hang straight.
            </p>

            <div className="mt-8 flex items-baseline justify-between gap-4">
              <span id="size-label" className={`${LABEL} text-foreground`}>
                Size
              </span>
              <span className={`${LABEL} text-muted-foreground tabular-nums`}>
                {size === null ? "No size chosen" : `Chosen · ${size}`}
              </span>
            </div>
            <div
              role="group"
              aria-labelledby="size-label"
              className="mt-2 flex flex-wrap gap-2"
            >
              {SIZES.map((value, index) => {
                const chosen = value === size
                return (
                  <Button
                    key={value}
                    ref={index === 0 ? firstSizeRef : undefined}
                    variant={chosen ? "secondary" : "outline"}
                    aria-pressed={chosen}
                    aria-describedby={errors.size ? "size-error" : undefined}
                    className={
                      chosen ? `${SIZE_BUTTON} border-foreground` : SIZE_BUTTON
                    }
                    onClick={() => chooseSize(value)}
                  >
                    {value}
                  </Button>
                )
              })}
            </div>
            {errors.size ? (
              <ErrorLine id="size-error">{errors.size}</ErrorLine>
            ) : null}

            <Button
              aria-expanded={open}
              aria-controls="request-area"
              className={`mt-8 w-full text-center whitespace-normal ${BUTTON}`}
              onClick={() => setOpen((current) => !current)}
            >
              Request this piece
            </Button>

            <div id="request-area" hidden={!open} className="mt-8">
              {receipt === null ? (
                <form
                  noValidate
                  className="bg-card p-8"
                  onSubmit={handleSubmit}
                >
                  <p className={`${LABEL} text-muted-foreground`}>
                    Lune wrap coat ·{" "}
                    {size === null ? "No size chosen" : `Size ${size}`}
                  </p>
                  <div className="mt-8">
                    <label
                      htmlFor="request-name"
                      className={`block ${LABEL} text-foreground`}
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
                      aria-describedby={
                        errors.name ? "request-name-error" : undefined
                      }
                      className={`mt-2 ${FIELD}`}
                      onChange={(event) => {
                        setName(event.target.value)
                        setErrors((current) => ({
                          ...current,
                          name: undefined,
                        }))
                      }}
                    />
                    {errors.name ? (
                      <ErrorLine id="request-name-error">
                        {errors.name}
                      </ErrorLine>
                    ) : null}
                  </div>
                  <div className="mt-8">
                    <label
                      htmlFor="request-email"
                      className={`block ${LABEL} text-foreground`}
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
                      className={`mt-2 ${FIELD}`}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }))
                      }}
                    />
                    {errors.email ? (
                      <ErrorLine id="request-email-error">
                        {errors.email}
                      </ErrorLine>
                    ) : null}
                  </div>
                  <div className="mt-8">
                    <label
                      htmlFor="request-note"
                      className={`block ${LABEL} text-foreground`}
                    >
                      Note (optional)
                    </label>
                    <Textarea
                      id="request-note"
                      name="note"
                      value={note}
                      aria-describedby="request-note-help"
                      className={`mt-2 min-h-32 resize-none ${FIELD}`}
                      onChange={(event) => setNote(event.target.value)}
                    />
                    <p
                      id="request-note-help"
                      className="mt-2 font-mono text-label text-muted-foreground"
                    >
                      Ask us anything about fit or length.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className={`mt-8 w-full text-center whitespace-normal ${BUTTON}`}
                  >
                    Send request
                  </Button>
                </form>
              ) : null}
              <div role="status">
                {receipt !== null ? (
                  <div className="bg-card p-8">
                    <h2
                      ref={receivedRef}
                      tabIndex={-1}
                      className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                    >
                      Request received
                    </h2>
                    <p className="mt-4 max-w-md wrap-break-word">
                      We will write to {receipt.email} within two working days
                      about the Lune wrap coat in size {receipt.size}.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <h2 className={`mt-16 ${LABEL} text-foreground`}>Details</h2>
            <dl className="mt-4 border-b border-border">
              {DETAILS.map((row) => (
                <div
                  key={row.term}
                  className="grid grid-cols-3 items-baseline gap-x-4 border-t border-border py-4"
                >
                  <dt className={`${LABEL} text-muted-foreground`}>
                    {row.term}
                  </dt>
                  <dd className="col-span-2 text-body">{row.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className={`mt-16 ${LABEL} text-foreground`}>Care</h2>
            <ul className="mt-4 list-disc pl-4">
              {CARE.map((line, index) => (
                <li key={line} className={index === 0 ? undefined : "mt-2"}>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md">
              Each coat is cut to order by Inès Ardelle and two cutters at{" "}
              <a href="#" className={TEXT_LINK}>
                the house in Lyon
              </a>
              , and is ready about four weeks after a request.
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 md:mt-32">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Maison Ardelle</p>
            <div className={`mt-2 ${LABEL} text-muted-foreground`}>
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
                <li key={link} className={index === 0 ? undefined : "mt-2"}>
                  <a href="#" className={`${LABEL} ${NAV_LINK}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={`mt-8 ${LABEL} text-muted-foreground`}>
          © 2026 Maison Ardelle
        </p>
      </footer>
    </div>
  )
}

export default App
