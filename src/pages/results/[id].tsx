import Head from "next/head";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorPage from "../../../components/common/ErrorPage";
import PageBox from "../../../components/common/PageBox";
import NoContent from "../../../components/common/NoContent";
import resultServices from "../../../services/resultsServices";

type Props = {};

export default function Result({}: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [isOriginalAnswer, setIsOriginalAnswer] = React.useState(false);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      return await resultServices.fetchOne(Number(id));
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
        <ErrorPage message="Došlo je do greške prilikom učitavanja kviza." />
      </>
    );

  console.log("resultssss", data);

  return (
    <>
      <Head>
        <title>
          Rezultat {data && data.quizName ? data.quizName : "Error"}
        </title>
        <meta name="description" content="pub quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <HStack justify={"space-between"} mb="10">
          {/*  Page title */}
          <Heading fontWeight={"normal"}>
            Rezultat: {data && data.quizName ? data.quizName : "Error"}
          </Heading>
          {/* Add multi button if needed */}
        </HStack>
        {/* Page content */}
        <Stack>
          {data.length === 0 ? (
            <>
              <NoContent
                message="Trenutno nema podataka, pojavit ce se nakon sto se
                        odigra kviz."
              />
            </>
          ) : (
            <>
              <>
                <Stack spacing={"6"} height={"100%"}>
                  {/* Put all page content inside this flex */}
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
                    <>
                      <Box>
                        <Text fontSize="lg" fontWeight="bold">
                          Naziv kviza:
                        </Text>
                        <Text fontSize="2xl">
                          {data ? data.quizName : "kviz je obrisan"}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="MD" fontWeight="bold">
                          Rijesenje od igraca:
                        </Text>
                        <Text fontSize="xl">
                          {" "}
                          PlayerName(byAdmin):{data.playerName}{" "}
                          <Text>Username(byPlayer):{data.username}</Text>{" "}
                        </Text>
                      </Box>
                      {data.userAnswers && data.userAnswers.length > 0 && (
                        <>
                          {" "}
                          <TableContainer
                            borderTop="1px"
                            borderColor={"gray.200"}
                          >
                            <Box textAlign={"left"} py={5}>
                              <Text fontSize="lg" fontWeight="bold">
                                Pitanja u kvizu:
                              </Text>
                            </Box>
                            <Table size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Lista pitanja i odgovora</Th>
                                  <Th></Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {data.userAnswers.map((answer: any) => {
                                  return (
                                    <Tr
                                      key={answer.id}
                                      _hover={{
                                        backgroundColor: "gray.100",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Td>
                                        <Text fontSize="xl" pb="1">
                                          <Badge colorScheme="gray" p="1">
                                            {answer.question.question}
                                          </Badge>
                                        </Text>

                                        {isOriginalAnswer ? (
                                          <Text>{answer.question.answer}</Text>
                                        ) : (
                                          <Text>{answer.answer}</Text>
                                        )}
                                      </Td>
                                      <Td>
                                        <HStack justify="end">
                                          {answer.question.answer &&
                                          answer.question.length > 0 ? (
                                            <Button
                                              size="sm"
                                              colorScheme="green"
                                              onClick={() =>
                                                setIsOriginalAnswer(
                                                  !isOriginalAnswer
                                                )
                                              }
                                            >
                                              {isOriginalAnswer
                                                ? "Prikazi odgovor igraca"
                                                : "Prikazi odgovor"}
                                            </Button>
                                          ) : (
                                            "nije sinhronizovan"
                                          )}
                                        </HStack>
                                      </Td>
                                    </Tr>
                                  );
                                })}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </>
                  </Stack>
                </Stack>
              </>
            </>
          )}
        </Stack>
      </PageBox>
    </>
  );
}
