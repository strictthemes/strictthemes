import { useState } from "react"

import { Approval, type ApprovalState } from "@/components/agent/approval"
import { Citation, Sources, type Source } from "@/components/agent/citations"
import { Stream } from "@/components/agent/stream"
import { ToolCall } from "@/components/agent/tool-call"

// A made-up shop and a made-up order, so every block has something real to show.
const SOURCES: Source[] = [
  {
    title: "Returns and refunds",
    url: "#returns-policy",
    site: "Pedalwick help centre",
    quote: "A part that arrives damaged is refunded in full, postage included, within 30 days of delivery.",
  },
  {
    title: "Order PW-48213",
    url: "#order-pw-48213",
    site: "Orders",
    quote: "Delivered 3 June 2027. One item: brake lever set, £42.00. Postage £4.50.",
  },
]

const ORDER = `{
  "order": "PW-48213",
  "status": "delivered",
  "delivered": "2027-06-03",
  "items": [{ "name": "Brake lever set", "price": 42.0 }],
  "postage": 4.5
}`

const ANSWER =
  "Order PW-48213 was delivered on 3 June, twelve days ago, and the photo shows a cracked lever. That is inside the 30 days the policy gives for a damaged part"
const REST = ", so the full £46.50 can go back to the card it was paid with."

export default function Demo() {
  const [approval, setApproval] = useState<ApprovalState>("pending")
  const [streaming, setStreaming] = useState(true)

  return (
    <div className="min-h-svh bg-background text-body text-foreground">
      <main className="mx-auto flex max-w-3xl flex-col gap-sp-xl p-sp-md md:p-sp-lg">
        <header className="flex flex-col gap-sp-sm">
          <p className="type-label text-muted-foreground">Agent kit · __THEME__</p>
          <h1 className="text-h1">A refund, step by step</h1>
          <p className="text-body text-muted-foreground">
            Four blocks for an agent's side of a conversation, shown on one made-up task: a support agent
            refunds a damaged part.
          </p>
        </header>

        <section aria-labelledby="tool-calls" className="flex flex-col gap-sp-md">
          <h2 id="tool-calls" className="text-h2">
            Tool calls
          </h2>
          <ToolCall
            name="find_order"
            status="done"
            summary="Look up the order the customer wrote about"
            duration="0.4 s"
            input={'{ "order": "PW-48213" }'}
            output={ORDER}
            defaultOpen
          />
          <ToolCall name="read_policy" status="running" summary="Read the returns policy" />
          <ToolCall
            name="check_stock"
            status="failed"
            summary="See whether a replacement is in stock"
            duration="8.0 s"
            input={'{ "sku": "BL-220" }'}
            error="The stock service did not answer within 8 seconds."
          />
        </section>

        <section aria-labelledby="approval" className="flex flex-col gap-sp-md">
          <h2 id="approval" className="text-h2">
            Approval
          </h2>
          <Approval
            title="Refund £46.50 to the customer's card"
            description="The order arrived with a cracked lever. A refund cannot be taken back once it is sent."
            detail={'refund --order PW-48213 --amount 46.50 --reason "damaged on arrival"'}
            state={approval}
            onAllow={() => setApproval("allowed")}
            onAllowAlways={() => setApproval("allowed")}
            allowAlwaysLabel="Always allow refunds under £50"
            onDeny={() => setApproval("denied")}
          />
          {approval !== "pending" && (
            <p>
              <button
                type="button"
                onClick={() => setApproval("pending")}
                className="text-body text-foreground underline underline-offset-4 hover:decoration-2 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Ask again
              </button>
            </p>
          )}
        </section>

        <section aria-labelledby="streaming" className="flex flex-col gap-sp-md">
          <h2 id="streaming" className="text-h2">
            Streaming and citations
          </h2>
          <Stream streaming={streaming} label="Writing the reply" onStop={() => setStreaming(false)}>
            {ANSWER}
            <Citation index={1} />
            {!streaming && (
              <>
                {REST}
                <Citation index={2} />
              </>
            )}
          </Stream>
          <Sources sources={SOURCES} />
        </section>
      </main>
    </div>
  )
}
