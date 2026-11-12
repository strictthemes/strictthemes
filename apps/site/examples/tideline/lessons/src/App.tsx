import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-[1248px] px-6"
const focus =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const textLink = cn(
  "text-foreground underline decoration-1 underline-offset-4 hover:decoration-2",
  focus
)
const navLink = cn(
  "inline-flex h-11 items-center font-mono text-label text-foreground uppercase underline-offset-4 hover:underline",
  focus
)
const buttonClasses = "h-11 rounded-md px-6 font-mono text-label uppercase"
const label = "font-mono text-label uppercase"
const plainList = "m-0 list-none p-0"

const navItems = [
  { label: "Lessons", href: "/lessons", current: true },
  { label: "Forecast", href: "/forecast", current: false },
  { label: "Guide", href: "/guide", current: false },
  { label: "Book", href: "/booking", current: false },
]

const lessons = [
  {
    level: "Beginners",
    name: "First Waves",
    description:
      "For anyone who has never stood on a board. You learn to read the water, paddle, and get to your feet in waist-deep white water.",
    length: "2 h",
    group: "Up to 8 per coach",
    ages: "8 and up",
    included: [
      "Wetsuit, boots and a soft foam board",
      "Twenty minutes on the sand before you get wet",
      "A coach in the water beside you",
    ],
    price: "£42",
  },
  {
    level: "Improvers",
    name: "Green Waves",
    description:
      "For surfers who can stand up in white water. You paddle out the back, catch unbroken waves and learn to turn along them.",
    length: "2 h 30 min",
    group: "Up to 6 per coach",
    ages: "12 and up",
    included: [
      "Wetsuit and a board matched to you",
      "Video of your waves, sent the same day",
      "A plan for practising on your own",
    ],
    price: "£55",
  },
  {
    level: "Any level",
    name: "Private Coaching",
    description:
      "One coach for you, your family or a few friends, at your pace. Good for nervous starters and for fixing one stubborn habit.",
    length: "1 h 30 min",
    group: "1 to 4 people",
    ages: "6 and up",
    included: [
      "Wetsuit and board for everyone",
      "Your own coach for the whole session",
      "A start time that suits you and the tide",
    ],
    price: "£85",
  },
]

const kit = [
  { item: "Foam surfboard, 7 to 9 ft", short: "£10", half: "£15", full: "£22" },
  { item: "Hard surfboard, 6 to 9 ft", short: "£14", half: "£20", full: "£28" },
  { item: "Wetsuit, summer or winter", short: "£6", half: "£9", full: "£12" },
  { item: "Bodyboard", short: "£5", half: "£8", full: "£10" },
  { item: "Boots and gloves", short: "£3", half: "£4", full: "£5" },
  {
    item: "Foam board and wetsuit together",
    short: "£14",
    half: "£21",
    full: "£30",
  },
]

const questions = [
  {
    question: "Do I need to be able to swim?",
    answer: (
      <>
        Yes, a little: 50 metres in a pool is enough. Beginners&rsquo; lessons
        stay in water no deeper than your waist.
      </>
    ),
  },
  {
    question: "What should I bring?",
    answer: (
      <>
        Swimwear, a towel and a bottle of water. We lend you the wetsuit, the
        boots and the board, and there are hot showers at the Boat Shed.
      </>
    ),
  },
  {
    question: "What if the sea is too rough or too flat?",
    answer: (
      <>
        We decide by{" "}
        <time dateTime="07:30" className="tabular-nums">
          07:30
        </time>{" "}
        on the day. If we call a lesson off, you choose another date or a full
        refund.
      </>
    ),
  },
  {
    question: "Can I move my booking?",
    answer: (
      <>
        Yes, free of charge up to 48 hours before the lesson. After that we
        keep half the price, unless we can fill your place.
      </>
    ),
  },
  {
    question: "How old do children need to be?",
    answer: (
      <>
        Eight for First Waves, twelve for Green Waves, and six for Private
        Coaching with a parent in the water.
      </>
    ),
  },
]

