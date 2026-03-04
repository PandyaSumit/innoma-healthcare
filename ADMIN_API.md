# Innoma Healthcare — Admin API Reference

All admin endpoints live under `/api/admin/*`.
Every request **must** include:

```
Authorization: Bearer <accessToken>   (admin role required)
Content-Type: application/json
```

All responses follow:
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description", "statusCode": 4xx }
```

Pagination meta (where applicable):
```json
"meta": { "page": 1, "totalPages": 5, "total": 98 }
```

---

## 1. Therapist Management

Base: `/api/admin/therapists`

---

### `GET /api/admin/therapists`
List all therapists with booking stats.

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (max 100, default: 20) |
| `q` | string | Search by name or specialization |
| `isActive` | boolean | Filter by `true` / `false` |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Dr. Priya Shah",
      "email": "priya@example.com",
      "phone": "+919876543210",
      "qualifications": "MBBS, MD Psychiatry",
      "licenseNumber": "MCI-12345",
      "experienceYears": 8,
      "consultationFee": 1500,
      "specializations": ["Anxiety", "Depression"],
      "languages": ["English", "Hindi"],
      "rating": 4.7,
      "reviewCount": 34,
      "patientCount": 120,
      "isActive": true,
      "avatarUrl": "https://...",
      "location": "Mumbai",
      "gender": "Female",
      "totalBookings": 145,
      "completedSessions": 130,
      "upcomingBookings": 5,
      "totalRevenue": 195000,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": { "page": 1, "totalPages": 3, "total": 52 }
}
```

---

### `POST /api/admin/therapists`
Create a new therapist account (pre-verified, no email confirmation needed).

**Request body**
```json
{
  "fullName": "Dr. Arjun Mehta",
  "email": "arjun@example.com",
  "password": "SecurePass@123",
  "phone": "+919876543210",
  "qualifications": "MBBS, MD Psychiatry",
  "licenseNumber": "MCI-67890",
  "experience": 5,
  "consultationFee": 1200,
  "specializations": ["CBT", "Trauma"],
  "languages": ["English", "Gujarati"],
  "bio": "Experienced therapist...",
  "location": "Ahmedabad",
  "gender": "Male",
  "tidycalEventTypeId": 12345
}
```

**Response `201`**
```json
{
  "userId": "uuid",
  "therapistProfileId": "uuid",
  "email": "arjun@example.com"
}
```

---

### `GET /api/admin/therapists/:id`
Get full profile of one therapist.

**Response `200`**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Dr. Arjun Mehta",
  "email": "arjun@example.com",
  "phone": "+919876543210",
  "qualifications": "MBBS",
  "licenseNumber": "MCI-67890",
  "experienceYears": 5,
  "consultationFee": 1200,
  "specializations": ["CBT", "Trauma"],
  "languages": ["English"],
  "bio": "...",
  "location": "Ahmedabad",
  "gender": "Male",
  "tidycalEventTypeId": 12345,
  "isActive": true,
  "rating": 0,
  "reviewCount": 0,
  "avatarUrl": null,
  "createdAt": "2024-03-01T09:00:00Z"
}
```

---

### `PUT /api/admin/therapists/:id`
Update any field of a therapist. All fields are optional (partial update).
Admin can reset password without knowing the current one.

**Request body** (all fields optional)
```json
{
  "fullName": "Dr. Arjun Mehta",
  "email": "newemail@example.com",
  "password": "NewPassword@456",
  "phone": "+919999999999",
  "qualifications": "MBBS, DPM",
  "licenseNumber": "MCI-NEW",
  "experience": 6,
  "consultationFee": 1500,
  "specializations": ["CBT", "EMDR"],
  "languages": ["English", "Hindi"],
  "bio": "Updated bio",
  "location": "Surat",
  "gender": "Male",
  "isActive": true,
  "tidycalEventTypeId": 99999
}
```

**Response `200`** — same as `GET /api/admin/therapists/:id`

---

### `PATCH /api/admin/therapists/:id/toggle-status`
Toggle therapist active/inactive status.

**Request body**
```json
{ "isActive": false }
```

**Response `200`**
```json
{ "id": "uuid", "isActive": false }
```

---

### `GET /api/admin/therapists/:id/bookings`
Fetch past/upcoming bookings for a specific therapist.

**Query params**
| Param | Type | Values |
|-------|------|--------|
| `status` | string | `Upcoming` \| `In Progress` \| `Completed` \| `Cancelled` (omit for all) |
| `page` | number | Default: 1 |
| `limit` | number | Max 100, default: 20 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "Consultation",
      "status": "Completed",
      "scheduledDate": "2024-03-10",
      "scheduledTime": "11:00",
      "fee": 1500,
      "paymentStatus": "Paid",
      "meetingLink": "https://zoom.us/j/...",
      "invoiceNumber": "INN-2024-0042",
      "patient": {
        "name": "Riya Kapoor",
        "avatarUrl": null,
        "phone": "+919898989898"
      },
      "sessionNotes": "Patient showed improvement...",
      "rating": 5,
      "feedbackText": "Very helpful session."
    }
  ],
  "meta": { "page": 1, "totalPages": 2, "total": 35 }
}
```

