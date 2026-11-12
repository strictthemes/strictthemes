import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Invoices", href: "/invoice" },
  { label: "Payments", href: "/payment" },
  { label: "Reports", href: "/report" },
]

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const container = "mx-auto w-full max-w-[1200px] px-4 md:px-6"

function NavLinks({ current, itemClassName }: { current: string; itemClassName?: string }) {
  return NAV.map((item) => {
    const isCurrent = item.href === current
    return (
      <li key={item.href}>
        <a
          href={item.href}
          aria-current={isCurrent ? "page" : undefined}
          className={cn(
            "font-mono text-label uppercase transition-colors duration-150",
            focusRing,
            isCurrent
              ? "text-foreground underline underline-offset-4"
              : "text-muted-foreground hover:text-foreground",
            itemClassName
          )}
        >
          {item.label}
        </a>
      </li>
    )
  })
}

export function SiteHeader({
  current,
  menuOpen,
  onToggleMenu,
}: {
  current: string
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  return (
    <header className="border-b border-border">
      <div className={cn(container, "flex items-center gap-6 py-4")}>
        <a
          href="/"
          className={cn("font-heading text-h2 text-foreground no-underline", focusRing)}
        >
          Fairhold
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6">
            <NavLinks current={current} />
          </ul>
        </nav>
        <p className="ml-auto hidden font-mono text-label text-muted-foreground tabular-nums md:block">
          Hollis &amp; Vane
        </p>
        <Button
          variant="outline"
          className="ml-auto px-4 font-mono text-label uppercase md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={onToggleMenu}
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
            <NavLinks current={current} itemClassName="block py-2" />
          </ul>
        </div>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className={cn(container, "py-6")}>
        <p className="font-mono text-label text-muted-foreground tabular-nums">
          Fairhold · A demo. No money moves. · 2026
        </p>
      </div>
    </footer>
  )
}
