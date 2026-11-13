import { useEffect, useRef, useState } from "react"
import { Bike, Clock, IdCard, Smartphone } from "lucide-react"

import { Button } from "@/components/ui/button"

const BOOKING_REFERENCE = "KF-7Q4M2R"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const TEXT_LINK = `text-primary underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-foreground ${FOCUS}`

const HEADER_LINK = `text-foreground decoration-1 underline-offset-4 transition-colors duration-150 hover:underline ${FOCUS}`

const BUTTON = "h-auto rounded-md px-5 py-2 font-mono text-label"

const LABEL = "font-mono text-label text-muted-foreground"

const DL_ROW =
  "flex items-baseline justify-between gap-5 py-2 first:pt-0 last:pb-0"

const DL_TERM = "shrink-0 font-mono text-label text-muted-foreground"

const DL_VALUE = "min-w-0 text-right text-body text-foreground"

const DL_VALUE_LABEL = "min-w-0 text-right font-mono text-label text-foreground"

const navigation = [
  { label: "Book", href: "/", current: false },
  { label: "Departures", href: "/departures", current: false },
  { label: "My booking", href: "/ticket", current: true },
  { label: "Help", href: "#", current: false },
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

function Confirmed() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="size-2 shrink-0 rounded-full bg-success"
        aria-hidden="true"
      />
      <span className="font-mono text-label text-success">Confirmed</span>
    </span>
  )
}

