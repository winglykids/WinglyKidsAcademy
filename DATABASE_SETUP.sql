-- WinglyKids Academy secure backend setup
-- Run this in Supabase SQL Editor before deploying the updated GitHub files.

create extension if not exists pgcrypto;

create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'teacher', false)
    or exists (
      select 1 from public.teacher_profiles t
      where t.user_id = auth.uid()
    );
$$;

-- IMPORTANT:
-- After your teacher has a Supabase Auth account, replace the email below and run it.
-- insert into public.teacher_profiles (user_id, email)
-- select id, email from auth.users where email = 'winglykids@gmail.com'
-- on conflict (user_id) do update set email = excluded.email;

alter table public.students add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
alter table public.students add column if not exists auth_email text;
alter table public.students add column if not exists child_age text;
alter table public.students add column if not exists child_grade text;
alter table public.students add column if not exists english_level text;
alter table public.students add column if not exists parent_name text;
alter table public.students add column if not exists parent_email text;
alter table public.students add column if not exists parent_phone text;
alter table public.students add column if not exists session_format text;
alter table public.students add column if not exists payment_plan text;
alter table public.students add column if not exists preferred_days text;
alter table public.students add column if not exists preferred_time_slot text;
alter table public.students add column if not exists selected_lesson_date date;
alter table public.students add column if not exists selected_lesson_time time;
alter table public.students add column if not exists lessons_per_week integer default 2;
alter table public.students add column if not exists notes text;
alter table public.students add column if not exists pricing_type text;
alter table public.students add column if not exists schedule_type text;
alter table public.students add column if not exists lessons_selected integer;
alter table public.students add column if not exists selected_schedule jsonb;
alter table public.students add column if not exists price_per_lesson integer;
alter table public.students add column if not exists expected_amount integer;
alter table public.students add column if not exists payment_status text default 'awaiting_payment';
alter table public.students add column if not exists schedule_status text default 'pending_confirmation';
alter table public.students add column if not exists enrollment_status text default 'pending';
alter table public.students add column if not exists policy_accepted boolean default false;
alter table public.students add column if not exists policy_version text;
alter table public.students add column if not exists policy_accepted_at timestamptz;
alter table public.students add column if not exists meet_link text;
alter table public.students add column if not exists next_lesson_at timestamptz;
alter table public.students add column if not exists lesson_duration_minutes integer default 50;
alter table public.students add column if not exists language text default 'en';
create unique index if not exists students_username_unique on public.students (lower(username));

create table if not exists public.lesson_bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  lesson_date date not null,
  start_time time not null,
  duration_minutes integer not null default 50,
  status text not null default 'booked',
  notes text,
  created_at timestamptz not null default now(),
  constraint lesson_bookings_duration_check check (duration_minutes = 50)
);

create unique index if not exists lesson_bookings_one_private_lesson_per_slot
on public.lesson_bookings (lesson_date, start_time)
where status <> 'cancelled';

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  phone text not null,
  email text not null,
  subject text not null,
  message text not null,
  language text not null default 'en',
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.contact_messages add column if not exists language text default 'en';

create table if not exists public.homework_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  description text,
  file_path text,
  due_date date not null,
  status text default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.student_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  homework_id uuid references public.homework_assignments(id) on delete set null,
  file_name text not null,
  file_path text,
  file_url text,
  file_size bigint,
  file_type text,
  assignment_name text,
  teacher_grade integer,
  teacher_feedback text,
  reviewed_at timestamptz,
  status text default 'submitted',
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null default now()
);

alter table public.homework_assignments add column if not exists file_path text;
alter table public.homework_assignments add column if not exists assignment_type text not null default 'homework';
alter table public.homework_assignments add column if not exists completed_at timestamptz;
alter table public.homework_assignments add column if not exists checked_by_teacher boolean not null default false;
alter table public.homework_assignments add column if not exists teacher_feedback text;
alter table public.student_submissions add column if not exists homework_id uuid references public.homework_assignments(id) on delete set null;
alter table public.student_submissions add column if not exists file_name text;
alter table public.student_submissions add column if not exists file_path text;
alter table public.student_submissions add column if not exists file_url text;
alter table public.student_submissions add column if not exists file_size bigint;
alter table public.student_submissions add column if not exists file_type text;
alter table public.student_submissions add column if not exists assignment_name text;
alter table public.student_submissions add column if not exists teacher_grade integer;
alter table public.student_submissions add column if not exists teacher_feedback text;
alter table public.student_submissions add column if not exists reviewed_at timestamptz;
alter table public.student_submissions add column if not exists status text default 'submitted';
alter table public.student_submissions add column if not exists created_at timestamptz not null default now();
alter table public.student_submissions add column if not exists submitted_at timestamptz not null default now();

alter table public.messages add column if not exists file_name text;
alter table public.messages add column if not exists file_path text;
alter table public.messages add column if not exists file_url text;
alter table public.messages add column if not exists file_type text;
alter table public.messages add column if not exists file_size bigint;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions',
  'submissions',
  false,
  52428800,
  array['application/pdf', 'image/jpeg', 'image/png', 'video/mp4']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.students enable row level security;
