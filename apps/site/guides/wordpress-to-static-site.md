---
title: "How to turn a WordPress site into a static site in 2026: plugins, costs and hosting"
description: How to turn a WordPress site into static HTML in 2026. Simply Static and Staatic compared with their prices, what stops working once the site is static, and where to host the files.
kind: Roundup
date: 2026-11-20
checked: 2026-11-20
---

A WordPress site runs PHP and a database on every visit. A static site is a folder of finished HTML, CSS, JavaScript and images that any host can serve. To convert one into the other, you use a plugin that crawls your site and saves each page as a file. Then you upload the files to a static host.

This guide covers the two plugins that do the crawling, Simply Static and Staatic, with the prices on their own pages. It then shows what stops working on a static site, and where to host the result. We read every price below on 20 November 2026. We did not run a conversion for this guide, so we describe what the vendors publish.

## TL;DR

- **Both main plugins have a free version.** Simply Static's free version exports a ZIP file or a local directory. Staatic's Community edition can also deploy to S3, GitHub, Netlify or SFTP.
- **Automatic deploys cost money on Simply Static.** Its Pro plugin is $99 a year per site and adds deploys to GitHub, Netlify, Cloudflare Pages, S3, BunnyCDN and SFTP.
- **Dynamic features stop working.** Simply Static says its approach is not suitable for e-commerce, membership sites, user logins or real-time data. Forms, search and comments need a replacement.
- **A ZIP is enough to publish.** Static.app takes the exported ZIP and serves it from $6 a month, or $60 a year, with forms built in. Cloudflare Pages and GitHub Pages are free options.
- **Keep WordPress.** Both plugins keep WordPress as your editor. You publish a static copy and leave the WordPress site private.

## What changes when a site is static

| Feature | On WordPress | On a static site |
| --- | --- | --- |
| Pages and posts | Built on each visit | Saved as files when you publish |
| Contact forms | Handled by a plugin and PHP | Need a form service or a paid plugin integration |
| Site search | Database search | Needs a static search such as Fuse.js or Algolia |
| Comments | Stored in your database | Need an integration |
| Logins and shops | Work | Do not work as static files |
| Editing | In WordPress | Still in WordPress, then you publish again |

Simply Static lists what its free version does: one-click generation, ZIP export, deploy to a local directory, URL replacement, and compatibility with any theme and the common page builders and SEO plugins. Its Pro version adds forms integration for Contact Form 7, Gravity Forms, WPForms and Fluent Forms, static-friendly search with Fuse.js or Algolia, and comments integration. Its plugin page says static export is not suitable for e-commerce, membership sites, sites that need user logins, or real-time data updates.

## WordPress static export plugins at a glance

| Plugin | Price | Export options | Forms and search |
| --- | --- | --- | --- |
| Simply Static (free) | $0 | ZIP file, local directory | Not included |
| Simply Static Pro | $99 a year per site | GitHub, Netlify, Cloudflare Pages, AWS S3, BunnyCDN, SFTP | Forms and search integrations |
| Simply Static Studio | $12 a month per site | Managed WordPress and static hosting | Included with Pro features |
| Staatic Community | Free | Local directory, S3, GitHub, Netlify, SFTP, ZIP | Not included |
| Staatic Premium | Not shown on its plugin page | Adds scheduled and change-based publishing | Forms and search integrations |

## Plugins that export WordPress to static files

### 1. Simply Static: best for a one-off export or a managed setup

