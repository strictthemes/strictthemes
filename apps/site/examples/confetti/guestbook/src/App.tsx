import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  id: number
  name: string
  initials: string
  relation: string | null
  date: string | null
  text: string
}

type Errors = {
  name?: string
  message?: string
}

const MESSAGE_LIMIT = 500

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const FIRST_MESSAGES: Message[] = [
  {
    id: 6,
    name: "Juno Pell",
    initials: "JP",
    relation: "Margot's daughter, aged 9",
    date: "2027-04-09",
    text: "I am going to dance every single dance. Rafe, you promised me the one with the arches, and I have not forgotten.",
  },
  {
    id: 5,
    name: "Tobias Wren",
    initials: "TW",
    relation: "Your neighbour on Saltry Lane",
    date: "2027-04-01",
    text: "The croquet set is yours to borrow for the day, hoops and all. I wish you both a garden that grows faster than mine.",
  },
  {
    id: 4,
    name: "Hester Quayle",
    initials: "HQ",
    relation: "Clem's friend from the library",
    date: "2027-03-24",
    text: "I still remember you reading recipes aloud at the issue desk, Clem, when you thought nobody was listening. I hope the new kitchen hears plenty of them.",
  },
  {
    id: 3,
    name: "Dev Raman",
    initials: "DR",
    relation: "Rafe's flatmate at university",
    date: "2027-03-15",
    text: "I have known for years that Rafe would marry someone who could out-walk him. I am very glad it is Clem.",
  },
  {
    id: 2,
    name: "Ade Fairbrother",
    initials: "AF",
    relation: "Clem's cousin",
    date: "2027-03-09",
    text: "This family has waited a long time for a ceilidh. I have been practising in the kitchen, and the dog is not impressed.",
  },
  {
    id: 1,
    name: "Margot Pell",
    initials: "MP",
    relation: "Clem's godmother",
    date: "2027-03-02",
    text: "I held you at your christening, Clem, and you slept through all of it. I will try very hard not to cry at the barn.",
  },
]

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const NAV_LINK = `inline-flex h-11 items-center font-mono text-label text-foreground underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const TEXT_LINK = `text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`

const NAV = [
  { label: "Reply", href: "/rsvp" },
  { label: "Gifts", href: "/gifts" },
  { label: "The day", href: "/day" },
  { label: "Guestbook", href: "/guestbook" },
]

function writtenDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0].toUpperCase())
    .join("")
}

function ErrorLine({ id, text }: { id: string; text: string }) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 font-mono text-label text-destructive"
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

export function App() {
  const [messages, setMessages] = useState<Message[]>(FIRST_MESSAGES)
  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [text, setText] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sends, setSends] = useState(0)
  const [thanked, setThanked] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)
  const focusNext = useRef<"name" | "message" | null>(null)

  // Runs after the render that added the error lines, so they are in the
  // page when focus lands on the field.
  useEffect(() => {
    if (focusNext.current === "name") nameRef.current?.focus()
    if (focusNext.current === "message") textRef.current?.focus()
    focusNext.current = null
  }, [sends])

  useEffect(() => {
    if (thanked !== null) thanksRef.current?.focus()
  }, [thanked])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanRelation = relation.trim()
    const cleanText = text.trim()

    const found: Errors = {}
    if (cleanName === "") {
      found.name = "Write your name, so they know who it is from."
    }
    if (cleanText === "") {
      found.message = "Write a message. A line or two is plenty."
    }

    if (found.name || found.message) {
      focusNext.current = found.name ? "name" : "message"
      setErrors(found)
      setSends((count) => count + 1)
      return
    }

    setErrors({})
    setMessages((list) => [
      {
        id: list.length + 1,
        name: cleanName,
        initials: initialsOf(cleanName),
        relation: cleanRelation === "" ? null : cleanRelation,
        date: null,
        text: cleanText,
      },
      ...list,
    ])
    setThanked(cleanName)
  }

  const left = MESSAGE_LIMIT - text.length
  const count = messages.length

  return (
    <div className="min-h-screen bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1088px] flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <a
            href="/"
            className={`inline-flex h-11 items-center font-heading text-h2 text-foreground ${FOCUS}`}
          >
            Clem &amp; Rafe
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-wrap gap-x-6">
              {NAV.map((item) => (
                <li key={item.href}>
                  {item.href === "/guestbook" ? (
                    <a
                      href={item.href}
                      aria-current="page"
                      className={`${NAV_LINK} underline`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <a href={item.href} className={NAV_LINK}>
                      {item.label}
                    </a>
                  )}
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
                {count === 1 ? "1 message" : `${count} messages`}
              </p>
            </div>
            <ul className="flex flex-col gap-6">
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
                      <h3 className="text-body text-foreground">
                        {message.name}
                      </h3>
                      <p className="font-mono text-label text-muted-foreground tabular-nums">
                        {message.relation !== null && `${message.relation} · `}
                        {message.date === null ? (
                          "Just now"
                        ) : (
                          <time dateTime={message.date}>
                            {writtenDate(message.date)}
                          </time>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-body text-foreground">{message.text}</p>
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
              {thanked === null && (
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
                        setErrors((now) => ({ ...now, name: undefined }))
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={
                        errors.name ? "guest-name-error" : undefined
                      }
                      className="h-11 rounded-md px-3 text-body md:text-body"
                    />
                    {errors.name && (
                      <ErrorLine id="guest-name-error" text={errors.name} />
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
                      {'Like "Rafe\'s cousin" or "the neighbours at number 4"'}
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
                      ref={textRef}
                      id="guest-message"
                      name="message"
                      maxLength={MESSAGE_LIMIT}
                      value={text}
                      onChange={(event) => {
                        setText(event.target.value)
                        setErrors((now) => ({ ...now, message: undefined }))
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
                      {left === 1
                        ? "1 character left"
                        : `${left} characters left`}
                    </p>
                    {errors.message && (
                      <ErrorLine
                        id="guest-message-error"
                        text={errors.message}
                      />
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
                {thanked !== null && (
                  <div className="flex flex-col gap-3">
                    <h3
                      ref={thanksRef}
                      tabIndex={-1}
                      className="text-h2 text-foreground focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                    >
                      Thank you, {thanked}
                    </h3>
                    <p className="text-body text-foreground">
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
            <p className="font-mono text-label text-muted-foreground">
              Questions:{" "}
              <a href="mailto:hello@clemandrafe.example" className={TEXT_LINK}>
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
