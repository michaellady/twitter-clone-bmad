---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ['_bmad-output/brainstorming/brainstorming-session-2026-03-22-140500.md']
date: 2026-03-22
author: Mikelady
workflow_completed: true
---

# Product Brief: twitter-clone

## Executive Summary

A Twitter clone built as a learning exercise to evaluate the BMAD Method's effectiveness as an AI-driven development framework. The project serves as a benchmark: can BMAD guide a DevOps engineer with no full-stack experience through building a working social media application with minimal manual intervention? The Twitter clone was chosen as a well-understood product that tests full-stack patterns (auth, data modeling, UI, real-time interaction) without ambiguity about what "done" looks like.

---

## Core Vision

### Problem Statement

AI-assisted development frameworks (BMAD, GSD, Superpowers, Open Spec, Spec Kit) all claim to accelerate software delivery, but it's hard to know which approach actually works without hands-on experience. Evaluating them requires a consistent, non-trivial project that exercises real full-stack patterns.

### Problem Impact

Without a structured evaluation, developers risk adopting a methodology that sounds good in theory but breaks down in practice — wasting time on frameworks that don't deliver, or missing frameworks that would genuinely accelerate their work.

### Why Existing Solutions Fall Short

Each framework markets itself differently, but none provide a side-by-side comparison. The only way to evaluate is to build the same thing with each one and observe: how much intervention was required? How coherent was the output? How much did the framework actually think for you vs. generate boilerplate?

### Proposed Solution

Build a Twitter clone (text-only, local-only, core social mechanics) using the BMAD Method end-to-end. Track how much manual intervention is needed at each phase. Use the same project spec to later evaluate competing frameworks for apples-to-apples comparison.

### Key Differentiators

- **Evaluation-first mindset** — success is measured by framework effectiveness, not app features
- **Controlled variable** — same project across multiple frameworks enables fair comparison
- **DevOps perspective** — evaluator brings infrastructure expertise but not frontend/full-stack, testing whether BMAD bridges that gap

## Target Users

### Primary Users — Requirement Source Personas

These personas are fictional but serve as **requirement sources** — each one drives specific features, UX decisions, and architectural choices.

**Jamie (Lurker)**
- **Behavior:** Browses content, rarely posts. Follows interesting accounts to curate their feed.
- **Core need:** Discover content without an existing follow graph.
- **Deal-breaker:** Empty or dead-feeling feed.
- **Drives:** Explore/discover page, seed data, onboarding flow.

**Alex (Poster)**
- **Behavior:** Creates content, replies to others, checks engagement on their tweets.
- **Core need:** Visible engagement feedback — who liked, replied, quote-tweeted.
- **Deal-breaker:** Posting into a void with no engagement signals.
- **Drives:** Engagement counts, activity feed, threading.

**Morgan (Power User)**
- **Behavior:** Posts daily, lives in reply threads, processes engagement like a work queue.
- **Core need:** Fast compose, reliable chronological feed, navigable reply threads.
- **Deal-breaker:** Missing content or friction in the compose flow.
- **Drives:** Compose-first landing, chronological trust, reply thread navigation.

### Secondary User

**Mikelady (Framework Evaluator)**
- **Role:** DevOps engineer evaluating the BMAD Method's ability to guide full-stack development with minimal manual intervention.
- **Context:** No full-stack experience. Will use the same Twitter clone spec to evaluate competing frameworks (GSD, Superpowers, Open Spec, Spec Kit).
- **Success criteria:** How much intervention was needed? Did BMAD make the right technical decisions? Does the code work?

### User Journey

**Mikelady's evaluation journey:**

1. **Discovery:** Follow BMAD workflow end-to-end from brainstorming through implementation
2. **Onboarding:** Experience each BMAD phase (analysis, planning, solutioning, implementation)
3. **Core Usage:** Observe how much intervention is needed at each step
4. **Success Moment:** The app runs locally and works
5. **Long-term:** Compare BMAD results against other frameworks using the same project

## Success Metrics

### Framework Evaluation Metrics

**Primary metric: Intervention count by severity**

| Severity | Definition | Example |
|---|---|---|
| **Minor** | Typo fixes, import corrections, small config tweaks | Missing semicolon, wrong file path |
| **Moderate** | Rewriting a function, fixing a broken feature, adjusting a data model | Auth middleware not working, schema redesign |
| **Major** | Rearchitecting a component, scrapping generated code, making a design decision BMAD skipped | Replacing entire state management approach |

Success = mostly minor interventions. Red flag = any major interventions.

**Secondary metrics:**

- **Time-to-working without debugging:** Does the code work after following BMAD's instructions, or does Mikelady need to debug? Time spent debugging per step is the real signal, not a binary first-try pass/fail.
- **Architecture constraint-match:** Did BMAD respect the constraints (SQLite, local-only, single command to run)? If it picks Postgres + Docker, that's a fail regardless of code quality.
- **Architecture understandability:** Can Mikelady read the generated code and roughly understand what it does? If the code is too clever to follow, BMAD failed the accessibility test even if it works.
- **Workflow clarity:** Was the BMAD workflow clear enough to follow without external docs or tutorials?

### Verification Strategy

