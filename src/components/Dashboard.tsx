import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Stack,
  Input,
  Box,
  GridItem,
  Grid,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
  Badge,
  Button,
} from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <>
      <Flex width={"100%"} flexDir={"column"} gap={"1rem"} height={"100%"}>
        {/* Top Header */}
        <DashboardHeader />
        <DashBoardContent />
      </Flex>
    </>
  );
}

const DashboardHeader = () => {
  return (
    <>
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
  );
};

import { IoIosPeople } from "react-icons/io";
import { AiFillCar } from "react-icons/ai";

const DashBoardContent = () => {
  return (
    <Grid
      templateColumns="repeat(7, 1f)"
      templateRows="repeat(7, 1fr)"
      gap="0.6rem"
      height="100%"
      overflow="auto"
    >
      <GridItem
        gridColumn="1 / span 2"
        gridRow="1 / span 1"
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex
          width={"100%"}
          height={"100%"}
          gap={"1.5rem"}
          alignItems={"center"}
          p={"2rem"}
        >
          <Box
            background={"var(--orange-color)"}
            justifyContent={"center"}
            alignItems={"center"}
            p={"0.3rem"}
            rounded={"md"}
          >
            <IoIosPeople style={{ fontSize: "2rem" }} />
          </Box>

          <Box flexDir={"column"}>
            <Text>Total Customers</Text>
            <Flex justifyContent={"space-between"}>
              <Heading fontSize={"2xl"}>20</Heading>
              <Badge
                display={"block"}
                alignSelf={"center"}
                justifySelf={"flex-end"}
                colorScheme="green"
              >
                +12.9%
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </GridItem>

      <GridItem
        gridColumn="3 / span 2"
        gridRow="1 / span 1"
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex
          width={"100%"}
          height={"100%"}
          gap={"1.5rem"}
          alignItems={"center"}
          p={"2rem"}
        >
          <Box
            background={"var(--orange-color)"}
            justifyContent={"center"}
            alignItems={"center"}
            p={"0.3rem"}
            rounded={"md"}
          >
            <AiFillCar style={{ fontSize: "2rem" }} />
          </Box>

          <Box flexDir={"column"}>
            <Text>Total Vehicles</Text>
            <Flex justifyContent={"space-between"}>
              <Heading fontSize={"2xl"}>512</Heading>
              <Badge
                display={"block"}
                alignSelf={"center"}
                justifySelf={"flex-end"}
                colorScheme="red"
              >
                +12.9%
              </Badge>
            </Flex>
          </Box>
        </Flex>
      </GridItem>

      <GridItem
        gridColumn="1 / span 4"
        gridRow="2 / span 3" /* Update: Changed from "gridRow="2 / span 1"" */
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex width={"100%"} height={"100%"} p={"0.1rem"}>
          <ChartSection />
        </Flex>
      </GridItem>

      <GridItem
        gridColumn="1 / span 4"
        gridRow="5 / span 6" /* Update: Changed from "gridRow="3 / span 3"" */
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex p={"0.5rem"}>
          <Flex>
            <Heading fontSize={"2xl"}>Recent Payments</Heading>
          </Flex>
        </Flex>
      </GridItem>

      <GridItem
        gridColumn="5 / 7"
        gridRow="1 / span 5"
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex
          flexDir={"column"}
          width={"100%"}
          height={"100%"}
          gap={"1rem"}
          p={"1rem"}
        >
          <Heading fontSize={"2xl"}>Waitlist</Heading>

          <Box flexDir={"column"}>
            <Text>Pending Users</Text>
            <Text>10</Text>
          </Box>

          <Box background={"blue"} overflowY={"scroll"}>
            content
          </Box>

          <Button
            color={"black"}
            background={"var(--white-color)"}
            _hover={{ background: "var(--white-color)" }}
          >
            See Full User Waitlist
          </Button>
        </Flex>
      </GridItem>

      <GridItem
        gridColumn="5 / 7"
        gridRow="6 / span 7"
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Flex p={"1rem"}>
          <Heading fontSize={"2xl"}>Activity</Heading>
        </Flex>
      </GridItem>
    </Grid>
  );
};

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useState } from "react";

const ChartSection = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "apexchart-example",
        height: "100%",
        width: "100%",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  });

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width={"100%"}
        height={"100%"}
      />
    </>
  );
};
