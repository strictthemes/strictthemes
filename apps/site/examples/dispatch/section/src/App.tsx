import { useEffect, useRef, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MOST_READ, STORIES, type Story } from "@/stories"

const SECTIONS = [
  "News",
  "Politics",
  "City",
  "Sport",
  "Results",
  "Business",
  "Culture",
  "Opinion",
]
const CURRENT = "Politics"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LINK_BASE = cn("transition-colors duration-150", FOCUS)
const HEADLINE_LINK = cn(
  "text-foreground decoration-2 underline-offset-4 hover:underline",
  LINK_BASE
)
const LABEL_LINK = cn(
  "text-foreground underline-offset-4 hover:underline",
  LINK_BASE
)
const LABEL = "font-mono text-label uppercase"
const BUTTON = "h-auto px-4 py-2 font-mono text-label uppercase"

const INITIAL = 8
const STEP = 6

function Masthead({ className }: { className?: string }) {
  return (
    <a
      href="/"
      className={cn("font-heading text-h2 uppercase", HEADLINE_LINK, className)}
    >
      The Port Avery Ledger
    </a>
  )
}

function SectionLinks({ block = false }: { block?: boolean }) {
  return SECTIONS.map((name) => {
    const current = name === CURRENT
    return (
      <li key={name}>
        <a
          href="#"
          aria-current={current ? "page" : undefined}
          className={cn(
            LABEL,
            current
              ? cn(
                  "text-foreground underline decoration-2 underline-offset-4",
                  LINK_BASE
                )
              : LABEL_LINK,
            block && "block py-2"
          )}
        >
          {name}
        </a>
      </li>
    )
  })
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header>
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <span className={cn(LABEL, "text-muted-foreground")}>
            <time dateTime="2026-11-11" className="font-mono tabular-nums">
              Wednesday 11 November 2026
            </time>
          </span>
          <a
            href="#"
            className={cn(buttonVariants({ variant: "default" }), BUTTON)}
          >
            Subscribe
          </a>
        </div>
        <div className="flex items-center justify-between gap-4 border-t-2 py-4">
          <Masthead />
          <Button
            ref={menuButton}
            variant="outline"
            className={cn(BUTTON, "md:hidden")}
            aria-expanded={open}
            aria-controls="mobile-sections"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </Button>
        </div>
        <nav aria-label="Sections" className="hidden border-y py-2 md:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <SectionLinks />
          </ul>
        </nav>
        <nav
          id="mobile-sections"
          aria-label="Sections"
          hidden={!open}
          className="border-b py-2 md:hidden"
        >
          <ul className="flex flex-col">
            <SectionLinks block />
          </ul>
        </nav>
      </div>
    </header>
  )
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t-2 pt-2">
      <h2 className="font-mono text-label text-foreground uppercase">
        {title}
      </h2>
    </div>
  )
}

