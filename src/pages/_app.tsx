import SideBar from "@/components/SideBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ChakraProvider, Flex } from "@chakra-ui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Flex display={"flex"} height={"100%"} width={"100%"}>
          <SideBar />
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </>
  );
}
