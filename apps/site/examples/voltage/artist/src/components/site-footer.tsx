export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-8 md:px-5">
        <p className="font-heading text-h2">Tremor Days</p>
        <p className="text-body">
          A two-day music and design festival on the old quays of Varsby Docks.
        </p>
        <p className="font-mono text-label font-bold text-foreground uppercase">
          Varsby Docks · <time dateTime="2026-12-04">4</time>–
          <time dateTime="2026-12-05">5 Dec 2026</time> · © 2026 Tremor Days
        </p>
      </div>
    </footer>
  )
}
