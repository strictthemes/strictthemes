import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const buttonClasses = "h-auto rounded-md px-6 py-2 font-mono text-label"

const navLinks = [
  { href: "/menu", text: "Menu" },
  { href: "/booking", text: "Book a table" },
  { href: "/journal", text: "Journal" },
  { href: "/visit", text: "Visit" },
]

const seasonal = [
  {
    kind: "Tea",
    name: "Pear and ginger tisane",
    text: "Dried pear, fresh ginger and a little lemon peel. Caffeine free, and good after a walk in the cold.",
    price: "£4.20 a pot",
    picture: "A brown teapot and a cup of pale amber tisane on a wooden tray",
  },
  {
    kind: "Plate",
    name: "Roast squash and lentil soup",
    text: "Squash from a farm outside the village, red lentils and a spoon of chilli oil. Served at lunch only.",
    price: "£7.50 with rye bread",
    picture: "A bowl of orange soup beside two slices of dark rye bread",
  },
  {
    kind: "Cake",
    name: "Pear and cardamom loaf",
    text: "A plain loaf cake with poached pear through it, baked each morning and sliced thick.",
    price: "£3.60 a slice",
    picture: "A thick slice of loaf cake on a small plate, with pear showing in the crumb",
  },
]

const hours = [
  { day: "Tuesday to Friday", open: "09:00", openText: "9:00", close: "17:00" },
  { day: "Saturday", open: "09:00", openText: "9:00", close: "18:00" },
  { day: "Sunday", open: "10:00", openText: "10:00", close: "16:00" },
]

function isWellFormedEmail(value: string) {
  if (/\s/.test(value)) return false
  const parts = value.split("@")
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local) return false
  const dot = domain.indexOf(".")
  return dot > 0 && dot < domain.length - 1
}

function Newsletter() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sent) headingRef.current?.focus()
  }, [sent])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    let message: string | null = null
    if (value === "") {
      message = "Write your email address."
    } else if (!isWellFormedEmail(value)) {
      message = "Check the email address: it needs an @ and a domain."
    }
    setError(message)
    if (message) {
      inputRef.current?.focus()
      return
    }
    setSent(true)
  }

  return (
    <div className="rounded-xl border bg-card p-6 md:col-span-7">
      <p className={label}>Four letters a year</p>
      <h2 className="mt-2 text-h2">News from the room</h2>
      <p className="mt-4 max-w-xl">
        A short letter when the season&apos;s teas come in, and nothing else.
      </p>
      {!sent && (
        <form className="mt-6" noValidate onSubmit={handleSubmit}>
          <label
            htmlFor="newsletter-email"
            className="block font-mono text-label text-foreground"
          >
            Email address
          </label>
          <div className="mt-2 md:flex md:gap-4">
            <div className="md:flex-1">
              <Input
                ref={inputRef}
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError(null)
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-email-error" : undefined}
                className="h-auto rounded-md px-4 py-2 text-body md:text-body"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className={cn(buttonClasses, "mt-4 md:mt-0")}
            >
              Sign up
            </Button>
          </div>
          {error && (
            <p
              id="newsletter-email-error"
              className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
            >
              <CircleAlert
                className="size-4 shrink-0"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span>{error}</span>
            </p>
          )}
        </form>
      )}
      <div role="status">
        {sent && (
          <div className="mt-6">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              You are on the list
            </h3>
            <p className="mt-4 max-w-xl">
              The next letter comes when the winter teas arrive, in December.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1120px] px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(headerLink, "font-heading text-h2")}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={cn(headerLink, "text-body")}>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid grid-cols-1 gap-6 pt-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <p className={label}>Tea room and shop · Ashby Wold</p>
            <h1 className="mt-2 text-h1 md:text-display">
              Tea, soup and cake, made slowly
            </h1>
            <p className="mt-4 max-w-xl text-body">
              The Linden Room is a tea room and tea shop in the old seed
              merchant&apos;s on Mill Lane, serving loose-leaf tea, lunch and
              cake, and selling the same teas by weight.
            </p>
            <p className="mt-6">
              <a
                href="/booking"
                className={cn(buttonVariants({ variant: "default" }), buttonClasses)}
              >
                Book a table
              </a>
            </p>
          </div>
          <figure className="md:col-span-5 md:col-start-8">
            <div
              role="img"
              aria-label="The window seat on a grey morning, a pot of tea on the sill"
              className="aspect-4/3 rounded-xl bg-muted"
            />
            <figcaption className={cn(label, "mt-2")}>
              The window seat, Mill Lane
            </figcaption>
          </figure>
        </section>

        <section className="mt-18">
          <h2 className="text-h2">In season</h2>
          <p className="mt-4 max-w-xl">
            The tisane, the soup and the cake change on the first of each
            month, with what the growers nearby have to hand.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {seasonal.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div
                  role="img"
                  aria-label={item.picture}
                  className="aspect-3/2 bg-muted"
                />
                <div className="p-6">
                  <p className={label}>{item.kind}</p>
                  <h3 className="mt-2 text-h2">{item.name}</h3>
                  <p className="mt-4">{item.text}</p>
                  <p className="mt-4 font-mono text-label text-foreground tabular-nums">
                    {item.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6">
            <a href="/menu" className={textLink}>
              See the whole menu
            </a>
          </p>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className={label}>Since 2019</p>
            <p className="mt-2 max-w-xl font-heading text-h2">
              The counter is the seed merchant&apos;s old one, and we still
              weigh the teas out on it. The cups are thrown at a pottery two
              streets away.
            </p>
            <p className="mt-4">
              <a href="/visit" className={textLink}>
                How to find us
              </a>
            </p>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="text-h2">Opening hours</h2>
            <ul className="mt-6 divide-y">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <span>{row.day}</span>
                  <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                    <time dateTime={row.open}>{row.openText}</time>–
                    <time dateTime={row.close}>{row.close}</time>
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 py-2">
                <span>Monday</span>
                <span className="shrink-0 font-mono text-label text-foreground">
                  Closed
                </span>
              </li>
            </ul>
            <p className="mt-4 max-w-xl">
              Lunch is served from{" "}
              <time dateTime="11:30">11:30</time>{" "}
              to{" "}
              <time dateTime="14:30">14:30</time>
              , and cakes until they run out.
            </p>
          </div>
        </section>

        <section className="mt-18 grid grid-cols-1 gap-6 md:grid-cols-12">
          <Newsletter />
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop in a former seed merchant&apos;s, with tea
                by the pot and by weight.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className={cn(label, "mt-4")}>
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className={cn(label, "mt-6")}>© 2026 The Linden Room</p>
        </div>
      </footer>
    </div>
  )
}

export default App
