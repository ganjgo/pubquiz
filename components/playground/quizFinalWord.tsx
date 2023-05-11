import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  ListItem,
  Stack,
  Text,
  VStack,
  List,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import resultServices from "../../services/resultsServices";
import { useRouter } from "next/router";

interface userAnswer {
  resultId: number;
  questionId: number;
  answer: string;
}

type Props = {
  arrayUserAnswers: userAnswer[];
  username: string;
  resultId: any;
  quizId: number;
};

export default function QuizFinalWords({
  arrayUserAnswers,
  quizId,
  resultId,
  username,
}: Props) {
  const router = useRouter();

  const [onCreateSpinner, setOnCreateSpinner] = React.useState<boolean>(false);

  const [quizFinished, setQuizFinished] = React.useState(false);

  const toast = useToast();

  const { mutate } = useMutation(resultServices.updateUserAnswers, {
    onSuccess: (data) => {
      toast({
        title: "Uspješno ste odgovorili kviz!",
        status: "success",
      });
      toast({
        title: "Hvala na učešću!",
        status: "success",
        duration: 9000,
      });
      setOnCreateSpinner(false);
      setQuizFinished(true);
    },
    onError: (error) => {
      toast({
        title: "Došlo je do greške.",
        description: "Molimo Vas kontaktirajte admina ili pokušajte ponovno.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setOnCreateSpinner(false);
    },
  });


  return (
    <>
      {quizFinished ? (
        <>
          <Flex>
            <Stack spacing={"6"} height={"auto"} pb="2" w="100%">
              <Stack w="100%">
                <>
                  {" "}
                  <VStack justify="center" align="center" w="100%">
                    <Box textAlign="center">
                      <Text py="4" fontSize="3xl">
                        Hvala na učešću!
                      </Text>
                    </Box>
                  </VStack>
                </>
              </Stack>
            </Stack>
          </Flex>
        </>
      ) : (
        <>
          <Flex>
            <Stack spacing={"6"} height={"auto"} pb="2" w="100%">
              <Stack w="100%">
                <>
                  {" "}
                  <VStack justify="center" align="center" w="100%">
                    <Box textAlign="center">
                      <Text py="4" fontSize="3xl">
                        Potvrdite vase odgovore
                      </Text>
                      <List
                        p={"4"}
                        border={"1px solid"}
                        borderColor={"gray.200"}
                        borderRadius={"lg"}
                      >
                        {arrayUserAnswers.map((item: any) => (
                          <ListItem
                            key={item.questionId}
                            py={"1"}
                            pl={"2"}
                            textAlign={"left"}
                          >
                            <Box fontSize={"lg"}>
                              <Badge bg="red.200">{item.question}</Badge>
                            </Box>
                            <Box fontSize={"md"}>
                              <Badge bg="green.200">{item.answer}</Badge>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                      <VStack mt={"4"} justifyContent={"center"}>
                        <Button
                          bg="green.400"
                          onClick={() => {
                            mutate({
                              id: quizId,
                              resultId: resultId,
                              username: username,
                              userAnswers: arrayUserAnswers,
                            });
                          }}
                          isLoading={onCreateSpinner}
                        >
                          POŠALJI ODGOVORE
                        </Button>
                        <Button bg="red.400" onClick={() => router.reload()}>
                          RESETUJ KVIZ
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </>
              </Stack>
            </Stack>
          </Flex>
        </>
      )}
    </>
  );
}
