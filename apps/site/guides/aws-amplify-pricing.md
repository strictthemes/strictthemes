---
title: "AWS Amplify pricing in 2026: builds, storage and data transfer"
description: How AWS Amplify Hosting is priced in 2026, what the free tier and the new AWS credits cover, two worked examples from AWS, and cheaper ways to host a static site.
kind: Pricing
date: 2026-11-18
checked: 2026-11-18
---

AWS Amplify Hosting has no plans and no seats. You pay for what you use: build minutes, storage, data served to visitors and, if your app renders pages on the server, requests and compute time. The rate that matters most for most sites is data transfer, at $0.15 per GB served.

This guide is for developers who deploy a front end to Amplify, from a Git repository or a coding agent. It covers each rate, the free allowance, two worked examples from AWS's own pricing page, and cheaper options for a site that is only static files. We read every number below on the AWS Amplify pricing page on 18 November 2026.

![The AWS Amplify pricing page, with a news note about AWS Free Tier credits for new customers.](/guides/aws-amplify-pricing/amplify.jpg "The AWS Amplify pricing page, 18 November 2026")

## TL;DR

- **Amplify is pay as you go, with no seat fees.** AWS says working with teams is always free.
- **Data served to visitors costs $0.15 per GB.** For a busy static site, that is most of the bill.
- **Builds cost $0.01 a minute** on the standard machine, and every build's files are stored at $0.023 per GB a month until you delete the app.
- **Server-side rendering adds $0.30 per million requests** and $0.20 per GB-hour of compute.
- **The free allowance has changed for new accounts.** Since 15 July 2025, new AWS customers get up to $200 in credits instead.

## AWS Amplify Hosting pricing in 2026

| What you use | Rate | Free allowance in the table |
| --- | --- | --- |
| Build minutes, standard machine (4 vCPU, 8 GB) | $0.01 a minute | 1,000 minutes a month |
| Build minutes, large machine (8 vCPU, 16 GB) | $0.025 a minute | None |
| Build minutes, extra-large machine (36 vCPU, 72 GB) | $0.10 a minute | None |
| Storage on the CDN | $0.023 per GB a month | 5 GB |
| Data transfer out | $0.15 per GB served | 15 GB a month |
| Server-side rendering requests | $0.30 per million | 500,000 a month |
| Server-side rendering duration | $0.20 per GB-hour | 100 GB-hours a month |
| Web application firewall | $15 a month per app, plus WAF costs | None |

AWS says each project can hold several sites, and that public SSL certificates come at no extra cost. A backend built with Amplify, such as sign-in, a database or functions, is billed by each AWS service it uses, not by Amplify Hosting.

## The free tier, and the credits that replaced it

The pricing table's free column says "free for 12 months". A note at the top of the same page changes that for new accounts:

- **Since 15 July 2025,** new AWS customers get up to $200 in AWS Free Tier credits, which can be spent on Amplify among other services.
- **At sign-up you choose a free plan or a paid plan.** The free plan lasts 6 months after you create the account.
- **If you upgrade to a paid plan,** any credit left is applied to your bills. All credits must be used within 12 months of creating the account.

So for a new account, the free allowance in the table is best read as how far the credits go, not as a separate free tier. If your account is older, check its Free Tier status in the AWS console.

## Two worked examples, from AWS

AWS's pricing page works through two cases, outside the free tier. We repeat its figures here.

**A startup team.** Five developers commit twice a day each, and the app has 300 daily active users. Builds take 3 minutes, so 600 build minutes a month cost $6. Visitors download about 13 GB a month, which is $1.97, and storage adds $0.11. The total is **$8.08 a month**.

**A busier site that rarely changes.** 10,000 daily active users, two updates a month. Builds cost $0.06. Visitors download about 439 GB a month, which is $65.92 with storage. The total is **$65.98 a month**.

The second example shows where an Amplify bill comes from. Builds are cheap. Traffic is not: when the traffic doubles, the bill roughly doubles with it.

