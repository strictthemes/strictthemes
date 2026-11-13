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

const label = "font-mono text-label text-muted-foreground"

const column = "mx-auto max-w-lg"

const navLinks = [
  { label: "Essays", href: "/essays" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
]

const moreEssays = [
  {
    date: "2026-02-02",
    dateText: "2 February 2026",
    minutes: 7,
    title: "Letters we did not print",
    summary:
      "Why a third of the post never reaches the page, and what happens to it instead.",
  },
  {
    date: "2026-01-14",
    dateText: "14 January 2026",
    minutes: 6,
    title: "On being wrong in public",
    summary:
      "What a correction in the next issue owes the reader who was misled by the last one.",
  },
  {
    date: "2025-12-09",
    dateText: "9 December 2025",
    minutes: 8,
    title: "The drawer of unsent letters",
    summary:
      "Readers describe the letters they wrote and kept, and why they never posted them.",
  },
]

const corrections = [
  { label: "Replies sent the same day", value: 31 },
  { label: "Replies sent a week later", value: 7 },
]

function FootnoteRef({ n }: { n: number }) {
  return (
    <sup className="font-mono text-label leading-none">
      <a
        id={`fnref-${n}`}
        href={`#fn-${n}`}
        aria-label={`Note ${n}`}
        className={cn(textLink, "scroll-mt-6")}
      >
        {n}
      </a>
    </sup>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn(plainLink, "font-heading text-h2")}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={plainLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article>
          <div className={cn(column, "pt-12")}>
            <p className={label}>
              Essay · <time dateTime="2026-03-12">12 March 2026</time> · 5 min
              read
            </p>
            <h1 className="mt-4 text-h1">The case for the slow reply</h1>
            <p className="mt-4 font-heading text-h2 font-normal italic">
              For six years I have answered readers’ letters for a small
              magazine. The answers that helped most were never the ones I sent
              first.
            </p>
            <p className={cn(label, "mt-6")}>By Mara Ellwood</p>
            <hr className="mt-12 border-border" />
          </div>

          <div className={cn(column, "mt-12")}>
            <p className="first-letter:float-left first-letter:mr-2 first-letter:-mb-1 first-letter:font-heading first-letter:text-display first-letter:text-primary">
              Every Monday a canvas sack of post arrives at our office above a
              bicycle shop, and every Monday I am tempted to answer the easiest
              letter in it before lunch. For six years I have written the
              letters page of The Long Margin, a quarterly with about four
              thousand readers, and for most of the first two I gave in to that
              temptation. A reader once asked how to tell her brother she would
              not lend him money again, and by two o’clock she had a tidy,
              confident answer from me. It was wrong, or at least it was early,
              which in this work comes to the same thing.
            </p>
            <p className="mt-6">
              This essay is about the week I now leave between reading a letter
              and answering it. It is not a rule I invented. It is a habit I fell
              into after I counted my own mistakes, and it has changed what I
              think a reply is for.
            </p>

            <h2 id="what-a-quick-reply-gets-wrong" className="mt-12 text-h2">
              What a quick reply gets wrong
            </h2>
            <p className="mt-4">
              A quick reply answers the question that was asked. That sounds
              like a virtue until you notice how rarely the question in a letter
              is the real one. The woman with the brother did not need a script
              for refusing him. Three paragraphs further down, almost in
              passing, she mentioned that their mother had always paid his debts
              and had died in the spring. What she was asking was whether she was{" "}
              <em>allowed</em> to stop being her mother. I read past that
              sentence on the Monday. I found it on the Thursday, when the letter
              had sat on my desk long enough for me to read it as a letter and
              not as a task.
            </p>
            <p className="mt-6">
              Speed also flatters the person answering. A fast reply feels
              generous because nobody has to wait for it, and it feels competent
              because it is finished. But a reader who has spent a month deciding
              to write to a stranger is not helped by my efficiency. She is
              helped by being read closely, and close reading is slow by nature.
              <FootnoteRef n={1} />
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                A letter is a long breath held out to a stranger. Do not answer
                it before you have heard all of it.
              </p>
              <footer className={cn(label, "mt-4 not-italic")}>
                Hester Quayle, my predecessor on the letters page
              </footer>
            </blockquote>

            <p className="mt-6">
              Hester wrote that on a card she left in the desk drawer when she
              retired. At first I took it as good manners. I now take it as
              practical advice about accuracy.
            </p>

            <h2 id="what-a-week-does" className="mt-12 text-h2">
              What a week does
            </h2>
            <p className="mt-4">
              Two years in, I went back through my carbon copies and the letters
              that came after them. I sorted every reply into two piles: those I
              had sent within a day, and those I had sent after a week or more.
              Then I counted how many of each had needed a correction afterwards:
              a second letter from me, a note in the next issue, or a reader
              writing back to say I had misunderstood her.
            </p>
          </div>

          <figure className="my-12">
            <div
              role="img"
              aria-label="Replies that needed a correction afterwards. Of every 100 replies sent the same day, 31 needed one. Of every 100 replies sent a week later, 7 did."
              className="rounded-xl border bg-card p-6"
            >
              {corrections.map((row, i) => (
                <div key={row.label} className={i > 0 ? "mt-6" : undefined}>
                  <p className={label}>{row.label}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-4 flex-1 border bg-background">
                      <div
                        className="h-full bg-foreground"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                    <p className={cn(label, "w-24 shrink-0")}>
                      {row.value} in 100
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <figcaption className={cn(label, "mt-2")}>
              Replies that needed a correction afterwards, per 100 sent, from the
              412 letters I answered in my first two years
            </figcaption>
          </figure>

          <div className={column}>
            <p className="mt-6">
              The gap was larger than I expected, and it held when I left out the
              hardest letters, the ones about illness and grief, which I had
              always been slower to answer anyway. The difference was not that I
              knew more after a week. It was that I had read the letter four or
              five times, at different hours and in different moods, and each
              reading had shown me something the first one missed.
            </p>
            <p className="mt-6">
              A week also lets the first answer go cold. The reply I want to
              write on a Monday is usually about me: what I would do, what I once
              did. By the following Monday that reply has lost its heat, and what
              is left is the <em>reader’s</em> situation, which is the only thing
              she wrote to me about.
              <FootnoteRef n={2} />
            </p>

            <h2 id="how-i-keep-the-week" className="mt-12 text-h2">
              How I keep the week
            </h2>
            <p className="mt-4">
              The method is plain. A letter is read on the day it comes and put
              in a folder with that day’s date on it. I write nothing back,
              though I often copy out the sentence that struck me hardest. Later
              in the week I read it again, at the end of the week a third time,
              and only then do I draft.
            </p>

            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>A note on method</p>
              <p className="mt-2">
                These counts come from my own carbon copies, not from a study,
                and a correction is whatever I or a reader thought needed fixing.
                The letters I answered quickly were not chosen at random: they
                were the ones that looked simple, which may be exactly why they
                went wrong.
              </p>
            </aside>

            <p className="mt-6">
              Some letters cannot wait, and I do not make them. A reader who
              writes that she is frightened for her safety gets a reply the same
              afternoon, with the names of people who can help her faster than I
              can. The week is for letters that ask for judgement, not for
              rescue. Most of them do, and their writers know it: many say
              outright that they do not need an answer soon, only a good one.
            </p>
            <p className="mt-6">
              Waiting has a cost, and I try to be honest about it. A week is a
              long time to sit with an unanswered worry, so every letter now gets
              a short card on the day it arrives, saying it has been read and
              when the reply will come. Readers tell me the card matters more
              than I would have guessed, because it turns silence into a
              promise. Hester sent such cards for twenty years, as the{" "}
              <a href="#" className={textLink}>
                letters page archive
              </a>{" "}
              shows; I only found the habit again.
            </p>
            <p className="mt-6">
              I still answer some letters too quickly. But when a reader writes
              back now, it is more often to tell me what she decided than to tell
              me what I got wrong. That, I think, is what a reply is for: not to
              be first, but to be <em>right enough to keep</em>.
            </p>
          </div>

          <div className={cn(column, "mt-12 border-t pt-6")}>
            <h2 className={label}>Notes</h2>
            <ol className="mt-4 list-decimal pl-6">
              <li id="fn-1" className="scroll-mt-6">
                Most letters we receive have been drafted more than once. Several
                readers have told me they kept theirs in a drawer for a year
                before posting it.{" "}
                <a
                  href="#fnref-1"
                  aria-label="Back to reference 1"
                  className={textLink}
                >
                  Back
                </a>
              </li>
              <li id="fn-2" className="mt-2 scroll-mt-6">
                I keep the first draft of every reply, written on the day the
                letter arrives, and compare it with the one I send. They agree on
                the advice less than half the time.{" "}
                <a
                  href="#fnref-2"
                  aria-label="Back to reference 2"
                  className={textLink}
                >
                  Back
                </a>
              </li>
            </ol>
          </div>

          <div className={cn(column, "mt-12")}>
            <aside className="mb-12 rounded-xl border bg-card p-6">
              <p className={label}>About the author</p>
              <h2 className="mt-2 text-h2">Mara Ellwood</h2>
              <p className="mt-4">
                Mara Ellwood has written the letters page of The Long Margin since
                2020, after ten years as a copy editor, where she learned to read
                every sentence twice. She lives in a town with one bookshop and
                two bicycle shops, and{" "}
                <a href="#" className={textLink}>
                  her earlier essays
                </a>{" "}
                are collected in the archive.
              </p>
            </aside>
          </div>
        </article>

        <div className={cn(column, "mt-24")}>
          <h2 className="text-h2">Keep reading</h2>
          <ul className="mt-6">
            {moreEssays.map((essay) => (
              <li key={essay.title} className="border-t py-6">
                <p className={label}>
                  <time dateTime={essay.date}>{essay.dateText}</time> ·{" "}
                  {essay.minutes} min read
                </p>
                <h3 className="mt-2 text-h2">
                  <a href="#" className={plainLink}>
                    {essay.title}
                  </a>
                </h3>
                <p className="mt-2">{essay.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A quarterly of essays and readers’ letters, printed in small runs and
            meant to be read slowly.
          </p>
          <p className={cn(label, "mt-6")}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
