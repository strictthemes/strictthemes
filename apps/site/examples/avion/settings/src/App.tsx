import { useEffect, useRef, useState, type FormEvent } from "react"
import { Check, CircleAlert, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_INSET =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"

const BUTTON = "px-5 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const PANEL_HEADING =
  "flex min-h-7 flex-wrap items-center justify-between gap-3"
const H2 = "font-mono text-label uppercase text-muted-foreground"
const SELECT = cn(
  "h-8 w-full rounded-lg border border-input bg-card px-2 text-body",
  FOCUS
)
const ICON = "size-4 shrink-0"

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments" },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
]
const CURRENT = "/settings"

const SECTIONS = [
  { label: "Workspace", href: "#workspace" },
  { label: "Notifications", href: "#notifications" },
  { label: "Members", href: "#members" },
  { label: "Danger zone", href: "#danger-zone" },
]

const TIME_ZONES = [
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
  { value: "Europe/Oslo", label: "Oslo (CET)" },
  { value: "Europe/Helsinki", label: "Helsinki (EET)" },
]

const ROLES = ["Owner", "Dispatcher", "Viewer"] as const
type Role = (typeof ROLES)[number]

type Member = {
  id: number
  name: string | null
  email: string
  role: Role
  lastActive: { dateTime: string; text: string } | null
  you?: boolean
}

const SIGNED_IN = "Maren Lindqvist"

const INITIAL_MEMBERS: Member[] = [
  {
    id: 1,
    name: SIGNED_IN,
    email: "maren.lindqvist@northgate.example",
    role: "Owner",
    lastActive: { dateTime: "2026-11-11T14:05", text: "11 Nov, 14:05" },
    you: true,
  },
  {
    id: 2,
    name: "Tobias Reyes",
    email: "tobias.reyes@northgate.example",
    role: "Dispatcher",
    lastActive: { dateTime: "2026-11-11T13:42", text: "11 Nov, 13:42" },
  },
  {
    id: 3,
    name: "Priya Okafor",
    email: "priya.okafor@northgate.example",
    role: "Dispatcher",
    lastActive: { dateTime: "2026-11-11T07:18", text: "11 Nov, 07:18" },
  },
  {
    id: 4,
    name: "Daniel Hartley",
    email: "daniel.hartley@northgate.example",
    role: "Viewer",
    lastActive: { dateTime: "2026-11-09T16:30", text: "9 Nov, 16:30" },
  },
  {
    id: 5,
    name: "Lena Brandt",
    email: "lena.brandt@northgate.example",
    role: "Viewer",
    lastActive: { dateTime: "2026-11-02T10:12", text: "2 Nov, 10:12" },
  },
]

const NOTIFICATIONS = [
  {
    key: "late",
    title: "Late deliveries",
    text: "Email me when a parcel misses its delivery window.",
  },
  {
    key: "failed",
    title: "Failed deliveries",
    text: "Email me when a driver cannot hand over a parcel.",
  },
  {
    key: "summary",
    title: "Daily summary",
    text: "Send a summary of the day's shipments at 18:00.",
  },
  {
    key: "members",
    title: "New members",
    text: "Email me when someone accepts an invite to this workspace.",
  },
] as const
type NotificationKey = (typeof NOTIFICATIONS)[number]["key"]
type NotificationValues = Record<NotificationKey, boolean>

type WorkspaceValues = { name: string; address: string; timeZone: string }

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function useSavedMessage() {
  const [shown, setShown] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  function show() {
    window.clearTimeout(timer.current)
    setShown(true)
    timer.current = window.setTimeout(() => setShown(false), 4000)
  }
  return [shown, show] as const
}

function SavedStatus({ shown }: { shown: boolean }) {
  return (
    <div role="status">
      {shown && (
        <span className="inline-flex items-center gap-2 font-mono text-label text-success uppercase">
          <Check className={ICON} strokeWidth={1.5} aria-hidden="true" />
          Saved
        </span>
      )}
    </div>
  )
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className={ICON} strokeWidth={1.5} aria-hidden="true" />
      {children}
    </p>
  )
}

function PanelHeading({ id, children }: { id: string; children: string }) {
  return (
    <div className={PANEL_HEADING}>
      <h2 id={id} className={H2}>
        {children}
      </h2>
    </div>
  )
}

