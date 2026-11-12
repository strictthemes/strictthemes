import { useRef, useState, type FormEvent } from "react"
import { CircleAlert } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const codeFocusRing =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const textLink = cn(
  "text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const buttonClasses = "h-auto rounded-md px-6 py-2 font-mono text-label"

const recentLetters = [
  {
    title: "Six years of oak and patience",
    date: "2026-03-01",
    label: "1 March 2026",
  },
  {
    title: "The editor who read every slip",
    date: "2026-02-15",
    label: "15 February 2026",
  },
  {
    title: "A hedge planted for someone else",
    date: "2026-02-01",
    label: "1 February 2026",
  },
  {
    title: "Counting the stitches in a sail",
    date: "2026-01-18",
    label: "18 January 2026",
  },
  {
    title: "What the slow printer kept",
    date: "2026-01-04",
    label: "4 January 2026",
  },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function App() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLHeadingElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
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
    requestAnimationFrame(() => confirmRef.current?.focus())
  }

  function handleSubscribeLink() {
    if (subscribed) {
      confirmRef.current?.focus({ preventScroll: true })
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
        {/* 2. Opening */}
        <div className="mx-auto max-w-lg pt-24">
          <p className="font-mono text-label text-muted-foreground">
            A letter every other Sunday
          </p>
          <h1 className="mt-4 text-h1 md:text-display">
            Notes on work that takes years
          </h1>
          <p className="mt-6">
            Every other Sunday you get one long letter about something made
            slowly: a boat built in a garage over six years, a dictionary
            edited by hand, a garden planted for the next owner. It is written
            by Maren Holt, who has been sending it since 2019 to about 4,000
            readers. It is free.
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
              <p className="mt-4 font-mono text-label text-muted-foreground">
                Free · Every other Sunday · Leave with one click
              </p>
            </form>
          )}
          <div role="status">
            {subscribed && (
              <>
                <h2
                  ref={confirmRef}
                  tabIndex={-1}
                  className={cn("text-h2", codeFocusRing)}
                >
                  You are on the list
                </h2>
                <p className="mt-4">
                  The next letter arrives in your inbox within two weeks.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 4. From the last letter */}
        <div className="mx-auto mt-24 max-w-lg">
          <p className="font-mono text-label text-muted-foreground">
            Letter 112 · <time dateTime="2026-03-01">1 March 2026</time>
          </p>
          <h2 className="mt-2 text-h2">Six years of oak and patience</h2>
          <p className="mt-4">
            Tomas started the boat in the spring his daughter learned to walk.
            She is in school now, and the hull is planked. He works on it two
            evenings a week and most Saturday mornings, in a garage that is
            forty centimetres too short, so the bow has always stuck out under
            a tarpaulin.
          </p>
          <p className="mt-6">
            He keeps a notebook for every plank: where the oak came from, how
            long it steamed, which way it wanted to twist. Some pages have one
            line. One page has three days of notes about a single plank that
            split twice before it went on.
          </p>
          <p className="mt-6">
            I asked him whether he ever wished it would go faster. He thought
            about it for a while and said no, he only wished he had{" "}
            <em>started</em> sooner. The slow part, he said, is the part he
            would miss.
          </p>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              The boat will float for one summer before someone notices a
              mistake I made in the first month.
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
                About 2,000 words on one person and one piece of slow work,
                written from a visit or a long conversation.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">
                One thing worth reading
              </h3>
              <p className="mt-2">
                A link to an essay, a book or an old article by someone else,
                with a few lines on why it is in the letter.
              </p>
            </li>
            <li className="border-t py-6">
              <h3 className="text-body font-semibold">No advertising</h3>
              <p className="mt-2">
                No sponsors and no tracking links. Your address is used for the
                letter and nothing else.
              </p>
            </li>
          </ul>
        </div>

        {/* 6. Readers */}
        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">From readers</h2>
          <blockquote className="mt-6 mb-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              I read it on Sunday evenings with the radio off. It is the one
              email I save.
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Ilse, a hospital pharmacist
            </footer>
          </blockquote>
          <blockquote className="my-12 border-l-2 border-primary pl-6">
            <p className="font-heading text-h2 font-normal italic">
              The letter about the dictionary made me go back to a quilt I had
              left in a cupboard for nine years.
            </p>
            <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
              Ruairi, a secondary school teacher
            </footer>
          </blockquote>
        </div>

        {/* 7. The writer */}
        <div className="mx-auto mt-24 max-w-lg">
          <aside className="mb-12 rounded-xl border bg-card p-6">
            <p className="font-mono text-label text-muted-foreground">
              Who writes it
            </p>
            <h2 className="mt-2 text-h2">Maren Holt</h2>
            <p className="mt-4">
              Maren worked as a copy editor at a regional paper for twelve
              years. She started the letter after writing a piece about a
              clockmaker that the paper had no room for. She lives on the
              coast and is, slowly, restoring a rowing boat of her own.
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
                <p className="mt-2 font-mono text-label text-muted-foreground md:mt-0 md:shrink-0">
                  <time dateTime={letter.date}>{letter.label}</time>
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
            If you would like the next one, leave your address and it will
            arrive on a Sunday.
          </p>
          <p className="mt-4">
            <a
              href="#subscribe"
              onClick={handleSubscribeLink}
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
            A free letter every other Sunday about work that takes a long time.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 The Long Margin · Maren Holt
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
