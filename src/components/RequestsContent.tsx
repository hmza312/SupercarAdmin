import {
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  Avatar,
  Box,
  Center,
  Divider,
} from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import WhiteButton from "./design/WhiteButton";
import OrangeButton from "./design/OrangeButton";
import { useDocsCount } from "@/lib/hooks/useDocsCount";
import { callsColRef } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";
import { RequestDocType } from "@/lib/firebase_docstype";

export default function RequestsContent() {
  const [requestsCount] = useDocsCount(callsColRef);
  const [requests, setRequests] = useState<Array<RequestDocType>>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestDocs = await getDocs(callsColRef);
      setRequests(
        requestDocs.docs.map((d) => d.data()) as Array<RequestDocType>
      );
    };

    fetchRequests();
  }, []);

  return (
    <Flex width="100%" flexDir="column" gap="1rem" height="100%">
      <ContentHeader
        description="Use the chatroom to discuss payments and other client relations"
        heading={`Help Requests (${requestsCount})`}
      />
      <Flex gap="0.3rem">
        <CustomersList requests={requests} />
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

const CustomersList = ({ requests }: { requests: Array<RequestDocType> }) => {
  console.log(requests);
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
        {requests.map((req, idx) => {
          return <CustomerData key={idx} request={req} />;
        })}
      </Flex>
      <Flex flexBasis={"17%"}>
        <WhiteButton>1</WhiteButton>
      </Flex>
    </Flex>
  );
};

const CustomerData = ({ request }: { request: RequestDocType }) => {
  return (
    <Flex
      background="var(--grey-color)"
      padding="1rem"
      gap="1.5rem"
      flexDir="row"
      rounded="lg"
    >
      <Avatar size="md" name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
      <Stack spacing={0}>
        <Text fontSize="lg" whiteSpace="nowrap">
          {request.user_name}
        </Text>
        <Text fontSize="xs" whiteSpace="nowrap">
          {request.user_mobile}
        </Text>
      </Stack>

      <Flex gap="1rem" marginLeft="auto">
        {/* {["Vehicles", "Payments", "Referrals"].map((title, idx) => {
          return (
            <Stack key={idx} spacing={0} textAlign="center">
              <Text fontWeight="bold">{title}</Text>
              <Text fontWeight="bold">20</Text>
            </Stack>
          );
        })} */}
        <OrangeButton>Message</OrangeButton>
        <WhiteButton>Other</WhiteButton>
        <WhiteButton>Close</WhiteButton>
      </Flex>
    </Flex>
  );
};
