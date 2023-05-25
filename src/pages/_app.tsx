import SideBar from "@/components/SideBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ChakraProvider, Flex } from "@chakra-ui/react";
import { appTheme } from "@/styles/Style";
import DarkTheme from "@/components/design/DarkTheme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={appTheme}>
        <DarkTheme />
        <Flex display={"flex"} height={"100%"} width={"100%"}>
          <SideBar />
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </>
  );
}
