-- Create companies table without owner_id initially
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  website_url text,
  description text,
  industry text,
  size text,
  country text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language 'plpgsql';

create trigger update_companies_updated_at
before update on companies
for each row
execute procedure update_updated_at_column();

-- Enable RLS
alter table companies enable row level security;

-- Create policies

create policy "Allow authenticated read company"
on companies
for select
to authenticated
using (true); -- temporarily allow all reads until owner_id is added

create policy "Allow authenticated insert company"
on companies
for insert
to authenticated
with check (true); -- temporarily allow all inserts until owner_id is added

create policy "Allow authenticated update own company"
on companies
for update
to authenticated
using (true)
with check (true); -- temporarily allow all updates until owner_id is added
