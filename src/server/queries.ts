"use server";

import { env } from "~/env";
import { type difficulty, type QuizQuestion } from "~/types";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { questions, quizzes, type SelectQuestions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const baseUrl = "https://quizapi.io/api/v1/";

type QueryParams = {
  difficulty?: difficulty;
  category?: string;
};

const fetchQuiz = async (params?: QueryParams) => {
  const { difficulty, category } = params ?? {};

  const url = new URL(baseUrl + "questions");
  url.searchParams.append("apiKey", env.QUIZ_KEY);
  url.searchParams.append("limit", String(10));

  if (difficulty) {
    url.searchParams.append("difficulty", difficulty);
  }

  if (category) {
    url.searchParams.append("category", category);
  }

  const apiUrlString = url.toString();
  const data = await fetch(apiUrlString, { cache: "no-store" });

  if (data.ok) {
    return (await data.json()) as QuizQuestion[];
  }

  return new Error("Could not fetch quiz");
};

export const createQuiz = async (params?: QueryParams) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const newQuestions = await fetchQuiz(params);

  if (newQuestions instanceof Error) return redirect("/no-questions");

  const quiz = await db
    .insert(quizzes)
    .values({
      category: params?.category ?? "Mixed",
      difficulty: params?.difficulty ?? "Mixed",
      userId: userId,
    })
    .returning({ id: quizzes.id });

  if (!quiz[0]) {
    return new Error(
      "Something went wrong. Could not create quiz. Please, try again later.",
    );
  }

  const newQuizId = quiz[0].id;

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

export const fetchCategories = async () => {
  const url = new URL(`${baseUrl}categories`);
  url.searchParams.append("apiKey", env.QUIZ_KEY);
  url.searchParams.append("limit", String(20));

  try {
    const response = await fetch(url, { cache: "no-store" });
    return ((await response.json()) as Array<{ id: number; name: string }>).map(
      (item) => item.name,
    );
  } catch (e) {
    return new Error("Failed to fetch categories. Please, try again later.");
  }
};
