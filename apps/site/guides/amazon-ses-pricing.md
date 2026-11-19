---
title: "Amazon SES pricing in 2026: the new plans, à la carte rates and the sandbox"
description: What Amazon SES costs in 2026. The Essentials, Pro and Enterprise plans new accounts now start on, the $0.10 per 1,000 à la carte rate, attachments, dedicated IPs, and the sandbox limits.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Amazon SES is the cheapest of the big email services per email, but its pricing changed in 2026. SES now has three plans, Essentials, Pro and Enterprise. Since 21 July 2026, new accounts start on Essentials at $0.16 per 1,000 emails. The old pay-as-you-go rate of $0.10 per 1,000 still exists as "à la carte" pricing, and you can switch to it at any time.

This guide is for developers who send email from an app on AWS or anywhere else. We read every number below on the Amazon SES pricing page and in the SES developer guide on 19 November 2026.

![The Amazon SES pricing page, with the Essentials, Pro and Enterprise plans priced per 1,000 emails.](/guides/amazon-ses-pricing/ses.jpg "Amazon SES pricing plans, 19 November 2026")

## TL;DR

- **New accounts start on Essentials at $0.16 per 1,000 emails,** with no monthly fee. That applies to accounts with no SES activity since 1 June 2025.
- **À la carte is $0.10 per 1,000 emails,** with each extra feature billed on its own. You can switch to it any time, and AWS says a first switch from a default plan takes effect at once.
- **Pro is $0.22 per 1,000 plus $105 a month,** and includes managed dedicated IPs, email validation and deliverability tools. Enterprise is $0.23 per 1,000 plus $500.
- **Attachments add $0.12 per GB.** Receiving email is $0.10 per 1,000 on à la carte.
- **New accounts are in a sandbox:** 200 emails a day, 1 a second, and only to addresses you have verified, until AWS grants production access.

## Amazon SES plans in 2026

| Emails a month | Essentials | Pro | Enterprise |
| --- | --- | --- | --- |
| Up to 10 million | $0.16 per 1,000 | $0.22 per 1,000 | $0.23 per 1,000 |
| 10 to 100 million | $0.14 per 1,000 | $0.17 per 1,000 | $0.18 per 1,000 |
| Over 100 million | $0.11 per 1,000 | $0.12 per 1,000 | $0.13 per 1,000 |
| Monthly fee per account, per region | None | $105 | $500 |

The tiers apply in steps, like tax brackets: each rate only covers the emails within its tier. An email sent to three recipients counts as three.

**What the plans include.** All three include sending through the API or SMTP, and SES's own deliverability dashboard. Pro adds managed dedicated IPs, email validation with 2,500 API checks a month, and global deliverability monitoring with 5 seed list tests. Enterprise adds multi-region endpoints, tenants to separate senders, 12 dedicated IPs and 25 seed list tests. On Essentials, those features are paid add-ons.

## À la carte pricing

À la carte is the pricing SES had before the plans: no monthly fee, and you pay only for what you use. AWS's footnote says new accounts can "upgrade or switch to à-la-carte pricing at any time".

| What | Price |
| --- | --- |
| Outbound email | $0.10 per 1,000 |
| Attachment data | $0.12 per GB |
| Inbound email | $0.10 per 1,000, plus $0.09 per 1,000 chunks of 256 KB |
| Dedicated IP, standard | $24.95 a month per IP |
| Dedicated IP, managed | $15 a month, plus $0.08 per 1,000 emails up to 10 million |
| Email validation | $0.01 per address checked by API |
| Deliverability dashboard | $0.07 per 1,000 emails up to 10 million |
| Global deliverability monitoring | $1,250 a month |

So for plain sending, à la carte is 37.5% cheaper than Essentials: $0.10 against $0.16 per 1,000. Essentials is worth its rate if you would otherwise pay for its included features one by one.

## What Amazon SES costs, worked out

From the rates above, for messages without attachments:

| Emails a month | À la carte | Essentials | Pro |
| --- | --- | --- | --- |
| 10,000 | $1 | $1.60 | $107.20 |
| 50,000 | $5 | $8 | $116 |
| 250,000 | $25 | $40 | $160 |
| 2,000,000 | $200 | $320 | $545 |

