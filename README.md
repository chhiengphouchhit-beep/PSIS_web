# PSIS Campus Group Portal

Official web portal for Paññāsāstra International School (PSIS) Campus Group, managing 6 state-of-the-art campuses in Cambodia under Australia Young Leaders Academy Co., Ltd.

---

## 🚀 Key Features

* **Vibrant & Premium UI**: Tailored color palette, Oxford-style typography, and smooth micro-animations powered by Tailwind CSS v4 and Motion.
* **Bilingual Support**: Fully togglable English and Khmer language translations for all main interfaces.
* **Premium Student Life Gallery**: Showcases student activities, interactive robotics suites, and graduation ceremonies.
* **Parent & Student Testimonials**: Highlights community trust and feedback.
* **Floating Interaction Bar**: Quick access to admissions, booking a campus tour, and Telegram support.
* **Admin CMS & Lead Pipeline**: Full admin portal with lead pipeline status tracking, campus content updates, and a launch readiness checklist.
* **Supabase Integration**: Production-ready image uploads and storage bucket logic for persistent asset management.

---

## 🛠️ Tech Stack

* **Core**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 + Vanilla CSS
* **Animations**: Motion (formerly Framer Motion)
* **Backend/Database**: Supabase (Database & Storage)
* **CMS Alternative**: Google Sheet Integration fallback script

---

## 💻 Running Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)

### Steps
1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file (or copy `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   Provide your `GEMINI_API_KEY`, and optional Supabase credentials (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   By default, this runs at [http://localhost:3000](http://localhost:3000) (or a fallback port if 3000 is occupied).

---

## ☁️ Supabase Production Storage Setup

This portal contains built-in image upload capabilities for the Admin CMS. To activate image uploads to Supabase:
1. Refer to [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for database table schemas and storage bucket configurations.
2. Run the SQL schema found in [supabase/setup.sql](supabase/setup.sql) in your Supabase SQL editor.
3. Configure your API keys in `.env.local`.

---

## 📄 License
This project is licensed under the Apache-2.0 License.
