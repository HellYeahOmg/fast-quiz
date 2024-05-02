export type difficulty = "Easy" | "Medium" | "Hard";

export const difficultyOptions = ["Easy", "Medium", "Hard"] as const;

export interface QuizQuestion {
  id: number;
  question: string;
  description: string;
  explanation?: string;
  tip: string | null;
  tags: string[];
  category: string;
  difficulty: difficulty;
  multiple_correct_answers: string;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
  };
}
