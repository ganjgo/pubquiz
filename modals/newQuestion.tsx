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
} from "@chakra-ui/react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import * as yup from "yup";
import { useFormik } from "formik";
import { BsExclamationCircleFill, BsPlus } from "react-icons/bs";
import questionServices from "../services/questionsServices";
import quizServices from "../services/quizzesServices";

type Props = {
  fromQuiz?: number;
};

const validationSchema = yup.object().shape({
  question: yup.string().required("Required"),
  answer: yup.string().required("Required"),
});

export default function NewQuestion({ fromQuiz }: Props) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [onCreateSpinner, setOnCreateSpinner] = React.useState<boolean>(false);

  const { mutate: connectQuestion } = useMutation(
    quizServices.connectQuestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quizzes"]);
        toast({
          title: "Pitanje je dodato u kviz.",
          status: "success",
        });
      },
      onError: () => {
        toast({
          title: "Pitanje nije dodato u kviz.",
          status: "error",
        });
      },
    }
  );

  const { mutate, isLoading } = useMutation(questionServices.create, {
    onSuccess: (data) => {
      console.log("dataID", data.data.id);
      queryClient.invalidateQueries(["questions"]);
      setOnCreateSpinner(false);
      toast({
        title: "Pitanje je dodato.",
        status: "success",
      });
      if (fromQuiz) {
        connectQuestion({ quizId: fromQuiz, questionId: data.data.id });
      }
    },
    onError: (error) => {
      setOnCreateSpinner(false);
      toast({
        title: `Pitanje nije dodato.${error}`,
        status: "error",
      });
    },
  });

  const {
    handleSubmit,
    values,
    handleChange,
    isValid,
    errors,
    handleBlur,
    touched,
  } = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (values.question && values.answer) {
        setOnCreateSpinner(true);
        console.log("values", values);
        let questionData = {
          question: values.question,
          answer: values.answer,
        };
        mutate(questionData);
        values.question = "";
        values.answer = "";
        onClose();
      }
    },
  });

  return (
    <>
      <Button colorScheme={"blue"} rightIcon={<BsPlus />} onClick={onOpen}>
        Novo pitanje
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo pitanje</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="question-form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel>Pitanje:</FormLabel>
                  <Input
                    id="question"
                    value={values.question}
                    type="text"
                    name="question"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Unesite sadrzaj pitanja"
                  />
                  {touched.question && errors.question && (
                    <HStack color={"red.500"} mt={2}>
                      <Icon as={BsExclamationCircleFill} boxSize={5} />
                      <Text fontWeight={"medium"} fontSize={"sm"}>
                        Obavezno polje
                      </Text>
                    </HStack>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Odgovor</FormLabel>
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
                      <Icon as={BsExclamationCircleFill} boxSize={5} />
                      <Text fontWeight={"medium"} fontSize={"sm"}>
                        Obavezno polje
                      </Text>
                    </HStack>
                  )}
                </FormControl>
              </Stack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={onCreateSpinner}
              colorScheme={"blue"}
              type="submit"
              form={"question-form"}
            >
              {fromQuiz ? (
                <>Dodaj pitanje u kviz i u arhivu</>
              ) : (
                <>Dodaj pitanje</>
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
