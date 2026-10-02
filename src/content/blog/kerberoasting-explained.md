---
title: 'Kerberoasting, explained for defenders'
description: 'Why Kerberoasting keeps showing up in Active Directory assessments, and the handful of changes that shut it down.'
date: 2026-09-20
tags: ['active-directory', 'kerberos', 'defense']
draft: false
---

> **Sample post.** This is example content so you can see the layout. Edit or delete it in
> `src/content/blog/`, or publish your own posts from `/admin`.

Kerberoasting is one of the first things I look for on an internal Active Directory assessment.
It's quiet, it needs nothing more than an ordinary domain account, and it still works far too
often. This post is about *why* it works and, more importantly, how to make it stop.

## The one-paragraph version

Active Directory lets any authenticated user ask for a service ticket to any account that runs a
service. Part of that ticket is protected with a key derived from the **service account's
password**. If that password is weak, an attacker who collects the ticket can test guesses against
it offline — no further interaction with the domain, nothing noisy to detect. The weakness isn't
the protocol; it's the human-chosen service password behind it.

## Why it's so common

- **Service accounts outlive the people who made them.** A password set in 2016 "just to get it
  working" is still there, still a dictionary word with a year on the end.
- **They're over-privileged.** The same account is often a local admin on dozens of hosts, so one
  cracked password travels a long way.
- **Nobody rotates them**, because something undocumented might break.

## What actually fixes it

| Change | Why it helps |
| --- | --- |
| **(g)MSA / dMSA accounts** | The OS manages a 120-character random password and rotates it. There is nothing crackable. |
| **25+ character passphrases** | For the service accounts you can't convert yet, length defeats offline guessing. |
| **Least privilege** | A cracked service account that can't go anywhere is a finding, not an incident. |
| **AES-only tickets** | Disable the legacy RC4 cipher where you can; it's the easy path for offline cracking. |

## Detection worth having

Convert service accounts to managed accounts first — that removes the vulnerability instead of
just watching it. Then alert on **unusual volumes of service-ticket requests from a single
account**, especially for the legacy cipher. A normal workstation asks for a few; an enumeration
sweep asks for all of them at once.

The takeaway I leave with every client: *treat service-account passwords like keys, not like
passwords.* Make them long, make them managed, and make them boring.
