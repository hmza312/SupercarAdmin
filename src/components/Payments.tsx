import {
  Avatar,
  Badge,
  Center,
  Text,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  Box,
} from "@chakra-ui/react";
import WhiteButton from "./design/WhiteButton";
import ContentHeader from "./design/ContentHeader";
import { ViewIcon } from "@chakra-ui/icons";
import { useDocsCount } from "@/lib/hooks/useDocsCount";
import { paymentsColRef } from "@/lib/firebase";
import { PaymentDocType } from "@/lib/firebase_docstype";
import { useEffect, useState } from "react";
import { getDocs } from "firebase/firestore";

export default function Payments() {
  const [paymentsCount] = useDocsCount(paymentsColRef);
  const [payments, setPayments] = useState<Array<PaymentDocType>>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const paymentsDocs = await getDocs(paymentsColRef);
      setPayments(
        paymentsDocs.docs.map((d) => d.data()) as Array<PaymentDocType>
      );
    };

    fetchPayments();
  }, []);

  return (
    <Flex width="100%" flexDir="column" gap="1rem" height="100%" pb={"2rem"}>
      <ContentHeader
        heading={`All Payments (${paymentsCount})`}
        description=""
      />
      <Flex
        flex={3}
        width={"100%"}
        minHeight={"90vh"}
        flexDir={"column"}
        gap={"1rem"}
        p={"1rem"}
        py={0}
        bg={"var(--grey-color)"}
        rounded={"lg"}
      >
        <Flex
          flexDir={"column"}
          gap={"1rem"}
          overflowY={"auto"}
          flexBasis={"90%"}
        >
          <PaymentsTable payments={payments} />
        </Flex>
      </Flex>
    </Flex>
  );
}

const PaymentsTable = ({ payments }: { payments: Array<PaymentDocType> }) => {
  const [under800] = useMediaQuery("(max-width: 800px)");

  return (
    <TableContainer p={under800 ? "0.2rem" : "1rem"} overflowY={"auto"}>
      <Table variant="unstyled" size={"sm"}>
        <Thead>
          <Tr>
            <Th>Customer</Th>
            <Th>Date Processed</Th>
            <Th>Vehicle</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payments.map((payment, i) => {
            return (
              <Tr key={i}>
                <Td>
                  <Flex flexDir={"row"} gap={"0.3rem"}>
                    <Avatar
                      size="sm"
                      name="Kent Dodds"
                      src="https://bit.ly/kent-c-dodds"
                    />
                    <Center>
                      <Text textAlign={"center"}>Kent C Dodds</Text>
                    </Center>
                  </Flex>
                </Td>
                <Td>{new Date(payment.timestamp * 1000).toDateString()}</Td>
                <Td>2021 Lamborghini Urus</Td>
                <Td>{payment.amount}</Td>
                <Td>
                  <Badge colorScheme="green">Deposited</Badge>
                </Td>
                <Td>
                  <WhiteButton size={"sm"}>
                    <ViewIcon mr={"0.3rem"} />
                    View
                  </WhiteButton>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
