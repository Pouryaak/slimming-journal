# Slimming Journal

> A focused, mobile‑first health tracker that helps you build momentum through daily and weekly check‑ins — with tasteful analytics and delightful micro‑interactions.

---

## ✨ Product Overview

Slimming Journal is a personal health journal that combines **frictionless check‑ins** with **clear trend insights**. It’s designed for quick capture on mobile, respectful nudges (optional Telegram messages), and a clean dashboard that celebrates consistency.

**Core value props**

- **Two-speed tracking**: lightweight **Daily** inputs + higher-signal **Weekly** metrics.
- **Timezone-aware** UX so “today” really means _your_ today.
- **Clarity over noise**: three focused charts (Weight, Body Fat %, Muscle Mass) over the last 3 months.
- **Fast first run**: a playful 5-step onboarding that sets units, goals, and preferences.

> **Target users**: Individuals on a weight‑management journey who want a simple, consistent, and privacy‑respecting tracker.

---

## 🧭 Feature Tour

> Add screenshots later — placeholders below use a `/docs/screenshots` folder.

1. **Home Dashboard**  
   _Greeting by local time; today’s state, quick actions, and progress context._  
   `![Screenshot: Home Dashboard](./docs/screenshots/01-dashboard.png)`

2. **Calendar Check‑ins**  
   _Month view with dual indicators (daily • and weekly •). Select a date to view/edit._  
   `![Screenshot: Calendar](./docs/screenshots/02-calendar.png)`

3. **Daily Check‑in**  
   _Calories goal vs consumed, macros, steps, water, fasting, and calories burned._  
   `![Screenshot: Daily Check-in](./docs/screenshots/03-daily-checkin.png)`

4. **Weekly Check‑in**  
   _Weight (kg), Body Fat %, Muscle Mass — purposefully lean form._  
   `![Screenshot: Weekly Check-in](./docs/screenshots/04-weekly-checkin.png)`

5. **Reports – My Progress**  
   _Three trend charts for the last 3 months with an elegant “no data yet” state._  
   `![Screenshot: Reports](./docs/screenshots/05-reports.png)`

6. **Profile & Goals**  
   _Edit personal data, unit system, week start; set goals and base calories._  
   `![Screenshot: Profile & Goals](./docs/screenshots/06-profile-goals.png)`

7. **Onboarding (First Run)**  
   _Five short steps — name; body metrics & units; goal & weekly delta; week start; TZ._  
   `![Screenshot: Onboarding](./docs/screenshots/07-onboarding.png)`

8. **Optional Notifications**  
   _Daily and weekly summaries can be sent to Telegram for a gentle nudge._  
   `![Screenshot: Telegram Summary](./docs/screenshots/08-telegram.png)`

---

## 🏗️ Architecture at a Glance

- **Framework**: Next.js (App Router) with server actions.
- **Auth & Data**: Supabase Auth + Postgres (`daily_checkins`, `weekly_checkins`, `profiles`).
- **UI**: Tailwind CSS + shadcn/ui components with a polished dark theme.
- **Charts**: Recharts (client-only) with an animated “no data” empty state.
- **State**: Primarily server data via Supabase; client forms use React Hook Form + Zod.
- **Notifications**: Telegram bot integration (opt‑in via environment variables).
- **Timezone**: All date‐sensitive logic respects the user’s configured time zone.

### Request lifecycle (example)

1. User lands on a protected dashboard route → server verifies Supabase session and profile; redirects if needed.
2. Data loaders (`getTodaysCheckin`, `getThisWeekCheckin`, `getMonthlyCheckins`) query Postgres with date ranges computed from the user’s time zone.
3. Client components render forms and charts; submit via server actions (`upsertDailyCheckin`, `upsertWeeklyCheckin`).
4. On success, server actions revalidate pages and (optionally) post a Telegram summary.

---

## 🗂️ Key Folders

```
app/                # App Router pages (auth, dashboard, reports, onboarding)
components/         # UI building blocks (check-ins, profile, reports, shared)
lib/                # server actions, data access, validation, utils, reports
public/animations/  # Lottie JSON anims for onboarding & empty states
scripts/            # seed.ts (bulk-create sample data)
```

---

## 📊 Data Model (simplified)

- **profiles**: `id (uuid)`, `name`, `unit_system`, `height`, `goal_weight_kg`, `weekly_weight_goal_kg`, `base_calories`, `time_zone`, `week_start`, `onboarded`.
- **daily_checkins**: `id`, `user_id`, `date (ISO)`, `calories_goal`, `calories_consumed`, `protein_consumed_g`, `carbs_consumed_g`, `steps`, `calories_burned`, `fasting_hours`, `water_ml`.
- **weekly_checkins**: `id`, `user_id`, `date (ISO)`, `weight_kg`, `body_fat_percentage`, `muscle_mass_kg`.

> Reports aggregate **weekly** measurements for 3‑month trend lines; daily entries contribute to adherence metrics in weekly summaries.

