---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/product-brief-twitter-clone-2026-03-22.md']
workflowType: 'architecture'
project_name: twitter-clone
user_name: Mikelady
date: 2026-03-22
workflow_completed: true
---

# Architecture Document - twitter-clone

**Author:** Mikelady
**Date:** 2026-03-22

## Project Context

### Project Overview

A text-only Twitter clone serving as a BMAD Method evaluation instrument. Built by a DevOps engineer with no full-stack experience to benchmark how much manual intervention the framework requires.

### Architectural Constraints (from PRD)

- **Database:** SQLite (embedded, zero-config)
- **Runtime:** Local only, single command to start (`npm run dev`)
- **Infrastructure:** No Docker, no cloud services, no API keys
- **Platform:** Desktop only, single browser session
- **Scale:** 10-50 seed data users, no optimization needed
- **Real-time:** Not required (page refresh is fine)

### Complexity Assessment

**Low complexity.** Well-understood domain (social media clone), no compliance requirements, no external integrations, single-user local deployment. Architecture should prioritize simplicity and developer understanding over scalability.

## Starter Template & Technology Stack

### Framework: Next.js 16 (App Router)

**Why:** Full-stack framework with built-in routing, server-side rendering, API routes via Server Actions, and excellent TypeScript support. Single project, single command to run. No separate backend needed.

**Version:** Next.js 16.2.x (latest stable, verified March 2026)

### Complete Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.x | Full-stack, single command, server actions |
| **Language** | TypeScript | 5.x | Type safety, better AI code generation |
| **Database** | SQLite via Prisma | — | Zero-config, file-based, embedded |
| **ORM** | Prisma | 7.2.x | Type-safe queries, auto-migration, SQLite adapter |
| **Auth** | Better Auth | latest | TypeScript-first, session-based, recommended replacement for NextAuth |
| **Styling** | Tailwind CSS | 4.2.x | Utility-first, no separate CSS files, fast iteration |
| **UI Components** | shadcn/ui | latest | Copy-paste components, no dependency lock-in |
| **Validation** | Zod | latest | Runtime validation, TypeScript inference |
| **E2E Testing** | Playwright | latest | Cross-browser, built-in screenshots, auto-waiting |
| **Package Manager** | npm | — | Default, no config needed |

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Next.js App Router with Server Actions (no separate API)
2. Prisma + SQLite for data layer
3. Better Auth for authentication
4. Playwright for E2E with screenshots

**Important Decisions (Shape Architecture):**
5. Server Actions over API routes for data mutations
6. Server Components by default, Client Components only when needed
7. Tailwind + shadcn/ui for styling

**Deferred Decisions (Post-MVP):**
- None — all decisions made upfront for this scope

### Data Architecture

**Database:** SQLite via Prisma ORM with `@prisma/adapter-better-sqlite3`

**Schema Design:**

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  name          String
  bio           String   @default("")
  avatarUrl     String   @default("/default-avatar.png")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  tweets        Tweet[]
  likes         Like[]
  following     Follow[] @relation("following")
  followers     Follow[] @relation("followers")
  activities    Activity[]
}

model Tweet {
  id            String   @id @default(cuid())
  content       String
  createdAt     DateTime @default(now())
  authorId      String
  parentId      String?
  quoteTweetId  String?

  author        User     @relation(fields: [authorId], references: [id])
  parent        Tweet?   @relation("replies", fields: [parentId], references: [id])
  replies       Tweet[]  @relation("replies")
  quoteTweet    Tweet?   @relation("quotes", fields: [quoteTweetId], references: [id])
  quotedBy      Tweet[]  @relation("quotes")
  likes         Like[]
}

model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  userId    String
  tweetId   String

  user      User     @relation(fields: [userId], references: [id])
  tweet     Tweet    @relation(fields: [tweetId], references: [id])

  @@unique([userId, tweetId])
}

model Follow {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  followerId  String
  followingId String

  follower    User     @relation("following", fields: [followerId], references: [id])
  following   User     @relation("followers", fields: [followingId], references: [id])

  @@unique([followerId, followingId])
}