One more thing from the examples: storage is counted for every build, not only the latest one. AWS's formula multiplies the size of the app by the number of builds, and its table says the storage charge "recurs until the app is deleted". An app you build often keeps adding to it.

## If your site is only static files

Amplify makes sense when you use the rest of AWS, or render pages on the server. If your site is a folder of HTML, CSS and images, three hosts serve it without a per-GB charge:

| Host | Price | Custom domain | Metered traffic | Git needed |
| --- | --- | --- | --- | --- |
| Cloudflare Pages or Workers | Free for static files | Yes | No | No, direct upload works |
| Static.app | From $6 a month, or $60 a year | Yes, from the first paid plan | No, unlimited traffic | No |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

For AWS's second example, 439 GB a month of static files, Amplify charges about $66 a month. Cloudflare charges nothing for those requests, and Static.app lists unlimited traffic on its $6 plan.

### Cloudflare Pages and Workers

[Cloudflare](https://pages.cloudflare.com/) serves static files free and without a bandwidth limit, on Pages or on Workers, which Cloudflare now recommends for new projects. The free plan allows 20,000 files per site and 25 MiB per file. Server code is billed separately, from a $5 monthly minimum. [Cloudflare Pages pricing in 2026](/guides/cloudflare-pages-pricing/) has the details.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/aws-amplify-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want to pay nothing for static traffic and are fine in Cloudflare's dashboard.

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, or publish with its API, its GitHub Action or its MCP server from a coding agent, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/aws-amplify-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

It has real limits. There is no free plan, only a 7-day trial on a free subdomain. It runs no server code, so server-rendered pages will not work there. It does not build from Git. And 500 MB on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a static site with real traffic, where a fixed bill matters more than the rest of AWS.

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories. GitHub sets a 1 GB maximum site size and a soft limit of 100 GB of bandwidth a month, and says Pages is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/aws-amplify-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For more hosts, see the AWS Amplify alternatives on [bootstrap.build](https://bootstrap.build/articles/aws-amplify-alternatives/). To compare with other developer hosts, see [Netlify pricing in 2026](/guides/netlify-pricing/) and [Vercel pricing in 2026](/guides/vercel-pricing/).

## Which way should you host on Amplify?

- **Your app uses other AWS services, or renders pages on the server:** Amplify. Set a budget alert in the AWS console, because there is no plan price to cap the bill.
- **A static site with modest traffic:** Amplify's costs stay small, as AWS's first example shows.
- **A static site with heavy traffic:** a host without a per-GB charge, such as Cloudflare or Static.app.
- **A new AWS account:** use the credits, but note when the 6-month free plan and the 12-month credit window end.

## FAQ

### How much does AWS Amplify Hosting cost?

There is no plan price. You pay $0.01 a build minute on the standard machine, $0.023 per GB a month of storage, $0.15 per GB served to visitors, and, for server-rendered pages, $0.30 per million requests and $0.20 per GB-hour.

### Is AWS Amplify free?

Partly. The pricing table lists a free allowance of 1,000 build minutes, 5 GB of storage and 15 GB of data transfer a month. New AWS customers since 15 July 2025 get up to $200 in credits instead, on a free plan that lasts 6 months.

### Does Amplify charge per user?

No. AWS's pricing page says working with teams on Amplify is always free, with no pay-per-seat pricing.

### Why is my Amplify bill growing?

Usually traffic, at $0.15 per GB served. Storage can grow too: AWS counts storage for every build, and charges for it until the app is deleted.

### What is cheaper than AWS Amplify for a static site?

Cloudflare serves static files free on Pages or Workers. Static.app charges a flat price from $6 a month with unlimited traffic. GitHub Pages is free for public repositories, with a soft limit of 100 GB of bandwidth a month.

### Does the Amplify free tier last 12 months?

The pricing table says so, but a note on the same page says new customers since 15 July 2025 get credits instead: up to $200, on a free plan that lasts 6 months, with all credits to be used within 12 months.
