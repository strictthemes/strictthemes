// Money is kept in whole pence to avoid rounding errors.

export function formatPounds(pence: number): string {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `£${pounds.toLocaleString("en-GB")}.${rest}`
}

/** Reads "1,240.5", "£ 1240.50" or "240" as pence. Returns null if it is not an amount. */
export function parseAmount(raw: string): number | null {
  let s = raw.replace(/[\s,]/g, "")
  if (s.startsWith("£")) s = s.slice(1)
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(s)
  if (!match) return null
  const pence = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"))
  return Number.isSafeInteger(pence) ? pence : null
}

export function isAmountEmpty(raw: string): boolean {
  let s = raw.replace(/[\s,]/g, "")
  if (s.startsWith("£")) s = s.slice(1)
  return s === ""
}

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
]
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
const SCALES = ["", "thousand", "million", "billion"]

function underHundred(n: number): string {
  if (n < 20) return ONES[n]
  const t = TENS[Math.floor(n / 10)]
  return n % 10 ? `${t}-${ONES[n % 10]}` : t
}

function numberInWords(n: number): string {
  if (n === 0) return ONES[0]
  const groups: number[] = []
  while (n > 0) {
    groups.push(n % 1000)
    n = Math.floor(n / 1000)
  }
  let out = ""
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (g === 0) continue
    const hundreds = Math.floor(g / 100)
    const rest = g % 100
    let words = ""
    if (hundreds) words = `${ONES[hundreds]} hundred`
    if (rest) {
      if (hundreds) words += ` and ${underHundred(rest)}`
      else if (out && i === 0) words = `and ${underHundred(rest)}`
      else words = underHundred(rest)
    }
    if (SCALES[i]) words += ` ${SCALES[i]}`
    if (out) out += hundreds ? `, ${words}` : ` ${words}`
    else out = words
  }
  return out
}

export function amountInWords(pence: number): string {
  const pounds = Math.floor(pence / 100)
  const p = pence % 100
  const parts: string[] = []
  if (pounds) parts.push(`${numberInWords(pounds)} ${pounds === 1 ? "pound" : "pounds"}`)
  if (p || !pounds) parts.push(`${numberInWords(p)} ${p === 1 ? "penny" : "pence"}`)
  const text = parts.join(" and ")
  return text.charAt(0).toUpperCase() + text.slice(1)
}