[Simply Static](https://wordpress.org/plugins/simply-static/) turns a WordPress site into static HTML, CSS and JavaScript. You generate the site with a button, export it as a ZIP, and upload it to any host. Your WordPress site stays private.

![Simply Static's page in the WordPress plugin directory, headed Simply Static, The Static Site Generator.](/guides/wordpress-to-static-site/simply-static.jpg "Simply Static in the WordPress plugin directory, 20 November 2026")

The free version exports a ZIP or a local directory, replaces URLs, and works with any theme. Pro is $99 a year per site and adds deploys to GitHub, Netlify, Cloudflare Pages, AWS S3, BunnyCDN and SFTP, incremental exports that update only changed pages, WP-CLI support and email support. Studio is $12 a month per site for managed WordPress and static hosting on a CDN, with 2 GB of storage and 250 GB of bandwidth, a 14-day free trial, and free migration.

![Simply Static's pricing page, with the Studio plan at 12 dollars a month for one site.](/guides/wordpress-to-static-site/simply-static-pricing.jpg "Simply Static's pricing page, Studio tab, 20 November 2026")

What it does not do: the free version leaves the upload to you, and anything that needs a server stays broken. Simply Static says forms, search and comments need its Pro version.

**Good for:** a blog, marketing site or portfolio that you update now and then.

### 2. Staatic: best for free deploys to S3, GitHub or Netlify

[Staatic](https://wordpress.org/plugins/staatic/) crawls your WordPress site and publishes a static copy from the WordPress admin. You keep editing posts, pages and menus in WordPress.

![Staatic's page in the WordPress plugin directory, headed Staatic, Static Site Generator for WordPress.](/guides/wordpress-to-static-site/staatic.jpg "Staatic in the WordPress plugin directory, 20 November 2026")

The Community edition deploys to a local directory, Amazon S3 or S3-compatible storage, GitHub, Netlify, SFTP or a ZIP archive. It supports redirects, custom 404 pages, exclude rules and HTTP headers, and includes a WP-CLI command. Staatic Premium and Staatic Cloud add forms integration, search integration, scheduled publications and managed hosting. The plugin page does not show their prices.

What it does not do: forms and search are in the paid editions. Staatic lists a ZIP archive among its deploy targets, so the Community edition can also produce a file for a drag-and-drop host.

**Good for:** developers who want automatic deploys without paying for a plugin.

### Older tools

Some tutorials still name the Static HTML Output plugin. Its WordPress.org page says it was permanently closed on 10 August 2020 and is not available for download. Pick one of the two above.

## Steps to move a WordPress site to a static host

1. **List what the site does.** Note every form, search box, comment section, login and shop. Those need a replacement or a different approach.
2. **Install the plugin** on a copy of the site, or on the live site if you prefer.
3. **Generate the static version.** In Simply Static, use the free export to a ZIP file. In Staatic, publish and download the ZIP archive, or deploy directly.
4. **Replace the forms.** A host's form service works. Static.app collects entries when you add its `static-form` attribute to an existing form.
5. **Upload the files** to a static host and test the pages.
6. **Point your domain** at the host, then check the live site against the WordPress one.

[Put a page online, then check the live address](/guides/publish-and-check-live-page/) shows how to compare the live page with your design.

## Where to host the exported files

| Host | Price | Custom domain | Metered | Git needed |
| --- | --- | --- | --- | --- |
| Static.app | From $6 a month, or $60 a year | Yes | No, unlimited traffic | No |
| Cloudflare Pages | Free plan | Yes | No bandwidth limit listed | No, direct upload works |
| GitHub Pages | Free with public repositories | Yes | Soft limit of 100 GB a month | Yes |

### Static.app

[Static.app](https://static.app/) hosts static sites at a flat monthly price. You upload a ZIP, a folder, images or documents, and the site is live with SSL, so the file Simply Static or Staatic exports can go straight in. Starter is $6 a month, or $60 a year, for 2 sites and 500 MB of storage. Medium is $12 a month for 7 sites and 3 GB. Large is $18 a month for 30 sites and 10 GB. Every paid plan lists unlimited traffic, a custom domain, forms and analytics.

![Static.app's pricing page, with a 7-day free trial, and the Starter plan at $5 a month when billed yearly.](/guides/wordpress-to-static-site/static-app.jpg "Static.app's pricing page, shown with yearly billing, 20 November 2026")

What it does not do: it runs no PHP, so nothing dynamic from WordPress will work there. There is no free plan, only a 7-day trial with 1 website and 50 MB. It does not build from Git, so you upload the exported files each time you publish. Until 1 December, its [Black Friday sale](/guides/black-friday-2026-deals/) takes 35% off the first payment.

**Good for:** a brochure site or blog moved off WordPress hosting, where you want forms and a custom domain on one flat bill.

### Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com/) has a free plan with 500 builds a month, 20,000 files per site and 25 MiB per file. Its docs say requests for static files are free and unlimited. A large WordPress export can hit the 20,000-file limit, so count your files first.

![The Cloudflare Pages home page, headed Build and deploy full-stack applications instantly.](/guides/wordpress-to-static-site/cloudflare-pages.jpg "Cloudflare Pages, 18 November 2026")

**Good for:** developers who want free hosting and are at home in Cloudflare's dashboard. See [Cloudflare Pages and Workers pricing in 2026](/guides/cloudflare-pages-pricing/).

### GitHub Pages

[GitHub Pages](https://pages.github.com/) serves a site from a GitHub repository, free for public repositories, with a soft limit of 100 GB of bandwidth a month. GitHub says it is not for sites mainly for commercial transactions or software as a service.

![The GitHub Pages documentation home page.](/guides/wordpress-to-static-site/github-pages.jpg "GitHub Pages documentation, 18 November 2026")

**Good for:** personal sites and project pages, deployed from a repository by Simply Static Pro or Staatic.

## Which route should you choose?

- **A site you update a few times a year:** Simply Static free, export a ZIP, and upload it to Static.app or Cloudflare Pages.
- **You want publishing to deploy on its own:** Staatic Community to GitHub, Netlify or S3, or Simply Static Pro at $99 a year.
- **You want one vendor for hosting and the plugin:** Simply Static Studio at $12 a month per site.
- **You need forms, search or comments:** a paid plugin integration, or a static host's form service.
- **You run a shop, a membership site or logins:** do not go static. Keep WordPress, or use a different tool.

## FAQ

### Can I turn a WordPress site into a static site for free?

Yes. Simply Static's free version exports a ZIP file or a local directory, and Staatic's Community edition deploys to S3, GitHub, Netlify, SFTP or a ZIP archive. Hosting can also be free on Cloudflare Pages or GitHub Pages.

### What stops working on a static WordPress site?

Anything that needs PHP or a database at the time of the visit: contact forms, search, comments, logins and shops. Simply Static says static export is not suitable for e-commerce, membership sites or sites with user logins.

### Do I still need WordPress after converting?

Yes, as your editor. Both plugins keep WordPress as the place where you edit, then publish a static copy. WordPress can stay private.

### How much does Simply Static cost?

The free version costs nothing. Pro is $99 a year per site, and Studio, which includes hosting, is $12 a month per site.

### Can I host a static WordPress site on Static.app?

Yes, if the export is a ZIP or a folder of files. Static.app serves static files only, so forms must use its form feature or another service. Starter is $6 a month, or $60 a year.

### How do I keep a static site up to date?

Edit in WordPress, then export again. Simply Static Pro and Staatic Premium list incremental or change-based publishing, so only changed pages are rebuilt. With the free exports you generate and upload the files each time.
