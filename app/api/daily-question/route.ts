import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic"; // depends on auth user

/* GET /api/daily-question
   Returns today's daily question (or the most recent active one),
   the aggregate choice counts, the signed-in user's pick if any,
   and the user's current consecutive-day answer streak. */

export interface DailyQuestionChoice {
  id: string;
  label: string;
}
export interface DailyQuestionResponse {
  question: {
    id: string;
    prompt: string;
    context: string | null;
    choices: DailyQuestionChoice[];
    active_date: string;
  } | null;
  counts: Record<string, number>;
  totalAnswers: number;
  userAnswer: string | null;
  streak: number;
  signedIn: boolean;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Most recent question whose active_date is today or earlier.
  const today = new Date().toISOString().slice(0, 10);
  const { data: question } = await supabase
    .from("daily_questions")
    .select("id, prompt, context, choices, active_date")
    .lte("active_date", today)
    .order("active_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!question) {
    const empty: DailyQuestionResponse = {
      question: null,
      counts: {},
      totalAnswers: 0,
      userAnswer: null,
      streak: 0,
      signedIn: !!user,
    };
    return NextResponse.json(empty);
  }

  // Aggregate counts for this question.
  const { data: answers } = await supabase
    .from("daily_question_answers")
    .select("choice_id")
    .eq("question_id", question.id);

  const counts: Record<string, number> = {};
  for (const a of answers || []) {
    counts[a.choice_id] = (counts[a.choice_id] || 0) + 1;
  }
  const totalAnswers = (answers || []).length;

  let userAnswer: string | null = null;
  let streak = 0;

  if (user) {
    const { data: mine } = await supabase
      .from("daily_question_answers")
      .select("choice_id")
      .eq("user_id", user.id)
      .eq("question_id", question.id)
      .maybeSingle();
    userAnswer = mine?.choice_id ?? null;

    // Streak: consecutive calendar days back from today where the
    // user has answered. Pull the last 60 answer rows joined to their
    // question's active_date and walk backward day-by-day.
    const { data: history } = await supabase
      .from("daily_question_answers")
      .select("daily_questions ( active_date )")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(60);

    const dates = new Set<string>();
    for (const row of (history || []) as Array<{
      daily_questions: { active_date: string } | { active_date: string }[] | null;
    }>) {
      const dq = row.daily_questions;
      const ad = Array.isArray(dq) ? dq[0]?.active_date : dq?.active_date;
      if (ad) dates.add(ad);
    }

    const cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);
    while (true) {
      const iso = cursor.toISOString().slice(0, 10);
      if (dates.has(iso)) {
        streak++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      } else {
        break;
      }
    }
  }

  const payload: DailyQuestionResponse = {
    question: {
      id: question.id,
      prompt: question.prompt,
      context: question.context,
      choices: (question.choices as DailyQuestionChoice[]) || [],
      active_date: question.active_date,
    },
    counts,
    totalAnswers,
    userAnswer,
    streak,
    signedIn: !!user,
  };

  return NextResponse.json(payload);
}
