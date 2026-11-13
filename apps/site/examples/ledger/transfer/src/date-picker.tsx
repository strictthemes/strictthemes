import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatShortDate, isoDate } from "@/format"

type DatePickerProps = {
  id: string
  labelId: string
  describedBy?: string
  value: Date
  onChange: (date: Date) => void
  today: Date
  last: Date
}

export function DatePicker({
  id,
  labelId,
  describedBy,
  value,
  onChange,
  today,
  last,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const timeId = `${id}-time`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-labelledby={`${labelId} ${timeId}`}
        aria-describedby={describedBy}
        className="flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-2 text-body whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <time
          id={timeId}
          dateTime={isoDate(value)}
          className="font-mono tabular-nums"
        >
          {formatShortDate(value)}
        </time>
        <CalendarIcon
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-4 shrink-0 text-muted-foreground"
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
            today={today}
            selected={value}
            defaultMonth={value}
            startMonth={today}
            endMonth={last}
            disabled={{ before: today, after: last }}
            onSelect={(date) => {
              if (!date) return
              onChange(date)
              setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
