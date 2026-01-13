# Boilerplate Overview

## Next.js Landing & Waiting List Boilerplate

### 1. Overview

This boilerplate is designed as a **lightweight landing page and waiting list system** for early-stage products, communities, or events.

The primary goal is **fast launch and validation**, while still accounting for basic operational needs such as data collection, internal notifications, and simple analytics.

It focuses on clarity, speed, and extensibility rather than over-engineering.

---

### 2. Tech Stack

#### Framework & UI

**Next.js (App Router)**
Pages, server logic, and APIs are managed within a single project.
The App Router and Server Components are used to ensure good initial performance and future scalability.

**Tailwind CSS**
Utility-first styling enables rapid UI development and consistent design across the project.

**shadcn/ui**
Headless UI components built on Radix.
Provides accessibility by default while remaining fully customizable.

---

#### Forms & Validation

**React Hook Form**
Handles form state efficiently with minimal re-renders, optimized for performance.

**Zod**
Schema-based validation shared between frontend and server.
Ensures a single source of truth for input validation rules.

---

#### Data & Backend

**Supabase**
PostgreSQL-based backend used primarily for storing waiting list submissions.
Authentication is intentionally omitted in the initial phase, keeping the setup simple while allowing future expansion.

---

#### CMS

**Sanity**
Headless CMS used to manage event or meetup content such as titles, descriptions, schedules, and images.
Allows non-developers to update content without code changes.

---

#### Notifications

**Discord Webhook**
Triggers internal notifications whenever a new waiting list submission is received.
Chosen for speed and simplicity during early operations.

---

#### Analytics

**PostHog**
Event-based analytics to track user behavior across the landing page.
Key events include page visits, event clicks, and waiting list submissions.

---

#### Deployment

**Vercel**
Used for deploying the Next.js application.
Supports fast iteration with preview environments and clear separation between production and staging.

---

### 3. Operational Considerations

This boilerplate goes beyond UI and accounts for real-world operational needs:

**Environment Variable Management**
Server-only secrets and client-exposed keys are clearly separated.
Missing required environment variables trigger immediate errors.

**Spam Prevention (Lightweight)**
Duplicate email prevention
Honeypot fields for basic bot protection
Simple rate limiting on submissions

**Observability**
Both successful and failed submissions are tracked as events.
UTM parameters and event-level interest can be analyzed per meetup or campaign.

---

### 4. Lightweight Admin Access

Instead of a full admin dashboard, the boilerplate assumes a **minimal admin view** for early-stage operation:

* View recent waiting list submissions
* Basic filtering by event
* Server-side data access only
* Simple access control (Basic Auth or single-token access)

The goal is to let operators quickly answer one question:
**“What is coming in right now?”**

---

This boilerplate is intended to be opinionated but flexible — optimized for teams that want to ship early, learn fast, and evolve their system incrementally.
