-- Create enum for user roles
create type user_role as enum ('user', 'admin', 'owner');

-- Create companies table
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  website_url text,
  description text,
  industry text,
  size text,
  country text,
  created_at timestamptz default now(),
);

-- Create users table
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  role user_role default 'user',
  created_at timestamptz default now(),
);

-- Enable RLS
alter table companies enable row level security;
alter table users enable row level security;

-- Policies for companies: allow owners to manage their company
create policy companies_select on companies
  for select
  to authenticated
  using (exists (
    select 1 from users u where u.id = auth.uid() and u.company_id = companies.id
  ));

create policy companies_insert on companies
  for insert
  to authenticated
  with check (exists (
    select 1 from users u where u.id = auth.uid()
  ));

create policy companies_update on companies
  for update
  to authenticated
  using (exists (
    select 1 from users u where u.id = auth.uid() and u.company_id = companies.id
  ))
  with check (exists (
    select 1 from users u where u.id = auth.uid() and u.company_id = companies.id
  ));

-- Policies for users: allow user to manage their own user row
create policy users_select on users
  for select
  to authenticated
  using (id = auth.uid());

create policy users_update on users
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy users_insert on users
  for insert
  to authenticated
  with check (id = auth.uid());
