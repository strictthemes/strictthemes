import { useRef, useState, type KeyboardEvent } from "react"
import { Download } from "lucide-react"

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

type DocType = "Data sheet" | "CAD file" | "Certificate"
type Filter = "all" | DocType

type Doc = {
  title: string
  type: DocType
  format: "PDF" | "STEP" | "DXF"
  revision: string
  date: string
  dateTime: string
  sizeMb: string
}

// Newest first.
const DOCUMENTS: Doc[] = [
  {
    title: "TVL-2552-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev A",
    date: "21 Oct 2026",
    dateTime: "2026-10-21",
    sizeMb: "0.91",
  },
  {
    title: "TVL-2552-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev A",
    date: "21 Oct 2026",
    dateTime: "2026-10-21",
    sizeMb: "1.75",
  },
  {
    title: "TVL range catalogue",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev D",
    date: "2 Oct 2026",
    dateTime: "2026-10-02",
    sizeMb: "2.40",
  },
  {
    title: "TVL range 2D outlines",
    type: "CAD file",
    format: "DXF",
    revision: "Rev D",
    date: "2 Oct 2026",
    dateTime: "2026-10-02",
    sizeMb: "0.36",
  },
  {
    title: "Material declaration, REACH and RoHS",
    type: "Certificate",
    format: "PDF",
    revision: "Rev B",
    date: "28 Sep 2026",
    dateTime: "2026-09-28",
    sizeMb: "0.29",
  },
  {
    title: "TVL-2047-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev C",
    date: "14 Sep 2026",
    dateTime: "2026-09-14",
    sizeMb: "0.84",
  },
  {
    title: "TVL-2047-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev C",
    date: "14 Sep 2026",
    dateTime: "2026-09-14",
    sizeMb: "1.62",
  },
  {
    title: "TVL-3572-ZZ data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev B",
    date: "9 Sep 2026",
    dateTime: "2026-09-09",
    sizeMb: "0.88",
  },
  {
    title: "Certificate of conformity, 2026",
    type: "Certificate",
    format: "PDF",
    revision: "Rev A",
    date: "4 Sep 2026",
    dateTime: "2026-09-04",
    sizeMb: "0.21",
  },
  {
    title: "ISO 9001 certificate, Brigholt works",
    type: "Certificate",
    format: "PDF",
    revision: "Rev C",
    date: "1 Sep 2026",
    dateTime: "2026-09-01",
    sizeMb: "0.47",
  },
]

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Data sheet", label: "Data sheets" },
  { value: "CAD file", label: "CAD files" },
  { value: "Certificate", label: "Certificates" },
]

const FORMATS: { format: string; text: string }[] = [
  { format: "PDF", text: "Data sheets and certificates, for any PDF reader." },
  { format: "STEP", text: "3D models for any CAD system, in millimetres." },
  {
    format: "DXF",
    text: "2D outlines of every size in the range, for drawing packages.",
  },
]

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT_HREF = "/downloads"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const TEXT_LINK = cn(
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
  FOCUS
)
const LABEL = "font-mono text-label text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const CONTAINER = "mx-auto w-full max-w-[1280px] px-4"
const BUTTON_TEXT = "px-4 font-mono text-label"

function documentsWord(n: number) {
  return n === 1 ? "document" : "documents"
}

