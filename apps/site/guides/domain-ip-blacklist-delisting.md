---
title: "Domain or IP blacklisted? How to find which lists and get delisted (Spamhaus, Microsoft, others)"
description: How to find which blacklists your domain or IP is on, judge which listings matter, fix the cause, use the official Spamhaus and Microsoft delisting routes, and monitor so it doesn't happen again.
kind: How to
date: 2026-11-24
checked: 2026-11-24
---

If your domain or IP got blacklisted, here is how to find out where and get removed. Look up your sending IP and your domain on public blacklists. Read your bounce messages to see which listings are actually blocking mail. Fix whatever caused the listing. Only then file a removal request through each list's official page. After that, set up monitoring so you hear about the next listing before your recipients do.

[Unspam](https://unspam.email/) covers most of that work in one place. Its free [blacklist checker](https://unspam.email/blacklist-checker) looks up an IP, a domain or an email address in one step. Its spam test and inbox placement test show whether a listing is actually costing you the inbox, and scheduled monitoring re-runs those checks daily or weekly and alerts you when something changes. This guide walks through every step, including the parts no tool can do for you. We read the Microsoft, Google, Unspam and monitoring tool pages linked below on 24 November 2026. The Spamhaus steps describe its published removal process; check the lookup result for your own listing.

## Short answer: check, fix, request removal, monitor

1. **Check.** Run a blacklist lookup on the IP that sends your mail and on your sending domain. Domain lists and IP lists are separate, so check both.
2. **Judge.** Find out which listings matter. A Spamhaus listing, or a bounce that names a list, is urgent. A single hit on a minor regional list often isn't.
3. **Fix the cause.** A hacked account, a bought list, spam traps or a sudden volume spike gets you listed. Fix that first.
4. **Request removal.** Use each list's own lookup and removal page. Some listings expire on their own once the problem stops.
5. **Monitor.** Schedule checks so a new listing reaches you within a day, not after a campaign fails.

Don't skip step 3. As Unspam's blacklist checker puts it: "a removal request filed while the problem is still live is usually rejected, or the listing comes back within hours." Delisting without a fix almost always leads to relisting, and some lists take longer to clear you each time you come back.

## Why domains and IPs get blacklisted

A blacklist, also called a DNS blacklist (DNSBL) or RBL, is a published list that receiving mail servers query in real time while they decide what to do with a message. If your IP or domain is on a list the receiver trusts, it can defer the message, send it to junk or reject it outright.

Listings almost always come from one of these:

- **A compromised account or server.** A stolen mailbox password, a hacked website form or a malware-infected machine starts sending spam from your IP or domain.
- **Spam traps.** These are addresses that never sign up for anything. Sending to them proves the list wasn't collected with consent. They usually arrive through purchased or scraped lists, or very old lists full of abandoned addresses.
- **High complaint rates.** Too many recipients mark your mail as spam.
- **A volume spike** from a new or cold IP or domain.
- **Shared infrastructure.** Someone else on your shared IP, subnet or hosting network misbehaves and the listing covers you too.
- **Your domain appearing in spam.** Domain lists track the domains that show up inside messages, including links. Spammers linking to your site, or a hacked page on your site, can get your domain listed even when your own mail is clean.

## Step 1: Find which blacklists you're on

### Check your sending IP and your domain separately

First, find your real sending IP. Open the headers of a message you sent ("Show original" in Gmail) and look at the first `Received:` line added by your sending server.

- **On Google Workspace, Microsoft 365 or an email service provider (ESP):** the IP belongs to the provider and is shared with other senders. Your domain is what you control.
- **On your own server or a dedicated IP:** check both the IP and the domain.

Then run the lookups:

- **Unspam blacklist checker.** Enter an IPv4 address, a domain or an email address, and [its checker](https://unspam.email/blacklist-checker) works out which one it is.
  - **IPs** are checked against more than 20 public email blacklists, grouped by importance. These include SpamCop, Barracuda, UCEPROTECT Levels 1 to 3, PSBL, Mailspike and DroneBL.
  - **Domains** (including the domain of an email address) are checked against public domain blacklists such as SURBL.
  - **Reverse DNS** is checked for an IP at the same time. A PTR record that resolves back to the same IP is expected by Gmail, Yahoo and Microsoft.
  - It's free, needs no signup, and links each listed row to that list's lookup or removal page.
- **Spamhaus, directly.** Spamhaus blocks lookups sent through public DNS resolvers such as Google's and Cloudflare's, so no browser-based checker can give a trustworthy Spamhaus result. Unspam's checker links to it instead of showing a misleading row. Check your IP and domain at [check.spamhaus.org](https://check.spamhaus.org/). URIBL does the same for domains, so check it directly at [uribl.com](https://uribl.com/).
- **Other free lookups.** Many people start with MxToolbox's blacklist check, which tests an IP against more than 100 DNS-based blacklists. [MultiRBL](https://multirbl.valli.org/) is another free multi-list lookup that also runs a forward-confirmed reverse DNS check.

Counts differ between tools because each one picks which lists to query. More lists doesn't mean better results: many small lists are rarely used by major mailbox providers.

![Unspam's free blacklist checker, with one field for an IP, a domain or an email address.](/guides/domain-ip-blacklist-delisting/unspam-blacklist-checker.jpg "Unspam's blacklist checker, 24 November 2026")

### Domain lists vs. IP lists

| | IP blacklist | Domain blacklist |
| --- | --- | --- |
| What it judges | The server that sent the message | Domains inside the message: the sender domain and the links |
| Examples | SpamCop, Barracuda, UCEPROTECT, Spamhaus ZEN | SURBL, URIBL, Spamhaus DBL |
| Common cause | Compromised server or account, spam traps, volume spikes, shared IP | Your domain linked from spam, a hacked page on your site, a link shortener or tracking domain shared with spammers |
| Who can fix it | You, if the IP is yours. Your ESP or host, if it is shared | You, by finding where the domain is being abused |

A clean IP does not protect a listed domain, and the reverse is also true. If your IP is clean but your domain is listed, look at what links to your domain and what your website is serving.

## Step 2: Decide which listings actually matter

Not every listing hurts delivery. Major mailbox providers use a handful of large, well-run lists and their own internal reputation data. They don't use every small list a lookup tool can query.

### Major lists vs. minor lists

| Listing | How much it matters | What to do |
| --- | --- | --- |
| Spamhaus (SBL, XBL, CSS, DBL, and ZEN, which combines its IP lists) | High: widely used by receivers | Treat as urgent. Fix, then use Spamhaus's own lookup and removal process |
| Spamhaus PBL | Usually not a spam listing: it marks IP ranges that shouldn't send mail directly to inboxes, such as home connections | Send through your provider's mail server. If the IP really is a static mail server, the owner can request removal through Spamhaus |
| Barracuda, SpamCop | Medium to high: used by many corporate filters | Fix the cause. SpamCop expires on its own; Barracuda needs a removal request |
| UCEPROTECT Level 1 | Medium: lists your specific IP | Fix the cause. It auto-expires once the IP has been clean for seven days |
| UCEPROTECT Level 2 or 3 | Usually low: lists your subnet or whole network because of other senders | Raise it with your host or ESP, who owns the range |
| Small regional or single-operator lists | Usually low | Check your bounces first. Act if a receiver you care about cites it |
| Microsoft's own blocked senders list | High for Outlook, Hotmail and Microsoft 365 recipients | Microsoft's delist routes, covered in Step 4 |

### Signs of real impact: bounces with block codes

The most reliable sign is a bounce, or non-delivery report (NDR), that names the block. Look for:

- **A list's name or URL in the bounce text.** Many receivers include a Spamhaus or Barracuda lookup link in the rejection.
- **Microsoft 365:** `550 5.7.606-649 Access denied, banned sending IP [your IP]`, which points to [sender.office.com](https://sender.office.com/).
- **Microsoft 365:** `550 5.7.511`, a block the delist portal can't clear. It has its own process, covered in Step 4.
- **Outlook.com, for domains sending more than 5,000 emails a day:** `550 5.7.515 Access denied, sending domain ... does not meet the required authentication level`. This is an authentication failure, not a blacklist. Fix SPF, DKIM and DMARC.
- **A sudden drop in opens at one provider,** with no bounces. That points to junk-folder placement rather than outright rejection.

Unspam's inbox placement test confirms the impact. It sends your real message to seed inboxes at Gmail, Outlook, Yahoo, Zoho, ProtonMail, AOL, GMX and business mailboxes, and reports whether each copy landed in the Inbox, Promotions, Spam or went Missing. Missing is what an outright block looks like.

## Step 3: Fix the root cause

Match the cause to the fix before you go near a removal form.

| Cause | How you spot it | Fix |
| --- | --- | --- |
| Compromised account or server | Mail you didn't send in your logs, a spike in outbound volume, an open relay, bounces from addresses you never mailed | Reset passwords and turn on two-factor sign-in, revoke unknown app passwords and API keys, scan the machine, close the open relay, patch the web form |
| Purchased, scraped or very old lists | Spam trap hits, high hard-bounce rates, low engagement | Stop mailing the list. Re-permission or verify old addresses, and remove anyone who hasn't engaged in many months |
| Spam traps | Listings on trap-driven lists without many complaints | Remove addresses with no sign-up record. Use confirmed opt-in for new sign-ups |
| High complaint rate | Gmail Postmaster Tools spam rate rising. Google asks senders to stay below 0.10% and never reach 0.30% | Make unsubscribing easy, including one-click unsubscribe. Send only what people signed up for, and stop mailing people who don't engage |
| Missing or broken authentication | SPF, DKIM or DMARC failing in message headers | Publish correct SPF, DKIM and DMARC records for every service that sends as your domain |
| Missing reverse DNS | The IP has no PTR record, or it doesn't match | Ask your host to set a PTR record that resolves to a hostname, which resolves back to the same IP |
| Volume spike on a new IP or domain | Listing soon after you started sending | Ramp up gradually. Spread volume over time and mailboxes |
| Shared IP problem | Listing on a shared ESP IP, or UCEPROTECT Level 2 or 3 | Report it to your ESP or host. If it keeps recurring, move to a dedicated IP with a proper warmup |

Unspam's spam test helps here. It scores a message from 0 to 100 against authentication (SPF, DKIM, DMARC), sender reputation, blacklists and content signals, and shows which checks cost you points and how to win them back. It also checks BIMI, reverse DNS and list-unsubscribe setup, which covers most of the technical causes in the table above in one run.

**A common mistake:** fixing one obvious problem and filing removal requests while a second cause is still live. A compromised account plus a stale list is a typical pair. Clean both before you request removal.

## Step 4: Use the official delisting routes

Use each list's own page. Avoid third-party services that offer to "delist" you for a fee: only the list operator can remove a listing.

### Spamhaus removal lookup

1. Go to [check.spamhaus.org](https://check.spamhaus.org/) and look up the IP or domain.
2. The result names the exact list (for example SBL, XBL, CSS, PBL or DBL) and explains why you were listed.
3. Follow the removal steps on that result.
   - Some listings, often XBL and CSS, can be removed by the sender once the cause is fixed.
   - Others, such as SBL, are handled by Spamhaus staff and may need your ISP or host involved.
   - PBL listings for dynamic ranges are expected and are fixed by sending through your provider's mail server.
4. Remove only after you've fixed the cause. Spamhaus can relist an IP quickly if the activity continues.

### Microsoft delist portal for Microsoft 365, and Outlook.com support

Microsoft runs two separate systems.

**Microsoft 365 (business mailboxes)**, when the bounce is `550 5.7.606-649 Access denied, banned sending IP`:

![The Office 365 Anti-Spam IP Delist Portal, asking for an email address and the IP address to delist.](/guides/domain-ip-blacklist-delisting/microsoft-delist-portal.jpg "Microsoft's delist portal at sender.office.com, 24 November 2026")

1. Go to the [Office 365 Anti-Spam IP Delist Portal](https://sender.office.com/).
2. Enter the email address that received the bounce and the IP address named in the error. You can enter only one email address and one IP per visit.
3. Submit, then confirm using the link Microsoft emails to that address.
4. Read [Microsoft's delist portal documentation](https://learn.microsoft.com/en-us/defender-office-365/external-senders-use-the-delist-portal-to-unblock-yourself) before you submit. If the error is `5.7.511`, the portal can't remove it; follow that article's section on error 5.7.511 instead.

**Outlook.com, Hotmail and Live (consumer mailboxes):**

1. Make sure you meet [Outlook.com's sender policies](https://substrate.office.com/ip-domain-management-snds/postmaster/Policies). These include valid reverse DNS, honoring unsubscribes, and SPF, DKIM and DMARC for domains sending more than 5,000 emails a day.
2. Contact [Outlook.com deliverability support](https://go.microsoft.com/fwlink/?LinkID=614866) through the form Microsoft links from its Postmaster site. Microsoft says it may not be able to help senders who don't follow its policies.

**Microsoft SNDS.** If you control the sending IP, sign up for [Smart Network Data Services (SNDS)](https://substrate.office.com/ip-domain-management-snds/snds). It shows how Outlook.com sees your IPs: traffic, spam filter results, complaint rates and spam trap hits. It also includes the Junk Mail Reporting Program, which reports when users mark your mail as junk. Use it to confirm the cause before you ask for help, and to watch the IP recover afterwards.

![The Outlook.com Smart Network Data Services portal, with its announcement that it replaces the previous SNDS site.](/guides/domain-ip-blacklist-delisting/microsoft-snds.jpg "Microsoft SNDS, 24 November 2026")

### Other lists

- **SpamCop:** expires on its own once the abuse stops, often within about a day.
- **UCEPROTECT Level 1:** auto-expires for free once the IP has been clean for seven days. Levels 2 and 3 are for your host or ESP to resolve.
- **PSBL:** auto-expires but can take two to three weeks. Use its self-service removal form once you've fixed the cause.
- **Barracuda and Mailspike:** don't clear quickly on their own. Submit a removal request through the operator's form after you've fixed the issue.

Unspam's blacklist checker links each listed row to that list's lookup or removal page, so you can go straight to the right form.

### Google Safe Browsing review if your domain is flagged

Google Safe Browsing isn't an email blacklist, but a flagged domain hurts both email and web traffic. Links to it trigger warnings, and filters treat mail containing it as dangerous.

![Google's Safe Browsing site status page, with a field to check a URL.](/guides/domain-ip-blacklist-delisting/safe-browsing-status.jpg "Google Safe Browsing site status, 24 November 2026")

1. Check your domain at [Google's Safe Browsing site status](https://transparencyreport.google.com/safe-browsing/search).
2. If it's flagged, open the Security issues report in Google Search Console for your site. It lists the affected URLs.
3. Remove the malware, phishing pages or injected content, patch how it got in, and change your admin passwords.
4. Select Request review in Search Console and describe what you fixed.

## Step 5: Set up ongoing blacklist monitoring

A one-off lookup tells you where you stand today. Monitoring tells you when that changes, ideally before a campaign goes out.

### Blacklist monitoring tools compared

| Tool | What it monitors | Lists covered | How often |
| --- | --- | --- | --- |
| **Unspam** | Scheduled inbox placement and spam-score tests on the messages and flows you choose. Each run re-checks authentication, content, blacklists and HTML, and alerts you when placement or the score crosses your threshold. The free checker covers IPs, domains and email addresses on demand, plus reverse DNS | Spam test: the sending IP against 70+ IP blocklists and the sender domain against 30+ domain blocklists, plus the links in the message. Free checker: more than 20 email IP blacklists plus domain lists such as SURBL, with Spamhaus and URIBL linked for direct checks | Daily or weekly, set per test |
| MxToolbox | IP and domain blacklist monitoring | More than 100 blacklists in its lookup | Weekly on the free plan, for 1 domain |
| HetrixTools | IPs, domains and IP blocks, plus Microsoft SNDS status | 94 blacklists | Every 24 hours on the free plan, for 32 IPs or domains |
| Validity Everest | Blocklist monitoring for IPs and domains | Not published on its product page | Not published on its product page |
| GlockApps | IP uptime monitor checking an IP against public blacklists | Not published for the monitor. Its spam checker checks the sending IP against 50+ blocklists | Every 2 hours on free monitors; paid monitors from every minute |

Where Unspam is not the right fit: its monitoring re-runs a message test on the schedule you set, and no tool can delist you for you. If you need to watch many bare IPs or a whole IP block on their own, a dedicated IP monitor such as HetrixTools or GlockApps' IP uptime monitor checks more often.

What matters more than the raw list count:

- **Coverage of the lists that matter.** Spamhaus, Barracuda and SpamCop, plus Microsoft's own data if you send to Outlook.
- **Alert frequency.** Daily is enough for most senders. A high-volume sender wants alerts the same day.
- **Placement, not just listings.** A clean lookup doesn't mean mail reaches the inbox. Authentication, complaints and content also decide placement, and a lookup can't see them.

### How to monitor with Unspam, step by step

1. **Run a baseline.** Check your sending IP and domain in the [blacklist checker](https://unspam.email/blacklist-checker), then check Spamhaus directly from the link below the results.
2. **Test a real message.** Run a spam test and an inbox placement test on your most important email: a newsletter, a cold email or a password reset. The spam score shows any blacklist, authentication or reverse DNS problem. The placement test shows Inbox, Promotions, Spam or Missing at each provider.
3. **Schedule it.** In [Deliverability Monitoring](https://unspam.email/deliverability-monitoring), set a daily or weekly cadence for each message or flow you want watched. Autopilot re-runs the placement and spam-score tests on that schedule.
4. **Set your threshold.** Alert on every run, or only when inbox placement drops below a percentage or the spam score crosses a line you choose. Name each test after the domain or flow it covers.
5. **Act on alerts.** An alert includes the per-provider breakdown and the spam-score change, so you can see what changed and where. Go back to Step 1 of this guide for a new listing.
6. **Keep it running after a fix.** Watch placement recover and stay recovered, not just improve for a day.

If you send from several domains, for cold outreach or for multiple brands, run one scheduled test per domain. Unspam doesn't charge per sender account.

## My emails are landing in the spam folder. How do I fix this?

If your mail goes to spam and you aren't on any blacklist, the cause is somewhere else. Blacklists are only one signal. For a fuller checklist, see [cold emails or Outlook sends going to spam](/guides/cold-email-spam-checklist/). Work through these in order:

1. **Authentication.** SPF, DKIM and DMARC must pass and align with your From domain. Google and Microsoft both require all three from bulk senders sending more than 5,000 messages a day.
2. **Reverse DNS.** Your sending IP needs a PTR record that resolves back to it.
3. **Unsubscribe.** Bulk marketing mail to Gmail needs one-click unsubscribe, through the `List-Unsubscribe` and `List-Unsubscribe-Post` headers.
4. **Complaints and engagement.** Keep Gmail's spam rate below 0.10%, and stop mailing people who never open.
5. **Content.** Watch for broken links, link shorteners, image-only emails and links to domains with a bad reputation.
6. **Placement.** Test where the message lands at each provider before you send, and again after each change.

Unspam's spam test and inbox placement test check all six in one run, so you can see which one is failing rather than guess.

## When to bring in a deliverability expert

Some listings are hard to solve alone:

- **Repeat listings.** You get delisted, then relisted within days or weeks, which means the cause hasn't been found.
- **Shared IP problems** that your ESP won't resolve, or a decision on whether to move to a dedicated IP.
- **Infrastructure changes,** such as moving to a new ESP or warming up new IPs.
- **Listings on major lists** that affect revenue-critical mail, such as receipts, password resets or a large customer base.

Unspam works with Email Industries' deliverability consultants. They run audits, troubleshoot listings and placement problems, give infrastructure guidance, support IP warmup and recommend list hygiene, then work hands-on with your team on the email platform you already use. Every engagement starts with a consultation call and an audit. [Speak with a deliverability consultant](https://unspam.email/email-deliverability).

## FAQ

### My domain got blacklisted. How do I find out where and get removed?

Look up your domain and sending IP in a blacklist checker such as [Unspam's](https://unspam.email/blacklist-checker), and check Spamhaus directly at check.spamhaus.org. Read your bounces for the list names they cite. Fix the cause, whether that's a compromised account, a bad list or failing authentication. Then use each list's own removal page. Some lists, such as SpamCop and UCEPROTECT Level 1, clear on their own once the problem stops.

### What's the best tool for monitoring email blacklists?

Pick one that covers the lists that matter (Spamhaus, Barracuda, SpamCop), alerts you at least daily, and shows whether a listing is actually hurting placement. Unspam suits seeing a listing and its effect on placement together: it combines blacklist checks with scheduled inbox placement and spam-score monitoring and alerts. To watch many bare IPs or IP blocks on their own, a dedicated IP monitor checks more often. You see both the listing and its effect on where your mail lands, and consultants are available if a listing keeps coming back.

### How long does delisting take?

It depends on the list. SpamCop often clears within about a day after abuse stops. UCEPROTECT Level 1 clears after seven clean days. PSBL can take two to three weeks unless you use its removal form. Barracuda, Mailspike and Spamhaus need a request, which is handled once the cause is fixed.

### Can I get delisted without fixing the problem?

Sometimes the form accepts it, but you'll usually be relisted, often within hours. Some lists also make removal harder for repeat listings. Fix the cause first.

### Why is my IP listed when I didn't send spam?

On a shared IP, another sender on the same address can get it listed. UCEPROTECT Levels 2 and 3 list whole subnets or networks because of other senders. Ask your ESP or host to fix it. If it keeps happening, consider a dedicated IP with a proper warmup.

## Next step

Check your IP and domain now with Unspam's free [blacklist checker](https://unspam.email/blacklist-checker). Then run a spam test and an inbox placement test to see whether a listing, or something else, is costing you the inbox. Start free at [https://unspam.email/](https://unspam.email/).
