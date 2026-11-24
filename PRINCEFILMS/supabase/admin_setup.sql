-- PRINCEFILMS secure film-admin schema (run in Supabase SQL Editor)
create extension if not exists pgcrypto;

create table if not exists public.films (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  year integer not null check (year between 1888 and 2100),
  synopsis text not null,
  category_ids text[] not null default '{}',
  interpreter_id text not null,
  runtime integer not null default 1 check (runtime > 0),
  poster_url text not null,
  trailer_url text not null,
  video_url text not null,
  audio_language text not null default 'Kinyarwanda',
  subtitles text[] not null default '{}',
  quality text not null default 'HD' check (quality in ('HD','4K')),
  released_at date,
  featured boolean not null default false,
  published boolean not null default false
);

alter table public.films enable row level security;
drop policy if exists "Public can read published films" on public.films;
create policy "Public can read published films" on public.films
for select using (published = true);

drop policy if exists "Admins manage films" on public.films;
create policy "Admins manage films" on public.films
for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('film-media','film-media',true,524288000,array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public reads film media" on storage.objects;
create policy "Public reads film media" on storage.objects
for select using (bucket_id = 'film-media');

drop policy if exists "Admins upload film media" on storage.objects;
create policy "Admins upload film media" on storage.objects
for insert to authenticated
with check (bucket_id = 'film-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins update film media" on storage.objects;
create policy "Admins update film media" on storage.objects
for update to authenticated
using (bucket_id = 'film-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check (bucket_id = 'film-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins delete film media" on storage.objects;
create policy "Admins delete film media" on storage.objects
for delete to authenticated
using (bucket_id = 'film-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
