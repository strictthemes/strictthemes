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

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label uppercase"
const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"
const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)
const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)
const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"
const grid = "grid grid-cols-1 md:grid-cols-12 md:gap-x-8"

const siteLinks = ["Articles", "Topics", "About"]

const sections = [
  { id: "decoration", title: "Decoration was doing the work of hierarchy" },
  { id: "replacement", title: "What we replaced it with" },
  { id: "code", title: "Removing it from the code" },
  { id: "differently", title: "What we would do differently" },
]

const auditRows = [
  { item: "Gradients", before: "11", after: "0" },
  { item: "Shadow styles", before: "7", after: "0" },
  { item: "Accent colors", before: "4", after: "1" },
  { item: "Text sizes", before: "14", after: "5" },
]

const topics = [
  "Design systems",
  "Visual design",
  "Accessibility",
  "Case study",
]

const readNext = [
  {
    topic: "Systems",
    minutes: 6,
    title: "How we named our color tokens",
  },
  {
    topic: "Type",
    minutes: 5,
    title: "Five text sizes are enough for a whole product",
  },
  {
    topic: "Process",
    minutes: 4,
    title: "Running a design audit with a printer and a red pen",
  },
]

const codeSample = `/* Before */
.invoice-header {
  background: linear-gradient(135deg, var(--primary), var(--chart-5));
}

/* After */
.invoice-header {
  background: var(--card);
  border-bottom: 1px solid var(--border);
}`

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight / 3
      let current = ids[0]
      for (const id of ids) {
        const heading = document.getElementById(id)
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = id
        }
      }
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1
      if (atEnd) {
        current = ids[ids.length - 1]
      }
      setActive(current)
    }

    const onChange = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onChange, { passive: true })
    window.addEventListener("resize", onChange)
    return () => {
      window.removeEventListener("scroll", onChange)
      window.removeEventListener("resize", onChange)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

const sectionIds = sections.map((section) => section.id)

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className={container}>
          <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
            <a
              href="#"
              className={cn(
                "mr-auto font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
                focusRing
              )}
            >
              Plain Grid
            </a>
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex gap-8">
                {siteLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className={navLink}>
                      {link}
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
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
          </div>
          <nav
            id="site-menu"
            aria-label="Main"
            hidden={!menuOpen}
            className="border-t border-border py-2 md:hidden"
          >
            <ul>
              {siteLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={cn(navLink, "block py-2")}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <article>
          <div className={container}>
            <header
              className={cn(grid, "border-b border-foreground pt-16 pb-8")}
            >
              <p className={cn(label, "text-muted-foreground md:col-span-12")}>
                Design · <time dateTime="2026-10-21">21 October 2026</time> · 4
                min read
              </p>
              <h1 className="mt-2 text-h1 md:col-span-10 md:text-display">
                Why we removed every gradient from our product
              </h1>
              <p className="mt-4 font-sans text-h2 font-normal md:col-span-8">
                Our invoicing app had eleven gradients and no clear order of
                importance. Taking them out made us build that order from type,
                space and a single accent color.
              </p>
              <p
                className={cn(
                  label,
                  "mt-4 text-muted-foreground md:col-span-12"
                )}
              >
                By Ines Varga · Product designer, Tallyroom
              </p>
            </header>
          </div>

          <div className={cn(container, "pt-8 pb-16")}>
            <div className="grid grid-cols-1 gap-y-8 md:gap-x-8 lg:grid-cols-12">
              <nav
                aria-labelledby="toc-heading"
                className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:col-span-3 lg:self-start"
              >
                <h2 id="toc-heading" className={cn(label, "text-foreground")}>
                  On this page
                </h2>
                <ul className="flex flex-col gap-2">
                  {sections.map((section) => {
                    const isActive = section.id === active
                    return (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            label,
                            "block border-l-2 pl-4 transition-colors duration-150",
                            isActive
                              ? "border-foreground text-foreground"
                              : "border-transparent text-muted-foreground hover:text-foreground",
                            focusRing
                          )}
                        >
                          {section.title}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="max-w-lg min-w-0 space-y-4 lg:col-span-8 lg:col-start-4">
                <p>
                  Eighteen months ago, the Tallyroom dashboard had eleven
                  gradients on it. The sidebar faded from navy to violet. Every
                  primary button had a soft sheen. The revenue card glowed along
                  its top edge, and the empty states sat on a wash of pale pink
                  and blue. None of them was a mistake on its own. Each one was
                  added by someone trying to make a screen feel finished.
                </p>
                <p>
                  Together they made the product hard to read. When every
                  surface has an effect, nothing stands out, and our customers
                  told us so in plain words: they could not find the button that
                  sends an invoice. This is how we took every gradient out, what
                  we put in its place, and what we would do differently.
                </p>

                <h2 id={sections[0].id} className="mt-16 scroll-mt-8 text-h2">
                  {sections[0].title}
                </h2>
                <p>
                  We started with an audit. Three of us printed every screen in
                  the app, forty-two in all, and circled each gradient, shadow
                  and tinted panel with a red pen. Then we asked one question of
                  each circle: what is this telling the user? Most answers were
                  a version of “this is important.” The sidebar gradient said
                  the sidebar mattered. The sheen said the button mattered. The
                  glow said the revenue figure mattered.
                </p>
                <p>
                  When three things on one screen each claim to matter most, the
                  claim means nothing. The gradients had become a way to avoid
                  deciding. Instead of choosing the one action a screen was for,
                  we had given every candidate a little extra shine.
                </p>
                <blockquote className="my-8 border-y border-border py-8">
                  <p className="font-heading text-h1">
                    A gradient is a decision you have not made yet.
                  </p>
                </blockquote>
                <p>
                  That sentence became the brief. If we could say what each
                  screen was for, the type and the layout could carry it, and
                  the decoration could go.
                </p>

                <h2 id={sections[1].id} className="mt-16 scroll-mt-8 text-h2">
                  {sections[1].title}
                </h2>
                <p>
                  We kept the rules short enough to fit on one page. Each one
                  took over a job that a gradient had been doing badly.
                </p>
                <ol className="my-8 list-decimal space-y-2 pl-4">
                  <li>
                    Size and weight set the order. Each screen gets one heading
                    in a large, heavy weight, and every other heading steps down
                    from it.
                  </li>
                  <li>
                    One accent color, used only for the main action and for
                    links. If a screen has two blue buttons, one of them is
                    wrong.
                  </li>
                  <li>
                    Surfaces are flat. A panel is set apart from the page by a
                    light grey fill or a thin border, never by a shadow or a
                    glow.
                  </li>
                  <li>
                    Space groups things. Related items sit close together, and
                    unrelated ones get a full step of the spacing scale between
                    them.
                  </li>
                </ol>
                <p>
                  The figure below shows the invoice screen before and after.
                  The layout barely moved. What changed is that the eye now has
                  one place to land.
                </p>
                <figure className="my-8">
                  <div className="grid grid-cols-2 gap-8 rounded-md border border-border bg-card p-8">
                    <div className="flex flex-col gap-2">
                      <p className={cn(label, "text-muted-foreground")}>
                        Before
                      </p>
                      <div
                        role="img"
                        aria-label="Sketch of the old invoice screen: a filled header, a filled sidebar and three filled panels of equal weight."
                        className="flex h-40 flex-col gap-2 rounded-none border border-border bg-background p-2"
                      >
                        <div className="h-4 bg-foreground" />
                        <div className="flex flex-1 gap-2">
                          <div className="w-1/3 bg-foreground" />
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="h-8 bg-foreground" />
                            <div className="h-8 bg-foreground" />
                            <div className="mt-auto h-4 w-1/2 bg-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className={cn(label, "text-muted-foreground")}>
                        After
                      </p>
                      <div
                        role="img"
                        aria-label="Sketch of the new invoice screen: one heavy heading, thin lines of text, a bordered panel and one filled button."
                        className="flex h-40 flex-col gap-2 rounded-none border border-border bg-background p-2"
                      >
                        <div className="h-4 border-b border-border" />
                        <div className="h-2 w-2/3 bg-foreground" />
                        <div className="h-px w-full bg-foreground" />
                        <div className="h-px w-5/6 bg-foreground" />
                        <div className="flex-1 border border-border" />
                        <div className="h-4 w-1/3 bg-foreground" />
                      </div>
                    </div>
                  </div>
                  <figcaption
                    className={cn(label, "mt-2 text-muted-foreground")}
                  >
                    Fig. 1 · The invoice screen, before and after
                  </figcaption>
                </figure>

                <h2 id={sections[2].id} className="mt-16 scroll-mt-8 text-h2">
                  {sections[2].title}
                </h2>
                <p>
                  The design change took a week. The code change took a month,
                  because gradients had spread into places we did not expect:
                  chart legends, loading skeletons, even the email templates. We
                  searched the codebase for every gradient and replaced each one
                  with a{" "}
                  <a href="#" className={textLink}>
                    named color token
                  </a>
                  , so that no component could hold a color of its own.
                </p>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-label="Code example: the invoice header before and after"
                  className={cn(
                    "my-8 overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-body",
                    focusRing
                  )}
                >
                  <code>{codeSample}</code>
                </pre>
                <p>
                  Moving every color to a token had a second benefit we did not
                  plan for. Dark mode, which had sat on the roadmap for two
                  years, came almost for free: we defined the tokens a second
                  time, and most screens worked on the first try.
                </p>
                <div className="my-8 grid grid-cols-1 gap-2">
                  <h3 className={cn(label, "text-foreground")}>
                    Audit, before and after
                  </h3>
                  <Table
                    label="Audit, before and after"
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
                          Item
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
                      {auditRows.map((row) => (
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
                <p>
                  We measured the result with the same task test we had run
                  before the change. Five customers created and sent an invoice
                  while we watched. Before, the median time was 48 seconds;
                  after, it was 31. Two of the five said the app felt calmer,
                  which we had not asked about. In the month after release,
                  support questions about the send button fell from nineteen to
                  four.
                </p>

                <h2 id={sections[3].id} className="mt-16 scroll-mt-8 text-h2">
                  {sections[3].title}
                </h2>
                <p>
                  We would start with the tokens. We spent the first two weeks
                  arguing about single screens, which was the wrong level. Once
                  the colors, sizes and spacing steps were fixed, most screen
                  decisions made themselves, and the arguments that were left
                  were about content, which is where they belonged.
                </p>
                <p>
                  We would also put one person in charge of saying no.
                  Decoration comes back quietly. Six months after the change, a
                  new settings page shipped with a soft glow behind its
                  headline, and nobody noticed for a week. Now every change to a
                  color token needs a review from the design systems group, and
                  our{" "}
                  <a href="#" className={textLink}>
                    design principles
                  </a>{" "}
                  explain why in two short paragraphs.
                </p>
                <p>
                  None of this means gradients are wrong. A photograph is full
                  of them. But in an interface they are rarely the cheapest way
                  to say what matters, and they make it easy to stop asking.
                  Taking them out made us ask on every screen, and the product
                  is clearer for it.
                </p>

                <footer className="mt-16 border-t border-border pt-8">
                  <ul aria-label="Topics" className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <li key={topic}>
                        <Badge
                          variant="outline"
                          className="h-auto rounded-none px-2 py-1 font-mono text-label uppercase"
                        >
                          {topic}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    Ines Varga is a product designer at Tallyroom, where she
                    leads the design system. Before that, she designed reporting
                    tools for small accounting firms.
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </article>

        <section aria-labelledby="read-next-heading" className="pb-16">
          <div className={container}>
            <div
              className={cn(grid, "gap-y-2 border-t border-foreground pt-4")}
            >
              <p className={cn(label, "text-muted-foreground md:col-span-3")}>
                01 / Read next
              </p>
              <h2 id="read-next-heading" className="text-h1 md:col-span-9">
                More on design systems
              </h2>
            </div>
            <ul className={cn(grid, "mt-8 gap-y-8")}>
              {readNext.map((item) => (
                <li
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
                        focusRing
                      )}
                    >
                      {item.title}
                    </a>
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className={container}>
          <div className="flex flex-col gap-4">
            <p className="font-heading text-h2">Plain Grid</p>
            <p className="max-w-lg">
              Essays on product design, written by the people who ship it.
            </p>
          </div>
          <p className={cn(label, "mt-8 text-muted-foreground")}>
            © 2026 Plain Grid
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
