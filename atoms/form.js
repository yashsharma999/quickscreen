import { atom } from "recoil";

const formState = atom({
  key: "formState", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      id: "5",
      question_label: "Please enter your Email address",
      input_type: "email",
      labels: ["email"],
      required: true,
    },
  ],
});

export { formState };
