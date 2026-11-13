import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Day = "fri" | "sat"
type Stage = "crane" | "pump" | "office"
type StageFilter = "all" | Stage

type LineupSet = {
  id: string
  day: Day
  stage: Stage
  act: string
  slug: string
  start: string
  end: string
  kind?: "Talk" | "Workshop"
  title?: string
  isNew?: boolean
}

const DAYS: Record<
  Day,
  { date: string; nextDate: string; short: string; long: string; name: string }
> = {
  fri: {
    date: "2026-12-04",
    nextDate: "2026-12-05",
    short: "Fri 4 Dec",
    long: "Friday 4 December",
    name: "Friday",
  },
  sat: {
    date: "2026-12-05",
    nextDate: "2026-12-06",
    short: "Sat 5 Dec",
    long: "Saturday 5 December",
    name: "Saturday",
  },
}

const STAGES: Record<Stage, string> = {
  crane: "Crane Stage",
  pump: "Pump House",
  office: "Drawing Office",
}

const STAGE_ITEMS: { value: StageFilter; label: string }[] = [
  { value: "all", label: "All stages" },
  { value: "crane", label: STAGES.crane },
  { value: "pump", label: STAGES.pump },
  { value: "office", label: STAGES.office },
]

const SETS: LineupSet[] = [
  // Friday
  { id: "fri-juno-halde", day: "fri", stage: "crane", act: "Juno Halde", slug: "juno-halde", start: "17:30", end: "18:15" },
  { id: "fri-gravel-and-gold", day: "fri", stage: "crane", act: "Gravel & Gold", slug: "gravel-and-gold", start: "19:00", end: "19:50" },
  { id: "fri-the-night-ferries", day: "fri", stage: "crane", act: "The Night Ferries", slug: "the-night-ferries", start: "20:40", end: "21:40" },
  { id: "fri-ossa-bloom", day: "fri", stage: "crane", act: "Ossa Bloom", slug: "ossa-bloom", start: "22:40", end: "23:50" },
  { id: "fri-neon-allotment", day: "fri", stage: "pump", act: "Neon Allotment", slug: "neon-allotment", start: "18:00", end: "18:45", isNew: true },
  { id: "fri-pia-strand", day: "fri", stage: "pump", act: "Pia Strand", slug: "pia-strand", start: "19:30", end: "20:20" },
  { id: "fri-sister-antenna", day: "fri", stage: "pump", act: "Sister Antenna", slug: "sister-antenna", start: "21:00", end: "22:00" },
  { id: "fri-basement-choir", day: "fri", stage: "pump", act: "Basement Choir", slug: "basement-choir", start: "23:00", end: "00:30" },
  { id: "fri-teo-marsh", day: "fri", stage: "office", act: "Teo Marsh", slug: "teo-marsh", start: "17:00", end: "17:45", kind: "Talk", title: "Posters that shout" },
  { id: "fri-fold-press", day: "fri", stage: "office", act: "Fold Press", slug: "fold-press", start: "18:30", end: "19:30", kind: "Workshop", title: "Print your own poster" },
  // Saturday
  { id: "sat-odd-weather", day: "sat", stage: "crane", act: "Odd Weather", slug: "odd-weather", start: "14:00", end: "14:45" },
  { id: "sat-lumen-varga", day: "sat", stage: "crane", act: "Lumen Varga", slug: "lumen-varga", start: "16:00", end: "17:00" },
  { id: "sat-halvard-ek", day: "sat", stage: "crane", act: "Halvard Ek", slug: "halvard-ek", start: "19:00", end: "20:00" },
  { id: "sat-kettle-drum-union", day: "sat", stage: "crane", act: "Kettle Drum Union", slug: "kettle-drum-union", start: "21:30", end: "23:00" },
  { id: "sat-mira-sallis", day: "sat", stage: "pump", act: "Mira Sallis", slug: "mira-sallis", start: "13:30", end: "14:15" },
  { id: "sat-low-tide-radio", day: "sat", stage: "pump", act: "Low Tide Radio", slug: "low-tide-radio", start: "17:30", end: "18:30" },
  { id: "sat-cassette-saints", day: "sat", stage: "pump", act: "Cassette Saints", slug: "cassette-saints", start: "20:00", end: "21:00" },
  { id: "sat-rook-and-ivy", day: "sat", stage: "pump", act: "Rook & Ivy", slug: "rook-and-ivy", start: "23:30", end: "01:00" },
  { id: "sat-studio-kantor", day: "sat", stage: "office", act: "Studio Kantor", slug: "studio-kantor", start: "13:00", end: "13:45", kind: "Talk", title: "Type for loud places" },
  { id: "sat-ossa-bloom", day: "sat", stage: "office", act: "Ossa Bloom", slug: "ossa-bloom", start: "15:00", end: "15:45", kind: "Talk", title: "Light shows from scrap" },
]

