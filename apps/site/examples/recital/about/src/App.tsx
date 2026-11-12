import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
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
  { term: "Letters sent", value: "1,240" },
  { term: "Paying readers", value: "3,800" },
  { term: "Years in print", value: "7" },
]

const people = [
  {
    initials: "MH",
    name: "Maren Holloway",
    role: "Editor · Founder",
    about:
      "Maren spent eleven years as a court reporter before starting the magazine at her kitchen table. She edits every piece twice: once for sense, once out loud. She writes the long essay in each issue.",
  },
  {
    initials: "TO",
    name: "Tobias Okafor",
    role: "Writer · Journal",
    about:
      "Tobias keeps the journal, a running record of projects we follow for years at a time: a cathedral roof, a seed bank, a dictionary of a dying dialect. He joined in 2020 after writing us a four-page letter.",
  },
  {
    initials: "LV",
    name: "Lise Varga",
    role: "Writer · Letters and design",
    about:
      "Lise answers the letters and sets every page. She trained as a bookbinder and still thinks a magazine should open flat on a table.",
  },
]

const madeOf = [
  { term: "Typefaces", value: "Fraunces, Source Sans 3 and Source Code Pro" },
  { term: "Published", value: "Four issues a year, in print and online" },
  { term: "Paid for by", value: "Its readers, at 6 euros a month" },
]

const history = [
  {
    year: "2019",
    text: "Maren printed the first issue, 300 copies, and posted most of them to friends.",
  },
  {
    year: "2020",
    text: "Tobias joined and began the journal with a piece on a bridge that took nineteen years to rebuild.",
  },
  {
    year: "2021",
    text: "We dropped the last advertiser and asked readers to pay for the magazine instead.",
  },
  {
    year: "2023",
    text: "Lise came on to answer letters, and the letters became a section of their own.",
  },
  {
    year: "2026",
    text: "The magazine passed 3,800 paying readers, enough to pay all three of us a wage.",
  },
]

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

const fieldOrder: Field[] = ["name", "email", "message"]

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
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
  }, [sent])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameRef.current?.value.trim() ?? ""
    const email = emailRef.current?.value.trim() ?? ""
    const message = messageRef.current?.value.trim() ?? ""
    const next: Errors = {}
    if (!name) next.name = "Write your name so we know who to answer."
    if (!email) {
      next.email = "Write your email address so we can reply."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Check the email address, for example name@example.com."
    }
    if (!message) next.message = "Write a message before you send it."
    setErrors(next)

    const first = fieldOrder.find((field) => next[field])
    if (first) {
      const refs = { name: nameRef, email: emailRef, message: messageRef }
      refs[first].current?.focus()
      return
    }
    setSent(true)
  }

  function clearError(field: Field) {
    if (!errors[field]) return
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  return (
    <div className="mt-6">
      {!sent && (
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block font-mono text-label text-foreground"
            >
              Your name
            </label>
            <Input
              id="name"
              name="name"
              ref={nameRef}
              autoComplete="name"
              className={fieldClass}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              onInput={() => clearError("name")}
            />
            {errors.name && (
              <ErrorLine id="name-error">{errors.name}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label
              htmlFor="email"
              className="block font-mono text-label text-foreground"
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              ref={emailRef}
              autoComplete="email"
              className={fieldClass}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              onInput={() => clearError("email")}
            />
            {errors.email && (
              <ErrorLine id="email-error">{errors.email}</ErrorLine>
            )}
          </div>
          <div className="mt-6">
            <label
              htmlFor="message"
              className="block font-mono text-label text-foreground"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              ref={messageRef}
              className={cn(fieldClass, "min-h-48")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              onInput={() => clearError("message")}
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
              className={cn("text-h2", codeFocusRing)}
            >
              Thank you
            </h3>
            <p className="mt-4">
              Lise reads every letter and will write back within a week.
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
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
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
            Most of what is worth doing takes longer than a news cycle:
            rebuilding a bridge, finishing a dictionary, raising an orchard. We
            started The Long Margin to follow that kind of work from the middle,
            while it is still slow and unfinished, and to write about it without
            hurrying.
          </p>
          <p className="mt-6">
            It is for people who read on paper and on purpose. If you have ever
            kept a project going for years with little to show for it, this
            magazine is written for you, and so are the letters we send.
          </p>
        </div>

        <dl className="my-12 grid gap-6 md:grid-cols-3">
          {numbers.map((item) => (
            <div
              key={item.term}
              className="flex flex-col-reverse border-t pt-4"
            >
              <dt className={cn(label, "mt-2")}>{item.term}</dt>
              <dd className="font-heading text-h1">{item.value}</dd>
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
                  <p className={cn(label, "mt-2")}>{person.role}</p>
                </div>
              </div>
              <p className="mt-4">{person.about}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">How it is made</h2>
          <p className="mt-4">
            Each issue starts as a list of projects we have followed for at
            least a year. We visit, we wait, and we write only when something
            has <em>changed</em>, which is why some stories take three issues to
            appear.
          </p>
          <p className="mt-6">
            There are no advertisers and no sponsored pieces. The magazine is
            paid for by subscriptions alone, and you can read how the money is
            spent in our{" "}
            <a href="#" className={textLink}>
              yearly accounts
            </a>
            .
          </p>
          <div className="my-12 rounded-xl border bg-card p-6">
            <dl>
              {[
                ...madeOf.map((row) => ({
                  term: row.term,
                  value: <>{row.value}</>,
                })),
                { term: "Since", value: <time dateTime="2019">2019</time> },
              ].map((row, index) => (
                <div
                  key={row.term}
                  className={cn(
                    index > 0 && "mt-4",
                    "md:grid md:grid-cols-4 md:items-baseline md:gap-x-6"
                  )}
                >
                  <dt className={label}>{row.term}</dt>
                  <dd className="mt-2 md:col-span-3 md:mt-0">{row.value}</dd>
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
                <p className={label}>
                  <time dateTime={entry.year}>{entry.year}</time>
                </p>
                <p className="mt-2">{entry.text}</p>
              </li>
            ))}
          </ol>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              It is the only thing in my letterbox I save for a quiet evening.
            </p>
            <footer className={cn(label, "mt-4 not-italic")}>Ingrid</footer>
          </blockquote>
        </div>

        <div id="contact" className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Write to us</h2>
          <p className="mt-4">
            Lise reads every message herself and answers within a week.
          </p>
          <ContactForm />
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about work that takes a long time, paid for by its
            readers.
          </p>
          <p className={cn(label, "mt-6")}>
            © 2026 The Long Margin · Paid for by readers
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
