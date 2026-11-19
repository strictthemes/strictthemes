---
title: "Azure Static Web Apps pricing in 2026: Free vs Standard"
description: What Azure Static Web Apps costs in 2026. The Free plan's limits and what happens when you go over, Standard at $9 per app, bandwidth, storage, custom domains and APIs.
kind: Pricing
date: 2026-11-19
checked: 2026-11-19
---

Azure Static Web Apps has two plans. Free costs nothing, for hobby and personal projects. Standard is $9 per app a month, for production. Both include 100 GB of bandwidth a month per Azure subscription. The difference that matters most is what happens when you go over: on Standard you pay $0.20 per GB, and on Free, Microsoft says it will stop serving your site.

This guide is for developers who host a static site or a front end with an API on Azure. We read every number below on Microsoft's pricing page and in the Static Web Apps docs on 19 November 2026.

![Microsoft's pricing table for Azure Static Web Apps, comparing the Free plan with Standard at $9 per app a month.](/guides/azure-static-web-apps-pricing/azure.jpg "Azure Static Web Apps pricing, 19 November 2026")

## TL;DR

- **Free is $0,** with 100 GB of bandwidth per subscription, 2 custom domains per app and 0.5 GB of storage. If you go over, the site is not served.
- **Standard is $9 per app a month,** billed by the hour. Bandwidth past 100 GB is $0.20 per GB.
- **Standard adds custom authentication, more domains, more storage and an SLA,** and lets you bring your own Azure Functions app.
- **Enterprise-grade edge, with Azure Front Door, is $17.52 per app a month** on top of Standard.
- **The Dedicated plan was retired on 31 October 2025.** Free and Standard are what is left.

## Azure Static Web Apps plans in 2026

| | Free | Standard |
| --- | --- | --- |
| Price | $0 | $9 per app a month |
| Bandwidth included | 100 GB per subscription | 100 GB per subscription |
| Bandwidth over that | Not available | $0.20 per GB |
| Custom domains | 2 per app | 5 per app |
| Storage | 0.5 GB in all, 0.25 GB per deployment | 2 GB in all, 0.5 GB per deployment |
| Apps per subscription | 10 | 100 |
| Preview environments | 3 | 10 |
| Custom authentication | No | Yes |
| APIs with Azure Functions | Managed | Managed, or bring your own |
| SLA | No | Yes |

Standard's price is based on 730 hours a month, and Microsoft bills it by the hour. Both plans include free SSL certificates and Azure's built-in sign-in providers. A deployment can hold at most 15,000 files, on either plan.

One number disagrees between Microsoft's own pages. The pricing page and the plans doc give Standard 5 custom domains per app. The quotas doc gives 6. Plan for 5.

## What the Free plan includes, and where it stops

Free is meant for hobby and personal projects, in Microsoft's words. It is generous on bandwidth for a small site: 100 GB a month is a lot of page views for a site of text and compressed images.

The catch is the edge. Under the pricing table, Microsoft writes that if your site exceeds the usage quotas, "we will not be able to serve your site". There is no overage to buy on Free. So a traffic spike or a large video file can stop the site being served. Microsoft's plans doc says to pick Standard when you expect traffic to exceed the bandwidth limits.

Two other limits are easy to hit. Storage is 0.25 GB per deployment, so a site with many large images may not fit. And the 100 GB is per subscription, shared by every Static Web App in it.

## What Standard adds for $9 a month

- **Overage instead of an outage.** Bandwidth past 100 GB is $0.20 per GB.
- **Custom authentication,** with your own identity provider instead of only the built-in ones.
- **Bring your own Functions app.** Your API can run on an Azure Functions app you manage, billed at its own rates, instead of only the managed one.
- **More of everything:** 5 domains per app, 2 GB of storage, 100 apps and 10 preview environments.
- **An SLA.**

Each app is priced on its own. Three sites on Standard are $27 a month before any overage.

**Enterprise-grade edge** adds Azure Front Door to a Standard app, for DDoS protection and faster delivery worldwide. It is $17.52 per app a month on top of the $9.

## APIs and other costs

Static Web Apps can serve an API built with Azure Functions. Microsoft's pricing page says these APIs are billed at the Azure Functions Consumption plan rates, and that Functions includes 1 million free executions. Database connections, a preview feature, are free while the preview lasts.

If you build with GitHub Actions, Microsoft's docs note one more cost that does not appear on Azure's bill. GitHub stores the build artifacts, and they count against your GitHub Actions storage quota.

## If your site is only static files

Static Web Apps is a good fit if you already work in Azure. If you do not, its portal, subscriptions and resource groups are a lot to learn for a folder of HTML. These hosts are simpler to start with:

| Host | Price | Custom domain | When traffic grows | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | Unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP or a folder, and the site is live with SSL. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics. It has an API, a GitHub Action and an MCP server, so a coding agent can publish to it.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/azure-static-web-apps-pricing/static-app.jpg "Static.app's pricing page, shown with yearly billing, 18 November 2026")

