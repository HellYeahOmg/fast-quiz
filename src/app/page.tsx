import Link from "next/link";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { createQuiz } from "~/server/queries";
import { SubmitButton } from "~/app/_components/submit-button";

export default async function Home() {
  return (
    <Flex gap="4" direction={"column"}>
      <Heading as={"h2"}>
        Test your knowledge with these ten handpicked questions.
      </Heading>
      <Text>
        The most frequently asked ones in job interviews and head hunting. If
        you can get 10/10 on this quiz, you'll be ready for your next job!
      </Text>

      <Flex gap="2">
        <Link href={"/quiz-settings"} shallow passHref>
          <Button>Setup the quiz</Button>
        </Link>
        <form
          action={async () => {
            "use server";
            return createQuiz();
          }}
        >
          <SubmitButton>Start a random quiz</SubmitButton>
        </form>
      </Flex>
    </Flex>
  );
}
