# iSecret - Anonymous Social App

A neon-themed social network for anonymous sharing, built with React, Vite, TailwindCSS, and Supabase.

## 🚀 Deployment Guide

### 1. Supabase Setup
1. Go to [database.new](https://database.new) to create a new Supabase project.
2. Go to the **SQL Editor** in the left sidebar.
3. Copy the content of `supabase/schema.sql` from this repo and paste it into the SQL Editor. Run it to create the tables and security policies.
4. Go to **Storage** > **New Bucket** > Name it `images` > Make it **Public**.
5. Go to **Authentication** > **Providers** > Enable **Google** (add Client ID/Secret from Google Cloud Console) and **Anonymous** Sign-ins.
6. Go to **Settings** > **API**. Copy the `Project URL` and `anon` public key.

### 2. Local Development
1. Copy `.env.example` to `.env`.
2. Fill in your Supabase credentials.
3. Run `npm install` (if applicable) and `npm run dev`.

### 3. Vercel Deployment
1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. In the **Environment Variables** section of the Vercel deployment screen, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. Click **Deploy**.

## 🛡 Security
- **Row Level Security (RLS)** is enabled. Users can only edit their own data.
- Public can view posts, but only authenticated users can post.
- Reports system included for moderation.

## 🎨 Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS (Neon Dark Theme)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel

