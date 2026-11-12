export type Story = {
  id: string
  /** Display form: "09:40" today, "TUE 10 NOV" for another day. */
  time: string
  dateTime: string
  kicker: string
  headline: string
  summary: string
  byline: string
  picture?: { label: string; caption: string }
}

const MALIK = "BY MALIK OSEI"
const PRIYA = "BY PRIYA VENKATARAMAN"

// Newest first. Twenty stories from Sunday 8 to Wednesday 11 November 2026.
export const STORIES: Story[] = [
  {
    id: "s1",
    time: "09:40",
    dateTime: "2026-11-11T09:40",
    kicker: "Council",
    headline: "Bridge loan vote pushed to next week",
    summary:
      "The council leader asked for seven days to find the votes after this morning's walkout.",
    byline: PRIYA,
  },
  {
    id: "s2",
    time: "08:15",
    dateTime: "2026-11-11T08:15",
    kicker: "Interview",
    headline: "Why I walked out, by Councillor Ruth Abara",
    summary:
      "The Harbourside member says she was told about the loan terms an hour before the vote.",
    byline: MALIK,
    picture: {
      label:
        "A woman in a dark coat stands on the steps of the council house, holding a folder of papers",
      caption:
        "Ruth Abara outside the council house · Photograph: Teodor Brand",
    },
  },
  {
    id: "s3",
    time: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Saltgate",
    headline: "Four names on the ballot in Saltgate",
    summary:
      "Nominations closed at noon, and the ward will vote on Thursday 3 December.",
    byline: PRIYA,
  },
  {
    id: "s4",
    time: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Transport",
    headline: "Bus fares to rise by 20p in January",
    summary:
      "The transport board backed the rise by five votes to three, blaming fuel and wage costs.",
    byline: MALIK,
  },
  {
    id: "s5",
    time: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Council pay",
    headline: "Members' allowance rise frozen after outcry",
    summary:
      "A planned 6 per cent rise is on hold until an independent panel reports in March.",
    byline: PRIYA,
    picture: {
      label:
        "Rows of empty wooden benches in the public gallery of the council chamber",
      caption:
        "The public gallery before Tuesday's meeting · Photograph: Teodor Brand",
    },
  },
  {
    id: "s6",
    time: "TUE 10 NOV",
    dateTime: "2026-11-10",
    kicker: "Analysis",
    headline: "The sums behind the bridge loan",
    summary:
      "Port Avery would repay £48m over thirty years, and the interest is the sticking point.",
    byline: MALIK,
  },
  {
    id: "s7",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Council",
    headline: "Leader rules out early election",
    summary:
      "Gareth Lunn told members he would see out his term whatever happens to the loan.",
    byline: PRIYA,
  },
  {
    id: "s8",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Transport",
    headline: "Riders' group plans fare protest",
    summary:
      "The Port Avery Bus Users' Forum will gather outside the depot on Saturday morning.",
    byline: MALIK,
  },
  {
    id: "s9",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Saltgate",
    headline: "Green candidate puts the ferry first",
    summary:
      "Imogen Treacy wants the late ferry back before any money goes to the bridge.",
    byline: PRIYA,
  },
  {
    id: "s10",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Council",
    headline: "Audit committee asks for loan papers",
    summary:
      "Members want the full lender terms published before the vote, not after it.",
    byline: MALIK,
  },
  {
    id: "s11",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Interview",
    headline: "Ten minutes with the city treasurer",
    summary:
      "Hollis Grange explains why he signed off the loan and what happens if it fails.",
    byline: PRIYA,
  },
  {
    id: "s12",
    time: "MON 9 NOV",
    dateTime: "2026-11-09",
    kicker: "Council pay",
    headline: "Chief officer pay to be published",
    summary:
      "Every salary over £80,000 will be listed online from the new year, the council says.",
    byline: MALIK,
  },
  {
    id: "s13",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Saltgate",
    headline: "Labour picks a dock worker for Saltgate",
    summary: "Desmond Kearey, 41, has worked the east quay for twenty years.",
    byline: PRIYA,
  },
  {
    id: "s14",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Transport",
    headline: "Night buses saved for another year",
    summary:
      "A grant from the harbour trust covers the routes until next November.",
    byline: MALIK,
  },
  {
    id: "s15",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Council",
    headline: "Two members quit the ruling group's whip",
    summary:
      "Councillors Abara and Pell say they will sit as independents until the loan vote.",
    byline: PRIYA,
  },
  {
    id: "s16",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Opinion",
    headline: "The bridge needs a plan, not a loan",
    summary:
      "A former harbour master on why the repairs should be split into three phases.",
    byline: MALIK,
  },
  {
    id: "s17",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Saltgate",
    headline: "Saltgate turnout could fall below 20%",
    summary:
      "The last two by-elections in the city drew fewer than one voter in five.",
    byline: PRIYA,
  },
  {
    id: "s18",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Council",
    headline: "Library hours cut in three wards",
    summary:
      "Branches in Northmoor, Kessel and Saltgate will close on Mondays from February.",
    byline: MALIK,
  },
  {
    id: "s19",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Interview",
    headline: "The councillor who rides the 14 bus",
    summary:
      "Anwen Pell takes the route every day and says the fare rise will hurt her ward most.",
    byline: PRIYA,
  },
  {
    id: "s20",
    time: "SUN 8 NOV",
    dateTime: "2026-11-08",
    kicker: "Council",
    headline: "Planning chair steps down",
    summary:
      "Owen Marlowe leaves the committee after twelve years, citing his health.",
    byline: MALIK,
  },
]

export const MOST_READ = [
  "Majority gone as two walk out",
  "Bus fares to rise by 20p",
  "Members' pay rise frozen",
  "Why I walked out",
  "Four names on Saltgate ballot",
]
