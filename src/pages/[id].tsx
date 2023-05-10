import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  BsArrowLeft,
  BsArrowRight,
  BsExclamationCircleFill,
} from "react-icons/bs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import PlayerForm from "../../components/playground/playerForm";
import QuizFinalWords from "../../components/playground/quizFinalWord";
import resultServices from "../../services/resultsServices";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorPage from "../../components/common/ErrorPage";

type Props = {};

const notActiveUser = false;

function Playground({}: Props) {
  const router = useRouter();
  const { id } = router.query;
  const ArrayOfThisQuiz: { id?: any; question: any; answer: any }[] = [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ShowAnswer, setShowAnswer] = useState(false);
  const [finalWord, setFinalWord] = useState<boolean>(false);
  const [initialWord, setInitialWord] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");

  const nextSlide = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const previousSlide = () => {
    setCurrentIndex(currentIndex === 0 ? currentIndex : currentIndex - 1);
  };

  React.useEffect(() => {
    console.log("user namex", userName);
  }, [userName]);

  const validationSchema = yup.object().shape({
    answer: yup.string().required("Required"),
  });

  const [arrayUserAnswers, setArrayUserAnswers] = useState<any[]>([]);

  function handleFinishQuiz() {
    console.log("user name", userName);
    console.log("iz handle finish quiz", arrayUserAnswers);
    // handleSubmit();
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
        console.log("form values", formValues);
        let userAnswer = {
          questionId: ArrayOfThisQuiz[currentIndex].id,
          question: ArrayOfThisQuiz[currentIndex].question,
          answer: formValues.answer,
          resultId: id,
        };
        console.log("user answer", userAnswer);
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

  const { isLoading, data, isError } = useQuery<any>(
    ["results", id],
    async () => {
      const response = await axios.get(`/api/results?id=${id}`);
      return response.data;
    },
    {
      refetchOnMount: false,
    }
  );

  if (data && data.quiz.questions.length > 0) {
    data.quiz.questions.forEach((question: any) => {
      let questionObject = {
        id: question.id,
        question: question.question,
        answer: question.answer,
      };
      ArrayOfThisQuiz.push(questionObject);
    });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // console.log(data.quiz.id);

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
      //   bg="yellow.100"
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
              />
            </>
          ) : finalWord ? (
            <>
              <QuizFinalWords
                arrayUserAnswers={arrayUserAnswers}
                username={userName}
                quizId={data.quiz.id}
                resultId={22}
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
