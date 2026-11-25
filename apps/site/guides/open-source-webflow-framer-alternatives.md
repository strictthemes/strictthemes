---
title: "Open-source Webflow and Framer alternatives in 2026"
description: Five open-source visual builders compared with Webflow and Framer. Webstudio, Silex, GrapesJS, Onlook and Puck, with their licenses, what each is for, and what self-hosting takes.
kind: Roundup
date: 2026-11-25
checked: 2026-11-25
---

Webflow and Framer are closed platforms. Your site lives on their servers, in their format, at their price. An open-source builder lets you read the code, run it yourself, and keep your site if the company changes course. The catch is that "open-source Webflow alternative" covers very different things: a finished builder you can use today, a framework you build an editor with, or a code editor for designers.

This guide sorts five real projects by what they are. We read each project's GitHub page and license on 25 November 2026. Star counts are from that day.

![The Webstudio pricing page, with a choice between Cloud, where Webstudio hosts, and Self-host, where you host.](/guides/open-source-webflow-framer-alternatives/webstudio.jpg "Webstudio's pricing page, with cloud and self-host options, 25 November 2026")

## TL;DR

- **Closest to Webflow:** Webstudio. AGPL-3.0, a full visual builder with all CSS properties, use its cloud or host it yourself.
- **Free, community-run, static output:** Silex. AGPL-3.0, exports plain HTML and CSS, no premium tier.
- **A framework to build your own editor:** GrapesJS. A BSD-style license, used inside other products, Silex among them.
- **For designers editing real code:** Onlook. Apache-2.0, a desktop editor on top of a React app.
- **A visual editor inside your React app:** Puck. MIT, you bring your own components.
- **Not open source, but you can take your files:** Siter.io's Pro plan downloads your site as HTML.

## At a glance

| Project | License | What it is | Hosted option | Self-host | GitHub stars, 25 Nov 2026 |
| --- | --- | --- | --- | --- | --- |
| Webstudio | AGPL-3.0 | Visual website builder | Free, Pro $15 a month billed yearly | Yes | 9.2k |
| Silex | AGPL-3.0 | Visual builder for static sites | Free online editor | Yes, Docker or Node.js | 3.0k |
| GrapesJS | BSD-style | Framework for web builders | Grapes Studio, free or $8.33 a month billed yearly | You build the app | 26.4k |
| Onlook | Apache-2.0 | Desktop editor for code | No, it runs locally | Runs on your machine | 27.9k |
| Puck | MIT | React visual editor library | Puck Cloud | You embed it | 13.8k |

## What "open source" changes, and what it doesn't

- **You can leave.** The code and, with the static exporters, your site's files are yours.
- **You run it, or pay someone to.** Self-hosting means a server, updates and backups. The hosted versions of these tools are paid plans like any other.
- **AGPL has conditions.** If you change Webstudio or Silex and offer the changed version to others over a network, the AGPL asks you to share that source. Using them to build your own sites is a different case. Read the license before you build a product on top.

## Finished builders you can use today

### 1. Webstudio: closest to Webflow

