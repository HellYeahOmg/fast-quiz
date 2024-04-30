import { Button, Container, Flex, Heading, Separator } from "@radix-ui/themes";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <>
      <Container size={"3"} height={"60px"}>
        <Flex align={"center"} justify={"between"} height={"100%"}>
          <Link href={"/"}>
            <Heading as={"h1"}>Tech-quiz</Heading>
          </Link>

          <SignedIn>
            <UserButton />
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