AWS's own examples add attachment data. Its first example, 250,000 emails of 32 KB each on Essentials, comes to $40.96 a month: $40 for the emails and $0.96 for the data.

Other AWS services can add to the bill. AWS's pricing page names EC2 for the app that sends, S3 for storing received email, SNS for notifications and CloudWatch for custom metrics.

## The SES sandbox

AWS's developer guide says every new SES account starts in a sandbox, separately in each AWS region. In the sandbox:

- You can only send to addresses and domains you have verified, or to SES's mailbox simulator.
- You can send at most 200 emails in 24 hours.
- You can send at most 1 email a second.

To leave it, you request production access in the SES console, saying whether you send marketing or transactional email. AWS says that if it can, it grants the request within 96 hours, and that it may ask for more information first.

So SES has no free plan in the usual sense. New AWS customers get up to $200 in AWS Free Tier credits that can be spent on SES, and a free account plan for 6 months. The sandbox is for building and testing, not for sending to customers.

## Is Amazon SES the cheapest option?

On price per email, yes. At 50,000 emails a month, SES à la carte is $5, against $19.95 for SendGrid Essentials, $20 for Resend Pro, $35 for Mailgun Foundation and $55 for Postmark Basic.

What you give up is help around the email. SES gives you the sending and leaves much of the rest to you: getting out of the sandbox, setting up DNS records, and handling bounces and complaints in your own code. See [SendGrid pricing in 2026](/guides/sendgrid-pricing/), [Resend pricing in 2026](/guides/resend-pricing/), [Mailgun pricing in 2026](/guides/mailgun-pricing/) and [Postmark pricing in 2026](/guides/postmark-pricing/).

## Before you send: check where your email lands

SES reports deliveries, bounces and complaints. Delivered means the receiving server accepted the email. It does not tell you whether Gmail put it in the inbox, the promotions tab or spam. SES's global deliverability monitoring includes seed list tests, but it starts at $1,250 a month on à la carte or Essentials.

[Unspam](https://unspam.email/) runs inbox placement tests for less. You send your real email from SES to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices.

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/amazon-ses-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it is not a sandbox for development email, and it does not warm up a domain or fix a blocklisting. It finds the problem; you fix it. For tools that catch email while you build, see [Mailtrap alternatives in 2026](/guides/mailtrap-alternatives/).

**Good for:** a check before launch, and after any change to your domain's DNS or your email's template.

## Which Amazon SES pricing should you choose?

- **You just send email and handle deliverability yourself:** switch to à la carte. It is the lowest price per email.
- **You want dedicated IPs, validation and deliverability reports from SES:** Pro, if their à la carte prices would add up to more than $105 a month.
- **Many senders or brands in one account, or sending from two regions:** Enterprise.
- **You left the default:** you are on Essentials at $0.16 per 1,000. Check that it is what you want.

## FAQ

### How much does Amazon SES cost?

À la carte, $0.10 per 1,000 emails plus $0.12 per GB of attachments, with no monthly fee. New accounts start on the Essentials plan at $0.16 per 1,000 emails up to 10 million a month. Pro is $0.22 per 1,000 plus $105 a month.

### Is Amazon SES free?

There is no free sending plan. New AWS customers get up to $200 in Free Tier credits that can be used on SES. New SES accounts also start in a sandbox, limited to 200 emails a day to verified addresses.

### What are the Amazon SES pricing plans?

Since 21 July 2026, SES has three plans: Essentials at $0.16 per 1,000 emails with no monthly fee, Pro at $0.22 per 1,000 plus $105 a month, and Enterprise at $0.23 per 1,000 plus $500 a month. Rates fall above 10 million and 100 million emails a month.

### What are the Amazon SES sandbox limits?

In the sandbox you can send only to verified addresses and domains, at most 200 emails in 24 hours and 1 a second. You request production access in the SES console, and AWS says it aims to answer within 96 hours.

### How much is a dedicated IP on Amazon SES?

À la carte, a standard dedicated IP is $24.95 a month. Managed dedicated IPs, which SES warms up for you, are $15 a month plus a fee per email. Pro includes one managed dedicated IP.

### Does Amazon SES charge for receiving email?

Yes. À la carte, inbound email is $0.10 per 1,000 emails plus $0.09 per 1,000 chunks of 256 KB of incoming data.
