import * as React from "react"
import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react"

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

const FOCUS =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const FOCUS_INSET =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const FOCUS_CODE =
  "focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const BUTTON = "px-5 font-mono text-label uppercase"
const PANEL = "scroll-mt-5 rounded-xl border bg-card p-5"
const HEADING_ROW = "flex min-h-7 flex-wrap items-center justify-between gap-3"
const HEADING = "font-mono text-label uppercase text-muted-foreground"

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
  { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
  { value: "Europe/Stockholm", label: "Stockholm (CET/CEST)" },
  { value: "Europe/Helsinki", label: "Helsinki (EET/EEST)" },
]

type Role = "owner" | "dispatcher" | "viewer"
const ROLES: { value: Role; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "viewer", label: "Viewer" },
]
const roleLabel = (role: Role) => ROLES.find((r) => r.value === role)!.label

type Member = {
  id: string
  name: string | null
  email: string
  role: Role
  lastActive: { iso: string; text: string } | null
  self?: boolean
}

const SIGNED_IN = "Mara Lindqvist"

const INITIAL_MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Mara Lindqvist",
    email: "mara.lindqvist@northgate.example",
    role: "owner",
    lastActive: { iso: "2026-11-13T09:42", text: "13 Nov, 09:42" },
    self: true,
  },
  {
    id: "m2",
    name: "Tobias Reyes",
    email: "tobias.reyes@northgate.example",
    role: "dispatcher",
    lastActive: { iso: "2026-11-13T08:17", text: "13 Nov, 08:17" },
  },
  {
    id: "m3",
    name: "Priya Halvorsen",
    email: "priya.halvorsen@northgate.example",
    role: "dispatcher",
    lastActive: { iso: "2026-11-12T17:55", text: "12 Nov, 17:55" },
  },
  {
    id: "m4",
    name: "Owen Achterberg",
    email: "owen.achterberg@northgate.example",
    role: "viewer",
    lastActive: { iso: "2026-11-10T11:03", text: "10 Nov, 11:03" },
  },
  {
    id: "m5",
    name: "Lena Okoro",
    email: "lena.okoro@northgate.example",
    role: "viewer",
    lastActive: { iso: "2026-11-04T14:26", text: "4 Nov, 14:26" },
  },
]

type WorkspaceValues = { name: string; address: string; timeZone: string }
type NotificationKey = "late" | "failed" | "summary" | "members"
type NotificationValues = Record<NotificationKey, boolean>

const NOTIFICATIONS: { key: NotificationKey; title: string; text: string }[] = [
  {
    key: "late",
    title: "Late deliveries",
    text: "Email me when a parcel misses its delivery window by more than an hour.",
  },
  {
    key: "failed",
    title: "Failed deliveries",
    text: "Email me when a driver marks a parcel as not delivered.",
  },
  {
    key: "summary",
    title: "Daily summary",
    text: "Send one email at 07:00 with yesterday's volumes and exceptions.",
  },
  {
    key: "members",
    title: "New members",
    text: "Email me when someone accepts an invite to this workspace.",
  },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
      <span>{children}</span>
    </p>
  )
}

function useSavedFlag() {
  const [saved, setSaved] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const show = React.useCallback(() => {
    window.clearTimeout(timer.current)
    setSaved(true)
    timer.current = window.setTimeout(() => setSaved(false), 4000)
  }, [])
  return [saved, show] as const
}

function SaveRow({
  dirty,
  saved,
  onDiscard,
}: {
  dirty: boolean
  saved: boolean
  onDiscard: () => void
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
      <Button type="submit" disabled={!dirty} focusableWhenDisabled className={BUTTON}>
        Save changes
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!dirty}
        onClick={onDiscard}
        className={BUTTON}
      >
        Discard
      </Button>
      <div role="status">
        {saved && (
          <span className="flex items-center gap-2 font-mono text-label uppercase text-success">
            <CircleCheck aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.5} />
            Saved
          </span>
        )}
      </div>
    </div>
  )
}

