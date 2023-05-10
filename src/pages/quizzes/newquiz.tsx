import Head from "next/head";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import quizServices from "../../../services/quizzesServices";
import { useRouter } from "next/router";
import PageBox from "../../../components/common/PageBox";

import { BsExclamationCircleFill } from "react-icons/bs";
import * as yup from "yup";
import { useFormik } from "formik";
import { getSession } from "next-auth/react";

type Props = {};

export default function NewQuiz({}: Props) {
  const router = useRouter();

  const [onCreateSpinner, setOnCreateSpinner] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const toast = useToast();

  const validationSchema = yup.object().shape({
    quizName: yup.string().required("Required"),
  });

  const { handleSubmit, values, handleChange, errors, handleBlur } = useFormik({
    initialValues: {
      quizName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      if (values.quizName) {
        let newQuiz = {
          name: values.quizName,
        };
        setOnCreateSpinner(true);
        try {
          const createdQuiz = await quizServices.create(newQuiz);
          queryClient.invalidateQueries(["quizzes"]);
          setOnCreateSpinner(false);
          toast({
            title: "Novi kviz je napravljen,sada obavezno dodajte pitanja.",
            status: "success",
          });
          router.push(`/quizzes/${createdQuiz.id}`);
        } catch (error) {
          toast({
            title: `Greška prilikom kreiranja kviza, pokušajte ponovno.`,
            status: "error",
          });
          setOnCreateSpinner(false);
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>Novi Kviz</title>
        <meta name="description" content="pub quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/enterwell.png" />
      </Head>
      <PageBox>
        {/* Page header */}
        <HStack justify={"space-between"} mb="10">
          {/*  Page title */}
          <Heading fontWeight={"normal"}>Kreirajte novi kviz: </Heading>
          {/* Add multi button if needed */}
        </HStack>
        {/* Page content */}
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
            overflow={"hidden"}
          >
            <form onSubmit={handleSubmit} id={"player-update-form"}>
              <Stack>
                <FormControl>
                  <FormLabel>Naziv novog kviza:</FormLabel>
                  <Input
                    id="quizName"
                    key="quizName"
                    value={values.quizName}
                    name="quizName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Unesite naziv novog kviza"
                  />
                  {errors.quizName && (
                    <HStack color={"red.500"} mt={2}>
                      <Icon as={BsExclamationCircleFill} boxSize={5} />
                      <Text fontWeight={"medium"} fontSize={"sm"}>
                        Obavezno polje
                      </Text>
                    </HStack>
                  )}
                </FormControl>
                <HStack justify={"flex-end"} pt={6}>
                  {" "}
                  <Button
                    type={"submit"}
                    form={"player-update-form"}
                    colorScheme={"green"}
                    isLoading={onCreateSpinner}
                  >
                    Kreirajte novi kviz
                  </Button>
                </HStack>
              </Stack>
            </form>
          </Stack>
        </Stack>
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
