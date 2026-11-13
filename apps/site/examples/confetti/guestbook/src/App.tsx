import { useEffect, useRef, useState, type FormEvent } from "react"
import { flushSync } from "react-dom"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  id: string
  name: string
  initials: string
  relation: string | null
  date: { iso: string; text: string } | null
  text: string
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "m6",
    name: "Juno Pell",
    initials: "JP",
    relation: "Margot's daughter, aged 9",
    date: { iso: "2027-04-09", text: "9 April 2027" },
    text: "I am going to dance every dance, even the slow ones. Rafe, you promised me the one with the arches, and I have not forgotten.",
  },
  {
    id: "m5",
    name: "Tobias Wren",
    initials: "TW",
    relation: "Your neighbour on Saltry Lane",
    date: { iso: "2027-04-01", text: "1 April 2027" },
    text: "The croquet set is yours to borrow for the day, hoops and all. I hope your garden grows faster than mine ever has.",
  },
  {
    id: "m4",
    name: "Hester Quayle",
    initials: "HQ",
    relation: "Clem's friend from the library",
    date: { iso: "2027-03-24", text: "24 March 2027" },
    text: "I still think of you reading recipes aloud at the issue desk on quiet afternoons. May the new kitchen hear plenty of them.",
  },
  {
    id: "m3",
    name: "Dev Raman",
    initials: "DR",
    relation: "Rafe's flatmate at university",
    date: { iso: "2027-03-15", text: "15 March 2027" },
    text: "I knew years ago that Rafe would marry someone who could out-walk him. I am very glad it is Clem.",
  },
  {
    id: "m2",
    name: "Ade Fairbrother",
    initials: "AF",
    relation: "Clem's cousin",
    date: { iso: "2027-03-09", text: "9 March 2027" },
    text: "The family has waited a long time for a ceilidh. I have been practising in the kitchen, so stand well back.",
  },
  {
    id: "m1",
    name: "Margot Pell",
    initials: "MP",
    relation: "Clem's godmother",
    date: { iso: "2027-03-02", text: "2 March 2027" },
    text: "I held you at your christening, Clem, and now I get to see you married. I will try very hard not to cry at the barn.",
  },
]

