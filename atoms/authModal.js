import { atom } from "recoil";

const authModalState = atom({
  key: "authModalState",
  default: false,
});

export { authModalState };
