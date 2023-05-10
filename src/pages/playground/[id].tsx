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
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  BsArrowLeft,
  BsArrowRight,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import PlayerForm from "../../../components/playground/playerForm";
import QuizFinalWords from "../../../components/playground/quizFinalWord";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorPage from "../../../components/common/ErrorPage";
import quizServices from "../../../services/quizzesServices";

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

  const toast = useToast();

  const nextSlide = () => {
    if (currentIndex !== ArrayOfThisQuiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousSlide = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
    queryKey: ["quizzes"],
    queryFn: async () => {
      return await quizServices.fetchOne(Number(id));
    },
    enabled: id !== undefined,
  });

  if (data && data.questions && data.questions.length > 0) {
    data.questions.forEach((question: any) => {
      let questionObject = {
        id: question.id,
        question: question.question,
        answer: question.answer,
      };
      ArrayOfThisQuiz.push(questionObject);
    });
  }

  React.useEffect(() => {
    toast({
      title: "Ovo je testna verzija kviza, nije moguće editovati.",
      position: "bottom-right",
      isClosable: true,
      duration: 10000,
      description:
        "Ukoliko želite da editujete kviz, možete to uraditi na stranici kvizova.",
    });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
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

  console.log(data);

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
                isTest
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
                        <FormControl>
                          <FormLabel>Odgovor pitanja</FormLabel>
                          <Textarea
                            id="answer"
                            value={ArrayOfThisQuiz[currentIndex].answer}
                            name="answer"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Odogovor na pitanje"
                            isDisabled
                          />
                          {touched.answer && errors.answer && (
                            <HStack color={"red.500"} mt={2}>
                              <Icon as={BsExclamationCircleFill} boxSize={5} />
                              <Text fontWeight={"medium"} fontSize={"sm"}>
                                {errors.answer}
                              </Text>
                            </HStack>
                          )}
                        </FormControl>
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
                    type="button"
                    variant={"solid"}
                    colorScheme={"blue"}
                    leftIcon={<BsArrowLeft />}
                    onClick={previousSlide}
                    isDisabled={currentIndex === 0}
                  >
                    Prethodno pitanje
                  </Button>
                  <Button
                    type="button"
                    variant={"solid"}
                    colorScheme={"green"}
                    rightIcon={<BsArrowRight />}
                    onClick={nextSlide}
                    isDisabled={currentIndex === ArrayOfThisQuiz.length - 1}
                  >
                    Sljedeće pitanje
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