function countOf(type: Filter) {
  return type === "all"
    ? DOCUMENTS.length
    : DOCUMENTS.filter((d) => d.type === type).length
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul className={mobile ? "py-2" : "flex gap-6"}>
      {NAV_LINKS.map((link) => {
        const current = link.href === CURRENT_HREF
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "font-mono text-label transition-colors duration-150",
                mobile && "block py-2",
                current
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
                FOCUS
              )}
            >
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>("all")
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const shown =
    filter === "all" ? DOCUMENTS : DOCUMENTS.filter((d) => d.type === filter)
  const countText =
    filter === "all"
      ? `${DOCUMENTS.length} ${documentsWord(DOCUMENTS.length)}`
      : `${shown.length} of ${DOCUMENTS.length} ${documentsWord(DOCUMENTS.length)}`

  function onHeaderKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!menuOpen || event.key !== "Escape") return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header
        className="border-b border-border bg-card"
        onKeyDown={onHeaderKeyDown}
      >
        <div className={cn(CONTAINER, "flex items-center gap-6 py-3")}>
          <a
            href="/catalogue"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              FOCUS
            )}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <NavLinks />
          </nav>
          <p className={cn(SMALL_FIGURE, "ml-auto hidden md:block")}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(BUTTON_TEXT, "ml-auto md:hidden")}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-nav"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
        >
          <div className={CONTAINER}>
            <NavLinks mobile />
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6">
        <div className={cn(CONTAINER, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className={LABEL}>Downloads</p>
              <h1 className="text-h1">TVL range documents</h1>
              <p className={SMALL_FIGURE}>
                Deep groove ball bearings · {DOCUMENTS.length}{" "}
                {documentsWord(DOCUMENTS.length)} · updated{" "}
                <time dateTime="2026-10-21">21 Oct 2026</time>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#" className={cn(buttonVariants(), BUTTON_TEXT)}>
                <Download
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Download all (ZIP, 9.73 MB)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <section
              aria-labelledby="documents-heading"
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="documents-heading" className="text-h2">
                  Documents
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    role="group"
                    aria-label="Document type"
                    className="flex flex-wrap gap-1"
                  >
                    {FILTERS.map((f) => (
                      <Button
                        key={f.value}
                        variant="secondary"
                        aria-pressed={filter === f.value}
                        onClick={() => setFilter(f.value)}
                        className={cn(
                          BUTTON_TEXT,
                          "aria-pressed:border-foreground aria-pressed:font-bold"
                        )}
                      >
                        {f.label} ({countOf(f.value)})
                      </Button>
                    ))}
                  </div>
                  <p aria-live="polite" className={SMALL_FIGURE}>
                    {countText}
                  </p>
                </div>
              </div>

              <Table label="Documents" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(LABEL, "min-w-48 px-4")}>
                      Document
                    </TableHead>
                    <TableHead className={cn(LABEL, "px-4")}>Type</TableHead>
                    <TableHead className={cn(LABEL, "px-4")}>Format</TableHead>
                    <TableHead className={cn(LABEL, "px-4")}>
                      Revision
                    </TableHead>
                    <TableHead className={cn(LABEL, "px-4")}>Date</TableHead>
                    <TableHead className={cn(LABEL, "px-4 text-right")}>
                      Size (MB)
                    </TableHead>
                    <TableHead className={cn(LABEL, "px-4")}>
                      <span className="sr-only">File</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((doc) => (
                    <TableRow key={doc.title}>
                      <TableCell className="px-4 py-2 text-body whitespace-normal">
                        {doc.title}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-body">
                        {doc.type}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-mono">
                        {doc.format}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-mono">
                        {doc.revision}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-mono tabular-nums">
                        <time dateTime={doc.dateTime}>{doc.date}</time>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                        {doc.sizeMb}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-left">
                        <a
                          href="#"
                          download
                          aria-label={`Download ${doc.title}, ${doc.format}, ${doc.sizeMb} MB`}
                          className={cn(
                            TEXT_LINK,
                            "inline-flex items-center gap-2 font-mono text-label"
                          )}
                        >
                          <Download
                            className="size-4"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          Download
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <p
                className={cn(SMALL_FIGURE, "border-t border-border px-4 py-3")}
              >
                Each file shows its revision on its first page. Older revisions
                are sent on request.
              </p>
            </section>

            <section
              aria-labelledby="formats-heading"
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="formats-heading" className="text-h2">
                  File formats
                </h2>
              </div>
              <dl>
                {FORMATS.map((f, i) => (
                  <div
                    key={f.format}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3",
                      i > 0 && "border-t border-border"
                    )}
                  >
                    <dt className="font-mono text-label text-foreground">
                      {f.format}
                    </dt>
                    <dd className="max-w-lg text-body text-foreground">
                      {f.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className={cn(CONTAINER, "py-6")}>
          <p className={SMALL_FIGURE}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A demo:
            nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
