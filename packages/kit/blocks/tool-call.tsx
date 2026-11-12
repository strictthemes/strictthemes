import { Collapsible } from "@base-ui/react/collapsible"
import { Check, ChevronDown, LoaderCircle, X } from "lucide-react"

export type ToolCallStatus = "running" | "done" | "failed"

export interface ToolCallProps {
  /** The tool's name as the agent calls it, such as `search_orders`. */
  name: string
  status: ToolCallStatus
  /** One line on what the call is for, in the reader's words. */
  summary?: string
  /** What was sent to the tool, usually JSON. */
  input?: string
  /** What came back. */
  output?: string
  /** Why the call failed, when it did. */
  error?: string
  /** How long the call took, already formatted: "1.2 s". */
  duration?: string
  /** Show the details from the start. */
  defaultOpen?: boolean
}

const STATUS = {
  running: { label: "Running", Icon: LoaderCircle },
  done: { label: "Done", Icon: Check },
  failed: { label: "Failed", Icon: X },
} as const

const OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"

/** A block of text that may be wider than the card: it scrolls inside its own box. */
function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-sp-sm border-t border-border p-sp-md">
      <p className="type-label text-muted-foreground">{label}</p>
      <pre
        tabIndex={0}
        role="region"
        aria-label={label}
        className={`overflow-x-auto rounded-lg bg-muted p-sp-md font-mono text-label text-foreground ${OUTLINE}`}
      >
        {text}
      </pre>
    </div>
  )
}

/**
 * One call an agent made to a tool: what it called, whether it is still
 * running, and, on demand, what went in and what came back.
 */
export function ToolCall({ name, status, summary, input, output, error, duration, defaultOpen = false }: ToolCallProps) {
  const { label, Icon } = STATUS[status]
  const details = input !== undefined || output !== undefined || error !== undefined
  const head = (
    <>
      <Icon
        aria-hidden="true"
        className={`size-4 shrink-0 ${status === "running" ? "animate-spin motion-reduce:animate-none" : ""}`}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-sp-xs">
        <span className="truncate font-mono text-label text-foreground">{name}</span>
        {summary !== undefined && <span className="text-body text-muted-foreground">{summary}</span>}
      </span>
      <span className="shrink-0 type-label text-muted-foreground">
        {label}
        {duration !== undefined && ` · ${duration}`}
      </span>
    </>
  )
  const row = "flex w-full items-center gap-sp-md p-sp-md text-left"

  if (!details) {
    return <div className={`overflow-hidden rounded-lg border border-border bg-card text-card-foreground ${row}`}>{head}</div>
  }
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground"
    >
      <Collapsible.Trigger className={`group ${row} hover:bg-muted ${OUTLINE}`}>
        {head}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-[panel-open]:rotate-180 motion-reduce:transition-none"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel>
        {input !== undefined && <Detail label="Input" text={input} />}
        {output !== undefined && <Detail label="Output" text={output} />}
        {error !== undefined && <Detail label="Error" text={error} />}
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}
