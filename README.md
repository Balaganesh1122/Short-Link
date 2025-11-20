📌 Short-Link — URL Shortener (React + Vite + Supabase + Vercel)

A simple, fast, and modern URL Shortener built with React, TypeScript, Tailwind CSS, Supabase, and a Vercel Serverless Redirect Function.
It allows users to shorten long URLs, share short links, and track click counts.

🚀 Live Demo

👉 Deployment Link:
https://short-link-smoky-eta.vercel.app/

(Replace with your Vercel deployment URL)

✨ Features

🔗 Shorten long URLs into clean short codes

🚀 Fast redirects via Vercel serverless function

📊 Tracks click counts

🗂 Shows recent links

⚡ Powered by React + Vite + Tailwind

🛢 Supabase DB for storing URL mappings

🔐 Server-side secure operations using service-role key

🌐 Fully deployable to Vercel

🧱 Tech Stack
Layer	Technology
Frontend	React, TypeScript, Vite
Backend	Supabase (PostgreSQL)
Styles	Tailwind CSS
Deployment	Vercel
API	Vercel Serverless Functions
📂 Project Structure
Short-Link/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ supabaseClient.ts
│  ├─ styles.css
│  ├─ components/
│  │   ├─ ShortenForm.tsx
│  │   └─ LinkList.tsx
├─ vercel/
│  └─ api/
│     └─ redirect.ts
├─ vercel.json
├─ package.json
├─ vite.config.ts
├─ tailwind.config.cjs
├─ postcss.config.cjs
└─ README.md

🗄️ Database Schema (Supabase)

Run this SQL inside Supabase:

create table if not exists public.links (
  id bigserial primary key,
  short_code text unique not null,
  original_url text not null,
  created_at timestamptz default now(),
  clicks bigint default 0
);

create index if not exists idx_links_short_code
on public.links(short_code);

🔧 Environment Variables

Create .env (local):

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server-side only


Vercel Environment Variables

Key	Used In	Required
VITE_SUPABASE_URL	Frontend	✅
VITE_SUPABASE_ANON_KEY	Frontend	✅
SUPABASE_SERVICE_ROLE_KEY	Serverless API	✅
⚙️ Install & Run Locally
git clone https://github.com/Balaganesh1122/Short-Link
cd Short-Link

npm install
npm run dev

📌 Redirect Setup (Vercel)

Add vercel.json:

{
  "version": 2,
  "rewrites": [
    { "source": "/:code", "destination": "/api/redirect?code=:code" }
  ]
}


This allows users to visit:

https://yourdomain.com/abc123


and be redirected to the original URL.

🚀 Deployment Steps
1. Supabase

Create a new project

Run SQL schema above

2. GitHub

Push project to your GitHub repo

3. Vercel

Import GitHub project

Add environment variables

Deploy

4. Test

Open deployed frontend

Generate short link

Open short link to confirm redirection & click count

🖥️ How It Works
Frontend

User enters a URL → creates short code → stores in Supabase

Shows list of recent links with click counts

Backend (Serverless redirect)

When user opens /abc123:
✓ Look up original URL
✓ Increase click count
✓ Redirect user

🛠 Future Enhancements

🔐 Authentication (per-user links)

📊 Full analytics (referrer, device, geo)

🏷 Custom alias support

⏳ Expiring links

🎨 Dark mode

📱 Better mobile UI

🤝 Contributing

Fork the repo

Create new feature branch

Submit pull request

📜 License

MIT License. Free to use and modify.

❤️ Credits

React + Vite

Tailwind CSS

Supabase

Vercel Serverless Functions
