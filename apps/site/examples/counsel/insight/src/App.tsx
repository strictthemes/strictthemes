import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focus
)

// A link in the header or footer, and a name or a title that is a link.
const quietLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)

const label = "font-mono text-label uppercase"
const labelHeading = "font-mono text-label uppercase text-foreground"
const measure = "max-w-xl"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses", current: true },
  { label: "Contact", href: "/contact" },
]

const sections = [
  { id: "asks", title: "What a notice clause asks for" },
  { id: "fails", title: "Three ways a notice fails" },
  { id: "a-day", title: "A claim lost by a day" },
  { id: "before", title: "What to do before you send" },
]

const related = [
  {
    title: "Freezing orders: the first forty-eight hours",
    date: "29 October 2026",
    dateTime: "2026-10-29",
    read: "6 min read",
    author: "David Achterberg",
    practice: "Commercial disputes",
  },
  {
    title: "Break clauses in a commercial lease: getting the notice right",
    date: "1 October 2026",
    dateTime: "2026-10-01",
    read: "5 min read",
    author: "Thomas Kerridge",
    practice: "Real estate",
  },
  {
    title: "Earn-outs that end in dispute",
    date: "17 September 2026",
    dateTime: "2026-09-17",
    read: "6 min read",
    author: "Ruth Calloway",
    practice: "Commercial disputes",
  },
]

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const sectionRule = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", quietLink)}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, quietLink, link.current && "underline")}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <article>
          <section className={cn("mt-14 md:mt-28", grid)}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-12">
              <p className={cn(label, "text-muted-foreground")}>
                Briefing · Commercial disputes
              </p>
              <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-normal text-tertiary-foreground uppercase">
                New
              </Badge>
            </div>
            <h1 className="mt-4 text-h1 md:col-span-10 md:text-display">
              Notice clauses after a sale: when a late letter ends a warranty
              claim
            </h1>
            <p className="mt-8 font-heading text-h2 md:col-span-8 md:col-start-1">
              A buyer can have a good claim and still lose it to the calendar.
              Before anyone argues about the accounts, the contract asks whether
              the notice was right.
            </p>
            <p
              className={cn(
                label,
                "mt-8 text-muted-foreground tabular-nums md:col-span-8 md:col-start-1"
              )}
            >
              By{" "}
              <a href="/people/ruth-calloway" className={textLink}>
                Ruth Calloway
              </a>{" "}
              · <time dateTime="2026-11-10">10 November 2026</time> · 8 min read
            </p>
          </section>

          <section className={cn(sectionRule, grid)}>
            <nav
              aria-labelledby="on-this-page"
              className="md:col-span-4 md:col-start-9 md:row-start-1"
            >
              <h2 id="on-this-page" className={labelHeading}>
                On this page
              </h2>
              <ol className="mt-4 list-none p-0">
                {sections.map((section, i) => (
                  <li key={section.id} className={cn(i > 0 && "mt-2")}>
                    <a
                      href={`#${section.id}`}
                      className={cn("text-body", quietLink)}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-14 md:col-span-7 md:row-start-1 md:mt-0">
              <div className={cn("rounded-xl bg-card p-8", measure)}>
                <h2 className={labelHeading}>In brief</h2>
                <ul className="mt-4 list-disc pl-4">
                  <li>
                    A notice clause sets the form of a claim, the person it must
                    reach and the last day on which it can be made.
                  </li>
                  <li className="mt-2">
                    A court reads these clauses strictly, and a notice that
                    arrives one day late can be too late.
                  </li>
                  <li className="mt-2">
                    Check the clause the day a problem appears, and serve early
                    with the facts you have.
                  </li>
                </ul>
              </div>

              <p className={cn("mt-8", measure)}>
                When a company changes hands, the buyer relies on promises. The
                sellers warrant that the accounts are true, that the stock
                exists and that no large customer has threatened to leave. If
                one of those promises turns out to be wrong after completion,
                the buyer usually has a claim against the sellers for the loss
                it causes. That much is familiar to anyone who has signed a sale
                contract.
              </p>
              <p className={cn("mt-4", measure)}>
                Less familiar, and far more often fatal, is the part of the
                contract that says how the claim must be made. Almost every sale
                contract we see has a notice clause: a short paragraph, often
                tucked into the schedule of limits on the sellers&apos;
                liability, that says how, to whom and by when the buyer must
                tell the sellers about a claim. Miss one of those terms and the
                claim can end before anyone looks at its merits. This briefing
                explains what these clauses ask for, how notices fail, and what
                a buyer should do before it sends one.
              </p>

              <h2 id="asks" className="mt-14 scroll-mt-8 text-h2">
                What a notice clause asks for
              </h2>
              <p className={cn("mt-4", measure)}>
                A notice clause usually asks for four things. The first is
                writing. Most contracts require a notice to be in writing and
                signed by or for the buyer, and many say that email does not
                count unless the clause names it. A telephone call to the
                sellers&apos; solicitors, however detailed, is not notice.
              </p>
              <p className={cn("mt-4", measure)}>
                The second is the right address. The clause names the people who
                must receive the notice, usually each seller by name, and gives
                an address for each, sometimes with a copy to their solicitors.
                It also says when a notice is treated as received: on delivery
                by hand, a set number of working days after posting, or when it
                is signed for if it goes by courier. Those rules decide the date
                that counts, and it is rarely the date on which the buyer sent
                the letter.
              </p>
              <p className={cn("mt-4", measure)}>
                The third is detail. The buyer must usually give reasonable
                detail of the claim: which warranty it says was broken, what the
                facts are and, as far as it can tell, how much it claims. The
                fourth is a last day. Claims under the general warranties often
                have to be notified within eighteen months or two years of
                completion, tax claims within a longer period, and some
                contracts add a second deadline by which the buyer must also
                start proceedings.
              </p>

              <h2 id="fails" className="mt-14 scroll-mt-8 text-h2">
                Three ways a notice fails
              </h2>
              <p className={cn("mt-4", measure)}>
                In our experience a notice fails for one of three reasons. None
                of them has anything to do with whether the buyer was right
                about the business it bought.
              </p>
              <ol className={cn("mt-8 list-decimal pl-8", measure)}>
                <li>
                  It is sent too late. The notice reaches the sellers after the
                  last day, often because the buyer counted from the wrong date
                  or forgot that the contract moves the date of receipt.
                </li>
                <li className="mt-2">
                  It is sent to the wrong person or address. It goes to the
                  company the buyer now owns, to one seller and not all of them,
                  or to an old address that a later letter replaced.
                </li>
                <li className="mt-2">
                  It is too thin to say what the claim is. It reserves the
                  buyer&apos;s rights in general terms but names no warranty and
                  gives no facts, so the sellers cannot tell what they face.
                </li>
              </ol>
              <blockquote
                className={cn("mt-8 border-l border-border pl-8", measure)}
              >
                <p className="font-heading text-h2">
                  Most warranty claims are argued over the accounts. Some are
                  lost in the post room first.
                </p>
              </blockquote>
              <p className={cn("mt-8", measure)}>
                Sellers know this, and their advisers read a notice for its form
                before they read it for its substance. Most warranty claims are
                argued over the accounts. Some are lost in the post room first.
                A buyer who treats the notice as a formality hands the sellers a
                defence that costs them nothing to raise and can be decided
                without a trial.
              </p>

              <h2 id="a-day" className="mt-14 scroll-mt-8 text-h2">
                A claim lost by a day
              </h2>
              <p className={cn("mt-4", measure)}>
                This year we acted for the sellers of Halden Print, a family
                printing company sold to a trade buyer in the spring of 2024.
                The sale contract required notice of any warranty claim to be
                given in writing to each seller, at the address in the contract,
                no later than 31 March 2026. It said that a notice sent by
                courier was received when it was signed for.
              </p>
              <p className={cn("mt-4", measure)}>
                The buyer said that the sellers had overstated the value of the
                order book, and claimed £3.4m. Its solicitors prepared a careful
                letter, but it was not finished until the afternoon of 31 March
                2026. They sent it by courier that day. It was signed for at the
                sellers&apos; address at 09:40 on 1 April 2026, one day after
                the deadline.
              </p>
              <p className={cn("mt-4", measure)}>
                We applied to strike the claim out. The buyer argued that the
                letter had been sent in time and that the sellers had lost
                nothing by receiving it a morning later. The court disagreed.
                The contract said when a notice counted as given, both sides had
                agreed to it, and on its terms this notice came one day late.
                The claim was struck out without any hearing of whether the
                order book had in fact been overstated, and the buyer was
                ordered to pay our clients&apos; costs.
              </p>

              <h2 id="before" className="mt-14 scroll-mt-8 text-h2">
                What to do before you send
              </h2>
              <p className={cn("mt-4", measure)}>
                None of this is hard to avoid if the clause is read early. A
                buyer who finds a problem after completion should treat the
                notice as the first step of the claim, not the last, and should
                take these steps before anything is sent.
              </p>
              <ol className={cn("mt-8 list-decimal pl-8", measure)}>
                <li>
                  Read the notice clause and the limits on the sellers&apos;
                  liability together, and write down the last day for each kind
                  of claim.
                </li>
                <li className="mt-2">
                  Check the names and addresses in the contract against any
                  later letter that changed them, and serve every seller who
                  must be served.
                </li>
                <li className="mt-2">
                  Describe the claim with the facts you have now, naming each
                  warranty and giving a figure, even if it is an estimate.
                </li>
                <li className="mt-2">
                  Send the notice by a method the clause names, early enough
                  that the date it counts as received falls well before the
                  deadline.
                </li>
              </ol>
              <p className={cn("mt-8", measure)}>
                A notice that arrives a month early and says a little too little
                can often be put right with a second letter before the deadline.
                A notice that arrives a day late cannot be put right at all. If
                you have bought a business and something in it is not as you
                were told, speak to us before you write to the sellers. We would
                rather spend an hour on the clause than a year explaining why
                the claim was lost.
              </p>
              <p
                className={cn(
                  "mt-8 font-mono text-label text-muted-foreground",
                  measure
                )}
              >
                This briefing is general information and is not advice on any
                particular matter.
              </p>
            </div>
          </section>
        </article>

        <section className={cn(sectionRule, grid)}>
          <div className="md:col-span-2">
            <div
              role="img"
              aria-label="Ruth Calloway in a dark suit, at a window of the firm's library"
              className="flex aspect-3/4 w-1/3 items-end rounded-xl border border-border bg-card p-4 md:w-full"
            >
              <span
                aria-hidden="true"
                className="font-heading text-h1 text-muted-foreground"
              >
                RC
              </span>
            </div>
          </div>
          <div className="mt-8 md:col-span-7 md:col-start-4 md:mt-0">
            <h2 className={labelHeading}>About the author</h2>
            <h3 className="mt-4 text-h2">
              <a href="/people/ruth-calloway" className={quietLink}>
                Ruth Calloway
              </a>
            </h3>
            <p className={cn(label, "mt-2 text-muted-foreground")}>
              Partner · Commercial disputes
            </p>
            <p className={cn("mt-4", measure)}>
              Ruth leads our work on disputes that follow the sale of a company,
              acting for buyers and sellers in warranty, indemnity and earn-out
              claims. She has spent twenty years in Wexcombe on the claims that
              begin where a completion meeting ends.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className={cn(
                  buttonVariants(),
                  "h-auto px-8 py-2 font-mono text-label font-normal uppercase"
                )}
              >
                Discuss this with Ruth
              </a>
            </div>
          </div>
        </section>

        <section className={sectionRule}>
          <h2 className="text-h2">Related briefings</h2>
          <ul className="mt-8 list-none border-b border-border p-0">
            {related.map((item) => (
              <li
                key={item.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p
                  className={cn(
                    label,
                    "text-muted-foreground tabular-nums md:col-span-3"
                  )}
                >
                  <time dateTime={item.dateTime}>{item.date}</time> ·{" "}
                  {item.read}
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href="#" className={quietLink}>
                      {item.title}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {item.author} · {item.practice}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href="#"
              className={cn(label, textLink, "inline-flex items-center gap-2")}
            >
              All briefings
              <ArrowRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </p>
        </section>
      </main>

      <footer className="mt-14 border-t border-border py-8 md:mt-28">
        <div className={grid}>
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address
              className={cn("mt-2 text-muted-foreground not-italic", label)}
            >
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={label}>
              <a href="tel:01632960214" className={quietLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2 wrap-anywhere")}>
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn(quietLink, "normal-case")}
              >
                enquiries@harrowvane.example
              </a>
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="mt-8 md:col-span-4 md:col-start-9 md:mt-0"
          >
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.href} className={cn(i > 0 && "mt-2")}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
                      quietLink,
                      link.current && "underline"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
