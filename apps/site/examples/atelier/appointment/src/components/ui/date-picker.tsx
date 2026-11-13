import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatLongDate, toDateTime } from "@/lib/date"
import { cn } from "@/lib/utils"

// A non-breaking space (U+00A0): the date breaks after the weekday only.
const NBSP = String.fromCharCode(160)

type CalendarProps =React.ComponentProps<typeof Calendar>

type DatePickerProps = {
  id: string
  labelId: string
  value: Date | undefined
  onValueChange: (value: Date) => void
  className?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  disabled?: CalendarProps["disabled"]
  startMonth?: Date
}

function DatePicker({
  id,
  labelId,
  value,
  onValueChange,
  className,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  disabled,
  startMonth,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-labelledby={labelId + " " + id + "-value"}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "flex h-auto w-full items-center justify-between gap-2 rounded-lg border border-muted-foreground bg-transparent px-4 py-2 text-left text-body transition-colors outline-none select-none focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50",
          className
        )}
      >
        <span id={id + "-value"} className="min-w-0">
          {value ? (
            <time dateTime={toDateTime(value)}>
              {formatLongDate(value, NBSP)}
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
            defaultMonth={value ?? startMonth}
            startMonth={startMonth}
            disabled={disabled}
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
