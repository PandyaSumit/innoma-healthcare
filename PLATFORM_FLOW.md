# Innoma Healthcare — Platform Architecture & Flow Specification

> This document describes every user role, every journey, every screen, every action, and every data entity on the Innoma Healthcare platform. It is intended to be given directly to an AI system (or engineering team) as the definitive source of truth for generating a backend architecture, database schema, API design, or system design.

---

## 1. Platform Overview

Innoma Healthcare is a telehealth platform that connects patients with licensed therapists for mental health support. The platform operates across three distinct roles — **Patient**, **Therapist**, and **Admin** — each with a completely separate experience, dashboard, and permission scope.

The platform handles end-to-end mental healthcare delivery:
- Acquiring new patients through a public-facing marketing site
- Onboarding patients through registration and free assessments
- Connecting patients with therapists through a searchable directory
- Managing appointment booking, payment, and scheduling
- Delivering therapy sessions via video consultation
- Tracking session history, notes, and patient progress
- Supporting patients and therapists through a helpdesk system
- Allowing admins to manage the entire platform from a protected panel

---

## 2. Technical Stack Context

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4, React Router v7
- **State:** React Context (auth, booking), React Query v5 (server state)
- **Auth:** JWT — `accessToken` (short-lived) + `refreshToken` (long-lived), stored in `localStorage`
- **Storage keys:** `accessToken`, `refreshToken`, `authUser`
- **Notifications:** `sonner` toast library (top-right)
- **API base:** `http://localhost:5000/api`
- **Payments:** Razorpay (payment gateway integration, currently simulated)
- **Video:** Google Meet / Zoom meeting link injection (generated on booking, activated 15 minutes before appointment)
- **Scheduling:** TidyCal API integration for therapist availability

---

## 3. Roles & Permissions

| Role | Description | Home Route | Access Scope |
|---|---|---|---|
| `patient` | Registered end user seeking therapy | `/dashboard` | Own profile, therapist directory, own appointments, support |
| `therapist` | Licensed mental health professional | `/dashboard` | Own schedule, patient list, session history, settings |
| `admin` | Platform operator | `/admin` | Everything — all users, all therapists, finance, content, support |

- **Route protection:** All authenticated routes redirect unauthenticated users to `/login` with `state.from` preserved for post-login redirect.
- **Role guard:** Admin routes reject non-admin users with a 403 `/unauthorized` page.
- **Public-only routes:** `/login` and `/signup` redirect already-authenticated users to their role-based home.

---

## 4. Authentication System

### 4.1 Registration Flow (Patient Only)

Registration is a **3-step wizard** at `/signup`.

**Step 1 — Identity**
- Fields: Full Legal Name (`fullName`), Clinical Email (`email`)
- Validation: name required, email required + valid format
- On "Initiate Intake": validates step 1, advances to step 2

**Step 2 — Clinical Profile**
- Fields: Date of Birth (`dob`), Gender/Identity (`gender`: Male / Female / Other), Occupation (`occupation`: Student / Employment / Other)
- On "Continue": validates step 2, advances to step 3

**Step 3 — Credentials**
- Fields: Secure Password (`password`, min 8 chars), Confirm Security (`confirmPassword`, must match)
- On "Complete Intake": submits full payload to `POST /auth/register`
- API payload: `{ fullName, email, password, dob, gender, occupation, role: "patient" }`
- On **409 Conflict**: show inline error "An account with this email already exists" — user stays on step 1
- On success: navigate to `/dashboard`

**Visual design:** Left panel with animated background blobs, testimonial quotes, encryption badge. Right panel has 3-dot progress indicator.

---

### 4.2 Login Flow

Login page at `/login`. Single-step form.

**Fields:** Email address, Password, "Remember me" checkbox (controls token expiry: 1 day vs 30 days)

**Forgot Password link:** Links to `/forgot-password` (separate page, not inline)

**On submit:** `POST /auth/login` with `{ email, password, rememberMe }`
- Response: `{ accessToken, refreshToken, user: { id, email, role, name, avatar } }`
- Tokens stored in `localStorage` under `accessToken` and `refreshToken`
- User stored as JSON under `authUser`
- Role-based redirect:
  - `role === "admin"` → `/admin`
  - `role === "therapist"` → `/dashboard` (renders TherapistDashboard)
  - `role === "patient"` → `/dashboard` (renders patient Dashboard)
  - If coming from a protected route: redirects back to `location.state.from`
- On error: inline red error banner below header

---

### 4.3 Forgot Password Flow

At `/forgot-password`.

- Single email input field
- On submit: `POST /auth/forgot-password` with `{ email }`
- Backend sends reset link (email delivery is backend responsibility)
- Frontend shows success state: green box, "Reset link sent!" regardless of whether email exists (prevents user enumeration)
- Back link → `/login`

---

### 4.4 Reset Password Flow

At `/reset-password?token=<jwt_token>`.

- Reads `token` from URL query string
- If no token present: shows "invalid link" error with link back to `/forgot-password`
- Fields: New Password (min 8 chars), Confirm Password (must match)
- On submit: `POST /auth/reset-password` with `{ token, newPassword }`
- On success: redirects to `/login`

---

### 4.5 Token Lifecycle

- **Access token:** Short-lived (15–60 min). Attached as `Authorization: Bearer <token>` on every API request via Axios request interceptor.
- **Refresh token:** Long-lived (30 days). Used to silently renew access tokens.
- **Auto-refresh:** On 401 response, Axios interceptor calls `POST /auth/refresh` with `{ refreshToken }`. Concurrent 401s are queued and drained after a single refresh. On refresh failure, auth storage is cleared and user is redirected to `/login` with "Session expired" toast.
- **Logout suppression flag (`setLoggingOut`):** Prevents "session expired" toast from firing during deliberate logout. Set to `true` before `POST /auth/logout`, reset in `finally`.
- **Logout:** `POST /auth/logout` with `{ refreshToken }`, then clear localStorage keys `accessToken`, `refreshToken`, `authUser`.

---

## 5. Public-Facing Website

### 5.1 Landing Page (`/`)

The public marketing page. No auth required. Accessible to everyone.

