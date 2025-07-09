-- 006_create_users_and_link_to_companies.sql

-- 1. Create users table
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable RLS on users
alter table users enable row level security;

-- 3. Create RLS policies on users table

-- Allow users to select their own row
create policy "Allow authenticated read own user row"
on users
for select
to authenticated
using (auth.uid() = id);

-- Allow users to insert their own row
create policy "Allow authenticated insert own user row"
on users
for insert
to authenticated
with check (auth.uid() = id);

-- Allow users to update their own row
create policy "Allow authenticated update own user row"
on users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 4. Alter companies table to add owner_id FK to users.id
alter table companies
add column if not exists owner_id uuid references users(id);

-- 5. Update companies RLS policies to enforce ownership

drop policy if exists "Allow authenticated read company" on companies;
create policy "Allow authenticated read company"
on companies
for select
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Allow authenticated insert company" on companies;
create policy "Allow authenticated insert company"
on companies
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Allow authenticated update own company" on companies;
create policy "Allow authenticated update own company"
on companies
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);
