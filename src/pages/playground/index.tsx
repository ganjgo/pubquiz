import { Box, Button, Center, Stack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import PageBox from "../../../components/common/PageBox";

type Props = {};

export default function Playground({}: Props) {
  return (
    <>
      <PageBox>
        <Center h="50vh">
          <VStack
            h="100%"
            w="100%"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Stack
              border={"1px solid"}
              borderColor={"gray.200"}
              borderRadius={"lg"}
              p="6"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text fontSize="2xl">Dobrodošli u EnterWell kviz!</Text>
              <Link href="/1">
                <Button size={"lg"} colorScheme={"green"} mt="6">
                  STARTAJTE KVIZ
                </Button>
              </Link>
            </Stack>
          </VStack>
        </Center>
      </PageBox>
    </>
  );
}
