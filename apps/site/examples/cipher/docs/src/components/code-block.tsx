import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CopyState = "idle" | "copied" | "failed"

export function CodeBlock({
  label,
  code,
  className,
}: {
  label: string
  code: string
  className?: string
}) {
  const [state, setState] = useState<CopyState>("idle")
  const timer = useRef<number | undefined>(undefined)
  const lines = code.split("\n")

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    const text = lines.filter((line) => !line.startsWith("#")).join("\n")
    let next: CopyState = "copied"
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      next = "failed"
    }
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  const message =
    state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <figcaption className="font-mono text-label text-muted-foreground">
          {label}
        </figcaption>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="px-4 font-mono text-label"
            onClick={copy}
          >
            {state === "copied" && (
              <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
            )}
            {message || "Copy"}
          </Button>
          <span role="status" className="sr-only">
            {message}
          </span>
        </div>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code: ${label}`}
        className="overflow-x-auto p-4 font-mono text-body focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={cn(
                "block",
                line.startsWith("#")
                  ? "text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {line}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}
