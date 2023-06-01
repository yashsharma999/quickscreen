import { Container } from "@chakra-ui/react";
import Navbar from "../Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container maxWidth={"1080px"}>{children}</Container>
    </>
  );
};

export default DashboardLayout;