**Sections (in order):**
1. **HeroBanner** — Headline tagline, CTA buttons ("Get Started", "Explore Therapists"), animated background
2. **ApproachSection** — 3–4 pillar cards explaining Innoma's clinical methodology (evidence-based, private, professional)
3. **TraumaExplanation** — Educational content about trauma, anxiety, depression; builds trust
4. **TherapistsCarousel** — Horizontal scroll of featured therapist cards (photo, name, specialization, rating, fee)
5. **SymptomsGrid** — Grid of treatable conditions (anxiety, depression, PTSD, OCD, relationship issues, burnout, etc.)
6. **OffersSection** — Pricing tiers with feature lists; CTA "Book a Session"
7. **LeadForm** — Email capture / early registration form: Full name, Email, Phone (optional), Area of concern dropdown. On submit: API or CRM capture
8. **FAQSection** — 6–8 expandable FAQ items about process, privacy, cancellation

**Navigation (Header):**
- Logo
- Nav links: About, How It Works, Therapists, Pricing (all anchor/page links)
- "Sign In" link → `/login`
- "Get Started" button → `/signup`

**Footer:**
- Links: Privacy Policy, Terms of Service, About, Contact
- Social media links
- Copyright

---

### 5.2 About Page (`/about`)

Static content about the company mission, clinical team, founding story, values. No auth required.

---

### 5.3 How It Works Page (`/how-it-works`)

Step-by-step explanation of the therapy journey: Register → Assessment → Match → Session → Progress. Infographic-style.

---

### 5.4 Therapist Directory — Public (`/therapists`)

Public-facing therapist listing. Accessible without login. Patients can browse but must be logged in to book.

**Search and filter:**
- **Text search:** Full-text search across therapist name, specialization, bio
- **Specialization filter:** Dropdown of all specialization tags (Anxiety, Depression, PTSD, CBT, DBT, etc.)
- **Language filter:** Multi-select (English, Hindi, Bengali, Tamil, Telugu, etc.)
- **Fee range:** Slider from ₹0 to ₹10,000 per session
- **Minimum rating:** Radio buttons (Any, 4+, 4.5+)
- **Sort:** Relevance (default), Rating (high to low), Fee (low to high), Fee (high to low)
- **Results count:** "Showing 12 of 45 therapists"
- **Clear filters** button

**Therapist card shows:**
- Profile photo (circular)
- Full name + credentials (e.g., M.Sc Psychology, Ph.D)
- Star rating (X.X) + review count
- Specialization tags (3–4 shown, "+ N more" if overflow)
- Languages spoken
- Consultation fee (₹X,XXX / session)
- Years of experience + patients helped count
- Availability status badge (e.g., "Available this week")
- Gender
- "Book appointment" button → redirects to login if not authenticated, or to `/book/:therapistId` if logged in

**Pagination or infinite scroll** on the listing.

---

### 5.5 Therapist Profile — Public (`/therapists/:id`)

Detailed profile page for a single therapist.

**Header section:**
- Large profile photo
- Name, credentials
- Star rating + review count (clickable to reviews section)
- Experience (X years), Patients helped (X+)
- Gender
- Availability badge (e.g., "Available Monday–Friday, 9 AM – 6 PM")
- Response time (e.g., "Usually responds within 2 hours")

**About section:**
- Detailed bio paragraph

**Approach section:**
- How they conduct therapy, their methodology

**Specializations:**
- Tag list of all areas they work with

**Languages:**
- Tag list

**Sidebar / Booking Panel:**
- Fee display
- Session type (Video Consultation)
- Duration (50 minutes)
- "Book appointment" CTA → `/book/:therapistId`
- "Free assessment" CTA → `/assessment`
- "Contact support" link → `/support`

**Favorites:**
- Heart icon toggle (saved to localStorage; future: synced to backend)

---

### 5.6 Leader Profile (`/leaders/:id`)

Static page profiling company leadership (founders, clinical directors). No booking CTA.

---

## 6. Patient Journey (Detailed)

### 6.1 Patient Dashboard (`/dashboard` — patient view)

After login, patient's primary home screen.

**Welcome section:**
- "Good morning/afternoon/evening, [First Name]" (time-based greeting)

**Stats row (3 cards):**
- **Next Session:** Date and time of the upcoming appointment (or "No upcoming sessions")
- **Upcoming:** Count of future appointments
- **Total Sessions:** All-time completed sessions count

**Upcoming sessions list (max 3 items):**
Each item shows:
- Therapist circular photo
- Therapist name
- Therapist specialization
- Session date and time (formatted as "Monday, 10 March · 2:30 PM")
- Session duration (50 min)
- "Join Session" button (green, active 15 min before appointment, links to `/join/:appointmentId`)
- If no upcoming: empty state with "Find a Therapist" CTA

**"View all" link** → `/appointments`

**Care Journey Progress Tracker (3 steps):**
1. ✅ Initial Assessment — Marked complete if user has done a free assessment
2. ✅ Therapist Matched — Marked complete if user has at least 1 booked appointment
3. ✅ First Session — Marked complete if user has at least 1 completed session
Each step shows icon + label + completion status

**Free Assessment promotion card** (shown to users without a completed assessment):
- Headline: "Start with a Free Assessment"
- Description: "Speak with our care team to understand your needs"
- "Claim Free Assessment" button → `/assessment`

---

### 6.2 Find a Therapist (Logged-in, `/find-therapist`)

Same UI as the public `/therapists` page but rendered inside `AppLayout` (with sidebar). All filter and search features are identical. "Book appointment" now goes directly to booking without auth check.

---

### 6.3 Appointment Booking — Step 1 & 2 (`/book/:therapistId`)

Multi-step flow. Therapist ID is from the URL. Therapist data is fetched from `GET /therapists/:id`.

**Progress bar:** Step 1 (Select Package) → Step 2 (Date & Time) → Step 3 (Payment, on next page)

**Step 1: Package Selection**

Three packages displayed as selectable radio cards:

| Package | Price | Sessions | Per Session | Details |
|---|---|---|---|---|
| Single Session | ₹1,999 | 1 | ₹1,999 | Pay as you go, no commitment |
| Starter Package | ₹4,999/month | 4 | ₹1,250 | Best value for short-term needs |
| Professional Package | ₹8,999/month | 8 | ₹1,125 | Ideal for ongoing therapy |

Selected package gets blue border highlight.

**Step 2: Date & Time Selection**

- Date picker: Horizontal scrollable list of next 14 days. Each day shows: Day name (Mon), date (10), month (Mar). Grayed out if no slots available. Selected day has blue background.
- Time slots: Grid of time buttons for selected date (9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM — or fetched from TidyCal API). Slots booked by other patients are disabled. Selected time has blue background.

