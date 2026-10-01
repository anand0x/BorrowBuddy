# 🎒 BorrowBuddy — Why Buy When You Can Borrow?

> **Campus Peer-to-Peer College Essentials Borrowing Platform**  
> *"Borrow it. Use it. Return it."*

---

## 💡 1. Design Thinking Problem & Motivation

### The Design Thinking Problem Statement
> **"Students frequently need college items temporarily but often purchase them unnecessarily because they cannot easily find another student who already owns the item."**

### Background Context
In colleges and engineering universities, students regularly face short-term item requirements:
- **Scientific Calculators** (e.g., Casio FX-991CW) for mid-semester exams and physics practicals.
- **Engineering Mini Drafters & Sheet Cylinders** for first-year CAD/Drawing submissions.
- **Pure Cotton Lab Coats** for chemistry and biotechnology practical vivas.
- **Digital Electronics Kits, Soldering Irons, and Microcontrollers** for weekend hackathons and IoT mini-projects.
- **Curriculum Textbooks & Reference Manuals** for 2-week exam study blocks.

Buying each of these items brand new leads to:
1. **Unnecessary Financial Burden:** Students spend thousands of rupees on items they only use a few times.
2. **Material Waste:** Tools end up sitting idle in hostel cupboards or discarded after the semester ends.
3. **Lack of Discovery:** Another student in the adjacent hostel block or branch often already owns the item, but there is no trusted, campus-focused platform to connect them.

**BorrowBuddy** solves this by establishing a trusted, circular campus sharing economy.

---

## 🌟 2. Key Features

- **🎓 Campus-Centric Authentication:**
  - Standard email registration (no mandatory university email required for demo mode).
  - Authentic profile badges: `👤 BorrowBuddy Member` (reserved `🎓 University Verified` for future university domain integration).
  - Preloaded demo user switcher for rapid evaluators and lab presentations.
- **🔍 Powerful Explore & Faceted Search:**
  - Multi-criteria filtering by category, availability, borrow fee, deposit, condition, and designated campus pickup location.
  - Zero-result fallback seamlessly linking to the community ask board.
- **⚡ BorrowBuddy SOS (Urgent Lab / Exam Borrowing):**
  - Instant 1-click filter for emergency next-day practical essentials within 200m on campus.
- **📅 Visual Availability Calendar & Conflict Engine:**
  - Real-time calendar displaying available, booked, and pending dates.
  - Automatic collision detection preventing overlapping date reservations.
- **💰 Borrow vs. Buy Savings Calculator:**
  - Direct financial comparison showing retail MRP vs. borrow cost and student savings.
- **🤝 Complete Borrow Request & Approval Flow:**
  - Borrower submits duration, dates, and optional pickup note.
  - Owner reviews borrower reputation, previous transaction count, and accepts/declines.
  - Calendar automatically locks upon approval.
- **💬 Direct Campus Handover Chat:**
  - Live peer messaging activated upon request acceptance.
  - Item context preview in conversation header.
  - Safety reminder banners and reporting/blocking tools.
- **📢 "Need Something?" Community Ask Board:**
  - Post urgent requests when an item isn't listed.
  - Fellow students can click **"Offer My Item"** to lend directly.
- **⭐ Multi-Criteria Ratings & Reviews:**
  - 1–5 star ratings across item condition, communication, and timely return.
- **🏆 BorrowBuddy Points & Campus Gamification:**
  - Earn points: `+10` (List item), `+20` (Lend successfully), `+15` (Return on time), `+5` (Helpful review).
  - Ranks: 🥉 *New Buddy* → 🥈 *Helpful Buddy* → 🥇 *Super Buddy* → 💎 *Campus Legend*.
- **👥 Buddy Circles:**
  - Filter items by departmental hubs, hostel blocks, and hobby makers clubs.
- **🛡️ Campus Designated Pickup Locations:**
  - Predefined safe public meeting spots (Central Library, Canteen, Department Block, Main Gate, Hostel Reception) to preserve student privacy.