const MESSAGE_MAX = 500

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const navLinkClass = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 hover:underline transition-colors duration-150 ${focusOutline}`

const runningLinkClass = `text-primary underline underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusOutline}`

const NAV_LINKS = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day" },
  { label: "Guestbook", href: "/guestbook", current: true },
]

type Errors = { name?: string; message?: string }

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0].toUpperCase())
    .join("")
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

export function App() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [text, setText] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [thanksName, setThanksName] = useState<string | null>(null)
  const nextId = useRef(1)

  const nameRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (thanksName !== null) thanksRef.current?.focus()
  }, [thanksName])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedRelation = relation.trim()
    const trimmedText = text.trim()

    const next: Errors = {}
    if (!trimmedName) next.name = "Write your name, so they know who it is from."
    if (!trimmedText) next.message = "Write a message. A line or two is plenty."

    if (next.name || next.message) {
      flushSync(() => setErrors(next))
      if (next.name) nameRef.current?.focus()
      else messageRef.current?.focus()
      return
    }

    setErrors({})
    setMessages((list) => [
      {
        id: `new-${nextId.current++}`,
        name: trimmedName,
        initials: initialsFrom(trimmedName),
        relation: trimmedRelation || null,
        date: null,
        text: trimmedText,
      },
      ...list,
    ])
    setThanksName(trimmedName)
  }

  const charsLeft = MESSAGE_MAX - text.length

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${focusOutline}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={
                      link.current ? `${navLinkClass} underline` : navLinkClass
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1088px] flex-col gap-22 px-6 pt-10 pb-22">
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-blush p-6 text-blush-foreground md:p-10"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-label">For Clem and Rafe</p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                Leave us a few words
              </h1>
            </div>
            <p className="max-w-xl text-body">
              A memory, a wish or a piece of advice for the years ahead. We
              read every one, and we are keeping them all.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6">
          <section
            aria-labelledby="messages-heading"
            className="flex flex-col gap-6 md:col-span-7"
          >
            <div className="flex flex-col gap-2">
              <h2 id="messages-heading" className="text-h2">
                Messages
              </h2>
              <p className="font-mono text-label text-muted-foreground tabular-nums">
                {plural(messages.length, "message", "messages")}
              </p>
            </div>
            <ul className="flex list-none flex-col gap-6 p-0">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-label text-secondary-foreground"
                    >
                      {message.initials}
                    </span>
                    <div className="flex min-w-0 flex-col gap-2">
                      <h3 className="text-body wrap-break-word">
                        {message.name}
                      </h3>
                      <p className="font-mono text-label text-muted-foreground tabular-nums wrap-break-word">
                        {message.relation && <>{message.relation} · </>}
                        {message.date ? (
                          <time dateTime={message.date.iso}>
                            {message.date.text}
                          </time>
                        ) : (
                          "Just now"
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-body wrap-break-word">{message.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="write-heading"
            className="flex flex-col gap-6 md:col-span-5"
          >
            <div className="flex flex-col gap-3">
              <h2 id="write-heading" className="text-h2">
                Write in the guestbook
              </h2>
              <p className="text-body">
                Your message goes at the top of the list straight away.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              {thanksName === null && (
                <form
                  noValidate
                  aria-label="Write in the guestbook"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guest-name"
                      className="block font-mono text-label text-foreground"
                    >
                      Your name
                    </label>
                    <Input
                      ref={nameRef}
                      id="guest-name"
                      name="name"
                      autoComplete="name"
                      maxLength={60}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        if (errors.name)
                          setErrors((e) => ({ ...e, name: undefined }))
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={
                        errors.name ? "guest-name-error" : undefined
                      }
                      className="h-11 rounded-md px-3 text-body md:text-body"
                    />
                    {errors.name && (
                      <p
                        id="guest-name-error"
                        className="flex items-start gap-2 font-mono text-label text-destructive"
                      >
                        <CircleAlert
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guest-relation"
                      className="block font-mono text-label text-foreground"
                    >
                      How you know Clem and Rafe (optional)
                    </label>
                    <Input
                      id="guest-relation"
                      name="relation"
                      autoComplete="off"
                      maxLength={60}
                      value={relation}
                      onChange={(event) => setRelation(event.target.value)}
                      aria-describedby="guest-relation-help"
                      className="h-11 rounded-md px-3 text-body md:text-body"
                    />
                    <p
                      id="guest-relation-help"
                      className="font-mono text-label text-muted-foreground"
                    >
                      Like "Rafe's cousin" or "the neighbours at number 4"
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guest-message"
                      className="block font-mono text-label text-foreground"
                    >
                      Your message
                    </label>
                    <Textarea
                      ref={messageRef}
                      id="guest-message"
                      name="message"
                      maxLength={MESSAGE_MAX}
                      value={text}
                      onChange={(event) => {
                        setText(event.target.value)
                        if (errors.message)
                          setErrors((e) => ({ ...e, message: undefined }))
                      }}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={
                        errors.message
                          ? "guest-message-count guest-message-error"
                          : "guest-message-count"
                      }
                      className="min-h-32 resize-none rounded-md px-3 py-2 text-body md:text-body"
                    />
                    <p
                      id="guest-message-count"
                      className="font-mono text-label text-muted-foreground tabular-nums"
                    >
                      {plural(charsLeft, "character left", "characters left")}
                    </p>
                    {errors.message && (
                      <p
                        id="guest-message-error"
                        className="flex items-start gap-2 font-mono text-label text-destructive"
                      >
                        <CircleAlert
                          className="size-4 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-md px-6 font-mono text-label md:w-auto md:self-start"
                  >
                    Add my message
                  </Button>
                </form>
              )}
              <div role="status">
                {thanksName !== null && (
                  <div className="flex flex-col gap-3 text-foreground">
                    <h3
                      ref={thanksRef}
                      tabIndex={-1}
                      className="text-h2 wrap-break-word focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                    >
                      Thank you, {thanksName}
                    </h3>
                    <p className="text-body">
                      Your message is at the top of the guestbook.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="day-heading"
          className="grid grid-cols-1 md:grid-cols-12"
        >
          <div className="flex flex-col gap-6 md:col-span-8 md:col-start-3">
            <h2 id="day-heading" className="text-h2">
              On the day
            </h2>
            <p className="max-w-xl text-body">
              There is a paper guestbook too, on the table by the barn door,
              with pens that work. Write in both if you like.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1088px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-h2">Clem &amp; Rafe</p>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="font-mono text-label text-muted-foreground">
              <time dateTime="2027-07-17">Saturday 17 July 2027</time> ·
              Quillbrook Barn, Little Saltry
            </p>
            <p className="font-mono text-label text-muted-foreground wrap-break-word">
              Questions:{" "}
              <a
                href="mailto:hello@clemandrafe.example"
                className={runningLinkClass}
              >
                hello@clemandrafe.example
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
