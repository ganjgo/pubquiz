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
  useClipboard,
  Flex,
} from "@chakra-ui/react";
import { BsExclamationCircleFill, BsPlus } from "react-icons/bs";

import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/router";
import Link from "next/link";
import resultServices from "../services/resultsServices";

type Props = {
  quizData: any;
};

export default function QuizLink({ quizData }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [onCreateSpinner, setOnCreateSpinner] = React.useState<boolean>(false);
  const [playerQuizData, setPlayerQuizData] = React.useState("");

  const validationSchema = yup.object().shape({
    playerName: yup.string().required("Required"),
  });

  const { mutate } = useMutation(resultServices.create, {
    onSuccess: (data) => {
      toast({
        title: "Novi kviz za igraca je kreiairan.",
        status: "success",
      });
      console.log("dataabout new result", data);
      setPlayerQuizData(`http://localhost:3000/${data.id}`);
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
      playerName: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (values.playerName) {
        console.log("values", values);
        let newResultData = {
          playerName: values.playerName,
          quizId: quizData.id,
          quizName: quizData.name,
        };
        mutate(newResultData);
        setOnCreateSpinner(true);
        values.playerName = "";
      }
    },
  });

  return (
    <>
      <Button
        variant={"outline"}
        colorScheme={"blue"}
        rightIcon={<BsPlus />}
        onClick={onOpen}
      >
        Posalji kviz igracu
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Posalji kviz specificnom igracu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {playerQuizData ? (
              <>
                <Stack spacing={3}>
                  <FormControl>
                    <FormLabel>Link za igraca</FormLabel>
                    <Flex mb={2}>
                      <Input
                        placeholder={playerQuizData}
                        value={playerQuizData}
                        isReadOnly
                        mr={2}
                      />
                      <Button onClick={onCopy}>
                        {hasCopied ? "Copied!" : "Copy"}
                      </Button>
                    </Flex>
                  </FormControl>
                </Stack>
              </>
            ) : (
              <>
                {" "}
                <form id="player-form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <FormControl>
                      <FormLabel>
                        Unesite za koga je kviz: ovo je naziv igraca koji vidi
                        samo admin
                      </FormLabel>
                      <Input
                        id="playerName"
                        value={values.playerName}
                        type="text"
                        name="playerName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Unesite ime igraca"
                      />
                      {errors.playerName && (
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
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {playerQuizData ? (
              <>
                <Link href={playerQuizData}>
                  <Button isLoading={onCreateSpinner} colorScheme={"green"}>
                    Pogledaj kviz za igraca
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {" "}
                <Button
                  isLoading={onCreateSpinner}
                  colorScheme={"blue"}
                  type="submit"
                  form={"player-form"}
                >
                  Kreiraj kviz za igraca
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
