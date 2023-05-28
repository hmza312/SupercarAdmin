import { useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Analytics() {
  return (
    <>
      <Flex height={"100%"} width={"100%"} p={"0.5rem"} flexDir={"column"}>
        <Heading fontSize={"2xl"}>Analytics</Heading>
        <Box width={"100%"} height={"100%"} p={"0.1rem"}>
          <ChartSection />
        </Box>
      </Flex>
    </>
  );
}

import { ApexOptions } from "apexcharts";

const options: ApexOptions = {
  theme: {
    mode: "dark",
  },
  chart: {
    id: "apexchart-example",
    background: "var(--grey-color)",
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: ["January", "February", "March", "April", "May", "June"],
  },
  colors: ["rgba(100, 207, 246, 1)", "rgba(58, 111, 249, 1)"],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "25%",
      rangeBarOverlap: true,
      rangeBarGroupRows: false,
      borderRadius: 3,
    },
  },
  stroke: {
    colors: ["transparent"],
    width: 5,
  },
};

const ChartSection = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Sales",
        data: [21, 35, 75, 51, 41, 47],
      },
      {
        name: "Leads",
        data: [41, 79, 57, 47, 63, 71],
      },
    ],
  });

  return (
    <>
      <Chart
        options={options}
        series={state.series}
        type="bar"
        width={"100%"}
        height={"100%"}
      />
    </>
  );
};
