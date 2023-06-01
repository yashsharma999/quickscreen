import { Box, Text, Flex, Badge, Stack, Checkbox } from "@chakra-ui/react";

const QuestionBox = ({
  question,
  badges,
  checked,
  addQuestion,
  filterQuestions,
  data,
  required,
}) => {
  return (
    <Box
      padding={"8px 1rem"}
      border={"1px solid #E2E8F0"}
      borderRadius="7px"
      mb={4}
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
      }
    >
      <Flex gap={4} justifyContent="space-between">
        <Box>
          <Text>{question}</Text>
          <Stack direction="row" my={4}>
            {badges?.map((badge, i) => (
              <Badge
                key={i}
                padding={"4px 8px"}
                variant="subtle"
                colorScheme="green"
              >
                {badge}
              </Badge>
            ))}
          </Stack>
        </Box>
        <Flex align={"flex-start"} justify="center">
          <Checkbox
            mr={-1}
            size={"lg"}
            disabled={required}
            isChecked={checked ? true : false}
            onChange={(e) => {
              if (checked) {
                filterQuestions(data.id);
              } else {
                addQuestion(data);
              }
            }}
          ></Checkbox>
        </Flex>
      </Flex>
    </Box>
  );
};

export default QuestionBox;
