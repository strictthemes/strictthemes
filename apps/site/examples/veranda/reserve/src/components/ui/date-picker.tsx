import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// A date as a date field holds it: "2027-05-14".
function toDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function toValue(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

type DatePickerProps = {
  id: string
  labelId: string
  name?: string
  value: string
  onValueChange: (value: string) => void
  min?: string
  className?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  ref?: React.Ref<HTMLButtonElement>
}

function DatePicker({
  id,
  labelId,
  name,
  value,
  onValueChange,
  min,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ref,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const selected = toDate(value)
  const first = min ? toDate(min) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        id={id}
        aria-labelledby={`${labelId} ${id}-value`}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-4 text-body whitespace-nowrap text-foreground transition-colors outline-none select-none focus-visible:border-ring focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive",
          className
        )}
      >
        <span id={`${id}-value`} className="truncate">
          {selected ? (
            <time dateTime={value}>
              {selected.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : (
            <span className="text-muted-foreground">Choose a day</span>
          )}
        </span>
        <CalendarIcon
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </PopoverTrigger>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <PopoverContent
        align="start"
        className="w-auto"
        initialFocus={() =>
          calendarRef.current?.querySelector<HTMLElement>(
            'td button[tabindex="0"]'
          ) ?? true
        }
      >
        <div ref={calendarRef}>
          <Calendar
            mode="single"
            required
            weekStartsOn={1}
            selected={selected}
            defaultMonth={selected ?? first}
            startMonth={first}
            disabled={first ? { before: first } : undefined}
            onSelect={(date: Date) => {
              onValueChange(toValue(date))
              setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
