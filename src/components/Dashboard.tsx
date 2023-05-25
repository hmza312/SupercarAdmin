import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Stack,
  Text,
  Input,
  Box,
  GridItem,
  Grid,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <>
      <Flex p={"1.5rem"} width={"100%"} flexDir={"column"} gap={"1rem"} height={'100%'}>
        {/* Top Header */}
        <DashboardHeader />
        <DashBoardContent />
      </Flex>
    </>
  );
}

const DashboardHeader = ()=> {
  return <>
    <Flex width={"100%"} flexDir={"row"} alignItems={"center"}>
          <Stack spacing={"0.3rem"}>
            <Heading fontSize={"2xl"}>Welcome Back, Ethan 👋</Heading>
            <Text color={"rgba(166, 166, 166, 1)"}>
              Here’s an overview of your automation dashboard
            </Text>
          </Stack>

          <Flex
            height={"100%"}
            marginLeft={"auto"}
            alignItems={"center"}
            alignSelf={"flex-end"}
            marginBottom={"-0.1rem"}
          >
            <InputGroup size="md">
              <Input pr="0.5rem" width={"md"} placeholder="Search anything" />
              <InputRightElement width="2.5rem">
                <SearchIcon />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
  </>
};

const DashBoardContent = () => {
  return <>
    {/* <Flex height={'100%'} bg = {'yellow'} overflow={'auto'}> */}
    <div className="dashboard-container">
  <div className="section section1">Section 1</div>
  <div className="section section2">Section 2</div>
  <div className="section section3">Section 3</div>
  <div className="section section4">Section 4</div>
  <div className="section section5">Section 5</div>
  <div className="section section6">Section 6</div>
</div>


    {/* </Flex> */}
  </>
}