---

### `PATCH /api/admin/therapists/appointments/:appointmentId/complete`
Admin override to mark any appointment as Completed (cannot complete Cancelled appointments).

**No request body required.**

**Response `200`** — full appointment object with `"status": "Completed"`

---

## 2. Finance

Base: `/api/admin/finance`

---

### `GET /api/admin/finance/summary`
Overall revenue dashboard summary.

**Response `200`**
```json
{
  "totalRevenue": 850000,
  "totalRefunds": 15000,
  "netRevenue": 835000,
  "totalTransactions": 560,
  "pendingRevenue": 45000,
  "thisMonthRevenue": 120000,
  "lastMonthRevenue": 98000,
  "growthPercent": 22
}
```
> All amounts in **INR** (rupees). `growthPercent` is `null` if last month had zero revenue.

---

### `GET /api/admin/finance/payments`
Date-wise paginated payment records with therapist + patient info.

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `fromDate` | string | ISO date e.g. `2024-01-01` |
| `toDate` | string | ISO date e.g. `2024-03-31` |
| `therapistId` | string | Filter by therapist profile UUID |
| `page` | number | Default: 1 |
| `limit` | number | Max 100, default: 20 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "razorpayOrderId": "order_XXXX",
      "razorpayPaymentId": "pay_XXXX",
      "amount": 1500,
      "currency": "INR",
      "paymentMethod": "upi",
      "status": "paid",
      "refundId": null,
      "refundAmount": null,
      "appointment": {
        "id": "uuid",
        "date": "2024-03-10",
        "time": "11:00",
        "invoiceNumber": "INN-2024-0042",
        "therapistName": "Dr. Priya Shah",
        "patientName": "Riya Kapoor"
      },
      "createdAt": "2024-03-10T11:30:00Z"
    }
  ],
  "meta": { "page": 1, "totalPages": 10, "total": 198 }
}
```

---

### `GET /api/admin/finance/chart/daily`
Daily revenue data for charts.

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `days` | number | Number of past days (default: 30) |

**Response `200`**
```json
[
  { "date": "2024-03-01", "revenue": 9000, "transactions": 6 },
  { "date": "2024-03-02", "revenue": 12000, "transactions": 8 }
]
```

---

### `GET /api/admin/finance/therapists/:therapistId/revenue`
Monthly revenue breakdown for one therapist.

**Response `200`**
```json
{
  "therapistId": "uuid",
  "therapistName": "Dr. Priya Shah",
  "totalRevenue": 420000,
  "totalSessions": 280,
  "monthlyBreakdown": [
    { "month": "2024-03", "revenue": 45000, "sessions": 30 },
    { "month": "2024-02", "revenue": 38000, "sessions": 25 }
  ]
}
```

---

## 3. Articles (Blog)

Base: `/api/admin/articles`

---

### `GET /api/admin/articles`
List all articles (all statuses: draft, published, archived).

**Query params**
| Param | Type | Values |
|-------|------|--------|
| `status` | string | `draft` \| `published` \| `archived` |
| `category` | string | Filter by category string |
| `page` | number | Default: 1 |
| `limit` | number | Max 50, default: 10 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Managing Anxiety at Work",
      "slug": "managing-anxiety-at-work",
      "excerpt": "Quick summary...",
      "category": "Mental Health",
      "tags": ["anxiety", "workplace"],
      "coverImageUrl": "https://...",
      "isFeatured": true,
      "status": "published",
      "publishedAt": "2024-03-01T00:00:00Z",
      "readTimeMinutes": 5,
      "viewsCount": 342,
      "authorId": "uuid",
      "authorName": "Dr. Priya Shah",
      "createdAt": "2024-02-28T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "totalPages": 4, "total": 38 }
}
```
> `content` field is excluded from list responses for performance.

---

### `POST /api/admin/articles`
Create a new article. Slug is auto-generated from title.

