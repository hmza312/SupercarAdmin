import {
  Flex,
  Heading,
  Stack,
  Text,
  Avatar,
  Center,
  Divider,
} from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import WhiteButton from "./design/WhiteButton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getCountFromServer, getDocs } from "firebase/firestore";
import { articlesColRef, membersColRef, paymentsColRef, vehiclesColRef } from "@/lib/firebase";
import { MemberDocType, PaymentDocType, VehicleDocType } from "@/lib/firebase_docstype";

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
      const paymentsDocs = (await getDocs(paymentsColRef)).docs.map(d=>d.data()) as Array<PaymentDocType>;
      const vehiclesDocs = (await getDocs(vehiclesColRef)).docs.map (d=>d.data()) as Array<VehicleDocType>;

      setCustomers(
        customersDocs.docs.map((d) =>{ 
          return ({...d.data(), 
            uid: d.id, 
            payments: paymentsDocs.filter (p=> p.recipient == d.id),
            vehicles: vehiclesDocs.filter (v => v.owner == d.id)
          })
        }) as Array<MemberDocType>
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
        <CustomersList customers={customers} onSelect={setSelectedCustomer}/>
        <CustomerProfile customer={selectedCustomer}/>
      </Flex>
    </Flex>
  );
}

const CustomerProfile = ({ customer }: { customer: MemberDocType | null}) => {

  if (!customer) return <></>;
  
  return <Flex
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
          name={`${customer.name}_avatar`}
          src= {`${customer.photo}`}
        />
      </Center>
      <Center flexDir={"column"}>
        <Heading fontSize={"xl"}>{customer.name}</Heading>
        <Text fontSize={"sm"}>{customer.occupation}</Text>
      </Center>

      <Divider color={"white"} />

      <Center flexDir={"column"}>
        <Heading fontSize={"xl"}>Email Address</Heading>
        <Text fontSize={"md"}>{customer.email}</Text>
      </Center>

      <Center gap={"1rem"} flexWrap={"wrap"}>
        <WhiteButton>Message</WhiteButton>
        <WhiteButton>Edit</WhiteButton>
        <WhiteButton>Documents</WhiteButton>
      </Center>
    </Flex>
  </Flex>
}

const CustomersList = (
  { customers, onSelect }: 
  { customers: Array<MemberDocType>, onSelect: Dispatch<SetStateAction<MemberDocType | null>> }
) => {
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
          return <CustomerData customer={customer} key={idx} onClick={()=>{
            onSelect(customer);
          }}/>;
        })}
      </Flex>
      <Flex flexBasis={"17%"}>
        <WhiteButton>1</WhiteButton>
      </Flex>
    </Flex>
  );
};

const CustomerData = ({ customer, onClick }: { customer: MemberDocType, onClick: ()=> void }) => {
  if (customer.deleted) return <></>;
  
  return (
    <Flex
      background="var(--grey-color)"
      padding="1rem"
      gap="1.5rem"
      flexDir="row"
      rounded="lg"
      cursor={"pointer"}
      onClick={onClick}
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
      <Stack spacing={0} textAlign="center">
              <Text fontWeight="bold">{`Vehicles`}</Text>
              <Text fontWeight="bold">{`${customer.vehicles ? customer.vehicles.length : 0}`}</Text>
        </Stack>
        <Stack spacing={0} textAlign="center">
              <Text fontWeight="bold">{`Payments`}</Text>
              <Text fontWeight="bold">{`${customer.payments ? customer.payments.length : 0}`}</Text>
        </Stack>
        <Stack spacing={0} textAlign="center">
              <Text fontWeight="bold">{`Referrals`}</Text>
              <Text fontWeight="bold">{`${0}`}</Text>
        </Stack>
      </Flex>
    </Flex>
  );
};
