import { PaymentDocType } from '@/lib/firebase_docstype';
import {
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   TableContainer,
   Button,
   Flex,
   Box,
   Heading,
   Input,
   Spinner,
   Center,
   Badge
} from '@chakra-ui/react';
import WhiteButton from '../design/WhiteButton';
import Link from 'next/link';
import { ROUTING } from '@/util/constant';
import { useRouter } from 'next/router';

export default function RecentPayments({ payments }: { payments: Array<PaymentDocType> }) {
   const router = useRouter();

   return (
      <>
         <Flex p={'1rem'} width={'100%'} height={'100%'} flexDir={'column'}>
            <Flex width={'100%'}>
               <Heading fontSize={'2xl'}>Recent Payments</Heading>
               <Box marginLeft={'auto'}>
                  <Input placeholder="Search anything" size={'sm'} />
               </Box>
            </Flex>

            {false ? (
               <Center flex={1}>
                  <Spinner />
               </Center>
            ) : (
               <UsersPaymentTables payments={payments} />
            )}

            <WhiteButton onClick={() => router.push(ROUTING.payments)}>
               See All Payments
            </WhiteButton>
         </Flex>
      </>
   );
}

const UsersPaymentTables = ({ payments }: { payments: Array<PaymentDocType> }) => {
   return (
      <>
         <TableContainer flex={1} overflowY={'auto'} p={2} my={2}>
            <Table variant="unstyled" size={'sm'} colorScheme="gray">
               <Thead>
                  <Tr>
                     <Th>Name</Th>
                     <Th>Date</Th>
                     <Th isNumeric>Amount</Th>
                     <Th>Status</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {payments.map((payment, idx) => {
                     
                     return (
                        <Tr key={idx}>
                           <Td>{payment.sender}</Td>
                           <Td>{new Date(payment.timestamp * 10000).toDateString()}</Td>
                           <Td>${payment.amount}</Td>
                           <Td>
                              <Badge
                                 colorScheme={payment.status ? 'green' : 'red'}
                                 fontSize={'x-small'}
                              >
                                 Deposited
                              </Badge>
                           </Td>
                        </Tr>
                     );
                  })}
               </Tbody>
            </Table>
         </TableContainer>
      </>
   );
};
