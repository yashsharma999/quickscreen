import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import DashboardLayout from "@/components/template/DashboardLayout";
import { Box, Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import QuestionBox from "@/components/QuestionBox";
import data from "@/mock/questions.json";
import { useRecoilState } from "recoil";
import { formState as formStateAtom } from "@/atoms/form";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/init";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { MdPreview, MdRocketLaunch } from "react-icons/md";

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useRecoilState(formStateAtom);
  const [signOut, loading, error] = useSignOut(auth);
  const [user, currentUserLoading, currentUserError] = useAuthState(auth);

  //check if firestore has questions for this user
  //if yes, load them into the formStateAtom
  useEffect(() => {
    if (!user) return;
    const getQuestions = async () => {
      const docRef = doc(firestore, "empvet_forms", user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuestions(docSnap.data().questions);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getQuestions();
  }, [user]);

  if (currentUserLoading) {
    return <p>Loading...</p>;
  }

  if (currentUserError) {
    console.log(currentUserError);
    return <p>Error!</p>;
  }

  if (!user) {
    router.push("/");
  }

  const addQuestion = (data) => {
    setQuestions([...questions, data]);
  };

  const filterQuestions = (id) => {
    setQuestions(questions.filter((item) => item.id !== id));
  };

  const handlePublish = async () => {
    await setDoc(doc(firestore, "empvet_forms", user.uid), {
      questions: questions,
    });
  };

  return (
    <>
      <Head>
        <title>Empvet</title>
        <meta name="description" content="Employee vetting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        <Box mb={"10"}>
          <Flex justifyContent={"space-between"} alignItems="center">
            <Box>
              <Heading as="h2" size="2xl" my="4">
                Question Pack
              </Heading>
              <Text size="xl">
                Please choose the questions you want to add to the form.
              </Text>
            </Box>
            <Flex gap={"1rem"}>
              <Link href={"/preview"}>
                <Button rightIcon={<Icon as={MdPreview} />}>Preview</Button>
              </Link>
              <Button
                rightIcon={<Icon as={MdRocketLaunch} />}
                onClick={handlePublish}
              >
                Publish
              </Button>
            </Flex>
          </Flex>
        </Box>
        {data["github_specific"]?.map((question, i) => (
          <Box key={i}>
            <QuestionBox
              uniqueId={i}
              data={question}
              question={question.question_label}
              badges={question.labels}
              addQuestion={addQuestion}
              filterQuestions={filterQuestions}
              checked={questions.find((item) => item.id === question.id)}
              required={question.required}
            />
          </Box>
        ))}
      </DashboardLayout>
    </>
  );
}
