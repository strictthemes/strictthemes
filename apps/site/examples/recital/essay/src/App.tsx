const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline decoration-1 underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusRing}`

const plainLink = `text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focusRing}`

const label = "font-mono text-label text-muted-foreground"

const dropCap =
  "first-letter:float-left first-letter:mr-2 first-letter:-mb-1 first-letter:font-heading first-letter:text-display first-letter:text-primary"

const navLinks = [
  { label: "Essays", href: "/essays" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
]

const moreEssays = [
  {
    date: "2026-02-02",
    dateLabel: "2 February 2026",
    minutes: 7,
    title: "On writing back to strangers",
    summary:
      "Why a letter from someone you will never meet deserves the same care as one from a friend.",
  },
  {
    date: "2026-01-12",
    dateLabel: "12 January 2026",
    minutes: 6,
    title: "The drawer of unsent letters",
    summary:
      "A reader's habit of writing letters she never posts, and what they taught her about her mother.",
  },
  {
    date: "2025-12-08",
    dateLabel: "8 December 2025",
    minutes: 9,
    title: "Advice I would take back",
    summary:
      "Five replies from my first year on the letters page, read again a decade later.",
  },
]

const sameDay = { corrected: 31, total: 120 }
const weekLater = { corrected: 7, total: 120 }

function FigureRow({
  title,
  corrected,
  total,
  className,
}: {
  title: string
  corrected: number
  total: number
  className?: string
}) {
  return (
    <div className={className}>
      <p className={label}>{title}</p>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-4 flex-1 border bg-background">
          <div
            className="h-full bg-foreground"
            style={{ width: `${(corrected / total) * 100}%` }}
          />
        </div>
        <p className={`w-24 shrink-0 ${label}`}>
          {corrected} of {total}
        </p>
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${plainLink}`}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={plainLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article>
          <div className="mx-auto max-w-lg pt-12">
            <p className={label}>
              Essay · <time dateTime="2026-03-12">12 March 2026</time> · 5 min
              read
            </p>
            <h1 className="mt-4 text-h1">The case for the slow reply</h1>
            <p className="mt-4 font-heading text-h2 font-normal italic">
              I answer readers&rsquo; letters for a living. The best answers I
              have sent were the ones I made people wait a week for.
            </p>
            <p className={`mt-6 ${label}`}>By Ruth Calloway</p>
            <hr className="mt-12" />
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <p className={dropCap}>
              Every Tuesday a tray of letters arrives on my desk at the
              magazine, and every Tuesday I am tempted to answer the easiest
              ones before lunch. A woman asks whether she should tell her
              brother she resents him. A retired teacher wants to know if it is
              too late to learn the cello. A student asks how to leave a job he
              has held for three weeks. I could write back to each of them in
              ten minutes. I have learned not to.
            </p>
            <p className="mt-6">
              For eleven years I have answered readers&rsquo; letters for a
              small quarterly, and for most of that time I was proud of how fast
              I did it. A reply that went out the same afternoon felt generous.
              It told the reader I had heard them. What it often did not do was
              help them, and it took me a long while, and one letter in
              particular, to see the difference.
            </p>

            <h2 id="what-a-quick-answer-is-for" className="mt-12 text-h2">
              What a quick answer is for
            </h2>
            <p className="mt-4">
              A quick reply answers the question as it was written. That sounds
              like the whole job, but a letter is rarely the question its writer
              means. The woman who resents her brother writes about a birthday
              dinner, a remark about her kitchen, a gift that was never
              returned. The question she has put on paper is whether to say
              something at the next dinner. The question underneath it is older,
              and she may not have found the words for it yet.
            </p>
            <p className="mt-6">
              When I answer on the day, I answer the dinner. I am good at
              dinners. I can suggest a sentence to open with and a time to
              leave. The advice is sensible, the reader thanks me, and three
              months later a second letter arrives that begins,{" "}
              <em>I did what you said, but</em>. Those second letters are how I
              started keeping count.
              <sup className="font-mono text-label leading-none">
                <a
                  id="fnref-1"
                  href="#fn-1"
                  aria-label="Note 1"
                  className={`scroll-mt-6 ${textLink}`}
                >
                  1
                </a>
              </sup>
            </p>
            <p className="mt-6">
              Speed also flatters the person answering. Whoever writes back
              fastest looks like the one who cares most, and I liked looking
              that way. A same-day reply is a small performance of attention. It
              is not the same as attention, which is slower and less pleasant,
              and which mostly consists of reading a letter again when you would
              rather be done with it.
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                A letter answered too soon is a letter answered to yourself.
              </p>
              <footer className={`mt-4 not-italic ${label}`}>
                Ines Hartwell, The Patient Correspondent
              </footer>
            </blockquote>

            <h2 id="what-a-week-does" className="mt-12 text-h2">
              What a week does
            </h2>
            <p className="mt-4">
              These days I read each letter on the Tuesday it arrives and then
              put it away. I do not draft anything. I carry it around, the way
              you carry a stone in your pocket, and I notice when it comes back
              to mind: on the bus, at the sink, halfway through someone
              else&rsquo;s letter. By the following Tuesday I usually know which
              sentence in it matters, and it is almost never the one that ends
              in a question mark.
            </p>
            <p className="mt-6">
              The retired teacher, for instance, did not need to hear that
              sixty-eight is a fine age to start an instrument. Anyone could
              have told her that, and her daughter already had. On the fourth
              or fifth day I noticed that she had mentioned, twice and in
              passing, that her late husband played. My reply was about that,
              and about whether she wanted to learn the cello or to have one
              back in the house. She wrote again to say she had not known it was
              the second until she read it.
            </p>
            <p className="mt-6">
              The week does not make me wiser. It makes me <em>less</em>{" "}
              certain, and that is the useful part. On the first day I have an
              answer ready, and it arrives with the confidence of something I
              have not yet tested. By the seventh day it has been held up
              against the letter many times, and the parts that do not fit have
              fallen off. What is left is smaller and usually kinder.
            </p>
          </div>

          <figure className="my-12">
            <div
              role="img"
              aria-label={`Bar chart. Of ${sameDay.total} replies sent the same day, ${sameDay.corrected} needed a correction afterwards. Of ${weekLater.total} replies sent a week later, ${weekLater.corrected} did.`}
              className="rounded-xl border bg-card p-6"
            >
              <FigureRow
                title="Replies sent the same day"
                corrected={sameDay.corrected}
                total={sameDay.total}
              />
              <FigureRow
                title="Replies sent a week later"
                corrected={weekLater.corrected}
                total={weekLater.total}
                className="mt-6"
              />
            </div>
            <figcaption className={`mt-2 ${label}`}>
              Replies that needed a correction afterwards · Two years of
              letters, 240 in all
            </figcaption>
          </figure>

          <div className="mx-auto max-w-lg">
            <p className="mt-6">
              I kept a tally for two years, half the letters answered on the day
              and half a week later, sorted by nothing more scientific than
              which pile I reached first. The numbers are small, and they are
              mine, but they did not leave much room for argument. The quick
              replies were four times as likely to need a second letter to set
              something right.
            </p>

            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>A note on method</p>
              <p className="mt-2">
                I counted a reply as needing a correction when the reader wrote
                back to say the advice had missed, or when I read my own answer
                a month later and wished I could take a line back. The second
                test is stricter than the first, and it caught most of the
                same-day replies on its own.
              </p>
            </aside>

            <h2 id="the-cost-of-waiting" className="mt-12 text-h2">
              The cost of waiting
            </h2>
            <p className="mt-4">
              I do not want to pretend that waiting is free. A week is a long
              time to sit with a worry, and some letters cannot wait at all.
              When someone writes in danger, or in a crisis that has a date on
              it, I answer the same day and point them to people who can do more
              than I can. The magazine keeps a short list of those people on{" "}
              <a href="#" className={textLink}>
                our letters page
              </a>
              , and I would rather a reader found it there than waited for me.
            </p>
            <p className="mt-6">
              For everyone else, I now send a short note on the first day. It
              says that I have read the letter, that I am thinking about it, and
              that a proper answer will come the following week. Readers have
              told me that this note matters more than I expected. It is a
              promise, and keeping it turns out to be its own kind of reply.
              <sup className="font-mono text-label leading-none">
                <a
                  id="fnref-2"
                  href="#fn-2"
                  aria-label="Note 2"
                  className={`scroll-mt-6 ${textLink}`}
                >
                  2
                </a>
              </sup>
            </p>
            <p className="mt-6">
              There is also a cost to me. A slow reply is harder to write than a
              fast one, because by the time I write it I know how much I do not
              know. The quick version had a tidy ending. The slow version often
              ends with a question handed back to the reader, or with the
              admission that there is no good choice, only a less bad one. These
              are not satisfying paragraphs to write. They are, I think, more
              honest ones.
            </p>
            <p className="mt-6">
              I still feel the pull on Tuesday mornings. The tray arrives, the
              easy letters sit on top, and an answer forms before I have
              finished reading. I let it form, and then I put the letter away. A
              week later I take it out again and see what is left of that first
              answer. It is usually not much. What grows in its place is slower
              and plainer, and more often than not it is the thing the reader
              was asking all along.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg border-t pt-6">
            <h2 className={label}>Notes</h2>
            <ol className="mt-4 list-decimal pl-6">
              <li id="fn-1" className="scroll-mt-6">
                I kept every second letter in a shoebox marked
                &ldquo;Corrections&rdquo;. By the end of the second year it held
                38 letters, which is where the numbers in the drawing come from.{" "}
                <a
                  href="#fnref-1"
                  aria-label="Back to reference 1"
                  className={textLink}
                >
                  Back
                </a>
              </li>
              <li id="fn-2" className="mt-2 scroll-mt-6">
                The note is three sentences long, and I write each one by hand.
                I tried a printed card for a season, and readers could tell.{" "}
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

          <div className="mx-auto mt-12 max-w-lg">
            <aside className="mb-12 rounded-xl border bg-card p-6">
              <p className={label}>About the author</p>
              <h2 className="mt-2 text-h2">Ruth Calloway</h2>
              <p className="mt-4">
                Ruth Calloway has answered readers&rsquo; letters for The Long
                Margin since 2015, from a desk in a seaside town with too many
                shelves. She writes one essay each season about the letters she
                could not stop thinking about, and you can read{" "}
                <a href="/essays" className={textLink}>
                  more of her essays
                </a>
                .
              </p>
            </aside>
          </div>
        </article>

        <div className="mx-auto mt-24 max-w-lg">
          <h2 className="text-h2">Keep reading</h2>
          <ul className="mt-6">
            {moreEssays.map((essay) => (
              <li key={essay.title} className="border-t py-6">
                <p className={label}>
                  <time dateTime={essay.date}>{essay.dateLabel}</time> ·{" "}
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
            A quarterly magazine of essays and letters, written to be read
            slowly.
          </p>
          <p className={`mt-6 ${label}`}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
