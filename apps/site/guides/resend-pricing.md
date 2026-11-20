---
title: "Resend pricing in 2026: free tier, Pro, Scale and overages"
description: What Resend costs in 2026 for transactional and marketing email, what the free plan's 100-a-day limit means, how overages work, and what to check before your first send.
kind: Pricing
date: 2026-11-18
checked: 2026-11-18
---

Resend is an email API for developers. Its transactional email is free for 3,000 emails a month, at most 100 a day. Pro is $20 a month for 50,000 emails, and Scale starts at $90 a month for 100,000. Marketing email is priced separately, by the number of contacts.

This guide is for developers who send email from an app, including apps built with a coding agent. It covers the plans, the free tier's limits, what happens when you go over, and the account rules that can pause sending. We read every number below on Resend's pricing page and in its docs on 18 November 2026.

![Resend's pricing page, with Free at $0, Pro at $20 and Scale at $90 a month for transactional email.](/guides/resend-pricing/resend.jpg "Resend's pricing page, 18 November 2026")

## TL;DR

- **Free is $0 for 3,000 transactional emails a month, at most 100 a day,** on up to 3 domains. Resend calls it free forever. There is no trial of the paid plans.
- **Pro is $20 a month for 50,000 emails, or $35 for 100,000,** with no daily limit and 10 domains.
- **Scale starts at $90 a month for 100,000 emails** and goes to $1,150 for 2.5 million, with 1,000 domains and a dedicated IP as an add-on.
- **Overages are off by default.** Without them, sending stops at your monthly quota. With them on, extra emails cost $0.90 per 1,000 on Pro.
- **Marketing email is a separate plan,** priced by contacts: free for 1,000, then $40 a month for 5,000.
- **Resend bills monthly only.** Its FAQ says there are no annual plans.

## Resend transactional pricing in 2026

Transactional email is anything you send through Resend's `/emails` API: sign-up links, password resets, receipts.

| Plan | Price a month | Emails a month | Extra emails, per 1,000 |
| --- | --- | --- | --- |
| Free | $0 | 3,000 | Not available |
| Pro | $20 | 50,000 | $0.90 |
| Pro | $35 | 100,000 | $0.90 |
| Scale | $90 | 100,000 | $0.90 |
| Scale | $160 | 200,000 | $0.80 |
| Scale | $350 | 500,000 | $0.70 |
| Scale | $650 | 1,000,000 | $0.65 |
| Scale | $825 | 1,500,000 | $0.52 |
| Scale | $1,150 | 2,500,000 | $0.46 |
| Enterprise | Custom | Custom | Custom |

Free has a daily limit of 100 emails and 3 domains. The paid plans have no daily limit; Pro includes 10 domains and Scale 1,000.

Pro at 100,000 emails costs less than Scale at the same volume. What Scale adds is 1,000 domains, 10 webhook endpoints instead of 5, a dedicated Slack channel, and access to a dedicated IP.

Data is kept for 30 days on every plan except Enterprise, where it is set by contract. Resend's FAQ says open and link tracking works on every plan, including Free. Every plan also includes 3 inboxes, Resend's feature for receiving email; extra inboxes are $1 a month each on paid plans.

**Add-ons:** 100 more domains for $20 a month on Pro and Scale. A dedicated IP for $30 a month, only on Scale and only if you send more than 3,000 emails a day. Single sign-on for $150 a month on Scale.

## What the free plan includes, and where it stops

Resend's quota docs set the free plan's limits:

- **100 emails a day and 3,000 a month.** The day is a UTC calendar day.
- **Received email counts too.** Each email that arrives at a Resend inbox uses one email of the quota, like a sent one.
- **Every recipient counts.** An email with three addresses in To, CC or BCC counts as three.
- **When the quota is used, the API says no.** It returns a 429 error, and Resend does not queue or retry that email. You send it again after the quota resets, or after you upgrade.

The 100-a-day limit is the one that bites. A launch day with 150 sign-ups fails on the 101st confirmation email, even though the month's total is far below 3,000.

## Overages: what happens when you send more

On a paid plan, Resend can keep sending past your monthly quota. Its docs call this pay-as-you-go, and it is **off until a team admin turns it on**. While it is off, sending stops at the quota until the next billing cycle, and Resend offers to upgrade your plan.

When it is on, extra emails are billed in blocks of 1,000 at your plan's overage rate. There is a cap: by default you can send up to five times your monthly quota in a cycle, and an admin can set the cap from 100% to 1,000% of the quota. Past the cap, sending pauses until the next cycle.

Resend's own docs note that overages can cost more per email than the next plan up. If you go over every month, upgrade.

## Marketing email pricing

Marketing email is sent with Resend's Broadcasts, to a list of contacts. It has its own plans, priced by how many contacts you have, with no limit on how many emails you send to them.

| Plan | Price a month | Contacts | Domains |
| --- | --- | --- | --- |
| Free | $0 | 1,000 | 3 |
| Pro marketing | $40 | 5,000 | Unlimited |
| Enterprise | Custom | Custom | Unlimited |

Broadcast emails do not count against your transactional quota. They can only go to contacts you have added, while transactional email can go to any address.

## The rules that can pause your sending

Price is not the only limit. Resend's quota docs set three account rules that apply on every plan:

- **Bounce rate under 4%.** Above that, Resend may pause sending until it comes down.
- **Spam complaint rate under 0.08%.** The same: a temporary pause.
- **10 API requests a second,** per team, shared by all your API keys. An 11th request in the same second gets a 429. Upgrading does not raise it. The batch API sends up to 100 emails in one request, which counts as one.

The first two are about the quality of what you send, not how much. Resend's docs suggest using its test addresses instead of made-up ones while you build, because fake addresses bounce.

## Before you send: check where your email lands

Resend's dashboard shows whether an email was delivered, bounced or marked as spam. Delivered means the receiving server accepted it. It does not tell you whether Gmail put it in the inbox, the promotions tab or spam. For that you need an inbox placement test.

[Unspam](https://unspam.email/) runs that test. You send your real email from Resend to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices. For how a test differs from a warm-up tool, see [email warm-up tools in 2026](/guides/email-warm-up-tools/).

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/resend-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it is not a sandbox for development email, and it does not warm up a domain or fix a blocklisting. It finds the problem; you fix it. For tools that catch email while you build, see [Mailtrap alternatives in 2026](/guides/mailtrap-alternatives/).

**Good for:** a check before launch, and after any change to your domain's DNS or your email's template.

## Is Resend expensive?

At low volume it is one of the cheaper options. Postmark, for comparison, charges $15 a month for 10,000 emails on its Basic plan; see [Postmark pricing in 2026](/guides/postmark-pricing/). At 50,000 emails, Resend's Pro is $20 and Postmark's Basic is $55. For the other big email APIs, see [SendGrid pricing](/guides/sendgrid-pricing/), [Mailgun pricing](/guides/mailgun-pricing/) and [Amazon SES pricing](/guides/amazon-ses-pricing/).

Three things raise a Resend bill: going over the quota with overages on, needing Scale for the domains or a dedicated IP, and a marketing list that grows past 5,000 contacts.

## Which Resend plan should you choose?

- **A side project or an app before launch:** Free. Watch the 100-a-day limit on launch day.
- **An app in production with up to 100,000 emails a month:** Pro, at $20 or $35. Turn on overages with a cap you can afford.
- **Many sending domains, such as one per customer, or a dedicated IP:** Scale.
- **A newsletter:** a marketing plan, priced by contacts, on top of or instead of a transactional one.

## FAQ

### Is Resend free?

Yes. The free plan sends 3,000 transactional emails a month, at most 100 a day, from up to 3 domains, and Resend calls it free forever. Marketing email is free for up to 1,000 contacts.

### How much does Resend cost?

Transactional Pro is $20 a month for 50,000 emails or $35 for 100,000. Scale is $90 a month for 100,000 emails, rising to $1,150 for 2.5 million. Marketing Pro is $40 a month for 5,000 contacts.

### What happens if I go over Resend's limit?

On the free plan, the API returns a 429 error and the email is not sent or queued. On a paid plan, sending stops at your monthly quota unless an admin has turned on pay-as-you-go, which bills extra emails in blocks of 1,000 up to a cap.

### Does Resend have annual pricing?

No. Resend's FAQ says it only offers monthly plans. Registered nonprofits can apply for 50% off paid plans.

### Do received emails count against Resend's quota?

Yes. Resend's docs say each email received counts as one email against your daily and monthly limits, just like a sent email.

### How do I know if Resend email reaches the inbox?

Resend reports delivery, bounces and spam complaints. To see whether an email lands in the inbox, promotions or spam at each provider, send it to an inbox placement test such as Unspam's before a launch or a big send.
