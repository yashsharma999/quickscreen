/* eslint-disable react/no-children-prop */
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useUploadFile, useDownloadURL } from "react-firebase-hooks/storage";
import { app, firestore, storage } from "@/firebase/init";
import { ref } from "firebase/storage";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Form, Formik, useFormik } from "formik";

export async function getServerSideProps(context) {
  const { empvet_id } = context.params;
  return {
    props: {
      empvet_id,
    }, // will be passed to the page component as props
  };
}

export default function Empvet({ empvet_id }) {
  const [value, loading, error] = useDocument(
    doc(getFirestore(app), "empvet_forms", empvet_id)
  );
  const [answers, setAnswers] = useState({});

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      console.log(values);
      const uniqueDocId = empvet_id + "_" + values["5"];
      await setDoc(doc(firestore, "submissions", uniqueDocId), {
        answers: values,
        empvet_id: empvet_id,
        submission_date: Timestamp.now(),
      });
    },
  });

  const questions = value?.data()?.questions;
  // useEffect(() => {}, [questions]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  //console.log(value.data().github_specific);

  return (
    <Container maxWidth={"500px"} mt={12}>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Overview</Tab>
          <Tab>Application</Tab>
        </TabList>
        {/* <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
  </TabPanels> */}
        <TabPanels>
          <TabPanel>Test</TabPanel>
          <TabPanel>
            <form onSubmit={formik.handleSubmit}>
              {value?.data()?.questions?.map((question, i) => (
                <div key={i}>
                  <Box mb={6}>
                    <Text fontWeight={"bold"}>{question.question_label}</Text>
                    <Box my={4}>
                      <InputType
                        answers={answers}
                        setAnswers={setAnswers}
                        question={question}
                        type={question.input_type}
                        empvet_id={empvet_id}
                        formik={formik}
                      />
                    </Box>
                  </Box>
                  <Divider width={"90%"} m={"1rem auto"} />
                </div>
              )) ?? <div>Not found</div>}
              <Flex justifyContent={"center"}>
                <Button type="submit" width={"200px"}>
                  Submit
                </Button>
              </Flex>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

const InputType = ({
  type,
  value,
  onChange,
  answers,
  setAnswers,
  question,
  empvet_id,
  formik,
}) => {
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const [url, loading, urlError] = useDownloadURL(
    ref(storage, `resume/${empvet_id}`)
  );

  const handleFileUpload = async (selectedFile) => {
    const resumeRef = ref(storage, "resume");
    // 5 is id for email
    const fileRef = ref(resumeRef, `${empvet_id}_${formik.values["5"]}`);
    await uploadFile(fileRef, selectedFile, {
      contentType: selectedFile.type,
    });

    if (url) {
      formik.setFieldValue(question.id, {
        url,
        name: selectedFile.name,
      });
    } else if (loading) {
      console.log("loading");
    } else if (urlError) {
      console.log(urlError);
    }
  };

  switch (type) {
    case "text":
      return (
        <InputGroup>
          <Input
            name={question.id}
            value={formik.values[question.id] ?? ""}
            onChange={formik.handleChange}
          />
          <InputRightElement children={<LinkIcon />} />
        </InputGroup>
      );
    case "file":
      return (
        <InputGroup>
          <Input
            p={1}
            type="file"
            onChange={(ev) => {
              handleFileUpload(ev.target.files[0] ?? undefined);
            }}
          />
          <InputRightElement children={uploading && <Spinner />} />
        </InputGroup>
      );
    default:
      return (
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
          <InputGroup>
            <Input
              type={type}
              name={question.id}
              value={formik.values[question.id] ?? ""}
              onChange={formik.handleChange}
            />
          </InputGroup>
        </FormControl>
      );
  }
};
