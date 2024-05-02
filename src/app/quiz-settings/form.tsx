"use client";

import { Flex, Select, Text } from "@radix-ui/themes";
import { type difficulty, difficultyOptions } from "~/types";
import { useState } from "react";
import { createQuiz } from "~/server/queries";
import { SubmitButton } from "~/app/_components/submit-button";

export default function QuizForm({ categories }: { categories: string[] }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<difficulty>(
    difficultyOptions[0],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <Flex direction="column" gap="2">
      <Flex gap="2" align={"center"}>
        <Text>Choose difficulty</Text>
        <Select.Root
          value={selectedDifficulty}
          onValueChange={(option) => {
            setSelectedDifficulty(option as difficulty);
          }}
        >
          <Select.Trigger />
          <Select.Content>
            {difficultyOptions.map((option) => (
              <Select.Item key={option} value={option}>
                {option}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      <Flex gap="2" align={"center"}>
        <Text>Choose Category</Text>
        <Select.Root
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <Select.Trigger />
          <Select.Content>
            {categories.map((option) => (
              <Select.Item key={option} value={option}>
                {option}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      <Flex>
        <form
          action={() =>
            createQuiz({
              category: selectedCategory,
              difficulty: selectedDifficulty,
            })
          }
        >
          <SubmitButton>Start a random quiz</SubmitButton>
        </form>
      </Flex>
    </Flex>
  );
}