function TopBar() {
  const [open, setOpen] = useState(false)
  const linkClass = (href: string) =>
    cn(
      "font-mono text-label uppercase transition-colors duration-150",
      FOCUS,
      href === CURRENT
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    )
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
        <a
          href="/"
          className={cn(
            "font-heading text-h2 text-foreground transition-colors duration-150",
            FOCUS
          )}
        >
          Northgate
        </a>
        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === CURRENT ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <span className="ml-auto hidden font-mono text-label text-muted-foreground tabular-nums md:block">
          {SIGNED_IN}
        </span>
        <Button
          variant="outline"
          className={cn(BUTTON, "ml-auto md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t md:hidden"
      >
        <div className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={link.href === CURRENT ? "page" : undefined}
              className={cn("block py-2", linkClass(link.href))}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

function WorkspacePanel({
  saved,
  onSave,
}: {
  saved: WorkspaceValues
  onSave: (v: WorkspaceValues) => void
}) {
  const [values, setValues] = useState(saved)
  const [nameError, setNameError] = useState(false)
  const [savedShown, showSaved] = useSavedMessage()
  const nameRef = useRef<HTMLInputElement>(null)

  const dirty =
    values.name !== saved.name ||
    values.address !== saved.address ||
    values.timeZone !== saved.timeZone

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!dirty) return
    if (values.name.trim() === "") {
      setNameError(true)
      nameRef.current?.focus()
      return
    }
    onSave(values)
    showSaved()
  }

  function discard() {
    setValues(saved)
    setNameError(false)
    nameRef.current?.focus()
  }

  return (
    <section
      id="workspace"
      aria-labelledby="workspace-heading"
      className="scroll-mt-5 rounded-xl border bg-card p-5"
    >
      <PanelHeading id="workspace-heading">Workspace</PanelHeading>
      <form noValidate onSubmit={submit} className="mt-3">
        <div className="flex flex-col gap-5">
          <div className="max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="ws-name" className={LABEL}>
                Workspace name
              </label>
              <Input
                ref={nameRef}
                id="ws-name"
                required
                value={values.name}
                aria-invalid={nameError || undefined}
                aria-describedby={nameError ? "ws-name-error" : undefined}
                onChange={(e) => {
                  setValues({ ...values, name: e.target.value })
                  setNameError(false)
                }}
                className="text-body md:text-body"
              />
            </div>
            {nameError && (
              <ErrorLine id="ws-name-error">
                Enter a name for the workspace.
              </ErrorLine>
            )}
          </div>

          <div className="max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="ws-address" className={LABEL}>
                Address
              </label>
              <div className="flex items-center gap-2">
                <span
                  id="ws-address-prefix"
                  className="font-mono text-label text-muted-foreground tabular-nums"
                >
                  northgate.example/
                </span>
                <Input
                  id="ws-address"
                  value={values.address}
                  aria-describedby="ws-address-prefix ws-address-help"
                  onChange={(e) =>
                    setValues({
                      ...values,
                      address: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className="text-body md:text-body"
                />
              </div>
            </div>
            <p
              id="ws-address-help"
              className="mt-2 font-mono text-label text-muted-foreground"
            >
              Use lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div className="flex max-w-md flex-col gap-2">
            <label htmlFor="ws-timezone" className={LABEL}>
              Time zone
            </label>
            <select
              id="ws-timezone"
              value={values.timeZone}
              onChange={(e) =>
                setValues({ ...values, timeZone: e.target.value })
              }
              className={SELECT}
            >
              {TIME_ZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
          <Button
            type="submit"
            disabled={!dirty}
            focusableWhenDisabled
            className={BUTTON}
          >
            Save changes
          </Button>
          <Button
            variant="outline"
            disabled={!dirty}
            onClick={discard}
            className={BUTTON}
          >
            Discard
          </Button>
          <SavedStatus shown={savedShown} />
        </div>
      </form>
    </section>
  )
}

function NotificationsPanel() {
  const [saved, setSaved] = useState<NotificationValues>({
    late: true,
    failed: true,
    summary: false,
    members: true,
  })
  const [values, setValues] = useState(saved)
  const [savedShown, showSaved] = useSavedMessage()
  const listRef = useRef<HTMLDivElement>(null)

  const dirty = NOTIFICATIONS.some((n) => values[n.key] !== saved[n.key])

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!dirty) return
    setSaved(values)
    showSaved()
  }

  function discard() {
    setValues(saved)
    listRef.current?.querySelector<HTMLElement>('[role="switch"]')?.focus()
  }

  return (
    <section
      id="notifications"
      aria-labelledby="notifications-heading"
      className="scroll-mt-5 rounded-xl border bg-card p-5"
    >
      <PanelHeading id="notifications-heading">Notifications</PanelHeading>
      <form noValidate onSubmit={submit} className="mt-3">
        <div ref={listRef}>
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.key}
              className="flex items-center justify-between gap-5 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div>
                <p
                  id={`notif-${n.key}-title`}
                  className="font-sans text-body font-medium"
                >
                  {n.title}
                </p>
                <p
                  id={`notif-${n.key}-text`}
                  className="mt-1 max-w-md text-body text-muted-foreground"
                >
                  {n.text}
                </p>
              </div>
              <Switch
                checked={values[n.key]}
                onCheckedChange={(checked) =>
                  setValues({ ...values, [n.key]: checked })
                }
                aria-labelledby={`notif-${n.key}-title`}
                aria-describedby={`notif-${n.key}-text`}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
          <Button
            type="submit"
            disabled={!dirty}
            focusableWhenDisabled
            className={BUTTON}
          >
            Save changes
          </Button>
          <Button
            variant="outline"
            disabled={!dirty}
            onClick={discard}
            className={BUTTON}
          >
            Discard
          </Button>
          <SavedStatus shown={savedShown} />
        </div>
      </form>
    </section>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function MembersPanel() {
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Viewer")
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const joined = members.filter((m) => m.lastActive).length
  const invited = members.length - joined
  const count =
    plural(joined, "member", "members") +
    (invited > 0 ? `, ${invited} invited` : "")

  function invite(e: FormEvent) {
    e.preventDefault()
    const address = email.trim()
    let message: string | null = null
    if (address === "") message = "Enter an email address to send the invite."
    else if (!EMAIL_PATTERN.test(address))
      message = "Enter a full email address, such as name@example.com."
    else if (
      members.some((m) => m.email.toLowerCase() === address.toLowerCase())
    )
      message = "This address is already in the workspace. Enter another one."
    if (message) {
      setError(message)
      setSentTo(null)
      emailRef.current?.focus()
      return
    }
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: null,
        email: address,
        role,
        lastActive: null,
      },
    ])
    setEmail("")
    setSentTo(address)
  }

  function setMemberRole(id: number, next: Role) {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: next } : m)))
  }

  return (
    <section
      id="members"
      aria-labelledby="members-heading"
      className="scroll-mt-5 overflow-hidden rounded-xl border bg-card"
    >
      <div className="border-b px-5 pt-5 pb-3">
        <div className={PANEL_HEADING}>
          <h2 id="members-heading" className={H2}>
            Members
          </h2>
          <span className="font-mono text-label text-muted-foreground tabular-nums">
            {count}
          </span>
        </div>
      </div>

      <Table label="Members" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={cn("px-5", LABEL)}>Name</TableHead>
            <TableHead className={cn("px-5", LABEL)}>Email</TableHead>
            <TableHead className={cn("px-5", LABEL)}>Role</TableHead>
            <TableHead className={cn("px-5 text-right", LABEL)}>
              Last active
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="px-5 py-2">
                {m.name ? (
                  <>
                    {m.name}
                    {m.you && (
                      <span className="ml-2 font-mono text-label text-muted-foreground uppercase">
                        You
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">–</span>
                    <span className="sr-only">No name yet</span>
                  </>
                )}
              </TableCell>
              <TableCell className="px-5 py-2">{m.email}</TableCell>
              <TableCell className="px-5 py-2">
                {m.you ? (
                  m.role
                ) : (
                  <div className="w-32">
                    <select
                      aria-label={`Role of ${m.name ?? m.email}`}
                      value={m.role}
                      onChange={(e) =>
                        setMemberRole(m.id, e.target.value as Role)
                      }
                      className={SELECT}
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}
              </TableCell>
              <TableCell className="px-5 py-2 text-right">
                {m.lastActive ? (
                  <time
                    dateTime={m.lastActive.dateTime}
                    className="font-mono tabular-nums"
                  >
                    {m.lastActive.text}
                  </time>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full bg-muted-foreground"
                    />
                    <span className="text-body text-foreground">Invited</span>
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t px-5 py-5">
        <form noValidate onSubmit={invite}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex w-full flex-col gap-2 md:w-64">
              <label htmlFor="invite-email" className={LABEL}>
                Invite by email
              </label>
              <Input
                ref={emailRef}
                id="invite-email"
                type="email"
                autoComplete="off"
                value={email}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "invite-error" : undefined}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                  setSentTo(null)
                }}
                className="text-body md:text-body"
              />
            </div>
            <div className="flex w-32 flex-col gap-2">
              <label htmlFor="invite-role" className={LABEL}>
                Role
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className={SELECT}
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="secondary" className={BUTTON}>
              Send invite
            </Button>
          </div>
          {error && <ErrorLine id="invite-error">{error}</ErrorLine>}
          <div role="status" className={cn(sentTo && "mt-2")}>
            {sentTo && (
              <p className="flex items-center gap-2 text-body">
                <Check
                  className={cn(ICON, "text-success")}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>Invite sent to {sentTo}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function DangerZonePanel({ workspaceName }: { workspaceName: string }) {
  const [confirmName, setConfirmName] = useState("")
  const [deleted, setDeleted] = useState(false)
  const statusRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (deleted) statusRef.current?.focus()
  }, [deleted])

  return (
    <section
      id="danger-zone"
      aria-labelledby="danger-heading"
      className="flex-1 scroll-mt-5 rounded-xl border bg-card p-5"
    >
      <PanelHeading id="danger-heading">Danger zone</PanelHeading>
      <div className="mt-3">
        {!deleted && (
          <div>
            <h3 className="font-sans text-body font-medium">
              Delete this workspace
            </h3>
            <p className="mt-1 max-w-md">
              Deleting {workspaceName} removes its shipment history, depots,
              reports and every member's access. This cannot be undone. To go
              on, type the workspace's name below.
            </p>
            <div className="mt-5 flex max-w-md flex-col gap-2">
              <label htmlFor="confirm-name" className={LABEL}>
                Confirm workspace name
              </label>
              <Input
                id="confirm-name"
                autoComplete="off"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="text-body md:text-body"
              />
            </div>
            <Button
              variant="destructive"
              disabled={confirmName !== workspaceName}
              onClick={() => setDeleted(true)}
              className={cn(BUTTON, "mt-3 hover:text-foreground")}
            >
              <TriangleAlert strokeWidth={1.5} aria-hidden="true" />
              Delete workspace
            </Button>
          </div>
        )}
        <p
          ref={statusRef}
          role="status"
          tabIndex={deleted ? -1 : undefined}
          className={FOCUS_CODE}
        >
          {deleted ? "This is where the workspace would be deleted." : ""}
        </p>
      </div>
    </section>
  )
}

export function App() {
  const [workspace, setWorkspace] = useState<WorkspaceValues>({
    name: "Northgate North",
    address: "northgate-north",
    timeZone: "Europe/London",
  })

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <TopBar />
      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-5 px-3 py-5 md:grid-cols-12 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-12">
          <h1 className="text-h1">Settings</h1>
        </div>

        <nav
          aria-label="Settings sections"
          className="overflow-hidden rounded-xl border bg-card md:col-span-12 lg:sticky lg:top-5 lg:col-span-3 lg:self-start"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className={cn(
                "block border-t px-5 py-2 text-body text-foreground underline-offset-4 transition-colors duration-150 first:border-t-0 hover:underline",
                FOCUS_INSET
              )}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex min-w-0 flex-col gap-5 md:col-span-12 lg:col-span-9">
          <WorkspacePanel saved={workspace} onSave={setWorkspace} />
          <NotificationsPanel />
          <MembersPanel />
          <DangerZonePanel workspaceName={workspace.name} />
        </div>
      </main>
    </div>
  )
}

export default App
