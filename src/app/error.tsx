"use client";

import { Box, Button, Text } from "@radix-ui/themes";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Box>
      <Text>Something went wrong. Please, try again later.</Text>
      <Button onClick={() => reset()}>Try again</Button>
    </Box>
  );
}
