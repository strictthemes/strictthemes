import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const chromeLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const navLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Book a table", href: "/booking" },
  { label: "Journal", href: "/journal" },
  { label: "Visit", href: "/visit" },
]

const seasonal = [
  {
    kind: "Tea",
    name: "Pear and ginger tisane",
    text: "Dried pear, fresh ginger and a little lemon peel, steeped for five minutes. No caffeine, so it suits a late afternoon.",
    price: "£4.20 a pot",
    picture: "A brown teapot beside a bowl of dried pear slices and ginger root",
  },
  {
    kind: "Plate",
    name: "Roast squash and lentil soup",
    text: "Squash from a farm outside the village, roasted with cumin and simmered with red lentils. Served with a thick slice of rye bread.",
    price: "£7.50 with rye bread",
    picture: "A bowl of orange soup with a slice of dark rye bread on a wooden board",
  },
  {
    kind: "Cake",
    name: "Pear and cardamom loaf",
    text: "A loaf cake with chopped pear and ground cardamom, baked each morning and cut thick.",
    price: "£3.60 a slice",
    picture: "A slice of pear loaf on a small plate with a fork beside it",
  },
]

const hours = [
  { day: "Tuesday to Friday", open: "09:00", openText: "9:00", close: "17:00" },
  { day: "Saturday", open: "09:00", openText: "9:00", close: "18:00" },
  { day: "Sunday", open: "10:00", openText: "10:00", close: "16:00" },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Newsletter() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (done) headingRef.current?.focus()
  }, [done])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    let message: string | null = null
    if (value === "") message = "Write your email address."
    else if (!emailPattern.test(value))
      message = "Check the email address: it needs an @ and a domain."

    if (message) {
      setError(message)
      inputRef.current?.focus()
      return
    }
    setError(null)
    setDone(true)
  }

  return (
    <div className="rounded-xl border bg-card p-6 md:col-span-7">
      <p className="font-mono text-label text-muted-foreground">
        Four letters a year
      </p>
      <h2 className="mt-2 text-h2">News from the room</h2>
      <p className="mt-4 max-w-xl">
        A short letter when the season&apos;s teas come in, and nothing else.
      </p>

      {!done && (
        <form className="mt-6" noValidate onSubmit={handleSubmit}>
          <label
            htmlFor="newsletter-email"
            className="block font-mono text-label text-foreground"
          >
            Email address
          </label>
          <div className="mt-2 md:flex md:items-start md:gap-4">
            <div className="md:flex-1">
              <Input
                ref={inputRef}
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError(null)
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-email-error" : undefined}
                className="h-auto rounded-md px-4 py-2 text-body md:text-body"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="mt-4 h-auto rounded-md px-6 py-2 font-mono text-label md:mt-0"
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
        {done && (
          <div className="mt-6">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
            >
              You are on the list
            </h3>
            <p className="mt-4 max-w-xl">
              The next letter comes when the winter teas arrive, in{" "}
              <time dateTime="2026-12">December</time>.
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
        <a href="/" className={cn("font-heading text-h2", chromeLink)}>
          The Linden Room
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={cn("text-body", chromeLink)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section className="grid gap-6 pt-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <p className="font-mono text-label text-muted-foreground">
              Tea room and shop · Ashby Wold
            </p>
            <h1 className="mt-2 text-h1 md:text-display">
              Tea, soup and cake, made slowly
            </h1>
            <p className="mt-4 max-w-xl text-body">
              A tea room and shop in the old seed merchant&apos;s on Mill Lane,
              pouring loose-leaf tea and herbal tisanes, serving soup at lunch
              and selling the same teas by weight.
            </p>
            <p className="mt-6">
              <a
                href="/booking"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto rounded-md px-6 py-2 font-mono text-label"
                )}
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
            <figcaption className="mt-2 font-mono text-label text-muted-foreground">
              The window seat, Mill Lane
            </figcaption>
          </figure>
        </section>

        <section className="mt-18">
          <h2 className="text-h2">In season</h2>
          <p className="mt-4 max-w-xl">
            On the first Tuesday of each month we change one tea, one plate
            and one cake to follow what the farms nearby are picking.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {seasonal.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <div
                  role="img"
                  aria-label={item.picture}
                  className="aspect-3/2 bg-muted"
                />
                <div className="p-6">
                  <p className="font-mono text-label text-muted-foreground">
                    {item.kind}
                  </p>
                  <h3 className="mt-2 text-h2">{item.name}</h3>
                  <p className="mt-4">{item.text}</p>
                  <p className="mt-4 font-mono text-label text-foreground tabular-nums">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6">
            <a href="/menu" className={textLink}>
              See the whole menu
            </a>
          </p>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-label text-muted-foreground">
              Since 2019
            </p>
            <p className="mt-2 font-heading text-h2">
              We pour at the seed merchant&apos;s old oak counter, from cups
              thrown at a pottery two streets away, and weigh out the teas you
              take home at the same counter.
            </p>
            <p className="mt-4">
              <a href="/visit" className={textLink}>
                How to find us
              </a>
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="text-h2">Opening hours</h2>
            <ul className="mt-6 divide-y">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <span className="text-body">{row.day}</span>
                  <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                    <time dateTime={row.open}>{row.openText}</time>–
                    <time dateTime={row.close}>{row.close}</time>
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 py-2">
                <span className="text-body">Monday</span>
                <span className="shrink-0 font-mono text-label text-foreground tabular-nums">
                  Closed
                </span>
              </li>
            </ul>
            <p className="mt-4 max-w-xl">
              Lunch is served from <time dateTime="11:30">11:30</time> to{" "}
              <time dateTime="14:30">14:30</time>, and cakes until they run
              out.
            </p>
          </div>
        </section>

        <section className="mt-18 grid gap-6 md:grid-cols-12">
          <Newsletter />
        </section>
      </main>

      <footer className="mt-18">
        <div className="border-t py-10">
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">The Linden Room</p>
              <p className="mt-2 max-w-xl">
                A tea room and shop in a former seed merchant&apos;s, open six
                days a week.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <address className="not-italic">
                <span className="block">14 Mill Lane</span>
                <span className="block">Ashby Wold</span>
                <span className="block">AW3 7LN</span>
              </address>
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Tuesday to Sunday · Closed Mondays
              </p>
            </div>
          </div>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Linden Room
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
