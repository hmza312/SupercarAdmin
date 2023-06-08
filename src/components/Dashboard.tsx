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
import { getDocData, membersColRef, paymentsColRef, vehiclesColRef } from '@/lib/firebase';
import { getDocs } from 'firebase/firestore';
import RecentPayments from './dashboard/RecentPayments';
import { MemberDocType, PaymentDocType, VehicleDocType } from '@/lib/firebase_docstype';
import Activity from './dashboard/Activity';
import ContentHeader from './design/ContentHeader';
import { useDocsCount } from '@/lib/hooks/useDocsCount';
import { ROUTING } from '@/util/constant';
import { calculatePercentageChange } from '@/util/helpers';
import { AsyncType } from '@/types/AsyncType';
import WaitList from './dashboard/WaitList';


const DashBoardContent = () => {
   const [totalCustomers] = useDocsCount(membersColRef);
   const [totalVehicles] = useDocsCount(vehiclesColRef);
   const [payments, setPayments] = useState<Array<PaymentDocType>>([]);
   
   const [users, setUsers] = useState<AsyncType<MemberDocType[]>> ({ loading: true, value: [] });
   const [vehicles, setVehicles] = useState<AsyncType<VehicleDocType[]>> ({ loading: true, value: [] });

   const [percentage, setPercentage] = useState({
      vehicles: 0, user: 0
   });


   useEffect(() => {
      const fetchRecentPayments = async () => {

          const [paymentsDocs, userDocs, vehicleDocs] = await Promise.all ([
            getDocs(paymentsColRef),
            getDocs(membersColRef), 
            getDocs(vehiclesColRef)
          ]);
           
          setUsers({value: (userDocs.docs.map((d)=> ({...d.data(), uid: d.id } as MemberDocType))) as MemberDocType[], loading: false });
          setVehicles({value: (vehicleDocs.docs.map(d=> ({...d.data(), id: d.id } as VehicleDocType))) as VehicleDocType[], loading: false });

         // const userDocs = await 
          const data = (paymentsDocs.docs.map((d) => d.data()) as Array<PaymentDocType>).map((p) => {
            const user_data = userDocs.docs.map (d=>d.data()).filter (d => d.id == p.recipient)[0] as MemberDocType;
            const vehicle_data = vehicleDocs.docs.map(d=>d.data()).filter(d => d.id == p.vehicle)[0] as VehicleDocType; 
            return { ...p, user_data, vehicle_data };
          });
          
         //  calculatePercentageChange()
          setPayments(data as Array<PaymentDocType>);
      };

      fetchRecentPayments();
   }, []);

   useEffect(()=> {
      const percentageChange = calculatePercentageChange(users.value, vehicles.value);
      setPercentage({ user: percentageChange [0], vehicles: percentageChange[1] });
   }, [users, vehicles])

   const [isUnder850] = useMediaQuery('(max-width: 850px)');

   if (isUnder850)
      return (
         <FlexBoxLayout
            totalCustomers={totalCustomers}
            totalVehicles={totalVehicles}
            payments={payments}
            vehicles={vehicles.value}
            users={users.value}
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
               badgeStatus={percentage.user > 0? "green" : "red"}
               count={totalCustomers}
               percentage={`${(percentage.user > 0 ? `+${percentage.user}` : `${percentage.user}`)}%`}
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
               badgeStatus={percentage.user > 0? "green" : "red"}
               count={totalVehicles}
               percentage={`${(percentage.vehicles > 0 ? `+${percentage.vehicles}` : `${percentage.vehicles}`)}%`}
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
            <Analytics vehicles={vehicles.value}/>
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
            <WaitList users={users.value}/>
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
   payments,
   vehicles,
   users
}: {
   totalCustomers: number;
   totalVehicles: number;
   payments: Array<PaymentDocType>;
   vehicles: VehicleDocType[],
   users: MemberDocType[]
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
            <Analytics vehicles={vehicles}/>
         </Flex>

         {/*  recent payments */}
         <Flex width={'100%'} bg="var(--grey-color)" rounded={'xl'}>
            <RecentPayments payments={payments} />
         </Flex>

         {/* side bar */}
         <Flex width={'100%'} gap={'0.5rem'} flexDir={isUnder550 ? 'column' : 'row'}>
            <Flex bg="var(--grey-color)" rounded={'xl'} flex={1}>
               <WaitList useMobStyle={isUnder850} users={users}/>
            </Flex>
            <Flex bg="var(--grey-color)" rounded={'xl'} flex={1}>
               <Activity />
            </Flex>
         </Flex>

         <Flex my={'3rem'}></Flex>
      </Flex>
   );
};
