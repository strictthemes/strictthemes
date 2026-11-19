---
title: "Railway pricing in 2026: the Free plan, Hobby, Pro and usage rates"
description: What Railway costs in 2026. The Free plan's $1 of monthly usage, the 30-day trial, Hobby at $5 and Pro at $20 with usage included, CPU and memory rates, and how to cap a bill.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Railway charges for the CPU, memory, storage and bandwidth your app uses, billed as it runs. Each plan has a monthly minimum that comes back to you as usage credit. Free is $0 with $1 of usage a month. Hobby is $5 a month with $5 of usage included, and Pro is $20 a month with $20 included. You pay more only when your usage goes over that amount.

This guide is for developers who deploy an app, an API or a database to Railway, including apps built with a coding agent. We read every number below on Railway's pricing page and in its docs on 19 November 2026.

![Railway's pricing page, with the Free plan at $0, Hobby at $5 and Pro at $20 minimum usage.](/guides/railway-pricing/railway.jpg "Railway's pricing page, 19 November 2026")

## TL;DR

- **Free is $0 with $1 of usage a month,** no card. Services sleep after 5 to 10 minutes without outbound traffic. When the $1 is used, services stop until next month.
- **New accounts get a 30-day trial** with a one-time $5 credit and higher limits, then move to Free.
- **Hobby is $5 a month, with $5 of usage included.** If your usage is $3, you pay $5. If it is $7, you pay $7.
- **Pro is $20 a month, with $20 of usage included,** unlimited seats and 30 days of logs.
- **Usage is $20 per vCPU a month and $10 per GB of memory a month,** charged on what your app uses. Egress is $0.05 per GB. Builds are free.
- **You can set a hard limit,** and Railway takes your workloads offline when it is reached.

## Railway plans in 2026

| | Free | Hobby | Pro | Enterprise |
| --- | --- | --- | --- | --- |
| Price | $0 | $5 a month | $20 a month | Custom |
| Usage included | $1 a month | $5 a month | $20 a month | Custom |
| Card needed | No | Yes | Yes | Not listed |
| Always on | No, sleeps when idle | Yes | Yes | Yes |
| Projects | 1 | 50 | 100 | Unlimited |
| Services per project | 3 | 50 | 100 | Unlimited |
| Memory per service | Up to 0.5 GB | Up to 48 GB | Up to 1 TB | Up to 2.4 TB |
| Volume storage | 0.5 GB | Up to 5 GB | Up to 1 TB | Up to 5 TB |
| Seats | 1 | 1 | Unlimited | Unlimited |
| Log history | Not listed | 7 days | 30 days | 90 days |

Railway's docs say Hobby's subscription fee is waived for a small set of active builders, judged on things like platform usage and GitHub account. If you qualify, the dashboard tells you.

## Railway usage rates

| Resource | Price |
| --- | --- |
| CPU | $20 per vCPU a month |
| Memory | $10 per GB a month |
| Volume storage | $0.15 per GB a month |
| Network egress | $0.05 per GB |
| Object storage | $0.015 per GB a month, free egress |
| Builds | Free |

Railway meters these by the second and bills, in its words, "only for active CPU and memory". A service that uses a quarter of a vCPU on average pays for a quarter.

Railway's newer sandboxes and VMs, for running agents and untrusted code, are priced separately: about $50 per vCPU a month and $50 per GB of memory a month while running.

## How the included usage works

Railway's plans docs give the rule with two examples. On Hobby, if your resource usage for the month is $3, your bill is $5: the subscription covers it. If your usage is $7, your bill is $7: the $5 subscription plus $2 more. Pro works the same way with $20.

Included usage resets every billing cycle and does not roll over. You pay the subscription even in a month you use nothing.

## The Free plan and the trial

Railway's Free plan docs set these rules:

- **$1 of usage a month,** no card. It resets each cycle.
- **Services sleep** after 5 to 10 minutes without outbound traffic, and wake on the next request. A sleeping service costs nothing. A service that keeps sending traffic, such as a bot holding a WebSocket, stays awake.
- **When the $1 runs out,** your services stop until the next cycle or until you upgrade. Volumes and stored files are kept.
- **Databases** such as Postgres, Redis, MySQL and MongoDB deploy on Free as single-node databases with a 0.5 GB volume, and sleep too.
- **Custom domains, cron jobs and always-on services** need Hobby.

New accounts start with a 30-day trial: a one-time $5 credit, higher limits and services that do not sleep. After 30 days the account continues on Free.

## What a small app costs on Railway

Railway bills by use, so these are examples, worked out from its rates, not quotes:

| Setup | Usage a month | Bill on Hobby |
| --- | --- | --- |
| A small API averaging 0.1 vCPU and 0.25 GB of memory | $4.50 | $5 |
| The same API with a Postgres database of similar size | $9 | $9 |
| An app averaging 0.5 vCPU and 1 GB, with 10 GB of egress | $20.50 | $20.50 |

The biggest unknown is memory. A Node or Python app that holds 0.5 GB all month uses $5 of memory alone, before CPU. Railway's usage page shows what each service costs so far in the month.

## How to cap a Railway bill

Railway's cost control docs describe usage limits you set per workspace. A custom email alert warns you at an amount you choose. A hard limit takes all your workloads offline when usage reaches it, and Railway emails you as you approach it, starting at 75%.

Usage for Railway's AI agent is tracked separately, with a default hard limit of $5 on Hobby and $20 on Pro.

## If your site is only static files

Railway runs servers and databases. A site that is only HTML, CSS and images does not need either. These hosts serve static files without one:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/railway-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so your API stays on Railway. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a marketing site or landing page with a custom domain, where Railway's Free plan would not allow one.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/railway-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want to pay nothing for static files and are at home in Cloudflare's dashboard. See [Cloudflare Pages and Workers pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a 1 GB site size limit and a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/railway-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For other app hosts, see the [Railway alternatives](https://bootstrap.build/articles/railway-alternatives/) and [Render vs Railway](https://bootstrap.build/articles/render-vs-railway/) on bootstrap.build. To compare prices, see [Render pricing in 2026](/guides/render-pricing/), [Heroku pricing in 2026](/guides/heroku-pricing/) and [Fly.io pricing in 2026](/guides/fly-io-pricing/).

## Which Railway plan should you choose?

- **A demo or a bot that can sleep:** Free, with $1 of usage a month.
- **A side project that must stay up, or needs a custom domain:** Hobby at $5. Small apps often stay inside the included $5.
- **A team, or an app in production:** Pro at $20, with unlimited seats and 30 days of logs.
- **Any paid plan:** set a hard usage limit you can afford.
- **A site that is only static files:** a static host, such as Static.app or Cloudflare Pages.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Railway free?

Yes, there is a Free plan with $1 of usage a month and no card. Its services sleep when idle, and stop when the $1 is used up until the next month. New accounts also get a 30-day trial with a one-time $5 credit.

### How much does Railway cost per month?

Hobby is $5 a month and Pro is $20 a month, and each includes that much usage. You pay more only if your usage goes over it. Usage is $20 per vCPU a month, $10 per GB of memory a month and $0.05 per GB of egress.

### Is the Railway Hobby plan free?

No. Railway's docs say Hobby is $5 a month and you always pay the fee, even if you use less than the $5 of usage it includes. Railway waives the fee for a small set of active builders it selects.

### What happens when Railway's free credit runs out?

On the Free plan, your services stop until the next billing cycle or until you upgrade. Volumes and stored files are kept.

### Can I set a spending limit on Railway?

Yes. You can set an email alert and a hard limit on your workspace's usage page. At the hard limit, Railway takes all your workloads offline so usage stops.

### Does Railway charge for builds?

No. Railway's docs say builds are free: it does not charge for build CPU, memory, image downloads, exports or image storage.
