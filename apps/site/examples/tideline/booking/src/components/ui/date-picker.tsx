import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { formatLongDate, toDateTime } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  id: string
  labelId: string
  value: Date | undefined
  onValueChange: (value: Date | undefined) => void
  min?: Date
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  ref?: React.Ref<HTMLButtonElement>
  className?: string
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
  className,
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
          "flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-4 py-1 text-left text-body outline-none focus-visible:border-ring focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive",
          className
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
export type { DatePickerProps }
