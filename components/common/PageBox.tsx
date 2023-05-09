import { Box, Container } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PageBox({ children }: Props) {
  return (
    <>
      <Box
        pr={{
          base: 0,
          md: "10",
        }}
        pt={{
          base: 4,
          md: "10",
        }}
        pb="10"
        h={"100%"}
      >
        <Container h={"100%"} maxW={"container.lg"}>
          {children}
        </Container>
      </Box>
    </>
  );
}
