import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const buttonClasses = "h-auto rounded-md px-6 py-2 font-mono text-label"

const label = "font-mono text-label text-muted-foreground"

const recentLetters = [
  {
    number: 112,
    title: "Six years of planking",
    date: "2026-11-08",
    shown: "8 November 2026",
  },
  {
    number: 111,
    title: "The word that took a decade to define",
    date: "2026-10-25",
    shown: "25 October 2026",
  },
  {
    number: 110,
    title: "A pear tree planted for someone else",
    date: "2026-10-11",
    shown: "11 October 2026",
  },
  {
    number: 109,
    title: "On sharpening the same chisel every morning",
    date: "2026-09-27",
    shown: "27 September 2026",
  },
  {
    number: 108,
    title: "The map that was finished after its maker died",
    date: "2026-09-13",
    shown: "13 September 2026",
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (subscribed) confirmationRef.current?.focus()
  }, [subscribed])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (value === "") {
      setError("Enter your email address to subscribe.")
      emailRef.current?.focus()
      return
    }
    if (!emailPattern.test(value)) {
      setError(
        "Check the address: it needs an @ and a domain, as in name@example.com."
      )
      emailRef.current?.focus()
      return
    }
    setError(null)
    setSubscribed(true)
  }

  function focusSignUp() {
    if (subscribed) {
      confirmationRef.current?.focus({ preventScroll: true })
    } else {
      emailRef.current?.focus({ preventScroll: true })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(plainLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/archive" className={plainLink}>
            Archive
          </a>
          <a href="/about" className={plainLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <div className="mx-auto max-w-lg pt-24">
          <p className={label}>A letter every other Sunday</p>
          <h1 className="mt-4 text-h1 md:text-display">
            Notes on work that takes years
          </h1>
          <p className="mt-6">
            Every other Sunday you get one long letter about something being
            made slowly: a boat, a dictionary, a garden, a map. It is written by
            Ida Marlow, who has spent the last nine years visiting the people
            who make them and writing down what they say.
          </p>
        </div>

        <div id="subscribe" className="mx-auto mt-12 max-w-lg scroll-mt-6">
          {!subscribed && (
            <form noValidate onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="block font-mono text-label text-foreground"
              >
                Email address
              </label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onInput={() => setError(null)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "email-error" : undefined}
                className="mt-2 h-auto rounded-md border-muted-foreground px-4 py-2 text-body md:text-body"
              />
              {error && (
                <p
                  id="email-error"
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
              <div className="mt-4">
                <Button type="submit" className={buttonClasses}>
                  Subscribe
                </Button>
              </div>
              <p className={cn(label, "mt-4")}>
                Free · Every other Sunday · Leave with one click
              </p>
            </form>
          )}
          <div role="status">
            {subscribed && (
              <>
                <h2
                  ref={confirmationRef}
                  tabIndex={-1}
                  className="text-h2 focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
                >
                  You are on the list
                </h2>
                <p className="mt-4">
                  The next letter arrives in your inbox within two weeks, on a
                  Sunday morning.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <p className={label}>
            Letter 112 · <time dateTime="2026-11-08">8 November 2026</time>
          </p>
          <h2 className="mt-2 text-h2">Six years of planking</h2>
          <p className="mt-4">
            Tomas Berg started the boat in his barn in the spring of 2020, with
            a set of plans bought from a widow in Bergen and a stack of larch
            he had been drying for four years before that. He works on it on
            Saturdays and in the long evenings of June. In winter the glue will
            not set, so he sharpens tools and reads.
          </p>
          <p className="mt-6">
            When I visited in October he had just fitted the last plank on the
            port side. It had taken him three weekends. The first attempt split
            along the grain, and the second came out a few millimetres short at
            the stern, which nobody but him would ever see.
          </p>
          <p className="mt-6">
            He made it a third time anyway. &ldquo;I will be looking at that
            joint for thirty years,&rdquo; he said. Then, after a pause:{" "}
            <em>&ldquo;If I am lucky.&rdquo;</em>
          </p>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              A boat that takes six years to build is not late; it is simply
              the size of a boat that takes six years.
            </p>
          </blockquote>
          <p className="mt-6">
            <a href="/archive/112" className={textLink}>
              Read the whole letter
            </a>
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">What you get</h2>
          <ul className="mt-6">
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">One long letter</h3>
              <p className="mt-2">
                About 2,500 words on one piece of slow work, written from a
                visit to the person doing it.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">
                One thing worth reading
              </h3>
              <p className="mt-2">
                At the end of each letter, a link to something by someone else
                that I read twice, with a line on why.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">No advertising</h3>
              <p className="mt-2">
                No sponsors and no tracking pixels. The letter is paid for by
                the readers who choose to give, and sent to everyone.
              </p>
            </li>
          </ul>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">From readers</h2>
          <blockquote className="mt-6 mb-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              I read it on Sunday with the second cup of coffee, and it is the
              only email I have never once skimmed.
            </p>
            <footer className={cn(label, "mt-4 not-italic")}>
              Hanne, a hospital pharmacist
            </footer>
          </blockquote>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              The letter on the dictionary made me finish a quilt I had left in
              a cupboard for eleven years.
            </p>
            <footer className={cn(label, "mt-4 not-italic")}>
              Rafael, a secondary school teacher
            </footer>
          </blockquote>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className={label}>Who writes it</p>
            <h2 className="mt-2 text-h2">Ida Marlow</h2>
            <p className="mt-4">
              Ida worked for twelve years as a copy editor at a regional
              newspaper before she began writing these letters in 2017. She
              lives near the coast with a slow dog and a vegetable garden that
              is, by her own count, four years behind schedule.
            </p>
          </aside>
        </div>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Recent letters</h2>
          <ul className="mt-6">
            {recentLetters.map((letter) => (
              <li
                key={letter.number}
                className="border-t py-4 md:flex md:items-baseline md:justify-between md:gap-6"
              >
                <a href={`/archive/${letter.number}`} className={plainLink}>
                  {letter.title}
                </a>
                <p className={cn(label, "mt-2 md:mt-0 md:shrink-0")}>
                  <time dateTime={letter.date}>{letter.shown}</time>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a href="/archive" className={textLink}>
              See the archive
            </a>
          </p>

          <p className="mt-12">
            If you would like the next one, it comes free every other Sunday.
          </p>
          <p className="mt-4">
            <a
              href="#subscribe"
              onClick={focusSignUp}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                buttonClasses
              )}
            >
              Subscribe
            </a>
          </p>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A letter about slow work, sent every other Sunday to about 4,000
            readers.
          </p>
          <p className={cn(label, "mt-6")}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
