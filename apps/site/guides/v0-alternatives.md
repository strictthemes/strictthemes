---
title: "v0 alternatives in 2026: five other ways to build an app or site with AI"
description: Five alternatives to Vercel's v0 in 2026, from browser app builders to coding agents and an AI website editor, with prices, free plans, limits, and where to host what you build.
kind: Roundup
date: 2026-11-19
checked: 2026-11-19
---

v0 is Vercel's AI builder. You describe a page or an app, it writes React and Next.js code, and it deploys to Vercel. It has a free plan with $5 of one-time credits and 7 messages a day, and Plus costs $30 per user a month. Reasons to look elsewhere include the daily message limit on Free, the tie to Vercel, and wanting either more control over the code or less.

This guide covers five alternatives in three groups: app builders that run in the browser, coding agents that work in your editor, and an AI website editor for marketing sites. We read every price below on each tool's own pricing page or docs on 19 November 2026.

![v0's pricing page, with Free at $0 and Plus at $30 per user a month.](/guides/v0-alternatives/v0.jpg "v0's pricing page, 19 November 2026")

## TL;DR

- **Best for a full app in the browser with hosting included:** Bolt.new. Free with 1 million tokens a month; Pro from $25 a month with a custom domain.
- **Best for a team building an app together:** Lovable. Free with daily build credits; Pro from $25 a month for 100 credits.
- **Best if you want to own and edit the code:** Cursor, a coding agent in an editor. Free, then from $8 a month.
- **Best for frontier models in a $20 plan:** Devin Desktop, formerly Windsurf. Pro is $20 a month.
- **Best for a marketing website you edit by hand afterwards:** Siter.io, a visual editor with AI. From $7 a month billed yearly.
- **To host what you build:** a static site from any of these can go on a flat-price host such as Static.app, or a free one such as Cloudflare Pages.

## What v0 costs

| v0 plan | Price | What you get |
| --- | --- | --- |
| Free | $0 | $5 in one-time credits for new users, 7 messages a day, deploys to Vercel, GitHub sync |
| Plus | $30 per user a month | All models, $30 of monthly credits per user, $2 of free daily credits on login |
| Business | $100 per user a month | Everything in Plus, with training opt-out by default |
| Enterprise | Custom | SAML SSO, role-based access, priority access, support SLAs |

v0 bills its models by tokens, per million: v0 Mini is $0.10 in and $0.50 out, v0 Pro $2 and $10, v0 Max $4 and $20. Credits pay for that usage. v0 deploys to Vercel, and Vercel's free Hobby plan is for personal, non-commercial use only; see [Vercel pricing in 2026](/guides/vercel-pricing/).

## v0 alternatives at a glance

| Tool | Kind | Free plan | Paid from | Hosting included |
| --- | --- | --- | --- | --- |
| Bolt.new | Browser app builder | 1M tokens a month, 300K a day | $25 a month | Yes, custom domain on Pro |
| Lovable | Browser app builder with backend | 5 build credits a day, up to 30 a month | $25 a month | Yes, custom domain on Pro |
| Cursor | Coding agent in an editor | Limited usage | $8 a month | No |
| Devin Desktop (Windsurf) | Coding agent in an editor | Light quota | $20 a month | No |
| Siter.io | Visual website editor with AI | No, 3-day trial with a card | $7 a month, billed yearly | Yes, own domain |

## Browser app builders

### 1. Bolt.new: best for a full app in the browser with hosting included

[Bolt.new](https://bolt.new/) builds an app from prompts in the browser, with a database and hosting. Unlike v0, it hosts the result itself instead of deploying to Vercel.

![Bolt.new's pricing page, with Free at $0 and Pro at $25 a month billed monthly.](/guides/v0-alternatives/bolt.jpg "Bolt.new's pricing page, 19 November 2026")

The free plan gives 1 million tokens a month, at most 300,000 a day, with Bolt branding on published sites. Pro is $25 a month, or $18 billed yearly, from 10 million tokens with no daily limit, a custom domain and no branding. Unused paid tokens roll over for up to two months. Teams is $30 per member a month.

What it does not do: tokens run faster on a large project, because Bolt reads your files with each prompt, and the free daily limit is easy to hit in a long session. See [Bolt.new pricing in 2026](/guides/bolt-new-pricing/).

**Good for:** a prototype or small app that you want online quickly, with a database, without setting up hosting.

### 2. Lovable: best for a team building an app together

[Lovable](https://lovable.dev/) also builds apps from prompts and hosts them. Every plan lists Lovable Cloud, and even the free plan allows unlimited collaborators.

![Lovable's pricing page, with Free, Pro at 25 and Business at 50 a month, shown in euros for our location.](/guides/v0-alternatives/lovable.jpg "Lovable's pricing page, shown in euros, 19 November 2026")

Lovable's docs list prices in US dollars: Pro is $25 a month for 100 credits, or $250 a year, and Business is $50 a month for 100 credits, adding SSO and a team workspace. Larger credit tiers go up to 3,000 credits a month. The free plan gives 5 build credits a day, capped at 30 a month. Free apps run on lovable.app addresses with Lovable's badge; Pro adds custom domains, removes the badge and lets unused credits roll over. Its pricing page showed us euros, so check the currency for where you are.

What it does not do: credits are the whole budget, so check your balance as you go. The free plan's 30 build credits a month is enough to try it, not to build much.

**Good for:** a team building an internal tool or a product together, in one place.

## Coding agents in an editor

These work on code on your computer, so you own the project, choose any framework, and host it wherever you like. They need more from you than v0 does.

### 3. Cursor: best if you want to own and edit the code

[Cursor](https://cursor.com/) is an editor with a coding agent. It is now sold as part of The X Subscription, with X and Grok features included. Free has limited usage. Plus is $8 a month with Cursor's own models only. Premium is $30 a month, with 4 times Plus's usage, cloud agents, and third-party models at their API list price.

![Cursor's pricing page, with Free at $0, Plus at $8, Premium at $30 and Super at $100 a month.](/guides/v0-alternatives/cursor.jpg "Cursor's pricing page, 19 November 2026")

What it does not do: it does not host anything, and you need to know enough to run and deploy a project. Usage resets weekly. Plus cannot use third-party models, and on Premium and up they are billed at list price on top of the plan. See [Cursor pricing in 2026](/guides/cursor-pricing/).

**Good for:** developers who want v0's speed on a codebase they control.

### 4. Devin Desktop (Windsurf): best for frontier models in a $20 plan

[Devin Desktop](https://devin.ai/pricing) is the new name for Windsurf, from Cognition. Free has a light quota, limited models and unlimited Tab completions. Pro is $20 a month with frontier models from the major labs and cloud agents. Max is $200 a month. Teams is a flat $80 a month for up to 100 members, plus usage, billed as shared on-demand credits. The page does not say how much usage the $80 includes.

![Devin's pricing page for individuals, with Free at $0, Pro at $20 and Max at $200 a month.](/guides/v0-alternatives/devin.jpg "Devin pricing for individuals, 19 November 2026")

What it does not do: like Cursor, it does not host, and the page does not say how big each plan's usage allowance is. See [Windsurf pricing in 2026](/guides/windsurf-pricing/).

**Good for:** developers who want frontier models included in a $20 plan, and small teams.

## An AI website editor

### 5. Siter.io: best for a marketing website you edit by hand afterwards

[Siter.io](https://siter.io/) is a visual website editor. You can place elements anywhere on a free-form canvas, or describe a page and its AI builds it there, as editable elements rather than code. Sites publish to your own domain.

![Siter.io's pricing page, with Solo at $7, Plus at $12 and Pro at $24 a month billed yearly.](/guides/v0-alternatives/siter.jpg "Siter.io's pricing page, shown with yearly billing, 19 November 2026")

Solo is $7 a month billed yearly, or $8 month to month, for 1 website, 600 AI credits a month and 25 GB of traffic. Plus is $12, or $14 monthly, for 3 websites and 800 AI credits. Pro is $24, or $28 monthly, for 5 websites, 2,000 AI credits and HTML download. When we checked, its pricing page showed a Black Friday sale of 35% off.

What it does not do: it builds websites, not apps, so there is no database or app logic like v0's. There is no free plan: every plan starts with a 3-day trial that needs a card.

**Good for:** a landing page or company site that a non-developer will keep editing.

## Where to host what you build

Bolt.new, Lovable and Siter.io host for you. v0 deploys to Vercel. Cursor and Devin Desktop leave hosting to you. If what you built is a static site, HTML, CSS and JavaScript with no server, you can put it on any static host:

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

[Static.app](https://static.app/) takes a ZIP or a folder and serves it with SSL, a custom domain, forms and analytics, at a flat price from $6 a month. It has [a page on hosting sites made with v0](https://static.app/v0-hosting), and an API and MCP server so a coding agent can publish to it. It runs no server code, so a v0 app that uses Next.js server features will not work there, and it has no free plan, only a 7-day trial. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment. [Cloudflare Pages](https://pages.cloudflare.com/) is free for static files. [GitHub Pages](https://pages.github.com/) is free for public repositories.

If you are comparing Bolt.new instead, see [Bolt.new alternatives in 2026](/guides/bolt-alternatives/). For more on hosting AI-generated sites, see [hosting an AI-generated website](https://bootstrap.build/articles/host-ai-generated-website/) and the [Lovable alternatives](https://bootstrap.build/articles/lovable-alternatives/) on bootstrap.build. Before you share the link, [check the live page against your design](/guides/publish-and-check-live-page/).

## Which v0 alternative should you choose?

- **You liked v0 but want hosting that is not Vercel:** Bolt.new.
- **A team that wants to build and host an app in one tool:** Lovable.
- **You can code, or want to learn, and want to own the project:** Cursor or Devin Desktop.
- **You want frontier models in a $20 plan:** Devin Desktop Pro.
- **You need a marketing site that someone will edit by hand:** Siter.io.
- **You built a static site and only need it online:** a static host, such as Static.app or Cloudflare Pages.

## FAQ

### What is the best free alternative to v0?

The two browser builders count differently, so they are hard to rank. Bolt.new's free plan gives 1 million tokens a month, at most 300,000 a day, with hosting included. Lovable's free plan gives 5 build credits a day, up to 30 a month. Cursor and Devin Desktop have free plans for coding in an editor.

### How much does v0 cost?

v0 has a free plan with $5 of one-time credits and 7 messages a day. Plus is $30 per user a month with $30 of monthly credits, and Business is $100 per user a month. Enterprise is priced on request.

### Is Bolt.new or Lovable better than v0?

They do the same job differently. Both host what you build themselves, while v0 deploys to Vercel. Bolt.new prices by tokens and Lovable by credits, and both have a Pro plan from $25 a month with a custom domain.

### Can I host a v0 site without Vercel?

If your project is a static site, yes: export it and upload it to a static host such as Static.app, Cloudflare Pages or GitHub Pages. A v0 app that uses Next.js server features needs a host that runs Node.js.

### Is there a v0 alternative that is not for developers?

Siter.io is a visual website editor with AI, where the result stays editable on a canvas instead of as code. It builds websites rather than apps.

### Is Windsurf a v0 alternative?

Windsurf, now called Devin Desktop, is a coding agent in an editor rather than a browser builder. It suits people who want to own and edit the code. Pro is $20 a month.
