import { Check, ShieldQuestion, X } from "lucide-react"
import { useId } from "react"

export type ApprovalState = "pending" | "allowed" | "denied"

export interface ApprovalProps {
  /** What the agent wants to do, in plain words: "Run a shell command". */
  title: string
  /** Why it asks, or what the action will change. */
  description?: string
  /** The exact thing that will run or be sent, shown as code. */
  detail?: string
  /** Where the request stands. The buttons show only while it is pending. */
  state?: ApprovalState
  onAllow?: () => void
  onDeny?: () => void
  /** When given, a third button allows this and every later request like it. */
  onAllowAlways?: () => void
  allowLabel?: string
  allowAlwaysLabel?: string
  denyLabel?: string
}

const OUTLINE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const BUTTON = `inline-flex min-h-10 items-center justify-center rounded-lg px-sp-md py-sp-sm type-label ${OUTLINE}`
// On hover the main button takes the text color as its fill. A lighter primary would lose contrast
// in a theme that holds text to WCAG AAA; the page's own text and background never do.
const MAIN = `${BUTTON} bg-primary text-primary-foreground hover:bg-foreground hover:text-background`
const OTHER = `${BUTTON} border border-border bg-background text-foreground hover:bg-muted`

/**
 * A request from an agent to do something it may not do on its own. It says
 * what will happen before it happens, and the answer stays on screen after.
 */
export function Approval({
  title,
  description,
  detail,
  state = "pending",
  onAllow,
  onDeny,
  onAllowAlways,
  allowLabel = "Allow once",
  allowAlwaysLabel = "Always allow",
  denyLabel = "Deny",
}: ApprovalProps) {
  const heading = useId()
  return (
    <section
      aria-labelledby={heading}
      className="flex flex-col gap-sp-md rounded-lg border border-border bg-card p-sp-md text-card-foreground"
    >
      <div className="flex items-start gap-sp-md">
        <ShieldQuestion aria-hidden="true" className="mt-sp-xs size-4 shrink-0" />
        <div className="flex min-w-0 flex-col gap-sp-xs">
          <h3 id={heading} className="text-body text-foreground">
            {title}
          </h3>
          {description !== undefined && <p className="text-body text-muted-foreground">{description}</p>}
        </div>
      </div>
      {detail !== undefined && (
        <pre
          tabIndex={0}
          role="region"
          aria-label="What will run"
          className={`overflow-x-auto rounded-lg bg-muted p-sp-md font-mono text-label text-foreground ${OUTLINE}`}
        >
          {detail}
        </pre>
      )}
      {state === "pending" ? (
        <div className="flex flex-wrap gap-sp-sm">
          <button type="button" onClick={onAllow} className={MAIN}>
            {allowLabel}
          </button>
          {onAllowAlways !== undefined && (
            <button type="button" onClick={onAllowAlways} className={OTHER}>
              {allowAlwaysLabel}
            </button>
          )}
          <button type="button" onClick={onDeny} className={OTHER}>
            {denyLabel}
          </button>
        </div>
      ) : (
        <p role="status" className="flex items-center gap-sp-sm type-label text-muted-foreground">
          {state === "allowed" ? (
            <Check aria-hidden="true" className="size-4 shrink-0" />
          ) : (
            <X aria-hidden="true" className="size-4 shrink-0" />
          )}
          {state === "allowed" ? "Allowed" : "Denied"}
        </p>
      )}
    </section>
  )
}
