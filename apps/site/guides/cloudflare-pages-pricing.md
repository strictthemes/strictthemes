---
title: "Cloudflare Pages pricing in 2026: what is free, and what costs"
description: Cloudflare Pages pricing and limits in 2026. Static files are free, functions bill as Workers, builds depend on your plan, and Cloudflare now points new projects to Workers.
kind: Pricing
date: 2026-11-18
checked: 2026-11-18
---

Cloudflare Pages is free for static files, with no charge for bandwidth or for requests that only fetch a file. You start paying in two cases: when your site runs server code through Pages Functions, and when you need more builds or files than the free plan allows. There is also a change to know about first. Cloudflare's own Pages docs now tell you to start new projects with Workers instead.

This guide is for anyone who deploys to Cloudflare by hand, from Git or from a coding agent. We read every number below in Cloudflare's docs and on its pricing pages on 18 November 2026.

![The Cloudflare Pages documentation, with a note that asks Are you sure you want to use Pages? and says to start new projects with Workers.](/guides/cloudflare-pages-pricing/pages-docs.jpg "Cloudflare's Pages docs, 18 November 2026")

## TL;DR

- **Static files are free and unlimited.** Cloudflare's docs say requests for static assets are free on both free and paid plans, and the Pages page lists unlimited bandwidth on all plans.
- **Server code is billed as Workers.** On the free plan, Pages Functions share 100,000 requests a day with your Workers. Workers Paid starts at $5 a month for 10 million requests.
- **Builds depend on your Cloudflare plan.** Free has 500 builds a month, one at a time.
- **The free plan has hard edges:** 20,000 files per site, 25 MiB per file, and 100 projects per account.
- **Cloudflare now says to start new projects with Workers,** which serves static files on the same free terms.

## Cloudflare Pages pricing at a glance

| What you use | Free plan | Paid |
| --- | --- | --- |
| Requests for static files | Free and unlimited | Free and unlimited |
| Bandwidth | Unlimited, says the Pages page | Unlimited |
| Pages Functions requests | 100,000 a day, shared with Workers | Workers Paid: 10 million a month included, then $0.30 per million |
| Functions CPU time | 10 ms per request | 30 million CPU ms a month included, then $0.02 per million |
| Builds | 500 a month, 1 at a time | 5,000 on Cloudflare Pro, 20,000 on Business |
| Files per site | 20,000 | 100,000 on paid plans |
| Largest file | 25 MiB | 25 MiB |
| Custom domains per project | 100 | 250 on Pro, 500 on Business |

Workers Paid is a minimum of $5 a month per account. The Pages limits page lists the higher build, file and domain limits under Cloudflare's Pro and Business plans. Those are Cloudflare's general plans, which also cover its CDN and security features. Check with Cloudflare which plan raises the limit you need before you upgrade for it.

## What is free

Cloudflare's Pages Functions pricing page says: "requests to static assets are free and unlimited". A request counts as static when it does not run a function. The Pages product page goes further and lists "unlimited sites, seats, requests, and bandwidth" on all plans.

So a site that is only HTML, CSS, JavaScript and images costs nothing to serve, however many people visit. That is the main reason developers pick Cloudflare for static sites.

