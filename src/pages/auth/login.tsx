import React from "react";
import { signIn } from "next-auth/react";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsBoxFill, BsExclamationCircleFill } from "react-icons/bs";

import * as yup from "yup";
import { useFormik } from "formik";

export default function Login({}: any) {
  const toast = useToast();
  const router = useRouter();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
  });

  const { handleSubmit, values, handleChange, errors, handleBlur, touched } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: validationSchema,
      onSubmit: async () => {
        if (values.username && values.password) {
          let loginData = {
            username: values.username,
            password: values.password,
          };
          const login = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
          });
          if (login && login.status === 200) {
            toast({
              title: "Uspješno ste se prijavili.",
              status: "success",
            });
            router.push("/");
          } else if (login && login.status === 401) {
            toast({
              title: "Neuspješna prijava. Pogrešno korisničko ime ili lozinka.",
              description: "Pokušajte ponovo.",
              status: "error",
            });
          }
        }
      },
    });

  return (
    <Center h={"100vh"}>
      <Stack
        width={"400px"}
        spacing={6}
        margin={{
          base: 6,
        }}
      >
        <HStack mb={6}>
          <HStack align="center" spacing={"4"}>
            <IconButton aria-label="logo" icon={<BsBoxFill />} size={"lg"} />
            <HStack>
              <Text fontSize="2xl" ml="2" color="black" fontWeight="bold">
                EnterWell Quiz
              </Text>
              <Text
                bg={"gray.800"}
                color={"gray.100"}
                py={0.5}
                px={2}
                fontSize={"xs"}
              >
                BETA
              </Text>
            </HStack>
          </HStack>
        </HStack>
        <form id="login-form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Korisničko ime:</FormLabel>
              <Input
                id="username"
                value={values.username}
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Unesite korisničko ime"
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
            <FormControl>
              <FormLabel>Lozinka</FormLabel>
              <Input
                id="password"
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Lozinka"
                type="password"
              />
              {touched.password && errors.password && (
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
        <Button type="submit" form="login-form" colorScheme={"blue"}>
          Prijavi se
        </Button>
      </Stack>
    </Center>
  );
}
