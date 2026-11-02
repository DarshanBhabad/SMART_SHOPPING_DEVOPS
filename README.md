# Smart Shopping 🛒

A full-stack shopping app built with React, Node.js, and Supabase.

## Project Structure
```
smart-shopping/
├── backend/       # Node.js + Express API
├── frontend/      # React app
└── supabase_schema.sql
```

## Setup

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase_schema.sql`
3. Get your keys from **Settings → API**

### 2. Backend
```bash
cd backend
cp .env .env.local   # fill in your keys
# Edit .env:
#   SUPABASE_URL=https://xxxx.supabase.co
#   SUPABASE_SERVICE_KEY=your_service_role_key
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
# Edit .env:
#   REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
#   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
#   REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

## Features
- 🔐 Login / Register (Supabase Auth)
- 🛍️ Product listing
- 🛒 Shopping cart (add/remove)
- 🏠 Landing page
