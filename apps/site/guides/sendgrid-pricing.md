---
title: "SendGrid pricing in 2026: the 60-day trial, Essentials, Pro and overages"
description: What Twilio SendGrid costs in 2026. The free trial's 60-day limit, Email API prices from 50,000 to 2.5 million emails, what Pro adds, overages, and Marketing Campaigns.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

SendGrid, now sold as Twilio SendGrid, describes its free tier as a 60-day trial with 100 emails a day. After that, the Email API starts at $19.95 a month for 50,000 emails on Essentials, and $89.95 a month for 100,000 on Pro. Marketing email is a separate product, Marketing Campaigns, from $15 a month.

This guide is for developers who send email from an app, including apps built with a coding agent. We read every number below on SendGrid's pricing pages, now on twilio.com, and in its support docs on 19 November 2026.

![Twilio SendGrid's Email API pricing, with the Free Trial at $0 a month for 60 days and Essentials starting at $19.95 a month.](/guides/sendgrid-pricing/sendgrid.jpg "SendGrid Email API pricing, 19 November 2026")

## TL;DR

- **The free tier is described as a 60-day trial,** with 100 emails a day and no card. SendGrid's pages do not agree on what happens after day 60.
- **Essentials is $19.95 a month for 50,000 emails,** or $34.95 for 100,000. One teammate, 3 days of searchable email activity.
- **Pro starts at $89.95 a month for 100,000 emails** and goes to $1,099 for 2.5 million. It adds a dedicated IP, subusers, SSO and 1,000 teammates.
- **Overages are billed the month after,** at a rate SendGrid's support page says varies. The pricing page does not list it.
- **Marketing Campaigns is a separate plan,** from $15 a month on Basic and $60 on Advanced.

## SendGrid Email API pricing in 2026

The Email API is SendGrid's transactional product: sign-up links, receipts, password resets, sent through its API or SMTP. The price depends on the plan and the monthly volume you pick.

| Emails a month | Essentials | Pro |
| --- | --- | --- |
| Free trial | $0 for 60 days, 100 a day | $0 for 60 days, 100 a day |
| 50,000 | $19.95 | Not offered |
| 100,000 | $34.95 | $89.95 |
| 300,000 | Not offered | $249 |
| 700,000 | Not offered | $499 |
| 1,500,000 | Not offered | $799 |
| 2,500,000 | Not offered | $1,099 |
| 5,000,000 and up | Premier, custom price | Premier, custom price |

Essentials stops at 100,000 emails a month. Above that you need Pro, so the jump from 100,000 to 300,000 emails is a jump from $34.95 to $249. Prices exclude taxes.

## What each plan includes

| | Free trial | Essentials | Pro | Premier |
| --- | --- | --- | --- | --- |
| Price | $0 for 60 days | From $19.95 a month | From $89.95 a month | Custom |
| Dedicated IP | No | No | 1 included | 1 included |
| Searchable email activity | 3 days | 3 days | 7 days | 7 days |
| Teammates | 1 | 1 | 1,000 | 1,000 |
| Event webhooks | 1 | 2 | 5 | 5 |
| Email address validations | No | No | 2,500 | 5,000 |
| Subusers and single sign-on | No | No | Yes | Yes |

Every plan includes the API and SMTP, domain authentication with SPF and DKIM, link branding and suppression management. Pro and Premier can buy more dedicated IPs. Longer email activity history is for sale on every paid plan.

The teammate limit is the one that pushes small teams up. Essentials allows one teammate, so a second person who needs dashboard access means Pro.

## The free trial, and what happens after

SendGrid's trial is $0 for 60 days, sends 100 emails a day, and needs no card. Its pricing FAQ says the trial includes analytics, deliverability tools and the dynamic template editor.

The 60 days are the part to check. SendGrid's FAQ and its overage article both describe the free tier as a 60-day trial. But on the same pricing page, when you move the volume slider, the free card changes to "$0/mo" and "100 emails/day for free" with no 60-day limit. And SendGrid's billing docs describe downgrading a paid account to a free plan. The pages we read do not say what happens on day 61. If a free side project matters to you, ask SendGrid before you build on it.

During the trial you cannot go over the limit. SendGrid's overage article says the trial covers 100 emails a day for 60 days and "you can't exceed these limitations".

## Overages

On a paid plan, SendGrid sends past your plan's volume and bills the extra on the next month's invoice. Its support article says the amount "varies month-to-month", and the pricing page links to it without a rate. We found no published price per extra email.

Two more rules from that article. Upgrading does not cancel overage charges you have already run up. And accounts created through Heroku or Google Cloud do not allow overages at all; their billing follows the partner's plan.

SendGrid's own FAQ advice: if you regularly go over, upgrading to the next tier usually costs less than overages.

## Marketing Campaigns pricing

Marketing Campaigns is SendGrid's newsletter product, with its own plans priced by contacts stored and emails sent.

| Plan | Price | Up to |
| --- | --- | --- |
| Free trial | $0 for 60 days | 100 contacts, 100 emails a day |
| Basic | From $15 a month | 100,000 contacts, 300,000 emails a month |
| Advanced | From $60 a month | 200,000 contacts, 1,000,000 emails a month |
| Custom | Custom | Custom |

## Is SendGrid expensive?

At 50,000 emails a month, compared with the other developer email services we have priced:

| Service | 50,000 emails a month | Free tier |
| --- | --- | --- |
| SendGrid Essentials | $19.95 | 60-day trial, 100 a day |
| Resend Pro | $20 | 3,000 a month, 100 a day |
| Mailgun Foundation | $35 | 100 a day |
| Postmark Basic | $55 | 100 a month |
| Amazon SES | $5 to $8 | Sandbox only, 200 a day to verified addresses |

So SendGrid is cheap at 50,000 and 100,000 emails, and Amazon SES is cheaper still if you can live with AWS's console. Where SendGrid costs more is the step from Essentials to Pro, and its free tier is described as a 60-day trial. See [Resend pricing in 2026](/guides/resend-pricing/), [Mailgun pricing in 2026](/guides/mailgun-pricing/), [Postmark pricing in 2026](/guides/postmark-pricing/) and [Amazon SES pricing in 2026](/guides/amazon-ses-pricing/).

## Before you send: check where your email lands

SendGrid's activity feed shows whether an email was delivered, bounced or marked as spam. Delivered means the receiving server accepted it. It does not tell you whether Gmail put it in the inbox, the promotions tab or spam. For that you need an inbox placement test.

[Unspam](https://unspam.email/) runs that test. You send your real email from SendGrid to a seed list of inboxes at Gmail, Outlook, Yahoo and others, and it reports where each copy landed. It also scores the message against spam signals, including your domain's SPF, DKIM and DMARC records, and renders it in 60+ email clients and devices.

![Unspam's pricing page, headed Plans that scale with your sending, with the No account and Free plans.](/guides/sendgrid-pricing/unspam.jpg "Unspam's pricing page, 18 November 2026")

The free plan gives 21 tests a month, including 3 inbox placements and 5 spam tests. After that, the Custom plan is pay per test from a $5 monthly minimum: $0.50 an inbox placement and $0.18 a spam test. Its API and MCP server, so a test can run from CI or a coding agent, need the Custom plan.

What it does not do: it is not a sandbox for development email, and it does not warm up a domain or fix a blocklisting. It finds the problem; you fix it. For tools that catch email while you build, see [Mailtrap alternatives in 2026](/guides/mailtrap-alternatives/).

**Good for:** a check before launch, and after any change to your domain's DNS or your email's template.

## Which SendGrid plan should you choose?

- **Trying SendGrid out:** the free trial, described as 60 days.
- **One app, up to 100,000 emails a month, one person:** Essentials, at $19.95 or $34.95.
- **A team, or more than 100,000 emails:** Pro. It is also the plan with a dedicated IP and SSO.
- **A newsletter:** Marketing Campaigns, priced by contacts, on its own or with the Email API.
- **A side project that should stay free:** a service whose free plan is clearly permanent, such as Resend's 3,000 emails a month.

## FAQ

### Is SendGrid free?

SendGrid's FAQ describes its free tier as a 60-day trial with 100 emails a day and no card, though other parts of its pricing page show a $0 plan with no time limit. Paid plans start at $19.95 a month for 50,000 emails.

### How much does SendGrid cost?

The Email API's Essentials plan is $19.95 a month for 50,000 emails or $34.95 for 100,000. Pro is $89.95 for 100,000, rising to $1,099 for 2.5 million. Marketing Campaigns starts at $15 a month.

### What is the difference between SendGrid Essentials and Pro?

Pro adds a dedicated IP, subusers, single sign-on, email address validations, 7 days of email activity instead of 3, and up to 1,000 teammates instead of 1. It also covers volumes above 100,000 emails a month, which Essentials does not.

### What happens if I go over my SendGrid plan?

On a paid plan, the extra emails are billed on the next month's invoice, at a rate SendGrid says varies month to month. On the free trial you cannot go over the 100-a-day limit.

### Does SendGrid include a dedicated IP?

Pro and Premier include one, and can buy more. Essentials and the free trial do not.

### Does SendGrid have a free plan for marketing email?

Marketing Campaigns has the same kind of 60-day trial, with 100 contacts and 100 emails a day. Paid plans start at $15 a month on Basic.
