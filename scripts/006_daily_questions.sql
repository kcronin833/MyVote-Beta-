-- 006_daily_questions.sql
-- ============================================================
-- Daily Question feature: one civic question per day with
-- aggregate vote counts and per-user streak tracking.
-- ============================================================
--
-- Apply this file in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/_/sql
-- Paste the whole file and click "Run". Safe to re-run
-- (everything uses IF NOT EXISTS / DROP POLICY IF EXISTS).
-- ============================================================


-- ─── Tables ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  active_date  DATE NOT NULL UNIQUE,                     -- one question per calendar day
  prompt       TEXT NOT NULL,
  context      TEXT,                                     -- optional 1-line context
  choices      JSONB NOT NULL,                           -- [{ "id": "yes", "label": "Yes" }, ...]
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_question_answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id)        ON DELETE CASCADE,
  question_id  UUID NOT NULL REFERENCES public.daily_questions(id) ON DELETE CASCADE,
  choice_id    TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)                          -- one answer per user per question
);


-- ─── Indexes ────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_daily_questions_active_date
  ON public.daily_questions(active_date DESC);

CREATE INDEX IF NOT EXISTS idx_dq_answers_question_id
  ON public.daily_question_answers(question_id);

CREATE INDEX IF NOT EXISTS idx_dq_answers_user_id_created_at
  ON public.daily_question_answers(user_id, created_at DESC);


-- ─── Row-Level Security ─────────────────────────────────────────────

ALTER TABLE public.daily_questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_question_answers ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read questions.
DROP POLICY IF EXISTS "dq_select_all" ON public.daily_questions;
CREATE POLICY "dq_select_all"
  ON public.daily_questions
  FOR SELECT
  USING (true);

-- Anyone can read all answers so we can compute aggregate counts.
-- Note: individual votes are public by this design. If you want
-- private votes, swap to a server-side aggregate function.
DROP POLICY IF EXISTS "dqa_select_all" ON public.daily_question_answers;
CREATE POLICY "dqa_select_all"
  ON public.daily_question_answers
  FOR SELECT
  USING (true);

-- A signed-in user can only insert their own answer.
DROP POLICY IF EXISTS "dqa_insert_own" ON public.daily_question_answers;
CREATE POLICY "dqa_insert_own"
  ON public.daily_question_answers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- A signed-in user can change their own answer (we upsert from the API).
DROP POLICY IF EXISTS "dqa_update_own" ON public.daily_question_answers;
CREATE POLICY "dqa_update_own"
  ON public.daily_question_answers
  FOR UPDATE
  USING (auth.uid() = user_id);


-- ─── Seed today's question ──────────────────────────────────────────
-- Safe to re-run: ON CONFLICT (active_date) DO NOTHING.

INSERT INTO public.daily_questions (active_date, prompt, context, choices)
VALUES (
  CURRENT_DATE,
  'Should Georgia raise the minimum age for assault weapon purchases to 21?',
  'Senate Bill 287 is in committee this week.',
  '[
    {"id": "yes",    "label": "Yes"},
    {"id": "no",     "label": "No"},
    {"id": "unsure", "label": "Need more info"}
  ]'::jsonb
)
ON CONFLICT (active_date) DO NOTHING;


-- ─── Optional: schedule tomorrow's question ─────────────────────────
-- Uncomment + edit before running if you want a question queued up.

-- INSERT INTO public.daily_questions (active_date, prompt, context, choices)
-- VALUES (
--   CURRENT_DATE + 1,
--   'Should MARTA Beltline Phase 2 funding move forward without a cost-overrun audit?',
--   'Fulton County voted 5-2 to fund Phase 2 design this week.',
--   '[
--     {"id": "yes",    "label": "Yes, fund now"},
--     {"id": "audit",  "label": "Audit first"},
--     {"id": "no",     "label": "No"}
--   ]'::jsonb
-- )
-- ON CONFLICT (active_date) DO NOTHING;
