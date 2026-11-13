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
type Filter = "All" | DocType

type Doc = {
  title: string
  type: DocType
  format: "PDF" | "STEP" | "DXF"
  revision: string
  date: string
  dateTime: string
  size: string
}

// Newest first.
const documents: Doc[] = [
  {
    title: "TVL-2552-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev A",
    date: "21 Oct 2026",
    dateTime: "2026-10-21",
    size: "0.91",
  },
  {
    title: "TVL-2552-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev A",
    date: "21 Oct 2026",
    dateTime: "2026-10-21",
    size: "1.75",
  },
  {
    title: "TVL range catalogue",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev D",
    date: "2 Oct 2026",
    dateTime: "2026-10-02",
    size: "2.40",
  },
  {
    title: "TVL range 2D outlines",
    type: "CAD file",
    format: "DXF",
    revision: "Rev D",
    date: "2 Oct 2026",
    dateTime: "2026-10-02",
    size: "0.36",
  },
  {
    title: "Material declaration, REACH and RoHS",
    type: "Certificate",
    format: "PDF",
    revision: "Rev B",
    date: "28 Sep 2026",
    dateTime: "2026-09-28",
    size: "0.29",
  },
  {
    title: "TVL-2047-RS data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev C",
    date: "14 Sep 2026",
    dateTime: "2026-09-14",
    size: "0.84",
  },
  {
    title: "TVL-2047-RS 3D model",
    type: "CAD file",
    format: "STEP",
    revision: "Rev C",
    date: "14 Sep 2026",
    dateTime: "2026-09-14",
    size: "1.62",
  },
  {
    title: "TVL-3572-ZZ data sheet",
    type: "Data sheet",
    format: "PDF",
    revision: "Rev B",
    date: "9 Sep 2026",
    dateTime: "2026-09-09",
    size: "0.88",
  },
  {
    title: "Certificate of conformity, 2026",
    type: "Certificate",
    format: "PDF",
    revision: "Rev A",
    date: "4 Sep 2026",
    dateTime: "2026-09-04",
    size: "0.21",
  },
  {
    title: "ISO 9001 certificate, Brigholt works",
    type: "Certificate",
    format: "PDF",
    revision: "Rev C",
    date: "1 Sep 2026",
    dateTime: "2026-09-01",
    size: "0.47",
  },
]

const countOf = (filter: Filter) =>
  filter === "All"
    ? documents.length
    : documents.filter((doc) => doc.type === filter).length

const filters: { value: Filter; name: string }[] = [
  { value: "All", name: "All" },
  { value: "Data sheet", name: "Data sheets" },
  { value: "CAD file", name: "CAD files" },
  { value: "Certificate", name: "Certificates" },
]

const formats = [
  {
    name: "PDF",
    text: "Data sheets and certificates, for any PDF reader.",
  },
  {
    name: "STEP",
    text: "3D models for any CAD system, in millimetres.",
  },
  {
    name: "DXF",
    text: "2D outlines of every size in the range, for drawing packages.",
  },
]

const navLinks = [
  { name: "Catalogue", href: "/catalogue" },
  { name: "Compare", href: "/compare" },
  { name: "Downloads", href: "/downloads" },
  { name: "Quote", href: "/quote" },
]

const currentPage = "/downloads"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto w-full max-w-[1280px] px-4"

const smallFigure =
  "font-mono text-label tabular-nums text-muted-foreground"

const textLink =
  "text-foreground underline underline-offset-4 transition-colors duration-150 hover:decoration-2"

const headCell = "px-4 font-mono text-label text-muted-foreground"

const bodyCell = "px-4 py-2"

function documentCount(count: number) {
  return `${count} ${count === 1 ? "document" : "documents"}`
}

