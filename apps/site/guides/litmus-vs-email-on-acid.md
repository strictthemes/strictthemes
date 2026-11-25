---
title: "Litmus vs Email on Acid in 2026 (and a cheaper third option)"
description: Litmus is now sold inside Validity Engage on a sales quote. Email on Acid has become Mailgun Inspect, from $99 a month. What each covers, what moving to Inspect means, and when a pay-per-preview tool costs less.
kind: Roundup
date: 2026-11-25
checked: 2026-11-25
---

Litmus and Email on Acid have been the two big names in email previews for years. Both show how your email will look in 100+ email clients and devices before you send it. Both are now sold inside larger products. Litmus is now part of Validity Engage, and its pricing page is a contact form. Email on Acid is now Mailgun Inspect, part of Mailgun, which Sinch owns, and its prices are on the page.

This guide compares the two, explains what the move to Mailgun Inspect means for Email on Acid customers, and adds a third option for teams that only test a few emails a month. We read every price and feature on each vendor's own pages on 25 November 2026.

## TL;DR

- **Email on Acid is now Mailgun Inspect.** Basic is $99 a month for 1,000 previews. Premium is $199 a month for 2,000 previews and adds accessibility, code, link, image and spam content checks. Extra previews are $0.15 each.
- **Litmus has no public price.** It is sold as part of Validity Engage, which bundles previews with inbox placement testing, monitoring of sent emails, address validation and competitor research. You get a price on a sales call.
- **Choose Litmus** if you want testing inside your ESP and are buying a full enterprise email platform anyway.
- **Choose Mailgun Inspect** if you want a published price, API access on every plan and an accessibility audit.
- **Consider Unspam** if you preview a few clients a few times a month or need to know whether the email reaches the inbox. It costs $0.10 per device preview, from a $5 monthly minimum, and rates drop as volume grows. On published prices it costs less than Inspect at every volume we priced, from 80 to 2,000 previews a month. It covers 60+ clients, against 100+ for the other two.

## Litmus vs Email on Acid at a glance

| | Litmus | Email on Acid (Mailgun Inspect) | Unspam |
| --- | --- | --- | --- |
| Sold as | Part of Validity Engage | Mailgun Inspect, part of Mailgun | Standalone |
| Price | Not published. Contact sales | $99 a month (Basic), $199 a month (Premium) | Free plan, then pay per test from $5 a month |
| Previews included | Set in your quote | 1,000 or 2,000 a month, then $0.15 each | 3 a month free, then $0.10 each |
| Clients and devices | 100+, with dark mode | 100+, with dark mode | 60+, with dark mode |
| Free trial | Not published | Trial with 1,000 previews | Free plan, no card |
| Spam test | 25+ spam filters | Content spam checks on Premium and Contract | Yes, with SPF, DKIM, DMARC and blacklist checks |
| Inbox placement test | In Validity Engage | No. Sold separately in Mailgun Optimize, from $49 a month | Yes, 10 seed mailboxes at 7 providers |
| Accessibility checks | Yes | Premium and Contract | A basic check in the spam test, no WCAG audit |
| Testing inside your ESP | Litmus Extension | Not listed | No |
| Monitoring after the send | Email Guardian watches sent emails for rendering changes | Not listed | Scheduled placement and spam tests (Custom plan) |
| API | Not published | Every plan | Custom plan |

## What changed in 2026

### Email on Acid became Mailgun Inspect

Email on Acid's site now says that its previews and QA tools are "now part of" Mailgun Inspect. Its pricing FAQ gives the details:

- Email on Acid subscribers began moving to Mailgun Inspect in June 2026. Customers on annual plans move at the end of their current term.
- **Existing previews and tests are not transferred.** Export or screenshot anything you need to keep before you move.
- Current subscribers will get a migration discount. Its terms were not published when we checked.
- Inspect works with any email service provider. You don't need to send through Mailgun.
- Inspect does not send email. For that you need a sending service, such as Mailgun Send.

### Litmus became part of Validity Engage

Every Litmus page now carries the line "Litmus is now part of Validity Engage." The pricing page asks for your name, company, job level and phone number, then a sales team gets in touch. Validity's own pricing page says the same: "Enterprise pricing, built to fit." There is no self-serve plan or published trial.

## Litmus

