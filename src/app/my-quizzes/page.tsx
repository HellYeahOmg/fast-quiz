import { getMyQuizzes } from "~/server/queries";
import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Link from "next/link";

export default async function Page() {
  const quizzes = await getMyQuizzes();

  if (quizzes instanceof Error)
    return (
      <div>
        <Text color={"red"}>Could not fetch my-quizzes</Text>
      </div>
    );

  if (!quizzes.length) {
    return <Text>You have no quizzes yet.</Text>;
  }

  return (
    <Grid width="auto" gap="3" columns={{ initial: "1", sm: "2", md: "3" }}>
      {quizzes.map((item) => (
        <Link href={`/quiz/${item.id}`} key={item.id} shallow passHref>
          <Card>
            <Flex height={"100px"} gap="3" align="start">
              <Box>
                <Text as="div" size="2" weight={"bold"}>
                  Started at: {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Text as="div" size="2">
                  Category: {item.category}
                </Text>
                <Text as="div" size="2">
                  Difficulty: {item.difficulty}
                </Text>
                {item.correctAnswers && (
                  <Text as="div" size="2">
                    Correct answers: {item.correctAnswers}
                  </Text>
                )}
              </Box>
            </Flex>
          </Card>
        </Link>
      ))}
    </Grid>
  );
}