![The Cloudflare Pages page, with the line All plans come with unlimited sites, seats, requests, and bandwidth.](/guides/cloudflare-pages-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

"Unlimited sites" needs one correction. The Pages limits page sets a limit of 100 projects per account, and says that limit is not routinely raised. Cloudflare also limits how many projects a new account can create in its first 48 hours.

## What costs money: Pages Functions

Pages Functions run server code, such as an API route, a form handler or server-rendered pages. Cloudflare bills them as Workers requests.

**On the free plan,** your functions and your Workers share 100,000 requests a day. The count resets at midnight UTC. Each request can use at most 10 ms of CPU time.

**On Workers Paid,** you pay a $5 minimum a month for the account. That includes 10 million requests and 30 million CPU milliseconds a month. Beyond that, requests are $0.30 per million and CPU time is $0.02 per million milliseconds. Cloudflare does not charge for how long a request takes, only for the CPU it uses.

Cloudflare's Workers pricing page works through an example. A Worker that serves 15 million requests a month at 7 ms of CPU each costs $8 a month: $5 for the plan, $1.50 for the extra 5 million requests, and $1.50 for CPU time.

![Cloudflare's Workers pricing page, describing the free plan and the Workers Paid plan at a minimum of $5 a month.](/guides/cloudflare-pages-pricing/workers-pricing.jpg "Cloudflare's Workers pricing docs, 18 November 2026")

If you worry about a runaway bill, Workers has a spending limit. The pricing page says it blocks new invocations at a threshold you set, and that it can stop every Worker on the account when it does.

## Builds, files and the other limits

These come from the Pages limits page, last updated 5 September 2026.

- **Builds.** Free has 500 builds a month and runs one at a time. Cloudflare Pro has 5,000 and five at a time. Business has 20,000 and twenty at a time. Each build times out after 20 minutes.
- **Files.** A site can have 20,000 files on the free plan and 100,000 on paid plans. On a paid plan you also have to set an environment variable to turn the higher limit on.
- **File size.** Each file can be at most 25 MiB. For larger files, Cloudflare suggests its R2 storage.
- **Redirects.** A `_redirects` file can hold 2,000 static and 100 dynamic redirects.
- **Preview deployments.** Unlimited.

If you build outside Cloudflare and upload the result, with its direct upload or from the command line, the build limits do not apply to you. Only the file limits do.

## Pages or Workers?

Cloudflare's Pages overview, updated 25 August 2026, opens with a question: "Are you sure you want to use Pages?" It says Workers supports most Pages use cases, has more features, and is Cloudflare's main platform for applications. It ends: "Start new projects with Workers."

The price is the same idea. Cloudflare's Workers docs say requests for static assets on Workers are free and unlimited, and that storing them costs nothing. Server code is billed as Workers, as it is on Pages. The limits are close too: 20,000 files per version on the free plan, 100,000 on paid, and 25 MiB per file. Workers builds give 3,000 build minutes a month on the free plan, and 6,000 on paid plans, then $0.005 a minute.

One difference matters on the free plan. If a Worker is set to run before static files, with `run_worker_first`, then after the free daily requests are used up, those requests get an error with status 429 instead of the file.

Static files also stop being free if you turn on Workers Caching. Cloudflare's Workers pricing page says requests served from that cache, static assets included, are billed like requests to a Worker.

So for a new static site on Cloudflare, Workers is now the safer choice. An existing Pages site keeps working, and Cloudflare has a guide for moving it to Workers.

## If you would rather not run Cloudflare

Cloudflare is hard to beat on price for static files. What it asks in return is comfort with its dashboard, its limits and, for builds and functions, its command-line tools. If you want a static site online without those, these are three ways to compare:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Cloudflare Pages or Workers | Free for static files | Yes | No, for static files | No, direct upload works |
| Static.app | From $6 a month, or $60 a year | Yes, from the first paid plan | No, unlimited traffic | No |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder in the browser, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/cloudflare-pages-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

It costs money where Cloudflare is free, so weigh what you get. There is no free plan, only a 7-day trial on a free subdomain. It runs no server code. It does not build from Git. And 500 MB on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** someone who wants forms, analytics and a domain set up for them, and does not want to learn Cloudflare's dashboard.

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories. GitHub sets a 1 GB maximum site size and a soft limit of 100 GB of bandwidth a month, and says Pages is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/cloudflare-pages-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For more hosts, see the Cloudflare Pages alternatives on [bootstrap.build](https://bootstrap.build/articles/cloudflare-pages-alternatives/). To compare with the other big developer hosts, see [Netlify pricing in 2026](/guides/netlify-pricing/) and [Vercel pricing in 2026](/guides/vercel-pricing/).

## Which Cloudflare option should you choose?

- **A static site, starting now:** Workers with static assets, on the free plan. It is what Cloudflare recommends, and static files cost nothing.
- **A static site already on Pages:** stay. Nothing in the pricing forces a move, and you can migrate later.
- **A site with server code and real traffic:** Workers Paid at $5 a month, with a spending limit set.
- **A team that builds often from Git:** check the 500-builds limit, or build in your own CI and upload the result.
- **You want a host that sets up forms and analytics for you:** a flat-price host such as Static.app.

However you publish, check the live page against your design, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Cloudflare Pages free?

Yes, for static files. Cloudflare's docs say requests for static assets are free and unlimited on free and paid plans, and the Pages page lists unlimited bandwidth. You pay for server code above the free daily allowance, and for more builds than the free 500 a month.

### How much does Cloudflare Pages cost with Functions?

Functions are billed as Workers. The free plan gives 100,000 requests a day, shared with your Workers. Workers Paid is a $5 monthly minimum with 10 million requests and 30 million CPU milliseconds included, then $0.30 per million requests and $0.02 per million CPU milliseconds.

### What are the Cloudflare Pages limits on the free plan?

500 builds a month, one build at a time, 20,000 files per site, 25 MiB per file, 100 custom domains per project and 100 projects per account. Each build times out after 20 minutes.

### Is Cloudflare Pages being replaced by Workers?

We found no end date for Pages in Cloudflare's docs. Its Pages docs, updated 25 August 2026, say Workers supports most Pages use cases, is its main platform for applications, and tell you to start new projects with Workers.

### Does Cloudflare charge for bandwidth on Pages?

Not for static files. The Pages page lists unlimited bandwidth on all plans, and the docs say static asset requests are free. Server code is billed by requests and CPU time, not by bandwidth.

### Can I use Cloudflare Pages without Git?

Yes. Pages supports direct upload of a built folder, and deploys from the command line. The build limits only apply to builds Cloudflare runs for you.
