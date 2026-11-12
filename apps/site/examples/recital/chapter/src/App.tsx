import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const column = "mx-auto max-w-lg"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const plainLink = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${focus}`
const label = "font-mono text-label text-muted-foreground"
const cell = "px-4 py-2 align-top whitespace-normal first:pl-0 last:pr-0"

const sections = [
  { id: "never-made", title: "A decision you cannot find was never made" },
  { id: "where-notes-live", title: "Where each kind of note lives" },
  { id: "writing-it-down", title: "How to write a decision down" },
  { id: "keeping-it-alive", title: "Keeping the record alive" },
]

const notes = [
  {
    kind: "Decisions",
    where: "The decision log, one page per record",
    who: "Everyone, and every newcomer in their first week",
  },
  {
    kind: "Meeting notes",
    where: "The shared folder for that meeting",
    who: "The people who were invited",
  },
  {
    kind: "How we work",
    where: "The team handbook",
    who: "Everyone, whenever something in it changes",
  },
  {
    kind: "Project plans",
    where: "The project’s own page",
    who: "The people on the project and whoever funds it",
  },
]

const template = `Decision:           Move the weekly planning call from Monday 9:00 to Tuesday 10:00, from the first week of May.
Date:               14 April 2026
Who decided:        Ines Marlow (team lead), with Tomas Reyes and Priya Anand
Why:                Monday mornings go to clearing the weekend's support queue, so the call kept starting late.
When to look again: 30 June 2026, after the first full quarter on the new day.`

export function App() {
  return (
    <div className="mx-auto max-w-3xl px-4 text-body md:px-6">
      <header className="flex flex-col items-start gap-y-2 py-6 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={`font-heading text-h2 ${plainLink}`}>
          A Handbook for Small Teams
        </a>
        <nav aria-label="Main" className="flex gap-6 text-body">
          <a href="/contents" className={plainLink}>
            Contents
          </a>
          <a href="/about" className={plainLink}>
            About
          </a>
        </nav>
      </header>

      <main>
        <article>
          <div className={`${column} pt-24`}>
            <p className={label}>Chapter 3 of 9</p>
            <h1 className="mt-4 text-h1 md:text-display">
              Writing things down
            </h1>
            <p className="mt-6 font-heading text-h2 font-normal italic">
              A decision is not made until it is written where the team can find
              it. This chapter shows where to write each kind of note, and how
              to keep the record worth reading.
            </p>
          </div>

          <div className={`${column} mt-12`}>
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
                    <a href={`#${section.id}`} className={plainLink}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className={`${column} mt-12`}>
            <h2 id={sections[0].id} className="scroll-mt-6 text-h2">
              {sections[0].title}
            </h2>
            <p className="mt-4">
              Most small teams make good decisions. They make them in a call, in
              a corridor, or in a thread that runs to forty replies, and
              everyone who was there leaves knowing what was agreed. Two weeks
              later the person who missed the call asks the same question, and
              the team spends another hour arriving at the same answer, or at a
              slightly different one.
            </p>
            <p className="mt-6">
              This chapter rests on one rule: a decision is <em>not made</em>{" "}
              until it is written down where the team can find it. Agreeing is
              the easy half. The record is what lets someone act on the decision
              without asking, and what lets the team change its mind on purpose
              rather than by accident.
            </p>
            <p className="mt-6">
              At five people you can get away without it, because everyone hears
              everything. Somewhere past eight that stops being true. People
              join, people go on leave, and the one person who knew why the
              invoice run moved to the third of the month is suddenly on a beach
              without signal. What was common knowledge turns into folklore, and
              folklore is hard to argue with.
            </p>
            <aside className="my-12 rounded-xl border bg-card p-6">
              <p className={label}>Try this</p>
              <p className="mt-2">
                Pick one decision your team made in the last fortnight that
                lives only in a chat thread. Write it up in five lines using the
                template in this chapter, and post the link back in the thread.
                Then count how many people open it.
              </p>
            </aside>
            <p className="mt-6">
              None of this needs a new tool. It needs a habit, a place, and a
              short shape for each note, so that writing one takes two minutes
              and reading one takes less.
            </p>

            <h2 id={sections[1].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[1].title}
            </h2>
            <p className="mt-4">
              Teams lose notes in two ways: they write them nowhere, or they
              write them everywhere. The second is almost as bad as the first,
              because a reader who finds three versions of the holiday policy
              has to guess which one is current. The fix is to agree, once,
              where each kind of note goes and who is expected to read it.
            </p>
            <p className="mt-6">
              Keep the list short. Most teams of our size need four places at
              most, and the table below is the set we see working most often.
              Yours may differ; what matters is that the team agrees on it and
              that a newcomer can learn it in their first week.
            </p>
          </div>

          <div className="my-12">
            <p className={label}>What to write where</p>
            <div className="mt-2">
              <Table label="What to write where" className="min-w-lg text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={`h-auto ${cell} ${label}`}>
                      Kind of note
                    </TableHead>
                    <TableHead className={`h-auto ${cell} ${label}`}>
                      Where it lives
                    </TableHead>
                    <TableHead className={`h-auto ${cell} ${label}`}>
                      Who reads it
                    </TableHead>
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

          <div className={column}>
            <p className="mt-6">
              Chat is missing from the table on purpose. It is good for deciding
              and bad for keeping. When a thread reaches a decision, someone
              copies the outcome to where it belongs and posts the link back
              into the thread, so the next person to scroll up finds the record
              and not just the argument.
            </p>

            <h2 id={sections[2].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[2].title}
            </h2>
            <p className="mt-4">
              A decision record should be short enough that nobody puts off
              writing it. One screen is plenty. It says what was decided, when,
              by whom, why, and when the team should look at it again. That last
              line is the one most teams skip, and it is the one that keeps old
              decisions from turning into rules nobody remembers choosing.
            </p>
            <p className="mt-6">
              The <em>why</em> matters more than it seems on the day. Six months
              on, the people who decided may have moved on, and the reason is
              the only thing that lets someone tell whether the decision still
              holds or whether the ground under it has shifted.
            </p>
            <p className="mt-6">
              When a decision is made, whoever led the conversation takes these
              four steps before the end of the day:
            </p>
            <ol className="mt-6 list-decimal pl-6">
              <li>Copy the template below into the team’s decision log.</li>
              <li className="mt-2">
                Fill in each line in plain words, as if for someone who was not
                there.
              </li>
              <li className="mt-2">
                Ask one other person who was in the room to read it and correct
                it.
              </li>
              <li className="mt-2">
                Post the link wherever the conversation happened.
              </li>
            </ol>
            <div className="my-12">
              <p className={label}>Decision record template</p>
              <pre
                tabIndex={0}
                role="region"
                aria-label="Decision record template"
                className={`mt-2 overflow-x-auto rounded-xl border bg-card p-6 font-mono text-label text-foreground ${focus}`}
              >
                {template}
              </pre>
            </div>
            <p className="mt-6">
              Writing the record falls to whoever led the conversation, not to a
              dedicated note-taker. That keeps the job small and spread out, and
              the person who ran the discussion is usually the one who knows
              best what was settled and what was left open.
            </p>

            <h2 id={sections[3].id} className="mt-12 scroll-mt-6 text-h2">
              {sections[3].title}
            </h2>
            <p className="mt-4">
              A log nobody reads decays quickly. Once a month, take ten minutes
              at the end of a regular meeting to look at the records whose
              review date has passed. For each one, the team either confirms it,
              changes it with a new record that links to the old one, or retires
              it.
            </p>
            <p className="mt-6">
              Never edit an old record to say something new. Mark it as replaced
              and point to the record that replaces it. The history of how a
              team changed its mind is useful on its own: it shows newcomers
              which questions have already been argued, and it saves everyone
              from having the argument again.
            </p>
            <blockquote className="my-12 border-l-2 border-primary pl-6">
              <p className="font-heading text-h2 font-normal italic">
                We stopped arguing about the same things twice, and that alone
                gave us back an afternoon a week.
              </p>
              <footer className={`mt-4 not-italic ${label}`}>
                Rosa Kettering, operations lead at Linden &amp; Hale
              </footer>
            </blockquote>
            <p className="mt-6">
              Expect the first month to feel slow. People forget, records come
              out too long, and someone will ask whether this is really needed
              for a team this size. Keep going. By the third month the log is
              the first place people look, and questions that used to start a
              meeting are answered with a link.
            </p>
            <p className="mt-6">
              The next chapter turns to handing work over: what to write down
              when a task changes hands, so the person picking it up does not
              have to start from the beginning.
            </p>
          </div>

          <div className={`${column} mt-12`}>
            <section
              aria-labelledby="in-short"
              className="mb-12 rounded-xl border bg-card p-6"
            >
              <h2 id="in-short" className={label}>
                In short
              </h2>
              <ul className="mt-4 list-disc pl-6">
                <li>
                  A decision is made only when it is written where the team can
                  find it.
                </li>
                <li className="mt-2">
                  Agree once where each kind of note lives, and use chat for
                  deciding, not for keeping.
                </li>
                <li className="mt-2">
                  Give every record a date to look at it again, and replace old
                  records instead of editing them.
                </li>
              </ul>
            </section>
          </div>
        </article>

        <div className={`${column} mt-24`}>
          <nav
            aria-label="Chapters"
            className="grid grid-cols-2 gap-6 border-t pt-6"
          >
            <a
              href="#"
              className={`group justify-self-start text-foreground transition-colors duration-150 ${focus}`}
            >
              <span className={`block ${label}`}>Previous</span>
              <span className="mt-2 block text-body text-foreground decoration-1 underline-offset-4 group-hover:underline">
                2. Meetings worth having
              </span>
            </a>
            <a
              href="#"
              className={`group justify-self-end text-right text-foreground transition-colors duration-150 ${focus}`}
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
            A practical guide for teams of five to fifteen people, written by
            people who have run them.
          </p>
          <p className={`mt-6 ${label}`}>
            © 2026 Ferrow Press · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
