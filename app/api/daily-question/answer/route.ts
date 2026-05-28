import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* POST /api/daily-question/answer
   Body: { questionId: string, choiceId: string }
   Upserts the signed-in user's answer to the given question.
   RLS guarantees user_id matches auth.uid(). */

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { questionId?: string; choiceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { questionId, choiceId } = body;
  if (!questionId || !choiceId) {
    return NextResponse.json(
      { error: "Missing questionId or choiceId." },
      { status: 400 }
    );
  }

  // Verify the question exists and the choice_id is one of its choices.
  const { data: question, error: qErr } = await supabase
    .from("daily_questions")
    .select("id, choices")
    .eq("id", questionId)
    .maybeSingle();

  if (qErr || !question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const choices = (question.choices as Array<{ id: string }>) || [];
  if (!choices.some((c) => c.id === choiceId)) {
    return NextResponse.json(
      { error: "choiceId is not a valid option for this question." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("daily_question_answers")
    .upsert(
      {
        user_id: user.id,
        question_id: questionId,
        choice_id: choiceId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ answer: data });
}
