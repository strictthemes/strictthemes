import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function pad(n: number) {
  return String(n).padStart(2, "0")
}

/** The day as YYYY-MM-DD, from its local year, month and day. */
export function toDateTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** The day written out: "Saturday 19 June 2027". */
export function formatLongDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

type DatePickerProps = {
  id: string
  labelId: string
  value: Date | undefined
  onValueChange: (value: Date | undefined) => void
  min?: Date
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  ref?: React.Ref<HTMLButtonElement>
}

function DatePicker({
  id,
  labelId,
  value,
  onValueChange,
  min,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  ref,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const valueId = `${id}-value`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={ref}
        id={id}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-4 py-1 text-left text-body outline-none focus-visible:border-ring aria-invalid:border-destructive",
          "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        )}
      >
        <span id={valueId}>
          {value ? (
            <time dateTime={toDateTime(value)}>{formatLongDate(value)}</time>
          ) : (
            <span className="text-muted-foreground">Choose a date</span>
          )}
        </span>
        <CalendarIcon
          className="size-4 shrink-0 text-muted-foreground"
          strokeWidth={2}
          aria-hidden="true"
        />
      </PopoverTrigger>
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
            selected={value}
            defaultMonth={value ?? min}
            startMonth={min}
            disabled={min ? { before: min } : undefined}
            onSelect={(day) => {
              onValueChange(day)
              setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
