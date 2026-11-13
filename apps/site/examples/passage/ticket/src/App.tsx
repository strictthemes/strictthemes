import { useEffect, useRef, useState } from "react"
import { Bike, Clock, IdCard, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"

const BOOKING_REFERENCE = "KF-7Q4M2R"

const focusOutline =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const headerLink = `text-foreground decoration-1 underline-offset-4 hover:underline transition-colors duration-150 ${focusOutline}`

const textLink = `text-primary underline decoration-1 underline-offset-4 hover:text-foreground transition-colors duration-150 ${focusOutline}`

const buttonClasses = "h-auto rounded-md px-5 py-2 font-mono text-label"

const navLinks = [
  { label: "Book", href: "/" },
  { label: "Departures", href: "/departures" },
  { label: "My booking", href: "/ticket", current: true },
  { label: "Help", href: "#" },
]

const boardingCode = [
  "11101011",
  "10101001",
  "11100110",
  "00011011",
  "10110100",
  "01001110",
  "11010101",
  "10011011",
]

function ConfirmedState() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-success"
      />
      <span className="font-mono text-label text-success">Confirmed</span>
    </span>
  )
}

function Header() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <a href="/" className={`font-heading text-h2 ${headerLink}`}>
          Kestrel Ferries
        </a>
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  className={`text-body ${headerLink} ${link.current ? "underline" : ""}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto max-w-[1120px] px-5 py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">Kestrel Ferries</p>
            <p className="mt-2 max-w-xl">
              Crossings from Harrowmouth to Port Ellery, Brindle Ness, Wrenholm
              and Tollan Quay since 1987.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="font-mono text-label text-muted-foreground">
              Customer desk
            </p>
            <p className="mt-2 max-w-xl text-body">
              <a href="tel:+441632960512" className={textLink}>
                01632 960 512
              </a>
            </p>
            <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
              Every day · <time dateTime="06:00">06:00</time>–
              <time dateTime="22:00">22:00</time>
            </p>
          </div>
        </div>
        <p className="mt-5 font-mono text-label text-muted-foreground">
          © 2026 Kestrel Ferries
        </p>
      </div>
    </footer>
  )
}

function Journey({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div className="shrink-0">
        <p className="font-mono text-h2 text-foreground tabular-nums">
          <time dateTime="09:15">09:15</time>
        </p>
        <p className="mt-1 font-mono text-label text-muted-foreground">
          Harrowmouth
        </p>
      </div>
      <div className="min-w-0 flex-1 text-center">
        <p className="font-mono text-label text-muted-foreground">1 h 45 min</p>
        <div aria-hidden="true" className="mt-1 h-px bg-border" />
        <p className="mt-1 font-mono text-label text-muted-foreground">
          Direct
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-mono text-h2 text-foreground tabular-nums">
          <time dateTime="11:00">11:00</time>
        </p>
        <p className="mt-1 font-mono text-label text-muted-foreground">
          Port Ellery
        </p>
      </div>
    </div>
  )
}

const dlRow =
  "flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0"
const dtClass = "shrink-0 font-mono text-label text-muted-foreground"
const ddClass = "min-w-0 text-right text-body text-foreground"
const ddLabel = "min-w-0 text-right font-mono text-label text-foreground"

function BoardingCode() {
  return (
    <div
      role="img"
      aria-label={`Boarding code for booking ${BOOKING_REFERENCE}`}
      className="grid size-32 shrink-0 grid-cols-8 grid-rows-8"
    >
      {boardingCode.flatMap((row, r) =>
        row
          .split("")
          .map((cell, c) => (
            <span
              key={`${r}-${c}`}
              className={cell === "1" ? "bg-foreground" : undefined}
            />
          ))
      )}
    </div>
  )
}

function Ticket() {
  const [copyMessage, setCopyMessage] = useState("")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function showMessage(message: string) {
    window.clearTimeout(timer.current)
    setCopyMessage(message)
    timer.current = window.setTimeout(() => setCopyMessage(""), 4000)
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(BOOKING_REFERENCE)
      showMessage("Copied")
    } catch {
      showMessage("Copy failed: select the reference and copy it.")
    }
  }

  return (
    <article
      aria-labelledby="ticket-heading"
      className="relative overflow-hidden rounded-xl border bg-card"
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <p className="font-mono text-label text-muted-foreground">
            Boarding pass · Kestrel Ferries
          </p>
          <ConfirmedState />
        </div>
        <h2 id="ticket-heading" className="mt-2 text-h2">
          Harrowmouth to Port Ellery
        </h2>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
          <div>
            <p className="font-mono text-label text-muted-foreground">
              Booking reference
            </p>
            <p className="mt-1 font-mono text-h1 text-foreground">
              {BOOKING_REFERENCE}
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              className={buttonClasses}
              onClick={copyReference}
            >
              Copy reference
            </Button>
            <span
              role="status"
              className="font-mono text-label text-foreground"
            >
              {copyMessage && <span className="ml-3">{copyMessage}</span>}
            </span>
          </div>
        </div>

        <Journey className="mt-5" />

        <dl className="mt-5 divide-y tabular-nums">
          <div className={dlRow}>
            <dt className={dtClass}>Date</dt>
            <dd className={ddClass}>
              <time dateTime="2026-12-19">Saturday 19 December 2026</time>
            </dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Route</dt>
            <dd className={ddLabel}>HRW–PEL</dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Ship</dt>
            <dd className={ddClass}>MV Isla Grey</dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Berth</dt>
            <dd className={`${ddLabel} tabular-nums`}>2</dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Check-in closes</dt>
            <dd className={`${ddLabel} tabular-nums`}>
              <time dateTime="08:45">08:45</time>
            </dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Passengers</dt>
            <dd className={ddClass}>
              <span className="block">Maren Holt</span>
              <span className="block">Tomas Holt</span>
            </dd>
          </div>
          <div className={dlRow}>
            <dt className={dtClass}>Extras</dt>
            <dd className={ddClass}>2 bicycles</dd>
          </div>
        </dl>
      </div>

      <div
        aria-hidden="true"
        className="relative border-t border-dashed border-border"
      >
        <div className="absolute top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
        <div className="absolute top-0 right-0 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
      </div>

      <div className="flex items-center gap-5 p-5">
        <BoardingCode />
        <div className="min-w-0">
          <p className="font-mono text-label text-muted-foreground">
            Scan at check-in
          </p>
          <p className="mt-2 max-w-xl text-body">
            Show this code at the desk by Berth 2 before{" "}
            <time dateTime="08:45" className="tabular-nums">
              08:45
            </time>
            .
          </p>
          <p className="mt-2 font-mono text-label text-muted-foreground tabular-nums">
            2 adults · 2 bicycles
          </p>
        </div>
      </div>
    </article>
  )
}

const bringItems = [
  {
    icon: IdCard,
    text: (
      <>Photo ID for each adult, such as a passport or a driving licence.</>
    ),
  },
  {
    icon: Smartphone,
    text: <>This boarding pass, on your phone or printed.</>,
  },
  {
    icon: Bike,
    text: <>A lock for each bicycle. Bicycles travel on the car deck.</>,
  },
  {
    icon: Clock,
    text: (
      <>
        Time to check in: the desk by Berth 2 closes at{" "}
        <time dateTime="08:45" className="tabular-nums">
          08:45
        </time>
        .
      </>
    ),
  },
]

function WhatToBring() {
  return (
    <aside
      aria-labelledby="bring-heading"
      className="rounded-xl border bg-card p-5 md:col-span-4 md:col-start-9"
    >
      <p className="font-mono text-label text-muted-foreground">
        Before you leave home
      </p>
      <h2 id="bring-heading" className="mt-2 text-h2">
        What to bring
      </h2>
      <ul className="mt-5 divide-y">
        {bringItems.map(({ icon: Icon, text }, i) => (
          <li
            key={i}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-1 size-4 shrink-0"
            />
            <p className="max-w-xl min-w-0 text-body">{text}</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <Header />

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid grid-cols-1 gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p>
              <ConfirmedState />
            </p>
            <h1 className="mt-2 text-h1">Your crossing is booked</h1>
            <p className="mt-3 max-w-xl text-body wrap-break-word">
              We sent your boarding pass to maren.holt@mail.example. Show it at
              check-in on your phone or on paper.
            </p>
            <p className="mt-3 font-mono text-label text-muted-foreground tabular-nums">
              Booked on{" "}
              <time dateTime="2026-11-12">Thursday 12 November 2026</time> ·
              Paid <span className="text-foreground tabular-nums">£90.00</span>
            </p>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <Ticket />
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <Button
                variant="secondary"
                className={buttonClasses}
                onClick={() => window.print()}
              >
                Print boarding pass
              </Button>
              <a href="/departures" className={textLink}>
                Departures on the day
              </a>
            </div>
          </div>
          <WhatToBring />
        </section>

        <section className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Change or cancel</h2>
            <p className="mt-3 max-w-xl text-body">
              Make changes or ask for a refund from this page or at the desk;
              any difference in fare is charged or refunded to your card.
            </p>
            <dl className="mt-5 divide-y tabular-nums">
              <div className={dlRow}>
                <dt className={dtClass}>Change up to 24 hours before</dt>
                <dd className={`${ddLabel} tabular-nums`}>£10.00</dd>
              </div>
              <div className={dlRow}>
                <dt className={dtClass}>Cancel up to 7 days before</dt>
                <dd className={`${ddLabel} tabular-nums`}>
                  Refund less £15.00
                </dd>
              </div>
              <div className={dlRow}>
                <dt className={dtClass}>Cancel later</dt>
                <dd className={ddLabel}>No refund</dd>
              </div>
            </dl>
            <p className="mt-5 max-w-xl text-body">
              <a href="#" className={textLink}>
                Change this booking
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
