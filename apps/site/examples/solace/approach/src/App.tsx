import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

const navLink = cn(
  "inline-flex h-11 items-center text-body text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const navItems = [
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Fees", href: "/fees" },
  { label: "First session", href: "/first-session" },
]

const current = "/approach"

const contents = [
  { id: "before", label: "Before we meet" },
  { id: "first-session", label: "The first session" },
  { id: "after", label: "After that" },
  { id: "in-their-words", label: "What a client said" },
  { id: "not-offered", label: "What I do not offer" },
]

const firstSession = [
  {
    label: "First 10 minutes",
    text: "We settle in. I explain confidentiality and its few limits, and you can ask about anything on this page.",
  },
  {
    label: "Middle 30 minutes",
    text: "You talk about what brings you, in any order. I may ask a question now and then. Silence is allowed.",
  },
  {
    label: "Last 10 minutes",
    text: "We stop and look at how it was. I say what I heard, and we each say whether we would like to go on.",
  },
]

const notOffered = [
  "Emergency or crisis support. I cannot respond quickly, and I am not available between sessions.",
  "Diagnosis, medication or medical advice. Your doctor is the right person for those.",
  "Couples or family therapy. I work with one person at a time.",
  "Work with anyone under 18.",
  "Reports for courts, employers or insurers.",
]

