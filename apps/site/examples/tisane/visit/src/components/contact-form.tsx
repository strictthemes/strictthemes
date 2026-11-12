import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Field = "name" | "email" | "about" | "message"
type Errors = Partial<Record<Field, string>>

const fieldOrder: Field[] = ["name", "email", "about", "message"]

const fieldClasses = "mt-2 h-auto rounded-md px-4 py-2 text-body md:text-body"
const labelClasses = "block font-mono text-label text-foreground"
const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Write your name."
  const email = values.email.trim()
  if (!email) errors.email = "Write your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Check the email address: it needs an @ and a domain."
  if (!values.about) errors.about = "Choose what your message is about."
  if (!values.message.trim()) errors.message = "Write a message."
  return errors
}

function ErrorLine({ id, message }: { id: string; message?: string }) {
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

export function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    about: "",
    message: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [sentTo, setSentTo] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const aboutRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)

  const refs = {
    name: nameRef,
    email: emailRef,
    about: aboutRef,
    message: messageRef,
  }

  useEffect(() => {
    if (sentTo) thanksRef.current?.focus()
  }, [sentTo])

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = fieldOrder.find((field) => found[field])
    if (first) {
      refs[first].current?.focus()
      return
    }
    setSentTo(values.email.trim())
  }

  function fieldProps(field: Field) {
    const errorId = `contact-${field}-error`
    return {
      id: `contact-${field}`,
      name: field,
      value: values[field],
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? errorId : undefined,
    }
  }

  return (
    <div className="mt-6 rounded-xl border bg-card p-6">
      {sentTo === null && (
        <form noValidate aria-label="Write to us" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className={labelClasses}>
              Your name
            </label>
            <Input
              {...fieldProps("name")}
              ref={nameRef}
              autoComplete="name"
              className={fieldClasses}
              onChange={(event) => update("name", event.target.value)}
            />
            <ErrorLine id="contact-name-error" message={errors.name} />
          </div>

          <div className="mt-6">
            <label htmlFor="contact-email" className={labelClasses}>
              Email address
            </label>
            <Input
              {...fieldProps("email")}
              ref={emailRef}
              type="email"
              autoComplete="email"
              className={fieldClasses}
              onChange={(event) => update("email", event.target.value)}
            />
            <ErrorLine id="contact-email-error" message={errors.email} />
          </div>

          <div className="mt-6">
            <label htmlFor="contact-about" className={labelClasses}>
              About
            </label>
            <select
              {...fieldProps("about")}
              ref={aboutRef}
              className={`mt-2 h-auto w-full rounded-md border border-input bg-card px-4 py-2 text-body text-foreground aria-invalid:border-destructive ${focusOutline}`}
              onChange={(event) => update("about", event.target.value)}
            >
              <option value="">Choose a subject</option>
              <option value="booking">A booking</option>
              <option value="tea">Buying tea</option>
              <option value="access">Access</option>
              <option value="other">Something else</option>
            </select>
            <ErrorLine id="contact-about-error" message={errors.about} />
          </div>

          <div className="mt-6">
            <label htmlFor="contact-message" className={labelClasses}>
              Message
            </label>
            <Textarea
              {...fieldProps("message")}
              ref={messageRef}
              className={`${fieldClasses} min-h-48`}
              onChange={(event) => update("message", event.target.value)}
            />
            <ErrorLine id="contact-message-error" message={errors.message} />
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
        {sentTo !== null && (
          <div>
            <h3
              ref={thanksRef}
              tabIndex={-1}
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              Thank you
            </h3>
            <p className="mt-4 max-w-xl">
              We will write back to {sentTo} within two days.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
