-- Optional: Create enum for drug status
create type drug_status as enum (
  'Active',
  'On hold',
  'Discontinued',
  'Approved'
);
