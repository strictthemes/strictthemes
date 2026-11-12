// strict-ignore-file: this frame shows the stock components in each theme, at the sizes they ship with.
import { useState } from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Mode = "light" | "dark"

export interface ThemePreviewProps {
  /** Theme slug. The theme's variables are scoped to `[data-theme]` by the layout. */
  slug: string
  name: string
  /** A shorter specimen, for places that show several themes side by side. */
  compact?: boolean
  initialMode?: Mode
  /** The weight, tracking and line height the theme gives a large heading. */
  headingStyle?: { fontWeight: string; letterSpacing: string; lineHeight: string }
}

const USAGE = [
  { label: "Colors on token", value: 96 },
  { label: "Spacing on scale", value: 88 },
  { label: "Type on scale", value: 100 },
]

/**
 * Stock shadcn components wearing one theme. Nothing here is styled for a
 * particular theme: colors, corners and fonts all come from its variables.
 * No component that renders into a portal is used, since a portal would leave
 * the themed element.
 */
export function ThemePreview({
  slug,
  name,
  compact = false,
  initialMode = "light",
  headingStyle,
}: ThemePreviewProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const id = (suffix: string) => `${slug}-${suffix}`

  return (
    <div
      data-theme={slug}
      data-mode={mode}
      // The preview shows a theme, often not the site's own, so Strict Check leaves it out.
      data-strict-ignore
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background font-sans text-sm text-foreground",
        mode === "dark" && "dark"
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {name}
        </span>
        <div role="group" aria-label={`${name} color mode`} className="flex gap-1">
          {(["light", "dark"] as const).map((option) => (
            <Button
              key={option}
              size="xs"
              variant={mode === option ? "secondary" : "ghost"}
              aria-pressed={mode === option}
              onClick={() => setMode(option)}
            >
              {option === "light" ? "Light" : "Dark"}
            </Button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-8 p-4 md:p-8", !compact && "lg:grid-cols-2")}>
        <div className="flex flex-col gap-4">
          <h3
            className={cn(
              !headingStyle && "font-bold tracking-tight",
              compact ? "text-2xl" : "text-4xl"
            )}
            style={headingStyle}
          >
            Ship the page, keep the system.
          </h3>
          <p className="max-w-prose text-base text-muted-foreground">
            Every color, corner and typeface in this box comes from the theme's
            tokens. The components are stock shadcn.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button>Publish</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="outline">Preview</Button>
            {!compact && <Button variant="ghost">Discard</Button>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>New</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="outline">v1.2.0</Badge>
            <Badge variant="destructive">Failed</Badge>
          </div>
          {compact && (
            <div className="flex items-center gap-2">
              <Switch id={id("switch")} defaultChecked />
              <Label htmlFor={id("switch")}>Check on every commit</Label>
            </div>
          )}
        </div>

        {!compact && (
          <Card>
            <CardHeader>
              <CardTitle>Invite a reviewer</CardTitle>
              <CardDescription>
                They get read access to this project.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={id("email")}>Email</Label>
                <Input id={id("email")} type="email" placeholder="name@example.com" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id={id("notify")} defaultChecked />
                <Label htmlFor={id("notify")}>Notify them by email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id={id("switch")} defaultChecked />
                <Label htmlFor={id("switch")}>Check on every commit</Label>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Send invite</Button>
              <Button variant="ghost">Cancel</Button>
            </CardFooter>
          </Card>
        )}

        {!compact && (
          <Tabs defaultValue="report" className="lg:col-span-2">
            <TabsList>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="palette">Chart colors</TabsTrigger>
            </TabsList>
            <TabsContent value="report" className="grid gap-4 pt-2 md:grid-cols-3">
              {USAGE.map((row) => (
                <div key={row.label} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <code className="text-xs tabular-nums">{row.value}%</code>
                  </div>
                  <Progress value={row.value} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="palette" className="flex gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-16 flex-1 rounded-md"
                  style={{ background: `var(--chart-${n})` }}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

export default ThemePreview