function navLinkClass(href: string) {
  return cn(
    "font-mono text-label transition-colors duration-150",
    href === currentPage
      ? "text-foreground underline underline-offset-4"
      : "text-muted-foreground hover:text-foreground",
    focusRing
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>("All")
  const menuButton = useRef<HTMLButtonElement>(null)

  const shown =
    filter === "All"
      ? documents
      : documents.filter((doc) => doc.type === filter)

  // Escape closes the menu while focus is in it or on its button.
  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false)
      menuButton.current?.focus()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <header className="border-b border-border bg-card">
        <div className={cn(container, "flex items-center gap-6 py-3")}>
          <a
            href="/catalogue"
            className={cn("font-heading text-h2 text-foreground", focusRing)}
          >
            Torvale
          </a>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentPage ? "page" : undefined
                    }
                    className={navLinkClass(link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={cn(smallFigure, "ml-auto hidden md:block")}>
            Sales 01632 960 418
          </p>
          <Button
            ref={menuButton}
            variant="secondary"
            className="ml-auto px-4 font-mono text-label md:hidden"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={closeOnEscape}
          >
            Menu
          </Button>
        </div>
        <nav
          id="main-menu"
          aria-label="Main"
          hidden={!menuOpen}
          className="border-t border-border md:hidden"
          onKeyDown={closeOnEscape}
        >
          <div className={container}>
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      link.href === currentPage ? "page" : undefined
                    }
                    className={cn(navLinkClass(link.href), "block py-2")}
                  >
                    {link.name}
                  </a>
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
              <p className={smallFigure}>
                Deep groove ball bearings · {documentCount(documents.length)} ·
                updated <time dateTime="2026-10-21">21 Oct 2026</time>
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
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
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
                    {filters.map((item) => (
                      <Button
                        key={item.value}
                        variant="secondary"
                        aria-pressed={filter === item.value}
                        className="px-4 font-mono text-label aria-pressed:border-foreground aria-pressed:font-bold"
                        onClick={() => setFilter(item.value)}
                      >
                        {item.name} ({countOf(item.value)})
                      </Button>
                    ))}
                  </div>
                  <p aria-live="polite" className={smallFigure}>
                    {filter === "All"
                      ? documentCount(documents.length)
                      : `${shown.length} of ${documentCount(documents.length)}`}
                  </p>
                </div>
              </div>

              <Table label="Documents" className="text-body">
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn(headCell, "min-w-48")}>
                      Document
                    </TableHead>
                    <TableHead className={headCell}>Type</TableHead>
                    <TableHead className={headCell}>Format</TableHead>
                    <TableHead className={headCell}>Revision</TableHead>
                    <TableHead className={headCell}>Date</TableHead>
                    <TableHead className={cn(headCell, "text-right")}>
                      Size (MB)
                    </TableHead>
                    <TableHead className={headCell}>
                      <span className="sr-only">File</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((doc) => (
                    <TableRow key={doc.title}>
                      <TableCell
                        className={cn(bodyCell, "text-body whitespace-normal")}
                      >
                        {doc.title}
                      </TableCell>
                      <TableCell className={cn(bodyCell, "text-body")}>
                        {doc.type}
                      </TableCell>
                      <TableCell className={cn(bodyCell, "font-mono")}>
                        {doc.format}
                      </TableCell>
                      <TableCell className={cn(bodyCell, "font-mono")}>
                        {doc.revision}
                      </TableCell>
                      <TableCell className={bodyCell}>
                        <time
                          dateTime={doc.dateTime}
                          className="font-mono tabular-nums"
                        >
                          {doc.date}
                        </time>
                      </TableCell>
                      <TableCell
                        className={cn(
                          bodyCell,
                          "text-right font-mono tabular-nums"
                        )}
                      >
                        {doc.size}
                      </TableCell>
                      <TableCell className={bodyCell}>
                        <a
                          href="#"
                          download
                          aria-label={`Download ${doc.title}, ${doc.format}, ${doc.size} MB`}
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
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="text-h2">File formats</h2>
              </div>
              <dl>
                {formats.map((format, index) => (
                  <div
                    key={format.name}
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3",
                      index > 0 && "border-t border-border"
                    )}
                  >
                    <dt className="font-mono text-label text-foreground">
                      {format.name}
                    </dt>
                    <dd className="text-body">{format.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className={cn(container, "py-6")}>
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
