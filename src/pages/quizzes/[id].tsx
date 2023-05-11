import Head from "next/head";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import quizServices from "../../../services/quizzesServices";
import { useRouter } from "next/router";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorPage from "../../../components/common/ErrorPage";
import PageBox from "../../../components/common/PageBox";
import NoContent from "../../../components/common/NoContent";
import {
  BsExclamationCircleFill,
  BsLightbulbFill,
  BsLightbulbOffFill,
  BsTrash,
} from "react-icons/bs";
import * as yup from "yup";
import { useFormik } from "formik";
import { Question } from "../questions";
import NewQuestion from "../../../modals/newQuestion";
import QuestionsFromDB from "../../../modals/questionsFromDB";
import QuizLink from "../../../modals/quizLink";
import { getSession } from "next-auth/react";

type Props = {
  specific: any;
};

export default function Quiz({ specific }: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [answersOn, setAnswersOn] = React.useState(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const validationSchema = yup.object().shape({
    quizName: yup.string().required("Required"),
  });

  const { mutate: disconnectQuestion } = useMutation(
    quizServices.disconnectQuestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quizzes"]);
        toast({
          title: "Pitanje je uklonjeno iz kviza.",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Pitanje nije uklonjeno iz kviza.",
          status: "error",
        });
      },
    }
  );

  const {
    handleSubmit,
    values,
    handleChange,
    errors,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      quizName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      if (values.quizName) {
        let newName = {
          quizId: Number(id),
          quizName: values.quizName,
        };
        try {
          await quizServices.updateName(newName);
          queryClient.invalidateQueries(["quizzes"]);
          toast({
            title: "Kviz je ažuriran.",
            status: "success",
          });
        } catch (error) {
          toast({
            title: `Greška prilikom ažuriranja imena kviza, pokušajte ponovno.`,
            status: "error",
          });
        }
      }
    },
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      return await quizServices.fetchOne(Number(id));
    },
    enabled: id !== undefined,
  });


  React.useEffect(() => {
    if (data) {
      setFieldValue("quizName", data.name);
    }
  }, [setFieldValue, data]);

  const [inputValue, setInputValue] = React.useState(values.quizName);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSubmit();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, handleSubmit]);

  const handleChangeAuto = (event: any) => {
    handleChange(event);
    setInputValue(event.target.value);
  };

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

  return (
    <>
      <Head>
        <title>Quiz {data.name}</title>
        <meta name="description" content="pub quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <HStack justify={"space-between"} mb="10">
          {/*  Page title */}
          <Heading fontWeight={"normal"}>Kviz: {data.name}</Heading>
          {/* Add multi button if needed */}
        </HStack>
        {/* Page content */}
        <Stack>
          {data.length === 0 ? (
            <>
              <NoContent message="Kviz ne postoji!" />
            </>
          ) : (
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
                  <form onSubmit={handleSubmit} id={"player-update-form"}>
                    <Stack>
                      <FormControl>
                        <FormLabel>Uredi naziv kviza</FormLabel>
                        <Input
                          id="quizName"
                          key="quizName"
                          value={values.quizName || ""}
                          name="quizName"
                          onChange={handleChangeAuto}
                          onBlur={handleBlur}
                          placeholder="Unesite naziv novog kviza"
                        />
                        {errors.quizName && (
                          <HStack
                            color={"red.500"}
                            mt={2}
                            direction={["column", "row"]}
                          >
                            <Icon as={BsExclamationCircleFill} boxSize={5} />
                            <Text fontWeight={"medium"} fontSize={"sm"}>
                              Obavezno polje
                            </Text>
                          </HStack>
                        )}
                      </FormControl>
                      <FormControl py="5">
                        <FormLabel>
                          Dodajte pitanje iz arhive ili kreirajte novo pitanje
                        </FormLabel>
                        <Stack justify={"end"} direction={["column", "row"]}>
                          <QuestionsFromDB
                            quizData={{
                              questions: data.questions,
                              id: data.id,
                            }}
                          />
                          <NewQuestion fromQuiz={data.id} />
                        </Stack>
                      </FormControl>
                      {data && data.questions && (
                        <>
                          {" "}
                          <TableContainer
                            borderTop="1px"
                            borderColor={"gray.200"}
                          >
                            <HStack
                              textAlign={"left"}
                              py={5}
                              justifyContent="space-between"
                            >
                              <Text fontSize="lg" fontWeight="bold">
                                Pitanja u kvizu:
                              </Text>
                              <Button
                                onClick={() => setAnswersOn(!answersOn)}
                                size={"sm"}
                                colorScheme={answersOn ? "red" : "green"}
                                rightIcon={
                                  answersOn ? (
                                    <BsLightbulbOffFill />
                                  ) : (
                                    <BsLightbulbFill />
                                  )
                                }
                              >
                                {answersOn
                                  ? "Sakrij odgovore"
                                  : "Prikazi odgovore"}
                              </Button>
                            </HStack>
                            <Table size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Sadrzaj pitanja</Th>
                                  <Th textAlign="end">Obrisi</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {data.questions.map((question: Question) => {
                                  return (
                                    <Tr key={question.id}>
                                      <Td>
                                        <Tooltip
                                          label={
                                            question.question.length > 100
                                              ? question.question
                                              : ""
                                          }
                                        >
                                          <Box>
                                            {question.question.length > 100 ? (
                                              <>
                                                {question.question.slice(
                                                  0,
                                                  100
                                                ) + "..."}
                                              </>
                                            ) : (
                                              <>
                                                <Box>
                                                  <Text>
                                                    {question.question}
                                                  </Text>
                                                  {answersOn && (
                                                    <Text color="green">
                                                      {question.answer}
                                                    </Text>
                                                  )}
                                                </Box>
                                              </>
                                            )}
                                          </Box>
                                        </Tooltip>
                                      </Td>
                                      <Td>
                                        <HStack justify="end">
                                          <IconButton
                                            aria-label={
                                              "Obrisi pitanje iz kviza"
                                            }
                                            icon={<BsTrash />}
                                            colorScheme="red"
                                            variant={"outline"}
                                            onClick={() => {
                                              disconnectQuestion({
                                                quizId: data.id,
                                                questionId: question.id,
                                              });
                                            }}
                                          />
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
                    </Stack>
                  </form>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
        <HStack justifyContent="space-between" mt={"4"}>
          <QuizLink quizData={data} />
          <Button variant={"outline"} colorScheme={"red"}>
            Obriši Kviz
          </Button>
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
