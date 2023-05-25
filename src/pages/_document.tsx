import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";

import { colors } from "@/styles/Style";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript
          initialColorMode={colors.initialColorMode as "dark"}
          storageKey="chakra-ui-color-mode"
          type="localStorage"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