model Activity {
  id        String   @id @default(cuid())
  type      String
  createdAt DateTime @default(now())
  userId    String
  actorId   String
  tweetId   String?

  user      User     @relation(fields: [userId], references: [id])
}
```

**Key data decisions:**
- `cuid()` for IDs — URL-safe, sortable, no auto-increment leakage
- `parentId` on Tweet enables reply threading (self-referential)
- `quoteTweetId` on Tweet enables quote retweets
- `@@unique` constraints enforce "one like per user per tweet" and "one follow per pair"
- `Activity` table stores engagement events with `actorId` for "who" visibility (FR24)
- Denormalized counts not needed at this scale — count queries are fine for 50 users

**Migration approach:** `prisma migrate dev` for development. No production migration strategy needed (local only).

### Authentication & Security

**Better Auth with Credentials Provider:**
- Email/password registration and login
- Server-side session management (session stored in database)
- Session tokens in httpOnly cookies (NFR2: not accessible to client-side JS)
- Password hashing via Better Auth's built-in bcrypt (NFR1)
- Middleware-based route protection

**Session strategy:** Database sessions (not JWT). Simpler, more secure for this use case. Session table managed by Better Auth.

### API & Communication Patterns

**Server Actions (no REST API):**
- All data mutations via Next.js Server Actions
- Server Components fetch data directly via Prisma (no API layer)
- No separate API routes needed — simplifies architecture significantly
- Zod validation on all Server Action inputs

**Error handling:** Server Actions return `{ success: boolean, error?: string, data?: T }` — consistent response shape.

### Frontend Architecture

**Server Components by default:**
- Pages and layouts are Server Components (fetch data directly)
- Client Components only for interactive elements (compose form, like button, follow button)
- `"use client"` directive used sparingly

**State management:** No global state library needed. Server Components handle data fetching. Client Components use `useOptimistic` for instant UI feedback on mutations (likes, follows).

**Routing:** Next.js App Router file-based routing. No client-side navigation library.

### Infrastructure & Deployment

**Local only:**
- `npm run dev` starts everything
- SQLite file at `prisma/dev.db`
- No environment variables required beyond `AUTH_SECRET` (auto-generated)
- No Docker, no cloud, no CI/CD

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming:**
- Tables: PascalCase (Prisma convention) → `User`, `Tweet`, `Like`, `Follow`, `Activity`
- Columns: camelCase → `createdAt`, `authorId`, `parentId`
- Relations: camelCase descriptive → `followers`, `following`, `replies`, `quoteTweet`

**File Naming:**
- Components: kebab-case files → `tweet-card.tsx`, `compose-form.tsx`
- Pages: Next.js conventions → `page.tsx`, `layout.tsx`, `loading.tsx`
- Server Actions: kebab-case → `tweet-actions.ts`, `auth-actions.ts`
- Lib utilities: kebab-case → `db.ts`, `auth.ts`, `utils.ts`

**Code Naming:**
- Components: PascalCase → `TweetCard`, `ComposeForm`
- Functions: camelCase → `createTweet`, `toggleLike`, `followUser`
- Variables: camelCase → `currentUser`, `tweetCount`
- Constants: SCREAMING_SNAKE_CASE → `MAX_TWEET_LENGTH`
- Types/Interfaces: PascalCase → `TweetWithAuthor`, `UserProfile`

### Structure Patterns

**Component organization:** By feature, co-located with related code.

**Test location:** `tests/e2e/` for Playwright E2E tests. No unit tests required per PRD scope.

**Server Actions:** Grouped by domain in `src/app/actions/` → `tweet-actions.ts`, `auth-actions.ts`, `social-actions.ts`

### Format Patterns

**Server Action response shape:**
```typescript
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
```

**Date format:** ISO strings in database, relative time in UI ("2m ago", "1h ago").

**JSON field naming:** camelCase everywhere (TypeScript convention).

### Process Patterns

**Error handling:**
- Server Actions catch errors and return `{ success: false, error: "message" }`
- Client Components display errors inline near the action that caused them
- No global error toasts — errors are contextual (FR32)

**Loading states:**
- Server Components use `loading.tsx` files for suspense boundaries
- Client Components use `useTransition` for pending states on mutations
- No skeleton screens needed at this scale

**Form validation:**
- Zod schemas shared between client and server
- Client-side validation for instant feedback (character counter)
- Server-side validation in every Server Action (security boundary)

## Project Structure & Boundaries

### Complete Project Directory Structure

```
twitter-clone/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .gitignore
├── components.json              # shadcn/ui config
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                  # Seed data script (FR28)
│   └── dev.db                   # SQLite database (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (html, body, providers)
│   │   ├── page.tsx             # Landing: compose-first or explore
│   │   ├── globals.css          # Tailwind imports
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Login page
│   │   │   └── register/
│   │   │       └── page.tsx     # Register page
│   │   ├── (main)/
│   │   │   ├── layout.tsx       # Authenticated layout (nav, sidebar)
│   │   │   ├── home/
│   │   │   │   └── page.tsx     # Chronological timeline (FR13)
│   │   │   ├── explore/
│   │   │   │   └── page.tsx     # Public tweets (FR14, FR17)
│   │   │   ├── activity/
│   │   │   │   └── page.tsx     # Engagement feed (FR24)
│   │   │   ├── profile/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # User profile (FR4, FR5)
│   │   │   └── tweet/
│   │   │       └── [id]/
│   │   │           └── page.tsx # Tweet detail + reply thread (FR15)
│   │   └── actions/
│   │       ├── tweet-actions.ts # Create tweet, reply, quote retweet
│   │       ├── auth-actions.ts  # Register, login, logout
│   │       └── social-actions.ts# Like, unlike, follow, unfollow
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (button, input, etc.)
│   │   ├── tweet/
│   │   │   ├── tweet-card.tsx   # Single tweet display with counts
│   │   │   ├── tweet-list.tsx   # List of tweets (timeline, profile, explore)
│   │   │   ├── compose-form.tsx # Tweet composition with char counter (FR6-FR8)
│   │   │   ├── reply-thread.tsx # Nested reply display (FR15)
│   │   │   └── quote-tweet.tsx  # Embedded quote tweet (FR12)
│   │   ├── social/
│   │   │   ├── like-button.tsx  # Like/unlike toggle (FR20, FR21)
│   │   │   ├── follow-button.tsx# Follow/unfollow toggle (FR18, FR19)
│   │   │   └── engagement-counts.tsx # Like + reply counts (FR22, FR23)
│   │   ├── user/
│   │   │   ├── user-avatar.tsx  # Avatar display
│   │   │   ├── user-card.tsx    # User info card (onboarding suggestions)
│   │   │   └── profile-header.tsx # Profile page header (avatar, bio)
│   │   ├── layout/
│   │   │   ├── nav-bar.tsx      # Top navigation
│   │   │   └── sidebar.tsx      # Side navigation links
│   │   └── activity/
│   │       └── activity-item.tsx # Single activity event display
│   ├── lib/
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── auth.ts              # Better Auth configuration
│   │   ├── auth-client.ts       # Better Auth client-side helpers
│   │   ├── utils.ts             # Shared utilities (cn, formatDate)
│   │   └── validators.ts        # Zod schemas (tweet, auth, etc.)
│   ├── middleware.ts             # Auth middleware (route protection)
│   └── types/
│       └── index.ts             # Shared TypeScript types
├── tests/
│   └── e2e/
│       ├── auth.spec.ts         # Registration, login, logout (J4)
│       ├── compose.spec.ts      # Tweet creation, char limit (J2, J5)
│       ├── timeline.spec.ts     # Chronological feed (J3)
│       ├── replies.spec.ts      # Threading, self-reply (J2, J3)
│       ├── social.spec.ts       # Like, follow, quote retweet (J1, J2)
│       ├── explore.spec.ts      # Public feed, logged-out (J1, J4)
│       ├── activity.spec.ts     # Activity feed (J2, J3)
│       ├── profile.spec.ts      # User profiles (J1)
│       └── playwright.config.ts # Playwright config with screenshot on failure
└── public/
    └── default-avatar.png       # Default user avatar