---

## 🔒 Security & Privacy Notes

- Auth via Supabase; protected dashboard routes ensure both **session** and **onboarded profile**.
- Server actions guard with `withUser(...)`, preventing unauthenticated writes.
- Telegram integration is **off by default** unless tokens are provided; messages contain only check‑in summaries, no secrets.
- Form data is schema‑validated with **Zod** and numeric coercion.

---

## 🌍 Timezone & Locale Handling

- "Today" and monthly ranges are computed with the user’s **`time_zone`**.
- Greetings (“Good morning/afternoon/evening”) and Telegram copy render dates in the user’s locale/time zone.

---

## 🧪 Testing Approach (suggested)

> The project is structured to be test‑friendly. Suggested coverage:

- **Server actions**: happy path + validation errors for `upsertDailyCheckin` and `upsertWeeklyCheckin` (mock Supabase client).
- **Utilities**: date range math (`getMonthDateRangeInUTC`, `getStartOfWeek`), numeric coercion helpers.
- **Components**: form validation messages, disabled/enabled submit states, and “no data” state in charts.
- **E2E (Playwright)**: sign up → onboarding → daily check‑in → weekly check‑in → reports.

Add a `/tests` folder with Jest + ts-jest for unit tests and Playwright for E2E.

---

## 🧰 Tech Stack

- **Next.js (App Router)**, **TypeScript**
- **Supabase** (Auth + Postgres)
- **Tailwind CSS**, **shadcn/ui**, **Lottie**
- **React Hook Form**, **Zod**
- **Recharts**

---

## 🚀 Getting Started

### 1) Prerequisites

- Node.js 18+
- Supabase project (local or cloud)

### 2) Clone & install

```bash
pnpm install # or npm/yarn
```

### 3) Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # needed for scripts/seed.ts
# Optional Telegram notifications
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 4) Database

Provision the following tables in Supabase (names: `profiles`, `daily_checkins`, `weekly_checkins`). Run your favorite migration approach or copy table definitions from your schema.

### 5) Run the app

```bash
pnpm dev
```

Visit `http://localhost:3000`.

### 6) Seed sample data (optional)

```bash
pnpm ts-node scripts/seed.ts
```

- Generates ~90 days of realistic daily/weekly data for a target user.

---

## 🔔 Notifications (Optional)

If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set, the app will:

- Send a **Daily** completion summary after `upsertDailyCheckin`.
- Generate and send a **Weekly** report after `upsertWeeklyCheckin`.

> Disable by removing those env vars.

---

## 🎨 UI/UX Notes

- Mobile‑first layout & navigation (bottom navbar on dashboard routes).
- Calendar exposes two distinct dots per day (daily vs weekly), carefully positioned to avoid overlap.
- Charts degrade gracefully with an animated empty state (Lottie).

---

## 🗺️ Roadmap Ideas

- Apple Health / Google Fit import
- Reminders & gentle streaks (local notifications)
- CSV export of check‑ins
- i18n (date/number formatting + copy)
- Accessibility audit (labels, focus order, landmarks, color contrast verification)

---

## 🧩 Notable Trade‑offs

- **Server Actions + Supabase** keep the stack simple but tie data access to Next.js runtime; a thin API layer could improve client reuse.
- **Recharts client‑only**: chart interactivity is great; SSR charts would need a different approach.
- **Telegram only** for notifications — kept intentionally minimal; providers can be abstracted later.

---

## 🧱 Project Structure (excerpt)

```text
app/(auth)/...
app/(dashboard)/check-in/[date]/page.tsx
app/(dashboard)/reports/page.tsx
components/dashboard/check-in/*
components/dashboard/reports/trend-chart.tsx
components/onboarding/*
lib/actions/*
lib/data/*
lib/validation/*
lib/reports.ts
lib/notifications.ts
scripts/seed.ts
```

---

## 📝 License

MIT — do what you love. Replace or restrict as needed.

---

## 🙋 FAQ

**Why two speeds (daily + weekly)?**  
Daily builds the habit; weekly creates meaningful, low‑variance trend lines.

**Will you add wearable integrations?**  
On the roadmap; designed to keep ingestion isolated from UI concerns.

**Can I run without Telegram?**  
Yes — it’s optional and off by default.

---

## 👩‍⚖️ Notes for Reviewers (Atlassian)

- The code favors **single responsibility** and **clean composition**: server actions wrap auth (`withUser`), data access and validation are isolated under `lib/`.
- **Traceability**: actions revalidate precise routes; reports encapsulate formatting and deltas in `lib/reports.ts`.
- **Maintainability**: form schemas and UI inputs are strongly typed; validation lives close to forms.
- **Reliability**: date math centralizes in `lib/utils` to avoid off‑by‑one and TZ drift.
- **Extensibility**: notifications abstracted behind tiny helpers; swapping providers is trivial.

> If you’d like a diagram, drop an issue — happy to add a C4‑style component view.
