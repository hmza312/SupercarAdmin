import {
   Flex,
   Heading,
   Stack,
   Text,
   Avatar,
   Center,
   Divider,
   useMediaQuery,
   useDisclosure
} from '@chakra-ui/react';
import ContentHeader from './design/ContentHeader';
import WhiteButton from './design/WhiteButton';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getDocs } from 'firebase/firestore';
import { membersColRef, paymentsColRef, vehiclesColRef } from '@/lib/firebase';
import { MemberDocType, PaymentDocType, VehicleDocType } from '@/lib/firebase_docstype';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import DrawerWrapper from './design/Drawer';
import usePagination from '@/lib/hooks/usePagination';
import { usePaginator } from 'chakra-paginator';
import Pagination from './design/Pagination';

const pageQt = 15;

export default function Customers() {
   const [customerCount] = useDocsCount(membersColRef);
   const [customers, setCustomers] = useState<Array<MemberDocType>>([]);
   const [selectedCustomer, setSelectedCustomer] = useState<MemberDocType | null>(null);

   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   const { isOpen, onOpen, onClose } = useDisclosure();

   const [customersToShow, paginationIndices, setActiveIdx] = usePagination<MemberDocType>(
      customers,
      pageQt
   );

   const { currentPage, setCurrentPage } = usePaginator({
      total: paginationIndices.length,
      initialState: {
         pageSize: pageQt,
         currentPage: 1
      }
   });

   useEffect(() => {
      const fetchCustomers = async () => {
         const customersDocs = await getDocs(membersColRef);

         const [paymentsDocs, vehiclesDocs] = await Promise.all([
            new Promise<Array<PaymentDocType>>((resolve) => {
               getDocs(paymentsColRef).then((snapshot) => {
                  const docs = snapshot.docs.map((d) => d.data()) as Array<PaymentDocType>;
                  resolve(docs);
               });
            }),
            new Promise<Array<VehicleDocType>>((resolve) => {
               getDocs(vehiclesColRef).then((snapshot) => {
                  const docs = snapshot.docs.map((d) => d.data()) as Array<VehicleDocType>;
                  resolve(docs);
               });
            })
         ]);

         setCustomers(
            customersDocs.docs.map((d) => {
               return {
                  ...d.data(),
                  uid: d.id,
                  payments: paymentsDocs.filter((p) => p.recipient == d.id),
                  vehicles: vehiclesDocs.filter((v) => v.owner == d.id)
               };
            }) as Array<MemberDocType>
         );
      };

      fetchCustomers();
   }, []);

   const topRef = useRef<any>(null);

   return (
      <Flex width="100%" flexDir="column" gap="1rem" height="100%" ref={topRef}>
         <ContentHeader description="" heading={`Total Customers (${customerCount})`} />
         <Flex gap="0.3rem">
            <CustomersList
               customers={customersToShow}
               onSelect={setSelectedCustomer}
               onOpenDrawer={onOpen}
               handlePageChange={(i) => {
                  setActiveIdx(i);
                  (topRef.current as HTMLElement)?.scrollIntoView({
                     behavior: 'smooth'
                  });
               }}
               pageCounts={paginationIndices.length}
            />
            {isUnder850 ? (
               <DrawerWrapper isOpen={isOpen} onClose={onClose}>
                  <CustomerProfile customer={selectedCustomer} />
               </DrawerWrapper>
            ) : (
               <CustomerProfile customer={selectedCustomer} />
            )}
         </Flex>
      </Flex>
   );
}

const CustomerProfile = ({ customer }: { customer: MemberDocType | null }) => {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   if (!customer) return <></>;

   return (
      <Flex
         flex={1}
         bg={isUnder850 ? 'var(--bg-color)' : 'var(--grey-color)'}
         rounded="lg"
         height={'auto'}
         justifyContent={'center'}
         padding={'1rem'}
      >
         <Flex py={'2rem'} flexDir={'column'} alignContent={'center'} gap={'1rem'}>
            <Center>
               <Avatar size="xl" name={`${customer.name}_avatar`} src={`${customer.photo}`} />
            </Center>
            <Center flexDir={'column'}>
               <Heading fontSize={'xl'}>{customer.name}</Heading>
               <Text fontSize={'sm'}>{customer.occupation}</Text>
            </Center>

            <Divider color={'white'} />

            <Center flexDir={'column'}>
               <Heading fontSize={'xl'}>Email Address</Heading>
               <Text fontSize={'md'}>{customer.email}</Text>
            </Center>

            <Center gap={'1rem'} flexWrap={'wrap'}>
               <WhiteButton>Message</WhiteButton>
               <WhiteButton>Edit</WhiteButton>
               <WhiteButton>Documents</WhiteButton>
            </Center>
         </Flex>
      </Flex>
   );
};

const CustomersList = ({
   customers,
   onSelect,
   onOpenDrawer,
   pageCounts,
   handlePageChange
}: {
   customers: Array<MemberDocType>;
   onSelect: Dispatch<SetStateAction<MemberDocType | null>>;
   onOpenDrawer: () => void;
   pageCounts: number;
   handlePageChange: (page: number) => void;
}) => {
   const [isUnder850] = useMediaQuery('(max-width: 850px)');
   return (
      <Flex
         flex={isUnder850 ? 1 : 3}
         width={'100%'}
         height={'100vh'}
         maxH={'100vh'}
         minHeight={'100vh'}
         flexDir={'column'}
         gap={'1rem'}
         p={isUnder850 ? '0rem' : '1rem'}
         py={0}
      >
         <Flex
            flexDir={'column'}
            gap={'1rem'}
            overflowY={isUnder850 ? 'initial' : 'auto'}
            flexBasis={isUnder850 ? '100%' : '90%'}
         >
            {customers.map((customer, idx) => {
               return (
                  <CustomerData
                     customer={customer}
                     key={idx}
                     onClick={() => {
                        onSelect(customer);
                        onOpenDrawer();
                     }}
                  />
               );
            })}
         </Flex>
         <Flex flexBasis={'17%'} alignSelf={'flex-end'}>
            <Pagination pageCounts={pageCounts} handlePageChange={handlePageChange} />
         </Flex>
      </Flex>
   );
};

const CustomerData = ({ customer, onClick }: { customer: MemberDocType; onClick: () => void }) => {
   const [isUnder500] = useMediaQuery('(max-width: 500px)');
   if (customer.deleted) return <></>;

   return (
      <Flex
         background="var(--grey-color)"
         padding="1rem"
         gap="1.5rem"
         flexDir="row"
         rounded="lg"
         cursor={'pointer'}
         onClick={onClick}
         overflowX={isUnder500 ? 'auto' : 'initial'}
         minH={isUnder500 ? '5rem' : 'initial'}
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
               <Text fontWeight="bold">{`${
                  customer.vehicles ? customer.vehicles.length : 0
               }`}</Text>
            </Stack>
            <Stack spacing={0} textAlign="center">
               <Text fontWeight="bold">{`Payments`}</Text>
               <Text fontWeight="bold">{`${
                  customer.payments ? customer.payments.length : 0
               }`}</Text>
            </Stack>
            <Stack spacing={0} textAlign="center">
               <Text fontWeight="bold">{`Referrals`}</Text>
               <Text fontWeight="bold">{`${0}`}</Text>
            </Stack>
         </Flex>
      </Flex>
   );
};
