# Innoma Healthcare — Full Backend & Integration Specification

> **Document version:** 1.0
> **Date:** 2026-02-25
> **Branch:** `claude/define-frontend-backend-specs-FQb3U`
> **Stack scope:** This document covers every frontend form field, every required backend API endpoint, the TidyCal scheduling integration, and the Google Meet / Zoom meeting-link integration needed to make Innoma Healthcare fully functional.

---

## Table of Contents

1. [Frontend Fields — Complete Reference](#1-frontend-fields--complete-reference)
   1.1 [Authentication](#11-authentication)
   1.2 [Patient Registration (3-step)](#12-patient-registration-3-step)
   1.3 [Patient Profile](#13-patient-profile)
   1.4 [Therapist Profile](#14-therapist-profile)
   1.5 [Book Appointment](#15-book-appointment)
   1.6 [Checkout / Payment](#16-checkout--payment)
   1.7 [Therapist Directory Filters](#17-therapist-directory-filters)
   1.8 [Video Consultation — Session Feedback](#18-video-consultation--session-feedback)
   1.9 [Notification / Settings](#19-notification--settings)
   1.10 [Support / Contact Form](#110-support--contact-form)
   1.11 [Lead Capture Form (Landing Page)](#111-lead-capture-form-landing-page)
2. [Database Schema](#2-database-schema)
3. [Backend API Specification](#3-backend-api-specification)
   3.1 [Auth APIs](#31-auth-apis)
   3.2 [Patient APIs](#32-patient-apis)
   3.3 [Therapist APIs](#33-therapist-apis)
   3.4 [Appointment / Booking APIs](#34-appointment--booking-apis)
   3.5 [Payment APIs (Razorpay)](#35-payment-apis-razorpay)
   3.6 [Notification APIs](#36-notification-apis)
   3.7 [Review & Rating APIs](#37-review--rating-apis)
   3.8 [Support / Ticket APIs](#38-support--ticket-apis)
   3.9 [Lead APIs](#39-lead-apis)
4. [Scheduling Integration — TidyCal](#4-scheduling-integration--tidycal)
5. [Meeting Link Integration — Google Meet & Zoom](#5-meeting-link-integration--google-meet--zoom)
6. [End-to-End Booking Flow (Combined)](#6-end-to-end-booking-flow-combined)
7. [Notification System](#7-notification-system)
8. [Security & Compliance](#8-security--compliance)
9. [Environment Variables Reference](#9-environment-variables-reference)

---

## 1. Frontend Fields — Complete Reference

Every field listed below is already rendered in the React frontend. The backend must store, validate, and return each one.

---

### 1.1 Authentication

#### Login Page (`/login`)

| Field | HTML type | Validation | Backend notes |
|---|---|---|---|
| `email` | `email` | Required, valid email format | Lookup key in `users` table |
| `password` | `password` | Required, min 8 chars | bcrypt compare |
| `rememberMe` | `checkbox` | Optional (boolean) | Extend JWT expiry to 30 days |

**Actions:** Login button → `POST /api/auth/login`

---

#### Signup Page (`/signup`) — 3 Steps

##### Step 1 — Identity

| Field | HTML type | Validation | Backend notes |
|---|---|---|---|
| `fullName` | `text` | Required | Store as `name` in `users` |
| `email` | `email` | Required, unique email | Unique index on `users.email` |

##### Step 2 — Clinical Profile

| Field | HTML type | Validation | Options | Backend notes |
|---|---|---|---|---|
| `dob` | `date` | Required | — | Store as `DATE`, compute `age` on read |
| `gender` | `select` | Required | `M` / `F` / `Other` | Store as `ENUM` |
| `occupation` | `select` | Required | `Student` / `Job` / `Other` | Store as `VARCHAR` |

##### Step 3 — Credentials

| Field | HTML type | Validation | Backend notes |
|---|---|---|---|
| `password` | `password` | Required, min 8 chars | bcrypt hash before storing |
| `confirmPassword` | `password` | Must match `password` | Frontend-only validation; do not store |

**Actions:** "Complete Intake" → `POST /api/auth/register`

---

### 1.2 Patient Registration (3-step)

_(Same as §1.1 Signup above; the final registration payload sent to the backend is:)_

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "dob": "1996-04-15",
  "gender": "F",
  "occupation": "Student",
  "password": "hashed_client_side_or_plain_to_hash_server_side",
  "role": "patient"
}
```

---

### 1.3 Patient Profile

Tab: **Personal Details**

| Field | HTML type | Validation | Options | DB column |
|---|---|---|---|---|
| `fullName` | `text` | Required | — | `users.name` |
| `email` | `email` | Required, valid email | — | `users.email` |
| `phone` | `text` | Optional, 10-15 digits/+/spaces | — | `patient_profiles.phone` |
| `dob` | `date` | Required | — | `patient_profiles.dob` |
| `gender` | `select` | Required | `Male` / `Female` / `Other` | `patient_profiles.gender` |
| `occupation` | `text` | Required | — | `patient_profiles.occupation` |
| `bloodGroup` | `select` | Required | `A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-` | `patient_profiles.blood_group` |

Tab: **Medical Information** (sub-section of Personal Details)

| Field | HTML type | Validation | DB column |
|---|---|---|---|
| `allergies` | `text` | Optional | `patient_profiles.allergies` |
| `medications` | `text` | Optional | `patient_profiles.medications` |
| `emergencyContact` | `text` | Optional, format: "Name - Phone" | `patient_profiles.emergency_contact` |

Tab: **Security & Privacy**

| Field | HTML type | Validation | Backend notes |
|---|---|---|---|
| `newPassword` | `password` | Optional, min 8 chars | bcrypt hash on save |
| `confirmPassword` | `password` | Must match `newPassword` | Frontend-only |
| `notificationEmail` | `checkbox/toggle` | Boolean | `patient_profiles.notification_email` |
| `notificationSms` | `checkbox/toggle` | Boolean | `patient_profiles.notification_sms` |

Tab: **Profile Display**

| Field | HTML type | Validation | DB column |
|---|---|---|---|
| `bio` | `textarea` | Optional, max 500 chars | `patient_profiles.bio` |
| `healthInterests` | `multi-select tags` | Optional, array of strings | `patient_profiles.health_interests` (JSON array) |
| `avatar` | `file` (image) | Optional, JPG/PNG, max 5 MB | Upload to object storage, store URL |

Health Interest Options: `Anxiety`, `Depression`, `Trauma Recovery`, `Stress Management`, `Work-Life Balance`, `Relationships`

**Actions:** "Save Changes" → `PUT /api/patients/me`

---

### 1.4 Therapist Profile

Tab: **Professional Info**

| Field | HTML type | Validation | DB column |
|---|---|---|---|
| `fullName` | `text` | Required | `users.name` |
| `email` | `email` | Required, valid email | `users.email` |
| `phone` | `text` | Optional, 10-15 digits | `therapist_profiles.phone` |
| `qualifications` | `text` | Optional, e.g. "M.D. Psychiatry, Ph.D." | `therapist_profiles.qualifications` |
| `licenseNumber` | `text` | Optional, e.g. "MH-PSY-2012-45678" | `therapist_profiles.license_number` |
| `experience` | `number` | Optional, min 0 | `therapist_profiles.experience_years` |
| `consultationFee` | `number` | Optional, min 0 (INR) | `therapist_profiles.consultation_fee` |

Tab: **Specializations & Languages**

| Field | Type | Options | DB column |
|---|---|---|---|
| `specializations` | Multi-select tag buttons | See §1.7 for full list | `therapist_profiles.specializations` (JSON array) |
| `languages` | Multi-select tag buttons | English, Hindi, Tamil, Telugu, Gujarati, Marathi, Punjabi, Urdu, Bengali, Malayalam | `therapist_profiles.languages` (JSON array) |

Tab: **Professional Bio**

| Field | HTML type | Validation | DB column |
|---|---|---|---|
| `bio` | `textarea` | Optional, max 500 chars | `therapist_profiles.bio` |

Tab: **Availability**

| Field | Type | Description | DB table |
|---|---|---|---|
| Weekly schedule | Day × time-slot matrix | 7 days × 4 default slots (09:00, 11:00, 14:00, 16:00). Each slot can be toggled on/off; additional slots addable | `therapist_availability` |

Tab: **Security & Privacy**

Same as patient security tab: `newPassword`, `confirmPassword`, `notificationEmail`, `notificationSms`.

Tab: **Reviews** (read-only display, no editable fields)

**Actions:** "Save Changes" → `PUT /api/therapists/me`

Avatar upload: same as patient — file input, JPG/PNG, max 5 MB, stored in object storage.

---

### 1.5 Book Appointment

**Step 1 — Package Selection**

| Field | Type | Options | Notes |
|---|---|---|---|
| `packageId` | Radio | `single` / `starter` / `professional` | Determines price |

Package definitions:

| ID | Name | Sessions | Price (INR) | Per-session |
|---|---|---|---|---|
| `single` | Single Session | 1 | ₹1,999 | ₹1,999 |
| `starter` | Starter Package | 4/month | ₹4,999 | ₹1,250 |
| `professional` | Professional Package | 8/month | ₹8,999 | ₹1,125 |

**Step 2 — Date & Time**

| Field | Type | Validation | Notes |
|---|---|---|---|
| `selectedDate` | Date button grid | Required; next 14 days only | Format: `YYYY-MM-DD` |
| `selectedTime` | Time slot button grid | Required; must be from therapist's available slots | Format: `HH:MM AM/PM` |

Time slot options (default): `09:00 AM`, `10:00 AM`, `11:00 AM`, `02:00 PM`, `03:00 PM`, `04:00 PM`, `05:00 PM`

> The backend must return only those time slots that are **not already booked** for the given therapist + date combination.

**Actions:** "Proceed to Payment" → navigate to `/checkout` with `{therapist, package, date, time}` in route state.

---

### 1.6 Checkout / Payment

**Order Summary** (display only, no user input fields):

- Therapist name, photo, first specialization
- Package name
- Date & time
- Duration: 50 minutes
- Subtotal (package price)
- GST (18%)
- Total = subtotal × 1.18 (rounded)

**Payment Method Selection**

| Field | Type | Options |
|---|---|---|
| `paymentMethod` | Radio | `card` / `upi` / `netbanking` / `wallet` |

**Card Details** (shown only when `paymentMethod === 'card'`; captured by Razorpay widget — do NOT store raw card data)

| Display Field | Notes |
|---|---|
| Card Number | Razorpay-hosted field |
| Expiry Date (MM/YY) | Razorpay-hosted field |
| CVV | Razorpay-hosted field |
| Cardholder Name | Razorpay-hosted field |

**UPI** (shown only when `paymentMethod === 'upi'`; handled by Razorpay)

| Display Field | Notes |
|---|---|
| UPI ID (e.g. `yourname@upi`) | Passed to Razorpay |

**Actions:** "Pay ₹{total}" → `POST /api/payments/create-order` → open Razorpay modal → on success `POST /api/payments/verify` → navigate to `/confirmation`.

**Cancellation Policy rules (to display and enforce):**

- Cancel ≥ 48 hours before: full refund
- Cancel 24–48 hours before: 50% refund
- Cancel < 24 hours before: no refund

---

### 1.7 Therapist Directory Filters

| Field | Type | Options / Range | Query param |
|---|---|---|---|
| `search` | `text` | Search by name or specialization | `?q=` |
| `specialization` | `select` | All SPECIALIZATIONS (see below) + "All" | `?specialization=` |
| `language` | `select` | All LANGUAGES + "All" | `?language=` |
| `feeMin` / `feeMax` | Range slider | 0 – 5000 INR | `?feeMin=&feeMax=` |
| `minRating` | `select` | 0 / 3 / 3.5 / 4 / 4.5 | `?minRating=` |
| `sortBy` | `select` | `relevance` / `rating` / `fee_asc` / `fee_desc` | `?sort=` |

Full SPECIALIZATIONS list: `Anxiety`, `Depression`, `Trauma`, `PTSD`, `OCD`, `Addiction`, `Stress Management`, `Relationship Issues`, `Work Stress`, `Self-Esteem`, `Panic Disorders`, `Grief Counseling`, `Sleep Disorders`, `Burnout`, `Family Therapy`, `Marriage Counseling`, `Parenting`, `Child Psychology`, `ADHD`, `Behavioral Issues`

Full LANGUAGES list: `English`, `Hindi`, `Tamil`, `Telugu`, `Gujarati`, `Marathi`, `Punjabi`, `Urdu`, `Bengali`, `Malayalam`

---

### 1.8 Video Consultation — Session Feedback

Submitted at session end (`/join/:appointmentId`).

| Field | Type | Validation | DB column |
|---|---|---|---|
| `rating` | Star selector (1-5) | Required | `appointments.rating` |
| `feedbackText` | `textarea` | Optional | `appointments.feedback_text` |

**Actions:** Submit → `POST /api/appointments/:id/feedback`

---

### 1.9 Notification / Settings

Located under `/settings` (Patient) and Profile Security tab (both roles).

| Field | Type | Default | DB column |
|---|---|---|---|
| `notificationEmail` | Toggle | `true` | `*_profiles.notification_email` |
| `notificationWhatsApp` | Toggle | `false` | `*_profiles.notification_sms` |
| `reminderFrequency` | Select | `24h` | `*_profiles.reminder_frequency` — options: `1h`, `6h`, `12h`, `24h`, `48h` |
| `marketingEmail` | Toggle | `false` | `*_profiles.marketing_email` |

**Actions:** "Save Settings" → `PUT /api/patients/me` or `PUT /api/therapists/me`

---

### 1.10 Support / Contact Form

| Field | Type | Validation | DB column |
|---|---|---|---|
| `category` | `select` | Required | `support_tickets.category` — options: `Technical`, `Billing`, `Appointments`, `Other` |
| `subject` | `text` | Required, max 120 chars | `support_tickets.subject` |
| `description` | `textarea` | Required, max 1000 chars | `support_tickets.description` |

**Actions:** Submit → `POST /api/support/tickets`

---

### 1.11 Lead Capture Form (Landing Page)

| Field | Type | Validation | DB column |
|---|---|---|---|
| `name` | `text` | Required | `leads.name` |
| `email` | `email` | Required, valid email | `leads.email` |
| `phone` | `tel` | Optional | `leads.phone` |

**Actions:** Submit → `POST /api/leads`

---

## 2. Database Schema

```sql
-- ─────────────────────────────────────────────
-- USERS (shared auth table)
-- ─────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('patient', 'therapist', 'admin') NOT NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PATIENT PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE patient_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(200) NOT NULL,
  phone               VARCHAR(20),
  dob                 DATE,
  gender              ENUM('Male', 'Female', 'Other'),
  occupation          VARCHAR(100),
  blood_group         ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-'),
  bio                 TEXT,
  health_interests    JSON,          -- e.g. ["Anxiety","Depression"]
  allergies           TEXT,
  medications         TEXT,
  emergency_contact   VARCHAR(255),
  avatar_url          TEXT,
  notification_email  BOOLEAN DEFAULT TRUE,
  notification_sms    BOOLEAN DEFAULT FALSE,
  marketing_email     BOOLEAN DEFAULT FALSE,
  reminder_frequency  ENUM('1h','6h','12h','24h','48h') DEFAULT '24h',
  member_since        TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- THERAPIST PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE therapist_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(200) NOT NULL,
  phone               VARCHAR(20),
  qualifications      VARCHAR(500),
  license_number      VARCHAR(100),
  experience_years    SMALLINT DEFAULT 0,
  consultation_fee    INTEGER DEFAULT 0,   -- INR
  specializations     JSON,                -- ["Anxiety","PTSD",...]
  languages           JSON,                -- ["English","Hindi",...]
  bio                 TEXT,
  location            VARCHAR(200),
  gender              ENUM('Male', 'Female', 'Other'),
  approach            TEXT,
  patient_count       INTEGER DEFAULT 0,
  response_time       VARCHAR(50),
  avatar_url          TEXT,
  notification_email  BOOLEAN DEFAULT TRUE,
  notification_sms    BOOLEAN DEFAULT FALSE,
  marketing_email     BOOLEAN DEFAULT FALSE,
  reminder_frequency  ENUM('1h','6h','12h','24h','48h') DEFAULT '24h',
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- THERAPIST AVAILABILITY (weekly schedule)
-- ─────────────────────────────────────────────
CREATE TABLE therapist_availability (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id   UUID REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  day_of_week    SMALLINT NOT NULL,   -- 0=Monday … 6=Sunday
  start_time     TIME NOT NULL,       -- e.g. 09:00
  end_time       TIME NOT NULL,       -- e.g. 09:50
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(therapist_id, day_of_week, start_time)
);

-- ─────────────────────────────────────────────
-- PACKAGES
-- ─────────────────────────────────────────────
CREATE TABLE packages (
  id           VARCHAR(50) PRIMARY KEY,   -- 'single','starter','professional'
  name         VARCHAR(100) NOT NULL,
  price        INTEGER NOT NULL,           -- INR
  sessions     SMALLINT NOT NULL,
  description  TEXT,
  is_active    BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────
-- APPOINTMENTS
-- ─────────────────────────────────────────────
CREATE TABLE appointments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID REFERENCES patient_profiles(id),
  therapist_id      UUID REFERENCES therapist_profiles(id),
  package_id        VARCHAR(50) REFERENCES packages(id),
  scheduled_date    DATE NOT NULL,
  scheduled_time    TIME NOT NULL,
  duration_minutes  SMALLINT DEFAULT 50,
  type              ENUM('Assessment','Consultation','Follow-up') DEFAULT 'Consultation',
  status            ENUM('Upcoming','In Progress','Completed','Cancelled') DEFAULT 'Upcoming',
  fee               INTEGER NOT NULL,                -- INR (incl. GST)
  payment_status    ENUM('Pending','Paid','Refunded') DEFAULT 'Pending',
  invoice_number    VARCHAR(50) UNIQUE,
  meeting_link      TEXT,
  meeting_provider  ENUM('zoom','google_meet','innoma') DEFAULT 'zoom',
  tidycal_event_id  VARCHAR(255),                    -- TidyCal booking reference
  session_notes     TEXT,
  feedback_text     TEXT,
  rating            SMALLINT CHECK (rating BETWEEN 1 AND 5),
  reschedules_left  SMALLINT DEFAULT 2,
  cancelled_at      TIMESTAMP,
  cancel_reason     TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────
CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id        UUID REFERENCES appointments(id),
  razorpay_order_id     VARCHAR(100) UNIQUE NOT NULL,
  razorpay_payment_id   VARCHAR(100),
  razorpay_signature    VARCHAR(500),
  amount                INTEGER NOT NULL,    -- INR paise (amount × 100)
  currency              VARCHAR(10) DEFAULT 'INR',
  payment_method        ENUM('card','upi','netbanking','wallet'),
  status                ENUM('created','paid','failed','refunded') DEFAULT 'created',
  refund_id             VARCHAR(100),
  refund_amount         INTEGER,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID UNIQUE REFERENCES appointments(id),
  patient_id    UUID REFERENCES patient_profiles(id),
  therapist_id  UUID REFERENCES therapist_profiles(id),
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  is_anonymous  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SUPPORT TICKETS
-- ─────────────────────────────────────────────
CREATE TABLE support_tickets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  category     ENUM('Technical','Billing','Appointments','Other') NOT NULL,
  subject      VARCHAR(120) NOT NULL,
  description  TEXT NOT NULL,
  status       ENUM('Open','In Progress','Resolved','Closed') DEFAULT 'Open',
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- LEADS
-- ─────────────────────────────────────────────
CREATE TABLE leads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200),
  email      VARCHAR(255),
  phone      VARCHAR(20),
  source     VARCHAR(100) DEFAULT 'landing_page',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS LOG
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  type        VARCHAR(50),   -- 'booking_confirmed','reminder_24h', etc.
  channel     ENUM('email','sms','whatsapp'),
  payload     JSON,
  sent_at     TIMESTAMP,
  status      ENUM('queued','sent','failed') DEFAULT 'queued',
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 3. Backend API Specification

**Base URL:** `https://api.innoma.health/v1`
**Auth:** Bearer JWT in `Authorization` header for all protected routes.
**Response envelope:**
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { "page": 1, "totalPages": 5, "total": 48 }
}
```

---

### 3.1 Auth APIs

#### `POST /api/auth/register`

Registers a new patient account.

**Request body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "dob": "1996-04-15",
  "gender": "Female",
  "occupation": "Student",
  "role": "patient"
}
```

**Validation:**
- `email` — unique, valid format
- `password` — min 8 chars, at least 1 uppercase, 1 digit
- `dob` — valid date, user must be ≥ 13 years old

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "jane@example.com",
    "role": "patient",
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Side effects:** Send welcome email.

---

#### `POST /api/auth/login`

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "expiresIn": 2592000,
    "user": {
      "id": "uuid",
      "email": "jane@example.com",
      "role": "patient",
      "name": "Jane Doe",
      "avatar": "https://..."
    }
  }
}
```

**Logic:** If `rememberMe === true` → JWT expiry = 30 days, else = 1 day. Refresh token always 30 days.

---

#### `POST /api/auth/refresh`

Refreshes an expired access token.

**Request body:**
```json
{ "refreshToken": "jwt..." }
```

**Response `200`:** New `accessToken` and `refreshToken`.

---

#### `POST /api/auth/logout`

Invalidates the refresh token (add to blocklist).

**Request:** `Authorization: Bearer <accessToken>` in header.

---

#### `POST /api/auth/forgot-password`

**Request body:**
```json
{ "email": "jane@example.com" }
```

**Side effects:** Send password-reset email with a 1-hour token link.

---

#### `POST /api/auth/reset-password`

**Request body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecure123!"
}
```

---

#### `POST /api/auth/verify-email`

**Request body:**
```json
{ "token": "email_verification_token" }
```

Sets `users.is_verified = true`.

---

### 3.2 Patient APIs

#### `GET /api/patients/me` 🔒

Returns the authenticated patient's full profile.

**Response:**
```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 98765 43210",
  "dob": "1996-04-15",
  "age": 29,
  "gender": "Female",
  "occupation": "Student",
  "bloodGroup": "O+",
  "bio": "...",
  "healthInterests": ["Anxiety", "Depression"],
  "allergies": "None",
  "medications": "None",
  "emergencyContact": "Mom - +91 99999 00000",
  "avatarUrl": "https://cdn.innoma.health/avatars/uuid.jpg",
  "notificationEmail": true,
  "notificationSms": false,
  "marketingEmail": false,
  "reminderFrequency": "24h",
  "memberSince": "2026-01-01T00:00:00Z"
}
```

---

#### `PUT /api/patients/me` 🔒

Updates patient profile. All fields optional (PATCH semantics).

**Request body:** Any subset of the fields from `GET /api/patients/me` response, plus:

```json
{
  "newPassword": "NewPass123!",
  "currentPassword": "OldPass123!"
}
```

> If `newPassword` is provided, `currentPassword` is required for verification.

**Response `200`:** Updated profile object.

---

#### `POST /api/patients/me/avatar` 🔒

Upload profile picture.

**Request:** `multipart/form-data`, field `avatar` (JPG/PNG, max 5 MB).

**Response `200`:**
```json
{ "avatarUrl": "https://cdn.innoma.health/avatars/uuid.jpg" }
```

**Logic:** Resize to 400×400, upload to S3/Cloudflare R2, update `patient_profiles.avatar_url`.

---

#### `GET /api/patients/me/dashboard` 🔒

Returns dashboard summary data.

**Response:**
```json
{
  "nextSession": {
    "appointmentId": "uuid",
    "therapistName": "Dr. Anjali Mehta",
    "therapistPhoto": "https://...",
    "date": "2026-02-28",
    "time": "14:00",
    "meetingLink": "https://zoom.us/j/123456789"
  },
  "upcomingCount": 2,
  "totalSessions": 10,
  "assessmentCompleted": true
}
```

---

### 3.3 Therapist APIs

#### `GET /api/therapists` (Public)

Returns the therapist directory with filters and pagination.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Search in name or specializations |
| `specialization` | string | Exact match |
| `language` | string | Exact match |
| `feeMin` | number | Min consultation fee |
| `feeMax` | number | Max consultation fee |
| `minRating` | number | Minimum rating (0–5) |
| `sort` | string | `relevance` / `rating` / `fee_asc` / `fee_desc` |
| `page` | number | Default 1 |
| `limit` | number | Default 12, max 50 |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Dr. Anjali Mehta",
      "photo": "https://...",
      "qualifications": "M.D. Psychiatry, Ph.D.",
      "experience": 12,
      "specializations": ["Anxiety", "Depression", "Trauma"],
      "languages": ["English", "Hindi"],
      "consultationFee": 2500,
      "rating": 4.8,
      "reviewCount": 156,
      "location": "Mumbai, Maharashtra",
      "availability": "Available Today",
      "responseTime": "~2 hours",
      "patientCount": 450,
      "gender": "Female"
    }
  ],
  "meta": { "page": 1, "totalPages": 3, "total": 8 }
}
```

---

#### `GET /api/therapists/:id` (Public)

Returns full therapist profile including testimonials.

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "Dr. Anjali Mehta",
  "photo": "https://...",
  "qualifications": "M.D. Psychiatry, Ph.D.",
  "experience": 12,
  "specializations": ["Anxiety", "Depression"],
  "languages": ["English", "Hindi"],
  "consultationFee": 2500,
  "rating": 4.8,
  "reviewCount": 156,
  "bio": "...",
  "location": "Mumbai, Maharashtra",
  "availability": "Available Today",
  "responseTime": "~2 hours",
  "patientCount": 450,
  "approach": "CBT combined with mindfulness",
  "gender": "Female",
  "licenseNumber": "MH-PSY-2012-45678",
  "testimonials": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Life-changing experience.",
      "author": "Anonymous Patient",
      "date": "2025-12-15"
    }
  ]
}
```

---

#### `GET /api/therapists/me` 🔒 (Therapist only)

Returns the authenticated therapist's own profile.

---

#### `PUT /api/therapists/me` 🔒 (Therapist only)

Updates therapist profile. All fields optional.

**Request body:**
```json
{
  "fullName": "Dr. Anjali Mehta",
  "phone": "+91 98765 43210",
  "qualifications": "M.D. Psychiatry",
  "licenseNumber": "MH-PSY-2012-45678",
  "experience": 12,
  "consultationFee": 2500,
  "specializations": ["Anxiety", "Depression"],
  "languages": ["English", "Hindi"],
  "bio": "...",
  "newPassword": "optional",
  "currentPassword": "required_if_newPassword_present",
  "notificationEmail": true,
  "notificationSms": false
}
```

---

#### `POST /api/therapists/me/avatar` 🔒 (Therapist only)

Same as patient avatar upload.

---

#### `GET /api/therapists/:id/availability` (Public)

Returns available time slots for a specific therapist on a given date.

**Query params:** `?date=2026-03-01`

**Response `200`:**
```json
{
  "date": "2026-03-01",
  "therapistId": "uuid",
  "availableSlots": ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
  "bookedSlots": ["10:00 AM"]
}
```

**Logic:**
1. Fetch `therapist_availability` for that `day_of_week`
2. Subtract already-booked appointments for that date
3. Return the remaining free slots

---

#### `PUT /api/therapists/me/availability` 🔒 (Therapist only)

Sets the therapist's weekly availability schedule.

**Request body:**
```json
{
  "schedule": [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "09:50", "isActive": true },
    { "dayOfWeek": 0, "startTime": "11:00", "endTime": "11:50", "isActive": true },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "09:50", "isActive": false }
  ]
}
```

**Logic:** Upsert rows in `therapist_availability`. Inactive slots are soft-deleted (set `is_active = false`).

---

#### `GET /api/therapists/me/dashboard` 🔒 (Therapist only)

Returns therapist dashboard summary.

**Response `200`:**
```json
{
  "totalPatients": 450,
  "sessionsThisWeek": 8,
  "todaysSessions": 3,
  "averageRating": 4.8,
  "upcomingSessions": [
    {
      "appointmentId": "uuid",
      "patientName": "Priya Sharma",
      "patientPhoto": "https://...",
      "date": "2026-02-25",
      "time": "14:00",
      "type": "Consultation",
      "meetingLink": "https://zoom.us/j/..."
    }
  ]
}
```

---

#### `GET /api/therapists/me/patients` 🔒 (Therapist only)

Returns the therapist's patient list.

**Response `200`:** Array of patient objects with `name`, `photo`, `age`, `gender`, `occupation`, `email`, `phone`, `since`, `status`, `lastVisit`, `upcomingSession`, `diagnosis`, `totalSessions`, `notes`.

---

### 3.4 Appointment / Booking APIs

#### `POST /api/appointments` 🔒

Creates a new appointment booking. This is the central action triggered after payment success.

**Request body:**
```json
{
  "therapistId": "uuid",
  "packageId": "single",
  "scheduledDate": "2026-03-01",
  "scheduledTime": "14:00",
  "type": "Consultation",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "sig_xxx"
}
```

**Logic:**
1. Verify Razorpay payment signature
2. Check the slot is still available (race-condition guard)
3. Create `appointments` row (status = `Upcoming`, paymentStatus = `Paid`)
4. Generate invoice number: `INN-{YEAR}-{SEQUENCE}`
5. **Call TidyCal API** to create a calendar event (see §4)
6. **Generate meeting link** via Zoom or Google Meet API (see §5)
7. Store `meeting_link` and `tidycal_event_id` on the appointment
8. Send booking-confirmation email + WhatsApp/SMS (if opted in)
9. Schedule reminder notifications (24h and 1h before)
10. Return full appointment object

**Response `201`:**
```json
{
  "id": "uuid",
  "invoiceNumber": "INN-2026-0047",
  "status": "Upcoming",
  "paymentStatus": "Paid",
  "meetingLink": "https://zoom.us/j/987654321",
  "scheduledDate": "2026-03-01",
  "scheduledTime": "14:00",
  "therapist": { "name": "Dr. Anjali Mehta", "photo": "..." },
  "package": { "name": "Single Session", "price": 1999 },
  "total": 2359
}
```

---

#### `GET /api/appointments` 🔒

Returns all appointments for the authenticated user (patient or therapist).

**Query params:**
| Param | Description |
|---|---|
| `status` | Filter by `Upcoming` / `Completed` / `Cancelled` |
| `role` | Auto-detected from JWT |
| `page`, `limit` | Pagination |

---

#### `GET /api/appointments/:id` 🔒

Returns full details of a single appointment. Accessible only by the patient or therapist belonging to it.

---

#### `POST /api/appointments/:id/reschedule` 🔒

**Request body:**
```json
{
  "newDate": "2026-03-05",
  "newTime": "11:00 AM"
}
```

**Logic:**
1. Check `reschedules_left > 0`
2. Verify new slot availability
3. Update appointment date/time, decrement `reschedules_left`
4. **Update TidyCal event** (see §4)
5. **Regenerate meeting link** if needed
6. Send rescheduling confirmation notifications

---

#### `POST /api/appointments/:id/cancel` 🔒

**Request body:**
```json
{ "reason": "Personal emergency" }
```

**Logic:**
1. Set `status = Cancelled`, `cancelled_at = NOW()`
2. Calculate refund based on cancellation policy:
   - ≥ 48h before → full refund
   - 24–48h before → 50% refund
   - < 24h before → no refund
3. If refund applies → call `POST /api/payments/refund`
4. **Cancel TidyCal event** (see §4)
5. Send cancellation email with refund details

---

#### `POST /api/appointments/:id/feedback` 🔒

Submits post-session rating and feedback.

**Request body:**
```json
{
  "rating": 5,
  "feedbackText": "Excellent session, very helpful."
}
```

**Logic:**
1. Verify `status === 'Completed'`
2. Update `appointments.rating` and `appointments.feedback_text`
3. Insert row into `reviews`
4. Recompute `therapist_profiles.rating` (rolling average)

---

#### `POST /api/appointments/:id/join` 🔒

Records that the user has joined the session and returns the meeting link.

**Response `200`:**
```json
{
  "meetingLink": "https://zoom.us/j/987654321",
  "sessionStartsAt": "2026-03-01T14:00:00+05:30"
}
```

**Logic:**
- If within 15 minutes of session start → set `status = 'In Progress'`
- Return `meeting_link` from the appointment record

---

#### `POST /api/appointments/:id/notes` 🔒 (Therapist only)

Saves therapist session notes.

**Request body:**
```json
{ "notes": "Patient showing improvement in anxiety management..." }
```

---

### 3.5 Payment APIs (Razorpay)

#### `POST /api/payments/create-order`

Creates a Razorpay order before showing the payment modal.

**Request body:**
```json
{
  "therapistId": "uuid",
  "packageId": "single",
  "scheduledDate": "2026-03-01",
  "scheduledTime": "14:00"
}
```

**Logic:**
1. Calculate: `subtotal = package.price`, `gst = subtotal × 0.18`, `total = subtotal + gst`
2. Create Razorpay order via `POST https://api.razorpay.com/v1/orders` with `amount = total × 100` (paise)
3. Store pending row in `payments`

**Response `200`:**
```json
{
  "razorpayOrderId": "order_xxx",
  "amount": 235900,
  "currency": "INR",
  "keyId": "rzp_live_xxx"
}
```

---

#### `POST /api/payments/verify`

Verifies Razorpay payment signature after the modal closes.

**Request body:**
```json
{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "sig_xxx"
}
```

**Logic:**
1. Compute `HMAC-SHA256(razorpayOrderId + "|" + razorpayPaymentId, razorpay_key_secret)`
2. Compare with `razorpaySignature`
3. If valid → update `payments.status = 'paid'`, return success
4. If invalid → return 400 error

---

#### `POST /api/payments/refund`

Internal — called by the cancel flow.

**Request body:**
```json
{
  "appointmentId": "uuid",
  "refundPercent": 100
}
```

**Logic:** Call Razorpay refund API, update `payments.status = 'refunded'`, update appointment `payment_status = 'Refunded'`.

---

#### `GET /api/payments/:appointmentId/invoice`

Returns signed URL for downloading the PDF invoice.

---

### 3.6 Notification APIs

These endpoints are primarily internal (called by cron jobs or event hooks), but are documented for completeness.

#### `POST /api/notifications/send` (Internal)

**Request body:**
```json
{
  "userId": "uuid",
  "type": "booking_confirmed",
  "channel": "email",
  "payload": {
    "appointmentId": "uuid",
    "therapistName": "Dr. Anjali Mehta",
    "date": "2026-03-01",
    "time": "14:00",
    "meetingLink": "https://zoom.us/j/..."
  }
}
```

**Notification types to implement:**

| Type | Trigger | Channels |
|---|---|---|
| `booking_confirmed` | Appointment created | Email, SMS/WhatsApp |
| `reminder_24h` | 24h before session | Email, SMS/WhatsApp |
| `reminder_1h` | 1h before session | SMS/WhatsApp |
| `session_starting` | 5 min before session | Push/email |
| `appointment_cancelled` | Cancellation | Email, SMS/WhatsApp |
| `appointment_rescheduled` | Reschedule | Email, SMS/WhatsApp |
| `refund_processed` | Refund issued | Email |
| `welcome` | Registration | Email |
| `password_reset` | Forgot password | Email |
| `review_requested` | Session completed | Email |

---

### 3.7 Review & Rating APIs

#### `GET /api/reviews?therapistId=uuid`

Public endpoint. Returns paginated reviews for a therapist.

**Response:** Array of `{ id, rating, comment, author, date, isAnonymous }`.

---

### 3.8 Support / Ticket APIs

#### `POST /api/support/tickets` 🔒

**Request body:**
```json
{
  "category": "Billing",
  "subject": "Refund not received",
  "description": "I cancelled 3 days ago but..."
}
```

**Response `201`:** Created ticket with `id`, `status: 'Open'`, `createdAt`.

---

#### `GET /api/support/tickets` 🔒

Returns all tickets for the authenticated user.

---

#### `GET /api/support/tickets/:id` 🔒

Returns a single ticket.

---

### 3.9 Lead APIs

#### `POST /api/leads` (Public)

**Request body:**
```json
{
  "name": "Arjun Kapoor",
  "email": "arjun@example.com",
  "phone": "+91 99999 11111"
}
```

**Side effects:** Add to email marketing list (optional), notify sales team.

**Response `201`:** `{ "success": true }` — do not expose the lead ID.

---

## 4. Scheduling Integration — TidyCal

### Overview

TidyCal is used to manage therapist calendar availability and create bookable event types. When a patient books a session on Innoma Healthcare, the backend creates a corresponding TidyCal booking to keep the therapist's external calendar in sync.

### TidyCal API Base URL

```
https://tidycal.com/api
```

### Authentication

All TidyCal API calls use a **personal API token** (Bearer token) generated from the TidyCal dashboard:

```
Authorization: Bearer {TIDYCAL_API_TOKEN}
```

Store as `TIDYCAL_API_TOKEN` in environment variables. Each therapist must connect their TidyCal account, or a **single shared Innoma TidyCal account** can be used with one event type per therapist.

---

### TidyCal Setup — Recommended Architecture

**Option A (Recommended) — Shared account, one event type per therapist:**

1. Create one TidyCal account: `innoma-health@...`
2. For each therapist, create an Event Type named `"Dr. {Name} - 50 min Consultation"` with duration = 50 min
3. Store `tidycal_event_type_id` in `therapist_profiles`
4. When booking, create a booking under the therapist's event type

**Option B — Each therapist has their own TidyCal account:**

1. Therapist connects TidyCal during onboarding (OAuth flow)
2. Store `tidycal_access_token` in `therapist_profiles`
3. Use each therapist's own token for booking operations

---

### Key TidyCal API Endpoints

#### 1. List Event Types

```http
GET https://tidycal.com/api/event-types
Authorization: Bearer {TIDYCAL_API_TOKEN}
```

**Response:**
```json
{
  "data": [
    {
      "id": 12345,
      "name": "Dr. Anjali Mehta - 50 min Consultation",
      "slug": "dr-anjali-50",
      "duration": 50,
      "is_active": true
    }
  ]
}
```

Store `id` as `therapist_profiles.tidycal_event_type_id`.

---

#### 2. Get Available Time Slots

```http
GET https://tidycal.com/api/bookings/slots?event_type_id=12345&date=2026-03-01
Authorization: Bearer {TIDYCAL_API_TOKEN}
```

**Response:**
```json
{
  "data": [
    { "starts_at": "2026-03-01T09:00:00+05:30" },
    { "starts_at": "2026-03-01T11:00:00+05:30" },
    { "starts_at": "2026-03-01T14:00:00+05:30" }
  ]
}
```

Use this endpoint in `GET /api/therapists/:id/availability` to return **real availability** instead of hardcoded slots.

---

#### 3. Create a Booking

Called from `POST /api/appointments` after payment verification.

```http
POST https://tidycal.com/api/bookings
Authorization: Bearer {TIDYCAL_API_TOKEN}
Content-Type: application/json
```

**Request body:**
```json
{
  "event_type_id": 12345,
  "starts_at": "2026-03-01T14:00:00+05:30",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "note": "Booking ref: INN-2026-0047",
  "timezone": "Asia/Kolkata"
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "tc_bk_abc123",
    "event_type_id": 12345,
    "starts_at": "2026-03-01T14:00:00+05:30",
    "ends_at": "2026-03-01T14:50:00+05:30",
    "cancel_url": "https://tidycal.com/bookings/tc_bk_abc123/cancel",
    "reschedule_url": "https://tidycal.com/bookings/tc_bk_abc123/reschedule",
    "status": "confirmed"
  }
}
```

Store `data.id` as `appointments.tidycal_event_id`.

---

#### 4. Cancel a Booking

Called from `POST /api/appointments/:id/cancel`.

```http
DELETE https://tidycal.com/api/bookings/{tidycal_event_id}
Authorization: Bearer {TIDYCAL_API_TOKEN}
```

**Response `200`:** `{ "success": true }`

---

#### 5. Reschedule a Booking

TidyCal does not natively support rescheduling via API; the recommended approach is:

1. Cancel the existing TidyCal booking (`DELETE /api/bookings/:id`)
2. Create a new booking at the new date/time (`POST /api/bookings`)
3. Update `appointments.tidycal_event_id` with the new booking ID

---

### TidyCal — Therapist Onboarding Steps

1. Admin creates Event Type for the therapist in TidyCal dashboard
2. Set duration = 50 minutes
3. Set **buffer time** = 10 minutes between appointments
4. Set **advance notice** = 24 hours minimum
5. Set **max booking window** = 14 days ahead (matches frontend)
6. **Enable Google Calendar sync** in TidyCal settings (under Connected Calendars) — blocks slots when therapist has other events
7. Store the Event Type ID in `therapist_profiles.tidycal_event_type_id`

---

### TidyCal — Availability Sync Flow

```
GET /api/therapists/:id/availability?date=YYYY-MM-DD
    │
    ├── Query therapist_availability (weekly base schedule)
    │
    ├── Call TidyCal GET /bookings/slots?event_type_id=X&date=YYYY-MM-DD
    │       └── Returns slots TidyCal considers free
    │
    ├── Query appointments WHERE therapist_id=X AND date=YYYY-MM-DD AND status != 'Cancelled'
    │       └── Subtract already-booked Innoma slots
    │
    └── Return intersection of all three → final available slots list
```

---

## 5. Meeting Link Integration — Google Meet & Zoom

The platform supports **both** Google Meet and Zoom. The preferred provider per therapist (or globally) is configured via the `MEETING_PROVIDER` environment variable or a per-therapist setting stored in `therapist_profiles.preferred_meeting_provider`.

---

### 5.1 Google Meet Integration

#### How It Works

Google Meet links are generated by creating a **Google Calendar Event** with `conferenceData`. The resulting event includes a `hangoutLink` that serves as the meeting URL.

#### Prerequisites

1. Google Cloud project with **Google Calendar API** enabled
2. A service account with **domain-wide delegation** (for Workspace users) OR OAuth 2.0 credentials for user-based access
3. **Scopes required:**
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   ```

#### Environment Variables

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://api.innoma.health/auth/google/callback
GOOGLE_SERVICE_ACCOUNT_KEY_JSON='{...}'   # For service account auth
```

#### Step-by-step: Generate a Google Meet Link

**Step 1 — Authenticate (Service Account)**

```javascript
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
const calendar = google.calendar({ version: 'v3', auth });
```

**Step 2 — Create Calendar Event with Conference**

```javascript
async function createGoogleMeetLink({ therapistEmail, patientName, startISO, endISO, summary }) {
  const event = {
    summary: `${summary} — Innoma Healthcare`,
    description: `Online therapy session via Innoma Healthcare`,
    start: { dateTime: startISO, timeZone: 'Asia/Kolkata' },
    end:   { dateTime: endISO,   timeZone: 'Asia/Kolkata' },
    attendees: [
      { email: therapistEmail },
    ],
    conferenceData: {
      createRequest: {
        requestId: `innoma-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    resource: event,
  });

  return response.data.hangoutLink; // e.g. "https://meet.google.com/abc-defg-hij"
}
```

**Step 3 — Store and return the link**

```javascript
const meetingLink = await createGoogleMeetLink({ ... });
await db.appointments.update({ id: appointmentId }, { meeting_link: meetingLink });
```

#### Full API Call Reference

```http
POST https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1
Authorization: Bearer {GOOGLE_ACCESS_TOKEN}
Content-Type: application/json

{
  "summary": "Dr. Anjali Mehta — Therapy Session",
  "start": { "dateTime": "2026-03-01T14:00:00+05:30", "timeZone": "Asia/Kolkata" },
  "end":   { "dateTime": "2026-03-01T14:50:00+05:30", "timeZone": "Asia/Kolkata" },
  "attendees": [{ "email": "patient@example.com" }],
  "conferenceData": {
    "createRequest": {
      "requestId": "innoma-unique-id-123",
      "conferenceSolutionKey": { "type": "hangoutsMeet" }
    }
  }
}
```

**Response field to extract:**
```json
{
  "hangoutLink": "https://meet.google.com/abc-defg-hij",
  "conferenceData": {
    "conferenceId": "abc-defg-hij",
    "entryPoints": [
      { "entryPointType": "video", "uri": "https://meet.google.com/abc-defg-hij" }
    ]
  }
}
```

---

### 5.2 Zoom Integration

#### How It Works

Zoom meeting links are generated via the **Zoom API v2** by creating a meeting on behalf of the therapist's Zoom account (using Server-to-Server OAuth or JWT).

#### Recommended Auth: Server-to-Server OAuth

1. Create a **Server-to-Server OAuth** app in the Zoom Marketplace
2. Grant scopes: `meeting:write:admin`, `user:read:admin`
3. Get: `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`

#### Environment Variables

```env
ZOOM_ACCOUNT_ID=...
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
ZOOM_USER_EMAIL=innoma-host@example.com   # The Zoom account that hosts all meetings
```

#### Step-by-step: Generate a Zoom Meeting Link

**Step 1 — Get Access Token**

```javascript
async function getZoomAccessToken() {
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  const data = await response.json();
  return data.access_token; // Cache this — expires in 1 hour
}
```

**Step 2 — Create Meeting**

```javascript
async function createZoomMeeting({ therapistName, patientName, startISO, durationMinutes = 50 }) {
  const accessToken = await getZoomAccessToken();

  const response = await fetch(
    `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_EMAIL}/meetings`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: `Therapy Session — ${therapistName} & ${patientName}`,
        type: 2,                            // Scheduled meeting
        start_time: startISO,               // ISO 8601 UTC
        duration: durationMinutes,
        timezone: 'Asia/Kolkata',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          waiting_room: true,               // HIPAA-friendly
          auto_recording: 'none',           // No auto-recording for privacy
          encryption_type: 'enhanced_encryption',
          mute_upon_entry: false,
        },
      }),
    }
  );

  const meeting = await response.json();
  return {
    meetingId: meeting.id,
    joinUrl: meeting.join_url,              // Patient join link
    startUrl: meeting.start_url,            // Therapist host link
    password: meeting.password,
  };
}
```

**Step 3 — Store in DB**

```javascript
const { joinUrl, startUrl, meetingId } = await createZoomMeeting({ ... });
await db.appointments.update({
  id: appointmentId,
  meeting_link: joinUrl,              // Sent to patient
  meeting_host_link: startUrl,        // Sent to therapist only
  meeting_provider: 'zoom',
});
```

#### Full API Reference

```http
POST https://api.zoom.us/v2/users/{userId}/meetings
Authorization: Bearer {ZOOM_ACCESS_TOKEN}
Content-Type: application/json

{
  "topic": "Therapy Session — Dr. Anjali Mehta",
  "type": 2,
  "start_time": "2026-03-01T08:30:00Z",
  "duration": 50,
  "timezone": "Asia/Kolkata",
  "settings": {
    "host_video": true,
    "participant_video": true,
    "waiting_room": true,
    "join_before_host": false,
    "auto_recording": "none",
    "encryption_type": "enhanced_encryption"
  }
}
```

**Response fields to extract:**

| Field | Use |
|---|---|
| `join_url` | Meeting link for the **patient** |
| `start_url` | Host link for the **therapist** |
| `id` | Zoom meeting ID (for updates/deletion) |
| `password` | Optional — include in emails |

#### Cancel / Delete a Zoom Meeting

```http
DELETE https://api.zoom.us/v2/meetings/{meetingId}
Authorization: Bearer {ZOOM_ACCESS_TOKEN}
```

#### Update a Zoom Meeting (for reschedule)

```http
PATCH https://api.zoom.us/v2/meetings/{meetingId}
Authorization: Bearer {ZOOM_ACCESS_TOKEN}
Content-Type: application/json

{
  "start_time": "2026-03-05T08:30:00Z"
}
```

---

### 5.3 Provider Selection Logic

```javascript
// In appointment creation service
async function generateMeetingLink(appointment) {
  const provider = process.env.MEETING_PROVIDER || 'zoom'; // 'zoom' | 'google_meet'

  if (provider === 'zoom') {
    return createZoomMeeting({ ... });
  } else if (provider === 'google_meet') {
    return createGoogleMeetLink({ ... });
  }
}
```

---

## 6. End-to-End Booking Flow (Combined)

```
PATIENT                   FRONTEND                  BACKEND                     TIDYCAL / ZOOM / RAZORPAY
─────────                 ────────                  ───────                     ────────────────────────
1. Browse therapists   →  GET /therapists           ─→ Query DB with filters
2. View profile        →  GET /therapists/:id       ─→ Return full profile
3. Select slot         →  GET /therapists/:id/
                          availability?date=X       ─→ TidyCal slots - booked = free slots
4. Select package      →  (local state)
5. Click "Pay"         →  POST /payments/
                          create-order              ─→ Compute subtotal+GST
                                                    ─→ POST Razorpay /orders      → Razorpay: returns order_id
                          ← { orderId, amount }
6. Razorpay modal      →  (Razorpay widget)         ─────────────────────────── → Razorpay handles card/UPI
   opens & user pays                                                             ← payment_id + signature
7. Payment success     →  POST /payments/verify     ─→ Verify HMAC signature
                                                    ─→ Mark payment Paid
8. Create booking      →  POST /appointments        ─→ Insert appointment row
                                                    ─→ POST TidyCal /bookings    → TidyCal: blocks slot
                                                    ─→ POST Zoom /meetings       → Zoom: returns join_url
                                                    ─→ Store meeting_link
                                                    ─→ Queue notifications
                          ← { invoiceNumber,
                              meetingLink, ... }
9. Confirmation page   →  /confirmation             Show invoice + meeting link
10. Reminder (24h)     ←  CRON job                  ─→ Send email + WhatsApp reminder
11. Join session       →  POST /appointments/:id/   ─→ Set status = In Progress
                          join                      ─→ Return meetingLink
12. Session ends       →  POST /appointments/:id/   ─→ Set status = Completed
                          feedback                  ─→ Save rating/feedback
                                                    ─→ Update therapist avg rating
```

---

## 7. Notification System

### Channels

| Channel | Provider | Config |
|---|---|---|
| Email | SendGrid / AWS SES | `SENDGRID_API_KEY` or `AWS_SES_*` |
| SMS | Twilio / AWS SNS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` |
| WhatsApp | Twilio WhatsApp Business API | Same Twilio credentials |

### Notification Templates

#### `booking_confirmed` (Email)

**Subject:** `Your session with {therapistName} is confirmed — {date} at {time}`

**Body includes:**
- Session date, time, duration
- Therapist name + photo
- Meeting link (clickable button)
- Invoice number
- Cancellation policy reminder
- Calendar add buttons (.ics link)

#### `reminder_24h` (Email + WhatsApp)

**Subject:** `Reminder: Your session with {therapistName} is tomorrow`

**Body includes:**
- Date, time, meeting link
- Device check tips

#### `reminder_1h` (SMS + WhatsApp)

Short message: `Your Innoma Healthcare session with Dr. {name} starts in 1 hour. Join here: {meetingLink}`

### Cron Jobs Required

```
Every minute:  Check appointments starting in 5 min  → send push/email alert
Every hour:    Check appointments starting in 1h     → send SMS/WhatsApp reminder
Every day 8AM: Check appointments starting in 24h   → send email reminder
```

---

## 8. Security & Compliance

| Area | Implementation |
|---|---|
| Authentication | JWT (access: 1d, refresh: 30d), bcrypt password hashing (cost factor 12) |
| Authorization | RBAC — patient / therapist / admin roles enforced on every protected route |
| Data encryption | TLS 1.3 in transit; AES-256 at rest for sensitive PHI fields |
| HIPAA alignment | No session recordings by default (Zoom: `auto_recording: none`), waiting rooms enabled, audit logs for data access |
| Payment | Razorpay handles all card data (PCI-DSS compliant); never store raw card details |
| Rate limiting | 100 req/min per IP on public routes; 300 req/min for authenticated users |
| CORS | Whitelist only `https://innoma.health` and `https://www.innoma.health` |
| File uploads | Validate MIME type + file size server-side before uploading to object storage |
| Input sanitisation | Validate and sanitise all user inputs; parameterised queries (no raw SQL concatenation) |
| Meeting links | Zoom waiting room + password required; Google Meet link distributed only to booked parties |

---

## 9. Environment Variables Reference

```env
# ── App ──────────────────────────────────────────────
NODE_ENV=production
PORT=4000
API_BASE_URL=https://api.innoma.health/v1
FRONTEND_URL=https://innoma.health

# ── Database ─────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/innoma

# ── JWT ──────────────────────────────────────────────
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=30d

# ── Razorpay ─────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx

# ── TidyCal ──────────────────────────────────────────
TIDYCAL_API_TOKEN=tc_xxx
TIDYCAL_BASE_URL=https://tidycal.com/api

# ── Zoom ─────────────────────────────────────────────
MEETING_PROVIDER=zoom                # 'zoom' | 'google_meet'
ZOOM_ACCOUNT_ID=xxx
ZOOM_CLIENT_ID=xxx
ZOOM_CLIENT_SECRET=xxx
ZOOM_USER_EMAIL=host@innoma.health

# ── Google Meet ──────────────────────────────────────
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://api.innoma.health/auth/google/callback
GOOGLE_SERVICE_ACCOUNT_KEY_JSON='{...}'

# ── Email ────────────────────────────────────────────
EMAIL_PROVIDER=sendgrid              # 'sendgrid' | 'ses'
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@innoma.health
EMAIL_FROM_NAME=Innoma Healthcare

# ── SMS / WhatsApp ───────────────────────────────────
TWILIO_ACCOUNT_SID=AC_xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# ── Object Storage ───────────────────────────────────
STORAGE_PROVIDER=s3                  # 's3' | 'r2'
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-south-1
S3_BUCKET=innoma-uploads

# ── Frontend (Vite) ──────────────────────────────────
VITE_API_BASE_URL=https://api.innoma.health/v1
VITE_RAZORPAY_KEY_ID=rzp_live_xxx
```

---

*End of specification document. This covers all frontend form fields, every required backend API, the complete TidyCal scheduling integration, and the Google Meet / Zoom meeting link generation workflows.*
