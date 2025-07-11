drop type if exists development_phase;

create type development_phase as enum (
  'Discovery',
  'Preclinical',
  'Phase I',
  'Phase II',
  'Phase III',
  'Approved',
  'Discontinued'
);
