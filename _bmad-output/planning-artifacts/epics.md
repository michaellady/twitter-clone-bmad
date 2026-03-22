---
stepsCompleted: [step-01, step-02, step-03, step-04]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
workflow_completed: true
---

# twitter-clone - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for twitter-clone, decomposing the requirements from the PRD and Architecture into implementable stories with BDD acceptance criteria tied to personas (Jamie, Alex, Morgan).

## Requirements Inventory

### Functional Requirements

- FR1: Users can register with email and password
- FR2: Users can log in with email and password
- FR3: Users can log out
- FR4: Users can view their own profile (avatar, bio, tweet list)
- FR5: Users can view other users' profiles (avatar, bio, tweet list)
- FR6: Users can compose a tweet up to 280 characters
- FR7: Users can see a live character counter while composing
- FR8: Users cannot submit a tweet exceeding 280 characters
- FR9: Users can post a tweet that appears immediately in their profile tweet list
- FR10: Users can reply to any tweet
- FR11: Users can reply to their own tweets to create threads
- FR12: Users can quote retweet another user's tweet (new tweet embedding the original)
- FR13: Users can view a chronological timeline of tweets from users they follow
- FR14: Users can view an explore page showing recent public tweets regardless of follow status
- FR15: Users can view a tweet's full reply thread with nested replies
- FR16: Users can navigate from a tweet to the author's profile
- FR17: Logged-out visitors can view the explore page with public tweets
- FR18: Users can follow other users
- FR19: Users can unfollow other users
- FR20: Users can like a tweet
- FR21: Users can unlike a tweet they previously liked
- FR22: Users can see like counts on tweets
- FR23: Users can see reply counts on tweets
- FR24: Users can view an activity feed showing individual engagement events on their own tweets, including who performed each action (likes, replies, quote retweets)
- FR25: Like counts persist across page refreshes
- FR26: Reply counts persist across page refreshes
- FR27: New users see suggested accounts to follow on first login
- FR28: The app includes seed data (pre-populated users and tweets) so the experience feels alive on first run
- FR29: All must-build features have E2E tests with screenshot capture
- FR30: All acceptance criteria are written as BDD stories tied to personas
- FR31: E2E test suite can be run with a single command
- FR32: Users see clear error messages when performing invalid actions

### Non-Functional Requirements

- NFR1: Passwords are hashed using an industry-standard one-way hash algorithm before storage
- NFR2: Session tokens are not accessible to client-side JavaScript
- NFR3: Users cannot access other users' activity feeds
- NFR4: Timeline loads within 2 seconds for up to 50 seed-data users on localhost
- NFR5: Tweet submission completes within 500ms on localhost
- NFR6: Tweets, likes, and follows persist across app restarts
- NFR7: A user cannot like the same tweet more than once
- NFR8: A user cannot follow the same user more than once
- NFR9: The app starts with a single command
- NFR10: No external service dependencies
- NFR11: SQLite database with zero configuration
- NFR12: E2E test suite runs with a single command and produces screenshot artifacts

### Additional Requirements

- Architecture specifies Next.js 16 App Router with Server Actions
- Prisma 7.2.x ORM with SQLite adapter
- Better Auth for authentication with database sessions
- Tailwind CSS 4.2.x + shadcn/ui for UI
- Zod for validation
- Playwright for E2E testing with screenshots
- Project scaffolding from `create-next-app` with TypeScript

### UX Design Requirements

N/A — No UX design document was created for this project.

### FR Coverage Map

