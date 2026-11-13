const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const LONG_MONTHS = [
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

/** 27 Nov 2026 */
export function formatShortDate(date: Date) {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** 27 November 2026 */
export function formatLongDate(date: Date) {
  return `${date.getDate()} ${LONG_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function isSameDay(a: Date, b: Date) {
  return isoDate(a) === isoDate(b)
}

/** Pence to £1,240.50 */
export function formatMoney(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = String(pence % 100).padStart(2, "0")
  return `£${pounds.toLocaleString("en-GB")}.${rest}`
}

const ONES = [
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
  if (n < 20) return ONES[n]
  const unit = n % 10
  return TENS[Math.floor(n / 10)] + (unit ? `-${ONES[unit]}` : "")
}

function underThousand(n: number) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (!hundreds) return underHundred(rest)
  const head = `${ONES[hundreds]} hundred`
  return rest ? `${head} and ${underHundred(rest)}` : head
}

function wholeNumber(n: number): string {
  if (n >= 1_000_000) {
    const millions = Math.floor(n / 1_000_000)
    const rest = n % 1_000_000
    const head = `${underThousand(millions)} million`
    if (!rest) return head
    return rest >= 100
      ? `${head}, ${wholeNumber(rest)}`
      : `${head} and ${underHundred(rest)}`
  }
  const thousands = Math.floor(n / 1000)
  const rest = n % 1000
  if (!thousands) return underThousand(rest)
  const head = `${underThousand(thousands)} thousand`
  if (!rest) return head
  return rest >= 100
    ? `${head}, ${underThousand(rest)}`
    : `${head} and ${underHundred(rest)}`
}

/** 124050 -> "One thousand, two hundred and forty pounds and fifty pence" */
export function moneyInWords(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = pence % 100
  const parts: string[] = []
  if (pounds)
    parts.push(`${wholeNumber(pounds)} ${pounds === 1 ? "pound" : "pounds"}`)
  if (rest)
    parts.push(`${underHundred(rest)} ${rest === 1 ? "penny" : "pence"}`)
  const text = parts.join(" and ")
  return text.charAt(0).toUpperCase() + text.slice(1)
}