export function App() {
  const [copyMessage, setCopyMessage] = useState("")
  const clearTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(clearTimer.current)
  }, [])

  async function copyReference() {
    let message = "Copied"
    try {
      await navigator.clipboard.writeText(BOOKING_REFERENCE)
    } catch {
      message = "Copy failed: select the reference and copy it."
    }
    setCopyMessage(message)
    window.clearTimeout(clearTimer.current)
    clearTimer.current = window.setTimeout(() => setCopyMessage(""), 4000)
  }

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-2 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <a
            href="/"
            className={`font-heading text-h2 text-foreground transition-colors duration-150 ${FOCUS}`}
          >
            Kestrel Ferries
          </a>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={
                      item.current
                        ? `text-body underline ${HEADER_LINK}`
                        : `text-body ${HEADER_LINK}`
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5">
        <section className="grid gap-5 pt-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p>
              <Confirmed />
            </p>
            <h1 className="mt-2 text-h1">Your crossing is booked</h1>
            <p className="mt-3 max-w-xl text-body">
              We sent the boarding pass to maren.holt@mail.example. You can show
              it at check-in on your phone or on paper.
            </p>
            <p className={`mt-3 ${LABEL}`}>
              Booked on{" "}
              <time dateTime="2026-11-12">Thursday 12 November 2026</time> ·
              Paid <span className="text-foreground tabular-nums">£90.00</span>
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <article
              aria-labelledby="ticket-heading"
              className="relative overflow-hidden rounded-xl border bg-card"
            >
              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
                  <p className={LABEL}>Boarding pass · Kestrel Ferries</p>
                  <Confirmed />
                </div>
                <h2 id="ticket-heading" className="mt-2 text-h2">
                  Harrowmouth to Port Ellery
                </h2>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
                  <div>
                    <p className={LABEL}>Booking reference</p>
                    <p className="mt-1 font-mono text-h1 text-foreground">
                      {BOOKING_REFERENCE}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className={BUTTON}
                      onClick={copyReference}
                    >
                      Copy reference
                    </Button>
                    <span
                      role="status"
                      className="font-mono text-label text-foreground"
                    >
                      {copyMessage}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="shrink-0">
                    <p className="font-mono text-h2 text-foreground tabular-nums">
                      <time dateTime="09:15">09:15</time>
                    </p>
                    <p className={`mt-1 ${LABEL}`}>Harrowmouth</p>
                  </div>
                  <div className="min-w-0 flex-1 text-center">
                    <p className={LABEL}>1 h 45 min</p>
                    <div className="mt-1 h-px bg-border" aria-hidden="true" />
                    <p className={`mt-1 ${LABEL}`}>Direct</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-h2 text-foreground tabular-nums">
                      <time dateTime="11:00">11:00</time>
                    </p>
                    <p className={`mt-1 ${LABEL}`}>Port Ellery</p>
                  </div>
                </div>

                <dl className="mt-5 divide-y">
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Date</dt>
                    <dd className={DL_VALUE}>
                      <time dateTime="2026-12-19">
                        Saturday 19 December 2026
                      </time>
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Route</dt>
                    <dd className={DL_VALUE_LABEL}>HRW–PEL</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Ship</dt>
                    <dd className={DL_VALUE}>MV Isla Grey</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Berth</dt>
                    <dd className={DL_VALUE_LABEL}>2</dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Check-in closes</dt>
                    <dd className={`${DL_VALUE_LABEL} tabular-nums`}>
                      <time dateTime="08:45">08:45</time>
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Passengers</dt>
                    <dd className={DL_VALUE}>
                      <span className="block">Maren Holt</span>
                      <span className="block">Tomas Holt</span>
                    </dd>
                  </div>
                  <div className={DL_ROW}>
                    <dt className={DL_TERM}>Extras</dt>
                    <dd className={DL_VALUE}>2 bicycles</dd>
                  </div>
                </dl>
              </div>

              <div
                className="relative border-t border-dashed"
                aria-hidden="true"
              >
                <span className="absolute top-0 left-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
                <span className="absolute top-0 right-0 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
              </div>

              <div className="flex items-center gap-5 p-5">
                <div
                  role="img"
                  aria-label={`Boarding code for booking ${BOOKING_REFERENCE}`}
                  className="grid size-32 shrink-0 grid-cols-8"
                >
                  {boardingCode.flatMap((row, rowIndex) =>
                    row
                      .split("")
                      .map((cell, cellIndex) => (
                        <span
                          key={`${rowIndex}-${cellIndex}`}
                          className={cell === "1" ? "bg-foreground" : undefined}
                        />
                      ))
                  )}
                </div>
                <div className="min-w-0">
                  <p className={LABEL}>Scan at check-in</p>
                  <p className="mt-2 text-body">
                    Show this code at the desk by Berth 2 before{" "}
                    <time dateTime="08:45" className="tabular-nums">
                      08:45
                    </time>
                    .
                  </p>
                  <p className={`mt-2 ${LABEL}`}>2 adults · 2 bicycles</p>
                </div>
              </div>
            </article>

            <div className="mt-5 flex flex-wrap items-center gap-5">
              <Button
                variant="secondary"
                className={BUTTON}
                onClick={() => window.print()}
              >
                Print boarding pass
              </Button>
              <a href="/departures" className={TEXT_LINK}>
                Departures on the day
              </a>
            </div>
          </div>

          <aside
            aria-labelledby="bring-heading"
            className="rounded-xl border bg-card p-5 md:col-span-4 md:col-start-9"
          >
            <p className={LABEL}>Before you leave home</p>
            <h2 id="bring-heading" className="mt-2 text-h2">
              What to bring
            </h2>
            <ul className="mt-5 divide-y">
              <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <IdCard
                  className="mt-1 size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-body">
                  Photo ID for each adult, such as a passport or a driving
                  licence.
                </p>
              </li>
              <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Smartphone
                  className="mt-1 size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-body">
                  This boarding pass, on your phone or printed.
                </p>
              </li>
              <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Bike
                  className="mt-1 size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-body">
                  A lock for each bicycle. Bicycles travel on the car deck.
                </p>
              </li>
              <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <Clock
                  className="mt-1 size-4 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-body">
                  Time to check in: the desk by Berth 2 closes at{" "}
                  <time dateTime="08:45" className="tabular-nums">
                    08:45
                  </time>
                  .
                </p>
              </li>
            </ul>
          </aside>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-h2">Change or cancel</h2>
            <p className="mt-3 max-w-xl text-body">
              You can change or cancel this booking from this page or at the
              desk, and any difference in the fare is charged or refunded.
            </p>
            <dl className="mt-5 divide-y">
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Change up to 24 hours before</dt>
                <dd className={`${DL_VALUE_LABEL} tabular-nums`}>£10.00</dd>
              </div>
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Cancel up to 7 days before</dt>
                <dd className={DL_VALUE}>Refund less £15.00</dd>
              </div>
              <div className={DL_ROW}>
                <dt className={DL_TERM}>Cancel later</dt>
                <dd className={DL_VALUE}>No refund</dd>
              </div>
            </dl>
            <p className="mt-5">
              <a href="#" className={TEXT_LINK}>
                Change this booking
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-card">
        <div className="mx-auto max-w-[1120px] px-5 py-8">
          <div className="grid gap-5 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6">
              <p className="font-heading text-h2">Kestrel Ferries</p>
              <p className="mt-2 max-w-xl text-body">
                Crossings from Harrowmouth to Port Ellery, Brindle Ness,
                Wrenholm and Tollan Quay since 1987.
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className={LABEL}>Customer desk</p>
              <p className="mt-2 text-body">
                <a href="tel:+441632960512" className={TEXT_LINK}>
                  01632 960 512
                </a>
              </p>
              <p className={`mt-2 tabular-nums ${LABEL}`}>
                Every day · <time dateTime="06:00">06:00</time>–
                <time dateTime="22:00">22:00</time>
              </p>
            </div>
          </div>
          <p className={`mt-5 ${LABEL}`}>© 2026 Kestrel Ferries</p>
        </div>
      </footer>
    </div>
  )
}

export default App
