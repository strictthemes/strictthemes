import { cn } from "@/lib/utils"

const links = [
  { label: "Programme", href: "/" },
  { label: "Seasons", href: "/season" },
  { label: "Membership", href: "/membership" },
  { label: "Visit", href: "/visit" },
]

const textLinkClass = cn(
  "text-foreground underline decoration-1 underline-offset-4 transition-colors duration-150 hover:text-primary",
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
)

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border py-12">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-6">
            <p className="font-heading text-h2">The Vesper</p>
            <p className="mt-2 text-body text-muted-foreground">
              21 Tallow Row, Oldmere OM2 4LT
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body md:col-span-6 md:mt-0">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={textLinkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 font-mono text-label text-muted-foreground uppercase">
          © 2026 The Vesper
        </p>
      </div>
    </footer>
  )
}
