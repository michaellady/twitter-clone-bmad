# Story 1.1: Project Scaffolding & Database Setup

Status: ready-for-dev

## Story

As a developer,
I want a working Next.js project with Prisma and SQLite configured,
so that I have a foundation to build all features on.

## Acceptance Criteria

1. Running `npm run dev` starts the Next.js app on localhost:3000
2. Prisma is configured with SQLite at `prisma/dev.db`
3. The User model exists in the Prisma schema with all required fields
4. Tailwind CSS 4.2.x and shadcn/ui are configured and working
5. Better Auth is installed and configured with credentials provider
6. TypeScript strict mode is enabled
7. Project structure matches architecture document

## Tasks / Subtasks

- [ ] Task 1: Scaffold Next.js project (AC: #1, #6)
  - [ ] Run `npx create-next-app@latest twitter-clone --typescript --tailwind --eslint --app --src-dir`
  - [ ] Verify `npm run dev` starts successfully on localhost:3000
  - [ ] Ensure `tsconfig.json` has strict mode enabled
  - [ ] Configure path aliases: `@/*` → `src/*`

- [ ] Task 2: Configure Prisma with SQLite (AC: #2, #3)
  - [ ] Install: `npm install prisma @prisma/client`
  - [ ] Run: `npx prisma init --datasource-provider sqlite`
  - [ ] Set DATABASE_URL in `.env` to `file:./dev.db`
  - [ ] Create User model in `prisma/schema.prisma`:
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
    }
    ```
  - [ ] Run `npx prisma migrate dev --name init` to create database
  - [ ] Create Prisma client singleton at `src/lib/db.ts`:
    ```typescript
    import { PrismaClient } from "@prisma/client";
    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
    export const db = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
    ```

- [ ] Task 3: Install and configure shadcn/ui (AC: #4)
  - [ ] Run: `npx shadcn@latest init`
  - [ ] Select defaults: New York style, Zinc base color
  - [ ] Install initial components: `npx shadcn@latest add button input label card`
  - [ ] Verify components render correctly in a test page

- [ ] Task 4: Install and configure Better Auth (AC: #5)
  - [ ] Install: `npm install better-auth`
  - [ ] Create auth config at `src/lib/auth.ts`:
    ```typescript
    import { betterAuth } from "better-auth";
    import { prismaAdapter } from "better-auth/adapters/prisma";
    import { db } from "./db";

    export const auth = betterAuth({
      database: prismaAdapter(db, { provider: "sqlite" }),
      emailAndPassword: { enabled: true },
    });
    ```
  - [ ] Create auth client at `src/lib/auth-client.ts`:
    ```typescript
    import { createAuthClient } from "better-auth/react";
    export const authClient = createAuthClient();
    ```
  - [ ] Generate AUTH_SECRET: add to `.env.local`
  - [ ] Create API route handler at `src/app/api/auth/[...all]/route.ts`
  - [ ] Run Better Auth migration to create session/account tables
  - [ ] Update Prisma schema if Better Auth requires additional models

- [ ] Task 5: Set up project structure (AC: #7)
  - [ ] Create directory structure:
    ```
    src/
    ├── app/
    │   ├── (auth)/
    │   ├── (main)/
    │   └── actions/
    ├── components/
    │   ├── ui/          (shadcn components go here)
    │   ├── tweet/
    │   ├── social/
    │   ├── user/
    │   ├── layout/
    │   └── activity/
    ├── lib/
    │   ├── db.ts
    │   ├── auth.ts
    │   ├── auth-client.ts
    │   ├── utils.ts
    │   └── validators.ts
    ├── middleware.ts
    └── types/
        └── index.ts
    ```
  - [ ] Create placeholder `middleware.ts` (auth protection will be added in Story 1.3)
  - [ ] Create `src/lib/validators.ts` with initial Zod install: `npm install zod`
  - [ ] Create `src/types/index.ts` for shared types
  - [ ] Add `public/default-avatar.png` placeholder image
  - [ ] Add `prisma/dev.db` to `.gitignore`
  - [ ] Add `.env.local` to `.gitignore`
  - [ ] Create `.env.example` with required env vars documented

## Dev Notes

### Architecture Compliance

- **Framework:** Next.js 16.2.x with App Router (NOT Pages Router)
- **Language:** TypeScript with strict mode
- **Database:** SQLite via Prisma 7.2.x — use `@prisma/client`, NOT raw SQL
- **Auth:** Better Auth (NOT NextAuth/Auth.js) — Better Auth absorbed Auth.js and is the recommended replacement
- **Styling:** Tailwind CSS 4.2.x — use `@import "tailwindcss"` in globals.css (v4 syntax)
- **UI:** shadcn/ui — components are copied into `src/components/ui/`, not imported from a package
- **Validation:** Zod for all runtime validation

### Critical Constraints

- **No Docker.** SQLite file-based database only.
- **No external services.** No cloud APIs, no third-party auth providers.
- **Single command startup.** `npm run dev` must start everything.
- **Desktop only.** No responsive design needed.

### Naming Conventions (from Architecture)

- Files: kebab-case (`tweet-card.tsx`, `auth-actions.ts`)
- Components: PascalCase (`TweetCard`, `ComposeForm`)
- Functions: camelCase (`createTweet`, `toggleLike`)
- DB tables: PascalCase (Prisma convention)
- DB columns: camelCase (`createdAt`, `authorId`)

### DO NOT in this story

- Do NOT create Tweet, Like, Follow, or Activity models yet — those are created in their respective epics
- Do NOT implement login/register pages — that's Story 1.2 and 1.3
- Do NOT implement auth middleware protection — that's Story 1.3
- Do NOT add seed data — that's Story 4.3

### Project Structure Notes

- Route groups `(auth)` and `(main)` are used for layout separation, not URL segments
- `src/app/actions/` holds Server Action files grouped by domain
- All data access goes through `src/lib/db.ts` Prisma singleton
- Better Auth handles session tables — let it manage its own schema

### References

- [Source: architecture.md#Technology Stack]
- [Source: architecture.md#Data Architecture]
- [Source: architecture.md#Project Structure & Boundaries]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: prd.md#Non-Functional Requirements - NFR9, NFR10, NFR11]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
