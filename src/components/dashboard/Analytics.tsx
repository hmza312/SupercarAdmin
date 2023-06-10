import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Analytics({ vehicles, payments }: { payments: PaymentDocType[], vehicles: VehicleDocType[] }) {
   const [isUnder500] = useMediaQuery("(max-width: 500px)")
   
   return (
      <>
         <Flex height={'100%'} width={'100%'} p={'0.5rem'} flexDir={'column'}>
            <Flex width={'100%'} gap={'1rem'} flexWrap={isUnder500 ? 'wrap' :'initial'} justifyContent={'center'}>
               <Heading fontSize={'2xl'}>Analytics</Heading>
               <Flex ml={isUnder500 ? 'initial' : 'auto'} gap={'1rem'}>
                  <Text>
                     <Flex p={'0.35rem'} mr={'0.2rem'} bg={'rgba(58, 111, 249, 1)'} rounded={'50%'} display={'inline-block'}>{' '}</Flex>
                     Vehicles
                  </Text>
                  <Text>
                     <Flex p={'0.35rem'} mr={'0.2rem'} bg={'rgba(100, 207, 246, 1)'} rounded={'50%'} display={'inline-block'}>{' '}</Flex>
                     Payments
                  </Text>
               </Flex>
            </Flex>
            <Box width={'100%'} height={'100%'} p={'0.1rem'}>
               <ChartSection vehicles={vehicles} payments={payments}/>
            </Box>
         </Flex>
      </>
   );
}

import { ApexOptions } from 'apexcharts';
import { countPaymentsByMonth, countVehicleByMonth } from '@/util/helpers';
import { MemberDocType, PaymentDocType, VehicleDocType } from '@/lib/firebase_docstype';

const options_initial: ApexOptions = {
   theme: {
      mode: 'dark'
   },
   chart: {
      id: 'apexchart-example',
      background: 'var(--grey-color)',
      toolbar: {
         show: false
      }
   },
   xaxis: {
      categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August']
   },
   colors: ['rgba(100, 207, 246, 1)', 'rgba(58, 111, 249, 1)'],
   dataLabels: {
      enabled: false
   },
   legend: {
      show: false
   },
   plotOptions: {
      bar: {
         columnWidth: '25%',
         rangeBarOverlap: true,
         rangeBarGroupRows: false,
         borderRadius: 3
      }
   },
   stroke: {
      colors: ['transparent'],
      width: 5
   }
};

const ChartSection = ({ vehicles, payments }: { vehicles: VehicleDocType[], payments: PaymentDocType[] }) => {
   

   
   const [series, setSeries] = useState([
      {
         name: 'Payments',
         data: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
         name: 'Vehicles',
         data: [0, 0, 0, 0, 0, 0, 0, 0]
      }
   ]);

   const [options, setOptions] = useState(options_initial); 

   useEffect(() => {
      const vehiclesCount = Object.values(countVehicleByMonth(vehicles));
      const paymentsCount = Object.values(countPaymentsByMonth(payments));
      const xAxis = Object.keys(countVehicleByMonth(vehicles)).map (m => m.slice(0, 3));

      setSeries([
         {
            name: 'Payments',
            data: paymentsCount
         }
         ,{
            name: 'Vehicles',
            data: vehiclesCount
      }]);

      setOptions({...options, xaxis: {
         categories: xAxis 
      }});

   }, [vehicles]);

   return (
      <>
         <Chart options={options}  series={series} type="bar" width={'100%'} height={'100%'} />
      </>
   );
};
