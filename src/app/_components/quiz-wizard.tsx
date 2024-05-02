"use client";

import { Box, Checkbox, Flex, Text } from "@radix-ui/themes";
import { type SelectQuestions, type SelectQuizzes } from "~/server/db/schema";
import { useState } from "react";
import { type CheckedState } from "@radix-ui/react-menu";
import { submitQuiz } from "~/server/queries";
import { SubmitButton } from "~/app/_components/submit-button";

type PropTypes = {
  questions: SelectQuestions[];
  quiz: SelectQuizzes;
};

export const QuizWizard = ({ questions, quiz }: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<number, number[]>
  >(quiz.submittedAnswers ?? {});

  const handleSubmit = () => {
    setIsLoading(true);
    void submitQuiz(quiz.id, submittedAnswers);
  };

  const handleCheck = (
    value: CheckedState,
    questionIndex: number,
    answerIndex: number,
  ) => {
    setSubmittedAnswers((prev) => {
      if (value) {
        return {
          ...prev,
          [questionIndex]: [...(prev[questionIndex] ?? []), answerIndex],
        };
      } else {
        return {
          ...prev,
          [questionIndex]: (prev[questionIndex] ?? []).filter(
            (item) => item !== answerIndex,
          ),
        };
      }
    });
  };

  const isSubmitted = Boolean(quiz.correctAnswers);
  const isBlocked = Object.keys(submittedAnswers).length !== 10;

  return (
    <Flex direction="column" gap="2" pb="4">
      <Text>
        Note: questions with multiple answers will be marked accordingly.
      </Text>
      {questions.map((item, questionIndex) => {
        const answers = Object.values(item.answers).filter((item) =>
          Boolean(item),
        ) as string[];

        const correctAnswers = Object.values(item.correct_answers).filter(
          (item) => Boolean(item),
        ) as string[];

        return (
          <Box key={item.id} mb="4">
            <Text weight={"bold"}>{item.question}</Text>
            <Box>
              {item.description && <Text>{item.description}</Text>}
              {item.multiple_correct_answers === "true" && (
                <Text>Question has multiple answers</Text>
              )}
            </Box>
            {answers.map((answer, answerIndex) => (
              <Text as={"label"} key={answerIndex}>
                <Flex align={"center"} gap={"2"}>
                  <Checkbox
                    checked={submittedAnswers[questionIndex]?.includes(
                      answerIndex,
                    )}
                    onCheckedChange={(value) =>
                      handleCheck(value, questionIndex, answerIndex)
                    }
                    disabled={isSubmitted}
                  />

                  <Text
                    color={
                      isSubmitted
                        ? correctAnswers[answerIndex] === "true"
                          ? "green"
                          : "red"
                        : undefined
                    }
                  >
                    {answer}
                  </Text>
                </Flex>
              </Text>
            ))}
          </Box>
        );
      })}

      {!isSubmitted && (
        <Box width={"100px"}>
          <SubmitButton
            disabled={isBlocked}
            loading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </SubmitButton>
        </Box>
      )}

      {isSubmitted && (
        <Flex direction={"column"}>
          <Text weight={"bold"}>Results</Text>
          <Text>Correct answers: {quiz.correctAnswers}</Text>
        </Flex>
      )}
    </Flex>
  );
};
