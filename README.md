# iSecret - Anonymous Social Network

A Vercel-ready, Supabase-backed anonymous social network.

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS (Dark Mode / Neon)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel

## 🛠 Setup Instructions

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the dashboard.
3. Copy the content of `supabase_schema.sql` from this repo and run it. This creates the tables and the auto-handle generation logic.
4. Go to **Storage** -> Create a new bucket named `posts` and make it **Public**.
5. Go to **Authentication** -> **Providers** and enable **Google**.

### 2. Environment Variables

In your local `.env` file or Vercel Dashboard:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Import this repository to Vercel.
2. Add the Environment Variables in the Vercel Project Settings.
3. Deploy.