What it does not do: it runs no server code, so there is no API like Azure Functions. There is no free plan, only a 7-day trial on a free subdomain. It does not build from Git. And 500 MB of storage on Starter is small for an image-heavy site. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a client site or landing page where a fixed bill and built-in forms matter more than a cloud account.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited, so there is no bandwidth edge to fall off.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/azure-static-web-apps-pricing/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want free static hosting with no traffic cap. See [Cloudflare Pages pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a 1 GB site size limit and a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/azure-static-web-apps-pricing/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** documentation and open source projects that already live on GitHub.

For more hosts, see the Netlify alternatives on [bootstrap.build](https://bootstrap.build/articles/netlify-alternatives/) and [WebDesignerHut](https://webdesignerhut.com/netlify-alternatives/). For the other big clouds, see [AWS Amplify pricing in 2026](/guides/aws-amplify-pricing/) and [Firebase Hosting pricing in 2026](/guides/firebase-hosting-pricing/).

## Which Azure Static Web Apps plan should you choose?

- **A personal site or a demo:** Free. Keep large files elsewhere, and know the site stops if it goes over 100 GB.
- **Anything that must stay online:** Standard at $9 per app. Overage is billed instead of the site going dark.
- **Your own sign-in provider, or an API on your own Functions app:** Standard.
- **Visitors around the world and a need for DDoS protection:** Standard with enterprise-grade edge, at $26.52 per app a month in all.
- **A static site and no Azure account yet:** a simpler host, such as Static.app or Cloudflare Pages.

Wherever you deploy, check the live page, not only the build. [Put an agent-built page online, then check the live address](/guides/publish-and-check-live-page/) shows how.

## FAQ

### Is Azure Static Web Apps free?

Yes, there is a Free plan for hobby and personal projects. It includes 100 GB of bandwidth a month per subscription, 2 custom domains per app and free SSL. If you exceed its quotas, Microsoft says it will not serve your site.

### How much does Azure Static Web Apps Standard cost?

$9 per app a month, based on 730 hours and billed by the hour. Bandwidth past the included 100 GB is $0.20 per GB. Enterprise-grade edge is $17.52 per app a month more.

### What happens if I go over the Free plan's bandwidth?

There is no overage on Free. Microsoft's pricing page says that if your site exceeds the usage quotas, it will not be able to serve your site. Standard bills extra bandwidth at $0.20 per GB instead.

### How many custom domains does Azure Static Web Apps allow?

2 per app on Free. Standard is 5 per app on the pricing page and in the plans doc, and 6 in the quotas doc.

### Is the Azure Static Web Apps Dedicated plan still available?

No. Microsoft's docs say the Dedicated plan was retired on 31 October 2025. Free and Standard remain.

### Do Azure Static Web Apps APIs cost extra?

APIs built with Azure Functions are billed at Functions Consumption plan rates, and Microsoft says Functions includes 1 million free executions. On Standard you can also bring your own Functions app, billed at its own rates.
