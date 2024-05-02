import {
  Button,
  Container,
  Flex,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <>
      <Container px={"4"} size={"3"} height={"60px"}>
        <Flex align={"center"} justify={"between"} height={"100%"}>
          <Link href={"/"}>
            <Heading as={"h1"}>Tech-quiz</Heading>
          </Link>

          <SignedIn>
            <Flex align={"center"} gap={"3"}>
              <Link href={"/my-quizzes"} shallow passHref>
                <Text color={"blue"} style={{ textDecoration: "underline" }}>
                  My quizzes
                </Text>
              </Link>
              <UserButton />
            </Flex>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </Flex>
      </Container>
      <Separator mb="3" size="4" />
    </>
  );
};
