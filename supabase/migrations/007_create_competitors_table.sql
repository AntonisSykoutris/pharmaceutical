-- Competitors table (other pharma companies)
create table if not exists competitors (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  website_url text,
  description text,
  country text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for updated_at
create trigger update_competitors_updated_at
before update on competitors
for each row
execute procedure update_updated_at_column();

-- Enable RLS
alter table competitors enable row level security;

-- Policies

-- Allow users to read competitors linked to their company
create policy "Allow users to read competitors of their company"
on competitors
for select
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = competitors.company_id
  )
);

-- Allow users to insert competitors for their company
create policy "Allow users to insert competitors for their company"
on competitors
for insert
to authenticated
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = competitors.company_id
  )
);

-- Allow users to update competitors of their company
create policy "Allow users to update competitors of their company"
on competitors
for update
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = competitors.company_id
  )
)
with check (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = competitors.company_id
  )
);

-- Allow users to delete competitors of their company
create policy "Allow users to delete competitors of their company"
on competitors
for delete
to authenticated
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.company_id = competitors.company_id
  )
);
