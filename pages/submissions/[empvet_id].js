import DashboardLayout from "@/components/template/DashboardLayout";
import { collection, doc, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/init";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { submissionsState } from "@/atoms/submissions";
import * as dayjs from "dayjs";
import { ViewIcon } from "@chakra-ui/icons";

export async function getServerSideProps(context) {
  const { empvet_id } = context.params;

  return {
    props: {
      empvet_id,
    }, // will be passed to the page component as props
  };
}

export default function Submissions({ empvet_id }) {
  const router = useRouter();
  const setSubmissionData = useSetRecoilState(submissionsState);
  const [value, loading, error] = useCollection(
    query(
      collection(firestore, "submissions"),
      where("empvet_id", "==", empvet_id)
    )
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  if (value?.docs.length === 0) {
    return <p>No submissions yet!</p>;
  }

  // if (value){
  //   setSubmissionData
  // }

  return (
    <DashboardLayout>
      <div>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                {/* <Th>Submission Id</Th> */}
                <Th>Email</Th>
                <Th>Submission Date</Th>
                <Th>View Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {value?.docs.map((doc, i) => (
                <Tr key={doc.id}>
                  <Th>{doc.data().answers["5"] ?? ""}</Th>
                  <Th>
                    {doc.data().submission_date !== undefined
                      ? dayjs(doc.data().submission_date?.toDate()).format(
                          "DD-MMMM-YYYY HH:mm:ss A"
                        )
                      : ""}
                  </Th>
                  <Th>
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: `${empvet_id}/${doc.data().answers["5"]}`,
                        });
                        setSubmissionData(doc.data());
                      }}
                      icon={<ViewIcon />}
                    />
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </DashboardLayout>
  );
}
