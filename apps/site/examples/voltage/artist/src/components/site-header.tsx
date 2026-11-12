import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const label = "font-mono text-label font-bold uppercase text-foreground"

const navLinks = [
  { href: "/line-up", text: "Line-up" },
  { href: "/tickets", text: "Tickets" },
  { href: "/info", text: "Info" },
]

type SiteHeaderProps = {
  /** The address of the current page's nav link, if any. */
  current?: string
}

export function SiteHeader({ current }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  function linkClass(href: string) {
    return cn(
      label,
      "underline-offset-4 hover:underline",
      href === current && "underline decoration-2",
      focusRing
    )
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground underline-offset-4 hover:underline",
            focusRing
          )}
        >
          Tremor Days
        </a>
        <nav aria-label="Main" className="hidden gap-5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === current ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.text}
            </a>
          ))}
        </nav>
        <p className={cn(label, "ml-auto hidden tabular-nums md:block")}>
          <time dateTime="2026-12-04">4</time>–
          <time dateTime="2026-12-05">5 Dec 2026</time>
        </p>
        <Button
          ref={buttonRef}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto h-auto px-5 py-2 font-mono text-label font-bold uppercase md:hidden"
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === current ? "page" : undefined}
              className={cn(linkClass(link.href), "block py-2")}
            >
              {link.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
