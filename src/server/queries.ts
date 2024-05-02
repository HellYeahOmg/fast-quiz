"use server";

import { env } from "~/env";
import { type category, type difficulty, type QuizQuestion } from "~/types";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { questions, quizzes, type SelectQuestions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const apiUrl = new URL("https://quizapi.io/api/v1/questions");
apiUrl.searchParams.append("apiKey", env.QUIZ_KEY);
apiUrl.searchParams.append("limit", String(10));

type QueryParams = {
  difficulty?: difficulty;
  category?: category;
};

const fetchQuiz = async (params?: QueryParams) => {
  const { difficulty, category } = params ?? {};

  if (difficulty) {
    apiUrl.searchParams.append("difficulty", difficulty);
  }

  if (category) {
    apiUrl.searchParams.append("category", category);
  }

  const apiUrlString = apiUrl.toString();
  const data = await fetch(apiUrlString, { cache: "no-store" });

  if (data.ok) {
    return (await data.json()) as QuizQuestion[];
  }

  return new Error("Could not fetch quiz");
};

export const createQuiz = async (params?: QueryParams) => {
  const { userId } = auth();

  const newQuestions = await fetchQuiz(params);

  if (newQuestions instanceof Error) return redirect("/no-questions");

  if (!userId) {
    redirect("/sign-in");
  }

  const quiz = await db
    .insert(quizzes)
    .values({
      category: params?.category ?? "Mixed",
      difficulty: params?.difficulty ?? "Mixed",
      userId: userId,
    })
    .returning({ id: quizzes.id });

  if (!quiz.length) {
    return new Error("Something went wrong. Could not create quiz");
  }

  const newQuizId = quiz[0]!.id;

  const mappedQuestions = newQuestions.map((question) => ({
    ...question,
    userId,
    quizId: newQuizId,
  }));

  await db.insert(questions).values(mappedQuestions);

  redirect("/quiz/" + newQuizId);
};

export const getMyQuizzes = async () => {
  const { userId } = auth();

  if (userId) {
    return db.select().from(quizzes).where(eq(quizzes.userId, userId));
  } else return new Error("User not logged in");
};

export const getQuizById = async (quizId: number) => {
  return db.query.quizzes.findFirst({ where: eq(quizzes.id, Number(quizId)) });
};

export const getQuestions = async (quizId: number) => {
  return db
    .select()
    .from(questions)
    .where(eq(questions.quizId, Number(quizId)));
};

const getCorrectAnswersNumber = (
  questions: SelectQuestions[],
  submittedAnswers: Record<number, number[]>,
) => {
  let correctAnswers = 0;

  questions.forEach((question, questionIndex) => {
    const correctIndexes = Object.values(question.correct_answers)
      .map((item, index) => (item === "true" ? index : -1))
      .filter((item) => item !== -1);

    if (
      correctIndexes.every((item) =>
        submittedAnswers[questionIndex]?.includes(item),
      )
    ) {
      correctAnswers++;
    }
  });

  return correctAnswers;
};

export const submitQuiz = async (
  quizId: number,
  submittedAnswers: Record<number, number[]>,
) => {
  const questions = await getQuestions(quizId);

  const correctAnswers = getCorrectAnswersNumber(questions, submittedAnswers);

  await db
    .update(quizzes)
    .set({ correctAnswers, submittedAnswers })
    .where(eq(quizzes.id, quizId));

  revalidatePath("/quiz/[id]");
};
