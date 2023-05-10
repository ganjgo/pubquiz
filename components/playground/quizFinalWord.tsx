import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  ListItem,
  OrderedList,
  Stack,
  Text,
  VStack,
  List,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import resultServices from "../../services/resultsServices";

interface userAnswer {
  resultId: number;
  questionId: number;
  answer: string;
}

type Props = {
  arrayUserAnswers: userAnswer[];
  username: string;
  resultId: number;
  quizId: number;
};

export default function QuizFinalWords({
  arrayUserAnswers,
  quizId,
  resultId,
  username,
}: Props) {
  const [quizIsDone, setQuizIsDone] = React.useState(false);
  const [onCreateSpinner, setOnCreateSpinner] = React.useState<boolean>(false);

  const toast = useToast();

  const { mutate } = useMutation(resultServices.updateUserAnswers, {
    onSuccess: (data) => {
      toast({
        title: "Novi kviz za igraca je kreiairan.",
        status: "success",
      });
      console.log("dataabout new result", data);
      setOnCreateSpinner(false);
    },
    onError: (error) => {
      toast({
        title: "Doslo je do greske.",
        description: "Molimo Vas pokusajte ponovo.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setOnCreateSpinner(false);
    },
  });

  console.log(quizId,'quizId') 
  console.log(resultId,'resultId')

  return (
    <>
      <Flex>
        <Stack spacing={"6"} height={"auto"} pb="2" w="100%">
          <Stack w="100%">
            {quizIsDone ? (
              <>
                <VStack justify="center" align="center" w="100%">
                  <Box textAlign="center">
                    <Text fontSize="3xl">Kviz je završen</Text>
                    <Text fontSize="3xl">Hvala na ucescu</Text>
                  </Box>
                </VStack>
              </>
            ) : (
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
                            username: username,
                            userAnswers: arrayUserAnswers,
                          });
                        }}
                        isLoading={onCreateSpinner}

                      >
                        ZAVRSI KVIZ
                      </Button>
                      <Button
                        bg="red.400"
                        onClick={() => console.log("reset quiz")}
                      >
                        RESETUJ KVIZ
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </>
            )}
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
