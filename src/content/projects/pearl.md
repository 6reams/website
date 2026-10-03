---
title: 'Pearl — Autonomous Bug Bounty Engine'
description: 'A fully autonomous bug bounty hunting engine built as an MCP server for Claude Code. Give it a scope — it hunts, verifies, and delivers confirmed PoC findings with zero false positives.'
tags: ['TypeScript', 'MCP', 'Bug Bounty', 'Automation', 'AI']
repo: 'https://github.com/6reams/pearl'
image: '/images/projects/pearl.webp'
date: 2026-09-25
featured: true
order: 0
private: true
draft: false
---

## Problem

Bug bounty hunting is time-intensive and manual. Triaging targets, writing payloads, chasing false
positives, and escalating findings to maximum impact takes hours per endpoint — and most of that
work is repetitive across programs.

## Approach

Pearl is a **fully autonomous MCP server** that plugs into Claude Code. Point it at a scope and
walk away.

- **Threat-model-first**: before touching any endpoint, Pearl correlates the tech stack with
  historical CVEs and disclosed HackerOne reports to decide which vuln classes to prioritize.
- **8-gate evidence pipeline**: every candidate finding must pass exploitation depth, OOB
  confirmation, semantic diff, endpoint sensitivity, data exfiltration, confidence floor, 3/3
  replay, and WAF auto-retry gates. Anything that fails is silently discarded.
- **Full escalation chains**: SQLi → UNION → DB dump → RCE. SSRF → metadata → IAM creds.
  Every chain produces a ceiling, max impact, and working `curl` PoC.
- **OWASP LLM Top 10**: prompt injection, jailbreaks, tool hijacking, cross-context injection,
  and agentic escalation paths.
- **Self-learning engine**: per-target memory, cross-target patterns, and writeup lessons persist
  across hunts.

## Result

A zero-false-positive hunting engine that ships platform-ready reports (HackerOne, Bugcrowd,
Intigriti) with real extracted data, working PoCs, and confirmed escalation ceilings. Currently
private.
