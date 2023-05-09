import {
  Box,
  Flex,
  Text,
  useDisclosure,
  Icon,
  IconButton,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Divider,
  Avatar,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { BsList, BsPower, BsActivity, BsListCheck } from "react-icons/bs";
import { MdOutlineQuiz } from "react-icons/md";
import Image from "next/image";

type Props = {
  children?: ReactNode;
};

type TNavItem = {
  icon: IconType;
  children: string;
  link: string;
};

export default function Layout({ children }: Props) {
  const sidebar = useDisclosure();
  const router = useRouter();
  // const session = useSession();

  const UserButton = () => {
    return (
      <HStack
        onClick={() => {
          router.push("/profile");
        }}
        py={3}
        px={6}
        spacing={4}
        _hover={{
          backgroundColor: "gray.200",
          cursor: "pointer",
          borderRadius: ".5rem",
        }}
        justify={"space-between"}
      >
        <HStack spacing={4}>
          <Avatar size={"md"} />
          <Stack spacing={0}>
            <Text fontSize={"md"} fontWeight={"bold"}>
              ovdje unijeti ime logovanog korisnika
            </Text>
          </Stack>
        </HStack>
        <Tooltip label={"Odjavi se"}>
          <IconButton
            colorScheme={"red"}
            variant={"outline"}
            aria-label="signout"
            icon={<BsPower />}
            onClick={() => {
              signOut();
              router.push("/auth/login");
            }}
          />
        </Tooltip>
      </HStack>
    );
  };

  const NavItem = (props: TNavItem) => {
    const { icon, children, link, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        mx="2"
        rounded="md"
        py="3"
        cursor="pointer"
        color="gray.700"
        _hover={{
          bg: "gray.200",
          color: "gray.700",
        }}
        onClick={() => {
          sidebar.onClose();
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        fontSize={"lg"}
        as={Link}
        href={link}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            boxSize="5"
            _groupHover={{
              color: "gray.700",
            }}
            color={"gray.500"}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props: any) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      height={"100vh"}
      overflowX="hidden"
      overflowY="auto"
      w="80"
      p={3}
      {...props}
    >
      <Flex flexDir={"column"} h={"100%"} justifyContent={"space-between"}>
        <Flex flexDir={"column"}>
          <HStack px="4" py="8" align="center" spacing={"4"}>
            <Link href="/">
              <Image
                src={"/enterwell.png"}
                height={50}
                width={50}
                alt={"logo"}
              />
            </Link>
            <Stack>
              <Text fontSize="2xl" ml="2" color="black" fontWeight="bold">
                <Link href="/">Pub Quiz</Link>
              </Text>
            </Stack>
          </HStack>
          <Flex
            direction="column"
            as="nav"
            fontSize="sm"
            color="gray.600"
            aria-label="Main Navigation"
          >
            <NavItem icon={MdOutlineQuiz} link={"/quizzes"}>
              Kvizovi
            </NavItem>
            <NavItem icon={BsActivity} link={"/results"}>
              Rezultati
            </NavItem>
            <NavItem icon={BsListCheck} link={"/questions"}>
              Pitanja
            </NavItem>
          </Flex>
        </Flex>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Setting nav"
          pb={6}
        >
          <Divider my={3} />
          <UserButton />
        </Flex>
      </Flex>
    </Box>
  );

  const notActiveUser = false;

  if (notActiveUser) {
    return (
      <>
        {" "}
        <Box as="section" h={"full"}>
          <Box transition=".3s ease">
            <HStack
              as="header"
              align="center"
              w="full"
              px="4"
              bg="white"
              h="14"
              display={"flex"}
              justifyContent={"left"}
            >
              <Flex alignItems={"center"}>
                <Image
                  src={"/enterwell.png"}
                  height={40}
                  width={40}
                  alt={"logos"}
                />
                <Text fontWeight={"bold"} fontSize={"lg"} ml={3}>
                  EnterWell Pub Quiz
                </Text>
              </Flex>
            </HStack>
          </Box>
          <Box transition=".3s ease" h={"full"}>
            <Box as="main">{children}</Box>
          </Box>
        </Box>
      </>
    );
  }

  if (router.pathname === "/not-active") {
    return <>{children}</>;
  }

  return (
    <Box as="section" h={"full"}>
      <SidebarContent
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <HStack
          as="header"
          align="center"
          w="full"
          px="4"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          borderBottomWidth="1px"
          borderColor="blackAlpha.300"
          h="14"
          display={{
            base: "flex",
            md: "none",
          }}
          justifyContent={"space-between"}
        >
          <Flex alignItems={"center"}>
            <Image src={"/enterwell.png"} height={40} width={40} alt={"logo"} />
            <Text fontWeight={"bold"} fontSize={"lg"} ml={3}>
              Pub Quiz
            </Text>
          </Flex>
          <IconButton
            aria-label="Menu"
            display={{
              base: "inline-flex",
              md: "none",
            }}
            variant={"ghost"}
            onClick={sidebar.onOpen}
            icon={<BsList />}
            size="md"
          />
        </HStack>
      </Box>
      <Box
        ml={{
          base: 0,
          md: 80,
        }}
        transition=".3s ease"
        h={"full"}
      >
        <Box as="main">{children}</Box>
      </Box>
    </Box>
  );
}
