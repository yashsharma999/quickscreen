import { submissionsState } from "@/atoms/submissions";
import DashboardLayout from "@/components/template/DashboardLayout";
import { app, firestore } from "@/firebase/init";
import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { useRecoilValue } from "recoil";
import * as data from "@/mock/questions.json";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";

const linkItems = ["gist", "commit", "resume"];

export default function Details() {
  const submissions = useRecoilValue(submissionsState);
  const router = useRouter();
  const { empvet_id = "", email = "" } = router.query;

  const ref = empvet_id + "_" + email;

  const getNameForId = (id) => {
    return (
      data.github_specific.find((item) => item.id === id)?.name ?? "No name"
    );
  };

  const [value, loading, error] = useDocument(
    doc(getFirestore(app), "submissions", ref)
  );

  if (loading) return <div>Loading...</div>;

  if (error) {
    console.log(error);
    return <div>Error!</div>;
  }

  if (
    value?.data()?.answers &&
    Object.keys(value?.data()?.answers).length > 0
  ) {
    return (
      <DashboardLayout>
        <div>
          {Object.entries(value.data()?.answers ?? {}).map(
            ([key, value], i) => {
              const body = typeof value === "string" ? value : value.url;

              return (
                <div key={i}>
                  <DetailCard
                    header={getNameForId(key)}
                    body={body}
                    link={linkItems.includes(getNameForId(key)) ? true : false}
                    email={getNameForId(key) === "email" ? true : false}
                  />
                </div>
              );
            }
          )}
        </div>
      </DashboardLayout>
    );
  }
}

const DetailCard = ({ header, body, footer, link, email }) => {
  let bodyText;

  if (link) {
    bodyText = (
      <Link href={body} isExternal>
        {body}
      </Link>
    );
  } else if (email) {
    bodyText = (
      <Link href={`mailto:${body}`} isExternal>
        {body}
      </Link>
    );
  } else {
    bodyText = <Text>{body}</Text>;
  }

  return (
    // <Flex alignItems={"start"} gap="1rem">
    //   <Text as={"b"} fontSize="xl">
    //     {header}
    //   </Text>
    //   <Text>{bodyText}</Text>
    // </Flex>
    <Grid templateColumns={"30% 70%"} mb={"1rem"} rowGap={"2rem"}>
      <GridItem>
        <Text as={"b"} fontSize="xl">
          {header}
        </Text>
      </GridItem>
      <GridItem>
        <Text>{bodyText}</Text>
      </GridItem>
    </Grid>
  );
};
