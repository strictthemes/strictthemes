---
title: "Mailgun pricing in 2026: Free, Basic, Foundation and Scale"
description: What Mailgun costs in 2026. The free plan's 100 emails a day, Basic, Foundation and Scale prices by volume, overage rates, log retention, dedicated IPs and validations.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Mailgun has four plans for sending email. Free sends 100 emails a day. Basic is $15 a month for 10,000 emails. Foundation is $35 a month for 50,000, and Scale is $90 a month for 100,000. Foundation and Scale rise with the volume you choose, and both come with one month free.

This guide is for developers who send email from an app. We read every number below on Mailgun's pricing page on 19 November 2026, with the currency set to US dollars.

![Mailgun's pricing page, with Free at $0, Basic at $15, Foundation at $35 and Scale at $90 a month.](/guides/mailgun-pricing/mailgun.jpg "Mailgun Send pricing, 19 November 2026")

## TL;DR

- **Free is 100 emails a day,** with 1 sending domain and 1 day of logs.
- **Basic is $15 a month for 10,000 emails,** with no daily limit. Extra emails cost from $1.80 per 1,000.
- **Foundation is $35 for 50,000 or $75 for 100,000,** with 1,000 sending domains and 5 days of logs. Extra emails from $1.30 per 1,000.
- **Scale is $90 for 100,000 and $1,250 for 2.5 million,** with 30 days of logs, SSO, dedicated IP pools and 5,000 validations.
- **Foundation and Scale are free for the first month.**
- **Logs are short on the lower plans:** 1 day on Free and Basic. That matters when you debug a missing email.

## Mailgun plans in 2026

| | Free | Basic | Foundation | Scale |
| --- | --- | --- | --- | --- |
| Price | $0 | $15 a month | From $35 a month | From $90 a month |
| Emails included | 100 a day | 10,000 a month | From 50,000 a month | From 100,000 a month |
| Extra emails, per 1,000 | Not available | From $1.80 | From $1.30 | From $1.10 |
| Sending domains | 1 | 1 | 1,000 | 1,000 |
| Log retention | 1 day | 1 day | 5 days | 30 days |
| Inbound routes | 1 | 5 | Full inbound routing | Full inbound routing |
| Free first month | No | No | Yes | Yes |

Every plan includes the REST API and SMTP relay, tracking, analytics and webhooks. Foundation adds the email template builder. Scale adds SAML single sign-on, send-time optimization, live phone and chat support, and up to 7 days of stored message content.

## Mailgun prices by volume

Mailgun's page has a slider for monthly volume. Basic stays at $15 for 10,000 emails. These are the Foundation and Scale prices at each step we read:

| Emails a month | Foundation | Scale |
| --- | --- | --- |
| 50,000 | $35 | Not offered |
| 100,000 | $75 | $90 |
| 500,000 | Not offered | $400 |
| 1,000,000 | Not offered | $700 |
| 2,500,000 | Not offered | $1,250 |
| More | Enterprise, custom price | Enterprise, custom price |

At 100,000 emails, Scale is only $15 a month more than Foundation, and adds 30 days of logs, SSO, dedicated IP pools and 5,000 validations. Above 100,000, Scale is the plan.

## Overages, validations and dedicated IPs

**Overages.** On paid plans, you can send past the included volume. Mailgun lists extra emails "from" $1.80 per 1,000 on Basic, $1.30 on Foundation and $1.10 on Scale. Mailgun writes these as "from" prices, and the page does not list the rate at every volume. At the listed rate, 50,000 emails on Basic would be $15 plus 40,000 extra at $1.80 per 1,000, or $87. Foundation at $35 is the better buy.

**Email validations** check that an address exists before you send to it. They are an add-on on Basic and Foundation, from $1.20 per 100. Scale includes 5,000, then from $0.80 per 100.

**Dedicated IPs.** Mailgun's feature table lists access to dedicated IPs from the 50,000 volume, and one dedicated IP included at volumes of 100,000 and up. Scale adds dedicated IP pools and automated IP warm-up.

**Data region.** Mailgun says you can send through the US or the EU from one account, so your data stays in the region you choose.

## Mailgun vs other email APIs on price

| Emails a month | Mailgun | SendGrid | Resend | Postmark |
| --- | --- | --- | --- | --- |
| Free tier | 100 a day | 100 a day for 60 days | 3,000 a month, 100 a day | 100 a month |
| 10,000 | $15 (Basic) | $19.95 (Essentials, 50,000) | $20 (Pro, 50,000) | $15 (Basic) |
| 50,000 | $35 (Foundation) | $19.95 | $20 | $55 |
| 100,000 | $75 (Foundation) or $90 (Scale) | $34.95 | $35 | $115 (125,000 plan) |

Mailgun is mid-priced: cheaper than Postmark, dearer than SendGrid and Resend at 50,000 and 100,000. What it offers for the price is 1,000 sending domains from Foundation up, useful if you send for many clients, and the choice of a US or EU region. See [SendGrid pricing in 2026](/guides/sendgrid-pricing/), [Resend pricing in 2026](/guides/resend-pricing/) and [Postmark pricing in 2026](/guides/postmark-pricing/).

## Before you send: check where your email lands

Mailgun's logs show whether an email was delivered, bounced or marked as spam. Delivered means the receiving server accepted it. It does not tell you whether Gmail put it in the inbox, the promotions tab or spam. Mailgun sells inbox placement in a separate product, Mailgun Optimize.

[Unspam](https://unspam.email/) runs that test too. You send your real email from Mailgun to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices.

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/mailgun-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it is not a sandbox for development email, and it does not warm up a domain or fix a blocklisting. It finds the problem; you fix it. For tools that catch email while you build, see [Mailtrap alternatives in 2026](/guides/mailtrap-alternatives/).

**Good for:** a check before launch, and after any change to your domain's DNS or your email's template.

## Which Mailgun plan should you choose?

- **Testing an integration, or a tiny app:** Free, at 100 emails a day.
- **One app, one domain, up to 10,000 emails a month:** Basic at $15.
- **50,000 emails, or many sending domains:** Foundation at $35. Try it free for a month.
- **100,000 emails or more, a team that needs SSO, or longer logs:** Scale, from $90.

## FAQ

### Is Mailgun free?

Yes, there is a free plan with 100 emails a day, 1 custom sending domain and 1 day of logs. Foundation and Scale also come with one month free before billing starts.

### How much does Mailgun cost?

Basic is $15 a month for 10,000 emails. Foundation is $35 a month for 50,000 or $75 for 100,000. Scale is $90 a month for 100,000, rising to $1,250 for 2.5 million.

### How much does Mailgun charge for extra emails?

From $1.80 per 1,000 on Basic, $1.30 on Foundation and $1.10 on Scale. The free plan has no overage.

### How long does Mailgun keep logs?

1 day on Free and Basic, 5 days on Foundation and 30 days on Scale.

### Does Mailgun include a dedicated IP?

Mailgun's table lists dedicated IP access from the 50,000 volume, and one dedicated IP included at 100,000 emails a month and up. Scale adds dedicated IP pools.

### Is Mailgun cheaper than SendGrid?

Not at 50,000 or 100,000 emails a month. Mailgun Foundation is $35 for 50,000, and SendGrid Essentials is $19.95. At 10,000, Mailgun Basic at $15 is cheaper, since SendGrid's smallest paid plan is for 50,000.
