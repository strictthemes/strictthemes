import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function toDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function toValue(date: Date) {
  const year = String(date.getFullYear()).padStart(4, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

type DatePickerProps = {
  id: string
  labelId: string
  name?: string
  value: string
  onValueChange: (value: string) => void
  min?: string
  className?: string
  ref?: React.Ref<HTMLButtonElement>
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

function DatePicker({
  id,
  labelId,
  name,
  value,
  onValueChange,
  min,
  className,
  ref,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  const selected = value ? toDate(value) : undefined
  const first = min ? toDate(min) : undefined

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          ref={ref}
          aria-labelledby={`${labelId} ${id}-value`}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-muted-foreground bg-card px-4 text-body whitespace-nowrap text-foreground transition-colors outline-none select-none focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-invalid:border-destructive",
            className
          )}
        >
          <span id={`${id}-value`} className="truncate">
            {value ? (
              <time dateTime={value}>
                {toDate(value).toLocaleDateString("en-GB", {
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
              onSelect={(date) => {
                onValueChange(toValue(date))
                setOpen(false)
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </>
  )
}

export { DatePicker }
