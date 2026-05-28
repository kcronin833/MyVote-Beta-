"use client";

/* Shared hook for the Daily Question — used by both DailyQuestionCard
   and the streak chip in LeftRail so they stay in sync after a vote. */

import { useCallback, useEffect, useState } from "react";

export interface DailyQuestionState {
  questionId: string | null;
  prompt: string;
  context: string | null;
  choices: Array<{ id: string; label: string }>;
  counts: Record<string, number>;
  totalAnswers: number;
  userAnswer: string | null;
  streak: number;
  signedIn: boolean;
  loading: boolean;
  error: string | null;
}

const INITIAL: DailyQuestionState = {
  questionId: null,
  prompt: "",
  context: null,
  choices: [],
  counts: {},
  totalAnswers: 0,
  userAnswer: null,
  streak: 0,
  signedIn: false,
  loading: true,
  error: null,
};

export function useDailyQuestion() {
  const [state, setState] = useState<DailyQuestionState>(INITIAL);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/daily-question", { cache: "no-store" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setState({
        questionId: data.question?.id ?? null,
        prompt: data.question?.prompt ?? "",
        context: data.question?.context ?? null,
        choices: data.question?.choices ?? [],
        counts: data.counts ?? {},
        totalAnswers: data.totalAnswers ?? 0,
        userAnswer: data.userAnswer ?? null,
        streak: data.streak ?? 0,
        signedIn: !!data.signedIn,
        loading: false,
        error: null,
      });
    } catch (e: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: e?.message ?? "Failed to load daily question.",
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async (choiceId: string): Promise<{ ok: boolean; error?: string }> => {
      if (!state.questionId) return { ok: false, error: "No active question." };

      // Optimistic: assume the vote lands so the user sees instant feedback.
      const previousAnswer = state.userAnswer;
      setState((prev) => {
        const counts = { ...prev.counts };
        if (previousAnswer && counts[previousAnswer]) {
          counts[previousAnswer] = Math.max(0, counts[previousAnswer] - 1);
        }
        counts[choiceId] = (counts[choiceId] || 0) + 1;
        return {
          ...prev,
          userAnswer: choiceId,
          counts,
          totalAnswers: previousAnswer ? prev.totalAnswers : prev.totalAnswers + 1,
        };
      });

      const res = await fetch("/api/daily-question/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questionId: state.questionId, choiceId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Roll back the optimistic update — refresh from server.
        refresh();
        return { ok: false, error: body.error || `API ${res.status}` };
      }

      // Server-authoritative refresh (also picks up the updated streak).
      refresh();
      return { ok: true };
    },
    [state.questionId, state.userAnswer, refresh]
  );

  return { ...state, submit, refresh };
}
