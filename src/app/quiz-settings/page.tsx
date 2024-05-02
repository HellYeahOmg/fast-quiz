import QuizForm from "~/app/quiz-settings/form";
import { fetchCategories } from "~/server/queries";

export default async function Form() {
  const categories = await fetchCategories();

  return <QuizForm categories={categories}></QuizForm>;
}