**Booking Summary sidebar (sticky):**
- Therapist photo, name, specialization
- Selected package name + sessions count
- Selected date (or "Not selected")
- Selected time (or "Not selected")
- Duration: 50 minutes
- Fee breakdown:
  - Consultation Fee: ₹X,XXX
  - GST (18%): ₹XXX
  - **Total:** ₹X,XXX (bold blue)
- "Proceed to Payment" button — disabled until date AND time selected, enabled once both chosen

**On "Proceed to Payment":**
- Booking data stored in `BookingContext` (in-memory + `sessionStorage`)
- Navigate to `/checkout`

---

### 6.4 Payment & Checkout (`/checkout`)

**Progress bar:** Steps 1 & 2 shown as complete (green checkmarks), Step 3 active

**Payment Method Selection (4 radio options):**
1. **Credit/Debit Card** — Conditional form: Card number (16 digits, formatted XXXX XXXX XXXX XXXX), Expiry date (MM/YY), CVV (3–4 digits), Cardholder name
2. **UPI** — Conditional form: UPI ID field (e.g., username@upi)
3. **Net Banking** — No additional fields (redirects to bank page in real integration)
4. **Digital Wallet** — No additional fields (Paytm, PhonePe, etc.)

**Order Summary sidebar (same as booking page):**
- All booking details
- Price breakdown
- Cancellation policy box:
  - 48+ hours before: **Full refund**
  - 24–48 hours before: **50% refund**
  - Less than 24 hours: **No refund**

**Security indicators:** SSL badge, encryption notice

**"Pay ₹X,XXX" button:**
- Validates payment form fields
- Calls `POST /payments/create` (backend creates Razorpay order)
- Initiates Razorpay SDK popup (or simulates 2-second processing)
- On payment success: calls `POST /appointments` to save appointment
- On confirmation: navigate to `/confirmation`

---

### 6.5 Booking Confirmation (`/confirmation`)

**Success state (animated):**
- Large green checkmark circle (animated scale-in)
- "Appointment Confirmed!" heading
- "You're all set. Here are your session details." subtext

**Confirmation card:**
- Header gradient bar (brand blue to healthcare lavender)
  - Booking Reference: `INN-2026-[TIMESTAMP][RANDOM]` (e.g., `INN-2026-123456ABC`)
  - Total Paid: ₹X,XXX
- Therapist row: Photo, name, credentials, rating stars
- Session details (4-card grid):
  - Date: Monday, 10 March 2026
  - Time: 2:30 PM
  - Duration: 50 minutes
  - Type: Video Consultation

**Meeting Link section (green-tinted card):**
- Lock icon + "Your Meeting Link" heading
- "This link becomes active 15 minutes before your appointment"
- Copyable link: `https://meet.innoma.health/session/[SESSION_ID]`
- "Copy" button (copies to clipboard, changes to "Copied!")

**Next Steps (numbered checklist):**
1. ✅ Confirmation email has been sent to your inbox
2. 📱 You'll receive a WhatsApp reminder 24 hours before
3. 🔗 Join using the meeting link (active 15 min before start)
4. 📅 You can reschedule up to 2 times with 24-hour notice

**Action buttons:**
- "View My Sessions" → `/appointments`
- "Download Receipt" → triggers browser print dialog
- "Browse Therapists" → `/therapists`

**Automatic actions on this page:**
- Appointment object created and saved to `BookingContext` + `localStorage`
- Meeting link generated: `https://meet.innoma.health/session/[UUID]`
- Invoice number generated: `INN-[YEAR]-[TIMESTAMP][RANDOM]`

---

### 6.6 Appointments Management (`/appointments`)

Full appointment history and management screen.

**Patient View:**

Tabs:
- **Upcoming** (default): Future appointments sorted ascending by date
- **Past Sessions**: Completed and cancelled appointments, sorted descending

Each appointment card shows:
- Therapist circular photo
- Therapist name + specialization
- Session type (Video Consultation)
- Date & time (formatted)
- Duration
- Fee paid (with currency symbol)
- Status badge: Upcoming (blue), Completed (green), Cancelled (red)
- Rescheduled count remaining (e.g., "2 reschedules remaining")
- Meeting link button (if available and within 15 min window)
- **"Reschedule"** button (shown if status is Upcoming AND reschedulesLeft > 0)
- **"Cancel"** button (shown if status is Upcoming)

**Reschedule Modal:**
- Available dates grid (next 14 days)
- Available time slots for selected date
- "Confirm Reschedule" button
- Shows reschedules used vs remaining (max 2)
- 24-hour minimum notice warning
- On confirm: `PATCH /appointments/:id/reschedule` with new date/time

**Cancel Modal:**
- Appointment details summary
- Refund calculation based on time until appointment:
  - "You will receive a full refund of ₹X,XXX" (48+ hours)
  - "You will receive a 50% refund of ₹X,XXX" (24–48 hours)
  - "No refund applies for cancellations within 24 hours" (<24 hours)
- "Confirm Cancellation" button (red)
- "Keep Appointment" button

Empty state (no upcoming): "No upcoming appointments. Find a therapist to get started." + "Find a Therapist" button

---

### 6.7 Patient Profile (`/profile` — patient view)

4-tab profile page.

**Tab 1: Personal Details**
- Full Name, Email, Phone, Date of Birth, Gender (Male/Female/Other), Occupation, Blood Group (A+/A-/B+/B-/AB+/AB-/O+/O-), Emergency Contact
- All fields editable inline
- "Save Changes" button → `PATCH /patient/profile`

**Tab 2: Profile Display**
- **Avatar upload:** Current avatar or initials placeholder. "Change Photo" button opens file picker. Accepts JPG/PNG/GIF, max 2MB. On select: `POST /patient/avatar` (multipart form)
- **Bio:** Textarea for personal description
- **Health Interests:** Tag input with add/remove. User types interest, presses Enter or "Add" button. Shows as removable pill tags.
- **Allergies:** Textarea
- **Medications:** Textarea
- "Save Changes" button

**Tab 3: Security & Privacy**
- Change Password form: Current Password, New Password (min 8), Confirm New Password
- "Update Password" button → `PATCH /patient/profile` with `{ currentPassword, newPassword }`
- On success: form resets, toast "Password updated"

**Tab 4: Notifications**
- **Email Notifications toggle:** Appointment reminders and updates
- **SMS Notifications toggle:** Text message reminders
- **Marketing Emails toggle:** Tips, resources, announcements
- **Reminder Frequency dropdown:** 1h before / 6h before / 12h before / 24h before (default) / 48h before
- "Save Preferences" button

All tabs auto-populate from `GET /patient/profile` on mount.

---

### 6.8 Video Consultation (`/join/:appointmentId`)

