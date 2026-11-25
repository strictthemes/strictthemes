---
title: "Gatus vs Uptime Kuma vs hosted monitoring in 2026"
description: Gatus and Uptime Kuma are two popular self-hosted uptime monitors. How they differ, where to run them so they can see an outage, and when a hosted monitor costs less than the server.
kind: Roundup
date: 2026-11-25
checked: 2026-11-25
---

Gatus and Uptime Kuma are free, open-source uptime monitors that you run yourself. Both check your sites and services on a schedule, show a status page, and alert you when something fails. They suit different people. Gatus is configured in a YAML file and fits a repo or a Kubernetes cluster. Uptime Kuma is configured in a web dashboard and fits anyone who would rather click than write config.

This guide compares the two, explains the one mistake that makes a self-hosted monitor useless, and shows when a hosted monitor is the simpler choice. We read both projects' GitHub pages and every hosted price on the vendor's own page on 25 November 2026.

## TL;DR

- **Choose Gatus** if you want monitoring as code. One YAML file, conditions on status, body, response time and certificate expiry, and a small Go binary. Apache-2.0 license.
- **Choose Uptime Kuma** if you want a dashboard. You add monitors in the browser, pick from 90+ notification services, and run several status pages. MIT license.
- **Don't run either on the server it watches.** If that server goes down, the monitor goes down with it and sends nothing. Run it on a separate machine, ideally with another provider.
- **Consider a hosted monitor** if you don't want a second server to look after. Pulsetic has a free plan for 10 monitors and paid plans from $9 a month, with checks from several regions. HetrixTools has the stronger free plan: 15 monitors checked every minute.
- **Want Gatus without running it?** The Gatus README links to a managed version, Gatus.io, from $10 a month.

## Gatus vs Uptime Kuma at a glance

| | Gatus | Uptime Kuma |
| --- | --- | --- |
| Configured in | A YAML file | A web dashboard |
| License | Apache-2.0 | MIT |
| Latest stable release we read | v5.38.0, 28 October 2026 | 2.5.12, 17 November 2026 |
| GitHub stars, 25 November 2026 | 12.9k | 94.9k |
| Check types | HTTP, ICMP, TCP, UDP, SCTP, DNS, SSH, TLS, STARTTLS, WebSocket, gRPC | HTTP(s), keyword, JSON query, TCP, ping, DNS record, push, WebSocket, Docker containers, Steam game servers |
| Shortest interval | Set per endpoint, 60 seconds by default | 20 seconds |
| Certificate expiry | A condition you set, such as more than 48 hours | Certificate info shown per monitor |
| Alerts | Slack, Discord, PagerDuty, Telegram, Teams, email and many more | Telegram, Discord, Slack, email and 90+ more |
| Status page | One dashboard, with announcements | Multiple status pages, each on its own domain |
| Storage | Memory by default, or SQLite or PostgreSQL | Its own data folder, such as a Docker volume |
| Install | One Docker container | Docker, or Node.js with PM2 |
| Managed version | Gatus.io, from $10 a month | None listed in the README |

## The rule that matters most: monitor from somewhere else

A monitor can only report an outage if it is still running. If Gatus or Uptime Kuma runs on the same server as your site, a crash, a full disk or a network failure takes out both. You get no alert, and the status page goes down with the site.

So run the monitor on a separate machine, ideally at a different provider or in a different region. A small virtual server is enough. On DigitalOcean's pricing page, the smallest Basic Droplet is $4 a month for 512 MiB of memory and 1 vCPU, and the 1 GiB one is $6 a month. You also take on its updates, backups and security.

Then ask who watches the monitor. If its server fails, you lose your alerts and may not notice. A simple fix is one free hosted check that watches the monitor itself.

## Gatus: monitoring as code

