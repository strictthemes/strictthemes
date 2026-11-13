import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text, and an onward link.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusOutline
)

// A link in the header or the footer, and a name or a title that is a link.
const titleLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusOutline
)

const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
const sectionRule = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"
const label = "font-mono text-label uppercase"
const labelHeading = "font-mono text-label text-foreground uppercase"
const paragraph = "max-w-xl text-body"

const navLinks = [
  { name: "Practice", href: "/practice/commercial-disputes", current: false },
  { name: "People", href: "/people/ruth-calloway", current: false },
  { name: "Insights", href: "/insights/notice-clauses", current: true },
  { name: "Contact", href: "/contact", current: false },
]

const headings = [
  { id: "asks", title: "What a notice clause asks for" },
  { id: "fails", title: "Three ways a notice fails" },
  { id: "a-day", title: "A claim lost by a day" },
  { id: "before", title: "What to do before you send" },
]

const inBrief = [
  "A notice clause sets the form of a warranty claim, the person who must receive it and the last day on which it may arrive.",
  "A court reads these clauses strictly, and a notice that arrives one day late can be too late.",
  "Check the clause as soon as you suspect a problem, and serve early with the facts you have.",
]

const opening = [
  "When a company is sold, the sellers promise the buyer certain things about it: that the accounts are fair, that the tax is paid, that no dispute is waiting in a drawer. These promises are the warranties. If one of them proves untrue after completion, the buyer usually has a claim against the sellers for the difference between the company it paid for and the company it received.",
  "The same contract almost always says how that claim must be started. It names the form of the notice, the person who must receive it and the last day on which it may arrive. We see buyers treat these terms as paperwork, and we see sellers rely on them to end a claim outright. Most warranty claims are argued over the accounts. Some are lost in the post room first. This briefing explains what a notice clause asks for, how a notice fails and what we advise a buyer to do before sending one.",
]

const asks = [
  "A notice clause is a short term, often set among the limits on the sellers' liability, and it is easy to read past. It usually asks for four things. The notice must be in writing. It must go to the address the contract gives, by a method the contract allows. It must set out the claim in reasonable detail. And it must be given before a last day, which is commonly between eighteen months and two years after completion for most warranties, and longer for tax. Each of the four is a condition. The contract will normally say that the sellers are not liable for a claim unless notice has been given in this way, so the clause does more than ask for courtesy. A buyer who misses one condition has no claim to bring, whatever the accounts show.",
  "Reasonable detail is the condition that buyers most often underestimate. Contracts differ, but most ask the buyer to name the warranty relied on, to describe the facts that make it untrue and to give an estimate of the sum claimed. Where the contract lists what the notice must contain, each item on the list has to be there.",
  "Many contracts add a second deadline. Once notice is given, the buyer must issue and serve court proceedings within a further period, often six or nine months, or the claim is treated as withdrawn. We advise putting both dates in the diary on the day of completion.",
]

const failsIntro =
  "In our experience a notice goes wrong in one of three ways. None of them has anything to do with whether the warranty was broken."

const failures = [
  "It is sent too late. The clause may count a notice as given only when it is received, and a delivery after working hours can count as made on the next working day.",
  "It goes to the wrong person or address. A letter to the sellers' solicitors, or an email to the director the buyer knows best, is not notice if the contract names a registered office and delivery by hand or by post.",
  "It is too thin to say what the claim is. A letter that reserves the buyer's rights in general terms, without the warranty, the facts and an estimate of the sum, may not be a notice at all.",
]

const pullQuote =
  "Most warranty claims are argued over the accounts. Some are lost in the post room first."

const failsClose =
  "A court reads these clauses strictly, and for a reason. The sellers agreed to stay liable for a limited time and on stated terms, and they are entitled to know on the last day whether they still face a claim. The court will not rewrite that bargain because the buyer's case looks strong or because the miss was small. Nor does it usually help that the sellers knew of the problem already: knowing of a problem is different from being given notice of a claim."