alter table public.messages enable row level security;
alter table public.homework_assignments enable row level security;
alter table public.student_submissions enable row level security;
alter table public.lesson_bookings enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Students can read own row and teachers can read all" on public.students;
create policy "Students can read own row and teachers can read all"
on public.students for select
to authenticated
using (auth_user_id = auth.uid() or public.is_teacher());

drop policy if exists "Teachers can update students" on public.students;
create policy "Teachers can update students"
on public.students for update
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "Bookings visible to assigned student and teacher" on public.lesson_bookings;
create policy "Bookings visible to assigned student and teacher"
on public.lesson_bookings for select
to authenticated
using (
  public.is_teacher()
  or exists (
    select 1 from public.students s
    where s.id = lesson_bookings.student_id and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Teachers can manage bookings" on public.lesson_bookings;
create policy "Teachers can manage bookings"
on public.lesson_bookings for all
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "Teachers can read contact messages" on public.contact_messages;
create policy "Teachers can read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_teacher());

drop policy if exists "Anon can lookup login fields" on public.students;
create policy "Anon can lookup login fields"
on public.students for select
to anon
using (true);

drop policy if exists "Messages visible to student and teacher" on public.messages;
create policy "Messages visible to student and teacher"
on public.messages for select
to authenticated
using (
  public.is_teacher()
  or exists (
    select 1 from public.students s
    where s.id = messages.student_id and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Students can send own messages" on public.messages;
create policy "Students can send own messages"
on public.messages for insert
to authenticated
with check (
  sender = 'student'
  and exists (
    select 1 from public.students s
    where s.id = messages.student_id and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Teachers can send messages" on public.messages;
create policy "Teachers can send messages"
on public.messages for insert
to authenticated
with check (sender = 'teacher' and public.is_teacher());

drop policy if exists "Homework visible to assigned student and teacher" on public.homework_assignments;
create policy "Homework visible to assigned student and teacher"
on public.homework_assignments for select
to authenticated
using (
  public.is_teacher()
  or exists (
    select 1 from public.students s
    where s.id = homework_assignments.student_id and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Teachers can create homework" on public.homework_assignments;
create policy "Teachers can create homework"
on public.homework_assignments for insert
to authenticated
with check (public.is_teacher());

drop policy if exists "Teachers can update homework" on public.homework_assignments;
create policy "Teachers can update homework"
on public.homework_assignments for update
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "Students can update own assignment status" on public.homework_assignments;
create policy "Students can update own assignment status"
on public.homework_assignments for update
to authenticated
using (
  exists (
    select 1 from public.students s
    where s.id = homework_assignments.student_id and s.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.students s
    where s.id = homework_assignments.student_id and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Submissions visible to owner and teacher" on public.student_submissions;
create policy "Submissions visible to owner and teacher"
on public.student_submissions for select
to authenticated
using (
  public.is_teacher()
  or exists (
    select 1 from public.students s
    where s.id::text = student_submissions.student_id::text and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Students can create own submissions" on public.student_submissions;
create policy "Students can create own submissions"
on public.student_submissions for insert
to authenticated
with check (
  exists (
    select 1 from public.students s
    where s.id::text = student_submissions.student_id::text and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Teachers can update submissions" on public.student_submissions;
create policy "Teachers can update submissions"
on public.student_submissions for update
to authenticated
using (public.is_teacher())
with check (public.is_teacher());

drop policy if exists "Students upload into own submissions folder" on storage.objects;
create policy "Students upload into own submissions folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'submissions'
  and (storage.foldername(name))[1] = 'student-uploads'
  and exists (
    select 1 from public.students s
    where s.id::text = (storage.foldername(name))[2]
      and s.auth_user_id = auth.uid()
  )
);

drop policy if exists "Teachers upload message files" on storage.objects;
create policy "Teachers upload message files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'submissions'
  and (storage.foldername(name))[1] = 'teacher-messages'
  and public.is_teacher()
);

drop policy if exists "Students and teachers read private submission files" on storage.objects;
create policy "Students and teachers read private submission files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'submissions'
  and (
    public.is_teacher()
    or (
      (storage.foldername(name))[1] = 'student-uploads'
      and exists (
        select 1 from public.students s
        where s.id::text = (storage.foldername(name))[2]
          and s.auth_user_id = auth.uid()
      )
    )
    or (
      (storage.foldername(name))[1] = 'teacher-messages'
      and exists (
        select 1 from public.students s
        where s.id::text = (storage.foldername(name))[2]
          and s.auth_user_id = auth.uid()
      )
    )
  )
);

grant usage on schema public to anon, authenticated;
revoke all on public.students from anon;
grant select (username, auth_email, parent_email) on public.students to anon;
grant select, update on public.students to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert, update on public.homework_assignments to authenticated;
grant select, insert, update on public.student_submissions to authenticated;
grant select on public.contact_messages to authenticated;
