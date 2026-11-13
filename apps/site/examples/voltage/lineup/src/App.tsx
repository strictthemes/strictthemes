import { useEffect, useRef, useState } from "react"
import type { KeyboardEvent } from "react"
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

type DayId = "fri" | "sat"
type StageId = "crane" | "pump" | "office"
type StageFilter = "all" | StageId

type SetItem = {
  id: string
  day: DayId
  stage: StageId
  act: string
  slug: string
  start: string
  end: string
  kind?: "Talk" | "Workshop"
  title?: string
  isNew?: boolean
}

const DAYS: Record<
  DayId,
  { button: string; heading: string; name: string; date: string; next: string }
> = {
  fri: {
    button: "Fri 4 Dec",
    heading: "Friday 4 December",
    name: "Friday",
    date: "2026-12-04",
    next: "2026-12-05",
  },
  sat: {
    button: "Sat 5 Dec",
    heading: "Saturday 5 December",
    name: "Saturday",
    date: "2026-12-05",
    next: "2026-12-06",
  },
}

const STAGES: Record<StageId, string> = {
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

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function set(
  day: DayId,
  stage: StageId,
  act: string,
  start: string,
  end: string,
  extra: Partial<SetItem> = {}
): SetItem {
  const slug = slugify(act)
  return { id: `${day}-${slug}`, day, stage, act, slug, start, end, ...extra }
}

const SETS: SetItem[] = [
  set("fri", "crane", "Juno Halde", "17:30", "18:15"),
  set("fri", "crane", "Gravel & Gold", "19:00", "19:50"),
  set("fri", "crane", "The Night Ferries", "20:40", "21:40"),
  set("fri", "crane", "Ossa Bloom", "22:40", "23:50"),
  set("fri", "pump", "Neon Allotment", "18:00", "18:45", { isNew: true }),
  set("fri", "pump", "Pia Strand", "19:30", "20:20"),
  set("fri", "pump", "Sister Antenna", "21:00", "22:00"),
  set("fri", "pump", "Basement Choir", "23:00", "00:30"),
  set("fri", "office", "Teo Marsh", "17:00", "17:45", {
    kind: "Talk",
    title: "Posters that shout",
  }),
  set("fri", "office", "Fold Press", "18:30", "19:30", {
    kind: "Workshop",
    title: "Print your own poster",
  }),
  set("sat", "crane", "Odd Weather", "14:00", "14:45"),
  set("sat", "crane", "Lumen Varga", "16:00", "17:00"),
  set("sat", "crane", "Halvard Ek", "19:00", "20:00"),
  set("sat", "crane", "Kettle Drum Union", "21:30", "23:00"),
  set("sat", "pump", "Mira Sallis", "13:30", "14:15"),
  set("sat", "pump", "Low Tide Radio", "17:30", "18:30"),
  set("sat", "pump", "Cassette Saints", "20:00", "21:00"),
  set("sat", "pump", "Rook & Ivy", "23:30", "01:00"),
  set("sat", "office", "Studio Kantor", "13:00", "13:45", {
    kind: "Talk",
    title: "Type for loud places",
  }),
  set("sat", "office", "Ossa Bloom", "15:00", "15:45", {
    kind: "Talk",
    title: "Light shows from scrap",
  }),
]

const SET_IDS = new Set(SETS.map((s) => s.id))
const STORAGE_KEY = "tremor-days-saved-sets"

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (id): id is string => typeof id === "string" && SET_IDS.has(id)
    )
  } catch {
    return []
  }
}

function writeSaved(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage is not available: the list still works for this visit.
  }
}

function dateTimeFor(item: SetItem, time: string, isEnd: boolean) {
  const day = DAYS[item.day]
  const date = isEnd && time < item.start ? day.next : day.date
  return `${date}T${time}+01:00`
}

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const label = "font-mono text-label font-bold uppercase text-foreground"
const buttonText = "h-auto px-5 py-2 font-mono text-label font-bold uppercase"
const navLink = cn(
  label,
  "text-foreground hover:underline underline-offset-4",
  focusRing
)
const currentLink = "underline decoration-2 underline-offset-4"

const NAV = [
  { href: "/line-up", text: "Line-up", current: true },
  { href: "/tickets", text: "Tickets", current: false },
  { href: "/info", text: "Info", current: false },
]

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

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (open && event.key === "Escape") {
      setOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <header className="border-b border-border" onKeyDown={onKeyDown}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground hover:underline underline-offset-4",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(navLink, link.current && currentLink)}
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
          onClick={() => setOpen((value) => !value)}
          className={cn(buttonText, "ml-auto md:hidden")}
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
              className={cn(navLink, "block py-2", link.current && currentLink)}
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
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          A two-day music and design festival at Varsby Docks.
        </p>
        <p className={cn(label, "tabular-nums")}>
          Varsby Docks · <FestivalDates /> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}

