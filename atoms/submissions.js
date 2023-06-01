import { atom } from "recoil";

const submissionsState = atom({
  key: "submissions", // unique ID (with respect to other atoms/selectors)
  default: {},
});

export { submissionsState };
