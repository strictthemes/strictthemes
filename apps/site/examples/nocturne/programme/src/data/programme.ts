export type Day = {
  date: string // ISO date, e.g. 2026-11-13
  button: string // text on the day switch
  label: string // short date in a label
}

export type Film = {
  id: string
  title: string
  director: string
  country: string
  year: number
  minutes: number
  rating: string
  screen: number
  href: string
  premiere?: boolean
  // Showtimes per day, keyed by ISO date, in 24-hour time.
  times: Record<string, string[]>
}

export const TODAY = "2026-11-11"

export const days: Day[] = [
  { date: "2026-11-11", button: "Today", label: "Wed 11 Nov" },
  { date: "2026-11-12", button: "Thu 12", label: "Thu 12 Nov" },
  { date: "2026-11-13", button: "Fri 13", label: "Fri 13 Nov" },
  { date: "2026-11-14", button: "Sat 14", label: "Sat 14 Nov" },
  { date: "2026-11-15", button: "Sun 15", label: "Sun 15 Nov" },
]

export const films: Film[] = [
  {
    id: "low-tide",
    title: "Low Tide at Merrow",
    director: "Ada Kessler",
    country: "Norway",
    year: 2026,
    minutes: 118,
    rating: "15",
    screen: 1,
    href: "/film",
    premiere: true,
    times: {
      "2026-11-11": ["17:30", "20:15"],
      "2026-11-12": ["18:15", "20:45"],
      "2026-11-13": ["16:45", "19:30", "22:15"],
      "2026-11-14": ["16:30", "19:15", "22:00"],
      "2026-11-15": ["13:30", "16:15", "19:00"],
    },
  },
  {
    id: "night-ferry",
    title: "Night Ferry to Halvik",
    director: "Jonas Brask",
    country: "Denmark",
    year: 2025,
    minutes: 96,
    rating: "12A",
    screen: 2,
    href: "#",
    times: {
      "2026-11-11": ["18:00"],
      "2026-11-13": ["17:15", "21:00"],
      "2026-11-15": ["16:30"],
    },
  },
  {
    id: "glass-year",
    title: "The Glass Year",
    director: "Inès Lavalle",
    country: "France",
    year: 2026,
    minutes: 131,
    rating: "15",
    screen: 3,
    href: "#",
    times: {
      "2026-11-11": ["17:45"],
      "2026-11-13": ["18:30"],
      "2026-11-14": ["18:00"],
      "2026-11-15": ["15:00"],
    },
  },
  {
    id: "room-above",
    title: "A Room Above the Station",
    director: "Tomasz Wierzba",
    country: "Poland",
    year: 2024,
    minutes: 104,
    rating: "PG",
    screen: 2,
    href: "#",
    times: {
      "2026-11-12": ["17:45"],
      "2026-11-14": ["17:00"],
      "2026-11-15": ["14:00"],
    },
  },
  {
    id: "small-hours",
    title: "Small Hours",
    director: "Noor Hadid",
    country: "Lebanon",
    year: 2026,
    minutes: 88,
    rating: "15",
    screen: 3,
    href: "#",
    times: {
      "2026-11-11": ["20:15"],
      "2026-11-12": ["19:00"],
      "2026-11-13": ["22:45"],
      "2026-11-14": ["22:30"],
      "2026-11-15": ["18:00"],
    },
  },
  {
    id: "quiet-lift",
    title: "The Quiet Lift",
    director: "Mirela Dobre",
    country: "Romania",
    year: 2025,
    minutes: 99,
    rating: "12A",
    screen: 2,
    href: "#",
    times: {
      "2026-11-11": ["20:00"],
      "2026-11-12": ["20:00"],
      "2026-11-14": ["19:45"],
    },
  },
]

/** The films on a day, in the order of their first time that day. */
export function filmsOn(date: string) {
  return films
    .filter((film) => (film.times[date] ?? []).length > 0)
    .map((film) => ({ film, times: [...film.times[date]].sort() }))
    .sort((a, b) => a.times[0].localeCompare(b.times[0]))
}

/** A time at 22:00 or later is a late show. */
export function isLate(time: string) {
  return time >= "22:00"
}
