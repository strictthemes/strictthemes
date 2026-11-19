---
title: "Brevo pricing in 2026: the free plan, Starter, Standard and email credits"
description: What Brevo costs in 2026. The free plan's 300 emails a day, Starter and Standard prices by email volume, Professional, pay-as-you-go email credits, and transactional email.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Brevo prices its plans by the number of emails you send a month, and each volume comes with a contact allowance. The free plan sends up to 300 emails a day. Starter is $9 a month for 5,000 emails, Standard is $18, and Professional starts at $499 for 150,000. If you send rarely, you can buy email credits that never expire instead of a plan.

This guide is for anyone who sends marketing or transactional email through Brevo, including developers who send from an app. We read every number below on Brevo's pricing pages on 19 November 2026, with the currency set to US dollars. The page showed us euros by default, so check the currency switch when you compare.

![Brevo's pricing page in US dollars, with Starter, Standard, Professional and Enterprise plans.](/guides/brevo-pricing/brevo.jpg "Brevo's pricing page, shown with yearly billing, 19 November 2026")

## TL;DR

- **The free plan sends up to 300 emails a day,** with no card. Brevo's FAQ says you can send once it approves your account.
- **Starter is $9 a month for 5,000 emails,** rising with volume: $17 for 10,000, $32 for 20,000, $56 for 50,000 and $82 for 100,000.
- **Standard is $18 a month for 5,000 emails** and adds automation, A/B testing and no Brevo logo.
- **Yearly billing takes 10% off.** Starter at 5,000 emails is $8.08 a month on a yearly plan.
- **Pay-as-you-go credits** are $32 for 5,000 emails, with no daily limit and no expiry.
- **Transactional email, by API and SMTP, is on every plan,** including the free one.

## Brevo plans in 2026

| Plan | Monthly billing | Yearly billing, per month | Emails a month | What it adds |
| --- | --- | --- | --- | --- |
| Free | $0 | $0 | Up to 300 a day | Email campaigns, transactional email |
| Starter | From $9 | From $8.08 | From 5,000 | Advanced segmentation, AI content tools |
| Standard | From $18 | From $16.17 | From 5,000 | Automation, A/B testing, no Brevo logo |
| Professional | From $499 | From $449.08 | From 150,000 | WhatsApp and push, 10 seats, phone support |
| Enterprise | Custom | Custom | Custom | Dedicated IP, SSO, multiple accounts |

On Starter, removing the "Sent with Brevo" footer is an add-on at $10.80 a month. Standard includes it.

## Starter and Standard prices by email volume

Brevo's plan builder sets the price by the emails you send each month, counting campaigns and transactional email together. These are the monthly-billing prices we read:

| Emails a month | Starter | Standard |
| --- | --- | --- |
| 5,000 | $9 | $18 |
| 10,000 | $17 | Not read |
| 20,000 | $32 | $69 |
| 50,000 | $56 | Not read |
| 100,000 | $82 | $139 |

Standard costs more at every volume, and the gap grows: at 100,000 emails it is $57 a month more than Starter. What you get for it is marketing automation, A/B testing, send-time optimization, a landing page and no Brevo logo. If you only send newsletters and transactional email, Starter plus the logo add-on is usually cheaper.

The plan builder also lists a contact allowance for each volume: on Starter, 500 contacts at 5,000 emails and 1,500 at 10,000. Check it there before you pick a size.

## The free plan

Brevo's FAQ describes the free plan as the way to try Brevo: you create an account, upload contacts, and once Brevo approves the account for sending, you can send up to 300 emails a day. No card is needed.

300 a day is about 9,000 a month, more than most free plans. The limit is per day, though. A newsletter to 1,000 subscribers does not fit in one day on the free plan. Emails also carry Brevo's logo until you pay.

## Pay-as-you-go email credits

Instead of a monthly plan, you can buy email credits. Brevo's pay-as-you-go page priced 5,000 credits at $32. One email sent uses one credit. Credits do not expire, have no daily sending limit, and remove the Brevo logo. Brevo's FAQ notes that pay-as-you-go does not include phone support.

At 5,000 emails, credits cost more than a month of Starter. They make sense if you send a few campaigns a year rather than every month.

## Transactional email on Brevo

Brevo's FAQ says every plan includes transactional email: a REST API, SMTP relay, outbound webhooks and unlimited log retention. On the free plan, transactional email counts toward the same 300 a day. On paid plans it counts toward your monthly volume.

Brevo's transactional page says dedicated IPs are available for high-volume senders. On the pricing page, a dedicated IP is listed under Enterprise.

For developers who only need transactional email, an email API priced for that job can cost less. At 50,000 emails a month, Resend Pro is $20 and SendGrid Essentials is $19.95, against $56 for Brevo Starter. Brevo's case is that the same account runs your newsletters, forms and automation. See [Resend pricing in 2026](/guides/resend-pricing/) and [SendGrid pricing in 2026](/guides/sendgrid-pricing/). For a contact-priced newsletter tool, see [Mailchimp pricing in 2026](/guides/mailchimp-pricing/).

## Before you send: check where your email lands

Brevo's reports show opens, clicks, bounces and spam complaints. A delivered email was accepted by the receiving server. That does not tell you whether Gmail put it in the inbox, the promotions tab or spam. For that you need an inbox placement test.

[Unspam](https://unspam.email/) runs that test. You send your real email from Brevo to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices.

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/brevo-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it does not send your campaigns, warm up a domain or fix a blocklisting. It finds the problem; you fix it.

**Good for:** a check before a big campaign, and after any change to your domain's DNS or your template.

## Which Brevo plan should you choose?

- **A small list, a few sends a month:** the free plan, if 300 emails a day is enough and the Brevo logo is fine.
- **A newsletter sent every week or month:** Starter at your volume, with the logo add-on if you need it.
- **Welcome series, abandoned carts or other automation:** Standard.
- **A few campaigns a year:** pay-as-you-go credits, which do not expire.
- **A team, WhatsApp or push campaigns, phone support:** Professional.
- **Transactional email only, from an app:** compare an email API first; Brevo works, but you pay for marketing features you may not use.

## FAQ

### Is Brevo free?

Yes. The free plan sends up to 300 emails a day with no card, once Brevo approves your account. Emails carry the Brevo logo, and you get transactional email through the API and SMTP as well.

### How much does Brevo cost per month?

Starter starts at $9 a month for 5,000 emails and Standard at $18, with monthly billing. Prices rise with volume: Starter is $82 a month for 100,000 emails. Professional starts at $499 a month for 150,000 emails. Yearly billing takes 10% off.

### Does Brevo charge by contacts or by emails?

Mainly by emails. Brevo prices Starter and Standard by the number of emails you send each month, counting campaigns and transactional email together. Each volume includes a contact allowance: on Starter, the plan builder showed 500 contacts at 5,000 emails and 1,500 at 10,000.

### What is the difference between Brevo Starter and Standard?

Standard adds marketing automation, A/B testing, send-time optimization, detailed email reports, web tracking and a landing page, and removes the Brevo logo. It costs about twice as much as Starter at 5,000 and 20,000 emails, and about 1.7 times as much at 100,000.

### Do Brevo email credits expire?

No. Brevo's pay-as-you-go credits have no expiry date and no daily sending limit. We read a price of $32 for 5,000 credits.

### Can I send transactional email on Brevo's free plan?

Yes. Brevo's FAQ says all plans include transactional email, with an API, SMTP relay and webhooks. On the free plan it shares the 300-a-day limit with your campaigns.
