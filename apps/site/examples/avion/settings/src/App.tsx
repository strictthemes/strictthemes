import { useEffect, useRef, useState, type FormEvent } from "react"
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
const FOCUS_INSIDE =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
const BUTTON = "px-5 font-mono text-label uppercase"
const LABEL = "font-mono text-label uppercase text-muted-foreground"
const PANEL_HEADING = "font-mono text-label uppercase text-muted-foreground"
const SMALL_FIGURE = "font-mono text-label tabular-nums text-muted-foreground"
const INPUT = "px-2 text-body md:text-body"

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
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Dublin", label: "Europe/Dublin" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Europe/Stockholm", label: "Europe/Stockholm" },
]

const ROLES = [
  { value: "owner", label: "Owner" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "viewer", label: "Viewer" },
]

const ME = "Mara Lindqvist"

type Member = {
  name: string | null
  email: string
  role: string
  lastActive: { text: string; dateTime: string } | null
  you?: boolean
}

const INITIAL_MEMBERS: Member[] = [
  {
    name: ME,
    email: "mara.lindqvist@northgate.example",
    role: "owner",
    lastActive: { text: "13 Nov, 09:12", dateTime: "2026-11-13T09:12" },
    you: true,
  },
  {
    name: "Tobias Reyes",
    email: "tobias.reyes@northgate.example",
    role: "dispatcher",
    lastActive: { text: "13 Nov, 08:47", dateTime: "2026-11-13T08:47" },
  },
  {
    name: "Priya Ashworth",
    email: "priya.ashworth@northgate.example",
    role: "dispatcher",
    lastActive: { text: "12 Nov, 17:30", dateTime: "2026-11-12T17:30" },
  },
  {
    name: "Callum Ferreira",
    email: "callum.ferreira@northgate.example",
    role: "viewer",
    lastActive: { text: "10 Nov, 14:05", dateTime: "2026-11-10T14:05" },
  },
  {
    name: "Ines Okafor",
    email: "ines.okafor@northgate.example",
    role: "viewer",
    lastActive: { text: "4 Nov, 11:20", dateTime: "2026-11-04T11:20" },
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
    key: "daily",
    title: "Daily summary",
    text: "Send one email each morning with the previous day's figures.",
  },
  {
    key: "members",
    title: "New members",
    text: "Email me when someone accepts an invite to this workspace.",
  },
] as const

type NotificationKey = (typeof NOTIFICATIONS)[number]["key"]
type NotificationValues = Record<NotificationKey, boolean>

const INITIAL_NOTIFICATIONS: NotificationValues = {
  late: true,
  failed: true,
  daily: false,
  members: true,
}

type Workspace = { name: string; address: string; timeZone: string }

const INITIAL_WORKSPACE: Workspace = {
  name: "Northgate North",
  address: "northgate-north",
  timeZone: "Europe/London",
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function PanelHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={PANEL_HEADING}>
      {children}
    </h2>
  )
}

function HeadingRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
      {children}
    </div>
  )
}

function ErrorLine({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 font-mono text-label text-destructive"
    >
      <CircleAlert className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {children}
    </p>
  )
}

function SavedStatus({ show }: { show: boolean }) {
  return (
    <p
      role="status"
      className="inline-flex items-center gap-2 font-mono text-label uppercase text-success"
    >
      {show && (
        <>
          <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Saved
        </>
      )}
    </p>
  )
}

