---
title: "Render pricing in 2026: the free tier, workspace plans and compute"
description: What Render costs in 2026. The free tier's sleep, hours and database limits, the Hobby, Pro and Scale workspace plans, compute prices, bandwidth and build minutes.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Render charges in two layers. A workspace plan sets the team features, bandwidth and build minutes: Hobby is $0, Pro is $25 a month and Scale is $499. Then each service pays for its own compute, from $0 on the free instance to $7 a month for the smallest paid one. Static sites are free to deploy on every plan.

This guide is for developers who deploy an app, an API or a database to Render, including apps built with a coding agent. It covers the free tier's limits first, because that is where most questions start. We read every number below on Render's pricing page and in its docs on 19 November 2026.

![Render's pricing page, headed Predictable pricing that scales with you, with the Hobby, Pro, Scale and Enterprise plans.](/guides/render-pricing/render.jpg "Render's pricing page, 19 November 2026")

## TL;DR

- **Hobby is $0 plus compute,** for one person, up to 25 services, 5 GB of bandwidth and 500 build minutes a month.
- **Free web services sleep after 15 minutes without traffic** and take about a minute to wake. They share 750 instance hours a month per workspace.
- **Free Postgres expires after 30 days.** You get 14 more days to upgrade before Render deletes it.
- **The cheapest always-on service is $7 a month,** with 512 MB of memory and less than one CPU.
- **Pro is $25 a month plus compute,** for a team: unlimited seats and services, 25 GB of bandwidth and 1,000 build minutes.
- **Extra bandwidth is $0.15 per GB** on every plan. Extra build minutes are $5 per 1,000.

## Render workspace plans

| Plan | Price | Bandwidth a month | Build minutes a month | Custom domains | Seats and services |
| --- | --- | --- | --- | --- | --- |
| Hobby | $0 + compute | 5 GB | 500 | 2 | 1 seat, up to 25 services |
| Pro | $25 a month + compute | 25 GB | 1,000 | 15 | Unlimited |
| Scale | $499 a month + compute | 1 TB | 5,000 | 25 | Unlimited, multiple workspaces |
| Enterprise | Custom | Custom | Custom | Custom | Custom |

On every plan, extra bandwidth is $0.15 per GB, extra build minutes are $5 per 1,000, and extra custom domains are $0.25 a month each. Pro adds full-stack previews, autoscaling and isolated environments. Scale adds SSO, audit logs for the organization and HIPAA-compliant workspaces. Enterprise adds uptime SLAs.

## Render compute prices

Each web service, worker or cron job picks a compute size. Render bills it by the second, so a service you turn off after a day is billed for a day.

| CPU | Memory | A month |
| --- | --- | --- |
| Free instance | 512 MB | $0 |
| Less than 1 | 512 MB | $7 |
| 1 | 2 GB | $25 |
| 2 | 4 GB | $85 |
| 2 | 8 GB | $135 |
| 4 | 8 GB | $175 |
| 4 | 16 GB | $225 |
| 8 | 16 GB | $300 |

The table runs up to 12 CPUs and 96 GB of memory for $1,500 a month. Persistent disks are $0.25 per GB a month.

**Postgres** has its own sizes: free, then $6 a month for 256 MB of memory, $19 for 1 GB and $40 for 2 GB, with storage at $0.30 per GB. **Key Value**, Render's Redis-compatible store, also has a free size that keeps data in memory only.

## What Render's free tier includes, and its limits

Render's free docs say the free instances are for testing, hobby projects and trying Render, not for production. These are the rules:

- **Sleep after 15 minutes.** A free web service with no inbound traffic for 15 minutes spins down. The next request wakes it, which takes about a minute, and the visitor sees a loading page meanwhile.
- **750 instance hours a month per workspace.** A sleeping service uses none. If you use them all, Render suspends every free web service until next month.
- **Bandwidth and builds are shared with the plan.** If free services use up the month's bandwidth and you have no payment method, Render suspends them for the rest of the month. If build minutes run out, new builds stop, but services keep running on their last build.
- **No saved files.** The filesystem is ephemeral, so anything written to disk is lost when the service sleeps or redeploys.
- **No email ports.** Free web services cannot send traffic out on ports 25, 465 or 587, so they cannot send email over SMTP. Use an email API instead.
- **Free Postgres is 1 GB and lasts 30 days.** After it expires you have 14 days to upgrade it to a paid size, then Render deletes it. It has no backups.

So the free tier is good for a demo and a weekend project. Anything people rely on needs at least the $7 instance, and a $6 database if it stores data.

## What a small app costs on Render

Three common setups, from the prices above:

| Setup | A month |
| --- | --- |
| A demo on a free web service with free Postgres | $0, until the database expires after 30 days |
| An always-on API on the $7 instance, with no database | $7 |
| An app on the $7 instance with the $6 Postgres and 1 GB of extra storage | About $13.30 |
| The same app for a team of three on Pro | About $38.30 |

These add no bandwidth over the plan's allowance. On Hobby, 5 GB a month is small for a site with images. Each GB over it is $0.15.

Render lets you set a spend limit. If build minutes run out and the limit is reached, new builds stop for the rest of the month, while your services keep running.

## If your site is only static files

Render's static sites are free to deploy on every plan, with a CDN, custom domains and TLS. What you pay for is the bandwidth: they count against the plan's 5 GB on Hobby, then $0.15 per GB. If your site is only static files, compare them with these hosts:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Render static sites | Free to deploy | Yes, 2 on Hobby | 5 GB on Hobby, then $0.15 per GB | Yes, deploys from Git |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/render-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so an API stays on Render. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a marketing site or landing page with more traffic than Hobby's 5 GB, where a fixed bill matters more than a build pipeline.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/render-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want to pay nothing for static traffic and are at home in Cloudflare's dashboard. See [Cloudflare Pages pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/render-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For other app hosts, see the [Render alternatives](https://bootstrap.build/articles/render-alternatives/) and [Heroku alternatives](https://bootstrap.build/articles/heroku-alternatives/) on bootstrap.build. To compare with paying per machine, see [Fly.io pricing in 2026](/guides/fly-io-pricing/), and for the other app platforms, [Heroku pricing](/guides/heroku-pricing/) and [Railway pricing](/guides/railway-pricing/).

## Which Render plan should you choose?

- **A demo or a weekend project:** Hobby with free instances. Expect a slow first request after 15 minutes idle, and move the database off free Postgres before 30 days.
- **One person's app in production:** Hobby with the $7 instance, and a paid Postgres size if it stores data.
- **A team:** Pro at $25 a month, plus each service's compute. It is the plan with unlimited seats.
- **Compliance needs, such as SSO or HIPAA:** Scale.
- **A site that is only static files:** Render's free static sites if 5 GB is enough, or a flat-price host such as Static.app if it is not.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Render free?

Partly. The Hobby plan is $0, static sites are free to deploy, and web services, Postgres and Key Value each have a free size. The free web service sleeps after 15 minutes idle, and free Postgres expires after 30 days.

### How much does Render cost per month?

The Hobby plan is $0 and Pro is $25 a month, plus compute for each service. The smallest always-on web service is $7 a month, and the smallest paid Postgres is $6. A small app with a database is about $13 a month on Hobby.

### Why is my Render free service slow to load?

Render spins down a free web service after 15 minutes without traffic. The next request wakes it, which takes about a minute. Paid instances do not sleep.

### What happens when Render's free Postgres expires?

It expires 30 days after you create it and becomes inaccessible. You have 14 days to upgrade it to a paid size. After that, Render deletes it.

### Can a free Render service send email?

Not over SMTP. Render's docs say free web services cannot send outbound traffic on ports 25, 465 or 587. Use an email provider's HTTP API instead, or a paid instance.

### Are static sites free on Render?

Yes, they are free to deploy on every plan. They count against your plan's bandwidth, 5 GB a month on Hobby, and extra bandwidth is $0.15 per GB.
