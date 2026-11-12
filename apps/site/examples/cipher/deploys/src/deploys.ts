export type Environment = "production" | "preview"
export type DeployState = "ready" | "building" | "queued" | "failed" | "canceled"

export type Deployment = {
  hash: string
  message: string
  branch: string
  environment: Environment
  state: DeployState
  /** Seconds the deployment ran; null when it has not started or finished. */
  duration: number | null
  /** Local time, "YYYY-MM-DDTHH:MM". */
  created: string
  /** Why a failed deployment failed: the text after "error". */
  error?: string
}

type LogLine = { dateTime: string; time: string; kind?: "ready" | "error" | "failed"; text: string }

function d(
  hash: string,
  message: string,
  branch: string,
  state: DeployState,
  duration: number | null,
  created: string,
  error?: string
): Deployment {
  return {
    hash,
    message,
    branch,
    environment: branch === "main" ? "production" : "preview",
    state,
    duration,
    created,
    error,
  }
}

// Newest first. The sample's today is 11 Nov 2026.
export const deployments: Deployment[] = [
  d("a1d4e90", "Add a rate limit to the search API", "main", "queued", null, "2026-11-11T14:05"),
  d("7c2e5b3", "Highlight matched terms in search results", "feat/search", "building", null, "2026-11-11T13:52"),
  d("8f3c2a1", "Round cart totals after applying discounts", "main", "ready", 168, "2026-11-11T11:20"),
  d("e94b0d7", "Round cart totals after applying discounts", "fix/cart-total", "ready", 66, "2026-11-11T10:47"),
  d("3b8f1c6", "Apply discounts before tax in the cart total", "fix/cart-total", "failed", 52, "2026-11-11T09:31",
    "src/cart/total.ts(41,18): TS2345: Argument of type 'string' is not assignable to parameter of type 'number'."),
  d("d07a9e2", "Bump vite and react to their latest releases", "chore/deps", "ready", 192, "2026-11-10T18:14"),
  d("5e61c3f", "Show stock levels on product pages", "main", "ready", 151, "2026-11-10T16:40"),
  d("b2f9d48", "Debounce typing in the search box", "feat/search", "canceled", 74, "2026-11-10T15:02"),
  d("9a3e7f1", "Add search suggestions under the box", "feat/search", "ready", 82, "2026-11-10T13:25"),
  d("c6d1b05", "Cache category pages for five minutes", "main", "ready", 125, "2026-11-10T11:08"),
  d("f4a8e23", "Drop the legacy icon package", "chore/deps", "failed", 41, "2026-11-10T09:46",
    'Rollup failed to resolve import "@orrin/icons/legacy" from "src/components/nav.tsx".'),
  d("1e7c9b4", "Index product names for search", "feat/search", "ready", 78, "2026-11-09T19:33"),
  d("6b0f2d8", "Fix the footer links on small screens", "main", "ready", 164, "2026-11-09T17:12"),
  d("0d5a3e7", "Update lockfile for security patches", "chore/deps", "ready", 38, "2026-11-09T15:55"),
  d("a8c4f61", "Add an empty state to search results", "feat/search", "ready", 69, "2026-11-09T14:20"),
  d("4f2b8e9", "Send order emails from the queue", "main", "ready", 137, "2026-11-09T12:41"),
  d("e3d7a52", "Add a test for totals with free shipping", "fix/cart-total", "ready", 58, "2026-11-09T11:03"),
  d("72b9c0e", "Move checkout copy into one file", "main", "ready", 159, "2026-11-09T10:15"),
  d("b5e1f37", "Sketch the search results page", "feat/search", "ready", 91, "2026-11-09T09:22"),
  d("2c8d6a4", "Serve product images as AVIF", "main", "ready", 172, "2026-11-09T08:40"),
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2026-11-11T14:05" → "11 Nov 2026, 14:05" */
export function formatCreated(created: string) {
  const [date, time] = created.split("T")
  const [y, m, day] = date.split("-").map(Number)
  return `${day} ${months[m - 1]} ${y}, ${time}`
}

/** 38 → "38s", 192 → "3m 12s" */
export function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${String(s).padStart(2, "0")}s`
}

function at(created: string, offset: number) {
  const [date, time] = created.split("T")
  const [h, min] = time.split(":").map(Number)
  const total = h * 3600 + min * 60 + Math.round(offset)
  const pad = (n: number) => String(n).padStart(2, "0")
  const t = `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
  return { dateTime: `${date}T${t}`, time: t }
}

export function addressOf(dep: Deployment) {
  return dep.environment === "production"
    ? "https://orrin-web.plinth.example"
    : `https://orrin-web-${dep.hash}.plinth.example`
}

export function logOf(dep: Deployment): LogLine[] {
  const line = (offset: number, text: string, kind?: LogLine["kind"]): LogLine => ({
    ...at(dep.created, offset),
    text,
    kind,
  })

  if (dep.state === "queued") return [line(0, "queued behind 1 deployment")]

  const start = [
    line(0, `cloning orrin/orrin-web at ${dep.hash} (${dep.branch})`),
    line(2, "cloned 1,412 files in 2s"),
    line(3, "installing dependencies with npm ci"),
  ]

  if (dep.state === "building") {
    return [
      ...start,
      line(29, "added 812 packages from the cache"),
      line(30, "building with tsc -b && vite build"),
      line(47, "type-checked 214 files"),
      line(48, "vite v7.2.0 building for production"),
      line(71, "transformed 1,104 modules"),
    ]
  }

  if (dep.state === "canceled") {
    return [
      ...start,
      line(29, "added 812 packages from the cache"),
      line(30, "building with tsc -b && vite build"),
      line(47, "type-checked 214 files"),
      line(48, "vite v7.2.0 building for production"),
      line(dep.duration ?? 0, "canceled by mara.lind"),
    ]
  }

  const total = dep.duration ?? 0

  if (dep.state === "failed") {
    return [
      ...start,
      line(total * 0.45, "added 812 packages from the cache"),
      line(total * 0.47, "building with tsc -b && vite build"),
      line(total * 0.5, "checking types in 214 files"),
      line(total * 0.98, dep.error ?? "", "error"),
      line(total, "build exited with code 1", "failed"),
    ]
  }

  return [
    ...start,
    line(total * 0.3, "added 812 packages from the cache"),
    line(total * 0.31, "building with tsc -b && vite build"),
    line(total * 0.5, "type-checked 214 files"),
    line(total * 0.78, "transformed 1,284 modules"),
    line(total * 0.82, "wrote 412 files to dist/ (3.8 MB)"),
    line(total * 0.84, `uploading 412 files to ${dep.environment}`),
    line(total, `${addressOf(dep)} in ${formatDuration(total)}`, "ready"),
  ]
}
