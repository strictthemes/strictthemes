---
title: "Glitch alternatives in 2026: where to move your projects"
description: Glitch ended project hosting in July 2025. Seven places to host what you built there in 2026, split into static sites and apps that need a server, with prices and limits.
kind: Roundup
date: 2026-11-18
checked: 2026-11-18
---

Glitch ended project hosting on 8 July 2025. Its announcement kept dashboards and code downloads open through the end of 2025. On 18 November 2026, glitch.com sends you to the Glitch blog, and a project address we tried, `hello-express.glitch.me`, answers with "410 Gone".

So the question now is where to put the code you saved. This guide splits the answer in two, because Glitch hosted both kinds of project. A static site is a folder of HTML, CSS, JavaScript and images, and almost any host will take it. An app that runs a Node server needs a host that runs code. We checked every price and limit below on the hosts' own pages on 18 November 2026.

![The Glitch blog post from 22 May 2025, headed Important Changes are Coming to Glitch.](/guides/glitch-alternatives/glitch.jpg "The announcement on the Glitch blog, 22 May 2025")

## TL;DR

- **Best for a static site you want online with no Git:** Static.app. Upload a ZIP, edit files in the browser, and add a custom domain, from $6 a month.
- **Best free home that feels most like Glitch:** Neocities. A free site with an editor in the browser and a community around it.
- **Best free option if your code is on GitHub:** GitHub Pages.
- **Best for a quick share with no account:** Netlify Drop.
- **Best from the terminal:** Surge, free with custom domains.
- **Best free host for a Node app:** Render, if you can live with it sleeping after 15 minutes idle.
- **Best for an app that must stay awake:** Fly.io, billed by the second from about $2 a month.

## What happened to Glitch

On 22 May 2025, Glitch announced that project hosting and user profiles would shut down on 8 July 2025. The post gave two reasons: the cost of running millions of apps, which had grown as bad actors misused the platform, and the many newer platforms that now do the job. New Glitch Pro subscriptions stopped that day.

Glitch's later post, on 23 July 2025, said users could download projects and set redirects until the beginning of 2026. The first post promised that redirects set up before 31 December 2025 would stay active at least through the end of 2026.

If you set a redirect, plan for it to stop after that. If you never downloaded your code, look for any copy you have: a local folder, a GitHub repository you exported to, or a remix someone else made. We found no way to get code out of Glitch now.

## Glitch alternatives at a glance

| Host | Best for | Free plan | Paid from | Runs server code |
| --- | --- | --- | --- | --- |
| Static.app | Static sites with no Git | 7-day trial only | $6 a month | No |
| Neocities | A free site with a browser editor | Yes, 1 GB | $5 a month | No |
| GitHub Pages | Code already on GitHub | Yes, public repositories | Included in paid GitHub plans | No |
| Netlify Drop | Sharing a folder with no account | Yes, 300 credits a month | $9 a month | Functions only |
| Surge | Publishing from the terminal | Yes, with custom domains | $30 a month | No |
| Render | A free Node app that can sleep | Yes, sleeps after 15 minutes | $0 plus compute | Yes |
| Fly.io | An app that stays awake | $1 of free usage to start | Pay per second, from about $2 a month | Yes |

Glitch's own announcement named several platforms. Two of them are shutting down too: Val Town's pricing page says it closes on 10 January 2027, and Deno's pricing page says Deno Deploy will be sunset in April 2027. We left both out. We also left out Replit and CodeSandbox, because their pricing pages blocked our checks.

## Static sites: the best Glitch alternatives in 2026

### 1. Static.app: best for a static site with no Git

