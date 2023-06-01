import "@/styles/globals.css";
import "@fontsource/poppins";
import "@fontsource/inter";
import "@fontsource/montserrat";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import theme from "@/chakraui/theme";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  );
}
