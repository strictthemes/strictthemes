import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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
  onValueChange: (value: Date) => void
  today: Date
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

function DatePicker({
  id,
  labelId,
  value,
  onValueChange,
  today,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const valueId = `${id}-value`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={`${labelId} ${valueId}`}
        className="flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-2 text-body whitespace-nowrap text-foreground transition-colors outline-none select-none focus-visible:border-ring focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive"
      >
        <span id={valueId}>
          {value ? (
            <time
              dateTime={format(value, "yyyy-MM-dd")}
              className="font-mono tabular-nums"
            >
              {format(value, "d MMM yyyy")}
            </time>
          ) : (
            <span className="text-muted-foreground">Choose a date</span>
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
            'button[tabindex="0"]'
          ) ?? null
        }
      >
        <div ref={calendarRef}>
          <Calendar
            mode="single"
            required
            weekStartsOn={1}
            showOutsideDays={false}
            today={today}
            selected={value}
            defaultMonth={value ?? today}
            onSelect={(date) => {
              onValueChange(date)
              setOpen(false)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