export function App() {
  const [day, setDay] = useState<DayId>("fri")
  const [stage, setStage] = useState<StageFilter>("all")
  const [onlyMine, setOnlyMine] = useState(false)
  const [saved, setSaved] = useState<string[]>(readSaved)

  const saveButtons = useRef(new Map<string, HTMLButtonElement>())
  const showAllButton = useRef<HTMLButtonElement>(null)
  const stageTrigger = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef<string | null>(null)

  const daySets = SETS.filter((s) => s.day === day).sort((a, b) =>
    a.start.localeCompare(b.start)
  )
  const shown = daySets.filter(
    (s) =>
      (stage === "all" || s.stage === stage) &&
      (!onlyMine || saved.includes(s.id))
  )
  const savedCount = saved.filter((id) => SET_IDS.has(id)).length

  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === "show-all") showAllButton.current?.focus()
    else saveButtons.current.get(target)?.focus()
  }, [saved])

  function toggleSaved(item: SetItem) {
    const isSaved = saved.includes(item.id)
    const next = isSaved
      ? saved.filter((id) => id !== item.id)
      : [...saved, item.id]

    if (isSaved && onlyMine) {
      const index = shown.findIndex((s) => s.id === item.id)
      const neighbour = shown[index + 1] ?? shown[index - 1]
      pendingFocus.current = neighbour ? neighbour.id : "show-all"
    }

    setSaved(next)
    writeSaved(next)
  }

  function showAll() {
    setStage("all")
    setOnlyMine(false)
    stageTrigger.current?.focus()
  }

  const shownText =
    shown.length === daySets.length
      ? `${daySets.length} sets`
      : `${shown.length} of ${daySets.length} sets`

  const savedText =
    savedCount === 0
      ? "My list · no sets yet"
      : `My list · ${savedCount} ${savedCount === 1 ? "set" : "sets"}`

  return (
    <div className="min-h-screen bg-background font-sans text-body text-foreground">
      <SiteHeader />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-3 py-8 md:px-5 md:py-16">
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
              <div
                role="group"
                aria-labelledby="day-label"
                className="flex flex-wrap gap-2"
              >
                {(Object.keys(DAYS) as DayId[]).map((id) => {
                  const chosen = id === day
                  return (
                    <Button
                      key={id}
                      aria-pressed={chosen}
                      variant={chosen ? "secondary" : "outline"}
                      onClick={() => setDay(id)}
                      className={buttonText}
                    >
                      {chosen && <Check aria-hidden="true" className="size-4" />}
                      {DAYS[id].button}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-56">
              <label
                id="stage-label"
                htmlFor="stage-select"
                className={cn(label, "block")}
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
                  id="stage-select"
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
              <label htmlFor="only-my-list" className={label}>
                Only my list
              </label>
            </div>

            <p className={cn(label, "tabular-nums md:ml-auto md:pb-2")}>
              {savedText}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 pt-5 pb-3">
              <h2 className="text-h2">
                <time dateTime={DAYS[day].date}>{DAYS[day].heading}</time>
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
                {shown.map((item) => {
                  const isSaved = saved.includes(item.id)
                  return (
                    <li
                      key={item.id}
                      className="flex items-start gap-5 border-t border-border px-5 py-3 first:border-t-0 md:items-center"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
                        <p className="font-mono text-label font-bold tabular-nums md:w-32 md:shrink-0">
                          <time dateTime={dateTimeFor(item, item.start, false)}>
                            {item.start}
                          </time>
                          –
                          <time dateTime={dateTimeFor(item, item.end, true)}>
                            {item.end}
                          </time>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 md:min-w-0 md:flex-1">
                          <h3 className="min-w-0 text-h2">
                            <a
                              href={`/artists/${item.slug}`}
                              className={cn(
                                "text-foreground hover:underline underline-offset-4",
                                focusRing
                              )}
                            >
                              {item.act}
                            </a>
                          </h3>
                          {item.isNew && (
                            <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label font-bold uppercase text-tertiary-foreground">
                              New
                            </Badge>
                          )}
                          {item.kind && (
                            <p className="text-body">
                              {item.kind}: {item.title}
                            </p>
                          )}
                        </div>
                        <p className={cn(label, "md:w-40 md:shrink-0")}>
                          {STAGES[item.stage]}
                        </p>
                      </div>
                      <Button
                        ref={(node: HTMLButtonElement | null) => {
                          if (node) saveButtons.current.set(item.id, node)
                          else saveButtons.current.delete(item.id)
                        }}
                        aria-pressed={isSaved}
                        variant={isSaved ? "secondary" : "outline"}
                        onClick={() => toggleSaved(item)}
                        className={cn(buttonText, "shrink-0")}
                      >
                        {isSaved ? (
                          <Check aria-hidden="true" className="size-4" />
                        ) : (
                          <Plus aria-hidden="true" className="size-4" />
                        )}
                        Save
                        <span className="sr-only">
                          {" "}
                          {item.act}, {DAYS[item.day].name}
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
                  className={buttonText}
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