[Litmus](https://www.litmus.com/email-testing) previews your email in 100+ email clients, including dark mode. A Litmus test also checks links, images, tracking and accessibility, including color vision deficiency, and spam testing runs your email through 25+ spam filters.

![The Litmus email testing page, with the banner Litmus is now part of Validity Engage and a test panel listing previews, accessibility, links and spam testing.](/guides/litmus-vs-email-on-acid/litmus.jpg "Litmus email testing, 25 November 2026")

Two features set it apart:

- **Litmus Extension** lets you test while you build in Salesforce Marketing Cloud, Oracle Eloqua, Acoustic, Mailchimp, Adobe Marketo, Oracle Responsys, Pardot, Adobe Campaign Standard and Klaviyo, or in code editors such as Visual Studio and Sublime Text.
- **Email Guardian** keeps watching emails you have already sent, such as automated flows and templates. It alerts you when a change in an email client breaks the layout, or when a link or image breaks.

**What Validity Engage adds:** on Validity's pricing page, Engage includes previews and automated QA, real inbox placement testing with results by provider, IP and domain, sender reputation and authentication monitoring, address validation, a library of 1.2 million+ competitor campaigns, and an onboarding expert. Validity also has an MCP connector that brings Engage data into AI assistants.

**Pricing:** not published. You contact sales and get a quote.

**Limitations:** you can't see a price, start a trial or buy previews alone without a sales call. If you only need previews, you are buying into a much larger platform.

**Good for:** larger email teams on Salesforce, Adobe, Oracle or Klaviyo who want testing inside their ESP and also want deliverability, monitoring and data quality in one contract.

## Email on Acid (Mailgun Inspect)

[Mailgun Inspect](https://www.mailgun.com/products/inspect/) is the next version of Email on Acid. It previews your email in 100+ clients and devices, with dark mode. Accessibility tests check against WCAG 2.2, which matters for the European Accessibility Act, and Mailgun says they flag 45+ issues.

![The Email on Acid pricing page, with Mailgun Inspect Basic at $99 a month, Premium at $199 a month and Contract at custom pricing.](/guides/litmus-vs-email-on-acid/email-on-acid.jpg "Email on Acid pricing for Mailgun Inspect, 25 November 2026")

**Pricing:**

| Plan | Price | Previews a month | Includes |
| --- | --- | --- | --- |
| Basic | $99 a month | 1,000 | Unlimited users, 100+ clients, API access |
| Premium | $199 a month | 2,000 | Basic, plus accessibility tests, HTML code analysis, link and image validation, spam content checks |
| Contract | Custom | Custom | Everything in Premium |

Extra previews cost $0.15 each on Basic and Premium. Each client or device in a test counts as one preview, so one test across 50 clients uses 50 previews. Link validation, accessibility tests and spam testing are not counted against the allowance.

**Free trial:** the trial includes 1,000 previews. After that you are billed $0.15 per preview. Mailgun says it pauses usage if you go far over, but some overage may still be charged before the pause. Save a preview profile with only the clients you need before you start.

**Campaign Precheck** is a guided checklist before each send: subject line and preheader, accessibility, links, images, spelling, a domain blacklist check, a spam test and previews.

**Limitations:** no inbox placement test. Sinch sells that separately in [Mailgun Optimize](https://www.mailgun.com/pricing/optimize/), at $49 a month for 25 placement tests or $99 a month for 50, each with a free first month. Accessibility and the other QA checks need Premium.

![The Mailgun Optimize pricing page, with Pilot at $49 a month and Starter at $99 a month, each free for the first month.](/guides/litmus-vs-email-on-acid/mailgun-optimize.jpg "Mailgun Optimize pricing, 25 November 2026")

**Good for:** teams that want a price they can see, API access on every plan, unlimited users and an accessibility audit. It is a good fit for agencies and in-house teams that test many emails across many clients each month.

## The third option: Unspam

[Unspam](https://unspam.email/) is a smaller, pay-per-test tool. Its device previews cover 60+ real email clients and devices, including dark mode. It also sends your email to 10 seed mailboxes at 7 providers and reports where each copy landed: inbox, a tab, spam or missing. Mailgun Inspect doesn't include that, and with Litmus it comes only as part of Validity Engage. The spam test checks SPF, DKIM and DMARC, content, blacklists and HTML.

![Unspam's pricing page, with the No account and Free plans, the Free plan including 21 tests a month.](/guides/litmus-vs-email-on-acid/unspam.jpg "Unspam's pricing page, 25 November 2026")

**Pricing:** the free plan includes 21 tests a month. Three of them are device previews, and one preview is one render on one device. The Custom plan has no fixed allowance. You pay $0.10 per device preview, $0.18 per spam test and $0.50 per inbox placement, from a $5 monthly minimum. Rates drop as monthly volume grows, and every paid plan has a 14-day refund. The 13 renders on the newest devices, such as iPhone 18 Pro and New Outlook for Windows, need the Custom plan. So do the API and the MCP server.

**What it costs against Inspect:** we priced device previews alone in the calculator on Unspam's pricing page, against Inspect's published plans and its $0.15 overage. Unspam came out cheaper at every volume we tried. The gap is largest for small teams, and it narrows near 1,000 previews, where Inspect Basic's allowance is used in full. Inspect's Contract plan is priced on request, so we could not compare it.

| Your testing each month | Unspam | Mailgun Inspect |
| --- | --- | --- |
| 4 emails × 20 clients = 80 previews | $8 | $99 (Basic) |
| 12 emails × 40 clients = 480 previews | $42.36 | $99 (Basic) |
| 1,000 previews | $81.50 | $99 (Basic) |
| 2,000 previews | $156.50 | $199 (Premium, with the QA checks), or $249 on Basic with overage |

**Limitations:** fewer clients, 60+ against 100+. No ESP extension, no pre-send checklist, no WCAG accessibility audit, and no monitoring of sent emails for rendering changes. The free plan's 3 previews are 3 renders in total, enough to try it but not to QA a campaign.

**Good for:** small teams, freelancers and developers who test a handful of clients a few times a month, and anyone who also needs to know whether the email reaches the inbox, not only how it looks.

## Which one should you choose?

- **You run email on Salesforce, Adobe, Oracle or Klaviyo, at enterprise scale:** Litmus, through Validity Engage. You get testing inside the ESP, monitoring after the send, and deliverability on the same contract.
- **You want previews with a price on the page:** Mailgun Inspect. Basic covers previews only. Premium is the plan to compare with Litmus, because it adds the QA checks.
- **You were on Email on Acid:** you are moving to Inspect either way. Save old previews and tests you want to keep, and wait for the migration discount before you choose a plan.
- **You need accessibility checks for the European Accessibility Act:** Inspect Premium, or Litmus.
- **You test a few emails across a few clients:** Unspam. 80 previews a month cost $8 instead of $99.
- **You need to know where mail lands, not only how it looks:** Unspam includes seed placement tests. With Mailgun it is Optimize, from $49 a month. With Litmus it is part of Validity Engage.

If you also design the emails, [design tokens in HTML email](/guides/design-tokens-in-html-email/) covers keeping colors and type consistent across clients.

## FAQ

### Is Email on Acid still available?

Email on Acid's site is still up, but its pricing page sells Mailgun Inspect. Its FAQ says current subscribers began moving to Inspect in June 2026, with annual plans moving at the end of their term. Previews and tests are not carried over.

### Is Litmus or Email on Acid cheaper?

We can't say for sure, because Litmus doesn't publish a price. Mailgun Inspect starts at $99 a month for 1,000 previews. Litmus is sold as part of Validity Engage on an enterprise quote, which also covers deliverability and data products. For previews alone, Inspect is the one with a known entry price.

### Does Litmus have a free trial?

None is published. Litmus's pricing page is a contact form for the Validity sales team.

### Do Litmus and Email on Acid test inbox placement?

Litmus does through Validity Engage, which includes real inbox placement testing. Mailgun Inspect does not. Sinch sells placement tests in Mailgun Optimize, from $49 a month for 25 tests. Unspam includes them in its free plan, 3 a month, then $0.50 each.

### How are previews counted?

On Mailgun Inspect and Unspam, each client or device in a test is one preview. A test on 50 clients uses 50 previews. Litmus sets its limits in the quote.

### What is the cheapest way to preview emails in Outlook and Gmail?

If you only check a few clients, a pay-per-preview tool costs least. Unspam charges $0.10 per device, from a $5 monthly minimum, with 3 previews free each month. At 1,000 previews a month it is $81.50 against $99 for Mailgun Inspect Basic. Inspect covers more clients, 100+ against 60+, and includes accessibility, code, link and image checks on Premium.
