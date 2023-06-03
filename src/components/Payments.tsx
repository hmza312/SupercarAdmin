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
   Box
} from '@chakra-ui/react';
import WhiteButton from './design/WhiteButton';
import { ViewIcon } from '@chakra-ui/icons';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import { getDocData, membersColRef, paymentsColRef, vehiclesColRef } from '@/lib/firebase';
import { PaymentDocType } from '@/lib/firebase_docstype';
import { useEffect, useRef, useState } from 'react';
import { getDocs } from 'firebase/firestore';
import Pagination from './design/Pagination';
import { usePaginator } from 'chakra-paginator';
import usePagination from '@/lib/hooks/usePagination';
import PaymentContentHeader from './design/PaymentContentHeader';
import DropDown from './design/DropDown';

const pageQt = 15;

interface PaymentStatus
{
   title: string;
   status: number
}

const paymentStatus: Array<PaymentStatus> = [
   { title: "Pending", status: 0 },
   { title: "confirmed", status: 1 },
   { title: "Deposited", status: 2 },
   { title: "Denied", status: 3 },
   { title: "all", status: 4}
]

export default function Payments() {
   const [paymentsCount] = useDocsCount(paymentsColRef);
   const [payments, setPayments] = useState<Array<PaymentDocType>>([]);
   const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | null>(null)

   useEffect(() => {

      
      const fetchPayments = async () => {
         const paymentsDocs = await getDocs(paymentsColRef);
         
         const data = await Promise.all((paymentsDocs.docs.map (d=> d.data()) as Array<PaymentDocType>)
         .map(async (p) => {
            const userPromise = getDocData(membersColRef, p.recipient);
            const vehiclePromise = getDocData(vehiclesColRef, p.vehicle);
            const [user_data, vehicle_data] = await Promise.all([userPromise, vehiclePromise]);

            return ({...p, 
               user_data,
               vehicle_data
            })
         }));
         
         setPayments(data as Array<PaymentDocType>);
      };
      
      fetchPayments();
   }, []);

   const [under800] = useMediaQuery('(max-width: 800px)');

   const [requestsToShow, paginationIndices, setActiveIdx] = usePagination<PaymentDocType>(
      payments.filter (p=> {
         return selectedStatus == null ? true : p.status == selectedStatus.status;
      }),
      pageQt
   );
   
   const { currentPage, setCurrentPage } = usePaginator({
      total: paginationIndices.length,
      initialState: {
         pageSize: pageQt,
         currentPage: 1
      }
   });

   const topRef = useRef<any>(null);

   return (
      <Flex width="100%" flexDir="column" gap="1rem" height="100%" pb={'2rem'} ref={topRef}>
         <PaymentContentHeader 
            heading={`All Payments (${payments.filter (p=> selectedStatus == null ? true : p.status == selectedStatus.status).length})`} 
            description="" 
         />
         <Flex p={'0.5rem'} gap={'1rem'} width={'100%'}>
            <Box ml={'auto'}>
               <DropDown
                  menuTitle={selectedStatus == null ? 'Select Payment Status' : selectedStatus.title}
                  menuItems={paymentStatus.map(p=> p.title)}
                  onSelected={(item) => {
                     if (item === "all") setSelectedStatus(null);
                     else setSelectedStatus(paymentStatus.filter (p => p.title == item)[0])
                  }}
               />
            </Box>
         </Flex>
         <Flex
            flex={3}
            width={'100%'}
            minHeight={'90vh'}
            flexDir={'column'}
            gap={'1rem'}
            p={under800 ? '0.5rem' : '1rem'}
            py={0}
            bg={'var(--grey-color)'}
            rounded={'lg'}
         >
            <Flex flexDir={'column'} gap={'1rem'} overflowY={'auto'} flexBasis={'90%'}>
               <PaymentsTable payments={requestsToShow} />
            </Flex>
            <Flex flexBasis={'17%'} alignSelf={'flex-end'}>
               <Box>
                  <Pagination
                     pageCounts={paginationIndices.length}
                     handlePageChange={(page) => {
                        setActiveIdx(page);
                        (topRef.current as HTMLElement)?.scrollIntoView({
                           behavior: 'smooth'
                        });
                     }}
                  />
               </Box>
            </Flex>
         </Flex>
      </Flex>
   );
}

const PaymentsTable = ({ payments }: { payments: Array<PaymentDocType> }) => {
   const [under800] = useMediaQuery('(max-width: 800px)');

   return (
      <TableContainer p={under800 ? '0.2rem' : '1rem'} overflowY={'auto'}>
         <Table variant="unstyled" size={'sm'}>
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
                           <Flex flexDir={'row'} gap={'0.3rem'}>
                              {payment.user_data ? (
                                 <Avatar
                                    size="sm"
                                    name={`${payment.user_data.name}_avatar`}
                                    src={payment.user_data.photo}
                                 />
                              ) : (
                                 <Avatar size="sm" border={'1px solid white'} />
                              )}

                              <Center>
                                 {payment.user_data ? (
                                    <Text textAlign={'center'}>{payment.user_data.name}</Text>
                                 ) : (
                                    <Text textAlign={'center'}>UnKnown</Text>
                                 )}
                              </Center>
                           </Flex>
                        </Td>
                        <Td>{new Date(payment.timestamp * 1000).toDateString()}</Td>
                        {payment.vehicle_data ? <Td>{payment.vehicle_data.title}</Td> : <Td>UnKnown</Td>}  
                        <Td>${payment.amount}</Td>
                        <Td>
                           {payment.status == 0 && <Badge colorScheme="yellow">Pending</Badge>}
                           {payment.status == 1 && <Badge colorScheme="green">confirmed</Badge>}
                           {payment.status == 2 && <Badge colorScheme="green">Deposited</Badge>}
                           {payment.status == 3 && <Badge colorScheme="red">Denied</Badge>}
                        </Td>
                        <Td>
                           <WhiteButton size={'sm'}>
                              <ViewIcon mr={'0.3rem'} />
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