function Picture({
  label,
  caption,
  aspect,
}: {
  label: string
  caption: string
  aspect: string
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={label}
        className={cn("w-full bg-muted", aspect)}
      />
      <figcaption className={cn(LABEL, "text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  )
}

function LeadStory() {
  return (
    <article className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
      <div className="flex flex-col gap-4 lg:col-span-7 lg:pr-6">
        <p className={cn(LABEL, "text-foreground")}>Council</p>
        <h2 className="text-h1 uppercase md:text-display">
          <a href="#" className={HEADLINE_LINK}>
            Majority gone
          </a>
        </h2>
        <p className="max-w-3xl font-sans text-h2 font-normal">
          Two councillors walked out of the bridge loan vote, and the ruling
          group no longer has the numbers to pass it.
        </p>
        <p className={cn(LABEL, "text-muted-foreground")}>
          By Malik Osei ·{" "}
          <time dateTime="2026-11-11T07:50" className="font-mono tabular-nums">
            07:50
          </time>
        </p>
      </div>
      <div className="lg:col-span-5">
        <Picture
          aspect="aspect-3/2"
          label="The council chamber from the public gallery, with two empty seats on the ruling group's front bench"
          caption="Two empty seats in the chamber on Wednesday · Photograph: Teodor Brand"
        />
      </div>
    </article>
  )
}

function StoryRow({
  story,
  isNew,
  linkRef,
}: {
  story: Story
  isNew: boolean
  linkRef: (el: HTMLAnchorElement | null) => void
}) {
  return (
    <article className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-0">
      <div className="md:col-span-2 md:pr-4">
        <p
          className={cn(
            LABEL,
            "flex flex-wrap items-baseline gap-2 text-muted-foreground"
          )}
        >
          <time dateTime={story.dateTime} className="font-mono tabular-nums">
            {story.time}
          </time>
          {isNew && <span className="text-primary">New</span>}
        </p>
      </div>
      <div className="flex flex-col gap-2 md:col-span-10">
        {story.picture && (
          <Picture
            aspect="aspect-video"
            label={story.picture.label}
            caption={story.picture.caption}
          />
        )}
        <p className={cn(LABEL, "text-foreground")}>{story.kicker}</p>
        <h3 className="text-h2 uppercase">
          <a href="#" ref={linkRef} className={HEADLINE_LINK}>
            {story.headline}
          </a>
        </h3>
        <p className="max-w-xl">{story.summary}</p>
        <p className={cn(LABEL, "text-muted-foreground")}>{story.byline}</p>
      </div>
    </article>
  )
}

function Latest() {
  const [shown, setShown] = useState(INITIAL)
  const [status, setStatus] = useState("")
  const focusIndex = useRef<number | null>(null)
  const links = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    if (focusIndex.current === null) return
    links.current[focusIndex.current]?.focus()
    focusIndex.current = null
  }, [shown])

  const total = STORIES.length
  const done = shown >= total

  function loadMore() {
    const next = Math.min(shown + STEP, total)
    const added = next - shown
    const noun = added === 1 ? "story" : "stories"
    setStatus(
      next >= total
        ? `The last ${added} ${noun} shown.`
        : `${added} more ${noun} shown.`
    )
    focusIndex.current = shown
    setShown(next)
  }

  return (
    <section className="flex flex-col gap-4 lg:col-span-8 lg:pr-6">
      <SectionHead title="Latest" />
      <ul className="flex flex-col gap-4">
        {STORIES.slice(0, shown).map((story, index) => (
          <li key={story.id} className={cn(index > 0 && "border-t pt-4")}>
            <StoryRow
              story={story}
              isNew={index === 0}
              linkRef={(el) => {
                links.current[index] = el
              }}
            />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-4 border-t pt-4">
        {done ? (
          <p>That is every Politics story from the last four days.</p>
        ) : (
          <Button variant="secondary" className={BUTTON} onClick={loadMore}>
            Load more
          </Button>
        )}
        <p className={cn(LABEL, "text-muted-foreground")}>
          Showing <span className="tabular-nums">{shown}</span> of{" "}
          <span className="tabular-nums">{total}</span>
        </p>
        <p role="status" className="sr-only">
          {status}
        </p>
      </div>
    </section>
  )
}

function MostRead() {
  return (
    <section className="flex flex-col gap-4 lg:col-span-4 lg:border-l lg:pl-6">
      <SectionHead title="Most read" />
      <ol role="list" className="flex flex-col gap-4">
        {MOST_READ.map((headline, index) => (
          <li
            key={headline}
            className={cn(
              "flex items-baseline gap-4",
              index > 0 && "border-t pt-4"
            )}
          >
            <span className="w-8 shrink-0 font-mono text-h2 text-foreground tabular-nums">
              {index + 1}
            </span>
            <h3 className="font-heading text-body font-bold uppercase">
              <a href="#" className={HEADLINE_LINK}>
                {headline}
              </a>
            </h3>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 border-t-2 px-4 py-6 md:px-6">
        <Masthead className="self-start" />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECTIONS.map((name) => (
              <li key={name}>
                <a href="#" className={cn(LABEL, LABEL_LINK)}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={cn(LABEL, "text-muted-foreground")}>
          © <span className="tabular-nums">2026</span> The Port Avery Ledger ·
          Port Avery
        </p>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />
      <main>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pt-6 pb-12 md:px-6">
          <div className="flex flex-col gap-2 border-t-2 pt-2">
            <h1 className="text-h2 uppercase md:text-h1">Politics</h1>
            <p className="max-w-xl">
              The council, the city's wards and the people who run them: votes,
              budgets, by-elections and the rows in between.
            </p>
          </div>
          <LeadStory />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-0">
            <Latest />
            <MostRead />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
