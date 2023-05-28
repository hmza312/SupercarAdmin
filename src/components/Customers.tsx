import {
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  Avatar,
  Center,
  Divider,
} from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import WhiteButton from "./design/WhiteButton";
import { useEffect, useState } from "react";
import { getCountFromServer, getDocs } from "firebase/firestore";
import { membersColRef } from "@/lib/firebase";
import { MemberDocType } from "@/lib/firebase_docstype";

export default function Customers() {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [customers, setCustomers] = useState<Array<MemberDocType>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<MemberDocType | null> (null);

  
  useEffect(() => {
    const getCustomerCount = async () => {
      const count = await getCountFromServer(membersColRef);
      setCustomerCount(count.data().count);
    };

    const fetchCustomers = async () => {
      const customersDocs = await getDocs(membersColRef);
      setCustomers(
        customersDocs.docs.map((d) => d.data()) as Array<MemberDocType>
      );
    };

    getCustomerCount();
    fetchCustomers();
  }, []);

  return (
    <Flex width="100%" flexDir="column" gap="1rem" height="100%">
      <ContentHeader
        description=""
        heading={`Total Customers (${customerCount})`}
      />
      <Flex gap="0.3rem">
        <CustomersList customers={customers} />
        <Flex
          flex={1}
          bg="var(--grey-color)"
          rounded="lg"
          height={"auto"}
          justifyContent={"center"}
          padding={"1rem"}
        >
          <Flex
            py={"2rem"}
            flexDir={"column"}
            alignContent={"center"}
            gap={"1rem"}
          >
            <Center>
              <Avatar
                size="xl"
                name="Kent Dodds"
                src="https://bit.ly/kent-c-dodds"
              />
            </Center>
            <Center flexDir={"column"}>
              <Heading fontSize={"xl"}>Kent C Dodds</Heading>
              <Text fontSize={"sm"}>Owner at Corsa Auto Rentals</Text>
            </Center>

            <Divider color={"white"} />

            <Center flexDir={"column"}>
              <Heading fontSize={"xl"}>Email Address</Heading>
              <Text fontSize={"md"}>ethan@ethanduran.com</Text>
            </Center>

            <Center gap={"1rem"} flexWrap={"wrap"}>
              <WhiteButton>Message</WhiteButton>
              <WhiteButton>Edit</WhiteButton>
              <WhiteButton>Documents</WhiteButton>
            </Center>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

const CustomersList = ({ customers }: { customers: Array<MemberDocType> }) => {
  return (
    <Flex
      flex={3}
      width={"100%"}
      height={"100vh"}
      maxH={"100vh"}
      minHeight={"100vh"}
      flexDir={"column"}
      gap={"1rem"}
      p={"1rem"}
      py={0}
    >
      <Flex
        flexDir={"column"}
        gap={"1rem"}
        overflowY={"auto"}
        flexBasis={"90%"}
      >
        {customers.map((customer, idx) => {
          return <CustomerData customer={customer} key={idx} />;
        })}
      </Flex>
      <Flex flexBasis={"17%"}>
        <WhiteButton>1</WhiteButton>
      </Flex>
    </Flex>
  );
};

const CustomerData = ({ customer }: { customer: MemberDocType }) => {
  if (customer.deleted) return <></>;

  return (
    <Flex
      background="var(--grey-color)"
      padding="1rem"
      gap="1.5rem"
      flexDir="row"
      rounded="lg"
      cursor={"pointer"}
    >
      <Avatar size="md" name={`${customer.name}_avatar`} src={customer.photo} />
      <Stack spacing={0}>
        <Text fontSize="lg" whiteSpace="nowrap">
          {customer.name}
        </Text>
        <Text fontSize="xs" whiteSpace="nowrap">
          {customer.mobile}
        </Text>
      </Stack>

      <Flex gap="1rem" marginLeft="auto">
        {["Vehicles", "Payments", "Referrals"].map((title, idx) => {
          return (
            <Stack key={idx} spacing={0} textAlign="center">
              <Text fontWeight="bold">{title}</Text>
              <Text fontWeight="bold">20</Text>
            </Stack>
          );
        })}
      </Flex>
    </Flex>
  );
};
