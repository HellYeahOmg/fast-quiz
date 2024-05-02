import { getQuestions, getQuizById } from "~/server/queries";
import { QuizWizard } from "~/app/_components/quiz-wizard";
import { Text } from "@radix-ui/themes";

export default async function Page({ params }: { params: { id: string } }) {
  const [questions, quiz] = await Promise.all([
    getQuestions(Number(params.id)),
    getQuizById(Number(params.id)),
  ]);

  if (!quiz) {
    return (
      <div>
        <Text color={"red"}>Quiz not found</Text>
      </div>
    );
  }

  return <QuizWizard quiz={quiz} questions={questions}></QuizWizard>;
}
