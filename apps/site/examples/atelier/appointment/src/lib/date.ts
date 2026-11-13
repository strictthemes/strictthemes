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

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** The machine form of a local date, 2026-11-19, read from its local parts. */
export function toDateTime(date: Date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-")
}

/**
 * A date written out: Thursday 19 November 2026. The joiner goes after the
 * day's number and after the month.
 */
export function formatLongDate(date: Date, joiner = " ") {
  const rest = [
    date.getDate(),
    MONTHS[date.getMonth()],
    date.getFullYear(),
  ].join(joiner)

  return WEEKDAYS[date.getDay()] + " " + rest
}

/** Tomorrow by the visitor's clock, at local midnight. */
export function getTomorrow() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
}
