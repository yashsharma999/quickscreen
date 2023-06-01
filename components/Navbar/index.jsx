import { authModalState } from "@/atoms/authModal";
import { useRouter } from "next/router";
import { app, auth } from "@/firebase/init";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Container,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import AuthModal from "../AuthModal/AuthModal";

const Navbar = () => {
  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [currentUser, currentUserLoading, currentUserError] =
    useAuthState(auth);
  const [signOut, signOutLoading, signOutError] = useSignOut(auth);

  const [modal, setModal] = useRecoilState(authModalState);

  const toggleModalState = () => {
    setModal(!modal);
  };

  const handleMenuOpen = () => {
    alert("Menu Opened");
  };

  return (
    <>
      <AuthModal isOpen={modal} onClose={() => setModal(false)} />
      <Box width="100vw" p="6px 12px" backgroundColor={"aliceblue"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Flex gap={"1rem"} alignItems={"center"}>
            <Text
              marginRight={"2rem"}
              fontFamily={"mono"}
              fontWeight={"700"}
              fontSize={"20px"}
            >
              EV
            </Text>
            {currentUser && (
              <>
                <Link href={`/dashboard/questions`}>Questions</Link>
                <Link href={`/submissions/${currentUser?.uid}`}>
                  Submissions
                </Link>
              </>
            )}
          </Flex>
          <Flex justifyContent={"flex-end"} gap={"1rem"}>
            {currentUser ? (
              <Menu>
                <MenuButton as={Button} variant={"outline"}>
                  <Flex align={"center"} onClick={handleMenuOpen}>
                    <Avatar src={currentUser.photoURL} size={"sm"}></Avatar>
                    <Box ml="2">
                      <Text fontSize={"10pt"} fontWeight={"bold"}>
                        {currentUser.displayName}
                      </Text>
                      <Text fontSize={"8pt"} fontWeight={"light"}>
                        {currentUser.email}
                      </Text>
                    </Box>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem
                    onClick={() => {
                      signOut();
                      router.push("/");
                    }}
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button onClick={toggleModalState}>Log In</Button>
            )}
          </Flex>
        </Flex>
      </Box>
      {error && <p>Error: {error.code ?? "Something went wrong"}</p>}
    </>
  );
};

export default Navbar;
