---
title: "Best email verifiers for catch-all domains in 2026"
description: Six email verifiers compared on how they handle catch-all (accept-all) domains, whether you pay for addresses they can't confirm, and what 1,000 checks cost.
kind: Roundup
date: 2026-11-25
checked: 2026-11-25
---

Some mail servers say yes to every address on their domain. Ask about `jane@example.com` or `zzz123@example.com`, and the answer is the same: accepted. These are catch-all, or accept-all, domains. They are common at companies, which makes them a problem for anyone verifying a B2B list.

This guide compares six email verifiers on what they do with catch-all addresses, whether they charge for results they can't confirm, and what 1,000 checks cost. We read every price and feature on each vendor's own pages on 25 November 2026.

## TL;DR

- **Most verifiers can't confirm a mailbox on a catch-all domain.** They flag it as "risky" or "catch-all" and leave the decision to you.
- **Best for resolving catch-alls: MillionVerifier.** It says its standard check turns up to 40% of catch-all addresses into valid or invalid, and it doesn't charge for the ones it can't resolve. It is also the cheapest here at volume.
- **Best for Google and Microsoft domains: Bouncer.** It says it resolves catch-alls on Google and Microsoft infrastructure. Unknown results are free.
- **Best for scoring the catch-alls you keep: ZeroBounce.** It returns a `catch-all` status and can score those addresses with its AI Scoring, at one more credit each.
- **Kickbox and Emailable** flag accept-all addresses clearly, and refund unknown results, but don't claim to resolve them.
- **Unspam** flags catch-alls and is cheap per check, but a catch-all result uses a credit and it doesn't try to resolve it. It is the better pick if you also test inbox placement.

## What a catch-all domain is, and why verifiers struggle

A verifier checks an address by asking the domain's mail server whether the mailbox exists, without sending an email. On most domains, the server says yes or no. On a catch-all domain, it says yes to everything.

Kickbox's documentation puts it plainly: some domains "accept all email you send them, even if the email address is invalid." The server may then drop the message or send a bounce later. So the verifier can't tell a real mailbox from a made-up one.

What verifiers do about it:

- **Flag it.** The address gets a "risky", "accept-all" or "catch-all" label, so you can decide whether to send. Kickbox, Emailable, ZeroBounce and Unspam all do this.
- **Try harder to resolve it.** MillionVerifier and Bouncer both say they get a definite answer for some catch-all addresses. Neither publishes how it does it.
- **Score it.** ZeroBounce sells a separate score for how likely a catch-all address is to be real.

## Catch-all email verifiers at a glance

| Tool | What it does with catch-alls | Charged for catch-all or unknown? | Price per 1,000 | Free to start |
| --- | --- | --- | --- | --- |
| MillionVerifier | Resolves up to 40%, by its own figure | Unresolved catch-alls and unknowns are free | $1.78 (50,000 for $89) | 100 credits |
| Bouncer | Resolves catch-alls on Google and Microsoft infrastructure, by its own description | Unknowns are free | $6 (10,000 for $60) | Not listed |
| ZeroBounce | `catch-all` status, plus AI Scoring at 1 credit per address | Unknowns are free | $9.90 on ZeroBounce ONE (10,000 for $99 a month) | 100 credits a month |
| Kickbox | Labels accept-all addresses as Risky | Unknowns are refunded | $7 (10,000 for $70) | 100 verifications |
| Emailable | Accept-all detection flag | Unknowns and duplicates are refunded | €7.60 (5,000 for €38) | 250 credits |
| Unspam | Labels catch-alls as Risky | Unknowns are free. Risky results use a credit | $6.40 on the Custom plan | 10 single checks a day |

## 1. MillionVerifier: best for resolving catch-alls

