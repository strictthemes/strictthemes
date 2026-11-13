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

/** The local calendar day as YYYY-MM-DD, never through UTC. */
export function toDateTime(date: Date) {
  const y = String(date.getFullYear()).padStart(4, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** "Thursday 19 November 2026", with non-breaking spaces after the day's
 * number and before the year, so that only the weekday can wrap away. */
export function formatDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()}\u00a0${
    MONTHS[date.getMonth()]
  }\u00a0${date.getFullYear()}`
}

/** Local midnight of the day after today, by the visitor's clock. */
export function getTomorrow() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
}

/** Compares two dates as local calendar days: negative when a is earlier. */
export function compareDays(a: Date, b: Date) {
  return (
    new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime() -
    new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  )
}