function Rows({ rows }: { rows: { term: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map((row) => (
        <div
          key={row.term}
          className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0"
        >
          <dt className={cn(label, "shrink-0 text-muted-foreground")}>
            {row.term}
          </dt>
          <dd className="min-w-0 text-right text-body text-foreground">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Hours() {
  return (
    <>
      <time dateTime="08:30" className="tabular-nums">
        08:30
      </time>
      –
      <time dateTime="18:00" className="tabular-nums">
        18:00
      </time>
    </>
  )
}

export function App() {
  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <header className="border-b border-border">
        <div className={cn(container, "flex flex-wrap items-center gap-x-6 py-2")}>
          <a
            href="/"
            className={cn(
              "inline-flex h-11 items-center font-heading text-h2 text-foreground",
              focus
            )}
          >
            Sandhopper
          </a>
          <nav aria-label="Main" className="w-full md:ml-auto md:w-auto">
            <ul className={cn(plainList, "flex flex-wrap gap-x-6")}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={cn(navLink, item.current && "underline")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className={cn(container, "flex flex-col gap-24 pt-10 pb-24")}>
        <section
          aria-labelledby="opening-heading"
          className="flex flex-col gap-6 rounded-xl bg-lagoon p-6 text-lagoon-foreground md:p-10"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className={label}>Sandhopper Surf School · 2027</p>
              <h1 id="opening-heading" className="text-h1 md:text-display">
                Lessons and prices
              </h1>
            </div>
            <p className="max-w-xl text-body">
              Every lesson includes a wetsuit, a board and a coach in the water
              with you. We set the start time by the tide and email it to you
              the day before.
            </p>
          </div>
          <ul className={cn(plainList, "flex flex-wrap gap-x-6 gap-y-2")}>
            <li className={label}>From £42 a person</li>
            <li className={label}>Groups of 8 or fewer</li>
            <li className={label}>Free to move up to 48 hours before</li>
          </ul>
        </section>

        <section aria-labelledby="lessons-heading" className="flex flex-col gap-6">
          <h2 id="lessons-heading" className="text-h2">
            Choose a lesson
          </h2>
          <ul className={cn(plainList, "grid grid-cols-1 gap-6 lg:grid-cols-3")}>
            {lessons.map((lesson) => (
              <li
                key={lesson.name}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
              >
                <Badge className="h-auto rounded-sm border-transparent bg-tertiary px-2 py-1 font-mono text-label text-tertiary-foreground uppercase">
                  {lesson.level}
                </Badge>
                <h3 className="text-h2">{lesson.name}</h3>
                <p className="text-body">{lesson.description}</p>
                <Rows
                  rows={[
                    { term: "Length", value: lesson.length },
                    { term: "Group", value: lesson.group },
                    { term: "Ages", value: lesson.ages },
                  ]}
                />
                <div className="flex flex-col gap-2">
                  <p className={cn(label, "text-muted-foreground")}>Included</p>
                  <ul className={cn(plainList, "flex flex-col gap-2")}>
                    {lesson.included.map((thing) => (
                      <li key={thing} className="flex items-start gap-2">
                        <Check
                          className="mt-1 size-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="text-body">{thing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-heading text-h2 text-foreground tabular-nums">
                      {lesson.price}
                    </span>
                    <span className={cn(label, "text-muted-foreground")}>
                      a person
                    </span>
                  </p>
                  <a
                    href="/booking"
                    aria-label={`Book this lesson: ${lesson.name}`}
                    className={cn(
                      buttonVariants({ variant: "secondary" }),
                      buttonClasses,
                      "w-full"
                    )}
                  >
                    Book this lesson
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="kit-heading"
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-x-6"
        >
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div className="flex flex-col gap-4">
              <h2 id="kit-heading" className="text-h2">
                Kit hire
              </h2>
              <p className="max-w-xl text-body">
                Surfed before? Hire what you need from the Boat Shed, with no
                need to book. Prices are for one item.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table label="Kit hire" className="text-body">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {["Item", "2 hours", "Half day", "Full day"].map((head) => (
                      <TableHead
                        key={head}
                        scope="col"
                        className={cn(
                          label,
                          "h-auto px-6 py-4 text-muted-foreground"
                        )}
                      >
                        {head}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kit.map((row) => (
                    <TableRow key={row.item} className="hover:bg-transparent">
                      <TableCell className="px-6 py-4 text-body text-foreground">
                        {row.item}
                      </TableCell>
                      {[row.short, row.half, row.full].map((price, i) => (
                        <TableCell
                          key={i}
                          className="px-6 py-4 text-foreground tabular-nums"
                        >
                          {price}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 lg:col-span-4">
            <h3 className="text-h2">How hire works</h3>
            <Rows
              rows={[
                { term: "Half day", value: "4 hours" },
                { term: "Full day", value: <Hours /> },
                { term: "Deposit", value: "A bank card or a car key" },
                { term: "Sizes", value: "Wetsuits from age 4 to XXL" },
              ]}
            />
          </div>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-x-6"
        >
          <div className="flex flex-col gap-4 md:col-span-4">
            <h2 id="faq-heading" className="text-h2">
              Good to know
            </h2>
            <p className="max-w-xl text-body">
              Not answered here? Call us on{" "}
              <a href="tel:+441632960418" className={textLink}>
                01632 960 418
              </a>
              .
            </p>
          </div>
          <ul className={cn(plainList, "divide-y divide-border md:col-span-8")}>
            {questions.map((item) => (
              <li
                key={item.question}
                className="flex flex-col gap-2 py-6 first:pt-0 last:pb-0"
              >
                <h3 className="text-body font-bold">{item.question}</h3>
                <p className="max-w-xl text-body">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ready-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 rounded-xl bg-coral p-6 text-coral-foreground md:p-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className={label}>Every day of the year</p>
                <h2 id="ready-heading" className="text-h2">
                  Ready to get in?
                </h2>
              </div>
              <p className="max-w-xl text-body">
                Most days have places until the evening before. In July and
                August, book a week ahead.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/booking"
              className={cn(buttonVariants(), buttonClasses, "w-full md:w-auto")}
            >
              Book a lesson
            </a>
            <p className="text-body">
              <a href="/forecast" className={textLink}>
                Check the forecast first
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div
          className={cn(
            container,
            "flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between"
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="font-heading text-h2">Sandhopper Surf School</p>
            <p className="text-body">
              Surf lessons and kit hire at Pentarrow Sands since 2009.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <p className={cn(label, "text-muted-foreground")}>
              The Boat Shed · Beach Road · Pentarrow Sands · ZP7 3SB
            </p>
            <p className="text-body">
              <a href="tel:+441632960418" className={textLink}>
                01632 960 418
              </a>
              {" · "}
              <a href="mailto:hello@sandhopper.example" className={textLink}>
                hello@sandhopper.example
              </a>
            </p>
            <p className={cn(label, "text-muted-foreground")}>
              Every day · <Hours /> · © 2027 Sandhopper Surf School
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
