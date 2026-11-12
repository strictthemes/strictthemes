import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focus
)
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focus
)
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"

const navItems = ["Articles", "Topics", "About"]

const sections = [
  { id: "where-they-came-from", title: "Where the gradients came from" },
  { id: "what-hierarchy-does", title: "What hierarchy does instead" },
  { id: "how-we-took-them-out", title: "How we took them out" },
  { id: "what-changed", title: "What changed after launch" },
]

const readNext = [
  {
    topic: "Design systems",
    minutes: 6,
    title: "One grey is enough: cutting our palette from 14 shades to 4",
  },
  {
    topic: "Typography",
    minutes: 5,
    title: "A type scale with five sizes, and the screens that broke it",
  },
  {
    topic: "Process",
    minutes: 1,
    title: "The review question we now ask about every new color",
  },
]

const changes = [
  { item: "Gradients", before: "14 gradients", after: "0 gradients" },
  { item: "Shadow styles", before: "9 styles", after: "0 styles" },
  { item: "Greys in use", before: "11 greys", after: "3 greys" },
  { item: "Surface CSS", before: "38 KB", after: "6 KB" },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      let current = ids[0]
      if (atEnd) {
        current = ids[ids.length - 1]
      } else {
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top <= line) current = id
        }
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

const sectionIds = sections.map((s) => s.id)

