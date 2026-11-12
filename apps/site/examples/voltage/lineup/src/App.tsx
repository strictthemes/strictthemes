import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Check, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Day = "fri" | "sat"
type Stage = "Crane Stage" | "Pump House" | "Drawing Office"

type SetItem = {
  id: string
  day: Day
  stage: Stage
  act: string
  slug: string
  start: string
  end: string
  kind?: string
  isNew?: boolean
}

const DAYS: Record<Day, { date: string; next: string; long: string; short: string; word: string }> = {
  fri: { date: "2026-12-04", next: "2026-12-05", long: "Friday 4 December", short: "Fri 4 Dec", word: "Friday" },
  sat: { date: "2026-12-05", next: "2026-12-06", long: "Saturday 5 December", short: "Sat 5 Dec", word: "Saturday" },
}

const STAGES: Stage[] = ["Crane Stage", "Pump House", "Drawing Office"]

const SETS: SetItem[] = [
  { id: "fri-juno-halde", day: "fri", stage: "Crane Stage", act: "Juno Halde", slug: "juno-halde", start: "17:30", end: "18:15" },
  { id: "fri-gravel-gold", day: "fri", stage: "Crane Stage", act: "Gravel & Gold", slug: "gravel-and-gold", start: "19:00", end: "19:50" },
  { id: "fri-night-ferries", day: "fri", stage: "Crane Stage", act: "The Night Ferries", slug: "the-night-ferries", start: "20:40", end: "21:40" },
  { id: "fri-ossa-bloom", day: "fri", stage: "Crane Stage", act: "Ossa Bloom", slug: "ossa-bloom", start: "22:40", end: "23:50" },
  { id: "fri-neon-allotment", day: "fri", stage: "Pump House", act: "Neon Allotment", slug: "neon-allotment", start: "18:00", end: "18:45", isNew: true },
  { id: "fri-pia-strand", day: "fri", stage: "Pump House", act: "Pia Strand", slug: "pia-strand", start: "19:30", end: "20:20" },
  { id: "fri-sister-antenna", day: "fri", stage: "Pump House", act: "Sister Antenna", slug: "sister-antenna", start: "21:00", end: "22:00" },
  { id: "fri-basement-choir", day: "fri", stage: "Pump House", act: "Basement Choir", slug: "basement-choir", start: "23:00", end: "00:30" },
  { id: "fri-teo-marsh", day: "fri", stage: "Drawing Office", act: "Teo Marsh", slug: "teo-marsh", start: "17:00", end: "17:45", kind: "Talk: Posters that shout" },
  { id: "fri-fold-press", day: "fri", stage: "Drawing Office", act: "Fold Press", slug: "fold-press", start: "18:30", end: "19:30", kind: "Workshop: Print your own poster" },
  { id: "sat-odd-weather", day: "sat", stage: "Crane Stage", act: "Odd Weather", slug: "odd-weather", start: "14:00", end: "14:45" },
  { id: "sat-lumen-varga", day: "sat", stage: "Crane Stage", act: "Lumen Varga", slug: "lumen-varga", start: "16:00", end: "17:00" },
  { id: "sat-halvard-ek", day: "sat", stage: "Crane Stage", act: "Halvard Ek", slug: "halvard-ek", start: "19:00", end: "20:00" },
  { id: "sat-kettle-drum-union", day: "sat", stage: "Crane Stage", act: "Kettle Drum Union", slug: "kettle-drum-union", start: "21:30", end: "23:00" },
  { id: "sat-mira-sallis", day: "sat", stage: "Pump House", act: "Mira Sallis", slug: "mira-sallis", start: "13:30", end: "14:15" },
  { id: "sat-low-tide-radio", day: "sat", stage: "Pump House", act: "Low Tide Radio", slug: "low-tide-radio", start: "17:30", end: "18:30" },
  { id: "sat-cassette-saints", day: "sat", stage: "Pump House", act: "Cassette Saints", slug: "cassette-saints", start: "20:00", end: "21:00" },
  { id: "sat-rook-ivy", day: "sat", stage: "Pump House", act: "Rook & Ivy", slug: "rook-and-ivy", start: "23:30", end: "01:00" },
  { id: "sat-studio-kantor", day: "sat", stage: "Drawing Office", act: "Studio Kantor", slug: "studio-kantor", start: "13:00", end: "13:45", kind: "Talk: Type for loud places" },
  { id: "sat-ossa-bloom", day: "sat", stage: "Drawing Office", act: "Ossa Bloom", slug: "ossa-bloom", start: "15:00", end: "15:45", kind: "Talk: Light shows from scrap" },
]