```

### Architectural Boundaries

**API Boundaries:**
- No external API — all data access via Server Actions and Server Components
- Server Actions are the mutation boundary (all writes go through `src/app/actions/`)
- Server Components are the read boundary (fetch data directly via Prisma)

**Component Boundaries:**
- Server Components: pages, layouts, data-fetching wrappers
- Client Components: interactive UI (forms, buttons with state, optimistic updates)
- Client Components receive data as props from Server Component parents

**Data Boundaries:**
- Prisma client (`src/lib/db.ts`) is the only data access point
- No raw SQL — all queries through Prisma's type-safe API
- Validation at Server Action boundary via Zod before any database operation

### Requirements to Structure Mapping

| FR Category | Primary Location |
|---|---|
| User Management (FR1-FR5) | `actions/auth-actions.ts`, `(auth)/`, `profile/[id]/` |
| Content Creation (FR6-FR12) | `actions/tweet-actions.ts`, `components/tweet/` |
| Content Consumption (FR13-FR17) | `(main)/home/`, `(main)/explore/`, `(main)/tweet/[id]/` |
| Social Interactions (FR18-FR23) | `actions/social-actions.ts`, `components/social/` |
| Activity & Engagement (FR24-FR26) | `(main)/activity/`, `components/activity/` |
| Onboarding & Discovery (FR27-FR28) | `prisma/seed.ts`, `(main)/explore/` |
| Verification & Testing (FR29-FR32) | `tests/e2e/` |

### Data Flow

```
User Action → Client Component → Server Action → Zod Validation → Prisma → SQLite
                                                                      ↓