[Webstudio](https://webstudio.is/) is a visual builder for developers, designers and teams. Its GitHub page describes it as an open-source Webflow alternative that supports all CSS properties, connects to any headless CMS, and can be hosted anywhere. Its README says you can use the hosted version or run your own.

**Pricing:** the cloud plan is free with a wstd.io subdomain, unlimited projects and pages, and project export. Pro is $15 a month billed yearly, with custom domains on unlimited sites and 100,000 page views a month. Extra page views are $20 per 100,000. Team is $35 a month billed yearly with 5 seats. Self-hosting is free.

**License:** the core is AGPL-3.0-or-later. One optional animation package is proprietary, under its own license.

**Limitations:** structured content such as a blog comes from a CMS you connect, and connecting one is a Pro feature on the cloud. Self-hosting means running and updating the server yourself.

**Good for:** Webflow users who want the same CSS-level control and the option to host it themselves.

### 2. Silex: free, community-run, static output

[Silex](https://github.com/silexlabs/Silex) is a free visual builder for static sites, run by Silex Labs, a non-profit. It exports standard HTML and CSS that you can host anywhere. It is built on GrapesJS.

![Silex's GitHub README, headed Silex, the visual builder for static sites, under the AGPL-3.0 license.](/guides/open-source-webflow-framer-alternatives/silex.jpg "Silex on GitHub, 25 November 2026")

**Pricing:** free. The README says all features are included, with no premium tier. The online editor is free and stores your work in a GitLab account. A desktop app, in alpha, works offline without an account.

**License:** AGPL-3.0.

**Features:** drag-and-drop editing with HTML, CSS and JavaScript editors, CMS data from WordPress, Strapi, Squidex or any GraphQL API, compatibility with the 11ty static site generator, SEO settings, and self-hosting with Docker or Node.js.

**Limitations:** the desktop app is in alpha. The online editor needs a GitLab account to store your work.

**Good for:** web designers and agencies who want static sites, standard files and no subscription.

## Building blocks for developers

### 3. GrapesJS: a framework for web builders

[GrapesJS](https://github.com/GrapesJS/grapesjs) is a web builder framework. You use it to build a drag-and-drop editor into your own product, for web pages or newsletters. Silex is one of the tools built on it.

![The GrapesJS GitHub README, describing a free and open-source web builder framework, with a diagram of where it sits between a CMS and a front end.](/guides/open-source-webflow-framer-alternatives/grapesjs.jpg "GrapesJS on GitHub, 25 November 2026")

**Pricing:** the framework is free. Its team also runs Grapes Studio, a hosted builder: Starter is free with HTML and CSS export, and Pro is $8.33 a month billed yearly, or $10 monthly, with custom domains and no branding.

**License:** a BSD-style license in the repository. GitHub doesn't detect a standard license name for it, so read the file.

**Limitations:** on its own it is not a website builder you sign up to. You need a developer to set it up, store pages and publish them.

**Good for:** product teams adding a page or email editor to their own app.

### 4. Puck: a visual editor inside your React app

[Puck](https://github.com/puckeditor/puck) is a visual editor for React. You embed it as a React component and give it your own components, and editors drag them onto a page.

![Puck's GitHub README, describing an open-source visual editor for React that you embed in your own app.](/guides/open-source-webflow-framer-alternatives/puck.jpg "Puck on GitHub, 25 November 2026")

**Pricing:** the library is free. Its README also introduces Puck Cloud, a hosted service.

**License:** MIT, which allows internal and commercial use.

**Limitations:** it is a library, not a site builder. You need a React app and a developer to wire up saving and publishing.

**Good for:** teams with a React site who want marketers to build pages from the team's own components.

### 5. Onlook: a design tool on top of real code

[Onlook](https://github.com/onlook-dev/onlook) is a free, local-first desktop editor. You open a React app, see it running on a canvas, and change it visually, while the changes go into the code.

![Onlook's GitHub README, describing a free, local-first editor and an open-source, visual-first canvas for code.](/guides/open-source-webflow-framer-alternatives/onlook.jpg "Onlook on GitHub, 25 November 2026")

**Pricing:** free.

**License:** Apache-2.0.

**Limitations:** it edits an app's code, so you need a code project, and a developer to set it up and deploy it. It doesn't host sites.

**Good for:** designers on product teams who want to edit the real front end instead of handing over mockups.

## Not open source, but you can take your files

If what you want from open source is the ability to leave, a hosted builder with an export can cover it.

[Siter.io](https://siter.io/) is a closed, hosted visual editor with a free-form canvas and a Figma plugin. Its Pro plan, at $24 a month billed yearly or $28 monthly, includes Download HTML, so you can take the site's files and host them anywhere. Solo and Plus don't include the download.

## Which should you choose?

- **You want Webflow-style control without lock-in:** Webstudio. Start on its free cloud plan, and self-host later if you need to.
- **You want static files and no subscription:** Silex.
- **You are adding a page editor to your own product:** GrapesJS, or Puck if your product is a React app.
- **You are a designer on a team with a React codebase:** Onlook.
- **You don't need the source, only a way out:** a hosted builder with an HTML export, such as Siter.io on Pro.

Once you have static files, hosting them is cheap or free. [Hostinger renewal prices against flat static hosting](/guides/hostinger-renewal-prices/) compares the options. For leaving Framer specifically, see [how to leave Framer](/guides/leave-framer/).

## FAQ

### Is there an open-source version of Webflow?

There is no open-source Webflow. The closest open-source project is Webstudio, which its GitHub page calls an open-source Webflow alternative. Silex is another visual builder, aimed at static sites.

### Is there an open-source alternative to Framer?

No open-source tool copies Framer's animation features closely. Webstudio and Silex are visual builders for sites. Onlook is a canvas for designers working on React code.

### Can I self-host Webstudio?

Yes. Its README says you can use the hosted version or run your own. Self-hosting is free. You run and update the server.

### Which of these is free?

All five are free to use as open-source software. Silex has no paid tier at all. Webstudio and GrapesJS also sell hosted plans, and Puck has Puck Cloud.

### What license do these projects use?

Webstudio and Silex use AGPL-3.0. Onlook uses Apache-2.0, Puck uses MIT, and GrapesJS uses a BSD-style license.
