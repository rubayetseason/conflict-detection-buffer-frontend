# Resource Booking System with Conflict Detection and Buffer Logic

This is a full-stack application that allows users to book time slots for shared resources like rooms or devices. It includes smart conflict detection and buffer time logic to prevent overlapping or too-close bookings.

---

## 🚀 Features

- 🔒 Conflict detection with 10-minute buffer before and after each booking
- 📆 Booking form with resource, start/end time, requester fields
- ✅ Validations: minimum 15 minutes duration, End Time > Start Time
- 📋 Dashboard listing bookings with filters (resource, date)
- ⏰ Status tags: Upcoming, Ongoing, Past
- 📅 Weekly calendar view (ShadCN based)
- ❌ Cancel/Delete bookings
- 🔍 Check available time slots via API
- 💾 Persistent storage using Prisma (backend)
- 🌐 Backend hosted on Vercel

---

## 🔗 Live Links

- **Frontend GitHub Repo:** [conflict-detection-buffer-frontend](https://github.com/rubayetseason/conflict-detection-buffer-frontend.git)
- **Frontend Hosted Site:** [`https://conflict-detection-buffer-frontend.vercel.app/`](https://conflict-detection-buffer-frontend.vercel.app/)
- **Backend API Endpoint:** [`https://conflict-detection-buffer-backend.vercel.app/api/v1/`](https://conflict-detection-buffer-backend.vercel.app/api/v1/)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, TypeScript
- **Backend:** Express.js (TypeScript)
- **Database:** Prisma ORM
- **UI Components:** ShadCN UI

---

## ⚙️ Setup Instructions

### 1. Clone the frontend repo

```bash
git clone https://github.com/rubayetseason/conflict-detection-buffer-frontend.git
cd conflict-detection-buffer-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 4. Open in browser

Visit `http://localhost:3000` to see the app running.

---

## 📤 API Endpoints (Backend)

### `POST /api/v1/bookings`

Creates a booking after validating:
- Minimum duration: 15 mins
- No conflict or overlap (including buffer)

### `GET /api/v1/bookings`

Returns all bookings. Supports optional query params:
- `resource`: filter by resource
- `date`: filter by date

### `GET /api/v1/available-slots` (Bonus)

Returns available slots for a resource within a time range, factoring in buffer rules.

---

## 📌 Conflict Rule Example (10-minute buffer)

If Resource A is booked from 2:00 PM to 3:00 PM, then:

- 1:50 PM – 3:10 PM is blocked.
- Any new booking overlapping this range will be **rejected**.