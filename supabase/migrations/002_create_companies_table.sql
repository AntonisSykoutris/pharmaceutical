-- Create companies table
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
