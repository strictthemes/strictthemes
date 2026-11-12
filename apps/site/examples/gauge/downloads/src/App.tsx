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

type Doc = {
  title: string
  type: DocType
  format: "PDF" | "STEP" | "DXF"
  revision: string
  date: string
  dateLabel: string
  sizeMb: string
}

// Newest first. Today in this sample is 12 November 2026.
const DOCUMENTS: Doc[] = [
  { title: "TVL-2552-RS data sheet", type: "Data sheet", format: "PDF", revision: "Rev A", date: "2026-10-21", dateLabel: "21 Oct 2026", sizeMb: "0.91" },
  { title: "TVL-2552-RS 3D model", type: "CAD file", format: "STEP", revision: "Rev A", date: "2026-10-21", dateLabel: "21 Oct 2026", sizeMb: "1.75" },
  { title: "TVL range catalogue", type: "Data sheet", format: "PDF", revision: "Rev D", date: "2026-10-02", dateLabel: "2 Oct 2026", sizeMb: "2.40" },
  { title: "TVL range 2D outlines", type: "CAD file", format: "DXF", revision: "Rev D", date: "2026-10-02", dateLabel: "2 Oct 2026", sizeMb: "0.36" },
  { title: "Material declaration, REACH and RoHS", type: "Certificate", format: "PDF", revision: "Rev B", date: "2026-09-28", dateLabel: "28 Sep 2026", sizeMb: "0.29" },
  { title: "TVL-2047-RS data sheet", type: "Data sheet", format: "PDF", revision: "Rev C", date: "2026-09-14", dateLabel: "14 Sep 2026", sizeMb: "0.84" },
  { title: "TVL-2047-RS 3D model", type: "CAD file", format: "STEP", revision: "Rev C", date: "2026-09-14", dateLabel: "14 Sep 2026", sizeMb: "1.62" },
  { title: "TVL-3572-ZZ data sheet", type: "Data sheet", format: "PDF", revision: "Rev B", date: "2026-09-09", dateLabel: "9 Sep 2026", sizeMb: "0.88" },
  { title: "Certificate of conformity, 2026", type: "Certificate", format: "PDF", revision: "Rev A", date: "2026-09-04", dateLabel: "4 Sep 2026", sizeMb: "0.21" },
  { title: "ISO 9001 certificate, Brigholt works", type: "Certificate", format: "PDF", revision: "Rev C", date: "2026-09-01", dateLabel: "1 Sep 2026", sizeMb: "0.47" },
]

type Filter = "all" | DocType

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Data sheet", label: "Data sheets" },
  { value: "CAD file", label: "CAD files" },
  { value: "Certificate", label: "Certificates" },
]

const FORMATS = [
  { format: "PDF", text: "Data sheets and certificates, for any PDF reader." },
  { format: "STEP", text: "3D models for any CAD system, in millimetres." },
  { format: "DXF", text: "2D outlines of every size in the range, for drawing packages." },
]

const NAV_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]
const CURRENT = "/downloads"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink =
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2"
const smallFigure = "font-mono text-label tabular-nums text-muted-foreground"
const buttonText = "px-4 font-mono text-label"

function countDocs(n: number) {
  return `${n} ${n === 1 ? "document" : "documents"}`
}

function NavList({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul className={mobile ? "py-2" : "flex gap-6"}>
      {NAV_LINKS.map((link) => {
        const current = link.href === CURRENT
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
                focusRing
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
      ? countDocs(DOCUMENTS.length)
      : `${shown.length} of ${countDocs(DOCUMENTS.length)}`

  function closeMenuOnEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1280px] items-center gap-6 px-4 py-3">
          <a
            href="/catalogue"
            className={cn(
              "font-heading text-h2 text-foreground no-underline",
              focusRing
            )}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <NavList />
          </nav>
          <p className={cn("ml-auto hidden md:block", smallFigure)}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className={cn("ml-auto md:hidden", buttonText)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={closeMenuOnEscape}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="w-full border-t border-border md:hidden"
          onKeyDown={closeMenuOnEscape}
        >
          <div className="mx-auto w-full max-w-[1280px] px-4">
            <NavList mobile />
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-label text-muted-foreground">
                Downloads
              </p>
              <h1 className="text-h1">TVL range documents</h1>
              <p className={smallFigure}>
                Deep groove ball bearings · 10 documents · updated{" "}
                <time dateTime="2026-10-21">21 Oct 2026</time>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#" className={cn(buttonVariants(), buttonText)}>
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
              className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-9"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="documents-heading" className="text-h2">
                  Documents
                </h2>
                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                  <div
                    role="group"
                    aria-label="Document type"
                    className="flex flex-wrap gap-1"
                  >
                    {FILTERS.map((f) => {
                      const n =
                        f.value === "all"
                          ? DOCUMENTS.length
                          : DOCUMENTS.filter((d) => d.type === f.value).length
                      return (
                        <Button
                          key={f.value}
                          variant="secondary"
                          aria-pressed={filter === f.value}
                          className={cn(
                            buttonText,
                            "aria-pressed:border-foreground aria-pressed:font-bold"
                          )}
                          onClick={() => setFilter(f.value)}
                        >
                          {f.label} ({n})
                        </Button>
                      )
                    })}
                  </div>
                  <p aria-live="polite" className={smallFigure}>
                    {countText}
                  </p>
                </div>
              </div>

              <Table label="Documents" className="text-body">
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Document", className: "min-w-48" },
                      { label: "Type" },
                      { label: "Format" },
                      { label: "Revision" },
                      { label: "Date" },
                      { label: "Size (MB)", className: "text-right" },
                    ].map((h) => (
                      <TableHead
                        key={h.label}
                        className={cn(
                          "px-4 font-mono text-label text-muted-foreground",
                          h.className
                        )}
                      >
                        {h.label}
                      </TableHead>
                    ))}
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
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
                      <TableCell className="px-4 py-2">
                        <time
                          dateTime={doc.date}
                          className="font-mono tabular-nums"
                        >
                          {doc.dateLabel}
                        </time>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right font-mono tabular-nums">
                        {doc.sizeMb}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <a
                          href="#"
                          download
                          aria-label={`Download ${doc.title}, ${doc.format}, ${doc.sizeMb} MB`}
                          className={cn(
                            "inline-flex items-center gap-2 font-mono text-label",
                            textLink,
                            focusRing
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

              <div className="border-t border-border px-4 py-3">
                <p className={smallFigure}>
                  Each file shows its revision on its first page. Older
                  revisions are sent on request.
                </p>
              </div>
            </section>

            <section
              aria-labelledby="formats-heading"
              className="overflow-hidden rounded-xl border border-border bg-card lg:col-span-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 id="formats-heading" className="text-h2">
                  File formats
                </h2>
              </div>
              <ul>
                {FORMATS.map((f, i) => (
                  <li
                    key={f.format}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3",
                      i > 0 && "border-t border-border"
                    )}
                  >
                    <span className="font-mono text-label text-foreground">
                      {f.format}
                    </span>
                    <p className="text-body text-foreground">{f.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6">
          <p className={smallFigure}>
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A
            demo: nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
