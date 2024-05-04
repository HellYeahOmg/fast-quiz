import QuizForm from "~/app/quiz-settings/form";
import { fetchCategories } from "~/server/queries";
import { Box, Text } from "@radix-ui/themes";

export default async function Form() {
  const categories = await fetchCategories();

  if (categories instanceof Error)
    return (
      <Box>
        <Text>{categories.message}</Text>
      </Box>
    );

  return <QuizForm categories={categories}></QuizForm>;
}