const aDay = [
  "This year we acted for the sellers of Halden Print, a printing company sold on 11 March 2024. The contract gave the buyer eighteen months to give notice of a warranty claim, so the last day was 11 September 2025. It also said that a notice sent by courier was given when it was signed for at the sellers' address.",
  "The buyer believed that the stock in the completion accounts had been overstated, and put its loss at £3.4m. Its advisers finished the notice on the afternoon of 11 September 2025 and handed it to a courier at 16:50. The sellers' office had closed by the time the courier arrived, and the letter was signed for at 09:40 on 12 September 2025. A copy sent by email that evening did not count, because the contract did not allow notice by email.",
  "We applied to have the claim struck out. The buyer answered that the sellers had lost nothing by the delay: they had known of the stock count for months, and they had read the email that evening. The court accepted both points and held that neither mattered. The contract set a time and a method, both sides had been advised when they signed it, and there was no reason to give its words a looser meaning than they had. It held that the clause meant what it said: notice was given on 12 September 2025, one day after the deadline, and the sellers' liability had ended the evening before. The question of the stock was never heard. A claim for £3.4m ended on the timing of one delivery, and the buyer was ordered to pay the sellers' costs of the application.",
]

const beforeIntro =
  "None of this is hard to avoid, but it has to be done early. When a buyer first suspects a problem, and before the detail is known, we suggest four steps. The clause was written for exactly this moment, and it is too often the last thing anyone reads."

const steps = [
  "Read the notice clause itself, and the definitions it relies on, before you draft a word of the letter.",
  "Work out the last day on the contract's own terms, including when a delivery counts as made, and plan to serve at least two weeks before it.",
  "Send the notice to every address and by every method the contract names, and keep proof of each delivery.",
  "Name the warranty, set out the facts you have and give your best estimate of the sum, and say that you will add to it as you learn more.",
]

const beforeClose =
  "A notice served early with the facts then known is far safer than a complete one served on the last afternoon. If the sellers accept that the notice was good, nothing is lost by the care taken. If they do not, the buyer still has time to serve again. We are glad to read a notice clause with a client before a claim is sent, and for sellers we check every notice received against the contract on the day it arrives."

