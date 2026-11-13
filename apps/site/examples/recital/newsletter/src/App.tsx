import { useEffect, useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const labelMuted = "font-mono text-label text-muted-foreground"

const recentLetters = [
  {
    title: "The plank that would not bend",
    date: "2026-11-08",
    shown: "8 November 2026",
  },
  {
    title: "Forty-one meanings of set",
    date: "2026-10-25",
    shown: "25 October 2026",
  },
  {
    title: "A pear tree planted for someone else",
    date: "2026-10-11",
    shown: "11 October 2026",
  },
  {
    title: "What the slow weeks are for",
    date: "2026-09-27",
    shown: "27 September 2026",
  },
  {
    title: "Notes from a loom in the attic",
    date: "2026-09-13",
    shown: "13 September 2026",
  },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (subscribed) headingRef.current?.focus()
  }, [subscribed])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    setEmail(value)
    if (value === "") {
      setError("Enter your email address to subscribe.")
      emailRef.current?.focus()
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter an email address in the form name@example.com.")
      emailRef.current?.focus()
      return
    }
    setError(null)
    setSubscribed(true)
  }

  function focusSignUp() {
    if (subscribed) headingRef.current?.focus({ preventScroll: true })
    else emailRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
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
        {/* 2. Opening */}
        <div className="mx-auto max-w-lg pt-24">
          <p className={labelMuted}>A letter every other Sunday</p>
          <h1 className="mt-4 text-h1 md:text-display">
            Letters about work that takes years
          </h1>
          <p className="mt-6">
            Every other Sunday you get one long letter about something being
            made slowly: a boat, a dictionary, a garden, a family history. It is
            written by Ines Halloway, who has spent six years building a wooden
            boat in a shed behind her house.
          </p>
        </div>

        {/* 3. Sign-up form */}
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
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError(null)
                }}
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
                <Button
                  type="submit"
                  className="h-auto rounded-md px-6 py-2 font-mono text-label"
                >
                  Subscribe
                </Button>
              </div>
              <p className={cn("mt-4", labelMuted)}>
                Free · Every other Sunday · Leave with one click
              </p>
            </form>
          )}
          <div role="status">
            {subscribed && (
              <>
                <h2
                  ref={headingRef}
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

        {/* 4. From the last letter */}
        <div className="mx-auto mt-24 max-w-lg">
          <p className={labelMuted}>
            Letter 112 · <time dateTime="2026-11-08">8 November 2026</time>
          </p>
          <h2 className="mt-2 text-h2">The plank that would not bend</h2>
          <p className="mt-4">
            The garboard plank is the first one fitted against the keel, and on
            this boat it has to twist almost a quarter turn over nine feet. I
            steamed it for two hours on Saturday, carried it from the box to
            the hull in under a minute, and it cracked along the grain before I
            had the second clamp on.
          </p>
          <p className="mt-6">
            That was the third one. The larch came from a yard in the hills, and
            I had been told it was air-dried for two years. It was not. You can
            hear it, if you know to listen: a dry board rings when you tap it,
            and this one only thudded.
          </p>
          <p className="mt-6">
            So the work this week was not building. It was ordering more timber,
            stacking it with sticks between the boards, and <em>waiting</em>,
            which is most of what building a boat turns out to be.
          </p>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              I used to count the years as lost; now I count them as the part of
              the job nobody photographs.
            </p>
          </blockquote>
          <p className="mt-6">
            <a href="#" className={textLink}>
              Read the whole letter
            </a>
          </p>
        </div>

        {/* 5. What you get */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">What you get</h2>
          <ul className="mt-6">
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">One long letter</h3>
              <p className="mt-2">
                About 2,000 words every other Sunday on one piece of slow work,
                written to be read with a cup of coffee rather than on the way
                to somewhere.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">
                One thing from someone else
              </h3>
              <p className="mt-2">
                At the end of each letter, a link to an essay, a book or a film
                by another person who took their time over something.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">No advertising</h3>
              <p className="mt-2">
                There are no sponsors and no tracking pixels. Your address is
                used to send the letter and for nothing else.
              </p>
            </li>
          </ul>
        </div>

        {/* 6. Readers */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">From readers</h2>
          <blockquote className="mt-6 mb-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              It is the one email I save for the weekend, and I read every word.
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Tomasz, piano tuner
            </footer>
          </blockquote>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              I started a vegetable bed because of the garden letters. Three
              years on, it finally grows something.
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Renata, school librarian
            </footer>
          </blockquote>
        </div>

        {/* 7. The writer */}
        <div className="mx-auto mt-24 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className={labelMuted}>Who writes it</p>
            <h2 className="mt-2 text-h2">Ines Halloway</h2>
            <p className="mt-4">
              Ines worked for twelve years as a copy editor for a dictionary
              publisher before she started building a boat. She lives on the
              coast with a dog and an unfinished hull, and has written The Long
              Margin since 2022.
            </p>
          </aside>
        </div>

        {/* 8. Recent letters */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Recent letters</h2>
          <ul className="mt-6">
            {recentLetters.map((letter) => (
              <li
                key={letter.date}
                className="border-t py-4 md:flex md:items-baseline md:justify-between md:gap-6"
              >
                <a href="#" className={plainLink}>
                  {letter.title}
                </a>
                <p className={cn("mt-2 md:mt-0 md:shrink-0", labelMuted)}>
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
            If you would like the next letter, leave your address at the top of
            the page.
          </p>
          <p className="mt-4">
            <a
              href="#subscribe"
              onClick={focusSignUp}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-auto rounded-md px-6 py-2 font-mono text-label"
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
            A free letter about slow work, sent every other Sunday to about
            4,000 readers.
          </p>
          <p className={cn("mt-6", labelMuted)}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