function TopBar() {
  const [open, setOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)

  const linkClass = (href: string) =>
    href === CURRENT
      ? "text-foreground"
      : "text-muted-foreground transition-colors duration-150 hover:text-foreground"

  return (
    <header
      className="border-b bg-card"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false)
          menuButton.current?.focus()
        }
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
        <a
          href="/"
          className={`font-heading text-h2 text-foreground transition-colors duration-150 ${FOCUS}`}
        >
          Northgate
        </a>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === CURRENT ? "page" : undefined}
                  className={`font-mono text-label uppercase ${linkClass(link.href)} ${FOCUS}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="ml-auto hidden font-mono text-label tabular-nums text-muted-foreground md:block">
          {SIGNED_IN}
        </p>
        <Button
          ref={menuButton}
          variant="outline"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className={`ml-auto md:hidden ${BUTTON}`}
        >
          Menu
        </Button>
      </div>
      <nav id="mobile-menu" aria-label="Main" hidden={!open} className="border-t md:hidden">
        <ul className="mx-auto max-w-[1280px] px-3 py-2 md:px-5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.href === CURRENT ? "page" : undefined}
                className={`block py-2 font-mono text-label uppercase ${linkClass(link.href)} ${FOCUS}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function WorkspacePanel({
  saved,
  onSave,
}: {
  saved: WorkspaceValues
  onSave: (values: WorkspaceValues) => void
}) {
  const [values, setValues] = React.useState(saved)
  const [nameError, setNameError] = React.useState(false)
  const [showSaved, flashSaved] = useSavedFlag()
  const nameRef = React.useRef<HTMLInputElement>(null)

  const dirty =
    values.name !== saved.name ||
    values.address !== saved.address ||
    values.timeZone !== saved.timeZone

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dirty) return
    const next = {
      name: values.name.trim(),
      address: values.address.trim(),
      timeZone: values.timeZone,
    }
    if (next.name === "") {
      setNameError(true)
      nameRef.current?.focus()
      return
    }
    setValues(next)
    onSave(next)
    flashSaved()
  }

  function handleDiscard() {
    setValues(saved)
    setNameError(false)
    nameRef.current?.focus()
  }

  return (
    <section id="workspace" aria-labelledby="workspace-heading" className={PANEL}>
      <div className={HEADING_ROW}>
        <h2 id="workspace-heading" className={HEADING}>
          Workspace
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="mt-3">
        <div className="flex flex-col gap-5">
          <div className="max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="workspace-name" className={LABEL}>
                Workspace name
              </label>
              <Input
                ref={nameRef}
                id="workspace-name"
                required
                value={values.name}
                aria-invalid={nameError || undefined}
                aria-describedby={nameError ? "workspace-name-error" : undefined}
                onChange={(event) => {
                  setValues({ ...values, name: event.target.value })
                  setNameError(false)
                }}
                className="px-2 text-body md:text-body"
              />
            </div>
            {nameError && (
              <FieldError id="workspace-name-error">
                Enter a name for the workspace.
              </FieldError>
            )}
          </div>

          <div className="max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="workspace-address" className={LABEL}>
                Address
              </label>
              <div className="flex items-center gap-2">
                <span
                  id="workspace-address-prefix"
                  className="font-mono text-label tabular-nums text-muted-foreground"
                >
                  northgate.example/
                </span>
                <Input
                  id="workspace-address"
                  value={values.address}
                  aria-describedby="workspace-address-prefix workspace-address-help"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      address: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className="min-w-0 flex-1 px-2 text-body md:text-body"
                />
              </div>
            </div>
            <p
              id="workspace-address-help"
              className="mt-2 font-mono text-label text-muted-foreground"
            >
              Use lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div className="max-w-md">
            <div className="flex flex-col gap-2">
              <label id="workspace-tz-label" htmlFor="workspace-tz" className={LABEL}>
                Time zone
              </label>
              <Select
                items={TIME_ZONES}
                value={values.timeZone}
                onValueChange={(value) => {
                  if (value !== null) setValues({ ...values, timeZone: value })
                }}
              >
                <SelectTrigger id="workspace-tz" aria-labelledby="workspace-tz-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_ZONES.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <SaveRow dirty={dirty} saved={showSaved} onDiscard={handleDiscard} />
      </form>
    </section>
  )
}

