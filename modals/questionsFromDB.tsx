import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Button,
  Input,
  Stack,
  HStack,
  Textarea,
  Checkbox,
  Text,
  Icon,
  useToast,
  VStack,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Badge,
  Center,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { BsArrowDownCircle, BsPlus, BsTrash } from "react-icons/bs";

import * as yup from "yup";
import { useSession } from "next-auth/react";
// import QuestionLine from "../components/question/questionLine";
import { useQuery } from "@tanstack/react-query";
import questionServices from "../services/questionsServices";

type Props = {
  quizQuestions: any[];
};

export default function QuestionsFromDB({ quizQuestions }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAnswer, setShowAnswer] = React.useState(false);
  const toast = useToast();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      return await questionServices.fetchAll();
    },
  });

  console.log(data);

  return (
    <>
      <Button colorScheme={"blue"} rightIcon={<BsPlus />} onClick={onOpen}>
        Dodajte pitanje iz arhive
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Arhiva pitanja</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH={"calc(100vh - 250px)"} overflowY={"auto"}>
            {data && data.length > 0 ? (
              <>
                {" "}
                <Stack>
                  <VStack align={"stretch"}>
                    {data.map((item: any) => (
                      <HStack
                        justify={"space-between"}
                        py="2"
                        borderBottom="1px"
                        borderColor="gray.200"
                        key={item.id}
                      >
                        <Popover isLazy placement="bottom-start">
                          <PopoverTrigger>
                            <Button rightIcon={<BsArrowDownCircle />}>
                              {item.question && item.question.length > 50
                                ? item.question.slice(0, 30) + "..."
                                : item.question}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverHeader fontWeight="semibold">
                              Kompletno pitanje:
                            </PopoverHeader>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                              {showAnswer ? (
                                <>{item.answer}</>
                              ) : (
                                <>{item.question}</>
                              )}
                            </PopoverBody>
                            <PopoverFooter>
                              <HStack justify={"end"}>
                                {showAnswer ? (
                                  <>
                                    <Button
                                      onClick={() => setShowAnswer(false)}
                                      colorScheme="blue"
                                    >
                                      Prikazi pitanje
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      onClick={() => setShowAnswer(true)}
                                      colorScheme="blue"
                                    >
                                      Prikazi odgovor
                                    </Button>
                                  </>
                                )}
                              </HStack>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                        {quizQuestions &&
                        quizQuestions.some(
                          (question: any) => question.id === item.id
                        ) ? (
                          <IconButton
                            aria-label="Add to quiz"
                            icon={<BsTrash />}
                            colorScheme="red"
                          />
                        ) : (
                          <IconButton
                            aria-label="Add to quiz"
                            icon={<BsPlus />}
                            colorScheme="green"
                          />
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Stack>
              </>
            ) : (
              <>
                {" "}
                <Center h={"30vh"}>
                  <Stack>
                    <Box>Arhiva je prazna, molimo dodajte pitanja u arhivu</Box>
                  </Stack>
                </Center>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Badge>
              Ukupno pitanja u kvizu :{" "}
              {quizQuestions && quizQuestions.length > 0
                ? quizQuestions.length
                : "1"}
            </Badge>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
