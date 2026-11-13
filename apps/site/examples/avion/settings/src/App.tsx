import * as React from "react"
import { Check, CircleAlert, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
const BUTTON = "px-5 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const SMALL = "font-mono text-label tabular-nums text-muted-foreground"
const PANEL = "rounded-xl border bg-card p-5"
const HEADING_ROW = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const PANEL_H2 = "font-mono text-label uppercase text-muted-foreground"

const SIGNED_IN = "Marta Lindqvist"

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Shipments", href: "/shipments" },
  { label: "Depots", href: "/depots" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
]
const CURRENT = "/settings"

const SECTIONS = [
  { id: "workspace", label: "Workspace" },
  { id: "notifications", label: "Notifications" },
  { id: "members", label: "Members" },
  { id: "danger-zone", label: "Danger zone" },
]

const TIME_ZONES = [
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Lisbon", label: "Lisbon (WET/WEST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Europe/Helsinki", label: "Helsinki (EET/EEST)" },
]

type Role = "owner" | "dispatcher" | "viewer"
const ROLES: { value: Role; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "viewer", label: "Viewer" },
]
const roleLabel = (role: Role) =>
  ROLES.find((r) => r.value === role)?.label ?? role

type Member = {
  id: string
  name: string | null
  email: string
  role: Role
  lastActive: { dateTime: string; text: string } | null
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Marta Lindqvist",
    email: "marta.lindqvist@northgate.example",
    role: "owner",
    lastActive: { dateTime: "2026-11-13T09:42", text: "13 Nov, 09:42" },
  },
  {
    id: "m2",
    name: "Tobias Reyes",
    email: "tobias.reyes@northgate.example",
    role: "dispatcher",
    lastActive: { dateTime: "2026-11-13T08:15", text: "13 Nov, 08:15" },
  },
  {
    id: "m3",
    name: "Priya Raman",
    email: "priya.raman@northgate.example",
    role: "dispatcher",
    lastActive: { dateTime: "2026-11-12T17:58", text: "12 Nov, 17:58" },
  },
  {
    id: "m4",
    name: "Owen Fairclough",
    email: "owen.fairclough@northgate.example",
    role: "viewer",
    lastActive: { dateTime: "2026-11-10T11:30", text: "10 Nov, 11:30" },
  },
  {
    id: "m5",
    name: "Hana Kowalczyk",
    email: "hana.kowalczyk@northgate.example",
    role: "viewer",
    lastActive: { dateTime: "2026-11-04T14:05", text: "4 Nov, 14:05" },
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
    text: "Send one email at 07:00 with yesterday's numbers per depot.",
  },
  {
    key: "members",
    title: "New members",
    text: "Email me when someone joins this workspace.",
  },
] as const
type NotificationKey = (typeof NOTIFICATIONS)[number]["key"]
type NotificationValues = Record<NotificationKey, boolean>

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

/** Shows a message for four seconds. */
function useFlash() {
  const [shown, setShown] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const flash = React.useCallback(() => {
    window.clearTimeout(timer.current)
    setShown(true)
    timer.current = window.setTimeout(() => setShown(false), 4000)
  }, [])
  return [shown, flash] as const
}

function ErrorLine({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 shrink-0"
      />
      {children}
    </p>
  )
}

function SavedStatus({ shown }: { shown: boolean }) {
  return (
    <div role="status">
      {shown && (
        <span className="inline-flex items-center gap-2 font-mono text-label text-success uppercase">
          <Check aria-hidden="true" strokeWidth={1.5} className="size-4" />
          Saved
        </span>
      )}
    </div>
  )
}

function ButtonRow({
  dirty,
  onDiscard,
  saved,
}: {
  dirty: boolean
  onDiscard: () => void
  saved: boolean
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
      <Button
        type="submit"
        className={BUTTON}
        disabled={!dirty}
        focusableWhenDisabled
      >
        Save changes
      </Button>
      <Button
        variant="outline"
        className={BUTTON}
        disabled={!dirty}
        onClick={onDiscard}
      >
        Discard
      </Button>
      <SavedStatus shown={saved} />
    </div>
  )
}