Video session interface with three states based on appointment time.

**State 1: Pre-session (more than 15 minutes before start)**
- Therapist info card (photo, name, specialization, date/time)
- Pre-session checklist (4 items with green checkmarks):
  1. Find a quiet, private space
  2. Test your camera and microphone
  3. Ensure stable internet connection
  4. Have a pen and paper ready
- Session start time display
- "Available in X minutes" countdown notice
- "Test Audio & Video" button (device check)
- Join button is disabled / gray

**State 2: Session active (within 15 min window OR during session)**
- Full-screen black video area (mock — in production: embed Google Meet / Zoom iframe using meeting link)
- Top-left overlay: Red pulsing "LIVE" dot + session elapsed timer (MM:SS, counts up from 0)
- Top-right overlay: Therapist name tag
- Bottom control bar (fixed):
  - 🎤 Mute/Unmute toggle button
  - 📷 Camera on/off toggle button
  - 🔴 "End Session" button (centered, red, larger)
  - 🖥️ Share screen button
  - ⚙️ Settings button

**State 3: Post-session (after session end time)**
- Green checkmark circle animation
- "Session Completed!" heading
- Star rating (1–5 interactive stars) — required
- Feedback textarea (optional) — "Any additional comments?"
- "Submit Feedback & Continue" button → `POST /appointments/:id/feedback` → navigate to `/appointments`
- "Book Next Session" button → `/book/:therapistId`
- "View All Appointments" button → `/appointments`

---

### 6.9 Support (`/support`)

Help center for authenticated users.

**3 tabs:**

**Tab 1: FAQs**
- Search input: filters FAQ list in real-time
- Expandable FAQ items (accordion) — at least 8 items covering:
  - How to book an appointment
  - Rescheduling and cancellation policy
  - Confidentiality and data privacy
  - What to do if technical issues arise
  - How to access free assessment
  - Accepted payment methods
  - How to switch therapists
  - How to download session notes / invoices

**Tab 2: Contact**
- Form fields:
  - **Issue Category** (dropdown): Booking issue / Technical problem / Payment & billing / Therapist concern / Account issue / Other
  - **Subject** (text input, required)
  - **Description** (textarea, 5 rows, required)
- "Submit Ticket" button
- On success: green success message for 3 seconds, form resets, ticket ID shown
- Backend: `POST /support/tickets` with `{ category, subject, message }`

**Tab 3: My Tickets**
- List of user's own support tickets
- Each ticket shows: ticket ID, subject, status badge (New / Open / Resolved / Closed), date submitted
- Empty state: "No tickets yet. Create one if you need help." + "Create a ticket" button (switches to Contact tab)
- Backend: `GET /support/tickets` (filtered to current user)

---

### 6.10 Settings (`/settings`)

Notification preferences and account management.

**Section: Notification Preferences**
- **Email notifications** toggle (default: on) — booking confirmations, reminders
- **WhatsApp notifications** toggle (default: on) — instant updates
- **Reminder frequency** radio group:
  - "24 hours before session"
  - "12 hours and 1 hour before"
  - "1 hour before only"
  - "No reminders"
- **Marketing emails** toggle (default: off) — feature updates, wellness tips

**Section: Danger Zone**
- Red-bordered warning box
- "Delete My Account" button (red)
- Click → confirmation dialog: "This action cannot be undone. All your data will be permanently deleted."
- On confirm: `DELETE /patient/account`, clear auth storage, redirect to `/`

**Save/Cancel:**
- "Cancel" button (reverts to original state)
- "Save Changes" button → `PATCH /patient/profile` with notification prefs → success toast for 3 seconds

---

## 7. Therapist Journey (Detailed)

Therapists log in with `role: "therapist"`. They share some routes with patients (`/dashboard`, `/profile`, `/appointments`, `/settings`, `/support`) but see completely different UI in each.

### 7.1 Therapist Dashboard (`/dashboard` — therapist view)

**Welcome section:**
- "Welcome back, Dr. [Last Name]"

**Stats grid (4 cards):**
- **Total Patients:** All unique patients who have booked at least one session
- **Sessions This Week:** Count of sessions scheduled in the current calendar week
- **Today's Sessions:** Count of sessions today, with next session time (e.g., "Next: 2:30 PM")
- **Average Rating:** Mean star rating across all reviewed sessions, + total review count

**Upcoming sessions list (top 5):**
Each item shows:
- Patient circular avatar or initials
- Patient full name
- Session type (Consultation / Follow-up)
- Date and time
- Status:
  - Within 15-minute window: green "Join" button → `/join/:appointmentId`
  - Future: blue "Scheduled" indicator
  - Duration badge

**"View all" link** → `/appointments`

**Quick action links:**
- "Manage availability" → `/settings` (availability tab)
- "Patient records" → `/appointments?tab=patients`
- "Session history" → `/appointments?tab=history`

---

### 7.2 Therapist Appointments (`/appointments` — therapist view)

Three tabs:

**Tab 1: Upcoming Sessions**
- All future sessions sorted ascending
- Each item: patient name + avatar, session type, specialization context, date/time, duration
- Actions: "Join" button (active within 15 min), "View Notes", "Cancel"

**Tab 2: My Patients**
- All unique patients who have ever booked with this therapist
- Each patient row: photo, name, email, total sessions with this therapist, last session date, stage (active / completed / cancelled)
- "View History" button → filters appointment list to show only that patient

**Tab 3: Session History**
- All past sessions (completed + cancelled)
- Each row: patient, date, type, status, fee collected
- "View Notes" button (opens notes modal for that session)

**Session Notes Modal:**
- Patient name
- Session date/time
- Text area with saved notes from that session
- "Save Notes" button → `PATCH /appointments/:id/notes`

---

### 7.3 Therapist Profile (Edit, `/profile` — therapist view)

Therapists can edit their own public-facing profile.

Tabs (similar to patient but different fields):
- **Professional Details:** Full name, email, phone, specialization (multi-select tags), languages (multi-select), years of experience, consultation fee, bio, treatment approach
- **Availability:** Weekly schedule — toggle availability for each day of week, set time slots per day (integrates with TidyCal)
- **Security:** Change password form
- **Notifications:** Email/WhatsApp notification preferences

---

### 7.4 Therapist Settings (`/settings` — therapist view)

Same structure as patient settings but may include additional availability and payout-related options.

---

## 8. Admin Journey (Detailed)