function NotificationsPanel() {
  const initial: NotificationValues = {
    late: true,
    failed: true,
    summary: false,
    members: true,
  }
  const [saved, setSaved] = React.useState(initial)
  const [values, setValues] = React.useState(initial)
  const [showSaved, flashSaved] = useSavedFlag()
  const firstSwitch = React.useRef<HTMLElement>(null)

  const dirty = NOTIFICATIONS.some(({ key }) => values[key] !== saved[key])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dirty) return
    setSaved(values)
    flashSaved()
  }

  function handleDiscard() {
    setValues(saved)
    firstSwitch.current?.focus()
  }

  return (
    <section id="notifications" aria-labelledby="notifications-heading" className={PANEL}>
      <div className={HEADING_ROW}>
        <h2 id="notifications-heading" className={HEADING}>
          Notifications
        </h2>
      </div>
      <form noValidate onSubmit={handleSubmit} className="mt-3">
        <div>
          {NOTIFICATIONS.map((item, index) => (
            <div
              key={item.key}
              className="flex items-start justify-between gap-5 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div>
                <p id={`notify-${item.key}-title`} className="font-sans text-body font-medium">
                  {item.title}
                </p>
                <p
                  id={`notify-${item.key}-text`}
                  className="mt-1 max-w-md text-body text-muted-foreground"
                >
                  {item.text}
                </p>
              </div>
              <Switch
                ref={index === 0 ? firstSwitch : undefined}
                checked={values[item.key]}
                onCheckedChange={(checked) => setValues({ ...values, [item.key]: checked })}
                aria-labelledby={`notify-${item.key}-title`}
                aria-describedby={`notify-${item.key}-text`}
              />
            </div>
          ))}
        </div>
        <SaveRow dirty={dirty} saved={showSaved} onDiscard={handleDiscard} />
      </form>
    </section>
  )
}

