---
title: "Firebase Hosting pricing in 2026: Spark, Blaze and what happens at the limit"
description: What Firebase Hosting costs in 2026. The no-cost Spark plan's storage and data transfer limits, Blaze's pay-as-you-go rates, why budget alerts do not cap a bill, and App Hosting's prices.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Firebase Hosting is free up to 10 GB of storage and about 10 GB of data transfer a month. That is the no-cost Spark plan, and it needs no payment method. Past those limits you need Blaze, the pay-as-you-go plan: storage is then $0.026 per GB and data transfer $0.15 per GB. Firebase App Hosting, for server-rendered apps, is priced separately and needs Blaze from the start.

This guide is for developers who host a site or a web app on Firebase. We read every number below on Firebase's pricing page and in its Hosting docs on 19 November 2026.

![Firebase's pricing page, with the no-cost Spark plan and the pay-as-you-go Blaze plan.](/guides/firebase-hosting-pricing/firebase.jpg "Firebase's pricing page, 19 November 2026")

## TL;DR

- **Spark is free with no card:** 10 GB of Hosting storage and 360 MB of data transfer a day. The Hosting docs put the transfer limit at 10 GB a month.
- **On Spark, going over transfer disables your sites** after a short grace period, until the next month. Going over storage stops new deploys.
- **Blaze includes the same free usage, then bills:** $0.026 per GB of storage and $0.15 per GB of data transfer. Its free usage is counted per day.
- **Budget alerts on Blaze do not cap anything.** Google says they only alert you.
- **App Hosting, for Next.js and Angular apps with a server, needs Blaze.** Its outgoing bandwidth is free up to 10 GiB a month, then $0.15 to $0.20 per GiB.

## Firebase Hosting pricing in 2026

| | Spark (no cost) | Blaze (pay as you go) |
| --- | --- | --- |
| Payment method | Not needed | Billing account needed |
| Hosting storage | 10 GB | 10 GB free, then $0.026 per GB |
| Data transfer | 360 MB a day | 360 MB a day free, then $0.15 per GB |
| Custom domain and SSL | Yes | Yes |
| Multiple sites per project | Yes | Yes |
| Cloud Functions | Not available | 2 million invocations a month free, then $0.40 per million |

These limits are per Firebase project, not per site. Two sites in one project share them.

The two Firebase pages describe the transfer limit in different units. The pricing page shows 360 MB a day, and says no-cost usage on Blaze is counted daily. The Hosting docs describe the Spark limit as 10 GB a month. They come to about the same over a month. On Blaze, plan on the daily figure: a busy day can be billed even if the month is light.

## What happens when you hit Spark's limits

Firebase's Hosting docs spell this out.

- **Data transfer.** When a Spark project reaches its transfer limit, Firebase gives a short grace period, then disables your sites. They stay disabled until the start of the next month. Upgrading to Blaze turns them back on at once.
- **Storage.** When a Spark project reaches 10 GB of Hosting storage, you cannot deploy new content. You delete older releases, or upgrade.

Both cache hits and cache misses count as data transfer. The docs also note a 2 GB size limit for any single file.

**Storage fills up with old releases.** Every deploy creates a release, and Firebase keeps the files of past releases too. That is what usually fills 10 GB, not the live site. The docs suggest setting a limit on how many releases to keep, or deleting old ones by hand. That is the first fix for a storage warning.

## Blaze: what you pay, and how to watch it

Blaze includes everything Spark gives for free, then bills at Google Cloud rates. For Hosting that is $0.026 per GB of storage a month and $0.15 per GB of data transfer. Firebase's pricing page says eligible accounts get $300 of free credit when they upgrade.

At those rates, a site that serves 100 GB a month pays for about 89 GB past the free daily allowance, roughly $13 a month. One that serves 1 TB pays about $150.

Firebase's docs recommend budget alerts in the Google Cloud console, and they are worth setting. But the docs also say budget alerts "do not cap your usage or charges". To stop spending automatically, Google's suggestion is to use budget notifications to turn off billing for the project with code. That also stops your paid services.

## Firebase App Hosting pricing

App Hosting is Firebase's newer product for full-stack apps, such as Next.js or Angular with server rendering. Firebase's pricing page says it needs a billing account, so it runs on Blaze.

| App Hosting | Price |
| --- | --- |
| Outgoing bandwidth | Free up to 10 GiB a month, then $0.15 per GiB cached and $0.20 per GiB uncached |
| Storage | Free up to 5 GB, then $0.10 per GB |
| Compute and builds | Billed through Google Cloud Run, Cloud Build and Artifact Registry at their own rates |

So an App Hosting bill has more lines than a Hosting bill. If your app does not need a server, classic Firebase Hosting is cheaper and simpler.

![Firebase's pricing table for Hosting: 10 GB of storage and 360 MB a day of data transfer at no cost, then $0.026 and $0.15 per GB on Blaze.](/guides/firebase-hosting-pricing/firebase-hosting.jpg "Firebase Hosting rows on the pricing page, 19 November 2026")

## If your site is only static files

Firebase Hosting serves static files well, and Spark costs nothing. The questions are what happens at the limit and whether you want a Google Cloud project at all. These hosts compare:

| Host | Price | Custom domain | When traffic grows | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | Unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/firebase-hosting-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, and has no database or sign-in like Firebase's. There is no free plan, only a 7-day trial on a free subdomain. It has no command-line deploy like `firebase deploy`, though its API and GitHub Action fill that role. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a site that has outgrown Spark's transfer limit, where a fixed bill matters more than pay-as-you-go.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited, so a traffic spike does not disable the site.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/firebase-hosting-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want free static hosting with no transfer limit. See [Cloudflare Pages pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a 1 GB site size limit and a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/firebase-hosting-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For more hosts, see the [Firebase Hosting alternatives](https://bootstrap.build/articles/firebase-hosting-alternatives/) and the wider [Firebase alternatives](https://bootstrap.build/articles/firebase-alternatives/) on bootstrap.build. For the other big clouds, see [AWS Amplify pricing in 2026](/guides/aws-amplify-pricing/) and [Azure Static Web Apps pricing in 2026](/guides/azure-static-web-apps-pricing/).

## Which Firebase plan should you choose?

- **A small site or a prototype:** Spark. Keep few old releases, and watch the usage dashboard after a launch.
- **A site that must not go offline when traffic spikes:** Blaze, with a budget alert. Know that the alert does not stop charges.
- **An app that uses Cloud Functions:** Blaze. Functions are not available on Spark.
- **A Next.js or Angular app with server rendering:** App Hosting on Blaze, or classic Hosting if a static export works.
- **A static site that outgrows Spark and should have a fixed bill:** a flat-price host such as Static.app.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Firebase Hosting free?

Yes, on the Spark plan, with no payment method. It includes 10 GB of Hosting storage and 360 MB of data transfer a day, which Firebase's docs describe as 10 GB a month. Custom domains and SSL are included.

### How much does Firebase Hosting cost on Blaze?

Blaze includes Spark's free usage. After that, storage is $0.026 per GB a month and data transfer is $0.15 per GB. Blaze's free usage is counted per day.

### What happens when a Firebase site goes over the free limit?

On Spark, Firebase gives a short grace period and then disables the site until the next month, unless you upgrade to Blaze. If you reach the 10 GB storage limit, you cannot deploy until you delete old releases or upgrade.

### Can I set a spending cap on Firebase?

Not directly. Firebase's docs say budget alerts do not cap usage or charges. Google suggests using budget notifications to turn off billing for a project with code, which also stops its paid services.

### Why is my Firebase Hosting storage full?

Firebase stores the files of past releases as well as the live one. Set a limit on how many releases Firebase keeps, or delete old releases by hand.

### Does Firebase App Hosting have a free tier?

It needs a billing account, so it runs on Blaze. Outgoing bandwidth is free up to 10 GiB a month and storage up to 5 GB. Compute and builds are billed through Google Cloud Run, Cloud Build and Artifact Registry.