function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border">
      <div className={container}>
        <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
          <a
            href="#"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focus
            )}
          >
            The Margin
          </a>
          <div className="ml-auto flex items-center gap-4 md:gap-8">
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navItems.map((item) => (
                  <li key={item}>
                    <a href="#" className={navLink}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClass
              )}
            >
              Subscribe
            </a>
            <Button
              variant="outline"
              className={cn(buttonClass, "md:hidden")}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((o) => !o)}
            >
              Menu
            </Button>
          </div>
        </div>
        <nav
          id="mobile-nav"
          aria-label="Main"
          hidden={!open}
          className="border-t border-border py-2 md:hidden"
        >
          <ul>
            {navItems.map((item) => (
              <li key={item}>
                <a href="#" className={cn(navLink, "block py-2")}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function TableOfContents({ active }: { active: string }) {
  return (
    <nav
      aria-labelledby="toc-heading"
      className="flex flex-col gap-4 lg:sticky lg:top-8 lg:col-span-3 lg:self-start"
    >
      <h2 id="toc-heading" className={cn(label, "text-foreground")}>
        On this page
      </h2>
      <ul className="flex flex-col gap-2">
        {sections.map((s) => {
          const isActive = s.id === active
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  label,
                  "block border-l-2 pl-4 transition-colors duration-150",
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  focus
                )}
              >
                {s.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SectionHeading({ index }: { index: number }) {
  const s = sections[index]
  return (
    <h2 id={s.id} className="mt-16 scroll-mt-8 text-h2">
      {s.title}
    </h2>
  )
}

function Sketch({ variant }: { variant: "before" | "after" }) {
  if (variant === "before") {
    return (
      <div
        role="img"
        aria-label="A settings screen where every block has its own fill, border and heavy bar, so nothing stands out"
        className="flex flex-col gap-2 rounded-none border border-border bg-background p-4"
      >
        <div className="h-4 w-full bg-foreground" />
        <div className="flex flex-col gap-1 border border-foreground p-2">
          <div className="h-2 w-3/4 bg-foreground" />
          <div className="h-2 w-1/2 bg-foreground" />
        </div>
        <div className="flex flex-col gap-1 border border-foreground p-2">
          <div className="h-2 w-2/3 bg-foreground" />
          <div className="h-2 w-1/2 bg-foreground" />
        </div>
        <div className="h-4 w-1/2 bg-foreground" />
      </div>
    )
  }
  return (
    <div
      role="img"
      aria-label="The same screen with one heavy title bar, thin text lines, a single divider and one outlined button"
      className="flex flex-col gap-2 rounded-none border border-border bg-background p-4"
    >
      <div className="h-4 w-2/3 bg-foreground" />
      <div className="h-1 w-full border-t border-border" />
      <div className="flex flex-col gap-1">
        <div className="h-1 w-full bg-foreground" />
        <div className="h-1 w-5/6 bg-foreground" />
        <div className="h-1 w-3/4 bg-foreground" />
      </div>
      <div className="mt-2 h-4 w-1/3 border border-foreground" />
    </div>
  )
}

const codeSample = `.panel {
-  background: linear-gradient(180deg, var(--card), var(--muted));
-  box-shadow: 0 8px 24px var(--foreground);
+  background: var(--card);
+  border: 1px solid var(--border);
}`

export function App() {
  const active = useActiveSection(sectionIds)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <article>
          <header className={container}>
            <div className="grid grid-cols-1 border-b border-foreground pt-16 pb-8 md:grid-cols-12 md:gap-x-8">
              <p className={cn(label, "text-muted-foreground md:col-span-12")}>
                Design · <time dateTime="2026-03-12">12 March 2026</time> · 4
                min read
              </p>
              <h1 className="mt-2 text-h1 md:col-span-10 md:text-display">
                Why we removed every gradient from our product
              </h1>
              <p className="mt-4 font-sans text-h2 font-normal md:col-span-8">
                Our dashboard had fourteen gradients and nine shadow styles. We
                deleted all of them and let size, weight and space do the work.
              </p>
              <p
                className={cn(
                  label,
                  "mt-4 text-muted-foreground md:col-span-12"
                )}
              >
                Ines Varga, Lead Product Designer at Corvel
              </p>
            </div>
          </header>

          <div
            className={cn(
              container,
              "grid grid-cols-1 gap-y-8 pt-8 pb-16 md:gap-x-8 lg:grid-cols-12"
            )}
          >
            <TableOfContents active={active} />

            <div className="lg:col-span-8 lg:col-start-4">
              <div className="max-w-lg space-y-4">
                <p>
                  Last spring we shipped a redesign of Corvel, the invoicing
                  tool our customers open every morning. The release notes
                  talked about a new navigation and faster search. They did not
                  mention the change that took the most work: we removed every
                  gradient, every drop shadow and every tinted panel from the
                  product.
                </p>
                <p>
                  This is an account of why we did it, how we did it without
                  breaking three years of screens, and what we learned about
                  hierarchy along the way.
                </p>

                <SectionHeading index={0} />
                <p>
                  Nobody decided to add fourteen gradients. Each one arrived
                  with a good reason. The billing card needed to feel special,
                  so it got a soft fade. The onboarding banner needed to stand
                  out from the billing card, so it got a stronger fade. A year
                  later the empty states borrowed the banner style, and the
                  modal headers borrowed the empty states.
                </p>
                <p>
                  Every addition was a small fix for the same problem: two
                  things on a screen looked equally important. A gradient made
                  one of them louder. Then the next screen needed something
                  louder still. When we{" "}
                  <a href="#" className={textLink}>
                    audited the product
                  </a>{" "}
                  in January, we counted fourteen gradients, nine shadow styles
                  and eleven shades of grey, and no one could say which was
                  meant for what.
                </p>

                <SectionHeading index={1} />
                <p>
                  Decoration tells the reader that something matters. Hierarchy
                  tells them how much, and in what order. We had been using the
                  first to do the job of the second.
                </p>
                <blockquote className="my-8 border-y border-border py-8">
                  <p className="font-heading text-h1">
                    A gradient makes a thing louder, but it never tells you what
                    to read first.
                  </p>
                </blockquote>
                <p>
                  So we wrote down the few tools we would allow ourselves. Five
                  type sizes. Two weights for headings. One accent color, kept
                  for the main action and for links. A spacing scale of five
                  steps. A single 1px line for separating things that sit close
                  together. If a screen could not be made clear with those, the
                  screen had too much on it.
                </p>
                <figure className="my-8">
                  <div className="grid grid-cols-2 gap-8 rounded-md border border-border bg-card p-8">
                    <div className="flex flex-col gap-2">
                      <p className={cn(label, "text-muted-foreground")}>
                        Before
                      </p>
                      <Sketch variant="before" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className={cn(label, "text-muted-foreground")}>
                        After
                      </p>
                      <Sketch variant="after" />
                    </div>
                  </div>
                  <figcaption
                    className={cn(label, "mt-2 text-muted-foreground")}
                  >
                    The settings screen, before and after the cleanup
                  </figcaption>
                </figure>
                <p>
                  The settings screen was our test case. Before, every group of
                  options sat in its own shaded box with its own shadow. After,
                  the groups are separated by space and a heading, and the only
                  filled element is the save button. People in our usability
                  sessions found the option they were looking for faster, and
                  several of them said the screen felt calmer.
                </p>

                <SectionHeading index={2} />
                <p>
                  We could not stop the product for a quarter, so we did the
                  work in four steps, each one small enough to ship on its own:
                </p>
                <ol className="my-8 list-decimal space-y-2 pl-4">
                  <li>
                    Replace every hard-coded color in the stylesheets with a
                    token, so each surface has a name we can change in one
                    place.
                  </li>
                  <li>
                    Point all fourteen gradients at the same flat token, then
                    watch support tickets for two weeks.
                  </li>
                  <li>
                    Swap each shadow for a 1px border in the border color, and
                    fix the few places where the edge disappeared.
                  </li>
                  <li>
                    Delete the old gradient and shadow tokens, so nobody can
                    bring them back by accident.
                  </li>
                </ol>
                <p>
                  Most of the changes were as small as the one below. The
                  pattern repeated across every panel in the product:
                </p>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Code: the panel style before and after"
                  className={cn(
                    "my-8 overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-body",
                    focus
                  )}
                >
                  <code>{codeSample}</code>
                </pre>
                <p>
                  The numbers below come from our design token audit, run once
                  before the first step and once after the last.
                </p>
                <div className="my-8 grid grid-cols-1 gap-2">
                  <h3 className={cn(label, "text-foreground")}>
                    Surface styles before and after
                  </h3>
                  <Table
                    label="Surface styles before and after"
                    className="min-w-lg text-body"
                  >
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          scope="col"
                          className={cn(
                            label,
                            "text-muted-foreground first:pl-0 last:pr-0"
                          )}
                        >
                          Style
                        </TableHead>
                        <TableHead
                          scope="col"
                          className={cn(
                            label,
                            "text-muted-foreground first:pl-0 last:pr-0"
                          )}
                        >
                          Before
                        </TableHead>
                        <TableHead
                          scope="col"
                          className={cn(
                            label,
                            "text-muted-foreground first:pl-0 last:pr-0"
                          )}
                        >
                          After
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changes.map((row) => (
                        <TableRow key={row.item}>
                          <TableCell className="first:pl-0 last:pr-0">
                            {row.item}
                          </TableCell>
                          <TableCell className="first:pl-0 last:pr-0">
                            {row.before}
                          </TableCell>
                          <TableCell className="first:pl-0 last:pr-0">
                            {row.after}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <SectionHeading index={3} />
                <p>
                  The first thing we noticed was speed. Our surface styles went
                  from 38 KB to 6 KB, and the dashboard painted noticeably
                  sooner on older laptops. The second was that design reviews
                  got shorter. When there is no gradient to tune, the
                  conversation moves to what belongs on the screen.
                </p>
                <p>
                  The third was harder to measure. New designers on the team
                  stopped asking which shadow to use, because there was no
                  shadow to choose. Engineers stopped copying styles from the
                  nearest screen, because the nearest screen now used the same
                  tokens as every other one. A rule with no exceptions turned
                  out to be easier to follow than a rule with fourteen of them,
                  and the product looks like one product again.
                </p>
                <p>
                  Not everything went well. Two customers told us the product
                  looked unfinished, and we lost the visual difference between
                  draft and sent invoices. We fixed that with a label and a
                  heavier heading weight rather than a color. If you want to try
                  the same audit, our{" "}
                  <a href="#" className={textLink}>
                    token checklist
                  </a>{" "}
                  is a good place to start.
                </p>

                <footer className="mt-16 border-t border-border pt-8">
                  <ul className="flex flex-wrap gap-2">
                    {["Design systems", "Visual design", "Redesign"].map(
                      (topic) => (
                        <li key={topic}>
                          <Badge
                            variant="outline"
                            className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"
                          >
                            {topic}
                          </Badge>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="mt-4">
                    Ines Varga leads product design at Corvel, where she has
                    spent four years making invoices easier to read. She writes
                    here about design systems and the work of taking things out.
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </article>

        <section aria-labelledby="read-next-heading" className={container}>
          <div className="pb-16">
            <div className="grid grid-cols-1 gap-y-2 border-t border-foreground pt-4 md:grid-cols-12 md:gap-x-8">
              <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                01 / Read next
              </p>
              <h2 id="read-next-heading" className="text-h1 md:col-span-9">
                More on design systems
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8">
              {readNext.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 border-t border-border pt-4 md:col-span-4"
                >
                  <p className={cn(label, "text-muted-foreground")}>
                    {item.topic} · {item.minutes} min read
                  </p>
                  <h3 className="text-h2">
                    <a
                      href="#"
                      className={cn(
                        "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                        focus
                      )}
                    >
                      {item.title}
                    </a>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className={cn(container, "py-8")}>
          <p className="font-heading text-h2">The Margin</p>
          <p className="mt-4 max-w-lg">
            Essays on product design, written by the people who ship it.
          </p>
          <p className={cn(label, "mt-8 text-muted-foreground")}>
            © 2026 The Margin
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
