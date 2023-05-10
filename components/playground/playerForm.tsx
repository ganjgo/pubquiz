import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsArrowRight, BsExclamationCircleFill } from "react-icons/bs";
import resultServices from "../../services/resultsServices";

type Props = {
  setInitialWord: any;
  resultId: any;
  setUserName: any;
};

export default function PlayerForm({
  setInitialWord,
  resultId,
  setUserName,
}: Props) {
  const validationSchema = yup.object().shape({
    username: yup.string().required("Required"),
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
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      if (values.username) {
        setInitialWord(false);
        console.log("username", values.username);
        let resultUpdate = {
          username: values.username,
          resultId: resultId,
        };
        // try {
        //   const response = resultServices.updateUsername(resultUpdate);
        //   console.log("response", response);
        // } catch (error) {
        //   console.log("error", error);
        // }
        setUserName(values.username);
      }
    },
  });

  return (
    <>
      <Flex>
        <Stack spacing={"6"} height={"auto"} pb="2" w="100%">
          {/* Put all page content inside this flex */}
          <Stack w="100%">
            <VStack justify="center" align="center" w="100%">
              <Box textAlign="center">
                <Text my="5" fontSize="3xl">
                  Dobro dosli u Enterwell kviz!
                </Text>

                <form id="username-form" onSubmit={handleSubmit}>
                  <FormControl py="3">
                    <FormLabel fontSize="xl" htmlFor="username">
                      Molimo Vas da unesete nickname:
                    </FormLabel>
                    <Input
                      id="username"
                      value={values.username}
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Unesite vas nickname"
                      size={"lg"}
                    />
                    {touched.username && errors.username && (
                      <HStack color={"red.500"} mt={2}>
                        <Icon as={BsExclamationCircleFill} boxSize={5} />
                        <Text fontWeight={"medium"} fontSize={"sm"}>
                          Obavezno polje
                        </Text>
                      </HStack>
                    )}
                  </FormControl>
                </form>
              </Box>
              <Button
                colorScheme="green"
                p={6}
                fontSize="xl"
                type="submit"
                form="username-form"
                size={"lg"}
                rightIcon={<Icon as={BsArrowRight} boxSize={5} />}
              >
                Dalje
              </Button>
            </VStack>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
