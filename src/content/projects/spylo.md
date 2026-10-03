---
title: 'Spylo 1.0 — Modular OSINT Framework'
description: 'An extensible Python framework that unifies 20+ reconnaissance modules behind one interface, with multithreaded collection and data correlation.'
tags: ['Python', 'OSINT', 'Recon', 'Automation']
repo: 'https://github.com/6reams/Spylo'
image: '/images/projects/spylo.webp'
date: 2026-06-01
featured: true
order: 1
draft: false
---

## Problem

Open-source reconnaissance is fragmented. Mapping a target's attack surface means juggling a dozen
one-off scripts and web tools — username lookups here, subdomain enumeration there — then manually
stitching the results together in a spreadsheet. It's slow, it's inconsistent, and it's easy to
miss the connection that actually matters.

I wanted a single framework where adding a new intelligence source was trivial and where the
results from every source were correlated automatically.

## Approach

Spylo is built around a **modular architecture**: each intelligence source is a self-contained
module that implements a common interface, so new sources plug in without touching the core.

- **20+ modules** covering username enumeration, subdomain and asset discovery, and
  organisational-infrastructure mapping.
- **Multithreaded collection** so independent API lookups run in parallel instead of blocking each
  other — turning minutes of waiting into seconds.
- **A data-correlation layer** that consolidates findings across modules, linking a username, a
  domain, and an exposed asset back to the same target entity.
- Written in **Python** with a clean module registry, so a contributor can add a source by dropping
  in one file.

## Result

A reusable recon framework that replaced a pile of ad-hoc scripts with one consistent workflow. It
cut the time to produce an initial attack-surface map dramatically, surfaced correlations that were
easy to miss by hand, and is **open-sourced on GitHub** so others can extend it.
