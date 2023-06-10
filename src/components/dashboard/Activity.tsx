import { Box, Flex, Heading } from '@chakra-ui/react';
import WhiteButton from '../design/WhiteButton';

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { ApexOptions } from 'apexcharts';

const options: ApexOptions = {
   chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      },
      height: 200
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['Average Results'],
}

export default function Activity() {
   return (
     <Flex p={"0.2rem"} flexDir={"column"} gap={"0.3rem"} height={"100%"}>
       <Heading fontSize={"2xl"}>Activity</Heading>
       <div>
         {/* <Chart options={options} series={[30]} type="radialBar" width={"100%"}  /> */}
       </div>
       <WhiteButton>View All Activity</WhiteButton> 
     </Flex>
   );
}
