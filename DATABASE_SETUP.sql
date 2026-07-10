-- ═══════════════════════════════════════════════════════════════
-- WINGLYKIDS DATABASE SETUP
-- Tables for Homework Assignment & Student Submissions System
-- Created: July 2026
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- TABLE 1: homework_assignments
-- Stores homework assigned by teachers to students
-- ──────────────────────────────────────────────────────────────

CREATE TABLE homework_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE 2: student_submissions
-- Stores student submissions for homework assignments
-- ──────────────────────────────────────────────────────────────

CREATE TABLE student_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  homework_id UUID REFERENCES homework_assignments(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  teacher_grade INTEGER,
  teacher_feedback TEXT,
  reviewed_at TIMESTAMP,
  status TEXT DEFAULT 'submitted'
);

-- ───────────────────────────────────────────────────────────────
-- HOW TO USE THIS FILE
-- ───────────────────────────────────────────────────────────────
--
-- 1. Go to Supabase Dashboard: https://app.supabase.com
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Click "New Query"
-- 5. Copy-paste the "CREATE TABLE homework_assignments" query above
-- 6. Click "Run"
-- 7. Repeat steps 4-6 for "CREATE TABLE student_submissions" query
-- 8. Done! Tables created.
--
-- ───────────────────────────────────────────────────────────────
-- TABLE STRUCTURE EXPLANATION
-- ───────────────────────────────────────────────────────────────
--
-- homework_assignments table:
--   - id: Unique identifier (auto-generated UUID)
--   - student_id: Links to student who receives homework (required)
--   - title: Homework title (required, e.g., "Animals Worksheet")
--   - description: Homework details (optional, e.g., "Complete pages 1-2")
--   - file_url: Path to homework file in cloud storage (optional)
--   - due_date: When homework is due (required, e.g., "2026-07-15")
--   - status: 'active' or 'completed' (default: 'active')
--   - created_at: When homework was assigned (auto timestamp)
--
-- student_submissions table:
--   - id: Unique identifier (auto-generated UUID)
--   - student_id: Which student submitted (required)
--   - homework_id: Which homework assignment (required, links to homework_assignments)
--   - file_url: Path to student's submitted file (required)
--   - file_name: Original file name (e.g., "my_homework.pdf")
--   - submitted_at: When student submitted (auto timestamp)
--   - teacher_grade: Stars given by teacher (1-5, optional)
--   - teacher_feedback: Feedback text from teacher (optional)
--   - reviewed_at: When teacher reviewed (optional timestamp)
--   - status: 'submitted' or 'reviewed' (default: 'submitted')
--
-- ───────────────────────────────────────────────────────────────
-- RELATIONSHIPS
-- ───────────────────────────────────────────────────────────────
--
-- homework_assignments.student_id → students.id
--   (Each homework is assigned to one student)
--
-- student_submissions.student_id → students.id
--   (Each submission belongs to one student)
--
-- student_submissions.homework_id → homework_assignments.id
--   (Each submission is for one homework assignment)
--
-- ───────────────────────────────────────────────────────────────
-- EXAMPLE DATA (for testing)
-- ───────────────────────────────────────────────────────────────
--
-- After creating tables, you can insert test data:
--
-- INSERT INTO homework_assignments (student_id, title, description, due_date)
-- VALUES (
--   'student-uuid-here',
--   'Animals Worksheet',
--   'Complete pages 1-2 with drawings',
--   '2026-07-15'
-- );
--
-- INSERT INTO student_submissions (student_id, homework_id, file_url, file_name, status)
-- VALUES (
--   'student-uuid-here',
--   'homework-uuid-here',
--   'submissions/student-id/file.pdf',
--   'my_homework.pdf',
--   'submitted'
-- );
--
-- ───────────────────────────────────────────────────────────────
-- INDEXES (for performance - optional)
-- ───────────────────────────────────────────────────────────────
--
-- If you have many records, add these indexes for faster queries:
--
-- CREATE INDEX idx_homework_student_id ON homework_assignments(student_id);
-- CREATE INDEX idx_submissions_student_id ON student_submissions(student_id);
-- CREATE INDEX idx_submissions_homework_id ON student_submissions(homework_id);
-- CREATE INDEX idx_submissions_status ON student_submissions(status);
--
-- ───────────────────────────────────────────────────────────────
-- QUERIES YOU'LL COMMONLY USE
-- ───────────────────────────────────────────────────────────────
--
-- 1. Get all homework for a student:
--    SELECT * FROM homework_assignments WHERE student_id = 'student-id' AND status = 'active';
--
-- 2. Get all submissions for homework:
--    SELECT * FROM student_submissions WHERE homework_id = 'homework-id';
--
-- 3. Get pending submissions (not yet reviewed):
--    SELECT * FROM student_submissions WHERE status = 'submitted' AND reviewed_at IS NULL;
--
-- 4. Update submission with teacher feedback:
--    UPDATE student_submissions SET teacher_grade = 5, teacher_feedback = 'Great work!', status = 'reviewed', reviewed_at = NOW() WHERE id = 'submission-id';
--
-- 5. Mark homework as completed:
--    UPDATE homework_assignments SET status = 'completed' WHERE id = 'homework-id';
--
-- ═══════════════════════════════════════════════════════════════
