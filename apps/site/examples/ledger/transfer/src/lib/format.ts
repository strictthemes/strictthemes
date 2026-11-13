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

const pad = (n: number) => String(n).padStart(2, "0")

/** 2026-11-27, for a <time>'s dateTime. */
export function isoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** 27 Nov 2026, for a date that stands on its own. */
export function formatShortDate(date: Date) {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** 27 November 2026, for a date inside a sentence. */
export function formatLongDate(date: Date) {
  return `${date.getDate()} ${LONG_MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function sameDay(a: Date, b: Date) {
  return isoDate(a) === isoDate(b)
}

/** Pence to £1,240.50, no sign. */
export function formatMoney(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = pence % 100
  return `£${pounds.toLocaleString("en-GB")}.${pad(rest)}`
}

const ONES = [
  "",
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
  const units = n % 10
  return units ? `${TENS[Math.floor(n / 10)]}-${ONES[units]}` : TENS[Math.floor(n / 10)]
}

function underThousand(n: number) {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (!hundreds) return underHundred(rest)
  const head = `${ONES[hundreds]} hundred`
  return rest ? `${head} and ${underHundred(rest)}` : head
}

function wholeNumber(n: number): string {
  const groups: [number, string][] = [
    [1_000_000, "million"],
    [1_000, "thousand"],
  ]
  for (const [size, name] of groups) {
    if (n >= size) {
      const head = `${wholeNumber(Math.floor(n / size))} ${name}`
      const rest = n % size
      if (!rest) return head
      return rest >= 100
        ? `${head}, ${wholeNumber(rest)}`
        : `${head} and ${underHundred(rest)}`
    }
  }
  return underThousand(n)
}

/** Pence to "One thousand, two hundred and forty pounds and fifty pence". */
export function amountInWords(pence: number) {
  const pounds = Math.floor(pence / 100)
  const rest = pence % 100
  const parts: string[] = []
  if (pounds) parts.push(`${wholeNumber(pounds)} ${pounds === 1 ? "pound" : "pounds"}`)
  if (rest) parts.push(`${underHundred(rest)} ${rest === 1 ? "penny" : "pence"}`)
  const words = parts.join(" and ") || "zero pounds"
  return words.charAt(0).toUpperCase() + words.slice(1)
}
