import SideBar from "@/components/SideBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { ChakraProvider, Flex, useMediaQuery } from "@chakra-ui/react";
import { appTheme } from "@/styles/Style";
import DarkTheme from "@/components/design/DarkTheme";

export default function App({ Component, pageProps }: AppProps) {
  const [isUnder1100] = useMediaQuery("(max-width: 1100px)");

  console.log(isUnder1100);

  return (
    <>
      <ChakraProvider theme={appTheme}>
        <DarkTheme />
        <Flex
          display={"flex"}
          height={"100%"}
          width={"100%"}
          flexDir={isUnder1100 ? "column" : "row"}
        >
          <SideBar useMobStyle={isUnder1100} />
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </>
  );
}
