-- Parent reviews for WinglyKidsAcademy.
-- Run only after approval. This does not delete or alter existing data.

create table if not exists public.parent_reviews (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  parent_name text not null,
  child_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null check (char_length(review_text) between 10 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.parent_reviews enable row level security;

create index if not exists parent_reviews_status_submitted_idx
  on public.parent_reviews(status, submitted_at desc);

create policy "Approved parent reviews are public"
on public.parent_reviews
for select
to anon, authenticated
using (status = 'approved');