function TopBar() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open || event.key !== "Escape") return
    setOpen(false)
    menuButton.current?.focus()
  }

  const link = (href: string) =>
    cn(
      "transition-colors duration-150",
      FOCUS,
      href === CURRENT
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    )

  return (
    <header className="border-b bg-card" onKeyDown={onKeyDown}>
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
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-5 font-mono text-label uppercase">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.href === CURRENT ? "page" : undefined}
                  className={link(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className={cn("ml-auto hidden md:block", SMALL)}>
          {SIGNED_IN}
        </span>
        <Button
          ref={menuButton}
          variant="outline"
          className={cn("ml-auto md:hidden", BUTTON)}
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </Button>
      </div>
      <nav
        id="main-menu"
        aria-label="Main"
        hidden={!open}
        className="border-t md:hidden"
      >
        <ul className="mx-auto max-w-[1280px] px-3 py-2 font-mono text-label uppercase">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.href === CURRENT ? "page" : undefined}
                className={cn("block py-2", link(item.href))}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

type WorkspaceValues = { name: string; address: string; timeZone: string }

function WorkspacePanel({
  saved,
  onSave,
}: {
  saved: WorkspaceValues
  onSave: (values: WorkspaceValues) => void
}) {
  const [draft, setDraft] = React.useState(saved)
  const [nameError, setNameError] = React.useState(false)
  const [savedShown, flashSaved] = useFlash()
  const nameRef = React.useRef<HTMLInputElement>(null)

  const trimmed = {
    name: draft.name.trim(),
    address: draft.address.trim(),
    timeZone: draft.timeZone,
  }
  const dirty =
    trimmed.name !== saved.name ||
    trimmed.address !== saved.address ||
    trimmed.timeZone !== saved.timeZone

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!dirty) return
    if (!trimmed.name) {
      setNameError(true)
      nameRef.current?.focus()
      return
    }
    onSave(trimmed)
    flashSaved()
  }

  const onDiscard = () => {
    setDraft(saved)
    setNameError(false)
    nameRef.current?.focus()
  }

  return (
    <section
      id="workspace"
      aria-labelledby="workspace-heading"
      className={cn("scroll-mt-5", PANEL)}
    >
      <div className={HEADING_ROW}>
        <h2 id="workspace-heading" className={PANEL_H2}>
          Workspace
        </h2>
      </div>
      <form noValidate onSubmit={onSubmit} className="mt-3">
        <div className="flex flex-col gap-5">
          <div className="max-w-md">
            <label htmlFor="ws-name" className={cn("block", LABEL)}>
              Workspace name
            </label>
            <Input
              ref={nameRef}
              id="ws-name"
              required
              value={draft.name}
              aria-invalid={nameError || undefined}
              aria-describedby={nameError ? "ws-name-error" : undefined}
              onChange={(e) => {
                setDraft({ ...draft, name: e.target.value })
                setNameError(false)
              }}
              className="mt-2 px-2 text-body md:text-body"
            />
            {nameError && (
              <ErrorLine id="ws-name-error">
                Enter a name for the workspace.
              </ErrorLine>
            )}
          </div>

          <div className="max-w-md">
            <label htmlFor="ws-address" className={cn("block", LABEL)}>
              Address
            </label>
            <div className="mt-2 flex items-center gap-2">
              <span
                id="ws-address-prefix"
                className={cn("wrap-break-word", SMALL)}
              >
                northgate.example/
              </span>
              <Input
                id="ws-address"
                value={draft.address}
                aria-describedby="ws-address-prefix ws-address-help"
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    address: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                className="min-w-0 flex-1 px-2 text-body md:text-body"
              />
            </div>
            <p
              id="ws-address-help"
              className="mt-2 font-mono text-label text-muted-foreground"
            >
              Use lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div className="max-w-md">
            <label
              id="ws-tz-label"
              htmlFor="ws-tz"
              className={cn("block", LABEL)}
            >
              Time zone
            </label>
            <div className="mt-2">
              <Select
                items={TIME_ZONES}
                value={draft.timeZone}
                onValueChange={(value) => {
                  if (value !== null) setDraft({ ...draft, timeZone: value })
                }}
              >
                <SelectTrigger id="ws-tz" aria-labelledby="ws-tz-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_ZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <ButtonRow dirty={dirty} onDiscard={onDiscard} saved={savedShown} />
      </form>
    </section>
  )
}

