// Sample data for Mossy: Ines Okafor's last 30 days, ending today,
// Wednesday, 11 November 2026.

export type Period = "week" | "month"

export const HABITS = [
  "Drink 8 glasses of water",
  "Read 10 pages",
  "Walk after lunch",
  "Stretch for 5 minutes",
  "No phone after 22:00",
] as const

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

export type Day = {
  iso: string
  weekday: string
  short: string
  axis: string
  long: string
  count: number
  done: boolean[]
}

// Counts out of 5, from 13 October to 11 November.
const COUNTS = [
  2, 3, 5, 4, 5, 5, 5, 2, 4, 4, 5, 3, 4, 5, 3, 5, 3,
  // 30 October to 10 November: the 12-day streak.
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  // Today, so far.
  2,
]

// What each habit still needs over 13 to 29 October, so that the month
// comes to 29, 25, 28, 24 and 23 of 30.
const EARLY_QUOTA = [16, 13, 15, 12, 11]
const TODAY_DONE = [true, false, true, false, false]
const EARLY_DAYS = 17

function buildDays(): Day[] {
  const quota = [...EARLY_QUOTA]
  const start = Date.UTC(2026, 9, 13)
  return COUNTS.map((count, i) => {
    const date = new Date(start + i * 86_400_000)
    let done: boolean[]
    if (i < EARLY_DAYS) {
      // Give the day's ticks to the habits with the most still to place.
      const order = HABITS.map((_, h) => h).sort((a, b) => quota[b] - quota[a])
      const picked = new Set(order.slice(0, count))
      picked.forEach((h) => (quota[h] -= 1))
      done = HABITS.map((_, h) => picked.has(h))
    } else if (i === COUNTS.length - 1) {
      done = TODAY_DONE
    } else {
      done = HABITS.map(() => true)
    }
    const weekday = WEEKDAYS[date.getUTCDay()]
    const month = MONTHS[date.getUTCMonth()]
    const dayOfMonth = date.getUTCDate()
    return {
      iso: date.toISOString().slice(0, 10),
      weekday,
      short: weekday.slice(0, 3),
      axis: `${dayOfMonth} ${month.slice(0, 3)}`,
      long: `${weekday}, ${dayOfMonth} ${month}`,
      count,
      done,
    }
  })
}

export const DAYS = buildDays()

export function daysFor(period: Period): Day[] {
  return period === "week" ? DAYS.slice(-7) : DAYS
}

export function bestDay(days: Day[]): string {
  const totals = new Map<string, number>()
  days.forEach((d) =>
    totals.set(d.weekday, (totals.get(d.weekday) ?? 0) + d.count)
  )
  let best = ""
  let bestTotal = -1
  // Walk back from today, so that on a tie the most recent weekday wins.
  for (const d of [...days].reverse()) {
    const total = totals.get(d.weekday) ?? 0
    if (total > bestTotal) {
      best = d.weekday
      bestTotal = total
    }
  }
  return best
}

export function habitStats(days: Day[]) {
  return HABITS.map((name, h) => {
    const done = days.filter((d) => d.done[h]).length
    return {
      name,
      done,
      total: days.length,
      percent: Math.round((done / days.length) * 100),
    }
  }).sort((a, b) => b.percent - a.percent)
}
