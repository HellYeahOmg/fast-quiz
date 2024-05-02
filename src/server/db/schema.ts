import { sql } from "drizzle-orm";
import {
  integer,
  json,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `fast-quiz_${name}`);

export type SelectQuizzes = typeof quizzes.$inferSelect;

export const quizzes = createTable("quizzes", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 30 }).notNull(),
  difficulty: varchar("difficulty", { length: 30 }).notNull(),
  userId: varchar("userId").notNull(),
  correctAnswers: integer("correctAnswers"),
  submittedAnswers: json("submittedAnswers").$type<Record<number, number[]>>(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type SelectQuestions = typeof questions.$inferSelect;

export const questions = createTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId")
    .references(() => quizzes.id, { onDelete: "cascade" })
    .notNull(),
  explanation: varchar("explanation", { length: 300 }),
  question: varchar("question", { length: 200 }).notNull(),
  description: varchar("description", { length: 300 }),
  multiple_correct_answers: varchar("multiple_correct_answers", {
    length: 30,
  }).notNull(),
  userId: varchar("userId").notNull(),
  answers: json("answers").$type<Record<string, string | null>>().notNull(),
  correct_answers: json("correct_answers")
    .$type<Record<string, string | null>>()
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
