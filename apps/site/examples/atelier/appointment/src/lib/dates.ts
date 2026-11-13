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

/** A no-break space, so a long date breaks only after the weekday. */
const NBSP = String.fromCharCode(0xa0)

/** A local date as YYYY-MM-DD, read from its local parts, never from UTC. */
export function toDateTime(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** "Thursday 19 November 2026", with no-break spaces after the day's number. */
export function formatDate(date: Date) {
  return [
    WEEKDAYS[date.getDay()],
    " ",
    date.getDate(),
    NBSP,
    MONTHS[date.getMonth()],
    NBSP,
    date.getFullYear(),
  ].join("")
}

/** Tomorrow at local midnight, by the visitor's clock. */
export function getTomorrow() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
}