User Sees ← Server Component Re-render ← revalidatePath ← Activity Created
```

1. User clicks like → Client Component calls `toggleLike` Server Action
2. Server Action validates input with Zod
3. Prisma creates/deletes Like record + creates Activity record
4. Server Action calls `revalidatePath` to refresh the page data
5. Server Component re-renders with updated counts

## Architecture Validation

### Coherence Check

| Check | Status | Notes |
|---|---|---|
| All decisions compatible | PASS | Next.js + Prisma + SQLite + Better Auth all work together |
| Patterns match stack | PASS | camelCase JS, PascalCase components, Prisma conventions |
| Structure matches decisions | PASS | App Router structure, Server Actions, co-located components |
| No conflicting patterns | PASS | Single data access layer, single mutation path |

### Requirements Coverage

| Requirement | Architecture Coverage |
|---|---|
| FR1-FR5 (User Mgmt) | Better Auth + Prisma User model |
| FR6-FR12 (Content) | Server Actions + Tweet model with self-relations |
| FR13-FR17 (Consumption) | Server Components + Prisma queries |
| FR18-FR23 (Social) | Server Actions + Like/Follow models with unique constraints |
| FR24-FR26 (Activity) | Activity model + Server Component page |
| FR27-FR28 (Onboarding) | Seed script + explore page |
| FR29-FR32 (Testing) | Playwright E2E with screenshot config |
| NFR1 (Password hash) | Better Auth built-in hashing |
| NFR2 (Session security) | httpOnly cookie sessions via Better Auth |
| NFR4-NFR5 (Performance) | Direct Prisma queries, no API hop |
| NFR6-NFR8 (Data integrity) | SQLite file persistence + unique constraints |
| NFR9-NFR12 (Dev experience) | `npm run dev`, zero-config SQLite, Playwright CLI |

### Implementation Readiness

**Ready for epic/story breakdown:**
- Every FR maps to a specific file location
- Data model fully defined with all relationships
- Authentication flow decided
- Component hierarchy clear
- Testing strategy concrete (Playwright + screenshots)

### Gap Analysis

No gaps identified. All 32 FRs and 12 NFRs have architectural coverage.
