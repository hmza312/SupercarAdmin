import {
  Flex,
  Heading,
  Stack,
  Text,
  Input,
  Box,
  GridItem,
  Grid,
} from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <>
      <Flex p={"1.5rem"} width={"100%"} flexDir={"column"} gap={"1rem"}>
        <Flex width={"100%"} flexDir={"row"} alignItems={"center"}>
          <Stack spacing={"0.3rem"}>
            <Heading fontSize={"2xl"}>Welcome Back, Ethan 👋</Heading>
            <Text color={"rgba(166, 166, 166, 1)"}>
              Here’s an overview of your automation dashboard
            </Text>
          </Stack>

          <Flex
            marginLeft={"auto"}
            alignItems={"center"}
            alignSelf={"flex-end"}
          >
            <Input placeholder="search anything" size={"lg"} />
          </Flex>
        </Flex>

        <Grid
          h="100%"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem
            rowSpan={2}
            colSpan={1}
            background={"var(--grey-color)"}
            rounded={"xl"}
          />
          <GridItem
            colSpan={2}
            background={"var(--grey-color)"}
            rounded={"xl"}
          />
          <GridItem
            colSpan={2}
            background={"var(--grey-color)"}
            rounded={"xl"}
          />
          <GridItem
            colSpan={4}
            background={"var(--grey-color)"}
            rounded={"xl"}
          />
        </Grid>
      </Flex>
    </>
  );
}
