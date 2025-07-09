-- Optional: Create enum for development phases
create type development_phase as enum (
  'Discovery',
  'Preclinical',
  'Phase I',
  'Phase II',
  'Phase III',
  'Approved',
  'Discontinued'
);
