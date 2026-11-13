import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"

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

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-8"

const label = "font-mono text-label uppercase"

const navLink = cn(
  label,
  "text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
  focusRing
)

const textLink = cn(
  "text-primary underline underline-offset-4 transition-colors duration-150 hover:text-foreground",
  focusRing
)

const buttonClass = "rounded-sm px-4 font-mono text-label uppercase"

const navItems = ["Articles", "Topics", "About"]

const sections = [
  { id: "what-the-gradients-were-doing", title: "What the gradients were doing" },
  { id: "hierarchy-does-the-same-job", title: "Hierarchy does the same job" },
  { id: "how-we-took-them-out", title: "How we took them out" },
  { id: "what-we-measured-afterwards", title: "What we measured afterwards" },
]

const h2Class = "mt-16 scroll-mt-8 text-h2"

const cardCode = `/* Before */
.card {
  background: linear-gradient(var(--primary), var(--chart-3));
}

/* After */
.card {
  background: var(--card);
  border: 1px solid var(--border);
}`

const results = [
  { measure: "Gradient declarations", before: "212", after: "0" },
  { measure: "CSS shipped", before: "148 KB", after: "121 KB" },
  { measure: "Wrong-week bookings a month", before: "63", after: "19" },
  { measure: "Median time to book a slot", before: "41 s", after: "33 s" },
]

const readNext = [
  {
    topic: "Design",
    minutes: 6,
    title: "A type scale with only five sizes",
  },
  {
    topic: "Systems",
    minutes: 5,
    title: "Retiring forty button variants",
  },
  {
    topic: "Accessibility",
    minutes: 7,
    title: "The contrast checks we run before every release",
  },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const scrolledToEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (scrolledToEnd) {
        setActive(ids.length - 1)
        return
      }
      const line = window.innerHeight / 3
      let current = 0
      ids.forEach((id, index) => {
        const heading = document.getElementById(id)
        if (heading && heading.getBoundingClientRect().top <= line) {
          current = index
        }
      })
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

const sectionIds = sections.map((section) => section.id)

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b" onKeyDown={onKeyDown}>
      <div className={container}>
        <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
          <a
            href="#"
            className={cn(
              "font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
            )}
          >
            Quiet Interface
          </a>
          <div className="ml-auto flex items-center gap-4 md:gap-8">
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex gap-8">
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
              className={cn(buttonVariants({ variant: "outline" }), buttonClass)}
            >
              Subscribe
            </a>
            <Button
              ref={menuButton}
              variant="outline"
              className={cn(buttonClass, "md:hidden")}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </Button>
          </div>
        </div>
        {open && (
          <nav
            id="site-menu"
            aria-label="Main"
            className="border-t py-2 md:hidden"
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
        )}
      </div>
    </header>
  )
}

