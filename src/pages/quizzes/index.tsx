import Head from "next/head";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import quizServices from "../../../services/quizzesServices";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorPage from "../../../components/common/ErrorPage";
import PageBox from "../../../components/common/PageBox";
import {
  Box,
  Button,
  Heading,
  Hide,
  HStack,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  useToast,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import NoContent from "../../../components/common/NoContent";
import { BsPlus, BsTrash } from "react-icons/bs";

interface Quiz {
  id: number;
  name: string;
  questions: any[];
  results: any[];
  updatedAt: Date;
  createdAt: Date;
}

type Props = {};

export default function Quizzes({}: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isLargerThanPhone] = useMediaQuery("(min-width: 640px)");

  const { isLoading, isError, data } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      return await quizServices.fetch();
    },
  });

  const { mutate } = useMutation(quizServices.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
      toast({
        title: "Kviz je obrisan.",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Kviz nije obrisan.${error}`,
        status: "error",
      });
    },
  });

  if (isLoading)
    return (
      <>
        <LoadingSpinner />
      </>
    );
  if (isError)
    return (
      <>
        <ErrorPage />
      </>
    );

  return (
    <>
      <Head>
        <title>Quizzes</title>
        <meta name="description" content="quizzes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <HStack justify={"space-between"} mb="10">
          {/*  Page title */}
          <Heading fontWeight={"normal"}>Kvizovi</Heading>
          {/* Add multi button if needed */}
          <HStack>
            <Link href="/quizzes/newquiz">
              <Button colorScheme={"blue"} rightIcon={<BsPlus />}>
                Novi Kviz
              </Button>
            </Link>
          </HStack>
        </HStack>
        {/* Page content */}

        <Stack
          border={"1px solid"}
          borderColor={"gray.200"}
          borderRadius={"lg"}
          p="6"
          h={"full"}
          spacing={6}
          maxH={"calc(100vh - 200px)"}
          overflowY="scroll"
        >
          {data.length === 0 ? (
            <>
              <NoContent message="Nema kvizova." />
            </>
          ) : (
            <>
              <HStack>
                <TableContainer w="100%">
                  <Table variant="simple" w="100%">
                    <Hide below="md">
                      <Thead>
                        <Tr>
                          <Th>Naziv kviza</Th>
                          <Th isNumeric>operacije</Th>
                        </Tr>
                      </Thead>
                    </Hide>
                    <Tbody w="100%">
                      {data &&
                        data.length > 0 &&
                        data.map((item: Quiz) => (
                          <Tr
                            display={isLargerThanPhone ? "" : "flex"}
                            flexDir={["column", "row"]}
                            justifyContent="center"
                            justifyItems="center"
                            alignContent="center"
                            alignItems="center"
                            w="100%"
                            zIndex={1}
                            key={item.id}
                          >
                            <Td>
                              <Box
                                _hover={{ bg: "gray.100" }}
                                cursor={"pointer"}
                                w="fit-content"
                              >
                                <Link href={`/quiz/${item.id}`}>
                                  {item.name}
                                </Link>
                              </Box>
                            </Td>
                            <Td isNumeric>
                              <HStack justify="end" zIndex={5}>
                                <Link href={`/quizzes/${item.id}`}>
                                  <Button colorScheme="blue">Uredi</Button>
                                </Link>
                                <Link href={`/playground/${item.id}`}>
                                  <Button colorScheme="green">Pogledaj</Button>
                                </Link>
                                <IconButton
                                  colorScheme="red"
                                  icon={<BsTrash />}
                                  aria-label="Delete quiz"
                                  onClick={() => mutate(item.id)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </HStack>
            </>
          )}
        </Stack>
      </PageBox>
    </>
  );
}
