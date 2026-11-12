import * as React from "react"

import { Button } from "@/components/ui/button"

type CopyState = "idle" | "copied" | "failed"

const buttonText: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Copy failed",
}

export function CodeBlock({
  label,
  name,
  code,
}: {
  label: string
  name: string
  code: string
}) {
  const [state, setState] = React.useState<CopyState>("idle")
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  function show(next: CopyState) {
    window.clearTimeout(timer.current)
    setState(next)
    timer.current = window.setTimeout(() => setState("idle"), 2000)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      show("copied")
    } catch {
      show("failed")
    }
  }

  return (
    <div className="my-8 rounded-md border border-border bg-card font-mono text-body">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <p className="font-mono text-label text-muted-foreground uppercase">
          {label}
        </p>
        <span role="status" className="sr-only">
          {state === "idle" ? "" : buttonText[state]}
        </span>
        <Button
          variant="outline"
          onClick={copy}
          className="rounded-sm px-4 font-mono text-label uppercase"
        >
          {buttonText[state]}
        </Button>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={name}
        className="overflow-x-auto p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
