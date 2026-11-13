import { useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const label = "font-mono text-label text-muted-foreground"

const fieldClass =
  "mt-2 h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"

const numbers = [
  { term: "Letters answered", value: "312" },
  { term: "Paying readers", value: "1,240" },
  { term: "Years in print", value: "7" },
]

const people = [
  {
    initials: "HL",
    name: "Hanne Lindqvist",
    role: "Editor",
    about:
      "Hanne started the magazine after ten years of writing short pieces to deadline. She edits every essay twice, once for sense and once for sound. She lives above a bookbinder's shop and says this is not a coincidence.",
  },
  {
    initials: "TM",
    name: "Tobias Merrow",
    role: "Writer",
    about:
      "Tobias writes about trades that take a decade to learn: thatching, organ building, the restoration of clocks. He spends weeks with each person before he writes a word.",
  },
  {
    initials: "AK",
    name: "Ada Kestrel",
    role: "Writer and letters",
    about:
      "Ada writes the journal and answers the letters readers send in. Before joining she worked as a field ecologist, counting the same hedgerow birds every spring for eight years.",
  },
]

const details = [
  { term: "Typefaces", value: "Fraunces and Source Sans 3" },
  { term: "Published", value: "Four issues a year, online and in print" },
  { term: "Paid for by", value: "1,240 readers, at £4 a month" },
  { term: "Since", value: <time dateTime="2019">2019</time> },
]

const history = [
  {
    year: "2019",
    text: "The first issue went out to 46 friends, with a single essay about a dry-stone waller in the Dales.",
  },
  {
    year: "2020",
    text: "We stopped taking advertising and asked readers to pay for the magazine instead.",
  },
  {
    year: "2021",
    text: "Ada joined as the third writer and started answering every letter by hand.",
  },
  {
    year: "2023",
    text: "The first printed issue came off a small press in Hebden Bridge, in a run of 600 copies.",
  },
  {
    year: "2025",
    text: "We published our hundredth essay, about a woman who has been planting the same oak wood for forty years.",
  },
]

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = values.name.trim()
    const email = values.email.trim()
    const message = values.message.trim()

    const found: Errors = {}
    if (!name) found.name = "Enter your name."
    if (!email) {
      found.email = "Enter your email address."
    } else if (!emailPattern.test(email)) {
      found.email = "Enter an email address in the form name@example.com."
    }
    if (!message) found.message = "Write a message before you send it."

    setErrors(found)

    if (found.name) {
      nameRef.current?.focus()
    } else if (found.email) {
      emailRef.current?.focus()
    } else if (found.message) {
      messageRef.current?.focus()
    } else {
      setSent(true)
      requestAnimationFrame(() => thanksRef.current?.focus())
    }
  }

  return (
    <div className="mt-6">
      {!sent && (
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block font-mono text-label">
              Your name
            </label>
            <Input
              ref={nameRef}
              id="name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClass}
            />
            {errors.name && (
              <ErrorLine id="name-error">{errors.name}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="email" className="block font-mono text-label">
              Email address
            </label>
            <Input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
            />
            {errors.email && (
              <ErrorLine id="email-error">{errors.email}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label htmlFor="message" className="block font-mono text-label">
              Message
            </label>
            <Textarea
              ref={messageRef}
              id="message"
              name="message"
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(fieldClass, "min-h-48 resize-none")}
            />
            {errors.message && (
              <ErrorLine id="message-error">{errors.message}</ErrorLine>
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
              Your message is with Ada, who will write back within a week.
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
        <a href="/" className={cn("font-heading text-h2", headerLink)}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/essays" className={headerLink}>
            Essays
          </a>
          <a href="/journal" className={headerLink}>
            Journal
          </a>
          <a
            href="/about"
            aria-current="page"
            className={cn(headerLink, "underline")}
          >
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-12">
          <p className={label}>About</p>
          <h1 className="mt-4 text-h1">
            A small magazine about work that takes a long time
          </h1>
          <p className="mt-6">
            Most writing about work is about speed: how to ship sooner, how to
            do more before lunch. We started The Long Margin in 2019 because we
            wanted to read about the other kind, the bell founder who waits a
            year to hear a bell, the editor who spends a decade on one
            dictionary.
          </p>
          <p className="mt-6">
            It is for people who make slow things, and for people who simply
            like to read about them. There are no ads and no trackers. Each
            essay is long, and we expect you to sit down with it.
          </p>
        </div>

        <dl className="my-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {numbers.map((item) => (
            <div
              key={item.term}
              className="flex flex-col-reverse border-t pt-4"
            >
              <dt className={cn("mt-2", label)}>{item.term}</dt>
              <dd className="font-heading text-h1 tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Who makes it</h2>
          {people.map((person, index) => (
            <div key={person.name} className={index === 0 ? "mt-6" : "mt-12"}>
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-card font-heading text-body"
                >
                  {person.initials}
                </div>
                <div>
                  <h3 className="text-body font-semibold">{person.name}</h3>
                  <p className={cn("mt-2", label)}>{person.role}</p>
                </div>
              </div>
              <p className="mt-4">{person.about}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">How it is made</h2>
          <p className="mt-4">
            Each essay starts with a visit, and most take three or four. We
            write only about people we have met in person, and we show them the
            finished piece before it goes out, though we do <em>not</em> let
            them change it.
          </p>
          <p className="mt-6">
            An essay is read aloud by all three of us before it is published,
            which catches more mistakes than any proofreading tool. If you want
            to know how we decide what to cover, our{" "}
            <a href="#" className={textLink}>
              notes for contributors
            </a>{" "}
            set it out.
          </p>

          <div className="my-12 rounded-xl border bg-card p-6">
            <dl>
              {details.map((row, index) => (
                <div
                  key={row.term}
                  className={cn(
                    index > 0 && "mt-4",
                    "md:grid md:grid-cols-4 md:items-baseline md:gap-x-6"
                  )}
                >
                  <dt className={label}>{row.term}</dt>
                  <dd className="mt-2 tabular-nums md:col-span-3 md:mt-0">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">A short history</h2>
          <ol className="mt-6 list-none">
            {history.map((entry) => (
              <li key={entry.year} className="border-t py-4">
                <p className={cn(label, "tabular-nums")}>
                  <time dateTime={entry.year}>{entry.year}</time>
                </p>
                <p className="mt-2">{entry.text}</p>
              </li>
            ))}
          </ol>

          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              It is the only magazine I read twice, once quickly and once
              slowly.
            </p>
            <footer className={cn("mt-4 not-italic", label)}>
              Agnes, Dundee
            </footer>
          </blockquote>
        </div>

        <div id="contact" className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Write to us</h2>
          <p className="mt-4">
            Ada reads every message and answers within a week, usually sooner.
          </p>
          <ContactForm />
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A reader-funded magazine about work that takes a long time.
          </p>
          <p className={cn("mt-6 tabular-nums", label)}>
            © 2026 The Long Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