Admins access the platform at `/admin`. The entire admin section is completely separate from the patient/therapist experience. It uses `AdminLayout` with a brand-blue sidebar. Admin must have `role: "admin"` in their JWT — any other role is redirected to `/unauthorized`.

### 8.1 Admin Navigation (Sidebar)

7 navigation items:
1. Dashboard
2. Therapists
3. Finance
4. Articles
5. Support
6. FAQs
7. Users

Mobile: collapsible drawer. Desktop: fixed left sidebar (width 256px).

Bottom of sidebar: Admin's name, email, and Logout button.

---

### 8.2 Admin Dashboard (`/admin`)

Overview of platform health with 8 KPI stat cards.

**Row 1 (4 cards — primary metrics):**
- **Total Users** (links to `/admin/users`)
- **Therapists** (links to `/admin/therapists`)
- **Total Sessions** (all time)
- **Total Revenue** (all time, in $ or ₹, links to `/admin/finance`)

**Row 2 (4 cards — current activity):**
- **New Users This Month**
- **Sessions This Month**
- **Open Tickets** (links to `/admin/support`)
- **Pending Articles** (drafts, links to `/admin/articles`)

**Quick Actions panel:**
- 6 shortcut links in a grid:
  - Add Therapist → `/admin/therapists/new`
  - New Article → `/admin/articles/new`
  - View Tickets → `/admin/support`
  - Manage FAQs → `/admin/faqs`
  - View Users → `/admin/users`
  - Finance Report → `/admin/finance`

Data source: `GET /admin/dashboard/stats`

---

### 8.3 Therapist Management (`/admin/therapists`)

Full roster management.

**List view:**
- Search bar (name, email, specialization)
- Table columns: Therapist (photo + name + email), Specialization, Sessions (total), Status (Active/Inactive toggle), Actions
- Status is a clickable badge — clicking toggles `isActive` via `PATCH /admin/therapists/:id`
- Action buttons per row:
  - "Bookings" → `/admin/therapists/:id/bookings`
  - "Edit" → `/admin/therapists/:id/edit`
- "Add Therapist" button → `/admin/therapists/new`

**Create/Edit Form (`/admin/therapists/new` and `/admin/therapists/:id/edit`):**
- Fields: Full Name, Email, Phone (optional), Experience (years), Specialization, Bio (optional), Password (required on create, optional on edit — leave blank to keep current)
- Form validation with Yup
- On create: `POST /admin/therapists`
- On edit: `PATCH /admin/therapists/:id`
- On success: navigate back to `/admin/therapists`, toast notification

**Therapist Bookings View (`/admin/therapists/:id/bookings`):**
- Therapist summary card (name, specialization, total sessions) at top
- Toggle tabs: **Upcoming** | **Past**
- Table: Patient name + email, Date, Time, Amount paid, Status badge, Action
- "Mark Complete" button on Upcoming sessions → `PATCH /admin/bookings/:bookingId/complete`
- Status badges: Upcoming (blue), Completed (green), Cancelled (red)

---

### 8.4 Finance (`/admin/finance`)

Revenue analytics and reporting.

**Summary KPIs (6 cards):**
- Total Revenue (all time)
- Total Sessions (all time)
- Average Session Value
- Revenue This Month
- Revenue Last Month
- Month-over-month Growth % (green if positive, red if negative)

Data source: `GET /admin/finance/summary`

**Daily Revenue Chart:**
- Date range picker: From date → To date (default last 30 days)
- Bar chart (custom CSS-based, proportional widths) showing last 14 bars
- Each bar: date label (MM-DD), proportional bar, ₹ value
- Data source: `GET /admin/finance/daily?from=YYYY-MM-DD&to=YYYY-MM-DD`

**Revenue by Therapist table:**
- Columns: Therapist name, Sessions, Revenue, Avg Rating
- Sorted by revenue descending
- Data source: `GET /admin/finance/therapists`

---

### 8.5 Articles/Blog Management (`/admin/articles`)

Content management system for blog posts.

**List view:**
- Filter tabs: All | Published | Draft
- Table: Title (+ excerpt preview), Author, Published date, Status badge, Actions
- Status badge: Published (green), Draft (gray)
- Actions per article: "Publish/Unpublish" toggle, "Edit", "Delete" (with confirm dialog)
- Pagination: 20 per page, Prev/Next
- "New Article" button → `/admin/articles/new`

**Create/Edit Form (`/admin/articles/new` and `/admin/articles/:id/edit`):**
- Fields:
  - **Title** (required, text input)
  - **Excerpt** (optional, 2-row textarea, shown in listings)
  - **Cover Image URL** (optional, validated URL)
  - **Content** (required, min 50 chars, monospace textarea 12 rows — Markdown supported)
  - **Tags** (tag input with add/remove pill UI — type + Enter to add)
  - **Published toggle** (on = Published, off = Draft)
- On create: `POST /admin/articles`
- On update: `PATCH /admin/articles/:id`
- Separate publish/unpublish via `PATCH /admin/articles/:id/publish` and `/unpublish`

---

### 8.6 Support Ticket Management (`/admin/support`)

Handle user support requests.

**List view:**
- Filter tabs: All | New | Open | Resolved | Closed
- Table: Subject (+ message preview), User (name + email), Date submitted, Status badge, "View" button
- Pagination: 20 per page
- Status badges: New (blue), Open (yellow), Resolved (green), Closed (gray)

**Ticket Detail Modal (in-page):**
- Subject heading + close button
- User info: name, email, submitted date
- Original message (gray box)
- Admin reply (blue-tinted box, if exists)
- Reply textarea: "Write your reply…"
- Status buttons: Set status to New / Open / Resolved / Closed (current status highlighted in blue)
- "Send Reply" button → `POST /admin/support/:id/reply` with `{ reply }`
- Status update → `PATCH /admin/support/:id/status` with `{ status }`
- Both close the modal on success and invalidate query

---

### 8.7 FAQ Management (`/admin/faqs`)

Create, edit, and order public FAQs shown on the landing page and patient support page.

**List view:**
- Ordered list (numbered) of all FAQs
- Each item shows:
  - Order number
  - Question (bold)
  - Answer preview (2 lines, truncated)
  - Status badges: "Hidden" (gray pill) if not published, Category badge (if set)
  - "Edit" and "Delete" buttons (delete has confirm dialog)
- "Add FAQ" button → opens modal

**Add/Edit FAQ Modal:**
- Fields:
  - Question (text input, required)
  - Answer (textarea 4 rows, required)
  - Category (optional, e.g., "Billing", "General", "Technical")
  - Published toggle
