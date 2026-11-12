import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

// A link in running text.
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-muted-foreground",
  focusRing
)

// A link in the header or footer, or a name or title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label uppercase"
const labelHeading = "font-mono text-label uppercase text-foreground"
const laterSection = "mt-8 border-t border-border pt-8 md:mt-14 md:pt-14"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses", current: true },
  { label: "Contact", href: "/contact" },
]

const contents = [
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

const inBrief = [
  "A notice clause sets the form of a claim, the person it must go to and the last day for sending it.",
  "A court reads these clauses strictly, and a notice that arrives one day late can end the claim.",
  "Check the clause as soon as a problem appears, and serve notice early with the facts you have.",
]

const failures = [
  "It is sent too late. A notice that arrives a day after the deadline is treated in the same way as one that never arrives at all.",
  "It goes to the wrong person or the wrong address. A letter to the sellers’ old office, or to a director who has since left, may not count as served, even if it reaches the right people in the end.",
  "It is too thin to say what the claim is. A notice that lists every warranty in the contract, or says only that the buyer has concerns about the accounts, may not give the detail the clause asks for.",
]

const steps = [
  "Read the notice clause and every clause it refers to, and write down the deadline, the method and the address it requires.",
  "Send the notice well before the last day, with the facts and figures you have, and say plainly that the figures will be updated.",
  "Send it to every address the contract names, by every method it allows, and keep proof of when each copy arrived.",
  "Name each warranty you rely on and explain, in a sentence or two, what you say went wrong under it.",
]

function SiteNav({
  ariaLabel,
  footer,
}: {
  ariaLabel: string
  footer?: boolean
}) {
  return (
    <nav aria-label={ariaLabel}>
      <ul
        className={
          footer ? "list-none p-0" : "flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8"
        }
      >
        {navLinks.map((link, i) => (
          <li key={link.href} className={footer && i > 0 ? "mt-2" : undefined}>
            <a
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(label, plainLink, link.current && "underline")}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
        <a href="/" className={cn("font-heading text-h2", plainLink)}>
          Harrow &amp; Vane
        </a>
        <SiteNav ariaLabel="Main" />
      </header>

      <main>
        <article>
          {/* Opening */}
          <section className="mt-14 grid grid-cols-1 md:mt-28 md:grid-cols-12 md:gap-x-8">
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

          {/* The briefing */}
          <section
            className={cn(
              laterSection,
              "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
            )}
          >
            <nav
              aria-labelledby="on-this-page"
              className="md:col-span-4 md:col-start-9 md:row-start-1"
            >
              <h2 id="on-this-page" className={labelHeading}>
                On this page
              </h2>
              <ol className="mt-4 list-none p-0">
                {contents.map((item, i) => (
                  <li key={item.id} className={i > 0 ? "mt-2" : undefined}>
                    <a
                      href={`#${item.id}`}
                      className={cn("text-body", plainLink)}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-14 md:col-span-7 md:row-start-1 md:mt-0">
              <div className="rounded-xl bg-card p-8">
                <h2 className={labelHeading}>In brief</h2>
                <ul className="mt-4 list-disc pl-4">
                  {inBrief.map((item, i) => (
                    <li
                      key={item}
                      className={cn("max-w-xl text-body", i > 0 && "mt-2")}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 max-w-xl">
                When a company changes hands, the buyer rarely learns everything
                on the day of completion. A customer contract turns out to have
                been lost months before, a tax bill arrives that nobody
                disclosed, or the stock is worth less than the accounts said.
                The sale contract usually answers this with warranties: promises
                by the sellers about the state of the business, and a right for
                the buyer to claim if one of them proves untrue.
              </p>
              <p className="mt-4 max-w-xl">
                The same contract also says how that right must be used.
                Somewhere after the warranties, often in a schedule that few
                people read twice, sits a notice clause. It sets out how a claim
                must be made, to whom and by when. In our experience it decides
                more warranty disputes than the accounts do, and it decides them
                early, before anyone has looked at whether the claim is any
                good.
              </p>

              <h2 id="asks" className="mt-14 scroll-mt-8 text-h2">
                What a notice clause asks for
              </h2>
              <p className="mt-4 max-w-xl">
                Most notice clauses ask for four things. The notice must be in
                writing, and many clauses go further and exclude email, or allow
                it only when a copy follows by post or courier. It must be sent
                to a named person at a named address, usually the sellers
                themselves or their solicitors, and the contract will often say
                that a notice is served only when it arrives there, not when it
                leaves the buyer’s office.
              </p>
              <p className="mt-4 max-w-xl">
                It must also give reasonable detail of the claim. The wording
                varies, but the idea is the same: the sellers should be able to
                read the notice and know which warranty is said to be broken,
                what the buyer says happened, and roughly how much is at stake.
                A notice does not need to prove the claim, and it can say that
                its figures are an estimate. It cannot simply reserve the
                buyer’s position in general terms.
              </p>
              <p className="mt-4 max-w-xl">
                Finally, the clause sets a last day. For general warranties this
                is often eighteen months or two years after completion; for tax
                it is usually longer. The deadline is the part buyers notice,
                and it is the part sellers test first, because a court treats it
                as a fixed line rather than a target.
              </p>

              <h2 id="fails" className="mt-14 scroll-mt-8 text-h2">
                Three ways a notice fails
              </h2>
              <p className="mt-4 max-w-xl">
                A court reads a notice clause as the parties wrote it. The
                sellers agreed to stay exposed to claims for a set time and on
                set terms, and a court will not usually extend that time or
                soften those terms because the buyer meant well. When a notice
                fails, it tends to fail in one of three ways.
              </p>
              <ol className="mt-8 max-w-xl list-decimal pl-8">
                {failures.map((item, i) => (
                  <li key={item} className={i > 0 ? "mt-2" : undefined}>
                    {item}
                  </li>
                ))}
              </ol>
              <blockquote className="mt-8 max-w-xl border-l border-border pl-8">
                <p className="font-heading text-h2">
                  Most warranty claims are argued over the accounts. Some are
                  lost in the post room first.
                </p>
              </blockquote>
              <p className="mt-8 max-w-xl">
                Each of these can be avoided, and none of them depends on the
                merits. That is what makes them so costly: a claim the buyer
                might well have won is never heard, and the costs of arguing
                about the notice usually fall on the side that sent it.
              </p>

              <h2 id="a-day" className="mt-14 scroll-mt-8 text-h2">
                A claim lost by a day
              </h2>
              <p className="mt-4 max-w-xl">
                This year we acted for the three sellers of Halden Print, a
                family printing company sold in the spring of 2024. The sale
                contract gave the buyer until 17:00 on 14 March 2026 to notify
                any claim under the general warranties, and said that a notice
                sent by courier was served when it was signed for at the
                sellers’ solicitors’ office.
              </p>
              <p className="mt-4 max-w-xl">
                The buyer believed that the company’s order book had been
                overstated before the sale, and it prepared a claim for £3.4m.
                Its letter was finished on the afternoon of the last day and
                handed to a courier at 16:10. The courier reached the sellers’
                solicitors after their office had closed, and the letter was
                signed for at 09:05 on 15 March 2026, the next morning.
              </p>
              <p className="mt-4 max-w-xl">
                We applied to strike the claim out before any evidence about the
                order book was heard. The buyer argued that the letter had left
                in time and that one morning’s delay had harmed nobody. The
                court disagreed. The contract said when a notice was served, the
                notice had been served a day late, and the sellers’ liability
                for the claim had already ended. The claim was struck out, and
                the buyer was ordered to pay our clients’ costs.
              </p>

              <h2 id="before" className="mt-14 scroll-mt-8 text-h2">
                What to do before you send
              </h2>
              <p className="mt-4 max-w-xl">
                None of this is hard to get right, but it has to be done early,
                by someone who has read the clause rather than remembered it.
                Before a notice goes out, we would take four steps.
              </p>
              <ol className="mt-8 max-w-xl list-decimal pl-8">
                {steps.map((item, i) => (
                  <li key={item} className={i > 0 ? "mt-2" : undefined}>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-xl">
                A notice sent early with an estimate can be followed by a fuller
                letter later; a notice sent late cannot be mended. If you are a
                buyer with a possible claim, the time to look at the clause is
                the week you find the problem, not the week the deadline falls.
                If you are a seller, the same clause is often your first and
                cheapest defence, and it is worth reading before you reply to
                any letter of claim.
              </p>

              <p className="mt-8 max-w-xl font-mono text-label text-muted-foreground">
                This briefing is general information and is not advice on any
                particular matter.
              </p>
            </div>
          </section>
        </article>

        {/* About the author */}
        <section
          className={cn(
            laterSection,
            "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"
          )}
        >
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
              <a href="/people/ruth-calloway" className={plainLink}>
                Ruth Calloway
              </a>
            </h3>
            <p className={cn(label, "mt-2 text-muted-foreground")}>
              Partner · Commercial disputes
            </p>
            <p className="mt-4 max-w-xl">
              Ruth acts for buyers and sellers of private companies in the
              disputes that follow a sale, from warranty and indemnity claims to
              earn-outs and completion accounts. She became a partner in 2026
              and leads the team’s work on claims that turn on the wording of
              the sale contract.
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

        {/* Related briefings */}
        <section className={laterSection}>
          <h2 className="text-h2">Related briefings</h2>
          <ul className="mt-8 list-none border-b border-border p-0">
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
                    <a href="#" className={plainLink}>
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
          <p className={cn(label, "mt-8")}>
            <a
              href="#"
              className={cn("inline-flex items-center gap-2", textLink)}
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
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
            <address className="mt-2 font-mono text-label text-muted-foreground uppercase not-italic">
              <p>4 Chancery Row</p>
              <p>Wexcombe WX1 2LN</p>
            </address>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
            <p className={label}>
              <a href="tel:01632960214" className={plainLink}>
                01632 960 214
              </a>
            </p>
            <p className={cn(label, "mt-2")}>
              <a
                href="mailto:enquiries@harrowvane.example"
                className={cn("normal-case", plainLink)}
              >
                enquiries@harrowvane.example
              </a>
            </p>
          </div>
          <div className="mt-8 md:col-span-4 md:col-start-9 md:mt-0">
            <SiteNav ariaLabel="Footer" footer />
          </div>
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
        </p>
      </footer>
    </div>
  )
}

export default App
