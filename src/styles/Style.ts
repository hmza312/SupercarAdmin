import { extendTheme } from "@chakra-ui/react";

export const colors = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  colorMode: "dark",
};

export const appTheme: Record<string, any> = extendTheme({ colors });
