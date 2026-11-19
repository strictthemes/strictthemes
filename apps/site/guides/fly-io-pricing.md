---
title: "Fly.io pricing in 2026: machines, volumes, bandwidth and the free trial"
description: What Fly.io costs in 2026. Machine prices by size, volumes, bandwidth by region, IP addresses, the $1 free trial, support plans, and how to keep a small app's bill low.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Fly.io has no plans to pick from. You pay for what you run: machines by the second, volumes by the GB you provision, and bandwidth by the GB that leaves Fly. The smallest machine, shared-cpu-1x with 256 MB of memory, is $2.19 a month if it runs all month. New accounts get a $1 trial credit with no card.

This guide is for developers who deploy an app or an API to Fly, including apps built with a coding agent. We read every number below on Fly's pricing page and in its docs on 19 November 2026. Prices are for Fly's default region, Ashburn in the United States. Other regions can cost a little more.

![Fly.io's pricing page, headed Start for free, pay as you grow, with the line $1 free to start, no credit card needed.](/guides/fly-io-pricing/fly.jpg "Fly.io's pricing page, 19 November 2026")

## TL;DR

- **You pay per machine, by the second.** A shared-cpu-1x machine with 256 MB is $2.19 a month if it never stops. A performance-1x machine with 2 GB is $33.
- **Stopped machines cost almost nothing.** You pay $0.15 per GB a month for their root filesystem, not for CPU or memory. Fly's auto-stop feature uses this.
- **Volumes are $0.15 per GB a month,** billed on the size you provision, even when no machine uses them.
- **Bandwidth out is $0.02 per GB in North America and Europe,** and up to $0.12 in Africa and India. Inbound is free.
- **Fly waives a personal organization's bill if it comes to less than $5 a month.** That makes a very small app close to free, once a card is on file.
- **The trial is $1 of credit for 7 days,** with no card. When it runs out, machines stay stopped until you add a card.

## Fly.io machine prices

These are the monthly prices on Fly's pricing page for a machine that runs all month. Fly bills by the second, so a machine that runs half the month costs about half.

| Machine | CPU | Memory | A month |
| --- | --- | --- | --- |
| shared-cpu-1x | 1 shared | 256 MB | $2.19 |
| shared-cpu-2x | 2 shared | 512 MB | $4.39 |
| shared-cpu-4x | 4 shared | 1 GB | $8.78 |
| shared-cpu-8x | 8 shared | 2 GB | $17.55 |
| performance-1x | 1 dedicated | 2 GB | $33.00 |
| performance-2x | 2 dedicated | 4 GB | $66.00 |
| performance-4x | 4 dedicated | 8 GB | $132.01 |
| performance-8x | 8 dedicated | 16 GB | $264.01 |
| performance-16x | 16 dedicated | 32 GB | $528.02 |

Fly also lists shared-cpu-6x and the even performance sizes in between. You can add memory to any machine at $6 per GB a month, up to 128 GB.

Shared CPUs are fine for most web apps and small APIs. Performance CPUs are dedicated cores, for work that keeps the CPU busy.

## Storage, bandwidth and IP addresses

| What | Price |
| --- | --- |
| Volumes | $0.15 per GB a month, on the provisioned size |
| Stopped machine root filesystem | $0.15 per GB a month |
| Volume snapshots | $0.08 per GB a month, first 10 GB free |
| Bandwidth out, North America and Europe | $0.02 per GB |
| Bandwidth out, Asia Pacific, Oceania, South America | $0.04 per GB |
| Bandwidth out, Africa and India | $0.12 per GB |
| Bandwidth in | Free |
| Dedicated IPv4 address | $2 a month |
| Static egress IP | $0.005 an hour, about $3.60 a month |
| SSL certificate | $0.10 a month per hostname, first 10 free; $1 a month per wildcard |

Every app gets a shared IPv4 address and IPv6 addresses at no charge. A dedicated IPv4 address is optional. Volumes are the line that catches people out: they are billed on the size you ask for, not what you use, and they keep billing when no machine is attached.

## The Fly.io free trial

Fly's free trial docs set these terms:

- **$1 of credit, no card, for 7 days.** The pricing page shows the same: "$1 free to start".
- **Small limits.** Up to 10 machines, at most shared-cpu-2x with 4 GB, and volumes up to 20 GB.
- **Trial machines stop after 5 minutes.** So a trial app is for trying a deploy, not for hosting.
- **When the credit runs out,** your machines stay stopped. Fly may delete trial resources, though the apps themselves are kept. Adding a card lifts the limits.

Accounts on Fly's older plans, which it stopped offering in October 2024, keep the free allowances those plans included. New accounts do not get them.

## Support, reservations and credits

**Support** is a separate monthly plan: Standard at $29, Premium at $199, and Enterprise from $2,500. Without one, you have the community forum.

**Reservations** give a 40% discount if you prepay a year. For example, $36 a year buys $5 a month of credit for shared machines in one region. The credit covers CPU and extra memory only, and does not roll over. They make sense once you know what you run every month.

**Startups** can apply for up to $15,000 in credits.

## How to keep a Fly.io bill low

Fly's own docs point to auto-stop: a machine that stops when no requests arrive, and starts again on the next one. While stopped, you pay only for its root filesystem. A low-traffic app spends most of the month stopped.

The other habits are plain ones. Pick the smallest machine that works and size up when you see it struggle. Delete volumes you no longer use, since they bill while detached. Skip the dedicated IPv4 address unless something needs it. And keep an eye on bandwidth if your users are in Africa, India or Asia, where it costs two to six times more.

Fly's docs work through examples. A background worker on one shared-cpu-1x machine, running all month, is $2.21. A small web app with a 10 GB volume and Fly's Managed Postgres is $43.67, and most of that is the database: the app machine and its volume are $5.19. So a small app with no managed database can stay under the $5 that Fly waives for a personal organization. Fly's docs are clear that there is no free tier, but in practice that waiver works like one.

## If your site is only static files

Fly runs servers, and its prices are built around them. A site that is only HTML, CSS and images does not need a machine. These hosts serve static files without one:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/fly-io-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so your API stays on Fly. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a landing page or marketing site next to an app on Fly, with a fixed bill and forms built in.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited. You can connect a Git repository or upload a folder.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/fly-io-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want to pay nothing for static files and are at home in Cloudflare's dashboard. See [Cloudflare Pages pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories. It has a 1 GB site size limit and a soft limit of 100 GB of bandwidth a month, and GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/fly-io-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For other app hosts, see the [Heroku alternatives](https://bootstrap.build/articles/heroku-alternatives/) and [Render alternatives](https://bootstrap.build/articles/render-alternatives/) on bootstrap.build. To compare Render's plans with Fly's, see [Render pricing in 2026](/guides/render-pricing/).

## Is Fly.io right for you?

- **A small API or a side project:** yes. One shared-cpu-1x machine with auto-stop can stay under the $5 Fly waives.
- **An app with users in many regions:** yes, it is what Fly is built for. Budget for higher bandwidth outside North America and Europe.
- **A database you run yourself:** possible on a volume. Remember volumes bill on provisioned size and you manage backups.
- **A team that wants a support contract:** add Standard at $29 or Premium at $199.
- **A site that is only static files:** a static host, such as Static.app or Cloudflare Pages, costs less and needs no machine.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Fly.io free?

Not for new accounts. Fly's docs say there is no free tier. New accounts get a 7-day trial with $1 of credit and no card. After that you add a card and pay for usage, though Fly waives a personal organization's bill if it is under $5 a month, so a very small app can cost nothing. Accounts on plans from before October 2024 keep their old free allowances.

### How much does Fly.io cost per month?

It depends on what you run. The smallest machine, shared-cpu-1x with 256 MB, is $2.19 a month if it runs all month. A performance-1x machine with 2 GB is $33. Volumes add $0.15 per GB a month, and bandwidth out is from $0.02 per GB.

### Does Fly.io charge for stopped machines?

Only for their root filesystem, at $0.15 per GB a month. You do not pay for CPU or memory while a machine is stopped.

### How much is Fly.io bandwidth?

Outbound data is $0.02 per GB in North America and Europe, $0.04 in Asia Pacific, Oceania and South America, and $0.12 in Africa and India. Inbound data is free.

### What happens when the Fly.io trial ends?

When the $1 credit runs out, your machines stay stopped and Fly may delete trial resources. Your apps are kept. Adding a card lifts the trial limits.

### Does Fly.io charge for IP addresses?

Every app gets a shared IPv4 address and IPv6 addresses free. A dedicated IPv4 address is $2 a month. A static egress IP is $0.005 an hour, about $3.60 a month.