const related = [
  {
    title: "Freezing orders: the first forty-eight hours",
    date: "29 October 2026",
    dateTime: "2026-10-29",
    read: "6 min read",
    author: "David Achterberg",
    area: "Commercial disputes",
  },
  {
    title: "Break clauses in a commercial lease: getting the notice right",
    date: "1 October 2026",
    dateTime: "2026-10-01",
    read: "5 min read",
    author: "Thomas Kerridge",
    area: "Real estate",
  },
  {
    title: "Earn-outs that end in dispute",
    date: "17 September 2026",
    dateTime: "2026-09-17",
    read: "6 min read",
    author: "Ruth Calloway",
    area: "Commercial disputes",
  },
]

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", titleLink)}>
          Harrow &amp; Vane
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={cn(label, titleLink, link.current && "underline")}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <article>
          <section className={cn(grid, "mt-14 md:mt-28")}>
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
                "mt-8 text-muted-foreground md:col-span-8 md:col-start-1"
              )}
            >
              By{" "}
              <a href="/people/ruth-calloway" className={textLink}>
                Ruth Calloway
              </a>{" "}
              · <time dateTime="2026-11-10">10 November 2026</time> · 8 min read
            </p>
          </section>

          <section className={cn(grid, sectionRule)}>
            <nav
              aria-labelledby="on-this-page"
              className="md:col-span-4 md:col-start-9 md:row-start-1"
            >
              <h2 id="on-this-page" className={labelHeading}>
                On this page
              </h2>
              <ol className="mt-4 list-none">
                {headings.map((heading, index) => (
                  <li key={heading.id} className={cn(index > 0 && "mt-2")}>
                    <a
                      href={`#${heading.id}`}
                      className={cn("text-body", titleLink)}
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-14 md:col-span-7 md:row-start-1 md:mt-0">
              <div className="rounded-xl bg-card p-8">
                <h2 className={labelHeading}>In brief</h2>
                <ul className="mt-4 max-w-xl list-disc pl-4 text-body">
                  {inBrief.map((point, index) => (
                    <li key={point} className={cn(index > 0 && "mt-2")}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {opening.map((text, index) => (
                <p
                  key={text}
                  className={cn(paragraph, index === 0 ? "mt-8" : "mt-4")}
                >
                  {text}
                </p>
              ))}

              <h2 id="asks" className="mt-14 scroll-mt-8 text-h2">
                {headings[0].title}
              </h2>
              {asks.map((text) => (
                <p key={text} className={cn(paragraph, "mt-4")}>
                  {text}
                </p>
              ))}

              <h2 id="fails" className="mt-14 scroll-mt-8 text-h2">
                {headings[1].title}
              </h2>
              <p className={cn(paragraph, "mt-4")}>{failsIntro}</p>
              <ol className="mt-8 max-w-xl list-decimal pl-8 text-body">
                {failures.map((text, index) => (
                  <li key={text} className={cn(index > 0 && "mt-2")}>
                    {text}
                  </li>
                ))}
              </ol>
              <blockquote className="mt-8 border-l border-border pl-8">
                <p className="max-w-xl font-heading text-h2">{pullQuote}</p>
              </blockquote>
              <p className={cn(paragraph, "mt-8")}>{failsClose}</p>

              <h2 id="a-day" className="mt-14 scroll-mt-8 text-h2">
                {headings[2].title}
              </h2>
              {aDay.map((text) => (
                <p key={text} className={cn(paragraph, "mt-4")}>
                  {text}
                </p>
              ))}

              <h2 id="before" className="mt-14 scroll-mt-8 text-h2">
                {headings[3].title}
              </h2>
              <p className={cn(paragraph, "mt-4")}>{beforeIntro}</p>
              <ol className="mt-8 max-w-xl list-decimal pl-8 text-body">
                {steps.map((text, index) => (
                  <li key={text} className={cn(index > 0 && "mt-2")}>
                    {text}
                  </li>
                ))}
              </ol>
              <p className={cn(paragraph, "mt-8")}>{beforeClose}</p>

              <p className="mt-8 max-w-xl font-mono text-label text-muted-foreground">
                This briefing is general information and is not advice on any
                particular matter.
              </p>
            </div>
          </section>
        </article>

        <section className={cn(grid, sectionRule)}>
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
              <a href="/people/ruth-calloway" className={titleLink}>
                Ruth Calloway
              </a>
            </h3>
            <p className={cn(label, "mt-2 text-muted-foreground")}>
              Partner · Commercial disputes
            </p>
            <p className={cn(paragraph, "mt-4")}>
              Ruth acts for buyers and sellers in the disputes that follow the
              sale of a company: warranty claims, earn-outs and arguments over
              completion accounts. She also advises boards on claims between
              shareholders, and on how to end a commercial contract without
              starting a dispute.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "default" }),
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
          <ul className="mt-8 list-none border-b border-border">
            {related.map((item) => (
              <li
                key={item.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                  <time dateTime={item.dateTime}>{item.date}</time> ·{" "}
                  {item.read}
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href="#" className={titleLink}>
                      {item.title}
                    </a>
                  </h3>
                  <p className={cn(label, "mt-2 text-muted-foreground")}>
                    {item.author} · {item.area}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <a
              href="#"
              className={cn(label, "inline-flex items-center gap-2", textLink)}
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
              className={cn(label, "mt-2 text-muted-foreground not-italic")}
            >
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={label}>
              <a href="tel:01632960214" className={titleLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2")}>
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn("normal-case", titleLink)}
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
              {navLinks.map((link, index) => (
                <li key={link.name} className={cn(index > 0 && "mt-2")}>
                  <a
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className={cn(
                      label,
                      titleLink,
                      link.current && "underline"
                    )}
                  >
                    {link.name}
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