function NavLinks() {
  return (
    <>
      {navItems.map((item) => {
        const isCurrent = item.href === current
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(navLink, isCurrent && "underline")}
            >
              {item.label}
            </a>
          </li>
        )
      })}
    </>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1136px] px-4 text-body text-foreground md:px-7">
      <header className="flex flex-wrap items-center gap-x-7 py-4">
        <a
          href="/"
          className={cn(
            "inline-flex h-11 items-center font-heading text-h2 text-foreground transition-colors duration-150",
            focus
          )}
        >
          Nora Ellingham
        </a>
        <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
          <ul className="flex flex-wrap gap-x-4 md:gap-x-7">
            <NavLinks />
          </ul>
        </nav>
      </header>

      <main>
        <section
          aria-labelledby="page-title"
          className="mt-12 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-7"
        >
          <p className="font-mono text-label text-muted-foreground md:col-span-12">
            How I work · About 3 minutes to read
          </p>
          <h1
            id="page-title"
            className="mt-4 text-h1 md:col-span-9 md:text-display"
          >
            How we would <em className="italic">work together</em>
          </h1>
          <p className="mt-7 max-w-xl text-body md:col-span-7 md:col-start-1">
            This page says what a session is like, from the first call to the
            last meeting. Read as much of it as helps. You can also just ask
            me.
          </p>
        </section>

        <section
          aria-label="How sessions work"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <nav
            aria-labelledby="contents-title"
            className="rounded-xl border border-border bg-card p-7 md:sticky md:top-7 md:col-span-4 md:col-start-9 md:row-start-1 md:self-start"
          >
            <h2 id="contents-title" className="text-h2">
              On this page
            </h2>
            <ol className="mt-4 list-none p-0">
              {contents.map((item, i) => (
                <li key={item.id} className={cn(i > 0 && "mt-2")}>
                  <a href={`#${item.id}`} className={cn(textLink, "text-body")}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 md:col-span-7 md:row-start-1 md:mt-0">
            <h2 id="before" className="scroll-mt-7 text-h2">
              Before we meet
            </h2>
            <p className="mt-4 max-w-xl text-body">
              It starts with a call of 20 minutes, by phone or video. It is
              free.
            </p>
            <p className="mt-4 max-w-xl text-body">
              You can tell me a little about what is going on, and ask me
              anything. I will say how I work and whether I think I can help.
              If I am not the right person, I will say so, and where I can I
              will suggest who might be.
            </p>
            <p className="mt-4 max-w-xl text-body">
              Nothing is booked until we have spoken and you have had time to
              think.
            </p>

            <h2 id="first-session" className="mt-12 scroll-mt-7 text-h2">
              The first session
            </h2>
            <p className="mt-4 max-w-xl text-body">
              A first session is 50 minutes, like every session after it. It
              costs the same, £68.
            </p>
            <ol className="mt-7 list-none border-b border-border p-0">
              {firstSession.map((step) => (
                <li
                  key={step.label}
                  className="border-t border-border py-4 md:grid md:grid-cols-7 md:items-baseline md:gap-x-7"
                >
                  <p className="font-mono text-label text-muted-foreground md:col-span-2">
                    {step.label}
                  </p>
                  <p className="mt-2 max-w-xl text-body md:col-span-5 md:mt-0">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-7 max-w-xl text-body">
              You do not have to decide in the room. You can write to me a few
              days later.
            </p>

            <h2 id="after" className="mt-12 scroll-mt-7 text-h2">
              After that
            </h2>
            <p className="mt-4 max-w-xl text-body">
              If we go on, we meet once a week, on the same day and at the same
              time. A steady rhythm matters more than a fast one.
            </p>
            <p className="mt-4 max-w-xl text-body">
              Some people come for eight or ten sessions. Some stay for a year
              or longer. Every sixth session we take a few minutes to ask
              whether this is still useful to you.
            </p>
            <p className="mt-4 max-w-xl text-body">
              You can end at any point. I ask only that we have one last
              session to finish properly, rather than stopping by email.
            </p>

            <h2 id="in-their-words" className="mt-12 scroll-mt-7 text-h2">
              What a client said
            </h2>
            <figure className="mt-7">
              <blockquote className="border-0 p-0">
                <p className="font-heading text-h2 italic">
                  “I kept waiting to be told what was wrong with me. It took a
                  few weeks to notice that nobody was going to, and that I
                  could put things down in that room that I had carried
                  everywhere else.”
                </p>
              </blockquote>
              <figcaption className="mt-4 font-mono text-label text-muted-foreground">
                A client, after a year of weekly sessions. Shared with
                permission, and changed to keep it private.
              </figcaption>
            </figure>
            <p className="mt-7 max-w-xl text-body">
              People say many different things about therapy. This is one of
              them, and it is not a promise of what it would be for you.
            </p>

            <h2 id="not-offered" className="mt-12 scroll-mt-7 text-h2">
              What I do not offer
            </h2>
            <p className="mt-4 max-w-xl text-body">
              It is better to know this before you write.
            </p>
            <ul className="mt-7 max-w-xl list-disc pl-7 text-body">
              {notOffered.map((item, i) => (
                <li key={item} className={cn(i > 0 && "mt-2")}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-xl text-body">
              If you need one of these, tell me when you write. Where I can, I
              will point you towards someone who offers it.
            </p>
            <p className="mt-4 max-w-xl text-body">
              In an emergency, call your local emergency number or go to the
              nearest emergency department.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="action-title"
          className="mt-28 grid grid-cols-1 md:grid-cols-12 md:gap-x-7"
        >
          <div className="rounded-xl border border-border bg-card p-7 md:col-span-7">
            <h2 id="action-title" className="text-h2">
              If this sounds right for you
            </h2>
            <p className="mt-4 max-w-xl text-body">
              Write to me with the form. I reply within two working days. The
              first call is free, and nothing is booked until we have spoken.
            </p>
            <div className="mt-7">
              <a
                href="/first-session"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-auto px-7 py-2 text-body"
                )}
              >
                Request a first session
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-28 border-t border-border py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-7">
          <div className="md:col-span-7">
            <p className="font-heading text-h2">Nora Ellingham</p>
            <p className="mt-2 font-mono text-label text-muted-foreground">
              Registered psychotherapist · Larkmere and online
            </p>
            <address className="mt-7 text-body not-italic">
              The Garden Room, 14 Orchard Row, Larkmere LK2 4DN
            </address>
            <p className="mt-2 text-body">
              <a href="mailto:hello@ellingham.example" className={textLink}>
                hello@ellingham.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-7 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              <NavLinks />
            </ul>
          </nav>
        </div>
        <p className="mt-7 max-w-xl text-body text-foreground">
          This practice is not an emergency service. In an emergency, call your
          local emergency number or go to the nearest emergency department.
        </p>
        <p className="mt-4 font-mono text-label text-muted-foreground">
          © 2027 Nora Ellingham
        </p>
      </footer>
    </div>
  )
}

export default App
