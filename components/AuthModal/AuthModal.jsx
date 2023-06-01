import { auth } from "@/firebase/init";
import { useRouter } from "next/router";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { authModalState } from "@/atoms/authModal";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function AuthModal({ isOpen, onClose }) {
  const [authType, setAuthType] = useState("login");
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{authType === "login" ? "Log In" : "Sign Up"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AuthForm setAuthType={setAuthType} type={authType} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const AuthForm = ({ type, setAuthType }) => {
  const setModal = useSetRecoilState(authModalState);
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [
    createUserWithEmailAndPassword,
    signedUpUser,
    signedUpLoading,
    signedUpError,
  ] = useCreateUserWithEmailAndPassword(auth);

  if (user || signedUpUser || googleUser) {
    router.push("/dashboard/questions");
    setModal(false);
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (type === "login") {
      login();
    } else {
      signup();
    }
  };

  const login = () => {
    signInWithEmailAndPassword(form.email, form.password);
  };
  const signup = () => {
    createUserWithEmailAndPassword(form.email, form.password);
  };

  return (
    <form onSubmit={onSubmit}>
      <Box py={4} display={"flex"} flexDirection={"column"} gap={"1rem"}>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={show ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />
            <InputRightElement>
              <IconButton
                onClick={() => setShow(!show)}
                h="1.75rem"
                size="sm"
                aria-label="View"
                icon={show ? <ViewOffIcon /> : <ViewIcon />}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button isLoading={loading || signedUpLoading} type="submit">
          {type === "login" ? "Login" : "Signup"}
        </Button>
        <Text color={"tomato"}>
          {error && (error.code ?? "Something went wrong")}
          {signedUpError && (signedUpError.code ?? "Something went wrong")}
        </Text>
      </Box>
      {type === "login" ? (
        <Text textAlign={"right"}>
          New User ?{" "}
          <Button
            onClick={() => setAuthType("signup")}
            variant={"outline"}
            color="blue.500"
          >
            Sign Up
          </Button>
        </Text>
      ) : (
        <Flex flexDirection={"row-reverse"}>
          <Button
            onClick={() => setAuthType("login")}
            variant={"outline"}
            color="blue.500"
          >
            Back To Log In
          </Button>
        </Flex>
      )}

      <Box my={2} display={"flex"} alignItems="center">
        <Divider />
        <Text mx={6}>OR</Text>
        <Divider />
      </Box>
      <Flex justifyContent={"center"} my={6}>
        <Button onClick={() => signInWithGoogle()} width={"100%"}>
          <Image src="googlelogo.png" height="20px" mr={4} alt="google" />
          Continue with Google
        </Button>
      </Flex>
    </form>
  );
};
