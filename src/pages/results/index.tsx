import Head from "next/head";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorPage from "../../../components/common/ErrorPage";
import PageBox from "../../../components/common/PageBox";
import {
  Box,
  Button,
  Heading,
  Hide,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import NoContent from "../../../components/common/NoContent";
import resultServices from "../../../services/resultsServices";
import { getSession } from "next-auth/react";

interface Result {
  id: number;
  quizId: number;
  quizName: string;
  playerName: string;
  username: string;
  userAnswers: any[];
  resultDate: Date;
}

type Props = {};

export default function Results({}: Props) {
  const [isLargerThanPhone] = useMediaQuery("(min-width: 640px)");

  const { isLoading, isError, data } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      return await resultServices.fetch();
    },
    refetchOnMount: false,
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
        <title>Results</title>
        <meta name="description" content="results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <HStack justify={"space-between"} mb="10">
          {/*  Page title */}
          <Heading fontWeight={"normal"}>Rezultati</Heading>
          {/* Add multi button if needed */}
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
              <NoContent
                message="Trenutno nema podataka, pojavit ce se nakon sto se
                        odigra kviz."
              />
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
                          <Th isNumeric>igrac</Th>
                          <Th isNumeric>operacije</Th>
                        </Tr>
                      </Thead>
                    </Hide>
                    <Tbody w="100%">
                      {data &&
                        data.length > 0 &&
                        data.map((item: Result) => (
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
                                <Link href={`/quizzes/${item.quizId}`}>
                                  {item.quizName}
                                </Link>
                              </Box>
                            </Td>
                            <Td isNumeric>naziv igraca</Td>
                            <Td isNumeric>
                              <HStack justify="end" zIndex={5}>
                                <Link href={`/results/${item.id}`}>
                                  <Button colorScheme="green">Pogledaj</Button>
                                </Link>
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

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