- FR1: Epic 1 - User Registration
- FR2: Epic 1 - User Login
- FR3: Epic 1 - User Logout
- FR4: Epic 4 - View Own Profile
- FR5: Epic 4 - View Other Profiles
- FR6: Epic 2 - Compose Tweet
- FR7: Epic 2 - Character Counter
- FR8: Epic 2 - Character Limit Validation
- FR9: Epic 2 - Post Tweet
- FR10: Epic 2 - Reply to Tweet
- FR11: Epic 2 - Self-Reply Threading
- FR12: Epic 2 - Quote Retweet
- FR13: Epic 3 - Chronological Timeline
- FR14: Epic 4 - Explore Page
- FR15: Epic 5 - Reply Thread View
- FR16: Epic 4 - Navigate to Profile
- FR17: Epic 4 - Logged-Out Explore
- FR18: Epic 3 - Follow User
- FR19: Epic 3 - Unfollow User
- FR20: Epic 3 - Like Tweet
- FR21: Epic 3 - Unlike Tweet
- FR22: Epic 3 - Like Counts
- FR23: Epic 3 - Reply Counts
- FR24: Epic 5 - Activity Feed
- FR25: Epic 3 - Like Count Persistence
- FR26: Epic 3 - Reply Count Persistence
- FR27: Epic 4 - Suggested Accounts
- FR28: Epic 4 - Seed Data
- FR29: Epic 6 - E2E Tests
- FR30: Epic 6 - BDD Stories
- FR31: Epic 6 - Single Command Tests
- FR32: Epic 2 - Error Messages

## Epic List

### Epic 1: User Authentication
Users can register, log in, and log out. Establishes the identity foundation for all other features.
**FRs covered:** FR1, FR2, FR3
**NFRs addressed:** NFR1, NFR2, NFR9, NFR10, NFR11

### Epic 2: Tweet Creation & Interaction
Users can compose tweets, reply to tweets, create threads, and quote retweet. The core content creation loop.
**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR32

### Epic 3: Social Graph & Timeline
Users can follow/unfollow others, like/unlike tweets, and view a chronological timeline. The social interaction layer.
**FRs covered:** FR13, FR18, FR19, FR20, FR21, FR22, FR23, FR25, FR26
**NFRs addressed:** NFR4, NFR6, NFR7, NFR8

### Epic 4: Discovery, Profiles & Onboarding
Users can browse profiles, explore public content, discover accounts, and get started with seed data.
**FRs covered:** FR4, FR5, FR14, FR16, FR17, FR27, FR28
**NFRs addressed:** NFR5

### Epic 5: Activity Feed & Thread Navigation
Users can view engagement on their tweets and navigate full reply threads.
**FRs covered:** FR15, FR24
**NFRs addressed:** NFR3

### Epic 6: E2E Testing & Verification
Automated E2E test suite with screenshots covering all features and BDD acceptance criteria.
**FRs covered:** FR29, FR30, FR31
**NFRs addressed:** NFR12

---

## Epic 1: User Authentication

Users can register with email and password, log in, and log out. This epic establishes the identity system that all other features depend on. Includes project scaffolding, database setup, and auth configuration.

### Story 1.1: Project Scaffolding & Database Setup

As a developer,
I want a working Next.js project with Prisma and SQLite configured,
So that I have a foundation to build features on.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** I run `npm run dev`
**Then** the Next.js app starts on localhost:3000
**And** Prisma is configured with SQLite at `prisma/dev.db`
**And** the User model exists in the Prisma schema with id, email, passwordHash, name, bio, avatarUrl, createdAt, updatedAt
**And** Tailwind CSS and shadcn/ui are configured
**And** Better Auth is installed and configured with credentials provider

### Story 1.2: User Registration

As Jamie (new user),
I want to register with my email and password,
So that I can create an account and start using the app.

**Acceptance Criteria:**

**Given** Jamie is on the registration page
**When** Jamie enters a valid email, password, and display name
**Then** a new account is created with a hashed password
**And** Jamie is automatically logged in and redirected to the home page

**Given** Jamie tries to register with an email already in use
**When** Jamie submits the registration form
**Then** Jamie sees a clear error message: "Email already in use"
**And** no duplicate account is created

**Given** Jamie tries to register with an empty email or password
**When** Jamie submits the registration form
**Then** Jamie sees validation errors on the required fields

### Story 1.3: User Login

As Alex (returning user),
I want to log in with my email and password,
So that I can access my account and start posting.

**Acceptance Criteria:**

**Given** Alex has a registered account
**When** Alex enters their correct email and password on the login page
**Then** Alex is authenticated and redirected to the home page
**And** a session is created with an httpOnly cookie