**E2E Testing with Screenshots:**
- Automated E2E test suite covering all must-build and should-build features
- Tests capture screenshots at each step for visual verification
- Mikelady should not need to manually click through the app to verify features — the test suite proves it works
- E2E tests serve as living documentation of what the app does

**TDD/BDD Stories with Personas:**
- Each user story written in BDD format: `Given [persona context] When [action] Then [expected outcome]`
- Stories are directly verifiable through automated tests
- Personas (Jamie, Alex, Morgan) appear in story descriptions to trace features back to requirement sources
- Example: `Given Jamie has no follows, When Jamie visits the explore page, Then Jamie sees recent public tweets`
- All acceptance criteria must have corresponding test cases before implementation begins

### App Success Metrics

**All "must build" features working locally (verified by E2E tests):**
- Email/password auth (register, login, logout)
- Compose tweets (280-char limit with live counter)
- Chronological timeline of followed users' tweets
- Reply threading (nested replies, self-reply for threads)
- Quote retweets (embed original tweet in new tweet)
- Likes with visible engagement counts
- Follow/unfollow users
- Minimal user profiles (avatar, bio, tweet list)

**All "should build" features working locally (verified by E2E tests):**
- Activity feed (engagement on your tweets)
- Explore page (public tweets for discovery)
- Onboarding flow (suggested users or public feed)
- Seed data (app doesn't feel empty on first run)

**Note:** Each feature requires testable acceptance criteria in the PRD with BDD-style stories tied to personas. E2E tests with screenshots validate features automatically.

### Business Objectives

N/A — Personal learning project with no business goals.

### Key Performance Indicators

| KPI | Target | Measurement |
|---|---|---|
| Major interventions | 0 | Count per implementation step |
| Moderate interventions | As few as possible | Count per implementation step |
| Minor interventions | Acceptable | Count per implementation step |
| Must-build features complete | 8/8 | E2E test suite pass rate |
| Should-build features complete | 4/4 | E2E test suite pass rate |
| App runs locally with single command | Yes/No | `npm start` or equivalent |
| Time debugging per step | Minimal | Minutes spent debugging BMAD output |
| Architecture matches constraints | Yes/No | SQLite, local-only, no Docker |
| E2E test coverage | 100% of acceptance criteria | Automated test results with screenshots |

## MVP Scope

### Core Features (Must Build)

All features derived from persona requirement sources and validated during brainstorming:

| Feature | Persona Driver | BDD Verification |
|---|---|---|
| Email/password auth | All personas | Register, login, logout flows |
| Compose tweet (280 char, live counter) | Morgan, Alex | Character limit enforced, counter updates |
| Chronological timeline | All personas | Shows followed users' tweets in time order |
| Reply threading | Morgan, Alex, Jamie | Nested replies, self-reply threads navigable |
| Quote retweets | Alex | New tweet embeds referenced original |
| Likes with engagement counts | Alex, Jamie | Count updates on click, persists on refresh |
| Follow/unfollow | All personas | Follow adds to timeline, unfollow removes |
| Minimal profiles (avatar, bio, tweets) | All personas | Profile displays avatar, bio, and tweet list |

### Should Build

| Feature | Persona Driver | BDD Verification |
|---|---|---|
| Activity feed | Alex, Morgan | Shows likes/replies/quotes on your tweets |
| Explore page | Jamie | Public tweets visible without login |
| Onboarding flow | Jamie | Suggested users or public feed on first login |
| Seed data | Jamie | App pre-populated with sample users and tweets |

### Nice to Have

| Feature | Persona Driver | Notes |
|---|---|---|
| Compose-first landing | Morgan | App opens to compose view; easy to try, easy to revert |

### Out of Scope

Explicitly excluded — do not build:
- Hashtags
- Search
- Media uploads (images, video)
- Edit tweet
- Plain retweets (quote retweet only)
- Banner images on profiles
- Follower/following counts on profiles
- Mobile responsive design
- Multi-tab session support
- Real-time updates (WebSocket/SSE)
- Direct messages
- Push notifications
- Algorithmic feed
- Deployment/hosting
- Moderation tools

### MVP Success Criteria

The MVP is successful when:
1. All 8 must-build features pass their E2E tests with screenshots
2. All 4 should-build features pass their E2E tests with screenshots
3. App runs locally with a single command (no Docker, no external services)
4. Seed data makes the app feel populated on first run
5. Total major interventions by Mikelady = 0

### Technical Constraints

- **Database:** SQLite (embedded, zero-config)
- **Runtime:** Local only, single command to start
- **Infrastructure:** No Docker, no cloud services, no API keys
- **Stack:** Any frameworks/libraries — BMAD chooses (part of the evaluation)
- **Platform:** Desktop only, single browser session
- **Testing:** E2E test suite with screenshot capture, BDD-style stories

### Future Vision

This project has no product roadmap — it's an evaluation vehicle. However, after completing the BMAD evaluation:

1. **Compare frameworks:** Build the same Twitter clone with GSD, Superpowers, Open Spec, and Spec Kit
2. **Publish findings:** Document intervention counts, architecture quality, and developer experience across all frameworks
3. **Identify strengths:** Each framework likely excels at different phases — map which framework is best for which type of work
4. **Potential expansion:** If a framework produces particularly good results, extend the Twitter clone with cut features (search, media, real-time) to test the framework under more complex conditions
