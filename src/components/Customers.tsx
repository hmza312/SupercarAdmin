import { Flex, Heading, Input, InputGroup, Stack, Text, Avatar, Box, Center, Divider } from "@chakra-ui/react";
import ContentHeader from "./design/ContentHeader";
import WhiteButton from "./design/WhiteButton";

export default function Customers() {
  return (
    <Flex width="100%" flexDir="column" gap="1rem" height="100%">
      <ContentHeader description="" heading="Total Customers (50)" />
      <Flex gap="0.1rem">
        <CustomersList />
        <Flex flex={1} bg="var(--grey-color)" rounded="lg" height={'auto'} justifyContent={'center'}>
            <Flex py = {'2rem'} flexDir={'column'} alignContent={'center'} gap={'1rem'}>
                <Center>
                    <Avatar size="xl" name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                </Center>
                <Center flexDir={'column'}>
                    <Heading fontSize={'xl'}>Kent C Dodds</Heading>
                    <Text fontSize={'sm'}>Owner at Corsa Auto Rentals</Text>
                </Center>

                <Divider color={'white'}/>

                <Center flexDir={'column'}>
                    <Heading fontSize={'xl'}>Email Address</Heading>
                    <Text fontSize={'md'}>ethan@ethanduran.com</Text>
                </Center>

                <Center gap={'1rem'} flexWrap={'wrap'}>
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

const CustomersList = () => {
  return (
    <Flex flex={3} width={'100%'}>
      <Stack spacing={4} padding="1rem" width={'100%'} maxH={'100%'}>
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
        <CustomerData />
      </Stack>
    </Flex>
  );
}

const CustomerData = ({ }) => {
  return (
    <Flex
      background="var(--grey-color)"
      padding="1rem"
      gap="1.5rem"
      flexDir="row"
      rounded="lg"
      overflowX="auto"
    >
      <Avatar size="md" name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
      <Stack spacing={0}>
        <Text fontSize="lg" whiteSpace="nowrap">
          Kent C Dodds
        </Text>
        <Text fontSize="xs" whiteSpace="nowrap">
          +92 311 6287297
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
}
