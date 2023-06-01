/* eslint-disable react/no-children-prop */
import {
  Box,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import data from "../mock/questions.json";

const FinalForm = ({ list }) => {
  const findInputType = (question) => {
    const questionObject = data["github_specific"].find(
      (q) => q.question_label === question
    );
    return questionObject?.input_type;
  };

  return (
    <form style={{ padding: "1rem 0" }}>
      <Heading variant={"h6"} mb={4}>
        Form
      </Heading>
      {list?.map((question, i) => (
        <div key={i}>
          <Box mb={6}>
            <Text fontWeight={"bold"}>{question?.question_label}</Text>
            <Box my={4}>
              <InputType type={question?.input_type} />
            </Box>
          </Box>
          <Divider width={"90%"} m={"1rem auto"} />
        </div>
      ))}
    </form>
  );
};

export default FinalForm;

const InputType = ({ type }) => {
  switch (type) {
    case "text":
      return (
        <InputGroup>
          <Input type={type} />
          <InputRightElement children={<LinkIcon />} />
        </InputGroup>
      );
    case "file":
      return (
        <InputGroup>
          <Input p={1} type={type} />
        </InputGroup>
      );
    default:
      return (
        <InputGroup>
          <Input type={type} />
        </InputGroup>
      );
  }
};
