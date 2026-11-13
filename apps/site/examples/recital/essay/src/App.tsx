const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline decoration-1 underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusRing}`

const quietLink = `text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focusRing}`

const label = "font-mono text-label"

const navLinks = [
  { href: "/essays", text: "Essays" },
  { href: "/journal", text: "Journal" },
  { href: "/about", text: "About" },
]

const moreEssays = [
  {
    date: "2026-02-02",
    dateText: "2 February 2026",
    minutes: 7,
    title: "What the archive keeps",
    summary:
      "On the small, unglamorous records that outlast the people who kept them.",
  },
  {
    date: "2026-01-14",
    dateText: "14 January 2026",
    minutes: 6,
    title: "Learning to write a short letter",
    summary:
      "Why the hardest replies to write are the ones that fit on a single card.",
  },
  {
    date: "2025-12-09",
    dateText: "9 December 2025",
    minutes: 8,
    title: "The neighbour who never waved",
    summary:
      "A reader's question about a cold street, and what it taught me about first impressions.",
  },
]

function NoteRef({ n }: { n: number }) {
  return (
    <sup className="font-mono text-label leading-none">
      <a
        id={`fnref-${n}`}
        href={`#fn-${n}`}
        aria-label={`Note ${n}`}
        className={`scroll-mt-6 ${textLink}`}
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
        <a href="/" className={`font-heading text-h2 ${quietLink}`}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={quietLink}>
              {link.text}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article>
          {/* Essay header */}
          <div className="mx-auto max-w-lg pt-12">
            <p className={`${label} text-muted-foreground tabular-nums`}>
              Essay · <time dateTime="2026-03-12">12 March 2026</time> · 5 min
              read
            </p>
            <h1 className="mt-4 text-h1">The case for the slow reply</h1>
            <p className="mt-4 font-heading text-h2 font-normal italic">
              Eleven years of answering readers’ letters have taught me that
              the reply worth sending is rarely the one I could send today.
            </p>
            <p className={`mt-6 ${label} text-muted-foreground`}>
              By Ines Halloran
            </p>
            <hr className="mt-12" />
          </div>

          {/* Body, first column */}
          <div className="mx-auto mt-12 max-w-lg">
            <p className="first-letter:float-left first-letter:mr-2 first-letter:-mb-1 first-letter:font-heading first-letter:text-display first-letter:text-primary">
              Every Monday a canvas bag of letters arrives at my desk, and
              every Monday I am tempted to answer the easiest ones before
              lunch. I have done this job for eleven years, answering readers
              who write to the magazine about grief, money, neighbours, work and
              the small cruelties of family life. In my first year I prided
              myself on speed. A reader wrote on a Tuesday and had my reply by
              Thursday. I thought that was a kindness. I now think it was mostly
              a way of clearing my desk.
            </p>
            <p className="mt-6">
              This essay is the case I would make to my younger self, and to
              anyone who answers other people for a living or out of love: that
              a reply which arrives a week later, after you have actually
              thought about it, is usually worth more than one that arrives
              today. Not always. But far more often than our inboxes would have
              us believe.
            </p>

            <h2 id="what-the-quick-reply-gets-wrong" className="mt-12 text-h2">
              What the quick reply gets wrong
            </h2>
            <p className="mt-4">
              A quick reply answers the question as it was asked. That sounds
              like the whole job, and for a train time or a recipe it is. But
              the letters I get are rarely about the thing they name. A woman
              asks whether she should lend her brother money for a van. A man
              asks how to tell his book group he wants to leave. Read once,
              these are practical questions with practical answers. Read on the
              third day, they are often about something else entirely: a long
              habit of being the reliable one, or a fear of being disliked by
              the only people he sees each week.
            </p>
            <p className="mt-6">
              When I answered on the day, I answered the van and the book group.
              Readers were polite about it. Some wrote back to say thank you. A
              good number wrote back to say, gently, that I had missed the
              point, and then told me what the point was. Those second letters
              were always more interesting than the first, and I had made them
              necessary.
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                Answer the letter you were sent, not the one you expected to
                get.
              </p>
              <footer
                className={`mt-4 ${label} text-muted-foreground not-italic`}
              >
                Margit Ostrander, my predecessor at the letters desk
              </footer>
            </blockquote>

            <p className="mt-6">
              She left that line in pencil on the inside of the desk drawer, and
              it took me years to understand that speed is the main way we end
              up answering the expected letter. The fast reply is built from the
              parts we already have to hand. It is the advice we gave last time,
              slightly reworded. There is nothing dishonest in it, but there is
              very little of the person who wrote.
            </p>

            <h2 id="a-week-in-a-drawer" className="mt-12 text-h2">
              A week in a drawer
            </h2>
            <p className="mt-4">
              So I changed one rule. Every letter now goes into a drawer for
              seven days before I write back. I read it on the day it comes,
              once, and then I leave it alone. I do not draft. I do not make
              notes, beyond the date it arrived. On the eighth day I take it
              out, read it twice, and write the reply in one sitting.
            </p>
            <p className="mt-6">
              The week does several things at once. It lets the obvious answer
              wear off. It lets the writer’s own words settle into an order, so
              that the sentence buried in the last paragraph, the one that
              begins <em>I suppose what I really mean</em>, moves to the front
              where it belongs. And it gives me time to notice when I am the
              wrong person to answer, which happens more often than I would
              like.
              <NoteRef n={1} />
            </p>
            <p className="mt-6">
              I was curious whether the drawer was making my replies better or
              merely making me feel better, so for two years I kept a count. I
              compared the letters I answered the same day, in the year before
              the rule, with those I answered after a week, and noted how many
              needed a correction afterwards: a second letter from me, because I
              had got a fact wrong, misread the situation, or given advice I had
              to take back.
            </p>
          </div>

          {/* Figure, wide */}
          <figure className="my-12">
            <div
              role="img"
              aria-label="Of 120 replies sent the same day, 23 needed a correction afterwards. Of 120 replies sent a week later, 4 did."
              className="rounded-xl border bg-card p-6"
            >
              <div>
                <p className={`${label} text-muted-foreground`}>
                  Replies sent the same day
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-4 flex-1 border bg-background">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${(23 / 120) * 100}%` }}
                    />
                  </div>
                  <p
                    className={`w-24 shrink-0 ${label} text-muted-foreground tabular-nums`}
                  >
                    23 of 120
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <p className={`${label} text-muted-foreground`}>
                  Replies sent a week later
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-4 flex-1 border bg-background">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${(4 / 120) * 100}%` }}
                    />
                  </div>
                  <p
                    className={`w-24 shrink-0 ${label} text-muted-foreground tabular-nums`}
                  >
                    4 of 120
                  </p>
                </div>
              </div>
            </div>
            <figcaption className={`mt-2 ${label} text-muted-foreground`}>
              Replies that needed a correction afterwards, out of 120 in each
              year.
            </figcaption>
          </figure>

          {/* Body, second column */}
          <div className="mx-auto max-w-lg">
            <p className="mt-6">
              The difference was larger than I expected. Twenty-three of the
              quick replies needed mending, against four of the slow ones. I do
              not claim this is science. The letters in the two years were not
              the same letters, and I was a year older for the second count. But
              I have stopped needing to apologise in print, and that alone has
              changed the tone of the page.
            </p>

            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={`${label} text-muted-foreground`}>
                A note on method
              </p>
              <p className="mt-2">
                The count covers 120 replies in each year, taken in the order
                the letters arrived. A correction meant any follow-up letter from
                me that changed a fact or withdrew advice; a reader simply
                disagreeing did not count. Letters marked urgent were left out
                of both years.
              </p>
            </aside>

            <h2 id="writing-back-to-a-person" className="mt-12 text-h2">
              Writing back to a person
            </h2>
            <p className="mt-4">
              The objection I hear most is that a week is a long time to leave
              someone waiting, and that silence reads as indifference. It can.
              That is why every letter now gets a card on the day it arrives,
              three lines long, saying that I have read it, that I will reply
              properly within a fortnight, and that if anything is urgent they
              should write the word on the envelope.
              <NoteRef n={2} /> The card costs me a minute. It turns the wait
              from a silence into a promise.
            </p>
            <p className="mt-6">
              What I did not expect was that readers would come to prefer the
              delay. Several have told me that writing the letter was the first
              step, and that the week of not knowing what I would say was the
              second. They had kept thinking. Some of them solved the problem
              themselves before my reply arrived, and wrote to say so, and those
              are my favourite letters of all. I keep them in a separate box.
            </p>
            <p className="mt-6">
              There is a kind of respect in taking your time over someone. It
              says that their trouble is worth more than the gap in your
              afternoon. A quick reply tells the writer that you were there. A
              slow one, if it is good, tells them that you were{" "}
              <em>listening</em>, which is rarer and harder to fake.
            </p>
            <p className="mt-6">
              None of this needs a magazine. The same drawer works for a hard
              email from a colleague, a message from a friend you have fallen
              out with, or a letter from a parent you have been putting off.
              Read it once. Tell them you have read it. Put it somewhere you
              cannot see it for a few days. Then write back to the person, not
              to the question. I wrote about the cards themselves in{" "}
              <a href="#" className={textLink}>
                a piece on the holding note
              </a>{" "}
              last spring, if you want the wording I use.
            </p>
            <p className="mt-6">
              Most of what we send each day should be quick, and is. But the
              letters that matter were written slowly, by someone who had to
              work up to it. It seems only fair to answer them at something
              closer to the same pace.
            </p>
          </div>

          {/* Footnotes */}
          <section
            aria-labelledby="notes-heading"
            className="mx-auto mt-12 max-w-lg border-t pt-6"
          >
            <h2
              id="notes-heading"
              className="font-mono text-label text-muted-foreground"
            >
              Notes
            </h2>
            <ol className="mt-4 list-decimal pl-6">
              <li id="fn-1" className="scroll-mt-6">
                Letters about medical or legal trouble are the clearest case.
                For those the most useful reply is often a name and a telephone
                number, and it should not wait a week.{" "}
                <a
                  href="#fnref-1"
                  aria-label="Back to reference 1"
                  className={textLink}
                >
                  Back
                </a>
              </li>
              <li id="fn-2" className="mt-2 scroll-mt-6">
                About one letter in thirty is marked urgent. Those I answer
                within two days, and they are left out of the count above.{" "}
                <a
                  href="#fnref-2"
                  aria-label="Back to reference 2"
                  className={textLink}
                >
                  Back
                </a>
              </li>
            </ol>
          </section>

          {/* Author note */}
          <div className="mx-auto mt-12 max-w-lg">
            <div className="mb-12 rounded-xl border bg-card p-6">
              <p className={`${label} text-muted-foreground`}>
                About the author
              </p>
              <h2 className="mt-2 text-h2">Ines Halloran</h2>
              <p className="mt-4">
                Ines Halloran has answered readers’ letters for The Long Margin
                since 2015, after nine years at a public library in a market
                town. She lives by the coast with a dog who does not care for
                the post, and you can{" "}
                <a href="#" className={textLink}>
                  read more of her essays
                </a>
                .
              </p>
            </div>
          </div>
        </article>

        {/* Keep reading */}
        <section
          aria-labelledby="keep-reading"
          className="mx-auto mt-24 max-w-lg"
        >
          <h2 id="keep-reading" className="text-h2">
            Keep reading
          </h2>
          <ul className="mt-6">
            {moreEssays.map((essay) => (
              <li key={essay.title} className="border-t py-6">
                <p className={`${label} text-muted-foreground tabular-nums`}>
                  <time dateTime={essay.date}>{essay.dateText}</time> ·{" "}
                  {essay.minutes} min read
                </p>
                <h3 className="mt-2 text-h2">
                  <a href="#" className={quietLink}>
                    {essay.title}
                  </a>
                </h3>
                <p className="mt-2">{essay.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A quarterly magazine of essays and readers’ letters, edited from a
            small office above a bookshop.
          </p>
          <p className={`mt-6 ${label} text-muted-foreground`}>
            © 2026 The Long Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