[Gatus](https://github.com/TwiN/gatus) calls itself a developer-oriented health dashboard. You list endpoints in a YAML file, and each one has conditions that must all be true. A check can look at the status code, the response body, the response time, the IP address, and the number of hours left on the TLS certificate or the domain.

![The Gatus README on GitHub, describing a developer-oriented health dashboard that monitors services with HTTP, ICMP, TCP and DNS queries.](/guides/gatus-vs-uptime-kuma/gatus.jpg "The Gatus README on GitHub, 25 November 2026")

A minimal endpoint, in the pattern of the Gatus README:

```yaml
endpoints:
  - name: website
    url: "https://example.com/"
    interval: 60s
    conditions:
      - "[STATUS] == 200"
      - "[RESPONSE_TIME] < 500"
      - "[CERTIFICATE_EXPIRATION] > 48h"
```

**Install:** one container, `docker run -p 8080:8080 --name gatus ghcr.io/twin/gatus:stable`, with your config file mounted. It reads `config/config.yaml` by default.

**Good to know:**
- Storage is in memory by default, so history is lost on restart. Set `storage.type` to `sqlite` or `postgres` to keep it.
- Conditions make it useful beyond uptime. Its README suggests using it for automated user acceptance tests.
- It can also check SSH, gRPC, WebSocket and domain expiry.
- The config lives in Git, so every change is reviewed like code.

**Pricing:** free and open source, under Apache-2.0. You pay for the server it runs on.

**Limitations:** monitors are defined in the config file, so every change means editing YAML.

**Good for:** developers and platform teams who keep infrastructure in Git or run Kubernetes. The README's author runs it in a Kubernetes cluster to watch their own applications.

### Gatus.io: the managed version

The Gatus README links to [Gatus.io](https://gatus.io/pricing), a managed version. Standard is $10 a month for 1 status page, 30 endpoints and checks every 2 minutes. Premium is $20, Business $50 and Enterprise $500 a month. Business brings the interval down to 30 seconds. Yearly billing takes 20% off, and every plan has a 7-day trial.

![The Gatus.io pricing page, with Standard at $10, Premium at $20, Business at $50 and Enterprise at $500 a month.](/guides/gatus-vs-uptime-kuma/gatus-io.jpg "Gatus.io pricing, 25 November 2026")

## Uptime Kuma: monitoring in a dashboard

[Uptime Kuma](https://github.com/louislam/uptime-kuma) describes itself as "an easy-to-use self-hosted monitoring tool". Its README says the project started from a search for a self-hosted tool like UptimeRobot. You add each monitor in the browser, set its interval and choose who gets notified.

![The Uptime Kuma repository on GitHub, with 94.9k stars and the description A fancy self-hosted monitoring tool.](/guides/gatus-vs-uptime-kuma/uptime-kuma.jpg "Uptime Kuma on GitHub, 25 November 2026")

**What it checks:** HTTP(s), HTTP keywords and JSON queries, TCP, ping, DNS records, WebSockets, Docker containers, Steam game servers, and push monitors that wait for a heartbeat from a cron job. Intervals go down to 20 seconds.

**Install:** Docker Compose or a single `docker run` command, with the dashboard on port 3001. Without Docker it needs Node.js 20.4 or later and PM2. The README warns that NFS file systems are not supported for its data, and that `uptimekuma.co` is not the official site.

**Good to know:**
- 90+ notification services, including Telegram, Discord, Slack and email.
- Multiple status pages, each mapped to its own domain.
- Two-factor sign-in and proxy support.
- A 3.0 beta is out. The latest stable release is 2.5.12, from 17 November 2026.

**Pricing:** free and open source, under the MIT license. You pay for the server.

**Limitations:** monitors are set up in the dashboard and kept in its data folder, not in a file you review in Git, so back up that folder. The README points to no hosted version.

**Good for:** small teams, agencies and homelab users who want a full dashboard and status pages without writing config.

## Hosted monitoring: when you'd rather not run a server

A hosted monitor checks from the provider's servers, usually in several regions, so a failure in your own infrastructure can't silence it. You pay a monthly fee instead of running and patching a second server.

### Pulsetic: best hosted all-in-one

[Pulsetic](https://pulsetic.com/) checks uptime, SSL, keywords, ports and cron jobs, and includes status pages and real user monitoring. When a check fails, it confirms the failure from other regions before it alerts you.

![The Pulsetic home page, headed Uptime monitoring and alerts. The call is yours.](/guides/gatus-vs-uptime-kuma/pulsetic.jpg "Pulsetic, 25 November 2026")

**Pricing:** the free plan has 10 monitors checked every 5 minutes from 3 regions, with 3 status pages. Solo is $9 a month for 10 monitors every 60 seconds from 5 regions. Team is $19 and Organization $49 a month, both with 30-second checks from 15 regions. Paid plans include unlimited status pages. Extra monitors cost $0.20 each a month, and yearly billing saves 2 months.

**Limitations:** the free plan checks every 5 minutes. Solo includes no teammates. You can't write custom conditions the way Gatus does.

**Good for:** people who want uptime checks, cron monitoring and a status page on their own domain, without a server to run.

### HetrixTools: best free hosted plan

[HetrixTools](https://hetrixtools.com/pricing/uptime-monitor/) checks every monitor every minute on every plan, including free. Status pages, maintenance windows and server monitoring agents come with every plan.

![The HetrixTools pricing page, under the heading Plans differ in how much you monitor, not in how well.](/guides/gatus-vs-uptime-kuma/hetrixtools.jpg "HetrixTools uptime monitor pricing, 25 November 2026")

**Pricing:** free for 15 uptime monitors from 4 of its 12 locations. Professional is $9.95 a month for 30 monitors, Business $19.95 for 60, and Enterprise $49.95 a month or $499.95 a year for 200.

**Limitations:** on the free plan you must log in every 90 days to keep the account.

**Good for:** watching a few sites, or your self-hosted monitor, every minute for free.

## Which should you choose?

- **Your infrastructure lives in Git or Kubernetes:** Gatus. Monitoring is reviewed and deployed like any other config.
- **You want a dashboard and several status pages:** Uptime Kuma.
- **You like Gatus but don't want to host it:** Gatus.io, from $10 a month.
- **You don't want to run a second server:** a hosted monitor. Pulsetic if you also want cron checks and status pages, from free to $9 a month. HetrixTools if one-minute checks on a free plan matter most.
- **You self-host anyway:** run the monitor away from the servers it watches, and add one free hosted check on the monitor itself.

## FAQ

### Is Gatus better than Uptime Kuma?

Neither is better overall. Gatus is configured in YAML and is stronger at custom conditions, such as checking a JSON field or certificate expiry. Uptime Kuma is configured in a dashboard, supports 90+ notification services and runs several status pages. Choose by how you want to work.

### Can I run Uptime Kuma on the same server as my website?

You can, but it won't alert you when that server goes down, because it goes down too. Run it on a separate server, ideally with another provider.

### Is Uptime Kuma free?

Yes. It is open source under the MIT license, and the README lists no paid version. You pay only for the server it runs on. A small DigitalOcean Droplet is $4 to $6 a month.

### Does Gatus have a hosted version?

Yes. The Gatus README links to Gatus.io, a managed version, from $10 a month for 1 status page and 30 endpoints, with a 7-day trial.

### What is the cheapest way to monitor a few websites?

A free hosted plan. HetrixTools monitors 15 sites every minute for free, and Pulsetic's free plan covers 10 monitors every 5 minutes. Self-hosting is free as software, but you still pay for a separate server to run it on.