[Static.app](https://static.app/) hosts static sites. You drop a ZIP or a folder on the page, and the site is live with SSL. Like Glitch, it lets you open a file and edit its code in the browser after it is online. Paid plans include a custom domain, forms that collect submissions without a third-party service, analytics and unlimited traffic. It also offers password-protected pages and daily backups. It also has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's home page, headed One-click hosting solution for your static website, with an upload box.](/guides/glitch-alternatives/static-app.jpg "Static.app, 18 November 2026")

**Pricing:** Starter is $6 a month, or $60 a year, for 2 sites and 500 MB. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Limitations:** there is no free plan, only a 7-day trial on a free subdomain. It runs no server code, so an Express app will not work there, though its static front end will. And there is no community or remixing like Glitch had.

**Good for:** a portfolio, a landing page or a client site you want online today, with a domain and forms, and no Git.

### 2. Neocities: best free home that feels like Glitch

[Neocities](https://neocities.org/) is free static hosting with an editor in the browser, a community, site tags and follows. It has no advertising. Of the hosts here it is the closest to Glitch's spirit: you can make and share a small site for fun, for free.

![The Neocities home page, headed Create your own free website, with a sign-up form.](/guides/glitch-alternatives/neocities.jpg "Neocities, 18 November 2026")

**Pricing:** free sites get 1 GB of storage and 200 GB of bandwidth. Supporter is $5 a month for 50 GB of storage and 3,000 GB of bandwidth.

**Limitations:** it does not run server code. Its plan comparison lists custom domains, more than one site and uploads of any file type, but we could not tell from the page which of these are for Supporters only. Check before you plan on a custom domain for free.

**Good for:** a personal or hobby site, a zine, a fan page. The kind of thing many people made on Glitch.

### 3. GitHub Pages: best free option if your code is on GitHub

[GitHub Pages](https://pages.github.com/) publishes a static site from a GitHub repository. If you moved your Glitch code to a repository, it can go live from there.

![The GitHub Pages documentation home page.](/guides/glitch-alternatives/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Pricing:** free for public repositories on GitHub Free. Private repositories need a paid GitHub plan.

**Limitations:** a published site can be at most 1 GB, with a soft limit of 100 GB of bandwidth a month and 10 builds an hour. GitHub's limits page rules out sites mainly for commercial transactions or software as a service. You need to be comfortable with Git.

**Good for:** open source projects, documentation and personal sites.

### 4. Netlify Drop: best for a quick share with no account

[Netlify Drop](https://app.netlify.com/drop) takes a folder, a ZIP or a single HTML file and gives you a link. You can claim the project into a Netlify account later, and keep dropping updates with no Git.

![The Netlify Drop page, headed Drag and drop to publish instantly, with a drop area.](/guides/glitch-alternatives/netlify-drop.jpg "Netlify Drop, 18 November 2026")

**Pricing:** once claimed, a site lives on Netlify's plans. Free has 300 credits a month, and Personal is $9 a month for 1,000. A production deploy costs 15 credits and 1 GB of bandwidth costs 20.

**Limitations:** on the free plan, when the credits run out, every site on the account is paused until the next month. [Netlify pricing in 2026](/guides/netlify-pricing/) explains the credits.

**Good for:** showing someone a project in a minute, and a small site with modest traffic.

### 5. Surge: best for publishing from the terminal

[Surge](https://surge.sh/) publishes a folder with one command. Custom domains and certificates are free on every plan, with no project cap.

![The Surge home page, headed Publish to the web in one command, with a terminal example.](/guides/glitch-alternatives/surge.jpg "Surge, 18 November 2026")

**Pricing:** free. Pro is $30 a month and adds password protection, redirects and rewrites. Surge's pricing page says nothing is metered: no bandwidth billing and no overage charge.

**Limitations:** there is no browser upload, only the command line. A project can be at most 450 MB and 10,100 files. Redirects need Pro.

**Good for:** developers who want a free site on their own domain and are fine in a terminal.

## Apps that need a server: Glitch alternatives in 2026

Many Glitch projects were Node apps: an Express server, a bot, a small API. Those need a host that runs code. These two take a Node app from a repository or a container.

### 6. Render: best free host for a Node app

[Render](https://render.com/) runs web services, static sites, databases and background workers. Static sites are always free to deploy, and web services have a free instance type.

![Render's pricing page, headed Predictable pricing that scales with you, with the Hobby, Pro, Scale and Enterprise plans.](/guides/glitch-alternatives/render.jpg "Render's pricing page, 18 November 2026")

**Pricing:** the Hobby workspace is $0 plus compute, with 5 GB of bandwidth included. Pro is $25 a month plus compute, with 25 GB of bandwidth.

**Limitations:** Render's docs say a free web service spins down after 15 minutes with no traffic and takes about a minute to wake. Its files are lost whenever it restarts, redeploys or spins down. Each workspace gets 750 free instance hours a month. If you use all your bandwidth with no payment method on file, Render suspends your free services until the next month.

**Good for:** a Glitch-style Node app or bot that can wait a minute to wake up.

### 7. Fly.io: best for an app that must stay awake

[Fly.io](https://fly.io/) runs your app in small virtual machines, billed by the second while they run. Glitch's own announcement named it among the platforms that inspired it.

![Fly.io's pricing page, headed Start for free, pay as you grow.](/guides/glitch-alternatives/fly.jpg "Fly.io's pricing page, 18 November 2026")

**Pricing:** new accounts get $1 of free usage with no card. The smallest preset on the pricing page, a shared CPU with 256 MB of memory, is $2.19 a month in the region shown, with prices varying by region. Egress in North America and Europe is $0.02 per GB. Fly.io says it waives invoices under $5.

**Limitations:** you deploy with a command-line tool and a config file, which takes more setup than Glitch did. The bill depends on what you run, so use its cost calculator first.

**Good for:** a small app that must answer at once, such as a bot or a webhook receiver.

## Which Glitch alternative should you choose?

- **You have a folder of HTML, CSS and JavaScript, and want it on your own domain without Git:** Static.app.
- **You want free and a community, like Glitch was:** Neocities.
- **Your code is already on GitHub:** GitHub Pages.
- **You just want to show someone a project today:** Netlify Drop.
- **You live in the terminal:** Surge.
- **Your project was an Express app and can sleep when idle:** Render's free tier.
- **Your app must answer at once, every time:** Fly.io, or a paid Render instance.

Moving a project is also a good moment to give it a design. The [free themes on this site](/themes/) install into a Tailwind or shadcn project with one command, and [a DESIGN.md](/guides/what-is-design-md/) keeps a coding agent on that design while it helps you rebuild.

## FAQ

### Is Glitch shut down?

Glitch ended project hosting and user profiles on 8 July 2025. On 18 November 2026, glitch.com redirects to the Glitch blog, and a project address we tried answers with "410 Gone".

### Can I still download my Glitch projects?

Glitch said downloads would stay open until the beginning of 2026. When we checked on 18 November 2026, the dashboard address led to the blog, and we found no way to download code. Look for a local copy, a GitHub export or a remix.

### Will my glitch.me links keep working?

Only if you set a redirect before 31 December 2025. Glitch promised those redirects would stay active at least through the end of 2026. Do not count on them after that.

### What is the best free Glitch alternative?

For a static site, Neocities is the closest in spirit and GitHub Pages is the most familiar to developers. For a Node app, Render has a free tier that sleeps after 15 minutes without traffic.

### Where can I host a Node.js app from Glitch?

Render and Fly.io both run Node apps. Render has a free instance type that sleeps when idle. Fly.io bills by the second, from about $2 a month for its smallest machine.

### Why are Val Town and Deno Deploy not on this list?

Both are closing. Val Town's pricing page says it shuts down on 10 January 2027, and Deno's pricing page says Deno Deploy will be sunset in April 2027. Moving a Glitch project there would mean moving it again within months.
