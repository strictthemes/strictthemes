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

const quietLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const label = "font-mono text-label text-muted-foreground"

const sections = [
  { id: "a-decision-you-cannot-find", title: "A decision you cannot find" },
  { id: "where-each-note-lives", title: "Where each note lives" },
  { id: "writing-a-decision-record", title: "Writing a decision record" },
  { id: "keeping-the-record-alive", title: "Keeping the record alive" },
]

const notePlaces = [
  {
    kind: "Meeting notes",
    where: "In the calendar invite, or a shared folder named by date",
    who: "The people who were there, and anyone who missed it",
  },
  {
    kind: "Decisions",
    where: "One decision log that the whole team can search",
    who: "Everyone, most of all people who joined later",
  },
  {
    kind: "How-to notes",
    where: "The team handbook, sorted by task",
    who: "Whoever has to do the task next",
  },
  {
    kind: "Plans in progress",
    where: "A draft document linked from the project's page",
    who: "The people working on it, until it becomes a decision",
  },
]

const decisionRecord = `Decision:           We send all orders under 2 kg with Parcelway from 1 April.
Date:               14 March 2026
Who decided:        Hana Ruiz and Tomas Lind
Why:                Swiftline lost two parcels in February and billed us for both.
When to look again: 1 September 2026`

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${quietLink}`}>
          A Handbook for Small Teams
        </a>
        <nav aria-label="Main" className="flex gap-6">
          <a href="/contents" className={quietLink}>
            Contents
          </a>
          <a href="/about" className={quietLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <article>
          <div className="mx-auto max-w-lg pt-24">
            <p className={`${label} tabular-nums`}>Chapter 3 of 9</p>
            <h1 className="mt-4 text-h1 md:text-display">
              Writing things down
            </h1>
            <p className="mt-6 font-heading text-h2 font-normal italic">
              A decision is not made until it is written where the team can find
              it. This chapter shows where to write each kind of note, and how
              to keep a record of decisions that people actually use.
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
                {sections.map((section, index) => (
                  <li
                    key={section.id}
                    className={index > 0 ? "mt-2" : undefined}
                  >
                    <a href={`#${section.id}`} className={quietLink}>
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
              Every team makes more decisions than it remembers. In a group of
              eight people, a week of ordinary work settles dozens of small
              questions: which supplier to try, who answers the support inbox on
              Fridays, whether the new price applies to old customers. Most of
              them are agreed on a call or in a hallway and never touched again.
              That works until someone asks, three months later, why things are
              the way they are, and nobody can say.
            </p>
            <p className="mt-6">
              The argument of this chapter is simple. A decision is not made
              until it is written down where the team can find it. Before that,
              it is a shared memory, and shared memories drift. Two people leave
              the same meeting with different versions of what was agreed, and
              each is sure of theirs. Neither is lying. They simply heard the
              part that mattered to them.
            </p>
            <p className="mt-6">
              Small teams feel this less at first, because everyone was in the
              room. That stops being true the day you hire your sixth or seventh
              person. The newcomer was not in the room for <em>anything</em>,
              and the only way they can learn why the team works as it does is
              to ask, again and again, the people who were. Writing things down
              is how you stop being the team&apos;s memory and go back to doing
              your own work.
            </p>

            <h2 id={sections[1].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[1].title}
            </h2>
            <p className="mt-4">
              Not every note needs the same home. A team that puts everything in
              one long document soon has a document nobody reads, and a team
              that spreads its notes across five tools has notes nobody can
              find. The trick is to decide, once, what kind of note goes where,
              and to tell every new person on their first day.
            </p>
            <p className="mt-6">
              Most small teams need only three places. Meeting notes belong next
              to the meeting, in the calendar invite or a shared folder named by
              date, because people look for them by when they happened.
              Decisions belong in a single log that everyone can search, because
              people look for them by subject. How-to notes, the ones that
              explain how to send an invoice or reset the test server, belong in
              a handbook like this one, sorted by task.
            </p>
          </div>

          <div className="my-12">
            <p className={label}>What to write where</p>
            <div className="mt-2">
              <Table label="What to write where" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Kind of note", "Where it lives", "Who reads it"].map(
                      (heading) => (
                        <TableHead
                          key={heading}
                          className={`h-auto px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0 ${label}`}
                        >
                          {heading}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notePlaces.map((row) => (
                    <TableRow key={row.kind} className="hover:bg-transparent">
                      <TableCell className="px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0">
                        {row.kind}
                      </TableCell>
                      <TableCell className="px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0">
                        {row.where}
                      </TableCell>
                      <TableCell className="px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0">
                        {row.who}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mx-auto max-w-lg">
            <p className="mt-6">
              The table is a starting point, not a rule. If your team already
              keeps decisions in a chat channel that people really do search,
              keep them there. What matters is that the answer to{" "}
              <em>where would I look?</em> is the same for everyone.
            </p>

            <h2 id={sections[2].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[2].title}
            </h2>
            <p className="mt-4">
              A decision record is a short note that says what was decided,
              when, by whom and why. It should take five minutes to write and
              less than one to read. If it takes longer, it is turning into a
              report, and reports get written far less often than they should.
            </p>
            <p className="mt-6">
              Once a decision has been made, the person who made it writes the
              record in four steps.
            </p>
            <ol className="mt-6 list-decimal pl-6">
              <li>
                Write the decision itself in one sentence, as plainly as you
                would say it aloud.
              </li>
              <li className="mt-2">
                Add the date and the names of the people who decided, not
                everyone who was present.
              </li>
              <li className="mt-2">
                Give the main reason in two or three sentences, with the option
                you turned down.
              </li>
              <li className="mt-2">
                Choose a date to look at the decision again, and put it in the
                record.
              </li>
            </ol>
            <p className="mt-6">
              The fourth step is the one teams skip, and it is the one that
              keeps the log honest. A date to look again admits that the
              decision was made with what you knew at the time. It gives the
              next person permission to change it without feeling that they are
              overruling someone.
            </p>

            <div className="my-12">
              <p className={label}>A decision record, filled in</p>
              <pre
                tabIndex={0}
                role="region"
                aria-label="A decision record, filled in"
                className={`mt-2 overflow-x-auto rounded-xl border bg-card p-6 font-mono text-label text-foreground ${focusRing}`}
              >
                {decisionRecord}
              </pre>
            </div>

            <p className="mt-6">
              Write the record in the words you used in the room. Nobody will
              grade it. A record that says we picked the cheaper courier{" "}
              <em>because the fast one lost two parcels in February</em> is
              worth more than a page about the parcel market.
            </p>

            <h2 id={sections[3].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[3].title}
            </h2>
            <p className="mt-4">
              A log that nobody opens is only slightly better than no log at
              all. The record earns its keep when people go to it before they
              ask, and that habit forms only if the log is easy to reach and
              usually right.
            </p>
            <p className="mt-6">
              Link to it often. When someone asks in chat why the support hours
              changed, answer with a link to the record, not a summary. It takes
              the same time, and it teaches the person where to look next time.
              Within a few weeks, people start checking the log first.
            </p>

            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>Try this</p>
              <p className="mt-2">
                Pick one decision from the last month that someone has already
                asked you about. Write a record for it with the template in this
                chapter, and post the link where the question was asked. Then
                see whether the next question about it goes to the record
                instead of to you.
              </p>
            </aside>

            <p className="mt-6">
              Look back at the dates you set. Once a month, take ten minutes to
              read the records whose dates have passed. Most will still be
              right, and you can give them a new date. Some will be wrong, and
              that is the point: you have found a decision that needs making
              again before it caused a problem.
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                If it is not written down, it was only a conversation.
              </p>
              <footer className={`mt-4 not-italic ${label}`}>
                Ines Varga · Operations lead at Corran Tools
              </footer>
            </blockquote>

            <p className="mt-6">
              Finally, let the log be incomplete. You will not record every
              decision, and you should not try. Start with the ones people have
              asked about twice. Those are the decisions your team is already
              struggling to remember.
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
                  A decision is not made until it is written where the whole
                  team can find it.
                </li>
                <li className="mt-2">
                  Give each kind of note one home, and tell every new person
                  where that is.
                </li>
                <li className="mt-2">
                  Keep decision records short, link to them often, and look at
                  each one again on its date.
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
              href="/chapters/2"
              className={`group justify-self-start text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className={`block ${label}`}>Previous</span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                2. Meetings worth having
              </span>
            </a>
            <a
              href="/chapters/4"
              className={`group justify-self-end text-right text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className={`block ${label}`}>Next</span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                4. Who owns what
              </span>
            </a>
          </nav>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t py-12">
          <p className="font-heading text-h2">A Handbook for Small Teams</p>
          <p className="mt-2">
            A guide to working well together for teams of five to fifteen
            people, one chapter at a time.
          </p>
          <p className={`mt-6 tabular-nums ${label}`}>
            © 2026 A Handbook for Small Teams
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
