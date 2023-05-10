import Head from "next/head";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import questionServices from "../../../services/questionsServices";
import PageBox from "../../../components/common/PageBox";
import NoContent from "../../../components/common/NoContent";
import { BsTrash } from "react-icons/bs";
import ErrorPage from "../../../components/common/ErrorPage";
import NewQuestion from "../../../modals/newQuestion";
import quizServices from "../../../services/quizzesServices";
import { getSession } from "next-auth/react";

type Props = {};

export interface Question {
  id: number;
  question: string;
  answer: string;
  quiz: any[];
}

// here i need to add quiz type

export default function Questions({}: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [showAnswers, setShowAnswers] = React.useState<boolean>(false);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      return await questionServices.fetchAll();
    },
  });

  const { data: quizzes } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      return await quizServices.fetch();
    },
  });

  const { mutate } = useMutation(questionServices.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries(["questions"]);
      toast({
        title: "Pitanje je obrisano.",
        status: "success",
      });
    },
    onError: (error) => {
      toast({
        title: `Pitanje nije obrisano.${error}`,
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
        <title>Questions</title>
        <meta name="description" content="questions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <Stack justify={"space-between"} mb="10" direction={"row"}>
          {/*  Page title */}
          <Heading fontWeight={"normal"}>Pitanja</Heading>
          {/* Add multi button if needed */}
          <HStack>
            {quizzes.length ? (
              <>
                <NewQuestion />
              </>
            ) : (
              <>
                {" "}
                <Button isDisabled>Neophodno je kreirati kviz!</Button>
              </>
            )}
          </HStack>
        </Stack>
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
          {quizzes.length === 0 ? (
            <>
              <NoContent message="Nema pitanja." />
            </>
          ) : (
            <>
              <HStack w="100%">
                <TableContainer w="100%">
                  <Table variant="simple" w="100%">
                    <Tbody>
                      {data &&
                        data.map((item: Question) => (
                          <Tr
                            flexDir={["column", "row"]}
                            justifyContent="center"
                            justifyItems="center"
                            alignContent="center"
                            alignItems="center"
                            w="100%"
                            cursor={"pointer"}
                            zIndex={1}
                            key={item.id}
                          >
                            <Td>
                              <Box fontWeight="bold">
                                <Box
                                  fontWeight="normal"
                                  display="inline-block"
                                  mr="1"
                                  fontSize={showAnswers ? "sm" : "0"}
                                >
                                  {showAnswers ? "Pitanje: " : ""}
                                </Box>
                                {item.question}
                              </Box>
                              {showAnswers && (
                                <Box fontWeight="bold">
                                  <Box
                                    fontWeight="normal"
                                    display="inline-block"
                                    mr="1"
                                    fontSize="sm"
                                  >
                                    Odgovor:
                                  </Box>
                                  {item.answer}
                                </Box>
                              )}
                            </Td>
                            <Td isNumeric>
                              <IconButton
                                colorScheme="red"
                                aria-label="Delete question"
                                icon={<BsTrash />}
                                onClick={() => {
                                  mutate(item);
                                }}
                              />
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
        <HStack justify={"end"} mt={"4"}>
          {quizzes && quizzes.length === 0 ? null : (
            <>
              <Button
                colorScheme={showAnswers ? "red" : "green"}
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? "Sakrij odgovore" : "Prikazi odgovore"}
              </Button>
            </>
          )}
        </HStack>
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
