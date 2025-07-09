-- Create drugs table
create table if not exists drugs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  molecule_type text,
  therapeutic_area text,
  mechanism_of_action text,
  development_phase development_phase,
  status drug_status,
  target_indication text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to auto-update updated_at
create or replace function update_drugs_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language 'plpgsql';

create trigger update_drugs_updated_at
before update on drugs
for each row
execute procedure update_drugs_updated_at_column();
