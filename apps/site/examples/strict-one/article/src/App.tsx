import * as React from "react"

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
  {
    id: "what-the-gradients-were-doing",
    title: "What the gradients were doing",
  },
  {
    id: "letting-hierarchy-do-the-work",
    title: "Letting hierarchy do the work",
  },
  { id: "how-we-took-them-out", title: "How we took them out" },
  { id: "what-changed-after", title: "What changed after" },
]

const results = [
  { measure: "Gradients in the product", before: "41", after: "0" },
  { measure: "Color tokens in the theme", before: "64", after: "23" },
  { measure: "Screens failing contrast", before: "9", after: "0" },
  { measure: "Time to read the balance", before: "2.4 s", after: "1.6 s" },
  { measure: "CSS for surfaces", before: "38 kB", after: "21 kB" },
]

const codeSample = `.panel-header {
-  background-image: linear-gradient(
-    to right,
-    var(--primary),
-    var(--tertiary)
-  );
-  color: var(--primary-foreground);
+  background-color: var(--card);
+  border-bottom: 1px solid var(--border);
+  color: var(--foreground);
}`

const readNext = [
  {
    topic: "Design systems",
    minutes: 6,
    title: "A type scale with five sizes, and why we stopped there",
  },
  {
    topic: "Accessibility",
    minutes: 5,
    title: "Checking contrast in dark mode before it ships",
  },
  {
    topic: "Design systems",
    minutes: 4,
    title: "Naming tokens for the job they do, not the color they are",
  },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0])

  React.useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const headings = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
      if (headings.length === 0) return

      const line = window.innerHeight / 3
      let current = headings[0].id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) {
          current = heading.id
        }
      }

      const scrolledToEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (scrolledToEnd) {
        current = headings[headings.length - 1].id
      }

      setActive(current)
    }

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header className="border-b border-border" onKeyDown={handleKeyDown}>
      <div className={container}>
        <div className="flex flex-wrap items-center gap-4 py-4 md:gap-8">
          <a
            href="#"
            className={cn(
              "font-heading text-h2 text-foreground underline-offset-4 transition-colors duration-150 hover:underline",
              focusRing
            )}
          >
            Tallyhouse Journal
          </a>
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
          <div className="ml-auto flex items-center gap-4">
            <Button
              ref={menuButtonRef}
              variant="outline"
              className={cn(buttonClass, "md:hidden")}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </Button>
            <a
              href="#"
              className={cn(
                buttonVariants({ variant: "outline" }),
                buttonClass
              )}
            >
              Subscribe
            </a>
          </div>
        </div>
        <nav
          id="site-menu"
          aria-label="Main"
          hidden={!menuOpen}
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
  )
}

function SectionHeading({ index }: { index: number }) {
  const section = sections[index]
  return (
    <h2 id={section.id} className="mt-16 scroll-mt-8 text-h2">
      {section.title}
    </h2>
  )
}

function Sketch({
  caption,
  description,
  children,
}: {
  caption: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className={cn(label, "text-muted-foreground")}>{caption}</p>
      <div
        role="img"
        aria-label={description}
        className="flex h-40 flex-col gap-2 rounded-sm border border-border bg-background p-2"
      >
        {children}
      </div>
    </div>
  )
}

function OverviewFigure() {
  return (
    <figure className="my-8">
      <div className="grid grid-cols-2 gap-8 rounded-md border border-border bg-card p-8">
        <Sketch
          caption="Before"
          description="Sketch of the old account overview: a tall solid band across the top with the balance inside it, and three heavy filled blocks below."
        >
          <div className="flex h-16 shrink-0 flex-col justify-end rounded-sm bg-foreground p-2">
            <div className="h-2 w-1/2 bg-background" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2">
            <div className="rounded-sm bg-foreground" />
            <div className="rounded-sm bg-foreground" />
            <div className="rounded-sm bg-foreground" />
          </div>
        </Sketch>
        <Sketch
          caption="After"
          description="Sketch of the new account overview: a large heavy balance on the plain background, one thin line under it, and a list of rows separated by thin lines."
        >
          <div className="mt-2 h-1 w-1/3 bg-foreground" />
          <div className="h-4 w-3/4 bg-foreground" />
          <div className="mt-2 border-t border-foreground" />
          <div className="flex flex-col">
            <div className="h-4 border-b border-border" />
            <div className="h-4 border-b border-border" />
            <div className="h-4 border-b border-border" />
          </div>
        </Sketch>
      </div>
      <figcaption className={cn(label, "mt-2 text-muted-foreground")}>
        Account overview, before and after the change
      </figcaption>
    </figure>
  )
}

