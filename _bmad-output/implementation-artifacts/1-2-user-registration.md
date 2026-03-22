# Story 1.2: User Registration

Status: ready-for-dev

## Story

As Jamie (new user),
I want to register with my email and password,
so that I can create an account and start using the app.

## Acceptance Criteria

1. Given Jamie is on the registration page, When Jamie enters a valid email, password, and display name, Then a new account is created with a hashed password and Jamie is automatically logged in and redirected to the home page
2. Given Jamie tries to register with an email already in use, When Jamie submits the registration form, Then Jamie sees a clear error message: "Email already in use" and no duplicate account is created
3. Given Jamie tries to register with an empty email or password, When Jamie submits the registration form, Then Jamie sees validation errors on the required fields

## Tasks / Subtasks

- [ ] Task 1: Create registration page UI (AC: #1, #3)
  - [ ] Create `src/app/(auth)/register/page.tsx` as a Client Component
  - [ ] Build form with: name, email, password fields using shadcn/ui Input, Label, Button, Card
  - [ ] Add client-side Zod validation using `registerSchema` from `src/lib/validators.ts`
  - [ ] Show inline validation errors for empty/invalid fields
  - [ ] Add link to login page: "Already have an account? Log in"

- [ ] Task 2: Implement registration Server Action (AC: #1, #2)
  - [ ] Create `src/app/actions/auth-actions.ts`
  - [ ] Implement `register` action that calls Better Auth's `signUp.email` API
  - [ ] Handle duplicate email error and return `{ success: false, error: "Email already in use" }`
  - [ ] On success, auto-login by calling Better Auth's `signIn.email` and redirect to `/home`

- [ ] Task 3: Wire up form submission (AC: #1, #2, #3)
  - [ ] Connect form to registration action using Better Auth client `authClient.signUp.email`
  - [ ] Show server-side errors (duplicate email) in the form
  - [ ] Show loading state during submission using `useTransition` or Better Auth's built-in loading
  - [ ] Redirect to `/home` on successful registration

- [ ] Task 4: Create minimal home page placeholder (AC: #1)
  - [ ] Create `src/app/(main)/home/page.tsx` with placeholder content: "Welcome to twitter-clone"
  - [ ] Create `src/app/(main)/layout.tsx` with minimal authenticated layout shell

## Dev Notes

### Architecture Compliance
- Registration page is a Client Component (`"use client"`) in `src/app/(auth)/register/`
- Better Auth handles password hashing internally — do NOT manually hash passwords
- Better Auth stores credentials in the `Account` model with `providerId: "credential"` and `password` field
- Use `authClient.signUp.email()` from `src/lib/auth-client.ts` for client-side registration
- Zod validation on client side for instant feedback, Better Auth validates on server side

### Better Auth Registration Flow
```
Client: authClient.signUp.email({ email, password, name })
  → POST /api/auth/sign-up/email
  → Better Auth creates User + Account records
  → Better Auth creates Session + sets httpOnly cookie
  → Client redirects to /home
```

### Error Handling Pattern
- Client-side: Zod validates form before submission
- Server-side: Better Auth returns error for duplicate email
- Display errors inline below the form, not as toasts (FR32)

### Files to Create/Modify
- CREATE: `src/app/(auth)/register/page.tsx`
- CREATE: `src/app/(auth)/layout.tsx` (minimal auth layout)
- CREATE: `src/app/actions/auth-actions.ts`
- CREATE: `src/app/(main)/home/page.tsx` (placeholder)
- CREATE: `src/app/(main)/layout.tsx` (placeholder authenticated layout)

### DO NOT
- Do NOT implement login page — that's Story 1.3
- Do NOT implement auth middleware/route protection — that's Story 1.3
- Do NOT create Tweet or other models — those are later epics
- Do NOT manually hash passwords — Better Auth handles this

### References
- [Source: architecture.md#Authentication & Security]
- [Source: architecture.md#Frontend Architecture]
- [Source: prd.md#FR1, FR32]
- [Source: epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
