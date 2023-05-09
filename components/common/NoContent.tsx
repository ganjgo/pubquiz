import { Box, Center, Stack } from "@chakra-ui/react";
import React from "react";

type Props = {
  message: string;
};

export default function NoContent({ message }: Props) {
  return (
    <>
      {" "}
      <Center h={"30vh"}>
        <Stack>
          <Box>{message}</Box>
        </Stack>
      </Center>
    </>
  );
}
