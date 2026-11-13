import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
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
  "h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"

const numbers = [
  { term: "Letters sent to readers", value: "214" },
  { term: "Readers who pay for it", value: "1,260" },
  { term: "Years in print", value: "7" },
]

const people = [
  {
    initials: "MA",
    name: "Marit Aalto",
    role: "Editor · writes the long essays",
    about:
      "Marit spent eleven years restoring church organs before she started the magazine. She writes one long essay an issue, usually about a single job followed from start to finish, and edits everything else.",
  },
  {
    initials: "JO",
    name: "Jonah Okafor",
    role: "Writer · keeps the journal",
    about:
      "Jonah is a former surveyor who now writes the journal, a short dispatch every fortnight from a workshop, a farm or a lab where something slow is under way. He answers most of the letters.",
  },
  {
    initials: "PL",
    name: "Paloma Lund",
    role: "Designer · sets every page",
    about:
      "Paloma sets the type, draws the diagrams and looks after the printing. She also checks every number we publish, which is why corrections are rare.",
  },
]

const details: { term: string; value: ReactNode }[] = [
  { term: "Typefaces", value: "Fraunces, Source Sans 3 and Source Code Pro" },
  {
    term: "Published",
    value: "Four printed issues a year, and an essay online each month",
  },
  {
    term: "Paid for by",
    value: "Its readers, at £36 a year, with no advertising",
  },
  { term: "Since", value: <time dateTime="2019">2019</time> },
]

const history = [
  {
    year: "2019",
    text: "The first issue went out to 140 people, folded and posted by hand from a kitchen table.",
  },
  {
    year: "2020",
    text: "Jonah joined and the journal began, one short dispatch every two weeks.",
  },
  {
    year: "2022",
    text: "We dropped the last advertiser and asked readers to pay for the whole magazine.",
  },
  {
    year: "2024",
    text: "Paloma redesigned the print edition and moved it to a printer two streets from the office.",
  },
  {
    year: "2026",
    text: "The magazine passed a thousand paying readers and sent its two hundredth letter.",
  },
]

type Field = "name" | "email" | "message"
type Errors = Partial<Record<Field, string>>

const fields: Field[] = ["name", "email", "message"]

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) {
    errors.name = "Enter your name."
  }
  if (!values.email.trim()) {
    errors.email = "Enter your email address."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter an email address like name@example.com."
  }
  if (!values.message.trim()) {
    errors.message = "Write a message before you send it."
  }
  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
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

function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) thanksRef.current?.focus()
  }, [sent])

  function update(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = fields.find((f) => found[f])
    if (first) {
      document.getElementById(`contact-${first}`)?.focus()
      return
    }
    setSent(true)
  }

  function fieldProps(field: Field) {
    return {
      id: `contact-${field}`,
      name: field,
      value: values[field],
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    }
  }

  return (
    <div className="mt-6">
      {!sent && (
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="contact-name"
              className="block font-mono text-label text-foreground"
            >
              Your name
            </label>
            <Input
              {...fieldProps("name")}
              type="text"
              autoComplete="name"
              onChange={(e) => update("name", e.currentTarget.value)}
              className={cn("mt-2", fieldClass)}
            />
            <FieldError id="contact-name-error" message={errors.name} />
          </div>
          <div className="mt-6">
            <label
              htmlFor="contact-email"
              className="block font-mono text-label text-foreground"
            >
              Email address
            </label>
            <Input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              onChange={(e) => update("email", e.currentTarget.value)}
              className={cn("mt-2", fieldClass)}
            />
            <FieldError id="contact-email-error" message={errors.email} />
          </div>
          <div className="mt-6">
            <label
              htmlFor="contact-message"
              className="block font-mono text-label text-foreground"
            >
              Message
            </label>
            <Textarea
              {...fieldProps("message")}
              onChange={(e) => update("message", e.currentTarget.value)}
              className={cn("mt-2 min-h-48 resize-none", fieldClass)}
            />
            <FieldError id="contact-message-error" message={errors.message} />
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
              Jonah will read your message and write back within three working
              days.
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
            The Long Margin is a small magazine about work that takes years to
            finish
          </h1>
          <p className="mt-6">
            Most of what we read is about things that happen this week. We
            started the magazine in 2019 because we kept meeting people whose
            work moves at the pace of seasons: a luthier drying spruce for a
            decade, a team rebuilding a salt marsh, a translator on her third
            year of one novel.
          </p>
          <p className="mt-6">
            It is for readers who like to know how a thing was actually done,
            step by step, and who are happy to wait three months for the next
            issue. Three of us write it, and the people who read it pay for it.
          </p>
        </div>

        <dl className="mt-12 mb-12 grid gap-6 md:grid-cols-3">
          {numbers.map((n) => (
            <div key={n.term} className="flex flex-col-reverse border-t pt-4">
              <dt className={cn("mt-2", label)}>{n.term}</dt>
              <dd className="font-heading text-h1">{n.value}</dd>
            </div>
          ))}
        </dl>

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
                  <p className={cn("mt-2", label)}>{p.role}</p>
                </div>
              </div>
              <p className="mt-4">{p.about}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">How it is made</h2>
          <p className="mt-4">
            Each essay starts with a visit, and most need several. We follow one
            piece of work for as long as it takes, which is why a single essay
            can be <em>two years</em> in the writing.
          </p>
          <p className="mt-6">
            Nothing is sponsored and nobody pays to be written about. We print
            on uncoated paper close to home, and you can read about the choices
            behind it in our{" "}
            <a href="#" className={textLink}>
              notes on printing
            </a>
            .
          </p>
          <aside className="my-12 rounded-xl border bg-card p-6">
            <dl>
              {details.map((d, i) => (
                <div
                  key={d.term}
                  className={cn(
                    "md:grid md:grid-cols-4 md:items-baseline md:gap-x-6",
                    i > 0 && "mt-4"
                  )}
                >
                  <dt className={label}>{d.term}</dt>
                  <dd className="mt-2 md:col-span-3 md:mt-0">{d.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">A short history</h2>
          <ol className="mt-6 list-none">
            {history.map((h) => (
              <li key={h.year} className="border-t py-4">
                <p className={label}>
                  <time dateTime={h.year}>{h.year}</time>
                </p>
                <p className="mt-2">{h.text}</p>
              </li>
            ))}
          </ol>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              It is the only thing I read slowly on purpose
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Ingrid, a reader in Leeds
            </footer>
          </blockquote>
        </div>

        <div id="contact" className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Write to us</h2>
          <p className="mt-4">
            Jonah reads every message himself and answers within three working
            days.
          </p>
          <ContactForm />
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine about slow work, written by three people and paid
            for by its readers.
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