- **🌱 Campus Sustainability Impact Dashboard:**
  - Real-time tracking of items reused, estimated ₹ saved, and material waste avoided.

---

## 🛠️ 3. Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS with custom soft shadows and brand color system
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Database & Backend Readiness:** Supabase client integration with automatic fallback to **DEMO MODE** (localStorage persistence)

---

## 🚀 4. Local Setup & Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation Steps

1. **Clone the repository and enter directory:**
   ```bash
   cd BorrowBuddy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   ```env
   # Set to true to run fully client-side with rich preloaded demo data
   VITE_DEMO_MODE=true

   # Optional Supabase credentials:
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 5. Demo Credentials (For Evaluation & Testing)

BorrowBuddy runs out-of-the-box in **Demo Mode** with persistent `localStorage`. Use the one-click top bar switcher or log in with:

| Role | Name | Email | Password | Pre-seeded Context |
| :--- | :--- | :--- | :--- | :--- |
| **Demo User 1 (Owner)** | Rahul Sharma | `student1@demo.com` | `Demo1234` | Has Casio FX-991CW calculator, Lab Coat, and Soldering Kit listed. Has pending borrow request to review. |
| **Demo User 2 (Borrower)** | Priya Verma | `student2@demo.com` | `Demo1234` | Active borrower, currently chatting with Rahul, saved items in wishlist. |

> **Tip:** You can also register any new account with any standard email (e.g. Gmail/Outlook) without email verification.

---

## 🗺️ 6. Core User Verification Journeys

### Flow A: The Complete Borrowing Journey
1. Log in as **Priya Verma** (`student2@demo.com` or click Demo Switcher).
2. On Home or Explore, search **"Calculator"**.
3. Open **Casio FX-991CW ClassWiz Scientific Calculator**.
4. Check the **Borrow vs Buy Advantage** card (Save ₹1,495).
5. Pick dates on the **Availability Calendar** and click **Request to Borrow**.
6. Switch to **Rahul Sharma** via the top demo banner.
7. Go to **Borrow Requests** (`/requests`), inspect Priya's rating and message, and click **Accept Request**.
8. Notice the calendar locks, owner receives `+20 points`, and **Campus Chat** opens automatically.
9. Go to **Messages** (`/messages`) to chat and coordinate pickup at the **Central Library**.
10. Once the borrowing period concludes, go to **My Borrowings** (`/my-borrowings`), click **Mark as Returned**, and submit a **5-star review**!

### Flow B: Listing an Item
1. Click **List an Item** (`/list-item`).
2. Enter item details, pick a category (e.g. *Engineering Drawing*), choose condition and campus pickup spot.
3. Click **Publish Listing** → Watch the confetti explosion and `+10 points` awarded to your profile!
4. The item is instantly searchable in the **Explore** directory.

### Flow C: Asking the Community ("Need Something?")
1. Navigate to **Need Something?** (`/need-something`).
2. Post a request for an item (e.g., *Mini Drafter for Friday CAD Exam*).
3. Switch users and click **Offer My Item** to connect and propose a tool.

---

## 🗄️ 7. Database Architecture (Supabase SQL Schema)

When deploying to Supabase, run the schema below:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  university TEXT DEFAULT 'XYZ Institute of Technology',
  bio TEXT,
  avatar_url TEXT,
  rating NUMERIC(2,1) DEFAULT 5.0,
  points INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Used')),
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Borrowed', 'Pending', 'Unavailable')),
  borrow_fee INTEGER DEFAULT 0,
  deposit INTEGER DEFAULT 0,
  estimated_retail_price INTEGER DEFAULT 1000,
  pickup_location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_urgent_sos BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Borrow Requests
CREATE TABLE borrow_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  borrower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  message TEXT,
  borrow_fee INTEGER DEFAULT 0,
  deposit INTEGER DEFAULT 0,
  total_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Cancelled', 'Active', 'Returned', 'Overdue')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ
);

