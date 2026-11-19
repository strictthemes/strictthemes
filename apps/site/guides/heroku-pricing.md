---
title: "Heroku pricing in 2026: Eco, Basic and Standard dynos, Postgres and add-ons"
description: What Heroku costs in 2026. Eco dynos at $5 for 1,000 hours, Basic at $7, Standard and Performance dynos, Postgres and Key-Value Store plans, and how billing by the second works.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Heroku has no free dynos on its pricing page. The cheapest way to run an app is the Eco plan: $5 a month for a pool of 1,000 dyno hours, shared by all your Eco apps, which sleep when idle. A Basic dyno that never sleeps is $7 a month. A small app with a database starts at about $12 a month.

This guide is for developers who deploy an app or an API to Heroku, including apps built with a coding agent. We read every number below on Heroku's pricing page and in its Dev Center docs on 19 November 2026.

![Heroku's dyno pricing table, from Eco at $5 a month to Performance and Private dynos.](/guides/heroku-pricing/heroku.jpg "Heroku dyno pricing, 19 November 2026")

## TL;DR

- **Eco is $5 a month for 1,000 dyno hours,** shared by every Eco dyno on your account. Eco web dynos sleep after 30 minutes without traffic. Personal accounts only.
- **Basic is $7 a month per dyno,** always on, with free SSL.
- **Standard-1X is $25 and Standard-2X is $50,** for apps that need to scale out and deploy with no downtime.
- **Heroku bills by the second,** on wall-clock time. A dyno that runs half the month costs about half.
- **Postgres starts at $5 a month** for 1 GB on Essential-0. Key-Value Store starts at $3.
- **When Eco hours run out, Eco apps sleep for the rest of the month.** You cannot buy more hours.

## Heroku dyno prices

These are Heroku's Cedar dynos, the ones most apps use. The price is the most you pay for a dyno that runs all month.

| Dyno | A month | Memory | Sleeps | For |
| --- | --- | --- | --- | --- |
| Eco | $5 for 1,000 hours, shared | 0.5 GB | After 30 minutes idle | Personal projects |
| Basic | $7 | 0.5 GB | No | Small apps, always on |
| Standard-1X | $25 | 0.5 GB | No | Production apps that scale out |
| Standard-2X | $50 | 1 GB | No | The same, with more memory |
| Performance-M | $250 | 2.5 GB | No | Dedicated compute, autoscaling |
| Performance-L | $500 | 14 GB | No | Dedicated compute, autoscaling |
| Performance-L-RAM | $500 | 30 GB | No | Memory-heavy apps |
| Performance-XL | $750 | 62 GB | No | Large apps |
| Performance-2XL | $1,500 | 126 GB | No | Large apps |

Private and Shield dynos, which run in an isolated Private Space, start at $125 a month. Heroku's newer Fir generation has its own sizes, from $25 a month.

**What changes between tiers.** Basic adds always-on dynos and free SSL over Eco, and allows 10 process types. Standard adds horizontal scaling, app metrics with alerts, preboot for zero-downtime deploys and unlimited process types. Performance adds dedicated compute and autoscaling.

## How Heroku billing works

Heroku's Dev Center says it charges by usage, except for Eco. Usage is wall-clock time, not CPU time: a dyno scaled above zero costs money whether or not anyone visits. Costs are prorated to the second. Heroku's own example: a Basic dyno costs about $0.01 an hour, so 2 hours cost about $0.02.

You are billed for the previous month, and every app counts, including staging and test apps you forgot about. Scaling an unused app to zero dynos stops its compute charges.

## The Eco plan

Eco is a flat $5 a month subscription. Heroku's docs set its rules:

- **1,000 dyno hours a month,** shared by every Eco dyno on your account. That is enough for one app running all month, or several that sleep.
- **Sleep after 30 minutes.** An Eco web dyno with no web traffic for 30 minutes sleeps, and wakes after a short delay on the next request. Sleeping dynos use no hours.
- **Workers do not sleep.** An app with only an Eco worker dyno runs all the time and uses hours all month.
- **When the hours run out,** every Eco dyno on the account sleeps until next month. You cannot buy more hours. Heroku points you to Basic dynos instead.
- **Full price from the first day.** If you subscribe mid-month, you still pay $5 for that month.

Eco is not available on Heroku Enterprise accounts, and the pricing page lists it for personal accounts only.

## Postgres and Key-Value Store

Most Heroku apps need a database, priced separately from dynos.

| Data service | Plan | A month | Size |
| --- | --- | --- | --- |
| Heroku Postgres | Essential-0 | $5 | 1 GB storage, 20 connections |
| Heroku Postgres | Essential-1 | $9 | 10 GB storage, 20 connections |
| Heroku Postgres | Essential-2 | $20 | 32 GB storage, 40 connections |
| Heroku Key-Value Store | Mini | $3 | 25 MB, 20 connections |
| Heroku Key-Value Store | Premium 0 | $15 | 50 MB, 40 connections |

The Essential Postgres plans share hardware with other customers and allow up to 4 hours of downtime a month. Larger Postgres plans have dedicated memory and higher prices. Add-ons from other companies, such as email or monitoring, are bought through the Elements Marketplace at their own prices.

## What a small app costs on Heroku

| Setup | A month |
| --- | --- |
| A side project on Eco, sleeping when idle | $5 |
| An always-on app on Basic with Essential-0 Postgres | $12 |
| The same with a Mini Key-Value Store for caching | $15 |
| A production app on two Standard-1X dynos with Essential-1 Postgres | $59 |

Heroku's support is free at the Basic level: docs, community and the help portal. Faster response times are part of its paid Enterprise success plans.

## If your site is only static files

Heroku runs servers. A site that is only HTML, CSS and images does not need a dyno, and putting it on one means paying for a server that serves files. These hosts serve static files without one:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/heroku-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so your API stays on Heroku. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a marketing site or landing page next to an app on Heroku, with a fixed bill and forms built in.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/heroku-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want to pay nothing for static files and are at home in Cloudflare's dashboard. See [Cloudflare Pages and Workers pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a 1 GB site size limit and a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/heroku-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For other app hosts, see the [Heroku alternatives](https://bootstrap.build/articles/heroku-alternatives/) on bootstrap.build. To compare prices, see [Render pricing in 2026](/guides/render-pricing/), [Railway pricing in 2026](/guides/railway-pricing/) and [Fly.io pricing in 2026](/guides/fly-io-pricing/).

## Which Heroku plan should you choose?

- **A side project or a demo:** Eco at $5. Expect a short wait after 30 minutes idle.
- **A small app that must stay up:** a Basic dyno at $7, with Essential-0 Postgres at $5.
- **A production app with real traffic:** Standard-1X or 2X, with two or more dynos for zero-downtime deploys.
- **Heavy or steady load:** Performance dynos, with autoscaling.
- **A site that is only static files:** a static host, such as Static.app or Cloudflare Pages.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Heroku free?

No. Heroku's pricing page lists no free dynos. The cheapest option is the Eco plan at $5 a month for 1,000 dyno hours shared across your Eco apps, which sleep after 30 minutes without traffic.

### How much does Heroku cost per month?

An Eco dyno plan is $5 a month, a Basic dyno $7, Standard-1X $25 and Standard-2X $50. Postgres starts at $5 a month. An always-on small app with a database is about $12 a month.

### What happens when Heroku Eco hours run out?

All Eco dynos on your account sleep for the rest of the month, and their apps cannot be reached. You cannot buy more Eco hours. Heroku suggests moving to Basic dynos.

### Does Heroku charge by the hour?

By the second. Heroku prorates dyno costs to the second on wall-clock time, so a dyno scaled above zero costs money whether or not it gets traffic. A Basic dyno is about $0.01 an hour.

### How much is Heroku Postgres?

Essential-0 is $5 a month for 1 GB, Essential-1 is $9 for 10 GB and Essential-2 is $20 for 32 GB. Larger plans with dedicated memory cost more.

### What is the difference between Heroku Eco and Basic?

Eco is $5 a month for a shared pool of 1,000 hours, and its web dynos sleep after 30 minutes idle. Basic is $7 a month per dyno, never sleeps, includes free SSL and allows 10 process types.