- On create: `POST /admin/faqs`
- On edit: `PATCH /admin/faqs/:id`
- On delete: `DELETE /admin/faqs/:id`

**Reordering:** Drag-and-drop or up/down arrows → `PATCH /admin/faqs/reorder` with `{ orderedIds: string[] }`

---

### 8.8 User Management (`/admin/users`)

Browse and manage all patient accounts.

**List view:**
- **Stage filter tabs:** All | Registered | Free Assessment | Paid Session
  - `registered` — Created account, no further action
  - `free_assessment` — Completed a free assessment
  - `paid_session` — Has paid for and attended at least one session
- **Search bar:** Real-time filter by name or email
- Table: User (avatar initial + name + email), Joined date, Total sessions, Stage badge, "Email" button
- Pagination: 20 per page

**Stage badge colors:**
- Registered → gray
- Free Assessment → blue
- Paid Session → green

**Email Modal:**
- User's name and email in header
- Fields: Subject (required), Message (required, min 10 chars)
- "Send Email" button → `POST /admin/users/:id/email` with `{ subject, message }`
- Backend triggers transactional email to user
- On success: toast + close modal

---

## 9. Data Entities & Schema

### 9.1 User
```
id: uuid (PK)
email: string (unique)
passwordHash: string
role: enum('patient', 'therapist', 'admin')
name: string
avatarUrl: string | null
isEmailVerified: boolean
createdAt: timestamp
updatedAt: timestamp
lastLoginAt: timestamp | null
```

### 9.2 Patient Profile
```
id: uuid (FK → users.id, PK)
phone: string | null
dob: date | null
gender: enum('Male', 'Female', 'Other') | null
occupation: string | null
bloodGroup: string | null
bio: text | null
healthInterests: string[] (JSON array)
allergies: text | null
medications: text | null
emergencyContact: string | null
notificationEmail: boolean (default true)
notificationSms: boolean (default true)
marketingEmail: boolean (default false)
reminderFrequency: enum('1h','6h','12h','24h','48h') (default '24h')
stage: enum('registered','free_assessment','paid_session') (default 'registered')
memberSince: timestamp
```

### 9.3 Therapist Profile
```
id: uuid (FK → users.id, PK)
phone: string | null
specialization: string
specializations: string[] (JSON array — multiple)
experience: integer (years)
fee: decimal(10,2) (per session in local currency)
bio: text | null
approach: text | null
languages: string[] (JSON array)
gender: enum('Male','Female','Other') | null
qualifications: string | null
rating: decimal(2,1) | null (computed average)
totalReviews: integer (default 0)
totalPatients: integer (computed or cached)
totalSessions: integer (computed or cached)
isActive: boolean (default true)
availableDays: string[] (JSON — e.g., ['Monday','Tuesday'])
availability: JSON (TidyCal-synced schedule)
tidyCalBookingUrl: string | null
createdAt: timestamp
```

### 9.4 Appointment
```
id: uuid (PK)
patientId: uuid (FK → users.id)
therapistId: uuid (FK → users.id)
packageType: enum('single','starter','professional')
sessionNumber: integer (which session in the package, 1-indexed)
date: date
time: time
duration: integer (minutes, default 50)
sessionType: enum('Consultation','Follow-up') (default 'Consultation')
status: enum('upcoming','completed','cancelled','rescheduled')
fee: decimal(10,2)
gst: decimal(10,2)
totalAmount: decimal(10,2)
paymentStatus: enum('pending','paid','refunded','partial_refund')
paymentId: string | null (Razorpay payment ID)
meetingLink: string | null (generated on booking)
invoiceNumber: string (e.g., INN-2026-123456ABC)
reschedulesUsed: integer (default 0, max 2)
sessionNotes: text | null (therapist-written notes)
adminReply: text | null
createdAt: timestamp
updatedAt: timestamp
cancelledAt: timestamp | null
cancelledBy: uuid | null (FK → users.id)
cancellationReason: text | null
```

### 9.5 Session Rating & Feedback
```
id: uuid (PK)
appointmentId: uuid (FK → appointments.id)
patientId: uuid (FK → users.id)
therapistId: uuid (FK → users.id)
rating: integer (1–5)
feedback: text | null
createdAt: timestamp
```

### 9.6 Support Ticket
```
id: uuid (PK)
userId: uuid (FK → users.id)
category: enum('booking','technical','payment','therapist','account','other')
subject: string
message: text
status: enum('new','open','resolved','closed') (default 'new')
adminReply: text | null
repliedBy: uuid | null (FK → users.id — admin user)
repliedAt: timestamp | null
createdAt: timestamp
updatedAt: timestamp
```

### 9.7 Article
```
id: uuid (PK)
title: string
slug: string (unique, auto-generated from title)
excerpt: text | null
content: text (Markdown)
coverImageUrl: string | null
authorId: uuid (FK → users.id — admin)
authorName: string
tags: string[] (JSON array)
isPublished: boolean (default false)
publishedAt: timestamp | null
createdAt: timestamp
updatedAt: timestamp
```

### 9.8 FAQ
```
id: uuid (PK)
question: string
answer: text
category: string | null
order: integer
isPublished: boolean (default true)
createdAt: timestamp
updatedAt: timestamp
```

### 9.9 Refresh Token (for token blacklisting / rotation)
```
id: uuid (PK)
userId: uuid (FK → users.id)
token: string (hashed)
expiresAt: timestamp
createdAt: timestamp
revokedAt: timestamp | null
```

### 9.10 Payment / Invoice
```
id: uuid (PK)
appointmentId: uuid (FK → appointments.id)
patientId: uuid (FK → users.id)
therapistId: uuid (FK → users.id)
razorpayOrderId: string
razorpayPaymentId: string | null
amount: decimal(10,2)
gst: decimal(10,2)
totalAmount: decimal(10,2)
currency: string (default 'INR')
status: enum('created','authorized','captured','failed','refunded','partial_refund')
refundAmount: decimal(10,2) | null
refundedAt: timestamp | null
invoiceNumber: string
createdAt: timestamp
```

---

## 10. Complete API Endpoint Reference

### Auth
```
POST   /api/auth/register          — Create patient account
POST   /api/auth/login             — Login, returns tokens + user
POST   /api/auth/logout            — Invalidate refresh token
POST   /api/auth/refresh           — Get new access token
POST   /api/auth/forgot-password   — Send reset email
POST   /api/auth/reset-password    — Set new password with token
GET    /api/auth/verify-email      — Verify email address (?token=)
```

