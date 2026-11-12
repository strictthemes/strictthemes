// A card grid ends with one tile that is not a card ("Or write your own").
// These give that tile the columns left over in the last row, so the grid
// never ends on a gap, however many cards come before it.

const THREE_FROM_LG = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-1"]
const THREE_FROM_MD = ["md:col-span-3", "md:col-span-2", "md:col-span-1"]

/** For a grid of two columns from `md` and three from `lg`. */
export const closingTileInThemeGrid = (cards: number): string =>
  `${cards % 2 === 0 ? "md:col-span-2" : "md:col-span-1"} ${THREE_FROM_LG[cards % 3]}`

/** For a grid of three columns from `md`. */
export const closingTileInPageGrid = (cards: number): string =>
  THREE_FROM_MD[cards % 3] ?? ""
