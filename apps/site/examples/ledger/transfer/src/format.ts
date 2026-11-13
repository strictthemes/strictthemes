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

export function isoDate(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${m}-${d}`
}

/** "27 Nov 2026", for a date that stands on its own. */
export function formatShortDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
}

/** "27 November 2026", for a date inside a sentence. */
export function formatLongDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function sameDay(a: Date, b: Date) {
  return isoDate(a) === isoDate(b)
}

/** Pence to "£1,240.50". */
export function formatMoney(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `£${pounds.toLocaleString("en-GB")}.${rest}`
}

/**
 * Reads an amount as typed. Spaces, commas and a leading £ are ignored.
 * Returns the amount in pence, "empty", or "invalid".
 */
export function parseAmount(raw: string): number | "empty" | "invalid" {
  const cleaned = raw.replace(/[\s,]/g, "").replace(/^£/, "")
  if (cleaned === "") return "empty"
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned)
  if (!match) return "invalid"
  const pounds = Number(match[1])
  const pence = Number((match[2] ?? "").padEnd(2, "0"))
  const total = pounds * 100 + pence
  if (!Number.isSafeInteger(total) || total === 0) return "invalid"
  return total
}

const UNITS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
]
const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
]

function underHundred(n: number) {
  if (n < 20) return UNITS[n]
  const tens = TENS[Math.floor(n / 10)]
  return n % 10 ? `${tens}-${UNITS[n % 10]}` : tens
}

function underThousand(n: number) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (!hundreds) return underHundred(rest)
  const head = `${UNITS[hundreds]} hundred`
  return rest ? `${head} and ${underHundred(rest)}` : head
}

/** A whole number in British English words, such as "one thousand, two hundred and forty". */
function wholeInWords(n: number): string {
  if (n === 0) return "zero"
  const scales: [number, string][] = [
    [1_000_000_000, "billion"],
    [1_000_000, "million"],
    [1_000, "thousand"],
  ]
  const parts: string[] = []
  let rest = n
  for (const [size, name] of scales) {
    if (rest >= size) {
      parts.push(`${underThousand(Math.floor(rest / size))} ${name}`)
      rest %= size
    }
  }
  if (!rest) return parts.join(", ")
  const last = underThousand(rest)
  if (!parts.length) return last
  // "One thousand and five", but "one thousand, two hundred and forty".
  return rest < 100
    ? `${parts.join(", ")} and ${last}`
    : `${parts.join(", ")}, ${last}`
}

/** Pence to words: "One thousand, two hundred and forty pounds and fifty pence". */
export function amountInWords(pence: number) {
  const pounds = Math.floor(pence / 100)
  const p = pence % 100
  const parts: string[] = []
  if (pounds) parts.push(`${wholeInWords(pounds)} ${pounds === 1 ? "pound" : "pounds"}`)
  if (p) parts.push(`${underHundred(p)} ${p === 1 ? "penny" : "pence"}`)
  const text = parts.length ? parts.join(" and ") : "zero pounds"
  return text.charAt(0).toUpperCase() + text.slice(1)
}