### Patient
```
GET    /api/patient/profile        — Get own profile
PATCH  /api/patient/profile        — Update profile / notification prefs / password
POST   /api/patient/avatar         — Upload avatar (multipart/form-data)
GET    /api/patient/dashboard      — Next session, counts, care journey
DELETE /api/patient/account        — Delete own account
```

### Therapists (Public)
```
GET    /api/therapists             — List with filters: search, specialization, language, minFee, maxFee, minRating, sort, page, limit
GET    /api/therapists/:id         — Single therapist full profile
GET    /api/therapists/:id/availability — Available slots (14-day window or TidyCal proxy)
```

### Appointments
```
GET    /api/appointments           — Patient's or therapist's appointments (role-detected from JWT)
POST   /api/appointments           — Create appointment (after payment)
GET    /api/appointments/:id       — Single appointment detail
PATCH  /api/appointments/:id/reschedule  — Reschedule (max 2, 24h notice)
PATCH  /api/appointments/:id/cancel      — Cancel with refund calculation
PATCH  /api/appointments/:id/complete    — Mark as completed (therapist/admin)
PATCH  /api/appointments/:id/notes       — Save session notes (therapist only)
POST   /api/appointments/:id/feedback    — Submit rating and feedback (patient only)
```

### Payments
```
POST   /api/payments/create        — Create Razorpay order
POST   /api/payments/verify        — Verify payment signature, record transaction
POST   /api/payments/refund        — Initiate refund
GET    /api/payments/:appointmentId — Payment details for appointment
```

### Support (Patient/Therapist)
```
GET    /api/support/tickets        — Own tickets
POST   /api/support/tickets        — Create ticket
GET    /api/support/tickets/:id    — Single ticket
```

### Admin — General
```
GET    /api/admin/dashboard/stats  — Platform KPIs
```

### Admin — Therapists
```
GET    /api/admin/therapists       — All therapists (paginated)
GET    /api/admin/therapists/:id   — Single therapist
POST   /api/admin/therapists       — Create therapist account
PATCH  /api/admin/therapists/:id   — Update therapist (incl. isActive)
GET    /api/admin/therapists/:id/bookings  — Therapist's bookings (?type=upcoming|past)
```

### Admin — Bookings
```
GET    /api/admin/bookings         — All bookings (?status, ?page, ?limit)
PATCH  /api/admin/bookings/:id/complete   — Mark session complete
```

### Admin — Finance
```
GET    /api/admin/finance/summary  — Revenue KPIs
GET    /api/admin/finance/daily    — Daily revenue (?from=&to=)
GET    /api/admin/finance/therapists — Per-therapist revenue
```

### Admin — Articles
```
GET    /api/admin/articles         — List (?page, ?limit, ?published)
GET    /api/admin/articles/:id     — Single article
POST   /api/admin/articles         — Create
PATCH  /api/admin/articles/:id     — Update
DELETE /api/admin/articles/:id     — Delete
PATCH  /api/admin/articles/:id/publish   — Publish
PATCH  /api/admin/articles/:id/unpublish — Unpublish
```

### Admin — Support
```
GET    /api/admin/support          — All tickets (?status, ?page, ?limit)
GET    /api/admin/support/:id      — Single ticket
POST   /api/admin/support/:id/reply     — Reply with email
PATCH  /api/admin/support/:id/status   — Update status
```

### Admin — FAQs
```
GET    /api/admin/faqs             — All FAQs
POST   /api/admin/faqs             — Create
PATCH  /api/admin/faqs/:id         — Update
DELETE /api/admin/faqs/:id         — Delete
PATCH  /api/admin/faqs/reorder     — Reorder { orderedIds: string[] }
```

### Admin — Users
```
GET    /api/admin/users            — All users (?stage, ?role, ?search, ?page, ?limit)
POST   /api/admin/users/:id/email  — Send email to user { subject, message }
```

### Public Routes
```
GET    /api/public/faqs            — Published FAQs (for landing page)
GET    /api/public/articles        — Published articles (?page, ?limit, ?tag)
GET    /api/public/articles/:slug  — Single published article by slug
GET    /api/public/therapists      — Same as /api/therapists (no auth required)
POST   /api/public/leads           — Capture lead from landing page form
```

---

## 11. Third-Party Integrations

### 11.1 TidyCal (Scheduling)
- **Purpose:** Manage therapist availability and slot booking
- **Integration point:** When patient selects a date on the booking page, frontend hits `GET /api/therapists/:id/availability` which proxies to TidyCal API
- **Backend must:** Store therapist's TidyCal booking URL, proxy availability requests, block slots when appointment is created, release slots when cancelled/rescheduled
- **Env vars needed:** `TIDYCAL_API_KEY`, `TIDYCAL_BASE_URL`

### 11.2 Razorpay (Payments)
- **Flow:**
  1. Frontend calls `POST /api/payments/create` → backend creates Razorpay order → returns `{ orderId, amount, currency }`
  2. Frontend opens Razorpay checkout SDK with order details
  3. Patient completes payment in Razorpay popup
  4. Razorpay calls backend webhook `POST /api/webhooks/razorpay` with payment event
  5. Backend verifies HMAC signature, marks payment as captured, creates appointment
  6. Frontend also calls `POST /api/payments/verify` with payment ID + signature as redundant check
- **Refunds:** `POST /api/payments/refund` triggers Razorpay refund API
- **Env vars needed:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