const STORAGE_KEY = "tremor-days-my-list"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label font-bold uppercase text-foreground"
const BUTTON = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const NAV_LINK = `${LABEL} hover:underline underline-offset-4 ${FOCUS}`
const CURRENT = "underline decoration-2 underline-offset-4"

const NAV = [
  { label: "Line-up", href: "/line-up", current: true },
  { label: "Tickets", href: "/tickets", current: false },
  { label: "Info", href: "/info", current: false },
]

function dateTime(day: Day, time: string, after?: string) {
  const d = DAYS[day]
  const date = after !== undefined && time < after ? d.nextDate : d.date
  return `${date}T${time}+01:00`
}

function plural(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? "" : "s"}`
}

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter(
          (v): v is string =>
            typeof v === "string" && SETS.some((s) => s.id === v)
        )
      : []
  } catch {
    return []
  }
}

function FestivalDates() {
  return (
    <>
      <time dateTime="2026-12-04">4</time>–
      <time dateTime="2026-12-05">5 Dec 2026</time>
    </>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground underline-offset-4 hover:underline ${FOCUS}`}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`${NAV_LINK} ${link.current ? CURRENT : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={`ml-auto hidden md:block ${LABEL}`}>
          <FestivalDates />
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className={`ml-auto md:hidden ${BUTTON}`}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-border md:hidden"
      >
        <div className="mx-auto max-w-[1200px] px-3 py-2 md:px-5">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={`block py-2 ${NAV_LINK} ${link.current ? CURRENT : ""}`}
            >
              {link.label}
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
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          A two-day music and design festival on three stages at Varsby Docks.
        </p>
        <p className={LABEL}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [day, setDay] = useState<Day>("fri")
  const [stage, setStage] = useState<StageFilter>("all")
  const [onlyMine, setOnlyMine] = useState(false)
  const [saved, setSaved] = useState<string[]>(readSaved)
  // Where focus goes after the next render, if anywhere.
  const pendingFocus = useRef<string | null>(null)

  const saveRefs = useRef(new Map<string, HTMLButtonElement>())
  const showAllRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // Storage is not available: the list still works for this visit.
    }
  }, [saved])

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === "show-all") showAllRef.current?.focus()
    else if (target === "stage") stageRef.current?.focus()
    else saveRefs.current.get(target)?.focus()
  })

  const daySets = useMemo(
    () =>
      SETS.filter((s) => s.day === day).sort((a, b) =>
        a.start.localeCompare(b.start)
      ),
    [day]
  )

  const shown = daySets.filter(
    (s) =>
      (stage === "all" || s.stage === stage) &&
      (!onlyMine || saved.includes(s.id))
  )

  const total = daySets.length
  const shownText =
    shown.length === total
      ? plural(total, "set")
      : `${shown.length} of ${plural(total, "set")}`

  const savedText =
    saved.length === 0 ? "no sets yet" : plural(saved.length, "set")

  function toggleSave(id: string) {
    const isSaved = saved.includes(id)
    if (isSaved && onlyMine) {
      const index = shown.findIndex((s) => s.id === id)
      const next = shown[index + 1] ?? shown[index - 1]
      pendingFocus.current = next ? next.id : "show-all"
    }
    setSaved((list) =>
      isSaved ? list.filter((v) => v !== id) : [...list, id]
    )
  }

  function showAll() {
    setStage("all")
    setOnlyMine(false)
    pendingFocus.current = "stage"
  }

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={LABEL}>
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
              <p id="day-label" className={LABEL}>
                Day
              </p>
              <div
                role="group"
                aria-labelledby="day-label"
                className="flex flex-wrap gap-2"
              >
                {(Object.keys(DAYS) as Day[]).map((d) => {
                  const chosen = d === day
                  return (
                    <Button
                      key={d}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      onClick={() => setDay(d)}
                      className={BUTTON}
                    >
                      {chosen && <Check aria-hidden="true" className="size-4" />}
                      {DAYS[d].short}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-56">
              <label htmlFor="stage-filter" className={`block ${LABEL}`}>
                Stage
              </label>
              <Select
                items={STAGE_ITEMS}
                value={stage}
                onValueChange={(value) => {
                  if (value !== null) setStage(value as StageFilter)
                }}
              >
                <SelectTrigger id="stage-filter" ref={stageRef}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="only-my-list"
                className="rounded-sm"
                checked={onlyMine}
                onCheckedChange={(checked) => setOnlyMine(checked)}
              />
              <label htmlFor="only-my-list" className={LABEL}>
                Only my list
              </label>
            </div>

            <p className={`tabular-nums md:ml-auto ${LABEL}`}>
              My list · {savedText}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 pt-5 pb-3">
              <h2 className="text-h2">
                <time dateTime={DAYS[day].date}>{DAYS[day].long}</time>
              </h2>
              <p
                aria-live="polite"
                className="font-mono text-label text-muted-foreground tabular-nums"
              >
                {shownText}
              </p>
            </div>

            {shown.length > 0 ? (
              <ul className="list-none p-0">
                {shown.map((set) => {
                  const isSaved = saved.includes(set.id)
                  return (
                    <li
                      key={set.id}
                      className="flex items-start gap-5 border-t border-border px-5 py-3 first:border-t-0 md:items-center"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
                        <p className="font-mono text-label font-bold tabular-nums md:w-32 md:shrink-0">
                          <time dateTime={dateTime(set.day, set.start)}>
                            {set.start}
                          </time>
                          –
                          <time dateTime={dateTime(set.day, set.end, set.start)}>
                            {set.end}
                          </time>
                        </p>
                        <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-1">
                          <h3 className="min-w-0 text-h2 wrap-break-word">
                            <a
                              href={`/artists/${set.slug}`}
                              className={`text-foreground underline-offset-4 hover:underline ${FOCUS}`}
                            >
                              {set.act}
                            </a>
                          </h3>
                          {set.isNew && (
                            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold text-tertiary-foreground uppercase">
                              New
                            </Badge>
                          )}
                          {set.kind && (
                            <p className="text-body">
                              {set.kind}: {set.title}
                            </p>
                          )}
                        </div>
                        <p className={`md:w-40 md:shrink-0 ${LABEL}`}>
                          {STAGES[set.stage]}
                        </p>
                      </div>
                      <Button
                        ref={(el: HTMLButtonElement | null) => {
                          if (el) saveRefs.current.set(set.id, el)
                          else saveRefs.current.delete(set.id)
                        }}
                        variant={isSaved ? "secondary" : "outline"}
                        aria-pressed={isSaved}
                        onClick={() => toggleSave(set.id)}
                        className={`shrink-0 ${BUTTON}`}
                      >
                        {isSaved ? (
                          <Check aria-hidden="true" className="size-4" />
                        ) : (
                          <Plus aria-hidden="true" className="size-4" />
                        )}
                        Save
                        <span className="sr-only">
                          {` ${set.act}, ${DAYS[set.day].name}`}
                        </span>
                      </Button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-3 px-5 py-3">
                <p className="text-body">No sets match these filters.</p>
                <Button
                  ref={showAllRef}
                  variant="outline"
                  onClick={showAll}
                  className={BUTTON}
                >
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
