---
title: "Vercel pricing in 2026: Hobby, Pro and the commercial-use rule"
description: What Vercel's Hobby and Pro plans cost in 2026, what Hobby's personal, non-commercial rule means for client sites, and how Pro's seats, credit and CDN tiers add up.
kind: Pricing
date: 2026-11-18
checked: 2026-11-18
---

Vercel has three plans: Hobby is free, Pro is $20 a month, and Enterprise is priced on request. The price is the easy part. The parts that catch people out are a line in the terms, which limits Hobby to personal or non-commercial use, and the way Pro adds seats, usage credit and CDN tiers on top of the $20.

This guide is for anyone who deploys to Vercel, including sites built with v0 or a coding agent and pushed from a repository. We read every number below on Vercel's pricing page, its docs and its terms of service on 18 November 2026.

![Vercel's pricing page, with Hobby at $0, Pro at $20 a month and Enterprise at a custom price.](/guides/vercel-pricing/vercel.jpg "Vercel's pricing page, 18 November 2026")

## TL;DR

- **Hobby is free, but only for personal or non-commercial use.** That is in Vercel's terms of service. A client's site or your company's site does not fit that description.
- **Pro is $20 a month for one deploying seat, with $20 of usage credit.** Each extra seat that can deploy is $20 a month. Viewer seats are free.
- **Pro's CDN traffic is billed by tier, not per GB.** The tier included with Pro covers 1 TB of data transfer a month, and paid tiers start at $20 a month.
- **Hobby has hard caps.** You cannot buy more usage. In most cases, if you go over, you wait 30 days.
- **For a commercial site that is only static files,** a $6 a month flat-price host costs less than Pro. See [the end of this guide](#if-your-site-is-only-static-files).

## Vercel plans and prices in 2026

| Plan | Price | Use allowed | Usage | Team |
| --- | --- | --- | --- | --- |
| Hobby | $0 | Personal or non-commercial only | Fixed monthly caps, no extra usage for sale | One person |
| Pro | $20 a month | Any | $20 credit a month, then billed on demand | 1 deploying seat included, more at $20 a month each, unlimited free viewers |
| Enterprise | Custom | Any | Custom | Custom |

Prices are in US dollars and exclude VAT, GST and other taxes, which Vercel adds based on your billing address.

## The Hobby plan and the commercial-use rule

Section 4 of Vercel's terms of service is short. It says you may use the Hobby plan only "for your personal or non-commercial use". The same section says Vercel may change or end the plan, and may disable or remove a Hobby deployment with or without notice.

The terms we read do not list examples of commercial use. So read the rule at face value. A site that sells something, advertises a business, or is made for a paying client is commercial. A personal portfolio, a side project that earns nothing, or a demo you share with friends fits Hobby. If you are unsure about your case, ask Vercel before you launch, not after.

What Hobby includes each month, from Vercel's Hobby plan docs:

| Resource | Included on Hobby |
| --- | --- |
| Fast data transfer | 100 GB |
| CDN requests | 1,000,000 |
| Function invocations | 1,000,000 |
| Active CPU | 4 hours |
| Image transformations | 5,000 |
| Projects | 200 |
| Deployments | 100 a day |

On Hobby you cannot buy more. Vercel's docs say that in most cases, if you go over a limit, you wait until 30 days have passed before you can use that feature again.

Vercel also has two ways to deploy without an account. Vercel Drop takes a static folder in the browser, and `vercel deploy --temporary` deploys from the terminal. Vercel's pricing page says these temporary deployments expire unless you claim them to a free Hobby account. So they are previews, not hosting.

## What Pro costs once you use it

Pro is $20 a month. That buys one seat that can deploy, and $20 of usage credit to spend across Vercel's metered resources. After the credit is spent, usage is billed on demand. Credit you do not use expires at the end of the month.

**Seats.** Each extra member who deploys or configures projects is $20 a month. Viewer seats, which can see deployments and analytics but not change production, are free. So a team of three developers pays $60 a month before any usage.

**CDN traffic.** Pro bills CDN traffic through what Vercel calls Flat Rate CDN: you pay for a capacity tier, not per GB. Vercel's Flat Rate CDN docs, last updated 14 September 2026, list these tiers:

| Tier | CDN requests a month | Data transfer a month |
| --- | --- | --- |
| Included with Pro | 1 million | 1 TB |
| $20 a month | 10 million | 50 TB |
| $100 a month | 50 million | 50 TB |
| $300 a month | 150 million | 50 TB |

If your usage for a month goes over your tier, Vercel moves you to a higher tier from the next billing cycle. A spike on a single day does not. The docs also exclude some uses from the flat rate, such as bulk file downloads and using the CDN as file storage.

One number did not match. The Markdown version of Vercel's pricing page lists 10 million CDN requests a month as included with Pro, where the Flat Rate CDN docs say 1 million. If requests matter for your site, check the billing page in your dashboard.

**Functions and other usage.** Compute is billed on demand once the credit is spent: active CPU from $0.128 an hour, function invocations at $0.60 per million, and image transformations at $0.05 per thousand.

**Add-ons worth knowing.** Password protection for a deployment is $20 a month per protected project. Extra build speed is billed by the minute, from $0.014 a minute for standard build machines.

## How to keep a Pro bill under control

Vercel's pricing page says new Pro teams start with an on-demand budget of $200 a month, with email, web and SMS alerts as you approach it. You can change the amount. When the budget is reached, you can choose to have Vercel pause all projects. That is a hard limit: the bill stops, but so does the site.

Two habits help. Set the budget to what you would actually pay, not the default. And look at the usage page in the first week after a launch, when a bad cache setting or a crawler is cheapest to catch.

## If your site is only static files

Vercel is built for apps: Next.js, functions, previews for every branch. If your site uses those, Pro is a fair price for having them in one place.

If your site is a folder of HTML, CSS and images that earns money, Hobby is not allowed and Pro is $20 a month for features you may not use. Three hosts to compare:

| Host | Price | Commercial sites | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Not restricted on the limits page | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Not for sites mainly for commercial transactions or SaaS | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it directly.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/vercel-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do matters as much. There is no free plan, only a 7-day trial on a free subdomain. It runs no server code, so a Next.js app with server rendering or API routes will not work there. It does not build from Git: you upload the built folder, or deploy it with its API or GitHub Action. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a client site, a landing page or a portfolio that earns money, where a fixed bill matters more than a build pipeline.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, one build at a time, 20,000 files per site and 100 custom domains per project. Its limits page lists no bandwidth limit for static files. You can connect a Git repository or upload a folder directly. Each file can be at most 25 MiB, and the dashboard is made for developers.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/vercel-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who are at home in Cloudflare's dashboard and want to pay nothing.

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories. GitHub sets a 1 GB maximum site size and a soft limit of 100 GB of bandwidth a month. Its limits page says Pages is not for a site whose main purpose is commercial transactions or software as a service. So a shop is out, while a company's documentation is a common use.

![The GitHub Pages documentation home page.](/guides/vercel-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation, open source projects and personal sites that already live on GitHub.

For more hosts, see the Vercel alternatives compared on [bootstrap.build](https://bootstrap.build/articles/vercel-alternatives/) and [WebDesignerHut](https://webdesignerhut.com/vercel-alternatives/), and [Netlify vs Vercel](https://bootstrap.build/articles/netlify-vs-vercel/). For Netlify's credit plans, see [Netlify pricing in 2026](/guides/netlify-pricing/).

## Which Vercel plan should you choose?

- **A personal project or a demo that earns nothing:** Hobby. Know that it has hard caps, and that Vercel can remove Hobby deployments at its discretion.
- **Anything commercial, or a Next.js app with server features:** Pro. Budget $20 a month per developer who deploys, plus any usage beyond the $20 credit.
- **A team where only one or two people deploy:** Pro, with everyone else on free viewer seats.
- **A commercial site that is only static files:** a flat-price host such as Static.app, or Cloudflare Pages if you want free and are fine in its dashboard.

Whichever plan you pick, check the live page as well as the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### How much does Vercel cost in 2026?

Hobby is free for personal or non-commercial use. Pro is $20 a month, which includes one deploying seat and $20 of usage credit; extra deploying seats are $20 a month each. Enterprise is priced on request.

### Can I use Vercel's free plan for a commercial site?

No. Vercel's terms of service say the Hobby plan is only for personal or non-commercial use. A client's site or a business site needs Pro or Enterprise.

### What happens if I go over Hobby's limits?

You cannot buy more usage on Hobby. Vercel's docs say that in most cases you have to wait until 30 days have passed before you can use that feature again.

### What does Vercel Pro include?

One seat that can deploy, $20 of monthly usage credit, free viewer seats, team features, email support, and the lowest Flat Rate CDN tier. Vercel's docs put that tier at 1 million CDN requests and 1 TB of data transfer a month.

### How do I stop a surprise Vercel bill?

Set the on-demand budget under spend management to the most you would pay. New Pro teams start at $200. You can have Vercel pause all projects when the budget is reached.

### Is there a cheaper way to host a static commercial site?

Yes. A static host with flat pricing, such as Static.app from $6 a month, allows commercial sites and does not meter traffic. Cloudflare Pages has a free plan. Neither runs Next.js server features.
