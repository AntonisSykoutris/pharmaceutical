-- Users table (maps Supabase auth users to companies)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for updated_at
create trigger update_users_updated_at
before update on users
for each row
execute procedure update_updated_at_column();
