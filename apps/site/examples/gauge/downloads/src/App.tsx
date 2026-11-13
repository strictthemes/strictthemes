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

const documents: Doc[] = [
  {
    title: "TVL-2552-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev A",
    date: "2026-10-21",
    dateLabel: "21 Oct 2026",
    sizeMb: "0.91",
  },
  {
    title: "TVL-2552-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev A",
    date: "2026-10-21",
    dateLabel: "21 Oct 2026",
    sizeMb: "1.75",
  },
  {
    title: "TVL range catalogue",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev D",
    date: "2026-10-02",
    dateLabel: "2 Oct 2026",
    sizeMb: "2.40",
  },
  {
    title: "TVL range 2D outlines",
    type: "CAD file",
    format: "DXF",
    revision: "Rev D",
    date: "2026-10-02",
    dateLabel: "2 Oct 2026",
    sizeMb: "0.36",
  },
  {
    title: "Material declaration, REACH and RoHS",
    type: "Certificate",
    format: "PDF",
    revision: "Rev B",
    date: "2026-09-28",
    dateLabel: "28 Sep 2026",
    sizeMb: "0.29",
  },
  {
    title: "TVL-2047-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev C",
    date: "2026-09-14",
    dateLabel: "14 Sep 2026",
    sizeMb: "0.84",
  },
  {
    title: "TVL-2047-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev C",
    date: "2026-09-14",
    dateLabel: "14 Sep 2026",
    sizeMb: "1.62",
  },
  {
    title: "TVL-3572-ZZ data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev B",
    date: "2026-09-09",
    dateLabel: "9 Sep 2026",
    sizeMb: "0.88",
  },
  {
    title: "Certificate of conformity, 2026",
    type: "Certificate",
    format: "PDF",
    revision: "Rev A",
    date: "2026-09-04",
    dateLabel: "4 Sep 2026",
    sizeMb: "0.21",
  },
  {
    title: "ISO 9001 certificate, Brigholt works",
    type: "Certificate",
    format: "PDF",
    revision: "Rev C",
    date: "2026-09-01",
    dateLabel: "1 Sep 2026",
    sizeMb: "0.47",
  },
]

type Filter = "all" | DocType

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Data sheet", label: "Data sheets" },
  { value: "CAD file", label: "CAD files" },
  { value: "Certificate", label: "Certificates" },
]

const formats = [
  { format: "PDF", text: "Data sheets and certificates, for any PDF reader." },
  { format: "STEP", text: "3D models for any CAD system, in millimetres." },
  {
    format: "DXF",
    text: "2D outlines of every size in the range, for drawing packages.",
  },
]

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Compare", href: "/compare" },
  { label: "Downloads", href: "/downloads" },
  { label: "Quote", href: "/quote" },
]

const current = "/downloads"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto w-full max-w-[1280px] px-4"

function countFor(filter: Filter) {
  return filter === "all"
    ? documents.length
    : documents.filter((d) => d.type === filter).length
}

function documentsWord(n: number) {
  return n === 1 ? "document" : "documents"
}

function NavLink({
  label,
  href,
  className,
}: {
  label: string
  href: string
  className?: string
}) {
  const isCurrent = href === current
  return (
    <a
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={cn(
        "font-mono text-label transition-colors duration-150",
        isCurrent
          ? "text-foreground underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground",
        focusRing,
        className
      )}
    >
      {label}
    </a>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>("all")
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const shown =
    filter === "all" ? documents : documents.filter((d) => d.type === filter)
  const countText =
    filter === "all"
      ? `${documents.length} ${documentsWord(documents.length)}`
      : `${shown.length} of ${documents.length} ${documentsWord(documents.length)}`

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
        <div className={cn(container, "flex items-center gap-6 py-3")}>
          <a
            href="/catalogue"
            className={cn(
              "font-heading text-h2 text-foreground transition-colors duration-150",
              focusRing
            )}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
          <p className="ml-auto hidden font-mono text-label text-muted-foreground tabular-nums md:block">
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButtonRef}
            variant="secondary"
            className="ml-auto px-4 font-mono text-label md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
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
          <div className={container}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} className="block py-2" />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-6">
        <div className={cn(container, "flex flex-col gap-6")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-label text-muted-foreground">
                Downloads
              </p>
              <h1 className="text-h1">TVL range documents</h1>
              <p className="font-mono text-label text-muted-foreground tabular-nums">
                Deep groove ball bearings · 10 documents · updated{" "}
                <time dateTime="2026-10-21">21 Oct 2026</time>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "px-4 font-mono text-label"
                )}
              >
                <Download
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.5}
                />
                Download all (ZIP, 9.73 MB)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-9">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="text-h2">Documents</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    role="group"
                    aria-label="Document type"
                    className="flex flex-wrap gap-1"
                  >
                    {filters.map((f) => (
                      <Button
                        key={f.value}
                        variant="secondary"
                        aria-pressed={filter === f.value}
                        className="px-4 font-mono text-label aria-pressed:border-foreground aria-pressed:font-bold"
                        onClick={() => setFilter(f.value)}
                      >
                        {f.label} ({countFor(f.value)})
                      </Button>
                    ))}
                  </div>
                  <p
                    aria-live="polite"
                    className="font-mono text-label text-muted-foreground tabular-nums"
                  >
                    {countText}
                  </p>
                </div>
              </div>

              <Table label="Documents" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-48 px-4 font-mono text-label text-muted-foreground">
                      Document
                    </TableHead>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Format
                    </TableHead>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Revision
                    </TableHead>
                    <TableHead className="px-4 font-mono text-label text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="px-4 text-right font-mono text-label text-muted-foreground">
                      Size (MB)
                    </TableHead>
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
                      <TableCell className="px-4 py-2 text-left">
                        <a
                          href="#"
                          aria-label={`Download ${doc.title}, ${doc.format}, ${doc.sizeMb} MB`}
                          className={cn(
                            "inline-flex items-center gap-2 font-mono text-label text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2",
                            focusRing
                          )}
                        >
                          <Download
                            aria-hidden="true"
                            className="size-4"
                            strokeWidth={1.5}
                          />
                          Download
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t border-border px-4 py-3">
                <p className="font-mono text-label text-muted-foreground tabular-nums">
                  Each file shows its revision on its first page. Older
                  revisions are sent on request.
                </p>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="text-h2">File formats</h2>
              </div>
              <dl>
                {formats.map((item, i) => (
                  <div
                    key={item.format}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3",
                      i > 0 && "border-t border-border"
                    )}
                  >
                    <dt className="font-mono text-label text-foreground">
                      {item.format}
                    </dt>
                    <dd className="text-body text-foreground">{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className={cn(container, "py-6")}>
          <p className="font-mono text-label text-muted-foreground tabular-nums">
            Torvale Bearings Ltd · Brigholt works · Prices exclude VAT · A demo:
            nothing is sold or sent.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