**Given** Alex enters an incorrect password
**When** Alex submits the login form
**Then** Alex sees a clear error message: "Invalid credentials"
**And** no session is created

**Given** Alex is not logged in
**When** Alex tries to access a protected page (home, activity, compose)
**Then** Alex is redirected to the login page

### Story 1.4: User Logout

As Morgan (active user),
I want to log out of my account,
So that my session is ended securely.

**Acceptance Criteria:**

**Given** Morgan is logged in
**When** Morgan clicks the logout button
**Then** the session is destroyed
**And** Morgan is redirected to the login page
**And** Morgan cannot access protected pages without logging in again

---

## Epic 2: Tweet Creation & Interaction

Users can compose and post tweets with a 280-character limit and live counter, reply to tweets, create threads via self-reply, and quote retweet other users' tweets.

### Story 2.1: Compose & Post Tweet

As Alex (poster),
I want to compose and post a tweet up to 280 characters,
So that I can share my thoughts with others.

**Acceptance Criteria:**

**Given** Alex is logged in and on the compose form
**When** Alex types a message under 280 characters
**Then** a live character counter shows remaining characters
**And** the counter updates in real-time as Alex types

**Given** Alex has typed a valid tweet (1-280 characters)
**When** Alex clicks the post button
**Then** the tweet is saved to the database
**And** the tweet appears in Alex's profile tweet list
**And** the compose form is cleared

**Given** Alex has typed exactly 280 characters
**When** Alex tries to type another character
**Then** the input does not accept additional characters
**And** the counter shows 0 remaining

**Given** Alex has typed 0 characters
**When** Alex tries to submit
**Then** the post button is disabled
**And** Alex cannot submit an empty tweet

### Story 2.2: Reply to Tweet

As Alex (poster),
I want to reply to another user's tweet,
So that I can engage in conversation.

**Acceptance Criteria:**

**Given** Alex is viewing a tweet by another user
**When** Alex clicks the reply button and types a reply (1-280 chars)
**Then** a reply compose form appears with the same 280-char limit and counter
**And** the reply is saved with a reference to the parent tweet

**Given** Alex has posted a reply
**When** anyone views the parent tweet
**Then** the reply count on the parent tweet is incremented
**And** Alex's reply appears in the reply thread

### Story 2.3: Self-Reply Threading

As Morgan (power user),
I want to reply to my own tweet,
So that I can create a thread of connected thoughts.

**Acceptance Criteria:**

**Given** Morgan has posted a tweet
**When** Morgan replies to their own tweet
**Then** the reply is saved as a child of Morgan's original tweet
**And** the thread is navigable (original → reply → reply-to-reply)

**Given** Morgan has created a 3-tweet thread
**When** anyone views the thread
**Then** all tweets in the thread are displayed in chronological order with clear parent-child relationships

### Story 2.4: Quote Retweet

As Alex (poster),
I want to quote retweet another user's tweet with my own commentary,
So that I can share their tweet while adding my perspective.

**Acceptance Criteria:**

**Given** Alex is viewing a tweet by another user
**When** Alex clicks the quote retweet button and adds commentary (1-280 chars)
**Then** a new tweet is created that embeds the original tweet
**And** the quote tweet appears in Alex's profile tweet list

**Given** anyone views Alex's quote tweet
**When** the tweet is displayed
**Then** the original embedded tweet is visible within Alex's tweet
**And** the original tweet's author and content are shown

---

## Epic 3: Social Graph & Timeline

Users can follow and unfollow other users, like and unlike tweets, see engagement counts, and view a chronological timeline of tweets from followed users.

### Story 3.1: Follow & Unfollow Users

As Jamie (lurker),
I want to follow and unfollow users,
So that I can curate the content I see in my timeline.

**Acceptance Criteria:**

**Given** Jamie is viewing another user's profile
**When** Jamie clicks the follow button
**Then** Jamie is now following that user
**And** the button changes to "Unfollow"

