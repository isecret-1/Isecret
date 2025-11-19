-- ==========================
-- EXTENSÕES
-- ==========================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==========================
-- TABELA USERS
-- ==========================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique,
  avatar_color text default '#6C38FF',
  bio text,
  created_at timestamp with time zone default now()
);

-- ==========================
-- POSTS
-- ==========================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  content text check (char_length(content) <= 2000),
  image_url text,
  likes_count integer default 0,
  created_at timestamp with time zone default now()
);

-- ==========================
-- LIKES
-- ==========================
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- ==========================
-- REPORTS
-- ==========================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id),
  post_id uuid references public.posts(id),
  reason text,
  created_at timestamp with time zone default now()
);

-- ==========================
-- TRIGGER: PERFIL AUTOMÁTICO
-- ==========================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  adjectives text[] := array['Neon', 'Silent', 'Misty', 'Cyber', 'Hidden', 'Violet', 'Dark', 'Holo'];
  animals text[] := array['Fox', 'Wolf', 'Owl', 'Ghost', 'Raven', 'Cat', 'Echo', 'Zero'];
  colors text[] := array['#FF0050', '#00F2EA', '#7B61FF', '#FFD700', '#00FF94', '#FF4D00'];
  new_handle text;
  new_color text;
begin
  new_handle := adjectives[floor(random()*array_length(adjectives, 1)) + 1]
                || animals[floor(random()*array_length(animals, 1)) + 1]
                || '_' || floor(random() * 9000 + 1000)::text;

  new_color := colors[floor(random()*array_length(colors, 1)) + 1];

  insert into public.users (id, handle, avatar_color)
  values (new.id, new_handle, new_color);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ==========================
-- RLS
-- ==========================
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.reports enable row level security;

-- USERS POLICIES
create policy "Perfis são públicos" on public.users
for select using (true);

create policy "Editar próprio perfil" on public.users
for update using (auth.uid() = id);

-- POSTS POLICIES
create policy "Posts públicos" on public.posts
for select using (true);

create policy "Criar post" on public.posts
for insert with check (auth.uid() = user_id);

create policy "Deletar próprio post" on public.posts
for delete using (auth.uid() = user_id);

-- LIKES POLICIES
create policy "Ver likes" on public.likes
for select using (true);

create policy "Dar like" on public.likes
for insert with check (auth.uid() = user_id);

create policy "Remover like" on public.likes
for delete using (auth.uid() = user_id);

-- REPORTS POLICIES
create policy "Criar report" on public.reports
for insert with check (auth.uid() is not null);

-- ==========================
-- STORAGE BUCKET
-- ==========================
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

create policy "Ler imagens públicas"
on storage.objects for select
using (bucket_id = 'posts');

create policy "Upload autenticado"
on storage.objects for insert
with check (bucket_id = 'posts' and auth.uid() is not null);

-- ==========================
-- RPC FUNCTIONS
-- ==========================
create or replace function public.increment_likes(row_id uuid)
returns void as $$
begin
  update public.posts
  set likes_count = likes_count + 1
  where id = row_id;
end;
$$ language plpgsql security definer;

create or replace function public.decrement_likes(row_id uuid)
returns void as $$
begin
  update public.posts
  set likes_count = likes_count - 1
  where id = row_id;
end;
$$ language plpgsql security definer;
