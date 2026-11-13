import { useEffect, useRef, useState } from "react"
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
import { cn } from "@/lib/utils"

type Day = "fri" | "sat"
type Stage = "Crane Stage" | "Pump House" | "Drawing Office"
type StageFilter = "all" | Stage

type Slot = {
  id: string
  day: Day
  stage: Stage
  act: string
  start: string
  end: string
  kind?: "Talk" | "Workshop"
  title?: string
  isNew?: boolean
}

const DAYS: Record<
  Day,
  { date: string; next: string; long: string; short: string; name: string }
> = {
  fri: {
    date: "2026-12-04",
    next: "2026-12-05",
    long: "Friday 4 December",
    short: "Fri 4 Dec",
    name: "Friday",
  },
  sat: {
    date: "2026-12-05",
    next: "2026-12-06",
    long: "Saturday 5 December",
    short: "Sat 5 Dec",
    name: "Saturday",
  },
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function slot(
  day: Day,
  stage: Stage,
  act: string,
  start: string,
  end: string,
  extra: Partial<Slot> = {}
): Slot {
  return { id: `${day}-${slugify(act)}`, day, stage, act, start, end, ...extra }
}

const SETS: Slot[] = [
  slot("fri", "Crane Stage", "Juno Halde", "17:30", "18:15"),
  slot("fri", "Crane Stage", "Gravel & Gold", "19:00", "19:50"),
  slot("fri", "Crane Stage", "The Night Ferries", "20:40", "21:40"),
  slot("fri", "Crane Stage", "Ossa Bloom", "22:40", "23:50"),
  slot("fri", "Pump House", "Neon Allotment", "18:00", "18:45", {
    isNew: true,
  }),
  slot("fri", "Pump House", "Pia Strand", "19:30", "20:20"),
  slot("fri", "Pump House", "Sister Antenna", "21:00", "22:00"),
  slot("fri", "Pump House", "Basement Choir", "23:00", "00:30"),
  slot("fri", "Drawing Office", "Teo Marsh", "17:00", "17:45", {
    kind: "Talk",
    title: "Posters that shout",
  }),
  slot("fri", "Drawing Office", "Fold Press", "18:30", "19:30", {
    kind: "Workshop",
    title: "Print your own poster",
  }),
  slot("sat", "Crane Stage", "Odd Weather", "14:00", "14:45"),
  slot("sat", "Crane Stage", "Lumen Varga", "16:00", "17:00"),
  slot("sat", "Crane Stage", "Halvard Ek", "19:00", "20:00"),
  slot("sat", "Crane Stage", "Kettle Drum Union", "21:30", "23:00"),
  slot("sat", "Pump House", "Mira Sallis", "13:30", "14:15"),
  slot("sat", "Pump House", "Low Tide Radio", "17:30", "18:30"),
  slot("sat", "Pump House", "Cassette Saints", "20:00", "21:00"),
  slot("sat", "Pump House", "Rook & Ivy", "23:30", "01:00"),
  slot("sat", "Drawing Office", "Studio Kantor", "13:00", "13:45", {
    kind: "Talk",
    title: "Type for loud places",
  }),
  slot("sat", "Drawing Office", "Ossa Bloom", "15:00", "15:45", {
    kind: "Talk",
    title: "Light shows from scrap",
  }),
]

const STAGE_ITEMS: { value: StageFilter; label: string }[] = [
  { value: "all", label: "All stages" },
  { value: "Crane Stage", label: "Crane Stage" },
  { value: "Pump House", label: "Pump House" },
  { value: "Drawing Office", label: "Drawing Office" },
]

const STORAGE_KEY = "tremor-days-my-list"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const LABEL = "font-mono text-label font-bold uppercase text-foreground"
const BUTTON = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const NAV_LINK = cn(LABEL, "underline-offset-4 hover:underline", FOCUS)
const CURRENT = "underline decoration-2 underline-offset-4"

function dateTimeFor(s: Slot, time: string, isEnd: boolean) {
  const day = DAYS[s.day]
  const afterMidnight = isEnd && time < s.start
  return `${afterMidnight ? day.next : day.date}T${time}+01:00`
}

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
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
  const menuButton = useRef<HTMLButtonElement>(null)

  const links = [
    { href: "/line-up", label: "Line-up", current: true },
    { href: "/tickets", label: "Tickets", current: false },
    { href: "/info", label: "Info", current: false },
  ]

  return (
    <header
      className="border-b border-border"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            FOCUS
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(NAV_LINK, link.current && CURRENT)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={cn(LABEL, "ml-auto hidden tabular-nums md:block")}>
          <FestivalDates />
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className={cn(BUTTON, "ml-auto md:hidden")}
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
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(NAV_LINK, "block py-2", link.current && CURRENT)}
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
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(LABEL, "tabular-nums")}>
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

  const saveButtons = useRef(new Map<string, HTMLButtonElement>())
  const showAllButton = useRef<HTMLButtonElement>(null)
  const stageTrigger = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef<string | null>(null)

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
    if (target === "show-all") showAllButton.current?.focus()
    else saveButtons.current.get(target)?.focus()
  })

  const daySets = SETS.filter((s) => s.day === day).sort((a, b) =>
    a.start.localeCompare(b.start)
  )
  const shown = daySets.filter(
    (s) =>
      (stage === "all" || s.stage === stage) &&
      (!onlyMine || saved.includes(s.id))
  )

  const savedCount = saved.filter((id) => SETS.some((s) => s.id === id)).length
  const savedText =
    savedCount === 0
      ? "My list · no sets yet"
      : `My list · ${savedCount} ${savedCount === 1 ? "set" : "sets"}`
  const total = daySets.length
  const noun = total === 1 ? "set" : "sets"
  const shownText =
    shown.length === total
      ? `${total} ${noun}`
      : `${shown.length} of ${total} ${noun}`

  function toggleSave(s: Slot) {
    const isSaved = saved.includes(s.id)
    if (isSaved && onlyMine) {
      const index = shown.findIndex((item) => item.id === s.id)
      const next = shown[index + 1] ?? shown[index - 1]
      pendingFocus.current = next ? next.id : "show-all"
    }
    setSaved((current) =>
      isSaved ? current.filter((id) => id !== s.id) : [...current, s.id]
    )
  }

  function showAll() {
    setStage("all")
    setOnlyMine(false)
    stageTrigger.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className={cn(LABEL, "tabular-nums")}>
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
                {(Object.keys(DAYS) as Day[]).map((key) => {
                  const chosen = key === day
                  return (
                    <Button
                      key={key}
                      variant={chosen ? "secondary" : "outline"}
                      aria-pressed={chosen}
                      onClick={() => setDay(key)}
                      className={BUTTON}
                    >
                      {chosen && (
                        <Check aria-hidden="true" className="size-4" />
                      )}
                      {DAYS[key].short}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-56">
              <label
                id="stage-label"
                htmlFor="stage-trigger"
                className={cn(LABEL, "block")}
              >
                Stage
              </label>
              <Select
                items={STAGE_ITEMS}
                value={stage}
                onValueChange={(value) => {
                  if (value !== null) setStage(value as StageFilter)
                }}
              >
                <SelectTrigger
                  id="stage-trigger"
                  ref={stageTrigger}
                  aria-labelledby="stage-label"
                >
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

            <div className="flex items-center gap-2 md:pb-2">
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

            <p className={cn(LABEL, "tabular-nums md:ml-auto md:pb-2")}>
              {savedText}
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
              <ul>
                {shown.map((s) => {
                  const isSaved = saved.includes(s.id)
                  return (
                    <li
                      key={s.id}
                      className="flex items-start gap-5 border-t border-border px-5 py-3 first:border-t-0 md:items-center"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
                        <p className="font-mono text-label font-bold tabular-nums md:w-32 md:shrink-0">
                          <time dateTime={dateTimeFor(s, s.start, false)}>
                            {s.start}
                          </time>
                          –
                          <time dateTime={dateTimeFor(s, s.end, true)}>
                            {s.end}
                          </time>
                        </p>
                        <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-1">
                          <h3 className="min-w-0 text-h2 wrap-break-word">
                            <a
                              href={`/artists/${slugify(s.act)}`}
                              className={cn(
                                "text-foreground underline-offset-4 hover:underline",
                                FOCUS
                              )}
                            >
                              {s.act}
                            </a>
                          </h3>
                          {s.isNew && (
                            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold text-tertiary-foreground uppercase">
                              New
                            </Badge>
                          )}
                          {s.kind && (
                            <p className="text-body">
                              {s.kind}: {s.title}
                            </p>
                          )}
                        </div>
                        <p className={cn(LABEL, "md:w-40 md:shrink-0")}>
                          {s.stage}
                        </p>
                      </div>
                      <Button
                        ref={(node: HTMLButtonElement | null) => {
                          if (node) saveButtons.current.set(s.id, node)
                          else saveButtons.current.delete(s.id)
                        }}
                        variant={isSaved ? "secondary" : "outline"}
                        aria-pressed={isSaved}
                        onClick={() => toggleSave(s)}
                        className={cn(BUTTON, "shrink-0")}
                      >
                        {isSaved ? (
                          <Check aria-hidden="true" className="size-4" />
                        ) : (
                          <Plus aria-hidden="true" className="size-4" />
                        )}
                        Save
                        <span className="sr-only">
                          {" "}
                          {s.act}, {DAYS[s.day].name}
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
                  ref={showAllButton}
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