**Given** Jamie is following a user
**When** Jamie clicks the unfollow button
**Then** Jamie is no longer following that user
**And** the button changes to "Follow"

**Given** Jamie already follows a user
**When** Jamie tries to follow them again
**Then** the follow state is unchanged (idempotent)
**And** no duplicate follow record is created (NFR8)

### Story 3.2: Like & Unlike Tweets

As Alex (poster),
I want to like and unlike tweets,
So that I can show appreciation for content.

**Acceptance Criteria:**

**Given** Alex is viewing a tweet they haven't liked
**When** Alex clicks the like button
**Then** the like count increments by 1
**And** the like button shows a "liked" state

**Given** Alex has liked a tweet
**When** Alex clicks the like button again
**Then** the like count decrements by 1
**And** the like button returns to the "unliked" state

**Given** Alex likes a tweet and refreshes the page
**When** the page reloads
**Then** the like count persists at the correct value (FR25)
**And** Alex's like state is preserved

**Given** Alex tries to like the same tweet twice via rapid clicking
**When** the server processes the requests
**Then** only one like record exists (NFR7)

### Story 3.3: Engagement Counts Display

As Jamie (lurker),
I want to see like and reply counts on every tweet,
So that I can gauge the engagement level.

**Acceptance Criteria:**

**Given** Jamie is viewing any tweet in any context (timeline, explore, profile, thread)
**When** the tweet is displayed
**Then** the like count is visible (FR22)
**And** the reply count is visible (FR23)
**And** counts persist across page refreshes (FR25, FR26)

### Story 3.4: Chronological Timeline

As Morgan (power user),
I want to view a chronological timeline of tweets from users I follow,
So that I can catch up on everything since my last visit.

**Acceptance Criteria:**

**Given** Morgan follows multiple users who have posted tweets
**When** Morgan visits the home/timeline page
**Then** tweets from followed users appear in reverse chronological order (newest first)
**And** Morgan's own tweets do NOT appear in the timeline (only followed users)

**Given** Morgan follows no one
**When** Morgan visits the timeline
**Then** the timeline is empty with a message suggesting to explore or follow users

**Given** Morgan's timeline has many tweets
**When** the page loads
**Then** the timeline loads within 2 seconds (NFR4)

---

## Epic 4: Discovery, Profiles & Onboarding

Users can view profiles, browse the explore page (including when logged out), discover accounts to follow, and the app ships with seed data.

### Story 4.1: User Profiles

As Jamie (lurker),
I want to view user profiles showing their avatar, bio, and tweets,
So that I can learn about users before following them.

**Acceptance Criteria:**

**Given** Jamie clicks on a user's name or avatar anywhere in the app
**When** the profile page loads
**Then** the user's avatar, bio, and tweet list are displayed (FR4, FR5)
**And** tweets are in reverse chronological order

**Given** Jamie views a user with zero tweets
**When** the profile page loads
**Then** the profile displays correctly with an empty tweet list message

**Given** Jamie views their own profile
**When** the profile page loads
**Then** Jamie sees their own avatar, bio, and tweet list

### Story 4.2: Explore Page

As Jamie (lurker),
I want to browse an explore page showing recent public tweets,
So that I can discover content without following anyone.

**Acceptance Criteria:**

**Given** Jamie is logged in and has no follows
**When** Jamie visits the explore page
**Then** recent public tweets are displayed in reverse chronological order (FR14)
**And** tweets from all users are visible regardless of follow status

**Given** a visitor is not logged in
**When** they visit the app
**Then** they see the explore page with public tweets (FR17)
**And** they see a sign-up/login call-to-action

### Story 4.3: Seed Data

As Jamie (new user opening the app for the first time),
I want to see pre-populated content,
So that the app feels alive and I have content to engage with.

**Acceptance Criteria:**

**Given** the database has been set up for the first time
**When** the seed script runs (`npx prisma db seed`)
**Then** at least 10 users are created with names, bios, and avatars
**And** at least 30 tweets exist across those users
**And** some tweets have replies forming threads
**And** some users follow other users
**And** some tweets have likes
**And** the explore page feels populated