function ArticlePage() {
  const ids = React.useMemo(() => sections.map((section) => section.id), [])
  const active = useActiveSection(ids)

  return (
    <article>
      <header className={container}>
        <div className="grid grid-cols-1 border-b border-foreground pt-16 pb-8 md:grid-cols-12 md:gap-x-8">
          <p className={cn(label, "text-muted-foreground md:col-span-12")}>
            Design · <time dateTime="2026-03-12">12 March 2026</time> · 4 min
            read
          </p>
          <h1 className="mt-2 text-h1 md:col-span-10 md:text-display">
            Why we removed every gradient from our product
          </h1>
          <p className="mt-4 font-sans text-h2 font-normal md:col-span-8">
            We took 41 gradients out of Tallyhouse in six weeks. The product got
            easier to read, and nobody asked for them back.
          </p>
          <p className={cn(label, "mt-4 text-muted-foreground md:col-span-12")}>
            By Ines Varga, product designer
          </p>
        </div>
      </header>

      <div className={container}>
        <div className="grid grid-cols-1 gap-y-8 pt-8 pb-16 lg:grid-cols-12 lg:gap-x-8">
          <TableOfContents active={active} />

          <div className="max-w-lg space-y-4 lg:col-span-8 lg:col-start-4">
            <p>
              For three years, almost every surface in Tallyhouse had a gradient
              on it. The sidebar faded from blue to violet, the main button
              glowed from orange to red, and every empty state sat on a soft
              wash of two colors. Last spring we removed all of them, 41 in
              total, in six weeks. This is why we did it and what we learned
              along the way.
            </p>
            <p>
              Gradients were not the problem on their own. The problem was that
              we used them to say something was important, and once everything
              said that, nothing did.
            </p>

            <SectionHeading index={0} />
            <p>
              When we audited the product, we sorted every gradient by the job
              it was meant to do. Most fell into three groups: marking the main
              action, separating one region from another, and making an empty
              screen feel less empty. A few had no job at all. They arrived in a
              redesign and nobody remembered why.
            </p>
            <p>
              Each of those jobs is real, but a gradient does all three badly.
              It draws the eye without telling you where to look next. It
              separates regions with a soft edge that disappears on a cheap
              monitor or in bright sunlight. And it fills empty space with
              something to look at instead of something to do.
            </p>
            <p>
              We also found a cost we had not counted. Every gradient needed two
              colors that worked together in light mode and again in dark mode,
              and each pair had to keep its text readable from end to end. Our
              designers spent hours checking the lightest point of a fade
              against white labels. Nine of the 41 failed contrast somewhere
              along their length.
            </p>

            <SectionHeading index={1} />
            <p>
              Our rule for the replacement was simple. If a gradient marked
              importance, the replacement had to come from size, weight or
              position. If it separated regions, a 1px border or a change of
              surface would do it. If it decorated an empty screen, the screen
              needed a sentence and a button instead.
            </p>
            <blockquote className="my-8 border-y border-border py-8 font-heading text-h1">
              <p>
                If everything glows, the one thing that matters has nowhere left
                to stand.
              </p>
            </blockquote>
            <p>
              The account overview is the clearest example. Before, its header
              was a tall band of color with the balance set in white on top.
              After, the band is gone. The balance is set larger and heavier
              than anything else on the page, the header sits on the plain
              background, and a single line separates it from the transactions
              below.
            </p>
            <OverviewFigure />
            <p>
              Nobody in our usability sessions noticed the band was missing.
              What they did notice was that they found the balance faster. In
              timed tasks, the median time to read the current balance dropped
              from 2.4 seconds to 1.6.
            </p>

            <SectionHeading index={2} />
            <p>
              We did not want a big redesign, so we treated the removal as a
              series of small changes that could ship behind a flag and be
              rolled back. The process came down to four steps.
            </p>
            <ol className="my-8 list-decimal space-y-2 pl-4">
              <li>
                List every gradient in the codebase and the design files, with a
                screenshot and the job it was doing.
              </li>
              <li>
                Write the replacement for each job once, as a token or a
                component, before touching any screen.
              </li>
              <li>
                Swap screens one at a time, starting with the ones people use
                most, and review each in light and dark mode.
              </li>
              <li>
                Delete the old color pairs from the theme, so that nobody can
                add a gradient back by accident.
              </li>
            </ol>
            <p>
              Most of the swaps were a few lines of CSS. The snippet below is a
              typical one from the panel header, with the fade replaced by the
              card surface and a border.
            </p>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Code: the panel header before and after"
              className={cn(
                "my-8 overflow-x-auto rounded-md border border-border bg-card p-4 font-mono text-body",
                focusRing
              )}
            >
              <code>{codeSample}</code>
            </pre>
            <p>
              The last step mattered more than we expected. While the old color
              pairs stayed in the theme, people kept reaching for them. Once
              they were gone, the question of whether to use a gradient stopped
              coming up in reviews. Our{" "}
              <a href="#" className={textLink}>
                notes on the theme file
              </a>{" "}
              explain how the tokens are named now.
            </p>

            <SectionHeading index={3} />
            <p>
              Six weeks after the last gradient went, we compared the product
              against the numbers we had collected before we started. The table
              below shows the ones we tracked.
            </p>
            <div className="my-8 grid gap-2">
              <h3 className={cn(label, "text-foreground")}>
                Results after six weeks
              </h3>
              <Table
                label="Results after six weeks"
                className="min-w-lg text-body"
              >
                <TableHeader>
                  <TableRow>
                    {["Measure", "Before", "After"].map((heading) => (
                      <TableHead
                        key={heading}
                        scope="col"
                        className={cn(
                          label,
                          "text-muted-foreground first:pl-0 last:pr-0"
                        )}
                      >
                        {heading}
                      </TableHead>
                    ))}
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
              The product is also easier to change now. A new screen needs a
              layout, type sizes from the scale and maybe one border. There is
              no longer a step where someone picks two colors and hopes they
              hold up in dark mode.
            </p>
            <p>
              If you are thinking about doing the same, start with the audit.
              Write down what each gradient is for. You will probably find that
              the job is worth keeping and the gradient is not. We have
              published our{" "}
              <a href="#" className={textLink}>
                audit template
              </a>{" "}
              if you want a head start.
            </p>

            <footer className="mt-16 border-t border-border pt-8">
              <ul aria-label="Topics" className="flex flex-wrap gap-2">
                {["Design", "Design systems", "Accessibility"].map((topic) => (
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
                Ines Varga is a product designer at Tallyhouse, where she leads
                the design system team. She writes about interfaces that get out
                of the way.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </article>
  )
}

function ReadNext() {
  return (
    <section aria-labelledby="read-next-heading" className="pb-16">
      <div className={container}>
        <div className="grid grid-cols-1 gap-y-2 border-t border-foreground pt-4 md:grid-cols-12 md:gap-x-8">
          <p className={cn(label, "text-muted-foreground md:col-span-3")}>
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
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "py-8")}>
        <div className="flex flex-col gap-4">
          <p className="font-heading text-h2">Tallyhouse Journal</p>
          <p>
            Notes from the people who design and build Tallyhouse, bookkeeping
            for small businesses.
          </p>
        </div>
        <p className={cn(label, "mt-8 text-muted-foreground")}>
          © 2026 Tallyhouse Journal
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <SiteHeader />
      <main>
        <ArticlePage />
        <ReadNext />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
