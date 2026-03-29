# MindDump

**Dump your thoughts. Keep your peace.**

> Because some thoughts need a place to land.

MindDump is an anonymous-friendly wall where users can post their thoughts across different categories. Sign in with Google, pick a wall, and let it out.

---

## Features

- **Google OAuth** — Sign in with one click via Supabase Auth
- **Category Walls** — Love, Thoughts, Confessions, Dreams, Rants, Gratitude
- **100 posts per wall** — Paginated walls so things stay readable
- **Smooth animations** — Framer Motion throughout
- **Dark neon UI** — Deep dark theme with ambient neon glow
- **Real-time ready** — Built on Supabase (Postgres + RLS)

## Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React + Vite                |
| Styling   | Tailwind CSS v4             |
| Animation | Framer Motion               |
| Backend   | Supabase (Postgres, Auth, API) |
| Auth      | Google OAuth via Supabase   |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 1. Clone and install

```bash
git clone https://github.com/your-username/minddump.git
cd minddump/freedomwall-app
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers > Google** — enable it with your Google OAuth Client ID and Secret
3. Go to **SQL Editor** and run the schema:

```sql
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  avatar_url text default '',
  category text not null check (category in ('love', 'thoughts', 'confessions', 'dreams', 'rants', 'gratitude')),
  content text not null check (char_length(content) <= 500),
  color text default 'indigo',
  created_at timestamptz default now() not null
);

alter table public.posts enable row level security;

create policy "Posts are publicly readable"
  on public.posts for select using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete using (auth.uid() = user_id);

create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_category_created_idx on public.posts (category, created_at desc);
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
  components/
    CategorySelect.jsx   — Landing page with category grid
    Wall.jsx             — Wall view with paginated posts
    PostCard.jsx         — Individual post card
    AddPostModal.jsx     — Modal for creating a new post
    Navbar.jsx           — Top navigation bar
  context/
    AuthContext.jsx       — Google auth state management
  lib/
    supabase.js          — Supabase client
    categories.js        — Category definitions and config
```

## License

MIT
