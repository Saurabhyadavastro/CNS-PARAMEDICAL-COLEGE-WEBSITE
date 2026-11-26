# C.N.S. Paramedical and Nursing College - Official Website & Portal

Official web portal and administrative management system for **C.N.S. Paramedical and Nursing College**, located at Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh – 209735 (Established 2022).

Built with **React 18, TypeScript, Vite, Tailwind CSS, React Router**, and powered by **Supabase** (Postgres, Auth, Storage) as the complete serverless backend. Designed to run permanently within 100% free-tier limits on **Netlify** or **Cloudflare Pages**.

---

## 📌 Table of Contents
1. [Tech Stack & Architecture](#tech-stack--architecture)
2. [Design Tokens & Accessibility Standards](#design-tokens--accessibility-standards)
3. [Environment Variables](#environment-variables)
4. [Local Development](#local-development)
5. [Database Setup & Security (Supabase)](#database-setup--security-supabase)
6. [Deployment Guide](#deployment-guide)
   - [Deploying to Netlify](#deploying-to-netlify)
   - [Deploying to Cloudflare Pages](#deploying-to-cloudflare-pages)
7. [Automated Supabase Keepalive](#automated-supabase-keepalive)
8. [Client Handover Guide for College Administration](#client-handover-guide-for-college-administration)
9. [Fact Verification & Placeholders Checklist](#fact-verification--placeholders-checklist)

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 18, TypeScript 5, Vite 6, Tailwind CSS 3
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL 15 with Row Level Security)
- **Authentication**: Supabase Auth (Email + Password only; public self-registration disabled)
- **Object Storage**: Supabase Storage (`staff-photos` bucket, 2MB file limit, public read)
- **Hosting Target**: Netlify or Cloudflare Pages (Static Single Page Application)
- **SEO & Structured Data**: Open Graph, Twitter Cards, `sitemap.xml`, `robots.txt`, Schema.org `EducationalOrganization` JSON-LD

---

## 🎨 Design Tokens & Accessibility Standards

The visual design follows the established paramedical college design system:
- **Primary Brand Royal Blue**: `#4169e1` (`bg-brand`, `text-brand`) — WCAG AA compliant on white.
- **Brand Soft**: `#347fe1` (`brand.soft`) — Restricted to large headings and decorative UI.
- **Deep Navy Background**: `#0a1128` (`bg-navy-dark`) — Used for header, hero, and footer sections.
- **Surface**: `#ffffff` (`bg-surface`) and `#f7fcfe` (`bg-surface-light`) for alternating sections.
- **Accent Orange**: `#f7a604` (`accent`) — Strictly reserved for badges, notice tags, and highlights.
- **Accessibility**: Keyboard-first focus rings (`focus-ring`), `skip-to-content` link, focus traps on modals/lightbox, zero cumulative layout shift (CLS) with fixed 4:3 aspect ratios, and touch-swipe navigation on mobile.

---

## 🔐 Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Supabase Project Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note**: Both keys are safe for client-side bundling. Row Level Security (RLS) protects all sensitive tables.

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Verify production build**:
   ```bash
   npm run build
   ```

---

## 🗄 Database Setup & Security (Supabase)

### 1. Execute SQL Migration
In your Supabase project dashboard, navigate to the **SQL Editor** and execute the entire content of [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql).

This automatically configures:
- **`staff`**: Faculty directory with order, qualification, and photo URLs.
- **`notices`**: Notice ticker and board with categories, active toggles, and expiry dates.
- **`enquiries`**: Admission enquiries with validation constraints (10-digit Indian phone regex: `^[6-9][0-9]{9}$`).
- **`admin_users`**: Table registering authorized administrators.
- **`is_admin()`**: Security Definer function checking `auth.uid()`.
- **Row Level Security (RLS)**:
  - Anonymous visitors can `SELECT` staff and active notices.
  - Anonymous visitors can only `INSERT` into enquiries (cannot `SELECT`, `UPDATE`, or `DELETE`).
  - Only `is_admin()` users can view/update enquiries, manage staff, or publish notices.
- **Storage Bucket (`staff-photos`)**: Configured with 2 MB file limit and image MIME restrictions.

### 2. Create the Admin User
1. Go to **Supabase Dashboard > Authentication > Users**.
2. Click **Add User > Create User**. Enter the administrator's email and a secure password.
3. Copy the generated `User UID` (UUID).
4. Run this query in the **SQL Editor**:
   ```sql
   INSERT INTO public.admin_users (user_id) 
   VALUES ('<PASTE-COPIED-USER-UID-HERE>');
   ```
5. In **Authentication > Settings > General**: Disable **"Allow new users to sign up"** to prevent public registrations.

---

## 🚀 Deployment Guide

### Deploying to Netlify (Recommended)

1. Push your repository to GitHub.
2. Sign in to [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your GitHub repository.
4. Configure Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Add environment variables"** and input:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Netlify reads [`netlify.toml`](netlify.toml) and [`public/_redirects`](public/_redirects) to handle client-side routing and security headers.

### Deploying to Cloudflare Pages

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages > Pages > Connect to Git**.
2. Select your repository.
3. In **Build Settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. In **Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Click **Save and Deploy**.

---

## ⏰ Automated Supabase Keepalive

Free-tier Supabase projects automatically pause after **7 days of inactivity**.

To prevent this without paying for a Pro plan:
- A GitHub Actions workflow is included at [`.github/workflows/keepalive.yml`](.github/workflows/keepalive.yml).
- It runs automatically on a cron schedule **every 3 days at 04:00 UTC (9:30 AM IST)**.
- It performs a low-overhead `GET /rest/v1/notices?limit=1` request using your Supabase credentials to keep the project active.

### Enabling the Keepalive:
1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Click **New repository secret** and add:
   - Name: `VITE_SUPABASE_URL`, Value: your Supabase URL.
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: your Supabase Anon key.

---

## 🤝 Client Handover Guide for College Administration

Follow these 4 steps to smoothly hand over the website and admin portal to the college authorities:

### Step 1: Hand Over Supabase Project
1. Have the college administrator create an account at [supabase.com](https://supabase.com).
2. Go to **Project Settings > General > Transfer Project**.
3. Enter the college administrator's email and initiate the transfer.

### Step 2: Custom Domain Configuration (`cnsparamedical.in`)
In your Netlify or Cloudflare Pages domain management panel:
1. Click **"Add Custom Domain"** and enter `cnsparamedical.in` (and `www.cnsparamedical.in`).
2. Update DNS records with the college's domain registrar:
   - **Apex domain (`cnsparamedical.in`)**: Add an `A` record pointing to Netlify (`75.2.60.5`) or Cloudflare IP.
   - **Subdomain (`www`)**: Add a `CNAME` record pointing to your deployment URL.
3. SSL/TLS certificates will provision automatically via Let's Encrypt.

### Step 3: Admin Portal Training
Provide the designated college staff with:
- **Login Portal**: `https://your-domain.com/admin/login`
- **Dashboard**: `https://your-domain.com/admin`
- **Features Guide**:
  - **Enquiries**: Review new admissions submissions, filter by course, click the phone number to call directly on mobile, add internal remarks, update status (`new` → `in_progress` → `resolved`), and export all submissions to CSV.
  - **Faculty**: Add newly hired instructors with their qualifications, display order, and upload profile pictures.
  - **Notices**: Publish urgent admission or exam notifications that immediately display on the homepage auto-scrolling ticker and the notice board.

---

## 📋 Fact Verification & Placeholders Checklist

In compliance with strict factual integrity rules, no unverified stats or claims were invented. When the college provides verified data, replace the following `[TO_CONFIRM: ...]` values in [`src/content/siteConfig.ts`](src/content/siteConfig.ts) and [`src/content/websiteCopy.ts`](src/content/websiteCopy.ts):

| Item | Current Status | File Location |
| :--- | :--- | :--- |
| **Official Phone Number** | `[TO_CONFIRM: Official Contact Number]` | `src/content/siteConfig.ts` |
| **Official Email Address** | `[TO_CONFIRM: info@cnsparamedical.in]` | `src/content/siteConfig.ts` |
| **Principal's Name & Message** | `[TO_CONFIRM: Principal / Dean Name]` | `src/content/siteConfig.ts` |
| **Director / Management Name** | `[TO_CONFIRM: Managing Director Name]` | `src/content/siteConfig.ts` |
| **ANM Annual Intake & Fees** | `[TO_CONFIRM: Approved Annual Intake / Fees]` | `src/content/websiteCopy.ts` |
| **GNM Annual Intake & Fees** | `[TO_CONFIRM: Approved Annual Intake / Fees]` | `src/content/websiteCopy.ts` |
| **B.Sc. Nursing Intake & Fees**| `[TO_CONFIRM: Approved Annual Intake / Fees]` | `src/content/websiteCopy.ts` |
| **State Medical Faculty Code** | `[TO_CONFIRM: State Medical University Affiliation]` | `src/content/siteConfig.ts` |
| **Indian Nursing Council Code**| `[TO_CONFIRM: INC Institutional Code]` | `src/content/siteConfig.ts` |
| **Teaching Hospital Tie-Up** | `[TO_CONFIRM: Affiliated 100+ Bed Hospital]` | `src/content/siteConfig.ts` |

---

## 📄 License
This project is proprietary software developed for **C.N.S. Paramedical and Nursing College**. All rights reserved.
