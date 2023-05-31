import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Heading, Box, GridItem, Grid, Text, Button, useMediaQuery } from '@chakra-ui/react';

export default function Dashboard() {
   return (
      <>
         <Flex width={'100%'} flexDir={'column'} gap={'1rem'} height={'100%'}>
            {/* Top Header */}
            <ContentHeader
               heading="Welcome Back, Ethan 👋"
               description="Here’s an overview of your automation dashboard"
            />
            <DashBoardContent />
         </Flex>
      </>
   );
}

import { IoIosPeople } from 'react-icons/io';
import { AiFillCar } from 'react-icons/ai';

import StatSection from './dashboard/StatSection';
import Analytics from './dashboard/Analytics';
import { useEffect, useState } from 'react';
import { membersColRef, paymentsColRef, vehiclesColRef } from '@/lib/firebase';
import { getDocs } from 'firebase/firestore';
import RecentPayments from './dashboard/RecentPayments';
import { PaymentDocType } from '@/lib/firebase_docstype';
import Activity from './dashboard/Activity';
import ContentHeader from './design/ContentHeader';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import { ROUTING } from '@/util/constant';

const DashBoardContent = () => {
   const [totalCustomers] = useDocsCount(membersColRef);
   const [totalVehicles] = useDocsCount(vehiclesColRef);
   const [payments, setPayments] = useState<Array<PaymentDocType>>([]);

   useEffect(() => {
      const fetchRecentPayments = async () => {
         const paymentDocs = await getDocs(paymentsColRef);
         const res = paymentDocs.docs.map((d) => d.data()) as Array<PaymentDocType>;
         setPayments(res);
      };

      fetchRecentPayments();
   }, []);

   const [isUnder850] = useMediaQuery('(max-width: 850px)');

   if (isUnder850)
      return (
         <FlexBoxLayout
            totalCustomers={totalCustomers}
            totalVehicles={totalVehicles}
            payments={payments}
         />
      );

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
            rounded={'xl'}
         >
            <StatSection
               title="Total Customers"
               badgeStatus="green"
               count={totalCustomers}
               percentage="+12.9%"
               routeTo={ROUTING.customers}
            >
               <IoIosPeople style={{ fontSize: '2rem' }} />
            </StatSection>
         </GridItem>

         <GridItem
            gridColumn="3 / span 2"
            gridRow="1 / span 1"
            bg="var(--grey-color)"
            rounded={'xl'}
         >
            <StatSection
               routeTo={ROUTING.vehicles}
               title="Total Vehicles"
               badgeStatus="red"
               count={totalVehicles}
               percentage="+12.9%"
            >
               <AiFillCar style={{ fontSize: '2rem' }} />
            </StatSection>
         </GridItem>

         <GridItem
            gridColumn="1 / span 4"
            gridRow="2 / span 3" /* Update: Changed from "gridRow="2 / span 1"" */
            bg="var(--grey-color)"
            rounded={'xl'}
         >
            <Analytics />
         </GridItem>

         <GridItem
            gridColumn="1 / span 4"
            gridRow="5 / span 6" /* Update: Changed from "gridRow="3 / span 3"" */
            bg="var(--grey-color)"
            rounded={'xl'}
         >
            <RecentPayments payments={payments} />
         </GridItem>

         <GridItem gridColumn="5 / 7" gridRow="1 / span 5" bg="var(--grey-color)" rounded={'xl'}>
            <WaitList />
         </GridItem>

         <GridItem gridColumn="5 / 7" gridRow="6 / span 7" bg="var(--grey-color)" rounded={'xl'}>
            <Activity />
         </GridItem>
      </Grid>
   );
};

const FlexBoxLayout = ({
   totalCustomers,
   totalVehicles,
   payments
}: {
   totalCustomers: number;
   totalVehicles: number;
   payments: Array<PaymentDocType>;
}) => {
   const [isUnder550] = useMediaQuery('(max-width: 550px)');
   const [isUnder850] = useMediaQuery('(max-width: 850px');

   return (
      <Flex width={'100%'} flexDir={'column'} gap={'1rem'}>
         <Flex
            width={'100%'}
            gap={'1rem'}
            justifyContent={'center'}
            flexWrap={'wrap'}
            flexDir={isUnder550 ? 'column' : 'row'}
         >
            <Flex flex={1} bg="var(--grey-color)" rounded={'xl'}>
               <StatSection
                  title="Total Customers"
                  badgeStatus="green"
                  count={totalCustomers}
                  percentage="+12.9%"
                  routeTo={ROUTING.customers}
               >
                  <IoIosPeople style={{ fontSize: '2rem' }} />
               </StatSection>
            </Flex>
            <Flex flex={1} bg="var(--grey-color)" rounded={'xl'}>
               <StatSection
                  title="Total Vehicles"
                  badgeStatus="red"
                  count={totalVehicles}
                  percentage="+12.9%"
                  routeTo={ROUTING.vehicles}
               >
                  <AiFillCar style={{ fontSize: '2rem' }} />
               </StatSection>
            </Flex>
         </Flex>

         {/* graph */}
         <Flex width={'100%'} bg="var(--grey-color)" rounded={'xl'}>
            <Analytics />
         </Flex>

         {/*  recent payments */}
         <Flex width={'100%'} bg="var(--grey-color)" rounded={'xl'}>
            <RecentPayments payments={payments} />
         </Flex>

         {/* side bar */}
         <Flex width={'100%'} gap={'0.5rem'} flexDir={isUnder550 ? 'column' : 'row'}>
            <Flex bg="var(--grey-color)" rounded={'xl'} flex={1}>
               <WaitList useMobStyle={isUnder850} />
            </Flex>
            <Flex bg="var(--grey-color)" rounded={'xl'} flex={1}>
               <Activity />
            </Flex>
         </Flex>

         <Flex my={'3rem'}></Flex>
      </Flex>
   );
};

const WaitListPayment = () => {
   return (
      <>
         <Flex
            background={'var(--card-bg)'}
            rounded={'md'}
            p={'1rem'}
            flexDir={'column'}
            gap={'0.5rem'}
         >
            <Flex width={'100%'}>
               <Heading fontSize={'lg'}>Bruce Thomas</Heading>
               <Text fontSize={'sm'} marginLeft={'auto'}>{`${new Date().toDateString()}`}</Text>
            </Flex>
            <Box justifySelf={'flex-start'}>
               <Button background={'white'} color={'black'} size={'sm'}>
                  View Application
               </Button>
            </Box>
         </Flex>
      </>
   );
};

const WaitList = ({ useMobStyle }: { useMobStyle?: boolean } = { useMobStyle: false }) => (
   <Flex flexDir={'column'} width={'100%'} height={'100%'} gap={'1rem'} p={'1rem'}>
      <Heading fontSize={'2xl'}>Waitlist</Heading>

      <Box flexDir={'column'}>
         <Text>Pending Users</Text>
         <Text>10</Text>
      </Box>

      <Flex
         overflowY={'scroll'}
         flex={1}
         flexDir={'column'}
         gap={'0.5rem'}
         maxH={useMobStyle ? '20rem' : 'initial'}
      >
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
         <WaitListPayment />
      </Flex>

      <Button
         color={'black'}
         background={'var(--white-color)'}
         _hover={{ background: 'var(--white-color)' }}
      >
         See Full User Waitlist
      </Button>
   </Flex>
);
