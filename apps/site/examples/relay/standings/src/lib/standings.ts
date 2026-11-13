export type View = "all" | "home" | "away"

export type Tally = {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

export type Club = {
  name: string
  home: Tally
  away: Tally
}

export type Row = Tally & {
  name: string
  goalDifference: number
  points: number
  position: number
}

export const OWN_CLUB = "Wendmoor FC"

function record(
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number
): Tally {
  return { played, won, drawn, lost, goalsFor, goalsAgainst }
}

// Kestrel Valley League, Division One, after 14 of 22 matches.
export const CLUBS: Club[] = [
  {
    name: "Castlebrook United",
    home: record(6, 4, 1, 1, 12, 6),
    away: record(8, 5, 1, 2, 22, 14),
  },
  {
    name: "Dunmarsh Athletic",
    home: record(7, 5, 2, 0, 15, 4),
    away: record(7, 2, 4, 1, 15, 14),
  },
  {
    name: "Wendmoor FC",
    home: record(7, 6, 0, 1, 17, 7),
    away: record(7, 2, 3, 2, 13, 12),
  },
  {
    name: "Pellow Green",
    home: record(8, 6, 1, 1, 14, 7),
    away: record(6, 2, 1, 3, 6, 6),
  },
  {
    name: "Stenwick Albion",
    home: record(6, 4, 0, 2, 13, 8),
    away: record(8, 3, 2, 3, 7, 8),
  },
  {
    name: "Lowmere Welfare",
    home: record(8, 5, 1, 2, 12, 8),
    away: record(6, 1, 1, 4, 6, 9),
  },
  {
    name: "Sedgeholme",
    home: record(6, 3, 2, 1, 10, 9),
    away: record(8, 2, 1, 5, 12, 13),
  },
  {
    name: "Otterby Town",
    home: record(6, 3, 2, 1, 9, 5),
    away: record(8, 1, 3, 4, 8, 13),
  },
  {
    name: "Tarrowby United",
    home: record(7, 2, 3, 2, 7, 10),
    away: record(7, 1, 2, 4, 3, 8),
  },
  {
    name: "Kirkfen Rangers",
    home: record(7, 2, 4, 1, 12, 9),
    away: record(7, 0, 2, 5, 7, 14),
  },
  {
    name: "Hollinvale",
    home: record(8, 2, 3, 3, 10, 14),
    away: record(6, 0, 1, 5, 3, 12),
  },
  {
    name: "Eastlow Wanderers",
    home: record(8, 2, 2, 4, 8, 17),
    away: record(6, 0, 0, 6, 2, 16),
  },
]

function recordFor(club: Club, view: View): Tally {
  if (view === "home") return club.home
  if (view === "away") return club.away
  return {
    played: club.home.played + club.away.played,
    won: club.home.won + club.away.won,
    drawn: club.home.drawn + club.away.drawn,
    lost: club.home.lost + club.away.lost,
    goalsFor: club.home.goalsFor + club.away.goalsFor,
    goalsAgainst: club.home.goalsAgainst + club.away.goalsAgainst,
  }
}

export function buildTable(clubs: Club[], view: View): Row[] {
  return clubs
    .map((club) => {
      const r = recordFor(club, view)
      return {
        ...r,
        name: club.name,
        goalDifference: r.goalsFor - r.goalsAgainst,
        points: r.won * 3 + r.drawn,
        position: 0,
      }
    })
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.name.localeCompare(b.name, "en-GB")
    )
    .map((row, index) => ({ ...row, position: index + 1 }))
}

export function ordinal(n: number): string {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  if (n % 10 === 1) return `${n}st`
  if (n % 10 === 2) return `${n}nd`
  if (n % 10 === 3) return `${n}rd`
  return `${n}th`
}

export function signed(n: number): string {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${-n}`
  return "0"
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

export function gapToTop(table: Row[], own: Row): string {
  if (own.position === 1) return "Top of the table."
  const top = table[0]
  const gap = top.points - own.points
  if (gap === 0) return `Level on points with ${top.name}.`
  return `${plural(gap, "point", "points")} behind ${top.name}.`
}