-- Conversations & Messages
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  borrower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL,
  condition_rating INTEGER,
  communication_rating INTEGER,
  timely_return_rating INTEGER,
  comment TEXT,
  role TEXT CHECK (role IN ('borrower', 'lender')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚡ 8. Advanced Features Implemented (Phases 14–26)

### Phases 14–18: Smart Campus Trust & Infrastructure
1. **📱 Dynamic QR Handover & Return Verification:**
   - Both borrower and lender can present dynamic campus QR codes and 6-digit handshake PINs (e.g. `BB-8492`) at the Central Library.
   - 1-click scan simulation timestamps pickup and automatically transitions items to **Active** with deposit escrow locks.
2. **📸 Pre-handover Damage Evidence Photo Log:**
   - Interactive inspection checklist capturing front, display, and angle condition photos before custody transfer.
   - Eliminates deposit disputes and protects both students.
3. **✨ BuddyAI Campus Assistant & Syllabus Matcher:**
   - Interactive AI assistant in the top navigation matching semester courses (CAD, Chemistry Lab, Data Structures) with items available on campus.
4. **🗺️ Interactive Campus Landmark Map View:**
   - Visual campus map on `/explore` displaying real-time item counts and walking times across the Central Library, Canteen, Department Block, Main Gate, and Hostel Reception.
5. **🛡️ Autonomous Security Deposit Escrow Ledger:**
   - Transparent ledger viewable in `/my-borrowings` showing locked security deposits with guaranteed release upon verified QR return.

### Phases 19–22: Credentials, Contracts & Multi-Campus
6. **🎓 Official Student ID & Roll Number Verification:**
   - Students can submit their campus roll number (e.g. `2023-CS-1048`) and department to unlock the verified `🎓 University Verified` badge.
7. **📄 Digital Peer Lending Agreement Contract Generator:**
   - Generates an official printable legal peer-borrowing contract complete with agreement ID, timestamps, deposit terms, and digital signature records.
8. **🌱 Personalized Campus Sustainability Certificate:**
   - Official downloadable certificate certifying student's personal carbon/waste diversion metrics and financial savings.
9. **🏫 Multi-Campus University Switcher:**
   - Switch between campus networks (XYZ Institute, National Institute of Design, City Engineering College, Delhi Tech Hub).

### Phases 23–26: Community Superchargers & Offline PWA
10. **🎒 Course & Semester Equipment Kits Hub:**
    - Package-deal borrowing for 1st Year Engineering Drawing, IoT Hardware Kits, and Chemistry Safety Lab Sets with 1-click request.
11. **💡 "Ask Seniors" Peer Equipment Mentorship Forum:**
    - Upvoteable Q&A board where seniors answer practical questions on allowed calculator models, lab coat sizing, and faculty rules, linking directly to listed items.
12. **🔊 Synthesized Web Audio Micro-Interactions:**
    - Zero-dependency browser Web Audio API audio feedback with cheerful ascending chimes on approvals, returns, and point awards, with a top demo bar mute toggle.
13. **📲 Progressive Web App (PWA) Offline Readiness:**
    - Native `manifest.json`, background service worker (`sw.js`), and floating install banner enabling instant home screen install and offline access in campus basements.

---

## 🔮 9. Production Horizon Roadmap

1. **Native Push Notifications:** Web Push API alerts for return deadline countdowns.
2. **Hardware Locker Integration:** Smart campus locker drop-off for 24/7 autonomous handovers.
3. **AI Damage Detection:** Computer vision model comparing pre- and post-return photos to automatically detect cracks or missing accessories.

---

## 📄 9. Project & Legal Disclaimer

*BorrowBuddy is a non-commercial student innovation developed for the Design Thinking & Innovation Lab. All brand names (e.g. Casio, Tanenbaum) and impact metrics displayed in the prototype are illustrative for academic presentation purposes.*

**© 2026 BorrowBuddy • Why buy when you can borrow?**
