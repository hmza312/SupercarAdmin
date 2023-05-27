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
  Center,
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
          <InputGroup size="md" colorScheme="gray">
            <Input pr="0.5rem" width={"md"} placeholder="Search anything" background={'var(--grey-color)'} />
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

import StatSection from "./dashboard/StatSection";
import Analytics from "./dashboard/Analytics";
import { useEffect, useState } from "react";
import { membersColRef, paymentsColRef, vehiclesColRef } from "@/lib/firebase";
import { getCountFromServer, getDocs } from "firebase/firestore";
import RecentPayments from "./dashboard/RecentPayments";
import { PaymentDocType } from "@/lib/firebase_docstype";
import Activity from "./dashboard/Activity";


const DashBoardContent = () => {

  const [totalCustomers, setTotalCustomers] = useState<number> (0);
  const [totalVehicles, setTotalVehicles] = useState<number> (0);
  const [payments, setPayments] = useState<Array<PaymentDocType>>([])
  
  

  useEffect (()=> {
    const fetchCustomersCount = async () => {
      const count = await getCountFromServer(membersColRef)
      setTotalCustomers (count.data().count);
    };
    
    const fetchVehiclesCount = async ()=> {
      const count = await getCountFromServer(vehiclesColRef)
      setTotalVehicles (count.data().count);
    };

    const fetchRecentPayments = async ()=> {
      const paymentDocs = await getDocs(paymentsColRef)
      const res = paymentDocs.docs.map (d=> d.data()) as Array<PaymentDocType>
      setPayments(res);
      
    };

    
    fetchCustomersCount()
    fetchVehiclesCount()
    fetchRecentPayments()

     
  }, [])


  return (
    <Grid
      templateColumns="repeat(7, 1f)"
      templateRows="repeat(7, 1fr)"
      gap="0.6rem"
      height="100%"
      minHeight={'40rem'}
      overflowY="auto"
    >
        <GridItem
          gridColumn="1 / span 2"
          gridRow="1 / span 1"
          bg="var(--grey-color)"
          rounded={"xl"}
        >
          <StatSection
            title="Total Customers"
            badgeStatus="green"
            count={totalCustomers}
            percentage="+12.9%"
          >
            <IoIosPeople style={{ fontSize: "2rem" }} />
          </StatSection>
        </GridItem>

        <GridItem
          gridColumn="3 / span 2"
          gridRow="1 / span 1"
          bg="var(--grey-color)"
          rounded={"xl"}
        >
          <StatSection
            title="Total Vehicles"
            badgeStatus="red"
            count={totalVehicles}
            percentage="+12.9%"
          >
            <AiFillCar style={{ fontSize: "2rem" }} />
          </StatSection>
        </GridItem>

      <GridItem
        gridColumn="1 / span 4"
        gridRow="2 / span 3" /* Update: Changed from "gridRow="2 / span 1"" */
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <Analytics />
      </GridItem>

      <GridItem
        gridColumn="1 / span 4"
        gridRow="5 / span 6" /* Update: Changed from "gridRow="3 / span 3"" */
        bg="var(--grey-color)"
        rounded={"xl"}
      >
        <RecentPayments payments={payments}/>
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

          <Flex overflowY={"scroll"} flex={1} flexDir={'column'} gap = {'0.5rem'}>
            <WaitListPayment />
            <WaitListPayment />
            <WaitListPayment />
            <WaitListPayment />
          </Flex>

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
        <Activity />
      </GridItem>
    </Grid>
  );
};


const WaitListPayment = ()=> {
  return <>
    <Flex 
      background={'var(--card-bg)'} rounded={'md'} p = {'1rem'} flexDir={'column'} gap = {'0.5rem'}
    >
      <Flex width={'100%'}>
        <Heading fontSize={'lg'}>Bruce Thomas</Heading>
        <Text fontSize={'sm'} marginLeft={'auto'}>{`${new Date().toDateString()}`}</Text>
      </Flex>
      <Box justifySelf={'flex-start'}>
        <Button background={'white'} color={'black'} size={'sm'}>View Application</Button>
      </Box>
    </Flex>
  </>
}
