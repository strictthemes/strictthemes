import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const textLink = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${focusRing}`

const label = "font-mono text-label text-muted-foreground"

const cellClass = "px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0"

const sections = [
  { id: "why-write-it-down", title: "Why a decision needs a page" },
  { id: "where-notes-live", title: "Where each kind of note lives" },
  { id: "writing-a-record", title: "How to write a decision record" },
  { id: "keeping-it-alive", title: "Keeping the record alive" },
]

const notes = [
  {
    kind: "Decisions",
    where: "The decision log, one page with the newest entry first",
    who: "Everyone, and every new hire in their first week",
  },
  {
    kind: "Meeting notes",
    where: "A shared folder, one document per meeting",
    who: "The people who were there, and anyone who missed it",
  },
  {
    kind: "How we do things",
    where: "The team handbook, edited in place",
    who: "Anyone doing the task for the first time",
  },
  {
    kind: "Quick updates",
    where: "Team chat, and nowhere else",
    who: "Whoever is online that day",
  },
]

const template = `Decision:           Move all customer email to the shared support inbox and close the three personal aliases.
Date:               4 March 2026
Who decided:        Priya Okafor (support lead) and Tomas Reyes (founder)
Why:                Replies went missing when someone was away. We turned down a forwarding rule because it hid who had answered.
When to look again: 4 September 2026, or sooner if first replies take longer than a working day.`

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${headerLink}`}>
          A Handbook for Small Teams
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/contents" className={headerLink}>
            Contents
          </a>
          <a href="/about" className={headerLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <article>
          <div className="mx-auto max-w-lg pt-24">
            <p className={label}>Chapter 3 of 9</p>
            <h1 className="mt-4 text-h1 md:text-display">Writing things down</h1>
            <p className="mt-6 font-heading text-h2 font-normal italic">
              A decision is not made until it is written where the team can
              find it. This chapter shows where to write it, and how.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <nav
              aria-labelledby="in-this-chapter"
              className="border-t border-b py-6"
            >
              <h2 id="in-this-chapter" className={label}>
                In this chapter
              </h2>
              <ol className="mt-4 list-decimal pl-6">
                {sections.map((section) => (
                  <li key={section.id} className="mt-2 first:mt-0">
                    <a href={`#${section.id}`} className={headerLink}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <h2 id={sections[0].id} className="scroll-mt-6 text-h2">
              {sections[0].title}
            </h2>
            <p className="mt-4">
              Most small teams decide things all day: in a call, in a chat
              thread, in the five minutes after a meeting when two people stay
              behind. The decision feels made, because everyone in the room
              agreed. A week later someone who was not in the room asks the same
              question, and the team either decides again or argues about what it
              decided the first time.
            </p>
            <p className="mt-6">
              This chapter takes a narrow view. A decision is not made until it
              is written down somewhere the whole team can find it without
              asking. Until then it is a conversation, and conversations fade.
              People remember the outcome they wanted, not the one they agreed
              to, and almost nobody remembers the reasons.
            </p>
            <p className="mt-6">
              Writing things down is not record-keeping for its own sake. In a
              team of eight, the cost of a missing note is small each time and
              large over a year: the same debate held three times, a new hire who
              repeats an old mistake, a customer told two different things. A
              short note takes a few minutes. Not writing it costs those hours{" "}
              <em>again and again</em>.
            </p>
            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                We stopped arguing about the past the week we started writing it
                down.
              </p>
              <footer className={`mt-4 not-italic ${label}`}>
                Ines Halvorsen, operations lead at Tallow &amp; Finch
              </footer>
            </blockquote>
            <p className="mt-6">
              The rest of this chapter covers where each kind of note belongs,
              how to write a decision so that it holds up later, and how to keep
              the record from going stale. If your team already keeps good
              meeting notes, the habits from{" "}
              <a href="#" className={textLink}>
                chapter 2
              </a>{" "}
              carry over almost unchanged.
            </p>

            <h2 id={sections[1].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[1].title}
            </h2>
            <p className="mt-4">
              A team that writes things down in five places has the same problem
              as a team that writes nothing: no one knows where to look. Pick one
              home for each kind of note and say it out loud, once, at a team
              meeting. The table below is the split that most of the teams in
              this handbook settled on.
            </p>
          </div>

          <div className="my-12">
            <p className={label}>What to write where</p>
            <div className="mt-2">
              <Table label="What to write where" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={`h-auto ${cellClass} ${label}`}>
                      Kind of note
                    </TableHead>
                    <TableHead className={`h-auto ${cellClass} ${label}`}>
                      Where it lives
                    </TableHead>
                    <TableHead className={`h-auto ${cellClass} ${label}`}>
                      Who reads it
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.kind} className="hover:bg-transparent">
                      <TableCell className={cellClass}>{note.kind}</TableCell>
                      <TableCell className={cellClass}>{note.where}</TableCell>
                      <TableCell className={cellClass}>{note.who}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mx-auto max-w-lg">
            <p className="mt-6">
              Chat is the one place that should hold nothing you need next month.
              It is fast and it scrolls away, which is right for a note that you
              are running ten minutes late and wrong for a note that you are
              dropping the annual plan. When a thread ends in a decision, the
              person who closed it copies the outcome into the decision log and
              posts the link back in the thread.
            </p>
            <p className="mt-6">
              Keep the decision log in the same tool as the rest of your shared
              documents, not in a special app. If it takes a new login to find a
              decision, people will stop looking. A single page with the newest
              entry at the top is enough for most teams for their first two
              years.
            </p>

            <h2 id={sections[2].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[2].title}
            </h2>
            <p className="mt-4">
              A good record is short. It answers the questions someone will ask
              six months from now, when the people who made the call may be on
              holiday or gone. Long write-ups get skimmed; a record of five lines
              gets read.
            </p>
            <p className="mt-6">To write one, do these four things in order:</p>
            <ol className="mt-6 list-decimal pl-6">
              <li>
                Write the decision as one sentence that starts with a verb, such
                as &ldquo;Move all customer email to the shared inbox.&rdquo;
              </li>
              <li className="mt-2">
                Add the date and the names of the people who decided, not
                everyone who was in the room.
              </li>
              <li className="mt-2">
                Give the reason in two or three sentences, including the option
                you turned down.
              </li>
              <li className="mt-2">
                Set a date to look at it again, even if that date is a year away.
              </li>
            </ol>
            <div className="my-12">
              <p className={label}>Decision record</p>
              <pre
                tabIndex={0}
                role="region"
                aria-label="Decision record template"
                className={`mt-2 overflow-x-auto rounded-xl border bg-card p-6 font-mono text-label text-foreground ${focusRing}`}
              >
                {template}
              </pre>
            </div>
            <p className="mt-6">
              The last line matters more than it looks. Most decisions are right
              for a while and then quietly stop being right. A review date turns
              &ldquo;we have always done it this way&rdquo; into a question
              someone is expected to ask. When the date comes, confirm the
              decision in one line or write a new record that replaces it. Do not
              edit the old one: the history of <em>why</em> you changed your mind
              is part of the record.
            </p>

            <h2 id={sections[3].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[3].title}
            </h2>
            <p className="mt-4">
              A log that nobody reads dies within a quarter. The fix is not a
              rule that people must read it, but habits that make it useful. Link
              to the record whenever the question comes up again, instead of
              answering from memory. Start each planning meeting by reading out
              the decisions due for review. Ask new people to read the last
              twenty entries in their first week; it is the fastest history of
              the team they will get.
            </p>
            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>Try this</p>
              <p className="mt-2">
                Pick one decision your team made by talking this week and write
                it up as a record, five lines and no more. Share the link where
                the decision was first discussed. Then see how many people open
                it before Friday.
              </p>
            </aside>
            <p className="mt-6">
              It also helps to name an owner for the log. That person does not
              write every entry. They notice when a meeting ended in a decision
              and no record followed, and they ask, kindly, who is writing it. In
              most small teams this takes an hour a month and saves a good deal
              more.
            </p>
            <p className="mt-6">
              Finally, accept that some records will turn out wrong. The point is
              not to be right forever. It is to make each decision visible enough
              that the team can see when it has stopped working, and change it on
              purpose rather than by drift.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <section
              aria-labelledby="in-short"
              className="mb-12 rounded-xl border bg-card p-6"
            >
              <h2 id="in-short" className={label}>
                In short
              </h2>
              <ul className="mt-4 list-disc pl-6">
                <li>
                  A decision is not made until it is written where the whole team
                  can find it.
                </li>
                <li className="mt-2">
                  Give each kind of note one home, and keep decisions out of
                  chat.
                </li>
                <li className="mt-2">
                  Write each decision in five lines, with a date to look at it
                  again.
                </li>
              </ul>
            </section>
          </div>
        </article>

        <div className="mx-auto mt-24 max-w-lg">
          <nav
            aria-label="Chapters"
            className="grid grid-cols-2 gap-6 border-t pt-6"
          >
            <a
              href="#"
              className={`group justify-self-start text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className={`block ${label}`}>Previous</span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                2. Meetings worth having
              </span>
            </a>
            <a
              href="#"
              className={`group justify-self-end text-right text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className={`block ${label}`}>Next</span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                4. Handing work over
              </span>
            </a>
          </nav>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">A Handbook for Small Teams</p>
          <p className="mt-2">
            A practical guide to working well in a team of five to fifteen
            people, one habit per chapter.
          </p>
          <p className={`mt-6 ${label}`}>© 2026 Harrow Lane Press</p>
        </div>
      </footer>
    </div>
  )
}

export default App