**Request body**
```json
{
  "title": "Understanding Depression",
  "content": "Full markdown or HTML content...",
  "excerpt": "A short summary shown in cards.",
  "category": "Mental Health",
  "tags": ["depression", "awareness"],
  "coverImageUrl": "https://s3.amazonaws.com/...",
  "isFeatured": false,
  "status": "draft",
  "authorName": "Dr. Arjun Mehta"
}
```
> `status`: `"draft"` (default) | `"published"` | `"archived"`
> `authorId` is taken from the logged-in admin token automatically.
> `readTimeMinutes` is calculated automatically (~200 words/min).

**Response `201`** — full article object including generated slug

---

### `GET /api/admin/articles/:id`
Get single article by UUID (includes full `content`).

**Response `200`** — full article object including `content`

---

### `PUT /api/admin/articles/:id`
Update any article field. All fields optional.

**Request body** (all optional)
```json
{
  "title": "Updated Title",
  "content": "New content...",
  "excerpt": "New excerpt",
  "category": "Wellness",
  "tags": ["wellness"],
  "coverImageUrl": "https://...",
  "isFeatured": true,
  "status": "published"
}
```
> Setting `status: "published"` sets `publishedAt` if not already set.

**Response `200`** — updated article object

---

### `PATCH /api/admin/articles/:id/publish`
Quickly publish a draft article (sets `status: "published"`, records `publishedAt`).

**No request body required.**

**Response `200`** — updated article object with `"status": "published"`

---

### `DELETE /api/admin/articles/:id`
Permanently delete an article.

**Response `200`**
```json
{ "message": "Article deleted" }
```

---

## 4. Support Tickets

Base: `/api/admin/support`

---

### `GET /api/admin/support`
List all support tickets with user info.

**Query params**
| Param | Type | Values |
|-------|------|--------|
| `status` | string | `Open` \| `In Progress` \| `Resolved` \| `Closed` |
| `category` | string | `Technical` \| `Billing` \| `Appointments` \| `Other` |
| `page` | number | Default: 1 |
| `limit` | number | Max 100, default: 20 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "subject": "Payment not reflected",
      "message": "I paid but appointment not confirmed...",
      "category": "Billing",
      "status": "Open",
      "user": {
        "email": "riya@example.com",
        "role": "patient"
      },
      "createdAt": "2024-03-10T08:00:00Z",
      "updatedAt": "2024-03-10T08:00:00Z"
    }
  ],
  "meta": { "page": 1, "totalPages": 2, "total": 34 }
}
```

---

### `GET /api/admin/support/counts`
Badge counts for all ticket statuses (for dashboard header badges).

**Response `200`**
```json
{
  "Open": 12,
  "In Progress": 5,
  "Resolved": 48,
  "Closed": 201
}
```

---

### `GET /api/admin/support/:id`
Get single ticket by ID.

**Response `200`** — full ticket object with `user.email` and `user.role`

---

### `PATCH /api/admin/support/:id/status`
Update the status of a ticket.

**Request body**
```json
{ "status": "Resolved" }
```
> Valid values: `Open` | `In Progress` | `Resolved` | `Closed`

**Response `200`** — updated ticket object

---

### `POST /api/admin/support/:id/reply`
Send an email reply to the user and optionally update ticket status.

**Request body**
```json
{
  "replyMessage": "Hi, we have investigated your payment issue and...",
  "newStatus": "Resolved"
}
```
> `newStatus` is optional — defaults to `"In Progress"` if omitted.
> An email is sent to the user's registered email automatically.

**Response `200`** — updated ticket object

---

## 5. User Management

Base: `/api/admin/users`

---

### `GET /api/admin/users`
List all users with stage classification and optional filtering.

**User stages explained:**
- `registered` — created account, no appointments
- `assessment` — has at least one Assessment appointment
- `paid_session` — has at least one Completed Paid Consultation/Follow-up

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `stage` | string | `registered` \| `assessment` \| `paid_session` |
| `role` | string | `patient` \| `therapist` \| `admin` |
| `q` | string | Search by name or email |
| `page` | number | Default: 1 |
| `limit` | number | Max 100, default: 20 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "riya@example.com",
      "role": "patient",
      "isVerified": true,
      "name": "Riya Kapoor",
      "avatarUrl": null,
      "stage": "paid_session",
      "createdAt": "2024-01-20T07:00:00Z"
    }
  ],
  "meta": { "page": 1, "totalPages": 8, "total": 156 }
}
```
> `name` and `avatarUrl` are `null` for non-patient roles.

---

### `GET /api/admin/users/stats/stages`
Aggregate counts for the admin dashboard overview cards.

**Response `200`**
```json
{
  "totalUsers": 320,
  "totalPatients": 280,
  "totalTherapists": 35,
  "totalAdmins": 5,
  "byStage": {
    "registered": 140,
    "assessment": 95,
    "paid_session": 45
  }
}
```

