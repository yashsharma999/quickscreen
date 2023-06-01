import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayout from "@/components/template/DashboardLayout";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import QuestionBox from "@/components/QuestionBox";
import data from "@/mock/questions.json";
import { useRecoilState } from "recoil";
import { formState as formStateAtom } from "@/atoms/form";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/init";
import { useRouter } from "next/router";
import { authModalState } from "@/atoms/authModal";
import AuthModal from "@/components/AuthModal/AuthModal";
import { useEffect, useRef, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { IoEarth } from "react-icons/io5";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useRecoilState(formStateAtom);
  const [signOut, loading, error] = useSignOut(auth);
  const [user, currentUserLoading, currentUserError] = useAuthState(auth);
  const [modal, setModal] = useRecoilState(authModalState);

  const toggleModalState = () => {
    setModal(!modal);
  };

  if (currentUserLoading) {
    return <p>Loading...</p>;
  }

  if (currentUserError) {
    console.log(currentUserError);
    return <p>Error!</p>;
  }

  if (user) {
    router.push("/dashboard/questions");
  }

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const filterQuestions = (question) => {
    setQuestions(questions.filter((q) => q !== question));
  };
  return (
    <>
      <Head>
        <title>Empvet</title>
        <meta name="description" content="Employee vetting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        height={"100vh"}
        backgroundImage={`linear-gradient( to bottom, rgb(79 137 244 / 20%), #fff ),url(/pattern.svg)`}
      >
        <AuthModal isOpen={modal} onClose={() => setModal(false)} />
        <Container maxWidth={"1080px"} height={"100%"}>
          <Flex></Flex>
          <Flex
            background={"white"}
            py={4}
            px={4}
            mt={12}
            borderRadius={"28px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
          >
            <Flex>
              <Text fontSize={"24px"} fontWeight={"bold"}>
                Quick
                <span
                  style={{
                    color: "#155DEE",
                  }}
                >
                  SCREEN
                </span>
              </Text>
            </Flex>
            <Flex>{/* <TaglineBanner /> */}</Flex>
            <Flex>
              <Button onClick={toggleModalState} variant={"outline"}>
                Sign In
              </Button>
            </Flex>
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"center"} mt={10}>
            <Box>
              <Text fontWeight={900} fontSize={"3.5rem"}>
                Quickly screen your candidates with our solution.
              </Text>
              <Text fontSize={"1.5rem"} color="gray.500">
                Streamline Your Hiring Process with Our Robust Screening
                Services
              </Text>
            </Box>
            {/* <Image height={600} width={500} src={"/team.svg"} alt="HR"></Image> */}
          </Flex>
        </Container>
        <Flex alignItems={"center"} justifyContent={"center"}>
          Made with <Icon as={AiFillHeart} color={"red.500"} mx={2} /> on{" "}
          <Icon as={IoEarth} color={"green.600"} mx={2} />
        </Flex>
      </Box>
      {/* <DashboardLayout>
        <div>
          <Button onClick={() => signOut()}>Log Out</Button>
          <Text>Landing Page</Text>
        </div>
      </DashboardLayout> */}
    </>
  );
}

const TaglineBanner = () => {
  const taglineArr = [
    "Find the potential fit, quickly!",
    "Streamline your hiring with our screening solution.",
  ];
  const [tagline, setTagline] = useState("");
  let i = 0;

  useEffect(() => {
    const int = setInterval(() => {
      setTagline(taglineArr[i]);
      if (i === taglineArr.length - 1) i = 0;
      else i++;
    }, [2500]);

    return () => clearInterval(int);
  }, []);

  return (
    <Text
      fontSize={"1.5rem"}
      fontWeight={"bold"}
      color={"#155DEE"}
      fontFamily={"Poppins"}
    >{`${tagline}`}</Text>
  );
};
