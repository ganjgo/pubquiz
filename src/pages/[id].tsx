import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { BsArrowRight, BsExclamationCircleFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import PlayerForm from "../../components/playground/playerForm";
import QuizFinalWords from "../../components/playground/quizFinalWord";
import resultServices from "../../services/resultsServices";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorPage from "../../components/common/ErrorPage";
import { getSession } from "next-auth/react";

type Props = {};

const notActiveUser = false;

function Playground({}: Props) {
  const router = useRouter();
  const { id } = router.query;
  const ArrayOfThisQuiz: { id?: any; question: any; answer: any }[] = [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [ShowAnswer, setShowAnswer] = React.useState(false);
  const [finalWord, setFinalWord] = React.useState<boolean>(false);
  const [initialWord, setInitialWord] = React.useState<boolean>(true);
  const [userName, setUserName] = React.useState<string>("");
  const [arrayUserAnswers, setArrayUserAnswers] = React.useState<any[]>([]);

  const nextSlide = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const validationSchema = yup.object().shape({
    answer: yup.string().required("Required"),
  });

  function handleFinishQuiz() {
    setFinalWord(true);
  }

  const {
    handleSubmit,
    values,
    handleChange,
    isValid,
    errors,
    handleBlur,
    setValues,
    touched,
  } = useFormik({
    initialValues: {
      answer: "",
    },
    validationSchema: validationSchema,
    onSubmit: (formValues) => {
      if (formValues.answer) {
        let userAnswer = {
          questionId: ArrayOfThisQuiz[currentIndex].id,
          question: ArrayOfThisQuiz[currentIndex].question,
          answer: formValues.answer,
          resultId: id,
        };
        setArrayUserAnswers((prevArray) => [...prevArray, userAnswer]);
        setValues({ answer: "" });
        if (currentIndex !== ArrayOfThisQuiz.length - 1) {
          nextSlide();
        } else {
          handleFinishQuiz();
        }
      }
    },
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      return await resultServices.fetchOne(Number(id));
    },
    enabled: id !== undefined,
  });

  if (
    data &&
    data.quiz !== null &&
    data.quiz.questions &&
    data.quiz.questions.length > 0
  ) {
    data.quiz.questions.forEach((question: any) => {
      let questionObject = {
        id: question.id,
        question: question.question,
        answer: question.answer,
      };
      ArrayOfThisQuiz.push(questionObject);
    });
  }

  if (data && data.quiz === null) {
    return <ErrorPage message="Ne postoji playground za ovaj kviz." />;
  }

  if (data === null) {
    return <ErrorPage message="Ovaj kviz ne postoji." />;
  }

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

  if (data && data.userAnswers && data.userAnswers.length > 0)
    return (
      <>
        <ErrorPage message="Ovaj kviz je završen. Hvala na interesovanju!" />
      </>
    );

  console.log("data", data);

  return (
    <Box
      pr={{
        base: 0,
        md: 10,
      }}
      pt={{
        base: 4,
        md: "10",
      }}
      pb="10"
      h={"100vh"}
    >
      <Container h={"100%"} maxW={"container.lg"}>
        <Flex
          w="100%"
          h="100%"
          flexDirection={"column"}
          justifyContent={"center"}
        >
          {initialWord ? (
            <>
              <PlayerForm
                setInitialWord={setInitialWord}
                resultId={id}
                setUserName={setUserName}
                isTest={false}
              />
            </>
          ) : finalWord ? (
            <>
              <QuizFinalWords
                arrayUserAnswers={arrayUserAnswers}
                username={userName}
                quizId={data.quiz.id}
                resultId={id}
              />
            </>
          ) : (
            <>
              <Stack spacing={"6"} height={"auto"} pb="2">
                {/* Put all page content inside this flex */}
                <Stack
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  borderRadius={"lg"}
                  p="6"
                  h={"full"}
                  width={"full"}
                  spacing={6}
                >
                  <form id={`form-${currentIndex}`} onSubmit={handleSubmit}>
                    <>
                      <Stack>
                        <HStack
                          bg="gray.200"
                          p="4"
                          borderRadius="lg"
                          fontSize="2xl"
                        >
                          <Box fontSize="2xl">{currentIndex + 1}.</Box>
                          <Text>{ArrayOfThisQuiz[currentIndex].question}</Text>
                        </HStack>
                        {ShowAnswer && notActiveUser ? (
                          <>
                            {" "}
                            <FormControl>
                              <FormLabel>Odgovor pitanja</FormLabel>
                              <Box
                                bg="green.200"
                                p="4"
                                borderRadius="lg"
                                fontSize="xl"
                              >
                                <Text>
                                  {ArrayOfThisQuiz[currentIndex].answer}
                                </Text>
                              </Box>
                            </FormControl>
                          </>
                        ) : (
                          <>
                            {" "}
                            <FormControl>
                              <FormLabel>Odgovor pitanja</FormLabel>
                              <Textarea
                                id="answer"
                                value={values.answer}
                                name="answer"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Odogovor na pitanje"
                              />
                              {touched.answer && errors.answer && (
                                <HStack color={"red.500"} mt={2}>
                                  <Icon
                                    as={BsExclamationCircleFill}
                                    boxSize={5}
                                  />
                                  <Text fontWeight={"medium"} fontSize={"sm"}>
                                    {errors.answer}
                                  </Text>
                                </HStack>
                              )}
                            </FormControl>
                          </>
                        )}
                      </Stack>
                    </>
                  </form>
                </Stack>
              </Stack>
              <HStack
                justify={"end"}
                mt={"4"}
                justifyContent={notActiveUser ? "space-between" : "end"}
              >
                {notActiveUser ? (
                  <>
                    <Button
                      variant={"outline"}
                      colorScheme={ShowAnswer ? "red" : "blue"}
                      onClick={() => setShowAnswer(!ShowAnswer)}
                      isDisabled={!notActiveUser}
                    >
                      {ShowAnswer ? "Sakrij odgovor" : "Prikaži odgovor"}
                    </Button>
                  </>
                ) : null}
                <HStack>
                  <Button
                    type="submit"
                    form={`form-${currentIndex}`}
                    variant={"solid"}
                    colorScheme={
                      currentIndex === ArrayOfThisQuiz.length - 1
                        ? "green"
                        : "blue"
                    }
                    rightIcon={<BsArrowRight />}
                  >
                    {currentIndex === ArrayOfThisQuiz.length - 1
                      ? "Završi"
                      : "Sljedeće pitanje"}
                  </Button>
                </HStack>
              </HStack>
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

export default Playground;

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