const INITIAL_NOTIFICATIONS: NotificationValues = {
  late: true,
  failed: true,
  summary: false,
  members: true,
}

function NotificationsPanel() {
  const [saved, setSaved] = React.useState(INITIAL_NOTIFICATIONS)
  const [draft, setDraft] = React.useState(INITIAL_NOTIFICATIONS)
  const [savedShown, flashSaved] = useFlash()
  const firstSwitch = React.useRef<HTMLElement>(null)

  const dirty = NOTIFICATIONS.some((n) => draft[n.key] !== saved[n.key])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!dirty) return
    setSaved(draft)
    flashSaved()
  }

  const onDiscard = () => {
    setDraft(saved)
    firstSwitch.current?.focus()
  }

  return (
    <section
      id="notifications"
      aria-labelledby="notifications-heading"
      className={cn("scroll-mt-5", PANEL)}
    >
      <div className={HEADING_ROW}>
        <h2 id="notifications-heading" className={PANEL_H2}>
          Notifications
        </h2>
      </div>
      <form noValidate onSubmit={onSubmit} className="mt-3">
        <ul>
          {NOTIFICATIONS.map((n, i) => (
            <li
              key={n.key}
              className="flex items-center justify-between gap-5 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p
                  id={`nt-${n.key}-title`}
                  className="font-sans text-body font-medium"
                >
                  {n.title}
                </p>
                <p
                  id={`nt-${n.key}-text`}
                  className="mt-1 max-w-md text-body text-muted-foreground"
                >
                  {n.text}
                </p>
              </div>
              <Switch
                ref={i === 0 ? firstSwitch : undefined}
                checked={draft[n.key]}
                onCheckedChange={(checked) =>
                  setDraft({ ...draft, [n.key]: checked })
                }
                aria-labelledby={`nt-${n.key}-title`}
                aria-describedby={`nt-${n.key}-text`}
              />
            </li>
          ))}
        </ul>
        <ButtonRow dirty={dirty} onDiscard={onDiscard} saved={savedShown} />
      </form>
    </section>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function MembersPanel() {
  const [members, setMembers] = React.useState(INITIAL_MEMBERS)
  const [email, setEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<Role>("viewer")
  const [error, setError] = React.useState<string | null>(null)
  const [sentTo, setSentTo] = React.useState<string | null>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)

  const invited = members.filter((m) => m.lastActive === null).length
  const active = members.length - invited
  const count =
    plural(active, "member", "members") +
    (invited > 0 ? `, ${invited} invited` : "")

  const setRole = (id: string, role: Role) =>
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)))

  const onInvite = (event: React.FormEvent) => {
    event.preventDefault()
    const value = email.trim()
    let message: string | null = null
    if (!value) message = "Enter an email address."
    else if (!EMAIL_PATTERN.test(value))
      message = "Enter an email address such as name@example.com."
    else if (members.some((m) => m.email.toLowerCase() === value.toLowerCase()))
      message = "This address is already in the members table."
    if (message) {
      setError(message)
      setSentTo(null)
      emailRef.current?.focus()
      return
    }
    setMembers((list) => [
      ...list,
      {
        id: `invite-${list.length + 1}`,
        name: null,
        email: value,
        role: inviteRole,
        lastActive: null,
      },
    ])
    setEmail("")
    setError(null)
    setSentTo(value)
  }

  return (
    <section
      id="members"
      aria-labelledby="members-heading"
      className="scroll-mt-5 overflow-hidden rounded-xl border bg-card"
    >
      <div className="border-b px-5 pt-5 pb-3">
        <div className={HEADING_ROW}>
          <h2 id="members-heading" className={PANEL_H2}>
            Members
          </h2>
          <span className={SMALL}>{count}</span>
        </div>
      </div>
      <Table label="Members" className="text-body">
        <TableHeader>
          <TableRow>
            {["Name", "Email", "Role"].map((h) => (
              <TableHead key={h} className={cn("px-5", LABEL)}>
                {h}
              </TableHead>
            ))}
            <TableHead className={cn("px-5 text-right", LABEL)}>
              Last active
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => {
            const isSelf = m.name === SIGNED_IN
            return (
              <TableRow key={m.id}>
                <TableCell className="px-5 py-2">
                  {m.name ? (
                    <>
                      {m.name}
                      {isSelf && (
                        <span className="ml-2 font-mono text-label text-muted-foreground uppercase">
                          You
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">No name yet</span>
                    </>
                  )}
                </TableCell>
                <TableCell className="px-5 py-2 wrap-break-word">
                  {m.email}
                </TableCell>
                <TableCell className="px-5 py-2">
                  {isSelf ? (
                    roleLabel(m.role)
                  ) : (
                    <div className="w-32">
                      <Select
                        items={ROLES}
                        value={m.role}
                        onValueChange={(value) => {
                          if (value !== null) setRole(m.id, value)
                        }}
                      >
                        <SelectTrigger
                          aria-label={`Role of ${m.name ?? m.email}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            )
          })}
        </TableBody>
      </Table>
      <div className="border-t px-5 py-5">
        <form noValidate onSubmit={onInvite}>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full md:w-64">
              <label htmlFor="invite-email" className={cn("block", LABEL)}>
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
                className="mt-2 px-2 text-body md:text-body"
              />
            </div>
            <div className="w-32">
              <label
                id="invite-role-label"
                htmlFor="invite-role"
                className={cn("block", LABEL)}
              >
                Role
              </label>
              <div className="mt-2">
                <Select
                  items={ROLES}
                  value={inviteRole}
                  onValueChange={(value) => {
                    if (value !== null) setInviteRole(value)
                  }}
                >
                  <SelectTrigger
                    id="invite-role"
                    aria-labelledby="invite-role-label"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" variant="secondary" className={BUTTON}>
              Send invite
            </Button>
          </div>
          {error && <ErrorLine id="invite-error">{error}</ErrorLine>}
          <div role="status">
            {sentTo && (
              <p className="mt-2 flex items-start gap-2 text-body wrap-break-word">
                <Check
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-1 size-4 shrink-0 text-success"
                />
                <span className="min-w-0">Invite sent to {sentTo}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function DangerZonePanel({ workspaceName }: { workspaceName: string }) {
  const [confirm, setConfirm] = React.useState("")
  const [deleted, setDeleted] = React.useState(false)
  const statusRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (deleted) statusRef.current?.focus()
  }, [deleted])

  const matches = confirm.trim() === workspaceName

  return (
    <section
      id="danger-zone"
      aria-labelledby="danger-heading"
      className={cn("scroll-mt-5", PANEL)}
    >
      <div className={HEADING_ROW}>
        <h2 id="danger-heading" className={PANEL_H2}>
          Danger zone
        </h2>
      </div>
      <div className="mt-3">
        {!deleted && (
          <div>
            <h3 className="font-sans text-body font-medium">
              Delete this workspace
            </h3>
            <p className="mt-1 max-w-md text-body wrap-break-word">
              Deleting {workspaceName} removes its shipments, depots, reports
              and members for everyone in it. This cannot be undone. To go on,
              type the workspace's name below.
            </p>
            <div className="mt-5 max-w-md">
              <label htmlFor="delete-confirm" className={cn("block", LABEL)}>
                Confirm workspace name
              </label>
              <Input
                id="delete-confirm"
                autoComplete="off"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 px-2 text-body md:text-body"
              />
            </div>
            <div className="mt-3">
              <Button
                variant="destructive"
                className={cn(BUTTON, "hover:text-foreground")}
                disabled={!matches}
                onClick={() => setDeleted(true)}
              >
                <TriangleAlert
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4"
                />
                Delete workspace
              </Button>
            </div>
          </div>
        )}
        <div
          ref={statusRef}
          role="status"
          tabIndex={deleted ? -1 : undefined}
          className="text-body focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:outline-solid"
        >
          {deleted ? "This is where the workspace would be deleted." : ""}
        </div>
      </div>
    </section>
  )
}

export function App() {
  const [workspace, setWorkspace] = React.useState<WorkspaceValues>({
    name: "Northgate North",
    address: "north",
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
              key={s.id}
              href={`#${s.id}`}
              className="block border-t px-5 py-2 text-body text-foreground underline-offset-4 transition-colors duration-150 first:border-t-0 hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
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
