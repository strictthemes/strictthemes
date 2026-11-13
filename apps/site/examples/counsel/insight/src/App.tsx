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

// A link in the header or footer, and a name or a title that is a link.
const plainLink = cn(
  "text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const label = "font-mono text-label uppercase"

const navLinks = [
  { label: "Practice", href: "/practice/commercial-disputes" },
  { label: "People", href: "/people/ruth-calloway" },
  { label: "Insights", href: "/insights/notice-clauses" },
  { label: "Contact", href: "/contact" },
]

const currentNav = "Insights"

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
    minutes: 6,
    author: "David Achterberg",
    practice: "Commercial disputes",
  },
  {
    title: "Break clauses in a commercial lease: getting the notice right",
    date: "1 October 2026",
    dateTime: "2026-10-01",
    minutes: 5,
    author: "Thomas Kerridge",
    practice: "Real estate",
  },
  {
    title: "Earn-outs that end in dispute",
    date: "17 September 2026",
    dateTime: "2026-09-17",
    minutes: 6,
    author: "Ruth Calloway",
    practice: "Commercial disputes",
  },
]

function sectionTitle(id: string) {
  return sections.find((section) => section.id === id)?.title ?? ""
}

function Header() {
  return (
    <header className="flex flex-col items-start gap-4 border-b border-border py-8 md:flex-row md:items-baseline md:justify-between">
      <a href="/" className={cn("font-heading text-h2", plainLink)}>
        Harrow &amp; Vane
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8">
          {navLinks.map((link) => {
            const current = link.label === currentNav
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(label, plainLink, current && "underline")}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-14 border-t border-border py-8 md:mt-28">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <p className="font-heading text-h2">Harrow &amp; Vane LLP</p>
          <address
            className={cn(
              "mt-2 text-muted-foreground not-italic tabular-nums",
              label
            )}
          >
            <p>4 Chancery Row</p>
            <p>Wexcombe WX1 2LN</p>
          </address>
        </div>
        <div className="mt-8 md:col-span-4 md:col-start-5 md:mt-0">
          <p className={cn(label, "tabular-nums")}>
            <a href="tel:01632960214" className={plainLink}>
              01632 960 214
            </a>
          </p>
          <p className={cn("mt-2 wrap-anywhere", label)}>
            <a
              href="mailto:enquiries@harrowvane.example"
              className={cn("normal-case", plainLink)}
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
            {navLinks.map((link, index) => {
              const current = link.label === currentNav
              return (
                <li key={link.href} className={index > 0 ? "mt-2" : undefined}>
                  <a
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(label, plainLink, current && "underline")}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <p className={cn("mt-8 text-muted-foreground tabular-nums", label)}>
        © 2026 Harrow &amp; Vane LLP · Registered in England and Wales
      </p>
    </footer>
  )
}

function SectionHeading({ id }: { id: string }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-8 text-h2">
      {sectionTitle(id)}
    </h2>
  )
}

function Briefing() {
  return (
    <div className="mt-14 md:col-span-7 md:col-start-1 md:row-start-1 md:mt-0">
      <div className="max-w-xl rounded-xl bg-card p-8">
        <h2 className={cn(label, "text-foreground")}>In brief</h2>
        <ul className="mt-4 list-disc pl-4">
          <li>
            A notice clause sets the form of a claim, the person who must
            receive it and the last day on which it can arrive.
          </li>
          <li className="mt-2">
            A court reads the clause strictly, and a notice that arrives one day
            late can be too late.
          </li>
          <li className="mt-2">
            Check the clause as soon as a problem appears, and serve the notice
            early with the facts you have.
          </li>
        </ul>
      </div>

      <p className="mt-8 max-w-xl">
        When a company changes hands, the sale contract usually gives the buyer
        a set of warranties: promises from the sellers about the accounts, the
        customer contracts, the tax position and much else. If one of those
        promises turns out to be untrue after completion, the buyer can claim
        its loss. That much is well understood. What is read less often, until
        it matters, is the clause that says how the buyer must tell the sellers
        about the claim.
      </p>
      <p className="mt-4 max-w-xl">
        That clause is not a formality. It sets the form the notice must take,
        the person and the address it must reach, and the last day on which it
        can arrive. A notice that misses any one of those terms can end the
        claim before anyone asks whether it is a good one. In this briefing we
        explain what such a clause asks for, how notices fail, and what we
        learned this year defending the sellers of a printing business against a
        claim that arrived one day late.
      </p>

      <SectionHeading id="asks" />
      <p className="mt-4 max-w-xl">
        Most notice clauses in a share or business sale contract ask for four
        things. The notice must be in writing, and the contract often says what
        writing means: a signed letter, and sometimes expressly not an email. It
        must go to a named person at a named address, usually the sellers
        themselves or their solicitors, and the contract may say how it is to be
        delivered: by hand, by courier or by recorded post.
      </p>
      <p className="mt-4 max-w-xl">
        The notice must also give reasonable detail of the claim. Contracts word
        this in different ways, but the purpose is the same: the sellers should
        be able to tell from the letter which warranty is said to be broken,
        what the facts are and, where it can be given, roughly how much is
        claimed. A letter that only says the buyer reserves its rights does not
        usually meet that test.
      </p>
      <p className="mt-4 max-w-xl">
        Finally, there is a last day. Claims under most warranties must be
        notified within a period after completion, commonly eighteen months or
        two years, with a longer period for tax. The contract will also say when
        a notice counts as given: on posting, on delivery, or on a signature at
        the door. That last detail decides more claims than its length suggests.
      </p>

      <SectionHeading id="fails" />
      <p className="mt-4 max-w-xl">
        When we look at a notice that has gone wrong, the fault is nearly always
        one of three. None of them has anything to do with whether the
        buyer&apos;s complaint is justified, and each can be avoided with an
        hour of care. Most warranty claims are argued over the accounts. Some
        are lost in the post room first.
      </p>
      <ol className="mt-8 max-w-xl list-decimal pl-8">
        <li>
          It is sent too late. The deadline is a fixed date, and a court will
          not move it because the buyer was busy, the facts were still emerging
          or the sellers lost nothing by the delay.
        </li>
        <li className="mt-2">
          It is sent to the wrong person or address. A letter to the
          sellers&apos; old office, or an email to a director who stayed on
          after the sale, may not count as notice at all.
        </li>
        <li className="mt-2">
          It is too thin to say what the claim is. A notice that names no
          warranty and no facts can be treated as no notice, even when it
          arrives on time and at the right door.
        </li>
      </ol>
      <blockquote className="mt-8 max-w-xl border-l border-border pl-8">
        <p className="font-heading text-h2">
          Most warranty claims are argued over the accounts. Some are lost in
          the post room first.
        </p>
      </blockquote>
      <p className="mt-8 max-w-xl">
        A court asked whether a notice was valid reads the clause strictly,
        because both sides agreed it as the price of certainty: the sellers gave
        the warranties on the footing that any claim would come in a set form by
        a set day. A buyer who misses that form cannot usually rescue the claim
        by showing that the sellers knew about the problem anyway.
      </p>

      <SectionHeading id="a-day" />
      <p className="mt-4 max-w-xl">
        This year we acted for the three former owners of Halden Print, a family
        printing company sold to a trade buyer in March 2024. The sale contract
        gave the buyer eighteen months from completion, until 11 September 2025,
        to notify any claim under the general warranties. It required a signed
        letter to each seller at the home address set out in the contract, and
        it said that a letter sent by courier was given when it was signed for.
      </p>
      <p className="mt-4 max-w-xl">
        In the summer of 2025 the buyer found that two large customer contracts
        had been priced below cost, and it said the accounts had hidden the
        loss. It prepared a claim for £3.4m. The letter was finished on the
        afternoon of 11 September 2025 and handed to a courier that evening. It
        was signed for at the sellers&apos; addresses on the morning of 12
        September 2025, one day after the deadline.
      </p>
      <p className="mt-4 max-w-xl">
        We applied on the sellers&apos; behalf to have the claim struck out
        before any argument about the accounts began. The buyer said the delay
        was trivial and that the sellers had known of its concerns for weeks.
        The court held that the contract was clear about when a courier letter
        was given, that the date was a limit and not a target, and that what the
        sellers knew did not replace a notice in the agreed form. The claim was
        struck out, and the question of whether the accounts were wrong was
        never heard.
      </p>

      <SectionHeading id="before" />
      <p className="mt-4 max-w-xl">
        If you are a buyer who has found a problem after a sale, the work on the
        notice should start on the day you find it, not in the week the deadline
        falls. These are the steps we take with our clients.
      </p>
      <ol className="mt-8 max-w-xl list-decimal pl-8">
        <li>
          Read the notice clause and the time limits together, and write down
          the last day, the form required and the moment the contract treats a
          notice as given.
        </li>
        <li className="mt-2">
          Check each recipient&apos;s name and address against the contract and
          any later letter that changed them, and send to every person the
          clause names.
        </li>
        <li className="mt-2">
          Set out the warranty you rely on, the facts as you know them and an
          estimate of the sum, saying plainly that the figures may change.
        </li>
        <li className="mt-2">
          Send the notice at least a week early, by the method the contract
          names, and keep proof of when and where it arrived.
        </li>
      </ol>
      <p className="mt-8 max-w-xl">
        A notice does not need to prove the claim. It needs to meet the terms of
        the clause, on time and at the right door. A buyer who serves early,
        with the facts it has, keeps the argument about the merits for later; a
        buyer who waits for the full picture can lose that argument before it
        begins. If you act for the sellers, the same clause is worth reading as
        soon as a complaint arrives, because the moment a letter was signed for
        may be the strongest point you have.
      </p>

      <p className="mt-8 max-w-xl font-mono text-label text-muted-foreground">
        This briefing is general information and is not advice on any particular
        matter.
      </p>
    </div>
  )
}

export function App() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 text-body md:px-8">
      <Header />
      <main>
        <article>
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
                "mt-8 text-muted-foreground tabular-nums md:col-span-8 md:col-start-1",
                label
              )}
            >
              By{" "}
              <a href="/people/ruth-calloway" className={textLink}>
                Ruth Calloway
              </a>{" "}
              · <time dateTime="2026-11-10">10 November 2026</time> · 8 min read
            </p>
          </section>

          <section className="mt-8 grid grid-cols-1 border-t border-border pt-8 md:mt-14 md:grid-cols-12 md:gap-x-8 md:pt-14">
            <nav
              aria-labelledby="on-this-page"
              className="md:col-span-4 md:col-start-9 md:row-start-1"
            >
              <h2 id="on-this-page" className={cn(label, "text-foreground")}>
                On this page
              </h2>
              <ol className="mt-4">
                {sections.map((section, index) => (
                  <li
                    key={section.id}
                    className={index > 0 ? "mt-2" : undefined}
                  >
                    <a
                      href={`#${section.id}`}
                      className={cn("text-body", plainLink)}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <Briefing />
          </section>
        </article>

        <section className="mt-8 grid grid-cols-1 border-t border-border pt-8 md:mt-14 md:grid-cols-12 md:gap-x-8 md:pt-14">
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
            <h2 className={cn(label, "text-foreground")}>About the author</h2>
            <h3 className="mt-4 text-h2">
              <a href="/people/ruth-calloway" className={plainLink}>
                Ruth Calloway
              </a>
            </h3>
            <p className={cn("mt-2 text-muted-foreground", label)}>
              Partner · Commercial disputes
            </p>
            <p className="mt-4 max-w-xl">
              Ruth leads our work on disputes that follow the sale of a company,
              acting for buyers and sellers in warranty, indemnity and earn-out
              claims. She also advises boards on how to answer a claim in its
              first weeks, before the positions harden.
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

        <section className="mt-8 border-t border-border pt-8 md:mt-14 md:pt-14">
          <h2 className="text-h2">Related briefings</h2>
          <ul className="mt-8 border-b border-border">
            {related.map((entry) => (
              <li
                key={entry.title}
                className="border-t border-border py-8 md:grid md:grid-cols-12 md:items-baseline md:gap-x-8"
              >
                <p
                  className={cn(
                    "text-muted-foreground tabular-nums md:col-span-3",
                    label
                  )}
                >
                  <time dateTime={entry.dateTime}>{entry.date}</time> ·{" "}
                  {entry.minutes} min read
                </p>
                <div className="mt-2 md:col-span-9 md:mt-0">
                  <h3 className="text-h2">
                    <a href="#" className={plainLink}>
                      {entry.title}
                    </a>
                  </h3>
                  <p className={cn("mt-2 text-muted-foreground", label)}>
                    {entry.author} · {entry.practice}
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
      <Footer />
    </div>
  )
}

export default App
