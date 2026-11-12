import { LoaderCircle } from "lucide-react"
import type { ReactNode } from "react"

export interface StreamProps {
  /** The answer so far. */
  children: ReactNode
  /** True while more text is still arriving. */
  streaming: boolean
  /** What the agent is doing, shown while it streams. */
  label?: string
  /** When given, a button under the text stops the answer. */
  onStop?: () => void
  stopLabel?: string
}

const OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * An answer that is still being written: the text so far with a caret at its
 * end, a line that says the agent is working, and a way to stop it. Screen
 * readers are told once that it is busy, not read every word as it lands.
 */
export function Stream({ children, streaming, label = "Writing", onStop, stopLabel = "Stop" }: StreamProps) {
  return (
    <div className="flex flex-col gap-sp-md">
      <div aria-busy={streaming} className="text-body text-foreground">
        {children}
        {streaming && (
          <span
            aria-hidden="true"
            className="ml-sp-xs inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-foreground motion-reduce:animate-none"
          />
        )}
      </div>
      <div role="status" className="flex min-h-10 flex-wrap items-center gap-sp-md">
        {streaming && (
          <>
            <span className="flex items-center gap-sp-sm type-label text-muted-foreground">
              <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin motion-reduce:animate-none" />
              {label}
            </span>
            {onStop !== undefined && (
              <button
                type="button"
                onClick={onStop}
                className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-background px-sp-md py-sp-sm type-label text-foreground hover:bg-muted ${OUTLINE}`}
              >
                {stopLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