function RoleSelect({
  value,
  label,
  onChange,
  id,
  labelledBy,
}: {
  value: Role
  label?: string
  onChange: (role: Role) => void
  id?: string
  labelledBy?: string
}) {
  return (
    <Select
      items={ROLES}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next as Role)
      }}
    >
      <SelectTrigger id={id} aria-label={label} aria-labelledby={labelledBy}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function MembersPanel() {
  const [members, setMembers] = React.useState(INITIAL_MEMBERS)
  const [email, setEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<Role>("viewer")
  const [error, setError] = React.useState<string | null>(null)
  const [sentTo, setSentTo] = React.useState<string | null>(null)
  const emailRef = React.useRef<HTMLInputElement>(null)

  const active = members.filter((m) => m.lastActive !== null).length
  const invited = members.length - active
  const count =
    plural(active, "member") + (invited > 0 ? `, ${invited} invited` : "")

  function setRole(id: string, role: Role) {
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, role } : m)))
  }

  function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const address = email.trim()
    let message: string | null = null
    if (address === "") message = "Enter an email address."
    else if (!EMAIL_PATTERN.test(address))
      message = "Enter an email address such as name@example.com."
    else if (members.some((m) => m.email.toLowerCase() === address.toLowerCase()))
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
        id: `invite-${Date.now()}`,
        name: null,
        email: address,
        role: inviteRole,
        lastActive: null,
      },
    ])
    setEmail("")
    setError(null)
    setSentTo(address)
  }

  return (
    <section
      id="members"
      aria-labelledby="members-heading"
      className="scroll-mt-5 overflow-hidden rounded-xl border bg-card"
    >
      <div className="border-b px-5 pt-5 pb-3">
        <div className={HEADING_ROW}>
          <h2 id="members-heading" className={HEADING}>
            Members
          </h2>
          <p className="font-mono text-label tabular-nums text-muted-foreground">{count}</p>
        </div>
      </div>
      <Table label="Members" className="text-body">
        <TableHeader>
          <TableRow>
            <TableHead className={`px-5 ${LABEL}`}>Name</TableHead>
            <TableHead className={`px-5 ${LABEL}`}>Email</TableHead>
            <TableHead className={`px-5 ${LABEL}`}>Role</TableHead>
            <TableHead className={`px-5 text-right ${LABEL}`}>Last active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="px-5 py-2">
                {member.name ? (
                  <>
                    {member.name}
                    {member.self && (
                      <span className="ml-2 font-mono text-label uppercase text-muted-foreground">
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
              <TableCell className="px-5 py-2 wrap-break-word text-body text-foreground">
                {member.email}
              </TableCell>
              <TableCell className="px-5 py-2">
                {member.self ? (
                  roleLabel(member.role)
                ) : (
                  <div className="w-32">
                    <RoleSelect
                      value={member.role}
                      label={`Role of ${member.name ?? member.email}`}
                      onChange={(role) => setRole(member.id, role)}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell className="px-5 py-2 text-right">
                {member.lastActive ? (
                  <time
                    dateTime={member.lastActive.iso}
                    className="font-mono tabular-nums text-foreground"
                  >
                    {member.lastActive.text}
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
      <form noValidate onSubmit={handleInvite} className="border-t px-5 py-5">
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
              onChange={(event) => {
                setEmail(event.target.value)
                setError(null)
                setSentTo(null)
              }}
              className="px-2 text-body md:text-body"
            />
          </div>
          <div className="flex w-32 flex-col gap-2">
            <label id="invite-role-label" htmlFor="invite-role" className={LABEL}>
              Role
            </label>
            <RoleSelect
              id="invite-role"
              labelledBy="invite-role-label"
              value={inviteRole}
              onChange={setInviteRole}
            />
          </div>
          <Button type="submit" variant="secondary" className={BUTTON}>
            Send invite
          </Button>
        </div>
        {error && <FieldError id="invite-error">{error}</FieldError>}
        <div role="status">
          {sentTo && (
            <p className="mt-2 flex items-start gap-2 text-body">
              <CircleCheck
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-success"
                strokeWidth={1.5}
              />
              <span className="min-w-0 wrap-break-word">Invite sent to {sentTo}</span>
            </p>
          )}
        </div>
      </form>
    </section>
  )
}

function DangerZonePanel({ workspaceName }: { workspaceName: string }) {
  const [confirmName, setConfirmName] = React.useState("")
  const [deleted, setDeleted] = React.useState(false)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  React.useEffect(() => {
    if (deleted) statusRef.current?.focus()
  }, [deleted])

  const matches = confirmName.trim() === workspaceName

  return (
    <section
      id="danger-zone"
      aria-labelledby="danger-zone-heading"
      className={`flex-1 ${PANEL}`}
    >
      <div className={HEADING_ROW}>
        <h2 id="danger-zone-heading" className={HEADING}>
          Danger zone
        </h2>
      </div>
      <div className="mt-3">
        {!deleted && (
          <div>
            <h3 className="font-sans text-body font-medium">Delete this workspace</h3>
            <p className="mt-1 max-w-md">
              Deleting {workspaceName} removes its shipments, depots, reports and member
              access for everyone. This cannot be undone. To go on, type the workspace
              name below.
            </p>
            <div className="mt-5 flex max-w-md flex-col gap-2">
              <label htmlFor="confirm-name" className={LABEL}>
                Confirm workspace name
              </label>
              <Input
                id="confirm-name"
                autoComplete="off"
                spellCheck={false}
                value={confirmName}
                onChange={(event) => setConfirmName(event.target.value)}
                className="px-2 text-body md:text-body"
              />
            </div>
            <div className="mt-3">
              <Button
                variant="destructive"
                disabled={!matches}
                onClick={() => setDeleted(true)}
                className={`${BUTTON} hover:text-foreground`}
              >
                <TriangleAlert aria-hidden="true" className="size-4" strokeWidth={1.5} />
                Delete workspace
              </Button>
            </div>
          </div>
        )}
        <p
          ref={statusRef}
          role="status"
          tabIndex={deleted ? -1 : undefined}
          className={`max-w-md ${FOCUS_CODE}`}
        >
          {deleted ? "This is where the workspace would be deleted." : ""}
        </p>
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
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className={`block border-t px-5 py-2 text-body text-foreground underline-offset-4 transition-colors duration-150 first:border-t-0 hover:underline ${FOCUS_INSET}`}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-9">
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