[MillionVerifier](https://www.millionverifier.com/catch-all-email-verifier) says its standard verification includes catch-all resolution. Its catch-all page says it converts "up to 40%" of catch-all addresses into valid or invalid. The rest are marked Risky.

![MillionVerifier's catch-all email verifier page, describing built-in catch-all resolution and a 30% to 40% recovery rate.](/guides/catch-all-email-verifiers/millionverifier.jpg "MillionVerifier's catch-all page, 25 November 2026")

**What you pay for:** one standard credit per address, with no extra fee for catch-all resolution. Its FAQ says it doesn't charge for "Unknown" or unresolved "Catch-All" results.

**Pricing:** credits never expire. Its home page lists $89 for 50,000 credits ($0.00178 each) and 1 million for $449. A free account comes with 100 credits. It offers a money-back guarantee.

**Limitations:** the 30% to 40% recovery rate is MillionVerifier's own figure, and it doesn't say how it gets there. Resolved addresses go straight into the valid and invalid columns, so you can't see which ones were catch-alls.

**Good for:** B2B lists with many company domains, where the price per check matters.

## 2. Bouncer: best for Google and Microsoft domains

[Bouncer](https://www.usebouncer.com/email-verification/) lists catch-all resolution as one of its four checks. It says it "uses proprietary negotiation to resolve catch-alls on Google and Microsoft infrastructure."

![Bouncer's email verification page, with step 4, Catch-all resolution, describing how it resolves catch-alls on Google and Microsoft infrastructure.](/guides/catch-all-email-verifiers/bouncer.jpg "Bouncer's email verification page, 25 November 2026")

**What you pay for:** its pricing page says it never charges for duplicates or "unknown" results. It doesn't say whether a catch-all it can't resolve uses a credit.

**Pricing:** pay as you go from 1,000 credits for $8. 10,000 cost $60, 100,000 cost $400, and 1 million cost $2,000. Credits never expire. It also sells monthly subscriptions.

**Limitations:** resolution covers domains hosted by Google and Microsoft, by its own description. Catch-alls on other mail servers are flagged. Free credits aren't listed on its pricing page.

**Good for:** lists of companies on Google Workspace or Microsoft 365, which covers many B2B contacts.

## 3. ZeroBounce: best for scoring the catch-alls you keep

[ZeroBounce](https://www.zerobounce.net/email-validation-pricing) returns `catch-all` as its own status, and its API adds a `catchall_domain` field. Its pricing page says you can "score catch-alls to avoid bounces" with AI Scoring. One credit scores one address.

![ZeroBounce's pricing page, with the Freemium plan of 100 validation credits a month and a list of what every account includes, such as unknown results are free.](/guides/catch-all-email-verifiers/zerobounce.jpg "ZeroBounce's pricing page, 25 November 2026")

**What you pay for:** one credit per address verified, and one more per address scored. Unknown results are free.

**Pricing:** pay as you go starts at $39 for 2,000 addresses. ZeroBounce ONE, a subscription, starts at $99 a month for 10,000 credits, with annual billing 20% cheaper. The free plan refills 100 validation credits every month.

**Limitations:** scoring a catch-all costs a second credit, so a catch-all-heavy list costs close to double. A score tells you how likely an address is to be real. It doesn't confirm it.

**Good for:** teams that want to rank their catch-all addresses and send only to the most likely ones.

## 4. Kickbox: clear labels and free unknowns

[Kickbox](https://kickbox.com/pricing/) sorts every address into deliverable, undeliverable, risky or unknown. Its documentation says accept-all, disposable and role addresses are classed as Risky, and warns that sending to accept-all domains may raise bounce rates.

![Kickbox's pricing page, headed Straightforward Pricing, with 100 verifications free and 1,000 for $10.](/guides/catch-all-email-verifiers/kickbox.jpg "Kickbox's pricing page, 25 November 2026")

**What you pay for:** if Kickbox can't give a definite result, it refunds the credit. Only unknown results are listed as refunded, so a risky accept-all result uses a credit.

**Pricing:** 100 verifications free. 1,000 cost $10, 10,000 cost $70, 100,000 cost $500 and 1 million cost $2,999.

**Limitations:** it doesn't claim to resolve catch-alls. It costs more per check than MillionVerifier or Bouncer at most tiers.

**Good for:** teams that want simple, well-documented labels and are happy to decide on catch-alls themselves.

## 5. Emailable: accept-all detection with refunds

[Emailable](https://emailable.com/bulk/) checks each address for syntax, domain and mailbox errors, and flags accept-all, disposable, role and free addresses. Its API returns an `accept_all` field and a score for each address.

![Emailable's bulk verification page, What we check in your email list, with Accept-All Detection among its checks.](/guides/catch-all-email-verifiers/emailable.jpg "Emailable's bulk verification page, 25 November 2026")

**What you pay for:** one credit per verification. Duplicates and unknown results are refunded to your balance when the list finishes.

**Pricing:** priced in euros on our visit. 5,000 credits cost €38 at the regular price. A new account includes 250 free credits, and credits never expire.

**Limitations:** it detects accept-all addresses but doesn't claim to resolve them.

**Good for:** teams who want a score per address to help sort the risky ones.

## 6. Unspam: catch-all flags alongside deliverability tests

[Unspam](https://unspam.email/email-verifier) checks syntax, MX records, the mailbox, disposable providers, role addresses and catch-all domains. A catch-all address comes back as Risky.

![Unspam's email verifier page, showing a list check with results split into deliverable, risky, disposable, undeliverable and unknown, and which results are charged.](/guides/catch-all-email-verifiers/unspam.jpg "Unspam's email verifier page, 25 November 2026")

**What you pay for:** duplicates, malformed addresses and unknown results are not charged. Risky results, catch-alls included, use a credit, as its example list shows.

**Pricing:** 10 single checks a day are free with no sign-up. List verification comes with the Custom plan, from a $5 monthly minimum, at $6.40 per 1,000.

**Limitations:** it doesn't try to resolve catch-alls. A list must have at most 100,000 rows. Verification needs the paid Custom plan.

**Good for:** teams that already test inbox placement or spam scores with Unspam and want verification on the same bill. The [cold email spam checklist](/guides/cold-email-spam-checklist/) covers where verification fits among the other checks.

## Which should you choose?

- **Your list is mostly company domains:** MillionVerifier, for its catch-all resolution at the lowest price. Try Bouncer too, if most contacts are on Google Workspace or Microsoft 365.
- **You want to send to some catch-alls, but not all:** ZeroBounce, and score them.
- **You want clear labels and will decide yourself:** Kickbox or Emailable.
- **You also test inbox placement:** Unspam.

Whatever you pick, treat unresolved catch-alls with care. Send to them in small batches, or after your engaged contacts, and watch the bounce rate.

## FAQ

### What is a catch-all email address?

An address on a domain whose mail server accepts mail for any address, real or not. The server may then deliver the message to a shared inbox, drop it, or bounce it later.

### Can you verify a catch-all email address?

Not with a normal check, because the server accepts every address. Some verifiers, such as MillionVerifier and Bouncer, say they can resolve some catch-alls with extra checks. The rest stay marked as risky.

### Should I send to catch-all addresses?

It depends on your bounce rate and how you got the addresses. Kickbox warns that sending to accept-all domains may raise bounces and lower open rates. Send to them in small batches and watch the results.

### Do email verifiers charge for catch-all results?

It varies. MillionVerifier says it doesn't charge for catch-alls it can't resolve. ZeroBounce, Kickbox, Emailable, Bouncer and Unspam all say unknown results are free. Unspam's example list shows risky results, catch-alls included, using a credit. ZeroBounce charges one more credit to score a catch-all.

### What is the cheapest email verifier for large lists?

Of the six here, MillionVerifier: $89 for 50,000 credits, or 1 million for $449. Bouncer is next, at $400 for 100,000.