const STORAGE_KEY = "tremor-days-my-list"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const container = "mx-auto max-w-[1200px] px-3 md:px-5"
const navLink = cn(label, "text-foreground hover:underline underline-offset-4", focusRing)

function dateTimeFor(set: SetItem, time: string) {
  const day = DAYS[set.day]
  const date = time < set.start ? day.next : day.date
  return `${date}T${time}+01:00`
}

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []
  } catch {
    return []
  }
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–<time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function SiteHeader() {
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

  const links = [
    { href: "/line-up", text: "Line-up", current: true },
    { href: "/tickets", text: "Tickets", current: false },
    { href: "/info", text: "Info", current: false },
  ]

  return (
    <header className="border-b border-border">
      <div className={cn(container, "flex flex-wrap items-center gap-x-8 gap-y-3 py-3")}>
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground hover:underline underline-offset-4", focusRing)}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLink, link.current && "underline decoration-2 underline-offset-4")}
            >
              {link.text}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={cn(buttonText, "ml-auto md:hidden")}
        >
          Menu
        </Button>
      </div>
      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-border md:hidden">
        <div className={cn(container, "py-2")}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLink, "block py-2", link.current && "underline decoration-2 underline-offset-4")}
            >
              {link.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "flex flex-col gap-3 py-8")}>
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="max-w-xl text-body">
          Tremor Days is a two-day music and design festival on the old quays of Varsby Docks.
        </p>
        <p className={cn(label, "tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

type PendingFocus = { kind: "save"; id: string } | { kind: "showAll" } | null

export function App() {
  const [day, setDay] = useState<Day>("fri")
  const [stage, setStage] = useState<"all" | Stage>("all")
  const [onlyMine, setOnlyMine] = useState(false)
  const [saved, setSaved] = useState<string[]>(readSaved)

  const saveButtons = useRef(new Map<string, HTMLButtonElement>())
  const showAllButton = useRef<HTMLButtonElement>(null)
  const stageSelect = useRef<HTMLSelectElement>(null)
  const pendingFocus = useRef<PendingFocus>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // Storage is not available: the list still works for this visit.
    }
  }, [saved])

  const daySets = SETS.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start))
  const shown = daySets.filter(
    (s) => (stage === "all" || s.stage === stage) && (!onlyMine || saved.includes(s.id))
  )

  useLayoutEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = null
    if (target.kind === "save") saveButtons.current.get(target.id)?.focus()
    else showAllButton.current?.focus()
  })

  function toggleSave(id: string) {
    const isSaved = saved.includes(id)
    if (isSaved && onlyMine) {
      const index = shown.findIndex((s) => s.id === id)
      const rest = shown.filter((s) => s.id !== id)
      if (rest.length === 0) pendingFocus.current = { kind: "showAll" }
      else pendingFocus.current = { kind: "save", id: rest[Math.min(index, rest.length - 1)].id }
    }
    setSaved((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  function showAll() {
    setStage("all")
    setOnlyMine(false)
    stageSelect.current?.focus()
  }

  const savedCount = saved.filter((id) => SETS.some((s) => s.id === id)).length
  const savedText =
    savedCount === 0 ? "no sets yet" : savedCount === 1 ? "1 set" : `${savedCount} sets`
  const total = daySets.length
  const shownText = shown.length === total ? `${total} sets` : `${shown.length} of ${total} sets`

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className={cn(container, "flex flex-col gap-16 py-8 md:py-16")}>
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={cn(label, "tabular-nums")}>
              Tremor Days · <FestivalDates />
            </p>
            <h1 className="text-h1 md:text-display">Line-up</h1>
          </div>
          <p className="max-w-xl text-body">
            Save the sets you want to see. Your list stays in this browser.
          </p>
        </section>

        <section className="flex flex-col gap-8">
          <h2 className="sr-only">Filter the programme</h2>
          <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 md:flex-row md:flex-wrap md:items-end">
            <div className="flex flex-col gap-2">
              <p id="day-label" className={label}>
                Day
              </p>
              <div role="group" aria-labelledby="day-label" className="flex flex-wrap gap-2">
                {(Object.keys(DAYS) as Day[]).map((d) => {
                  const chosen = d === day
                  return (
                    <Button
                      key={d}
                      aria-pressed={chosen}
                      variant={chosen ? "secondary" : "outline"}
                      onClick={() => setDay(d)}
                      className={buttonText}
                    >
                      {chosen && <Check aria-hidden="true" className="size-4" />}
                      {DAYS[d].short}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-56">
              <label htmlFor="stage" className={cn(label, "block")}>
                Stage
              </label>
              <select
                ref={stageSelect}
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as "all" | Stage)}
                className={cn(
                  "h-auto w-full rounded-lg border border-input bg-card px-3 py-2 text-body text-foreground aria-invalid:border-destructive",
                  focusRing
                )}
              >
                <option value="all">All stages</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="only-my-list"
                className="rounded-sm"
                checked={onlyMine}
                onCheckedChange={(checked) => setOnlyMine(checked)}
              />
              <label htmlFor="only-my-list" className={label}>
                Only my list
              </label>
            </div>

            <p className={cn(label, "tabular-nums md:ml-auto")}>My list · {savedText}</p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 pt-5 pb-3">
              <h2 className="text-h2">
                <time dateTime={DAYS[day].date}>{DAYS[day].long}</time>
              </h2>
              <p aria-live="polite" className="font-mono text-label text-muted-foreground tabular-nums">
                {shownText}
              </p>
            </div>

            {shown.length > 0 ? (
              <ul className="list-none p-0">
                {shown.map((set, i) => {
                  const isSaved = saved.includes(set.id)
                  return (
                    <li
                      key={set.id}
                      className={cn(
                        "flex items-start gap-5 px-5 py-3 md:items-center",
                        i > 0 && "border-t border-border"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
                        <p className="font-mono text-label font-bold tabular-nums md:w-32 md:shrink-0">
                          <time dateTime={dateTimeFor(set, set.start)}>{set.start}</time>–
                          <time dateTime={dateTimeFor(set, set.end)}>{set.end}</time>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 md:min-w-0 md:flex-1">
                          <h3 className="min-w-0 text-h2">
                            <a
                              href={`/artists/${set.slug}`}
                              className={cn("text-foreground hover:underline underline-offset-4", focusRing)}
                            >
                              {set.act}
                            </a>
                          </h3>
                          {set.isNew && (
                            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold uppercase text-tertiary-foreground">
                              New
                            </Badge>
                          )}
                          {set.kind && <p className="text-body">{set.kind}</p>}
                        </div>
                        <p className={cn(label, "md:w-40 md:shrink-0")}>{set.stage}</p>
                      </div>
                      <Button
                        ref={(el) => {
                          if (el) saveButtons.current.set(set.id, el)
                          else saveButtons.current.delete(set.id)
                        }}
                        aria-pressed={isSaved}
                        variant={isSaved ? "secondary" : "outline"}
                        onClick={() => toggleSave(set.id)}
                        className={cn(buttonText, "shrink-0")}
                      >
                        {isSaved ? (
                          <Check aria-hidden="true" className="size-4" />
                        ) : (
                          <Plus aria-hidden="true" className="size-4" />
                        )}
                        Save
                        <span className="sr-only normal-case">
                          {" "}
                          {set.act}, {DAYS[set.day].word}
                        </span>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-3 px-5 py-3">
                <p className="text-body">No sets match these filters.</p>
                <Button ref={showAllButton} variant="outline" onClick={showAll} className={buttonText}>
                  Show all sets
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
