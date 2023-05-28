import { extendTheme } from "@chakra-ui/react";

export const colors = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  colorMode: "dark",
  gray: {
    "400": "var(--white)",
  },
};

export const appTheme: Record<string, any> = extendTheme({ colors });
