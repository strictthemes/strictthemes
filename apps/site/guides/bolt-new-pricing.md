---
title: "Bolt.new pricing in 2026: Free, Pro, Teams and how tokens work"
description: What Bolt.new costs in 2026. The free plan's daily and monthly token limits, Pro at $25 a month with 10 million tokens, Teams per member, token rollover, hosting limits and yearly prices.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Bolt.new builds apps and websites from prompts, and it prices that work in tokens. The free plan gives 1 million tokens a month, at most 300,000 a day. Pro is $25 a month and starts at 10 million tokens, with no daily limit and a custom domain. Teams is $30 per member a month. Yearly billing brings Pro down to $18 a month.

This guide is for anyone building with Bolt.new, from a first prototype to a site for a client. We read every number below on Bolt's pricing page and its pricing FAQ on 19 November 2026.

![Bolt.new's pricing page, with Free at $0 and Pro at $25 a month billed monthly.](/guides/bolt-new-pricing/bolt.jpg "Bolt.new's pricing page, 19 November 2026")

## TL;DR

- **Free is 1 million tokens a month,** at most 300,000 a day, with Bolt branding on published sites. Free tokens do not roll over.
- **Pro is $25 a month,** or $18 a month billed yearly, starting at 10 million tokens with no daily limit.
- **Pro adds a custom domain,** no Bolt branding, private sharing and larger hosting limits.
- **Teams is $30 per member a month,** or $27 billed yearly. Tokens are not shared between members.
- **Unused paid tokens roll over** and stay in your balance for up to two months.

## Bolt.new plans in 2026

| | Free | Pro | Teams | Enterprise |
| --- | --- | --- | --- | --- |
| Price, monthly billing | $0 | $25 a month | $30 per member a month | Custom |
| Price, yearly billing | $0 | $18 a month, $216 a year | $27 per member a month, $324 a year | Custom |
| Tokens | 1M a month, 300K a day | From 10M a month, no daily limit | Each paid member gets the plan's allowance | Custom |
| Token rollover | No | Up to two months | Up to two months | Custom |
| Collaborators | Up to 3 | Unlimited | Unlimited | Unlimited |
| Hosting | Up to 333K web requests | Up to 1M web requests | As Pro | Custom |
| Custom domain | No | Yes | Yes | Yes |
| Bolt branding | Yes | No | No | No |
| File upload limit | 10 MB | 100 MB | As Pro | Custom |

Every plan includes public and private projects and unlimited databases. Pro adds more database capacity, a choice of database provider, AI image editing and SEO features. Teams adds centralized billing, admin controls, user provisioning, private npm registries and design system knowledge. Enterprise adds SSO, audit logs, compliance support and 24/7 support.

Yearly billing saves 28% on Pro: $216 a year against $300 billed monthly.

## How Bolt's tokens work

Bolt's FAQ says tokens measure the work Bolt does: reading your prompts and project files, making a plan and writing code. Your plan gives a monthly token allowance, and you can see your balance on the Billing and usage page.

- **Free tokens** are 1 million a month with a daily limit of 300,000, and they do not roll over.
- **Paid tokens roll over.** Unused tokens stay in your balance for up to two months, as long as the subscription is active.
- **Yearly plans** still refresh tokens once a month. Paying yearly changes the price, not the allowance timing.

A large project uses more tokens per prompt, because Bolt reads more files. Bolt's help center has a page on making tokens go further; the general rule is smaller, more precise prompts.

## Teams

Teams costs $30 per paid member a month. Each paid member gets their own token allowance; tokens are not shared between members. You can add free members who can view team projects, but they get no tokens, so they cannot send prompts.

## Changing or cancelling a plan

Bolt's FAQ says upgrades apply at once and downgrades start at your next billing date; on a yearly plan, that is the yearly renewal. If you cancel, your plan and unused tokens stay active until the end of the billing period, then the account moves to Free.

## Hosting a Bolt site somewhere else

Bolt hosts what you build, with a request limit: 333,000 web requests on Free and 1 million on Pro. On Free, the site carries Bolt branding and cannot use your own domain. If your project is a static site and you export its built files, you can host it on your own domain without a Bolt subscription:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Static.app has [a page on hosting sites built with Bolt.new](https://static.app/bolt-new-hosting). Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/bolt-new-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so a Bolt app that needs its database or server functions will not work there. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git, so you upload the built folder. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a landing page or portfolio built in Bolt, on your own domain, after you stop paying for Bolt.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/bolt-new-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** free static hosting with no request limit, if you are at home in Cloudflare's dashboard. See [Cloudflare Pages and Workers pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/bolt-new-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** open source projects and personal sites already on GitHub.

For more on where AI-generated sites can live, see [hosting an AI-generated website](https://bootstrap.build/articles/host-ai-generated-website/) on bootstrap.build. Before you publish, [check the live page against your design](/guides/publish-and-check-live-page/).

## Which Bolt.new plan should you choose?

- **Trying Bolt, or a small prototype:** Free. Plan around the 300,000-token daily limit.
- **A real project with your own domain:** Pro, yearly if you will use it for months.
- **A team where several people prompt:** Teams, with paid seats only for people who build.
- **A finished static site you no longer edit:** export the built files, host them elsewhere, and cancel Bolt.

## FAQ

### Is Bolt.new free?

Yes. The free plan gives 1 million tokens a month, with a daily limit of 300,000, up to 3 collaborators and hosting with Bolt branding. Free tokens do not roll over.

### How much does Bolt.new Pro cost?

$25 a month billed monthly, or $18 a month billed yearly at $216 a year. It starts at 10 million tokens a month with no daily limit.

### Do Bolt.new tokens roll over?

On paid plans, yes. Unused tokens stay in your balance for up to two months while your subscription is active. Free plan tokens do not roll over.

### How does Bolt.new Teams pricing work?

Teams is $30 per paid member a month, or $27 billed yearly. Each paid member has their own token allowance. Free members can view team projects but cannot send prompts.

### Can I use a custom domain on Bolt's free plan?

No. Custom domains need Pro or higher. Free sites carry Bolt branding.

### What happens to my tokens if I cancel Bolt.new?

Your plan and unused tokens stay active until the end of the billing period. Then your account moves to the Free plan.
