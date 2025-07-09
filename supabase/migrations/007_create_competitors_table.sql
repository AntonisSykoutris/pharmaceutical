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