### Story 4.4: Onboarding Suggested Accounts

As Jamie (first-time user),
I want to see suggested accounts to follow after registration,
So that I can quickly build a feed with interesting content.

**Acceptance Criteria:**

**Given** Jamie has just registered and logged in for the first time
**When** Jamie visits the home page
**Then** Jamie sees a list of suggested users to follow (from seed data) (FR27)
**And** Jamie can follow users directly from the suggestions
**And** after following users, their tweets appear in Jamie's timeline

---

## Epic 5: Activity Feed & Thread Navigation

Users can view a detailed activity feed showing who engaged with their tweets, and navigate full reply threads.

### Story 5.1: Reply Thread View

As Morgan (power user),
I want to view a tweet's full reply thread with nested replies,
So that I can follow the entire conversation.

**Acceptance Criteria:**

**Given** Morgan clicks on a tweet that has replies
**When** the tweet detail page loads
**Then** the original tweet is displayed at the top
**And** all replies are displayed below in chronological order
**And** nested replies (replies to replies) show clear parent-child relationships (FR15)

**Given** Morgan is viewing a reply in a thread
**When** Morgan clicks on the author's name
**Then** Morgan is navigated to that user's profile (FR16)

### Story 5.2: Activity Feed

As Alex (poster),
I want to view an activity feed showing who liked, replied to, or quote-retweeted my tweets,
So that I can see my engagement and respond to interactions.

**Acceptance Criteria:**

**Given** Alex has tweets that received engagement
**When** Alex visits the activity page
**Then** Alex sees individual engagement events in reverse chronological order
**And** each event shows WHO performed the action (user name + avatar) (FR24)
**And** each event shows WHAT action was performed (liked, replied, quote retweeted)
**And** each event shows WHICH tweet was engaged with

**Given** another user likes Alex's tweet
**When** Alex visits the activity page
**Then** Alex sees "[User] liked your tweet: [tweet preview]"

**Given** Morgan visits the activity page
**When** the page loads
**Then** Morgan sees only engagement on their OWN tweets (NFR3)
**And** Morgan cannot see other users' activity feeds

---

## Epic 6: E2E Testing & Verification

Automated Playwright E2E test suite covering all features with screenshot capture and BDD acceptance criteria.

### Story 6.1: Playwright Setup & Auth Tests

As Mikelady (framework evaluator),
I want E2E tests for authentication flows with screenshots,
So that I can verify auth works without manual testing.

**Acceptance Criteria:**

**Given** Playwright is configured in the project
**When** I run `npx playwright test`
**Then** all E2E tests execute against the running app
**And** screenshots are captured on test failure (NFR12)

**Given** the auth test suite runs
**When** tests execute
**Then** registration flow is tested (register → auto-login → see home)
**And** login flow is tested (login → see home)
**And** logout flow is tested (logout → redirected to login)
**And** invalid credentials show error messages

### Story 6.2: Content & Social E2E Tests

As Mikelady (framework evaluator),
I want E2E tests for tweet creation, replies, likes, and follows,
So that I can verify the core loop works without manual testing.

**Acceptance Criteria:**

**Given** an authenticated test user
**When** content tests run
**Then** tweet composition with character counter is tested
**And** reply to tweet is tested
**And** quote retweet is tested
**And** like/unlike toggle is tested
**And** follow/unfollow toggle is tested
**And** chronological timeline displays correctly

### Story 6.3: Discovery & Activity E2E Tests

As Mikelady (framework evaluator),
I want E2E tests for explore page, profiles, activity feed, and thread view,
So that I can verify all features pass without manual intervention.

**Acceptance Criteria:**

**Given** seed data exists in the database
**When** discovery tests run
**Then** explore page shows public tweets (logged in and logged out)
**And** user profiles display avatar, bio, and tweet list
**And** reply thread view shows nested conversations
**And** activity feed shows engagement events with "who" detail
**And** suggested accounts appear for new users
**And** all tests produce screenshots on failure (FR29)
**And** test suite runs with a single command: `npx playwright test` (FR31)
