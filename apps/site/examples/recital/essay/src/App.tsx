const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const textLink = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`

const quietLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

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
    title: "Why I keep the letters I cannot answer",
    summary:
      "A drawer of unanswered post, and what it has taught me about the questions that have no column-sized reply.",
  },
  {
    date: "2026-01-14",
    dateText: "14 January 2026",
    minutes: 6,
    title: "On writing to strangers",
    summary:
      "Most of our readers will never meet me, and that distance is why they tell me things they tell no one else.",
  },
  {
    date: "2025-12-09",
    dateText: "9 December 2025",
    minutes: 8,
    title: "The trouble with good advice",
    summary:
      "Sound advice that ignores the person asking for it is still the wrong answer, however sensible it reads.",
  },
]

const sameDay = { corrected: 11, total: 40 }
const weekLater = { corrected: 2, total: 40 }

function FootnoteRef({ n }: { n: number }) {
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

function BarRow({
  title,
  corrected,
  total,
  className = "",
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
        <span className={`w-24 shrink-0 ${label}`}>
          {corrected} of {total}
        </span>
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${quietLink}`}>
          The Long Margin
        </a>
        <nav aria-label="Main" className="flex gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={quietLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <article>
          <div className={`${column} pt-12`}>
            <p className={label}>
              Essay · <time dateTime="2026-03-12">12 March 2026</time> · 5 min
              read
            </p>
            <h1 className="mt-4 text-h1">The case for the slow reply</h1>
            <p className="mt-4 font-heading text-h2 font-normal italic">
              For six years I have answered readers’ letters a week after they
              arrive. The delay is not a backlog: it is the part of the job
              that does the work.
            </p>
            <p className={`mt-6 ${label}`}>By Hester Vallance</p>
            <hr className="mt-12" />
          </div>

          <div className={`${column} mt-12`}>
            <p className="first-letter:float-left first-letter:mr-2 first-letter:-mb-1 first-letter:font-heading first-letter:text-display first-letter:text-primary">
              Every Monday a canvas bag of letters arrives at the office of The
              Long Margin, and every Monday I read all of them before lunch.
              Most are short. A man in Ashby wants to know whether he should
              tell his brother about a debt. A teacher asks how to leave a job
              she still likes. A woman writes four pages about her mother’s
              garden and only reaches her question on the last line.
            </p>
            <p className="mt-6">
              I could answer most of them that afternoon. I have done this long
              enough to know the shape of a good reply, and the first one that
              comes to mind is usually competent. But I do not send it. I write
              it down, put it in a folder marked with the date, and leave it
              there for seven days. Only then do I write the answer that goes
              into the magazine.
            </p>
            <p className="mt-6">
              Readers sometimes ask why the column runs so far behind the post.
              This essay is my answer. The week is not lost time. It is when
              the reply gets written properly.
            </p>

            <h2 id="first-draft" className="mt-12 text-h2">
              What the first draft gets wrong
            </h2>
            <p className="mt-4">
              The quick reply answers the question as it was asked. That sounds
              like a virtue, and it is not. People rarely write down the
              question they actually have. They write the one they can bear to
              put on paper, and they hide the real one in a detail they think is
              beside the point.
            </p>
            <p className="mt-6">
              The man in Ashby, for example, asked whether to tell his brother
              about the debt. My first draft told him yes, and gave three sound
              reasons. A week later, reading his letter again, I noticed that he
              had mentioned twice that his brother had just become a father.
              The question was not <em>whether</em> to tell him. It was whether
              he could stand to be the person who spoiled that year. That is a
              different letter, and it needs a different answer.
              <FootnoteRef n={1} />
            </p>
            <p className="mt-6">
              A first draft is written by the part of me that wants to be
              helpful quickly. It reaches for advice I have given before. It is
              fluent, and fluency is the problem: it lets me move past the
              strange sentence in a letter instead of stopping on it.
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                An answer should be slower than the letter it answers, because
                the reader took their time to write it.
              </p>
              <footer className={`mt-4 not-italic ${label}`}>
                Agnes Holloway, editor of The Long Margin, 1988 to 2011
              </footer>
            </blockquote>

            <h2 id="a-week" className="mt-12 text-h2">
              A week is long enough to change your mind
            </h2>
            <p className="mt-4">
              Seven days is not a magic number. I tried three days for a while,
              and found that I still agreed with almost everything I had
              written. I tried a fortnight, and the letters started to go cold:
              I would forget what had moved me about them in the first place. A
              week sits between the two. It is long enough that the first draft
              reads as if someone else wrote it, and short enough that the
              letter still feels urgent.
            </p>
            <p className="mt-6">
              When I come back to a draft, I read the letter first and my answer
              second. I mark every place where my reply speaks to something the
              writer did not say. There are usually two or three. Then I mark
              the places where the writer said something I did not answer.
              There are usually more.
            </p>
            <p className="mt-6">
              Two years ago I started keeping a simple count. For each letter, I
              noted whether the reply needed a correction after it went out: a
              reader writing back to say I had misread them, a fact I had got
              wrong, or advice I would no longer give. Then I compared the weeks
              when a deadline forced me to send replies the same day with the
              weeks when I held them back.
              <FootnoteRef n={2} />
            </p>
          </div>

          <figure className="my-12">
            <div
              role="img"
              aria-label={`Of ${sameDay.total} replies sent the same day, ${sameDay.corrected} needed a correction afterwards. Of ${weekLater.total} replies sent a week later, ${weekLater.corrected} did.`}
              className="rounded-xl border bg-card p-6"
            >
              <BarRow title="Replies sent the same day" {...sameDay} />
              <BarRow
                title="Replies sent a week later"
                className="mt-6"
                {...weekLater}
              />
            </div>
            <figcaption className={`mt-2 ${label}`}>
              Replies that needed a correction afterwards, 2024 to 2025
            </figcaption>
          </figure>

          <div className={column}>
            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>A note on method</p>
              <p className="mt-2">
                These are my own letters and my own count, not a study. A
                correction meant any reply I would have rewritten after hearing
                back from the reader. Forty letters on each side is a small
                number, so trust the gap between the two rows more than the
                exact figures.
              </p>
            </aside>

            <h2 id="what-readers-want" className="mt-12 text-h2">
              What the reader actually wants
            </h2>
            <p className="mt-4">
              It would be easy to read all this as a case for patience in
              general. It is narrower than that. The people who write to the
              column are not waiting for an answer the way you wait for a train.
              Most of them have lived with their question for months before
              they put it in an envelope. A week more costs them very little. A
              wrong answer costs them a good deal, because they often act on it.
            </p>
            <p className="mt-6">
              What they want, as far as I can tell from the letters that come
              back, is to feel that someone read them closely. Not quickly, and
              not kindly in a general way, but closely: that the detail about
              the brother’s new baby was noticed. A fast reply can be warm. It
              is very hard for it to be <em>exact</em>.
            </p>
            <p className="mt-6">
              I do not think this only applies to letter columns. Anyone who
              answers people for a living, in an inbox or at a counter, knows
              the pull to reply while the message is still in front of them.
              Sometimes that is right. A question about opening hours does not
              improve with age. But a question about what to do with a life
              usually does, and it deserves an answer from someone who has slept
              on it. If you want to see what that looks like in practice,{" "}
              <a href="#" className={textLink}>
                the column’s archive
              </a>{" "}
              holds every reply since 2019, with a few first drafts printed
              beside them.
            </p>
            <p className="mt-6">
              The man in Ashby wrote back, by the way. He told his brother in
              the spring, after the christening, and they are still speaking. My
              first draft would have had him do it in January.
            </p>
          </div>

          <div className={`${column} mt-12 border-t pt-6`}>
            <h2 className={label}>Notes</h2>
            <ol className="mt-4 list-decimal pl-6">
              <li id="fn-1" className="scroll-mt-6">
                I have changed his town and some details of his letter, with his
                permission. Every letter in the column is edited this way before
                it is printed.{" "}
                <a
                  href="#fnref-1"
                  aria-label="Back to reference 1"
                  className={textLink}
                >
                  Back
                </a>
              </li>
              <li id="fn-2" className="mt-2 scroll-mt-6">
                There were 40 letters in each group, taken from the 2024 and
                2025 volumes. The same-day replies all date from the weeks when
                the printer moved our deadline forward.{" "}
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

          <div className={`${column} mt-12`}>
            <aside className="mb-12 rounded-xl border bg-card p-6">
              <p className={label}>About the author</p>
              <h2 className="mt-2 text-h2">Hester Vallance</h2>
              <p className="mt-4">
                Hester Vallance has answered readers’ letters for The Long
                Margin since 2019. Before that she spent ten years as a copy
                editor on a regional newspaper, where she learned to distrust
                her own first drafts.{" "}
                <a href="#" className={textLink}>
                  Read more of her essays
                </a>
                .
              </p>
            </aside>
          </div>
        </article>

        <div className={`${column} mt-24`}>
          <h2 className="text-h2">Keep reading</h2>
          <ul className="mt-6">
            {moreEssays.map((essay) => (
              <li key={essay.title} className="border-t py-6">
                <p className={label}>
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
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">The Long Margin</p>
          <p className="mt-2">
            A small magazine of essays and letters, printed four times a year
            and answered slowly.
          </p>
          <p className={`mt-6 ${label}`}>© 2026 The Long Margin</p>
        </div>
      </footer>
    </div>
  )
}

export default App
