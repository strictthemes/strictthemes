import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const fieldClass =
  "mt-2 h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"

const labelClass = "block font-mono text-label"

const numbers = [
  { term: "Letters answered", value: "1,140" },
  { term: "Paying readers", value: "3,862" },
  { term: "Years in print", value: "7" },
]

const people = [
  {
    initials: "MO",
    name: "Maren Oduya",
    role: "Editor",
    bio: "Maren started the magazine after ten years editing trade journals about bridges and drainage. She chooses what we cover, edits every essay twice and answers the letters herself.",
  },
  {
    initials: "TR",
    name: "Tomas Reyle",
    role: "Writer",
    bio: "Tomas writes the long pieces, the ones that need a season of visits. He has followed a clockmaker, a hedge layer and a team relining a canal, and he still keeps the notebooks.",
  },
  {
    initials: "IF",
    name: "Ines Fairlie",
    role: "Designer and subeditor",
    bio: "Ines sets each issue, checks every fact and date, and looks after the readers' accounts. She is the reason the printed copies arrive on time.",
  },
]

const details = [
  {
    term: "Typefaces",
    value: <>Fraunces for headings, Source Sans 3 for text</>,
  },
  { term: "Published", value: <>Four issues a year, in print and online</> },
  { term: "Paid for by", value: <>Its readers, with no advertising</> },
  { term: "Since", value: <time dateTime="2019">2019</time> },
]

const history = [
  {
    year: "2019",
    text: "Maren posted the first issue, twelve stapled pages, to 140 friends and former colleagues.",
  },
  {
    year: "2020",
    text: "Tomas joined and wrote a year-long piece on a family rebuilding a dry stone wall.",
  },
  {
    year: "2022",
    text: "Readers voted to drop the free tier, and the magazine has been paid for by them alone ever since.",
  },
  {
    year: "2024",
    text: "Ines redesigned the print edition so that each issue fits in a coat pocket.",
  },
  {
    year: "2026",
    text: "The magazine passed 3,800 paying readers and published its twenty-eighth issue.",
  },
]

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ErrorLine({ id, text }: { id: string; text: string }) {
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
      <span>{text}</span>
    </p>
  )
}

function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
  }, [sent])

  function change(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[field]
        return next
      })
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    }
    setValues(trimmed)

    const next: Errors = {}
    if (!trimmed.name) next.name = "Enter your name."
    if (!trimmed.email) next.email = "Enter your email address."
    else if (!emailPattern.test(trimmed.email))
      next.email = "Enter an email address in the form name@example.com."
    if (!trimmed.message) next.message = "Write a message before you send it."
    setErrors(next)

    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.message) messageRef.current?.focus()
    else setSent(true)
  }

  return (
    <div className="mt-6">
      {!sent && (
        <form noValidate onSubmit={submit}>
          <div>
            <label htmlFor="name" className={labelClass}>
              Your name
            </label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => change("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && <ErrorLine id="name-error" text={errors.name} />}
          </div>
          <div className="mt-6">
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => change("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
            />
            {errors.email && <ErrorLine id="email-error" text={errors.email} />}
          </div>
          <div className="mt-6">
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <Textarea
              ref={messageRef}
              id="message"
              name="message"
              value={values.message}
              onChange={(e) => change("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(fieldClass, "min-h-48 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="message-error" text={errors.message} />
            )}
          </div>
          <div className="mt-6">
            <Button
              type="submit"
              className="h-auto rounded-md px-6 py-2 font-mono text-label"
            >
              Send message
            </Button>
          </div>
        </form>
      )}
      <div role="status">
        {sent && (
          <>
            <h3
              ref={thanksRef}
              tabIndex={-1}
              className="text-h2 focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
            >
              Thank you
            </h3>
            <p className="mt-4">
              Maren will write back within a week, usually on a Sunday evening.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(navLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/essays" className={navLink}>
            Essays
          </a>
          <a href="/journal" className={navLink}>
            Journal
          </a>
          <a
            href="/about"
            aria-current="page"
            className={cn(navLink, "underline")}
          >
            About
          </a>
        </nav>
      </header>

      <main>
        {/* Opening */}
        <div className="mx-auto max-w-lg pt-12">
          <p className="font-mono text-label text-muted-foreground">About</p>
          <h1 className="mt-4 text-h1">
            A small magazine about work that takes a long time
          </h1>
          <p className="mt-6">
            Most of what gets written about work is about speed: who shipped
            first, who grew fastest. We started The Long Margin to write about
            the other kind, the restorations, apprenticeships and building
            projects that take years and only make sense when you stay with
            them.
          </p>
          <p className="mt-6">
            It is for people who do slow work themselves, and for anyone who
            would rather read one careful piece a season than a hundred quick
            ones. There are no adverts and no tracking, and every issue can be
            read in a single sitting.
          </p>
        </div>

        {/* In numbers */}
        <dl className="my-12 grid gap-6 md:grid-cols-3">
          {numbers.map((n) => (
            <div key={n.term} className="flex flex-col-reverse border-t pt-4">
              <dt className="mt-2 font-mono text-label text-muted-foreground">
                {n.term}
              </dt>
              <dd className="font-heading text-h1">{n.value}</dd>
            </div>
          ))}
        </dl>

        {/* Who makes it */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Who makes it</h2>
          {people.map((p, i) => (
            <div key={p.name} className={i === 0 ? "mt-6" : "mt-12"}>
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-card font-heading text-body"
                >
                  {p.initials}
                </div>
                <div>
                  <h3 className="text-body font-semibold">{p.name}</h3>
                  <p className="mt-2 font-mono text-label text-muted-foreground">
                    {p.role}
                  </p>
                </div>
              </div>
              <p className="mt-4">{p.bio}</p>
            </div>
          ))}
        </div>

        {/* How it is made */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">How it is made</h2>
          <p className="mt-4">
            Each piece starts with a visit and ends months later, sometimes a
            year. We go back to the same people until the work has changed in
            front of us, and we write only about what we saw. That is why there
            are just four issues a year, and why each one is <em>finished</em>{" "}
            before it is sent, not updated after.
          </p>
          <p className="mt-6">
            Readers pay between £3 and £12 a month, whatever suits them, and
            that money covers printing, postage and our three salaries. Once a
            year we publish the{" "}
            <a href="#" className={textLink}>
              full accounts
            </a>{" "}
            so you can see where it goes.
          </p>
          <div className="my-12 rounded-xl border bg-card p-6">
            <dl>
              {details.map((d, i) => (
                <div
                  key={d.term}
                  className={cn(
                    i > 0 && "mt-4",
                    "md:grid md:grid-cols-4 md:items-baseline md:gap-x-6"
                  )}
                >
                  <dt className="font-mono text-label text-muted-foreground">
                    {d.term}
                  </dt>
                  <dd className="mt-2 md:col-span-3 md:mt-0">{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* A short history */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">A short history</h2>
          <ol className="mt-6 list-none">
            {history.map((h) => (
              <li key={h.year} className="border-t py-4">
                <p className="font-mono text-label text-muted-foreground">
                  <time dateTime={h.year}>{h.year}</time>
                </p>
                <p className="mt-2">{h.text}</p>
              </li>
            ))}
          </ol>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              It is the only thing that arrives in my post that I save for a
              quiet evening.
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Ingrid, Leeds
            </footer>
          </blockquote>
        </div>

        {/* Write to us */}
        <div id="contact" className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Write to us</h2>
          <p className="mt-4">
            Maren reads every message herself and answers within a week.
          </p>
          <ContactForm />
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about work that takes a long time, written by three
            people and paid for by its readers.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Long Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
