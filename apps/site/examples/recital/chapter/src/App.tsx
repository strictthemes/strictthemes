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

const listLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focusRing}`

const handbookTitle = "A Handbook for Small Teams"

const sections = [
  { id: "point-to", title: "A decision is something you can point to" },
  { id: "where", title: "Where each kind of note belongs" },
  { id: "record", title: "Writing a decision record" },
  { id: "habit", title: "Keeping the habit" },
]

const notes = [
  {
    kind: "Decision",
    where: "The decisions log, one short record for each decision",
    who: "Everyone on the team, and anyone who joins later",
  },
  {
    kind: "Meeting notes",
    where: "A dated page in the folder of the meeting it belongs to",
    who: "People who missed the meeting",
  },
  {
    kind: "How-to",
    where: "The handbook, next to the task or tool it explains",
    who: "Whoever does the task next",
  },
  {
    kind: "Open question",
    where: "The question board, until someone answers it",
    who: "The person who can answer it",
  },
]

const steps = [
  "Write the decision as one sentence that someone outside the room would understand.",
  "Add the date, the names of the people who decided and the reason in a line or two.",
  "Choose a date or an event that should prompt the team to look at it again.",
  "Save it in the decisions log and post the link where the discussion happened.",
]

const template = [
  "Decision:            Move the weekly planning call from Monday to Tuesday at 10:00",
  "Date:                4 March 2026",
  "Who decided:         Priya Halloran, Tomas Ebner and Wren Adeyemi",
  "Why:                 Half the team spends Monday morning on support tickets from the weekend",
  "When to look again:  After the June release, or sooner if support hours change",
].join("\n")

const summary = [
  "A decision is not made until it is written where the whole team can find it.",
  "Give each kind of note one home, chosen by who will need to read it.",
  "Keep decision records to five lines, and always say when to look at them again.",
]

const cell = "px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0"

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${listLink}`}>
          {handbookTitle}
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/contents" className={listLink}>
            Contents
          </a>
          <a href="/about" className={listLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <article>
          <div className="mx-auto max-w-lg pt-24">
            <p className="font-mono text-label text-muted-foreground">
              Chapter 3 of 9
            </p>
            <h1 className="mt-4 text-h1 md:text-display">
              Writing things down
            </h1>
            <p className="mt-6 font-heading text-h2 font-normal italic">
              Decisions made out loud fade within a week. This chapter shows how
              a small team can write each one down in five minutes, in a place
              where everyone can find it.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <nav
              aria-labelledby="in-this-chapter"
              className="border-y border-border py-6"
            >
              <h2
                id="in-this-chapter"
                className="font-mono text-label text-muted-foreground"
              >
                In this chapter
              </h2>
              <ol className="mt-4 list-decimal pl-6">
                {sections.map((section, i) => (
                  <li key={section.id} className={i > 0 ? "mt-2" : undefined}>
                    <a href={`#${section.id}`} className={listLink}>
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
              Most small teams make more decisions than they realise. Someone
              suggests moving the release to Thursday, two people nod on a call,
              and the call ends. A week later half the team is working towards
              Thursday and the other half never heard about it. Nobody was
              careless. The decision lived in the memory of the people who
              happened to be listening, and memory is a poor place to keep
              anything the whole team depends on.
            </p>
            <p className="mt-6">
              This chapter argues for a simple rule: a decision is{" "}
              <em>not made</em> until it is written down where the team can find
              it. Saying it out loud is a proposal. Agreeing to it on a call is a
              draft. Only when it sits in a place that anyone can open, read and
              link to does it become something the team can act on, question or
              undo.
            </p>
            <p className="mt-6">
              The rule sounds like paperwork, and teams of five to fifteen people
              are right to be wary of paperwork. But the cost is small. A
              decision record takes five minutes to write. Arguing again about a
              decision nobody can remember takes an hour, and it usually happens
              at the worst moment, when a deadline is close and the person who
              made the call is on holiday. Writing things down is not about
              control. It lets people get on with their work without having to
              ask.
            </p>

            <h2 id={sections[1].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[1].title}
            </h2>
            <p className="mt-4">
              Not every note deserves the same home. A team that puts everything
              in one long chat channel has written things down in a technical
              sense, but nobody can find them again. A team that builds a wiki
              with forty sections and three levels of folders has the opposite
              problem: everything has a place, and nobody remembers which one.
            </p>
            <p className="mt-6">
              The answer for a small team is a short list of places, each with
              one job. Decisions go in one log. Meeting notes go under the
              meeting. Instructions for recurring work go in the handbook, next
              to the task they describe. Questions that are still open go
              somewhere visible, so they get answered instead of forgotten. The
              table below is the split we suggest as a starting point.
            </p>
          </div>

          <div className="my-12">
            <p className="font-mono text-label text-muted-foreground">
              What to write where
            </p>
            <div className="mt-2">
              <Table label="What to write where" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Kind of note", "Where it lives", "Who reads it"].map(
                      (heading) => (
                        <TableHead
                          key={heading}
                          className={`h-auto font-mono text-label text-muted-foreground ${cell}`}
                        >
                          {heading}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.kind} className="hover:bg-transparent">
                      <TableCell className={cell}>{note.kind}</TableCell>
                      <TableCell className={cell}>{note.where}</TableCell>
                      <TableCell className={cell}>{note.who}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mx-auto max-w-lg">
            <p className="mt-6">
              The column that matters most is the last one. When you are unsure
              where something goes, ask who will need to read it and when. A note
              for the person who does the task next month belongs where they will
              look for the task. A note for someone joining the team next year
              belongs in the decisions log, because that is where they will go to
              find out why things are the way they are.
            </p>

            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className="font-mono text-label text-muted-foreground">
                Try this
              </p>
              <p className="mt-2">
                Before Friday, scroll back through the last two weeks of your
                team chat and find one decision that was agreed there but never
                recorded. Write it up as a decision record and add it to the log.
                Then post the link in the original thread, so the team sees what
                a record looks like.
              </p>
            </aside>

            <h2 id={sections[2].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[2].title}
            </h2>
            <p className="mt-4">
              A decision record is short on purpose. If it takes longer to write
              than the decision took to make, people will stop writing them. Five
              lines are enough: what was decided, when, who decided, why, and
              when the team should look at it again. The last line is the one
              most teams leave out, and it is the one that keeps the log honest.
              A decision with a review date invites the team to change its mind
              on purpose rather than by drift.
            </p>
            <p className="mt-6">
              Whoever led the conversation writes the record, in four steps:
            </p>
            <ol className="mt-6 list-decimal pl-6">
              {steps.map((step, i) => (
                <li key={step} className={i > 0 ? "mt-2" : undefined}>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6">
              The record does not need to explain every option the team
              considered. If the reasoning was long, link to the thread or the
              document where it happened. The record is the summary someone reads
              in thirty seconds; the thread is there for anyone who wants the
              whole story.
            </p>

            <div className="my-12">
              <p className="font-mono text-label text-muted-foreground">
                Decision record template
              </p>
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
              Notice that the example names people rather than roles. In a team
              of eight, <em>the product lead</em> is a person with a name, and
              writing the name makes it clear who to ask. Use full sentences,
              plain words and no abbreviations that a new hire would have to look
              up.
            </p>

            <h2 id={sections[3].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[3].title}
            </h2>
            <p className="mt-4">
              The first few records are easy to write, because the idea is new.
              The hard part is the fifth week, when a busy afternoon makes it
              tempting to skip one. Two small habits keep the log alive. First,
              end every meeting that made a decision by asking who will write it
              up, and put that name in the meeting notes. Second, link to the log
              whenever someone asks why something is done the way it is. Each
              link teaches the team that the answer is already written down.
            </p>

            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                If it isn’t written where we can find it, we will decide it again
                next month.
              </p>
              <footer className="mt-4 font-mono text-label text-muted-foreground not-italic">
                Marta Okafor, operations lead at Fenwick Tools
              </footer>
            </blockquote>

            <p className="mt-6">
              Expect the log to be uneven at first. Some records will be too
              long, some too vague, and a few decisions will slip through. That
              is fine. Fix the ones you notice, and do not go back to record
              every decision from the past year. Start from today and let the log
              grow.
            </p>
            <p className="mt-6">
              After a few months, the log becomes more useful than a record. It
              is a short history of how the team thinks: what it chose, what it
              gave up, and what it learned when it looked again. New people read
              it in their first week. Old hands use it to settle arguments
              without raising their voices. It is the cheapest piece of shared
              memory a small team can have.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <section
              aria-labelledby="in-short"
              className="mb-12 rounded-xl border bg-card p-6"
            >
              <h2
                id="in-short"
                className="font-mono text-label text-muted-foreground"
              >
                In short
              </h2>
              <ul className="mt-4 list-disc pl-6">
                {summary.map((line, i) => (
                  <li key={line} className={i > 0 ? "mt-2" : undefined}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <div className="mx-auto mt-24 max-w-lg">
          <nav
            aria-label="Chapters"
            className="grid grid-cols-2 gap-6 border-t border-border pt-6"
          >
            <a
              href="/chapters/2"
              className={`group justify-self-start text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className="block font-mono text-label text-muted-foreground">
                Previous
              </span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                2. Meetings worth having
              </span>
            </a>
            <a
              href="/chapters/4"
              className={`group justify-self-end text-right text-foreground transition-colors duration-150 ${focusRing}`}
            >
              <span className="block font-mono text-label text-muted-foreground">
                Next
              </span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                4. Handing work over
              </span>
            </a>
          </nav>
        </div>
      </main>

      <footer className="mt-24">
        <div className="border-t border-border py-12">
          <p className="font-heading text-h2">{handbookTitle}</p>
          <p className="mt-2">
            A practical guide for teams of five to fifteen people, published one
            chapter at a time.
          </p>
          <p className="mt-6 font-mono text-label text-muted-foreground">
            © 2026 Linden Row Press
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