function TableOfContents({ active }: { active: number }) {
  return (
    <nav
      aria-labelledby="toc-heading"
      className="flex flex-col gap-4 lg:sticky lg:top-8 lg:col-span-3 lg:self-start"
    >
      <h2 id="toc-heading" className={cn(label, "text-foreground")}>
        On this page
      </h2>
      <ul className="flex flex-col gap-2">
        {sections.map((section, index) => {
          const current = index === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  label,
                  "block border-l-2 pl-4 transition-colors duration-150",
                  current
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
  )
}

function Sketch({
  caption,
  description,
  children,
}: {
  caption: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className={cn(label, "text-muted-foreground")}>{caption}</p>
      <div
        role="img"
        aria-label={description}
        className="flex h-32 flex-col gap-2 rounded-none border bg-background p-2"
      >
        {children}
      </div>
    </div>
  )
}

function BeforeAfterFigure() {
  return (
    <figure className="my-8">
      <div className="grid grid-cols-2 gap-4 rounded-md border bg-card p-8">
        <Sketch
          caption="Before"
          description="Sketch of the old dashboard: a dark band across the top, and every card filled with a solid block of color so all of them look equally important."
        >
          <div className="h-4 bg-foreground" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="bg-foreground" />
            <div className="bg-foreground" />
            <div className="bg-foreground" />
            <div className="bg-foreground" />
          </div>
        </Sketch>
        <Sketch
          caption="After"
          description="Sketch of the new dashboard: one bold heading bar, then plain cards on the background, separated only by thin lines."
        >
          <div className="h-2 w-2/3 bg-foreground" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 border-t pt-1">
              <div className="h-1 w-1/2 bg-foreground" />
            </div>
            <div className="flex flex-col gap-1 border-t pt-1">
              <div className="h-1 w-1/2 bg-foreground" />
            </div>
            <div className="flex flex-col gap-1 border-t pt-1">
              <div className="h-1 w-1/2 bg-foreground" />
            </div>
            <div className="flex flex-col gap-1 border-t pt-1">
              <div className="h-1 w-1/2 bg-foreground" />
            </div>
          </div>
        </Sketch>
      </div>
      <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
        The weekly dashboard before and after the change
      </figcaption>
    </figure>
  )
}

function ArticleBody() {
  return (
    <div className="max-w-lg min-w-0 space-y-4 lg:col-span-8">
      <p>
        For three years, almost every surface in Tallow had a gradient on it.
        The scheduling grid faded from blue to violet, the buttons glowed, and
        each card on the dashboard sat on its own soft wash of color. None of it
        was planned as a system. Each gradient arrived with a feature, and
        nobody ever took one away.
      </p>
      <p>
        Last spring we removed all of them in six weeks. This is an account of
        why we did it, how we decided what should replace each one, and what
        changed for the people who use the product every day.
      </p>

      <h2 id={sections[0].id} className={h2Class}>
        {sections[0].title}
      </h2>
      <p>
        We started with an audit. We took screenshots of the forty screens
        people visit most and marked every gradient we found. There were 212 of
        them. Then we asked a harder question about each one: what job does it
        do for the reader?
      </p>
      <p>
        Most of the answers were weak. A few gradients marked the selected item
        in a list. Some tried to make a card feel clickable. Many did nothing
        except fill space that would otherwise look empty. In the calendar view,
        a faint gradient behind the current week was the only cue that told
        people which week they were looking at, and it vanished on screens with
        low contrast.
      </p>
      <p>
        That last finding changed how we talked about the project. It stopped
        being a question of taste. When an important signal lives in a
        decoration, the signal is fragile, and anyone who sees color
        differently, or who works on a dim office monitor, loses it.
      </p>

      <h2 id={sections[1].id} className={h2Class}>
        {sections[1].title}
      </h2>
      <p>
        Every gradient we found was trying to say one of three things: look here
        first, these belong together, or you can press this. Type, spacing and
        lines can say all three more clearly.
      </p>
      <blockquote className="my-8 border-y py-8 font-heading text-h1">
        <p>
          A gradient tells people something is important without telling them
          why.
        </p>
      </blockquote>
      <p>
        Look here first is a job for size and weight. We gave each screen one
        heading that is clearly larger than everything else and let the body
        text stay calm. These belong together is a job for spacing: related
        items now sit 8 pixels apart and separate groups 32 pixels apart, so the
        eye groups them before it reads them. You can press this is a job for
        the button style and the link color, and we stopped spending that blue
        anywhere else.
      </p>
      <BeforeAfterFigure />
      <p>
        The figure shows the dashboard that started the discussion. On the
        left, every card competes for attention. On the right, the heading
        leads and thin lines do the separating.
      </p>

      <h2 id={sections[2].id} className={h2Class}>
        {sections[2].title}
      </h2>
      <p>
        We did not remove everything at once. A large visual change can hide
        real regressions, so we worked through the product in small passes that
        we could ship and check each week.
      </p>
      <ol className="my-8 list-decimal space-y-2 pl-4">
        <li>
          We replaced every gradient in the style sheets with a flat surface or
          background token, so no new screen could use one by accident.
        </li>
        <li>
          We rebuilt the shared card, button and list components first, because
          they appear on almost every screen.
        </li>
        <li>
          We went screen by screen and fixed each place where a gradient had
          been the only signal, usually by adding a border or a heading.
        </li>
        <li>
          We ran the same contrast checks in light and dark mode before each
          release and kept a list of everything that failed.
        </li>
      </ol>
      <p>
        The change to the card was the smallest one in the codebase and the
        largest one on screen. Here is its style before and after, written with
        our design tokens.
      </p>
      <pre
        tabIndex={0}
        role="region"
        aria-label="Card style before and after"
        className={cn(
          "my-8 overflow-x-auto rounded-md border bg-card p-4 font-mono text-body",
          focusRing
        )}
      >
        <code>{cardCode}</code>
      </pre>
      <p>
        The border did more than we expected. Without the gradient, cards
        stopped floating above the page, and a single line made their edges
        sharper than the old blend of colors ever did.
      </p>

      <h2 id={sections[3].id} className={h2Class}>
        {sections[3].title}
      </h2>
      <p>
        We compared the four weeks before the change with the four weeks after
        it. We looked at support tickets, task times in usability sessions, and
        the size of the style sheets we ship.
      </p>
      <div className="my-8 grid grid-cols-1 gap-2">
        <h3 className={cn(label, "text-foreground")}>
          Four weeks before and after
        </h3>
        <Table
          label="Four weeks before and after"
          className="min-w-lg text-body tabular-nums"
        >
          <TableHeader>
            <TableRow>
              <TableHead
                scope="col"
                className={cn(label, "text-muted-foreground first:pl-0 last:pr-0")}
              >
                Measure
              </TableHead>
              <TableHead
                scope="col"
                className={cn(label, "text-muted-foreground first:pl-0 last:pr-0")}
              >
                Before
              </TableHead>
              <TableHead
                scope="col"
                className={cn(label, "text-muted-foreground first:pl-0 last:pr-0")}
              >
                After
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.measure}>
                <TableCell className="first:pl-0 last:pr-0">
                  {row.measure}
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
        The drop in bookings made for the wrong week was the result we cared
        about most. Once the current week had a heading and a border instead of
        a faint tint, people stopped losing their place.
      </p>
      <p>
        Not everyone liked the result at first. Some longtime customers wrote
        to say the product felt plainer, and they were right. After a month,
        most of those messages had stopped, and the requests we get now are
        about features rather than about finding things on the screen.
      </p>
      <p>
        If you are planning a similar change, start with the audit and the
        question behind it. You may find, as we did, that most of your
        decoration was doing a job that type and spacing do better. Our full
        checklist is in the{" "}
        <a href="#" className={textLink}>
          design system notes
        </a>
        , and we have published the{" "}
        <a href="#" className={textLink}>
          contrast tests
        </a>{" "}
        we ran.
      </p>

      <footer className="mt-16 border-t pt-8">
        <ul className="flex flex-wrap gap-2">
          {["Design", "Design systems", "Accessibility", "Case study"].map(
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
          Maren Ostby leads product design at Tallow, where she works on the
          scheduling grid and the design system. She writes about the interface
          details people only notice when they are wrong.
        </p>
      </footer>
    </div>
  )
}

export function App() {
  const active = useActiveSection(sectionIds)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <article>
          <header className={cn(container, "pt-16")}>
            <div className="grid grid-cols-1 border-b border-foreground pb-8 md:grid-cols-12 md:gap-x-8">
              <p
                className={cn(
                  label,
                  "text-muted-foreground tabular-nums md:col-span-12"
                )}
              >
                Design · <time dateTime="2026-03-12">12 March 2026</time> · 4
                min read
              </p>
              <h1 className="mt-2 text-h1 md:col-span-10 md:text-display">
                Why we removed every gradient from our product
              </h1>
              <p className="mt-4 font-sans text-h2 font-normal md:col-span-8">
                Our product had 212 gradients. We replaced every one with type,
                spacing and thin lines, and people now find their way around it
                faster.
              </p>
              <p
                className={cn(
                  label,
                  "mt-4 text-muted-foreground md:col-span-12"
                )}
              >
                Maren Ostby · Lead product designer, Tallow
              </p>
            </div>
          </header>

          <div className={cn(container, "pt-8 pb-16")}>
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
              <TableOfContents active={active} />
              <ArticleBody />
            </div>
          </div>
        </article>

        <section aria-labelledby="read-next-heading" className="pb-16">
          <div className={container}>
            <div className="grid grid-cols-1 gap-y-2 border-t border-foreground pt-4 md:grid-cols-12 md:gap-x-8">
              <p
                className={cn(label, "text-muted-foreground md:col-span-3")}
              >
                01 / Read next
              </p>
              <h2 id="read-next-heading" className="text-h1 md:col-span-9">
                More on design systems
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8">
              {readNext.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-2 border-t pt-4 md:col-span-4"
                >
                  <p
                    className={cn(
                      label,
                      "text-muted-foreground tabular-nums"
                    )}
                  >
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

      <footer className="border-t py-8">
        <div className={container}>
          <div className="flex flex-col gap-4">
            <p className="font-heading text-h2">Quiet Interface</p>
            <p>
              Essays on product design, written by the people who ship it.
            </p>
          </div>
          <p className={cn(label, "mt-8 text-muted-foreground")}>
            © 2026 Quiet Interface
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
