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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface userAnswer {
  resultId: number;
  questionId: number;
  answer: string;
}

type Props = {};

export default function QuizFinalWords({}: Props) {
  const [quizIsDone, setQuizIsDone] = React.useState(false);

  const { data, isLoading, error } = useQuery(["userAnswers"], () =>
    axios.get("/api/useranswer").then((res) => res.data)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <Flex>
        <Stack spacing={"6"} height={"auto"} pb="2" w="100%">
          {/* Put all page content inside this flex */}
          <Stack w="100%">
            {quizIsDone ? (
              <>party is done, back to coding</>
            ) : (
              <>
                {" "}
                <VStack justify="center" align="center" w="100%">
                  <Box textAlign="center">
                    <Text fontSize="3xl">Kviz je završen</Text>
                    <Text fontSize="3xl">Hvala na ucescu</Text>
                    <OrderedList
                      p={"4"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      borderRadius={"lg"}
                    >
                      {data.map((item: any) => (
                        <ListItem
                          key={item.questionId}
                          py={"1"}
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
                    </OrderedList>
                    <VStack mt={"4"} justifyContent={"center"}>
                      <Button
                        bg="green.400"
                        onClick={() => console.log("end quiz")}
                      >
                        ZAVRSI KVIZ
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