---

### `GET /api/admin/users/:id`
Get full profile of a user including patient profile (if patient) and stage.

**Response `200`**
```json
{
  "id": "uuid",
  "email": "riya@example.com",
  "role": "patient",
  "isVerified": true,
  "createdAt": "2024-01-20T07:00:00Z",
  "profile": {
    "id": "uuid",
    "name": "Riya Kapoor",
    "phone": "+919898989898",
    "dob": "1995-06-15",
    "gender": "Female",
    "bloodGroup": "B+",
    "healthInterests": ["Anxiety", "Sleep"],
    "avatarUrl": null
  },
  "stage": "assessment"
}
```
> `profile` is `null` for therapist/admin roles. `password_hash` is always excluded.

---

### `POST /api/admin/users/:id/email`
Send a branded HTML email to a specific user from the admin panel.

**Request body**
```json
{
  "subject": "Important update about your account",
  "message": "Dear Riya,\n\nWe wanted to inform you that...",
  "adminName": "Sumit Pandya"
}
```
> `adminName` is optional — if provided, it appears as the email signature.
> Newlines (`\n`) in message are converted to `<br/>` in the HTML email.

**Response `200`**
```json
{ "sent": true, "to": "riya@example.com" }
```

---

## 6. FAQ Management

Base: `/api/admin/faqs`

---

### `GET /api/admin/faqs`
List all FAQs (all active and inactive) for admin management view.

**Response `200`**
```json
[
  {
    "id": "uuid",
    "question": "How do I book an appointment?",
    "answer": "You can book via the Appointments section...",
    "category": "Appointments",
    "displayOrder": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### `POST /api/admin/faqs`
Create a new FAQ. `displayOrder` is auto-incremented if not provided.

**Request body**
```json
{
  "question": "What payment methods are accepted?",
  "answer": "We accept UPI, credit/debit cards, and net banking via Razorpay.",
  "category": "Billing",
  "displayOrder": 5
}
```
> `category` defaults to `"General"` if not provided.

**Response `201`** — full FAQ object

---

### `PATCH /api/admin/faqs/reorder`
Bulk update display order (drag-and-drop reorder in UI).
Pass an array of IDs in the desired order — first ID gets order 1, second gets 2, etc.

**Request body**
```json
{
  "orderedIds": ["uuid-3", "uuid-1", "uuid-5", "uuid-2", "uuid-4"]
}
```

**Response `200`**
```json
{ "message": "FAQs reordered" }
```

---

### `PUT /api/admin/faqs/:id`
Update any field of an FAQ (all optional).

**Request body**
```json
{
  "question": "Updated question?",
  "answer": "Updated answer.",
  "category": "General",
  "displayOrder": 2,
  "isActive": false
}
```

**Response `200`** — updated FAQ object

---

### `DELETE /api/admin/faqs/:id`
Permanently delete an FAQ.

**Response `200`**
```json
{ "message": "FAQ deleted" }
```

---

## 7. Public Routes (No Auth Required)

These routes are accessible by the public-facing frontend without any token.

---

### `GET /api/articles`
List published articles (for the blog/resources page).

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `featured` | boolean | Pass `true` to get featured articles only |
| `page` | number | Default: 1 |
| `limit` | number | Max 20, default: 9 |

**Response `200`**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Managing Anxiety at Work",
      "slug": "managing-anxiety-at-work",
      "excerpt": "...",
      "category": "Mental Health",
      "tags": ["anxiety"],
      "coverImageUrl": "https://...",
      "isFeatured": true,
      "publishedAt": "2024-03-01T00:00:00Z",
      "readTimeMinutes": 5,
      "viewsCount": 342,
      "authorName": "Dr. Priya Shah"
    }
  ],
  "meta": { "page": 1, "totalPages": 3, "total": 27 }
}
```

---

### `GET /api/articles/:slug`
Get a single published article by slug. **Increments view count on each call.**

**Response `200`** — full article object including `content`

---

### `GET /api/faqs`
List all active FAQs (for the public FAQ page).

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |

**Response `200`** — array of active FAQ objects ordered by `displayOrder`

---

### `GET /api/faqs/categories`
Get all distinct FAQ categories that have at least one active FAQ.

**Response `200`**
```json
["General", "Appointments", "Billing", "Technical"]
```

---

## Error Codes Reference

| Status | Meaning |
|--------|---------|
| `400` | Bad request / invalid input |
| `401` | Missing or invalid token |
| `403` | Valid token but insufficient role (not admin) |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already in use) |
| `500` | Internal server error |