### 11.3 Google Meet / Zoom (Video)
- **Flow:** When appointment is created (payment confirmed), backend generates a meeting link
- **Google Meet:** Use Google Calendar API to create an event with Meet link. Store `meetingLink` in appointment record.
- **Zoom:** Use Zoom API `POST /v2/users/{userId}/meetings` to create a meeting. Store join URL.
- **Access control:** Meeting link is returned to patient in confirmation page and in their appointment list. Link activates 15 minutes before appointment time (enforced by frontend time check, optionally by backend).
- **Env vars needed:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID` or `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`

### 11.4 Email / WhatsApp (Notifications)
- **Email:** SendGrid or Nodemailer. Triggered for: registration confirmation, password reset, booking confirmation, 24h reminder, cancellation notification, support ticket reply, admin-sent emails
- **WhatsApp:** Twilio WhatsApp API or WhatsApp Business API. Triggered for: booking confirmation, session reminders (24h and 1h before)
- **Env vars needed:** `SENDGRID_API_KEY` (or SMTP creds), `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`

---

## 12. Business Rules & Constraints

### Booking Rules
- A patient can book up to **1 active upcoming session** per therapist at a time
- A session is **50 minutes** by default
- Slots are shown from a 14-day window starting tomorrow
- Available times: 9 AM, 10 AM, 11 AM, 12 PM, 1 PM, 2 PM, 3 PM, 4 PM, 5 PM (configurable via TidyCal)
- GST of **18%** is added on top of the base consultation fee

### Rescheduling Rules
- Maximum **2 reschedules** per appointment
- Each reschedule must be requested at least **24 hours before** the session
- On reschedule: slot is released to TidyCal, new slot is reserved

### Cancellation & Refund Rules
- **48+ hours before session:** Full refund (100%)
- **24–48 hours before session:** 50% refund
- **Less than 24 hours before session:** No refund
- Refund is processed back via Razorpay to original payment method
- Admin can override refund amounts

### Rating Rules
- Rating can only be submitted **after session end time**
- Rating is **1–5 stars** (integer)
- Feedback is **optional text**
- Therapist's `rating` field is the **rolling average** of all session ratings

### Token Rules
- Access token expires in **15 minutes** (production) — shorter for security
- Refresh token expires in **30 days** (standard) or **24 hours** (if rememberMe = false)
- Refresh token rotation: every `/auth/refresh` call issues a new refresh token and invalidates the old one
- On 3 consecutive failed refresh attempts: account is flagged, admin notified

### Admin Rules
- Admin accounts are created manually (no public registration for admin role)
- All admin API routes require `role: "admin"` in JWT — enforced server-side middleware
- Admin can view, edit, and delete any user's data
- Admin cannot delete their own account through the UI

---

## 13. Navigation Map (All Routes)

### Public Routes (No Auth Required)
```
/                        Landing page
/about                   About page
/how-it-works            How it works
/privacy                 Privacy Policy
/terms                   Terms of Service
/therapists              Therapist directory (public view)
/therapists/:id          Therapist profile (public view)
/leaders/:id             Leadership profile
/forgot-password         Forgot password form
/reset-password?token=   Reset password form
```

### Auth Routes (Redirect authenticated users to home)
```
/login                   Login form
/signup                  Registration wizard
```

### Patient / Therapist Routes (Require auth)
```
/dashboard               Patient dashboard OR Therapist dashboard (role-based)
/profile                 Patient profile (4 tabs) OR Therapist profile (edit)
/appointments            Appointment management (different tabs per role)
/settings                Notification preferences + danger zone
/support                 FAQs, contact form, ticket tracker
/find-therapist          Therapist directory (logged-in patient, inside AppLayout)
/find-therapist/:id      Therapist profile (logged-in patient, inside AppLayout)
/book/:therapistId       Appointment booking steps 1 & 2
/checkout                Payment step 3
/confirmation            Booking confirmation & meeting link
/join/:appointmentId     Video consultation session
/assessments             Coming soon placeholder
/sessions                Coming soon placeholder
/assessment              Redirects to /therapists
```

### Admin Routes (Require auth + admin role)
```
/admin                   Admin dashboard (KPIs)
/admin/therapists        Therapist list
/admin/therapists/new    Create therapist form
/admin/therapists/:id/edit      Edit therapist form
/admin/therapists/:id/bookings  Therapist booking history
/admin/finance           Finance overview
/admin/articles          Article/blog list
/admin/articles/new      Create article form
/admin/articles/:id/edit Edit article form
/admin/support           Support ticket queue
/admin/faqs              FAQ management
/admin/users             User management
```

### Error Routes
```
/unauthorized            403 — Access denied page
* (catch-all)            Redirect to / or 404 page
```

---

## 14. Frontend State Architecture

### Global State (React Context)

**AuthContext:**
- `user: AuthUser | null` — `{ id, email, role, name, avatar }`
- `isAuthenticated: boolean`
- `isLoading: boolean` — true during initial localStorage restore
- `login(email, password, rememberMe)` → `{ success, error?, role? }`
- `register(payload)` → `{ success, error? }`
- `logout()` → void (async)
- `refreshAccessToken()` → `string`

**BookingContext:**
- `currentBooking` — In-progress booking (therapist, package, date, time)
- `bookedAppointments` — All user's booked appointments (persisted in `localStorage` under `innoma_booked_appointments`)
- `addBookedAppointment(appointment)` — Saves to context + localStorage
- `getUserAppointments()` → `{ upcoming: Appointment[], past: Appointment[] }`
- `generateMeetingLink()` → `string` (UUID-based meet.innoma.health URL)
- `generateInvoiceNumber()` → `string` (INN-YYYY-TIMESTAMP format)

### Server State (React Query)
- Patient profile, dashboard, appointments: `queryKey: ['patient', 'profile' | 'dashboard']`
- Therapist listings: `queryKey: ['therapists', { filters }]`
- Admin queries: all prefixed with `['admin', section, ...]`
- Default stale time: 2 minutes
- Auto-refetch on window focus: enabled

### Local State (Component-level)
- Form state: Formik handles all form field state
- Tab state: `useState<Tab>` in multi-tab pages
- Modal state: `useState<{ open: boolean; data?: T }>`
- Filter state: `useState` in list pages (search term, filter values, page)
- UI state: Sidebar open/close, loading spinners, toast triggers

---

## 15. Design System Tokens

The platform uses a custom Tailwind v4 design system with these tokens:

| Token | Usage |
|---|---|
| `brand-blue` (#1e40af) | Primary actions, active nav, CTAs, headings |
| `brand-orange` (#f97316) | Logo accent, highlights, warning-adjacent UI |
| `healthcare-lavender` | Secondary accent, admin badge backgrounds |
| `healthcare-surface` | Page background, card backgrounds (very light gray/blue) |
| `healthcare-text` | Primary text (near-black) |
| `healthcare-text-muted` | Secondary/placeholder text (gray) |
| `healthcare-border` | Borders and dividers (light gray) |
| `healthcare-neutral` | Neutral backgrounds and subtle fills |
| `shadow-clinical` | Custom box shadow for clinical/professional card look |

**Typography:** Bold headings, medium body text, small caps labels in forms. Monospace used in code/markdown editors.

**Animation:** `animate-fade-in`, `animate-slide-up`, `animate-spin` (Tailwind). Subtle transitions on hover states (150–200ms).

**Responsive breakpoints:** Mobile-first. Key breakpoints: `sm` (640px), `md` (768px), `lg` (1024px). Admin sidebar collapses below `lg`. Patient sidebar collapses below `lg`.

---

*End of Innoma Healthcare Platform Specification Document*
*Version: 2026-03 | Generated from live codebase analysis*
