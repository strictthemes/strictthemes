import { useState } from "react"

import { SiteFooter, SiteHeader } from "@/components/site-chrome"
import { PaymentSheet } from "@/components/payment-sheet"

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-background text-body text-foreground">
      <SiteHeader
        current="/payment"
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      <main className="flex-1 py-6 md:py-12">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-mono text-label text-muted-foreground uppercase">
                Payments
              </p>
              <h1 className="text-h1">Make a payment</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <PaymentSheet className="lg:col-span-8" />

            <section
              aria-labelledby="good-to-know"
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card lg:col-span-4"
            >
              <div className="flex min-h-8 flex-wrap items-center justify-between gap-3 border-b border-border px-6 pt-6 pb-3">
                <h2
                  id="good-to-know"
                  className="font-mono text-label text-muted-foreground uppercase"
                >
                  Good to know
                </h2>
              </div>
              <ul>
                <li className="px-6 py-3">
                  <p className="max-w-lg">
                    Payments for today go out within two hours. Payments for a
                    later day go out at 06:00 on that day.
                  </p>
                </li>
                <li className="border-t border-border px-6 py-3">
                  <p className="max-w-lg">
                    You can send up to £10,000.00 in one payment.
                  </p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
