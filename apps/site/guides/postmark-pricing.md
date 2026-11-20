---
title: "Postmark pricing in 2026: Basic, Pro, Platform and the free plan"
description: What Postmark costs in 2026 at each volume, from the free 100 emails a month to 1.5 million, what each plan adds, the add-ons, and how it compares with Resend.
kind: Pricing
date: 2026-11-18
checked: 2026-11-18
---

Postmark sends transactional email: password resets, receipts, sign-in links. It has a free developer plan with 100 emails a month, and three paid plans whose price rises with the number of emails you send. At 10,000 emails a month, Basic is $15, Pro is $16.50 and Platform is $18.

This guide is for developers who send email from an app. It covers what each plan costs at each volume, what the plans add, the add-ons, and what Postmark does not tell you about where your email lands. We read every number below on Postmark's pricing page on 18 November 2026.

![Postmark's pricing page, headed Simple pricing that scales with your business, with a slider for monthly email volume.](/guides/postmark-pricing/postmark.jpg "Postmark's pricing page, 18 November 2026")

## TL;DR

- **The free plan is 100 emails a month, with no overages.** Postmark says it never expires. It is for testing an integration, not for running an app.
- **Paid plans are priced by volume.** At 10,000 emails a month: Basic $15, Pro $16.50, Platform $18. At 50,000: $55, $60.50 and $66.
- **Every paid plan can send past its volume.** Extra emails cost $1.80 per 1,000 on Basic, $1.30 on Pro and $1.20 on Platform at the lower volumes.
- **Pro adds inbound email and longer data retention.** Platform adds unlimited domains, servers and users.
- **Dedicated IPs start at $50 a month,** for senders of 300,000 emails a month or more, on Pro or Platform.

## Postmark pricing in 2026, by volume

The price on Postmark's page changes with a slider for how many emails you send and receive each month. These are the prices at each step:

| Emails a month | Basic | Pro | Platform |
| --- | --- | --- | --- |
| 10,000 | $15 | $16.50 | $18 |
| 50,000 | $55 | $60.50 | $66 |
| 125,000 | $115 | $126.50 | $138 |
| 300,000 | $245 | $269.50 | $294 |
| 700,000 | $455 | $500.50 | $546 |
| 1,500,000 | $775 | $852.50 | $930 |

Extra emails beyond your volume are billed per 1,000:

| Emails a month | Basic | Pro | Platform |
| --- | --- | --- | --- |
| Up to 125,000 | $1.80 | $1.30 | $1.20 |
| 300,000 and 700,000 | $1.70 | $1.25 | $1.15 |
| 1,500,000 | $1.70 | $1.20 | $1.15 |

So Pro costs 10% more than Basic, and Platform 20% more, at every volume. Overages run the other way: Pro's extra emails cost less than Basic's.

## What each Postmark plan includes

**Free.** 100 emails a month, and the pricing page says no overages are allowed. Its own suggested uses are testing your integration, trying Postmark's deliverability, and side projects with low volume.

**Basic.** For solo developers and smaller teams. Unlimited emails a day, 45 days of data retention, 5 custom sending domains, up to 4 users, and detailed analytics.

**Pro.** For startups and small businesses. Everything in Basic, plus inbound email processing, 10 sending domains, up to 6 users, and data retention you can set up to 365 days (45 by default).

**Platform.** For agencies and larger teams. Unlimited sending domains, servers, message streams and users.

Postmark's feature table also lists the REST API and SMTP, templates, webhooks, a sandbox mode for testing, bounce and spam data, and DKIM, SPF and DMARC authentication. Postmark keeps transactional and bulk email in separate message streams, so a newsletter does not share a stream with your password resets.

**Add-ons:** dedicated IPs start at $50 a month per IP, for customers who send 300,000 emails a month or more, on Pro or higher. Custom data retention starts at $5 a month, also on Pro or higher.

## Postmark vs Resend on price

Both sell transactional email to developers. At the volumes most apps start with, Resend is cheaper:

| Emails a month | Postmark Basic | Resend |
| --- | --- | --- |
| 3,000 | $15 (10,000 plan) | Free, at most 100 a day |
| 50,000 | $55 | $20 (Pro) |
| 100,000 | $115 (125,000 plan) | $35 (Pro) |

Resend's free plan is also larger: 3,000 emails a month against Postmark's 100. Where Postmark's plans differ is in what is included at every tier, such as inbound email on Pro and unlimited domains on Platform, and in having no daily limit on any paid plan. See [Resend pricing in 2026](/guides/resend-pricing/) for its plans and limits, and [SendGrid](/guides/sendgrid-pricing/), [Mailgun](/guides/mailgun-pricing/) and [Amazon SES](/guides/amazon-ses-pricing/) pricing for the others.

## Before you send: check where your email lands

Postmark's activity data shows whether each email was delivered, bounced or marked as spam. Delivered means the receiving server accepted the email. It does not tell you whether Gmail put it in the inbox, the promotions tab or spam. For that you need an inbox placement test.

[Unspam](https://unspam.email/) runs that test. For how a test differs from a warm-up tool, see [email warm-up tools in 2026](/guides/email-warm-up-tools/). You send your real email from Postmark to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices.

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/postmark-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it is not a sandbox for development email, and it does not warm up a domain or fix a blocklisting. It finds the problem; you fix it. Postmark's own sandbox mode is the place for development email, and [Mailtrap alternatives in 2026](/guides/mailtrap-alternatives/) lists more tools of that kind.

**Good for:** a check before launch, and after any change to your domain's DNS or your email's template.

## Which Postmark plan should you choose?

- **You are wiring up email and want to see it work:** the free plan, or sandbox mode.
- **One app, one sending domain, no inbound email:** Basic.
- **You process replies or inbound email, or need data for longer than 45 days:** Pro.
- **An agency with many clients, domains and people:** Platform.
- **You send 300,000 emails a month or more and want your own IP:** Pro or Platform, with a dedicated IP.

## FAQ

### How much does Postmark cost?

At 10,000 emails a month, Basic is $15, Pro is $16.50 and Platform is $18. At 50,000 they are $55, $60.50 and $66. The price rises with volume, up to $775, $852.50 and $930 at 1.5 million emails.

### Is Postmark free?

It has a free developer plan with 100 emails a month that Postmark says never expires. It allows no overages, so it is for testing an integration rather than for an app in production.

### What happens if I send more than my Postmark plan includes?

On a paid plan, extra emails are billed per 1,000: $1.80 on Basic, $1.30 on Pro and $1.20 on Platform at volumes up to 125,000, and a little less above that. The free plan allows no overages.

### What is the difference between Postmark Basic and Pro?

Pro costs 10% more and adds inbound email processing, up to 10 sending domains instead of 5, up to 6 users instead of 4, and data retention you can raise to 365 days. Its extra emails are also cheaper.

### Is Postmark cheaper than Resend?

No, at most volumes. At 50,000 emails a month Postmark Basic is $55 and Resend Pro is $20. Resend's free plan is also larger, at 3,000 emails a month against Postmark's 100.

### Does Postmark offer dedicated IPs?

Yes, from $50 a month per IP, for customers who send 300,000 emails a month or more, on Pro or higher.