function useFlag(ms: number) {
  const [on, setOn] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return [
    on,
    () => {
      window.clearTimeout(timer.current)
      setOn(true)
      timer.current = window.setTimeout(() => setOn(false), ms)
    },
  ] as const
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Workspace
  const [savedWorkspace, setSavedWorkspace] = useState(INITIAL_WORKSPACE)
  const [workspace, setWorkspace] = useState(INITIAL_WORKSPACE)
  const [nameError, setNameError] = useState(false)
  const [workspaceSaved, flashWorkspaceSaved] = useFlag(4000)
  const nameRef = useRef<HTMLInputElement>(null)
  const workspaceDirty =
    workspace.name !== savedWorkspace.name ||
    workspace.address !== savedWorkspace.address ||
    workspace.timeZone !== savedWorkspace.timeZone

  function saveWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!workspaceDirty) return
    if (workspace.name.trim() === "") {
      setNameError(true)
      nameRef.current?.focus()
      return
    }
    const next = { ...workspace, name: workspace.name.trim() }
    setWorkspace(next)
    setSavedWorkspace(next)
    flashWorkspaceSaved()
  }

  function discardWorkspace() {
    setWorkspace(savedWorkspace)
    setNameError(false)
    nameRef.current?.focus()
  }

  // Notifications
  const [savedNotifications, setSavedNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [notificationsSaved, flashNotificationsSaved] = useFlag(4000)
  const firstSwitchRef = useRef<HTMLElement>(null)
  const notificationsDirty = NOTIFICATIONS.some(
    (n) => notifications[n.key] !== savedNotifications[n.key]
  )

  function saveNotifications(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!notificationsDirty) return
    setSavedNotifications(notifications)
    flashNotificationsSaved()
  }

  function discardNotifications() {
    setNotifications(savedNotifications)
    firstSwitchRef.current?.focus()
  }

  // Members
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSent, setInviteSent] = useState<string | null>(null)
  const inviteRef = useRef<HTMLInputElement>(null)
  const activeCount = members.filter((m) => m.lastActive).length
  const invitedCount = members.length - activeCount
  const memberCount =
    plural(activeCount, "member", "members") +
    (invitedCount > 0 ? `, ${invitedCount} invited` : "")

  function setRole(email: string, role: string) {
    setMembers((list) => list.map((m) => (m.email === email ? { ...m, role } : m)))
  }

  function sendInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = inviteEmail.trim()
    let error: string | null = null
    if (email === "") {
      error = "Enter the email address of the person to invite."
    } else if (!EMAIL_PATTERN.test(email)) {
      error = "Enter an email address in the form name@example.com."
    } else if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      error = "This address is already in the workspace. Enter another one."
    }
    if (error) {
      setInviteError(error)
      setInviteSent(null)
      inviteRef.current?.focus()
      return
    }
    setMembers((list) => [
      ...list,
      { name: null, email, role: inviteRole, lastActive: null },
    ])
    setInviteEmail("")
    setInviteError(null)
    setInviteSent(email)
  }

  // Danger zone
  const [confirmName, setConfirmName] = useState("")
  const [deleted, setDeleted] = useState(false)
  const deletedRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (deleted) deletedRef.current?.focus()
  }, [deleted])

  const linkClass = (href: string) =>
    cn(
      "font-mono text-label uppercase transition-colors duration-150",
      FOCUS,
      href === CURRENT
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    )

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-3 py-3 md:px-5">
          <a
            href="/"
            className={cn("font-heading text-h2 text-foreground", FOCUS)}
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
          <p className={cn("ml-auto hidden md:block", SMALL_FIGURE)}>{ME}</p>
          <Button
            variant="outline"
            className={cn("ml-auto md:hidden", BUTTON)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </Button>
        </div>
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!menuOpen}
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
              className={cn(
                "block border-t px-5 py-2 text-body text-foreground underline-offset-4 transition-colors duration-150 first:border-t-0 hover:underline",
                FOCUS_INSIDE
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-5 md:col-span-12 lg:col-span-9">
          {/* Workspace */}
          <section
            id="workspace"
            aria-labelledby="workspace-heading"
            className="scroll-mt-5 rounded-xl border bg-card p-5"
          >
            <HeadingRow>
              <PanelHeading id="workspace-heading">Workspace</PanelHeading>
            </HeadingRow>
            <form noValidate onSubmit={saveWorkspace} className="mt-3">
              <div className="flex flex-col gap-5">
                <div className="max-w-md">
                  <label htmlFor="workspace-name" className={cn("block", LABEL)}>
                    Workspace name
                  </label>
                  <div className="mt-2">
                    <Input
                      ref={nameRef}
                      id="workspace-name"
                      name="name"
                      required
                      autoComplete="off"
                      value={workspace.name}
                      aria-invalid={nameError || undefined}
                      aria-describedby={nameError ? "workspace-name-error" : undefined}
                      onChange={(e) => {
                        setWorkspace({ ...workspace, name: e.target.value })
                        setNameError(false)
                      }}
                      className={INPUT}
                    />
                  </div>
                  {nameError && (
                    <ErrorLine id="workspace-name-error">
                      Enter a name for the workspace. It cannot be empty.
                    </ErrorLine>
                  )}
                </div>

                <div className="max-w-md">
                  <label htmlFor="workspace-address" className={cn("block", LABEL)}>
                    Address
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <span id="workspace-address-prefix" className={SMALL_FIGURE}>
                      northgate.example/
                    </span>
                    <Input
                      id="workspace-address"
                      name="address"
                      autoComplete="off"
                      spellCheck={false}
                      value={workspace.address}
                      aria-describedby="workspace-address-prefix workspace-address-help"
                      onChange={(e) =>
                        setWorkspace({
                          ...workspace,
                          address: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      className={INPUT}
                    />
                  </div>
                  <p
                    id="workspace-address-help"
                    className="mt-2 font-mono text-label text-muted-foreground"
                  >
                    Use lowercase letters, numbers and hyphens only.
                  </p>
                </div>

                <div className="max-w-md">
                  <label htmlFor="workspace-time-zone" className={cn("block", LABEL)}>
                    Time zone
                  </label>
                  <div className="mt-2">
                    <Select
                      items={TIME_ZONES}
                      value={workspace.timeZone}
                      onValueChange={(value) => {
                        if (value !== null) setWorkspace({ ...workspace, timeZone: value })
                      }}
                    >
                      <SelectTrigger id="workspace-time-zone">
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

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
                <Button
                  type="submit"
                  focusableWhenDisabled
                  disabled={!workspaceDirty}
                  className={BUTTON}
                >
                  Save changes
                </Button>
                <Button
                  variant="outline"
                  disabled={!workspaceDirty}
                  onClick={discardWorkspace}
                  className={BUTTON}
                >
                  Discard
                </Button>
                <SavedStatus show={workspaceSaved} />
              </div>
            </form>
          </section>

          {/* Notifications */}
          <section
            id="notifications"
            aria-labelledby="notifications-heading"
            className="scroll-mt-5 rounded-xl border bg-card p-5"
          >
            <HeadingRow>
              <PanelHeading id="notifications-heading">Notifications</PanelHeading>
            </HeadingRow>
            <form noValidate onSubmit={saveNotifications} className="mt-3">
              <ul>
                {NOTIFICATIONS.map((item, index) => (
                  <li
                    key={item.key}
                    className="flex items-start justify-between gap-5 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p
                        id={`notify-${item.key}-title`}
                        className="font-sans text-body font-medium"
                      >
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
                      ref={index === 0 ? firstSwitchRef : undefined}
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                      aria-labelledby={`notify-${item.key}-title`}
                      aria-describedby={`notify-${item.key}-text`}
                      className="mt-1"
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-5">
                <Button
                  type="submit"
                  focusableWhenDisabled
                  disabled={!notificationsDirty}
                  className={BUTTON}
                >
                  Save changes
                </Button>
                <Button
                  variant="outline"
                  disabled={!notificationsDirty}
                  onClick={discardNotifications}
                  className={BUTTON}
                >
                  Discard
                </Button>
                <SavedStatus show={notificationsSaved} />
              </div>
            </form>
          </section>

          {/* Members */}
          <section
            id="members"
            aria-labelledby="members-heading"
            className="scroll-mt-5 overflow-hidden rounded-xl border bg-card"
          >
            <div className="border-b px-5 pt-5 pb-3">
              <HeadingRow>
                <PanelHeading id="members-heading">Members</PanelHeading>
                <p className={SMALL_FIGURE}>{memberCount}</p>
              </HeadingRow>
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
                {members.map((member) => {
                  const who = member.name ?? member.email
                  return (
                    <TableRow key={member.email}>
                      <TableCell className="px-5 py-2">
                        {member.name ?? (
                          <>
                            <span aria-hidden="true">—</span>
                            <span className="sr-only">No name yet</span>
                          </>
                        )}
                        {member.you && (
                          <span className="ml-2 font-mono text-label uppercase text-muted-foreground">
                            You
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-2">{member.email}</TableCell>
                      <TableCell className="px-5 py-2">
                        {member.you ? (
                          ROLES.find((r) => r.value === member.role)?.label
                        ) : (
                          <div className="w-32">
                            <Select
                              items={ROLES}
                              value={member.role}
                              onValueChange={(value) => {
                                if (value !== null) setRole(member.email, value)
                              }}
                            >
                              <SelectTrigger aria-label={`Role of ${who}`}>
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
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-2 text-right">
                        {member.lastActive ? (
                          <time
                            dateTime={member.lastActive.dateTime}
                            className="font-mono tabular-nums"
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
                  )
                })}
              </TableBody>
            </Table>

            <div className="border-t px-5 py-5">
              <form noValidate onSubmit={sendInvite}>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex w-full flex-col gap-2 md:w-64">
                    <label htmlFor="invite-email" className={LABEL}>
                      Invite by email
                    </label>
                    <Input
                      ref={inviteRef}
                      id="invite-email"
                      type="email"
                      name="email"
                      autoComplete="off"
                      spellCheck={false}
                      value={inviteEmail}
                      aria-invalid={inviteError ? true : undefined}
                      aria-describedby={inviteError ? "invite-email-error" : undefined}
                      onChange={(e) => {
                        setInviteEmail(e.target.value)
                        setInviteError(null)
                        setInviteSent(null)
                      }}
                      className={INPUT}
                    />
                  </div>
                  <div className="flex w-32 flex-col gap-2">
                    <label htmlFor="invite-role" className={LABEL}>
                      Role
                    </label>
                    <Select
                      items={ROLES}
                      value={inviteRole}
                      onValueChange={(value) => {
                        if (value !== null) setInviteRole(value)
                      }}
                    >
                      <SelectTrigger id="invite-role">
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
                  </div>
                  <Button type="submit" variant="secondary" className={BUTTON}>
                    Send invite
                  </Button>
                </div>
                {inviteError && (
                  <ErrorLine id="invite-email-error">{inviteError}</ErrorLine>
                )}
                <div role="status">
                  {inviteSent && (
                    <p className="mt-2 flex items-start gap-2 text-body">
                      <Check
                        className="mt-1 size-4 shrink-0 text-success"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 break-words">
                        Invite sent to {inviteSent}
                      </span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Danger zone */}
          <section
            id="danger-zone"
            aria-labelledby="danger-zone-heading"
            className="flex-1 scroll-mt-5 rounded-xl border bg-card p-5"
          >
            <HeadingRow>
              <PanelHeading id="danger-zone-heading">Danger zone</PanelHeading>
            </HeadingRow>
            <div className="mt-3">
              {!deleted && (
                <div>
                  <h3 className="font-sans text-body font-medium">
                    Delete this workspace
                  </h3>
                  <p className="mt-1 max-w-md text-body">
                    Deleting {savedWorkspace.name} removes its shipments, depots,
                    reports and members for good. This cannot be undone. To go on,
                    type the workspace's name below.
                  </p>
                  <div className="mt-5 max-w-md">
                    <label htmlFor="confirm-name" className={cn("block", LABEL)}>
                      Confirm workspace name
                    </label>
                    <div className="mt-2">
                      <Input
                        id="confirm-name"
                        autoComplete="off"
                        spellCheck={false}
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        className={INPUT}
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    disabled={confirmName !== savedWorkspace.name}
                    onClick={() => setDeleted(true)}
                    className={cn("mt-3 hover:text-foreground", BUTTON)}
                  >
                    <TriangleAlert strokeWidth={1.5} className="size-4" aria-hidden="true" />
                    Delete workspace
                  </Button>
                </div>
              )}
              <p
                ref={deletedRef}
                role="status"
                tabIndex={deleted ? -1 : undefined}
                className="focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-ring"
              >
                {deleted ? "This is where the workspace would be deleted." : ""}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
